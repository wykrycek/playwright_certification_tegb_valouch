# playwright_certification_tegb_valouch

# Stavy testů:
## 1. E2E
### ✘ nedokončeno
- Nevyřešil jsem zatím optimální průchod testu aby dodržoval obecné předpoklady o podobě a zároveň spolehlivě poukazoval na nalezené chyby
## 2. API
### ✔ kompletní (s přehahem o negativní testy)
## 3. DDT
### ✔ kompletní (s přehahem o detekci limitů bilance učtu na API a miximálního počtu zobrazených účtů v UI)
## 4. Atomické testy
### ✔ kompletní (s přesahem o vícejazyčnou kontrolu pomocí slovíku)
## 5. Vizuální testy
### ✔ hotovo (s tím, že nevím, jakou/jaké verze testů ještě ponecháp k odevzání)

---

## Vícejazyčnost:
- řešeno pomocí env proměnné APP_LANG, např: `APP_LANG=eng npm start`, nebo `npm run test:eng`
- slovník je umístěn v `/src/assets/dictionaries/dictionary.ts` a vrací obsah podle nastavené env `APP_LANG` (není potřeba předávat dodatečné parametry, což prozatím asi stačí)
- v `/playwright.config.ts` je ošetřena výchozí hodnota na `ces`

---

# Bug Report

## Kritické chyby

### Login formulář

#### Ztracené heslo - neodpovídající data-testid
- **Popis:** Button má `data-testid="registration-link"`, mělo by být např. `"forgotten-password-button"`

#### Ztracené heslo - nefunkční tlačítko
- **Popis:** Tlačítko neprovádí žádnou akci (vyjma bodu níže)

#### Validační error messages - nepřepínají se podle vybraného jazyka
- **Popis:** Nepřepínají se podle vybraného jazyka (aktualizují se s opětovným odesláním nesprávných dat, nebo kliknutím na "Ztracené heslo")

#### Validační error message chybného přihlášení - chybí CZ překlad
- **Popis:** Nemá CZ překlad (jen EN "Login failed, check your credentials and try again.")

### Registrační formulář

#### Neuloží se hodnota "Email"
- **Popis:** Formulář jej odešle, ale API `/tegb/profile` jej nevrací

#### Validace formuláře - nevalidovaná pole
- **Popis:** Nejsou validována pole "Uživatelské jméno" a "Password" (odesílají se i prázdná: `{"username":"","password":"","email":"test@example.com"}`)

#### Validace formuláře - nekonzistentní validace emailu
- **Popis:** Prázdný email je validován alertem, nevalidní email je validován formulářem podle typu pole (obojí by bylo lepší nahradit "error-message")

#### Nerespektuje volbu jazyka z Login formuláře
- **Popis:** Výběr jazyka není nanízen, ani není respektována volba z login formuláře

### Dashboard

#### Nelze efektivně testovat obsah polí
- **Popis:** Nelze efektivně testovat obsah polí "Jméno", "Příjmení", "Email", "Telefon", "Věk" - hodnota je vložena jako prostý text v jednom "div" elementu společně s labelem "strong". Vhodné by bylo hodnotu zabalit do nějakého elementu a přiřadit data-testid

#### Přetékání hodnot nadřazený rámec
- **Popis:** Hodnoty "Jméno", "Příjmení", "Email", "Telefon", "Věk" přetékají nadřazený rámec při větší délce obsahu (nejspíš souvisí s předchozím bodem)

#### Levé menu - nefunkční tlačítka
- **Popis:** V levém menu chybí funkce tlačítek - zobrazují se pouze graficky neupravené texty položek seznamu

#### Nerespektuje volbu jazyka z Login formuláře
- **Popis:** Výběr jazyka není nabízen, ani není respektována volba z login formuláře

#### Nastavení účtů - nefunkční tlačítko přidat
- **Popis:** Tlačítko přidat nefunguje (proces je aktuálně v rámci testu řešen přes API)

#### Nastavení účtů - chybová hláška při více než 3 účtech
- **Popis:** Pokud je více účtů než 3, zobrazuje se chybová hláška "Unexpected error occured. Please try again later.". Přičemž ale API metoda `/tegb/accounts` data účtů vrací

### Editace profilu

#### Validace - textová pole se nevalidují
- **Popis:** Textová pole (mimo "Věk") se nevalidují (mohou být prázdná)

#### Validace Věk - nekonzistentní validace
- **Popis:** Prázdné a nevalidní se validuje alertem (obojí by bylo lepší nahradit "error-message")

#### Chybí ID u inputů
- **Popis:** Labely u inputu odkazují na id inputu (parametrem "for"), ale inputy nemají id definované. Inputy mají definovány jen "data-testid" parametry

#### Překlep v data-testid
- **Popis:** Překlep v data-testid: "chage-{...}-input" -> chybí "n" v "chage". U všech input polí (Jméno, Příjmení, Email, Telefon, Věk)

#### Nerespektuje volbu jazyka z Login formuláře
- **Popis:** Výběr jazyka není nabízen, ani není respektována volba z login formuláře

#### Success message - chybí grafika
- **Popis:** Success message - není definována grafika - zobrazuje se jako prostý text

#### Success message - nesprávný jazyk
- **Popis:** Success message - je v EN znění, zatímco zbytek textu na stránce je v CZ

### Vytváření bankovních účtů

#### API - nepřijímá velmi nízné a velmi vysoké hodnoty "bilance"
- **Popis:** API nepřijme částku nižší než -99999999.99 a vyšší než 999999999.99. Při překročení se vrací HTTP 500 s hláškou `"Internal server error"`

## Drobné nedostatky

### Login formulář, Registrační formulář
- **Popis:** Class rámců "Login" a "Form" nestandardně začínají velkým písmenem

### Login formulář, Registrační formulář, Dashboard
- **Popis:** Stránky obsahují nepotřebné komentáře v HTML v hlavičce i body

### Registrační formulář
- **Popis:** Chybí logo a přepínače jazyků

### Dashboard
- **Popis:** Class rámce "App" nestandardně začíná velkým písmenem

### Dashboard - div s informacemi o účtech
- **Popis:** Div s informacemi o účtech uživatele nemá data-testid, pouze class "accounts" (div s profilem uživatele ano - data-testid="account-summary")

### Editace profilu - validace Věk
- **Popis:** Validuje se na číslo, ale typ pole je text

---