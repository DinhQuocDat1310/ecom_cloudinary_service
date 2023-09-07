import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import streamifier = require('streamifier');
import { CHUNKED_SIZE_6MB_UPLOAD_VIDEO } from './constants/service';
@Injectable()
export class CloudinaryService {
  uploadImage = async (
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    console.log(file);

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  };

  uploadVideo = async (
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    return new Promise((resolve, reject) => {
      const stream = streamifier.createReadStream(file.buffer);
      const uploadStream = v2.uploader.upload_chunked_stream(
        {
          resource_type: 'video',
          chunk_size: CHUNKED_SIZE_6MB_UPLOAD_VIDEO,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      stream.pipe(uploadStream);
    });
  };
}
