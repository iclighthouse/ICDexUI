import Service, {
  Config,
  FeeStatus,
  Liquidity,
  LpRewards,
  Txid,
  TxnRecord,
  TxnResultErr,
  TxnResultOk,
  YieldResponse
} from '@/ic/cyclesFinance/model';
import { buildService } from '@/ic/Service';
import cyclesFinanceIDL from './cyclesFinance.did';
import { CYCLES_FINANCE_CANISTER_ID } from '@/ic/utils';
import { Principal } from '@dfinity/principal';
import { checkAuth } from '@/ic/CheckAuth';
import { AccountIdentifier } from '@/ic/common/icType';
import store from '@/store';
import { createPlugActor } from '@/ic/createPlugActor';
import { createIcxActor } from '@/ic/createIcxActor';
import { createInfinityActor } from '@/ic/createInfinityActor';
import { isInfinity } from '@/ic/isInfinity';
import { isPlug } from '@/ic/isPlug';
import { SerializableIC } from '@/ic/converter';

export class CyclesFinanceService {
  private service: Service;
  // private readonly host: string;
  // constructor(identity: Identity, host?: string) {
  //   this.host = host;
  //   this.service = buildService(
  //     identity,
  //     cyclesFinanceIDL,
  //     CYCLES_FINANCE_CANISTER_ID,
  //     host
  //   );
  // }
  private check = async (renew = true, isUpdate = true): Promise<Service> => {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal) {
      await checkAuth(renew);
    }
    if (!isUpdate) {
      this.service = buildService(
        null,
        cyclesFinanceIDL,
        CYCLES_FINANCE_CANISTER_ID
      );
    } else if ((window as any).icx) {
      this.service = await createIcxActor(
        cyclesFinanceIDL,
        CYCLES_FINANCE_CANISTER_ID
      );
    } else if (priList[principal] === 'Plug') {
      this.service = await createPlugActor(
        cyclesFinanceIDL,
        CYCLES_FINANCE_CANISTER_ID
      );
    } else if (priList[principal] === 'Infinity') {
      this.service = await createInfinityActor(
        cyclesFinanceIDL,
        CYCLES_FINANCE_CANISTER_ID
      );
    } else {
      this.service = buildService(
        store.getters['common/getIdentity'],
        cyclesFinanceIDL,
        CYCLES_FINANCE_CANISTER_ID
      );
    }
    return this.service;
  };
  public getAccountId = async (
    accountId: AccountIdentifier
  ): Promise<string> => {
    const service = await this.check(false, false);
    return await service.getAccountId(accountId);
  };
  public liquidity = async (
    account: Array<AccountIdentifier> = []
  ): Promise<Liquidity> => {
    const service = await this.check(false, false);
    const res = await service.liquidity(account);
    return SerializableIC(res);
  };
  public icpToCycles = async (
    icp: BigInt,
    cyclesPrincipal: Principal,
    nonce: Array<bigint> = [],
    subaccount: Array<Array<number>> = [[]],
    data: Array<Array<number>> = [[]]
  ): Promise<TxnResultOk> => {
    return new Promise((resolve, reject) => {
      if (
        (isPlug() && nonce && Number(nonce[0]) === 0) ||
        (isInfinity() && nonce && Number(nonce[0]) === 0)
      ) {
        nonce = [];
      }
      this.check().then((service) => {
        service
          .icpToCycles(icp, cyclesPrincipal, nonce, subaccount, data)
          .then((txnResult) => {
            txnResult = SerializableIC(txnResult);
            if (
              (
                txnResult as {
                  err: TxnResultErr;
                }
              ).err
            ) {
              reject(
                (
                  txnResult as {
                    err: TxnResultErr;
                  }
                ).err
              );
            } else {
              resolve(
                (
                  txnResult as {
                    ok: TxnResultOk;
                  }
                ).ok
              );
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    });
  };
  public lastTxids = async (
    accountId: Array<AccountIdentifier>
  ): Promise<Array<Txid>> => {
    const service = await this.check(false, false);
    const res =  await service.lastTxids(accountId);
    return SerializableIC(res);
  };
  public txnRecord = async (txid: Txid): Promise<TxnRecord> => {
    await this.check(false, false);
    const recode = await this.service.txnRecord(txid);
    if (recode && recode.length) {
      return SerializableIC(recode[0]);
    }
  };
  // public getSwapRecord = async (
  //   accountId: Array<AccountIdentifier>
  // ): Promise<Array<TxnRecord>> => {
  //   await this.check();
  //   const txids = await this.lastTxids(accountId);
  //   console.log(txids);
  //   let recordList: Array<TxnRecord> = [];
  //   const promiseAllValue = [];
  //   for (let i = 0; i < txids.length; i++) {
  //     promiseAllValue.push(this.txnRecord(txids[i]));
  //   }
  //   recordList = await Promise.all(promiseAllValue);
  //   return recordList;
  // };
  public claim = async (
    cyclesWallet: Principal,
    nonce: Array<bigint> = [],
    subaccount: Array<Array<number>> = [[]],
    data: Array<Array<number>> = [[]]
  ): Promise<TxnResultOk> => {
    return new Promise((resolve, reject) => {
      if (
        (isPlug() && nonce && Number(nonce[0]) === 0) ||
        (isInfinity() && nonce && Number(nonce[0]) === 0)
      ) {
        nonce = [];
      }
      this.check().then((service) => {
        service
          .claim(cyclesWallet, nonce, subaccount, data)
          .then((txnResult) => {
            txnResult = SerializableIC(txnResult);
            if (
              (
                txnResult as {
                  err: TxnResultErr;
                }
              ).err
            ) {
              reject(
                (
                  txnResult as {
                    err: TxnResultErr;
                  }
                ).err
              );
            } else {
              resolve(
                (
                  txnResult as {
                    ok: TxnResultOk;
                  }
                ).ok
              );
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    });
  };
  public remove = async (
    shares: Array<bigint>,
    cyclesWallet: Principal,
    nonce: Array<bigint> = [],
    subaccount: Array<Array<number>> = [[]],
    data: Array<Array<number>> = [[]]
  ): Promise<TxnResultOk> => {
    return new Promise((resolve, reject) => {
      if (
        (isPlug() && nonce && Number(nonce[0]) === 0) ||
        (isInfinity() && nonce && Number(nonce[0]) === 0)
      ) {
        nonce = [];
      }
      this.check().then((service) => {
        service
          .remove(shares, cyclesWallet, nonce, subaccount, data)
          .then((txnResult) => {
            txnResult = SerializableIC(txnResult)
            if (
              (
                txnResult as {
                  err: TxnResultErr;
                }
              ).err
            ) {
              reject(
                (
                  txnResult as {
                    err: TxnResultErr;
                  }
                ).err
              );
            } else {
              resolve(
                (
                  txnResult as {
                    ok: TxnResultOk;
                  }
                ).ok
              );
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    });
  };
  public feeStatus = async (): Promise<FeeStatus> => {
    const service = await this.check(false, false);
    return await service.feeStatus();
  };
  public getCount = async (
    accountId: Array<AccountIdentifier> = []
  ): Promise<bigint> => {
    const service = await this.check(false, false);
    return await service.count(accountId);
  };
  public getEvents = async (
    accountId: Array<AccountIdentifier> = []
  ): Promise<Array<TxnRecord>> => {
    const service = await this.check(false, false);
    const res = await service.getEvents(accountId);
    return SerializableIC(res);
  };
  public getConfig = async (): Promise<Config> => {
    const service = await this.check(false, false);
    return await service.getConfig();
  };
  public getYield = async (): Promise<YieldResponse> => {
    const service = await this.check(false, false);
    return await service.yield();
  };
  public getLpRewards = async (address: string): Promise<LpRewards> => {
    const service = await this.check(false, false);
    return await service.lpRewards(address);
  };
  public withdraw = async (
    subaccount: Array<Array<number>> = [[]]
  ): Promise<void> => {
    const service = await this.check();
    return await service.withdraw(subaccount);
  };
}
