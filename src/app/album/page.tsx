import { auth, signOut } from "@/lib/auth";
import { getUserCards, getCards } from "@/lib/airtable";
import AlbumClient, { AlbumCard } from "./AlbumClient";
import { LogOut, Sparkles, Trophy, User } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Hra Reality | Moje Sbírka Artefaktů",
  description: "Osobní herní album a kronika získaných karet v rámci Season 0 — Awakening.",
  icons: {
    icon: "/icon.png",
  },
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
      <header className="sticky top-0 z-45 bg-[#060608]/80 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_12px_rgb(168,85,247)] animate-pulse" />
            <h1 className="font-display font-bold tracking-widest text-base sm:text-lg uppercase text-slate-100">
              HRA REALITY <span className="text-purple-400">ALBUM</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Profil Hráče */}
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 py-2 pl-3 pr-5 rounded-2xl">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-purple-500/20 shadow-md shrink-0"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <User size={16} className="text-purple-400" />
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-slate-100 truncate max-w-[120px] sm:max-w-[180px]">
                  {username}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider">
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
                className="p-3 sm:p-3.5 rounded-2xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/20 transition-all duration-300 shrink-0 cursor-pointer"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* DASHBOARD OBSAH */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-12 relative z-10">
        
        {/* STATISTIKY & PROGRESS BAR */}
        <section className="bg-[#0e0e12]/60 backdrop-blur-xl border border-purple-500/20 p-8 sm:p-10 md:p-12 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.03)] grid md:grid-cols-3 gap-8 sm:gap-10 items-center">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5 text-sm font-bold text-purple-400 uppercase tracking-widest">
              <Trophy size={16} />
              SBĚRATELSKÝ PROGRESS
            </div>
            
            <div className="flex items-baseline gap-2.5">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-100">
                {ownedCount} / {totalCount}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">
                artefaktů zkompletováno
              </span>
            </div>

            {/* Progress bar s barevným gradientem */}
            <div className="w-full bg-white/5 border border-white/5 h-6 rounded-full overflow-hidden p-1 mt-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center text-center md:text-left h-full">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1">
              CELKOVÉ DOKONČENÍ
            </span>
            <span className="text-5xl sm:text-6xl font-extrabold text-purple-400 font-display">
              {completionPercent}%
            </span>
            <p className="text-xs text-slate-400 mt-3 leading-normal">
              {ownedCount === totalCount ? (
                <span className="text-amber-400 font-semibold flex items-center justify-center md:justify-start gap-1">
                  <Sparkles size={12} className="shrink-0" /> Legenda! Všechny artefakty nalezeny.
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
        <section className="space-y-8">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-display text-base sm:text-lg font-bold tracking-widest text-slate-400 uppercase">
              MOJE KRONIKA KARET — SEASON 0
            </h3>
          </div>

          <AlbumClient cards={cardsWithOwnership} />
        </section>

      </main>
    </div>
  );
}
