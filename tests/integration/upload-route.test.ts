import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as uploadPOST } from '@/app/api/upload/route';

// Mock Cloudinary to avoid network calls
vi.mock('@/lib/cloudinary', () => ({
  uploadToCloudinary: vi.fn().mockResolvedValue('https://res.cloudinary.com/demo/image/upload/mocked-image.jpg'),
}));

describe('API Route POST /api/upload', () => {
  it('debe retornar 400 si falta el archivo', async () => {
    const req = {
      formData: async () => {
        return {
          get: (name: string) => null,
        } as any;
      },
    } as unknown as NextRequest;

    const res = await uploadPOST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('No se proporcionó ningún archivo');
  });

  it('debe retornar 400 si el archivo no es una imagen', async () => {
    const mockFile = new File(['text'], 'test.txt', { type: 'text/plain' });
    const req = {
      formData: async () => {
        return {
          get: (name: string) => (name === 'file' ? mockFile : null),
        } as any;
      },
    } as unknown as NextRequest;

    const res = await uploadPOST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('imagen válida');
  });

  it('debe retornar 400 si el archivo excede los 5MB', async () => {
    // We mock the file size using Object.defineProperty because new File doesn't allocate 6MB easily in JS heap during tests
    const mockFile = new File([''], 'large.png', { type: 'image/png' });
    Object.defineProperty(mockFile, 'size', { value: 6 * 1024 * 1024 });

    const req = {
      formData: async () => {
        return {
          get: (name: string) => (name === 'file' ? mockFile : null),
        } as any;
      },
    } as unknown as NextRequest;

    const res = await uploadPOST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('5MB');
  });

  it('debe retornar 200 y la url si el archivo es válido', async () => {
    const mockFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: 1 * 1024 * 1024 });
    Object.defineProperty(mockFile, 'arrayBuffer', {
      value: async () => new ArrayBuffer(8),
      writable: true,
    });

    const req = {
      formData: async () => {
        return {
          get: (name: string) => (name === 'file' ? mockFile : null),
        } as any;
      },
    } as unknown as NextRequest;

    const res = await uploadPOST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBe('https://res.cloudinary.com/demo/image/upload/mocked-image.jpg');
  });
});
