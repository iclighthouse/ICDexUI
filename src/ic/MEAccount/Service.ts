import Service from '@/ic/MEAccount/model';
import IDL from './MEAccount.did';
import { Address } from '@/ic/DRC20Token/model';
import { ME_ACCOUNT_CANISTER_ID } from '@/ic/utils';
import { createService } from '@/ic/createService';
export class AstroXUserService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await createService<Service>(
      ME_ACCOUNT_CANISTER_ID,
      IDL,
      renew,
      isUpdate
    );
  };
  public pushUser = async (
    address: Address,
    principalString: string
  ): Promise<string> => {
    await this.check();
    return await this.service.pushUser(address, principalString);
  };
}
