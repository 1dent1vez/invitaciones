import { test, expect } from "@playwright/test";
import { PRECIOS_PAQUETE } from "../../src/lib/paquetes";

test.describe("Landing Page E2E Tests - ¡Ábreme!", () => {
  test("debería cargar la landing page con la caja cerrada y mostrar el headline principal", async ({ page }) => {
    await page.goto("/");
    
    // El título principal del HeroBox debe estar visible
    await expect(page.locator("h1")).toContainText("Tu invitación de Canva ya pasó de moda");
    
    // El botón "Ábreme" debe estar visible
    const btnAbreme = page.getByTestId("btn-abreme");
    await expect(btnAbreme).toBeVisible();
    
    // El contenido adicional NO debería estar visible antes de abrir
    await expect(page.locator("text=¿Cómo funciona?")).not.toBeVisible();
  });

  test("debería abrir la caja al hacer click en 'Ábreme' y revelar las secciones subsecuentes", async ({ page }) => {
    await page.goto("/");
    
    // Click en el CTA principal "Ábreme" usando testId para evitar colisiones
    await page.getByTestId("btn-abreme").click();
    
    // Esperar a que pase el delay de animación (800ms)
    await page.waitForTimeout(1000);
    
    // Comprobar la visibilidad de las nuevas secciones reveladas
    await expect(page.locator("text=Nadie quiere otro PDF de 20 Megas por WhatsApp")).toBeVisible();
    await expect(page.locator("text=¿Cómo funciona?")).toBeVisible();
    await expect(page.locator("text=Elige el plan ideal para tu fiesta")).toBeVisible();
    await expect(page.locator("text=Elige tu estilo favorito")).toBeVisible();
  });

  test("debería abrir la caja automáticamente al hacer scroll hacia abajo", async ({ page }) => {
    await page.goto("/");
    
    // Esperar a que la página esté hidratada buscando el botón interactivo
    await expect(page.getByTestId("btn-abreme")).toBeVisible();
    
    // Darle tiempo a Next.js para hidratar la página y registrar los listeners
    await page.waitForTimeout(1000);
    
    // Hacer scroll y despachar el evento para máxima resiliencia en emuladores móviles
    await page.evaluate(() => {
      // Para asegurar que scrollY sea mayor a 10 en entornos de test limitados (como WebKit/Safari),
      // aumentamos la altura del body para permitir el desplazamiento.
      document.body.style.height = "5000px";
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event("scroll"));
    });
    
    // Esperar a que se ejecute la animación y el cambio de estado
    await page.waitForTimeout(1500);
    
    // Las secciones deberían mostrarse en el DOM
    await expect(page.locator("text=¿Cómo funciona?")).toBeVisible();
  });

  test("debería mostrar los precios correctos de los paquetes leyendo de src/lib/paquetes.ts", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("btn-abreme").click();
    await page.waitForTimeout(1000);
    
    // El selector de la sección de paquetes debe estar visible
    await expect(page.locator("text=Elige el plan ideal para tu fiesta")).toBeVisible();
    
    // Comprobar que los precios en la interfaz corresponden a los del archivo config real
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toContain(`$${PRECIOS_PAQUETE.esencial}`);
    expect(bodyText).toContain(`$${PRECIOS_PAQUETE.completa}`);
    expect(bodyText).toContain(`$${PRECIOS_PAQUETE.premium}`);
  });

  test("debería funcionar el enlace en el CTA final para deslizarse a la sección de contacto", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("btn-abreme").click();
    await page.waitForTimeout(1000);
    
    const btnCrea = page.getByRole("link", { name: "Crea tu invitación ahora" });
    await expect(btnCrea).toBeVisible();
    
    // Click en el CTA final
    await btnCrea.click();
    
    // Debería cambiar la URL para apuntar al hash de contacto
    await expect(page).toHaveURL(/.*#contacto/);
  });

  test("debería funcionar la navegación y revelarse el contenido con prefers-reduced-motion activado", async ({ page }) => {
    // Emular preferencia de movimiento reducido
    await page.emulateMedia({ reducedMotion: "reduce" });
    
    await page.goto("/");
    
    // Abrir
    await page.getByTestId("btn-abreme").click();
    await page.waitForTimeout(1000);
    
    // El flujo principal debe continuar funcionando y revelando contenido
    await expect(page.locator("text=¿Cómo funciona?")).toBeVisible();
  });
});
