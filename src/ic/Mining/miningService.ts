import Service, {
  AccountData,
  RoundInfo,
  RoundPointsForLM
} from '@/ic/Mining/model';
import { createService } from '@/ic/createService';
import miningIDL from './mining.did';
import { SerializableIC } from '@/ic/converter';
import { AccountId, Icrc1Account } from '@/ic/common/icType';
export class MiningService {
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    return await createService<Service>(canisterId, miningIDL, renew, isUpdate);
  };
  public getRound = async (
    canisterId: string,
    roundId: Array<bigint> = []
  ): Promise<RoundInfo> => {
    try {
      const service = await this.check(canisterId, false, false);
      const res = await service.getRound(roundId);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public getAccelerationRate = async (
    canisterId: string,
    accountId: AccountId
  ): Promise<string> => {
    try {
      const service = await this.check(canisterId, false, false);
      return await service.getAccelerationRate(accountId);
    } catch (e) {
      return '0';
    }
  };
  public getAccountData = async (
    canisterId: string,
    accountId: AccountId,
    roundId: Array<bigint> = []
  ): Promise<AccountData> => {
    try {
      const service = await this.check(canisterId, false, false);
      return await service.getAccountData(roundId, accountId);
    } catch (e) {
      return null;
    }
  };
  public getRoundPointsForLM = async (
    canisterId: string,
    roundId: bigint,
    page: bigint
  ): Promise<RoundPointsForLM> => {
    try {
      const service = await this.check(canisterId, false, false);
      return await service.getRoundPointsForLM(roundId, page);
    } catch (e) {
      return null;
    }
  };
  public getRoundPointsForTM = async (
    canisterId: string,
    roundId: bigint,
    page: bigint
  ): Promise<RoundPointsForLM> => {
    try {
      const service = await this.check(canisterId, false, false);
      return await service.getRoundPointsForTM(roundId, page);
    } catch (e) {
      return null;
    }
  };
  public getRoundSettlementsForLM = async (
    canisterId: string,
    roundId: bigint,
    page: bigint
  ): Promise<RoundPointsForLM> => {
    try {
      const service = await this.check(canisterId, false, false);
      return await service.getRoundSettlementsForLM(roundId, page);
    } catch (e) {
      return null;
    }
  };
  public getRoundSettlementsForTM = async (
    canisterId: string,
    roundId: bigint,
    page: bigint
  ): Promise<RoundPointsForLM> => {
    try {
      const service = await this.check(canisterId, false, false);
      return await service.getRoundSettlementsForTM(roundId, page);
    } catch (e) {
      return null;
    }
  };
  public getBalance = async (
    canisterId: string,
    accountId: AccountId
  ): Promise<{ locked: bigint; available: bigint }> => {
    try {
      const service = await this.check(canisterId, false, false);
      return await service.getBalance(accountId);
    } catch (e) {
      return null;
    }
  };
  public claim = async (
    canisterId: string,
    account: Icrc1Account
  ): Promise<{ Ok: bigint } | { Err: string }> => {
    try {
      const service = await this.check(canisterId);
      return await service.claim(account);
    } catch (e) {
      return null;
    }
  };
}
