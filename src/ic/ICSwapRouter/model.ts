import { TokenId, TokenSymbol, TokenStd, Time, Txid } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';
import { TokenLiquidity } from '@/ic/ICSwap/model';
import { BalanceChange, CompResult, Stats } from '@/ic/ICDex/model';
import { NFT } from '@/ic/ICDexRouter/model';
import { TokenIdentifier } from '@/ic/nft/model';
export type DexName = string;
export type SwapTokenInfo = [TokenId, TokenSymbol, TokenStd];
export interface TrieList {
  total: bigint;
  totalPage: bigint;
  data: Array<PairsData>;
}
export type PairsData = TrieListData1 | TrieListData;
export interface SwapPairInfo {
  feeRate: string;
  token0: SwapTokenInfo;
  token1: SwapTokenInfo;
  dexName: DexName;
  canisterId: SwapCanister;
}
export interface TrieListData1SwapPair {
  startingOverG1?: Array<Time>;
  updatedTime?: Time;
  score1?: bigint;
  score2?: bigint;
  score3?: bigint;
  startingBelowG2?: Array<Time>;
  startingBelowG4?: Array<Time>;
  createdTime?: Time;
  marketBoard?: MarketBoard;
  pair: SwapPairInfo;
}
export type TrieListData1 = [SwapCanister, TrieListData1SwapPair];
export type TrieListData = [SwapCanister, [SwapPair, bigint]];
export type SwapCanister = Principal;
export interface SwapPair {
  feeRate: string;
  token0: SwapTokenInfo;
  token1: SwapTokenInfo;
  dexName: DexName;
  canisterId: SwapCanister;
  startingOverG1?: Array<Time>;
  updatedTime?: Time;
  score1?: bigint;
  score2?: bigint;
  score3?: bigint;
  startingBelowG2?: Array<Time>;
  startingBelowG4?: Array<Time>;
  createdTime?: Time;
  marketBoard?: MarketBoard;
}
export type Pairs = [SwapCanister, [SwapPair, bigint]];
export interface PairRequest {
  token0: SwapTokenInfo;
  token1: SwapTokenInfo;
  dexName: string;
}
export type PairResponse = [SwapCanister, boolean];
export interface PairsTrieList {
  total: bigint;
  totalPage: bigint;
  data: Array<PairTrie>;
}
export type PairTrie = [SwapCanister, PairTrieResponse, TVL?, Stats?];
export type MarketBoard =
  | {
      STAGE0: null;
    }
  | {
      STAGE1: null;
    }
  | {
      STAGE2: null;
    };
export type TVL = string;
export interface PairTrieResponse {
  pair: SwapPair;
  sponsored: boolean;
  liquidity: Array<TokenLiquidity>;
  score: bigint;
  listingReferrers: ListingReferrers;
  createdTime?: Time;
  marketBoard?: Array<MarketBoard>;
}
export type ListingReferrers = Array<[ListingReferrer, Time, string]>;
export interface ListingReferrer {
  end: Time[];
  verified: boolean;
  referrer: Principal;
  name: string;
  start: Time;
  nftId: string;
}
export type Valid = boolean;
export type Verified = boolean;
export interface TrieList_2 {
  total: bigint;
  data: Array<CompetitionsData>;
  totalPage: bigint;
}
export type CompetitionsData = [SwapCanister, CompetitionsDataInfo];
export interface CompetitionsDataInfo {
  end: Time;
  name: string;
  pair: PairResponse1;
  start: Time;
  round: bigint;
  canRegister?: boolean;
  competitionInfo?: CompResult;
}
export interface PairResponse1 {
  pair: SwapPair__1;
  sponsored: boolean;
  liquidity: Array<TokenLiquidity>;
  score: bigint;
  listingReferrers: Array<[ListingReferrer, Time]>;
}
export interface SwapPair__1 {
  feeRate: string;
  token0: TokenInfo;
  token1: TokenInfo;
  dexName: DexName;
  canisterId: SwapCanister;
}
export type TokenInfo = [Principal, TokenSymbol, TokenStd];
export interface DexCompetitionResponse {
  end: Time;
  content: string;
  name: string;
  start: Time;
  pairs: Array<[string, SwapPair__1, { token0: null } | { token1: null }]>;
  hostedDex: string;
}
export interface TraderData {
  startTime: Time;
  total: Array<[TraderStats, string]>;
  endTime: Array<Time>;
  data: Array<TraderStats>;
  pair: SwapCanister;
  dexName: string;
  quoteToken: { token0: null } | { token1: null };
}
export interface TraderStats {
  pnl: string;
  vol: bigint;
  trades: Array<FilledTrade>;
  count: bigint;
  time: Time;
  avgPrice: string;
  capital: string;
  position: bigint;
}
export interface FilledTrade {
  time: Time;
  token0Value: BalanceChange;
  counterparty: Txid;
  token1Value: BalanceChange;
}
export interface SwapConfig {
  BLACKHOLE: Principal;
  SYS_TOKEN: Principal;
  SCORE_G1: bigint;
  SCORE_G2: bigint;
  SCORE_G3: bigint;
  SCORE_G4: bigint;
  ORACLE: Principal;
}
export type StakedNFT = [string, TokenIdentifier, Time];
export default interface Service {
  getTokens(dexName: Array<DexName>): Promise<Array<SwapTokenInfo>>;
  getPairs(
    dexName: Array<DexName>,
    page: Array<number>,
    size: Array<number>
  ): Promise<TrieList>;
  getPairsByToken(
    tokenId: TokenId,
    dexName: Array<DexName>
  ): Promise<Array<Pairs>>;
  route(
    tokenId: TokenId,
    token1Id: TokenId,
    dexName: Array<DexName>
  ): Promise<Array<Pairs>>;
  create(pairRequest: PairRequest): Promise<PairResponse>;
  getPairs2(
    dexName: Array<DexName>,
    lr: Array<Principal>,
    page: Array<number>,
    size: Array<number>
  ): Promise<PairsTrieList>;
  listingReferrer(referrer: Principal): Promise<[Valid, Verified]>;
  setListingReferrerByNft(name: string, nftId: string): Promise<void>;
  getCompetitions(
    dexName: Array<DexName>,
    page: Array<number>,
    size: Array<number>
  ): Promise<TrieList_2>;
  getDexCompetitionRound(): Promise<bigint>;
  getDexCompetition(round: bigint): Promise<Array<DexCompetitionResponse>>;
  getDexCompetitionTrader(
    round: bigint,
    address: string
  ): Promise<Array<Array<TraderData>>>;
  registerDexCompetition(subaccount: Array<Array<number>>): Promise<boolean>;
  getConfig(): Promise<SwapConfig>;
  NFTBalance(address: string): Promise<Array<NFT>>;
  NFTDeposit(
    principal: Principal,
    tokenIdentifier: string,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  NFTWithdraw(
    tokenIdentifier: Array<TokenIdentifier>,
    subaccount: Array<Array<number>>
  ): Promise<void>;
  NFTStaked(address: string): Promise<Array<StakedNFT>>;
  propose(pairCanisterId: Principal): Promise<void>;
  getPairListingReferrers(
    pairCanisterId: Principal
  ): Promise<[boolean, ListingReferrers]>;
  debugPairs(): Promise<Array<{ dev: Principal; pair: Principal }>>;
}
