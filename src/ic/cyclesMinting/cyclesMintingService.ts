import Service from './model';
import IDL from './cyclesMinting.did.js';
import { buildService } from '../Service';
import { CYCLES_MINTING_CANISTER_ID } from '@/ic/utils';
import { createIcxActor } from '@/ic/createIcxActor';
import { createPlugActor } from '@/ic/createPlugActor';
const CYCLES_PER_XDR = BigInt(1_000_000_000_000);

export class CyclesMintingService {
  private service: Service;
  // private readonly host: string;
  // constructor(identity: Identity, host?: string) {
  //   this.host = host;
  //   this.service = buildService(
  //     identity,
  //     IDL,
  //     CYCLES_MINTING_CANISTER_ID,
  //     host
  //   );
  // }
  private check = async (): Promise<void> => {
    // await checkAuth();
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if ((window as any).icx) {
      this.service = buildService(null, IDL, CYCLES_MINTING_CANISTER_ID);
      // this.service = await createIcxActor(IDL, CYCLES_MINTING_CANISTER_ID);
    } else if (priList[principal] === 'Plug') {
      this.service = buildService(null, IDL, CYCLES_MINTING_CANISTER_ID);
      // this.service = await createPlugActor(IDL, CYCLES_MINTING_CANISTER_ID);
    } else if (priList[principal] === 'Infinity') {
      this.service = buildService(null, IDL, CYCLES_MINTING_CANISTER_ID);
    }else {
      this.service = buildService(null, IDL, CYCLES_MINTING_CANISTER_ID);
    }
  };
  public getIcpToCyclesConversionRate = async (): Promise<bigint> => {
    await this.check();
    const response = await this.service.get_icp_xdr_conversion_rate();
    // TODO validate the certificate in the response
    return (
      (response.data.xdr_permyriad_per_icp * CYCLES_PER_XDR) / BigInt(10_000)
    );
  };
}
