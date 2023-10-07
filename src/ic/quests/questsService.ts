import Service from '@/ic/quests/model';
import { Principal } from '@dfinity/principal';
import { checkAuth } from '@/ic/CheckAuth';
import { buildService } from '@/ic/Service';
import questsIDL from '@/ic/quests/quests.did';
import { QUESTS_CANISTER_ID } from '@/ic/utils';
import { createIcxActor } from '@/ic/createIcxActor';
import { createPlugActor } from '@/ic/createPlugActor';
import { createInfinityActor } from '@/ic/createInfinityActor';
import store from '@/store';

export class questsService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew);
    }
    if (!isUpdate) {
      this.service = buildService(null, questsIDL, QUESTS_CANISTER_ID);
    } else if ((window as any).icx) {
      this.service = await createIcxActor(questsIDL, QUESTS_CANISTER_ID);
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor(questsIDL, QUESTS_CANISTER_ID);
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor(questsIDL, QUESTS_CANISTER_ID);
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        questsIDL,
        QUESTS_CANISTER_ID
      );
    }
  };
  public putEvent = async (
    event: string,
    principal: Principal,
    text: Array<string> = []
  ): Promise<string> => {
    await this.check();
    return this.service.putEvent(event, principal, text);
  };
}
