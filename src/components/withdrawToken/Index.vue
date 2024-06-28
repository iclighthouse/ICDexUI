<template>
  <a-modal
    v-model="visibleTransfer"
    centered
    :title="isWallets ? '' : 'Withdraw' + ' ' + currentToken.symbol"
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="transfer-modal"
    :after-close="afterClose"
    :z-index="1400"
  >
    <ul v-show="isWallets" class="withdraw-token-list">
      <li
        v-if="currentPair && currentToken && currentToken.canisterId"
        :class="{
          active:
            currentToken.canisterId.toString() ===
            currentPair[1][0].token0[0].toString()
        }"
        @click="changeWithdrawToken(true)"
      >
        Withdraw {{ currentPair[1][0].token0[1] }}
      </li>
      <li
        v-if="currentPair && currentToken && currentToken.canisterId"
        :class="{
          active:
            currentToken.canisterId.toString() ===
            currentPair[1][0].token1[0].toString()
        }"
        @click="changeWithdrawToken(false)"
      >
        Withdraw {{ currentPair[1][0].token1[1] }}
      </li>
    </ul>
    <a-form-model :model="form" ref="form" :rules="formRules">
      <a-form-model-item label="Amount" prop="amount">
        <a-input
          v-model="form.amount"
          autocomplete="off"
          type="text"
          v-only-float="currentToken.decimals"
          min="0"
          placeholder="0.00"
        />
      </a-form-model-item>
      <div class="transfer-balance">
        <div class="transfer-balance-left">
          <p>Balance: {{ currentToken.balance }} {{ currentToken.symbol }}</p>
          <p v-if="Number(fee) > 0">Fee: {{ fee }} {{ currentToken.symbol }}</p>
        </div>
        <div class="link margin-left-auto pointer" @click="setMaxBalance">
          Max
        </div>
      </div>
      <a-form-model-item>
        <button
          type="button"
          class="primary transfer-submit w100 large-primary mt20"
          @click="withdraw"
        >
          Withdraw
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  AddTokenItem,
  AddTokenItemClass,
  TokenStandard
} from '@/views/home/account/model';
import {
  ValidationRule,
  WrappedFormUtils
} from 'ant-design-vue/types/form/form';
import BigNumber from 'bignumber.js';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { DePairs } from '@/views/home/ICDex/model';
import { checkAuth } from '@/ic/CheckAuth';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { TokenInfo } from '@/ic/common/icType';
import { getFee } from '@/ic/getTokenFee';
import { toHttpError } from '@/ic/httpError';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Array, default: () => [] })
  public currentPair!: DePairs;
  @Prop({ type: Boolean, default: false })
  public isWallets!: boolean;

  private DRC20TokenService: DRC20TokenService;
  private currentICDexService: ICDexService;
  private visibleTransfer = false;
  private subaccountId = 0;
  private isToken0 = true;
  private currentToken: AddTokenItem = new AddTokenItemClass();
  private fee = '0';
  private form = {
    amount: ''
  };
  private formRules = {
    amount: [
      { required: true, message: 'Please enter Amount', trigger: 'change' },
      { validator: this.validateAmount, trigger: 'change' }
    ]
  };
  private tokens: { [key: string]: TokenInfo } = {};
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const min = Number(
      new BigNumber(this.currentToken.balance).minus(this.fee).minus(value)
    );
    if (value && min < 0) {
      callback(`Insufficient ${this.currentToken.symbol}`);
    } else {
      callback();
    }
  }
  private withdraw(): void {
    (this.$refs.form as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          await checkAuth();
          const amount = new BigNumber(this.form.amount)
            .plus(this.fee)
            .times(10 ** Number(this.currentToken.decimals))
            .toString(10);
          console.log(amount);
          try {
            const res = await this.currentICDexService.withdraw(
              this.currentPair[0].toString(),
              this.isToken0 ? [BigInt(amount)] : [BigInt(0)],
              this.isToken0 ? [BigInt(0)] : [BigInt(amount)],
              this.subaccountId
            );
            console.log(res);
            if (
              res &&
              res.length &&
              (Number(res[0]) !== 0 || Number(res[1]) !== 0)
            ) {
              this.$message.success('Success');
            } else {
              this.$message.error('Error');
            }
            this.visibleTransfer = false;
            this.$emit('withdrawSuccess', this.isToken0, this.subaccountId);
          } catch (e) {
            console.log(e);
            this.$message.error(toHttpError(e).message);
          }
          loading.close();
        }
      }
    );
  }
  public async init(
    token: AddTokenItem,
    isToken0 = true,
    subaccount = 0
  ): Promise<void> {
    if (
      this.currentToken.canisterId &&
      token.canisterId.toString() !== this.currentToken.canisterId.toString()
    ) {
      this.fee = '0';
    }
    this.currentToken = token;
    const width = document.documentElement.clientWidth;
    if (width <= 768 && this.currentToken.decimals > 8) {
      this.currentToken.balance = new BigNumber(this.currentToken.balance)
        .decimalPlaces(8, 1)
        .toString(10);
    }
    this.subaccountId = subaccount;
    this.visibleTransfer = true;
    this.isToken0 = isToken0;
    this.DRC20TokenService = new DRC20TokenService();
    this.currentICDexService = new ICDexService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.getGas();
  }
  private changeWithdrawToken(isToken0 = true): void {
    this.$emit('changeWithdrawToken', this.currentPair, isToken0);
  }
  private async getGas(): Promise<void> {
    let fee;
    if (
      this.tokens &&
      this.tokens[this.currentToken.canisterId.toString()] &&
      this.tokens[this.currentToken.canisterId.toString()].fee
    ) {
      fee = getFee(this.tokens[this.currentToken.canisterId.toString()]);
    } else if (this.currentToken.standard.toLocaleLowerCase() === 'icp') {
      fee = 10000;
    } else if (this.currentToken.standard === TokenStandard.DRC20) {
      try {
        const gas = await this.DRC20TokenService.gas(
          this.currentToken.canisterId.toString()
        );
        fee = (gas as { token: bigint }).token;
      } catch (e) {
        fee = await this.DRC20TokenService.fee(
          this.currentToken.canisterId.toString()
        );
      }
    } else if (this.currentToken.standard === TokenStandard.DIP20) {
      const res = await this.DRC20TokenService.getMetadata(
        this.currentToken.canisterId.toString()
      );
      fee = res.fee;
    } else if (
      this.currentToken.standard === TokenStandard['ICRC-1'] ||
      this.currentToken.standard === TokenStandard['ICRC-2']
    ) {
      fee = await this.DRC20TokenService.icrcFee(
        this.currentToken.canisterId.toString()
      );
    }
    if (fee || fee.toString() === '0') {
      this.fee = new BigNumber(fee.toString(10))
        .div(10 ** Number(this.currentToken.decimals))
        .toString(10);
    }
  }
  private setMaxBalance(): void {
    let max = new BigNumber(this.currentToken.balance).minus(this.fee);
    if (new BigNumber(max).gt(0)) {
      this.form.amount = max.toString(10);
    } else {
      this.form.amount = '0';
    }
    (this.$refs.form as any).validateField('amount');
  }
  private afterClose(): void {
    (this.$refs.form as Vue & WrappedFormUtils).resetFields();
  }
}
</script>

<style scoped lang="scss">
.withdraw-token-list {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin: 50px 0 20px;
  li {
    margin-right: 20px;
    padding-bottom: 10px;
    cursor: pointer;
    color: #adb3c4;
    border-bottom: 1px solid transparent;
    &.active {
      border-color: #51b7c3;
    }
  }
}
</style>
