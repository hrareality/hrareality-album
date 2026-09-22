import { auth, signOut } from "@/lib/auth";
import { getUserCards } from "@/lib/airtable";
import AlbumClient, { AlbumCard } from "./AlbumClient";
import { SEASON_0_CARDS, FOUNDERS_CARDS } from "@/lib/cardsData";
import { LogOut, Sparkles, Trophy, User } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "iWau HRA REALITY | Moje Sbírka Artefaktů",
  description: "Osobní herní album a kronika získaných karet v rámci Season 0 — Awakening a Founders Membership.",
  icons: {
    icon: "/icon.png",
  },
};

export default async function AlbumPage() {
  const session = await auth();

  // Bezpečnostní redirect pro případ chybějící session
  if (!session?.user) {
    redirect("/");
  }

  const discordId = (session.user as any).discordId || "";
  const username = (session.user as any).username || session.user.name || "Probuzený Hráč";
  const avatarUrl = (session.user as any).avatarUrl || session.user.image || "";

  // 1. Získat ze serveru karty, které tento konkrétní uživatel vlastní z Airtable
  const ownedRecords = await getUserCards(discordId);

  // Vytvoření vyhledávacího mapu vlastněných záznamů podle card_id
  const ownedMap = new Map(ownedRecords.map(item => [item.card_id, item]));

  // 2. Propojení Season 0 karet s reálným stavem vlastnictví
  const season0CardsWithOwnership: AlbumCard[] = SEASON_0_CARDS.map((card) => {
    const ownedDetail = ownedMap.get(card.card_id);
    const isOwned = !!ownedDetail;

    return {
      ...card,
      isOwned,
      obtained_at: ownedDetail?.obtained_at || null,
      obtained_via: ownedDetail?.obtained_via || card.myJourney.obtainedFor,
      user_edition: ownedDetail?.edition || card.edition,
    };
  });

  // 3. Propojení Founders karet s reálným stavem vlastnictví
  const foundersCardsWithOwnership: AlbumCard[] = FOUNDERS_CARDS.map((card) => {
    const ownedDetail = ownedMap.get(card.card_id);
    const isOwned = !!ownedDetail;

    return {
      ...card,
      isOwned,
      obtained_at: ownedDetail?.obtained_at || null,
      obtained_via: ownedDetail?.obtained_via || card.myJourney.obtainedFor,
      user_edition: ownedDetail?.edition || card.edition,
    };
  });

  // Statistiky pro hlavní Season 0 progress
  const season0OwnedCount = season0CardsWithOwnership.filter(c => c.isOwned).length;
  const season0TotalCount = SEASON_0_CARDS.length; // 12
  const completionPercent = Math.round((season0OwnedCount / season0TotalCount) * 100);

  // První nezískaná karta pro nápovědu
  const nextUnownedCard = season0CardsWithOwnership.find(c => !c.isOwned);
  const nextCardName = nextUnownedCard ? nextUnownedCard.name : null;

  return (
    <div className="min-h-screen bg-[#060608] text-[#e2e8f0] font-sans pb-24 relative">
      {/* Dekorativní glow na pozadí */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* FIXED HEADER */}
      <header className="sticky top-0 z-40 bg-[#060608]/85 backdrop-blur-xl border-b border-white/5 shadow-lg">
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
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-purple-500/20 shadow-md shrink-0 object-cover"
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
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                  HRÁČ S0
                </span>
              </div>
            </div>

            {/* Logout button */}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 space-y-12 relative z-10">
        
        {/* STATISTIKY & PROGRESS BAR (SEASON 0) */}
        <section className="bg-[#0e0e12]/70 backdrop-blur-xl border border-purple-500/20 p-8 sm:p-10 md:p-12 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.03)] grid md:grid-cols-3 gap-8 sm:gap-10 items-center">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-purple-400 uppercase tracking-widest font-display">
              <Trophy size={16} />
              SBĚRATELSKÝ PROGRESS — SEASON 0
            </div>
            
            <div className="flex items-baseline gap-2.5">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-100 font-display">
                {season0OwnedCount} / {season0TotalCount}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">
                historických artefaktů zkompletováno
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/5 border border-white/5 h-6 rounded-full overflow-hidden p-1 mt-3">
              <div
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center text-center md:text-left h-full">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
              CELKOVÉ DOKONČENÍ
            </span>
            <span className="text-5xl sm:text-6xl font-extrabold text-purple-400 font-display">
              {completionPercent}%
            </span>
            <p className="text-xs text-slate-300 mt-3 leading-normal">
              {season0OwnedCount === season0TotalCount ? (
                <span className="text-amber-400 font-semibold flex items-center justify-center md:justify-start gap-1">
                  <Sparkles size={12} className="shrink-0" /> Legenda! Všechny artefakty Season 0 nalezeny.
                </span>
              ) : nextCardName ? (
                <>Další cíl: získej kartu <strong className="text-slate-100 font-semibold">{nextCardName}</strong></>
              ) : (
                "Pokračuj v plnění misí na Discordu a sbírej karty."
              )}
            </p>
          </div>
        </section>

        {/* INTERAKTIVNÍ GRID KARET */}
        <section className="space-y-8">
          <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-display text-base sm:text-lg font-bold tracking-widest text-slate-200 uppercase">
              SEASON 0 — AWAKENING
            </h3>
            <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
              12 HISTORICKÝCH ARTEFAKTŮ
            </span>
          </div>

          <AlbumClient
            season0Cards={season0CardsWithOwnership}
            foundersCards={foundersCardsWithOwnership}
          />
        </section>

      </main>
    </div>
  );
}
