<template>
  <div class="positions-main container-width">
    <!--<div class="ic-stable-main-header-back">
      <a-icon class="back-icon" type="arrow-left" @click="back" />
    </div>-->
    <div class="positions-item">
      <div class="positions-item-header">
        <div
          @click="currentMenu = 'debtPosition'"
          :class="{ active: currentMenu === 'debtPosition' }"
        >
          Debt Positions
        </div>
        <div
          @click="currentMenu = 'debtPositionLog'"
          :class="{ active: currentMenu === 'debtPositionLog' }"
        >
          History
        </div>
      </div>
      <a-spin :spinning="tableSpinning">
        <div class="table-container" v-show="currentMenu === 'debtPosition'">
          <table>
            <thead>
              <tr>
                <th>Debt Position Id</th>
                <th>Collateral Locked</th>
                <th>Debt</th>
                <th>Liquidation Price</th>
                <th>Collateral Ratio</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in positions.slice(
                  (currentPositionPage - 1) * defaultPageSize,
                  currentPositionPage * defaultPageSize
                )"
                :key="item[0].toString()"
              >
                <td>{{ item[0].toString() }}</td>
                <td>
                  <div
                    v-for="(collateral, index) in item[1].collaterals"
                    :key="index"
                  >
                    <span v-if="tokens[collateral[0].toString()]">
                      {{
                        collateral[1]
                          | bigintToFloat(
                            tokens[collateral[0].toString()].decimals,
                            tokens[collateral[0].toString()].decimals
                          )
                      }}
                      {{ tokens[collateral[0].toString()].symbol }}
                    </span>
                  </div>
                  <div v-if="!item[1].collaterals.length">No Collateral</div>
                </td>
                <td>
                  <a-tooltip placement="bottom">
                    <template slot="title">
                      {{
                        item[1].debt | bigintToFloat(dusdDecimal, dusdDecimal)
                      }}
                    </template>
                    {{ item[1].debt | bigintToFloat(4, dusdDecimal) }}
                  </a-tooltip>
                  DUSD
                </td>
                <td>
                  <span
                    v-if="
                      price &&
                      config &&
                      item[1].collaterals.length &&
                      collaterals[item[1].collaterals[0][0].toString()] &&
                      tokens[item[1].collaterals[0][0].toString()]
                    "
                    >{{ currentLiquidationPrice(item[1]) }}</span
                  >
                  <span v-else>-</span>
                </td>
                <td>
                  <span
                    :class="
                      currentCollateralRatio(item[1])
                        | ratioGrade(
                          config.MIN_COLL_RATIO.toString(10),
                          config.INIT_COLL_RATIO.toString(10)
                        )
                    "
                    v-if="
                      price &&
                      config &&
                      item[1].collaterals.length &&
                      collaterals[item[1].collaterals[0][0].toString()] &&
                      tokens[item[1].collaterals[0][0].toString()]
                    "
                    >{{ currentCollateralRatio(item[1]) }}</span
                  >
                  <span v-else>-</span>
                </td>
                <td>{{ Object.keys(item[1].status)[0] }}</td>
                <td class="manage-position">
                  <router-link
                    v-if="Object.keys(item[1].status)[0] === 'Opening'"
                    :to="`/ICStable/open/${item[1].collaterals[0][0].toString()}/${item[0].toString()}`"
                  >
                    <div>Manage Debt Position</div>
                  </router-link>
                </td>
              </tr>
              <tr v-if="!positions.length && !tableSpinning">
                <td colspan="7" align="center">No Positions</td>
              </tr>
            </tbody>
          </table>
        </div>
        <a-pagination
          v-show="
            currentMenu === 'debtPosition' && positions.length > defaultPageSize
          "
          class="position-pagination"
          :current="currentPositionPage"
          :defaultPageSize="defaultPageSize"
          :total="positions.length"
          @change="changePosition"
        />
        <div v-show="currentMenu === 'debtPositionLog'" class="table-container">
          <table>
            <thead>
              <tr>
                <th>Debt Position Id</th>
                <th>Opening Time</th>
                <th>Debt Peak</th>
                <th>Status</th>
                <th>Closing Type</th>
                <th>Stability Costs</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(log, index) in positionsLog.slice(
                  (currentPositionLogPage - 1) * defaultPageSize,
                  currentPositionLogPage * defaultPageSize
                )"
                :key="index"
              >
                <td>{{ log[0].toString() }}</td>
                <td>{{ log[1].openingTime | formatTime }}</td>
                <td>
                  <a-tooltip placement="bottom">
                    <template slot="title">
                      {{
                        log[1].debtPeak
                          | bigintToFloat(dusdDecimal, dusdDecimal)
                      }}
                    </template>
                    {{ log[1].debtPeak | bigintToFloat(4, dusdDecimal) }}
                  </a-tooltip>
                  DUSD
                </td>
                <td>{{ Object.keys(log[1].status)[0] }}</td>
                <td>
                  <div v-if="Object.keys(log[1].status)[0] === 'Closed'">
                    {{ Object.keys(log[1].closingType[0])[0] }}
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <div v-if="Object.keys(log[1].status)[0] === 'Closed'">
                    <a-tooltip placement="bottom">
                      <template slot="title">
                        {{
                          log[1].stabilityCosts
                            | bigintToFloat(dusdDecimal, dusdDecimal)
                        }}
                      </template>
                      {{
                        log[1].stabilityCosts | bigintToFloat(4, dusdDecimal)
                      }}
                    </a-tooltip>
                    DUSD
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <span
                    @click="showLog(log[1].transactions)"
                    class="log-txn"
                    v-if="log[1].transactions.length"
                    >Txns</span
                  >
                </td>
              </tr>
              <tr v-if="!positionsLog.length && !tableSpinning">
                <td colspan="7" align="center">No Data</td>
              </tr>
            </tbody>
          </table>
        </div>
        <a-pagination
          v-show="
            currentMenu === 'debtPositionLog' &&
            positionsLog.length > defaultPageSize
          "
          class="position-pagination"
          :current="currentPositionLogPage"
          :defaultPageSize="defaultPageSize"
          :total="positionsLog.length"
          @change="changePositionLog"
        />
      </a-spin>
    </div>
    <a-modal
      v-model="visible"
      centered
      width="80%"
      class="events-modal position-modal"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <div class="position-modal-table">
        <table class="txn-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Txid</th>
              <th>Nonce</th>
              <th>Action</th>
              <th>Operation</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(txn, index) in positionsLogTxns.slice(
                (currentTxnPage - 1) * defaultPageSize,
                currentTxnPage * defaultPageSize
              )"
              :key="index"
            >
              <td>{{ txn[2].time | formatTime }}</td>
              <td>
                <copy-account
                  :account="arrayToString(txn[2].txid)"
                  copyText="Txid"
                ></copy-account>
              </td>
              <td>{{ txn[2].nonce }}</td>
              <td>{{ Object.keys(txn[1])[0] }}</td>
              <td>
                <div
                  v-if="
                    txn[2].operations[0] &&
                    tokens &&
                    tokens[txn[2].operations[0][1].toString()]
                  "
                >
                  {{
                    txn[2].operations[0]
                      | filterOperations(
                        tokens[txn[2].operations[0][1].toString()].decimals
                      )
                  }}
                  {{ tokens[txn[2].operations[0][1].toString()].symbol }}
                </div>
                <div
                  v-if="
                    txn[2].operations[1] &&
                    tokens &&
                    tokens[txn[2].operations[1][1].toString()]
                  "
                >
                  {{
                    txn[2].operations[1]
                      | filterOperations(
                        tokens[txn[2].operations[1][1].toString()].decimals
                      )
                  }}
                  {{ tokens[txn[2].operations[1][1].toString()].symbol }}
                </div>
              </td>
              <td>
                <copy-account
                  v-if="txn[2].data[0].length"
                  :account="arrayToString(txn[2].data[0])"
                  copyText="Data"
                ></copy-account>
              </td>
            </tr>
          </tbody>
        </table>
        <a-pagination
          v-show="positionsLogTxns.length > defaultPageSize"
          class="pagination"
          :current="currentTxnPage"
          :defaultPageSize="defaultPageSize"
          :total="positionsLogTxns.length"
          @change="changeTxn"
        />
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { ICStableService } from '@/ic/ICStable/ICStableService';
import {
  Action,
  BalanceChange,
  CollInfo,
  Config,
  DebtPosition,
  DebtPositionLog,
  Dpid,
  OperationType,
  PriceRes,
  TxnRecord
} from '@/ic/ICStable/model';
import { StableTokensMixin } from '@/mixins';
import { TokenId } from '@/ic/common/icType';
import { formatDateToSecondUTC, toHexString } from '@/ic/converter';
@Component({
  name: 'Positions',
  components: {},
  filters: {
    filterOperations(
      val: [OperationType, TokenId, Array<BalanceChange>],
      decimals: number
    ): string {
      if (val && val.length) {
        const type = Object.keys(val[0])[0];
        const balanceChange = Object.values(val[2][0])[0];
        const balance = new BigNumber(balanceChange.toString(10))
          .div(10 ** decimals)
          .toString(10);
        return `${type}: ${balance}`;
      }
      return '';
    },
    formatTime(val: bigint): string {
      if (val) {
        return formatDateToSecondUTC(new Date(Number(val) * 1000));
      }
      return '';
    }
  }
})
export default class extends Mixins(StableTokensMixin) {
  private positions: Array<[Dpid, DebtPosition]> = [];
  private positionsLog: Array<[Dpid, DebtPositionLog]> = [];
  private positionsLogTxns: Array<[bigint, Action, TxnRecord]> = [];
  private visible = false;
  private dusdDecimal = 8;
  private tableSpinning = false;
  private collaterals: { [key: string]: [TokenId, CollInfo, CollInfo] } = {};
  private price: PriceRes = null;
  private config: Config = null;
  private currentMenu = 'debtPosition';
  private currentTxnPage = 1;
  private currentPositionPage = 1;
  private currentPositionLogPage = 1;
  private defaultPageSize = 10;
  get currentCollateralRatio(): any {
    return (val: DebtPosition): string => {
      if (
        this.price &&
        this.config &&
        val.collaterals.length &&
        this.collaterals[val.collaterals[0][0].toString()] &&
        this.tokens[val.collaterals[0][0].toString()]
      ) {
        const currentCollateralRatio = new BigNumber(
          val.collaterals[0][1].toString(10)
        )
          .div(10 ** this.tokens[val.collaterals[0][0].toString()].decimals)
          .times(
            this.price[0][1][
              Number(
                this.collaterals[val.collaterals[0][0].toString()][2].mktSid
              )
            ].data[1].toString(10)
          )
          .div(
            10 **
              Number(
                this.price[0][1][
                  Number(
                    this.collaterals[val.collaterals[0][0].toString()][2].mktSid
                  )
                ].decimals
              )
          )
          .times(
            this.collaterals[
              val.collaterals[0][0].toString()
            ][2].factor.toString(10)
          )
          .div(10000)
          .div(val.debt.toString(10))
          .times(10 ** this.dusdDecimal)
          .times(100)
          .decimalPlaces(2, 1)
          .toString(10);
        return currentCollateralRatio + '%';
      }
      return '0%';
    };
  }
  get currentLiquidationPrice(): any {
    return (val: DebtPosition): string => {
      if (
        this.price &&
        this.config &&
        val.collaterals.length &&
        this.collaterals[val.collaterals[0][0].toString()] &&
        this.tokens[val.collaterals[0][0].toString()]
      ) {
        const currentLiquidationPrice = new BigNumber(val.debt.toString(10))
          .div(10 ** this.dusdDecimal)
          .times(this.config.MIN_COLL_RATIO.toString(10))
          .div(10000)
          // .div(
          //   new BigNumber(10000).minus(this.config.INIT_STABILITY_FEE.toString())
          // )
          .div(
            this.collaterals[
              val.collaterals[0][0].toString()
            ][2].factor.toString(10)
          )
          .times(10000)
          .div(val.collaterals[0][1].toString(10))
          .times(10 ** this.tokens[val.collaterals[0][0].toString()].decimals)
          .decimalPlaces(
            Number(
              this.price[0][1][
                Number(
                  this.collaterals[val.collaterals[0][0].toString()][2].mktSid
                )
              ].decimals
            ),
            2
          )
          .toString(10);
        return '$' + currentLiquidationPrice;
      }
      return '-';
    };
  }
  created(): void {
    this.ICStableService = new ICStableService();
    this.getBorrower();
    this.getPrice();
    this.getConfig();
    this.getCollaterals();
  }
  private showLog(txns: Array<[bigint, Action, TxnRecord]>): void {
    this.visible = true;
    this.positionsLogTxns = txns.slice().reverse();
  }
  private back(): void {
    this.$router.push('/ICStable');
  }
  private changePositionLog(page: number): void {
    this.currentPositionLogPage = page;
  }
  private changePosition(page: number): void {
    this.currentPositionPage = page;
  }
  private changeTxn(page: number): void {
    this.currentTxnPage = page;
  }
  private async getCollaterals(): Promise<void> {
    const collaterals = await this.ICStableService.collaterals();
    collaterals.forEach((item) => {
      this.$set(this.collaterals, item[0].toString(), item);
    });
  }
  private async getPrice(): Promise<void> {
    this.price = await this.ICStableService.getPrice();
  }
  private async getConfig(): Promise<void> {
    const res = await this.ICStableService.getConfig();
    this.config = res[1];
  }
  private async getBorrower(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (!principal) {
      return;
    }
    this.tableSpinning = true;
    try {
      const res = await this.ICStableService.borrower(principal);
      if (res && res.length) {
        this.positions = res[1].slice().reverse();
        this.positionsLog = res[2].slice().reverse();
      }
    } catch (e) {
    }
    this.tableSpinning = false;
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
}
</script>
<style scoped lang="scss">
.table-container {
  border-radius: 10px;
  background: #141b23;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  padding: 20px 25px;
}
.positions-main {
  margin-top: 80px;
  padding-bottom: 80px;
}
table {
  min-height: 120px;
  thead {
    tr {
      th:first-child {
        padding-left: 20px;
      }
    }
  }
  tbody {
    tr {
      height: 60px;
      td:first-child {
        padding-left: 20px;
      }
    }
  }
}
.manage-position {
  div {
    color: #1996c4;
    margin: 0 auto;
  }
}
.ic-stable-main-header-back {
  color: #727a87;
  cursor: pointer;
  font-size: 18px;
  margin-bottom: 20px;
}
.positions-item-header {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 320px;
  height: 60px;
  margin: 0 auto 20px;
  color: #fff;
  border-radius: 30px;
  background: #232730;
  font-size: 16px;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 150px;
    border-radius: 20px;
    cursor: pointer;
    &.active {
      background: #51b7c3;
    }
  }
}
.log-txn {
  color: #1996c4;
  cursor: pointer;
}
.txn-table {
  font-size: 12px;
}
.position-modal {
  ::v-deep .ant-modal-body {
    padding-bottom: 50px;
    .pagination {
      position: absolute;
      right: 30px;
      margin-top: 20px;
    }
  }
}
.position-pagination {
  float: right;
  margin-top: 20px;
}
@media screen and (max-width: 768px) {
  .table-container,
  .position-modal-table {
    overflow: auto;
    td {
      white-space: nowrap;
    }
  }
  .position-modal {
    ::v-deep .ant-modal {
      width: 95% !important;
    }
    ::v-deep .ant-modal-body {
      padding-top: 60px;
    }
  }
}
</style>
