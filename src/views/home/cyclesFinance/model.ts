export enum ExchangeEnum {
  Swap = 'Swap',
  Liquidity = 'Liquidity'
}
export type ExchangeType = keyof typeof ExchangeEnum;

export enum SwapTypeEnum {
  icpToCycles = 'icpToCycles',
  cyclesToIcp = 'cyclesToIcp'
}

export type SwapType = keyof typeof SwapTypeEnum;

export enum LiquidityType {
  Add = 'Add',
  Remove = 'Remove',
  Claim= 'Claim'
}
