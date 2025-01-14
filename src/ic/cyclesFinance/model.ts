import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@/ic/common/icType';
export interface Liquidity {
  icpE8s: IcpE8s;
  vol: Vol;
  shareWeighted: ShareWeighted;
  unitValue: [number, number];
  shares: bigint;
  cycles: bigint;
  priceWeighted: PriceWeighted;
  swapCount: bigint;
}
export type IcpE8s = bigint;
export interface Vol {
  swapIcpVol: bigint;
  swapCyclesVol: bigint;
}
export interface ShareWeighted {
  updateTime: Timestamp;
  shareTimeWeighted: bigint;
}
export type Timestamp = bigint;
export interface PriceWeighted {
  updateTime: Timestamp;
  icpTimeWeighted: bigint;
  cyclesTimeWeighted: bigint;
}
export interface TxnResultOk {
  shares: ShareChange;
  icpE8s: BalanceChange;
  txid: Txid__1;
  cycles: BalanceChange;
}
export interface TxnResultErr {
  code:
    | { InsufficientShares: null }
    | { PoolIsEmpty: null }
    | { NonceError: null }
    | { UndefinedError: null }
    | { UnacceptableVolatility: null }
    | { InvalidCyclesAmout: null }
    | { InvalidIcpAmout: null }
    | { IcpTransferException: null };
  message: string;
}
export type TxnResult =
  | {
      ok: TxnResultOk;
    }
  | {
      err: TxnResultErr;
    };
export type ShareChange =
  | { Burn: bigint }
  | { Mint: bigint }
  | { NoChange: null };
// export type TokenValue = { In: bigint } | { Out: bigint } | { NoChange: null };
export type Txid__1 = Array<number>;
export type Txid = Array<number>;
export type Data = Array<number>;
export type BalanceChange =
  | { DebitRecord: bigint }
  | { CreditRecord: bigint }
  | { NoChange: null };
export type AccountId = Array<number>;
export type CyclesWallet = Principal;
export interface TxnRecord {
  fee?: { token0Fee: bigint; token1Fee: bigint };
  shares?: ShareChange;
  msgCaller?: Array<Principal>;
  data?: Array<Data>;
  time?: Time;
  txid: Txid__1;
  filled: {
    token0Value: BalanceChange;
    token1Value: BalanceChange;
  };
  order?: {
    token0Value: [BalanceChange];
    token1Value: [BalanceChange];
  };
  status?: TxnRecordStatus;
  token0?: TokenType;
  token1?: TokenType;
  nonce: bigint;
  operation: OperationType;
  account?: AccountId;
  caller?: AccountId;
  index?: bigint;
  cyclesWallet?: Array<CyclesWallet>;
  orderMode?: { AMM: null; OrderBook: null };
  orderType?: [OrderType];
  details?: {
    token0Value: BalanceChange;
    counterparty: Txid__1;
    token1Value: BalanceChange;
    time: Time;
  };
}
export type TxnRecordStatus =
  | { Failed: null }
  | { Completed: null }
  | { Pending: null }
  | { Cancelled: null }
  | { PartiallyCompletedAndCancelled: null };
export type OrderType =
  | {
      FAK: null;
    }
  | {
      FOK: null;
    }
  | {
      LMT: null;
    }
  | {
      MKT: null;
    };
export interface TxnRecordType extends TxnRecord {
  type?: string;
}
export type Time = bigint;
export type TokenType = { Icp: null } | { Token: Principal } | { Cycles: null };
export type OperationType =
  | { AddLiquidity: null }
  | { Swap: null }
  | { Claim: null }
  | { RemoveLiquidity: null };
export interface FeeStatus {
  fee: number;
  cumulFee: {
    icpBalance: bigint;
    cyclesBalance: bigint;
  };
  totalFee: {
    icpBalance: bigint;
    cyclesBalance: bigint;
  };
}
export interface Config {
  FEE: Array<bigint>;
  MIN_ICP_E8S: Array<bigint>;
  ICP_LIMIT: Array<bigint>;
  MIN_CYCLES: Array<bigint>;
  MAX_STORAGE_TRIES: Array<bigint>;
  STORAGE_CANISTER: Array<string>;
  MAX_CACHE_NUMBER_PER: Array<bigint>;
  MAX_CACHE_TIME: Array<bigint>;
  CYCLES_LIMIT: Array<bigint>;
  ICP_FEE: Array<bigint>;
  CYCLESFEE_RETENTION_RATE: Array<bigint>;
}
export type YieldResponse = Array<Yield>;
export interface Yield {
  apyCycles: string;
  apyIcp: string;
}
export interface LpRewards {
  icp: bigint;
  cycles: bigint;
}
export default interface Service {
  getAccountId(accountId: AccountIdentifier): Promise<string>;
  liquidity(accountId: Array<AccountIdentifier>): Promise<Liquidity>;
  icpToCycles(
    icp: BigInt,
    cyclesPrincipal: Principal,
    nonce: Array<bigint>,
    subaccount: Array<Array<number>>,
    data: Array<Array<number>>
  ): Promise<TxnResult>;
  lastTxids(accountId: Array<AccountIdentifier>): Promise<Array<Txid>>;
  txnRecord(txid: Txid): Promise<Array<TxnRecord>>;
  claim(
    cyclesWallet: Principal,
    nonce: Array<bigint>,
    subaccount: Array<Array<number>>,
    data: Array<Array<number>>
  ): Promise<TxnResult>;
  remove(
    shares: Array<bigint>,
    cyclesWallet: Principal,
    nonce: Array<bigint>,
    subaccount: Array<Array<number>>,
    data: Array<Array<number>>
  ): Promise<TxnResult>;
  feeStatus(): Promise<FeeStatus>;
  count(accountId: Array<AccountIdentifier>): Promise<bigint>;
  getEvents(accountId: Array<AccountIdentifier>): Promise<Array<TxnRecord>>;
  getCyclesTransferLogs(request): Promise<void>;
  getConfig(): Promise<Config>;
  yield(): Promise<YieldResponse>;
  lpRewards(address: string): Promise<LpRewards>;
  withdraw(subaccount: Array<Array<number>>): Promise<void>;
}
