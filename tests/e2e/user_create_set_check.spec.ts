import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page.ts";
import { type accountData } from "../../src/api/backend_api.ts";
import { faker } from "@faker-js/faker";
import { randomBankAccountType, randomBankAccountBallance } from "../../src/utils/generators.ts";
import dictionary from "../../src/assets/dictionaries/dictionary.ts";


test("E2E - Vytvoření uživatele, banovního účtu, přihlášení, nastavení profilu, ověření", {
    tag: "@e2e",
}, async ({ page }) => {
    const url = process.env.TEGB_URL_FRONTEND || "";
    const username = faker.internet.username();
    const password = faker.internet.password();
    const email = faker.internet.email();

    const firstname = faker.person.firstName();
    const surname = faker.person.lastName();
    const phone = faker.phone.number();
    const age = faker.number.int({ min: 18, max: 99 });

    const account = {
        type: randomBankAccountType(),
        startBalance: randomBankAccountBallance(),
        accountData: <accountData>{}
    }
    
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage(url)
        .then((loginPage) => loginPage.clickRegisterButton()) // Registrace uživatele (testováno přes proklik z login formuláře, protože je to nejpravděpodobnější use case)
        .then((registerPage) => registerPage.register(username, password, email))
        .then((loginPage) => loginPage.checkRegistrationSuccess())
        .then((apiPseudoPage) => apiPseudoPage.initializeBackendApi())
        .then((apiPseudoPage) => apiPseudoPage.login({username, password}))
        .then((apiPseudoPage) => apiPseudoPage.createBankAccount(account))
        .then((apiPseudoPage) => apiPseudoPage.exit())
        .then((loginPage) => loginPage.login(username, password))
        .then((dashboardPage) => dashboardPage.accountNthRowIsVisible(0)) // Čekání na načtení dat
        // ! Chyba - email se nezobrazuje (reportováno - RF-001)
        //.then((dashboardPage) => dashboardPage.emailContainText(email)) // Email známe z registrace, můžeme zkontrolovat.
        .then((dashboardPage) => dashboardPage.openEditProfile()) // Přejít na nastavení profilu a vyplnit
        .then((editProfilePage) => editProfilePage.fillFirstname(firstname))
        .then((editProfilePage) => editProfilePage.fillSurname(surname))
        .then((editProfilePage) => editProfilePage.fillEmail(email))
        .then((editProfilePage) => editProfilePage.fillPhone(phone))
        .then((editProfilePage) => editProfilePage.fillAge(age))
        .then((editProfilePage) => editProfilePage.clickSaveChanges())
        .then((dashboardPage) => dashboardPage.checkUpdatedMessage(dictionary.dashboard.profileDetails.updatedMessage)) // Kontrola úspěšného uložení a zobrazení nových hodnot
        .then((dashboardPage) => dashboardPage.waitForUpdateMessageClose()) // Počká, až se success zpráva skryje
        .then((dashboardPage) => dashboardPage.firstnameContainText(firstname))
        .then((dashboardPage) => dashboardPage.surnameContainText(surname))
        .then((dashboardPage) => dashboardPage.emailContainText(email))
        .then((dashboardPage) => dashboardPage.phoneContainText(phone))
        .then((dashboardPage) => dashboardPage.ageContainText(age))
        // ! chyba - bankovní účet nelze v UI vytvořit (reportováno - DB-005)
        //.then((dashboardPage) => dashboardPage.createBankAccount(account.startBalance, account.type))
        .then((dashboardPage) => dashboardPage.checkNthAccount(0, account.accountData)) // Kontrola zobrazení vytvořeného účtu
        .then((dashboardPage) => dashboardPage.clickLogout())// Odhlášení
        .then((loginPage) => loginPage.checkLogoutSuccess());
});