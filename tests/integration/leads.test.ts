import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { createLeadAction } from '@/app/(public)/actions';

describe('Leads Integration Tests', () => {
  beforeEach(async () => {
    // Clear leads table before each test
    await prisma.lead.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('debe crear un lead de forma exitosa con todos los campos', async () => {
    const res = await createLeadAction({
      nombre: 'Roberto Sánchez',
      evento: 'cumpleanos',
      fecha: '2026-09-12',
      telefono: '5566778899',
      mensaje: 'Me interesa el paquete Premium para mi cumpleaños en Cuernavaca.',
    });

    expect(res.success).toBe(true);

    const leads = await prisma.lead.findMany();
    expect(leads.length).toBe(1);
    expect(leads[0].nombre).toBe('Roberto Sánchez');
    expect(leads[0].evento).toBe('cumpleanos');
    expect(leads[0].telefono).toBe('5566778899');
    expect(leads[0].mensaje).toBe(
      'Me interesa el paquete Premium para mi cumpleaños en Cuernavaca.'
    );
    expect(leads[0].fecha).not.toBeNull();
  });

  it('debe crear un lead exitosamente con campos opcionales vacíos', async () => {
    const res = await createLeadAction({
      nombre: 'Gabriela Montes',
      evento: '',
      fecha: '',
      telefono: '',
      mensaje: 'Quisiera cotizar una invitación personalizada.',
    });

    expect(res.success).toBe(true);

    const leads = await prisma.lead.findMany();
    expect(leads.length).toBe(1);
    expect(leads[0].nombre).toBe('Gabriela Montes');
    expect(leads[0].evento).toBeNull();
    expect(leads[0].fecha).toBeNull();
    expect(leads[0].telefono).toBeNull();
  });

  it('debe rechazar nombres de menos de 2 caracteres', async () => {
    const res = await createLeadAction({
      nombre: 'R',
      evento: 'cumpleanos',
      fecha: '',
      telefono: '',
      mensaje: 'Hola me interesa cotizar un cumpleaños',
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain('nombre');
  });

  it('debe rechazar mensajes de menos de 5 caracteres', async () => {
    const res = await createLeadAction({
      nombre: 'Carlos Slim',
      evento: 'cumpleanos',
      fecha: '',
      telefono: '',
      mensaje: 'X',
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain('mensaje');
  });
});
