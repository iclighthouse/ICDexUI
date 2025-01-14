import { Principal } from '@dfinity/principal';
import { Address } from '@/ic/DRC20Token/model';
import { Amount, DexInfo, TokenLiquidity, Vol } from '@/ic/ICSwap/model';
import { Txid, Time, Icrc1Account, AccountId, Gas } from '@/ic/common/icType';
import { TxnRecordStatus } from '@/ic/cyclesFinance/model';
import { SwapTokenInfo } from '@/ic/ICSwapRouter/model';
import exp from 'constants';
export type LevelResponse = [unitSize, OrderBook];
export type unitSize = bigint;
export interface OrderBook {
  ask: Array<PriceResponse>;
  bid: Array<PriceResponse>;
}
export interface PriceResponse {
  quantity: bigint;
  price: bigint;
}
// export type PrepareResponse = [TxAccount, Nonce];
// export type TxAccount = string;
export type Nonce = bigint;
export interface OrderPrice {
  quantity:
    | {
        Buy: [tokenAmount, icpPrice];
      }
    | {
        Sell: bigint;
      };
  price: bigint;
}
export type icpPrice = bigint;
export type tokenAmount = bigint;
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
export type TradingResult = TradingResultOk | TradingResultErr;
export type TradingResultOk = {
  ok: {
    status: TradingStatus;
    txid: Txid;
    filled: Array<OrderFilled>;
  };
};
export type TradingResultErr = {
  err: {
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
          UnacceptableVolatility: null;
        }
      | {
          TransactionBlocking: null;
        }
      | {
          InsufficientBalance: null;
        }
      | {
          TransferException: null;
        }
      | {};
    message: string;
  };
};
export type TradingStatus =
  | {
      Prepared: null;
    }
  | {
      Todo: null;
    }
  | {
      Closed: null;
    }
  | {
      Cancelled: null;
    }
  | {
      Pending: null;
    }
  | {
      Fail: null;
    }
  | { Completed: null }
  | {};
export interface OrderFilled {
  token0Value: BalanceChange;
  counterparty: Txid;
  token1Value: BalanceChange;
  time: Time;
}
export interface BalanceChange {
  DebitRecord: bigint;
  CreditRecord: bigint;
  NoChange: null;
}
export interface TrieList {
  total: bigint;
  data: Array<PendingList>;
  totalPage: bigint;
}
export type PendingList = [Txid, TradingOrder];
export interface TradingOrder {
  fee: { fee0: bigint; fee1: bigint };
  gas: { gas0: bigint; gas1: bigint };
  status: TradingStatus;
  toids: Array<Toid>;
  data: Array<Array<number>>;
  time: Time;
  txid: Txid;
  icrc1Account: Array<Icrc1Account>;
  orderType: OrderType;
  filled: Array<OrderFilled>;
  expiration: Time;
  nonce: bigint;
  account: Array<number>;
  remaining: OrderPrice;
  index: bigint;
  orderPrice: OrderPrice;
  refund: [bigint, bigint, bigint];
  orderStatus?: OrderStatus;
}
export type Toid = bigint;
export interface TxnRecord {
  fee: { token0Fee: bigint; token1Fee: bigint };
  shares: ShareChange;
  msgCaller: Array<Principal> | [];
  data: Array<Array<number>> | [];
  time: Time;
  txid: Txid;
  filled: {
    token0Value: BalanceChange;
    token1Value: BalanceChange;
  };
  order: {
    token0Value: [BalanceChange];
    token1Value: [BalanceChange];
  };
  status: TxnRecordStatus;
  orderMode: { AMM: null } | { OrderBook: null };
  orderType: [OrderType];
  token0: TokenType;
  token1: TokenType;
  nonce: bigint;
  operation: OperationType;
  account: Array<number>;
  details: Array<OrderFilled>;
  caller: Array<number>;
  index: bigint;
  cyclesWallet: Array<Principal> | [];
  token0Id?: string;
  token1Id?: string;
}
export type OperationType =
  | { AddLiquidity: null }
  | { Swap: null }
  | { Claim: null }
  | { RemoveLiquidity: null };
export type ShareChange =
  | {
      Burn: Shares;
    }
  | {
      Mint: Shares;
    }
  | {
      NoChange: null;
    };
export type Shares = bigint;
export type TokenType = { Icp: null } | { Token: Principal } | { Cycles: null };
export interface KBar {
  kid: bigint;
  low: bigint;
  vol: Vol;
  high: bigint;
  close: bigint;
  open: bigint;
  updatedTs: bigint;
  change?: number;
  token0volume?: number;
  token1volume?: number;
}
export type LatestFilledRecord = Array<[Time, Txid, OrderFilled]>;
export type TxAccount = [Icrc1Account, string, Nonce, Txid];
export interface Order {
  status: OrderStatus;
  tasks: List;
  callbackStatus: Array<Status>;
  data: Array<Array<number>>;
  name: string;
  comps: List;
  time: Time;
  compStrategy: CompStrategy;
  allowPushing: { Opening: null } | { Closed: null } | {};
}
export type CompStrategy =
  | {
      Backward: null;
    }
  | {
      Forward: null;
    }
  | {};
export type OrderStatus =
  | {
      Done: null;
    }
  | {
      Todo: null;
    }
  | {
      Doing: null;
    }
  | {
      Recovered: null;
    }
  | {
      Compensating: null;
    }
  | {
      Blocking: null;
    }
  | {};
export type List = Array<Array<[SagaTask, List]>>;
export interface SagaTask {
  status: Status;
  comp: Array<Compensation>;
  task: Task;
  ttid: Ttid;
}
export type Status =
  | {
      Error: null;
    }
  | {
      Done: null;
    }
  | {
      Todo: null;
    }
  | {
      Doing: null;
    }
  | {
      Unknown: null;
    }
  | {};
export interface Compensation {
  preTtid: Array<Ttid>;
  data: Array<Array<number>>;
  time: Time;
  toid: Array<Toid>;
  callType: CallType;
  cycles: bigint;
  recallInterval: bigint;
  attemptsMax: bigint;
  callee: Principal;
  forTtid: Array<Ttid>;
}
export interface Task {
  preTtid: Array<Ttid>;
  data: Array<Array<number>>;
  time: Time;
  toid: Array<Toid>;
  callType: CallType;
  cycles: bigint;
  recallInterval: bigint;
  attemptsMax: bigint;
  callee: Principal;
  forTtid: Array<Ttid>;
}
export type Ttid = bigint;
export type CallType = any;
export interface Setting {
  MAX_STORAGE_TRIES: bigint;
  EN_DEBUG: boolean;
  MAX_CACHE_NUMBER_PER: bigint;
  MAX_CACHE_TIME: bigint;
}
export interface DexSetting {
  MAX_TPS: bigint;
  ICTC_RUN_INTERVAL: bigint;
  MAKER_BONUS_RATE: bigint;
  MAX_PENDINGS: bigint;
  TRADING_FEE: bigint;
  UNIT_SIZE: bigint;
  STORAGE_INTERVAL: bigint;
}
export type MakerRebate = [Rate, FeeRebate];
export type Rate = string;
export type FeeRebate = string;
export interface Stats {
  change24h: string;
  vol24h: Vol;
  totalVol: Vol;
  price: string;
}
export interface PairInfo {
  decimals: number;
  setting: DexSetting;
  owner: Principal;
  name: string;
  version: string;
  token0: SwapTokenInfo;
  token1: SwapTokenInfo;
  paused: boolean;
  controllers?: Array<string>;
  moduleHash?: string;
  admins?: Array<Principal>;
  IDOConfig?: IDOConfig;
  auctionMode?: [boolean, AccountId];
}
export type OrderStatusResponse =
  | { Failed: TradingOrder }
  | { None: null }
  | { Completed: TxnRecord }
  | { Pending: TradingOrder };
export type CompRoundResponse = [Round, Array<RoundInfo>];
export type Round = bigint;
export interface RoundInfo {
  end: Time;
  content: string;
  isSettled: boolean;
  name: string;
  minCapital: bigint;
  start: Time;
  closedPrice: Array<string>;
  quoteToken: { token0: null } | { token1: null };
}
export interface CompResult {
  vol: Vol;
  status: { Active: null } | { Dropout: null };
  capital: CompCapital;
  assetValue: Array<CompCapital>;
}
export interface CompCapital {
  total: string;
  value0: bigint;
  value1: bigint;
}
export interface CompDepositAccount {
  depositing: [Icrc1Account, Address];
  balance: [Icrc1Account, Address];
}
export type Ambassador = [boolean, string, number, Vol];
export type SysMode =
  | {
      DisabledTrading: null;
    }
  | {
      ReadOnly: null;
    }
  | {
      ClosingOnly: null;
    }
  | {
      GeneralTrading: null;
    };
export interface KeepingBalance {
  token0: { locked: Amount; available: Amount };
  token1: { locked: Amount; available: Amount };
}
export interface AccountSetting {
  enPoolMode: boolean;
  modeSwitchHistory: Array<[bigint, bigint]>;
  start: Array<bigint>;
  enKeepingBalance: boolean;
}
export type ConfigMode = { PoolMode: null } | { TunnelMode: null };
export interface DexRole {
  broker: boolean;
  proTrader: boolean;
  vipMaker: boolean;
}
export type ProOrderConfig =
  | {
      GridOrder: GridOrderConfig;
    }
  | { IcebergOrder: IcebergOrderConfig }
  | { TWAP: TWAPSetting }
  | { VWAP: VWAPSetting };
export interface VWAPSetting {
  endTime: Time;
  startingTime: Time;
  order: {
    priceLimit: Amount;
    priceSpread: Amount;
    side: OrderSide;
  };
  totalLimit: { Token0: bigint } | { Token1: bigint };
  amountPerTrigger: { Token0: bigint } | { Token1: bigint };
  triggerVol: { Geom: Ppm } | { Arith: bigint };
}
export interface TWAPSetting {
  endTime: Time;
  startingTime: Time;
  order: {
    priceLimit: Amount;
    priceSpread: Amount;
    side: OrderSide;
  };
  totalLimit: { Token0: bigint } | { Token1: bigint };
  amountPerTrigger: { Token0: bigint } | { Token1: bigint };
  triggerInterval: bigint; // seconds
}
export interface IcebergOrderConfig {
  endTime: Time;
  startingTime: Time;
  order: { side: OrderSide; price: Amount };
  totalLimit: { Token0: bigint } | { Token1: bigint };
  amountPerTrigger: { Token0: bigint } | { Token1: bigint };
}
export type OrderSide = { Buy: null } | { Sell: null };
export type ProOrderConfigUpdate =
  | {
      GridOrder: GridOrderConfigUpdate;
    }
  | { IcebergOrder: IcebergOrderUpdate }
  | {
      TWAP: TWAPUpdate;
    }
  | {
      VWAP: VWAPUpdate;
    };
export interface VWAPUpdate {
  status: STStatus[];
  setting: Array<VWAPSetting>;
}
export interface TWAPUpdate {
  status: STStatus[];
  setting: Array<TWAPSetting>;
}
export interface IcebergOrderUpdate {
  status: STStatus[];
  setting: Array<IcebergOrderConfig>;
}
export interface GridOrderConfigUpdate {
  status: STStatus[];
  lowerLimit: bigint[];
  upperLimit: bigint[];
  spread: Array<
    | {
        Geom: Ppm;
      }
    | { Arith: bigint }
  >;
  amount: GridOrderConfigAmount[];
}
export interface GridOrderConfig {
  lowerLimit: bigint;
  upperLimit: bigint;
  spread:
    | {
        Geom: Ppm;
      }
    | { Arith: bigint };
  amount: GridOrderConfigAmount;
}
export type GridOrderConfigAmount =
  | {
      Percent: Ppm[];
    }
  | {
      Token0: bigint;
    }
  | {
      Token1: bigint;
    };
export type Ppm = bigint;
export type Soid = bigint;
export interface STOrder {
  status: STStatus;
  pendingOrders: STOrderPendingOrders;
  strategy: STStrategy;
  soid: Soid;
  initTime: Time;
  icrc1Account: Icrc1Account;
  stats: STStats;
  triggerTime: Time;
  stType: STType;
}
export type STOrderPendingOrder = [Txid[], bigint, bigint];
export type STOrderPendingOrders = {
  buy: Array<STOrderPendingOrder>;
  sell: Array<STOrderPendingOrder>;
};
export type STType =
  | { GridOrder: null }
  | { TWAP: null }
  | { VWAP: null }
  | {
      IcebergOrder: null;
    }
  | {
      StopLossOrder: null;
    };
export interface STStats {
  totalOutAmount: {
    token0: bigint;
    token1: bigint;
  };
  orderCount: bigint;
  totalInAmount: {
    token0: bigint;
    token1: bigint;
  };
  errorCount: bigint;
}
export type STStrategy =
  | { GridOrder: GridOrder }
  | { IcebergOrder: IcebergOrder }
  | { TWAP: TWAP }
  | { VWAP: VWAP }
  | { StopLossOrder: StopLossOrder };
export interface StopLossOrder {
  triggeredOrder: Array<TriggeredOrder>;
  condition: Condition;
}
export interface Condition {
  order: {
    side: OrderSide;
    quantity: bigint;
    price: Amount;
  };
  triggerPrice: Amount;
}
export interface TriggeredOrder {
  order: TriggeredOrderInfo;
  triggerPrice: Amount;
}
export interface TriggeredOrderInfo {
  side: OrderSide;
  quantity: bigint;
  price: Amount;
}
export interface VWAP {
  setting: VWAPSetting;
  lastVol: Array<bigint>;
}
export interface TWAP {
  setting: TWAPSetting;
  lastTime: Array<Time>;
}
export interface IcebergOrder {
  setting: IcebergOrderConfig;
  lastTxid: Array<Array<number>>;
}
export interface GridOrder {
  setting: GridSetting;
  gridPrices: GridPrices;
  level1Filled: level1Filled;
}
export type level1Filled = Array<{ buy1: bigint; sell1: bigint }>;
export interface GridPrices {
  buy: bigint[];
  sell: bigint[];
}
export interface GridSetting {
  ppmFactor: bigint[];
  lowerLimit: bigint;
  upperLimit: bigint;
  gridCountPerSide: bigint;
  spread:
    | {
        Geom: Ppm;
      }
    | { Arith: bigint };
  amount: GridOrderConfigAmount;
  initPrice: bigint;
}
export type STStatus =
  | { Stopped: null }
  | { Running: null }
  | { Deleted: null };
export interface StoSetting {
  gridMaxPerSide: bigint;
  StopLossCountMax: bigint;
  poFee1: bigint;
  poFee2: string;
  sloFee1: bigint;
  sloFee2: string;
}
export interface TrieList_3 {
  total: bigint;
  data: Array<[Array<number>, MakerInfo]>;
}
export interface MakerInfo {
  vol: Vol;
  count: bigint;
  rate: string;
  commission: Vol;
}
export interface StopLossOrderConfig {
  order: {
    side: OrderSide;
    quantity: bigint;
    price: Amount;
  };
  triggerPrice: Amount;
}
export interface UpdateStopLossOrderConfig {
  status: Array<STStatus>;
  order: Array<TriggeredOrderInfo>;
  triggerPrice: Array<Amount>;
}
export type IDOConfig = [Array<Principal>, IDOSetting, Array<IDORequirement>];
export interface IDOSetting {
  IDOSupplies: Array<{ supply: Amount; price: bigint }>;
  IDOWhitelistEnabled: boolean;
  IDOOpeningTime: Time;
  IDOTotalSupply: {
    IDOSupply: Amount;
    percentageOfTotal: string;
  };
  IDOEnabled: boolean;
  IDOLimitPerAccount: Amount;
  IDOClosingTime: Time;
}
export interface IDORequirement {
  threshold: string;
  pairs: Array<{ pair: Principal; token1ToUsdRatio: string }>;
}
export type Qualification = Array<[string, Participant]>;
export interface Participant {
  updatedTime: Time;
  used: Amount;
  limit: Amount;
  historyVol: string;
}
export interface TrieList_5 {
  total: bigint;
  data: Array<[AccountId, BrokerInfo, string?]>;
}
export interface BrokerInfo {
  vol: Vol;
  count: bigint;
  rate: string;
  commission: Vol;
}
export interface OrderHealth {
  freezeUntil: Time;
  order: bigint;
  fail: bigint;
  message: string;
  freezingCount: bigint;
  cancelledTime: Time;
  cancel: bigint;
  failedTime: Time;
}
export interface TTsResponse {
  total: bigint;
  data: Array<[bigint, TaskEvent]>;
  totalPage: bigint;
}
export interface TTErrorsResponse {
  total: bigint;
  data: Array<[bigint, ErrorLog]>;
  totalPage: bigint;
}
export interface ErrorLog {
  result: [] | [TaskResult];
  time: Time;
  ttid: Ttid;
  callee: [] | [Principal];
}
export interface TaskEvent {
  result: TaskResult;
  callbackStatus: [] | [Status__2];
  task: Task;
  time: Time;
  toid: [] | [bigint];
  ttid: Ttid;
  attempts: bigint;
  txHash: Uint8Array | number[];
}
export type Status__2 =
  | { Error: null }
  | { Done: null }
  | { Todo: null }
  | { Doing: null }
  | { Unknown: null };
export type TaskResult = [Status__1, [] | [Receipt], [] | [Err]];
export interface Err {
  code: ErrorCode;
  message: string;
}
export type ErrorCode =
  | { canister_error: null }
  | { call_error: { err_code: number } }
  | { system_transient: null }
  | { future: number }
  | { canister_reject: null }
  | { destination_invalid: null }
  | { system_fatal: null };
export type Receipt =
  | { __block: null }
  | {
      ICDex:
        | { withdraw: [bigint, bigint] }
        | { depositFallback: [bigint, bigint] }
        | { deposit: null };
    }
  | {
      ICRC1:
        | { icrc1_balance_of: bigint }
        | { icrc1_transfer: { Ok: bigint } | { Err: TransferError } };
    }
  | {
      This:
        | {
            updatePoolLocalBalance: {
              ts: bigint;
              balance0: bigint;
              balance1: bigint;
            };
          }
        | {
            batchTransfer: Array<{
              token0: { locked: bigint; available: bigint };
              token1: { locked: bigint; available: bigint };
            }>;
          }
        | { dexDepositFallback: [bigint, bigint] };
    }
  | {
      StratOrder:
        | { sto_updateProOrder: bigint }
        | { sto_createProOrder: bigint }
        | { sto_cancelPendingOrders: null };
    }
  | {
      DRC20:
        | { transferBatch: Array<TxnResult> }
        | { transferFrom: TxnResult }
        | { approve: TxnResult }
        | { balanceOf: bigint }
        | { txnRecord: [] | [TxnRecord__2] }
        | { lockTransfer: TxnResult }
        | { transfer: TxnResult }
        | { dropAccount: null }
        | { executeTransfer: TxnResult }
        | { lockTransferFrom: TxnResult };
    }
  | {
      ICRC1New:
        | { icrc1_balance_of: bigint }
        | { icrc1_transfer: { Ok: bigint } | { Err: TransferError__1 } };
    }
  | { __skip: null };
export interface TxnRecord__2 {
  gas: Gas;
  msgCaller: [] | [Principal];
  transaction: Transaction;
  txid: Txid__5;
  nonce: bigint;
  timestamp: Time;
  caller: AccountId;
  index: bigint;
}
export interface Transaction {
  to: AccountId;
  value: bigint;
  data: [] | [Uint8Array | number[]];
  from: AccountId;
  operation: Operation;
}
export type Operation =
  | { approve: { allowance: bigint } }
  | {
      lockTransfer: {
        locked: bigint;
        expiration: Time;
        decider: AccountId;
      };
    }
  | {
      transfer: {
        action: { burn: null } | { mint: null } | { send: null };
      };
    }
  | { executeTransfer: { fallback: bigint; lockedTxid: Txid__5 } };
export type TxnResult =
  | { ok: Txid__5 }
  | {
      err: {
        code:
          | { NonceError: null }
          | { InsufficientGas: null }
          | { InsufficientAllowance: null }
          | { UndefinedError: null }
          | { InsufficientBalance: null }
          | { NoLockedTransfer: null }
          | { DuplicateExecutedTransfer: null }
          | { LockedTransferExpired: null };
        message: string;
      };
    };
export type Txid__5 = Uint8Array | number[];
export type TransferError__1 =
  | {
      GenericError: { message: string; error_code: bigint };
    }
  | { TemporarilyUnavailable: null }
  | { BadBurn: { min_burn_amount: bigint } }
  | { Duplicate: { duplicate_of: bigint } }
  | { BadFee: { expected_fee: bigint } }
  | { CreatedInFuture: { ledger_time: bigint } }
  | { TooOld: null }
  | { InsufficientFunds: { balance: bigint } };
export type TransferError =
  | {
      GenericError: { message: string; error_code: bigint };
    }
  | { TemporarilyUnavailable: null }
  | { BadBurn: { min_burn_amount: bigint } }
  | { Duplicate: { duplicate_of: bigint } }
  | { BadFee: { expected_fee: bigint } }
  | { CreatedInFuture: null }
  | { TooOld: { allowed_window_nanos: bigint } }
  | { InsufficientFunds: { balance: bigint } };
export type Status__1 =
  | { Error: null }
  | { Done: null }
  | { Todo: null }
  | { Doing: null }
  | { Unknown: null };
export type TOPoolResponse = Array<[bigint, [] | [Order]]>;
export default interface Service {
  liquidity(address: Array<Address>): Promise<TokenLiquidity>;
  level10(): Promise<LevelResponse>;
  level100(): Promise<LevelResponse>;
  // prepare(address: Address): Promise<PrepareResponse>;
  trade(
    orderPrice: OrderPrice,
    orderType: OrderType,
    expiration: Array<bigint>,
    nonce: Array<bigint>,
    subaccount: Array<Array<number>>,
    data: Array<Array<number>>
  ): Promise<TradingResult>;
  pending(
    address: Array<Address>,
    page: Array<number>,
    size: Array<number>
  ): Promise<TrieList>;
  cancel(nonce: bigint, subaccount: Array<Array<number>>): Promise<void>;
  cancelByTxid(txid: Txid, subaccount: Array<Array<number>>): Promise<void>;
  drc205_events(address: Array<Address>): Promise<Array<TxnRecord>>;
  getQuotes(kInterval: bigint): Promise<Array<KBar>>;
  latestFilled(): Promise<LatestFilledRecord>;
  getTxAccount(address: Address): Promise<TxAccount>;
  ictc_getTO(toid: bigint): Promise<Array<Order>>;
  drc205_getConfig(): Promise<Setting>;
  ictc_runTT(): Promise<bigint>;
  getConfig(): Promise<DexSetting>;
  makerRebate(address: Address): Promise<MakerRebate>;
  drc205_dexInfo(): Promise<DexInfo>;
  fallback(nonce: BigInt, subaccount: Array<Array<number>>): Promise<boolean>;
  stats(): Promise<Stats>;
  monitor(): Promise<bigint>;
  info(): Promise<PairInfo>;
  statusByTxid(txid: Txid): Promise<OrderStatusResponse>;
  orderExpirationDuration(): Promise<bigint>;
  pendingCount(): Promise<bigint>;
  ta_description(): Promise<string>;
  ta_getReferrer(address: Address): Promise<Array<[Address, boolean]>>;
  ta_setReferrer(
    address: Address,
    entity: Array<string>,
    subaccount: Array<Array<number>>
  ): Promise<boolean>;
  comp_round(round: Array<Round>): Promise<CompRoundResponse>;
  comp_result(
    round: Array<Round>,
    address: Address
  ): Promise<Array<CompResult>>;
  comp_settle(round: Round): Promise<void>;
  comp_register(subaccount: Array<Array<number>>): Promise<boolean>;
  comp_getDepositAccount(address: Address): Promise<CompDepositAccount>;
  comp_dropout(subaccount: Array<Array<number>>): Promise<boolean>;
  comp_deposit(
    value0: Amount,
    value1: Amount,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  ta_ambassador(address: Address): Promise<Ambassador>;
  comp_fallback(subaccount: Array<Array<number>>): Promise<[Amount, Amount]>;
  comp_withdraw(subaccount: Array<Array<number>>): Promise<[Amount, Amount]>;
  sysMode(): Promise<{ mode: SysMode; openingTime: Time }>;
  accountBalance(address: Address): Promise<KeepingBalance>;
  accountSetting(address: Address): Promise<AccountSetting>;
  accountConfig(
    mode: ConfigMode,
    keeping: boolean,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  deposit(
    token: { token0: null } | { token1: null },
    amount: Amount,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  depositFallback(subaccount: Array<Array<number>>): Promise<[Amount, Amount]>;
  withdraw(
    token0Amount: Array<Amount>,
    token1Amount: Array<Amount>,
    subaccount: Array<Array<number>>
  ): Promise<[Amount, Amount]>;
  getRole(address: Address): Promise<DexRole>;
  sto_createProOrder(
    proOrderConfig: ProOrderConfig,
    subaccount: Array<Array<number>>
  ): Promise<Soid>;
  sto_getAccountProOrders(address: Address): Promise<Array<STOrder>>;
  sto_updateProOrder(
    soid: Soid,
    proOrderConfig: ProOrderConfigUpdate,
    subaccount: Array<Array<number>>
  ): Promise<Soid>;
  sto_cancelPendingOrders(
    soid: Soid,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  sto_getConfig(): Promise<StoSetting>;
  makerList(page: Array<number>, size: Array<number>): Promise<TrieList_3>;
  drc205_events_filter(
    address: Array<string>,
    start: Array<bigint>,
    end: Array<bigint>
  ): Promise<[Array<TxnRecord>, boolean]>;
  sto_createStopLossOrder(
    StopLossOrderConfig: StopLossOrderConfig,
    subaccount: Array<Array<number>>
  ): Promise<Soid>;
  sto_getAccountStopLossOrders(address: string): Promise<Array<STOrder>>;
  sto_updateStopLossOrder(
    soid: Soid,
    updateStopLossOrderConfig: UpdateStopLossOrderConfig,
    subaccount: Array<Array<number>>
  ): Promise<Soid>;
  sto_getStratOrder(soid: Soid): Promise<Array<STOrder>>;
  IDO_getConfig(): Promise<IDOConfig>;
  IDO_qualification(address: Array<string>): Promise<Qualification>;
  IDO_updateQualification(
    subaccount: Array<Array<number>>
  ): Promise<Array<Participant>>;
  ictc_getAdmins(): Promise<Array<Principal>>;
  getAuctionMode(): Promise<[boolean, AccountId]>;
  brokerList(page: Array<bigint>, size: Array<bigint>): Promise<TrieList_5>;
  health(address: string): Promise<OrderHealth>;
  ictc_getTOCount(): Promise<bigint>;
  ictc_getTTs(page: bigint, size: bigint): Promise<TTsResponse>;
  ictc_getTTErrors(page: bigint, size: bigint): Promise<TTErrorsResponse>;
  ictc_getTOPool(): Promise<TOPoolResponse>;
}
