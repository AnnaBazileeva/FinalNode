const puppeteer = require("puppeteer");

describe("Puppeteer test for React registration", function () {
    this.timeout(60000);
    let browser, page;

    before(async () => {
        browser = await puppeteer.launch({ headless: false, slowMo: 50 });
        page = await browser.newPage();
        await page.goto("http://localhost:5174/login", { waitUntil: "domcontentloaded" });
    });

    after(async () => {
        await browser.close();
    });

    it("should register successfully", async () => {
        await page.waitForSelector("button");
        await page.evaluate(() => {
            const btns = [...document.querySelectorAll("button")];
            const regBtn = btns.find((b) => b.textContent.includes("Register here"));
            if (regBtn) regBtn.click();
        });

        await page.waitForSelector('input[type="text"]');

        const name = "TestUser_" + Date.now();
        const email = `test_${Date.now()}@example.com`;
        const password = "Test123!";

        await page.type('input[type="text"]', name);
        await page.type('input[type="email"]', email);
        await page.type('input[type="password"]', password);


        await page.evaluate(() => {
            const btns = [...document.querySelectorAll("button")];
            const registerBtn = btns.find((b) => b.textContent.includes("Register"));
            if (registerBtn) registerBtn.click();
        });

        await page.waitForNavigation({ waitUntil: "domcontentloaded" });

        const token = await page.evaluate(() => localStorage.getItem("token"));
        if (!token) throw new Error("Token not found in localStorage");

        console.log("✅ Registration passed");
    });
});
