import Service from '@/ic/quests/model';
import { Principal } from '@dfinity/principal';
import questsIDL from '@/ic/quests/quests.did';
import { QUESTS_CANISTER_ID } from '@/ic/utils';
import { createService } from '@/ic/createService';
export class questsService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await createService<Service>(
      QUESTS_CANISTER_ID,
      questsIDL,
      renew,
      isUpdate
    );
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
