import { Principal } from '@dfinity/principal';
import {
  AccountIdentifier,
  Icrc1Account,
  Time,
  Txid
} from '@/ic/common/icType';
import { _data, Nonce } from '@/ic/ICLighthouseToken/model';
import { Address } from '@/ic/DRC20Token/model';
import { SwapTokenInfo } from '@/ic/ICSwapRouter/model';
export interface DexInfo {
  feeRate: string;
  mmType: { AMM: null } | { OrderBook: null };
  token0: [TokenType, TokenStd];
  token1: [TokenType, TokenStd];
  pairName: string;
  dexName: string;
  canisterId: TokenId;
}
export type TokenType = { Icp: null } | { Cycles: null } | { Token: TokenId };
export type TokenStd =
  | { dft: null }
  | { dip20: null }
  | { drc20: null }
  | { other: null }
  | { cycles: null }
  | { icrc1: null }
  | { icp: null };
export type TokenId = Principal;
export interface TokenLiquidity {
  vol: Vol;
  shares: Shares;
  shareWeighted: ShareWeighted;
  unitValue: [Amount, Amount];
  orderCount: bigint;
  token0: Amount;
  token1: Amount;
  priceWeighted: PriceWeighted;
  price: bigint;
  userCount: bigint;
  unitSize: bigint;
}
export interface Vol {
  value0: Amount;
  value1: Amount;
}
export type Shares = bigint;
export interface ShareWeighted {
  updateTime: Time;
  shareTimeWeighted: bigint;
}
export interface PriceWeighted {
  updateTime: Time;
  token1TimeWeighted: bigint;
  token0TimeWeighted: bigint;
}
export type Amount = bigint;
export interface DexConfig {
  FEE: bigint;
  RETENTION_RATE: bigint;
  TOKEN0_LIMIT: bigint;
  MAX_VOLATILITY: bigint;
  TOKEN1_LIMIT: bigint;
  ICP_FEE: bigint;
}
export type SwapAmount = { token0: Amount } | { token1: Amount };
export type TxnResult =
  | {
      ok: TxnResultOk;
    }
  | {
      err: SwapTxnResultErr;
    };
export type TxnResultOk = { status: TxnStatus; txid: Txid };
export type TxnStatus =
  | {
      Success: null;
    }
  | {
      Failure: null;
    }
  | {
      Blocking: null;
    }
  | {
      Pending: null;
    };
export type SwapTxnResultErr = {
  code:
    | {
        InsufficientShares: null;
      }
    | {
        PoolIsEmpty: null;
      }
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
        TransferException: null;
      };
  message: string;
};
export interface PendingResult {
  total: bigint;
  totalPage: bigint;
  data: Array<[Txid, OrderPending]>;
}
export interface OrderPending {
  status: TxnStatus;
  time: Time;
  toid: bigint;
  value0: Amount;
  value1: Amount;
  icrc1Account: Array<Icrc1Account>;
  operation: OperationType;
  account: Array<number>;
}
export interface OperationType {
  AddLiquidity: null;
  Swap: null;
  Claim: null;
  RemoveLiquidity: null;
}
export type SwapYield = [
  { apyToken0: string; apyToken1: string },
  { apyToken0: string; apyToken1: string }
];
export interface ICSwapFeeStatus {
  feeRate: string;
  // feeBalance: FeeBalance;
  totalFee: FeeBalance;
}
export interface FeeBalance {
  value0: Amount;
  value1: Amount;
}
export interface AccountBalance {
  available0: Amount;
  available1: Amount;
  locked0: Amount;
  locked1: Amount;
}
export interface SwapInfo {
  decimals: bigint;
  setting: DexConfig;
  owner: Principal;
  name: string;
  version: string;
  token0: SwapTokenInfo;
  token1: SwapTokenInfo;
  paused: boolean;
}
export type OrderRequest =
  | {
      add: { token: Principal; value: Amount };
    }
  | {
      receive: { token: Principal; value: Amount };
    };
export type DepositAccount = [Icrc1Account, Address, Nonce, Txid];
export default interface Service {
  drc205_dexInfo(): Promise<DexInfo>;
  liquidity(accountId: Array<AccountIdentifier>): Promise<TokenLiquidity>;
  getConfig(): Promise<DexConfig>;
  swap(
    orderRequest: OrderRequest,
    slip: Array<bigint>,
    autoWithdraw: Array<boolean>,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  userCount(): Promise<bigint>;
  decimals(): Promise<number>;
  add(
    value0: Array<Amount>,
    value1: Array<Amount>,
    autoWithdraw: Array<boolean>,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  pending(address: Array<Address>): Promise<PendingResult>;
  fallback(subAccount: Array<Array<number>>): Promise<void>;
  yield(): Promise<SwapYield>;
  feeStatus(): Promise<ICSwapFeeStatus>;
  lpRewards(address: Address, includePending: boolean): Promise<FeeBalance>;
  claim(
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  remove(
    shares: Array<bigint>,
    autoWithdraw: Array<boolean>,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  getDepositAccount(address: Address): Promise<DepositAccount>;
  withdraw(
    autoWithdraw: Array<boolean>,
    subAccount: Array<Array<number>>
  ): Promise<void>;
  autoWithdrawal(address: Address): Promise<boolean>;
  balance(address: Address): Promise<AccountBalance>;
  info(): Promise<SwapInfo>;
}
