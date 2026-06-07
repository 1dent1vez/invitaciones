"use server";

import { cookies } from "next/headers";
import { getSessionHash } from "@/lib/auth";

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function loginAction(password: string): Promise<ActionResult<void>> {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD || "admin_super_secret";

    if (password !== adminPassword) {
      return { success: false, error: "Contraseña incorrecta" };
    }

    const hash = await getSessionHash();
    const cookieStore = cookies();
    cookieStore.set("admin_session", hash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("[loginAction]", error);
    return { success: false, error: "Error al iniciar sesión" };
  }
}

export async function logoutAction(): Promise<ActionResult<void>> {
  try {
    const cookieStore = cookies();
    cookieStore.set("admin_session", "", {
      maxAge: 0,
      path: "/",
    });
    return { success: true };
  } catch (error) {
    console.error("[logoutAction]", error);
    return { success: false, error: "Error al cerrar sesión" };
  }
}
