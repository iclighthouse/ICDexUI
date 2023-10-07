<template>
  <a-modal
    centered
    v-model="visible"
    title="Split"
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
          @click="onSplit"
        >
          Split
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SplitRequest } from '@/ic/governance/model';
import { GovernanceService } from '@/ic/governance/governanceService';
import BigNumber from 'bignumber.js';
import {
  ValidationRule,
  WrappedFormUtils
} from 'ant-design-vue/types/form/form';
import { checkAuth } from '@/ic/CheckAuth';
@Component({
  name: 'Split',
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
  public fee = 0.0001;
  public minIcp = 1;
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
    const max = Number(
      new BigNumber(this.balance).minus(this.minIcp).minus(value)
    );
    const min = Number(new BigNumber(value).minus(this.minIcp).minus(this.fee));
    if (value && max < 0) {
      callback('Insufficient ICP');
    } else if (value && min < 0) {
      callback(
        `Min amount is ${new BigNumber(this.minIcp)
          .plus(this.fee)
          .toString(10)} ICP`
      );
    } else {
      callback();
    }
  }
  public async onSplit(): Promise<void> {
    (this.$refs.form as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          await checkAuth();
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          try {
            const splitRequest: SplitRequest = {
              neuronId: this.neuronId,
              amount: BigInt(
                new BigNumber(this.form.amount.toString())
                  .times(10 ** this.decimals)
                  .toString()
              )
            };
            const response = await this.governanceService.splitNeuron(
              splitRequest
            );
            this.$emit('splitSuccess', response.created_neuron_id[0].id);
            this.$message.success('Split Success');
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
    const max = new BigNumber(this.balance).minus(this.minIcp);
    if (new BigNumber(max).gt(0)) {
      this.form.amount = new BigNumber(this.balance)
        .minus(this.minIcp)
        .toString();
    } else {
      this.form.amount = '0';
    }
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
