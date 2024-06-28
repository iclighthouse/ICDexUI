<template>
  <div>
    <a-modal
      v-model="visibleProOrder"
      :title="title"
      centered
      width="650px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal"
      :after-close="afterClose"
    >
      <div v-show="step === 1">
        <div class="pro-order-item">
          <div class="base-font-title">
            1. Transfer tokens from Main-wallet to Pro-wallet.
            <!--(subaccount:0000000000000000000000000000000000000000000000000000000000000001)-->
          </div>
          <div class="mt20" style="color: #adb3c4">Pro-Wallet:</div>
          <div class="transfer-pro-wallet-main">
            <div class="transfer-pro-wallet">
              <span>{{ currentPair[1][0].token1[1] }}:&nbsp;</span>
              <span
                v-if="
                  tokensBalanceSto &&
                  currentPair &&
                  tokens[currentPair[1][0].token1[0].toString()]
                "
                class="base-font-title"
                >{{
                  tokensBalanceSto[currentPair[1][0].token1[0].toString()]
                    | bigintToFloat(
                      4,
                      tokens[currentPair[1][0].token1[0].toString()].decimals
                    )
                    | formatNum
                }}</span
              >
              <a-icon
                style="margin-left: 5px"
                type="plus-circle"
                @click="gridTransferToken(false)"
              />
            </div>
            <div class="transfer-pro-wallet">
              <span>{{ currentPair[1][0].token0[1] }}:&nbsp;</span>
              <span
                v-if="
                  tokensBalanceSto &&
                  currentPair &&
                  tokens[currentPair[1][0].token0[0].toString()]
                "
                class="base-font-title"
              >
                {{
                  tokensBalanceSto[currentPair[1][0].token0[0].toString()]
                    | bigintToFloat(
                      4,
                      tokens[currentPair[1][0].token0[0].toString()].decimals
                    )
                    | formatNum
                }}
              </span>
              <a-icon
                style="margin-left: 5px"
                type="plus-circle"
                @click="gridTransferToken(true)"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="transfer-pro-wallet-main" style="margin-bottom: 0">
            <a-tooltip placement="top">
              <template slot="title">
                Deposit {{ currentPair[1][0].token1[1] }}
              </template>
              <a-icon
                class="transfer-pro-wallet-down transfer-pro-wallet pc-show"
                type="arrow-down"
                @click="gridDepositKeepingBalance(false)"
              />
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                Deposit {{ currentPair[1][0].token0[1] }}
              </template>
              <a-icon
                class="transfer-pro-wallet-down transfer-pro-wallet pc-show"
                type="arrow-down"
                style="padding-left: 40px"
                @click="gridDepositKeepingBalance(true)"
              />
            </a-tooltip>
            <a-icon
              class="transfer-pro-wallet-down transfer-pro-wallet h5-show"
              type="arrow-down"
            />
          </div>
        </div>
        <div class="pro-order-item">
          <div class="base-font-title">
            2. Deposit tokens from Pro-wallet to Pro-TraderAcct (Trading pair's
            account for pro-trader)
          </div>
          <div class="mt20" style="color: #adb3c4">Pro-TraderAcct:</div>
          <div class="transfer-pro-wallet-main">
            <div class="transfer-pro-wallet">
              <span>{{ currentPair[1][0].token1[1] }}:&nbsp;</span>
              <span
                v-if="
                  keepingBalanceSto &&
                  currentPair &&
                  tokens[currentPair[1][0].token1[0].toString()]
                "
                class="base-font-title"
                >{{
                  keepingBalanceSto[currentPair[1][0].token1[0].toString()]
                    | bigintToFloat(
                      4,
                      tokens[currentPair[1][0].token1[0].toString()].decimals
                    )
                    | formatNum
                }}</span
              >
              <a-tooltip placement="top">
                <template slot="title">
                  Deposit {{ currentPair[1][0].token1[1] }}
                </template>
                <a-icon
                  style="margin-left: 5px"
                  type="plus-circle"
                  @click="gridDepositKeepingBalance(false)"
                />
              </a-tooltip>
            </div>
            <div class="transfer-pro-wallet">
              <span>{{ currentPair[1][0].token0[1] }}:&nbsp;</span>
              <span
                v-if="
                  keepingBalanceSto &&
                  currentPair &&
                  tokens[currentPair[1][0].token0[0].toString()]
                "
                class="base-font-title"
              >
                {{
                  keepingBalanceSto[currentPair[1][0].token0[0].toString()]
                    | bigintToFloat(
                      4,
                      tokens[currentPair[1][0].token0[0].toString()].decimals
                    )
                    | formatNum
                }}
              </span>
              <a-tooltip placement="top">
                <template slot="title">
                  Deposit {{ currentPair[1][0].token0[1] }}
                </template>
                <a-icon
                  style="margin-left: 5px"
                  type="plus-circle"
                  @click="gridDepositKeepingBalance(true)"
                />
              </a-tooltip>
            </div>
          </div>
        </div>
        <div class="w100" style="display: flex; margin-top: 40px">
          <button class="margin-left-auto" @click="step = 2">Next</button>
        </div>
      </div>
      <div v-show="step === 2" class="grid-setting">
        <span v-show="type === 'create'" style="color: #eaecef; font-size: 15px"
          >3. Create a {{ proType }} Order
          <a-tooltip placement="top">
            <template slot="title">
              Iceberg order will split the order into several orders, only after
              the current one is completed, the next one will be placed. The
              amount of the last iceberg will be the remainder of (Order Amount
              / Iceberg Amount). Iceberg orders follow regular trading rules,
              including the minimum order size, trading fee rates, etc.
            </template>
            <a-icon
              type="info-circle"
              v-if="proType === 'Iceberg'"
            /> </a-tooltip
        ></span>
        <div v-show="proType === 'Grid'">
          <div class="grid-setting-item">
            <div class="grid-setting-item-title base-font-title">
              Grid Price Range:
            </div>
            <div class="grid-setting-price-range">
              <div>
                <a-input
                  :key="buyUnit"
                  v-model="lower"
                  class="input-icp-suffix"
                  autocomplete="off"
                  type="text"
                  placeholder="Lower Limit"
                  v-only-float="buyUnit"
                />
              </div>
              &nbsp;-&nbsp;
              <div>
                <a-input
                  :key="buyUnit"
                  v-model="upper"
                  class="input-icp-suffix"
                  autocomplete="off"
                  type="text"
                  placeholder="Upper Limit"
                  v-only-float="buyUnit"
                />
              </div>
            </div>
            <span
              v-show="lowerPriceWarning && !insufficientPrice"
              class="base-warning"
            >
              Lower limit is higher than the current price({{
                currentTokenPrice
              }}), buy orders will not be triggered.
            </span>
            <span
              v-show="
                upperPriceWarning && !lowerPriceWarning && !insufficientPrice
              "
              class="base-warning"
            >
              Upper limit is lower than the current price({{
                currentTokenPrice
              }}), sell orders will not be triggered.
            </span>
            <span v-show="insufficientPrice" class="base-red">
              Upper limit should be greater than lower limit.
            </span>
          </div>
          <div class="grid-setting-item">
            <div class="grid-setting-item-title base-font-title">
              <a-tooltip placement="top">
                <template slot="title">
                  Spread between two grid prices.
                </template>
                Grid spread: <a-icon type="info-circle" />
              </a-tooltip>
              <a-dropdown placement="bottomCenter">
                <a-tooltip placement="top">
                  <template slot="title">
                    <div v-show="spread === gridMenu.Arithmetic">
                      Arithmetic: Each grid has an equal price difference.
                    </div>
                    <div v-show="spread === gridMenu.Geometric">
                      Geometric: Each grid has an ratio price difference.
                    </div>
                  </template>
                  <span class="pointer margin-left-auto" style="color: #51b7c3">
                    {{ spread }} <a-icon type="caret-down" />
                  </span>
                </a-tooltip>
                <a-menu slot="overlay" class="strat-list">
                  <a-menu-item
                    v-for="(item, index) in gridMenu"
                    :key="index"
                    class="strat-list-item"
                    :class="{ active: item === spread }"
                    @click="changeSpread(item)"
                  >
                    {{ item }}
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <div v-show="spread === gridMenu.Arithmetic">
              <a-input
                v-if="currentPair"
                :key="buyUnit"
                v-model="arithmetic"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Arithmetic"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1] + '(price spread)'"
              />
              <span
                v-show="
                  arithmetic &&
                  currentTokenPrice10 &&
                  Number(arithmetic) > Number(currentTokenPrice10)
                "
                class="base-warning"
              >
                The spread greater than {{ currentTokenPrice10 }} of the current
                price may make it difficult for the strategy to be triggered.
              </span>
              <span
                v-show="
                  arithmetic &&
                  currentTokenPriceLower &&
                  Number(arithmetic) <= Number(currentTokenPriceLower)
                "
                class="base-red"
              >
                The spread should be greater than {{ currentTokenPriceLower }}.
              </span>
            </div>
            <div v-show="spread === gridMenu.Geometric">
              <a-input
                v-model="geometric"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Geometric"
                v-only-float="3"
                suffix="%"
              />
              <span
                v-show="geometric && Number(geometric) >= 10"
                class="base-warning"
              >
                The spread greater than 10% of the current price({{
                  currentTokenPrice
                }}) may make it difficult for the strategy to be triggered.
              </span>
              <span
                v-show="geometric && Number(geometric) <= 0.1"
                class="base-red"
              >
                The spread should be greater than 0.1%.
              </span>
              <div class="base-font base-tip-size">
                Suggestions:
                <p>
                  1, Low volatility, high liquidity trading pairs (such as
                  USDT/USDC): it is recommended to set 0.1% ~ 1.0%.
                </p>
                <p>
                  2, High liquidity trading pairs: it is recommended to set 1.0%
                  ~ 2.0%.
                </p>
                <p>
                  3, Medium liquidity trading pairs: it is recommended to set
                  2.0% ~ 5.0%.
                </p>
                <p>
                  4, Low liquidity trading pairs: it is recommended to set 5.0%
                  ~ 10.0%.
                </p>
              </div>
            </div>
          </div>
          <div class="grid-setting-item">
            <div class="grid-setting-item-title base-font-title">
              <a-tooltip placement="top">
                <template slot="title">
                  <span
                    v-if="currentPair && investment === gridAmountMenu.Token0"
                  >
                    The quantity ({{ currentPair[1][0].token0[1] }}) of each
                    order placed when the strategy is triggered.
                  </span>
                  <span
                    v-if="currentPair && investment === gridAmountMenu.Token1"
                  >
                    The amount ({{ currentPair[1][0].token1[1] }}) of each order
                    placed when the strategy is triggered.
                  </span>
                  <span
                    v-if="currentPair && investment === gridAmountMenu.Percent"
                  >
                    Percentage of available funds remaining.
                  </span>
                </template>
                Grid amount: <a-icon type="info-circle" />
              </a-tooltip>
              <a-dropdown placement="bottomCenter">
                <span class="pointer margin-left-auto" style="color: #51b7c3">
                  <span v-show="investment === gridAmountMenu.Percent">
                    {{ investment }}
                  </span>
                  <span
                    v-if="currentPair && investment === gridAmountMenu.Token0"
                  >
                    {{ currentPair[1][0].token0[1] }}
                  </span>
                  <span
                    v-if="currentPair && investment === gridAmountMenu.Token1"
                  >
                    {{ currentPair[1][0].token1[1] }}
                  </span>
                  <a-icon type="caret-down"
                /></span>
                <a-menu slot="overlay" class="strat-list">
                  <a-menu-item
                    v-for="(item, index) in gridAmountMenu"
                    :key="index"
                    class="strat-list-item"
                    :class="{ active: item === investment }"
                    @click="changeInvestment(item)"
                  >
                    <span v-show="item === gridAmountMenu.Percent">
                      {{ item }}
                    </span>
                    <span v-if="currentPair && item === gridAmountMenu.Token0">
                      {{ currentPair[1][0].token0[1] }}
                    </span>
                    <span v-if="currentPair && item === gridAmountMenu.Token1">
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <div v-show="investment === gridAmountMenu.Percent">
              <a-input
                v-model="percent"
                autocomplete="off"
                placeholder="Percent (optional)"
                suffix="%"
                v-only-float="3"
              />
              <span v-show="percent && Number(percent) <= 0.1" class="base-red">
                The amount should be greater than 0.1%.
              </span>
              <span v-show="percent && Number(percent) >= 100" class="base-red">
                The percentage entered must be less than 100%.
              </span>
              <span
                v-show="
                  percent && Number(percent) > 20 && Number(percent) < 100
                "
                class="base-warning"
              >
                The amount should be lower than 20%.
              </span>
            </div>
            <div v-show="investment === gridAmountMenu.Token0">
              <a-input
                v-if="currentPair"
                :key="tokenMinUnit"
                v-model="amount"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Amount"
                v-only-float="tokenMinUnit"
                :suffix="currentPair[1][0].token0[1]"
              />
              <span
                v-show="amount && Number(amount) < Number(unit10) && isModulo"
                class="base-red"
              >
                The amount should be greater than {{ unit10 }}
                {{ currentPair[1][0].token0[1] }}.
              </span>
              <span
                v-if="
                  amount &&
                  Number(amount) >= Number(unit10) &&
                  !isModulo(amount) &&
                  currentPair &&
                  tokens &&
                  tokens[currentPair[1][0].token0[0].toString()]
                "
                class="base-red"
              >
                The amount must should an integral multiple of
                {{
                  unit
                    | bigintToFloat(
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokens[currentPair[1][0].token0[0].toString()].decimals
                    )
                }}.
              </span>
            </div>
            <div v-show="investment === gridAmountMenu.Token1">
              <a-input
                v-if="currentPair"
                :key="buyUnit"
                v-model="amount"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Amount"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1]"
              />
              <span
                v-show="amount && Number(amount) < Number(unit10Token1)"
                class="base-red"
              >
                The amount should be greater than {{ unit10Token1 }}
                {{ currentPair[1][0].token1[1] }}.
              </span>
            </div>
          </div>
        </div>
        <div v-show="proType === 'Iceberg'">
          <div class="trade-h5-header">
            <ul>
              <li
                @click="changeTradeType('Buy')"
                :class="{
                  'trade-buy': tradeType === 'Buy',
                  disabled: type === 'update'
                }"
              >
                <span>Buy</span>
              </li>
              <li
                @click="changeTradeType('Sell')"
                :class="{
                  'trade-sell': tradeType === 'Sell',
                  disabled: type === 'update'
                }"
              >
                <span>Sell</span>
              </li>
            </ul>
          </div>
          <a-form-model
            class="ice-form mt20"
            ref="iceForm"
            :model="iceForm"
            :rules="iceFormRules"
          >
            <a-form-model-item
              class="ice-setting-item"
              label="Period"
              prop="time"
            >
              <a-range-picker
                :disabled-date="disabledDate"
                show-time
                :showToday="false"
                v-model="iceForm.time"
                :placeholder="['Select start time', 'Select end time']"
              >
              </a-range-picker>
            </a-form-model-item>
            <a-form-model-item
              class="ice-setting-item"
              label="LMT price"
              prop="limitPrice"
            >
              <a-input
                v-if="currentPair"
                :key="buyUnit"
                v-model="iceForm.limitPrice"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="LMT price"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1]"
                @input="limitPriceChange"
              />
              <span
                v-show="
                  iceForm.limitPrice &&
                  tradeType === 'Buy' &&
                  Number(iceForm.limitPrice) >= Number(currentTokenPrice)
                "
                class="base-warning line22"
              >
                The price should be lower than the current price({{
                  currentTokenPrice
                }}).
              </span>
              <span
                v-show="
                  iceForm.limitPrice &&
                  tradeType === 'Sell' &&
                  Number(iceForm.limitPrice) <= Number(currentTokenPrice)
                "
                class="base-warning line22"
              >
                The price should be higher than the current price({{
                  currentTokenPrice
                }}).
              </span>
            </a-form-model-item>
            <a-form-model-item
              class="ice-setting-item"
              :label="`Total amount of ${currentPair[1][0].token0[1]}`"
              prop="totalQuantity"
            >
              <a-input
                v-if="currentPair"
                :key="tokenMinUnit"
                v-model="iceForm.totalQuantity"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                :placeholder="`Total amount of ${currentPair[1][0].token0[1]}`"
                v-only-float="tokenMinUnit"
                :suffix="currentPair[1][0].token0[1]"
                @input="totalQuantityChange"
              />
            </a-form-model-item>
            <a-form-model-item
              class="ice-setting-item"
              :label="`Total amount of ${currentPair[1][0].token1[1]}`"
            >
              <a-input
                v-if="
                  currentPair &&
                  tokens &&
                  tokens[currentPair[1][0].token1[0].toString()]
                "
                :key="buyUnit"
                v-model="iceForm.total"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                :placeholder="`Total amount of ${currentPair[1][0].token1[1]}`"
                v-only-float="
                  tokens[currentPair[1][0].token1[0].toString()].decimals
                "
                :suffix="currentPair[1][0].token1[1]"
                @input="totalChange"
              />
            </a-form-model-item>
            <a-form-model-item
              class="ice-setting-item"
              :label="`Amount of ${currentPair[1][0].token0[1]} per order`"
              prop="quantityPerOrder"
            >
              <a-input
                v-if="currentPair"
                :key="tokenMinUnit"
                v-model="iceForm.quantityPerOrder"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                :placeholder="`Amount of ${currentPair[1][0].token0[1]} per order`"
                v-only-float="tokenMinUnit"
                :suffix="currentPair[1][0].token0[1]"
              />
            </a-form-model-item>
          </a-form-model>
        </div>
        <div v-show="proType === 'TWAP'">
          <div class="trade-h5-header">
            <ul>
              <li
                @click="changeTradeType('Buy')"
                :class="{
                  'trade-buy': tradeType === 'Buy',
                  disabled: type === 'update'
                }"
              >
                <span>Buy</span>
              </li>
              <li
                @click="changeTradeType('Sell')"
                :class="{
                  'trade-sell': tradeType === 'Sell',
                  disabled: type === 'update'
                }"
              >
                <span>Sell</span>
              </li>
            </ul>
          </div>
          <a-form-model
            class="ice-form mt20"
            ref="TWAPForm"
            :model="TWAPForm"
            :rules="TWAPFormRules"
          >
            <a-form-model-item
              class="ice-setting-item"
              label="Period"
              prop="time"
            >
              <a-range-picker
                :disabled-date="disabledDate"
                show-time
                :showToday="false"
                v-model="TWAPForm.time"
                :placeholder="['Select start time', 'Select end time']"
              >
              </a-range-picker>
            </a-form-model-item>
            <a-form-model-item
              :colon="false"
              class="ice-setting-item"
              prop="priceLimit"
            >
              <template slot="label">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span v-show="tradeType === 'Buy'"
                      >The highest price you would accept.</span
                    >
                    <span v-show="tradeType === 'Sell'"
                      >The lowest price you would accept.</span
                    >
                  </template>
                  <span> Price limit: <a-icon type="info-circle" /> </span>
                </a-tooltip>
              </template>
              <a-input
                v-if="currentPair"
                :key="buyUnit"
                v-model="TWAPForm.priceLimit"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Price limit"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1]"
              />
              <span
                class="base-warning line22"
                v-show="
                  tradeType === 'Buy' &&
                  TWAPForm.priceLimit &&
                  Number(TWAPForm.priceLimit) < Number(currentTokenPrice)
                "
              >
                The price is lower than the current price({{
                  currentTokenPrice
                }}) and the strategy may not be triggered.
              </span>
              <span
                class="base-warning line22"
                v-show="
                  tradeType === 'Sell' &&
                  TWAPForm.priceLimit &&
                  Number(TWAPForm.priceLimit) > Number(currentTokenPrice)
                "
              >
                The price is higher than the current price({{
                  currentTokenPrice
                }}) and the strategy may not be triggered.
              </span>
            </a-form-model-item>
            <a-form-model-item
              :colon="false"
              class="ice-setting-item"
              prop="priceSpread"
            >
              <template slot="label">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span
                      >When a strategy triggers an order to be placed, you are
                      willing to take on additional trading slippage in order to
                      increase the probability of a close.</span
                    >
                  </template>
                  <span>Slippage: <a-icon type="info-circle" /> </span>
                </a-tooltip>
              </template>
              <a-input
                v-if="currentPair"
                :key="buyUnit"
                v-model="TWAPForm.priceSpread"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Slippage"
                v-only-float="buyUnit"
                :suffix="`${currentPair[1][0].token1[1]}(price spread)`"
              />
            </a-form-model-item>
            <a-form-model-item
              :colon="false"
              class="ice-setting-item ice-setting-item-trigger"
              prop="totalQuantity"
            >
              <template class="w100 flex-center" slot="label">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span v-show="tradeType === 'Buy'"
                      >The total amount of
                      {{
                        TWAPTokenLimit === tokenEnum.Token0
                          ? currentPair[1][0].token0[1]
                          : currentPair[1][0].token1[1]
                      }}
                      you wish to purchase.</span
                    >
                    <span v-show="tradeType === 'Sell'"
                      >The total amount of
                      {{
                        TWAPTokenLimit === tokenEnum.Token0
                          ? currentPair[1][0].token0[1]
                          : currentPair[1][0].token1[1]
                      }}
                      you wish to sell.</span
                    >
                  </template>
                  <span>Total amount: <a-icon type="info-circle" /></span>
                </a-tooltip>
                <a-dropdown placement="bottomCenter">
                  <span class="pointer margin-left-auto" style="color: #51b7c3">
                    <span
                      v-if="currentPair && TWAPTokenLimit === tokenEnum.Token0"
                    >
                      {{ currentPair[1][0].token0[1] }}
                    </span>
                    <span
                      v-if="currentPair && TWAPTokenLimit === tokenEnum.Token1"
                    >
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                    <a-icon type="caret-down"
                  /></span>
                  <a-menu slot="overlay" class="strat-list">
                    <a-menu-item
                      v-for="(item, index) in tokenEnum"
                      :key="index"
                      class="strat-list-item"
                      :class="{ active: item === TWAPTokenLimit }"
                      @click="changeTWAPTokenLimit(item)"
                    >
                      <span v-if="currentPair && item === tokenEnum.Token0">
                        {{ currentPair[1][0].token0[1] }}
                      </span>
                      <span v-if="currentPair && item === tokenEnum.Token1">
                        {{ currentPair[1][0].token1[1] }}
                      </span>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              <a-input
                v-if="currentPair && TWAPTokenLimit === tokenEnum.Token0"
                :key="tokenMinUnit"
                v-model="TWAPForm.totalQuantity"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Total amount"
                v-only-float="tokenMinUnit"
                :suffix="currentPair[1][0].token0[1]"
              />
              <a-input
                v-if="currentPair && TWAPTokenLimit === tokenEnum.Token1"
                :key="buyUnit"
                v-model="TWAPForm.totalQuantity"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Total amount"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1]"
              />
            </a-form-model-item>
            <a-form-model-item
              :colon="false"
              class="ice-setting-item ice-setting-item-trigger"
              prop="quantityPerOrder"
            >
              <template class="w100 flex-center" slot="label">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span
                      >The amount({{
                        TWAPTokenLimit === tokenEnum.Token0
                          ? currentPair[1][0].token0[1]
                          : currentPair[1][0].token1[1]
                      }}) of the order placed each time the strategy is
                      triggered.</span
                    >
                  </template>
                  <span>Quantity per order: <a-icon type="info-circle" /></span>
                </a-tooltip>
                <a-dropdown placement="bottomCenter">
                  <span class="pointer margin-left-auto" style="color: #51b7c3">
                    <span
                      v-if="currentPair && TWAPTokenLimit === tokenEnum.Token0"
                    >
                      {{ currentPair[1][0].token0[1] }}
                    </span>
                    <span
                      v-if="currentPair && TWAPTokenLimit === tokenEnum.Token1"
                    >
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                    <a-icon type="caret-down"
                  /></span>
                  <a-menu slot="overlay" class="strat-list">
                    <a-menu-item
                      v-for="(item, index) in tokenEnum"
                      :key="index"
                      class="strat-list-item"
                      :class="{ active: item === TWAPTokenLimit }"
                      @click="changeTWAPTokenLimit(item)"
                    >
                      <span v-if="currentPair && item === tokenEnum.Token0">
                        {{ currentPair[1][0].token0[1] }}
                      </span>
                      <span v-if="currentPair && item === tokenEnum.Token1">
                        {{ currentPair[1][0].token1[1] }}
                      </span>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              <a-input
                v-if="currentPair && TWAPTokenLimit === tokenEnum.Token0"
                :key="tokenMinUnit"
                v-model="TWAPForm.quantityPerOrder"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Total amount"
                v-only-float="tokenMinUnit"
                :suffix="currentPair[1][0].token0[1]"
              />
              <a-input
                v-if="currentPair && TWAPTokenLimit === tokenEnum.Token1"
                :key="buyUnit"
                v-model="TWAPForm.quantityPerOrder"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Total amount"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1]"
              />
            </a-form-model-item>
            <a-form-model-item
              :colon="false"
              class="
                ice-setting-item
                ice-setting-item-suffix
                ice-setting-item-trigger
              "
              prop="timeInterval"
              ref="timeInterval"
              :autoLink="false"
            >
              <template class="w100" slot="label">
                <div class="flex-center">
                  <a-tooltip placement="top">
                    <template slot="title">
                      At least how many intervals (seconds) between triggers
                      (strategies may not be triggered when they are busy or
                      when there are no deals)
                    </template>
                    <span
                      >Interval (seconds) for trigger:
                      <a-icon type="info-circle"
                    /></span>
                  </a-tooltip>
                </div>
              </template>
              <div class="time-Label">
                <div
                  v-for="(item, index) in timeIntervalList"
                  :key="index"
                  @click="setTimeInterval(item.time)"
                >
                  <button>{{ item.value }}</button>
                </div>
              </div>
              <a-input
                v-if="currentPair"
                v-model="TWAPForm.timeInterval"
                class="input-icp-suffix"
                autocomplete="off"
                placeholder="Interval (seconds) for trigger"
                v-only-number
                @blur="
                  () => {
                    $refs.timeInterval.onFieldBlur();
                  }
                "
                @change="
                  () => {
                    $refs.timeInterval.onFieldChange();
                  }
                "
              />
              <span class="suffix"> Seconds </span>
              <div
                v-show="
                  TWAPForm.timeInterval &&
                  Number(TWAPForm.timeInterval) < 900 &&
                  Number(TWAPForm.timeInterval) > 60
                "
                class="base-warning line22"
              >
                To conserve on-chain resources, policies with intervals of less
                than 900 seconds are not necessarily triggered in a timely
                manner.
              </div>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div v-show="proType === 'VWAP'">
          <div class="trade-h5-header">
            <ul>
              <li
                @click="changeTradeType('Buy')"
                :class="{
                  'trade-buy': tradeType === 'Buy',
                  disabled: type === 'update'
                }"
              >
                <span>Buy</span>
              </li>
              <li
                @click="changeTradeType('Sell')"
                :class="{
                  'trade-sell': tradeType === 'Sell',
                  disabled: type === 'update'
                }"
              >
                <span>Sell</span>
              </li>
            </ul>
          </div>
          <a-form-model
            class="ice-form mt20"
            ref="VWAPForm"
            :model="VWAPForm"
            :rules="VWAPFormRules"
          >
            <a-form-model-item
              class="ice-setting-item"
              label="Period"
              prop="time"
            >
              <a-range-picker
                :disabled-date="disabledDate"
                show-time
                :showToday="false"
                v-model="VWAPForm.time"
                :placeholder="['Select start time', 'Select end time']"
              >
              </a-range-picker>
            </a-form-model-item>
            <a-form-model-item
              :colon="false"
              class="ice-setting-item"
              prop="priceLimit"
            >
              <template slot="label">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span v-show="tradeType === 'Buy'"
                      >The highest price you would accept.</span
                    >
                    <span v-show="tradeType === 'Sell'"
                      >The lowest price you would accept.</span
                    >
                  </template>
                  <span> Price limit: <a-icon type="info-circle" /> </span>
                </a-tooltip>
              </template>
              <a-input
                v-if="currentPair"
                :key="buyUnit"
                v-model="VWAPForm.priceLimit"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Price limit"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1]"
              />
              <span
                class="base-warning line22"
                v-show="
                  tradeType === 'Buy' &&
                  VWAPForm.priceLimit &&
                  Number(VWAPForm.priceLimit) < Number(currentTokenPrice)
                "
              >
                The price is lower than the current price({{
                  currentTokenPrice
                }}) and the strategy may not be triggered.
              </span>
              <span
                class="base-warning line22"
                v-show="
                  tradeType === 'Sell' &&
                  VWAPForm.priceLimit &&
                  Number(VWAPForm.priceLimit) > Number(currentTokenPrice)
                "
              >
                The price is higher than the current price({{
                  currentTokenPrice
                }}) and the strategy may not be triggered.
              </span>
            </a-form-model-item>
            <a-form-model-item
              :colon="false"
              class="ice-setting-item"
              prop="priceSpread"
            >
              <template slot="label">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span
                      >When a strategy triggers an order to be placed, you are
                      willing to take on additional trading slippage in order to
                      increase the probability of a close.</span
                    >
                  </template>
                  <span>Slippage: <a-icon type="info-circle" /> </span>
                </a-tooltip>
              </template>
              <a-input
                v-if="currentPair"
                :key="buyUnit"
                v-model="VWAPForm.priceSpread"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Slippage"
                v-only-float="buyUnit"
                :suffix="`${currentPair[1][0].token1[1]}(price spread)`"
              />
            </a-form-model-item>
            <a-form-model-item
              :colon="false"
              class="ice-setting-item ice-setting-item-trigger"
              prop="totalQuantity"
            >
              <template class="w100 flex-center" slot="label">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span v-show="tradeType === 'Buy'"
                      >The total amount of
                      {{
                        TWAPTokenLimit === tokenEnum.Token0
                          ? currentPair[1][0].token0[1]
                          : currentPair[1][0].token1[1]
                      }}
                      you wish to purchase.</span
                    >
                    <span v-show="tradeType === 'Sell'"
                      >The total amount of
                      {{
                        TWAPTokenLimit === tokenEnum.Token0
                          ? currentPair[1][0].token0[1]
                          : currentPair[1][0].token1[1]
                      }}
                      you wish to sell.</span
                    >
                  </template>
                  <span>Total amount: <a-icon type="info-circle" /></span>
                </a-tooltip>
                <a-dropdown placement="bottomCenter">
                  <span class="pointer margin-left-auto" style="color: #51b7c3">
                    <span
                      v-if="currentPair && TWAPTokenLimit === tokenEnum.Token0"
                    >
                      {{ currentPair[1][0].token0[1] }}
                    </span>
                    <span
                      v-if="currentPair && TWAPTokenLimit === tokenEnum.Token1"
                    >
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                    <a-icon type="caret-down"
                  /></span>
                  <a-menu slot="overlay" class="strat-list">
                    <a-menu-item
                      v-for="(item, index) in tokenEnum"
                      :key="index"
                      class="strat-list-item"
                      :class="{ active: item === TWAPTokenLimit }"
                      @click="changeVWAPTokenLimit(item)"
                    >
                      <span v-if="currentPair && item === tokenEnum.Token0">
                        {{ currentPair[1][0].token0[1] }}
                      </span>
                      <span v-if="currentPair && item === tokenEnum.Token1">
                        {{ currentPair[1][0].token1[1] }}
                      </span>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              <a-input
                v-if="currentPair && TWAPTokenLimit === tokenEnum.Token0"
                :key="tokenMinUnit"
                v-model="VWAPForm.totalQuantity"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Total amount"
                v-only-float="tokenMinUnit"
                :suffix="currentPair[1][0].token0[1]"
              />
              <a-input
                v-if="currentPair && TWAPTokenLimit === tokenEnum.Token1"
                :key="buyUnit"
                v-model="VWAPForm.totalQuantity"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Total amount"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1]"
              />
            </a-form-model-item>
            <a-form-model-item
              :colon="false"
              class="ice-setting-item ice-setting-item-trigger"
              prop="quantityPerOrder"
            >
              <template class="w100 flex-center" slot="label">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span
                      >The amount({{
                        TWAPTokenLimit === tokenEnum.Token0
                          ? currentPair[1][0].token0[1]
                          : currentPair[1][0].token1[1]
                      }}) of the order placed each time the strategy is
                      triggered.</span
                    >
                  </template>
                  <span>Quantity per order: <a-icon type="info-circle" /></span>
                </a-tooltip>
                <a-dropdown placement="bottomCenter">
                  <span class="pointer margin-left-auto" style="color: #51b7c3">
                    <span
                      v-if="currentPair && TWAPTokenLimit === tokenEnum.Token0"
                    >
                      {{ currentPair[1][0].token0[1] }}
                    </span>
                    <span
                      v-if="currentPair && TWAPTokenLimit === tokenEnum.Token1"
                    >
                      {{ currentPair[1][0].token1[1] }}
                    </span>
                    <a-icon type="caret-down"
                  /></span>
                  <a-menu slot="overlay" class="strat-list">
                    <a-menu-item
                      v-for="(item, index) in tokenEnum"
                      :key="index"
                      class="strat-list-item"
                      :class="{ active: item === TWAPTokenLimit }"
                      @click="changeTWAPTokenLimit(item)"
                    >
                      <span v-if="currentPair && item === tokenEnum.Token0">
                        {{ currentPair[1][0].token0[1] }}
                      </span>
                      <span v-if="currentPair && item === tokenEnum.Token1">
                        {{ currentPair[1][0].token1[1] }}
                      </span>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              <a-input
                v-if="currentPair && TWAPTokenLimit === tokenEnum.Token0"
                :key="tokenMinUnit"
                v-model="VWAPForm.quantityPerOrder"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Total amount"
                v-only-float="tokenMinUnit"
                :suffix="currentPair[1][0].token0[1]"
              />
              <a-input
                v-if="currentPair && TWAPTokenLimit === tokenEnum.Token1"
                :key="buyUnit"
                v-model="VWAPForm.quantityPerOrder"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Total amount"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1]"
              />
            </a-form-model-item>
            <a-form-model-item
              :colon="false"
              class="ice-setting-item ice-setting-item-trigger"
              prop="volume"
            >
              <div class="flex-center" slot="label">
                <a-tooltip placement="top">
                  <template slot="title">
                    Triggered once for each specified volume generated.
                  </template>
                  <span>Volume for trigger: <a-icon type="info-circle" /></span>
                </a-tooltip>
                <a-dropdown placement="bottomCenter">
                  <span class="pointer margin-left-auto" style="color: #51b7c3">
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span v-show="spread === gridMenu.Geometric">
                          The strategy will be triggered for every percentage of
                          volume generated by the trading pair over the previous
                          24 hours.
                        </span>
                        <span v-show="spread === gridMenu.Arithmetic">
                          The strategy will be triggered for every specified
                          amount of {{ currentPair[1][0].token1[1] }} volume
                          generated by the trading pair.
                        </span>
                      </template>
                      {{ spread }} <a-icon type="caret-down" />
                    </a-tooltip>
                  </span>
                  <a-menu slot="overlay" class="strat-list">
                    <a-menu-item
                      v-for="(item, index) in gridMenu"
                      :key="index"
                      class="strat-list-item"
                      :class="{ active: item === spread }"
                      @click="changeSpreadVWAP(item)"
                    >
                      {{ item }}
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
              <a-input
                v-if="currentPair && spread === gridMenu.Arithmetic"
                :key="buyUnit"
                v-model="VWAPForm.volume"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Volume for trigger"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1]"
              />
              <a-input
                v-if="currentPair && spread === gridMenu.Geometric"
                v-model="VWAPForm.volume"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Volume for trigger"
                v-only-float="3"
                suffix="%"
              />
            </a-form-model-item>
          </a-form-model>
        </div>
        <div
          class="trade-item-pro-fee"
          v-if="
            stoConfig &&
            currentPair &&
            tokens &&
            sysConfig &&
            tokens[sysConfig.sysToken.toString()] &&
            dexRole
          "
        >
          <span style="font-weight: bold">Fee:</span>
          (Create)
          <span v-show="dexRole.vipMaker">0</span>
          <span v-show="!dexRole.vipMaker">
            {{
              stoConfig.poFee1
                | bigintToFloat(
                  tokens[sysConfig.sysToken.toString()].decimals,
                  tokens[sysConfig.sysToken.toString()].decimals
                )
            }}
          </span>
          {{ tokens[sysConfig.sysToken.toString()].symbol }}, (Update)
          <span v-show="dexRole.vipMaker">0</span>
          <span v-show="!dexRole.vipMaker">
            {{
              stoConfig.poFee1
                | stoUpdateFee(tokens[sysConfig.sysToken.toString()].decimals)
            }}
          </span>
          {{ tokens[sysConfig.sysToken.toString()].symbol }}, (Order) taker
          {{ currentPair | filterFee }} + {{ stoConfig.sloFee2 | stoOrderFee }};
          maker {{ feeRebate | filterFeeSellRebate }} +
          {{ stoConfig.sloFee2 | stoOrderFee }}.
        </div>
        <button
          v-show="proType === 'Grid'"
          type="button"
          class="primary large-primary w100"
          :disabled="canSubmit"
          @click="onSubmit"
        >
          Submit
        </button>
        <button
          v-show="proType === 'Iceberg'"
          type="button"
          class="primary large-primary w100"
          @click="onSubmitIce"
        >
          Submit
        </button>
        <button
          v-show="proType === 'TWAP'"
          type="button"
          class="primary large-primary w100"
          @click="onSubmitTWAP"
        >
          Submit
        </button>
        <button
          v-show="proType === 'VWAP'"
          type="button"
          class="primary large-primary w100"
          @click="onSubmitVWAP"
        >
          Submit
        </button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  DePairs,
  GridAmountEnum,
  GridAmountMenu,
  GridModeEnum,
  GridModeMenu,
  ProOrderMenu,
  TokenEnum
} from '@/views/home/ICDex/model';
import { TokenInfo } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';
import {
  AccountSetting,
  DexRole,
  GridOrder,
  GridOrderConfig,
  GridOrderConfigAmount,
  GridOrderConfigUpdate,
  IcebergOrder,
  IcebergOrderConfig,
  OrderSide,
  Ppm,
  STOrder,
  StoSetting,
  STStatus,
  TWAP,
  TWAPSetting,
  VWAP,
  VWAPSetting
} from '@/ic/ICDex/model';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { toHttpRejectError } from '@/ic/httpError';
import {
  formatDateToSecond,
  fromSubAccountId,
  principalToAccountIdentifier
} from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import moment from 'moment';
import { checkAuth } from '@/ic/CheckAuth';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { getFee } from '@/ic/getTokenFee';
import { SysConfig } from '@/ic/ICDexRouter/model';
import { getTokenBalance } from '@/ic/getTokenBalance';

const ProSubaccountId = 1;

@Component({
  name: 'proOrder',
  components: {},
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
  @Prop({ type: Array, default: () => [] })
  private currentPair!: DePairs;
  @Prop({ type: Object, default: () => null })
  private keepingBalance!: { [key: string]: string };
  @Prop({ type: BigInt, default: BigInt(0) })
  private unit!: bigint;
  @Prop({ type: Number, default: 0 })
  private buyUnit!: number;
  @Prop({ type: Number, default: 0 })
  private tokenMinUnit!: number;
  @Prop({ type: Object, default: () => null })
  private tokens!: { [key: string]: TokenInfo };
  @Prop({ type: Object, default: () => null })
  private keepingBalanceSto!: { [key: string]: string };
  @Prop({ type: Object, default: () => null })
  private tokensBalanceSto!: { [key: string]: string };
  @Prop({ type: Object, default: () => null })
  private stoConfig!: StoSetting;
  @Prop({ type: Object, default: () => null })
  private sysConfig!: SysConfig;
  @Prop({ type: String, default: () => '' })
  private currentTokenPrice!: string;
  @Prop({ type: Object, default: () => null })
  private dexRole!: DexRole;
  @Prop({ type: String, default: () => '' })
  private feeRebate!: string;

  private type = 'create';
  private soid: bigint;
  private status: STStatus;
  private visibleProOrder = false;
  private title = 'Create a order';
  private lower = '';
  private upper = '';
  private gridMenu = GridModeEnum;
  private spread: GridModeMenu = GridModeEnum.Arithmetic;
  private gridAmountMenu = GridAmountEnum;
  private investment: GridAmountMenu = GridAmountEnum.Token0;
  private percent = '';
  private amount = '';
  private arithmetic = '';
  private geometric = '';
  private step = 1;
  private tradeType = 'Buy';
  private proType: ProOrderMenu = null;
  private tokenEnum = TokenEnum;
  private TWAPTokenLimit: TokenEnum = TokenEnum.Token0;
  private VWAPForm = {
    time: null,
    priceLimit: '',
    priceSpread: '',
    totalQuantity: '',
    quantityPerOrder: '',
    volume: ''
  };
  private VWAPFormRules = {
    time: [
      {
        required: true,
        message: 'Please select time',
        trigger: 'change'
      },
      { validator: this.validateTime, trigger: 'change' }
    ],
    priceLimit: [
      { required: true, message: 'Please enter price limit', trigger: 'change' }
    ],
    priceSpread: [
      {
        required: true,
        message: 'Please enter slippage',
        trigger: 'change'
      },
      { validator: this.validateSlippage, trigger: 'change' }
    ],
    totalQuantity: [
      {
        required: true,
        message: 'Please enter total quantity',
        trigger: 'change'
      },
      { validator: this.validateTotalQuantityVWAP, trigger: ['change', 'blur'] }
    ],
    quantityPerOrder: [
      {
        required: true,
        message: 'Please enter quantity per order',
        trigger: 'change'
      },
      { validator: this.validateQuantityPerOrderVWAP, trigger: 'change' }
    ],
    volume: [
      {
        required: true,
        message: 'Please enter volume',
        trigger: 'change'
      },
      { validator: this.validateVolume, trigger: 'change' }
    ]
  };
  private TWAPForm = {
    time: null,
    priceLimit: '',
    priceSpread: '',
    totalQuantity: '',
    quantityPerOrder: '',
    timeInterval: ''
  };
  private TWAPFormRules = {
    time: [
      {
        required: true,
        message: 'Please select period',
        trigger: 'change'
      },
      { validator: this.validateTime, trigger: 'change' }
    ],
    priceLimit: [
      { required: true, message: 'Please enter price limit', trigger: 'change' }
    ],
    priceSpread: [
      {
        required: true,
        message: 'Please enter slippage',
        trigger: 'change'
      },
      { validator: this.validateSlippage, trigger: 'change' }
    ],
    totalQuantity: [
      {
        required: true,
        message: 'Please enter total amount',
        trigger: 'change'
      },
      { validator: this.validateTotalQuantityTWAP, trigger: ['change', 'blur'] }
    ],
    quantityPerOrder: [
      {
        required: true,
        message: 'Please enter quantity per order',
        trigger: 'change'
      },
      { validator: this.validateQuantityPerOrderTWAP, trigger: 'change' }
    ],
    timeInterval: [
      {
        required: true,
        message: 'Please time interval',
        trigger: 'change'
      },
      { validator: this.validateTimeIntervalTWAP, trigger: 'change' }
    ]
  };
  private iceForm = {
    time: null,
    limitPrice: '',
    totalQuantity: '',
    total: '',
    quantityPerOrder: ''
  };
  private iceFormRules = {
    time: [
      {
        required: true,
        message: 'Please select period.',
        trigger: 'change'
      },
      { validator: this.validateTime, trigger: 'change' }
    ],
    limitPrice: [
      { required: true, message: 'Please enter LMT price.', trigger: 'change' }
    ],
    totalQuantity: [
      {
        required: true,
        message: `Please enter total amount of ${this.currentPair[1][0].token0[1]}.`,
        trigger: 'change'
      },
      { validator: this.validateTotalQuantity, trigger: 'change' }
    ],
    quantityPerOrder: [
      {
        required: true,
        message: `Please enter amount of ${this.currentPair[1][0].token0[1]} per order`,
        trigger: 'change'
      },
      { validator: this.validateQuantityPerOrder, trigger: 'change' }
    ]
  };
  private timeIntervalList = [
    {
      value: '1hour',
      time: '3600'
    },
    {
      value: '12hour',
      time: '43200'
    },
    {
      value: '1day',
      time: '86400'
    },
    {
      value: '2day',
      time: '172800'
    },
    {
      value: '1week',
      time: '604800'
    },
    {
      value: '2week',
      time: '1209600'
    },
    {
      value: '1month',
      time: '2629800'
    }
  ];
  private validateTime(
    rule: ValidationRule,
    value: Array<moment.Moment>,
    callback: (arg0?: string) => void
  ): void {
    if (value) {
      const endTime = new BigNumber(value[1].valueOf());
      const now = new Date().getTime();
      if (new BigNumber(endTime).lt(now)) {
        callback('The end time must be set to a future time.');
      } else {
        callback();
      }
    }
  }
  private validateSlippage(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    let price = '0';
    if (
      this.tokens &&
      this.currentPair &&
      this.tokens[this.currentPair[1][0].token0[0].toString()] &&
      this.tokens[this.currentPair[1][0].token1[0].toString()]
    ) {
      price = new BigNumber(this.currentTokenPrice)
        .div(2)
        .decimalPlaces(this.buyUnit)
        .toString(10);
    }
    if (value && new BigNumber(value).gt(price)) {
      callback(
        `Slippage point should be below ${price} ${
          this.tokens[this.currentPair[1][0].token0[0].toString()].symbol
        }/${this.tokens[this.currentPair[1][0].token1[0].toString()].symbol}.`
      );
    } else {
      callback();
    }
  }
  private validateTotalQuantityVWAP(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    let min = '0';
    let min1 = '0';
    if (
      this.tokens &&
      this.currentPair &&
      this.tokens[this.currentPair[1][0].token0[0].toString()]
    ) {
      // min UNIT_SIZE * 1000
      min = new BigNumber(this.unit.toString(10))
        .times(1000)
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
        )
        .toString(10);
      min1 = new BigNumber(min)
        .times(this.currentTokenPrice)
        .decimalPlaces(this.buyUnit)
        .toString(10);
    }
    if (value && this.VWAPForm.quantityPerOrder !== '') {
      (this.$refs.VWAPForm as any).validateField(
        'quantityPerOrder',
        (errorMessage) => {
          console.log(errorMessage);
        }
      );
    }
    if (
      value &&
      this.TWAPTokenLimit === TokenEnum.Token0 &&
      new BigNumber(value).lt(min)
    ) {
      callback(
        `Quantity should be greater than ${min} ${
          this.tokens[this.currentPair[1][0].token0[0].toString()].symbol
        }.`
      );
    } else if (
      value &&
      this.TWAPTokenLimit === TokenEnum.Token1 &&
      new BigNumber(value).lt(min1)
    ) {
      callback(
        `Quantity should be greater than ${min1} ${
          this.tokens[this.currentPair[1][0].token1[0].toString()].symbol
        }`
      );
    } else {
      callback();
    }
  }
  private validateTotalQuantityTWAP(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    let min = '0';
    let min1 = '0';
    if (
      this.tokens &&
      this.currentPair &&
      this.tokens[this.currentPair[1][0].token0[0].toString()]
    ) {
      // min UNIT_SIZE * 1000
      min = new BigNumber(this.unit.toString(10))
        .times(1000)
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
        )
        .toString(10);
      min1 = new BigNumber(min)
        .times(this.currentTokenPrice)
        .decimalPlaces(this.buyUnit)
        .toString(10);
    }
    if (value && this.TWAPForm.quantityPerOrder !== '') {
      (this.$refs.TWAPForm as any).validateField(
        'quantityPerOrder',
        (errorMessage) => {
          console.log(errorMessage);
        }
      );
    }
    if (
      value &&
      this.TWAPTokenLimit === TokenEnum.Token0 &&
      new BigNumber(value).lt(min)
    ) {
      callback(
        `Quantity should be greater than ${min} ${
          this.tokens[this.currentPair[1][0].token0[0].toString()].symbol
        }.`
      );
    } else if (
      value &&
      this.TWAPTokenLimit === TokenEnum.Token1 &&
      new BigNumber(value).lt(min1)
    ) {
      callback(
        `Quantity should be greater than ${min1} ${
          this.tokens[this.currentPair[1][0].token1[0].toString()].symbol
        }`
      );
    } else {
      callback();
    }
  }
  private validateVolume(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    if (this.spread === GridModeEnum.Arithmetic) {
      let min = '0';
      if (
        this.tokens &&
        this.currentPair &&
        this.tokens[this.currentPair[1][0].token0[0].toString()]
      ) {
        // min UNIT_SIZE * 1000
        min = new BigNumber(this.unit.toString(10))
          .times(1000)
          .div(
            10 **
              this.tokens[this.currentPair[1][0].token1[0].toString()].decimals
          )
          .toString(10);
        if (value && new BigNumber(value).lt(min)) {
          callback(
            `The value should be greater than ${min} ${
              this.tokens[this.currentPair[1][0].token1[0].toString()].symbol
            }.`
          );
        } else {
          callback();
        }
      }
    } else {
      if (
        value &&
        (new BigNumber(value).lt(1) || new BigNumber(value).gt(3000))
      ) {
        callback('The value should be between 1.0% and 3000.0%.');
      } else {
        callback();
      }
    }
  }
  private validateQuantityPerOrderVWAP(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    let min = '0';
    let min1 = '0';
    if (
      this.tokens &&
      this.currentPair &&
      this.tokens[this.currentPair[1][0].token0[0].toString()]
    ) {
      // min UNIT_SIZE * 10
      min = new BigNumber(this.unit.toString(10))
        .times(10)
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
        )
        .toString(10);
      min1 = new BigNumber(min)
        .times(this.currentTokenPrice)
        .decimalPlaces(this.buyUnit)
        .toString(10);
    }
    if (
      value &&
      this.TWAPTokenLimit === TokenEnum.Token0 &&
      new BigNumber(value).lt(min)
    ) {
      callback(
        `The quantity per order should be greater than ${min} ${
          this.tokens[this.currentPair[1][0].token0[0].toString()].symbol
        }.`
      );
    } else if (
      value &&
      this.TWAPTokenLimit === TokenEnum.Token1 &&
      new BigNumber(value).lt(min1)
    ) {
      callback(
        `The quantity per order should be greater than ${min1} ${
          this.tokens[this.currentPair[1][0].token1[0].toString()].symbol
        }.`
      );
    } else if (
      this.VWAPForm.totalQuantity &&
      value &&
      new BigNumber(value).gte(this.VWAPForm.totalQuantity)
    ) {
      callback(
        `The quantity per order must be less than ${this.VWAPForm.totalQuantity}.`
      );
    } else {
      callback();
    }
  }
  private validateQuantityPerOrderTWAP(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    let min = '0';
    let min1 = '0';
    if (
      this.tokens &&
      this.currentPair &&
      this.tokens[this.currentPair[1][0].token0[0].toString()]
    ) {
      // min UNIT_SIZE * 10
      min = new BigNumber(this.unit.toString(10))
        .times(10)
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
        )
        .toString(10);
      min1 = new BigNumber(min)
        .times(this.currentTokenPrice)
        .decimalPlaces(this.buyUnit)
        .toString(10);
    }
    if (
      value &&
      this.TWAPTokenLimit === TokenEnum.Token0 &&
      new BigNumber(value).lt(min)
    ) {
      callback(
        `The quantity per order should be greater than ${min} ${
          this.tokens[this.currentPair[1][0].token0[0].toString()].symbol
        }.`
      );
    } else if (
      value &&
      this.TWAPTokenLimit === TokenEnum.Token1 &&
      new BigNumber(value).lt(min1)
    ) {
      callback(
        `The quantity per order should be greater than ${min1} ${
          this.tokens[this.currentPair[1][0].token1[0].toString()].symbol
        }.`
      );
    } else if (
      this.TWAPForm.totalQuantity &&
      value &&
      new BigNumber(value).gte(this.TWAPForm.totalQuantity)
    ) {
      callback(
        `The quantity per order must be less than ${this.TWAPForm.totalQuantity}.`
      );
    } else {
      callback();
    }
  }
  private validateTotalQuantity(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    let unitSize1000 = '0';
    if (value && this.iceForm.quantityPerOrder !== '') {
      (this.$refs.iceForm as any).validateField(
        'quantityPerOrder',
        (errorMessage) => {
          console.log(errorMessage);
        }
      );
    }
    if (
      this.tokens &&
      this.currentPair &&
      this.tokens[this.currentPair[1][0].token0[0].toString()]
    ) {
      unitSize1000 = new BigNumber(this.unit.toString(10))
        .times(1000)
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
        )
        .toString(10);
    }
    if (value && new BigNumber(value).lte(unitSize1000)) {
      callback(`Quantity should be greater than ${unitSize1000}.`);
    } else {
      callback();
    }
  }
  private validateQuantityPerOrder(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    let min = '0';
    if (
      this.tokens &&
      this.currentPair &&
      this.tokens[this.currentPair[1][0].token0[0].toString()]
    ) {
      // min UNIT_SIZE * 10
      min = new BigNumber(this.unit.toString(10))
        .times(10)
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
        )
        .toString(10);
    }
    if (value && new BigNumber(value).lte(min)) {
      callback(
        `Amount of ${this.currentPair[1][0].token0[1]} per order should be greater than  ${min}.`
      );
    } else if (
      this.iceForm.totalQuantity &&
      value &&
      new BigNumber(value).gte(this.iceForm.totalQuantity)
    ) {
      callback('The quantity per order must be lower than the total quantity.');
    } else {
      callback();
    }
  }
  private validateTimeIntervalTWAP(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    if (value && new BigNumber(value).lt(60)) {
      callback('The interval should be greater than or equal to 60 seconds.');
    } else {
      callback();
    }
  }
  get unit10(): string {
    if (
      this.unit &&
      this.currentPair &&
      this.tokens &&
      this.tokens[this.currentPair[1][0].token0[0].toString()]
    ) {
      return new BigNumber(this.unit.toString(10))
        .times(10)
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
        )
        .decimalPlaces(this.tokenMinUnit)
        .toString(10);
    }
    return '';
  }
  get unit10Token1(): string {
    if (
      this.unit &&
      this.currentPair &&
      this.tokens &&
      this.tokens[this.currentPair[1][0].token0[0].toString()] &&
      this.currentTokenPrice
    ) {
      return new BigNumber(this.unit10)
        .times(this.currentTokenPrice)
        .decimalPlaces(this.buyUnit)
        .toString(10);
    }
    return '';
  }
  get currentTokenPrice10(): string {
    if (this.currentTokenPrice) {
      return new BigNumber(this.currentTokenPrice)
        .div(10)
        .decimalPlaces(this.buyUnit, 1)
        .toString(10);
    }
    return '';
  }
  get currentTokenPriceLower(): string {
    if (this.currentTokenPrice) {
      return new BigNumber(this.currentTokenPrice)
        .times(0.1)
        .div(100)
        .decimalPlaces(this.buyUnit)
        .toString(10);
    }
    return '';
  }
  get upperPriceWarning(): boolean {
    if (this.upper && this.currentTokenPrice) {
      return new BigNumber(this.upper).lte(this.currentTokenPrice);
    }
    return false;
  }
  get lowerPriceWarning(): boolean {
    if (this.lower && this.currentTokenPrice) {
      return new BigNumber(this.lower).gte(this.currentTokenPrice);
    }
    return false;
  }
  get insufficientPrice(): boolean {
    if (this.upper && this.lower) {
      return new BigNumber(this.upper).lte(this.lower);
    }
    return false;
  }
  get canSubmit(): boolean {
    let flag = false;
    if (!this.lower) {
      flag = true;
    }
    if (!this.upper) {
      flag = true;
    }
    if (new BigNumber(this.upper).lte(this.lower)) {
      flag = true;
    }
    if (this.spread === GridModeEnum.Geometric) {
      if (new BigNumber(this.geometric).lte(0.1) || !this.geometric) {
        flag = true;
      }
    } else if (this.spread === GridModeEnum.Arithmetic) {
      if (
        new BigNumber(this.arithmetic).lte(this.currentTokenPriceLower) ||
        !this.arithmetic
      ) {
        flag = true;
      }
    }
    if (this.investment === GridAmountEnum.Percent) {
      if (this.percent && new BigNumber(this.percent).lte(0.1)) {
        flag = true;
      }
      if (this.percent && new BigNumber(this.percent).gte(100)) {
        flag = true;
      }
    } else if (this.investment === GridAmountEnum.Token0) {
      if (
        !this.amount ||
        Number(this.amount) < Number(this.unit10) ||
        !this.isModulo(this.amount)
      ) {
        flag = true;
      }
    } else if (this.investment === GridAmountEnum.Token1) {
      if (!this.amount || Number(this.amount) < Number(this.unit10Token1)) {
        flag = true;
      }
    }
    return flag;
  }
  private init(type: ProOrderMenu): void {
    this.proType = type;
    this.type = 'create';
    this.title = `Create ${this.proType} order`;
    this.step = 1;
    this.visibleProOrder = true;
    this.tradeType = 'Buy';
    this.spread = GridModeEnum.Arithmetic;
    this.TWAPTokenLimit = TokenEnum.Token0;
    this.setTimeIntervalList();
  }
  private setTimeInterval(time: string): void {
    this.TWAPForm.timeInterval = time;
    (this.$refs as any).TWAPForm.clearValidate('timeInterval');
  }
  private setTimeIntervalList(): void {
    const width = document.documentElement.clientWidth;
    if (width < 768) {
      this.timeIntervalList = [
        {
          value: '1hour',
          time: '3600'
        },
        {
          value: '1day',
          time: '86400'
        },
        {
          value: '1week',
          time: '604800'
        },
        {
          value: '1month',
          time: '2629800'
        }
      ];
    }
  }
  private isModulo(amount: string): boolean {
    if (
      amount &&
      this.tokens &&
      this.currentPair &&
      this.tokens[this.currentPair[1][0].token0[0].toString()]
    ) {
      return (
        new BigNumber(amount)
          .modulo(
            new BigNumber(this.unit.toString()).div(
              10 **
                this.tokens[this.currentPair[1][0].token0[0].toString()]
                  .decimals
            )
          )
          .toString(10) === '0'
      );
    }
    return true;
  }
  private totalChange(): void {
    if (
      this.iceForm.limitPrice &&
      Number(this.iceForm.limitPrice) !== 0 &&
      this.iceForm.total
    ) {
      this.iceForm.totalQuantity = new BigNumber(this.iceForm.total)
        .div(this.iceForm.limitPrice)
        .decimalPlaces(this.tokenMinUnit, 1)
        .toString(10);
    } else if (
      this.iceForm.totalQuantity &&
      Number(this.iceForm.totalQuantity) !== 0 &&
      this.iceForm.total
    ) {
      this.iceForm.totalQuantity = new BigNumber(this.iceForm.total)
        .div(this.iceForm.totalQuantity)
        .decimalPlaces(this.buyUnit, 1)
        .toString(10);
    }
  }
  private totalQuantityChange(): void {
    if (this.iceForm.limitPrice && this.iceForm.totalQuantity) {
      this.iceForm.total = new BigNumber(this.iceForm.limitPrice)
        .times(this.iceForm.totalQuantity)
        .toString(10);
    } else if (
      this.iceForm.totalQuantity &&
      Number(this.iceForm.totalQuantity) !== 0 &&
      this.iceForm.total
    ) {
      this.iceForm.limitPrice = new BigNumber(this.iceForm.total)
        .div(this.iceForm.totalQuantity)
        .decimalPlaces(this.buyUnit, 1)
        .toString(10);
    }
  }
  private limitPriceChange(): void {
    if (this.iceForm.limitPrice && this.iceForm.totalQuantity) {
      this.iceForm.total = new BigNumber(this.iceForm.limitPrice)
        .times(this.iceForm.totalQuantity)
        .toString(10);
    } else if (
      this.iceForm.limitPrice &&
      Number(this.iceForm.limitPrice) !== 0 &&
      this.iceForm.total
    ) {
      this.iceForm.totalQuantity = new BigNumber(this.iceForm.total)
        .div(this.iceForm.limitPrice)
        .decimalPlaces(this.tokenMinUnit, 1)
        .toString(10);
    }
  }
  private disabledDate(current: moment.Moment) {
    // Can not select days before today
    return current && current < moment().subtract(1, 'days');
  }
  private changeTradeType(tradeType: string): void {
    if (this.type === 'create') {
      this.tradeType = tradeType;
      if (this.proType === 'Iceberg') {
        this.iceForm.total = '';
        (this.$refs as any).iceForm.resetFields();
      }
      if (this.proType === 'TWAP') {
        (this.$refs as any).TWAPForm.resetFields();
      }
      if (this.proType === 'VWAP') {
        (this.$refs as any).VWAPForm.resetFields();
      }
    }
  }
  private gridDepositKeepingBalance(isToken0: boolean): void {
    this.$emit('gridDepositKeepingBalance', isToken0);
  }
  private gridTransferToken(isToken0: boolean): void {
    this.$emit('gridTransferToken', isToken0);
  }
  private update(item: STOrder, type: ProOrderMenu): void {
    this.visibleProOrder = true;
    this.$nextTick(() => {
      this.proType = type;
      this.title = `Update ${this.proType} order`;
      this.type = 'update';
      this.TWAPTokenLimit = TokenEnum.Token0;
      this.setTimeIntervalList();
      this.soid = item.soid;
      this.status = item.status;
      console.log(item);
      const decimals =
        this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
      const token0Decimals =
        this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
      if (this.proType === 'Grid') {
        const setting = (item.strategy as { GridOrder: GridOrder }).GridOrder
          .setting;
        this.lower = new BigNumber(setting.lowerLimit.toString(10))
          .div(10 ** decimals)
          .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
          .toString(10);
        this.upper = new BigNumber(setting.upperLimit.toString(10))
          .div(10 ** decimals)
          .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
          .toString(10);
        const spread = Object.keys(setting.spread)[0];
        const spreadValue = Object.values(setting.spread)[0];
        if (spread === 'Geom') {
          this.spread = GridModeEnum.Geometric;
          this.geometric = new BigNumber(spreadValue.toString())
            .div(10 ** 6)
            .times(100)
            .toString(10);
        } else if (spread === 'Arith') {
          this.spread = GridModeEnum.Arithmetic;
          this.arithmetic = new BigNumber(spreadValue.toString())
            .div(10 ** decimals)
            .div(
              new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals)
            )
            .toString(10);
        }
        const investment = Object.keys(setting.amount)[0];
        const investmentValue = Object.values(setting.amount)[0];
        if (investment === GridAmountEnum.Percent) {
          this.investment = GridAmountEnum.Percent;
          if (investmentValue && investmentValue.length) {
            this.percent = new BigNumber(investmentValue[0].toString())
              .div(10 ** 6)
              .times(100)
              .toString(10);
          }
        } else if (investment === GridAmountEnum.Token0) {
          this.investment = GridAmountEnum.Token0;
          this.amount = new BigNumber(investmentValue.toString())
            .div(10 ** token0Decimals)
            .toString(10);
        } else if (investment === GridAmountEnum.Token1) {
          this.investment = GridAmountEnum.Token1;
          this.amount = new BigNumber(investmentValue.toString())
            .div(10 ** decimals)
            .toString(10);
        }
      } else if (this.proType === 'Iceberg') {
        const setting = (item.strategy as { IcebergOrder: IcebergOrder })
          .IcebergOrder.setting;
        this.tradeType = Object.keys(setting.order.side)[0];
        const start = formatDateToSecond(
          new Date(
            Number(new BigNumber(setting.startingTime.toString(10)).times(1000))
          )
        );
        const end = formatDateToSecond(
          new Date(
            Number(new BigNumber(setting.endTime.toString(10)).times(1000))
          )
        );
        this.iceForm.time = [moment(start), moment(end)];
        this.iceForm.limitPrice = new BigNumber(
          setting.order.price.toString(10)
        )
          .div(10 ** decimals)
          .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
          .toString(10);
        const totalQuantity = Object.values(setting.totalLimit)[0];
        this.iceForm.totalQuantity = new BigNumber(totalQuantity.toString(10))
          .div(10 ** token0Decimals)
          .toString(10);
        this.iceForm.total = new BigNumber(this.iceForm.limitPrice)
          .times(this.iceForm.totalQuantity)
          .toString(10);
        const quantityPerOrder = Object.values(setting.amountPerTrigger)[0];
        this.iceForm.quantityPerOrder = new BigNumber(
          quantityPerOrder.toString(10)
        )
          .div(10 ** token0Decimals)
          .toString(10);
      } else if (this.proType === 'TWAP') {
        const setting = (item.strategy as { TWAP: TWAP }).TWAP.setting;
        this.tradeType = Object.keys(setting.order.side)[0];
        const start = formatDateToSecond(
          new Date(
            Number(new BigNumber(setting.startingTime.toString(10)).times(1000))
          )
        );
        const end = formatDateToSecond(
          new Date(
            Number(new BigNumber(setting.endTime.toString(10)).times(1000))
          )
        );
        this.TWAPForm.time = [moment(start), moment(end)];
        this.TWAPForm.priceLimit = new BigNumber(
          setting.order.priceLimit.toString(10)
        )
          .div(10 ** decimals)
          .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
          .toString(10);
        this.TWAPForm.priceSpread = new BigNumber(
          setting.order.priceSpread.toString(10)
        )
          .div(10 ** decimals)
          .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
          .toString(10);
        const totalQuantity = Object.values(setting.totalLimit)[0];
        let type = Object.keys(setting.totalLimit)[0];
        if (type === 'Token0') {
          this.TWAPTokenLimit = TokenEnum.Token0;
          this.TWAPForm.totalQuantity = new BigNumber(
            totalQuantity.toString(10)
          )
            .div(10 ** token0Decimals)
            .toString(10);
        } else {
          this.TWAPTokenLimit = TokenEnum.Token1;
          this.TWAPForm.totalQuantity = new BigNumber(
            totalQuantity.toString(10)
          )
            .div(10 ** decimals)
            .toString(10);
        }
        const quantityPerOrder = Object.values(setting.amountPerTrigger)[0];
        let type1 = Object.keys(setting.totalLimit)[0];
        if (type1 === 'Token0') {
          this.TWAPForm.quantityPerOrder = new BigNumber(
            quantityPerOrder.toString(10)
          )
            .div(10 ** token0Decimals)
            .toString(10);
        } else {
          this.TWAPForm.quantityPerOrder = new BigNumber(
            quantityPerOrder.toString(10)
          )
            .div(10 ** decimals)
            .toString(10);
        }
        this.TWAPForm.timeInterval = setting.triggerInterval.toString(10);
      } else if (this.proType === 'VWAP') {
        const setting = (item.strategy as { VWAP: VWAP }).VWAP.setting;
        this.tradeType = Object.keys(setting.order.side)[0];
        const start = formatDateToSecond(
          new Date(
            Number(new BigNumber(setting.startingTime.toString(10)).times(1000))
          )
        );
        const end = formatDateToSecond(
          new Date(
            Number(new BigNumber(setting.endTime.toString(10)).times(1000))
          )
        );
        this.VWAPForm.time = [moment(start), moment(end)];
        this.VWAPForm.priceLimit = new BigNumber(
          setting.order.priceLimit.toString(10)
        )
          .div(10 ** decimals)
          .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
          .toString(10);
        this.VWAPForm.priceSpread = new BigNumber(
          setting.order.priceSpread.toString(10)
        )
          .div(10 ** decimals)
          .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
          .toString(10);
        const totalQuantity = Object.values(setting.totalLimit)[0];
        let type = Object.keys(setting.totalLimit)[0];
        if (type === 'Token0') {
          this.TWAPTokenLimit = TokenEnum.Token0;
          this.VWAPForm.totalQuantity = new BigNumber(
            totalQuantity.toString(10)
          )
            .div(10 ** token0Decimals)
            .toString(10);
        } else {
          this.TWAPTokenLimit = TokenEnum.Token1;
          this.VWAPForm.totalQuantity = new BigNumber(
            totalQuantity.toString(10)
          )
            .div(10 ** decimals)
            .toString(10);
        }
        const quantityPerOrder = Object.values(setting.amountPerTrigger)[0];
        let type1 = Object.keys(setting.amountPerTrigger)[0];
        if (type1 === 'Token0') {
          this.VWAPForm.quantityPerOrder = new BigNumber(
            quantityPerOrder.toString(10)
          )
            .div(10 ** token0Decimals)
            .toString(10);
        } else {
          this.VWAPForm.quantityPerOrder = new BigNumber(
            quantityPerOrder.toString(10)
          )
            .div(10 ** decimals)
            .toString(10);
        }
        const volType = Object.keys(setting.triggerVol)[0];
        if (volType === 'Arith') {
          this.spread = GridModeEnum.Arithmetic;
          this.VWAPForm.volume = new BigNumber(
            Object.values(setting.triggerVol)[0].toString(10)
          )
            .div(10 ** decimals)
            .toString(10);
        } else if (volType === 'Geom') {
          this.spread = GridModeEnum.Geometric;
          this.VWAPForm.volume = new BigNumber(
            Object.values(setting.triggerVol)[0].toString()
          )
            .div(10 ** 6)
            .times(100)
            .toString(10);
        }
      }
    });
  }
  private changeVWAPTokenLimit(item: TokenEnum): void {
    this.VWAPForm.totalQuantity = '';
    this.VWAPForm.quantityPerOrder = '';
    this.TWAPTokenLimit = item;
    (this.$refs as any).VWAPForm.clearValidate('totalQuantity');
    (this.$refs as any).VWAPForm.clearValidate('quantityPerOrder');
  }
  private changeTWAPTokenLimit(item: TokenEnum): void {
    this.TWAPForm.totalQuantity = '';
    this.TWAPForm.quantityPerOrder = '';
    this.TWAPTokenLimit = item;
    (this.$refs as any).TWAPForm.clearValidate('totalQuantity');
    (this.$refs as any).TWAPForm.clearValidate('quantityPerOrder');
  }
  private changeInvestment(item: GridAmountEnum): void {
    this.percent = '';
    this.amount = '';
    this.investment = item;
  }
  private changeSpread(item: GridModeMenu): void {
    this.arithmetic = '';
    this.geometric = '';
    this.spread = item;
  }
  private changeSpreadVWAP(item: GridModeMenu): void {
    this.VWAPForm.volume = '';
    (this.$refs as any).VWAPForm.clearValidate('volume');
    this.spread = item;
  }
  private async setPoolMode(): Promise<void> {
    const setting = await this.getAccountSetting();
    if (!setting.enPoolMode || !setting.enKeepingBalance) {
      const currentICDexService = new ICDexService();
      await currentICDexService.accountConfig(
        this.currentPair[0].toString(),
        { PoolMode: null },
        true,
        ProSubaccountId
      );
    }
  }
  private async stoFee(): Promise<boolean> {
    if (this.dexRole && this.dexRole.vipMaker) {
      return true;
    }
    const sysToken = this.sysConfig.sysToken.toString();
    console.log(this.sysConfig);
    if (!this.stoConfig.poFee1) {
      return true;
    }
    console.log(this.tokens[sysToken]);
    const currentDrc20Token = new DRC20TokenService();
    const principal = localStorage.getItem('principal');
    const res = await currentDrc20Token.icrc2_allowance(sysToken, {
      account: {
        owner: Principal.fromText(principal),
        subaccount: [fromSubAccountId(ProSubaccountId)]
      },
      spender: {
        owner: this.currentPair[0],
        subaccount: []
      }
    });
    console.log(res.allowance);
    let fee = new BigNumber(this.stoConfig.poFee1.toString(10));
    if (this.type === 'update') {
      fee = fee.times(0.05);
    }
    fee = fee.plus(this.sysConfig.sysTokenFee.toString(10));
    console.log(fee.toString(10));
    let ICLBalance = await getTokenBalance(
      { icrc1: null },
      sysToken,
      ProSubaccountId
    );
    let tokenFee = getFee(this.tokens[sysToken]).toString(10);
    if (new BigNumber(res.allowance.toString(10)).lt(fee)) {
      // approve fee
      tokenFee = new BigNumber(tokenFee).plus(tokenFee).toString(10);
      fee = fee.plus(this.sysConfig.sysTokenFee.toString(10));
    }
    let balance = new BigNumber(ICLBalance).minus(tokenFee);
    console.log(balance.toString(10));
    if (balance.lt(fee)) {
      // const ICLBalance0 = await getTokenBalance({ icrc1: null }, sysToken);
      if (new BigNumber(balance).lt(fee)) {
        const createFee = new BigNumber(fee)
          .plus(tokenFee)
          .plus(getFee(this.tokens[sysToken]).toString(10))
          .div(10 ** this.tokens[sysToken].decimals)
          .toString(10);
        if (this.type === 'create') {
          this.$message.error(
            `Error! Your Pro-Wallet ICL balance is not enough to pay for pro-trade fee (at least with ${createFee} ICL).`
          );
        } else {
          this.$message.error(
            `Error! Your Pro-Wallet ICL balance is not enough to pay for pro-trade fee (at least with ${createFee} ICL).`
          );
        }
        return false;
      } else {
        // const amount = new BigNumber(fee).minus(balance).toString(10);
        // console.log(amount);
        // await currentDrc20Token.icrc1Transfer(sysToken, BigInt(amount), {
        //   owner: Principal.fromText(principal),
        //   subaccount: [fromSubAccountId(ProSubaccountId)]
        // });
      }
    }
    if (new BigNumber(res.allowance.toString(10)).lt(fee)) {
      const approve = new BigNumber(10000).times(
        10 ** this.tokens[sysToken].decimals
      );
      await currentDrc20Token.icrc2_approve(
        sysToken,
        {
          owner: this.currentPair[0],
          subaccount: []
        },
        BigInt(approve),
        [fromSubAccountId(ProSubaccountId)]
      );
    }
    return true;
  }
  private onSubmitVWAP(): void {
    (this.$refs.VWAPForm as any).validate(async (valid: any) => {
      console.log(this.VWAPForm);
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        const canSubmit = await this.stoFee();
        if (!canSubmit) {
          loading.close();
          return;
        }
        await this.setPoolMode();
        const time: Array<moment.Moment> = this.VWAPForm.time;
        const startingTime = new BigNumber(time[0].valueOf())
          .div(1000)
          .decimalPlaces(0, 1)
          .toString(10);
        const endTime = new BigNumber(time[1].valueOf())
          .div(1000)
          .decimalPlaces(0, 1)
          .toString(10);
        let side: OrderSide = {
          Buy: null
        };
        if (this.tradeType === 'Sell') {
          side = {
            Sell: null
          };
        }
        const token1 = this.currentPair[1][0].token1;
        const token0 = this.currentPair[1][0].token0;
        const token1Decimals = this.tokens[token1[0].toString()].decimals;
        const token0Decimals = this.tokens[token0[0].toString()].decimals;
        const priceLimit = BigInt(
          new BigNumber(this.VWAPForm.priceLimit)
            .times(10 ** token1Decimals)
            .times(
              new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals)
            )
            .toString(10)
        );
        const priceSpread = BigInt(
          new BigNumber(this.VWAPForm.priceSpread)
            .times(10 ** token1Decimals)
            .times(
              new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals)
            )
            .toString(10)
        );
        let totalQuantity = BigInt(
          new BigNumber(this.VWAPForm.totalQuantity)
            .times(10 ** token0Decimals)
            .toString(10)
        );
        let totalLimit: { Token0: bigint } | { Token1: bigint } = {
          Token0: totalQuantity
        };
        let amountPerTrigger = BigInt(
          new BigNumber(this.VWAPForm.quantityPerOrder)
            .times(10 ** token0Decimals)
            .toString(10)
        );
        let amountPerTriggerArg: { Token0: bigint } | { Token1: bigint } = {
          Token0: amountPerTrigger
        };
        if (this.TWAPTokenLimit === TokenEnum.Token1) {
          totalQuantity = BigInt(
            new BigNumber(this.VWAPForm.totalQuantity)
              .times(10 ** token1Decimals)
              .toString(10)
          );
          totalLimit = {
            Token1: totalQuantity
          };
          amountPerTrigger = BigInt(
            new BigNumber(this.VWAPForm.quantityPerOrder)
              .times(10 ** token1Decimals)
              .toString(10)
          );
          amountPerTriggerArg = {
            Token1: amountPerTrigger
          };
        }
        let vol:
          | {
              Geom: Ppm;
            }
          | { Arith: bigint } = null;
        if (this.spread === GridModeEnum.Arithmetic) {
          const arith = new BigNumber(this.VWAPForm.volume)
            .times(10 ** token1Decimals)
            .toString(10);
          vol = {
            Arith: BigInt(arith)
          };
        } else {
          const geom = new BigNumber(this.VWAPForm.volume)
            .times(10 ** 6)
            .div(100)
            .toString(10);
          vol = {
            Geom: BigInt(geom)
          };
        }
        const VWAPSetting: VWAPSetting = {
          startingTime: BigInt(startingTime),
          endTime: BigInt(endTime),
          order: {
            priceLimit: priceLimit,
            priceSpread: priceSpread,
            side: side
          },
          totalLimit: totalLimit,
          amountPerTrigger: amountPerTriggerArg,
          triggerVol: vol
        };
        console.log(VWAPSetting);
        try {
          const currentICDexService = new ICDexService();
          let res;
          if (this.type === 'create') {
            res = await currentICDexService.sto_createProOrder(
              this.currentPair[0].toString(),
              { VWAP: VWAPSetting },
              ProSubaccountId
            );
          } else {
            res = await currentICDexService.sto_updateProOrder(
              this.currentPair[0].toString(),
              this.soid,
              {
                VWAP: {
                  status: [],
                  setting: [VWAPSetting]
                }
              },
              ProSubaccountId
            );
          }
          if (res) {
            this.$message.success('Success');
            this.visibleProOrder = false;
            this.$emit('createProOrderSuccess');
          } else {
            this.$message.error('Error');
          }
        } catch (e) {
          if (toHttpRejectError(e)) {
            this.$message.error(toHttpRejectError(e));
          } else {
            this.$message.error('Error');
          }
        }
        loading.close();
      }
    });
  }
  private onSubmitTWAP(): void {
    (this.$refs.TWAPForm as any).validate(async (valid: any) => {
      console.log(this.TWAPForm);
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        const canSubmit = await this.stoFee();
        if (!canSubmit) {
          loading.close();
          return;
        }
        await this.setPoolMode();
        const time: Array<moment.Moment> = this.TWAPForm.time;
        const startingTime = new BigNumber(time[0].valueOf())
          .div(1000)
          .decimalPlaces(0, 1)
          .toString(10);
        const endTime = new BigNumber(time[1].valueOf())
          .div(1000)
          .decimalPlaces(0, 1)
          .toString(10);
        let side: OrderSide = {
          Buy: null
        };
        if (this.tradeType === 'Sell') {
          side = {
            Sell: null
          };
        }
        const token1 = this.currentPair[1][0].token1;
        const token0 = this.currentPair[1][0].token0;
        const token1Decimals = this.tokens[token1[0].toString()].decimals;
        const token0Decimals = this.tokens[token0[0].toString()].decimals;
        const priceLimit = BigInt(
          new BigNumber(this.TWAPForm.priceLimit)
            .times(10 ** token1Decimals)
            .times(
              new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals)
            )
            .toString(10)
        );
        const priceSpread = BigInt(
          new BigNumber(this.TWAPForm.priceSpread)
            .times(10 ** token1Decimals)
            .times(
              new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals)
            )
            .toString(10)
        );
        let totalQuantity = BigInt(
          new BigNumber(this.TWAPForm.totalQuantity)
            .times(10 ** token0Decimals)
            .toString(10)
        );
        let amountPerTrigger = BigInt(
          new BigNumber(this.TWAPForm.quantityPerOrder)
            .times(10 ** token0Decimals)
            .toString(10)
        );
        let totalLimit: { Token0: bigint } | { Token1: bigint } = {
          Token0: totalQuantity
        };
        let amountPerTriggerArg: { Token0: bigint } | { Token1: bigint } = {
          Token0: amountPerTrigger
        };
        if (this.TWAPTokenLimit === TokenEnum.Token1) {
          totalQuantity = BigInt(
            new BigNumber(this.TWAPForm.totalQuantity)
              .times(10 ** token1Decimals)
              .toString(10)
          );
          totalLimit = {
            Token1: totalQuantity
          };
          amountPerTrigger = BigInt(
            new BigNumber(this.TWAPForm.quantityPerOrder)
              .times(10 ** token1Decimals)
              .toString(10)
          );
          amountPerTriggerArg = {
            Token1: amountPerTrigger
          };
        }
        const timeInterval = BigInt(this.TWAPForm.timeInterval);
        try {
          const currentICDexService = new ICDexService();
          const TWAPSetting: TWAPSetting = {
            startingTime: BigInt(startingTime),
            endTime: BigInt(endTime),
            order: {
              priceLimit: priceLimit,
              priceSpread: priceSpread,
              side: side
            },
            totalLimit: totalLimit,
            amountPerTrigger: amountPerTriggerArg,
            triggerInterval: timeInterval
          };
          console.log(TWAPSetting);
          let res;
          if (this.type === 'create') {
            res = await currentICDexService.sto_createProOrder(
              this.currentPair[0].toString(),
              { TWAP: TWAPSetting },
              ProSubaccountId
            );
          } else {
            res = await currentICDexService.sto_updateProOrder(
              this.currentPair[0].toString(),
              this.soid,
              {
                TWAP: {
                  status: [],
                  setting: [TWAPSetting]
                }
              },
              ProSubaccountId
            );
          }
          if (res) {
            this.$message.success('Success');
            this.visibleProOrder = false;
            this.$emit('createProOrderSuccess');
          } else {
            this.$message.error('Error');
          }
        } catch (e) {
          if (toHttpRejectError(e)) {
            this.$message.error(toHttpRejectError(e));
          } else {
            this.$message.error('Error');
          }
        }
        loading.close();
      }
    });
  }
  private onSubmitIce(): void {
    (this.$refs.iceForm as any).validate(async (valid: any) => {
      console.log(this.iceForm);
      if (valid) {
        const flag = this.canRun();
        if (!flag) {
          return;
        }
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        const canSubmit = await this.stoFee();
        if (!canSubmit) {
          loading.close();
          return;
        }
        await this.setPoolMode();
        const time: Array<moment.Moment> = this.iceForm.time;
        const startingTime = new BigNumber(time[0].valueOf())
          .div(1000)
          .decimalPlaces(0, 1)
          .toString(10);
        const endTime = new BigNumber(time[1].valueOf())
          .div(1000)
          .decimalPlaces(0, 1)
          .toString(10);
        let side: OrderSide = {
          Buy: null
        };
        if (this.tradeType === 'Sell') {
          side = {
            Sell: null
          };
        }
        const token1 = this.currentPair[1][0].token1;
        const token0 = this.currentPair[1][0].token0;
        const token1Decimals = this.tokens[token1[0].toString()].decimals;
        const token0Decimals = this.tokens[token0[0].toString()].decimals;
        const price = BigInt(
          new BigNumber(this.iceForm.limitPrice)
            .times(10 ** token1Decimals)
            .times(
              new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals)
            )
            .toString(10)
        );
        const order = {
          side: side,
          price: price
        };
        const totalQuantity = BigInt(
          new BigNumber(this.iceForm.totalQuantity)
            .times(10 ** token0Decimals)
            .toString(10)
        );
        const amountPerTrigger = BigInt(
          new BigNumber(this.iceForm.quantityPerOrder)
            .times(10 ** token0Decimals)
            .toString(10)
        );
        try {
          const currentICDexService = new ICDexService();
          const IcebergOrder: IcebergOrderConfig = {
            startingTime: BigInt(startingTime),
            endTime: BigInt(endTime),
            order: order,
            totalLimit: {
              Token0: totalQuantity
            },
            amountPerTrigger: {
              Token0: amountPerTrigger
            }
          };
          let res;
          if (this.type === 'create') {
            console.log('sto_createProOrder');
            console.log(IcebergOrder);
            res = await currentICDexService.sto_createProOrder(
              this.currentPair[0].toString(),
              {
                IcebergOrder: IcebergOrder
              },
              ProSubaccountId
            );
          } else {
            console.log('sto_updateProOrder');
            console.log(IcebergOrder);
            res = await currentICDexService.sto_updateProOrder(
              this.currentPair[0].toString(),
              this.soid,
              {
                IcebergOrder: {
                  status: [],
                  setting: [IcebergOrder]
                }
              },
              ProSubaccountId
            );
          }
          if (res) {
            this.$message.success('Success');
            this.visibleProOrder = false;
            this.$emit('createProOrderSuccess');
          } else {
            this.$message.error('Error');
          }
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
    });
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
  private async onSubmit(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });

    await checkAuth();
    const canSubmit = await this.stoFee();
    if (!canSubmit) {
      loading.close();
      return;
    }
    await this.setPoolMode();
    const token1 = this.currentPair[1][0].token1;
    const token0 = this.currentPair[1][0].token0;
    const token1Decimals = this.tokens[token1[0].toString()].decimals;
    const token0Decimals = this.tokens[token0[0].toString()].decimals;
    const lowerLimit = new BigNumber(this.lower)
      .times(10 ** token1Decimals)
      .times(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
      .toString(10);
    const upperLimit = new BigNumber(this.upper)
      .times(10 ** token1Decimals)
      .times(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
      .toString(10);
    let spread:
      | {
          Geom: Ppm;
        }
      | { Arith: bigint } = null;
    if (this.spread === GridModeEnum.Arithmetic) {
      const arith = new BigNumber(this.arithmetic)
        .times(10 ** token1Decimals)
        .times(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
        .toString(10);
      spread = {
        Arith: BigInt(arith)
      };
    } else {
      const geom = new BigNumber(this.geometric)
        .times(10 ** 6)
        .div(100)
        .toString(10);
      spread = {
        Geom: BigInt(geom)
      };
    }
    let amount: GridOrderConfigAmount = null;
    if (this.investment === GridAmountEnum.Percent) {
      if (this.percent) {
        const percent = new BigNumber(this.percent)
          .times(10 ** 6)
          .div(100)
          .toString(10);
        amount = {
          Percent: [BigInt(percent)]
        };
      } else {
        amount = {
          Percent: []
        };
      }
    } else if (this.investment === GridAmountEnum.Token0) {
      const token0 = new BigNumber(this.amount)
        .times(10 ** token0Decimals)
        .toString(10);
      amount = {
        Token0: BigInt(token0)
      };
    } else if (this.investment === GridAmountEnum.Token1) {
      const token1 = new BigNumber(this.amount)
        .times(10 ** token1Decimals)
        .toString(10);
      amount = {
        Token1: BigInt(token1)
      };
    }
    const currentICDexService = new ICDexService();
    const gridOrderConfig: GridOrderConfig = {
      lowerLimit: BigInt(lowerLimit),
      upperLimit: BigInt(upperLimit),
      spread: spread,
      amount: amount
    };
    console.log(gridOrderConfig);
    try {
      let res;
      if (this.type === 'create') {
        console.log('sto_createProOrder');
        res = await currentICDexService.sto_createProOrder(
          this.currentPair[0].toString(),
          {
            GridOrder: gridOrderConfig
          },
          ProSubaccountId
        );
      } else {
        console.log('sto_updateProOrder');
        const gridOrderConfigUpdate: GridOrderConfigUpdate = {
          status: [],
          lowerLimit: [BigInt(lowerLimit)],
          upperLimit: [BigInt(upperLimit)],
          spread: [spread],
          amount: [amount]
        };
        res = await currentICDexService.sto_updateProOrder(
          this.currentPair[0].toString(),
          this.soid,
          {
            GridOrder: gridOrderConfigUpdate
          },
          ProSubaccountId
        );
      }
      if (res) {
        this.$message.success('Success');
        this.visibleProOrder = false;
        this.$emit('createProOrderSuccess');
      } else {
        this.$message.error('Error');
      }
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
  private async getAccountSetting(): Promise<AccountSetting> {
    const currentICDexService = new ICDexService();
    const currentPair = this.currentPair[0].toString();
    const principal = localStorage.getItem('principal');
    const res = await currentICDexService.accountSetting(
      currentPair,
      principalToAccountIdentifier(
        Principal.fromText(principal),
        new Uint8Array(fromSubAccountId(ProSubaccountId))
      )
    );
    console.log(res);
    if (res && res.pairId === this.currentPair[0].toString()) {
      return res.accountSetting;
    }
  }
  private afterClose(): void {
    console.log('afterClose');
    console.log(this.proType);
    if (this.proType === 'Grid') {
      this.lower = '';
      this.upper = '';
      this.spread = GridModeEnum.Arithmetic;
      this.investment = GridAmountEnum.Token0;
      this.percent = '';
      this.amount = '';
      this.arithmetic = '';
      this.geometric = '';
    }
    if (this.proType === 'Iceberg') {
      this.iceForm.total = '';
      (this.$refs.iceForm as any).resetFields();
    }
    if (this.proType === 'TWAP') {
      (this.$refs.TWAPForm as any).resetFields();
    }
    if (this.proType === 'VWAP') {
      (this.$refs.VWAPForm as any).resetFields();
      this.spread = GridModeEnum.Arithmetic;
      console.log(this.VWAPForm);
    }
  }
}
</script>

<style scoped lang="scss">
.time-Label {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 20px;
  div {
    cursor: pointer;
  }
  button {
    width: auto;
    background: #1a2a33;
    color: #52b7c3;
  }
}
.line22 {
  line-height: 22px;
}
.pro-order-item {
  background: #101014;
  padding: 20px 15px;
  border-radius: 10px;
}
.grid-setting-item-title {
  display: flex;
  align-items: center;
  padding: 20px 0 5px;
}
.grid-setting-price-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    width: 250px;
  }
}
.grid-setting-item-mode {
  width: 250px;
}
span.base-font-title {
  font-size: 12px;
}
.transfer-pro-wallet-main {
  display: flex;
  .transfer-pro-wallet-down {
    margin: 10px 0;
    cursor: pointer;
    font-size: 22px;
    padding-left: 50px;
    color: #51b7c3;
    text-align: left;
  }
}
.transfer-pro-wallet {
  width: 50%;
  margin-right: 10px;
  margin-top: 5px;
  button {
    margin-top: 5px;
  }
}
.pc-show {
  display: flex;
}
.h5-show {
  display: none;
}
.trade-h5-header {
  margin-top: 10px;
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
      cursor: pointer;
      &.disabled {
        cursor: not-allowed;
      }
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
.flex-center {
  display: flex;
  align-items: center;
  width: 100%;
}
.ice-setting-item {
  &.ice-setting-item-trigger {
    ::v-deep .ant-form-item-label {
      width: 100%;
    }
    ::v-deep label {
      display: flex;
      align-items: center;
      width: 100%;
    }
  }
  &.ice-setting-item-suffix {
    ::v-deep input {
      padding-right: 30px;
    }
  }
  .suffix {
    position: absolute;
    top: 63px;
    right: 10px;
    font-size: 12px;
    color: #8c90a1;
  }
  ::v-deep &.ant-form-item {
    margin-bottom: 10px;
  }
  ::v-deep .ant-calendar-picker-clear {
    background: transparent;
    color: #adb3c4;
  }
  ::v-deep .ant-calendar-picker-input {
    height: 36px;
    line-height: 26px;
    border: none !important;
    input {
      height: 26px !important;
      border: none !important;
    }
    .ant-calendar-range-picker-separator {
      color: #adb3c4;
    }
  }
}
.trade-item-pro-fee {
  margin: 30px 0 5px;
  font-size: 12px;
}
@media screen and (max-width: 768px) {
  .h5-show {
    display: flex;
  }
  .pc-show {
    display: none;
  }
  .grid-setting-price-range {
    input {
      width: 100%;
    }
  }
  .transfer-pro-wallet-main {
    flex-direction: column;
    margin-bottom: 0;
    button {
      margin-top: 5px;
    }
  }
  .transfer-pro-wallet {
    width: 100%;
  }
  .pro-order-item {
    padding: 10px;
  }
}
</style>
<style lang="scss">
.ant-calendar-date-input-wrap .ant-calendar-input {
  background: transparent !important;
  border: none !important;
  height: 22px !important;
  color: rgba(0, 0, 0, 0.65) !important;
  &:hover {
    background: transparent !important;
    border: none !important;
  }
}
.ant-calendar-picker-container {
  table,
  tr,
  th {
    background: transparent !important;
  }
  table tr {
    height: 30px;
  }
}
</style>
