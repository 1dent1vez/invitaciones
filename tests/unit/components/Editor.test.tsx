import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditorClient } from "@/app/(admin)/admin/pedidos/[id]/editar/editor-client";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/components/ui/toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the actions to prevent database/server-side operations
vi.mock("@/app/(admin)/admin/pedidos/[id]/editar/actions", () => {
  return {
    savePedidoDatosAction: vi.fn(() => Promise.resolve({ success: true, data: {} })),
    publicarInvitacionAction: vi.fn(() => Promise.resolve({ success: true, data: { slug: "test-slug", urlPublica: "http://localhost:3000/i/test-slug" } })),
    generarQRAction: vi.fn(() => Promise.resolve({ success: true, data: "https://cloudinary.com/qr.png" })),
    uploadImageAction: vi.fn(() => Promise.resolve({ success: true, data: "https://cloudinary.com/image.png" })),
  };
});

describe("EditorClient Component Tests", () => {
  const mockPedido = {
    id: "pedido-123",
    clienteId: "cliente-123",
    tipoEvento: "boda",
    fechaEvento: new Date("2026-12-18T18:00:00Z"),
    template: "boda-elegante",
    precio: 2500.00,
    estado: "cotizado",
    slug: null,
    urlPublica: null,
    qrUrl: null,
    datosJson: null,
    notas: "Notas de prueba de ubicacion",
    cliente: {
      id: "cliente-123",
      nombre: "Ana y Carlos",
      fuente: "instagram",
      telefono: null,
      email: null,
      notas: null,
    },
  };

  it("debe renderizar el formulario dinámico con los campos del template", () => {
    render(<EditorClient pedido={mockPedido as any} />);

    // should render the title/header
    expect(screen.getByText("Editar Invitación")).toBeInTheDocument();
    expect(screen.getByText("Boda Elegante")).toBeInTheDocument();

    // boda-elegante template fields
    // fields: nombres, fecha, ubicacion, mapaUrl, mensaje, colorPrincipal, colorSecundario, portadaUrl, dressCode, regalosDatos, musicaUrl
    expect(screen.getByText(/Nombres de los Novios/i)).toBeInTheDocument();
    expect(screen.getByText(/Fecha y Hora del Evento/i)).toBeInTheDocument();
    expect(screen.getByText(/Lugar del Evento/i)).toBeInTheDocument();
  });

  it("debe mostrar el botón de publicar e invocar la acción de publicación al hacer clic", async () => {
    const { publicarInvitacionAction } = await import("@/app/(admin)/admin/pedidos/[id]/editar/actions");

    render(<EditorClient pedido={mockPedido as any} />);

    const publishBtn = screen.getByRole("button", { name: /^Publicar$/i });
    expect(publishBtn).toBeInTheDocument();

    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(publicarInvitacionAction).toHaveBeenCalledWith("pedido-123");
    });
  });
});
