/*
1. E2E (vše frontend, pokud není uvedeno jinak v krocích)
    1. Registrace uživatele (přes frontend).
    2. API - vytvořit účet (v aplikaci nefunguje).
    3. Přihlásit se do aplikace nově založeným uživatelem.
    4. Vyplňte uživateli profil.
    5. Zkontrolujte údaje profilu po uložení.
    6. Zkontrolujte zobrazení vytvořeného účtu (viditelnost, částka).
    7. Odhlaste se.
*/

import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page.ts";
//import { RegisterPage } from "../../src/pages/register_page.ts";
import { BackendApi } from "../../src/api/backend_api.ts";
import { faker } from "@faker-js/faker";
import { randomBankAccountType, randomBankAccountBallance } from "../../src/utils/generators.ts";
import dictionary from "../../src/assets/dictionaries/dictionary.ts";


test("E2E - Vytvoření uživatele, banovního účtu, přihlášení, nastavení profilu, ověření", {
    tag: "@e2e",
}, async ({ page, request }) => {
    //const url = `${process.env.URL_FRONTEND}/register`;
    const url = process.env.TEGB_URL_FRONTEND || "";
    const login_api_url = `${process.env.TEGB_URL_BACKEND}/tegb/login`;
    const username = faker.internet.username();
    const password = faker.internet.password();
    const email = faker.internet.email();

    const firstname = faker.person.firstName();
    const surname = faker.person.lastName();
    const phone = faker.phone.number();
    const age = faker.number.int({ min: 18, max: 99 });

    const accountType = randomBankAccountType();
    const accountStartBalance = randomBankAccountBallance();

    // Registrace uživatele s přímým vstupem na registraci
    // const registerPage = new RegisterPage(page);
    // await registerPage.openRegisterPage(`${url}/register`)
    //     .then((registerPage) => registerPage.register(username, password, email))
    //     .then((loginPage) => loginPage.checkRegistrationSuccess());
    

    // Registrace uživatele (testováno přes proklik z login formuláře)
    const backendApi = new BackendApi(request);
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage(url)
        .then((loginPage) => loginPage.clickRegisterButton())
        .then((registerPage) => registerPage.register(username, password, email))
        .then((loginPage) => loginPage.checkRegistrationSuccess());
    
    // Vytvoření účtu - odchytit access_token a provolat API
    const [responseLoginAPI, dashboardPage] = await Promise.all([
        loginPage.page.waitForResponse(login_api_url),
        loginPage.login(username, password),
    ]);
    const responseLoginAPIBody = await responseLoginAPI.json();
    const access_token = responseLoginAPIBody.access_token;
    const responseCreateBankAccount = await backendApi.createBankAccount(access_token, accountStartBalance, accountType);
    const responseBodyCreateBankAccount = await responseCreateBankAccount.json();

    /*
    // Vytvoření účtu
    const backendApi = new LoginApi(request);
    const responseLoginAPI = await backendApi.successLogin(username, password);
    const responseLoginAPIBody = await responseLoginAPI.json();
    const access_token = responseLoginAPIBody.access_token;
    const responseCreateBankAccount = await backendApi.createBankAccount(access_token, accountStartBalance, accountType);
    const responseBodyCreateBankAccount = await responseCreateBankAccount.json();
    */

    // Přihlášení do aplikace
    //await loginPage.login(username, password)
    //    .then((dashboardPage) => dashboardPage.checkEmail(email)) // Email známe z registrace, můžeme zkontrolovat

    // Přihlášení do aplikace
    await dashboardPage.emailToHaveText(email) // Email známe z registrace, můžeme zkontrolovat
        // Přejít na nastavení profilu a vyplnit
        .then((dashboardPage) => dashboardPage.openEditProfile())
        .then((editProfilePage) => editProfilePage.fillFirstname(firstname))
        .then((editProfilePage) => editProfilePage.fillSurname(surname))
        .then((editProfilePage) => editProfilePage.fillEmail(email))
        .then((editProfilePage) => editProfilePage.fillPhone(phone))
        .then((editProfilePage) => editProfilePage.fillAge(age))
        .then((editProfilePage) => editProfilePage.clickSaveChanges())
        // Kontrola úspěšného uložení a zobrazení nových hodnot
        .then((dashboardPage) => dashboardPage.checkUpdatedMessage(dictionary.dashboard.profileDetails.updatedMessage))
        .then((dashboardPage) => dashboardPage.firstnameToHaveText(firstname))
        .then((dashboardPage) => dashboardPage.surnameToHaveText(surname))
        .then((dashboardPage) => dashboardPage.emailToHaveText(email))
        .then((dashboardPage) => dashboardPage.phoneToHaveText(phone))
        .then((dashboardPage) => dashboardPage.ageToHaveText(age))
        // Kontrola zobrazení vytvořeného účtu
        .then((dashboardPage) => dashboardPage.checkAllAccounts([responseBodyCreateBankAccount]))
        // Odhlášení
        .then((dashboardPage) => dashboardPage.clickLogout());
});

test("E2E - Ne-vytvoření uživatele, banovního účtu, přihlášení, nastavení profilu, ověření", {
    tag: "@e2e",
}, async ({ page, request }) => {
    //const url = `${process.env.URL_FRONTEND}/register`;
    const url = process.env.TEGB_URL_FRONTEND || "";
    const login_api_url = `${process.env.TEGB_URL_BACKEND}/tegb/login`;
    const username = process.env.TEGB_USERNAME2 || "";
    const password = process.env.TEGB_PASSWORD2 || "";

    const firstname = faker.person.firstName();
    const surname = faker.person.lastName();
    const phone = faker.phone.number();
    const email = faker.internet.email();
    const age = faker.number.int({ min: 18, max: 99 });

    //const accountType = randomBankAccountType();
    //const accountStartBalance = randomBankAccountBallance();

    // Registrace uživatele s přímým vstupem na registraci
    // const registerPage = new RegisterPage(page);
    // await registerPage.openRegisterPage(`${url}/register`)
    //     .then((registerPage) => registerPage.register(username, password, email))
    //     .then((loginPage) => loginPage.checkRegistrationSuccess());


    // Registrace uživatele (testováno přes proklik z login formuláře)
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage(url);
    //const dashboardPage = loginPage.login(username, password);



    
    const backendApi = new BackendApi(request);
    //await loginPage.openLoginPage(url);
        //.then((loginPage) => loginPage.clickRegisterButton())
        //.then((registerPage) => registerPage.register(username, password, email))
        //.then((loginPage) => loginPage.checkRegistrationSuccess());

    // Vytvoření účtu - odchytit access_token a provolat API
    const [responseLoginAPI, dashboardPage] = await Promise.all([
        loginPage.page.waitForResponse(login_api_url),
        loginPage.login(username, password),
    ]);
    const responseLoginAPIBody = await responseLoginAPI.json();
    const access_token = responseLoginAPIBody.access_token;
    const userBankAccounts = await backendApi.getBankAccounts(access_token);
    const userBankAccountsBody = await userBankAccounts.json();
    //const responseCreateBankAccount = await backendApi.createBankAccount(access_token, accountStartBalance, accountType);
    //const responseBodyCreateBankAccount = await responseCreateBankAccount.json();
    

    /*
    // Vytvoření účtu
    const backendApi = new LoginApi(request);
    const responseLoginAPI = await backendApi.successLogin(username, password);
    const responseLoginAPIBody = await responseLoginAPI.json();
    const access_token = responseLoginAPIBody.access_token;
    const responseCreateBankAccount = await backendApi.createBankAccount(access_token, accountStartBalance, accountType);
    const responseBodyCreateBankAccount = await responseCreateBankAccount.json();
    */

    // Přihlášení do aplikace
    //await loginPage.login(username, password)
    //    .then((dashboardPage) => dashboardPage.checkEmail(email)) // Email známe z registrace, můžeme zkontrolovat

    // Přihlášení do aplikace
    await (await dashboardPage).emailToHaveText(email) // Email známe z registrace, můžeme zkontrolovat
        // Přejít na nastavení profilu a vyplnit
        .then((dashboardPage) => dashboardPage.openEditProfile())
        .then((editProfilePage) => editProfilePage.fillFirstname(firstname))
        .then((editProfilePage) => editProfilePage.fillSurname(surname))
        .then((editProfilePage) => editProfilePage.fillEmail(email))
        .then((editProfilePage) => editProfilePage.fillPhone(phone))
        .then((editProfilePage) => editProfilePage.fillAge(age))
        .then((editProfilePage) => editProfilePage.clickSaveChanges())
        // Kontrola úspěšného uložení a zobrazení nových hodnot
        .then((dashboardPage) => dashboardPage.checkUpdatedMessage(dictionary.dashboard.profileDetails.updatedMessage))
        .then((dashboardPage) => dashboardPage.firstnameToHaveText(firstname))
        .then((dashboardPage) => dashboardPage.surnameToHaveText(surname))
        .then((dashboardPage) => dashboardPage.emailToHaveText(email))
        .then((dashboardPage) => dashboardPage.phoneToHaveText(phone))
        .then((dashboardPage) => dashboardPage.ageToHaveText(age))
        // Kontrola zobrazení vytvořeného účtu
        .then((dashboardPage) => dashboardPage.checkAllAccounts(userBankAccountsBody))
        // Odhlášení
        .then((dashboardPage) => dashboardPage.clickLogout());
});