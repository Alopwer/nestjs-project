import { IsArray, IsOptional, IsString } from 'class-validator';
import { IsFile, StoredFile } from 'nestjs-form-data';

export class CreateWorkspaceDto {
  @IsString()
  title: string;

  @IsArray()
  @IsOptional()
  coworkers?: string[];

  @IsFile()
  @IsOptional()
  imageObject?: StoredFile & { buffer: Buffer };
}
