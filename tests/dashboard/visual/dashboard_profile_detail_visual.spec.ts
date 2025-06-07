import { expect, test } from "@playwright/test";
import { DashboardPage } from "../../../src/pages/dashboard_page.ts";
import { LoginPage } from "../../../src/pages/login_page.ts";
import { ariaDashboardProfileDetail } from "../../../src/assets/aria/dashboard_profile_detail.ts";
import dictionary from "../../../src/assets/dictionaries/dictionary.ts";

test.describe("Visual - Dashboard profilové informace", {
    tag: "@visual",
}, () => {
    // Inicializace stránky Dashboard
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        if (!process.env.TEGB_URL_FRONTEND || !process.env.TEGB_USERNAME || !process.env.TEGB_PASSWORD) {
            throw new Error('Required environment variables are not set');
        }
        const loginPage = new LoginPage(page);
        dashboardPage = await loginPage.openAndLogin(
            process.env.TEGB_URL_FRONTEND,
            process.env.TEGB_USERNAME,
            process.env.TEGB_PASSWORD
        );
    });

    test("Dashboard profilové informace - vizuální test s předvyplněnými údaji", async () => {
        const userDate = {
            firstName: "Jan",
            lastName: "Novák",
            email: "jann@example.com",
            phone: "+420123456789",
            age: 25
        };
        await dashboardPage.openEditProfile()
            .then((editProfilePage) => editProfilePage.fillFirstname(userDate.firstName))
            .then((editProfilePage) => editProfilePage.fillSurname(userDate.lastName))
            .then((editProfilePage) => editProfilePage.fillEmail(userDate.email))
            .then((editProfilePage) => editProfilePage.fillPhone(userDate.phone))
            .then((editProfilePage) => editProfilePage.fillAge(userDate.age))
            .then((editProfilePage) => editProfilePage.clickSaveChanges())
            .then((dashboardPage) => dashboardPage.checkUpdatedMessage(dictionary.dashboard.profileDetails.updatedMessage))
            .then((dashboardPage) => dashboardPage.waitForUpdateMessageClose()) // Počká, až se success zpráva skryje
        await expect(dashboardPage.profileDetailsFrame).toHaveScreenshot("dashboard_profile_detail_visual_filled.png");
    });

    test("Dashboard profilové informace - vizuální test s maskováním", async () => { // ! nebude fungovat spolehlivě při delším textu (zalamování zvětšuje elment, text přetéká)
        await expect(dashboardPage.profileDetailsFrame).toBeVisible();
        await expect(dashboardPage.profileDetailsFrame).toHaveScreenshot("dashboard_profile_detail_visual_masked.png", {
            mask: [
                dashboardPage.detailFrames
            ]
        });
    });

    test("Dashboard profilové informace - vizuální test s JS modifikací", async () => { // vizuální test s JS modifikací, aby se textové uzly nahradily skrytými span elementy. Alternativně lze i vyplňovat text. 
        await expect(dashboardPage.profileDetailsFrame).toBeVisible();
        await dashboardPage.page.evaluate(() => {
            document.querySelectorAll('div.profile-detail').forEach(div => { // ve všech divech s třídou profile-detail..
                div.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) { // ..vezme textové uzly..
                        const span = document.createElement('span');
                        span.style.display = 'none';
                        span.textContent = node.textContent; // ..vloží do skrytého span elementu..
                        div.replaceChild(span, node); // ..a nahradí textový uzel tímto skrytým spanem.
                    }
                });
            });
        });
        await expect(dashboardPage.profileDetailsFrame).toHaveScreenshot("dashboard_profile_detail_visual_js.png");
    });

    test("Dashboard profilové informace - ARIA snapshot", async () => { // alespoň že aria se nevzpouzí 🙂
        await expect(dashboardPage.profileDetailsFrame).toBeVisible();
        await expect(dashboardPage.profileDetailsFrame).toMatchAriaSnapshot(ariaDashboardProfileDetail);
    });
});