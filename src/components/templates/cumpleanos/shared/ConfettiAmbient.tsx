'use client';

import React from 'react';

export function triggerConfetti() {
  if (typeof window === 'undefined') return () => {
    // noop
  };

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {
    // noop
  };

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const resizeHandler = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeHandler);

  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#aa77ff', '#ff77ff'];
  const particles: {
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
  }[] = [];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * -height - 20,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#FF6B6B',
      speedX: Math.random() * 3 - 1.5,
      speedY: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 3 - 1.5,
    });
  }

  let animationFrameId: number;
  function update() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    let alive = false;

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y < height) {
        alive = true;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (alive) {
      animationFrameId = requestAnimationFrame(update);
    } else {
      if (canvas.parentNode) {
        document.body.removeChild(canvas);
      }
      window.removeEventListener('resize', resizeHandler);
    }
  }

  update();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeHandler);
    if (canvas.parentNode) {
      document.body.removeChild(canvas);
    }
  };
}

interface ConfettiAmbientProps {
  className?: string;
}

export function ConfettiAmbient({ className }: ConfettiAmbientProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none opacity-40 z-0 ${className ?? ''}`}>
      <div className="absolute top-12 left-10 h-3 w-3 rounded-full bg-yellow-400 animate-ping" />
      <div className="absolute top-24 left-1/4 h-2 w-4 bg-violet-500 rotate-45 animate-bounce" />
      <div className="absolute top-48 right-16 h-3 w-1.5 bg-pink-500 -rotate-12 animate-pulse" />
      <div className="absolute top-96 left-12 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
      <div className="absolute top-[500px] right-24 h-2 w-5 bg-amber-500 rotate-12" />
      <div className="absolute bottom-64 left-20 h-3 w-3 bg-red-400 rounded-full animate-bounce" />
      <div className="absolute bottom-24 right-10 h-2 w-2 bg-indigo-500 animate-pulse" />
    </div>
  );
}
