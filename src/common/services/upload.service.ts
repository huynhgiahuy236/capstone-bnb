import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private hasCloudinary = false;

  constructor() {
    if (process.env.CLOUDINARY_URL) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME || 'syq6ytly',
        api_key: process.env.CLOUDINARY_API_KEY || '187335816716459',
        api_secret:
          process.env.CLOUDINARY_API_SECRET ||
          'y0lEoUgwB72mWX6Sj8qnRGeHCL4',
        secure: true,
      });
      this.hasCloudinary = true;
      this.logger.log('☁️ [CLOUDINARY] Cấu hình Cloudinary sẵn sàng!');
    }
  }

  /**
   * Upload file lên Cloudinary hoặc lưu local
   */
  async uploadImage(
    file: Express.Multer.File,
    folder = 'airbnb',
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file hình ảnh!');
    }

    // Nếu cấu hình Cloudinary sẵn sàng, ưu tiên upload lên Cloudinary
    if (this.hasCloudinary) {
      try {
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: `capstone_airbnb/${folder}` },
            (error, result) => {
              if (error) return reject(error);
              resolve(result!);
            },
          );
          stream.end(file.buffer);
        });

        return result.secure_url;
      } catch (err: any) {
        this.logger.warn(`Cloudinary upload failed: ${err.message}. Fallback sang Local Storage.`);
      }
    }

    // Fallback sang Local Storage
    const uploadDir = path.join(process.cwd(), 'public', 'images', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${folder}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, file.buffer);
    return `/public/images/${folder}/${filename}`;
  }
}

