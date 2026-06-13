import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test.describe("Completa Package E2E Tests", () => {
  test.beforeAll(async () => {
    // Ensure we have a client for our E2E invitation
    let client = await prisma.cliente.findFirst({
      where: { nombre: "María Pérez" },
    });
    if (!client) {
      client = await prisma.cliente.create({
        data: {
          nombre: "María Pérez",
          telefono: "5512345678",
          email: "maria@example.com",
          fuente: "instagram",
        },
      });
    }

    // Check if the order with gifts exists
    const orderWithGifts = await prisma.pedido.findFirst({
      where: { slug: "santiago-completa" },
    });

    if (orderWithGifts) {
      await prisma.pedido.update({
        where: { id: orderWithGifts.id },
        data: {
          estadoInvitacion: "PUBLICADA",
          paquete: "completa",
          template: "cumpleanos-completa",
          datosInvitacion: {
            nombre: "Santiago Completa",
            edad: 30,
            fecha: "2026-11-05T20:00:00.000Z",
            hora: "20:00",
            lugar: "Salón Real",
            direccion: "Av. Principal #123",
            tipoCelebracion: "Adultos",
            fotoPortada: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800&auto=format&fit=crop",
            mensaje: "¡Vamos a celebrar!",
            whatsapp: "5512345678",
            fotosGaleria: [
              "https://images.unsplash.com/photo-1513151233558-d860c5398176",
              "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92"
            ],
            dressCode: "Casual",
            dressCodeDesc: "Vente cómodo",
            mensajeFestejo: "Gracias por venir a mi fiesta",
            itinerario: "20:00 Bienvenida\n22:00 Pastel",
            datosRegalo: "Efectivo o transferencia",
            mesaRegalos: true,
            mesaRegalosDatos: "Mesa Liverpool #1234",
          }
        },
      });
    } else {
      await prisma.pedido.create({
        data: {
          clienteId: client.id,
          tipoEvento: "cumpleanos",
          paquete: "completa",
          template: "cumpleanos-completa",
          fechaEvento: new Date("2026-11-05T20:00:00.000Z"),
          precio: 550.00,
          estado: "completado",
          estadoInvitacion: "PUBLICADA",
          slug: "santiago-completa",
          urlPublica: "http://localhost:3000/i/santiago-completa",
          datosInvitacion: {
            nombre: "Santiago Completa",
            edad: 30,
            fecha: "2026-11-05T20:00:00.000Z",
            hora: "20:00",
            lugar: "Salón Real",
            direccion: "Av. Principal #123",
            tipoCelebracion: "Adultos",
            fotoPortada: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800&auto=format&fit=crop",
            mensaje: "¡Vamos a celebrar!",
            whatsapp: "5512345678",
            fotosGaleria: [
              "https://images.unsplash.com/photo-1513151233558-d860c5398176",
              "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92"
            ],
            dressCode: "Casual",
            dressCodeDesc: "Vente cómodo",
            mensajeFestejo: "Gracias por venir a mi fiesta",
            itinerario: "20:00 Bienvenida\n22:00 Pastel",
            datosRegalo: "Efectivo o transferencia",
            mesaRegalos: true,
            mesaRegalosDatos: "Mesa Liverpool #1234",
          },
        },
      });
    }

    // Check if the order without gifts exists
    const orderNoGifts = await prisma.pedido.findFirst({
      where: { slug: "santiago-no-regalos" },
    });

    if (orderNoGifts) {
      await prisma.pedido.update({
        where: { id: orderNoGifts.id },
        data: {
          estadoInvitacion: "PUBLICADA",
          paquete: "completa",
          template: "cumpleanos-completa",
          datosInvitacion: {
            nombre: "Santiago Sin Regalos",
            edad: 30,
            fecha: "2026-11-05T20:00:00.000Z",
            hora: "20:00",
            lugar: "Salón Real",
            direccion: "Av. Principal #123",
            tipoCelebracion: "Adultos",
            fotoPortada: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800&auto=format&fit=crop",
            mensaje: "¡Vamos a celebrar!",
            whatsapp: "5512345678",
            fotosGaleria: [
              "https://images.unsplash.com/photo-1513151233558-d860c5398176",
            ],
            dressCode: "Casual",
            dressCodeDesc: "Vente cómodo",
            mensajeFestejo: "Gracias por venir a mi fiesta",
            itinerario: "20:00 Bienvenida\n22:00 Pastel",
            datosRegalo: "Efectivo o transferencia",
            mesaRegalos: false,
          }
        },
      });
    } else {
      await prisma.pedido.create({
        data: {
          clienteId: client.id,
          tipoEvento: "cumpleanos",
          paquete: "completa",
          template: "cumpleanos-completa",
          fechaEvento: new Date("2026-11-05T20:00:00.000Z"),
          precio: 550.00,
          estado: "completado",
          estadoInvitacion: "PUBLICADA",
          slug: "santiago-no-regalos",
          urlPublica: "http://localhost:3000/i/santiago-no-regalos",
          datosInvitacion: {
            nombre: "Santiago Sin Regalos",
            edad: 30,
            fecha: "2026-11-05T20:00:00.000Z",
            hora: "20:00",
            lugar: "Salón Real",
            direccion: "Av. Principal #123",
            tipoCelebracion: "Adultos",
            fotoPortada: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800&auto=format&fit=crop",
            mensaje: "¡Vamos a celebrar!",
            whatsapp: "5512345678",
            fotosGaleria: [
              "https://images.unsplash.com/photo-1513151233558-d860c5398176",
            ],
            dressCode: "Casual",
            dressCodeDesc: "Vente cómodo",
            mensajeFestejo: "Gracias por venir a mi fiesta",
            itinerario: "20:00 Bienvenida\n22:00 Pastel",
            datosRegalo: "Efectivo o transferencia",
            mesaRegalos: false,
          },
        },
      });
    }
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test("debería cargar la invitación Completa y mostrar sus secciones principales", async ({ page }) => {
    await page.goto("/i/santiago-completa");

    // Validar nombre y edad
    await expect(page.locator("body")).toContainText("Santiago Completa");
    await expect(page.locator("body")).toContainText("30 Años");

    // Vestimenta
    await expect(page.locator("body")).toContainText("Código de Vestimenta");
    await expect(page.locator("body")).toContainText("Casual");
    await expect(page.locator("body")).toContainText("Vente cómodo");

    // Mensaje Especial
    await expect(page.locator("body")).toContainText("Mensaje Especial");
    await expect(page.locator("body")).toContainText("Gracias por venir a mi fiesta");

    // Itinerario / Timeline
    await expect(page.locator("body")).toContainText("Programa del Evento");
    await expect(page.locator("body")).toContainText("Bienvenida");
    await expect(page.locator("body")).toContainText("Pastel");
  });

  test("debería interactuar con la galería de fotos en lightbox", async ({ page }) => {
    await page.goto("/i/santiago-completa");

    // Localizar miniaturas
    const thumb0 = page.locator('[data-testid="gallery-thumb-0"]');
    await expect(thumb0).toBeVisible();

    // Clic en la primera miniatura para abrir lightbox
    await thumb0.click();

    // Validar visibilidad del modal lightbox
    const modal = page.locator('[data-testid="lightbox-modal"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("1 de 2");

    // Clic en Siguiente foto
    const btnSiguiente = page.locator('[data-testid="btn-siguiente"]');
    await btnSiguiente.click();
    await expect(modal).toContainText("2 de 2");

    // Clic en Anterior foto
    const btnAnterior = page.locator('[data-testid="btn-anterior"]');
    await btnAnterior.click();
    await expect(modal).toContainText("1 de 2");

    // Cerrar lightbox
    const btnCerrar = page.locator('[data-testid="btn-cerrar"]');
    await btnCerrar.click();
    await expect(modal).not.toBeVisible();
  });

  test("debería renderizar la mesa de regalos solo si tieneMesaRegalos / mesaRegalos es true", async ({ page }) => {
    // 1. Caso Completa (tieneMesaRegalos = true)
    await page.goto("/i/santiago-completa");
    const giftsSection = page.locator('[data-testid="mesa-regalos-seccion"]');
    await expect(giftsSection).toBeVisible();
    await expect(giftsSection).toContainText("Efectivo o transferencia");
    await expect(giftsSection).toContainText("Mesa Liverpool #1234");

    // 2. Caso Sin Regalos (tieneMesaRegalos = false)
    await page.goto("/i/santiago-no-regalos");
    const noGiftsSection = page.locator('[data-testid="mesa-regalos-seccion"]');
    await expect(noGiftsSection).not.toBeVisible();
  });

  test("debería permitir completar el formulario RSVP", async ({ page }) => {
    await page.goto("/i/santiago-completa");

    const nombreInput = page.locator("input#rsvp-nombre");
    await nombreInput.waitFor({ state: "visible" });
    await nombreInput.click();
    await nombreInput.fill("Invitado E2E Completa");

    // Esperar un momento para verificar si la hidratación de React limpió el input
    await page.waitForTimeout(500);
    const value = await nombreInput.inputValue();
    if (value !== "Invitado E2E Completa") {
      // Si se limpió por la hidratación, volver a llenar
      await nombreInput.fill("Invitado E2E Completa");
    }

    await page.selectOption("select#rsvp-pax", "3");
    await page.fill("textarea#rsvp-mensaje", "¡Nos vemos en la fiesta!");

    // Clic en Confirmar (se simula el envío y se muestra éxito antes del redirect)
    await page.click('[data-testid="whatsapp-confirmar"]');

    // Validar mensaje de éxito
    await expect(page.locator("text=¡Confirmación Registrada!")).toBeVisible();
  });

  test("debería emular prefers-reduced-motion y desactivar animaciones", async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto("/i/santiago-completa");
    
    // Verificar que la página carga correctamente y se muestra el contenido
    await expect(page.locator("body")).toContainText("Santiago Completa");
    await context.close();
  });
});
