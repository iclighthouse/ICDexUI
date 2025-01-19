<template>
  <div class="liquidity-container container-width">
    <div class="exchange-fee-item">
      <dl>
        <dt>Liquidity</dt>
        <dd>
          <div class="exchange-fee-item-left">
            <div
              v-if="
                currentPool &&
                currentPool[2] &&
                tokens &&
                tokens[currentPool[1][0].token0[0].toString()]
              "
            >
              <a-tooltip placement="bottom">
                <template slot="title">
                  {{ token0Value(currentPool, false) }}
                </template>
                <span class="num-span">{{
                  token0Value(currentPool, false) | bigintToFloat(0, 0)
                }}</span>
              </a-tooltip>
              <span class="num-span-i">/</span>
            </div>
            <div
              v-if="
                currentPool &&
                currentPool[2] &&
                tokens &&
                tokens[currentPool[1][0].token0[0].toString()]
              "
            >
              <span>{{
                tokens[currentPool[1][0].token0[0].toString()].symbol
              }}</span
              ><span class="line"></span>
            </div>
          </div>
          <!--<div class="exchange-fee-item-icon"><i></i><i></i></div>-->
          <div class="exchange-fee-item-right">
            <div
              v-if="
                currentPool &&
                currentPool[2] &&
                tokens &&
                tokens[currentPool[1][0].token1[0].toString()]
              "
            >
              <a-tooltip placement="bottom">
                <template slot="title">
                  {{ token1Value(currentPool, false) }}
                </template>
                <span class="num-span">{{
                  token1Value(currentPool, false) | bigintToFloat(0, 0)
                }}</span>
              </a-tooltip>
            </div>
            <div
              v-if="
                currentPool &&
                currentPool[2] &&
                tokens &&
                tokens[currentPool[1][0].token1[0].toString()]
              "
            >
              <span>{{
                tokens[currentPool[1][0].token1[0].toString()].symbol
              }}</span>
            </div>
          </div>
        </dd>
      </dl>
      <dl>
        <dt>Price</dt>
        <dd class="price-dd">
          <div
            class="icp-per-cycles"
            v-if="
              currentPool &&
              currentPool[2] &&
              tokens &&
              tokens[currentPool[1][0].token0[0].toString()] &&
              tokens[currentPool[1][0].token1[0].toString()]
            "
          >
            <a-tooltip placement="bottom">
              <template slot="title">
                {{ getPrice(currentPool) }}
              </template>
              <span class="num-span"
                >{{ getPrice(currentPool) | bigintToFloat(4, 0) }}
              </span>
            </a-tooltip>
          </div>
          <div
            v-if="
              currentPool &&
              currentPool[2] &&
              tokens &&
              tokens[currentPool[1][0].token0[0].toString()] &&
              tokens[currentPool[1][0].token1[0].toString()]
            "
          >
            <span
              >{{ tokens[currentPool[1][0].token0[0].toString()].symbol
              }}<span class="line">/</span
              >{{ tokens[currentPool[1][0].token1[0].toString()].symbol }}</span
            >
            <div
              v-show="
                currentPool[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'
              "
            >
              <span>NNS price: {{ icpToCyclesConversionRate }}</span>
            </div>
          </div>
        </dd>
      </dl>
      <dl class="exchange-fee-item-h5">
        <dt>Count</dt>
        <dd>
          <div class="swap-count">
            <span class="num-span" v-if="currentPool && currentPool[2]">{{
              currentPool[2].swapCount
            }}</span>
            <div>Swaps</div>
          </div>
        </dd>
      </dl>
      <dl class="exchange-fee-item-h5">
        <dt>Vol</dt>
        <dd>
          <div class="exchange-fee-item-left">
            <div
              v-if="
                currentPool &&
                currentPool[2] &&
                tokens &&
                tokens[currentPool[1][0].token0[0].toString()]
              "
            >
              <a-tooltip placement="bottom">
                <template slot="title">
                  {{ getVol0(currentPool) }}
                </template>
                <span class="num-span">{{
                  getVol0(currentPool) | bigintToFloat(0, 0)
                }}</span>
              </a-tooltip>
              <span class="num-span-i">/</span>
            </div>
            <div>
              <span
                v-if="
                  currentPool &&
                  currentPool[2] &&
                  tokens &&
                  tokens[currentPool[1][0].token0[0].toString()]
                "
                >{{
                  tokens[currentPool[1][0].token0[0].toString()].symbol
                }}</span
              ><span class="line"></span>
            </div>
          </div>
          <!--<div class="exchange-fee-item-icon"><i></i><i></i></div>-->
          <div class="exchange-fee-item-right">
            <div
              v-if="
                currentPool &&
                currentPool[2] &&
                tokens &&
                tokens[currentPool[1][0].token1[0].toString()]
              "
            >
              <a-tooltip placement="bottom">
                <template slot="title">
                  {{ getVol1(currentPool) }}
                </template>
                <span class="num-span">{{
                  getVol1(currentPool) | bigintToFloat(0, 0)
                }}</span>
              </a-tooltip>
            </div>
            <div
              v-if="
                currentPool &&
                currentPool[2] &&
                tokens &&
                tokens[currentPool[1][0].token1[0].toString()]
              "
            >
              <span>{{
                tokens[currentPool[1][0].token1[0].toString()].symbol
              }}</span>
            </div>
          </div>
        </dd>
      </dl>
    </div>
    <div class="liquidity-herder ic-swap-main">
      <div class="liquidity-herder-select">
        <a-select
          class="pool-list-select"
          v-model="currentPoolIndex"
          notFoundContent="Not Found"
          option-label-prop="children"
          @change="handleChange"
        >
          <a-select-option
            v-for="(pool, index) in pools"
            :key="index"
            :value="index"
          >
            <div class="select-pool-option">
              <div
                class="pool-img"
                v-if="
                  tokens[pool[1][0].token0[0].toString()] &&
                  tokens[pool[1][0].token1[0].toString()]
                "
              >
                <img v-if="token0Logo(pool)" :src="token0Logo(pool)" alt="" />
                <img v-if="token1Logo(pool)" :src="token1Logo(pool)" alt="" />
              </div>
              <div class="pool-name">
                <span v-if="tokens[pool[1][0].token0[0].toString()]">{{
                  tokens[pool[1][0].token0[0].toString()].symbol
                }}</span
                >/<span v-if="tokens[pool[1][0].token1[0].toString()]">{{
                  tokens[pool[1][0].token1[0].toString()].symbol
                }}</span>
              </div>
            </div>
          </a-select-option>
        </a-select>
      </div>
      <div v-if="principal" class="margin-left-auto">
        <button type="button" @click="importPool">Import Pool</button>
        <button type="button" @click="onAddLiquidity">Add Liquidity</button>
      </div>
    </div>
    <yield
      v-if="liquidityType"
      ref="yield"
      :tokens="tokens"
      :current-pool="currentPool"
      @changeLiquidityType="changeLiquidityType"
    ></yield>
    <add-liquidity
      :current-pool="currentPool"
      :tokens="tokens"
      :tokenList="tokenList"
      :tokensBalance="tokensBalance"
      v-show="liquidityType === 'Add'"
      ref="addLiquidity"
      @addLiquiditySuccess="addLiquiditySuccess"
      @tokensBalanceChange="tokensBalanceChange"
      @setCurrentPool="setCurrentPool"
    ></add-liquidity>
    <remove-liquidity
      v-show="liquidityType === 'Remove'"
      ref="removeLiquidity"
      :tokens="tokens"
      :current-pool="currentPool"
      @removeLiquiditySuccess="removeLiquiditySuccess"
    ></remove-liquidity>
    <claim
      v-show="liquidityType === 'Claim'"
      ref="claim"
      :tokens="tokens"
      :current-pool="currentPool"
    ></claim>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import {
  DexNameEnum,
  DexNameType,
  LocalPool,
  Pool,
  SwapTokenInfo
} from '@/views/home/ICSwap/model';
import { Pairs, PairsData, SwapPair, TrieListData } from '@/ic/ICSwapRouter/model';
import { Liquidity } from '@/ic/cyclesFinance/model';
import { DexInfo, TokenLiquidity, TokenType } from '@/ic/ICSwap/model';
import { CYCLES_FINANCE_CANISTER_ID, LEDGER_CANISTER_ID } from '@/ic/utils';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { ICSwapService } from '@/ic/ICSwap/ICSwapService';
import { TokenId, TokenInfo } from '@/ic/common/icType';
import AddLiquidity from '@/views/home/ICSwap/components/AddLiquidity.vue';
import Yield from '@/views/home/ICSwap/components/Yield.vue';
import Claim from '@/views/home/ICSwap/components/Claim.vue';
import RemoveLiquidity from '@/views/home/ICSwap/components/RemoveLiquidity.vue';
import { LiquidityType } from '@/views/home/cyclesFinance/model';
import { Principal } from '@dfinity/principal';
import { CyclesMintingService } from '@/ic/cyclesMinting/cyclesMintingService';
import {
  icpOrCyclesToSwapTokenId,
  swapTokenIdToIcpOrCycles,
  toLocalPool
} from '@/ic/icSwapUtils';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';
@Component({
  name: 'IcSwapLiquidity',
  components: { AddLiquidity, Yield, Claim, RemoveLiquidity }
})
export default class extends Vue {
  @Prop({ type: Object, default: () => null })
  tokens!: { [key: string]: TokenInfo };
  @Prop({ type: Object, default: () => null })
  tokensBalance!: { [key: string]: string };
  @Prop({ type: Array, default: () => [] })
  tokenList!: Array<SwapTokenInfo>;
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  private pools: Array<Pool> = [];
  private currentPoolIndex: number = null;
  private currentPool: Pool = null;
  private liquidityType: LiquidityType = LiquidityType.Add;
  private localPools: Array<LocalPool> = [];
  private liquidityTimer = null;
  private icpToCyclesConversionRate = '-';
  private swapId: string;
  private principal = '';
  created(): void {
    this.principal = localStorage.getItem('principal');
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    const tokenFromId = icpOrCyclesToSwapTokenId(
      this.$route.params.tokenFromId
    );
    const tokenToId = icpOrCyclesToSwapTokenId(this.$route.params.tokenToId);
    if (
      tokenFromId &&
      (!this.tokens[tokenFromId] ||
        (this.tokens[tokenFromId] && !this.tokens[tokenFromId].logo))
    ) {
      this.$emit('tokenChange', tokenFromId);
    }
    if (
      tokenToId &&
      (!this.tokens[tokenToId] ||
        (this.tokens[tokenToId] && !this.tokens[tokenToId].logo))
    ) {
      this.$emit('tokenChange', tokenToId);
    }
    if (tokenFromId && tokenToId) {
      this.getLocalPool(tokenFromId, tokenToId);
    }
    this.getIntervalLiquidity();
  }
  beforeDestroy(): void {
    this.clearInterval();
  }
  private getLocalPool(tokenFromId: string, tokenToId: string): void {
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    this.localPools = currentInfo.pools || [];
    this.formatPool();
    this.pools.some((pool, index) => {
      const token0 = pool[1][0].token0[0].toString();
      const token1 = pool[1][0].token1[0].toString();
      if (
        (token0 === tokenFromId && token1 === tokenToId) ||
        (token1 === tokenFromId && token0 === tokenToId)
      ) {
        this.currentPoolIndex = index;
        this.currentPool = pool;
        this.$nextTick(() => {
          (this.$refs.yield as any).init();
        });
        return true;
      }
    });
  }
  private setCurrentPool(swapId: string, currentRoute: Array<Pairs>): void {
    this.swapId = swapId;
    if (currentRoute) {
      const principal = localStorage.getItem('principal');
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      this.localPools = currentInfo.pools || [];
      this.initLocalPoos();
    }
  }
  private async getConversionRate(): Promise<void> {
    const cyclesMintingService = new CyclesMintingService();
    const icpToCyclesConversionRate =
      await cyclesMintingService.getIcpToCyclesConversionRate();
    this.icpToCyclesConversionRate = new BigNumber(
      icpToCyclesConversionRate.toString(10)
    )
      .div(10 ** 10)
      .integerValue(BigNumber.ROUND_DOWN)
      .div(10 ** 2)
      .toString(10);
  }
  private clearInterval(): void {
    window.clearInterval(this.liquidityTimer);
    this.liquidityTimer = null;
  }
  private tokensBalanceChange(tokensBalance): void {
    this.$emit('tokensBalanceChange', tokensBalance);
  }
  private async init(): Promise<void> {
    if (this.swapId) {
      // const loading = this.$loading({
      //   lock: true,
      //   background: 'rgba(0, 0, 0, 0.5)'
      // });
      try {
        const hasPool = this.pools.some((pool, index) => {
          if (pool[0].toString() === this.swapId) {
            this.currentPoolIndex = index;
            this.currentPool = pool;
          }
          return pool[0].toString() === this.swapId;
        });
        if (!hasPool) {
          const dexInfo = await this.getDexInfo(this.swapId);
          const promiseAllValue = [];
          const principal = localStorage.getItem('principal');
          promiseAllValue.push(
            this.ICSwapRouterFiduciaryService.route(
              Principal.fromText(this.getCurrentTokenId(dexInfo.token0[0])),
              Principal.fromText(this.getCurrentTokenId(dexInfo.token1[0]))
            ),
            this.getLiquidity(this.swapId),
            this.getLiquidity(this.swapId, principal),
            this.getSwapDecimals(this.swapId)
          );
          const res = await Promise.all(promiseAllValue);
          this.currentPool = [
            Principal.fromText(this.swapId),
            res[0][0][1],
            res[1],
            res[2],
            res[3]
          ];
          this.pools.push(this.currentPool);
          this.localPools.push(toLocalPool(this.currentPool));
          this.currentPoolIndex = this.pools.length - 1;
          const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
          currentInfo.pools = this.localPools;
          localStorage.setItem(
            principal,
            JSON.stringify(currentInfo, (key, value) =>
              typeof value === 'bigint' ? value.toString(10) : value
            )
          );
        }
        this.liquidityType = LiquidityType.Add;
        setTimeout(() => {
          (this.$refs.yield as any).init();
          (this.$refs.addLiquidity as any).initLiquidity();
        }, 0);
        const hasIcp = this.pools.some((pool) => {
          return pool[0].toString() === CYCLES_FINANCE_CANISTER_ID;
        });
        if (!hasIcp) {
          this.onGetPairs();
        }
      } catch (e) {
      }
      // loading.close();
    }
  }
  private handleChange(currentPoolIndex: number): void {
    this.currentPoolIndex = currentPoolIndex;
    this.currentPool = this.pools[currentPoolIndex];
    this.onAdd();
  }
  private getCurrentTokenId(tokenType: TokenType): string {
    if (tokenType) {
      const token = tokenType as { Token: TokenId };
      const tokenStd = Object.keys(tokenType)[0];
      if (token.Token) {
        return token.Token.toString();
      } else if (tokenStd === 'Cycles') {
        return CYCLES_FINANCE_CANISTER_ID;
      } else if (tokenStd === 'Icp') {
        return LEDGER_CANISTER_ID;
      }
    }
    return '';
  }
  private async getSwapDecimals(swapId: string): Promise<number> {
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      return 0;
    }
    const currentICSwapService = new ICSwapService();
    return await currentICSwapService.decimals(swapId);
  }
  private async getDexInfo(swapId: string): Promise<DexInfo> {
    const currentICSwapService = new ICSwapService();
    try {
      return await currentICSwapService.drc205_dexInfo(swapId);
    } catch (e) {
      return null;
    }
  }
  private async getIntervalLiquidity(): Promise<void> {
    this.getConversionRate();
    const principal = localStorage.getItem('principal');
    this.liquidityTimer = window.setInterval(() => {
      setTimeout(() => {
        if (this.pools) {
          for (let i = 0; i < this.pools.length; i++) {
            const pool = this.pools[i];
            this.getLiquidity(pool[0].toString()).then((res) => {
              this.$set(this.pools[i], 2, res);
              if (this.currentPoolIndex === i) {
                this.$set(this.currentPool, 2, res);
              }
              this.localPools[i][2] = res;
            });
            this.getLiquidity(pool[0].toString(), principal).then((res) => {
              this.$set(this.pools[i], 3, res);
              if (this.currentPoolIndex === i) {
                this.$set(this.currentPool, 3, res);
              }
              if (this.localPools[i][0] === this.pools[i][0].toString()) {
                this.localPools[i][3] = res;
                const currentInfo =
                  JSON.parse(localStorage.getItem(principal)) || {};
                currentInfo.pools = this.localPools;
                localStorage.setItem(
                  principal,
                  JSON.stringify(currentInfo, (key, value) =>
                    typeof value === 'bigint' ? value.toString(10) : value
                  )
                );
              }
            });
          }
          this.getConversionRate();
        }
      }, 0);
    }, 30 * 1000);
  }
  private formatPool(): void {
    const pools: Array<Pool> = [];
    this.localPools.forEach((pool: LocalPool) => {
      const swapPair: SwapPair = {
        feeRate: pool[1][0].feeRate,
        token0: [
          Principal.fromText(pool[1][0].token0[0]),
          pool[1][0].token0[1],
          pool[1][0].token0[2]
        ],
        token1: [
          Principal.fromText(pool[1][0].token1[0]),
          pool[1][0].token1[1],
          pool[1][0].token1[2]
        ],
        dexName: pool[1][0].dexName,
        canisterId: Principal.fromText(pool[1][0].canisterId)
      };
      pools.push([
        Principal.fromText(pool[0]),
        [swapPair, BigInt(pool[1][1])],
        pool[2],
        pool[3],
        pool[4]
      ]);
    });
    this.pools = pools;
  }
  private async initLocalPoos(): Promise<void> {
    this.formatPool();
    if (!this.swapId) {
      this.currentPoolIndex = 0;
    } else {
      let currentPoolIndex = 0;
      const flag = this.pools.some((pool, index) => {
        if (pool[0].toString() === this.swapId) {
          currentPoolIndex = index;
        }
        return pool[0].toString() === this.swapId;
      });
      if (flag) {
        this.currentPoolIndex = currentPoolIndex;
        this.currentPool = this.pools[this.currentPoolIndex];
        this.onAdd();
      }
    }
    this.init();
  }
  private changeLiquidityType(liquidityType: LiquidityType): void {
    this.liquidityType = liquidityType;
    if (liquidityType === LiquidityType.Add) {
      (this.$refs.addLiquidity as any).initAdd();
    } else if (liquidityType === LiquidityType.Claim) {
      setTimeout(() => {
        (this.$refs.claim as any).init();
      }, 0);
    } else if (liquidityType === LiquidityType.Remove) {
      (this.$refs.removeLiquidity as any).shares = '';
      (this.$refs.removeLiquidity as any).getAutoWithdrawal(
        this.currentPool[0].toString()
      );
    }
  }
  private async removeLiquiditySuccess(): Promise<void> {
    await this.updateLiquidity(
      this.currentPool[0].toString(),
      this.currentPoolIndex
    );
    // if user remove all shares
    // if (
    //   new BigNumber(this.pools[this.currentPoolIndex][3].shares.toString()).eq(
    //     0
    //   )
    // ) {
    //   (this.$refs.claim as any).claim(false);
    // }
  }
  private async addLiquiditySuccess(
    currentRoute: Array<Pairs>,
    swapDecimals: number
  ): Promise<void> {
    if (this.currentPoolIndex) {
      this.updateLiquidity(
        this.currentPool[0].toString(),
        this.currentPoolIndex
      );
    } else {
      const principal = localStorage.getItem('principal');
      const currentRouteId = currentRoute[0][0].toString();
      let currentIndex = 0;
      const hasPool = this.pools.some((pool, index) => {
        if (pool[0].toString() === currentRouteId) {
          currentIndex = index;
        }
        return pool[0].toString() === currentRouteId;
      });
      if (hasPool) {
        this.updateLiquidity(currentRouteId, currentIndex);
        return;
      }
      const promiseAllValue = [];
      promiseAllValue.push(
        this.getLiquidity(currentRouteId),
        this.getLiquidity(currentRouteId, principal)
      );
      const res = await Promise.all(promiseAllValue);
      const pool: Pool = [...currentRoute[0], res[0], res[1], swapDecimals];
      this.pools.push(pool);
      this.localPools.push(toLocalPool(pool));
      this.currentPoolIndex = this.pools.length - 1;
      this.currentPool = this.pools[this.currentPoolIndex];
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      currentInfo.pools = this.localPools;
      localStorage.setItem(
        principal,
        JSON.stringify(currentInfo, (key, value) =>
          typeof value === 'bigint' ? value.toString(10) : value
        )
      );
    }
  }
  private async updateLiquidity(
    swapId: string,
    currentIndex: number
  ): Promise<void> {
    const principal = localStorage.getItem('principal');
    const promiseAllValue = [];
    promiseAllValue.push(
      this.getLiquidity(swapId),
      this.getLiquidity(swapId, principal)
    );
    const res = await Promise.all(promiseAllValue);
    this.pools[currentIndex][2] = res[0];
    this.pools[currentIndex][3] = res[1];
    if (this.currentPool && this.currentPool.length) {
      this.currentPool = [...this.pools[currentIndex]];
    }
    this.$forceUpdate();
    if (
      this.localPools[currentIndex][0] ===
      this.pools[currentIndex][0].toString()
    ) {
      this.localPools[currentIndex] = toLocalPool(this.pools[currentIndex]);
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      currentInfo.pools = this.localPools;
      localStorage.setItem(
        principal,
        JSON.stringify(currentInfo, (key, value) =>
          typeof value === 'bigint' ? value.toString(10) : value
        )
      );
    }
  }
  private importPool(): void {
    this.$router.push('/ICSwap/find');
  }
  private onAddLiquidity(): void {
    this.$router.push('/ICSwap/addLiquidity');
  }
  private onAdd(): void {
    // this.currentPool = pool;
    // this.currentPoolIndex = index;
    this.liquidityType = LiquidityType.Add;
    // const swapId = this.$route.params.swapId;
    if (this.currentPool[0].toString() !== this.swapId) {
      this.swapId = this.currentPool[0].toString();
      this.$router.push(
        `/ICSwap/liquidity/${swapTokenIdToIcpOrCycles(
          this.currentPool[1][0].token0[0].toString()
        )}/${swapTokenIdToIcpOrCycles(
          this.currentPool[1][0].token1[0].toString()
        )}`
      );
      setTimeout(() => {
        (this.$refs.yield as any).init();
        (this.$refs.addLiquidity as any).initAdd();
        (this.$refs.addLiquidity as any).init();
      }, 0);
    }
  }
  private async onGetPairs(): Promise<void> {
    const promiseAllValue = [];
    promiseAllValue.push(
      this.getPairs(DexNameEnum.cyclesfinance)
      // this.getPairs(DexNameEnum.icswap)
    );
    let swapPairs: Array<TrieListData> = [];
    const res = await Promise.all(promiseAllValue);
    if (res[0]) {
      swapPairs = swapPairs.concat(res[0]);
    }
    // if (res[1]) {
    //   swapPairs = swapPairs.concat(res[1]);
    // }
    const principal = localStorage.getItem('principal');
    const promiseAllLiquidity = [];
    for (let i = 0; i < swapPairs.length; i++) {
      promiseAllLiquidity.push(this.getPairsLiquidity(swapPairs[i], principal));
    }
    await Promise.all(promiseAllLiquidity);
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    currentInfo.pools = this.localPools;
    localStorage.setItem(
      principal,
      JSON.stringify(currentInfo, (key, value) =>
        typeof value === 'bigint' ? value.toString(10) : value
      )
    );
  }
  private async getPairs(
    dexName: DexNameType,
    page = 1,
    size = 20
  ): Promise<Array<PairsData>> {
    const res = await this.ICSwapRouterFiduciaryService.getPairs(
      [dexName],
      [page],
      [size]
    );
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
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
  private async getPairsLiquidity(
    swap: TrieListData,
    address: string
  ): Promise<void> {
    let account = [];
    if (address) {
      account = [address];
    }
    const swapId = swap[0].toString();
    let decimals = 0;
    const promiseAll = [];
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      const cyclesFinanceService = new CyclesFinanceService();
      promiseAll.push([
        await cyclesFinanceService.liquidity(account),
        await cyclesFinanceService.liquidity([]),
        decimals
      ]);
    } else {
      const currentICSwapService = new ICSwapService();
      promiseAll.push([
        await currentICSwapService.liquidity(swapId, account),
        await currentICSwapService.liquidity(swapId, []),
        await currentICSwapService.decimals(swapId)
      ]);
    }
    const res = await Promise.all(promiseAll);
    if (res[0] && res[0][0].shares && res[0][0].shares !== BigInt(0)) {
      const pool: Pool = [...swap, res[0][1], res[0][0], res[0][2]];
      this.pools.push(pool);
      this.localPools.push(toLocalPool(pool));
    }
  }
  private token0Logo(pool: Pool): string {
    if (pool[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
      return require('@/assets/img/cycles.png');
    } else {
      const token0Id = pool[1][0].token0[0].toString();
      if (this.tokens && this.tokens[token0Id] && this.tokens[token0Id].logo) {
        return this.tokens[token0Id].logo;
      } else {
        return '';
      }
    }
  }
  private token1Logo(pool: Pool): string {
    if (pool[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
      return require('@/assets/img/dfinity.png');
    } else {
      const token1Id = pool[1][0].token1[0].toString();
      if (this.tokens && this.tokens[token1Id] && this.tokens[token1Id].logo) {
        return this.tokens[token1Id].logo;
      } else {
        return '';
      }
    }
  }
  private getPrice(pool: Pool): string {
    const token0Id = pool[1][0].token0[0].toString();
    if (this.token1Value(pool, false) !== '0') {
      return new BigNumber(this.token0Value(pool, false))
        .div(this.token1Value(pool, false))
        .decimalPlaces(this.tokens[token0Id].decimals, 1)
        .toString(10);
    } else {
      return '0';
    }
  }
  private getVol0(pool: Pool): string {
    if (pool[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
      let liquidity = pool[2] as Liquidity;
      return new BigNumber(liquidity.vol.swapCyclesVol.toString(10))
        .div(10 ** 12)
        .toString(10);
    } else {
      let liquidity = pool[2] as TokenLiquidity;
      const token0Id = pool[1][0].token0[0].toString();
      return new BigNumber(liquidity.vol.value0.toString(10))
        .div(10 ** this.tokens[token0Id].decimals)
        .toString(10);
    }
  }
  private getVol1(pool: Pool): string {
    if (pool[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
      let liquidity = pool[2] as Liquidity;
      return new BigNumber(liquidity.vol.swapIcpVol.toString(10))
        .div(10 ** 8)
        .toString(10);
    } else {
      let liquidity = pool[2] as TokenLiquidity;
      const token1Id = pool[1][0].token1[0].toString();
      return new BigNumber(liquidity.vol.value1.toString(10))
        .div(10 ** this.tokens[token1Id].decimals)
        .toString(10);
    }
  }
  private token0Value(pool: Pool, isUserValue = true): string {
    if (pool[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
      let liquidity = pool[3] as Liquidity;
      if (!isUserValue) {
        liquidity = pool[2] as Liquidity;
      }
      return new BigNumber(liquidity.cycles.toString(10))
        .div(10 ** 12)
        .toString(10);
    } else {
      let liquidity = pool[3] as TokenLiquidity;
      if (!isUserValue) {
        liquidity = pool[2] as TokenLiquidity;
      }
      const token0Id = pool[1][0].token0[0].toString();
      return new BigNumber(liquidity.token0.toString(10))
        .div(10 ** this.tokens[token0Id].decimals)
        .toString(10);
    }
  }
  private token1Value(pool: Pool, isUserValue = true): string {
    if (pool[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
      let liquidity = pool[3] as Liquidity;
      if (!isUserValue) {
        liquidity = pool[2] as Liquidity;
      }
      return new BigNumber(liquidity.icpE8s.toString(10))
        .div(10 ** 8)
        .toString(10);
    } else {
      let liquidity = pool[3] as TokenLiquidity;
      if (!isUserValue) {
        liquidity = pool[2] as TokenLiquidity;
      }
      const token1Id = pool[1][0].token1[0].toString();
      return new BigNumber(liquidity.token1.toString(10))
        .div(10 ** this.tokens[token1Id].decimals)
        .toString(10);
    }
  }
}
</script>
<style scoped lang="scss">
.liquidity-container {
  padding-bottom: 20px;
  ::v-deep input {
    text-align: right;
  }
}
table {
  background: #13181d;
  padding: 40px 50px 30px;
  border-radius: 9px;
  color: #727a87;
  margin-bottom: 40px;
  .pool-info {
    display: flex;
    align-items: center;
    padding-left: 15px;
    &:hover {
      color: #fff;
    }
  }
  .add-liquidity-button {
    padding-right: 15px;
  }
}
.select-pool-option {
  display: flex;
  align-items: center;
}
.pool-img {
  display: flex;
  align-items: center;
  width: 40px;
  img {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    object-fit: contain;
    vertical-align: top;
  }
}
.pool-name {
  padding-left: 10px;
}
.liquidity-herder {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .pool-list-select {
    width: 300px;
  }
  ::v-deep .ant-select-selection__placeholder {
    color: #727a87;
  }
  ::v-deep .ant-select-selection {
    box-shadow: none;
  }
  ::v-deep .ant-select-selection:hover {
    border-color: #464648;
  }
  > div {
    display: flex;
    align-items: center;
    button {
      height: 28px;
      margin-left: 10px;
    }
  }
  ::v-deep .ant-select-selection__rendered {
    line-height: 34px;
  }
}
.exchange-fee-item {
  position: relative;
  top: -40px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  background: #141b23;
  border-radius: 5px;
  padding: 30px 20px 25px;
  color: #adb3c4;
  .exchange-fee-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    i:last-child {
      transform: rotate(10deg) translateY(5px);
    }
  }
  i {
    display: inline-block;
    width: 1px;
    height: 12px;
    background: #636c73;
    font-style: normal;
    margin: 0 5px;
    transform: rotate(10deg);
  }
  dl {
    width: 25%;
    text-align: center;
    &.exchange-fee-item-bottom {
      margin-top: 20px;
    }
  }
  dd {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    height: 50px;
    margin-top: 15px;
    &.price-dd {
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
    }
    span {
      font-size: 12px;
      &.num-span {
        font-size: 24px;
        line-height: 24px;
        color: #fff;
      }
    }
  }
  .exchange-fee-item-left,
  .exchange-fee-item-right {
    > div {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      &:first-child {
        margin-bottom: 5px;
      }
      &:last-child {
        margin-top: 7px;
      }
    }
  }
  .exchange-fee-item-right {
    > div {
      justify-content: flex-start;
    }
  }
}
.num-span-i {
  font-size: 16px !important;
  margin-top: 2px;
  padding: 0 2px;
}
.line {
  width: 12px;
}
.swap-count {
  display: flex;
  flex-direction: column;
  .num-span {
    margin-bottom: 5px;
  }
}
.icp-per-cycles {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
@media screen and (max-width: 768px) {
  .liquidity-container {
    padding: 0 15px 20px;
  }
  .exchange-fee-item {
    flex-wrap: wrap;
    .exchange-fee-item-h5 {
      display: none;
    }
    dl {
      width: 50%;
    }
  }
  .liquidity-herder {
    flex-direction: column;
    align-items: flex-start;
    .liquidity-herder-select {
      width: 100%;
      .pool-list-select {
        width: 100%;
      }
    }
    .margin-left-auto {
      margin-left: 0;
      button {
        margin: 10px 10px 10px 0;
      }
    }
  }
}
</style>
