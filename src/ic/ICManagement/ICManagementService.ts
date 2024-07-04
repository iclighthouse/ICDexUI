import { Principal } from '@dfinity/principal';
import { Actor } from '@dfinity/agent';
import Service from '@/ic/ICManagement/model';
import { buildService, transform } from '@/ic/Service';
import ICManagementIDL from '@/ic/ICManagement/ICManagement.did';
import { IC_MANAGEMENT_CANISTER_ID } from '@/ic/utils';
import { UpdateSettingsRequest } from '@/ic/ICManagement/model';
import { TokenStatus } from '@/ic/ICTokens/model';
import { checkAuth } from '@/ic/CheckAuth';
import store from '@/store';
import { createIcxActor } from '@/ic/createIcxActor';
import { SerializableIC } from '@/ic/converter';

export class ICManagementService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew);
    }
    if (!isUpdate) {
      this.service = buildService(
        null,
        ICManagementIDL,
        IC_MANAGEMENT_CANISTER_ID
      );
    } else if ((window as any).icx) {
      this.service = await createIcxActor(
        ICManagementIDL,
        IC_MANAGEMENT_CANISTER_ID
      );
    } else if (priList[principal] === 'Plug') {
      this.service = Actor.createActor(ICManagementIDL, {
        agent: (window as any).ic.plug.agent,
        canisterId: IC_MANAGEMENT_CANISTER_ID,
        ...{
          callTransform: transform,
          queryTransform: transform
        }
      });
    } else if (priList[principal] === 'Infinity') {
      const Ic = (window as any).ic?.infinityWallet;
      this.service = await Ic.createActor({
        canisterId: IC_MANAGEMENT_CANISTER_ID,
        interfaceFactory: ICManagementIDL,
        callTransform: transform,
        queryTransform: transform
      });
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        ICManagementIDL,
        IC_MANAGEMENT_CANISTER_ID
      );
    }
  };
  public updateSettings = async (
    request: UpdateSettingsRequest
  ): Promise<void> => {
    await this.check();
    try {
      return await this.service.update_settings(request);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public canisterStatus = async (
    canisterId: Principal
  ): Promise<TokenStatus> => {
    await this.check(false);
    console.log(this.service);
    const status = await this.service.canister_status({
      canister_id: canisterId
    });
    status.canisterId = canisterId.toString();
    return SerializableIC(status);
  };
}
