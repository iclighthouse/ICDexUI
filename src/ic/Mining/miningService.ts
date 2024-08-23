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
  private service: Service;
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<void> => {
    this.service = await createService<Service>(
      canisterId,
      miningIDL,
      renew,
      isUpdate
    );
  };
  public getRound = async (
    canisterId: string,
    roundId: Array<bigint> = []
  ): Promise<RoundInfo> => {
    try {
      await this.check(canisterId, false, false);
      const res = await this.service.getRound(roundId);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getAccelerationRate = async (
    canisterId: string,
    accountId: AccountId
  ): Promise<string> => {
    try {
      await this.check(canisterId, false, false);
      return await this.service.getAccelerationRate(accountId);
    } catch (e) {
      console.log(e);
      return '0';
    }
  };
  public getAccountData = async (
    canisterId: string,
    accountId: AccountId,
    roundId: Array<bigint> = []
  ): Promise<AccountData> => {
    try {
      await this.check(canisterId, false, false);
      return await this.service.getAccountData(roundId, accountId);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getRoundPointsForLM = async (
    canisterId: string,
    roundId: bigint,
    page: bigint
  ): Promise<RoundPointsForLM> => {
    try {
      await this.check(canisterId, false, false);
      return await this.service.getRoundPointsForLM(roundId, page);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getRoundPointsForTM = async (
    canisterId: string,
    roundId: bigint,
    page: bigint
  ): Promise<RoundPointsForLM> => {
    try {
      await this.check(canisterId, false, false);
      return await this.service.getRoundPointsForTM(roundId, page);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getRoundSettlementsForLM = async (
    canisterId: string,
    roundId: bigint,
    page: bigint
  ): Promise<RoundPointsForLM> => {
    try {
      await this.check(canisterId, false, false);
      return await this.service.getRoundSettlementsForLM(roundId, page);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getRoundSettlementsForTM = async (
    canisterId: string,
    roundId: bigint,
    page: bigint
  ): Promise<RoundPointsForLM> => {
    try {
      await this.check(canisterId, false, false);
      return await this.service.getRoundSettlementsForTM(roundId, page);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getBalance = async (
    canisterId: string,
    accountId: AccountId
  ): Promise<{ locked: bigint; available: bigint }> => {
    try {
      await this.check(canisterId, false, false);
      return await this.service.getBalance(accountId);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public claim = async (
    canisterId: string,
    account: Icrc1Account
  ): Promise<{ Ok: bigint } | { Err: string }> => {
    try {
      await this.check(canisterId);
      return await this.service.claim(account);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
