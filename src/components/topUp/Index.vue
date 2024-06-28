<template>
  <a-modal
    v-model="visibleTopUp"
    centered
    title="Top-up"
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="transfer-modal"
    :after-close="afterClose"
  >
    <a-form-model :model="topUpForm" ref="topUpForm" :rules="topUpFormRules">
      <div v-if="type === 'topUpToken' || type === 'topUpWallet'">
        Top-up cycles To:
        <div>{{ topUpForm.to }}</div>
      </div>
      <a-form-model-item label="Top up cycles to canister" prop="to" v-else>
        <a-input
          v-model="topUpForm.to"
          autocomplete="off"
          placeholder="Canister ID(Principal)"
        />
      </a-form-model-item>
      <a-form-model-item label="Amount" prop="amount">
        <a-input
          v-model="topUpForm.amount"
          autocomplete="off"
          type="text"
          v-only-float="decimals"
          min="0"
          placeholder="0.00"
          suffix="ICP"
        />
      </a-form-model-item>
      <p class="icp-to-cycles">
        1 ICP converts to
        {{ icpToCyclesConversionRate | bigintToFloat }} TCycles
      </p>
      <div class="transfer-balance">
        <div class="transfer-balance-left">
          <p>Balance: {{ balance }} ICP</p>
          <p>Fee: {{ fee * 2 }} ICP</p>
        </div>
        <div class="transfer-balance-right" @click="setMaxTopUpBalance">
          Max
        </div>
      </div>
      <a-form-model-item>
        <button
          type="button"
          class="transfer-submit large-primary primary"
          @click="topUp"
        >
          Add Cycles
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { Identity } from '@dfinity/agent';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import {
  CYCLES_MINTING_CANISTER_ID,
  getSubAccountArray,
  TOP_UP_CANISTER_MEMO
} from '@/ic/utils';
import * as convert from '@/ic/converter';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { validateCanister } from '@/utils/validate';
import { CyclesMintingService } from '@/ic/cyclesMinting/cyclesMintingService';
import { checkAuth } from '@/ic/CheckAuth';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  $refs!: { topUpForm: HTMLFormElement };
  @Prop()
  public balance!: string;
  @Prop({ type: String, default: 'topUp' })
  public type!: string;
  public cyclesMintingService: CyclesMintingService;
  public ledgerService: LedgerService | undefined;
  public fee = 0.0001;
  public decimals = 8;
  public icpToCyclesConversionRate: bigint = null;
  public visibleTopUp = false;
  public topUpForm = {
    to: '',
    amount: ''
  };
  public topUpFormRules = {
    to: [
      {
        required: true,
        message: 'Please enter Canister',
        trigger: ['change', 'blur']
      },
      { validator: validateCanister, trigger: 'blur' }
    ],
    amount: [
      {
        required: true,
        message: 'Please enter Amount',
        trigger: ['change', 'blur']
      },
      { validator: this.validateTopUpAmount, trigger: ['change', 'blur'] }
    ]
  };
  public validateTopUpAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const min = Number(
      new BigNumber(this.balance).minus(this.fee * 2).minus(value)
    );
    if (Number(value) && min < 0) {
      callback('Insufficient ICP');
    } else {
      callback();
    }
  }
  created(): void {
    this.cyclesMintingService = new CyclesMintingService();
    this.ledgerService = new LedgerService();
    this.getIcpToCyclesConversionRate();
  }
  public async init(): Promise<void> {
    await this.getIcpToCyclesConversionRate();
    this.topUpForm.amount = new BigNumber(0.02)
      .times(10 ** 12)
      .div(this.icpToCyclesConversionRate.toString(10))
      .decimalPlaces(4)
      .toString(10);
  }
  private async getIcpToCyclesConversionRate(): Promise<void> {
    try {
      this.icpToCyclesConversionRate =
        await this.cyclesMintingService.getIcpToCyclesConversionRate();
    } catch (e) {
      console.log(e);
    }
  }
  public async topUp(): Promise<void> {
    this.$refs.topUpForm.validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        try {
          const toSubAccount = convert.principalToSubAccount(
            Principal.fromText(this.topUpForm.to)
          );
          const recipient = convert.principalToAccountIdentifier(
            Principal.fromText(CYCLES_MINTING_CANISTER_ID),
            toSubAccount
          );
          const blockHeight = await this.ledgerService.sendIcp(
            this.topUpForm.amount,
            recipient,
            BigInt(TOP_UP_CANISTER_MEMO)
          );
          const notifyArg = {
            to_canister: Principal.fromText(CYCLES_MINTING_CANISTER_ID),
            block_height: blockHeight,
            to_subaccount: [Array.from(toSubAccount)],
            from_subaccount: [getSubAccountArray(0)],
            max_fee: {
              e8s: BigInt(
                new BigNumber(this.fee.toString(10))
                  .times(10 ** this.decimals)
                  .toString(10)
              )
            }
          };
          await this.ledgerService.notifyDfx(notifyArg);
          loading.close();
          this.visibleTopUp = false;
          this.$message.success('Top-up Success');
          this.$emit('topUpSuccess');
        } catch (e) {
          loading.close();
          console.log(e);
        }
      }
    });
  }
  public setMaxTopUpBalance(): void {
    const max = new BigNumber(this.balance).minus(this.fee * 2);
    if (new BigNumber(max).gt(0)) {
      this.topUpForm.amount = new BigNumber(this.balance)
        .minus(this.fee * 2)
        .toString(10);
    } else {
      this.topUpForm.amount = '0';
    }
  }
  public afterClose(): void {
    this.$refs.topUpForm.resetFields();
  }
}
</script>

<style scoped lang="scss">
.transfer-modal {
  .transfer-submit {
    width: 100%;
    margin-top: 20px;
  }
}
.icp-to-cycles {
  text-align: center;
  color: #1996c4;
}
.top-up-tp {
  margin-bottom: 10px;
  font-size: 16px;
}
.transfer-balance-right {
  color: #1996c4;
}
</style>
