import { Principal } from '@dfinity/principal';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { Operation, TokenItem } from '@/ic/ICLighthouse/model';
const iCLighthouseService = new ICLighthouseService();
export const addToken = async (
  tokenId: Principal,
  symbol: string,
  name: string,
  decimals: number,
  standard: string,
  operation: Operation
): Promise<boolean> => {
  return await iCLighthouseService.addToken(
    tokenId,
    symbol,
    name,
    decimals,
    standard,
    operation
  );
};
export const addedTokens = async (): Promise<Array<TokenItem>> => {
  return await iCLighthouseService.getTokens();
};
