import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder = 'invitaciones'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          let url = result.secure_url;
          if (url.includes('/upload/')) {
            url = url.replace('/upload/', '/upload/f_auto,q_auto/');
          }
          resolve(url);
        } else {
          reject(new Error('Upload failed with no result'));
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
}
