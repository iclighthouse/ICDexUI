import { TokenSymbol, TokenId } from '@/ic/common/icType';
export interface TokenItem {
  logo: string;
  standard: string;
  symbol: TokenSymbol;
  canisterId: TokenId;
}
export default interface Service {
  getTokenList(): Promise<Array<TokenItem>>;
}
