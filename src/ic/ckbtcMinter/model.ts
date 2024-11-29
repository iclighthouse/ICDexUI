import { Icrc1Account, Time } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';
export interface RetrieveBtcArgs {
  address: string;
  amount: bigint;
}
export type RetrieveBtcRes = { Ok: RetrieveBtcOk } | { Err: RetrieveBtcError };
export interface RetrieveBtcOk {
  block_index: bigint;
}
export type RetrieveBtcError =
  | { MalformedAddress: string }
  | { GenericError: { error_message: string; error_code: bigint } }
  | { TemporarilyUnavailable: string }
  | { AlreadyProcessing: null }
  | { AmountTooLow: bigint }
  | { InsufficientFunds: { balance: bigint } };
export type RetrieveBtcStatus =
  | { Signing: null }
  | { Confirmed: { txid: Uint8Array } }
  | { Sending: { txid: Uint8Array } }
  | { AmountTooLow: null }
  | { Unknown: null }
  | { Pending: null }
  | { Submitted: { txid: Uint8Array } };
export type UpdateBalanceRes =
  | { Ok: UpdateBalanceResult }
  | { Ok: Array<UtxoStatus> }
  | { Err: UpdateBalanceError };
export type UtxoStatus =
  | {
      ValueTooSmall: Utxo;
    }
  | { Tainted: Utxo }
  | { Checked: Utxo }
  | { Minted: { block_index: bigint; minted_amount: bigint; utxo: Utxo } };
export interface Utxo {
  outpoint: { txid: Uint8Array; vout: bigint };
  value: bigint;
  height: bigint;
}
export interface UpdateBalanceResult {
  block_index: bigint;
  amount: bigint;
}
export type UpdateBalanceError =
  | {
      GenericError: { error_message: string; error_code: bigint };
    }
  | { TemporarilyUnavailable: string }
  | { AlreadyProcessing: null }
  | { NoNewUtxos: null }
  | {
      NoNewUtxos: {
        required_confirmations: bigint;
        current_confirmations: Array<bigint>;
      };
    };
export type Subaccount = Array<Uint8Array>;
export interface MinterInfo {
  btcFee: bigint;
  minVisitInterval: bigint;
  btcRetrieveFee: bigint;
  btcMintFee: bigint;
  btcNetwork: Network;
  icBTCFee: bigint;
  version: string;
  icBTC: Principal;
  btcMinAmount: bigint;
  minter_address: string;
  enDebug: boolean;
  minConfirmations: bigint;
  paused: boolean;
}
export type Network =
  | { Mainnet: null }
  | {
      Regtest: null;
    }
  | {
      Testnet: null;
    };
export interface RetrieveStatus {
  txIndex: bigint;
  account: Icrc1Account;
  btcAddress: string;
  burnedBlockIndex: bigint;
  amount: bigint;
  retrieveAccount: Icrc1Account;
}
export type BTCAddressReq =
  | {
      owner: Principal;
      subaccount: Array<Uint8Array>;
    }
  | {
      owner: Array<Principal>;
      subaccount: Array<Uint8Array>;
    };
export type WithdrawalAccountReq = BTCAddressReq;
export type BlockIndex = { block_index: bigint };
export interface icBTCEvents {
  total: bigint;
  data: Array<[bigint, [icBTCEvent, Time]]>;
  totalPage: bigint;
}
export type icBTCEvent =
  | {
      received_utxos: {
        deposit_address: string;
        total_fee: bigint;
        to_account: Icrc1Account;
        utxos: Array<Utxo>;
        amount: bigint;
      };
    }
  | {
      sent_transaction: {
        change_output: [] | [{ value: bigint; vout: number }];
        txid: string;
        address: string;
        account: Icrc1Account;
        utxos: Array<Utxo>;
        requests: BigUint64Array | bigint[];
        retrieveAccount: Icrc1Account;
      };
    }
  | {
      burn: {
        toid: [] | [bigint];
        icTokenCanisterId: Principal;
        address: string;
        account: Icrc1Account;
        amount: bigint;
        tokenBlockIndex: bigint;
      };
    }
  | {
      mint: {
        toid: [] | [bigint];
        icTokenCanisterId: Principal;
        address: string;
        account: Icrc1Account;
        amount: bigint;
      };
    }
  | {
      send: {
        to: Icrc1Account;
        toid: [] | [bigint];
        icTokenCanisterId: Principal;
        amount: bigint;
      };
    }
  | { changeOwner: { newOwner: Principal } }
  | {
      accepted_retrieve_btc_request: {
        txi: bigint;
        icrc1_burned_txid: bigint;
        total_fee: bigint;
        address: string;
        account: Icrc1Account;
        amount: bigint;
      };
    }
  | { start: { message: [] | [string] } }
  | { initOrUpgrade: { initArgs: InitArgs } }
  | {
      config: {
        setting:
          | {
              upgradeTokenWasm: {
                icTokenCanisterId: Principal;
                version: string;
                symbol: string;
              };
            }
          | { setTokenWasm: { size: bigint; version: string } };
      };
    }
  | { suspend: { message: [] | [string] } };
export interface InitArgs {
  fixed_fee: bigint;
  retrieve_btc_min_amount: bigint;
  dex_pair: [] | [Principal];
  min_confirmations: [] | [number];
}
export default interface Service {
  get_btc_address(request: BTCAddressReq): Promise<string>;
  get_withdrawal_account(request?: WithdrawalAccountReq): Promise<Icrc1Account>;
  retrieve_btc(
    retrieveBtcArgs: RetrieveBtcArgs,
    sa?: Array<Array<number>>
  ): Promise<RetrieveBtcRes>;
  retrieve_btc_status(request: BlockIndex): Promise<RetrieveBtcStatus>;
  update_balance(request: BTCAddressReq): Promise<UpdateBalanceRes>;
  batch_send(request: Array<bigint>): Promise<boolean>;
  get_minter_info(): Promise<MinterInfo>;
  retrieval_log(blockIndex: Array<number>): Promise<Array<RetrieveStatus>>;
  estimate_withdrawal_fee(request: {
    amount: Array<bigint>;
  }): Promise<{ minter_fee: bigint; bitcoin_fee: bigint }>;
  get_events(page: [bigint], size: [bigint]): Promise<icBTCEvents>;
}
