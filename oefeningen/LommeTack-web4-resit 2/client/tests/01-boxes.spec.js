import { expect, test } from "./fixture";
import { newBox, testdata, updatedBox } from "./testdata";
import { defaultBox } from "../app/utils";

test.describe("Navigation", () => {
  test("Should be able to see the list of boxes", async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await expect(
      page.getByRole("link", { name: "Box #1 100×100×80 Thickness:" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Box #2 333×100×333 Thickness:" })
    ).toBeVisible();
  });

  test("should be able to navigate to the box details page", async ({
    page,
  }) => {
    await page.goto("/");
    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });
    await page
      .getByRole("link", { name: "Box #1 100×100×80 Thickness:" })
      .click();
    await expect(page.locator("h1")).toContainText("Box #1");
  });

  test("should be able to navigate back to the box list", async ({ page }) => {
    await page.goto(`/boxes/${testdata.boxes[0].id}`);
    await expect(page.locator("h1")).toContainText(
      `Box #${testdata.boxes[0].id}`
    );
    await page.getByRole("link", { name: "Back to List" }).click();

    await expect(page.locator("h1")).toContainText("Box Configurator");
  });

  test("should be able to navigate to the new box page", async ({ page }) => {
    await page.goto("/");

    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });

    await page.getByRole("link", { name: "Create New Box" }).click();

    await expect(page.locator("h1")).toContainText("Create New Box");
  });

  test("should be able to cancel on the new box page", async ({ page }) => {
    await page.goto("/boxes/new");
    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });
    await page.getByRole("link", { name: "Cancel" }).click();

    await expect(page.locator("h1")).toContainText("Box Configurator");
  });

  test("should be able to navigate to the edit page", async ({ page }) => {
    await page.goto(`/boxes/${testdata.boxes[0].id}`);
    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });
    await expect(page.locator("h1")).toContainText(
      `Box #${testdata.boxes[0].id}`
    );
    await page.getByRole("link", { name: "Edit Box" }).click();

    await expect(page.locator("h1")).toContainText(
      `Edit Box #${testdata.boxes[0].id}`
    );
  });

  test("should be able to cancel on the edit box page", async ({ page }) => {
    await page.goto(`/boxes/edit/${testdata.boxes[0].id}`);
    page.on("load", () => {
      throw new Error("Cannot accept a page refresh");
    });
    await page.getByRole("link", { name: "Cancel" }).click();

    await expect(page.locator("h1")).toContainText(
      `Box #${testdata.boxes[0].id}`
    );
  });
});

test.describe("Create box", () => {
  test("should be able to create a new box", async ({ page }) => {
    await page.goto("/boxes/new");

    await expect(page.locator("h1")).toContainText("Create New Box");
    await page
      .getByRole("spinbutton", { name: "Width (mm)" })
      .fill("" + newBox.width);
    await page
      .getByRole("spinbutton", { name: "Height (mm)" })
      .fill("" + newBox.height);
    await page
      .getByRole("spinbutton", { name: "Depth (mm)" })
      .fill("" + newBox.depth);
    await page
      .getByLabel("Thickness (mm)")
      .selectOption({ value: "" + newBox.thickness });
    await page.getByRole("checkbox", { name: "Include drag handles" }).check();

    await page.getByRole("button", { name: "Create new box" }).click();

    await page.route(new RegExp(`:3000/boxes`), async (route) => {
      // Create a deep copy of the testdata to avoid mutating the original
      const boxes = [...testdata.boxes];
      boxes.push({
        ...newBox,
      });
      await route.fulfill({ json: boxes });
    });

    await expect(page.locator("h1")).toContainText("Box Configurator");
    await expect(
      page.getByRole("link", {
        name: `Box #${newBox.id} ${newBox.width}×${newBox.height}×${newBox.depth} Thickness:`,
      })
    ).toBeVisible();
  });

  test("Box summary should update autmatically", async ({ page }) => {
    await page.goto("/boxes/new");

    await expect(page.locator("h1")).toContainText("Create New Box");

    await expect(
      page.getByRole("spinbutton", { name: "Width (mm)" })
    ).toHaveValue(defaultBox.width.toString());
    await expect(page.getByText(`Width: ${defaultBox.width}mm`)).toBeVisible();
    await page.getByRole("spinbutton", { name: "Width (mm)" }).press("ArrowUp");
    await expect(
      page.getByText(`Width: ${defaultBox.width + 1}mm`)
    ).toBeVisible();

    await expect(
      page.getByRole("spinbutton", { name: "Height (mm)" })
    ).toHaveValue(defaultBox.height.toString());
    await expect(
      page.getByText(`Height: ${defaultBox.height}mm`)
    ).toBeVisible();
    await page
      .getByRole("spinbutton", { name: "Height (mm)" })
      .press("ArrowUp");
    await expect(
      page.getByText(`Height: ${defaultBox.height + 1}mm`)
    ).toBeVisible();

    await expect(
      page.getByRole("spinbutton", { name: "Depth (mm)" })
    ).toHaveValue(defaultBox.depth.toString());
    await expect(page.getByText(`Depth: ${defaultBox.depth}mm`)).toBeVisible();
    await page.getByRole("spinbutton", { name: "Depth (mm)" }).press("ArrowUp");
    await expect(
      page.getByText(`Depth: ${defaultBox.depth + 1}mm`)
    ).toBeVisible();

    await expect(
      page.getByText(`Thickness: ${defaultBox.thickness}mm`)
    ).toBeVisible();
    await page
      .getByLabel("Thickness (mm)")
      .selectOption({ value: "" + (defaultBox.thickness + 1) });
    await expect(
      page.getByText(`Thickness: ${defaultBox.thickness + 1}mm`)
    ).toBeVisible();

    await expect(page.getByTestId("drag-handles")).not.toBeVisible();
    await page.getByRole("checkbox", { name: "Include drag handles" }).check();
    await expect(page.getByTestId("drag-handles")).toBeVisible();
  });

  test("Box needs a minimum width to allow drag handles", async ({ page }) => {
    await page.goto("/boxes/new");

    await expect(page.locator("h1")).toContainText("Create New Box");

    await page.getByRole("spinbutton", { name: "Depth (mm)" }).fill("400");
    await expect(
      page.getByRole("checkbox", { name: "Include drag handles" })
    ).toBeEnabled();

    await page.getByRole("spinbutton", { name: "Depth (mm)" }).fill("100");
    await expect(
      page.getByRole("checkbox", { name: "Include drag handles" })
    ).toBeDisabled();

    await expect(
      page.getByText("Depth must be at least 150mm for drag handles")
    ).toBeVisible();

    // other way around
    await page.getByRole("spinbutton", { name: "Depth (mm)" }).fill("400");
    await expect(
      page.getByText("Depth must be at least 150mm for drag handles")
    ).not.toBeVisible();
    await page.getByRole("checkbox", { name: "Include drag handles" }).check();
    await expect(page.getByTestId("drag-handles")).toBeVisible();
    await page.getByRole("spinbutton", { name: "Depth (mm)" }).fill("100");
    await expect(page.getByTestId("drag-handles")).not.toBeVisible();
    await expect(
      page.getByText("Depth must be at least 150mm for drag handles")
    ).toBeVisible();
  });
});

test.describe("Edit box", () => {
  test("should be able to edit a box", async ({ page }) => {
    await page.goto(`/boxes/${testdata.boxes[0].id}`);
    await expect(page.locator("h1")).toContainText(
      `Box #${testdata.boxes[0].id}`
    );
    await page.getByRole("link", { name: "Edit Box" }).click();
    await expect(page.locator("h1")).toContainText(
      `Edit Box #${testdata.boxes[0].id}`
    );
    await page
      .getByRole("spinbutton", { name: "Width (mm)" })
      .fill("" + updatedBox.width);
    await page
      .getByRole("spinbutton", { name: "Height (mm)" })
      .fill("" + updatedBox.height);
    await page
      .getByRole("spinbutton", { name: "Depth (mm)" })
      .fill("" + updatedBox.depth);
    await page
      .getByLabel("Thickness (mm)")
      .selectOption({ value: "" + updatedBox.thickness });
    await page.getByRole("checkbox", { name: "Include drag handles" }).check();

    await page.route(new RegExp(`:3000/boxes`), async (route) => {
      // Create a deep copy of the testdata to avoid mutating the original
      const boxes = [...testdata.boxes];
      boxes[0] = {
        ...boxes[0],
        ...updatedBox,
      };
      await route.fulfill({ json: boxes });
    });

    await page.getByRole("button", { name: "Save box" }).click();

    await expect(page.locator("h1")).toContainText(`Box Configurator`);
    await expect(
      page.getByRole("link", {
        name: `Box #${testdata.boxes[0].id} ${updatedBox.width}×${updatedBox.height}×${updatedBox.depth} Thickness:`,
      })
    ).toBeVisible();
  });

  test("Should be able to save a box as new box", async ({ page }) => {
    await page.goto(`/boxes/${testdata.boxes[0].id}`);
    await expect(page.locator("h1")).toContainText(
      `Box #${testdata.boxes[0].id}`
    );
    await page.getByRole("link", { name: "Edit Box" }).click();
    await expect(page.locator("h1")).toContainText(
      `Edit Box #${testdata.boxes[0].id}`
    );
    await page
      .getByRole("spinbutton", { name: "Width (mm)" })
      .fill("" + updatedBox.width);
    await page
      .getByRole("spinbutton", { name: "Height (mm)" })
      .fill("" + updatedBox.height);
    await page
      .getByRole("spinbutton", { name: "Depth (mm)" })
      .fill("" + updatedBox.depth);
    await page
      .getByLabel("Thickness (mm)")
      .selectOption({ value: "" + updatedBox.thickness });
    await page.getByRole("checkbox", { name: "Include drag handles" }).check();

    await page.route(new RegExp(`:3000/boxes`), async (route) => {
      // Create a deep copy of the testdata to avoid mutating the original
      const boxes = [...testdata.boxes];
      boxes.push({
        ...updatedBox,
        id: 88,
      });
      await route.fulfill({ json: boxes });
    });

    await page.getByRole("button", { name: "Save as new" }).click();

    await expect(page.locator("h1")).toContainText(`Box Configurator`);
    await expect(
      page.getByRole("link", {
        name: `Box #${88} ${updatedBox.width}×${updatedBox.height}×${
          updatedBox.depth
        } Thickness: ${updatedBox.thickness}`,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: `Box #${testdata.boxes[0].id} ${testdata.boxes[0].width}×${testdata.boxes[0].height}×${testdata.boxes[0].depth} Thickness: ${testdata.boxes[0].thickness}`,
      })
    ).toBeVisible();
  });
});
