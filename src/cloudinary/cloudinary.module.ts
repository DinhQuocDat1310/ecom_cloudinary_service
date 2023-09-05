import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { RabbitMQService } from 'src/libs/common/src';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService, RabbitMQService, CloudinaryProvider],
})
export class CloudinaryModule {}
