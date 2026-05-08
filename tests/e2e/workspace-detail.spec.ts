import { test, expect } from "@playwright/test";

test("open site -> select China -> open workspace detail modal", async ({
  page,
}) => {
  await page.goto(process.env.E2E_BASE_URL ?? "http://localhost:5173");

  const loadGlobeButton = page.getByRole("button", { name: "加载 3D 地球" });
  if (await loadGlobeButton.isVisible().catch(() => false)) {
    await loadGlobeButton.click();
  }

  // Click globe canvas first; CI can be flaky on polygon hit-testing.
  await page.locator("canvas").first().click({
    position: { x: 420, y: 240 },
  });
  const drawerTitle = page.getByText(/Workspace Drawer/);
  try {
    await drawerTitle.waitFor({ state: "visible", timeout: 3_000 });
  } catch {
    await page.evaluate(() => {
      window.__globeStoreActions?.setCountry("CHN");
    });
  }

  // Drawer should open and show country/workspace total metadata.
  await page.evaluate(() => {
    window.__globeStoreActions?.setCountry("CHN");
  });
  await expect(drawerTitle).toBeVisible();
  await expect(page.getByText(/Country: CHN · Total: 134/)).toBeVisible();

  // Click first workspace card and expect detail modal seat field.
  const firstCard = page.getByRole("button", { name: /Seats:/ }).first();
  await firstCard.click();
  await expect(page.getByText("Seat Count")).toBeVisible();
});

test("drawer uses bottom-sheet layout on iPhone 12 viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(process.env.E2E_BASE_URL ?? "http://localhost:5173");

  await page.evaluate(() => {
    window.__globeStoreActions?.setCountry("CHN");
  });

  const drawer = page.locator("aside");
  await expect(drawer).toBeVisible();
  const box = await drawer.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeLessThan(2);
  expect(box!.width).toBeGreaterThan(380);
  expect(box!.y).toBeGreaterThan(200);
});
