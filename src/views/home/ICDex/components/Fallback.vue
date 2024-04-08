<template>
  <a-modal
    v-model="fallbackVisible"
    width="850px"
    centered
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="fallback-modal-table"
  >
    <a-spin :spinning="tableSpinning">
      <div class="fallback-modal-table-main">
        <table>
          <thead>
            <tr>
              <th>Nonce</th>
              <th>Txid</th>
              <th>{{ currentPair[1][0].token0[1] }} Balance</th>
              <th>{{ currentPair[1][0].token1[1] }} Balance</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-show="currentPage === 1">
              <td>-</td>
              <td>Pair Account</td>
              <td>
                <span
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()]
                  "
                >
                  {{
                    depositToken0
                      | bigintToFloat(
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                      | formatAmount(
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                  }}
                </span>
              </td>
              <td>
                <span
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  {{
                    depositToken1
                      | bigintToFloat(
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                      | formatAmount(
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                  }}
                </span>
              </td>
              <td>
                <span
                  v-if="
                    modeDisabled ||
                    (depositToken0 === '0' && depositToken1 === '0')
                  "
                  class="base-font"
                  >-</span
                >
                <span v-else class="can-click" @click="depositFallback"
                  >Fallback</span
                >
              </td>
            </tr>
            <tr v-show="currentPage === 1">
              <td>-</td>
              <td>Pro-trade Deposit Account</td>
              <td>
                <span
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()]
                  "
                >
                  {{
                    depositToken0Pro
                      | bigintToFloat(
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                      | formatAmount(
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                  }}
                </span>
              </td>
              <td>
                <span
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  {{
                    depositToken1Pro
                      | bigintToFloat(
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                      | formatAmount(
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                  }}
                </span>
              </td>
              <td>
                <span
                  v-if="
                    modeDisabled ||
                    (depositToken0Pro === '0' && depositToken1Pro === '0')
                  "
                  class="base-font"
                  >-</span
                >
                <span v-else class="can-click" @click="depositFallback(1)"
                  >Fallback</span
                >
              </td>
            </tr>
            <tr v-for="index in nonceList" :key="index">
              <td>{{ index }}</td>
              <td>
                <copy-account
                  class="pc-show"
                  :front="10"
                  :is-copy="false"
                  :href="`https://ic.house/swap/${currentPair[0].toString()}/${getTxid(
                    index
                  )}`"
                  :account="getTxid(index)"
                  copyText="Txid"
                ></copy-account>
                <copy-account
                  class="h5-show"
                  :front="1"
                  :show-copy="false"
                  :is-copy="false"
                  :href="`https://ic.house/swap/${currentPair[0].toString()}/${getTxid(
                    index
                  )}`"
                  :account="getTxid(index)"
                  copyText="Txid"
                ></copy-account>
              </td>
              <td>
                <span
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokenBalance[getTxidAccount(index)[1]]
                  "
                >
                  {{
                    tokenBalance[getTxidAccount(index)[1]][
                      currentPair[1][0].token0[0].toString()
                    ]
                      | bigintToFloat(
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                      | formatAmount(
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                  }}
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <span
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    tokenBalance[getTxidAccount(index)[1]]
                  "
                >
                  {{
                    tokenBalance[getTxidAccount(index)[1]][
                      currentPair[1][0].token1[0].toString()
                    ]
                      | bigintToFloat(
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                      | formatAmount(
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                  }}
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <span v-if="tokenBalance[getTxidAccount(index)[1]]">
                  <span
                    v-if="
                      (tokenBalance[getTxidAccount(index)[1]][
                        currentPair[1][0].token0[0].toString()
                      ] &&
                        canFallback(
                          tokenBalance[getTxidAccount(index)[1]][
                            currentPair[1][0].token0[0].toString()
                          ],
                          tokens[currentPair[1][0].token0[0].toString()]
                        )) ||
                      (tokenBalance[getTxidAccount(index)[1]][
                        currentPair[1][0].token1[0].toString()
                      ] &&
                        canFallback(
                          tokenBalance[getTxidAccount(index)[1]][
                            currentPair[1][0].token1[0].toString()
                          ],
                          tokens[currentPair[1][0].token1[0].toString()]
                        ))
                    "
                  >
                    <span v-if="isPending(index)" class="base-font"
                      >Pending</span
                    >
                    <span v-else class="can-click" @click="fallback(index)"
                      >Fallback</span
                    >
                  </span>
                  <span v-else>-</span>
                </span>
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-spin>
    <div class="pagination-main">
      <a-pagination
        class="pagination pc-show"
        v-show="total > defaultPageSize"
        :current="currentPage"
        :defaultPageSize="defaultPageSize"
        :total="total"
        @change="changePage"
      />
      <a-pagination
        class="pagination h5-show"
        simple
        v-show="total > defaultPageSize"
        :current="currentPage"
        :defaultPageSize="defaultPageSize"
        :total="total"
        @change="changePage"
      />
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PendingList, TxAccount } from '@/ic/ICDex/model';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { DePairs } from '@/views/home/ICDex/model';
import BigNumber from 'bignumber.js';
import {
  fromSubAccountId,
  generateTxid,
  hexToBytes,
  principalToAccountIdentifier,
  toHexString
} from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { namespace } from 'vuex-class';
import { Icrc1Account, TokenInfo, TokenStd } from '@/ic/common/icType';
import { getCompetitionsBalance, getDepositing } from '@/ic/getTokenBalance';
import { checkAuth } from '@/ic/CheckAuth';
import { getFee } from '@/ic/getTokenFee';

const commonModule = namespace('common');

@Component({
  name: 'Fallback',
  components: {}
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @Prop({ type: Array, default: () => [] })
  pendingList!: Array<PendingList>;
  @Prop({ type: Array, default: () => [] })
  private currentPair!: DePairs;
  @Prop({ type: Object, default: () => null })
  tokens!: { [key: string]: TokenInfo };
  private fallbackVisible = false;
  private nonce = 0;
  private currentPage = 1;
  private defaultPageSize = 10;
  private total = 0;
  private nonceList: Array<number> = [];
  private tokenBalance: { [key: string]: { [tokenId: string]: string } } = {};
  private tableSpinning = false;
  private isH5 = false;
  private fallbackLocal: { [key: string]: string } = {};
  private depositToken0 = '';
  private depositToken1 = '';
  private depositToken0Pro = '';
  private depositToken1Pro = '';
  get modeDisabled(): boolean {
    if (this.pendingList.length) {
      return this.pendingList.some((item) => {
        const status = item[1].status;
        if (status) {
          const type = Object.keys(status)[0];
          return type === 'Prepared' || type === 'Todo';
        }
      });
    }
    return false;
  }
  created(): void {
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
    if (this.isH5) {
      this.defaultPageSize = 5;
    } else {
      this.defaultPageSize = 10;
    }
  }
  private init(): void {
    this.nonce = 0;
    this.currentPage = 1;
    this.total = 0;
    this.nonceList = [];
    this.tokenBalance = {};
    this.getNonce();
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
    if (this.isH5) {
      this.defaultPageSize = 5;
    } else {
      this.defaultPageSize = 10;
    }
    this.fallbackLocal = JSON.parse(localStorage.getItem('fallback')) || {};
    this.getDepositBalance();
  }
  private async depositFallback(subAccountId = 0): Promise<void> {
    if (!this.modeDisabled) {
      await checkAuth();
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      const currentICDexService = new ICDexService();
      const res = await currentICDexService.depositFallback(
        this.currentPair[0].toString(),
        subAccountId
      );
      console.log(res);
      if (
        res &&
        res.length &&
        (new BigNumber(res[0].toString(10)).gt(0) ||
          new BigNumber(res[1].toString(10)).gt(0))
      ) {
        this.$message.success('Success');
      } else {
        this.$message.error('Error');
      }
      this.getDepositBalance();
      loading.close();
    }
  }
  private async getDepositBalance(): Promise<void> {
    const token0Std = this.currentPair[1][0].token0[2];
    const token0Id = this.currentPair[1][0].token0[0].toString();
    const token1Std = this.currentPair[1][0].token1[2];
    const token1Id = this.currentPair[1][0].token1[0].toString();
    const currentAddress = principalToAccountIdentifier(
      Principal.fromText(this.getPrincipalId)
    );
    const depositAccount = {
      owner: this.currentPair[0],
      subaccount: [hexToBytes(currentAddress)]
    };
    const depositAddress = principalToAccountIdentifier(
      depositAccount.owner,
      new Uint8Array(depositAccount.subaccount[0])
    );
    getCompetitionsBalance(token0Std, token0Id, [
      depositAccount,
      depositAddress
    ]).then((res) => {
      this.depositToken0 = res;
    });
    getCompetitionsBalance(token1Std, token1Id, [
      depositAccount,
      depositAddress
    ]).then((res) => {
      this.depositToken1 = res;
    });
    const currentAddressPro = principalToAccountIdentifier(
      Principal.fromText(this.getPrincipalId),
      new Uint8Array(fromSubAccountId(1))
    );
    const depositAccountPro = {
      owner: this.currentPair[0],
      subaccount: [hexToBytes(currentAddressPro)]
    };
    const depositAddressPro = principalToAccountIdentifier(
      depositAccount.owner,
      new Uint8Array(depositAccountPro.subaccount[0])
    );
    getCompetitionsBalance(token0Std, token0Id, [
      depositAccountPro,
      depositAddressPro
    ]).then((res) => {
      this.depositToken0Pro = res;
    });
    getCompetitionsBalance(token1Std, token1Id, [
      depositAccountPro,
      depositAddressPro
    ]).then((res) => {
      this.depositToken1Pro = res;
    });
  }
  private async fallback(nonce: number): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const currentICDexService = new ICDexService();
      const res = await currentICDexService.fallback(
        this.currentPair[0].toString(),
        BigInt(nonce)
      );
      console.log(res);
      if (res) {
        const txAccount = this.getTxidAccount(nonce);
        this.$set(
          this.tokenBalance[txAccount[1]],
          this.currentPair[1][0].token0[0].toString(),
          '0'
        );
        this.$set(
          this.tokenBalance[txAccount[1]],
          this.currentPair[1][0].token1[0].toString(),
          '0'
        );
        this.$forceUpdate();
        this.$message.success('Success');
      } else {
        this.$message.error('Return failed, please try again in 15 minutes.');
      }
      loading.close();
    } catch (e) {
      loading.close();
      console.error(e);
      this.$message.error(e);
    }
  }
  private canFallback(balance: string, token: TokenInfo): boolean {
    return new BigNumber(getFee(token).toString(10)).lt(balance);
  }
  private isPending(nonce: number): boolean {
    let flag: boolean;
    const txid = this.getTxid(nonce);
    flag = this.pendingList.some((pending) => {
      return toHexString(new Uint8Array(pending[0])) === txid;
    });
    // if (!flag) {
    //   const now = new Date().getTime();
    //   const key =
    //     this.getPrincipalId +
    //     '-' +
    //     this.currentPair[0].toString() +
    //     '-' +
    //     nonce;
    //   if (this.fallbackLocal[key]) {
    //     if (
    //       new BigNumber(this.fallbackLocal[key]).plus(60 * 60 * 1000).gt(now)
    //     ) {
    //       flag = true;
    //     }
    //   }
    // }
    return flag;
  }
  private async getTokenBalance(
    tokenStd: TokenStd,
    tokenId: string,
    nonce: number
  ): Promise<void> {
    const txAccount = this.getTxidAccount(nonce);
    if (
      this.tokenBalance[txAccount[1]] &&
      this.tokenBalance[txAccount[1]][tokenId]
    ) {
      return;
    }
    try {
      const balance = await getDepositing(tokenStd, tokenId, txAccount[0]);
      if (!this.tokenBalance[txAccount[1]]) {
        this.tokenBalance[txAccount[1]] = {};
      }
      this.$set(this.tokenBalance[txAccount[1]], tokenId, balance);
    } catch (e) {
      console.log(e);
    }
  }
  private getTxidAccount(nonce: number): [Icrc1Account, string] {
    const txid = generateTxid(
      Principal.fromText(this.getPrincipalId),
      BigInt(nonce),
      new Uint8Array(fromSubAccountId(0)),
      this.currentPair[0].toString()
    );
    const owner = Principal.fromText(this.currentPair[0].toString());
    const subaccount = [txid];
    return [
      {
        owner: owner,
        subaccount: subaccount
      },
      principalToAccountIdentifier(owner, new Uint8Array(txid))
    ];
  }
  private getTxid(nonce: number): string {
    // subaccount
    const txid = generateTxid(
      Principal.fromText(this.getPrincipalId),
      BigInt(nonce),
      new Uint8Array(fromSubAccountId(0)),
      this.currentPair[0].toString()
    );
    return toHexString(new Uint8Array(txid));
  }
  private changePage(page): void {
    this.currentPage = page;
    this.getList();
  }
  private async getNonce(): Promise<void> {
    this.tableSpinning = true;
    try {
      if (this.currentPair[0].toString() !== 'scjza-fiaaa-aaaak-ac2kq-cai') {
        const prepare = await this.getTxAccount();
        console.log(prepare);
        this.nonce = Number(prepare[2]) + 2;
      } else {
        this.nonce = 50;
      }
      this.total = this.nonce + 1;
      this.getList();
    } catch (e) {
      this.tableSpinning = false;
    }
  }
  private async getList(): Promise<void> {
    this.tableSpinning = true;
    try {
      this.nonceList = [];
      const min = Math.max(
        0,
        this.nonce - this.defaultPageSize * this.currentPage + 1
      );
      const max = this.nonce - this.defaultPageSize * (this.currentPage - 1);
      const promiseAll = [];
      for (let i = max; i >= min; i--) {
        promiseAll.push(
          this.getTokenBalance(
            this.currentPair[1][0].token0[2],
            this.currentPair[1][0].token0[0].toString(),
            i
          ),
          this.getTokenBalance(
            this.currentPair[1][0].token1[2],
            this.currentPair[1][0].token1[0].toString(),
            i
          )
        );
        this.nonceList.push(i);
      }
      await Promise.all(promiseAll);
    } catch (e) {
      console.log(e);
    }
    this.tableSpinning = false;
  }
  private async getTxAccount(): Promise<TxAccount> {
    const currentICDexService = new ICDexService();
    const principal = localStorage.getItem('principal');
    const res = await currentICDexService.getTxAccount(
      this.currentPair[0].toString(),
      principal
    );
    if (res && res.pairId === this.currentPair[0].toString()) {
      return res.txAccount;
    }
    return null;
  }
}
</script>

<style scoped lang="scss">
.deposit-info {
  background: #11171d;
  .can-click {
    margin-left: 10px;
    &.disabled {
      color: #adb3c4;
      cursor: not-allowed;
    }
  }
}
.fallback-modal-table {
  .fallback-modal-table-main {
    min-height: 200px;
    max-height: calc(100vh - 240px);
    overflow: auto;
  }
  ::v-deep .ant-modal-body {
    padding-top: 40px;
    padding-bottom: 60px;
  }
}
.pagination-main {
  position: absolute;
  right: 55px;
  display: flex;
  align-items: center;
  margin-top: 20px;
  .pagination {
    margin-left: auto;
  }
}
.can-click {
  cursor: pointer;
  color: #2b8cb0;
}
.h5-show {
  display: none;
}
.pc-show {
  display: block;
}
@media screen and (max-width: 768px) {
  .pagination-main {
    right: 15px;
  }
  .h5-show {
    display: block;
  }
  .pc-show {
    display: none;
  }
}
</style>
