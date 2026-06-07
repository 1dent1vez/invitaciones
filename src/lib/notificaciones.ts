export function generarTextoNotificacion(
  nombreCliente: string,
  urlPublica: string,
  qrUrl: string
): string {
  const cleanNombre = nombreCliente || "cliente";
  const cleanUrl = urlPublica || "";
  const cleanQr = qrUrl || "";

  return `¡Hola ${cleanNombre}! Tu invitación está lista 🎉\nLink: ${cleanUrl}\nQR: ${cleanQr}`;
}
