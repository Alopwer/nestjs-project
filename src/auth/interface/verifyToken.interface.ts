import { TokenType } from '../enum/tokenType.enum';

export interface VerifyToken {
  token: string;
  tokenType: TokenType;
}
