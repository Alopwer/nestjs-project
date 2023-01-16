import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { PublicFile } from './publicFile.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(PublicFile)
    private readonly publicFileRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    let newFile: PublicFile = null;
    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Body: dataBuffer,
          Key: `${randomUUID()}-${filename}`,
        })
        .promise();

      newFile = this.publicFileRepository.create({
        key: uploadResult.Key,
        url: uploadResult.Location,
      });
      await this.publicFileRepository.save(newFile);
    } catch (e) {
      throw new Error(e);
    }
    return newFile;
  }
}
