import { IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  title: string;
}
