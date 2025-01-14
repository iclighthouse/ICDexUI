import { Principal } from '@dfinity/principal';
import { PrincipalString } from '@/ic/common/icType';
export interface InitArgs {
  fee: bigint;
  decimals: number;
  metadata: Array<Array<Metadata>>;
  name: Array<string>;
  totalSupply: BigInt;
  founder: Array<string>;
  symbol: Array<string>;
}
export type Gas = { token: bigint } | { cycles: bigint } | { noFee: null };
export enum GasMenu {
  token = 'token',
  cycles = 'cycles',
  noFee = 'noFee'
}
export type GasType = keyof typeof GasMenu;
export interface Metadata {
  content: string;
  name: string;
}
export type Score = bigint;
export type Star = bigint;
export type Time = bigint;
export type TokenItem = [Principal, ICToken, Score, Star, Time];
export type TokenList = [
  Principal,
  ICToken,
  Score,
  Star,
  Time,
  TotalSupply,
  TokenItemGas,
  Array<Metadata>,
  TokenLogo,
  MaxSupply,
  Controllers,
  string
];
export type Controllers = Array<string>;
export type TokenLogo = string;
export type TokenItemGas =
  | { token: string }
  | { cycles: string }
  | { noFee: null };
export type TotalSupply = bigint;
export type MaxSupply = bigint;
export interface ICToken {
  decimals: number;
  moduleHash: Array<Array<number>>;
  name: string;
  note: string;
  symbol: string;
}
export type Status = { stopped: null } | { stopping: null } | { running: null };
export interface TokenStatus {
  status: Status;
  memory_size: bigint;
  cycles: bigint;
  settings: {
    freezing_threshold: bigint;
    controllers: Array<Principal>;
    memory_allocation: bigint;
    compute_allocation: bigint;
  };
  module_hash: Array<Array<number>>;
  canisterId?: string;
}
export class Token {
  public name = '';
  public symbol = '';
  public logo = '';
  public totalSupply: bigint = null;
  public decimals = 0;
  public gas: Gas = { noFee: null };
  public tokenId: Principal = null;
  public tokenStatus: TokenStatus | {} = { settings: {} };
  public controllers: Array<PrincipalString> = [];
  public isController = false;
  public isICTokenController = false;
  public metadata: Array<Metadata> = [];
  public owner: PrincipalString = null;
  public maxSupply: bigint = null;
}
export default interface Service {
  create(request: InitArgs, subaccount: Array<Array<number>>): Promise<[Principal]>;
  getTokenList(size: number, page: number): Promise<Array<TokenItem>>;
  getTokens(tokenId: Principal): Promise<Array<Principal>>;
  tokenStatus(tokenId: Principal): Promise<TokenStatus>;
  modifyControllers(
    token: Principal,
    controllers: Array<Principal>
  ): Promise<boolean>;
  getStarTokens(user: Principal, subaccount: Array<Array<number>>): Promise<Array<Array<Principal>>>;
  cancelStar(tokenId: Principal, subaccount: Array<Array<number>>): Promise<boolean>;
  modifyOwner(tokenId: Principal, newOwner: Principal): Promise<boolean>;
  deleteToken(tokenId: Principal, delFromList: boolean): Promise<boolean>;
  update(tokenId: Principal, initArgs: InitArgs): Promise<void>;
  starIt(tokenId: Principal, subaccount: Array<Array<number>>): Promise<void>;
}
