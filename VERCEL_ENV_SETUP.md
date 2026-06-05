# 🚀 Nastavení Vercel Preview & Pre-production prostředí pro celý web

Tato příručka tě krok za krokem provede kompletním nastavením a propojením obou částí webu **Hra Reality** na platformě **Vercel** s důrazem na **Preview (Pre-production) prostředí**, zabezpečení a integraci s **Discord OAuth2** a **Airtable**.

Web se skládá ze dvou samostatných Vercel projektů:
1.  **Hlavní prezentační web (`hrareality-main`):** Statický Vite + React + TypeScript projekt.
2.  **Hráčské album (`hrareality-album`):** Dynamická Next.js 16 (App Router) aplikace.

---

## 1. Bezpečnostní konfigurace (`vercel.json`) pro oba weby

Pro oba projekty byly vytvořeny/upraveny konfigurační soubory `vercel.json` s cílem zajistit **maximální bezpečnost** a bezchybné fungování klientského směrování (routing). Oba projekty nyní disponují kompletní sadou HTTP security headers, které zaručí špičkové hodnocení **A+** v bezpečnostních auditech (např. *securityheaders.com*):

### A. Hlavní web (`hrareality-main/vercel.json`)
Kromě HTTP hlaviček obsahuje také pravidlo pro **klientský routing (rewrites)**. To je klíčové, aby po zobrazení preview verze a přechodu na `/collection` (nebo jinou podstránku) nedošlo k chybě `404 Not Found` při obnovení stránky (F5).
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-DNS-Prefetch-Control", "value": "on" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

### B. Hráčské album (`hrareality-album/vercel.json`)
Zajišťuje stejnou úroveň zabezpečení pro Next.js aplikaci, kde routing a vykreslování spravuje framework Next.js nativně.
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-DNS-Prefetch-Control", "value": "on" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

---

## 2. ⚠️ Výzva s Discord OAuth v Preview prostředí

Discord OAuth2 z bezpečnostních důvodů **nepodporuje zástupné znaky (wildcards) v Redirect URI**. 
Protože Vercel pro každý Preview deployment generuje unikátní náhodnou URL adresu (např. `https://hrareality-album-git-new-feature.vercel.app`), pokus o přihlášení přes Discord v tomto preview by skončil chybou **Redirect URI Mismatch**.

### 🌟 Doporučené řešení: Statická Preview větev (Pre-production)

Chcete-li plně využívat Preview prostředí včetně funkčního Discord přihlašování, nastavíme **statickou větev pro předprodukční testování** (např. větev `preview` nebo `dev`):

1.  Ve svém Vercel projektu pro **hráčské album** běž do **Settings > Domains**.
2.  Přidej subdoménu určenou pro testování (např. `preview.album.hrareality.cz`).
3.  V konfiguraci této domény zvol možnost **Git Branch** a přiřaď ji ke své testovací větvi (např. `preview`).
4.  Nyní každý push do větve `preview` automaticky aktualizuje web na této **stálé adrese**, kterou můžeš bezpečně zaregistrovat v Discord Developer Portálu!

---

## 3. Registrace Redirect URIs v Discord Developer Portálu

V [Discord Developer Portálu](https://discord.com/developers/applications) v sekci **OAuth2 > Redirects** přidej následující povolené adresy zpětného volání:

*   **Pro lokální vývoj:**
    `http://localhost:3000/api/auth/callback/discord`
*   **Pro předprodukční Preview doménu (statickou):**
    `https://preview.album.hrareality.cz/api/auth/callback/discord`
*   **Pro finální produkční verzi:**
    `https://album.hrareality.cz/api/auth/callback/discord`

> [!TIP]
> **Doporučená best practice:** Vytvoř si v Discord Developer Portálu **dvě samostatné aplikace**.
> 1. *Hra Reality (Produkce)* – Pouze pro produkční doménu.
> 2. *Hra Reality (Test)* – Pro lokální vývoj a Preview doménu. 
> Tím zajistíš, že testovací přihlášení nebudou ovlivňovat produkční statistiky a můžeš bezpečně měnit ikony či texty.

---

## 4. Konfigurace proměnných prostředí (Environment Variables) ve Vercelu

Při nasazování na Vercel musíme nastavit proměnné prostředí odděleně pro **Preview** a **Production** prostředí v administraci Vercelu (**Settings > Environment Variables**).

> [!NOTE]
> Hlavní prezentační web (`hrareality-main`) je čistě statický a **nevyžaduje žádné proměnné prostředí**. 
> Všechny níže uvedené proměnné se nastavují **pouze pro projekt hráčského alba (`hrareality-album`)**:

| Název proměnné | Prostředí | Hodnota | Popis |
| :--- | :--- | :--- | :--- |
| **`AUTH_SECRET`** | Preview & Production | *Vygenerovaný tajný klíč* | Tajný klíč pro šifrování session (vygeneruj pomocí `openssl rand -base64 32`) |
| **`DISCORD_CLIENT_ID`** | Production | *Produkční Client ID* | Client ID z Discord Developer Portálu |
| **`DISCORD_CLIENT_SECRET`**| Production | *Produkční Secret* | Client Secret z Discord Developer Portálu |
| **`DISCORD_CLIENT_ID`** | Preview | *Testovací Client ID* | Client ID testovací Discord aplikace |
| **`DISCORD_CLIENT_SECRET`**| Preview | *Testovací Secret* | Client Secret testovací Discord aplikace |
| **`AIRTABLE_API_TOKEN`** | Preview & Production | `pat...` | Tvůj Airtable Personal Access Token (PAT) |
| **`AIRTABLE_BASE_ID`** | Preview & Production | `app...` | ID tvé Airtable databáze |
| **`WEBHOOK_SECRET`** | Preview & Production | *Vlastní silné heslo* | Tajný klíč pro zabezpečení webhooku (např. pro Make.com) |

*NextAuth v5 (Next.js 16) na Vercelu automaticky detekuje systémovou proměnnou `VERCEL_URL` a nastaví podle ní vnitřní URL adresu, takže proměnnou `NEXTAUTH_URL` již ve Vercelu nemusíš ručně konfigurovat!*

---

## 5. Jak propojit a nasadit obě aplikace pomocí Vercel CLI (Krok za krokem)

Pokud chceš nasazovat projekt přímo z terminálu přes Vercel CLI, postupuj u obou složek následovně:

### Krok 1: Přihlášení do Vercel účtu
```bash
vercel login
```

### Krok 2: Propojení a nasazení hlavního webu (`hrareality-main`)
Přejdi ve svém terminálu do složky hlavního webu a spusť:
```bash
# Propojení s projektem na Vercelu
vercel link
# Vývojářské preview nasazení
vercel
# Finální produkční nasazení (přepíše hrareality.cz)
vercel --prod
```

### Krok 3: Propojení a nasazení hráčského alba (`hrareality-album`)
Přejdi ve svém terminálu do složky hráčského alba a spusť:
```bash
# Propojení s projektem na Vercelu
vercel link
# Stažení proměnných prostředí pro lokální vývoj (poté, co je nastavíš v dashboardu)
vercel env pull
# Vývojářské preview nasazení
vercel
# Finální produkční nasazení (přepíše album.hrareality.cz)
vercel --prod
```
