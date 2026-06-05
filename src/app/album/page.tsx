import { auth, signOut } from "@/lib/auth";
import { getUserCards, getCards } from "@/lib/airtable";
import AlbumClient, { AlbumCard } from "./AlbumClient";
import { LogOut, Sparkles, Trophy, User } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Hra Reality | Moje Sbírka Artefaktů",
  description: "Osobní herní album a kronika získaných karet v rámci Season 0 — Awakening.",
};

export default async function AlbumPage() {
  const session = await auth();

  // Bezpečnostní redirect pro případ chybějící session (dvojitá ochrana k middleware)
  if (!session?.user) {
    redirect("/");
  }

  const discordId = (session.user as any).discordId || "";
  const username = (session.user as any).username || session.user.name || "Probuzený Hráč";
  const avatarUrl = (session.user as any).avatarUrl || session.user.image || "";

  // 1. Získat ze serveru seznam všech 12 karet ze hry
  const allCards = await getCards();
  
  // 2. Získat ze serveru karty, které tento konkrétní uživatel vlastní
  const ownedRecords = await getUserCards(discordId);

  // Vytvoření vyhledávacího mapu
  const ownedMap = new Map(ownedRecords.map(item => [item.card_id, item]));

  // 3. Propojení tabulek na straně serveru (SSR Join)
  const cardsWithOwnership: AlbumCard[] = allCards.map((card) => {
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

  // Vyhledání první nezískané karty pro motivační banner
  const nextUnownedCard = cardsWithOwnership.find(c => !c.isOwned);
  const nextCardName = nextUnownedCard ? nextUnownedCard.name : null;

  return (
    <div className="min-h-screen bg-[#060608] text-[#e2e8f0] font-sans pb-20 relative">
      {/* Glow na pozadí */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* FIXED HEADER */}
      <header className="sticky top-0 z-40 bg-[#060608]/80 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgb(168,85,247)] animate-pulse" />
            <h1 className="font-display font-bold tracking-widest text-sm sm:text-base uppercase text-slate-100">
              HRA REALITY <span className="text-purple-400">ALBUM</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Profil Hráče */}
            <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 py-1.5 pl-2.5 pr-4 rounded-xl">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-purple-500/20 shadow-md shrink-0"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <User size={14} className="text-purple-400" />
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-100 truncate max-w-[100px] sm:max-w-[150px]">
                  {username}
                </span>
                <span className="text-[9px] font-semibold text-slate-500 tracking-wider">
                  HRÁČ S0
                </span>
              </div>
            </div>

            {/* Logout button (NextAuth Server Action) */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                title="Odhlásit se"
                className="p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/20 transition-all duration-300 shrink-0 cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* DASHBOARD OBSAH */}
      <main className="max-w-5xl mx-auto px-4 mt-8 sm:mt-12 space-y-8 relative z-10">
        
        {/* STATISTIKY & PROGRESS BAR */}
        <section className="bg-[#0e0e12]/60 backdrop-blur-xl border border-purple-500/20 p-6 sm:p-8 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.02)] grid md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest">
              <Trophy size={14} />
              SBĚRATELSKÝ PROGRESS
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-100">
                {ownedCount} / {totalCount}
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                artefaktů zkompletováno
              </span>
            </div>

            {/* Progress bar s barevným gradientem */}
            <div className="w-full bg-white/5 border border-white/5 h-4.5 rounded-full overflow-hidden p-0.5 mt-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-center text-center md:text-left h-full">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">
              CELKOVÉ DOKONČENÍ
            </span>
            <span className="text-4xl font-extrabold text-purple-400 font-display">
              {completionPercent}%
            </span>
            <p className="text-[10px] text-slate-400 mt-2 leading-normal">
              {ownedCount === totalCount ? (
                <span className="text-amber-400 font-semibold flex items-center justify-center md:justify-start gap-1">
                  <Sparkles size={10} /> Legenda! Všechny artefakty nalezeny.
                </span>
              ) : nextCardName ? (
                <>Další výzva: získej kartu <strong className="text-slate-300 font-semibold">{nextCardName}</strong></>
              ) : (
                "Pokračuj v plnění questů a sbírej body."
              )}
            </p>
          </div>
        </section>

        {/* INTERAKTIVNÍ GRID KARET */}
        <section className="space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-display text-sm font-bold tracking-widest text-slate-400 uppercase">
              MOJE KRONIKA KARET — SEASON 0
            </h3>
          </div>

          <AlbumClient cards={cardsWithOwnership} />
        </section>

      </main>
    </div>
  );
}
