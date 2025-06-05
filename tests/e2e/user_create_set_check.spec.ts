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
import { BackendApi } from "../../src/api/backend_api.ts";
import { faker } from "@faker-js/faker";
import { randomBankAccountType, randomBankAccountBallance } from "../../src/utils/generators.ts";
import dictionary from "../../src/assets/dictionaries/dictionary.ts";


test("E2E - Vytvoření uživatele, banovního účtu, přihlášení, nastavení profilu, ověření", {
    tag: "@e2e",
}, async ({ page, request }) => {
    const url = process.env.TEGB_URL_FRONTEND || "";
    const username = faker.internet.username();
    const password = faker.internet.password();
    const email = faker.internet.email();

    const firstname = faker.person.firstName();
    const surname = faker.person.lastName();
    const phone = faker.phone.number();
    const age = faker.number.int({ min: 18, max: 99 });

    const accountStartBalance = randomBankAccountBallance();
    const accountType = randomBankAccountType();
    
    // E2E - frontend část I. (registrace)
    // Registrace uživatele (testováno přes proklik z login formuláře, protože je to nejpravděpodobnější use case)
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage(url)
        .then((loginPage) => loginPage.clickRegisterButton())
        .then((registerPage) => registerPage.register(username, password, email))
        .then((loginPage) => loginPage.checkRegistrationSuccess())

    // API část - (přihlášení, vytvorení bankovního účtu)
    const backendApi = new BackendApi(request);
    const responseLoginAPI = backendApi.successLogin(username, password);
    const responseLoginAPIBody = await responseLoginAPI;
    const responseLoginAPIJson = await responseLoginAPIBody.json();
    const access_token = responseLoginAPIJson.access_token;

    const responseCreateBankAccount = await backendApi.createBankAccount(access_token, accountStartBalance, accountType);
    const userBankAccountsBody = await responseCreateBankAccount.json();

    // E2E - frontend část II.
    await loginPage.login(username, password)
        .then((dashboardPage) => dashboardPage.emailContainText(email)) // Email známe z registrace, můžeme zkontrolovat. // ! Chyba - email se nezobrazuje (reportováno)
        .then((dashboardPage) => dashboardPage.openEditProfile()) // Přejít na nastavení profilu a vyplnit
        .then((editProfilePage) => editProfilePage.fillFirstname(firstname))
        .then((editProfilePage) => editProfilePage.fillSurname(surname))
        .then((editProfilePage) => editProfilePage.fillEmail(email))
        .then((editProfilePage) => editProfilePage.fillPhone(phone))
        .then((editProfilePage) => editProfilePage.fillAge(age))
        .then((editProfilePage) => editProfilePage.clickSaveChanges())
        .then((dashboardPage) => dashboardPage.checkUpdatedMessage(dictionary.dashboard.profileDetails.updatedMessage)) // Kontrola úspěšného uložení a zobrazení nových hodnot
        .then((dashboardPage) => dashboardPage.firstnameContainText(firstname))
        .then((dashboardPage) => dashboardPage.surnameContainText(surname))
        .then((dashboardPage) => dashboardPage.emailContainText(email))
        .then((dashboardPage) => dashboardPage.phoneContainText(phone))
        .then((dashboardPage) => dashboardPage.ageContainText(age))
        .then((dashboardPage) => dashboardPage.checkNthAccount(0, userBankAccountsBody)) // Kontrola zobrazení vytvořeného účtu
        .then((dashboardPage) => dashboardPage.clickLogout());// Odhlášení
});