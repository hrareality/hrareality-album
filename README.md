# Kronika Hráče — Hra Reality Sběratelské Album

Tato Next.js aplikace zajišťuje herní alba pro hráče platformy **Hra Reality** na adrese **album.hrareality.cz**. Aplikace zajišťuje přihlášení přes Discord OAuth2, spravuje osobní sbírku karet (SSR synchronizace s Airtable databází) a nabízí zabezpečený webhook endpoint pro automatické udělování karet z Make.com (Integromat).

---

## 🛠️ Kompletní Setup Guide (Krok za krokem)

### KROK 1: Vytvoření Discord OAuth2 Aplikace
1. Přejděte na [Discord Developer Portal](https://discord.com/developers/applications) a klikněte na **New Application**.
2. Pojmenujte aplikaci (např. `Hra Reality Album`).
3. V levém menu přejděte na záložku **OAuth2** a následně **Redirects**.
4. Klikněte na **Add Redirect** a přidejte URL adresy:
   * **Pro lokální vývoj:** `http://localhost:3000/api/auth/callback/discord`
   * **Pro produkci:** `https://album.hrareality.cz/api/auth/callback/discord`
5. Uložte změny tlačítkem **Save Changes**.
6. Z horní části této stránky si bezpečně zkopírujte:
   * **Client ID** (vepište do `DISCORD_CLIENT_ID`)
   * **Client Secret** (vygenerujte pomocí *Reset Secret* a vepište do `DISCORD_CLIENT_SECRET`)

---

### KROK 2: Nastavení Databáze v Airtable
Vytvořte novou bázi (Base) v Airtable a vytvořte v ní přesně tyto **tři tabulky** s odpovídajícími názvy a datovými typy sloupců:

#### Tabulka 1: `users`
Slouží k automatické evidenci registrovaných hráčů.
*   `discord_id` — **Single line text** *(Primární klíč)*
*   `username` — **Single line text** *(Discord uživatelské jméno)*
*   `discriminator` — **Single line text** *(Discord tag, např. 0000)*
*   `avatar_url` — **URL** *(Odkaz na profilový obrázek)*
*   `created_at` — **Date** *(Datum registrace)*
*   `completion_percent` — **Formula** s hodnotou: `owned_cards / 12 * 100` *(Zobrazí % zkompletování kroniky)*

#### Tabulka 2: `cards`
Archiv všech 12 sběratelských artefaktů hry.
*   `card_id` — **Single line text** *(Primární klíč, např. S0-001 až S0-012)*
*   `name` — **Single line text** *(Název karty)*
*   `family` — **Single select** s možnostmi: `AWAKENING`, `POSTAVY_IWAU`, `GLITCH`, `RELICS`
*   `lore` — **Long text** *(Lore příběh karty)*
*   `edition_type` — **Single select** s možnostmi: `FIRST_EDITION`, `BASE`
*   `image_url` — **URL** *(Volitelný odkaz na PNG asset karty, pokud chybí, automaticky se vykreslí neonový placeholder)*
*   `is_locked` — **Checkbox** *(Označte u skrytých / tajných karet, na albu se zobrazí jako locked "???")*
*   `sort_order` — **Number** *(Pořadí zobrazení v albu od 1 do 12)*

#### Tabulka 3: `owned_cards`
Spojovací tabulka definující, které karty hráč reálně získal.
*   `id` — **Autonumber** *(Primární klíč)*
*   `discord_id` — **Single line text** *(Cizí klíč spojující uživatele)*
*   `card_id` — **Single line text** *(Cizí klíč spojující karty)*
*   `edition` — **Single select** s možnostmi: `FIRST_EDITION`, `BASE`
*   `obtained_at` — **Date** *(Datum získání)*
*   `obtained_via` — **Single line text** *(Např. onboarding, quest, referral, founder_drop)*

---

### KROK 3: Konfigurace `.env.local`
Zkopírujte šablonový soubor `.env.local.example` a vytvořte soubor `.env.local` v kořenovém adresáři:
```bash
cp .env.local.example .env.local
```
Vyplňte příslušné klíče:
*   `AIRTABLE_API_KEY` — Váš osobní přístupový token (Personal Access Token) z [Airtable Token Creation](https://airtable.com/create/tokens) s právy `data.records:read` a `data.records:write`.
*   `AIRTABLE_BASE_ID` — ID vaší báze (naleznete v URL báze na Airtable, začíná na `app...`).
*   `AUTH_SECRET` — Vygenerujte silný tajný klíč pomocí příkazu `openssl rand -base64 32`.
*   `WEBHOOK_SECRET` — Libovolné silné heslo, které zajistí autorizaci Make.com (vepište stejný řetězec do Make).

---

### KROK 4: Nasazení na Vercel & DNS Nastavení
1. **Deployment:** Připojte repozitář k platformě **Vercel** a v nastavení projektu vložte všechny proměnné prostředí z `.env.local`.
2. **Doména:** V sekci *Settings -> Domains* ve Vercelu přidejte doménu `album.hrareality.cz`.
3. **DNS Konfigurace:** U svého registrátora domény (např. Wedos, active24) přidejte DNS záznam typu **CNAME**:
   * **Název (Host):** `album`
   * **Hodnota (Points to):** `cname.vercel-dns.com.`

---

## 🤖 Make.com Webhook Integrace (Automatické udělování karet)

Propojení plnění úkolů na Discordu nebo v reálném světě s albem hráče probíhá přes Make.com flow.

### Nastavení Make HTTP modulu:
1. Do svého Make scénáře vložte modul **HTTP -> Make a request**.
2. **Method:** `POST`
3. **URL:** `https://album.hrareality.cz/api/webhook/grant-card`
4. **Headers:**
   * **Name:** `x-webhook-secret`
   * **Value:** `[Zde vložte tajný klíč z vaší proměnné WEBHOOK_SECRET]`
5. **Body type:** `Raw`
6. **Content type:** `JSON (application/json)`
7. **Request content (Payload):**
```json
{
  "discord_id": "315487954124589056",
  "card_id": "S0-003",
  "edition": "FIRST_EDITION",
  "obtained_via": "quest"
}
```

### Ošetření chybových stavů & Idempotence:
*   **Idempotence:** Webhook je plně idempotentní. Pokud hráč kartu již vlastní, endpoint vrátí stav `200 Success` s parametrem `"already_owned": true` a nevytvoří v Airtable duplicitní záznam.
*   **Automatická registrace uživatelů:** Pokud je karta přiřazena uživateli, který se na web ještě nepřihlásil (neexistuje v tabulce `users`), webhook automaticky vytvoří jeho profilový placeholder. Jakmile se hráč poprvé přihlásí, jeho profil se spáruje a karta na něj bude čekat.

---

## ✍️ Manuální udělování karet (Administrace)

Pokud potřebujete kartu hráči přiřadit ručně bez automatických scénářů:
1. Otevřete tabulku `owned_cards` v Airtable.
2. Přidejte nový řádek.
3. Vyplňte sloupce:
   * `discord_id`: Vložte přesné Discord ID uživatele (např. z tabulky `users`).
   * `card_id`: Vložte ID karty (např. `S0-001`).
   * `edition`: Zvolte `BASE` nebo `FIRST_EDITION`.
   * `obtained_at`: Zvolte datum odeslání/získání.
   * `obtained_via`: Např. `founder_drop` nebo `manual`.
4. Při příštím načtení stránky hráče se karta okamžitě barevně odemkne v jeho albu!
