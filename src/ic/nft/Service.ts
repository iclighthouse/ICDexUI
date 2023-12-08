import Service, {
  AllowanceRequest,
  AllowanceResponse,
  ApproveRequest,
  ExtResult,
  TransferNFTRequest,
  TransferNFTResponse
} from '@/ic/nft/model';
import { Principal } from '@dfinity/principal';
import nftIDL from '@/ic/nft/erc721.did';
import { NFT_CANISTER_ID } from '@/ic/utils';
import { principalToAccountIdentifier, SerializableIC } from '@/ic/converter';
import { createService } from '@/ic/createService';

export class NftService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await createService<Service>(
      NFT_CANISTER_ID,
      nftIDL,
      renew,
      isUpdate
    );
  };
  public tokens_ext = async (): Promise<ExtResult> => {
    await this.check(false, false);
    const principal = localStorage.getItem('principal');
    const account = principalToAccountIdentifier(Principal.fromText(principal));
    const res = await this.service.tokens_ext(account);
    return SerializableIC(res);
  };
  public transfer = async (
    transferRequest: TransferNFTRequest
  ): Promise<TransferNFTResponse> => {
    await this.check();
    const res = await this.service.transfer(transferRequest);
    return SerializableIC(res);
  };
  public approve = async (approveRequest: ApproveRequest): Promise<boolean> => {
    await this.check();
    return await this.service.approve(approveRequest);
  };
  public allowance = async (
    allowanceRequest: AllowanceRequest
  ): Promise<AllowanceResponse> => {
    await this.check(false, false);
    const res = await this.service.allowance(allowanceRequest);
    return SerializableIC(res);
  };
}
