import { Principal } from '@dfinity/principal';
import { Address } from '@/ic/DRC20Token/model';
import { TokenIdentifier, User } from '@/ic/nft/model';
export type Time = bigint;
export interface PhaseConfig {
  end: Time;
  interval: bigint;
  halving: bigint;
  totalLimit: bigint;
  start: Time;
  supply: bigint;
  minCycles: bigint;
  accountLimit: bigint;
}
export interface MiningStatusResponse {
  phaseTotalSupply: bigint;
  currentPhase: bigint;
  currentRound: bigint;
  roundStatus: RoundStatus;
  phaseTotalCyclesReceived: bigint;
  totalSupply: bigint;
  phaseStatus: Status;
  totalCyclesReceived: bigint;
}
export interface RoundStatus {
  status: Status;
  isSettled: boolean;
  cyclesReceived: bigint;
  supply: bigint;
}
export type Status = { opening: null } | { stopped: null } | { prepared: null };
export interface RoundUserStatus {
  mintTime: Time;
  mintTxid: Array<Array<number>>;
  cycles: bigint;
  mintAmount: bigint;
}
export type TaskTotalMinted = bigint;
export type TaskTotalSupply = bigint;
export interface TradingMining {
  max: bigint;
  title: string;
  content: string;
  nftFactor: bigint;
  end1: Time;
  end2: Time;
  start: Time;
  pairs: Array<TradingMiningPairs>;
  ratio: bigint;
}
export type TradingMiningPairs = [PairId, Weight];
export type PairId = Principal;
export type Weight = bigint;
export type TradingMiningStatus = [
  [[VolStart, VolEnd, Mined, MiningStatus]],
  boolean
];
export type VolStart = bigint;
export type VolEnd = bigint;
export type Mined = bigint;
export type MiningStatus =
  | {
      Error: null;
    }
  | {
      Active: null;
    }
  | {
      Finished: null;
    };
export type TmNFTBalance = Array<[User, TokenIdentifier, bigint]>;
export default interface Service {
  configLog(phase: bigint): Promise<PhaseConfig>;
  status(): Promise<MiningStatusResponse>;
  userHistory(
    user: Principal,
    phase: bigint,
    round: bigint
  ): Promise<Array<RoundUserStatus>>;
  history(phase: bigint, round: bigint): Promise<Array<RoundStatus>>;
  whitelistOn(): Promise<boolean>;
  checkWhitelist(user: Principal): Promise<boolean>;
  settle(): Promise<boolean>;
  cfTaskMining(): Promise<boolean>;
  cwTaskMining(): Promise<boolean>;
  updateStatus(): Promise<boolean>;
  getTaskTotalMinted(): Promise<[TaskTotalMinted, TaskTotalSupply]>;
  cwTaskCompleted(user: Principal): Promise<boolean>;
  cfTaskCompleted(user: Principal): Promise<boolean>;
  isPaused(): Promise<boolean>;
  tm_setting(): Promise<TradingMining>;
  tm_status(address: Address): Promise<TradingMiningStatus>;
  tm_NFTBalance(address: Address): Promise<TmNFTBalance>;
  tm_register(
    tokenIdentifier: TokenIdentifier,
    subAccount: Array<Array<number>>
  ): Promise<boolean>;
  tm_register2(subAccount: Array<Array<number>>): Promise<boolean>;
  tm_claim(subAccount: Array<Array<number>>): Promise<Array<bigint>>;
  tm_NFTWithdraw(subAccount: Array<Array<number>>): Promise<void>;
  btcTaskMining(): Promise<boolean>;
  btcTaskCompleted(user: Principal): Promise<boolean>;
}
