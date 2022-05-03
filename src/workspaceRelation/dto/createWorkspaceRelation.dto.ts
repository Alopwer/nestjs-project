import { IsString } from 'class-validator';

export class CreateWorkspaceRelationDto {
  @IsString()
  addresseeId: string;
}
