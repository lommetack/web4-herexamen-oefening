import { expect, test } from "./fixture";

test.describe("General", () => {
  test("should display the home page", async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");

    // Verify the page title is visible
    await expect(page.locator("h1")).toContainText("Box Configurator");
  });

  test("should display an empty state when no boxes are present", async ({
    page,
  }) => {
    await page.route(new RegExp(`:3000/boxes`), async (route) => {
      await route.fulfill({ json: [] });
    });

    // Navigate to the home page
    await page.goto("/");

    // Verify the page title is visible
    await expect(page.locator("h1")).toContainText("Box Configurator");

    // Verify the empty state message is visible
    await expect(page.locator(".empty-state")).toBeVisible();
  });
});
