import { Principal } from '@dfinity/principal';
import { AccountIdentifier, BlockHeight, E8s } from '../common/icType';
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

export default interface Service {
  'account_balance_dfx'(
    request: GetBalancesRequest
  ): Promise<Record<AccountIdentifier, E8s>>;
  'send_dfx'(request: SendICPTsRequest): Promise<BlockHeight>;
  'notify_dfx'(request: NotifyCanisterRequest): Promise<Uint8Array>;
  'account_balance'(request: AccountBalanceArgsT): Promise<ICP>;
}
