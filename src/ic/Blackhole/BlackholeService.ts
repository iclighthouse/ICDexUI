import Service, { CanisterStatus } from '@/ic/Blackhole/model';
import { createService } from '@/ic/createService';
import ICTokenIDL from './Blackhole.did';
import { BLACKHOLE_CANISTER_ID } from '@/ic/utils';
import { Principal } from '@dfinity/principal';

export class BlackholeService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await createService<Service>(
      BLACKHOLE_CANISTER_ID,
      ICTokenIDL,
      renew,
      isUpdate
    );
  };
  public canister_status = async (res: {
    canister_id: Principal;
  }): Promise<CanisterStatus> => {
    await this.check(false, false);
    return await this.service.canister_status(res);
  };
}
