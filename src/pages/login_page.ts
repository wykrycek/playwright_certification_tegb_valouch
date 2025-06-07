import { type Page, type Locator, expect, APIRequestContext } from '@playwright/test';
import { DashboardPage } from './dashboard_page.ts';
import { RegisterPage } from './register_page.ts';
import { ApiPseudoPage } from '../api/api_pseudo_page.ts';
import dictionary from '../assets/dictionaries/dictionary.ts';

export class LoginPage {
    readonly page: Page;
    readonly logoImage: Locator;
    readonly loginFormFrame: Locator;
    readonly loginForm: Locator;
    readonly languageButtonCZ: Locator;
    readonly languageButtonEN: Locator;
    readonly pageHeader: Locator;
    readonly usernameInput: Locator;
    readonly userInputValidationErrorMessage: Locator;
    readonly passwordInput: Locator;
    readonly passwordInputValidationErrorMessage: Locator;
    readonly forgottenPasswordButton: Locator;
    readonly registerButton: Locator;
    readonly loginButton: Locator;
    readonly loginErrorText: Locator;

    readonly registerSuccessText: Locator;

    constructor(page: Page) {
        this.page = page;

        this.logoImage = page.locator('img.logo');
        this.loginFormFrame = page.locator("div.Form"); // ! velké mísmeno (reportováno - LF-001)
        this.loginForm = page.locator("//form[@data-testid='login-form']")
        this.languageButtonCZ = page.locator("//button[@data-testid='cz']");
        this.languageButtonEN = page.locator("//button[@data-testid='en']");
        this.pageHeader = page.locator("h1.title");
        this.usernameInput = page.locator("//input[@data-testid='username-input']");
        this.userInputValidationErrorMessage = page.locator("//input[@data-testid='username-input']/parent::div/div[@class='error-message']");
        this.passwordInput = page.locator("//input[@data-testid='password-input']");
        this.passwordInputValidationErrorMessage = page.locator("//input[@data-testid='password-input']/parent::div/div[@class='error-message']");
        this.forgottenPasswordButton = page.locator("//button[@data-testid='registration-link']");
        this.registerButton = page.locator("//button[@data-testid='register-button']");
        this.loginButton = page.locator("//button[@data-testid='submit-button']");
        this.loginErrorText = page.locator("//div[data-testid='login-form']/div[@class='error-message']");

        this.registerSuccessText = page.locator("//div[@data-testid='success-message']");
    }

    async openLoginPage(url: string): Promise<LoginPage> {
        await this.page.goto(url);
        await expect(this.page).toHaveTitle(dictionary.page.title); // Čekat, kdyby server spinkal..
        if (process.env.APP_LANG === "eng") {
            await this.languageButtonEN.click();
        }
        return this;
    }

    async initializeBackendApi(request: APIRequestContext): Promise<ApiPseudoPage<LoginPage>> {
        return new ApiPseudoPage(this, request);
    }

    async login(username: string, password: string): Promise<DashboardPage> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
        return new DashboardPage(this.page);
    }

    async openAndLogin(url: string, username: string, password: string): Promise<DashboardPage> {
        await this.openLoginPage(url);
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
        return new DashboardPage(this.page);
    }

    async fillUsername(username: string): Promise<LoginPage> {
        await this.usernameInput.fill(username);
        return this;
    }

    async fillPassword(password: string): Promise<LoginPage> {
        await this.passwordInput.fill(password);
        return this;
    }

    async clickLoginButton(): Promise<DashboardPage> {
        await this.loginButton.click();
        return new DashboardPage(this.page);
    }

    async clickRegisterButton(): Promise<RegisterPage> {
        await this.registerButton.click();
        return new RegisterPage(this.page);
    }

    // ! chyba - tlačítko neprovádí akci (reportováno - LF-002)
    // TODO - chybějící sekce (reportováno)
    /*
    async clickForgottenPasswordButton(): Promise<ForgottenPasswordPage> {
        await this.forgottenPasswordButton.click();
        return new ForgottenPasswordPage(this.page);
    }
    */

    async checkLogoutSuccess(): Promise<LoginPage> {
        await expect(this.loginForm).toBeVisible();
        return this;
    }

    async checkRegistrationSuccess(): Promise<LoginPage> {
        await expect(this.registerSuccessText).toBeVisible();
        await expect(this.registerSuccessText).toHaveText(dictionary.login.registrationSuccess);
        return this;
    }

    async changeLanguage(language: string): Promise<LoginPage> {
        const languages: Record<string, Locator> = {
            cz: this.languageButtonCZ,
            en: this.languageButtonEN
        };
        await languages[language].click();
        return this;
    }

    async isUsernameValid(): Promise<LoginPage> {
        expect(await this.usernameInput.inputValue()).not.toBe('');
        return this;
    }
}