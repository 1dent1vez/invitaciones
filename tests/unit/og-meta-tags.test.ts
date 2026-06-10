import { describe, it, expect, vi } from "vitest";
import { generateMetadata } from "@/app/(public)/i/[slug]/page";
import { prisma } from "@/lib/prisma";

// Mock the prisma dependency
vi.mock("@/lib/prisma", () => ({
  prisma: {
    pedido: {
      findUnique: vi.fn(),
    },
  },
}));

describe("generateMetadata Dynamic OG & SEO Meta Tags Tests", () => {
  it("debe retornar titulo por defecto si la invitacion no existe o no esta publicada", async () => {
    vi.mocked(prisma.pedido.findUnique).mockResolvedValueOnce(null);

    const metadata = await generateMetadata({ params: { slug: "non-existent" } });
    expect(metadata.title).toBe("Invitación Digital");
  });

  it("debe retornar titulo por defecto si la invitacion no esta en estado PUBLICADA", async () => {
    vi.mocked(prisma.pedido.findUnique).mockResolvedValueOnce({
      id: "1",
      slug: "borrador",
      estadoInvitacion: "BORRADOR",
      datosInvitacion: {
        nombre: "Juan Carlos",
      },
    } as any);

    const metadata = await generateMetadata({ params: { slug: "borrador" } });
    expect(metadata.title).toBe("Invitación Digital");
  });

  it("debe mapear correctamente para cumpleaños (nombre y fotoPortada)", async () => {
    vi.mocked(prisma.pedido.findUnique).mockResolvedValueOnce({
      id: "2",
      slug: "cumple-juan",
      tipoEvento: "cumpleanos",
      estadoInvitacion: "PUBLICADA",
      fechaEvento: new Date("2026-08-20T20:00:00Z"),
      datosInvitacion: {
        nombre: "Juan Carlos",
        fotoPortada: "https://example.com/cumple.jpg",
      },
    } as any);

    const metadata = await generateMetadata({ params: { slug: "cumple-juan" } });

    expect(metadata.title).toBe("Juan Carlos | Invitación Digital");
    expect(metadata.description).toContain("mi Cumpleaños");
    expect(metadata.description).toContain("20 de agosto de 2026");
    expect(metadata.openGraph?.title).toBe("Juan Carlos | Invitación Digital");
    expect(metadata.openGraph?.description).toContain("mi Cumpleaños");
    expect(metadata.openGraph?.images?.[0]).toEqual(expect.objectContaining({
      url: "https://example.com/cumple.jpg"
    }));
    expect(metadata.twitter?.images).toContain("https://example.com/cumple.jpg");
  });
});
