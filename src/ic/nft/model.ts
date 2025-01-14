import { Principal } from '@dfinity/principal';
import { Amount } from '@/ic/ICSwap/model';
export type AccountIdentifier = string;
export type TokenIdentifier = string;
export type TokenIndex = bigint;
export type Time = bigint;
export interface Listing {
  locked: Array<Time>;
  seller: Principal;
  price: bigint;
}
export type CommonError =
  | {
      InvalidToken: TokenIdentifier;
    }
  | {
      Other: string;
    };
export type TokensExt = Array<TokenExt>;
export type TokenExt = [TokenIndex, Array<Listing>, Array<Array<number>>];
export type ExtResult =
  | {
      ok: TokensExt;
    }
  | {
      err: CommonError;
    };
export interface TransferNFTRequest {
  to: User;
  token: TokenIdentifier;
  notify: boolean;
  from: User;
  memo: Memo;
  subaccount: Array<Array<number>>;
  amount: Amount;
}
export type TransferNFTResponse =
  | { ok: Amount }
  | { err: TransferNFTResponseErr };
export type TransferNFTResponseErr =
  | { CannotNotify: AccountIdentifier }
  | { InsufficientBalance: null }
  | { InvalidToken: TokenIdentifier }
  | { Rejected: null }
  | {
      Unauthorized: AccountIdentifier;
    }
  | {
      Other: string;
    };
export type Memo = Array<number>;
export type User = { principal: Principal } | { address: AccountIdentifier };
export interface ApproveRequest {
  token: TokenIdentifier;
  subaccount: Array<Array<number>>;
  allowance: bigint;
  spender: Principal;
}
export interface AllowanceRequest {
  token: TokenIdentifier;
  owner: User;
  spender: Principal;
}
export type AllowanceResponse = { ok: bigint } | { err: CommonError };
export default interface Service {
  tokens_ext(request: AccountIdentifier): Promise<ExtResult>;
  transfer(transferRequest: TransferNFTRequest): Promise<TransferNFTResponse>;
  approve(approveRequest: ApproveRequest): Promise<boolean>;
  allowance(allowanceRequest: AllowanceRequest): Promise<AllowanceResponse>;
}
