export interface CardActionCTA {
  label: string;
  sublabel?: string;
  actionType: "discord" | "share" | "waitlist" | "progress" | "founders";
  url?: string;
  channel?: string;
}

export interface CardStaticData {
  card_id: string;
  order: number;
  family: "AWAKENING" | "POSTAVY_IWAU" | "GLITCH" | "RELICS" | "FOUNDERS_MEMBERSHIP";
  familyDisplayName: string;
  name: string;
  edition: string;
  rarity: "COMMON" | "RARE" | "LEGENDARY" | "FOUNDERS";
  status: string;
  gridPreview: string;
  quote: string;
  
  // Detaily pro stav NEZÍSKÁNO (JAK ZÍSKAT)
  howToGet: {
    whatIsIt: string;
    wayToArtifact: {
      symbol: string;
      text: string;
    };
    conditions?: string[];
    progress?: string;
    availability: {
      text: string;
      note?: string;
      color: "green" | "amber" | "purple" | "locked" | "cyan";
    };
    cta: CardActionCTA;
  };

  // Detaily pro stav VLASTNĚNO (MOJE CESTA)
  myJourney: {
    obtainedFor: string;
    title: string;
    story: string;
    point: string;
  };
}

export const SEASON_0_CARDS: CardStaticData[] = [
  // 001 — ZROZENÍ HRÁČE
  {
    card_id: "awakening_1",
    order: 1,
    family: "AWAKENING",
    familyDisplayName: "I — AWAKENING",
    name: "Zrození Hráče",
    edition: "BASE EDITION",
    rarity: "COMMON",
    status: "VSTUPNÍ ARTEFAKT",
    gridPreview: "První karta každého hráče. Neříká, jak daleko ses dostal/a. Říká, kde tvoje cesta začala.",
    quote: "„Každý hráč začíná ve chvíli, kdy přestane být jen návštěvníkem.“",
    howToGet: {
      whatIsIt: "První Artefakt tvé cesty. Zaznamenává okamžik, kdy vstoupíš do iWau Hry Reality jako hráč a začne se zapisovat tvůj osobní Archiv.",
      wayToArtifact: {
        symbol: "🔓",
        text: "Dokonči základní onboarding iWau Hry Reality na Discordu."
      },
      conditions: [
        "Dokonči onboarding",
        "Aktivuj svou hráčskou identitu"
      ],
      availability: {
        text: "🟢 LZE ZÍSKAT",
        color: "green"
      },
      cta: {
        label: "VSTOUPIT DO HRY →",
        sublabel: "Discord onboarding",
        actionType: "discord",
        url: "https://discord.gg/MGnNWkcqQf"
      }
    },
    myJourney: {
      obtainedFor: "Dokončení onboardingu",
      title: "VSTOUPIL/A JSEM DO HRY.",
      story: "Tímto okamžikem začala tvoje cesta. Dokončil/a jsi první vstup do Hry Reality a přestal/a být pouze návštěvníkem jejího světa. Od tohoto dne se začíná zapisovat tvůj osobní Archiv.",
      point: "Tady všechno začalo."
    }
  },

  // 002 — PRVNÍ SIGNÁL
  {
    card_id: "awakening_2",
    order: 2,
    family: "AWAKENING",
    familyDisplayName: "I — AWAKENING",
    name: "První Signál",
    edition: "BASE EDITION",
    rarity: "COMMON",
    status: "AWAKENING ARTEFAKT",
    gridPreview: "První důkaz, že jsi iWau Hru Reality nejen sledoval/a. Začal/a jsi ji hrát.",
    quote: "„Někteří Signál zahlédnou. Hráči na něj odpoví.“",
    howToGet: {
      whatIsIt: "Signály jsou malé mise dne, které tě mají na chvíli vytáhnout z autopilota. Tento Artefakt zaznamená okamžik, kdy je přestaneš pouze míjet a začneš na ně reagovat.",
      wayToArtifact: {
        symbol: "📡",
        text: "Zareaguj na 3 Mise Dne iWau Hry Reality. Počítá se i onboardingový Signál."
      },
      progress: "0 / 3 SIGNÁLY",
      availability: {
        text: "🟢 LZE ZÍSKAT",
        color: "green"
      },
      cta: {
        label: "NAJÍT DALŠÍ SIGNÁL →",
        sublabel: "Discord #mise-dne",
        actionType: "discord",
        channel: "#mise-dne",
        url: "https://discord.gg/MGnNWkcqQf"
      }
    },
    myJourney: {
      obtainedFor: "Reakci na 3 Signály",
      title: "ZAČAL/A JSEM SI VŠÍMAT.",
      story: "Zachytil/a jsi první mise hry a třikrát ses rozhodl/a na ně reagovat. Hra Reality pro tebe přestala být jen něčím, co sleduješ. Začal/a jsi komunikovat se světem kolem sebe.",
      point: "První spojení bylo navázáno."
    }
  },

  // 003 — LOOP BREAKER
  {
    card_id: "awakening_3",
    order: 3,
    family: "AWAKENING",
    familyDisplayName: "I — AWAKENING",
    name: "Loop Breaker",
    edition: "BASE EDITION",
    rarity: "RARE",
    status: "ACTION ARTEFAKT",
    gridPreview: "Důkaz spojení mezi tebou, reálným světem a systémem iWau Hry Reality.",
    quote: "„Loop se nerozbije myšlenkou. Rozbije se akcí.“",
    howToGet: {
      whatIsIt: "První důkaz, že iWau Hru Reality nejen sleduješ. Loop Breaker získáš ve chvíli, kdy uděláš první skutečný krok mimo obrazovku.",
      wayToArtifact: {
        symbol: "⚡",
        text: "Dokonči svůj první Real World Quest a odevzdej požadovaný důkaz. Real World Questy jsou každý víkend."
      },
      progress: "0 / 1 REAL WORLD QUEST",
      availability: {
        text: "🟢 LZE ZÍSKAT",
        color: "green"
      },
      cta: {
        label: "NAJÍT REAL WORLD QUEST →",
        sublabel: "Discord #archiv",
        actionType: "discord",
        channel: "#archiv",
        url: "https://discord.gg/MGnNWkcqQf"
      }
    },
    myJourney: {
      obtainedFor: "První Real World Quest",
      title: "UDĚLAL/A JSEM PRVNÍ SKUTEČNÝ KROK.",
      story: "Dokončil/a jsi svůj první Real World Quest. Tentokrát nezůstalo jen u čtení, reakce nebo myšlenky. Něco se skutečně stalo mimo Discord.",
      point: "Hra poprvé vstoupila do tvého reálného světa."
    }
  },

  // 004 — ZAYA
  {
    card_id: "postavy_1",
    order: 4,
    family: "POSTAVY_IWAU",
    familyDisplayName: "II — POSTAVY iWAU",
    name: "Zaya",
    edition: "FIRST EDITION",
    rarity: "COMMON",
    status: "HISTORICKÝ ARTEFAKT",
    gridPreview: "První průvodkyně iWau Hry Reality. Neříká ti, kudy jít. Pomáhá ti všimnout si, kde může začít tvoje cesta.",
    quote: "„Každý hráč potřebuje někoho, kdo mu ukáže první krok.“",
    howToGet: {
      whatIsIt: "Zaya je první známá průvodkyně iWau Hry Reality. Tento Artefakt zachycuje její FIRST IMPACT – jedno z prvních období, kdy se začala objevovat mezi hráči Season 0.",
      wayToArtifact: {
        symbol: "🜂",
        text: "First Edition bylo možné získat pouze během časově omezeného Portálu FIRST IMPACT. Portál byl uzavřen."
      },
      availability: {
        text: "🔒 FIRST EDITION VERZI JIŽ NELZE ZÍSKAT",
        note: "Pokud chceš získat tento Artefakt Zayi, vydrž na dostupnost BASE verze. Tento konkrétní ve FIRST EDITION už nelze získat.",
        color: "locked"
      },
      cta: {
        label: "PROZKOUMAT KRONIKU →",
        sublabel: "Discord #kronika-vzniku",
        actionType: "discord",
        channel: "#kronika-vzniku",
        url: "https://discord.gg/MGnNWkcqQf"
      }
    },
    myJourney: {
      obtainedFor: "První Drop Portál FIRST IMPACT",
      title: "POZNAL/A JSEM PRVNÍHO PRŮVODCE.",
      story: "Během Season 0 ses setkal/a se Zayou ještě v době, kdy se její role ve světě iWau Hry Reality teprve odhalovala. Zaya ti nebude říkat, jak máš žít. Je tu proto, aby ukázala místa, kde může začít tvoje vlastní rozhodnutí.",
      point: "FIRST IMPACT se stal součástí tvé historie."
    }
  },

  // 005 — TEMNÝ MÁG
  {
    card_id: "postavy_2",
    order: 5,
    family: "POSTAVY_IWAU",
    familyDisplayName: "II — POSTAVY iWAU",
    name: "Temný Mág",
    edition: "FIRST EDITION",
    rarity: "RARE",
    status: "HISTORICKÝ ARTEFAKT",
    gridPreview: "Protisíla vědomé volby. Nezastaví tě. Jen ti připomene všechny důvody, proč nemá cenu začínat.",
    quote: "„Nezamyká dveře. Jen tě přesvědčí, že žádné neexistují.“",
    howToGet: {
      whatIsIt: "Temný Mág představuje protisílu vědomé volby. Pochybnost. Pasivitu. Strach. Okamžiky, kdy člověk začne věřit, že nemá cenu něco měnit.",
      wayToArtifact: {
        symbol: "❓",
        text: "Jeho první Portál zatím nebyl otevřen. Podmínky získání First Edition budou odhaleny až ve chvíli, kdy se Temný Mág objeví v Season 0."
      },
      availability: {
        text: "🟣 DOSUD NEODHALENO",
        color: "purple"
      },
      cta: {
        label: "SLEDOVAT SIGNÁLY →",
        sublabel: "Discord #zprávy-hry",
        actionType: "discord",
        channel: "#zprávy-hry",
        url: "https://discord.gg/MGnNWkcqQf"
      }
    },
    myJourney: {
      obtainedFor: "Speciální Týdenní Drop",
      title: "POZNAL/A JSEM PROTISÍLU.",
      story: "Ne všechno ve světě iWau Hry Reality tě vede dopředu. Temný Mág představuje chvíle, kdy pochybnost, strach nebo pasivita začnou rozhodovat místo tebe. Není tu proto, abys ho porazil/a. Je tu proto, abys poznal/a, kdy mu předáváš svou volbu.",
      point: "Dnes už víš, kdo je ten, co tě manipuluje."
    }
  },

  // 006 — DR. WETOM
  {
    card_id: "postavy_3",
    order: 6,
    family: "POSTAVY_IWAU",
    familyDisplayName: "II — POSTAVY iWAU",
    name: "Dr. Wetom",
    edition: "FIRST EDITION",
    rarity: "LEGENDARY",
    status: "LEGENDÁRNÍ ARTEFAKT",
    gridPreview: "Záhadný tvůrce stojící u počátků iWau Hry Reality. Nikdo přesně neví, kdo je. Ani jak skutečně vypadá.",
    quote: "„Čím více stop po sobě zanechává, tím méně je jasné, kdo skutečně je.“",
    howToGet: {
      whatIsIt: "Jedna z nejzáhadnějších postav iWau Hry Reality. Jeho jméno se objevuje u samotných počátků světa, ale nikdo přesně neví, kdo Dr. Wetom je ani jak skutečně vypadá.",
      wayToArtifact: {
        symbol: "🔐",
        text: "Způsob získání je skrytý. Tento Legendary Artefakt nebude možné odemknout běžným splněním mise. Hledej stopy."
      },
      availability: {
        text: "🔐 UNKNOWN",
        color: "locked"
      },
      cta: {
        label: "PROZKOUMAT SVĚT →",
        sublabel: "Discord #artefakty",
        actionType: "discord",
        channel: "#artefakty",
        url: "https://discord.gg/MGnNWkcqQf"
      }
    },
    myJourney: {
      obtainedFor: "Pomoc při rozvoji hry",
      title: "ODHALIL/A JSEM HLUBŠÍ VRSTVU SVĚTA.",
      story: "Dostal/a ses za hranici toho, co iWau Hra Reality ukazuje každému. Narazil/a jsi na jednu z jejích nejstarších záhad. Dr. Wetom stojí u počátků tohoto světa. Jeho skutečná identita ale zůstává neznámá.",
      point: "Čím hlouběji jdeš, tím více otázek vzniká."
    }
  },

  // 007 — DRIPTOR
  {
    card_id: "glitch_1",
    order: 7,
    family: "GLITCH",
    familyDisplayName: "III — GLITCH",
    name: "Driptor",
    edition: "FIRST EDITION",
    rarity: "COMMON",
    status: "HISTORICKÝ GLITCH",
    gridPreview: "Parazit Reality, který sílí pokaždé, když začneš svou hodnotu hledat ve věcech, které vlastníš.",
    quote: "„Zasloužíš si něco lepšího.“",
    howToGet: {
      whatIsIt: "První zaznamenaný Parazit Reality. Driptor se objevuje ve chvílích, kdy spotřeba, porovnávání a touha po něčem dalším začnou znít jako tvoje vlastní rozhodnutí.",
      wayToArtifact: {
        symbol: "🌀",
        text: "First Edition získali hráči, kteří během prvního Portálu rozpoznali Driptora ve svém skutečném životě a zaznamenali své setkání. Portál je již uzavřen."
      },
      availability: {
        text: "🔒 FIRST EDITION JIŽ NELZE ZÍSKAT",
        note: "Pokud chceš získat tento Artefakt Driptora, vydrž na dostupnost BASE verze. Jeho první zaznamenání ve FIRST EDITION verzi už ne.",
        color: "locked"
      },
      cta: {
        label: "PŘEČÍST ZÁZNAM V KRONICE →",
        sublabel: "Discord #kronika-vzniku",
        actionType: "discord",
        channel: "#kronika-vzniku",
        url: "https://discord.gg/MGnNWkcqQf"
      }
    },
    myJourney: {
      obtainedFor: "První setkání s Driptorem",
      title: "ROZPOZNAL/A JSEM PRVNÍ GLITCH.",
      story: "Všiml/a sis okamžiku, kdy spotřeba, porovnávání nebo touha po něčem dalším začaly znít jako tvoje vlastní rozhodnutí. Nemusel/a jsi Driptora porazit. Stačilo ho poprvé zahlédnout.",
      point: "Od této chvíle už není úplně neviditelný."
    }
  },

  // 008 — TOILEX
  {
    card_id: "glitch_2",
    order: 8,
    family: "GLITCH",
    familyDisplayName: "III — GLITCH",
    name: "Toilex",
    edition: "FIRST EDITION",
    rarity: "COMMON",
    status: "HISTORICKÝ GLITCH",
    gridPreview: "Parazit Reality, který nepotřebuje tvůj čas. Stačí mu tvoje pozornost. „Ještě jedno video.“",
    quote: "„Ještě jedno video.“",
    howToGet: {
      whatIsIt: "Parazit Reality, který se živí roztříštěnou pozorností. Feed. Shorts. Notifikace. Automatické otevření telefonu. Toilex nepotřebuje tvůj čas. Stačí mu tvoje pozornost.",
      wayToArtifact: {
        symbol: "🧻",
        text: "First Edition získali hráči, kteří během prvního Portálu zachytili okamžik, kdy jejich pozornost přešla na autopilota, a zaznamenali své setkání."
      },
      availability: {
        text: "🔒 FIRST EDITION JIŽ NELZE ZÍSKAT",
        note: "Pokud chceš získat tento Artefakt Toilexe, vydrž na dostupnost BASE verze. Jeho první zaznamenání ve FIRST EDITION verzi už ne.",
        color: "locked"
      },
      cta: {
        label: "PŘEČÍST ZÁZNAM V KRONICE →",
        sublabel: "Discord #kronika-vzniku",
        actionType: "discord",
        channel: "#kronika-vzniku",
        url: "https://discord.gg/MGnNWkcqQf"
      }
    },
    myJourney: {
      obtainedFor: "První setkání s Toilexem",
      title: "VŠIML/A JSEM SI, KAM MIZÍ MOJE POZORNOST.",
      story: "Zachytil/a jsi okamžik, kdy jsi sáhl/a po telefonu, otevřel/a další obsah nebo pokračoval/a bez skutečného rozhodnutí. Na několik sekund ses zastavil/a. A právě tím ses s Toilexem poprvé skutečně setkal/a.",
      point: "Pozornost se na chvíli vrátila zpět k tobě."
    }
  },

  // 009 — ZLOOPER
  {
    card_id: "glitch_3",
    order: 9,
    family: "GLITCH",
    familyDisplayName: "III — GLITCH",
    name: "Zlooper",
    edition: "FIRST EDITION",
    rarity: "RARE",
    status: "HISTORICKÝ GLITCH",
    gridPreview: "Parazit Reality ukrytý v opakování. Přesvědčí tě, že tentokrát nic měnit nemusíš. Začneš přece zítra.",
    quote: "„Zítra to uděláš jinak.“",
    howToGet: {
      whatIsIt: "Parazit Reality ukrytý v opakování. Stejný návyk. Stejná výmluva. Stejný den. Zlooper tě nemusí zastavit. Stačí, když tě přesvědčí, abys pokračoval/a stejně.",
      wayToArtifact: {
        symbol: "🔁",
        text: "Jeho první výskyt zatím nebyl plně zaznamenán. Až se Portál otevře, budeš muset Zloopera nejen najít… ale také narušit jeden vlastní loop."
      },
      availability: {
        text: "🟠 PŘICHÁZÍ V SEASON 0",
        color: "amber"
      },
      cta: {
        label: "ČEKAT NA OTEVŘENÍ PORTÁLU →",
        sublabel: "Discord #portály",
        actionType: "discord",
        channel: "#portály",
        url: "https://discord.gg/MGnNWkcqQf"
      }
    },
    myJourney: {
      obtainedFor: "Narušení vlastního loopu",
      title: "NARUŠIL/A JSEM OPAKUJÍCÍ SE VZOREC.",
      story: "Rozpoznal/a jsi něco, co ve svém životě opakuješ téměř automaticky. A alespoň jednou ses rozhodl/a jinak. Nemusel/a jsi změnit celý návyk. Stačilo vytvořit první trhlinu.",
      point: "Loop se poprvé přerušil."
    }
  },

  // 010 — DISCORD PORTAL
  {
    card_id: "relics_1",
    order: 10,
    family: "RELICS",
    familyDisplayName: "IV — RELICS",
    name: "Discord Portal",
    edition: "SEASON 0 RELIC",
    rarity: "COMMON",
    status: "SEASON 0 RELIC",
    gridPreview: "Relikvie první brány iWau Hry Reality. Místa, kde se první hráči začali scházet ještě před vznikem aplikace.",
    quote: "„První brána nebyla aplikace.“",
    howToGet: {
      whatIsIt: "Historická Relikvie průvodce iWau Hry Reality. Ještě před MVP1 existovalo místo na Discordu, kde se setkávali první hráči a testovala první pravidla světa. A právě tento okamžik označuje moment, kdy jsi ukázal/a svět iWau Hry Reality i někomu jinému.",
      wayToArtifact: {
        symbol: "🚪",
        text: "Ukaž Discord iWau Hry Reality alespoň jednomu člověku kolem sebe a jakmile projde onboardingem, získáš tento artefakt."
      },
      progress: "0 / 1 HRÁČŮ",
      availability: {
        text: "🟢 POUZE SEASON 0",
        note: "Po skončení Season 0 tato cesta zanikne.",
        color: "green"
      },
      cta: {
        label: "POSLAT iWAU DÁL →",
        sublabel: "hrareality.cz",
        actionType: "share",
        url: "https://hrareality.cz"
      }
    },
    myJourney: {
      obtainedFor: "Dosažení Levelu 2",
      title: "POMOHL/A JSI PROJÍT PRVNÍ BRÁNOU.",
      story: "Postoupil/a jsi původní Discord základnou Hry Reality. Právě tady jsi pomohl/a někomu ze tvého okolí vstoupit do iWau Hry Reality. Jednou ti za to může třeba poděkovat. Nikdy nevíš.",
      point: "Tady máš důkaz, že jsi pomohl/a tomu prvnímu."
    }
  },

  // 011 — MVP1 BRIDGE
  {
    card_id: "relics_2",
    order: 11,
    family: "RELICS",
    familyDisplayName: "IV — RELICS",
    name: "MVP1 Bridge",
    edition: "SEASON 0 RELIC",
    rarity: "RARE",
    status: "TRANSITION RELIC",
    gridPreview: "Most mezi Season 0 a první skutečnou verzí iWau Hry Reality. Okamžik, kdy se svět začíná měnit v hru.",
    quote: "„Každý svět jednou musí překročit hranici mezi představou a skutečností.“",
    howToGet: {
      whatIsIt: "Relikvie okamžiku, kdy iWau Hra Reality přestane existovat pouze na Discordu, ale přešla do reálné aplikace. MVP1 Bridge propojí první komunitní experimenty s první funkční verzí hry.",
      wayToArtifact: {
        symbol: "🌉",
        text: "Zapoj se do oficiálního testování nebo validace Season 1. Pouhé členství nestačí. Musíš být jedním z hráčů, kteří pomohou první verzi skutečně ověřit."
      },
      availability: {
        text: "⏳ ODEMČENÍ SE SEASON 1",
        color: "cyan"
      },
      cta: {
        label: "CHCI BÝT U TESTOVÁNÍ →",
        sublabel: "Discord testování / waitlist",
        actionType: "waitlist",
        url: "https://discord.gg/MGnNWkcqQf"
      }
    },
    myJourney: {
      obtainedFor: "Ověřená účast na validaci MVP1",
      title: "POMOHL/A JSEM OTEVŘÍT DALŠÍ SVĚT.",
      story: "Nečekal/a jsi, až bude první verze iWau Hry Reality hotová. Zapojil/a ses do jejího ověřování. Tvůj krok pomohl propojit experimenty Season 0 s první funkční verzí hry.",
      point: "Přešel/a jsi most mezi Discordem a MVP1."
    }
  },

  // 012 — GENERATION ZERO
  {
    card_id: "relics_3",
    order: 12,
    family: "RELICS",
    familyDisplayName: "IV — RELICS",
    name: "Generation Zero",
    edition: "GENERATION ZERO EDITION",
    rarity: "LEGENDARY",
    status: "PERMANENT OG RELIC",
    gridPreview: "Nečekali, až bude iWau Hra Reality hotová. Byli u toho, když teprve vznikala. První generace hráčů.",
    quote: "„Nečekali, až hra vznikne. Byli u toho, když se skládala.“",
    howToGet: {
      whatIsIt: "Finální Relikvie Season 0. Nevzniká za jeden Quest ani jeden Portál. Je záznamem toho, že jsi prošel/a dostatečnou částí první historie Hry Reality.",
      wayToArtifact: {
        symbol: "◈",
        text: "Staň se součástí Generation Zero."
      },
      conditions: [
        "8 / 12 ARTEFAKTŮ",
        "AKTIVITA V SEASON 0"
      ],
      availability: {
        text: "🔐 POUZE SEASON 0",
        note: "Poslední část podmínek bude odhalena před uzavřením Season. Po jejím skončení nebude možné Generation Zero získat.",
        color: "locked"
      },
      cta: {
        label: "ZOBRAZIT MŮJ PROGRESS →",
        sublabel: "Sledovat progress lištu",
        actionType: "progress"
      }
    },
    myJourney: {
      obtainedFor: "Dokončení cesty Generation Zero",
      title: "STAL/A JSEM SE GENERATION ZERO.",
      story: "Tahle karta nevznikla kvůli jednomu úkolu. Vznikla kvůli celé cestě. Vstoupil/a jsi. Reagoval/a na denní mise. Hrál/a v realitě. Objevoval/a postavy a Glitche. Procházel/a světem ještě v době, kdy se jeho pravidla teprve skládala. A zůstal/a jsi dost dlouho na to, abys viděl/a otevření další kapitoly (Season 1).",
      point: "Nebyl/a jsi první zákazník. Byl/a jsi součástí první generace."
    }
  }
];

export const FOUNDERS_CARDS: CardStaticData[] = [
  // F01 — FOUNDERS BADGE
  {
    card_id: "f01_founders_badge",
    order: 101,
    family: "FOUNDERS_MEMBERSHIP",
    familyDisplayName: "◆ FOUNDERS MEMBERSHIP",
    name: "Founders Badge",
    edition: "FOUNDERS EDITION",
    rarity: "FOUNDERS",
    status: "PERMANENT FOUNDER MARK",
    gridPreview: "Trvalý znak hráče, který podpořil Hru Reality v její zakladatelské fázi.",
    quote: "„Někteří přišli hrát hotovou hru. Jiní pomohli, aby vůbec mohla vzniknout.“",
    howToGet: {
      whatIsIt: "Founders Badge je historický znak hráčů, kteří podpořili vznik iWau Hry Reality prostřednictvím Founder Membership. Není součástí běžného progresu Season 0. Zaznamenává něco jiného: že jsi byl/a mezi lidmi, kteří projektu pomohli ještě před jeho plným spuštěním.",
      wayToArtifact: {
        symbol: "◆",
        text: "Získej libovolnou úroveň Founder Membership. Artefakt bude následně přidán do tvého osobního Archivu."
      },
      conditions: [
        "AKTIVOVAT FOUNDER MEMBERSHIP"
      ],
      availability: {
        text: "🟢 FOUNDERS MEMBERSHIP",
        note: "Až Founder Membership jednou definitivně uzavřeme, tento stav se automaticky změní na 🔒 FOUNDERS ERA UKONČENA (Artefakt již nelze získat).",
        color: "green"
      },
      cta: {
        label: "STÁT SE FOUNDER MEMBEREM →",
        sublabel: "hrareality.cz/zakladatel",
        actionType: "founders",
        url: "https://hrareality.cz/zakladatel"
      }
    },
    myJourney: {
      obtainedFor: "Founder Membership",
      title: "PODPOŘIL/A JSEM VZNIK HRY REALITY.",
      story: "Tento Artefakt zaznamenává okamžik, kdy ses stal/a Founder Memberem Hry Reality. Nevstoupil/a jsi až do hotového světa. Rozhodl/a ses podpořit jeho vznik v době, kdy se stále stavěl. Founders Badge proto není pouze odměnou za Membership. Je to trvalý záznam tvého místa v historii Hry Reality. Tento znak s tebou zůstává i v dalších Seasons.",
      point: "Tento znak s tebou zůstává i v dalších Seasons."
    }
  },

  // F02 — FOUNDERS
  {
    card_id: "f02_founders",
    order: 102,
    family: "FOUNDERS_MEMBERSHIP",
    familyDisplayName: "◆ FOUNDERS MEMBERSHIP",
    name: "Founders",
    edition: "FOUNDERS EDITION",
    rarity: "FOUNDERS",
    status: "HIGH SUPPORT ARTEFAKT",
    gridPreview: "Artefakt těch, kteří se rozhodli podpořit vznik iWau Hry Reality víc, než bylo nutné.",
    quote: "„Nemusel/a jsi udělat víc. Přesto ses tak rozhodl/a.“",
    howToGet: {
      whatIsIt: "Speciální Founders Artefakt vytvořený pro hráče, kteří podpořili vznik iWau vyšší úrovní Founder Membership. Zachycuje zakladatele iWau Hry Reality v podobě vytvořené pouze pro Founders Era. Nejde o kartu potřebnou k dokončení Season 0. Je to dobrovolný historický symbol vyšší podpory projektu.",
      wayToArtifact: {
        symbol: "◆",
        text: "Aktivuj jednu z vyšších úrovní Founder Membership, která tento Artefakt obsahuje. Pokud už základní Founder Membership vlastníš, můžeš svou podporu zvýšit upgradem."
      },
      conditions: [
        "VYŠŠÍ FOUNDER MEMBERSHIP"
      ],
      availability: {
        text: "🟣 FOUNDERS EXCLUSIVE",
        note: "Po skončení prodeje: 🔒 FOUNDERS ERA UKONČENA (Artefakt zůstal pouze hráčům, kteří jej získali během zakladatelského období).",
        color: "purple"
      },
      cta: {
        label: "PROZKOUMAT FOUNDERS ÚROVNĚ →",
        sublabel: "hrareality.cz/zakladatel",
        actionType: "founders",
        url: "https://hrareality.cz/zakladatel"
      }
    },
    myJourney: {
      obtainedFor: "Vyšší úroveň Founder Membership",
      title: "PODPOŘIL/A JSEM VÍC, NEŽ BYLO NUTNÉ.",
      story: "K tomu, aby ses stal/a Founder Memberem, stačila základní úroveň. Ty ses rozhodl/a jít dál. Tento Artefakt zaznamenává okamžik, kdy jsi iWau Hru Reality podpořil/a vyšší úrovní Founder Membership v době, kdy její další části stále teprve vznikaly. Neříká, že jsi důležitější hráč. Říká něco jiného: Když bylo potřeba svět podržet, rozhodl/a ses ho podržet víc. A tento okamžik zůstává součástí tvého Archivu.",
      point: "Když bylo potřeba svět podržet, rozhodl/a ses ho podržet víc."
    }
  }
];

export const ALL_STATIC_CARDS: CardStaticData[] = [
  ...SEASON_0_CARDS,
  ...FOUNDERS_CARDS
];

export const CARDS_BY_ID = new Map<string, CardStaticData>(
  ALL_STATIC_CARDS.map(c => [c.card_id, c])
);
