import { Principal } from '@dfinity/principal';
import { TokenIdentifier } from '@/ic/nft/model';
import { AccountId, Time } from '@/ic/common/icType';

export type NFT = [User, TokenIdentifier, BigInt, NFTType];
export type User = { principal: Principal; address: string };
export type NFTType =
  | { MARS: null }
  | {
      JUPITER: null;
    }
  | {
      URANUS: null;
    }
  | {
      UNKNOWN: null;
    }
  | {
      MERCURY: null;
    }
  | {
      NEPTUNE: null;
    }
  | {
      VENUS: null;
    }
  | {
      SATURN: null;
    }
  | {
      EARTH: null;
    };
export interface MakerCreateArg {
  creator: Array<AccountId>;
  spreadRate: bigint;
  allow:
    | {
        Private: null;
      }
    | {
        Public: null;
      };
  lowerLimit: bigint;
  threshold: bigint;
  upperLimit: bigint;
  name: string;
  pair: Principal;
  volFactor: bigint;
}
export interface TrieList {
  total: bigint;
  totalPage: bigint;
  data: Array<[Principal, Array<[Principal, AccountId]>]>;
}
export interface SysConfig {
  blackhole: Principal;
  creatingPairFee: bigint;
  aggregator: Principal;
  sysTokenFee: bigint;
  icDao: Principal;
  nftPlanetCards: Principal;
  creatingMakerFee: bigint;
  sysToken: Principal;
}

export default interface Service {
  NFTDeposit(
    principal: Principal,
    tokenIdentifier: string,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  NFTBindMaker(
    tokenIdentifier: string,
    principal: Principal,
    accountId: Array<number>,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  NFTBalance(address: string): Promise<Array<NFT>>;
  maker_create(makerCreateArg: MakerCreateArg): Promise<Principal>;
  NFTWithdraw(
    tokenIdentifier: Array<TokenIdentifier>,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  NFTBindingMakers(
    tokenIdentifier: TokenIdentifier
  ): Promise<Array<[Principal, AccountId]>>;
  NFTUnbindMaker(
    tokenIdentifier: TokenIdentifier,
    principal: Principal,
    accountId: Array<number>,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  maker_getPublicMakers(
    pair: Array<Principal>,
    page: Array<bigint>,
    size: Array<bigint>
  ): Promise<TrieList>;
  maker_getPrivateMakers(
    AccountId: Array<number>,
    page: Array<bigint>,
    size: Array<bigint>
  ): Promise<TrieList>;
  sys_getConfig(): Promise<SysConfig>;
  pubCreate(
    token0: Principal,
    token1: Principal,
    time: Time
  ): Promise<Principal>;
  version(): Promise<string>;
  getICDexPairWasmVersion(): Promise<[string, bigint]>;
  getICDexMakerWasmVersion(): Promise<[string, bigint]>;
  getVipMakers(account: Array<Principal>): Promise<Array<[Principal, AccountId]>>;
}
