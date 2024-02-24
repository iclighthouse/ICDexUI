<template>
  <a-modal
    v-model="visibleTransfer"
    centered
    :title="'Withdraw' + ' ' + currentToken.symbol"
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="transfer-modal"
    :after-close="afterClose"
    :z-index="1400"
  >
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

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Array, default: () => [] })
  public currentPair!: DePairs;

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
          await checkAuth();
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          const amount = new BigNumber(this.form.amount)
            .plus(this.fee)
            .times(10 ** Number(this.currentToken.decimals))
            .toString(10);
          console.log(amount);
          const res = await this.currentICDexService.withdraw(
            this.currentPair[0].toString(),
            this.isToken0 ? [BigInt(amount)] : [BigInt(0)],
            this.isToken0 ? [BigInt(0)] : [BigInt(amount)],
            this.subaccountId
          );
          console.log(res);
          if (res && res.length) {
            this.$message.success('Success');
          } else {
            this.$message.success('Error');
          }
          this.visibleTransfer = false;
          this.$emit('withdrawSuccess', this.isToken0, this.subaccountId);
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
    this.getGas();
  }
  private async getGas(): Promise<void> {
    let fee;
    if (this.currentToken.standard.toLocaleLowerCase() === 'icp') {
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

<style scoped lang="scss"></style>
