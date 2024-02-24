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
      <div class="flex-center margin-left-auto">
        <span
          v-if="getPrincipalId"
          @click="showLaunch"
          class="base-font-title pointer pc-show"
          style="font-size: 15px"
          >+Launch</span
        >
        <div class="home-header-right-info">
          <account-info :menu-list="menuList"></account-info>
        </div>
      </div>
    </div>
    <div class="market-main container-width">
      <ul class="pools-menu">
        <li
          v-for="menu in poolsMenu"
          :key="menu.value"
          :class="{
            active: menu.value === currentPoolsMenu
          }"
          @click="changeMenu(menu.value)"
        >
          {{ menu.name }}
        </li>
      </ul>
      <div>
        <div class="flex-center">
          <span class="base-color-w" style="font-size: 16px">
            <span v-show="!pairPools || currentPoolsMenu === 'private'"
              >OAMM pools
              <span>
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <div
                      style="font-size: 16px"
                      class="base-font-title base-color-w"
                    >
                      LPs yield
                    </div>
                    <div class="base-font-title">
                      LPs may benefit from adding liquidity to the liquidity
                      pool, but it is risky and does not result in a stable gain
                      or may result in a loss. Possible gains include:
                    </div>
                    <div>
                      <span class="dots"></span> Grid spread gain: ICDexMaker
                      opens a grid strategy in the trading pair, there exists a
                      spread between every two grids, if the price shows upward
                      and downward fluctuations, ICDexMaker can get the grid
                      spread gain. However, if the price fluctuates in one
                      direction, the number of ICDexMaker's one token will
                      become more and the number of the other token will become
                      less, and it will not get the spread gain. Therefore, the
                      amount of grid spread gain is related to the volatility of
                      the trading pair.
                    </div>
                    <div>
                      <span class="dots"></span> Vip-maker rebate: When
                      ICDexMaker has the role of vip-maker, it can get the
                      trading fee rebate, and this part of the gain will be
                      added to the liquidity pool.
                    </div>
                    <div>
                      <span class="dots"></span> Withdrawal fee on removal of
                      liquidity: When an LP withdraws liquidity, he will be
                      charged a withdrawal fee to be added to the liquidity
                      pool.
                    </div>
                    <div>
                      <span class="dots"></span> Liquidity mining/airdrop: this
                      is a contingent benefit, ICDexMaker itself does not
                      provide liquidity mining or token airdrop, which requires
                      LPs to pay attention to the Dex platform side or the
                      project side of the liquidity mining or airdrop activity
                      announcement.
                    </div>
                  </template>
                  <span style="margin-left: 10px" class="base-font-title">
                    LPs yield <a-icon type="question-circle" />
                  </span>
                </a-tooltip>
              </span>
            </span>
            <span
              v-if="
                currentPoolsMenu === 'public' &&
                pairPools &&
                pairToSymbol &&
                pairToSymbol[pairPools]
              "
            >
              <a-icon class="back-arrow" type="arrow-left" @click="backAll" />
              Pair {{ pairToSymbol[pairPools].pair.token0[1] }}/{{
                pairToSymbol[pairPools].pair.token1[1]
              }}({{ pairPools }}) OAMM pools
              <span>
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <div
                      style="font-size: 16px"
                      class="base-font-title base-color-w"
                    >
                      LPs yield
                    </div>
                    <div class="base-font-title">
                      LPs may benefit from adding liquidity to the liquidity
                      pool, but it is risky and does not result in a stable gain
                      or may result in a loss. Possible gains include:
                    </div>
                    <div>
                      <span class="dots"></span> Grid spread gain: ICDexMaker
                      opens a grid strategy in the trading pair, there exists a
                      spread between every two grids, if the price shows upward
                      and downward fluctuations, ICDexMaker can get the grid
                      spread gain. However, if the price fluctuates in one
                      direction, the number of ICDexMaker's one token will
                      become more and the number of the other token will become
                      less, and it will not get the spread gain. Therefore, the
                      amount of grid spread gain is related to the volatility of
                      the trading pair.
                    </div>
                    <div>
                      <span class="dots"></span> Vip-maker rebate: When
                      ICDexMaker has the role of vip-maker, it can get the
                      trading fee rebate, and this part of the gain will be
                      added to the liquidity pool.
                    </div>
                    <div>
                      <span class="dots"></span> Withdrawal fee on removal of
                      liquidity: When an LP withdraws liquidity, he will be
                      charged a withdrawal fee to be added to the liquidity
                      pool.
                    </div>
                    <div>
                      <span class="dots"></span> Liquidity mining/airdrop: this
                      is a contingent benefit, ICDexMaker itself does not
                      provide liquidity mining or token airdrop, which requires
                      LPs to pay attention to the Dex platform side or the
                      project side of the liquidity mining or airdrop activity
                      announcement.
                    </div>
                  </template>
                  <span style="margin-left: 10px" class="base-font-title">
                    LPs yield <a-icon type="question-circle" />
                  </span>
                </a-tooltip>
              </span>
            </span>
          </span>
          <button
            v-if="getPrincipalId"
            type="button"
            class="primary margin-left-auto"
            @click="onCreatePool"
            style="width: 150px; height: 32px"
          >
            <span v-show="currentPoolsMenu === 'public'">
              Create a public pool
            </span>
            <span v-show="currentPoolsMenu === 'private'">
              Create a private pool
            </span>
          </button>
        </div>
        <div v-show="currentPoolsMenu === 'public'">
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
                    v-if="tokens[item[2].pairInfo.token0[0].toString()].logo"
                    :src="tokens[item[2].pairInfo.token0[0].toString()].logo"
                    alt=""
                  />
                  <span v-else>
                    {{
                      tokens[item[2].pairInfo.token0[0].toString()].symbol
                        .slice(0, 1)
                        .toLocaleUpperCase()
                    }}
                  </span>
                </span>
                <span class="img-content">
                  <img
                    v-if="tokens[item[2].pairInfo.token1[0].toString()].logo"
                    :src="tokens[item[2].pairInfo.token1[0].toString()].logo"
                    alt=""
                  />
                  <span v-else>
                    {{
                      tokens[item[2].pairInfo.token1[0].toString()].symbol
                        .slice(0, 1)
                        .toLocaleUpperCase()
                    }}
                  </span>
                </span>
                <span
                  v-if="item[2]"
                  class="base-font-title"
                  style="margin-left: 5px"
                >
                  {{ item[2].name | ellipsisAccount(20) }}
                </span>
                <span
                  @click.stop="
                    jump(
                      `/ICDex/${
                        tokens[item[2].pairInfo.token0[0].toString()].symbol
                      }/${tokens[item[2].pairInfo.token1[0].toString()].symbol}`
                    )
                  "
                  class="pc-show link"
                  style="margin-left: 5px"
                >
                  {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}/{{
                    tokens[item[2].pairInfo.token1[0].toString()].symbol
                  }}
                </span>
                <span class="creator-img" v-if="isCreator(item[1])">
                  <img src="@/assets/img/creator.svg" alt="" />
                </span>
                <span
                  v-if="item[5] && item[5].vipMaker"
                  class="margin-left-auto"
                >
                  <a-tooltip placement="top">
                    <template slot="title"> vip-maker </template>
                    <span class="vip-maker-pool"></span>
                  </a-tooltip>
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
                  Become a Vip-Maker
                </span>
              </div>
              <div
                v-if="
                  item[2] &&
                  tokens[item[2].pairInfo.token0[0].toString()] &&
                  tokens[item[2].pairInfo.token1[0].toString()]
                "
              >
                <span>NAV: </span>
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
                <span v-else>
                  <span class="loading-spinner"></span>&nbsp;Waiting for
                  transactions to complete.
                </span>
              </div>
              <div
                v-if="
                  item[2] &&
                  tokens[item[2].pairInfo.token0[0].toString()] &&
                  tokens[item[2].pairInfo.token1[0].toString()]
                "
              >
                <span> Pool Balance: </span>
                <span class="base-font-title" v-if="item[3]">
                  {{
                    item[3].poolBalance.balance0
                      | bigintToFloat(
                        Math.min(
                          tokens[item[2].pairInfo.token0[0].toString()]
                            .decimals,
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
                          tokens[item[2].pairInfo.token1[0].toString()]
                            .decimals,
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
                    | bigintToFloat(
                      item[2].shareDecimals,
                      item[2].shareDecimals
                    )
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
                <span>APY (Estimated):</span>
              </div>
              <div class="pool-apy base-font-title">
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
                      {{
                        tokens[item[2].pairInfo.token0[0].toString()].symbol
                      }}-based:
                      {{ item[3].apy24h.token0 | filterBuyFee }},</span
                    >
                    <span>
                      {{
                        tokens[item[2].pairInfo.token1[0].toString()].symbol
                      }}-based:
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
                      {{
                        tokens[item[2].pairInfo.token0[0].toString()].symbol
                      }}-based: {{ item[3].apy7d.token0 | filterBuyFee }},</span
                    >
                    <span>
                      {{
                        tokens[item[2].pairInfo.token1[0].toString()].symbol
                      }}-based: {{ item[3].apy7d.token1 | filterBuyFee }}(7-Day
                      APY)
                    </span>
                  </span>
                  <span v-else>-</span>
                </span>
              </div>
              <div class="flex-center mt20 pool-bottom">
                <button
                  class="primary"
                  @click.stop="
                    jump(`/ICDex/pools/pool/${item[1][0][0].toString()}/Add`)
                  "
                  :disabled="!item[3]"
                >
                  Add
                </button>
                <button
                  class="primary"
                  @click.stop="
                    jump(`/ICDex/pools/pool/${item[1][0][0].toString()}/Remove`)
                  "
                  style="margin-left: 20px"
                  :disabled="!item[3]"
                >
                  Remove
                </button>
                <div class="margin-left-auto">
                  <span
                    v-if="
                      item[2] && item[2].gridSoid && item[2].gridSoid.length
                    "
                    class="main-color"
                    @click.stop="
                      showGrid(
                        item,
                        item[2].pairInfo.pairPrincipal.toString(),
                        item[2].gridSoid
                      )
                    "
                    style="margin-right: 10px"
                    >Grid orders</span
                  >
                  <span
                    v-if="item"
                    class="main-color pc-show"
                    @click.stop="showHistory(item)"
                    style="margin-right: 10px"
                    >Activities</span
                  >
                  <span
                    v-if="item && item[1]"
                    class="main-color pc-show"
                    @click.stop="showEvents(item)"
                    >Events</span
                  >
                </div>
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
                    v-if="tokens[item[2].pairInfo.token0[0].toString()].logo"
                    :src="tokens[item[2].pairInfo.token0[0].toString()].logo"
                    alt=""
                  />
                  <span v-else>
                    {{
                      tokens[item[2].pairInfo.token0[0].toString()].symbol
                        .slice(0, 1)
                        .toLocaleUpperCase()
                    }}
                  </span>
                </span>
                <span class="img-content">
                  <img
                    v-if="tokens[item[2].pairInfo.token1[0].toString()].logo"
                    :src="tokens[item[2].pairInfo.token1[0].toString()].logo"
                    alt=""
                  />
                  <span v-else>
                    {{
                      tokens[item[2].pairInfo.token1[0].toString()].symbol
                        .slice(0, 1)
                        .toLocaleUpperCase()
                    }}
                  </span>
                </span>
                <span
                  v-if="item[2]"
                  class="base-font-title"
                  style="margin-left: 5px"
                >
                  {{ item[2].name | ellipsisAccount(20) }}
                </span>
                <span
                  @click.stop="
                    jump(
                      `/ICDex/${
                        tokens[item[2].pairInfo.token0[0].toString()].symbol
                      }/${tokens[item[2].pairInfo.token1[0].toString()].symbol}`
                    )
                  "
                  class="pc-show link"
                  style="margin-left: 5px"
                >
                  {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}/{{
                    tokens[item[2].pairInfo.token1[0].toString()].symbol
                  }}
                </span>
                <span class="creator-img" v-if="isCreator(item[1])">
                  <img src="@/assets/img/creator.svg" alt="" />
                </span>
                <span
                  v-if="item[5] && item[5].vipMaker"
                  class="margin-left-auto"
                >
                  <a-tooltip placement="top">
                    <template slot="title"> vip-maker </template>
                    <span class="vip-maker-pool"></span>
                  </a-tooltip>
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
                  Become a Vip-Maker
                </span>
              </div>
              <div
                v-if="
                  item[2] &&
                  tokens[item[2].pairInfo.token0[0].toString()] &&
                  tokens[item[2].pairInfo.token1[0].toString()]
                "
              >
                <span>NAV: </span>
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
                <span v-else>
                  <span class="loading-spinner"></span>&nbsp;Waiting for
                  transactions to complete.
                </span>
              </div>
              <div
                v-if="
                  item[2] &&
                  tokens[item[2].pairInfo.token0[0].toString()] &&
                  tokens[item[2].pairInfo.token1[0].toString()]
                "
              >
                <span> Pool Balance: </span>
                <span class="base-font-title" v-if="item[3]">
                  {{
                    item[3].poolBalance.balance0
                      | bigintToFloat(
                        Math.min(
                          tokens[item[2].pairInfo.token0[0].toString()]
                            .decimals,
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
                          tokens[item[2].pairInfo.token1[0].toString()]
                            .decimals,
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
                    | bigintToFloat(
                      item[2].shareDecimals,
                      item[2].shareDecimals
                    )
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
                <span>APY (Estimated):</span>
              </div>
              <div class="pool-apy base-font-title">
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
                      {{
                        tokens[item[2].pairInfo.token0[0].toString()].symbol
                      }}-based:
                      {{ item[3].apy24h.token0 | filterBuyFee }},</span
                    >
                    <span>
                      {{
                        tokens[item[2].pairInfo.token1[0].toString()].symbol
                      }}-based:
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
                      {{
                        tokens[item[2].pairInfo.token0[0].toString()].symbol
                      }}-based: {{ item[3].apy7d.token0 | filterBuyFee }},</span
                    >
                    <span>
                      {{
                        tokens[item[2].pairInfo.token1[0].toString()].symbol
                      }}-based: {{ item[3].apy7d.token1 | filterBuyFee }}(7-Day
                      APY)
                    </span>
                  </span>
                  <span v-else>-</span>
                </span>
              </div>
              <div class="flex-center mt20 pool-bottom">
                <button
                  class="primary"
                  @click.stop="
                    jump(`/ICDex/pools/pool/${item[1][0][0].toString()}/Add`)
                  "
                  :disabled="!item[3]"
                >
                  Add
                </button>
                <button
                  class="primary"
                  @click.stop="
                    jump(`/ICDex/pools/pool/${item[1][0][0].toString()}/Remove`)
                  "
                  style="margin-left: 20px"
                  :disabled="!item[3]"
                >
                  Remove
                </button>
                <div class="margin-left-auto">
                  <span
                    v-if="
                      item[2] && item[2].gridSoid && item[2].gridSoid.length
                    "
                    class="main-color"
                    @click.stop="
                      showGrid(
                        item,
                        item[2].pairInfo.pairPrincipal.toString(),
                        item[2].gridSoid
                      )
                    "
                    style="margin-right: 10px"
                    >Grid orders</span
                  >
                  <span
                    v-if="item"
                    class="main-color pc-show"
                    @click.stop="showHistory(item)"
                    style="margin-right: 10px"
                    >Activities</span
                  >
                  <span
                    v-if="item && item[1]"
                    class="main-color pc-show"
                    @click.stop="showEvents(item)"
                    >Events</span
                  >
                </div>
              </div>
            </li>
          </ul>
          <div
            v-if="!poolLoad && !poolsLoad.length"
            class="base-color-w"
            style="text-align: center; margin-top: 100px; font-size: 16px"
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
        <div v-show="currentPoolsMenu === 'private'">
          <ul v-if="poolsPri && poolsPri.length > 0" class="pool-main mt20">
            <li
              v-for="(item, index) in poolsPri"
              :key="index"
              @click="jumpPool(item[1], false)"
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
                    v-if="tokens[item[2].pairInfo.token0[0].toString()].logo"
                    :src="tokens[item[2].pairInfo.token0[0].toString()].logo"
                    alt=""
                  />
                  <span v-else>
                    {{
                      tokens[item[2].pairInfo.token0[0].toString()].symbol
                        .slice(0, 1)
                        .toLocaleUpperCase()
                    }}
                  </span>
                </span>
                <span class="img-content">
                  <img
                    v-if="tokens[item[2].pairInfo.token1[0].toString()].logo"
                    :src="tokens[item[2].pairInfo.token1[0].toString()].logo"
                    alt=""
                  />
                  <span v-else>
                    {{
                      tokens[item[2].pairInfo.token1[0].toString()].symbol
                        .slice(0, 1)
                        .toLocaleUpperCase()
                    }}
                  </span>
                </span>
                <span
                  v-if="item[2]"
                  class="base-font-title"
                  style="margin-left: 5px"
                >
                  {{ item[2].name | ellipsisAccount(20) }}
                </span>
                <span
                  @click.stop="
                    jump(
                      `/ICDex/${
                        tokens[item[2].pairInfo.token0[0].toString()].symbol
                      }/${tokens[item[2].pairInfo.token1[0].toString()].symbol}`
                    )
                  "
                  class="pc-show link"
                  style="margin-left: 5px"
                >
                  {{ tokens[item[2].pairInfo.token0[0].toString()].symbol }}/{{
                    tokens[item[2].pairInfo.token1[0].toString()].symbol
                  }}
                </span>
                <span class="creator-img" v-if="isCreator(item[1])">
                  <img src="@/assets/img/creator.svg" alt="" />
                </span>
                <span
                  v-if="item[5] && item[5].vipMaker"
                  class="margin-left-auto"
                >
                  <a-tooltip placement="top">
                    <template slot="title"> vip-maker </template>
                    <span class="vip-maker-pool"></span>
                  </a-tooltip>
                </span>
                <span
                  v-if="item[5] && !item[5].vipMaker"
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
                  Become a Vip-Maker
                </span>
              </div>
              <div
                v-if="
                  item[2] &&
                  tokens[item[2].pairInfo.token0[0].toString()] &&
                  tokens[item[2].pairInfo.token1[0].toString()]
                "
              >
                <span>NAV: </span>
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
                <span v-else>
                  <span class="loading-spinner"></span>&nbsp;Waiting for
                  transactions to complete.
                </span>
              </div>
              <div
                v-if="
                  item[2] &&
                  tokens[item[2].pairInfo.token0[0].toString()] &&
                  tokens[item[2].pairInfo.token1[0].toString()]
                "
              >
                <span> Pool Balance: </span>
                <span class="base-font-title" v-if="item[3]">
                  {{
                    item[3].poolBalance.balance0
                      | bigintToFloat(
                        Math.min(
                          tokens[item[2].pairInfo.token0[0].toString()]
                            .decimals,
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
                          tokens[item[2].pairInfo.token1[0].toString()]
                            .decimals,
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
                    | bigintToFloat(
                      item[2].shareDecimals,
                      item[2].shareDecimals
                    )
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
                <span>APY (Estimated):</span>
              </div>
              <div class="pool-apy base-font-title">
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
                      {{
                        tokens[item[2].pairInfo.token0[0].toString()].symbol
                      }}-based:
                      {{ item[3].apy24h.token0 | filterBuyFee }},</span
                    >
                    <span>
                      {{
                        tokens[item[2].pairInfo.token1[0].toString()].symbol
                      }}-based:
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
                      {{
                        tokens[item[2].pairInfo.token0[0].toString()].symbol
                      }}-based: {{ item[3].apy7d.token0 | filterBuyFee }},</span
                    >
                    <span>
                      {{
                        tokens[item[2].pairInfo.token1[0].toString()].symbol
                      }}-based: {{ item[3].apy7d.token1 | filterBuyFee }}(7-Day
                      APY)
                    </span>
                  </span>
                  <span v-else>-</span>
                </span>
              </div>
              <div class="flex-center mt20 pool-bottom">
                <button
                  class="primary"
                  @click.stop="
                    jump(
                      `/ICDex/pools/pool/${item[1][0][0].toString()}/Add?private`
                    )
                  "
                  :disabled="!item[3]"
                >
                  Add
                </button>
                <button
                  class="primary"
                  @click.stop="
                    jump(
                      `/ICDex/pools/pool/${item[1][0][0].toString()}/Remove?private`
                    )
                  "
                  style="margin-left: 20px"
                  :disabled="!item[3]"
                >
                  Remove
                </button>
                <div class="margin-left-auto">
                  <span
                    v-if="
                      item[2] && item[2].gridSoid && item[2].gridSoid.length
                    "
                    class="main-color"
                    @click.stop="
                      showGrid(
                        item,
                        item[2].pairInfo.pairPrincipal.toString(),
                        item[2].gridSoid
                      )
                    "
                    style="margin-right: 10px"
                    >Grid orders</span
                  >
                  <span
                    v-if="item"
                    class="main-color pc-show"
                    @click.stop="showHistory(item)"
                    style="margin-right: 10px"
                    >Activities</span
                  >
                  <span
                    v-if="item && item[1]"
                    class="main-color pc-show"
                    @click.stop="showEvents(item)"
                    >Events</span
                  >
                </div>
              </div>
            </li>
            <li v-show="!poolsPri && !poolsPri.length">
              <a-skeleton :loading="!poolsPri && !poolsPri.length" active />
            </li>
          </ul>
          <div
            v-if="poolsPri && !poolsPri.length"
            class="base-color-w"
            style="text-align: center; margin-top: 100px; font-size: 16px"
          >
            No Pools
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model="gridVisible"
      width="600px"
      :title="poolGridTitle"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="delete-modal"
    >
      <a-spin :spinning="gridSpinning">
        <table class="ant-table-tbody">
          <thead>
            <tr>
              <th>Soid</th>
              <th>Status</th>
              <th>Strategy</th>
              <th>Stats</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in poolGrids" :key="item.soid.toString(10)">
              <td>{{ item.soid.toString(10) }}</td>
              <td>{{ Object.keys(item.status)[0] }}</td>
              <td>
                <div>
                  Price range:
                  <span
                    v-if="
                      currentPool &&
                      currentPool[2] &&
                      tokens &&
                      tokens[currentPool[2].pairInfo.token0[0].toString()] &&
                      tokens[currentPool[2].pairInfo.token1[0].toString()]
                    "
                  >
                    {{
                      filterLevelPrice(
                        item.strategy.GridOrder.setting.lowerLimit,
                        currentPool[2].pairInfo.pairUnitSize,
                        tokens[currentPool[2].pairInfo.token0[0].toString()]
                          .decimals,
                        tokens[currentPool[2].pairInfo.token1[0].toString()]
                          .decimals
                      )
                    }}
                  </span>
                  ~
                  <span
                    v-if="
                      currentPool &&
                      currentPool[2] &&
                      tokens &&
                      tokens[currentPool[2].pairInfo.token0[0].toString()] &&
                      tokens[currentPool[2].pairInfo.token1[0].toString()]
                    "
                  >
                    {{
                      filterLevelPrice(
                        item.strategy.GridOrder.setting.upperLimit,
                        currentPool[2].pairInfo.pairUnitSize,
                        tokens[currentPool[2].pairInfo.token0[0].toString()]
                          .decimals,
                        tokens[currentPool[2].pairInfo.token1[0].toString()]
                          .decimals
                      )
                    }}
                  </span>
                </div>
                <div>
                  Grid spread:
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
                      currentPool &&
                      currentPool[2] &&
                      tokens &&
                      tokens[currentPool[2].pairInfo.token1[0].toString()]
                        .decimals
                    "
                  >
                    {{
                      filterLevelPrice(
                        item.strategy.GridOrder.setting.spread.Arith,
                        currentPool[2].pairInfo.pairUnitSize,
                        tokens[currentPool[2].pairInfo.token0[0].toString()]
                          .decimals,
                        tokens[currentPool[2].pairInfo.token1[0].toString()]
                          .decimals
                      )
                    }}
                    <span>
                      {{
                        tokens[currentPool[2].pairInfo.token1[0].toString()]
                          .symbol
                      }}
                    </span>
                  </span>
                </div>
                <div>
                  Grid order quantity:
                  <span
                    v-if="
                      Object.keys(item.strategy.GridOrder.setting.amount)[0] ===
                      'Percent'
                    "
                  >
                    <span>
                      <span
                        v-if="
                          item.strategy.GridOrder.setting.amount.Percent.length
                        "
                      >
                        {{
                          item.strategy.GridOrder.setting.amount.Percent[0]
                            | filterPpm
                        }}
                      </span>
                      <span
                        v-else-if="
                          item.strategy.GridOrder.setting.ppmFactor.length
                        "
                      >
                        {{
                          item.strategy.GridOrder.setting.ppmFactor[0]
                            | filterPpm
                        }}
                      </span>
                      <a-tooltip placement="top">
                        <template slot="title">
                          Percentage of available balance in TradeAccount for
                          pro-trader.
                        </template>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </span>
                  </span>
                  <span
                    v-if="
                      Object.keys(item.strategy.GridOrder.setting.amount)[0] ===
                        'Token0' &&
                      currentPool &&
                      currentPool[2] &&
                      tokens &&
                      tokens[currentPool[2].pairInfo.token0[0].toString()]
                        .decimals
                    "
                  >
                    {{
                      item.strategy.GridOrder.setting.amount.Token0
                        | bigintToFloat(
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                            .decimals,
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                            .decimals
                        )
                    }}
                    {{
                      tokens[currentPool[2].pairInfo.token0[0].toString()]
                        .symbol
                    }}
                  </span>
                  <span
                    v-if="
                      Object.keys(item.strategy.GridOrder.setting.amount)[0] ===
                        'Token1' &&
                      currentPool &&
                      currentPool[2] &&
                      tokens &&
                      tokens[currentPool[2].pairInfo.token1[0].toString()]
                        .decimals
                    "
                  >
                    {{
                      item.strategy.GridOrder.setting.amount.Token1
                        | bigintToFloat(
                          tokens[currentPool[2].pairInfo.token1[0].toString()]
                            .decimals,
                          tokens[currentPool[2].pairInfo.token1[0].toString()]
                            .decimals
                        )
                    }}
                    {{
                      tokens[currentPool[2].pairInfo.token1[0].toString()]
                        .symbol
                    }}
                  </span>
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
                  @click="showPendingOrders(item.pendingOrders, item.strategy)"
                >
                  pending({{
                    item.pendingOrders.buy.length +
                    item.pendingOrders.sell.length
                  }})
                </div>
                <div>orders({{ item.stats.orderCount }})</div>
                <div>errors({{ item.stats.errorCount }})</div>
              </td>
            </tr>
            <tr v-show="!poolGrids.length">
              <td colspan="4" class="text-center">No Grid Orders</td>
            </tr>
          </tbody>
        </table>
      </a-spin>
    </a-modal>
    <a-modal
      v-model="proPendingOrdersModel"
      width="700px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="delete-modal"
    >
      <table class="ant-table-tbody mt20">
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
                v-if="currentPool && currentPool[2] && item[0] && item[0][0]"
                :front="10"
                :is-copy="false"
                :href="`https://ic.house/swap/${currentPool[2].pairInfo.pairPrincipal.toString()}/${filterTxid(
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
                  tokens &&
                  currentPool &&
                  currentPool[2] &&
                  tokens[currentPool[2].pairInfo.token0[0].toString()] &&
                  tokens[currentPool[2].pairInfo.token1[0].toString()]
                "
              >
                {{
                  filterLevelPrice(
                    item[1],
                    currentPool[2].pairInfo.pairUnitSize,
                    tokens[currentPool[2].pairInfo.token0[0].toString()]
                      .decimals,
                    tokens[currentPool[2].pairInfo.token1[0].toString()]
                      .decimals,
                    'ask'
                  )
                }}
              </span>
            </td>
            <td>
              <span
                v-if="
                  tokens &&
                  currentPool &&
                  currentPool[2] &&
                  tokens[currentPool[2].pairInfo.token0[0].toString()]
                "
              >
                {{
                  filterQuantity(
                    item[2],
                    tokens[currentPool[2].pairInfo.token0[0].toString()]
                      .decimals,
                    tokens[currentPool[2].pairInfo.token0[0].toString()]
                      .decimals
                  )
                }}
              </span>
            </td>
          </tr>
          <tr v-for="(item, index) in proPendingOrders.buy" :key="index">
            <td>
              <copy-account
                v-if="currentPool && currentPool[2] && item[0] && item[0][0]"
                :front="10"
                :is-copy="false"
                :href="`https://ic.house/swap/${currentPool[2].pairInfo.pairPrincipal.toString()}/${filterTxid(
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
                  tokens &&
                  currentPool &&
                  currentPool[2] &&
                  tokens[currentPool[2].pairInfo.token0[0].toString()] &&
                  tokens[currentPool[2].pairInfo.token1[0].toString()]
                "
              >
                {{
                  filterLevelPrice(
                    item[1],
                    currentPool[2].pairInfo.pairUnitSize,
                    tokens[currentPool[2].pairInfo.token0[0].toString()]
                      .decimals,
                    tokens[currentPool[2].pairInfo.token1[0].toString()]
                      .decimals,
                    'bid'
                  )
                }}
              </span>
            </td>
            <td>
              <span
                v-if="
                  tokens &&
                  currentPool &&
                  currentPool[2] &&
                  tokens[currentPool[2].pairInfo.token0[0].toString()]
                "
              >
                {{
                  filterQuantity(
                    item[2],
                    tokens[currentPool[2].pairInfo.token0[0].toString()]
                      .decimals,
                    tokens[currentPool[2].pairInfo.token0[0].toString()]
                      .decimals
                  )
                }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </a-modal>
    <a-modal
      v-model="historyVisible"
      width="100%"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="delete-modal"
    >
      <a-spin :spinning="historySpinning">
        <table class="ant-table-tbody mt20">
          <thead>
            <tr>
              <th>Time</th>
              <th>Txid</th>
              <th>Side</th>
              <th>Order</th>
              <th>Filled</th>
              <th>Avg.Price</th>
              <!--<th>Fee</th>-->
              <th>Status</th>
            </tr>
          </thead>
          <tbody class="font12">
            <tr
              v-for="(item, index) in poolRecord.slice(
                (currentHistoryPage - 1) * 10,
                currentHistoryPage * 10
              )"
              :key="index"
            >
              <td>
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
              <td>
                <copy-account
                  v-if="currentPool && currentPool[2]"
                  :front="10"
                  :is-copy="false"
                  :href="`https://ic.house/swap/${currentPool[2].pairInfo.pairPrincipal.toString()}/${filterTxid(
                    item.txid
                  )}`"
                  :account="filterTxid(item.txid)"
                  copyText="Txid"
                ></copy-account>
              </td>
              <td
                :class="{
                  'ask-price': getTradeSide(item.filled.token0Value) === 'Sell',
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
                          currentPool &&
                          currentPool[2] &&
                          tokens &&
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                        "
                      >
                        {{
                          Object.values(item.order.token0Value[0])[0]
                            | bigintToFloat(
                              Math.min(
                                tokens[
                                  currentPool[2].pairInfo.token0[0].toString()
                                ].decimals,
                                8
                              ),
                              tokens[
                                currentPool[2].pairInfo.token0[0].toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                            .symbol
                        }}
                      </span>
                      <span
                        v-if="
                          tokens &&
                          currentPool &&
                          currentPool[2] &&
                          tokens[
                            currentPool[2].pairInfo.token1[0].toString()
                          ] &&
                          Object.keys(item.order.token1Value[0])[0] ===
                            'DebitRecord'
                        "
                      >
                        {{
                          Object.values(item.order.token1Value[0])[0]
                            | bigintToFloat(
                              Math.min(
                                tokens[
                                  currentPool[2].pairInfo.token1[0].toString()
                                ].decimals,
                                8
                              ),
                              tokens[
                                currentPool[2].pairInfo.token1[0].toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[currentPool[2].pairInfo.token1[0].toString()]
                            .symbol
                        }}
                      </span>
                      ->
                      <span
                        v-if="
                          Object.keys(item.order.token0Value[0])[0] ===
                            'CreditRecord' &&
                          currentPool &&
                          currentPool[2] &&
                          tokens &&
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                        "
                      >
                        {{
                          Object.values(item.order.token0Value[0])[0]
                            | bigintToFloat(
                              Math.min(
                                tokens[
                                  currentPool[2].pairInfo.token0[0].toString()
                                ].decimals,
                                8
                              ),
                              tokens[
                                currentPool[2].pairInfo.token0[0].toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                            .symbol
                        }}
                      </span>
                      <span
                        v-if="
                          tokens &&
                          currentPool &&
                          currentPool[2] &&
                          tokens[
                            currentPool[2].pairInfo.token1[0].toString()
                          ] &&
                          Object.keys(item.order.token1Value[0])[0] ===
                            'CreditRecord'
                        "
                      >
                        {{
                          Object.values(item.order.token1Value[0])[0]
                            | bigintToFloat(
                              Math.min(
                                tokens[
                                  currentPool[2].pairInfo.token1[0].toString()
                                ].decimals,
                                8
                              ),
                              tokens[
                                currentPool[2].pairInfo.token1[0].toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[currentPool[2].pairInfo.token1[0].toString()]
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
                        currentPool &&
                        currentPool[2] &&
                        tokens &&
                        tokens[currentPool[2].pairInfo.token0[0].toString()]
                      "
                    >
                      <a
                        :href="
                          currentPool[2].pairInfo.token0[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPool[2].pairInfo.token0[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(item.order.token0Value[0])[0]
                            | bigintToFloat(
                              4,
                              tokens[
                                currentPool[2].pairInfo.token0[0].toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                            .symbol
                        }}
                      </a>
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPool &&
                        currentPool[2] &&
                        tokens[currentPool[2].pairInfo.token1[0].toString()] &&
                        item.order.token1Value[0] &&
                        Object.keys(item.order.token1Value[0])[0] ===
                          'DebitRecord'
                      "
                    >
                      <a
                        :href="
                          currentPool[2].pairInfo.token1[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPool[2].pairInfo.token1[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(item.order.token1Value[0])[0]
                            | bigintToFloat(
                              4,
                              tokens[
                                currentPool[2].pairInfo.token1[0].toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[currentPool[2].pairInfo.token1[0].toString()]
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
                        currentPool &&
                        currentPool[2] &&
                        tokens &&
                        tokens[currentPool[2].pairInfo.token0[0].toString()]
                      "
                    >
                      <a
                        :href="
                          currentPool[2].pairInfo.token0[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPool[2].pairInfo.token0[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(item.order.token0Value[0])[0]
                            | bigintToFloat(
                              4,
                              tokens[
                                currentPool[2].pairInfo.token0[0].toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                            .symbol
                        }}
                      </a>
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPool &&
                        currentPool[2] &&
                        tokens[currentPool[2].pairInfo.token1[0].toString()] &&
                        item.order.token1Value[0] &&
                        Object.keys(item.order.token1Value[0])[0] ===
                          'CreditRecord'
                      "
                    >
                      <a
                        :href="
                          currentPool[2].pairInfo.token1[0].toString() ===
                          'ryjl3-tyaaa-aaaaa-aaaba-cai'
                            ? `https://ic.house/ICP/address/${getPrincipalId}`
                            : `https://ic.house/address/${currentPool[2].pairInfo.token1[0].toString()}/${getPrincipalId}`
                        "
                        target="_blank"
                        class="token-id-rocks"
                        rel="nofollow noreferrer noopener"
                      >
                        {{
                          Object.values(item.order.token1Value[0])[0]
                            | bigintToFloat(
                              4,
                              tokens[
                                currentPool[2].pairInfo.token1[0].toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[currentPool[2].pairInfo.token1[0].toString()]
                            .symbol
                        }}
                      </a>
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPool &&
                        currentPool[2] &&
                        tokens[currentPool[2].pairInfo.token1[0].toString()] &&
                        Object.keys(item.orderType[0])[0] === 'MKT' &&
                        item.order.token0Value[0]
                      "
                    >
                      ?(market)
                      {{
                        tokens[currentPool[2].pairInfo.token1[0].toString()]
                          .symbol
                      }}
                    </span>
                    <span
                      v-if="
                        tokens &&
                        currentPool &&
                        currentPool[2] &&
                        tokens[currentPool[2].pairInfo.token0[0].toString()] &&
                        Object.keys(item.orderType[0])[0] === 'MKT' &&
                        item.order.token1Value[0]
                      "
                    >
                      ?(market)
                      {{
                        tokens[currentPool[2].pairInfo.token0[0].toString()]
                          .symbol
                      }}
                    </span>
                    <span v-if="Object.keys(item.orderType[0])[0] !== 'MKT'"
                      >(price:{{
                        getOrderPrice(
                          item,
                          tokens[currentPool[2].pairInfo.token1[0].toString()]
                            .decimals
                        )
                      }})</span
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
                              item.details[item.details.length - 1].token0Value
                            )[0] === 'DebitRecord' &&
                            tokens &&
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                          "
                        >
                          {{
                            Object.values(
                              item.details[item.details.length - 1].token0Value
                            )[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[
                                    currentPool[2].pairInfo.token0[0].toString()
                                  ].decimals,
                                  8
                                ),
                                tokens[
                                  currentPool[2].pairInfo.token0[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPool &&
                            currentPool[2] &&
                            tokens[
                              currentPool[2].pairInfo.token1[0].toString()
                            ] &&
                            Object.keys(
                              item.details[item.details.length - 1].token1Value
                            )[0] === 'DebitRecord'
                          "
                        >
                          {{
                            Object.values(
                              item.details[item.details.length - 1].token1Value
                            )[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[
                                    currentPool[2].pairInfo.token1[0].toString()
                                  ].decimals,
                                  8
                                ),
                                tokens[
                                  currentPool[2].pairInfo.token1[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token1[0].toString()]
                              .symbol
                          }}
                        </span>
                        ->
                        <span
                          v-if="
                            Object.keys(
                              item.details[item.details.length - 1].token0Value
                            )[0] === 'CreditRecord' &&
                            tokens &&
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                          "
                        >
                          {{
                            Object.values(
                              item.details[item.details.length - 1].token0Value
                            )[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[
                                    currentPool[2].pairInfo.token0[0].toString()
                                  ].decimals,
                                  8
                                ),
                                tokens[
                                  currentPool[2].pairInfo.token0[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPool &&
                            currentPool[2] &&
                            tokens[
                              currentPool[2].pairInfo.token1[0].toString()
                            ] &&
                            Object.keys(
                              item.details[item.details.length - 1].token1Value
                            )[0] === 'CreditRecord'
                          "
                        >
                          {{
                            Object.values(
                              item.details[item.details.length - 1].token1Value
                            )[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[
                                    currentPool[2].pairInfo.token1[0].toString()
                                  ].decimals,
                                  8
                                ),
                                tokens[
                                  currentPool[2].pairInfo.token1[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token1[0].toString()]
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
                            currentPool &&
                            currentPool[2] &&
                            tokens &&
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                          "
                        >
                          {{
                            Object.values(item.filled.token0Value)[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[
                                    currentPool[2].pairInfo.token0[0].toString()
                                  ].decimals,
                                  8
                                ),
                                tokens[
                                  currentPool[2].pairInfo.token0[0].toString()
                                ].decimals
                              )
                          }}&nbsp;{{
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span
                          v-if="
                            Object.keys(item.filled.token1Value)[0] ===
                              'DebitRecord' &&
                            currentPool &&
                            currentPool[2] &&
                            tokens &&
                            tokens[currentPool[2].pairInfo.token1[0].toString()]
                          "
                        >
                          {{
                            Object.values(item.filled.token1Value)[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[
                                    currentPool[2].pairInfo.token1[0].toString()
                                  ].decimals,
                                  8
                                ),
                                tokens[
                                  currentPool[2].pairInfo.token1[0].toString()
                                ].decimals
                              )
                          }}&nbsp;{{
                            tokens[currentPool[2].pairInfo.token1[0].toString()]
                              .symbol
                          }}
                        </span>
                        ->
                        <span
                          v-if="
                            Object.keys(item.filled.token0Value)[0] ===
                              'CreditRecord' &&
                            tokens &&
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                          "
                        >
                          {{
                            Object.values(item.filled.token0Value)[0]
                              | bigintToFloat(
                                Math.min(
                                  tokens[
                                    currentPool[2].pairInfo.token0[0].toString()
                                  ].decimals,
                                  8
                                ),
                                tokens[
                                  currentPool[2].pairInfo.token0[0].toString()
                                ].decimals
                              )
                          }}&nbsp;{{
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                              .symbol
                          }}
                        </span>
                        <span
                          v-if="
                            tokens &&
                            currentPool &&
                            currentPool[2] &&
                            tokens[
                              currentPool[2].pairInfo.token1[0].toString()
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
                                    currentPool[2].pairInfo.token1[0].toString()
                                  ].decimals,
                                  8
                                ),
                                tokens[
                                  currentPool[2].pairInfo.token1[0].toString()
                                ].decimals
                              )
                          }}&nbsp;{{
                            tokens[currentPool[2].pairInfo.token1[0].toString()]
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
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                        "
                      >
                        <a
                          :href="
                            currentPool[2].pairInfo.token0[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPool[2].pairInfo.token0[0].toString()}/${getPrincipalId}`
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
                                tokens[
                                  currentPool[2].pairInfo.token0[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                              .symbol
                          }}
                        </a>
                      </span>
                      <span
                        v-if="
                          tokens &&
                          currentPool &&
                          currentPool[2] &&
                          tokens[
                            currentPool[2].pairInfo.token1[0].toString()
                          ] &&
                          Object.keys(
                            item.details[item.details.length - 1].token1Value
                          )[0] === 'DebitRecord'
                        "
                      >
                        <a
                          :href="
                            currentPool[2].pairInfo.token1[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPool[2].pairInfo.token1[0].toString()}/${getPrincipalId}`
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
                                tokens[
                                  currentPool[2].pairInfo.token1[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token1[0].toString()]
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
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                        "
                      >
                        <a
                          :href="
                            currentPool[2].pairInfo.token0[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPool[2].pairInfo.token0[0].toString()}/${getPrincipalId}`
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
                                tokens[
                                  currentPool[2].pairInfo.token0[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                              .symbol
                          }}
                        </a>
                      </span>
                      <span
                        v-if="
                          tokens &&
                          currentPool &&
                          currentPool[2] &&
                          tokens[
                            currentPool[2].pairInfo.token1[0].toString()
                          ] &&
                          Object.keys(
                            item.details[item.details.length - 1].token1Value
                          )[0] === 'CreditRecord'
                        "
                      >
                        <a
                          :href="
                            currentPool[2].pairInfo.token1[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPool[2].pairInfo.token1[0].toString()}/${getPrincipalId}`
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
                                tokens[
                                  currentPool[2].pairInfo.token1[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token1[0].toString()]
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
                          currentPool &&
                          currentPool[2] &&
                          tokens &&
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                        "
                      >
                        <a
                          :href="
                            currentPool[2].pairInfo.token0[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPool[2].pairInfo.token0[0].toString()}/${getPrincipalId}`
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
                                  currentPool[2].pairInfo.token0[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                              .symbol
                          }}
                        </a>
                      </span>
                      <span
                        v-if="
                          tokens &&
                          currentPool &&
                          currentPool[2] &&
                          tokens[
                            currentPool[2].pairInfo.token1[0].toString()
                          ] &&
                          Object.keys(item.filled.token1Value)[0] ===
                            'DebitRecord'
                        "
                      >
                        <a
                          :href="
                            currentPool[2].pairInfo.token1[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPool[2].pairInfo.token1[0].toString()}/${getPrincipalId}`
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
                                  currentPool[2].pairInfo.token1[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token1[0].toString()]
                              .symbol
                          }}
                        </a>
                      </span>
                      ->
                      <span
                        v-if="
                          Object.keys(item.filled.token0Value)[0] ===
                            'CreditRecord' &&
                          currentPool &&
                          currentPool[2] &&
                          tokens &&
                          tokens[currentPool[2].pairInfo.token0[0].toString()]
                        "
                      >
                        <a
                          :href="
                            currentPool[2].pairInfo.token0[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPool[2].pairInfo.token0[0].toString()}/${getPrincipalId}`
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
                                  currentPool[2].pairInfo.token0[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token0[0].toString()]
                              .symbol
                          }}
                        </a>
                      </span>
                      <span
                        v-if="
                          tokens &&
                          currentPool &&
                          currentPool[2] &&
                          tokens[
                            currentPool[2].pairInfo.token1[0].toString()
                          ] &&
                          Object.keys(item.filled.token1Value)[0] ===
                            'CreditRecord'
                        "
                      >
                        <a
                          :href="
                            currentPool[2].pairInfo.token1[0].toString() ===
                            'ryjl3-tyaaa-aaaaa-aaaba-cai'
                              ? `https://ic.house/ICP/address/${getPrincipalId}`
                              : `https://ic.house/address/${currentPool[2].pairInfo.token1[0].toString()}/${getPrincipalId}`
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
                                  currentPool[2].pairInfo.token1[0].toString()
                                ].decimals
                              )
                          }}
                          {{
                            tokens[currentPool[2].pairInfo.token1[0].toString()]
                              .symbol
                          }}
                        </a>
                      </span>
                    </div>
                  </a-tooltip>
                </div>
              </td>
              <td>
                <div v-if="Object.keys(item.status)[0] === 'Cancelled'">-</div>
                <div v-else>{{ getAvgPrice(item) }}</div>
              </td>
              <!--<td>
                <span
                  v-if="
                    currentPool &&
                    currentPool[2] &&
                    tokens &&
                    tokens[currentPool[2].pairInfo.token0[0].toString()]
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
              </td>-->
              <td>
                <span
                  class="history-status"
                  :class="Object.keys(item.status)[0]"
                  >{{ Object.keys(item.status)[0] }}</span
                >
              </td>
            </tr>
            <tr v-show="!historySpinning && !poolRecord.length">
              <td colspan="7" class="text-center">No Activities</td>
            </tr>
          </tbody>
        </table>
        <div class="nft-main-pagination mt20 flex-center">
          <a-pagination
            class="pagination"
            v-show="poolRecord.length > 10"
            :current="currentHistoryPage"
            :defaultPageSize="10"
            :total="poolRecord.length"
            @change="changeHistory"
          />
        </div>
      </a-spin>
    </a-modal>
    <a-modal
      v-model="eventVisible"
      width="100%"
      title="Pool Events"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="delete-modal"
    >
      <a-spin :spinning="eventSpinning">
        <table class="ant-table-tbody mt20">
          <thead>
            <tr>
              <th>Index</th>
              <th>Time</th>
              <th>Type</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in events" :key="index">
              <td>{{ item[0].toString(10) }}</td>
              <td style="white-space: nowrap">
                {{ item[1][1] | formatDateFromSecondUTC }}
              </td>
              <td>{{ Object.keys(item[1][0])[0] }}</td>
              <td>
                <div style="word-break: break-all; white-space: normal">
                  {{ Object.values(item[1][0])[0] | filterJson }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="nft-main-pagination mt20 flex-center">
          <a-pagination
            class="pagination"
            v-show="eventsTotal > 10"
            :current="currentEventPage"
            :defaultPageSize="10"
            :total="eventsTotal"
            @change="changeEvents"
          />
        </div>
      </a-spin>
    </a-modal>
    <nft-balance
      ref="nftBalance"
      :nft-balance="nftBalance"
      :nfts="nfts"
      :tokens="tokens"
      :pairs-maker="pairsMaker"
      :type="isBecomeMaker ? 'BecomeVipMaker' : 'CreateMaker'"
      @depositSuccess="depositSuccess"
      @bindSuccess="bindSuccess"
      @NFTWithdrawSuccess="NFTWithdrawSuccess"
    ></nft-balance>
    <launch :tokens="tokens" ref="launch"></launch>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Pool } from '@/views/home/ICDex/model';
import { AccountId, Time, TokenInfo, TokenStd } from '@/ic/common/icType';
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
import {
  principalToAccount,
  principalToAccountIdentifier,
  toHexString
} from '@/ic/converter';
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
import {
  BalanceChange,
  GridOrder,
  icpPrice,
  STOrder,
  STOrderPendingOrders,
  STStrategy,
  tokenAmount,
  TradingOrder,
  TxnRecord
} from '@/ic/ICDex/model';
import { PoolEvent } from '@/ic/makerPool/model';
import Launch from '@/views/home/ICDex/components/Launch.vue';
const commonModule = namespace('common');
const canMakerCreateNft = ['NEPTUNE', 'URANUS', 'SATURN'];
const vipMakerNFT = ['NEPTUNE'];

let loading;

@Component({
  name: 'Pools',
  components: { NftBalance, AccountInfo, Launch },
  filters: {
    filterPpm(val: bigint): string {
      return (
        new BigNumber(val.toString(10))
          .times(100)
          .div(10 ** 6)
          .toString(10) + '%'
      );
    },
    filterBuyFee(val: string): string {
      if (val || Number(val) === 0) {
        return (
          new BigNumber(val).times(100).decimalPlaces(2).toString(10) + '%'
        );
      }
      return '';
    },
    filterJson(val): string {
      return JSON.stringify(val, (key, value) =>
        value instanceof Array && value.length >= 16 // todo 16
          ? toHexString(new Uint8Array(value))
          : typeof value === 'bigint'
          ? value.toString()
          : value && value._isPrincipal
          ? value.toString()
          : value
      );
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
      value: 'Pools',
      path: '/ICDex/pools'
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
  private poolsPri: Array<Pool> = [];
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
  private timer: { [key: number]: number } = {};
  private pairPools = '';
  private poolsMenu = [
    {
      name: 'Public Pools',
      value: 'public'
    },
    {
      name: 'Private Pools',
      value: 'private'
    }
  ];
  private currentPoolsMenu = 'public';
  private gridVisible = false;
  private poolGridTitle = 'Grid Orders';
  private poolGrids: Array<STOrder> = [];
  private currentPool: Pool = null;
  private gridSpinning = false;
  private proPendingOrdersModel = false;
  private proPendingOrders: STOrderPendingOrders = {
    buy: [],
    sell: []
  };
  private poolRecord: Array<TxnRecord> = [];
  private currentHistoryPage = 1;
  private historyVisible = false;
  private historySpinning = false;
  private events: Array<[bigint, [PoolEvent, Time]]> = [];
  private eventVisible = false;
  private eventSpinning = false;
  private eventsTotal = 0;
  private currentEventPage = 1;
  activated(): void {
    const poolId = this.$route.query.id;
    if (
      this.$route.query &&
      Object.keys(this.$route.query).includes('private')
    ) {
      this.currentPoolsMenu = 'private';
    } else {
      this.currentPoolsMenu = 'public';
    }
    let flag = false;
    if (poolId && (this.poolsLoad.length || this.poolsPri.length)) {
      if (!this.getPrincipalId) {
        return;
      }
      for (let i = 0; i < this.poolsLoad.length; i++) {
        if (this.poolsLoad[i][1][0][0].toString() === poolId) {
          flag = true;
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
                    !item[2].initialized ||
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
      for (let i = 0; i < this.poolsPri.length; i++) {
        if (this.poolsPri[i][1][0][0].toString() === poolId) {
          flag = true;
          this.makerPoolService.stats2(poolId).then((res) => {
            this.$set(this.poolsPri[i], 3, res);
          });
          this.makerPoolService
            .getAccountShares(poolId, this.getPrincipalId)
            .then((res) => {
              this.$set(this.poolsPri[i], 4, res);
            });
          break;
        }
      }
      if (!flag) {
        this.initPools();
      }
    } else {
      this.initPools();
    }
  }
  private initPools(): void {
    if (this.$route.query.pair) {
      this.pairPools = this.$route.query.pair as string;
    } else {
      this.pairPools = '';
    }
    this.pools = [];
    this.poolsHold = [];
    this.poolsLoad = [];
    this.poolsPri = [];
    this.getPairs();
    this.getPools([], 1);
    this.getTokensExt();
    this.NFTBalance();
  }
  created(): void {
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.makerPoolService = new makerPoolService();
    this.ICDexRouterService = new ICDexRouterService();
    this.NftService = new NftService();
    this.ICDexService = new ICDexService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.clearTimeout();
    if (this.$route.query.pair) {
      this.pairPools = this.$route.query.pair as string;
    } else {
      this.pairPools = '';
    }
  }
  deactivated(): void {
    console.log('deactivated');
    // this.clearTimeout();
  }
  beforeDestroy(): void {
    console.log('beforeDestroy');
    this.clearTimeout();
  }
  private clearTimeout(): void {
    for (let i in this.timer) {
      console.log(this.timer, i);
      window.clearTimeout(this.timer[Number(i)]);
      this.timer[i] = null;
    }
  }
  private changeMenu(value: string): void {
    this.currentPoolsMenu = value;
  }
  private changeEvents(page): void {
    this.currentEventPage = page;
    this.getEvents(this.currentPool[1][0][0].toString());
  }
  private changeHistory(page): void {
    this.currentHistoryPage = page;
  }
  private async getTradeList(swapId: string, account: string): Promise<void> {
    this.poolRecord = [];
    let res;
    try {
      res = await this.ICDexService.drc205Events(swapId, [account]);
    } catch (e) {
      const now = new Date().getTime();
      const start = new BigNumber(now)
        .minus(30 * 24 * 60 * 60 * 1000)
        .times(10 ** 6)
        .toString(10);
      res = await this.ICDexService.drc205_events_filter(
        swapId,
        [account],
        [BigInt(start)],
        []
      );
    }
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
      this.poolRecord = removeDuplicateObj(res.records).slice(0, 100);
    }
  }
  private async showEvents(currentPool: Pool): Promise<void> {
    this.eventVisible = true;
    this.currentPool = currentPool;
    this.eventsTotal = 0;
    this.currentEventPage = 1;
    await this.getEvents(currentPool[1][0][0].toString());
  }
  private async getEvents(pool: string): Promise<void> {
    console.log(pool, this.currentEventPage);
    this.eventSpinning = true;
    const res = await this.makerPoolService.get_events(
      pool,
      [BigInt(this.currentEventPage)],
      [BigInt(10)]
    );
    console.log(res);
    if (res && res.data) {
      this.events = res.data;
      if (!this.eventsTotal) {
        this.eventsTotal = Number(res.total);
      }
    }
    this.eventSpinning = false;
  }
  private async showHistory(currentPool: Pool): Promise<void> {
    this.historyVisible = true;
    this.historySpinning = true;
    this.currentPool = currentPool;
    this.currentHistoryPage = 1;
    await this.getTradeList(
      currentPool[2].pairInfo.pairPrincipal.toString(),
      currentPool[1][0][0].toString()
    );
    console.log(this.poolRecord);
    this.historySpinning = false;
  }
  private async showGrid(
    currentPool: Pool,
    pair: string,
    item: Array<Array<bigint>>
  ): Promise<void> {
    console.log(item);
    this.currentPool = currentPool;
    this.poolGrids = [];
    this.gridVisible = true;
    this.gridSpinning = true;
    const promiseValue = [];
    item.forEach((grid) => {
      if (grid[0] || grid[0] === BigInt(0)) {
        promiseValue.push(this.getProOrder(pair, grid[0]));
      }
    });
    this.poolGrids = await Promise.all(promiseValue);
    this.poolGrids.forEach((item) => {
      const level1Filled = (item.strategy as { GridOrder: GridOrder }).GridOrder
        .level1Filled;
      if (item.pendingOrders.buy.length) {
        item.pendingOrders.buy = item.pendingOrders.buy.sort((a, b) => {
          if (new BigNumber(b[1].toString(10)).lt(a[1].toString(10))) {
            return -1;
          } else {
            return 1;
          }
        });
        if (
          item.pendingOrders.buy[0][0].length &&
          level1Filled &&
          level1Filled.length &&
          level1Filled[0].buy1
        ) {
          this.ICDexService.statusByTxid(
            this.currentPool[2].pairInfo.pairPrincipal.toString(),
            item.pendingOrders.buy[0][0][0]
          ).then((res) => {
            if (res && res.orderStatusResponse) {
              const pending = (
                res.orderStatusResponse as { Pending: TradingOrder }
              ).Pending;
              item.pendingOrders.buy[0][2] = (
                pending.remaining.quantity as {
                  Buy: [tokenAmount, icpPrice];
                }
              ).Buy[0];
            }
          });
        }
      }
      if (item.pendingOrders.sell.length) {
        item.pendingOrders.sell.sort((a, b) => {
          if (new BigNumber(b[1].toString(10)).lt(a[1].toString(10))) {
            return -1;
          } else {
            return 1;
          }
        });
        if (
          item.pendingOrders.sell[item.pendingOrders.sell.length - 1][0]
            .length &&
          level1Filled &&
          level1Filled.length &&
          level1Filled[0].sell1
        ) {
          this.ICDexService.statusByTxid(
            this.currentPool[2].pairInfo.pairPrincipal.toString(),
            item.pendingOrders.sell[item.pendingOrders.sell.length - 1][0][0]
          ).then((res) => {
            if (res && res.orderStatusResponse) {
              const pending = (
                res.orderStatusResponse as { Pending: TradingOrder }
              ).Pending;
              item.pendingOrders.sell[item.pendingOrders.sell.length - 1][2] = (
                pending.remaining.quantity as {
                  Sell: bigint;
                }
              ).Sell;
            }
          });
        }
      }
    });
    this.gridSpinning = false;
    console.log(this.poolGrids);
  }
  private async getProOrder(pair: string, id: bigint): Promise<STOrder> {
    const res = await this.ICDexService.sto_getStratOrder(pair, id);
    if (res && res.length) {
      return res[0];
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
        .decimalPlaces(tokenAmountUnit)
        .toString(10);
    }
    return '';
  }
  private filterLevelPrice(
    price: bigint,
    unitSize: bigint,
    token0Decimals: number,
    token1Decimals: number,
    type?: string
  ): string {
    if (price && price.toString()) {
      const levelPrice = new BigNumber(price.toString(10))
        .div(10 ** token1Decimals)
        .div(new BigNumber(unitSize.toString(10)).div(10 ** token0Decimals));
      if (type === 'ask') {
        // ROUND_CEIL
        return levelPrice.decimalPlaces(8, 2).toString(10);
      } else if (type === 'bid') {
        // ROUND_FLOOR
        return levelPrice.decimalPlaces(8, 3).toString(10);
      } else {
        return levelPrice.decimalPlaces(8).toString(10);
      }
    }
    return '';
  }
  private showPendingOrders(
    value: STOrderPendingOrders,
    strategy: STStrategy
  ): void {
    if (!value.buy.length && !value.sell.length) {
      return;
    }
    this.proPendingOrders = value;
    this.proPendingOrdersModel = true;
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
      if (res) {
        const tokensExt = (
          res as {
            ok: TokensExt;
          }
        ).ok;
        console.log(tokensExt);
        this.nfts = tokensExt;
      }
    } catch (e) {
      console.error(e);
    }
  }
  private async NFTBalance(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (!principal) {
      return;
    }
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
    let pair = [];
    if (this.pairPools) {
      pair = [Principal.fromText(this.pairPools)];
    }
    const res = await this.ICDexRouterService.maker_getPublicMakers(
      pair,
      [BigInt(page)],
      [BigInt(100)]
    );
    console.log(res);
    if (res && res.data && res.data.length) {
      pools = pools.concat(res.data);
    } else {
      res.total = BigInt(0);
    }
    if (pools.length < Number(res.total)) {
      await this.getPools(pools, ++page);
    } else {
      let privatePools = [];
      if (this.getPrincipalId) {
        const accountId = principalToAccount(
          Principal.fromText(this.getPrincipalId)
        );
        const privateMakers =
          await this.ICDexRouterService.maker_getPrivateMakers(
            accountId,
            [],
            []
          );
        console.log(privateMakers);
        if (privateMakers && privateMakers.data && privateMakers.data.length) {
          privatePools = privateMakers.data;
        }
      }
      console.log(privatePools);
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
      privatePools.forEach((pool) => {
        pool[1].forEach((item) => {
          canisterIds.unshift(pool[0].toString());
          canisterIds.unshift(item[0].toString());
          this.poolsPri.unshift([pool[0], [item]]);
        });
      });
      this.needConnect([...new Set(canisterIds)]);
    }
  }
  private async needConnect(canisterIds: Array<string>): Promise<void> {
    console.log(canisterIds);
    const flag = needConnectPlug(canisterIds);
    const principal = localStorage.getItem('principal');
    // if (!principal) {
    //   return;
    // }
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
    this.clearTimeout();
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
        (!item[3] || !item[2].initialized || (item[3] && item[3].poolShares))
      ) {
        if (item[4] && item[4][0]) {
          this.poolsHold.push(item);
        } else {
          this.pools.push(item);
        }
      }
    });
    console.log(this.poolsLoad);
    promiseAll = [];
    for (let i = 0; i < this.poolsPri.length; i++) {
      for (let j = 0; j < this.poolsPri[i][1].length; j++) {
        const pool = this.poolsPri[i][1][j][0].toString();
        const pair = this.poolsPri[i][0].toString();
        promiseAll.push(
          this.getPoolInfo(pool, i, false),
          this.poolStats(pool, i, false),
          this.getAccountShares(pool, i, false),
          this.getRole(pair, pool, i, false)
        );
        if (promiseAll.length === MAX_COCURRENCY) {
          await Promise.all(promiseAll);
          promiseAll = [];
        }
        console.log(i, promiseAll);
      }
      if (i === this.poolsPri.length - 1 && promiseAll.length) {
        await Promise.all(promiseAll);
      }
    }
    this.poolsPri.forEach((item) => {
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
    });
  }
  private async getPoolInfo(
    pool: string,
    i: number,
    isPublic = true
  ): Promise<void> {
    const res = await this.makerPoolService.info(pool);
    if (res) {
      if (isPublic) {
        this.$set(this.poolsLoad[i], 2, res);
      } else {
        this.$set(this.poolsPri[i], 2, res);
      }
    }
  }
  private async poolStats(
    pair: string,
    i: number,
    isPublic = true
  ): Promise<void> {
    const res = await this.makerPoolService.stats2(pair);
    if (res) {
      if (isPublic) {
        this.$set(this.poolsLoad[i], 3, res);
      } else {
        this.$set(this.poolsPri[i], 3, res);
      }
    } else {
      this.timer[i] = window.setTimeout(() => {
        this.poolStats(pair, i, isPublic);
      }, 5 * 1000);
    }
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
  private async getRole(
    pair: string,
    pool: string,
    i: number,
    isPublic = true
  ): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICDexService.getRole(pair, pool);
      if (res && res.dexRole) {
        if (isPublic) {
          this.$set(this.poolsLoad[i], 5, res.dexRole);
        } else {
          this.$set(this.poolsPri[i], 5, res.dexRole);
        }
      }
    }
  }
  private async getAccountShares(
    pair: string,
    i: number,
    isPublic = true
  ): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.makerPoolService.getAccountShares(
        pair,
        this.getPrincipalId
      );
      if (res) {
        if (isPublic) {
          this.$set(this.poolsLoad[i], 4, res);
        } else {
          this.$set(this.poolsPri[i], 4, res);
        }
      }
    }
  }
  private backAll(): void {
    this.$router.replace('/ICDex/pools');
    this.pairPools = '';
    this.pools = [];
    this.poolsHold = [];
    this.poolsLoad = [];
    this.poolsPri = [];
    this.getPools([], 1);
  }
  private onCreatePool(): void {
    this.isBecomeMaker = false;
    let isPublic = true;
    if (this.currentPoolsMenu === 'private') {
      isPublic = false;
    }
    (this.$refs.nftBalance as any).isPublic = isPublic;
    (this.$refs.nftBalance as any).init();
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
    let isPublic = true;
    if (this.currentPoolsMenu === 'private') {
      isPublic = false;
    }
    (this.$refs.nftBalance as any).bindMMPoolInit(pair, pool, isPublic);
  }
  private NFTWithdrawSuccess(): void {
    this.getTokensExt();
    this.NFTBalance();
  }
  private async bindSuccess(pair: string, pool: string): Promise<void> {
    const res = await this.ICDexService.getRole(pair, pool);
    if (res && res.dexRole) {
      if (this.currentPoolsMenu === 'public') {
        if (this.isBecomeMakerHold) {
          this.$set(this.poolsHold[this.becomeMakerIndex], 5, res.dexRole);
        } else {
          this.$set(this.pools[this.becomeMakerIndex], 5, res.dexRole);
        }
      } else {
        this.$set(this.poolsPri[this.becomeMakerIndex], 5, res.dexRole);
      }
    }
  }
  private jumpPool(item: Array<[Principal, AccountId]>, isPublic = true): void {
    if (isPublic) {
      this.$router.push(`/ICDex/pools/pool/${item[0][0].toString()}`);
    } else {
      this.$router.push(`/ICDex/pools/pool/${item[0][0].toString()}?private`);
    }
  }
  private jump(path: string): void {
    this.$router.push(path);
  }
  private filterTxid(txid: Array<number>): string {
    return toHexString(new Uint8Array(txid));
  }
  private getTradeSide(token0value: BalanceChange): string {
    if (Object.keys(token0value)[0] === 'DebitRecord') {
      return 'Sell';
    } else if (Object.keys(token0value)[0] === 'CreditRecord') {
      return 'Buy';
    }
  }
  private getAvgPrice(txnRecord: TxnRecord): string {
    if (this.tokens && this.currentPool && this.currentPool[2]) {
      const token0 = this.currentPool[2].pairInfo.token0[0].toString();
      const token1 = this.currentPool[2].pairInfo.token1[0].toString();
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
            .decimalPlaces(8)
            .toString(10);
        } else {
          return '-';
        }
      }
    }
    return '';
  }
  private getOrderPrice(txnRecord: TxnRecord, buyUnit: number): string {
    if (
      this.tokens &&
      this.currentPool &&
      this.currentPool[2] &&
      txnRecord.order.token0Value[0] &&
      txnRecord.order.token1Value[0]
    ) {
      const token0 = this.currentPool[2].pairInfo.token0[0].toString();
      const token1 = this.currentPool[2].pairInfo.token1[0].toString();
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
            .decimalPlaces(8)
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
      this.tokens[this.currentPool[2].pairInfo.token0[0].toString()].decimals;
    const token1Decimals =
      this.tokens[this.currentPool[2].pairInfo.token1[0].toString()].decimals;
    const token0Symbol =
      this.tokens[this.currentPool[2].pairInfo.token0[0].toString()].symbol;
    const token1Symbol =
      this.tokens[this.currentPool[2].pairInfo.token1[0].toString()].symbol;
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
  private showLaunch(): void {
    (this.$refs.launch as any).init();
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
    position: relative;
    width: 490px;
    line-height: 1.8;
    padding: 16px 16px 76px 16px;
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
    button {
      width: 100px;
    }
  }
  .pool-bottom {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
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
.text-center {
  text-align: center;
  font-size: 14px;
}
.vip-maker-pool {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: #21c77d;
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
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      color: #adb3c4;
      border: 1px solid #727a87;
    }
    img {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      object-fit: contain;
      vertical-align: top;
    }
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
  color: #fff;
}
.pools-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 320px;
  margin: 40px auto;
  background: #232730;
  border-radius: 30px;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 40px;
    font-size: 16px;
    color: #51b7c3;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 25px;
    &.active {
      background: #51b7c3;
      border-color: #51b7c3;
      color: #ffffff;
    }
  }
}
.ask-price {
  color: #d13651;
}

.bid-price {
  color: #21c77d;
}
.font12 {
  font-size: 12px;
}
.ant-table-tbody tr:hover td {
  &.ask-price {
    color: #d13651 !important;
  }

  &.bid-price {
    color: #21c77d !important;
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
.pagination {
  justify-content: flex-end;
}
@media screen and (max-width: 768px) {
  .pools-menu {
    width: calc(100% - 20px);
    margin: 20px auto 40px;
    padding: 0 5px;
  }
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
      button {
        width: 80px;
      }
    }
  }
}
</style>
