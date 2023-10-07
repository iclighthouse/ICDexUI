import {
  TokenId,
  TokenStd,
  TokenSymbol,
  TokenInfo,
  Decimals
} from '@/ic/common/icType';
import { DexName, SwapCanister, SwapPair } from '@/ic/ICSwapRouter/model';
import { Liquidity } from '@/ic/cyclesFinance/model';
import { TokenLiquidity } from '@/ic/ICSwap/model';

export enum SwapMenu {
  // Wrap = 'Wrap',
  Swap = 'Swap',
  Liquidity = 'Liquidity'
}
export type SwapType = keyof typeof SwapMenu;

export enum LiquidityType {
  Add = 'Add',
  Remove = 'Remove',
  Claim = 'Claim'
}

export type SwapTokenInfo = [TokenId, TokenSymbol, TokenStd, TokenInfo];

export type SelectTokenType = 'from' | 'to';
export type CurrentSwapType = 'positive' | 'reverse';

export enum PairTokenStdMenu {
  dip20 = 'dip20',
  drc20 = 'drc20',
  icrc1 = 'icrc1',
  icp = 'icp'
}
export type PairTokenStd = keyof typeof PairTokenStdMenu;

export enum SwappingPairEnum {
  'cyclesfinance',
  'drc20', // All drc20
  'dip20', // Has dip20
  'icrc1',
  'icp'
}

export enum DexNameEnum {
  icswap = 'icswap',
  icdex = 'icdex',
  cyclesfinance = 'cyclesfinance'
}

export type DexNameType = keyof typeof DexNameEnum;

export type Pool = [
  SwapCanister,
  [SwapPair, bigint],
  totalLiquidity,
  UserLiquidity,
  Decimals
];
export type LocalPool = [
  SwapCanisterId,
  [LocalSwapPair, string],
  totalLiquidity,
  UserLiquidity,
  Decimals
];
export type LocalSwapPair = {
  feeRate: string;
  token0: LocalTokenInfo;
  token1: LocalTokenInfo;
  dexName: DexName;
  canisterId: SwapCanisterId;
};
export type LocalTokenInfo = [LocalTokenId, TokenSymbol, TokenStd];
export type SwapCanisterId = string;
export type LocalTokenId = string;
export type totalLiquidity = Liquidity | TokenLiquidity;
export type UserLiquidity = Liquidity | TokenLiquidity;

export interface WrapInfo {
  logo: string;
  name: string;
  symbol: string;
  decimals: number;
  fee: bigint;
}
