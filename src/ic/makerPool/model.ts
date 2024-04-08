import { AccountId, Icrc1Account, Time, TokenStd } from '@/ic/common/icType';
import { Amount } from '@/ic/ICSwap/model';
import { Principal } from '@dfinity/principal';

export interface PoolStats {
  latestUnitNetValue: UnitNetValue;
  apy7d: {
    token0: string;
    token1: string;
  };
  poolShares: bigint;
  poolBalance: PoolBalance;
  poolLocalBalance: PoolBalance;
  apy24h: {
    token0: string;
    token1: string;
  };
  holders: bigint;
  poolShareWeighted: ShareWeighted;
}
export interface UnitNetValue {
  ts: Time;
  shares: bigint;
  token0: bigint;
  token1: bigint;
  price: bigint;
}
export interface PoolBalance {
  ts: Time;
  balance0: Amount;
  balance1: Amount;
}
export interface ShareWeighted {
  updateTime: Time;
  shareTimeWeighted: bigint;
}
export interface PoolInfo {
  creator: AccountId;
  sysTransactionLock: boolean;
  initialized: boolean;
  withdrawalFee: string;
  name: string;
  gridSetting: {
    gridLowerLimit: bigint;
    gridUpperLimit: bigint;
    gridSpread: bigint;
  };
  gridSoid: Array<Array<bigint>>;
  version: string;
  pairInfo: {
    pairUnitSize: bigint;
    token0: [Principal, string, TokenStd];
    token1: [Principal, string, TokenStd];
    pairPrincipal: Principal;
  };
  shareDecimals: number;
  volFactor: bigint;
  visibility:
    | {
        Private: null;
      }
    | {
        Public: null;
      };
  poolThreshold: Amount;
  paused: boolean;
  sysGlobalLock: Array<boolean>;
}
export interface TrieListEvents {
  total: bigint;
  totalPage: bigint;
  data: Array<[bigint, [PoolEvent, Time]]>;
}
export type PoolEvent = any;
export interface MakerConfigure {
  controllers?: Array<string>;
  moduleHash?: string;
  ICTCAdmins?: Array<Principal>;
}

export default interface Service {
  stats2(): Promise<PoolStats>;
  getDepositAccount(address: string): Promise<[Icrc1Account, string]>;
  getAccountShares(address: string): Promise<[bigint, ShareWeighted]>;
  info(): Promise<PoolInfo>;
  add(
    token0Amount: bigint,
    token1Amount: bigint,
    subaccount: Array<Array<number>>
  ): Promise<bigint>;
  remove(
    shares: bigint,
    subaccount: Array<Array<number>>
  ): Promise<[bigint, bigint]>;
  getUnitNetValues(): Promise<{
    data: Array<UnitNetValue>;
    shareUnitSize: bigint;
  }>;
  getAccountVolUsed(address: string): Promise<bigint>;
  get_events(page: Array<bigint>, size: Array<bigint>): Promise<TrieListEvents>;
  ictc_getAdmins(): Promise<Array<Principal>>;
  fallback(subaccount: Array<Array<number>>): Promise<[bigint, bigint]>;
}
