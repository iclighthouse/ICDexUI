import { Principal } from '@dfinity/principal';
import { buildService } from '../Service';
import {
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_TOKEN_CANISTER_ID
} from '@/ic/utils';
import Service, {
  _data,
  Allowance,
  Amount,
  CoinSeconds,
  Decimals,
  ExecuteType,
  Nonce,
  Txid,
  TxnQueryRequest,
  TxnQueryResponse,
  TxnResult
} from '@/ic/ICLighthouseToken/model';
import ICLighthouseTokenIDL from './ICLighthouseToken.did';
import { CanisterId, PrincipalString } from '@/ic/common/icType';
import { Gas, Metadata, TotalSupply } from '@/ic/ICTokens/model';
import {
  fromSubAccountId,
  principalToAccountIdentifier,
  SerializableIC
} from '@/ic/converter';
import { checkAuth } from '@/ic/CheckAuth';
import store from '@/store';
import { createPlugActor } from '@/ic/createPlugActor';
import { createIcxActor } from '@/ic/createIcxActor';
import { createInfinityActor } from '@/ic/createInfinityActor';
import { isPlug } from '@/ic/isPlug';
import { isInfinity } from '@/ic/isInfinity';

export class ICLighthouseTokenService {
  private service: Service;
  // private readonly host: string;
  // private readonly canisterId: string;
  // constructor(
  //   identity: Identity,
  //   canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  //   host?: string
  // ) {
  //   this.host = host;
  //   this.canisterId = canisterId;
  //   this.service = buildService(
  //     identity,
  //     ICLighthouseTokenIDL,
  //     canisterId,
  //     host
  //   );
  // }
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
    if (!isUpdate) {
      this.service = buildService(null, ICLighthouseTokenIDL, canisterId);
    } else if ((window as any).icx) {
      this.service = await createIcxActor(ICLighthouseTokenIDL, canisterId);
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor<Service>(
        ICLighthouseTokenIDL,
        canisterId
      );
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor<Service>(
        ICLighthouseTokenIDL,
        canisterId
      );
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        ICLighthouseTokenIDL,
        canisterId
      );
    }
    return this.service;
  };
  public approve = async (
    amount: Amount,
    data: _data = [[]],
    spender = IC_TOKEN_CANISTER_ID,
    nonce: Array<Nonce> = [],
    subAccountId = 0,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
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
    const res = await service.drc20_approve(
      spender,
      amount,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public allowance = async (
    ICTokensId: PrincipalString,
    spender: PrincipalString = IC_TOKEN_CANISTER_ID,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<Amount> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_allowance(ICTokensId, spender);
  };
  public getBalance = async (
    principal: PrincipalString,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
    subAccountId = 0
  ): Promise<Amount> => {
    const service = await this.check(canisterId, false, false);
    const subAccount = fromSubAccountId(subAccountId);
    const account = principalToAccountIdentifier(
      Principal.fromText(principal),
      new Uint8Array(subAccount)
    );
    return await service.drc20_balanceOf(account);
  };
  public approvals = async (
    user: PrincipalString,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<Array<Allowance>> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.drc20_approvals(user);
    return SerializableIC(res);
  };
  public transfer = async (
    to: PrincipalString,
    amount: Amount,
    nonce: Array<Nonce> = [],
    subAccountId: number,
    data: _data = [[]],
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<TxnResult> => {
    const service = await this.check(canisterId);
    let subAccount = [];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    if (
      (isPlug() && nonce && Number(nonce[0]) === 0) ||
      (isInfinity() && nonce && Number(nonce[0]) === 0)
    ) {
      nonce = [];
    }
    const res = await service.drc20_transfer(
      to,
      amount,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public totalSupply = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<TotalSupply> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_totalSupply();
  };
  public gas = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<Gas> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_gas();
  };
  public fee = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<bigint> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_fee();
  };
  public getName = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<string> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_name();
  };
  public getSymbol = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<string> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_symbol();
  };
  public getDecimals = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<Decimals> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_decimals();
  };

  // my owner token methods
  public metadata = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<Array<Metadata>> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_metadata();
  };
  public setMetadata = async (
    request: Array<Metadata>,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<boolean> => {
    const service = await this.check(canisterId);
    return await service.ictokens_setMetadata(request);
  };
  public getOwner = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<CanisterId> => {
    const service = await this.check(canisterId, false);
    return await service.ictokens_getOwner();
  };
  public changeOwner = async (
    newOwner: Principal,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<boolean> => {
    const service = await this.check(canisterId);
    return await service.ictokens_changeOwner(newOwner);
  };
  public txnQuery = async (
    request: TxnQueryRequest,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<TxnQueryResponse> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.drc20_txnQuery(request);
    return SerializableIC(res);
  };
  public lockTransfer = async (
    to: string,
    amount: bigint,
    timeout: bigint,
    nonce: Array<Nonce> = [],
    decider: Array<string>,
    data: _data = [[]],
    subAccountId: number,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<TxnResult> => {
    const service = await this.check(canisterId);
    let subAccount = [];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    if (
      (isPlug() && nonce && Number(nonce[0]) === 0) ||
      (isInfinity() && nonce && Number(nonce[0]) === 0)
    ) {
      nonce = [];
    }
    const res = await service.drc20_lockTransfer(
      to,
      amount,
      timeout,
      decider,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public executeTransfer = async (
    txid: Txid,
    executeType: ExecuteType,
    to: Array<string>,
    nonce: Array<Nonce> = [],
    subAccountId: number,
    data: _data = [[]],
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<TxnResult> => {
    const service = await this.check(canisterId);
    let subAccount = [];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    if (
      (isPlug() && nonce && Number(nonce[0]) === 0) ||
      (isInfinity() && nonce && Number(nonce[0]) === 0)
    ) {
      nonce = [];
    }
    const res = await service.drc20_executeTransfer(
      txid,
      executeType,
      to,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public getCoinSeconds = async (
    address: Array<string>,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<[CoinSeconds, Array<CoinSeconds>]> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_getCoinSeconds(address);
  };
  public getMaxSupply = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<Array<bigint>> => {
    const service = await this.check(canisterId, false, false);
    return await service.ictokens_maxSupply();
  };
  public drc20_transferBatch = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
    to: Array<string>,
    amount: Array<bigint>,
    nonce: Array<Nonce> = [],
    subAccountId: number,
    data: _data = [[]]
  ): Promise<Array<TxnResult>> => {
    const service = await this.check(canisterId);
    let subAccount = [];
    if (subAccountId) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    if (
      (isPlug() && nonce && Number(nonce[0]) === 0) ||
      (isInfinity() && nonce && Number(nonce[0]) === 0)
    ) {
      nonce = [];
    }
    try {
      const res = await service.drc20_transferBatch(
        to,
        amount,
        nonce,
        subAccount,
        data
      );
      return SerializableIC(res);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
