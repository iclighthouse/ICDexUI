import { Principal } from '@dfinity/principal';
import Service from '@/ic/ICManagement/model';
import ICManagementIDL from '@/ic/ICManagement/ICManagement.did';
import { IC_MANAGEMENT_CANISTER_ID } from '@/ic/utils';
import { UpdateSettingsRequest } from '@/ic/ICManagement/model';
import { TokenStatus } from '@/ic/ICTokens/model';
import { SerializableIC } from '@/ic/converter';
import { createService } from '@/ic/createService';

export class ICManagementService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await createService<Service>(
      IC_MANAGEMENT_CANISTER_ID,
      ICManagementIDL,
      renew,
      isUpdate
    );
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
    const status = await this.service.canister_status({
      canister_id: canisterId
    });
    status.canisterId = canisterId.toString();
    return SerializableIC(status);
  };
}
