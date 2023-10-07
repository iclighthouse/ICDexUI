import { Principal } from '@dfinity/principal';

export interface AddressBookItem {
  address: string;
  encrypt: string;
}
export interface EthConnectItem {
  ethAddress: string;
  relateTime: bigint;
  address: number[];
}
export interface ManageAddressBookRequest {
  address: string;
  encrypt: string;
  op: Operation;
}
export type Operation = { add: null } | { del: null } | { setDefault: null };
export interface Result {
  ok: boolean;
  err: string;
}
export interface ManageEthConnectRequest {
  ethAddress: string;
  signCode: string;
  op: Operation;
}
export interface ManageWalletResponse {
  address: string;
  walletId: Principal;
  isDefault: boolean;
  cycles?: string;
  name?: string;
}
export interface ManageWalletRequest {
  op: Operation;
  walletId: Principal;
}
export interface CanisterSettings {
  controller: Array<Principal>;
  freezing_threshold: Array<number>;
  controllers: Array<Array<Principal>>;
  memory_allocation: Array<number>;
  compute_allocation: Array<number>;
}
export interface CanisterId {
  canister_id: Principal;
}
export interface CanisterStatus {
  status: Status;
  memory_size: bigint;
  cycles: bigint;
  settings: CanisterSettings;
  module_hash: Array<Array<number>>;
}
export type Status = { stopped: null } | { stopping: null } | { running: null };
export interface CreateCyclesWalletArgs {
  txid: Array<number>;
  createCanisterArgs: CreateCanisterArgs;
  nonce: BigInt;
}
export interface CreateCanisterArgs {
  cycles: bigint;
  settings: CanisterSettings;
}
export type WalletResultCreate =
  | { Ok: { canister_id: Principal } }
  | { Err: string };
export interface Message {
  status: { always: null } | { oncetime: null };
  title: string;
  content: string;
  aliveTime: bigint;
}
export interface TokenItem {
  symbol: string;
  canisterId: Principal;
  standard: string;
  name: string;
  decimals: number | bigint;
}
export interface MetaMaskInfo {
  account: string;
  mnemonic: Array<string>;
}

export default interface Service {
  getAddressBookItems: () => Promise<AddressBookItem[]>;
  getEthConnectItems: () => Promise<EthConnectItem[]>;
  manageAddressBook: (
    address: string,
    encrypt: string,
    operation: Operation
  ) => Promise<Result>;
  manageEthConnect: (
    ethAddress: string,
    signCode: string,
    operation: Operation
  ) => Promise<boolean>;
  getWallets: () => Promise<ManageWalletResponse[]>;
  manageWallet: (walletId: Principal, operation: Operation) => Promise<boolean>;
  createCyclesWallet: (
    request: CreateCyclesWalletArgs
  ) => Promise<WalletResultCreate>;
  getMessage: () => Promise<Message>;
  manageToken: (
    tokenId: Principal,
    symbol: string,
    name: string,
    decimals: number,
    standard: string,
    operation: Operation
  ) => Promise<boolean>;
  getTokens: () => Promise<Array<TokenItem>>;
  getMetaMask: (EthAccount: Array<number>) => Promise<Array<MetaMaskInfo>>;
  addMetaMask: (EthAccount: Array<number>, mnemonic: string) => Promise<void>;
}
