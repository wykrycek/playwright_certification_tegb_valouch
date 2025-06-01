/*
Vytvořte Data Driven Testy, které budou čerpat data z JSON na kontrolu kombinací částek na účtu
Založte uživateli účty z bodu 3 a následně:
Test bude kontrolovat jednotlivé zůstatky na účtu na frontendu:
0 Kč
200 000,52 Kč
- 12 345.00 Kč
- 196 000 921 Kč
298 000 123 Kč
*/

import { test, expect, type APIResponse } from "@playwright/test";
import { randomBankAccountType } from "../../src/utils/generators.ts";
import { BackendApi } from "../../src/api/backend_api.ts";
import { LoginPage } from "../../src/pages/login_page.ts";
import { type DashboardPage } from "../../src/pages/dashboard_page.ts";
import  accountBalances from "../../src/assets/test-data/account_balances.json";
import { faker } from "@faker-js/faker";

test.describe("DDT - Více účtů uživatele", {
    tag: "@ddt",
}, () => {
    let backendApi: BackendApi;
    let dashboardPage: DashboardPage;
    let userCredentials: {
        email: string;
        username: string;
        password: string;
        accessToken: string;
    };
    const createdAccounts: APIResponse[] = [];

/*     test.beforeEach(async ({ page, request }) => {
        // Inicializace API a přihlašovací stránky
        backendApi = new BackendApi(request);
        const loginPage = new LoginPage(page);

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
        accountBalances.forEach(async (accountData,) => {
            const accountType = randomBankAccountType();
            const response = await backendApi.createBankAccount(
                userCredentials.accessToken,
                accountData.startBalance,
                accountType
            );
            // Ověření, že účet byl úspěšně vytvořen
            await expect(response.status()).toBe(201);
            createdAccounts.push(response);
        });

        dashboardPage = await loginPage.login(userCredentials.username, userCredentials.password);
    });
     */
    test.beforeEach(async ({ page, request }) => {
        // Inicializace API a přihlašovací stránky
        backendApi = new BackendApi(request);
        const loginPage = new LoginPage(page);

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
        accountBalances.forEach(async (accountData,) => {
            const accountType = randomBankAccountType();
            const response = await backendApi.createBankAccount(
                userCredentials.accessToken,
                accountData.startBalance,
                accountType
            );
            // Ověření, že účet byl úspěšně vytvořen
            await expect(response.status()).toBe(201);
            createdAccounts.push(response);
        });

        dashboardPage = await loginPage.login(userCredentials.username, userCredentials.password);
    });

    accountBalances.forEach((accountData, index) => {
        test(`Účet ${index + 1}: ${accountData.startBalance}`, async () => {
            const accountResponse = createdAccounts[index];
            const accountBody = await accountResponse.json();

            await dashboardPage.checkNthAccount(index, accountBody);
        });
    });
});