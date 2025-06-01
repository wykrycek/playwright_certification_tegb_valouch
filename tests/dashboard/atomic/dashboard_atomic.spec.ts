import { test, expect } from "@playwright/test";
import { DashboardPage } from "../../../src/pages/dashboard_page.ts";
import { LoginPage } from "../../../src/pages/login_page.ts";
import { accountsResponse, BackendApi, profileResponse } from "../../../src/api/backend_api.ts";
import Dictionary from "../../../src/assets/dictionaries/dictionary.ts";

test.describe("TEG#B - Dashboard Atomické Testy", {
    tag: "@atomic",
}, () => {
    let dashboardPage: DashboardPage;
    let profileDetail: profileResponse;
    let profileAccounts: accountsResponse;

    test.beforeEach(async ({ page }) => {
        const backendApi = new BackendApi(page.request);
        const loginPage = new LoginPage(page);
        const responseLogin = loginPage.page.waitForResponse(`${process.env.TEGB_URL_BACKEND}/tegb/login`)
        dashboardPage = await loginPage.openAndLogin(
            process.env.TEGB_URL_FRONTEND,
            process.env.TEGB_USERNAME,
            process.env.TEGB_PASSWORD
        );
        const responseLoginBody = await (await responseLogin).json();
        const access_token = responseLoginBody.access_token;
        const responseProfileDetail = await backendApi.getProfile(access_token);
        const responseProfileAccounts = await backendApi.getBankAccounts(access_token);
        profileDetail = await responseProfileDetail.json();
        profileAccounts = await responseProfileAccounts.json();
    });
    
    test("Dashboard, Atomic - Logo", async () => {
        await expect.soft(dashboardPage.logoImg).toBeVisible();
        await expect.soft(dashboardPage.logoImg).toHaveAttribute("src", "/logo.png");
    });

    test("Dashboard, Atomic - Header", async () => {
        await expect.soft(dashboardPage.headerTitle).toBeVisible();
        await expect.soft(dashboardPage.headerTitle).toHaveText(Dictionary.dashboard.header.title);
    });

    test("Dashboard Atomic - Tlačítko Odhlásit", async() => {
        await expect.soft(dashboardPage.logoutButon).toBeVisible();
        await expect.soft(dashboardPage.logoutButon).toHaveText(Dictionary.dashboard.header.logoutButton);
        await dashboardPage.checkLogout();
    });

    test("Dashboard, Atomic - Levé Menu", async () => {
        await expect.soft(dashboardPage.leftMenuFrame).toBeVisible();
        await expect.soft(dashboardPage.homeMenuItem).toBeVisible();
        await expect.soft(dashboardPage.homeMenuItem).toContainText(Dictionary.dashboard.leftMenu.home);
        await expect.soft(dashboardPage.accountsMenuItem).toBeVisible();
        await expect.soft(dashboardPage.accountsMenuItem).toContainText(Dictionary.dashboard.leftMenu.accounts);
        await expect.soft(dashboardPage.transactionsMenuItem).toBeVisible();
        await expect.soft(dashboardPage.transactionsMenuItem).toContainText(Dictionary.dashboard.leftMenu.transactions);
        await expect.soft(dashboardPage.supportMenuItem).toBeVisible();
        await expect.soft(dashboardPage.supportMenuItem).toContainText(Dictionary.dashboard.leftMenu.support);
    });

    test("Dashboard, Atomic - Profil", async () => {
        await expect(dashboardPage.profileDetailsFrame).toBeVisible(); // (bez .soft) Pokud není, nepokračovat
        await expect.soft(dashboardPage.profileDetailsTitle).toBeVisible();
        await expect.soft(dashboardPage.profileDetailsTitle).toContainText(Dictionary.dashboard.profileDetails.heading);
        await expect.soft(dashboardPage.editProfileButton).toBeVisible();
        await expect.soft(dashboardPage.editProfileButton).toContainText(Dictionary.dashboard.profileDetails.editProfileButton);
        await dashboardPage.checkProfileEditOpen();
        await expect.soft(dashboardPage.firstnameLabel).toBeVisible();
        await expect.soft(dashboardPage.firstnameLabel).toContainText(Dictionary.dashboard.profileDetails.username);
        await dashboardPage.checkFirstname(profileDetail.name); // ! vyměnit za toBeVisible() a toContainText() na elementu. Nyní je hodnota v text node - reportováno
        await expect.soft(dashboardPage.surnameLabel).toBeVisible();
        await expect.soft(dashboardPage.surnameLabel).toContainText(Dictionary.dashboard.profileDetails.surname);
        await dashboardPage.checkSurname(profileDetail.surname); // ! vyměnit za toBeVisible() a toContainText() na elementu. Nyní je hodnota v text node - reportováno
        await expect.soft(dashboardPage.emailFrame).toBeVisible();
        await expect.soft(dashboardPage.emailFrame).toContainText(Dictionary.dashboard.profileDetails.email);
        await dashboardPage.checkEmail(profileDetail.email); // ! vyměnit za toBeVisible() a toContainText() na elementu. Nyní je hodnota v text node - reportováno
        await expect.soft(dashboardPage.phoneFrame).toBeVisible();
        await expect.soft(dashboardPage.phoneFrame).toContainText(Dictionary.dashboard.profileDetails.phone);
        await dashboardPage.checkPhone(profileDetail.phone); // ! vyměnit za toBeVisible() a toContainText() na elementu. Nyní je hodnota v text node - reportováno
        await expect.soft(dashboardPage.ageFrame).toBeVisible();
        await expect.soft(dashboardPage.ageFrame).toContainText(Dictionary.dashboard.profileDetails.age);
        await dashboardPage.checkAge(profileDetail.age); // ! vyměnit za toBeVisible() a toContainText() na elementu. Nyní je hodnota v text node - reportováno
    });

    test("Dashboard, Atomic - Kontrola účtů uživatele", async () => {
        await expect(dashboardPage.accountsFrame).toBeVisible(); // (bez .soft) Pokud není, nepokračovat
        await expect.soft(dashboardPage.accountsTitle).toBeVisible();
        await expect.soft(dashboardPage.accountsTitle).toContainText(Dictionary.dashboard.accountsDetail.heading);
        await expect.soft(dashboardPage.newAccountButton).toBeVisible();
        await expect.soft(dashboardPage.newAccountButton).toContainText(Dictionary.dashboard.accountsDetail.newAccountButton);
        await expect(dashboardPage.accountsErrorMessage).not.toBeVisible(); // Při chybě nepokračovat
        await expect(dashboardPage.accountsTable).toBeVisible(); // (bez .soft) Pokud není, nepokračovat
        // await dashboardPage.newAccountButton.click(); // ! Přeskočeno, tlačítko nemá funkci - reportováno
        await expect.soft(dashboardPage.accountNumberHeading).toBeVisible();
        await expect.soft(dashboardPage.accountNumberHeading).toContainText(Dictionary.dashboard.accountsDetail.accounts.accountNumber);
        await expect.soft(dashboardPage.accountBalanceHeading).toBeVisible();
        await expect.soft(dashboardPage.accountBalanceHeading).toContainText(Dictionary.dashboard.accountsDetail.accounts.balance);
        await expect.soft(dashboardPage.accountTypeHeading).toBeVisible();
        await expect.soft(dashboardPage.accountTypeHeading).toContainText(Dictionary.dashboard.accountsDetail.accounts.accountType);
        await dashboardPage.checkAllAccounts(profileAccounts);
    });

    test("Dashboard, Atomic - Zápatí", async () => {
        await expect.soft(dashboardPage.footer).toBeVisible();
        await expect.soft(dashboardPage.footer).toContainText(/© \d{4,} Banking App/); // ! otázka, zda nekontrolovat na aktuální rok.. (nereportováno)
        //await expect.soft(dashboardPage.footer).toContainText(`© ${new Date().getFullYear() } Banking App`); // ..jen kdyby..
    });
});