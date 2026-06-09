import { test, expect } from "@playwright/test";

test.describe("Responsive Design Tests", () => {
  // Test desktop layout
  test("debería cargar la landing page correctamente en desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    
    // Check main title or header exists
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
  });

  test("debería cargar la landing page correctamente en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    
    // Check main title is visible
    await expect(page.locator("h1")).toBeVisible();
  });

  test("debería cargar la demo de cumpleanos-esencial en desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/demo/cumpleanos-esencial");
    
    // Check main title of the mock invitation is visible
    await expect(page.locator("body")).toContainText("Santiago");
    await expect(page.locator('a:has-text("Ver dirección en Maps")')).toBeVisible();
  });

  test("debería cargar la demo de cumpleanos-esencial en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/demo/cumpleanos-esencial");
    
    // Check elements in mobile viewport
    await expect(page.locator("body")).toContainText("Santiago");
    await expect(page.locator('a:has-text("Ver dirección en Maps")')).toBeVisible();
  });
});
