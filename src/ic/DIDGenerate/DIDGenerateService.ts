import Service from '@/ic/DIDGenerate/model';
import DIDGenerateIDL from './DIDGenerate.did';
import { buildService } from '@/ic/Service';
import { DID_CANISTER_ID } from '@/ic/utils';

export class DIDGenerateService {
  private service: Service;
  // constructor () {
  //   this.service = buildService(null, DIDGenerateIDL, DID_CANISTER_ID);
  // }
  private check = async (): Promise<void> => {
    this.service = await buildService(null, DIDGenerateIDL, DID_CANISTER_ID);
  };
  public binding = async (
    prog: string,
    lang: string
  ): Promise<Array<string>> => {
    try {
      await this.check();
      return await this.service.binding(prog, lang);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public did_to_js = async (prog: string): Promise<Array<string>> => {
    try {
      await this.check();
      return await this.service.did_to_js(prog);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
