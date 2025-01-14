import Service, {
  GetProposalPayloadResponse
} from '@/ic/governance/nnsDappModel';
import { buildService } from '@/ic/Service';
import { NNS_DAPP_CANISTER_ID } from '@/ic/utils';
import IDL from './nnsDapp.did';
export class nnsDappService {
  private service: Service;
  private check = async (): Promise<void> => {
    this.service = await buildService(null, IDL, NNS_DAPP_CANISTER_ID);
  };
  public getProposalPayload = async (proposalId: bigint): Promise<GetProposalPayloadResponse> => {
    await this.check();
    try {
      return await this.service.get_proposal_payload(proposalId);
    } catch (e) {
      return null;
    }
  };
}
