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

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("debe actualizar el preview instantáneamente al escribir en un campo", async () => {
    const { container } = render(<EditorClient pedido={mockPedido as any} />);

    const nombresInput = container.querySelector('input[name="nombres"]') as HTMLInputElement;
    expect(nombresInput).not.toBeNull();
    console.log("DIAGNOSTIC - nombresInput value:", nombresInput.value);
    
    // Change input value
    fireEvent.change(nombresInput, { target: { value: "Juan & Maria" } });

    // Check if the preview reflects the change instantly
    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  it("debe cambiar el color en el preview al seleccionar un color en el picker", async () => {
    const { container } = render(<EditorClient pedido={mockPedido as any} />);

    // Default primary color is #C5A880 for boda-elegante
    const wrapper = container.querySelector('[style*="--primary"]');
    expect(wrapper).not.toBeNull();
    let styleAttr = wrapper?.getAttribute("style") || "";
    expect(styleAttr).toContain("--primary: #C5A880");

    // Get color principal text input (associated with default color value)
    const colorInput = container.querySelector('input[name="colorPrincipal"]') as HTMLInputElement;
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

    const nombresInput = container.querySelector('input[name="nombres"]') as HTMLInputElement;
    expect(nombresInput).not.toBeNull();
    fireEvent.change(nombresInput, { target: { value: "" } });

    // Click "Guardar borrador"
    const saveBtn = screen.getByRole("button", { name: /Guardar borrador/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(savePedidoDatosAction).toHaveBeenCalled();
    });
  });

  it("debe fallar al publicar y mostrar errores si hay campos requeridos vacios", async () => {
    const { publicarInvitacionAction } = await import("@/app/(admin)/admin/pedidos/[id]/editar/actions");
    const { container } = render(<EditorClient pedido={mockPedido as any} />);

    const nombresInput = container.querySelector('input[name="nombres"]') as HTMLInputElement;
    expect(nombresInput).not.toBeNull();
    fireEvent.change(nombresInput, { target: { value: "" } });

    // Click "Publicar"
    const publishBtn = screen.getByRole("button", { name: /^Publicar$/i });
    fireEvent.click(publishBtn);

    // Assert that validation error is displayed
    await waitFor(() => {
      expect(screen.getByText("El nombre del evento debe tener al menos 2 caracteres")).toBeInTheDocument();
    });

    // Assert that publicarInvitacionAction was not called
    expect(publicarInvitacionAction).not.toHaveBeenCalled();
  });

});
