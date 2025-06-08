import { type Page, type Locator } from '@playwright/test';
import { DashboardPage } from './dashboard_page.ts';

export class ProfileEditPage {
    page: Page;

    profileDetailsTitle: Locator;
    editProfileCancelButton: Locator;
    saveChangesButton: Locator;

    usernameLabel: Locator;
    firstnameInput: Locator;
    surnameLabel: Locator;
    surnameInput: Locator;
    emailLabel: Locator;
    emailInput: Locator;
    phoneLabel: Locator;
    phoneInput: Locator;
    ageLabel: Locator;
    ageInput: Locator;

    constructor(page: Page) {
        this.page = page;

        this.profileDetailsTitle = page.locator('//h2[@data-testid="profile-details-title"]');
        this.editProfileCancelButton = page.locator('//button[@data-testid="toggle-edit-profile-button"]');
        this.saveChangesButton = page.locator('//button[@data-testid="save-changes-button"]');

        this.usernameLabel = page.locator('//label[@for="name"]');
        this.firstnameInput = page.locator('//input[@data-testid="chage-name-input"]'); // ! opravit na change - překlep (reportováno - EP-004)
        this.surnameLabel = page.locator('//label[@for="surname"]');
        this.surnameInput = page.locator('//input[@data-testid="chage-surname-input"]'); // ! opravit na change - překlep (reportováno - EP-004)
        this.emailLabel = page.locator('//label[@for="email"]');
        this.emailInput = page.locator('//input[@data-testid="chage-email-input"]'); // ! opravit na change - překlep (reportováno - EP-004)
        this.phoneLabel = page.locator('//label[@for="phone"]');
        this.phoneInput = page.locator('//input[@data-testid="chage-phone-input"]'); // ! opravit na change - překlep (reportováno - EP-004)
        this.ageLabel = page.locator('//label[@for="age"]');
        this.ageInput = page.locator('//input[@data-testid="chage-age-input"]'); // ! opravit na change - překlep (reportováno - EP-004)
    }

    async fillFirstname(name: string): Promise<ProfileEditPage> {
        await this.firstnameInput.fill(name);
        return this;
    }

    async fillSurname(surname: string): Promise<ProfileEditPage> {
        await this.surnameInput.fill(surname);
        return this;
    }

    async fillEmail(email: string): Promise<ProfileEditPage> {
        await this.emailInput.fill(email);
        return this;
    }

    async fillPhone(phone: string): Promise<ProfileEditPage> {
        await this.phoneInput.fill(phone);
        return this;
    }

    async fillAge(age: number): Promise<ProfileEditPage> {
        await this.ageInput.fill(String(age));
        return this;
    }

    async clickSaveChanges(): Promise<DashboardPage> {
        await this.saveChangesButton.click();
        return new DashboardPage(this.page);
    }

    async clickCancel(): Promise<DashboardPage> {
        await this.editProfileCancelButton.click();
        return new DashboardPage(this.page);
    }
}