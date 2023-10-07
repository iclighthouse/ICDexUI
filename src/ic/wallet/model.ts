import { Principal } from '@dfinity/principal';
import { WalletResultCreate } from '@/ic/ICLighthouse/model';

export interface AddressEntry {
  id: Principal;
  kind: Kind;
  name: [] | [string];
  role: Role;
}
export type Role =
  | { Custodian: null }
  | { Contact: null }
  | { Controller: null };
export type Kind = { User: null } | { Canister: null } | { Unknown: null };
export interface CreateCanisterArgs {
  cycles: bigint;
  settings: CanisterSettings;
}
export interface CanisterSettings {
  controller: Array<Principal>;
  controllers: Array<Array<Principal>>,
  freezing_threshold: Array<number>;
  memory_allocation: Array<number>;
  compute_allocation: Array<number>;
}
export interface WalletSendRequest {
  canister: Principal;
  amount: bigint;
}
export type ResultSend = { Ok: null } | { Err: string };
export type ResultCall = { Ok: { return: Array<number> } } | { Err: string };
export interface WalletCallRequest {
  args: Array<number>;
  cycles: bigint;
  method_name: string;
  canister: Principal;
}
export type WalletEventsRequest = Array<{
  to: Array<number>;
  from: Array<number>;
}>;
export interface WalletEvent {
  id: number;
  kind: EventKind;
  timestamp: bigint;
}
export type EventKind =
  | { CyclesReceived: { from: Principal; amount: bigint } }
  | { CanisterCreated: { cycles: bigint; canister: Principal } }
  | {
      CanisterCalled: {
        cycles: bigint;
        method_name: string;
        canister: Principal;
      };
    }
  | { CyclesSent: { to: Principal; amount: bigint; refund: bigint } }
  | { AddressRemoved: { id: Principal } }
  | { WalletDeployed: { canister: Principal } }
  | { AddressAdded: { id: Principal; name: Array<string>; role: Role } };

export type EventType =
  | 'CyclesReceived'
  | 'CanisterCreated'
  | 'CanisterCalled'
  | 'CyclesSent'
  | 'AddressRemoved'
  | 'WalletDeployed'
  | 'AddressAdded';

export default interface Service {
  'wallet_balance'(): Promise<{ amount: bigint }>;
  'list_addresses'(): Promise<Array<AddressEntry>>;
  'wallet_create_wallet'(
    request: CreateCanisterArgs
  ): Promise<WalletResultCreate>;
  'wallet_send'(request: WalletSendRequest): Promise<ResultSend>;
  'wallet_call'(request: WalletCallRequest): Promise<ResultCall>;
  'get_events'(request: WalletEventsRequest): Promise<Array<WalletEvent>>;
  name(): Promise<Array<string>>;
  'set_name'(walletName: string): Promise<void>;
  'get_controllers'(): Promise<Array<Principal>>;
  'add_controller'(principal: Principal): Promise<void>;
  'remove_controller'(principal: Principal): Promise<ResultSend>;
}
