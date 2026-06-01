"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, HelpCircle, Sparkles, X, Calendar, Compass, Shield } from "lucide-react";

export interface AlbumCard {
  card_id: string;
  name: string;
  family: string;
  lore: string;
  edition_type: string;
  image_url?: string;
  is_locked: boolean;
  sort_order: number;
  isOwned: boolean;
  obtained_at: string | null;
  obtained_via: string | null;
  user_edition: string | null;
}

interface AlbumClientProps {
  cards: AlbumCard[];
}

export default function AlbumClient({ cards }: AlbumClientProps) {
  const [selectedCard, setSelectedCard] = useState<AlbumCard | null>(null);

  // Funkce pro získání neonových stylů rodin karet
  const getFamilyStyles = (family: string) => {
    switch (family) {
      case "AWAKENING":
        return {
          glow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] border-purple-500/30",
          text: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          neonBg: "from-purple-950/40 to-black",
          neonLine: "bg-purple-500/40",
          color: "rgb(168, 85, 247)",
        };
      case "POSTAVY_IWAU":
        return {
          glow: "hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] border-indigo-500/30",
          text: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          neonBg: "from-indigo-950/40 to-black",
          neonLine: "bg-indigo-500/40",
          color: "rgb(99, 102, 241)",
        };
      case "GLITCH":
        return {
          glow: "hover:shadow-[0_0_20px_rgba(236,72,153,0.25)] border-pink-500/30",
          text: "text-pink-400 bg-pink-500/10 border-pink-500/20",
          neonBg: "from-pink-950/40 to-black",
          neonLine: "bg-pink-500/40",
          color: "rgb(236, 72, 153)",
        };
      case "RELICS":
        return {
          glow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] border-cyan-500/30",
          text: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
          neonBg: "from-cyan-950/40 to-black",
          neonLine: "bg-cyan-500/40",
          color: "rgb(6, 182, 212)",
        };
      case "CHRISTMAS_2025":
        return {
          glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] border-emerald-500/30",
          text: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          neonBg: "from-emerald-950/40 to-black",
          neonLine: "bg-emerald-500/40",
          color: "rgb(16, 185, 129)",
        };
      default:
        return {
          glow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.20)] border-purple-500/20",
          text: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          neonBg: "from-purple-950/40 to-black",
          neonLine: "bg-purple-500/40",
          color: "rgb(168, 85, 247)",
        };
    }
  };

  const formatObtainedVia = (via: string | null) => {
    if (!via) return "";
    switch (via.toLowerCase()) {
      case "onboarding": return "Úvodní Onboarding";
      case "quest": return "Real World Quest";
      case "referral": return "Referral Doporučení";
      case "founder_drop": return "Founder Drop";
      case "mvp_waitlist": return "MVP Waitlist";
      case "activity": return "Komunitní Aktivita";
      case "christmas_drop": return "Vánoční Drop 2025";
      default: return via;
    }
  };

  return (
    <>
      {/* Grid karet */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const styles = getFamilyStyles(card.family);
          
          // Rozhodnutí o vzhledu karty na základě vlastnictví a zámku v DB
          const isFullyHidden = !card.isOwned && card.is_locked;
          const isRevealedButUnowned = !card.isOwned && !card.is_locked;

          return (
            <motion.div
              key={card.card_id}
              onClick={() => card.isOwned && setSelectedCard(card)}
              className={`glass-card overflow-hidden border flex flex-col h-full relative group transition-all duration-300 ${
                card.isOwned
                  ? `cursor-pointer border-white/10 hover:border-white/20 hover:bg-[#0e0e12] ${styles.glow}`
                  : "border-white/5 opacity-55 shadow-none"
              }`}
            >
              {/* Asset karty nebo silueta */}
              <div className="aspect-[7/10] relative w-full overflow-hidden bg-black/70 flex items-center justify-center border-b border-white/5 select-none">
                {card.isOwned && card.image_url ? (
                  <img
                    src={card.image_url}
                    alt={card.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  // Prémiová zástupná silueta s neonovým gradientem
                  <div className={`w-full h-full bg-gradient-to-b flex flex-col items-center justify-center p-4 relative overflow-hidden ${styles.neonBg}`}>
                    <div className={`absolute w-[150%] h-[1px] rotate-45 opacity-20 top-1/4 ${styles.neonLine}`} />
                    <div className={`absolute w-[150%] h-[1px] -rotate-45 opacity-20 bottom-1/4 ${styles.neonLine}`} />
                    
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center relative z-10 shadow-inner">
                      {isFullyHidden ? (
                        <Lock className="text-white/30 w-6 h-6" />
                      ) : (
                        <HelpCircle className="text-white/30 w-6 h-6" />
                      )}
                    </div>
                    
                    <span className="text-[9px] font-display font-semibold tracking-[0.2em] uppercase text-white/30 mt-3 relative z-10">
                      {card.family.replace("_", " ")}
                    </span>
                  </div>
                )}

                {/* Locked overlay na nevlastněné kartě */}
                {!card.isOwned && (
                  <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center z-20 backdrop-blur-[1px]">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                      <Lock size={16} className="text-white/50" />
                    </div>
                    <span className="font-display text-[10px] font-bold text-white/50 tracking-widest uppercase">
                      {isFullyHidden ? "Uzamčeno" : "Nezískáno"}
                    </span>
                  </div>
                )}

                {/* Floating Family Badge */}
                {card.isOwned && (
                  <span className={`absolute top-2.5 left-2.5 text-[8px] font-bold font-display px-2 py-0.5 rounded border tracking-wider ${styles.text}`}>
                    {card.family.replace("_", " ")}
                  </span>
                )}
              </div>

              {/* Popis a jméno karty pod obrázkem */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <h5 className="font-display font-bold text-xs tracking-wider uppercase text-slate-100 truncate flex-1">
                      {isFullyHidden ? "???" : card.name}
                    </h5>
                    
                    {/* Edition Badge */}
                    {card.isOwned && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0 border ${
                        card.user_edition === "FIRST_EDITION"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-white/5 text-white/50 border-white/10"
                      }`}>
                        {card.user_edition === "FIRST_EDITION" ? "1ST ED" : "BASE"}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-slate-400 leading-relaxed italic line-clamp-2">
                    {card.isOwned 
                      ? card.lore 
                      : isRevealedButUnowned 
                        ? "Tento artefakt čeká na odemčení. Plň úkoly k jeho získání."
                        : "Detaily o této kartě jsou chráněné přísnou kódovou šifrou."
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* DETAIL MODAL (Framer Motion) */}
      <AnimatePresence>
        {selectedCard && (() => {
          const styles = getFamilyStyles(selectedCard.family);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            >
              {/* Kliknutí mimo zavře modal */}
              <div className="absolute inset-0" onClick={() => setSelectedCard(null)} />

              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative max-w-xl w-full glass-card border-purple-500/20 bg-[#0c0c10] shadow-[0_0_50px_rgba(168,85,247,0.15)] rounded-2xl overflow-hidden z-10 flex flex-col md:flex-row"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 z-30 p-2 rounded-lg bg-black/40 border border-white/15 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>

                {/* Levá část: Karta */}
                <div className="w-full md:w-[45%] aspect-[7/10] relative bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5 select-none">
                  {selectedCard.image_url ? (
                    <img
                      src={selectedCard.image_url}
                      alt={selectedCard.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-b flex flex-col items-center justify-center p-6 relative overflow-hidden ${styles.neonBg}`}>
                      <div className={`absolute w-[150%] h-[1px] rotate-45 opacity-20 top-1/4 ${styles.neonLine}`} />
                      <div className={`absolute w-[150%] h-[1px] -rotate-45 opacity-20 bottom-1/4 ${styles.neonLine}`} />
                      <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center relative z-10 shadow-inner">
                        <HelpCircle className="text-white/30 w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-white/35 mt-4 relative z-10">
                        {selectedCard.family.replace("_", " ")}
                      </span>
                    </div>
                  )}

                  {/* Badge edice ve foto rohu */}
                  <span className={`absolute top-4 left-4 text-[9px] font-bold font-display px-2 py-0.5 rounded border tracking-wider ${styles.text}`}>
                    {selectedCard.family.replace("_", " ")}
                  </span>
                </div>

                {/* Pravá část: Lore detaily */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                          {selectedCard.name}
                        </h3>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border tracking-wider flex items-center gap-0.5 shrink-0 ${
                          selectedCard.user_edition === "FIRST_EDITION"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-white/5 text-white/50 border-white/10"
                        }`}>
                          {selectedCard.user_edition === "FIRST_EDITION" && <Sparkles size={8} className="text-amber-400" />}
                          {selectedCard.user_edition === "FIRST_EDITION" ? "FIRST EDITION" : "BASE EDITION"}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 tracking-wider">
                        ID KARTY: {selectedCard.card_id}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        „{selectedCard.lore}“
                      </p>
                    </div>

                    {/* Metadata o získání */}
                    <div className="space-y-2.5 border-t border-white/5 pt-4 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} className="text-purple-400 shrink-0" />
                        <span>Získáno dne:</span>
                        <strong className="text-slate-200 ml-auto font-medium">
                          {selectedCard.obtained_at ? new Date(selectedCard.obtained_at).toLocaleDateString("cs-CZ", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          }) : "-"}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400">
                        <Compass size={14} className="text-purple-400 shrink-0" />
                        <span>Způsob získání:</span>
                        <strong className="text-slate-200 ml-auto font-medium">
                          {formatObtainedVia(selectedCard.obtained_via)}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400">
                        <Shield size={14} className="text-purple-400 shrink-0" />
                        <span>Status edice:</span>
                        <strong className="text-slate-200 ml-auto font-medium">
                          {selectedCard.user_edition === "FIRST_EDITION" ? "Limitovaná sběratelská" : "Základní herní"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="w-full py-2.5 text-xs font-semibold bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Zavřít detail
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
