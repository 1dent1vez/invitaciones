import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Invitaciones Digitales Premium",
    short_name: "Invitaciones",
    description: "Crea y personaliza hermosas invitaciones digitales para tus eventos sociales.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#8b5cf6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
