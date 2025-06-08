# Playwright Certification TEGB

## 📊 Stav testování

| Typ testu | Status | Pokrytí | Poznámky |
| --- | --- | --- | --- |
| **E2E** | ✅ Kompletní | 100%  | |
| **API** | ✅ Kompletní | 100% | Včetně negativních testů |
| **DDT** | ✅ Kompletní | 100% | Detekce limitů bilance a max. počtu účtů |
| **Atomické** | ✅ Kompletní | 100% | Vícejazyčná kontrola |
| **Vizuální** | ✅ Hotovo | 100% | |

## 🌍 Vícejazyčnost

### Konfigurace

- **Environment jazyková proměnná:** `APP_LANG`
- **Výchozí jazyk:** `ces` (čeština)
- **Podporované jazyky:** `[ces, eng]`
- **Slovník:** `/src/assets/dictionaries/dictionary.ts`
- **Playwright config:** `/playwright.config.ts`

* * *

## 📋 Spuštění testů

### Playwright UI

```
 npm start
 npx playwright test --ui
```

### Vícejazyčné testování

```
npm run test:ces # Čeština (výchozí)
npm run test:eng # Angličtina

APP_LANG=ces npm start
APP_LANG=eng npm start
```

### Shell

```
npx playwright test
APP_LANG=eng npx playwright test --project=chromium --grep=tag
```

### Dostupné tagy

```yml
@atomic
@e2e
@api
@visual
@ddt
@regress
@regress-ui
@regress-api
```

* * *

## 🐛 Bug Report

### Souhrn nálezů

| Kategorie | Počet kritických | Počet drobných | Celkem |
| --- | --- | --- | --- |
| Login formulář | 6   | 2   | 8   |
| Registrační formulář | 4   | 1   | 5   |
| Dashboard | 8   | 2   | 10   |
| Editace profilu | 7   | 1   | 8   |
| API | 3   | 1   | 3   |
| **CELKEM** | **27** | **7** | **34** |

* * *

## 🚨 Kritické chyby

### Login formulář

| ID  | Chyba | Popis |
| --- | --- | --- |
| **LF-001** | Neodpovídající data-testid | Button "Ztracené heslo" má `data-testid="registration-link"`, mělo by být např. `"forgotten-password-button"` |
| **LF-002** | Nefunkční tlačítko | Tlačítko "Ztracené heslo" neprovádí žádnou akci (mimo bodu níže) |
| **LF-003** | Nepřekládají se validační hlášky | Validační chyby se nepřepínají při změně jazyka jazyka (aktualizují se s opětovným odesláním nesprávných dat, nebo kliknutím na "Ztracené heslo") |
| **LF-004** | Chybí CZ překlad | Error message má jen EN text: "Login failed, check your credentials and try again." |
| **LF-005** | Duplikace API volání | metody `/tegb/profile` a `/tegb/accounts` jsou po přihlášení volány 2x za sebou |
| **LF-006** | Zpoždění login preflight | Preflight požadavek metody `/tegb/login` je odesílán cca 200ms po POST volání - pozorováno pouze v testovacím prostředí Playwright pro Firefox, který jediný i zde dodržuje CORS. V PC prohlížeči toto chování pozorováno nebylo. |

### Registrační formulář

| ID  | Chyba | Popis |
| --- | --- | --- |
| **RF-001** | Neuloží se Email | Na `/tegb/register` se odešle, ale `/tegb/profile` jej nevrací (chyba API) |
| **RF-002** | Nevalidovaná pole | Pole "Uživatelské jméno" a "Password" se nevalidují (odesílají se prázdná) |
| **RF-003** | Nekonzistentní validace emailu | Prázdný email = alert, nevalidní email = formulářová validace |
| **RF-004** | Nerespektuje jazyk | Výběr jazyka není nabízen ani respektován z login formuláře |

### Dashboard

| ID  | Chyba | Popis |
| --- | --- | --- |
| **DB-001** | Netestovatelná pole | Detail profilu - nelze efektivně testovat obsah polí "Jméno", "Příjmení", "Email", "Telefon", "Věk" - hodnoty jsou v prostém textu bez data-testid |
| **DB-002** | Přetékání hodnot | Detail profilu - Dlouhé hodnoty přetékají nadřazený rámec |
| **DB-003** | Nefunkční menu | Levé menu obsahuje pouze neupravené texty bez funkcí |
| **DB-004** | Nerespektovaný jazyk | Výběr jazyka není nabízen ani respektován z login formuláře |
| **DB-005** | Nefunkční tlačítko přidat | Tlačítko "Přidat účet" nefunguje |
| **DB-006** | Chyba při 3+ účtech | Při více než 3 účtech UI zobrazuje chybu, i když API `/tegb/accounts` data vrací |
| **DB-007** | Nerespektovaný jazyk | Při chybě zobrazení detailu účtů je zobrazena EN chyba "Unexpected error occured. Please try again later." i když zbytek stránky je v CZ |
| **DB-008** | Reload odhlásí uživatele | Po reloadu stránky dojde k odhlášení - přechod na login s nutností nového přihlášení (projevuje se i při editaci profilu) |

### Editace profilu

| ID  | Chyba | Popis |
| --- | --- | --- |
| **EP-001** | Nevalidovaná textová pole | Textová pole (mimo "Věk") mohou být prázdná |
| **EP-002** | Nekonzistentní validace věku | Prázdný/nevalidní věk se validuje alertem místo error-message |
| **EP-003** | Chybí ID u inputů | Labely odkazují na `id`, ale inputy mají jen `data-testid` |
| **EP-004** | Překlep v data-testid | "chage-{...}-input" → chybí "n" v "change" |
| **EP-005** | Nerespektuje jazyk | Výběr jazyka není nabízen ani respektován z login formuláře |
| **EP-006** | Chybí grafika success message | Success message se zobrazuje jako prostý text |
| **EP-007** | Nesprávný jazyk success message | Success message je v EN, zbytek stránky v CZ (zobrazuje se na Dashboardu) |

### API

| ID  | Chyba | Popis |
| --- | --- | --- |
| **API-001** | Limity bilance účtů | API `/tegb/accounts/create`,  `/tegb/accounts/change-balance` neakceptují hodnoty bilance &lt; -99999999.99 a &gt; 999999999.99 (HTTP 500) |
| **API-002** | Účty nelze mazat | API nemá metody pro mazání uživatele, nebo jeho účtu (dost možná je to správně, ale takovou informaci nemám k dispozici) |
| **API-003** | Změna zůstatku nepřijímá záporné částky | API `/tegb/accounts/change-balance` neakceptuje v hodnotě `amount` záporné častky |

* * *

## ⚠️ Drobné nedostatky

### Styling a konvence

| ID  | Oblast | Popis | Priorita |
| --- | --- | --- | --- |
| **S-001** | Login/Registrace | Class "Login" a "Form" začínají velkým písmenem | Nízká |
| **S-002** | Všechny stránky | Nepotřebné výchozí komentáře v HTML | Nízká |
| **S-003** | Registrace | Chybí logo a přepínače jazyků | Střední |
| **S-004** | Dashboard, Editace profilu | Chybí přepínače jazyků | Střední |
| **S-005** | Dashboard | Class "App" začíná velkým písmenem | Nízká |
| **S-006** | Dashboard | Div s účty nemá data-testid | Nízká |
| **S-007** | Editace profilu | Věk se validuje jako číslo, ale je textové pole | Nízká |
| **S-008** | API | Metody, které mají informačí hodnotu success vrací HTTP 201 i když nic nevytváří. 201 by měly vracet pouze metody, které vytváří nové entitky | Střední |
