<template>
  <a-modal
    v-model="visible"
    title="Lock transfer"
    width="650px"
    centered
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="approve-modal"
    :after-close="afterClose"
  >
    <a-form-model :model="form" ref="form" :rules="rules">
      <a-form-model-item label="To" prop="to">
        <a-input
          :disabled="isICLToken"
          v-model="form.to"
          autocomplete="off"
          placeholder="Principal Or Account"
        />
      </a-form-model-item>
      <a-form-model-item label="Amount" prop="amount">
        <a-input
          v-model="form.amount"
          autocomplete="off"
          type="text"
          v-only-float="Number(decimals)"
          placeholder="0.00"
          :suffix="symbol"
        />
      </a-form-model-item>
      <a-form-model-item label="Timeout" prop="timeout">
        <a-input
          v-model="form.timeout"
          autocomplete="off"
          type="text"
          v-only-float="1"
          placeholder="0"
          suffix="min"
        />
      </a-form-model-item>
      <a-form-model-item label="Decider" prop="decider">
        <a-input
          :disabled="isICLToken"
          v-model="form.decider"
          autocomplete="off"
          placeholder="Principal Or Account"
        />
      </a-form-model-item>
      <a-form-model-item label="Data" prop="data">
        <a-textarea
          v-model="form.data"
          autocomplete="off"
          placeholder="Specifies hex format"
          :autoSize="{ minRows: 2 }"
        ></a-textarea>
      </a-form-model-item>
      <a-form-model-item>
        <button
          class="approve-submit primary large-primary w100 mt20"
          @click="lockTransfer"
        >
          Lock transfer
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IC_LIGHTHOUSE_TOKEN_CANISTER_ID } from '@/ic/utils';
import { validateCanisterOrAccount, validateData } from '@/utils/validate';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { checkAuth } from '@/ic/CheckAuth';
import BigNumber from 'bignumber.js';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { hexToBytes } from '@/ic/converter';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { PropType } from 'vue';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  $refs!: { form };
  // @Prop({ type: [Number, BigInt], default: 0 })
  // decimals!: number;
  @Prop({
    default: 8,
    validator: (value: any) =>
      typeof value === 'number' || typeof value === 'bigint'
  })
  private decimals!: number | bigint;
  @Prop({ type: String, default: 'ICL' })
  symbol!: string;
  @Prop({ type: String, default: IC_LIGHTHOUSE_TOKEN_CANISTER_ID })
  tokenId!: string;
  @Prop({ type: Boolean, default: false })
  isICLToken!: boolean;
  private DRC20TokenService: DRC20TokenService;
  private visible = false;
  private form = {
    to: '',
    amount: '',
    timeout: '',
    decider: '',
    data: ''
  };
  private rules = {
    to: [
      {
        required: true,
        message: 'Please enter Principal Or Account',
        trigger: 'blur'
      },
      { validator: validateCanisterOrAccount, trigger: 'blur' }
    ],
    amount: [
      { required: true, message: 'Please enter amount', trigger: 'change' },
      { validator: this.validateAmount, trigger: 'change' }
    ],
    timeout: [
      {
        required: true,
        message: 'Please input timeout',
        trigger: 'blur'
      },
      { validator: this.validateTimeout, trigger: 'blur' }
    ],
    decider: [
      {
        message: 'Please enter Principal Or Account',
        trigger: 'blur'
      },
      { validator: validateCanisterOrAccount, trigger: 'blur' }
    ],
    data: [{ validator: validateData, trigger: 'blur' }]
  };
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    if (this.isICLToken && value && value - 100.01 < 0) {
      callback(`Min amount is 100.01 ${this.symbol}`);
    } else {
      callback();
    }
  }
  private validateTimeout(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    if (value && Number(value) - 16667 > 0) {
      callback('Max timeout is 16667 min');
    } else {
      callback();
    }
  }
  created(): void {
    this.DRC20TokenService = new DRC20TokenService();
  }
  private afterClose(): void {
    this.$refs.form.resetFields();
  }
  private async lockTransfer(): Promise<void> {
    this.$refs.form.validate(async (valid: any) => {
      if (valid) {
        const amount = BigInt(
          new BigNumber(this.form.amount.toString())
            .times(10 ** Number(this.decimals))
            .toString(10)
        );
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        try {
          const principal = localStorage.getItem('principal');
          const nonceRes = await this.DRC20TokenService.txnQuery(
            {
              txnCount: { owner: principal }
            },
            this.tokenId
          );
          const nonce = (
            nonceRes as {
              txnCount: bigint;
            }
          ).txnCount;
          let data = [];
          if (this.form.data) {
            data = [Array.from(Buffer.from(hexToBytes(this.form.data)))];
          }
          let decider = [];
          if (this.form.decider) {
            decider = [this.form.decider];
          }
          const timeout = BigInt(
            new BigNumber(this.form.timeout).times(60).toString(10)
          );
          const res = await this.DRC20TokenService.lockTransfer(
            this.form.to,
            amount,
            timeout,
            [nonce],
            decider,
            data,
            0,
            this.tokenId
          );
          console.log(res);
          if (
            (
              res as {
                ok: Txid;
              }
            ).ok
          ) {
            this.$message.success('Lock transfer Success');
            this.$emit('lockTransferSuccess');
            this.visible = false;
          } else {
            this.$message.error((res as TxnResultErr).err.message);
          }
          loading.close();
        } catch (e) {
          console.log(e);
          loading.close();
        }
      }
    });
  }
}
</script>

<style scoped lang="scss"></style>
