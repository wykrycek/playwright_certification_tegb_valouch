import { expect, type APIRequestContext } from "@playwright/test";
import { accountData, BackendApi } from "./backend_api";

export class ApiPseudoPage<Parent> {
    readonly parent: Parent;
    readonly response: APIRequestContext;
    readonly backendApi: BackendApi;
    accessToken: string;

    constructor(parent: Parent, response: APIRequestContext) {
        this.response = response;
        this.backendApi = new BackendApi(response);
        this.accessToken = "";
        this.parent = parent;
    }

    async login(creditials: {username?: string, password?: string, access_token?: string}): Promise<ApiPseudoPage<Parent>> {
        if (creditials.access_token) { // Pokud je vyplněn token, použije se
            this.accessToken = creditials.access_token;
            return this;
        }
        if (!creditials.username || !creditials.password) { // Pokud nebyl vyplněn username nebo password, vratí se chyba
            throw new Error("Missing username or password");
        }
        const response = await this.backendApi.successLogin(creditials.username, creditials.password);
        expect(response.status()).toBe(201);
        this.accessToken = (await response.json()).access_token; // Použije se token z odpovědi
        creditials.access_token = this.accessToken; // Vrátí se token
        return this;
    }

    async initialize(access_token: string): Promise<ApiPseudoPage<Parent>> {
        this.accessToken = access_token;
        return this;
    }

    async registerUser(username: string, password: string, email: string): Promise<ApiPseudoPage<Parent>> {
        const response = await this.backendApi.registerUser(username, password, email);
        expect(response.status()).toBe(201);
        return this;
    }

    async createBankAccount(account: { startBalance: number, type: string, accountData?: accountData }): Promise<ApiPseudoPage<Parent>> {
        const response = await this.backendApi.createBankAccount(this.accessToken, account.startBalance, account.type);
        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        account.accountData = responseBody;
        return this;
    }

    async changeBalance(accountId: number, amount: number): Promise<ApiPseudoPage<Parent>> {
        await this.backendApi.changeBalance(this.accessToken, accountId, amount);
        return this;
    }

    async clearProfile(options: string[]): Promise<ApiPseudoPage<Parent>> {
        await this.backendApi.clearProfile(this.accessToken, options);
        return this;
    }

    exit(): Parent { // Vratit se do rodiče
        return this.parent;
    }
}
