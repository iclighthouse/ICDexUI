<template>
  <div>
    <div class="pool-info container-width">
      <div class="proposal-main-title">
        <a-icon class="back-arrow" type="arrow-left" @click="back" />
      </div>
      <div class="pool-item">
        <div class="pool-header">
          <span class="pc-show">Name:&nbsp;</span
          ><span v-if="pool[1]" class="base-color-w pc-show">
            {{ pool[1].name }}
          </span>
          <router-link
            v-if="
              pool[1] &&
              tokens[pool[1].pairInfo.token0[0].toString()] &&
              tokens[pool[1].pairInfo.token1[0].toString()]
            "
            :to="`/ICDex/${
              tokens[pool[1].pairInfo.token0[0].toString()].symbol
            }/${tokens[pool[1].pairInfo.token1[0].toString()].symbol}`"
            style="margin-left: 10px"
            class="pc-show link"
          >
            {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}/{{
              tokens[pool[1].pairInfo.token1[0].toString()].symbol
            }}
          </router-link>
          <span
            v-if="getPrincipalId"
            class="margin-left-auto pointer main-color"
            style="margin-right: 10px"
            @click="onGetEvents"
            >Activities</span
          >
          <button
            v-if="getPrincipalId"
            type="button"
            :class="{ primary: type === 'Add' }"
            @click="changeType('Add')"
          >
            Add
          </button>
          <button
            v-if="getPrincipalId"
            type="button"
            style="margin-left: 10px"
            :class="{ primary: type === 'Remove' }"
            @click="changeType('Remove')"
          >
            Remove
          </button>
        </div>
        <div class="pool-item-l h5-show">
          <div class="pool-item-l-net">
            <span>Name:&nbsp;</span
            ><span v-if="pool[1]" class="base-color-w">
              {{ pool[1].name }}
            </span>
            <router-link
              v-if="
                pool[1] &&
                tokens[pool[1].pairInfo.token0[0].toString()] &&
                tokens[pool[1].pairInfo.token1[0].toString()]
              "
              :to="`/ICDex/${
                tokens[pool[1].pairInfo.token0[0].toString()].symbol
              }/${tokens[pool[1].pairInfo.token1[0].toString()].symbol}`"
              class="link"
            >
              {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}/{{
                tokens[pool[1].pairInfo.token1[0].toString()].symbol
              }}
            </router-link>
          </div>
        </div>
        <div class="pool-item-l">
          <div
            class="pool-item-l-net"
            v-if="
              pool[1] &&
              tokens[pool[1].pairInfo.token0[0].toString()] &&
              tokens[pool[1].pairInfo.token1[0].toString()]
            "
          >
            <span>NAV:</span>
            <span v-if="pool[2]" class="base-color-w">
              <span v-if="pool[1].initialized && !pool[2].poolShares">0</span>
              <span v-else>
                {{
                  pool[2].latestUnitNetValue.token0 |
                    bigintToFloat(
                      tokens[pool[1].pairInfo.token0[0].toString()].decimals,
                      tokens[pool[1].pairInfo.token0[0].toString()].decimals
                    ) |
                    formatNum
                }}
              </span>
              <span class="font12">
                {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
              </span>
              +
              <span v-if="pool[1].initialized && !pool[2].poolShares">0</span>
              <span v-else>
                {{
                  pool[2].latestUnitNetValue.token1 |
                    bigintToFloat(
                      tokens[pool[1].pairInfo.token1[0].toString()].decimals,
                      tokens[pool[1].pairInfo.token1[0].toString()].decimals
                    ) |
                    formatNum
                }}
              </span>
              <span class="font12">
                {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
              </span>
            </span>
            <span class="loading-spinner" v-if="!pool[2] && isBusy"> </span>
            <span v-if="!pool[2] && !isBusy">-</span>
          </div>
        </div>
        <div class="pool-item-l">
          <div
            class="pool-item-l-net"
            v-if="
              pool[1] &&
              tokens[pool[1].pairInfo.token0[0].toString()] &&
              tokens[pool[1].pairInfo.token1[0].toString()]
            "
          >
            <span>
              Total Shares:
              <span v-if="pool[2] && pool[1]" class="base-color-w">
                {{
                  pool[2].poolShares |
                    bigintToFloat(
                      pool[1].shareDecimals,
                      pool[1].shareDecimals
                    ) |
                    formatNum
                }}
              </span>
              <span v-if="!pool[2] && isBusy" class="loading-spinner"> </span>
              <span v-if="!pool[2] && !isBusy">-</span>
            </span>
            <span v-if="pool[2]" style="margin-top: 5px">
              <span v-if="pool[1].initialized && !pool[2].poolShares"> 0 </span>
              <span v-else>
                {{
                  pool[2].poolBalance.balance0 |
                    bigintToFloat(
                      Math.min(
                        tokens[pool[1].pairInfo.token0[0].toString()].decimals,
                        8
                      ),
                      tokens[pool[1].pairInfo.token0[0].toString()].decimals
                    ) |
                    formatNum
                }}
              </span>
              <span class="font12">
                {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
              </span>
              +
              <span v-if="pool[1].initialized && !pool[2].poolShares"> 0 </span>
              <span v-else>
                {{
                  pool[2].poolBalance.balance1 |
                    bigintToFloat(
                      Math.min(
                        tokens[pool[1].pairInfo.token1[0].toString()].decimals,
                        8
                      ),
                      tokens[pool[1].pairInfo.token1[0].toString()].decimals
                    ) |
                    formatNum
                }}
              </span>
              <span class="font12">
                {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
              </span>
            </span>
          </div>
        </div>
        <div class="pool-item-l">
          <div
            class="pool-item-l-net"
            v-if="
              getPrincipalId &&
              pool[1] &&
              tokens[pool[1].pairInfo.token0[0].toString()] &&
              tokens[pool[1].pairInfo.token1[0].toString()]
            "
          >
            <span
              >Your Shares:
              <span v-if="pool[3] && pool[1]" class="base-color-w">
                {{
                  pool[3][0] |
                    bigintToFloat(
                      pool[1].shareDecimals,
                      pool[1].shareDecimals
                    ) |
                    formatNum
                }}
              </span>
              <span
                v-if="!pool[3] && !pool[1] && isBusy"
                class="loading-spinner"
              >
              </span>
              <span v-if="!pool[3] && !pool[1] && !isBusy">-</span>
            </span>
            <span v-if="pool[2] && pool[3]" style="margin-top: 5px">
              <span v-if="pool[1].initialized && !pool[3][0]"> 0 </span>
              <span v-else>
                {{
                  pool[2].poolBalance.balance0 |
                    filterSharesBalance(pool[2].poolShares, pool[3][0]) |
                    bigintToFloat(
                      Math.min(
                        tokens[pool[1].pairInfo.token0[0].toString()].decimals,
                        8
                      ),
                      tokens[pool[1].pairInfo.token0[0].toString()].decimals
                    ) |
                    formatNum
                }}
              </span>
              <span class="font12">
                {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
              </span>
              +
              <span v-if="pool[1].initialized && !pool[3][0]"> 0 </span>
              <span v-else>
                {{
                  pool[2].poolBalance.balance1 |
                    filterSharesBalance(pool[2].poolShares, pool[3][0]) |
                    bigintToFloat(
                      Math.min(
                        tokens[pool[1].pairInfo.token1[0].toString()].decimals,
                        8
                      ),
                      tokens[pool[1].pairInfo.token1[0].toString()].decimals
                    ) |
                    formatNum
                }}
              </span>
              <span class="font12">
                {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
              </span>
            </span>
          </div>
        </div>
        <div class="pool-apy">
          <span>APY (Estimated):&nbsp;&nbsp;</span>
          <span class="pool-apy-item base-font-title">
            <span v-if="pool[2] && pool[2].apy24h.apy && pool[2].apy7d.apy">
              {{ pool[2].apy24h.apy[0] | filterAPY }} (24H APY),
              {{ pool[2].apy7d.apy[0] | filterAPY }} (7D APY)
            </span>
            <span v-if="!pool[2] && !pool[1] && isBusy" class="loading-spinner">
            </span>
            <span v-if="!pool[2] && !pool[1] && !isBusy">-</span>
          </span>
        </div>
        <div
          v-if="
            showCapThreshold(pool) &&
            pool[1] &&
            tokens[pool[1].pairInfo.token1[0].toString()]
          "
          style="margin-top: 10px"
        >
          <span>Threshold: </span>
          <span v-if="pool[1]">
            <a-tooltip placement="top">
              <template slot="title">
                After the
                {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                balance of total liquidity reaches threshold, the liquidity
                limit rule will be activated and the user's liquidity limit
                (measured in
                {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}) =
                the user's
                {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                volume in the current pair *
                {{ pool[1].volFactor.toString(10) }}.
              </template>
              {{
                pool[1].poolThreshold |
                  bigintToFloat(
                    tokens[pool[1].pairInfo.token1[0].toString()].decimals,
                    tokens[pool[1].pairInfo.token1[0].toString()].decimals
                  ) |
                  formatNum
              }}
              {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
            </a-tooltip>
          </span>
          <span v-if="!pool[1] && isBusy" class="loading-spinner"></span>
        </div>
        <div
          v-if="
            !showCapThreshold(pool) &&
            pool[1] &&
            pool[2] &&
            pool[3] &&
            tokens[pool[1].pairInfo.token1[0].toString()] &&
            pairVol &&
            volUsed
          "
          style="margin-top: 10px"
        >
          <span>
            Your liquidity limit: total {{ getAvailable(pool) | formatNum }}
            {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }};
            available
            <span class="base-green">
              {{
                getVolAvailable(pool, volUsed) |
                  bigintToFloat(
                    8,
                    tokens[pool[1].pairInfo.token1[0].toString()].decimals
                  ) |
                  formatNum
              }}
            </span>
            {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}</span
          >
          <span v-if="!pool[1] && isBusy" class="loading-spinner"></span>
        </div>
        <div
          v-if="makerConfigure && makerConfigure.controllers"
          style="
            display: flex;
            align-items: flex-start;
            margin-top: 10px;
            font-size: 12px;
          "
        >
          <span>Controllers:&nbsp;</span>
          <div>
            <span
              v-for="(item, index) in makerConfigure.controllers"
              :key="index"
            >
              {{ item
              }}<span v-if="index !== makerConfigure.controllers.length"
                >;</span
              >
            </span>
          </div>
        </div>
        <div
          v-if="makerConfigure && makerConfigure.ICTCAdmins"
          style="
            display: flex;
            align-items: flex-start;
            margin-top: 10px;
            font-size: 12px;
          "
        >
          <span>ICTC Admins:&nbsp;</span>
          <div>
            <span
              v-for="(item, index) in makerConfigure.ICTCAdmins"
              :key="index"
            >
              {{ item.toString()
              }}<span v-if="index !== makerConfigure.ICTCAdmins.length">;</span>
            </span>
          </div>
          <span v-if="!makerConfigure.ICTCAdmins.length">-</span>
        </div>
        <div style="margin-top: 10px; font-size: 12px">
          <span>Canister id: </span>
          <span v-if="pool[0]">{{ pool[0] }}</span>
        </div>
        <div style="margin-top: 10px; font-size: 12px">
          <span>Creator: </span>
          <span style="word-break: break-all" v-if="pool[1]">{{
            arrayToString(pool[1].creator)
          }}</span>
        </div>
        <div style="margin-top: 10px; font-size: 12px">
          <span>Module Hash: </span>
          <span
            style="word-break: break-all"
            v-if="makerConfigure && makerConfigure.moduleHash"
            >{{ makerConfigure.moduleHash }}</span
          >
        </div>
        <div style="margin-top: 10px; font-size: 12px">
          <span>Version: </span>
          <span v-if="pool[1]">{{ pool[1].version }}</span>
        </div>
        <div
          v-if="
            pool[4] &&
            !pool[4].vipMaker &&
            pool[1] &&
            pool[1].initialized &&
            poolICLBalance
          "
          style="margin-top: 10px"
        >
          <span>
            ICL Balance:
            <span :class="{ 'base-red': Number(poolICLBalance) < 100 }">
              {{ poolICLBalance }}
              ICL
              <a-tooltip placement="top">
                <template slot="title">
                  <span v-if="stoConfig">
                    Update grid order fee is
                    {{ stoConfig.poFee1 | stoUpdateFee(8) }}
                    ICL.
                  </span>
                  <div v-if="getPrincipalId && pool && pool[1]">
                    This ICDexMaker should be granted vip-maker status or this
                    canister ({{ pool[0] }}) needs a sufficient(100) ICL balance
                    for grid order fees.
                  </div>
                </template>
                <a-icon
                  v-if="stoConfig && Number(poolICLBalance) < 100"
                  type="info-circle"
                />
              </a-tooltip>
              <button
                style="
                  display: inline-block;
                  width: 70px;
                  height: 28px;
                  margin-left: 10px;
                "
                v-if="
                  stoConfig &&
                  Number(poolICLBalance) < 100 &&
                  getPrincipalId &&
                  pool &&
                  pool[1]
                "
                class="primary"
                @click="onTopUp"
              >
                Top up
              </button>
            </span>
          </span>
        </div>
      </div>
      <div v-show="type === 'Remove'">
        <div
          v-show="
            pool[1] &&
            (pool[1].initialized ||
              (!pool[1].initialized && pool[4] && pool[4].vipMaker) ||
              (!pool[1].initialized &&
                pool[4] &&
                !pool[4].vipMaker &&
                Number(poolICLBalance) >= 10))
          "
        >
          <div class="pool-item mt20">
            <div class="exchange-swap-item-top">
              <div>Burn Shares</div>
              <a-input
                v-if="pool[1]"
                class="margin-left-auto text-right"
                :disabled="!pool[3]"
                v-model="removeShares"
                autocomplete="off"
                v-only-float="pool[1].shareDecimals"
                :key="pool[1].shareDecimals"
                min="0"
                placeholder="0"
                type="text"
                @input="sharesChange"
              />
            </div>
            <div class="exchange-swap-item-bottom">
              <span
                class="margin-left-auto exchange-swap-item-bottom-fee-share"
                @click="setMaxShares"
                >Max</span
              >
            </div>
          </div>
          <div class="exchange-swap-icon">
            <a-icon type="arrow-down" class="exchange-swap-icon-plus" />
          </div>
          <div class="pool-item">
            <div class="swap-item-top">
              <div class="ic-swap-item-top-left">
                <div class="swap-item-top-left">
                  <span class="img-content">
                    <img
                      v-if="
                        pool[1] && tokens[pool[1].pairInfo.token0[0].toString()]
                      "
                      :src="tokens[pool[1].pairInfo.token0[0].toString()].logo"
                      alt=""
                    />
                    <span v-else class="empty-pic"></span>
                  </span>
                  <span class="swap-item-top-left-name" v-if="pool[1]">
                    {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                  </span>
                </div>
              </div>
              <div
                v-if="pool[1] && tokens[pool[1].pairInfo.token0[0].toString()]"
                class="swap-item-top-right-remove"
              >
                <span>
                  <span class="base-color-w">{{ sharesValue0 }}</span>
                  {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                </span>
              </div>
            </div>
            <div class="swap-item-top" style="margin-top: 5px">
              <div
                v-if="pool[1] && tokens[pool[1].pairInfo.token1[0].toString()]"
                class="swap-item-top-right-remove"
              >
                <span class="base-font"
                  >Withdrawal fee:
                  <span class="base-font-title">{{ sharesFee0 }}</span>
                  {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                </span>
              </div>
            </div>
          </div>
          <div class="exchange-swap-icon">
            <a-icon type="plus" class="exchange-swap-icon-plus" />
          </div>
          <div class="pool-item">
            <div class="swap-item-top">
              <div class="ic-swap-item-top-left">
                <div class="swap-item-top-left">
                  <span class="img-content">
                    <img
                      v-if="
                        pool[1] && tokens[pool[1].pairInfo.token1[0].toString()]
                      "
                      :src="tokens[pool[1].pairInfo.token1[0].toString()].logo"
                      alt=""
                    />
                    <span v-else class="empty-pic"></span>
                  </span>
                  <span class="swap-item-top-left-name" v-if="pool[1]">
                    {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                  </span>
                </div>
              </div>
              <div
                v-if="pool[1] && tokens[pool[1].pairInfo.token1[0].toString()]"
                class="swap-item-top-right-remove"
              >
                <span>
                  <span class="base-color-w">{{ sharesValue1 }}</span>
                  {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                </span>
              </div>
            </div>
            <div class="swap-item-top" style="margin-top: 5px">
              <div
                v-if="pool[1] && tokens[pool[1].pairInfo.token1[0].toString()]"
                class="swap-item-top-right-remove"
              >
                <span class="base-font"
                  >Withdrawal fee:
                  <span class="base-font-title">{{ sharesFee1 }}</span>
                  {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                </span>
              </div>
            </div>
          </div>
          <div class="swap-button w100">
            <button
              v-if="getPrincipalId"
              :disabled="buttonDisabledRemove"
              class="primary large-primary w100"
              @click="onRemove"
            >
              {{ buttonNameRemove }}
            </button>
            <button
              v-else
              class="primary large-primary w100"
              @click="connectWallet"
            >
              Connect Wallet
            </button>
          </div>
        </div>
        <div
          v-show="
            pool[4] &&
            !pool[4].vipMaker &&
            pool[1] &&
            !pool[1].initialized &&
            Number(poolICLBalance) < 10
          "
          class="base-font-title pool-item mt20"
          style="line-height: 1.5; font-size: 16px"
        >
          <span v-if="stoConfig">
            Grid order fee: (Create)
            {{ stoConfig.poFee1 | bigintToFloat(8, 8) }} ICL, (Update)
            {{ stoConfig.poFee1 | stoUpdateFee(8) }} ICL.
          </span>
          <div>
            <span
              @click.stop="
                onBindMaker(pool[1].pairInfo.pairPrincipal.toString(), pool[0])
              "
              class="link pointer"
              >Become vip-maker(free)</span
            >
            or
            <span class="link pointer" @click="onTopUp"
              >top up at least 100 ICL</span
            >.
          </div>
        </div>
      </div>
      <div v-show="type === 'Add'">
        <div
          v-show="
            pool[1] &&
            (pool[1].initialized ||
              (!pool[1].initialized && pool[4] && pool[4].vipMaker) ||
              (!pool[1].initialized &&
                pool[4] &&
                !pool[4].vipMaker &&
                Number(poolICLBalance) >= 10))
          "
        >
          <div class="pool-item-title">Deposit amounts</div>
          <div class="pool-item">
            <div class="swap-item-top">
              <div class="ic-swap-item-top-left">
                <div class="swap-item-top-left">
                  <span class="img-content">
                    <img
                      v-if="
                        pool[1] && tokens[pool[1].pairInfo.token0[0].toString()]
                      "
                      :src="tokens[pool[1].pairInfo.token0[0].toString()].logo"
                      alt=""
                    />
                    <span v-else class="empty-pic"></span>
                  </span>
                  <span class="swap-item-top-left-name" v-if="pool[1]">
                    {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                  </span>
                </div>
              </div>
              <div class="swap-item-top-right">
                <a-input-group
                  class="swap-item-group"
                  compact
                  v-if="
                    pool[1] && tokens[pool[1].pairInfo.token0[0].toString()]
                  "
                >
                  <a-input
                    :key="
                      tokens[pool[1].pairInfo.token0[0].toString()].decimals
                    "
                    class="input-icp-suffix text-right"
                    autocomplete="off"
                    type="text"
                    v-model="token0Amount"
                    v-only-float="
                      tokens[pool[1].pairInfo.token0[0].toString()].decimals
                    "
                    placeholder="0.0"
                    @input="token0AmountChange"
                  /><span class="suffix">{{
                    tokens[pool[1].pairInfo.token0[0].toString()].symbol
                  }}</span>
                </a-input-group>
                <a-input
                  v-else
                  class="input-icp-suffix text-right"
                  autocomplete="off"
                  type="text"
                  disabled
                  placeholder="0.0"
                />
                <div
                  class="text-right"
                  v-if="buttonDisabled && addToken0Info && addToken1Info"
                >
                  <span class="base-red">
                    {{ addToken0Info }}
                  </span>
                </div>
              </div>
            </div>
            <div class="add-liquidity-item-bottom swap-item-bottom">
              <div
                v-if="
                  pool[1] &&
                  tokens &&
                  tokens[pool[1].pairInfo.token0[0].toString()]
                "
              >
                Balance:
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <span>{{
                      tokensBalance[pool[1].pairInfo.token0[0].toString()] |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token0[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token0[0].toString()].decimals
                        ) |
                        formatNum
                    }}</span>
                  </template>
                  {{
                    tokensBalance[pool[1].pairInfo.token0[0].toString()] |
                      bigintToFloat(
                        8,
                        tokens[pool[1].pairInfo.token0[0].toString()].decimals
                      ) |
                      formatAmount(8)
                  }}
                </a-tooltip>
                {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
              </div>
              <div class="margin-left-auto">
                <span
                  class="max-amount"
                  @click="
                    setMaxAmount(
                      pool[1].pairInfo.token0[0].toString(),
                      'token0'
                    )
                  "
                  >Max</span
                >
              </div>
            </div>
          </div>
          <div class="exchange-swap-icon">
            <a-icon class="swap-icon" type="plus" />
          </div>
          <div class="pool-item">
            <div class="swap-item-top">
              <div class="ic-swap-item-top-left">
                <div class="swap-item-top-left">
                  <span class="img-content">
                    <img
                      v-if="
                        pool[1] && tokens[pool[1].pairInfo.token1[0].toString()]
                      "
                      :src="tokens[pool[1].pairInfo.token1[0].toString()].logo"
                      alt=""
                    />
                    <span v-else class="empty-pic"></span>
                  </span>
                  <span class="swap-item-top-left-name" v-if="pool[1]">
                    {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                  </span>
                </div>
              </div>
              <div class="swap-item-top-right">
                <a-input-group
                  class="swap-item-group"
                  compact
                  v-if="
                    pool[1] && tokens[pool[1].pairInfo.token1[0].toString()]
                  "
                >
                  <span
                    v-show="token0Amount"
                    class="prefix"
                    style="padding-left: 5px"
                  >
                    ≈
                  </span>
                  <a-input
                    :key="
                      tokens[pool[1].pairInfo.token1[0].toString()].decimals
                    "
                    class="input-icp-suffix text-right"
                    autocomplete="off"
                    type="text"
                    v-model="token1Amount"
                    v-only-float="
                      tokens[pool[1].pairInfo.token1[0].toString()].decimals
                    "
                    placeholder="0.0"
                    @input="token1AmountChange"
                  /><span class="suffix">{{
                    tokens[pool[1].pairInfo.token1[0].toString()].symbol
                  }}</span>
                </a-input-group>
                <a-input
                  v-else
                  class="input-icp-suffix text-right"
                  autocomplete="off"
                  type="text"
                  disabled
                  placeholder="0.0"
                />
                <div
                  class="text-right"
                  v-if="buttonDisabled && addToken0Info && addToken1Info"
                >
                  <span class="base-red">
                    {{ addToken1Info }}
                  </span>
                </div>
              </div>
            </div>
            <div class="add-liquidity-item-bottom swap-item-bottom">
              <div
                v-if="
                  pool[1] &&
                  tokens &&
                  tokens[pool[1].pairInfo.token1[0].toString()]
                "
              >
                Balance:
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <span>{{
                      tokensBalance[pool[1].pairInfo.token1[0].toString()] |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token1[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token1[0].toString()].decimals
                        ) |
                        formatNum
                    }}</span>
                  </template>
                  {{
                    tokensBalance[pool[1].pairInfo.token1[0].toString()] |
                      bigintToFloat(
                        8,
                        tokens[pool[1].pairInfo.token1[0].toString()].decimals
                      ) |
                      formatAmount(8)
                  }}
                </a-tooltip>
                {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
              </div>
              <div class="margin-left-auto">
                <span
                  class="max-amount"
                  @click="
                    setMaxAmount(
                      pool[1].pairInfo.token1[0].toString(),
                      'token1'
                    )
                  "
                  >Max</span
                >
              </div>
            </div>
          </div>
          <div v-show="pool[2] && pool[2].poolShares">
            <div class="exchange-swap-icon add-liquidity-icon">
              <a-icon class="swap-icon" type="arrow-down" />
            </div>
            <div class="pool-item exchange-swap-item exchange-swap-item-shares">
              <div class="exchange-swap-item-top">
                <div>You will get</div>
                <div class="you-get-shares">
                  &nbsp;<span class="base-color-w">{{
                    shares | bigintToFloat(4, 0) | formatNum
                  }}</span
                  >&nbsp;
                </div>
                <div>Shares</div>
              </div>
            </div>
          </div>
          <div class="swap-button w100">
            <button
              v-if="getPrincipalId"
              class="primary large-primary w100"
              :disabled="buttonDisabled"
              @click="onAdd"
            >
              <span>{{ buttonName }}</span>
            </button>
            <div
              v-if="getPrincipalId && canFallback"
              class="pointer base-font-title text-center"
              style="margin: 15px 0"
              @click="fallback"
            >
              Fallback
            </div>
            <button
              v-if="!getPrincipalId"
              class="primary large-primary w100"
              @click="connectWallet"
            >
              Connect Wallet
            </button>
          </div>
        </div>
        <div
          class="base-font-title pool-item mt20"
          style="line-height: 1.5; font-size: 16px"
          v-show="
            pool[4] &&
            !pool[4].vipMaker &&
            pool[1] &&
            !pool[1].initialized &&
            Number(poolICLBalance) < 10
          "
        >
          <span v-if="stoConfig">
            Grid order fee: (Create)
            {{ stoConfig.poFee1 | bigintToFloat(8, 8) }} ICL, (Update)
            {{ stoConfig.poFee1 | stoUpdateFee(8) }} ICL.
          </span>
          <div>
            <span
              class="link pointer"
              @click.stop="
                onBindMaker(pool[1].pairInfo.pairPrincipal.toString(), pool[0])
              "
              >Become vip-maker(free)</span
            >
            or
            <span class="link pointer" @click="onTopUp"
              >top up at least 100 ICL</span
            >.
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model="eventVisible"
      width="90%"
      title="Activities"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="delete-modal"
    >
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
          <tr
            v-for="(item, index) in events.slice(
              (currentEventPage - 1) * 100,
              currentEventPage * 100
            )"
            :key="index"
          >
            <td>{{ (currentEventPage - 1) * 100 + index + 1 }}</td>
            <td style="white-space: nowrap">
              {{ item[1] | formatDateFromSecondUTC }}
            </td>
            <td>{{ Object.keys(item[0])[0] }}</td>
            <td>
              <div
                v-if="
                  pool &&
                  pool[1] &&
                  tokens &&
                  tokens[pool[1].pairInfo.token0[0].toString()] &&
                  tokens[pool[1].pairInfo.token1[0].toString()]
                "
              >
                <div v-if="Object.keys(item[0])[0] === 'add'">
                  <div v-if="Object.keys(item[0].add)[0] === 'ok'">
                    {{
                      item[0].add.ok.token0 |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token0[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token0[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                    +
                    {{
                      item[0].add.ok.token1 |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token1[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token1[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                    ->
                    {{
                      item[0].add.ok.shares |
                        bigintToFloat(
                          pool[1].shareDecimals,
                          pool[1].shareDecimals
                        ) |
                        formatNum
                    }}
                    Shares
                  </div>
                  <div
                    class="base-red"
                    v-if="Object.keys(item[0].add)[0] === 'err'"
                  >
                    Error:
                    {{
                      item[0].add.err.depositToken0 |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token0[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token0[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                    +
                    {{
                      item[0].add.err.depositToken1 |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token1[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token1[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                  </div>
                </div>
                <div v-if="Object.keys(item[0])[0] === 'remove'">
                  <div v-if="Object.keys(item[0].remove)[0] === 'ok'">
                    {{
                      item[0].remove.ok.shares |
                        bigintToFloat(
                          pool[1].shareDecimals,
                          pool[1].shareDecimals
                        ) |
                        formatNum
                    }}
                    Shares ->
                    {{
                      item[0].remove.ok.token0 |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token0[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token0[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                    +
                    {{
                      item[0].remove.ok.token1 |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token1[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token1[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                  </div>
                  <div
                    class="base-red"
                    v-if="Object.keys(item[0].remove)[0] === 'err'"
                  >
                    Error:
                    {{
                      item[0].remove.err.addPoolToken0 |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token0[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token0[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                    +
                    {{
                      item[0].remove.err.addPoolToken1 |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token1[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token1[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                  </div>
                </div>
                <div v-if="Object.keys(item[0])[0] === 'withdraw'">
                  {{
                    item[0].withdraw.token0 |
                      bigintToFloat(
                        tokens[pool[1].pairInfo.token0[0].toString()].decimals,
                        tokens[pool[1].pairInfo.token0[0].toString()].decimals
                      )
                  }}
                  {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                  +
                  {{
                    item[0].withdraw.token1 |
                      bigintToFloat(
                        tokens[pool[1].pairInfo.token1[0].toString()].decimals,
                        tokens[pool[1].pairInfo.token1[0].toString()].decimals
                      )
                  }}
                  {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                </div>
                <div v-if="Object.keys(item[0])[0] === 'fallback'">
                  {{
                    item[0].fallback.token0 |
                      bigintToFloat(
                        tokens[pool[1].pairInfo.token0[0].toString()].decimals,
                        tokens[pool[1].pairInfo.token0[0].toString()].decimals
                      )
                  }}
                  {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                  +
                  {{
                    item[0].fallback.token1 |
                      bigintToFloat(
                        tokens[pool[1].pairInfo.token1[0].toString()].decimals,
                        tokens[pool[1].pairInfo.token1[0].toString()].decimals
                      )
                  }}
                  {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                </div>
                <div v-if="Object.keys(item[0])[0] === 'deposit'">
                  <span v-show="item[0].deposit.token0">
                    {{
                      item[0].deposit.token0 |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token0[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token0[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                  </span>
                  <span
                    v-show="item[0].deposit.token0 && item[0].deposit.token1"
                    >+</span
                  >
                  <span v-show="item[0].deposit.token1">
                    {{
                      item[0].deposit.token1 |
                        bigintToFloat(
                          tokens[pool[1].pairInfo.token1[0].toString()]
                            .decimals,
                          tokens[pool[1].pairInfo.token1[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="nft-main-pagination mt20 flex-center">
        <a-pagination
          class="pagination"
          v-show="events.length > 100"
          :current="currentEventPage"
          :defaultPageSize="100"
          :total="events.length"
          @change="changeEvents"
        />
      </div>
    </a-modal>
    <transfer-token
      ref="transferToken"
      :current-token="currentToken"
      @transferTokenSuccess="transferTokenSuccess"
    ></transfer-token>
    <nft-balance
      ref="nftBalance"
      :nft-balance="nftBalance"
      :nfts="nfts"
      :tokens="tokens"
      :pairs-maker="pairsMaker"
      type="BecomeVipMaker"
      @depositSuccess="depositSuccess"
      @bindSuccess="bindSuccess"
      @NFTWithdrawSuccess="NFTWithdrawSuccess"
    ></nft-balance>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Menu } from '@/components/menu/model';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { Icrc1Account, Time, TokenInfo, TokenStd } from '@/ic/common/icType';
import {
  MakerConfigure,
  PoolEvent,
  PoolInfo,
  PoolStats,
  ShareWeighted
} from '@/ic/makerPool/model';
import { makerPoolService } from '@/ic/makerPool/makerPoolService';
import { namespace } from 'vuex-class';
import BigNumber from 'bignumber.js';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { getDepositing, getTokenBalance } from '@/ic/getTokenBalance';
import { getFee } from '@/ic/getTokenFee';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { toHttpRejectError } from '@/ic/httpError';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import {
  hexToBytes,
  principalToAccountIdentifier,
  toHexString
} from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { DexRole, PairInfo, StoSetting } from '@/ic/ICDex/model';
import { getTokenLogo } from '@/ic/getTokenLogo';
import { ApproveArgs, ApproveError } from '@/ic/DRC20Token/model';
import {
  getSubAccountArray,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID
} from '@/ic/utils';
import TransferToken from '@/components/transferToken/Index.vue';
import { AddTokenItem, AddTokenItemClass } from '@/views/home/account/model';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { NFT } from '@/ic/ICDexRouter/model';
import NftBalance from '@/views/home/ICDex/components/NFTBalance.vue';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';
import { TokensExt } from '@/ic/nft/model';
import { NftService } from '@/ic/nft/Service';
import { PairTrie } from '@/ic/ICSwapRouter/model';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import Launch from '@/views/home/ICDex/components/Launch.vue';
import { readState } from '@/ic/readState';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import { DeployedSns } from '@/ic/SNSWasm/model';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { checkAuth } from '@/ic/CheckAuth';
import { isPlug } from '@/ic/isPlug';
import drc20TokenIDL from '@/ic/DRC20Token/DRC20Token.did';
import { isSigner } from '@/ic/isSigner';

const commonModule = namespace('common');

@Component({
  name: 'Pool',
  components: { AccountInfo, TransferToken, NftBalance, Launch },
  filters: {
    stoUpdateFee(poFee1: bigint, decimals: number): string {
      return new BigNumber(poFee1.toString(10))
        .times(0.05)
        .div(10 ** decimals)
        .toString(10);
    },
    filterAPY(val: string): string {
      if (val || Number(val) === 0) {
        return (
          new BigNumber(val).times(100).decimalPlaces(4).toString(10) + '%'
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
    },
    filterSharesBalance(
      totalBalance: bigint,
      totalShares: bigint,
      shares: bigint
    ): string {
      if (totalShares) {
        return new BigNumber(shares.toString(10))
          .times(totalBalance.toString(10))
          .div(totalShares.toString(10))
          .toString(10);
      }
      return '0';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @commonModule.Getter('getIdentity') getIdentity?:
    | Secp256k1KeyIdentity
    | Ed25519KeyIdentity;
  private makerPoolService: makerPoolService;
  private ICDexService: ICDexService;
  private tokens: { [key: string]: TokenInfo } = {};
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
  private pool: [
    string?,
    PoolInfo?,
    PoolStats?,
    [bigint, ShareWeighted]?,
    DexRole?
  ] = [];
  private token0Amount = '';
  private token1Amount = '';
  private pairVol = '';
  private volUsed = '';
  private pairInfo: PairInfo = null;
  private pairPrice = '';
  private tokensBalance: { [key: string]: string } = {};
  private shares = '';
  private buttonName = 'Add';
  private buttonNameRemove = 'Remove';
  private addToken0Info = '';
  private addToken1Info = '';
  private removeShares = '';
  private sharesValue0 = '0';
  private sharesValue1 = '0';
  private sharesFee0 = '0';
  private sharesFee1 = '0';
  private token0fee = '';
  private token1fee = '';
  private depositAccount: [Icrc1Account, string] = null;
  private depositAccountBalance: { [key: string]: string } = {};
  private ledgerService: LedgerService | undefined = null;
  private timer = null;
  private type: 'Add' | 'Remove' = 'Add';
  private poolICLBalance = '';
  private ICLBalance = '';
  private stoConfig: StoSetting = null;
  private currentToken: AddTokenItem = new AddTokenItemClass();
  private isBusy = false;
  private nfts: TokensExt = [];
  private nftBalance: Array<NFT> = [];
  private pairsMaker: Array<PairTrie> = [];
  private isPublic = true;
  private NftService: NftService = null;
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService = null;
  private ICDexRouterService: ICDexRouterService = null;
  private makerConfigure: MakerConfigure = {};
  private SNSWasmService: SNSWasmService = null;
  private listDeployedSnses: Array<DeployedSns> = [];
  private eventVisible = false;
  private currentEventPage = 1;
  private events: Array<[PoolEvent, Time]> = [];
  private plugBatch = true;

  get buttonDisabledRemove(): boolean {
    let flag = false;
    if (this.pool[1] && this.pool[1].sysTransactionLock) {
      flag = true;
      this.buttonNameRemove = 'Waiting for transactions to complete.';
    } else if (
      this.pool[1] &&
      this.pool[1].sysGlobalLock &&
      this.pool[1].sysGlobalLock.length &&
      this.pool[1].sysGlobalLock[0]
    ) {
      flag = true;
      this.buttonNameRemove = 'Liquidity is being added or removed';
    } else if (this.pool[1] && this.pool[1].paused) {
      flag = true;
      this.buttonNameRemove = 'Paused';
    } else if (this.pairInfo && this.pairInfo.paused) {
      flag = true;
      this.buttonName = 'Paused';
    } else if (this.pool[3] && this.pool[1]) {
      const token1Id = this.pool[1].pairInfo.token1[0].toString();
      if (this.tokens[token1Id]) {
        if (
          !this.removeShares ||
          Number(this.removeShares) === 0 ||
          new BigNumber(this.sharesValue0).lte(0) ||
          new BigNumber(this.sharesValue1).lte(0)
        ) {
          this.buttonNameRemove = 'Unavailable shares value';
          flag = true;
        } else if (
          new BigNumber(this.removeShares)
            .times(10 ** this.pool[1].shareDecimals)
            .gt(this.pool[3][0].toString(10))
        ) {
          this.buttonNameRemove = 'Insufficient Shares';
          flag = true;
        } else {
          // todo
          let minShares = '100';
          let maxCanShares = new BigNumber(this.pool[3][0].toString(10))
            .div(10 ** this.pool[1].shareDecimals)
            .toString(10);
          if (new BigNumber(maxCanShares).lt(minShares)) {
            minShares = maxCanShares;
          }
          if (new BigNumber(this.removeShares).lt(minShares)) {
            this.buttonNameRemove = `The shares entered must not be less than ${minShares}.`;
            flag = true;
          } else {
            this.buttonNameRemove = 'Remove';
          }
        }
      } else {
        flag = true;
      }
    } else {
      flag = true;
    }
    return flag;
  }
  get buttonDisabled(): boolean {
    let flag = false;
    this.addToken0Info = '';
    this.addToken1Info = '';
    if (this.pool[1] && this.pool[1].sysTransactionLock) {
      flag = true;
      this.buttonName = 'Waiting for transactions to complete.';
    } else if (
      this.pool[1] &&
      this.pool[1].sysGlobalLock &&
      this.pool[1].sysGlobalLock.length &&
      this.pool[1].sysGlobalLock[0]
    ) {
      flag = true;
      this.buttonName = 'Liquidity is being added or removed';
    } else if (this.pool[1] && this.pool[1].paused) {
      flag = true;
      this.buttonName = 'Paused';
    } else if (this.pairInfo && this.pairInfo.paused) {
      flag = true;
      this.buttonName = 'Paused';
    } else if (this.pool[1]) {
      const token0Id = this.pool[1].pairInfo.token0[0].toString();
      const token1Id = this.pool[1].pairInfo.token1[0].toString();
      const token0Std = this.pool[1].pairInfo.token0[2];
      const token1Std = this.pool[1].pairInfo.token1[2];
      let token0Fee = this.token0fee;
      let token1Fee = this.token1fee;
      if (
        Object.keys(token0Std)[0] === 'drc20' ||
        Object.keys(token0Std)[0] === 'icrc2'
      ) {
        token0Fee = new BigNumber(token0Fee).plus(token0Fee).toString(10);
      }
      if (
        Object.keys(token1Std)[0] === 'drc20' ||
        Object.keys(token1Std)[0] === 'icrc2'
      ) {
        token1Fee = new BigNumber(token1Fee).plus(token1Fee).toString(10);
      }
      const creator = toHexString(new Uint8Array(this.pool[1].creator));
      let current = '';
      if (this.getPrincipalId) {
        current = principalToAccountIdentifier(
          Principal.fromText(this.getPrincipalId)
        );
      }
      if (!this.pool[1].initialized && creator !== current) {
        this.buttonName = 'Only creator can initialized.';
        flag = true;
      } else if (this.tokens[token0Id] && this.tokens[token1Id]) {
        if (!this.token1Amount) {
          this.buttonName = 'Please enter amount';
          flag = true;
        } else if (!this.token0Amount) {
          this.buttonName = 'Please enter amount';
          flag = true;
        } else {
          let minToken0 = new BigNumber(this.token0fee)
            .times(1000)
            .toString(10);
          let minToken1 = new BigNumber(this.token1fee)
            .times(1000)
            .toString(10);
          if (!this.pool[1].initialized) {
            minToken0 = new BigNumber(this.token0fee)
              .times(100000)
              .toString(10);
            minToken1 = new BigNumber(this.token1fee)
              .times(100000)
              .toString(10);
          }
          const available = this.getAvailable(this.pool);
          const utilized = new BigNumber(this.volUsed)
            .div(10 ** this.tokens[token1Id].decimals)
            .toString(10);
          const remaining = new BigNumber(available)
            .minus(utilized)
            .toString(10);
          if (
            new BigNumber(this.token0Amount).lt(minToken0) ||
            new BigNumber(this.token1Amount).lt(minToken1)
          ) {
            this.addToken0Info = `Min ${this.tokens[token0Id].symbol} amount is ${minToken0}`;
            this.addToken1Info = `Min ${this.tokens[token1Id].symbol} amount is ${minToken1}`;
            this.buttonName = 'Add';
            flag = true;
          } else if (
            new BigNumber(this.tokensBalance[token0Id])
              .div(10 ** this.tokens[token0Id].decimals)
              .minus(this.token0Amount)
              .minus(token0Fee)
              .lt(this.token0fee)
          ) {
            this.buttonName = `Insufficient ${this.tokens[token0Id].symbol} balance`;
            flag = true;
          } else if (
            !this.showCapThreshold(this.pool) &&
            new BigNumber(available).minus(utilized).lt(this.token1Amount)
          ) {
            this.buttonName = `Available: ${remaining} ${this.tokens[token1Id].symbol}`;
            flag = true;
          } else if (
            new BigNumber(this.tokensBalance[token1Id])
              .div(10 ** this.tokens[token1Id].decimals)
              .minus(this.token1Amount)
              .minus(token1Fee)
              .lt(this.token1fee)
          ) {
            this.buttonName = `Insufficient ${this.tokens[token1Id].symbol} balance`;
            flag = true;
          } else {
            this.buttonName = 'Add';
          }
        }
      } else {
        flag = true;
      }
    } else {
      flag = true;
    }
    return flag;
  }
  get canFallback(): boolean {
    let flag = false;
    if (this.pool[1] && this.token0fee && this.token1fee && this.tokens) {
      const token0 = this.pool[1].pairInfo.token0[0].toString();
      const token1 = this.pool[1].pairInfo.token1[0].toString();
      if (
        (this.tokens[token0] &&
          this.depositAccountBalance[token0] &&
          new BigNumber(this.depositAccountBalance[token0])
            .div(10 ** this.tokens[token0].decimals)
            .gt(this.token0fee)) ||
        (this.tokens[token1] &&
          this.depositAccountBalance[token1] &&
          new BigNumber(this.depositAccountBalance[token1])
            .div(10 ** this.tokens[token1].decimals)
            .gt(this.token1fee))
      ) {
        flag = true;
      }
    }
    return flag;
  }
  deactivated(): void {
    window.clearInterval(this.timer);
    this.timer = null;
    console.log(this.timer);
  }
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
    console.log(this.timer);
  }
  private async created(): Promise<void> {
    this.makerPoolService = new makerPoolService();
    this.ledgerService = new LedgerService();
    this.ICDexService = new ICDexService();
    this.ICDexRouterService = new ICDexRouterService();
    this.NftService = new NftService();
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.SNSWasmService = new SNSWasmService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    console.log(this.$route.query);
    if (this.$route.params.type) {
      this.type = this.$route.params.type as 'Add' | 'Remove';
    } else {
      this.type = 'Add';
    }
    if (this.$route.query) {
      if (Object.keys(this.$route.query).includes('private')) {
        this.isPublic = false;
      }
    }
    if (!this.listDeployedSnses.length) {
      this.listDeployedSnses = await this.SNSWasmService.listDeployedSnses();
    }
    if (this.getPrincipalId) {
      const currentInfo =
        JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
      this.tokensBalance = currentInfo.tokensBalance || {};
      await this.getDepositAccount();
      this.getUnitNetValues();
      this.getTokensExt();
      this.NFTBalance();
      this.getEvents(this.$route.params.poolId);
    }
    this.getPairs();
  }
  private onBindMaker(pair?: string, pool?: string): void {
    (this.$refs.nftBalance as any).bindMMPoolInit(pair, pool);
  }
  private async bindSuccess(pair: string, pool: string): Promise<void> {
    const res = await this.ICDexService.getRole(pair, pool);
    if (res && res.dexRole) {
      this.$set(this.pool, 4, res.dexRole);
    }
  }
  private depositSuccess(): void {
    this.getTokensExt();
    this.NFTBalance();
  }
  private NFTWithdrawSuccess(): void {
    this.getTokensExt();
    this.NFTBalance();
  }
  private async getPairs(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.getPairs2(['icdex']);
    console.log(res);
    if (res && res.data && res.data.length) {
      this.pairsMaker = res.data.sort((a, b) => {
        return a[1].pair.token0[1].localeCompare(b[1].pair.token0[1]);
      });
      this.connectPlug();
    } else {
      this.pairsMaker = [];
    }
  }
  private async connectPlug(): Promise<void> {
    const poolId = this.$route.params.poolId;
    let ids = [poolId];
    this.pairsMaker.forEach((pair) => {
      ids.push(pair[1].pair.canisterId.toString());
      ids.push(pair[1].pair.token0[0].toString());
      ids.push(pair[1].pair.token1[0].toString());
    });
    ids = [...new Set(ids)];
    console.log(ids);
    await checkAuth();
    const flag = needConnectPlug(ids);
    const connectInfinity = await needConnectInfinity(ids);
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (
      (priList[principal] === 'Plug' || priList[principal] === 'SignerPlug') &&
      flag
    ) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      this.$info({
        content: 'Pool need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(ids).then(async () => {
            if (poolId) {
              _that.$set(_that.pool, 0, poolId);
              _that.getPool(poolId);
            }
          });
        }
      });
    } else if (priList[principal] === 'Infinity' && connectInfinity) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      this.$info({
        content: 'Pool need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity(ids).then(async () => {
            if (poolId) {
              _that.$set(_that.pool, 0, poolId);
              _that.getPool(poolId);
            }
          });
        }
      });
    } else {
      if (poolId) {
        this.$set(this.pool, 0, poolId);
        this.getPool(poolId);
      }
    }
  }
  private onGetEvents(): void {
    this.eventVisible = true;
    // this.getEvents(this.$route.params.poolId);
  }
  private async getEvents(pool: string): Promise<void> {
    console.log(pool);
    const accountId = hexToBytes(
      principalToAccountIdentifier(Principal.fromText(this.getPrincipalId))
    );
    const res = await this.makerPoolService.get_account_events(pool, accountId);
    const accountTypes = ['fallback', 'add', 'remove'];
    this.events = res.filter((item) => {
      const type = Object.keys(item[0])[0];
      if (type === 'fallback') {
        if (!item[0]['fallback'].token0 && !item[0]['fallback'].token0) {
          return false;
        }
      }
      return accountTypes.includes(type);
    });
  }
  private async NFTBalance(): Promise<void> {
    this.nftBalance = await this.ICDexRouterService.NFTBalance(
      this.getPrincipalId
    );
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
      if (tokensExt && tokensExt.length) {
        this.nfts = tokensExt;
      } else {
        this.nfts = [];
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getRole(pair: string, pool: string): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICDexService.getRole(pair, pool);
      if (res && res.dexRole) {
        this.$set(this.pool, 4, res.dexRole);
      }
    }
  }
  private transferTokenSuccess(): void {
    const poolId = this.$route.params.poolId;
    this.getPoolICLBalance(poolId);
  }
  private onTopUp(): void {
    this.currentToken = {
      canisterId: Principal.fromText(IC_LIGHTHOUSE_TOKEN_CANISTER_ID),
      balance: this.ICLBalance,
      decimals: 8,
      name: '',
      symbol: 'ICL',
      logo: '',
      standard: 'ICRC-1',
      lockedTxns: {
        txns: [],
        lockedBalance: '0'
      },
      approvals: 0,
      transactions: '0',
      coinSeconds: null
    };
    (this.$refs.transferToken as any).transferForm.to =
      this.$route.params.poolId;
    (this.$refs.transferToken as any).init(this.currentToken);
  }
  private isCreator(account: Array<number>): boolean {
    return (
      principalToAccountIdentifier(Principal.fromText(this.getPrincipalId)) ===
      toHexString(new Uint8Array(account))
    );
  }
  private async getStoConfig(pair: string): Promise<void> {
    const res = await this.ICDexService.sto_getConfig(pair);
    this.stoConfig = res.stoSetting;
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private async getPoolICLBalance(poolId: string): Promise<void> {
    if (!this.getPrincipalId) {
      return;
    }
    const currentDrc20Token = new DRC20TokenService();
    const res = await currentDrc20Token.icrc1_balance_of(
      IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
      { owner: Principal.fromText(poolId), subaccount: [] }
    );
    const res1 = await currentDrc20Token.icrc1_balance_of(
      IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
      { owner: Principal.fromText(this.getPrincipalId), subaccount: [] }
    );
    this.poolICLBalance = new BigNumber(res.toString(10))
      .div(10 ** 8)
      .toString(10);
    this.ICLBalance = new BigNumber(res1.toString(10))
      .div(10 ** 8)
      .toString(10);
  }
  private async getUnitNetValues(): Promise<void> {
    const poolId = this.$route.params.poolId;
    const res = await this.makerPoolService.getUnitNetValues(poolId);
    console.log(res);
  }
  private async onRemove(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const poolId = this.$route.params.poolId;
    const shares = new BigNumber(this.removeShares)
      .times(10 ** this.pool[1].shareDecimals)
      .toString(10);
    try {
      const res = await this.makerPoolService.remove(poolId, BigInt(shares));
      if (res) {
        this.$message.success('Success');
        this.initRemove();
        this.getPoolInfo(poolId);
        this.poolStats(poolId);
        this.getAccountShares(poolId);
      } else {
        this.$message.error('Error');
        this.getPoolInfo(poolId);
      }
    } catch (e) {
      console.log(e);
      if (toHttpRejectError(e).includes('401')) {
        this.$message.error(
          'The system is processing, please try again later.'
        );
      } else if (toHttpRejectError(e).includes('410')) {
        this.$message.error(toHttpRejectError(e));
      } else if (toHttpRejectError(e).includes('411')) {
        this.$message.error(toHttpRejectError(e));
      } else if (toHttpRejectError(e).includes('413')) {
        this.$message.error(
          'Liquidity cannot be added or removed until the pair has completed its transactions. Please try again later.'
        );
      } else {
        this.$message.error(toHttpRejectError(e));
      }
      this.getPoolInfo(poolId);
    }
    this.getEvents(this.$route.params.poolId);
    this.getPoolICLBalance(poolId);
    loading.close();
  }
  private async onAdd(): Promise<void> {
    // if (!this.nfts.length) {
    //   this.$info({
    //     content:
    //       'This feature is currently in the experimental stage and is for ICLighthouse Planet Cards NFT holders to experience and use only.',
    //     class: 'connect-plug',
    //     icon: 'connect-plug',
    //     centered: true,
    //     okText: 'Close'
    //   });
    //   return;
    // }
    const poolId = this.$route.params.poolId;
    const token0Id = this.pool[1].pairInfo.token0[0].toString();
    const token0Std = this.pool[1].pairInfo.token0[2];
    const token0StdString = Object.keys(token0Std)[0];
    const token1Id = this.pool[1].pairInfo.token1[0].toString();
    const token1Std = this.pool[1].pairInfo.token1[2];
    const token1StdString = Object.keys(token1Std)[0];
    let loading: any = this.$loading({
      lock: true,
      customClass: 'create-wallet-loading',
      background: 'rgba(0, 0, 0, 0.6)',
      text: `step1: Depositing ${this.tokens[token0Id].symbol} and ${this.tokens[token1Id].symbol}`
    });
    const token0Amount = new BigNumber(this.token0Amount)
      .times(10 ** this.tokens[token0Id].decimals)
      .toString(10);
    const token1Amount = new BigNumber(this.token1Amount)
      .times(10 ** this.tokens[token1Id].decimals)
      .toString(10);
    let needTransferToken0 = new BigNumber(this.token0Amount)
      .plus(this.token0fee)
      .times(10 ** this.tokens[token0Id].decimals)
      .toString(10);
    if (
      token0StdString.toLocaleLowerCase() === 'drc20' ||
      token0StdString.toLocaleLowerCase() === 'icrc2'
    ) {
      needTransferToken0 = new BigNumber(this.token0Amount)
        .plus(this.token0fee)
        .plus(this.token0fee)
        .times(10 ** this.tokens[token0Id].decimals)
        .toString(10);
    }
    let needTransferToken1 = new BigNumber(this.token1Amount)
      .plus(this.token1fee)
      .times(10 ** this.tokens[token1Id].decimals)
      .toString(10);
    this.plugBatch = true;
    if (
      token1StdString.toLocaleLowerCase() === 'drc20' ||
      token1StdString.toLocaleLowerCase() === 'icrc2'
    ) {
      needTransferToken1 = new BigNumber(this.token1Amount)
        .plus(this.token1fee)
        .plus(this.token1fee)
        .times(10 ** this.tokens[token1Id].decimals)
        .toString(10);
    }
    console.time();
    let promiseValue = [];
    let batchTransactions = [];
    if (
      token0StdString.toLocaleLowerCase() === 'drc20' ||
      token0StdString.toLocaleLowerCase() === 'icrc2'
    ) {
      const poolId = this.$route.params.poolId;
      if (!isSigner() && isPlug()) {
        if (token0StdString.toLocaleLowerCase() === 'drc20') {
          const approve = {
            idl: drc20TokenIDL,
            canisterId: token0Id,
            methodName: 'drc20_approve',
            args: [poolId, BigInt(needTransferToken0), [], [], []],
            onSuccess: async () => {
              console.log('successfully');
            },
            onFail: (res) => {
              this.plugBatch = false;
              console.log('error', res);
            }
          };
          batchTransactions.push(approve);
        }
        if (token0StdString.toLocaleLowerCase() === 'icrc2') {
          const approveArgs: ApproveArgs = {
            fee: [],
            memo: [],
            from_subaccount: [],
            created_at_time: [],
            amount: BigInt(needTransferToken0),
            expected_allowance: [],
            expires_at: [],
            spender: {
              owner: Principal.fromText(poolId),
              subaccount: []
            }
          };
          const approve = {
            idl: drc20TokenIDL,
            canisterId: token0Id,
            methodName: 'icrc2_approve',
            args: [approveArgs],
            onSuccess: async () => {
              console.log('successfully');
            },
            onFail: (res) => {
              this.plugBatch = false;
              console.log('error', res);
            }
          };
          batchTransactions.push(approve);
        }
      } else {
        if (isSigner()) {
          const res = await this.approve(
            token0Id,
            token0StdString,
            BigInt(needTransferToken0)
          );
          if (!res) {
            this.$message.error('Error');
            loading.close();
            return;
          }
        } else {
          promiseValue.push(
            this.approve(token0Id, token0StdString, BigInt(needTransferToken0))
          );
        }
      }
    } else if (token0StdString.toLocaleLowerCase() === 'icrc1') {
      if (!isSigner() && isPlug()) {
        const transferArgs = {
          to: this.depositAccount[0],
          fee: [],
          memo: [],
          from_subaccount: [],
          created_at_time: [],
          amount: BigInt(needTransferToken0)
        };
        const transfer = {
          idl: drc20TokenIDL,
          canisterId: token0Id,
          methodName: 'icrc1_transfer',
          args: [transferArgs],
          onSuccess: async () => {
            console.log('successfully');
          },
          onFail: (res) => {
            this.plugBatch = false;
            console.log('error', res);
          }
        };
        batchTransactions.push(transfer);
      } else {
        if (isSigner()) {
          const res = await this.transferIcrc1(
            token0Id,
            BigInt(needTransferToken0),
            this.depositAccount[0]
          );
          if (!res) {
            this.$message.error('Error');
            loading.close();
            return;
          }
        } else {
          promiseValue.push(
            this.transferIcrc1(
              token0Id,
              BigInt(needTransferToken0),
              this.depositAccount[0]
            )
          );
        }
      }
    } else if (token0StdString.toLocaleLowerCase() === 'icp') {
      if (!isSigner() && isPlug()) {
        const transferArgs = {
          to: this.depositAccount[0],
          fee: [],
          memo: [],
          from_subaccount: [],
          created_at_time: [],
          amount: BigInt(needTransferToken0)
        };
        const transfer = {
          idl: drc20TokenIDL,
          canisterId: token0Id,
          methodName: 'icrc1_transfer',
          args: [transferArgs],
          onSuccess: async () => {
            console.log('successfully');
          },
          onFail: (res) => {
            this.plugBatch = false;
            console.log('error', res);
          }
        };
        batchTransactions.push(transfer);
      } else {
        if (isSigner()) {
          const res = await this.ledgerService.sendIcp(
            new BigNumber(needTransferToken0)
              .div(10 ** this.tokens[token0Id].decimals)
              .toString(10),
            this.depositAccount[1]
          );
          if (!res) {
            this.$message.error('Error');
            loading.close();
            return;
          }
        } else {
          promiseValue.push(
            this.ledgerService.sendIcp(
              new BigNumber(needTransferToken0)
                .div(10 ** this.tokens[token0Id].decimals)
                .toString(10),
              this.depositAccount[1]
            )
          );
        }
      }
    }
    console.log(batchTransactions);
    if (
      token1StdString.toLocaleLowerCase() === 'drc20' ||
      token1StdString.toLocaleLowerCase() === 'icrc2'
    ) {
      if (!isSigner() && isPlug()) {
        if (token1StdString.toLocaleLowerCase() === 'drc20') {
          const approve = {
            idl: drc20TokenIDL,
            canisterId: token1Id,
            methodName: 'drc20_approve',
            args: [poolId, BigInt(needTransferToken1), [], [], []],
            onSuccess: async () => {
              console.log('successfully');
            },
            onFail: (res) => {
              this.plugBatch = false;
              console.log('error', res);
            }
          };
          batchTransactions.push(approve);
        }
        if (token1StdString.toLocaleLowerCase() === 'icrc2') {
          const approveArgs: ApproveArgs = {
            fee: [],
            memo: [],
            from_subaccount: [],
            created_at_time: [],
            amount: BigInt(needTransferToken1),
            expected_allowance: [],
            expires_at: [],
            spender: {
              owner: Principal.fromText(poolId),
              subaccount: []
            }
          };
          const approve = {
            idl: drc20TokenIDL,
            canisterId: token1Id,
            methodName: 'icrc2_approve',
            args: [approveArgs],
            onSuccess: async () => {
              console.log('successfully');
            },
            onFail: (res) => {
              this.plugBatch = false;
              console.log('error', res);
            }
          };
          batchTransactions.push(approve);
        }
      } else {
        if (isSigner()) {
          const res = await this.approve(
            token1Id,
            token1StdString,
            BigInt(needTransferToken1)
          );
          if (!res) {
            this.$message.error('Error');
            loading.close();
            return;
          }
        } else {
          promiseValue.push(
            this.approve(token1Id, token1StdString, BigInt(needTransferToken1))
          );
        }
      }
    } else if (token1StdString.toLocaleLowerCase() === 'icrc1') {
      if (!isSigner() && isPlug()) {
        const transferArgs = {
          to: this.depositAccount[0],
          fee: [],
          memo: [],
          from_subaccount: [],
          created_at_time: [],
          amount: BigInt(needTransferToken1)
        };
        const transfer = {
          idl: drc20TokenIDL,
          canisterId: token1Id,
          methodName: 'icrc1_transfer',
          args: [transferArgs],
          onSuccess: async () => {
            console.log('successfully');
          },
          onFail: (res) => {
            this.plugBatch = false;
            console.log('error', res);
          }
        };
        batchTransactions.push(transfer);
      } else {
        if (isSigner()) {
          const res = await this.transferIcrc1(
            token1Id,
            BigInt(needTransferToken1),
            this.depositAccount[0]
          );
          if (!res) {
            this.$message.error('Error');
            loading.close();
            return;
          }
        } else {
          promiseValue.push(
            this.transferIcrc1(
              token1Id,
              BigInt(needTransferToken1),
              this.depositAccount[0]
            )
          );
        }
      }
    } else if (token1StdString.toLocaleLowerCase() === 'icp') {
      if (!isSigner() && isPlug()) {
        const transferArgs = {
          to: this.depositAccount[0],
          fee: [],
          memo: [],
          from_subaccount: [],
          created_at_time: [],
          amount: BigInt(needTransferToken1)
        };
        const transfer = {
          idl: drc20TokenIDL,
          canisterId: token1Id,
          methodName: 'icrc1_transfer',
          args: [transferArgs],
          onSuccess: async () => {
            console.log('successfully');
          },
          onFail: (res) => {
            this.plugBatch = false;
            console.log('error', res);
          }
        };
        batchTransactions.push(transfer);
      } else {
        if (isSigner()) {
          const res = await this.ledgerService.sendIcp(
            new BigNumber(needTransferToken1)
              .div(10 ** this.tokens[token1Id].decimals)
              .toString(10),
            this.depositAccount[1]
          );
          if (!res) {
            this.$message.error('Error');
            loading.close();
            return;
          }
        } else {
          promiseValue.push(
            this.ledgerService.sendIcp(
              new BigNumber(needTransferToken1)
                .div(10 ** this.tokens[token1Id].decimals)
                .toString(10),
              this.depositAccount[1]
            )
          );
        }
      }
    }
    console.log(promiseValue);
    console.log(batchTransactions);
    if (isPlug()) {
      try {
        const plugIc = (window as any).ic.plug;
        await plugIc.batchTransactions(batchTransactions);
        console.log(this.plugBatch);
        if (!this.plugBatch) {
          loading.close();
          this.$message.error('Approve error');
          return;
        }
      } catch (e) {
        console.log(e);
        loading.close();
        this.$message.error('Approve error');
        return;
      }
    } else if (!isSigner()) {
      const res = await Promise.all(promiseValue);
      console.log(res);
      if (res && (!res[0] || !res[1])) {
        this.$message.error('Error');
        loading.close();
        return;
      }
    }
    loading.setText(
      'step2: Adding liquidity.\n(It could take a minute. You can leave this page and the result will be updated soon.)'
    );
    console.timeEnd();
    console.time();
    let flag = false;
    this.makerPoolService
      .add(poolId, BigInt(token0Amount), BigInt(token1Amount))
      .then((res) => {
        console.timeEnd();
        if (res) {
          this.$message.success('Success');
          this.initAdd();
          this.getPoolInfo(poolId);
          this.poolStats(poolId);
          this.getAccountShares(poolId);
        } else {
          this.getPoolInfo(poolId);
          this.$message.error('Error');
        }
      })
      .catch((e) => {
        console.log(e);
        this.getTokenBalance(token0Id, this.tokens[token0Id].tokenStd);
        this.getTokenBalance(token1Id, this.tokens[token1Id].tokenStd);
        if (toHttpRejectError(e).includes('401')) {
          this.$message.error(
            'The system is processing, please try again later.'
          );
        } else if (toHttpRejectError(e).includes('410')) {
          this.$message.error(toHttpRejectError(e));
        } else if (toHttpRejectError(e).includes('411')) {
          this.$message.error(toHttpRejectError(e));
        } else if (toHttpRejectError(e).includes('413')) {
          this.$message.error(
            'Liquidity cannot be added or removed until the pair has completed its transactions. Please try again later.'
          );
        } else {
          this.$message.error(toHttpRejectError(e));
        }
      })
      .finally(() => {
        flag = true;
        this.getDepositAccountBalance();
        this.getPoolICLBalance(poolId);
        this.getEvents(this.$route.params.poolId);
        loading.close();
      });
    window.setTimeout(() => {
      if (!flag) {
        flag = true;
        loading.close();
        this.initAdd();
        this.getPoolInfo(poolId);
        this.poolStats(poolId);
        this.getAccountShares(poolId);
        this.$info({
          content:
            'The transaction is being processed and the result will be updated later.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          centered: true,
          onOk() {
            //
          }
        });
      }
    }, 6 * 1000);
  }
  private initAdd(): void {
    this.token0Amount = '';
    this.token1Amount = '';
    this.shares = '0';
  }
  private initRemove(): void {
    this.removeShares = '';
    this.sharesValue0 = '0';
    this.sharesValue1 = '0';
    this.sharesFee0 = '0';
    this.sharesFee1 = '0';
  }
  private async transferIcrc1(
    tokenId: string,
    amount: bigint,
    to: Icrc1Account
  ): Promise<boolean> {
    const currentDrc20Token = new DRC20TokenService();
    const res = await currentDrc20Token.icrc1Transfer(tokenId, amount, to);
    console.log(res);
    if (res) {
      return Object.keys(res)[0] !== 'Err';
    }
  }
  private async approve(
    tokenId: string,
    tokenStd: string,
    amount: bigint
  ): Promise<boolean> {
    const poolId = this.$route.params.poolId;
    if (tokenStd.toLocaleLowerCase() === 'drc20') {
      try {
        const currentDrc20Token = new DRC20TokenService();
        const res = await currentDrc20Token.drc20Approve(
          amount,
          [],
          poolId,
          [],
          0,
          tokenId
        );
        if (
          (
            res as {
              ok: Txid;
            }
          ).ok
        ) {
          return true;
        } else {
          this.$message.error((res as TxnResultErr).err.message);
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    } else if (tokenStd.toLocaleLowerCase() === 'icrc2') {
      try {
        const currentDrc20Token = new DRC20TokenService();
        const res = await currentDrc20Token.icrc2_approve(
          tokenId,
          {
            owner: Principal.fromText(poolId),
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
    }
  }
  private async getPool(poolId: string): Promise<void> {
    this.getPoolInfo(poolId).then(() => {
      this.getDepositAccountBalance();
    });
    this.getPoolICLBalance(poolId);
    this.poolStats(poolId);
    this.getAccountShares(poolId);
    this.getMakerConfig(poolId);
    console.log(this.pool);
    window.clearInterval(this.timer);
    this.timer = null;
    this.timer = window.setInterval(() => {
      this.getPoolInfo(poolId);
      this.poolStats(poolId);
      this.getAccountShares(poolId);
      this.getPoolICLBalance(poolId);
    }, 10 * 1000);
  }
  private async getMakerConfig(poolId: string): Promise<void> {
    this.getPoolControllers(poolId);
    this.ictc_getAdmins(poolId);
  }
  private async ictc_getAdmins(pairId: string): Promise<void> {
    const res = await this.makerPoolService.ictc_getAdmins(pairId);
    if (res) {
      this.$set(this.makerConfigure, 'ICTCAdmins', res);
    }
  }
  private async getPoolControllers(poolId: string): Promise<void> {
    try {
      const state = await readState(poolId);
      if (state && state.controllers && state.controllers.length) {
        this.$set(this.makerConfigure, 'controllers', state.controllers);
      }
      if (state && state.moduleHash) {
        this.$set(this.makerConfigure, 'moduleHash', state.moduleHash);
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getPairPrice(pair: string): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICDexService.stats(pair);
      if (res && res.stats) {
        this.pairPrice = res.stats.price;
      }
    }
    console.log(this.pairPrice);
  }
  private async getPairInfo(pair: string): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICDexService.info(pair);
      if (res && res.pairInfo) {
        this.pairInfo = res.pairInfo;
      }
    }
  }
  private async getPairVol(pair: string): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICDexService.liquidity(pair, [
        this.getPrincipalId
      ]);
      if (res && res.tokenLiquidity) {
        this.pairVol = res.tokenLiquidity.vol.value1.toString(10);
      }
    }
  }
  private async getAccountVolUsed(): Promise<void> {
    const poolId = this.$route.params.poolId;
    if (this.getPrincipalId) {
      const res = await this.makerPoolService.getAccountVolUsed(
        poolId,
        this.getPrincipalId
      );
      if (res !== null) {
        this.volUsed = res.toString(10);
      }
    }
  }
  private async getDepositAccount(): Promise<void> {
    const poolId = this.$route.params.poolId;
    this.depositAccount = await this.makerPoolService.getDepositAccount(
      poolId,
      this.getPrincipalId
    );
    console.log(this.depositAccount);
  }
  private async getDepositAccountBalance(): Promise<void> {
    if (this.getPrincipalId) {
      getDepositing(
        this.pool[1].pairInfo.token0[2],
        this.pool[1].pairInfo.token0[0].toString(),
        this.depositAccount[0]
      ).then((res) => {
        this.depositAccountBalance[this.pool[1].pairInfo.token0[0].toString()] =
          res;
      });
      getDepositing(
        this.pool[1].pairInfo.token1[2],
        this.pool[1].pairInfo.token1[0].toString(),
        this.depositAccount[0]
      ).then((res) => {
        this.depositAccountBalance[this.pool[1].pairInfo.token1[0].toString()] =
          res;
      });
      console.log(this.depositAccountBalance);
    }
  }
  private async getPoolInfo(poolId: string): Promise<void> {
    const res = await this.makerPoolService.info(poolId);
    if (!this.stoConfig) {
      this.getStoConfig(res.pairInfo.pairPrincipal.toString());
    }
    this.getPairVol(res.pairInfo.pairPrincipal.toString());
    this.getPairInfo(res.pairInfo.pairPrincipal.toString());
    this.getRole(res.pairInfo.pairPrincipal.toString(), poolId);
    if (!res.initialized) {
      this.getPairPrice(res.pairInfo.pairPrincipal.toString());
    }
    this.getAccountVolUsed();
    // todo
    // res.initialized = false;
    this.$set(this.pool, 1, res);
    if (res) {
      const token0 = res.pairInfo.token0[0];
      const token0Std = res.pairInfo.token0[2];
      const token1 = res.pairInfo.token1[0];
      const token1Std = res.pairInfo.token1[2];
      if (!this.tokens[token0.toString()]) {
        const token0Info = await getTokenInfo(token0, token0Std);
        this.$set(this.tokens, token0.toString(), token0Info);
      } else if (!this.tokens[token0.toString()].logo) {
        getTokenLogo(token0, this.tokens[token0.toString()].tokenStd).then(
          (logo) => {
            if (logo) {
              this.$set(this.tokens[token0.toString()], 'logo', logo);
            } else {
              this.getIcrcMetadata(token0, token0Std);
            }
          }
        );
      }
      if (!this.tokens[token1.toString()]) {
        const token1Info = await getTokenInfo(token1, token1Std);
        this.$set(this.tokens, token1.toString(), token1Info);
      } else if (!this.tokens[token1.toString()].logo) {
        getTokenLogo(token1, this.tokens[token1.toString()].tokenStd).then(
          (logo) => {
            if (logo) {
              this.$set(this.tokens[token1.toString()], 'logo', logo);
            } else {
              this.getIcrcMetadata(token1, token1Std);
            }
          }
        );
      }
      this.token0fee = new BigNumber(
        getFee(this.tokens[token0.toString()]).toString(10)
      )
        .div(10 ** this.tokens[token0.toString()].decimals)
        .toString(10);
      this.token1fee = new BigNumber(
        getFee(this.tokens[token1.toString()]).toString(10)
      )
        .div(10 ** this.tokens[token1.toString()].decimals)
        .toString(10);
      this.getTokenBalance(
        token0.toString(),
        this.tokens[token0.toString()].tokenStd
      );
      this.getTokenBalance(
        token1.toString(),
        this.tokens[token1.toString()].tokenStd
      );
    }
  }
  private async getIcrcMetadata(
    token: Principal,
    tokenStd: TokenStd
  ): Promise<void> {
    const std = Object.keys(tokenStd)[0];
    let logo = '';
    if (std.toLocaleLowerCase().includes('icrc')) {
      let SNSGovernance = '';
      this.listDeployedSnses.some((item) => {
        if (
          item.ledger_canister_id.length &&
          item.ledger_canister_id[0].toString() === token.toString()
        ) {
          SNSGovernance = item.governance_canister_id[0].toString();
          return true;
        }
      });
      if (SNSGovernance) {
        const snsGovernanceService = new SNSGovernanceService();
        const metadata = await snsGovernanceService.getMetadata(SNSGovernance);
        console.log(metadata);
        if (metadata && metadata.logo && metadata.logo.length) {
          logo = metadata.logo[0];
          this.$set(this.tokens[token.toString()], 'logo', logo);
        }
      }
    }
  }
  private async poolStats(poolId: string): Promise<void> {
    const res = await this.makerPoolService.stats2(poolId);
    if (res) {
      this.isBusy = false;
      this.$set(this.pool, 2, res);
    } else {
      this.isBusy = true;
    }
  }
  private getVolAvailable(
    pool: [string?, PoolInfo?, PoolStats?, [bigint, ShareWeighted]?, DexRole?],
    used: string
  ): string {
    let available = new BigNumber(this.pairVol)
      .times(pool[1].volFactor.toString(10))
      .minus(used)
      .toString(10);
    if (new BigNumber(available).lt(0)) {
      available = '0';
    }
    return available;
  }
  private getAvailable(
    pool: [string?, PoolInfo?, PoolStats?, [bigint, ShareWeighted]?, DexRole?]
  ): string {
    const token1 = this.tokens[pool[1].pairInfo.token1[0].toString()];
    // const utilized = this.getUtilized(pool);
    return (
      new BigNumber(this.pairVol)
        .times(pool[1].volFactor.toString(10))
        .div(10 ** token1.decimals)
        // .minus(utilized)
        .decimalPlaces(8, 1)
        .toString(10)
    );
  }
  private showCapThreshold(
    pool: [string?, PoolInfo?, PoolStats?, [bigint, ShareWeighted]?, DexRole?]
  ): boolean {
    if (pool && pool[1] && pool[2]) {
      return new BigNumber(pool[2].poolBalance.balance1.toString(10)).lt(
        pool[1].poolThreshold.toString(10)
      );
    }
    return true;
  }
  private async getAccountShares(poolId: string): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.makerPoolService.getAccountShares(
        poolId,
        this.getPrincipalId
      );
      this.$set(this.pool, 3, res);
    }
  }
  private token0AmountChange(): void {
    if (this.token0Amount) {
      const token0decimals =
        this.tokens[this.pool[1].pairInfo.token0[0].toString()].decimals;
      const token1decimals =
        this.tokens[this.pool[1].pairInfo.token1[0].toString()].decimals;
      if (this.pool[1] && !this.pool[1].initialized && this.pairPrice) {
        const price = new BigNumber(this.pairPrice)
          .times(10 ** token0decimals)
          .div(10 ** token1decimals);
        this.token1Amount = price
          .times(this.token0Amount)
          .decimalPlaces(token1decimals)
          .toString(10);
      } else if (this.pool[2] && this.pool[2].poolShares) {
        this.token1Amount = new BigNumber(
          this.pool[2].poolBalance.balance1.toString(10)
        )
          .div(10 ** token1decimals)
          .times(10 ** token0decimals)
          .div(this.pool[2].poolBalance.balance0.toString(10))
          .times(this.token0Amount)
          .decimalPlaces(token1decimals)
          .toString(10);
      }
    } else {
      this.token1Amount = '';
    }
    if (this.pool[2] && this.pool[2].poolShares) {
      this.getShares();
    }
  }
  private token1AmountChange(): void {
    if (this.token1Amount) {
      const token0decimals =
        this.tokens[this.pool[1].pairInfo.token0[0].toString()].decimals;
      const token1decimals =
        this.tokens[this.pool[1].pairInfo.token1[0].toString()].decimals;
      if (this.pool[1] && !this.pool[1].initialized && this.pairPrice) {
        const price = new BigNumber(this.pairPrice)
          .times(10 ** token0decimals)
          .div(10 ** token1decimals);
        this.token0Amount = new BigNumber(this.token1Amount)
          .div(price)
          .decimalPlaces(token1decimals)
          .toString(10);
      } else if (this.pool[2] && this.pool[2].poolShares) {
        this.token0Amount = new BigNumber(
          this.pool[2].poolBalance.balance0.toString(10)
        )
          .div(10 ** token0decimals)
          .times(10 ** token1decimals)
          .div(this.pool[2].poolBalance.balance1.toString(10))
          .times(this.token1Amount)
          .decimalPlaces(token0decimals)
          .toString(10);
      }
    } else {
      this.token0Amount = '';
    }
    if (this.pool[2] && this.pool[2].poolShares) {
      this.getShares();
    }
  }
  private sharesChange(): void {
    if (this.removeShares) {
      const token0 = this.pool[1].pairInfo.token0[0].toString();
      const token1 = this.pool[1].pairInfo.token1[0].toString();
      const token0fee = new BigNumber(
        getFee(this.tokens[token0.toString()]).toString(10)
      );
      const token1fee = new BigNumber(
        getFee(this.tokens[token1.toString()]).toString(10)
      );
      const decimals0 =
        this.tokens[this.pool[1].pairInfo.token0[0].toString()].decimals;
      const decimals1 =
        this.tokens[this.pool[1].pairInfo.token1[0].toString()].decimals;
      const rate0 = new BigNumber(this.pool[2].poolShares.toString(10)).div(
        this.pool[2].poolBalance.balance0.toString(10)
      );
      const rate1 = new BigNumber(this.pool[2].poolShares.toString(10)).div(
        this.pool[2].poolBalance.balance1.toString(10)
      );
      // Fee: 10 * tokenFee + withdrawalFee * Value
      let sharesFee0 = new BigNumber(
        this.pool[2].poolBalance.balance0.toString(10)
      )
        .minus(
          new BigNumber(this.pool[2].poolShares.toString(10))
            .div(10 ** this.pool[1].shareDecimals)
            .minus(this.removeShares)
            .times(10 ** this.pool[1].shareDecimals)
            .div(rate0)
        )
        .times(this.pool[1].withdrawalFee)
        .plus(new BigNumber(token0fee).times(10));
      let sharesValue0 = new BigNumber(
        this.pool[2].poolBalance.balance0.toString(10)
      )
        .minus(
          new BigNumber(this.pool[2].poolShares.toString(10))
            .div(10 ** this.pool[1].shareDecimals)
            .minus(this.removeShares)
            .times(10 ** this.pool[1].shareDecimals)
            .div(rate0)
        )
        .minus(sharesFee0)
        .div(10 ** decimals0);
      let decimalPlaces = Math.min(decimals0, 8);
      if (sharesValue0.gt(10 ** 7)) {
        decimalPlaces = 0;
      }
      this.sharesValue0 = sharesValue0
        .decimalPlaces(decimalPlaces)
        .toString(10);
      this.sharesFee0 = sharesFee0
        .div(10 ** decimals0)
        .decimalPlaces(decimalPlaces)
        .toString(10);
      if (new BigNumber(this.sharesValue0).lt(0)) {
        this.sharesValue0 = '0';
      }
      let sharesFee1 = new BigNumber(
        this.pool[2].poolBalance.balance1.toString(10)
      )
        .minus(
          new BigNumber(this.pool[2].poolShares.toString(10))
            .div(10 ** this.pool[1].shareDecimals)
            .minus(this.removeShares)
            .times(10 ** this.pool[1].shareDecimals)
            .div(rate1)
        )
        .times(this.pool[1].withdrawalFee)
        .plus(new BigNumber(token1fee).times(10));
      let sharesValue1 = new BigNumber(
        this.pool[2].poolBalance.balance1.toString(10)
      )
        .minus(
          new BigNumber(this.pool[2].poolShares.toString(10))
            .div(10 ** this.pool[1].shareDecimals)
            .minus(this.removeShares)
            .times(10 ** this.pool[1].shareDecimals)
            .div(rate1)
        )
        .minus(sharesFee1)
        .div(10 ** decimals1);
      let decimalPlaces1 = Math.min(decimals1, 8);
      if (sharesValue1.gt(10 ** 7)) {
        decimalPlaces1 = 0;
      }
      this.sharesValue1 = sharesValue1
        .decimalPlaces(decimalPlaces1)
        .toString(10);
      this.sharesFee1 = sharesFee1
        .div(10 ** decimals1)
        .decimalPlaces(decimalPlaces1)
        .toString(10);
      if (new BigNumber(this.sharesValue1).lt(0)) {
        this.sharesValue1 = '0';
      }
    } else {
      this.sharesValue0 = '0';
      this.sharesValue1 = '0';
    }
  }
  private getShares(): void {
    if (this.token0Amount && this.token1Amount) {
      const token1Balance = this.pool[2].poolBalance.balance1.toString(10);
      const token1Decimals =
        this.tokens[this.pool[1].pairInfo.token1[0].toString()].decimals;
      const token1Amount = new BigNumber(this.token1Amount).times(
        10 ** token1Decimals
      );
      const totalAmount = new BigNumber(token1Amount).plus(token1Balance);
      const poolShares = this.pool[2].poolShares.toString(10);
      this.shares = new BigNumber(poolShares)
        .div(token1Balance)
        .times(totalAmount)
        .minus(poolShares)
        .div(10 ** this.pool[1].shareDecimals)
        .decimalPlaces(this.pool[1].shareDecimals)
        .toString(10);
    } else {
      this.shares = '0';
    }
  }
  private async getTokenBalance(
    tokenId: string,
    tokenStd: TokenStd
  ): Promise<void> {
    const balance = await getTokenBalance(tokenStd, tokenId);
    if (balance) {
      this.$set(this.tokensBalance, tokenId, balance);
    }
  }
  private setMaxAmount(tokenId: string, t: string): void {
    const tokenStd = Object.keys(this.tokens[tokenId].tokenStd)[0];
    if (t === 'token0') {
      let token0fee = new BigNumber(this.token0fee).times(2).toString(10);
      if (
        tokenStd.toLocaleLowerCase() === 'drc20' ||
        tokenStd.toLocaleLowerCase() === 'icrc2'
      ) {
        token0fee = new BigNumber(this.token0fee).plus(token0fee).toString(10);
      }
      this.token0Amount = new BigNumber(this.tokensBalance[tokenId])
        .div(10 ** this.tokens[tokenId].decimals)
        .minus(token0fee)
        .toString(10);
      if (new BigNumber(this.token0Amount).lt(0)) {
        this.token0Amount = '0';
      }
      this.token0AmountChange();
    } else {
      let token1fee = new BigNumber(this.token1fee).times(2).toString(10);
      if (
        tokenStd.toLocaleLowerCase() === 'drc20' ||
        tokenStd.toLocaleLowerCase() === 'icrc2'
      ) {
        token1fee = new BigNumber(this.token1fee).plus(token1fee).toString(10);
      }
      this.token1Amount = new BigNumber(this.tokensBalance[tokenId])
        .div(10 ** this.tokens[tokenId].decimals)
        .minus(token1fee)
        .toString(10);
      if (new BigNumber(this.token1Amount).lt(0)) {
        this.token1Amount = '0';
      }
      this.token1AmountChange();
    }
  }
  private setMaxShares(): void {
    const max = new BigNumber(this.pool[3][0].toString(10))
      .div(10 ** this.pool[1].shareDecimals)
      .toString(10);
    const maxCanRemove = new BigNumber(this.pool[2].poolShares.toString(10))
      .div(10 ** this.pool[1].shareDecimals)
      .decimalPlaces(this.pool[1].shareDecimals)
      .toString(10);
    if (new BigNumber(max).gt(maxCanRemove)) {
      this.removeShares = maxCanRemove;
    } else {
      this.removeShares = max;
    }
    this.sharesChange();
  }
  private connectWallet(): void {
    this.$router.push({
      path: '/login',
      query: { redirect: this.$route.fullPath }
    });
  }
  private changeType(type: 'Add' | 'Remove') {
    if (this.type !== type) {
      this.type = type;
      if (type === 'Add') {
        this.initRemove();
      }
      if (type === 'Remove') {
        this.initAdd();
      }
    }
  }
  private back(): void {
    const poolId = this.$route.params.poolId;
    if (this.isPublic) {
      this.$router.replace(`/ICDex/pools?id=${poolId}`);
    } else {
      this.$router.replace(`/ICDex/pools?id=${poolId}&private`);
    }
  }
  private async fallback(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const poolId = this.$route.params.poolId;
      const res = await this.makerPoolService.fallback(poolId);
      console.log(res);
      if (res) {
        this.$message.success('Success');
      } else {
        this.$message.error('Error');
      }
      this.getDepositAccountBalance();
    } catch (e) {
      console.log(e);
      this.$message.error(e);
    }
    loading.close();
  }
  private changeEvents(page): void {
    this.currentEventPage = page;
  }
}
</script>

<style scoped lang="scss">
.pool-item-l {
  display: flex;
  margin-bottom: 10px;
  > div {
    display: flex;
    flex-direction: column;
    width: 220px;
    &.pool-item-l-net {
      width: 100%;
      .font12 {
        font-size: 12px;
      }
    }
    .base-color-w {
      font-size: 16px;
    }
  }
}
.pool-item-title {
  margin: 20px 0 10px;
  color: #fff;
  font-size: 16px;
}
.pool-header {
  display: flex;
  align-items: center;
  button {
    width: 80px;
  }
}
.pool-apy {
  display: flex;
  justify-content: flex-start;
  margin-top: 5px;
  color: #666c7e;
  .pool-apy-item {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    line-height: 1.5;
  }
}
.home-header {
  margin-top: 14px;
}
.pool-info {
  width: 690px;
  margin: 50px auto 0;
  border-radius: 4px;
  color: #747884;
}
.pool-item {
  background: #141b23;
  border: 1px solid #313b46;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  border-radius: 9px;
  padding: 30px 35px;
  color: #adb3c4;
  line-height: 1.2;
  .swap-item-top-right-remove {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 310px;
    margin-left: auto;
    text-align: right;
  }
}
.max-amount {
  color: #1996c4;
  cursor: pointer;
}
.exchange-swap-item-top {
  display: flex;
  align-items: center;
  ::v-deep {
    input {
      width: 310px;
    }
  }
}
.you-get-shares {
  font-size: 20px;
}
.add-liquidity-icon .swap-icon {
  transform: rotate(0);
}
.exchange-swap-item-bottom {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.back-arrow {
  margin-bottom: 10px;
  color: #bababa;
  font-size: 18px;
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
.pc-show {
  display: flex;
}
.h5-show {
  display: none;
}
@media screen and (max-width: 768px) {
  .pc-show {
    display: none;
  }
  .h5-show {
    display: flex;
  }
  .pool-item {
    padding: 15px 10px;
    font-size: 12px;
    .swap-item-top-right-remove {
      width: auto;
    }
  }
  .ic-swap-item-top-left {
    .img-content {
      width: 25px;
    }
  }
  .pool-info {
    width: 100%;
    padding: 0 10px 20px;
  }
  .pool-item-l {
    &.pool-item-l-shares {
      flex-direction: column;
    }
    > div {
      .base-color-w {
        font-size: 12px;
      }
    }
  }
  .exchange-swap-item-top {
    ::v-deep input {
      width: auto;
    }
  }
}
</style>
