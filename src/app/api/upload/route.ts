import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "El archivo debe ser una imagen válida" },
        { status: 400 }
      );
    }

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { success: false, error: "El archivo excede el tamaño máximo permitido (5MB)" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const url = await uploadToCloudinary(buffer, "invitaciones/fotos");

    return NextResponse.json({ success: true, data: url });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json(
      { success: false, error: "Error al subir la imagen" },
      { status: 500 }
    );
  }
}
