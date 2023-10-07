import { Principal } from '@dfinity/principal';
import { PrincipalString, ICL, CanisterId } from '@/ic/common/icType';
import { Metadata, TotalSupply, Gas } from '@/ic/ICTokens/model';
import { Data } from '@/ic/cyclesFinance/model';

export type TxnResult =
  | {
      ok: Txid;
    }
  | TxnResultErr;
export type TxnResultErr = {
  err: {
    code:
      | { NonceError: null }
      | { InsufficientGas: null }
      | { InsufficientAllowance: null }
      | { UndefinedError: null }
      | { InsufficientBalance: null }
      | { LockedTransferExpired: null }
      | { NoLockedTransfer: null }
      | { DuplicateExecutedTransfer: null };
    message: string;
  };
};
export type Txid = Array<number>;
export interface Allowance {
  remaining: bigint;
  spender: AccountId;
}
export type AccountId = Array<number>;
export type _data = Array<Array<number>>;
export type Decimals = number;
export type Nonce = bigint;
export type Amount = bigint;

export type TxnQueryRequest =
  | {
      getEvents: { owner: Array<PrincipalString> };
    }
  | { txnCount: { owner: PrincipalString } }
  | { lockedTxns: { owner: PrincipalString } }
  | { lastTxids: { owner: PrincipalString } }
  | { lastTxidsGlobal: null }
  | { getTxn: { txid: Txid } }
  | { txnCountGlobal: null };

export type TxnQueryResponse =
  | { getEvents: Array<TxnRecord> }
  | {
      txnCount: bigint;
    }
  | {
      lockedTxns: {
        txns: Array<TxnRecord>;
        lockedBalance: bigint;
      };
    }
  | {
      lastTxids: Array<Txid>;
    }
  | { lastTxidsGlobal: Array<TxnRecord> }
  | { getTxn: Array<TxnRecord> }
  | { txnCountGlobal: number };

export interface TxnRecord {
  gas: Gas;
  msgCaller: Array<Principal>;
  transaction: Transaction;
  txid: Txid;
  nonce: bigint;
  timestamp: Time;
  caller: AccountId;
  index: number;
}
export interface Transaction {
  to: AccountId;
  value: number;
  data: Array<Data>;
  from: AccountId;
  operation: Operation;
}
export type Operation =
  | {
      approve: { allowance: bigint };
    }
  | {
      lockTransfer: {
        locked: bigint;
        expiration: Time;
        decider: AccountId;
      };
    }
  | {
      transfer: {
        action:
          | {
              burn: null;
            }
          | {
              mint: null;
            }
          | {
              send: null;
            };
      };
    }
  | {
      executeTransfer: {
        fallback: bigint;
        lockedTxid: Txid;
      };
    };
export type Time = bigint;
export type ExecuteType =
  | { fallback: null }
  | { send: bigint }
  | { sendAll: null };
export interface CoinSeconds {
  updateTime: bigint;
  coinSeconds: bigint;
}
export type dip20TxReceipt =
  | {
      Ok: bigint;
    }
  | {
      Err:
        | { InsufficientAllowance: null }
        | { InsufficientBalance: null }
        | { ErrorOperationStyle: null }
        | { Unauthorized: null }
        | { LedgerTrap: null }
        | { ErrorTo: null }
        | { Other: string }
        | { BlockUsed: null }
        | { AmountTooSmall: null };
    };
export interface dip20Metadata {
  fee: bigint;
  decimals: number;
  owner: Principal;
  logo: string;
  name: string;
  totalSupply: bigint;
  symbol: string;
}
export interface dip20TokenInfo {
  holderNumber: bigint;
  deployTime: bigint;
  metadata: dip20Metadata;
  historySize: bigint;
  cycles: bigint;
  feeTo: Principal;
}

export default interface Service {
  ictokens_setMetadata(request: Array<Metadata>): Promise<boolean>;
  ictokens_getOwner(): Promise<CanisterId>;
  ictokens_changeOwner(newOwner: Principal): Promise<boolean>;
  drc20_allowance(
    ICTokensId: PrincipalString,
    spender: PrincipalString
  ): Promise<Amount>;
  drc20_approvals(ICTokensId: PrincipalString): Promise<Array<Allowance>>;
  drc20_approve(
    spender: PrincipalString,
    amount: Amount,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  drc20_balanceOf(principal: PrincipalString): Promise<Amount>;
  drc20_decimals(): Promise<Decimals>;
  drc20_executeTransfer(
    txid: Txid,
    executeType: ExecuteType,
    to: Array<string>,
    nonce: Array<bigint>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  drc20_gas(): Promise<Gas>;
  drc20_fee(): Promise<bigint>;
  drc20_getCoinSeconds(
    address: Array<string>
  ): Promise<[CoinSeconds, Array<CoinSeconds>]>;
  drc20_lockTransfer(
    to: string,
    amount: bigint,
    timeout: bigint,
    decider: Array<string>,
    nonce: Array<bigint>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  drc20_metadata(): Promise<Array<Metadata>>;
  drc20_name(): Promise<string>;
  drc20_symbol(): Promise<string>;
  drc20_totalSupply(): Promise<TotalSupply>;
  drc20_transfer(
    to: PrincipalString,
    amount: Amount,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  drc20_txnQuery(request: TxnQueryRequest): Promise<TxnQueryResponse>;
  ictokens_maxSupply(): Promise<Array<bigint>>;
  drc20_transferBatch(
    to: Array<string>,
    amount: Array<bigint>,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<Array<TxnResult>>;
}
