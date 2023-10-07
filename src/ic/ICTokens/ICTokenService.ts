import { Principal } from '@dfinity/principal';
import ICTokenIDL from './ICToken.did';
import { IC_TOKEN_CANISTER_ID } from '@/ic/utils';
import { buildService } from '../Service';
import Service, { InitArgs, TokenItem, TokenStatus } from '@/ic/ICTokens/model';
import { checkAuth } from '@/ic/CheckAuth';
import store from '@/store';
import { createPlugActor } from '@/ic/createPlugActor';
import { createIcxActor } from '@/ic/createIcxActor';
import { createInfinityActor } from '@/ic/createInfinityActor';
import { SerializableIC } from '@/ic/converter';

export class ICTokenService {
  private service: Service;
  // private readonly host: string;
  // constructor(identity: Identity, host?: string) {
  //   this.host = host;
  //   this.service = buildService(
  //     identity,
  //     ICTokenIDL,
  //     IC_TOKEN_CANISTER_ID,
  //     host
  //   );
  // }
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew);
    }
    if (!isUpdate) {
      this.service = buildService(null, ICTokenIDL, IC_TOKEN_CANISTER_ID);
    } else if ((window as any).icx) {
      this.service = await createIcxActor(ICTokenIDL, IC_TOKEN_CANISTER_ID);
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor(ICTokenIDL, IC_TOKEN_CANISTER_ID);
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor(
        ICTokenIDL,
        IC_TOKEN_CANISTER_ID
      );
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        ICTokenIDL,
        IC_TOKEN_CANISTER_ID
      );
    }
  };
  public create = async (request: InitArgs): Promise<Principal> => {
    await this.check();
    const res = await this.service.create(request);
    if (res && res.length) {
      return res[0];
    }
  };
  public getTokenList = async (
    size: number,
    page: number
  ): Promise<Array<TokenItem>> => {
    await this.check(false, false);
    const res = await this.service.getTokenList(size, page);
    return SerializableIC(res);
  };
  public getTokens = async (tokenId: Principal): Promise<Array<Principal>> => {
    await this.check(false, false);
    return await this.service.getTokens(tokenId);
  };
  public tokenStatus = async (tokenId: Principal): Promise<TokenStatus> => {
    await this.check(false, false);
    const res = await this.service.tokenStatus(tokenId);
    return SerializableIC(res);
  };
  public modifyControllers = async (
    token: Principal,
    controllers: Array<Principal>
  ): Promise<boolean> => {
    await this.check();
    return await this.service.modifyControllers(token, controllers);
  };
  public getStarTokens = async (
    user: Principal
  ): Promise<Array<Array<Principal>>> => {
    await this.check(false, false);
    return await this.service.getStarTokens(user);
  };
  public cancelStar = async (tokenId: Principal): Promise<boolean> => {
    await this.check();
    return await this.service.cancelStar(tokenId);
  };
  public modifyOwner = async (
    tokenId: Principal,
    newOwner: Principal
  ): Promise<boolean> => {
    await this.check();
    return await this.service.modifyOwner(tokenId, newOwner);
  };
  public deleteToken = async (
    tokenId: Principal,
    delFromList = true
  ): Promise<boolean> => {
    await this.check();
    return await this.service.deleteToken(tokenId, delFromList);
  };
  public update = async (
    tokenId: Principal,
    initArgs: InitArgs
  ): Promise<void> => {
    await this.check();
    return await this.service.update(tokenId, initArgs);
  };
}
