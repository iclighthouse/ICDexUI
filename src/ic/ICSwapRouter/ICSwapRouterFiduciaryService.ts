import Service, {
  DexCompetitionResponse,
  DexName,
  ListingReferrers,
  PairRequest,
  PairResponse,
  Pairs,
  PairsTrieList,
  StakedNFT,
  SwapConfig,
  SwapTokenInfo,
  TraderData,
  TrieList,
  TrieList_2,
  Valid,
  Verified
} from '@/ic/ICSwapRouter/model';
import { IC_SWAP_ROUTER_CANISTER_ID_Fiduciary } from '@/ic/utils';
import ICSwapRouterIDL from './ICSwapRouterFiduciary.did';
import { TokenId } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';
import { createService } from '@/ic/createService';
import { NFT } from '@/ic/ICDexRouter/model';
import { fromSubAccountId } from '@/ic/converter';
import { TokenIdentifier } from '@/ic/nft/model';

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
    await this.check(false, false);
    return await this.service.getPairs2(dexName, lr, page, size);
  };
  public listingReferrer = async (
    referrer: Principal
  ): Promise<[Valid, Verified]> => {
    await this.check();
    return await this.service.listingReferrer(referrer);
  };
  public setListingReferrerByNft = async (
    name: string,
    nftId: string
  ): Promise<void> => {
    await this.check();
    return await this.service.setListingReferrerByNft(name, nftId);
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
      console.log(e);
      return null;
    }
  };
  public getDexCompetitionRound = async (): Promise<bigint> => {
    await this.check();
    try {
      return await this.service.getDexCompetitionRound();
    } catch (e) {
      console.log(e);
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
      console.log(e);
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
      console.log(e);
      return null;
    }
  };
  public registerDexCompetition = async (): Promise<boolean> => {
    await this.check();
    const subAccount = [[]];
    try {
      return await this.service.registerDexCompetition(subAccount);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getConfig = async (): Promise<SwapConfig> => {
    await this.check(false, false);
    try {
      return await this.service.getConfig();
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public NFTBalance = async (address: string): Promise<Array<NFT>> => {
    await this.check(false, false);
    try {
      return await this.service.NFTBalance(address);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public NFTDeposit = async (
    principal: Principal,
    tokenIdentifier: string,
    subaccountId = 0
  ): Promise<boolean> => {
    await this.check(false, true);
    try {
      let subAccount = [];
      if (subaccountId !== 0) {
        subAccount = [fromSubAccountId(subaccountId)];
      }
      await this.service.NFTDeposit(principal, tokenIdentifier, subAccount);
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public NFTWithdraw = async (
    tokenIdentifier: Array<TokenIdentifier>,
    subaccountId = 0
  ): Promise<void> => {
    await this.check();
    try {
      let subAccount = [[]];
      if (subaccountId || subaccountId === 0) {
        subAccount = [fromSubAccountId(subaccountId)];
      }
      return await this.service.NFTWithdraw(tokenIdentifier, subAccount);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public NFTStaked = async (address: string): Promise<Array<StakedNFT>> => {
    await this.check(false, true);
    try {
      return await this.service.NFTStaked(address);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public propose = async (pairCanisterId: Principal): Promise<void> => {
    await this.check();
    try {
      return await this.service.propose(pairCanisterId);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getPairListingReferrers = async (
    pairCanisterId: Principal
  ): Promise<[boolean, ListingReferrers]> => {
    await this.check(false, false);
    try {
      return await this.service.getPairListingReferrers(pairCanisterId);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public debugPairs = async (): Promise<Array<{ dev: Principal; pair: Principal }>> => {
    await this.check(false, false);
    try {
      return await this.service.debugPairs();
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
