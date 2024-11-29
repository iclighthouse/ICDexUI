import { Principal } from '@dfinity/principal';

export interface IcpXdrConversionRateCertifiedResponse {
  certificate: Array<number>;
  data: IcpXdrConversionRate;
  hash_tree: Array<number>;
}
export interface IcpXdrConversionRate {
  xdr_permyriad_per_icp: bigint;
  timestamp_seconds: bigint;
}
export interface NotifyTopUpArg {
  block_index: bigint;
  canister_id: Principal;
}
export type NotifyTopUpResult = { Ok: Cycles } | { Err: NotifyError };
export type Cycles = bigint;
export type NotifyError =
  | {
      Refunded: { block_index: [] | [bigint]; reason: string };
    }
  | { InvalidTransaction: string }
  | { Other: { error_message: string; error_code: bigint } }
  | { Processing: null }
  | { TransactionTooOld: bigint };
export default interface Service {
  get_icp_xdr_conversion_rate: () => Promise<IcpXdrConversionRateCertifiedResponse>;
  notify_top_up: (notifyTopUpArg: NotifyTopUpArg) => Promise<NotifyTopUpResult>;
}
