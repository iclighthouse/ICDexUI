import Service from '@/ic/MEAccount/model';
import { checkAuth } from '@/ic/CheckAuth';
import { createIcxActor } from '@/ic/createIcxActor';
import { createPlugActor } from '@/ic/createPlugActor';
import { buildService } from '@/ic/Service';
import store from '@/store';
import IDL from './MEAccount.did';
import { Address } from '@/ic/DRC20Token/model';
import { ME_ACCOUNT_CANISTER_ID } from '@/ic/utils';
import { createInfinityActor } from '@/ic/createInfinityActor';

export class AstroXUserService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew);
    }
    if (!isUpdate) {
      this.service = buildService(null, IDL, 'rrkah-fqaaa-aaaaa-aaaaq-cai');
    } else if ((window as any).icx) {
      this.service = await createIcxActor(IDL, ME_ACCOUNT_CANISTER_ID);
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor(IDL, ME_ACCOUNT_CANISTER_ID);
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor(IDL, ME_ACCOUNT_CANISTER_ID);
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        IDL,
        'rrkah-fqaaa-aaaaa-aaaaq-cai'
      );
    }
  };
  public pushUser = async (
    address: Address,
    principalString: string
  ): Promise<string> => {
    await this.check();
    return await this.service.pushUser(address, principalString);
  };
}
