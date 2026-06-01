import { NextResponse } from "next/server";
import { getCards } from "@/lib/airtable";

// Nastavení cache revalidace na 60 sekund na úrovni Next.js Route Segmentu
export const revalidate = 60;

export async function GET() {
  try {
    const cards = await getCards();
    return NextResponse.json(cards);
  } catch (error) {
    console.error("[API cards] Chyba při načítání:", error);
    return NextResponse.json(
      { error: "Při stahování seznamu karet došlo k chybě." },
      { status: 500 }
    );
  }
}
