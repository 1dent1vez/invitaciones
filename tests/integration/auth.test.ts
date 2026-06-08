import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { loginAction } from "@/app/(admin)/login/actions";
import LoginPage from "@/app/(admin)/login/page";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

const mockCookieSet = vi.fn();
const mockCookieGet = vi.fn();
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/headers", () => {
  return {
    cookies: () => ({
      set: mockCookieSet,
      get: mockCookieGet,
    }),
  };
});

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: mockPush,
      refresh: mockRefresh,
    }),
  };
});

describe("Autenticación y Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_PASSWORD = "test_admin_password";
  });

  describe("loginAction", () => {
    it("inicia sesión exitosamente con contraseña correcta", async () => {
      const result = await loginAction("test_admin_password");
      
      expect(result.success).toBe(true);
      expect(mockCookieSet).toHaveBeenCalledWith(
        "admin_session",
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          path: "/",
        })
      );
    });

    it("falla al iniciar sesión con contraseña incorrecta", async () => {
      const result = await loginAction("wrong_password");
      
      expect(result.success).toBe(false);
      expect(result.error).toBe("Contraseña incorrecta");
      expect(mockCookieSet).not.toHaveBeenCalled();
    });
  });

  describe("middleware", () => {
    it("redirige a /login (307) cuando no hay cookie de sesión", async () => {
      const req = new NextRequest("http://localhost:3000/admin");
      const res = await middleware(req);
      
      expect(res).toBeDefined();
      expect(res?.status).toBe(307);
      expect(res?.headers.get("location")).toBe("http://localhost:3000/login");
    });

    it("permite el paso cuando la cookie es válida", async () => {
      const { getSessionHash } = await import("@/lib/auth");
      const validHash = await getSessionHash();

      const req = new NextRequest("http://localhost:3000/admin");
      req.cookies.set("admin_session", validHash);

      const res = await middleware(req);
      
      expect(res).toBeDefined();
      expect(res?.status).not.toBe(307);
    });
  });

  describe("LoginPage Component", () => {
    it("permite iniciar sesión con contraseña correcta y redirige a /admin", async () => {
      render(React.createElement(LoginPage));

      const input = screen.getByPlaceholderText("••••••••");
      const button = screen.getByRole("button", { name: /Entrar al Panel/i });

      fireEvent.change(input, { target: { value: "test_admin_password" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/admin");
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("muestra mensaje de error cuando la contraseña es incorrecta", async () => {
      render(React.createElement(LoginPage));

      const input = screen.getByPlaceholderText("••••••••");
      const button = screen.getByRole("button", { name: /Entrar al Panel/i });

      fireEvent.change(input, { target: { value: "wrong_password" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Contraseña incorrecta")).toBeInTheDocument();
      });
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
