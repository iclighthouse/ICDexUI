import { Principal } from '@dfinity/principal';
import Service, {
  AddressBookItem,
  EthConnectItem,
  ManageWalletResponse,
  Result,
  CreateCyclesWalletArgs,
  WalletResultCreate,
  Message,
  Operation,
  TokenItem,
  MetaMaskInfo
} from '@/ic/ICLighthouse/model';
import ICLighthouseIDL from '@/ic/ICLighthouse/ICLighthouse.did';
import { IC_CANISTER_ID } from '@/ic/utils';
import { hexToBytes, SerializableIC } from '@/ic/converter';
import { createService } from '@/ic/createService';

export class ICLighthouseService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await createService<Service>(
      IC_CANISTER_ID,
      ICLighthouseIDL,
      renew,
      isUpdate
    );
  };
  public getAddressBookItems = async (): Promise<AddressBookItem[]> => {
    await this.check(false);
    const res = await this.service.getAddressBookItems();
    return SerializableIC(res);
  };
  public getEthConnectItems = async (): Promise<EthConnectItem[]> => {
    await this.check(false);
    const res = await this.service.getEthConnectItems();
    return SerializableIC(res);
  };
  public manageAddressBook = async (
    address: string,
    encrypt: string,
    operation: Operation
  ): Promise<Result> => {
    await this.check();
    const res = await this.service.manageAddressBook(
      address,
      encrypt,
      operation
    );
    return SerializableIC(res);
  };
  public manageEthConnect = async (
    ethAddress: string,
    signCode: string,
    operation: Operation
  ): Promise<boolean> => {
    await this.check();
    return await this.service.manageEthConnect(ethAddress, signCode, operation);
  };
  public getWallets = async (): Promise<ManageWalletResponse[]> => {
    await this.check(false);
    const res = await this.service.getWallets();
    return SerializableIC(res);
  };
  public manageWallet = async (
    walletId: Principal,
    operation: Operation
  ): Promise<boolean> => {
    await this.check();
    return await this.service.manageWallet(walletId, operation);
  };
  public createCyclesWallet = async (
    request: CreateCyclesWalletArgs
  ): Promise<WalletResultCreate> => {
    await this.check();
    const res = await this.service.createCyclesWallet(request);
    return SerializableIC(res);
  };
  public getNotice = async (): Promise<Message> => {
    await this.check(false);
    const res = await this.service.getMessage();
    return SerializableIC(res);
  };
  public getTokens = async (): Promise<Array<TokenItem>> => {
    await this.check(false);
    const res = await this.service.getTokens();
    return SerializableIC(res);
  };
  public getMetaMask = async (
    ethAccount: string
  ): Promise<Array<MetaMaskInfo>> => {
    const account = hexToBytes(ethAccount);
    await this.check(false);
    const res = await this.service.getMetaMask(account);
    return SerializableIC(res);
  };
  public addMetaMask = async (
    ethAccount: string,
    mnemonic: string
  ): Promise<void> => {
    const account = hexToBytes(ethAccount);
    await this.check(false);
    return await this.service.addMetaMask(account, mnemonic);
  };
  public addToken = async (
    tokenId: Principal,
    symbol: string,
    name: string,
    decimals: number,
    standard: string,
    operation: Operation
  ): Promise<boolean> => {
    await this.check();
    return await this.service.manageToken(
      tokenId,
      symbol,
      name,
      decimals,
      standard,
      operation
    );
  };
  public getFavorites = async (): Promise<Array<Principal>> => {
    await this.check();
    try {
      return await this.service.getFavorites();
    } catch (e) {
      console.error(e);
      return [];
    }
  };
  public addFavorites = async (pairId: Principal): Promise<void> => {
    await this.check();
    try {
      return await this.service.addFavorites(pairId);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public removeFavorites = async (pairId: Principal): Promise<boolean> => {
    await this.check();
    try {
      return await this.service.removeFavorites(pairId);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
