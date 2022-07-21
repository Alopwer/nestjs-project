import { IsOptional, IsString } from 'class-validator';

export class UpdateCollectionDataDto {
  @IsString()
  @IsOptional()
  description?: string;
}
