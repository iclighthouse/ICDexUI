import { Principal } from '@dfinity/principal';
import Service, {
  AccountSetting,
  Ambassador,
  CompDepositAccount,
  CompResult,
  CompRoundResponse,
  ConfigMode,
  DexRole,
  DexSetting,
  IDOConfig,
  KBar,
  KeepingBalance,
  LatestFilledRecord,
  LevelResponse,
  MakerRebate,
  Order,
  OrderPrice,
  OrderStatusResponse,
  OrderType,
  PairInfo,
  Participant,
  ProOrderConfig,
  ProOrderConfigUpdate,
  Qualification,
  Round,
  Setting,
  Soid,
  Stats,
  StopLossOrderConfig,
  STOrder,
  StoSetting,
  SysMode,
  TOPoolResponse,
  TradingResult,
  TrieList,
  TrieList_3,
  TrieList_5,
  TTErrorsResponse,
  TTsResponse,
  TxAccount,
  TxnRecord,
  UpdateStopLossOrderConfig
} from '@/ic/ICDex/model';
import ICDexIDL from './ICDex.did';
import {
  AccountId,
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
  SerializableIC,
  generateTxid,
  principalToAccountIdentifier
} from '@/ic/converter';
import { validatePrincipal } from '@/ic/utils';
import { isPlug } from '@/ic/isPlug';
import { isInfinity } from '@/ic/isInfinity';
import { createService } from '@/ic/createService';

const ProSubaccountId = 1;

export class ICDexService {
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    return await createService<Service>(canisterId, ICDexIDL, renew, isUpdate);
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
        tokenLiquidity: SerializableIC(res)
      };
    }
  };
  public level10 = async (canisterId: string): Promise<LevelResponse> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.level10();
    return SerializableIC(res);
  };
  public level100 = async (
    canisterId: string
  ): Promise<{ pairId: string; levelResponse: LevelResponse }> => {
    const service = await this.check(canisterId, true, false);
    const res = await service.level100();
    if (res) {
      return {
        pairId: canisterId,
        levelResponse: SerializableIC(res)
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
    const res = await service.trade(
      orderPrice,
      orderType,
      expiration,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public pending = async (
    canisterId: string,
    address: Array<Address>,
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<{ pairId: string; trieList: TrieList }> => {
    const service = await this.check(canisterId, false, false);
    const principal = localStorage.getItem('principal');
    const res = await service.pending(address, page, size);
    const principal1 = localStorage.getItem('principal');
    if (principal1 !== principal) {
      return null;
    } else {
      return { pairId: canisterId, trieList: SerializableIC(res) };
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
    const res = await service.cancel(nonce, subAccount);
    return SerializableIC(res);
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
  ): Promise<{ pairId: string; records: Array<TxnRecord> }> => {
    const service = await this.check(canisterId, false, false);
    const principal = localStorage.getItem('principal');
    const res = await service.drc205_events(address);
    const principal1 = localStorage.getItem('principal');
    if (principal1 !== principal) {
      return null;
    } else {
      return { pairId: canisterId, records: SerializableIC(res) };
    }
  };
  public getQuotes = async (
    canisterId: string,
    kInterval: bigint
  ): Promise<{ paidId: string; quotes: Array<KBar> }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.getQuotes(kInterval);
    if (res) {
      return { paidId: canisterId, quotes: SerializableIC(res) };
    }
  };
  public latestFilled = async (
    canisterId: string
  ): Promise<{ pairId: string; latestFilledRecord: LatestFilledRecord }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.latestFilled();
    if (res) {
      return { pairId: canisterId, latestFilledRecord: SerializableIC(res) };
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
      orders: SerializableIC(res)
    };
  };
  public drc205_getConfig = async (
    canisterId: string
  ): Promise<{ pairId: string; setting: Setting }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.drc205_getConfig();
    return {
      pairId: canisterId,
      setting: SerializableIC(res)
    };
  };
  public ictc_TTRun = async (canisterId: string): Promise<bigint> => {
    const service = await this.check(canisterId, false, false);
    return await service.ictc_runTT();
  };
  public getConfig = async (
    canisterId: string
  ): Promise<{ pairId: string; dexSetting: DexSetting }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.getConfig();
    return {
      pairId: canisterId,
      dexSetting: SerializableIC(res)
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
      makerRebate: SerializableIC(res)
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
        dexInfo: SerializableIC(res)
      };
    } catch (e) {
      console.log(e);
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
      stats: SerializableIC(res)
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
        monitor: SerializableIC(res)
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
        pairInfo: SerializableIC(res)
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
        orderStatusResponse: SerializableIC(res)
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
        count: SerializableIC(res)
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
        time: SerializableIC(res)
      };
    } catch (e) {
      return null;
    }
  };
  public ta_description = async (
    canisterId: string
  ): Promise<{ pairId: string; ta_description: string }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.ta_description();
    return {
      pairId: canisterId,
      ta_description: SerializableIC(res)
    };
  };
  public ta_getReferrer = async (
    canisterId: string,
    address: Address
  ): Promise<{ pairId: string; referrer: Array<[Address, boolean]> }> => {
    const service = await this.check(canisterId, false, false);
    if (validatePrincipal(address)) {
      address = principalToAccountIdentifier(Principal.fromText(address));
    }
    const res = await service.ta_getReferrer(address);
    return {
      pairId: canisterId,
      referrer: SerializableIC(res)
    };
  };
  public comp_round = async (
    canisterId: string,
    round: Array<Round> = []
  ): Promise<{ pairId: string; compRoundResponse: CompRoundResponse }> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.comp_round(round);
    return {
      pairId: canisterId,
      compRoundResponse: SerializableIC(res)
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
    const service = await this.check(canisterId, false, false);
    if (validatePrincipal(address)) {
      address = principalToAccountIdentifier(Principal.fromText(address));
    }
    const res = await service.comp_result(round, address);
    const principal = localStorage.getItem('principal');
    const address1 = principalToAccountIdentifier(
      Principal.fromText(principal)
    );
    if (address1 === address) {
      return SerializableIC(res);
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
      return SerializableIC(res);
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
      ambassador: SerializableIC(res)
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
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.sysMode();
      return {
        pairId: canisterId,
        mode: res.mode,
        openingTime: res.openingTime
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public accountBalance = async (
    canisterId: string,
    subAccountId = 0
  ): Promise<{ pairId: string; keepingBalance: KeepingBalance }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const principal = localStorage.getItem('principal');
      const address = principalToAccountIdentifier(
        Principal.fromText(principal),
        new Uint8Array(fromSubAccountId(subAccountId))
      );
      const res = await service.accountBalance(address);
      const principal1 = localStorage.getItem('principal');
      if (principal === principal1) {
        return {
          pairId: canisterId,
          keepingBalance: res
        };
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public accountSetting = async (
    canisterId: string,
    address: Address
  ): Promise<{ pairId: string; accountSetting: AccountSetting }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.accountSetting(address);
      return {
        pairId: canisterId,
        accountSetting: SerializableIC(res)
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public accountConfig = async (
    canisterId: string,
    mode: ConfigMode,
    keeping: boolean,
    subAccountId = 0
  ): Promise<void> => {
    const service = await this.check(canisterId);
    try {
      let subAccount = [[]];
      if (subAccountId) {
        subAccount = [fromSubAccountId(subAccountId)];
      }
      return await service.accountConfig(mode, keeping, subAccount);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public deposit = async (
    canisterId: string,
    token: { token0: null } | { token1: null },
    amount: Amount,
    subAccountId = 0
  ): Promise<void> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    return await service.deposit(token, amount, subAccount);
  };
  public depositFallback = async (
    canisterId: string,
    subAccountId = 0
  ): Promise<[Amount, Amount]> => {
    const service = await this.check(canisterId);
    try {
      let subAccount = [[]];
      if (subAccountId || subAccountId === 0) {
        subAccount = [fromSubAccountId(subAccountId)];
      }
      return await service.depositFallback(subAccount);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public withdraw = async (
    canisterId: string,
    token0Amount: Array<Amount> = [],
    token1Amount: Array<Amount> = [],
    subAccountId = 0
  ): Promise<[Amount, Amount]> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    console.log(service);
    return await service.withdraw(token0Amount, token1Amount, subAccount);
  };
  public getRole = async (
    canisterId: string,
    address: Address
  ): Promise<{ pairId: string; dexRole: DexRole }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.getRole(address);
      return {
        pairId: canisterId,
        dexRole: SerializableIC(res)
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public sto_createProOrder = async (
    canisterId: string,
    proOrderConfig: ProOrderConfig,
    subAccountId = 0
  ): Promise<Soid> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    return await service.sto_createProOrder(proOrderConfig, subAccount);
  };
  public sto_updateProOrder = async (
    canisterId: string,
    soid: Soid,
    proOrderConfig: ProOrderConfigUpdate,
    subAccountId = 0
  ): Promise<Soid> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    return await service.sto_updateProOrder(soid, proOrderConfig, subAccount);
  };
  public sto_getAccountProOrders = async (
    canisterId: string,
    address: Address
  ): Promise<{ pairId: string; orders: Array<STOrder> }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.sto_getAccountProOrders(address);
      const principal = localStorage.getItem('principal');
      const address1 = principalToAccountIdentifier(
        Principal.fromText(principal),
        new Uint8Array(fromSubAccountId(ProSubaccountId))
      );
      if (address1 === address) {
        return {
          pairId: canisterId,
          orders: SerializableIC(res)
        };
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public sto_getConfig = async (
    canisterId: string
  ): Promise<{ pairId: string; stoSetting: StoSetting }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.sto_getConfig();
      return {
        pairId: canisterId,
        stoSetting: SerializableIC(res)
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public makerList = async (
    canisterId: string,
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<{ pairId: string; makerList: TrieList_3 }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.makerList(page, size);
      return {
        pairId: canisterId,
        makerList: SerializableIC(res)
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public drc205_events_filter = async (
    canisterId: string,
    address: Array<string> = [],
    start: Array<bigint> = [],
    end: Array<bigint> = []
  ): Promise<{ pairId: string; records: Array<TxnRecord> }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const principal = localStorage.getItem('principal');
      const res = await service.drc205_events_filter(address, start, end);
      const principal1 = localStorage.getItem('principal');
      if (principal1 !== principal) {
        return null;
      } else {
        return {
          pairId: canisterId,
          records: SerializableIC(res[0])
        };
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public sto_createStopLimitOrder = async (
    canisterId: string,
    stopLimitOrderConfig: StopLossOrderConfig,
    subAccountId = 0
  ): Promise<Soid> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    return await service.sto_createStopLossOrder(
      stopLimitOrderConfig,
      subAccount
    );
  };
  public sto_updateStopLimitOrder = async (
    canisterId: string,
    soid: Soid,
    updateStopLimitOrderConfig: UpdateStopLossOrderConfig,
    subAccountId = 0
  ): Promise<Soid> => {
    const service = await this.check(canisterId);
    let subAccount = [[]];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    return await service.sto_updateStopLossOrder(
      soid,
      updateStopLimitOrderConfig,
      subAccount
    );
  };
  public sto_getAccountStopLimitOrders = async (
    canisterId: string,
    address: string
  ): Promise<{ pairId: string; orders: Array<STOrder> }> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.sto_getAccountStopLossOrders(address);
      const principal = localStorage.getItem('principal');
      const address1 = principalToAccountIdentifier(
        Principal.fromText(principal),
        new Uint8Array(fromSubAccountId(0))
      );
      if (address1 === address) {
        return {
          pairId: canisterId,
          orders: SerializableIC(res)
        };
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public sto_getStratOrder = async (
    canisterId: string,
    soid: Soid
  ): Promise<Array<STOrder>> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.sto_getStratOrder(soid);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public IDO_getConfig = async (canisterId: string): Promise<IDOConfig> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.IDO_getConfig();
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public IDO_qualification = async (
    canisterId: string,
    address: Array<string>
  ): Promise<Qualification> => {
    const service = await this.check(canisterId, false, false);
    try {
      return await service.IDO_qualification(address);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public IDO_updateQualification = async (
    canisterId: string,
    subaccount: Array<Array<number>> = []
  ): Promise<Array<Participant>> => {
    const service = await this.check(canisterId);
    try {
      return await service.IDO_updateQualification(subaccount);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public ictc_getAdmins = async (
    canisterId: string
  ): Promise<Array<Principal>> => {
    const service = await this.check(canisterId, false, false);
    try {
      return await service.ictc_getAdmins();
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getAuctionMode = async (
    canisterId: string
  ): Promise<[boolean, AccountId]> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.getAuctionMode();
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public brokerList = async (
    canisterId: string,
    page: Array<bigint> = [],
    size: Array<bigint> = []
  ): Promise<TrieList_5> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.brokerList(page, size);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public ictc_getTOCount = async (canisterId: string): Promise<bigint> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.ictc_getTOCount();
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public ictc_getTTs = async (
    canisterId: string,
    page: bigint,
    size: bigint
  ): Promise<TTsResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.ictc_getTTs(page, size);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public ictc_getTTErrors = async (
    canisterId: string,
    page: bigint,
    size: bigint
  ): Promise<TTErrorsResponse> => {
    const service = await this.check(canisterId, false, false);
    try {
      const res = await service.ictc_getTTErrors(page, size);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public ictc_getTOPool = async (
    canisterId: string
  ): Promise<TOPoolResponse> => {
    const service = await this.check(canisterId);
    try {
      const res = await service.ictc_getTOPool();
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
