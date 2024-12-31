<template>
  <a-modal
    v-model="visible"
    centered
    title="Disburse"
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="disburse-modal"
    :after-close="afterClose"
  >
    <a-form-model :model="form" ref="form" :rules="formRules">
      <a-form-model-item label="Amount" prop="amount">
        <a-input
          v-model="form.amount"
          autocomplete="off"
          type="text"
          v-only-float="decimals"
          min="0"
          placeholder="0.00"
        />
      </a-form-model-item>
      <div class="transfer-balance">
        <div class="transfer-balance-left">
          <p>Balance: {{ balance | bigintToFloat(decimals, 0) }}</p>
          <!--<p>Fee: {{ fee }}</p>-->
        </div>
        <div class="transfer-balance-right" @click="setMaxBalance">Max</div>
      </div>
      <a-form-model-item>
        <button
          type="button"
          class="transfer-submit primary large-primary"
          @click="disburse"
        >
          Disburse
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { DisburseRequest } from '@/ic/governance/model';
import { hexToBytes, principalToAccountIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { GovernanceService } from '@/ic/governance/governanceService';
import BigNumber from 'bignumber.js';
import {
  ValidationRule,
  WrappedFormUtils
} from 'ant-design-vue/types/form/form';
import { checkAuth } from '@/ic/CheckAuth';
@Component({
  name: 'Disburse',
  components: {}
})
export default class extends Vue {
  @Prop()
  public balance!: string;
  @Prop()
  public neuronId!: bigint;
  @Prop()
  public governanceService!: GovernanceService;
  public decimals = 8;
  // public fee = 0.0001;
  public visible = false;
  public form = {
    amount: ''
  };
  public formRules = {
    amount: [
      { required: true, message: 'Please enter Amount', trigger: 'change' },
      { validator: this.validateAmount, trigger: 'change' }
    ]
  };
  public validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const min = new BigNumber(this.balance).minus(value);
    if (value && new BigNumber(min).lt(0)) {
      callback('Insufficient ICP');
    } else {
      callback();
    }
  }
  public async disburse(): Promise<void> {
    (this.$refs.form as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          await checkAuth();
          try {
            const principal = localStorage.getItem('principal');
            const toAccount = hexToBytes(
              principalToAccountIdentifier(Principal.fromText(principal))
            );
            const disburseRequest: DisburseRequest = {
              neuronId: this.neuronId,
              toAccount: toAccount,
              amount: []
            };
            await this.governanceService.disburse(disburseRequest);
            this.$emit('disburseSuccess');
            this.$message.success('Disburse Success');
            this.visible = false;
          } catch (e) {
            console.log(e);
          }
          loading.close();
        }
      }
    );
  }
  public setMaxBalance(): void {
    this.form.amount = this.balance;
    (this.$refs.form as any).validateField('amount');
  }
  public afterClose(): void {
    (this.$refs.form as Vue & WrappedFormUtils).resetFields();
  }
}
</script>

<style scoped lang="scss">
.disburse-modal {
  button {
    width: 100%;
    margin-top: 30px;
  }
}
.transfer-balance-right {
  color: #1996c4;
}
</style>
