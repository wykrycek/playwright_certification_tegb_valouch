import { test, expect } from "@playwright/test";
import accountBalances from "../../src/assets/test-data/account_balances.json";
import { randomBankAccountType } from "../../src/utils/generators.ts";
import { BackendApi } from "../../src/api/backend_api.ts";
import { LoginPage } from "../../src/pages/login_page.ts";
import { faker } from "@faker-js/faker";

/*
 Nevymyslel jsem lepší řešení, než testy serializovat.
 Nelíbí se mi to kvůli zpomalení, ale lépe to teď asi neumím.
 Více workerů mi bude vytvářet více uživatelů.
 */
test.describe.configure({ mode: 'serial' });
test.describe("DDT - více účtů uživatele", {
    tag: "@ddt"
}, () => {
    let backendApi: BackendApi;
    let loginPage: LoginPage;

    const email = faker.internet.exampleEmail();
    const username = faker.internet.username();
    const password = faker.internet.password();
    let accessToken: string;

    // Jeden uživatel pro všechny testy
    test.beforeAll(async ({ request }) => {
        backendApi = new BackendApi(request);
        
        await backendApi.registerUser(username, password, email);
        const apiLoginResponse = await backendApi.successLogin(username, password);
        const apiLoginBody = await apiLoginResponse.json();
        accessToken = apiLoginBody.access_token;
    });

    // Inicializace API a přihlašovací stránky pro každý test
    test.beforeEach(async ({ page, request }) => {
        loginPage = new LoginPage(page);
        backendApi = new BackendApi(request);
    });

    accountBalances.forEach((accountData, index) => {
        test(`Účet ${index + 1}: Bilance ${String(accountData.startBalance)}`, async () => {
            // Vytvoření bankovního účtu
            const accountType = randomBankAccountType();
            const accountCreateResponse = await backendApi.createBankAccount(
                accessToken,
                accountData.startBalance,
                accountType
            );
            
            // Ověření, že účet byl úspěšně vytvořen
            // soft, protože je dobré vidět, jak se načte UI. Test se zastaví, až když nebude vidět potřebný řádek sezanmu účtů
            expect.soft(accountCreateResponse.status()).toBe(201);
            const accountCreateResponseBody = await accountCreateResponse.json();

            // Přihlášení do dashboardu a test řádku s učtem
            await loginPage.openLoginPage(process.env.TEGB_URL_FRONTEND || "")
                .then((loginPage) => loginPage.login(username, password))
                .then((dashboardPage) => dashboardPage.checkNthAccount(index, accountCreateResponseBody));
        });
    });

    // tady by se slušelo uživatele zase smazat
    /*
    test.afterAll(async () => {
        await backendApi.deleteUser(accessToken);
    });
    */
});

// Abych nehledal jen, že to nejde, bylo by dobré najít, proč to nejde. Přidávám regresní testy, které hledají limity a po opravě potvrdí, že již limity nelimitují..
// Duplikuji inicializační logiku (beforeAll a beforeEach) protože je to navíc a nechci plevelit hlavní práci.
test.describe("Hledání limitů API a UI", {
    tag: ["@regress"]
}, () => {
    let backendApi: BackendApi;
    let loginPage: LoginPage;

    const email = faker.internet.exampleEmail();
    const username = faker.internet.username();
    const password = faker.internet.password();
    let accessToken: string;

    test.beforeAll(async ({ request }) => {
        backendApi = new BackendApi(request);

        await backendApi.registerUser(username, password, email);
        const apiLoginResponse = await backendApi.successLogin(username, password);
        const apiLoginBody = await apiLoginResponse.json();
        accessToken = apiLoginBody.access_token;
    });

    test.beforeEach(async ({ page, request }) => {
        loginPage = new LoginPage(page);
        backendApi = new BackendApi(request);
    });

    test.describe("Hledání limitů počtu zobrazených účtů", {
        tag: "@ui"
    }, () => {
        accountBalances.forEach(async (bilance, index) => {
            test(`UI - hledání limitů počtu zobrazených účtů #${index + 1}`, async () => {
                // Vytvoření bankovního účtu
                const accountType = randomBankAccountType();
                const accountCreateResponse = await backendApi.createBankAccount(
                    accessToken,
                    1000 * (index + 1),
                    accountType
                );
                const accountCreateResponseBody = await accountCreateResponse.json();

                // Potvrdit, že účet byl úspěšně vytvořen
                expect.soft(accountCreateResponse.status()).toBe(201);

                // Přihlášení do dashboardu a test řádku s učtem
                await loginPage.openLoginPage(process.env.TEGB_URL_FRONTEND || "")
                    .then((loginPage) => loginPage.login(username, password))
                    .then((dashboardPage) => dashboardPage.checkNthAccount(index, accountCreateResponseBody)); // 4. cyklus skončí chybou, přesto že vytvořený účet v API přijde. (reportováno)
            });
        });
    });

    test("API accounts/create - hledání limitů částek na účtu", {
        tag: ["@api"]
    }, async ({ request }) => {
        const backendApi = new BackendApi(request);
        
        const loginResponse = await backendApi.loginUser(username, password);
        const loginBody = await loginResponse.json();
        const accessToken = loginBody.access_token;
        //const accountDescendingResponse = await backendApi.createBankAccount(accessToken, 0, randomBankAccountType()); // test s hledáním minima zakomentován - changeBalance nepřijímá záporné částky a to už řešit nebudu :-)
        const accountAscendingResponse = await backendApi.createBankAccount(accessToken, 0, randomBankAccountType());
        //const accountDescending = await accountDescendingResponse.json();
        const accountAscending = await accountAscendingResponse.json();

        let count = 0;
        let minBalance = 0;
        let maxBalance = 0;
        let amount = 0;
        while (count < 10 && minBalance === 0 && maxBalance === 0) {
            amount = Math.pow(10, count);

            //const accountDescendingResponse = await backendApi.changeBalance(accessToken, accountDescending.accountId, amount * -1);
            const accountAscendingResponse = await backendApi.changeBalance(accessToken, accountAscending.accountId, amount);

            //expect.soft(accountDescendingResponse.status()).toBe(201); // change by nemělo vracet 201, ale 200
            expect.soft(accountAscendingResponse.status()).toBe(201); // change by nemělo vracet 201, ale 200

            //if (accountDescendingResponse.status() != 201) minBalance = (amount * -1) + 0.01;
            if (accountAscendingResponse.status() != 201) minBalance = (amount * -1) + 0.01; // Částku 100 mega a víc API nepřijme (reportováno). (Kéž by se mě takový problém týkal :-)
            if (accountAscendingResponse.status() != 201) maxBalance = amount - 0.01;

            if (minBalance !== 0 || maxBalance !== 0) {
                console.log(`minBalance: ${minBalance}, maxBalance: ${maxBalance}`);
                break;
            }
            
            count++;
        }
    });
});
