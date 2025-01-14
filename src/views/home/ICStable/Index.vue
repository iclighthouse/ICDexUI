<template>
  <div class="ic-stable-main container-width">
    <div class="ic-stable-main-header pc-show">
      <ul>
        <li>
          <span class="ic-stable-main-header-item-left">Supply</span
          ><span class="ic-stable-main-header-item-right" v-if="stats"
            >{{ stats.supply | bigintToFloat(2, dusdDecimal) }}
            <span>DUSD</span></span
          >
        </li>
        <li>
          <span class="ic-stable-main-header-item-left">Asset Total Value</span
          ><span class="ic-stable-main-header-item-right" v-if="stats"
            >${{ stats.assetTotalValue | bigintToFloat(2, dusdDecimal) }}</span
          >
        </li>
        <li>
          <span class="ic-stable-main-header-item-left">Reserve</span
          ><span class="ic-stable-main-header-item-right" v-if="stats"
            >{{ stats.reserve | bigintToFloat(2, dusdDecimal) }}
            <span>DUSD</span></span
          >
        </li>
        <li>
          <span class="ic-stable-main-header-item-left">Liquidity</span
          ><span class="ic-stable-main-header-item-right" v-if="stats"
            >{{ stats.liquidity | bigintToFloat(2, dusdDecimal) }}
            <span>DUSD</span></span
          >
        </li>
        <li>
          <span class="ic-stable-main-header-item-left"
            >Debt Position Count</span
          ><span class="ic-stable-main-header-item-right" v-if="stats">{{
            stats.dpCount
          }}</span>
        </li>
      </ul>
    </div>
    <!--<div class="ic-stable-main-menu">
      &lt;!&ndash;<router-link to="/ICStable/positions">
        <button type="button"><a-icon type="home" />My Positions</button>
      </router-link>&ndash;&gt;
      &lt;!&ndash;<router-link to="/ICStable/open">
        <button type="button">Borrow</button>
      </router-link>&ndash;&gt;
    </div>-->
    <ul class="ic-stable-coll">
      <li v-for="(collateral, index) in collaterals" :key="index">
        <div class="ic-stable-coll-top" v-if="tokens[collateral[0].toString()]">
          <div class="ic-stable-coll-symbol">
            {{ tokens[collateral[0].toString()].symbol }}
          </div>
          <div>
            <div
              v-if="
                tokens[collateral[0].toString()] &&
                tokens[collateral[0].toString()]
              "
              class="capped-token"
            >
              Capped at
              {{
                collateral[2].totalCeiling
                  | bigintToFloat(2, tokens[collateral[0].toString()].decimals)
                  | formatAmount(tokens[collateral[0].toString()].decimals)
              }}
              {{ tokens[collateral[0].toString()].symbol }} (<span
                v-if="assetsStats[tokens[collateral[0].toString()].tokenId]"
                >{{
                  assetsStats[tokens[collateral[0].toString()].tokenId].value
                    | remaining(collateral[2].totalCeiling)
                }}</span
              >
              remaining)
            </div>
          </div>
        </div>
        <div class="collateral-img">
          <img
            v-if="
              tokens[collateral[0].toString()] &&
              tokens[collateral[0].toString()].logo
            "
            :src="tokens[collateral[0].toString()].logo"
            alt=""
          />
        </div>
        <div class="est-borrow">
          <div v-if="tokens[collateral[0].toString()] && price && config">
            With {{ getCollateralPrice(collateral[2]) }}
            {{ tokens[collateral[0].toString()].symbol }}
          </div>
          <div v-if="config">
            Borrow up to
            {{ config.DEBT_CEILING | bigintToFloat(2, dusdDecimal) }}
            DUSD
          </div>
        </div>
        <div class="ic-stable-coll-info">
          <div class="ic-stable-coll-info-item">
            <span>Min Coll. Ratio</span
            ><span v-if="config">{{
              config.MIN_COLL_RATIO | filterPermyriad
            }}</span>
          </div>
          <div class="ic-stable-coll-info-item">
            <span>Init Coll. Ratio</span
            ><span v-if="config">{{
              config.INIT_COLL_RATIO | filterPermyriad
            }}</span>
          </div>
          <div class="ic-stable-coll-info-item">
            <span>Assets Factor</span
            ><span v-if="tokens[collateral[0].toString()]">{{
              collateral[2].factor | filterPermyriad
            }}</span>
          </div>
          <div class="ic-stable-coll-info-item">
            <span>Stability Fee</span
            ><span v-if="config">{{
              config.INIT_STABILITY_FEE | filterPermyriad
            }}</span>
          </div>
        </div>
        <router-link :to="`/ICStable/open/${collateral[0].toString()}`">
          <button type="button" class="w100 primary">Borrow</button>
        </router-link>
      </li>
    </ul>
    <!--<a-spin :spinning="tableSpinning">
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Total Ceiling</th>
            <th>Liquidity Discount Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(collateral, index) in collaterals" :key="index">
            <td>
              <div class="token-info" v-if="tokens[collateral[0].toString()]">
                <div class="img-content">
                  <img
                    v-if="tokens[collateral[0].toString()].logo"
                    :src="tokens[collateral[0].toString()].logo"
                    alt=""
                  />
                </div>
                {{ tokens[collateral[0].toString()].symbol }}
              </div>
            </td>
            <td>
              {{ collateral[2].totalCeiling | bigintToFloat(2, dusdDecimal) }}
            </td>
            <td>{{ collateral[2].lpDiscountRate | filterPermyriad }}</td>
            <td>
              <router-link :to="`/ICStable/open/${collateral[0].toString()}`">
                <button>Borrow</button>
              </router-link>
            </td>
          </tr>
          <tr v-if="!collaterals.length && !tableSpinning">
            <td colspan="4">No Assets</td>
          </tr>
        </tbody>
      </table>
    </a-spin>-->
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import {
  AssetResponse,
  CollateralsRes,
  CollInfo,
  Config,
  PriceRes,
  StatsResponse
} from '@/ic/ICStable/model';
import { StableTokensMixin } from '@/mixins';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import { checkAuth } from '@/ic/CheckAuth';
@Component({
  name: 'Index',
  components: {},
  filters: {
    remaining(val: bigint, total: bigint): string {
      if (val && total) {
        return (
          new BigNumber(total.toString(10))
            .minus(val.toString(10))
            .div(total.toString(10))
            .times(100)
            .decimalPlaces(2, 1)
            .toString(10) + '%'
        );
      }
    },
    filterPermyriad(val: bigint): string {
      if (val) {
        return (
          new BigNumber(val.toString(10))
            .div(10000)
            .times(100)
            .decimalPlaces(2)
            .toString(10) + '%'
        );
      }
    }
  }
})
export default class extends Mixins(StableTokensMixin) {
  private config: Config = null;
  private stats: StatsResponse = null;
  private dusdDecimal = 8;
  private collaterals: CollateralsRes = [];
  private tableSpinning = false;
  private price: PriceRes = null;
  private assetsStats: { [key: string]: AssetResponse } = {};
  created(): void {
    this.stats = JSON.parse(localStorage.getItem('stats')) || null;
    this.getConfig();
    this.getStats();
    this.getCollaterals();
    this.getPrice();
  }
  private getCollateralPrice(collInfo: CollInfo): string {
    const price = this.price[0][1][Number(collInfo.mktSid)];
    return new BigNumber(this.config.DEBT_CEILING.toString(10))
      .div(10 ** this.dusdDecimal)
      .div(
        new BigNumber(price.data[1].toString(10))
          .div(10 ** Number(price.decimals))
          .times(collInfo.factor.toString(10))
          .div(this.config.INIT_COLL_RATIO.toString(10))
      )
      .decimalPlaces(4)
      .toString(10);
  }
  private async getPrice(): Promise<void> {
    this.price = await this.ICStableService.getPrice();
  }
  private async getCollaterals(): Promise<void> {
    this.tableSpinning = true;
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      this.collaterals = await this.ICStableService.collaterals();
    } catch (e) {
    }
    loading.close();
    this.tableSpinning = false;
    const canisterIds = [];
    this.collaterals.forEach((item) => {
      canisterIds.push(item[0].toString());
    });
    await checkAuth();
    const flag = needConnectPlug(canisterIds);
    if (flag && this.$route.name === 'ICStable') {
      // const h = this.$createElement;
      this.$info({
        content: 'Tokens need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(canisterIds);
        }
      });
    }
  }
  private async getConfig(): Promise<void> {
    const res = await this.ICStableService.getConfig();
    this.config = res[1];
  }
  private async getStats(): Promise<void> {
    this.stats = await this.ICStableService.stats();
    this.stats.assets.forEach((res) => {
      this.assetsStats[res[0].tokenId.toString()] = res[0];
    });
    localStorage.setItem(
      'stats',
      JSON.stringify(
        this.stats,
        (key, value) => (typeof value === 'bigint' ? value.toString(10) : value) // return everything else unchanged
      )
    );
  }
}
</script>
<style scoped lang="scss">
.ic-stable-main {
  margin-top: 20px;
  color: #727a87;
}
.ic-stable-main-header {
  margin-bottom: 50px;
  border-radius: 5px;
  background: #141b23;
  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border-radius: 4px;
    padding: 30px 20px;
    color: #adb3c4;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      flex: 1;
      padding: 5px;
      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        border-right: none;
      }
      .ic-stable-main-header-item-right {
        margin-top: 10px;
        color: #fff;
        font-size: 24px;
        span {
          font-weight: normal;
          color: #adb3c4;
          font-size: 12px;
        }
      }
    }
  }
}
table {
  min-height: 120px;
  thead {
    tr {
      background: #1e2429 !important;
    }
  }
  tbody {
    tr {
      height: 60px;
      background: #1e2429;
      &:nth-child(2n-1) {
        background: #141b23;
      }
    }
  }
  .token-info {
    display: flex;
    align-items: center;
  }
  .img-content {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    img {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      box-shadow: #fff 0 0 1px;
      border: 0 solid rgba(255, 255, 255, 0);
      object-fit: contain;
      vertical-align: top;
    }
  }
}
.ic-stable-main-menu {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-bottom: 10px;
  a {
    display: inline-block;
    margin-left: 10px;
  }
  i {
    margin-right: 5px;
  }
  button {
    font-size: 14px;
  }
}
.ic-stable-coll {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  li {
    width: 420px;
    height: 590px;
    margin: 0 20px 20px;
    padding: 35px;
    border-radius: 10px;
    background: #141b23;
    box-sizing: border-box;
    border: 2px solid transparent;
    box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
    transition: all 0.3s;
    color: #adb3c4;
    &:hover {
      border-color: #51b7c3;
    }
    .est-borrow {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 90px;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.1);
      line-height: 30px;
      color: #fff;
    }
    button {
      margin-top: 30px;
    }
    .ic-stable-coll-top {
      display: flex;
      align-items: flex-start;
    }
    .ic-stable-coll-symbol {
      font-size: 16px;
      color: #fff;
    }
    .collateral-img {
      width: 120px;
      height: 120px;
      margin: 40px auto;
      img {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        object-fit: contain;
        vertical-align: top;
      }
    }
    button {
      height: 40px;
      font-size: 16px;
    }
    .ic-stable-coll-info {
      margin: 10px 0 20px;
    }
    .ic-stable-coll-info-item {
      display: flex;
      margin-bottom: 10px;
      line-height: 25px;
      padding: 0 30px;
      span {
        &:last-child {
          margin-left: auto;
          color: #21c77d;
        }
      }
    }
  }
}
.capped-token {
  margin-left: 5px;
  font-size: 12px;
  line-height: 16px;
}
@media screen and (max-width: 768px) {
  .pc-show {
    display: none;
  }
}
</style>
