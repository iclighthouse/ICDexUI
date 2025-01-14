import { TokenInfo } from '@/ic/common/icType';
export const getFee = (token: TokenInfo): bigint | string => {
  if (token) {
    if (typeof token.fee === 'bigint' || typeof token.fee === 'string') {
      return token.fee;
    } else if ((token.fee as { token: bigint }).token.toString()) {
      return (token.fee as { token: bigint }).token;
    }
  }
  return BigInt(0);
};
