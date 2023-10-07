import Service, {
  AllowanceRequest,
  AllowanceResponse,
  ApproveRequest,
  ExtResult,
  TransferNFTRequest,
  TransferNFTResponse
} from '@/ic/nft/model';
import { Principal } from '@dfinity/principal';
import { checkAuth } from '@/ic/CheckAuth';
import { createPlugActor } from '@/ic/createPlugActor';
import nftIDL from '@/ic/nft/erc721.did';
import { NFT_CANISTER_ID } from '@/ic/utils';
import { buildService } from '@/ic/Service';
import store from '@/store';
import { principalToAccountIdentifier, SerializableIC } from '@/ic/converter';
import { createIcxActor } from '@/ic/createIcxActor';
import { createInfinityActor } from '@/ic/createInfinityActor';

export class NftService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew);
    }
    if (!isUpdate) {
      this.service = buildService(null, nftIDL, NFT_CANISTER_ID);
    } else if ((window as any).icx) {
      this.service = await createIcxActor(nftIDL, NFT_CANISTER_ID);
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor(nftIDL, NFT_CANISTER_ID);
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor(nftIDL, NFT_CANISTER_ID);
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        nftIDL,
        NFT_CANISTER_ID
      );
    }
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
