<template>
  <div class="ic-swap-yield ic-swap-main">
    <div class="exchange-swap-item">
      <div class="shares-main">
        <div class="shares-main-total">
          <span class="shares-main-title">Total shares:</span>
          <span v-if="currentPool && currentPool[2]">
            <a-tooltip placement="top">
              <template slot="title">
                {{
                  currentPool[2].shares
                    | bigintToFloat(currentPool[4], currentPool[4])
                    | formatNum('abbreviation')
                }}
              </template>
              <span class="user-liquidity-share">{{
                currentPool[2].shares
                  | bigintToFloat(4, currentPool[4])
                  | formatNum('abbreviation')
              }}</span>
            </a-tooltip>
            <span v-show="checkNum(currentPool[2].shares, currentPool[4])">
              T</span
            >
          </span>
        </div>
        <div class="shares-main-user">
          <span class="shares-main-title">Your shares:</span>
          <span v-if="currentPool && currentPool[3]">
            <a-tooltip placement="top">
              <template slot="title">
                {{
                  currentPool[3].shares
                    | bigintToFloat(currentPool[4], currentPool[4])
                    | formatNum('abbreviation')
                }}
              </template>
              <span class="user-liquidity-share">{{
                currentPool[3].shares
                  | bigintToFloat(4, currentPool[4])
                  | formatNum('abbreviation')
              }}</span>
            </a-tooltip>
            <span v-show="checkNum(currentPool[3].shares, currentPool[4])">
              T</span
            ></span
          >
          <span
            v-if="
              tokens &&
              currentPool &&
              currentPool[3] &&
              tokens[currentPool[1][0].token0[0].toString()] &&
              tokens[currentPool[1][0].token1[0].toString()]
            "
          >
            <a-tooltip placement="bottom">
              <template slot="title">
                {{ token0Value(currentPool) }}
                {{ tokens[currentPool[1][0].token0[0].toString()].symbol }}
                +
                {{ token1Value(currentPool) }}
                {{ tokens[currentPool[1][0].token1[0].toString()].symbol }}
              </template>
              <span class="user-liquidity-value">
                (value: {{ token0Value(currentPool) | bigintToFloat(4, 0) }}
                {{ tokens[currentPool[1][0].token0[0].toString()].symbol }}
                +
                {{ token1Value(currentPool) | bigintToFloat(4, 0) }}
                {{ tokens[currentPool[1][0].token1[0].toString()].symbol }})
              </span>
            </a-tooltip>
          </span>
        </div>
        <div class="your-liquidity-header">
          <button
            class="your-liquidity-header-add"
            @click="onChangeLiquidityType('Add')"
            :class="{ active: liquidityType === 'Add' }"
          >
            Add
          </button>
          <div v-if="principal" class="your-liquidity-header-button">
            <button
              :class="{ active: liquidityType === 'Remove' }"
              @click="onChangeLiquidityType('Remove')"
            >
              Remove
            </button>
            <!--<button
              :class="{ active: liquidityType === 'Claim' }"
              @click="onChangeLiquidityType('Claim')"
            >
              Claim
            </button>-->
          </div>
        </div>
      </div>
      <div class="yield-main">
        <span>Estimated APY:&nbsp;&nbsp;</span>
        <div v-if="cYield && cYield.length">
          <span
            v-if="currentPool[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'"
            >Cycles {{ cYield[0].apyCycles | filterPercentage }}%, ICP
            {{ cYield[0].apyIcp | filterPercentage }}% (24-Hour APY)</span
          >
          <span
            v-if="
              currentPool[0].toString() !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
              tokens[currentPool[1][0].token0[0].toString()] &&
              tokens[currentPool[1][0].token1[0].toString()]
            "
            >{{ tokens[currentPool[1][0].token0[0].toString()].symbol }}
            {{ cYield[0].apyToken0 | filterPercentage }}%,
            {{ tokens[currentPool[1][0].token1[0].toString()].symbol }}
            {{ cYield[0].apyToken1 | filterPercentage }}% (24-Hour APY)</span
          >
          <span
            v-if="currentPool[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'"
            style="margin-top: 5px"
            >Cycles {{ cYield[1].apyCycles | filterPercentage }}%, ICP
            {{ cYield[1].apyIcp | filterPercentage }}% (7-Day APY)</span
          >
          <span
            v-if="
              currentPool[0].toString() !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
              tokens[currentPool[1][0].token0[0].toString()] &&
              tokens[currentPool[1][0].token1[0].toString()]
            "
            >{{ tokens[currentPool[1][0].token0[0].toString()].symbol }}
            {{ cYield[1].apyToken0 | filterPercentage }}%,
            {{ tokens[currentPool[1][0].token1[0].toString()].symbol }}
            {{ cYield[1].apyToken1 | filterPercentage }}% (7-Day APY)</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { Pool } from '@/views/home/ICSwap/model';
import { CYCLES_FINANCE_CANISTER_ID } from '@/ic/utils';
import { Liquidity, YieldResponse } from '@/ic/cyclesFinance/model';
import { SwapYield, TokenLiquidity } from '@/ic/ICSwap/model';
import { TokenInfo } from '@/ic/common/icType';
import { ICSwapService } from '@/ic/ICSwap/ICSwapService';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { LiquidityType } from '@/views/home/cyclesFinance/model';
import { namespace } from 'vuex-class';
const commonModule = namespace('common');
@Component({
  name: 'Yield',
  components: {},
  filters: {
    filterPercentage(val: number): string {
      if (val || val == 0) {
        return new BigNumber(val).times(100).decimalPlaces(4, 1).toString(10);
      }
      return '-';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  @Prop({ type: Object, default: () => null })
  tokens!: { [key: string]: TokenInfo };
  @Prop({ type: Array, default: () => [] })
  currentPool!: Pool;
  private liquidityType: LiquidityType = LiquidityType.Add;
  private cYield: YieldResponse | SwapYield = [];
  private timer = null;
  private principal = '';
  private onChangeLiquidityType(liquidityType: LiquidityType): void {
    this.liquidityType = liquidityType;
    this.$emit('changeLiquidityType', liquidityType);
  }
  public init(): void {
    this.principal = localStorage.getItem('principal');
    this.liquidityType = LiquidityType.Add;
    this.getYield();
    this.clearInterval();
    this.getIntervalLiquidity();
  }
  beforeDestroy(): void {
    this.clearInterval();
  }
  private clearInterval(): void {
    window.clearInterval(this.timer);
    this.timer = null;
  }
  private getIntervalLiquidity(): void {
    this.timer = window.setInterval(async () => {
      setTimeout(async () => {
        if (!this.getCheckAuth) {
          this.getYield();
        }
      }, 0);
    }, 10 * 1000);
  }
  public async getYield(): Promise<void> {
    const swapId = this.currentPool[0].toString();
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      const cyclesFinanceService = new CyclesFinanceService();
      this.cYield = await cyclesFinanceService.getYield();
    } else {
      const currentSwapService = new ICSwapService();
      this.cYield = await currentSwapService.getYield(swapId);
    }
  }
  private checkNum(num: bigint, decimals: number): boolean {
    if (num) {
      return new BigNumber(num.toString(10)).div(10 ** decimals).gt(10 ** 12);
    }
    return false;
  }
  private token0Value(pool: Pool): string {
    if (pool[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
      const liquidity = pool[3] as Liquidity;
      return new BigNumber(liquidity.cycles.toString(10))
        .div(10 ** 12)
        .toString(10);
    } else {
      const liquidity = pool[3] as TokenLiquidity;
      const token0Id = pool[1][0].token0[0].toString();
      return new BigNumber(liquidity.token0.toString(10))
        .div(10 ** this.tokens[token0Id].decimals)
        .toString(10);
    }
  }
  private token1Value(pool: Pool): string {
    if (pool[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
      const liquidity = pool[3] as Liquidity;
      return new BigNumber(liquidity.icpE8s.toString(10))
        .div(10 ** 8)
        .toString(10);
    } else {
      const liquidity = pool[3] as TokenLiquidity;
      const token1Id = pool[1][0].token1[0].toString();
      return new BigNumber(liquidity.token1.toString(10))
        .div(10 ** this.tokens[token1Id].decimals)
        .toString(10);
    }
  }
}
</script>
<style scoped lang="scss">
.ic-swap-yield {
  margin-bottom: 20px;
  .exchange-swap-item {
    padding: 30px 35px;
    border: none;
    box-shadow: none;
  }
}
.shares-main {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  color: #adb3c4;
  .shares-main-total {
    width: 227px;
  }
  .shares-main-user {
    width: 227px;
  }
  > div {
    display: flex;
    flex-direction: column;
  }
}
.user-liquidity-value {
  display: block;
  width: 200%;
  font-size: 20px;
  transform: scale(0.5);
  transform-origin: left center;
}
.user-liquidity-share {
  margin-top: 5px;
  font-size: 16px;
  color: #fff;
  span {
    font-size: 12px;
  }
}
.shares-main-title {
  margin-bottom: 5px;
}
.yield-main,
.your-rewards {
  display: flex;
  justify-content: flex-start;
  > span {
    flex-shrink: 0;
  }
  div {
    display: flex;
    flex-direction: column;
  }
}
.yield-main {
  color: #666c7e;
  div {
    span {
      font-size: 12px;
    }
  }
}
.your-liquidity-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 166px;
  .title {
    font-size: 16px;
  }
  button {
    width: 100%;
    transition: all 0.3s;
  }
  .your-liquidity-header-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    button {
      background: rgba(81, 183, 195, 0.2);
      color: #788384;
      &.active,
      &:hover {
        background: rgba(81, 183, 195, 0.6);
        color: #fff;
      }
    }
  }
  button.your-liquidity-header-add {
    width: 100%;
    margin-bottom: 10px;
    background: rgba(81, 183, 195, 0.4);
    &.active {
      background: #51b7c3;
      color: #fff;
    }
  }
}
@media screen and (max-width: 768px) {
  .shares-main {
    flex-wrap: wrap;
    .shares-main-total,
    .shares-main-user {
      width: 50%;
    }
    .your-liquidity-header {
      flex-direction: row;
      width: 100%;
      button {
        margin: 0;
        &:first-child {
          margin-right: 5px;
        }
        &:last-child {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
