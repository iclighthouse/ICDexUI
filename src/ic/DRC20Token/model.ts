import { Principal } from '@dfinity/principal';
import {
  Decimals,
  Gas,
  Metadata,
  TotalSupply,
  PrincipalString,
  Txid,
  AccountId,
  Time,
  TokenInfo,
  Icrc1Account,
  BlockHeight, CanisterId
} from '@/ic/common/icType';
import {
  _data,
  Amount,
  CoinSeconds,
  ExecuteType,
  Nonce,
  TxnQueryResponse,
  TxnResult
} from '@/ic/ICLighthouseToken/model';
import { Allowance, AllowanceArgs, SendICPTsRequest } from '@/ic/ledger/model';

export interface TxnRecord {
  gas: Gas;
  msgCaller: Array<Principal> | [];
  transaction: Transaction;
  txid: Txid;
  nonce: bigint;
  timestamp: Time;
  caller: AccountId;
  index: bigint;
}
export interface Transaction {
  to: AccountId;
  value: bigint;
  data: Array<Array<number>> | [];
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
export interface CanisterStatus {
  status?: Status;
  memory_size?: bigint;
  cycles?: bigint;
  settings?: {
    freezing_threshold: bigint;
    controllers: Array<Principal>;
    memory_allocation: bigint;
    compute_allocation: bigint;
  };
  module_hash?: Array<Array<number>>;
}
export type Status = { stopped: null } | { stopping: null } | { running: null };
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

export type Top100Record = [Address, bigint];
export type Address = string;
export interface DRC207Support {
  timer: {
    interval_seconds: Array<bigint>;
    enable: boolean;
  };
  monitorable_by_self: boolean;
  monitorable_by_blackhole: {
    canister_id: Array<Principal>;
    allowed: boolean;
  };
  cycles_receivable: boolean;
}
export type TxReceiptErr =
  | {
      InsufficientAllowance: null;
    }
  | {
      InsufficientBalance: null;
    }
  | {
      ErrorOperationStyle: null;
    }
  | {
      Unauthorized: null;
    }
  | {
      LedgerTrap: null;
    }
  | {
      ErrorTo: null;
    }
  | {
      Other: null;
    }
  | {
      BlockUsed: null;
    }
  | {
      AmountTooSmall: null;
    };
export type TxReceipt =
  | {
      Ok: bigint;
    }
  | {
      Err: TxReceiptErr;
    };
export interface TransferArgs {
  to: Icrc1Account;
  fee: Array<bigint>;
  memo: Array<Array<number>>;
  from_subaccount: Array<Array<number>>;
  created_at_time: Array<bigint>;
  amount: bigint;
}

export type IcrcReceipt = { Ok: bigint } | { Err: IcrcTransferError };
export type IcrcTransferError =
  | {
      GenericError: {
        message: string;
        error_code: bigint;
      };
    }
  | {
      TemporarilyUnavailable: null;
    }
  | {
      BadBurn: { min_burn_amount: bigint };
    }
  | {
      Duplicate: { duplicate_of: bigint };
    }
  | {
      BadFee: { expected_fee: bigint };
    }
  | {
      CreatedInFuture: null;
    }
  | {
      TooOld: { allowed_window_nanos: Duration };
    }
  | {
      InsufficientFunds: { balance: bigint };
    };
export type Duration = bigint;
export type IcrcMetadata = Array<[string, IcrcValue]>;
export type IcrcValue =
  | {
      Int: bigint;
    }
  | {
      Nat: bigint;
    }
  | {
      Blob: Array<number>;
    }
  | {
      Text: string;
    };
export interface ApproveArgs {
  fee: Array<bigint>;
  memo: Array<Array<number>>;
  from_subaccount: Array<Array<number>>;
  created_at_time: Array<bigint>;
  amount: bigint;
  expected_allowance: Array<bigint>;
  expires_at: Array<bigint>;
  spender: Icrc1Account;
}
export type ApproveResponse =
  | {
      Ok: bigint;
    }
  | { Err: ApproveError };
export type ApproveError =
  | {
      GenericError: {
        message: string;
        error_code: bigint;
      };
    }
  | {
      TemporarilyUnavailable: null;
    }
  | {
      Duplicate: { duplicate_of: bigint };
    }
  | {
      BadFee: { expected_fee: bigint };
    }
  | {
      AllowanceChanged: { current_allowance: bigint };
    }
  | { CreatedInFuture: { ledger_time: bigint } }
  | { TooOld: null }
  | { Expired: { ledger_time: bigint } }
  | { InsufficientFunds: { balance: bigint } };
export interface Drc20Allowance {
  remaining: bigint;
  spender: AccountId;
}

export default interface Service {
  drc20_decimals(): Promise<Decimals>;
  decimals(): Promise<Decimals>;
  drc20_gas(): Promise<Gas>;
  drc20_fee(): Promise<bigint>;
  drc20_metadata(): Promise<Array<Metadata>>;
  drc20_name(): Promise<string>;
  drc20_allowance(address: string, spender: PrincipalString): Promise<bigint>;
  name(): Promise<string>;
  drc20_symbol(): Promise<string>;
  symbol(): Promise<string>;
  drc20_totalSupply(): Promise<TotalSupply>;
  totalSupply(): Promise<TotalSupply>;
  drc20_txnQuery(request: TxnQueryRequest): Promise<TxnQueryResponse>;
  drc207(): Promise<DRC207Support>;
  drc202_events(address: Array<Address>): Promise<Array<TxnRecord>>;
  drc202_txn(txid: Txid): Promise<Array<TxnRecord>>;
  drc20_balanceOf(account: Address): Promise<bigint>;
  balanceOf(account: Principal): Promise<bigint>;
  getMetadata(): Promise<TokenInfo>;
  drc20_approve(
    spender: PrincipalString,
    amount: Amount,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  drc20_lockTransfer(
    to: string,
    amount: bigint,
    timeout: bigint,
    decider: Array<string>,
    nonce: Array<bigint>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  approve(spender: Principal, amount: Amount): Promise<TxReceipt>;
  transfer(principal: Principal, amount: Amount): Promise<TxReceipt>;
  getTokenFee(): Promise<bigint>;
  allowance(principal: Principal, principalSpender: Principal): Promise<bigint>;
  icrc1_transfer(transferArgs: TransferArgs): Promise<IcrcReceipt>;
  icrc1_metadata(): Promise<IcrcMetadata>;
  icrc1_decimals(): Promise<number>;
  icrc1_fee(): Promise<bigint>;
  icrc1_name(): Promise<string>;
  icrc1_symbol(): Promise<string>;
  icrc1_total_supply(): Promise<bigint>;
  icrc1_balance_of(to: Icrc1Account): Promise<bigint>;
  ictokens_maxSupply(): Promise<bigint>;
  send_dfx(request: SendICPTsRequest): Promise<BlockHeight>;
  icrc2_approve(approveArgs: ApproveArgs): Promise<ApproveResponse>;
  icrc2_allowance(allowanceArgs: AllowanceArgs): Promise<Allowance>;
  standard(): Promise<string>;
  icrc1_supported_standards(): Promise<Array<{ url: string; name: string }>>;
  drc20_transfer(
    to: PrincipalString,
    amount: Amount,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  drc20_executeTransfer(
    txid: Txid,
    executeType: ExecuteType,
    to: Array<string>,
    nonce: Array<bigint>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  drc20_lockTransfer(
    to: string,
    amount: bigint,
    timeout: bigint,
    decider: Array<string>,
    nonce: Array<bigint>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<TxnResult>;
  drc20_transferBatch(
    to: Array<string>,
    amount: Array<bigint>,
    nonce: Array<Nonce>,
    subAccount: Array<Array<number>>,
    data: _data
  ): Promise<Array<TxnResult>>;
  drc20_getCoinSeconds(
    address: Array<string>
  ): Promise<[CoinSeconds, Array<CoinSeconds>]>;
  drc20_approvals(ICTokensId: PrincipalString): Promise<Array<Drc20Allowance>>;
  ictokens_setMetadata(request: Array<Metadata>): Promise<boolean>;
  ictokens_getOwner(): Promise<CanisterId>;
  ictokens_changeOwner(newOwner: Principal): Promise<boolean>;
}
