import Service, {
  DexCompetitionResponse,
  DexName,
  PairRequest,
  PairResponse,
  Pairs,
  PairsTrieList,
  SwapTokenInfo,
  TraderData,
  TrieList,
  TrieList_2,
  Valid,
  Verified
} from '@/ic/ICSwapRouter/model';
import { IC_SWAP_ROUTER_CANISTER_ID_Fiduciary } from '@/ic/utils';
import ICSwapRouterIDL from './ICSwapRouter.did';
import { TokenId } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';
import { createService } from '@/ic/createService';

export class ICSwapRouterFiduciaryService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await createService<Service>(
      IC_SWAP_ROUTER_CANISTER_ID_Fiduciary,
      ICSwapRouterIDL,
      renew,
      isUpdate
    );
  };
  public getTokens = async (
    dexName: Array<DexName> = []
  ): Promise<Array<SwapTokenInfo>> => {
    await this.check(false, false);
    return await this.service.getTokens(dexName);
  };
  public getPairs = async (
    dexName: Array<DexName> = [],
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<TrieList> => {
    await this.check(false, false);
    return await this.service.getPairs(dexName, page, size);
  };
  public getPairsByToken = async (
    tokenId: TokenId,
    dexName: Array<DexName> = []
  ): Promise<Array<Pairs>> => {
    await this.check(false, false);
    return await this.service.getPairsByToken(tokenId, dexName);
  };
  public route = async (
    tokenId: TokenId,
    token1Id: TokenId,
    dexName: Array<DexName> = []
  ): Promise<Array<Pairs>> => {
    await this.check(false, false);
    return await this.service.route(tokenId, token1Id, dexName);
  };
  public create = async (pairRequest: PairRequest): Promise<PairResponse> => {
    await this.check();
    return await this.service.create(pairRequest);
  };
  public getPairs2 = async (
    dexName: Array<DexName>,
    lr: Array<Principal> = [],
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<PairsTrieList> => {
    await this.check();
    return await this.service.getPairs2(dexName, lr, page, size);
  };
  public listingReferrer = async (
    referrer: Principal
  ): Promise<[Valid, Verified]> => {
    await this.check();
    return await this.service.listingReferrer(referrer);
  };
  public setListingReferrerByNft = async (
    referrer: Principal,
    name: string,
    nftId: string,
    collection = 'ICLighthouse Planet Cards'
  ): Promise<void> => {
    await this.check();
    return await this.service.setListingReferrerByNft(
      referrer,
      name,
      nftId,
      collection
    );
  };
  public getCompetitions = async (
    dexName: Array<DexName>,
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<TrieList_2> => {
    await this.check();
    try {
      return await this.service.getCompetitions(dexName, page, size);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getDexCompetitionRound = async (): Promise<bigint> => {
    await this.check();
    try {
      return await this.service.getDexCompetitionRound();
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getDexCompetition = async (
    round: bigint
  ): Promise<Array<DexCompetitionResponse>> => {
    await this.check();
    try {
      return await this.service.getDexCompetition(round);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getDexCompetitionTrader = async (
    round: bigint,
    address: string
  ): Promise<Array<Array<TraderData>>> => {
    await this.check();
    try {
      return await this.service.getDexCompetitionTrader(round, address);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public registerDexCompetition = async (): Promise<boolean> => {
    await this.check();
    const subAccount = [[]];
    try {
      return await this.service.registerDexCompetition(subAccount);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
