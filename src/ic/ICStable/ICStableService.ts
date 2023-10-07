import { checkAuth } from '@/ic/CheckAuth';
import { buildService } from '@/ic/Service';
import store from '@/store';
import ICStableIDL from './ICStable.did';
import Service, {
  BorrowerResult,
  ChargeMethod,
  Collateral,
  CollateralsRes,
  ConfigRes,
  DebtPosition,
  Dpid,
  PriceRes,
  RemoveCollateral,
  StableToken,
  StatsResponse,
  TxnResult
} from '@/ic/ICStable/model';
import { IC_STABLE_CANISTER_ID } from '@/ic/utils';
import { _data, Nonce } from '@/ic/ICLighthouseToken/model';
import { fromSubAccountId, SerializableIC } from '@/ic/converter';
import { Amount } from '@/ic/ICSwap/model';
import { Address } from '@/ic/DRC20Token/model';
import { createPlugActor } from '@/ic/createPlugActor';
import { createIcxActor } from '@/ic/createIcxActor';
import { createInfinityActor } from '@/ic/createInfinityActor';
import { isPlug } from '@/ic/isPlug';
import { isInfinity } from '@/ic/isInfinity';

export class ICStableService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew);
    }
    if (!isUpdate) {
      this.service = buildService(null, ICStableIDL, IC_STABLE_CANISTER_ID);
    } else if ((window as any).icx) {
      this.service = await createIcxActor(ICStableIDL, IC_STABLE_CANISTER_ID);
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor(ICStableIDL, IC_STABLE_CANISTER_ID);
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor(
        ICStableIDL,
        IC_STABLE_CANISTER_ID
      );
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        ICStableIDL,
        IC_STABLE_CANISTER_ID
      );
    }
  };
  public getConfig = async (): Promise<ConfigRes> => {
    await this.check(false, false);
    const res = await this.service.getConfig();
    return SerializableIC(res);
  };
  public stats = async (): Promise<StatsResponse> => {
    await this.check(false, false);
    const res = await this.service.stats();
    return SerializableIC(res);
  };
  public collaterals = async (): Promise<CollateralsRes> => {
    await this.check(false, false);
    const res = await this.service.collaterals();
    return SerializableIC(res);
  };
  public tokens = async (): Promise<Array<StableToken>> => {
    await this.check(false, false);
    const res = await this.service.tokens();
    return SerializableIC(res);
  };
  public open = async (
    collateral: Collateral,
    nonce: Array<Nonce> = [],
    subAccountId = 0,
    data: _data = [[]]
  ): Promise<TxnResult> => {
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
    await this.check();
    const res = await this.service.open(collateral, nonce, subAccount, data);
    return SerializableIC(res);
  };
  public add = async (
    dpId: Dpid,
    collateral: Collateral,
    nonce: Array<Nonce> = [],
    subAccountId = 0,
    data: _data = [[]]
  ): Promise<TxnResult> => {
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
    await this.check();
    const res = await this.service.add(
      dpId,
      collateral,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public remove = async (
    dpId: Dpid,
    collateral: RemoveCollateral,
    nonce: Array<Nonce> = [],
    subAccountId = 0,
    data: _data = [[]]
  ): Promise<TxnResult> => {
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
    await this.check();
    const res = await this.service.remove(
      dpId,
      collateral,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public generate = async (
    dpId: Dpid,
    amount: Array<Amount>,
    nonce: Array<Nonce> = [],
    subAccountId = 0,
    data: _data = [[]]
  ): Promise<TxnResult> => {
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
    await this.check();
    const res = await this.service.generate(
      dpId,
      amount,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public payback = async (
    dpId: Dpid,
    chargeMethod: ChargeMethod,
    nonce: Array<Nonce> = [],
    subAccountId = 0,
    data: _data = [[]]
  ): Promise<TxnResult> => {
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
    await this.check();
    const res = await this.service.payback(
      dpId,
      chargeMethod,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public getPrice = async (): Promise<PriceRes> => {
    await this.check(false, false);
    const res = await this.service.getPrice();
    return SerializableIC(res);
  };
  public dp = async (dpId: Dpid): Promise<Array<DebtPosition>> => {
    await this.check(false, false);
    const res = await this.service.dp(dpId);
    return SerializableIC(res);
  };
  public borrower = async (address: Address): Promise<BorrowerResult> => {
    await this.check(false, false);
    const res = await this.service.borrower(address);
    return SerializableIC(res);
  };
}
