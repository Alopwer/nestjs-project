import { IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
