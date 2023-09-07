import {
  Controller,
  UseInterceptors,
  Post,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CHUNKED_SIZE_MAX_UPLOAD_VIDEO } from './constants/service';

@Controller('cloudinary')
@ApiTags('Cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload file' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiCreatedResponse({
    description:
      'url: http://res.cloudinary.com/exampleId/image/upload/v.example/exampleId.type',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload/image')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Please provide image file');
    const image = await this.cloudinaryService.uploadImage(file);
    return image.url;
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload video' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiCreatedResponse({
    description:
      'url: http://res.cloudinary.com/exampleId/image/upload/v.example/exampleId.type',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload/video')
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Please provide video file');
    if (file.size > CHUNKED_SIZE_MAX_UPLOAD_VIDEO)
      throw new BadRequestException('Your video must less than 100MB');
    const video = await this.cloudinaryService.uploadVideo(file);
    return video.url;
  }
}
