import { getSubAccountArray, LEDGER_CANISTER_ID } from '../utils';
import Service, {
  AccountBalanceArgsT,
  Allowance,
  AllowanceArgs,
  GetBalancesRequest,
  ICP,
  NotifyCanisterRequest,
  Result_1,
  SendICPTsRequest
} from './model';
import {
  AccountIdentifier,
  BlockHeight,
  E8s,
  Icrc1Account
} from '../common/icType';
import BigNumber from 'bignumber.js';
// @ts-ignore
import ledgerIDL from './ledger.did.js';
import { isPlug } from '@/ic/isPlug';
import { ApproveArgs } from '@/ic/DRC20Token/model';
import { Amount } from '@/ic/ICLighthouseToken/model';
import { createService } from '@/ic/createService';
const decimals = 8;
export class LedgerService {
  private service: Service;
  private check = async (renew = true, isUpdate = true): Promise<void> => {
    this.service = await createService<Service>(
      LEDGER_CANISTER_ID,
      ledgerIDL,
      renew,
      isUpdate
    );
  };
  public getBalances = async (
    request: GetBalancesRequest
  ): Promise<Record<AccountIdentifier, E8s>> => {
    await this.check(false, false);
    return await this.service.account_balance_dfx(request);
  };
  public sendIcp = async (
    icp: string,
    to: AccountIdentifier,
    memo = BigInt('0'),
    subaccountId = 0,
    fee = 0.0001
  ): Promise<BlockHeight> => {
    await this.check();
    const amount = BigInt(
      new BigNumber(icp).times(10 ** decimals).toString(10)
    );
    const request: SendICPTsRequest = {
      from_subaccount: [getSubAccountArray(subaccountId)],
      to: to,
      amount: {
        e8s: amount
      },
      fee: {
        e8s: BigInt(new BigNumber(fee).times(10 ** decimals).toString(10))
      },
      memo: memo,
      created_at_time: []
    };
    console.log(request);
    return await this.service.send_dfx(request);
    // if (isPlug()) {
    //   const params = {
    //     to: to,
    //     amount: Number(amount),
    //     opts: {
    //       memo: memo.toString(10),
    //       from_subaccount: subaccountId
    //     }
    //   };
    //   const Ic = (window as any).ic.plug;
    //   console.log(params);
    //   const res = await Ic.requestTransfer(params);
    //   console.log(res);
    //   if (res.height) {
    //     if (typeof res.height === 'object' && res.height.height) {
    //       return res.height.height;
    //     }
    //   }
    //   return res.height;
    // } else {
    //   const request: SendICPTsRequest = {
    //     from_subaccount: [getSubAccountArray(subaccountId)],
    //     to: to,
    //     amount: {
    //       e8s: amount
    //     },
    //     fee: {
    //       e8s: BigInt(new BigNumber(fee).times(10 ** decimals).toString(10))
    //     },
    //     memo: memo,
    //     created_at_time: []
    //   };
    //   console.log(request);
    //   return await this.service.send_dfx(request);
    // }
  };
  public notifyDfx = async (
    request: NotifyCanisterRequest
  ): Promise<Uint8Array> => {
    await this.check();
    return await this.service.notify_dfx(request);
  };
  public account_balance = async (
    request: AccountBalanceArgsT
  ): Promise<ICP> => {
    await this.check(false, false);
    return await this.service.account_balance(request);
  };
  public icrc2_approve = async (
    spender: Icrc1Account,
    amount: Amount
  ): Promise<Result_1> => {
    await this.check();
    const approveArgs: ApproveArgs = {
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: amount,
      expected_allowance: [],
      expires_at: [],
      spender: spender
    };
    try {
      return await this.service.icrc2_approve(approveArgs);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public icrc2_allowance = async (
    allowanceArgs: AllowanceArgs
  ): Promise<Allowance> => {
    await this.check(false, false);
    try {
      return await this.service.icrc2_allowance(allowanceArgs);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public TransferFrom = async (
    from: Icrc1Account,
    to: Icrc1Account,
    amount: Amount
  ): Promise<any> => {
    await this.check();
    const approveArgs = {
      to: to,
      from: from,
      fee: [],
      spender_subaccount: [],
      memo: [],
      created_at_time: [],
      amount: amount
    };
    try {
      return await this.service.icrc2_transfer_from(approveArgs);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
