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
import { buildService } from '../Service';
import { checkAuth } from '@/ic/CheckAuth';
import store from '@/store';
import { Principal } from '@dfinity/principal';
import { createPlugActor } from '@/ic/createPlugActor';
import { createIcxActor } from '@/ic/createIcxActor';
import { createInfinityActor } from '@/ic/createInfinityActor';
import { SerializableIC } from '@/ic/converter';

export class WalletService {
  private service: Service;
  // private readonly host: string;
  // private readonly canisterId: string;
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew, canisterId);
    }
    if (!isUpdate) {
      this.service = buildService(null, walletIDL, canisterId);
    } else if ((window as any).icx) {
      this.service = await createIcxActor(walletIDL, canisterId);
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor<Service>(walletIDL, canisterId);
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor<Service>(walletIDL, canisterId);
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        walletIDL,
        canisterId
      );
    }
    return this.service;
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
