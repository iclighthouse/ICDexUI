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
import cyclesFinanceIDL from './cyclesFinance.did';
import { CYCLES_FINANCE_CANISTER_ID } from '@/ic/utils';
import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@/ic/common/icType';
import { isInfinity } from '@/ic/isInfinity';
import { isPlug } from '@/ic/isPlug';
import { SerializableIC } from '@/ic/converter';
import { createService } from '@/ic/createService';

export class CyclesFinanceService {
  private check = async (renew = true, isUpdate = true): Promise<Service> => {
    return await createService<Service>(
      CYCLES_FINANCE_CANISTER_ID,
      cyclesFinanceIDL,
      renew,
      isUpdate
    );
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
    const res = await service.lastTxids(accountId);
    return SerializableIC(res);
  };
  public txnRecord = async (txid: Txid): Promise<TxnRecord> => {
    const service = await this.check(false, false);
    const recode = await service.txnRecord(txid);
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
