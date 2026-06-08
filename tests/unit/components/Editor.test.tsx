import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditorClient } from "@/app/(admin)/admin/pedidos/[id]/editar/editor-client";
import { describe, it, expect, vi, beforeEach } from "vitest";

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
    tipoEvento: "cumpleanos",
    paquete: "esencial",
    fechaEvento: new Date("2026-12-18T18:00:00Z"),
    template: "cumpleanos-esencial",
    precio: 350.00,
    estado: "cotizado",
    slug: null,
    urlPublica: null,
    qrUrl: null,
    datosInvitacion: null,
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar el formulario dinámico con los campos del template", () => {
    render(<EditorClient pedido={mockPedido as any} />);

    // should render the title/header
    expect(screen.getByText("Editar Invitación")).toBeInTheDocument();
    expect(screen.getByText("Cumpleaños Esencial")).toBeInTheDocument();

    // cumpleanos-esencial template fields
    expect(screen.getByText(/Nombre del festejado/i)).toBeInTheDocument();
    expect(screen.getByText(/Fecha del cumpleaños/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre del lugar/i)).toBeInTheDocument();
  });

  it("debe actualizar el preview instantáneamente al escribir en un campo", async () => {
    const { container } = render(<EditorClient pedido={mockPedido as any} />);

    const nombresInput = container.querySelector('input[name="nombre"]') as HTMLInputElement;
    expect(nombresInput).not.toBeNull();
    console.log("DIAGNOSTIC - nombresInput value:", nombresInput.value);
    
    // Change input value
    fireEvent.change(nombresInput, { target: { value: "Santiago" } });

    // Check if the preview reflects the change instantly
    expect(screen.getByText("Santiago")).toBeInTheDocument();
  });

  it("debe cambiar el color en el preview al seleccionar un color en el picker", async () => {
    const { container } = render(<EditorClient pedido={mockPedido as any} />);

    // Default primary color is #F59E0B for cumpleanos-esencial
    const wrapper = container.querySelector('[style*="--primary"]');
    expect(wrapper).not.toBeNull();
    let styleAttr = wrapper?.getAttribute("style") || "";
    expect(styleAttr).toContain("--primary: #F59E0B");

    // Get color principal text input (associated with default color value)
    const colorInput = container.querySelector('input[name="colorPrimario"]') as HTMLInputElement;
    expect(colorInput).not.toBeNull();
    
    // Change color input value to #ff0000
    fireEvent.change(colorInput, { target: { value: "#ff0000" } });

    // Check if the wrapper style was updated
    await waitFor(() => {
      const updatedStyle = wrapper?.getAttribute("style") || "";
      expect(updatedStyle).toContain("--primary: #ff0000");
    });
  });

  it("debe guardar como borrador exitosamente aun con campos vacios", async () => {
    const { savePedidoDatosAction } = await import("@/app/(admin)/admin/pedidos/[id]/editar/actions");
    const { container } = render(<EditorClient pedido={mockPedido as any} />);

    const nombresInput = container.querySelector('input[name="nombre"]') as HTMLInputElement;
    expect(nombresInput).not.toBeNull();
    fireEvent.change(nombresInput, { target: { value: "" } });

    // Submit the form directly
    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    // Log the page content or form state to see if there are validation errors
    const errorElements = container.querySelectorAll(".text-rose-500");
    if (errorElements.length > 0) {
      console.log("VALIDATION ERRORS FOUND IN TEST:");
      errorElements.forEach(el => console.log("-", el.textContent));
    }

    await waitFor(() => {
      expect(savePedidoDatosAction).toHaveBeenCalled();
    });
  });

  it("debe fallar al publicar y mostrar errores si hay campos requeridos vacios", async () => {
    const { publicarInvitacionAction } = await import("@/app/(admin)/admin/pedidos/[id]/editar/actions");
    const { container } = render(<EditorClient pedido={mockPedido as any} />);

    const nombresInput = container.querySelector('input[name="nombre"]') as HTMLInputElement;
    expect(nombresInput).not.toBeNull();
    fireEvent.change(nombresInput, { target: { value: "" } });

    // Click "Publicar"
    const publishBtn = screen.getByRole("button", { name: /^Publicar$/i });
    fireEvent.click(publishBtn);

    // Assert that validation error is displayed
    await waitFor(() => {
      expect(screen.getByText(/El campo "Nombre del festejado" es requerido/i)).toBeInTheDocument();
    });

    // Assert that publicarInvitacionAction was not called
    expect(publicarInvitacionAction).not.toHaveBeenCalled();
  });

});
