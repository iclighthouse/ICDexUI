import { Principal } from '@dfinity/principal';
import Service, {
  MiningStatusResponse,
  PhaseConfig,
  RoundUserStatus,
  RoundStatus,
  TaskTotalMinted,
  TaskTotalSupply,
  TradingMining,
  TradingMiningStatus,
  TmNFTBalance
} from '@/ic/icMining/model';
import IcMiningIDL from './icMining.did';
import { IC_MINING_CANISTER_ID, validatePrincipal } from '@/ic/utils';
import { Address } from '@/ic/DRC20Token/model';
import { principalToAccountIdentifier, SerializableIC } from '@/ic/converter';
import { TokenIdentifier } from '@/ic/nft/model';
import { createService } from '@/ic/createService';
export class IcMiningService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await createService<Service>(
      IC_MINING_CANISTER_ID,
      IcMiningIDL,
      renew,
      isUpdate
    );
  };
  public status = async (): Promise<MiningStatusResponse> => {
    await this.check(false, false);
    return await this.service.status();
  };
  public configLog = async (phase: bigint): Promise<PhaseConfig> => {
    await this.check(false, false);
    return await this.service.configLog(phase);
  };
  public userHistory = async (
    user: Principal,
    phase: bigint,
    round: bigint
  ): Promise<Array<RoundUserStatus>> => {
    await this.check(false, false);
    const res = await this.service.userHistory(user, phase, round);
    return SerializableIC(res);
  };
  public history = async (
    phase: bigint,
    round: bigint
  ): Promise<Array<RoundStatus>> => {
    await this.check(false, false);
    const res = await this.service.history(phase, round);
    return SerializableIC(res);
  };
  public whitelistOn = async (): Promise<boolean> => {
    await this.check(false, false);
    return await this.service.whitelistOn();
  };
  public checkWhitelist = async (user: Principal): Promise<boolean> => {
    await this.check(false, false);
    return await this.service.checkWhitelist(user);
  };
  public settle = async (): Promise<boolean> => {
    await this.check(false, false);
    return await this.service.settle();
  };
  public cfTaskMining = async (): Promise<boolean> => {
    await this.check();
    return await this.service.cfTaskMining();
  };
  public cwTaskMining = async (): Promise<boolean> => {
    await this.check();
    return await this.service.cwTaskMining();
  };
  public updateStatus = async (): Promise<boolean> => {
    await this.check(false);
    return await this.service.updateStatus();
  };
  public getTaskTotalMinted = async (): Promise<
    [TaskTotalMinted, TaskTotalSupply]
  > => {
    await this.check(false, false);
    const res = await this.service.getTaskTotalMinted();
    return SerializableIC(res);
  };
  public cwTaskCompleted = async (user: Principal): Promise<boolean> => {
    await this.check();
    return await this.service.cwTaskCompleted(user);
  };
  public cfTaskCompleted = async (user: Principal): Promise<boolean> => {
    await this.check();
    return await this.service.cfTaskCompleted(user);
  };
  public isPaused = async (): Promise<boolean> => {
    await this.check(false, false);
    return await this.service.isPaused();
  };
  public tmSetting = async (): Promise<TradingMining> => {
    await this.check(false, false);
    const res = await this.service.tm_setting();
    return SerializableIC(res);
  };
  public tmStatus = async (address: Address): Promise<TradingMiningStatus> => {
    await this.check(false, false);
    if (validatePrincipal(address)) {
      address = principalToAccountIdentifier(Principal.fromText(address));
    }
    const res = await this.service.tm_status(address);
    return SerializableIC(res);
  };
  public tmNFTBalance = async (address: Address): Promise<TmNFTBalance> => {
    await this.check(false, false);
    if (validatePrincipal(address)) {
      address = principalToAccountIdentifier(Principal.fromText(address));
    }
    const res = await this.service.tm_NFTBalance(address);
    return SerializableIC(res);
  };
  public tmRegister = async (
    tokenIdentifier: TokenIdentifier,
    subAccount: Array<Array<number>> = []
  ): Promise<boolean> => {
    await this.check();
    return await this.service.tm_register(tokenIdentifier, subAccount);
  };
  public tmRegister2 = async (
    subAccount: Array<Array<number>> = []
  ): Promise<boolean> => {
    await this.check();
    return await this.service.tm_register2(subAccount);
  };
  public tmClaim = async (
    subAccount: Array<Array<number>> = []
  ): Promise<Array<bigint>> => {
    await this.check();
    return await this.service.tm_claim(subAccount);
  };
  public tmNFTWithdraw = async (
    subAccount: Array<Array<number>> = []
  ): Promise<void> => {
    await this.check();
    return await this.service.tm_NFTWithdraw(subAccount);
  };
  public btcTaskMining = async (): Promise<boolean> => {
    await this.check();
    return await this.service.btcTaskMining();
  };
  public btcTaskCompleted = async (user: Principal): Promise<boolean> => {
    await this.check();
    return await this.service.btcTaskCompleted(user);
  };
}
