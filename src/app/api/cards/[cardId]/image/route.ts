import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserCards } from "@/lib/airtable";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    // 1. Získání parametrů cesty a dotazu (očekáváme cardId a side)
    const { cardId } = await params;
    const { searchParams } = new URL(request.url);
    const side = searchParams.get("side") === "back" ? "back" : "front";

    // Bezpečnostní validace cardId k zamezení Directory Traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(cardId)) {
      return NextResponse.json(
        { error: "Neplatný formát identifikátoru karty." },
        { status: 400 }
      );
    }

    // 2. Ověření přihlášení uživatele (Discord OAuth session)
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Neautorizovaný přístup. Pro zobrazení karty se přihlaste." },
        { status: 401 }
      );
    }

    const discordId = (session.user as any).discordId;
    if (!discordId) {
      return NextResponse.json(
        { error: "Neplatná relace uživatele (chybí Discord ID)." },
        { status: 401 }
      );
    }

    // 3. Ověření vlastnictví karty přes Airtable
    const ownedRecords = await getUserCards(discordId);
    const ownsCard = ownedRecords.some((record) => record.card_id === cardId);

    if (!ownsCard) {
      return NextResponse.json(
        { error: "Tuto kartu nevlastníte. Získejte ji splněním úkolu." },
        { status: 403 }
      );
    }

    // 4. Vyhledání souboru na disku
    const filename = side === "back" ? `${cardId}_back.png` : `${cardId}.png`;
    const filePath = path.join(
      process.cwd(),
      "src",
      "secured-assets",
      "cards",
      filename
    );

    if (!fs.existsSync(filePath)) {
      console.warn(`[API Card Image] Soubor nenalezen: ${filePath}`);
      return NextResponse.json(
        { error: "Obrázek pro tuto kartu nebyl nalezen na serveru." },
        { status: 404 }
      );
    }

    // 5. Načtení a odeslání souboru
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=86400, must-revalidate", // Cache na 24h pro přihlášeného uživatele
      },
    });
  } catch (error) {
    console.error("[API Card Image] Neočekávaná chyba:", error);
    return NextResponse.json(
      { error: "Došlo k chybě při zpracování požadavku." },
      { status: 500 }
    );
  }
}
