import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { PublicRSVPForm } from "@/app/(public)/i/[slug]/rsvp-form";

// Mock the server action
vi.mock("@/app/(public)/i/[slug]/actions", () => ({
  createRSVPAction: vi.fn(() => Promise.resolve({ success: true })),
}));

describe("PublicRSVPForm Pax Validation Test", () => {
  it("muestra error de validación cuando pax es mayor a 10", async () => {
    const { container } = render(<PublicRSVPForm slug="sofia-esencial" />);

    // Open modal
    const openBtn = screen.getByRole("button", { name: /Confirmar Lugar/i });
    fireEvent.click(openBtn);

    // Fill name (using placeholder)
    const nombreInput = screen.getByPlaceholderText(/Ej. Juan Pérez/i);
    fireEvent.change(nombreInput, { target: { value: "Invitado E2E" } });

    // Fill pax with 15 (using selector)
    const paxInput = container.querySelector('input[name="pax"]');
    if (!paxInput) throw new Error("pax input not found");
    fireEvent.change(paxInput, { target: { value: "15" } });

    // Click confirm/submit
    const submitBtn = screen.getByRole("button", { name: "Confirmar" });
    fireEvent.click(submitBtn);

    // Verify validation error is shown
    await waitFor(() => {
      expect(
        screen.getByText("El límite máximo de acompañantes es 10")
      ).toBeInTheDocument();
    });
  });

  it("rechaza mensaje de 250 caracteres", async () => {
    render(<PublicRSVPForm slug="sofia-esencial" />);

    // Open modal
    const openBtn = screen.getByRole("button", { name: /Confirmar Lugar/i });
    fireEvent.click(openBtn);

    // Fill name
    const nombreInput = screen.getByPlaceholderText(/Ej. Juan Pérez/i);
    fireEvent.change(nombreInput, { target: { value: "Invitado E2E" } });

    // Fill message with 250 characters
    const mensajeInput = screen.getByPlaceholderText(/¡Muchas felicidades! Nos vemos ahí./i);
    const longMessage = "a".repeat(250);
    fireEvent.change(mensajeInput, { target: { value: longMessage } });

    // Click confirm/submit
    const submitBtn = screen.getByRole("button", { name: "Confirmar" });
    fireEvent.click(submitBtn);

    // Verify validation error is shown
    await waitFor(() => {
      expect(
        screen.getByText("El mensaje no debe superar los 200 caracteres")
      ).toBeInTheDocument();
    });
  });

  it("vincula todos los labels con sus respectivos inputs usando htmlFor e id", async () => {
    render(<PublicRSVPForm slug="sofia-esencial" />);

    // Open modal
    const openBtn = screen.getByRole("button", { name: /Confirmar Lugar/i });
    fireEvent.click(openBtn);

    // Get input and label associations
    const nombreInput = screen.getByLabelText(/Nombre Completo/i);
    expect(nombreInput).toHaveAttribute("id", "rsvp-nombre");

    const asisteInput = screen.getByLabelText(/¿Asistirás al evento\?/i);
    expect(asisteInput).toHaveAttribute("id", "rsvp-asiste");

    const paxInput = screen.getByLabelText(/Cantidad de Lugares/i);
    expect(paxInput).toHaveAttribute("id", "rsvp-pax");

    const mensajeInput = screen.getByLabelText(/Mensaje para los novios/i);
    expect(mensajeInput).toHaveAttribute("id", "rsvp-mensaje");
  });
});

