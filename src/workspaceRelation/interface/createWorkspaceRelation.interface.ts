import { RelationsStatusCode } from "src/shared/relation/enum/relationsStatusCode.enum";

export interface ICreateWorkspaceRelation {
  requesterId: string;
  addresseeId: string;
  workspaceId: string;
  statusCode?: RelationsStatusCode;
}
