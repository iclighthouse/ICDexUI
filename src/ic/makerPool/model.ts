import { AccountId, Icrc1Account, Time, TokenStd } from '@/ic/common/icType';
import { Amount } from '@/ic/ICSwap/model';
import { Principal } from '@dfinity/principal';
import {
  TOPoolResponse,
  TTErrorsResponse,
  TTsResponse
} from '@/ic/ICDex/model';

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
export type PoolEvent =
  | {
      add:
        | {
            ok: {
              toids: Array<bigint>;
              shares: bigint;
              token0: Amount;
              token1: Amount;
              account: Icrc1Account;
            };
          }
        | {
            err: {
              toids: Array<bigint>;
              account: Icrc1Account;
              depositToken0: Amount;
              depositToken1: Amount;
            };
          };
    }
  | {
      remove:
        | {
            ok: {
              shares: bigint;
              toid: [] | [bigint];
              token0: Amount;
              token1: Amount;
              account: Icrc1Account;
            };
          }
        | {
            err: {
              addPoolToken0: Amount;
              addPoolToken1: Amount;
              toid: [] | [bigint];
              account: Icrc1Account;
            };
          };
    }
  | {
      dexWithdraw: {
        toid: [] | [bigint];
        token0: bigint;
        token1: bigint;
      };
    }
  | {
      withdraw: {
        toid: [] | [bigint];
        token0: bigint;
        token1: bigint;
        account: Icrc1Account;
      };
    }
  | {
      fallback: {
        toids: Array<bigint>;
        token0: Amount;
        token1: Amount;
        account: Icrc1Account;
      };
    }
  | { init: { initArgs: InitArgs } }
  | { lock: { message: [] | [string] } }
  | {
      updateUnitNetValue: {
        pairBalance:
          | []
          | [
              {
                token0: { locked: Amount; available: Amount };
                token1: { locked: Amount; available: Amount };
              }
            ];
        poolShares: bigint;
        poolBalance: PoolBalance__1;
        unitNetValue: UnitNetValue__1;
        localBalance: PoolBalance__1;
      };
    }
  | {
      dexDeposit: {
        toid: [] | [bigint];
        token0: bigint;
        token1: bigint;
      };
    }
  | { changeOwner: { newOwner: Principal } }
  | { unlock: { message: [] | [string] } }
  | {
      deposit: {
        token0: bigint;
        token1: bigint;
        account: Icrc1Account;
      };
    }
  | { deleteGridOrder: { soid: [] | [bigint]; toid: [] | [bigint] } }
  | { updateGridOrder: { soid: [] | [bigint]; toid: [] | [bigint] } }
  | { start: { message: [] | [string] } }
  | { config: { setting: Config } }
  | { createGridOrder: { toid: [] | [bigint] } }
  | { suspend: { message: [] | [string] } };
export interface Config {
  lowerLimit: [] | [bigint];
  threshold: [] | [Amount];
  upperLimit: [] | [bigint];
  volFactor: [] | [bigint];
  spreadRatePpm: [] | [bigint];
  withdrawalFeePpm: [] | [bigint];
}
export interface UnitNetValue__1 {
  ts: Time;
  shares: bigint;
  token0: bigint;
  token1: bigint;
  price: bigint;
}
export interface PoolBalance__1 {
  ts: Time;
  balance0: Amount;
  balance1: Amount;
}
export interface InitArgs {
  creator: AccountId;
  spreadRate: bigint;
  allow: { Private: null } | { Public: null };
  lowerLimit: bigint;
  threshold: Amount;
  upperLimit: bigint;
  name: string;
  pair: Principal;
  token0: Principal;
  token1: Principal;
  token0Std: TokenStd;
  token1Std: TokenStd;
  volFactor: bigint;
  unitSize: bigint;
}
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
  ictc_getTOCount(): Promise<bigint>;
  ictc_getTTs(page: bigint, size: bigint): Promise<TTsResponse>;
  ictc_getTTErrors(page: bigint, size: bigint): Promise<TTErrorsResponse>;
  ictc_getTOPool(): Promise<TOPoolResponse>;
  get_account_events(accountId: Array<number>): Promise<Array<[PoolEvent, Time]>>;
}
