<template>
  <a-modal
    v-model="visible"
    centered
    :title="'Approve ' + symbol"
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="approve-modal"
    :after-close="afterClose"
  >
    <a-form-model :model="approveForm" ref="approveForm" :rules="approveRules">
      <div v-if="type === 'update'">
        <span>spender: </span><span>{{ approveForm.spender }}</span>
      </div>
      <a-form-model-item
        v-if="type === 'add' && !isICLToken"
        label="Spender"
        prop="spender"
      >
        <a-input
          v-model="approveForm.spender"
          autocomplete="off"
          placeholder="Principal Or Account"
        />
      </a-form-model-item>
      <a-form-model-item label="Amount" prop="amount">
        <a-input
          v-model="approveForm.amount"
          autocomplete="off"
          type="text"
          v-only-float="decimals"
          min="0"
          placeholder="0.00"
          :suffix="symbol"
        />
      </a-form-model-item>
      <a-form-model-item v-if="!isICLToken" label="Data" prop="data">
        <a-textarea
          v-model="approveForm.data"
          autocomplete="off"
          placeholder="Specifies hex format"
          :autoSize="{ minRows: 2 }"
        ></a-textarea>
      </a-form-model-item>
      <!--<div class="transfer-balance">
        <div class="transfer-balance-left">
          <p>Balance: {{ currentToken.balance }} {{ currentToken.symbol }}</p>
          <p v-if="Number(fee) > 0">Fee: {{ fee }} {{ currentToken.symbol }}</p>
        </div>
        <div class="transfer-balance-right" @click="setMaxBalance">Max</div>
      </div>-->
      <a-form-model-item>
        <button
          class="approve-submit primary large-primary w100 mt20"
          @click="approve"
        >
          Approve
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { checkAuth } from '@/ic/CheckAuth';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { ICLighthouseTokenService } from '@/ic/ICLighthouseToken/ICLighthouseTokenService';
import BigNumber from 'bignumber.js';
import {
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_TOKEN_CANISTER_ID
} from '@/ic/utils';
import { validateCanisterOrAccount, validateData } from '@/utils/validate';
import { hexToBytes } from '@/ic/converter';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  $refs!: { approveForm };
  @Prop({ type: [Number, BigInt], default: 8 })
  decimals!: number;
  @Prop({ type: String, default: 'ICL' })
  symbol!: string;
  @Prop({ type: String, default: IC_LIGHTHOUSE_TOKEN_CANISTER_ID })
  tokenId!: string;
  @Prop({ type: String, default: IC_TOKEN_CANISTER_ID })
  spender!: string;
  @Prop({ type: Boolean, default: false })
  isICLToken!: boolean;
  @Prop({ type: String, default: 'add' })
  type!: string;
  private ICLighthouseTokenService: ICLighthouseTokenService;
  private approveForm = {
    spender: '',
    amount: '',
    data: ''
  };
  private approveRules = {
    spender: [
      { required: true, message: 'Please enter Principal', trigger: 'blur' },
      { validator: validateCanisterOrAccount, trigger: 'blur' }
    ],
    amount: [
      { required: true, message: 'Please enter amount', trigger: 'change' },
      { validator: this.validateAmount, trigger: 'change' }
    ],
    data: [{ validator: validateData, trigger: 'blur' }]
  };
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    if (this.isICLToken && value && value - 100 < 0) {
      callback(`Min amount is 100 ${this.symbol}`);
    } else {
      callback();
    }
  }
  private visible = false;
  created(): void {
    this.ICLighthouseTokenService = new ICLighthouseTokenService();
  }
  private afterClose(): void {
    this.$refs.approveForm.resetFields();
  }
  private approve(): void {
    this.$refs.approveForm.validate(async (valid: any) => {
      if (valid) {
        const amount = BigInt(
          new BigNumber(this.approveForm.amount.toString())
            .times(10 ** Number(this.decimals))
            .toString(10)
        );
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          const principal = localStorage.getItem('principal');
          const nonceRes = await this.ICLighthouseTokenService.txnQuery(
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
          if (this.approveForm.data) {
            data = [Array.from(Buffer.from(hexToBytes(this.approveForm.data)))];
          }
          const res = await this.ICLighthouseTokenService.approve(
            amount,
            data,
            this.approveForm.spender,
            [nonce],
            0,
            this.tokenId
          );
          if (
            (
              res as {
                ok: Txid;
              }
            ).ok
          ) {
            this.visible = false;
            this.$message.success('Approve Success');
            this.$emit('approveSuccess');
          } else {
            this.$message.error((res as TxnResultErr).err.message);
          }
          loading.close();
        } catch (e) {
          loading.close();
          console.log(e);
        }
      }
    });
  }
}
</script>

<style scoped lang="scss"></style>
