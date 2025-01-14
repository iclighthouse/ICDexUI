import Service, { DeployedSns } from '@/ic/SNSWasm/model';
import { SNS_WASM_CANISTER_ID } from '@/ic/utils';
import SNSWasmIDL from './SNSWasm.did';
import { SerializableIC } from '@/ic/converter';
import { createService } from '@/ic/createService';
export class SNSWasmService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await createService<Service>(
      SNS_WASM_CANISTER_ID,
      SNSWasmIDL,
      renew,
      isUpdate
    );
  };
  public listDeployedSnses = async (): Promise<Array<DeployedSns>> => {
    await this.check(false, false);
    try {
      const res = await this.service.list_deployed_snses({});
      if (res) {
        return SerializableIC(res.instances);
      }
    } catch (e) {
      return [];
    }
  };
}
