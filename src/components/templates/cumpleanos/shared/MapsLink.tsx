import React from 'react';
import { MapPin } from 'lucide-react';

interface MapsLinkProps {
  direccion?: string;
  coordenadas?: { lat: number; lng: number };
  mapaUrl?: string;
}

export function MapsLink({ direccion, coordenadas, mapaUrl }: MapsLinkProps) {
  if (coordenadas) {
    return (
      <iframe
        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${coordenadas.lng}!3d${coordenadas.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2smx!4v1`}
        className="w-full h-64 rounded-xl border-0"
        loading="lazy"
      />
    );
  }
  const href =
    mapaUrl ??
    (direccion
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`
      : '');
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 text-[var(--primary)] hover:underline p-6 text-sm font-semibold w-full bg-white transition-all"
    >
      <MapPin className="w-5 h-5 animate-bounce" />
      Ver en Google Maps
    </a>
  );
}

export default MapsLink;
