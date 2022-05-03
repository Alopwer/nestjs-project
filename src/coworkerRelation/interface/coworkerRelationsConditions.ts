import { RelationsStatusCode } from "src/shared/relation/enum/relationsStatusCode.enum";

export interface CowokerRelationsConditions {
  addressee?: string;
  requester?: string;
  status_code?: RelationsStatusCode;
}