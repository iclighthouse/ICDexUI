import { Principal } from '@dfinity/principal';
import Service, {
  Ambassador,
  CompDepositAccount,
  CompResult,
  CompRoundResponse,
  DexSetting,
  KBar,
  LatestFilledRecord,
  LevelResponse,
  MakerRebate,
  Order,
  OrderPrice,
  OrderStatusResponse,
  OrderType,
  PairInfo,
  Round,
  Setting,
  Stats,
  SysMode,
  TradingResult,
  TrieList,
  TxAccount,
  TxnRecord
} from '@/ic/ICDex/model';
import { checkAuth } from '@/ic/CheckAuth';
import { buildService } from '@/ic/Service';
import ICDexIDL from './ICDex.did';
import store from '@/store';
import {
  AccountIdentifier,
  Icrc1Account,
  Time,
  Txid
} from '@/ic/common/icType';
import { Amount, DexInfo, TokenLiquidity } from '@/ic/ICSwap/model';
import { Address } from '@/ic/DRC20Token/model';
import { _data, Nonce } from '@/ic/ICLighthouseToken/model';
import {
  fromSubAccountId,
  generateTxid,
  hexToBytes,
  principalToAccountIdentifier
} from '@/ic/converter';
import { createPlugActor } from '@/ic/createPlugActor';
import { createIcxActor } from '@/ic/createIcxActor';
import { validatePrincipal } from '@/ic/utils';
import { createInfinityActor } from '@/ic/createInfinityActor';
import { isPlug } from '@/ic/isPlug';
import { isInfinity } from '@/ic/isInfinity';

export class ICDexService {
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew, canisterId);
    }
    let service: Service;
    if (!isUpdate) {
      service = buildService(null, ICDexIDL, canisterId);
    } else if ((window as any).icx) {
      service = await createIcxActor(ICDexIDL, canisterId);
    } else if (priList[principal] === 'Plug') {
      service = await createPlugActor(ICDexIDL, canisterId);
    } else if (priList[principal] === 'Infinity') {
      service = await createInfinityActor(ICDexIDL, canisterId);
    } else {
      service = buildService(
        store.getters['common/getIdentity'],
        ICDexIDL,
        canisterId
      );
    }
    return service;
  };
  public liquidity = async (
    canisterId: string,
    account: Array<AccountIdentifier> = []
  ): Promise<{ pairId: string; tokenLiquidity: TokenLiquidity }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.liquidity(account);
    const principal = localStorage.getItem('principal');
    if (account[0] && account[0] !== principal) {
      return null;
    } else {
      return {
        pairId: canisterId,
        tokenLiquidity: res
      };
    }
  };
  public level10 = async (canisterId: string): Promise<LevelResponse> => {
    const service = await this.check(canisterId, false, false);
    return await service.level10();
  };
  public level100 = async (
    canisterId: string
  ): Promise<{ pairId: string; levelResponse: LevelResponse }> => {
    const service = await this.check(canisterId, true, false);
    const res = await service.level100();
    if (res) {
      return {
        pairId: canisterId,
        levelResponse: res
      };
    }
  };
  public getTxAccount = async (
    canisterId: string,
    address: Address
  ): Promise<{ pairId: string; txAccount: TxAccount }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.getTxAccount(address);
    const principal = localStorage.getItem('principal');
    if (res && principal === address) {
      const nonce = res[2];
      const txid = generateTxid(
        Principal.fromText(principal),
        nonce,
        new Uint8Array(fromSubAccountId(0)),
        canisterId
      );
      const account: Icrc1Account = {
        owner: Principal.fromText(canisterId),
        subaccount: [txid]
      };
      const address: string = principalToAccountIdentifier(
        account.owner,
        new Uint8Array(account.subaccount[0])
      );
      const txAccount: TxAccount = [account, address, nonce, txid];
      return {
        pairId: canisterId,
        txAccount: txAccount
      };
    } else {
      return null;
    }
  };
  public trade = async (
    canisterId: string,
    nonce: Array<Nonce> = [],
    orderPrice: OrderPrice,
    orderType: OrderType,
    expiration: Array<bigint> = [],
    subAccountId = 0,
    data: _data = [[]]
  ): Promise<TradingResult> => {
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
    return await service.trade(
      orderPrice,
      orderType,
      expiration,
      nonce,
      subAccount,
      data
    );
  };
  public pending = async (
    canisterId: string,
    address: Array<Address>,
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<{ pairId: string; trieList: TrieList }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.pending(address, page, size);
    const principal = localStorage.getItem('principal');
    if (address[0] && address[0] !== principal) {
      return null;
    } else {
      return { pairId: canisterId, trieList: res };
    }
  };
  public cancel = async (
    canisterId: string,
    nonce: bigint,
    subAccountId = 0
  ): Promise<void> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    // todo nonce=0 Plug can't cancel
    // if (this.isPlug() && nonce && Number(nonce[0]) === 0) {
    //   nonce = [];
    // }
    console.log(nonce);
    return await service.cancel(nonce, subAccount);
  };
  public cancelByTxid = async (
    canisterId: string,
    txid: Txid,
    subAccountId = 0
  ): Promise<void> => {
    const service = await this.check(canisterId);
    let subAccount = [];
    if (subAccountId) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    return await service.cancelByTxid(txid, subAccount);
  };
  public drc205Events = async (
    canisterId: string,
    address: Array<Address>
  ): Promise<Array<TxnRecord>> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.drc205_events(address);
    const principal = localStorage.getItem('principal');
    if (address[0] && address[0] !== principal) {
      return null;
    } else {
      return res;
    }
  };
  public getQuotes = async (
    canisterId: string,
    kInterval: bigint
  ): Promise<{ paidId: string; quotes: Array<KBar> }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.getQuotes(kInterval);
    if (res) {
      return { paidId: canisterId, quotes: res };
    }
  };
  public latestFilled = async (
    canisterId: string
  ): Promise<{ pairId: string; latestFilledRecord: LatestFilledRecord }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.latestFilled();
    if (res) {
      return { pairId: canisterId, latestFilledRecord: res };
    }
  };
  public ictc_getTO = async (
    canisterId: string,
    toid: bigint
  ): Promise<{ pairId: string; orders: Array<Order> }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.ictc_getTO(toid);
    return {
      pairId: canisterId,
      orders: res
    };
  };
  public drc205_getConfig = async (
    canisterId: string
  ): Promise<{ pairId: string; setting: Setting }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.drc205_getConfig();
    return {
      pairId: canisterId,
      setting: res
    };
  };
  public ictc_TTRun = async (canisterId: string): Promise<bigint> => {
    const service = await this.check(canisterId, false);
    return await service.ictc_runTT();
  };
  public getConfig = async (
    canisterId: string
  ): Promise<{ pairId: string; dexSetting: DexSetting }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.getConfig();
    return {
      pairId: canisterId,
      dexSetting: res
    };
  };
  public makerRebate = async (
    canisterId: string,
    address: Address
  ): Promise<{ pairId: string; makerRebate: MakerRebate }> => {
    const service = await this.check(canisterId, false, false);
    if (validatePrincipal(address)) {
      address = principalToAccountIdentifier(Principal.fromText(address));
    }
    const res = await service.makerRebate(address);
    return {
      pairId: canisterId,
      makerRebate: res
    };
  };
  public drc205_dexInfo = async (
    canisterId: string
  ): Promise<{ pairId: string; dexInfo: DexInfo }> => {
    const service = await this.check(canisterId, false, false);
    console.log(service);
    try {
      const res = await service.drc205_dexInfo();
      return {
        pairId: canisterId,
        dexInfo: res
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public fallback = async (
    canisterId: string,
    nonce: BigInt,
    subAccountId = 0
  ): Promise<boolean> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    return await service.fallback(nonce, subAccount);
  };
  public stats = async (
    canisterId: string
  ): Promise<{ pairId: string; stats: Stats }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.stats();
    return {
      pairId: canisterId,
      stats: res
    };
  };
  public monitor = async (
    canisterId: string
  ): Promise<{ pairId: string; monitor: bigint }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.monitor();
      return {
        pairId: canisterId,
        monitor: res
      };
    } catch (e) {
      //
    }
  };
  public info = async (
    canisterId: string
  ): Promise<{ pairId: string; pairInfo: PairInfo }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.info();
      return {
        pairId: canisterId,
        pairInfo: res
      };
    } catch (e) {
      //
    }
  };
  public statusByTxid = async (
    canisterId: string,
    txid: Txid
  ): Promise<{ pairId: string; orderStatusResponse: OrderStatusResponse }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.statusByTxid(txid);
      return {
        pairId: canisterId,
        orderStatusResponse: res
      };
    } catch (e) {
      return null;
    }
  };
  public pendingCount = async (
    canisterId: string
  ): Promise<{ pairId: string; count: bigint }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.pendingCount();
      return {
        pairId: canisterId,
        count: res
      };
    } catch (e) {
      return {
        pairId: canisterId,
        count: BigInt(0)
      };
    }
  };
  public orderExpirationDuration = async (
    canisterId: string
  ): Promise<{ pairId: string; time: bigint }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.orderExpirationDuration();
      return {
        pairId: canisterId,
        time: res
      };
    } catch (e) {
      return null;
    }
  };
  public ta_description = async (
    canisterId: string
  ): Promise<{ pairId: string; ta_description: string }> => {
    const service = await this.check(canisterId, false);
    const res = await service.ta_description();
    return {
      pairId: canisterId,
      ta_description: res
    };
  };
  public ta_getReferrer = async (
    canisterId: string,
    address: Address
  ): Promise<{ pairId: string; referrer: Array<[Address, boolean]> }> => {
    const service = await this.check(canisterId, false);
    if (validatePrincipal(address)) {
      address = principalToAccountIdentifier(Principal.fromText(address));
    }
    const res = await service.ta_getReferrer(address);
    return {
      pairId: canisterId,
      referrer: res
    };
  };
  public comp_round = async (
    canisterId: string,
    round: Array<Round> = []
  ): Promise<{ pairId: string; compRoundResponse: CompRoundResponse }> => {
    const service = await this.check(canisterId, false);
    const res = await service.comp_round(round);
    return {
      pairId: canisterId,
      compRoundResponse: res
    };
  };
  public comp_result = async (
    canisterId: string,
    round: Array<Round> = [],
    address: Address
  ): Promise<Array<CompResult>> => {
    if (!address) {
      return null;
    }
    const service = await this.check(canisterId, false);
    if (validatePrincipal(address)) {
      address = principalToAccountIdentifier(Principal.fromText(address));
    }
    const res = await service.comp_result(round, address);
    const principal = localStorage.getItem('principal');
    const address1 = principalToAccountIdentifier(
      Principal.fromText(principal)
    );
    if (address1 === address) {
      return res;
    } else {
      return null;
    }
  };
  public comp_settle = async (
    canisterId: string,
    round: Round
  ): Promise<void> => {
    const service = await this.check(canisterId, false);
    return await service.comp_settle(round);
  };
  public comp_register = async (canisterId: string): Promise<boolean> => {
    const service = await this.check(canisterId);
    const subAccount = [[]];
    // subAccount = [fromSubAccountId(subAccountId)];
    return await service.comp_register(subAccount);
  };
  public comp_dropout = async (canisterId: string): Promise<boolean> => {
    const service = await this.check(canisterId);
    const subAccount = [[]];
    // subAccount = [fromSubAccountId(subAccountId)];
    return await service.comp_dropout(subAccount);
  };
  public comp_getDepositAccount = async (
    canisterId: string,
    address: Address
  ): Promise<CompDepositAccount> => {
    const service = await this.check(canisterId);
    if (validatePrincipal(address)) {
      address = principalToAccountIdentifier(Principal.fromText(address));
    }
    const res = await service.comp_getDepositAccount(address);
    const principal = localStorage.getItem('principal');
    const address1 = principalToAccountIdentifier(
      Principal.fromText(principal)
    );
    if (address1 === address) {
      return res;
    } else {
      return null;
    }
  };
  public comp_deposit = async (
    canisterId: string,
    value0: Amount,
    value1: Amount
  ): Promise<void> => {
    const service = await this.check(canisterId);
    const subAccount = [[]];
    // subAccount = [fromSubAccountId(subAccountId)];
    return await service.comp_deposit(value0, value1, subAccount);
  };
  public ta_setReferrer = async (
    canisterId: string,
    address: Address,
    entity: Array<string>
  ): Promise<boolean> => {
    const service = await this.check(canisterId);
    const subAccount = [[]];
    console.log(address, entity);
    return await service.ta_setReferrer(address, entity, subAccount);
  };
  public ta_ambassador = async (
    canisterId: string,
    address: Address
  ): Promise<{ pairId: string; ambassador: Ambassador }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.ta_ambassador(address);
    return {
      pairId: canisterId,
      ambassador: res
    };
  };
  public compFallback = async (
    canisterId: string,
    subAccountId = 0
  ): Promise<[Amount, Amount]> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    try {
      return await service.comp_fallback(subAccount);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public compWithdraw = async (
    canisterId: string,
    subAccountId = 0
  ): Promise<[Amount, Amount]> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    try {
      return await service.comp_withdraw(subAccount);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public sysMode = async (
    canisterId: string
  ): Promise<{ pairId: string; mode: SysMode; openingTime: Time }> => {
    const service = await this.check(canisterId);
    try {
      const res = await service.sysMode();
      return {
        pairId: canisterId,
        mode: res.mode,
        openingTime: res.openingTime
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
