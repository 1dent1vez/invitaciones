export const getOptimizedImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
  }
  return url;
};

export function getFraseEdad(edad: number): string {
  if (edad <= 12) return `¡Está cumpliendo ${edad} añitos! 🎈`;
  if (edad <= 17) return `¡Ya son ${edad} años! 🎉`;
  if (edad <= 29) return `¡Cumple ${edad} años! 🥳`;
  if (edad <= 49) return `¡${edad} años de grandeza! 🎂`;
  return `¡${edad} años de vida! 🎊`;
}

export function formatFechaMX(fecha: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(fecha);
}

export const parseItinerario = (text?: string) => {
  if (!text) return [];
  const lines = text.includes('\n') ? text.split('\n') : text.split(' — ');
  return lines
    .map((line) => {
      const parts = line.split(/—|-|:/);
      if (parts.length >= 2) {
        const firstPart = parts[0];
        if (firstPart) {
          const possibleHora = firstPart.trim();
          if (/\d+/.test(possibleHora)) {
            const rest = line
              .substring(line.indexOf(firstPart) + firstPart.length)
              .replace(/^[\s—\-\:]+/, '')
              .trim();
            return { hora: possibleHora, event: rest };
          }
        }
      }
      return { hora: '', event: line.trim() };
    })
    .filter((i) => i.event !== '');
};
