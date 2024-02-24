import { Principal } from '@dfinity/principal';
import Service, {
  Address,
  ApproveArgs,
  ApproveResponse,
  DRC207Support,
  Drc20Allowance,
  IcrcMetadata,
  IcrcReceipt,
  TxnQueryRequest,
  TxnRecord,
  TxReceipt
} from './model';
import DRC20IDL from './DRC20Token.did';
import OGYIDL from './OGYToken.did';
import OGYICRCIDL from './OGYICRCToken.did';
import {
  AccountIdentifier,
  BlockHeight,
  CanisterId,
  Decimals,
  Gas,
  Icrc1Account,
  Metadata,
  PrincipalString,
  TokenInfo,
  TotalSupply,
  Txid
} from '../common/icType';
import {
  _data,
  Amount,
  CoinSeconds,
  ExecuteType,
  Nonce,
  TxnQueryResponse,
  TxnResult
} from '@/ic/ICLighthouseToken/model';
import {
  getSubAccountArray,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_TOKEN_CANISTER_ID,
  OGY_CANISTER_ID
} from '@/ic/utils';
import {
  fromSubAccountId,
  principalToAccountIdentifier,
  SerializableIC
} from '@/ic/converter';
import { isInfinity } from '@/ic/isInfinity';
import { isPlug } from '@/ic/isPlug';
import { Allowance, AllowanceArgs, SendICPTsRequest } from '@/ic/ledger/model';
import { createService } from '@/ic/createService';

const OGYTokenId = 'jwcfb-hyaaa-aaaaj-aac4q-cai';

export class DRC20TokenService {
  private check = async (
    canisterId: string,
    renew = true,
    isUpdate = true
  ): Promise<Service> => {
    let idl = DRC20IDL;
    if (canisterId === OGY_CANISTER_ID) {
      idl = OGYIDL;
    } else if (canisterId === OGYTokenId) {
      idl = OGYICRCIDL;
    }
    return await createService<Service>(canisterId, idl, renew, isUpdate);
  };
  public decimals = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<Decimals> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_decimals();
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
  public metadata = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<Array<Metadata>> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_metadata();
  };
  public name = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<string> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_name();
  };
  public tokenName = async (canisterId: string): Promise<string> => {
    const service = await this.check(canisterId, false, false);
    return await service.name();
  };
  public symbol = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<string> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_symbol();
  };
  public totalSupply = async (
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<TotalSupply> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_totalSupply();
  };
  public txnQuery = async (
    request: TxnQueryRequest,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<TxnQueryResponse> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.drc20_txnQuery(request);
    return SerializableIC(res);
  };
  public drc207 = async (canisterId: string): Promise<DRC207Support> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc207();
  };
  public drc202_events = async (
    canisterId: string,
    address: Array<Address> = []
  ): Promise<Array<TxnRecord>> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.drc202_events(address);
    return SerializableIC(res);
  };
  public drc202_txn = async (
    canisterId: string,
    txid: Txid
  ): Promise<Array<TxnRecord>> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.drc202_txn(txid);
    return SerializableIC(res);
  };
  public drc20_balanceOf = async (
    principal: PrincipalString,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
    subAccount: Uint8Array = new Uint8Array(fromSubAccountId(0))
  ): Promise<Amount> => {
    const service = await this.check(canisterId, false, false);
    const account = principalToAccountIdentifier(
      Principal.fromText(principal),
      subAccount
    );
    return await service.drc20_balanceOf(account);
  };
  public balanceOf = async (
    canisterId: string,
    account: Principal
  ): Promise<bigint> => {
    try {
      const service = await this.check(canisterId, false, false);
      return await service.balanceOf(account);
    } catch (e) {
      return null;
    }
  };
  public drc20_allowance = async (
    ICTokensId: PrincipalString,
    spender: PrincipalString = IC_TOKEN_CANISTER_ID,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<Amount> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_allowance(ICTokensId, spender);
  };
  public allowance = async (
    canisterId: string,
    principal: Principal,
    principalSpender: Principal
  ): Promise<bigint> => {
    const service = await this.check(canisterId, false, false);
    return await service.allowance(principal, principalSpender);
  };
  // dip20
  public getMetadata = async (canisterId: string): Promise<TokenInfo> => {
    const service = await this.check(canisterId, false, false);
    return await service.getMetadata();
  };
  public drc20Approve = async (
    amount: Amount,
    data: _data = [[]],
    spender = IC_TOKEN_CANISTER_ID,
    nonce: Array<Nonce> = [],
    subAccountId = 0,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<TxnResult> => {
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
    const res = await service.drc20_approve(
      spender,
      amount,
      nonce,
      subAccount,
      data
    );
    return SerializableIC(res);
  };
  public approve = async (
    canisterId: string,
    spender: Principal,
    amount: Amount
  ): Promise<TxReceipt> => {
    const service = await this.check(canisterId);
    const res = await service.approve(spender, amount);
    return SerializableIC(res);
  };
  public transfer = async (
    canisterId: string,
    principal: Principal,
    amount: Amount
  ): Promise<TxReceipt> => {
    const service = await this.check(canisterId);
    const res = await service.transfer(principal, amount);
    return SerializableIC(res);
  };
  public getTokenFee = async (canisterId: string): Promise<bigint> => {
    const service = await this.check(canisterId, false, false);
    return await service.getTokenFee();
  };
  public icrcDecimals = async (canisterId: string): Promise<Decimals> => {
    const service = await this.check(canisterId, false, false);
    return await service.icrc1_decimals();
  };
  public icrcName = async (canisterId: string): Promise<string> => {
    const service = await this.check(canisterId, false, false);
    return await service.icrc1_name();
  };
  public icrcSymbol = async (canisterId: string): Promise<string> => {
    const service = await this.check(canisterId, false, false);
    return await service.icrc1_symbol();
  };
  public icrcTotalSupply = async (canisterId: string): Promise<TotalSupply> => {
    const service = await this.check(canisterId, false, false);
    return await service.icrc1_total_supply();
  };
  public icrcFee = async (canisterId: string): Promise<bigint> => {
    const service = await this.check(canisterId, false, false);
    return await service.icrc1_fee();
  };
  public icrc1Metadata = async (canisterId: string): Promise<IcrcMetadata> => {
    const service = await this.check(canisterId, false, false);
    return await service.icrc1_metadata();
  };
  public icrc1Transfer = async (
    canisterId: string,
    amount: bigint,
    to: Icrc1Account,
    memo: Array<Array<number>> = [],
    fee: Array<bigint> = [],
    fromSubaccountId = 0,
    created_at_time = []
  ): Promise<IcrcReceipt> => {
    const service = await this.check(canisterId);
    const transferArgs = {
      to: to,
      fee: [],
      memo: memo,
      from_subaccount: [getSubAccountArray(fromSubaccountId)],
      created_at_time: created_at_time,
      amount: amount
    };
    console.log(transferArgs);
    // const args = IDL.encode(
    //   [
    //     IDL.Record({
    //       to: IDL.Record({
    //         owner: IDL.Principal,
    //         subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
    //       }),
    //       fee: IDL.Opt(IDL.Nat),
    //       memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    //       from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    //       created_at_time: IDL.Opt(IDL.Nat64),
    //       amount: IDL.Nat
    //     })
    //   ],
    //   [transferArgs]
    // );
    // senderSig(
    //   store.getters['common/getIdentity'],
    //   canisterId,
    //   'call',
    //   'icrc1_transfer',
    //   args
    // ).then((res) => {
    //   console.log(toHexString(new Uint8Array(res)));
    // });
    const res = await service.icrc1_transfer(transferArgs);
    console.log(res);
    return SerializableIC(res);
  };
  public icrc1_balance_of = async (
    canisterId: string,
    to: Icrc1Account
  ): Promise<bigint> => {
    const service = await this.check(canisterId, false, false);
    return await service.icrc1_balance_of(to);
  };
  public getMaxSupply = async (canisterId: string): Promise<bigint> => {
    const service = await this.check(canisterId, false, false);
    return await service.ictokens_maxSupply();
  };
  public icpStandardTransfer = async (
    canisterId: string,
    amount: bigint,
    fee: bigint,
    to: AccountIdentifier,
    memo = BigInt('0'),
    subaccountId = 0
  ): Promise<BlockHeight> => {
    try {
      const service = await this.check(canisterId);
      const request: SendICPTsRequest = {
        from_subaccount: [getSubAccountArray(subaccountId)],
        to: to,
        amount: {
          e8s: amount
        },
        fee: {
          e8s: fee
        },
        memo: memo,
        created_at_time: []
      };
      console.log(request);
      return await service.send_dfx(request);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public icrc2_approve = async (
    canisterId: string,
    spender: Icrc1Account,
    amount: Amount,
    from_subaccount = []
  ): Promise<ApproveResponse> => {
    const service = await this.check(canisterId);
    const approveArgs: ApproveArgs = {
      fee: [],
      memo: [],
      from_subaccount: from_subaccount,
      created_at_time: [],
      amount: amount,
      expected_allowance: [],
      expires_at: [],
      spender: spender
    };
    try {
      return await service.icrc2_approve(approveArgs);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public icrc2_allowance = async (
    canisterId: string,
    allowanceArgs: AllowanceArgs
  ): Promise<Allowance> => {
    const service = await this.check(canisterId, false, false);
    try {
      return await service.icrc2_allowance(allowanceArgs);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public standard = async (canisterId: string): Promise<string> => {
    const service = await this.check(canisterId, false, false);
    try {
      return await service.standard();
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public icrc1_supported_standards = async (
    canisterId: string
  ): Promise<Array<{ url: string; name: string }>> => {
    const service = await this.check(canisterId, false, false);
    try {
      return await service.icrc1_supported_standards();
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public drc20_transfer = async (
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
  public getCoinSeconds = async (
    address: Array<string>,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<[CoinSeconds, Array<CoinSeconds>]> => {
    const service = await this.check(canisterId, false, false);
    return await service.drc20_getCoinSeconds(address);
  };
  public approvals = async (
    user: PrincipalString,
    canisterId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID
  ): Promise<Array<Drc20Allowance>> => {
    const service = await this.check(canisterId, false, false);
    const res = await service.drc20_approvals(user);
    return SerializableIC(res);
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
}
