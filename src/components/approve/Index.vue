<template>
  <a-modal
    v-model="visible"
    centered
    :title="symbol + ' Approval'"
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
import BigNumber from 'bignumber.js';
import {
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_TOKEN_CANISTER_ID
} from '@/ic/utils';
import { validateCanisterOrAccount, validateData } from '@/utils/validate';
import { hexToBytes } from '@/ic/converter';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { Principal } from '@dfinity/principal';
import { Icrc1Account } from '@/ic/common/icType';
@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  $refs!: { approveForm };
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
  @Prop({ type: String, default: IC_TOKEN_CANISTER_ID })
  spender!: string;
  @Prop({ type: Boolean, default: false })
  isICLToken!: boolean;
  @Prop({ type: Number, default: 100 })
  IclTokenAmount!: number;
  @Prop({ type: String, default: 'add' })
  type!: string;
  @Prop({ type: String, default: 'icrc1' })
  approveMode!: string;
  private DRC20TokenService: DRC20TokenService;
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
    if (this.isICLToken && value && value - this.IclTokenAmount < 0) {
      callback(`Min amount is ${this.IclTokenAmount} ${this.symbol}`);
    } else {
      callback();
    }
  }
  private visible = false;
  created(): void {
    this.DRC20TokenService = new DRC20TokenService();
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
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        try {
          if (this.approveMode === 'drc20') {
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
            if (this.approveForm.data) {
              data = [
                Array.from(Buffer.from(hexToBytes(this.approveForm.data)))
              ];
            }
            const res = await this.DRC20TokenService.drc20Approve(
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
              this.$message.success('Approval success!');
              this.$emit('approveSuccess');
            } else {
              this.$message.error((res as TxnResultErr).err.message);
            }
          } else if (this.approveMode === 'icrc1') {
            const spender: Icrc1Account = {
              owner: Principal.fromText(this.approveForm.spender),
              subaccount: []
            };
            const res = await this.DRC20TokenService.icrc2_approve(
              this.tokenId,
              spender,
              amount
            );
            if (res) {
              const type = Object.keys(res)[0];
              if (type === 'Ok') {
                this.visible = false;
                this.$message.success('Approval success!');
                this.$emit('approveSuccess');
              } else {
                this.$message.error('Approve Error');
              }
            }
          }
          loading.close();
        } catch (e) {
          loading.close();
        }
      }
    });
  }
}
</script>
<style scoped lang="scss"></style>
