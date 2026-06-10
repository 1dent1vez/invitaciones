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
});
