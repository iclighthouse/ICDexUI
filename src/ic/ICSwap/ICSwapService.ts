import Service, {
  DexInfo,
  DexConfig,
  TokenLiquidity,
  TxnResult,
  Amount,
  PendingResult,
  SwapYield,
  ICSwapFeeStatus,
  FeeBalance,
  SwapInfo,
  OrderRequest,
  DepositAccount,
  AccountBalance
} from '@/ic/ICSwap/model';
import ICSwapIDL from './ICSwap.did';
import { AccountIdentifier } from '@/ic/common/icType';
import { _data, Nonce } from '@/ic/ICLighthouseToken/model';
import { fromSubAccountId, SerializableIC } from '@/ic/converter';
import { Address } from '@/ic/DRC20Token/model';
import { isPlug } from '@/ic/isPlug';
import { isInfinity } from '@/ic/isInfinity';
import { createService } from '@/ic/createService';

export class ICSwapService {
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    return await createService<Service>(canisterId, ICSwapIDL, renew, isUpdate);
  };
  public drc205_dexInfo = async (canisterId: string): Promise<DexInfo> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.drc205_dexInfo();
      return SerializableIC(res);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public liquidity = async (
    canisterId: string,
    account: Array<AccountIdentifier> = []
  ): Promise<TokenLiquidity> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.liquidity(account);
    return SerializableIC(res);
  };
  public getConfig = async (canisterId: string): Promise<DexConfig> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.getConfig();
    return SerializableIC(res);
  };
  public swap = async (
    canisterId: string,
    orderRequest: OrderRequest,
    slip: Array<bigint>,
    autoWithdraw: Array<boolean>,
    nonce: Array<Nonce> = [],
    subAccountId = 0,
    data: _data = [[]]
  ): Promise<TxnResult> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    if (
      (isPlug() && nonce && Number(nonce[0]) === 0) ||
      (isInfinity() && nonce && Number(nonce[0]) === 0)
    ) {
      nonce = [];
    }
    const res = await service.swap(
      orderRequest,
      slip,
      autoWithdraw,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public pending = async (
    canisterId: string,
    address: Array<Address>
  ): Promise<PendingResult> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.pending(address);
    return SerializableIC(res);
  };
  public add = async (
    canisterId: string,
    value0: Amount,
    value1: Amount,
    autoWithdraw: Array<boolean>,
    nonce: Array<Nonce>,
    subAccountId = 0,
    data: _data
  ): Promise<TxnResult> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    if (
      (isPlug() && nonce && Number(nonce[0]) === 0) ||
      (isInfinity() && nonce && Number(nonce[0]) === 0)
    ) {
      nonce = [];
    }
    const res = await service.add(
      [value0],
      [value1],
      autoWithdraw,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public claim = async (
    canisterId: string,
    nonce: Array<Nonce> = [],
    subAccountId = 0,
    data: _data = [[]]
  ): Promise<TxnResult> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    if (
      (isPlug() && nonce && Number(nonce[0]) === 0) ||
      (isInfinity() && nonce && Number(nonce[0]) === 0)
    ) {
      nonce = [];
    }
    const res = await service.claim(nonce, subAccount, data);
    return SerializableIC(res);
  };
  public remove = async (
    canisterId: string,
    shares: Array<bigint>,
    autoWithdraw: Array<boolean>,
    nonce: Array<Nonce> = [],
    subAccountId = 0,
    data: _data = [[]]
  ): Promise<TxnResult> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    if (
      (isPlug() && nonce && Number(nonce[0]) === 0) ||
      (isInfinity() && nonce && Number(nonce[0]) === 0)
    ) {
      nonce = [];
    }
    const res = await service.remove(
      shares,
      autoWithdraw,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public userCount = async (canisterId: string): Promise<bigint> => {
    const service = await this.check(canisterId, false);
    return await service.userCount();
  };
  public decimals = async (canisterId: string): Promise<number> => {
    const service = await this.check(canisterId, false, false);
    return await service.decimals();
  };
  public fallback = async (
    canisterId: string,
    subAccountId = 0
  ): Promise<void> => {
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    const service = await this.check(canisterId);
    return await service.fallback(subAccount);
  };
  public getYield = async (canisterId: string): Promise<SwapYield> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.yield();
    return SerializableIC(res);
  };
  public feeStatus = async (canisterId: string): Promise<ICSwapFeeStatus> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.feeStatus();
    return SerializableIC(res);
  };
  public lpRewards = async (
    canisterId: string,
    address: Address,
    includePending = true
  ): Promise<FeeBalance> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.lpRewards(address, includePending);
    return SerializableIC(res);
  };
  public getDepositAccount = async (
    canisterId: string,
    address: Address
  ): Promise<DepositAccount> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.getDepositAccount(address);
    return SerializableIC(res);
  };
  public withdraw = async (
    canisterId: string,
    autoWithdraw: Array<boolean>,
    subAccount: Array<Array<number>> = [[]]
  ): Promise<void> => {
    const service = await this.check(canisterId);
    return await service.withdraw(autoWithdraw, subAccount);
  };
  public autoWithdrawal = async (
    canisterId: string,
    address: Address
  ): Promise<boolean> => {
    const service = await this.check(canisterId);
    return await service.autoWithdrawal(address);
  };
  public balance = async (
    canisterId: string,
    address: Address
  ): Promise<AccountBalance> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.balance(address);
    return SerializableIC(res);
  };
  public info = async (canisterId: string): Promise<SwapInfo> => {
    const service = await this.check(canisterId, true, false);
    const res = await service.info();
    return SerializableIC(res);
  };
}
