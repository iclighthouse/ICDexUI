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
        <span style="color: #adb3c4"
          >Step 1: Transfer tokens from Main-wallet to Pro-wallet
          (subaccount:0000000000000000000000000000000000000000000000000000000000000001)</span
        >
        <div class="mt20" style="color: #adb3c4">Pro-Wallet:</div>
        <div class="transfer-pro-wallet-main pc-show">
          <div class="transfer-pro-wallet">
            <span>{{ currentPair[1][0].token1[1] }}:&nbsp;</span>
            <span
              v-if="
                tokensBalanceSto &&
                currentPair &&
                tokens[currentPair[1][0].token1[0].toString()]
              "
              >{{
                tokensBalanceSto[currentPair[1][0].token1[0].toString()]
                  | bigintToFloat(
                    Math.min(
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      8
                    ),
                    tokens[currentPair[1][0].token1[0].toString()].decimals
                  )
                  | formatNum
              }}</span
            >
          </div>
          <div class="transfer-pro-wallet">
            <span>{{ currentPair[1][0].token0[1] }}:&nbsp;</span>
            <span
              v-if="
                tokensBalanceSto &&
                currentPair &&
                tokens[currentPair[1][0].token0[0].toString()]
              "
            >
              {{
                tokensBalanceSto[currentPair[1][0].token0[0].toString()]
                  | bigintToFloat(
                    Math.min(
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      8
                    ),
                    tokens[currentPair[1][0].token0[0].toString()].decimals
                  )
                  | formatNum
              }}
            </span>
          </div>
        </div>
        <div class="transfer-pro-wallet-main pc-show">
          <div class="transfer-pro-wallet">
            <button class="primary" @click="gridTransferToken(false)">
              Transfer
            </button>
          </div>
          <div class="transfer-pro-wallet">
            <button class="primary" @click="gridTransferToken(true)">
              Transfer
            </button>
          </div>
        </div>
        <div class="transfer-pro-wallet-main h5-show">
          <div>
            <span>{{ currentPair[1][0].token1[1] }}:&nbsp;</span>
            <span
              v-if="
                tokensBalanceSto &&
                currentPair &&
                tokens[currentPair[1][0].token1[0].toString()]
              "
            >
              {{
                tokensBalanceSto[currentPair[1][0].token1[0].toString()]
                  | bigintToFloat(
                    Math.min(
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      8
                    ),
                    tokens[currentPair[1][0].token1[0].toString()].decimals
                  )
                  | formatNum
              }}
            </span>
          </div>
          <button class="primary" @click="gridTransferToken(false)">
            Transfer
          </button>
        </div>
        <div class="transfer-pro-wallet-main h5-show">
          <div>
            <span>{{ currentPair[1][0].token0[1] }}:&nbsp;</span>
            <span
              v-if="
                tokensBalanceSto &&
                currentPair &&
                tokens[currentPair[1][0].token0[0].toString()]
              "
            >
              {{
                tokensBalanceSto[currentPair[1][0].token0[0].toString()]
                  | bigintToFloat(
                    Math.min(
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      8
                    ),
                    tokens[currentPair[1][0].token0[0].toString()].decimals
                  )
                  | formatNum
              }}
            </span>
          </div>
          <button class="primary" @click="gridTransferToken(true)">
            Transfer
          </button>
        </div>
        <div class="w100" style="display: flex; margin-top: 40px">
          <button class="margin-left-auto" @click="step = 2">Next</button>
        </div>
      </div>
      <div v-show="step === 2">
        <span style="color: #adb3c4"
          >Step 2: Deposit tokens from Pro-wallet to Pro-TraderAcct (Trading
          pair's account for pro-trader)</span
        >
        <div class="mt20" style="color: #adb3c4">Pro-TraderAcct:</div>
        <div class="transfer-pro-wallet-main pc-show">
          <div class="transfer-pro-wallet">
            <span>{{ currentPair[1][0].token1[1] }}:&nbsp;</span>
            <span
              v-if="
                keepingBalanceSto &&
                currentPair &&
                tokens[currentPair[1][0].token1[0].toString()]
              "
              >{{
                keepingBalanceSto[currentPair[1][0].token1[0].toString()]
                  | bigintToFloat(
                    Math.min(
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      8
                    ),
                    tokens[currentPair[1][0].token1[0].toString()].decimals
                  )
                  | formatNum
              }}</span
            >
          </div>
          <div class="transfer-pro-wallet">
            <span>{{ currentPair[1][0].token0[1] }}:&nbsp;</span>
            <span
              v-if="
                keepingBalanceSto &&
                currentPair &&
                tokens[currentPair[1][0].token0[0].toString()]
              "
            >
              {{
                keepingBalanceSto[currentPair[1][0].token0[0].toString()]
                  | bigintToFloat(
                    Math.min(
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      8
                    ),
                    tokens[currentPair[1][0].token0[0].toString()].decimals
                  )
                  | formatNum
              }}
            </span>
          </div>
        </div>
        <div class="transfer-pro-wallet-main pc-show">
          <div class="transfer-pro-wallet">
            <button class="primary" @click="gridDepositKeepingBalance(false)">
              Deposit
            </button>
          </div>
          <div class="transfer-pro-wallet">
            <button class="primary" @click="gridDepositKeepingBalance(true)">
              Deposit
            </button>
          </div>
        </div>
        <div class="transfer-pro-wallet-main h5-show">
          <div class="transfer-pro-wallet">
            <span>{{ currentPair[1][0].token0[1] }}:&nbsp;</span>
            <span
              v-if="
                keepingBalanceSto &&
                currentPair &&
                tokens[currentPair[1][0].token0[0].toString()]
              "
            >
              {{
                keepingBalanceSto[currentPair[1][0].token0[0].toString()]
                  | bigintToFloat(
                    Math.min(
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      8
                    ),
                    tokens[currentPair[1][0].token0[0].toString()].decimals
                  )
                  | formatNum
              }}
            </span>
          </div>
          <button class="primary" @click="gridDepositKeepingBalance(true)">
            Deposit
          </button>
        </div>
        <div class="transfer-pro-wallet-main h5-show">
          <div class="transfer-pro-wallet">
            <span>{{ currentPair[1][0].token1[1] }}:&nbsp;</span>
            <span
              v-if="
                keepingBalanceSto &&
                currentPair &&
                tokens[currentPair[1][0].token1[0].toString()]
              "
              >{{
                keepingBalanceSto[currentPair[1][0].token1[0].toString()]
                  | bigintToFloat(
                    Math.min(
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      8
                    ),
                    tokens[currentPair[1][0].token1[0].toString()].decimals
                  )
                  | formatNum
              }}</span
            >
          </div>
          <button class="primary" @click="gridDepositKeepingBalance(false)">
            Deposit
          </button>
        </div>
        <div class="w100" style="display: flex; margin-top: 40px">
          <button class="margin-left-auto" @click="step = 3">Next</button>
        </div>
      </div>
      <div v-show="step === 3" class="grid-setting">
        <span v-show="type === 'create'" style="color: #adb3c4"
          >Step 3: Create a {{ proType }} Order
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
              1. Price Range
            </div>
            <div class="grid-setting-price-range">
              <div>
                <a-input
                  :key="buyUnit"
                  v-model="lower"
                  class="input-icp-suffix"
                  autocomplete="off"
                  type="text"
                  placeholder="Lower"
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
                  placeholder="Upper"
                  v-only-float="buyUnit"
                />
              </div>
            </div>
            <span v-show="insufficientPrice" class="base-red">
              Upper price must be greater than lower price.
            </span>
          </div>
          <div class="grid-setting-item">
            <div class="grid-setting-item-title base-font-title">
              2. Spread
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
                :suffix="currentPair[1][0].token1[1]"
              />
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
              <span v-show="Number(geometric) > 100" class="base-red">
                Max ratio is 100.
              </span>
            </div>
          </div>
          <div class="grid-setting-item">
            <div class="grid-setting-item-title base-font-title">
              3. Amount
              <a-dropdown placement="bottomCenter">
                <span class="pointer margin-left-auto" style="color: #51b7c3">
                  <a-tooltip placement="top">
                    <template slot="title">
                      Percentage of available funds remaining.
                    </template>
                    <span v-show="investment === gridAmountMenu.Percent">
                      {{ investment }}
                    </span>
                  </a-tooltip>
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
              <span v-show="Number(percent) > 100" class="base-red">
                Max percent is 100.
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
              <span v-show="insufficientToken0" class="base-red">
                Insufficient {{ currentPair[1][0].token0[1] }}
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
              <span v-show="insufficientToken1" class="base-red">
                Insufficient {{ currentPair[1][0].token1[1] }}
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
              label="Time"
              prop="time"
            >
              <a-range-picker
                :disabled-date="disabledDate"
                show-time
                :showToday="false"
                v-model="iceForm.time"
              >
              </a-range-picker>
            </a-form-model-item>
            <a-form-model-item
              class="ice-setting-item"
              label="Limit price"
              prop="limitPrice"
            >
              <a-input
                v-if="currentPair"
                :key="buyUnit"
                v-model="iceForm.limitPrice"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Limit price"
                v-only-float="buyUnit"
                :suffix="currentPair[1][0].token1[1]"
                @input="limitPriceChange"
              />
            </a-form-model-item>
            <a-form-model-item
              class="ice-setting-item"
              label="Quantity"
              prop="totalQuantity"
            >
              <a-input
                v-if="currentPair"
                :key="tokenMinUnit"
                v-model="iceForm.totalQuantity"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Quantity"
                v-only-float="tokenMinUnit"
                :suffix="currentPair[1][0].token0[1]"
                @input="totalQuantityChange"
              />
            </a-form-model-item>
            <a-form-model-item class="ice-setting-item" label="Total">
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
                placeholder="Total"
                v-only-float="
                  tokens[currentPair[1][0].token1[0].toString()].decimals
                "
                :suffix="currentPair[1][0].token1[1]"
                @input="totalChange"
              />
            </a-form-model-item>
            <a-form-model-item
              class="ice-setting-item"
              label="Display quantity"
              prop="displayQuantity"
            >
              <a-input
                v-if="currentPair"
                :key="tokenMinUnit"
                v-model="iceForm.displayQuantity"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Display quantity"
                v-only-float="tokenMinUnit"
                :suffix="currentPair[1][0].token0[1]"
              />
            </a-form-model-item>
            <a-form-model-item>
              <button
                type="button"
                class="primary large-primary w100 mt20"
                @click="onSubmitIce"
              >
                Submit
              </button>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
      <button
        v-show="proType === 'Grid' && step === 3"
        type="button"
        class="primary large-primary w100 mt20"
        :disabled="canSubmit"
        @click="onSubmit"
      >
        Submit
      </button>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  DePairs,
  GridModeEnum,
  GridModeMenu,
  GridAmountEnum,
  GridAmountMenu,
  ProOrderMenu
} from '@/views/home/ICDex/model';
import { TokenInfo } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';
import {
  AccountSetting,
  GridOrder,
  GridOrderConfig,
  GridOrderConfigAmount,
  GridOrderConfigUpdate,
  IcebergOrder,
  IcebergOrderConfig,
  OrderSide,
  Ppm,
  STOrder,
  STStatus
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
const ProSubaccountId = 1;

@Component({
  name: 'proOrder',
  components: {}
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
  @Prop({ type: String, default: '' })
  private proType!: ProOrderMenu;

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
  private investment: GridAmountMenu = GridAmountEnum.Token1;
  private percent = '';
  private amount = '';
  private arithmetic = '';
  private geometric = '';
  private insufficientToken0 = false;
  private insufficientToken1 = false;
  private step = 1;
  private tradeType = 'Buy';
  private iceForm = {
    time: null,
    limitPrice: '',
    totalQuantity: '',
    total: '',
    displayQuantity: ''
  };
  private iceFormRules = {
    time: [
      {
        required: true,
        message: 'Please select Time',
        trigger: 'change'
      }
    ],
    limitPrice: [
      { required: true, message: 'Please enter limit price', trigger: 'change' }
    ],
    totalQuantity: [
      {
        required: true,
        message: 'Please enter total quantity',
        trigger: 'change'
      }
    ],
    displayQuantity: [
      {
        required: true,
        message: 'Please enter display quantity',
        trigger: 'change'
      },
      { validator: this.validateDisplayQuantity, trigger: 'change' }
    ]
  };
  private validateDisplayQuantity(
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
      // min UNIT_SIZE * 11
      min = new BigNumber(this.unit.toString(10))
        .times(11)
        .div(
          10 **
            this.tokens[this.currentPair[1][0].token0[0].toString()].decimals
        )
        .toString(10);
    }
    if (value && new BigNumber(value).lt(min)) {
      callback(`Min displayed quantity is ${min}.`);
    } else if (
      this.iceForm.totalQuantity &&
      value &&
      new BigNumber(value).gte(this.iceForm.totalQuantity)
    ) {
      callback('The displayed quantity must be lower than the total quantity.');
    } else {
      callback();
    }
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
      if (new BigNumber(this.geometric).gt(100) || !this.geometric) {
        flag = true;
      }
    } else if (this.spread === GridModeEnum.Arithmetic) {
      if (!this.arithmetic) {
        flag = true;
      }
    }
    if (this.investment === GridAmountEnum.Percent) {
      if (new BigNumber(this.percent).gt(100) || !this.percent) {
        flag = true;
      }
    } else if (this.investment === GridAmountEnum.Token0) {
      if (!this.amount) {
        flag = true;
      }
    } else if (this.investment === GridAmountEnum.Token1) {
      if (!this.amount) {
        flag = true;
      }
    }
    return flag;
  }
  private init(type: ProOrderMenu): void {
    this.proType = type;
    this.title = `Create ${this.proType} order`;
    this.step = 1;
    this.visibleProOrder = true;
    this.tradeType = 'Buy';
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
      (this.$refs as any).iceForm.resetFields();
    }
  }
  private gridDepositKeepingBalance(isToken0: boolean): void {
    this.$emit('gridDepositKeepingBalance', isToken0);
  }
  private gridTransferToken(isToken0: boolean): void {
    this.$emit('gridTransferToken', isToken0);
  }
  private update(item: STOrder): void {
    this.title = `Update ${this.proType} order`;
    this.type = 'update';
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
          .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
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
      this.iceForm.limitPrice = new BigNumber(setting.order.price.toString(10))
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
      const displayQuantity = Object.values(setting.amountPerTrigger)[0];
      this.iceForm.displayQuantity = new BigNumber(displayQuantity.toString(10))
        .div(10 ** token0Decimals)
        .toString(10);
    }
    this.visibleProOrder = true;
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
  private onSubmitIce(): void {
    (this.$refs.iceForm as any).validate(async (valid: any) => {
      console.log(this.iceForm);
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
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
          new BigNumber(this.iceForm.displayQuantity)
            .times(10 ** token0Decimals)
            .toString(10)
        );
        try {
          const currentICDexService = new ICDexService();
          let res;
          if (this.type === 'create') {
            console.log('sto_createProOrder');
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
  private async onSubmit(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
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
    if (this.proType === 'Grid') {
      this.lower = '';
      this.upper = '';
      this.spread = GridModeEnum.Arithmetic;
      this.investment = GridAmountEnum.Percent;
      this.percent = '';
      this.amount = '';
      this.arithmetic = '';
      this.geometric = '';
    }
    if (this.proType === 'Iceberg') {
      (this.$refs as any).iceForm.resetFields();
    }
  }
}
</script>

<style scoped lang="scss">
.grid-setting-item-title {
  display: flex;
  align-items: center;
  padding: 15px 0 5px;
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
.ice-setting-item {
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
    margin-bottom: 10px;
    button {
      margin-top: 5px;
    }
  }
  .transfer-pro-wallet {
    width: 100%;
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
