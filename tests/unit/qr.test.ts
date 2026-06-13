import { describe, it, expect, vi } from 'vitest';
import { generateQRBuffer } from '@/lib/qr';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Mock cloudinary v2 configuration & upload stream
vi.mock('cloudinary', () => {
  return {
    v2: {
      config: vi.fn(),
      uploader: {
        upload_stream: vi.fn((options, callback) => {
          return {
            end: vi.fn(() => {
              callback(null, {
                secure_url:
                  'https://res.cloudinary.com/demo/image/upload/v123456/invitaciones/qr.png',
              });
            }),
          };
        }),
      },
    },
  };
});

describe('QR Code & Cloudinary Unit Tests', () => {
  it('debe generar un Buffer de código QR válido', async () => {
    const url = 'https://example.com/i/test-event';
    const buffer = await generateQRBuffer(url);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('debe subir un buffer a Cloudinary y retornar la URL segura', async () => {
    const mockBuffer = Buffer.from('fake-qr-buffer-data');
    const secureUrl = await uploadToCloudinary(mockBuffer, 'test-folder');
    expect(secureUrl).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v123456/invitaciones/qr.png'
    );
  });
});
