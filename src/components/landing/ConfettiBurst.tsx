"use client";

import confetti from "canvas-confetti";

/**
 * Disparador de confeti premium con los colores oficiales de ¡Ábreme!:
 * Rosa Regalo (#E8B4B8), Dorado Cálido (#D4A373), Terracota (#C85C5C), Crema Seda (#F9F5F0)
 */
export const fireConfetti = () => {
  // Respetar la preferencia de reducción de movimiento del sistema
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const colors = ["#E8B4B8", "#D4A373", "#C85C5C", "#F9F5F0"];

  // Burst 1: Izquierda
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.8 },
    colors: colors,
  });

  // Burst 2: Derecha
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.8 },
    colors: colors,
  });

  // Burst 3: Centro
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { x: 0.5, y: 0.6 },
      colors: colors,
    });
  }, 150);

  // Burst 4: Lluvia sutil después
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 90,
      spread: 100,
      origin: { x: 0.5, y: 0.3 },
      colors: colors,
      drift: 0.5,
      ticks: 200,
    });
  }, 300);
};

export default function ConfettiBurst() {
  return null;
}
