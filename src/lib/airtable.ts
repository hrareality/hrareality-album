import Airtable from "airtable";

// Lazy inicializace Airtable klienta pro zamezení pádů během next build na CI/CD,
// kdy se zavaděč Next.js snaží staticky vyhodnotit moduly, ale nemá k dispozici ENV proměnné.
let baseInstance: any = null;

function getBase() {
  if (baseInstance) return baseInstance;

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    // Vrací bezpečný zástupný klient pro fázi buildu, který nevyvolá chybu v konstruktoru
    return new Airtable({ apiKey: "build_placeholder_key" }).base("build_placeholder_id");
  }

  baseInstance = new Airtable({ apiKey }).base(baseId);
  return baseInstance;
}

export interface AirtableUser {
  discord_id: string;
  username: string;
  discriminator: string;
  avatar_url: string;
  created_at: string;
}

export interface AirtableCard {
  card_id: string;
  name: string;
  family: "AWAKENING" | "POSTAVY_IWAU" | "GLITCH" | "RELICS" | string;
  lore: string;
  edition_type: "FIRST_EDITION" | "BASE" | string;
  image_url?: string;
  is_locked: boolean;
  sort_order: number;
}

export interface AirtableOwnedCard {
  discord_id: string;
  card_id: string;
  edition: "FIRST_EDITION" | "BASE" | string;
  obtained_at: string;
  obtained_via: string;
}

// 1. Získání uživatele podle discord_id
export async function getUser(discordId: string): Promise<AirtableUser | null> {
  try {
    const base = getBase();
    const records = await base("users")
      .select({
        filterByFormula: `{discord_id} = '${discordId}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) return null;

    const fields = records[0].fields;
    return {
      discord_id: fields.discord_id as string,
      username: fields.username as string,
      discriminator: (fields.discriminator as string) || "",
      avatar_url: (fields.avatar_url as string) || "",
      created_at: fields.created_at as string,
    };
  } catch (error) {
    console.error(`[Airtable] Error getting user ${discordId}:`, error);
    return null;
  }
}

// 2. Vytvoření nového uživatele
export async function createUser(userData: Omit<AirtableUser, "created_at">): Promise<AirtableUser | null> {
  try {
    const base = getBase();
    const createdRecords = await base("users").create([
      {
        fields: {
          discord_id: userData.discord_id,
          username: userData.username,
          discriminator: userData.discriminator,
          avatar_url: userData.avatar_url,
          created_at: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        },
      },
    ]);

    if (createdRecords.length === 0) return null;
    const fields = createdRecords[0].fields;
    return {
      discord_id: fields.discord_id as string,
      username: fields.username as string,
      discriminator: (fields.discriminator as string) || "",
      avatar_url: (fields.avatar_url as string) || "",
      created_at: fields.created_at as string,
    };
  } catch (error) {
    console.error(`[Airtable] Error creating user:`, error);
    return null;
  }
}

// 3. Získání všech 12 karet seřazených dle sort_order
export async function getCards(): Promise<AirtableCard[]> {
  try {
    const base = getBase();
    const records = await base("cards")
      .select({
        sort: [{ field: "sort_order", direction: "asc" }],
      })
      .all();

    return records.map((record: any) => {
      const fields = record.fields;
      return {
        card_id: fields.card_id as string,
        name: fields.name as string,
        family: fields.family as string,
        lore: fields.lore as string,
        edition_type: fields.edition_type as string,
        image_url: fields.image_url as string | undefined,
        is_locked: !!fields.is_locked,
        sort_order: Number(fields.sort_order),
      };
    });
  } catch (error) {
    console.error("[Airtable] Error getting cards:", error);
    return [];
  }
}

// 4. Získání vlastněných karet pro daného hráče
export async function getUserCards(discordId: string): Promise<AirtableOwnedCard[]> {
  try {
    const base = getBase();
    const records = await base("owned_cards")
      .select({
        filterByFormula: `{discord_id} = '${discordId}'`,
      })
      .all();

    return records.map((record: any) => {
      const fields = record.fields;
      return {
        discord_id: fields.discord_id as string,
        card_id: fields.card_id as string,
        edition: fields.edition as string,
        obtained_at: fields.obtained_at as string,
        obtained_via: fields.obtained_via as string,
      };
    });
  } catch (error) {
    console.error(`[Airtable] Error getting user cards for ${discordId}:`, error);
    return [];
  }
}

// 5. Přidání karty hráči (idempotentní zápis)
export async function grantCard(
  discordId: string,
  cardId: string,
  edition: "FIRST_EDITION" | "BASE" | string,
  obtainedVia: string
): Promise<{ success: boolean; message: string; alreadyOwned: boolean }> {
  try {
    const base = getBase();
    
    // Ověříme, zda uživatel kartu již nevlastní
    const existing = await base("owned_cards")
      .select({
        filterByFormula: `AND({discord_id} = '${discordId}', {card_id} = '${cardId}')`,
        maxRecords: 1,
      })
      .firstPage();

    if (existing.length > 0) {
      return {
        success: true,
        message: "Uživatel již tuto kartu vlastní.",
        alreadyOwned: true,
      };
    }

    // Ujistíme se, že uživatel v tabulce users existuje. Pokud ne, nelze mu kartu přiřadit skrze cizí klíč
    const userExists = await getUser(discordId);
    if (!userExists) {
      // Vytvoříme uživatelský profil s minimálními daty (placeholder, který se zaktualizuje při přihlášení)
      await createUser({
        discord_id: discordId,
        username: `DiscordUser_${discordId.slice(-4)}`,
        discriminator: "",
        avatar_url: "",
      });
    }

    // Zápis do tabulky owned_cards
    await base("owned_cards").create([
      {
        fields: {
          discord_id: discordId,
          card_id: cardId,
          edition: edition,
          obtained_at: new Date().toISOString().split("T")[0], // YYYY-MM-DD
          obtained_via: obtainedVia,
        },
      },
    ]);

    return {
      success: true,
      message: "Karta byla úspěšně připsána uživateli.",
      alreadyOwned: false,
    };
  } catch (error) {
    console.error(`[Airtable] Error granting card ${cardId} to ${discordId}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Chyba při komunikaci s databází.",
      alreadyOwned: false,
    };
  }
}
