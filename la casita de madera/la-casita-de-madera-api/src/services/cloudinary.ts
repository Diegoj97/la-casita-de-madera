import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const isConfigured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (isConfigured) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
}

const FOLDER = 'la-casita-de-madera';

export async function uploadImage(
  buffer: Buffer,
  originalName: string,
): Promise<string | null> {
  if (!isConfigured) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        public_id: `${Date.now()}_${originalName.replace(/\.[^.]+$/, '')}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      },
    );
    stream.end(buffer);
  });
}

export { isConfigured };
