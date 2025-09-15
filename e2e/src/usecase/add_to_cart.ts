import "jest-puppeteer";
import "expect-puppeteer";

test("add to cart", async () => {
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

  // add product 1 to cart
  await page.type(
    "[data-test=product-list] [data-test=product-item-1] [data-test=product-quantity-input]",
    "1",
  );
  // add product 2 to cart
  await page.type(
    "[data-test=product-list] [data-test=product-item-2] [data-test=product-quantity-input]",
    "2",
  );

  // go to cart page
  await Promise.all([
    page.click(`[data-test=link-to-cart]`),
    page.waitForSelector("[data-test=total-price]"),
    page.waitForSelector("[data-test=total-quantity]"),
    page.waitForSelector("[data-test=product-list]"),
  ]);

  const linkToCart = await page.$eval(
    "[data-test=link-to-cart]",
    el => el.textContent,
  );
  expect(linkToCart).toBe("Cart 3");

  const totalPrice = await page.$eval(
    "[data-test=total-price]",
    el => el.textContent,
  );
  const totalQuantity = await page.$eval(
    "[data-test=total-quantity]",
    el => el.textContent,
  );

  expect(totalPrice).toBe("Total price: 400 coins");
  expect(totalQuantity).toBe("Total quantity: 3");

  const items = await page.$$(
    "[data-test=product-list] [data-test^=product-item]",
  );

  expect(items.length).toBe(2);

  const firstItem = items[0];
  const firstItemName = await firstItem.$eval(
    "[data-test=product-name]",
    el => el.textContent,
  );
  const firstItemQuantityInput = await firstItem.$eval(
    "[data-test=product-quantity-input]",
    el => el.getAttribute("value"),
  );

  expect(firstItemName).toBe("apple");
  expect(firstItemQuantityInput).toBe("1");

  const secondItem = items[1];
  const secondItemName = await secondItem.$eval(
    "[data-test=product-name]",
    el => el.textContent,
  );
  const secondItemQuantityInput = await secondItem.$eval(
    "[data-test=product-quantity-input]",
    el => el.getAttribute("value"),
  );
  expect(secondItemName).toBe("blue highlighter");
  expect(secondItemQuantityInput).toBe("2");
});
