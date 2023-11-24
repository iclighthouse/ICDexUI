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
              $route.fullPath.toLocaleLowerCase() ===
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
      <!--<div class="market-menu">
        <button
          v-for="(menu, index) in marketMenu"
          :key="index"
          :class="{ active: marketType === menu.value }"
          @click="changeMenu(menu)"
        >
          {{ menu.name }}
        </button>
      </div>-->
      <div v-show="marketType === 'pairs'" class="table-main">
        <div class="pc-show">
          <a-spin :spinning="spinning">
            <table>
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Canister Id</th>
                  <th>Fee</th>
                  <th>Vol</th>
                  <th>Price</th>
                  <th>Score</th>
                  <th>Sponsored</th>
                  <th>
                    Ambassadors
                    <a-icon type="question-circle" @click="showQuestion" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="pair in pairs.slice((page - 1) * 10, page * 10)"
                  :key="pair[0].toString()"
                >
                  <td>
                    <div>
                      <router-link
                        :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}`"
                      >
                        <span>
                          {{ pair[1].pair.token0[1] }}/{{
                            pair[1].pair.token1[1]
                          }}
                        </span>
                      </router-link>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>
                        <a
                          style="color: #646e79 !important"
                          :href="`https://ic.house/swap/${pair[1].pair.canisterId.toString()}`"
                          target="_blank"
                          rel="nofollow noreferrer noopener"
                          >{{
                            pair[1].pair.canisterId.toString() | ellipsisAccount
                          }}</a
                        >
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span
                        >Maker: <span class="table-number-color">0%</span>,
                      </span>
                      <span
                        >Taker:
                        <span class="table-number-color">{{
                          pair[1].pair.feeRate | filterBuyFee
                        }}</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="pair-vol" v-if="pair[1].liquidity.length">
                      <div
                        v-if="
                          tokens[pair[1].pair.token1[0].toString()] &&
                          tokens[pair[1].pair.token1[0].toString()].decimals
                        "
                      >
                        <span class="table-number-color">{{
                          pair[1].liquidity[0].vol.value1
                            | bigintToFloat(
                              2,
                              tokens[pair[1].pair.token1[0].toString()].decimals
                            )
                            | formatNum
                        }}</span>
                        {{ pair[1].pair.token1[1] }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div
                      v-if="
                        pair[1].liquidity.length &&
                        tokens[pair[1].pair.token0[0].toString()] &&
                        tokens[pair[1].pair.token0[0].toString()].decimals &&
                        tokens[pair[1].pair.token1[0].toString()] &&
                        tokens[pair[1].pair.token1[0].toString()].decimals
                      "
                    >
                      <span class="table-number-color">{{
                        getPrice(pair[1].liquidity, pair[1].pair)
                      }}</span>
                      {{ pair[1].pair.token1[1] }}
                    </div>
                  </td>
                  <td>
                    <span class="table-number-color">{{ pair[1].score }}</span>
                  </td>
                  <td>
                    <span class="table-number-color"
                      >({{ pair[1].listingReferrers.length }})&nbsp;</span
                    >
                    <span
                      v-if="pair[1].sponsored"
                      :class="{ ambassadors: pair[1].sponsored }"
                    >
                      <a-icon type="like" />
                    </span>
                    <a-icon v-else type="like" />
                  </td>
                  <td>
                    <router-link
                      :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}?type=referrer`"
                      >Referrer link</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </a-spin>
          <div class="pairs-page">
            <a-pagination
              v-if="total > 10"
              class="pagination"
              :default-page-size="10"
              :total="total"
              @change="pageChange"
            />
          </div>
        </div>
        <a-spin class="h5-show" :spinning="spinning">
          <div
            class="pair-main-scroll"
            v-infinite-scroll="handleInfiniteOnLoad"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
            :infinite-scroll-immediate-check="false"
          >
            <div
              class="pair-main"
              v-for="pair in pairs.slice(0, page * 10)"
              :key="pair[0].toString()"
            >
              <div class="pair-item">
                <span>Pair</span>
                <span class="margin-left-auto">
                  <router-link
                    :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}`"
                  >
                    <span>
                      {{ pair[1].pair.token0[1] }}/{{ pair[1].pair.token1[1] }}
                    </span>
                  </router-link>
                </span>
              </div>
              <div class="pair-item">
                <span>Canister Id</span>
                <span class="margin-left-auto">
                  <a
                    :href="`https://ic.house/swap/${pair[1].pair.canisterId.toString()}`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    >{{
                      pair[1].pair.canisterId.toString() | ellipsisAccount
                    }}</a
                  >
                </span>
              </div>
              <div class="pair-item">
                <span>Vol</span>
                <span
                  class="pair-vol margin-left-auto"
                  v-if="pair[1].liquidity.length"
                >
                  <div
                    v-if="
                      tokens[pair[1].pair.token1[0].toString()] &&
                      tokens[pair[1].pair.token1[0].toString()].decimals
                    "
                  >
                    {{
                      pair[1].liquidity[0].vol.value1
                        | bigintToFloat(
                          2,
                          tokens[pair[1].pair.token1[0].toString()].decimals
                        )
                        | formatNum
                    }}
                    {{ pair[1].pair.token1[1] }}
                  </div>
                </span>
              </div>
              <div class="pair-item">
                <span>Price</span>
                <span
                  class="margin-left-auto"
                  v-if="
                    pair[1].liquidity.length &&
                    tokens[pair[1].pair.token0[0].toString()] &&
                    tokens[pair[1].pair.token0[0].toString()].decimals &&
                    tokens[pair[1].pair.token1[0].toString()] &&
                    tokens[pair[1].pair.token1[0].toString()].decimals
                  "
                >
                  {{ getPrice(pair[1].liquidity, pair[1].pair) }}
                  {{ pair[1].pair.token1[1] }}
                </span>
              </div>
              <div class="pair-item">
                <span>Score</span>
                <span class="margin-left-auto">{{ pair[1].score }}</span>
              </div>
              <div class="pair-item">
                <span>Sponsored</span>
                <span class="margin-left-auto">
                  <span class="table-number-color"
                    >({{ pair[1].listingReferrers.length }})&nbsp;</span
                  >
                  <span
                    v-if="pair[1].sponsored"
                    :class="{ ambassadors: pair[1].sponsored }"
                  >
                    <a-icon type="like" />
                  </span>
                  <a-icon v-else type="like" />
                </span>
              </div>
              <div class="pair-item">
                <span
                  >Ambassadors&nbsp;<a-icon
                    type="question-circle"
                    @click="showQuestion"
                /></span>
                <span class="margin-left-auto">
                  <router-link
                    :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}?type=referrer`"
                    >Referrer link</router-link
                  >
                </span>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
      <div v-show="marketType === 'ambassadors'">
        <div class="ambassadors-main container-common-style">
          <p class="base-font-title ambassadors-main-title">
            About Trading Ambassador
          </p>
          <p class="base-font-title ambassadors-main-tip">
            Accounts with at least one trade automatically qualify as Trading
            Ambassador, with the following features.
          </p>
          <div class="ambassadors-main-info">
            <p>
              1. Promote the pair to others. You can go to the "Trading
              Ambassador" page of each trading pair to get an affiliate link,
              send it to your friends or post it on social media. Note: The
              affiliate link is different for each trading pair and the
              promotion is only valid for that trading pair.
            </p>
            <p>
              2. Each trading account (referee) can submit one trading
              ambassador (referrer) to the contract. An account with at least
              one trade can set up a trading ambassador as their referrer.
            </p>
            <p>
              3. The system will count the number of accounts and the volume of
              trading from your promotion. It is possible that there is a reward
              program for ambassadors that comes from the project side or Dex
              platform associated with the trading pair, as described on the
              "Trading Ambassadors" page of that trading pair. Note: Not every
              trading pair has a reward program.
            </p>
          </div>
        </div>
      </div>
      <div v-show="marketType === 'referrers'" class="referrers-main">
        <div>
          <div v-if="listingReferrer" class="referrer-nft">
            <a-steps
              class="trading-step-main"
              :current="currentStep"
              :direction="isH5 ? 'vertical' : 'horizontal'"
            >
              <a-step class="trading-step1-description">
                <template slot="title">Hold Uranus Card NFT</template>
                <span slot="description">
                  Transfer your Uranus Card NFT to your account
                  {{ getPrincipalId | ellipsisAccount(8) }}
                  <span
                    v-show="currentStep === 0 && !listingReferrer[0] && !nft"
                    >(You have no Uranus Card).
                  </span>
                </span>
              </a-step>
              <a-step class="trading-step1-description">
                <template slot="title">Register</template>
                <span slot="description">
                  <button
                    :disabled="currentStep !== 1"
                    type="button"
                    class="primary step-button"
                    @click="onRegister"
                  >
                    Register
                  </button>
                </span>
              </a-step>
              <a-step class="trading-step1-description">
                <template slot="title"
                  >Become a Verified Listing Referrer</template
                >
                <span slot="description">
                  Please join
                  <span v-show="listingReferrer[1] || currentStep !== 2"
                    >Discord</span
                  >
                  <a
                    v-show="!listingReferrer[1] && currentStep === 2"
                    href="https://discord.gg/FQZFGGq7zv"
                    target="_blank"
                    >Discord</a
                  >
                  to contact a member of the team.
                </span>
              </a-step>
            </a-steps>
            <!--<div class="nft-info">
							<img :src="getExtInfo(nft[2]).thumb" alt="" />
							<div class="ext-info">{{ getExtInfo(nft[2]).name }}</div>
						</div>
						<div>
							<button type="button" class="primary">Register</button>
							<span>Become a Verified Listing Referrer</span>
						</div>-->
          </div>
          <div
            v-if="listingReferrer && listingReferrer[0] && listingReferrer[1]"
            class="proposed-list"
          >
            <div class="proposed-list-header">
              <span class="base-color-w">List of pairs proposed by me</span>
              <button type="button" class="primary margin-left-auto">
                Propose
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Canister Id</th>
                  <th>Fee</th>
                  <th>Vol</th>
                  <th>Price</th>
                  <th>Score</th>
                  <th>Sponsored</th>
                  <th>Ambassadors</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pair in pairs" :key="pair[0].toString()">
                  <td>
                    <div>
                      <router-link
                        :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}`"
                      >
                        <span>
                          {{ pair[1].pair.token0[1] }}/{{
                            pair[1].pair.token1[1]
                          }}
                        </span>
                      </router-link>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>
                        <a
                          :href="`https://ic.house/swap/${pair[1].pair.canisterId.toString()}`"
                          target="_blank"
                          rel="nofollow noreferrer noopener"
                          >{{ pair[1].pair.canisterId.toString() }}</a
                        >
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{{ pair[1].pair.feeRate * 100 }}%</span>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td>{{ pair[1].score }}</td>
                  <td>
                    ({{ pair[1].listingReferrers.length }})
                    <span
                      v-if="pair[1].sponsored"
                      :class="{ ambassadors: pair[1].sponsored }"
                    >
                      <a-icon type="like" />
                    </span>
                    <a-icon v-else type="like" />
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model="ambassadorsvisible"
      width="650px"
      title="About Trading Ambassador"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <p>
        An account who has completed at least one trade automatically qualify as
        a trading ambassador and can promote the pair by sharing the referral
        link.
      </p>
      <p class="ambassadors-visible-title">
        How to promote the pair to others.
      </p>
      <p>
        You can go to the "Trading Ambassador" page of each trading pair to get
        a referral link, send it to your friends or post it on social media.
      </p>
      <p>Note:</p>
      <p>
        (1) Each promotion is only for one trading pair, the referral link is
        exclusive to the trading pair.
      </p>
      <p>
        (2) Each trading account (referee) can submit one trading ambassador
        (referrer) to the contract. A referee must complete at least one trade
        for the setting to take effect.
      </p>
      <p class="ambassadors-visible-title">
        Benefits of being a trading ambassador.
      </p>
      <p>
        The pair will count the number of accounts and the volume of trading
        from your promotion. It is possible that there is a reward program for
        ambassadors that comes from the project's funder or Dex platform, as
        described on the "Trading Ambassadors" page of that trading pair. Note:
        Not every trading pair has a reward program.
      </p>
      <button
        type="button"
        class="primary ambassadors-visible-button"
        @click="ambassadorsvisible = false"
      >
        Confirm
      </button>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MarketMenu } from '@/views/home/ICDex/model';
import { PairTrie, SwapPair, SwapTokenInfo } from '@/ic/ICSwapRouter/model';
import { Principal } from '@dfinity/principal';
import { TokenExt, TokensExt } from '@/ic/nft/model';
import { NftService } from '@/ic/nft/Service';
import { namespace } from 'vuex-class';
import { Menu } from '@/components/menu/model';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { TokenInfo } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { TokenLiquidity } from '@/ic/ICSwap/model';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';

const commonModule = namespace('common');

@Component({
  name: 'Market',
  components: {
    AccountInfo
  },
  filters: {
    filterFee(val: string): string {
      if (val) {
        return new BigNumber(val).times(100).toString(10) + '%';
      }
      return '';
    },
    filterBuyFee(val: string): string {
      if (val) {
        return new BigNumber(val).times(100).toString(10) + '%';
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  private NftService: NftService = null;
  private marketMenu: Array<MarketMenu> = [];
  private marketType = 'pairs';
  private pairs: Array<PairTrie> = [];
  private total = 0;
  private page = 1;
  private pairsOwner: Array<PairTrie> = [];
  private listingReferrer: [boolean, boolean] = null;
  private nft: TokenExt = null;
  private currentStep = -1;
  private isH5 = false;
  private ambassadorsvisible = false;
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
      value: 'Competitions',
      path: '/ICDex/competitions'
    },
    {
      value: 'Mining',
      path: '/icl/tradingMining'
    }
  ];
  private tokens: { [key: string]: TokenInfo } = {};
  private busy = true;
  private loadMore = true;
  private spinning = false;
  created(): void {
    this.marketMenu = [
      // {
      //   name: 'Trading Pairs',
      //   value: 'pairs'
      // }
      // ,
      // {
      //   name: 'Trading Ambassadors',
      //   value: 'ambassadors'
      // },
      // {
      //   name: 'Listing Referrers',
      //   value: 'referrers'
      // }
    ];
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.NftService = new NftService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.getPairs();
  }
  private showQuestion(): void {
    this.ambassadorsvisible = true;
  }
  private async onRegister(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      await this.ICSwapRouterFiduciaryService.setListingReferrerByNft(
        Principal.fromText(this.getPrincipalId),
        'icdex',
        this.nft[0].toString(10)
      );
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private changeMenu(menu: MarketMenu): void {
    this.marketType = menu.value;
    if (menu.value === 'pairs') {
      this.getPairs();
    }
    if (menu.value === 'referrers') {
      this.getListingReferrer();
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
      if (tokensExt && tokensExt.length) {
        console.log(tokensExt);
        for (let i = 0; i < tokensExt.length; i++) {
          const info = this.getExtInfo(tokensExt[i][2]);
          if (info.attributes && info.attributes.length) {
            info.attributes.forEach((item) => {
              if (
                item.trait_type.trim() === 'listing referrer' &&
                item.value.trim() === 'Yes'
              ) {
                this.nft = tokensExt[i];
              }
            });
          }
          if (this.nft) {
            break;
          }
        }
      } else {
        //
      }
    } catch (e) {
      console.error(e);
    }
  }
  private getExtInfo(val: Array<Array<number>>): any {
    if (val && val.length) {
      return JSON.parse(Buffer.from(val[0]).toString());
    }
    return {};
  }
  private async getListingReferrer(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      this.listingReferrer = await this.ICSwapRouterFiduciaryService.listingReferrer(
        Principal.fromText(principal)
      );
      console.log(this.listingReferrer);
      if (!this.listingReferrer[0]) {
        await this.getTokensExt();
        if (!this.nft) {
          this.currentStep = 0;
        } else {
          this.currentStep = 1;
        }
      }
      if (this.listingReferrer[0] && !this.listingReferrer[1]) {
        this.currentStep = 2;
      }
      if (this.listingReferrer[0] && this.listingReferrer[1]) {
        this.getPairsOwner();
      }
    }
  }
  private async getPairsOwner(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.getPairs2(
      ['icdex'],
      [Principal.fromText(this.getPrincipalId)]
    );
    console.log(res);
    if (res && res.data && res.data.length) {
      this.pairsOwner = res.data.sort((a, b) => {
        return Number(a[1].score) - Number(b[1].score);
      });
    } else {
      this.pairsOwner = [];
    }
  }
  private async getPairs(): Promise<void> {
    this.busy = true;
    this.spinning = true;
    const res = await this.ICSwapRouterFiduciaryService.getPairs2(['icdex']);
    console.log(res);
    if (res && res.data && res.data.length) {
      this.pairs = res.data.sort((a, b) => {
        return Number(b[1].score) - Number(a[1].score);
      });
      this.total = this.pairs.length;
      this.getTokenDecimals();
    } else {
      this.pairs = [];
    }
    this.spinning = false;
    this.busy = false;
  }
  private pageChange(page: number): void {
    this.page = page;
    this.getTokenDecimals();
  }
  private async getTokenDecimals(): Promise<void> {
    const pairs = this.pairs.slice((this.page - 1) * 10, this.page * 10);
    const promiseValue = [];
    pairs.forEach((pair: PairTrie) => {
      if (
        !this.tokens[pair[1].pair.token0[0].toString()] ||
        (this.tokens[pair[1].pair.token0[0].toString()] &&
          !this.tokens[pair[1].pair.token0[0].toString()].decimals &&
          this.tokens[pair[1].pair.token0[0].toString()].decimals !== 0)
      ) {
        promiseValue.push(this.getDecimals(pair[1].pair.token0));
      }
      if (
        !this.tokens[pair[1].pair.token1[0].toString()] ||
        (this.tokens[pair[1].pair.token1[0].toString()] &&
          !this.tokens[pair[1].pair.token1[0].toString()].decimals &&
          this.tokens[pair[1].pair.token1[0].toString()].decimals !== 0)
      ) {
        promiseValue.push(this.getDecimals(pair[1].pair.token1));
      }
    });
    if (promiseValue.length > 0) {
      await Promise.all(promiseValue);
      this.$forceUpdate();
    }
  }
  private async getDecimals(token: SwapTokenInfo): Promise<void> {
    const DRC20Token = new DRC20TokenService();
    const std = Object.keys(token[2])[0];
    if (!this.tokens[token[0].toString()]) {
      this.tokens[token[0].toString()] = { decimals: null };
    }
    if (std && std.toLocaleLowerCase() === 'cycles') {
      this.tokens[token[0].toString()].decimals = 12;
    }
    if (std && std.toLocaleLowerCase() === 'icp') {
      this.tokens[token[0].toString()].decimals = 8;
    }
    if (std && std.toLocaleLowerCase() === 'drc20') {
      this.tokens[token[0].toString()].decimals = await DRC20Token.decimals(
        token[0].toString()
      );
    }
    if (std && std.toLocaleLowerCase() === 'icrc1') {
      this.tokens[token[0].toString()].decimals = await DRC20Token.icrcDecimals(
        token[0].toString()
      );
    }
    if (std && std.toLocaleLowerCase() === 'dip20') {
      const info = await DRC20Token.getMetadata(token[0].toString());
      this.tokens[token[0].toString()].decimals = info.decimals;
    }
  }
  private getPrice(liquidity: Array<TokenLiquidity>, pair: SwapPair): string {
    if (liquidity.length) {
      const token0 = pair.token0[0].toString();
      const token1 = pair.token1[0].toString();
      return new BigNumber(liquidity[0].price.toString(10))
        .div(10 ** this.tokens[token1].decimals)
        .div(
          new BigNumber(liquidity[0].unitSize.toString(10)).div(
            10 ** this.tokens[token0].decimals
          )
        )
        .decimalPlaces(this.tokens[token0].decimals)
        .toString(10);
    }
    return '';
  }
  private handleInfiniteOnLoad(): void {
    const width = document.documentElement.clientWidth;
    if (width > 768) {
      return;
    }
    if (!this.busy) {
      console.log('handleInfiniteOnLoad');
      this.busy = true;
      if (this.page * 10 < this.pairs.length) {
        setTimeout(() => {
          this.page++;
          this.busy = false;
        }, 100);
      } else {
        this.busy = false;
        this.loadMore = false;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.ambassadors-visible-button {
  margin-top: 20px;
  margin-left: auto;
}
.ambassadors-visible-title {
  margin-top: 20px;
  color: #fff;
  font-size: 18px;
}
.ambassadors {
  i {
    color: #21c77d;
  }
}
.ambassadors-main {
  padding: 50px;
  line-height: 1.2;
  .ambassadors-main-title {
    font-size: 16px;
  }
  .ambassadors-main-tip {
    margin: 20px 0 10px;
  }
  .ambassadors-main-info {
    padding-left: 1em;
  }
}
.market-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 510px;
  height: 60px;
  margin: 60px auto 40px;
  background: #232730;
  border-radius: 30px;
  button {
    width: 150px;
    height: 40px;
    border-radius: 20px;
    font-size: 16px;
    background: #232730;
    transition: all 0.3s;
    &:nth-child(2) {
      width: 190px;
    }
    &.active {
      background: #51b7c3;
      border-color: #51b7c3;
      color: #ffffff;
    }
  }
}
.table-main,
.referrers-main {
  background: #131920;
  border: 1px solid #131920;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 20px 30px 40px 30px;
  a {
    color: #166a89;
  }
  table {
    min-height: 200px;
  }
}
.table-main {
  table {
    td {
      line-height: 1.2;
      color: #646e79 !important;
      .table-number-color {
        color: #8c98a5 !important;
      }
    }
  }
}
.referrers-main {
  color: #adb3c4;
}
.referrer-nft {
  display: flex;
}
.nft-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 165px;
  img {
    width: 165px;
    height: 165px;
    object-fit: contain;
  }
  .ext-info {
    font-size: 12px;
    padding-top: 5px;
  }
}
.proposed-list {
  margin-top: 30px;
  padding-top: 10px;
  border-top: 1px solid #1b242e;
}
.proposed-list-header {
  display: flex;
  align-items: center;
}
tbody {
  tr {
    border-bottom: 1px solid #212b35;
  }
}
.trading-step-main {
  margin-top: 30px;
  .ant-steps-item {
    height: 160px;
  }
  .step-button {
    position: absolute;
    bottom: 0;
    /*&.step-button-approval {
			bottom: 46px;
		}*/
  }
  .trading-step-tokens {
    position: absolute;
    bottom: 0;
    height: 30px;
    line-height: 30px;
  }
  ::v-deep .ant-steps-item-title {
    color: #b4bacd !important;
  }

  ::v-deep .ant-steps-item-process .ant-steps-item-title {
    color: #e7eaf1 !important;
  }

  ::v-deep .ant-steps-item-finish .ant-steps-item-description {
    color: #777d90 !important;
  }

  ::v-deep .ant-steps-item-process .ant-steps-item-description {
    color: #e7eaf1 !important;
  }

  ::v-deep .ant-steps-item-wait .ant-steps-item-description {
    color: #777d90 !important;
  }

  ::v-deep .ant-steps-item-icon {
    width: 30px;
    height: 30px;
    line-height: 30px;
    background: transparent;
  }

  ::v-deep .ant-steps-item-finish .ant-steps-item-icon {
    border-color: #21c77d;
    background: #21c77d;
  }

  ::v-deep .ant-steps-item-process .ant-steps-item-icon {
    border-color: #21c77d;
    background: #21c77d;
  }

  ::v-deep .ant-steps-item-finish .ant-steps-item-title::after {
    background: #21c77d;
  }
  ::v-deep .ant-steps-item-finish .ant-steps-item-tail::after {
    background: #21c77d;
  }

  ::v-deep .ant-steps-icon {
    color: #fff;
  }

  ::v-deep .ant-steps-item-wait .ant-steps-item-icon {
    border-color: #777d90;
  }
}
.home-header {
  top: 14px;
}
.pairs-page {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}
.pair-vol {
  line-height: 1.5;
}
.pair-item {
  display: flex;
  line-height: 2;
  span {
    &:last-child {
      text-align: right;
    }
  }
}
.market-main {
  margin-top: 100px;
}
.pc-show {
  display: block;
}
.h5-show {
  display: none;
}
@media screen and (max-width: 768px) {
  .table-main {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    color: #adb3c4;
    padding: 0 0 30px 0;
    .pair-main {
      margin-bottom: 10px;
      background: #131920;
      border: 1px solid #131920;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 10px;
    }
  }
  .pair-main-scroll {
    max-height: calc(100vh - 120px);
    min-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 10px;
  }
  .pc-show {
    display: none;
  }
  .h5-show {
    display: block;
  }
  .home-header {
    ul {
      display: none;
    }
  }
  .market-main {
    margin-top: 50px;
    padding: 0;
  }
  .market-menu {
    width: 100%;
    padding: 0 10px;
    button {
      font-size: 14px;
    }
  }
}
</style>
