import { type Page, type Locator, expect } from '@playwright/test';
import { LoginPage } from './login_page.ts';
import { ProfileEditPage } from './profile_edit_page.ts';
import { type accountData, type accountsResponse } from '../api/backend_api.ts';
import dictionary from '../assets/dictionaries/dictionary.ts';

export class DashboardPage {
    readonly page: Page;
    
    readonly logoImg: Locator;
    readonly headerTitle: Locator;
    readonly logoutButon: Locator;

    readonly leftMenuFrame: Locator;
    readonly homeMenuItem: Locator;
    readonly accountsMenuItem: Locator;
    readonly transactionsMenuItem: Locator;
    readonly supportMenuItem: Locator;

    readonly profileDetailsFrame: Locator;
    readonly profileDetailsTitle: Locator;
    readonly editProfileButton: Locator;
    readonly updateMessage: Locator;
    readonly detailFrames: Locator;
    readonly firstnameFrame: Locator;
    readonly firstnameLabel: Locator;
    //readonly firstnameText: Locator;
    readonly surnameFrame: Locator;
    readonly surnameLabel: Locator;
    //readonly surnameText: Locator;
    readonly emailFrame: Locator;
    readonly emailLabel: Locator;
    //readonly emailText: Locator;
    readonly phoneFrame: Locator;
    readonly phoneLabel: Locator;
    //readonly phoneText: Locator;
    readonly ageFrame: Locator;
    readonly ageLabel: Locator;
    //readonly ageText: Locator;

    readonly accountsFrame: Locator;
    readonly accountsErrorMessage: Locator;
    readonly accountsTable: Locator;
    readonly accountsTitle: Locator;
    readonly newAccountButton: Locator;
    readonly accountNumberHeading: Locator;
    readonly accountBalanceHeading: Locator;
    readonly accountTypeHeading: Locator;
    readonly accountsRows: Locator;
    readonly accountNumberText: Locator;
    readonly accountBalanceText: Locator;
    readonly accountTypeText: Locator;

    readonly footer: Locator;
    readonly footerCopyright: Locator;

    constructor(page: Page) {
        this.page = page;

        this.logoImg = page.locator('[data-testid="logo-img"]');
        this.headerTitle = page.locator('.app-title');
        this.logoutButon = page.locator('.logout-link');

        this.leftMenuFrame = page.locator('.dashboard-sidebar');
        this.homeMenuItem = page.locator('.dashboard-sidebar li:nth-child(1)');
        this.accountsMenuItem = page.locator('.dashboard-sidebar li:nth-child(2)');
        this.transactionsMenuItem = page.locator('.dashboard-sidebar li:nth-child(3)');
        this.supportMenuItem = page.locator('.dashboard-sidebar li:nth-child(4)');

        // data-testid="account-summary"
        this.profileDetailsFrame = page.locator('//div[@data-testid="account-summary"]');
        this.profileDetailsTitle = page.locator('//h2[@data-testid="profile-details-title"]');
        this.editProfileButton = page.locator('//button[@data-testid="toggle-edit-profile-button"]');
        this.updateMessage = page.locator('.update-message');
        this.detailFrames = page.locator('.profile-detail');
        this.firstnameFrame = page.locator('//div[@data-testid="name"]');
        this.firstnameLabel = page.locator('//div[@data-testid="name"]/strong');
        //this.firstnameText = page.locator('//div[@data-testid="name"]/text()[2]'); // ! všechno spatně.. PW, nebo já neumíme uchopit textový node
        //this.firstnameText = page.locator('//div[@data-testid="name"]/text()[normalize-space() and not(ancestor::strong)]'); // ! všechno spatně.. PW, nebo já neumíme uchopit textový node
        this.surnameFrame = page.locator('//div[@data-testid="surname"]');
        this.surnameLabel = page.locator('//div[@data-testid="surname"]/strong');
        //this.surnameText = page.locator('//div[@data-testid="surname"]/text()[2]');
        this.emailFrame = page.locator('//div[@data-testid="email"]');
        this.emailLabel = page.locator('//div[@data-testid="email"]/strong');
        //this.emailText = page.locator('//div[@data-testid="email"]/text()[2]');
        this.phoneFrame = page.locator('//div[@data-testid="phone"]');
        this.phoneLabel = page.locator('//div[@data-testid="phone"]/strong');
        //this.phoneText = page.locator('//div[@data-testid="phone"]/text()[2]');
        this.ageFrame = page.locator('//div[@data-testid="age"]');
        this.ageLabel = page.locator('//div[@data-testid="age"]/strong');
        //this.ageText = page.locator('//div[@data-testid="age"]/text()[2]');

        // .accounts
        this.accountsFrame = page.locator('.accounts');
        this.accountsErrorMessage = page.locator('//p[@data-testid="accounts-error-message"]');
        this.accountsTable = page.locator('.accounts-table');
        this.accountsTitle = page.locator('//h2[@data-testid="accounts-title"]');
        this.newAccountButton = page.locator('.account-action');
        this.accountNumberHeading = page.locator('//th[@data-testid="account-number-heading"]');
        this.accountBalanceHeading = page.locator('//th[@data-testid="account-balance-heading"]');
        this.accountTypeHeading = page.locator('//th[@data-testid="account-type-heading"]');
        this.accountsRows = page.locator('.account-row');
        this.accountNumberText = page.locator('//td[@data-testid="account-number"]');
        this.accountBalanceText = page.locator('//td[@data-testid="account-balance"]');
        this.accountTypeText = page.locator('//td[@data-testid="account-type"]');

        this.footer = page.locator('//footer[@class="dashboard-footer"]');
        this.footerCopyright = page.locator('//footer[@class="dashboard-footer"]/span');
    }

    async clickLogout(): Promise<LoginPage> {
        await this.logoutButon.click();
        return new LoginPage(this.page);
    }

    async openEditProfile(): Promise<ProfileEditPage> {
        await this.editProfileButton.click();
        return new ProfileEditPage(this.page);
    }

    // TODO - chybějící sekce (reportováno)
    /*
    async clickNewAccount(): Promise<NewAccountPage> {
        await this.newAccountButton.click();
        return new NewAccountPage(this.page);
    }
    */

    async checkUpdatedMessage(message: string): Promise<DashboardPage> {
        console.log(`Checking update message: ${message}`);
        await expect.soft(this.updateMessage).toBeVisible();
        await expect.soft(this.updateMessage).toContainText(message);
        return this;
    }

    async checkAccountsErrorMessageNotBeVisible(): Promise<DashboardPage> {
        await expect(this.accountsErrorMessage).not.toBeVisible().then(() => this);
        return this;
    }

    async checkAccountsTableVisible(): Promise<DashboardPage> {
        await expect(this.accountsTable).toBeVisible().then(() => this);
        return this;
    }

    async firstnameContainText(name: string): Promise<DashboardPage> {
        await expect.soft(this.firstnameFrame).toContainText(name);
        return this;
    }

    async surnameContainText(surname: string): Promise<DashboardPage> {
        await expect.soft(this.surnameFrame).toContainText(surname);
        return this;
    }

    async emailContainText(email: string): Promise<DashboardPage> {
        await expect.soft(this.emailFrame).toContainText(email);
        return this;
    }

    async phoneContainText(phone: string): Promise<DashboardPage> {
        await expect.soft(this.phoneFrame).toContainText(phone);
        return this;
    }

    async ageContainText(age: number): Promise<DashboardPage> {
        await expect.soft(this.ageFrame).toContainText(String(age));
        return this;
    }

    async checkLogout(): Promise<LoginPage> { // test s odhlášením - nezjistil jsem, jak/zda jde provést test v kopii aktuální page
        const loginPage = await this.clickLogout();
        await expect.soft(loginPage.loginForm).toBeVisible();
        return loginPage;
    }

    async checkProfileEditOpen(): Promise<DashboardPage> { // obezlička přes ProfileEditPage - nezjistil jsem, jak/zda jde provést test v kopii DashboardPage
        const profileEditPage = await this.openEditProfile();
        await expect.soft(profileEditPage.editProfileCancelButton).toHaveText(dictionary.profileEdit.cancelButton);
        await profileEditPage.editProfileCancelButton.click();
        await expect.soft(this.editProfileButton).toHaveText(dictionary.dashboard.profileDetails.editProfileButton);
        return this;
    }

    // TODO po opravě HTML (přidání uchopitelných elementů pro kontrolované hodnoty) odebrat a kontrolovat hodnoty přímo přes lokátory
    // Vrárí textovou část z elementu obsahujícího label (<strong>) a požadovaný textový node
    async getTextBoxValue(locator: Locator): Promise<string> {
        return await locator.evaluate(node => node.lastChild?.textContent?.trim() || '');
    }

    async firstnameHaveText(name: string): Promise<DashboardPage> {
        expect.soft(await this.getTextBoxValue(this.firstnameFrame)).toContain(name);
        return this;
    }

    async surnameHaveText(surname: string): Promise<DashboardPage> {
        expect.soft(await this.getTextBoxValue(this.surnameFrame)).toContain(surname);
        return this;
    }

    async emailHaveText(email: string): Promise<DashboardPage> {
        expect.soft(await this.getTextBoxValue(this.emailFrame)).toContain(email);
        return this;
    }

    async phoneHaveText(phone: string): Promise<DashboardPage> {
        expect.soft(await this.getTextBoxValue(this.phoneFrame)).toContain(phone);
        return this;
    }

    async ageHaveText(age: number): Promise<DashboardPage> {
        expect.soft(await this.getTextBoxValue(this.ageFrame)).toContain(String(age));
        return this;
    }

    // TODO - prozatím nechci kvůli diskutabilní spolehlivosti - chybějící tagy u hodnot (reportováno)
    /*
    async firstnameHaveText(name: string): Promise<DashboardPage> {
        await expect.soft(this.firstnameFrame).toContainText(name);
        return this;
    }

    async surnameHaveText(surname: string): Promise<DashboardPage> {
        await expect.soft(this.surnameFrame).toContainText(surname);
        return this;
    }

    async emailHaveText(email: string): Promise<DashboardPage> {
        await expect.soft(this.emailFrame).toContainText(email);
        return this;
    }

    async phoneHaveText(phone: string): Promise<DashboardPage> {
        await expect.soft(this.phoneFrame).toContainText(phone);
        return this;
    }

    async ageHaveText(age: number): Promise<DashboardPage> {
        await expect.soft(this.ageFrame).toContainText(String(age));
        return this;
    }
    */

    async firstnameIsVisible(): Promise<DashboardPage> {
        await expect.soft(this.firstnameFrame).toBeVisible();
        return this;
    }

    async surnameIsVisible(): Promise<DashboardPage> {
        await expect.soft(this.surnameFrame).toBeVisible();
        return this;
    }

    async emailIsVisible(): Promise<DashboardPage> {
        await expect.soft(this.emailFrame).toBeVisible();
        return this;
    }

    async phoneIsVisible(): Promise<DashboardPage> {
        await expect.soft(this.phoneFrame).toBeVisible();
        return this;
    }

    async ageIsVisible(): Promise<DashboardPage> {
        await expect.soft(this.ageFrame).toBeVisible();
        return this;
    }

    async checkNthAccount(index: number, account: accountData): Promise<DashboardPage> {
        await expect(this.accountsRows.nth(index)).toBeVisible();
        await expect.soft(this.accountNumberText.nth(index)).toBeVisible();
        await expect.soft(this.accountNumberText.nth(index)).toContainText(account.accountNumber);
        await expect.soft(this.accountBalanceText.nth(index)).toBeVisible();
        await expect.soft(this.accountBalanceText.nth(index)).toContainText(String(account.balance));
        await expect.soft(this.accountTypeText.nth(index)).toBeVisible();
        await expect.soft(this.accountTypeText.nth(index)).toContainText(account.accountType);
        return this;
    }

    async checkAllAccounts(accountList: accountsResponse): Promise<DashboardPage> {
        await Promise.all(accountList.map(async (account, index) => {
            await this.checkNthAccount(index, account);
        }));
        return this;
    }
    
    async checkAccountNumber(accountNumber: string): Promise<DashboardPage> {
        await expect.soft(this.accountNumberText).toContainText(accountNumber);
        return this;
    }

    async checkAccountNumberNth(index: number, accountNumber: string): Promise<DashboardPage> {
        await expect.soft(this.accountsRows.nth(index)).toContainText(accountNumber);
        return this;
    }

    async checkAccountBalance(accountBalance: number): Promise<DashboardPage> {
        await expect.soft(this.accountBalanceText).toContainText(String(accountBalance));
        return this;
    }

    async checkAccountBalanceNth(index: number, accountBalance: number): Promise<DashboardPage> {
        await expect.soft(this.accountsRows.nth(index)).toContainText(String(accountBalance));
        return this;
    }
    async checkAccountType(accountType: string): Promise<DashboardPage> {
        await expect.soft(this.accountTypeText).toContainText(accountType);
        return this;
    }

    async checkAccountTypeNth(index: number, accountType: string): Promise<DashboardPage> {
        await expect.soft(this.accountsRows.nth(index)).toContainText(accountType);
        return this;
    }

    async checkAccountsCount(count: number): Promise<DashboardPage> {
        await expect.soft(this.accountsRows).toHaveCount(count);
        return this;
    }

    async accountNumberIsVisible(): Promise<DashboardPage> {
        await expect.soft(this.accountNumberText).toBeVisible();
        return this;
    }

    async accountNthNumberIsVisible(index: number): Promise<DashboardPage> {
        await expect.soft(this.accountsRows.nth(index)).toBeVisible();
        return this;
    }

    async accountBalanceIsVisible(): Promise<DashboardPage> {
        await expect.soft(this.accountBalanceText).toBeVisible();
        return this;
    }

    async accountNthBalanceIsVisible(index: number): Promise<DashboardPage> {
        await expect.soft(this.accountsRows.nth(index)).toBeVisible();
        return this;
    }

    async accountTypeIsVisible(): Promise<DashboardPage> {
        await expect.soft(this.accountTypeText).toBeVisible();
        return this;
    }

    async accountNthTypeIsVisible(index: number): Promise<DashboardPage> {
        await expect.soft(this.accountsRows.nth(index)).toBeVisible();
        return this;
    }

    async accountNthRowIsVisible(index: number): Promise<DashboardPage> {
        await expect.soft(this.accountsRows.nth(index)).toBeVisible();
        return this;
    }

    async waitForUpdateMessageClose(): Promise<DashboardPage> {
        await expect.soft(this.updateMessage).toBeHidden();
        return this;
    }
}