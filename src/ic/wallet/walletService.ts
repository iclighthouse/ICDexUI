import walletIDL from './wallet.did';
import Service, {
  AddressEntry,
  CreateCanisterArgs,
  ResultCall,
  ResultSend,
  WalletCallRequest,
  WalletEvent,
  WalletEventsRequest,
  WalletSendRequest
} from './model';
import { WalletResultCreate } from '@/ic/ICLighthouse/model';
import { Principal } from '@dfinity/principal';
import { SerializableIC } from '@/ic/converter';
import { createService } from '@/ic/createService';

export class WalletService {
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    return await createService<Service>(canisterId, walletIDL, renew, isUpdate);
  };
  public getWalletBalance = async (
    canisterId: string
  ): Promise<{ amount: bigint }> => {
    const service = await this.check(canisterId, false);
    return await service.wallet_balance();
  };
  public getAddressesList = async (
    canisterId: string
  ): Promise<Array<AddressEntry>> => {
    const service = await this.check(canisterId);
    const res = await service.list_addresses();
    return SerializableIC(res);
  };
  public walletCreateWallet = async (
    request: CreateCanisterArgs,
    canisterId: string
  ): Promise<WalletResultCreate> => {
    const service = await this.check(canisterId);
    const res = await service.wallet_create_wallet(request);
    return SerializableIC(res);
  };
  public walletSend = async (
    request: WalletSendRequest,
    canisterId: string
  ): Promise<ResultSend> => {
    const service = await this.check(canisterId);
    const res = await service.wallet_send(request);
    return SerializableIC(res);
  };
  public walletCall = async (
    request: WalletCallRequest,
    canisterId: string
  ): Promise<ResultCall> => {
    const service = await this.check(canisterId);
    const res = await service.wallet_call(request);
    return SerializableIC(res);
  };
  public getEvents = async (
    canisterId: string,
    request: WalletEventsRequest = []
  ): Promise<Array<WalletEvent>> => {
    const service = await this.check(canisterId);
    const res = await service.get_events(request);
    return SerializableIC(res);
  };
  public getWalletName = async (canisterId: string): Promise<Array<string>> => {
    const service = await this.check(canisterId, false);
    return await service.name();
  };
  public setWalletName = async (
    canisterId: string,
    walletName: string
  ): Promise<void> => {
    const service = await this.check(canisterId);
    return await service.set_name(walletName);
  };
  public getControllers = async (
    canisterId: string
  ): Promise<Array<Principal>> => {
    const service = await this.check(canisterId, false);
    return await service.get_controllers();
  };
  public addControllers = async (
    canisterId: string,
    principal: Principal
  ): Promise<void> => {
    const service = await this.check(canisterId);
    return await service.add_controller(principal);
  };
  public removeControllers = async (
    canisterId: string,
    principal: Principal
  ): Promise<ResultSend> => {
    const service = await this.check(canisterId);
    const res = await service.remove_controller(principal);
    return SerializableIC(res);
  };
}
