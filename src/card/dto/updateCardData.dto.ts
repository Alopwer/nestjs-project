import { IsOptional, IsString } from 'class-validator';

export class UpdateCardDataDto {
  @IsString()
  @IsOptional()
  description?: string;
}
