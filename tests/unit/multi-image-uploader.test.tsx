import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { EditorClient } from "@/app/(admin)/admin/pedidos/[id]/editar/editor-client";

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

vi.mock("@/app/(admin)/admin/pedidos/[id]/editar/actions", () => {
  return {
    savePedidoDatosAction: vi.fn(() => Promise.resolve({ success: true, data: {} })),
    publicarInvitacionAction: vi.fn(() => Promise.resolve({ success: true, data: {} })),
    generarQRAction: vi.fn(() => Promise.resolve({ success: true, data: "" })),
    uploadImageAction: vi.fn(() => Promise.resolve({ success: true, data: "https://cloudinary.com/new-image.jpg" })),
  };
});

describe("MultiImageUploader in EditorClient Tests", () => {
  const mockPedido = {
    id: "pedido-123",
    clienteId: "cliente-123",
    tipoEvento: "cumpleanos",
    paquete: "completa", // limit 3 images
    fechaEvento: new Date("2026-12-18T18:00:00Z"),
    template: "cumpleanos-completa",
    precio: 550.00,
    estado: "cotizado",
    slug: null,
    urlPublica: null,
    qrUrl: null,
    datosInvitacion: {
      nombre: "Juan Festejado",
      edad: 20,
      fecha: "2026-12-18T18:00:00Z",
      fotosGaleria: ["https://example.com/foto1.jpg", "https://example.com/foto2.jpg"],
    },
    cliente: {
      id: "cliente-123",
      nombre: "Juan Cliente",
      fuente: "instagram",
      telefono: null,
      email: null,
      notes: null,
    },
  };

  it("debe mostrar imágenes existentes en la galería y permitir subida y borrado", async () => {
    const { container } = render(<EditorClient pedido={mockPedido as any} />);

    // The form contains the MultiImageUploader component. Let's check text "2 de 3"
    expect(screen.getByText("2 de 3")).toBeInTheDocument();

    // Trigger upload of a file
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const input = container.querySelector('input[type="file"][multiple]') as HTMLInputElement;
    expect(input).not.toBeNull();

    fireEvent.change(input!, { target: { files: [file] } });

    // Wait for the upload action to complete and value to update
    await waitFor(() => {
      expect(screen.getByText("3 de 3")).toBeInTheDocument();
    });

    // Delete one of the images
    const deleteButtons = screen.getAllByRole("button", { name: /Eliminar/i });
    // Click on the first gallery image delete button
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("2 de 3")).toBeInTheDocument();
    });
  });
});
