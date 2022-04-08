import { FriendshipStatusCode } from "../enum/friendshipStatusCode.enum";

export interface FriendshipConditions {
  addressee?: string;
  requester?: string;
  statusCode?: FriendshipStatusCode;
}