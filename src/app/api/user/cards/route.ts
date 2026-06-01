import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserCards, getCards } from "@/lib/airtable";

export async function GET() {
  const session = await auth();
  
  if (!session?.user || !(session.user as any).discordId) {
    return NextResponse.json(
      { error: "Neautorizovaný přístup. Přihlaste se prosím přes Discord." },
      { status: 401 }
    );
  }

  const discordId = (session.user as any).discordId;

  try {
    // 1. Stáhnout seznam všech 12 karet ze hry
    const allCards = await getCards();
    
    // 2. Stáhnout karty, které daný uživatel reálně vlastní
    const ownedRecords = await getUserCards(discordId);

    // Vytvoříme rychlý lookup map pro okamžité vyhledávání vlastněné karty
    const ownedMap = new Map(ownedRecords.map(item => [item.card_id, item]));

    // 3. Provedeme server-side Join logiku pro sestavení plného profilu karet
    const cardsWithOwnership = allCards.map((card) => {
      const ownedDetail = ownedMap.get(card.card_id);
      const isOwned = !!ownedDetail;
      
      return {
        card_id: card.card_id,
        name: card.name,
        family: card.family,
        lore: card.lore,
        edition_type: card.edition_type,
        image_url: card.image_url,
        is_locked: card.is_locked,
        sort_order: card.sort_order,
        isOwned,
        obtained_at: ownedDetail?.obtained_at || null,
        obtained_via: ownedDetail?.obtained_via || null,
        user_edition: ownedDetail?.edition || null,
      };
    });

    const ownedCount = ownedRecords.length;
    const totalCount = allCards.length || 12;
    const completionPercent = Math.round((ownedCount / totalCount) * 100);

    return NextResponse.json({
      owned: cardsWithOwnership,
      total: totalCount,
      owned_count: ownedCount,
      completion_percent: completionPercent,
    });
  } catch (error) {
    console.error("[API user/cards] Chyba při zpracování:", error);
    return NextResponse.json(
      { error: "Nepodařilo se načíst osobní sbírku karet." },
      { status: 500 }
    );
  }
}
