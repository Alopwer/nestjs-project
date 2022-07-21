import { IsString } from 'class-validator';

export class UpdateCollectionDto {
  @IsString()
  title: string;
}
