<template>
  <div class="add-main">
    <div class="ic-swap-main add-liquidity-header">
      <a-icon class="back-icon" type="arrow-left" @click="back" />
      <span class="base-font-title">Add Liquidity</span>
    </div>
    <!--<yield ref="yield" :tokens="tokens"></yield>-->
    <add-liquidity
      :tokens="tokens"
      :tokenList="tokenList"
      :tokensBalance="tokensBalance"
      ref="addLiquidity"
      @addLiquiditySuccess="addLiquiditySuccess"
      @tokensBalanceChange="tokensBalanceChange"
    ></add-liquidity>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AddLiquidity from '@/views/home/ICSwap/components/AddLiquidity.vue';
import Yield from '@/views/home/ICSwap/components/Yield.vue';
import { TokenInfo } from '@/ic/common/icType';
import {
  LocalPool,
  LocalSwapPair,
  Pool,
  SwapTokenInfo
} from '@/views/home/ICSwap/model';
import { Pairs } from '@/ic/ICSwapRouter/model';
import { Liquidity } from '@/ic/cyclesFinance/model';
import { TokenLiquidity } from '@/ic/ICSwap/model';
import { CYCLES_FINANCE_CANISTER_ID } from '@/ic/utils';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { ICSwapService } from '@/ic/ICSwap/ICSwapService';
import { toLocalPool } from '@/ic/icSwapUtils';

@Component({
  name: 'Add',
  components: {
    AddLiquidity,
    Yield
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: () => null })
  tokens!: { [key: string]: TokenInfo };
  @Prop({ type: Object, default: () => null })
  tokensBalance!: { [key: string]: string };
  @Prop({ type: Array, default: () => [] })
  tokenList!: Array<SwapTokenInfo>;
  private back(): void {
    this.$router.push('/ICSwap/liquidity/icp/cycles');
  }
  private async addLiquiditySuccess(
    currentRoute: Array<Pairs>,
    swapDecimals: number
  ): Promise<void> {
    const principal = localStorage.getItem('principal');
    const currentRouteId = currentRoute[0][0].toString();
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    const localPoos = currentInfo.pools || [];
    const hasPool = localPoos.some((pool, index) => {
      return pool[0].toString() === currentRouteId;
    });
    if (!hasPool) {
      const promiseAllValue = [];
      promiseAllValue.push(
        this.getLiquidity(currentRouteId),
        this.getLiquidity(currentRouteId, principal)
      );
      const res = await Promise.all(promiseAllValue);
      console.log(res, currentRoute);
      const pool: Pool = [...currentRoute[0], res[0], res[1], swapDecimals];
      localPoos.push(toLocalPool(pool));
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      currentInfo.pools = localPoos;
      localStorage.setItem(
        principal,
        JSON.stringify(currentInfo, (key, value) =>
          typeof value === 'bigint' ? value.toString(10) : value
        )
      );
    }
  }
  private tokensBalanceChange(tokensBalance): void {
    this.$emit('tokensBalanceChange', tokensBalance);
  }
  private async getLiquidity(
    swapId: string,
    address?: string
  ): Promise<Liquidity | TokenLiquidity> {
    let account = [];
    if (address) {
      account = [address];
    }
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      const cyclesFinanceService = new CyclesFinanceService();
      return await cyclesFinanceService.liquidity(account);
    } else {
      const currentICSwapService = new ICSwapService();
      return await currentICSwapService.liquidity(swapId, account);
    }
  }
}
</script>

<style scoped lang="scss">
.back-icon {
  position: absolute;
  left: 50px;
  cursor: pointer;
  font-size: 20px;
}
.add-liquidity-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  font-size: 18px;
  background: #13181d;
	border: 1px solid #313b46;
  padding: 10px 0;
  border-radius: 9px;
}
@media screen and (max-width: 768px) {
  .add-main {
    padding: 0 15px 20px;
  }
}
</style>
