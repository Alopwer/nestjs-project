import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  coworkers?: string[];
}
