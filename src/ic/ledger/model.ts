import { Principal } from '@dfinity/principal';
import {
  AccountIdentifier,
  BlockHeight,
  E8s,
  Icrc1Account
} from '../common/icType';
import { ApproveArgs, ApproveError } from '@/ic/DRC20Token/model';
export interface GetBalancesRequest {
  account: string;
}
export type CanisterId = Principal;
export interface SendICPTsRequest {
  to: AccountIdentifier;
  amount: { e8s: E8s };
  memo: bigint;
  fee: { e8s: E8s };
  from_subaccount: number[][];
  created_at_time: Array<{ timestamp_nanos: bigint }>;
}
export interface NotifyCanisterRequest {
  to_canister: CanisterId;
  block_height: BlockHeight;
  to_subaccount: number[][];
  from_subaccount: number[][];
  max_fee: { e8s: E8s };
}
export interface ICP {
  e8s: BigInt;
}
export interface AccountBalanceArgsT {
  account: Array<number>;
}
export type Result_1 = { Ok: bigint } | { Err: ApproveError };
export interface AllowanceArgs {
  account: Icrc1Account;
  spender: Icrc1Account;
}
export interface Allowance {
  allowance: bigint;
  expires_at: Array<bigint>;
}

export default interface Service {
  account_balance_dfx(
    request: GetBalancesRequest
  ): Promise<Record<AccountIdentifier, E8s>>;
  send_dfx(request: SendICPTsRequest): Promise<BlockHeight>;
  notify_dfx(request: NotifyCanisterRequest): Promise<Uint8Array>;
  account_balance(request: AccountBalanceArgsT): Promise<ICP>;
  icrc2_approve(approveArgs: ApproveArgs): Promise<Result_1>;
  icrc2_allowance(allowanceArgs: AllowanceArgs): Promise<Allowance>;
  icrc2_transfer_from(res: any): Promise<any>;
}
