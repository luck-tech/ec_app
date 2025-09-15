import "jest-puppeteer";
import "expect-puppeteer";

describe("orders complete page", () => {
  beforeAll(async () => {
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

  test("display order info", async () => {
    // go to orders complete page
    await Promise.all([
      page.goto(`${FRONT_URL}/orders/1/complete`),
      page.waitForSelector("[data-test=order-item-1]"),
    ]);

    const orderCompleteMessage = await page.$eval(
      "[data-test=order-complete-message]",
      el => el.textContent,
    );
    expect(orderCompleteMessage).toBe("Thank you for your order!");

    const date = await page.$eval(
      "[data-test=order-date]",
      el => el.textContent,
    );
    const totalPrice = await page.$eval(
      "[data-test=order-total-price]",
      el => el.textContent,
    );
    const totalQuantity = await page.$eval(
      "[data-test=order-total-quantity]",
      el => el.textContent,
    );
    const now = new Date();
    expect(date).toBe(`Order date: ${now.getFullYear() - 1}/1/1`);
    expect(totalPrice).toBe("Total price: 350 coins");
    expect(totalQuantity).toBe("Total quantity: 3");

    const items = await page.$$(
      "[data-test=order-item-1] [data-test=order-detail-item]",
    );
    expect(items.length).toBe(3);

    const firstItem = items[0];
    const firstItemName = await firstItem.$eval(
      "[data-test=order-detail-name]",
      el => el.textContent,
    );
    const firstItemPrice = await firstItem.$eval(
      "[data-test=order-detail-price]",
      el => el.textContent,
    );
    const firstItemQuantity = await firstItem.$eval(
      "[data-test=order-detail-quantity]",
      el => el.textContent,
    );
    expect(firstItemName).toBe("apple");
    expect(firstItemPrice).toBe("price: 100 coins");
    expect(firstItemQuantity).toBe("quantity: 1");
  });
});
