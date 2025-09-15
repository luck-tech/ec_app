import "jest-puppeteer";
import "expect-puppeteer";

describe("cart page", () => {
  beforeAll(async () => {
    // login
    await Promise.all([
      page.goto(`${FRONT_URL}`),
      page.waitForSelector("[data-test=email]"),
      page.waitForSelector("[data-test=password]"),
    ]);
    await page.type("[data-test=email]", "ninja@progate.com");
    await page.type("[data-test=password]", "password");
    await Promise.all([
      page.click("[data-test=submit]"),
      page.waitForSelector("[data-test=product-list]"),
    ]);
  });
  describe("cart is empty", () => {
    test("shows empty cart message", async () => {
      // go to cart page
      await Promise.all([
        page.goto(`${FRONT_URL}/cart`),
        page.waitForSelector("[data-test=cart-empty-message]"),
      ]);

      const text = await page.$eval(
        "[data-test=cart-empty-message]",
        el => el.textContent,
      );
      expect(text).toBe("Cart is empty");
    });
  });
});
