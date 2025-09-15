import "jest-puppeteer";
import "expect-puppeteer";

test("create order", async () => {
  // login
  await Promise.all([
    page.goto(`${FRONT_URL}`),
    page.waitForSelector("[data-test=email]"),
    page.waitForSelector("[data-test=password]"),
  ]);
  await page.type("[data-test=email]", "baby@progate.com");
  await page.type("[data-test=password]", "password");
  await Promise.all([
    page.click("[data-test=submit]"),
    page.waitForSelector("[data-test=product-list]"),
  ]);

  // go to search page
  await Promise.all([
    page.goto(`${FRONT_URL}/`),
    page.waitForSelector("[data-test=product-list]"),
  ]);

  // add product 9 to cart
  await page.type(
    "[data-test=product-list] [data-test=product-item-9] [data-test=product-quantity-input]",
    "1",
  );
  // add product 10 to cart
  await page.type(
    "[data-test=product-list] [data-test=product-item-10] [data-test=product-quantity-input]",
    "1",
  );

  // go to cart page
  await Promise.all([
    page.click("[data-test=link-to-cart]"),
    page.waitForSelector("[data-test=cart-summary]"),
  ]);

  expect(page.url()).toBe(`${FRONT_URL}/cart`);

  // press order button and go to order complete page
  await Promise.all([
    page.click("[data-test=order-button]"),
    page.waitForSelector("[data-test=order-complete-message]"),
  ]);

  expect(page.url()).toBe(`${FRONT_URL}/orders/5/complete`);
});
