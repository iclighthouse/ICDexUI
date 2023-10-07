import Service, { TokenItem } from '@/ic/ICTokensScan/model';
import { Identity } from '@dfinity/agent';
import { buildService } from '@/ic/Service';
import ICTokensScanIDL from './ICTokensScan.did';
import { IC_TOKENS_SCAN_CANISTER_ID } from '@/ic/utils';
import { SerializableIC } from '@/ic/converter';

export class ICTokensScanService {
  private service: Service;
  constructor(identity?: Identity, host?: string) {
    this.service = buildService(
      identity,
      ICTokensScanIDL,
      IC_TOKENS_SCAN_CANISTER_ID,
      host
    );
  }
  public getTokenList = async (): Promise<Array<TokenItem>> => {
    const res = await this.service.getTokenList();
    return SerializableIC(res);
  };
}
