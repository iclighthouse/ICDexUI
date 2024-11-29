import Service, {
  icBTCEvents,
  MinterInfo,
  RetrieveBtcArgs,
  RetrieveBtcRes,
  RetrieveBtcStatus,
  RetrieveStatus,
  UpdateBalanceRes
} from '@/ic/ckbtcMinter/model';
import IDL from './ckBTCMinter.did.js';
import icIDL from './icBTCMinter.did.js';
import {
  fromSubAccountId,
  hexToBytes,
  principalToAccountIdentifier,
  SerializableIC
} from '@/ic/converter';

import { Icrc1Account } from '@/ic/common/icType';
import {
  CK_BTC_MINTER_CANISTER_ID,
  IC_BTC_MINTER_CANISTER_ID
} from '@/ic/utils';
import { Principal } from '@dfinity/principal';
import { createService } from '@/ic/createService';

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
    return await createService<Service>(canisterId, idl, renew, isUpdate);
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
      // const res = await service.get_withdrawal_account(address);
      const subaccount = Array.from(
        hexToBytes(principalToAccountIdentifier(Principal.fromText(principal)))
      );
      const res: Icrc1Account = {
        owner: Principal.fromText(IC_BTC_MINTER_CANISTER_ID),
        subaccount: [subaccount]
      };
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
    const service = await this.check(type, false, false);
    return await service.get_minter_info();
  };
  public retrieveLog = async (
    type: string,
    blockIndex: Array<number>
  ): Promise<Array<RetrieveStatus>> => {
    const service = await this.check(type, false, false);
    const res = await service.retrieval_log(blockIndex);
    return SerializableIC(res);
  };
  public estimate_fee = async (
    type: string,
    request: { amount: Array<bigint> } = { amount: [] }
  ): Promise<bigint> => {
    const service = await this.check(type, false, false);
    try {
      const res = await service.estimate_withdrawal_fee(request);
      return res.bitcoin_fee;
    } catch (e) {
      console.log(e);
    }
  };
  public get_events = async (
    type: string,
    page: [bigint],
    size: [bigint]
  ): Promise<icBTCEvents> => {
    const service = await this.check(type, false, false);
    console.log(service);
    try {
      const res = await service.get_events(page, size);
      return SerializableIC(res);
    } catch (e) {
      console.log(e);
    }
  };
}
