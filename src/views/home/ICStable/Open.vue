<template>
  <div class="container-width">
    <div class="ic-stable-main-header">
      <div class="ic-stable-main-header-back">
        <a-icon class="back-icon" type="arrow-left" @click="back" />
      </div>
      <ul>
        <li>
          <span class="ic-stable-main-header-item-left">Stability Fee</span
          ><span class="ic-stable-main-header-item-right" v-if="config">{{
            config.INIT_STABILITY_FEE | filterPermyriad
          }}</span>
          <!--<a-tooltip placement="top">
						<template slot="title">
						</template>
						<a-icon type="info-circle" />
					</a-tooltip>-->
        </li>
        <li>
          <span class="ic-stable-main-header-item-left">Liquidation Fee</span
          ><span class="ic-stable-main-header-item-right" v-if="config">{{
            config.LIQUIDATION_FEE | filterPermyriad
          }}</span>
        </li>
        <li>
          <span class="ic-stable-main-header-item-left"
            >Min. collateral ratio</span
          ><span class="ic-stable-main-header-item-right" v-if="config">{{
            config.MIN_COLL_RATIO | filterPermyriad
          }}</span>
        </li>
        <li>
          <span class="ic-stable-main-header-item-left">Debt Ceiling</span
          ><span class="ic-stable-main-header-item-right" v-if="config">{{
            config.DEBT_CEILING | bigintToFloat(2, dusdDecimal)
          }}</span>
          DUSD
        </li>
        <li>
          <span class="ic-stable-main-header-item-left">Debt Floor</span
          ><span class="ic-stable-main-header-item-right" v-if="config">{{
            config.DEBT_FLOOR | bigintToFloat(2, dusdDecimal)
          }}</span>
          DUSD
        </li>
      </ul>
    </div>
    <div class="open-borrow">
      <div class="dp-info" v-if="dpId">
        DP: {{ dpId }}
        <span v-if="tokenInfo"
          >(collaterals:
          {{ currentDepositAmount | formatAmount(tokenInfo.decimals) }}
          {{ tokenInfo.symbol }})</span
        >
      </div>
      <div class="open-main">
        <div class="open-main-left">
          <div class="open-main-left-item">
            <div>
              Liquidation Price
              <!--<a-icon class="question-circle" type="question-circle" />-->
            </div>
            <div class="open-main-left-item-current">
              ${{ currentLiquidationPrice | formatNum }}
            </div>
            <div
              v-show="
                depositAmountInput || dusdAmountInput || paybackDusdAmountInput
              "
              class="open-main-left-item-after"
            >
              ${{ liquidationPrice | formatNum }} after
            </div>
          </div>
          <div class="open-main-left-item">
            <div>
              Collateral Ratio
              <!--<a-icon class="question-circle" type="question-circle" />-->
            </div>
            <div
              v-if="config"
              class="open-main-left-item-current"
              :class="
                currentCollateralRatio
                  | ratioGrade(
                    config.MIN_COLL_RATIO.toString(10),
                    config.INIT_COLL_RATIO.toString(10)
                  )
              "
            >
              {{ currentCollateralRatio }}
            </div>
            <div v-if="config">
              <div
                v-show="
                  depositAmountInput ||
                  dusdAmountInput ||
                  paybackDusdAmountInput
                "
                class="open-main-left-item-after"
                :class="
                  collateralRatio
                    | ratioGradeBg(
                      config.MIN_COLL_RATIO.toString(10),
                      config.INIT_COLL_RATIO.toString(10)
                    )
                "
              >
                {{ collateralRatio }} after
              </div>
            </div>
          </div>
          <div class="open-main-left-item">
            <div>
              Current Price
              <!--<a-icon class="question-circle" type="question-circle" />-->
            </div>
            <div class="open-main-left-item-current" v-if="price && collateral">
              ${{
                price[0][1][Number(this.collateral[2].mktSid)].data[1] |
                  bigintToFloat(
                    Number(
                      price[0][1][Number(this.collateral[2].mktSid)].decimals
                    ),
                    Number(
                      price[0][1][Number(this.collateral[2].mktSid)].decimals
                    )
                  ) |
                  formatNum
              }}
            </div>
          </div>
          <div class="open-main-left-item">
            <div>
              Collateral Locked
              <!--<a-icon class="question-circle" type="question-circle" />-->
            </div>
            <div v-if="price && collateral" class="open-main-left-item-current">
              ${{
                currentDepositAmount |
                  filterPrice(price[0][1][Number(this.collateral[2].mktSid)]) |
                  formatNum
              }}
            </div>
            <div
              v-show="
                depositAmountInput || dusdAmountInput || paybackDusdAmountInput
              "
              class="open-main-left-item-after"
            >
              <span v-if="price && collateral">
                ${{
                  depositAmount |
                    filterPrice(
                      price[0][1][Number(this.collateral[2].mktSid)]
                    ) |
                    formatNum
                }}
                after
              </span>
            </div>
            <div v-if="tokenInfo" class="open-main-left-item-bottom">
              {{ currentDepositAmount | formatAmount(tokenInfo.decimals) }}
              {{ tokenInfo.symbol }}
            </div>
          </div>
          <div class="open-main-left-item-debt-info">
            <div>
              <div>Debt Position DUSD Debt</div>
              <div class="open-main-left-item-current">
                {{ currentDusdDebt | formatAmount(dusdDecimal) }} DUSD
              </div>
              <div
                v-show="
                  depositAmountInput ||
                  dusdAmountInput ||
                  paybackDusdAmountInput
                "
                class="open-main-left-item-after"
              >
                {{ dusdDebt | formatAmount(dusdDecimal) }} after
              </div>
            </div>
            <div>
              <div>Available to Withdraw</div>
              <div class="open-main-left-item-current">
                <span v-if="tokenInfo"
                  >{{
                    cAvailableWithdrawCollateral |
                      formatNegativeNumber |
                      formatAmount(tokenInfo.decimals)
                  }}
                  {{ tokenInfo.symbol }}</span
                >
              </div>
              <div
                v-show="
                  depositAmountInput ||
                  dusdAmountInput ||
                  paybackDusdAmountInput
                "
                class="open-main-left-item-after"
              >
                <span v-if="tokenInfo">{{
                  availableWithdrawCollateral |
                    formatNegativeNumber |
                    formatAmount(tokenInfo.decimals)
                }}</span>
                {{ tokenInfo.symbol }} after
              </div>
            </div>
            <div>
              <div>Available to Generate</div>
              <div class="open-main-left-item-current">
                {{
                  cGenerateDusd |
                    formatNegativeNumber |
                    formatAmount(dusdDecimal)
                }}
                DUSD
              </div>
              <div
                v-show="
                  depositAmountInput ||
                  dusdAmountInput ||
                  paybackDusdAmountInput
                "
                class="open-main-left-item-after"
              >
                {{
                  generateDusd |
                    formatNegativeNumber |
                    formatAmount(dusdDecimal)
                }}
                DUSD after
              </div>
            </div>
          </div>
        </div>
        <div class="open-item-borrow">
          <div v-show="dpId" class="open-item-borrow-menu">
            <ul>
              <li
                :class="{
                  active: operateType === 'add' || operateType === 'remove'
                }"
                @click="changeOperateMenu('add')"
              >
                Collateral
              </li>
              <li
                :class="{
                  active:
                    operateType === 'payback' || operateType === 'generate'
                }"
                @click="changeOperateMenu('generate')"
              >
                DUSD
              </li>
            </ul>
            <div
              class="open-item-borrow-menu-button"
              v-show="operateType === 'add' || operateType === 'remove'"
            >
              <button
                :class="{
                  active: operateType === 'add'
                }"
                @click="changeOperateMenu('add')"
              >
                Deposit
                <span v-if="tokenInfo">&nbsp;{{ tokenInfo.symbol }}</span>
              </button>
              <button
                :class="{
                  active: operateType === 'remove'
                }"
                @click="changeOperateMenu('remove')"
              >
                Withdraw<span v-if="tokenInfo"
                  >&nbsp;{{ tokenInfo.symbol }}</span
                >
              </button>
            </div>
            <div
              class="open-item-borrow-menu-button"
              v-show="operateType === 'payback' || operateType === 'generate'"
            >
              <button
                :class="{
                  active: operateType === 'generate'
                }"
                @click="changeOperateMenu('generate')"
              >
                Generate&nbsp;DUSD
              </button>
              <button
                :class="{
                  active: operateType === 'payback'
                }"
                @click="changeOperateMenu('payback')"
              >
                Payback&nbsp;DUSD
              </button>
            </div>
          </div>
          <div class="open-item-borrow-title">
            <span v-show="!dpId">Configure your debt position</span>
          </div>
          <div class="open-item-borrow-tip">
            <span v-show="!dpId"
              >Simulate your debt position by configuring the amount of
              collateral to deposit, and DUSD to generate.</span
            >
          </div>
          <div class="deposit-item">
            <div class="open-label">
              {{ operateName }}
              <span v-if="tokenInfo"
                ><span
                  v-show="
                    operateType === 'add' ||
                    operateType === 'remove' ||
                    operateType === 'open'
                  "
                  >{{ tokenInfo.symbol }}</span
                ><span
                  v-show="
                    operateType === 'generate' || operateType === 'payback'
                  "
                  >DUSD</span
                ></span
              >
            </div>
            <div
              class="deposit-input"
              v-show="
                operateType === 'add' ||
                operateType === 'remove' ||
                operateType === 'open'
              "
            >
              <a-input-group class="swap-item-group" compact v-if="tokenInfo">
                <a-input
                  v-model="depositAmountInput"
                  class="input-icp-suffix"
                  autocomplete="off"
                  type="text"
                  v-only-float="tokenInfo.decimals"
                  placeholder="0.0"
                  @input="depositAmountChange"
                /><span class="suffix">{{ tokenInfo.symbol }}</span>
              </a-input-group>
              <div>~ {{ depositAmountToUsd }} USD</div>
            </div>
            <div v-show="operateType === 'add' || operateType === 'open'">
              Balance:
              <span
                v-if="tokenInfo && tokensBalance && tokensBalance[tokenId]"
                >{{
                  tokensBalance[tokenId] |
                    bigintToFloat(tokenInfo.decimals, tokenInfo.decimals)
                }}</span
              >
              <span v-else>-</span>
              <span v-if="tokenInfo"> {{ tokenInfo.symbol }}</span>
            </div>
            <div
              @click="maxAvailableWithdrawCollateral"
              class="max-value"
              v-show="operateType === 'remove'"
            >
              Max:
              <span v-if="tokenInfo">{{
                cAvailableWithdrawCollateral |
                  formatNegativeNumber |
                  formatAmount(tokenInfo.decimals)
              }}</span>
              <span v-if="tokenInfo"> {{ tokenInfo.symbol }}</span>
            </div>
            <div class="deposit-input" v-show="operateType === 'generate'">
              <a-input-group class="swap-item-group" compact>
                <a-input
                  v-model="dusdAmountInput"
                  class="input-icp-suffix"
                  autocomplete="off"
                  type="text"
                  v-only-float="dusdDecimal"
                  placeholder="0.0"
                  @input="dusdAmountChange"
                /><span class="suffix">DUSD</span>
              </a-input-group>
            </div>
            <div
              @click="maxGenerateDusd"
              class="max-value"
              v-show="operateType === 'generate'"
            >
              Max:
              <span>{{ cGenerateDusd | formatNegativeNumber }} DUSD</span>
            </div>
            <div class="deposit-input" v-show="operateType === 'payback'">
              <a-input-group class="disabled swap-item-group" compact>
                <a-input
                  disabled
                  v-model="currentDusdDebt"
                  class="input-icp-suffix"
                  autocomplete="off"
                  type="text"
                  placeholder="0.0"
                /><span class="suffix">DUSD</span>
              </a-input-group>
            </div>
            <div v-show="operateType === 'payback'">
              Balance:
              <span v-if="tokensBalance">{{
                tokensBalance['2l63q-hyaaa-aaaak-aaosa-cai'] |
                  bigintToFloat(dusdDecimal, dusdDecimal)
              }}</span>
              <span v-else>-</span>
              <span> DUSD</span>
            </div>
            <div
              class="payback-stability-fee"
              v-show="operateType === 'payback'"
            >
              <div>
                Stability Fee: {{ payable | formatAmount(dusdDecimal) }} DUSD
                <span v-if="price"
                  >(EST. {{ payable | payableToIcl(price[0][1][5]) }} ICL)</span
                >
              </div>
              <div>
                Payment method:
                <a-radio-group
                  class="payable-radio-group"
                  name="radioGroup"
                  v-model="payableRadioType"
                >
                  <a-radio value="DUSD"> DUSD </a-radio>
                  <a-radio value="ICL">
                    ICL<span v-if="tokensBalance"
                      >(Bal:
                      {{
                        tokensBalance['2x2bb-qyaaa-aaaak-aaoqa-cai'] |
                          bigintToFloat(8, 8)
                      }}
                      ICL)</span
                    >
                  </a-radio>
                </a-radio-group>
              </div>
            </div>
          </div>
          <!--<div class="generate">
						<div class="open-label">Generate DUSD</div>
						<a-input-group class="swap-item-group disabled" compact>
							<a-input
								v-model="generateAmount"
								disabled
								class="input-icp-suffix"
								autocomplete="off"
								type="text"
							/><span class="suffix">DUSD</span>
						</a-input-group>
					</div>-->
          <div
            class="position-change"
            v-show="
              depositAmountInput || dusdAmountInput || paybackDusdAmountInput
            "
          >
            <div class="position-change-title">Debt position changes</div>
            <div class="position-change-item">
              <span class="position-change-item-left">Collateral Locked</span>
              <span class="position-change-item-right"
                ><a-tooltip placement="top">
                  <template slot="title">
                    <span>{{
                      currentDepositAmount | formatAmount(tokenInfo.decimals)
                    }}</span>
                  </template>
                  {{ currentDepositAmount | formatAmount(4) }}
                </a-tooltip>
                <span v-if="tokenInfo"> {{ tokenInfo.symbol }}</span
                ><a-icon type="arrow-right" />
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{
                      depositAmount | formatAmount(tokenInfo.decimals)
                    }}</span>
                  </template>
                  {{ depositAmount | formatAmount(4) }}
                </a-tooltip>
                <span v-if="tokenInfo"> {{ tokenInfo.symbol }}</span></span
              >
            </div>
            <div class="position-change-item">
              <span class="position-change-item-left">Collateral Ratio</span>
              <span v-if="config" class="position-change-item-right"
                ><span
                  :class="
                    currentCollateralRatio
                      | ratioGrade(
                        config.MIN_COLL_RATIO.toString(10),
                        config.INIT_COLL_RATIO.toString(10)
                      )
                  "
                  >{{ currentCollateralRatio }}</span
                ><a-icon type="arrow-right" /><span
                  :class="
                    collateralRatio
                      | ratioGrade(
                        config.MIN_COLL_RATIO.toString(10),
                        config.INIT_COLL_RATIO.toString(10)
                      )
                  "
                  >{{ collateralRatio }}</span
                >
              </span>
            </div>
            <div class="position-change-item">
              <span class="position-change-item-left">Liquidation Price</span>
              <span class="position-change-item-right"
                >${{ currentLiquidationPrice }}<a-icon type="arrow-right" />${{
                  liquidationPrice
                }}</span
              >
            </div>
            <div class="position-change-item">
              <span class="position-change-item-left"
                >Debt Position DUSD Debt</span
              >
              <span class="position-change-item-right"
                ><a-tooltip placement="top">
                  <template slot="title">
                    <span>{{
                      currentDusdDebt | formatAmount(dusdDecimal)
                    }}</span>
                  </template>
                  {{ currentDusdDebt | formatAmount(4) }}
                </a-tooltip>
                DUSD<a-icon type="arrow-right" /><a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ dusdDebt | formatAmount(dusdDecimal) }}</span>
                  </template>
                  {{ dusdDebt | formatAmount(4) }}
                </a-tooltip>
                DUSD</span
              >
            </div>
            <div class="position-change-item">
              <span class="position-change-item-left"
                >Available to Withdraw</span
              >
              <span class="position-change-item-right"
                ><a-tooltip placement="top">
                  <template slot="title">
                    <span v-if="tokenInfo">{{
                      cAvailableWithdrawCollateral |
                        formatNegativeNumber |
                        formatAmount(tokenInfo.decimals)
                    }}</span>
                  </template>
                  {{
                    cAvailableWithdrawCollateral |
                      formatNegativeNumber |
                      formatAmount(4)
                  }}
                </a-tooltip>
                <span v-if="tokenInfo"> {{ tokenInfo.symbol }}</span
                ><a-icon type="arrow-right" /><a-tooltip placement="top">
                  <template slot="title">
                    <span v-if="tokenInfo">{{
                      availableWithdrawCollateral |
                        formatNegativeNumber |
                        formatAmount(tokenInfo.decimals)
                    }}</span>
                  </template>
                  {{
                    availableWithdrawCollateral |
                      formatNegativeNumber |
                      formatAmount(4)
                  }}
                </a-tooltip>
                <span v-if="tokenInfo"> {{ tokenInfo.symbol }}</span></span
              >
            </div>
            <div class="position-change-item">
              <span class="position-change-item-left"
                >Available to Generate</span
              >
              <span class="position-change-item-right"
                ><a-tooltip placement="top">
                  <template slot="title">
                    <span>{{
                      cGenerateDusd |
                        formatNegativeNumber |
                        formatAmount(dusdDecimal)
                    }}</span>
                  </template>
                  {{ cGenerateDusd | formatNegativeNumber | formatAmount(4) }}
                </a-tooltip>
                DUSD<a-icon type="arrow-right" /><a-tooltip placement="top">
                  <template slot="title">
                    <span>{{
                      generateDusd |
                        formatNegativeNumber |
                        formatAmount(dusdDecimal)
                    }}</span>
                  </template>
                  {{ generateDusd | formatNegativeNumber | formatAmount(4) }}
                </a-tooltip>
                DUSD</span
              >
            </div>
          </div>
          <div class="swap-button">
            <button
              v-if="principal"
              class="primary large-primary w100"
              :disabled="buttonDisabled"
              @click="onConfirm"
            >
              {{ buttonName }}
            </button>
            <button
              v-if="!principal"
              @click="connectWallet"
              type="button"
              class="primary large-primary w100"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { ICStableService } from '@/ic/ICStable/ICStableService';
import {
  AssetResponse,
  ChargeMethod,
  CollInfo,
  CollValues,
  Config,
  DataResponse,
  DebtPosition,
  PriceRes,
  StableTxnResultErr,
  StatsResponse,
  TxnResultOk
} from '@/ic/ICStable/model';
import { TokenId, TokenInfo, TokenStd } from '@/ic/common/icType';
import { getTokenBalance } from '@/ic/getTokenBalance';
import { getFee } from '@/ic/getTokenFee';
import { PairTokenStdMenu } from '@/views/home/ICSwap/model';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { TxReceiptErr } from '@/ic/DRC20Token/model';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { ElLoadingComponent } from 'element-ui/types/loading';
import {
  DUSD_CANISTER_ID,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_STABLE_CANISTER_ID
} from '@/ic/utils';
import { OperateType } from '@/views/home/ICStable/model';
@Component({
  name: 'Open',
  components: {},
  filters: {
    formatNegativeNumber(val: string): string {
      if (new BigNumber(val).lt(0)) {
        return '0';
      } else {
        return val;
      }
    },
    payableToIcl(val: string, price: DataResponse): string {
      if (val && price) {
        return new BigNumber(val)
          .div(price.data[1].toString(10))
          .times(10 ** Number(price.decimals))
          .decimalPlaces(8)
          .toString(10);
      }
      return '';
    },
    filterPrice(val: string, tokenPrice: DataResponse): string {
      if (val && tokenPrice) {
        return new BigNumber(val)
          .times(tokenPrice.data[1].toString(10))
          .div(10 ** Number(tokenPrice.decimals))
          .decimalPlaces(Number(tokenPrice.decimals), 1)
          .toString(10);
      }
      return '0';
    },
    filterPermyriad(val: bigint): string {
      if (val) {
        return (
          new BigNumber(val.toString(10))
            .div(10000)
            .times(100)
            .decimalPlaces(2)
            .toString(10) + '%'
        );
      }
    }
  }
})
export default class extends Vue {
  private ICStableService: ICStableService;
  private config: Config = null;
  private dusdDecimal = 8;
  private depositAmountInput = '';
  private dusdAmountInput = '';
  private paybackDusdAmountInput = '';
  private depositAmount = '';
  private currentCollaterals: Array<CollValues> = [];
  private depositAmountToUsd = '0.0000';
  private currentDepositAmount = '0';
  private currentDusdDebt = '0';
  private payable = '0';
  private dpInfo: DebtPosition = null;
  private payableRadioType = 'DUSD';
  private price: PriceRes = null;
  private tokenId = '';
  private dpId = '';
  private tokenInfo: TokenInfo = null;
  private tokensBalance: { [key: string]: string } = {};
  private timer = null;
  private buttonName = 'Confirm';
  private operateType: OperateType = 'open';
  private collateral: [TokenId, CollInfo, CollInfo] = null;
  private openLoading: ElLoadingComponent;
  private stats: StatsResponse = null;
  private assetsStats: { [key: string]: AssetResponse } = {};
  private principal = '';
  @Watch('$route')
  private onRouteChange() {
    this.init();
  }
  beforeDestroy(): void {
    this.clearInterval();
  }
  private clearInterval(): void {
    window.clearInterval(this.timer);
    this.timer = null;
  }
  get operateName(): string {
    if (this.operateType === 'open') {
      return 'Deposit';
    } else if (this.operateType === 'add') {
      return 'Deposit';
    } else if (this.operateType === 'remove') {
      return 'Withdraw';
    } else if (this.operateType === 'payback') {
      return 'Payback';
    } else if (this.operateType === 'generate') {
      return 'Generate';
    }
    return 'Deposit';
  }
  get buttonDisabled(): boolean {
    let flag = false;
    if (this.operateType === 'payback') {
      this.buttonName = 'Confirm';
      if (this.payableRadioType === 'DUSD') {
        if (
          new BigNumber(this.payable)
            .plus(this.currentDusdDebt)
            .times(10 ** this.dusdDecimal)
            .gt(this.tokensBalance[DUSD_CANISTER_ID])
        ) {
          this.buttonName = 'Insufficient DUSD balance';
          flag = true;
          return flag;
        }
      }
      if (this.payableRadioType === 'ICL') {
        if (
          new BigNumber(this.currentDusdDebt)
            .times(10 ** this.dusdDecimal)
            .gt(this.tokensBalance[DUSD_CANISTER_ID])
        ) {
          this.buttonName = 'Insufficient DUSD balance';
          flag = true;
          return flag;
        }
        if (
          new BigNumber(this.payable)
            .times(this.price[0][1][5].data[1].toString(10))
            .div(10 ** Number(this.price[0][1][5].decimals))
            .times(10 ** 8)
            .gt(this.tokensBalance[IC_LIGHTHOUSE_TOKEN_CANISTER_ID])
        ) {
          this.buttonName = 'Insufficient ICL balance';
          flag = true;
          return flag;
        }
      }
      return flag;
    }
    if (
      ((this.operateType === 'remove' ||
        this.operateType === 'add' ||
        this.operateType === 'open') &&
        !this.depositAmountInput) ||
      (this.operateType === 'generate' && !this.dusdAmountInput)
    ) {
      this.buttonName = 'Confirm';
      flag = true;
    } else {
      this.buttonName = 'Confirm';
      if (
        this.config &&
        this.tokenInfo &&
        this.tokensBalance &&
        this.tokensBalance[this.tokenId]
      ) {
        if (
          this.operateType === 'remove' &&
          new BigNumber(this.cAvailableWithdrawCollateral).lt(
            this.depositAmountInput
          )
        ) {
          this.buttonName = 'Insufficient collateral';
          flag = true;
          return flag;
        }
        if (
          this.operateType === 'generate' &&
          new BigNumber(this.cGenerateDusd).lt(this.dusdAmountInput)
        ) {
          this.buttonName = 'Insufficient Generate';
          flag = true;
          return flag;
        }
        if (
          new BigNumber(this.depositAmountInput)
            .times(10 ** this.tokenInfo.decimals)
            .plus(getFee(this.tokenInfo).toString(10))
            .plus(getFee(this.tokenInfo).toString(10))
            .gt(this.tokensBalance[this.tokenId])
        ) {
          this.buttonName = `Insufficient ${this.tokenInfo.symbol} balance`;
          flag = true;
          return flag;
        }
        const floor = new BigNumber(this.config.DEBT_FLOOR.toString(10))
          .div(10 ** this.dusdDecimal)
          .decimalPlaces(this.dusdDecimal)
          .toString(10);
        const ceiling = new BigNumber(this.config.DEBT_CEILING.toString(10))
          .div(10 ** this.dusdDecimal)
          .decimalPlaces(this.dusdDecimal)
          .toString(10);
        if (new BigNumber(this.dusdDebt).gt(ceiling)) {
          this.buttonName = `This debt position can a maximum of ${ceiling} DUSD to be generated`;
          flag = true;
          return flag;
        }
        if (new BigNumber(this.dusdDebt).lt(floor)) {
          this.buttonName = `This debt position requires a minimum of ${floor} DUSD to be generated`;
          flag = true;
          return flag;
        }
      } else {
        this.buttonName = 'Confirm';
        flag = true;
      }
    }
    return flag;
  }
  get collateralRatio(): string {
    if (this.price && this.config && this.collateral && Number(this.dusdDebt)) {
      return (
        new BigNumber(this.depositAmount)
          .times(
            this.price[0][1][
              Number(this.collateral[2].mktSid)
            ].data[1].toString(10)
          )
          .div(
            10 **
              Number(
                this.price[0][1][Number(this.collateral[2].mktSid)].decimals
              )
          )
          .times(this.collateral[2].factor.toString(10))
          .div(10000)
          .div(this.dusdDebt)
          .times(100)
          .decimalPlaces(2, 1)
          .toString(10) + '%'
      );
    }
    return '0';
  }
  get currentCollateralRatio(): string {
    if (
      this.price &&
      this.config &&
      this.collateral &&
      Number(this.currentDusdDebt)
    ) {
      return (
        new BigNumber(this.currentDepositAmount)
          .times(
            this.price[0][1][
              Number(this.collateral[2].mktSid)
            ].data[1].toString(10)
          )
          .div(
            10 **
              Number(
                this.price[0][1][Number(this.collateral[2].mktSid)].decimals
              )
          )
          .times(this.collateral[2].factor.toString(10))
          .div(10000)
          .div(this.currentDusdDebt)
          .times(100)
          .decimalPlaces(2, 1)
          .toString(10) + '%'
      );
    }
    return '0';
  }
  get liquidationPrice(): string {
    if (Number(this.depositAmount) === 0) {
      return '0';
    }
    if (this.price && this.config && this.depositAmount && this.collateral) {
      return (
        new BigNumber(this.dusdDebt)
          .times(this.config.MIN_COLL_RATIO.toString(10))
          .div(10000)
          // .div(
          //   new BigNumber(10000).minus(this.config.INIT_STABILITY_FEE.toString())
          // )
          .div(this.collateral[2].factor.toString(10))
          .times(10000)
          .div(this.depositAmount)
          .decimalPlaces(
            Number(
              this.price[0][1][Number(this.collateral[2].mktSid)].decimals
            ),
            2
          )
          .toString(10)
      );
    }
    return '0';
  }
  get currentLiquidationPrice(): string {
    if (
      this.price &&
      this.config &&
      Number(this.currentDepositAmount) &&
      this.collateral &&
      Number(this.currentDusdDebt)
    ) {
      return (
        new BigNumber(this.currentDusdDebt)
          .times(this.config.MIN_COLL_RATIO.toString(10))
          .div(10000)
          // .div(
          //   new BigNumber(10000).minus(this.config.INIT_STABILITY_FEE.toString())
          // )
          .div(this.collateral[2].factor.toString(10))
          .times(10000)
          .div(this.currentDepositAmount)
          .decimalPlaces(
            Number(
              this.price[0][1][Number(this.collateral[2].mktSid)].decimals
            ),
            2
          )
          .toString(10)
      );
    }
    return '0';
  }
  get availableWithdrawCollateral(): string {
    let availableWithdrawCollateral = new BigNumber(0);
    // open is 0
    if (this.operateType === 'add') {
      availableWithdrawCollateral = new BigNumber(this.depositAmountInput)
        .plus(this.cAvailableWithdrawCollateral)
        .decimalPlaces(this.tokenInfo.decimals, 1);
    } else if (this.operateType === 'remove') {
      availableWithdrawCollateral = new BigNumber(
        this.cAvailableWithdrawCollateral
      )
        .minus(this.depositAmountInput)
        .decimalPlaces(this.tokenInfo.decimals, 1);
    } else if (this.operateType === 'generate') {
      availableWithdrawCollateral = new BigNumber(this.cGenerateDusd)
        .minus(this.dusdAmountInput)
        .times(this.config.INIT_COLL_RATIO.toString(10))
        .div(this.collateral[2].factor.toString(10))
        .div(
          this.price[0][1][Number(this.collateral[2].mktSid)].data[1].toString(
            10
          )
        )
        .times(
          10 **
            Number(this.price[0][1][Number(this.collateral[2].mktSid)].decimals)
        )
        .decimalPlaces(this.tokenInfo.decimals, 1);
    }
    if (availableWithdrawCollateral.lt(0)) {
      return '0';
    } else {
      return availableWithdrawCollateral.toString(10);
    }
  }
  get cAvailableWithdrawCollateral(): string {
    if (
      this.price &&
      this.config &&
      this.collateral &&
      Number(this.currentDepositAmount) &&
      Number(this.currentDusdDebt)
    ) {
      const cAvailableWithdrawCollateral = new BigNumber(
        this.currentDepositAmount
      )
        .minus(
          new BigNumber(this.currentDusdDebt)
            .plus(this.payable)
            .times(this.config.INIT_COLL_RATIO.toString(10))
            .div(this.collateral[2].factor.toString(10))
            .div(
              new BigNumber(
                this.price[0][1][
                  Number(this.collateral[2].mktSid)
                ].data[1].toString(10)
              ).div(
                10 **
                  Number(
                    this.price[0][1][Number(this.collateral[2].mktSid)].decimals
                  )
              )
            )
        )
        .decimalPlaces(this.tokenInfo.decimals, 1);
      return cAvailableWithdrawCollateral.toString(10);
      // if (cAvailableWithdrawCollateral.lt(0)) {
      //   return '0';
      // } else {
      //   return cAvailableWithdrawCollateral.toString(10);
      // }
    }
    return '0';
  }
  get cGenerateDusd(): string {
    if (this.price && this.config && this.collateral) {
      return new BigNumber(this.cAvailableWithdrawCollateral)
        .times(
          this.price[0][1][Number(this.collateral[2].mktSid)].data[1].toString(
            10
          )
        )
        .div(
          10 **
            Number(this.price[0][1][Number(this.collateral[2].mktSid)].decimals)
        )
        .times(this.collateral[2].factor.toString(10))
        .div(this.config.INIT_COLL_RATIO.toString(10))
        .decimalPlaces(this.dusdDecimal, 1)
        .toString(10);
    }
    return '0';
  }
  get generateDusd(): string {
    if (this.price && this.config && this.collateral) {
      return new BigNumber(this.availableWithdrawCollateral)
        .times(
          this.price[0][1][Number(this.collateral[2].mktSid)].data[1].toString(
            10
          )
        )
        .div(
          10 **
            Number(this.price[0][1][Number(this.collateral[2].mktSid)].decimals)
        )
        .times(this.collateral[2].factor.toString(10))
        .div(this.config.INIT_COLL_RATIO.toString(10))
        .decimalPlaces(this.dusdDecimal, 1)
        .toString(10);
    }
    return '0';
  }
  get dusdDebt(): string {
    if (
      this.price &&
      this.config &&
      this.collateral &&
      (this.depositAmountInput ||
        this.dusdAmountInput ||
        this.paybackDusdAmountInput)
    ) {
      if (this.dpId) {
        if (this.operateType === 'generate') {
          const currentDusdDebt = new BigNumber(this.currentDusdDebt).plus(
            this.dusdAmountInput
          );
          return currentDusdDebt.toString(10);
        }
        if (this.operateType === 'payback') {
          return '0';
        }
        return this.currentDusdDebt;
      } else {
        return new BigNumber(this.depositAmountInput)
          .times(
            this.price[0][1][
              Number(this.collateral[2].mktSid)
            ].data[1].toString(10)
          )
          .div(
            10 **
              Number(
                this.price[0][1][Number(this.collateral[2].mktSid)].decimals
              )
          )
          .times(this.collateral[2].factor.toString(10))
          .div(this.config.INIT_COLL_RATIO.toString(10))
          .decimalPlaces(this.dusdDecimal, 1)
          .toString(10);
      }
    }
    return '';
  }
  created(): void {
    this.ICStableService = new ICStableService();
    this.init();
  }
  private connectWallet(): void {
    this.$router.push({
      path: '/login',
      query: { redirect: this.$route.fullPath }
    });
  }
  private init(): void {
    this.clearInterval();
    this.depositAmount = '';
    this.depositAmountInput = '';
    this.dusdAmountInput = '';
    this.paybackDusdAmountInput = '';
    this.tokenId = this.$route.params.tokenId;
    this.dpId = this.$route.params.dpId;
    if (this.dpId) {
      if (this.operateType === 'open') {
        this.operateType = 'add';
      }
      this.getDp();
    } else {
      this.currentDepositAmount = '0';
      this.currentDusdDebt = '0';
    }
    const principal = localStorage.getItem('principal');
    this.principal = principal;
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    this.tokensBalance = currentInfo.tokensBalance || {};
    try {
      if (this.tokenId) {
        const localTokens = JSON.parse(localStorage.getItem('tokens')) || {};
        if (!localTokens[this.tokenId]) {
          this.getTokens();
        } else {
          this.tokenInfo = localTokens[this.tokenId];
          this.getTokenBalance();
          this.getIntervalPrice();
        }
      }
      this.getConfig();
      this.getPrice();
      this.getCollaterals();
    } catch (e) {
    }
  }
  private back(): void {
    if (!this.dpId) {
      this.$router.push('/ICStable');
    } else {
      this.$router.push('/ICStable/positions');
    }
  }
  private maxGenerateDusd(): void {
    if (new BigNumber(this.cGenerateDusd).gt(0)) {
      this.dusdAmountInput = this.cGenerateDusd;
      this.dusdAmountChange();
    }
  }
  private maxAvailableWithdrawCollateral(): void {
    if (new BigNumber(this.cAvailableWithdrawCollateral).gt(0)) {
      this.depositAmountInput = this.cAvailableWithdrawCollateral;
      this.depositAmountChange();
    }
  }
  private changeOperateMenu(type: OperateType): void {
    this.operateType = type;
    this.depositAmountInput = '';
    this.dusdAmountInput = '';
    this.paybackDusdAmountInput = '';
    if (type === 'payback') {
      this.paybackDusdAmountInput = this.currentDusdDebt;
      this.depositAmount = '0';
    }
  }
  private async getCollaterals(): Promise<void> {
    const collaterals = await this.ICStableService.collaterals();
    collaterals.some((collateral) => {
      if (collateral[0].toString() === this.tokenId) {
        this.collateral = collateral;
        return true;
      }
    });
  }
  private async getDp(): Promise<void> {
    const res = await this.ICStableService.dp(BigInt(this.dpId));
    if (res && res.length) {
      const status = Object.keys(res[0].status)[0];
      if (status === 'Opening') {
        this.currentDepositAmount = new BigNumber(
          res[0].collaterals[0][2].toString(10)
        )
          .div(10 ** this.tokenInfo.decimals)
          .decimalPlaces(this.tokenInfo.decimals)
          .toString(10);
      } else {
        this.currentDepositAmount = '0';
      }
      this.currentDusdDebt = new BigNumber(res[0].debt.toString(10))
        .div(10 ** this.dusdDecimal)
        .decimalPlaces(this.dusdDecimal)
        .toString(10);
      this.currentCollaterals = res[0].collaterals;
      this.dpInfo = res[0];
      this.payable = new BigNumber(res[0].payable.toString(10))
        .div(10 ** this.dusdDecimal)
        .decimalPlaces(this.dusdDecimal)
        .toString(10);
    }
  }
  private async approve(
    tokenId: string,
    tokenStd: TokenStd,
    amount: bigint
  ): Promise<boolean> {
    const tokenToStd = Object.keys(tokenStd)[0];
    const currentDrc20Token = new DRC20TokenService();
    if (tokenToStd === PairTokenStdMenu.dip20) {
      try {
        const res = await currentDrc20Token.approve(
          tokenId,
          Principal.fromText(IC_STABLE_CANISTER_ID),
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
                Err: TxReceiptErr;
              }
            ).Err
          )[0];
          this.$message.error(err);
          this.openLoading.close();
          return false;
        }
      } catch (e) {
        this.openLoading.close();
        return false;
      }
    } else {
      try {
        const principal = localStorage.getItem('principal');
        const nonceRes = await currentDrc20Token.txnQuery(
          {
            txnCount: { owner: principal }
          },
          tokenId
        );
        const nonce = (
          nonceRes as {
            txnCount: bigint;
          }
        ).txnCount;
        const res = await currentDrc20Token.drc20Approve(
          amount,
          [],
          IC_STABLE_CANISTER_ID,
          [nonce],
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
          this.openLoading.close();
          return false;
        }
      } catch (e) {
        this.openLoading.close();
        return false;
      }
    }
  }
  private async open(): Promise<void> {
    this.openLoading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const amount = BigInt(
        new BigNumber(this.depositAmountInput)
          .times(10 ** this.tokenInfo.decimals)
          .toString(10)
      );
      const canOpen = await this.approve(
        this.tokenId,
        this.tokenInfo.tokenStd,
        amount
      );
      if (canOpen) {
        const res = await this.ICStableService.open([
          [Principal.fromText(this.tokenId), amount]
        ]);
        if (
          (
            res as {
              ok: TxnResultOk;
            }
          ).ok
        ) {
          this.$message.success('Debt position configuring success');
          const dpId = (
            res as {
              ok: TxnResultOk;
            }
          ).ok.dpid.toString(10);
          await this.$router.push(`/ICStable/open/${this.tokenId}/${dpId}`);
        } else {
          this.$message.error((res as { err: StableTxnResultErr }).err.message);
        }
      }
    } catch (e) {
    }
    this.openLoading.close();
  }
  private async add(): Promise<void> {
    this.openLoading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const amount = BigInt(
        new BigNumber(this.depositAmountInput)
          .times(10 ** this.tokenInfo.decimals)
          .toString(10)
      );
      const canOpen = await this.approve(
        this.tokenId,
        this.tokenInfo.tokenStd,
        amount
      );
      if (canOpen) {
        const res = await this.ICStableService.add(BigInt(this.dpId), [
          [Principal.fromText(this.tokenId), amount]
        ]);
        if (
          (
            res as {
              ok: TxnResultOk;
            }
          ).ok
        ) {
          this.$message.success('Add Collateral Success');
          this.init();
        } else {
          this.$message.error((res as { err: StableTxnResultErr }).err.message);
        }
      }
    } catch (e) {
    }
    this.openLoading.close();
  }
  private async remove(): Promise<void> {
    this.openLoading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const amount = BigInt(
        new BigNumber(this.depositAmountInput)
          .times(10 ** this.tokenInfo.decimals)
          .toString(10)
      );
      const shares = BigInt(
        new BigNumber(amount.toString(10))
          .div(this.currentCollaterals[0][1].toString(10))
          .times(this.currentCollaterals[0][2].toString(10))
          .decimalPlaces(0, 1)
          .toString(10)
      );
      const res = await this.ICStableService.remove(BigInt(this.dpId), [
        Principal.fromText(this.tokenId),
        [shares]
      ]);
      if (
        (
          res as {
            ok: TxnResultOk;
          }
        ).ok
      ) {
        this.$message.success('Withdraw Collateral Success');
        this.init();
      } else {
        this.$message.error((res as { err: StableTxnResultErr }).err.message);
      }
    } catch (e) {
    }
    this.openLoading.close();
  }
  private async generate(): Promise<void> {
    this.openLoading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const amount = BigInt(
        new BigNumber(this.dusdAmountInput)
          .times(10 ** this.dusdDecimal)
          .toString(10)
      );
      const res = await this.ICStableService.generate(BigInt(this.dpId), [
        amount
      ]);
      if (
        (
          res as {
            ok: TxnResultOk;
          }
        ).ok
      ) {
        this.$message.success('Generate DUSD Success');
        this.init();
      } else {
        this.$message.error((res as { err: StableTxnResultErr }).err.message);
      }
    } catch (e) {
    }
    this.openLoading.close();
  }
  private async payback(): Promise<void> {
    this.openLoading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      let chargeMethod: ChargeMethod;
      // payable
      // todo more 10min
      const n = new Date().getTime() / 1000 + 600;
      const payable = new BigNumber(this.currentDusdDebt)
        .times(10 ** this.dusdDecimal)
        .times(n - Number(this.dpInfo.timestamp))
        .times(this.config.INIT_STABILITY_FEE.toString(10))
        .div(10000)
        .div(365 * 24 * 3600)
        .plus(this.dpInfo.payable.toString(10))
        .div(10 ** this.dusdDecimal)
        .decimalPlaces(this.dusdDecimal);
      if (this.payableRadioType === 'DUSD') {
        chargeMethod = { DUSD: null };
        const DUSDDebt = BigInt(
          new BigNumber(this.currentDusdDebt)
            .plus(payable)
            .times(10 ** this.dusdDecimal)
            .decimalPlaces(0)
            .toString(10)
        );
        // const DUSDDebt = BigInt(5 * 10 ** 8);
        const canPayback = await this.approve(
          DUSD_CANISTER_ID,
          { drc20: null },
          DUSDDebt
        );
        if (!canPayback) {
          return;
        }
      } else {
        chargeMethod = { ICL: null };
        const DUSDDebtToIcl = new BigNumber(payable)
          .div(this.price[0][1][5].data[1].toString(10))
          .times(10 ** Number(this.price[0][1][5].decimals))
          .times(10 ** 8)
          .decimalPlaces(0)
          .toString(10);
        const canPaybackForDUSD = await this.approve(
          DUSD_CANISTER_ID,
          { drc20: null },
          BigInt(
            new BigNumber(this.currentDusdDebt)
              .times(10 ** this.dusdDecimal)
              .toString(10)
          )
        );
        const canPaybackForICL = await this.approve(
          IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
          { drc20: null },
          BigInt(DUSDDebtToIcl)
        );
        if (!canPaybackForDUSD || !canPaybackForICL) {
          return;
        }
      }
      const res = await this.ICStableService.payback(
        BigInt(this.dpId),
        chargeMethod
      );
      if (
        (
          res as {
            ok: TxnResultOk;
          }
        ).ok
      ) {
        this.$message.success('Payback Success');
        await this.$router.push('/ICStable/positions');
        // this.init();
      } else {
        this.$message.error((res as { err: StableTxnResultErr }).err.message);
      }
    } catch (e) {
    }
    this.openLoading.close();
  }
  private async getStats(): Promise<void> {
    this.stats = await this.ICStableService.stats();
    this.stats.assets.forEach((res) => {
      this.assetsStats[res[0].tokenId.toString()] = res[0];
    });
    localStorage.setItem(
      'stats',
      JSON.stringify(
        this.stats,
        (key, value) => (typeof value === 'bigint' ? value.toString(10) : value) // return everything else unchanged
      )
    );
  }
  private onConfirm(): void {
    if (this.operateType === 'open') {
      this.open();
    } else if (this.operateType === 'add') {
      this.add();
    } else if (this.operateType === 'remove') {
      this.remove();
    } else if (this.operateType == 'generate') {
      this.generate();
    } else if (this.operateType === 'payback') {
      this.payback();
    }
  }
  private dusdAmountChange(): void {
    if (this.dusdAmountInput) {
      this.depositAmount = this.currentDepositAmount;
    }
  }
  private depositAmountChange(): void {
    if (
      this.depositAmountInput &&
      this.collateral &&
      this.currentDepositAmount
    ) {
      if (this.dpId) {
        if (this.operateType === 'open' || this.operateType === 'add') {
          this.depositAmount = new BigNumber(this.depositAmountInput)
            .plus(this.currentDepositAmount)
            .toString(10);
        } else if (this.operateType === 'remove') {
          const depositAmount = new BigNumber(this.currentDepositAmount).minus(
            this.depositAmountInput
          );
          if (depositAmount.lt(0)) {
            this.depositAmount = '0';
          } else {
            this.depositAmount = depositAmount.toString(10);
          }
        }
      } else {
        this.depositAmount = this.depositAmountInput;
      }
      this.depositAmountToUsd = new BigNumber(this.depositAmountInput)
        .times(
          this.price[0][1][Number(this.collateral[2].mktSid)].data[1].toString(
            10
          )
        )
        .div(
          10 **
            Number(this.price[0][1][Number(this.collateral[2].mktSid)].decimals)
        )
        .toFixed(
          Number(this.price[0][1][Number(this.collateral[2].mktSid)].decimals)
        );
      // this.generateAmount = new BigNumber(this.depositAmount)
    } else {
      this.depositAmountToUsd = '0.0000';
    }
  }
  private async getTokenBalance(): Promise<void> {
    const tokenBalance = await getTokenBalance(
      this.tokenInfo.tokenStd,
      this.tokenId
    );
    this.$set(this.tokensBalance, this.tokenId, tokenBalance);
    const DUSDBalance = await getTokenBalance(
      { drc20: null },
      DUSD_CANISTER_ID
    );
    const ICLBalance = await getTokenBalance(
      { drc20: null },
      IC_LIGHTHOUSE_TOKEN_CANISTER_ID
    );
    this.$set(this.tokensBalance, DUSD_CANISTER_ID, DUSDBalance);
    this.$set(this.tokensBalance, IC_LIGHTHOUSE_TOKEN_CANISTER_ID, ICLBalance);
  }
  private getIntervalPrice(): void {
    this.timer = window.setInterval(async () => {
      setTimeout(async () => {
        this.getTokenBalance();
        this.getPrice();
        if (this.config && this.dpInfo) {
          const status = Object.keys(this.dpInfo.status)[0];
          if (status === 'Opening') {
            const n = new Date().getTime() / 1000;
            this.payable = new BigNumber(this.currentDusdDebt)
              .times(10 ** this.dusdDecimal)
              .times(n - Number(this.dpInfo.timestamp))
              .times(this.config.INIT_STABILITY_FEE.toString(10))
              .div(10000)
              .div(365 * 24 * 3600)
              .plus(this.dpInfo.payable.toString(10))
              .div(10 ** this.dusdDecimal)
              .decimalPlaces(this.dusdDecimal)
              .toString(10);
          }
        }
      });
    }, 5 * 1000);
  }
  private async getTokens(): Promise<void> {
    const tokens = await this.ICStableService.tokens();
    const DRC20Token = new DRC20TokenService();
    const localTokens = JSON.parse(localStorage.getItem('tokens')) || {};
    for (let i = 0; i < tokens.length; i++) {
      const tokenId = tokens[i][0].toString();
      if (!localTokens[tokenId]) {
        let std = Object.keys(tokens[i][1].std)[0];
        if (std === 'drc20') {
          DRC20Token.name(tokenId).then((name) => {
            const tokenInfo = {
              name: name,
              symbol: tokens[i][1].symbol,
              decimals: tokens[i][1].decimals,
              fee: tokens[i][1].gasToken,
              price: '',
              tokenStd: tokens[i][1].std
            };
            if (this.tokenId === tokenId) {
              this.tokenInfo = tokenInfo;
              this.getTokenBalance();
              this.getIntervalPrice();
            }
            localTokens[tokenId] = tokenInfo;
            localStorage.setItem(
              'tokens',
              JSON.stringify(
                localTokens,
                (key, value) =>
                  typeof value === 'bigint' ? value.toString(10) : value // return everything else unchanged
              )
            );
          });
        } else {
          DRC20Token.tokenName(tokenId).then((name) => {
            const tokenInfo = {
              name: name,
              symbol: tokens[i][1].symbol,
              decimals: tokens[i][1].decimals,
              fee: tokens[i][1].gasToken,
              price: '',
              tokenStd: tokens[i][1].std
            };
            if (this.tokenId === tokenId) {
              this.tokenInfo = tokenInfo;
              this.getTokenBalance();
              this.getIntervalPrice();
            }
            localTokens[tokenId] = tokenInfo;
            localStorage.setItem(
              'tokens',
              JSON.stringify(
                localTokens,
                (key, value) =>
                  typeof value === 'bigint' ? value.toString(10) : value // return everything else unchanged
              )
            );
          });
        }
      }
    }
  }
  private async getPrice(): Promise<void> {
    this.price = await this.ICStableService.getPrice();
  }
  private async getConfig(): Promise<void> {
    const res = await this.ICStableService.getConfig();
    this.config = res[1];
  }
}
</script>
<style scoped lang="scss">
.container-width {
  padding-bottom: 20px;
}
.dp-info {
  margin-bottom: 10px;
  color: #adb3c4;
  font-size: 16px;
}
.open-item-borrow-menu {
  margin-bottom: 40px;
  .open-item-borrow-menu-button {
    display: flex;
    margin-top: 30px;
    button {
      margin-right: 20px;
      font-size: 12px;
      line-height: 1;
      transition: all 0.35s;
      &.active {
        background: #51b7c3;
        border-color: #51b7c3;
        color: #fff;
      }
    }
  }
  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 415px;
    border-radius: 30px;
    background: #232730;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 195px;
      height: 40px;
      text-align: center;
      cursor: pointer;
      border-radius: 20px;
      transition: all 0.35s;
      color: #fff;
      &:last-child {
        margin: -1px -1px -1px 0;
      }
      &.active {
        background: #51b7c3;
        border-color: #51b7c3;
      }
    }
  }
}
.open-main-left {
  display: flex;
  flex-wrap: wrap;
  margin-right: 20px;
  .open-main-left-item-debt-info {
    display: flex;
    width: 100%;
    border-radius: 10px;
    background: #141b23;
    border: 1px solid #313b46;
    color: #727a87;
    padding: 25px 30px;
    margin-right: 15px;
    .open-main-left-item-current {
      font-size: 14px;
    }
    > div {
      flex: 1 1 0;
      padding-right: 10px;
      &:last-child {
        padding-right: 0;
      }
    }
  }
  .open-main-left-item {
    position: relative;
    width: calc(50% - 15px);
    height: 150px;
    margin: 0 15px 15px 0;
    border-radius: 10px;
    background: #141b23;
    border: 1px solid #313b46;
    color: #727a87;
    padding: 25px 30px;
    .open-main-left-item-bottom {
      position: absolute;
      bottom: 10px;
      left: 30px;
    }
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
  .question-circle {
    float: right;
    cursor: pointer;
  }
  .open-main-left-item-current {
    padding: 15px 0;
    color: #fff;
    font-size: 16px;
  }
  .open-main-left-item-after {
    display: inline-block;
    font-size: 12px;
    padding: 5px 8px;
    background: #313643;
    border-radius: 12px;
  }
}
@media screen and (max-width: 1200px) {
  .open-main-left {
    .open-main-left-item {
      width: 100%;
      min-width: 250px;
      &:nth-child(2n) {
        margin-right: 15px;
      }
    }
    .open-main-left-item-debt-info {
      flex-direction: column;
      > div {
        margin-top: 40px;
        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
}
.position-change {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #464648;
  line-height: 2.5;
  .position-change-title {
    font-size: 16px;
    color: #adb3c4;
    font-weight: bold;
  }
  .position-change-item-right {
    float: right;
    color: #adb3c4;
    i {
      margin: 0 8px;
      font-size: 12px;
    }
  }
}
.swap-button {
  margin: 30px 0 10px;
  button {
    line-height: 1 !important;
  }
}
.open-borrow {
  margin: 0 auto;
  max-width: 1200px;
}
.open-main {
  display: flex;
  align-items: flex-start;
}
.open-item-borrow {
  width: 465px;
  flex-shrink: 0;
  padding: 25px 25px 30px;
  margin-right: 20px;
  color: #727a87;
  line-height: 1.5;
  border-radius: 10px;
  background: #141b23;
  box-sizing: border-box;
  border: 1px solid #313b46;
  .open-item-borrow-title {
    font-size: 16px;
    color: #adb3c4;
    font-weight: bold;
  }
  .open-item-borrow-tip {
    color: #8c90a1;
  }
  .deposit-item {
    margin-top: 30px;
  }
}
.open-item-info {
  width: 250px;
  padding: 25px 30px;
  line-height: 1.5;
  background: #13181d;
  color: #727a87;
  border-radius: 9px;
  .open-item-info-item {
    margin-bottom: 20px;
    span {
      color: #adb3c4;
      font-weight: bold;
    }
  }
}
.swap-item-group {
  margin: 10px 0;
  &.disabled {
    background: #38393a !important;
    cursor: default;
  }
  input {
    &:disabled {
      background: #38393a !important;
      color: #727a87 !important;
    }
  }
}
.deposit-input {
  margin: 10px 0;
  border: 1px solid #464648 !important;
  background: #141b23;
  border-radius: 4px;
  input {
    background: #141b23 !important;
  }
  > div {
    padding: 0 0 5px 11px;
    color: #8c90a1;
    font-size: 12px;
  }
  .swap-item-group {
    margin: 0;
    border: none !important;
  }
}
.generate {
  margin-top: 20px;
}
.open-label {
  color: #adb3c4;
}
.ic-stable-main-header {
  width: 1200px;
  margin: 20px auto 20px;
  ul {
    display: flex;
    align-items: center;
    color: #727a87;
    li {
      border-right: 1px solid #13181d;
      padding: 5px 30px;
      i {
        cursor: pointer;
      }
      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        border-right: none;
      }
      .ic-stable-main-header-item-right {
        padding-left: 8px;
        color: #adb3c4;
        font-weight: bold;
      }
    }
  }
}
.payable-radio-group {
  ::v-deep span {
    color: #727a87;
  }
}
.payback-stability-fee {
  margin-top: 20px;
}
.max-value {
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    color: #1996c4;
  }
}
.ic-stable-main-header-back {
  color: #727a87;
  font-size: 18px;
  margin-bottom: 20px;
  i {
    cursor: pointer;
  }
}
@media screen and (max-width: 768px) {
  .position-change-item {
    display: flex;
    flex-direction: column;
  }
  .container-width {
    padding: 0 10px;
  }
  .open-main {
    flex-direction: column-reverse;
    .open-item-borrow {
      width: 100%;
    }
    .open-main-left {
      margin-top: 15px;
      margin-right: 0;
      .open-main-left-item {
        margin-right: 0;
      }
      .open-main-left-item-debt-info {
        margin-right: 0;
      }
    }
  }
  .ic-stable-main-header {
    width: 100%;
    ul {
      flex-wrap: wrap;
      justify-content: flex-start;
      li {
        padding-left: 0;
      }
    }
  }
  .open-item-borrow-menu {
    ul {
      width: 100%;
      li {
        width: 47%;
      }
    }
  }
}
</style>
