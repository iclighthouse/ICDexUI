import Service, {
  BlockHeight,
  ckETHEvent,
  ClaimRes,
  DepositTxn,
  EthAddress,
  ETHUpdateRes,
  icETHEvents,
  IcTokenInfo,
  MinterInfo,
  PendingDepositTxn,
  RetrieveRes,
  RetrieveStatus,
  RetrievingToken,
  TxIndex,
  TxStatus,
  Wei
} from '@/ic/ckETHMinter/model';
import { Principal } from '@dfinity/principal';
import IDL from '@/ic/ckETHMinter/ckETHMinter.did';
import { IC_ETH_MINTER_CANISTER_ID } from '@/ic/utils';
import {
  fromSubAccountId,
  hexToBytes,
  principalToAccountIdentifier,
  SerializableIC
} from '@/ic/converter';
import { Icrc1Account, Time } from '@/ic/common/icType';
import { createService } from '@/ic/createService';
export class ckETHMinterService {
  private check = async (renew = true, isUpdate = true): Promise<Service> => {
    return await createService<Service>(
      IC_ETH_MINTER_CANISTER_ID,
      IDL,
      renew,
      isUpdate
    );
  };
  public getEthAddress = async (subAccountId = 0): Promise<string> => {
    const service = await this.check(false, false);
    let subAccount = [];
    if (subAccountId) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    const principal = localStorage.getItem('principal');
    try {
      const res = await service.get_deposit_address({
        owner: Principal.from(principal),
        subaccount: subAccount
      });
      const principal1 = localStorage.getItem('principal');
      if (principal === principal1) {
        return res;
      } else {
        return null;
      }
    } catch (e) {
    }
    return null;
  };
  public getMinterAddress = async (): Promise<[string, BigInt]> => {
    const service = await this.check();
    try {
      return await service.get_minter_address();
    } catch (e) {
    }
    return null;
  };
  public updateBalance = async (
    tokenId: Array<string> = [],
    subAccountId = 0
  ): Promise<ETHUpdateRes> => {
    const service = await this.check();
    let subAccount = [];
    if (subAccountId) {
      subAccount = [fromSubAccountId(subAccountId)];
    }
    const principal = localStorage.getItem('principal');
    try {
      const res = await service.update_balance(tokenId, {
        owner: Principal.from(principal),
        subaccount: subAccount
      });
      return SerializableIC(res);
    } catch (e) {
    }
    return null;
  };
  public getEthTx = async (txIndex: TxIndex): Promise<Array<TxStatus>> => {
    const service = await this.check(false, false);
    try {
      const res = await service.get_tx(txIndex);
      return SerializableIC(res);
    } catch (e) {
    }
    return null;
  };
  public getWithdrawalAccount = async (): Promise<Icrc1Account> => {
    const service = await this.check();
    try {
      const principal = localStorage.getItem('principal');
      // const res = await service.get_withdrawal_account({
      //   owner: Principal.from(principal),
      //   subaccount: []
      // });
      const subaccount = Array.from(
        hexToBytes(principalToAccountIdentifier(Principal.fromText(principal)))
      );
      const res: Icrc1Account = {
        owner: Principal.fromText(IC_ETH_MINTER_CANISTER_ID),
        subaccount: [subaccount]
      };
      const principal1 = localStorage.getItem('principal');
      if (principal === principal1) {
        return SerializableIC(res);
      } else {
        return null;
      }
    } catch (e) {
    }
    return null;
  };
  public retrieve = async (
    ethAddress: string,
    amount: bigint,
    tokenId: Array<string> = [],
    subAccountId = 0
  ): Promise<RetrieveRes> => {
    const service = await this.check();
    try {
      let subAccount = [];
      if (subAccountId) {
        subAccount = [fromSubAccountId(subAccountId)];
      }
      const res = await service.retrieve(
        tokenId,
        ethAddress,
        amount,
        subAccount
      );
      return SerializableIC(res);
    } catch (e) {
    }
    return null;
  };
  public retrievalList = async (
    subAccountId = 0
  ): Promise<Array<RetrieveStatus>> => {
    const service = await this.check();
    try {
      let subAccount = [];
      if (subAccountId) {
        subAccount = [fromSubAccountId(subAccountId)];
      }
      const principal = localStorage.getItem('principal');
      const res = await service.get_retrieval_list({
        owner: Principal.from(principal),
        subaccount: subAccount
      });
      return SerializableIC(res);
    } catch (e) {
    }
    return null;
  };
  public retrieval = async (
    txIndex: TxIndex
  ): Promise<Array<RetrieveStatus>> => {
    const service = await this.check();
    try {
      const principal = localStorage.getItem('principal');
      const res = await service.get_retrieval(txIndex);
      const principal1 = localStorage.getItem('principal');
      if (principal === principal1) {
        return SerializableIC(res);
      } else {
        return null;
      }
    } catch (e) {
    }
    return null;
  };
  public coverTx = async (
    txIndex: TxIndex,
    subAccountId = 0
  ): Promise<Array<BlockHeight>> => {
    const service = await this.check();
    try {
      let subAccount = [];
      if (subAccountId) {
        subAccount = [fromSubAccountId(subAccountId)];
      }
      const res = await service.cover_tx(txIndex, subAccount);
      return res;
    } catch (e) {
      return null;
    }
  };
  public updateRetrievals = async (): Promise<Array<[TxStatus, bigint]>> => {
    const service = await this.check();
    try {
      const res = await service.update_retrievals();
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public getCkTokens = async (): Promise<Array<[EthAddress, IcTokenInfo]>> => {
    const service = await this.check(false, false);
    try {
      const res = await service.get_ck_tokens();
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  // public getDepositing = async (
  //   tokenId: Array<string> = [],
  //   subAccountId = 0
  // ): Promise<[Wei, Array<TxIndex>]> => {
  //   const service = await this.check();
  //   try {
  //     let subAccount = [];
  //     if (subAccountId) {
  //       subAccount = [fromSubAccountId(subAccountId)];
  //     }
  //     const principal = localStorage.getItem('principal');
  //     return await service.get_depositing(tokenId, {
  //       owner: Principal.from(principal),
  //       subaccount: subAccount
  //     });
  //   } catch (e) {
  //     
  //     return null;
  //   }
  // };
  public getDepositing = async (
    token: RetrievingToken,
    subAccountId = 0
  ): Promise<Array<[Wei, Array<TxIndex>, Array<TxStatus>]>> => {
    const service = await this.check(false, false);
    try {
      let subAccount = [];
      if (subAccountId) {
        subAccount = [fromSubAccountId(subAccountId)];
      }
      const principal = localStorage.getItem('principal');
      const res = await service.get_depositing_all(token, [
        {
          owner: Principal.from(principal),
          subaccount: subAccount
        }
      ]);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public getRetrieving = async (
    token: RetrievingToken,
    subAccountId = 0
  ): Promise<Array<[TxIndex, TxStatus, Time]>> => {
    const service = await this.check(false, false);
    try {
      let subAccount = [];
      if (subAccountId) {
        subAccount = [fromSubAccountId(subAccountId)];
      }
      const principal = localStorage.getItem('principal');
      const res = await service.get_retrieving_all(token, [
        {
          owner: Principal.from(principal),
          subaccount: subAccount
        }
      ]);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public getMinterInfo = async (): Promise<MinterInfo> => {
    const service = await this.check(false, false);
    try {
      const res = await service.get_minter_info();
      return res as MinterInfo;
    } catch (e) {
      return null;
    }
  };
  public getAccountEvents = async (
    account: Array<number>
  ): Promise<Array<[ckETHEvent, Time]>> => {
    const service = await this.check(false, false);
    try {
      const res = await service.get_account_events(account);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public claim = async (
    txHash: string,
    signature: Array<number>,
    subAccountId = 0
  ): Promise<ClaimRes> => {
    const service = await this.check();
    try {
      let subAccount = [];
      if (subAccountId) {
        subAccount = [fromSubAccountId(subAccountId)];
      }
      const principal = localStorage.getItem('principal');
      const res = await service.claim(
        {
          owner: Principal.from(principal),
          subaccount: subAccount
        },
        txHash,
        signature
      );
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public getPendingDepositTxn = async (
    txHash: string
  ): Promise<Array<PendingDepositTxn>> => {
    const service = await this.check(false, false);
    try {
      const res = await service.get_mode2_pending_deposit_txn(txHash);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public updateClaims = async (): Promise<void> => {
    const service = await this.check();
    try {
      return service.update_claims();
    } catch (e) {
      return null;
    }
  };
  public getMode2PendingAll = async (
    token: RetrievingToken,
    subAccountId = 0
  ): Promise<Array<[DepositTxn, Time, boolean]>> => {
    const service = await this.check();
    try {
      let subAccount = [];
      if (subAccountId) {
        subAccount = [fromSubAccountId(subAccountId)];
      }
      const principal = localStorage.getItem('principal');
      const res = await service.get_mode2_pending_all(token, [
        {
          owner: Principal.from(principal),
          subaccount: subAccount
        }
      ]);
      return SerializableIC(res);
    } catch (e) {
      return null;
    }
  };
  public get_events = async (
    page: [bigint],
    size: [bigint]
  ): Promise<icETHEvents> => {
    const service = await this.check(false, false);
    const res = await service.get_events(page, size);
    return SerializableIC(res);
  };
}
