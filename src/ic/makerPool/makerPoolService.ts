import Service, {
  PoolEvent,
  PoolInfo,
  PoolStats,
  ShareWeighted,
  TrieListEvents,
  UnitNetValue
} from '@/ic/makerPool/model';
import makerPoolIDL from './makerPool.did';
import { createService } from '@/ic/createService';
import { Icrc1Account, Time } from '@/ic/common/icType';
import { fromSubAccountId, SerializableIC } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import {
  TOPoolResponse,
  TTErrorsResponse,
  TTsResponse
} from '@/ic/ICDex/model';
export class makerPoolService {
  public stats2 = async (canisterId: string): Promise<PoolStats> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      return await service.stats2();
    } catch (e) {
      return null;
    }
  };
  public getDepositAccount = async (
    canisterId: string,
    address: string
  ): Promise<[Icrc1Account, string]> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      const res = await service.getDepositAccount(address);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public getAccountShares = async (
    canisterId: string,
    address: string
  ): Promise<[bigint, ShareWeighted]> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      return await service.getAccountShares(address);
    } catch (e) {
      return null;
    }
  };
  public info = async (canisterId: string): Promise<PoolInfo> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      const res = await service.info();
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public add = async (
    canisterId: string,
    token0Amount: bigint,
    token1Amount: bigint,
    subaccountId = 0
  ): Promise<bigint> => {
    const service = await createService<Service>(canisterId, makerPoolIDL);
    let subAccount = [[]];
    if (subaccountId !== 0) {
      subAccount = [fromSubAccountId(subaccountId)];
    }
    return await service.add(token0Amount, token1Amount, subAccount);
  };
  public remove = async (
    canisterId: string,
    shares: bigint,
    subaccountId = 0
  ): Promise<[bigint, bigint]> => {
    const service = await createService<Service>(canisterId, makerPoolIDL);
    let subAccount = [[]];
    if (subaccountId !== 0) {
      subAccount = [fromSubAccountId(subaccountId)];
    }
    return await service.remove(shares, subAccount);
  };
  public getUnitNetValues = async (
    canisterId: string
  ): Promise<{ data: Array<UnitNetValue>; shareUnitSize: bigint }> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      return await service.getUnitNetValues();
    } catch (e) {
      return null;
    }
  };
  public getAccountVolUsed = async (
    canisterId: string,
    address: string
  ): Promise<bigint> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      return await service.getAccountVolUsed(address);
    } catch (e) {
      return null;
    }
  };
  public get_events = async (
    canisterId: string,
    page: Array<bigint>,
    size: Array<bigint>
  ): Promise<TrieListEvents> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      const res = await service.get_events(page, size);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public ictc_getAdmins = async (
    canisterId: string
  ): Promise<Array<Principal>> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      return await service.ictc_getAdmins();
    } catch (e) {
      return null;
    }
  };
  public fallback = async (
    canisterId: string,
    subAccountId = 0
  ): Promise<[bigint, bigint]> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      true,
      true
    );
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    return await service.fallback(subAccount);
  };
  public ictc_getTOCount = async (canisterId: string): Promise<bigint> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      const res = await service.ictc_getTOCount();
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public ictc_getTTs = async (
    canisterId: string,
    page: bigint,
    size: bigint
  ): Promise<TTsResponse> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      const res = await service.ictc_getTTs(page, size);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public ictc_getTTErrors = async (
    canisterId: string,
    page: bigint,
    size: bigint
  ): Promise<TTErrorsResponse> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      const res = await service.ictc_getTTErrors(page, size);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public ictc_getTOPool = async (
    canisterId: string
  ): Promise<TOPoolResponse> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      const res = await service.ictc_getTOPool();
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public get_account_events = async (
    canisterId: string,
    accountId: Array<number>
  ): Promise<Array<[PoolEvent, Time]>> => {
    const service = await createService<Service>(
      canisterId,
      makerPoolIDL,
      false,
      false
    );
    try {
      const res = await service.get_account_events(accountId);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
}
