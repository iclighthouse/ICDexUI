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
    <!--<ul class="token-list-menu">
      <li
        :class="{ active: currentMenu === 'combined' }"
        @click="changeMenu('combined')"
      >
        Combined Competitions
      </li>
      <li
        :class="{ active: currentMenu === 'trade' }"
        @click="changeMenu('trade')"
      >
        Trading Competitions
      </li>
    </ul>-->
    <div
      v-show="currentMenu === 'combined'"
      class="container-width container-common-style competitions-main"
    >
      <div class="base-font-title" v-if="dexCompetitionResponse">
        <div>
          <span>Name: </span>
          <span>{{ dexCompetitionResponse.name }}</span>
        </div>
        <div class="competitions-time">
          <div>
            <span>Start: </span>
            <span>
              {{ dexCompetitionResponse.start | formatDateFromNanosecondUTC }}
            </span>
          </div>
          <div class="competitions-time-end">
            <span>End: </span>
            <span>
              {{ dexCompetitionResponse.end | formatDateFromNanosecondUTC }}
            </span>
          </div>
        </div>
        <p style="margin-top: 10px">{{ dexCompetitionResponse.content }}</p>
        <div class="mt20">
          <p style="margin-bottom: 10px; font-size: 16px" class="base-color-w">
            Supported Trading Pairs:
          </p>
          <ul>
            <li
              v-for="(item, index) in dexCompetitionResponse.pairs"
              :key="index"
            >
              <router-link
                :to="`/icdex/${item[1].token0[1]}/${item[1].token1[1]}`"
              >
                {{ item[1].dexName }}:{{ item[1].token0[1] }}/{{
                  item[1].token1[1]
                }}
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="getPrincipalId" class="competitions-status">
          <span>Your Status: </span>
          <button
            :disabled="dexCompetitionStatus !== 'Register'"
            type="button"
            class="primary"
            @click="registerDexCompetition"
          >
            {{ dexCompetitionStatus }}
          </button>
        </div>
        <p class="mt20">
          <a
            href="https://ic.house/competitions/combinedComp"
            target="_blank"
            rel="nofollow noreferrer noopener"
            >Competition Ranking -></a
          >
        </p>
        <div
          v-if="getPrincipalId && traderData && traderData.length"
          class="pc-show mt20"
        >
          <div
            v-if="dexCompetitionStatus === 'Registered'"
            style="text-align: right"
          >
            <span> A data update will occur within the next 8 hours. </span>
            <span v-if="updateTime">
              Last update:
              {{ updateTime | formatDateFromNanosecondUTC }}
            </span>
          </div>
          <table>
            <thead>
              <tr>
                <th>AccountId</th>
                <th>Position</th>
                <th>Vol</th>
                <th>PNL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span>{{ account | ellipsisAccount }}</span>
                </td>
                <td>
                  <ul>
                    <li
                      v-for="trade in traderData"
                      :key="trade.pair.toString()"
                    >
                      <span v-if="pairInfo[trade.pair.toString()]">
                        {{ pairInfo[trade.pair.toString()].token0[1] }}/{{
                          pairInfo[trade.pair.toString()].token1[1]
                        }}:
                      </span>
                      <span
                        v-if="
                          Object.keys(trade.quoteToken)[0] === 'token1' &&
                          pairInfo[trade.pair.toString()] &&
                          tokens &&
                          tokens[
                            pairInfo[trade.pair.toString()].token0[0].toString()
                          ]
                        "
                      >
                        <span v-if="trade.total.length">{{
                          trade.total[0][0].position.toString(10)
                            | bigintToFloat(
                              tokens[
                                pairInfo[
                                  trade.pair.toString()
                                ].token0[0].toString()
                              ].decimals,
                              tokens[
                                pairInfo[
                                  trade.pair.toString()
                                ].token0[0].toString()
                              ].decimals
                            )
                        }}</span>
                        <span v-else>-</span>
                      </span>
                      <span
                        v-if="
                          Object.keys(trade.quoteToken)[0] === 'token0' &&
                          pairInfo[trade.pair.toString()] &&
                          tokens &&
                          tokens[
                            pairInfo[trade.pair.toString()].token1[0].toString()
                          ]
                        "
                      >
                        <span v-if="trade.total.length">
                          {{
                            trade.total[0][0].position.toString(10)
                              | bigintToFloat(
                                tokens[
                                  pairInfo[
                                    trade.pair.toString()
                                  ].token1[0].toString()
                                ].decimals,
                                tokens[
                                  pairInfo[
                                    trade.pair.toString()
                                  ].token1[0].toString()
                                ].decimals
                              )
                          }}
                        </span>
                        <span v-else>-</span>
                      </span>
                      <span
                        v-if="
                          Object.keys(trade.quoteToken)[0] === 'token1' &&
                          pairInfo[trade.pair.toString()] &&
                          tokens &&
                          tokens[
                            pairInfo[trade.pair.toString()].token0[0].toString()
                          ] &&
                          tokens[
                            pairInfo[trade.pair.toString()].token1[0].toString()
                          ]
                        "
                      >
                        <span v-if="trade.total.length">
                          (AvgPrice:
                          {{
                            getAvgPrice(
                              trade.total[0][0].avgPrice,
                              tokens[
                                pairInfo[
                                  trade.pair.toString()
                                ].token0[0].toString()
                              ].decimals,
                              tokens[
                                pairInfo[
                                  trade.pair.toString()
                                ].token1[0].toString()
                              ].decimals
                            )
                          }})
                        </span>
                      </span>
                      <span
                        v-if="
                          Object.keys(trade.quoteToken)[0] === 'token0' &&
                          pairInfo[trade.pair.toString()] &&
                          tokens &&
                          tokens[
                            pairInfo[trade.pair.toString()].token0[0].toString()
                          ] &&
                          tokens[
                            pairInfo[trade.pair.toString()].token1[0].toString()
                          ]
                        "
                      >
                        <span v-if="trade.total.length">
                          (AvgPrice:
                          {{
                            getAvgPrice(
                              trade.total[0][0].avgPrice,
                              tokens[
                                pairInfo[
                                  trade.pair.toString()
                                ].token1[0].toString()
                              ].decimals,
                              tokens[
                                pairInfo[
                                  trade.pair.toString()
                                ].token0[0].toString()
                              ].decimals
                            )
                          }})
                        </span>
                      </span>
                    </li>
                  </ul>
                </td>
                <td>
                  <span>
                    {{ getVol(traderData) }}
                  </span>
                </td>
                <td>
                  <span>
                    {{ getPNL(traderData) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="
            getPrincipalId &&
            traderData &&
            traderData.length &&
            dexCompetitionStatus === 'Registered'
          "
          class="h5-show mt20"
        >
          <div>A data update will occur within the next 8 hours.</div>
          <div v-if="updateTime">
            Last update:
            {{ updateTime | formatDateFromNanosecondUTC }}
          </div>
          <ul class="trader-data-user">
            <li>
              <span>AccountId: </span>
              <span>{{ account | ellipsisAccount }}</span>
            </li>
            <li>
              <span>Position: </span>
              <span>
                <ul>
                  <li v-for="trade in traderData" :key="trade.pair.toString()">
                    <span v-if="pairInfo[trade.pair.toString()]">
                      {{ pairInfo[trade.pair.toString()].token0[1] }}/{{
                        pairInfo[trade.pair.toString()].token1[1]
                      }}:
                    </span>
                    <span
                      v-if="
                        Object.keys(trade.quoteToken)[0] === 'token1' &&
                        pairInfo[trade.pair.toString()] &&
                        tokens &&
                        tokens[
                          pairInfo[trade.pair.toString()].token0[0].toString()
                        ]
                      "
                    >
                      <span v-if="trade.total.length">{{
                        trade.total[0][0].position.toString(10)
                          | bigintToFloat(
                            tokens[
                              pairInfo[
                                trade.pair.toString()
                              ].token0[0].toString()
                            ].decimals,
                            tokens[
                              pairInfo[
                                trade.pair.toString()
                              ].token0[0].toString()
                            ].decimals
                          )
                      }}</span>
                      <span v-else>-</span>
                    </span>
                    <span
                      v-if="
                        Object.keys(trade.quoteToken)[0] === 'token0' &&
                        pairInfo[trade.pair.toString()] &&
                        tokens &&
                        tokens[
                          pairInfo[trade.pair.toString()].token1[0].toString()
                        ]
                      "
                    >
                      <span v-if="trade.total.length">
                        {{
                          trade.total[0][0].position.toString(10)
                            | bigintToFloat(
                              tokens[
                                pairInfo[
                                  trade.pair.toString()
                                ].token1[0].toString()
                              ].decimals,
                              tokens[
                                pairInfo[
                                  trade.pair.toString()
                                ].token1[0].toString()
                              ].decimals
                            )
                        }}
                      </span>
                      <span v-else>-</span>
                    </span>
                    <span
                      v-if="
                        Object.keys(trade.quoteToken)[0] === 'token1' &&
                        pairInfo[trade.pair.toString()] &&
                        tokens &&
                        tokens[
                          pairInfo[trade.pair.toString()].token0[0].toString()
                        ] &&
                        tokens[
                          pairInfo[trade.pair.toString()].token1[0].toString()
                        ]
                      "
                    >
                      <span v-if="trade.total.length">
                        (AvgPrice:
                        {{
                          getAvgPrice(
                            trade.total[0][0].avgPrice,
                            tokens[
                              pairInfo[
                                trade.pair.toString()
                              ].token0[0].toString()
                            ].decimals,
                            tokens[
                              pairInfo[
                                trade.pair.toString()
                              ].token1[0].toString()
                            ].decimals
                          )
                        }})
                      </span>
                    </span>
                    <span
                      v-if="
                        Object.keys(trade.quoteToken)[0] === 'token0' &&
                        pairInfo[trade.pair.toString()] &&
                        tokens &&
                        tokens[
                          pairInfo[trade.pair.toString()].token0[0].toString()
                        ] &&
                        tokens[
                          pairInfo[trade.pair.toString()].token1[0].toString()
                        ]
                      "
                    >
                      <span v-if="trade.total.length">
                        (AvgPrice:
                        {{
                          getAvgPrice(
                            trade.total[0][0].avgPrice,
                            tokens[
                              pairInfo[
                                trade.pair.toString()
                              ].token1[0].toString()
                            ].decimals,
                            tokens[
                              pairInfo[
                                trade.pair.toString()
                              ].token0[0].toString()
                            ].decimals
                          )
                        }})
                      </span>
                    </span>
                  </li>
                </ul>
              </span>
            </li>
            <li>
              <span>Vol</span>
              <span>{{ getVol(traderData) }}</span>
            </li>
            <li>
              <span>PNL</span>
              <span>{{ getPNL(traderData) }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-else style="text-align: center; font-size: 16px">No record</div>
    </div>
    <!--<div
      v-show="currentMenu === 'trade'"
      class="container-width container-common-style competitions-main"
    >
      <p class="competitions-item base-font-title">
        Trading competitions are initiated by the project owner or the Dex
        platform, with each pair running a separate trading competition. Please
        see each pair's competition description for specific rules and award
        program.
      </p>
      <div class="competitions-info">
        <p>Each round of the competition has a start and end date.</p>
        <p>
          Participants are required to register for the competition on their
          own.
        </p>
        <p>
          Participants' trading assets will be held in the contract until the
          end of the competition for the purpose of calculating earnings.
          Participants may drop out the competition and withdraw their assets
          early.
        </p>
        <p>The competition reward program will be set by the promoter.</p>
        <p style="margin-top: 10px">
          <a
            :href="`https://ic.house/competitions/tradingComp`"
            target="_blank"
            rel="nofollow noreferrer noopener"
            >Competition Ranking -></a
          >
        </p>
      </div>
      <div class="competitions-list mt20">
        <p class="competitions-title base-color-w">Latest Competitions</p>
      </div>
      <div class="pc-show">
        <table>
          <thead>
            <tr>
              <th>Pair</th>
              <th>Canister Id</th>
              <th>Vol</th>
              &lt;!&ndash;<th>Price</th>&ndash;&gt;
              <th>Name</th>
              <th>Round</th>
              <th>Start</th>
              <th>End</th>
              <th v-if="getPrincipalId"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in competitions" :key="index">
              <td>
                <router-link
                  :to="`/ICDex/${item[1].pair.pair.token0[1]}/${item[1].pair.pair.token1[1]}`"
                >
                  {{ item[1].pair.pair.token0[1] }}/{{
                    item[1].pair.pair.token1[1]
                  }}
                </router-link>
              </td>
              <td>
                <router-link
                  :to="`/ICDex/${item[1].pair.pair.token0[1]}/${item[1].pair.pair.token1[1]}`"
                >
                  {{
                    item[1].pair.pair.canisterId.toString() | ellipsisAccount
                  }}
                </router-link>
              </td>
              <td>
                <div class="pair-vol" v-if="item[1].pair.liquidity.length">
                  <div
                    v-if="
                      tokens[item[1].pair.pair.token1[0].toString()] &&
                      tokens[item[1].pair.pair.token1[0].toString()].decimals
                    "
                  >
                    <span class="table-number-color">{{
                      item[1].pair.liquidity[0].vol.value1
                        | bigintToFloat(
                          2,
                          tokens[item[1].pair.pair.token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}</span>
                    {{ item[1].pair.pair.token1[1] }}
                  </div>
                </div>
              </td>
              &lt;!&ndash;<td>
                <div
                  v-if="
                    item[1].pair.liquidity.length &&
                    tokens[item[1].pair.pair.token0[0].toString()] &&
                    tokens[item[1].pair.pair.token0[0].toString()].decimals &&
                    tokens[item[1].pair.pair.token1[0].toString()] &&
                    tokens[item[1].pair.pair.token1[0].toString()].decimals
                  "
                >
                  <span class="table-number-color">{{
                    getPrice(item[1].pair.liquidity, item[1].pair.pair)
                  }}</span>
                  {{ item[1].pair.pair.token1[1] }}
                </div>
              </td>&ndash;&gt;
              <td>
                <a
                  :href="`https://ic.house/competitions/tradingComp/${item[1].pair.pair.canisterId.toString()}/${
                    item[1].round
                  }`"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                >
                  {{ item[1].name }}
                </a>
              </td>
              <td>
                <a
                  :href="`https://ic.house/competitions/tradingComp/${item[1].pair.pair.canisterId.toString()}/${
                    item[1].round
                  }`"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                >
                  {{ item[1].round }}
                  <a-icon
                    class="pending-competitions"
                    v-show="pendingCompetitions(item[1])"
                    type="clock-circle"
                  />
                  <a-icon
                    class="open-competitions"
                    v-show="openCompetitions(item[1])"
                    type="check-circle"
                  />
                  <a-icon
                    class="close-competitions"
                    v-show="closeCompetitions(item[1])"
                    type="lock"
                  />
                </a>
              </td>
              <td>
                {{ item[1].start | formatDateFromNanosecondUTC }}
              </td>
              <td>
                {{ item[1].end | formatDateFromNanosecondUTC }}
              </td>
              <td v-if="getPrincipalId">
                <span
                  @click="comp_register(item[1])"
                  v-if="item[1].canRegister"
                  class="pointer margin-left-auto"
                  style="color: #1996c4"
                  >Register</span
                >
                <span v-if="openSoon(item[1])">Open soon</span>
                <span v-if="closed(item[1])">Closed</span>
                <span
                  v-else-if="item[1].competitionInfo"
                  class="margin-left-auto"
                >
                  Registered
                </span>
              </td>
            </tr>
            <tr v-if="!competitions.length">
              <td
                :colspan="getPrincipalId ? 9 : 8"
                style="text-align: center; font-size: 14px"
              >
                No data
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="h5-show">
        <div
          class="competitions-main-scroll"
          v-infinite-scroll="handleInfiniteOnLoad"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="10"
          :infinite-scroll-immediate-check="false"
        >
          <div
            class="competitions-scroll-main"
            v-for="(item, index) in competitions"
            :key="index"
          >
            <div class="competitions-scroll-item">
              <span>Pair</span>
              <span class="margin-left-auto">
                <router-link
                  :to="`/ICDex/${item[1].pair.pair.token0[1]}/${item[1].pair.pair.token1[1]}`"
                >
                  {{ item[1].pair.pair.token0[1] }}/{{
                    item[1].pair.pair.token1[1]
                  }}
                </router-link>
              </span>
            </div>
            <div class="competitions-scroll-item">
              <span>Canister Id</span>
              <span class="margin-left-auto">
                <router-link
                  :to="`/ICDex/${item[1].pair.pair.token0[1]}/${item[1].pair.pair.token1[1]}`"
                >
                  {{
                    item[1].pair.pair.canisterId.toString() | ellipsisAccount
                  }}
                </router-link>
              </span>
            </div>
            <div class="competitions-scroll-item">
              <span>Vol</span>
              <div
                class="pair-vol margin-left-auto"
                v-if="item[1].pair.liquidity.length"
              >
                <div
                  v-if="
                    tokens[item[1].pair.pair.token1[0].toString()] &&
                    tokens[item[1].pair.pair.token1[0].toString()].decimals
                  "
                >
                  <span class="table-number-color">{{
                    item[1].pair.liquidity[0].vol.value1
                      | bigintToFloat(
                        2,
                        tokens[item[1].pair.pair.token1[0].toString()].decimals
                      )
                      | formatNum
                  }}</span>
                  {{ item[1].pair.pair.token1[1] }}
                </div>
              </div>
            </div>
            &lt;!&ndash;<div class="competitions-scroll-item">
              <span>Price</span>
              <div
                class="margin-left-auto"
                v-if="
                  item[1].pair.liquidity.length &&
                  tokens[item[1].pair.pair.token0[0].toString()] &&
                  tokens[item[1].pair.pair.token0[0].toString()].decimals &&
                  tokens[item[1].pair.pair.token1[0].toString()] &&
                  tokens[item[1].pair.pair.token1[0].toString()].decimals
                "
              >
                <span class="table-number-color">{{
                  getPrice(item[1].pair.liquidity, item[1].pair.pair)
                }}</span>
                {{ item[1].pair.pair.token1[1] }}
              </div>
            </div>&ndash;&gt;
            <div class="competitions-scroll-item">
              <span>Name</span>
              <a
                :href="`https://ic.house/competitions/tradingComp/${item[1].pair.pair.canisterId.toString()}/${
                  item[1].round
                }`"
                target="_blank"
                rel="nofollow noreferrer noopener"
                class="margin-left-auto"
              >
                {{ item[1].name }}
              </a>
            </div>
            <div class="competitions-scroll-item">
              <span>Round</span>
              <a
                :href="`https://ic.house/competitions/tradingComp/${item[1].pair.pair.canisterId.toString()}/${
                  item[1].round
                }`"
                target="_blank"
                rel="nofollow noreferrer noopener"
                class="margin-left-auto"
              >
                {{ item[1].round }}
                <a-icon
                  class="pending-competitions"
                  v-show="pendingCompetitions(item[1])"
                  type="clock-circle"
                />
                <a-icon
                  class="open-competitions"
                  v-show="openCompetitions(item[1])"
                  type="check-circle"
                />
                <a-icon
                  class="close-competitions"
                  v-show="closeCompetitions(item[1])"
                  type="lock"
                />
              </a>
            </div>
            <div class="competitions-scroll-item">
              <span>Start</span>
              <span class="margin-left-auto">{{
                item[1].start | formatDateFromNanosecond
              }}</span>
            </div>
            <div class="competitions-scroll-item">
              <span>End</span>
              <span class="margin-left-auto">{{
                item[1].end | formatDateFromNanosecond
              }}</span>
            </div>
            <div v-if="getPrincipalId" class="competitions-scroll-item">
              <span>Status</span>
              <span
                @click="comp_register(item[1])"
                v-if="item[1].canRegister"
                class="pointer margin-left-auto"
                style="color: #1996c4"
                >Register</span
              >
              <span v-if="openSoon(item[1])">Open soon</span>
              <span v-if="closed(item[1])">Closed</span>
              <span v-if="item[1].competitionInfo" class="margin-left-auto">
                Registered
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Menu } from '@/components/menu/model';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import {
  CompetitionsData,
  CompetitionsDataInfo,
  DexCompetitionResponse,
  SwapPair__1,
  TraderData
} from '@/ic/ICSwapRouter/model';
import { TokenId, TokenInfo, TokenStd } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { namespace } from 'vuex-class';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { principalToAccountIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';

const commonModule = namespace('common');

@Component({
  name: 'Competitions',
  components: {
    AccountInfo
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  private tokens: { [key: string]: TokenInfo } = {};
  private competitions: Array<CompetitionsData> = [];
  private page = {
    current: 1,
    pageSize: 20,
    total: 0,
    onChange: this.pageChange,
    hideOnSinglePage: true,
    showQuickJumper: true
  };
  private busy = true;
  private loadMore = true;
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
  private currentMenu = 'combined';
  private dexCompetitionResponse: DexCompetitionResponse = null;
  private traderData: Array<TraderData> = null;
  private pairInfo: { [key: string]: SwapPair__1 } = {};
  private account = '';
  private round: bigint = null;
  private updateTime = 0;
  get dexCompetitionStatus(): string {
    if (this.dexCompetitionResponse) {
      const now = new Date().getTime();
      if (
        new BigNumber(now)
          .times(1000000)
          .lt(this.dexCompetitionResponse.start.toString(10))
      ) {
        return 'Open soon';
      }
      if (
        new BigNumber(now)
          .times(1000000)
          .gt(this.dexCompetitionResponse.end.toString(10))
      ) {
        return 'Closed';
      }
      if (
        new BigNumber(now)
          .times(1000000)
          .gte(this.dexCompetitionResponse.start.toString(10)) &&
        new BigNumber(now)
          .times(1000000)
          .lte(this.dexCompetitionResponse.end.toString(10))
      ) {
        if (this.traderData) {
          return 'Registered';
        } else {
          return 'Register';
        }
      }
    }
    return 'Closed';
  }
  created(): void {
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.getCompetitions('init');
    this.getDexCompetitions();
    const principal = localStorage.getItem('principal');
    if (principal) {
      this.account = principalToAccountIdentifier(Principal.from(principal));
    }
  }
  private async registerDexCompetition(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const res = await this.ICSwapRouterFiduciaryService.registerDexCompetition();
    loading.close();
    if (res) {
      this.$message.success('Register Success');
      this.getDexCompetition();
    } else {
      this.$message.success('Register Error');
    }
  }
  private async getDexCompetitions(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    this.round = await this.ICSwapRouterFiduciaryService.getDexCompetitionRound();
    const res = await this.ICSwapRouterFiduciaryService.getDexCompetition(this.round);
    console.log(this.round, res);
    if (res && res.length) {
      this.dexCompetitionResponse = res[0];
      this.dexCompetitionResponse.pairs.forEach((item) => {
        this.pairInfo[item[1].canisterId.toString()] = item[1];
        if (!this.tokens[item[1].token0[0].toString()]) {
          this.setTokenInfo(item[1].token0[0], item[1].token0[2]);
        }
        if (!this.tokens[item[1].token1[0].toString()]) {
          this.setTokenInfo(item[1].token1[0], item[1].token1[2]);
        }
      });
    }
    this.getDexCompetition();
    loading.close();
  }
  private async getDexCompetition(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const res = await this.ICSwapRouterFiduciaryService.getDexCompetitionTrader(
        this.round,
        principalToAccountIdentifier(Principal.fromText(principal))
      );
      if (res && res.length) {
        this.traderData = res[0];
        if (this.traderData.length) {
          let updateTime = '0';
          this.traderData.forEach((item) => {
            if (item.total && item.total.length) {
              if (
                new BigNumber(item.total[0][0].time.toString(10))
                  .div(1000000)
                  .gt(updateTime)
              ) {
                updateTime = item.total[0][0].time.toString(10);
              }
            }
          });
          this.updateTime = Number(updateTime);
        }
      }
    }
  }
  private changeMenu(menu: string): void {
    this.currentMenu = menu;
  }
  private openSoon(val: CompetitionsDataInfo): boolean {
    const now = new Date().getTime();
    return new BigNumber(now).times(10 ** 6).lt(val.start.toString(10));
  }
  private closed(val: CompetitionsDataInfo): boolean {
    const now = new Date().getTime();
    return new BigNumber(now).times(10 ** 6).gt(val.end.toString(10));
  }
  private async comp_register(val: CompetitionsDataInfo): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this;
    this.$confirm({
      title: 'Are you sure you want to participate in the trading competition?',
      content:
        "Notes: Participants' trading assets will be held in the contract until the end of the competition for the purpose of calculating earnings. Participants may drop out the competition and withdraw their assets early.",
      class: 'connect-plug register-mining-confirm',
      icon: 'connect-plug',
      okText: 'Yes',
      centered: true,
      onOk() {
        const loading = _that.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        const currentICDexService = new ICDexService();
        const dexId = val.pair.pair.canisterId.toString();
        currentICDexService
          .comp_register(dexId)
          .then((res) => {
            if (res) {
              _that.$message.success('Register success');
              _that.canRegister(val).then((canRegister) => {
                _that.$set(val, 'canRegister', canRegister);
              });
              _that.$forceUpdate();
            } else {
              _that.$message.error('Register error');
            }
          })
          .catch(() => {
            _that.$message.error('Register error');
          })
          .finally(() => {
            loading.close();
          });
      }
    });
  }
  private async canRegister(val: CompetitionsDataInfo): Promise<boolean> {
    let flag = false;
    const now = new Date().getTime();
    if (
      new BigNumber(now).times(1000000).gte(val.start.toString(10)) &&
      new BigNumber(now).times(1000000).lte(val.end.toString(10))
    ) {
      const currentICDexService = new ICDexService();
      const principal = localStorage.getItem('principal');
      const res = await currentICDexService.comp_result(
        val.pair.pair.canisterId.toString(),
        [],
        principal
      );
      if (!res || !res.length) {
        flag = true;
      } else if (res && res.length) {
        this.$set(val, 'competitionInfo', res[0]);
      }
    }
    return flag;
  }
  private pageChange(page: number): void {
    this.page.current = page;
    this.getCompetitions();
  }
  private async getCompetitions(type?: string): Promise<void> {
    if (!this.loadMore) {
      this.busy = false;
      return;
    }
    let loading;
    if (type) {
      loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      this.competitions = [];
      this.page.current = 1;
    } else {
      this.page.current++;
    }
    let dexName = [];
    if (this.$route.query.type) {
      dexName = [this.$route.query.type];
    }
    const res = await this.ICSwapRouterFiduciaryService.getCompetitions(
      dexName,
      [this.page.current],
      [this.page.pageSize]
    );
    if (res) {
      if (res.data && res.data.length < this.page.pageSize) {
        this.loadMore = false;
      }
      res.data = res.data.sort((a, b) => {
        return Number(b[1].start) - Number(a[1].start);
      });
      this.competitions = this.competitions.concat(res.data);
      this.page.total = Number(res.total);
    }
    loading && loading.close();
    this.competitions.forEach((item) => {
      if (!this.tokens[item[1].pair.pair.token0[0].toString()]) {
        this.setTokenInfo(
          item[1].pair.pair.token0[0],
          item[1].pair.pair.token0[2]
        );
      }
      if (!this.tokens[item[1].pair.pair.token1[0].toString()]) {
        this.setTokenInfo(
          item[1].pair.pair.token1[0],
          item[1].pair.pair.token1[2]
        );
      }
      this.canRegister(item[1]).then((canRegister) => {
        // item[1].canRegister = canRegister;
        this.$set(item[1], 'canRegister', canRegister);
      });
    });
    this.busy = false;
  }
  private async setTokenInfo(
    tokenId: TokenId,
    tokenStd: TokenStd
  ): Promise<void> {
    const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (tokens[tokenId.toString()]) {
      this.$set(this.tokens, tokenId.toString(), tokens[tokenId.toString()]);
    } else {
      this.$set(
        this.tokens,
        tokenId.toString(),
        await getTokenInfo(tokenId, tokenStd)
      );
    }
  }
  private jump(val: CompetitionsData): void {
    // this.$router.push(
    //   `/competitions/${val[1].pair.pair.canisterId.toString()}/${val[1].round}`
    // );
  }
  private pendingCompetitions(val: CompetitionsDataInfo): boolean {
    const now = new Date().getTime();
    return new BigNumber(now).times(1000000).lt(val.start.toString(10));
  }
  private openCompetitions(val: CompetitionsDataInfo): boolean {
    const now = new Date().getTime();
    return (
      new BigNumber(now).times(1000000).gte(val.start.toString(10)) &&
      new BigNumber(now).times(1000000).lte(val.end.toString(10))
    );
  }
  private closeCompetitions(val: CompetitionsDataInfo): boolean {
    const now = new Date().getTime();
    return new BigNumber(now).times(1000000).gt(val.end.toString(10));
  }
  private getAvgPrice(
    avgPrice: string,
    token0Decimals: number,
    token1Decimals: number
  ): string {
    return new BigNumber(avgPrice)
      .times(10 ** token0Decimals)
      .div(10 ** token1Decimals)
      .decimalPlaces(token1Decimals)
      .toString(10);
  }
  private getVol(val: Array<TraderData>): string {
    let vol = '0';
    val.forEach((item) => {
      if (item.total.length) {
        let decimals;
        const quoteToken = Object.keys(item.quoteToken)[0];
        const token0 = this.pairInfo[item.pair.toString()].token0[0].toString();
        const token1 = this.pairInfo[item.pair.toString()].token1[0].toString();
        if (quoteToken === 'token1') {
          decimals = this.tokens[token1].decimals;
        }
        if (quoteToken === 'token0') {
          decimals = this.tokens[token0].decimals;
        }
        vol = new BigNumber(item.total[0][0].vol.toString(10))
          .div(10 ** decimals)
          .plus(vol)
          .decimalPlaces(decimals)
          .toString(10);
      } else {
        vol = '-';
      }
    });
    return vol;
  }
  private getPNL(val: Array<TraderData>): string {
    let PNL = '0';
    val.forEach((item) => {
      if (item.total.length) {
        let decimals;
        const quoteToken = Object.keys(item.quoteToken)[0];
        const token0 = this.pairInfo[item.pair.toString()].token0[0].toString();
        const token1 = this.pairInfo[item.pair.toString()].token1[0].toString();
        if (quoteToken === 'token1') {
          decimals = this.tokens[token1].decimals;
        }
        if (quoteToken === 'token0') {
          decimals = this.tokens[token0].decimals;
        }
        PNL = new BigNumber(item.total[0][0].pnl)
          .div(10 ** decimals)
          .plus(PNL)
          .decimalPlaces(decimals)
          .toString(10);
      } else {
        PNL = '-';
      }
    });
    return PNL;
  }
  private handleInfiniteOnLoad(): void {
    const width = document.documentElement.clientWidth;
    if (width > 768) {
      return;
    }
    if (!this.busy) {
      console.log('handleInfiniteOnLoad');
      this.busy = true;
      this.getCompetitions();
    }
  }
}
</script>

<style scoped lang="scss">
.home-header {
  top: 14px;
}
.competitions-main {
  margin-top: 60px;
  padding: 30px;
  line-height: 1.5;
  a {
    color: #1996c4;
  }
}
.competitions-title {
  margin: 10px 0 20px;
  font-size: 16px;
}
.competitions-item {
  margin-bottom: 10px;
}
.competitions-info {
  p {
    padding-left: 1em;
    a {
      color: #1996c4;
    }
  }
}
table {
  th {
    background: #11171d !important;
  }
  tbody {
    tr {
      border-bottom: 1px solid #212b35;
      font-size: 12px;
    }
  }
  a {
    color: #1996c4;
  }
}
.competitions-scroll-main {
  margin-bottom: 10px;
  background: #131920;
  border: 1px solid #131920;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  a {
    color: #166a89;
  }
}
.competitions-scroll-item {
  display: flex;
  line-height: 2;
  span {
    &:last-child {
      text-align: right;
    }
  }
}
.pc-show {
  display: block;
}
.h5-show {
  display: none;
}
.token-list-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 470px;
  height: 60px;
  margin: 80px auto 20px;
  border-radius: 30px;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  background: #232730;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 225px;
    height: 40px;
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    &.active {
      background: #51b7c3;
    }
  }
}
.competitions-time {
  display: flex;
  align-items: center;
  line-height: 26px;
  .competitions-time-end {
    margin-left: 20px;
  }
}
.competitions-status {
  display: flex;
  align-items: center;
  margin-top: 20px;
  button {
    width: 100px;
    margin-left: 10px;
  }
}
.trader-data-user {
  margin-top: 10px;
  > li {
    display: flex;
    flex-wrap: wrap;
    > span {
      &:first-child {
        display: inline-block;
        width: 75px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .token-list-menu {
    width: 100%;
    margin-top: 50px;
    li {
      width: 47%;
      font-size: 12px;
    }
  }
  .competitions-time {
    flex-direction: column;
    align-items: flex-start;
    .competitions-time-end {
      margin-left: 0;
    }
  }
  .competitions-main {
    margin-top: 40px;
    padding: 10px;
  }
  .competitions-main-scroll {
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
}
</style>
