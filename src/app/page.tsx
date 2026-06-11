import { signIn } from "@/lib/auth";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Hra Reality | Sběratelské Album Hráče",
  description: "Přihlas se svým Discord účtem, zobraz si své získané artefakty, odemkni exkluzivní status a sleduj svůj celkový herní progress.",
  icons: {
    icon: "/icon.png",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060608] text-[#e2e8f0] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dekorativní neonová záře na pozadí */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 space-y-8">
        {/* Herní Logo/Záhlaví */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-semibold uppercase tracking-widest animate-pulse mx-auto">
            <Sparkles size={12} />
            SEASON 0 ALBUM
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent">
            HRA REALITY
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Přestaň jen sledovat svůj život — začni ho hrát.
          </p>
        </div>

        {/* Přihlašovací box */}
        <div className="bg-[#0e0e12]/60 backdrop-blur-xl border border-purple-500/20 p-8 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.05)] space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-100">Vstup do své herní kroniky</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pro zobrazení osobní sbírky artefaktů, sledování herního postupu v albu a potvrzení tvého statusu se přihlas svým Discord účtem.
            </p>
          </div>

          {/* Next.js Server Action pro čisté a rychlé přihlášení */}
          <form
            action={async () => {
              "use server";
              await signIn("discord", { redirectTo: "/album" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#3c45a3] text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(88,101,242,0.25)] hover:shadow-[0_0_30px_rgba(88,101,242,0.45)] min-h-[46px] cursor-pointer"
            >
              {/* Discord SVG Logo */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
              Přihlásit se přes Discord
            </button>
          </form>
        </div>

        {/* Zásady / Footer */}
        <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
          Přihlášením souhlasíte se synchronizací vašeho Discord profilu (ID, jméno, avatar) do naší bezpečné kroniky.
        </p>
      </div>
    </main>
  );
}
