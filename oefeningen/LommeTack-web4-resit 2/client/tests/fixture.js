import { testdata } from "./testdata";
import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(new RegExp(`:3000/boxes`), async (route) => {
      const boxes = testdata.boxes;
      await route.fulfill({ json: boxes });
    });

    testdata.boxes.forEach(async (box) => {
      await page.route(new RegExp(`:3000/boxes/${box.id}`), async (route) => {
        await route.fulfill({ json: box });
      });
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export { expect } from "@playwright/test";
