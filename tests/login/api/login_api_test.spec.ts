/*
Vytvořte nový API test(přes volání API, ne přes odchycení) na přihlašovací API, zkontrolujte, že Vám přišel token, a že status response je 201.
*/
import { test, expect } from "@playwright/test";
import { BackendApi } from "../../../src/api/backend_api.ts";

test.describe("TEG#B - API Login", {
    tag: "@api",
}, () => {
    let backendApi: BackendApi;
    const username = process.env.TEGB_USERNAME || "";
    const password = process.env.TEGB_PASSWORD || "";

    test.beforeEach(async ({ request }) => {
        backendApi = new BackendApi(request);
    });

    test("API login test - úspěšné přihlášení", async () => {
        const response = await backendApi.successLogin(username, password);
        const responseBody = await response.json();

        expect(responseBody).toHaveProperty("access_token");
    });

    // Další testy pro negativní scénáře přihlášení
    test("API login test - neexistující uživatel", async () => {
        const response = await backendApi.loginUser("invaliduser", "wrongpassword");
        
        expect(response.status()).toBe(401);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty("message", "User or password is incorrect");
    });

    test("API login test - žádné heslo", async () => {
        const response = await backendApi.loginUser(username, "");
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty("message", ["password should not be empty"]);
    });

    test("API login test - žádný uživatel", async () => {
        const response = await backendApi.loginUser("", password);
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty("message", ["username should not be empty"]);
    });

    test("API login test - žádný uživatel a žádné heslo", async () => {
        const response = await backendApi.loginUser("", "");
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty("message");
        expect(responseBody.message).toEqual(expect.arrayContaining(["username should not be empty", "password should not be empty"]));
    });
});