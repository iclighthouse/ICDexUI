import { Icrc1Account, Time } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal/lib/cjs';

export type EthAddress = string;
export type DepositRes = { Ok: DepositResult } | { Err: ResultError };
export interface DepositResult {
  txIndex: TxIndex;
  toid: bigint;
  blockIndex: bigint;
  amount: bigint;
}
export type TxIndex = bigint;
export type ResultError = {
  GenericError: { code: bigint; message: string };
};
export interface TxStatus {
  to: EthAddress;
  tx: Array<Transaction>;
  fee: { gasPrice: Wei; maxFee: Wei; gasLimit: bigint };
  status: Status;
  toids: Array<bigint>;
  tokenId: EthAddress;
  receipt: Array<string>;
  from: EthAddress;
  kytRequestId: Array<KytRequestId>;
  signedTx: Array<[Array<number>, Array<number>]>;
  nonce: Array<Nonce>;
  account: Icrc1Account;
  txHash: Array<TxHash>;
  txType: { Withdraw: null } | { Deposit: null } | { DepositGas: null };
  amount: Wei;
  rawTx: Array<[Array<number>, Array<number>]>;
  rpcRequestId: Array<RpcId>;
  txIndex?: bigint;
  block_height?: number;
}
export type KytRequestId = bigint;
export type RpcId = bigint;
export type TxHash = string;
export type Nonce = bigint;
export type Status =
  | {
      Signing: null;
    }
  | {
      Building: null;
    }
  | {
      Confirmed: null;
    }
  | {
      Sending: null;
    }
  | {
      Unknown: null;
    }
  | {
      Submitted: null;
    }
  | {
      Failure: null;
    }
  | {
      Pending: null;
    };
export type Wei = bigint;
export interface Transaction {
  EIP1559: Transaction1559;
  EIP2930: Transaction2930;
  Legacy: TransactionLegacy;
}
export interface TransactionLegacy {
  to: Array<number>;
  value: Array<number>;
  data: Array<number>;
  sign: Array<Signature>;
  chain_id: bigint;
  nonce: Array<number>;
  gas_limit: Array<number>;
  gas_price: Array<number>;
}
export interface Transaction2930 {
  to: Array<number>;
  value: Array<number>;
  data: Array<number>;
  sign: Array<Signature>;
  chain_id: bigint;
  nonce: Array<number>;
  gas_limit: Array<number>;
  access_list: Array<AccessList>;
  gas_price: Array<number>;
}
export interface Transaction1559 {
  to: Array<number>;
  value: Array<number>;
  max_priority_fee_per_gas: Array<number>;
  data: Array<number>;
  sign: Array<Signature>;
  max_fee_per_gas: Array<number>;
  chain_id: bigint;
  nonce: Array<number>;
  gas_limit: Array<number>;
  access_list: Array<AccessList>;
}
export interface AccessList {
  storage_keys: Array<Array<number>>;
  address: Array<number>;
}
export interface Signature {
  r: Array<number>;
  s: Array<number>;
  v: bigint;
  from: Array<Array<number>>;
  hash: Array<number>;
}
export type ETHUpdateRes =
  | {
      Ok: UpdateBalanceResult;
    }
  | { Err: ResultError };
export interface UpdateBalanceResult {
  txIndex: TxIndex;
  toid: bigint;
  blockIndex: bigint;
  amount: bigint;
}
export type RetrieveRes = { Ok: RetrieveResult; Err: ResultError };
export interface RetrieveResult {
  txIndex: TxIndex;
  toid: bigint;
  blockIndex: bigint;
  amount: Wei;
  retrieveFee: Wei;
}
export interface RetrieveStatus {
  ethAddress?: EthAddress;
  txIndex: TxIndex;
  account?: Icrc1Account;
  burnedBlockIndex?: bigint;
  amount: bigint;
  retrieveAccount?: Icrc1Account;
  status?: Status;
  txHash?: Array<string>;
  time?: number;
}
export type BlockHeight = bigint;

export interface MinterInfo {
  gasPrice: Wei;
  owner: Principal;
  depositMethod: number;
  isDebug: boolean;
  syncBlockNumber: BlockHeight;
  version: string;
  address: EthAddress;
  chainId: bigint;
  minConfirmations: bigint;
  paused: boolean;
  pendingRetrievals: bigint;
  minRpcConfirmations: bigint;
  pendingDeposits: bigint;
  decimals: number;
  totalRetrievalAmount: Wei;
  totalMintingAmount: Wei;
  countMinting: bigint;
  symbol: string;
  blockSlot: bigint;
  network: string;
}
export interface IcTokenInfo {
  fee: {
    fixedFee: Wei;
    ethRatio: Wei;
    gasLimit: bigint;
  };
  std: { ETH: null } | { ERC20: null };
  decimals: number;
  dexPrice: Array<[string, Time]>;
  tokenId: EthAddress;
  minAmount: Wei;
  totalSupply: Array<Wei>;
  ckLedgerId: Principal;
  ckSymbol: string;
  symbol: string;
  dexPair: Array<Principal>;
  tokenFee?: bigint;
}
export type RetrievingToken = { all: null } | { eth: null } | { token: string };
export type ckETHEvent =
  | {
      depositGas: DepositGas;
    }
  | {
      withdraw: Withdraw;
    }
  | {
      keeper: Keeper;
    }
  | {
      depositResult: EventDepositResult;
    }
  | {
      burn: Burn;
    }
  | {
      init: EventInit;
    }
  | {
      mint: EventMint;
    }
  | {
      coverTransaction: CoverTransaction;
    }
  | {
      changeOwner: ChangeOwner;
    }
  | {
      deposit: EventDeposit;
    }
  | {
      start: {};
    }
  | {
      withdrawResult: WithdrawResult;
    }
  | {
      depositGasResult: DepositGasResult;
    }
  | {
      config: EventConfig;
    }
  | {
      suspend: {};
    }
  | {
      claimDeposit: ClaimDeposit;
    }
  | {
      claimDepositResult: ClaimDepositResult;
    };
export type ClaimDepositResult =
  | {
      ok: {
        token: EthAddress;
        signature: string;
        from: EthAddress;
        account: Icrc1Account;
        txHash: TxHash;
        amount: Wei;
      };
    }
  | {
      err: {
        signature: string;
        error: string;
        account: Icrc1Account;
        txHash: TxHash;
      };
    };
export interface ClaimDeposit {
  signature: string;
  account: Icrc1Account;
  txHash: TxHash;
}
export interface EventConfig {
  setting:
    | {
        upgradeTokenWasm: {
          icTokenCanisterId: Principal;
          version: string;
          symbol: string;
        };
      }
    | {
        setToken: {
          token: EthAddress;
          info: IcTokenInfo;
        };
      }
    | {
        depositMethod: number;
      }
    | {
        updateRpc: {
          keeper: Icrc1Account;
          operation:
            | {
                set: { Available: null } | { Unavailable: null };
              }
            | {
                remove: null;
              };
        };
      }
    | {
        minRpcConfirmations: number;
      }
    | {
        launchToken: {
          token: EthAddress;
          icTokenCanisterId: Principal;
          symbol: string;
        };
      }
    | {
        setKeeper: {
          url: string;
          status:
            | {
                Disabled: null;
              }
            | {
                Normal: null;
              };
          name: string;
          account: Icrc1Account;
        };
      }
    | {
        dependents: {
          rpcTool: Principal;
          utilsTool: Principal;
        };
      }
    | {
        setTokenWasm: { size: bigint; version: string };
      }
    | {
        minConfirmations: bigint;
      };
}
export type DepositGasResult =
  | {
      ok: {
        token: EthAddress;
        txIndex: TxIndex;
        txid: Array<TxHash>;
        account: Icrc1Account;
        amount: Wei;
      };
    }
  | {
      err: {
        token: EthAddress;
        txIndex: TxIndex;
        account: Icrc1Account;
        amount: Wei;
      };
    };
export type WithdrawResult =
  | {
      ok: {
        token: EthAddress;
        txIndex: TxIndex;
        txid: Array<TxHash>;
        account: Icrc1Account;
        amount: Wei;
      };
    }
  | {
      err: {
        token: EthAddress;
        txIndex: TxIndex;
        txid: Array<TxHash>;
        account: Icrc1Account;
        amount: Wei;
      };
    };
export interface EventDeposit {
  token: EthAddress;
  txIndex: TxIndex;
  toid: bigint;
  address: EthAddress;
  account: Icrc1Account;
  amount: Wei;
}
export interface ChangeOwner {
  newOwner: Principal;
}
export interface CoverTransaction {
  txIndex: TxIndex;
  preTxid: Array<TxHash>;
  toid: bigint;
  updateTx: Array<UpdateTxArgs>;
  account: Icrc1Account;
}
export interface UpdateTxArgs {
  ts: Array<Time>;
  tx: Array<Transaction>;
  fee: Array<{ gasPrice: Wei; maxFee: Wei; gasLimit: bigint }>;
  status: Array<Status>;
  toids: Array<Array<bigint>>;
  receipt: Array<string>;
  kytRequestId: Array<KytRequestId>;
  signedTx: Array<[Array<number>, Array<number>]>;
  nonce: Array<Nonce>;
  txHash: Array<TxHash>;
  rpcRequestId: Array<RpcRequestId>;
  amount: Array<Wei>;
  rawTx: Array<[Array<number>, Array<number>]>;
}
export type RpcRequestId = bigint;
export interface EventMint {
  toid: bigint;
  icTokenCanisterId: Principal;
  account: Icrc1Account;
  amount: Wei;
}
export interface EventInit {
  initArgs: InitArgs;
}
export interface InitArgs {
  rpc_canister_id: Principal;
  rpc_confirmations: bigint;
  utils_canister_id: Principal;
  deposit_method: number;
  min_confirmations: Array<bigint>;
}
export interface Burn {
  icTokenCanisterId: Principal;
  address: EthAddress;
  account: Icrc1Account;
  amount: Wei;
  tokenBlockIndex: bigint;
}
export type EventDepositResult =
  | {
      ok: {
        token: EthAddress;
        txIndex: TxIndex;
        txid: Array<TxHash>;
        account: Icrc1Account;
        amount: Wei;
      };
    }
  | {
      err: {
        token: EthAddress;
        txIndex: TxIndex;
        txid: Array<TxHash>;
        account: Icrc1Account;
        amount: Wei;
      };
    };
export interface Keeper {
  operation: {
    setRpc: {
      keeper: Icrc1Account;
      operation:
        | { put: [string, { Available: null } | { Unavailable: null }] }
        | { remove: null };
    };
  };
}
export interface Withdraw {
  token: EthAddress;
  txIndex: TxIndex;
  toid: bigint;
  address: EthAddress;
  account: Icrc1Account;
  amount: Wei;
}
export interface DepositGas {
  txIndex: TxIndex;
  toid: bigint;
  address: EthAddress;
  account: Icrc1Account;
  amount: Wei;
}
export type ClaimRes =
  | {
      Ok: BlockHeight;
    }
  | { Err: ResultError };
export type PendingDepositTxn = [
  TxHash,
  Icrc1Account,
  Array<number>,
  boolean,
  BlockHeight
];
export interface DepositTxn {
  status: Status;
  signature: Array<number>;
  claimingTime: Time;
  confirmedTime: Array<Time>;
  error: Array<string>;
  account: Icrc1Account;
  txHash: TxHash;
  transfer: Array<TokenTxn>;
}
export interface TokenTxn {
  to: EthAddress;
  token: EthAddress;
  value: Wei;
  from: EthAddress;
}
export interface ETHEvent {
  timestamp: bigint;
  payload: EventPayload;
}
export type EventPayload =
  | {
      SentTransaction: { transaction_hash: string; withdrawal_id: bigint };
    }
  | {
      Upgrade: UpgradeArg;
    }
  | { Init: InitArg }
  | {
      SyncedToBlock: { block_number: bigint };
    }
  | {
      AcceptedDeposit: {
        principal: Principal;
        transaction_hash: string;
        value: string;
        log_index: bigint;
        block_number: bigint;
        from_address: string;
      };
    }
  | {
      SignedTx: { withdrawal_id: bigint; raw_tx: string };
    }
  | {
      MintedCkEth: { event_source: EventSource; mint_block_index: bigint };
    }
  | {
      InvalidDeposit: {
        event_source: EventSource;
        reason: string;
      };
    }
  | {
      AcceptedEthWithdrawalRequest: {
        ledger_burn_index: bigint;
        destination: string;
        withdrawal_amount: bigint;
      };
    }
  | {
      FinalizedTransaction: {
        transaction_hash: string;
        withdrawal_id: bigint;
      };
    };

export interface EventSource {
  transaction_hash: string;
  log_index: bigint;
}
export interface InitArg {
  ethereum_network: EthereumNetwork;
}
export type EthereumNetwork =
  | {
      Mainnet: null;
    }
  | { Sepolia: null };
export interface UpgradeArg {
  next_transaction_nonce: Array<bigint>;
  ethereum_contract_address: Array<string>;
  minimum_withdrawal_amount: Array<string>;
  ethereum_block_height: Array<BlockTag>;
}
export type BlockTag =
  | {
      Safe: null;
    }
  | { Finalized: null }
  | { Latest: null };
export interface WithdrawalArg {
  recipient: string;
  amount: bigint;
}
export type WithdrawalResponse =
  | {
      Ok: RetrieveEthRequest;
    }
  | { Err: WithdrawalError };
export interface RetrieveEthRequest {
  block_index: bigint;
}
export type WithdrawalError =
  | { TemporarilyUnavailable: string }
  | { InsufficientAllowance: { allowance: bigint } }
  | { AmountTooLow: { min_withdrawal_amount: bigint } }
  | { InsufficientFunds: { balance: bigint } };
export type RetrieveEthStatus =
  | {
      TxSigned: { transaction_hash: string };
    }
  | { NotFound: null }
  | { TxConfirmed: { transaction_hash: string } }
  | { TxSent: { transaction_hash: string } }
  | { TxCreated: null }
  | { Pending: null };

export default interface Service {
  get_deposit_address(request: Icrc1Account): Promise<string>;
  get_minter_address(): Promise<[string, BigInt]>;
  get_tx(txIndex: TxIndex): Promise<Array<TxStatus>>;
  update_balance(
    tokenId: Array<string>,
    account: Icrc1Account
  ): Promise<ETHUpdateRes>;
  get_withdrawal_account(account: Icrc1Account): Promise<Icrc1Account>;
  retrieve(
    tokenId: Array<string>,
    ethAddress: string,
    amount: bigint,
    subAccount: Array<Array<number>>
  ): Promise<RetrieveRes>;
  get_retrieval_list(account: Icrc1Account): Promise<Array<RetrieveStatus>>;
  get_retrieval(txIndex: TxIndex): Promise<Array<RetrieveStatus>>;
  cover_tx(
    txIndex: TxIndex,
    subAccount: Array<Array<number>>
  ): Promise<Array<BlockHeight>>;
  update_retrievals(): Promise<Array<[TxStatus, bigint]>>;
  get_minter_info(): Promise<MinterInfo>;
  get_ck_tokens(): Promise<Array<[EthAddress, IcTokenInfo]>>;
  get_depositing(
    tokenId: Array<string>,
    account: Icrc1Account
  ): Promise<[Wei, Array<TxIndex>]>;
  get_depositing_all(
    token: RetrievingToken,
    account: Array<Icrc1Account>
  ): Promise<Array<[Wei, Array<TxIndex>, Array<TxStatus>]>>;
  get_retrieving_all(
    token: RetrievingToken,
    account: Array<Icrc1Account>
  ): Promise<Array<[TxIndex, TxStatus, Time]>>;
  get_account_events(
    account: Array<number>
  ): Promise<Array<[ckETHEvent, Time]>>;
  claim(
    account: Icrc1Account,
    txHash: string,
    signature: Array<number>
  ): Promise<ClaimRes>;
  get_mode2_pending_deposit_txn(
    txHash: string
  ): Promise<Array<PendingDepositTxn>>;
  update_claims(): Promise<void>;
  get_mode2_pending_all(
    token: RetrievingToken,
    account: Array<Icrc1Account>
  ): Promise<Array<[DepositTxn, Time, boolean]>>;
  smart_contract_address(): Promise<string>;
  get_events(request: {
    start: bigint;
    length: bigint;
  }): Promise<{ total_event_count: bigint; events: Array<ETHEvent> }>;
  withdraw_eth(withdrawalArg: WithdrawalArg): Promise<WithdrawalResponse>;
  retrieve_eth_status(blockIndex: bigint): Promise<RetrieveEthStatus>;
}
