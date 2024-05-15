import { AccountId, Icrc1Account, Time } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';

export interface RoundInfo {
  data: Array<RoundDataResponse>;
  round: bigint;
}
export interface RoundDataResponse {
  status: RoundDataStatus;
  createdTime: Time;
  config: RoundConfig;
  points: {
    accountPointsForLM: Array<[AccountId, bigint]>;
    accountPointsForTM: Array<[AccountId, bigint]>;
    totalPointsForLM: bigint;
    totalPointsForTM: bigint;
    pointsUpdatedTime: Time;
  };
  settlement: Array<{
    lm: Array<[AccountId, bigint]>;
    tm: Array<[AccountId, bigint]>;
  }>;
}

export type RoundDataStatus =
  | {
      Closed: null;
    }
  | {
      Active: null;
    }
  | {
      Settling: null;
    }
  | {};
export interface RoundConfig {
  startTime: Time;
  content: string;
  endTime: Time;
  supplyForLM: bigint;
  supplyForTM: bigint;
  pairs: { all: null } | { whitelist: Array<PairId> };
  pairFilter: {
    blackList: Array<PairId>;
    minPairScore: bigint;
  };
  preMiningDataFactorPercent: bigint;
}
export type PairId = Principal;
export interface AccountData {
  roundStatus: RoundDataStatus;
  round: bigint;
  points: { lm: bigint; tm: bigint };
  settlement: Array<{ lm: bigint; tm: bigint }>;
}
export interface RoundPointsForLM {
  total: bigint;
  data: Array<[AccountId, bigint]>;
  page: bigint;
  totalPage: bigint;
}

export default interface Service {
  getRound(roundId: Array<bigint>): Promise<RoundInfo>;
  getAccelerationRate(accountId: AccountId): Promise<string>;
  getAccountData(
    roundId: Array<bigint>,
    accountId: AccountId
  ): Promise<AccountData>;
  getRoundPointsForLM(roundId: bigint, page: bigint): Promise<RoundPointsForLM>;
  getRoundPointsForTM(roundId: bigint, page: bigint): Promise<RoundPointsForLM>;
  getRoundSettlementsForLM(
    roundId: bigint,
    page: bigint
  ): Promise<RoundPointsForLM>;
  getRoundSettlementsForTM(
    roundId: bigint,
    page: bigint
  ): Promise<RoundPointsForLM>;
  getBalance(
    accountId: AccountId
  ): Promise<{ locked: bigint; available: bigint }>;
  claim(account: Icrc1Account): Promise<{ Ok: bigint } | { Err: string }>;
}
