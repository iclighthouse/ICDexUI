<template>
  <a-modal
    v-model="visible"
    :title="type ? type : 'Execute transfer'"
    width="750px"
    centered
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="approve-modal"
    :after-close="afterClose"
  >
    <a-form-model :model="form" ref="form" :rules="rules">
      <div v-if="lockedInfo" style="color: #666">
        <div>From: {{ arrayToString(lockedInfo.from) }}</div>
        <div>To: {{ arrayToString(lockedInfo.to) }}</div>
        <div>Locked: {{ locked }} {{ symbol }}</div>
        <div>Data: {{ arrayToString(lockedInfo.data[0]) }}</div>
      </div>
      <a-form-model-item
        v-if="type !== 'Fallback'"
        label="Amount"
        prop="amount"
      >
        <a-input
          v-model="form.amount"
          autocomplete="off"
          type="text"
          v-only-float="Number(decimals)"
          placeholder="0.00"
          :suffix="symbol"
        />
        <div class="transfer-balance">
          <div class="transfer-balance-right" @click="setMaxBalance">
            Send All
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item
        v-if="
          type !== 'Fallback' &&
          lockedInfo &&
          principalToAccount() === arrayToString(lockedInfo.to) &&
          arrayToString(lockedInfo.to) === arrayToString(decider)
        "
        label="To"
        prop="to"
      >
        <a-input
          v-model="form.to"
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
          @click="executeTransfer"
        >
          {{ type ? type : 'Execute transfer' }}
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IC_LIGHTHOUSE_TOKEN_CANISTER_ID } from '@/ic/utils';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { checkAuth } from '@/ic/CheckAuth';
import {
  AccountId,
  Transaction,
  Txid,
  TxnResultErr
} from '@/ic/ICLighthouseToken/model';
import {
  hexToBytes,
  principalToAccountIdentifier,
  toHexString
} from '@/ic/converter';
import { namespace } from 'vuex-class';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { PropType } from 'vue';
const commonModule = namespace('common');

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
  @Prop({ type: String, default: '0' })
  locked!: string;
  @Prop({ type: Array, default: () => [] })
  txid!: Array<number>;
  @Prop({ type: Object, default: () => null })
  lockedInfo!: Transaction;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private decider: AccountId = [];
  private type = '';
  private form = {
    to: '',
    data: '',
    amount: ''
  };
  private rules = {
    amount: [
      {
        required: true,
        message: 'Please input amount',
        trigger: 'blur'
      },
      { validator: this.validateAmount, trigger: 'blur' }
    ]
  };
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    if (value && new BigNumber(this.locked).lt(value)) {
      callback(`Max amount is ${this.locked}`);
    } else {
      callback();
    }
  }
  private visible = false;
  private DRC20TokenService: DRC20TokenService;
  created(): void {
    this.DRC20TokenService = new DRC20TokenService();
  }
  private principalToAccount(): string {
    return principalToAccountIdentifier(
      Principal.fromText(this.getPrincipalId)
    );
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private afterClose(): void {
    this.$refs.form.resetFields();
  }
  private setMaxBalance(): void {
    this.form.amount = this.locked;
    (this.$refs.form as any).validateField('amount');
  }
  private async executeTransfer(): Promise<void> {
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
      let to = [];
      if (this.form.to) {
        to = [this.form.to];
      }
      let data = [];
      if (this.form.data) {
        data = [Array.from(Buffer.from(hexToBytes(this.form.data)))];
      }
      let executeType;
      if (this.form.amount === '0' || this.type === 'Fallback') {
        executeType = { fallback: null };
        to = [];
      } else if (this.form.amount === this.locked) {
        executeType = { sendAll: null };
      } else {
        executeType = {
          send: BigInt(
            new BigNumber(this.form.amount)
              .times(10 ** Number(this.decimals))
              .toString(10)
          )
        };
      }
      const res = await this.DRC20TokenService.executeTransfer(
        this.txid,
        executeType,
        to,
        [nonce],
        0,
        data,
        this.tokenId
      );
      if (
        (
          res as {
            ok: Txid;
          }
        ).ok
      ) {
        if (this.type) {
          this.$message.success(`${this.type} Success`);
        } else {
          this.$message.success('Execute transfer Success');
        }
        this.$emit('executeTransferSuccess');
        this.visible = false;
      } else {
        this.$message.error((res as TxnResultErr).err.message);
      }
      loading.close();
    } catch (e) {
      loading.close();
      console.log(e);
    }
  }
}
</script>

<style scoped lang="scss">
.transfer-balance-right {
  margin-top: 10px;
  font-size: 14px;
  color: #1996c4;
}
</style>
