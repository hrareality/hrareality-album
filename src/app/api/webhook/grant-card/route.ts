import { NextResponse } from "next/server";
import { grantCard } from "@/lib/airtable";

export async function POST(request: Request) {
  const secretHeader = request.headers.get("x-webhook-secret");
  const localSecret = process.env.WEBHOOK_SECRET;

  // 1. Zabezpečení webhooku tajným tokenem v hlavičce
  if (!localSecret || secretHeader !== localSecret) {
    return NextResponse.json(
      { error: "Neautorizovaný přístup. Neplatný webhook secret." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { discord_id, card_id, edition, obtained_via } = body;

    // 2. Důkladná validace vstupních dat
    if (!discord_id || typeof discord_id !== "string" || discord_id.trim().length === 0) {
      return NextResponse.json(
        { error: "Chybí nebo je neplatný parametr 'discord_id'." },
        { status: 400 }
      );
    }

    if (!card_id || typeof card_id !== "string" || card_id.trim().length === 0) {
      return NextResponse.json(
        { error: "Chybí nebo je neplatný parametr 'card_id'." },
        { status: 400 }
      );
    }

    if (!edition || !["FIRST_EDITION", "BASE"].includes(edition)) {
      return NextResponse.json(
        { error: "Parametr 'edition' musí být buď 'FIRST_EDITION' nebo 'BASE'." },
        { status: 400 }
      );
    }

    const obtainedVia = obtained_via || "webhook";

    // 3. Idempotentní přiřazení karty (grantCard se postará o kontrolu duplicity)
    const result = await grantCard(discord_id, card_id, edition, obtainedVia);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        already_owned: result.alreadyOwned,
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[API webhook/grant-card] Neočekávaná chyba:", error);
    return NextResponse.json(
      { error: "Během zpracování webhooku na serveru došlo k chybě." },
      { status: 500 }
    );
  }
}
