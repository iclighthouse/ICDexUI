import { createService } from '@/ic/createService';
import SNSRootIDL from './SNSRoot.did';
import Service, {
  GetSnsCanistersSummaryRequest,
  GetSnsCanistersSummaryResponse,
  ListSnsCanistersResponse
} from '@/ic/SNSRoot/model';
import { SerializableIC } from '@/ic/converter';
export class SNSRootService {
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    return await createService<Service>(
      canisterId,
      SNSRootIDL,
      renew,
      isUpdate
    );
  };
  public list_sns_canisters = async (
    canisterId: string
  ): Promise<ListSnsCanistersResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.list_sns_canisters({});
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public get_sns_canisters_summary = async (
    canisterId: string,
    getSnsCanistersSummaryRequest: GetSnsCanistersSummaryRequest = {
      update_canister_list: [false]
    }
  ): Promise<GetSnsCanistersSummaryResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.get_sns_canisters_summary(
        getSnsCanistersSummaryRequest
      );
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
}
