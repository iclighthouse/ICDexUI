<template>
  <div class="remove-liquidity-main ic-swap-main">
    <div class="exchange-swap-item">
      <div class="exchange-swap-item-top">
        <div>Burn Shares</div>
        <a-input
          class="margin-left-auto"
          v-if="currentPool && currentPool.length"
          v-model="shares"
          autocomplete="off"
          v-only-float="currentPool[4]"
          :key="currentPool[4]"
          min="0"
          placeholder="0"
          type="text"
        />
      </div>
      <div class="exchange-swap-item-bottom">
        <span
          class="margin-left-auto exchange-swap-item-bottom-fee-share"
          @click="setMaxShare"
          >Max</span
        >
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
                @click="showWallets"
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
            tokens &&
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
            <span class="base-color-w">{{ shareValue0 }}</span> TCycles
          </span>
          <span v-else>
            <span class="base-color-w">{{ shareValue0 }}</span>
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
        <div
          v-if="
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
            <span class="base-color-w">{{ shareValue1 }}</span> ICP
          </span>
          <span v-else>
            <span class="base-color-w">{{ shareValue1 }}</span>
            {{ tokens[currentPool[1][0].token1[0].toString()].symbol }}
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="
        principal &&
        currentPool &&
        currentPool.length &&
        tokens &&
        tokens[currentPool[1][0].token0[0].toString()] &&
        tokens[currentPool[1][0].token1[0].toString()]
      "
      class="auto-withdraw"
    >
      <a-checkbox :checked="!autoWithdraw" @change="onchange">
        Keep {{ tokens[currentPool[1][0].token0[0].toString()].symbol }} and
        {{ tokens[currentPool[1][0].token1[0].toString()].symbol }} in Contract
        after liquidity
      </a-checkbox>
    </div>
    <div class="swap-button w100">
      <button
        v-if="principal"
        :disabled="buttonDisabled"
        class="primary large-primary w100"
        @click="remove"
      >
        {{ buttonName }}
      </button>
      <button v-else class="primary large-primary w100" @click="connectWallet">
        Connect Wallet
      </button>
      <div class="cycles-finance-tip">
        It takes 3 to 20 seconds to update balance after the transaction is
        completed.
      </div>
    </div>
    <select-wallet
      ref="selectWallet"
      @cyclesCanisterChange="cyclesCanisterChange"
    ></select-wallet>
    <a-modal
      v-model="removeLiquidityVisible"
      width="600px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <div class="swap-progress-header mt20">
        <span>Remove liquidity in progress </span>
      </div>
      <div class="swap-progress-tip">
        Please wait some time for transactions to finish
      </div>
      <div class="swap-progress-main">
        <div class="swap-progress-item">
          <div
            class="swap-progress-item-icon"
            :class="{
              'swap-progress-item-icon-progress': removeLiquidityStep >= 0
            }"
          >
            <a-icon type="fire" />
            <span
              v-show="removeLiquidityStep === 0"
              class="progress-loading"
            ></span>
            <a-icon
              v-show="removeLiquidityStep > 0"
              class="progress-check-circle"
              theme="twoTone"
              type="check-circle"
            />
          </div>
          <div
            class="swap-progress-item-info"
            :class="{
              'swap-progress-item-info-progress': removeLiquidityStep >= 0
            }"
          >
            Removing<br />liquidity
          </div>
        </div>
        <div
          class="swap-progress-step"
          v-if="
            currentPool &&
            currentPool[0].toString() !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
            autoWithdraw
          "
        >
          <a-icon class="progress-step" type="arrow-right" />
        </div>
        <div
          v-if="
            currentPool &&
            currentPool[0].toString() !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
            autoWithdraw
          "
          class="swap-progress-item"
        >
          <div
            class="swap-progress-item-icon"
            :class="{
              'swap-progress-item-icon-progress': removeLiquidityStep >= 1
            }"
          >
            <a-icon type="swap" />
            <span
              v-show="removeLiquidityStep === 1"
              class="progress-loading"
            ></span>
            <a-icon
              v-show="removeLiquidityStep > 1"
              class="progress-check-circle"
              theme="twoTone"
              type="check-circle"
            />
          </div>
          <div
            class="swap-progress-item-info"
            :class="{
              'swap-progress-item-info-progress': removeLiquidityStep >= 1
            }"
          >
            <div
              v-if="
                currentPool &&
                currentPool.length &&
                tokens &&
                tokens[currentPool[1][0].token0[0].toString()] &&
                tokens[currentPool[1][0].token1[0].toString()]
              "
            >
              Withdrawing<br />
              {{ tokens[currentPool[1][0].token0[0].toString()].symbol
              }}<a-icon type="plus" />{{
                tokens[currentPool[1][0].token1[0].toString()].symbol
              }}
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <top-up
      ref="topUp"
      :balance="icpBalance"
      @topUpSuccess="topUpSuccess"
    ></top-up>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import SelectWallet from './selectWallet.vue';
import { TokenInfo } from '@/ic/common/icType';
import { Pool } from '@/views/home/ICSwap/model';
import BigNumber from 'bignumber.js';
import { CYCLES_FINANCE_CANISTER_ID } from '@/ic/utils';
import { Liquidity } from '@/ic/cyclesFinance/model';
import {
  SwapTxnResultErr,
  TokenLiquidity,
  TxnResultOk
} from '@/ic/ICSwap/model';
import { getFee } from '@/ic/getTokenFee';
import { ICSwapService } from '@/ic/ICSwap/ICSwapService';
import { ManageWalletResponse } from '@/ic/ICLighthouse/model';
import { checkAuth } from '@/ic/CheckAuth';
import { principalToAccountIdentifier } from '@/ic/converter';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { readState } from '@/ic/readState';
import { WalletService } from '@/ic/wallet/walletService';
import { ICManagementService } from '@/ic/ICManagement/ICManagementService';
import TopUp from '@/components/topUp/Index.vue';

@Component({
  name: 'RemoveLiquidity',
  components: {
    TopUp,
    SelectWallet,
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
  private shares = '';
  private buttonName = 'Remove liquidity';
  private cyclesCanister = '';
  private ICLighthouseService: ICLighthouseService;
  private cyclesFinanceService: CyclesFinanceService;
  private wallets: ManageWalletResponse[] = [];
  public walletService: WalletService;
  private ICManagementService: ICManagementService;
  private removeLiquidityVisible = false;
  private removeLiquidityStep = 0;
  private principal = '';
  private autoWithdraw = true;
  private icpBalance = '';
  get buttonDisabled(): boolean {
    let flag = false;
    if (
      this.currentPool &&
      this.currentPool[3] &&
      this.tokens &&
      this.tokens[this.currentPool[1][0].token0[0].toString()] &&
      this.tokens[this.currentPool[1][0].token1[0].toString()]
    ) {
      if (Number(this.shares)) {
        this.buttonName = 'Remove liquidity';
        if (this.currentPool[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
          if (!this.cyclesCanister) {
            this.buttonName = 'Please enter cycles wallet';
            flag = true;
          }
        }
        const maxShares = this.currentPool[3].shares;
        const shares = new BigNumber(this.shares).times(
          10 ** this.currentPool[4]
        );
        if (shares.gt(maxShares.toString(10))) {
          this.buttonName = 'Insufficient Shares';
          flag = true;
          return flag;
        }
        if (
          new BigNumber(this.shareValue0)
            .times(
              10 **
                this.tokens[this.currentPool[1][0].token0[0].toString()]
                  .decimals
            )
            .lt(
              getFee(
                this.tokens[this.currentPool[1][0].token0[0].toString()]
              ).toString(10)
            ) &&
          new BigNumber(this.shareValue1)
            .times(
              10 **
                this.tokens[this.currentPool[1][0].token1[0].toString()]
                  .decimals
            )
            .lt(
              getFee(
                this.tokens[this.currentPool[1][0].token1[0].toString()]
              ).toString(10)
            )
        ) {
          this.buttonName = 'Unavailable shares value';
          flag = true;
          return flag;
        }
      } else {
        this.buttonName = 'Remove liquidity';
        flag = true;
      }
    } else {
      this.buttonName = 'Remove liquidity';
      flag = true;
    }
    return flag;
  }
  get shareValue0(): string {
    let value = '0';
    if (
      Number(this.shares) &&
      this.currentPool &&
      this.currentPool[3] &&
      this.tokens &&
      this.tokens[this.currentPool[1][0].token0[0].toString()]
    ) {
      const maxShares = this.currentPool[3].shares;
      const shares = new BigNumber(this.shares).times(
        10 ** this.currentPool[4]
      );
      const swapId = this.currentPool[0].toString();
      let value0: BigInt;
      if (swapId === CYCLES_FINANCE_CANISTER_ID) {
        value0 = (this.currentPool[3] as Liquidity).cycles;
      } else {
        value0 = (this.currentPool[3] as TokenLiquidity).token0;
      }
      if (new BigNumber(maxShares.toString(10)).lt(shares)) {
        value = new BigNumber(value0.toString(10))
          .div(
            10 **
              this.tokens[this.currentPool[1][0].token0[0].toString()].decimals
          )
          .decimalPlaces(
            this.tokens[this.currentPool[1][0].token0[0].toString()].decimals,
            1
          )
          .toString(10);
      } else {
        value = new BigNumber(shares)
          .div(maxShares.toString(10))
          .times(value0.toString(10))
          .div(
            10 **
              this.tokens[this.currentPool[1][0].token0[0].toString()].decimals
          )
          .decimalPlaces(
            this.tokens[this.currentPool[1][0].token0[0].toString()].decimals,
            1
          )
          .toString(10);
      }
    }
    return value;
  }
  get shareValue1(): string {
    let value = '0';
    if (
      Number(this.shares) &&
      this.currentPool &&
      this.currentPool[3] &&
      this.tokens &&
      this.tokens[this.currentPool[1][0].token1[0].toString()]
    ) {
      const maxShares = this.currentPool[3].shares;
      const shares = new BigNumber(this.shares).times(
        10 ** this.currentPool[4]
      );
      const swapId = this.currentPool[0].toString();
      let value1: BigInt;
      if (swapId === CYCLES_FINANCE_CANISTER_ID) {
        value1 = (this.currentPool[3] as Liquidity).icpE8s;
      } else {
        value1 = (this.currentPool[3] as TokenLiquidity).token1;
      }
      if (new BigNumber(maxShares.toString(10)).lt(shares)) {
        value = new BigNumber(value1.toString(10))
          .div(
            10 **
              this.tokens[this.currentPool[1][0].token1[0].toString()].decimals
          )
          .decimalPlaces(
            this.tokens[this.currentPool[1][0].token1[0].toString()].decimals,
            1
          )
          .toString(10);
      } else {
        value = new BigNumber(shares)
          .div(maxShares.toString(10))
          .times(value1.toString(10))
          .div(
            10 **
              this.tokens[this.currentPool[1][0].token1[0].toString()].decimals
          )
          .decimalPlaces(
            this.tokens[this.currentPool[1][0].token1[0].toString()].decimals,
            1
          )
          .toString(10);
      }
      if (swapId === CYCLES_FINANCE_CANISTER_ID) {
        // ICP fee
        value = new BigNumber(value).minus(0.0001).toString(10);
      }
      if (new BigNumber(value).lt(0)) {
        value = '0';
      }
    }
    return value;
  }
  created(): void {
    this.principal = localStorage.getItem('principal');
    this.ICLighthouseService = new ICLighthouseService();
    this.walletService = new WalletService();
    this.ICManagementService = new ICManagementService();
    this.cyclesFinanceService = new CyclesFinanceService();
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    this.icpBalance = currentInfo.balance || '0';
    if (this.principal) {
      this.getWallets();
    }
  }
  private topUpSuccess(): void {
    //
  }
  private onchange(): void {
    this.autoWithdraw = !this.autoWithdraw;
    console.log(this.autoWithdraw);
  }
  public async getAutoWithdrawal(swapId: string): Promise<void> {
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      this.autoWithdraw = true;
    } else {
      const principal = localStorage.getItem('principal');
      console.log(swapId, principal);
      const currentICSwapService = new ICSwapService();
      this.autoWithdraw = await currentICSwapService.autoWithdrawal(
        swapId,
        principal
      );
    }
    console.log(this.autoWithdraw);
  }
  private connectWallet(): void {
    this.$router.push({
      path: '/login',
      query: { redirect: this.$route.fullPath }
    });
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
  private cyclesCanisterChange(val: string): void {
    this.cyclesCanister = val;
  }
  private showWallets(): void {
    (this.$refs as any).selectWallet.cyclesFormVisible = true;
  }
  private setMaxShare(): void {
    this.shares = new BigNumber(this.currentPool[3].shares.toString(10))
      .div(10 ** this.currentPool[4])
      .toString(10);
  }
  private async getCount(principal: Principal): Promise<bigint> {
    return await this.cyclesFinanceService.getCount([
      principalToAccountIdentifier(principal)
    ]);
  }
  private async claim(): Promise<void> {
    const principal = localStorage.getItem('principal');
    console.time();
    const swapId = this.currentPool[0].toString();
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      const nonce = await this.getCount(Principal.fromText(principal));
      this.cyclesFinanceService
        .claim(Principal.fromText(this.cyclesCanister.trim()), [nonce])
        .then(async () => {
          this.removeLiquidityStep = 2;
          this.removeLiquidityVisible = false;
        })
        .catch((e) => {
          console.log(e);
          // this.$message.error(e.message);
          this.removeLiquidityVisible = false;
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
          this.removeLiquidityStep = 2;
          this.removeLiquidityVisible = false;
        } else {
          this.removeLiquidityVisible = false;
          // this.$message.error((res as { err: SwapTxnResultErr }).err.message);
        }
        this.shares = '';
        this.setCyclesCanister();
        console.timeEnd();
      } catch (e) {
        console.log(e);
        this.removeLiquidityVisible = false;
        this.setCyclesCanister();
      }
    }
  }
  private initRemove(): void {
    this.removeLiquidityVisible = false;
    this.setCyclesCanister();
    this.shares = '';
    this.$emit('removeLiquiditySuccess');
  }
  public async checkCycles(cyclesWallet: string): Promise<boolean> {
    let flag = true;
    const isCyclesWallet = this.wallets.some((wallet) => {
      return wallet.walletId.toString() === cyclesWallet;
    });
    if (!isCyclesWallet) {
      return flag;
    }
    let cycles;
    try {
      const res = await this.walletService.getWalletBalance(cyclesWallet);
      cycles = res.amount;
    } catch (e) {
      try {
        const status = await this.ICManagementService.canisterStatus(
          Principal.fromText(cyclesWallet)
        );
        if (status.canisterId === cyclesWallet) {
          cycles = status.cycles;
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (!cycles) {
      let state;
      try {
        state = await readState(this.cyclesCanister.trim());
      } catch (e) {
        console.log(e);
      }
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      console.log(state);
      if (!state || (state && !state.moduleHash)) {
        flag = false;
        this.$info({
          content:
            'Your Cycles Wallet Canister has been destroyed due to lack of Cycles for a long time, please create a new Cycles Wallet.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'OK',
          onOk() {
            that.$router.push('/account');
          }
        });
      } else {
        flag = false;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        this.$info({
          content:
            'Your Cycles Wallet Canister is frozen due to insufficient balance, please "top-up" a little Cycles to the wallet canister to reactivate it.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'OK',
          onOk() {
            (that.$refs as any).topUp.topUpForm.to = cyclesWallet;
            (that.$refs as any).topUp.init();
            (that.$refs as any).topUp.visibleTopUp = true;
          }
        });
      }
    } else if (new BigNumber(cycles.toString(10)).lt(0.01 * 10 ** 12)) {
      flag = false;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      this.$info({
        content:
          'Your Cycles Wallet Canister is frozen due to insufficient balance, please "top-up" a little Cycles to the wallet canister to reactivate it.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'OK',
        onOk() {
          (that.$refs as any).topUp.topUpForm.to = cyclesWallet;
          (that.$refs as any).topUp.init();
          (that.$refs as any).topUp.visibleTopUp = true;
        }
      });
    }
    return flag;
  }
  private async remove(): Promise<void> {
    await checkAuth();
    const principal = localStorage.getItem('principal');
    this.removeLiquidityVisible = true;
    this.removeLiquidityStep = 0;
    console.time();
    const swapId = this.currentPool[0].toString();
    const shares = BigInt(
      new BigNumber(this.shares).times(10 ** this.currentPool[4])
    );
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      const flag = await this.checkCycles(this.cyclesCanister.trim());
      if (!flag) {
        this.removeLiquidityVisible = false;
        return;
      }
      const nonce = await this.getCount(Principal.fromText(principal));
      this.cyclesFinanceService
        .remove([shares], Principal.fromText(this.cyclesCanister), [nonce])
        .then(async () => {
          this.removeLiquidityStep = 1;
          this.$message.success('Remove liquidity Success');
          this.initRemove();
        })
        .catch((e) => {
          this.$message.error(e.message);
          this.removeLiquidityVisible = false;
          this.setCyclesCanister();
        });
    } else {
      const currentSwapService = new ICSwapService();
      try {
        const res = await currentSwapService.remove(
          swapId,
          [shares],
          [this.autoWithdraw]
        );
        if (
          (
            res as {
              ok: TxnResultOk;
            }
          ).ok
        ) {
          this.removeLiquidityStep = 1;
          if (this.autoWithdraw) {
            setTimeout(() => {
              this.removeLiquidityStep = 2;
              this.$message.success('Remove liquidity Success');
              this.initRemove();
            }, 2000);
          } else {
            this.$message.success('Remove liquidity Success');
            this.initRemove();
          }
        } else {
          this.$message.error((res as { err: SwapTxnResultErr }).err.message);
          this.removeLiquidityVisible = false;
          this.setCyclesCanister();
        }
        console.timeEnd();
      } catch (e) {
        console.log(e);
        this.removeLiquidityVisible = false;
        this.setCyclesCanister();
      }
    }
  }
}
</script>

<style scoped lang="scss">
.exchange-swap-item-bottom {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.exchange-swap-item-bottom-fee-share {
  cursor: pointer;
}
.exchange-swap-item-top {
  display: flex;
  align-items: center;
  input {
    width: 300px;
  }
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
  &.swap-item-top-right-cycles {
    height: 36px;
    margin-top: 41px;
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
@media screen and (max-width: 768px) {
  .exchange-swap-item-top {
    input {
      width: 49%;
    }
  }
}
</style>
