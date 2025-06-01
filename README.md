# playwright_certification_tegb_valouch


BUGS:
Login formulář / Ztracené heslo - neodpvídající podoba buttonu: data-testid="registration-link". Mělo by být např "forgotten-password-button"
Login formulář / Ztracené heslo - tlačítko neprovádí žádnou akci (vyjma bodu níže :-) )
Login formulář / validační error message inputů - nepřepínají se podle vybarného jazyka (aktualizují se s opětovným odesláním neprávných dat, nebo kliknutím na "Ztracené heslo")
Login formulář / validační error message chybného hpřihlášení - nemá CZ překlad (jen EN "Login failed, check your credentials and try again.")

Registrační formulář - neuloží se hodnota "Email" - formulář jej odešle, ale API /tegb/profile jej nevrací.
Registrační formulář / validace formuláře - nejsou validována pole "Uživatelské jméno" a "Password" (odesílají se i přádná: {"username":"","password":"","email":"test@example.com"})
Registrační formulář / validace formuláře - prázdný email je validován alertem, nevalidní email je validován formulářem podle typu pole. (obojí by bylo lepší nahradit "error-message")
Registrační formulář - nerespektje volbu jazyka v Login formuláři

Dashboard - nelze efektivně testovat obsah polí "Jméno", "Příjmení", "Email", "Telefon", "Věk" - hodnota je vložena jako prostý text v jednom "div" elementu společně s labelem "strong". Vhodné by bylo hodnotu zabalit do nějakého elementu a přiřadit data-testid.
Dashboard - hodnoty "Jméno", "Příjmení", "Email", "Telefon", "Věk" přetékají nadřazený rýmec při větší délce obsahu. (nejspíš souvisí s předchozím bodem)
Dashboard - v levém menu chybí funkce tlačítek - zobrazují se pouze graficky neupravené texty položek seznamu.
Dashboard - nerespektje volbu jazyka v Login formuláři

Dashboard / nastavení účtů - Tlačítko přidat nefunguje (proces je aktuálně v rámci testu řešen přes API)
Dashboard / nastavení účtů - Pokud je více účtů než 4, zobrazuje se chybová hláška "Unexpected error occured. Please try again later.". Přičemž ale API metoda /tegb/accounts data účtů vrací.

Editace profilu / validace - textová pole (mimo "Věk") se nevalidují (mohou být prázdná )
Editace profilu / validace / Věk - prázdné a nevalidní se validuje alertem (obojí by bylo lepší nahradit "error-message")
Editace profilu - labely u inputu odkazují na id inputu (parametrem "for"), ale inputy nemají id definované. Inputy mají definovány jen "data-testid" parametry
Editace profilu - překlep v data-testid: "chage-{...}-input" -> chybí "n" v "chage". U všech input polí (Jméno, Příjmení, Email, Telefon, Věk)
Editace profilu (Dashboard) - succes message - není definována grafika - zobrazuje se jako prostý text
Editace profilu (Dashboard) - succes message - je v EN znění, zatímco zbytek textu na stránce je v CZ

SOFT BUGS:
Login formulář, Registrační formulář - class rámců "Login" a "Form" nestandardně začínají velkým písmenem
Login formulář, Registrační formulář, Dashboard - stránky obsahují nepotřebné komentáře v HTML v hlavičce i body
Registrační formulář - chybí logo a přepínače jazyků
Dashboard - class rámce "App" nestandardně začíná velkým písmenem
Dashboard - div s informacemi o účtech uživatele nemá data-testid, pouze class "accounts" (div a profilem uživatele ano - data-testid="account-summary")
Dashboard / Editace profilu / validace / Věk - validuje se na číslo, ale typ pole je text
