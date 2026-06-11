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
  const [isFlipped, setIsFlipped] = useState(false);

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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => {
          const styles = getFamilyStyles(card.family);
          
          // Rozhodnutí o vzhledu karty na základě vlastnictví a zámku v DB
          const isFullyHidden = !card.isOwned && card.is_locked;
          const isRevealedButUnowned = !card.isOwned && !card.is_locked;

          return (
            <motion.div
              key={card.card_id}
              onClick={() => {
                if (card.isOwned) {
                  setSelectedCard(card);
                  setIsFlipped(false);
                }
              }}
              className={`glass-card overflow-hidden border flex flex-col h-full relative group transition-all duration-500 ${
                card.isOwned
                  ? `cursor-pointer hover:scale-[1.02] border-white/10 hover:border-white/20 hover:bg-[#0e0e12] ${styles.glow}`
                  : "border-white/5 opacity-70 shadow-none pointer-events-none"
              }`}
            >
              {/* Asset karty nebo silueta */}
              <div className="aspect-[7/10] relative w-full overflow-hidden bg-black/50 flex items-center justify-center border-b border-white/5 select-none">
                {card.isOwned && card.image_url ? (
                  <img
                    src={card.image_url}
                    alt={card.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  // Prémiová zástupná silueta s neonovým gradientem
                  <div className={`w-full h-full bg-gradient-to-b flex flex-col items-center justify-center p-6 relative overflow-hidden ${styles.neonBg}`}>
                    <div className={`absolute w-[150%] h-[1px] rotate-45 opacity-20 top-1/4 ${styles.neonLine}`} />
                    <div className={`absolute w-[150%] h-[1px] -rotate-45 opacity-20 bottom-1/4 ${styles.neonLine}`} />
                    
                    <div className="w-18 h-18 rounded-full border border-white/10 bg-white/5 flex items-center justify-center relative z-10 shadow-inner">
                      {isFullyHidden ? (
                        <Lock className="text-white/30 w-9 h-9" />
                      ) : (
                        <HelpCircle className="text-white/30 w-9 h-9" />
                      )}
                    </div>
                    
                    <span className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-white/35 mt-4 relative z-10">
                      {card.family.replace("_", " ")}
                    </span>
                  </div>
                )}

                {/* Locked overlay na nevlastněné kartě */}
                {!card.isOwned && (
                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-20 backdrop-blur-[2px]">
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <Lock size={22} className="text-white/60" />
                    </div>
                    <span className="font-display text-base font-bold text-white/60 tracking-wider uppercase">
                      {isFullyHidden ? "Uzamčeno" : "Nezískáno"}
                    </span>
                  </div>
                )}

                {/* Floating Family Badge */}
                {card.isOwned && (
                  <span className={`absolute top-4 left-4 text-xs font-bold font-display px-2.5 py-1 rounded border tracking-wider ${styles.text}`}>
                    {card.family.replace("_", " ")}
                  </span>
                )}
              </div>

              {/* Popis a jméno karty pod obrázkem */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h5 className="font-display font-bold text-base sm:text-lg tracking-wider uppercase text-slate-100 truncate flex-1">
                      {isFullyHidden ? "???" : card.name}
                    </h5>
                    
                    {/* Rarity/Edition Badge */}
                    {card.isOwned && (
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shrink-0 border uppercase tracking-wider ${
                        card.user_edition === "LEGENDARY" || card.user_edition === "FIRST_EDITION"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)] flex items-center gap-1"
                          : card.user_edition === "RARE"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                            : "bg-white/5 text-white/50 border-white/10"
                      }`}>
                        {(card.user_edition === "LEGENDARY" || card.user_edition === "FIRST_EDITION") && <Sparkles size={10} className="text-amber-400" />}
                        {card.user_edition === "FIRST_EDITION" ? "1ST ED" : card.user_edition === "BASE" ? "BASE" : card.user_edition}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-400 leading-relaxed italic mt-2">
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

                 {/* Levá část: Karta s 3D otáčením */}
                 <div className="w-full md:w-[45%] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 select-none bg-black/40 p-6 sm:p-8 gap-4 relative">
                   <div 
                     className="w-full relative transition-transform duration-700 cursor-pointer"
                     style={{ 
                       transformStyle: "preserve-3d",
                       transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                       aspectRatio: "7/10"
                     }}
                     onClick={() => setIsFlipped(!isFlipped)}
                   >
                     {/* Lícová strana (Přední strana karty) */}
                     <div 
                       className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden rounded-xl border border-white/10"
                       style={{ backfaceVisibility: "hidden" }}
                     >
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
                           <div className="w-18 h-18 rounded-full border border-white/10 bg-white/5 flex items-center justify-center relative z-10 shadow-inner">
                             <HelpCircle className="text-white/30 w-9 h-9" />
                           </div>
                           <span className="text-xs font-display font-semibold tracking-[0.3em] uppercase text-white/35 mt-4 relative z-10">
                             {selectedCard.family.replace("_", " ")}
                           </span>
                         </div>
                       )}

                       {/* Badge edice ve foto rohu */}
                       <span className={`absolute top-4 left-4 text-[9px] font-bold font-display px-2 py-0.5 rounded border tracking-wider ${styles.text}`}>
                         {selectedCard.family.replace("_", " ")}
                       </span>
                     </div>

                     {/* Rubová strana (Zadní strana karty) */}
                     <div 
                       className={`absolute inset-0 w-full h-full rounded-xl border p-6 flex flex-col justify-between bg-gradient-to-b ${styles.neonBg} ${styles.glow}`}
                       style={{ 
                         backfaceVisibility: "hidden", 
                         transform: "rotateY(180deg)",
                         borderWidth: "1.5px"
                       }}
                     >
                       {/* Cybernetický grid na pozadí */}
                       <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />

                       {/* Hlavička zadní strany */}
                       <div className="flex items-center justify-between relative z-10">
                         <span className="text-[10px] font-bold font-display text-slate-500 tracking-wider">HRA REALITY</span>
                         <span className="text-[8px] font-mono text-slate-500 font-bold tracking-widest">{selectedCard.card_id}</span>
                       </div>

                       {/* Středový hologram */}
                       <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-4">
                         <div 
                           className="w-16 h-16 rounded-full border flex items-center justify-center relative animate-pulse"
                           style={{ 
                             borderColor: `rgba(${styles.color.replace("rgb(", "").replace(")", "")}, 0.35)`,
                             boxShadow: `0 0 20px rgba(${styles.color.replace("rgb(", "").replace(")", "")}, 0.2)`
                           }}
                         >
                           <div 
                             className="w-12 h-12 rounded-full flex items-center justify-center text-center font-display font-extrabold text-[9px] uppercase tracking-wider text-slate-200"
                             style={{
                               background: `rgba(${styles.color.replace("rgb(", "").replace(")", "")}, 0.1)`,
                               textShadow: `0 0 5px rgba(${styles.color.replace("rgb(", "").replace(")", "")}, 0.8)`
                             }}
                           >
                             ALBUM
                           </div>
                         </div>
                         <span className="font-display font-bold text-[10px] tracking-[0.25em] text-slate-300 uppercase mt-3">
                           KRONIKA HRA Reality
                         </span>
                       </div>

                       {/* Vlastnosti a status */}
                       <div className="space-y-1.5 relative z-10 border-t border-white/5 pt-4">
                         <div className="flex justify-between text-[10px] uppercase font-semibold font-display tracking-wider text-slate-400">
                           <span>Třída:</span>
                           <span className="text-slate-200 font-bold">HRÁČ S0</span>
                         </div>
                         <div className="flex justify-between text-[10px] uppercase font-semibold font-display tracking-wider text-slate-400">
                           <span>Rodina:</span>
                           <span className="text-slate-200 font-bold">{selectedCard.family.replace("_", " ")}</span>
                         </div>
                         <div className="flex justify-between text-[10px] uppercase font-semibold font-display tracking-wider text-slate-400">
                           <span>Rarita / Edice:</span>
                           <span className="text-slate-200 font-bold uppercase">
                             {selectedCard.user_edition === "FIRST_EDITION" ? "1ST EDITION" : selectedCard.user_edition === "BASE" ? "BASE" : selectedCard.user_edition}
                           </span>
                         </div>
                         <div className="flex justify-between text-[10px] uppercase font-semibold font-display tracking-wider text-slate-400">
                           <span>Status:</span>
                           <span className="text-purple-400 font-bold">ODEMČENO</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Tlačítko pro otočení karty */}
                   <button
                     onClick={() => setIsFlipped(!isFlipped)}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-all duration-300 cursor-pointer"
                   >
                     <Compass size={12} className="animate-spin-slow text-purple-400" />
                     Otočit kartu
                   </button>
                 </div>

                {/* Pravá část: Lore detaily */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                          {selectedCard.name}
                        </h3>
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded border tracking-wider flex items-center gap-0.5 shrink-0 uppercase ${
                          selectedCard.user_edition === "LEGENDARY" || selectedCard.user_edition === "FIRST_EDITION"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : selectedCard.user_edition === "RARE"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-white/5 text-white/50 border-white/10"
                        }`}>
                          {(selectedCard.user_edition === "LEGENDARY" || selectedCard.user_edition === "FIRST_EDITION") && <Sparkles size={8} className="text-amber-400" />}
                          {selectedCard.user_edition === "FIRST_EDITION" ? "FIRST EDITION" : selectedCard.user_edition === "BASE" ? "BASE EDITION" : selectedCard.user_edition}
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
                        <span>Rarita / Status:</span>
                        <strong className="text-slate-200 ml-auto font-medium uppercase">
                          {selectedCard.user_edition === "FIRST_EDITION" ? "Limitovaná sběratelská" : selectedCard.user_edition === "BASE" ? "Základní herní" : selectedCard.user_edition}
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
