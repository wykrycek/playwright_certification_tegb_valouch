import { test, expect } from "@playwright/test";
import { randomBankAccountType } from "../../src/utils/generators.ts";
import { BackendApi } from "../../src/api/backend_api.ts";
import { LoginPage } from "../../src/pages/login_page.ts";
import { faker } from "@faker-js/faker";
import accountBalances from "../../src/assets/test-data/account_balances.json";

test.describe("TEG#B - DDT - Více účtů uživatele", {
    tag: "@ddt",
}, () => {
    let backendApi: BackendApi;
    let loginPage: LoginPage;
    let userCredentials: {
        email: string;
        username: string;
        password: string;
        accessToken: string;
    };
    let createdAccounts: {
        id: string;
        balance: number;
        expectedBalance: number;
        description: string;
    }[] = [];

    test.beforeEach(async () => {
        // Inicializace API a přihlašovací stránky
        backendApi = new BackendApi();
        loginPage = new LoginPage();

        // Vytvoření uživatele
        const email = faker.internet.exampleEmail();
        const username = faker.internet.username();
        const password = faker.internet.password();

        await backendApi.registerUser(username, password, email);
        const loginResponse = await backendApi.successLogin(username, password);
        const loginBody = await loginResponse.json();

        userCredentials = {
            email,
            username,
            password,
            accessToken: loginBody.access_token
        };

        // Vytvoření všech účtů najednou
        for (const accountData of accountBalances) {
            const accountType = randomBankAccountType();
            const response = await backendApi.createBankAccount(
                userCredentials.accessToken,
                accountData.balance,
                accountType
            );

            expect(response.status()).toBe(201);
            const accountBody = await response.json();

            createdAccounts.push({
                ...accountBody,
                expectedBalance: accountData.balance,
                description: accountData.description
            });
        }
    });

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    // Parametrizovaný test pro každý účet
    accountBalances.forEach((accountData, index) => {
        test(`Kontrola zůstatku účtu: ${accountData.description}`, async ({ page }) => {
            // Přihlášení uživatele
            const dashboardPage = await loginPage.login(
                userCredentials.username,
                userCredentials.password
            );

            // Kontrola konkrétního účtu
            const accountToCheck = createdAccounts[index];
            await dashboardPage.checkAccountBalance(
                accountToCheck.id,
                accountData.balance,
                accountData.description
            );
        });
    });

    // Komplexní test kontrolující všechny účty najednou
    test("Kontrola všech účtů současně", async ({ page }) => {
        const dashboardPage = await loginPage.login(
            userCredentials.username,
            userCredentials.password
        );

        // Kontrola všech vytvořených účtů
        await dashboardPage.checkAllAccounts(createdAccounts);

        // Dodatečné kontroly
        for (const account of createdAccounts) {
            await dashboardPage.verifyAccountDisplayFormat(account.expectedBalance);
        }
    });
});