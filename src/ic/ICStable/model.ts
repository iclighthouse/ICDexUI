import { Principal } from '@dfinity/principal';
import {
  AccountId,
  Time,
  TokenId,
  TokenStd,
  TokenSymbol,
  Txid
} from '@/ic/common/icType';
import { _data, Nonce } from '@/ic/ICLighthouseToken/model';
import { Amount } from '@/ic/ICSwap/model';
import { Address } from '@/ic/DRC20Token/model';

export type ConfigRes = [Config, Config];
export interface Config {
  ICL: Principal;
  ORACLE_INTERVAL: bigint;
  ICORACLE: Principal;
  DUSD: Principal;
  INIT_COLL_RATIO: bigint;
  LIQUIDATION_FEE: bigint;
  MIN_COLL_RATIO: bigint;
  INIT_STABILITY_FEE: bigint;
  LIQUIDATION_INTERVAL: bigint;
  ASSESSING_INTERVAL: bigint;
  DEBT_FLOOR: bigint;
  DEBT_CEILING: bigint;
}
export interface StatsResponse {
  assets: Array<[AssetResponse, bigint]>;
  liquidity: bigint;
  reserve: bigint;
  openingDpCount: bigint;
  supply: bigint;
  assetTotalValue: bigint;
  dpCount: bigint;
}
export interface AssetResponse {
  tokenId: TokenId;
  balance: bigint;
  value: bigint;
  symbol: string;
}
export type CollateralsRes = Array<[TokenId, CollInfo, CollInfo]>;
export interface CollInfo {
  dexSid: bigint;
  mktSid: bigint;
  swapPair: [Principal, { token0: null } | { token1: null }];
  lpDiscountRate: bigint;
  totalCeiling: bigint;
  factor: bigint;
}
export type StableToken = [TokenId, StableTokenInfo];
export interface StableTokenInfo {
  std: TokenStd;
  decimals: number;
  tokenId: TokenId;
  gasToken: bigint;
  symbol: TokenSymbol;
  gasCycles: bigint;
  logo?: string;
}
export type PriceRes = Array<[Time, Array<DataResponse>]>;
export interface DataResponse {
  sid: SeriesId;
  decimals: number;
  data: [Time, bigint];
  name: string;
}
export type SeriesId = bigint;
export type Collateral = Array<[TokenId, Amount]>;
export type RemoveCollateral = [TokenId, Array<CollShares>];
export type TxnResult =
  | {
      ok: TxnResultOk;
    }
  | { err: StableTxnResultErr };
export interface TxnResultOk {
  dpid: Dpid;
  txid: Txid;
}
export type Dpid = bigint;
export interface StableTxnResultErr {
  code:
    | {
        NonceError: null;
      }
    | {
        InvalidAmount: null;
      }
    | {
        UndefinedError: null;
      }
    | {
        TransactionBlocking: null;
      }
    | {
        UnavailableOracle: null;
      }
    | {
        TransferException: null;
      }
    | {
        ReachedCollateralCeiling: null;
      };
  message: string;
}
export interface DebtPosition {
  status: Status;
  debt: bigint;
  borrower: AccountId;
  timestamp: Time;
  doing: Array<[bigint, Action, TxnRecord]>;
  payable: bigint;
  principalId: Array<Principal>;
  collaterals: Array<CollValues>;
}
export type CollValues = [TokenId, bigint, CollShares];
export type CollShares = bigint;
export interface TxnRecord {
  accountId: AccountId;
  data: Array<Array<number>>;
  time: Time;
  txid: Txid;
  operations: Array<[OperationType, TokenId, Array<BalanceChange>]>;
  nonce: bigint;
  index: bigint;
}
export type BalanceChange =
  | { DebitRecord: bigint }
  | { CreditRecord: bigint }
  | { NoChange: null };
export type OperationType =
  | {
      Withdraw: null;
    }
  | {
      AddLiquidity: null;
    }
  | {
      Stake: null;
    }
  | {
      Burn: null;
    }
  | {
      Lend: null;
    }
  | {
      Mint: null;
    }
  | {
      Deposit: null;
    }
  | {
      Swap: null;
    }
  | {
      Borrow: null;
    }
  | {
      Claim: null;
    }
  | {
      RemoveLiquidity: null;
    };
export type Status =
  | { Opening: null }
  | { Closed: null }
  | { Closing: null }
  | { Prepared: null }
  | { Cancelled: null };
export type Action =
  | {
      Opening: null;
    }
  | {
      Closing: null;
    }
  | {
      Borrowing: null;
    }
  | {
      Removing: null;
    }
  | {
      Liquidating: null;
    }
  | {
      Other: string;
    }
  | {
      Adding: null;
    };
export type ChargeMethod = { ICL: null } | { DUSD: null };
export type BorrowerResult = [
  bigint,
  Array<[Dpid, DebtPosition]>,
  Array<[Dpid, DebtPositionLog]>
];
export interface DebtPositionLog {
  status: Status;
  updatedTime: Time;
  openingTime: Time;
  borrower: AccountId;
  closingType: Array<ClosingType>;
  stabilityCosts: bigint;
  liquidationPenalty: Array<[TokenId, bigint]>;
  transactions: Array<[bigint, Action, TxnRecord]>;
  debtPeak: bigint;
}
export type ClosingType = { Payback: null } | { Liquidate: null };

export default interface Service {
  stats(): Promise<StatsResponse>;
  getConfig(): Promise<ConfigRes>;
  collaterals(): Promise<CollateralsRes>;
  tokens(): Promise<Array<StableToken>>;
  getPrice(): Promise<PriceRes>;
  open(
    collateral: Collateral,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  dp(dpId: Dpid): Promise<Array<DebtPosition>>;
  add(
    dpId: Dpid,
    collateral: Collateral,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  remove(
    dpId: Dpid,
    collateral: RemoveCollateral,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  generate(
    dpId: Dpid,
    amount: Array<Amount>,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  payback(
    dpId: Dpid,
    chargeMethod: ChargeMethod,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  borrower(address: Address): Promise<BorrowerResult>;
}
