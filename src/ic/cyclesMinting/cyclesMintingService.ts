import Service, { NotifyTopUpArg, NotifyTopUpResult } from './model';
import IDL from './cyclesMinting.did.js';
import { buildService } from '../Service';
import { CYCLES_MINTING_CANISTER_ID } from '@/ic/utils';
const CYCLES_PER_XDR = BigInt(1_000_000_000_000);

export class CyclesMintingService {
  private service: Service;
  private check = async (): Promise<void> => {
    this.service = await buildService(null, IDL, CYCLES_MINTING_CANISTER_ID);
  };
  public getIcpToCyclesConversionRate = async (): Promise<bigint> => {
    await this.check();
    const response = await this.service.get_icp_xdr_conversion_rate();
    // TODO validate the certificate in the response
    return (
      (response.data.xdr_permyriad_per_icp * CYCLES_PER_XDR) / BigInt(10_000)
    );
  };
  public notify_top_up = async (
    notifyTopUpArg: NotifyTopUpArg
  ): Promise<NotifyTopUpResult> => {
    await this.check();
    return await this.service.notify_top_up(notifyTopUpArg);
  };
}
