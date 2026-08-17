import { test, expect } from "@playwright/test";
import { day, newHabit, testdata } from "./testdata";

test.beforeEach(async ({ context }) => {
  await context.clock.setFixedTime(new Date(`${day}T10:00:00`));

  await context.route(/:3000\/habits(\?.*)?$/, async (route) => {
    const json = testdata.habits;
    await route.fulfill({ json });
  });

  await context.route(/:3000\/logs(\?.*)?$/, async (route) => {
    const json = testdata.logs;
    await route.fulfill({ json });
  });
});

test.describe("Home Page", () => {
  test("should display the home page", async ({ page }) => {
    await page.goto("/");

    // Verify the page title is visible
    await expect(page.locator("h1")).toContainText("Bad Habit Tracker");
  });

  test("should check the checkbox when clicking habit", async ({ page }) => {
    await page.goto("/");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await expect(page.locator(".habit-list__input").first()).not.toBeChecked();

    page.route(/:3000\/logs(\?.*)?$/, async (route) => {
      route.fulfill({
        json: [...testdata.logs, { id: 2, date: day, habits: [1] }],
      });
    });

    await page.locator(".habit-list__item").first().click();

    await expect(page.locator(".habit-list__input").first()).toBeChecked();
  });

  test("should update streak after checking habit", async ({ page }) => {
    await page.goto("/");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await expect(page.getByText("1 day streak")).toBeVisible();

    page.route(/:3000\/logs(\?.*)?$/, async (route) => {
      route.fulfill({
        json: [...testdata.logs, { id: 2, date: day, habits: [1] }],
      });
    });

    await page.getByRole("list").getByText("Skip workouts").click();

    await expect(page.getByText("2 days streak")).toBeVisible();
  });

  test("should update top streak after checking habit", async ({ page }) => {
    const streakData = [
      { id: 1, date: "2025-04-01", habits: [1] },
      { id: 2, date: "2025-04-02", habits: [1, 2] },
      { id: 3, date: "2025-05-03", habits: [1] },
      { id: 4, date: "2025-05-04", habits: [1] },
    ];

    page.route(/:3000\/logs(\?.*)?$/, async (route) => {
      route.fulfill({
        json: streakData,
      });
    });

    await page.goto("/");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await expect(page.getByText("2days")).toBeVisible();

    page.route(/:3000\/logs(\?.*)?$/, async (route) => {
      route.fulfill({
        json: [...streakData, { id: 4, date: day, habits: [1] }],
      });
    });

    await page.getByRole("list").getByText("Skip workouts").click();

    await expect(page.getByText("3days")).toBeVisible();
  });

  test("should provide empty home state", async ({ page }) => {
    await page.route(/:3000\/habits(\?.*)?$/, async (route) => {
      await route.fulfill({ json: [] });
    });

    await page.route(/:3000\/logs(\?.*)?$/, async (route) => {
      await route.fulfill({ json: [] });
    });

    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Bad Habit Tracker");
    await expect(
      page.getByText("No days logged yet, go ahead and track some habits"),
    ).toBeVisible();
    await expect(page.getByText("No bad habits defined")).toBeVisible();
  });
});

test.describe("Habits Page", () => {
  test("should display the habits page", async ({ page }) => {
    await page.goto("/habits");

    // Verify the page title is visible
    await expect(page.locator("h1")).toContainText("Manage Bad Habits");
  });

  test("should be able to return to the home page", async ({ page }) => {
    await page.goto("/habits");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await page.getByRole("link", { name: "Back to Tracker" }).click();

    await expect(page.locator("h1")).toContainText("Bad Habit Tracker");
  });

  test("should be able to add a habit", async ({ page }) => {
    await page.goto("/habits");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await page.getByRole("link", { name: "Add New Habit" }).click();

    await page.getByRole("textbox", { name: "Habit Name" }).click();

    await page.getByRole("textbox", { name: "Habit Name" }).fill(newHabit.name);

    await page.route(/:3000\/habits(\?.*)?$/, async (route) => {
      route.fulfill({
        json: [...testdata.habits, newHabit],
      });
    });

    await page.keyboard.press("Enter");

    await expect(page.getByText(newHabit.name)).toBeVisible();
  });

  test("should be able to cancelling adding a habit", async ({ page }) => {
    await page.goto("/habits");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await page.getByRole("link", { name: "Add New Habit" }).click();

    await page.getByRole("textbox", { name: "Habit Name" }).click();

    await page.getByRole("textbox", { name: "Habit Name" }).fill(newHabit.name);

    await page.getByRole("link", { name: "Cancel" }).click();

    await expect(page.locator("h1")).toContainText("Manage Bad Habits");
    await expect(
      page.getByRole("heading", { name: newHabit.name }),
    ).not.toBeVisible();
  });

  test("should be able to go back to habits from new habit", async ({
    page,
  }) => {
    await page.goto("/habits");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await page.getByRole("link", { name: "Add New Habit" }).click();

    await page.getByRole("link", { name: "Back to Habits" }).click();

    await expect(page.locator("h1")).toContainText("Manage Bad Habits");
  });

  test("should be able to edit a habit", async ({ page }) => {
    await page.route(/:3000\/habits\/1/, async (route) => {
      route.fulfill({
        json: testdata.habits[0],
      });
    });

    await page.goto("/habits");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await expect(page.locator("h3").first()).toContainText(
      testdata.habits[0].name,
    );

    await page.getByRole("link", { name: "Edit" }).first().click();

    await page.getByRole("textbox", { name: "Habit Name" }).click();

    const newName = "Skip TESTED workouts";
    await page.getByRole("textbox", { name: "Habit Name" }).fill(newName);

    await page.route(/:3000\/habits(\?.*)?$/, async (route) => {
      route.fulfill({
        json: testdata.habits.map((habit) => {
          if (habit.id === testdata.habits[0].id) {
            return { ...habit, name: newName };
          }
          return habit;
        }),
      });
    });

    await page.keyboard.press("Enter");

    await expect(page.getByText(newName)).toBeVisible();
  });

  test("should be able to cancelling editing a habit", async ({ page }) => {
    await page.route(/:3000\/habits\/1/, async (route) => {
      route.fulfill({
        json: testdata.habits[0],
      });
    });

    await page.goto("/habits");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await page.getByRole("link", { name: "Edit" }).first().click();

    await page.getByRole("textbox", { name: "Habit Name" }).click();

    const newName = "Skip TESTED workouts";
    await page.getByRole("textbox", { name: "Habit Name" }).fill(newName);

    await page.getByRole("link", { name: "Cancel" }).click();

    await expect(page.locator("h1")).toContainText("Manage Bad Habits");
    await expect(
      page.getByRole("heading", { name: newHabit.name }),
    ).not.toBeVisible();

    await expect(
      page.getByRole("heading", { name: testdata.habits[0].name }),
    ).toBeVisible();
  });

  test("should be able to go back to habits from edit habit", async ({
    page,
  }) => {
    await page.route(/:3000\/habits\/1/, async (route) => {
      route.fulfill({
        json: testdata.habits[0],
      });
    });
    await page.goto("/habits");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await page.getByRole("link", { name: "Edit" }).first().click();

    await page.getByRole("link", { name: "Back to Habits" }).click();

    await expect(page.locator("h1")).toContainText("Manage Bad Habits");
  });

  test("should provide empty habits state", async ({ page }) => {
    await page.route(/:3000\/habits(\?.*)?$/, async (route) => {
      await route.fulfill({ json: [] });
    });

    await page.route(/:3000\/logs(\?.*)?$/, async (route) => {
      await route.fulfill({ json: [] });
    });

    await page.goto("/habits");
    await expect(page.getByText("No habits added yet")).toBeVisible();
  });
});
