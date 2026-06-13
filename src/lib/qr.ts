import QRCode from 'qrcode';

export async function generateQRBuffer(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    type: 'png',
    width: 300,
    margin: 2,
    color: {
      dark: '#0b0f19',
      light: '#ffffff',
    },
  });
}
