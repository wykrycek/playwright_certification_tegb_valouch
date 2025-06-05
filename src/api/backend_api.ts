import { APIRequestContext, APIResponse, expect } from "@playwright/test";

export type profileResponse = {
    userId: number;
    name: string;
    surname: string;
    age: number;
    email: string;
    phone: string;
};

export type accountData = {
    accountId: number;
    userId: number;
    accountNumber: string;
    accountType: string;
    balance: number | string;
    createdDate: string;
    status: string;
    updatedDate: string | null;
};

export type accountsResponse = accountData[];

export class BackendApi {
    private readonly request: APIRequestContext;
    private readonly apiUrl = process.env.TEGB_URL_BACKEND;
    readonly loginUrl = `${this.apiUrl}/tegb/login`;
    readonly registerUrl = `${this.apiUrl}/tegb/register`;
    readonly accountsUrl = `${this.apiUrl}/tegb/accounts`;
    readonly accountsCreateUrl = `${this.apiUrl}/tegb/accounts/create`;
    readonly accountsChangeBalanceUrl = `${this.apiUrl}/tegb/accounts/change-balance`;
    readonly profileUrl = `${this.apiUrl}/tegb/profile`;
    readonly profileEditUrl = `${this.apiUrl}/tegb/profile/edit`;
    readonly profileClearUrl = `${this.apiUrl}/tegb/profile/clear`;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async loginUser(username: string, password: string): Promise<APIResponse> {
        const response = await this.request.post(this.loginUrl, {
            data: {
                username: username,
                password: password,
            },
        });
        return response;
    }

    async successLogin(username: string, password: string): Promise<APIResponse> {
        const response = await this.loginUser(username, password);
        expect(response.status()).toBe(201);
        return response;
    }

    async registerUser(username: string, password: string, email: string): Promise<APIResponse> {
        const response = await this.request.post(this.registerUrl, {
            data: {
                username,
                password,
                email,
            },
        });
        return response;
    }
    
    async createBankAccount(bearerToken: string, startBalance: number, type: string): Promise<APIResponse> {
        const response = await this.request.post(this.accountsCreateUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + bearerToken,
            },
            data: {
                startBalance,
                type,
            },
        });
        return response;
    }

    async createBankAccountWithUserLogin(username: string, password: string, startBalance: number, type: string): Promise<APIResponse> {
        const responseLogin = await this.loginUser(username, password);
        const respondeLoginBody = await responseLogin.json();
        const bearerToken = respondeLoginBody.access_token;
        const response = await this.request.post(this.accountsCreateUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + bearerToken,
            },
            data: {
                startBalance,
                type,
            },
        });
        return response;
    }

    async createBankAccountWithUserLoginMultiple(username: string, password: string, accountsData: Array<{startBalance: number, type: string}>): Promise<APIResponse> {
        const responseLogin = await this.loginUser(username, password);
        const respondeLoginBody = await responseLogin.json();
        const bearerToken = respondeLoginBody.access_token;
        accountsData.forEach(async (accountData) => {
            await this.request.post(this.accountsCreateUrl, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + bearerToken,
                },
                data: {
                    startBalance: accountData.startBalance,
                    type: accountData.type,
                },
            });
        });
        return responseLogin;
    }

    async changeBalance(bearerToken: string, accountId: number, amount: number): Promise<APIResponse> {
        const response = await this.request.post(this.accountsChangeBalanceUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + bearerToken,
            },
            data: {
                accountId,
                amount,
            },
        });
        return response;
    }

    async getBankAccounts(bearerToken: string): Promise<APIResponse> {
        const response = await this.request.get(this.accountsUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + bearerToken,
            },
        });
        return response;
    }

    async getProfile(bearerToken: string): Promise<APIResponse> {
        const response = await this.request.get(this.profileUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + bearerToken,
            },
        });
        return response;
    }

    async clearProfile(bearerToken: string, options: string[]): Promise<APIResponse> {
        const response = await this.request.patch(this.profileClearUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + bearerToken,
            },
            data: options.reduce((obj, key) => ({ ...obj, [key]: true }), {}),
        });
        return response;
    }

    async editProfile(bearerToken: string, profile: object): Promise<APIResponse> {
        const response = await this.request.patch(this.profileEditUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + bearerToken,
            },
            data: profile,
        });
        return response;
    }
}