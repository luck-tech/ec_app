import "jest-puppeteer";
import "expect-puppeteer";

describe("orders page", () => {
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
  describe("orders", () => {
    test("display orders", async () => {
      // go to orders page
      await Promise.all([
        page.goto(`${FRONT_URL}/orders`),
        page.waitForSelector("[data-test=order-list]"),
      ]);

      const order = await page.$("[data-test=order-item-2]");
      const orderDate = await order!.$eval(
        "[data-test=order-date]",
        el => el.textContent,
      );
      const orderTotalPrice = await order!.$eval(
        "[data-test=order-total-price]",
        el => el.textContent,
      );
      const orderTotalQuantity = await order!.$eval(
        "[data-test=order-total-quantity]",
        el => el.textContent,
      );
      const now = new Date();
      expect(orderDate).toBe(`Order date: ${now.getFullYear()}/1/1`);
      expect(orderTotalPrice).toBe("Total price: 350 coins");
      expect(orderTotalQuantity).toBe("Total quantity: 3");
    });
  });
  describe("year selector", () => {
    test("display orders", async () => {
      // go to orders page
      await Promise.all([
        page.goto(`${FRONT_URL}/orders`),
        page.waitForSelector("[data-test=order-list]"),
      ]);

      // select last year
      const now = new Date();
      const lastYear = now.getFullYear() - 1;
      await Promise.all([
        page.select("[data-test=year-selector]", lastYear.toString()),
        page.waitForSelector("[data-test=order-item-1]"),
      ]);

      const order = await page.$("[data-test=order-item-1]");
      const orderDate = await order!.$eval(
        "[data-test=order-date]",
        el => el.textContent,
      );
      const orderTotalPrice = await order!.$eval(
        "[data-test=order-total-price]",
        el => el.textContent,
      );
      const orderTotalQuantity = await order!.$eval(
        "[data-test=order-total-quantity]",
        el => el.textContent,
      );

      expect(orderDate).toBe(`Order date: ${lastYear}/1/1`);
      expect(orderTotalPrice).toBe("Total price: 350 coins");
      expect(orderTotalQuantity).toBe("Total quantity: 3");
    });
  });
});
