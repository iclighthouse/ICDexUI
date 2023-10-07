import Service, { DeployedSns } from '@/ic/SNSWasm/model';
import { buildService } from '@/ic/Service';
import { SNS_WASM_CANISTER_ID } from '@/ic/utils';
import SNSWasmIDL from './SNSWasm.did';
import { checkAuth } from '@/ic/CheckAuth';
import { createIcxActor } from '@/ic/createIcxActor';
import { createPlugActor } from '@/ic/createPlugActor';
import { createInfinityActor } from '@/ic/createInfinityActor';
import store from '@/store';
import { SerializableIC } from '@/ic/converter';

export class SNSWasmService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew);
    }
    if (!isUpdate) {
      this.service = buildService(null, SNSWasmIDL, SNS_WASM_CANISTER_ID);
    } else if ((window as any).icx) {
      this.service = await createIcxActor(SNSWasmIDL, SNS_WASM_CANISTER_ID);
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor(SNSWasmIDL, SNS_WASM_CANISTER_ID);
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor(SNSWasmIDL, SNS_WASM_CANISTER_ID);
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        SNSWasmIDL,
        SNS_WASM_CANISTER_ID
      );
    }
  };
  public listDeployedSnses = async (): Promise<Array<DeployedSns>> => {
    await this.check(false, false);
    try {
      const res = await this.service.list_deployed_snses({});
      if (res) {
        return SerializableIC(res.instances);
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  };
}
