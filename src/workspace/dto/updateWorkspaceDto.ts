import { IsString } from 'class-validator';

export class UpdateWorkspaceDto {
  @IsString()
  title: string;
}
