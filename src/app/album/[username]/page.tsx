import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Hra Reality | Veřejné Album Hráče",
  description: "Sdílení osobních alb a herních profilů s komunitou. Již brzy v další fázi hry.",
};

export default function PublicAlbumPage() {
  return (
    <main className="min-h-screen bg-[#060608] text-[#e2e8f0] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-400 text-xs font-semibold uppercase tracking-widest mx-auto">
            <Sparkles size={12} />
            FÁZE 2 — COMING SOON
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent">
            VEŘEJNÁ ALBA
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
            Možnost sdílet své sběratelské úspěchy s kamarády a celou Discord komunitou odemkneme v další aktualizaci.
          </p>
        </div>

        <div className="bg-[#0e0e12]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
          <p className="text-xs text-slate-400 leading-relaxed">
            Momentálně pracujeme na spuštění první vlny uzavřeného testování kroniky. Ti, kteří získají všech 12 karet v Season 0, budou zapsáni do Síně slávy jako první.
          </p>
        </div>

        <div>
          <Link
            href="/album"
            className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            Zpět do mého alba
          </Link>
        </div>
      </div>
    </main>
  );
}
