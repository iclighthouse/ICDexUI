<template>
  <div class="claim-liquidity-main ic-swap-main">
    <div class="exchange-swap-item">
      <div class="exchange-swap-item-top exchange-swap-item-top-allocable">
        <div style="width: 137px">Rewards Remaining:</div>
        <div v-if="feeStatus && currentPool && currentPool.length">
          <a-tooltip placement="top">
            <template slot="title">
              <span
                v-if="
                  currentPool[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'
                "
              >
                {{ feeStatus.totalFee.cyclesBalance | bigintToFloat(12) }}
                TCycles +
                {{ feeStatus.totalFee.icpBalance | bigintToFloat(8, 8) }} ICP
              </span>
              <span v-else>
                {{
                  feeStatus.totalFee.value0
                    | bigintToFloat(
                      tokens[currentPool[1][0].token0[0].toString()].decimals,
                      tokens[currentPool[1][0].token0[0].toString()].decimals
                    )
                }}
                {{ tokens[currentPool[1][0].token0[0].toString()].symbol }} +
                {{
                  feeStatus.totalFee.value1
                    | bigintToFloat(
                      tokens[currentPool[1][0].token1[0].toString()].decimals,
                      tokens[currentPool[1][0].token1[0].toString()].decimals
                    )
                }}
                {{ tokens[currentPool[1][0].token1[0].toString()].symbol }}
              </span>
            </template>
            <span
              v-if="currentPool[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'"
            >
              {{ feeStatus.totalFee.cyclesBalance | bigintToFloat(4) }} TCycles
              + {{ feeStatus.totalFee.icpBalance | bigintToFloat(4, 8) }} ICP
            </span>
            <span v-else>
              {{
                feeStatus.totalFee.value0
                  | bigintToFloat(
                    4,
                    tokens[currentPool[1][0].token0[0].toString()].decimals
                  )
              }}
              {{ tokens[currentPool[1][0].token0[0].toString()].symbol }} +
              {{
                feeStatus.totalFee.value1
                  | bigintToFloat(
                    4,
                    tokens[currentPool[1][0].token1[0].toString()].decimals
                  )
              }}
              {{ tokens[currentPool[1][0].token1[0].toString()].symbol }}
            </span>
          </a-tooltip>
        </div>
      </div>
      <div>
        <div class="your-rewards">
          <span style="width: 137px">Your Rewards:</span>
          <div>
            <span v-if="lpRewards">
              <a-tooltip placement="bottom">
                <template slot="title">
                  <span
                    v-if="
                      currentPool[0].toString() ===
                      '6nmrm-laaaa-aaaak-aacfq-cai'
                    "
                  >
                    <span class="base-color-w">
                      {{ lpRewards.cycles | bigintToFloat(12) }}
                    </span>
                    TCycles +
                    <span class="base-color-w">
                      {{ lpRewards.icp | bigintToFloat(8, 8) }}
                    </span>
                    ICP
                  </span>
                  <span v-else>
                    <span class="base-color-w">
                      {{
                        lpRewards.value0
                          | bigintToFloat(
                            tokens[currentPool[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPool[1][0].token0[0].toString()]
                              .decimals
                          )
                      }}
                    </span>
                    {{ tokens[currentPool[1][0].token0[0].toString()].symbol }}
                    +
                    <span class="base-color-w">
                      {{
                        lpRewards.value1
                          | bigintToFloat(
                            tokens[currentPool[1][0].token1[0].toString()]
                              .decimals,
                            tokens[currentPool[1][0].token1[0].toString()]
                              .decimals
                          )
                      }}
                    </span>
                    {{ tokens[currentPool[1][0].token1[0].toString()].symbol }}
                  </span>
                </template>
                <span
                  v-if="
                    currentPool[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'
                  "
                >
                  <span class="base-color-w">{{
                    lpRewards.cycles | bigintToFloat(4)
                  }}</span>
                  TCycles +
                  <span class="base-color-w">{{
                    lpRewards.icp | bigintToFloat(4, 8)
                  }}</span>
                  ICP
                </span>
                <span v-else>
                  <span class="base-color-w">
                    {{
                      lpRewards.value0
                        | bigintToFloat(
                          4,
                          tokens[currentPool[1][0].token0[0].toString()]
                            .decimals
                        )
                    }}
                  </span>
                  {{ tokens[currentPool[1][0].token0[0].toString()].symbol }}
                  +
                  <span class="base-color-w">
                    {{
                      lpRewards.value1
                        | bigintToFloat(
                          4,
                          tokens[currentPool[1][0].token1[0].toString()]
                            .decimals
                        )
                    }}
                  </span>
                  {{ tokens[currentPool[1][0].token1[0].toString()].symbol }}
                </span>
              </a-tooltip>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="exchange-swap-icon">
      <a-icon type="arrow-down" class="exchange-swap-icon-plus" />
    </div>
    <div class="exchange-swap-item">
      <div class="swap-item-top">
        <div class="ic-swap-item-top-left">
          <div
            v-if="
              currentPool &&
              currentPool.length &&
              tokens &&
              tokens[currentPool[1][0].token0[0].toString()]
            "
            class="swap-item-top-left"
          >
            <span class="img-content">
              <img
                v-if="tokens[currentPool[1][0].token0[0].toString()].logo"
                :src="tokens[currentPool[1][0].token0[0].toString()].logo"
                alt=""
              />
            </span>
            <span class="swap-item-top-left-name">{{
              tokens[currentPool[1][0].token0[0].toString()].symbol
            }}</span>
          </div>
          <a-select
            v-if="
              currentPool &&
              currentPool.length &&
              currentPool[1][0].token0[0].toString() ===
                '6nmrm-laaaa-aaaak-aacfq-cai'
            "
            class="input-cycles-select"
            v-model="cyclesCanister"
            placeholder="select cycles wallet Canister-id"
            notFoundContent="Not Found"
            option-label-prop="label"
            :filterOption="false"
          >
            <a-select-option
              v-for="wallet in wallets"
              :key="wallet.walletId.toString()"
              :label="wallet.walletId.toString()"
              >{{ wallet.walletId.toString() }}
              <a-icon
                class="remove-check-icon"
                v-if="wallet.isDefault"
                type="check-circle"
            /></a-select-option>
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0" />
              <div
                class="other-cycles"
                @mousedown="(e) => e.preventDefault()"
                @click="cyclesFormVisible = true"
              >
                Other
              </div>
            </div>
          </a-select>
        </div>
        <div
          v-if="
            currentPool &&
            currentPool.length &&
            lpRewards &&
            tokens[currentPool[1][0].token0[0].toString()]
          "
          class="swap-item-top-right"
          :class="{
            'swap-item-top-right-cycles':
              currentPool[1][0].token0[0].toString() ===
              '6nmrm-laaaa-aaaak-aacfq-cai'
          }"
        >
          <span
            v-if="currentPool[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'"
          >
            <span class="base-color-w">{{
              lpRewards.cycles | bigintToFloat(12)
            }}</span>
            TCycles
          </span>
          <span v-else>
            <span class="base-color-w">{{
              lpRewards.value0
                | bigintToFloat(
                  tokens[currentPool[1][0].token0[0].toString()].decimals,
                  tokens[currentPool[1][0].token0[0].toString()].decimals
                )
            }}</span>
            {{ tokens[currentPool[1][0].token0[0].toString()].symbol }}
          </span>
        </div>
      </div>
    </div>
    <div class="exchange-swap-icon">
      <a-icon type="plus" class="exchange-swap-icon-plus" />
    </div>
    <div class="exchange-swap-item">
      <div class="swap-item-top">
        <div class="ic-swap-item-top-left">
          <div
            v-if="
              currentPool &&
              currentPool.length &&
              tokens &&
              tokens[currentPool[1][0].token1[0].toString()]
            "
            class="swap-item-top-left"
          >
            <span class="img-content">
              <img
                v-if="tokens[currentPool[1][0].token1[0].toString()].logo"
                :src="tokens[currentPool[1][0].token1[0].toString()].logo"
                alt=""
              />
            </span>
            <span class="swap-item-top-left-name">{{
              tokens[currentPool[1][0].token1[0].toString()].symbol
            }}</span>
          </div>
          <a-select
            v-if="
              currentPool &&
              currentPool.length &&
              currentPool[1][0].token1[0].toString() ===
                '6nmrm-laaaa-aaaak-aacfq-cai'
            "
            class="input-cycles-select"
            v-model="cyclesCanister"
            placeholder="select cycles wallet Canister-id"
            notFoundContent="Not Found"
            option-label-prop="label"
            :filterOption="false"
          >
            <a-select-option
              v-for="wallet in wallets"
              :key="wallet.walletId.toString()"
              :label="wallet.walletId.toString()"
              >{{ wallet.walletId.toString() }}
              <a-icon
                class="remove-check-icon"
                v-if="wallet.isDefault"
                type="check-circle"
            /></a-select-option>
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0" />
              <div
                class="other-cycles"
                @mousedown="(e) => e.preventDefault()"
                @click="cyclesFormVisible = true"
              >
                Other
              </div>
            </div>
          </a-select>
        </div>
        <div
          v-if="
            lpRewards &&
            currentPool &&
            currentPool.length &&
            tokens &&
            tokens[currentPool[1][0].token1[0].toString()]
          "
          class="swap-item-top-right"
        >
          <span
            v-if="currentPool[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'"
          >
            <span class="base-color-w">{{
              lpRewards.icp | bigintToFloat(8, 8)
            }}</span>
            ICP
          </span>
          <span v-else>
            <span class="base-color-w">
              {{
                lpRewards.value1
                  | bigintToFloat(
                    tokens[currentPool[1][0].token1[0].toString()].decimals,
                    tokens[currentPool[1][0].token1[0].toString()].decimals
                  )
              }}
            </span>
            {{ tokens[currentPool[1][0].token1[0].toString()].symbol }}
          </span>
        </div>
      </div>
    </div>
    <div class="swap-button w100">
      <button
        class="primary large-primary w100"
        :disabled="buttonDisabled"
        @click="claim"
      >
        {{ buttonName }}
      </button>
      <div class="cycles-finance-tip">
        It takes 3 to 20 seconds to update the balance after the transaction is
        completed.
      </div>
    </div>
    <a-modal
      v-model="cyclesFormVisible"
      width="550px"
      title=""
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="other-cycles-modal delete-modal"
      :after-close="closeCyclesForm"
    >
      <a-form-model
        :model="cyclesForm"
        ref="cyclesForm"
        :rules="cyclesFormRules"
      >
        <a-form-model-item label="Canister ID" prop="cyclesCanister">
          <a-input
            autocomplete="off"
            v-model="cyclesForm.cyclesCanister"
            type="text"
            placeholder="Canister ID(Principal)"
          />
        </a-form-model-item>
      </a-form-model>
      <div class="delete-button">
        <button @click="cyclesFormVisible = false">Cancel</button>
        <button class="default" @click="ConfirmOtherCycles">Confirm</button>
      </div>
    </a-modal>
    <a-modal
      v-model="claimLiquidityVisible"
      width="600px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <div class="swap-progress-header mt20">
        <span>Claim liquidity in progress </span>
      </div>
      <div class="swap-progress-tip">
        Please wait some time for transactions to finish
      </div>
      <div class="swap-progress-main">
        <div class="swap-progress-item">
          <div
            class="swap-progress-item-icon"
            :class="{
              'swap-progress-item-icon-progress': claimLiquidityStep >= 0
            }"
          >
            <a-icon type="fire" />
            <span
              v-show="claimLiquidityStep === 0"
              class="progress-loading"
            ></span>
            <a-icon
              v-show="claimLiquidityStep > 0"
              class="progress-check-circle"
              theme="twoTone"
              type="check-circle"
            />
          </div>
          <div
            class="swap-progress-item-info"
            :class="{
              'swap-progress-item-info-progress': claimLiquidityStep >= 0
            }"
          >
            Claiming<br />liquidity
          </div>
        </div>
        <!--<div class="swap-progress-step">
          <a-icon class="progress-step" type="arrow-right" />
        </div>
        <div class="swap-progress-item">
          <div
            class="swap-progress-item-icon"
            :class="{
              'swap-progress-item-icon-progress': claimLiquidityStep >= 1
            }"
          >
            <a-icon type="swap" />
            <span
              v-show="claimLiquidityStep === 1"
              class="progress-loading"
            ></span>
            <a-icon
              v-show="claimLiquidityStep > 1"
              class="progress-check-circle"
              theme="twoTone"
              type="check-circle"
            />
          </div>
          <div
            class="swap-progress-item-info"
            :class="{
              'swap-progress-item-info-progress': claimLiquidityStep >= 1
            }"
          >
            Withdrawing<br />liquidity
          </div>
        </div>-->
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { TokenInfo } from '@/ic/common/icType';
import { Pool } from '@/views/home/ICSwap/model';
import { FeeStatus, LpRewards } from '@/ic/cyclesFinance/model';
import {
  FeeBalance,
  ICSwapFeeStatus,
  SwapTxnResultErr,
  TxnResultOk
} from '@/ic/ICSwap/model';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { CYCLES_FINANCE_CANISTER_ID } from '@/ic/utils';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { ICSwapService } from '@/ic/ICSwap/ICSwapService';
import { getFee } from '@/ic/getTokenFee';
import { principalToAccountIdentifier } from '@/ic/converter';
import { ManageWalletResponse } from '@/ic/ICLighthouse/model';
import { validateCyclesWalletCanister } from '@/utils/validate';
import { checkAuth } from '@/ic/CheckAuth';

@Component({
  name: 'Claim',
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: () => null })
  tokens!: { [key: string]: TokenInfo };
  @Prop({ type: Array, default: () => [] })
  currentPool!: Pool;
  private feeStatus: FeeStatus | ICSwapFeeStatus = null;
  private lpRewards: LpRewards | FeeBalance = null;
  private buttonName = 'Claim rewards';
  private cyclesFinanceService: CyclesFinanceService;
  private cyclesCanister = '';
  private wallets: ManageWalletResponse[] = [];
  private ICLighthouseService: ICLighthouseService;
  private claimLiquidityVisible = false;
  private claimLiquidityStep = 0;
  private cyclesFormVisible = false;
  private cyclesForm = {
    cyclesCanister: ''
  };
  private cyclesFormRules = {
    cyclesCanister: [
      {
        required: true,
        message: 'Please enter cycles wallet',
        trigger: 'blur'
      },
      { validator: validateCyclesWalletCanister, trigger: 'blur' }
    ]
  };
  get buttonDisabled(): boolean {
    let flag = false;
    if (
      this.lpRewards &&
      this.tokens &&
      this.tokens[this.currentPool[1][0].token0[0].toString()] &&
      this.tokens[this.currentPool[1][0].token1[0].toString()]
    ) {
      let token0Value: bigint;
      let token1Value: bigint;
      const swapId = this.currentPool[0].toString();
      if (swapId === CYCLES_FINANCE_CANISTER_ID) {
        token0Value = (this.lpRewards as LpRewards).cycles;
        token1Value = (this.lpRewards as LpRewards).icp;
      } else {
        token0Value = (this.lpRewards as FeeBalance).value0;
        token1Value = (this.lpRewards as FeeBalance).value1;
      }
      if (
        (!token0Value && !token1Value) ||
        (token0Value === BigInt(0) && token1Value === BigInt(0)) ||
        (new BigNumber(
          getFee(
            this.tokens[this.currentPool[1][0].token0[0].toString()]
          ).toString(10)
        ).gt(token0Value.toString(10)) &&
          new BigNumber(
            getFee(
              this.tokens[this.currentPool[1][0].token1[0].toString()]
            ).toString(10)
          ).gt(token1Value.toString(10)))
      ) {
        this.buttonName = 'Claim rewards';
        flag = true;
      }
    } else {
      this.buttonName = 'Claim rewards';
      flag = true;
    }
    return flag;
  }
  public init(): void {
    console.log(this.currentPool);
    this.cyclesFinanceService = new CyclesFinanceService();
    this.ICLighthouseService = new ICLighthouseService();
    this.feeStatus = null;
    this.lpRewards = null;
    this.getFeeStatus();
    this.getLpRewards();
    this.getWallets();
  }
  private ConfirmOtherCycles(): void {
    (this.$refs as any).cyclesForm.validate((valid: any) => {
      if (valid) {
        this.cyclesCanister = this.cyclesForm.cyclesCanister;
        this.cyclesFormVisible = false;
      }
    });
  }
  private closeCyclesForm(): void {
    (this.$refs as any).cyclesForm.resetFields();
  }
  private async getWallets(): Promise<void> {
    const wallets = await this.ICLighthouseService.getWallets();
    const obj = {};
    this.wallets = wallets.reduce((cur, next) => {
      obj[next.walletId.toString()]
        ? ''
        : (obj[next.walletId.toString()] = true && cur.push(next));
      return cur;
    }, []);
    this.setCyclesCanister();
  }
  private setCyclesCanister(): void {
    let cyclesCanister;
    if (this.wallets.length) {
      for (let i = 0; i < this.wallets.length; i++) {
        if (this.wallets[i].isDefault) {
          cyclesCanister = this.wallets[i].walletId.toString();
          break;
        }
      }
      if (!cyclesCanister) {
        this.cyclesCanister = this.wallets[0].walletId.toString();
      } else {
        this.cyclesCanister = cyclesCanister;
      }
    } else {
      this.cyclesCanister = '';
    }
  }
  private async getFeeStatus(): Promise<void> {
    const swapId = this.currentPool[0].toString();
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      const cyclesFinanceService = new CyclesFinanceService();
      this.feeStatus = await cyclesFinanceService.feeStatus();
    } else {
      const currentSwapService = new ICSwapService();
      this.feeStatus = await currentSwapService.feeStatus(swapId);
    }
    console.log(this.feeStatus);
  }
  private async getLpRewards(): Promise<void> {
    const principal = localStorage.getItem('principal');
    const swapId = this.currentPool[0].toString();
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      const cyclesFinanceService = new CyclesFinanceService();
      this.lpRewards = await cyclesFinanceService.getLpRewards(principal);
    } else {
      const currentSwapService = new ICSwapService();
      this.lpRewards = await currentSwapService.lpRewards(swapId, principal);
    }
    console.log(this.lpRewards);
  }
  private async getCount(principal: Principal): Promise<bigint> {
    return await this.cyclesFinanceService.getCount([
      principalToAccountIdentifier(principal)
    ]);
  }
  private async claim(): Promise<void> {
    await checkAuth();
    const principal = localStorage.getItem('principal');
    this.claimLiquidityVisible = true;
    this.claimLiquidityStep = 0;
    console.time();
    const swapId = this.currentPool[0].toString();
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      const nonce = await this.getCount(Principal.fromText(principal));
      this.cyclesFinanceService
        .claim(Principal.fromText(this.cyclesCanister.trim()), [nonce])
        .then(async () => {
          this.claimLiquidityStep = 1;
          this.claimLiquidityVisible = false;
          this.$message.success('Claim Success');
          this.setCyclesCanister();
          this.getFeeStatus();
          this.getLpRewards();
        })
        .catch((e) => {
          console.log(e);
          this.$message.error(e.message);
          this.claimLiquidityVisible = false;
          this.setCyclesCanister();
        });
    } else {
      const currentSwapService = new ICSwapService();
      try {
        const res = await currentSwapService.claim(swapId);
        if (
          (
            res as {
              ok: TxnResultOk;
            }
          ).ok
        ) {
          this.claimLiquidityStep = 1;
          this.claimLiquidityVisible = false;
          this.$message.success('Claim Success');
          this.getFeeStatus();
          this.getLpRewards();
        } else {
          this.claimLiquidityVisible = false;
          this.setCyclesCanister();
          this.$message.error((res as { err: SwapTxnResultErr }).err.message);
        }
        console.timeEnd();
      } catch (e) {
        console.log(e);
        this.claimLiquidityVisible = false;
        this.setCyclesCanister();
      }
    }
  }
}
</script>

<style scoped lang="scss">
.your-rewards {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  > span {
    flex-shrink: 0;
  }
  div {
    display: flex;
    flex-direction: column;
  }
}
.exchange-swap-item-top-allocable {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}
.swap-item-top-left {
  cursor: default !important;
  .swap-item-top-left-name {
    padding: 0 !important;
  }
}
.swap-item-top-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: transparent;
  text-align: right;
  &.swap-item-top-right-cycles {
    height: 36px;
    margin-top: 46px;
  }
}
.other-cycles {
  padding: 5px 12px;
  cursor: pointer;
  color: #727a87;
  transition: all 0.3s;
  &:hover {
    background: #1996c4;
    color: #fff;
  }
}
.other-cycles-modal {
  ::v-deep .ant-modal-body {
    padding: 30px 55px 10px;
  }
}
</style>
