import Service, {
  MinterInfo,
  RetrieveBtcArgs,
  RetrieveBtcRes,
  RetrieveBtcStatus,
  RetrieveStatus,
  UpdateBalanceRes
} from '@/ic/ckbtcMinter/model';
import { checkAuth } from '@/ic/CheckAuth';
import { buildService } from '@/ic/Service';
import { createIcxActor } from '@/ic/createIcxActor';
import { createPlugActor } from '@/ic/createPlugActor';
import IDL from './ckBTCMinter.did.js';
import icIDL from './icBTCMinter.did.js';
import store from '@/store';
import { fromSubAccountId, SerializableIC } from '@/ic/converter';
import { Icrc1Account } from '@/ic/common/icType';
import {
  CK_BTC_MINTER_CANISTER_ID,
  IC_BTC_MINTER_CANISTER_ID
} from '@/ic/utils';
import { createInfinityActor } from '@/ic/createInfinityActor';
import { Principal } from '@dfinity/principal';

export class ckBTCMinterService {
  private check = async (
    type: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    let canisterId;
    let idl;
    if (type === 'icBTC') {
      canisterId = IC_BTC_MINTER_CANISTER_ID;
      idl = icIDL;
    } else {
      canisterId = CK_BTC_MINTER_CANISTER_ID;
      idl = IDL;
    }
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew, canisterId);
    }
    let service: Service;
    if (!isUpdate) {
      service = buildService(null, idl, canisterId);
    } else if ((window as any).icx) {
      service = await createIcxActor(idl, canisterId);
    } else if (priList[principal] === 'Plug') {
      service = await createPlugActor(idl, canisterId);
    } else if (priList[principal] === 'Infinity') {
      service = await createInfinityActor(idl, canisterId);
    } else {
      service = buildService(
        store.getters['common/getIdentity'],
        idl,
        canisterId
      );
    }
    return service;
  };
  public getBtcAddress = async (
    type: string,
    subAccountId = 0
  ): Promise<string> => {
    const service = await this.check(type);
    let subAccount = [];
    if (subAccountId || subAccountId === 0) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    const principal = localStorage.getItem('principal');
    let address;
    if (type === 'icBTC') {
      address = {
        owner: Principal.from(principal),
        subaccount: subAccount
      };
    } else {
      address = {
        owner: [],
        subaccount: subAccount
      };
    }
    const res = await service.get_btc_address(address);
    const principal1 = localStorage.getItem('principal');
    if (principal === principal1) {
      return res;
    } else {
      return null;
    }
  };
  public getWithdrawalAccount = async (type: string): Promise<Icrc1Account> => {
    const service = await this.check(type);
    const principal = localStorage.getItem('principal');
    if (type === 'icBTC') {
      const address = {
        owner: Principal.from(principal),
        subaccount: []
      };
      const res = await service.get_withdrawal_account(address);
      const principal1 = localStorage.getItem('principal');
      if (principal === principal1) {
        return {
          owner: res.owner,
          subaccount: Array.from(res.subaccount)
        };
      } else {
        return null;
      }
    } else {
      const res = await service.get_withdrawal_account();
      const principal1 = localStorage.getItem('principal');
      if (principal === principal1) {
        return {
          owner: res.owner,
          subaccount: Array.from(res.subaccount)
        };
      } else {
        return null;
      }
    }
  };
  public retrieveBtc = async (
    type: string,
    retrieveBtcArgs: RetrieveBtcArgs
  ): Promise<RetrieveBtcRes> => {
    const service = await this.check(type);
    if (type === 'icBTC') {
      const res = await service.retrieve_btc(retrieveBtcArgs, []);
      return SerializableIC(res);
    } else {
      const res = await service.retrieve_btc(retrieveBtcArgs);
      return SerializableIC(res);
    }
  };
  public retrieveBtcStatus = async (
    type: string,
    blockIndex: bigint
  ): Promise<RetrieveBtcStatus> => {
    const service = await this.check(type, false, true);
    const res = await service.retrieve_btc_status({ block_index: blockIndex });
    return SerializableIC(res);
  };
  public updateBalance = async (
    type: string,
    subAccountId = 0
  ): Promise<UpdateBalanceRes> => {
    const service = await this.check(type);
    let subAccount = [];
    if (subAccountId) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    if (type === 'icBTC') {
      const principal1 = localStorage.getItem('principal');
      const res = await service.update_balance({
        owner: Principal.from(principal1),
        subaccount: subAccount
      });
      return SerializableIC(res);
    } else {
      const res = await service.update_balance({
        owner: [],
        subaccount: subAccount
      });
      return SerializableIC(res);
    }
  };
  public batchSend = async (
    type: string,
    request: Array<bigint> = []
  ): Promise<boolean> => {
    const service = await this.check(type);
    return await service.batch_send(request);
  };
  public info = async (type: string): Promise<MinterInfo> => {
    const service = await this.check(type);
    return await service.get_minter_info();
  };
  public retrieveLog = async (
    type: string,
    blockIndex: Array<number>
  ): Promise<Array<RetrieveStatus>> => {
    const service = await this.check(type);
    const res = await service.retrieveLog(blockIndex);
    return SerializableIC(res);
  };
  public estimate_fee = async (
    type: string,
    request: { amount: Array<bigint> } = { amount: [] }
  ): Promise<bigint> => {
    const service = await this.check(type);
    try {
      const res = await service.estimate_withdrawal_fee(request);
      return res.bitcoin_fee;
    } catch (e) {
      console.log(e);
    }
  };
}
