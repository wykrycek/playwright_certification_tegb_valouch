import { test, expect } from "@playwright/test";
import { DashboardPage } from "../../../src/pages/dashboard_page.ts";
import { LoginPage } from "../../../src/pages/login_page.ts";
import { accountsResponse, BackendApi, profileResponse } from "../../../src/api/backend_api.ts";
import dictionary from "../../../src/assets/dictionaries/dictionary.ts";

test.describe("Atomické Testy - Dashboard", {
    tag: "@atomic",
}, () => {
    let dashboardPage: DashboardPage;
    let profileDetail: profileResponse;
    let profileAccounts: accountsResponse;

    test.beforeEach(async ({ page }) => {
        // Inicializace API a přihlašovací stránky
        const backendApi = new BackendApi(page.request);
        const loginPage = new LoginPage(page);
        const responseLogin = loginPage.page.waitForResponse(`${process.env.TEGB_URL_BACKEND}/tegb/login`)
        dashboardPage = await loginPage.openAndLogin(
            process.env.TEGB_URL_FRONTEND || "",
            process.env.TEGB_USERNAME || "",
            process.env.TEGB_PASSWORD || ""
        );
        const responseLoginBody = await (await responseLogin).json();
        const access_token = responseLoginBody.access_token;
        const responseProfileDetail = await backendApi.getProfile(access_token);
        const responseProfileAccounts = await backendApi.getBankAccounts(access_token);
        profileDetail = await responseProfileDetail.json();
        profileAccounts = await responseProfileAccounts.json();
    });
    
    test("Dashboard, Atomic tests - struktura stránky", async () => { // Více stepů v jednom testu (rychlejší prádění testů)
        await test.step("Logo", async () => {
            await expect.soft(dashboardPage.logoImg).toBeVisible();
            await expect.soft(dashboardPage.logoImg).toHaveAttribute("src", "/logo.png");
        });
        
        await test.step("Header", async () => {
            await expect.soft(dashboardPage.headerTitle).toBeVisible();
            await expect.soft(dashboardPage.headerTitle).toHaveText(dictionary.dashboard.header.title);
        });

        await test.step("Levé Menu", async () => {
            await expect.soft(dashboardPage.leftMenuFrame).toBeVisible();
            await expect.soft(dashboardPage.homeMenuItem).toBeVisible();
            await expect.soft(dashboardPage.homeMenuItem).toContainText(dictionary.dashboard.leftMenu.home);
            await expect.soft(dashboardPage.accountsMenuItem).toBeVisible();
            await expect.soft(dashboardPage.accountsMenuItem).toContainText(dictionary.dashboard.leftMenu.accounts);
            await expect.soft(dashboardPage.transactionsMenuItem).toBeVisible();
            await expect.soft(dashboardPage.transactionsMenuItem).toContainText(dictionary.dashboard.leftMenu.transactions);
            await expect.soft(dashboardPage.supportMenuItem).toBeVisible();
            await expect.soft(dashboardPage.supportMenuItem).toContainText(dictionary.dashboard.leftMenu.support);
        });

        await test.step("Profil", async () => {
            await expect(dashboardPage.profileDetailsFrame).toBeVisible(); // (bez .soft) Pokud není, nepokračovat
            await expect.soft(dashboardPage.profileDetailsTitle).toBeVisible();
            await expect.soft(dashboardPage.profileDetailsTitle).toContainText(dictionary.dashboard.profileDetails.heading);
            await expect.soft(dashboardPage.editProfileButton).toBeVisible();
            await expect.soft(dashboardPage.editProfileButton).toContainText(dictionary.dashboard.profileDetails.editProfileButton);
            await dashboardPage.checkProfileEditOpen();
            await expect.soft(dashboardPage.firstnameLabel).toBeVisible();
            await expect.soft(dashboardPage.firstnameLabel).toContainText(dictionary.dashboard.profileDetails.username);
            await dashboardPage.firstnameHaveText(profileDetail.name); // ! vyměnit za toBeVisible() a toContainText() na elementu. Nyní je hodnota v text node (reportováno - DB-001)
            await expect.soft(dashboardPage.surnameLabel).toBeVisible();
            await expect.soft(dashboardPage.surnameLabel).toContainText(dictionary.dashboard.profileDetails.surname);
            await dashboardPage.surnameHaveText(profileDetail.surname); // ! vyměnit za toBeVisible() a toContainText() na elementu. Nyní je hodnota v text node (reportováno - DB-001)
            await expect.soft(dashboardPage.emailFrame).toBeVisible();
            await expect.soft(dashboardPage.emailFrame).toContainText(dictionary.dashboard.profileDetails.email);
            await dashboardPage.emailHaveText(profileDetail.email); // ! vyměnit za toBeVisible() a toContainText() na elementu. Nyní je hodnota v text node (reportováno - DB-001)
            await expect.soft(dashboardPage.phoneFrame).toBeVisible();
            await expect.soft(dashboardPage.phoneFrame).toContainText(dictionary.dashboard.profileDetails.phone);
            await dashboardPage.phoneHaveText(profileDetail.phone); // ! vyměnit za toBeVisible() a toContainText() na elementu. Nyní je hodnota v text node (reportováno - DB-001)
            await expect.soft(dashboardPage.ageFrame).toBeVisible();
            await expect.soft(dashboardPage.ageFrame).toContainText(dictionary.dashboard.profileDetails.age);
            await dashboardPage.ageHaveText(profileDetail.age); // ! vyměnit za toBeVisible() a toContainText() na elementu. Nyní je hodnota v text node (reportováno - DB-001)
        });

        await test.step("Zápatí", async () => {
            await expect.soft(dashboardPage.footer).toBeVisible();
            await expect.soft(dashboardPage.footer).toContainText(/© \d{4,} Banking App/); // ! otázka, zda nekontrolovat na aktuální rok.. (nereportováno)
            //await expect.soft(dashboardPage.footer).toContainText(`© ${new Date().getFullYear() } Banking App`); // ..jen kdyby..
        });
    });

    // ! Chyby
    // ! 1. Při uložení bilance +/- 100000000, nebo větší hodnoty se neuloží a tímpádem nezobrazí (chyba API) (reportovno v API-001)
    // ! 2. Pokud je více než třech účtěch UI zobrazuje chybu (reportováno - DB-006)
    test("Dashboard, Atomic tests - Kontrola účtů uživatele", async () => { // Chybující test, proto je pro přehlednost v samostatném testu
        await expect(dashboardPage.accountsFrame).toBeVisible(); // (bez .soft) Pokud není, nepokračovat
        await expect.soft(dashboardPage.accountsTitle).toBeVisible();
        await expect.soft(dashboardPage.accountsTitle).toContainText(dictionary.dashboard.accountsDetail.heading);
        await expect.soft(dashboardPage.newAccountButton).toBeVisible();
        await expect.soft(dashboardPage.newAccountButton).toContainText(dictionary.dashboard.accountsDetail.newAccountButton);
        // await dashboardPage.newAccountButton.click(); // ! Přeskočeno, tlačítko nemá funkci (reportováno - DB-005)
        // ! Chyba zobrazení více než 3 úctu (reportováno - DB-006)
        // Část testu vložena do podmínky, aby byl co nejmenší zásah do celého testu, než bude situace opravena.
        if (profileAccounts.length <= 3) {
            await expect(dashboardPage.accountsErrorMessage).not.toBeVisible(); // Při chybě nepokračovat
            await expect(dashboardPage.accountsTable).toBeVisible(); // (bez .soft) Pokud není, nepokračovat
            await expect.soft(dashboardPage.accountNumberHeading).toBeVisible();
            await expect.soft(dashboardPage.accountNumberHeading).toContainText(dictionary.dashboard.accountsDetail.accounts.accountNumber);
            await expect.soft(dashboardPage.accountBalanceHeading).toBeVisible();
            await expect.soft(dashboardPage.accountBalanceHeading).toContainText(dictionary.dashboard.accountsDetail.accounts.balance);
            await expect.soft(dashboardPage.accountTypeHeading).toBeVisible();
            await expect.soft(dashboardPage.accountTypeHeading).toContainText(dictionary.dashboard.accountsDetail.accounts.accountType);
            await dashboardPage.checkAllAccounts(profileAccounts);
        }
    });

    test("Dashboard, Atomic tests - odhlášení", async () => { // V ramostatném testu, protože jsem ještě nepřišel na to, jak otestovat odchod aniž bych odešel, nebo otevíral nové okno (zož taky nefunguje - reload = odhlášení) :-)
        await expect.soft(dashboardPage.logoutButon).toBeVisible();
        await expect.soft(dashboardPage.logoutButon).toHaveText(dictionary.dashboard.header.logoutButton);
        await dashboardPage.checkLogout();
    });
});