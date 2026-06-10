import { test, expect } from "@playwright/test";

test.describe("Flujo End-to-End Completo", () => {
  test("debería completar todo el flujo del cliente, pedido, publicación y RSVP", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"), "Admin flow is optimized for desktop viewports");
    test.setTimeout(60000);
    // 1. Login
    await page.goto("/login");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin_super_secret";
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');

    // Wait for redirect to /admin
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });

    // 2. Crear cliente en /admin/clientes
    await page.goto("/admin/clientes");
    await page.click('button:has-text("Registrar Cliente")');

    const clientName = `Cliente E2E ${Date.now()}`;
    await page.fill('input#nombre', clientName);
    await page.fill('input#telefono', '5512345678');
    await page.fill('input#email', `e2e-${Date.now()}@example.com`);
    await page.selectOption('select#fuente', 'tienda');
    await page.fill('textarea#notas', 'Notas de prueba E2E');
    await page.click('button[type="submit"]:has-text("Guardar")');

    // Verify client in table
    await expect(page.locator("table")).toContainText(clientName);

    // 3. Crear pedido en /admin/pedidos/nuevo
    await page.goto("/admin/pedidos/nuevo");
    await page.fill('input[placeholder="Filtrar clientes..."]', clientName);
    await page.click(`text="${clientName}"`);
    await page.click('button:has-text("Continuar")');

    await page.selectOption('select[name="paquete"]', 'completa');
    
    // Choose a future date: 2027-12-31
    await page.fill('input#fechaEvento', '2027-12-31');
    await page.fill('textarea[name="notas"]', 'Notas de prueba');
    await page.click('button[type="submit"]:has-text("Crear Pedido")');

    // Wait for redirect to /admin/pedidos/[id]
    await expect(page).toHaveURL(/\/admin\/pedidos\/c[a-zA-Z0-9]{24}/);
    const orderUrl = page.url();

    // 4. Editar invitación en /admin/pedidos/[id]/editar
    await page.click('a:has-text("Editar Invitación")');
    await expect(page).toHaveURL(/\/admin\/pedidos\/c[a-zA-Z0-9]{24}\/editar/);

    // Update form details (required fields for cumpleanos-completa)
    await page.fill('input[name="nombre"]', 'Santiago');
    await page.fill('input[name="edad"]', '30');
    await page.fill('input[name="lugar"]', 'Salón Real');
    await page.fill('textarea[name="direccion"]', 'Av. Principal #123');
    await page.fill('input[name="whatsapp"]', '5512345678');
    await page.selectOption('select[name="tipoCelebracion"]', 'Adultos');
    await page.selectOption('select[name="musica"]', 'Fiesta');
    await page.selectOption('select[name="dressCode"]', 'Casual');
    await page.fill('input[name="fotoPortada"]', 'https://images.unsplash.com/photo-1513151233558-d860c5398176');

    // Verify photo limits (counter displays "0 de 3" for cumpleanos-completa)
    const galleryCount = page.locator('[data-testid="gallery-count"]');
    await expect(galleryCount).toContainText('0 de 3');

    await page.click('button:has-text("Guardar borrador")');
    await expect(page.locator('text=Borrador guardado')).toBeVisible();

    // 5. Publicar invitación
    await page.click('button:has-text("Publicar")');
    await expect(page.locator('text=Invitación publicada')).toBeVisible();
    
    // Wait for URL to appear
    const linkElement = page.locator('span.font-mono', { hasText: 'http' });
    await expect(linkElement).toBeVisible();
    const publicUrl = await linkElement.innerText();
    expect(publicUrl).toContain('/i/');

    // 6. Acceder a la URL pública /i/[slug]
    await page.goto(publicUrl);
    await expect(page.locator('body')).toContainText('Salón Real');

    // 7. Enviar RSVP desde invitación pública
    await page.click('button:has-text("Confirmar Lugar")');
    await page.fill('input[name="nombre"]', 'Invitado E2E');
    await page.fill('input[name="pax"]', '2');
    await page.fill('input[name="telefono"]', '5511223344');
    await page.fill('textarea[name="mensaje"]', 'Muchas felicidades de parte del E2E test!');
    await page.click('button[type="submit"]:has-text("Confirmar")');

    // Verify confirmation message
    await expect(page.locator('text=¡Confirmación Registrada!')).toBeVisible();

    // 8. Verificar RSVP en panel admin
    await page.goto(orderUrl);
    await expect(page.locator('table')).toContainText('Invitado E2E');
    await expect(page.locator('table')).toContainText('5511223344');
  });
});
