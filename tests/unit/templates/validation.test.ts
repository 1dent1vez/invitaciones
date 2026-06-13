import { describe, it, expect } from 'vitest';
import { getTemplateConfig, validateTemplateData } from '@/lib/templates';
import { InvitacionData } from '@/types';

describe('validateTemplateData', () => {
  it('pasa la validación si se envían todos los campos obligatorios para cumpleanos-esencial', () => {
    const config = getTemplateConfig('cumpleanos-esencial');
    const data: Partial<InvitacionData> = {
      nombre: 'Santiago',
      edad: 30,
      fecha: '2026-10-24T18:00:00Z',
      hora: '18:00',
      lugar: 'Terraza La Vista',
      direccion: 'Av. Insurgentes 123',
      tipoCelebracion: 'Adultos',
      fotoPortada: 'https://example.com/foto.jpg',
      musica: 'Fiesta',
      whatsapp: '5512345678',
    };
    const result = validateTemplateData(config, data);
    expect(result.success).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('falla la validación si faltan campos requeridos en cumpleanos-esencial', () => {
    const config = getTemplateConfig('cumpleanos-esencial');
    const data: Partial<InvitacionData> = {
      nombre: 'Santiago',
      edad: 30,
      // fecha, hora, lugar, direccion, tipoCelebracion, fotoPortada, musica, whatsapp faltantes
    };
    const result = validateTemplateData(config, data);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(7);
  });

  it('falla la validación si falta el nombre en cumpleanos-esencial', () => {
    const config = getTemplateConfig('cumpleanos-esencial');
    const data: Partial<InvitacionData> = {
      edad: 30,
      fecha: '2026-08-08T16:00:00Z',
      hora: '16:00',
      lugar: 'Jardín Los Tulipanes',
      direccion: 'Calle Roble 45',
      tipoCelebracion: 'Adultos',
      fotoPortada: 'https://example.com/foto.jpg',
      musica: 'Fiesta',
      whatsapp: '5512345678',
      // nombre faltante
    };
    const result = validateTemplateData(config, data);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain('festejado');
  });
});
