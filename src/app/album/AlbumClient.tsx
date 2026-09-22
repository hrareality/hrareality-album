"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Sparkles,
  X,
  Calendar,
  Compass,
  Shield,
  ZoomIn,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Flame,
  Crown
} from "lucide-react";
import { CardStaticData } from "@/lib/cardsData";

export interface AlbumCard extends CardStaticData {
  isOwned: boolean;
  obtained_at: string | null;
  obtained_via: string | null;
  user_edition: string | null;
  is_locked?: boolean;
}

interface AlbumClientProps {
  season0Cards: AlbumCard[];
  foundersCards?: AlbumCard[];
}

export default function AlbumClient({ season0Cards, foundersCards = [] }: AlbumClientProps) {
  const [selectedCard, setSelectedCard] = useState<AlbumCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Získání barevných a neonových stylů rodin karet
  const getFamilyStyles = (family: string) => {
    switch (family) {
      case "AWAKENING":
        return {
          glow: "hover:shadow-[0_0_24px_rgba(168,85,247,0.25)] border-purple-500/30",
          text: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          neonBg: "from-purple-950/40 to-black",
          neonLine: "bg-purple-500/40",
          color: "rgb(168, 85, 247)",
          pillBg: "bg-purple-500/15 border-purple-500/30 text-purple-300",
        };
      case "POSTAVY_IWAU":
        return {
          glow: "hover:shadow-[0_0_24px_rgba(99,102,241,0.25)] border-indigo-500/30",
          text: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          neonBg: "from-indigo-950/40 to-black",
          neonLine: "bg-indigo-500/40",
          color: "rgb(99, 102, 241)",
          pillBg: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
        };
      case "GLITCH":
        return {
          glow: "hover:shadow-[0_0_24px_rgba(236,72,153,0.25)] border-pink-500/30",
          text: "text-pink-400 bg-pink-500/10 border-pink-500/20",
          neonBg: "from-pink-950/40 to-black",
          neonLine: "bg-pink-500/40",
          color: "rgb(236, 72, 153)",
          pillBg: "bg-pink-500/15 border-pink-500/30 text-pink-300",
        };
      case "RELICS":
        return {
          glow: "hover:shadow-[0_0_24px_rgba(6,182,212,0.25)] border-cyan-500/30",
          text: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
          neonBg: "from-cyan-950/40 to-black",
          neonLine: "bg-cyan-500/40",
          color: "rgb(6, 182, 212)",
          pillBg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
        };
      case "FOUNDERS_MEMBERSHIP":
        return {
          glow: "hover:shadow-[0_0_28px_rgba(245,158,11,0.3)] border-amber-500/40",
          text: "text-amber-400 bg-amber-500/10 border-amber-500/25",
          neonBg: "from-amber-950/40 to-black",
          neonLine: "bg-amber-500/40",
          color: "rgb(245, 158, 11)",
          pillBg: "bg-amber-500/15 border-amber-500/30 text-amber-300",
        };
      default:
        return {
          glow: "hover:shadow-[0_0_24px_rgba(168,85,247,0.20)] border-purple-500/20",
          text: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          neonBg: "from-purple-950/40 to-black",
          neonLine: "bg-purple-500/40",
          color: "rgb(168, 85, 247)",
          pillBg: "bg-purple-500/15 border-purple-500/30 text-purple-300",
        };
    }
  };

  const formatObtainedVia = (card: AlbumCard) => {
    if (card.obtained_via) return card.obtained_via;
    return card.myJourney?.obtainedFor || "Plnění úkolů";
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleProgressScroll = () => {
    setSelectedCard(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Komponenta pro vykreslení jedné karty v gridu
  const renderCardGridItem = (card: AlbumCard) => {
    const styles = getFamilyStyles(card.family);
    const isFounders = card.family === "FOUNDERS_MEMBERSHIP";

    return (
      <motion.div
        key={card.card_id}
        onClick={() => {
          setSelectedCard(card);
          setIsFlipped(false);
        }}
        className={`glass-card overflow-hidden border flex flex-col h-full relative group transition-all duration-500 cursor-pointer hover:scale-[1.035] active:scale-[0.985] ${
          card.isOwned
            ? `border-white/10 hover:border-white/25 hover:bg-[#0e0e12] ${styles.glow}`
            : isFounders
            ? "border-amber-500/15 bg-amber-950/[0.03] opacity-85 hover:opacity-100 hover:border-amber-500/30"
            : "border-white/5 opacity-75 hover:opacity-95 hover:border-white/20 bg-white/[0.01]"
        }`}
      >
        {/* Asset karty nebo náhled */}
        <div className="aspect-[7/10] relative w-full overflow-hidden bg-black/60 flex items-center justify-center border-b border-white/5 select-none">
          {card.isOwned ? (
            <>
              {isFounders ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-950/40 via-black to-amber-950/20 text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <Crown size={32} className="text-amber-400 animate-pulse" />
                  </div>
                  <span className="font-display font-extrabold text-lg text-amber-200 uppercase tracking-widest">
                    {card.name}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest mt-1">
                    {card.edition}
                  </span>
                </div>
              ) : (
                <img
                  src={`/api/cards/${card.card_id}/image?side=front`}
                  alt={card.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              {/* Hover click CTA overlay pro vlastněnou kartu */}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-15 backdrop-blur-[0.5px]">
                <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/25 backdrop-blur-md text-[10px] font-display font-bold text-white tracking-widest uppercase shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Zobrazit detail
                </span>
              </div>
            </>
          ) : (
            <>
              {isFounders ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-950/15 to-black text-center relative">
                  <Crown size={40} className="text-amber-500/30 mb-3" />
                  <span className="font-display font-bold text-base text-amber-200/50 uppercase tracking-wider">
                    {card.name}
                  </span>
                </div>
              ) : (
                <img
                  src={`/cards/previews/${card.card_id}_blur.webp`}
                  alt={card.name}
                  className="w-full h-full object-cover opacity-80 filter blur-[0.5px] brightness-[0.7] transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Locked/Unowned overlay */}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-[1px] group-hover:bg-black/70 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:border-white/20 transition-all duration-300">
                  <Lock size={20} className="text-white/60 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="font-display text-xs font-bold text-white/70 tracking-wider uppercase transition-all duration-300 group-hover:text-white group-hover:scale-105">
                  Nezískáno
                </span>
                <span className="absolute bottom-4 text-[9px] font-display font-semibold tracking-widest uppercase text-white/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Jak získat?
                </span>
              </div>
            </>
          )}

          {/* Floating Family / Order Badge */}
          <span className={`absolute top-4 left-4 text-[10px] font-bold font-display px-2.5 py-1 rounded border tracking-wider uppercase z-20 ${styles.text}`}>
            {card.familyDisplayName || card.family.replace("_", " ")}
          </span>
        </div>

        {/* Popis a jméno karty pod obrázkem (ÚVODNÍ TEXTY) */}
        <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <h4 className="font-display font-bold text-base sm:text-lg tracking-wider uppercase text-slate-100 leading-snug">
                {card.name}
              </h4>
              
              {/* Rarity/Edition Badge */}
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 border uppercase tracking-wider ${
                card.rarity === "LEGENDARY" || card.rarity === "FOUNDERS"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-[0_0_10px_rgba(245,158,11,0.15)] flex items-center gap-1"
                  : card.rarity === "RARE"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/25 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                  : "bg-white/5 text-slate-300 border-white/10"
              }`}>
                {(card.rarity === "LEGENDARY" || card.rarity === "FOUNDERS") && <Sparkles size={10} className="text-amber-400" />}
                {card.rarity}
              </span>
            </div>

            {/* Status štítek */}
            <div className="mb-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 inline-block">
                ⬡ {card.status}
              </span>
            </div>
            
            {/* Úvodní text (Grid náhled) */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {card.gridPreview}
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span className="uppercase tracking-wider text-[10px] font-semibold">
              {card.edition}
            </span>
            <span className="text-purple-400 group-hover:text-purple-300 transition-colors flex items-center gap-1 font-semibold">
              {card.isOwned ? "Otevřít kroniku →" : "Postup odemčení →"}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* 1. HLAVNÍ SEKCE: 12 KARET SEASON 0 — AWAKENING */}
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {season0Cards.map((card) => renderCardGridItem(card))}
        </div>
      </div>

      {/* 2. DEDIKOVANÁ BONUSOVÁ SEKCE: FOUNDERS MEMBERSHIP */}
      {foundersCards.length > 0 && (
        <section className="mt-20 pt-16 border-t border-white/10 relative">
          <div className="mb-10 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Crown size={14} />
              FOUNDERS MEMBERSHIP
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 uppercase tracking-wider">
                  FOUNDERS ARTEFAKTY
                </h3>
                <p className="text-sm text-slate-400 max-w-2xl mt-1">
                  Historické artefakty hráčů, kteří podpořili vznik iWau Hry Reality ještě před jejím plným spuštěním.
                  <span className="block text-amber-400/80 font-medium text-xs mt-1">
                    ✦ Bonusové historické artefakty — nezapočítávají se do dokončení Season 0.
                  </span>
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center shrink-0">
                <span className="text-[10px] font-bold text-amber-400/80 tracking-widest uppercase block">
                  FOUNDERS COLLECTION
                </span>
                <span className="text-lg font-bold font-display text-amber-300">
                  {foundersCards.filter(c => c.isOwned).length} / {foundersCards.length}
                </span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 max-w-3xl gap-8">
            {foundersCards.map((card) => renderCardGridItem(card))}
          </div>
        </section>
      )}

      {/* DETAIL MODAL (Framer Motion) */}
      <AnimatePresence>
        {selectedCard && (() => {
          const styles = getFamilyStyles(selectedCard.family);
          const isFounders = selectedCard.family === "FOUNDERS_MEMBERSHIP";

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            >
              {/* Kliknutí na pozadí zavře modal */}
              <div className="absolute inset-0" onClick={() => setSelectedCard(null)} />

              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto glass-card border border-white/10 bg-[#0c0c10] shadow-[0_0_60px_rgba(168,85,247,0.15)] rounded-2xl z-10 flex flex-col md:flex-row scrollbar-thin"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 z-30 p-2.5 rounded-xl bg-black/60 border border-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Zavřít"
                >
                  <X size={16} />
                </button>

                {/* LEVÁ ČÁST: Obrázek karty (3D otáčení pro vlastněné, statický náhled pro nevlastněné) */}
                <div
                  className="w-full md:w-[46%] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 select-none bg-black/50 p-6 md:p-8 gap-5 relative shrink-0"
                  style={{ perspective: "1200px" }}
                >
                  {selectedCard.isOwned ? (
                    <>
                      {isFounders ? (
                        <div className="w-full aspect-[7/10] rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-950/40 via-black to-amber-950/20 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
                            <Crown size={40} className="text-amber-400 animate-pulse" />
                          </div>
                          <span className="font-display font-extrabold text-2xl text-amber-200 uppercase tracking-widest">
                            {selectedCard.name}
                          </span>
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-1">
                            {selectedCard.edition}
                          </span>
                          <span className="mt-4 text-[10px] text-slate-400 uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                            {selectedCard.status}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="w-full relative transition-transform duration-700 cursor-pointer hover:scale-[1.02] group/card"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                            aspectRatio: "7/10",
                          }}
                          onClick={() => setIsFlipped(!isFlipped)}
                        >
                          {/* Lícová strana (Přední strana karty) */}
                          <div
                            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden rounded-xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)] group-hover/card:shadow-[0_15px_40px_rgba(168,85,247,0.25)] transition-all duration-300"
                            style={{ backfaceVisibility: "hidden" }}
                          >
                            <img
                              src={`/api/cards/${selectedCard.card_id}/image?side=front`}
                              alt={selectedCard.name}
                              className="w-full h-full object-cover"
                            />
                            {/* Zoom ikona pro líc */}
                            <a
                              href={`/api/cards/${selectedCard.card_id}/image?side=front`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-4 right-4 z-30 p-2 rounded-lg bg-black/60 border border-white/15 text-slate-400 hover:text-white hover:bg-black/80 transition-all duration-300 shadow-lg cursor-pointer"
                              title="Otevřít líc v plné velikosti"
                            >
                              <ZoomIn size={14} />
                            </a>
                            <span className={`absolute top-4 left-4 text-[9px] font-bold font-display px-2 py-0.5 rounded border tracking-wider ${styles.text}`}>
                              {selectedCard.family.replace("_", " ")}
                            </span>
                          </div>

                          {/* Rubová strana (Zadní strana karty) */}
                          <div
                            className="absolute inset-0 w-full h-full rounded-xl border overflow-hidden bg-black shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
                            style={{
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                              borderWidth: "1.5px",
                              borderColor: styles.color,
                            }}
                          >
                            <img
                              src={`/api/cards/${selectedCard.card_id}/image?side=back`}
                              alt={`${selectedCard.name} - Zadní strana`}
                              className="w-full h-full object-cover"
                            />
                            {/* Zoom ikona pro rub */}
                            <a
                              href={`/api/cards/${selectedCard.card_id}/image?side=back`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-4 left-4 z-30 p-2 rounded-lg bg-black/60 border border-white/15 text-slate-400 hover:text-white hover:bg-black/80 transition-all duration-300 shadow-lg cursor-pointer"
                              style={{ transform: "rotateY(180deg)" }}
                              title="Otevřít rub v plné velikosti"
                            >
                              <ZoomIn size={14} />
                            </a>
                          </div>
                        </div>
                      )}

                      {!isFounders && (
                        <>
                          <span className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase animate-pulse select-none -mt-2 text-center">
                            Kliknutím kartu otočíš
                          </span>

                          <button
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-all duration-300 cursor-pointer"
                          >
                            <Compass size={12} className="animate-spin-slow text-purple-400" />
                            Otočit kartu
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full aspect-[7/10] relative rounded-xl overflow-hidden border border-white/10 shadow-lg shrink-0 flex items-center justify-center bg-black/80">
                      {isFounders ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-950/20 to-black text-center">
                          <Crown size={48} className="text-amber-500/40 mb-3" />
                          <span className="font-display font-bold text-lg text-amber-200/60 uppercase tracking-wider">
                            {selectedCard.name}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={`/cards/previews/${selectedCard.card_id}_blur.webp`}
                          alt={selectedCard.name}
                          className="w-full h-full object-cover filter blur-[0.5px] brightness-[0.7]"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                          <Lock size={20} className="text-white/60" />
                        </div>
                        <span className="font-display text-xs font-bold text-white/70 tracking-wider uppercase">
                          Nezískáno
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* PRAVÁ ČÁST: Detailní texty & interakce */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-5">
                    {/* Hlavička modalu */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-display font-extrabold text-2xl uppercase tracking-wider text-white">
                          {selectedCard.name}
                        </h3>
                        
                        {/* Edice Badge */}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border tracking-wider bg-white/5 text-purple-300 border-purple-500/20 uppercase">
                          {selectedCard.edition} {selectedCard.isOwned ? "" : "· NEZÍSKÁNO"}
                        </span>

                        {/* Rarita Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border tracking-wider flex items-center gap-1 uppercase ${
                          selectedCard.rarity === "LEGENDARY" || selectedCard.rarity === "FOUNDERS"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                            : selectedCard.rarity === "RARE"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/25"
                            : "bg-white/5 text-slate-300 border-white/10"
                        }`}>
                          {(selectedCard.rarity === "LEGENDARY" || selectedCard.rarity === "FOUNDERS") && <Sparkles size={10} className="text-amber-400" />}
                          {selectedCard.rarity}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        <span>RODINA: {selectedCard.familyDisplayName || selectedCard.family.replace("_", " ")}</span>
                        <span>•</span>
                        <span className="text-slate-300">⬡ {selectedCard.status}</span>
                      </div>
                    </div>

                    {/* CITÁT KARTY */}
                    <div className="p-4 rounded-xl bg-purple-500/[0.04] border border-purple-500/15">
                      <p className="text-xs sm:text-sm text-purple-200 leading-relaxed italic font-medium">
                        {selectedCard.quote}
                      </p>
                    </div>

                    {/* STAV 1: VLASTNĚNO (MOJE CESTA) */}
                    {selectedCard.isOwned ? (
                      <div className="space-y-4 pt-1">
                        {/* Metadata lišta */}
                        <div className="grid sm:grid-cols-2 gap-2 text-xs bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={13} className="text-purple-400 shrink-0" />
                            <span>Získáno dne:</span>
                            <strong className="text-slate-200 font-medium ml-auto">
                              {selectedCard.obtained_at
                                ? new Date(selectedCard.obtained_at).toLocaleDateString("cs-CZ", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "Aktivní hráč"}
                            </strong>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Compass size={13} className="text-purple-400 shrink-0" />
                            <span>Získáno za:</span>
                            <strong className="text-slate-200 font-medium ml-auto truncate max-w-[150px]">
                              {formatObtainedVia(selectedCard)}
                            </strong>
                          </div>
                        </div>

                        {/* MOJE CESTA SEKCE */}
                        <div className="space-y-2.5 pt-2">
                          <div className="flex items-center gap-2 text-xs font-bold font-display uppercase tracking-widest text-purple-400">
                            <Flame size={14} />
                            MOJE CESTA
                          </div>

                          <h4 className="font-display font-bold text-base sm:text-lg text-slate-100 uppercase tracking-wide">
                            {selectedCard.myJourney.title}
                          </h4>

                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {selectedCard.myJourney.story}
                          </p>

                          {/* POINTA */}
                          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 mt-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Pointa / Archivní význam
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-slate-100 italic">
                              „{selectedCard.myJourney.point}“
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* STAV 2: NEZÍSKÁNO (JAK ZÍSKAT) */
                      <div className="space-y-4 pt-1">
                        {/* CO JE TO? */}
                        <div>
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            CO JE TO?
                          </h5>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {selectedCard.howToGet.whatIsIt}
                          </p>
                        </div>

                        {/* CESTA K ARTEFAKTU */}
                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <span>{selectedCard.howToGet.wayToArtifact.symbol}</span> CESTA K ARTEFAKTU
                          </h5>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {selectedCard.howToGet.wayToArtifact.text}
                          </p>
                        </div>

                        {/* PODMÍNKY / PROGRESS */}
                        {selectedCard.howToGet.progress && (
                          <div>
                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              PROGRESS
                            </h5>
                            <span className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-display font-bold text-purple-300 tracking-wider">
                              {selectedCard.howToGet.progress}
                            </span>
                          </div>
                        )}

                        {selectedCard.howToGet.conditions && selectedCard.howToGet.conditions.length > 0 && (
                          <div>
                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              PODMÍNKY
                            </h5>
                            <ul className="space-y-1 text-xs text-slate-300">
                              {selectedCard.howToGet.conditions.map((cond, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <span className="text-purple-400 font-bold">◉</span>
                                  <span>{cond}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* DOSTUPNOST */}
                        <div className="space-y-1">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            DOSTUPNOST
                          </h5>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wider ${
                              selectedCard.howToGet.availability.color === "green"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : selectedCard.howToGet.availability.color === "amber"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : selectedCard.howToGet.availability.color === "purple"
                                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                : selectedCard.howToGet.availability.color === "cyan"
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {selectedCard.howToGet.availability.text}
                            </span>
                          </div>
                          {selectedCard.howToGet.availability.note && (
                            <p className="text-[11px] text-slate-400 italic pt-1 leading-relaxed">
                              {selectedCard.howToGet.availability.note}
                            </p>
                          )}
                        </div>

                        {/* CHYTRÉ AKČNÍ CTA TLAČÍTKO */}
                        <div className="pt-2">
                          {selectedCard.howToGet.cta.actionType === "share" ? (
                            <button
                              onClick={() => handleCopyLink(selectedCard.howToGet.cta.url || "https://hrareality.cz")}
                              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-display font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] cursor-pointer"
                            >
                              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                              {copiedLink ? "ODKAZ ZKOPÍROVÁN DO SCHRÁNKY!" : selectedCard.howToGet.cta.label}
                            </button>
                          ) : selectedCard.howToGet.cta.actionType === "progress" ? (
                            <button
                              onClick={handleProgressScroll}
                              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-display font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.25)] cursor-pointer"
                            >
                              <Sparkles size={16} />
                              {selectedCard.howToGet.cta.label}
                            </button>
                          ) : selectedCard.howToGet.cta.actionType === "founders" ? (
                            <a
                              href={selectedCard.howToGet.cta.url || "https://hrareality.cz/zakladatel"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-display font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-pointer text-center"
                            >
                              <Crown size={16} />
                              {selectedCard.howToGet.cta.label}
                            </a>
                          ) : (
                            <a
                              href={selectedCard.howToGet.cta.url || "https://discord.gg/MGnNWkcqQf"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#3c45a3] text-white font-display font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(88,101,242,0.25)] hover:shadow-[0_0_30px_rgba(88,101,242,0.4)] text-center cursor-pointer"
                            >
                              {/* Discord Icon */}
                              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                              </svg>
                              <span>{selectedCard.howToGet.cta.label}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tlačítko zavřít */}
                  <div className="pt-4 border-t border-white/5">
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="w-full py-2.5 text-xs font-semibold bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-white rounded-xl transition-colors cursor-pointer text-center"
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
