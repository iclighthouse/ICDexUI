<template>
  <div class="icdex-main" :class="{ 'icdex-main-modal': showTrade }">
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
        <!--<li
          v-if="
            hostname &&
            hostname !== 'avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app' &&
            hostname !== 'pk6zh-iiaaa-aaaaj-ainda-cai.raw.ic0.app'
          "
        >
          <a
            :href="
              hostHref.replace(
                hostname,
                'avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app'
              )
            "
            target="_blank"
            rel="nofollow noreferrer noopener"
            >OldVersion</a
          >
        </li>-->
      </ul>
      <account-info :menu-list="menuList"></account-info>
    </div>
    <div
      class="de-swap-main"
      :class="{
        'show-paris': showParis || showTrade,
        'de-swap-main-trade-competitions-menu': tradeCompetitionsMenu
      }"
    >
      <div class="de-swap-info">
        <div
          class="de-swap-list pc-show"
          :class="{
            'has-register-competition': showKeepBalance,
            'show-stop-loss': orderType === 'Stop-loss'
          }"
        >
          <div class="de-swap-list-item">
            <ul class="trade-market-sort">
              <li
                :class="{
                  active: item.name === currentTradeMarketSort,
                  'trade-market-old': item.name === 'Old'
                }"
                v-for="item in tradeMarketSort"
                :key="item.value"
                @click="changeTradeMarketSort(item)"
              >
                {{ item.name }}
                <span v-if="item.name === 'USDT'" class="base-red">TEST</span>
              </li>
            </ul>
            <table>
              <thead>
                <tr>
                  <th style="width: 100px">Pair</th>
                  <th>Price</th>
                  <th class="text-right">Vol(24h/total)</th>
                </tr>
              </thead>
              <tbody
                class="de-swap-list-item-pair de-swap-list-item-pair-market"
                ref="deSwapListItemPair"
              >
                <tr
                  v-for="(pair, index) in tradePairs[currentTradeMarketSort]"
                  :key="index"
                  @click="changePair(pair, index)"
                  :class="{
                    active:
                      pair[1][0].canisterId.toString() ===
                      pairs[currentPairIndex][1][0].canisterId.toString()
                  }"
                >
                  <a-tooltip placement="right">
                    <template slot="title">
                      <dl>
                        <dt>
                          <span
                            class="tabular-nums"
                            v-if="
                              tokens &&
                              tokens[pair[1][0].token1[0].toString()] &&
                              pair[2]
                            "
                          >
                            24h: ${{
                              pair[2].vol24h.value1
                                | icpToUsdt(
                                  currentMarketPrice,
                                  pair[1][0].token1[1],
                                  tokens[pair[1][0].token1[0].toString()]
                                    .decimals
                                )
                                | formatNum
                            }}
                          </span>
                        </dt>
                        <dd>
                          <span
                            class="tabular-nums"
                            v-if="
                              tokens &&
                              tokens[pair[1][0].token1[0].toString()] &&
                              pair[2]
                            "
                          >
                            Total: ${{
                              pair[2].totalVol.value1
                                | icpToUsdt(
                                  currentMarketPrice,
                                  pair[1][0].token1[1],
                                  tokens[pair[1][0].token1[0].toString()]
                                    .decimals
                                )
                                | formatNum
                            }}
                          </span>
                        </dd>
                      </dl>
                    </template>
                    <div
                      style="display: table; width: 100%; table-layout: fixed"
                    >
                      <td style="width: 100px">
                        <dl>
                          <dt
                            :class="{
                              'usdt-test-dt': currentTradeMarketSort === 'USDT'
                            }"
                          >
                            {{ pair[1][0].token0[1]
                            }}<span class="pair-icp"
                              >/{{ pair[1][0].token1[1] }}</span
                            >
                          </dt>
                          <dd>
                            <span v-show="oldPairs.includes(pair[0].toString())"
                              >(Old)</span
                            >
                          </dd>
                        </dl>
                      </td>
                      <td>
                        <dl>
                          <dt>
                            <span
                              class="tabular-nums"
                              v-if="
                                tokens &&
                                tokens[pair[1][0].token0[0].toString()] &&
                                tokens[pair[1][0].token1[0].toString()] &&
                                pair[2]
                              "
                            >
                              {{
                                pair[2].price
                                  | filterPairTokenPrice(
                                    tokens[pair[1][0].token0[0].toString()]
                                      .decimals,
                                    tokens[pair[1][0].token1[0].toString()]
                                      .decimals
                                  )
                              }}
                            </span>
                          </dt>
                          <dd>
                            <span
                              :class="{
                                'bid-pair-price': Number(pair[2].change24h) > 0,
                                'ask-pair-price': Number(pair[2].change24h) < 0
                              }"
                              class="tabular-nums"
                              v-if="pair[2]"
                            >
                              {{ pair[2].change24h | filterChange }}%
                            </span>
                          </dd>
                        </dl>
                      </td>
                      <td class="text-right">
                        <dl>
                          <dt>
                            <span
                              class="tabular-nums"
                              v-if="
                                tokens &&
                                tokens[pair[1][0].token1[0].toString()] &&
                                pair[2]
                              "
                            >
                              {{
                                pair[2].vol24h.value1
                                  | bigintToFloat(
                                    2,
                                    tokens[pair[1][0].token1[0].toString()]
                                      .decimals
                                  )
                                  | formatNum
                              }}
                            </span>
                          </dt>
                          <dd>
                            <span
                              class="tabular-nums"
                              v-if="
                                tokens &&
                                tokens[pair[1][0].token1[0].toString()] &&
                                pair[2]
                              "
                            >
                              {{
                                pair[2].totalVol.value1
                                  | bigintToFloat(
                                    2,
                                    tokens[pair[1][0].token1[0].toString()]
                                      .decimals
                                  )
                                  | formatNum
                              }}
                            </span>
                          </dd>
                        </dl>
                      </td>
                    </div>
                  </a-tooltip>
                </tr>
              </tbody>
            </table>
          </div>
          <ul class="de-swap-list-trade-menu">
            <li class="active">Market Trades</li>
          </ul>
          <div class="de-swap-list-item">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>
                    Price
                    <!--<span
								v-if="
									currentPair &&
									tokens &&
									tokens[currentPair[1][0].token1[0].toString()]
								"
								>({{ currentPair[1][0].token1[1] }})</span
							>-->
                  </th>
                  <th class="text-right">
                    Quantity
                    <!--<span
								v-if="
									currentPair &&
									tokens &&
									tokens[currentPair[1][0].token0[0].toString()]
								"
								>({{ currentPair[1][0].token0[1] }})</span
							>-->
                  </th>
                  <!--<th class="text-right">Time</th>-->
                </tr>
              </thead>
              <tbody class="de-swap-list-item-pair-trade">
                <tr
                  :class="{ animation: isLatestFilledRecordChange }"
                  v-for="(item, index) in latestFilledRecord"
                  :key="index"
                >
                  <td>{{ item[0] | filterTime }}</td>
                  <td>
                    <span
                      v-if="
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()] &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                      class="tabular-nums"
                      :class="{
                        'bid-price':
                          getTradeSide(item[2].token0Value) === 'Buy',
                        'ask-price':
                          getTradeSide(item[2].token0Value) === 'Sell'
                      }"
                      >{{
                        item[2]
                          | filterLatestPrice(
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            buyUnit
                          )
                      }}</span
                    >
                  </td>
                  <td class="text-right">
                    <span
                      class="tabular-nums"
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                      >{{
                        Object.values(item[2].token0Value)[0]
                          | filterLatestAmount(
                            tokenMinUnit,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                      }}</span
                    >
                  </td>
                  <!--<td class="text-right"></td>-->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="trade-main">
          <div class="k-interval-main">
            <div class="k-interval-main-header pc-show">
              <span
                class="k-interval-main-header-name"
                v-if="
                  currentPair &&
                  tokens &&
                  tokens[currentPair[1][0].token0[0].toString()] &&
                  tokens[currentPair[1][0].token1[0].toString()]
                "
              >
                <a-tooltip placement="top">
                  <template slot="title"
                    >{{
                      tokens[currentPair[1][0].token0[0].toString()].name
                    }}({{ currentPair[1][0].token0[0].toString() }})</template
                  >{{
                    tokens[currentPair[1][0].token0[0].toString()].symbol
                  }}</a-tooltip
                >/{{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
              </span>
              <ul class="k-interval-time">
                <li
                  :class="{ active: currentKInterval.value === item.value }"
                  v-for="(item, index) in kIntervalList"
                  :key="index"
                  @click="changeKIntervalList(item)"
                >
                  <span>{{ item.value }}</span>
                </li>
              </ul>
              <!--<a-icon
                v-show="tradeCompetitionsMenu"
                class="back-icon"
                type="arrow-left"
              />-->
              <ul class="trade-competitions-enum margin-left-auto">
                <li
                  @click="changeTradeCompetitionsMenu(item)"
                  :class="{ active: tradeCompetitionsMenu === item }"
                  v-for="(item, index) in tradeCompetitionsEnum"
                  :key="index"
                >
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
            <div class="k-interval-main-header-h5 h5-show">
              <div class="k-interval-main-header-h5-left">
                <div
                  @click="onShowParis"
                  class="k-interval-main-header-h5-left-name"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}/{{
                    tokens[currentPair[1][0].token1[0].toString()].symbol
                  }}
                  <span
                    style="color: #929aa5; font-size: 12px; padding-right: 5px"
                    v-show="oldPairs.includes(currentPair[0].toString())"
                    >(Old)</span
                  >
                  <a-icon type="caret-down" />
                </div>
                <div class="current-icp-price">
                  <span class="token-price" :class="tokenPriceStatus">
                    {{ currentTokenPrice }}
                  </span>
                  <!--<span v-show="icpPrice">${{ token0Price }}</span>-->
                </div>
              </div>
              <div class="k-interval-main-header-h5-right margin-left-auto">
                <!--<div>
                  <span>24h High</span>
                  <span v-if="dayInfo">{{ dayInfo.highest }}</span>
                </div>
                <div>
                  <span>24h Low</span>
                  <span v-if="dayInfo">{{ dayInfo.lowest }}</span>
                </div>-->
                <div>
                  <span>24h Volume</span>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      currentPair[2] &&
                      tokens[currentPair[1][0].token1[0].toString()]
                    "
                  >
                    {{
                      currentPair[2].vol24h.value1
                        | bigintToFloat(
                          2,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                </div>
                <div>
                  <span>24h Change</span>
                  <span
                    :class="{
                      'bid-pair-price': Number(currentPair[2].change24h) > 0,
                      'ask-pair-price': Number(currentPair[2].change24h) < 0
                    }"
                    class="tabular-nums"
                    v-if="currentPair && currentPair[2]"
                  >
                    {{ currentPair[2].change24h | filterChange }}%
                  </span>
                </div>
              </div>
            </div>
            <div class="k-interval-main-header h5-show">
              <ul class="k-interval-time">
                <li
                  :class="{ active: currentKInterval.value === item.value }"
                  v-for="(item, index) in kIntervalList"
                  :key="index"
                  @click="changeKIntervalList(item)"
                >
                  <span>{{ item.value }}</span>
                </li>
              </ul>
            </div>
            <div
              v-loading="chartSpinning"
              element-loading-background="rgba(0, 0, 0, 0)"
              class="kInterval-chart-h5-hide kInterval-chart-h5"
            >
              <div id="kInterval-chart" ref="kIntervalChart"></div>
            </div>
            <div class="k-interval-main-header-menu-h5 h5-show">
              <ul>
                <li
                  v-for="menu in h5Menu"
                  :key="menu.name"
                  :class="{ active: currentMenu === menu.name }"
                  @click="changeMenu(menu)"
                >
                  {{ menu.value }}
                </li>
                <li
                  @click="changeTradeCompetitionsMenu(item)"
                  :class="{ active: tradeCompetitionsMenu === item }"
                  v-for="(item, index) in tradeCompetitionsEnum"
                  :key="index"
                >
                  <span>{{ item }}</span>
                </li>
                <li
                  @click="changeTradeCompetitionsMenu('Competitions')"
                  :class="{ active: tradeCompetitionsMenu === 'Competitions' }"
                >
                  <span>Competitions</span>
                </li>
              </ul>
              <!--<trading-mining
                class="margin-left-auto trading-mining"
                ref="tradingMiningH5"
                v-if="currentPair"
                :pair-id="currentPair[0].toString()"
              ></trading-mining>-->
              <!-- <trading-competitions
                ref="tradingCompetitionH5"
                v-if="currentPair"
                :pair-id="currentPair[0].toString()"
                @registerSuccess="registerSuccess"
                @jumpCompetitions="jumpCompetitions"
              ></trading-competitions>-->
            </div>
            <div
              v-show="isH5 && currentMenu === 'orderBook'"
              class="order-book-type-list-h5"
            >
              <div class="order-book-type-list">
                <div
                  v-for="(item, index) in orderBookTypeList"
                  :key="index"
                  @click="changeOrderBookType(item)"
                  :class="{ active: item.key === orderBookType }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="css-1iztezc"
                    :class="{ active: item.key === orderBookType }"
                  >
                    <path
                      v-if="item.key === 'All'"
                      d="M4 4h7v7H4V4z"
                      fill="#F6465D"
                    ></path>
                    <path
                      v-if="item.key === 'All'"
                      d="M4 13h7v7H4v-7z"
                      fill="#0ECB81"
                    ></path>
                    <path
                      v-if="item.key === 'Sell'"
                      d="M4 4h7v16H4V4z"
                      fill="#F6465D"
                    ></path>
                    <path
                      v-if="item.key === 'Buy'"
                      d="M4 4h7v16H4v-7z"
                      fill="#0ECB81"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div
                  v-if="currentSize"
                  class="order-book-tick-size margin-left-auto base-font-title"
                >
                  <a-dropdown
                    placement="bottomCenter"
                    overlayClassName="tick-size-dropdown"
                    :trigger="['click']"
                  >
                    <span class="pointer"
                      >{{ currentSize.size }} <a-icon type="caret-down"
                    /></span>
                    <a-menu slot="overlay" @click="onChangeTickSize">
                      <a-menu-item
                        v-for="item in tickSizes"
                        :key="item.symbol"
                        :class="{ active: currentSize.size === item.size }"
                      >
                        <span>{{ item.size }}</span>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
              </div>
              <div class="order-book-h5">
                <div
                  class="order-book-h5-table"
                  :class="{
                    'all-level100': orderBookType === 'Buy',
                    'all-level100-disabled': orderBookType === 'Sell'
                  }"
                >
                  <div>
                    <div
                      class="table-flex table-flex-header"
                      v-show="orderBookType === 'All'"
                    >
                      <div>Quantity</div>
                      <div class="text-right-flex">Price</div>
                      <div
                        v-show="orderBookType === 'Buy'"
                        class="text-right-flex"
                      >
                        Total
                      </div>
                    </div>
                    <div
                      class="table-flex table-flex-header"
                      v-show="orderBookType === 'Buy'"
                    >
                      <div>Price</div>
                      <div class="text-right-flex">Quantity</div>
                      <div
                        v-show="orderBookType === 'Buy'"
                        class="text-right-flex"
                      >
                        Total
                      </div>
                    </div>
                  </div>
                  <div class="level100-body">
                    <div
                      class="table-flex"
                      v-for="(item, index) in bid"
                      :key="index"
                      :style="{
                        backgroundImage: `linear-gradient(to ${
                          orderBookType === 'All' ? 'left' : 'right'
                        }, rgba(2, 192, 118, 0.4) ${getPercent(
                          item
                        )}%, #141B23 ${getPercent(item)}%)`
                      }"
                    >
                      <div v-show="orderBookType === 'All'">
                        <span
                          class="tabular-nums"
                          v-if="
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          {{
                            filterQuantity(
                              item.quantity,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                          }}
                        </span>
                      </div>
                      <div
                        v-show="orderBookType === 'All'"
                        class="text-right-flex"
                      >
                        <span
                          class="bid-price tabular-nums"
                          :class="{
                            'order-disabled': orderDisabled(item.price)
                          }"
                          v-if="
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            currentSize
                          "
                        >
                          {{
                            filterLevelPrice(
                              item.price,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              currentSize.symbol,
                              'bid'
                            )
                          }}
                        </span>
                      </div>
                      <div v-show="orderBookType === 'Buy'">
                        <span
                          class="bid-price tabular-nums"
                          :class="{
                            'order-disabled': orderDisabled(item.price)
                          }"
                          v-if="
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            currentSize
                          "
                        >
                          {{
                            filterLevelPrice(
                              item.price,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              currentSize.symbol,
                              'bid'
                            )
                          }}
                        </span>
                      </div>
                      <div
                        v-show="orderBookType === 'Buy'"
                        class="text-right-flex"
                      >
                        <span
                          class="tabular-nums"
                          v-if="
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          {{
                            filterQuantity(
                              item.quantity,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                          }}
                        </span>
                      </div>
                      <div
                        v-show="orderBookType === 'Buy'"
                        class="text-right-flex"
                      >
                        <span
                          class="tabular-nums"
                          v-if="
                            level100 &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            buyUnit.toString()
                          "
                          >{{
                            filterTotal(
                              filterLevelPrice(
                                item.price,
                                unit,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals,
                                buyUnit,
                                'bid'
                              ),
                              filterQuantity(
                                item.quantity,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokenMinUnit
                              )
                            )
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="order-book-h5-table"
                  :class="{
                    'all-level100': orderBookType === 'Sell',
                    'all-level100-disabled': orderBookType === 'Buy'
                  }"
                >
                  <div>
                    <div class="table-flex table-flex-header">
                      <div>Price</div>
                      <div class="text-right-flex">Quantity</div>
                      <div
                        v-show="orderBookType === 'Sell'"
                        class="text-right-flex"
                      >
                        Total
                      </div>
                    </div>
                  </div>
                  <div class="level100-body">
                    <div
                      class="table-flex"
                      v-for="(item, index) in ask"
                      :key="index"
                      :style="{
                        backgroundImage: `linear-gradient(to right, rgba(248, 73, 96, 0.2) ${getPercent(
                          item
                        )}%, #141B23 ${getPercent(item)}%)`
                      }"
                    >
                      <div>
                        <span
                          class="ask-price tabular-nums"
                          :class="{
                            'order-disabled': orderDisabled(item.price)
                          }"
                          v-if="
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            currentSize
                          "
                        >
                          {{
                            filterLevelPrice(
                              item.price,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              currentSize.symbol,
                              'ask'
                            )
                          }}
                        </span>
                      </div>
                      <div class="text-right-flex">
                        <span
                          class="tabular-nums"
                          v-if="
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          {{
                            filterQuantity(
                              item.quantity,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                          }}
                        </span>
                      </div>
                      <div
                        v-show="orderBookType === 'Sell'"
                        class="text-right-flex"
                      >
                        <span
                          class="tabular-nums"
                          v-if="
                            level100 &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            buyUnit.toString()
                          "
                          >{{
                            filterTotal(
                              filterLevelPrice(
                                item.price,
                                unit,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals,
                                buyUnit,
                                'ask'
                              ),
                              filterQuantity(
                                item.quantity,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokenMinUnit
                              )
                            )
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-show="isH5 && currentMenu === 'trades'"
              class="market-trade-h5 order-book-type-list-h5"
            >
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>
                      <div
                        :class="{
                          'usdt-test': currentTradeMarketSort === 'USDT'
                        }"
                      >
                        Price<span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token1[0].toString()]
                          "
                          >({{ currentPair[1][0].token1[1] }})</span
                        >
                      </div>
                    </th>
                    <th class="text-right">
                      <div
                        :class="{
                          'usdt-test': currentTradeMarketSort === 'USDT'
                        }"
                      >
                        Quantity
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                          >({{ currentPair[1][0].token0[1] }})</span
                        >
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    :class="{ animation: isLatestFilledRecordChange }"
                    v-for="(item, index) in latestFilledRecord"
                    :key="index"
                  >
                    <td>{{ item[0] | filterTime }}</td>
                    <td>
                      <span
                        v-if="
                          tokens &&
                          tokens[currentPair[1][0].token0[0].toString()] &&
                          tokens[currentPair[1][0].token1[0].toString()]
                        "
                        class="tabular-nums"
                        :class="{
                          'bid-price':
                            getTradeSide(item[2].token0Value) === 'Buy',
                          'ask-price':
                            getTradeSide(item[2].token0Value) === 'Sell'
                        }"
                        >{{
                          item[2]
                            | filterLatestPrice(
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              buyUnit
                            )
                        }}</span
                      >
                    </td>
                    <td class="text-right">
                      <span
                        class="tabular-nums"
                        v-if="
                          currentPair &&
                          tokens &&
                          tokens[currentPair[1][0].token0[0].toString()]
                        "
                        >{{
                          Object.values(item[2].token0Value)[0]
                            | filterLatestAmount(
                              tokenMinUnit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals
                            )
                        }}</span
                      >
                    </td>
                    <!--<td class="text-right"></td>-->
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="trade-main-header pc-show">
            <div
              :class="{ active: item === orderType }"
              v-for="(item, index) in orderTypeEnum"
              :key="index"
              @click="changeOrderType(item)"
            >
              <a-tooltip placement="top">
                <template slot="title">
                  <span v-if="item === orderTypeEnum.LMT"
                    >Limit orders (LMT) are orders to buy or sell an asset at a
                    specific price or better.</span
                  >
                  <span v-if="item === orderTypeEnum.MKT"
                    >Market orders (MKT) buy or sell at the current price,
                    whatever that price may be.</span
                  >
                  <span v-if="item === orderTypeEnum.FAK"
                    >Fill and Kill orders (FAK) are immediately executed against
                    resting orders. Any quantity that remains unfilled is
                    cancelled.</span
                  >
                  <span v-if="item === orderTypeEnum.FOK"
                    >Fill or Kill orders (FOK) are cancelled if not immediately
                    filled for the total quantity at the specified price or
                    better.</span
                  >
                  <span v-if="item === orderTypeEnum['Stop-loss']"
                    >When the price reaches the stop price, the stop-loss order
                    is executed to buy or sell at the limit price.</span
                  >
                </template>
                {{ item }}
              </a-tooltip>
            </div>
            <div :class="{ active: 'Pro' === orderType }">
              <a-dropdown placement="bottomCenter">
                <a-tooltip placement="top">
                  <template slot="title">
                    Professional orders are an advanced way of placing orders.
                    It is only recommended for professional traders.
                  </template>
                  <span>Pro <a-icon type="caret-down" /></span>
                </a-tooltip>
                <a-menu slot="overlay" class="strat-list">
                  <a-menu-item
                    v-for="item in proOrderEnum"
                    :key="item"
                    class="strat-list-item"
                    :class="{ active: item === currentProOrderMenu }"
                    @click="showProOrder(item)"
                  >
                    {{ item }}
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <trading-mining
              style="padding: 0 5px 0 0 !important; border: none"
              class="margin-left-auto trading-mining"
              ref="tradingMining"
              v-if="currentPair"
              :pair-id="currentPair[0].toString()"
            ></trading-mining>
            <a-icon
              v-if="currentPair"
              class="set-pool"
              type="setting"
              @click="showPoolVisible"
            />
          </div>
          <div
            class="trade-item pc-show"
            :class="{
              'has-register-competition': showKeepBalance,
              'show-stop-loss': orderType === 'Stop-loss'
            }"
          >
            <div v-show="orderType !== 'Pro'" class="trade-main-buy">
              <div class="trade-item-header">
                <span class="balance-label">Wallet</span>
                <span
                  v-if="
                    getPrincipalId &&
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    tokensBalance &&
                    tokensBalance[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <a-tooltip placement="top">
                    <template slot="title">
                      The balance in your wallet. If it's a cross-chain asset,
                      you can mint/retrieve it via ICRouter.
                    </template>
                    <router-link
                      v-if="
                        currentPair[1][0].token1[1]
                          .toLocaleLowerCase()
                          .includes('usdt')
                      "
                      :to="`/account?type=mint&token=${currentPair[1][0].token1[0].toString()}`"
                      >{{
                        tokensBalance[currentPair[1][0].token1[0].toString()]
                          | bigintToFloat(
                            Math.min(
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              8
                            ),
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}<span>&nbsp;{{ currentPair[1][0].token1[1] }}</span>
                    </router-link>
                  </a-tooltip>
                  <span
                    v-if="
                      !currentPair[1][0].token1[1]
                        .toLocaleLowerCase()
                        .includes('usdt')
                    "
                  >
                    {{
                      tokensBalance[currentPair[1][0].token1[0].toString()]
                        | bigintToFloat(
                          Math.min(
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            8
                          ),
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}&nbsp;{{ currentPair[1][0].token1[1] }}
                  </span>
                </span>
                <span v-else>-</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    Notes: Settlement is async after order has been filled,
                    check your balance later.
                  </template>
                  <span
                    v-show="
                      currentPair &&
                      (isTodo || orderLoading[currentPair[0].toString()])
                    "
                    class="loading-spinner"
                  ></span>
                </a-tooltip>
              </div>
              <div
                style="margin-top: 5px"
                v-show="showKeepBalance"
                class="trade-item-header"
              >
                <span class="balance-label">TraderAcct</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    The balance is kept in the trading pair, you can deposit and
                    withdraw it.
                  </template>
                  <span
                    v-if="
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token1[0].toString()]
                    "
                  >
                    {{
                      keepingBalance[currentPair[1][0].token1[0].toString()]
                        | bigintToFloat(
                          Math.min(
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            8
                          ),
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}&nbsp;{{ currentPair[1][0].token1[1] }}
                  </span>
                </a-tooltip>
                <span
                  v-if="
                    !(
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token1[0].toString()]
                    )
                  "
                  >-</span
                >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                    >
                      Stop-loss orders:
                      {{
                        stopLossNeed.token1
                          | bigintToFloat(
                            Math.min(
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              8
                            ),
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                      &nbsp;{{ currentPair[1][0].token1[1] }}.
                    </span>
                  </template>
                  <a-icon
                    style="margin-left: 5px"
                    v-if="stopLossNeed.token1"
                    type="info-circle"
                  />
                </a-tooltip>
                <a-tooltip placement="top">
                  <template slot="title">
                    Notes: Settlement is async after order has been filled,
                    check your balance later.
                  </template>
                  <span
                    v-show="
                      currentPair &&
                      (isTodo || orderLoading[currentPair[0].toString()])
                    "
                    class="loading-spinner"
                  ></span>
                </a-tooltip>
                <a-tooltip placement="top">
                  <template slot="title"> Withdraw </template>
                  <a-icon
                    type="minus-circle"
                    style="margin-left: 5px"
                    @click="onKeepingBalance(currentPair, false)"
                  />
                </a-tooltip>
                <a-tooltip placement="top">
                  <template slot="title"> Deposit </template>
                  <a-icon
                    style="margin-left: 8px"
                    type="plus-circle"
                    @click="
                      onDepositKeepingBalance(currentPair[1][0].token1, false)
                    "
                  />
                </a-tooltip>
              </div>
              <div v-show="orderType !== 'MKT'">
                <a-tooltip
                  placement="topRight"
                  :overlayClassName="
                    !(
                      stopBuyPrice &&
                      Number(stopBuyPrice) !== 0 &&
                      token0Price &&
                      currentTokenPrice
                    )
                      ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                      : 'order-book-type-list-tooltip'
                  "
                  trigger="click"
                >
                  <template slot="title">
                    <span v-if="icpPrice"
                      >≈ ${{
                        stopBuyPrice
                          | filterBuyPrice(token0Price, currentTokenPrice)
                          | formatNum
                      }}</span
                    >
                  </template>
                  <a-input-group
                    v-if="orderType === 'Stop-loss'"
                    :class="{
                      'swap-item-group-error':
                        isToBuy && (!stopBuyPrice || Number(stopBuyPrice) === 0)
                    }"
                    class="swap-item-group"
                    compact
                  >
                    <span class="suffix">Stop</span>
                    <a-input
                      :key="buyUnit"
                      v-model="stopBuyPrice"
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="0.0"
                      v-only-float="buyUnit"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                  </a-input-group>
                </a-tooltip>
                <a-tooltip
                  placement="topRight"
                  :overlayClassName="
                    !(
                      buyPrice &&
                      Number(buyPrice) !== 0 &&
                      token0Price &&
                      currentTokenPrice
                    )
                      ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                      : 'order-book-type-list-tooltip'
                  "
                  trigger="click"
                >
                  <template slot="title">
                    <span v-if="icpPrice"
                      >≈ ${{
                        buyPrice
                          | filterBuyPrice(token0Price, currentTokenPrice)
                          | formatNum
                      }}</span
                    >
                  </template>
                  <a-input-group
                    :class="{
                      'swap-item-group-error':
                        isToBuy && (!buyPrice || Number(buyPrice) === 0)
                    }"
                    class="swap-item-group"
                    compact
                  >
                    <span class="suffix">Price</span>
                    <a-input
                      :key="buyUnit"
                      v-model="buyPrice"
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="0.0"
                      v-only-float="buyUnit"
                      @input="buyPriceChange"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                  </a-input-group>
                </a-tooltip>
                <a-tooltip
                  placement="topRight"
                  :overlayClassName="
                    !buyAmountError && !buyAmountErrorUNIT
                      ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                      : 'order-book-type-list-tooltip'
                  "
                  trigger="click"
                >
                  <template slot="title">
                    <span v-show="buyAmountError"
                      >Max Quantity {{ maxBuyAmount }}</span
                    >
                    <span v-show="buyAmountErrorUNIT && !buyAmountError"
                      >Quantity must be an integral multiple of
                      {{ unitSize }}</span
                    >
                  </template>
                  <a-input-group
                    :class="{
                      'swap-item-group-error':
                        buyAmountError ||
                        buyAmountErrorUNIT ||
                        (isToBuy && (!buyAmount || Number(buyAmount) === 0))
                    }"
                    class="swap-item-group"
                    compact
                  >
                    <span class="suffix">Quantity</span>
                    <a-input
                      :key="tokenMinUnit"
                      v-model="buyAmount"
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="0.0"
                      v-only-float="tokenMinUnit"
                      @input="buyAmountChange"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token0[1] }}
                    </span>
                  </a-input-group>
                </a-tooltip>
                <div class="buy-slider buySlider">
                  <el-slider
                    v-model="buySlider"
                    :marks="buyMarks"
                    :format-tooltip="formatTooltip"
                    @change="changeBuySlider(buySlider)"
                  >
                  </el-slider>
                </div>
                <a-tooltip
                  placement="bottomRight"
                  :overlayClassName="
                    !(buyTotal && Number(buyTotal) !== 0 && token0Price,
                    currentTokenPrice)
                      ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                      : 'order-book-type-list-tooltip'
                  "
                  trigger="click"
                >
                  <template slot="title">
                    <span v-if="icpPrice"
                      >≈ ${{
                        buyTotal
                          | filterBuyPrice(token0Price, currentTokenPrice)
                          | formatNum
                      }}</span
                    >
                  </template>
                  <a-input-group
                    class="swap-item-group swap-item-group-buy-slider"
                    compact
                  >
                    <span class="suffix">Total</span>
                    <a-input
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                      v-model="buyTotal"
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="0.0"
                      v-only-float="
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      "
                      @input="buyTotalChange"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                  </a-input-group>
                </a-tooltip>
                <div class="taker-fee">
                  <span
                    v-if="
                      orderType === 'Stop-loss' &&
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      stoConfig
                    "
                  >
                    Fee:
                    {{
                      stoConfig.sloFee1
                        | bigintToFloat(
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                    }}
                    {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                  </span>
                  <span v-show="orderType !== 'Stop-loss'"
                    >Taker fee: {{ currentPair | filterBuyFee }}</span
                  >
                  <span v-show="orderType === 'LMT'" class="margin-left-auto"
                    >Maker fee: {{ feeRebate | filterFeeRebate }}</span
                  >
                </div>
                <div>
                  <button
                    v-if="getPrincipalId && currentPair"
                    :disabled="
                      (pairInfo && pairInfo.paused) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()]))
                    "
                    class="buy-button w100 mt20"
                    @click="onBuy"
                  >
                    <span v-if="pairInfo && pairInfo.paused">
                      <span
                        class="opening-time"
                        v-if="sysMode && sysMode.openingTime && showOpeningTime"
                      >
                        Open in&nbsp;
                        <a-statistic-countdown
                          class="adopted-countdown"
                          :value="Number(sysMode.openingTime) / 1000000"
                          format="H:m:s"
                          @finish="onFinish()"
                        />
                      </span>
                      <span v-else>Paused</span>
                    </span>
                    <span v-else>
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Buy&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                        <span v-show="orderType === 'FAK'"
                          >&nbsp;(Fill-And-Kill order)</span
                        >
                        <span v-show="orderType === 'FOK'"
                          >&nbsp;(Fill-Or-Kill order)</span
                        >
                      </span>
                    </span>
                  </button>
                  <button
                    v-else
                    class="w100 mt20 default"
                    @click="connectWallet"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
              <div v-show="orderType === 'MKT'">
                <a-input-group class="swap-item-group" compact>
                  <span class="suffix">Maximum slippage</span>
                  <a-input
                    class="input-icp-suffix"
                    autocomplete="off"
                    type="text"
                    placeholder="optional"
                    v-model="mktPrice"
                    v-only-number
                  />
                  <span class="suffix"> % </span>
                </a-input-group>
                <a-input-group class="swap-item-group disabled" compact>
                  <span class="suffix">Quantity</span>
                  <a-input
                    disabled
                    class="input-icp-suffix"
                    autocomplete="off"
                    type="text"
                    v-model="mktQuantity"
                  />
                  <span class="suffix" v-if="currentPair">
                    {{ currentPair[1][0].token0[1] }}
                  </span>
                </a-input-group>
                <div class="buy-slider buy-slider-mkt buyMktSlider">
                  <el-slider
                    v-model="buyMktSlider"
                    :marks="buyMarks"
                    :format-tooltip="formatTooltip"
                    @change="changeBuyMktSlider(buyMktSlider)"
                  >
                  </el-slider>
                </div>
                <a-tooltip
                  placement="topRight"
                  :overlayClassName="
                    !(
                      buyTotalMKT &&
                      Number(buyTotalMKT) !== 0 &&
                      token0Price &&
                      currentTokenPrice
                    )
                      ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                      : 'order-book-type-list-tooltip'
                  "
                  trigger="click"
                >
                  <template slot="title">
                    <span v-show="buyTotalMKTError"
                      >Max Total {{ maxBuyMKTTotal }}
                    </span>
                    <span v-show="!buyTotalMKTError && icpPrice"
                      >≈ ${{
                        buyTotalMKT
                          | filterBuyPrice(token0Price, currentTokenPrice)
                          | formatNum
                      }}</span
                    >
                  </template>
                  <a-input-group
                    :class="{
                      'swap-item-group-error':
                        buyTotalMKTError ||
                        (isToBuyMKT &&
                          (!buyTotalMKT || Number(buyTotalMKT) === 0))
                    }"
                    class="swap-item-group swap-item-group-buy-slider"
                    compact
                  >
                    <span class="suffix">Total</span>
                    <a-input
                      @input="mktTotalChange"
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                      :key="
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      "
                      v-model="buyTotalMKT"
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="0.0"
                      v-only-float="
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      "
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                  </a-input-group>
                </a-tooltip>
                <div class="taker-fee taker-fee-mkt">
                  <span>Taker fee: {{ currentPair | filterBuyFee }}</span>
                </div>
                <div>
                  <button
                    v-if="getPrincipalId && currentPair"
                    :disabled="
                      (pairInfo && pairInfo.paused) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()]))
                    "
                    class="buy-button w100 mt20"
                    @click="onBuyMKT"
                  >
                    <span v-if="pairInfo && pairInfo.paused">
                      <span
                        class="opening-time"
                        v-if="sysMode && sysMode.openingTime && showOpeningTime"
                      >
                        Open in&nbsp;
                        <a-statistic-countdown
                          class="adopted-countdown"
                          :value="Number(sysMode.openingTime) / 1000000"
                          format="H:m:s"
                        />
                      </span>
                      <span v-else>Paused</span>
                    </span>
                    <span v-else>
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Buy&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                      </span>
                    </span>
                  </button>
                  <button
                    v-else
                    class="w100 mt20 default"
                    @click="connectWallet"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
            <div v-show="orderType !== 'Pro'" class="trade-main-sell">
              <div class="trade-item-header">
                <span class="balance-label">Wallet</span>
                <span
                  v-if="
                    getPrincipalId &&
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokensBalance &&
                    tokensBalance[currentPair[1][0].token0[0].toString()]
                  "
                >
                  <a-tooltip placement="top">
                    <template slot="title">
                      The balance in your wallet. If it's a cross-chain asset,
                      you can mint/retrieve it via ICRouter.
                    </template>
                    <router-link
                      v-if="
                        currentPair[1][0].token0[1]
                          .toLocaleLowerCase()
                          .includes('usdt')
                      "
                      :to="`/account?type=mint&token=${currentPair[1][0].token0[0].toString()}`"
                    >
                      {{
                        tokensBalance[currentPair[1][0].token0[0].toString()]
                          | bigintToFloat(
                            Math.min(
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              8
                            ),
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}<span>&nbsp;{{ currentPair[1][0].token0[1] }} </span>
                    </router-link>
                  </a-tooltip>
                  <span
                    v-if="
                      !currentPair[1][0].token0[1]
                        .toLocaleLowerCase()
                        .includes('usdt')
                    "
                  >
                    {{
                      tokensBalance[currentPair[1][0].token0[0].toString()]
                        | bigintToFloat(
                          Math.min(
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            8
                          ),
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}&nbsp;{{ currentPair[1][0].token0[1] }}
                  </span>
                </span>
                <span v-else>-</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    Notes: Settlement is async after order has been filled,
                    check your balance later.
                  </template>
                  <span
                    v-show="
                      currentPair &&
                      (isTodo || orderLoading[currentPair[0].toString()])
                    "
                    class="loading-spinner"
                  ></span>
                </a-tooltip>
              </div>
              <div
                style="margin-top: 5px"
                v-show="showKeepBalance"
                class="trade-item-header"
              >
                <span class="balance-label">TraderAcct</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    The balance is kept in the trading pair, you can deposit and
                    withdraw it.
                  </template>
                  <span
                    v-if="
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    {{
                      keepingBalance[currentPair[1][0].token0[0].toString()]
                        | bigintToFloat(
                          Math.min(
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            8
                          ),
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}&nbsp;{{ currentPair[1][0].token0[1] }}
                  </span>
                </a-tooltip>
                <span
                  v-if="
                    !(
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()]
                    )
                  "
                  >-</span
                >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      Stop-loss orders:
                      {{
                        stopLossNeed.token0
                          | bigintToFloat(
                            Math.min(
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              8
                            ),
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                      &nbsp;{{ currentPair[1][0].token0[1] }}.
                    </span>
                  </template>
                  <a-icon
                    style="margin-left: 5px"
                    v-if="stopLossNeed.token0"
                    type="info-circle"
                  />
                </a-tooltip>
                <a-tooltip placement="top">
                  <template slot="title">
                    Notes: Settlement is async after order has been filled,
                    check your balance later.
                  </template>
                  <span
                    v-show="
                      currentPair &&
                      (isTodo || orderLoading[currentPair[0].toString()])
                    "
                    class="loading-spinner"
                  ></span>
                </a-tooltip>
                <a-tooltip placement="top">
                  <template slot="title"> Withdraw </template>
                  <a-icon
                    type="minus-circle"
                    style="margin-left: 5px"
                    @click="onKeepingBalance(currentPair)"
                  />
                </a-tooltip>
                <a-tooltip placement="top">
                  <template slot="title"> Deposit </template>
                  <a-icon
                    type="plus-circle"
                    style="margin-left: 8px"
                    @click="onDepositKeepingBalance(currentPair[1][0].token0)"
                  />
                </a-tooltip>
              </div>
              <div v-show="orderType !== 'MKT'">
                <a-tooltip
                  placement="topRight"
                  :overlayClassName="
                    !(
                      stopSellPrice &&
                      Number(stopSellPrice) !== 0 &&
                      token0Price &&
                      currentTokenPrice
                    )
                      ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                      : 'order-book-type-list-tooltip'
                  "
                  trigger="click"
                >
                  <template slot="title">
                    <span v-if="icpPrice"
                      >≈ ${{
                        stopSellPrice
                          | filterBuyPrice(token0Price, currentTokenPrice)
                          | formatNum
                      }}</span
                    >
                  </template>
                  <a-input-group
                    v-if="orderType === 'Stop-loss'"
                    :class="{
                      'swap-item-group-error':
                        isToSell &&
                        (!stopSellPrice || Number(stopSellPrice) === 0)
                    }"
                    class="swap-item-group"
                    compact
                  >
                    <span class="suffix">Stop</span>
                    <a-input
                      :key="buyUnit"
                      v-model="stopSellPrice"
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="0.0"
                      v-only-float="buyUnit"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                  </a-input-group>
                </a-tooltip>
                <a-tooltip
                  placement="topRight"
                  :overlayClassName="
                    !(
                      sellPrice &&
                      Number(sellPrice) !== 0 &&
                      token0Price &&
                      currentTokenPrice
                    )
                      ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                      : 'order-book-type-list-tooltip'
                  "
                  trigger="click"
                >
                  <template slot="title">
                    <span v-if="icpPrice"
                      >≈ ${{
                        sellPrice
                          | filterBuyPrice(token0Price, currentTokenPrice)
                          | formatNum
                      }}</span
                    >
                  </template>
                  <a-input-group
                    :class="{
                      'swap-item-group-error':
                        isToSell && (!sellPrice || Number(sellPrice) === 0)
                    }"
                    class="swap-item-group"
                    compact
                  >
                    <span class="suffix">Price</span>
                    <a-input
                      :key="buyUnit"
                      v-model="sellPrice"
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="0.0"
                      v-only-float="buyUnit"
                      @input="sellPriceChange"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                  </a-input-group>
                </a-tooltip>
                <a-tooltip
                  placement="topRight"
                  :overlayClassName="
                    !sellAmountError && !sellAmountErrorUNIT
                      ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                      : 'order-book-type-list-tooltip'
                  "
                  trigger="click"
                >
                  <template slot="title">
                    <span v-show="sellAmountError"
                      >Max Quantity {{ maxSellAmount }}</span
                    >
                    <span v-show="sellAmountErrorUNIT && !sellAmountError"
                      >Quantity must be an integral multiple of
                      {{ unitSize }}</span
                    >
                  </template>
                  <a-input-group
                    :class="{
                      'swap-item-group-error':
                        (isToSell &&
                          (!sellAmount || Number(sellAmount) === 0)) ||
                        sellAmountError ||
                        sellAmountErrorUNIT
                    }"
                    class="swap-item-group"
                    compact
                  >
                    <span class="suffix">Quantity</span>
                    <a-input
                      :key="tokenMinUnit"
                      v-model="sellAmount"
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="0.0"
                      v-only-float="tokenMinUnit"
                      @input="sellAmountChange"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token0[1] }}
                    </span>
                  </a-input-group>
                </a-tooltip>
                <div class="buy-slider sellSlider">
                  <el-slider
                    v-model="sellSlider"
                    :marks="buyMarks"
                    :format-tooltip="formatTooltipSell"
                    @change="changeSellSlider(sellSlider)"
                  >
                  </el-slider>
                </div>
                <a-tooltip
                  placement="bottomRight"
                  :overlayClassName="
                    !(
                      sellTotal &&
                      Number(sellTotal) !== 0 &&
                      token0Price &&
                      currentTokenPrice
                    )
                      ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                      : 'order-book-type-list-tooltip'
                  "
                  trigger="click"
                >
                  <template slot="title">
                    <span v-if="icpPrice"
                      >≈ ${{
                        sellTotal
                          | filterBuyPrice(token0Price, currentTokenPrice)
                          | formatNum
                      }}</span
                    >
                  </template>
                  <a-input-group
                    class="swap-item-group swap-item-group-buy-slider"
                    compact
                  >
                    <span class="suffix">Total</span>
                    <a-input
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                      v-model="sellTotal"
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="0.0"
                      v-only-float="
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      "
                      @input="sellTotalChange"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                  </a-input-group>
                </a-tooltip>
                <div class="taker-fee">
                  <span
                    v-if="
                      orderType === 'Stop-loss' &&
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      stoConfig
                    "
                  >
                    Fee:
                    {{
                      stoConfig.sloFee1
                        | bigintToFloat(
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                    }}
                    {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                  </span>
                  <span v-show="orderType !== 'Stop-loss'"
                    >Taker fee: {{ currentPair | filterFee }}</span
                  >
                  <span v-show="orderType === 'LMT'" class="margin-left-auto"
                    >Maker fee: {{ feeRebate | filterFeeSellRebate }}</span
                  >
                </div>
                <div>
                  <button
                    v-if="getPrincipalId && currentPair"
                    class="sell-button w100 mt20"
                    :disabled="
                      (pairInfo && pairInfo.paused) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()]))
                    "
                    @click="onSell"
                  >
                    <span v-if="pairInfo && pairInfo.paused">
                      <span
                        class="opening-time"
                        v-if="sysMode && sysMode.openingTime && showOpeningTime"
                      >
                        Open in&nbsp;
                        <a-statistic-countdown
                          class="adopted-countdown"
                          :value="Number(sysMode.openingTime) / 1000000"
                          format="H:m:s"
                        />
                      </span>
                      <span v-else>Paused</span>
                    </span>
                    <span v-else>
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Sell&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                        <span v-show="orderType === 'FAK'"
                          >&nbsp;(Fill-And-Kill order)</span
                        >
                        <span v-show="orderType === 'FOK'"
                          >&nbsp;(Fill-Or-Kill order)</span
                        >
                      </span>
                    </span>
                  </button>
                  <button
                    v-else
                    class="w100 mt20 default"
                    @click="connectWallet"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
              <div v-show="orderType === 'MKT'">
                <a-input-group class="swap-item-group" compact>
                  <span class="suffix">Maximum slippage</span>
                  <a-input
                    class="input-icp-suffix"
                    autocomplete="off"
                    type="text"
                    placeholder="optional"
                    v-model="mktSellPrice"
                    v-only-number
                  />
                  <span class="suffix"> % </span>
                </a-input-group>
                <a-tooltip
                  placement="topRight"
                  :overlayClassName="
                    !sellAmountError && !sellAmountErrorUNIT
                      ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                      : 'order-book-type-list-tooltip'
                  "
                  trigger="click"
                >
                  <template slot="title">
                    <span v-show="sellAmountError"
                      >Max Quantity {{ maxSellAmount }}</span
                    >
                    <span v-show="sellAmountErrorUNIT && !sellAmountError"
                      >Quantity must be an integral multiple of
                      {{ unitSize }}</span
                    >
                  </template>
                  <a-input-group
                    :class="{
                      'swap-item-group-error':
                        (isToSell &&
                          (!sellAmount || Number(sellAmount) === 0)) ||
                        sellAmountError ||
                        sellAmountErrorUNIT
                    }"
                    class="swap-item-group"
                    compact
                  >
                    <span class="suffix">Quantity</span>
                    <a-input
                      :key="tokenMinUnit"
                      v-model="sellAmount"
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="0.0"
                      v-only-float="tokenMinUnit"
                      @change="sellMktAmountChange"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token0[1] }}
                    </span>
                  </a-input-group>
                </a-tooltip>
                <div class="buy-slider buy-slider-mkt sellMktSlider">
                  <el-slider
                    v-model="sellMktSlider"
                    :marks="buyMarks"
                    :format-tooltip="formatTooltipSell"
                    @change="changeSellMktSlider(sellMktSlider)"
                  >
                  </el-slider>
                </div>
                <a-input-group
                  class="swap-item-group swap-item-group-buy-slider disabled"
                  compact
                >
                  <span class="suffix">Total</span>
                  <a-input
                    v-model="mktTotal"
                    disabled
                    class="input-icp-suffix"
                    autocomplete="off"
                    type="text"
                  />
                  <span class="suffix" v-if="currentPair">
                    {{ currentPair[1][0].token1[1] }}
                  </span>
                </a-input-group>
                <div class="taker-fee taker-fee-mkt">
                  <span>Taker fee: {{ currentPair | filterFee }}</span>
                </div>
                <div>
                  <button
                    v-if="getPrincipalId && currentPair"
                    class="sell-button w100 mt20"
                    :disabled="
                      (pairInfo && pairInfo.paused) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()]))
                    "
                    @click="onSellMKT"
                  >
                    <span v-if="pairInfo && pairInfo.paused">
                      <span
                        class="opening-time"
                        v-if="sysMode && sysMode.openingTime && showOpeningTime"
                      >
                        Open in&nbsp;
                        <a-statistic-countdown
                          class="adopted-countdown"
                          :value="Number(sysMode.openingTime) / 1000000"
                          format="H:m:s"
                        />
                      </span>
                      <span v-else>Paused</span>
                    </span>
                    <span v-else>
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Sell&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                      </span>
                    </span>
                  </button>
                  <button
                    v-else
                    class="w100 mt20 default"
                    @click="connectWallet"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
            <div v-show="orderType === 'Pro'" class="trade-item-pro">
              <div class="base-font-title trade-item-pro-title">
                <span style="white-space: nowrap"
                  >Pro-Wallet Account:&nbsp;</span
                >
                <copy-account
                  :account="getPrincipalId"
                  copyText="Principal"
                ></copy-account>
                &nbsp;&nbsp;&nbsp;
                <span style="white-space: nowrap">Subaccount:&nbsp;</span>
                <copy-account
                  account="0000000000000000000000000000000000000000000000000000000000000001"
                  copyText="Subaccount"
                ></copy-account>
              </div>
              <div
                class="trade-item-pro-fee"
                v-if="
                  stoConfig &&
                  currentPair &&
                  tokens &&
                  tokens[currentPair[1][0].token1[0].toString()]
                "
              >
                <span style="font-weight: bold">Fee:</span> (Create)
                {{
                  stoConfig.poFee1
                    | bigintToFloat(
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      tokens[currentPair[1][0].token1[0].toString()].decimals
                    )
                }}
                {{ tokens[currentPair[1][0].token1[0].toString()].symbol }},
                (Update)
                {{
                  stoConfig.poFee1
                    | stoUpdateFee(
                      tokens[currentPair[1][0].token1[0].toString()].decimals
                    )
                }}
                {{ tokens[currentPair[1][0].token1[0].toString()].symbol }},
                (Order) {{ stoConfig.poFee2 | stoOrderFee }}.
              </div>
              <div class="mt20">Balance:</div>
              <div class="trade-item-pro-balance">
                <div class="trade-item-pro-balance-left">
                  <div>
                    <span class="trade-item-pro-balance-label"
                      >Pro-wallet:</span
                    >
                    <span
                      v-if="
                        currentPair &&
                        tokensBalanceSto[
                          currentPair[1][0].token1[0].toString()
                        ] &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                    >
                      {{
                        tokensBalanceSto[currentPair[1][0].token1[0].toString()]
                          | bigintToFloat(
                            Math.min(
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              4
                            ),
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                      {{
                        tokens[currentPair[1][0].token1[0].toString()].symbol
                      }}
                    </span>
                    &nbsp;
                    <span
                      class="trade-item-pro-icon"
                      @click="
                        swapWallet(currentPair[1][0].token1[0].toString())
                      "
                    >
                      <a-icon type="swap" />
                    </span>
                  </div>
                  <div>
                    <span class="trade-item-pro-balance-label"
                      >Pro-TraderAcct:</span
                    >
                    <span
                      v-if="
                        currentPair &&
                        keepingBalanceSto[
                          currentPair[1][0].token1[0].toString()
                        ] &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                    >
                      <a-tooltip placement="top">
                        <template slot="title">
                          Strategic orders will only be traded using the
                          Pair-Account that is kept in the trading pair, making
                          sure that the balance of this account is sufficient.
                        </template>
                        <span class="base-font-title" style="font-weight: bold">
                          {{
                            keepingBalanceSto[
                              currentPair[1][0].token1[0].toString()
                            ]
                              | bigintToFloat(
                                Math.min(
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals,
                                  4
                                ),
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals
                              )
                              | formatNum
                          }}
                        </span>
                        {{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </a-tooltip>
                    </span>
                    &nbsp;
                    <a-tooltip placement="top">
                      <template slot="title"> Withdraw </template>
                      <a-icon
                        type="minus-circle"
                        @click="onKeepingBalance(currentPair, false, true)"
                      />
                    </a-tooltip>
                    <a-tooltip placement="top">
                      <template slot="title"> Deposit </template>
                      <a-icon
                        type="plus-circle"
                        style="margin-left: 8px"
                        @click="
                          onDepositKeepingBalance(
                            currentPair[1][0].token1,
                            false,
                            true
                          )
                        "
                      />
                    </a-tooltip>
                  </div>
                </div>
                <div class="trade-item-pro-balance-right">
                  <div>
                    <span class="trade-item-pro-balance-label"
                      >Pro-wallet:</span
                    >
                    <span
                      v-if="
                        currentPair &&
                        tokensBalanceSto[
                          currentPair[1][0].token0[0].toString()
                        ] &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      {{
                        tokensBalanceSto[currentPair[1][0].token0[0].toString()]
                          | bigintToFloat(
                            Math.min(
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              4
                            ),
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                      {{
                        tokens[currentPair[1][0].token0[0].toString()].symbol
                      }}
                    </span>
                    &nbsp;
                    <span
                      @click="
                        swapWallet(currentPair[1][0].token0[0].toString())
                      "
                      class="trade-item-pro-icon"
                    >
                      <a-icon type="swap" />
                    </span>
                  </div>
                  <div>
                    <span class="trade-item-pro-balance-label"
                      >Pro-TraderAcct:</span
                    >
                    <span
                      v-if="
                        currentPair &&
                        keepingBalanceSto[
                          currentPair[1][0].token0[0].toString()
                        ] &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <a-tooltip placement="top">
                        <template slot="title">
                          Strategic orders will only be traded using the
                          Pair-Account that is kept in the trading pair, making
                          sure that the balance of this account is sufficient.
                        </template>
                        <span class="base-font-title" style="font-weight: bold">
                          {{
                            keepingBalanceSto[
                              currentPair[1][0].token0[0].toString()
                            ]
                              | bigintToFloat(
                                Math.min(
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals,
                                  4
                                ),
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals
                              )
                              | formatNum
                          }}
                        </span>
                        {{
                          tokens[currentPair[1][0].token0[0].toString()].symbol
                        }}
                      </a-tooltip>
                    </span>
                    &nbsp;
                    <a-tooltip placement="top">
                      <template slot="title"> Withdraw </template>
                      <a-icon
                        type="minus-circle"
                        @click="onKeepingBalance(currentPair, true, true)"
                      />
                    </a-tooltip>
                    <a-tooltip placement="top">
                      <template slot="title"> Deposit </template>
                      <a-icon
                        type="plus-circle"
                        style="margin-left: 8px"
                        @click="
                          onDepositKeepingBalance(
                            currentPair[1][0].token0,
                            true,
                            true
                          )
                        "
                      />
                    </a-tooltip>
                  </div>
                </div>
              </div>
              <div class="trade-item-pro-submit">
                <p>
                  The Pro-Wallet account is a separate sub-account, please
                  transfer tokens to this account before you can create strategy
                  orders.
                </p>
                <button
                  type="button"
                  class="large-primary primary w100"
                  @click="onCreateProOrder"
                >
                  Create a {{ currentProOrderMenu }} order
                </button>
              </div>
            </div>
          </div>
          <div class="order-expire pc-show" v-if="orderExpirationDuration">
            <span v-show="orderType !== 'Pro' && orderType !== 'Stop-loss'">
              The pending order will expire after
              {{ orderExpirationDuration | filterMaxCache }} days.
            </span>
          </div>
        </div>
        <div
          class="de-swap-level-10 pc-show"
          :class="{
            'has-register-competition': showKeepBalance,
            'show-stop-loss': orderType === 'Stop-loss'
          }"
        >
          <div class="order-book-type-list">
            <div
              v-for="(item, index) in orderBookTypeList"
              :key="index"
              @click="changeOrderBookType(item)"
            >
              <a-tooltip
                overlayClassName="order-book-type-list-tooltip"
                placement="topLeft"
              >
                <template slot="title">{{ item.value }}</template>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="css-1iztezc"
                  :class="{ active: item.key === orderBookType }"
                >
                  <path
                    v-if="item.key === 'All'"
                    d="M4 4h7v7H4V4z"
                    fill="#F6465D"
                  ></path>
                  <path
                    v-if="item.key === 'All'"
                    d="M4 13h7v7H4v-7z"
                    fill="#0ECB81"
                  ></path>
                  <path
                    v-if="item.key === 'Sell'"
                    d="M4 4h7v16H4V4z"
                    fill="#F6465D"
                  ></path>
                  <path
                    v-if="item.key === 'Buy'"
                    d="M4 4h7v16H4v-7z"
                    fill="#0ECB81"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                    fill="currentColor"
                  ></path>
                </svg>
              </a-tooltip>
            </div>
            <div
              v-if="currentSize"
              class="order-book-tick-size margin-left-auto base-font-title"
            >
              <a-dropdown
                placement="bottomCenter"
                overlayClassName="tick-size-dropdown"
                :trigger="['click']"
              >
                <span class="pointer"
                  >{{ currentSize.size }} <a-icon type="caret-down"
                /></span>
                <a-menu slot="overlay" @click="onChangeTickSize">
                  <a-menu-item
                    v-for="item in tickSizes"
                    :key="item.symbol"
                    :class="{ active: currentSize.size === item.size }"
                  >
                    <span>{{ item.size }}</span>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          </div>
          <table v-if="level100 && level100[1]">
            <thead>
              <tr style="font-size: 12px">
                <th>
                  <div
                    :class="{
                      'usdt-test': currentTradeMarketSort === 'USDT'
                    }"
                  >
                    Price<span
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                      >({{ currentPair[1][0].token1[1] }})</span
                    >
                  </div>
                </th>
                <th class="text-right">
                  <div
                    :class="{
                      'usdt-test': currentTradeMarketSort === 'USDT'
                    }"
                  >
                    Quantity<span
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                      >({{ currentPair[1][0].token0[1] }})</span
                    >
                  </div>
                </th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody
              class="level100-body"
              :class="{ 'all-level100': orderBookType === 'Sell' }"
              v-show="orderBookType !== 'Buy'"
            >
              <tr
                v-for="(item, index) in ask"
                :key="index"
                :style="{
                  backgroundImage: `linear-gradient(to left, rgba(248, 73, 96, 0.2) ${getPercent(
                    item
                  )}%, #141B23 ${getPercent(item)}%)`
                }"
                @click="setTrade(item, 'ask', index, ask)"
              >
                <td @click.stop="setTradePrice(item, 'ask')">
                  <span
                    class="ask-price tabular-nums"
                    :class="{
                      'order-disabled': orderDisabled(item.price)
                    }"
                    v-if="
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      unit &&
                      currentSize
                    "
                  >
                    {{
                      filterLevelPrice(
                        item.price,
                        unit,
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        currentSize.symbol,
                        'ask'
                      )
                    }}
                  </span>
                </td>
                <td class="text-right">
                  <span
                    class="tabular-nums"
                    v-if="
                      tokens && tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    {{
                      filterQuantity(
                        item.quantity,
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokenMinUnit
                      )
                    }}
                  </span>
                </td>
                <td class="text-right">
                  <span
                    class="tabular-nums"
                    v-if="
                      level100 &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      unit &&
                      buyUnit.toString()
                    "
                    >{{
                      filterTotal(
                        filterLevelPrice(
                          item.price,
                          unit,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          buyUnit,
                          'ask'
                        ),
                        filterQuantity(
                          item.quantity,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokenMinUnit
                        )
                      )
                    }}</span
                  >
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td colspan="3">
                  <div class="current-icp-price">
                    <span class="token-price" :class="tokenPriceStatus">
                      {{ currentTokenPrice
                      }}<a-icon
                        type="arrow-up"
                        v-show="tokenPriceStatus === 'call'"
                      /><a-icon
                        v-show="tokenPriceStatus === 'put'"
                        type="arrow-down"
                      />
                    </span>
                    <span v-if="icpPrice">≈ ${{ token0Price }}</span>
                    <span
                      :class="{
                        'bid-price': Number(currentPair[2].change24h) > 0,
                        'ask-price': Number(currentPair[2].change24h) < 0
                      }"
                      class="margin-left-auto"
                      v-if="currentPair[2]"
                    >
                      <span v-show="Number(currentPair[2].change24h) > 0"
                        >+</span
                      >
                      {{ currentPair[2].change24h | filterChange }}%
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody
              class="level100-body"
              :class="{ 'all-level100': orderBookType === 'Buy' }"
              v-show="orderBookType !== 'Sell'"
            >
              <tr
                v-for="(item, index) in bid"
                :key="index"
                :style="{
                  backgroundImage: `linear-gradient(to left, rgba(2, 192, 118, 0.2) ${getPercent(
                    item
                  )}%, #141B23 ${getPercent(item)}%)`
                }"
                @click="setTrade(item, 'bid', index, bid)"
              >
                <td @click.stop="setTradePrice(item, 'bid')">
                  <span
                    class="bid-price tabular-nums"
                    :class="{
                      'order-disabled': orderDisabled(item.price)
                    }"
                    v-if="
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      unit &&
                      currentSize
                    "
                  >
                    {{
                      filterLevelPrice(
                        item.price,
                        unit,
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        currentSize.symbol,
                        'bid'
                      )
                    }}
                  </span>
                </td>
                <td class="text-right">
                  <span
                    class="tabular-nums"
                    v-if="
                      tokens && tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    {{
                      filterQuantity(
                        item.quantity,
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokenMinUnit
                      )
                    }}
                  </span>
                </td>
                <td class="text-right">
                  <span
                    class="tabular-nums"
                    v-if="
                      level100 &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      unit &&
                      buyUnit.toString()
                    "
                    >{{
                      filterTotal(
                        filterLevelPrice(
                          item.price,
                          unit,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          buyUnit,
                          'bid'
                        ),
                        filterQuantity(
                          item.quantity,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokenMinUnit
                        )
                      )
                    }}</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="swap-transfer-list">
        <div
          class="swap-transfer-list-header swap-transfer-list-header-fallback"
        >
          <ul>
            <li
              :class="{ active: menu.value === currentTradeMenu }"
              v-for="(menu, index) in tradeMenu"
              :key="index"
              @click="changeTradeMenu(menu.value)"
            >
              {{ menu.name }}
            </li>
          </ul>
          <button
            type="button"
            class="pc-show swap-transfer-list-header-fallback-click primary"
            @click="showFallback"
          >
            Fallback
          </button>
          <span class="pc-show">
            Notes: Settlement is async after order has been filled, check your
            balance later.
          </span>
          <span class="h5-show swap-transfer-list-header-fallback-span">
            <a-tooltip placement="top">
              <template slot="title">
                Notes: Settlement is async after order has been filled, check
                your balance later.
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </span>
        </div>
        <button
          type="button"
          class="
            h5-show
            margin-left-auto
            swap-transfer-list-header-fallback-click
            primary
          "
          style="margin-top: 10px"
          @click="showFallback"
        >
          Fallback
        </button>
        <div class="base-font vol-h5" v-show="currentTradeMenu === 'pending'">
          Stats:
          <span
            v-if="
              currentPair &&
              tokens &&
              tokens[currentPair[1][0].token0[0].toString()]
            "
          >
            {{
              pendingList
                | filterPendingToken0
                | bigintToFloat(
                  Math.min(
                    tokens[currentPair[1][0].token0[0].toString()].decimals,
                    8
                  ),
                  tokens[currentPair[1][0].token0[0].toString()].decimals
                )
            }}
            {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
          </span>
          <span> & </span>
          <span
            v-if="
              currentPair &&
              level100 &&
              tokens &&
              tokens[currentPair[1][0].token0[0].toString()] &&
              tokens[currentPair[1][0].token1[0].toString()] &&
              unit &&
              buyUnit
            "
          >
            {{
              pendingList
                | filterPendingToken1(
                  unit,
                  buyUnit,
                  tokenMinUnit,
                  tokens[currentPair[1][0].token0[0].toString()].decimals,
                  tokens[currentPair[1][0].token1[0].toString()].decimals
                )
                | bigintToFloat(
                  Math.min(
                    tokens[currentPair[1][0].token1[0].toString()].decimals,
                    8
                  ),
                  tokens[currentPair[1][0].token1[0].toString()].decimals
                )
            }}
            {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
          </span>
          <span>Pending</span>
        </div>
        <div class="base-font vol-h5" v-show="currentTradeMenu === 'history'">
          Vol:
          <span
            v-if="
              userLiquidity &&
              currentPair &&
              tokens &&
              tokens[currentPair[1][0].token0[0].toString()]
            "
          >
            {{
              userLiquidity.vol.value0
                | bigintToFloat(
                  Math.min(
                    tokens[currentPair[1][0].token0[0].toString()].decimals,
                    8
                  ),
                  tokens[currentPair[1][0].token0[0].toString()].decimals
                )
            }}
            {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
          </span>
          <span> & </span>
          <span
            v-if="
              userLiquidity &&
              currentPair &&
              tokens &&
              tokens[currentPair[1][0].token1[0].toString()]
            "
          >
            {{
              userLiquidity.vol.value1
                | bigintToFloat(
                  Math.min(
                    tokens[currentPair[1][0].token1[0].toString()].decimals,
                    8
                  ),
                  tokens[currentPair[1][0].token1[0].toString()].decimals
                )
            }}
            {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
          </span>
        </div>
        <div v-show="!isH5 && currentTradeMenu === 'pro'">
          <ul style="margin: -15px 0 0 5px">
            <li
              :class="{ active: menu.value === currentTradeMenuPro }"
              v-for="(menu, index) in tradeMenuPro"
              :key="index"
              @click="changeTradeMenuPro(menu.value)"
            >
              {{ menu.name }}
            </li>
          </ul>
          <div
            class="overflow-scroll"
            v-show="currentTradeMenuPro === 'orders'"
          >
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Soid</th>
                  <th>Type</th>
                  <th>Strategy</th>
                  <th>Stats</th>
                  <th>Status</th>
                  <th>Last trigger time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody
                v-loading="proOrdersLoading"
                element-loading-background="rgba(0, 0, 0, 0)"
              >
                <tr v-show="!proOrdersLoading && !proOrders.length">
                  <td colspan="8"><div class="empty">No Orders</div></td>
                </tr>
                <tr
                  v-for="(item, index) in proOrders.slice(
                    (currentProOrdersPage - 1) * 10,
                    currentProOrdersPage * 10
                  )"
                  :key="index"
                >
                  <td class="swap-transfer-list-time">
                    {{ item.initTime | formatDateFromSecondUTC }}
                  </td>
                  <td class="swap-transfer-list-id">
                    <copy-account
                      :account="item.soid.toString(10)"
                      copyText="Soid"
                    ></copy-account>
                  </td>
                  <td>
                    {{ Object.keys(item.stType)[0] }}
                  </td>
                  <td style="line-height: 1.2">
                    <div v-if="Object.keys(item.stType)[0] === 'GridOrder'">
                      <div>
                        lowerLimit:
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            buyUnit
                          "
                        >
                          {{
                            filterLevelPrice(
                              item.strategy.GridOrder.setting.lowerLimit,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              buyUnit
                            )
                          }}
                        </span>
                      </div>
                      <div>
                        upperLimit:
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            buyUnit
                          "
                        >
                          {{
                            filterLevelPrice(
                              item.strategy.GridOrder.setting.upperLimit,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              buyUnit
                            )
                          }}
                        </span>
                      </div>
                      <div>
                        gridCountPerSide:
                        {{ item.strategy.GridOrder.setting.gridCountPerSide }}
                      </div>
                      <div>
                        spread:
                        <span
                          v-if="
                            Object.keys(
                              item.strategy.GridOrder.setting.spread
                            )[0] === 'Geom'
                          "
                        >
                          { Geometric:
                          {{
                            item.strategy.GridOrder.setting.spread.Geom
                              | filterPpm
                          }}
                          }
                        </span>
                        <span
                          v-if="
                            Object.keys(
                              item.strategy.GridOrder.setting.spread
                            )[0] === 'Arith' &&
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals &&
                            unit &&
                            buyUnit
                          "
                        >
                          { Arithmetic:
                          {{
                            filterLevelPrice(
                              item.strategy.GridOrder.setting.spread.Arith,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              buyUnit
                            )
                          }}
                          }
                        </span>
                      </div>
                      <div>
                        Amount:
                        <span
                          v-if="
                            Object.keys(
                              item.strategy.GridOrder.setting.amount
                            )[0] === 'Percent'
                          "
                        >
                          { Percent:
                          <span
                            v-if="
                              item.strategy.GridOrder.setting.amount.Percent
                                .length
                            "
                            >{{
                              item.strategy.GridOrder.setting.amount.Percent[0]
                                | filterPpm
                            }}</span
                          >
                          <span v-else>-</span> }
                        </span>
                        <span
                          v-if="
                            Object.keys(
                              item.strategy.GridOrder.setting.amount
                            )[0] === 'Token0' &&
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          "
                        >
                          {{
                            item.strategy.GridOrder.setting.amount.Token0
                              | bigintToFloat(
                                tokenMinUnit,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals
                              )
                          }}
                          {{
                            tokens[currentPair[1][0].token0[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span
                          v-if="
                            Object.keys(
                              item.strategy.GridOrder.setting.amount
                            )[0] === 'Token1' &&
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          "
                        >
                          {{
                            item.strategy.GridOrder.setting.amount.Token1
                              | bigintToFloat(
                                buyUnit,
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals
                              )
                          }}
                          {{
                            tokens[currentPair[1][0].token1[0].toString()]
                              .symbol
                          }}
                        </span>
                      </div>
                    </div>
                    <div v-if="Object.keys(item.stType)[0] === 'IcebergOrder'">
                      <div>
                        Side:
                        <span>{{
                          Object.keys(
                            item.strategy.IcebergOrder.setting.order.side
                          )[0]
                        }}</span>
                      </div>
                      <div>
                        Price:
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            buyUnit
                          "
                        >
                          {{
                            filterLevelPrice(
                              item.strategy.IcebergOrder.setting.order.price,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              buyUnit,
                              Object.keys(
                                item.strategy.IcebergOrder.setting.order.side
                              )[0] === 'Buy'
                                ? 'bid'
                                : 'ask'
                            )
                          }}
                        </span>
                      </div>
                      <div>
                        Quantity:
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokenMinUnit
                          "
                        >
                          {{
                            filterQuantity(
                              Object.values(
                                item.strategy.IcebergOrder.setting.totalLimit
                              )[0],
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                          }}
                        </span>
                      </div>
                      <div>
                        Total:
                        <span
                          v-if="
                            currentPair &&
                            unit &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            buyUnit.toString() &&
                            tokenMinUnit
                          "
                        >
                          {{
                            filterTotal(
                              filterLevelPrice(
                                item.strategy.IcebergOrder.setting.order.price,
                                unit,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals,
                                buyUnit,
                                Object.keys(
                                  item.strategy.IcebergOrder.setting.order.side
                                )[0] === 'Buy'
                                  ? 'bid'
                                  : 'ask'
                              ),
                              filterQuantity(
                                Object.values(
                                  item.strategy.IcebergOrder.setting.totalLimit
                                )[0],
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokenMinUnit
                              )
                            )
                          }}
                          {{
                            tokens[currentPair[1][0].token1[0].toString()]
                              .symbol
                          }}
                        </span>
                      </div>
                      <div>
                        Display quantity:
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokenMinUnit
                          "
                        >
                          {{
                            filterQuantity(
                              Object.values(
                                item.strategy.IcebergOrder.setting
                                  .amountPerTrigger
                              )[0],
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                          }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>orderCount: {{ item.stats.orderCount }}</div>
                    <div>errorCount: {{ item.stats.errorCount }}</div>
                  </td>
                  <td>
                    {{ Object.keys(item.status)[0] }}
                  </td>
                  <td class="swap-transfer-list-time">
                    {{ item.triggerTime | formatDateFromSecondUTC }}
                  </td>
                  <td>
                    <span
                      class="cancel-pending"
                      v-if="
                        Object.keys(item.status)[0] === 'Running' ||
                        Object.keys(item.status)[0] === 'Stopped'
                      "
                      @click="onUpdateProOrder(item)"
                    >
                      Update
                    </span>
                    <span
                      class="cancel-pending"
                      v-if="Object.keys(item.status)[0] === 'Stopped'"
                      @click="onRunningProOrder(item.soid, item.stType)"
                    >
                      Run
                    </span>
                    <span
                      class="cancel-pending"
                      v-if="Object.keys(item.status)[0] === 'Running'"
                      @click="onStopProOrder(item.soid, item.stType)"
                    >
                      Stop
                    </span>
                    <span
                      class="cancel-pending"
                      v-if="
                        Object.keys(item.status)[0] === 'Stopped' ||
                        Object.keys(item.status)[0] === 'Deleted'
                      "
                      @click="onDeleteProOrder(item.soid, item.stType)"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <a-pagination
            class="pagination"
            v-show="
              !isH5 && currentTradeMenuPro === 'orders' && proOrders.length > 10
            "
            :current="currentProOrdersPage"
            :defaultPageSize="10"
            :total="proOrders.length"
            @change="changeProOrders"
          />
          <div class="overflow-scroll">
            <table v-show="!isH5 && currentTradeMenuPro === 'pending'">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Txid</th>
                  <th>Type</th>
                  <th>Side</th>
                  <th>Price(filled)</th>
                  <th>Quantity(filled)</th>
                  <th>Filled</th>
                  <th>Total(filled)</th>
                  <th>Status</th>
                  <th>ICTC</th>
                  <!--<th>Action</th>-->
                </tr>
              </thead>
              <tbody
                v-loading="proOrdersPendingLoading"
                element-loading-background="rgba(0, 0, 0, 0)"
              >
                <tr v-show="!proOrdersPendingLoading && !pendingListPro.length">
                  <td colspan="9"><div class="empty">No Orders</div></td>
                </tr>
                <tr
                  v-for="(item, index) in pendingListPro.slice(
                    (currentPendingProPage - 1) * 10,
                    currentPendingProPage * 10
                  )"
                  :key="index"
                >
                  <td class="swap-transfer-list-time">
                    {{ item[1].time | formatDateFromNanosecondUTC }}
                  </td>
                  <td>
                    <copy-account
                      :account="filterTxid(item[1].txid)"
                      copyText="Txid"
                    ></copy-account>
                  </td>
                  <td class="order-filled-color">
                    {{ Object.keys(item[1].orderType)[0] }}
                  </td>
                  <td
                    :class="{
                      'ask-price': filterSide(item[1].orderPrice) === 'Sell',
                      'bid-price': filterSide(item[1].orderPrice) === 'Buy'
                    }"
                  >
                    {{ filterSide(item[1].orderPrice) }}
                  </td>
                  <td>
                    <span
                      class="order-filled"
                      v-if="
                        unit &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()] &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        buyUnit.toString()
                      "
                    >
                      <span class="order-filled-color">
                        {{
                          Object.keys(item[1].orderType)[0] === 'MKT'
                            ? 'Market'
                            : filterLevelPrice(
                                item[1].orderPrice.price,
                                unit,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals,
                                buyUnit,
                                filterSide(item[1].orderPrice) === 'Buy'
                                  ? 'bid'
                                  : 'ask'
                              )
                        }}
                      </span>
                      <span>
                        {{
                          Object.keys(item[1].orderType)[0] === 'MKT'
                            ? filterPriceMKTFilled(
                                filterTotalMKTFilled(
                                  item[1],
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                ),
                                filterAmountMKTFilled(
                                  item[1],
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals,
                                  tokenMinUnit
                                ),
                                buyUnit
                              )
                            : `(${filterFilledPrice(
                                filterTotalFilled(
                                  item[1].filled,
                                  filterSide(item[1].orderPrice),
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                ),
                                filterFilledAmount(
                                  item[1].filled,
                                  filterSide(item[1].orderPrice),
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals,
                                  tokenMinUnit
                                ),
                                buyUnit
                              )})`
                        }}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span
                      class="order-filled"
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <span class="order-filled-color">
                        {{
                          Object.keys(item[1].orderType)[0] === 'MKT'
                            ? filterAmountMKT(
                                item[1].orderPrice,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokenMinUnit
                              )
                            : filterAmount(
                                item[1].orderPrice,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokenMinUnit
                              )
                        }}
                      </span>
                      <span>
                        ({{
                          Object.keys(item[1].orderType)[0] === 'MKT'
                            ? filterAmountMKTFilled(
                                item[1],
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokenMinUnit
                              )
                            : filterFilledAmount(
                                item[1].filled,
                                filterSide(item[1].orderPrice),
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokenMinUnit
                              )
                        }})
                      </span>
                    </span>
                  </td>
                  <td>
                    <span
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()] &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                    >
                      <span v-if="Object.keys(item[1].orderType)[0] === 'MKT'">
                        {{ filterFilledMKT(item[1]) }}
                      </span>
                      <span v-else>
                        {{
                          filterFilled(
                            item[1].filled,
                            filterSide(item[1].orderPrice),
                            filterAmount(
                              item[1].orderPrice,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            ),
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                        }}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span
                      class="order-filled"
                      v-if="
                        currentPair &&
                        unit &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()] &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        buyUnit.toString()
                      "
                    >
                      <span>
                        <span
                          class="order-filled-color"
                          v-if="Object.keys(item[1].orderType)[0] === 'MKT'"
                        >
                          {{ filterTotalMKT(item[1].orderPrice) }}
                        </span>
                        <span class="order-filled-color" v-else>
                          {{
                            filterTotal(
                              filterLevelPrice(
                                item[1].orderPrice.price,
                                unit,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals,
                                buyUnit,
                                filterSide(item[1].orderPrice) === 'Buy'
                                  ? 'bid'
                                  : 'ask'
                              ),
                              filterAmount(
                                item[1].orderPrice,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokenMinUnit
                              ),
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                          }}
                        </span>
                      </span>
                      <span>
                        <span
                          v-if="Object.keys(item[1].orderType)[0] === 'MKT'"
                        >
                          ({{
                            filterTotalMKTFilled(
                              item[1],
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                          }})
                        </span>
                        <span v-else>
                          ({{
                            filterTotalFilled(
                              item[1].filled,
                              filterSide(item[1].orderPrice),
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                          }})
                        </span>
                        {{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </span>
                    </span>
                  </td>
                  <td>
                    <div class="pending-status-td">
                      <span :class="getPendingStatus(item[1])">
                        {{ getPendingStatus(item[1]) }}
                      </span>
                      <span
                        v-show="
                          getPendingStatus(item[1]) === 'Prepared' ||
                          Object.keys(item[1].status)[0] === 'Todo' ||
                          (toStatus &&
                            (getOrderStatus(item[1].toids) === 'Doing' ||
                              getOrderStatus(item[1].toids) === 'Todo'))
                        "
                        class="loading-spinner"
                      ></span>
                    </div>
                  </td>
                  <td>
                    <span v-if="item[1].toids.length">
                      <a
                        style="color: rgba(52, 119, 181, 0.7)"
                        :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/${currentPair[0].toString()}/${item[1].toids[
                          item[1].toids.length - 1
                        ].toString(10)}`"
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{ getOrderStatus(item[1].toids) }}
                      </a>
                    </span>
                    <span v-else>-</span>
                  </td>
                  <!--<td>
                    <span
                      v-if="
                        getPendingStatus(item[1]) === 'Pending' &&
                        Object.keys(item[1].status)[0] !== 'Todo' &&
                        (getOrderStatus(item[1].toids) === 'Done' ||
                          !item[1].toids.length)
                      "
                      class="cancel-pending"
                      @click="cancel(item[1], true)"
                      >Cancel</span
                    >
                  </td>-->
                </tr>
              </tbody>
            </table>
          </div>
          <a-pagination
            class="pagination"
            v-show="
              !isH5 &&
              currentTradeMenuPro === 'pending' &&
              pendingListPro.length > 10
            "
            :current="currentPendingProPage"
            :defaultPageSize="10"
            :total="pendingListPro.length"
            @change="changePendingPro"
          />
          <div class="overflow-scroll">
            <table v-show="!isH5 && currentTradeMenuPro === 'history'">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Txid</th>
                  <th>Side</th>
                  <th>Order</th>
                  <th>Filled</th>
                  <th>Avg.Price</th>
                  <th>
                    Fee
                    <a-tooltip placement="top">
                      <template slot="title"
                        >Fee includes trading fee, network gas, brokerage and
                        maker yield, negative values indicate income.</template
                      >
                      <a-icon class="pointer" type="question-circle" />
                    </a-tooltip>
                  </th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody
                v-loading="userRecordProLoading"
                element-loading-background="rgba(0, 0, 0, 0)"
              >
                <tr v-show="!userRecordProLoading && !userRecordPro.length">
                  <td colspan="7"><div class="empty">No Trade</div></td>
                </tr>
                <tr
                  v-for="(item, index) in userRecordPro.slice(
                    (currentHistoryPagePro - 1) * 10,
                    currentHistoryPagePro * 10
                  )"
                  :key="index"
                >
                  <td class="swap-transfer-list-time">
                    <span v-if="item.details && item.details.length">
                      {{
                        item.details[item.details.length - 1].time
                          | formatDateFromNanosecondUTC
                      }}
                    </span>
                    <span v-else>
                      {{ item.time | formatDateFromNanosecondUTC }}
                    </span>
                  </td>
                  <td class="swap-transfer-list-id">
                    <copy-account
                      v-if="currentPair"
                      :front="10"
                      :is-copy="false"
                      :href="`https://ic.house/swap/${currentPair[0].toString()}/${filterTxid(
                        item.txid
                      )}`"
                      :account="filterTxid(item.txid)"
                      copyText="Txid"
                    ></copy-account>
                  </td>
                  <td
                    :class="{
                      'ask-price':
                        getTradeSide(item.filled.token0Value) === 'Sell',
                      'bid-price':
                        getTradeSide(item.filled.token0Value) === 'Buy'
                    }"
                  >
                    {{ getTradeSide(item.filled.token0Value) }}
                  </td>
                  <td>
                    <a-tooltip
                      placement="topLeft"
                      :overlay-style="{
                        whiteSpace: 'nowrap',
                        maxWidth: 'max-content'
                      }"
                    >
                      <template slot="title">
                        <div
                          class="swap-info swap-info-tooltip"
                          v-if="
                            item.order.token0Value.length &&
                            item.order.token1Value.length
                          "
                        >
                          <span
                            v-if="
                              Object.keys(item.order.token0Value[0])[0] ===
                                'DebitRecord' &&
                              tokens &&
                              tokens[currentPair[1][0].token0[0].toString()]
                            "
                          >
                            {{
                              Object.values(item.order.token0Value[0])[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </span>
                          <span
                            v-if="
                              tokens &&
                              currentPair &&
                              tokens[currentPair[1][0].token1[0].toString()] &&
                              Object.keys(item.order.token1Value[0])[0] ===
                                'DebitRecord'
                            "
                          >
                            {{
                              Object.values(item.order.token1Value[0])[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </span>
                          ->
                          <span
                            v-if="
                              Object.keys(item.order.token0Value[0])[0] ===
                                'CreditRecord' &&
                              tokens &&
                              tokens[currentPair[1][0].token0[0].toString()]
                            "
                          >
                            {{
                              Object.values(item.order.token0Value[0])[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </span>
                          <span
                            v-if="
                              tokens &&
                              currentPair &&
                              tokens[currentPair[1][0].token1[0].toString()] &&
                              Object.keys(item.order.token1Value[0])[0] ===
                                'CreditRecord'
                            "
                          >
                            {{
                              Object.values(item.order.token1Value[0])[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </span>
                        </div>
                      </template>
                      <div class="swap-info">
                        <span
                          v-if="
                            item.order.token0Value[0] &&
                            Object.keys(item.order.token0Value[0])[0] ===
                              'DebitRecord' &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token0[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(item.order.token0Value[0])[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPair &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            item.order.token1Value[0] &&
                            Object.keys(item.order.token1Value[0])[0] ===
                              'DebitRecord'
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token1[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(item.order.token1Value[0])[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                        ->
                        <span
                          v-if="
                            item.order.token0Value[0] &&
                            Object.keys(item.order.token0Value[0])[0] ===
                              'CreditRecord' &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token0[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(item.order.token0Value[0])[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPair &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            item.order.token1Value[0] &&
                            Object.keys(item.order.token1Value[0])[0] ===
                              'CreditRecord'
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token1[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(item.order.token1Value[0])[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPair &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            Object.keys(item.orderType[0])[0] === 'MKT' &&
                            item.order.token0Value[0]
                          "
                        >
                          ?(market)
                          {{
                            tokens[currentPair[1][0].token1[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPair &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            Object.keys(item.orderType[0])[0] === 'MKT' &&
                            item.order.token1Value[0]
                          "
                        >
                          ?(market)
                          {{
                            tokens[currentPair[1][0].token0[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span v-if="Object.keys(item.orderType[0])[0] !== 'MKT'"
                          >(price:{{ getOrderPrice(item, buyUnit) }})</span
                        >
                      </div>
                    </a-tooltip>
                  </td>
                  <td>
                    <div
                      v-if="
                        Object.keys(item.status)[0] === 'Cancelled' ||
                        !item.details.length
                      "
                    >
                      -
                    </div>
                    <div v-else>
                      <a-tooltip
                        placement="topLeft"
                        :overlay-style="{
                          whiteSpace: 'nowrap',
                          maxWidth: 'max-content'
                        }"
                      >
                        <template slot="title">
                          <div
                            class="swap-info swap-info-tooltip"
                            v-if="item.details && item.details.length > 1"
                          >
                            <span class="swap-info-detail">Latest:</span>
                            <span
                              v-if="
                                Object.keys(
                                  item.details[item.details.length - 1]
                                    .token0Value
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[currentPair[1][0].token0[0].toString()]
                              "
                            >
                              {{
                                Object.values(
                                  item.details[item.details.length - 1]
                                    .token0Value
                                )[0]
                                  | bigintToFloat(
                                    Math.min(
                                      tokens[
                                        currentPair[1][0].token0[0].toString()
                                      ].decimals,
                                      8
                                    ),
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .symbol
                              }}
                            </span>
                            <span
                              v-if="
                                tokens &&
                                currentPair &&
                                tokens[
                                  currentPair[1][0].token1[0].toString()
                                ] &&
                                Object.keys(
                                  item.details[item.details.length - 1]
                                    .token1Value
                                )[0] === 'DebitRecord'
                              "
                            >
                              {{
                                Object.values(
                                  item.details[item.details.length - 1]
                                    .token1Value
                                )[0]
                                  | bigintToFloat(
                                    Math.min(
                                      tokens[
                                        currentPair[1][0].token1[0].toString()
                                      ].decimals,
                                      8
                                    ),
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .symbol
                              }}
                            </span>
                            ->
                            <span
                              v-if="
                                Object.keys(
                                  item.details[item.details.length - 1]
                                    .token0Value
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[currentPair[1][0].token0[0].toString()]
                              "
                            >
                              {{
                                Object.values(
                                  item.details[item.details.length - 1]
                                    .token0Value
                                )[0]
                                  | bigintToFloat(
                                    Math.min(
                                      tokens[
                                        currentPair[1][0].token0[0].toString()
                                      ].decimals,
                                      8
                                    ),
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .symbol
                              }}
                            </span>
                            <span
                              v-if="
                                tokens &&
                                currentPair &&
                                tokens[
                                  currentPair[1][0].token1[0].toString()
                                ] &&
                                Object.keys(
                                  item.details[item.details.length - 1]
                                    .token1Value
                                )[0] === 'CreditRecord'
                              "
                            >
                              {{
                                Object.values(
                                  item.details[item.details.length - 1]
                                    .token1Value
                                )[0]
                                  | bigintToFloat(
                                    Math.min(
                                      tokens[
                                        currentPair[1][0].token1[0].toString()
                                      ].decimals,
                                      8
                                    ),
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .symbol
                              }}
                            </span>
                          </div>
                          <div class="swap-info swap-info-tooltip">
                            <span
                              v-if="item.details && item.details.length > 1"
                              class="swap-info-detail"
                              >Total:</span
                            >
                            <span
                              v-if="
                                Object.keys(item.filled.token0Value)[0] ===
                                  'DebitRecord' &&
                                currentPair &&
                                tokens &&
                                tokens[currentPair[1][0].token0[0].toString()]
                              "
                            >
                              {{
                                Object.values(item.filled.token0Value)[0]
                                  | bigintToFloat(
                                    Math.min(
                                      tokens[
                                        currentPair[1][0].token0[0].toString()
                                      ].decimals,
                                      8
                                    ),
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals
                                  )
                              }}&nbsp;{{
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .symbol
                              }}
                            </span>
                            <span
                              v-if="
                                Object.keys(item.filled.token1Value)[0] ===
                                  'DebitRecord' &&
                                currentPair &&
                                tokens &&
                                tokens[currentPair[1][0].token1[0].toString()]
                              "
                            >
                              {{
                                Object.values(item.filled.token1Value)[0]
                                  | bigintToFloat(
                                    Math.min(
                                      tokens[
                                        currentPair[1][0].token1[0].toString()
                                      ].decimals,
                                      8
                                    ),
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals
                                  )
                              }}&nbsp;{{
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .symbol
                              }}
                            </span>
                            ->
                            <span
                              v-if="
                                Object.keys(item.filled.token0Value)[0] ===
                                  'CreditRecord' &&
                                tokens &&
                                tokens[currentPair[1][0].token0[0].toString()]
                              "
                            >
                              {{
                                Object.values(item.filled.token0Value)[0]
                                  | bigintToFloat(
                                    Math.min(
                                      tokens[
                                        currentPair[1][0].token0[0].toString()
                                      ].decimals,
                                      8
                                    ),
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals
                                  )
                              }}&nbsp;{{
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .symbol
                              }}
                            </span>
                            <span
                              v-if="
                                tokens &&
                                currentPair &&
                                tokens[
                                  currentPair[1][0].token1[0].toString()
                                ] &&
                                Object.keys(item.filled.token1Value)[0] ===
                                  'CreditRecord'
                              "
                            >
                              {{
                                Object.values(item.filled.token1Value)[0]
                                  | bigintToFloat(
                                    Math.min(
                                      tokens[
                                        currentPair[1][0].token1[0].toString()
                                      ].decimals,
                                      8
                                    ),
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals
                                  )
                              }}&nbsp;{{
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .symbol
                              }}
                            </span>
                          </div>
                        </template>
                        <div
                          class="swap-info"
                          v-if="item.details && item.details.length > 1"
                        >
                          <span class="swap-info-detail">Latest:</span>
                          <span
                            v-if="
                              Object.keys(
                                item.details[item.details.length - 1]
                                  .token0Value
                              )[0] === 'DebitRecord' &&
                              tokens &&
                              tokens[currentPair[1][0].token0[0].toString()]
                            "
                          >
                            <a
                              :href="
                                currentPair[1][0].token0[0].toString() ===
                                'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                  ? `https://ic.house/ICP/address/${getPrincipalId}`
                                  : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                              "
                              target="_blank"
                              class="token-id-rocks"
                              rel="nofollow noreferrer noopener"
                            >
                              {{
                                Object.values(
                                  item.details[item.details.length - 1]
                                    .token0Value
                                )[0]
                                  | bigintToFloat(
                                    4,
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .symbol
                              }}
                            </a>
                          </span>
                          <span
                            v-if="
                              tokens &&
                              currentPair &&
                              tokens[currentPair[1][0].token1[0].toString()] &&
                              Object.keys(
                                item.details[item.details.length - 1]
                                  .token1Value
                              )[0] === 'DebitRecord'
                            "
                          >
                            <a
                              :href="
                                currentPair[1][0].token1[0].toString() ===
                                'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                  ? `https://ic.house/ICP/address/${getPrincipalId}`
                                  : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                              "
                              target="_blank"
                              class="token-id-rocks"
                              rel="nofollow noreferrer noopener"
                            >
                              {{
                                Object.values(
                                  item.details[item.details.length - 1]
                                    .token1Value
                                )[0]
                                  | bigintToFloat(
                                    4,
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .symbol
                              }}
                            </a>
                          </span>
                          ->
                          <span
                            v-if="
                              Object.keys(
                                item.details[item.details.length - 1]
                                  .token0Value
                              )[0] === 'CreditRecord' &&
                              tokens &&
                              tokens[currentPair[1][0].token0[0].toString()]
                            "
                          >
                            <a
                              :href="
                                currentPair[1][0].token0[0].toString() ===
                                'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                  ? `https://ic.house/ICP/address/${getPrincipalId}`
                                  : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                              "
                              target="_blank"
                              class="token-id-rocks"
                              rel="nofollow noreferrer noopener"
                            >
                              {{
                                Object.values(
                                  item.details[item.details.length - 1]
                                    .token0Value
                                )[0]
                                  | bigintToFloat(
                                    4,
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .symbol
                              }}
                            </a>
                          </span>
                          <span
                            v-if="
                              tokens &&
                              currentPair &&
                              tokens[currentPair[1][0].token1[0].toString()] &&
                              Object.keys(
                                item.details[item.details.length - 1]
                                  .token1Value
                              )[0] === 'CreditRecord'
                            "
                          >
                            <a
                              :href="
                                currentPair[1][0].token1[0].toString() ===
                                'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                  ? `https://ic.house/ICP/address/${getPrincipalId}`
                                  : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                              "
                              target="_blank"
                              class="token-id-rocks"
                              rel="nofollow noreferrer noopener"
                            >
                              {{
                                Object.values(
                                  item.details[item.details.length - 1]
                                    .token1Value
                                )[0]
                                  | bigintToFloat(
                                    4,
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .symbol
                              }}
                            </a>
                          </span>
                        </div>
                        <div class="swap-info">
                          <span
                            class="swap-info-detail"
                            v-if="item.details && item.details.length > 1"
                            >Total:</span
                          >
                          <span
                            v-if="
                              Object.keys(item.filled.token0Value)[0] ===
                                'DebitRecord' &&
                              tokens &&
                              tokens[currentPair[1][0].token0[0].toString()]
                            "
                          >
                            <a
                              :href="
                                currentPair[1][0].token0[0].toString() ===
                                'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                  ? `https://ic.house/ICP/address/${getPrincipalId}`
                                  : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                              "
                              target="_blank"
                              class="token-id-rocks"
                              rel="nofollow noreferrer noopener"
                            >
                              {{
                                Object.values(item.filled.token0Value)[0]
                                  | bigintToFloat(
                                    4,
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .symbol
                              }}
                            </a>
                          </span>
                          <span
                            v-if="
                              tokens &&
                              currentPair &&
                              tokens[currentPair[1][0].token1[0].toString()] &&
                              Object.keys(item.filled.token1Value)[0] ===
                                'DebitRecord'
                            "
                          >
                            <a
                              :href="
                                currentPair[1][0].token1[0].toString() ===
                                'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                  ? `https://ic.house/ICP/address/${getPrincipalId}`
                                  : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                              "
                              target="_blank"
                              class="token-id-rocks"
                              rel="nofollow noreferrer noopener"
                            >
                              {{
                                Object.values(item.filled.token1Value)[0]
                                  | bigintToFloat(
                                    4,
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .symbol
                              }}
                            </a>
                          </span>
                          ->
                          <span
                            v-if="
                              Object.keys(item.filled.token0Value)[0] ===
                                'CreditRecord' &&
                              tokens &&
                              tokens[currentPair[1][0].token0[0].toString()]
                            "
                          >
                            <a
                              :href="
                                currentPair[1][0].token0[0].toString() ===
                                'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                  ? `https://ic.house/ICP/address/${getPrincipalId}`
                                  : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                              "
                              target="_blank"
                              class="token-id-rocks"
                              rel="nofollow noreferrer noopener"
                            >
                              {{
                                Object.values(item.filled.token0Value)[0]
                                  | bigintToFloat(
                                    4,
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .symbol
                              }}
                            </a>
                          </span>
                          <span
                            v-if="
                              tokens &&
                              currentPair &&
                              tokens[currentPair[1][0].token1[0].toString()] &&
                              Object.keys(item.filled.token1Value)[0] ===
                                'CreditRecord'
                            "
                          >
                            <a
                              :href="
                                currentPair[1][0].token1[0].toString() ===
                                'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                  ? `https://ic.house/ICP/address/${getPrincipalId}`
                                  : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                              "
                              target="_blank"
                              class="token-id-rocks"
                              rel="nofollow noreferrer noopener"
                            >
                              {{
                                Object.values(item.filled.token1Value)[0]
                                  | bigintToFloat(
                                    4,
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals
                                  )
                              }}
                              {{
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .symbol
                              }}
                            </a>
                          </span>
                        </div>
                      </a-tooltip>
                    </div>
                  </td>
                  <td>
                    <div v-if="Object.keys(item.status)[0] === 'Cancelled'">
                      -
                    </div>
                    <div v-else>{{ getAvgPrice(item, buyUnit) }}</div>
                  </td>
                  <td>
                    <span
                      v-if="
                        tokens && tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <span :class="{ 'fee-come': item.fee.token0Fee < 0 }">{{
                        getTradeFee(item)
                      }}</span>
                      &nbsp;<span
                        :class="{ 'fee-come': item.fee.token1Fee < 0 }"
                        >{{ getTradeFee(item, false) }}</span
                      >
                      <span v-if="!item.fee.token0Fee && !item.fee.token1Fee"
                        >-</span
                      >
                    </span>
                  </td>
                  <td>
                    <span
                      class="history-status"
                      :class="Object.keys(item.status)[0]"
                      >{{ Object.keys(item.status)[0] }}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <a-pagination
            class="pagination"
            v-show="
              !isH5 &&
              currentTradeMenuPro === 'history' &&
              userRecordPro.length > 10
            "
            :current="currentHistoryPagePro"
            :defaultPageSize="10"
            :total="userRecordPro.length"
            @change="changeHistoryPro"
          />
        </div>
        <div class="overflow-scroll">
          <table v-show="!isH5 && currentTradeMenu === 'history'">
            <thead>
              <tr>
                <th>Time</th>
                <th>Txid</th>
                <th>Side</th>
                <th>Order</th>
                <th>Filled</th>
                <th>Avg.Price</th>
                <th>
                  Fee
                  <a-tooltip placement="top">
                    <template slot="title"
                      >Fee includes trading fee, network gas, brokerage and
                      maker yield, negative values indicate income.</template
                    >
                    <a-icon class="pointer" type="question-circle" />
                  </a-tooltip>
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-show="!userRecord.length">
                <td colspan="7"><div class="empty">No Trade</div></td>
              </tr>
              <tr
                v-for="(item, index) in userRecord.slice(
                  (currentHistoryPage - 1) * 10,
                  currentHistoryPage * 10
                )"
                :key="index"
              >
                <td class="swap-transfer-list-time">
                  <span v-if="item.details && item.details.length">
                    {{
                      item.details[item.details.length - 1].time
                        | formatDateFromNanosecondUTC
                    }}
                  </span>
                  <span v-else>
                    {{ item.time | formatDateFromNanosecondUTC }}
                  </span>
                </td>
                <td class="swap-transfer-list-id">
                  <copy-account
                    v-if="currentPair"
                    :front="10"
                    :is-copy="false"
                    :href="`https://ic.house/swap/${currentPair[0].toString()}/${filterTxid(
                      item.txid
                    )}`"
                    :account="filterTxid(item.txid)"
                    copyText="Txid"
                  ></copy-account>
                </td>
                <td
                  :class="{
                    'ask-price':
                      getTradeSide(item.filled.token0Value) === 'Sell',
                    'bid-price': getTradeSide(item.filled.token0Value) === 'Buy'
                  }"
                >
                  {{ getTradeSide(item.filled.token0Value) }}
                </td>
                <td>
                  <a-tooltip
                    placement="topLeft"
                    :overlay-style="{
                      whiteSpace: 'nowrap',
                      maxWidth: 'max-content'
                    }"
                  >
                    <template slot="title">
                      <div
                        class="swap-info swap-info-tooltip"
                        v-if="
                          item.order.token0Value.length &&
                          item.order.token1Value.length
                        "
                      >
                        <span
                          v-if="
                            Object.keys(item.order.token0Value[0])[0] ===
                              'DebitRecord' &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          {{
                            Object.values(item.order.token0Value[0])[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals,
                                  8
                                ),
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals
                              )
                          }}
                          {{
                            tokens[currentPair[1][0].token0[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPair &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            Object.keys(item.order.token1Value[0])[0] ===
                              'DebitRecord'
                          "
                        >
                          {{
                            Object.values(item.order.token1Value[0])[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals,
                                  8
                                ),
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals
                              )
                          }}
                          {{
                            tokens[currentPair[1][0].token1[0].toString()]
                              .symbol
                          }}
                        </span>
                        ->
                        <span
                          v-if="
                            Object.keys(item.order.token0Value[0])[0] ===
                              'CreditRecord' &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          {{
                            Object.values(item.order.token0Value[0])[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals,
                                  8
                                ),
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals
                              )
                          }}
                          {{
                            tokens[currentPair[1][0].token0[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPair &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            Object.keys(item.order.token1Value[0])[0] ===
                              'CreditRecord'
                          "
                        >
                          {{
                            Object.values(item.order.token1Value[0])[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals,
                                  8
                                ),
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals
                              )
                          }}
                          {{
                            tokens[currentPair[1][0].token1[0].toString()]
                              .symbol
                          }}
                        </span>
                      </div>
                    </template>
                    <div class="swap-info">
                      <span
                        v-if="
                          item.order.token0Value[0] &&
                          Object.keys(item.order.token0Value[0])[0] ===
                            'DebitRecord' &&
                          tokens &&
                          tokens[currentPair[1][0].token0[0].toString()]
                        "
                      >
                        <a
                          :href="
                            currentPair[1][0].token0[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                          "
                          target="_blank"
                          class="token-id-rocks"
                          rel="nofollow noreferrer noopener"
                        >
                          {{
                            Object.values(item.order.token0Value[0])[0]
                              | bigintToFloat(
                                4,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals
                              )
                          }}
                          {{
                            tokens[currentPair[1][0].token0[0].toString()]
                              .symbol
                          }}
                        </a>
                      </span>
                      <span
                        v-if="
                          tokens &&
                          currentPair &&
                          tokens[currentPair[1][0].token1[0].toString()] &&
                          item.order.token1Value[0] &&
                          Object.keys(item.order.token1Value[0])[0] ===
                            'DebitRecord'
                        "
                      >
                        <a
                          :href="
                            currentPair[1][0].token1[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                          "
                          target="_blank"
                          class="token-id-rocks"
                          rel="nofollow noreferrer noopener"
                        >
                          {{
                            Object.values(item.order.token1Value[0])[0]
                              | bigintToFloat(
                                4,
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals
                              )
                          }}
                          {{
                            tokens[currentPair[1][0].token1[0].toString()]
                              .symbol
                          }}
                        </a>
                      </span>
                      ->
                      <span
                        v-if="
                          item.order.token0Value[0] &&
                          Object.keys(item.order.token0Value[0])[0] ===
                            'CreditRecord' &&
                          tokens &&
                          tokens[currentPair[1][0].token0[0].toString()]
                        "
                      >
                        <a
                          :href="
                            currentPair[1][0].token0[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                          "
                          target="_blank"
                          class="token-id-rocks"
                          rel="nofollow noreferrer noopener"
                        >
                          {{
                            Object.values(item.order.token0Value[0])[0]
                              | bigintToFloat(
                                4,
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals
                              )
                          }}
                          {{
                            tokens[currentPair[1][0].token0[0].toString()]
                              .symbol
                          }}
                        </a>
                      </span>
                      <span
                        v-if="
                          tokens &&
                          currentPair &&
                          tokens[currentPair[1][0].token1[0].toString()] &&
                          item.order.token1Value[0] &&
                          Object.keys(item.order.token1Value[0])[0] ===
                            'CreditRecord'
                        "
                      >
                        <a
                          :href="
                            currentPair[1][0].token1[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                          "
                          target="_blank"
                          class="token-id-rocks"
                          rel="nofollow noreferrer noopener"
                        >
                          {{
                            Object.values(item.order.token1Value[0])[0]
                              | bigintToFloat(
                                4,
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals
                              )
                          }}
                          {{
                            tokens[currentPair[1][0].token1[0].toString()]
                              .symbol
                          }}
                        </a>
                      </span>
                      <span
                        v-if="
                          tokens &&
                          currentPair &&
                          tokens[currentPair[1][0].token1[0].toString()] &&
                          Object.keys(item.orderType[0])[0] === 'MKT' &&
                          item.order.token0Value[0]
                        "
                      >
                        ?(market)
                        {{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </span>
                      <span
                        v-if="
                          tokens &&
                          currentPair &&
                          tokens[currentPair[1][0].token0[0].toString()] &&
                          Object.keys(item.orderType[0])[0] === 'MKT' &&
                          item.order.token1Value[0]
                        "
                      >
                        ?(market)
                        {{
                          tokens[currentPair[1][0].token0[0].toString()].symbol
                        }}
                      </span>
                      <span v-if="Object.keys(item.orderType[0])[0] !== 'MKT'"
                        >(price:{{ getOrderPrice(item, buyUnit) }})</span
                      >
                    </div>
                  </a-tooltip>
                </td>
                <td>
                  <div
                    v-if="
                      Object.keys(item.status)[0] === 'Cancelled' ||
                      !item.details.length
                    "
                  >
                    -
                  </div>
                  <div v-else>
                    <a-tooltip
                      placement="topLeft"
                      :overlay-style="{
                        whiteSpace: 'nowrap',
                        maxWidth: 'max-content'
                      }"
                    >
                      <template slot="title">
                        <div
                          class="swap-info swap-info-tooltip"
                          v-if="item.details && item.details.length > 1"
                        >
                          <span class="swap-info-detail">Latest:</span>
                          <span
                            v-if="
                              Object.keys(
                                item.details[item.details.length - 1]
                                  .token0Value
                              )[0] === 'DebitRecord' &&
                              tokens &&
                              tokens[currentPair[1][0].token0[0].toString()]
                            "
                          >
                            {{
                              Object.values(
                                item.details[item.details.length - 1]
                                  .token0Value
                              )[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </span>
                          <span
                            v-if="
                              tokens &&
                              currentPair &&
                              tokens[currentPair[1][0].token1[0].toString()] &&
                              Object.keys(
                                item.details[item.details.length - 1]
                                  .token1Value
                              )[0] === 'DebitRecord'
                            "
                          >
                            {{
                              Object.values(
                                item.details[item.details.length - 1]
                                  .token1Value
                              )[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </span>
                          ->
                          <span
                            v-if="
                              Object.keys(
                                item.details[item.details.length - 1]
                                  .token0Value
                              )[0] === 'CreditRecord' &&
                              tokens &&
                              tokens[currentPair[1][0].token0[0].toString()]
                            "
                          >
                            {{
                              Object.values(
                                item.details[item.details.length - 1]
                                  .token0Value
                              )[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </span>
                          <span
                            v-if="
                              tokens &&
                              currentPair &&
                              tokens[currentPair[1][0].token1[0].toString()] &&
                              Object.keys(
                                item.details[item.details.length - 1]
                                  .token1Value
                              )[0] === 'CreditRecord'
                            "
                          >
                            {{
                              Object.values(
                                item.details[item.details.length - 1]
                                  .token1Value
                              )[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </span>
                        </div>
                        <div class="swap-info swap-info-tooltip">
                          <span
                            v-if="item.details && item.details.length > 1"
                            class="swap-info-detail"
                            >Total:</span
                          >
                          <span
                            v-if="
                              Object.keys(item.filled.token0Value)[0] ===
                                'DebitRecord' &&
                              currentPair &&
                              tokens &&
                              tokens[currentPair[1][0].token0[0].toString()]
                            "
                          >
                            {{
                              Object.values(item.filled.token0Value)[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}&nbsp;{{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </span>
                          <span
                            v-if="
                              Object.keys(item.filled.token1Value)[0] ===
                                'DebitRecord' &&
                              currentPair &&
                              tokens &&
                              tokens[currentPair[1][0].token1[0].toString()]
                            "
                          >
                            {{
                              Object.values(item.filled.token1Value)[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}&nbsp;{{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </span>
                          ->
                          <span
                            v-if="
                              Object.keys(item.filled.token0Value)[0] ===
                                'CreditRecord' &&
                              tokens &&
                              tokens[currentPair[1][0].token0[0].toString()]
                            "
                          >
                            {{
                              Object.values(item.filled.token0Value)[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token0[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}&nbsp;{{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </span>
                          <span
                            v-if="
                              tokens &&
                              currentPair &&
                              tokens[currentPair[1][0].token1[0].toString()] &&
                              Object.keys(item.filled.token1Value)[0] ===
                                'CreditRecord'
                            "
                          >
                            {{
                              Object.values(item.filled.token1Value)[0]
                                | bigintToFloat(
                                  Math.min(
                                    tokens[
                                      currentPair[1][0].token1[0].toString()
                                    ].decimals,
                                    8
                                  ),
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}&nbsp;{{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </span>
                        </div>
                      </template>
                      <div
                        class="swap-info"
                        v-if="item.details && item.details.length > 1"
                      >
                        <span class="swap-info-detail">Latest:</span>
                        <span
                          v-if="
                            Object.keys(
                              item.details[item.details.length - 1].token0Value
                            )[0] === 'DebitRecord' &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token0[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(
                                item.details[item.details.length - 1]
                                  .token0Value
                              )[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPair &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            Object.keys(
                              item.details[item.details.length - 1].token1Value
                            )[0] === 'DebitRecord'
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token1[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(
                                item.details[item.details.length - 1]
                                  .token1Value
                              )[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                        ->
                        <span
                          v-if="
                            Object.keys(
                              item.details[item.details.length - 1].token0Value
                            )[0] === 'CreditRecord' &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token0[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(
                                item.details[item.details.length - 1]
                                  .token0Value
                              )[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPair &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            Object.keys(
                              item.details[item.details.length - 1].token1Value
                            )[0] === 'CreditRecord'
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token1[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(
                                item.details[item.details.length - 1]
                                  .token1Value
                              )[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                      </div>
                      <div class="swap-info">
                        <span
                          class="swap-info-detail"
                          v-if="item.details && item.details.length > 1"
                          >Total:</span
                        >
                        <span
                          v-if="
                            Object.keys(item.filled.token0Value)[0] ===
                              'DebitRecord' &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token0[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(item.filled.token0Value)[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPair &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            Object.keys(item.filled.token1Value)[0] ===
                              'DebitRecord'
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token1[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(item.filled.token1Value)[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                        ->
                        <span
                          v-if="
                            Object.keys(item.filled.token0Value)[0] ===
                              'CreditRecord' &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()]
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token0[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(item.filled.token0Value)[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token0[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPair &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            Object.keys(item.filled.token1Value)[0] ===
                              'CreditRecord'
                          "
                        >
                          <a
                            :href="
                              currentPair[1][0].token1[0].toString() ===
                              'ryjl3-tyaaa-aaaaa-aaaba-cai'
                                ? `https://ic.house/ICP/address/${getPrincipalId}`
                                : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                            "
                            target="_blank"
                            class="token-id-rocks"
                            rel="nofollow noreferrer noopener"
                          >
                            {{
                              Object.values(item.filled.token1Value)[0]
                                | bigintToFloat(
                                  4,
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals
                                )
                            }}
                            {{
                              tokens[currentPair[1][0].token1[0].toString()]
                                .symbol
                            }}
                          </a>
                        </span>
                      </div>
                    </a-tooltip>
                  </div>
                </td>
                <td>
                  <div v-if="Object.keys(item.status)[0] === 'Cancelled'">
                    -
                  </div>
                  <div v-else>{{ getAvgPrice(item, buyUnit) }}</div>
                </td>
                <td>
                  <span
                    v-if="
                      tokens && tokens[currentPair[1][0].token0[0].toString()]
                    "
                    style="display: flex; flex-direction: column"
                  >
                    <span :class="{ 'fee-come': item.fee.token0Fee < 0 }">{{
                      getTradeFee(item)
                    }}</span>
                    <span :class="{ 'fee-come': item.fee.token1Fee < 0 }">{{
                      getTradeFee(item, false)
                    }}</span>
                    <span v-if="!item.fee.token0Fee && !item.fee.token1Fee"
                      >-</span
                    >
                  </span>
                </td>
                <td>
                  <span
                    class="history-status"
                    :class="Object.keys(item.status)[0]"
                    >{{ Object.keys(item.status)[0] }}</span
                  >
                </td>
                <!--<td>
						<span
							v-if="tokens && tokens[currentPair[1][0].token0[0].toString()]"
							>{{ getTradeTotal(item) }}</span
						>
					</td>-->
              </tr>
            </tbody>
          </table>
        </div>
        <a-pagination
          class="pagination"
          v-show="
            !isH5 && currentTradeMenu === 'history' && userRecord.length > 10
          "
          :current="currentHistoryPage"
          :defaultPageSize="10"
          :total="userRecord.length"
          @change="changeHistory"
        />
        <div class="overflow-scroll">
          <table v-show="!isH5 && currentTradeMenu === 'pending'">
            <thead>
              <tr>
                <th>Time</th>
                <th>Txid</th>
                <th>Type</th>
                <th>Side</th>
                <th>Price(filled)</th>
                <th>Quantity(filled)</th>
                <th>Filled</th>
                <th>Total(filled)</th>
                <th>Status</th>
                <th>ICTC</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody
              v-loading="pendingLoading"
              element-loading-background="rgba(0, 0, 0, 0)"
            >
              <tr v-show="!pendingLoading && !pendingList.length">
                <td colspan="10"><div class="empty">No Orders</div></td>
              </tr>
              <tr
                v-for="(item, index) in pendingList.slice(
                  (currentPendingPage - 1) * 10,
                  currentPendingPage * 10
                )"
                :key="index"
              >
                <td class="swap-transfer-list-time">
                  {{ item[1].time | formatDateFromNanosecondUTC }}
                </td>
                <td>
                  <copy-account
                    :account="filterTxid(item[1].txid)"
                    copyText="Txid"
                  ></copy-account>
                </td>
                <td class="order-filled-color">
                  {{ Object.keys(item[1].orderType)[0] }}
                </td>
                <td
                  :class="{
                    'ask-price': filterSide(item[1].orderPrice) === 'Sell',
                    'bid-price': filterSide(item[1].orderPrice) === 'Buy'
                  }"
                >
                  {{ filterSide(item[1].orderPrice) }}
                </td>
                <td>
                  <span
                    class="order-filled"
                    v-if="
                      unit &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      buyUnit.toString()
                    "
                  >
                    <span class="order-filled-color">
                      {{
                        Object.keys(item[1].orderType)[0] === 'MKT'
                          ? 'Market'
                          : filterLevelPrice(
                              item[1].orderPrice.price,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              buyUnit,
                              filterSide(item[1].orderPrice) === 'Buy'
                                ? 'bid'
                                : 'ask'
                            )
                      }}
                    </span>
                    <span>
                      {{
                        Object.keys(item[1].orderType)[0] === 'MKT'
                          ? filterPriceMKTFilled(
                              filterTotalMKTFilled(
                                item[1],
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals
                              ),
                              filterAmountMKTFilled(
                                item[1],
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokenMinUnit
                              ),
                              buyUnit
                            )
                          : `(${filterFilledPrice(
                              filterTotalFilled(
                                item[1].filled,
                                filterSide(item[1].orderPrice),
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals
                              ),
                              filterFilledAmount(
                                item[1].filled,
                                filterSide(item[1].orderPrice),
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals,
                                tokenMinUnit
                              ),
                              buyUnit
                            )})`
                      }}
                    </span>
                  </span>
                </td>
                <td>
                  <span
                    class="order-filled"
                    v-if="
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    <span class="order-filled-color">
                      {{
                        Object.keys(item[1].orderType)[0] === 'MKT'
                          ? filterAmountMKT(
                              item[1].orderPrice,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                          : filterAmount(
                              item[1].orderPrice,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                      }}
                    </span>
                    <span>
                      ({{
                        Object.keys(item[1].orderType)[0] === 'MKT'
                          ? filterAmountMKTFilled(
                              item[1],
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                          : filterFilledAmount(
                              item[1].filled,
                              filterSide(item[1].orderPrice),
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                      }})
                    </span>
                  </span>
                </td>
                <td>
                  <span
                    v-if="
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()]
                    "
                  >
                    <span v-if="Object.keys(item[1].orderType)[0] === 'MKT'">
                      {{ filterFilledMKT(item[1]) }}
                    </span>
                    <span v-else>
                      {{
                        filterFilled(
                          item[1].filled,
                          filterSide(item[1].orderPrice),
                          filterAmount(
                            item[1].orderPrice,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          ),
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                      }}
                    </span>
                  </span>
                </td>
                <td>
                  <span
                    class="order-filled"
                    v-if="
                      currentPair &&
                      unit &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      buyUnit.toString()
                    "
                  >
                    <span>
                      <span
                        class="order-filled-color"
                        v-if="Object.keys(item[1].orderType)[0] === 'MKT'"
                      >
                        {{ filterTotalMKT(item[1].orderPrice) }}
                      </span>
                      <span class="order-filled-color" v-else>
                        {{
                          filterTotal(
                            filterLevelPrice(
                              item[1].orderPrice.price,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              buyUnit,
                              filterSide(item[1].orderPrice) === 'Buy'
                                ? 'bid'
                                : 'ask'
                            ),
                            filterAmount(
                              item[1].orderPrice,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            ),
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                        }}
                      </span>
                    </span>
                    <span>
                      <span v-if="Object.keys(item[1].orderType)[0] === 'MKT'">
                        ({{
                          filterTotalMKTFilled(
                            item[1],
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                        }})
                      </span>
                      <span v-else>
                        ({{
                          filterTotalFilled(
                            item[1].filled,
                            filterSide(item[1].orderPrice),
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                        }})
                      </span>
                      {{
                        tokens[currentPair[1][0].token1[0].toString()].symbol
                      }}
                    </span>
                  </span>
                </td>
                <td>
                  <div class="pending-status-td">
                    <span :class="getPendingStatus(item[1])">{{
                      getPendingStatus(item[1])
                    }}</span>
                    <span
                      v-show="
                        getPendingStatus(item[1]) === 'Prepared' ||
                        Object.keys(item[1].status)[0] === 'Todo' ||
                        (toStatus &&
                          (getOrderStatus(item[1].toids) === 'Doing' ||
                            getOrderStatus(item[1].toids) === 'Todo'))
                      "
                      class="loading-spinner"
                    ></span>
                    <!--<span
                      class="err-tip"
                      v-if="
                        toStatus && getOrderStatus(item[1].toids) === 'Doing'
                      "
                      >({{ getOrderStatus(item[1].toids) }})</span
                    >-->
                  </div>
                </td>
                <td>
                  <span v-if="item[1].toids.length">
                    <a
                      style="color: rgba(52, 119, 181, 0.7)"
                      :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/${currentPair[0].toString()}/${item[1].toids[
                        item[1].toids.length - 1
                      ].toString(10)}`"
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{ getOrderStatus(item[1].toids) }}
                    </a>
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span
                    v-if="
                      getPendingStatus(item[1]) === 'Pending' &&
                      Object.keys(item[1].status)[0] !== 'Todo' &&
                      (getOrderStatus(item[1].toids) === 'Done' ||
                        !item[1].toids.length)
                    "
                    class="cancel-pending"
                    @click="cancel(item[1])"
                    >Cancel</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <a-pagination
          class="pagination"
          v-show="!isH5 && currentTradeMenu === 'pending' && totalPending > 10"
          :current="currentPendingPage"
          :defaultPageSize="10"
          :total="totalPending"
          @change="changePending"
        />
        <div class="overflow-scroll">
          <table v-show="!isH5 && currentTradeMenu === 'stop'">
            <thead>
              <tr>
                <th>Time</th>
                <th>Soid</th>
                <th>Side</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Filled</th>
                <th>Total</th>
                <th>Trigger Conditions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody element-loading-background="rgba(0, 0, 0, 0)">
              <tr v-show="!stopOrders.length">
                <td colspan="8"><div class="empty">No Orders</div></td>
              </tr>
              <tr v-for="item in stopOrders" :key="item.soid.toString()">
                <td>{{ item.initTime | formatDateFromSecondUTC }}</td>
                <td>{{ item.soid.toString() }}</td>
                <td>
                  <span
                    :class="{
                      'ask-price':
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Sell',
                      'bid-price':
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Buy'
                    }"
                  >
                    {{
                      Object.keys(
                        item.strategy.StopLossOrder.condition.order.side
                      )[0]
                    }}
                  </span>
                </td>
                <td>
                  <span class="order-filled">
                    <span
                      v-if="
                        currentPair &&
                        unit &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()] &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        buyUnit.toString()
                      "
                    >
                      {{
                        filterLevelPrice(
                          item.strategy.StopLossOrder.condition.order.price,
                          unit,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          buyUnit,
                          Object.keys(
                            item.strategy.StopLossOrder.condition.order.side
                          )[0] === 'Buy'
                            ? 'bid'
                            : 'ask'
                        )
                      }}
                    </span>
                  </span>
                </td>
                <td>
                  <span class="order-filled">
                    <span
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()] &&
                        tokenMinUnit
                      "
                    >
                      {{
                        filterQuantity(
                          item.strategy.StopLossOrder.condition.order.quantity,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokenMinUnit
                        )
                      }}
                    </span>
                  </span>
                </td>
                <td>
                  <span>
                    {{ filterStopLossFilled(item) }}
                  </span>
                </td>
                <td>
                  <span class="order-filled">
                    <span
                      v-if="
                        currentPair &&
                        unit &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()] &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        buyUnit.toString() &&
                        tokenMinUnit
                      "
                    >
                      {{
                        filterTotal(
                          filterLevelPrice(
                            item.strategy.StopLossOrder.condition.order.price,
                            unit,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            buyUnit,
                            Object.keys(
                              item.strategy.StopLossOrder.condition.order.side
                            )[0] === 'Buy'
                              ? 'bid'
                              : 'ask'
                          ),
                          filterQuantity(
                            item.strategy.StopLossOrder.condition.order
                              .quantity,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                        )
                      }}
                      {{
                        tokens[currentPair[1][0].token1[0].toString()].symbol
                      }}</span
                    >
                  </span>
                </td>
                <td>
                  <span
                    v-if="
                      currentPair &&
                      unit &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      buyUnit.toString()
                    "
                  >
                    <span
                      v-if="
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Sell'
                      "
                    >
                      <span v-text="'<='"></span>
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Buy'
                      "
                    >
                      >=
                    </span>
                    {{
                      filterLevelPrice(
                        item.strategy.StopLossOrder.condition.triggerPrice,
                        unit,
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        buyUnit,
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Buy'
                          ? 'bid'
                          : 'ask'
                      )
                    }}
                    <img
                      v-if="item.strategy.StopLossOrder.triggeredOrder.length"
                      class="checked"
                      style="width: 12px"
                      src="@/assets/img/checked.png"
                      alt=""
                    />
                  </span>
                </td>
                <td>
                  <span
                    v-if="item.strategy.StopLossOrder.triggeredOrder.length"
                    class="base-font-title"
                  >
                    Submitted
                    <a-tooltip placement="top">
                      <template slot="title">
                        <div>Order has been submitted to orderbook.</div>
                        <div
                          v-if="
                            Object.keys(
                              item.strategy.StopLossOrder.condition.order.side
                            )[0] === 'Buy' &&
                            item.pendingOrders &&
                            item.pendingOrders.buy &&
                            item.pendingOrders.buy[0] &&
                            item.pendingOrders.buy[0][0] &&
                            item.pendingOrders.buy[0][0][0]
                          "
                          class="flex-center"
                        >
                          Txid:&nbsp;
                          <copy-account
                            :account="
                              filterTxid(item.pendingOrders.buy[0][0][0])
                            "
                            copyText="Txid"
                          ></copy-account>
                        </div>
                        <div
                          v-if="
                            Object.keys(
                              item.strategy.StopLossOrder.condition.order.side
                            )[0] === 'Sell' &&
                            item.pendingOrders &&
                            item.pendingOrders.sell &&
                            item.pendingOrders.sell[0] &&
                            item.pendingOrders.sell[0][0] &&
                            item.pendingOrders.sell[0][0][0]
                          "
                          class="flex-center"
                        >
                          Txid:&nbsp;
                          <copy-account
                            :account="
                              filterTxid(item.pendingOrders.sell[0][0][0])
                            "
                            copyText="Txid"
                          ></copy-account>
                        </div>
                        <div>
                          Time: {{ item.triggerTime | formatDateFromSecondUTC }}
                        </div>
                      </template>
                      <a-icon type="info-circle" />
                    </a-tooltip>
                  </span>
                  <span v-else class="base-font-title">
                    {{ Object.keys(item.status)[0] }}
                  </span>
                </td>
                <td>
                  <span
                    v-if="Object.keys(item.status)[0] === 'Running'"
                    class="cancel-pending"
                    @click="onDeleteStopLoss(item.soid)"
                    >Cancel</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pending-h5" v-show="isH5 && currentTradeMenu === 'pending'">
          <ul>
            <li v-for="(item, index) in pendingList" :key="index">
              <div class="pending-header-h5">
                <div
                  class="k-interval-main-header-h5-left-name"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <span>
                    {{
                      tokens[currentPair[1][0].token0[0].toString()].symbol
                    }}/{{
                      tokens[currentPair[1][0].token1[0].toString()].symbol
                    }}
                  </span>
                  <span
                    :class="{
                      'ask-price': filterSide(item[1].orderPrice) === 'Sell',
                      'bid-price': filterSide(item[1].orderPrice) === 'Buy'
                    }"
                  >
                    {{ filterSide(item[1].orderPrice) }}
                  </span>
                  <span
                    :class="{
                      'ask-price': filterSide(item[1].orderPrice) === 'Sell',
                      'bid-price': filterSide(item[1].orderPrice) === 'Buy'
                    }"
                  >
                    {{ Object.keys(item[1].orderType)[0] }}
                  </span>
                </div>
                <div class="margin-left-auto">
                  <span
                    v-if="
                      getPendingStatus(item[1]) === 'Pending' &&
                      Object.keys(item[1].status)[0] !== 'Todo' &&
                      (getOrderStatus(item[1].toids) === 'Done' ||
                        !item[1].toids.length)
                    "
                    class="cancel-pending"
                    @click="cancel(item[1])"
                    >Cancel</span
                  >
                  <div v-else class="pending-status-td">
                    {{ getPendingStatus(item[1]) }}
                    <span
                      v-show="
                        getPendingStatus(item[1]) === 'Prepared' ||
                        Object.keys(item[1].status)[0] === 'Todo' ||
                        (toStatus &&
                          (getOrderStatus(item[1].toids) === 'Doing' ||
                            getOrderStatus(item[1].toids) === 'Todo'))
                      "
                      class="loading-spinner"
                    ></span>
                  </div>
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Quantity(filled)</span>
                <span
                  class="order-filled pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()]
                  "
                >
                  <span class="order-filled-color">
                    {{
                      Object.keys(item[1].orderType)[0] === 'MKT'
                        ? filterAmountMKT(
                            item[1].orderPrice,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                        : filterAmount(
                            item[1].orderPrice,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                    }}
                  </span>
                  <span>
                    ({{
                      Object.keys(item[1].orderType)[0] === 'MKT'
                        ? filterAmountMKTFilled(
                            item[1],
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                        : filterFilledAmount(
                            item[1].filled,
                            filterSide(item[1].orderPrice),
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                    }})
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Price(filled)</span>
                <span
                  class="order-filled pending-item-right"
                  v-if="
                    unit &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    buyUnit.toString()
                  "
                >
                  <span class="order-filled-color">
                    {{
                      Object.keys(item[1].orderType)[0] === 'MKT'
                        ? 'Market'
                        : filterLevelPrice(
                            item[1].orderPrice.price,
                            unit,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            buyUnit,
                            filterSide(item[1].orderPrice) === 'Buy'
                              ? 'bid'
                              : 'ask'
                          )
                    }}
                  </span>
                  <span>
                    ({{
                      Object.keys(item[1].orderType)[0] === 'MKT'
                        ? filterPriceMKTFilled(
                            filterTotalMKTFilled(
                              item[1],
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            ),
                            filterAmountMKTFilled(
                              item[1],
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            ),
                            buyUnit
                          )
                        : filterFilledPrice(
                            filterTotalFilled(
                              item[1].filled,
                              filterSide(item[1].orderPrice),
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            ),
                            filterFilledAmount(
                              item[1].filled,
                              filterSide(item[1].orderPrice),
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            ),
                            buyUnit
                          )
                    }})
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Total(filled)</span>
                <span
                  class="order-filled pending-item-right"
                  v-if="
                    currentPair &&
                    unit &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    buyUnit.toString()
                  "
                >
                  <span>
                    <span
                      class="order-filled-color"
                      v-if="Object.keys(item[1].orderType)[0] === 'MKT'"
                    >
                      {{ filterTotalMKT(item[1].orderPrice) }}
                    </span>
                    <span class="order-filled-color" v-else>
                      {{
                        filterTotal(
                          filterLevelPrice(
                            item[1].orderPrice.price,
                            unit,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            buyUnit,
                            filterSide(item[1].orderPrice) === 'Buy'
                              ? 'bid'
                              : 'ask'
                          ),
                          filterAmount(
                            item[1].orderPrice,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          ),
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                      }}
                      <!--{{ tokens[currentPair[1][0].token1[0].toString()].symbol }}-->
                    </span>
                  </span>
                  <span>
                    <span v-if="Object.keys(item[1].orderType)[0] === 'MKT'">
                      ({{
                        filterTotalMKTFilled(
                          item[1],
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                      }})
                    </span>
                    <span v-else>
                      ({{
                        filterTotalFilled(
                          item[1].filled,
                          filterSide(item[1].orderPrice),
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                      }})
                    </span>
                    {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Filled</span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <span v-if="Object.keys(item[1].orderType)[0] === 'MKT'">
                    {{ filterFilledMKT(item[1]) }}
                  </span>
                  <span v-else>
                    {{
                      filterFilled(
                        item[1].filled,
                        filterSide(item[1].orderPrice),
                        filterAmount(
                          item[1].orderPrice,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokenMinUnit
                        ),
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                    }}
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Time</span>
                <span class="pending-item-right">{{
                  item[1].time | formatDateFromNanosecondUTC
                }}</span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Txid</span>
                <span class="pending-item-right">
                  <copy-account
                    :account="filterTxid(item[1].txid)"
                    copyText="Txid"
                  ></copy-account>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">ICTC</span>
                <span class="pending-item-right">
                  <span v-if="item[1].toids.length">
                    <a
                      style="color: rgba(52, 119, 181, 0.7)"
                      :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/${currentPair[0].toString()}/${item[1].toids[
                        item[1].toids.length - 1
                      ].toString(10)}`"
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{ getOrderStatus(item[1].toids) }}
                    </a>
                  </span>
                  <span v-else>-</span>
                </span>
              </div>
            </li>
            <li v-if="!pendingList.length" class="text-center">No Orders</li>
          </ul>
        </div>
        <div class="pending-h5" v-show="isH5 && currentTradeMenu === 'stop'">
          <ul>
            <li v-for="(item, index) in stopOrders" :key="index">
              <div class="pending-header-h5">
                <div
                  class="k-interval-main-header-h5-left-name"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <span>
                    {{
                      tokens[currentPair[1][0].token0[0].toString()].symbol
                    }}/{{
                      tokens[currentPair[1][0].token1[0].toString()].symbol
                    }}
                  </span>
                  <span
                    :class="{
                      'ask-price':
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Sell',
                      'bid-price':
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Buy'
                    }"
                  >
                    {{
                      Object.keys(
                        item.strategy.StopLossOrder.condition.order.side
                      )[0]
                    }}
                  </span>
                </div>
                <div class="margin-left-auto">
                  <span
                    v-if="Object.keys(item.status)[0] === 'Running'"
                    class="cancel-pending"
                    @click="onDeleteStopLoss(item.soid)"
                    >Cancel</span
                  >
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Quantity</span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokenMinUnit
                  "
                >
                  {{
                    filterQuantity(
                      item.strategy.StopLossOrder.condition.order.quantity,
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokenMinUnit
                    )
                  }}
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Price</span>
                <span class="pending-item-right">
                  <span
                    v-if="
                      currentPair &&
                      unit &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      buyUnit.toString()
                    "
                  >
                    {{
                      filterLevelPrice(
                        item.strategy.StopLossOrder.condition.order.price,
                        unit,
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        buyUnit,
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Buy'
                          ? 'bid'
                          : 'ask'
                      )
                    }}
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Conditions</span>
                <span class="pending-item-right">
                  <span
                    v-if="
                      currentPair &&
                      unit &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      buyUnit.toString()
                    "
                  >
                    <span
                      v-if="
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Sell'
                      "
                    >
                      <span v-text="'<='"></span>
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Buy'
                      "
                    >
                      >=
                    </span>
                    {{
                      filterLevelPrice(
                        item.strategy.StopLossOrder.condition.triggerPrice,
                        unit,
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        buyUnit,
                        Object.keys(
                          item.strategy.StopLossOrder.condition.order.side
                        )[0] === 'Buy'
                          ? 'bid'
                          : 'ask'
                      )
                    }}
                    <img
                      v-if="item.strategy.StopLossOrder.triggeredOrder.length"
                      class="checked"
                      style="width: 12px"
                      src="@/assets/img/checked.png"
                      alt=""
                    />
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Total</span>
                <span class="pending-item-right">
                  <span
                    v-if="
                      currentPair &&
                      unit &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      buyUnit.toString() &&
                      tokenMinUnit
                    "
                  >
                    {{
                      filterTotal(
                        filterLevelPrice(
                          item.strategy.StopLossOrder.condition.order.price,
                          unit,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          buyUnit,
                          Object.keys(
                            item.strategy.StopLossOrder.condition.order.side
                          )[0] === 'Buy'
                            ? 'bid'
                            : 'ask'
                        ),
                        filterQuantity(
                          item.strategy.StopLossOrder.condition.order.quantity,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokenMinUnit
                        )
                      )
                    }}
                    {{
                      tokens[currentPair[1][0].token1[0].toString()].symbol
                    }}</span
                  >
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Filled</span>
                <span class="pending-item-right">
                  {{ filterStopLossFilled(item) }}
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Soid</span>
                <span class="pending-item-right">
                  {{ item.soid.toString() }}
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Time</span>
                <span class="pending-item-right">
                  {{ item.initTime | formatDateFromSecondUTC }}
                </span>
              </div>
            </li>
            <li v-if="!stopOrders.length" class="text-center">No Orders</li>
          </ul>
        </div>
        <div class="pending-h5" v-show="isH5 && currentTradeMenu === 'history'">
          <ul>
            <li v-for="(item, index) in userRecord" :key="index">
              <div class="pending-header-h5">
                <div
                  class="k-interval-main-header-h5-left-name"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <span>
                    {{
                      tokens[currentPair[1][0].token0[0].toString()].symbol
                    }}/{{
                      tokens[currentPair[1][0].token1[0].toString()].symbol
                    }}
                  </span>
                  <span
                    :class="{
                      'ask-price':
                        getTradeSide(item.filled.token0Value) === 'Sell',
                      'bid-price':
                        getTradeSide(item.filled.token0Value) === 'Buy'
                    }"
                  >
                    {{ getTradeSide(item.filled.token0Value) }}
                  </span>
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Order</span>
                <div class="swap-info pending-item-right">
                  <span
                    v-if="
                      item.order.token0Value[0] &&
                      Object.keys(item.order.token0Value[0])[0] ===
                        'DebitRecord' &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    <a
                      :href="
                        currentPair[1][0].token0[0].toString() ===
                        'ryjl3-tyaaa-aaaaa-aaaba-cai'
                          ? `https://ic.house/ICP/address/${getPrincipalId}`
                          : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                      "
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{
                        Object.values(item.order.token0Value[0])[0]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                      }}
                      {{
                        tokens[currentPair[1][0].token0[0].toString()].symbol
                      }}
                    </a>
                  </span>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      item.order.token1Value[0] &&
                      Object.keys(item.order.token1Value[0])[0] ===
                        'DebitRecord'
                    "
                  >
                    <a
                      :href="
                        currentPair[1][0].token1[0].toString() ===
                        'ryjl3-tyaaa-aaaaa-aaaba-cai'
                          ? `https://ic.house/ICP/address/${getPrincipalId}`
                          : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                      "
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{
                        Object.values(item.order.token1Value[0])[0]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                      }}
                      {{
                        tokens[currentPair[1][0].token1[0].toString()].symbol
                      }}
                    </a>
                  </span>
                  ->
                  <span
                    v-if="
                      item.order.token0Value[0] &&
                      Object.keys(item.order.token0Value[0])[0] ===
                        'CreditRecord' &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    <a
                      :href="
                        currentPair[1][0].token0[0].toString() ===
                        'ryjl3-tyaaa-aaaaa-aaaba-cai'
                          ? `https://ic.house/ICP/address/${getPrincipalId}`
                          : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                      "
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{
                        Object.values(item.order.token0Value[0])[0]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                      }}
                      {{
                        tokens[currentPair[1][0].token0[0].toString()].symbol
                      }}
                    </a>
                  </span>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      item.order.token1Value[0] &&
                      Object.keys(item.order.token1Value[0])[0] ===
                        'CreditRecord'
                    "
                  >
                    <a
                      :href="
                        currentPair[1][0].token1[0].toString() ===
                        'ryjl3-tyaaa-aaaaa-aaaba-cai'
                          ? `https://ic.house/ICP/address/${getPrincipalId}`
                          : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                      "
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{
                        Object.values(item.order.token1Value[0])[0]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                      }}
                      {{
                        tokens[currentPair[1][0].token1[0].toString()].symbol
                      }}
                    </a>
                  </span>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      Object.keys(item.orderType[0])[0] === 'MKT' &&
                      item.order.token0Value[0]
                    "
                  >
                    ?(market)
                    {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                  </span>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      Object.keys(item.orderType[0])[0] === 'MKT' &&
                      item.order.token1Value[0]
                    "
                  >
                    ?(market)
                    {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
                  </span>
                  <span v-if="Object.keys(item.orderType[0])[0] !== 'MKT'"
                    >(price:{{ getOrderPrice(item, buyUnit) }})</span
                  >
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Filled</span>
                <div
                  class="swap-info pending-item-right"
                  v-if="
                    Object.keys(item.status)[0] === 'Cancelled' ||
                    !item.details.length
                  "
                >
                  -
                </div>
                <div v-else class="pending-item-right">
                  <div
                    class="swap-info"
                    v-if="item.details && item.details.length > 1"
                  >
                    <span class="swap-info-detail">Latest:</span>
                    <span
                      v-if="
                        Object.keys(
                          item.details[item.details.length - 1].token0Value
                        )[0] === 'DebitRecord' &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token0[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(
                            item.details[item.details.length - 1].token0Value
                          )[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals
                            )
                        }}
                        {{
                          tokens[currentPair[1][0].token0[0].toString()].symbol
                        }}
                      </a>
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPair &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        Object.keys(
                          item.details[item.details.length - 1].token1Value
                        )[0] === 'DebitRecord'
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token1[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(
                            item.details[item.details.length - 1].token1Value
                          )[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                        }}
                        {{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </a>
                    </span>
                    ->
                    <span
                      v-if="
                        Object.keys(
                          item.details[item.details.length - 1].token0Value
                        )[0] === 'CreditRecord' &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token0[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(
                            item.details[item.details.length - 1].token0Value
                          )[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals
                            )
                        }}
                        {{
                          tokens[currentPair[1][0].token0[0].toString()].symbol
                        }}
                      </a>
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPair &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        Object.keys(
                          item.details[item.details.length - 1].token1Value
                        )[0] === 'CreditRecord'
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token1[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(
                            item.details[item.details.length - 1].token1Value
                          )[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                        }}
                        {{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </a>
                    </span>
                  </div>
                  <div class="swap-info">
                    <span
                      v-if="item.details && item.details.length > 1"
                      class="swap-info-detail"
                      >Total:</span
                    >
                    <span
                      v-if="
                        Object.keys(item.filled.token0Value)[0] ===
                          'DebitRecord' &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token0[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(item.filled.token0Value)[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals
                            )
                        }}&nbsp;{{
                          tokens[currentPair[1][0].token0[0].toString()].symbol
                        }}
                      </a>
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPair &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        Object.keys(item.filled.token1Value)[0] ===
                          'DebitRecord'
                      "
                      ><a
                        :href="
                          currentPair[1][0].token1[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(item.filled.token1Value)[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                        }}&nbsp;{{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </a>
                    </span>
                    ->
                    <span
                      v-if="
                        Object.keys(item.filled.token0Value)[0] ===
                          'CreditRecord' &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token0[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                        >{{
                          Object.values(item.filled.token0Value)[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals
                            )
                        }}&nbsp;{{
                          tokens[currentPair[1][0].token0[0].toString()].symbol
                        }}</a
                      >
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPair &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        Object.keys(item.filled.token1Value)[0] ===
                          'CreditRecord'
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token1[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(item.filled.token1Value)[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                        }}&nbsp;{{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Avg.Price</span>
                <span
                  v-if="Object.keys(item.status)[0] === 'Cancelled'"
                  class="pending-item-right"
                >
                  -
                </span>
                <span v-else class="pending-item-right">
                  {{ getAvgPrice(item, buyUnit) }}
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left"
                  >Fee
                  <a-tooltip placement="top">
                    <template slot="title"
                      >Fee includes trading fee, network gas, brokerage and
                      maker yield, negative values indicate income.</template
                    >
                    <a-icon
                      class="pointer"
                      type="question-circle"
                    /> </a-tooltip
                ></span>
                <span class="pending-item-right">
                  <span
                    v-if="
                      tokens && tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    <span :class="{ 'fee-come': item.fee.token0Fee < 0 }">{{
                      getTradeFee(item)
                    }}</span>
                    &nbsp;<span
                      :class="{ 'fee-come': item.fee.token1Fee < 0 }"
                      >{{ getTradeFee(item, false) }}</span
                    >
                    <span v-if="!item.fee.token0Fee && !item.fee.token1Fee"
                      >-</span
                    >
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Txid</span>
                <span class="pending-item-right">
                  <copy-account
                    v-if="currentPair"
                    :front="10"
                    :is-copy="false"
                    :href="`https://ic.house/swap/${currentPair[0].toString()}/${filterTxid(
                      item.txid
                    )}`"
                    :account="filterTxid(item.txid)"
                    copyText="Txid"
                  ></copy-account>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Time</span>
                <span class="pending-item-right">
                  <span v-if="item.details && item.details.length">
                    {{
                      item.details[item.details.length - 1].time
                        | formatDateFromNanosecondUTC
                    }}
                  </span>
                  <span v-else>
                    {{ item.time | formatDateFromNanosecondUTC }}
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Status</span>
                <span class="pending-item-right">
                  <span
                    class="history-status"
                    :class="Object.keys(item.status)[0]"
                    >{{ Object.keys(item.status)[0] }}</span
                  >
                </span>
              </div>
            </li>
            <li v-if="!userRecord.length" class="text-center">No Trades</li>
          </ul>
        </div>
        <div class="pending-h5" v-show="isH5 && currentTradeMenu === 'pro'">
          <ul class="flex-center pending-h5-pro" style="flex-direction: row">
            <li
              :class="{ active: menu.value === currentTradeMenuPro }"
              v-for="(menu, index) in tradeMenuPro"
              :key="index"
              @click="changeTradeMenuPro(menu.value)"
            >
              {{ menu.name }}
            </li>
          </ul>
          <ul v-show="currentTradeMenuPro === 'orders'">
            <li v-for="(item, index) in proOrders" :key="index">
              <div class="pending-header-h5">
                <div
                  class="k-interval-main-header-h5-left-name"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <span>
                    {{
                      tokens[currentPair[1][0].token0[0].toString()].symbol
                    }}/{{
                      tokens[currentPair[1][0].token1[0].toString()].symbol
                    }}
                  </span>
                  <span>
                    {{ Object.keys(item.stType)[0] }}
                  </span>
                </div>
                <div class="margin-left-auto">
                  <span
                    class="cancel-pending"
                    v-if="
                      Object.keys(item.status)[0] === 'Running' ||
                      Object.keys(item.status)[0] === 'Stopped'
                    "
                    @click="onUpdateProOrder(item)"
                  >
                    Update
                  </span>
                  <span
                    class="cancel-pending"
                    v-if="Object.keys(item.status)[0] === 'Running'"
                    @click="onStopProOrder(item.soid, item.stType)"
                  >
                    Stop
                  </span>
                  <span
                    class="cancel-pending"
                    v-if="
                      Object.keys(item.status)[0] === 'Running' ||
                      Object.keys(item.status)[0] === 'Stopped'
                    "
                    @click="onDeleteProOrder(item.soid, item.stType)"
                  >
                    Delete
                  </span>
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Status</span>
                <span class="pending-item-right">
                  {{ Object.keys(item.status)[0] }}
                </span>
              </div>
              <div class="pending-item pending-item-pro">
                <span class="pending-item-left">Strategy</span>
              </div>
              <div
                v-if="Object.keys(item.stType)[0] === 'GridOrder'"
                class="pending-item pending-item-pro-item"
              >
                <span class="pending-item-left">lowerLimit</span>
                <span class="pending-item-right">
                  <span
                    v-if="
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      unit &&
                      buyUnit
                    "
                  >
                    {{
                      filterLevelPrice(
                        item.strategy.GridOrder.setting.lowerLimit,
                        unit,
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        buyUnit
                      )
                    }}
                  </span>
                </span>
              </div>
              <div
                v-if="Object.keys(item.stType)[0] === 'GridOrder'"
                class="pending-item pending-item-pro-item"
              >
                <span class="pending-item-left">upperLimit</span>
                <span class="pending-item-right">
                  <span
                    v-if="
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      unit &&
                      buyUnit
                    "
                  >
                    {{
                      filterLevelPrice(
                        item.strategy.GridOrder.setting.upperLimit,
                        unit,
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        buyUnit
                      )
                    }}
                  </span>
                </span>
              </div>
              <div
                v-if="Object.keys(item.stType)[0] === 'GridOrder'"
                class="pending-item pending-item-pro-item"
              >
                <span class="pending-item-left">gridCountPerSide</span>
                <span class="pending-item-right">
                  {{ item.strategy.GridOrder.setting.gridCountPerSide }}
                </span>
              </div>
              <div
                v-if="Object.keys(item.stType)[0] === 'GridOrder'"
                class="pending-item pending-item-pro-item"
              >
                <span class="pending-item-left">spread</span>
                <span class="pending-item-right">
                  <span
                    v-if="
                      Object.keys(item.strategy.GridOrder.setting.spread)[0] ===
                      'Geom'
                    "
                  >
                    Geometric:
                    {{
                      item.strategy.GridOrder.setting.spread.Geom | filterPpm
                    }}
                  </span>
                  <span
                    v-if="
                      Object.keys(item.strategy.GridOrder.setting.spread)[0] ===
                        'Arith' &&
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token1[0].toString()].decimals &&
                      unit &&
                      buyUnit
                    "
                  >
                    Arithmetic:
                    {{
                      filterLevelPrice(
                        item.strategy.GridOrder.setting.spread.Arith,
                        unit,
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        buyUnit
                      )
                    }}
                  </span>
                </span>
              </div>
              <div
                v-if="Object.keys(item.stType)[0] === 'GridOrder'"
                class="pending-item pending-item-pro-item"
              >
                <span class="pending-item-left">Amount</span>
                <span class="pending-item-right">
                  <span
                    v-if="
                      Object.keys(item.strategy.GridOrder.setting.amount)[0] ===
                      'Percent'
                    "
                  >
                    Percent:
                    <span
                      v-if="
                        item.strategy.GridOrder.setting.amount.Percent.length
                      "
                      >{{
                        item.strategy.GridOrder.setting.amount.Percent[0]
                          | filterPpm
                      }}</span
                    >
                    <span v-else>-</span>
                  </span>
                  <span
                    v-if="
                      Object.keys(item.strategy.GridOrder.setting.amount)[0] ===
                        'Token0' &&
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()].decimals
                    "
                  >
                    {{
                      item.strategy.GridOrder.setting.amount.Token0
                        | bigintToFloat(
                          tokenMinUnit,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                    }}
                    {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
                  </span>
                  <span
                    v-if="
                      Object.keys(item.strategy.GridOrder.setting.amount)[0] ===
                        'Token1' &&
                      currentPair &&
                      tokens &&
                      tokens[currentPair[1][0].token1[0].toString()].decimals
                    "
                  >
                    {{
                      item.strategy.GridOrder.setting.amount.Token1
                        | bigintToFloat(
                          buyUnit,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                    }}
                    {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                  </span>
                </span>
              </div>
              <div class="pending-item pending-item-pro">
                <span class="pending-item-left">Stats</span>
              </div>
              <div class="pending-item pending-item-pro-item">
                <span class="pending-item-left">orderCount</span>
                <span class="pending-item-right">
                  {{ item.stats.orderCount }}
                </span>
              </div>
              <div class="pending-item pending-item-pro-item">
                <span class="pending-item-left">errorCount</span>
                <span class="pending-item-right">
                  {{ item.stats.errorCount }}
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Soid</span>
                <span class="pending-item-right">
                  <copy-account
                    :account="item.soid.toString(10)"
                    copyText="Soid"
                  ></copy-account>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Time</span>
                <span class="pending-item-right">
                  {{ item.initTime | formatDateFromSecondUTC }}
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Last trigger time</span>
                <span class="pending-item-right">
                  {{ item.triggerTime | formatDateFromSecondUTC }}
                </span>
              </div>
            </li>
            <li v-if="!proOrders.length" class="text-center">No Orders</li>
          </ul>
          <ul v-show="currentTradeMenuPro === 'pending'">
            <li v-for="(item, index) in pendingListPro" :key="index">
              <div class="pending-header-h5">
                <div
                  class="k-interval-main-header-h5-left-name"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <span>
                    {{
                      tokens[currentPair[1][0].token0[0].toString()].symbol
                    }}/{{
                      tokens[currentPair[1][0].token1[0].toString()].symbol
                    }}
                  </span>
                  <span
                    :class="{
                      'ask-price': filterSide(item[1].orderPrice) === 'Sell',
                      'bid-price': filterSide(item[1].orderPrice) === 'Buy'
                    }"
                  >
                    {{ filterSide(item[1].orderPrice) }}
                  </span>
                  <span
                    :class="{
                      'ask-price': filterSide(item[1].orderPrice) === 'Sell',
                      'bid-price': filterSide(item[1].orderPrice) === 'Buy'
                    }"
                  >
                    {{ Object.keys(item[1].orderType)[0] }}
                  </span>
                </div>
                <div class="margin-left-auto">
                  <!--<span
                    v-if="
                      getPendingStatus(item[1]) === 'Pending' &&
                      Object.keys(item[1].status)[0] !== 'Todo' &&
                      (getOrderStatus(item[1].toids) === 'Done' ||
                        !item[1].toids.length)
                    "
                    class="cancel-pending"
                    @click="cancel(item[1])"
                    >Cancel</span
                  >-->
                  <div class="pending-status-td">
                    {{ getPendingStatus(item[1]) }}
                    <span
                      v-show="
                        getPendingStatus(item[1]) === 'Prepared' ||
                        Object.keys(item[1].status)[0] === 'Todo' ||
                        (toStatus &&
                          (getOrderStatus(item[1].toids) === 'Doing' ||
                            getOrderStatus(item[1].toids) === 'Todo'))
                      "
                      class="loading-spinner"
                    ></span>
                  </div>
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Quantity(filled)</span>
                <span
                  class="order-filled pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()]
                  "
                >
                  <span class="order-filled-color">
                    {{
                      Object.keys(item[1].orderType)[0] === 'MKT'
                        ? filterAmountMKT(
                            item[1].orderPrice,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                        : filterAmount(
                            item[1].orderPrice,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                    }}
                  </span>
                  <span>
                    ({{
                      Object.keys(item[1].orderType)[0] === 'MKT'
                        ? filterAmountMKTFilled(
                            item[1],
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                        : filterFilledAmount(
                            item[1].filled,
                            filterSide(item[1].orderPrice),
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                    }})
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Price(filled)</span>
                <span
                  class="order-filled pending-item-right"
                  v-if="
                    unit &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    buyUnit.toString()
                  "
                >
                  <span class="order-filled-color">
                    {{
                      Object.keys(item[1].orderType)[0] === 'MKT'
                        ? 'Market'
                        : filterLevelPrice(
                            item[1].orderPrice.price,
                            unit,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            buyUnit,
                            filterSide(item[1].orderPrice) === 'Buy'
                              ? 'bid'
                              : 'ask'
                          )
                    }}
                  </span>
                  <span>
                    ({{
                      Object.keys(item[1].orderType)[0] === 'MKT'
                        ? filterPriceMKTFilled(
                            filterTotalMKTFilled(
                              item[1],
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            ),
                            filterAmountMKTFilled(
                              item[1],
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            ),
                            buyUnit
                          )
                        : filterFilledPrice(
                            filterTotalFilled(
                              item[1].filled,
                              filterSide(item[1].orderPrice),
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            ),
                            filterFilledAmount(
                              item[1].filled,
                              filterSide(item[1].orderPrice),
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            ),
                            buyUnit
                          )
                    }})
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Total(filled)</span>
                <span
                  class="order-filled pending-item-right"
                  v-if="
                    currentPair &&
                    unit &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    buyUnit.toString()
                  "
                >
                  <span>
                    <span
                      class="order-filled-color"
                      v-if="Object.keys(item[1].orderType)[0] === 'MKT'"
                    >
                      {{ filterTotalMKT(item[1].orderPrice) }}
                    </span>
                    <span class="order-filled-color" v-else>
                      {{
                        filterTotal(
                          filterLevelPrice(
                            item[1].orderPrice.price,
                            unit,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            buyUnit,
                            filterSide(item[1].orderPrice) === 'Buy'
                              ? 'bid'
                              : 'ask'
                          ),
                          filterAmount(
                            item[1].orderPrice,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          ),
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                      }}
                      <!--{{ tokens[currentPair[1][0].token1[0].toString()].symbol }}-->
                    </span>
                  </span>
                  <span>
                    <span v-if="Object.keys(item[1].orderType)[0] === 'MKT'">
                      ({{
                        filterTotalMKTFilled(
                          item[1],
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                      }})
                    </span>
                    <span v-else>
                      ({{
                        filterTotalFilled(
                          item[1].filled,
                          filterSide(item[1].orderPrice),
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                      }})
                    </span>
                    {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Filled</span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <span v-if="Object.keys(item[1].orderType)[0] === 'MKT'">
                    {{ filterFilledMKT(item[1]) }}
                  </span>
                  <span v-else>
                    {{
                      filterFilled(
                        item[1].filled,
                        filterSide(item[1].orderPrice),
                        filterAmount(
                          item[1].orderPrice,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokenMinUnit
                        ),
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                    }}
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Time</span>
                <span class="pending-item-right">{{
                  item[1].time | formatDateFromNanosecondUTC
                }}</span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Txid</span>
                <span class="pending-item-right">
                  <copy-account
                    :account="filterTxid(item[1].txid)"
                    copyText="Txid"
                  ></copy-account>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">ICTC</span>
                <span class="pending-item-right">
                  <span v-if="item[1].toids.length">
                    <a
                      style="color: rgba(52, 119, 181, 0.7)"
                      :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/${currentPair[0].toString()}/${item[1].toids[
                        item[1].toids.length - 1
                      ].toString(10)}`"
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{ getOrderStatus(item[1].toids) }}
                    </a>
                  </span>
                  <span v-else>-</span>
                </span>
              </div>
            </li>
            <li v-if="!pendingListPro.length" class="text-center">No Orders</li>
          </ul>
          <ul v-show="currentTradeMenuPro === 'history'">
            <li v-for="(item, index) in userRecordPro" :key="index">
              <div class="pending-header-h5">
                <div
                  class="k-interval-main-header-h5-left-name flex-center w100"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <span>
                    {{
                      tokens[currentPair[1][0].token0[0].toString()].symbol
                    }}/{{
                      tokens[currentPair[1][0].token1[0].toString()].symbol
                    }}
                  </span>
                  <span
                    class="margin-left-auto"
                    :class="{
                      'ask-price':
                        getTradeSide(item.filled.token0Value) === 'Sell',
                      'bid-price':
                        getTradeSide(item.filled.token0Value) === 'Buy'
                    }"
                  >
                    {{ getTradeSide(item.filled.token0Value) }}
                  </span>
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Order</span>
                <div class="swap-info pending-item-right">
                  <span
                    v-if="
                      item.order.token0Value[0] &&
                      Object.keys(item.order.token0Value[0])[0] ===
                        'DebitRecord' &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    <a
                      :href="
                        currentPair[1][0].token0[0].toString() ===
                        'ryjl3-tyaaa-aaaaa-aaaba-cai'
                          ? `https://ic.house/ICP/address/${getPrincipalId}`
                          : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                      "
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{
                        Object.values(item.order.token0Value[0])[0]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                      }}
                      {{
                        tokens[currentPair[1][0].token0[0].toString()].symbol
                      }}
                    </a>
                  </span>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      item.order.token1Value[0] &&
                      Object.keys(item.order.token1Value[0])[0] ===
                        'DebitRecord'
                    "
                  >
                    <a
                      :href="
                        currentPair[1][0].token1[0].toString() ===
                        'ryjl3-tyaaa-aaaaa-aaaba-cai'
                          ? `https://ic.house/ICP/address/${getPrincipalId}`
                          : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                      "
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{
                        Object.values(item.order.token1Value[0])[0]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                      }}
                      {{
                        tokens[currentPair[1][0].token1[0].toString()].symbol
                      }}
                    </a>
                  </span>
                  ->
                  <span
                    v-if="
                      item.order.token0Value[0] &&
                      Object.keys(item.order.token0Value[0])[0] ===
                        'CreditRecord' &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    <a
                      :href="
                        currentPair[1][0].token0[0].toString() ===
                        'ryjl3-tyaaa-aaaaa-aaaba-cai'
                          ? `https://ic.house/ICP/address/${getPrincipalId}`
                          : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                      "
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{
                        Object.values(item.order.token0Value[0])[0]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                      }}
                      {{
                        tokens[currentPair[1][0].token0[0].toString()].symbol
                      }}
                    </a>
                  </span>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      item.order.token1Value[0] &&
                      Object.keys(item.order.token1Value[0])[0] ===
                        'CreditRecord'
                    "
                  >
                    <a
                      :href="
                        currentPair[1][0].token1[0].toString() ===
                        'ryjl3-tyaaa-aaaaa-aaaba-cai'
                          ? `https://ic.house/ICP/address/${getPrincipalId}`
                          : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                      "
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                    >
                      {{
                        Object.values(item.order.token1Value[0])[0]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                      }}
                      {{
                        tokens[currentPair[1][0].token1[0].toString()].symbol
                      }}
                    </a>
                  </span>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      Object.keys(item.orderType[0])[0] === 'MKT' &&
                      item.order.token0Value[0]
                    "
                  >
                    ?(market)
                    {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                  </span>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      Object.keys(item.orderType[0])[0] === 'MKT' &&
                      item.order.token1Value[0]
                    "
                  >
                    ?(market)
                    {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
                  </span>
                  <span v-if="Object.keys(item.orderType[0])[0] !== 'MKT'"
                    >(price:{{ getOrderPrice(item, buyUnit) }})</span
                  >
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Filled</span>
                <div
                  class="swap-info pending-item-right"
                  v-if="
                    Object.keys(item.status)[0] === 'Cancelled' ||
                    !item.details.length
                  "
                >
                  -
                </div>
                <div v-else class="pending-item-right">
                  <div
                    class="swap-info"
                    v-if="item.details && item.details.length > 1"
                  >
                    <span class="swap-info-detail">Latest:</span>
                    <span
                      v-if="
                        Object.keys(
                          item.details[item.details.length - 1].token0Value
                        )[0] === 'DebitRecord' &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token0[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(
                            item.details[item.details.length - 1].token0Value
                          )[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals
                            )
                        }}
                        {{
                          tokens[currentPair[1][0].token0[0].toString()].symbol
                        }}
                      </a>
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPair &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        Object.keys(
                          item.details[item.details.length - 1].token1Value
                        )[0] === 'DebitRecord'
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token1[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(
                            item.details[item.details.length - 1].token1Value
                          )[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                        }}
                        {{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </a>
                    </span>
                    ->
                    <span
                      v-if="
                        Object.keys(
                          item.details[item.details.length - 1].token0Value
                        )[0] === 'CreditRecord' &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token0[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(
                            item.details[item.details.length - 1].token0Value
                          )[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals
                            )
                        }}
                        {{
                          tokens[currentPair[1][0].token0[0].toString()].symbol
                        }}
                      </a>
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPair &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        Object.keys(
                          item.details[item.details.length - 1].token1Value
                        )[0] === 'CreditRecord'
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token1[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(
                            item.details[item.details.length - 1].token1Value
                          )[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                        }}
                        {{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </a>
                    </span>
                  </div>
                  <div class="swap-info">
                    <span
                      v-if="item.details && item.details.length > 1"
                      class="swap-info-detail"
                      >Total:</span
                    >
                    <span
                      v-if="
                        Object.keys(item.filled.token0Value)[0] ===
                          'DebitRecord' &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token0[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(item.filled.token0Value)[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals
                            )
                        }}&nbsp;{{
                          tokens[currentPair[1][0].token0[0].toString()].symbol
                        }}
                      </a>
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPair &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        Object.keys(item.filled.token1Value)[0] ===
                          'DebitRecord'
                      "
                      ><a
                        :href="
                          currentPair[1][0].token1[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(item.filled.token1Value)[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                        }}&nbsp;{{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </a>
                    </span>
                    ->
                    <span
                      v-if="
                        Object.keys(item.filled.token0Value)[0] ===
                          'CreditRecord' &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token0[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token0[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                        >{{
                          Object.values(item.filled.token0Value)[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals
                            )
                        }}&nbsp;{{
                          tokens[currentPair[1][0].token0[0].toString()].symbol
                        }}</a
                      >
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPair &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        Object.keys(item.filled.token1Value)[0] ===
                          'CreditRecord'
                      "
                    >
                      <a
                        :href="
                          currentPair[1][0].token1[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPair[1][0].token1[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(item.filled.token1Value)[0]
                            | bigintToFloat(
                              4,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals
                            )
                        }}&nbsp;{{
                          tokens[currentPair[1][0].token1[0].toString()].symbol
                        }}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Avg.Price</span>
                <span
                  v-if="Object.keys(item.status)[0] === 'Cancelled'"
                  class="pending-item-right"
                >
                  -
                </span>
                <span v-else class="pending-item-right">
                  {{ getAvgPrice(item, buyUnit) }}
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left"
                  >Fee
                  <a-tooltip placement="top">
                    <template slot="title"
                      >Fee includes trading fee, network gas, brokerage and
                      maker yield, negative values indicate income.</template
                    >
                    <a-icon
                      class="pointer"
                      type="question-circle"
                    /> </a-tooltip
                ></span>
                <span class="pending-item-right">
                  <span
                    v-if="
                      tokens && tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    <span :class="{ 'fee-come': item.fee.token0Fee < 0 }">{{
                      getTradeFee(item)
                    }}</span>
                    &nbsp;<span
                      :class="{ 'fee-come': item.fee.token1Fee < 0 }"
                      >{{ getTradeFee(item, false) }}</span
                    >
                    <span v-if="!item.fee.token0Fee && !item.fee.token1Fee"
                      >-</span
                    >
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Txid</span>
                <span class="pending-item-right">
                  <copy-account
                    v-if="currentPair"
                    :front="10"
                    :is-copy="false"
                    :href="`https://ic.house/swap/${currentPair[0].toString()}/${filterTxid(
                      item.txid
                    )}`"
                    :account="filterTxid(item.txid)"
                    copyText="Txid"
                  ></copy-account>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Time</span>
                <span class="pending-item-right">
                  <span v-if="item.details && item.details.length">
                    {{
                      item.details[item.details.length - 1].time
                        | formatDateFromNanosecondUTC
                    }}
                  </span>
                  <span v-else>
                    {{ item.time | formatDateFromNanosecondUTC }}
                  </span>
                </span>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Status</span>
                <span class="pending-item-right">
                  <span
                    class="history-status"
                    :class="Object.keys(item.status)[0]"
                    >{{ Object.keys(item.status)[0] }}</span
                  >
                </span>
              </div>
            </li>
            <li v-if="!userRecordPro.length" class="text-center">No Trades</li>
          </ul>
        </div>
      </div>
      <div v-show="showTrade || showParis" class="trade-modal"></div>
      <div v-show="showParis" class="pairs-h5">
        <div class="pairs-h5-content">
          <div class="pairs-h5-header">
            <span>Market</span>
            <a-icon
              @click="showParis = false"
              class="margin-left-auto"
              type="close-circle"
            />
          </div>
          <ul class="trade-market-sort">
            <li
              :class="{ active: item.name === currentTradeMarketSort }"
              v-for="item in tradeMarketSort"
              :key="item.value"
              @click="changeTradeMarketSort(item)"
            >
              {{ item.name }}
              <span v-if="item.name === 'USDT'" class="base-red">TEST</span>
            </li>
          </ul>
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Price</th>
                <th class="text-right">Vol(24h/total)</th>
              </tr>
            </thead>
            <tbody class="de-swap-list-item-pair" ref="deSwapListItemPairH5">
              <tr
                v-for="(pair, index) in tradePairs[currentTradeMarketSort]"
                :key="index"
                @click="changePair(pair, index)"
                :class="{
                  active:
                    pair[1][0].canisterId.toString() ===
                    pairs[currentPairIndex][1][0].canisterId.toString()
                }"
              >
                <td>
                  <dl>
                    <dt>
                      {{ pair[1][0].token0[1]
                      }}<span class="pair-icp"
                        >/{{ pair[1][0].token1[1] }}</span
                      >
                    </dt>
                    <dd>
                      <span v-show="oldPairs.includes(pair[0].toString())"
                        >(Old)</span
                      >
                    </dd>
                  </dl>
                </td>
                <td>
                  <dl>
                    <dt>
                      <span
                        class="tabular-nums"
                        v-if="
                          tokens &&
                          tokens[pair[1][0].token0[0].toString()] &&
                          tokens[pair[1][0].token1[0].toString()] &&
                          pair[2]
                        "
                      >
                        {{
                          pair[2].price
                            | filterPairTokenPrice(
                              tokens[pair[1][0].token0[0].toString()].decimals,
                              tokens[pair[1][0].token1[0].toString()].decimals
                            )
                        }}
                      </span>
                    </dt>
                    <dd>
                      <span
                        :class="{
                          'bid-pair-price': Number(pair[2].change24h) > 0,
                          'ask-pair-price': Number(pair[2].change24h) < 0
                        }"
                        class="tabular-nums"
                        v-if="pair[2]"
                      >
                        {{ pair[2].change24h | filterChange }}%
                      </span>
                    </dd>
                  </dl>
                </td>
                <td class="text-right">
                  <dl>
                    <dt>
                      <span
                        class="tabular-nums"
                        v-if="
                          tokens &&
                          tokens[pair[1][0].token1[0].toString()] &&
                          pair[2]
                        "
                      >
                        {{
                          pair[2].vol24h.value1
                            | bigintToFloat(
                              2,
                              tokens[pair[1][0].token1[0].toString()].decimals
                            )
                            | formatNum
                        }}
                      </span>
                    </dt>
                    <dd>
                      <span
                        class="tabular-nums"
                        v-if="
                          tokens &&
                          tokens[pair[1][0].token1[0].toString()] &&
                          pair[2]
                        "
                      >
                        {{
                          pair[2].totalVol.value1
                            | bigintToFloat(
                              2,
                              tokens[pair[1][0].token1[0].toString()].decimals
                            )
                            | formatNum
                        }}
                      </span>
                    </dd>
                  </dl>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        v-show="showTrade"
        ref="tradeH5"
        class="trade-h5 trade-item"
        :class="{ 'trade-h5-focusin': focusin }"
      >
        <div class="trade-h5-content">
          <div class="pairs-h5-header">
            <span>Place Order</span>
            <a-icon class="set-pool" type="setting" @click="showPoolVisible" />
            <a-icon
              @click="showTrade = false"
              class="margin-left-auto"
              type="close-circle"
            />
          </div>
          <div class="trade-h5-content-main">
            <div class="trade-h5-content-left">
              <div class="trade-h5-header">
                <ul>
                  <li
                    @click="changeTradeType('Buy')"
                    :class="{ 'trade-buy': tradeType === 'Buy' }"
                  >
                    <span>Buy</span>
                  </li>
                  <li
                    @click="changeTradeType('Sell')"
                    :class="{ 'trade-sell': tradeType === 'Sell' }"
                  >
                    <span>Sell</span>
                  </li>
                </ul>
              </div>
              <div class="trade-main-header">
                <a-select
                  @change="onchangeOrderTypeEnum"
                  class="trade-main-header-type"
                  v-model="orderType"
                >
                  <a-select-option
                    v-for="(item, index) in orderTypeEnum"
                    :key="index"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
                <!--<div
									:class="{ active: item === orderType }"
									v-for="(item, index) in orderTypeEnum"
									:key="index"
									@click="changeOrderType(item)"
								>
									{{ item }}
								</div>-->
              </div>
              <div v-show="tradeType === 'Buy'" class="trade-main-buy">
                <div v-show="orderType !== 'MKT' && orderType !== 'Stop-loss'">
                  <a-tooltip
                    placement="topRight"
                    :overlayClassName="
                      !(
                        buyPrice &&
                        Number(buyPrice) !== 0 &&
                        token0Price &&
                        currentTokenPrice
                      )
                        ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                        : 'order-book-type-list-tooltip'
                    "
                    trigger="click"
                  >
                    <template slot="title">
                      <span v-if="icpPrice"
                        >≈ ${{
                          buyPrice
                            | filterBuyPrice(token0Price, currentTokenPrice)
                            | formatNum
                        }}</span
                      >
                    </template>
                    <a-input-group
                      :class="{
                        'swap-item-group-error':
                          isToBuy && (!buyPrice || Number(buyPrice) === 0)
                      }"
                      class="swap-item-group"
                      compact
                    >
                      <!--<span class="suffix">Price</span>-->
                      <a-input
                        :key="buyUnit"
                        v-model="buyPrice"
                        class="input-icp-suffix"
                        autocomplete="off"
                        type="number"
                        placeholder="Price"
                        v-only-float="buyUnit"
                        @input="buyPriceChange"
                      />
                      <span class="suffix" v-if="currentPair">
                        {{ currentPair[1][0].token1[1] }}
                      </span>
                    </a-input-group>
                  </a-tooltip>
                  <a-tooltip
                    placement="topRight"
                    :overlayClassName="
                      !buyAmountError && !buyAmountErrorUNIT
                        ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                        : 'order-book-type-list-tooltip'
                    "
                    trigger="click"
                  >
                    <template slot="title">
                      <span v-show="buyAmountError"
                        >Max Quantity {{ maxBuyAmount }}</span
                      >
                      <span v-show="buyAmountErrorUNIT && !buyAmountError"
                        >Quantity must be an integral multiple of
                        {{ unitSize }}</span
                      >
                    </template>
                    <a-input-group
                      :class="{
                        'swap-item-group-error':
                          buyAmountError ||
                          buyAmountErrorUNIT ||
                          (isToBuy && (!buyAmount || Number(buyAmount) === 0))
                      }"
                      class="swap-item-group"
                      compact
                    >
                      <!--<span class="suffix">Quantity</span>-->
                      <a-input
                        :key="tokenMinUnit"
                        v-model="buyAmount"
                        class="input-icp-suffix"
                        autocomplete="off"
                        type="number"
                        placeholder="Quantity"
                        v-only-float="tokenMinUnit"
                        @input="buyAmountChange"
                      />
                      <span class="suffix" v-if="currentPair">
                        {{ currentPair[1][0].token0[1] }}
                      </span>
                    </a-input-group>
                  </a-tooltip>
                  <div class="buy-slider-h5">
                    <ul>
                      <li
                        v-for="item in tradeMarks"
                        :key="item.value"
                        :class="{ active: currentMark === item.value }"
                        @click="changeBuySlider(item.value)"
                      >
                        <span>{{ item.name }}</span>
                      </li>
                    </ul>
                  </div>
                  <a-tooltip
                    placement="bottomRight"
                    :overlayClassName="
                      !(buyTotal && Number(buyTotal) !== 0 && token0Price,
                      currentTokenPrice)
                        ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                        : 'order-book-type-list-tooltip'
                    "
                    trigger="click"
                  >
                    <template slot="title">
                      <span v-if="icpPrice"
                        >≈ ${{
                          buyTotal
                            | filterBuyPrice(token0Price, currentTokenPrice)
                            | formatNum
                        }}</span
                      >
                    </template>
                    <a-input-group
                      class="swap-item-group swap-item-group-buy-slider"
                      compact
                    >
                      <!--<span class="suffix">Total</span>-->
                      <a-input
                        v-if="
                          currentPair &&
                          tokens &&
                          tokens[currentPair[1][0].token1[0].toString()]
                        "
                        v-model="buyTotal"
                        class="input-icp-suffix"
                        autocomplete="off"
                        type="number"
                        placeholder="Total"
                        v-only-float="
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        "
                        @input="buyTotalChange"
                      />
                      <span class="suffix" v-if="currentPair">
                        {{ currentPair[1][0].token1[1] }}
                      </span>
                    </a-input-group>
                  </a-tooltip>
                </div>
                <div v-show="orderType === 'MKT'">
                  <a-input-group class="swap-item-group" compact>
                    <span class="suffix">Slippage</span>
                    <a-input
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="optional"
                      v-model="mktPrice"
                      v-only-number
                    />
                    <span class="suffix"> % </span>
                  </a-input-group>
                  <a-input-group class="swap-item-group disabled" compact>
                    <a-input
                      disabled
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      v-model="mktQuantity"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token0[1] }}
                    </span>
                  </a-input-group>
                  <div class="buy-slider-h5">
                    <ul>
                      <li
                        v-for="item in tradeMarks"
                        :key="item.value"
                        :class="{ active: currentMark === item.value }"
                        @click="changeBuyMktSlider(item.value)"
                      >
                        <span>{{ item.name }}</span>
                      </li>
                    </ul>
                  </div>
                  <a-tooltip
                    placement="topRight"
                    :overlayClassName="
                      !(
                        buyTotalMKT &&
                        Number(buyTotalMKT) !== 0 &&
                        token0Price &&
                        currentTokenPrice
                      )
                        ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                        : 'order-book-type-list-tooltip'
                    "
                    trigger="click"
                  >
                    <template slot="title">
                      <span v-show="buyTotalMKTError"
                        >Max Total {{ maxBuyMKTTotal }}
                      </span>
                      <span v-show="!buyTotalMKTError && icpPrice"
                        >≈ ${{
                          buyTotalMKT
                            | filterBuyPrice(token0Price, currentTokenPrice)
                            | formatNum
                        }}</span
                      >
                    </template>
                    <a-input-group
                      :class="{
                        'swap-item-group-error':
                          buyTotalMKTError ||
                          (isToBuyMKT &&
                            (!buyTotalMKT || Number(buyTotalMKT) === 0))
                      }"
                      class="swap-item-group"
                      compact
                    >
                      <!--<span class="suffix">Total</span>-->
                      <a-input
                        v-if="
                          currentPair &&
                          tokens &&
                          tokens[currentPair[1][0].token1[0].toString()]
                        "
                        :key="
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        "
                        v-model="buyTotalMKT"
                        class="input-icp-suffix"
                        autocomplete="off"
                        type="number"
                        placeholder="Total"
                        v-only-float="
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        "
                      />
                      <span class="suffix" v-if="currentPair">
                        {{ currentPair[1][0].token1[1] }}
                      </span>
                    </a-input-group>
                  </a-tooltip>
                </div>
                <div class="trade-item-header">
                  <span class="balance-label">Wallet</span>
                  <span class="margin-left-auto trade-item-header-pair-h5">
                    <span
                      v-if="
                        getPrincipalId &&
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        tokensBalance &&
                        tokensBalance[currentPair[1][0].token1[0].toString()]
                      "
                    >
                      {{
                        tokensBalance[currentPair[1][0].token1[0].toString()]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                    </span>
                    <span v-else>-</span>
                    <span v-if="currentPair">{{
                      currentPair[1][0].token1[1]
                    }}</span>
                    <a-tooltip placement="top">
                      <template slot="title">
                        Notes: Settlement is async after order has been filled,
                        check your balance later.
                      </template>
                      <span
                        v-show="
                          currentPair &&
                          (isTodo || orderLoading[currentPair[0].toString()])
                        "
                        class="loading-spinner"
                      ></span>
                    </a-tooltip>
                  </span>
                </div>
                <div
                  style="margin-top: 5px"
                  v-show="showKeepBalance"
                  class="trade-item-header"
                >
                  <span class="balance-label">Trader</span>
                  <span class="margin-left-auto trade-item-header-pair-h5">
                    <span
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                    >
                      {{
                        keepingBalance[currentPair[1][0].token1[0].toString()]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}&nbsp;{{ currentPair[1][0].token1[1] }}
                    </span>
                    <span
                      v-if="
                        !(
                          currentPair &&
                          tokens &&
                          tokens[currentPair[1][0].token1[0].toString()]
                        )
                      "
                      >-</span
                    >
                    <a-icon
                      type="minus-circle"
                      @click="onKeepingBalance(currentPair, false)"
                    />
                    <a-icon
                      style="margin-left: 16px"
                      type="plus-circle"
                      @click="
                        onDepositKeepingBalance(currentPair[1][0].token1, false)
                      "
                    />
                  </span>
                </div>
                <div v-show="orderType !== 'MKT' && orderType !== 'Stop-loss'">
                  <button
                    v-if="getPrincipalId && currentPair"
                    class="buy-button w100 mt20"
                    :disabled="
                      (pairInfo && pairInfo.paused) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()]))
                    "
                    @click="onBuy"
                  >
                    <span v-if="pairInfo && pairInfo.paused">
                      <span
                        class="opening-time"
                        v-if="sysMode && sysMode.openingTime && showOpeningTime"
                      >
                        Open in&nbsp;
                        <a-statistic-countdown
                          class="adopted-countdown"
                          :value="Number(sysMode.openingTime) / 1000000"
                          format="H:m:s"
                          @finish="onFinish()"
                        />
                      </span>
                      <span v-else>Paused</span>
                    </span>
                    <span v-else>
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Buy&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                        <span v-show="orderType === 'FAK'">&nbsp;(FAK)</span>
                        <span v-show="orderType === 'FOK'">&nbsp;(FOK)</span>
                      </span>
                    </span>
                  </button>
                  <button
                    v-else
                    class="w100 mt20 default"
                    @click="connectWallet"
                  >
                    Connect Wallet
                  </button>
                </div>
                <div v-show="orderType === 'MKT'">
                  <button
                    v-if="getPrincipalId && currentPair"
                    :disabled="
                      (pairInfo && pairInfo.paused) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()]))
                    "
                    class="buy-button w100 mt20"
                    @click="onBuyMKT"
                  >
                    <span v-if="pairInfo && pairInfo.paused">
                      <span
                        class="opening-time"
                        v-if="sysMode && sysMode.openingTime && showOpeningTime"
                      >
                        Open in&nbsp;
                        <a-statistic-countdown
                          class="adopted-countdown"
                          :value="Number(sysMode.openingTime) / 1000000"
                          format="H:m:s"
                        />
                      </span>
                      <span v-else>Paused</span>
                    </span>
                    <span v-else>
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Buy&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                      </span>
                    </span>
                  </button>
                  <button
                    v-else
                    class="w100 mt20 default"
                    @click="connectWallet"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
              <div v-show="tradeType === 'Sell'" class="trade-main-sell">
                <div v-show="orderType !== 'MKT' && orderType !== 'Stop-loss'">
                  <a-tooltip
                    placement="topRight"
                    :overlayClassName="
                      !(
                        sellPrice &&
                        Number(sellPrice) !== 0 &&
                        token0Price &&
                        currentTokenPrice
                      )
                        ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                        : 'order-book-type-list-tooltip'
                    "
                    trigger="click"
                  >
                    <template slot="title">
                      <span v-if="icpPrice"
                        >≈ ${{
                          sellPrice
                            | filterBuyPrice(token0Price, currentTokenPrice)
                            | formatNum
                        }}</span
                      >
                    </template>
                    <a-input-group
                      :class="{
                        'swap-item-group-error':
                          isToSell && (!sellPrice || Number(sellPrice) === 0)
                      }"
                      class="swap-item-group"
                      compact
                    >
                      <!--<span class="suffix">Price</span>-->
                      <a-input
                        :key="buyUnit"
                        v-model="sellPrice"
                        class="input-icp-suffix"
                        autocomplete="off"
                        type="number"
                        placeholder="Price"
                        v-only-float="buyUnit"
                        @input="sellPriceChange"
                      />
                      <span class="suffix" v-if="currentPair">
                        {{ currentPair[1][0].token1[1] }}
                      </span>
                    </a-input-group>
                  </a-tooltip>
                  <a-tooltip
                    placement="topRight"
                    :overlayClassName="
                      !sellAmountError && !sellAmountErrorUNIT
                        ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                        : 'order-book-type-list-tooltip'
                    "
                    trigger="click"
                  >
                    <template slot="title">
                      <span v-show="sellAmountError"
                        >Max Quantity {{ maxSellAmount }}</span
                      >
                      <span v-show="sellAmountErrorUNIT && !sellAmountError"
                        >Quantity must be an integral multiple of
                        {{ unitSize }}</span
                      >
                    </template>
                    <a-input-group
                      :class="{
                        'swap-item-group-error':
                          (isToSell &&
                            (!sellAmount || Number(sellAmount) === 0)) ||
                          sellAmountError ||
                          sellAmountErrorUNIT
                      }"
                      class="swap-item-group"
                      compact
                    >
                      <!--<span class="suffix">Quantity</span>-->
                      <a-input
                        :key="tokenMinUnit"
                        v-model="sellAmount"
                        class="input-icp-suffix"
                        autocomplete="off"
                        type="number"
                        placeholder="Quantity"
                        v-only-float="tokenMinUnit"
                        @input="sellAmountChange"
                      />
                      <span class="suffix" v-if="currentPair">
                        {{ currentPair[1][0].token0[1] }}
                      </span>
                    </a-input-group>
                  </a-tooltip>
                  <div class="buy-slider-h5">
                    <ul>
                      <li
                        v-for="item in tradeMarks"
                        :key="item.value"
                        :class="{ active: currentMark === item.value }"
                        @click="changeSellSlider(item.value)"
                      >
                        <span>{{ item.name }}</span>
                      </li>
                    </ul>
                  </div>
                  <a-tooltip
                    placement="bottomRight"
                    :overlayClassName="
                      !(
                        sellTotal &&
                        Number(sellTotal) !== 0 &&
                        token0Price &&
                        currentTokenPrice
                      )
                        ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                        : 'order-book-type-list-tooltip'
                    "
                    trigger="click"
                  >
                    <template slot="title">
                      <span v-if="icpPrice"
                        >≈ ${{
                          sellTotal
                            | filterBuyPrice(token0Price, currentTokenPrice)
                            | formatNum
                        }}</span
                      >
                    </template>
                    <a-input-group
                      class="swap-item-group swap-item-group-buy-slider"
                      compact
                    >
                      <!--<span class="suffix">Total</span>-->
                      <a-input
                        v-if="
                          currentPair &&
                          tokens &&
                          tokens[currentPair[1][0].token1[0].toString()]
                        "
                        v-model="sellTotal"
                        class="input-icp-suffix"
                        autocomplete="off"
                        type="number"
                        placeholder="Total"
                        v-only-float="
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        "
                        @input="sellTotalChange"
                      />
                      <span class="suffix" v-if="currentPair">
                        {{ currentPair[1][0].token1[1] }}
                      </span>
                    </a-input-group>
                  </a-tooltip>
                </div>
                <div v-show="orderType === 'MKT'">
                  <a-input-group class="swap-item-group" compact>
                    <span class="suffix">Slippage</span>
                    <a-input
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                      placeholder="optional"
                      v-model="mktSellPrice"
                      v-only-number
                    />
                    <span class="suffix"> % </span>
                  </a-input-group>
                  <a-tooltip
                    placement="topRight"
                    :overlayClassName="
                      !sellAmountError && !sellAmountErrorUNIT
                        ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                        : 'order-book-type-list-tooltip'
                    "
                    trigger="click"
                  >
                    <template slot="title">
                      <span v-show="sellAmountError"
                        >Max Quantity {{ maxSellAmount }}</span
                      >
                      <span v-show="sellAmountErrorUNIT && !sellAmountError"
                        >Quantity must be an integral multiple of
                        {{ unitSize }}</span
                      >
                    </template>
                    <a-input-group
                      :class="{
                        'swap-item-group-error':
                          (isToSell &&
                            (!sellAmount || Number(sellAmount) === 0)) ||
                          sellAmountError ||
                          sellAmountErrorUNIT
                      }"
                      class="swap-item-group"
                      compact
                    >
                      <!--<span class="suffix">Quantity</span>-->
                      <a-input
                        :key="tokenMinUnit"
                        v-model="sellAmount"
                        class="input-icp-suffix"
                        autocomplete="off"
                        type="number"
                        placeholder="Quantity"
                        v-only-float="tokenMinUnit"
                        @change="sellMktAmountChange"
                      />
                      <span class="suffix" v-if="currentPair">
                        {{ currentPair[1][0].token0[1] }}
                      </span>
                    </a-input-group>
                  </a-tooltip>
                  <div class="buy-slider-h5">
                    <ul>
                      <li
                        v-for="item in tradeMarks"
                        :key="item.value"
                        :class="{ active: currentMark === item.value }"
                        @click="changeSellMktSlider(item.value)"
                      >
                        <span>{{ item.name }}</span>
                      </li>
                    </ul>
                  </div>
                  <a-input-group class="swap-item-group disabled" compact>
                    <a-input
                      v-model="mktTotal"
                      disabled
                      class="input-icp-suffix"
                      autocomplete="off"
                      type="text"
                    />
                    <span class="suffix" v-if="currentPair">
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                  </a-input-group>
                </div>
                <div class="trade-item-header">
                  <span class="balance-label">Wallet</span>
                  <span class="margin-left-auto trade-item-header-pair-h5">
                    <span
                      v-if="
                        getPrincipalId &&
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()] &&
                        tokensBalance &&
                        tokensBalance[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      {{
                        tokensBalance[currentPair[1][0].token0[0].toString()]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                    </span>
                    <span v-else>-</span>
                    <span v-if="currentPair">
                      {{ currentPair[1][0].token0[1] }}
                    </span>
                    <a-tooltip placement="top">
                      <template slot="title">
                        Notes: Settlement is async after order has been filled,
                        check your balance later.
                      </template>
                      <span
                        v-show="
                          currentPair &&
                          (isTodo || orderLoading[currentPair[0].toString()])
                        "
                        class="loading-spinner"
                      ></span>
                    </a-tooltip>
                  </span>
                </div>
                <div
                  style="margin-top: 5px"
                  v-show="showKeepBalance"
                  class="trade-item-header"
                >
                  <span class="balance-label">Trader</span>
                  <span class="margin-left-auto trade-item-header-pair-h5">
                    <span
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      {{
                        keepingBalance[currentPair[1][0].token0[0].toString()]
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}&nbsp;{{ currentPair[1][0].token0[1] }}
                    </span>
                    <span
                      class="margin-left-auto"
                      v-if="
                        !(
                          currentPair &&
                          tokens &&
                          tokens[currentPair[1][0].token0[0].toString()]
                        )
                      "
                      >-</span
                    >
                    <a-icon
                      type="minus-circle"
                      @click="onKeepingBalance(currentPair, true)"
                    />
                    <a-icon
                      type="plus-circle"
                      style="margin-left: 10px"
                      @click="
                        onDepositKeepingBalance(currentPair[1][0].token0, true)
                      "
                    />
                  </span>
                </div>
                <div
                  v-show="orderType !== 'MKT' && orderType !== 'Stop-loss'"
                  class="trade-h5-button"
                >
                  <button
                    v-if="getPrincipalId && currentPair"
                    class="sell-button w100 mt20"
                    :disabled="
                      (pairInfo && pairInfo.paused) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()]))
                    "
                    @click="onSell"
                  >
                    <span v-if="pairInfo && pairInfo.paused">
                      <span
                        class="opening-time"
                        v-if="sysMode && sysMode.openingTime && showOpeningTime"
                      >
                        Open in&nbsp;
                        <a-statistic-countdown
                          class="adopted-countdown"
                          :value="Number(sysMode.openingTime) / 1000000"
                          format="H:m:s"
                        />
                      </span>
                      <span v-else>Paused</span>
                    </span>
                    <span v-else>
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Sell&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                        <span v-show="orderType === 'FAK'">&nbsp;(FAK)</span>
                        <span v-show="orderType === 'FOK'">&nbsp;(FOK)</span>
                      </span>
                    </span>
                  </button>
                  <button
                    v-else
                    class="w100 mt20 default"
                    @click="connectWallet"
                  >
                    Connect Wallet
                  </button>
                </div>
                <div v-show="orderType === 'MKT'" class="trade-h5-button">
                  <button
                    v-if="getPrincipalId && currentPair"
                    class="sell-button w100 mt20"
                    :disabled="
                      (pairInfo && pairInfo.paused) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()]))
                    "
                    @click="onSellMKT"
                  >
                    <span v-if="pairInfo && pairInfo.paused">
                      <span
                        class="opening-time"
                        v-if="sysMode && sysMode.openingTime && showOpeningTime"
                      >
                        Open in&nbsp;
                        <a-statistic-countdown
                          class="adopted-countdown"
                          :value="Number(sysMode.openingTime) / 1000000"
                          format="H:m:s"
                        />
                      </span>
                      <span v-else>Paused</span>
                    </span>
                    <span v-else>
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Sell&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                      </span>
                    </span>
                  </button>
                  <button
                    v-else
                    class="w100 mt20 default"
                    @click="connectWallet"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
            <div class="trade-h5-content-right">
              <div class="trade-h5-content-right-header">
                <ul>
                  <li>
                    <dl>
                      <dt>Price</dt>
                      <dd>
                        <span v-if="currentPair"
                          >({{ currentPair[1][0].token1[1] }})</span
                        >
                      </dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>Quantity</dt>
                      <dd>
                        <span v-if="currentPair"
                          >({{ currentPair[1][0].token0[1] }})</span
                        >
                      </dd>
                    </dl>
                  </li>
                </ul>
              </div>
              <div class="trade-h5-content-order">
                <ul
                  v-for="(item, index) in askTrade"
                  :key="index"
                  :style="{
                    backgroundImage: `linear-gradient(to left, rgba(248, 73, 96, 0.2) ${getPercent(
                      item
                    )}%, #141B23 ${getPercent(item)}%)`
                  }"
                  @click="setTrade(item, 'ask', index, askTrade)"
                >
                  <li @click.stop="setTradePrice(item, 'ask')">
                    <span
                      class="ask-price tabular-nums"
                      :class="{
                        'order-disabled': orderDisabled(item.price)
                      }"
                      v-if="
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()] &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        currentSize &&
                        unit
                      "
                    >
                      {{
                        filterLevelPrice(
                          item.price,
                          unit,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          currentSize.symbol,
                          'ask'
                        )
                      }}
                    </span>
                  </li>
                  <li>
                    <span
                      class="tabular-nums"
                      v-if="
                        tokens && tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      {{
                        filterQuantity(
                          item.quantity,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokenMinUnit
                        ) | formatH5Amount(tokenMinUnit)
                      }}
                    </span>
                  </li>
                </ul>
                <div class="current-icp-price current-icp-price-trade-h5">
                  <span class="token-price" :class="tokenPriceStatus">
                    {{ currentTokenPrice
                    }}<a-icon
                      type="arrow-up"
                      v-show="tokenPriceStatus === 'call'"
                    /><a-icon
                      v-show="tokenPriceStatus === 'put'"
                      type="arrow-down"
                    />
                  </span>
                  <span v-if="icpPrice">≈ ${{ token0Price }}</span>
                </div>
                <ul
                  v-for="(item, index) in bidTrade"
                  :key="`bid-${index}`"
                  :style="{
                    backgroundImage: `linear-gradient(to left, rgba(2, 192, 118, 0.2) ${getPercent(
                      item
                    )}%, #141B23 ${getPercent(item)}%)`
                  }"
                  @click="setTrade(item, 'bid', index, bidTrade)"
                >
                  <li
                    @click.stop="setTradePrice(item, 'bid')"
                    class="bid-price"
                  >
                    <span
                      class="bid-price tabular-nums"
                      :class="{
                        'order-disabled': orderDisabled(item.price)
                      }"
                      v-if="
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()] &&
                        tokens[currentPair[1][0].token1[0].toString()] &&
                        currentSize &&
                        unit
                      "
                    >
                      {{
                        filterLevelPrice(
                          item.price,
                          unit,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          currentSize.symbol,
                          'bid'
                        )
                      }}
                    </span>
                  </li>
                  <li>
                    <span
                      class="tabular-nums"
                      v-if="
                        tokens && tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      {{
                        filterQuantity(
                          item.quantity,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokenMinUnit
                        ) | formatH5Amount(tokenMinUnit)
                      }}
                    </span>
                  </li>
                </ul>
              </div>
              <div
                v-if="currentSize"
                class="
                  order-book-tick-size order-book-tick-size-h5
                  margin-left-auto
                  base-font-title
                "
              >
                <a-dropdown
                  placement="bottomCenter"
                  overlayClassName="tick-size-dropdown"
                  :trigger="['click']"
                >
                  <span class="pointer order-book-tick-size-h5-current"
                    >{{ currentSize.size }}
                    <a-icon class="margin-left-auto" type="caret-down"
                  /></span>
                  <a-menu slot="overlay" @click="onChangeTickSize">
                    <a-menu-item
                      v-for="item in tickSizes"
                      :key="item.symbol"
                      :class="{ active: currentSize.size === item.size }"
                    >
                      <span>{{ item.size }}</span>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h5-show to-trade" v-show="!tradeCompetitionsMenu">
        <dl @click="showProOrder('Grid')">
          <dt>
            <img src="@/assets/img/grid.svg" alt="" />
          </dt>
          <dd>
            <span> Grid </span>
          </dd>
        </dl>
        <button
          v-if="getPrincipalId"
          :disabled="
            currentPair && oldPairs.includes(currentPair[0].toString())
          "
          @click="tradeH5('Buy')"
          type="button"
          class="to-trade-buy"
        >
          Buy
        </button>
        <button
          v-if="getPrincipalId"
          :disabled="
            currentPair && oldPairs.includes(currentPair[0].toString())
          "
          @click="tradeH5('Sell')"
          type="button"
          class="to-trade-sell"
        >
          Sell
        </button>
        <button
          v-if="!getPrincipalId"
          class="w100 default"
          @click="connectWallet"
        >
          Connect Wallet
        </button>
      </div>
      <a-modal
        v-model="proVisible"
        width="500px"
        title="Pro Order"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="trade-item-pro-h5"
      >
        <div class="trade-item-pro">
          <div class="base-font-title trade-item-pro-title">
            <span style="white-space: nowrap">Pro-Wallet Account:&nbsp;</span>
            <copy-account
              :account="getPrincipalId"
              copyText="Principal"
            ></copy-account>
            &nbsp;&nbsp;&nbsp;
            <span style="white-space: nowrap">Subaccount:&nbsp;</span>
            <copy-account
              account="0000000000000000000000000000000000000000000000000000000000000001"
              copyText="Subaccount"
            ></copy-account>
          </div>
          <div
            class="trade-item-pro-fee"
            v-if="
              stoConfig &&
              currentPair &&
              tokens &&
              tokens[currentPair[1][0].token1[0].toString()]
            "
          >
            <span style="font-weight: bold">Fee:</span> (Create)
            {{
              stoConfig.poFee1
                | bigintToFloat(
                  tokens[currentPair[1][0].token1[0].toString()].decimals,
                  tokens[currentPair[1][0].token1[0].toString()].decimals
                )
            }}
            {{ tokens[currentPair[1][0].token1[0].toString()].symbol }},
            (Update)
            {{
              stoConfig.poFee1
                | stoUpdateFee(
                  tokens[currentPair[1][0].token1[0].toString()].decimals
                )
            }}
            {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}, (Order)
            {{ stoConfig.poFee2 | stoOrderFee }}.
          </div>
          <div class="mt20">Balance:</div>
          <div class="trade-item-pro-balance">
            <div class="trade-item-pro-balance-left">
              <div>
                <span class="trade-item-pro-balance-label"
                  >Pro-wallet:&nbsp;</span
                >
                <span
                  v-if="
                    currentPair &&
                    tokensBalanceSto[currentPair[1][0].token1[0].toString()] &&
                    tokens &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  {{
                    tokensBalanceSto[currentPair[1][0].token1[0].toString()]
                      | bigintToFloat(
                        Math.min(
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          4
                        ),
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                      | formatNum
                  }}
                  {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                </span>
                &nbsp;
                <span
                  class="trade-item-pro-icon"
                  @click="swapWallet(currentPair[1][0].token1[0].toString())"
                >
                  <a-icon type="swap" />
                </span>
              </div>
              <div>
                <span class="trade-item-pro-balance-label"
                  >Pro-TraderAcct:&nbsp;</span
                >
                <span
                  v-if="
                    currentPair &&
                    keepingBalanceSto[currentPair[1][0].token1[0].toString()] &&
                    tokens &&
                    tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <span class="base-font-title" style="font-weight: bold">
                    {{
                      keepingBalanceSto[currentPair[1][0].token1[0].toString()]
                        | bigintToFloat(
                          Math.min(
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            4
                          ),
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                  {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                </span>
                &nbsp;
                <a-tooltip placement="top">
                  <template slot="title"> Withdraw </template>
                  <a-icon
                    type="minus-circle"
                    @click="onKeepingBalance(currentPair, false, true)"
                  />
                </a-tooltip>
                <a-tooltip placement="top">
                  <template slot="title"> Deposit </template>
                  <a-icon
                    type="plus-circle"
                    style="margin-left: 8px"
                    @click="
                      onDepositKeepingBalance(
                        currentPair[1][0].token1,
                        false,
                        true
                      )
                    "
                  />
                </a-tooltip>
              </div>
            </div>
            <div class="trade-item-pro-balance-right">
              <div>
                <span class="trade-item-pro-balance-label"
                  >Pro-wallet:&nbsp;</span
                >
                <span
                  v-if="
                    currentPair &&
                    tokensBalanceSto[currentPair[1][0].token0[0].toString()] &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()]
                  "
                >
                  {{
                    tokensBalanceSto[currentPair[1][0].token0[0].toString()]
                      | bigintToFloat(
                        Math.min(
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          4
                        ),
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                      | formatNum
                  }}
                  {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
                </span>
                &nbsp;
                <span
                  @click="swapWallet(currentPair[1][0].token0[0].toString())"
                  class="trade-item-pro-icon"
                >
                  <a-icon type="swap" />
                </span>
              </div>
              <div>
                <span class="trade-item-pro-balance-label"
                  >Pro-TraderAcct:&nbsp;</span
                >
                <span
                  v-if="
                    currentPair &&
                    keepingBalanceSto[currentPair[1][0].token0[0].toString()] &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()]
                  "
                >
                  <span class="base-font-title" style="font-weight: bold">
                    {{
                      keepingBalanceSto[currentPair[1][0].token0[0].toString()]
                        | bigintToFloat(
                          Math.min(
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            4
                          ),
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                  {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
                </span>
                &nbsp;
                <a-tooltip placement="top">
                  <template slot="title"> Withdraw </template>
                  <a-icon
                    type="minus-circle"
                    @click="onKeepingBalance(currentPair, true, true)"
                  />
                </a-tooltip>
                <a-tooltip placement="top">
                  <template slot="title"> Deposit </template>
                  <a-icon
                    type="plus-circle"
                    style="margin-left: 8px"
                    @click="
                      onDepositKeepingBalance(
                        currentPair[1][0].token0,
                        true,
                        true
                      )
                    "
                  />
                </a-tooltip>
              </div>
            </div>
          </div>
          <div class="trade-item-pro-submit">
            <p>
              The Pro-Wallet account is a separate sub-account, please transfer
              tokens to this account before you can create strategy orders.
            </p>
            <button
              type="button"
              class="large-primary primary w100"
              @click="onCreateProOrder"
            >
              Create a {{ currentProOrderMenu }} order
            </button>
          </div>
        </div>
      </a-modal>
      <fallback
        v-if="currentPair"
        ref="fallback"
        :pendingList="pendingList"
        :current-pair="currentPair"
        :tokens="tokens"
      ></fallback>
      <a-modal
        v-model="poolVisible"
        width="400px"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="delete-modal"
      >
        <div class="icdex-mode">
          <div style="margin-bottom: 10px">
            <span style="margin-right: 10px">
              <a-checkbox
                :checked="isPoolModeSetting"
                :disabled="modeDisabled"
                @change="onChange(isPoolModeSetting, 'isPoolModeSetting')"
                >PoolMode
              </a-checkbox>
              <a-tooltip placement="top">
                <template slot="title">
                  When the order is placed, the tokens of the order is
                  temporarily kept in the pool account of the trading pair. It
                  will increase the trading speed.
                </template>
                <a-icon type="exclamation-circle" />
              </a-tooltip>
            </span>
            <span>
              <a-checkbox
                :checked="!isPoolModeSetting"
                :disabled="modeDisabled"
                @change="onChange(isPoolModeSetting, 'isPoolModeSetting')"
                >TunnelMode
              </a-checkbox>
              <a-tooltip placement="top">
                <template slot="title">
                  Enable Tunnel technology to keep each order's tokens in a
                  separate, dedicated account. It will reduce the trading speed.
                </template>
                <a-icon type="exclamation-circle" />
              </a-tooltip>
            </span>
          </div>
          <div>
            <a-checkbox
              :checked="isKeepingSetting"
              :disabled="modeDisabled"
              @change="onChange(isKeepingSetting, 'isKeepingSetting')"
              >Keeping balance in TraderAccount
            </a-checkbox>
            <a-tooltip placement="top">
              <template slot="title">
                By enabling "Keeping balance in TraderAccount", your tokens will
                be kept in the pair account, which will increase the speed of
                trading. You can make deposits and withdrawals at any time.
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </div>
          <button
            type="button"
            class="primary mt20"
            :disabled="modeDisabled"
            @click="setMode"
          >
            Submit
          </button>
        </div>
      </a-modal>
    </div>
    <trade-competitions
      ref="tradeCompetitions"
      class="trade-main-competitions"
      v-show="tokens && currentPair && tradeCompetitionsMenu"
      :current-pair="currentPair"
      :tokens="tokens"
      :menu="tradeCompetitionsMenu"
      @infoBack="infoBack"
    ></trade-competitions>
    <a-modal
      v-model="showPrepareOrder"
      width="600px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <div>
        <p>
          You still have orders outstanding from the last time you exited the
          Dapp. Confirm to resubmit?
        </p>
        <div class="preparing-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Side</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in preparing" :key="index">
                <td>{{ item.orderType }}</td>
                <td>{{ item.side }}</td>
                <td>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      unit &&
                      buyUnit
                    "
                  >
                    {{
                      item.orderType === 'MKT'
                        ? 'Market'
                        : filterLevelPrice(
                            item.orderPrice.price,
                            unit,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            buyUnit,
                            filterSide(item[1].orderPrice) === 'Buy'
                              ? 'bid'
                              : 'ask'
                          )
                    }}
                  </span>
                </td>
                <td>
                  <span
                    v-if="
                      tokens &&
                      currentPair &&
                      tokens[currentPair[1][0].token0[0].toString()]
                    "
                  >
                    {{
                      item.orderType === 'MKT'
                        ? filterAmountMKT(
                            item.orderPrice,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                        : filterAmount(
                            item.orderPrice,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          )
                    }}
                  </span>
                </td>
                <td>
                  <span
                    v-if="
                      currentPair &&
                      unit &&
                      tokens &&
                      tokens[currentPair[1][0].token0[0].toString()] &&
                      tokens[currentPair[1][0].token1[0].toString()] &&
                      buyUnit.toString()
                    "
                  >
                    <span v-if="item.orderType === 'MKT'">
                      {{ filterTotalMKT(item.orderPrice) }}
                    </span>
                    <span v-else>
                      {{
                        filterTotal(
                          filterLevelPrice(
                            item.orderPrice.price,
                            unit,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            buyUnit,
                            filterSide(item[1].orderPrice) === 'Buy'
                              ? 'bid'
                              : 'ask'
                          ),
                          filterAmount(
                            item.orderPrice,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokenMinUnit
                          ),
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                      }}
                      {{
                        tokens[currentPair[1][0].token1[0].toString()].symbol
                      }}
                    </span>
                  </span>
                </td>
                <td>
                  <span>{{ item.status }}</span
                  ><span v-show="item.status" class="loading-spinner"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="preparing-button">
          <button
            :disabled="preparedLoading"
            type="button"
            @click="cancelPrepareOrder"
          >
            Cancel
          </button>
          <button
            :disabled="preparedLoading"
            type="button"
            class="primary"
            @click="submitPrepareOrder"
          >
            Submit
          </button>
        </div>
      </div>
    </a-modal>
    <transfer-icp
      ref="transferIcp"
      :balance="balance"
      title="Deposit ICP"
      type="Deposit"
      @transferSuccess="transferSuccess"
    ></transfer-icp>
    <transfer-token
      ref="transferToken"
      :current-token="currentToken"
      type="Deposit"
      transferButton="Deposit"
      @transferTokenSuccess="transferTokenSuccess"
    ></transfer-token>
    <pro-order
      ref="proOrder"
      v-if="currentPair"
      :current-pair="currentPair"
      :keeping-balance="keepingBalance"
      :tokens-balance-sto="tokensBalanceSto"
      :keeping-balance-sto="keepingBalanceSto"
      :buy-unit="buyUnit"
      :token-min-unit="tokenMinUnit"
      :unit="unit"
      :tokens="tokens"
      :pro-type="currentProOrderMenu"
      @createProOrderSuccess="createProOrderSuccess"
      @proOrderDepositKeepingBalance="proOrderDepositKeepingBalance"
      @gridTransferToken="gridTransferToken"
      @gridDepositKeepingBalance="gridDepositKeepingBalance"
    ></pro-order>
    <pro-wallet-swap
      v-if="currentPair"
      :tokens-balance="tokensBalance"
      :tokens-balance-sto="tokensBalanceSto"
      :tokens="tokens"
      ref="proWalletSwap"
      @proWalletSwapSuccess="proWalletSwapSuccess"
    ></pro-wallet-swap>
    <v-tour
      name="myTour"
      :steps="steps"
      :options="{ highlight: true }"
    ></v-tour>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { AstroXUserService } from '@/ic/MEAccount/Service';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { ICSwapRouterService } from '@/ic/ICSwapRouter/ICSwapRouterService';
import { DexNameType, PairTokenStdMenu } from '@/views/home/ICSwap/model';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import {
  DePairs,
  KLData,
  OrderBookType,
  OrderTypeEnum,
  OrderTypeMenu,
  ProOrderEnum,
  ProOrderMenu,
  TradeCompetitionsEnum,
  TradeCompetitionsMenu
} from '@/views/home/ICDex/model';
import {
  Icrc1Account,
  Time,
  TokenId,
  TokenInfo,
  TokenStd
} from '@/ic/common/icType';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { TokenLiquidity } from '@/ic/ICSwap/model';
import {
  BalanceChange,
  DexRole,
  icpPrice,
  KBar,
  KeepingBalance,
  LatestFilledRecord,
  LevelResponse,
  OrderFilled,
  OrderPrice,
  OrderStatus,
  OrderType,
  PairInfo,
  PendingList,
  PriceResponse,
  StopLossOrder,
  STOrder,
  StoSetting,
  STType,
  SysMode,
  tokenAmount,
  TradingOrder,
  TradingResult,
  TradingResultErr,
  TradingResultOk,
  TriggeredOrderInfo,
  TxAccount,
  TxnRecord
} from '@/ic/ICDex/model';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import {
  formatDateToDay,
  formatDateToMinute,
  fromSubAccountId,
  generateTxid,
  hexToBytes,
  principalToAccountIdentifier,
  toHexString
} from '@/ic/converter';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { ApproveError, TxReceiptErr } from '@/ic/DRC20Token/model';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { Chart, dispose, init } from 'klinecharts';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import { SwapTokenInfo } from '@/ic/ICSwapRouter/model';
import { getFee } from '@/ic/getTokenFee';
import { getTokenBalance } from '@/ic/getTokenBalance';
import { namespace } from 'vuex-class';
import { AstroXWebViewHandler } from '@astrox/sdk-webview';
import { connectIcx, initIcx } from '@/ic/connectIcx';
import { buildMemo, LEDGER_CANISTER_ID } from '@/ic/utils';
import TradingMining from '@/views/home/ICDex/components/TradingMining.vue';
import TradingCompetitions from '@/views/home/ICDex/components/TradingCompetitions.vue';
import Fallback from '@/views/home/ICDex/components/Fallback.vue';
import TradeCompetitions from '@/views/home/ICDex/components/TradeCompetitions.vue';
import EventBus from '@/utils/Event';
import { Menu } from '@/components/menu/model';
import { checkAuth } from '@/ic/CheckAuth';
import { isInfinity } from '@/ic/isInfinity';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { addedTokens, addToken } from '@/ic/addToken';
import TransferIcp from '@/components/transferIcp/Index.vue';
import TransferToken from '@/components/transferToken/Index.vue';
import { AddTokenItem, AddTokenItemClass } from '@/views/home/account/model';
import ProOrder from '@/views/home/ICDex/components/ProOrder.vue';
import ProWalletSwap from '@/views/home/ICDex/components/ProWalletSwap.vue';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';
import { toHttpRejectError } from '@/ic/httpError';

const commonModule = namespace('common');
const ProSubaccountId = 1;

@Component({
  name: 'Index',
  components: {
    TradingMining,
    Fallback,
    AccountInfo,
    TradeCompetitions,
    TradingCompetitions,
    TransferIcp,
    TransferToken,
    ProOrder,
    ProWalletSwap
  },
  filters: {
    stoUpdateFee(poFee1: bigint, decimals: number): string {
      return new BigNumber(poFee1.toString(10))
        .times(0.2)
        .div(10 ** decimals)
        .toString(10);
    },
    stoOrderFee(poFee2: string): string {
      return new BigNumber(poFee2).times(100).toString(10) + '%';
    },
    filterPpm(val: bigint): string {
      return (
        new BigNumber(val.toString(10))
          .times(100)
          .div(10 ** 6)
          .toString(10) + '%'
      );
    },
    icpToUsdt(
      val: bigint,
      currentMarketPrice: {},
      token1: string,
      decimals: number
    ): string {
      let price = '';
      if (token1 && token1.toLocaleLowerCase() === 'icp') {
        price = currentMarketPrice['icp'];
      } else if (token1 && token1.toLocaleLowerCase().includes('usdt')) {
        price = currentMarketPrice['usdt'];
      }
      if (price) {
        return new BigNumber(val.toString(10))
          .div(10 ** decimals)
          .times(price)
          .decimalPlaces(2, 1)
          .toString(10);
      }
      return '';
    },
    filterPairTokenPrice(
      price: string,
      token0Decimals: number,
      token1Decimals: number
    ): string {
      if (price || price.toString()) {
        return new BigNumber(price)
          .times(10 ** token0Decimals)
          .div(10 ** token1Decimals)
          .decimalPlaces(8)
          .toString(10);
      }
      return null;
    },
    filterChange(change: string): string {
      if ((change || change.toString()) && change.toString() !== 'NaN') {
        return new BigNumber(change).times(100).toFixed(2);
      }
      return '0.00';
    },
    filterPendingToken1(
      pendingList: Array<PendingList>,
      unitSize: bigint,
      buyUnit: number,
      tokenAmountUnit: number,
      token0Decimals: number,
      token1Decimals: number
    ): string {
      if (pendingList && pendingList.length) {
        let token = BigInt(0);
        pendingList.forEach((pending) => {
          const quantity = pending[1].orderPrice.quantity;
          const status = Object.keys(pending[1].status)[0];
          if (
            status === 'Pending' &&
            (
              quantity as {
                Buy: [tokenAmount, icpPrice];
              }
            ).Buy
          ) {
            const price = new BigNumber(
              pending[1].orderPrice.price.toString(10)
            )
              .div(10 ** token1Decimals)
              .div(
                new BigNumber(unitSize.toString(10)).div(10 ** token0Decimals)
              )
              .toFixed(buyUnit);
            const amount = (
              quantity as {
                Buy: [tokenAmount, icpPrice];
              }
            ).Buy[0];
            const token1Total = new BigNumber(price)
              .times(amount.toString(10))
              .div(10 ** token0Decimals)
              .times(10 ** token1Decimals);
            let filledAmount = BigInt(0);
            if (pending[1].filled && pending[1].filled.length) {
              filledAmount = pending[1].filled.reduce((prev, cur) => {
                return BigInt(
                  new BigNumber(prev.toString(10))
                    .plus(cur.token1Value.DebitRecord.toString(10))
                    .toString(10)
                );
              }, BigInt(0));
            }
            token = BigInt(
              new BigNumber(token.toString(10))
                .plus(token1Total)
                .minus(filledAmount.toString(10))
                .toString(10)
            );
          }
        });
        return token.toString(10);
      }
      return '';
    },
    filterPendingToken0(pendingList: Array<PendingList>): string {
      if (pendingList && pendingList.length) {
        let token = BigInt(0);
        pendingList.forEach((pending) => {
          let type = '';
          const quantity = pending[1].orderPrice.quantity;
          const status = Object.keys(pending[1].status)[0];
          if (
            (
              quantity as {
                Buy: [tokenAmount, icpPrice];
              }
            ).Buy
          ) {
            type = 'Buy';
          } else {
            type = 'Sell';
          }
          if (status === 'Pending' && type === 'Sell') {
            const tokenOrder = (
              quantity as {
                Sell: bigint;
              }
            ).Sell;
            let filledAmount = BigInt(0);
            if (pending[1].filled && pending[1].filled.length) {
              filledAmount = pending[1].filled.reduce((prev, cur) => {
                return BigInt(
                  new BigNumber(prev.toString(10))
                    .plus(cur.token0Value.DebitRecord.toString(10))
                    .toString(10)
                );
              }, BigInt(0));
            }
            token = BigInt(
              new BigNumber(token.toString(10))
                .plus(tokenOrder.toString(10))
                .minus(filledAmount.toString(10))
                .toString(10)
            );
          }
        });
        return token.toString(10);
      }
      return '';
    },
    filterMaxCache(val: bigint): string {
      if (val) {
        return new BigNumber(val.toString(10))
          .div(1000000)
          .div(1000)
          .div(60 * 60 * 24)
          .decimalPlaces(0)
          .toString(10);
      }
      return '';
    },
    filterTime(val: bigint): string {
      if (val) {
        let h: number | string = new Date(Number(val) * 1000).getHours();
        if (h < 10) {
          h = '0' + h;
        }
        let m: number | string = new Date(Number(val) * 1000).getMinutes();
        if (m < 10) {
          m = '0' + m;
        }
        return `${h}:${m}`;
      }
      return '';
    },
    filterLatestAmount(
      val: bigint,
      decimalPlaces: number,
      decimal: number
    ): string {
      if (val) {
        return new BigNumber(val.toString(10))
          .div(10 ** decimal)
          .toFixed(decimalPlaces);
      }
      return '';
    },
    filterLatestPrice(
      val: OrderFilled,
      token0Decimals: number,
      token1Decimals: number,
      tokenMinUnit: number
    ): string {
      let currentUnit = tokenMinUnit;
      if (tokenMinUnit < 0) {
        currentUnit = 0;
      }
      if (val) {
        const token1Value = Object.values(val.token1Value)[0];
        const tokenAmount = Object.values(val.token0Value)[0];
        const latestPrice = new BigNumber(token1Value)
          .times(10 ** token0Decimals)
          .div(10 ** token1Decimals)
          .div(tokenAmount);
        return latestPrice.toFixed(currentUnit, 3);
      }
      return '';
    },
    toFixed(val: BigNumber, decimals: number): string {
      if (val) {
        return val.toFixed(decimals);
      }
      return '';
    },
    filterBuyPrice(
      val: string,
      token0Price: string,
      currentTokenPrice: string
    ): string {
      if (val && token0Price && currentTokenPrice) {
        return new BigNumber(val)
          .times(token0Price)
          .div(currentTokenPrice)
          .decimalPlaces(6)
          .toString(10);
      }
      return '';
    },
    filterBuyFee(val: DePairs): string {
      if (val) {
        return (
          new BigNumber(val[1][0].feeRate.toString()).times(100).toString(10) +
          '%'
        );
      }
      return '-';
    },
    filterFeeRebate(val: string): string {
      if (val) {
        if (Number(val) === 0) {
          return val + '%';
        }
        return '-' + val + '%';
      }
      return '-';
    },
    filterFeeSellRebate(val: string): string {
      if (val) {
        if (Number(val) === 0) {
          return val + '%';
        }
        return '-' + new BigNumber(val).decimalPlaces(4) + '%';
      }
      return '-';
    },
    filterFee(val: DePairs): string {
      if (val) {
        return (
          new BigNumber(val[1][0].feeRate.toString()).times(100).toString(10) +
          '%'
        );
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @commonModule.Getter('getIcx') getIcx?: AstroXWebViewHandler;
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  private poolVisible = false;
  private showPrepareOrder = false;
  private preparing = [];
  private step = 0;
  private icpUnit = 4;
  private unit: bigint = null;
  private iCSwapRouterService: ICSwapRouterService;
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  private currentICDexService: ICDexService;
  private astroXUserService: AstroXUserService;
  private ledgerService: LedgerService | undefined;
  private tokensBalance: { [key: string]: string } = {};
  private tokensBalanceSto: { [key: string]: string } = {};
  private pairs: Array<DePairs> = [];
  private userLiquidity: TokenLiquidity = null;
  private currentPair: DePairs = null;
  private currentPairIndex = 0;
  private tokens: { [key: string]: TokenInfo } = {};
  private timer = null;
  private compEndTimer = null;
  private timerOrderBook = null;
  private time = 10;
  private latestFilledRecordChangeTimer = null;
  private timerQuotes = null;
  private tickSizes = [];
  private currentSize: { symbol: number; size: string } = null;
  private unitSize: string = null;
  private level100: LevelResponse = null;
  private ask: Array<PriceResponse> = [];
  private bid: Array<PriceResponse> = [];
  private tickAsk: Array<PriceResponse> = [];
  private tickBid: Array<PriceResponse> = [];
  private askTrade: Array<PriceResponse> = [];
  private bidTrade: Array<PriceResponse> = [];
  private orderBookType = OrderBookType.All;
  private orderBookTypeList = [
    {
      value: 'Order Book',
      key: OrderBookType.All
    },
    {
      value: 'Buy Order',
      key: OrderBookType.Buy
    },
    {
      value: 'Sell Order',
      key: OrderBookType.Sell
    }
  ];
  private icpPrice = '';
  private currentMarketPrice: { [key: string]: number } = { usdt: 1 };
  private orderTypeEnum = OrderTypeEnum;
  private orderType: OrderTypeMenu | 'Pro' | 'Stop-loss' = OrderTypeEnum.LMT;
  private proOrderEnum = ProOrderEnum;
  private currentProOrderMenu: ProOrderMenu = null;
  private buyPrice = '';
  private buyAmount = '';
  private buyTotal = '';
  private sellPrice = '';
  private sellAmount = '';
  private sellTotal = '';
  private isToBuy = false;
  private isToSell = false;
  private isToBuyMKT = false;
  private mktQuantity = 'Market';
  private mktTotal = 'Market';
  private mktPrice = '20';
  private mktSellPrice = '20';
  private stopBuyPrice = '';
  private stopSellPrice = '';
  private pendingList: Array<PendingList> = [];
  private pendingListPro: Array<PendingList> = [];
  private stopOrders: Array<STOrder> = [];
  private stopLossNeed: { token0: bigint; token1: bigint } = {
    token0: BigInt(0),
    token1: BigInt(0)
  };
  private proOrders: Array<STOrder> = [];
  private proOrdersLoading = false;
  private proOrdersPendingLoading = false;
  private currentProOrdersPage = 1;
  private preparedList: { [key: string]: Array<PendingList> } = {};
  private orderLoading: { [key: string]: boolean } = {};
  private plugLoading: { [key: string]: boolean } = {};
  private isTodo = false;
  private currentPendingPage = 1;
  private totalPending = 0;
  private currentPendingProPage = 1;
  private pairTotalPending = 0;
  private pairTotalPendingTimer = null;
  private pendingLoading = false;
  private maxTotal = BigInt('0');
  private userRecord: Array<TxnRecord> = [];
  private currentHistoryPage = 1;
  private userRecordProLoading = false;
  private userRecordPro: Array<TxnRecord> = [];
  private currentHistoryPagePro = 1;
  private latestFilledRecord: LatestFilledRecord = [];
  private tradeMenu = [
    {
      value: 'pending',
      name: 'Open Orders'
    },
    {
      value: 'stop',
      name: 'Stop-loss Orders'
    },
    {
      value: 'history',
      name: 'Trade History'
    },
    {
      value: 'pro',
      name: 'Pro'
    }
  ];
  private currentTradeMenu = 'pending';
  private tradeMenuPro = [
    {
      value: 'orders',
      name: 'Orders'
    },
    {
      value: 'pending',
      name: 'Open Orders'
    },
    {
      value: 'history',
      name: 'Trade History'
    }
  ];
  private currentTradeMenuPro = 'orders';
  private tokenPriceStatus = 'par';
  private buyTotalMKT = '';
  // private currentTokenPrice: string = null;
  private kIntervalList = [
    {
      value: 'Time',
      key: 60 // seconds
    },
    {
      value: '5m',
      key: 5 * 60
    },
    {
      value: '1H',
      key: 60 * 60
    },
    // {
    //   value: '4H',
    //   key: 4 * 60 * 60
    // },
    {
      value: '1D',
      key: 24 * 60 * 60
    },
    {
      value: '1W',
      key: 7 * 24 * 60 * 60
    }
  ];
  private currentKInterval = {
    value: '1H',
    key: 60 * 60
  };
  private KIntervals: Array<KBar> = [];
  private chartSpinning = false;
  private kLineChart: Chart;
  private isLatestFilledRecordChange = false;
  private buySlider = 0;
  private buyMktSlider = 0;
  private sellSlider = 0;
  private sellMktSlider = 0;
  private dayInfo = null;
  private buyMarks = {
    0: '',
    25: '',
    50: '',
    75: '',
    100: ''
  };
  private tradeMarks = [
    {
      value: 25,
      name: '25%'
    },
    {
      value: 50,
      name: '50%'
    },
    {
      value: 75,
      name: '75%'
    },
    {
      value: 100,
      name: '100%'
    }
  ];
  private currentMark = 0;
  private orderExpirationDuration: bigint = null;
  private toStatus: { [key: number]: OrderStatus } = {};
  private h5Menu = [
    // {
    //   value: 'Chart',
    //   name: 'chart'
    // },
    {
      value: 'Order Book',
      name: 'orderBook'
    },
    {
      value: 'Trades',
      name: 'trades'
    }
  ];
  private currentMenu = 'orderBook';
  private isH5 = false;
  private focusin = false;
  private showParis = false;
  private showTrade = false;
  private tradeType = 'Buy';
  private proVisible = false;
  private tokenAllowance: { [key: string]: { [key: string]: bigint } } = {};
  private feeRebate = '';
  private menuList: Menu[] = [
    {
      value: 'Trade',
      path: '/ICDex'
    },
    {
      value: 'Market',
      path: '/icdex/market'
    },
    {
      value: 'Pool',
      path: '/icdex/pools'
    },
    {
      value: 'Competitions',
      path: '/icdex/competitions'
    },
    {
      value: 'Mining',
      path: '/icl/tradingMining'
    }
  ];
  private pairInfo: PairInfo = null;
  private sysMode: { mode: SysMode; openingTime: Time } = null;
  private preparedLoading = false;
  private cancelId = null;
  private prepare: { [key: string]: TxAccount } = {};
  private prepareOrder: { [key: string]: Array<number> } = {};
  private orderQueue: { [key: string]: Array<any> } = {}; // Each item will be a function to be executed;
  private tradeCompetitionsEnum = TradeCompetitionsEnum;
  private tradeCompetitionsMenu: TradeCompetitionsMenu = null;
  private isToSetReferrer = false;
  private oldPairs = [
    'scjza-fiaaa-aaaak-ac2kq-cai',
    'ig3ej-haaaa-aaaak-adrva-cai',
    'oru4a-nqaaa-aaaak-acufa-cai'
  ];
  private tradePairs = {
    ICP: [],
    // Old: [],
    USDT: []
  };
  private tradeMarketSort = [
    {
      name: 'ICP',
      value: 'ICP'
    },
    // {
    //   name: 'Old',
    //   value: 'Old'
    // },
    {
      name: 'USDT',
      value: 'USDT'
    }
  ];
  private currentTradeMarketSort: string = null;
  private hostname = '';
  private hostHref = '';
  private keepingBalance: { [key: string]: string } = {};
  private keepingBalanceSto: { [key: string]: string } = {};
  private showKeepBalance = false;
  private isPoolMode = false;
  private isKeeping = false;
  private isKeepingSetting = false;
  private isPoolModeSetting = false;
  private balance = '';
  private currentToken: AddTokenItem = null;
  private isToken0: boolean = null;
  private dexRole: DexRole = null;
  private stoConfig: StoSetting = null;
  // Tour
  private steps = [];
  @Watch('buyTotal')
  private onBuyTotalChange() {
    if (Number(this.buyTotal)) {
      const token1Id = this.currentPair[1][0].token1[0].toString();
      const tokenFee = getFee(this.tokens[token1Id]);
      let total = this.getTotal(token1Id, tokenFee);
      let currentUnit = this.buyUnit;
      if (this.buyUnit < 0) {
        currentUnit = 0;
      }
      total = new BigNumber(total)
        .div(10 ** this.tokens[token1Id].decimals)
        .toFixed(currentUnit);
      this.currentMark = this.buySlider = new BigNumber(this.buyTotal)
        .div(total)
        .times(100)
        .decimalPlaces(0)
        .toNumber();
    } else {
      this.currentMark = this.buySlider = 0;
    }
  }
  @Watch('buyTotalMKT')
  private onBuyTotalMKTChange() {
    if (Number(this.buyTotalMKT)) {
      const token1Id = this.currentPair[1][0].token1[0].toString();
      const tokenFee = getFee(this.tokens[token1Id]);
      let total = this.getTotal(token1Id, tokenFee);
      let currentUnit = this.buyUnit;
      if (this.buyUnit < 0) {
        currentUnit = 0;
      }
      total = new BigNumber(total)
        .div(10 ** this.tokens[token1Id].decimals)
        .toFixed(currentUnit);
      this.currentMark = this.buyMktSlider = new BigNumber(this.buyTotalMKT)
        .div(total)
        .times(100)
        .decimalPlaces(0)
        .toNumber();
    } else {
      this.currentMark = this.buyMktSlider = 0;
    }
  }
  @Watch('sellAmount')
  private onSellAmountChange() {
    if (Number(this.sellAmount)) {
      const token0Id = this.currentPair[1][0].token0[0].toString();
      const tokenFee = getFee(this.tokens[token0Id]);
      const total = new BigNumber(this.getTotal(token0Id, tokenFee))
        .div(10 ** this.tokens[token0Id].decimals)
        .toFixed(this.tokenMinUnit);
      this.currentMark = this.sellSlider = new BigNumber(this.sellAmount)
        .div(total)
        .times(100)
        .decimalPlaces(0)
        .toNumber();
    } else {
      this.currentMark = this.sellSlider = 0;
    }
  }
  get showOpeningTime(): boolean {
    if (this.sysMode && this.sysMode.openingTime) {
      const now = new Date().getTime();
      return (
        new BigNumber(this.sysMode.openingTime.toString(10))
          .div(1000000)
          .gt(now) &&
        new BigNumber(this.sysMode.openingTime.toString(10))
          .div(1000000)
          .minus(72 * 60 * 60 * 1000)
          .lt(now)
      );
    }
    return false;
  }
  get token0Price(): string {
    // only icp pair
    if (
      this.currentTokenPrice &&
      this.currentTokenPrice !== '-' &&
      this.icpPrice &&
      this.currentPair
    ) {
      const token0Std = Object.keys(this.currentPair[1][0].token0[2])[0];
      let price = '';
      if (token0Std.toLocaleLowerCase() === 'icp') {
        // todo no tokenPrice
        price = new BigNumber(this.icpPrice).decimalPlaces(8).toString(10);
      } else {
        price = new BigNumber(this.currentTokenPrice)
          .times(this.icpPrice)
          .decimalPlaces(8)
          .toString(10);
      }
      if (new BigNumber(price).lt(1)) {
        price = new BigNumber(price).toFixed(8);
      } else {
        price = new BigNumber(price).toFixed(4);
      }
      return price;
    }
    return '-';
  }
  get currentTokenPrice(): string {
    // Token1 price relative token0 price
    const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (this.currentPair && this.currentPair[2]) {
      const token0Id = this.currentPair[1][0].token0[0].toString();
      const token1Id = this.currentPair[1][0].token1[0].toString();
      if (tokens[token0Id] && tokens[token1Id]) {
        const price = new BigNumber(this.currentPair[2].price)
          .times(10 ** tokens[token0Id].decimals)
          .div(10 ** tokens[token1Id].decimals)
          .decimalPlaces(8)
          .toString(10);
        if (new BigNumber(tokens[token0Id].price).gt(price)) {
          this.tokenPriceStatus = 'put';
        } else if (new BigNumber(tokens[token0Id].price).lt(price)) {
          this.tokenPriceStatus = 'call';
        } else {
          this.tokenPriceStatus = 'par';
        }
        tokens[token0Id].price = price;
        localStorage.setItem('tokens', JSON.stringify(tokens));
        return price;
      }
    }
    return null;
  }
  get buyAmountErrorUNIT(): boolean {
    let buyAmountError = false;
    if (this.unit && this.tokens[this.currentPair[1][0].token0[0].toString()]) {
      const decimals =
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
      const tokenUnitDecimals = this.unit.toString().length - 1;
      if (tokenUnitDecimals > decimals) {
        if (this.buyAmount) {
          if (
            new BigNumber(this.buyAmount)
              .modulo(new BigNumber(this.unit.toString()).div(10 ** decimals))
              .toString(10) !== '0'
          ) {
            buyAmountError = true;
          }
        }
      }
    }
    return buyAmountError;
  }
  get buyAmountError(): boolean {
    let buyAmountError = false;
    if (this.buyPrice) {
      if (new BigNumber(this.buyAmount).gt(this.maxBuyAmount)) {
        buyAmountError = true;
      }
    }
    return buyAmountError;
  }
  get maxBuyMKTTotal(): string {
    if (this.currentPair && this.tokens) {
      const token1Id = this.currentPair[1][0].token1[0].toString();
      if (
        this.tokensBalance &&
        this.tokensBalance[token1Id] &&
        this.tokens &&
        this.tokens[token1Id]
      ) {
        const token1Decimals = this.tokens[token1Id].decimals;
        const tokenFee = getFee(this.tokens[token1Id]);
        let keepingBalance = '0';
        if (this.isKeeping && this.keepingBalance[token1Id]) {
          keepingBalance = new BigNumber(this.keepingBalance[token1Id])
            .minus(tokenFee.toString(10))
            .minus(tokenFee.toString(10))
            .toString(10);
        }
        const max = new BigNumber(this.tokensBalance[token1Id])
          .plus(keepingBalance)
          .minus(tokenFee.toString(10))
          .minus(tokenFee.toString(10))
          .div(10 ** token1Decimals)
          .decimalPlaces(token1Decimals, 1)
          .toString(10);
        if (new BigNumber(max).lt(0)) {
          return '0';
        }
        return max;
      }
    }
    return '';
  }
  get buyTotalMKTError(): boolean {
    let buyTotalMKTError = false;
    if (new BigNumber(this.buyTotalMKT).gt(this.maxBuyMKTTotal)) {
      buyTotalMKTError = true;
    }
    return buyTotalMKTError;
  }
  get maxBuyAmount(): string {
    let maxBuyAmount = '';
    if (this.currentPair) {
      const token1Id = this.currentPair[1][0].token1[0].toString();
      if (
        this.tokensBalance &&
        this.tokensBalance[token1Id] &&
        this.tokens &&
        this.tokens[token1Id]
      ) {
        const tokenFee = getFee(this.tokens[token1Id]);
        let keepingBalance = '0';
        if (this.isKeeping && this.keepingBalance[token1Id]) {
          keepingBalance = new BigNumber(this.keepingBalance[token1Id])
            .minus(tokenFee.toString(10))
            .minus(tokenFee.toString(10))
            .toString(10);
        }
        let fee = '0';
        if (this.orderType === 'Stop-loss' && this.stoConfig) {
          fee = this.stoConfig.sloFee1.toString(10);
        } else {
          fee = '0';
        }
        maxBuyAmount = new BigNumber(this.tokensBalance[token1Id])
          .plus(keepingBalance)
          .minus(tokenFee.toString(10))
          .minus(tokenFee.toString(10))
          // .minus(this.stopLossNeed.token1.toString(10))
          .minus(fee)
          .div(10 ** this.tokens[token1Id].decimals)
          .div(this.buyPrice)
          .decimalPlaces(this.tokenMinUnit, 1)
          .toString(10);
        if (new BigNumber(maxBuyAmount).lt(0)) {
          return '0';
        }
        return maxBuyAmount;
      }
    }
    return maxBuyAmount;
  }
  get sellAmountErrorUNIT(): boolean {
    let buyAmountError = false;
    if (this.unit && this.tokens[this.currentPair[1][0].token0[0].toString()]) {
      const decimals =
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
      const tokenUnitDecimals = this.unit.toString().length - 1;
      if (tokenUnitDecimals > decimals) {
        if (this.sellAmount) {
          if (
            new BigNumber(this.sellAmount)
              .modulo(new BigNumber(this.unit.toString()).div(10 ** decimals))
              .toString(10) !== '0'
          ) {
            buyAmountError = true;
          }
        }
      }
    }
    return buyAmountError;
  }
  get sellAmountError(): boolean {
    let buyAmountError = false;
    if (this.sellAmount) {
      if (new BigNumber(this.sellAmount).gt(this.maxSellAmount)) {
        buyAmountError = true;
      }
    }
    return buyAmountError;
  }
  get maxSellAmount(): string {
    let maxSellAmount = '';
    if (this.currentPair) {
      const token0Id = this.currentPair[1][0].token0[0].toString();
      if (
        this.tokensBalance &&
        this.tokensBalance[token0Id] &&
        this.tokens &&
        this.tokens[token0Id]
      ) {
        const tokenFee = getFee(this.tokens[token0Id]);
        let keepingBalance = '0';
        if (this.isKeeping && this.keepingBalance[token0Id]) {
          keepingBalance = new BigNumber(this.keepingBalance[token0Id])
            .minus(tokenFee.toString(10))
            .minus(tokenFee.toString(10))
            .toString(10);
        }
        maxSellAmount = new BigNumber(this.tokensBalance[token0Id])
          .plus(keepingBalance)
          .minus(tokenFee.toString(10)) // approve
          .minus(tokenFee.toString(10))
          // .minus(this.stopLossNeed.token0.toString(10))
          .div(10 ** this.tokens[token0Id].decimals)
          .decimalPlaces(this.tokenMinUnit, 1)
          .toString(10);
        if (new BigNumber(maxSellAmount).lt(0)) {
          return '0';
        }
        return maxSellAmount;
      }
    }
    return maxSellAmount;
  }
  get buyUnit(): number {
    if (
      this.tokens &&
      this.currentPair &&
      this.tokens[this.currentPair[1][0].token1[0].toString()]
    ) {
      const token1Decimals =
        this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
      if (token1Decimals - this.tokenMinUnit > 0) {
        let unit = token1Decimals - this.tokenMinUnit;
        if (unit > 8) {
          unit = 8;
        }
        if (
          this.currentPair[2] &&
          this.currentPair[2].price &&
          Number(this.currentPair[2].price) >= 1 &&
          unit > 4
        ) {
          unit = 4;
        }
        return unit;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
  get tokenMinUnit(): number {
    if (
      this.currentPair &&
      this.tokens &&
      this.tokens[this.currentPair[1][0].token0[0].toString()] &&
      this.unit
    ) {
      const decimals =
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
      const tokenUnitDecimals = this.unit.toString().length - 1; // Unit must 1+0000
      if (decimals > tokenUnitDecimals) {
        // todo
        return decimals - tokenUnitDecimals;
      }
    }
    return 0;
  }
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
  beforeDestroy(): void {
    window.removeEventListener('resize', this.setFocusin);
    this.initInterval();
    this.clearMonitor();
    window.clearTimeout(this.compEndTimer);
    this.compEndTimer = null;
  }
  async mounted(): Promise<void> {
    this.hostname = window.location.hostname;
    this.hostHref = window.location.href;
    this.astroXUserService = new AstroXUserService();
    if ((window as any).icx) {
      EventBus.$on('initSuccess', () => {
        this.initSuccess(this.currentPair, true);
      });
      await initIcx();
      this.pushUser();
    }
    if (this.$route.params.token0 && this.$route.params.token1) {
      document.title = `${this.$route.params.token0}/${this.$route.params.token1} - ICDex (Orderbook Dex)`;
    }
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.ledgerService = new LedgerService();
    this.iCSwapRouterService = new ICSwapRouterService();
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.currentICDexService = new ICDexService();
    window.addEventListener('resize', this.setFocusin);
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
    try {
      this.getDexPairs('icdex').then(() => {
        // this.$nextTick(() => {
        //   this.$tours['myTour'].start();
        // });
      });
      this.getIcpPrice();
      this.initFallbackInfo();
      const principal = localStorage.getItem('principal');
      // this.principal = principal;
      if (principal) {
        const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
        this.tokensBalance = currentInfo.tokensBalance || {};
      }
    } catch (e) {
      console.error(e);
    }
    this.steps = [
      {
        target: '.trade-market-old',
        content: 'Old trade pair',
        params: {
          enableScrolling: false
        }
      }
    ];
  }
  private getStopLossNeed(): { token0: bigint; token1: bigint } {
    let token0 = '0';
    let token1 = '0';
    if (this.stopOrders.length) {
      this.stopOrders.forEach((item) => {
        const condition = (item.strategy as { StopLossOrder: StopLossOrder })
          .StopLossOrder.condition;
        const type = Object.keys(condition.order.side)[0];
        const status = Object.keys(item.status)[0];
        if (status === 'Running') {
          if (type === 'Sell') {
            token0 = new BigNumber(token0)
              .plus(condition.order.quantity.toString(10))
              .toString(10);
          }
          if (type === 'Buy') {
            const token1Id = this.currentPair[1][0].token1[0].toString();
            const token0Id = this.currentPair[1][0].token0[0].toString();
            if (
              this.unit &&
              this.tokens &&
              this.tokens[token0Id] &&
              this.tokens[token1Id]
            ) {
              const price = new BigNumber(condition.order.price.toString(10))
                .div(10 ** this.tokens[token1Id].decimals)
                .div(
                  new BigNumber(this.unit.toString(10)).div(
                    10 ** this.tokens[token0Id].decimals
                  )
                );
              token1 = new BigNumber(condition.order.quantity.toString(10))
                .div(10 ** this.tokens[token0Id].decimals)
                .times(price)
                .times(10 ** this.tokens[token1Id].decimals)
                .plus(token1)
                .toString(10);
            }
          }
        }
      });
      return {
        token0: BigInt(token0),
        token1: BigInt(token1)
      };
    }
    return {
      token0: BigInt(0),
      token1: BigInt(0)
    };
  }
  private setReferral(): void {
    let accountId = this.$route.query.accountId;
    let entity = this.$route.query.entity;
    if (accountId) {
      try {
        let referral = this.$cookies.get('referral') || {};
        referral[this.currentPair[0].toString()] = {
          accountId: accountId,
          entity: entity ? (entity as string).trim() : ''
        };
        console.log(JSON.stringify(referral));
        this.$cookies.set('referral', JSON.stringify(referral));
      } catch (e) {
        console.log(e);
      }
    }
  }
  private changeTradeCompetitionsMenu(menu: TradeCompetitionsMenu): void {
    this.tradeCompetitionsMenu = menu;
    (this.$refs.tradeCompetitions as any).init(menu);
    console.log(this.tradeCompetitionsMenu);
  }
  private infoBack(): void {
    this.tradeCompetitionsMenu = null;
  }
  private setFocusin(): void {
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
    this.getLevel100(this.currentPair[0].toString());
  }
  private async pushUser(): Promise<void> {
    const icxPrincipals =
      JSON.parse(localStorage.getItem('icxPrincipals')) || [];
    const principal = localStorage.getItem('principal');
    const address = principalToAccountIdentifier(Principal.fromText(principal));
    await this.astroXUserService.pushUser(address, icxPrincipals[0]);
  }
  private showFallback(): void {
    (this.$refs as any).fallback.fallbackVisible = true;
    (this.$refs as any).fallback.init();
  }
  private async getMakerRebate(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentPair = this.currentPair[0].toString();
      const res = await this.currentICDexService.makerRebate(
        currentPair,
        principal
      );
      console.log(res);
      if (res && res.pairId === this.currentPair[0].toString()) {
        this.feeRebate = res.makerRebate[1].toString();
      }
    }
  }
  private async connectWallet(): Promise<void> {
    if ((window as any).icx) {
      const icxCanisterIds: Array<string> =
        JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
      await connectIcx(icxCanisterIds);
      this.initSuccess(this.currentPair, true);
    } else {
      this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    }
  }
  private changeSellSlider(sellSlider: number): void {
    this.currentMark = sellSlider;
    this.sellSlider = sellSlider;
    let sellAmount = new BigNumber(this.maxSellAmount)
      .times(this.sellSlider)
      .div(100)
      .toFixed(this.tokenMinUnit, 1);
    const decimals =
      this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
    const tokenUnitDecimals = this.unit.toString().length - 1;
    if (tokenUnitDecimals > decimals) {
      const unit = new BigNumber(this.unit.toString(10))
        .div(10 ** decimals)
        .toString(10);
      const integer = new BigNumber(sellAmount).div(unit).toFixed(0, 1);
      console.log(unit);
      console.log(integer);
      if (new BigNumber(integer).gte(1)) {
        sellAmount = new BigNumber(integer).times(unit).toString(10);
      } else {
        sellAmount = '0';
      }
    }
    if (Number(sellAmount) >= 0) {
      this.sellAmount = sellAmount;
    } else {
      this.sellAmount = '';
    }
    this.sellAmountChange();
  }
  private sellMktAmountChange(): void {
    if (Number(this.sellAmount)) {
      this.sellMktSlider = new BigNumber(this.sellAmount)
        .times(
          10 **
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
        )
        .div(this.tokensBalance[this.currentPair[1][0].token0[0].toString()])
        .times(100)
        .decimalPlaces(0)
        .toNumber();
    } else {
      this.sellMktSlider = 0;
    }
    this.getMktTotal();
  }
  private changeSellMktSlider(sellMktSlider: number): void {
    this.currentMark = sellMktSlider;
    this.sellMktSlider = sellMktSlider;
    let sellAmount = new BigNumber(this.maxSellAmount)
      .times(this.sellMktSlider)
      .div(100)
      .toFixed(this.tokenMinUnit, 1);
    const decimals =
      this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
    const tokenUnitDecimals = this.unit.toString().length - 1;
    if (tokenUnitDecimals > decimals) {
      const unit = new BigNumber(this.unit.toString(10))
        .div(10 ** decimals)
        .toString(10);
      const integer = new BigNumber(sellAmount).div(unit).toFixed(0, 1);
      console.log(unit);
      console.log(integer);
      if (new BigNumber(integer).gte(1)) {
        sellAmount = new BigNumber(integer).times(unit).toString(10);
      } else {
        sellAmount = '0';
      }
    }
    if (Number(sellAmount) > 0) {
      this.sellAmount = sellAmount;
    } else {
      this.sellAmount = '';
    }
    this.sellMktAmountChange();
  }
  private getTotal(tokenId: string, tokenFee: bigint | string): string {
    let keepingBalance = '0';
    if (this.isKeeping && this.keepingBalance[tokenId]) {
      keepingBalance = new BigNumber(this.keepingBalance[tokenId])
        .minus(tokenFee.toString(10))
        .toString(10);
    }
    if (this.isKeeping || this.isPoolMode) {
      keepingBalance = new BigNumber(keepingBalance)
        .minus(tokenFee.toString(10))
        .toString(10);
    }
    const token1Id = this.currentPair[1][0].token1[0].toString();
    let fee = '0';
    if (
      this.orderType === 'Stop-loss' &&
      this.stoConfig &&
      tokenId === token1Id
    ) {
      fee = this.stoConfig.sloFee1.toString(10);
    } else {
      fee = '0';
    }
    let stopLossNeed = '0';
    if (tokenId === token1Id) {
      // stopLossNeed = this.stopLossNeed.token1.toString(10);
    } else {
      // stopLossNeed = this.stopLossNeed.token0.toString(10);
    }
    return new BigNumber(this.tokensBalance[tokenId])
      .plus(keepingBalance)
      .minus(tokenFee.toString(10))
      .minus(fee)
      .minus(stopLossNeed)
      .toString(10);
  }
  private changeBuyMktSlider(buyMktSlider: number): void {
    this.currentMark = buyMktSlider;
    this.buyMktSlider = buyMktSlider;
    const tokenFee = getFee(
      this.tokens[this.currentPair[1][0].token1[0].toString()]
    );
    const token1Decimals =
      this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
    const token1Id = this.currentPair[1][0].token1[0].toString();
    const buyTotalMKT = new BigNumber(this.getTotal(token1Id, tokenFee))
      .times(this.buyMktSlider)
      .div(100)
      .div(
        10 ** this.tokens[this.currentPair[1][0].token1[0].toString()].decimals
      )
      .decimalPlaces(token1Decimals, 1)
      .toString(10);
    if (new BigNumber(buyTotalMKT).gt(0)) {
      this.buyTotalMKT = buyTotalMKT;
    } else {
      this.buyTotalMKT = '';
    }
    this.mktTotalChange();
  }
  private changeBuySlider(buySlider: number): void {
    this.buySlider = buySlider;
    this.currentMark = buySlider;
    const tokenFee = getFee(
      this.tokens[this.currentPair[1][0].token1[0].toString()]
    );
    const token1Id = this.currentPair[1][0].token1[0].toString();
    const buyTotal = new BigNumber(this.getTotal(token1Id, tokenFee))
      .times(this.buySlider)
      .div(100)
      .div(
        10 ** this.tokens[this.currentPair[1][0].token1[0].toString()].decimals
      )
      .toFixed(this.icpUnit, 1);
    if (new BigNumber(buyTotal).gte(0)) {
      if (Number(this.buyPrice)) {
        this.buyAmount = new BigNumber(buyTotal)
          .div(this.buyPrice)
          .decimalPlaces(this.tokenMinUnit, 1)
          .toString(10);
        this.buyTotal = new BigNumber(this.buyPrice)
          .times(this.buyAmount)
          .toString(10);
      }
    }
  }
  private async latestFilled(swapId: string): Promise<void> {
    let latestFilledRecord = await this.currentICDexService.latestFilled(
      swapId
    );
    if (latestFilledRecord.pairId === this.currentPair[0].toString()) {
      if (
        this.latestFilledRecord[0] &&
        latestFilledRecord.latestFilledRecord[0] &&
        latestFilledRecord.latestFilledRecord[0][0] !==
          this.latestFilledRecord[0][0]
      ) {
        window.clearInterval(this.latestFilledRecordChangeTimer);
        this.latestFilledRecordChangeTimer = null;
        this.isLatestFilledRecordChange = true;
        this.latestFilledRecordChangeTimer = setTimeout(() => {
          this.isLatestFilledRecordChange = false;
        }, 4 * 1000);
      }
      this.latestFilledRecord = latestFilledRecord.latestFilledRecord;
    }
  }
  private resetChart(): void {
    this.currentKInterval = {
      value: '1H',
      key: 60 * 60
    };
    let style = {
      candle: {
        margin: {
          top: 0.3,
          bottom: 0.1
        },
        tooltip: {
          labels: ['', 'Open: ', 'Close: ', 'High: ', 'Low: ', 'Change: '],
          text: {
            color: '#646e79',
            marginLeft: 8,
            marginTop: 6,
            marginRight: 0
          },
          values: (KLData) => {
            let color = '#76808F';
            // if (KLData.change < 0) {
            //   color = '#D13651';
            // }
            let change = KLData.change.toFixed(2);
            // if (KLData.change > 0) {
            //   change = KLData.change.toFixed(2);
            // } else {
            //   change = KLData.change.toFixed(2);
            // }
            let time;
            if (
              this.currentKInterval.value == '1D' ||
              this.currentKInterval.value == '1W'
            ) {
              time = formatDateToDay(new Date(KLData.timestamp));
            } else {
              time = formatDateToMinute(new Date(KLData.timestamp));
            }
            return [
              { value: time },
              {
                value: KLData.open.toFixed(this.buyUnit),
                color: color
              },
              {
                value: KLData.close.toFixed(this.buyUnit),
                color: color
              },
              {
                value: KLData.high.toFixed(this.buyUnit),
                color: color
              },
              {
                value: KLData.low.toFixed(this.buyUnit),
                color: color
              },
              {
                value: `${change}%`,
                color: color
              }
            ];
          }
        },
        priceMark: {
          high: {
            color: '#AEB4BC'
          },
          low: {
            color: '#AEB4BC'
          },
          last: {
            downColor: '#D13651',
            upColor: '#21C77D',
            noChangeColor: '#D13651',
            line: {
              show: false
            }
          }
        }
      },
      grid: {
        show: true,
        horizontal: {
          show: true,
          size: 1,
          color: '#18202a',
          // 'solid'|'dash'
          style: 'dash',
          dashValue: [2, 2]
        },
        vertical: {
          show: true,
          size: 1,
          color: '#18202a',
          // 'solid'|'dash'
          style: 'dash',
          dashValue: [2, 2]
        }
      },
      xAxis: {
        axisLine: {
          show: true,
          color: '#17202a',
          size: 1
        },
        tickText: {
          color: '#2f3944'
        },
        tickLine: {
          color: '#17202a'
        }
      },
      yAxis: {
        axisLine: {
          show: true,
          color: '#141b23',
          size: 1
        },
        tickText: {
          color: '#2f3944'
        },
        tickLine: {
          color: '#141b23'
        }
      },
      separator: {
        size: 1,
        color: '#17202a',
        fill: true,
        activeBackgroundColor: 'rgba(230, 230, 230, .15)'
      },
      technicalIndicator: {
        height: 50,
        margin: {
          top: 0.2,
          bottom: 0
        },
        bar: {
          downColor: 'rgba(209, 54, 81, 0.4)',
          upColor: 'rgba(33, 199, 125, 0.4)',
          noChangeColor: 'rgba(209, 54, 81, 0.4)'
        }
      }
    };
    if (this.isH5) {
      (style.candle.tooltip as any).showRule = 'follow_cross';
      (style.candle.tooltip as any).showType = 'rect';
      (style.candle.tooltip as any).rect = {
        paddingLeft: 5,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 12,
        offsetLeft: 8,
        offsetTop: 8,
        offsetRight: 8,
        borderRadius: 4,
        borderSize: 1,
        color: '#848E9C',
        backgroundColor: '#000000',
        borderColor: '#000000'
      };
    }
    this.kLineChart = init('kInterval-chart', style);
    const VOLInfo = this.kLineChart.getTechnicalIndicatorTemplate('VOL');
    const plot = VOLInfo.plots[3];
    let plots = [];
    if (this.currentPair) {
      const title0 = `Vol(${this.currentPair[1][0].token0[1]}): `;
      const title1 = `Vol(${this.currentPair[1][0].token1[1]}): `;
      plots = [
        Object.assign(JSON.parse(JSON.stringify(plot)), {
          title: title0,
          key: 'token0Vol',
          color: plot.color
        }),
        Object.assign(JSON.parse(JSON.stringify(plot)), {
          title: title1,
          key: 'token1Vol',
          color: plot.color
        })
      ];
    } else {
      plots = [plot, plot];
    }
    this.kLineChart.addTechnicalIndicatorTemplate(
      Object.assign(VOLInfo, {
        calcParams: [],
        plots: plots,
        calcTechnicalIndicator: (kLineDataList, { plots }) => {
          return kLineDataList.map((KLData) => {
            const ma = {};
            ma[JSON.parse(JSON.stringify(plots[0])).key] = KLData.token0volume;
            ma[JSON.parse(JSON.stringify(plots[1])).key] = KLData.token1volume;
            return ma;
          });
        }
      })
    );
    this.kLineChart.createTechnicalIndicator('VOL', false, { height: 50 });
    // this.kLineChart.createTechnicalIndicator('MA', false, {
    //   id: 'candle_pane'
    // });
  }
  private initInterval(): void {
    window.clearInterval(this.timer);
    this.timer = null;
    window.clearInterval(this.latestFilledRecordChangeTimer);
    this.latestFilledRecordChangeTimer = null;
    window.clearInterval(this.timerQuotes);
    this.timerQuotes = null;
    window.clearInterval(this.timerOrderBook);
    this.timerOrderBook = null;
    try {
      dispose('kInterval-chart');
    } catch (e) {
      console.error(e);
    }
  }
  private changeKIntervalList(kInterval): void {
    window.clearInterval(this.timerQuotes);
    this.timerQuotes = null;
    this.currentKInterval = kInterval;
    this.getQuotes(this.currentPair[0].toString(), true);
  }
  private initEcharts(swapId: string, isInit: boolean): void {
    if (this.currentKInterval.value === 'Time') {
      this.kLineChart.setStyleOptions({
        candle: {
          type: 'area',
          area: {
            lineSize: 1,
            lineColor: '#83b2e0',
            value: 'close',
            backgroundColor: [
              {
                offset: 0,
                color: 'rgba(33, 150, 243, 0)'
              },
              {
                offset: 1,
                color: 'rgba(33, 150, 243, 0)'
              }
            ]
          }
        }
      });
    } else {
      this.kLineChart.setStyleOptions({
        candle: {
          type: 'candle_solid',
          bar: {
            downColor: '#D13651',
            upColor: '#21C77D',
            noChangeColor: '#D13651'
          }
        }
      });
    }
    this.kLineChart.setPriceVolumePrecision(this.buyUnit, this.tokenMinUnit);
    if (!isInit) {
      const data = this.splitData(this.KIntervals);
      const oldData = this.kLineChart.getDataList();
      if (data.length) {
        if (
          new BigNumber(data[data.length - 1].timestamp)
            .minus(oldData[oldData.length - 1].timestamp)
            .div(1000)
            .gt(this.currentKInterval.key)
        ) {
          this.kLineChart.applyNewData(data);
        } else {
          this.kLineChart.updateData(data[data.length - 1]);
        }
      }
    } else {
      console.log(this.splitData(this.KIntervals));
      this.kLineChart.applyNewData(this.splitData(this.KIntervals));
    }
    window.clearInterval(this.timerQuotes);
    this.timerQuotes = null;
    this.timerQuotes = setTimeout(async () => {
      await this.getQuotes(swapId);
    }, 5 * 1000);
  }
  private splitData(rawData: Array<KBar>): KLData[] {
    if (
      this.tokens &&
      this.tokens[this.currentPair[1][0].token0[0].toString()]
    ) {
      let data: KLData[] = [];
      const token0Decimals =
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
      const token1Decimals =
        this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
      for (let i = 0; i < rawData.length; i++) {
        const open = this.filterLevelPrice(
          rawData[i].open,
          this.unit,
          token0Decimals,
          token1Decimals,
          this.buyUnit
        );
        const close = this.filterLevelPrice(
          rawData[i].close,
          this.unit,
          token0Decimals,
          token1Decimals,
          this.buyUnit
        );
        const lowest = this.filterLevelPrice(
          rawData[i].low,
          this.unit,
          token0Decimals,
          token1Decimals,
          this.buyUnit
        );
        const highest = this.filterLevelPrice(
          rawData[i].high,
          this.unit,
          token0Decimals,
          token1Decimals,
          this.buyUnit
        );
        const vol = new BigNumber(rawData[i].vol.value0.toString(10))
          .div(10 ** token0Decimals)
          .toFixed(this.tokenMinUnit);
        const token1Vol = new BigNumber(rawData[i].vol.value1.toString(10))
          .div(10 ** token1Decimals)
          .toFixed(token1Decimals);
        const turnover = new BigNumber(open)
          .plus(close)
          .plus(lowest)
          .plus(highest)
          .div(4)
          .times(vol)
          .toNumber();
        const timestamp =
          Number(rawData[i].kid) * this.currentKInterval.key * 1000;
        let change = 0;
        if (i > 0) {
          const preClose = this.filterLevelPrice(
            rawData[i - 1].close,
            this.unit,
            token0Decimals,
            token1Decimals,
            this.buyUnit
          );
          change = new BigNumber(close)
            .minus(preClose)
            .div(preClose)
            .times(100)
            .toNumber();
        }
        data.push({
          timestamp: timestamp,
          open: Number(open),
          close: Number(close),
          high: Number(highest),
          low: Number(lowest),
          token0volume: Number(vol),
          token1volume: Number(token1Vol),
          turnover: turnover,
          change: change
        });
      }
      return data;
    }
  }
  private init24(data: KBar[]): void {
    const currentData = data[0];
    const token0Decimals =
      this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
    const token1Decimals =
      this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
    const lowest = this.filterLevelPrice(
      currentData.low,
      this.unit,
      token0Decimals,
      token1Decimals,
      this.buyUnit
    );
    const highest = this.filterLevelPrice(
      currentData.high,
      this.unit,
      token0Decimals,
      token1Decimals,
      this.buyUnit
    );
    const vol = new BigNumber(currentData.vol.value0.toString(10))
      .div(10 ** token0Decimals)
      .toFixed(this.tokenMinUnit);
    let change = '0.00';
    if (data.length > 1) {
      const close = this.filterLevelPrice(
        currentData.close,
        this.unit,
        token0Decimals,
        token1Decimals,
        this.buyUnit
      );
      const preClose = this.filterLevelPrice(
        data[1].close,
        this.unit,
        token0Decimals,
        token1Decimals,
        this.buyUnit
      );
      change = new BigNumber(close)
        .minus(preClose)
        .div(preClose)
        .times(100)
        .toFixed(2);
    }
    this.dayInfo = {
      lowest: lowest,
      highest: highest,
      vol: vol,
      change: change
    };
  }
  private async getQuotes(swapId: string, isInit = false): Promise<void> {
    if (isInit) {
      this.chartSpinning = true;
    }
    try {
      this.currentICDexService
        .getQuotes(swapId, BigInt(this.currentKInterval.key))
        .then((res) => {
          if (res.paidId === this.currentPair[0].toString()) {
            this.KIntervals = res.quotes.slice().reverse();
            this.initEcharts(swapId, isInit);
            this.chartSpinning = false;
          }
        })
        .catch(() => {
          this.chartSpinning = false;
        });
      // 24H
      const key = 24 * 60 * 60;
      const res = await this.currentICDexService.getQuotes(swapId, BigInt(key));
      if (res.paidId === this.currentPair[0].toString()) {
        this.init24(res.quotes);
      }
    } catch (e) {
      this.chartSpinning = false;
      console.log(e);
    }
  }
  private orderDisabled(orderPrice: bigint): boolean {
    if (this.currentTokenPrice && this.pairTotalPending > 30000) {
      const price = this.filterLevelPrice(
        orderPrice,
        this.unit,
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals,
        this.tokens[this.currentPair[1][0].token1[0].toString()].decimals,
        this.buyUnit
      );
      if (
        new BigNumber(this.currentTokenPrice).times(1.05).lt(price) ||
        new BigNumber(this.currentTokenPrice).times(0.95).gt(price)
      ) {
        return true;
      }
    }
    return false;
  }
  private setTradePrice(val: PriceResponse, type: string): void {
    if (this.orderType !== 'MKT' && this.orderType !== 'Stop-loss') {
      const price = this.filterLevelPrice(
        val.price,
        this.unit,
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals,
        this.tokens[this.currentPair[1][0].token1[0].toString()].decimals,
        this.buyUnit,
        type
      );
      if (this.pairTotalPending > 30000) {
        if (
          new BigNumber(this.currentTokenPrice).times(1.05).lt(price) ||
          new BigNumber(this.currentTokenPrice).times(0.95).gt(price)
        ) {
          // this.$info({
          //   content:
          //     'The trading matching engine (TME) is under computational pressure, busy trading mode (BTM) is on, and the system is only accepting orders within +/- 5% of the latest price.',
          //   class: 'connect-plug',
          //   icon: 'connect-plug',
          //   okText: 'Confirm'
          // });
          return;
        }
      }
      this.buyPrice = this.sellPrice = parseFloat(price).toString(10);
      this.buyPriceChange();
      this.sellPriceChange();
    }
  }
  private setTrade(
    val: PriceResponse,
    type: string,
    index: number,
    orderbook: Array<PriceResponse>
  ): void {
    if (this.orderType === 'MKT') {
      return;
    }
    const price = this.filterLevelPrice(
      val.price,
      this.unit,
      this.tokens[this.currentPair[1][0].token0[0].toString()].decimals,
      this.tokens[this.currentPair[1][0].token1[0].toString()].decimals,
      this.buyUnit,
      type
    );
    if (this.pairTotalPending > 30000) {
      if (
        new BigNumber(this.currentTokenPrice).times(1.05).lt(price) ||
        new BigNumber(this.currentTokenPrice).times(0.95).gt(price)
      ) {
        // this.$info({
        //   content:
        //     'The trading matching engine (TME) is under computational pressure, busy trading mode (BTM) is on, and the system is only accepting orders within +/- 5% of the latest price.',
        //   class: 'connect-plug',
        //   icon: 'connect-plug',
        //   okText: 'Confirm'
        // });
        return;
      }
    }
    this.buyPrice = this.sellPrice = parseFloat(price).toString(10);
    if (type === 'ask') {
      this.sellAmount = '';
      this.sellTotal = '';
      let amount = BigInt(0);
      for (let i = orderbook.length - 1; i >= index; i--) {
        amount = BigInt(
          new BigNumber(amount.toString(10))
            .plus(orderbook[i].quantity.toString(10))
            .toString(10)
        );
      }
      const currentAmount = this.filterQuantity(
        amount,
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals,
        this.tokenMinUnit
      );
      if (Number(currentAmount)) {
        this.buyAmount = currentAmount;
        this.buyAmountChange();
      }
    } else {
      this.buyAmount = '';
      this.buyTotal = '';
      let amount = BigInt(0);
      for (let i = 0; i <= index; i++) {
        amount = BigInt(
          new BigNumber(amount.toString(10))
            .plus(orderbook[i].quantity.toString(10))
            .toString(10)
        );
      }
      const currentAmount = this.filterQuantity(
        amount,
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals,
        this.tokenMinUnit
      );
      if (Number(currentAmount)) {
        this.sellAmount = currentAmount;
        this.sellAmountChange();
      }
    }
  }
  private changeTradeMenu(value: string) {
    this.currentTradeMenu = value;
    if (value === 'pro') {
      this.currentTradeMenuPro = 'orders';
      this.getProOrders(this.currentPair[0].toString(), this.getPrincipalId);
    }
  }
  private changeTradeMenuPro(value: string) {
    this.currentTradeMenuPro = value;
    if (value === 'orders') {
      this.getProOrders(this.currentPair[0].toString(), this.getPrincipalId);
    } else if (value === 'pending') {
      this.getPendingListPro();
    } else if (value === 'history') {
      const address = principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId),
        new Uint8Array(fromSubAccountId(ProSubaccountId))
      );
      this.getTradeList(this.currentPair[0].toString(), address, true);
    }
  }
  private getOrderPrice(txnRecord: TxnRecord, buyUnit: number): string {
    if (
      this.tokens &&
      this.currentPair &&
      txnRecord.order.token0Value[0] &&
      txnRecord.order.token1Value[0]
    ) {
      const token0 = this.currentPair[1][0].token0[0].toString();
      const token1 = this.currentPair[1][0].token1[0].toString();
      if (this.tokens[token0] && this.tokens[token1]) {
        const token0Decimals = this.tokens[token0].decimals;
        const token1Decimals = this.tokens[token1].decimals;
        // const side = this.getTradeSide(txnRecord.token0Value);
        const token0Value = Object.values(txnRecord.order.token0Value[0])[0];
        const token1Value = Object.values(txnRecord.order.token1Value[0])[0];
        if (token0Value) {
          return new BigNumber(token1Value.toString(10))
            .div(10 ** token1Decimals)
            .div(token0Value.toString(10))
            .times(10 ** token0Decimals)
            .decimalPlaces(buyUnit)
            .toString(10);
        } else {
          return '-';
        }
      }
    }
    return '';
  }
  private getAvgPrice(txnRecord: TxnRecord, buyUnit: number): string {
    if (this.tokens && this.currentPair) {
      const token0 = this.currentPair[1][0].token0[0].toString();
      const token1 = this.currentPair[1][0].token1[0].toString();
      if (this.tokens[token0] && this.tokens[token1]) {
        const token0Decimals = this.tokens[token0].decimals;
        const token1Decimals = this.tokens[token1].decimals;
        // const side = this.getTradeSide(txnRecord.token0Value);
        const token0Value = Object.values(txnRecord.filled.token0Value)[0];
        const token1Value = Object.values(txnRecord.filled.token1Value)[0];
        if (token0Value) {
          return new BigNumber(token1Value.toString(10))
            .div(10 ** token1Decimals)
            .times(10 ** token0Decimals)
            .div(token0Value.toString(10))
            .decimalPlaces(buyUnit)
            .toString(10);
        } else {
          return '-';
        }
      }
    }
    return '';
  }
  private getTradeFee(txnRecord: TxnRecord, isToken0 = true): string {
    const token0Decimals =
      this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
    const token1Decimals =
      this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
    const token0Symbol =
      this.tokens[this.currentPair[1][0].token0[0].toString()].symbol;
    const token1Symbol =
      this.tokens[this.currentPair[1][0].token1[0].toString()].symbol;
    const token0Fee = new BigNumber(txnRecord.fee.token0Fee.toString(10))
      .div(10 ** token0Decimals)
      .decimalPlaces(8);
    const token1Fee = new BigNumber(txnRecord.fee.token1Fee.toString(10))
      .div(10 ** token1Decimals)
      .decimalPlaces(8);
    if (isToken0) {
      if (token0Fee.toString(10) && token0Fee.toString(10) !== '0') {
        return token0Fee.toString(10) + ' ' + token0Symbol;
      }
    } else {
      if (token1Fee.toString(10) && token1Fee.toString(10) !== '0') {
        return token1Fee.toString(10) + ' ' + token1Symbol;
      }
    }
  }
  private getTradeAmount(txnRecord: TxnRecord): BigNumber {
    const token1Decimals =
      this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
    const token0Value: bigint = Object.values(txnRecord.filled.token0Value)[0];
    return new BigNumber(token0Value.toString(10)).div(10 ** token1Decimals);
  }
  private getTradeSide(token0value: BalanceChange): string {
    if (Object.keys(token0value)[0] === 'DebitRecord') {
      return 'Sell';
    } else if (Object.keys(token0value)[0] === 'CreditRecord') {
      return 'Buy';
    }
  }
  private filterTxid(txid: Array<number>): string {
    return toHexString(new Uint8Array(txid));
  }
  private changeHistory(page): void {
    this.currentHistoryPage = page;
  }
  private changeHistoryPro(page): void {
    this.currentHistoryPagePro = page;
  }
  private changeProOrders(page): void {
    this.currentProOrdersPage = page;
  }
  private async getStopOrders(
    swapId: string,
    principal: string
  ): Promise<void> {
    const res = await this.currentICDexService.sto_getAccountStopLossOrders(
      swapId,
      principalToAccountIdentifier(Principal.fromText(principal))
    );
    if (res && res.pairId === this.currentPair[0].toString()) {
      this.stopOrders = res.orders;
    } else {
      this.stopOrders = [];
    }
    this.stopLossNeed = this.getStopLossNeed();
  }
  private async getProOrders(swapId: string, principal: string): Promise<void> {
    this.proOrdersLoading = true;
    const res = await this.currentICDexService.sto_getAccountProOrders(
      swapId,
      principalToAccountIdentifier(
        Principal.fromText(principal),
        new Uint8Array(fromSubAccountId(ProSubaccountId))
      )
    );
    if (
      res &&
      res.pairId === this.currentPair[0].toString() &&
      res.orders.length
    ) {
      this.proOrders = res.orders;
    } else {
      this.proOrders = [];
    }
    this.proOrdersLoading = false;
  }
  private async getTradeList(
    swapId: string,
    account: string,
    isPro = false
  ): Promise<void> {
    if (isPro) {
      this.userRecordProLoading = true;
    }
    let res;
    try {
      res = await this.currentICDexService.drc205Events(swapId, [account]);
    } catch (e) {
      const now = new Date().getTime();
      const start = new BigNumber(now)
        .minus(30 * 24 * 60 * 60 * 1000)
        .times(10 ** 6)
        .toString(10);
      res = await this.currentICDexService.drc205_events_filter(
        swapId,
        [account],
        [BigInt(start)],
        []
      );
    }
    if (res && res.pairId === this.currentPair[0].toString()) {
      if (res.records && res.records.length) {
        const removeDuplicateObj = (arr) => {
          let obj = {};
          arr = arr.reduce((newArr, next) => {
            obj[this.filterTxid(next.txid)]
              ? ''
              : (obj[this.filterTxid(next.txid)] = true && newArr.push(next));
            return newArr;
          }, []);
          return arr;
        };
        if (isPro) {
          this.userRecordPro = removeDuplicateObj(res.records).slice(0, 100);
        } else {
          this.userRecord = removeDuplicateObj(res.records).slice(0, 100);
        }
      }
    }
    if (isPro) {
      this.userRecordProLoading = false;
    }
  }
  private async cancel(order: TradingOrder, isPro = false): Promise<void> {
    const now = new Date().getTime();
    const less1H = new BigNumber(now)
      .minus(60 * 60 * 1000)
      .times(1000000)
      .lte(order.time.toString(10));
    if (less1H && !order.filled.length) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      const side = this.filterSide(order.orderPrice);
      let minimum = '';
      if (side === 'Buy') {
        const tokenInfo =
          this.tokens[this.currentPair[1][0].token1[0].toString()];
        const tokenId = this.currentPair[1][0].token1[0].toString();
        const tokenFee = getFee(this.tokens[tokenId]).toString(10);
        minimum =
          new BigNumber(tokenFee)
            .times(2)
            .div(10 ** tokenInfo.decimals)
            .toString(10) +
          ' ' +
          tokenInfo.symbol;
      } else {
        const tokenInfo =
          this.tokens[this.currentPair[1][0].token0[0].toString()];
        const tokenId = this.currentPair[1][0].token0[0].toString();
        const tokenFee = getFee(this.tokens[tokenId]).toString(10);
        minimum =
          new BigNumber(tokenFee)
            .times(2)
            .div(10 ** tokenInfo.decimals)
            .toString(10) +
          ' ' +
          tokenInfo.symbol;
      }
      const fee = new BigNumber(this.currentPair[1][0].feeRate.toString())
        .times(100)
        .times(20 / 100) // 20%
        .toString(10);
      this.$confirm({
        content: `The order not filled will be charged a ${fee}% (minimum ${minimum}) cancellation fee if cancelled within 1h of being placed.`,
        class: 'connect-plug',
        icon: 'connect-plug',
        centered: true,
        okText: 'Ok',
        cancelText: 'Back',
        onOk() {
          _that.onCancel(order, isPro);
        }
      });
    } else {
      this.onCancel(order, isPro);
    }
  }
  private swapWallet(tokenId: string, showSwap = true): void {
    (this.$refs as any).proWalletSwap.tokenId = tokenId;
    (this.$refs as any).proWalletSwap.showSwap = showSwap;
    (this.$refs as any).proWalletSwap.visible = true;
  }
  private onCreateProOrder(): void {
    (this.$refs as any).proOrder.init(this.currentProOrderMenu);
  }
  private showProOrder(type: ProOrderMenu): void {
    this.currentProOrderMenu = type;
    const hasGrid = localStorage.getItem('GridWarn');
    if (hasGrid) {
      this.orderType = 'Pro';
      this.currentTradeMenu = 'pro';
      this.getProOrders(this.currentPair[0].toString(), this.getPrincipalId);
      if (this.isH5) {
        this.proVisible = true;
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      this.$confirm({
        content:
          'Strategy orders require you to have knowledge related to financial trading and are only recommended for professional traders.\n' +
          'The new feature is still in beta status and may have unforeseen technical flaws.\n' +
          'In order to save the computing power of smart contracts, Strategy Orders will charge an additional fee.\n' +
          'If you use this feature, you need to bear all the risks associated with it.',
        class: 'connect-plug confirm-swap-button',
        icon: 'connect-plug',
        okText: 'Confirm',
        centered: true,
        onOk() {
          localStorage.setItem('GridWarn', 'true');
          _that.orderType = 'Pro';
          _that.currentTradeMenu = 'pro';
          if (_that.isH5) {
            _that.proVisible = true;
          }
        }
      });
    }
  }
  private onUpdateProOrder(item: STOrder): void {
    let stType = Object.keys(item.stType)[0];
    let type;
    if (stType === 'GridOrder') {
      type = 'Grid';
    } else if (stType === 'IcebergOrder') {
      type = 'Iceberg';
    } else {
      type = stType;
    }
    this.currentProOrderMenu = type;
    (this.$refs as any).proOrder.step = 3;
    (this.$refs as any).proOrder.update(item);
  }
  private async onDeleteStopLoss(soid: bigint): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      await this.currentICDexService.sto_updateStopLossOrder(
        this.currentPair[0].toString(),
        soid,
        {
          status: [{ Deleted: null }],
          order: [],
          triggerPrice: []
        }
      );
      await this.getStopOrders(
        this.currentPair[0].toString(),
        this.getPrincipalId
      );
      this.$message.success('Success');
      this.getDepositBalance();
    } catch (e) {
      console.log(e);
      if (toHttpRejectError(e)) {
        this.$message.error(toHttpRejectError(e));
      } else {
        this.$message.error('Error');
      }
    }
    loading.close();
  }
  private async onDeleteProOrder(soid: bigint, type: STType): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const stType = Object.keys(type)[0];
    if (stType === 'GridOrder') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          GridOrder: {
            status: [{ Deleted: null }],
            lowerLimit: [],
            upperLimit: [],
            spread: [],
            amount: []
          }
        },
        ProSubaccountId
      );
    } else if (stType === 'IcebergOrder') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          IcebergOrder: {
            status: [{ Deleted: null }],
            setting: []
          }
        },
        ProSubaccountId
      );
    }
    loading.close();
    this.getProOrders(this.currentPair[0].toString(), this.getPrincipalId);
    this.$message.success('Success');
  }
  private async onRunningProOrder(soid: bigint, type: STType): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const stType = Object.keys(type)[0];
    if (stType === 'GridOrder') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          GridOrder: {
            status: [{ Running: null }],
            lowerLimit: [],
            upperLimit: [],
            spread: [],
            amount: []
          }
        },
        ProSubaccountId
      );
    } else if (stType === 'IcebergOrder') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          IcebergOrder: {
            status: [{ Running: null }],
            setting: []
          }
        },
        ProSubaccountId
      );
    }
    loading.close();
    this.getProOrders(this.currentPair[0].toString(), this.getPrincipalId);
    this.$message.success('Success');
  }
  private async onStopProOrder(soid: bigint, type: STType): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const stType = Object.keys(type)[0];
    if (stType === 'GridOrder') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          GridOrder: {
            status: [{ Stopped: null }],
            lowerLimit: [],
            upperLimit: [],
            spread: [],
            amount: []
          }
        },
        ProSubaccountId
      );
    } else if (stType === 'IcebergOrder') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          IcebergOrder: {
            status: [{ Stopped: null }],
            setting: []
          }
        },
        ProSubaccountId
      );
    }
    loading.close();
    this.getProOrders(this.currentPair[0].toString(), this.getPrincipalId);
    this.$message.success('Success');
  }
  private async onCancel(order: TradingOrder, isPro: boolean): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    this.cancelId = order.txid;
    console.log(order.txid, isPro);
    this.currentICDexService
      .cancelByTxid(
        this.currentPair[0].toString(),
        order.txid,
        isPro ? ProSubaccountId : 0
      )
      .then(() => {
        if (
          toHexString(new Uint8Array(this.cancelId)) ===
          toHexString(new Uint8Array(order.txid))
        ) {
          this.getIntervalPrice(6);
          this.cancelId = null;
          loading.close();
          if (isPro) {
            this.getPendingListPro();
          }
          this.$message.success('Cancel Success');
        }
        setTimeout(() => {
          this.getStatusByTxid(order.txid, loading, isPro);
        }, 2000);
      })
      .catch((e) => {
        console.log(e);
        loading.close();
        this.$message.success('Cancel Error');
      });
  }
  private getStatusByTxid(txid: Array<number>, loading, isPro: boolean): void {
    try {
      const currentPair = this.currentPair[0].toString();
      this.currentICDexService
        .statusByTxid(currentPair, txid)
        .then((txidStatus) => {
          if (
            txidStatus &&
            txidStatus.pairId === this.currentPair[0].toString()
          ) {
            if (Object.keys(txidStatus.orderStatusResponse)[0] !== 'Pending') {
              if (
                toHexString(new Uint8Array(this.cancelId)) ===
                toHexString(new Uint8Array(txid))
              ) {
                this.$message.success('Cancel Success');
                if (isPro) {
                  this.getPendingListPro();
                } else {
                  this.getPending(this.currentPair[0].toString());
                }
                this.cancelId = null;
                loading.close();
              }
            } else {
              const order = Object.values(txidStatus.orderStatusResponse)[0];
              console.log(order.status);
              if (order.status) {
                if (Object.keys(order.status)[0] === 'Todo') {
                  if (
                    toHexString(new Uint8Array(this.cancelId)) ===
                    toHexString(new Uint8Array(txid))
                  ) {
                    this.$message.success('Cancel pending');
                    this.cancelId = null;
                    if (isPro) {
                      this.getPendingListPro();
                    } else {
                      this.getPending(this.currentPair[0].toString());
                    }
                    loading.close();
                  }
                } else if (Object.keys(order.status)[0] === 'Pending') {
                  setTimeout(() => {
                    this.getStatusByTxid(order.txid, loading, isPro);
                  }, 3000);
                } else {
                  if (
                    toHexString(new Uint8Array(this.cancelId)) ===
                    toHexString(new Uint8Array(txid))
                  ) {
                    this.$message.success('Cancel Success');
                    this.cancelId = null;
                    if (isPro) {
                      this.getPendingListPro();
                    } else {
                      this.getPending(this.currentPair[0].toString());
                    }
                    loading.close();
                  }
                }
              }
            }
          }
        });
    } catch (e) {
      //
    }
  }
  private async getTotalPending(): Promise<void> {
    const currentPair = this.currentPair[0].toString();
    const res = await this.currentICDexService.pendingCount(currentPair);
    if (res.pairId === this.currentPair[0].toString()) {
      this.pairTotalPending = Number(res.count);
      console.log(this.pairTotalPending);
      this.clearMonitor();
      if (this.pairTotalPending > 20000) {
        this.pairTotalPendingTimer = setInterval(() => {
          setTimeout(() => {
            this.monitor();
          }, 0);
        }, 60 * 1000);
      }
    }
  }
  private async monitor(): Promise<void> {
    const currentPair = this.currentPair[0].toString();
    const res = await this.currentICDexService.monitor(currentPair);
    if (res && res.pairId === this.currentPair[0].toString()) {
      console.log('monitor: ' + res.monitor);
      this.pairTotalPending = Number(res.monitor);
      this.clearMonitor();
    }
  }
  private clearMonitor(): void {
    if (this.pairTotalPending <= 20000 && this.pairTotalPendingTimer) {
      window.clearInterval(this.pairTotalPendingTimer);
      this.pairTotalPendingTimer = null;
    }
  }
  private async getMorePending(
    currentPendingPage: number,
    pendingList: Array<PendingList>,
    subaccountId = 0
  ): Promise<Array<PendingList>> {
    const principal = localStorage.getItem('principal');
    const currentPair = this.currentPair[0].toString();
    const res = await this.currentICDexService.pending(
      currentPair,
      [
        principalToAccountIdentifier(
          Principal.fromText(principal),
          new Uint8Array(fromSubAccountId(subaccountId))
        )
      ],
      [currentPendingPage],
      [200]
    );
    if (res && res.pairId === this.currentPair[0].toString()) {
      const totalPending = Number(res.trieList.total);
      pendingList = pendingList.concat(res.trieList.data);
      if (totalPending > pendingList.length) {
        currentPendingPage++;
        return await this.getMorePending(
          currentPendingPage,
          pendingList,
          subaccountId
        );
      } else {
        return pendingList;
      }
    }
  }
  private async getPendingListPro(): Promise<void> {
    this.proOrdersPendingLoading = true;
    let pendingList: Array<PendingList> = [];
    const currentPendingPage = 1;
    const res = await this.getMorePending(
      currentPendingPage,
      pendingList,
      ProSubaccountId
    );
    console.log(res);
    if (res && res.length) {
      this.pendingListPro = res.sort(
        (a, b) => Number(b[1].time) - Number(a[1].time)
      );
    } else {
      this.pendingListPro = [];
    }
    if (this.pendingListPro.length <= 10) {
      this.currentPendingProPage = 1;
    }
    this.getToStatusPro(this.currentPair[0].toString());
    this.proOrdersPendingLoading = false;
  }
  private async getPending(swapId: string, isInit = false): Promise<void> {
    if (isInit) {
      this.pendingLoading = true;
    }
    try {
      let pendingList: Array<PendingList> = [];
      const currentPendingPage = 1;
      const res = await this.getMorePending(currentPendingPage, pendingList);
      if (res && res.length) {
        this.pendingList = res.sort(
          (a, b) => Number(b[1].time) - Number(a[1].time)
        );
        const pendingTxIds = [];
        let maxNonce = BigInt('0');
        this.pendingList.forEach((pendingList) => {
          if (
            new BigNumber(pendingList[1].nonce.toString(10)).gt(
              maxNonce.toString(10)
            )
          ) {
            maxNonce = pendingList[1].nonce;
          }
          pendingTxIds.push(toHexString(new Uint8Array(pendingList[0])));
        });
        const currentPairId = this.currentPair[0].toString();
        if (
          this.preparedList[currentPairId] &&
          this.preparedList[currentPairId].length
        ) {
          for (let i = 0; i < this.preparedList[currentPairId].length; i++) {
            const preparedList = this.preparedList[currentPairId][i];
            if (
              pendingTxIds.includes(
                toHexString(new Uint8Array(preparedList[0]))
              ) ||
              new BigNumber(maxNonce.toString(10)).gt(
                preparedList[1].nonce.toString(10)
              )
            ) {
              console.log(toHexString(new Uint8Array(preparedList[0])));
              this.preparedList[currentPairId].splice(i, 1);
              this.deletePrepare(currentPairId, preparedList[1].nonce);
              i--;
            } else {
              if (
                (this.prepareOrder[currentPairId] &&
                  !this.prepareOrder[currentPairId].includes(
                    Number(preparedList[1].nonce)
                  )) ||
                !this.prepareOrder[currentPairId]
              ) {
                if (i > 0) {
                  const status = Object.keys(
                    this.preparedList[currentPairId][i - 1][1].status
                  )[0];
                  if (status !== 'Prepared') {
                    this.statusByTxid(currentPairId, preparedList);
                  }
                } else {
                  this.statusByTxid(currentPairId, preparedList);
                }
              }
              this.pendingList.unshift(preparedList);
            }
          }
        }
        this.totalPending = this.pendingList.length;
        if (this.totalPending <= 10) {
          this.currentPendingPage = 1;
        }
      }
    } catch (e) {
      console.log(e);
    }
    this.getToStatus(swapId);
    this.pendingLoading = false;
  }
  private statusByTxid(currentPairId: string, preparedList: PendingList): void {
    const status = Object.keys(preparedList[1].status)[0];
    if (status !== 'Prepared' && status !== 'Todo' && status !== 'Pending') {
      return;
    }
    this.currentICDexService
      .statusByTxid(currentPairId, preparedList[0])
      .then((res) => {
        console.log(res);
        if (res && res.pairId === this.currentPair[0].toString()) {
          const orderStatus = Object.keys(res.orderStatusResponse)[0];
          if (
            orderStatus === 'Pending' ||
            orderStatus === 'Failed' ||
            orderStatus === 'Completed'
          ) {
            if (this.currentPair[0].toString() === currentPairId) {
              console.log(orderStatus);
              if (orderStatus === 'Pending' || orderStatus === 'Failed') {
                this.$set(
                  preparedList,
                  1,
                  Object.values(res.orderStatusResponse)[0]
                );
              }
              if (orderStatus === 'Completed') {
                const value: TxnRecord = Object.values(
                  res.orderStatusResponse
                )[0];
                preparedList[1].status = {
                  Completed: null
                };
                preparedList[1].filled = value.details;
                this.$set(preparedList, 1, preparedList[1]);
              }
            }
          }
        }
      });
  }
  private async getToStatusPro(swapId: string): Promise<void> {
    if (
      this.currentTradeMenu === 'pro' &&
      this.currentTradeMenuPro === 'pending'
    ) {
      // let pending = true;
      const MAX_COCURRENCY = 20;
      let toidsAll = [];
      let toids = [];
      this.pendingListPro.forEach((res, index) => {
        if (res[1].toids && res[1].toids.length) {
          for (let i = res[1].toids.length - 1; i >= 0; i--) {
            let status;
            if (this.toStatus[Number(res[1].toids[i])]) {
              status = Object.keys(this.toStatus[Number(res[1].toids[i])])[0];
            }
            if (!status || status === 'Todo' || status === 'Doing') {
              toids.push(res[1].toids[i]);
              if (toids.length === MAX_COCURRENCY) {
                toidsAll.push(toids);
                toids = [];
              }
            }
          }
        }
        if (
          toids.length < MAX_COCURRENCY &&
          index === this.pendingListPro.length - 1
        ) {
          toidsAll.push(toids);
        }
      });
      for (let i = 0; i < toidsAll.length; i++) {
        const promiseAll = [];
        for (let j = 0; j < toidsAll[i].length; j++) {
          promiseAll.push(this.ictcGetTo(toidsAll[i][j]));
        }
        await Promise.all(promiseAll);
      }
      if (swapId === this.currentPair[0].toString()) {
        const isTodo = this.pendingListPro.some((res) => {
          const tradingOrderStatus = Object.keys(res[1].status)[0];
          return (
            this.getOrderStatus(res[1].toids) === 'Doing' ||
            this.getOrderStatus(res[1].toids) === 'Todo' ||
            tradingOrderStatus === 'Todo' ||
            tradingOrderStatus === 'Prepared'
          );
        });
        if (isTodo) {
          window.setTimeout(() => {
            this.getPendingListPro();
          }, 6 * 1000);
          this.TTRun();
        } else {
          //
        }
      }
    }
  }
  private async getToStatus(swapId: string): Promise<void> {
    // let pending = true;
    const MAX_COCURRENCY = 20;
    let toidsAll = [];
    let toids = [];
    this.pendingList.forEach((res, index) => {
      if (res[1].toids && res[1].toids.length) {
        for (let i = res[1].toids.length - 1; i >= 0; i--) {
          let status;
          if (this.toStatus[Number(res[1].toids[i])]) {
            status = Object.keys(this.toStatus[Number(res[1].toids[i])])[0];
          }
          if (!status || status === 'Todo' || status === 'Doing') {
            toids.push(res[1].toids[i]);
            if (toids.length === MAX_COCURRENCY) {
              toidsAll.push(toids);
              toids = [];
            }
          }
        }
      }
      if (
        toids.length < MAX_COCURRENCY &&
        index === this.pendingList.length - 1
      ) {
        toidsAll.push(toids);
      }
    });
    for (let i = 0; i < toidsAll.length; i++) {
      const promiseAll = [];
      for (let j = 0; j < toidsAll[i].length; j++) {
        promiseAll.push(this.ictcGetTo(toidsAll[i][j]));
      }
      await Promise.all(promiseAll);
    }
    if (swapId === this.currentPair[0].toString()) {
      const txids = [];
      this.isTodo = this.pendingList.some((res) => {
        const tradingOrderStatus = Object.keys(res[1].status)[0];
        const txid = this.filterTxid(res[1].txid);
        txids.push(txid);
        return (
          this.getOrderStatus(res[1].toids) === 'Doing' ||
          this.getOrderStatus(res[1].toids) === 'Todo' ||
          tradingOrderStatus === 'Todo' ||
          tradingOrderStatus === 'Prepared'
        );
      });
      if (
        this.prepareOrder[this.currentPair[0].toString()] &&
        this.prepareOrder[this.currentPair[0].toString()].length
      ) {
        this.isTodo = true;
      }
      if (this.isTodo) {
        if (this.time !== 6) {
          this.getIntervalPrice(6);
        }
      } else {
        if (this.time !== 10) {
          this.getIntervalPrice();
        }
      }
      this.TTRun();
    }
  }
  private async TTRun(): Promise<void> {
    for (let k in this.toStatus) {
      const status = this.toStatus[k];
      if (status && Object.keys(status)[0] === 'Doing') {
        try {
          await this.currentICDexService.ictc_TTRun(
            this.currentPair[0].toString()
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
  }
  private getPendingStatus(tradingOrder: TradingOrder): string {
    let status = '';
    const tradingOrderStatus = Object.keys(tradingOrder.status)[0];
    if (tradingOrderStatus === 'Prepared') {
      status = 'Prepared';
    }
    if (tradingOrderStatus === 'Todo') {
      status = 'Pending';
    }
    const orderStatus = this.getOrderStatus(tradingOrder.toids);
    if (tradingOrderStatus === 'Pending') {
      status = 'Pending';
    }
    if (tradingOrderStatus === 'Closed') {
      if (!orderStatus) {
        status = 'Pending';
      } else if (orderStatus === 'Doing' || orderStatus === 'Todo') {
        status = 'Closing';
      } else {
        status = 'Closed';
      }
    }
    if (tradingOrderStatus === 'Cancelled') {
      status = 'Cancelled';
    }
    if (tradingOrderStatus === 'Fail') {
      status = 'Fail';
    }
    if (tradingOrderStatus === 'Completed') {
      status = 'Completed';
    }
    return status;
  }
  private getOrderStatus(toids: Array<bigint>): string {
    let status = '';
    for (let i = 0; i < toids.length; i++) {
      if (this.toStatus[Number(toids[i])]) {
        status = Object.keys(this.toStatus[Number(toids[i])])[0];
        if (status === 'Doing' || status === 'Todo') {
          return status;
        }
      }
    }
    return status;
  }
  private async ictcGetTo(toid: bigint): Promise<void> {
    try {
      const currentPair = this.currentPair[0].toString();
      const res = await this.currentICDexService.ictc_getTO(currentPair, toid);
      if (res && res.pairId === this.currentPair[0].toString()) {
        if (res.orders && res.orders.length) {
          this.toStatus[Number(toid)] = res.orders[0].status;
        } else {
          this.toStatus[Number(toid)] = {
            Done: null
          };
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  private changePending(page): void {
    this.currentPendingPage = page;
  }
  private changePendingPro(page): void {
    this.currentPendingProPage = page;
  }
  private async approve(
    amount: bigint,
    tokenId: string,
    currentPair: DePairs,
    address: string,
    tokenStd: string,
    subAccountId = 0
  ): Promise<boolean> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentAddress = principalToAccountIdentifier(
        Principal.fromText(principal)
      );
      if (currentAddress !== address) {
        return false;
      }
    } else {
      return false;
    }
    const spender = Principal.fromText(currentPair[0].toString());
    const currentDrc20Token = new DRC20TokenService();
    if (tokenStd.toLocaleLowerCase() === PairTokenStdMenu.dip20) {
      try {
        const res = await currentDrc20Token.approve(tokenId, spender, amount);
        if (
          (
            res as {
              Ok: bigint;
            }
          ).Ok
        ) {
          // this.tokenAllowance[currentPair[0].toString()][tokenId] = amount;
          return true;
        } else {
          const err = Object.keys(
            (
              res as {
                Err: TxReceiptErr;
              }
            ).Err
          )[0];
          this.$message.error(err);
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    } else if (tokenStd.toLocaleLowerCase() === PairTokenStdMenu.icrc2) {
      try {
        const res = await currentDrc20Token.icrc2_approve(
          tokenId,
          {
            owner: spender,
            subaccount: []
          },
          amount
        );
        if (
          (
            res as {
              Ok: bigint;
            }
          ).Ok
        ) {
          // this.tokenAllowance[currentPair[0].toString()][tokenId] = amount;
          return true;
        } else {
          const err = Object.keys(
            (
              res as {
                Err: ApproveError;
              }
            ).Err
          )[0];
          this.$message.error(err);
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    } else {
      try {
        const res = await currentDrc20Token.drc20Approve(
          amount,
          [],
          spender.toString(),
          [],
          subAccountId,
          tokenId
        );
        if (
          (
            res as {
              ok: Txid;
            }
          ).ok
        ) {
          // this.tokenAllowance[currentPair[0].toString()][tokenId] = amount;
          return true;
        } else {
          this.$message.error((res as TxnResultErr).err.message);
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
  private async onSellMKT(): Promise<void> {
    if (this.pairInfo && this.pairInfo.paused) {
      this.$message.warning('Trading pair has been paused.');
      return;
    }
    this.isToSell = true;
    if (this.sellAmount && !this.sellAmountError) {
      if (this.sellAmountErrorUNIT) {
        this.$message.warning(
          `Quantity must be an integral multiple of ${this.unitSize}`
        );
        return;
      }
      const token0Id = this.currentPair[1][0].token0[0].toString();
      const amount = BigInt(
        new BigNumber(this.sellAmount)
          .times(10 ** this.tokens[token0Id].decimals)
          .toString(10)
      );
      let price = BigInt(0);
      if (this.mktSellPrice) {
        const token1Decimals =
          this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
        price = BigInt(
          new BigNumber(1)
            .minus(new BigNumber(this.mktSellPrice).div(100))
            .times(this.currentTokenPrice)
            .times(10 ** token1Decimals)
            .times(
              new BigNumber(this.unit.toString(10)).div(
                10 ** this.tokens[token0Id].decimals
              )
            )
            .decimalPlaces(0)
            .toString(10)
        );
      }
      const orderPrice: OrderPrice = {
        quantity: { Sell: amount },
        price: price
      };
      const currentPairId = this.currentPair[0].toString();
      if (this.isPlug() || isInfinity()) {
        this.plugLoading[currentPairId] = true;
        setTimeout(() => {
          this.plugLoading[currentPairId] = false;
        }, 3000);
      }
      const principal = localStorage.getItem('principal');
      const address = principalToAccountIdentifier(Principal.from(principal));
      this.setPrepare(
        orderPrice,
        'Sell',
        this.orderType as OrderTypeEnum,
        this.sellAmount,
        this.prepare[currentPairId],
        this.currentPair,
        address
      );
    }
  }
  private isPlug(): boolean {
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (principal && priList) {
      return priList[principal] === 'Plug';
    }
    return false;
  }
  private needApprove(
    amount: bigint,
    tokenId: string,
    currentPair: DePairs,
    currentTokenPrice: string
  ): bigint {
    let allowance = BigInt(0);
    const currentPairId = currentPair[0].toString();
    if (
      this.tokenAllowance[currentPairId] &&
      this.tokenAllowance[currentPairId][tokenId]
    ) {
      allowance = this.tokenAllowance[currentPairId][tokenId];
    }
    if (new BigNumber(allowance.toString(10)).lt(amount.toString(10))) {
      let approve = BigInt(0);
      if (!Number(currentTokenPrice)) {
        approve = BigInt(
          new BigNumber(10000)
            .times(10 ** this.tokens[tokenId].decimals)
            .toString(10)
        );
      } else {
        if (currentPair[1][0].token1[0].toString() === LEDGER_CANISTER_ID) {
          approve = BigInt(
            new BigNumber(1000)
              .div(currentTokenPrice)
              .decimalPlaces(0)
              .times(10 ** this.tokens[tokenId].decimals)
              .toString(10)
          );
        } else if (
          currentPair[1][0].token0[0].toString() === LEDGER_CANISTER_ID
        ) {
          approve = BigInt(
            new BigNumber(1000)
              .times(currentTokenPrice)
              .decimalPlaces(0)
              .times(10 ** this.tokens[tokenId].decimals)
              .toString(10)
          );
        } else {
          approve = BigInt(
            new BigNumber(10000)
              .times(10 ** this.tokens[tokenId].decimals)
              .toString(10)
          );
        }
      }
      if (new BigNumber(approve.toString(10)).lt(amount.toString(10))) {
        return amount;
      } else {
        return approve;
      }
    } else {
      return BigInt(0);
    }
  }
  private getTxidAccount(nonce: number): TxAccount {
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
      principalToAccountIdentifier(owner, new Uint8Array(txid)),
      BigInt(nonce),
      txid
    ];
  }
  private deletePrepare(currentPairId: string, nonce: bigint): void {
    if (this.prepareOrder[currentPairId]) {
      const index = this.prepareOrder[currentPairId].indexOf(Number(nonce));
      if (index >= 0) {
        this.prepareOrder[currentPairId].splice(index, 1);
        if (
          this.prepareOrder[currentPairId] &&
          !this.prepareOrder[currentPairId].length
        ) {
          delete this.prepareOrder[currentPairId];
        }
        const principal = localStorage.getItem('principal');
        const address = principalToAccountIdentifier(Principal.from(principal));
        localStorage.setItem(
          `prepareOrder-${address}`,
          JSON.stringify(this.prepareOrder)
        );
        const currentOrder = `${currentPairId}-${address}-${Number(nonce)}`;
        localStorage.removeItem(currentOrder);
      }
    }
  }
  private initPrepared(currentPairId: string): void {
    this.preparing = [];
    const principal = localStorage.getItem('principal');
    if (!principal) {
      return;
    }
    const address = principalToAccountIdentifier(Principal.from(principal));
    this.prepareOrder =
      JSON.parse(localStorage.getItem(`prepareOrder-${address}`)) || {};
    if (!this.prepareOrder[currentPairId]) {
      this.prepareOrder[currentPairId] = [];
    }
    console.log(this.prepareOrder[currentPairId]);
    if (
      this.prepareOrder[currentPairId] &&
      this.prepareOrder[currentPairId].length
    ) {
      this.prepareOrder[currentPairId] = this.prepareOrder[currentPairId].sort(
        (a, b) => Number(a) - Number(b)
      );
      for (let i = 0; i < this.prepareOrder[currentPairId].length; i++) {
        const nonce = this.prepareOrder[currentPairId][i];
        if (nonce < Number(this.prepare[this.currentPair[0].toString()][2])) {
          this.deletePrepare(currentPairId, BigInt(nonce));
          i--;
        } else {
          const currentOrder = `${currentPairId}-${address}-${nonce}`;
          const order = JSON.parse(localStorage.getItem(currentOrder));
          if (order) {
            const orderPrice = JSON.parse(
              JSON.stringify(order.orderPrice),
              (key, value) =>
                typeof value === 'string' ? BigInt(value) : value
            );
            this.preparing.push({
              orderPrice: orderPrice,
              amount: order.amount,
              orderType: order.orderType,
              side: order.side
            });
          }
        }
      }
      if (this.prepareOrder[currentPairId].length) {
        this.showPrepareOrder = true;
      }
    }
  }
  private async submitPrepareOrder(): Promise<void> {
    const currentPairId = this.currentPair[0].toString();
    const prepareOrder = JSON.parse(
      JSON.stringify(this.prepareOrder[currentPairId])
    );
    const principal = localStorage.getItem('principal');
    const address = principalToAccountIdentifier(Principal.from(principal));
    for (let i = 0; i < prepareOrder.length; i++) {
      const nonce = prepareOrder[i];
      const currentOrder = `${currentPairId}-${address}-${nonce}`;
      const order = JSON.parse(localStorage.getItem(currentOrder));
      if (order) {
        const orderPrice = JSON.parse(
          JSON.stringify(order.orderPrice),
          (key, value) => (typeof value === 'string' ? BigInt(value) : value)
        );
        const prepare = this.getTxidAccount(nonce);
        this.preparedLoading = true;
        try {
          this.setPrepare(
            orderPrice,
            order.side,
            order.orderType,
            order.amount,
            prepare,
            this.currentPair,
            address,
            true
          );
          this.$set(
            this.preparing,
            i,
            Object.assign(this.preparing[i], { status: 'Prepared' })
          );
          if (prepareOrder.length - 1 === i) {
            this.showPrepareOrder = false;
            // loading.close();
            this.preparedLoading = false;
            const newNonce = nonce + 1;
            this.prepare[this.currentPair[0].toString()] =
              this.getTxidAccount(newNonce);
          }
        } catch (e) {
          this.showPrepareOrder = false;
          console.error(e);
          this.preparedLoading = false;
        }
      }
    }
  }
  private cancelPrepareOrder(): void {
    const currentPairId = this.currentPair[0].toString();
    const length = this.prepareOrder[currentPairId].length;
    for (let i = 0; i < length; i++) {
      if (this.prepareOrder[currentPairId]) {
        this.deletePrepare(
          currentPairId,
          BigInt(this.prepareOrder[currentPairId][i])
        );
        i--;
      }
    }
    this.showPrepareOrder = false;
  }
  private async setPrepare(
    orderPrice: OrderPrice,
    side: string,
    orderTypeMenu: OrderTypeMenu,
    amount: string,
    prepare: TxAccount,
    currentPair: DePairs,
    address: string,
    isMounted = false
  ): Promise<void> {
    console.log(orderPrice);
    const currentPairId = currentPair[0].toString();
    if (!this.prepareOrder[currentPairId]) {
      this.prepareOrder[currentPairId] = [];
    }
    if (!isMounted) {
      this.prepareOrder[currentPairId].push(Number(prepare[2]));
      localStorage.setItem(
        `prepareOrder-${address}`,
        JSON.stringify(this.prepareOrder)
      );
    }
    const orderInfo = {
      orderPrice: orderPrice,
      side: side,
      amount: amount,
      orderType: orderTypeMenu
    };
    if (!isMounted) {
      const currentOrder = `${currentPair[0].toString()}-${address}-${Number(
        prepare[2]
      )}`;
      localStorage.setItem(
        currentOrder,
        JSON.stringify(orderInfo, (key, value) =>
          typeof value === 'bigint' ? value.toString(10) : value
        )
      );
    }
    let orderType = {};
    orderType[orderTypeMenu] = null;
    this.setPending(orderPrice, orderType as OrderType, prepare, currentPair);
    if (!isMounted) {
      const nonce = Number(prepare[2]) + 1;
      this.prepare[this.currentPair[0].toString()] = this.getTxidAccount(nonce);
    }
    if (!this.orderQueue[currentPairId]) {
      this.orderQueue[currentPairId] = [];
    }
    if (side.toLocaleLowerCase() === 'sell') {
      if (!isMounted) {
        this.isToSell = false;
        this.sellAmount = '';
        this.sellPrice = '';
        this.sellAmount = '';
        this.sellTotal = '';
        this.mktSellPrice = '20';
        this.mktTotal = 'Market';
        this.stopSellPrice = '';
        if (this.isH5) {
          this.mktTotal = 'Market Total';
        }
        this.$message.success('Order is pending');
      }
      this.orderQueue[currentPairId].push({
        orderPrice: orderPrice,
        orderType: orderType as OrderType,
        amount: amount,
        prepare: prepare,
        currentPair: currentPair,
        currentTokenPrice: this.currentTokenPrice,
        type: 'sellOrder',
        prepareTrade: this.onPrepare(
          amount,
          prepare,
          currentPair,
          this.currentTokenPrice,
          address,
          'sell'
        )
      });
    } else if (side.toLocaleLowerCase() === 'buy') {
      if (!isMounted) {
        this.isToBuy = false;
        this.buyPrice = '';
        this.buyAmount = '';
        this.buyTotal = '';
        this.isToBuyMKT = false;
        this.buyTotalMKT = '';
        this.mktPrice = '20';
        this.mktQuantity = 'Market';
        this.stopBuyPrice = '';
        if (this.isH5) {
          this.mktQuantity = 'Market Quantity';
        }
        this.$message.success('Order is pending');
      }
      this.orderQueue[currentPairId].push({
        orderPrice: orderPrice,
        orderType: orderType as OrderType,
        amount: amount,
        prepare: prepare,
        currentPair: currentPair,
        currentTokenPrice: this.currentTokenPrice,
        type: 'buyOrder',
        prepareTrade: this.onPrepare(
          amount,
          prepare,
          currentPair,
          this.currentTokenPrice,
          address,
          'buy'
        )
      });
    }
    if (this.orderQueue[currentPairId].length === 1) {
      console.log(this.orderQueue[currentPairId][0].prepare[2]);
      if (this.orderQueue[currentPairId][0].type === 'buyOrder') {
        this.buyOrder(
          this.orderQueue[currentPairId][0].orderPrice,
          this.orderQueue[currentPairId][0].orderType,
          this.orderQueue[currentPairId][0].amount,
          this.orderQueue[currentPairId][0].prepare,
          this.orderQueue[currentPairId][0].currentPair,
          this.orderQueue[currentPairId][0].currentTokenPrice,
          this.orderQueue[currentPairId][0].prepareTrade,
          address
        );
      } else {
        this.sellOrder(
          this.orderQueue[currentPairId][0].orderPrice,
          this.orderQueue[currentPairId][0].orderType,
          this.orderQueue[currentPairId][0].amount,
          this.orderQueue[currentPairId][0].prepare,
          this.orderQueue[currentPairId][0].currentPair,
          this.orderQueue[currentPairId][0].currentTokenPrice,
          this.orderQueue[currentPairId][0].prepareTrade,
          address
        );
      }
    }
  }
  private setPending(
    orderPrice: OrderPrice,
    orderType: OrderType,
    prepare: TxAccount,
    currentPair: DePairs
  ): void {
    const time = BigInt(new Date().getTime() * 1000000);
    const tradingOrder: TradingOrder = {
      fee: null,
      gas: null,
      status: {
        Prepared: null
      },
      toids: [],
      data: [],
      time: time,
      txid: prepare[3],
      icrc1Account: [prepare[0]],
      orderType: orderType,
      filled: [],
      expiration: null,
      nonce: prepare[2],
      account: [],
      remaining: null,
      index: null,
      orderPrice: orderPrice,
      refund: null,
      orderStatus: null
    };
    const pending: PendingList = [prepare[3], tradingOrder];
    if (!this.preparedList[currentPair[0].toString()]) {
      this.preparedList[currentPair[0].toString()] = [];
    }
    this.preparedList[currentPair[0].toString()].push(pending);
    this.pendingList.unshift(pending);
    this.isTodo = true;
    console.log(this.pendingList);
  }
  private initPending(
    currentPair: DePairs,
    prepare: TxAccount,
    address: string,
    isNonceErr = true
  ): void {
    const currentPairId = currentPair[0].toString();
    const nonce = prepare[2];
    if (!this.prepareOrder[currentPairId]) {
      this.prepareOrder[currentPairId] = [];
    }
    if (isNonceErr) {
      this.orderLoading[currentPairId] = true;
      // cancel all
      this.orderQueue[currentPairId] = [];
      this.preparedList[currentPairId].forEach((preparedList) => {
        if (Number(preparedList[1].nonce) >= Number(nonce)) {
          preparedList[1].status = { Fail: null };
        }
      });
      this.prepareOrder[currentPairId].forEach((prepareOrder) => {
        const currentOrder = `${currentPair[0].toString()}-${address}-${Number(
          prepareOrder
        )}`;
        localStorage.removeItem(currentOrder);
      });
      this.prepareOrder[currentPairId] = [];
      localStorage.setItem(
        `prepareOrder-${address}`,
        JSON.stringify(this.prepareOrder)
      );
      this.getTxAccount(this.currentPair[0].toString())
        .then((prepare) => {
          if (prepare && prepare.pairId === this.currentPair[0].toString()) {
            this.prepare[this.currentPair[0].toString()] = prepare.txAccount;
            this.orderLoading[currentPairId] = false;
          }
        })
        .catch(() => {
          this.orderLoading[currentPairId] = false;
        });
    } else {
      this.preparedList[currentPairId].forEach((preparedList) => {
        if (Number(preparedList[1].nonce) === Number(nonce)) {
          preparedList[1].status = { Fail: null };
        }
      });
      if (!this.prepareOrder[currentPairId]) {
        this.prepareOrder[currentPairId] = [];
      }
      for (let i = 0; i < this.prepareOrder[currentPairId].length; i++) {
        if (Number(this.prepareOrder[currentPairId][i]) === Number(nonce)) {
          this.prepareOrder[currentPairId].splice(i, 1);
          const currentOrder = `${currentPair[0].toString()}-${address}-${Number(
            this.prepareOrder[currentPairId][i]
          )}`;
          localStorage.removeItem(currentOrder);
          i--;
        }
      }
    }
  }
  private async buyOrder(
    orderPrice: OrderPrice,
    orderType: OrderType,
    tokenAmount: string,
    prepare: TxAccount,
    currentPair: DePairs,
    currentTokenPrice: string,
    prepareTrade: Promise<boolean>,
    address: string
  ): Promise<void> {
    try {
      const canTrade = await prepareTrade;
      console.log(prepare[2] + ': ' + canTrade);
      if (!canTrade) {
        return;
      }
      const d = new Date().getTime();
      console.log(prepare[2] + ': ' + new Date());
      console.log(orderPrice);
      const principal = localStorage.getItem('principal');
      if (principal) {
        const currentAddress = principalToAccountIdentifier(
          Principal.fromText(principal)
        );
        if (currentAddress !== address) {
          return;
        }
      } else {
        return;
      }
      this.currentICDexService
        .trade(
          currentPair[0].toString(),
          [prepare[2]],
          orderPrice,
          orderType as OrderType
        )
        .then((res) => {
          console.log(res);
          this.initOrderSuccess(res, currentPair, prepare, address);
          console.log(
            prepare[2] + ' buySuccess: ' + (new Date().getTime() - d)
          );
        })
        .catch((e) => {
          console.log(e);
          this.initPending(currentPair, prepare, address);
          this.$message.error('Order fail');
        });
      setTimeout(() => {
        this.executionQueue(currentPair, address);
      }, 3000);
      this.deletePrepare(currentPair[0].toString(), prepare[2]);
      this.getIntervalPrice(6);
    } catch (e) {
      console.log(e);
      this.initPending(currentPair, prepare, address);
      this.$message.error('Order fail');
    }
  }
  private async onPrepare(
    tokenAmount: string,
    prepare: TxAccount,
    currentPair: DePairs,
    currentTokenPrice: string,
    address: string,
    type: string
  ): Promise<boolean> {
    try {
      const d = new Date().getTime();
      console.log(prepare[2] + ': ' + new Date());
      let tokenInfo = this.tokens[currentPair[1][0].token1[0].toString()];
      let tokenStd = Object.keys(currentPair[1][0].token1[2])[0];
      let tokenId = currentPair[1][0].token1[0].toString();
      if (type === 'sell') {
        tokenInfo = this.tokens[currentPair[1][0].token0[0].toString()];
        tokenStd = Object.keys(currentPair[1][0].token0[2])[0];
        tokenId = currentPair[1][0].token0[0].toString();
      }
      let total = BigInt(
        new BigNumber(tokenAmount).times(10 ** tokenInfo.decimals).toString(10)
      );
      // create fee
      if (type === 'buy' && this.orderType === 'Stop-loss' && this.stoConfig) {
        total = BigInt(
          new BigNumber(total.toString())
            .plus(this.stoConfig.sloFee1.toString(10))
            .toString(10)
        );
      }
      await this.getAccountSetting();
      let balance: string;
      let keepingBalance = '0';
      let needTransfer = total.toString(10);
      let needDeposit = '0';
      let stopLossBalance = '0';
      if (type === 'buy') {
        // stopLossBalance = this.stopLossNeed.token1.toString(10);
      }
      if (type === 'sell') {
        // stopLossBalance = this.stopLossNeed.token0.toString(10);
      }
      keepingBalance = new BigNumber(this.keepingBalance[tokenId])
        .minus(stopLossBalance)
        .toString(10);
      console.log(type, total, keepingBalance);
      if (this.tokens && !this.isKeeping) {
        if (this.isPoolMode && (tokenStd === 'icp' || tokenStd === 'icrc1')) {
          needTransfer = new BigNumber(needTransfer)
            .plus(getFee(this.tokens[tokenId]).toString(10))
            .toString(10);
        }
        needDeposit = needTransfer;
        balance = new BigNumber(this.tokensBalance[tokenId])
          .minus(needTransfer)
          .minus(getFee(this.tokens[tokenId]).toString(10))
          .toString(10);
      } else if (this.tokens && this.isKeeping) {
        if (!this.isPoolMode) {
          keepingBalance = new BigNumber(keepingBalance)
            .minus(getFee(this.tokens[tokenId]).toString(10))
            .toString(10);
        }
        if (new BigNumber(keepingBalance).gte(total.toString(10))) {
          const newKeepingBalance = new BigNumber(keepingBalance)
            .minus(total.toString(10))
            .toString(10);
          if (this.orderType !== 'Stop-loss') {
            this.$set(this.keepingBalance, tokenId, newKeepingBalance);
          }
          return true;
        }
        // need transfer token to txAccount/depositAccount
        if (tokenStd === 'icp' || tokenStd === 'icrc1') {
          total = BigInt(
            new BigNumber(total.toString(10))
              .plus(getFee(this.tokens[tokenId]).toString(10))
              .toString(10)
          );
        }
        needDeposit = new BigNumber(total.toString(10))
          .minus(keepingBalance)
          .toString(10);
        if (
          new BigNumber(needDeposit).lte(
            getFee(this.tokens[tokenId]).toString(10)
          )
        ) {
          needDeposit = new BigNumber(needDeposit)
            .plus(needDeposit)
            .toString(10);
        }
        needTransfer = needDeposit;
        balance = new BigNumber(this.tokensBalance[tokenId])
          .minus(needTransfer)
          .minus(getFee(this.tokens[tokenId]).toString(10))
          .toString(10);
        console.log(keepingBalance, total, balance);
        if (this.orderType !== 'Stop-loss') {
          this.$set(this.keepingBalance, tokenId, '0');
        }
      }
      if (tokenStd === 'icp' || tokenStd === 'icrc1') {
        this.$set(this.tokensBalance, tokenId, balance);
      } else {
        const needApprove = new BigNumber(needTransfer)
          .plus(getFee(this.tokens[tokenId]).toString(10))
          .toString(10);
        const allowance = this.needApprove(
          BigInt(needApprove),
          tokenId,
          currentPair,
          currentTokenPrice
        );
        if (new BigNumber(allowance.toString(10)).gt(0)) {
          balance = new BigNumber(balance)
            .minus(getFee(this.tokens[tokenId]).toString(10))
            .toString(10);
        }
        if (this.orderType !== 'Stop-loss') {
          this.$set(this.tokensBalance, tokenId, balance);
        }
      }
      if (
        tokenStd.toLocaleLowerCase() === 'icp' ||
        tokenStd.toLocaleLowerCase() === 'icrc1'
      ) {
        const isValue0 = type === 'sell';
        const res = await this.transferIcrc1(
          tokenId,
          needTransfer,
          prepare[0],
          prepare[2],
          prepare[3],
          needDeposit,
          address,
          currentPair,
          isValue0
        );
        if (res === 'Err') {
          this.initPending(currentPair, prepare, address);
          this.$message.error('Order fail');
          return false;
        }
        if (res === 'ErrAddress') {
          this.initPending(currentPair, prepare, address);
          return false;
        }
      } else {
        const needApprove = new BigNumber(needTransfer)
          .plus(getFee(this.tokens[tokenId]).toString(10))
          .toString(10);
        const allowance = this.needApprove(
          BigInt(needApprove),
          tokenId,
          currentPair,
          currentTokenPrice
        );
        if (new BigNumber(allowance.toString(10)).gt(0)) {
          const canBuy = await this.approve(
            allowance,
            tokenId,
            currentPair,
            address,
            tokenStd
          );
          console.log('canBuy:' + canBuy);
          if (!canBuy) {
            this.initPending(currentPair, prepare, address);
            this.$message.error('Order fail');
            return false;
          }
        }
        try {
          this.tokenAllowance[currentPair[0].toString()][tokenId] = BigInt(
            new BigNumber(
              this.tokenAllowance[currentPair[0].toString()][tokenId].toString(
                10
              )
            )
              .minus(needTransfer)
              .toString(10)
          );
        } catch (e) {
          console.log(e);
        }
        if (this.isKeeping) {
          if (new BigNumber(needDeposit).gt(0)) {
            let token;
            if (type === 'sell') {
              token = { token0: null };
            } else {
              token = { token1: null };
            }
            const depositRes = await this.deposit(
              address,
              currentPair,
              token,
              BigInt(needDeposit)
            );
            if (depositRes === 'ErrAddress') {
              return false;
            }
          }
        }
      }
      console.log(prepare[2] + type + ': ' + (new Date().getTime() - d));
      return true;
    } catch (e) {
      console.log(e);
      this.initPending(currentPair, prepare, address);
      this.$message.error('Order fail');
      return false;
    }
  }
  private async sellOrder(
    orderPrice: OrderPrice,
    orderType: OrderType,
    tokenAmount: string,
    prepare: TxAccount,
    currentPair: DePairs,
    currentTokenPrice: string,
    prepareTrade: Promise<boolean>,
    address: string
  ): Promise<void> {
    try {
      const canTrade = await prepareTrade;
      console.log(prepare[2] + ': ' + canTrade);
      if (!canTrade) {
        return;
      }
      const d = new Date().getTime();
      console.log(prepare[2] + ': ' + new Date());
      const principal = localStorage.getItem('principal');
      if (principal) {
        const currentAddress = principalToAccountIdentifier(
          Principal.fromText(principal)
        );
        if (currentAddress !== address) {
          return;
        }
      } else {
        return;
      }
      this.currentICDexService
        .trade(
          currentPair[0].toString(),
          [prepare[2]],
          orderPrice,
          orderType as OrderType
        )
        .then((res) => {
          this.initOrderSuccess(res, currentPair, prepare, address);
          console.log(
            prepare[2] + ' sellSuccess: ' + (new Date().getTime() - d)
          );
        })
        .catch((e) => {
          console.error(e);
          this.initPending(currentPair, prepare, address);
          this.$message.error('Order fail');
        });
      setTimeout(() => {
        this.executionQueue(currentPair, address);
      }, 3000);
      this.deletePrepare(currentPair[0].toString(), prepare[2]);
      this.getIntervalPrice(6);
    } catch (e) {
      console.log(e);
      this.initPending(currentPair, prepare, address);
      this.$message.error('Order fail');
    }
  }
  private initOrderSuccess(
    res: TradingResult,
    currentPair: DePairs,
    prepare: TxAccount,
    address: string
  ): void {
    if ((res as TradingResultOk).ok) {
      try {
        this.initSuccess(currentPair);
        const txid = (res as TradingResultOk).ok.txid;
        this.currentICDexService
          .statusByTxid(currentPair[0].toString(), txid)
          .then((res) => {
            console.log(res);
            if (res && res.pairId === this.currentPair[0].toString()) {
              const orderStatus = Object.keys(res.orderStatusResponse)[0];
              if (
                orderStatus === 'Pending' ||
                orderStatus === 'Failed' ||
                orderStatus === 'Completed'
              ) {
                if (
                  this.currentPair[0].toString() === currentPair[0].toString()
                ) {
                  for (let i = 0; i < this.pendingList.length; i++) {
                    const status = Object.keys(
                      this.pendingList[i][1].status
                    )[0];
                    console.log(i);
                    if (
                      toHexString(new Uint8Array(txid)) ===
                      toHexString(new Uint8Array(this.pendingList[i][0]))
                    ) {
                      if (status === 'Prepared') {
                        console.log(orderStatus);
                        if (
                          orderStatus === 'Pending' ||
                          orderStatus === 'Failed'
                        ) {
                          this.$set(
                            this.pendingList[i],
                            1,
                            Object.values(res.orderStatusResponse)[0]
                          );
                        }
                        if (orderStatus === 'Completed') {
                          const value: TxnRecord = Object.values(
                            res.orderStatusResponse
                          )[0];
                          this.pendingList[i][1].status = value.status;
                          this.pendingList[i][1].filled = value.details;
                          this.$set(this.pendingList, i, this.pendingList[i]);
                        }
                        this.pendingList[i][1].toids.forEach((toid) => {
                          this.toStatus[Number(toid)] = {
                            Done: null
                          };
                        });
                      }
                      break;
                    }
                  }
                } else {
                  if (
                    this.preparedList[currentPair[0].toString()] &&
                    this.preparedList[currentPair[0].toString()].length
                  ) {
                    for (
                      let i = 0;
                      i < this.preparedList[currentPair[0].toString()].length;
                      i++
                    ) {
                      const status = Object.keys(
                        this.preparedList[currentPair[0].toString()][i][1]
                          .status
                      )[0];
                      console.log(i);
                      if (
                        toHexString(new Uint8Array(txid)) ===
                        toHexString(
                          new Uint8Array(
                            this.preparedList[currentPair[0].toString()][i][0]
                          )
                        )
                      ) {
                        if (status === 'Prepared') {
                          console.log(orderStatus);
                          if (
                            orderStatus === 'Pending' ||
                            orderStatus === 'Failed'
                          ) {
                            this.preparedList[currentPair[0].toString()][i][1] =
                              Object.values(res.orderStatusResponse)[0];
                            this.$set(
                              this.preparedList[currentPair[0].toString()],
                              i,
                              this.preparedList[currentPair[0].toString()][i]
                            );
                          }
                          if (orderStatus === 'Completed') {
                            const value: TxnRecord = Object.values(
                              res.orderStatusResponse
                            )[0];
                            this.preparedList[currentPair[0].toString()][
                              i
                            ][1].status = value.status;
                            this.preparedList[currentPair[0].toString()][
                              i
                            ][1].filled = value.details;
                            this.$set(
                              this.preparedList[currentPair[0].toString()],
                              i,
                              this.preparedList[currentPair[0].toString()][i]
                            );
                          }
                          this.preparedList[currentPair[0].toString()][
                            i
                          ][1].toids.forEach((toid) => {
                            this.toStatus[Number(toid)] = {
                              Done: null
                            };
                          });
                        }
                        break;
                      }
                    }
                  }
                }
              }
            }
          });
      } catch (e) {
        console.log(e);
      }
    } else {
      console.dir(res);
      const errMessage = (res as TradingResultErr).err.message;
      if (errMessage.toLocaleLowerCase().includes('suspended')) {
        this.getPairInfo(currentPair);
      }
      if (
        errMessage.toLocaleLowerCase().includes('invalid amount') ||
        errMessage.toLocaleLowerCase().includes('unavailable price') ||
        errMessage.toLocaleLowerCase().includes('order duplicate') ||
        errMessage
          .toLocaleLowerCase()
          .includes('the maximum number of pending') ||
        errMessage
          .toLocaleLowerCase()
          .includes('the maximum total number of pending') ||
        errMessage.toLocaleLowerCase().includes('nonce error') ||
        errMessage.toLocaleLowerCase().includes('ic network is busy') ||
        errMessage
          .toLocaleLowerCase()
          .includes('you do not have permission to place orders in this way') ||
        errMessage
          .toLocaleLowerCase()
          .includes('only one order can be made within 3 seconds')
      ) {
        this.initPending(currentPair, prepare, address);
      } else {
        this.initPending(currentPair, prepare, address, false);
      }
      if (
        errMessage.toLocaleLowerCase().includes('ic network is busy') ||
        errMessage
          .toLocaleLowerCase()
          .includes('only one order can be made within 3 seconds')
      ) {
        this.$info({
          content: errMessage,
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          onOk() {
            //
          }
        });
      } else if (errMessage.toLocaleLowerCase().includes('nonce error')) {
        this.$info({
          content: 'Nonce error, please re-order.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          onOk() {
            //
          }
        });
      } else {
        this.$message.error((res as TradingResultErr).err.message);
      }
    }
  }
  private executionQueue(currentPair: DePairs, address: string): void {
    const currentPairId = currentPair[0].toString();
    try {
      this.orderQueue[currentPairId].shift();
    } catch (e) {
      console.log(e);
    }
    if (this.orderQueue[currentPairId].length) {
      console.log(this.orderQueue[currentPairId][0].prepare[2]);
      if (this.orderQueue[currentPairId][0].type === 'buyOrder') {
        this.buyOrder(
          this.orderQueue[currentPairId][0].orderPrice,
          this.orderQueue[currentPairId][0].orderType,
          this.orderQueue[currentPairId][0].amount,
          this.orderQueue[currentPairId][0].prepare,
          this.orderQueue[currentPairId][0].currentPair,
          this.orderQueue[currentPairId][0].currentTokenPrice,
          this.orderQueue[currentPairId][0].prepareTrade,
          address
        );
      } else {
        this.sellOrder(
          this.orderQueue[currentPairId][0].orderPrice,
          this.orderQueue[currentPairId][0].orderType,
          this.orderQueue[currentPairId][0].amount,
          this.orderQueue[currentPairId][0].prepare,
          this.orderQueue[currentPairId][0].currentPair,
          this.orderQueue[currentPairId][0].currentTokenPrice,
          this.orderQueue[currentPairId][0].prepareTrade,
          address
        );
      }
    }
  }
  private async onSell(): Promise<void> {
    if (this.pairInfo && this.pairInfo.paused) {
      this.$message.warning('Trading pair has been paused.');
      return;
    }
    this.isToSell = true;
    if (
      this.sellPrice &&
      this.sellAmount &&
      this.sellTotal &&
      !this.sellAmountError
    ) {
      if (this.sellAmountErrorUNIT) {
        this.$message.warning(
          `Quantity must be an integral multiple of ${this.unitSize}`
        );
        return;
      }
      if (this.pairTotalPending > 30000) {
        if (
          new BigNumber(this.currentTokenPrice)
            .times(1.05)
            .lt(this.sellPrice) ||
          new BigNumber(this.currentTokenPrice).times(0.95).gt(this.sellPrice)
        ) {
          this.$info({
            content:
              'The trading matching engine (TME) is under computational pressure, busy trading mode (BTM) is on, and the system is only accepting orders within +/- 5% of the latest price.',
            class: 'connect-plug',
            icon: 'connect-plug',
            okText: 'Confirm'
          });
          return;
        }
      }
      this.sellTotal = new BigNumber(this.sellPrice)
        .times(this.sellAmount)
        .toString(10);
      const min = new BigNumber(
        getFee(
          this.tokens[this.currentPair[1][0].token1[0].toString()]
        ).toString(10)
      )
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token1[0].toString()].decimals
        )
        .times(2);
      if (new BigNumber(this.sellTotal).lt(min)) {
        this.$message.error(`Total cannot be less than ${min}`);
        return;
      }
      const token0Id = this.currentPair[1][0].token0[0].toString();
      const token1Id = this.currentPair[1][0].token1[0].toString();
      const amount = BigInt(
        new BigNumber(this.sellAmount)
          .times(10 ** this.tokens[token0Id].decimals)
          .toString(10)
      );
      const tokenDecimals = this.tokens[token0Id].decimals;
      const price = BigInt(
        new BigNumber(this.sellPrice)
          .times(10 ** this.tokens[token1Id].decimals)
          .times(new BigNumber(this.unit.toString(10)).div(10 ** tokenDecimals))
          .toString(10)
      );
      const orderPrice: OrderPrice = {
        quantity: { Sell: amount },
        price: price
      };
      const currentPairId = this.currentPair[0].toString();
      if (this.isPlug() || isInfinity()) {
        this.plugLoading[currentPairId] = true;
        setTimeout(() => {
          this.plugLoading[currentPairId] = false;
        }, 3000);
      }
      const principal = localStorage.getItem('principal');
      const address = principalToAccountIdentifier(Principal.from(principal));
      if (this.orderType === 'Stop-loss') {
        const order = {
          side: { Sell: null },
          quantity: amount,
          price: price
        };
        const triggerPrice = new BigNumber(this.stopSellPrice)
          .times(10 ** this.tokens[token1Id].decimals)
          .times(new BigNumber(this.unit.toString(10)).div(10 ** tokenDecimals))
          .toString(10);
        this.onStopLoss(
          order,
          BigInt(triggerPrice),
          this.sellAmount,
          this.prepare[currentPairId],
          this.currentPair,
          address,
          'sell'
        );
      } else {
        this.setPrepare(
          orderPrice,
          'Sell',
          this.orderType as OrderTypeEnum,
          this.sellAmount,
          this.prepare[currentPairId],
          this.currentPair,
          address
        );
      }
    }
  }
  private initSuccess(currentPair: DePairs, isInit = false): void {
    this.getLevel100(currentPair[0].toString());
    this.getPending(currentPair[0].toString());
    this.getAllowance(currentPair);
    const principal = localStorage.getItem('principal');
    this.getTradeList(currentPair[0].toString(), principal);
    this.latestFilled(currentPair[0].toString());
    const token0Info = currentPair[1][0].token0;
    const token1Info = currentPair[1][0].token1;
    this.getTokenBalance(token0Info);
    this.getTokenBalance(token1Info);
    this.getLiquidity(
      currentPair[0].toString(),
      this.currentPairIndex,
      this.currentTradeMarketSort
    );
    this.getUserLiquidity(currentPair[0].toString());
    this.getQuotes(currentPair[0].toString(), isInit);
    this.initAccount();
  }
  private async getStoConfig(): Promise<void> {
    const currentPair = this.currentPair[0].toString();
    const res = await this.currentICDexService.sto_getConfig(currentPair);
    if (res && res.pairId === this.currentPair[0].toString()) {
      this.stoConfig = res.stoSetting;
    }
  }
  private async initAccount(): Promise<void> {
    if (this.getPrincipalId) {
      await this.getAccountSetting();
      console.log(this.isKeeping);
      this.getDepositBalance();
    }
  }
  private proWalletSwapSuccess(): void {
    const token0Info = this.currentPair[1][0].token0;
    const token1Info = this.currentPair[1][0].token1;
    this.getTokenBalance(token0Info);
    this.getTokenBalance(token1Info);
    this.getTokenBalanceSto(token0Info);
    this.getTokenBalanceSto(token1Info);
  }
  private gridDepositKeepingBalance(isToken0: boolean): void {
    if (isToken0) {
      this.onDepositKeepingBalance(
        this.currentPair[1][0].token0,
        isToken0,
        true
      );
    } else {
      this.onDepositKeepingBalance(
        this.currentPair[1][0].token1,
        isToken0,
        true
      );
    }
  }
  private gridTransferToken(isToken0: boolean): void {
    if (isToken0) {
      this.swapWallet(this.currentPair[1][0].token0[0].toString(), false);
    } else {
      this.swapWallet(this.currentPair[1][0].token1[0].toString(), false);
    }
  }
  private proOrderDepositKeepingBalance(
    token: SwapTokenInfo,
    isToken0: boolean
  ): void {
    this.onDepositKeepingBalance(token, isToken0, true);
  }
  private createProOrderSuccess(): void {
    this.getRole(this.currentPair);
    this.getProOrders(this.currentPair[0].toString(), this.getPrincipalId);
    this.getDepositBalance();
  }
  private transferSuccess(amount: string, loading, subAccountId: number): void {
    const icp = new BigNumber(amount).times(10 ** 8).toString(10);
    this.depositSuccess(icp, loading, false, subAccountId);
  }
  private async transferTokenSuccess(
    amount: string,
    loading,
    subAccountId: number
  ): Promise<void> {
    // Need Approve
    let tokenInfo: SwapTokenInfo;
    if (this.isToken0) {
      tokenInfo = this.currentPair[1][0].token0;
    } else {
      tokenInfo = this.currentPair[1][0].token1;
    }
    let allowance = BigInt(0);
    if (subAccountId === 0) {
      allowance =
        this.tokenAllowance[this.currentPair[0].toString()][
          tokenInfo[0].toString()
        ];
    }
    const std = Object.keys(tokenInfo[2])[0];
    const needApprove = new BigNumber(amount)
      .plus(getFee(this.tokens[tokenInfo[0].toString()]).toString(10))
      .toString(10);
    if (
      std.toLocaleLowerCase() === 'drc20' &&
      new BigNumber(allowance.toString(10)).lt(needApprove)
    ) {
      const address = principalToAccountIdentifier(
        Principal.from(this.getPrincipalId)
      );
      await this.approve(
        BigInt(needApprove),
        tokenInfo[0].toString(),
        this.currentPair,
        address,
        Object.keys(tokenInfo[2])[0],
        subAccountId
      );
      if (subAccountId === 0) {
        this.tokenAllowance[this.currentPair[0].toString()][
          tokenInfo[0].toString()
        ] = BigInt(0);
      }
    }
    this.depositSuccess(amount, loading, true, subAccountId);
  }
  private async depositSuccess(
    amount: string,
    loading,
    isToken = true,
    subAccountId: number
  ): Promise<void> {
    let token;
    if (this.isToken0) {
      token = { token0: null };
    } else {
      token = { token1: null };
    }
    const address = principalToAccountIdentifier(
      Principal.from(this.getPrincipalId)
    );
    await this.deposit(
      address,
      this.currentPair,
      token,
      BigInt(amount),
      subAccountId
    );
    if (this.isToken0) {
      const token0Info = this.currentPair[1][0].token0;
      if (subAccountId === 0) {
        this.getTokenBalance(token0Info);
      } else {
        this.getTokenBalanceSto(token0Info);
      }
    } else {
      const token1Info = this.currentPair[1][0].token1;
      if (subAccountId === 0) {
        this.getTokenBalance(token1Info);
      } else {
        this.getTokenBalanceSto(token1Info);
      }
    }
    this.getDepositBalance();
    if (isToken) {
      (this.$refs as any).transferToken.visibleTransfer = false;
    } else {
      (this.$refs as any).transferIcp.visibleTransfer = false;
    }
    loading.close();
    this.$message.success('Deposit Success');
  }
  private onDepositKeepingBalance(
    token: SwapTokenInfo,
    isToken0 = true,
    isPro = false
  ): void {
    this.isToken0 = isToken0;
    this.currentToken = null;
    let subaccount = new Uint8Array(fromSubAccountId(0));
    if (isPro) {
      subaccount = new Uint8Array(fromSubAccountId(1));
    }
    const currentAddress = principalToAccountIdentifier(
      Principal.fromText(this.getPrincipalId),
      subaccount
    );
    const std = Object.keys(token[2])[0];
    console.log(isPro);
    if (std.toLocaleLowerCase() === 'icp') {
      if (isPro) {
        this.balance = new BigNumber(this.tokensBalanceSto[token[0].toString()])
          .div(10 ** 8)
          .toString(10);
        (this.$refs as any).transferIcp.subaccountId = 1;
      } else {
        this.balance = new BigNumber(this.tokensBalance[token[0].toString()])
          .div(10 ** 8)
          .toString(10);
        (this.$refs as any).transferIcp.subaccountId = 0;
      }
      (this.$refs as any).transferIcp.transferButton = 'Deposit';
      (this.$refs as any).transferIcp.transferForm.to =
        this.currentPair[0] + '.' + currentAddress;
      (this.$refs as any).transferIcp.visibleTransfer = true;
    } else {
      const currentToken = new AddTokenItemClass();
      let standard;
      if (std.toLocaleLowerCase() === 'drc20') {
        standard = 'DRC20';
      } else if (std.toLocaleLowerCase() === 'icrc1') {
        standard = 'ICRC-1';
      } else if (std.toLocaleLowerCase() === 'icrc2') {
        standard = 'ICRC-2';
      } else {
        return;
      }
      const decimals = this.tokens[token[0].toString()].decimals;
      let balance;
      if (isPro) {
        balance = new BigNumber(this.tokensBalanceSto[token[0].toString()])
          .div(10 ** decimals)
          .toString(10);
      } else {
        balance = new BigNumber(this.tokensBalance[token[0].toString()])
          .div(10 ** decimals)
          .toString(10);
      }
      this.currentToken = Object.assign(currentToken, {
        balance: balance,
        canisterId: token[0].toString(),
        decimals: decimals,
        name: this.tokens[token[0].toString()].name,
        symbol: this.tokens[token[0].toString()].symbol,
        standard: standard
      });
      (this.$refs as any).transferToken.transferForm.to =
        this.currentPair[0] + '.' + currentAddress;
      if (isPro) {
        (this.$refs as any).transferToken.init(this.currentToken, 1);
      } else {
        (this.$refs as any).transferToken.init(this.currentToken);
      }
    }
  }
  private async onKeepingBalance(
    pair: DePairs,
    isToken0 = true,
    isPro = false
  ): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    let res;
    console.log(isPro);
    if (isPro) {
      // pro subaccount
      res = await this.currentICDexService.withdraw(
        pair[0].toString(),
        isToken0 ? [] : [BigInt(0)],
        isToken0 ? [BigInt(0)] : [],
        1
      );
    } else {
      res = await this.currentICDexService.withdraw(
        pair[0].toString(),
        isToken0
          ? [
              BigInt(
                this.keepingBalance[this.currentPair[1][0].token0[0].toString()]
              )
            ]
          : [BigInt(0)],
        isToken0
          ? [BigInt(0)]
          : [
              BigInt(
                this.keepingBalance[this.currentPair[1][0].token1[0].toString()]
              )
            ]
      );
    }
    console.log(res);
    if (res && res.length) {
      this.$message.success('Success');
    } else {
      this.$message.success('Error');
    }
    this.getDepositBalance();
    loading.close();
  }
  private async getKeepingBalanceSto(pair: DePairs): Promise<KeepingBalance> {
    // sto subaccount = 1
    const res = await this.currentICDexService.accountBalance(
      pair[0].toString(),
      1
    );
    if (res && res.pairId === this.currentPair[0].toString()) {
      return res.keepingBalance;
    }
    return null;
  }
  private async getKeepingBalance(pair: DePairs): Promise<KeepingBalance> {
    const res = await this.currentICDexService.accountBalance(
      pair[0].toString()
    );
    if (res && res.pairId === this.currentPair[0].toString()) {
      return res.keepingBalance;
    }
    return null;
  }
  private showPoolVisible(): void {
    this.isPoolModeSetting = this.isPoolMode;
    this.isKeepingSetting = this.isKeeping;
    this.poolVisible = true;
  }
  private onChange(type: boolean, key: string): void {
    this[key] = !type;
  }
  private async getRole(currentPair: DePairs): Promise<void> {
    this.dexRole = null;
    if (this.getPrincipalId) {
      const res = await this.currentICDexService.getRole(
        currentPair[0].toString(),
        this.getPrincipalId
      );
      if (res && res.pairId === this.currentPair[0].toString()) {
        this.dexRole = res.dexRole;
      }
    }
  }
  private async setMode(): Promise<void> {
    console.log(this.dexRole);
    if (this.dexRole) {
      if (this.dexRole.broker && !this.isKeepingSetting) {
        this.$message.warning(
          'Broker must choose Keeping balance in TraderAccount'
        );
        return;
      }
      if (this.dexRole.proTrader || this.dexRole.vipMaker) {
        if (!this.isKeepingSetting || !this.isPoolModeSetting) {
          let message = 'Pro Trader';
          if (this.dexRole.vipMaker) {
            message = 'Vip Maker';
          }
          this.$message.warning(
            `${message} must choose PoolMode and keeping Balance In TraderAccount`
          );
          return;
        }
      }
    }
    let mode;
    let keep;
    if (this.isPoolModeSetting) {
      mode = { PoolMode: null };
    } else {
      mode = { TunnelMode: null };
    }
    keep = this.isKeepingSetting;
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    console.log(mode, keep);
    await this.currentICDexService.accountConfig(
      this.currentPair[0].toString(),
      mode,
      keep
    );
    await this.getAccountSetting();
    this.getDepositBalance();
    loading.close();
    this.poolVisible = false;
  }
  private async getDepositBalance(): Promise<void> {
    const token0Id = this.currentPair[1][0].token0[0].toString();
    const token1Id = this.currentPair[1][0].token1[0].toString();
    const currentPair = this.currentPair[0].toString();
    // Pro account balance
    this.getKeepingBalanceSto(this.currentPair).then((res) => {
      const currentPair1 = this.currentPair[0].toString();
      if (
        !this.isTodo &&
        this.time !== 6 &&
        !this.orderLoading[this.currentPair[0].toString()]
      ) {
        if (currentPair === currentPair1) {
          if (res && res.token0) {
            this.$set(
              this.keepingBalanceSto,
              token0Id,
              res.token0.available.toString(10)
            );
          }
          if (res && res.token1) {
            this.$set(
              this.keepingBalanceSto,
              token1Id,
              res.token1.available.toString(10)
            );
          }
        }
      }
    });
    const res = await this.getKeepingBalance(this.currentPair);
    const currentPair1 = this.currentPair[0].toString();
    if (
      !this.isTodo &&
      this.time !== 6 &&
      !this.orderLoading[this.currentPair[0].toString()]
    ) {
      if (currentPair === currentPair1) {
        if (res && res.token0 && res.token1) {
          this.setKeepingBalance(
            res.token0.available.toString(10),
            res.token1.available.toString(10)
          );
        }
        this.showKeepBalance =
          this.isKeeping ||
          Number(this.keepingBalance[token0Id]) > 0 ||
          Number(this.keepingBalance[token1Id]) > 0;
      }
    }
  }
  private setKeepingBalance(
    token0KeepingBalance: string,
    token1KeepingBalance: string
  ): void {
    const token0Id = this.currentPair[1][0].token0[0].toString();
    const token1Id = this.currentPair[1][0].token1[0].toString();
    const available0 = new BigNumber(token0KeepingBalance).minus(
      this.stopLossNeed.token0.toString(10)
    );
    this.$set(
      this.keepingBalance,
      token0Id,
      available0.lt(0) ? '0' : available0.toString(10)
    );
    const available1 = new BigNumber(token1KeepingBalance).minus(
      this.stopLossNeed.token1.toString(10)
    );
    this.$set(
      this.keepingBalance,
      token1Id,
      available1.lt(0) ? '0' : available1.toString(10)
    );
  }
  private async getAccountSetting(): Promise<void> {
    const currentPair = this.currentPair[0].toString();
    const res = await this.currentICDexService.accountSetting(
      currentPair,
      this.getPrincipalId
    );
    console.log(res);
    if (res && res.pairId === this.currentPair[0].toString()) {
      this.isKeeping = res.accountSetting.enKeepingBalance;
      this.isPoolMode = res.accountSetting.enPoolMode;
    }
  }
  private async deposit(
    address: string,
    currentPair: DePairs,
    token: { token0: null } | { token1: null },
    amount: bigint,
    subAccount = 0
  ): Promise<void | string> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentAddress = principalToAccountIdentifier(
        Principal.fromText(principal)
      );
      if (currentAddress !== address) {
        return 'ErrAddress';
      }
    } else {
      return 'ErrAddress';
    }
    console.time('deposit');
    console.log(token);
    console.log('amount: ' + amount);
    const dexId = currentPair[0].toString();
    await this.currentICDexService.deposit(dexId, token, amount, subAccount);
    console.timeEnd('deposit');
  }
  private async onBuyMKT(): Promise<void> {
    if (this.pairInfo && this.pairInfo.paused) {
      this.$message.warning('Trading pair has been paused.');
      return;
    }
    this.isToBuyMKT = true;
    if (this.buyTotalMKT && !this.buyTotalMKTError) {
      const min = new BigNumber(
        getFee(
          this.tokens[this.currentPair[1][0].token1[0].toString()]
        ).toString(10)
      )
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token1[0].toString()].decimals
        )
        .times(2);
      if (new BigNumber(this.buyTotalMKT).lt(min)) {
        this.$message.error(`Total cannot be less than ${min}`);
        return;
      }
      const token1Info =
        this.tokens[this.currentPair[1][0].token1[0].toString()];
      const token1Amount = BigInt(
        new BigNumber(this.buyTotalMKT)
          .times(10 ** token1Info.decimals)
          .toString(10)
      );
      let price = BigInt(0);
      console.log(this.currentPair);
      if (this.mktPrice) {
        const token0decimals =
          this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
        price = BigInt(
          new BigNumber(this.mktPrice)
            .div(100)
            .plus(1)
            .times(this.currentTokenPrice)
            .times(10 ** token1Info.decimals)
            .times(
              new BigNumber(this.unit.toString(10)).div(10 ** token0decimals)
            )
            .decimalPlaces(0)
            .toString(10)
        );
      }
      const orderPrice: OrderPrice = {
        quantity: { Buy: [BigInt(0), token1Amount] },
        price: price
      };
      const currentPairId = this.currentPair[0].toString();
      if (this.isPlug() || isInfinity()) {
        this.plugLoading[currentPairId] = true;
        setTimeout(() => {
          this.plugLoading[currentPairId] = false;
        }, 3000);
      }
      const principal = localStorage.getItem('principal');
      const address = principalToAccountIdentifier(Principal.from(principal));
      this.setPrepare(
        orderPrice,
        'Buy',
        this.orderType as OrderTypeEnum,
        this.buyTotalMKT,
        this.prepare[currentPairId],
        this.currentPair,
        address
      );
    }
  }
  private async onBuy(): Promise<void> {
    if (this.pairInfo && this.pairInfo.paused) {
      this.$message.warning('Trading pair has been paused.');
      return;
    }
    this.isToBuy = true;
    if (
      this.buyPrice &&
      this.buyAmount &&
      this.buyTotal &&
      !this.buyAmountError
    ) {
      if (this.orderType === 'Stop-loss' && !this.stopBuyPrice) {
        return;
      }
      if (this.buyAmountErrorUNIT) {
        this.$message.warning(
          `Quantity must be an integral multiple of ${this.unitSize}`
        );
        return;
      }
      if (this.pairTotalPending > 30000) {
        if (
          new BigNumber(this.currentTokenPrice).times(1.05).lt(this.buyPrice) ||
          new BigNumber(this.currentTokenPrice).times(0.95).gt(this.buyPrice)
        ) {
          this.$info({
            content:
              'The trading matching engine (TME) is under computational pressure, busy trading mode (BTM) is on, and the system is only accepting orders within +/- 5% of the latest price.',
            class: 'connect-plug',
            icon: 'connect-plug',
            okText: 'Confirm'
          });
          return;
        }
      }
      this.buyTotal = new BigNumber(this.buyPrice)
        .times(this.buyAmount)
        .toString(10);
      const min = new BigNumber(
        getFee(
          this.tokens[this.currentPair[1][0].token1[0].toString()]
        ).toString(10)
      )
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token1[0].toString()].decimals
        )
        .times(2);
      if (new BigNumber(this.buyTotal).lt(min)) {
        this.$message.error(`Total cannot be less than ${min}`);
        return;
      }
      const token0Info =
        this.tokens[this.currentPair[1][0].token0[0].toString()];
      const token1Info =
        this.tokens[this.currentPair[1][0].token1[0].toString()];
      const tokenDecimals = token0Info.decimals;
      const price = BigInt(
        new BigNumber(this.buyPrice)
          .times(10 ** token1Info.decimals)
          .times(new BigNumber(this.unit.toString(10)).div(10 ** tokenDecimals))
          .toString(10)
      );
      const amount = BigInt(
        new BigNumber(this.buyAmount).times(10 ** tokenDecimals).toString(10)
      );
      const token1Amount = BigInt(
        new BigNumber(price.toString(10))
          .div(this.unit.toString(10))
          .times(this.buyAmount)
          .times(10 ** tokenDecimals)
          .toString(10)
      );
      const orderPrice: OrderPrice = {
        quantity: { Buy: [amount, token1Amount] },
        price: price
      };
      console.log(orderPrice);
      const currentPairId = this.currentPair[0].toString();
      if (this.isPlug() || isInfinity()) {
        this.plugLoading[currentPairId] = true;
        setTimeout(() => {
          this.plugLoading[currentPairId] = false;
        }, 3000);
      }
      const principal = localStorage.getItem('principal');
      const address = principalToAccountIdentifier(Principal.from(principal));
      if (this.orderType === 'Stop-loss') {
        const order = {
          side: { Buy: null },
          quantity: amount,
          price: price
        };
        const triggerPrice = new BigNumber(this.stopBuyPrice)
          .times(10 ** token1Info.decimals)
          .times(new BigNumber(this.unit.toString(10)).div(10 ** tokenDecimals))
          .toString(10);
        this.onStopLoss(
          order,
          BigInt(triggerPrice),
          this.buyTotal,
          this.prepare[currentPairId],
          this.currentPair,
          address,
          'buy'
        );
      } else {
        this.setPrepare(
          orderPrice,
          'Buy',
          this.orderType as OrderTypeEnum,
          this.buyTotal,
          this.prepare[currentPairId],
          this.currentPair,
          address
        );
      }
    }
  }
  private async onStopLoss(
    order: TriggeredOrderInfo,
    triggerPrice: bigint,
    totalAmount: string,
    prepare: TxAccount,
    currentPair: DePairs,
    address: string,
    type: string
  ): Promise<void> {
    if (
      type === 'buy' &&
      new BigNumber(this.stopBuyPrice).lte(this.currentTokenPrice)
    ) {
      this.$message.error(
        'The stop price of a stop-loss order with a Buy side should be greater than the current price.'
      );
      return;
    }
    if (
      type === 'sell' &&
      new BigNumber(this.stopSellPrice).gte(this.currentTokenPrice)
    ) {
      this.$message.error(
        'The stop price of a stop-loss order with a Sell side should be lower than the current price.'
      );
      return;
    }
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    // create fee
    if (type === 'sell' && this.stoConfig) {
      const token1Id = this.currentPair[1][0].token1[0].toString();
      const sloFee = new BigNumber(
        this.stoConfig.sloFee1.toString(10)
      ).toString(10);
      // if (
      //   new BigNumber(this.tokensBalance[token1Id]).lt(
      //     this.stoConfig.sloFee1.toString(10)
      //   )
      // ) {
      //   loading.close();
      //   this.$message.error(
      //     `You should deposit ${sloFee} ${this.tokens[token1Id].symbol} first.`
      //   );
      //   return;
      // }
      const fee = new BigNumber(this.stoConfig.sloFee1.toString(10));
      // .plus(this.stopLossNeed.token1.toString(10));
      console.log(fee.toString(10));
      const balance = new BigNumber(this.tokensBalance[token1Id])
        .minus(getFee(this.tokens[token1Id]).toString(10))
        .plus(this.keepingBalance[token1Id]);
      console.log(balance.toString(10));
      if (balance.lt(fee)) {
        this.$message.error(
          `Insufficient ${this.tokens[token1Id].symbol}: Create a stop-loss order need ${sloFee} ${this.tokens[token1Id].symbol}.`
        );
        loading.close();
        return;
      }
      const canPrepare = await this.onPrepare(
        '0',
        prepare,
        currentPair,
        this.currentTokenPrice,
        address,
        'buy'
      );
      console.log(canPrepare);
      if (!canPrepare) {
        loading.close();
        return;
      }
    }
    // await this.getAccountSetting();
    const canStop = await this.onPrepare(
      totalAmount,
      prepare,
      currentPair,
      this.currentTokenPrice,
      address,
      type
    );
    console.log(canStop);
    if (!canStop) {
      loading.close();
      return;
    }
    try {
      const res = await this.currentICDexService.sto_createStopLossOrder(
        currentPair[0].toString(),
        {
          order: order,
          triggerPrice: triggerPrice
        }
      );
      console.log(res);
      if (type === 'buy') {
        this.isToBuy = false;
        this.buyPrice = '';
        this.buyAmount = '';
        this.buyTotal = '';
        this.stopBuyPrice = '';
      }
      if (type === 'sell') {
        this.isToSell = false;
        this.sellPrice = '';
        this.sellAmount = '';
        this.sellTotal = '';
        this.stopSellPrice = '';
      }
      this.$message.success('Success');
      await this.getStopOrders(
        this.currentPair[0].toString(),
        this.getPrincipalId
      );
      this.getDepositBalance();
    } catch (e) {
      console.log(e);
      if (toHttpRejectError(e)) {
        this.$message.error(toHttpRejectError(e));
      } else {
        this.$message.error('Error');
      }
    }
    loading.close();
  }
  private async transferIcrc1(
    tokenId: string,
    needTransfer: string,
    to: Icrc1Account,
    nonce: bigint,
    txid: Array<number>,
    needDeposit: string,
    address: string,
    currentPair: DePairs,
    isValue0 = true
  ): Promise<void | string> {
    const principal = localStorage.getItem('principal');
    let currentAddress;
    if (principal) {
      currentAddress = principalToAccountIdentifier(
        Principal.fromText(principal)
      );
      if (currentAddress !== address) {
        return 'ErrAddress';
      }
    } else {
      return 'ErrAddress';
    }
    const currentDrc20Token = new DRC20TokenService();
    await this.getAccountSetting();
    const depositAccount = {
      owner: currentPair[0],
      subaccount: [hexToBytes(currentAddress)]
    };
    if (this.isKeeping) {
      const res = await currentDrc20Token.icrc1Transfer(
        tokenId,
        BigInt(needTransfer),
        depositAccount,
        [txid]
      );
      if (res) {
        if (Object.keys(res)[0] === 'Err') {
          return 'err';
        }
      }
      console.log(needTransfer, needDeposit);
      let token;
      if (isValue0) {
        token = { token0: null };
      } else {
        token = { token1: null };
      }
      const depositRes = await this.deposit(
        address,
        currentPair,
        token,
        BigInt(needDeposit)
      );
      if (depositRes === 'ErrAddress') {
        return 'ErrAddress';
      }
    } else {
      const res = await currentDrc20Token.icrc1Transfer(
        tokenId,
        BigInt(needTransfer),
        to,
        [txid]
      );
      if (res) {
        if (Object.keys(res)[0] === 'Err') {
          return 'err';
        }
      }
    }
  }
  private async transferIcp(
    needTransfer: string,
    to: string,
    nonce: bigint,
    isValue0 = true,
    decimals: number,
    needDeposit: string,
    address: string,
    currentPair: DePairs
  ): Promise<void | string> {
    needTransfer = new BigNumber(needTransfer).div(10 ** decimals).toString(10);
    const principal = localStorage.getItem('principal');
    let currentAddress;
    if (principal) {
      currentAddress = principalToAccountIdentifier(
        Principal.fromText(principal)
      );
      if (currentAddress !== address) {
        return 'ErrAddress';
      }
    } else {
      return 'ErrAddress';
    }
    await this.getAccountSetting();
    const depositAccount = {
      owner: currentPair[0],
      subaccount: hexToBytes(currentAddress)
    };
    if (this.isKeeping) {
      await this.ledgerService.sendIcp(
        needTransfer,
        principalToAccountIdentifier(
          depositAccount.owner,
          new Uint8Array(depositAccount.subaccount)
        ),
        buildMemo(nonce)
      );
      let token;
      if (isValue0) {
        token = { token0: null };
      } else {
        token = { token1: null };
      }
      const depositRes = await this.deposit(
        address,
        currentPair,
        token,
        BigInt(needDeposit)
      );
      if (depositRes === 'ErrAddress') {
        return 'ErrAddress';
      }
    } else {
      try {
        await this.ledgerService.sendIcp(needTransfer, to, buildMemo(nonce));
      } catch (e) {
        return 'err';
      }
    }
  }
  private async getTxAccount(currentPair: string): Promise<{
    txAccount: TxAccount;
    pairId: string;
  }> {
    if (this.getPrincipalId) {
      return await this.currentICDexService.getTxAccount(
        currentPair,
        this.getPrincipalId
      );
    }
  }
  private buyPriceChange(): void {
    this.isToBuy = false;
    if (this.buyAmount && this.buyPrice) {
      this.buyTotal = new BigNumber(this.buyPrice)
        .times(this.buyAmount)
        .toString(10);
    } else if (this.buyPrice && Number(this.buyPrice) !== 0 && this.buyTotal) {
      this.buyAmount = new BigNumber(this.buyTotal)
        .div(this.buyPrice)
        .decimalPlaces(this.tokenMinUnit, 1)
        .toString(10);
    }
  }
  private buyAmountChange(): void {
    if (this.buyAmount && this.buyPrice) {
      this.buyTotal = new BigNumber(this.buyPrice)
        .times(this.buyAmount)
        .toString(10);
    } else if (
      this.buyAmount &&
      Number(this.buyAmount) !== 0 &&
      this.buyTotal
    ) {
      this.buyPrice = new BigNumber(this.buyTotal)
        .div(this.buyAmount)
        .decimalPlaces(this.buyUnit, 1)
        .toString(10);
    }
  }
  private getMktQuantity(): void {
    if (this.buyTotalMKT && this.level100) {
      const token1Decimals =
        this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
      const token0Decimals =
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
      let quantity = '0';
      let total = '0';
      if (this.level100[1].ask && this.level100[1].ask.length) {
        const ask = this.level100[1].ask;
        for (let i = 0; i < ask.length; i++) {
          const price = this.filterLevelPrice(
            ask[i].price,
            this.unit,
            token0Decimals,
            token1Decimals,
            this.buyUnit,
            'ask'
          );
          const currentQuantity = this.filterQuantity(
            ask[i].quantity,
            token0Decimals,
            this.tokenMinUnit
          );
          const currentTotal = new BigNumber(price).times(currentQuantity);
          if (new BigNumber(total).plus(currentTotal).lt(this.buyTotalMKT)) {
            total = new BigNumber(total).plus(currentTotal).toString(10);
            quantity = new BigNumber(ask[i].quantity.toString(10))
              .div(10 ** token0Decimals)
              .plus(quantity)
              .toString(10);
          } else {
            const lastQuantity = new BigNumber(this.buyTotalMKT)
              .minus(total)
              .div(price);
            quantity = new BigNumber(quantity)
              .plus(lastQuantity.toString(10))
              .toString(10);
            break;
          }
        }
      }
      this.mktQuantity =
        '≈' +
        new BigNumber(quantity)
          .decimalPlaces(this.tokenMinUnit, 1)
          .toString(10);
    } else {
      this.mktQuantity = 'Market';
      if (this.isH5) {
        this.mktQuantity = 'Market Quantity';
      }
    }
  }
  private getMktTotal(): void {
    if (this.sellAmount && this.level100) {
      const token1Decimals =
        this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
      const token0Decimals =
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
      let quantity = '0';
      let total = '0';
      if (this.level100[1].bid && this.level100[1].bid.length) {
        const bid = this.level100[1].bid;
        for (let i = 0; i < bid.length; i++) {
          const price = this.filterLevelPrice(
            bid[i].price,
            this.unit,
            token0Decimals,
            token1Decimals,
            this.buyUnit,
            'bid'
          );
          const currentQuantity = this.filterQuantity(
            bid[i].quantity,
            token0Decimals,
            this.tokenMinUnit
          );
          const currentTotal = new BigNumber(price).times(currentQuantity);
          if (
            new BigNumber(quantity).plus(currentQuantity).lt(this.sellAmount)
          ) {
            total = new BigNumber(total).plus(currentTotal).toString(10);
            quantity = new BigNumber(currentQuantity)
              .plus(quantity)
              .toString(10);
          } else {
            const lastTotal = new BigNumber(this.sellAmount)
              .minus(quantity)
              .times(price);
            total = new BigNumber(total)
              .plus(lastTotal.toString(10))
              .toString(10);
            break;
          }
        }
      }
      this.mktTotal =
        '≈' + new BigNumber(total).decimalPlaces(token1Decimals).toString(10);
    } else {
      this.mktTotal = 'Market';
      if (this.isH5) {
        this.mktTotal = 'Market Total';
      }
    }
  }
  private mktTotalChange(): void {
    if (Number(this.buyTotalMKT)) {
      this.buyMktSlider = new BigNumber(this.buyTotalMKT)
        .times(
          10 **
            this.tokens[this.currentPair[1][0].token1[0].toString()].decimals
        )
        .div(this.tokensBalance[this.currentPair[1][0].token1[0].toString()])
        .times(100)
        .decimalPlaces(0)
        .toNumber();
    } else {
      this.buyMktSlider = 0;
    }
    this.getMktQuantity();
  }
  private buyTotalChange(): void {
    if (this.buyPrice && Number(this.buyPrice) !== 0 && this.buyTotal) {
      this.buyAmount = new BigNumber(this.buyTotal)
        .div(this.buyPrice)
        .decimalPlaces(this.tokenMinUnit, 1)
        .toString(10);
    } else if (
      this.buyAmount &&
      Number(this.buyAmount) !== 0 &&
      this.buyTotal
    ) {
      this.buyPrice = new BigNumber(this.buyTotal)
        .div(this.buyAmount)
        .decimalPlaces(this.buyUnit, 1)
        .toString(10);
    }
  }
  private sellPriceChange(): void {
    this.isToSell = false;
    if (this.sellAmount && this.sellPrice) {
      this.sellTotal = new BigNumber(this.sellPrice)
        .times(this.sellAmount)
        .toString(10);
    } else if (
      this.sellPrice &&
      Number(this.sellPrice) !== 0 &&
      this.sellTotal
    ) {
      this.sellAmount = new BigNumber(this.sellTotal)
        .div(this.sellPrice)
        .decimalPlaces(this.tokenMinUnit, 1)
        .toString(10);
    }
  }
  private sellAmountChange(): void {
    if (this.sellAmount && this.sellPrice) {
      this.sellTotal = new BigNumber(this.sellPrice)
        .times(this.sellAmount)
        .toString(10);
    } else if (
      this.sellAmount &&
      Number(this.sellAmount) !== 0 &&
      this.sellTotal
    ) {
      this.sellPrice = new BigNumber(this.sellTotal)
        .div(this.sellAmount)
        .decimalPlaces(this.buyUnit, 1)
        .toString(10);
    }
  }
  private sellTotalChange(): void {
    if (this.sellPrice && Number(this.sellPrice) !== 0 && this.sellTotal) {
      this.sellAmount = new BigNumber(this.sellTotal)
        .div(this.sellPrice)
        .decimalPlaces(this.tokenMinUnit, 1)
        .toString(10);
    } else if (
      this.sellAmount &&
      Number(this.sellAmount) !== 0 &&
      this.sellTotal
    ) {
      this.sellPrice = new BigNumber(this.sellTotal)
        .div(this.sellAmount)
        .decimalPlaces(this.buyUnit, 1)
        .toString(10);
    }
  }
  private async getTokenBalanceSto(tokenInfo: SwapTokenInfo): Promise<void> {
    const tokenStd = tokenInfo[2];
    const tokenId = tokenInfo[0].toString();
    const balance = await getTokenBalance(tokenStd, tokenId, 1);
    if (
      !this.isTodo &&
      this.time !== 6 &&
      !this.orderLoading[this.currentPair[0].toString()]
    ) {
      if (balance) {
        this.$set(this.tokensBalanceSto, tokenId, balance);
      }
    }
  }
  private async getTokenBalance(tokenInfo: SwapTokenInfo): Promise<void> {
    const tokenStd = tokenInfo[2];
    const tokenId = tokenInfo[0].toString();
    const balance = await getTokenBalance(tokenStd, tokenId);
    if (
      !this.isTodo &&
      this.time !== 6 &&
      !this.orderLoading[this.currentPair[0].toString()]
    ) {
      if (balance) {
        this.$set(this.tokensBalance, tokenId, balance);
      }
    }
  }
  private getIcpPrice(): void {
    try {
      let token1;
      if (this.currentPair && this.currentPair[1] && this.currentPair[1][0]) {
        token1 = this.currentPair[1][0].token1[1];
      }
      if (token1 && token1.toLocaleLowerCase().includes('usdt')) {
        this.icpPrice = '1';
      }
      axios
        .get('https://pncff-zqaaa-aaaai-qnp3a-cai.raw.ic0.app/2')
        .then((res) => {
          const icpPrice = (res as any).data.success[0].rate;
          if ((token1 && token1.toLocaleLowerCase() === 'icp') || !token1) {
            this.icpPrice = icpPrice;
            this.currentMarketPrice['icp'] = icpPrice;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }
  private changeTradeType(tradeType: string): void {
    this.tradeType = tradeType;
    this.currentMark = 0;
    this.orderType = OrderTypeEnum.LMT;
    this.init();
  }
  private onchangeOrderTypeEnum(item): void {
    this.changeOrderType(item);
  }
  private changeOrderType(item): void {
    console.log(item);
    this.orderType = item;
    this.currentMark = 0;
    if (item === 'Stop-loss') {
      this.currentTradeMenu = 'stop';
    } else {
      this.currentTradeMenu = 'pending';
    }
    this.currentProOrderMenu = null;
    this.init();
  }
  private tradeH5(type: string): void {
    this.showTrade = true;
    this.tradeType = type;
    this.currentMark = 0;
    this.orderType = OrderTypeEnum.LMT;
  }
  private changeMenu(menu): void {
    this.currentMenu = menu.name;
  }
  private init(): void {
    this.isToBuy = false;
    this.buyPrice = '';
    this.buyAmount = '';
    this.buyTotal = '';
    this.buySlider = 0;
    this.buyMktSlider = 0;
    this.isToBuyMKT = false;
    this.buyTotalMKT = '';
    this.isToSell = false;
    this.sellPrice = '';
    this.sellAmount = '';
    this.sellTotal = '';
    this.mktPrice = '20';
    this.mktSellPrice = '20';
    this.stopBuyPrice = '';
    this.stopSellPrice = '';
    this.sellSlider = 0;
    this.sellMktSlider = 0;
    this.mktTotal = 'Market';
    this.mktQuantity = 'Market';
    if (this.isH5) {
      this.mktQuantity = 'Market Quantity';
      this.mktTotal = 'Market Total';
    }
    this.toStatus = {};
    this.getRole(this.currentPair);
    // if (this.orderType !== 'MKT') {
    //   this.initPrice();
    // }
  }
  private changeOrderBookType(item) {
    this.orderBookType = item.key;
    if (item.key === OrderBookType.Sell) {
      this.ask = this.tickAsk.slice(0, 20).reverse();
    }
    if (item.key === OrderBookType.All) {
      this.ask = this.tickAsk.slice(0, 10).reverse();
      this.bid = this.tickBid.slice(0, 10);
    }
    if (item.key === OrderBookType.Buy) {
      this.bid = this.tickBid.slice(0, 20);
      if (this.isH5) {
        this.bid = this.bid.slice(0, 10);
      }
    }
    if (this.isH5) {
      this.ask = this.tickAsk.slice(0, 10);
    }
    this.getMaxTotal();
  }
  private async getAllLiquidity(): Promise<void> {
    let promiseAllValue = [];
    const MAX_CONCURRENCY = 20;
    for (
      let i = 0;
      i < this.tradePairs[this.currentTradeMarketSort].length;
      i++
    ) {
      promiseAllValue.push(
        this.getLiquidity(
          this.tradePairs[this.currentTradeMarketSort][i][0].toString(),
          i,
          this.currentTradeMarketSort
        )
      );
      if (promiseAllValue.length === MAX_CONCURRENCY) {
        await Promise.all(promiseAllValue);
        promiseAllValue = [];
      }
      if (
        i === this.tradePairs[this.currentTradeMarketSort].length - 1 &&
        promiseAllValue.length
      ) {
        await Promise.all(promiseAllValue);
        promiseAllValue = [];
      }
    }
  }
  private initIntervalPrice(): void {
    try {
      this.getIcpPrice();
      this.getAllLiquidity();
      if (this.getPrincipalId) {
        this.getUserLiquidity(this.currentPair[0].toString());
        const principal = localStorage.getItem('principal');
        if (principal) {
          this.getPending(this.currentPair[0].toString());
          this.getTradeList(this.currentPair[0].toString(), principal);
          this.getStopOrders(this.currentPair[0].toString(), principal);
        }
        if (
          !this.isTodo &&
          this.time !== 6 &&
          !this.orderLoading[this.currentPair[0].toString()]
        ) {
          if (this.currentPair) {
            this.getAllowance(this.currentPair);
            const token0Info = this.currentPair[1][0].token0;
            const token1Info = this.currentPair[1][0].token1;
            this.getTokenBalance(token0Info);
            this.getTokenBalance(token1Info);
            this.getTokenBalanceSto(token0Info);
            this.getTokenBalanceSto(token1Info);
            this.getDepositBalance();
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  private getIntervalPrice(time = 10): void {
    try {
      this.time = time;
      this.initIntervalPrice();
      this.getLevel100(this.currentPair[0].toString());
      this.latestFilled(this.currentPair[0].toString());
      window.clearInterval(this.timer);
      this.timer = null;
      window.clearInterval(this.timerOrderBook);
      this.timerOrderBook = null;
      this.timer = window.setInterval(async () => {
        if (!this.getCheckAuth) {
          setTimeout(async () => {
            this.initIntervalPrice();
          }, 0);
        }
      }, time * 1000);
      this.timerOrderBook = window.setInterval(() => {
        if (!this.getCheckAuth) {
          setTimeout(() => {
            this.getLiquidity(
              this.currentPair[0].toString(),
              this.currentPairIndex,
              this.currentTradeMarketSort
            );
            this.getLevel100(this.currentPair[0].toString());
            this.latestFilled(this.currentPair[0].toString());
          }, 0);
        }
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  }
  private async getAllowance(currentPair: DePairs): Promise<void> {
    const token0Info = currentPair[1][0].token0;
    const token1Info = currentPair[1][0].token1;
    this.allowance(token0Info, currentPair);
    this.allowance(token1Info, currentPair);
  }
  private async allowance(
    tokenInfo: SwapTokenInfo,
    currentPair: DePairs
  ): Promise<void> {
    const tokenStd = Object.keys(tokenInfo[2])[0];
    const tokenId = tokenInfo[0].toString();
    const currentPairId = currentPair[0].toString();
    if (!this.tokenAllowance[currentPairId]) {
      this.tokenAllowance[currentPairId] = {};
    }
    if (tokenStd === 'icp' || tokenStd === 'icrc1' || tokenStd === 'cycles') {
      this.tokenAllowance[currentPairId][tokenId] = BigInt(0);
    }
    const currentDrc20Token = new DRC20TokenService();
    const spender = currentPairId;
    const principal = localStorage.getItem('principal');
    if (principal) {
      const account = principalToAccountIdentifier(
        Principal.fromText(principal)
      );
      if (tokenStd === 'drc20') {
        const allowance = await currentDrc20Token.drc20_allowance(
          tokenId,
          account,
          spender
        );
        if (this.time !== 6) {
          if (!this.tokenAllowance[currentPairId]) {
            this.tokenAllowance[currentPairId] = {};
          }
          this.tokenAllowance[currentPairId][tokenId] = allowance;
        }
      } else if (tokenStd === 'dip20') {
        const allowance = await currentDrc20Token.allowance(
          tokenId,
          Principal.fromText(principal),
          Principal.fromText(currentPairId)
        );
        if (this.time !== 6) {
          if (currentPairId === this.currentPair[0].toString()) {
            this.tokenAllowance[currentPairId][tokenId] = allowance;
          }
        }
      } else if (tokenStd === 'icrc2') {
        const res = await currentDrc20Token.icrc2_allowance(tokenId, {
          account: {
            owner: Principal.fromText(principal),
            subaccount: []
          },
          spender: {
            owner: Principal.fromText(currentPairId),
            subaccount: []
          }
        });
        if (this.time !== 6) {
          if (currentPairId === this.currentPair[0].toString()) {
            this.tokenAllowance[currentPairId][tokenId] = res.allowance;
          }
        }
      }
    }
  }
  private async getTokens(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.getTokens(['icdex']);
    let canisterIds: Array<string> = [];
    this.tradePairs.ICP.forEach((pair) => {
      canisterIds.push(pair[0].toString());
    });
    this.tradePairs.USDT.forEach((pair) => {
      canisterIds.push(pair[0].toString());
    });
    // this.tradePairs.Old.forEach((pair) => {
    //   canisterIds.push(pair[0].toString());
    // });
    res.forEach((item) => {
      if (item[0].toString() !== LEDGER_CANISTER_ID) {
        canisterIds.push(item[0].toString());
      }
    });
    canisterIds = [...new Set(canisterIds)];
    const flag = needConnectPlug(canisterIds);
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const needConnectInfinity1 = await needConnectInfinity(canisterIds);
    if (priList[principal] === 'Plug' && flag && this.$route.name === 'ICDex') {
      // this.loading.close();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      // const h = this.$createElement;
      this.$info({
        content: 'ICDex need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(canisterIds).then(async () => {
            if (_that.isH5) {
              // _that.currentPair && (_that.$refs as any).tradingMiningH5.init();
            } else {
              _that.currentPair && (_that.$refs as any).tradingMining.init();
            }
            if (res && res.length) {
              let promiseAllValue = [];
              const MAX_COCURRENCY = 10;
              for (let i = 0; i < res.length; i++) {
                const tokenStd = res[i][2];
                const tokenId = res[i][0];
                if (!_that.tokens[tokenId.toString()]) {
                  promiseAllValue.push(_that.setTokenInfo(tokenId, tokenStd));
                  if (promiseAllValue.length === MAX_COCURRENCY) {
                    await Promise.all(promiseAllValue);
                    promiseAllValue = [];
                  }
                  if (i === res.length - 1 && promiseAllValue.length) {
                    await Promise.all(promiseAllValue);
                    promiseAllValue = [];
                  }
                }
              }
              _that.addToken(res);
              _that.initDex();
            }
          });
        }
      });
    } else if (
      priList[principal] === 'Infinity' &&
      needConnectInfinity1 &&
      this.$route.name === 'ICDex'
    ) {
      // this.loading.close();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      // const h = this.$createElement;
      this.$info({
        content: 'ICDex need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity(canisterIds).then(async () => {
            if (_that.isH5) {
              // _that.currentPair && (_that.$refs as any).tradingMiningH5.init();
            } else {
              _that.currentPair && (_that.$refs as any).tradingMining.init();
            }
            if (res && res.length) {
              let promiseAllValue = [];
              const MAX_COCURRENCY = 10;
              for (let i = 0; i < res.length; i++) {
                const tokenStd = res[i][2];
                const tokenId = res[i][0];
                if (!_that.tokens[tokenId.toString()]) {
                  promiseAllValue.push(_that.setTokenInfo(tokenId, tokenStd));
                  if (promiseAllValue.length === MAX_COCURRENCY) {
                    await Promise.all(promiseAllValue);
                    promiseAllValue = [];
                  }
                  if (i === res.length - 1 && promiseAllValue.length) {
                    await Promise.all(promiseAllValue);
                    promiseAllValue = [];
                  }
                }
              }
              _that.addToken(res);
              _that.initDex();
            }
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
      if (this.isH5) {
        // this.currentPair && (this.$refs as any).tradingMiningH5.init();
      } else {
        this.currentPair && (this.$refs as any).tradingMining.init();
      }
      if (res && res.length) {
        let promiseAllValue = [];
        const MAX_COCURRENCY = 10;
        for (let i = 0; i < res.length; i++) {
          const tokenStd = res[i][2];
          const tokenId = res[i][0];
          if (!this.tokens[tokenId.toString()]) {
            promiseAllValue.push(this.setTokenInfo(tokenId, tokenStd));
            if (promiseAllValue.length === MAX_COCURRENCY) {
              await Promise.all(promiseAllValue);
              promiseAllValue = [];
            }
            if (i === res.length - 1 && promiseAllValue.length) {
              await Promise.all(promiseAllValue);
              promiseAllValue = [];
            }
          }
        }
        this.addToken(res);
        this.initDex();
      }
    }
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
  private changeTradeMarketSort(val): void {
    this.currentTradeMarketSort = val.name;
    this.getAllLiquidity();
  }
  private initFallbackInfo(): void {
    if (this.getPrincipalId) {
      const fallbackLocal = JSON.parse(localStorage.getItem('fallback')) || {};
      const now = new Date().getTime();
      for (let key in fallbackLocal) {
        if (new BigNumber(fallbackLocal[key]).plus(60 * 60 * 1000).lt(now)) {
          delete fallbackLocal[key];
        }
      }
      localStorage.setItem('fallback', JSON.stringify(fallbackLocal));
    }
  }
  private async changePair(pair: DePairs, index: number): Promise<void> {
    try {
      this.showParis = false;
      if (
        this.currentPair &&
        this.currentPair[0] &&
        pair[0].toString() === this.currentPair[0].toString()
      ) {
        return;
      }
      await this.$router.push(
        `/ICDex/${pair[1][0].token0[1]}/${pair[1][0].token1[1]}`
      );
      if (
        pair[2] &&
        this.tokens &&
        this.tokens[pair[1][0].token0[0].toString()] &&
        this.tokens[pair[1][0].token1[0].toString()]
      ) {
        const price = new BigNumber(pair[2].price)
          .times(10 ** this.tokens[pair[1][0].token0[0].toString()].decimals)
          .div(10 ** this.tokens[pair[1][0].token1[0].toString()].decimals)
          .decimalPlaces(8)
          .toString(10);
        document.title = `${price} | ${pair[1][0].token0[1]}/${pair[1][0].token1[1]} - ICDex (Orderbook Dex)`;
      } else {
        document.title = `${pair[1][0].token0[1]}/${pair[1][0].token1[1]} - ICDex (Orderbook Dex)`;
      }
      this.isTodo = false;
      this.currentTradeMenu = 'pending';
      this.keepingBalance = {};
      this.keepingBalanceSto = {};
      this.tradeCompetitionsMenu = null;
      this.showKeepBalance = false;
      this.isKeeping = false;
      this.isPoolMode = false;
      this.unit = null;
      this.ask = [];
      this.bid = [];
      this.askTrade = [];
      this.bidTrade = [];
      this.tickBid = [];
      this.tickAsk = [];
      this.tickSizes = [];
      this.currentSize = null;
      this.stopOrders = [];
      this.stopLossNeed = {
        token0: BigInt(0),
        token1: BigInt(0)
      };
      console.log(pair[0].toString());
      if (pair[1][0].token1[1].toLocaleLowerCase() === 'icp') {
        console.log(this.currentTradeMarketSort);
        if (this.currentTradeMarketSort === 'ICP') {
          this.pairs = this.tradePairs.ICP;
        } else {
          // this.pairs = this.tradePairs.Old;
        }
      }
      if (pair[1][0].token1[1].toLocaleLowerCase().includes('usdt')) {
        this.currentTradeMarketSort = 'USDT';
        this.pairs = this.tradePairs.USDT;
      }
      this.currentPair = pair;
      localStorage.setItem(
        'icdexpair',
        `/${pair[1][0].token0[1]}/${pair[1][0].token1[1]}`
      );
      this.currentPairIndex = index;
      this.tokenAllowance = {};
      this.dayInfo = null;
      this.feeRebate = '';
      this.chartSpinning = true;
      this.getMakerRebate();
      this.initInterval();
      this.orderType = 'LMT';
      this.init();
      this.latestFilledRecord = [];
      this.resetChart();
      this.getLevel100(this.currentPair[0].toString(), 'init').then(() => {
        this.getQuotes(this.currentPair[0].toString(), true);
        this.initPrice();
      });
      this.getConfig();
      this.proOrders = [];
      this.pendingList = [];
      this.userRecord = [];
      this.userLiquidity = null;
      this.pairTotalPending = 0;
      this.pairInfo = null;
      this.getPairInfo(this.currentPair);
      this.getIntervalPrice();
      this.clearMonitor();
      this.getTotalPending();
      this.initFallbackInfo();
      try {
        const currentPairId = this.currentPair[0].toString();
        if (!this.prepare[currentPairId]) {
          const res = await this.getTxAccount(currentPairId);
          if (res && res.pairId === this.currentPair[0].toString()) {
            this.prepare[currentPairId] = res.txAccount;
            this.initPrepared(currentPairId);
          }
        }
      } catch (e) {
        console.error(e);
      }
      if (!this.isToSetReferrer) {
        this.toSetReferrer();
      }
      this.initAccount();
      this.stoConfig = null;
      this.getStoConfig();
    } catch (e) {
      console.error(e);
    }
  }
  private initPrice(): void {
    if (
      !this.tokens[this.currentPair[1][0].token0[0].toString()] ||
      !this.tokens[this.currentPair[1][0].token1[0].toString()]
    ) {
      return;
    }
    if (this.askTrade.length && !this.buyPrice) {
      this.buyPrice = parseFloat(
        this.filterLevelPrice(
          this.askTrade[this.askTrade.length - 1].price,
          this.unit,
          this.tokens[this.currentPair[1][0].token0[0].toString()].decimals,
          this.tokens[this.currentPair[1][0].token1[0].toString()].decimals,
          this.buyUnit,
          'ask'
        )
      ).toString(10);
    }
    if (this.bidTrade.length && !this.sellPrice) {
      this.sellPrice = parseFloat(
        this.filterLevelPrice(
          this.bidTrade[0].price,
          this.unit,
          this.tokens[this.currentPair[1][0].token0[0].toString()].decimals,
          this.tokens[this.currentPair[1][0].token1[0].toString()].decimals,
          this.buyUnit,
          'bid'
        )
      ).toString(10);
    }
    if (this.isH5) {
      if (this.ask.length && !this.buyPrice) {
        this.buyPrice = parseFloat(
          this.filterLevelPrice(
            this.ask[0].price,
            this.unit,
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals,
            this.tokens[this.currentPair[1][0].token1[0].toString()].decimals,
            this.buyUnit,
            'ask'
          )
        ).toString(10);
      }
      if (this.bid.length && !this.sellPrice) {
        this.sellPrice = parseFloat(
          this.filterLevelPrice(
            this.bid[0].price,
            this.unit,
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals,
            this.tokens[this.currentPair[1][0].token1[0].toString()].decimals,
            this.buyUnit,
            'bid'
          )
        ).toString(10);
      }
    }
  }
  private async getPairInfo(currentPair: DePairs): Promise<void> {
    const res = await this.currentICDexService.info(currentPair[0].toString());
    if (res && res.pairId === this.currentPair[0].toString()) {
      this.pairInfo = res.pairInfo;
      console.log(this.pairInfo);
      if (this.pairInfo.paused) {
        this.getSysMode(currentPair);
      }
    }
  }
  private async getSysMode(currentPair: DePairs): Promise<void> {
    const res = await this.currentICDexService.sysMode(
      currentPair[0].toString()
    );
    if (res && res.pairId === this.currentPair[0].toString()) {
      this.sysMode = {
        mode: res.mode,
        openingTime: res.openingTime
      };
      if (
        this.sysMode.openingTime &&
        this.currentPair[0].toString() === currentPair[0].toString()
      ) {
        const now = new Date().getTime();
        if (
          new BigNumber(now)
            .times(1000000)
            .gt(this.sysMode.openingTime.toString(10))
        ) {
          this.$set(this.pairInfo, 'paused', false);
        }
      }
      console.log(this.sysMode);
    }
  }
  private onFinish(): void {
    this.getPairInfo(this.currentPair);
  }
  private async getDexPairs(dexName: DexNameType): Promise<void> {
    try {
      const res = await this.iCSwapRouterService.getPairs([dexName], [], []);
      if (res.data && res.data.length) {
        const pairs = res.data.sort(
          (a, b) => Number(b[1][1]) - Number(a[1][1])
        );
        pairs.forEach((pair) => {
          const token1Symbol = pair[1][0].token1[1].toLocaleLowerCase();
          if (token1Symbol === 'icp') {
            this.tradePairs.ICP.push(pair);
          }
          // todo usdt test
          if (token1Symbol.toLocaleLowerCase().includes('usdt')) {
            this.tradePairs.USDT.push(pair);
          }
        });
        let token0 = this.$route.params.token0;
        let token1 = this.$route.params.token1;
        if (token0 && token1) {
          if (
            token1.toLocaleLowerCase() !== 'icp' &&
            !token1.toLocaleLowerCase().includes('usdt')
          ) {
            for (let i = 0; i < pairs.length; i++) {
              if (
                (pairs[i][1][0].token0[1] === token0 ||
                  pairs[i][1][0].token0[0].toString() === token0) &&
                (pairs[i][1][0].token1[1] === token1 ||
                  pairs[i][1][0].token1[0].toString() === token1)
              ) {
                token0 = pairs[i][1][0].token0[1];
                token1 = pairs[i][1][0].token1[1];
                break;
              }
            }
          }
          if (token1.toLocaleLowerCase() === 'icp') {
            this.currentTradeMarketSort = 'ICP';
            this.pairs = this.tradePairs.ICP;
          }
          if (token1.toLocaleLowerCase().includes('usdt')) {
            this.currentTradeMarketSort = 'USDT';
            this.pairs = this.tradePairs.USDT;
          }
          for (let i = 0; i < this.pairs.length; i++) {
            if (
              (this.pairs[i][1][0].token0[1] === token0 ||
                this.pairs[i][1][0].token0[0].toString() === token0) &&
              (this.pairs[i][1][0].token1[1] === token1 ||
                this.pairs[i][1][0].token1[0].toString() === token1)
            ) {
              this.currentPairIndex = i;
              this.currentPair = this.pairs[this.currentPairIndex];
              break;
            }
          }
          if (!this.currentPair && this.$route.name === 'ICDex') {
            this.currentTradeMarketSort = 'ICP';
            this.pairs = this.tradePairs.ICP;
            this.currentPair = this.pairs[this.currentPairIndex];
            await this.$router.push(
              `/ICDex/${this.currentPair[1][0].token0[1]}/${this.currentPair[1][0].token1[1]}`
            );
            if (
              this.currentPair[2] &&
              this.tokens &&
              this.tokens[this.currentPair[1][0].token0[0].toString()] &&
              this.tokens[this.currentPair[1][0].token1[0].toString()]
            ) {
              const price = new BigNumber(this.currentPair[2].price)
                .times(
                  10 **
                    this.tokens[this.currentPair[1][0].token0[0].toString()]
                      .decimals
                )
                .div(
                  10 **
                    this.tokens[this.currentPair[1][0].token1[0].toString()]
                      .decimals
                )
                .decimalPlaces(8)
                .toString(10);
              document.title = `${price} | ${this.currentPair[1][0].token0[1]}/${this.currentPair[1][0].token1[1]} - ICDex (Orderbook Dex)`;
            } else {
              document.title = `${this.currentPair[1][0].token0[1]}/${this.currentPair[1][0].token1[1]} - ICDex (Orderbook Dex)`;
            }
          }
        } else {
          if (this.$route.name === 'ICDex') {
            this.currentTradeMarketSort = 'ICP';
            this.pairs = this.tradePairs.ICP;
            this.currentPair = this.pairs[this.currentPairIndex];
            await this.$router.push(
              `/ICDex/${this.currentPair[1][0].token0[1]}/${this.currentPair[1][0].token1[1]}`
            );
            if (
              this.currentPair[2] &&
              this.tokens &&
              this.tokens[this.currentPair[1][0].token0[0].toString()] &&
              this.tokens[this.currentPair[1][0].token1[0].toString()]
            ) {
              const price = new BigNumber(this.currentPair[2].price)
                .times(
                  10 **
                    this.tokens[this.currentPair[1][0].token0[0].toString()]
                      .decimals
                )
                .div(
                  10 **
                    this.tokens[this.currentPair[1][0].token1[0].toString()]
                      .decimals
                )
                .decimalPlaces(8)
                .toString(10);
              document.title = `${price} | ${this.currentPair[1][0].token0[1]}/${this.currentPair[1][0].token1[1]} - ICDex (Orderbook Dex)`;
            } else {
              document.title = `${this.currentPair[1][0].token0[1]}/${this.currentPair[1][0].token1[1]} - ICDex (Orderbook Dex)`;
            }
          }
        }
        const type = this.$route.query.type;
        if (type && type === 'referrer') {
          this.tradeCompetitionsMenu = TradeCompetitionsEnum.Referral;
          setTimeout(() => {
            (this.$refs.tradeCompetitions as any).init(
              this.tradeCompetitionsMenu
            );
          }, 20);
        }
        this.getRole(this.currentPair);
        this.setReferral();
        this.getMakerRebate();
        this.getAllowance(this.currentPair);
        this.initAccount();
        this.getStoConfig();
        this.$nextTick(() => {
          this.resetChart();
          const height = (this.$refs.deSwapListItemPair as any).clientHeight;
          let top = (this.currentPairIndex + 1) * 50 - height;
          if (top < 0) {
            top = 0;
          }
          (this.$refs.deSwapListItemPair as any).scrollTop = top;
        });
      }
      // const res1 = await this.iCSwapRouterService.getPairs([dexName], [], []);
      // if (res1.data && res1.data.length) {
      //   const pairs = res1.data.sort(
      //     (a, b) => Number(b[1][1]) - Number(a[1][1])
      //   );
      //   pairs.forEach((pair) => {
      //     const token1Symbol = pair[1][0].token1[1].toLocaleLowerCase();
      //     if (token1Symbol === 'icp') {
      //       this.tradePairs.Old.push(pair);
      //     }
      //   });
      // }
      // if (!this.pairs.length) {
      //   this.pairs = this.tradePairs.Old;
      // }
      this.getTokens();
      console.log(this.pairs);
    } catch (e) {
      console.log(e);
    }
    // this.loading.close();
  }
  private async initDex(): Promise<void> {
    const token0Info = this.currentPair[1][0].token0;
    const token1Info = this.currentPair[1][0].token1;
    this.getTokenBalance(token0Info);
    this.getTokenBalance(token1Info);
    this.getTokenBalanceSto(token0Info);
    this.getTokenBalanceSto(token1Info);
    this.getLevel100(this.currentPair[0].toString(), 'init').then(() => {
      this.getQuotes(this.currentPair[0].toString(), true);
      this.initPrice();
    });
    this.getConfig();
    const principal = localStorage.getItem('principal');
    if (principal) {
      this.getTradeList(this.currentPair[0].toString(), principal);
      this.getPending(this.currentPair[0].toString(), true);
      this.getTotalPending();
      this.getPairInfo(this.currentPair);
      this.getUserLiquidity(this.currentPair[0].toString());
    }
    this.latestFilled(this.currentPair[0].toString());
    this.getIntervalPrice();
    try {
      if (principal) {
        const currentPairId = this.currentPair[0].toString();
        const res = await this.getTxAccount(currentPairId);
        if (res && res.pairId === this.currentPair[0].toString()) {
          this.prepare[currentPairId] = res.txAccount;
          this.initPrepared(currentPairId);
        }
      }
    } catch (e) {
      console.error(e);
    }
    if (!this.isToSetReferrer) {
      this.toSetReferrer();
    }
  }
  private async addToken(res: Array<SwapTokenInfo>): Promise<void> {
    console.log(res);
    const tokens = await addedTokens();
    console.log(tokens);
    const tokensId: Array<string> = [];
    tokens.forEach((item) => {
      tokensId.push(item.canisterId.toString());
    });
    for (let i = 0; i < res.length; i++) {
      const tokenId = res[i][0].toString();
      if (tokenId !== LEDGER_CANISTER_ID && !tokensId.includes(tokenId)) {
        console.log(tokenId);
        let standard = Object.keys(res[i][2])[0];
        if (standard !== 'dip20') {
          const amount = await getTokenBalance(res[i][2], tokenId);
          console.log(amount);
          if (new BigNumber(amount).gt(0)) {
            if (standard.toLocaleLowerCase() === 'drc20') {
              standard = 'DRC20';
            }
            if (standard.toLocaleLowerCase() === 'icrc1') {
              standard = 'ICRC-1';
            }
            if (standard.toLocaleLowerCase() === 'icrc2') {
              standard = 'ICRC-2';
            }
            await addToken(
              Principal.from(tokenId),
              this.tokens[tokenId].symbol,
              this.tokens[tokenId].name,
              this.tokens[tokenId].decimals,
              standard,
              {
                add: null
              }
            );
          }
        }
      }
    }
  }
  private onShowParis(): void {
    this.showParis = true;
    this.$nextTick(() => {
      console.dir(this.$refs.deSwapListItemPairH5);
      const height = (this.$refs.deSwapListItemPairH5 as any).clientHeight;
      let top = (this.currentPairIndex + 1) * 35 - height;
      if (top < 0) {
        top = 0;
      }
      (this.$refs.deSwapListItemPairH5 as any).scrollTop = top;
    });
  }
  private async getUserLiquidity(swapId: string): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.currentICDexService.liquidity(swapId, [
        this.getPrincipalId
      ]);
      if (res && res.pairId === this.currentPair[0].toString()) {
        this.userLiquidity = res.tokenLiquidity;
      }
    }
  }
  private async ta_getReferrer(): Promise<Array<[string, boolean]>> {
    try {
      const dexId = this.currentPair[0].toString();
      const principal = localStorage.getItem('principal');
      const res = await this.currentICDexService.ta_getReferrer(
        dexId,
        principal
      );
      if (res && res.pairId === this.currentPair[0].toString()) {
        return res.referrer;
      }
    } catch (e) {
      console.log(e);
    }
    return [];
  }
  private async setReferrer(
    address: string,
    entity: Array<string>
  ): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const dexId = this.currentPair[0].toString();
      const res = await this.currentICDexService.ta_setReferrer(
        dexId,
        address,
        entity
      );
      if (res) {
        this.$message.success('Success');
      } else {
        this.$message.error('Error');
      }
    } catch (e) {
      console.log(e);
      this.$message.error('Error');
    }
    this.isToSetReferrer = false;
    loading.close();
  }
  private async toSetReferrer(): Promise<void> {
    try {
      this.isToSetReferrer = true;
      const referrer = this.$cookies.get('referral') || {};
      const currentReferrer = referrer[this.currentPair[0].toString()];
      const principal = localStorage.getItem('principal');
      if (principal) {
        const address = principalToAccountIdentifier(
          Principal.fromText(principal)
        );
        if (
          currentReferrer &&
          currentReferrer.accountId &&
          currentReferrer.accountId !== address
        ) {
          const res = await this.ta_getReferrer();
          if (!(res && res[0] && res[0][0])) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const that = this;
            this.$info({
              title: 'Set referrer',
              content: 'My referrer account id: ' + currentReferrer.accountId,
              class: 'connect-plug register-mining-confirm',
              icon: 'connect-plug',
              okText: 'Submit',
              centered: true,
              onOk() {
                let entity = [];
                if (currentReferrer.entity) {
                  entity = [currentReferrer.entity.trim()];
                }
                that.setReferrer(currentReferrer.accountId, entity);
              }
            });
          }
        } else {
          this.isToSetReferrer = false;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getLiquidity(
    swapId: string,
    index: number,
    currentTradeMarketSort: string
  ): Promise<void> {
    // const liquidity = await currentICDexService.liquidity(swapId);
    try {
      const res = await this.currentICDexService.stats(swapId);
      if (!res) {
        return;
      }
      let newPair;
      newPair = this.tradePairs[currentTradeMarketSort][index][0].toString();
      if (res.pairId === newPair) {
        this.$set(this.tradePairs[currentTradeMarketSort][index], 2, res.stats);
      }
      if (this.currentPair && this.$route.name === 'ICDex') {
        if (
          this.currentPair[2] &&
          this.tokens &&
          this.tokens[this.currentPair[1][0].token0[0].toString()] &&
          this.tokens[this.currentPair[1][0].token1[0].toString()]
        ) {
          const price = new BigNumber(this.currentPair[2].price)
            .times(
              10 **
                this.tokens[this.currentPair[1][0].token0[0].toString()]
                  .decimals
            )
            .div(
              10 **
                this.tokens[this.currentPair[1][0].token1[0].toString()]
                  .decimals
            )
            .decimalPlaces(8)
            .toString(10);
          document.title = `${price} | ${this.currentPair[1][0].token0[1]}/${this.currentPair[1][0].token1[1]} - ICDex (Orderbook Dex)`;
        } else {
          document.title = `${this.currentPair[1][0].token0[1]}/${this.currentPair[1][0].token1[1]} - ICDex (Orderbook Dex)`;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  private getPercent(item: PriceResponse): string {
    if (Number(this.maxTotal) === 0) {
      return '0';
    } else {
      return new BigNumber(item.quantity.toString(10))
        .div(this.maxTotal.toString(10))
        .times(100)
        .decimalPlaces(2)
        .toString(10);
    }
  }
  private onChangeTickSize(val): void {
    this.currentSize = {
      symbol: val.key,
      size: new BigNumber(1 / 10 ** val.key).toString(10)
    };
    console.log(val);
    console.log(this.currentSize);
    const tradeObSymbol =
      JSON.parse(localStorage.getItem('tradeObSymbol')) || {};
    if (
      val.key === this.tickSizes[0].symbol &&
      tradeObSymbol[this.currentPair[0].toString()]
    ) {
      delete tradeObSymbol[this.currentPair[0].toString()];
    } else {
      tradeObSymbol[this.currentPair[0].toString()] = val.key;
    }
    localStorage.setItem('tradeObSymbol', JSON.stringify(tradeObSymbol));
    this.filterLevel100();
  }
  private getTickSize(): void {
    this.tickSizes = [];
    if (this.currentPair[2]) {
      const price = this.currentPair[2].price || '0';
      let min;
      if (new BigNumber(price).lt(1)) {
        min = 0;
      } else {
        min = 1 - parseInt(price).toString(10).length;
      }
      const symbols = [];
      if (this.buyUnit - min > 7) {
        for (let i = this.buyUnit; i >= min; ) {
          this.tickSizes.push({
            symbol: i,
            size: new BigNumber(1 / 10 ** i).toString(10)
          });
          i = i - 2;
          symbols.push(i);
        }
      } else {
        for (let i = this.buyUnit; i >= min; i--) {
          this.tickSizes.push({
            symbol: i,
            size: new BigNumber(1 / 10 ** i).toString(10)
          });
          symbols.push(i);
        }
      }
      const tradeObSymbol =
        JSON.parse(localStorage.getItem('tradeObSymbol')) || {};
      this.currentSize = this.tickSizes[0];
      if (
        tradeObSymbol[this.currentPair[0].toString()] ||
        tradeObSymbol[this.currentPair[0].toString()] === 0
      ) {
        const symbol = Number(tradeObSymbol[this.currentPair[0].toString()]);
        if (symbols.indexOf(symbol) > -1) {
          this.currentSize = {
            symbol: symbol,
            size: new BigNumber(1 / 10 ** symbol).toString(10)
          };
        }
      }
      console.log(this.tickSizes);
    }
  }
  private async getLevel100(swapId: string, type?: string): Promise<void> {
    const res = await this.currentICDexService.level100(swapId);
    if (res.pairId === this.currentPair[0].toString()) {
      this.level100 = res.levelResponse;
      if (this.unit !== this.level100[0]) {
        this.unit = this.level100[0];
        console.log(this.unit);
        this.unitSize = new BigNumber(this.unit.toString(10))
          .div(
            10 **
              this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
          )
          .toString(10);
      }
      if (type || !this.currentSize) {
        this.getTickSize();
      }
      this.getMktQuantity();
      this.getMktTotal();
      this.filterLevel100();
      if (type) {
        console.log(this.level100);
      }
      this.maxTotal = BigInt('0');
      if (this.tickAsk.length) {
        if (this.orderBookType === OrderBookType.Sell) {
          this.ask = this.tickAsk.slice(0, 20).reverse();
        }
        if (this.orderBookType === OrderBookType.All) {
          this.ask = this.tickAsk.slice(0, 10).reverse();
        }
        if (this.isH5) {
          this.ask = this.tickAsk.slice(0, 10);
        }
        this.askTrade = this.tickAsk.slice(0, 8).reverse();
      } else {
        this.ask = [];
        this.askTrade = [];
      }
      if (this.tickBid.length) {
        if (this.orderBookType === OrderBookType.Buy) {
          this.bid = this.tickBid.slice(0, 20);
          if (this.isH5) {
            this.bid = this.tickBid.slice(0, 10);
          }
        }
        if (this.orderBookType === OrderBookType.All) {
          this.bid = this.tickBid.slice(0, 10);
        }
        this.bidTrade = this.tickBid.slice(0, 8);
      } else {
        this.bid = [];
        this.bidTrade = [];
      }
      this.getMaxTotal();
    }
  }
  private filterLevel100(): void {
    if (this.level100[1] && this.currentSize) {
      // const tokenUnitDecimals = this.level100[0].toString().length - 1;
      const token1Decimals =
        this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
      const token0Decimals =
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
      this.tickAsk = this.mergeQuantity(
        this.level100[1].ask,
        token1Decimals,
        token0Decimals,
        this.level100[0].toString(),
        -this.currentSize.symbol,
        'ask'
      );
      this.tickBid = this.mergeQuantity(
        this.level100[1].bid,
        token1Decimals,
        token0Decimals,
        this.level100[0].toString(),
        -this.currentSize.symbol,
        'bid'
      );
    }
  }
  private mergeQuantity(
    priceResponse: Array<PriceResponse>,
    token1Decimals: number,
    token0Decimals: number,
    unit: string,
    currentSizeSymbol: number,
    type: string
  ): Array<PriceResponse> {
    let map = {};
    let dest: Array<PriceResponse> = [];
    priceResponse.forEach((item) => {
      let price = item.price.toString(10);
      const token0Unit = new BigNumber(unit)
        .div(10 ** token0Decimals)
        .toString(10);
      if (type === 'ask') {
        if (currentSizeSymbol >= 0) {
          // ROUND_CEIL
          price = new BigNumber(
            new BigNumber(price)
              .div(10 ** currentSizeSymbol)
              .div(10 ** token1Decimals)
              .div(token0Unit)
              .toFixed(0, 2)
          )
            .times(10 ** token1Decimals)
            .times(10 ** currentSizeSymbol)
            .times(token0Unit)
            .toString(10);
        } else {
          // ROUND_CEIL
          price = new BigNumber(
            new BigNumber(price)
              .times(10 ** -currentSizeSymbol)
              .div(10 ** token1Decimals)
              .div(token0Unit)
              .toFixed(0, 2)
          )
            .times(10 ** token1Decimals)
            .times(token0Unit)
            .div(10 ** -currentSizeSymbol)
            .toString(10);
        }
      }
      if (type === 'bid') {
        if (currentSizeSymbol >= 0) {
          // ROUND_FLOOR
          price = new BigNumber(
            new BigNumber(price)
              .div(10 ** currentSizeSymbol)
              .div(10 ** token1Decimals)
              .div(token0Unit)
              .toFixed(0, 3)
          )
            .times(10 ** token1Decimals)
            .times(10 ** currentSizeSymbol)
            .times(token0Unit)
            .toString(10);
        } else {
          // ROUND_CEIL
          price = new BigNumber(
            new BigNumber(price)
              .times(10 ** -currentSizeSymbol)
              .div(10 ** token1Decimals)
              .div(token0Unit)
              .toFixed(0, 3)
          )
            .times(10 ** token1Decimals)
            .times(token0Unit)
            .div(10 ** -currentSizeSymbol)
            .toString(10);
        }
      }
      if (!map[price]) {
        dest.push(Object.assign({}, item, { price: price }));
        map[price] = item;
      } else {
        for (let j = 0; j < dest.length; j++) {
          if (dest[j].price.toString(10) === price) {
            dest[j].quantity = BigInt(
              new BigNumber(dest[j].quantity.toString(10))
                .plus(item.quantity.toString(10))
                .toString(10)
            );
            break;
          }
        }
      }
    });
    return dest;
  }

  private getMaxTotal(): void {
    this.maxTotal = BigInt('0');
    let askMax = BigInt('0');
    let bidMax = BigInt('0');
    this.ask.forEach((item) => {
      const quantity = item.quantity;
      if (quantity > askMax) {
        askMax = quantity;
      }
    });
    this.bid.forEach((item) => {
      const quantity = item.quantity;
      if (quantity > bidMax) {
        bidMax = quantity;
      }
    });
    if (this.orderBookType === OrderBookType.All) {
      if (new BigNumber(askMax.toString(10)).gt(bidMax.toString(10))) {
        this.maxTotal = askMax;
      } else {
        this.maxTotal = bidMax;
      }
    }
    if (this.orderBookType === OrderBookType.Sell) {
      this.maxTotal = askMax;
    }
    if (this.orderBookType === OrderBookType.Buy) {
      this.maxTotal = bidMax;
    }
  }
  private filterTotal(
    price: string,
    amount: string,
    unit = this.icpUnit
  ): string {
    if (unit > 8) {
      unit = 8;
    }
    if (
      this.currentPair &&
      this.currentPair[2] &&
      this.currentPair[2].price &&
      Number(this.currentPair[2].price) >= 1 &&
      unit > 4
    ) {
      unit = 4;
    }
    return new BigNumber(price).times(amount).toFixed(unit);
  }
  private filterAmountMKT(
    orderPrice: OrderPrice,
    token0Decimals: number,
    tokenAmountUnit: number
  ): string {
    const side = this.filterSide(orderPrice);
    if (side === 'Buy') {
      return 'Market';
    }
    let amount = new BigNumber(
      (
        orderPrice.quantity as {
          Sell: bigint;
        }
      ).Sell.toString(10)
    );
    return amount.div(10 ** token0Decimals).toFixed(tokenAmountUnit);
  }
  private filterTotalMKTFilled(
    tradingOrder: TradingOrder,
    token1Decimals: number
  ): string {
    let unit = token1Decimals;
    if (unit > 8) {
      unit = 8;
    }
    if (
      this.currentPair &&
      this.currentPair[2] &&
      this.currentPair[2].price &&
      Number(this.currentPair[2].price) >= 1 &&
      unit > 4
    ) {
      unit = 4;
    }
    const side = this.filterSide(tradingOrder.orderPrice);
    if (tradingOrder.filled && tradingOrder.filled.length) {
      let filledTotal = BigInt(0);
      if (tradingOrder.filled && tradingOrder.filled.length) {
        if (side === 'Buy') {
          filledTotal = tradingOrder.filled.reduce((prev, cur) => {
            return BigInt(
              new BigNumber(prev.toString(10))
                .plus(cur.token1Value.DebitRecord.toString(10))
                .toString(10)
            );
          }, BigInt(0));
        } else {
          filledTotal = tradingOrder.filled.reduce((prev, cur) => {
            return BigInt(
              new BigNumber(prev.toString(10))
                .plus(cur.token1Value.CreditRecord.toString(10))
                .toString(10)
            );
          }, BigInt(0));
        }
      }
      return new BigNumber(filledTotal.toString(10))
        .div(10 ** token1Decimals)
        .toFixed(unit);
    }
    return new BigNumber(0).div(10 ** token1Decimals).toFixed(unit);
  }
  private filterAmountMKTFilled(
    tradingOrder: TradingOrder,
    token0Decimals: number,
    tokenMinUnit: number
  ): string {
    const side = this.filterSide(tradingOrder.orderPrice);
    if (tradingOrder.filled && tradingOrder.filled.length) {
      let filledAmount = BigInt(0);
      if (tradingOrder.filled && tradingOrder.filled.length) {
        if (side === 'Buy') {
          filledAmount = tradingOrder.filled.reduce((prev, cur) => {
            return BigInt(
              new BigNumber(prev.toString(10))
                .plus(cur.token0Value.CreditRecord.toString(10))
                .toString(10)
            );
          }, BigInt(0));
        } else {
          filledAmount = tradingOrder.filled.reduce((prev, cur) => {
            return BigInt(
              new BigNumber(prev.toString(10))
                .plus(cur.token0Value.DebitRecord.toString(10))
                .toString(10)
            );
          }, BigInt(0));
        }
      }
      return new BigNumber(filledAmount.toString(10))
        .div(10 ** token0Decimals)
        .toFixed(tokenMinUnit);
    }
    return new BigNumber(0).div(10 ** token0Decimals).toFixed(tokenMinUnit);
  }
  private filterTotalMKT(orderPrice: OrderPrice): string {
    const side = this.filterSide(orderPrice);
    const quantity = orderPrice.quantity;
    let total: bigint;
    if (side === 'Buy') {
      total = (
        quantity as {
          Buy: [tokenAmount, icpPrice];
        }
      ).Buy[1];
    } else {
      return 'Market';
    }
    const token1Decimals =
      this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
    let unit = token1Decimals;
    if (unit > 8) {
      unit = 8;
    }
    if (
      this.currentPair &&
      this.currentPair[2] &&
      this.currentPair[2].price &&
      Number(this.currentPair[2].price) >= 1 &&
      unit > 4
    ) {
      unit = 4;
    }
    return new BigNumber(total.toString(10))
      .div(10 ** token1Decimals)
      .toFixed(unit);
  }
  private filterAmount(
    orderPrice: OrderPrice,
    token0Decimals: number,
    tokenAmountUnit: number
  ): string {
    const quantity = orderPrice.quantity;
    let amount: bigint;
    if (
      (
        quantity as {
          Buy: [tokenAmount, icpPrice];
        }
      ).Buy
    ) {
      amount = (
        quantity as {
          Buy: [tokenAmount, icpPrice];
        }
      ).Buy[0];
    } else {
      amount = (quantity as { Sell: bigint }).Sell;
    }
    return new BigNumber(amount.toString(10))
      .div(10 ** token0Decimals)
      .toFixed(tokenAmountUnit);
  }
  private filterPriceMKTFilled(
    total: string,
    amount: string,
    buyUnit: number
  ): string {
    if (parseFloat(total) && amount) {
      return new BigNumber(parseFloat(total)).div(amount).toFixed(buyUnit);
    }
    return '-';
  }
  private filterStopLossTotalFilled(
    item: STOrder,
    token1Decimals: number
  ): string {
    let unit = token1Decimals;
    if (unit > 8) {
      unit = 8;
    }
    if (
      this.currentPair &&
      this.currentPair[2] &&
      this.currentPair[2].price &&
      Number(this.currentPair[2].price) >= 1 &&
      unit > 4
    ) {
      unit = 4;
    }
    const type = Object.keys(
      (item.strategy as { StopLossOrder: StopLossOrder }).StopLossOrder
        .condition.order.side
    )[0];
    if (type === 'Buy') {
      return new BigNumber(item.stats.totalOutAmount.token1.toString(10))
        .div(10 ** token1Decimals)
        .toFixed(unit);
    }
    if (type === 'Sell') {
      return new BigNumber(item.stats.totalInAmount.token1.toString(10))
        .div(10 ** token1Decimals)
        .toFixed(unit);
    }
  }
  private filterStopLossQuantity(
    item: STOrder,
    tokenAmountUnit: number,
    token0Decimals: number
  ): string {
    const type = Object.keys(
      (item.strategy as { StopLossOrder: StopLossOrder }).StopLossOrder
        .condition.order.side
    )[0];
    if (type === 'Buy') {
      return new BigNumber(item.stats.totalInAmount.token0.toString(10))
        .div(10 ** token0Decimals)
        .toFixed(tokenAmountUnit);
    }
    if (type === 'Sell') {
      return new BigNumber(item.stats.totalOutAmount.token0.toString(10))
        .div(10 ** token0Decimals)
        .toFixed(tokenAmountUnit);
    }
    return '';
  }
  private filterStopLossFilled(item: STOrder): string {
    let filledToken0 = '0';
    const type = Object.keys(
      (item.strategy as { StopLossOrder: StopLossOrder }).StopLossOrder
        .condition.order.side
    )[0];
    if (type === 'Buy') {
      filledToken0 = item.stats.totalInAmount.token0.toString(10);
    }
    if (type === 'Sell') {
      filledToken0 = item.stats.totalOutAmount.token0.toString(10);
    }
    const orderToken0 = (
      item.strategy as { StopLossOrder: StopLossOrder }
    ).StopLossOrder.condition.order.quantity.toString(10);
    return (
      new BigNumber(filledToken0).div(orderToken0).times(100).toFixed(2) + '%'
    );
  }
  private filterStopLossPrice(
    item: STOrder,
    token0Decimals: number,
    token1Decimals: number,
    buyUnit: number
  ): string {
    let currentUnit = buyUnit;
    if (buyUnit < 0) {
      currentUnit = 0;
    }
    const type = Object.keys(
      (item.strategy as { StopLossOrder: StopLossOrder }).StopLossOrder
        .condition.order.side
    )[0];
    if (type === 'Buy') {
      if (!item.stats.totalInAmount.token0) {
        return '-';
      }
      return new BigNumber(item.stats.totalOutAmount.token1.toString(10))
        .div(10 ** token1Decimals)
        .times(10 ** token0Decimals)
        .div(item.stats.totalInAmount.token0.toString(10))
        .toFixed(currentUnit, 3);
    }
    if (type === 'Sell') {
      if (!item.stats.totalOutAmount.token0) {
        return '-';
      }
      return new BigNumber(item.stats.totalInAmount.token1.toString(10))
        .div(10 ** token1Decimals)
        .times(10 ** token0Decimals)
        .div(item.stats.totalOutAmount.token0.toString(10))
        .toFixed(currentUnit, 2);
    }
    return '';
  }
  private filterLevelPrice(
    price: bigint,
    unitSize: bigint,
    token0Decimals: number,
    token1Decimals: number,
    buyUnit: number,
    type?: string
  ): string {
    let currentUnit = buyUnit;
    if (buyUnit < 0) {
      currentUnit = 0;
    }
    if (price && price.toString()) {
      const levelPrice = new BigNumber(price.toString(10))
        .div(10 ** token1Decimals)
        .div(new BigNumber(unitSize.toString(10)).div(10 ** token0Decimals));
      if (type === 'ask') {
        // ROUND_CEIL
        return levelPrice.toFixed(currentUnit, 2);
      } else if (type === 'bid') {
        // ROUND_FLOOR
        return levelPrice.toFixed(currentUnit, 3);
      } else {
        return levelPrice.toFixed(currentUnit);
      }
    }
    return '';
  }
  private filterQuantity(
    quantity: bigint,
    token0Decimals: number,
    tokenAmountUnit: number
  ): string {
    if (quantity) {
      return new BigNumber(quantity.toString(10))
        .div(10 ** token0Decimals)
        .toFixed(tokenAmountUnit);
    }
    return '';
  }
  private filterSide(orderPrice: OrderPrice): string {
    const quantity = orderPrice.quantity;
    if (
      (
        quantity as {
          Buy: [tokenAmount, icpPrice];
        }
      ).Buy
    ) {
      return 'Buy';
    } else {
      return 'Sell';
    }
  }
  private filterFilledMKT(order: TradingOrder): string {
    const side = this.filterSide(order.orderPrice);
    if (order.filled && order.filled.length) {
      if (side === 'Buy') {
        const total = (
          order.orderPrice.quantity as {
            Buy: [tokenAmount, icpPrice];
          }
        ).Buy[1];
        let filledTotal = BigInt(0);
        if (order.filled && order.filled.length) {
          filledTotal = order.filled.reduce((prev, cur) => {
            return BigInt(
              new BigNumber(prev.toString(10))
                .plus(cur.token1Value.DebitRecord.toString(10))
                .toString(10)
            );
          }, BigInt(0));
        }
        return (
          new BigNumber(filledTotal.toString(10))
            .div(total.toString(10))
            .times(100)
            .toFixed(2) + '%'
        );
      } else {
        const amount = (order.orderPrice.quantity as { Sell: bigint }).Sell;
        let filledAmount = BigInt(0);
        if (order.filled && order.filled.length) {
          filledAmount = order.filled.reduce((prev, cur) => {
            return BigInt(
              new BigNumber(prev.toString(10))
                .plus(cur.token0Value.DebitRecord.toString(10))
                .toString(10)
            );
          }, BigInt(0));
        }
        return (
          new BigNumber(filledAmount.toString(10))
            .div(amount.toString(10))
            .times(100)
            .toFixed(2) + '%'
        );
      }
    }
    return '0.00%';
  }
  private filterFilledPrice(
    total: string,
    amount: string,
    token1Decimals: number
  ): string {
    if (total && Number(amount)) {
      return new BigNumber(total).div(amount).toFixed(token1Decimals);
    }
    return '-';
  }
  private filterTotalFilled(
    filled: Array<OrderFilled>,
    type: string,
    token1Decimals: number
  ): string {
    let unit = token1Decimals;
    if (unit > 8) {
      unit = 8;
    }
    if (
      this.currentPair &&
      this.currentPair[2] &&
      this.currentPair[2].price &&
      Number(this.currentPair[2].price) >= 1 &&
      unit > 4
    ) {
      unit = 4;
    }
    if (filled && filled.length) {
      let filledTotal: bigint;
      if (type === 'Buy') {
        filledTotal = filled.reduce((prev, cur) => {
          return BigInt(
            new BigNumber(prev.toString(10))
              .plus(cur.token1Value.DebitRecord.toString(10))
              .toString(10)
          );
        }, BigInt(0));
      } else {
        filledTotal = filled.reduce((prev, cur) => {
          return BigInt(
            new BigNumber(prev.toString(10))
              .plus(cur.token1Value.CreditRecord.toString(10))
              .toString(10)
          );
        }, BigInt(0));
      }
      return new BigNumber(filledTotal.toString(10))
        .div(10 ** token1Decimals)
        .toFixed(unit);
    }
    return new BigNumber(0).div(10 ** token1Decimals).toFixed(unit);
  }
  private filterFilledAmount(
    filled: Array<OrderFilled>,
    type: string,
    token0Decimals: number,
    tokenMinUnit: number
  ): string {
    if (filled && filled.length) {
      let filledTotal: bigint;
      if (type === 'Buy') {
        filledTotal = filled.reduce((prev, cur) => {
          return BigInt(
            new BigNumber(prev.toString(10))
              .plus(cur.token0Value.CreditRecord.toString(10))
              .toString(10)
          );
        }, BigInt(0));
      } else {
        filledTotal = filled.reduce((prev, cur) => {
          return BigInt(
            new BigNumber(prev.toString(10))
              .plus(cur.token0Value.DebitRecord.toString(10))
              .toString(10)
          );
        }, BigInt(0));
      }
      return new BigNumber(filledTotal.toString(10))
        .div(10 ** token0Decimals)
        .toFixed(tokenMinUnit);
    }
    return new BigNumber(0).div(10 ** token0Decimals).toFixed(tokenMinUnit);
  }
  private filterFilled(
    filled: Array<OrderFilled>,
    type: string,
    amount: string,
    token0Decimals: number
  ): string {
    if (filled && filled.length) {
      let filledTotal: bigint;
      if (type === 'Buy') {
        filledTotal = filled.reduce((prev, cur) => {
          return BigInt(
            new BigNumber(prev.toString(10))
              .plus(cur.token0Value.CreditRecord.toString(10))
              .toString(10)
          );
        }, BigInt(0));
      } else {
        filledTotal = filled.reduce((prev, cur) => {
          return BigInt(
            new BigNumber(prev.toString(10))
              .plus(cur.token0Value.DebitRecord.toString(10))
              .toString(10)
          );
        }, BigInt(0));
      }
      return (
        new BigNumber(filledTotal.toString(10))
          .div(10 ** token0Decimals)
          .div(amount)
          .times(100)
          .toFixed(2) + '%'
      );
    }
    return '0.00%';
  }
  private formatTooltip(val: number): string {
    let current = 'buySlider';
    if (this.orderType === OrderTypeEnum.MKT) {
      current = 'buyMktSlider';
    }
    const customClassValue = document.querySelectorAll(
      '.' + current + ' .el-slider__marks-stop'
    );
    for (let i = 0; i < customClassValue.length; i++) {
      const left = parseInt((customClassValue[i] as any).style.left);
      if (left <= this[current]) {
        (customClassValue[i] as any).style.background = '#617B9A';
      } else {
        (customClassValue[i] as any).style.background = '#1B2531';
      }
    }
    return val + '%';
  }
  private formatTooltipSell(val: number): string {
    let current = 'sellSlider';
    if (this.orderType === OrderTypeEnum.MKT) {
      current = 'sellMktSlider';
    }
    const customClassValue = document.querySelectorAll(
      '.' + current + ' .el-slider__marks-stop'
    );
    for (let i = 0; i < customClassValue.length; i++) {
      const left = parseInt((customClassValue[i] as any).style.left);
      if (left <= this[current]) {
        (customClassValue[i] as any).style.background = '#617B9A';
      } else {
        (customClassValue[i] as any).style.background = '#1B2531';
      }
    }
    return val + '%';
  }
  private async getConfig(): Promise<void> {
    const currentPair = this.currentPair[0].toString();
    const res = await this.currentICDexService.orderExpirationDuration(
      currentPair
    );
    if (res && res.pairId === this.currentPair[0].toString()) {
      this.orderExpirationDuration = res.time;
      console.log('orderExpirationDuration');
      console.log(this.orderExpirationDuration);
    }
  }
}
</script>

<style scoped lang="scss">
.set-pool {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #adb3c4;
}
.icdex-mode {
  margin-top: 40px;
  ::v-deep .ant-checkbox-wrapper {
    color: #8c90a1;
  }
  ::v-deep .ant-checkbox-disabled + span {
    color: #8c90a1;
  }
}
.old-version {
  display: inline-block;
  margin: 0 0 5px 5px;
  color: #575d67 !important;
  font-size: 12px;
}
.opening-time {
  display: flex;
  align-items: center;
}
.balance-label {
  display: inline-block;
  width: 55px;
  text-align: left;
  font-size: 20px;
  transform: scale(0.5);
  transform-origin: left;
}
.balance-label-pro {
  width: 70px;
  white-space: nowrap;
}
.back-icon {
  cursor: pointer;
  padding-left: 10px;
  color: #adb7c2;
}
.trade-competitions-enum {
  display: flex;
  align-items: center;
  li {
    padding: 0 10px;
    color: #51b7c3;
    transition: all 0.35s;
    cursor: pointer;
    &.active {
      color: #51b7c3;
    }
  }
}
.order-book-tick-size {
  padding-right: 10px;
}
.order-book-tick-size-h5 {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #1f2b37;
  height: 25px;
  .order-book-tick-size-h5-current {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 5px;
  }
}
.fee-come {
  color: rgba(2, 192, 118, 0.5);
}
.swap-info-detail {
  display: inline-block;
  width: 36px;
}
.preparing-table {
  max-height: 336px;
  overflow-y: auto;
  -webkit-overflow-scrolling: auto;
  table {
    color: #8c98a5 !important;
    font-size: 12px;
  }
}
.preparing-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
  button {
    margin-left: 10px;
  }
}
.icdex-main-modal {
  height: calc(100vh - 64px);
  overflow: hidden;
}
.swap-transfer-list-header-updating-click {
  display: inline-block;
  height: 28px;
  width: 140px;
  margin-right: 20px;
  font-size: 12px;
}
.pending-status-td {
  display: flex;
  align-items: center;
  .Pending {
    color: #aab8c5;
  }
  .Closed,
  .Completed {
    color: #21c77d;
  }
  .Fail,
  .Blocking {
    color: #d13651;
  }
}
.loading-spinner {
  display: inline-block;
  background-image: url('../../../assets/img/loading.svg');
  background-repeat: no-repeat;
  background-size: 14px 14px;
  height: 14px;
  width: 14px;
  background-position: center;
  animation: loading-rotate 2s linear infinite;
  margin-left: 5px;
  color: #808a94;
}
.home-header {
  top: 14px;
}
.taker-fee {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
}
.de-swap-main {
  margin: 10px auto 0;
  max-width: 1500px;
  &.de-swap-main-trade-competitions-menu {
    height: 100%;
    overflow: hidden;
    .swap-transfer-list {
      height: 20px;
    }
  }
}
.swap-transfer-list {
  margin-top: 20px;
  background: #141b23;
  padding: 10px 20px;
  table {
    min-height: 120px;
    font-size: 12px;
    color: #808a94 !important;
    thead {
      tr {
        background: #141b23;
      }
    }
    tbody {
      tr {
        background: #141b23;
        border-bottom: 1px solid #212b35;
        &:last-child {
          border-bottom: none;
        }
      }
    }
    th {
      background: transparent !important;
      color: #646e79 !important;
    }
  }
  .swap-transfer-list-id {
    ::v-deep a {
      color: #3477b5 !important;
    }
  }
  ul {
    display: flex;
    color: #8c98a5;
    li {
      margin-right: 20px;
      padding: 10px 0;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      border-bottom: 2px solid transparent;
      &:hover {
        color: #adb7c2;
      }
      &.active {
        color: #adb7c2;
        border-color: #51b7c3;
      }
    }
  }
}
.k-interval-main {
  background: #141b23;
}
.trade-main-header {
  display: flex;
  background: #141b23;
  margin-top: 10px;
  padding: 20px;
  color: #8c90a1;
  > div {
    padding: 0 10px 10px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
    &.active {
      color: #51b7c3;
      border-color: #51b7c3;
    }
  }
}
.trade-item {
  display: flex;
  height: 285px;
  background: #141b23;
  padding: 0 20px;
  color: #8c90a1;
  .trade-item-pro-balance {
    display: flex;
    width: 100%;
  }
  .trade-item-pro-balance-left,
  .trade-item-pro-balance-right {
    width: 50%;
    > div {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      font-size: 12px;
      line-height: 22px;
    }
    .trade-item-pro-balance-label {
      display: inline-block;
      flex-shrink: 0;
      width: 95px;
      font-size: 12px;
      font-weight: bold;
    }
  }
  .trade-item-pro-balance-left {
    padding-right: 10px;
  }
  .trade-item-pro-balance-right {
    padding-left: 10px;
  }
  .trade-item-pro {
    width: 100%;
    margin-bottom: -20px;
    padding: 10px;
    line-height: 1.5;
    i {
      color: #5d6470;
      cursor: pointer;
    }
    .trade-item-pro-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 12px;
      height: 12px;
      border: 1px solid #5d6470;
      border-radius: 10px;
      i {
        font-size: 9px;
      }
    }
    .trade-item-pro-submit {
      position: absolute;
      bottom: 40px;
      left: 30px;
      right: 30px;
      p {
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 1.2;
      }
    }
  }
  .trade-item-pro-fee {
    margin-top: 10px;
  }
  .trade-item-pro-title {
    display: flex;
    align-items: baseline;
    span:first-child {
      font-weight: bold;
    }
  }
  &.has-register-competition {
    height: 311px;
  }
  &.show-stop-loss {
    height: 339px;
    &.has-register-competition {
      height: 365px;
    }
  }
  input {
    text-align: right;
    background: transparent !important;
  }
  button {
    height: 40px;
    border: none;
    color: #fff;
  }
  .buy-button {
    background: linear-gradient(to left, #21c77d 25%, #38a58f);
    .loading-spinner {
      margin-right: 5px;
      color: #ccc;
    }
  }
  .sell-button {
    background: linear-gradient(to left, #e03956 25%, #b73148);
    .loading-spinner {
      margin-right: 5px;
      color: #ccc;
    }
  }
}
.assets-wallet {
  display: flex;
  margin-left: auto;
  i {
    font-size: 12px;
    cursor: pointer;
    color: #5d6470;
    &:last-child {
      margin-left: 5px;
    }
    &:hover {
      color: #f5f5f5;
    }
  }
}
.trade-item-header {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  font-size: 12px;
  i {
    color: #5d6470;
  }
  .trade-item-header-pair-h5 {
    position: absolute;
    right: 0;
    text-align: right;
    font-size: 20px;
    transform: scale(0.5);
    transform-origin: right;
    width: calc(200% - 50px);
    i {
      font-size: 24px;
    }
    .loading-spinner {
      width: 24px;
      height: 24px;
      background-size: 24px 24px;
      margin-bottom: -5px;
    }
  }
}
.trade-main-competitions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  max-width: 1500px;
  margin: 0 auto;
  background: #0e0e11;
}
.trade-main {
  position: relative;
  margin: 0 10px;
  color: #727a87;
  .k-interval-main-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #000;
    height: 32px;
    &.h5-show {
      display: none;
    }
    .k-interval-main-header-name {
      font-size: 14px;
      color: #fff;
      padding: 0 20px;
    }
  }
  .k-interval-time {
    display: flex;
    align-items: center;
    height: 100%;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
    li {
      padding: 0 10px;
      cursor: pointer;
      font-size: 12px;
      color: #929aa5;
      span {
        display: inline-block;
        padding: 3px 5px;
        transition: all 0.3s;
      }
      &.active,
      &:hover {
        span {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
      }
    }
  }
  input {
    color: #adb7c2 !important;
    background: transparent !important;
  }
  .trade-main-buy {
    width: 50%;
    padding-right: 10px;
  }
  .trade-main-sell {
    width: 50%;
    padding-left: 10px;
  }
}
.swap-item-group {
  background: #1f2b37 !important;
  .suffix {
    color: #646e79;
    padding-right: 10px;
  }
}
.trade-market-sort {
  display: flex;
  align-items: center;
  height: 28px;
  margin-bottom: 5px;
  padding: 5px 10px 5px 0;
  color: #727a87;
  font-size: 12px;
  background: #0d1117;
  li {
    position: relative;
    z-index: 0;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    padding: 0 15px;
    border: 1px solid #242d38;
    transition: all 0.2s;
    &:first-child {
      &.active {
        z-index: 1;
        margin-right: -1px;
      }
    }
    &:nth-child(2) {
      &.active {
        z-index: 1;
        margin-left: -1px;
      }
    }
    &:hover {
      color: #fff;
    }
    &.active {
      color: #fff;
    }
    .base-red {
      position: absolute;
      top: -4px;
      font-size: 15px;
      transform: scale(0.4);
      transform-origin: left;
    }
  }
}
.de-swap-list {
  width: 280px;
  height: 702px;
  background: #141b23;
  margin-top: 0;
  &.has-register-competition {
    height: 728px;
    .de-swap-list-item {
      table tbody {
        &.de-swap-list-item-pair-trade {
          height: 200px;
        }
      }
    }
  }
  &.show-stop-loss {
    height: 756px;
    &.has-register-competition {
      height: 782px;
    }
  }
  .de-swap-list-trade-menu {
    height: 40px;
    border-top: 2px solid #000;
    li {
      line-height: 40px;
      padding: 0 10px;
      &.active {
        color: #adb7c2;
      }
    }
  }
  .de-swap-list-item {
    table tbody {
      display: block;
      height: 300px;
      overflow: hidden;
      /*overflow-y: scroll;*/
      /*&::-webkit-scrollbar {
        display: none;
      }*/
      &.de-swap-list-item-pair-trade {
        height: 180px;
        overflow-y: auto;
        -webkit-overflow-scrolling: auto;
        tr {
          height: 26px;
        }
      }
    }
    tbody.de-swap-list-item-pair {
      overflow-y: auto;
      -webkit-overflow-scrolling: auto;
      &.de-swap-list-item-pair-market {
        height: 387px;
        tr {
          height: 50px;
        }
      }
      tr.active {
        background: #1f2b37;
        color: #adb7c2;
      }
      td {
        vertical-align: top;
        &.usdt-test {
          padding-left: 20px;
          font-size: 20px;
          transform: scale(0.5);
          transform-origin: left;
        }
        dl {
          padding: 5px 0;
        }
        dt {
          padding-bottom: 5px;
        }
        dd {
          color: #5e6170;
        }
      }
    }
    .usdt-test-dt {
      padding-bottom: 10px !important;
      font-size: 20px;
      transform: scale(0.5);
      transform-origin: left top;
    }
    table thead,
    tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
      background: #141b23;
      color: #727a87;
      &.animation {
        animation: bg 2s ease-in-out;
      }
    }
    thead tr {
      background: #141b23;
    }
    tbody::-webkit-scrollbar {
      width: 4px;
      height: 1px;
    }
    tbody::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(213, 213, 213, 0.1);
      background: #b5b5b5;
    }
    /*tbody::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(213, 213, 213, 0.1);
      border-radius: 10px;
      background: #ededed !important;
    }*/
  }
}
.de-swap-level-10 {
  width: 280px;
  height: 702px;
  background: #141b23;
  margin-top: 0;
  padding: 10px 0;
  &.has-register-competition {
    height: 728px;
  }
  &.show-stop-loss {
    height: 756px;
    &.has-register-competition {
      height: 782px;
    }
  }
  .level100-body {
    display: block;
    overflow: hidden;
    max-height: 280px;
    &.all-level100 {
      max-height: 560px;
    }
  }
  tr {
    display: table;
    width: 100%;
    height: 28px !important;
    table-layout: fixed;
    background: #141b23;
    color: #727a87 !important;
  }
}
.swap-info-tooltip {
  font-size: 12px;
}
.de-swap-info {
  display: flex;
  table {
    font-size: 12px;
    color: #727a87;
    tr {
      height: 30px;
      cursor: pointer;
    }
    tbody {
      tr {
        color: #474d57;
      }
    }
    .current-icp-price {
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
  }
  .trade-main {
    flex: 1;
  }
}
.ask-price {
  color: #d13651;
}
.ask-pair-price {
  color: rgba(248, 73, 96, 0.5);
}
.bid-price {
  color: #21c77d;
}
.order-disabled {
  color: #727a87 !important;
}
.bid-pair-price {
  color: rgba(2, 192, 118, 0.5);
}
.css-1iztezc {
  width: 24px;
  cursor: pointer;
}
.order-book-type-list {
  display: flex;
  align-items: center;
  padding-left: 10px;
  svg {
    margin-right: 10px;
    opacity: 0.5;
    transition: all 0.3s;
    &.active {
      opacity: 1;
    }
  }
}
.token-price {
  margin-right: 10px;
  font-size: 18px;
  transition: all 0.3s;
  &.put {
    color: #d13651;
  }
  &.call {
    color: #21c77d;
  }
  i {
    font-size: 16px;
  }
}
.swap-item-group {
  margin-top: 20px;
  padding-left: 10px;
  &.swap-item-group-buy-slider {
    margin-top: 5px;
  }
  &.swap-item-group-error {
    border-color: #c6331d !important;
  }
  &.disabled {
    background: #313537 !important;
    cursor: default;
    color: #666;
  }
  input {
    &.input-icp-suffix {
      padding: 0 10px 0 0;
    }
    &:disabled {
      color: #666 !important;
      background: transparent !important;
      cursor: default;
    }
  }
}
.suffix {
  flex-shrink: 0;
  font-size: 12px;
}
.cancel-pending {
  cursor: pointer;
  font-size: 14px;
  color: #51b7c3;
  &.disabled {
    cursor: not-allowed;
    color: #646e79;
  }
}
.text-right {
  text-align: right;
}
.text-right-flex {
  justify-content: flex-end !important;
}
table {
  tr {
    th:first-child,
    td:first-child {
      padding-left: 10px;
    }
    th:last-child,
    td:last-child {
      padding-right: 10px;
    }
  }
}
#kInterval-chart {
  height: 270px;
  width: 100%;
}
.swap-info {
  span {
    vertical-align: middle;
  }
  a {
    color: #1996c4;
  }
}
.pagination {
  justify-content: flex-end;
  margin-top: 20px;
}
.empty {
  text-align: center;
  font-size: 14px;
}
@keyframes bg {
  0% {
    background-color: #141b23;
  }
  50% {
    background-color: #1e2428;
  }
  100% {
    background-color: #141b23;
  }
}
.trade-fee {
  color: #8c90a1;
}
.buy-slider {
  padding: 0 14px 0 6px;
  ::v-deep .el-slider__stop {
    width: 10px;
    height: 10px;
    top: -3px;
    background: #1b2531;
    border: 2px solid #283749;
    border-radius: 2px;
    transform: rotate(-45deg);
    &:hover {
      background: #435973;
      border-color: #283749;
    }
  }
  ::v-deep .el-slider__button-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    transform: translateX(-50%) rotate(-45deg);
    background: #1b2531;
    border-radius: 8px;
    &:hover {
      transform: translateX(-50%) rotate(-45deg);
    }
  }
  ::v-deep .el-slider__button {
    width: 14px;
    height: 14px;
    background: #1b2531;
    border: 3px solid #617b9b;
    border-radius: 4px;
    &:hover {
      transform: scale(1);
    }
  }
  ::v-deep .el-slider__runway {
    height: 4px;
    background: #283749;
  }
  ::v-deep .el-slider__bar {
    height: 4px;
    background: #435973;
  }
  ::v-deep .el-slider__button-wrapper {
    top: -9px;
  }
}
.order-filled {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.order-filled-color {
  color: #808a94;
}
.order-expire {
  height: 39px;
  padding: 12px 0 15px 0;
  font-size: 12px;
  text-align: center;
  background: #141b23;
}
.swap-transfer-list-header {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
  span {
    margin-left: auto;
    font-size: 12px;
    color: #8c90a1;
  }
}
table {
  color: #caced3 !important;
  th {
    background: #141b23 !important;
    color: #5e6170 !important;
    white-space: nowrap;
    font-size: 12px;
    text-align: left;
    .usdt-test {
      width: 200%;
      font-size: 20px;
      transform: scale(0.5);
      transform-origin: left;
    }
  }
}
.swap-transfer-list-time {
  color: #808a94;
}
.h5-show {
  display: none;
}
.can-click {
  cursor: pointer;
  color: #2b8cb0 !important;
}
.swap-transfer-list-header-fallback-click {
  width: 76px;
  height: 28px;
  margin-right: 10px;
}
.vol-h5 {
  font-size: 12px;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #000;
}
.icdex-main {
  position: relative;
  margin-top: 20px;
}
div.kInterval-chart-h5 {
  overflow: visible;
}
.withdraw-balance {
  margin-left: auto;
}
@media screen and (max-width: 1200px) {
  .trade-item {
    .trade-item-pro-balance-left,
    .trade-item-pro-balance-right {
      .trade-item-pro-balance-label {
        width: 70px;
        white-space: nowrap;
        transform: scale(0.5);
        transform-origin: left;
        font-size: 20px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .trade-item-pro-h5 {
    .trade-item-pro-submit {
      margin-top: 20px;
      p {
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 1.2;
      }
    }
    .trade-item-pro-balance-left,
    .trade-item-pro-balance-right {
      > div {
        display: flex;
        align-items: center;
        padding: 2px 0;
        font-size: 12px;
      }
    }
    .trade-item-pro-balance-right {
      margin-top: 10px;
    }
    .trade-item-pro {
      width: 100%;
      padding: 10px;
      background: #0f141a;
      border-radius: 5px;
      line-height: 1.5;
      i {
        color: #5d6470;
        cursor: pointer;
      }
      .trade-item-pro-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 12px;
        height: 12px;
        border: 1px solid #5d6470;
        border-radius: 10px;
        i {
          font-size: 9px;
        }
      }
    }
    .trade-item-pro-fee {
      margin-top: 10px;
    }
    .trade-item-pro-title {
      flex-direction: column;
      word-break: break-word;
    }
  }
  .trade-item-header {
    flex-wrap: wrap;
    margin-top: 15px;
    line-height: 1.2;
    font-size: 12px;
  }
  .withdraw-balance {
    font-size: 12px;
  }
  .balance-label {
    width: auto;
  }
  .swap-transfer-list-header-updating-click {
    display: none;
  }
  .home-header {
    ul {
      display: none;
    }
  }
  .vol-h5 {
    padding: 10px;
  }
  .pc-show {
    display: none !important;
  }
  .trade-main {
    .k-interval-main-header.h5-show {
      display: flex;
    }
  }
  .h5-show {
    display: flex;
    .k-interval-time {
      border: none;
    }
  }
  /*.trade-h5-button {
    padding: 20px 0;
  }*/
  .to-trade {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #06080b;
    border-top: 1px solid #1b242e;
    button {
      height: 40px;
      width: 40%;
      color: #fff;
    }
    dl {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 10px;
      color: #fff;
      dt {
        margin-bottom: 3px;
      }
      dd {
        margin-top: 3px;
      }
    }
  }
  .to-trade-buy {
    background: #21c77d;
  }
  .to-trade-sell {
    background: #d13651;
  }
  .swap-transfer-list {
    padding: 0;
    ul {
      background: #06080b;
      margin: 0 10px;
      overflow: scroll;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
      li {
        margin-right: 10px;
        flex-shrink: 0;
        font-size: 12px;
      }
    }
    .overflow-scroll {
      overflow: auto;
    }
  }
  #kInterval-chart {
    height: 268px;
    width: 100vw;
  }
  .kInterval-chart-h5-hide {
    width: 0;
    height: 0;
    overflow: hidden;
    &.kInterval-chart-h5 {
      height: 268px;
      width: 100%;
    }
  }
  .trade-main {
    margin: 0;
  }
  .k-interval-main-header-h5 {
    display: flex;
    align-items: flex-start;
    padding: 10px 15px;
    background: rgba(30, 32, 38, 0.5);
    border-bottom: 5px solid #000;
  }
  .k-interval-main-header-menu-h5 {
    margin-bottom: 10px;
    background: rgba(30, 32, 38, 0.5);
    ul {
      display: flex;
      align-items: center;
      color: #929aa5;
      justify-content: space-between;
      width: 100vw;
      padding: 0 5px;
      li {
        margin: 0;
        font-size: 12px;
        padding: 10px 0;
        border-bottom: 2px solid transparent;
        transition: all 0.3s;
        &.active {
          color: #fff;
          border-color: #51b7c3;
        }
      }
    }
  }
  .k-interval-main-header-h5-right {
    > div {
      display: flex;
      align-items: center;
      line-height: 20px;
      font-size: 12px;
      span {
        &:first-child {
          width: 100px;
          color: #929aa5;
        }
        &:last-child {
          margin-left: auto;
          color: #e6e8ea;
        }
      }
    }
  }
  .k-interval-main-header-h5-left {
    .k-interval-main-header-h5-left-name {
      height: 20px;
      color: #fff;
    }
    .current-icp-price {
      display: flex;
      flex-direction: column;
      .token-price {
        font-size: 20px;
      }
    }
  }
  .swap-transfer-list {
    padding-bottom: 100px;
  }
  .swap-transfer-list-header {
    margin-bottom: 0;
  }
  .swap-transfer-list-header-fallback {
    background: #06080b;
    .swap-transfer-list-header-fallback-span {
      align-items: center;
      i {
        padding: 0 10px 0 5px;
      }
    }
  }
  .market-trade-h5 {
    tbody {
      display: block;
      height: 260px;
      overflow-y: auto;
      -webkit-overflow-scrolling: auto;
    }
    tr {
      display: table;
      table-layout: fixed;
      width: 100%;
      height: 20px !important;
      background: transparent;
    }
    thead {
      display: table;
      width: 100%;
      table-layout: fixed;
      tr {
        height: 40px !important;
        th {
          color: #adb3c4 !important;
        }
      }
    }
    td {
      color: #88909b;
    }
  }
  .trade-h5,
  .pairs-h5 {
    position: fixed;
    /*top: calc(100vh - 485px);*/
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    height: 100%;
    width: 100%;
    background: #141b23;
    overflow: auto;
    max-height: 100%;
    /*animation: move 0.5s ease;
    animation-fill-mode: none;*/
    .pairs-h5-header {
      display: flex;
      align-items: center;
      padding: 10px;
      color: #e6e8ea;
      span {
        font-size: 16px;
      }
      i {
        font-size: 16px;
      }
      .set-pool {
        margin-left: 10px;
        font-size: 14px;
      }
    }
  }
  .pairs-h5 {
    max-height: 460px;
  }
  .pairs-h5-content {
    height: 460px;
  }
  .trade-h5-focusin {
    top: -156px;
    max-height: none;
  }
  .trade-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .trade-h5 {
    display: block;
    height: auto;
    padding: 0;
    .trade-h5-content {
      width: 100%;
      height: 485px;
      padding: 0 10px;
      input {
        text-align: center;
      }
      input::-webkit-input-placeholder {
        font-size: 14px !important;
        color: #646e79 !important;
      }
      input:-moz-placeholder {
        font-size: 14px !important;
        color: #646e79 !important;
      }
      input::-moz-placeholder {
        font-size: 14px !important;
        color: #646e79 !important;
      }
      input:-ms-input-placeholder {
        font-size: 14px !important;
        color: #646e79 !important;
      }
    }
    .taker-fee {
      flex-direction: column;
      align-items: flex-start;
      span {
        margin-left: 0;
      }
    }
    .trade-h5-content-main {
      display: flex;
    }
    .trade-h5-content-left {
      width: 55%;
    }
    .trade-h5-content-right {
      width: 45%;
      padding-left: 10px;
    }
    .current-icp-price-trade-h5 {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 5px 0;
      span {
        margin: 0;
        font-size: 12px;
        line-height: 20px;
        &.token-price {
          font-size: 16px;
        }
      }
    }
    .trade-h5-content-order {
      font-family: Arial, sans-serif;
      font-variant-numeric: tabular-nums;
      display: flex;
      flex-direction: column;

      margin-top: 10px;
      height: calc(100% - 67px);
      ul {
        display: flex;
        align-items: center;
        flex-basis: 5%;
        li {
          font-size: 12px;
          &:last-child {
            margin-left: auto;
            text-align: right;
          }
        }
      }
    }
    .trade-h5-content-right-header {
      ul {
        display: flex;
        li {
          line-height: 16px;
          font-size: 12px;
          &:last-child {
            margin-left: auto;
            text-align: right;
          }
        }
      }
      dt {
        font-weight: normal;
      }
    }
    .buy-slider-h5 {
      margin: 15px 0;
      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 24px;
          width: 22%;
          background: #2b2f36;
          color: #929aa5;
          font-size: 12px;
          &.active {
            background: #51b7c3;
            color: #fff;
          }
        }
      }
    }
    .pairs-h5-header {
      padding: 15px 0;
    }
    .trade-main-header {
      margin: 0;
      padding: 15px 0 0;
    }
    .trade-main-header-type {
      width: 100%;
      height: 30px;
      text-align: center;
      padding: 0;
      ::v-deep .ant-select-selection--single {
        height: 30px;
      }
    }
    .trade-h5-header {
      ul {
        display: flex;
        align-items: center;
        width: 100%;
        background: #2b2f36;
        color: #929aa5;
        border-radius: 5px;
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50%;
          height: 32px;
          &:first-child {
            border-radius: 5px 0 0 5px;
          }
          &:last-child {
            border-radius: 0 5px 5px 0;
          }
          &.trade-buy {
            background: #21c77d;
            color: #fff;
          }
          &.trade-sell {
            background: #d13651;
            color: #fff;
          }
        }
      }
    }
  }
  /*@keyframes move {
    0% {
      top: 100vh;
    }
    100% {
      top: calc(100vh - 460px);
    }
  }*/
  .pairs-h5 {
    tr {
      height: 30px !important;
      background: transparent;
      td {
        color: #88909b;
        font-size: 12px;
      }
    }
    table {
      height: calc(100% - 83px);
    }
    .de-swap-list-item-pair {
      display: block;
      height: calc(100% - 40px);
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: auto;
      tr {
        display: table;
        width: 100%;
        table-layout: fixed;
        height: 35px !important;
        &.active {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
    thead {
      tr {
        display: table;
        width: 100%;
        table-layout: fixed;
        height: 40px !important;
        th {
          color: #adb3c4 !important;
        }
      }
    }
  }
  .order-book-h5 {
    display: flex;
    align-items: flex-start;
    .order-book-h5-table {
      width: 50%;
      min-height: auto;
      &.all-level100-disabled {
        display: none;
      }
      &.all-level100 {
        width: 100%;
      }
      .table-flex {
        display: flex;
        height: 20px !important;
        background: transparent;
        font-size: 12px;
        > div {
          display: flex;
          align-items: center;
          flex: 1;
          margin: 5px 5px 5px 10px;
          color: #88909b;
        }
      }
      .table-flex-header {
        height: 40px !important;
        > div {
          color: #adb3c4 !important;
        }
      }
    }
  }
  .order-book-type-list {
    > div {
      padding: 5px 15px 3px;
      background: transparent;
      &.active {
        background: #2b2f36;
      }
      svg {
        margin-right: 0;
      }
    }
  }
  .pending-h5 {
    .order-filled {
      flex-direction: row;
    }
    ul {
      flex-direction: column;
      background: #141b23;
      li {
        width: 100%;
        margin-right: 0;
        border-bottom: 1px solid #000;
        &:last-child {
          border-bottom: none;
        }
        > div {
          padding: 5px 0;
        }
      }
      &.pending-h5-pro {
        flex-direction: row;
        li {
          width: auto;
          padding-bottom: 5px;
          margin-right: 10px;
          border-bottom: 1px solid transparent;
          &.active {
            border-color: #51b7c3;
          }
          &:last-child {
            border-bottom: 1px solid transparent;
          }
        }
      }
    }
  }
  .pending-header-h5 {
    display: flex;
    color: #8c98a5;
  }
  .pending-item {
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    &.pending-item-pro {
      .pending-item-left {
        font-size: 13px;
        color: #fff;
      }
    }
    &.pending-item-pro-item {
      .pending-item-left {
        padding-left: 5px;
      }
    }
    .pending-item-left {
      color: #929aa5;
    }
    .pending-item-right {
      margin-left: auto;
      text-align: right;
      color: #caced3;
    }
  }
  .text-center {
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  .order-book-type-list-h5 {
    height: 300px;
    overflow: hidden;
  }
}
.history-status {
  &.Fail {
    color: #d13651;
  }
  &.Completed,
  &.PartiallyCompletedAndCancelled {
    color: #21c77d;
  }
}
</style>
<style lang="scss">
.adopted-countdown {
  line-height: 1;
  .ant-statistic-content {
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
}
</style>
