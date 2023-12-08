<template>
  <div>
    <div class="home-header">
      <div class="home-header-left">
        <img
          class="home-header-logo"
          src="@/assets/img/icdex-2.png"
          alt="logo"
        />
      </div>
      <ul>
        <li
          :class="{
            active:
              $route.path.toLocaleLowerCase() ===
                menu.path.toLocaleLowerCase() ||
              (menu.value === 'Trade' && $route.name === 'ICDex')
          }"
          v-for="(menu, index) in menuList"
          :key="index"
        >
          <router-link :to="menu.path">{{ menu.value }}</router-link>
        </li>
      </ul>
      <account-info :menu-list="menuList"></account-info>
    </div>
    <div class="market-main container-width">
      <div>
        <div class="flex-center">
          <span class="base-color-w" style="font-size: 16px">Pool list</span>
          <button
            v-if="getPrincipalId"
            type="button"
            class="primary margin-left-auto"
            @click="onCreatePool"
          >
            Create Pool
          </button>
        </div>
        <ul v-if="!poolLoad && poolsLoad.length > 0" class="pool-main mt20">
          <li
            v-for="(item, index) in poolsHold"
            :key="index"
            @click="jumpPool(item[1])"
          >
            <div
              v-if="
                item[2] &&
                tokens[item[2].pairInfo.token0[0].toString()] &&
                tokens[item[2].pairInfo.token1[0].toString()]
              "
              class="pool-pair-img"
            >
              <span class="img-content">
                <img
                  :src="tokens[item[2].pairInfo.token0[0].toString()].logo"
                  alt=""
                />
              </span>
              <span class="img-content">
                <img
                  :src="tokens[item[2].pairInfo.token1[0].toString()].logo"
                  alt=""
                />
              </span>
              <span
                v-if="item[2]"
                class="base-font-title"
                style="margin-left: 5px"
              >
                {{ item[2].name | ellipsisAccount(20) }}
              </span>
              <span class="pc-show" style="margin-left: 5px; color: #8c98a5">
                {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}/{{
                  tokens[item[2].pairInfo.token1[0].toString()].symbol
                }}
              </span>
              <span class="creator-img" v-if="isCreator(item[1])">
                <img src="@/assets/img/creator.svg" alt="" />
              </span>
              <span
                v-if="item[5] && item[5].vipMaker"
                class="margin-left-auto vip-maker-pool"
              >
                VIP
              </span>
              <span
                v-if="item[5] && !item[5].vipMaker"
                class="margin-left-auto main-color"
                @click.stop="
                  onBindMaker(
                    item[2].pairInfo.pairPrincipal.toString(),
                    item[1][0][0].toString(),
                    index,
                    true
                  )
                "
              >
                Become Maker
              </span>
            </div>
            <div
              v-if="
                item[2] &&
                tokens[item[2].pairInfo.token0[0].toString()] &&
                tokens[item[2].pairInfo.token1[0].toString()]
              "
            >
              <span>UnitNetValue: </span>
              <span class="base-font-title" v-if="item[3]">
                {{
                  item[3].latestUnitNetValue.token0
                    | bigintToFloat(
                      8,
                      tokens[item[2].pairInfo.token0[0].toString()].decimals
                    )
                }}
                {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}
                +
                {{
                  item[3].latestUnitNetValue.token1
                    | bigintToFloat(
                      8,
                      tokens[item[2].pairInfo.token1[0].toString()].decimals
                    )
                }}
                {{ tokens[item[2].pairInfo.token1[0].toString()].symbol }}
              </span>
              <span v-else>-</span>
            </div>
            <div
              v-if="
                item[2] &&
                tokens[item[2].pairInfo.token0[0].toString()] &&
                tokens[item[2].pairInfo.token1[0].toString()]
              "
            >
              <span> Balance: </span>
              <span class="base-font-title" v-if="item[3]">
                {{
                  item[3].poolBalance.balance0
                    | bigintToFloat(
                      Math.min(
                        tokens[item[2].pairInfo.token0[0].toString()].decimals,
                        8
                      ),
                      tokens[item[2].pairInfo.token0[0].toString()].decimals
                    )
                    | formatNum
                }}
                {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}
                +
                {{
                  item[3].poolBalance.balance1
                    | bigintToFloat(
                      Math.min(
                        tokens[item[2].pairInfo.token1[0].toString()].decimals,
                        8
                      ),
                      tokens[item[2].pairInfo.token1[0].toString()].decimals
                    )
                    | formatNum
                }}
                {{ tokens[item[2].pairInfo.token1[0].toString()].symbol }}
              </span>
              <span v-else>-</span>
            </div>
            <div>
              <span>Total Shares: </span>
              <span class="base-font-title" v-if="item[3] && item[2]">{{
                item[3].poolShares
                  | bigintToFloat(item[2].shareDecimals, item[2].shareDecimals)
                  | formatNum
              }}</span>
              <span v-else>-</span>
            </div>
            <div v-if="item[4] && item[4][0] && item[2]">
              <span>Your Shares: </span>
              <span class="base-font-title">
                {{
                  item[4][0]
                    | bigintToFloat(
                      item[2].shareDecimals,
                      item[2].shareDecimals
                    )
                    | formatNum
                }}
              </span>
            </div>
            <div class="pool-apy">
              <span>APY:&nbsp;</span>
              <span class="pool-apy-item">
                <span
                  v-if="
                    item[3] &&
                    item[2] &&
                    tokens[item[2].pairInfo.token0[0].toString()] &&
                    tokens[item[2].pairInfo.token1[0].toString()]
                  "
                >
                  <span>
                    {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}
                    {{ item[3].apy24h.token0 | filterBuyFee }},</span
                  >
                  <span>
                    {{ tokens[item[2].pairInfo.token1[0].toString()].symbol }}
                    {{ item[3].apy24h.token1 | filterBuyFee }}(24-Hour APY)
                  </span>
                </span>
                <span
                  v-if="
                    item[3] &&
                    item[2] &&
                    tokens[item[2].pairInfo.token0[0].toString()] &&
                    tokens[item[2].pairInfo.token1[0].toString()]
                  "
                >
                  <span>
                    {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}
                    {{ item[3].apy7d.token0 | filterBuyFee }},</span
                  >
                  <span>
                    {{ tokens[item[2].pairInfo.token1[0].toString()].symbol }}
                    {{ item[3].apy7d.token1 | filterBuyFee }}(7-Day APY)
                  </span>
                </span>
                <span v-else>-</span>
              </span>
            </div>
            <div v-if="getPrincipalId" class="flex-center mt20">
              <button
                class="primary"
                @click.stop="
                  jump(`/ICDex/pools/pool/${item[1][0][0].toString()}/Add`)
                "
              >
                Add
              </button>
              <button
                class="primary"
                @click.stop="
                  jump(`/ICDex/pools/pool/${item[1][0][0].toString()}/Remove`)
                "
                style="margin-left: 20px"
              >
                Remove
              </button>
            </div>
          </li>
          <li
            v-show="
              !poolLoad &&
              !pools.length &&
              !poolsHold.length &&
              poolsLoad.length > 0
            "
          >
            <a-skeleton
              :loading="
                !poolLoad &&
                !pools.length &&
                !poolsHold.length &&
                poolsLoad.length > 0
              "
              active
            />
          </li>
          <li
            v-show="
              !poolLoad &&
              !pools.length &&
              !poolsHold.length &&
              poolsLoad.length > 0
            "
          >
            <a-skeleton
              :loading="
                !poolLoad &&
                !pools.length &&
                !poolsHold.length &&
                poolsLoad.length > 0
              "
              active
            />
          </li>
        </ul>
        <ul v-if="pools.length" class="pool-main pool-main-remaining">
          <li
            v-for="(item, index) in pools.slice(
              0,
              morePools ? pools.length : 6
            )"
            :key="index"
            @click="jumpPool(item[1])"
          >
            <div
              v-if="
                item[2] &&
                tokens[item[2].pairInfo.token0[0].toString()] &&
                tokens[item[2].pairInfo.token1[0].toString()]
              "
              class="pool-pair-img"
            >
              <span class="img-content">
                <img
                  :src="tokens[item[2].pairInfo.token0[0].toString()].logo"
                  alt=""
                />
              </span>
              <span class="img-content">
                <img
                  :src="tokens[item[2].pairInfo.token1[0].toString()].logo"
                  alt=""
                />
              </span>
              <span
                v-if="item[2]"
                class="base-font-title"
                style="margin-left: 5px"
              >
                {{ item[2].name | ellipsisAccount(20) }}
              </span>
              <span class="pc-show" style="margin-left: 5px; color: #8c98a5">
                {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}/{{
                  tokens[item[2].pairInfo.token1[0].toString()].symbol
                }}
              </span>
              <span class="creator-img" v-if="isCreator(item[1])">
                <img src="@/assets/img/creator.svg" alt="" />
              </span>
              <span
                v-if="item[5] && item[5].vipMaker"
                class="margin-left-auto vip-maker-pool"
              >
                VIP
              </span>
              <span
                v-if="item[5] && !item[5].vipMaker && getPrincipalId"
                class="margin-left-auto main-color"
                @click.stop="
                  onBindMaker(
                    item[2].pairInfo.pairPrincipal.toString(),
                    item[1][0][0].toString(),
                    index,
                    false
                  )
                "
              >
                Become Maker
              </span>
            </div>
            <div
              v-if="
                item[2] &&
                tokens[item[2].pairInfo.token0[0].toString()] &&
                tokens[item[2].pairInfo.token1[0].toString()]
              "
            >
              <span>UnitNetValue: </span>
              <span class="base-font-title" v-if="item[3]">
                {{
                  item[3].latestUnitNetValue.token0
                    | bigintToFloat(
                      8,
                      tokens[item[2].pairInfo.token0[0].toString()].decimals
                    )
                }}
                {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}
                +
                {{
                  item[3].latestUnitNetValue.token1
                    | bigintToFloat(
                      8,
                      tokens[item[2].pairInfo.token1[0].toString()].decimals
                    )
                }}
                {{ tokens[item[2].pairInfo.token1[0].toString()].symbol }}
              </span>
              <span v-else>-</span>
            </div>
            <div
              v-if="
                item[2] &&
                tokens[item[2].pairInfo.token0[0].toString()] &&
                tokens[item[2].pairInfo.token1[0].toString()]
              "
            >
              <span> Balance: </span>
              <span class="base-font-title" v-if="item[3]">
                {{
                  item[3].poolBalance.balance0
                    | bigintToFloat(
                      Math.min(
                        tokens[item[2].pairInfo.token0[0].toString()].decimals,
                        8
                      ),
                      tokens[item[2].pairInfo.token0[0].toString()].decimals
                    )
                    | formatNum
                }}
                {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}
                +
                {{
                  item[3].poolBalance.balance1
                    | bigintToFloat(
                      Math.min(
                        tokens[item[2].pairInfo.token1[0].toString()].decimals,
                        8
                      ),
                      tokens[item[2].pairInfo.token1[0].toString()].decimals
                    )
                    | formatNum
                }}
                {{ tokens[item[2].pairInfo.token1[0].toString()].symbol }}
              </span>
              <span v-else>-</span>
            </div>
            <div>
              <span>Total Shares: </span>
              <span class="base-font-title" v-if="item[3] && item[2]">{{
                item[3].poolShares
                  | bigintToFloat(item[2].shareDecimals, item[2].shareDecimals)
                  | formatNum
              }}</span>
              <span v-else>-</span>
            </div>
            <div v-if="item[4] && item[4][0] && item[2]">
              <span>Your Shares: </span>
              <span class="base-font-title">
                {{
                  item[4][0]
                    | bigintToFloat(
                      item[2].shareDecimals,
                      item[2].shareDecimals
                    )
                    | formatNum
                }}
              </span>
            </div>
            <div class="pool-apy">
              <span>APY:&nbsp;</span>
              <span class="pool-apy-item">
                <span
                  v-if="
                    item[3] &&
                    item[2] &&
                    tokens[item[2].pairInfo.token0[0].toString()] &&
                    tokens[item[2].pairInfo.token1[0].toString()]
                  "
                >
                  <span>
                    {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}
                    {{ item[3].apy24h.token0 | filterBuyFee }},</span
                  >
                  <span>
                    {{ tokens[item[2].pairInfo.token1[0].toString()].symbol }}
                    {{ item[3].apy24h.token1 | filterBuyFee }}(24-Hour APY)
                  </span>
                </span>
                <span
                  v-if="
                    item[3] &&
                    item[2] &&
                    tokens[item[2].pairInfo.token0[0].toString()] &&
                    tokens[item[2].pairInfo.token1[0].toString()]
                  "
                >
                  <span>
                    {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}
                    {{ item[3].apy7d.token0 | filterBuyFee }},</span
                  >
                  <span>
                    {{ tokens[item[2].pairInfo.token1[0].toString()].symbol }}
                    {{ item[3].apy7d.token1 | filterBuyFee }}(7-Day APY)
                  </span>
                </span>
                <span v-else>-</span>
              </span>
            </div>
            <div v-if="getPrincipalId" class="flex-center mt20">
              <button
                class="primary"
                @click.stop="
                  jump(`/ICDex/pools/pool/${item[1][0][0].toString()}/Add`)
                "
              >
                Add
              </button>
              <button
                class="primary"
                @click.stop="
                  jump(`/ICDex/pools/pool/${item[1][0][0].toString()}/Remove`)
                "
                style="margin-left: 20px"
              >
                Remove
              </button>
            </div>
          </li>
        </ul>
        <div
          v-if="!poolLoad && !poolsLoad.length"
          class="base-color-w"
          style="text-align: center; margin-top: 100px; font-size: 14px"
        >
          No Pools
        </div>
        <div
          v-show="!morePools && pools.length && pools.length > 6"
          class="main-color pointer"
          style="margin-top: 10px; font-size: 16px"
          @click="morePools = true"
        >
          More Pools
        </div>
      </div>
    </div>
    <nft-balance
      ref="nftBalance"
      :nft-balance="nftBalance"
      :nfts="nfts"
      :tokens="tokens"
      :pairs-maker="pairsMaker"
      :is-become-maker="isBecomeMaker"
      @depositSuccess="depositSuccess"
      @bindSuccess="bindSuccess"
      @NFTWithdrawSuccess="NFTWithdrawSuccess"
    ></nft-balance>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Pool } from '@/views/home/ICDex/model';
import { AccountId, TokenInfo, TokenStd } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';
import { TokensExt } from '@/ic/nft/model';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { connectIcx } from '@/ic/connectIcx';
import { NftService } from '@/ic/nft/Service';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { NFT } from '@/ic/ICDexRouter/model';
import { principalToAccountIdentifier, toHexString } from '@/ic/converter';
import { makerPoolService } from '@/ic/makerPool/makerPoolService';
import { namespace } from 'vuex-class';
import NftBalance from '@/views/home/ICDex/components/NFTBalance.vue';
import { PairTrie, PairTrieResponse } from '@/ic/ICSwapRouter/model';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { Menu } from '@/components/menu/model';
import BigNumber from 'bignumber.js';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { getTokenLogo } from '@/ic/getTokenLogo';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';
const commonModule = namespace('common');
const canMakerCreateNft = ['NEPTUNE', 'URANUS', 'SATURN'];
const vipMakerNFT = ['NEPTUNE'];

let loading;

@Component({
  name: 'Pools',
  components: { NftBalance, AccountInfo },
  filters: {
    filterBuyFee(val: string): string {
      if (val || Number(val) === 0) {
        return (
          new BigNumber(val).times(100).decimalPlaces(4).toString(10) + '%'
        );
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private menuList: Menu[] = [
    {
      value: 'Trade',
      path: '/ICDex'
    },
    {
      value: 'Market',
      path: '/ICDex/market'
    },
    {
      value: 'Pool',
      path: '/ICDex/pools'
    },
    {
      value: 'Competitions',
      path: '/ICDex/competitions'
    },
    {
      value: 'Mining',
      path: '/icl/tradingMining'
    }
  ];
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  private makerPoolService: makerPoolService;
  private ICDexRouterService: ICDexRouterService;
  private NftService: NftService = null;
  private ICDexService: ICDexService = null;
  private poolLoad = false;
  private morePools = false;
  private poolsLoad: Array<Pool> = [];
  private poolsHold: Array<Pool> = [];
  private pools: Array<Pool> = [];
  private nfts: TokensExt = [];
  private nftBalancePool: Array<NFT> = [];
  private nftBalanceVip: Array<NFT> = [];
  private isBecomeMaker = false;
  private becomeMakerIndex: number = null;
  private isBecomeMakerHold = false;
  private nftBalance: Array<NFT> = [];
  private pairsMaker: Array<PairTrie> = [];
  private pairToSymbol: { [key: string]: PairTrieResponse } = {};
  private tokens: { [key: string]: TokenInfo } = {};
  activated(): void {
    const poolId = this.$route.query.id;
    if (poolId && this.poolsLoad.length) {
      if (!this.getPrincipalId) {
        return;
      }
      for (let i = 0; i < this.poolsLoad.length; i++) {
        if (this.poolsLoad[i][1][0][0].toString() === poolId) {
          this.makerPoolService.stats2(poolId).then((res) => {
            this.$set(this.poolsLoad[i], 3, res);
          });
          this.makerPoolService
            .getAccountShares(poolId, this.getPrincipalId)
            .then((res) => {
              this.$set(this.poolsLoad[i], 4, res);
              const poolsHold = [];
              const pools = [];
              this.poolsLoad.forEach((item) => {
                if (
                  item &&
                  (!item[3] ||
                    !item[2].gridSoid.length ||
                    (item[3] && item[3].poolShares))
                ) {
                  if (item[4] && item[4][0]) {
                    poolsHold.push(item);
                  } else {
                    pools.push(item);
                  }
                }
              });
              this.poolsHold = poolsHold;
              this.pools = pools;
            });
          break;
        }
      }
    } else {
      this.pools = [];
      this.poolsHold = [];
      this.poolsLoad = [];
      this.getPairs();
      this.getPools([], 1);
      this.getTokensExt();
      this.NFTBalance();
    }
  }
  created(): void {
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.makerPoolService = new makerPoolService();
    this.ICDexRouterService = new ICDexRouterService();
    this.NftService = new NftService();
    this.ICDexService = new ICDexService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
  }
  private getTokenInfo(tokens: Array<{ id: Principal; std: TokenStd }>): void {
    tokens.forEach((token) => {
      if (!this.tokens[token.id.toString()]) {
        getTokenInfo(token.id, token.std).then((tokenInfo) => {
          if (!tokenInfo.logo) {
            tokenInfo.logo = null;
          }
          this.$set(this.tokens, token.id.toString(), tokenInfo);
        });
      } else if (!this.tokens[token.id.toString()].logo) {
        getTokenLogo(token.id, this.tokens[token.id.toString()].tokenStd).then(
          (logo) => {
            if (logo) {
              this.$set(this.tokens[token.id.toString()], 'logo', logo);
            }
          }
        );
      }
    });
    console.log(this.tokens);
  }
  private async getPairs(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.getPairs2(['icdex']);
    console.log(res);
    if (res && res.data && res.data.length) {
      this.pairsMaker = res.data.sort((a, b) => {
        return a[1].pair.token0[1].localeCompare(b[1].pair.token0[1]);
      });
      res.data.forEach((item) => {
        this.pairToSymbol[item[0].toString()] = item[1];
      });
      console.log(this.tokens);
    } else {
      this.pairsMaker = [];
    }
  }
  private async getTokensExt(): Promise<void> {
    try {
      const res = await this.NftService.tokens_ext();
      console.log(res);
      const tokensExt = (
        res as {
          ok: TokensExt;
        }
      ).ok;
      console.log(tokensExt);
      this.nfts = tokensExt;
    } catch (e) {
      console.error(e);
    }
  }
  private async NFTBalance(): Promise<void> {
    const principal = localStorage.getItem('principal');
    const res = await this.ICDexRouterService.NFTBalance(principal);
    this.nftBalance = res;
    this.nftBalancePool = res.filter((item) => {
      const type = Object.keys(item[3])[0];
      return canMakerCreateNft.includes(type);
    });
    this.nftBalanceVip = res.filter((item) => {
      const type = Object.keys(item[3])[0];
      return vipMakerNFT.includes(type);
    });
    console.log(this.nftBalancePool);
    console.log(this.nftBalanceVip);
  }
  private async getPools(
    pools: Array<[Principal, Array<[Principal, AccountId]>]>,
    page: number
  ): Promise<void> {
    if (page === 1) {
      loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      this.poolLoad = true;
    }
    const res = await this.ICDexRouterService.maker_getPublicMakers(
      [],
      [BigInt(page)],
      [BigInt(100)]
    );
    console.log(res);
    if (res && res.data && res.data.length) {
      pools = pools.concat(res.data);
    }
    if (pools.length < Number(res.total)) {
      await this.getPools(pools, ++page);
    } else {
      loading && loading.close();
      this.poolLoad = false;
      const canisterIds: Array<string> = [];
      console.log(pools);
      pools.forEach((pool) => {
        pool[1].forEach((item) => {
          canisterIds.unshift(pool[0].toString());
          canisterIds.unshift(item[0].toString());
          this.poolsLoad.unshift([pool[0], [item]]);
        });
      });
      this.needConnect([...new Set(canisterIds)]);
    }
  }
  private async needConnect(canisterIds: Array<string>): Promise<void> {
    console.log(canisterIds);
    const flag = needConnectPlug(canisterIds);
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const needConnectInfinity1 = await needConnectInfinity(canisterIds);
    if (priList[principal] === 'Plug' && flag && this.$route.name === 'Pools') {
      // this.loading.close();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      // const h = this.$createElement;
      this.$info({
        content: 'Pools need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(canisterIds).then(() => {
            _that.getPoolsInfo();
          });
        }
      });
    } else if (
      priList[principal] === 'Infinity' &&
      needConnectInfinity1 &&
      this.$route.name === 'Pools'
    ) {
      // this.loading.close();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      // const h = this.$createElement;
      this.$info({
        content: 'Pools need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity(canisterIds).then(() => {
            _that.getPoolsInfo();
          });
        }
      });
    } else {
      if ((window as any).icx) {
        const icxCanisterIds: Array<string> =
          JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
        const newIcxCanisterIds: Array<string> = [
          ...new Set([...icxCanisterIds, ...canisterIds])
        ];
        localStorage.setItem(
          'icxCanisterIds',
          JSON.stringify(newIcxCanisterIds)
        );
        await connectIcx(newIcxCanisterIds);
      }
      this.getPoolsInfo();
    }
  }
  private async getPoolsInfo(): Promise<void> {
    const MAX_COCURRENCY = 10;
    let promiseAll = [];
    for (let i = 0; i < this.poolsLoad.length; i++) {
      for (let j = 0; j < this.poolsLoad[i][1].length; j++) {
        const pool = this.poolsLoad[i][1][j][0].toString();
        const pair = this.poolsLoad[i][0].toString();
        promiseAll.push(
          this.getPoolInfo(pool, i),
          this.poolStats(pool, i),
          this.getAccountShares(pool, i),
          this.getRole(pair, pool, i)
        );
        if (promiseAll.length === MAX_COCURRENCY) {
          await Promise.all(promiseAll);
          promiseAll = [];
        }
        console.log(i, promiseAll);
      }
      if (i === this.poolsLoad.length - 1 && promiseAll.length) {
        await Promise.all(promiseAll);
      }
    }
    const tokens = [];
    const tokenIds = [];
    this.poolsLoad.forEach((item) => {
      if (item[2]) {
        if (!tokenIds.includes(item[2].pairInfo.token0[0].toString())) {
          tokenIds.push(item[2].pairInfo.token0[0].toString());
          tokens.push({
            id: item[2].pairInfo.token0[0],
            std: item[2].pairInfo.token0[2]
          });
        }
        if (!tokenIds.includes(item[2].pairInfo.token1[0].toString())) {
          tokenIds.push(item[2].pairInfo.token1[0].toString());
          tokens.push({
            id: item[2].pairInfo.token1[0],
            std: item[2].pairInfo.token1[2]
          });
        }
        this.getTokenInfo(tokens);
      }
      if (
        item &&
        (!item[3] ||
          !item[2].gridSoid.length ||
          (item[3] && item[3].poolShares))
      ) {
        if (item[4] && item[4][0]) {
          this.poolsHold.push(item);
        } else {
          this.pools.push(item);
        }
      }
    });
    console.log(this.poolsLoad);
  }
  private async getPoolInfo(pool: string, i: number): Promise<void> {
    const res = await this.makerPoolService.info(pool);
    this.$set(this.poolsLoad[i], 2, res);
  }
  private async poolStats(pair: string, i: number): Promise<void> {
    const res = await this.makerPoolService.stats2(pair);
    this.$set(this.poolsLoad[i], 3, res);
  }
  private isCreator(item: Array<[Principal, AccountId]>): boolean {
    if (item && item.length && this.getPrincipalId) {
      const local = principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId)
      );
      const pool = toHexString(new Uint8Array(item[0][1]));
      return pool === local;
    }
    return false;
  }
  private async getRole(pair: string, pool: string, i: number): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICDexService.getRole(pair, pool);
      if (res && res.dexRole) {
        this.$set(this.poolsLoad[i], 5, res.dexRole);
      }
    }
  }
  private async getAccountShares(pair: string, i: number): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.makerPoolService.getAccountShares(
        pair,
        this.getPrincipalId
      );
      this.$set(this.poolsLoad[i], 4, res);
    }
  }
  private onCreatePool(): void {
    this.isBecomeMaker = false;
    (this.$refs.nftBalance as any).visible = true;
  }
  private depositSuccess(): void {
    this.getTokensExt();
    this.NFTBalance();
  }
  private onBindMaker(
    pair?: string,
    pool?: string,
    index?: number,
    isHold = false
  ): void {
    this.isBecomeMaker = true;
    if (pair) {
      this.becomeMakerIndex = index;
      this.isBecomeMakerHold = isHold;
    } else {
      this.becomeMakerIndex = null;
      this.isBecomeMakerHold = false;
    }
    (this.$refs.nftBalance as any).bindMMPoolInit(pair, pool);
  }
  private NFTWithdrawSuccess(): void {
    this.getTokensExt();
    this.NFTBalance();
  }
  private async bindSuccess(pair: string, pool: string): Promise<void> {
    const res = await this.ICDexService.getRole(pair, pool);
    if (res && res.dexRole) {
      if (this.isBecomeMakerHold) {
        this.$set(this.poolsHold[this.becomeMakerIndex], 5, res.dexRole);
      } else {
        this.$set(this.pools[this.becomeMakerIndex], 5, res.dexRole);
      }
    }
  }
  private jumpPool(item: Array<[Principal, AccountId]>): void {
    this.$router.push(`/ICDex/pools/pool/${item[0][0].toString()}`);
  }
  private jump(path: string): void {
    this.$router.push(path);
  }
}
</script>

<style scoped lang="scss">
.home-header {
  top: 14px;
}
.market-main {
  margin-top: 100px;
}
.pool-main {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  &.pool-main-remaining {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #1f2b37;
  }
  .base-font-title {
    color: #c9d1da;
  }
  .pool-header {
    display: flex;
    align-items: center;
    button {
      width: 80px;
    }
  }
  li {
    display: flex;
    flex-direction: column;
    width: 490px;
    line-height: 1.8;
    padding: 16px;
    margin-top: 15px;
    background: #131920;
    color: #8c98a5;
    border: 1px solid #212b35;
    border-radius: 10px;
    cursor: pointer;
    &:first-child {
      margin-top: 0;
    }
    &:nth-child(2) {
      margin-top: 0;
    }
  }
  .pool-apy {
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;
    .pool-apy-item {
      display: flex;
      flex-direction: column;
      font-size: 12px;
    }
  }
}
.vip-maker-pool {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 12px;
  border-radius: 14px;
  background: #ffa658;
  color: #fff;
}
.pool-pair-img {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
  color: #c9d1da;
  .creator-img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }
  .img-content {
    display: inline-block;
    width: 20px;
    line-height: 20px;
    img {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      object-fit: contain;
      vertical-align: top;
    }
  }
}
@media screen and (max-width: 768px) {
  .home-header {
    ul {
      display: none;
    }
  }
  .market-main {
    margin-top: 40px;
  }
  .market-main {
    padding: 0 10px;
  }
  .pool-main {
    li {
      &:nth-child(2) {
        margin-top: 15px;
      }
    }
  }
}
</style>
