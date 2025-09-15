import "jest-puppeteer";
import "expect-puppeteer";

describe("search page", () => {
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

  describe("search", () => {
    test("display products", async () => {
      // go to search page
      await Promise.all([
        page.goto(`${FRONT_URL}/`),
        page.waitForSelector("[data-test=product-list]"),
      ]);

      const items = await page.$$(
        "[data-test=product-list] [data-test^=product-item]",
      );

      expect(items.length).toBe(10);

      const firstItem = items[0];
      const name = await firstItem.$eval(
        "[data-test=product-name]",
        el => el.textContent,
      );
      const imageSrc = await firstItem.$eval("[data-test=product-image]", el =>
        el.getAttribute("src"),
      );
      const lastOrderedAt = await firstItem.$eval(
        "[data-test=product-last-ordered-at]",
        el => el.textContent,
      );
      const now = new Date();

      expect(imageSrc).toBe("/image/apple.png");
      expect(lastOrderedAt).toBe(`last order: ${now.getFullYear()}/1/1`);
      expect(name).toBe("apple");
    });
  });

  describe("search form", () => {
    test("filter products by entering a keyword", async () => {
      // go to search page
      await Promise.all([
        page.goto(`${FRONT_URL}/`),
        page.waitForSelector("[data-test=search-input]"),
      ]);

      // fill in the search form and click the search button
      await page.type("[data-test=search-input]", "pen");
      await Promise.all([
        page.click("[data-test=search-button]"),
        page.waitForSelector("[data-test=product-item-22]"),
      ]);

      expect(page.url()).toBe(`${FRONT_URL}/?filter=pen`);

      const items = await page.$$("[data-test^=product-item]");

      expect(items.length).toBe(3);

      const firstItem = items[0];
      const name = await firstItem.$eval(
        "[data-test=product-name]",
        el => el.textContent,
      );

      expect(name).toBe("orange pencil");
    });
  });

  describe("pagination", () => {
    test("prev and next button work", async () => {
      // go to the first page
      await Promise.all([
        page.goto(`${FRONT_URL}/`),
        page.waitForSelector("[data-test=current-page]"),
      ]);

      let currentPage = await page.$eval(
        "[data-test=current-page]",
        el => el.textContent,
      );
      expect(currentPage).toBe("1");

      // click next page button
      await Promise.all([
        page.click("[data-test=next-button]"),
        page.waitForSelector("[data-test=product-item-11]"),
      ]);

      currentPage = await page.$eval(
        "[data-test=current-page]",
        el => el.textContent,
      );
      expect(currentPage).toBe("2");
      expect(page.url()).toBe(`${FRONT_URL}/?page=2`);

      // click prev page button
      await Promise.all([
        page.click("[data-test=prev-button]"),
        page.waitForSelector("[data-test=product-item-1]"),
      ]);

      currentPage = await page.$eval(
        "[data-test=current-page]",
        el => el.textContent,
      );
      expect(currentPage).toBe("1");
      expect(page.url()).toBe(`${FRONT_URL}/?page=1`);
    });

    test("prev button is disabled on the first page", async () => {
      // go to the first page
      await Promise.all([
        page.goto(`${FRONT_URL}/?page=1`),
        page.waitForSelector("[data-test=prev-button]"),
      ]);

      const disabledPrevButton = await page.$(
        "[data-test=prev-button][disabled]",
      );
      expect(disabledPrevButton).not.toBeNull();
    });

    test("next button is disabled on the last page", async () => {
      // go to the last page
      await Promise.all([
        page.goto(`${FRONT_URL}/?page=4`),
        page.waitForSelector("[data-test=next-button]"),
      ]);

      const disabledNextButton = await page.$(
        "[data-test=next-button][disabled]",
      );
      expect(disabledNextButton).not.toBeNull();
    });
  });
});
