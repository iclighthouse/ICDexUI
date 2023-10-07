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
import { checkAuth } from '@/ic/CheckAuth';
import { IC_SWAP_ROUTER_CANISTER_ID } from '@/ic/utils';
import ICSwapRouterIDL from './ICSwapRouter.did';
import { buildService } from '@/ic/Service';
import store from '@/store';
import { TokenId } from '@/ic/common/icType';
import { createPlugActor } from '@/ic/createPlugActor';
import { createIcxActor } from '@/ic/createIcxActor';
import { createInfinityActor } from '@/ic/createInfinityActor';
import { Principal } from '@dfinity/principal';
import { SerializableIC } from '@/ic/converter';

export class ICSwapRouterService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew);
    }
    if (!isUpdate) {
      this.service = buildService(
        null,
        ICSwapRouterIDL,
        IC_SWAP_ROUTER_CANISTER_ID
      );
    } else if ((window as any).icx) {
      this.service = await createIcxActor(
        ICSwapRouterIDL,
        IC_SWAP_ROUTER_CANISTER_ID
      );
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor(
        ICSwapRouterIDL,
        IC_SWAP_ROUTER_CANISTER_ID
      );
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor(
        ICSwapRouterIDL,
        IC_SWAP_ROUTER_CANISTER_ID
      );
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        ICSwapRouterIDL,
        IC_SWAP_ROUTER_CANISTER_ID
      );
    }
  };
  public getTokens = async (
    dexName: Array<DexName> = []
  ): Promise<Array<SwapTokenInfo>> => {
    await this.check(false, false);
    const res = await this.service.getTokens(dexName);
    return SerializableIC(res);
  };
  public getPairs = async (
    dexName: Array<DexName> = [],
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<TrieList> => {
    await this.check(false, false);
    const res = await this.service.getPairs(dexName, page, size);
    return SerializableIC(res);
  };
  public getPairsByToken = async (
    tokenId: TokenId,
    dexName: Array<DexName> = []
  ): Promise<Array<Pairs>> => {
    await this.check(false, false);
    const res = await this.service.getPairsByToken(tokenId, dexName);
    return SerializableIC(res);
  };
  public route = async (
    tokenId: TokenId,
    token1Id: TokenId,
    dexName: Array<DexName> = []
  ): Promise<Array<Pairs>> => {
    await this.check(false, false);
    const res = await this.service.route(tokenId, token1Id, dexName);
    return SerializableIC(res);
  };
  public create = async (pairRequest: PairRequest): Promise<PairResponse> => {
    await this.check();
    const res = await this.service.create(pairRequest);
    return SerializableIC(res);
  };
  public getPairs2 = async (
    dexName: Array<DexName>,
    lr: Array<Principal> = [],
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<PairsTrieList> => {
    await this.check();
    const res = await this.service.getPairs2(dexName, lr, page, size);
    return SerializableIC(res);
  };
  public listingReferrer = async (
    referrer: Principal
  ): Promise<[Valid, Verified]> => {
    await this.check();
    const res = await this.service.listingReferrer(referrer);
    return SerializableIC(res);
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
      const res = await this.service.getCompetitions(dexName, page, size);
      return SerializableIC(res);
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
      const res = await this.service.getDexCompetition(round);
      return SerializableIC(res);
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
      const res = await this.service.getDexCompetitionTrader(round, address);
      return SerializableIC(res);
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
