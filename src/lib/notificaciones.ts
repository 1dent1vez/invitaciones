export function generarTextoNotificacion(
  nombreCliente: string,
  urlPublica: string,
  qrUrl: string,
  tipoEvento?: string,
  fecha?: string,
  hora?: string,
  lugar?: string
): string {
  const cleanNombre = nombreCliente || "cliente";
  const cleanUrl = urlPublica || "";
  const cleanQr = qrUrl || "";

  let emoji = "🎉";
  let tipoText = "invitación";

  if (tipoEvento === "cumpleanos") {
    emoji = "🎉";
    tipoText = "invitación de cumpleaños";
  } else if (tipoEvento === "boda") {
    emoji = "💍";
    tipoText = "invitación de boda";
  } else if (tipoEvento === "xv") {
    emoji = "👑";
    tipoText = "invitación de XV Años";
  } else if (tipoEvento === "babyshower") {
    emoji = "👶";
    tipoText = "invitación de Baby Shower";
  }

  let detallesText = "";
  if (fecha) {
    let dateText = fecha;
    try {
      const d = new Date(fecha);
      if (!isNaN(d.getTime())) {
        dateText = d.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch {
      // fallback
    }
    detallesText += `\n📅 Fecha: ${dateText}`;
  }
  if (hora) detallesText += `\n⏰ Hora: ${hora} hrs`;
  if (lugar) detallesText += `\n📍 Lugar: ${lugar}`;

  return `¡Hola ${cleanNombre}! Tu ${tipoText} está lista ${emoji}${detallesText}\n\nLink: ${cleanUrl}\nQR: ${cleanQr}`;
}
