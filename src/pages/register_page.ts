import { type Page, type Locator } from '@playwright/test';
import { LoginPage } from './login_page.ts';

export class RegisterPage {
    readonly page: Page;

    readonly registerForm: Locator;
    readonly pageHeader: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly emailInput: Locator;
    readonly backToLoginButton: Locator;
    readonly registerButton: Locator;
    //readonly registerErrorText: Locator; // Přesunuto do LoginPage, jen jsem si neujasnil, jestli je to dobře

    constructor(page: Page) {
        this.page = page;

        this.registerForm = page.locator("div.form");
        this.pageHeader = page.locator("h1.title");
        this.usernameInput = page.locator("//input[@data-testid='username-input']");
        this.passwordInput = page.locator("//input[@data-testid='password-input']");
        this.emailInput = page.locator("//input[@data-testid='email-input']");
        this.backToLoginButton = page.locator(".link-button");
        this.registerButton = page.locator("//button[@data-testid='submit-button']");
        //this.registerErrorText = page.locator("//div[@data-testid='register-form']/div[@class='error-message']");
    }

    /*
    TODO: Error o chybném login je v alert okně. Odchytit a kontrolovat jeho obsah.
    */

    async openRegisterPage(url: string): Promise<RegisterPage> {
        await this.page.goto(url);
        return this;
    }

    async register(username: string, password: string, email: string): Promise<LoginPage> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.fillEmail(email);
        await this.clickRegisterButton();
        return new LoginPage(this.page);
    }

    async fillUsername(username: string): Promise<RegisterPage> {
        await this.usernameInput.fill(username);
        return this;
    }

    async fillPassword(password: string): Promise<RegisterPage> {
        await this.passwordInput.fill(password);
        return this;
    }

    async fillEmail(email: string): Promise<RegisterPage> {
        await this.emailInput.fill(email);
        return this;
    }

    async clickBackToLoginButton(): Promise<LoginPage> {
        await this.backToLoginButton.click();
        return new LoginPage(this.page);
    }

    async clickRegisterButton(): Promise<RegisterPage> {
        await this.registerButton.click();
        return this;
    }

    async clickRegisterButtonAndSuccess(): Promise<LoginPage> {
        await this.registerButton.click();
        return new LoginPage(this.page);
    }
}