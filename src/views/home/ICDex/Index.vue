<template>
  <div class="icdex-main" :class="{ 'icdex-main-modal': showTrade }">
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
            'show-stop-limit': orderType === 'Stop-limit'
          }"
        >
          <div class="de-swap-list-item">
            <div
              ref="deSwapListmenu"
              @mouseleave="marketMenuVisible = false"
              class="de-swap-list-item-search base-font-title"
            >
              <a-icon
                theme="filled"
                type="star"
                class="pointer"
                :class="{
                  'base-font-normal': currentTradeMarketSort === 'Star'
                }"
                style="margin-right: 4px; font-size: 13px"
                @click.stop="changeStarMenu"
              />
              <svg
                t="1717654043106"
                class="icon pointer"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4440"
                width="36"
                height="16"
                style="margin-right: 5px"
                @click.stop="changeHotMenu"
              >
                <path
                  d="M423.477333 938.666667S45.045333 855.424 214.186667 442.282667c0 0 38.4 45.909333 33.12 68 0 0 30.101333-104.277333 95.072-166.570667C398.165333 290.186667 454.848 139.712 402.570667 85.333333c0 0 258.933333 54.378667 287.754666 326.378667 0 0 33.12-86.666667 101.12-95.232 0 0-20.906667 47.616 0 119.04 0 0 214.485333 367.146667-155.157333 491.242667 0 0 110.805333-125.813333-124.181333-341.717334 0 0-55.402667 115.626667-88.533334 156.373334-0.096 0.106667-92.522667 103.722667-0.096 197.248z"
                  :fill="`${
                    currentTradeMarketSort === 'Hot' && !isMarket
                      ? '#ffffff'
                      : '#adb3c4'
                  }`"
                  p-id="4441"
                ></path>
              </svg>
              <a-tooltip
                :getPopupContainer="() => $refs.deSwapListmenu"
                :visible="marketMenuVisible"
                :overlayStyle="{ padding: 0 }"
                overlayClassName="market-menu-tooltip"
                trigger="click"
                @click.stop="(selectMarket = false), (marketMenuVisible = true)"
              >
                <template slot="title">
                  <div @mouseleave="marketMenuVisible = false">
                    <div
                      class="user-setting base-bg-box user-setting-account"
                      :class="{
                        active:
                          currentMarketMenu === item.value &&
                          currentTradeMarketSort !== 'Star' &&
                          isMarket
                      }"
                      v-for="(item, index) in marketMenu"
                      :key="index"
                      @click.stop="changeMarketMenu(item)"
                    >
                      <span style="font-size: 13px">
                        {{ item.name }}
                      </span>
                    </div>
                  </div>
                </template>
                <a-tooltip placement="topRight" :visible="selectMarket">
                  <template slot="title"> Select Market </template>
                  <div
                    @mouseenter="selectMarket = true"
                    @mouseleave="selectMarket = false"
                    @click.stop="marketMenuVisible = true"
                    class="flex-center pointer base-font-title"
                    :class="[
                      !isMarket ? 'base-font-title' : 'base-font-normal'
                    ]"
                  >
                    <a-icon style="font-size: 12px" type="menu" />
                    <span style="margin: 0 2px; font-size: 13px">{{
                      currentMarketMenu
                    }}</span>
                  </div>
                </a-tooltip>
              </a-tooltip>
              <a-tooltip placement="top">
                <template slot="title">
                  <div
                    style="padding: 10px 0; color: #8c90a1"
                    class="base-font-title"
                  >
                    <div style="margin-bottom: 10px; font-size: 14px">
                      Listing on ICDex is an open and uncensored process so
                      anyone can list a token on ICDex. You, the trader, bear
                      all responsibility for assessing and valuing the tokens
                      being traded on ICDex and accept responsibility for any
                      consequences of these trades.
                    </div>
                    <div style="margin-bottom: 10px; font-size: 14px">
                      Pair Score is an automatic evaluation mechanism of ICDex
                      for trading pairs, which is based on the comprehensive
                      evaluation of the number of sponsors, liquidity, volume,
                      etc. It is for your reference only, and is not considered
                      as investment advice, endorsement, or a form of guarantee.
                    </div>
                    <div style="margin-bottom: 10px; font-size: 14px">
                      The list of trading pairs is divided into three boards
                      according to the Pair Score but as always its important to
                      note every asset carries risks and you’re advised to do
                      your own due diligence before trading.
                    </div>
                    <div style="margin-bottom: 5px">
                      <span class="dots"></span> "Main" (STAGE2): Pairings in
                      the "Main" category should not only
                      <a
                        href="https://medium.com/@ICLighthouse/a-guide-to-listing-tokens-on-icdex-25e1efae1471"
                        target="_blank"
                        style="color: #51b7c3"
                        >meet the criteria outlined in our listing article</a
                      >, they also have a combination of strong user engagement
                      (high trade volumes), high liquidity, and typically a high
                      level of trust within the IC ecosystem.
                    </div>
                    <div style="margin-bottom: 5px">
                      <span class="dots"></span> "Rising" (STAGE1): Pairings
                      which make it into the “Rising” category have reasonable
                      and consistent levels of trading activity and liquidity
                      and are growing in trust and popularity in the ecosystem.
                    </div>
                    <div style="margin-bottom: 5px">
                      <span class="dots"></span> "High Risk" (STAGE0): "High
                      Risk" pairings are pairs where traders will likely want to
                      proceed with higher levels of scrutiny and caution.
                      <div>
                        New pairings and/or pairings which typically have low
                        liquidity and low trade volumes will be placed in this
                        category.
                      </div>
                      <div>
                        This ranking does not necessarily mean a project is bad
                        or that you shouldn’t trade it at all, however it’s
                        recommended you take extra precautions before trading.
                        Over time, projects which eventually grow to meet the
                        criteria for a higher pair score are able to move to a
                        higher ranking.
                      </div>
                    </div>
                  </div>
                </template>
                <span style="font-size: 12px; flex-shrink: 0; margin: 0 10px">
                  <a-icon type="question-circle" />
                </span>
              </a-tooltip>
              <a-input
                allowClear
                autocomplete="off"
                type="text"
                placeholder="Search"
                v-model="pairSearch"
                @change="pairSearchChange"
                @focus="pairSearchChange"
              >
                <a-icon style="color: #adb3c4" slot="prefix" type="search" />
              </a-input>
            </div>
            <ul class="trade-market-sort" v-show="isMarket">
              <li
                :class="[
                  currentTradeMarketSort === 'Star' && item.value === 'Star'
                    ? 'show-sort'
                    : 'hide-sort',
                  currentTradeMarketSort !== 'Star' && item.value !== 'Star'
                    ? 'show-sort'
                    : 'hide-sort',
                  item.value === currentTradeMarketSort ? 'active' : '',
                  item.value === 'Old' ? 'trade-market-old' : '',
                  item.value
                ]"
                v-for="item in tradeMarketSort"
                :key="item.value"
                @click="changeTradeMarketSort(item)"
              >
                <a-icon
                  v-show="
                    currentTradeMarketSort === 'Star' && item.value === 'Star'
                  "
                  type="star"
                  theme="filled"
                />
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>
                      <span v-show="item.value === 'Main'">Main</span>
                      <span v-show="item.value === 'Second'">Rising</span>
                      <span v-show="item.value === 'Third'">Higher Risk</span>
                      <span v-show="item.value === 'Hot'">Hot</span>
                      Pairings</span
                    >
                  </template>
                  <span
                    :class="{ 'trade-market-old-main': item.value === 'Main' }"
                    v-show="
                      currentTradeMarketSort !== 'Star' &&
                      item.value !== 'Star' &&
                      item.value !== 'Old'
                    "
                  >
                    <span
                      v-show="item.value !== 'Hot'"
                      class="circle"
                      :class="[
                        item.value === 'Main'
                          ? 'STAGE2'
                          : item.value === 'Second'
                          ? 'STAGE1'
                          : 'STAGE0'
                      ]"
                    ></span>
                    {{ item.name }}
                  </span>
                </a-tooltip>
                <span v-if="item.value === 'Old'">
                  {{ item.name }}
                </span>
                <span
                  v-if="item.value === 'USDC' || item.value === 'USDT'"
                  class="base-red"
                  >TEST</span
                >
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
                v-if="currentTradeMarketSort"
              >
                <tr v-if="currentTradeMarketSort === 'Third' && !showThird">
                  <td colspan="3" style="line-height: 1.5; padding-left: 10px">
                    The trading pairs on the High Risk mean that very few
                    traders are involved and there may be a higher risk. Sure
                    you want to show the list?
                    <button class="mt20 w100" @click="showThird = true">
                      Confirm
                    </button>
                  </td>
                </tr>
                <tr
                  v-if="
                    currentTradeMarketSort === 'Main' &&
                    !tradePairs[currentTradeMarketSort].length
                  "
                >
                  <td colspan="3" style="line-height: 1.5; padding-left: 10px">
                    There are no pairs on the MAIN Pairings. Check out the
                    <span
                      @click="
                        changeTradeMarketSort({
                          name: 'SECOND',
                          value: 'Second'
                        })
                      "
                      style="color: #51b7c3"
                      >Rising</span
                    >
                    Pairings.
                  </td>
                </tr>
                <RecycleScroller
                  v-if="currentTradeMarketSort !== 'Star'"
                  ref="deSwapListItemPair"
                  style="height: 336px"
                  :items="pairsScroll"
                  :item-size="50"
                  :buffer="800"
                >
                  <tr
                    slot-scope="{ item, index }"
                    @click="changePair(item.pair, index)"
                    :class="{
                      active:
                        !(currentTradeMarketSort === 'Third' && !showThird) &&
                        currentPairIndex !== null &&
                        pairs[currentPairIndex] &&
                        (currentPair[3] === currentTradeMarketSort ||
                          !item.pair[1][0].marketBoard) &&
                        item.pair[1][0].canisterId.toString() ===
                          currentPair[1][0].canisterId.toString(),
                      draggable: item.pair[3] === 'Star'
                    }"
                  >
                    <a-tooltip
                      :overlayClassName="
                        drag ||
                        item.pair[1][0].token1[0].toString() ===
                          'hhaaz-2aaaa-aaaaq-aacla-cai'
                          ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                          : 'order-book-type-list-tooltip'
                      "
                      placement="right"
                    >
                      <template slot="title">
                        <dl>
                          <dt>
                            <span
                              class="tabular-nums"
                              v-if="
                                tokens &&
                                tokens[item.pair[1][0].token1[0].toString()] &&
                                item.pair[2]
                              "
                            >
                              24h: ${{
                                item.pair[2].vol24h.value1 |
                                  icpToUsdt(
                                    currentMarketPrice,
                                    item.pair[1][0].token1[1],
                                    tokens[item.pair[1][0].token1[0].toString()]
                                      .decimals
                                  ) |
                                  formatNum
                              }}
                            </span>
                          </dt>
                          <dd>
                            <span
                              class="tabular-nums"
                              v-if="
                                tokens &&
                                tokens[item.pair[1][0].token1[0].toString()] &&
                                item.pair[2]
                              "
                            >
                              Total: ${{
                                item.pair[2].totalVol.value1 |
                                  icpToUsdt(
                                    currentMarketPrice,
                                    item.pair[1][0].token1[1],
                                    tokens[item.pair[1][0].token1[0].toString()]
                                      .decimals
                                  ) |
                                  formatNum
                              }}
                            </span>
                          </dd>
                        </dl>
                      </template>
                      <div
                        style="display: table; width: 100%; table-layout: fixed"
                        v-if="
                          !(currentTradeMarketSort === 'Third' && !showThird)
                        "
                      >
                        <td style="width: 100px">
                          <dl>
                            <dt
                              :class="{
                                'usdt-test-dt':
                                  currentTradeMarketSort === 'USDC' ||
                                  currentTradeMarketSort === 'USDT'
                              }"
                            >
                              <a-tooltip placement="right">
                                <template slot="title">
                                  <span v-if="showReminder2(item.pair)">
                                    REMINDER: This trading pair with a score
                                    below the Main Pairings requirement for
                                    {{ getMainDay(item.pair) }} days may be
                                    downgraded to the Rising Pairings.
                                  </span>
                                  <span v-if="showReminder1(item.pair)">
                                    REMINDER: This trading pair with a score
                                    below the Rising Pairings requirement for
                                    {{ getSecondDay(item.pair) }} days may be
                                    downgraded to the Higher Risk Pairings.
                                  </span>
                                </template>
                                <span
                                  v-if="
                                    (item.pair && showReminder1(item.pair)) ||
                                    showReminder2(item.pair)
                                  "
                                  style="opacity: 0.8; color: #727a87"
                                  class="pair-name"
                                >
                                  * {{ item.pair[1][0].token0[1]
                                  }}<span class="pair-icp"
                                    >/{{ item.pair[1][0].token1[1] }}</span
                                  >
                                </span>
                              </a-tooltip>
                              <span
                                v-if="
                                  item.pair &&
                                  !showReminder1(item.pair) &&
                                  !showReminder2(item.pair)
                                "
                                class="pair-name"
                              >
                                {{ item.pair[1][0].token0[1]
                                }}<span class="pair-icp"
                                  >/{{ item.pair[1][0].token1[1] }}</span
                                >
                              </span>
                            </dt>
                            <dd>
                              <a-icon
                                v-show="
                                  !oldPairs.includes(item.pair[0].toString()) &&
                                  item.pair[1][0].marketBoard
                                "
                                :theme="
                                  star.includes(item.pair[0].toString())
                                    ? 'filled'
                                    : 'outlined'
                                "
                                @click.stop="onStar(item.pair)"
                                type="star"
                                :class="{
                                  'base-font-title': star.includes(
                                    item.pair[0].toString()
                                  )
                                }"
                              />
                              <span
                                v-show="
                                  oldPairs.includes(item.pair[0].toString())
                                "
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
                                  tokens[
                                    item.pair[1][0].token0[0].toString()
                                  ] &&
                                  tokens[
                                    item.pair[1][0].token1[0].toString()
                                  ] &&
                                  item.pair[2]
                                "
                              >
                                {{
                                  item.pair[2].price |
                                    filterPairTokenPrice(
                                      tokens[
                                        item.pair[1][0].token0[0].toString()
                                      ].decimals,
                                      tokens[
                                        item.pair[1][0].token1[0].toString()
                                      ].decimals
                                    )
                                }}
                              </span>
                            </dt>
                            <dd>
                              <span
                                :class="{
                                  'bid-pair-price':
                                    Number(item.pair[2].change24h) > 0,
                                  'ask-pair-price':
                                    Number(item.pair[2].change24h) < 0
                                }"
                                class="tabular-nums"
                                v-if="item.pair[2]"
                              >
                                {{ item.pair[2].change24h | filterChange }}%
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
                                  tokens[
                                    item.pair[1][0].token1[0].toString()
                                  ] &&
                                  item.pair[2]
                                "
                              >
                                {{
                                  item.pair[2].vol24h.value1 |
                                    bigintToFloat(
                                      2,
                                      tokens[
                                        item.pair[1][0].token1[0].toString()
                                      ].decimals
                                    ) |
                                    formatNum
                                }}
                              </span>
                            </dt>
                            <dd>
                              <span
                                class="tabular-nums"
                                v-if="
                                  tokens &&
                                  tokens[
                                    item.pair[1][0].token1[0].toString()
                                  ] &&
                                  item.pair[2]
                                "
                              >
                                {{
                                  item.pair[2].totalVol.value1 |
                                    bigintToFloat(
                                      2,
                                      tokens[
                                        item.pair[1][0].token1[0].toString()
                                      ].decimals
                                    ) |
                                    formatNum
                                }}
                              </span>
                            </dd>
                          </dl>
                        </td>
                      </div>
                    </a-tooltip>
                  </tr>
                </RecycleScroller>
                <draggable
                  v-if="currentTradeMarketSort === 'Star'"
                  @start="draggableStar"
                  @end="draggableEnd"
                  v-model="tradePairs[currentTradeMarketSort]"
                  v-bind="dragOptions"
                  draggable=".draggable"
                >
                  <transition-group
                    type="transition"
                    :name="!drag ? 'flip-list' : null"
                  >
                    <tr
                      v-for="(pair, index) in tradePairs[
                        currentTradeMarketSort
                      ]"
                      :key="pair[1][0].canisterId.toString()"
                      @click="changePair(pair, index)"
                      :class="{
                        active:
                          !(currentTradeMarketSort === 'Third' && !showThird) &&
                          currentPairIndex !== null &&
                          pairs[currentPairIndex] &&
                          (currentPair[3] === currentTradeMarketSort ||
                            !pair[1][0].marketBoard) &&
                          pair[1][0].canisterId.toString() ===
                            currentPair[1][0].canisterId.toString(),
                        draggable: pair[3] === 'Star'
                      }"
                    >
                      <a-tooltip
                        :overlayClassName="
                          drag ||
                          pair[1][0].token1[0].toString() ===
                            'hhaaz-2aaaa-aaaaq-aacla-cai'
                            ? 'order-book-type-list-tooltip hide-order-book-type-list-tooltip'
                            : 'order-book-type-list-tooltip'
                        "
                        placement="right"
                      >
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
                                  pair[2].vol24h.value1 |
                                    icpToUsdt(
                                      currentMarketPrice,
                                      pair[1][0].token1[1],
                                      tokens[pair[1][0].token1[0].toString()]
                                        .decimals
                                    ) |
                                    formatNum
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
                                  pair[2].totalVol.value1 |
                                    icpToUsdt(
                                      currentMarketPrice,
                                      pair[1][0].token1[1],
                                      tokens[pair[1][0].token1[0].toString()]
                                        .decimals
                                    ) |
                                    formatNum
                                }}
                              </span>
                            </dd>
                          </dl>
                        </template>
                        <div
                          style="
                            display: table;
                            width: 100%;
                            table-layout: fixed;
                          "
                          v-if="
                            !(currentTradeMarketSort === 'Third' && !showThird)
                          "
                        >
                          <td style="width: 100px">
                            <dl>
                              <dt
                                :class="{
                                  'usdt-test-dt':
                                    currentTradeMarketSort === 'USDC' ||
                                    currentTradeMarketSort === 'USDT'
                                }"
                              >
                                <a-tooltip placement="right">
                                  <template slot="title">
                                    <span v-if="showReminder2(pair)">
                                      REMINDER: This trading pair with a score
                                      below the Main Pairings requirement for
                                      {{ getMainDay(pair) }} days may be
                                      downgraded to the Rising Pairings.
                                    </span>
                                    <span v-if="showReminder1(pair)">
                                      REMINDER: This trading pair with a score
                                      below the Rising Pairings requirement for
                                      {{ getSecondDay(pair) }} days may be
                                      downgraded to the Higher Risk Pairings.
                                    </span>
                                  </template>
                                  <span
                                    v-if="
                                      (pair && showReminder1(pair)) ||
                                      showReminder2(pair)
                                    "
                                    style="opacity: 0.8; color: #727a87"
                                    class="pair-name"
                                  >
                                    * {{ pair[1][0].token0[1]
                                    }}<span class="pair-icp"
                                      >/{{ pair[1][0].token1[1] }}</span
                                    >
                                  </span>
                                </a-tooltip>
                                <span
                                  v-if="
                                    pair &&
                                    !showReminder1(pair) &&
                                    !showReminder2(pair)
                                  "
                                  class="pair-name"
                                >
                                  {{ pair[1][0].token0[1]
                                  }}<span class="pair-icp"
                                    >/{{ pair[1][0].token1[1] }}</span
                                  >
                                </span>
                              </dt>
                              <dd>
                                <a-icon
                                  v-show="
                                    !oldPairs.includes(pair[0].toString()) &&
                                    pair[1][0].marketBoard
                                  "
                                  :theme="
                                    star.includes(pair[0].toString())
                                      ? 'filled'
                                      : 'outlined'
                                  "
                                  @click.stop="onStar(pair)"
                                  type="star"
                                  :class="{
                                    'base-font-title': star.includes(
                                      pair[0].toString()
                                    )
                                  }"
                                />
                                <span
                                  v-show="oldPairs.includes(pair[0].toString())"
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
                                    pair[2].price |
                                      filterPairTokenPrice(
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
                                    'bid-pair-price':
                                      Number(pair[2].change24h) > 0,
                                    'ask-pair-price':
                                      Number(pair[2].change24h) < 0
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
                                    pair[2].vol24h.value1 |
                                      bigintToFloat(
                                        2,
                                        tokens[pair[1][0].token1[0].toString()]
                                          .decimals
                                      ) |
                                      formatNum
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
                                    pair[2].totalVol.value1 |
                                      bigintToFloat(
                                        2,
                                        tokens[pair[1][0].token1[0].toString()]
                                          .decimals
                                      ) |
                                      formatNum
                                  }}
                                </span>
                              </dd>
                            </dl>
                          </td>
                        </div>
                      </a-tooltip>
                    </tr>
                  </transition-group>
                </draggable>
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
                        item[2] |
                          filterLatestPrice(
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
                        Object.values(item[2].token0Value)[0] |
                          filterLatestAmount(
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
              <span class="k-interval-main-header-name" v-if="currentPair">
                <a-tooltip placement="top">
                  <template slot="title"
                    >{{ currentPair[1][0].token0[1] }}({{
                      currentPair[1][0].token0[0].toString()
                    }})</template
                  >
                  <span>
                    <a-icon
                      v-show="
                        !oldPairs.includes(currentPair[0].toString()) &&
                        currentPair[1][0].marketBoard
                      "
                      :theme="
                        star.includes(currentPair[0].toString())
                          ? 'filled'
                          : 'outlined'
                      "
                      @click.stop="onStar(currentPair)"
                      type="star"
                      :class="{
                        'base-font-title': !star.includes(
                          currentPair[0].toString()
                        )
                      }"
                    />
                    {{ currentPair[1][0].token0[1] }}/{{
                      currentPair[1][0].token1[1]
                    }}
                  </span></a-tooltip
                >
                <a-tooltip placement="top">
                  <template slot="title">
                    <div class="base-font-title">
                      {{
                        Object.keys(currentPair[1][0].marketBoard)[0] ===
                        'STAGE2'
                          ? 'Main'
                          : Object.keys(currentPair[1][0].marketBoard)[0] ===
                            'STAGE1'
                          ? 'Rising'
                          : 'Higher Risk'
                      }}
                      Pairings
                    </div>
                  </template>
                  <span
                    class="pair-stage"
                    :class="Object.keys(currentPair[1][0].marketBoard)[0]"
                    v-if="currentPair && currentPair[1][0].marketBoard"
                  >
                    {{
                      Object.keys(currentPair[1][0].marketBoard)[0] === 'STAGE2'
                        ? 'M'
                        : Object.keys(currentPair[1][0].marketBoard)[0] ===
                          'STAGE1'
                        ? 'R'
                        : 'H'
                    }}
                  </span>
                </a-tooltip>
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
                  <span
                    v-if="
                      !(
                        item === 'Pools' &&
                        currentPair &&
                        prePairs.includes(currentPair[0].toString())
                      )
                    "
                    >{{ item }}</span
                  >
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
                    class="pair-stage"
                    :class="Object.keys(currentPair[1][0].marketBoard)[0]"
                    v-if="currentPair && currentPair[1][0].marketBoard"
                  >
                    {{
                      Object.keys(currentPair[1][0].marketBoard)[0] === 'STAGE2'
                        ? 'M'
                        : Object.keys(currentPair[1][0].marketBoard)[0] ===
                          'STAGE1'
                        ? 'R'
                        : 'H'
                    }}
                  </span>
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
                      currentPair[2].vol24h.value1 |
                        bigintToFloat(
                          2,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        ) |
                        formatNum
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
                  <span
                    v-if="
                      !(
                        item === 'Pools' &&
                        currentPair &&
                        prePairs.includes(currentPair[0].toString())
                      )
                    "
                    >{{ item }}</span
                  >
                </li>
                <!--<li
                  @click="changeTradeCompetitionsMenu('Competitions')"
                  :class="{ active: tradeCompetitionsMenu === 'Competitions' }"
                >
                  <span>Competitions</span>
                </li>-->
              </ul>
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
                          'usdt-test':
                            currentTradeMarketSort === 'USDC' ||
                            currentTradeMarketSort === 'USDT'
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
                          'usdt-test':
                            currentTradeMarketSort === 'USDC' ||
                            currentTradeMarketSort === 'USDT'
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
                          item[2] |
                            filterLatestPrice(
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
                          Object.values(item[2].token0Value)[0] |
                            filterLatestAmount(
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
                  <span v-if="item === orderTypeEnum['Stop-limit']"
                    >When the price reaches the stop price, the stop-limit order
                    is executed to buy or sell at the limit price.</span
                  >
                </template>
                <span
                  v-if="
                    !(
                      item === 'Stop-limit' &&
                      currentPair &&
                      prePairs.includes(currentPair[0].toString())
                    )
                  "
                >
                  {{ item }}
                </span>
              </a-tooltip>
            </div>
            <div
              v-if="
                currentPair && !prePairs.includes(currentPair[0].toString())
              "
              :class="{ active: 'Pro' === orderType }"
            >
              <a-tooltip placement="top">
                <template slot="title">
                  Professional orders are an advanced way of placing orders. It
                  is only recommended for professional traders.
                </template>
                <span @click="showProOrderMenu"> Pro-order </span>
              </a-tooltip>
              <!--<a-dropdown placement="bottomCenter">
                <a-tooltip placement="top">
                  <template slot="title">
                    Professional orders are an advanced way of placing orders.
                    It is only recommended for professional traders.
                  </template>
                  <span
                    >{{ orderType === 'Pro' ? currentProOrderMenu : 'Pro' }}
                    <a-icon type="caret-down"
                  /></span>
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
              </a-dropdown>-->
            </div>
            <mining-info
              v-if="currentPair"
              :current-pair-id="currentPair[0].toString()"
              style="padding: 0 5px 0 0 !important; border: none"
              class="margin-left-auto trading-mining"
            ></mining-info>
            <a-icon
              v-show="
                currentPair && !prePairs.includes(currentPair[0].toString())
              "
              class="set-pool"
              :class="{ disabled: orderType === 'Pro' }"
              type="setting"
              @click="showPoolVisible"
            />
          </div>
          <div
            class="trade-item pc-show"
            :class="{
              'has-register-competition': showKeepBalance,
              'show-stop-limit': orderType === 'Stop-limit'
            }"
          >
            <div v-show="orderType !== 'Pro'" class="trade-main-buy">
              <div class="trade-item-header">
                <span
                  class="balance-label"
                  :class="{ 'balance-label-wallet': !showKeepBalance }"
                  >Wallet:</span
                >
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
                          .includes('usdc') ||
                        currentPair[1][0].token1[1]
                          .toLocaleLowerCase()
                          .includes('usdt') ||
                        currentPair[1][0].token1[1]
                          .toLocaleLowerCase()
                          .includes('test')
                      "
                      :to="`/icRouter?type=mint&token=${currentPair[1][0].token1[0].toString()}`"
                      >{{
                        tokensBalance[currentPair[1][0].token1[0].toString()] |
                          bigintToFloat(
                            Math.min(
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              8
                            ),
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          ) |
                          formatNum
                      }}<span
                        >&nbsp;{{ currentPair[1][0].token1[1] }}
                        <span
                          class="old-icl-type"
                          v-show="
                            currentPair[1][0].token0[0].toString() === oldICL
                          "
                          >drc20</span
                        ></span
                      >
                    </router-link>
                  </a-tooltip>
                  <span
                    v-if="
                      !currentPair[1][0].token1[1]
                        .toLocaleLowerCase()
                        .includes('usdc') &&
                      !currentPair[1][0].token1[1]
                        .toLocaleLowerCase()
                        .includes('usdt') &&
                      !currentPair[1][0].token1[1]
                        .toLocaleLowerCase()
                        .includes('test')
                    "
                  >
                    {{
                      tokensBalance[currentPair[1][0].token1[0].toString()] |
                        bigintToFloat(
                          Math.min(
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            8
                          ),
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        ) |
                        formatNum
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
                <span class="balance-label"
                  >TraderAcct&nbsp;
                  <a-tooltip placement="top">
                    <template slot="title">
                      <div>
                        TraderAccount: In general trading with "Keeping balance
                        in TraderAccount" enabled, the Trader deposits funds in
                        the TraderAccount of the pair for faster trading. The
                        relationship between the "Accounts" is shown in the
                        diagram:
                        <img
                          style="margin-top: 10px"
                          src="@/assets/img/account.png"
                          alt=""
                          class="w100"
                        />
                      </div> </template
                    ><a-icon type="info-circle" /></a-tooltip
                  >:</span
                >
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
                      keepingBalance[currentPair[1][0].token1[0].toString()] |
                        filterKeepingBalance(
                          stopLimitNeed.token1,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          8
                        ) |
                        formatNum
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
                <!--<a-tooltip placement="top">
                  <template slot="title">
                    <span
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                    >
                      Stop-limit orders:
                      {{
                        stopLimitNeed.token1
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
                    v-if="stopLimitNeed.token1"
                    type="info-circle"
                  />
                </a-tooltip>-->
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
                    <span v-if="currentMarketPrice['']"
                      >≈ ${{
                        stopBuyPrice |
                          filterBuyPrice(token0Price, currentTokenPrice) |
                          formatNum
                      }}</span
                    >
                  </template>
                  <a-input-group
                    v-if="orderType === 'Stop-limit'"
                    :class="{
                      'swap-item-group-error':
                        isToBuy && (!stopBuyPrice || Number(stopBuyPrice) === 0)
                    }"
                    class="swap-item-group"
                    compact
                  >
                    <span class="suffix">Stop limit</span>
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
                    <span
                      >≈ ${{
                        buyPrice |
                          filterBuyPrice(token0Price, currentTokenPrice) |
                          formatNum
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
                    <span class="suffix">Order price</span>
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
                    <span class="suffix">Order quantity</span>
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
                    <span
                      >≈ ${{
                        buyTotal |
                          filterBuyPrice(token0Price, currentTokenPrice) |
                          formatNum
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
                <div
                  class="taker-fee"
                  :class="{ 'taker-fee-stop': orderType === 'Stop-limit' }"
                >
                  <span
                    v-if="
                      orderType === 'Stop-limit' &&
                      currentPair &&
                      sysConfig &&
                      tokens &&
                      tokens[sysConfig.sysToken.toString()] &&
                      stoConfig &&
                      dexRole
                    "
                  >
                    <span>Fee: (Create)</span>
                    <span v-show="dexRole.vipMaker"> 0 </span>
                    <span v-show="!dexRole.vipMaker">
                      {{
                        stoConfig.sloFee1 |
                          bigintToFloat(
                            tokens[sysConfig.sysToken.toString()].decimals,
                            tokens[sysConfig.sysToken.toString()].decimals
                          )
                      }}
                    </span>
                    <span
                      >{{ tokens[sysConfig.sysToken].symbol }}, (Update)</span
                    >
                    <span v-show="dexRole.vipMaker"> 0 </span>
                    <span v-show="!dexRole.vipMaker">
                      {{
                        stoConfig.sloFee1 |
                          stoUpdateFee(
                            tokens[sysConfig.sysToken.toString()].decimals
                          )
                      }}
                    </span>
                    <span>
                      {{ tokens[sysConfig.sysToken.toString()].symbol }},
                      (Order) {{ stoConfig.sloFee2 | stoOrderFee }} + taker
                      {{ currentPair | filterFee }}
                      or maker
                      {{ feeRebate | filterFeeSellRebate }}.
                    </span>
                  </span>
                  <span v-show="orderType !== 'Stop-limit'"
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
                      (pairInfo &&
                        pairInfo.paused &&
                        (isIDOPaused ||
                          (!isIDOPaused && orderType !== 'FOK')) &&
                        debugPairs &&
                        ((debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] !==
                            getPrincipalId) ||
                          !debugPairs[currentPair[0].toString()])) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()])) ||
                      (orderType === 'Stop-limit' &&
                        !(isKeeping && isPoolMode)) ||
                      currentPair[3] === 'Old'
                    "
                    class="buy-button w100 mt20"
                    :class="{
                      'taker-fee-stop-button': orderType === 'Stop-limit'
                    }"
                    @click="onBuy"
                  >
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        (isIDOPaused ||
                          (!isIDOPaused && orderType !== 'FOK')) &&
                        !(debugPairs && debugPairs[currentPair[0].toString()])
                      "
                    >
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
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        debugPairs[currentPair[0].toString()] &&
                        debugPairs[currentPair[0].toString()] !== getPrincipalId
                      "
                    >
                      Under maintenance
                    </span>
                    <span
                      v-if="
                        !(
                          pairInfo &&
                          pairInfo.paused &&
                          (isIDOPaused || (!isIDOPaused && orderType !== 'FOK'))
                        ) ||
                        (debugPairs &&
                          debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] ===
                            getPrincipalId)
                      "
                    >
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Buy&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                        <span
                          v-show="
                            currentPair[1][0].token0[0].toString() === oldICL
                          "
                          >(drc20)</span
                        >
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
                    <span v-show="!buyTotalMKTError"
                      >≈ ${{
                        buyTotalMKT |
                          filterBuyPrice(token0Price, currentTokenPrice) |
                          formatNum
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
                      (pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        ((debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] !==
                            getPrincipalId) ||
                          !debugPairs[currentPair[0].toString()])) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()])) ||
                      currentPair[3] === 'Old'
                    "
                    class="buy-button w100 mt20"
                    @click="onBuyMKT"
                  >
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        (isIDOPaused ||
                          (!isIDOPaused && orderType !== 'MKT')) &&
                        !(debugPairs && debugPairs[currentPair[0].toString()])
                      "
                    >
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
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        debugPairs[currentPair[0].toString()] &&
                        debugPairs[currentPair[0].toString()] !== getPrincipalId
                      "
                    >
                      Under maintenance
                    </span>
                    <span
                      v-if="
                        !(
                          pairInfo &&
                          pairInfo.paused &&
                          (isIDOPaused || (!isIDOPaused && orderType !== 'MKT'))
                        ) ||
                        (debugPairs &&
                          debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] ===
                            getPrincipalId)
                      "
                    >
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Buy&nbsp;
                        <span
                          >{{ currentPair[1][0].token0[1] }}
                          <span
                            v-show="
                              currentPair[1][0].token0[0].toString() === oldICL
                            "
                            >(drc20)</span
                          ></span
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
            </div>
            <div v-show="orderType !== 'Pro'" class="trade-main-sell">
              <div class="trade-item-header">
                <span
                  class="balance-label"
                  :class="{ 'balance-label-wallet': !showKeepBalance }"
                  >Wallet:</span
                >
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
                          .includes('usdc') ||
                        currentPair[1][0].token0[1]
                          .toLocaleLowerCase()
                          .includes('usdt') ||
                        currentPair[1][0].token0[1]
                          .toLocaleLowerCase()
                          .includes('test')
                      "
                      :to="`/icRouter?type=mint&token=${currentPair[1][0].token0[0].toString()}`"
                    >
                      {{
                        tokensBalance[currentPair[1][0].token0[0].toString()] |
                          bigintToFloat(
                            Math.min(
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              8
                            ),
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          ) |
                          formatNum
                      }}<span
                        >&nbsp;{{ currentPair[1][0].token0[1] }}
                        <span
                          class="old-icl-type"
                          v-show="
                            currentPair[1][0].token0[0].toString() === oldICL
                          "
                          >drc20</span
                        ></span
                      >
                    </router-link>
                  </a-tooltip>
                  <span
                    v-if="
                      !currentPair[1][0].token0[1]
                        .toLocaleLowerCase()
                        .includes('usdc') &&
                      !currentPair[1][0].token0[1]
                        .toLocaleLowerCase()
                        .includes('usdt') &&
                      !currentPair[1][0].token0[1]
                        .toLocaleLowerCase()
                        .includes('test')
                    "
                  >
                    {{
                      tokensBalance[currentPair[1][0].token0[0].toString()] |
                        bigintToFloat(
                          Math.min(
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            8
                          ),
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        ) |
                        formatNum
                    }}&nbsp;{{ currentPair[1][0].token0[1] }}
                    <span
                      class="old-icl-type"
                      v-show="currentPair[1][0].token0[0].toString() === oldICL"
                      >drc20</span
                    >
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
                <span class="balance-label"
                  >TraderAcct&nbsp;
                  <a-tooltip placement="top">
                    <template slot="title">
                      <div>
                        TraderAccount: In general trading with "Keeping balance
                        in TraderAccount" enabled, the Trader deposits funds in
                        the TraderAccount of the pair for faster trading. The
                        relationship between the "Accounts" is shown in the
                        diagram:
                        <img
                          style="margin-top: 10px"
                          src="@/assets/img/account.png"
                          alt=""
                          class="w100"
                        />
                      </div> </template
                    ><a-icon type="info-circle" /></a-tooltip
                  >:</span
                >
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
                      keepingBalance[currentPair[1][0].token0[0].toString()] |
                        filterKeepingBalance(
                          stopLimitNeed.token0,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          8
                        ) |
                        formatNum
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
                <!--<a-tooltip placement="top">
                  <template slot="title">
                    <span
                      v-if="
                        currentPair &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                    >
                      Stop-limit orders:
                      {{
                        stopLimitNeed.token0
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
                    v-if="stopLimitNeed.token0"
                    type="info-circle"
                  />
                </a-tooltip>-->
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
                    <span
                      >≈ ${{
                        stopSellPrice |
                          filterBuyPrice(token0Price, currentTokenPrice) |
                          formatNum
                      }}</span
                    >
                  </template>
                  <a-input-group
                    v-if="orderType === 'Stop-limit'"
                    :class="{
                      'swap-item-group-error':
                        isToSell &&
                        (!stopSellPrice || Number(stopSellPrice) === 0)
                    }"
                    class="swap-item-group"
                    compact
                  >
                    <span class="suffix">Stop limit</span>
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
                    <span
                      >≈ ${{
                        sellPrice |
                          filterBuyPrice(token0Price, currentTokenPrice) |
                          formatNum
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
                    <span class="suffix">Order price</span>
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
                    <span class="suffix">Order quantity</span>
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
                    <span
                      >≈ ${{
                        sellTotal |
                          filterBuyPrice(token0Price, currentTokenPrice) |
                          formatNum
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
                <div
                  class="taker-fee"
                  :class="{ 'taker-fee-stop': orderType === 'Stop-limit' }"
                >
                  <span
                    v-if="
                      orderType === 'Stop-limit' &&
                      currentPair &&
                      sysConfig &&
                      tokens &&
                      tokens[sysConfig.sysToken.toString()] &&
                      stoConfig &&
                      dexRole
                    "
                  >
                    Fee: (Create)
                    <span v-show="dexRole.vipMaker"> 0 </span>
                    <span v-show="!dexRole.vipMaker">
                      {{
                        stoConfig.sloFee1 |
                          bigintToFloat(
                            tokens[sysConfig.sysToken.toString()].decimals,
                            tokens[sysConfig.sysToken.toString()].decimals
                          )
                      }}
                    </span>
                    {{ tokens[sysConfig.sysToken].symbol }}, (Update)
                    <span v-show="dexRole.vipMaker"> 0 </span>
                    <span v-show="!dexRole.vipMaker">
                      {{
                        stoConfig.sloFee1 |
                          stoUpdateFee(
                            tokens[sysConfig.sysToken.toString()].decimals
                          )
                      }}
                    </span>
                    {{ tokens[sysConfig.sysToken.toString()].symbol }}, (Order)
                    {{ stoConfig.sloFee2 | stoOrderFee }} + taker
                    {{ currentPair | filterFee }}
                    or maker
                    {{ feeRebate | filterFeeSellRebate }}.
                  </span>
                  <span v-show="orderType !== 'Stop-limit'"
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
                    :class="{
                      'taker-fee-stop-button': orderType === 'Stop-limit'
                    }"
                    :disabled="
                      (pairInfo &&
                        pairInfo.paused &&
                        (isPaused || (!isPaused && orderType !== 'LMT')) &&
                        debugPairs &&
                        ((debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] !==
                            getPrincipalId) ||
                          !debugPairs[currentPair[0].toString()])) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()])) ||
                      (orderType === 'Stop-limit' &&
                        !(isKeeping && isPoolMode)) ||
                      currentPair[3] === 'Old'
                    "
                    @click="onSell"
                  >
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        (isPaused || (!isPaused && orderType !== 'LMT')) &&
                        !(debugPairs && debugPairs[currentPair[0].toString()])
                      "
                    >
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
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        debugPairs[currentPair[0].toString()] &&
                        debugPairs[currentPair[0].toString()] !== getPrincipalId
                      "
                    >
                      Under maintenance
                    </span>
                    <span
                      v-if="
                        !(
                          pairInfo &&
                          pairInfo.paused &&
                          (isPaused || (!isPaused && orderType !== 'LMT'))
                        ) ||
                        (debugPairs &&
                          debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] ===
                            getPrincipalId)
                      "
                    >
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Sell&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                        <span
                          v-show="
                            currentPair[1][0].token0[0].toString() === oldICL
                          "
                          >(drc20)</span
                        >
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
                      (pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        ((debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] !==
                            getPrincipalId) ||
                          !debugPairs[currentPair[0].toString()])) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()])) ||
                      currentPair[3] === 'Old'
                    "
                    @click="onSellMKT"
                  >
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        !(debugPairs && debugPairs[currentPair[0].toString()])
                      "
                    >
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
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        debugPairs[currentPair[0].toString()] &&
                        debugPairs[currentPair[0].toString()] !== getPrincipalId
                      "
                    >
                      Under maintenance
                    </span>
                    <span
                      v-if="
                        !(pairInfo && pairInfo.paused) ||
                        (debugPairs &&
                          debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] ===
                            getPrincipalId)
                      "
                    >
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Sell&nbsp;
                        <span
                          >{{ currentPair[1][0].token0[1] }}
                          <span
                            v-show="
                              currentPair[1][0].token0[0].toString() === oldICL
                            "
                            >(drc20)</span
                          ></span
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
            </div>
            <div
              v-show="orderType === 'Pro'"
              class="trade-item-pro"
              style="background: #181f29; border: 2px solid #10151c"
            >
              <div
                style="
                  background: #10151c;
                  margin: -10px -10px 0 -10px;
                  padding: 0 10px;
                "
                class="base-font-title trade-item-pro-title"
              >
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
                class="base-tip-size base-font"
                style="
                  line-height: 1;
                  background: #10151c;
                  margin: 0 -10px;
                  padding: 0 10px;
                "
              >
                The Pro-Wallet account is a separate sub-account, please
                transfer tokens to this account before you can create strategy
                orders.
              </div>
              <div
                style="
                  background: #10151c;
                  margin: 0 -10px;
                  padding: 5px 10px 0 10px;
                "
              >
                Balance:
              </div>
              <div
                style="
                  background: #10151c;
                  margin: 0 -10px;
                  padding: 0 10px 5px;
                "
                class="trade-item-pro-balance"
              >
                <div class="trade-item-pro-balance-left">
                  <div>
                    <span class="trade-item-pro-balance-label"
                      >Pro-Wallet:</span
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
                      style="line-height: 14px"
                    >
                      {{
                        tokensBalanceSto[
                          currentPair[1][0].token1[0].toString()
                        ] |
                          bigintToFloat(
                            Math.min(
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              4
                            ),
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          ) |
                          formatNum
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
                      >Pro-Wallet:</span
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
                      style="line-height: 14px"
                    >
                      {{
                        tokensBalanceSto[
                          currentPair[1][0].token0[0].toString()
                        ] |
                          bigintToFloat(
                            Math.min(
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              4
                            ),
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          ) |
                          formatNum
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
                </div>
              </div>
              <div class="trade-item-pro-balance">
                <div>Strategy worktop:</div>
                <div
                  style="margin-top: 5px"
                  class="trade-item-pro-balance-right"
                >
                  <div>
                    <span class="trade-item-pro-balance-label"
                      >Pro-TraderAcct
                      <a-tooltip placement="top">
                        <template slot="title">
                          <div>
                            Pro-TraderAccount: In order to realize fast trading
                            with Pro-Orders, Pro-Trader must deposit and keep
                            funds in the account on trading pair. You can
                            withdraw funds from Pro-TraderAccount back to
                            Pro-Wallet. In pro-trading, the Pro-Trader deposits
                            funds in the Pro-TraderAccount of the pair for
                            faster trading. The relationship between the
                            "Accounts" is shown in the diagram:
                            <img
                              style="margin-top: 10px"
                              src="@/assets/img/account.png"
                              alt=""
                              class="w100"
                            />
                          </div> </template
                        ><a-icon type="info-circle" /></a-tooltip
                      >:
                    </span>
                    <span
                      v-if="
                        currentPair &&
                        keepingBalanceSto[
                          currentPair[1][0].token1[0].toString()
                        ] &&
                        tokens &&
                        tokens[currentPair[1][0].token1[0].toString()]
                      "
                      style="line-height: 14px"
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
                            ] |
                              bigintToFloat(
                                Math.min(
                                  tokens[currentPair[1][0].token1[0].toString()]
                                    .decimals,
                                  4
                                ),
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals
                              ) |
                              formatNum
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
                  <div>
                    <span class="trade-item-pro-balance-label"
                      >Pro-TraderAcct
                      <a-tooltip placement="top">
                        <template slot="title">
                          <div>
                            Pro-TraderAccount: In order to realize fast trading
                            with Pro-Orders, Pro-Trader must deposit and keep
                            funds in the account on trading pair. You can
                            withdraw funds from Pro-TraderAccount back to
                            Pro-Wallet. In pro-trading, the Pro-Trader deposits
                            funds in the Pro-TraderAccount of the pair for
                            faster trading. The relationship between the
                            "Accounts" is shown in the diagram:
                            <img
                              style="margin-top: 10px"
                              src="@/assets/img/account.png"
                              alt=""
                              class="w100"
                            />
                          </div> </template
                        ><a-icon type="info-circle" /></a-tooltip
                      >:
                    </span>
                    <span
                      v-if="
                        currentPair &&
                        keepingBalanceSto[
                          currentPair[1][0].token0[0].toString()
                        ] &&
                        tokens &&
                        tokens[currentPair[1][0].token0[0].toString()]
                      "
                      style="line-height: 14px"
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
                            ] |
                              bigintToFloat(
                                Math.min(
                                  tokens[currentPair[1][0].token0[0].toString()]
                                    .decimals,
                                  4
                                ),
                                tokens[currentPair[1][0].token0[0].toString()]
                                  .decimals
                              ) |
                              formatNum
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
                <p class="base-font base-tip-size" style="line-height: 1.2">
                  Pro-orders only use the balance of traderAccount and multiple
                  pro-orders share this balance.
                </p>
              </div>
              <div class="trade-item-pro-submit">
                <div class="pro-order-button">
                  <button
                    v-if="pairInfo && pairInfo.paused"
                    type="button"
                    disabled
                  >
                    Paused
                  </button>
                  <button
                    v-else
                    v-for="item in proOrderEnum"
                    :key="item"
                    type="button"
                    class="primary"
                    :disabled="pairInfo && pairInfo.paused"
                    @click="onCreateProOrder(item)"
                  >
                    Create {{ item }} Order
                  </button>
                </div>
                <p class="base-font base-tip-size pro-orders-note">
                  Note: Pro-orders do not always fully execute the strategy when
                  prices fluctuate dramatically, or during busy times.
                </p>
              </div>
            </div>
          </div>
          <div class="order-expire pc-show" v-if="orderExpirationDuration">
            <span v-show="orderType !== 'Pro' && orderType !== 'Stop-limit'">
              The pending order will expire after
              {{ orderExpirationDuration | filterMaxCache }} days.
            </span>
          </div>
        </div>
        <div
          class="de-swap-level-10 pc-show"
          :class="{
            'has-register-competition': showKeepBalance,
            'show-stop-limit': orderType === 'Stop-limit'
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
                      'usdt-test':
                        currentTradeMarketSort === 'USDC' ||
                        currentTradeMarketSort === 'USDT'
                    }"
                    class="font-10"
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
                      'usdt-test':
                        currentTradeMarketSort === 'USDC' ||
                        currentTradeMarketSort === 'USDT'
                    }"
                    class="font-10"
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
                <td style="padding-left: 10px" colspan="3">
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
                    <span
                      v-if="
                        currentPair &&
                        currentPair[1][0].token1[0].toString() !==
                          'hhaaz-2aaaa-aaaaq-aacla-cai'
                      "
                      >≈ ${{ token0Price }}</span
                    >
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
          class="swap-transfer-list-header swap-transfer-list-header-fallback swap-transfer-list-header-fallback-trades"
        >
          <ul>
            <li
              :class="{ active: item.value === currentTradesMenu }"
              v-for="(item, index) in tradesMenu"
              :key="index"
              @click="changeTradesMenu(item.value)"
            >
              <span
                v-if="
                  !(
                    item.value === 'pro' &&
                    currentPair &&
                    prePairs.includes(currentPair[0].toString())
                  )
                "
              >
                {{ item.name }}
              </span>
            </li>
          </ul>
          <button
            type="button"
            class="swap-transfer-list-header-fallback-click"
            @click="showFallback"
          >
            Fallback
          </button>
          <span class="pc-show">
            <span v-show="currentTradesMenu === 'std'"
              >Notes: Settlement is async after order has been filled, check
              your balance later.</span
            >
            <span v-show="currentTradesMenu === 'pro'"
              >Notes: Pro-orders do not always fully execute the strategy when
              prices fluctuate dramatically, or during busy times.</span
            >
          </span>
          <span class="h5-show swap-transfer-list-header-fallback-span">
            <a-tooltip placement="top">
              <template slot="title">
                <span v-show="currentTradesMenu === 'std'"
                  >Notes: Settlement is async after order has been filled, check
                  your balance later.</span
                >
                <span v-show="currentTradesMenu === 'pro'"
                  >Notes: Pro-orders do not always fully execute the strategy
                  when prices fluctuate dramatically, or during busy
                  times.</span
                >
              </template>
              <a-icon type="exclamation-circle" />
            </a-tooltip>
          </span>
        </div>
        <div class="std-lint-menu" v-show="currentTradesMenu === 'std'">
          <ul>
            <li
              :class="{ active: menu.value === currentTradeMenu }"
              v-for="(menu, index) in tradeMenu"
              :key="index"
              @click="changeTradeMenu(menu.value)"
            >
              <span
                v-if="
                  !(
                    menu.value === 'stop' &&
                    currentPair &&
                    prePairs.includes(currentPair[0].toString())
                  )
                "
              >
                {{ menu.name }}
                <span v-if="menu.value === 'stop'"
                  >({{ stopOrders.length }})</span
                >
              </span>
            </li>
          </ul>
        </div>
        <div
          class="base-font vol-h5"
          v-show="currentTradesMenu === 'std' && currentTradeMenu === 'pending'"
        >
          Stats:
          <span
            v-if="
              currentPair &&
              tokens &&
              tokens[currentPair[1][0].token0[0].toString()]
            "
          >
            {{
              pendingList |
                filterPendingToken0 |
                bigintToFloat(
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
              buyUnit.toString()
            "
          >
            {{
              pendingList |
                filterPendingToken1(
                  unit,
                  buyUnit,
                  tokenMinUnit,
                  tokens[currentPair[1][0].token0[0].toString()].decimals,
                  tokens[currentPair[1][0].token1[0].toString()].decimals
                ) |
                bigintToFloat(
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
        <div
          class="base-font vol-h5"
          v-show="currentTradesMenu === 'std' && currentTradeMenu === 'history'"
        >
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
              userLiquidity.vol.value0 |
                bigintToFloat(
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
              userLiquidity.vol.value1 |
                bigintToFloat(
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
        <div
          class="std-lint-menu"
          v-show="!isH5 && currentTradesMenu === 'pro'"
        >
          <ul>
            <li
              :class="{ active: menu.value === currentTradeMenuPro }"
              v-for="(menu, index) in tradeMenuPro"
              :key="index"
              @click="changeTradeMenuPro(menu.value)"
            >
              {{ menu.name }}
              <span v-if="menu.value === 'orders'"
                >({{ proOrders.length }})</span
              >
            </li>
          </ul>
          <div
            class="overflow-scroll"
            v-show="
              currentTradesMenu === 'pro' && currentTradeMenuPro === 'orders'
            "
          >
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Soid</th>
                  <th>Type</th>
                  <th>Strategy</th>
                  <th>Triggered trades</th>
                  <th>Status</th>
                  <th>Last trigger</th>
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
                  <td style="line-height: 1.5">
                    <div v-if="Object.keys(item.stType)[0] === 'GridOrder'">
                      <div>
                        Price range:
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            buyUnit.toString()
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
                        ~
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            buyUnit.toString()
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
                        Grid spread:
                        <span
                          v-if="
                            Object.keys(
                              item.strategy.GridOrder.setting.spread
                            )[0] === 'Geom'
                          "
                        >
                          {{
                            item.strategy.GridOrder.setting.spread.Geom |
                              filterPpm
                          }}
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
                            buyUnit.toString()
                          "
                        >
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
                          <span>{{
                            tokens[currentPair[1][0].token1[0].toString()]
                              .symbol
                          }}</span>
                        </span>
                      </div>
                      <div class="base-font-title">
                        Grid order quantity:
                        <span
                          v-if="
                            Object.keys(
                              item.strategy.GridOrder.setting.amount
                            )[0] === 'Percent'
                          "
                        >
                          <span
                            v-if="
                              item.strategy.GridOrder.setting.amount.Percent
                                .length
                            "
                            >{{
                              item.strategy.GridOrder.setting.amount
                                .Percent[0] | filterPpm
                            }}
                            <a-tooltip placement="top">
                              <template slot="title">
                                Percentage of available balance in TradeAccount
                                for pro-trader.
                              </template>
                              <a-icon type="info-circle" />
                            </a-tooltip>
                          </span>
                          <span v-else>-</span>
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
                            item.strategy.GridOrder.setting.amount.Token0 |
                              bigintToFloat(
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
                            item.strategy.GridOrder.setting.amount.Token1 |
                              bigintToFloat(
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
                      <div
                        v-if="
                          unit &&
                          buyUnit.toString() &&
                          currentPair &&
                          tokens &&
                          tokens[currentPair[1][0].token0[0].toString()]
                        "
                      >
                        Middle grid:
                        <span
                          v-if="
                            item.strategy.GridOrder.gridPrices.midPrice.length
                          "
                        >
                          {{
                            filterLevelPrice(
                              item.strategy.GridOrder.gridPrices.midPrice[0],
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              buyUnit
                            )
                          }}
                        </span>
                        <span v-else>-</span>
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
                        Period:
                        <span>
                          {{
                            item.strategy.IcebergOrder.setting.startingTime |
                              formatDateToMinuteFilter
                          }}
                          ~
                          {{
                            item.strategy.IcebergOrder.setting.endTime |
                              formatDateToMinuteFilter
                          }}
                        </span>
                      </div>
                      <div>
                        <span
                          v-show="
                            Object.keys(
                              item.strategy.IcebergOrder.setting.totalLimit
                            )[0] === 'Token0'
                          "
                          >Total quantity:</span
                        >
                        <span
                          v-show="
                            Object.keys(
                              item.strategy.IcebergOrder.setting.totalLimit
                            )[0] === 'Token1'
                          "
                          >Total amount:</span
                        >
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokenMinUnit.toString()
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
                          (Filed:
                          {{
                            filterFiledPro(
                              item,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              tokenMinUnit,
                              buyUnit
                            )
                          }})
                          {{
                            tokens[currentPair[1][0].token0[0].toString()]
                              .symbol
                          }}
                        </span>
                      </div>
                      <!-- <div>
                        Total amount:
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
                      </div>-->
                      <div class="base-font-title">
                        order price:
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            buyUnit.toString()
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
                      <div class="base-font-title">
                        order quantity:
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokenMinUnit.toString()
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
                    <div
                      v-if="
                        Object.keys(item.stType)[0] === 'TWAP' ||
                        Object.keys(item.stType)[0] === 'VWAP'
                      "
                    >
                      <div>
                        Side:
                        <span>
                          {{
                            Object.keys(
                              Object.values(item.strategy)[0].setting.order.side
                            )[0]
                          }}
                        </span>
                      </div>
                      <div>
                        Period:
                        <span>
                          {{
                            Object.values(item.strategy)[0].setting
                              .startingTime | formatDateToMinuteFilter
                          }}
                          ~
                          {{
                            Object.values(item.strategy)[0].setting.endTime |
                              formatDateToMinuteFilter
                          }}
                        </span>
                      </div>
                      <div v-if="Object.keys(item.stType)[0] === 'TWAP'">
                        Trigger interval:
                        <span>
                          {{
                            getDuration(
                              item.strategy.TWAP.setting.triggerInterval
                            )
                          }}
                        </span>
                      </div>
                      <div v-if="Object.keys(item.stType)[0] === 'VWAP'">
                        trigger vol change:
                        <span
                          v-if="
                            Object.keys(
                              item.strategy.VWAP.setting.triggerVol
                            )[0] === 'Geom'
                          "
                        >
                          {{
                            item.strategy.VWAP.setting.triggerVol.Geom |
                              filterPpm
                          }}
                          <a-tooltip placement="top">
                            <template slot="title">
                              {{
                                item.strategy.VWAP.setting.triggerVol.Geom |
                                  filterPpm
                              }}
                              of volume in the last 24 hours.
                            </template>
                            <a-icon type="info-circle" />
                          </a-tooltip>
                        </span>
                        <span
                          v-if="
                            Object.keys(
                              item.strategy.VWAP.setting.triggerVol
                            )[0] === 'Arith' &&
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals &&
                            buyUnit.toString()
                          "
                        >
                          {{
                            Object.values(
                              item.strategy.VWAP.setting.triggerVol
                            )[0] |
                              bigintToFloat(
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
                      <div>
                        <span
                          v-show="
                            Object.keys(
                              Object.values(item.strategy)[0].setting.totalLimit
                            )[0] === 'Token0'
                          "
                          >Total quantity:</span
                        >
                        <span
                          v-show="
                            Object.keys(
                              Object.values(item.strategy)[0].setting.totalLimit
                            )[0] === 'Token1'
                          "
                          >Total amount:</span
                        >
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokenMinUnit.toString() &&
                            buyUnit.toString() &&
                            Object.keys(
                              Object.values(item.strategy)[0].setting.totalLimit
                            )[0] === 'Token0'
                          "
                        >
                          {{
                            filterQuantity(
                              Object.values(
                                Object.values(item.strategy)[0].setting
                                  .totalLimit
                              )[0],
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                          }}
                          (Filed:
                          {{
                            filterFiledPro(
                              item,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              tokenMinUnit,
                              buyUnit
                            )
                          }})
                          {{
                            tokens[currentPair[1][0].token0[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            tokenMinUnit.toString() &&
                            buyUnit.toString() &&
                            Object.keys(
                              Object.values(item.strategy)[0].setting.totalLimit
                            )[0] === 'Token1'
                          "
                        >
                          {{
                            Object.values(
                              Object.values(item.strategy)[0].setting.totalLimit
                            )[0] |
                              bigintToFloat(
                                buyUnit,
                                tokens[currentPair[1][0].token1[0].toString()]
                                  .decimals
                              )
                          }}
                          (Filed:
                          {{
                            filterFiledPro(
                              item,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              tokenMinUnit,
                              buyUnit
                            )
                          }})
                          {{
                            tokens[currentPair[1][0].token1[0].toString()]
                              .symbol
                          }}
                        </span>
                      </div>
                      <div class="base-font-title">
                        <span
                          v-if="
                            Object.keys(
                              Object.values(item.strategy)[0].setting.order.side
                            )[0] === 'Buy'
                          "
                        >
                          Highest price:
                        </span>
                        <span v-else>Lowest price:</span>
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            buyUnit.toString()
                          "
                        >
                          {{
                            filterLevelPrice(
                              Object.values(item.strategy)[0].setting.order
                                .priceLimit,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              buyUnit,
                              Object.keys(
                                Object.values(item.strategy)[0].setting.order
                                  .side
                              )[0] === 'Buy'
                                ? 'bid'
                                : 'ask'
                            )
                          }}
                        </span>
                      </div>
                      <div class="base-font-title">
                        Slippage:
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            unit &&
                            buyUnit.toString()
                          "
                        >
                          {{
                            filterLevelPrice(
                              Object.values(item.strategy)[0].setting.order
                                .priceSpread,
                              unit,
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokens[currentPair[1][0].token1[0].toString()]
                                .decimals,
                              buyUnit,
                              Object.keys(
                                Object.values(item.strategy)[0].setting.order
                                  .side
                              )[0] === 'Buy'
                                ? 'bid'
                                : 'ask'
                            )
                          }}
                        </span>
                      </div>
                      <div class="base-font-title">
                        Order quantity:
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token0[0].toString()] &&
                            tokenMinUnit.toString() &&
                            Object.keys(
                              Object.values(item.strategy)[0].setting
                                .amountPerTrigger
                            )[0] === 'Token0'
                          "
                        >
                          {{
                            filterQuantity(
                              Object.values(
                                Object.values(item.strategy)[0].setting
                                  .amountPerTrigger
                              )[0],
                              tokens[currentPair[1][0].token0[0].toString()]
                                .decimals,
                              tokenMinUnit
                            )
                          }}
                          {{
                            tokens[currentPair[1][0].token0[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span
                          v-if="
                            currentPair &&
                            tokens &&
                            tokens[currentPair[1][0].token1[0].toString()] &&
                            buyUnit.toString() &&
                            Object.keys(
                              Object.values(item.strategy)[0].setting
                                .amountPerTrigger
                            )[0] === 'Token1'
                          "
                        >
                          {{
                            Object.values(
                              Object.values(item.strategy)[0].setting
                                .amountPerTrigger
                            )[0] |
                              bigintToFloat(
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
                  </td>
                  <td style="line-height: 1.5">
                    <div
                      class="pointer"
                      :class="{
                        'main-color':
                          item.pendingOrders.buy.length +
                            item.pendingOrders.sell.length >
                          0
                      }"
                      @click="showPendingOrders(item.pendingOrders)"
                    >
                      pending({{
                        item.pendingOrders.buy.length +
                        item.pendingOrders.sell.length
                      }})
                    </div>
                    <div>orders({{ item.stats.orderCount }})</div>
                    <div>errors({{ item.stats.errorCount }})</div>
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
                      @click="onRunningProOrder(item.soid, item.stType, item)"
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
              !isH5 &&
              currentTradesMenu === 'pro' &&
              currentTradeMenuPro === 'orders' &&
              proOrders.length > 10
            "
            :current="currentProOrdersPage"
            :defaultPageSize="10"
            :total="proOrders.length"
            @change="changeProOrders"
          />
          <div class="overflow-scroll">
            <table
              v-show="
                !isH5 &&
                currentTradesMenu === 'pro' &&
                currentTradeMenuPro === 'pending'
              "
            >
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
                          getPendingStatus(item[1]) === 'Trading' ||
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
              currentTradesMenu === 'pro' &&
              currentTradeMenuPro === 'pending' &&
              pendingListPro.length > 10
            "
            :current="currentPendingProPage"
            :defaultPageSize="10"
            :total="pendingListPro.length"
            @change="changePendingPro"
          />
          <div class="overflow-scroll">
            <table
              v-show="
                !isH5 &&
                currentTradesMenu === 'pro' &&
                currentTradeMenuPro === 'history'
              "
            >
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
                        >This column includes the trading fee, network fees
                        (gas), 3rd party fees for trades performed through
                        applications provided by 3rd parties, and VIP-Maker
                        yield. Negative values indicate profit rather than loss.
                      </template>
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
                        item.details[item.details.length - 1].time |
                          formatDateFromNanosecondUTC
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
                              Object.values(item.order.token0Value[0])[0] |
                                bigintToFloat(
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
                              Object.values(item.order.token1Value[0])[0] |
                                bigintToFloat(
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
                              Object.values(item.order.token0Value[0])[0] |
                                bigintToFloat(
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
                              Object.values(item.order.token1Value[0])[0] |
                                bigintToFloat(
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
                              Object.values(item.order.token0Value[0])[0] |
                                bigintToFloat(
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
                              Object.values(item.order.token1Value[0])[0] |
                                bigintToFloat(
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
                              Object.values(item.order.token0Value[0])[0] |
                                bigintToFloat(
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
                              Object.values(item.order.token1Value[0])[0] |
                                bigintToFloat(
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
                                )[0] |
                                  bigintToFloat(
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
                                )[0] |
                                  bigintToFloat(
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
                                )[0] |
                                  bigintToFloat(
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
                                )[0] |
                                  bigintToFloat(
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
                                Object.values(item.filled.token0Value)[0] |
                                  bigintToFloat(
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
                                Object.values(item.filled.token1Value)[0] |
                                  bigintToFloat(
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
                                Object.values(item.filled.token0Value)[0] |
                                  bigintToFloat(
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
                                Object.values(item.filled.token1Value)[0] |
                                  bigintToFloat(
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
                                )[0] |
                                  bigintToFloat(
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
                                )[0] |
                                  bigintToFloat(
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
                                )[0] |
                                  bigintToFloat(
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
                                )[0] |
                                  bigintToFloat(
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
                                Object.values(item.filled.token0Value)[0] |
                                  bigintToFloat(
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
                                Object.values(item.filled.token1Value)[0] |
                                  bigintToFloat(
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
                                Object.values(item.filled.token0Value)[0] |
                                  bigintToFloat(
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
                                Object.values(item.filled.token1Value)[0] |
                                  bigintToFloat(
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
              currentTradesMenu === 'pro' &&
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
          <table
            v-show="
              !isH5 &&
              currentTradesMenu === 'std' &&
              currentTradeMenu === 'history'
            "
          >
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
                      >This column includes the trading fee, network fees (gas),
                      3rd party fees for trades performed through applications
                      provided by 3rd parties, and VIP-Maker yield. Negative
                      values indicate profit rather than loss.
                    </template>
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
                      item.details[item.details.length - 1].time |
                        formatDateFromNanosecondUTC
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
                            Object.values(item.order.token0Value[0])[0] |
                              bigintToFloat(
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
                            Object.values(item.order.token1Value[0])[0] |
                              bigintToFloat(
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
                            Object.values(item.order.token0Value[0])[0] |
                              bigintToFloat(
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
                            Object.values(item.order.token1Value[0])[0] |
                              bigintToFloat(
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
                            Object.values(item.order.token0Value[0])[0] |
                              bigintToFloat(
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
                            Object.values(item.order.token1Value[0])[0] |
                              bigintToFloat(
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
                            Object.values(item.order.token0Value[0])[0] |
                              bigintToFloat(
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
                            Object.values(item.order.token1Value[0])[0] |
                              bigintToFloat(
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
                              )[0] |
                                bigintToFloat(
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
                              )[0] |
                                bigintToFloat(
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
                              )[0] |
                                bigintToFloat(
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
                              )[0] |
                                bigintToFloat(
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
                              Object.values(item.filled.token0Value)[0] |
                                bigintToFloat(
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
                              Object.values(item.filled.token1Value)[0] |
                                bigintToFloat(
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
                              Object.values(item.filled.token0Value)[0] |
                                bigintToFloat(
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
                              Object.values(item.filled.token1Value)[0] |
                                bigintToFloat(
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
                              )[0] |
                                bigintToFloat(
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
                              )[0] |
                                bigintToFloat(
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
                              )[0] |
                                bigintToFloat(
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
                              )[0] |
                                bigintToFloat(
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
                              Object.values(item.filled.token0Value)[0] |
                                bigintToFloat(
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
                              Object.values(item.filled.token1Value)[0] |
                                bigintToFloat(
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
                              Object.values(item.filled.token0Value)[0] |
                                bigintToFloat(
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
                              Object.values(item.filled.token1Value)[0] |
                                bigintToFloat(
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
            !isH5 &&
            currentTradesMenu === 'std' &&
            currentTradeMenu === 'history' &&
            userRecord.length > 10
          "
          :current="currentHistoryPage"
          :defaultPageSize="10"
          :total="userRecord.length"
          @change="changeHistory"
        />
        <div class="overflow-scroll">
          <table
            v-show="
              !isH5 &&
              currentTradesMenu === 'std' &&
              currentTradeMenu === 'pending'
            "
          >
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
                        getPendingStatus(item[1]) === 'Trading' ||
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
          v-show="
            !isH5 &&
            currentTradesMenu === 'std' &&
            currentTradeMenu === 'pending' &&
            totalPending > 10
          "
          :current="currentPendingPage"
          :defaultPageSize="10"
          :total="totalPending"
          @change="changePending"
        />
        <div class="overflow-scroll">
          <table
            v-show="
              !isH5 &&
              currentTradesMenu === 'std' &&
              currentTradeMenu === 'stop'
            "
          >
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
                        tokenMinUnit.toString()
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
                    {{ filterStopLimitFilled(item) }}
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
                        tokenMinUnit.toString()
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
                            :href="`https://ic.house/swap/${currentPair[0].toString()}/${filterTxid(
                              item.pendingOrders.buy[0][0][0]
                            )}`"
                            :is-copy="false"
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
                            :href="`https://ic.house/swap/${currentPair[0].toString()}/${filterTxid(
                              item.pendingOrders.sell[0][0][0]
                            )}`"
                            :is-copy="false"
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
                    @click="onDeleteStopLimit(item.soid)"
                    >Cancel</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="pending-h5"
          v-show="
            isH5 &&
            currentTradesMenu === 'std' &&
            currentTradeMenu === 'pending'
          "
        >
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
                        getPendingStatus(item[1]) === 'Trading' ||
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
        <div
          class="pending-h5"
          v-show="
            isH5 && currentTradesMenu === 'std' && currentTradeMenu === 'stop'
          "
        >
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
                    @click="onDeleteStopLimit(item.soid)"
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
                    tokenMinUnit.toString()
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
                      tokenMinUnit.toString()
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
                  {{ filterStopLimitFilled(item) }}
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
        <div
          class="pending-h5"
          v-show="
            isH5 &&
            currentTradesMenu === 'std' &&
            currentTradeMenu === 'history'
          "
        >
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
                        Object.values(item.order.token0Value[0])[0] |
                          bigintToFloat(
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
                        Object.values(item.order.token1Value[0])[0] |
                          bigintToFloat(
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
                        Object.values(item.order.token0Value[0])[0] |
                          bigintToFloat(
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
                        Object.values(item.order.token1Value[0])[0] |
                          bigintToFloat(
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
                          )[0] |
                            bigintToFloat(
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
                          )[0] |
                            bigintToFloat(
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
                          )[0] |
                            bigintToFloat(
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
                          )[0] |
                            bigintToFloat(
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
                          Object.values(item.filled.token0Value)[0] |
                            bigintToFloat(
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
                          Object.values(item.filled.token1Value)[0] |
                            bigintToFloat(
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
                          Object.values(item.filled.token0Value)[0] |
                            bigintToFloat(
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
                          Object.values(item.filled.token1Value)[0] |
                            bigintToFloat(
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
                      >This column includes the trading fee, network fees (gas),
                      3rd party fees for trades performed through applications
                      provided by 3rd parties, and VIP-Maker yield. Negative
                      values indicate profit rather than loss.
                    </template>
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
                      item.details[item.details.length - 1].time |
                        formatDateFromNanosecondUTC
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
        <div class="pending-h5" v-show="isH5 && currentTradesMenu === 'pro'">
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
          <ul
            v-loading="proOrdersLoading"
            element-loading-background="rgba(0, 0, 0, 0)"
            v-show="
              currentTradesMenu === 'pro' && currentTradeMenuPro === 'orders'
            "
            style="min-height: 100px"
          >
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
                  <span class="base-font-title">
                    {{ Object.keys(item.stType)[0] }}
                  </span>
                  <span
                    v-if="
                      Object.keys(item.stType)[0] === 'TWAP' ||
                      Object.keys(item.stType)[0] === 'VWAP' ||
                      Object.keys(item.stType)[0] === 'IcebergOrder'
                    "
                    :class="{
                      'ask-price':
                        Object.keys(
                          Object.values(item.strategy)[0].setting.order.side
                        )[0] === 'Sell',
                      'bid-price':
                        Object.keys(
                          Object.values(item.strategy)[0].setting.order.side
                        )[0] === 'Buy'
                    }"
                    >{{
                      Object.keys(
                        Object.values(item.strategy)[0].setting.order.side
                      )[0]
                    }}</span
                  >
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
                    v-if="Object.keys(item.status)[0] === 'Stopped'"
                    @click="onRunningProOrder(item.soid, item.stType, item)"
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
                </div>
              </div>
              <div class="pending-item">
                <span class="pending-item-left">Status</span>
                <span class="pending-item-right">
                  {{ Object.keys(item.status)[0] }}
                </span>
              </div>
              <div
                class="pending-item"
                v-if="
                  Object.keys(item.stType)[0] === 'TWAP' ||
                  Object.keys(item.stType)[0] === 'VWAP' ||
                  Object.keys(item.stType)[0] === 'IcebergOrder'
                "
              >
                <span class="pending-item-left">Period</span>
                <span class="pending-item-right">
                  {{
                    Object.values(item.strategy)[0].setting.startingTime |
                      formatDateToMinuteFilter
                  }}
                  ~
                  {{
                    Object.values(item.strategy)[0].setting.endTime |
                      formatDateToMinuteFilter
                  }}
                </span>
              </div>
              <div
                class="pending-item"
                v-if="Object.keys(item.stType)[0] === 'TWAP'"
              >
                <span class="pending-item-left">Trigger interval</span>
                <span class="pending-item-right">
                  {{ getDuration(item.strategy.TWAP.setting.triggerInterval) }}
                </span>
              </div>
              <div
                class="pending-item"
                v-if="Object.keys(item.stType)[0] === 'VWAP'"
              >
                <span class="pending-item-left">Trigger vol change</span>
                <span
                  class="pending-item-right"
                  v-if="
                    Object.keys(item.strategy.VWAP.setting.triggerVol)[0] ===
                    'Geom'
                  "
                >
                  {{ item.strategy.VWAP.setting.triggerVol.Geom | filterPpm }}
                  <a-tooltip placement="top">
                    <template slot="title">
                      {{
                        item.strategy.VWAP.setting.triggerVol.Geom | filterPpm
                      }}
                      of volume in the last 24 hours.
                    </template>
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </span>
                <span
                  class="pending-item-right"
                  v-if="
                    Object.keys(item.strategy.VWAP.setting.triggerVol)[0] ===
                      'Arith' &&
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token1[0].toString()].decimals &&
                    buyUnit.toString()
                  "
                >
                  {{
                    Object.values(item.strategy.VWAP.setting.triggerVol)[0] |
                      bigintToFloat(
                        buyUnit,
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                  }}
                  {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                </span>
              </div>
              <div
                class="pending-item"
                v-if="
                  Object.keys(item.stType)[0] === 'TWAP' ||
                  Object.keys(item.stType)[0] === 'VWAP'
                "
              >
                <span class="pending-item-left">Total amount</span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokenMinUnit.toString() &&
                    Object.keys(
                      Object.values(item.strategy)[0].setting.totalLimit
                    )[0] === 'Token0'
                  "
                >
                  {{
                    filterQuantity(
                      Object.values(
                        Object.values(item.strategy)[0].setting.totalLimit
                      )[0],
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokenMinUnit
                    )
                  }}
                  (Filed:
                  {{
                    filterFiledPro(
                      item,
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      tokenMinUnit,
                      buyUnit
                    )
                  }})
                  {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
                </span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    buyUnit.toString() &&
                    Object.keys(
                      Object.values(item.strategy)[0].setting.totalLimit
                    )[0] === 'Token1'
                  "
                >
                  {{
                    Object.values(
                      Object.values(item.strategy)[0].setting.totalLimit
                    )[0] |
                      bigintToFloat(
                        buyUnit,
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                  }}
                  (Filed:
                  {{
                    filterFiledPro(
                      item,
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      tokenMinUnit,
                      buyUnit
                    )
                  }})
                  {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                </span>
              </div>
              <div
                class="pending-item"
                v-if="Object.keys(item.stType)[0] === 'IcebergOrder'"
              >
                <span class="pending-item-left">Total amount</span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokenMinUnit.toString()
                  "
                >
                  {{
                    filterQuantity(
                      Object.values(
                        item.strategy.IcebergOrder.setting.totalLimit
                      )[0],
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokenMinUnit
                    )
                  }}
                  (Filed:
                  {{
                    filterFiledPro(
                      item,
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      tokenMinUnit,
                      buyUnit
                    )
                  }})
                  {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
                </span>
              </div>
              <div
                v-if="Object.keys(item.stType)[0] === 'GridOrder'"
                class="pending-item"
              >
                <span class="pending-item-left">Grid spread</span>
                <span class="pending-item-right">
                  <span
                    v-if="
                      Object.keys(item.strategy.GridOrder.setting.spread)[0] ===
                      'Geom'
                    "
                  >
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
                      buyUnit.toString()
                    "
                  >
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
                v-if="
                  Object.keys(item.stType)[0] === 'TWAP' ||
                  Object.keys(item.stType)[0] === 'VWAP'
                "
                class="pending-item"
              >
                <span
                  v-if="
                    Object.keys(
                      Object.values(item.strategy)[0].setting.order.side
                    )[0] === 'Buy'
                  "
                  class="pending-item-left"
                >
                  Highest price
                </span>
                <span v-else class="pending-item-left">Lowest price</span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    unit &&
                    buyUnit.toString()
                  "
                >
                  {{
                    filterLevelPrice(
                      Object.values(item.strategy)[0].setting.order.priceLimit,
                      unit,
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      buyUnit,
                      Object.keys(
                        Object.values(item.strategy)[0].setting.order.side
                      )[0] === 'Buy'
                        ? 'bid'
                        : 'ask'
                    )
                  }}
                </span>
              </div>
              <div
                v-if="
                  Object.keys(item.stType)[0] === 'TWAP' ||
                  Object.keys(item.stType)[0] === 'VWAP'
                "
                class="pending-item"
              >
                <span class="pending-item-left">Slippage</span>
                <span
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    unit &&
                    buyUnit.toString()
                  "
                  class="pending-item-right"
                >
                  {{
                    filterLevelPrice(
                      Object.values(item.strategy)[0].setting.order.priceSpread,
                      unit,
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      buyUnit,
                      Object.keys(
                        Object.values(item.strategy)[0].setting.order.side
                      )[0] === 'Buy'
                        ? 'bid'
                        : 'ask'
                    )
                  }}
                </span>
              </div>
              <div
                v-if="
                  Object.keys(item.stType)[0] === 'TWAP' ||
                  Object.keys(item.stType)[0] === 'VWAP'
                "
                class="pending-item"
              >
                <span class="pending-item-left">order quantity</span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokenMinUnit.toString() &&
                    Object.keys(
                      Object.values(item.strategy)[0].setting.amountPerTrigger
                    )[0] === 'Token0'
                  "
                >
                  {{
                    filterQuantity(
                      Object.values(
                        Object.values(item.strategy)[0].setting.amountPerTrigger
                      )[0],
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokenMinUnit
                    )
                  }}
                  {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
                </span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    buyUnit.toString() &&
                    Object.keys(
                      Object.values(item.strategy)[0].setting.amountPerTrigger
                    )[0] === 'Token1'
                  "
                >
                  {{
                    Object.values(
                      Object.values(item.strategy)[0].setting.amountPerTrigger
                    )[0] |
                      bigintToFloat(
                        buyUnit,
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                  }}
                  {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                </span>
              </div>
              <div
                class="pending-item"
                v-if="Object.keys(item.stType)[0] === 'IcebergOrder'"
              >
                <span class="pending-item-left">Order price</span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokens[currentPair[1][0].token1[0].toString()] &&
                    unit &&
                    buyUnit.toString()
                  "
                >
                  {{
                    filterLevelPrice(
                      item.strategy.IcebergOrder.setting.order.price,
                      unit,
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
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
              <div
                class="pending-item"
                v-if="Object.keys(item.stType)[0] === 'IcebergOrder'"
              >
                <span class="pending-item-left">Order quantity</span>
                <span
                  class="pending-item-right"
                  v-if="
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()] &&
                    tokenMinUnit.toString()
                  "
                >
                  {{
                    filterQuantity(
                      Object.values(
                        item.strategy.IcebergOrder.setting.amountPerTrigger
                      )[0],
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokenMinUnit
                    )
                  }}
                </span>
              </div>
              <div
                v-if="Object.keys(item.stType)[0] === 'GridOrder'"
                class="pending-item"
              >
                <span class="pending-item-left">Trigger order</span>
                <span
                  class="pending-item-right"
                  v-if="
                    Object.keys(item.strategy.GridOrder.setting.amount)[0] ===
                    'Percent'
                  "
                >
                  <span
                    v-if="item.strategy.GridOrder.setting.amount.Percent.length"
                    >{{
                      item.strategy.GridOrder.setting.amount.Percent[0] |
                        filterPpm
                    }}
                    <a-tooltip placement="top">
                      <template slot="title">
                        Percentage of available balance in TradeAccount for
                        pro-trader.
                      </template>
                      <a-icon type="info-circle" />
                    </a-tooltip>
                  </span>
                  <span v-else>-</span>
                </span>
                <span
                  class="pending-item-right"
                  v-if="
                    Object.keys(item.strategy.GridOrder.setting.amount)[0] ===
                      'Token0' &&
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token0[0].toString()].decimals
                  "
                >
                  {{
                    item.strategy.GridOrder.setting.amount.Token0 |
                      bigintToFloat(
                        tokenMinUnit,
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                  }}
                  {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
                </span>
                <span
                  class="pending-item-right"
                  v-if="
                    Object.keys(item.strategy.GridOrder.setting.amount)[0] ===
                      'Token1' &&
                    currentPair &&
                    tokens &&
                    tokens[currentPair[1][0].token1[0].toString()].decimals
                  "
                >
                  {{
                    item.strategy.GridOrder.setting.amount.Token1 |
                      bigintToFloat(
                        buyUnit,
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                  }}
                  {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                </span>
              </div>
              <div class="pending-item pending-item-pro">
                <span class="pending-item-left">Triggered trades</span>
              </div>
              <div class="pending-item pending-item-pro-item">
                <span class="pending-item-left">pending</span>
                <span class="pending-item-right">
                  {{
                    item.pendingOrders.buy.length +
                    item.pendingOrders.sell.length
                  }}
                </span>
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
                <span class="pending-item-left">Last trigger</span>
                <span class="pending-item-right">
                  {{ item.triggerTime | formatDateFromSecondUTC }}
                </span>
              </div>
            </li>
            <li
              v-if="!proOrdersLoading && !proOrders.length"
              class="text-center"
            >
              No Orders
            </li>
          </ul>
          <ul
            v-loading="proOrdersPendingLoading"
            element-loading-background="rgba(0, 0, 0, 0)"
            v-show="
              currentTradesMenu === 'pro' && currentTradeMenuPro === 'pending'
            "
            style="min-height: 100px"
          >
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
                        getPendingStatus(item[1]) === 'Trading' ||
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
            <li
              v-if="!proOrdersPendingLoading && !pendingListPro.length"
              class="text-center"
            >
              No Orders
            </li>
          </ul>
          <ul
            v-loading="userRecordProLoading"
            element-loading-background="rgba(0, 0, 0, 0)"
            v-show="
              currentTradesMenu === 'pro' && currentTradeMenuPro === 'history'
            "
            style="min-height: 100px"
          >
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
                        Object.values(item.order.token0Value[0])[0] |
                          bigintToFloat(
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
                        Object.values(item.order.token1Value[0])[0] |
                          bigintToFloat(
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
                        Object.values(item.order.token0Value[0])[0] |
                          bigintToFloat(
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
                        Object.values(item.order.token1Value[0])[0] |
                          bigintToFloat(
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
                          )[0] |
                            bigintToFloat(
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
                          )[0] |
                            bigintToFloat(
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
                          )[0] |
                            bigintToFloat(
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
                          )[0] |
                            bigintToFloat(
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
                          Object.values(item.filled.token0Value)[0] |
                            bigintToFloat(
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
                          Object.values(item.filled.token1Value)[0] |
                            bigintToFloat(
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
                          Object.values(item.filled.token0Value)[0] |
                            bigintToFloat(
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
                          Object.values(item.filled.token1Value)[0] |
                            bigintToFloat(
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
                      >This column includes the trading fee, network fees (gas),
                      3rd party fees for trades performed through applications
                      provided by 3rd parties, and VIP-Maker yield. Negative
                      values indicate profit rather than loss.
                    </template>
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
                      item.details[item.details.length - 1].time |
                        formatDateFromNanosecondUTC
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
            <li
              v-if="!userRecordProLoading && !userRecordPro.length"
              class="text-center"
            >
              No Trades
            </li>
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
          <div class="de-swap-list-item-search base-font-title">
            <a-icon type="menu" />
            <a-tooltip placement="top">
              <template slot="title">
                <div class="base-font-title">
                  <div>
                    Listing on ICDex is non-censored, anyone can list a token on
                    ICDex, the security and value of the tokens needs to be
                    assessed by you and you bear all the consequences.
                  </div>
                  <div>
                    Pair Score is an automatic evaluation mechanism of ICDex for
                    trading pairs, which is based on the comprehensive
                    evaluation of the number of sponsors, liquidity, volume,
                    etc. It is for your reference only, and is not considered as
                    investment advice. The list of trading pairs is divided into
                    three boards according to the Pair Score.
                  </div>
                  <div>
                    <span class="dots"></span> MAIN Pairings means that more
                    traders are involved and need to keep track of the risks.
                  </div>
                  <div>
                    <span class="dots"></span> Rising Pairings means that some
                    traders are involved and need to keep track of the risks.
                  </div>
                  <div>
                    <span class="dots"></span> Higher Risk Pairings means that
                    fewer traders are involved and there are many unknown risks.
                  </div>
                </div>
              </template>
              <span style="font-size: 12px; flex-shrink: 0; margin-right: 5px">
                <a-icon type="question-circle" />
              </span>
            </a-tooltip>
            <a-input
              allowClear
              autocomplete="off"
              type="text"
              placeholder="Search"
              v-model="pairSearch"
              @change="pairSearchChange"
              @focus="pairSearchChange"
            >
              <a-icon style="color: #adb3c4" slot="prefix" type="search" />
            </a-input>
          </div>
          <ul
            class="trade-market-sort"
            v-show="currentTradeMarketSort !== 'Star'"
          >
            <li
              :class="[
                currentTradeMarketSort === 'Star' && item.value === 'Star'
                  ? 'show-sort'
                  : 'hide-sort',
                currentTradeMarketSort !== 'Star' && item.value !== 'Star'
                  ? 'show-sort'
                  : 'hide-sort',
                item.value === currentTradeMarketSort ? 'active' : '',
                item.value === 'Old' ? 'trade-market-old' : '',
                item.value
              ]"
              v-for="item in tradeMarketSort"
              :key="item.value"
              @click="changeTradeMarketSort(item)"
            >
              <a-icon
                v-show="
                  currentTradeMarketSort === 'Star' && item.value === 'Star'
                "
                type="star"
                theme="filled"
              />
              <span
                v-show="
                  currentTradeMarketSort !== 'Star' && item.value !== 'Star'
                "
              >
                {{ item.name }}
                <span
                  v-if="item.value === 'USDC' || item.value === 'USDT'"
                  class="base-red"
                  >TEST</span
                >
              </span>
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
              <tr v-if="currentTradeMarketSort === 'Third' && !showThird">
                <td
                  colspan="3"
                  style="
                    line-height: 1.5;
                    text-wrap: normal;
                    padding-left: 10px;
                  "
                >
                  The trading pairs on the Higher Risk mean that very few
                  traders are involved and there may be a higher risk. Sure you
                  want to show the list?
                  <button class="mt20 w100" @click="showThird = true">
                    Confirm
                  </button>
                </td>
              </tr>
              <tr
                v-for="(pair, index) in tradePairs[currentTradeMarketSort]"
                :key="index"
                @click="changePair(pair, index)"
                :class="{
                  active:
                    !(currentTradeMarketSort === 'Third' && !showThird) &&
                    currentPairIndex !== null &&
                    pairs[currentPairIndex] &&
                    (currentPair[3] === currentTradeMarketSort ||
                      !pair[1][0].marketBoard) &&
                    pair[1][0].canisterId.toString() ===
                      currentPair[1][0].canisterId.toString()
                }"
              >
                <td v-if="!(currentTradeMarketSort === 'Third' && !showThird)">
                  <dl>
                    <dt>
                      <a-icon
                        v-show="
                          !oldPairs.includes(pair[0].toString()) &&
                          pair[1][0].marketBoard
                        "
                        :theme="
                          star.includes(pair[0].toString())
                            ? 'filled'
                            : 'outlined'
                        "
                        @click.stop="onStar(pair)"
                        type="star"
                        :class="{
                          'base-font-title': star.includes(pair[0].toString())
                        }"
                      />
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
                <td v-if="!(currentTradeMarketSort === 'Third' && !showThird)">
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
                          pair[2].price |
                            filterPairTokenPrice(
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
                <td
                  v-if="!(currentTradeMarketSort === 'Third' && !showThird)"
                  class="text-right"
                >
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
                          pair[2].vol24h.value1 |
                            bigintToFloat(
                              2,
                              tokens[pair[1][0].token1[0].toString()].decimals
                            ) |
                            formatNum
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
                          pair[2].totalVol.value1 |
                            bigintToFloat(
                              2,
                              tokens[pair[1][0].token1[0].toString()].decimals
                            ) |
                            formatNum
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
            <a-icon
              v-if="
                currentPair && !prePairs.includes(currentPair[0].toString())
              "
              class="set-pool"
              :class="{ disabled: orderType === 'Pro' }"
              type="setting"
              @click="showPoolVisible"
            />
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
                    <span v-if="item !== 'Stop-limit'">
                      {{ item }}
                    </span>
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
                <div v-show="orderType !== 'MKT' && orderType !== 'Stop-limit'">
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
                      <span
                        >≈ ${{
                          buyPrice |
                            filterBuyPrice(token0Price, currentTokenPrice) |
                            formatNum
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
                      <span
                        >≈ ${{
                          buyTotal |
                            filterBuyPrice(token0Price, currentTokenPrice) |
                            formatNum
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
                      <span v-show="!buyTotalMKTError"
                        >≈ ${{
                          buyTotalMKT |
                            filterBuyPrice(token0Price, currentTokenPrice) |
                            formatNum
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
                  <span
                    class="balance-label"
                    :class="{ 'balance-label-wallet': !showKeepBalance }"
                    >Wallet:</span
                  >
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
                        tokensBalance[currentPair[1][0].token1[0].toString()] |
                          bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          ) |
                          formatNum
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
                        keepingBalance[currentPair[1][0].token1[0].toString()] |
                          filterKeepingBalance(
                            stopLimitNeed.token1,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            4
                          ) |
                          formatNum
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
                <div v-show="orderType !== 'MKT' && orderType !== 'Stop-limit'">
                  <button
                    v-if="getPrincipalId && currentPair"
                    class="buy-button w100 mt20"
                    :disabled="
                      (pairInfo &&
                        pairInfo.paused &&
                        (isIDOPaused ||
                          (!isIDOPaused && orderType !== 'FOK')) &&
                        debugPairs &&
                        ((debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] !==
                            getPrincipalId) ||
                          !debugPairs[currentPair[0].toString()])) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()])) ||
                      (orderType === 'Stop-limit' &&
                        !(isKeeping && isPoolMode)) ||
                      currentPair[3] === 'Old'
                    "
                    @click="onBuy"
                  >
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        (isIDOPaused ||
                          (!isIDOPaused && orderType !== 'FOK')) &&
                        !(debugPairs && debugPairs[currentPair[0].toString()])
                      "
                    >
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
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        debugPairs[currentPair[0].toString()] &&
                        debugPairs[currentPair[0].toString()] !== getPrincipalId
                      "
                    >
                      Under maintenance
                    </span>
                    <span
                      v-if="
                        !(
                          pairInfo &&
                          pairInfo.paused &&
                          (isIDOPaused || (!isIDOPaused && orderType !== 'FOK'))
                        ) ||
                        (debugPairs &&
                          debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] ===
                            getPrincipalId)
                      "
                    >
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Buy&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }} </span>
                        <span
                          v-show="
                            currentPair[1][0].token0[0].toString() === oldICL
                          "
                          >(drc20)</span
                        >
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
                      (pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        ((debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] !==
                            getPrincipalId) ||
                          !debugPairs[currentPair[0].toString()])) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()])) ||
                      currentPair[3] === 'Old'
                    "
                    class="buy-button w100 mt20"
                    @click="onBuyMKT"
                  >
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        (isIDOPaused ||
                          (!isIDOPaused && orderType !== 'MKT')) &&
                        !(debugPairs && debugPairs[currentPair[0].toString()])
                      "
                    >
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
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        debugPairs[currentPair[0].toString()] &&
                        debugPairs[currentPair[0].toString()] !== getPrincipalId
                      "
                    >
                      Under maintenance
                    </span>
                    <span
                      v-if="
                        !(
                          pairInfo &&
                          pairInfo.paused &&
                          (isIDOPaused || (!isIDOPaused && orderType !== 'MKT'))
                        ) ||
                        (debugPairs &&
                          debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] ===
                            getPrincipalId)
                      "
                    >
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Buy&nbsp;
                        <span
                          >{{ currentPair[1][0].token0[1] }}
                          <span
                            v-show="
                              currentPair[1][0].token0[0].toString() === oldICL
                            "
                            >(drc20)</span
                          ></span
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
              <div v-show="tradeType === 'Sell'" class="trade-main-sell">
                <div v-show="orderType !== 'MKT' && orderType !== 'Stop-limit'">
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
                      <span
                        >≈ ${{
                          sellPrice |
                            filterBuyPrice(token0Price, currentTokenPrice) |
                            formatNum
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
                      <span
                        >≈ ${{
                          sellTotal |
                            filterBuyPrice(token0Price, currentTokenPrice) |
                            formatNum
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
                  <span
                    class="balance-label"
                    :class="{ 'balance-label-wallet': !showKeepBalance }"
                    >Wallet:</span
                  >
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
                        tokensBalance[currentPair[1][0].token0[0].toString()] |
                          bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          ) |
                          formatNum
                      }}
                    </span>
                    <span v-else>-</span>
                    <span v-if="currentPair">
                      {{ currentPair[1][0].token0[1] }}
                      <span
                        class="old-icl-type"
                        v-show="
                          currentPair[1][0].token0[0].toString() === oldICL
                        "
                        >drc20</span
                      >
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
                        keepingBalance[currentPair[1][0].token0[0].toString()] |
                          filterKeepingBalance(
                            stopLimitNeed.token0,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            4
                          ) |
                          formatNum
                      }}&nbsp;{{ currentPair[1][0].token0[1] }}
                      <span
                        class="old-icl-type"
                        v-show="
                          currentPair[1][0].token0[0].toString() === oldICL
                        "
                        >drc20</span
                      >
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
                  v-show="orderType !== 'MKT' && orderType !== 'Stop-limit'"
                  class="trade-h5-button"
                >
                  <button
                    v-if="getPrincipalId && currentPair"
                    class="sell-button w100 mt20"
                    :disabled="
                      (pairInfo &&
                        pairInfo.paused &&
                        (isPaused || (!isPaused && orderType !== 'LMT')) &&
                        debugPairs &&
                        ((debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] !==
                            getPrincipalId) ||
                          !debugPairs[currentPair[0].toString()])) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()])) ||
                      (orderType === 'Stop-limit' &&
                        !(isKeeping && isPoolMode)) ||
                      currentPair[3] === 'Old'
                    "
                    @click="onSell"
                  >
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        (isPaused || (!isPaused && orderType !== 'LMT')) &&
                        !(debugPairs && debugPairs[currentPair[0].toString()])
                      "
                    >
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
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        debugPairs[currentPair[0].toString()] &&
                        debugPairs[currentPair[0].toString()] !== getPrincipalId
                      "
                    >
                      Under maintenance
                    </span>
                    <span
                      v-if="
                        !(
                          pairInfo &&
                          pairInfo.paused &&
                          (isPaused || (!isPaused && orderType !== 'LMT'))
                        ) ||
                        (debugPairs &&
                          debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] ===
                            getPrincipalId)
                      "
                    >
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Sell&nbsp;
                        <span>{{ currentPair[1][0].token0[1] }}</span>
                        <span
                          v-show="
                            currentPair[1][0].token0[0].toString() === oldICL
                          "
                          >(drc20)</span
                        >
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
                      (pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        ((debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] !==
                            getPrincipalId) ||
                          !debugPairs[currentPair[0].toString()])) ||
                      (currentPair &&
                        prepare[currentPair[0].toString()] &&
                        (oldPairs.includes(currentPair[0].toString()) ||
                          orderLoading[currentPair[0].toString()] ||
                          plugLoading[currentPair[0].toString()])) ||
                      currentPair[3] === 'Old'
                    "
                    @click="onSellMKT"
                  >
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        !(debugPairs && debugPairs[currentPair[0].toString()])
                      "
                    >
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
                    <span
                      v-if="
                        pairInfo &&
                        pairInfo.paused &&
                        debugPairs &&
                        debugPairs[currentPair[0].toString()] &&
                        debugPairs[currentPair[0].toString()] !== getPrincipalId
                      "
                    >
                      Under maintenance
                    </span>
                    <span
                      v-if="
                        !(pairInfo && pairInfo.paused) ||
                        (debugPairs &&
                          debugPairs[currentPair[0].toString()] &&
                          debugPairs[currentPair[0].toString()] ===
                            getPrincipalId)
                      "
                    >
                      <span>
                        <span
                          v-show="orderLoading[currentPair[0].toString()]"
                          class="loading-spinner"
                        ></span>
                        Sell&nbsp;
                        <span
                          >{{ currentPair[1][0].token0[1] }}
                          <span
                            v-show="
                              currentPair[1][0].token0[0].toString() === oldICL
                            "
                            >(drc20)</span
                          ></span
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
                  <span
                    v-if="
                      currentPair &&
                      currentPair[1][0].token1[0].toString() !==
                        'hhaaz-2aaaa-aaaaq-aacla-cai'
                    "
                    >≈ ${{ token0Price }}</span
                  >
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
                class="order-book-tick-size order-book-tick-size-h5 margin-left-auto base-font-title"
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
        <dl
          v-if="currentPair && !prePairs.includes(currentPair[0].toString())"
          @click="showProOrderMenu"
        >
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
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="trade-item-pro-h5"
      >
        <a-dropdown placement="bottomCenter">
          <div class="trade-item-pro-h5-item">
            {{ currentProOrderMenu }} Order&nbsp;<a-icon type="caret-down" />
          </div>
          <a-menu slot="overlay" class="strat-list">
            <a-menu-item
              v-for="item in proOrderEnum"
              :key="item"
              class="trade-item-pro-h5-list-item"
              :class="{ active: item === currentProOrderMenu }"
              @click="changeProOrderMenu(item)"
            >
              {{ item }} Order
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <div class="trade-item-pro">
          <div class="base-font-title">
            <div class="flex-center">
              <span style="white-space: nowrap">
                <a-tooltip placement="top">
                  <template slot="title">
                    <div>
                      Pro-TraderAccount: In order to realize fast trading with
                      Pro-Orders, Pro-Trader must deposit and keep funds in the
                      account on trading pair. You can withdraw funds from
                      Pro-TraderAccount back to Pro-Wallet. In pro-trading, the
                      Pro-Trader deposits funds in the Pro-TraderAccount of the
                      pair for faster trading. The relationship between the
                      "Accounts" is shown in the diagram:
                      <img src="@/assets/img/account.png" alt="" />
                    </div>
                  </template>
                  Pro-Wallet Account&nbsp;<a-icon type="info-circle" />:
                </a-tooltip>
              </span>
              <copy-account
                :account="getPrincipalId"
                copyText="Principal"
              ></copy-account>
            </div>
            <div class="flex-center">
              <span style="white-space: nowrap">Subaccount:&nbsp;</span>
              <copy-account
                account="0000000000000000000000000000000000000000000000000000000000000001"
                copyText="Subaccount"
              ></copy-account>
            </div>
          </div>
          <div class="base-font base-tip-size">
            The Pro-Wallet account is a separate sub-account, please transfer
            tokens to this account before you can create strategy orders.
          </div>
          <div class="mt20">Balance:</div>
          <div class="trade-item-pro-balance">
            <div class="trade-item-pro-balance-left">
              <div>
                <span class="trade-item-pro-balance-label"
                  >Pro-Wallet:&nbsp;</span
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
                    tokensBalanceSto[currentPair[1][0].token1[0].toString()] |
                      bigintToFloat(
                        Math.min(
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          4
                        ),
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      ) |
                      formatNum
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
                  >Pro-TraderAcct
                  <a-tooltip placement="top">
                    <template slot="title">
                      <div>
                        Pro-TraderAccount: In order to realize fast trading with
                        Pro-Orders, Pro-Trader must deposit and keep funds in
                        the account on trading pair. You can withdraw funds from
                        Pro-TraderAccount back to Pro-Wallet. In pro-trading,
                        the Pro-Trader deposits funds in the Pro-TraderAccount
                        of the pair for faster trading. The relationship between
                        the "Accounts" is shown in the diagram:
                        <img
                          style="margin-top: 10px"
                          src="@/assets/img/account.png"
                          alt=""
                          class="w100"
                        />
                      </div>
                    </template>
                    <a-icon type="info-circle" /> </a-tooltip
                  >:
                </span>
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
                      keepingBalanceSto[
                        currentPair[1][0].token1[0].toString()
                      ] |
                        bigintToFloat(
                          Math.min(
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            4
                          ),
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        ) |
                        formatNum
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
                  >Pro-Wallet:&nbsp;</span
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
                    tokensBalanceSto[currentPair[1][0].token0[0].toString()] |
                      bigintToFloat(
                        Math.min(
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          4
                        ),
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      ) |
                      formatNum
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
                  >Pro-TraderAcct
                  <a-tooltip placement="top">
                    <template slot="title">
                      <div>
                        Pro-TraderAccount: In order to realize fast trading with
                        Pro-Orders, Pro-Trader must deposit and keep funds in
                        the account on trading pair. You can withdraw funds from
                        Pro-TraderAccount back to Pro-Wallet. In pro-trading,
                        the Pro-Trader deposits funds in the Pro-TraderAccount
                        of the pair for faster trading. The relationship between
                        the "Accounts" is shown in the diagram:
                        <img
                          style="margin-top: 10px"
                          src="@/assets/img/account.png"
                          alt=""
                          class="w100"
                        />
                      </div>
                    </template>
                    <a-icon type="info-circle" /></a-tooltip
                  >:
                </span>
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
                      keepingBalanceSto[
                        currentPair[1][0].token0[0].toString()
                      ] |
                        bigintToFloat(
                          Math.min(
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            4
                          ),
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        ) |
                        formatNum
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
            <p class="base-font" style="line-height: 1.2">
              Pro-orders only use the balance of traderAccount and multiple
              pro-orders share this balance.
            </p>
            <button
              type="button"
              class="primary w100 mt20"
              @click="onCreateProOrder(currentProOrderMenu)"
              :disabled="pairInfo && pairInfo.paused"
            >
              <span v-if="pairInfo && pairInfo.paused">Paused</span>
              <span v-else>Create {{ currentProOrderMenu }} Order</span>
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
                      buyUnit.toString()
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
                            item.side === 'Buy' ? 'bid' : 'ask'
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
                            item.side === 'Buy' ? 'bid' : 'ask'
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
    <a-modal
      v-model="proPendingOrdersModel"
      width="600px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="delete-modal"
    >
      <table class="mt20">
        <thead>
          <tr>
            <th>Txid</th>
            <th>Side</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in proPendingOrders.sell"
            :key="proPendingOrders.buy.length + index"
          >
            <td>
              <copy-account
                v-if="currentPair && item[0] && item[0][0]"
                :front="10"
                :is-copy="false"
                :href="`https://ic.house/swap/${currentPair[0].toString()}/${filterTxid(
                  item[0][0]
                )}`"
                :account="filterTxid(item[0][0])"
                copyText="Txid"
              ></copy-account>
              <span v-else class="base-font"
                >Triggered and not yet ordered</span
              >
            </td>
            <td class="ask-price">Sell</td>
            <td>
              <span
                v-if="
                  unit &&
                  buyUnit.toString() &&
                  tokens &&
                  currentPair &&
                  tokens[currentPair[1][0].token0[0].toString()] &&
                  tokens[currentPair[1][0].token1[0].toString()]
                "
              >
                {{
                  filterLevelPrice(
                    item[1],
                    unit,
                    tokens[currentPair[1][0].token0[0].toString()].decimals,
                    tokens[currentPair[1][0].token1[0].toString()].decimals,
                    buyUnit,
                    'ask'
                  )
                }}
              </span>
            </td>
            <td>
              <span
                v-if="
                  tokenMinUnit.toString() &&
                  tokens &&
                  currentPair &&
                  tokens[currentPair[1][0].token0[0].toString()]
                "
              >
                {{
                  filterQuantity(
                    item[2],
                    tokens[currentPair[1][0].token0[0].toString()].decimals,
                    tokenMinUnit
                  )
                }}
              </span>
            </td>
          </tr>
          <tr v-for="(item, index) in proPendingOrders.buy" :key="index">
            <td>
              <copy-account
                v-if="currentPair && item[0] && item[0][0]"
                :front="10"
                :is-copy="false"
                :href="`https://ic.house/swap/${currentPair[0].toString()}/${filterTxid(
                  item[0][0]
                )}`"
                :account="filterTxid(item[0][0])"
                copyText="Txid"
              ></copy-account>
              <span v-else class="base-font"
                >Triggered and not yet ordered</span
              >
            </td>
            <td class="bid-price">Buy</td>
            <td>
              <span
                v-if="
                  unit &&
                  buyUnit.toString() &&
                  tokens &&
                  currentPair &&
                  tokens[currentPair[1][0].token0[0].toString()] &&
                  tokens[currentPair[1][0].token1[0].toString()]
                "
              >
                {{
                  filterLevelPrice(
                    item[1],
                    unit,
                    tokens[currentPair[1][0].token0[0].toString()].decimals,
                    tokens[currentPair[1][0].token1[0].toString()].decimals,
                    buyUnit,
                    'bid'
                  )
                }}
              </span>
            </td>
            <td>
              <span
                v-if="
                  tokenMinUnit.toString() &&
                  tokens &&
                  currentPair &&
                  tokens[currentPair[1][0].token0[0].toString()]
                "
              >
                {{
                  filterQuantity(
                    item[2],
                    tokens[currentPair[1][0].token0[0].toString()].decimals,
                    tokenMinUnit
                  )
                }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
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
      :tokens-balance="tokensBalance"
      :tokens-balance-sto="tokensBalanceSto"
      :keeping-balance-sto="keepingBalanceSto"
      :buy-unit="buyUnit"
      :token-min-unit="tokenMinUnit"
      :unit="unit"
      :tokens="tokens"
      :sto-config="stoConfig"
      :sys-config="sysConfig"
      :current-token-price="currentTokenPrice"
      :dex-role="dexRole"
      :feeRebate="feeRebate"
      @createProOrderSuccess="createProOrderSuccess"
      @proOrderDepositKeepingBalance="proOrderDepositKeepingBalance"
      @gridTransferToken="gridTransferToken"
      @gridDepositKeepingBalance="gridDepositKeepingBalance"
      @transferICLToPro="transferICLToPro"
      @toTradeICL="toTradeICL"
    ></pro-order>
    <pro-wallet-swap
      v-if="currentPair"
      :tokens-balance="tokensBalance"
      :tokens-balance-sto="tokensBalanceSto"
      :tokens="tokens"
      ref="proWalletSwap"
      @proWalletSwapSuccess="proWalletSwapSuccess"
    ></pro-wallet-swap>
    <withdraw-token
      ref="withdrawToken"
      :current-pair="currentPair"
      @withdrawSuccess="withdrawSuccess"
    >
    </withdraw-token>
    <!--<v-tour
      name="myTour"
      :steps="steps"
      :options="{
        highlight: true,
        labels: {
          buttonSkip: 'Skip tour',
          buttonPrevious: 'Previous',
          buttonNext: 'Next',
          buttonStop: 'Confirm'
        }
      }"
      :callbacks="myCallbacks"
    ></v-tour>-->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { AstroXUserService } from '@/ic/MEAccount/Service';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
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
  IcebergOrder,
  icpPrice,
  IDOConfig,
  KBar,
  KeepingBalance,
  LatestFilledRecord,
  LevelResponse,
  OrderFilled,
  OrderPrice,
  OrderStatus,
  OrderType,
  PairInfo,
  Participant,
  PendingList,
  PriceResponse,
  StopLossOrder,
  STOrder,
  STOrderPendingOrders,
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
import { ApproveError, TxReceiptErr } from '@/ic/DRC20Token/model';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { Chart, dispose, init } from 'klinecharts';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  SwapConfig,
  SwapTokenInfo,
  TrieListData1,
  TrieListData1SwapPair
} from '@/ic/ICSwapRouter/model';
import { getFee } from '@/ic/getTokenFee';
import { getTokenBalance } from '@/ic/getTokenBalance';
import { namespace } from 'vuex-class';
import { AstroXWebViewHandler } from '@astrox/sdk-webview';
import { connectIcx, initIcx } from '@/ic/connectIcx';
import {
  CK_BTC_CANISTER_ID,
  CK_ETH_LEDGER_CANISTER_ID,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  LEDGER_CANISTER_ID
} from '@/ic/utils';
import MiningInfo from '@/views/home/ICDex/components/MiningInfo.vue';
import TradingCompetitions from '@/views/home/ICDex/components/TradingCompetitions.vue';
import Fallback from '@/views/home/ICDex/components/Fallback.vue';
import TradeCompetitions from '@/views/home/ICDex/components/TradeCompetitions.vue';
import EventBus from '@/utils/Event';
import { Menu } from '@/components/menu/model';
import { checkAuth } from '@/ic/CheckAuth';
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
import { NFT, SysConfig } from '@/ic/ICDexRouter/model';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';
import WithdrawToken from '@/components/withdrawToken/Index.vue';
import Launch from '@/views/home/ICDex/components/Launch.vue';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { NftService } from '@/ic/nft/Service';
import { TokenExt, TokensExt } from '@/ic/nft/model';
import draggable from 'vuedraggable';
const commonModule = namespace('common');
const ProSubaccountId = 1;
const dayjs = require('dayjs');
let lastCallTime = null;
const interval = 10 * 1000;
const SNS1Token = 'zfcdd-tqaaa-aaaaq-aaaga-cai';
const OCToken = '2ouva-viaaa-aaaaq-aaamq-cai';
let ICRC2Token = [
  CK_BTC_CANISTER_ID,
  CK_ETH_LEDGER_CANISTER_ID,
  LEDGER_CANISTER_ID,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  SNS1Token,
  OCToken
];
let timer = null;
let hotSort = 0;
@Component({
  name: 'Index',
  components: {
    MiningInfo,
    Fallback,
    AccountInfo,
    TradeCompetitions,
    TradingCompetitions,
    TransferIcp,
    TransferToken,
    ProOrder,
    ProWalletSwap,
    WithdrawToken,
    Launch,
    draggable
  },
  filters: {
    stoUpdateFee(poFee1: bigint, decimals: number): string {
      return new BigNumber(poFee1.toString(10))
        .times(0.05)
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
      } else if (
        token1 &&
        (token1.toLocaleLowerCase().includes('usdc') ||
          token1.toLocaleLowerCase().includes('test'))
      ) {
        price = currentMarketPrice['usdc'];
      } else if (token1 && token1.toLocaleLowerCase().includes('usdt')) {
        price = currentMarketPrice['usdt'];
      } else if (token1 && token1.toLocaleLowerCase().includes('btc')) {
        price = currentMarketPrice['btc'];
      } else if (token1 && token1.toLocaleLowerCase().includes('eth')) {
        price = currentMarketPrice['eth'];
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
    },
    filterKeepingBalance(
      keepingBalance: string,
      stopBalance: bigint,
      decimals: number,
      max: number
    ): string {
      const n = new BigNumber(keepingBalance)
        .plus(stopBalance.toString(10))
        .div(10 ** decimals);
      if (n.gt(10 ** 7)) {
        return n.decimalPlaces(0, 1).toString(10);
      } else if (n.gt(10 ** 5)) {
        return n.decimalPlaces(Math.min(2, decimals), 1).toString(10);
      } else {
        return n.decimalPlaces(Math.min(decimals, max), 1).toString(10);
      }
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
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  private currentICDexService: ICDexService;
  private astroXUserService: AstroXUserService;
  private ICDexRouterService: ICDexRouterService = null;
  private ICLighthouseService: ICLighthouseService = null;
  private NftService: NftService = null;
  private NFTsExt: Array<TokenExt> | Array<NFT> = [];
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
  private timerAccount = null;
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
  private currentMarketPrice: { [key: string]: string } = {
    usdc: '1',
    usdt: '1'
  };
  private orderTypeEnum = OrderTypeEnum;
  private orderType: OrderTypeMenu | 'Pro' | 'Stop-limit' = OrderTypeEnum.LMT;
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
  private stopLimitNeed: { token0: bigint; token1: bigint } = {
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
  private tradesMenu = [
    {
      value: 'std',
      name: 'Std-trades'
    },
    {
      value: 'pro',
      name: 'Pro-trades'
    }
  ];
  private currentTradesMenu = 'std';
  private tradeMenu = [
    {
      value: 'pending',
      name: 'Open Orders'
    },
    {
      value: 'history',
      name: 'Trade History'
    },
    {
      value: 'stop',
      name: 'Stop-limit Orders'
    }
    // ,
    // {
    //   value: 'pro',
    //   name: 'Pro'
    // }
  ];
  private currentTradeMenu = 'pending';
  private tradeMenuPro = [
    {
      value: 'pending',
      name: 'Open Orders'
    },
    {
      value: 'history',
      name: 'Trade History'
    },
    {
      value: 'orders',
      name: 'Pro Orders'
    }
  ];
  private currentTradeMenuPro = 'orders';
  private proTimer = null;
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
    value: '1D',
    key: 24 * 60 * 60
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
  ];
  private pairInfo: PairInfo = null;
  private sysMode: { mode: SysMode; openingTime: Time } = null;
  private isPaused = false;
  private isIDOPaused = false;
  private IDOConfig: IDOConfig = null;
  private qualification: Participant = null;
  private preparedLoading = false;
  private cancelId = null;
  private prepare: { [key: string]: TxAccount } = {};
  private prepareOrder: { [key: string]: Array<number> } = {};
  private orderQueue: { [key: string]: Array<any> } = {}; // Each item will be a function to be executed;
  private tradeCompetitionsEnum = TradeCompetitionsEnum;
  private tradeCompetitionsMenu: TradeCompetitionsMenu = null;
  private isToSetReferrer = false;
  private proPendingOrdersModel = false;
  private proPendingOrders: STOrderPendingOrders = {
    buy: [],
    sell: []
  };
  private oldPairs = [
    'scjza-fiaaa-aaaak-ac2kq-cai',
    'ig3ej-haaaa-aaaak-adrva-cai',
    'oru4a-nqaaa-aaaak-acufa-cai',
    '5t3ek-haaaa-aaaar-qadia-cai',
    '7aehk-pyaaa-aaaar-qadgq-cai'
  ];
  private dragPair: DePairs = null;
  private prePairs: Array<string> = [];
  private star: Array<string> = [];
  private allPairs = {
    Markets: {
      Main: [],
      Second: [],
      Third: [],
      Hot: []
    },
    ICP: {
      Main: [],
      Second: [],
      Third: [],
      Hot: []
    },
    USDT: {
      Main: [],
      Second: [],
      Third: [],
      Hot: []
    },
    USDC: {
      Main: [],
      Second: [],
      Third: [],
      Hot: []
    },
    OTHER: {
      Main: [],
      Second: [],
      Third: [],
      Hot: []
    }
  };
  private tradePairs = {
    Star: [],
    Main: [],
    Second: [],
    Third: [],
    Hot: [],
    Search: []
  };
  private tradeMarketSort = [
    {
      name: 'Star',
      value: 'Star'
    },
    {
      name: 'HOT',
      value: 'Hot'
    },
    {
      name: 'MAIN',
      value: 'Main'
    },
    {
      name: 'RISING',
      value: 'Second'
    },
    {
      name: 'HIGH RISK',
      value: 'Third'
    }
    // ,
    // {
    //   name: 'Pre-ver',
    //   value: 'Old'
    // }
  ];
  private marketMenu = [
    {
      name: 'Markets',
      value: 'Markets'
    },
    {
      name: 'ICP',
      value: 'ICP'
    },
    {
      name: 'USDT',
      value: 'USDT'
    },
    {
      name: 'USDC',
      value: 'USDC'
    },
    {
      name: 'OTHER',
      value: 'OTHER'
    }
  ];
  private currentMarketMenu = 'Markets';
  private selectMarket = false;
  private marketMenuVisible = false;
  private swapConfig: SwapConfig = null;
  private debugPairs: { [key: string]: string } = {};
  private currentTradeMarketSort: string = null;
  private pairSearch = '';
  private showThird = true;
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
  private sysConfig: SysConfig = null;
  // Tour
  // private steps = [];
  private myCallbacks = {};
  private oldICL = '5573k-xaaaa-aaaak-aacnq-cai';
  private drag = false;
  private dragOptions = {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost'
  };
  private pairsScroll = [];
  private isMarket = false;
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
  @Watch('currentTradeMarketSort')
  private onCurrentTradeMarketSort(val) {
    const pairs = [];
    if (val && this.tradePairs[val].length) {
      this.tradePairs[val].forEach((pair) => {
        pairs.push({
          id: pair[1][0].canisterId.toString(),
          pair: pair
        });
      });
    }
    this.pairsScroll = pairs;
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
    if (
      this.currentTokenPrice &&
      this.currentTokenPrice !== '-' &&
      this.currentPair
    ) {
      let price = '';
      const basePrice = this.getBasePrice(this.currentPair[1][0].token1[1]);
      price = new BigNumber(this.currentTokenPrice)
        .times(basePrice)
        .decimalPlaces(8)
        .toString(10);
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
        if (this.orderType === 'Stop-limit' && this.stoConfig) {
          // fee = this.stoConfig.sloFee1.toString(10);
        } else {
          fee = '0';
        }
        maxBuyAmount = new BigNumber(this.tokensBalance[token1Id])
          .plus(keepingBalance)
          .minus(tokenFee.toString(10))
          .minus(tokenFee.toString(10))
          // .minus(this.stopLimitNeed.token1.toString(10))
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
          // .minus(this.stopLimitNeed.token0.toString(10))
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
      this.tokens[this.currentPair[1][0].token0[0].toString()] &&
      this.tokens[this.currentPair[1][0].token1[0].toString()]
    ) {
      const token1Decimals =
        this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
      const token0Decimals =
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
      if (token1Decimals - this.tokenMinUnit > 0) {
        let unit = token1Decimals - this.tokenMinUnit;
        if (unit > 8) {
          unit = 8;
        }
        if (this.currentPair[2] && this.currentPair[2].price) {
          const price = new BigNumber(this.currentPair[2].price)
            .times(10 ** token0Decimals)
            .div(10 ** token1Decimals)
            .toNumber();
          // if (price >= 1 && unit > 4) {
          //   unit = 4;
          // }
        }
        return unit;
      } else {
        return 0;
      }
    } else {
      return 8;
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
          return type === 'Prepared' || type === 'Trading' || type === 'Todo';
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
    EventBus.$on('changeLaunch', () => {
      this.getDexPairs('icdex');
    });
    EventBus.$on('launchSuccess', () => {
      this.getDexPairs('icdex');
    });
    if (this.$route.params.token0 && this.$route.params.token1) {
      document.title = `${this.$route.params.token0}/${this.$route.params.token1} - ICDex (Orderbook Dex)`;
    }
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.currentICDexService = new ICDexService();
    this.ICDexRouterService = new ICDexRouterService();
    this.ICLighthouseService = new ICLighthouseService();
    this.NftService = new NftService();
    window.addEventListener('resize', this.setFocusin);
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
    try {
      this.getDexPairs('icdex').then(() => {
        // const tour = localStorage.getItem('confirmOldTrade');
        // if (!tour) {
        //   this.$nextTick(() => {
        //     this.$tours['myTour'].start();
        //   });
        // }
      });
      this.getSysConfig();
      this.getDebugPairs();
      this.getIcpPrice();
      this.initFallbackInfo();
      // this.principal = principal;
      if (this.getPrincipalId) {
        const currentInfo =
          JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
        this.tokensBalance = currentInfo.tokensBalance || {};
        this.getNTFs();
      }
    } catch (e) {
      //
    }
    // this.steps = [
    //   {
    //     target: '.trade-market-old',
    //     content:
    //       'These are trading pairs from the previous version and will be closed after one month, please cancel all unfilled orders.',
    //     params: {
    //       enableScrolling: false
    //       // placement: 'right'
    //     }
    //   }
    // ];
    this.myCallbacks = {
      onFinish: this.stepCallbacks
    };
  }
  private getBasePrice(tokenSymbol: string): string {
    let price = this.currentMarketPrice['usdt'];
    if (
      tokenSymbol.toLocaleLowerCase().includes('icp') &&
      this.currentMarketPrice['icp']
    ) {
      price = this.currentMarketPrice['icp'];
    } else if (
      tokenSymbol.toLocaleLowerCase().includes('usdc') &&
      this.currentMarketPrice['usdc']
    ) {
      price = this.currentMarketPrice['usdc'];
    } else if (
      tokenSymbol.toLocaleLowerCase().includes('btc') &&
      this.currentMarketPrice['btc']
    ) {
      price = this.currentMarketPrice['btc'];
    } else if (
      tokenSymbol.toLocaleLowerCase().includes('eth') &&
      this.currentMarketPrice['eth']
    ) {
      price = this.currentMarketPrice['eth'];
    }
    return price;
  }
  private async getNTFs(): Promise<void> {
    const res = await this.NftService.tokens_ext();
    const tokensExt = (
      res as {
        ok: TokensExt;
      }
    ).ok;
    if (tokensExt && tokensExt.length) {
      this.NFTsExt = tokensExt;
    } else {
      this.NFTsExt = [];
    }
    if (!this.NFTsExt.length) {
      this.NFTsExt = await this.ICDexRouterService.NFTBalance(
        this.getPrincipalId
      );
    }
    if (!this.NFTsExt.length) {
      this.NFTsExt = await this.ICSwapRouterFiduciaryService.NFTBalance(
        this.getPrincipalId
      );
    }
  }
  private getDuration(val: bigint): string {
    const duration = require('dayjs/plugin/duration');
    dayjs.extend(duration);
    const interval = dayjs.duration(Number(val), 'seconds');
    const d = interval.asDays();
    const h = interval.hours();
    const m = interval.minutes();
    const s = interval.seconds();
    if (d >= 1) {
      const day = Math.floor(d);
      return `${day}d ${h}h ${m}m ${s}s`;
    } else {
      return `${h}h ${m}m ${s}s`;
    }
  }
  private stepCallbacks(): void {
    localStorage.setItem('confirmOldTrade', 'true');
  }
  private getStopLimitNeed(): { token0: bigint; token1: bigint } {
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
        this.$cookies.set('referral', JSON.stringify(referral));
      } catch (e) {}
    }
  }
  private changeTradeCompetitionsMenu(menu: TradeCompetitionsMenu): void {
    if (menu === TradeCompetitionsEnum.Pools) {
      this.$router.push(`/ICDex/pools/?pair=${this.currentPair[0].toString()}`);
      this.tradeCompetitionsMenu = menu;
    } else {
      this.tradeCompetitionsMenu = menu;
      (this.$refs.tradeCompetitions as any).init(menu);
    }
  }
  private infoBack(): void {
    this.tradeCompetitionsMenu = null;
  }
  private setFocusin(): void {
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
    if (this.currentPair) {
      this.getLevel100(this.currentPair[0].toString());
    }
  }
  private async pushUser(): Promise<void> {
    const icxPrincipals =
      JSON.parse(localStorage.getItem('icxPrincipals')) || [];
    const address = principalToAccountIdentifier(
      Principal.fromText(this.getPrincipalId)
    );
    await this.astroXUserService.pushUser(address, icxPrincipals[0]);
  }
  private showFallback(): void {
    (this.$refs as any).fallback.fallbackVisible = true;
    (this.$refs as any).fallback.init();
  }
  private async getMakerRebate(): Promise<void> {
    if (this.getPrincipalId) {
      const currentPair = this.currentPair[0].toString();
      const res = await this.currentICDexService.makerRebate(
        currentPair,
        this.getPrincipalId
      );
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
      this.orderType === 'Stop-limit' &&
      this.stoConfig &&
      tokenId === token1Id
    ) {
      // fee = this.stoConfig.sloFee1.toString(10);
    } else {
      fee = '0';
    }
    let stopLimitNeed = '0';
    if (tokenId === token1Id) {
      // stopLimitNeed = this.stopLimitNeed.token1.toString(10);
    } else {
      // stopLimitNeed = this.stopLimitNeed.token0.toString(10);
    }
    return new BigNumber(this.tokensBalance[tokenId])
      .plus(keepingBalance)
      .minus(tokenFee.toString(10))
      .minus(fee)
      .minus(stopLimitNeed)
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
      value: '1D',
      key: 24 * 60 * 60
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
    this.clearIntervalPro();
    window.clearInterval(this.timerAccount);
    this.timerAccount = null;
    try {
      dispose('kInterval-chart');
    } catch (e) {}
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
      this.kLineChart.applyNewData(this.splitData(this.KIntervals));
    }
    window.clearInterval(this.timerQuotes);
    this.timerQuotes = null;
    this.timerQuotes = setTimeout(async () => {
      if (this.$route.name === 'ICDex') {
        await this.getQuotes(swapId);
      }
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
    if (
      this.tokens &&
      this.tokens[this.currentPair[1][0].token0[0].toString()] &&
      this.tokens[this.currentPair[1][0].token1[0].toString()] &&
      data &&
      data.length
    ) {
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
    if (this.orderType !== 'MKT' && this.orderType !== 'Stop-limit') {
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
  private changeTradesMenu(value: string) {
    this.currentTradesMenu = value;
    this.clearIntervalPro();
    if (value === 'pro') {
      this.currentTradeMenuPro = 'pending';
      this.getPendingListPro();
      this.proTimer = window.setInterval(() => {
        if (this.$route.name === 'ICDex') {
          this.getPendingListPro(false);
        }
      }, 10 * 1000);
      this.getProOrders(this.currentPair[0].toString(), this.getPrincipalId);
      const address = principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId),
        new Uint8Array(fromSubAccountId(ProSubaccountId))
      );
      this.getTradeList(this.currentPair[0].toString(), address, true);
    }
  }
  private changeTradeMenu(value: string) {
    this.currentTradeMenu = value;
  }
  private changeTradeMenuPro(value: string) {
    if (value === this.currentTradeMenuPro) {
      return;
    }
    this.currentTradeMenuPro = value;
    this.clearIntervalPro();
    if (value === 'orders') {
      this.proTimer = window.setInterval(() => {
        if (this.$route.name === 'ICDex') {
          this.getProOrders(
            this.currentPair[0].toString(),
            this.getPrincipalId,
            false
          );
        }
      }, 10 * 1000);
    } else if (value === 'pending') {
      this.proTimer = window.setInterval(() => {
        if (this.$route.name === 'ICDex') {
          this.getPendingListPro(false);
        }
      }, 10 * 1000);
    } else if (value === 'history') {
      const address = principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId),
        new Uint8Array(fromSubAccountId(ProSubaccountId))
      );
      this.proTimer = window.setInterval(() => {
        if (this.$route.name === 'ICDex') {
          this.getTradeList(
            this.currentPair[0].toString(),
            address,
            true,
            false
          );
        }
      }, 10 * 1000);
    }
  }
  private clearIntervalPro(): void {
    if (this.proTimer) {
      window.clearInterval(this.proTimer);
      this.proTimer = null;
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
    if (this.prePairs.includes(this.currentPair[0].toString())) {
      return;
    }
    const res = await this.currentICDexService.sto_getAccountStopLimitOrders(
      swapId,
      principalToAccountIdentifier(Principal.fromText(principal))
    );
    if (res && res.pairId === this.currentPair[0].toString()) {
      this.stopOrders = res.orders;
    } else {
      this.stopOrders = [];
    }
    this.stopLimitNeed = this.getStopLimitNeed();
  }
  private async getProOrders(
    swapId: string,
    principal: string,
    isInit = true
  ): Promise<void> {
    if (!principal) {
      return;
    }
    const currentTime = Date.now();
    if (!isInit && lastCallTime && currentTime - lastCallTime < interval) {
      return;
    }
    if (isInit) {
      this.proOrdersLoading = true;
    }
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
    isPro = false,
    isInit = true
  ): Promise<void> {
    if (!this.getPrincipalId) {
      return;
    }
    if (isPro && !isInit) {
      const currentTime = Date.now();
      if (lastCallTime && currentTime - lastCallTime < interval) {
        return;
      }
    }
    if (isPro && isInit) {
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
          this.userRecordPro = removeDuplicateObj(res.records).slice(0, 50);
        } else {
          this.userRecord = removeDuplicateObj(res.records).slice(0, 50);
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
    if (
      less1H &&
      !order.filled.length &&
      this.dexRole &&
      !this.dexRole.vipMaker
    ) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      const side = this.filterSide(order.orderPrice);
      let minimum = '';
      let maximum = '';
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
        maximum =
          new BigNumber(tokenFee)
            .times(1000)
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
        maximum =
          new BigNumber(tokenFee)
            .times(1000)
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
        content: `The order not filled will be charged a ${fee}% (minimum ${minimum} and maximum ${maximum}) cancellation fee if cancelled within 1h of being placed.`,
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
  private canRun(item: STOrder = null): boolean {
    if (
      this.currentPair &&
      this.tokens &&
      this.tokens[this.currentPair[1][0].token0[0].toString()].decimals &&
      this.tokens[this.currentPair[1][0].token1[0].toString()].decimals
    ) {
      const token0Id = this.currentPair[1][0].token0[0].toString();
      const token1Id = this.currentPair[1][0].token1[0].toString();
      const unitSize100 = new BigNumber(this.unit.toString(10))
        .times(100)
        .toString(10);
      const unitSize100Token1 = new BigNumber(unitSize100)
        .times(this.currentTokenPrice)
        .toString(10);
      if (
        !item &&
        new BigNumber(this.tokensBalanceSto[token0Id]).lt(unitSize100) &&
        new BigNumber(this.tokensBalanceSto[token1Id]).lt(unitSize100Token1) &&
        new BigNumber(this.keepingBalanceSto[token0Id]).lt(unitSize100) &&
        new BigNumber(this.keepingBalanceSto[token1Id]).lt(unitSize100Token1)
      ) {
        const value = new BigNumber(unitSize100)
          .div(10 ** this.tokens[token0Id].decimals)
          .toString(10);
        this.$message.error(
          `Pro-orders require that the Trader Account's ${this.tokens[token0Id].symbol} or ${this.tokens[token1Id].symbol} balance is not less than the value of ${value} ${this.tokens[token0Id].symbol}.`
        );
        return false;
      } else if (item) {
        const type = Object.keys(
          (item.strategy as { IcebergOrder: IcebergOrder }).IcebergOrder.setting
            .order.side
        )[0];
        if (type === 'Buy') {
          if (
            new BigNumber(this.keepingBalanceSto[token1Id]).lt(
              unitSize100Token1
            )
          ) {
            const value = new BigNumber(unitSize100Token1)
              .div(10 ** this.tokens[token1Id].decimals)
              .toString(10);
            this.$message.error(
              `The Trader Account's ${this.tokens[token1Id].symbol} balance is not less than the value of ${value} ${this.tokens[token1Id].symbol}.`
            );
            return false;
          } else {
            return true;
          }
        } else if (type === 'Sell') {
          if (new BigNumber(this.keepingBalanceSto[token0Id]).lt(unitSize100)) {
            const value = new BigNumber(unitSize100)
              .div(10 ** this.tokens[token0Id].decimals)
              .toString(10);
            this.$message.error(
              `The Trader Account's ${this.tokens[token0Id].symbol} balance is not less than the value of ${value} ${this.tokens[token0Id].symbol}.`
            );
            return false;
          } else {
            return true;
          }
        }
      } else {
        return true;
      }
    }
    return false;
  }
  private onCreateProOrder(item): void {
    this.orderType = 'Pro';
    this.currentProOrderMenu = item;
    if (!this.NFTsExt.length) {
      this.$info({
        content:
          'This feature is currently in the experimental stage and is for ICLighthouse Planet Cards NFT holders to experience and use only.',
        class: 'connect-plug',
        icon: 'connect-plug',
        centered: true,
        okText: 'Close'
      });
      return;
    }
    if (this.currentProOrderMenu === 'Iceberg') {
      // const flag = this.canRun();
      // if (!flag) {
      //   return;
      // }
    }
    (this.$refs as any).proOrder.init(this.currentProOrderMenu);
  }
  private showProOrderMenu(): void {
    const hasGrid = localStorage.getItem('GridWarn');
    if (hasGrid) {
      this.orderType = 'Pro';
      this.currentTradesMenu = 'pro';
      this.getProOrders(this.currentPair[0].toString(), this.getPrincipalId);
      if (this.isH5) {
        this.currentProOrderMenu = ProOrderEnum.Grid;
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
          _that.currentTradesMenu = 'pro';
          if (_that.isH5) {
            _that.proVisible = true;
          }
        }
      });
    }
  }
  private changeProOrderMenu(item): void {
    this.currentProOrderMenu = item;
  }
  private showProOrder(type: ProOrderMenu): void {
    this.currentProOrderMenu = type;
    const hasGrid = localStorage.getItem('GridWarn');
    if (hasGrid) {
      this.orderType = 'Pro';
      this.currentTradesMenu = 'pro';
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
          _that.currentTradesMenu = 'pro';
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
    this.$nextTick(() => {
      (this.$refs as any).proOrder.step = 2;
      (this.$refs as any).proOrder.update(item, this.currentProOrderMenu);
    });
  }
  private async toDeleteStopLimit(soid: bigint): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      await this.currentICDexService.sto_updateStopLimitOrder(
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
      if (toHttpRejectError(e)) {
        this.$message.error(toHttpRejectError(e));
      } else {
        this.$message.error('Error');
      }
    }
    loading.close();
  }
  private onDeleteStopLimit(soid: bigint): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this;
    this.$confirm({
      content: 'Are you sure you want to cancel this stop limit order?',
      class: 'connect-plug register-mining-confirm',
      icon: 'connect-plug',
      okText: 'Yes',
      cancelText: 'No',
      centered: true,
      onOk() {
        _that.toDeleteStopLimit(soid);
      }
    });
  }
  private async toDeleteProOrder(soid: bigint, type: STType): Promise<void> {
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
    } else if (stType === 'TWAP') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          TWAP: {
            status: [{ Deleted: null }],
            setting: []
          }
        },
        ProSubaccountId
      );
    } else if (stType === 'VWAP') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          VWAP: {
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
  private async onDeleteProOrder(soid: bigint, type: STType): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this;
    this.$confirm({
      content: 'Are you sure you want to delete this order?',
      class: 'connect-plug register-mining-confirm',
      icon: 'connect-plug',
      okText: 'Yes',
      cancelText: 'No',
      centered: true,
      onOk() {
        _that.toDeleteProOrder(soid, type);
      }
    });
  }
  private async onRunningProOrder(
    soid: bigint,
    type: STType,
    item: STOrder
  ): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const stType = Object.keys(type)[0];
    if (stType !== 'GridOrder') {
      const end = new BigNumber(
        item.strategy[Object.keys(item.strategy)[0]].setting.endTime.toString(
          10
        )
      ).times(1000);
      const now = new Date().getTime();
      if (end.lte(now)) {
        this.$message.error('The end time must be set to a future time.');
        loading.close();
        return;
      }
    }
    (this.$refs as any).proOrder.type = 'update';
    if (!this.dexRole.vipMaker) {
      const flag = await (this.$refs as any).proOrder.stoFee();
      if (!flag) {
        loading.close();
        return;
      }
    }
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
      const canRun = this.canRun(item);
      if (!canRun) {
        loading.close();
        return;
      }
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
    } else if (stType === 'TWAP') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          TWAP: {
            status: [{ Running: null }],
            setting: []
          }
        },
        ProSubaccountId
      );
    } else if (stType === 'VWAP') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          VWAP: {
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
    } else if (stType === 'TWAP') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          TWAP: {
            status: [{ Stopped: null }],
            setting: []
          }
        },
        ProSubaccountId
      );
    } else if (stType === 'VWAP') {
      await this.currentICDexService.sto_updateProOrder(
        this.currentPair[0].toString(),
        soid,
        {
          VWAP: {
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
  private showPendingOrders(value: STOrderPendingOrders): void {
    if (!value.buy.length && !value.sell.length) {
      return;
    }
    value.buy.sort((a, b) => {
      if (new BigNumber(b[1].toString(10)).lt(a[1].toString(10))) {
        return -1;
      } else {
        return 1;
      }
    });
    value.sell.sort((a, b) => {
      if (new BigNumber(b[1].toString(10)).lt(a[1].toString(10))) {
        return -1;
      } else {
        return 1;
      }
    });
    this.proPendingOrders = value;
    this.proPendingOrdersModel = true;
  }
  private async onCancel(order: TradingOrder, isPro: boolean): Promise<void> {
    if (
      this.pairInfo &&
      this.pairInfo.paused &&
      this.debugPairs &&
      ((this.debugPairs[this.currentPair[0].toString()] &&
        this.debugPairs[this.currentPair[0].toString()] !==
          this.getPrincipalId) ||
        !this.debugPairs[this.currentPair[0].toString()])
    ) {
      this.$message.error('This pair is under maintenance, try again later.');
      return;
    }
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    this.cancelId = order.txid;
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
          this.getAccountInitIntervalPrice(6);
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
        loading.close();
        this.$message.error(toHttpRejectError(e));
        // this.$message.error('Cancel Error');
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
    const currentPair = this.currentPair[0].toString();
    const res = await this.currentICDexService.pending(
      currentPair,
      [
        principalToAccountIdentifier(
          Principal.fromText(this.getPrincipalId),
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
  private async getPendingListPro(isInit = true): Promise<void> {
    if (!this.getPrincipalId) {
      return;
    }
    const currentTime = Date.now();
    if (!isInit && lastCallTime && currentTime - lastCallTime < interval) {
      return;
    }
    if (isInit) {
      this.proOrdersPendingLoading = true;
    }
    let pendingList: Array<PendingList> = [];
    const currentPendingPage = 1;
    const res = await this.getMorePending(
      currentPendingPage,
      pendingList,
      ProSubaccountId
    );
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
      const pendingTxIds = [];
      let maxNonce = BigInt('0');
      if (res && res.length) {
        this.pendingList = res.sort(
          (a, b) => Number(b[1].time) - Number(a[1].time)
        );
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
      } else {
        this.pendingList = [];
      }
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
              this.statusByTxid(currentPairId, preparedList);
            }
            this.pendingList.unshift(preparedList);
          }
        }
      }
      this.totalPending = this.pendingList.length;
      if (this.totalPending <= 10) {
        this.currentPendingPage = 1;
      }
    } catch (e) {}
    this.getToStatus(swapId);
    this.pendingLoading = false;
  }
  private statusByTxid(currentPairId: string, preparedList: PendingList): void {
    const status = Object.keys(preparedList[1].status)[0];
    if (
      status !== 'Prepared' &&
      status !== 'Trading' &&
      status !== 'Todo' &&
      status !== 'Pending'
    ) {
      return;
    }
    this.currentICDexService
      .statusByTxid(currentPairId, preparedList[0])
      .then((res) => {
        if (res && res.pairId === this.currentPair[0].toString()) {
          const orderStatus = Object.keys(res.orderStatusResponse)[0];
          if (
            orderStatus === 'Pending' ||
            orderStatus === 'Failed' ||
            orderStatus === 'Completed'
          ) {
            if (this.currentPair[0].toString() === currentPairId) {
              if (orderStatus === 'Pending' || orderStatus === 'Failed') {
                const current = Object.values(res.orderStatusResponse)[0];
                if (orderStatus === 'Failed') {
                  current.status = {
                    Fail: null
                  };
                }
                this.$set(preparedList, 1, current);
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
      this.currentTradesMenu === 'pro' &&
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
            tradingOrderStatus === 'Prepared' ||
            tradingOrderStatus === 'Trading'
          );
        });
        if (isTodo) {
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
          tradingOrderStatus === 'Prepared' ||
          tradingOrderStatus === 'Trading'
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
          this.getAccountInitIntervalPrice(6);
        }
      } else {
        if (this.time !== 10) {
          this.getAccountInitIntervalPrice();
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
        } catch (e) {}
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
    if (tradingOrderStatus === 'Trading') {
      status = 'Trading';
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
    } catch (e) {}
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
    if (this.getPrincipalId) {
      const currentAddress = principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId)
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
        return false;
      }
    } else if (tokenStd.toLocaleLowerCase() === PairTokenStdMenu.icrc2) {
      try {
        let subaccount = [];
        if (subAccountId) {
          subaccount = [fromSubAccountId(subAccountId)];
        }
        const res = await currentDrc20Token.icrc2_approve(
          tokenId,
          {
            owner: spender,
            subaccount: []
          },
          amount,
          subaccount
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
        return false;
      }
    }
  }
  private async onSellMKT(): Promise<void> {
    if (
      this.pairInfo &&
      this.pairInfo.paused &&
      this.debugPairs &&
      ((this.debugPairs[this.currentPair[0].toString()] &&
        this.debugPairs[this.currentPair[0].toString()] !==
          this.getPrincipalId) ||
        !this.debugPairs[this.currentPair[0].toString()])
    ) {
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
      this.plugLoading[currentPairId] = true;
      const address = principalToAccountIdentifier(
        Principal.from(this.getPrincipalId)
      );
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
      } else if (tokenId === LEDGER_CANISTER_ID) {
        approve = BigInt(
          new BigNumber(1000)
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
  private setStatusTrading(currentPairId: string, nonce: bigint): void {
    if (
      this.preparedList[currentPairId] &&
      this.preparedList[currentPairId].length
    ) {
      for (let i = 0; i < this.preparedList[currentPairId].length; i++) {
        const status = Object.keys(
          this.preparedList[currentPairId][i][1].status
        )[0];
        if (
          Number(this.preparedList[currentPairId][i][1].nonce) === Number(nonce)
        ) {
          if (status === 'Prepared') {
            this.preparedList[currentPairId][i][1].status = {
              Trading: null
            };
            this.$set(
              this.preparedList[currentPairId],
              i,
              this.preparedList[currentPairId][i]
            );
          }
          break;
        }
      }
    }
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
        const address = principalToAccountIdentifier(
          Principal.from(this.getPrincipalId)
        );
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
    if (!this.getPrincipalId) {
      return;
    }
    const address = principalToAccountIdentifier(
      Principal.from(this.getPrincipalId)
    );
    this.prepareOrder =
      JSON.parse(localStorage.getItem(`prepareOrder-${address}`)) || {};
    if (!this.prepareOrder[currentPairId]) {
      this.prepareOrder[currentPairId] = [];
    }
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
    const address = principalToAccountIdentifier(
      Principal.from(this.getPrincipalId)
    );
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
      if (!canTrade) {
        return;
      }
      const d = new Date().getTime();
      if (this.getPrincipalId) {
        const currentAddress = principalToAccountIdentifier(
          Principal.fromText(this.getPrincipalId)
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
        })
        .catch((e) => {
          this.initPending(currentPair, prepare, address);
          this.$message.error(toHttpRejectError(e));
          // this.$message.error('Order fail');
        })
        .finally(() => {
          if (this.currentTradeMarketSort === 'Hot') {
            this.sortHot();
          }
          if (this.IDOConfig && this.IDOConfig[0] && this.IDOConfig[1]) {
            const now = new Date().getTime();
            if (
              new BigNumber(this.IDOConfig[1].IDOOpeningTime.toString(10))
                .div(10 ** 6)
                .lt(now) &&
              new BigNumber(this.IDOConfig[1].IDOClosingTime.toString(10))
                .div(10 ** 6)
                .gt(now)
            ) {
              this.IDO_qualification(currentPair);
            }
          }
        });
      setTimeout(() => {
        this.plugLoading[currentPair[0].toString()] = false;
      }, 3000);
      this.executionQueue(currentPair, address);
      this.setStatusTrading(currentPair[0].toString(), prepare[2]);
      this.deletePrepare(currentPair[0].toString(), prepare[2]);
      this.getAccountInitIntervalPrice(6);
    } catch (e) {
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
      if (type === 'buy' && this.orderType === 'Stop-limit' && this.stoConfig) {
        total = BigInt(
          new BigNumber(total.toString())
            // .plus(this.stoConfig.sloFee1.toString(10))
            .toString(10)
        );
      }
      await this.getAccountSetting();
      let balance: string;
      let keepingBalance = '0';
      let needTransfer = total.toString(10);
      let needDeposit = '0';
      let stopLimitBalance = '0';
      if (type === 'buy') {
        // stopLimitBalance = this.stopLimitNeed.token1.toString(10);
      }
      if (type === 'sell') {
        // stopLimitBalance = this.stopLimitNeed.token0.toString(10);
      }
      keepingBalance = new BigNumber(this.keepingBalance[tokenId])
        .minus(stopLimitBalance)
        .toString(10);
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
          if (this.orderType !== 'Stop-limit') {
            this.$set(this.keepingBalance, tokenId, newKeepingBalance);
          }
          return true;
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
        // need transfer token to txAccount/depositAccount
        if (tokenStd === 'icp' || tokenStd === 'icrc1') {
          needTransfer = new BigNumber(needDeposit)
            .plus(getFee(this.tokens[tokenId]).toString(10))
            .toString(10);
        }
        balance = new BigNumber(this.tokensBalance[tokenId])
          .minus(needTransfer)
          .minus(getFee(this.tokens[tokenId]).toString(10))
          .toString(10);
        if (this.orderType !== 'Stop-limit') {
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
        if (this.orderType !== 'Stop-limit') {
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
        if (res === 'ErrAddress' || res === 'ErrDeposit') {
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
        } catch (e) {}
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
            if (depositRes === 'ErrDeposit') {
              return false;
            }
          }
        }
      }
      return true;
    } catch (e) {
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
      if (!canTrade) {
        return;
      }
      const d = new Date().getTime();
      if (this.getPrincipalId) {
        const currentAddress = principalToAccountIdentifier(
          Principal.fromText(this.getPrincipalId)
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
        })
        .catch((e) => {
          this.initPending(currentPair, prepare, address);
          this.$message.error(toHttpRejectError(e));
          // this.$message.error('Order fail');
        })
        .finally(() => {
          if (this.currentTradeMarketSort === 'Hot') {
            this.sortHot();
          }
          if (this.IDOConfig && this.IDOConfig[0] && this.IDOConfig[1]) {
            const now = new Date().getTime();
            if (
              new BigNumber(this.IDOConfig[1].IDOOpeningTime.toString(10))
                .div(10 ** 6)
                .lt(now) &&
              new BigNumber(this.IDOConfig[1].IDOClosingTime.toString(10))
                .div(10 ** 6)
                .gt(now)
            ) {
              this.IDO_qualification(currentPair);
            }
          }
        });
      this.setStatusTrading(currentPair[0].toString(), prepare[2]);
      setTimeout(() => {
        this.plugLoading[currentPair[0].toString()] = false;
      }, 3000);
      this.executionQueue(currentPair, address);
      this.deletePrepare(currentPair[0].toString(), prepare[2]);
      this.getAccountInitIntervalPrice(6);
    } catch (e) {
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
                    if (
                      toHexString(new Uint8Array(txid)) ===
                      toHexString(new Uint8Array(this.pendingList[i][0]))
                    ) {
                      if (status === 'Prepared' || status === 'Trading') {
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
                      if (
                        toHexString(new Uint8Array(txid)) ===
                        toHexString(
                          new Uint8Array(
                            this.preparedList[currentPair[0].toString()][i][0]
                          )
                        )
                      ) {
                        if (status === 'Prepared' || status === 'Trading') {
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
      } catch (e) {}
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
          onOk() {
            //
          }
        });
      } else if (errMessage.toLocaleLowerCase().includes('nonce error')) {
        this.$info({
          content: 'Nonce error, please re-order.',
          class: 'connect-plug',
          icon: 'connect-plug',
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
    } catch (e) {}
    if (this.orderQueue[currentPairId].length) {
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
    if (
      this.pairInfo &&
      this.pairInfo.paused &&
      (this.isPaused || (!this.isPaused && this.orderType !== 'LMT')) &&
      this.debugPairs &&
      ((this.debugPairs[this.currentPair[0].toString()] &&
        this.debugPairs[this.currentPair[0].toString()] !==
          this.getPrincipalId) ||
        !this.debugPairs[this.currentPair[0].toString()])
    ) {
      this.$message.warning('Trading pair has been paused.');
      return;
    }
    this.isToSell = true;
    const token0Id = this.currentPair[1][0].token0[0].toString();
    const token1Id = this.currentPair[1][0].token1[0].toString();
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
      if (this.orderType === 'LMT' && !this.isPaused) {
        if (this.IDOConfig[1].IDOSupplies.length) {
          let flag = false;
          let IDOPrice = '';
          const hasPrice = [];
          this.level100[1].ask.forEach((item) => {
            const price = new BigNumber(item.price.toString(10))
              .div(10 ** this.tokens[token1Id].decimals)
              .div(
                new BigNumber(this.unit.toString(10)).div(
                  10 ** this.tokens[token0Id].decimals
                )
              )
              .toString(10);
            hasPrice.push(price);
          });
          if (hasPrice.length === this.IDOConfig[1].IDOSupplies.length) {
            this.$message.warning('IDO has completed the pending order');
            return;
          }
          for (let i = 0; i < this.IDOConfig[1].IDOSupplies.length; i++) {
            const IDOSupplies = this.IDOConfig[1].IDOSupplies[i];
            const price = new BigNumber(IDOSupplies.price.toString(10))
              .div(10 ** this.tokens[token1Id].decimals)
              .div(
                new BigNumber(this.unit.toString(10)).div(
                  10 ** this.tokens[token0Id].decimals
                )
              )
              .toString(10);
            if (!hasPrice.includes(price)) {
              if (i === 0) {
                IDOPrice = price;
              } else {
                IDOPrice = IDOPrice + ' or ' + price;
              }
              if (price === this.sellPrice) {
                const quantity = new BigNumber(IDOSupplies.supply.toString(10))
                  .div(10 ** this.tokens[token0Id].decimals)
                  .toString(10);
                if (quantity === this.sellAmount) {
                  flag = true;
                } else {
                  IDOPrice = '';
                  this.$message.warning(`Quantity must be ${quantity}.`);
                }
                break;
              }
            }
          }
          if (!flag) {
            if (IDOPrice) {
              this.$message.warning(`Price must be ${IDOPrice}.`);
            }
            return;
          }
        }
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
            icon: 'connect-plug'
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
      const fee = new BigNumber(getFee(this.tokens[token0Id]).toString(10))
        .div(10 ** this.tokens[token0Id].decimals)
        .times(2);
      if (new BigNumber(fee).gte(this.sellAmount)) {
        this.$message.error(`Quantity must be more than ${fee}`);
        return;
      }
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
      this.plugLoading[currentPairId] = true;
      const address = principalToAccountIdentifier(
        Principal.from(this.getPrincipalId)
      );
      if (this.orderType === 'Stop-limit') {
        const order = {
          side: { Sell: null },
          quantity: amount,
          price: price
        };
        const triggerPrice = new BigNumber(this.stopSellPrice)
          .times(10 ** this.tokens[token1Id].decimals)
          .times(new BigNumber(this.unit.toString(10)).div(10 ** tokenDecimals))
          .toString(10);
        const min = new BigNumber(this.unit.toString(10))
          .div(10 ** tokenDecimals)
          .times(100)
          .toString(10);
        let totalAmount = this.sellAmount;
        if (new BigNumber(totalAmount).lt(min)) {
          totalAmount = min;
        }
        const token0Id = this.currentPair[1][0].token0[0].toString();
        if (
          new BigNumber(this.keepingBalance[token0Id])
            .plus(this.tokensBalance[token0Id])
            .minus(getFee(this.tokens[token0Id]).toString(10))
            .minus(getFee(this.tokens[token0Id]).toString(10))
            .div(10 ** tokenDecimals)
            .lt(totalAmount)
        ) {
          this.$message.error(
            `You should make a deposit first (Minimum amount: ${min} ${this.tokens[token0Id].symbol})`
          );
          return;
        }
        this.onStopLimit(
          order,
          BigInt(triggerPrice),
          totalAmount,
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
    this.getTradeList(currentPair[0].toString(), this.getPrincipalId);
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
  private async updateTokenInfo(): Promise<void> {
    if (this.currentPair) {
      const token0 = this.currentPair[1][0].token0;
      if (token0) {
        getTokenInfo(token0[0], token0[2]).then((info) => {
          if (
            info.name !== this.tokens[token0[0].toString()].name ||
            info.symbol !== this.tokens[token0[0].toString()].symbol ||
            info.decimals !== this.tokens[token0[0].toString()].decimals ||
            getFee(info).toString(10) !== this.tokens[token0[0].toString()].fee
          ) {
            this.$set(this.tokens, token0[0].toString(), info);
          }
        });
      }
      const token1 = this.currentPair[1][0].token1;
      if (token1) {
        getTokenInfo(token1[0], token1[2]).then((info) => {
          if (
            info.name !== this.tokens[token1[0].toString()].name ||
            info.symbol !== this.tokens[token1[0].toString()].symbol ||
            info.decimals !== this.tokens[token1[0].toString()].decimals ||
            getFee(info).toString(10) !== this.tokens[token1[0].toString()].fee
          ) {
            this.$set(this.tokens, token1[0].toString(), info);
          }
        });
      }
    }
  }
  private async getSysConfig(): Promise<void> {
    this.sysConfig = await this.ICDexRouterService.sys_getConfig();
    const sysToken = this.sysConfig.sysToken;
    if (!this.tokens[sysToken.toString()]) {
      getTokenInfo(sysToken, { icrc2: null }).then((res) => {
        this.$set(this.tokens, sysToken.toString(), res);
      });
    }
  }
  private async getStoConfig(): Promise<void> {
    if (this.prePairs.includes(this.currentPair[0].toString())) {
      return;
    }
    const currentPair = this.currentPair[0].toString();
    const res = await this.currentICDexService.sto_getConfig(currentPair);
    if (res && res.pairId === this.currentPair[0].toString()) {
      this.stoConfig = res.stoSetting;
    }
  }
  private async initAccount(): Promise<void> {
    if (this.getPrincipalId) {
      await this.getAccountSetting();
      this.getDepositBalance();
    }
  }
  private transferICLToPro(): void {
    const tokenInfo: SwapTokenInfo = [
      Principal.fromText(IC_LIGHTHOUSE_TOKEN_CANISTER_ID),
      'ICL',
      { icrc1: null }
    ];
    this.getTokenBalance(tokenInfo);
    this.getTokenBalanceSto(tokenInfo);
  }
  private proWalletSwapSuccess(): void {
    const token0Info = this.currentPair[1][0].token0;
    const token1Info = this.currentPair[1][0].token1;
    this.getTokenBalance(token0Info);
    this.getTokenBalance(token1Info);
    this.getTokenBalanceSto(token0Info);
    this.getTokenBalanceSto(token1Info);
    if (
      token0Info[0].toString() !== IC_LIGHTHOUSE_TOKEN_CANISTER_ID &&
      token1Info[0].toString() !== IC_LIGHTHOUSE_TOKEN_CANISTER_ID
    ) {
      this.transferICLToPro();
    }
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
    let needApprove = new BigNumber(amount)
      .plus(getFee(this.tokens[tokenInfo[0].toString()]).toString(10))
      .toString(10);
    // todo approve
    needApprove = new BigNumber(amount)
      .plus(getFee(this.tokens[tokenInfo[0].toString()]).toString(10))
      .plus(getFee(this.tokens[tokenInfo[0].toString()]).toString(10))
      .toString(10);
    if (
      (std.toLocaleLowerCase() === 'drc20' ||
        std.toLocaleLowerCase() === 'icrc2') &&
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
    const depositRes = await this.deposit(
      address,
      this.currentPair,
      token,
      BigInt(amount),
      subAccountId
    );
    if (depositRes === 'ErrAddress') {
      return;
    }
    if (depositRes === 'ErrDeposit') {
      return;
    }
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
      // (this.$refs as any).transferIcp.transferButton = 'Deposit';
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
        canisterId: token[0],
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
  private async withdrawSuccess(): Promise<void> {
    this.getDepositBalance();
  }
  private async onKeepingBalance(
    pair: DePairs,
    isToken0 = true,
    isPro = false
  ): Promise<void> {
    this.isToken0 = isToken0;
    this.currentToken = null;
    let subaccountId = 0;
    if (isPro) {
      subaccountId = 1;
    }
    let token = pair[1][0].token0;
    if (!isToken0) {
      token = pair[1][0].token1;
    }
    const std = Object.keys(token[2])[0];
    let balance;
    let standard;
    const currentToken = new AddTokenItemClass();
    if (std.toLocaleLowerCase() === 'icp') {
      standard = 'ICP';
    } else if (std.toLocaleLowerCase() === 'drc20') {
      standard = 'DRC20';
    } else if (std.toLocaleLowerCase() === 'icrc1') {
      standard = 'ICRC-1';
    } else if (std.toLocaleLowerCase() === 'icrc2') {
      standard = 'ICRC-2';
    } else {
      return;
    }
    const decimals = this.tokens[token[0].toString()].decimals;
    if (isPro) {
      balance = new BigNumber(this.keepingBalanceSto[token[0].toString()])
        .div(10 ** decimals)
        .toString(10);
    } else {
      balance = new BigNumber(this.keepingBalance[token[0].toString()])
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
    (this.$refs as any).withdrawToken.init(
      this.currentToken,
      isToken0,
      subaccountId
    );
    // const loading = this.$loading({
    //   lock: true,
    //   background: 'rgba(0, 0, 0, 0.5)'
    // });
    // let res;
    //
    // if (isPro) {
    //   // pro subaccount
    //   res = await this.currentICDexService.withdraw(
    //     pair[0].toString(),
    //     isToken0 ? [] : [BigInt(0)],
    //     isToken0 ? [BigInt(0)] : [],
    //     1
    //   );
    // } else {
    //   res = await this.currentICDexService.withdraw(
    //     pair[0].toString(),
    //     isToken0
    //       ? [
    //           BigInt(
    //             this.keepingBalance[this.currentPair[1][0].token0[0].toString()]
    //           )
    //         ]
    //       : [BigInt(0)],
    //     isToken0
    //       ? [BigInt(0)]
    //       : [
    //           BigInt(
    //             this.keepingBalance[this.currentPair[1][0].token1[0].toString()]
    //           )
    //         ]
    //   );
    // }
    //
    // if (res && res.length) {
    //   this.$message.success('Success');
    // } else {
    //   this.$message.success('Error');
    // }
    // this.getDepositBalance();
    // loading.close();
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
      pair[0].toString(),
      0
    );
    if (res && res.pairId === this.currentPair[0].toString()) {
      return res.keepingBalance;
    }
    return null;
  }
  private showPoolVisible(isValid = true): void {
    if (this.orderType === 'Pro') {
      return;
    }
    if (isValid) {
      this.isPoolModeSetting = this.isPoolMode;
      this.isKeepingSetting = this.isKeeping;
    } else {
      this.isPoolModeSetting = true;
      this.isKeepingSetting = true;
    }
    this.poolVisible = true;
  }
  private onChange(type: boolean, key: string): void {
    this[key] = !type;
  }
  private async getRole(currentPair: DePairs): Promise<void> {
    this.dexRole = null;
    if (this.prePairs.includes(this.currentPair[0].toString())) {
      return;
    }
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
    if (this.prePairs.includes(this.currentPair[0].toString())) {
      return;
    }
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
      this.stopLimitNeed.token0.toString(10)
    );
    this.$set(
      this.keepingBalance,
      token0Id,
      available0.lt(0) ? '0' : available0.toString(10)
    );
    const available1 = new BigNumber(token1KeepingBalance).minus(
      this.stopLimitNeed.token1.toString(10)
    );
    this.$set(
      this.keepingBalance,
      token1Id,
      available1.lt(0) ? '0' : available1.toString(10)
    );
  }
  private async getAccountSetting(): Promise<void> {
    if (this.prePairs.includes(this.currentPair[0].toString())) {
      return;
    }
    const currentPair = this.currentPair[0].toString();
    const res = await this.currentICDexService.accountSetting(
      currentPair,
      this.getPrincipalId
    );
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
    if (this.getPrincipalId) {
      const currentAddress = principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId)
      );
      if (currentAddress !== address) {
        return 'ErrAddress';
      }
    } else {
      return 'ErrAddress';
    }
    const dexId = currentPair[0].toString();
    try {
      await this.currentICDexService.deposit(dexId, token, amount, subAccount);
    } catch (e) {
      this.$message.error(toHttpRejectError(e));
      return 'ErrDeposit';
    }
  }
  private async onBuyMKT(): Promise<void> {
    if (
      this.pairInfo &&
      this.pairInfo.paused &&
      this.debugPairs &&
      ((this.debugPairs[this.currentPair[0].toString()] &&
        this.debugPairs[this.currentPair[0].toString()] !==
          this.getPrincipalId) ||
        !this.debugPairs[this.currentPair[0].toString()])
    ) {
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
      this.plugLoading[currentPairId] = true;
      const address = principalToAccountIdentifier(
        Principal.from(this.getPrincipalId)
      );
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
    if (
      this.pairInfo &&
      this.pairInfo.paused &&
      (this.isIDOPaused ||
        (!this.isIDOPaused && this.orderType !== OrderTypeEnum.FOK)) &&
      this.debugPairs &&
      ((this.debugPairs[this.currentPair[0].toString()] &&
        this.debugPairs[this.currentPair[0].toString()] !==
          this.getPrincipalId) ||
        !this.debugPairs[this.currentPair[0].toString()])
    ) {
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
      if (this.orderType === OrderTypeEnum.FOK && !this.isIDOPaused) {
        if (
          this.qualification &&
          new BigNumber(this.qualification.limit.toString(10)).lte(0)
        ) {
          this.$message.warning('You are not eligible for IDO.');
          return;
        }
        if (
          this.qualification &&
          new BigNumber(this.qualification.used.toString(10)).gte(
            this.qualification.limit.toString(10)
          )
        ) {
          const limit = new BigNumber(this.qualification.limit.toString(10))
            .div(
              10 **
                this.tokens[this.currentPair[1][0].token0[0].toString()]
                  .decimals
            )
            .toString(10);
          this.$message.warning(`You have reached the IDO limit(${limit}).`);
          return;
        }
        const max = new BigNumber(this.qualification.limit.toString(10))
          .minus(this.qualification.used.toString(10))
          .div(
            10 **
              this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
          );
        if (max.lt(this.buyAmount)) {
          this.$message.warning(`Max quantity ${max.toString()}.`);
          return;
        }
      }
      if (this.orderType === 'Stop-limit' && !this.stopBuyPrice) {
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
            icon: 'connect-plug'
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
      const fee = new BigNumber(
        getFee(
          this.tokens[this.currentPair[1][0].token0[0].toString()]
        ).toString(10)
      )
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
        )
        .times(2);
      if (new BigNumber(fee).gte(this.buyAmount)) {
        this.$message.error(`Quantity must be more than ${fee}`);
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
      const currentPairId = this.currentPair[0].toString();
      this.plugLoading[currentPairId] = true;
      // if (this.isPlug() || isInfinity()) {
      //   this.plugLoading[currentPairId] = true;
      //   setTimeout(() => {
      //     this.plugLoading[currentPairId] = false;
      //   }, 3000);
      // }
      const address = principalToAccountIdentifier(
        Principal.from(this.getPrincipalId)
      );
      if (this.orderType === 'Stop-limit') {
        const order = {
          side: { Buy: null },
          quantity: amount,
          price: price
        };
        const triggerPrice = new BigNumber(this.stopBuyPrice)
          .times(10 ** token1Info.decimals)
          .times(new BigNumber(this.unit.toString(10)).div(10 ** tokenDecimals))
          .toString(10);
        const min = new BigNumber(this.currentPair[2].price)
          .times(
            10 **
              this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
          )
          .times(new BigNumber(this.unit.toString(10)).div(10 ** tokenDecimals))
          .times(100)
          .div(
            10 **
              this.tokens[this.currentPair[1][0].token1[0].toString()].decimals
          )
          .decimalPlaces(8, 2)
          .toString(10);
        let totalAmount = this.buyTotal;
        if (new BigNumber(totalAmount).lt(min)) {
          totalAmount = min;
        }
        const token1Id = this.currentPair[1][0].token1[0].toString();
        if (
          new BigNumber(this.keepingBalance[token1Id])
            .plus(this.tokensBalance[token1Id])
            .minus(getFee(this.tokens[token1Id]).toString(10))
            .minus(getFee(this.tokens[token1Id]).toString(10))
            .div(10 ** token1Info.decimals)
            .lt(totalAmount)
        ) {
          this.$message.error(
            `You should make a deposit first (Minimum amount: ${min} ${token1Info.symbol})`
          );
          return;
        }
        this.onStopLimit(
          order,
          BigInt(triggerPrice),
          totalAmount,
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
  private async stopFee(currentPair: DePairs, type: string): Promise<boolean> {
    if (this.dexRole && this.dexRole.vipMaker) {
      return true;
    }
    // fee
    const sysToken = this.sysConfig.sysToken.toString();
    if (!this.stoConfig.sloFee1) {
      return true;
    }
    const currentDrc20Token = new DRC20TokenService();
    const res = await currentDrc20Token.icrc2_allowance(sysToken, {
      account: {
        owner: Principal.fromText(this.getPrincipalId),
        subaccount: []
      },
      spender: {
        owner: currentPair[0],
        subaccount: []
      }
    });
    let sloFee = new BigNumber(this.stoConfig.sloFee1.toString(10))
      .div(10 ** this.tokens[sysToken].decimals)
      .toString(10);
    if (type === 'update') {
      sloFee = new BigNumber(this.stoConfig.sloFee1.toString(10))
        .times(0.05)
        .div(10 ** this.tokens[sysToken].decimals)
        .toString(10);
    }
    let fee = new BigNumber(this.stoConfig.sloFee1.toString(10));
    if (type === 'update') {
      fee = new BigNumber(this.stoConfig.sloFee1.toString(10)).times(0.05);
    }
    const ICLBalance = await getTokenBalance({ icrc1: null }, sysToken);
    let tokenFee = getFee(this.tokens[sysToken]).toString(10);
    if (
      new BigNumber(res.allowance.toString(10)).lt(
        this.stoConfig.sloFee1.toString(10)
      )
    ) {
      // approve fee
      tokenFee = new BigNumber(tokenFee).plus(tokenFee).toString(10);
    }
    const balance = new BigNumber(ICLBalance).minus(tokenFee);
    let createdFee = fee.plus(tokenFee);
    if (balance.lt(fee)) {
      this.$message.error(
        `Insufficient ${this.tokens[sysToken].symbol}: Create a stop-limit order need ${sloFee} ${this.tokens[sysToken].symbol}.`
      );
      return false;
    }
    if (new BigNumber(res.allowance.toString(10)).lt(createdFee)) {
      const approve = new BigNumber(10000).times(
        10 ** this.tokens[sysToken].decimals
      );
      await currentDrc20Token.icrc2_approve(
        sysToken,
        {
          owner: currentPair[0],
          subaccount: []
        },
        BigInt(approve.toString(10))
      );
    }
    return true;
  }
  private async onStopLimit(
    order: TriggeredOrderInfo,
    triggerPrice: bigint,
    totalAmount: string,
    prepare: TxAccount,
    currentPair: DePairs,
    address: string,
    type: string
  ): Promise<void> {
    if (!this.NFTsExt.length) {
      this.$info({
        content:
          'This feature is currently in the experimental stage and is for ICLighthouse Planet Cards NFT holders to experience and use only.',
        class: 'connect-plug confirm-swap-button',
        icon: 'connect-plug',
        centered: true,
        okText: 'Close'
      });
      return;
    }
    if (
      type === 'buy' &&
      new BigNumber(this.stopBuyPrice).lte(this.currentTokenPrice)
    ) {
      this.$message.error(
        'The stop price of a stop-limit order with a Buy side should be greater than the current price.'
      );
      return;
    }
    if (
      type === 'sell' &&
      new BigNumber(this.stopSellPrice).gte(this.currentTokenPrice)
    ) {
      this.$message.error(
        'The stop price of a stop-limit order with a Sell side should be lower than the current price.'
      );
      return;
    }
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    if (!this.isKeeping || !this.isPoolMode) {
      this.$message.warning(
        'Stop-limit orders are only valid for TraderAccount. It is required to enable "PoolMode" and "Keeping balance in TraderAccount" and to transfer funds to the TraderAccount.'
      );
      return;
      // await this.currentICDexService.accountConfig(
      //   currentPair[0].toString(),
      //   { PoolMode: null },
      //   true
      // );
    }
    await this.getAccountSetting();
    const flag = await this.stopFee(currentPair, 'create');
    if (!flag) {
      loading.close();
      return;
    }
    const canStop = await this.onPrepare(
      totalAmount,
      prepare,
      currentPair,
      this.currentTokenPrice,
      address,
      type
    );
    if (!canStop) {
      loading.close();
      return;
    }
    try {
      const res = await this.currentICDexService.sto_createStopLimitOrder(
        currentPair[0].toString(),
        {
          order: order,
          triggerPrice: triggerPrice
        }
      );
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
    let currentAddress;
    if (this.getPrincipalId) {
      currentAddress = principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId)
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
      if (depositRes === 'ErrDeposit') {
        return 'ErrDeposit';
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
  private InitTxAccount(currentPair: string): void {
    if (
      !this.modeDisabled &&
      !this.isToBuy &&
      !this.isToSell &&
      !this.isToBuyMKT
    ) {
      this.getTxAccount(currentPair).then((prepare) => {
        if (
          !this.modeDisabled &&
          !this.isToBuy &&
          !this.isToSell &&
          !this.isToBuyMKT &&
          prepare &&
          prepare.pairId === this.currentPair[0].toString()
        ) {
          this.prepare[this.currentPair[0].toString()] = prepare.txAccount;
        }
      });
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
      if (new BigNumber(this.unitSize).gt(1)) {
        this.buyAmount = new BigNumber(this.buyTotal)
          .div(this.buyPrice)
          .div(this.unitSize)
          .decimalPlaces(0, 1)
          .times(this.unitSize)
          .toString(10);
      } else {
        this.buyAmount = new BigNumber(this.buyTotal)
          .div(this.buyPrice)
          .decimalPlaces(this.tokenMinUnit, 1)
          .toString(10);
      }
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
      if (new BigNumber(this.unitSize).gt(1)) {
        this.sellAmount = new BigNumber(this.sellTotal)
          .div(this.sellPrice)
          .div(this.unitSize)
          .decimalPlaces(0, 1)
          .times(this.unitSize)
          .toString(10);
      } else {
        this.sellAmount = new BigNumber(this.sellTotal)
          .div(this.sellPrice)
          .decimalPlaces(this.tokenMinUnit, 1)
          .toString(10);
      }
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
      axios
        .get('https://pncff-zqaaa-aaaai-qnp3a-cai.raw.ic0.app/2')
        .then((res) => {
          const price = (res as any).data.success[0].rate;
          this.currentMarketPrice['icp'] = price;
        })
        .catch((e) => {});
      axios
        .get('https://pncff-zqaaa-aaaai-qnp3a-cai.raw.ic0.app/12')
        .then((res) => {
          const price = (res as any).data.success[0].rate;
          this.currentMarketPrice['btc'] = price;
        })
        .catch((e) => {});
      axios
        .get('https://pncff-zqaaa-aaaai-qnp3a-cai.raw.ic0.app/16')
        .then((res) => {
          const price = (res as any).data.success[0].rate;
          this.currentMarketPrice['eth'] = price;
        })
        .catch((e) => {});
    } catch (e) {}
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
    this.orderType = item;
    this.currentMark = 0;
    this.currentTradesMenu = 'std';
    if (item === 'Stop-limit') {
      this.currentTradeMenu = 'stop';
    } else {
      this.currentTradeMenu = 'pending';
    }
    this.currentProOrderMenu = null;
    this.init();
    if (this.getPrincipalId && item === 'Stop-limit') {
      if (!(this.isKeeping && this.isPoolMode)) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        this.$confirm({
          content:
            'Stop-limit orders are only valid for TraderAccount. It is required to enable "PoolMode" and "Keeping balance in TraderAccount" and to transfer funds to the TraderAccount.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          centered: true,
          onOk() {
            _that.showPoolVisible(false);
          }
        });
      }
    }
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
  private async initPairsPrice(): Promise<void> {
    let promiseAllValue = [];
    const MAX_CONCURRENCY = 20;
    const pairs = [
      { type: 'Main', value: this.allPairs.Markets.Main },
      { type: 'Second', value: this.allPairs.Markets.Second },
      { type: 'Third', value: this.allPairs.Markets.Third }
    ];
    const a = new Date().getTime();
    for (let i = 0; i < pairs.length; i++) {
      for (let j = 0; j < pairs[i].value.length; j++) {
        promiseAllValue.push(
          this.getLiquidity(
            pairs[i].value[j][0].toString(),
            j,
            pairs[i].type,
            pairs[i].value
          )
        );
        if (promiseAllValue.length === MAX_CONCURRENCY) {
          await Promise.all(promiseAllValue);
          promiseAllValue = [];
        }
        if (
          i === pairs.length - 1 &&
          j === pairs[i].value.length - 1 &&
          promiseAllValue.length
        ) {
          await Promise.all(promiseAllValue);
          promiseAllValue = [];
        }
      }
    }
    const allPairs = []
      .concat(this.allPairs.Markets.Main)
      .concat(this.allPairs.Markets.Second)
      .concat(this.allPairs.Markets.Third);
    allPairs.forEach((pair) => {
      const pairId = pair[0].toString();
      for (let i = 0; i < this.allPairs.Markets.Hot.length; i++) {
        const hotId = this.allPairs.Markets.Hot[i][0].toString();
        if (pairId === hotId) {
          this.allPairs.Markets.Hot[i][2] = pair[2];
          break;
        }
      }
      for (let j = 0; j < this.tradePairs.Star.length; j++) {
        const starId = this.tradePairs.Star[j][0].toString();
        if (starId === pairId) {
          this.tradePairs.Star[j][2] = pair[2];
          break;
        }
      }
    });
    if (this.currentMarketMenu !== 'FAVORITES') {
      this.tradePairs.Hot = this.allPairs[this.currentMarketMenu].Hot;
      this.sortHot();
      this.scrollTop();
    }
  }
  private sortHot(): void {
    this.tradePairs.Hot = this.tradePairs.Hot.sort((a: DePairs, b: DePairs) => {
      if (b[1][0].token1[1].toLocaleLowerCase().includes('test') || !b[2]) {
        return -1;
      }
      if (a[1][0].token1[1].toLocaleLowerCase().includes('test') || !a[2]) {
        return 1;
      }
      const basePrice = this.getBasePrice(a[1][0].token1[1]);
      if (
        this.tokens[a[1][0].token1[0].toString()] &&
        this.tokens[b[1][0].token1[0].toString()]
      ) {
        const vol24 = new BigNumber(a[2].vol24h.value1.toString(10))
          .div(10 ** this.tokens[a[1][0].token1[0].toString()].decimals)
          .times(basePrice);
        const basePrice1 = this.getBasePrice(b[1][0].token1[1]);
        const vol241 = new BigNumber(b[2].vol24h.value1.toString(10))
          .div(10 ** this.tokens[b[1][0].token1[0].toString()].decimals)
          .times(basePrice1);
        return vol241.minus(vol24).toNumber();
      }
      return 1;
    });
    if (this.currentTradeMarketSort === 'Hot') {
      const res = [];
      this.tradePairs.Hot.forEach((pair, index) => {
        if (
          this.currentPair &&
          this.currentPair[3] === 'Hot' &&
          this.currentPair[0].toString() === pair[1][0].canisterId.toString()
        ) {
          this.currentPairIndex = index;
        }
        res.push({
          id: pair[1][0].canisterId.toString(),
          pair: pair
        });
      });
      this.pairsScroll = res;
    }
  }
  private async getAllLiquidity(): Promise<void> {
    let promiseAllValue = [];
    const MAX_CONCURRENCY = 20;
    let pairs = this.tradePairs[this.currentTradeMarketSort];
    if (this.pairSearch) {
      pairs = this.pairs;
    }
    const currentTradeMarketSort = this.currentTradeMarketSort;
    for (let i = 0; i < pairs.length; i++) {
      promiseAllValue.push(
        this.getLiquidity(pairs[i][0].toString(), i, currentTradeMarketSort)
      );
      if (promiseAllValue.length === MAX_CONCURRENCY) {
        await Promise.all(promiseAllValue);
        if (this.currentTradeMarketSort === 'Hot') {
          this.sortHot();
        }
        promiseAllValue = [];
      }
      if (i === pairs.length - 1 && promiseAllValue.length) {
        await Promise.all(promiseAllValue);
        if (this.currentTradeMarketSort === 'Hot') {
          this.sortHot();
        }
        promiseAllValue = [];
      }
    }
    // if (this.currentTradeMarketSort === 'Hot') {
    //   const prePair = this.currentPair;
    //   // this.sortHot();
    //   if (
    //     this.currentPair[3] === 'Hot' &&
    //     this.tradePairs.Hot[this.currentPairIndex] &&
    //     prePair[1][0].canisterId.toString() !==
    //       this.tradePairs.Hot[this.currentPairIndex][1][0].canisterId.toString()
    //   ) {
    //     this.tradePairs.Hot.some((pair, index) => {
    //       if (
    //         pair[1][0].canisterId.toString() ===
    //         prePair[1][0].canisterId.toString()
    //       ) {
    //         if (
    //           this.currentPair[3] === 'Hot' &&
    //           this.currentTradeMarketSort === 'Hot'
    //         ) {
    //
    //           this.currentPairIndex = index;
    //         }
    //         return true;
    //       }
    //     });
    //   }
    // }
  }
  private initIntervalPrice(): void {
    try {
      if (this.$route.name !== 'ICDex') {
        return;
      }
      this.getIcpPrice();
      if (this.getPrincipalId) {
        this.getUserLiquidity(this.currentPair[0].toString());
        this.getPending(this.currentPair[0].toString());
        this.getTradeList(this.currentPair[0].toString(), this.getPrincipalId);
        this.getStopOrders(this.currentPair[0].toString(), this.getPrincipalId);
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
    } catch (e) {}
  }
  private getAccountInitIntervalPrice(time = 10): void {
    this.time = time;
    // this.initIntervalPrice();
    window.clearInterval(this.timer);
    this.timer = null;
    this.timer = window.setInterval(async () => {
      if (!this.getCheckAuth) {
        setTimeout(async () => {
          if (this.$route.name === 'ICDex') {
            this.initIntervalPrice();
          }
        }, 0);
      }
    }, time * 1000);
  }
  private async getIntervalPrice(): Promise<void> {
    try {
      await this.getLiquidity(
        this.currentPair[0].toString(),
        this.currentPairIndex,
        this.currentTradeMarketSort
      );
      await Promise.all([
        this.getLevel100(this.currentPair[0].toString()),
        this.latestFilled(this.currentPair[0].toString()),
        this.initIntervalPrice(),
        this.getAllLiquidity()
      ]);
      this.getAccountInitIntervalPrice();
      window.clearInterval(this.timerOrderBook);
      this.timerOrderBook = null;
      window.clearInterval(this.timerAccount);
      this.timerAccount = null;
      this.timerOrderBook = window.setInterval(() => {
        if (!this.getCheckAuth) {
          setTimeout(() => {
            if (this.$route.name === 'ICDex') {
              this.getLiquidity(
                this.currentPair[0].toString(),
                this.currentPairIndex,
                this.currentTradeMarketSort
              );
              this.getLevel100(this.currentPair[0].toString());
              this.latestFilled(this.currentPair[0].toString());
            }
          }, 0);
        }
      }, 1.5 * 1000);
      this.timerAccount = window.setInterval(async () => {
        if (!this.getCheckAuth) {
          setTimeout(async () => {
            if (this.$route.name === 'ICDex') {
              this.InitTxAccount(this.currentPair[0].toString());
              this.getAllLiquidity();
            }
          }, 0);
        }
      }, 60 * 1000);
    } catch (e) {}
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
    if (this.getPrincipalId) {
      const account = principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId)
      );
      if (tokenStd === 'drc20') {
        const allowance = await currentDrc20Token.drc20_allowance(
          account,
          spender,
          tokenId
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
          Principal.fromText(this.getPrincipalId),
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
            owner: Principal.fromText(this.getPrincipalId),
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
  private async setICRC2Token(
    icrc2Tokens: Array<string>,
    tokenId: string
  ): Promise<void> {
    const currentDrc20Token = new DRC20TokenService();
    const standards = await currentDrc20Token.icrc1_supported_standards(
      tokenId
    );
    if (standards && standards.length) {
      const flag = standards.some((standard) => {
        return standard.name.toLocaleLowerCase().includes('icrc-2');
      });
      if (flag) {
        icrc2Tokens.push(tokenId);
      }
    }
  }
  private async getTokens(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.getTokens(['icdex']);
    let canisterIds: Array<string> = [];
    this.tradePairs.Hot.forEach((pair) => {
      if (!canisterIds.includes(pair[0].toString())) {
        canisterIds.push(pair[0].toString());
      }
    });
    this.tradePairs.Main.forEach((pair) => {
      if (!canisterIds.includes(pair[0].toString())) {
        canisterIds.push(pair[0].toString());
      }
    });
    this.tradePairs.Second.forEach((pair) => {
      if (!canisterIds.includes(pair[0].toString())) {
        canisterIds.push(pair[0].toString());
      }
    });
    this.tradePairs.Third.forEach((pair) => {
      if (!canisterIds.includes(pair[0].toString())) {
        canisterIds.push(pair[0].toString());
      }
    });
    // this.tradePairs.ICP.forEach((pair) => {
    //   canisterIds.push(pair[0].toString());
    // });
    // this.tradePairs.USDT.forEach((pair) => {
    //   canisterIds.push(pair[0].toString());
    // });
    // this.tradePairs.Old.forEach((pair) => {
    //   canisterIds.push(pair[0].toString());
    // });
    const icrc2Tokens = JSON.parse(localStorage.getItem('icrc2')) || [];
    const promiseValue = [];
    res.forEach((item) => {
      const tokenId = item[0].toString();
      if (!ICRC2Token.includes(tokenId) && !icrc2Tokens.includes(tokenId)) {
        const std = Object.keys(item[2])[0];
        if (std === 'icrc1') {
          promiseValue.push(this.setICRC2Token(icrc2Tokens, tokenId));
        }
      }
      if (item[0].toString() !== LEDGER_CANISTER_ID) {
        canisterIds.push(item[0].toString());
      }
    });
    canisterIds = [...new Set(canisterIds)];
    if (promiseValue.length) {
      Promise.all(promiseValue).then(() => {
        localStorage.setItem('icrc2', JSON.stringify(icrc2Tokens));
      });
    }
    await checkAuth();
    const flag = needConnectPlug(canisterIds);
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const needConnectInfinity1 = await needConnectInfinity(canisterIds);
    if (
      (priList[this.getPrincipalId] === 'Plug' ||
        priList[this.getPrincipalId] === 'SignerPlug') &&
      flag &&
      this.$route.name === 'ICDex'
    ) {
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
            }
          });
        }
      });
    } else if (
      priList[this.getPrincipalId] === 'Infinity' &&
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
  private toTradeICL(): void {
    (this.$refs as any).proOrder.visibleProOrder = false;
    const token0 = this.currentPair[1][0].token0[0].toString();
    const token1 = this.currentPair[1][0].token1[0].toString();
    if (
      token0 === IC_LIGHTHOUSE_TOKEN_CANISTER_ID &&
      token1 === LEDGER_CANISTER_ID
    ) {
      return;
    }
    this.$router.push('/ICDex/ICL/ICP').then(() => {
      this.orderType = 'LMT';
      this.getDexPairs('icdex');
    });
  }
  private changeLaunch(pair: string): void {
    const pairs = pair.split('\\');
    const token0 = this.currentPair[1][0].token0[0].toString();
    const token1 = this.currentPair[1][0].token1[0].toString();
    if (token0 === pairs[0] && token1 === pairs[1]) {
      return;
    }
    this.$router.push(`/ICDex/${pair}`).then(() => {
      this.getDexPairs('icdex');
    });
  }
  private launchSuccess(token0: string, token1: string): void {
    this.$router.push(`/ICDex/${token0}/${token1}`).then(() => {
      this.getDexPairs('icdex');
    });
  }
  private changeStarMenu(): void {
    this.isMarket = false;
    this.currentTradeMarketSort = 'Star';
    this.tradePairs = Object.assign(
      { Star: this.tradePairs.Star, Search: [] },
      this.allPairs.Markets
    );
  }
  private changeHotMenu(): void {
    this.isMarket = false;
    this.currentTradeMarketSort = 'Hot';
    this.tradePairs = Object.assign(
      { Star: this.tradePairs.Star, Search: [] },
      this.allPairs.Markets
    );
    const now = new Date().getTime();
    if (now - hotSort > 5 * 60 * 1000) {
      hotSort = now;
      this.getAllLiquidity();
    }
    const res = [];
    this.pairs = this.tradePairs[this.currentTradeMarketSort];
    this.tradePairs[this.currentTradeMarketSort].forEach((pair) => {
      res.push({
        id: pair[1][0].canisterId.toString(),
        pair: pair
      });
    });
    this.pairsScroll = res;
  }
  private changeMarketMenu(val): void {
    this.isMarket = true;
    this.currentMarketMenu = val.value;
    this.currentTradeMarketSort = 'Hot';
    this.tradePairs = Object.assign(
      { Star: this.tradePairs.Star, Search: [] },
      this.allPairs[this.currentMarketMenu]
    );
    this.sortHot();
    const res = [];
    this.pairs = this.tradePairs[this.currentTradeMarketSort];
    this.tradePairs[this.currentTradeMarketSort].forEach((pair) => {
      res.push({
        id: pair[1][0].canisterId.toString(),
        pair: pair
      });
    });
    this.pairsScroll = res;
    this.selectMarket = false;
    this.marketMenuVisible = false;
  }
  private changeTradeMarketSort(val): void {
    this.currentTradeMarketSort = val.value;
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
        pair[0].toString() === this.currentPair[0].toString() &&
        pair[3] === this.currentPair[3]
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
      this.stopLimitNeed = {
        token0: BigInt(0),
        token1: BigInt(0)
      };
      this.IDOConfig = null;
      this.qualification = null;
      const stage = pair[1][0].marketBoard || {};
      const stageType = Object.keys(stage)[0];
      if (this.currentTradeMarketSort === 'Search') {
        this.pairs = this.tradePairs.Search;
      } else if (this.currentTradeMarketSort === 'Star') {
        this.pairs = this.tradePairs.Star;
      } else if (this.currentTradeMarketSort === 'Hot') {
        this.pairs = this.tradePairs.Hot;
      } else if (stageType && stageType === 'STAGE2') {
        this.currentTradeMarketSort = 'Main';
        this.pairs = this.tradePairs.Main;
      } else if (stageType && stageType === 'STAGE1') {
        this.currentTradeMarketSort = 'Second';
        this.pairs = this.tradePairs.Second;
      } else if (stageType && stageType === 'STAGE0') {
        this.currentTradeMarketSort = 'Third';
        this.pairs = this.tradePairs.Third;
      }
      // else {
      //   this.currentTradeMarketSort = 'Old';
      //   this.pairs = this.tradePairs.Old;
      // }
      // if (pair[1][0].token1[1].toLocaleLowerCase() === 'icp') {
      //
      //   if (this.currentTradeMarketSort === 'ICP') {
      //     this.pairs = this.tradePairs.ICP;
      //   } else {
      //     this.pairs = this.tradePairs.Old;
      //   }
      // }
      // if (
      //   pair[1][0].token1[1].toLocaleLowerCase().includes('usdt') ||
      //   pair[1][0].token1[1].toLocaleLowerCase().includes('test')
      // ) {
      //   this.currentTradeMarketSort = 'USDT';
      //   this.pairs = this.tradePairs.USDT;
      // }
      this.currentPair = pair;
      this.updateTokenInfo();
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
      this.currentProOrderMenu = null;
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
      } catch (e) {}
      if (!this.isToSetReferrer) {
        this.toSetReferrer();
      }
      this.initAccount();
      this.stoConfig = null;
      this.getStoConfig();
    } catch (e) {}
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
      if (this.pairInfo.paused) {
        await this.getSysMode(currentPair);
      } else {
        this.isPaused = false;
        this.isIDOPaused = false;
      }
      this.getIDOInfo(currentPair);
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
    }
  }
  private onFinish(): void {
    this.getPairInfo(this.currentPair);
  }
  private getMainDay(pair: DePairs): string {
    const now = new Date().getTime() / 1000;
    return new BigNumber(3 * 30 * 86400)
      .minus(now)
      .plus(pair[1][0].startingBelowG2[0].toString(10))
      .div(86400)
      .decimalPlaces(0, 3)
      .toString(10);
  }
  private getSecondDay(pair: DePairs): string {
    const now = new Date().getTime() / 1000;
    return new BigNumber(3 * 30 * 86400)
      .minus(now)
      .plus(pair[1][0].startingBelowG4[0].toString(10))
      .div(86400)
      .decimalPlaces(0, 3)
      .toString(10);
  }
  private showReminder2(pair: DePairs): boolean {
    const stage = pair[1][0].marketBoard;
    if (stage) {
      const type = Object.keys(stage)[0];
      if (
        type === 'STAGE2' &&
        pair[1][0].startingBelowG2 &&
        pair[1][0].startingBelowG2.length
      ) {
        return true;
      }
    }
    return false;
  }
  private showReminder1(pair: DePairs): boolean {
    const stage = pair[1][0].marketBoard;
    if (stage) {
      const type = Object.keys(stage)[0];
      if (
        type === 'STAGE1' &&
        pair[1][0].startingBelowG4 &&
        pair[1][0].startingBelowG4.length
      ) {
        return true;
      }
    }
    return false;
  }
  private onStar(pair: DePairs): void {
    const pairId = pair[0].toString();
    const index = this.star.indexOf(pairId);
    if (index === -1) {
      let currentPair = [].concat(pair);
      currentPair[3] = 'Star';
      this.star.unshift(pairId);
      this.tradePairs.Star.unshift(currentPair);
      if (this.getPrincipalId) {
        this.addFavorites(pair[0]);
      }
    } else {
      this.star.splice(index, 1);
      this.tradePairs.Star.some((item, pairIndex) => {
        if (item[0].toString() === pairId) {
          this.tradePairs.Star.splice(pairIndex, 1);
          return true;
        }
      });
      if (this.getPrincipalId) {
        this.removeFavorites(pair[0]);
      }
    }
    if (this.currentPair[3] && this.currentPair[3] === 'Star') {
      this.pairs = this.tradePairs.Star;
      this.currentPairIndex = null;
      for (let i = 0; i < this.pairs.length; i++) {
        if (this.currentPair[0].toString() === this.pairs[i][0].toString()) {
          this.currentPairIndex = i;
          break;
        }
      }
    }
    if (!this.getPrincipalId) {
      localStorage.setItem('star', JSON.stringify(this.star));
    }
  }
  private async getFavorites(): Promise<Array<string>> {
    const res = await this.ICLighthouseService.getFavorites(
      this.getPrincipalId
    );
    return res.map((item) => item.toString());
  }
  private async addFavorites(pairId: Principal): Promise<void> {
    if (pairId.toString() !== '5t3ek-haaaa-aaaar-qadia-cai') {
      const res = await this.ICLighthouseService.addFavorites(pairId);
    }
  }
  private async removeFavorites(pairId: Principal): Promise<void> {
    const res = await this.ICLighthouseService.removeFavorites(pairId);
  }
  private async getAccountFavorites(): Promise<void> {
    const star: Array<string> = JSON.parse(localStorage.getItem('star')) || [];
    if (!this.getPrincipalId) {
      this.star = star;
    } else {
      const res = await checkAuth(false);
      if (res) {
        const favorites = await this.getFavorites();
        if (favorites.includes('5t3ek-haaaa-aaaar-qadia-cai')) {
          await this.removeFavorites(
            Principal.fromText('5t3ek-haaaa-aaaar-qadia-cai')
          );
        }
        this.star = [].concat(favorites);
        // for (let i = 0; i < star.length; i++) {
        //   if (
        //     !favorites.includes(star[i]) &&
        //     star[i] !== '5t3ek-haaaa-aaaar-qadia-cai'
        //   ) {
        //     this.star.push(star[i]);
        //     this.addFavorites(Principal.fromText(star[i]));
        //   }
        // }
        // localStorage.setItem('star', JSON.stringify(this.star));
      } else {
        this.star = star;
      }
    }
  }
  private pairSearchChange(): void {
    if (this.pairSearch) {
      const allPairs = []
        .concat(this.allPairs.Markets.Main)
        .concat(this.allPairs.Markets.Second)
        .concat(this.allPairs.Markets.Third);
      const label = localStorage.getItem('label');
      const sort = localStorage.getItem('sort');
      if (!label && this.currentMarketMenu) {
        localStorage.setItem('label', this.currentMarketMenu);
      }
      if (!sort && this.currentTradeMarketSort) {
        localStorage.setItem('sort', this.currentTradeMarketSort);
      }
      this.currentTradeMarketSort = 'Search';
      const pairs = [];
      allPairs.forEach((pair: DePairs) => {
        if (
          pair[1][0].token0[1]
            .toLocaleLowerCase()
            .includes(this.pairSearch.toLocaleLowerCase()) ||
          pair[1][0].token1[1]
            .toLocaleLowerCase()
            .includes(this.pairSearch.toLocaleLowerCase())
        ) {
          const currentPair = [].concat(pair);
          currentPair[3] = 'Search';
          pairs.push(currentPair);
        }
      });
      this.pairs = this.tradePairs.Search = pairs;
      const res = [];
      this.tradePairs.Search.forEach((pair) => {
        res.push({
          id: pair[1][0].canisterId.toString(),
          pair: pair
        });
      });
      this.pairsScroll = res;
    } else {
      this.tradePairs.Search = [];
      if (localStorage.getItem('label') && localStorage.getItem('sort')) {
        this.currentMarketMenu = localStorage.getItem('label');
        this.currentTradeMarketSort = localStorage.getItem('sort');
        this.tradePairs = Object.assign(
          { Star: this.tradePairs.Star, Search: [] },
          this.allPairs[this.currentMarketMenu]
        );
        this.pairs = this.tradePairs[this.currentTradeMarketSort];
        localStorage.removeItem('label');
        localStorage.removeItem('sort');
      }
    }
  }
  private async getDebugPairs(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.debugPairs();
    if (res && res.length) {
      res.forEach((item) => {
        this.$set(this.debugPairs, item.pair.toString(), item.dev.toString());
      });
    }
  }
  private async getDexPairs(dexName: DexNameType): Promise<void> {
    try {
      this.ICSwapRouterFiduciaryService.getConfig().then((config) => {
        this.swapConfig = config;
      });
      await this.getAccountFavorites();
      const res = await this.ICSwapRouterFiduciaryService.getPairs(
        [dexName],
        [],
        []
      );
      this.allPairs = {
        Markets: {
          Main: [],
          Second: [],
          Third: [],
          Hot: []
        },
        ICP: {
          Main: [],
          Second: [],
          Third: [],
          Hot: []
        },
        USDT: {
          Main: [],
          Second: [],
          Third: [],
          Hot: []
        },
        USDC: {
          Main: [],
          Second: [],
          Third: [],
          Hot: []
        },
        OTHER: {
          Main: [],
          Second: [],
          Third: [],
          Hot: []
        }
      };
      this.tradePairs = {
        Star: [],
        Main: [],
        Second: [],
        Third: [],
        Hot: [],
        Search: []
      };
      if (res.data && res.data.length) {
        const localICRC2Tokens =
          JSON.parse(localStorage.getItem('icrc2')) || [];
        ICRC2Token = [...new Set(ICRC2Token.concat(localICRC2Tokens))];
        const pairs = res.data.sort((a: TrieListData1, b: TrieListData1) =>
          new BigNumber(b[1].score1.toString(10))
            .plus(b[1].score2.toString(10))
            .plus(b[1].score3.toString(10))
            .minus(a[1].score1.toString(10))
            .minus(a[1].score2.toString(10))
            .minus(a[1].score3.toString(10))
            .toNumber()
        );
        const star = [];
        pairs.forEach((pair) => {
          const swapPair = pair[1] as TrieListData1SwapPair;
          const score = BigInt(
            new BigNumber(swapPair.score1.toString(10))
              .plus(swapPair.score2.toString(10))
              .plus(swapPair.score3.toString(10))
              .toString(10)
          );
          const newPair = Object.assign(
            {},
            { ...swapPair },
            { ...swapPair.pair }
          );
          delete newPair.pair;
          const currentPair = [pair[0], [newPair, score], null, ''];
          // todo ICRC-2
          if (ICRC2Token.includes(currentPair[1][0].token0[0].toString())) {
            currentPair[1][0].token0[2] = { icrc2: null };
          }
          if (ICRC2Token.includes(currentPair[1][0].token1[0].toString())) {
            currentPair[1][0].token1[2] = { icrc2: null };
          }
          const marketBoard = newPair.marketBoard;
          let stage: string;
          if (marketBoard) {
            stage = Object.keys(marketBoard)[0];
          }
          const token1Symbol = currentPair[1][0].token1[1].toLocaleLowerCase();
          if (stage === 'STAGE2') {
            currentPair[3] = 'Main';
            // this.tradePairs.Main.push(currentPair);
          } else if (stage === 'STAGE1') {
            currentPair[3] = 'Second';
            // this.tradePairs.Second.push(currentPair);
          } else if (stage === 'STAGE0') {
            currentPair[3] = 'Third';
            // this.tradePairs.Third.push(currentPair);
          }
          const pairStage = currentPair[3] as string;
          this.allPairs.Markets[pairStage].push(currentPair);
          const hotPair = [].concat(currentPair);
          hotPair[3] = 'Hot';
          this.allPairs.Markets.Hot.push(hotPair);
          if (token1Symbol.includes('icp')) {
            this.allPairs.ICP[pairStage].push(currentPair);
            this.allPairs.ICP.Hot.push(hotPair);
          } else if (token1Symbol.includes('usdc')) {
            this.allPairs.USDC[pairStage].push(currentPair);
            this.allPairs.USDC.Hot.push(hotPair);
          } else if (token1Symbol.includes('usdt')) {
            this.allPairs.USDT[pairStage].push(currentPair);
            this.allPairs.USDT.Hot.push(hotPair);
          } else {
            this.allPairs.OTHER[pairStage].push(currentPair);
            this.allPairs.OTHER.Hot.push(hotPair);
          }
          const starIndex = this.star.indexOf(currentPair[0].toString());
          if (starIndex > -1) {
            let pair = [].concat(currentPair);
            pair[3] = 'Star';
            star.splice(starIndex, 0, pair);
          }
        });
        let token0 = this.$route.params.token0;
        let token1 = this.$route.params.token1;
        let currentStage: string;
        let currentPairId = '';
        let token1Symbol = '';
        if (token0 && token1) {
          for (let i = 0; i < pairs.length; i++) {
            const currentPair = pairs[i][1] as TrieListData1SwapPair;
            if (token0 === 'pair') {
              if (currentPair.pair.canisterId.toString() === token1) {
                currentPairId = pairs[i][0].toString();
                currentStage = Object.keys(currentPair.marketBoard)[0];
                token1Symbol = currentPair.pair.token1[1].toLocaleLowerCase();
                break;
              }
            } else {
              if (
                (currentPair.pair.token0[1].toLocaleLowerCase() ===
                  token0.toLocaleLowerCase() ||
                  currentPair.pair.token0[0].toString() === token0) &&
                (currentPair.pair.token1[1].toLocaleLowerCase() ===
                  token1.toLocaleLowerCase() ||
                  currentPair.pair.token1[0].toString() === token1)
              ) {
                currentPairId = pairs[i][0].toString();
                currentStage = Object.keys(currentPair.marketBoard)[0];
                token1Symbol = currentPair.pair.token1[1].toLocaleLowerCase();
                break;
              }
            }
          }
          if (token0 === 'pair' && !currentPairId) {
            if (!currentPairId) {
              try {
                const res = await this.currentICDexService.info(token1);
                if (res) {
                  this.allPairs.Markets.Hot.push([
                    Principal.fromText(token1),
                    [
                      {
                        feeRate: new BigNumber(
                          res.pairInfo.setting.TRADING_FEE.toString(10)
                        )
                          .div(10 ** 6)
                          .toString(10),
                        token0: res.pairInfo.token0,
                        token1: res.pairInfo.token1,
                        dexName: res.pairInfo.name,
                        marketBoard: { STAGE0: null },
                        canisterId: Principal.fromText(token1)
                      },
                      BigInt(0)
                    ],
                    null,
                    'Hot'
                  ]);
                  currentPairId = token1;
                  currentStage = 'STAGE0';
                }
              } catch (e) {}
            }
          }
          this.tradePairs = Object.assign(
            { Star: star, Search: [] },
            this.allPairs.Markets
          );
          // if (token1Symbol) {
          //   if (token1Symbol.includes('icp')) {
          //     this.currentMarketMenu = 'ICP';
          //     this.tradePairs = Object.assign(
          //       { Star: star, Search: [] },
          //       this.allPairs.ICP
          //     );
          //   } else if (token1Symbol.includes('usdc')) {
          //     this.currentMarketMenu = 'USDC';
          //     this.tradePairs = Object.assign(
          //       { Star: star, Search: [] },
          //       this.allPairs.USDC
          //     );
          //   } else {
          //     this.currentMarketMenu = 'ALL';
          //     this.tradePairs = Object.assign(
          //       { Star: star, Search: [] },
          //       this.allPairs.ALL
          //     );
          //   }
          // } else {
          //   this.tradePairs = Object.assign(
          //     { Star: star, Search: [] },
          //     this.allPairs[this.currentMarketMenu]
          //   );
          // }
          if (currentPairId && this.star.includes(currentPairId)) {
            this.currentMarketMenu = 'Markets';
            this.currentTradeMarketSort = 'Star';
            this.pairs = this.tradePairs.Star;
          } else {
            this.currentMarketMenu = 'Markets';
            this.currentTradeMarketSort = 'Hot';
            this.pairs = this.tradePairs.Hot;
          }
          // else if (currentStage === 'STAGE2') {
          //   this.currentTradeMarketSort = 'Main';
          //   this.pairs = this.tradePairs.Main;
          // } else if (currentStage === 'STAGE1') {
          //   this.currentTradeMarketSort = 'Second';
          //   this.pairs = this.tradePairs.Second;
          // } else if (currentStage === 'STAGE0') {
          //   this.currentTradeMarketSort = 'Third';
          //   this.pairs = this.tradePairs.Third;
          // }
          for (let i = 0; i < this.pairs.length; i++) {
            if (token0 === 'pair') {
              if (this.pairs[i][1][0].canisterId.toString() === token1) {
                this.currentPairIndex = i;
                this.currentPair = this.pairs[this.currentPairIndex];
                this.updateTokenInfo();
                break;
              }
            } else {
              if (
                (this.pairs[i][1][0].token0[1].toLocaleLowerCase() ===
                  token0.toLocaleLowerCase() ||
                  this.pairs[i][1][0].token0[0].toString() === token0) &&
                (this.pairs[i][1][0].token1[1].toLocaleLowerCase() ===
                  token1.toLocaleLowerCase() ||
                  this.pairs[i][1][0].token1[0].toString() === token1)
              ) {
                this.currentPairIndex = i;
                this.currentPair = this.pairs[this.currentPairIndex];
                this.updateTokenInfo();
                break;
              }
            }
          }
          if (!this.currentPair && this.$route.name === 'ICDex') {
            if (this.tradePairs.Hot.length) {
              this.currentTradeMarketSort = 'Hot';
              this.pairs = this.tradePairs.Hot;
            }
            // if (this.tradePairs.Main.length) {
            //   this.currentTradeMarketSort = 'Main';
            //   this.pairs = this.tradePairs.Main;
            // } else if (this.tradePairs.Second.length) {
            //   this.currentTradeMarketSort = 'Second';
            //   this.pairs = this.tradePairs.Second;
            // } else if (this.tradePairs.Third.length) {
            //   this.currentTradeMarketSort = 'Third';
            //   this.pairs = this.tradePairs.Third;
            // }
            this.currentPair = this.pairs[this.currentPairIndex];
            this.updateTokenInfo();
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
            this.currentMarketMenu = 'Markets';
            this.tradePairs = Object.assign(
              { Star: star, Search: [] },
              this.allPairs.Markets
            );
            this.currentTradeMarketSort = 'Hot';
            this.pairs = this.tradePairs.Hot;
            // if (this.tradePairs.Main.length) {
            //   this.currentTradeMarketSort = 'Main';
            //   this.pairs = this.tradePairs.Main;
            // } else if (this.tradePairs.Second.length) {
            //   this.currentTradeMarketSort = 'Second';
            //   this.pairs = this.tradePairs.Second;
            // } else if (this.tradePairs.Third.length) {
            //   this.currentTradeMarketSort = 'Third';
            //   this.pairs = this.tradePairs.Third;
            // }
            this.currentPair = this.pairs[this.currentPairIndex];
            this.updateTokenInfo();
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
      this.$nextTick(async () => {
        try {
          dispose('kInterval-chart');
        } catch (e) {}
        this.resetChart();
        if (this.$route.name !== 'ICDex') {
          return;
        }
        await Promise.all([
          this.initDex(),
          this.getRole(this.currentPair),
          this.setReferral(),
          this.getMakerRebate(),
          this.initAccount(),
          this.getStoConfig()
        ]);
        this.initPairsPrice().then(() => {
          this.getTokens();
        });
      });
      // this.getRole(this.currentPair);
      // // this.getAllowance(this.currentPair);
      // this.setReferral();
      // this.getMakerRebate();
      // this.initAccount();
      // this.getStoConfig();
    } catch (e) {}
    // this.loading.close();
  }
  private scrollTop(): void {
    this.$nextTick(() => {
      if (
        this.$refs.deSwapListItemPair &&
        (this.$refs.deSwapListItemPair as any).$el
      ) {
        console.dir(this.$refs.deSwapListItemPair);
        const height = (this.$refs.deSwapListItemPair as any).$el.clientHeight;
        let top = (this.currentPairIndex + 1) * 50 - height;
        if (top < 0) {
          top = 0;
        }
        (this.$refs.deSwapListItemPair as any).$el.scrollTop = top;
      }
    });
  }
  private async IDO_qualification(currentPair: DePairs): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.currentICDexService.IDO_qualification(
        currentPair[0].toString(),
        [this.getPrincipalId]
      );
      if (res && res.length) {
        this.qualification = res[0][1];
      } else {
        this.qualification = null;
      }
      if (
        !this.qualification ||
        (this.qualification && !this.qualification.limit)
      ) {
        await this.currentICDexService.IDO_updateQualification(
          currentPair[0].toString()
        );
        const res = await this.currentICDexService.IDO_qualification(
          currentPair[0].toString(),
          [this.getPrincipalId]
        );
        if (res && res.length) {
          this.qualification = res[0][1];
        } else {
          this.qualification = null;
        }
      }
    }
  }
  private async getIDOInfo(currentPair: DePairs): Promise<void> {
    this.isPaused = true;
    this.isIDOPaused = true;
    if (this.getPrincipalId) {
      const res = await this.currentICDexService.IDO_getConfig(
        currentPair[0].toString()
      );
      if (res && res.length) {
        this.IDOConfig = res;
        const now = new Date().getTime();
        if (this.IDOConfig[0] && this.IDOConfig[1]) {
          if (
            new BigNumber(this.IDOConfig[1].IDOOpeningTime.toString(10))
              .div(10 ** 6)
              .lt(now) &&
            new BigNumber(this.IDOConfig[1].IDOClosingTime.toString(10))
              .div(10 ** 6)
              .gt(now)
          ) {
            this.IDO_qualification(currentPair);
            this.orderType = OrderTypeEnum.FOK;
            this.$set(this.pairInfo, 'paused', true);
            this.isIDOPaused = false;
          }
          if (
            this.IDOConfig[0] &&
            this.IDOConfig[0][0] &&
            this.IDOConfig[0][0].toString() === this.getPrincipalId &&
            new BigNumber(this.IDOConfig[1].IDOOpeningTime.toString(10))
              .div(10 ** 6)
              .gt(now)
          ) {
            this.isPaused = false;
          }
        }
      }
    }
  }
  private async getIDOLiquidity(
    swapId: string,
    token1ToUsdRatio: string
  ): Promise<string> {
    const res = await this.currentICDexService.liquidity(swapId, [
      this.getPrincipalId
    ]);
    if (res && res.pairId === swapId) {
      return token1ToUsdRatio;
      // return new BigNumber(res.tokenLiquidity.vol.value1.toString(10)).div(this.tokens[]);
    }
  }
  private async initDex(): Promise<void> {
    const token0Info = this.currentPair[1][0].token0;
    const token1Info = this.currentPair[1][0].token1;
    await Promise.all([
      // this.getTokenBalance(token0Info),
      // this.getTokenBalance(token1Info),
      // this.getTokenBalanceSto(token0Info),
      // this.getTokenBalanceSto(token1Info),
      this.getLevel100(this.currentPair[0].toString(), 'init')
    ]);
    this.initPrice();
    await Promise.all([
      this.getQuotes(this.currentPair[0].toString(), true),
      this.getConfig()
    ]);
    if (this.getPrincipalId) {
      await Promise.all([
        // this.getTradeList(this.currentPair[0].toString(), this.getPrincipalId),
        // this.getPending(this.currentPair[0].toString(), true),
        this.getTotalPending(),
        this.getPairInfo(this.currentPair)
        // this.getUserLiquidity(this.currentPair[0].toString())
      ]);
    }
    try {
      if (this.getPrincipalId) {
        const currentPairId = this.currentPair[0].toString();
        const res = await this.getTxAccount(currentPairId);
        if (res && res.pairId === this.currentPair[0].toString()) {
          this.prepare[currentPairId] = res.txAccount;
          this.initPrepared(currentPairId);
        }
      }
    } catch (e) {}
    await this.getIntervalPrice();
    if (!this.isToSetReferrer) {
      this.toSetReferrer();
    }
  }
  private async addToken(res: Array<SwapTokenInfo>): Promise<void> {
    const tokens = await addedTokens();
    const tokensId: Array<string> = [];
    tokens.forEach((item) => {
      tokensId.push(item.canisterId.toString());
    });
    for (let i = 0; i < res.length; i++) {
      if (this.$route.name !== 'ICDex') {
        return;
      }
      const tokenId = res[i][0].toString();
      if (tokenId !== LEDGER_CANISTER_ID && !tokensId.includes(tokenId)) {
        let standard = Object.keys(res[i][2])[0];
        if (standard !== 'dip20') {
          const amount = await getTokenBalance(res[i][2], tokenId);
          if (new BigNumber(amount).gt(0)) {
            if (standard.toLocaleLowerCase() === 'drc20') {
              standard = 'DRC20';
            }
            if (standard.toLocaleLowerCase() === 'icrc1') {
              standard = 'ICRC-1';
            }
            if (standard.toLocaleLowerCase() === 'icrc2') {
              // todo
              standard = 'ICRC-1';
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
      const res = await this.currentICDexService.ta_getReferrer(
        dexId,
        this.getPrincipalId
      );
      if (res && res.pairId === this.currentPair[0].toString()) {
        return res.referrer;
      }
    } catch (e) {}
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
      if (this.getPrincipalId) {
        const address = principalToAccountIdentifier(
          Principal.fromText(this.getPrincipalId)
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
    } catch (e) {}
  }
  private async getLiquidity(
    swapId: string,
    index: number,
    currentTradeMarketSort: string,
    pairs?: Array<DePairs>
  ): Promise<void> {
    if (this.$route.name !== 'ICDex') {
      return;
    }
    // const liquidity = await currentICDexService.liquidity(swapId);
    try {
      const res = await this.currentICDexService.stats(swapId);
      if (!res) {
        return;
      }
      if (!pairs) {
        pairs = this.tradePairs[currentTradeMarketSort];
      }
      if (this.pairSearch) {
        pairs = this.pairs;
      }
      let newPair;
      if (pairs[index]) {
        newPair = pairs[index][0].toString();
      }
      if (res.pairId === newPair) {
        this.$set(pairs[index], 2, res.stats);
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
    } catch (e) {}
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
    }
  }
  private async getLevel100(swapId: string, type?: string): Promise<void> {
    const res = await this.currentICDexService.level100(swapId);
    if (res.pairId === this.currentPair[0].toString()) {
      this.level100 = res.levelResponse;
      if (
        this.tokens &&
        this.tokens[this.currentPair[1][0].token0[0].toString()] &&
        this.unit !== this.level100[0]
      ) {
        this.unit = this.level100[0];
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
      if (
        this.tokens[this.currentPair[1][0].token1[0].toString()] &&
        this.tokens[this.currentPair[1][0].token0[0].toString()]
      ) {
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
  private filterStopLimitTotalFilled(
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
  private filterStopLimitQuantity(
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
  private filterStopLimitFilled(item: STOrder): string {
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
  private filterStopLimitPrice(
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
  private filterFiledPro(
    val: STOrder,
    token0Decimals: number,
    token1Decimals: number,
    tokenAmountUnit: number,
    buyUnit: number
  ): string {
    try {
      let total = '0';
      let type = Object.keys(val.strategy)[0];
      const side = Object.keys(val.strategy[type].setting.order.side)[0];
      const token = Object.keys(val.strategy[type].setting.totalLimit)[0];
      let decimalsFixed = tokenAmountUnit;
      let decimals = token0Decimals;
      if (token === 'Token1') {
        decimalsFixed = buyUnit;
        decimals = token1Decimals;
      }
      if (val.stats.totalInAmount[token.toLocaleLowerCase()]) {
        total = val.stats.totalInAmount[token.toLocaleLowerCase()].toString(10);
      } else {
        total =
          val.stats.totalOutAmount[token.toLocaleLowerCase()].toString(10);
      }
      return new BigNumber(total).div(10 ** decimals).toFixed(decimalsFixed);
    } catch (e) {
      return '';
    }
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
    }
  }
  private draggableStar(event): void {
    this.drag = true;
    this.dragPair =
      this.tradePairs[this.currentTradeMarketSort][event.oldIndex];
  }
  private draggableEnd(event): void {
    this.drag = false;
    if (
      event.oldIndex !== event.newIndex &&
      this.dragPair[1][0].canisterId.toString() !==
        this.tradePairs[this.currentTradeMarketSort][
          event.newIndex
        ][1][0].canisterId.toString()
    ) {
      // const pair = this.tradePairs[this.currentTradeMarketSort][event.oldIndex];
      this.tradePairs[this.currentTradeMarketSort].splice(event.oldIndex, 1);
      this.tradePairs[this.currentTradeMarketSort].splice(
        event.newIndex,
        0,
        this.dragPair
      );
    }
    this.throttle();
    this.dragPair = null;
  }
  private async updateFavoritesListOrder(): Promise<void> {
    const favoritesList: Array<Principal> = [];
    const star: Array<string> = [];
    this.tradePairs[this.currentTradeMarketSort].forEach((item) => {
      favoritesList.push(item[1][0].canisterId);
      star.push(item[1][0].canisterId.toString());
    });
    if (!this.getPrincipalId) {
      localStorage.setItem('star', JSON.stringify(star));
    }
    await this.ICLighthouseService.updateFavoritesListOrder(favoritesList);
  }
  private throttle() {
    if (!timer) {
      timer = setTimeout(() => {
        this.updateFavoritesListOrder();
        timer = null;
        clearTimeout(timer);
      }, 6 * 1000);
    }
  }
}
</script>
<style scoped lang="scss">
.old-icl-type {
  padding: 1px 4px;
  background: #2a303a;
  border-radius: 20px;
}
.user-setting {
  display: flex;
  align-items: center;
  color: #fff;
  padding: 10px 20px;
  border-bottom: 1px solid #383e4e;
  cursor: pointer;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
  &.active {
    color: #51b7c3;
  }
  &:last-child {
    border: none;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}
.set-pool {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #adb3c4;
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
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
  display: flex;
  width: 70px;
  text-align: left;
  font-size: 20px;
  transform: scale(0.5);
  transform-origin: left;
  &.balance-label-wallet {
    width: 40px;
  }
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
  overflow-y: scroll;
  transform: translateZ(0);
  -webkit-overflow-scrolling: touch;
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
  .home-header-right-info {
    min-width: 280px;
  }
}
.taker-fee {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
  &.taker-fee-stop {
    display: block;
    width: 200%;
    margin-top: 10px;
    font-size: 18px;
    transform: scale(0.5);
    transform-origin: left top;
    line-height: 1.2;
  }
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
    flex-wrap: wrap;
  }
  .trade-item-pro-balance-left,
  .trade-item-pro-balance-right {
    display: flex;
    align-items: center;
    width: 100%;
    > div {
      width: 50%;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      font-size: 12px;
      line-height: 24px;
      padding-right: 5px;
    }
    .trade-item-pro-balance-label {
      display: inline-block;
      flex-shrink: 0;
      width: 115px;
      font-size: 12px;
      font-weight: bold;
    }
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
      padding-top: 5px;
      .pro-order-button {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        button {
          width: 40%;
          max-width: 300px;
          min-width: 200px;
          margin: 10px 10px 0 10px;
          background: rgba(58, 168, 181, 0.7);
        }
      }
      p {
        margin-bottom: 5px;
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
  &.show-stop-limit {
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
.taker-fee-stop-button {
  margin-top: 0;
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
  bottom: -300px;
  left: 0;
  right: 0;
  z-index: 998;
  width: 100%;
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
      padding: 0 10px;
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
.dots {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-bottom: 1px;
  border-radius: 3px;
  background: #adb3c4;
}
.pair-stage {
  display: inline-block;
  width: 14px;
  height: 14px;
  text-align: center;
  line-height: 14px;
  font-size: 12px;
  border-radius: 20px;
}
.STAGE2 {
  background: #65aef1;
}
.STAGE1 {
  background: #e1e10e;
}
.STAGE0 {
  background: #df9708;
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
  width: 280px;
  height: 28px;
  margin-bottom: 5px;
  padding: 5px 10px;
  color: #adb3c4;
  font-size: 12px;
  .circle {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 6px;
    height: 6px;
    border-radius: 3px;
  }
  .trade-market-old-main {
    font-weight: bold;
  }
  li {
    position: relative;
    z-index: 0;
    height: 28px;
    padding: 0 10px;
    line-height: 28px;
    font-size: 11px;
    cursor: pointer;
    border: 1px solid #242d38;
    border-left: none;
    transition: all 0.2s;
    &.hide-sort {
      display: none;
      &.show-sort {
        display: block;
      }
    }
    &:last-child {
      padding: 0 8px;
    }
    &:first-child,
    &:nth-child(2) {
      border-left: 1px solid #242d38;
      &.active {
        z-index: 1;
        margin-right: -1px;
        margin-left: 0;
      }
    }
    /*
    &:last-child {
      &.active {
        z-index: 1;
        margin-left: -1px;
      }
    }*/
    &:hover {
      color: #fff;
    }
    &.active {
      color: #fff;
    }
    &.disabled {
      color: #adb3c4;
      cursor: auto;
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
  &.show-stop-limit {
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
        height: 206px;
        overflow-y: scroll;
        transform: translateZ(0);
        -webkit-overflow-scrolling: touch;
        tr {
          height: 26px;
        }
      }
    }
    tbody.de-swap-list-item-pair {
      overflow-y: scroll;
      transform: translateZ(0);
      -webkit-overflow-scrolling: touch;
      &.de-swap-list-item-pair-market {
        height: 336px;
        tr {
          height: 50px;
        }
      }
      tr.active {
        background: #1f2b37;
        color: #adb7c2;
        .pair-name {
          color: #adb7c2 !important;
        }
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
.pair-name {
  display: block;
  height: 12px;
  font-size: 20px;
  transform: scale(0.5);
  transform-origin: left top;
  white-space: nowrap;
  color: #adb7c2;
}
.de-swap-list-item-search {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 0 10px;
  ::v-deep input {
    height: 28px !important;
    background: #131920 !important;
    border-radius: 3px !important;
    border-color: #242d38 !important;
    font-size: 12px !important;
  }
  ::v-deep .ant-input-clear-icon:hover {
    color: #727a87;
  }
}
.font-10 {
  font-size: 20px;
  transform: scale(0.5);
  transform-origin: left center;
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
  &.show-stop-limit {
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
  padding-right: 10px;
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
      padding-left: 0;
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
  margin-bottom: 5px;
  &.swap-transfer-list-header-fallback-trades {
    ul {
      li {
        color: #5e6170;
        border-bottom: 1px solid transparent;
        &.active {
          color: #8795a3;
          border-bottom-color: #51b7c3;
        }
      }
    }
  }
  span {
    margin-left: auto;
    font-size: 12px;
    color: #8c90a1;
  }
}
.std-lint-menu {
  ul {
    li {
      &:last-child {
        padding-left: 20px;
      }
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
      &:hover {
        color: #afbac5;
      }
      &.active {
        color: #afbac5;
      }
    }
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
  width: 60px;
  height: 28px;
  margin-right: 10px;
}
.vol-h5 {
  margin-top: 20px;
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
.pro-orders-note {
  line-height: 1.5;
  text-align: center;
  padding-top: 10px;
}
@media screen and (max-width: 1200px) {
  .pro-orders-note {
    line-height: 1;
    padding-top: 5px;
  }
  .trade-item {
    .trade-item-pro-balance-left,
    .trade-item-pro-balance-right {
      width: 100%;
      padding-left: 0;
      .trade-item-pro-balance-label {
        width: 95px;
        white-space: nowrap;
        transform: scale(0.5);
        transform-origin: left;
        font-size: 20px;
      }
    }
  }
  .trade-main .k-interval-main-header .k-interval-main-header-name {
    font-size: 12px;
    padding: 0 3px;
  }
  .trade-main .k-interval-time li {
    padding: 0 4px;
  }
  .trade-competitions-enum li {
    font-size: 12px;
    padding: 0 5px;
  }
}
@media screen and (max-width: 768px) {
  .std-lint-menu {
    ul {
      li {
        &:last-child {
          padding-left: 10px;
        }
      }
    }
  }
  .cancel-pending {
    padding-right: 0;
    padding-left: 10px;
  }
  .trade-item-pro-h5-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 8px 15px !important;
    border-bottom: 1px solid #383e4e;
    cursor: pointer;
    &.active {
      color: #51b7c3;
    }
    &:last-child {
      border-bottom: none;
    }
  }
  .trade-item-pro-h5 {
    .trade-item-pro-h5-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160px;
      margin: 20px auto;
      font-size: 16px;
      color: #fff;
    }
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
      padding: 0;
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
    .home-header-right-info {
      width: auto;
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
      overflow-y: scroll;
      transform: translateZ(0);
      -webkit-overflow-scrolling: touch;
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
      overflow-y: scroll;
      transform: translateZ(0);
      -webkit-overflow-scrolling: touch;
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
        background: #06080b;
        li {
          width: auto;
          padding-bottom: 10px;
          margin-right: 10px;
          border-bottom: 2px solid transparent;
          &.active {
            border-color: #51b7c3;
          }
          &:last-child {
            border-bottom: 2px solid transparent;
          }
        }
      }
    }
  }
  .pending-header-h5 {
    display: flex;
    flex-wrap: wrap;
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
.market-menu-tooltip .ant-tooltip-inner {
  padding: 0;
}
.adopted-countdown {
  line-height: 1;
  .ant-statistic-content {
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
}
</style>
