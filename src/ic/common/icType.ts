import type { Principal } from '@dfinity/principal';
export type NeuronId = bigint;
export type AccountIdentifier = string;
export type BlockHeight = bigint;
export type E8s = bigint;
export type Memo = bigint;
export type PrincipalString = string;
export type SubAccount = Uint8Array;
export type Option<T> = T | null;
export type CanisterId = Principal;
export type Time = bigint;
export type AccountId = Array<number>;

export type ICL = bigint;
export type TokenId = Principal;
export type TokenSymbol = string;
export type TokenStd =
  | { dft: null }
  | { icp: null }
  | { other: null }
  | { cycles: null }
  | { dip20: null }
  | { drc20: null }
  | { icrc1: null };
export interface TokenInfo {
  name?: string;
  symbol?: string;
  decimals: number;
  fee?: Gas | bigint | string;
  totalSupply?: bigint;
  logo?: string;
  tokenStd?: TokenStd;
}

export type Txid = Array<number>;
export type Decimals = number;
export type TotalSupply = bigint;
export type Gas = { token: bigint } | { cycles: bigint } | { noFee: null };
export interface Metadata {
  content: string;
  name: string;
}
export interface Icrc1Account {
  owner: Principal;
  subaccount: Array<Array<number>>;
}
