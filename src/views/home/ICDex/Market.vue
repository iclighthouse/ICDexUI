<template>
  <div>
    <div class="market-main">
      <div class="market-menu">
        <div
          class="market-menu-info show-total-pc"
          v-if="pairs && pairs.length"
        >
          <span>Total Pairs: {{ pairs.length }}</span>
          <span>Total Vol: {{ totalVol | formatNum }} USD</span>
          <span>Total TVL: {{ totalTVL | formatNum }} USD</span>
          <span>24h Vol: {{ Vol24 | formatNum }} USD</span>
        </div>
        <div class="margin-left-auto flex-center">
          <div
            v-for="(menu, index) in marketMenu"
            :key="index"
            :class="{ active: marketType === menu.value }"
            @click="changeMenu(menu)"
          >
            {{ menu.name }}
          </div>
        </div>
      </div>
      <div v-show="marketType === 'pairs'" class="info-chart-main">
        <div id="info-chart-tvl"></div>
        <div id="info-chart-vol"></div>
      </div>
      <div
        v-if="pairs && pairs.length && marketType === 'pairs'"
        style="margin: 0 0 10px 20px"
        class="show-total-h5 base-font-title"
      >
        <span>Total Pairs: {{ pairs.length }}</span>
        <span>Total Vol: {{ totalVol | formatNum }} USD</span>
        <span>Total TVL: {{ totalTVL | formatNum }} USD</span>
        <span v-show="Number(Vol24)">24h Vol: {{ Vol24 | formatNum }} USD</span>
      </div>
      <div class="market-main-container">
        <div v-show="marketType === 'pairs'" class="table-main">
          <div class="pc-show">
            <a-spin :spinning="spinning">
              <table>
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>
                      Board
                      <a-icon type="question-circle" @click="showBoard" />
                    </th>
                    <th>Canister Id</th>
                    <th>Fee</th>
                    <th class="text-right pointer" @click="onSort('vol')">
                      <span class="sort-table-main">
                        <span>Vol</span>
                        <span class="sort-table">
                          <a-icon
                            :class="{ active: sortType === 'volUp' }"
                            type="caret-up"
                          />
                          <a-icon
                            :class="{ active: sortType === 'volDown' }"
                            type="caret-down"
                          />
                        </span>
                      </span>
                    </th>
                    <th class="text-right pointer" @click="onSort('tvl')">
                      <span class="sort-table-main">
                        <span>TVL</span>
                        <span class="sort-table">
                          <a-icon
                            :class="{ active: sortType === 'tvlUp' }"
                            type="caret-up"
                          />
                          <a-icon
                            :class="{ active: sortType === 'tvlDown' }"
                            type="caret-down"
                          />
                        </span>
                      </span>
                    </th>
                    <th class="text-right">Latest price</th>
                    <th class="text-right pointer" @click="onSort('24')">
                      <span class="sort-table-main">
                        <span>24h %</span>
                        <span class="sort-table">
                          <a-icon
                            :class="{ active: sortType === '24Up' }"
                            type="caret-up"
                          />
                          <a-icon
                            :class="{ active: sortType === '24Down' }"
                            type="caret-down"
                          />
                        </span>
                      </span>
                    </th>
                    <th class="text-right pointer" @click="onSort('24Vol')">
                      <span class="sort-table-main">
                        <span>Vol(24h)</span>
                        <span class="sort-table">
                          <a-icon
                            :class="{ active: sortType === '24VolUp' }"
                            type="caret-up"
                          />
                          <a-icon
                            :class="{ active: sortType === '24VolDown' }"
                            type="caret-down"
                          />
                        </span>
                      </span>
                    </th>
                    <th class="text-right pointer" @click="onSort('score')">
                      <span class="sort-table-main">
                        <span>Score&nbsp;</span>
                        <a-icon type="question-circle" @click="showScore" />
                        <span class="sort-table">
                          <a-icon
                            :class="{ active: sortType === 'scoreUp' }"
                            type="caret-up"
                          />
                          <a-icon
                            :class="{ active: sortType === 'scoreDown' }"
                            type="caret-down"
                          />
                        </span>
                      </span>
                    </th>
                    <th class="text-right">
                      Sponsored
                      <a-icon type="question-circle" @click="showSponsored" />
                    </th>
                    <th class="text-right">
                      Ambassadors
                      <a-icon type="question-circle" @click="showQuestion" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="pair in pairs.slice((page - 1) * 100, page * 100)"
                    :key="pair[0].toString()"
                  >
                    <td style="font-weight: bold">
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
                      <span
                        v-if="pair[1].marketBoard && pair[1].marketBoard.length"
                        :class="Object.keys(pair[1].marketBoard[0])[0]"
                      >
                        {{ getBoard(pair[1].marketBoard) }}
                      </span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <div>
                        <copy-account
                          :front="pair[1].pair.canisterId.toString().length"
                          :is-copy="false"
                          :href="`https://ic.house/swap/${pair[1].pair.canisterId.toString()}`"
                          :account="pair[1].pair.canisterId.toString()"
                          copyText="Canister Id"
                        ></copy-account>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>
                          Maker: <span class="table-number-color">0%</span>,
                        </div>
                        <div>
                          Taker:
                          <span class="table-number-color">{{
                            pair[1].pair.feeRate | filterBuyFee
                          }}</span>
                        </div>
                      </div>
                    </td>
                    <td align="right" style="padding: 0 10px">
                      <div class="pair-vol" v-if="pair[1].liquidity.length">
                        <dl
                          v-if="
                            tokens &&
                            tokens[pair[1].pair.token1[0].toString()] &&
                            pair[1].liquidity[0]
                          "
                        >
                          <dd>
                            <span class="table-number-color">
                              {{
                                times2(pair[1].liquidity[0].vol.value1)
                                  | bigintToFloat(
                                    0,
                                    tokens[pair[1].pair.token1[0].toString()]
                                      .decimals
                                  )
                                  | formatAmount(0)
                              }}
                            </span>
                            {{ pair[1].pair.token1[1] }}
                          </dd>
                          <dt>
                            <span
                              v-if="pair[1].liquidity[0]"
                              class="table-number-color"
                            >
                              ≈ ${{
                                times2(pair[1].liquidity[0].vol.value1)
                                  | filterIcpVol(
                                    tokens[pair[1].pair.token1[0].toString()]
                                      .decimals,
                                    getBasePrice(pair[1].pair.token1[1])
                                  )
                                  | formatAmount(0)
                              }}
                            </span>
                          </dt>
                        </dl>
                      </div>
                    </td>
                    <td align="right" style="padding: 0 10px">
                      <div v-if="pair[2]">
                        <span class="table-number-color">
                          <span v-if="Number(pair[2] > 0)">
                            ${{
                              pair[2] | bigintToFloat(0, 0) | formatAmount(0)
                            }}
                          </span>
                          <span v-else>{{ pair[2] }}</span>
                        </span>
                        <!--<router-link
                          style="white-space: nowrap"
                          :to="`/ICDex/pools/?pair=${pair[1].pair.canisterId.toString()}`"
                        >
                          ->pools
                        </router-link>-->
                      </div>
                      <div v-else>-</div>
                    </td>
                    <td align="right">
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
                          getPrice(pair[1])
                        }}</span>
                        {{ pair[1].pair.token1[1] }}
                      </div>
                    </td>
                    <td align="right">
                      <span
                        v-if="pair[3]"
                        :class="{
                          'base-green': Number(pair[3].change24h) > 0,
                          'base-red': Number(pair[3].change24h) < 0
                        }"
                        >{{ get24(pair[3].change24h) }}%</span
                      >
                      <span v-else>-</span>
                    </td>
                    <td align="right">
                      <div class="pair-vol" v-if="pair[3]">
                        <dl
                          v-if="
                            tokens && tokens[pair[1].pair.token1[0].toString()]
                          "
                        >
                          <dd>
                            <span class="table-number-color">
                              {{
                                times2(pair[3].vol24h.value1)
                                  | bigintToFloat(
                                    0,
                                    tokens[pair[1].pair.token1[0].toString()]
                                      .decimals
                                  )
                                  | formatAmount(0)
                              }}
                            </span>
                            {{ pair[1].pair.token1[1] }}
                          </dd>
                          <dt>
                            <span v-if="pair[3]" class="table-number-color">
                              ≈ ${{
                                times2(pair[3].vol24h.value1)
                                  | filterIcpVol(
                                    tokens[pair[1].pair.token1[0].toString()]
                                      .decimals,
                                    getBasePrice(pair[1].pair.token1[1])
                                  )
                                  | formatAmount(0)
                              }}
                            </span>
                          </dt>
                        </dl>
                      </div>
                    </td>
                    <td align="right">
                      <span class="table-number-color">{{
                        pair[1].score
                      }}</span>
                    </td>
                    <td align="right">
                      <span class="table-number-color"
                        >({{ pair[1].listingReferrers.length }})&nbsp;</span
                      >
                      <span
                        v-if="hasReferrer(pair[1].listingReferrers)"
                        :class="{
                          ambassadors: hasReferrer(pair[1].listingReferrers)
                        }"
                      >
                        <a-icon type="like" />
                      </span>
                      <a-icon @click="onReferrer(pair)" v-else type="like" />
                    </td>
                    <td align="right">
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
                v-if="total > 100"
                class="pagination"
                :default-page-size="100"
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
                v-for="pair in pairs.slice(0, page * 100)"
                :key="pair[0].toString()"
              >
                <div class="pair-item">
                  <span>Pair</span>
                  <span class="margin-left-auto">
                    <router-link
                      :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}`"
                    >
                      <span>
                        {{ pair[1].pair.token0[1] }}/{{
                          pair[1].pair.token1[1]
                        }}
                      </span>
                    </router-link>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Canister Id</span>
                  <span class="margin-left-auto">
                    <copy-account
                      :front="10"
                      :is-copy="false"
                      :href="`https://ic.house/swap/${pair[1].pair.canisterId.toString()}`"
                      :account="pair[1].pair.canisterId.toString()"
                      copyText="Canister Id"
                    ></copy-account>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Vol</span>
                  <span
                    class="pair-vol margin-left-auto"
                    v-if="pair[1].liquidity.length"
                  >
                    <dl
                      v-if="
                        tokens &&
                        tokens[pair[1].pair.token1[0].toString()] &&
                        pair[1].liquidity[0]
                      "
                    >
                      <dd>
                        <span class="table-number-color">
                          {{
                            times2(pair[1].liquidity[0].vol.value1)
                              | bigintToFloat(
                                0,
                                tokens[pair[1].pair.token1[0].toString()]
                                  .decimals
                              )
                              | formatAmount(0)
                          }}
                        </span>
                        {{ pair[1].pair.token1[1] }}
                      </dd>
                      <dt>
                        <span
                          v-if="pair[1].liquidity[0]"
                          class="table-number-color"
                        >
                          ≈ ${{
                            times2(pair[1].liquidity[0].vol.value1)
                              | filterIcpVol(
                                tokens[pair[1].pair.token1[0].toString()]
                                  .decimals,
                                getBasePrice(pair[1].pair.token1[1])
                              )
                              | formatAmount(0)
                          }}
                        </span>
                      </dt>
                    </dl>
                  </span>
                </div>
                <div class="pair-item">
                  <span>TVL</span>
                  <span class="pair-vol margin-left-auto">
                    <div v-if="pair[2]">
                      <span class="table-number-color">
                        <span v-if="Number(pair[2] > 0)">
                          ${{ pair[2] | bigintToFloat(0, 0) | formatAmount(0) }}
                        </span>
                        <span v-else>{{ pair[2] }}</span>
                      </span>
                      <!--<router-link
												style="white-space: nowrap"
												:to="`/ICDex/pools/?pair=${pair[1].pair.canisterId.toString()}`"
											>
												->pools
											</router-link>-->
                    </div>
                    <div v-else>-</div>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Latest price</span>
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
                    {{ getPrice(pair[1]) }}
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
                      v-if="hasReferrer(pair[1].listingReferrers)"
                      :class="{
                        ambassadors: hasReferrer(pair[1].listingReferrers)
                      }"
                    >
                      <a-icon type="like" />
                    </span>
                    <a-icon v-else type="like" @click="onReferrer(pair)" />
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
        <div v-show="marketType === 'newLaunches'" class="table-main">
          <div class="pc-show">
            <a-spin :spinning="spinning">
              <table>
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Canister Id</th>
                    <th>Created Time</th>
                    <th>Fee</th>
                    <th>Vol</th>
                    <th>TVL</th>
                    <th>24h Vol</th>
                    <th>Latest price</th>
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
                    v-for="pair in launches.slice(
                      (pageLaunch - 1) * 100,
                      pageLaunch * 100
                    )"
                    :key="pair[0].toString()"
                  >
                    <td style="font-weight: bold">
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
                        <copy-account
                          :front="pair[1].pair.canisterId.toString().length"
                          :is-copy="false"
                          :href="`https://ic.house/swap/${pair[1].pair.canisterId.toString()}`"
                          :account="pair[1].pair.canisterId.toString()"
                          copyText="Canister Id"
                        ></copy-account>
                      </div>
                    </td>
                    <td>
                      <span v-if="pair[1].createdTime">
                        {{ pair[1].createdTime | formatDateFromSecondUTCD }}
                      </span>
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
                        <dl
                          v-if="
                            tokens &&
                            tokens[pair[1].pair.token1[0].toString()] &&
                            pair[1].liquidity[0]
                          "
                        >
                          <dd>
                            <span class="table-number-color">
                              {{
                                times2(pair[1].liquidity[0].vol.value1)
                                  | bigintToFloat(
                                    0,
                                    tokens[pair[1].pair.token1[0].toString()]
                                      .decimals
                                  )
                                  | formatAmount(0)
                              }}
                            </span>
                            {{ pair[1].pair.token1[1] }}
                          </dd>
                          <dt>
                            <span
                              v-if="pair[1].liquidity[0]"
                              class="table-number-color"
                            >
                              ≈ ${{
                                times2(pair[1].liquidity[0].vol.value1)
                                  | filterIcpVol(
                                    tokens[pair[1].pair.token1[0].toString()]
                                      .decimals,
                                    getBasePrice(pair[1].pair.token1[1])
                                  )
                                  | formatAmount(0)
                              }}
                            </span>
                          </dt>
                        </dl>
                      </div>
                    </td>
                    <td>
                      <div v-if="pair[2]">
                        <span class="table-number-color">
                          <span v-if="Number(pair[2] > 0)">
                            ${{
                              pair[2] | bigintToFloat(0, 0) | formatAmount(0)
                            }}
                          </span>
                          <span v-else>{{ pair[2] }}</span>
                        </span>
                        <!--<router-link
												style="white-space: nowrap"
												:to="`/ICDex/pools/?pair=${pair[1].pair.canisterId.toString()}`"
											>
												->pools
											</router-link>-->
                      </div>
                      <div v-else>-</div>
                    </td>
                    <td>
                      <div class="pair-vol" v-if="pair[3]">
                        <dl
                          v-if="
                            tokens && tokens[pair[1].pair.token1[0].toString()]
                          "
                        >
                          <dd>
                            <span class="table-number-color">
                              {{
                                times2(pair[3].vol24h.value1)
                                  | bigintToFloat(
                                    0,
                                    tokens[pair[1].pair.token1[0].toString()]
                                      .decimals
                                  )
                                  | formatAmount(0)
                              }}
                            </span>
                            {{ pair[1].pair.token1[1] }}
                          </dd>
                          <dt>
                            <span v-if="pair[3]" class="table-number-color">
                              ≈ ${{
                                times2(pair[3].vol24h.value1)
                                  | filterIcpVol(
                                    tokens[pair[1].pair.token1[0].toString()]
                                      .decimals,
                                    getBasePrice(pair[1].pair.token1[1])
                                  )
                                  | formatAmount(0)
                              }}
                            </span>
                          </dt>
                        </dl>
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
                          getPrice(pair[1])
                        }}</span>
                        {{ pair[1].pair.token1[1] }}
                      </div>
                    </td>
                    <td>
                      <span class="table-number-color">{{
                        pair[1].score
                      }}</span>
                    </td>
                    <td>
                      <span class="table-number-color"
                        >({{ pair[1].listingReferrers.length }})&nbsp;</span
                      >
                      <span
                        v-if="hasReferrer(pair[1].listingReferrers)"
                        :class="{
                          ambassadors: hasReferrer(pair[1].listingReferrers)
                        }"
                      >
                        <a-icon type="like" />
                      </span>
                      <a-icon v-else type="like" @click="onReferrer(pair)" />
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
                v-if="launches.length > 100"
                class="pagination"
                :default-page-size="100"
                :total="launches.length"
                @change="pageLaunchChange"
              />
            </div>
          </div>
          <a-spin class="h5-show" :spinning="spinning">
            <div
              class="pair-main-scroll"
              v-infinite-scroll="handleInfiniteOnLoadLaunch"
              :infinite-scroll-disabled="busyLaunch"
              :infinite-scroll-distance="10"
              :infinite-scroll-immediate-check="false"
            >
              <div
                class="pair-main"
                v-for="pair in pairs.slice(0, pageLaunch * 100)"
                :key="pair[0].toString()"
              >
                <div class="pair-item">
                  <span>Pair</span>
                  <span class="margin-left-auto">
                    <router-link
                      :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}`"
                    >
                      <span>
                        {{ pair[1].pair.token0[1] }}/{{
                          pair[1].pair.token1[1]
                        }}
                      </span>
                    </router-link>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Canister Id</span>
                  <span class="margin-left-auto">
                    <copy-account
                      :front="10"
                      :is-copy="false"
                      :href="`https://ic.house/swap/${pair[1].pair.canisterId.toString()}`"
                      :account="pair[1].pair.canisterId.toString()"
                      copyText="Canister Id"
                    ></copy-account>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Vol</span>
                  <span
                    class="pair-vol margin-left-auto"
                    v-if="pair[1].liquidity.length"
                  >
                    <dl
                      v-if="
                        tokens &&
                        tokens[pair[1].pair.token1[0].toString()] &&
                        pair[1].liquidity[0]
                      "
                    >
                      <dd>
                        <span class="table-number-color">
                          {{
                            times2(pair[1].liquidity[0].vol.value1)
                              | bigintToFloat(
                                0,
                                tokens[pair[1].pair.token1[0].toString()]
                                  .decimals
                              )
                              | formatAmount(0)
                          }}
                        </span>
                        {{ pair[1].pair.token1[1] }}
                      </dd>
                      <dt>
                        <span
                          v-if="pair[1].liquidity[0]"
                          class="table-number-color"
                        >
                          ≈ ${{
                            times2(pair[1].liquidity[0].vol.value1)
                              | filterIcpVol(
                                tokens[pair[1].pair.token1[0].toString()]
                                  .decimals,
                                getBasePrice(pair[1].pair.token1[1])
                              )
                              | formatAmount(0)
                          }}
                        </span>
                      </dt>
                    </dl>
                  </span>
                </div>
                <div class="pair-item">
                  <span>TVL</span>
                  <span class="pair-vol margin-left-auto">
                    <div v-if="pair[2]">
                      <span class="table-number-color">
                        <span v-if="Number(pair[2] > 0)">
                          ${{ pair[2] | bigintToFloat(0, 0) | formatAmount(0) }}
                        </span>
                        <span v-else>{{ pair[2] }}</span>
                      </span>
                      <!--<router-link
												style="white-space: nowrap"
												:to="`/ICDex/pools/?pair=${pair[1].pair.canisterId.toString()}`"
											>
												->pools
											</router-link>-->
                    </div>
                    <div v-else>-</div>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Latest price</span>
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
                    {{ getPrice(pair[1]) }}
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
                      v-if="hasReferrer(pair[1].listingReferrers)"
                      :class="{
                        ambassadors: hasReferrer(pair[1].listingReferrers)
                      }"
                    >
                      <a-icon type="like" />
                    </span>
                    <a-icon v-else type="like" @click="onReferrer(pair)" />
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
        <div v-show="marketType === 'IDO'" class="table-main">
          <div class="pc-show">
            <a-spin :spinning="spinning">
              <table>
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Canister Id</th>
                    <th>IDO Opening Time</th>
                    <th>IDO Closing Time</th>
                    <th>IDO Supplies</th>
                    <th>IDO Limit Per Account</th>
                    <th>IDO Requirement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!IDOs.length">
                    <td colspan="7" style="text-align: center; font-size: 14px">
                      No IDOs
                    </td>
                  </tr>
                  <tr
                    v-for="pair in IDOs.slice(
                      (pageIDOS - 1) * 100,
                      pageIDOS * 100
                    )"
                    :key="pair[0][1].toString()"
                  >
                    <td>
                      <div>
                        <router-link
                          :to="`/ICDex/${pair[0][1].pair.token0[1]}/${pair[0][1].pair.token1[1]}`"
                        >
                          <span>
                            {{ pair[0][1].pair.token0[1] }}/{{
                              pair[0][1].pair.token1[1]
                            }}
                          </span>
                        </router-link>
                      </div>
                    </td>
                    <td>
                      <div>
                        <copy-account
                          :front="pair[0][1].pair.canisterId.toString().length"
                          :is-copy="false"
                          :href="`https://ic.house/swap/${pair[0][1].pair.canisterId.toString()}`"
                          :account="pair[0][1].pair.canisterId.toString()"
                          copyText="Canister Id"
                        ></copy-account>
                      </div>
                    </td>
                    <td>
                      <span v-if="pair[1] && pair[1][1]">
                        {{
                          pair[1][1].IDOOpeningTime
                            | formatDateFromNanosecondUTC
                        }}
                      </span>
                    </td>
                    <td>
                      <span v-if="pair[1] && pair[1][1]">
                        {{
                          pair[1][1].IDOClosingTime
                            | formatDateFromNanosecondUTC
                        }}
                      </span>
                    </td>
                    <td>
                      <div
                        v-if="
                          pair[1] &&
                          pair[1][1] &&
                          pair[1][1].IDOSupplies.length &&
                          tokens &&
                          tokens[pair[0][1].pair.token0[0].toString()] &&
                          tokens[pair[0][1].pair.token0[0].toString()]
                            .decimals &&
                          tokens[pair[0][1].pair.token1[0].toString()] &&
                          tokens[pair[0][1].pair.token1[0].toString()].decimals
                        "
                      >
                        <div
                          v-for="(item, index) in pair[1][1].IDOSupplies"
                          :key="index"
                          style="line-height: 1.5"
                        >
                          <span>
                            Supply:
                            {{
                              item.supply
                                | bigintToFloat(
                                  tokens[pair[0][1].pair.token0[0].toString()]
                                    .decimals,
                                  tokens[pair[0][1].pair.token0[0].toString()]
                                    .decimals
                                )
                            }};
                          </span>
                          <span
                            v-if="
                              pair[0][1].liquidity &&
                              pair[0][1].liquidity.length
                            "
                          >
                            Price:
                            {{
                              getIDOPrice(
                                item.price,
                                tokens[pair[0][1].pair.token0[0].toString()]
                                  .decimals,
                                tokens[pair[0][1].pair.token1[0].toString()]
                                  .decimals,
                                pair[0][1].liquidity[0].unitSize
                              )
                            }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        v-if="
                          pair[1] &&
                          pair[1][1] &&
                          tokens &&
                          tokens[pair[0][1].pair.token0[0].toString()] &&
                          tokens[pair[0][1].pair.token0[0].toString()].decimals
                        "
                      >
                        {{
                          pair[1][1].IDOLimitPerAccount
                            | bigintToFloat(
                              tokens[pair[0][1].pair.token0[0].toString()]
                                .decimals,
                              tokens[pair[0][1].pair.token0[0].toString()]
                                .decimals
                            )
                        }}
                        {{
                          tokens[pair[0][1].pair.token0[0].toString()].symbol
                        }}
                      </span>
                    </td>
                    <td>
                      <div
                        v-if="
                          pair[1][2] &&
                          pair[1][2].length &&
                          pair[1][2][0].pairs.length
                        "
                      >
                        <div>
                          <a-tooltip placement="top">
                            <template slot="title">
                              Users who have reached this threshold of
                              cumulative trading volume are eligible to
                              participate in the IDO.
                            </template>
                            Threshold:
                            {{ pair[1][2][0].threshold | formatNum }} USD
                            <a-icon type="info-circle" />
                          </a-tooltip>
                        </div>
                        <div
                          v-for="(item, index) in pair[1][2][0].pairs"
                          :key="index"
                          style="line-height: 1.5"
                        >
                          <span v-if="index === 0">Pairs:</span>
                          <router-link
                            v-if="pairToSymbol[item.pair]"
                            :to="`/ICDex/${
                              pairToSymbol[item.pair].pair.token0[1]
                            }/${pairToSymbol[item.pair].pair.token1[1]}`"
                            style="color: #1996c4"
                          >
                            {{ pairToSymbol[item.pair].pair.token0[1] }}/{{
                              pairToSymbol[item.pair].pair.token1[1]
                            }}
                          </router-link>
                        </div>
                      </div>
                      <div v-else>-</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </a-spin>
            <div class="pairs-page">
              <a-pagination
                v-if="IDOs.length > 100"
                class="pagination"
                :default-page-size="100"
                :total="IDOs.length"
                @change="pageIDOS"
              />
            </div>
          </div>
          <a-spin class="h5-show" :spinning="spinning">
            <div
              class="pair-main-scroll"
              v-infinite-scroll="handleInfiniteOnLoadIDOs"
              :infinite-scroll-disabled="busyIDOs"
              :infinite-scroll-distance="10"
              :infinite-scroll-immediate-check="false"
            >
              <div
                class="pair-main"
                v-for="pair in IDOs.slice(0, pageIDOS * 100)"
                :key="pair[0].toString()"
              >
                <div class="pair-item">
                  <span>Pair</span>
                  <span class="margin-left-auto">
                    <router-link
                      :to="`/ICDex/${pair[0][1].pair.token0[1]}/${pair[0][1].pair.token1[1]}`"
                    >
                      <span>
                        {{ pair[0][1].pair.token0[1] }}/{{
                          pair[0][1].pair.token1[1]
                        }}
                      </span>
                    </router-link>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Canister Id</span>
                  <span class="margin-left-auto">
                    <copy-account
                      :front="pair[0][1].pair.canisterId.toString().length"
                      :is-copy="false"
                      :href="`https://ic.house/swap/${pair[0][1].pair.canisterId.toString()}`"
                      :account="pair[0][1].pair.canisterId.toString()"
                      copyText="Canister Id"
                    ></copy-account>
                  </span>
                </div>
                <div class="pair-item">
                  <span>IDO Opening Time</span>
                  <span
                    class="pair-vol margin-left-auto"
                    v-if="pair[1] && pair[1][1]"
                  >
                    {{
                      pair[1][1].IDOOpeningTime | formatDateFromNanosecondUTC
                    }}
                  </span>
                </div>
                <div class="pair-item">
                  <span>IDO Closing Time</span>
                  <span
                    class="pair-vol margin-left-auto"
                    v-if="pair[1] && pair[1][1]"
                  >
                    <span v-if="pair[1] && pair[1][1]">
                      {{
                        pair[1][1].IDOClosingTime | formatDateFromNanosecondUTC
                      }}
                    </span>
                  </span>
                </div>
                <div class="pair-item">
                  <span>IDO Supplies</span>
                  <span class="pair-vol margin-left-auto">
                    <div
                      v-if="
                        pair[1] &&
                        pair[1][1] &&
                        pair[1][1].IDOSupplies.length &&
                        tokens &&
                        tokens[pair[0][1].pair.token0[0].toString()] &&
                        tokens[pair[0][1].pair.token0[0].toString()].decimals &&
                        tokens[pair[0][1].pair.token1[0].toString()] &&
                        tokens[pair[0][1].pair.token1[0].toString()].decimals
                      "
                    >
                      <div
                        v-for="(item, index) in pair[1][1].IDOSupplies"
                        :key="index"
                        style="line-height: 1.5"
                      >
                        <span>
                          Supply:
                          {{
                            item.supply
                              | bigintToFloat(
                                tokens[pair[0][1].pair.token0[0].toString()]
                                  .decimals,
                                tokens[pair[0][1].pair.token0[0].toString()]
                                  .decimals
                              )
                          }};
                        </span>
                        <span
                          v-if="
                            pair[0][1].liquidity && pair[0][1].liquidity.length
                          "
                        >
                          Price:
                          {{
                            getIDOPrice(
                              item.price,
                              tokens[pair[0][1].pair.token0[0].toString()]
                                .decimals,
                              tokens[pair[0][1].pair.token1[0].toString()]
                                .decimals,
                              pair[0][1].liquidity[0].unitSize
                            )
                          }}
                        </span>
                      </div>
                    </div>
                  </span>
                </div>
                <div class="pair-item">
                  <span>IDO Limit Per Account</span>
                  <span class="pair-vol margin-left-auto">
                    <span
                      v-if="
                        pair[1] &&
                        pair[1][1] &&
                        tokens &&
                        tokens[pair[0][1].pair.token0[0].toString()] &&
                        tokens[pair[0][1].pair.token0[0].toString()].decimals
                      "
                    >
                      {{
                        pair[1][1].IDOLimitPerAccount
                          | bigintToFloat(
                            tokens[pair[0][1].pair.token0[0].toString()]
                              .decimals,
                            tokens[pair[0][1].pair.token0[0].toString()]
                              .decimals
                          )
                      }}
                      {{ tokens[pair[0][1].pair.token0[0].toString()].symbol }}
                    </span>
                  </span>
                </div>
                <div class="pair-item">
                  <span>IDO Requirement</span>
                  <span class="margin-left-auto">
                    <div
                      v-if="
                        pair[1][2] &&
                        pair[1][2].length &&
                        pair[1][2][0].pairs.length
                      "
                    >
                      <div>
                        <a-tooltip placement="top">
                          <template slot="title">
                            Users who have reached this threshold of cumulative
                            trading volume are eligible to participate in the
                            IDO.
                          </template>
                          Threshold:
                          {{ pair[1][2][0].threshold | formatNum }} USD
                          <a-icon type="info-circle" />
                        </a-tooltip>
                      </div>
                      <div
                        v-for="(item, index) in pair[1][2][0].pairs"
                        :key="index"
                        style="line-height: 1.5"
                      >
                        <span v-if="index === 0">Pairs:</span>
                        <router-link
                          v-if="pairToSymbol[item.pair]"
                          :to="`/ICDex/${
                            pairToSymbol[item.pair].pair.token0[1]
                          }/${pairToSymbol[item.pair].pair.token1[1]}`"
                          style="color: #1996c4"
                        >
                          {{ pairToSymbol[item.pair].pair.token0[1] }}/{{
                            pairToSymbol[item.pair].pair.token1[1]
                          }}
                        </router-link>
                      </div>
                    </div>
                    <div v-else>-</div>
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
                3. The system will count the number of accounts and the volume
                of trading from your promotion. It is possible that there is a
                reward program for ambassadors that comes from the project side
                or Dex platform associated with the trading pair, as described
                on the "Trading Ambassadors" page of that trading pair. Note:
                Not every trading pair has a reward program.
              </p>
            </div>
          </div>
        </div>
        <!--<div v-show="marketType === 'PoolMarket'" class="referrers-main">
					<button @click="NFTWithdraw">NFTWithdraw</button>
				</div>-->
        <div
          style="padding: 10px 20px 40px"
          v-show="marketType === 'vip'"
          class="referrers-main referrers-main-pool mt20"
        >
          <div class="makers-header">
            <span style="font-size: 16px">Makers</span>
            <span
              class="margin-left-auto main-color pointer"
              style="margin-right: 10px"
              @click="searchMaker"
            >
              Search <a-icon type="search" />
            </span>
            <button type="button" class="primary" @click="onBindMaker">
              Add new vip-maker with NFT
            </button>
          </div>
          <div
            v-show="showSearchAccount"
            class="mt20 background-table background-table-form"
          >
            <a-icon @click="hideAccount" type="close-circle" />
            <a-form-model
              :model="queryForm"
              ref="queryForm"
              :rules="queryFormRules"
              class="round-account-form"
            >
              <div>
                <a-form-model-item label="Owner" prop="owner">
                  <a-input
                    v-model="queryForm.owner"
                    autocomplete="off"
                    placeholder="Owner(Principal)"
                  />
                </a-form-model-item>
                <a-form-model-item label="Subaccount (Hex)" prop="subaccount">
                  <a-input
                    v-model="queryForm.subaccount"
                    autocomplete="off"
                    placeholder="Subaccount (optional)"
                  />
                </a-form-model-item>
              </div>
              <div class="search-token">
                <a-form-model-item label="Pair">
                  <a-select
                    allowClear
                    v-model="queryForm.pair"
                    style="width: 910px"
                    placeholder="select a pair"
                  >
                    <a-select-option v-for="pair in makersPairs" :key="pair">
                      <span v-if="pairToSymbol[pair]">
                        {{ pairToSymbol[pair].pair.token0[1] }}/{{
                          pairToSymbol[pair].pair.token1[1]
                        }}
                      </span>
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item class="margin-left-auto">
                  <button
                    style="height: 36px"
                    @click="queryAccount"
                    class="primary large-primary"
                  >
                    Search
                  </button>
                </a-form-model-item>
              </div>
            </a-form-model>
          </div>
          <div class="pc-show">
            <a-spin :spinning="bindingMakersLoad" class="mt20">
              <table>
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Account</th>
                    <th>Vol</th>
                    <th>Commission</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!bindingMakers.length">
                    <td colspan="6" style="text-align: center">No Makers</td>
                  </tr>
                  <tr v-for="(item, index) in bindingMakers" :key="index">
                    <td>
                      <router-link
                        v-if="pairToSymbol[item[0].toString()]"
                        :to="`/ICDex/${
                          pairToSymbol[item[0].toString()].pair.token0[1]
                        }/${pairToSymbol[item[0].toString()].pair.token1[1]}`"
                      >
                        {{ pairToSymbol[item[0].toString()].pair.token0[1] }}/{{
                          pairToSymbol[item[0].toString()].pair.token1[1]
                        }}
                      </router-link>
                    </td>
                    <td>
                      <copy-account
                        :account="arrayToString(item[1])"
                        copyText="Account"
                      ></copy-account>
                    </td>
                    <td>
                      <span
                        v-if="
                          pairToSymbol[item[0].toString()] &&
                          makerInfo[item[0].toString()] &&
                          makerInfo[item[0].toString()][
                            arrayToString(item[1])
                          ] &&
                          tokens[
                            pairToSymbol[
                              item[0].toString()
                            ].pair.token0[0].toString()
                          ] &&
                          tokens[
                            pairToSymbol[
                              item[0].toString()
                            ].pair.token1[0].toString()
                          ]
                        "
                      >
                        <span>
                          {{
                            makerInfo[item[0].toString()][
                              arrayToString(item[1])
                            ].vol.value0
                              | bigintToFloat(
                                4,
                                tokens[
                                  pairToSymbol[
                                    item[0].toString()
                                  ].pair.token0[0].toString()
                                ].decimals
                              )
                              | formatNum
                          }}
                          {{ pairToSymbol[item[0].toString()].pair.token0[1] }}
                        </span>
                        <span>
                          {{
                            makerInfo[item[0].toString()][
                              arrayToString(item[1])
                            ].vol.value1
                              | bigintToFloat(
                                4,
                                tokens[
                                  pairToSymbol[
                                    item[0].toString()
                                  ].pair.token1[0].toString()
                                ].decimals
                              )
                              | formatNum
                          }}
                          {{ pairToSymbol[item[0].toString()].pair.token1[1] }}
                        </span>
                      </span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span
                        v-if="
                          makerInfo[item[0].toString()] &&
                          makerInfo[item[0].toString()][
                            arrayToString(item[1])
                          ] &&
                          pairToSymbol[item[0].toString()] &&
                          tokens[
                            pairToSymbol[
                              item[0].toString()
                            ].pair.token0[0].toString()
                          ] &&
                          tokens[
                            pairToSymbol[
                              item[0].toString()
                            ].pair.token1[0].toString()
                          ]
                        "
                      >
                        <span>
                          {{
                            makerInfo[item[0].toString()][
                              arrayToString(item[1])
                            ].commission.value0
                              | bigintToFloat(
                                4,
                                tokens[
                                  pairToSymbol[
                                    item[0].toString()
                                  ].pair.token0[0].toString()
                                ].decimals
                              )
                              | formatNum
                          }}
                          {{ pairToSymbol[item[0].toString()].pair.token0[1] }}
                        </span>
                        <span>
                          {{
                            makerInfo[item[0].toString()][
                              arrayToString(item[1])
                            ].commission.value1
                              | bigintToFloat(
                                4,
                                tokens[
                                  pairToSymbol[
                                    item[0].toString()
                                  ].pair.token1[0].toString()
                                ].decimals
                              )
                              | formatNum
                          }}
                          {{ pairToSymbol[item[0].toString()].pair.token1[1] }}
                        </span>
                      </span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span
                        v-if="getPrincipalId && isOwner(item)"
                        class="main-color pointer"
                        @click="onUnbind(item)"
                        >Unbind</span
                      >
                      <span v-else>-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </a-spin>
          </div>
          <a-spin class="h5-show" :spinning="bindingMakersLoad">
            <div
              class="pair-main-scroll"
              v-infinite-scroll="handleInfiniteOnLoadMakers"
              :infinite-scroll-disabled="busyMakers"
              :infinite-scroll-distance="10"
              :infinite-scroll-immediate-check="false"
            >
              <div
                class="pair-main"
                v-for="(item, index) in bindingMakers.slice(0, pageMakers * 10)"
                :key="index"
              >
                <div class="pair-item">
                  <span
                    v-if="getPrincipalId && isOwner(item)"
                    class="main-color pointer margin-left-auto"
                    @click="onUnbind(item)"
                    >Unbind</span
                  >
                </div>
                <div class="pair-item">
                  <span>Pair</span>
                  <span class="margin-left-auto">
                    <router-link
                      v-if="pairToSymbol[item[0].toString()]"
                      :to="`/ICDex/${
                        pairToSymbol[item[0].toString()].pair.token0[1]
                      }/${pairToSymbol[item[0].toString()].pair.token1[1]}`"
                    >
                      {{ pairToSymbol[item[0].toString()].pair.token0[1] }}/{{
                        pairToSymbol[item[0].toString()].pair.token1[1]
                      }}
                    </router-link>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Account</span>
                  <span class="margin-left-auto">
                    <copy-account
                      :account="arrayToString(item[1])"
                      copyText="Account"
                    ></copy-account>
                  </span>
                </div>
                <div class="pair-item pair-item-vol">
                  <span>Vol</span>
                  <span
                    v-if="
                      makerInfo[item[0].toString()] &&
                      makerInfo[item[0].toString()][arrayToString(item[1])] &&
                      pairToSymbol[item[0].toString()] &&
                      tokens[
                        pairToSymbol[
                          item[0].toString()
                        ].pair.token0[0].toString()
                      ] &&
                      tokens[
                        pairToSymbol[
                          item[0].toString()
                        ].pair.token1[0].toString()
                      ]
                    "
                    class="stats-info margin-left-auto"
                  >
                    <span>
                      {{
                        makerInfo[item[0].toString()][arrayToString(item[1])]
                          .vol.value0
                          | bigintToFloat(
                            8,
                            tokens[
                              pairToSymbol[
                                item[0].toString()
                              ].pair.token0[0].toString()
                            ].decimals
                          )
                          | formatNum
                      }}
                      {{ pairToSymbol[item[0].toString()].pair.token0[1] }}
                    </span>
                    <span>
                      {{
                        makerInfo[item[0].toString()][arrayToString(item[1])]
                          .vol.value1
                          | bigintToFloat(
                            8,
                            tokens[
                              pairToSymbol[
                                item[0].toString()
                              ].pair.token1[0].toString()
                            ].decimals
                          )
                          | formatNum
                      }}
                      {{ pairToSymbol[item[0].toString()].pair.token1[1] }}
                    </span>
                  </span>
                  <span v-else class="margin-left-auto">-</span>
                </div>
                <div class="pair-item pair-item-vol">
                  <span>Commission</span>
                  <span class="margin-left-auto">
                    <span
                      v-if="
                        makerInfo[item[0].toString()] &&
                        makerInfo[item[0].toString()][arrayToString(item[1])] &&
                        pairToSymbol[item[0].toString()] &&
                        tokens[
                          pairToSymbol[
                            item[0].toString()
                          ].pair.token0[0].toString()
                        ] &&
                        tokens[
                          pairToSymbol[
                            item[0].toString()
                          ].pair.token1[0].toString()
                        ]
                      "
                      class="stats-info"
                    >
                      <span>
                        {{
                          makerInfo[item[0].toString()][arrayToString(item[1])]
                            .commission.value0
                            | bigintToFloat(
                              8,
                              tokens[
                                pairToSymbol[
                                  item[0].toString()
                                ].pair.token0[0].toString()
                              ].decimals
                            )
                            | formatNum
                        }}
                        {{ pairToSymbol[item[0].toString()].pair.token0[1] }}
                      </span>
                      <span>
                        {{
                          makerInfo[item[0].toString()][arrayToString(item[1])]
                            .commission.value1
                            | bigintToFloat(
                              8,
                              tokens[
                                pairToSymbol[
                                  item[0].toString()
                                ].pair.token1[0].toString()
                              ].decimals
                            )
                            | formatNum
                        }}
                        {{ pairToSymbol[item[0].toString()].pair.token1[1] }}
                      </span>
                    </span>
                    <span v-else>-</span>
                  </span>
                </div>
              </div>
            </div>
          </a-spin>
        </div>
        <!--<div v-show="!getPrincipalId && marketType === 'vip'">
          <div class="wallet-empty container-width">
            <img src="@/assets/img/empty.png" alt="" />
            <p>Connect wallet to view</p>
            <button type="button" class="default" @click="connectWallet">
              Connect Wallet
            </button>
          </div>
        </div>-->
        <div
          v-show="marketType === 'Brokers'"
          style="padding: 10px 20px 40px"
          class="referrers-main referrers-main-pool mt20"
        >
          <div class="makers-header">
            <span style="font-size: 16px">Brokers</span>
            <button
              type="button"
              class="primary margin-left-auto"
              style="margin-right: 10px; width: 135px"
              @click="searchBroker"
            >
              Search Broker
            </button>
          </div>
          <div
            v-show="showSearchAccountBroker"
            class="mt20 background-table background-table-form"
          >
            <a-icon @click="hideAccountBroker" type="close-circle" />
            <a-form-model
              :model="queryFormBroker"
              ref="queryFormBroker"
              :rules="queryFormBrokerRules"
              class="round-account-form"
            >
              <a-form-model-item label="Owner" prop="owner">
                <a-input
                  v-model="queryFormBroker.owner"
                  autocomplete="off"
                  placeholder="Owner(Principal)"
                />
              </a-form-model-item>
              <a-form-model-item label="Subaccount (Hex)" prop="subaccount">
                <a-input
                  v-model="queryFormBroker.subaccount"
                  autocomplete="off"
                  placeholder="Subaccount (optional)"
                />
              </a-form-model-item>
              <a-form-model-item class="margin-left-auto">
                <button
                  @click="queryAccountBroker"
                  class="primary large-primary"
                >
                  Search
                </button>
              </a-form-model-item>
            </a-form-model>
          </div>
          <div class="pc-show">
            <a-spin :spinning="bindingBrokersLoad" class="mt20">
              <table>
                <thead>
                  <tr>
                    <th>Broker</th>
                    <th>Pair</th>
                    <th>Tx count</th>
                    <th>Vol</th>
                    <th>Commission</th>
                    <th style="width: 170px">Latest commission rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!brokerListAll.length">
                    <td colspan="6" style="text-align: center">No Brokers</td>
                  </tr>
                  <tr v-for="(item, index) in brokerListAll" :key="index">
                    <td>
                      <copy-account
                        :account="arrayToString(item[0])"
                        copyText="Account"
                      ></copy-account>
                    </td>
                    <td>
                      <router-link
                        v-if="pairToSymbol[item[2]]"
                        :to="`/ICDex/${pairToSymbol[item[2]].pair.token0[1]}/${
                          pairToSymbol[item[2]].pair.token1[1]
                        }`"
                      >
                        {{ pairToSymbol[item[2]].pair.token0[1] }}/{{
                          pairToSymbol[item[2]].pair.token1[1]
                        }}
                      </router-link>
                    </td>
                    <td>
                      <span>
                        {{ item[1].count.toString(10) }}
                      </span>
                    </td>
                    <td>
                      <span
                        v-if="
                          pairToSymbol[item[2]] &&
                          tokens[
                            pairToSymbol[item[2]].pair.token0[0].toString()
                          ] &&
                          tokens[
                            pairToSymbol[item[2]].pair.token1[0].toString()
                          ]
                        "
                        class="stats-info"
                      >
                        <span>
                          {{
                            item[1].vol.value0
                              | bigintToFloat(
                                8,
                                tokens[
                                  pairToSymbol[
                                    item[2]
                                  ].pair.token0[0].toString()
                                ].decimals
                              )
                              | formatNum
                          }}
                          {{ pairToSymbol[item[2]].pair.token0[1] }}
                        </span>
                        <span>
                          {{
                            item[1].vol.value1
                              | bigintToFloat(
                                8,
                                tokens[
                                  pairToSymbol[
                                    item[2]
                                  ].pair.token1[0].toString()
                                ].decimals
                              )
                              | formatNum
                          }}
                          {{ pairToSymbol[item[2]].pair.token1[1] }}
                        </span>
                      </span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span
                        v-if="
                          pairToSymbol[item[2]] &&
                          tokens[
                            pairToSymbol[item[2]].pair.token0[0].toString()
                          ] &&
                          tokens[
                            pairToSymbol[item[2]].pair.token1[0].toString()
                          ]
                        "
                        class="stats-info"
                      >
                        <span>
                          {{
                            item[1].commission.value0
                              | bigintToFloat(
                                8,
                                tokens[
                                  pairToSymbol[
                                    item[2]
                                  ].pair.token0[0].toString()
                                ].decimals
                              )
                              | formatNum
                          }}
                          {{ pairToSymbol[item[2]].pair.token0[1] }}
                        </span>
                        <span>
                          {{
                            item[1].commission.value1
                              | bigintToFloat(
                                8,
                                tokens[
                                  pairToSymbol[
                                    item[2]
                                  ].pair.token1[0].toString()
                                ].decimals
                              )
                              | formatNum
                          }}
                          {{ pairToSymbol[item[2]].pair.token1[1] }}
                        </span>
                      </span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span>
                        {{ item[1].rate | filterFee }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </a-spin>
          </div>
          <a-spin class="h5-show" :spinning="bindingBrokersLoad">
            <div
              class="pair-main-scroll"
              :infinite-scroll-distance="10"
              :infinite-scroll-immediate-check="false"
            >
              <div
                class="pair-main"
                v-for="(item, index) in brokerListAll"
                :key="index"
              >
                <div class="pair-item">
                  <span>Broker</span>
                  <span class="margin-left-auto">
                    <copy-account
                      :account="arrayToString(item[0])"
                      copyText="Account"
                    ></copy-account>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Pair</span>
                  <span class="margin-left-auto">
                    <router-link
                      v-if="pairToSymbol[item[2]]"
                      :to="`/ICDex/${pairToSymbol[item[2]].pair.token0[1]}/${
                        pairToSymbol[item[2]].pair.token1[1]
                      }`"
                    >
                      {{ pairToSymbol[item[2]].pair.token0[1] }}/{{
                        pairToSymbol[item[2]].pair.token1[1]
                      }}
                    </router-link>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Tx count</span>
                  <span class="margin-left-auto">
                    {{ item[1].count.toString(10) }}
                  </span>
                </div>
                <div class="pair-item pair-item-vol">
                  <span>Vol</span>
                  <span class="margin-left-auto">
                    <span
                      v-if="
                        pairToSymbol[item[2]] &&
                        tokens[
                          pairToSymbol[item[2]].pair.token0[0].toString()
                        ] &&
                        tokens[pairToSymbol[item[2]].pair.token1[0].toString()]
                      "
                      class="stats-info"
                    >
                      <span>
                        {{
                          item[1].vol.value0
                            | bigintToFloat(
                              8,
                              tokens[
                                pairToSymbol[item[2]].pair.token0[0].toString()
                              ].decimals
                            )
                            | formatNum
                        }}
                        {{ pairToSymbol[item[2]].pair.token0[1] }}
                      </span>
                      <span>
                        {{
                          item[1].vol.value1
                            | bigintToFloat(
                              8,
                              tokens[
                                pairToSymbol[item[2]].pair.token1[0].toString()
                              ].decimals
                            )
                            | formatNum
                        }}
                        {{ pairToSymbol[item[2]].pair.token1[1] }}
                      </span>
                    </span>
                    <span v-else>-</span>
                  </span>
                </div>
                <div class="pair-item pair-item-vol">
                  <span>Commission</span>
                  <span class="margin-left-auto">
                    <span
                      v-if="
                        pairToSymbol[item[2]] &&
                        tokens[
                          pairToSymbol[item[2]].pair.token0[0].toString()
                        ] &&
                        tokens[pairToSymbol[item[2]].pair.token1[0].toString()]
                      "
                      class="stats-info"
                    >
                      <span>
                        {{
                          item[1].commission.value0
                            | bigintToFloat(
                              8,
                              tokens[
                                pairToSymbol[item[2]].pair.token0[0].toString()
                              ].decimals
                            )
                            | formatNum
                        }}
                        {{ pairToSymbol[item[2]].pair.token0[1] }}
                      </span>
                      <span>
                        {{
                          item[1].commission.value1
                            | bigintToFloat(
                              8,
                              tokens[
                                pairToSymbol[item[2]].pair.token1[0].toString()
                              ].decimals
                            )
                            | formatNum
                        }}
                        {{ pairToSymbol[item[2]].pair.token1[1] }}
                      </span>
                    </span>
                    <span v-else>-</span>
                  </span>
                </div>
                <div class="pair-item">
                  <span>Latest commission rate</span>
                  <span class="margin-left-auto">
                    {{ item[1].rate }}
                  </span>
                </div>
              </div>
            </div>
          </a-spin>
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
                        v-if="hasReferrer(pair[1].listingReferrers)"
                        :class="{
                          ambassadors: hasReferrer(pair[1].listingReferrers)
                        }"
                      >
                        <a-icon type="like" />
                      </span>
                      <a-icon v-else type="like" @click="onReferrer(pair)" />
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model="ambassadorsvisible"
      width="650px"
      title="About Trading Ambassadors"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <p>
        An account which has completed at least one trade automatically
        qualifies as a trading ambassador and can promote the pair by sharing
        the referral link.
      </p>
      <p class="ambassadors-visible-title">Promoting The Trading Pair</p>
      <p>
        You can go to the "Trading Ambassador" page of each trading pair to get
        a referral link to send it to your friends or post on social media.
      </p>
      <p>Note:</p>
      <p>
        (1) Each promotion is only for one trading pair, the referral link is
        exclusive to that pairing.
      </p>
      <p>
        (2) Each trading account (referee) can submit one trading ambassador
        (referrer) to the contract. A referee must complete at least one trade
        for the setting to take effect.
      </p>
      <p class="ambassadors-visible-title">
        Benefits of Being A Trading Ambassador.
      </p>
      <p>
        The pair will count the number of accounts and the volume of trades from
        your promotion. It is possible for projects to engage in reward programs
        to encourage these activities but these are typically funded by the
        project’s team so not every trading pair has a reward program and its at
        that project’s discretion if they would like to start one on ICDex.
      </p>
      <button
        type="button"
        class="primary ambassadors-visible-button"
        @click="ambassadorsvisible = false"
      >
        Confirm
      </button>
    </a-modal>
    <a-modal
      v-model="boardvisible"
      width="650px"
      title="Market grading rules"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <p>
        ICLighthouse URANUS NFT holders, acting as listing referrers, play a
        pivotal role in influencing the Pair Score through sponsorships. The
        impact of sponsorship varies based on the status of the sponsor and the
        number of sponsors involved:
      </p>
      <p class="mt20">
        <span class="dots"></span> Unverified Listing Referrer Sponsor: Each
        sponsorship adds +10 to the Pair Score.
      </p>
      <p>
        <span class="dots"></span> Verified Listing Referrer Sponsor: Each
        verified sponsorship contributes +15 to the Pair Score.
      </p>
      <p>
        <span class="dots"></span> Group Sponsorship Bonus: If a trading pair is
        supported by 5 or more sponsors, it receives an additional +10 to its
        Pair Score.
      </p>
      <p>
        <span class="dots"></span> Maximum Sponsorship Influence: The total
        score a pair can gain from sponsorships alone is capped at 70.
      </p>
      <p class="ambassadors-visible-title">Upgrade Criteria</p>
      <div class="mt20">
        Trading pairs on ICDex are systematically classified based on their Pair
        Score, which influences their visibility and accessibility to traders.
        Initially, all new trading pairs are assigned to Higher Risk, indicating
        the starting level. Progression through the levels is determined as
        follows:
      </div>
      <p v-if="swapConfig">
        <span class="dots"></span> To RISING (STAGE1): A trading pair must
        achieve a Pair Score of {{ swapConfig.SCORE_G3 }} or higher.
      </p>
      <p v-if="swapConfig">
        <span class="dots"></span> To TOP (STAGE2): A trading pair needs to
        maintain a Pair Score of {{ swapConfig.SCORE_G1 }} or above for a
        minimum duration of one month.
      </p>
      <p class="ambassadors-visible-title">Downgrade Criteria</p>
      <div class="mt20">
        To maintain the integrity and competitiveness of the trading
        environment, trading pairs are subject to downgrade if their performance
        declines:
      </div>
      <p v-if="swapConfig">
        <span class="dots"></span> From TOP to RISING: If a pair’s score falls
        below {{ swapConfig.SCORE_G2 }} and remains there for over three months.
      </p>
      <p v-if="swapConfig">
        <span class="dots"></span> From RISING to HIGH RISK: Should a pair’s
        score drop below {{ swapConfig.SCORE_G4 }} and stay there for more than
        three months.
      </p>
      <button
        type="button"
        class="primary ambassadors-visible-button"
        @click="boardvisible = false"
      >
        Confirm
      </button>
    </a-modal>
    <a-modal
      v-model="scorevisible"
      width="650px"
      title="Pair Scoring Rules"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <p class="ambassadors-visible-title">
        The pair score is calculated as pair_score = score1 + score2 + score3
      </p>
      <p class="ambassadors-visible-title">score1 (max 70)</p>
      <p>
        <span class="dots"></span> Unverified ListingReferrer: Each sponsorship
        from an unverified listing referrer adds +10 to the Pair Score.
      </p>
      <p>
        <span class="dots"></span> Verified ListingReferrer: Sponsorships from
        verified listing referrers contribute +15 to the Pair Score.
      </p>
      <p>
        <span class="dots"></span> Group Sponsorship Bonus: A trading pair
        receiving sponsorship from 5 or more sponsors gains an additional +10 to
        its Pair Score.
      </p>
      <p class="ambassadors-visible-title">score2 (max 20)</p>
      <p>
        <span class="dots"></span> Set a score through DAO proposal. Typically,
        this is scored as 0. Only trading pairs of well-known or special
        contributing projects will have a score set by the proposal. For
        projects launched in SNS, it is recommended to set 5 to 20 points
        depending on the crowd sale capacity.
      </p>
      <p class="ambassadors-visible-title">score3</p>
      <p>
        <span class="dots"></span> (pair_vol_token1_usd / 10000 / max(years, 1))
        ^ 0.5 / 2 + (pair_liquidity_token1_usd / 10000) ^ 0.5 * 2
      </p>
      <button
        type="button"
        class="primary ambassadors-visible-button"
        @click="scorevisible = false"
      >
        Confirm
      </button>
    </a-modal>
    <a-modal
      v-model="sponsoredvisible"
      width="650px"
      title="Sponsor trading pair"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <p style="margin-bottom: 10px">
        ICLighthouse
        <a
          href="https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai"
          target="_blank"
          rel="nofollow noreferrer noopener"
          class="link"
          >URANUS NFT</a
        >
        holders, acting as listing referrers, play a pivotal role in influencing
        the Pair Score through sponsorships. The impact of sponsorship varies
        based on the status of the sponsor and the number of sponsors involved:
      </p>
      <p>
        <span class="dots"></span> Unverified Listing Referrer Sponsor: Each
        sponsorship adds +10 to the Pair Score.
      </p>
      <p>
        <span class="dots"></span> Verified Listing Referrer Sponsor: Each
        verified sponsorship contributes +15 to the Pair Score.
      </p>
      <p>
        <span class="dots"></span> Group Sponsorship Bonus: If a trading pair is
        supported by 5 or more sponsors, it receives an additional +10 to its
        Pair Score.
      </p>
      <p>
        <span class="dots"></span> Maximum Sponsorship Influence: The total
        score a pair can gain from sponsorships alone is capped at 70.
      </p>
      <button
        type="button"
        class="primary ambassadors-visible-button"
        @click="sponsoredvisible = false"
      >
        Confirm
      </button>
    </a-modal>
    <nft-balance
      ref="nftBalance"
      :nft-balance="
        nftRole === 'ListingReferrer' ? nftBalanceListingReferrer : nftBalance
      "
      :nfts="nfts"
      :tokens="tokens"
      :pairs-maker="pairsMaker"
      :listing-referrer="listingReferrer"
      :type="nftRole"
      @depositSuccess="depositSuccess"
      @bindSuccess="bindSuccess"
      @NFTWithdrawSuccess="NFTWithdrawSuccess"
      @setListingReferrerByNftSuccess="setListingReferrerByNftSuccess"
      @proposeSuccess="proposeSuccess"
    ></nft-balance>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MarketMenu, NFTRole } from '@/views/home/ICDex/model';
import {
  ListingReferrers,
  MarketBoard,
  PairTrie,
  PairTrieResponse,
  SwapConfig,
  SwapTokenInfo
} from '@/ic/ICSwapRouter/model';
import { Principal } from '@dfinity/principal';
import { TokenExt, TokensExt } from '@/ic/nft/model';
import { NftService } from '@/ic/nft/Service';
import { namespace } from 'vuex-class';
import { Menu } from '@/components/menu/model';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { AccountId, TokenInfo } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import ApproveNft from '@/components/approveNFT/Index.vue';
import {
  hexToBytes,
  principalToAccountIdentifier,
  toHexString
} from '@/ic/converter';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';
import { NFT } from '@/ic/ICDexRouter/model';
import { makerPoolService } from '@/ic/makerPool/makerPoolService';
import NftBalance from '@/views/home/ICDex/components/NFTBalance.vue';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import {
  BrokerInfo,
  IDOConfig,
  MakerInfo,
  Stats,
  TrieList_3
} from '@/ic/ICDex/model';
import { connectIcx } from '@/ic/connectIcx';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';
import axios from 'axios';
import Launch from '@/views/home/ICDex/components/Launch.vue';
import * as echarts from 'echarts/core';
import { EChartsType } from 'echarts/types/dist/shared';
import { formatAmount } from '@/filters';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { validateAccount } from '@/ic/utils';
import { validateCanister } from '@/utils/validate';

const commonModule = namespace('common');
const canMakerCreateNft = ['NEPTUNE', 'URANUS', 'SATURN'];
const vipMakerNFT = ['NEPTUNE'];

@Component({
  name: 'Info',
  components: {
    AccountInfo,
    ApproveNft,
    NftBalance,
    Launch
  },
  filters: {
    filterIcpVol(val: bigint, decimals: number, icpPrice: string): string {
      return new BigNumber(val.toString(10))
        .div(10 ** decimals)
        .times(icpPrice)
        .decimalPlaces(0)
        .toString(10);
    },
    filterFee(val: string): string {
      if (val) {
        return new BigNumber(val).times(100).toString(10) + '%';
      }
      return '';
    },
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
  private ICDexRouterService: ICDexRouterService;
  private makerPoolService: makerPoolService;
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  private NftService: NftService = null;
  private ICDexService: ICDexService = null;
  private marketMenu: Array<MarketMenu> = [];
  private marketType = 'pairs';
  private pairsTVL: { [key: string]: string } = {};
  private totalTVL = '0';
  private totalVol = '0';
  private Vol24 = '0';
  private pairs: Array<PairTrie> = [];
  private launches: Array<PairTrie> = [];
  private IDOs: Array<[PairTrie, IDOConfig]> = [];
  private pairToSymbol: { [key: string]: PairTrieResponse } = {};
  private total = 0;
  private page = 1;
  private pageLaunch = 1;
  private pageMakers = 1;
  private pageIDOS = 1;
  private pairsOwner: Array<PairTrie> = [];
  private sortType = '';
  private icpPrice = '';
  private BTCPrice = '';
  private ETHPrice = '';
  private otherTokenPrice: { [key: string]: string } = {};
  private listingReferrer: [boolean, boolean] = null;
  private nft: TokenExt = null;
  private currentStep = -1;
  private isH5 = false;
  private ambassadorsvisible = false;
  private boardvisible = false;
  private scorevisible = false;
  private sponsoredvisible = false;
  private swapConfig: SwapConfig = null;
  private menuList: Menu[] = [
    {
      value: 'Trade',
      path: '/ICDex'
    },
    {
      value: 'Pools',
      path: '/ICDex/pools'
    },
    {
      value: 'Mining',
      path: '/Mining'
    },
    {
      value: 'Info',
      path: '/ICDex/info'
    },
    {
      value: 'Competitions',
      path: '/ICDex/competitions'
    }
    // ,
    // {
    //   value: 'Mining',
    //   path: '/icl/tradingMining'
    // }
  ];
  private tokens: { [key: string]: TokenInfo } = {};
  private busy = true;
  private busyIDOs = true;
  private busyLaunch = true;
  private busyMakers = true;
  private loadMore = true;
  private loadMoreIDOs = true;
  private loadMoreLaunch = true;
  private loadMoreMakers = true;
  private spinning = false;
  private tokensExtPool: TokensExt = [];
  private nfts: TokensExt = [];
  private nftRole: NFTRole = null;
  private becomeMakerIndex: number = null;
  private isBecomeMakerHold = false;
  private nftBalance: Array<NFT> = [];
  private nftBalanceListingReferrer: Array<NFT> = [];
  private nftBalancePool: Array<NFT> = [];
  private nftBalanceVip: Array<NFT> = [];
  private makersPairs: Array<string> = [];
  private bindingMakersAll: Array<[Principal, AccountId]> = [];
  private bindingMakers: Array<[Principal, AccountId]> = [];
  private bindingMakersByNFT: {
    [key: string]: { [key: string]: string };
  } = {};
  private bindingMakersLoad = false;
  private bindingBrokersLoad = false;
  private makerInfo: { [key: string]: { [key: string]: MakerInfo } } = {};
  private pairsMaker: Array<PairTrie> = [];
  private currentPair: PairTrie = null;
  private tvlChart: EChartsType;
  private volChart: EChartsType;
  private account = '';
  private accountBroker = '';
  private showSearchAccount = false;
  private showSearchAccountBroker = false;
  private queryForm = {
    owner: '',
    subaccount: '',
    pair: undefined
  };
  private validateSubaccount = (
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void => {
    if (value && !validateAccount(value)) {
      callback('invalid subaccount');
    } else {
      callback();
    }
  };
  private queryFormRules = {
    owner: [
      {
        required: true,
        message: 'Please enter owner',
        trigger: 'blur'
      },
      { validator: validateCanister, trigger: ['change', 'blur'] }
    ],
    subaccount: [
      { validator: this.validateSubaccount, trigger: ['change', 'blur'] }
    ]
  };
  private queryFormBroker = {
    owner: '',
    subaccount: ''
  };
  private queryFormBrokerRules = {
    owner: [
      {
        required: true,
        message: 'Please enter owner',
        trigger: 'blur'
      },
      { validator: validateCanister, trigger: ['change', 'blur'] }
    ],
    subaccount: [
      { validator: this.validateSubaccount, trigger: ['change', 'blur'] }
    ]
  };
  private brokerListAllL: Array<[AccountId, BrokerInfo, string?]> = [];
  private brokerListAll: Array<[AccountId, BrokerInfo, string?]> = [];
  async created(): Promise<void> {
    this.marketMenu = [
      {
        name: 'All pairs',
        value: 'pairs'
      },
      {
        name: 'New launches',
        value: 'newLaunches'
      },
      {
        name: 'IDOs',
        value: 'IDO'
      },
      {
        name: 'Vip-Makers',
        value: 'vip'
      },
      {
        name: 'Brokers',
        value: 'Brokers'
      }
    ];
    const width = document.documentElement.clientWidth;
    if (width <= 768) {
      this.marketMenu = [
        {
          name: 'All pairs',
          value: 'pairs'
        },
        {
          name: 'IDOs',
          value: 'IDO'
        },
        {
          name: 'Vip-Makers',
          value: 'vip'
        },
        {
          name: 'Brokers',
          value: 'Brokers'
        }
      ];
    }
    this.ICDexRouterService = new ICDexRouterService();
    this.makerPoolService = new makerPoolService();
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.NftService = new NftService();
    this.ICDexService = new ICDexService();
    if (this.getPrincipalId) {
      this.getTokensExt();
      await this.NFTBalance();
    }
    this.getBindingMakers();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.getTVL().finally(() => {
      this.getPairs();
    });
    this.getSwapConfig();
    this.getListingReferrer();
    this.getPairsStats();
  }
  private async getPairsStats(): Promise<void> {
    const res = await axios.get(
      'https://gwhbq-7aaaa-aaaar-qabya-cai.raw.icp0.io/v1/stats'
    );
    console.log(res);
    if (res && res.data && res.data.result && res.data.result.length) {
      this.$nextTick(() => {
        this.tvlChart = echarts.init(document.getElementById('info-chart-tvl'));
        this.volChart = echarts.init(document.getElementById('info-chart-vol'));
        const tvlData = [];
        const volData = [];
        const volDataTotal = [];
        let maxTvl = '0';
        let maxVol = '0';
        let maxVolTotal = '0';
        let minVolTotal = '0';
        res.data.result.forEach((item) => {
          tvlData.push([
            echarts.format.formatTime('yyyy-MM-dd', Number(item.time)),
            item.usd_total_tvl
          ]);
          volData.push([
            echarts.format.formatTime('yyyy-MM-dd', Number(item.time)),
            item.usd_24h_vol
          ]);
          volDataTotal.push([
            echarts.format.formatTime('yyyy-MM-dd', Number(item.time)),
            item.usd_total_vol
          ]);
          if (new BigNumber(item.usd_total_tvl).gt(maxTvl)) {
            maxTvl = item.usd_total_tvl;
          }
          if (new BigNumber(item.usd_24h_vol).gt(maxVol)) {
            maxVol = item.usd_24h_vol;
          }
          if (new BigNumber(item.usd_total_vol).gt(maxVolTotal)) {
            maxVolTotal = item.usd_total_vol;
          }
          if (
            minVolTotal === '0' ||
            new BigNumber(item.usd_total_vol).lt(minVolTotal)
          ) {
            minVolTotal = item.usd_total_vol;
          }
        });
        const tvlOption = {
          title: {
            text: 'TVL',
            textStyle: {
              color: '#fff'
            },
            left: 10,
            top: 10
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (param) {
              return (
                '<div>' +
                param[0].data[0] +
                '</div>' +
                '<div>' +
                'TVL: $' +
                formatAmount(BigInt(Math.floor(param[0].data[1])), 0) +
                '</div>'
              );
            }
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: function (value) {
                return echarts.format.formatTime('dd', value);
              }
            },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: function (value) {
                if (new BigNumber(value).eq(0)) {
                  return `$${value}`;
                } else if (new BigNumber(maxTvl).gt(10 ** 12)) {
                  return `$${new BigNumber(value)
                    .div(10 ** 12)
                    .decimalPlaces(2, 1)
                    .toString(10)}T`;
                } else if (new BigNumber(maxTvl).gt(10 ** 9)) {
                  return `$${new BigNumber(value)
                    .div(10 ** 9)
                    .decimalPlaces(2, 1)
                    .toString(10)}B`;
                } else if (new BigNumber(maxTvl).gt(10 ** 6)) {
                  return `$${new BigNumber(value)
                    .div(10 ** 6)
                    .decimalPlaces(2, 1)
                    .toString(10)}M`;
                } else if (new BigNumber(maxTvl).gt(10 ** 3)) {
                  return `$${new BigNumber(value)
                    .div(10 ** 3)
                    .decimalPlaces(2, 1)
                    .toString(10)}K`;
                } else {
                  return `$${value}`;
                }
              }
            }
          },
          series: [
            {
              data: tvlData,
              type: 'line',
              showSymbol: false,
              smooth: true
            }
          ]
        };
        console.log(maxVolTotal);
        console.log(minVolTotal);
        this.tvlChart.setOption(tvlOption);
        const volOption = {
          title: {
            text: 'Volume',
            textStyle: {
              color: '#fff'
            },
            left: 10,
            top: 10
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (param) {
              return (
                '<div>' +
                param[0].data[0] +
                '</div>' +
                '<div> 24h Vol: $' +
                formatAmount(BigInt(Math.floor(param[0].data[1])), 0) +
                '</div>' +
                '<div> Total Vol: $' +
                formatAmount(BigInt(Math.floor(param[1].data[1])), 0) +
                '</div>'
              );
            }
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            },
            axisLabel: {
              interval: 'auto',
              formatter: function (value) {
                return echarts.format.formatTime('dd', value);
              }
            },
            axisTick: {
              show: false
            }
          },
          yAxis: [
            {
              type: 'value',
              position: 'left',
              splitLine: {
                show: false
              },
              axisLabel: {
                formatter: function (value) {
                  if (new BigNumber(value).eq(0)) {
                    return `$${value}`;
                  } else if (new BigNumber(maxVol).gt(10 ** 12)) {
                    return `$${new BigNumber(value)
                      .div(10 ** 12)
                      .decimalPlaces(2, 1)
                      .toString(10)}T`;
                  } else if (new BigNumber(maxVol).gt(10 ** 9)) {
                    return `$${new BigNumber(value)
                      .div(10 ** 9)
                      .decimalPlaces(2, 1)
                      .toString(10)}B`;
                  } else if (new BigNumber(maxVol).gt(10 ** 6)) {
                    return `$${new BigNumber(value)
                      .div(10 ** 6)
                      .decimalPlaces(2, 1)
                      .toString(10)}M`;
                  } else if (new BigNumber(maxVol).gt(10 ** 3)) {
                    return `$${new BigNumber(value)
                      .div(10 ** 3)
                      .decimalPlaces(2, 1)
                      .toString(10)}K`;
                  } else {
                    return `$${value}`;
                  }
                }
              }
            },
            {
              type: 'value',
              position: 'right',
              min: minVolTotal,
              splitLine: {
                show: false
              },
              axisLabel: {
                formatter: function (value) {
                  if (new BigNumber(value).eq(0)) {
                    return `$${value}`;
                  } else if (new BigNumber(maxVolTotal).gt(10 ** 12)) {
                    return `$${new BigNumber(value)
                      .div(10 ** 12)
                      .decimalPlaces(4, 1)
                      .toString(10)}T`;
                  } else if (new BigNumber(maxVolTotal).gt(10 ** 9)) {
                    return `$${new BigNumber(value)
                      .div(10 ** 9)
                      .decimalPlaces(4, 1)
                      .toString(10)}B`;
                  } else if (new BigNumber(maxVolTotal).gt(10 ** 6)) {
                    return `$${new BigNumber(value)
                      .div(10 ** 6)
                      .decimalPlaces(4, 1)
                      .toString(10)}M`;
                  } else if (new BigNumber(maxVolTotal).gt(10 ** 3)) {
                    return `$${new BigNumber(value)
                      .div(10 ** 3)
                      .decimalPlaces(4, 1)
                      .toString(10)}K`;
                  } else {
                    return `$${value}`;
                  }
                }
              }
            }
          ],
          series: [
            {
              data: volData,
              type: 'bar',
              barMaxWidth: 10,
              large: true
            },
            {
              data: volDataTotal,
              type: 'line',
              yAxisIndex: 1,
              lineStyle: {
                color: 'rgb(38, 158, 215)'
              },
              showSymbol: false
            }
          ]
        };
        console.log(volData);
        this.volChart.setOption(volOption);
        window.addEventListener('resize', () => {
          this.tvlChart.resize();
        });
        window.addEventListener('resize', () => {
          this.volChart.resize();
        });
      });
    }
  }
  private setListingReferrerByNftSuccess(): void {
    this.getListingReferrer();
  }
  private proposeSuccess(): void {
    this.getPairListingReferrers();
  }
  private async getPairListingReferrers(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.getPairListingReferrers(
      this.currentPair[0]
    );
    if (res && res[1]) {
      this.$set(this.currentPair[1], 'listingReferrers', res[1]);
    }
  }
  private async getSwapConfig(): Promise<void> {
    this.swapConfig = await this.ICSwapRouterFiduciaryService.getConfig();
  }
  private async connectWallet(): Promise<void> {
    if ((window as any).icx) {
      const icxCanisterIds: Array<string> =
        JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
      const isConnect = await connectIcx(icxCanisterIds);
      if (isConnect) {
        await this.getTokensExt();
        await this.NFTBalance();
      }
      this.getBindingMakers();
    } else {
      await this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    }
  }
  private NFTWithdrawSuccess(): void {
    this.getTokensExt();
    this.NFTBalance().then(() => {
      (this.$refs.nftBalance as any).init();
    });
    this.getBindingMakers();
  }
  private depositSuccess(): void {
    this.getTokensExt();
    this.NFTBalance().then(() => {
      (this.$refs.nftBalance as any).init();
    });
  }
  private async bindSuccess(pair: string, pool: string): Promise<void> {
    this.getBindingMakers();
  }
  private searchMaker(): void {
    this.showSearchAccount = true;
  }
  private searchBroker(): void {
    this.showSearchAccountBroker = true;
  }
  private onBindMaker(
    pair?: string,
    pool?: string,
    index?: number,
    isHold = false
  ): void {
    let bindingMakersLength = 0;
    for (let key in this.bindingMakersByNFT) {
      bindingMakersLength += Object.keys(this.bindingMakersByNFT[key]).length;
    }
    const max = this.nftBalanceVip.length * 5;
    const left = max - bindingMakersLength;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this;
    this.$confirm({
      content: `You've already added ${bindingMakersLength} vip-makers and have ${left} left to add.`,
      class: 'connect-plug register-mining-confirm',
      icon: 'connect-plug',
      okText: 'Confirm',
      centered: true,
      onOk() {
        _that.nftRole = NFTRole.BecomeVipMaker;
        if (pair) {
          _that.becomeMakerIndex = index;
          _that.isBecomeMakerHold = isHold;
        } else {
          _that.becomeMakerIndex = null;
          _that.isBecomeMakerHold = false;
        }
        _that.$nextTick(() => {
          (_that.$refs.nftBalance as any).bindMMPoolInit(pair, pool, null);
        });
      }
    });
  }
  private showSponsored(): void {
    this.sponsoredvisible = true;
  }
  private showScore(): void {
    this.scorevisible = true;
  }
  private showBoard(): void {
    this.boardvisible = true;
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
      // this.getTVL().finally(() => {
      //   this.getPairs();
      // });
    }
    if (menu.value === 'referrers') {
      // this.getListingReferrer();
    }
    if (menu.value === 'PoolMarket') {
      // this.getBindingMakers();
    }
  }
  private async onMakerList(pairs: Array<string>): Promise<void> {
    const promiseAll = [];
    pairs.forEach((pair) => {
      promiseAll.push(this.getMakerList(pair));
    });
    const res: Array<{ pairId: string; makerList: TrieList_3 }> =
      await Promise.all(promiseAll);
    console.log(res);
    res.forEach((item) => {
      this.makerInfo[item.pairId] = {};
      item.makerList.data.forEach((data) => {
        const address = toHexString(new Uint8Array(data[0]));
        this.makerInfo[item.pairId][address] = data[1];
      });
    });
    console.log(this.makerInfo);
  }
  private async getMakerList(
    pair: string
  ): Promise<{ pairId: string; makerList: TrieList_3 }> {
    return await this.ICDexService.makerList(pair);
  }
  private async getBindingMakers(): Promise<void> {
    const makers = [];
    const pairs = [];

    this.bindingMakersLoad = true;
    const res = await this.ICDexRouterService.getVipMakers([]);
    console.log(res);
    if (res && res.length) {
      res.forEach((maker) => {
        if (!pairs.includes(maker[0].toString())) {
          pairs.push(maker[0].toString());
        }
        makers.push(maker);
      });
    }
    for (let i = 0; i < this.nftBalanceVip.length; i++) {
      const NFTId = this.nftBalanceVip[i][1];
      console.log(NFTId);
      const res = await this.ICDexRouterService.NFTBindingMakers(NFTId);
      if (res && res.length) {
        res.forEach((maker) => {
          if (!this.bindingMakersByNFT[maker[0].toString()]) {
            this.bindingMakersByNFT[maker[0].toString()] = {};
          }
          const accountId = toHexString(new Uint8Array(maker[1]));
          if (!this.bindingMakersByNFT[maker[0].toString()][accountId])
            this.bindingMakersByNFT[maker[0].toString()][accountId] = NFTId;
        });
      }
    }
    console.log(this.bindingMakersByNFT);
    console.log(pairs);
    this.makersPairs = pairs;
    this.onMakerList(pairs);
    this.bindingMakersAll = makers;
    this.bindingMakers = makers;
    this.bindingMakersLoad = false;
  }
  private isOwner(item: [Principal, AccountId]): boolean {
    return !!(
      this.bindingMakersByNFT[item[0].toString()] &&
      this.bindingMakersByNFT[item[0].toString()][
        toHexString(new Uint8Array(item[1]))
      ]
    );
  }
  private async onUnbind(item: [Principal, AccountId]): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const res = await this.ICDexRouterService.NFTUnbindMaker(
      this.bindingMakersByNFT[item[0].toString()][
        toHexString(new Uint8Array(item[1]))
      ],
      item[0],
      item[1]
    );
    if (res) {
      this.$message.success('Success');
    } else {
      this.$message.error('Error');
    }
    loading.close();
    this.getBindingMakers();
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
      if (tokensExt && tokensExt.length) {
        console.log(tokensExt);
        for (let i = 0; i < tokensExt.length; i++) {
          const info = this.getExtInfo(tokensExt[i][2]);
          if (info.attributes && info.attributes.length) {
            info.attributes.forEach((item) => {
              console.log(item);
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
        this.tokensExtPool = tokensExt.filter((item) => {
          const info = this.getExtInfo(item[2]);
          let flag = false;
          console.log(info);
          if (info.name) {
            // 'NEPTUNE', 'URANUS', 'SATURN'
            if (
              info.name.includes('NEPTUNE') ||
              info.name.includes('URANUS') ||
              info.name.includes('SATURN')
            ) {
              flag = true;
            }
          }
          return flag;
        });
        console.log(this.tokensExtPool);
      } else {
        //
      }
    } catch (e) {
      console.log(e);
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
    this.nftBalanceListingReferrer =
      await this.ICSwapRouterFiduciaryService.NFTBalance(principal);
  }
  private getExtInfo(val: Array<Array<number>>): any {
    if (val && val.length) {
      return JSON.parse(Buffer.from(val[0]).toString());
    }
    return {};
  }
  // private async getListingReferrer(): Promise<void> {
  //   const principal = localStorage.getItem('principal');
  //   if (principal) {
  //     this.listingReferrer =
  //       await this.ICSwapRouterFiduciaryService.listingReferrer(
  //         Principal.fromText(principal)
  //       );
  //     console.log(this.listingReferrer);
  //     if (!this.listingReferrer[0]) {
  //       await this.getTokensExt();
  //       if (!this.nft) {
  //         this.currentStep = 0;
  //       } else {
  //         this.currentStep = 1;
  //       }
  //     }
  //     if (this.listingReferrer[0] && !this.listingReferrer[1]) {
  //       this.currentStep = 2;
  //     }
  //     if (this.listingReferrer[0] && this.listingReferrer[1]) {
  //       this.getPairsOwner();
  //     }
  //   }
  // }
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
  private async getTVL(): Promise<void> {
    try {
      const res = await axios.get(
        'https://gwhbq-7aaaa-aaaar-qabya-cai.raw.icp0.io/v1/pools/tvls'
      );
      console.log(res);
      let total = '0';
      if (res && res.data && res.data.pairs) {
        res.data.pairs.forEach((res) => {
          if (res.pair && !res.pair.toLocaleString().includes('test')) {
            total = new BigNumber(total).plus(res.tvl).toString(10);
            this.pairsTVL[res.pairId] = res.tvl;
          }
        });
        this.totalTVL = new BigNumber(total).decimalPlaces(0).toString(10);
      }
    } catch (e) {
      console.log(e);
    }
  }
  private onSort(type: string): void {
    this.page = 1;
    if (type === 'vol') {
      if (this.sortType === 'volDown') {
        this.sortType = 'volUp';
      } else {
        this.sortType = 'volDown';
      }
    }
    if (type === 'tvl') {
      if (this.sortType === 'tvlDown') {
        this.sortType = 'tvlUp';
      } else {
        this.sortType = 'tvlDown';
      }
    }
    if (type === 'score') {
      if (this.sortType === 'scoreDown') {
        this.sortType = 'scoreUp';
      } else {
        this.sortType = 'scoreDown';
      }
    }
    if (type === '24') {
      if (this.sortType === '24Down') {
        this.sortType = '24Up';
      } else {
        this.sortType = '24Down';
      }
    }
    if (type === '24Vol') {
      if (this.sortType === '24VolDown') {
        this.sortType = '24VolUp';
      } else {
        this.sortType = '24VolDown';
      }
    }
    this.sort();
  }
  private sort(): void {
    if (this.sortType === 'volDown') {
      this.pairs.sort((a, b) => {
        const token1Symbol = a[1].pair.token1[1];
        const token1Symbol1 = b[1].pair.token1[1];
        if (token1Symbol.toLocaleLowerCase().includes('test')) {
          return 1;
        }
        if (token1Symbol1.toLocaleLowerCase().includes('test')) {
          return -1;
        }
        let aPrice = this.getBasePrice(a[1].pair.token1[1]);
        let bPrice = this.getBasePrice(b[1].pair.token1[1]);
        const vol = this.getVol(a[1], this.tokens, aPrice);
        const vol1 = this.getVol(b[1], this.tokens, bPrice);
        if (new BigNumber(vol1).gt(vol)) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (this.sortType === 'volUp') {
      this.pairs.sort((a, b) => {
        const token1Symbol = a[1].pair.token1[1];
        const token1Symbol1 = b[1].pair.token1[1];
        if (token1Symbol.toLocaleLowerCase().includes('test')) {
          return 1;
        }
        if (token1Symbol1.toLocaleLowerCase().includes('test')) {
          return -1;
        }
        let aPrice = this.getBasePrice(a[1].pair.token1[1]);
        let bPrice = this.getBasePrice(b[1].pair.token1[1]);
        const vol = this.getVol(a[1], this.tokens, aPrice);
        const vol1 = this.getVol(b[1], this.tokens, bPrice);
        if (new BigNumber(vol).gt(vol1)) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (this.sortType === 'tvlDown') {
      this.pairs.sort((a, b) => {
        const token1Symbol = a[1].pair.token1[1];
        const token1Symbol1 = b[1].pair.token1[1];
        if (token1Symbol.toLocaleLowerCase().includes('test') || !a[2]) {
          return 1;
        }
        if (token1Symbol1.toLocaleLowerCase().includes('test') || !b[2]) {
          return -1;
        }
        if (new BigNumber(b[2]).gt(a[2])) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (this.sortType === 'tvlUp') {
      this.pairs.sort((a, b) => {
        const token1Symbol = a[1].pair.token1[1];
        const token1Symbol1 = b[1].pair.token1[1];
        if (token1Symbol.toLocaleLowerCase().includes('test') || !a[2]) {
          return 1;
        }
        if (token1Symbol1.toLocaleLowerCase().includes('test') || !b[2]) {
          return -1;
        }
        if (new BigNumber(a[2]).gt(b[2])) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (this.sortType === 'scoreDown') {
      this.pairs.sort((a, b) => {
        const token1Symbol = a[1].pair.token1[1];
        const token1Symbol1 = b[1].pair.token1[1];
        if (token1Symbol.toLocaleLowerCase().includes('test')) {
          return 1;
        }
        if (token1Symbol1.toLocaleLowerCase().includes('test')) {
          return -1;
        }
        if (
          new BigNumber(b[1].score.toString(10)).gt(a[1].score.toString(10))
        ) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (this.sortType === 'scoreUp') {
      this.pairs.sort((a, b) => {
        const token1Symbol = a[1].pair.token1[1];
        const token1Symbol1 = b[1].pair.token1[1];
        if (token1Symbol.toLocaleLowerCase().includes('test')) {
          return 1;
        }
        if (token1Symbol1.toLocaleLowerCase().includes('test')) {
          return -1;
        }
        if (
          new BigNumber(a[1].score.toString(10)).gt(b[1].score.toString(10))
        ) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (this.sortType === '24Down') {
      this.pairs.sort((a, b) => {
        const token1Symbol = a[1].pair.token1[1];
        const token1Symbol1 = b[1].pair.token1[1];
        if (token1Symbol.toLocaleLowerCase().includes('test')) {
          return 1;
        }
        if (token1Symbol1.toLocaleLowerCase().includes('test')) {
          return -1;
        }
        if (new BigNumber(b[3].change24h).gt(a[3].change24h)) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (this.sortType === '24Up') {
      this.pairs.sort((a, b) => {
        const token1Symbol = a[1].pair.token1[1];
        const token1Symbol1 = b[1].pair.token1[1];
        if (token1Symbol.toLocaleLowerCase().includes('test')) {
          return 1;
        }
        if (token1Symbol1.toLocaleLowerCase().includes('test')) {
          return -1;
        }
        if (new BigNumber(a[3].change24h).gt(b[3].change24h)) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (this.sortType === '24VolDown') {
      this.pairs.sort((a, b) => {
        const token1Symbol = a[1].pair.token1[1];
        const token1Symbol1 = b[1].pair.token1[1];
        if (token1Symbol.toLocaleLowerCase().includes('test')) {
          return 1;
        }
        if (token1Symbol1.toLocaleLowerCase().includes('test')) {
          return -1;
        }
        let aPrice = this.getBasePrice(a[1].pair.token1[1]);
        let bPrice = this.getBasePrice(b[1].pair.token1[1]);
        const vol = this.get24Vol(
          a[3],
          this.tokens,
          a[1].pair.token1[0].toString(),
          aPrice
        );
        const vol1 = this.get24Vol(
          b[3],
          this.tokens,
          b[1].pair.token1[0].toString(),
          bPrice
        );
        if (new BigNumber(vol1).gt(vol)) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (this.sortType === '24VolUp') {
      this.pairs.sort((a, b) => {
        const token1Symbol = a[1].pair.token1[1];
        const token1Symbol1 = b[1].pair.token1[1];
        if (token1Symbol.toLocaleLowerCase().includes('test')) {
          return 1;
        }
        if (token1Symbol1.toLocaleLowerCase().includes('test')) {
          return -1;
        }
        let aPrice = this.getBasePrice(a[1].pair.token1[1]);
        let bPrice = this.getBasePrice(b[1].pair.token1[1]);
        const vol = this.get24Vol(
          a[3],
          this.tokens,
          a[1].pair.token1[0].toString(),
          aPrice
        );
        const vol1 = this.get24Vol(
          b[3],
          this.tokens,
          b[1].pair.token1[0].toString(),
          bPrice
        );
        if (new BigNumber(vol).gt(vol1)) {
          return 1;
        } else {
          return -1;
        }
      });
    }
  }
  private getBasePrice(tokenSymbol: string): string {
    let price = this.icpPrice;
    if (tokenSymbol.toLocaleLowerCase().includes('icp')) {
      price = this.icpPrice;
    } else if (tokenSymbol.toLocaleLowerCase().includes('btc')) {
      price = this.BTCPrice;
    } else if (tokenSymbol.toLocaleLowerCase().includes('eth')) {
      price = this.ETHPrice;
    } else if (
      tokenSymbol.toLocaleLowerCase().includes('usdt') ||
      tokenSymbol.toLocaleLowerCase().includes('usdc')
    ) {
      price = '1';
    } else {
      if (this.otherTokenPrice[tokenSymbol.toLocaleLowerCase()]) {
        price = this.otherTokenPrice[tokenSymbol.toLocaleLowerCase()];
      }
    }
    return price;
  }
  private get24Vol(
    val: Stats,
    tokens: { [key: string]: TokenInfo },
    token: string,
    icpPrice: string
  ): string {
    if (val) {
      return new BigNumber(val.vol24h.value1.toString(10))
        .div(10 ** tokens[token].decimals)
        .times(icpPrice)
        .decimalPlaces(0)
        .toString(10);
    }
    return '0';
  }
  private getVol(
    val: PairTrieResponse,
    tokens: { [key: string]: TokenInfo },
    icpPrice: string
  ): string {
    if (val.liquidity[0]) {
      return new BigNumber(val.liquidity[0].vol.value1.toString(10))
        .div(10 ** tokens[val.pair.token1[0].toString()].decimals)
        .times(icpPrice)
        .decimalPlaces(0)
        .toString(10);
    }
    return '0';
  }
  private async getPairs(): Promise<void> {
    this.busy = true;
    this.spinning = true;
    const promiseValue = [
      fetch('https://pncff-zqaaa-aaaai-qnp3a-cai.raw.ic0.app/2'),
      fetch('https://pncff-zqaaa-aaaai-qnp3a-cai.raw.ic0.app/12'),
      fetch('https://pncff-zqaaa-aaaai-qnp3a-cai.raw.ic0.app/16')
    ];
    const fetchResPromise = await Promise.all(promiseValue);
    console.log(fetchResPromise);
    const fetchRes = fetchResPromise[0];
    if (fetchRes && fetchRes.status === 200) {
      const icpRes = await fetchRes.json();
      this.icpPrice = (icpRes as any).success[0].rate;
      console.log(this.icpPrice);
    }
    const BTCfetchRes = fetchResPromise[1];
    if (BTCfetchRes && BTCfetchRes.status === 200) {
      const BTCRes = await BTCfetchRes.json();
      this.BTCPrice = (BTCRes as any).success[0].rate;
      console.log(this.BTCPrice);
    }
    const ETHfetchRes = fetchResPromise[2];
    if (ETHfetchRes && ETHfetchRes.status === 200) {
      const ETHRes = await ETHfetchRes.json();
      this.ETHPrice = (ETHRes as any).success[0].rate;
      console.log(this.ETHPrice);
    }
    const res = await this.ICSwapRouterFiduciaryService.getPairs2(['icdex']);
    if (res && res.data && res.data.length) {
      this.sortType = 'scoreDown';
      this.pairs = res.data.concat([]).sort((a, b) => {
        return Number(b[1].score) - Number(a[1].score);
      });
      await this.getTokenDecimals();
      res.data.forEach((item) => {
        const id = `${item[1].pair.token0[0].toString()}_${item[1].pair.token1[0].toString()}`;
        if (this.pairsTVL[id]) {
          item[2] = this.pairsTVL[id];
        }
        this.pairToSymbol[item[0].toString()] = item[1];
        const token1Symbol = item[1].pair.token1[1];
        if (
          (token1Symbol.toLocaleLowerCase() === 'icp' ||
            token1Symbol.toLocaleLowerCase().includes('eth') ||
            token1Symbol.toLocaleLowerCase().includes('btc')) &&
          !this.otherTokenPrice[item[1].pair.token0[1].toLocaleLowerCase()]
        ) {
          const price = this.getPrice(item[1]);
          if (token1Symbol.toLocaleLowerCase() === 'icp') {
            this.otherTokenPrice[item[1].pair.token0[1].toLocaleLowerCase()] =
              new BigNumber(price).times(this.icpPrice).toString(10);
          } else if (token1Symbol.toLocaleLowerCase() === 'eth') {
            this.otherTokenPrice[item[1].pair.token0[1].toLocaleLowerCase()] =
              new BigNumber(price).times(this.ETHPrice).toString(10);
          } else if (token1Symbol.toLocaleLowerCase() === 'btc') {
            this.otherTokenPrice[item[1].pair.token0[1].toLocaleLowerCase()] =
              new BigNumber(price).times(this.BTCPrice).toString(10);
          }
        }
        if (
          token1Symbol.toLocaleLowerCase().includes('usdt') ||
          token1Symbol.toLocaleLowerCase().includes('usdc')
        ) {
          this.otherTokenPrice[item[1].pair.token0[1].toLocaleLowerCase()] =
            this.getPrice(item[1]);
        }
      });
      this.launches = res.data
        .concat([])
        .filter((item) => {
          const time = new Date().getTime();
          const m = 86400 * 30 * 6;
          return new BigNumber(time)
            .div(1000)
            .minus(m)
            .lt(item[1].createdTime.toString(10));
        })
        .sort((a, b) => {
          return Number(b[1].createdTime) - Number(a[1].createdTime);
        });
      this.pairsMaker = res.data.concat([]).sort((a, b) => {
        return a[1].pair.token0[1].localeCompare(b[1].pair.token0[1]);
      });
      this.total = this.pairs.length;
      let total = '0';
      let Vol24 = '0';
      try {
        const res = await axios.get(
          'https://gwhbq-7aaaa-aaaar-qabya-cai.raw.icp0.io/v1/latest'
        );
        console.log(res);
        if (res && res.data) {
          for (let key in res.data) {
            const totalVol = res.data[key].usd_volume;
            Vol24 = new BigNumber(Vol24)
              .plus(res.data[key].usd_24h_volume)
              .toString(10);
            total = new BigNumber(total).plus(totalVol).toString(10);
          }
        }
      } catch (e) {
        console.log(e);
      }
      this.totalVol = new BigNumber(total).decimalPlaces(0).toString(10);
      this.Vol24 = new BigNumber(Vol24).decimalPlaces(0).toString(10);
      console.log(this.Vol24);
      this.getIDOs();
      this.getStats();
    } else {
      this.pairs = [];
      this.pairsMaker = [];
    }
    console.log(this.otherTokenPrice);
    console.log(this.pairs);
    this.spinning = false;
    this.busy = false;
    this.getBrokerList();
  }
  private async getBrokerList(): Promise<void> {
    this.bindingBrokersLoad = true;
    this.brokerListAll = [];
    this.brokerListAllL = [];
    const promiseValue = [];
    this.pairs.forEach((item) => {
      promiseValue.push(this.brokerList(item[0].toString()));
    });
    await Promise.all(promiseValue);
    console.log(this.brokerListAllL);
    this.brokerListAll = this.brokerListAllL;
    this.bindingBrokersLoad = false;
  }
  private async brokerList(pairId: string): Promise<void> {
    const res = await this.ICDexService.brokerList(pairId);
    if (res && res.data) {
      const info: any = res.data.map((item) => {
        return item.concat(pairId);
      });
      this.brokerListAllL = this.brokerListAllL.concat(info);
    }
  }
  private getBoard(marketBoard: Array<MarketBoard>): string {
    let board = 'STAGE0';
    if (marketBoard && marketBoard.length) {
      board = Object.keys(marketBoard[0])[0];
    }
    if (board === 'STAGE2') {
      return 'Main';
    } else if (board === 'STAGE1') {
      return 'RISING';
    } else {
      return 'HIGH RISK';
    }
  }
  private async getIDOs(): Promise<void> {
    const MAX_CONCURRENCY = 40;
    this.IDOs = [];
    let promiseValue = [];
    if (this.launches.length) {
      for (let i = 0; i < this.launches.length; i++) {
        promiseValue.push(this.getIDOConfig(this.launches[i]));
        if (promiseValue.length === MAX_CONCURRENCY) {
          await Promise.all(promiseValue);
          promiseValue = [];
        }
        if (i === this.launches.length - 1 && promiseValue.length) {
          await Promise.all(promiseValue);
          promiseValue = [];
        }
      }
    }
    console.log(this.IDOs);
  }
  private async getIDOConfig(pair: PairTrie): Promise<void> {
    const res = await this.ICDexService.IDO_getConfig(pair[0].toString());
    if (res && res[0] && res[1] && res[1].IDOOpeningTime) {
      this.IDOs.push([pair, res]);
    }
  }
  private pageChange(page: number): void {
    this.page = page;
    this.getTokenDecimals();
  }
  private pageLaunchChange(page: number): void {
    this.pageLaunch = page;
    this.getTokenDecimals();
  }
  private pageIDOsChange(page: number): void {
    this.pageIDOS = page;
    this.getTokenDecimals();
  }
  private async getStats(): Promise<void> {
    const pairs = this.pairs.slice((this.page - 1) * 100, this.page * 100);
    const MAX_CONCURRENCY = 40;
    let promiseValue = [];
    for (let i = 0; i < pairs.length; i++) {
      promiseValue.push(this.getPairStats(pairs[i]));
      if (promiseValue.length === MAX_CONCURRENCY) {
        await Promise.all(promiseValue);
        promiseValue = [];
      }
      if (i === this.launches.length - 1 && promiseValue.length) {
        await Promise.all(promiseValue);
        promiseValue = [];
      }
    }
  }
  private async getPairStats(pair: PairTrie): Promise<void> {
    const res = await this.ICDexService.stats(pair[0].toString());
    this.$set(pair, 3, res.stats);
  }
  private async getTokenDecimals(): Promise<void> {
    const pairs = this.pairs.slice((this.page - 1) * 100, this.page * 100);
    const MAX_CONCURRENCY = 40;
    const tokens = [];
    let promiseValue = [];
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const token0 = pair[1].pair.token0[0].toString();
      const token1 = pair[1].pair.token1[0].toString();
      if (
        !this.tokens[token0] ||
        (this.tokens[token0] &&
          !this.tokens[token0].decimals &&
          this.tokens[token0].decimals !== 0)
      ) {
        if (!tokens.includes(token0)) {
          tokens.push(token0);
          promiseValue.push(this.getDecimals(pair[1].pair.token0));
        }
      }
      if (
        !this.tokens[token1] ||
        (this.tokens[token1] &&
          !this.tokens[token1].decimals &&
          this.tokens[token1].decimals !== 0)
      ) {
        if (!tokens.includes(token1)) {
          tokens.push(token1);
          promiseValue.push(this.getDecimals(pair[1].pair.token1));
        }
      }
      if (promiseValue.length === MAX_CONCURRENCY) {
        await Promise.all(promiseValue);
        promiseValue = [];
      }
      if (i === pairs.length - 1 && promiseValue.length) {
        await Promise.all(promiseValue);
        promiseValue = [];
      }
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
    if (
      std &&
      (std.toLocaleLowerCase() === 'icrc1' ||
        std.toLocaleLowerCase() === 'icrc2')
    ) {
      this.tokens[token[0].toString()].decimals = await DRC20Token.icrcDecimals(
        token[0].toString()
      );
    }
    if (std && std.toLocaleLowerCase() === 'dip20') {
      const info = await DRC20Token.getMetadata(token[0].toString());
      this.tokens[token[0].toString()].decimals = info.decimals;
    }
  }
  private getPrice(pair: PairTrieResponse): string {
    if (pair.liquidity.length) {
      const token0 = pair.pair.token0[0].toString();
      const token1 = pair.pair.token1[0].toString();
      return new BigNumber(pair.liquidity[0].price.toString(10))
        .div(10 ** this.tokens[token1].decimals)
        .div(
          new BigNumber(pair.liquidity[0].unitSize.toString(10)).div(
            10 ** this.tokens[token0].decimals
          )
        )
        .decimalPlaces(this.tokens[token0].decimals)
        .toString(10);
    }
    return '';
  }
  private getIDOPrice(
    price: BigInt,
    token0Decimals: number,
    token1Decimals: number,
    unitSize: bigint
  ): string {
    return new BigNumber(price.toString(10))
      .div(10 ** token1Decimals)
      .div(new BigNumber(unitSize.toString(10)).div(10 ** token0Decimals))
      .decimalPlaces(token0Decimals)
      .toString(10);
  }
  private get24(change: string): string {
    return new BigNumber(change).times(100).decimalPlaces(2, 1).toString(10);
  }
  private hasReferrer(listingReferrers: ListingReferrers): boolean {
    if (listingReferrers && listingReferrers.length && this.getPrincipalId) {
      return listingReferrers.some((item) => {
        return item[0].referrer.toString() === this.getPrincipalId;
      });
    }
    return false;
  }
  private async onReferrer(pair: PairTrie): Promise<void> {
    if (!this.getPrincipalId) {
      return;
    }
    if (this.hasReferrer(pair[1].listingReferrers)) {
      this.$message.info("You've already sponsored the pair.");
      return;
    }
    if (
      this.listingReferrer &&
      (!this.listingReferrer[0] || !this.listingReferrer[1])
    ) {
      this.nftRole = NFTRole.ListingReferrer;
      this.$nextTick(() => {
        this.currentPair = pair;
        (this.$refs.nftBalance as any).init();
        (this.$refs.nftBalance as any).visible = true;
        (this.$refs.nftBalance as any).pair = pair;
      });
    }
  }
  private async getListingReferrer(): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICSwapRouterFiduciaryService.listingReferrer(
        Principal.fromText(this.getPrincipalId)
      );
      console.log(res);
      this.listingReferrer = res;
    }
  }
  private handleInfiniteOnLoadMakers(): void {
    const width = document.documentElement.clientWidth;
    if (width > 768) {
      return;
    }
    if (!this.busyMakers) {
      console.log('handleInfiniteOnLoadMakers');
      this.busyMakers = true;
      if (this.pageMakers * 10 < this.bindingMakers.length) {
        setTimeout(() => {
          this.pageMakers++;
          this.busyMakers = false;
        }, 100);
      } else {
        this.busyMakers = false;
        this.loadMoreMakers = false;
      }
    }
  }
  private handleInfiniteOnLoadLaunch(): void {
    const width = document.documentElement.clientWidth;
    if (width > 768) {
      return;
    }
    if (!this.busyLaunch) {
      console.log('handleInfiniteOnLoad');
      this.busyLaunch = true;
      if (this.pageLaunch * 10 < this.launches.length) {
        setTimeout(() => {
          this.pageLaunch++;
          this.busyLaunch = false;
        }, 100);
      } else {
        this.busyLaunch = false;
        this.loadMoreLaunch = false;
      }
    }
  }
  private handleInfiniteOnLoadIDOs(): void {
    const width = document.documentElement.clientWidth;
    if (width > 768) {
      return;
    }
    if (!this.busyIDOs) {
      console.log('handleInfiniteOnLoad');
      this.busyIDOs = true;
      if (this.pageIDOS * 10 < this.IDOs.length) {
        setTimeout(() => {
          this.pageIDOS++;
          this.busyIDOs = false;
        }, 100);
      } else {
        this.busyIDOs = false;
        this.loadMoreIDOs = false;
      }
    }
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
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private hideAccount(): void {
    this.bindingMakers = this.bindingMakersAll;
    this.showSearchAccount = false;
    (this.$refs.queryForm as any).resetFields();
    this.queryForm.pair = undefined;
    this.account = '';
  }
  private hideAccountBroker(): void {
    this.brokerListAll = this.brokerListAllL;
    this.showSearchAccountBroker = false;
    (this.$refs.queryFormBroker as any).resetFields();
    this.accountBroker = '';
  }
  private queryAccount(): void {
    (this.$refs.queryForm as any).validate(async (valid: any) => {
      if (valid) {
        let subaccount = [];
        let accountId = '';
        if (this.queryForm.subaccount) {
          subaccount = hexToBytes(this.queryForm.subaccount);
          accountId = principalToAccountIdentifier(
            Principal.fromText(this.queryForm.owner),
            new Uint8Array(subaccount)
          );
        } else {
          accountId = principalToAccountIdentifier(
            Principal.fromText(this.queryForm.owner)
          );
        }
        this.account = accountId;
        this.bindingMakers = this.bindingMakersAll.filter((item) => {
          if (!this.queryForm.pair) {
            return toHexString(new Uint8Array(item[1])) === this.account;
          } else {
            return (
              item[0].toString() === this.queryForm.pair &&
              toHexString(new Uint8Array(item[1])) === this.account
            );
          }
        });
      }
    });
  }
  private queryAccountBroker(): void {
    (this.$refs.queryFormBroker as any).validate(async (valid: any) => {
      if (valid) {
        let subaccount = [];
        let accountId = '';
        if (this.queryFormBroker.subaccount) {
          subaccount = hexToBytes(this.queryFormBroker.subaccount);
          accountId = principalToAccountIdentifier(
            Principal.fromText(this.queryFormBroker.owner),
            new Uint8Array(subaccount)
          );
        } else {
          accountId = principalToAccountIdentifier(
            Principal.fromText(this.queryFormBroker.owner)
          );
        }
        this.accountBroker = accountId;
        this.brokerListAll = this.brokerListAllL.filter((item) => {
          return toHexString(new Uint8Array(item[0])) === this.accountBroker;
        });
      }
    });
  }
  private times2(val: bigint): bigint {
    return BigInt(new BigNumber(val.toString(10)).times(2).toString(10));
  }
}
</script>

<style scoped lang="scss">
.makers-header {
  display: flex;
  align-items: center;
  button {
    width: 190px;
  }
}
.info-chart-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  margin-bottom: 20px;
  > div {
    height: 300px;
    width: 50%;
    background: #131920;
    border-radius: 10px;
    &:first-child {
      margin-right: 10px;
    }
    &:last-child {
      margin-left: 10px;
    }
  }
}
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
  height: 60px;
  margin-bottom: 40px;
  background: rgba(27, 36, 46, 0.8);
  color: #adb3c4;
  .market-menu-info {
    margin-left: 20px;
    span {
      padding-right: 10px;
    }
  }
  div.margin-left-auto div {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    font-size: 14px;
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      color: #51b7c3;
    }
    &.active {
      border-radius: 30px;
      background: rgba(36, 67, 78, 0.8);
      color: #51b7c3;
    }
  }
}
.table-main,
.referrers-main {
  background: #131920;
  border: 1px solid #131920;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px 10px 40px;
  font-size: 12px;
  a {
    color: #166a89;
  }
  table {
    min-height: 200px;
  }
}
.pools-page {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  line-height: 1.5;
  span {
    &:last-child {
      text-align: right;
    }
  }
}
.market-main-container {
  padding: 0 20px;
}
.stats-info {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
}
.sort-table-main {
  display: flex;
  align-items: center;
  justify-content: right;
}
.sort-table {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
  margin-top: -5px;
  i {
    font-size: 12px;
    height: 8px;
    color: #646e79;
    &.active {
      color: #0862bc;
    }
  }
}
.search-token {
  ::v-deep .ant-select-selection__clear {
    background: none;
    color: #636c73;
  }
}
.dots {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-bottom: 1px;
  border-radius: 3px;
  background: #adb3c4;
}
.STAGE2 {
  color: #65aef1;
}
.STAGE1 {
  color: #e1e10e;
}
.STAGE0 {
  color: #df9708;
}
.pc-show {
  display: block;
}
.h5-show {
  display: none;
}
.show-total-pc {
  display: block;
}
.show-total-h5 {
  display: none;
}
@media screen and (max-width: 1200px) {
  .show-total-pc {
    display: none;
  }
  .show-total-h5 {
    display: block;
  }
}
@media screen and (max-width: 768px) {
  .market-main-container {
    padding: 0;
  }
  .table-main,
  .referrers-main-pool {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    color: #adb3c4;
    padding: 0 0 30px 0;
  }
  .makers-header {
    padding: 0 10px 10px;
  }
  .pair-main-scroll {
    max-height: calc(100vh - 120px);
    min-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 10px;
  }
  .pair-main {
    margin-bottom: 10px;
    background: #131920;
    border: 1px solid #131920;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 10px;
  }
  .pair-item-vol {
    margin-top: 10px;
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
    padding: 0;
  }
  .market-menu {
    div.margin-left-auto {
      justify-content: space-between;
      div {
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        font-size: 12px;
      }
    }
  }
}
.background-table-form {
  position: relative;
  max-width: 1100px;
  margin-left: auto;
  i {
    position: absolute;
    right: 2px;
    top: 2px;
    font-size: 16px;
    cursor: pointer;
  }
  form {
    margin-bottom: 5px;
    padding: 10px;
    border-radius: 3px;
    box-shadow: 0 0 10px #000;
  }
}
.round-account-form {
  display: flex;
  flex-direction: column;
  > div {
    display: flex;
    align-items: flex-end;
  }
  input {
    width: 450px;
    margin-right: 10px;
  }
}
</style>
