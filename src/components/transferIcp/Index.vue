<template>
  <a-modal
    v-model="visibleTransfer"
    centered
    :title="title"
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="transfer-modal"
    :after-close="afterClose"
    :z-index="1400"
  >
    <a-form-model
      :model="transferForm"
      ref="transferForm"
      :rules="transferFormRules"
    >
      <a-form-model-item
        class="transfer-me-label"
        :colon="false"
        prop="to"
        v-if="type === 'Transfer'"
      >
        <template slot="label">
          <span>To:</span>
          <span v-show="isIcx" @click="copyMEWallet" class="label-me-wallet"
            >Copy from ME wallet</span
          >
        </template>
        <a-input
          v-model="transferForm.to"
          autocomplete="off"
          placeholder="Principal Or Account Id"
        />
      </a-form-model-item>
      <a-form-model-item label="Amount" prop="amount">
        <a-input
          v-model="transferForm.amount"
          autocomplete="off"
          type="text"
          v-only-float="8"
          min="0"
          placeholder="0.00"
          suffix="ICP"
        />
      </a-form-model-item>
      <div class="transfer-balance">
        <div class="transfer-balance-left">
          <p>Balance: {{ balance }} ICP</p>
          <p v-if="type === 'Deposit'">Fee: {{ depositFee }} ICP</p>
          <p v-else>Fee: {{ fee }} ICP</p>
        </div>
        <div class="transfer-balance-right" @click="setMaxBalance">Max</div>
      </div>
      <a-form-model-item label="Memo" prop="memo">
        <a-input
          v-model="transferForm.memo"
          autocomplete="off"
          type="text"
          placeholder="0"
          v-only-number
        />
      </a-form-model-item>
      <a-form-model-item>
        <button
          type="button"
          class="transfer-submit large-primary primary"
          @click="transfer"
        >
          {{ transferButton }}
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  ValidationRule,
  WrappedFormUtils
} from 'ant-design-vue/types/form/form';
import { Principal } from '@dfinity/principal';
import { LedgerService } from '@/ic/ledger/ledgerService';
import BigNumber from 'bignumber.js';
import { checkAuth } from '@/ic/CheckAuth';
import { validateCanisterOrAccount } from '@/utils/validate';
import {
  bigIntToUint8Array,
  hexToBytes,
  principalToAccountIdentifier,
  toPrincipalAndAccountId
} from '@/ic/converter';
import store from '@/store';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { LEDGER_CANISTER_ID } from '@/ic/utils';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  @Prop({ type: String, default: 'Transfer ICP' })
  public title!: string;
  @Prop({ type: String, default: 'Transfer' })
  public transferButton!: string;
  @Prop()
  public balance!: string;
  @Prop({ type: String, default: 'Transfer' })
  public type!: string;
  @Prop({ type: BigInt, default: BigInt(0) })
  public memo!: bigint;
  public decimals = 8;
  public fee = 0.0001;
  private depositFee = 0.0002;
  private isIcx = false;
  public subaccountId = 0;
  public ledgerService: LedgerService | undefined;
  public visibleTransfer = false;
  public transferForm = {
    to: '',
    amount: '',
    memo: ''
  };
  public transferFormRules = {
    to: [
      {
        required: true,
        message: 'Please enter principal or account id',
        trigger: 'blur'
      },
      { validator: validateCanisterOrAccount, trigger: 'change' }
    ],
    amount: [
      { required: true, message: 'Please enter Amount', trigger: 'change' },
      { validator: this.validateAmount, trigger: 'change' }
    ]
  };
  // public validateAccount(
  //   rule: ValidationRule,
  //   value: string,
  //   callback: (arg0?: string) => void
  // ): void {
  //   if (value && !validateAccount(value)) {
  //     callback('invalid account identity');
  //   } else {
  //     callback();
  //   }
  // }
  public validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    let min = Number(new BigNumber(this.balance).minus(this.fee).minus(value));
    if (this.type === 'Deposit') {
      min = Number(
        new BigNumber(this.balance).minus(this.depositFee).minus(value)
      );
    }
    if (value && min < 0) {
      callback('Insufficient ICP');
    } else if (this.type === 'topUpNeuron' && value < 1) {
      callback('Min amount is 1 ICP');
    } else {
      callback();
    }
  }
  created(): void {
    this.ledgerService = new LedgerService();
  }
  mounted(): void {
    this.isIcx = !!(window as any).icx;
  }
  public copyMEWallet(): void {
    if ((window as any).icx) {
      const thisIcx = store.getters['common/getIcx'];
      if (thisIcx && thisIcx.address) {
        this.transferForm.to = thisIcx.wallet.accountId;
      }
    }
  }
  public afterClose(): void {
    (this.$refs.transferForm as Vue & WrappedFormUtils).resetFields();
  }
  public transfer(): void {
    (this.$refs.transferForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          await checkAuth();
          try {
            let memo = BigInt('0');
            if (this.memo) {
              memo = this.memo;
            } else if (this.transferForm.memo) {
              memo = BigInt(this.transferForm.memo);
            }
            const principalAndAccountId = toPrincipalAndAccountId(
              this.transferForm.to
            );
            let to;
            if (principalAndAccountId) {
              if (principalAndAccountId.principal) {
                to = principalToAccountIdentifier(
                  Principal.fromText(principalAndAccountId.principal),
                  principalAndAccountId.subaccount
                    ? new Uint8Array(
                        hexToBytes(principalAndAccountId.subaccount)
                      )
                    : null
                );
              }
              if (principalAndAccountId.accountId) {
                to = principalAndAccountId.accountId;
              }
            }
            console.log(this.transferForm.to);
            console.log(principalAndAccountId);
            let amount = new BigNumber(this.transferForm.amount.toString())
              .times(10 ** 8)
              .toString(10);
            if (this.type === 'Deposit') {
              amount = new BigNumber(amount)
                .plus(new BigNumber(this.fee).times(10 ** 8))
                .toString(10);
            }
            if (principalAndAccountId && principalAndAccountId.principal) {
              const currentDrc20Token = new DRC20TokenService();
              await currentDrc20Token.icrc1Transfer(
                LEDGER_CANISTER_ID,
                BigInt(amount),
                {
                  owner: Principal.fromText(principalAndAccountId.principal),
                  subaccount: principalAndAccountId.subaccount
                    ? [hexToBytes(principalAndAccountId.subaccount)]
                    : []
                },
                [Array.from(bigIntToUint8Array(memo))],
                [],
                this.subaccountId
              );
            } else {
              await this.ledgerService.sendIcp(
                this.transferForm.amount.toString(),
                to,
                memo,
                this.subaccountId
              );
            }
            if (
              !(
                this.type == 'topUpNeuron' ||
                this.type === 'Increase' ||
                this.type === 'Deposit'
              )
            ) {
              this.$message.success('Success');
            }
            if (this.type !== 'Deposit') {
              loading.close();
              this.visibleTransfer = false;
            }
            let deposit = new BigNumber(amount).div(10 ** 8).toString(10);
            if (this.type === 'Deposit') {
              deposit = new BigNumber(amount)
                .minus(new BigNumber(this.fee).times(10 ** 8))
                .div(10 ** 8)
                .toString(10);
            }
            this.$emit('transferSuccess', deposit, loading, this.subaccountId);
          } catch (e) {
            loading.close();
            console.log(e);
          }
        } else {
          return false;
        }
      }
    );
  }
  public setMaxBalance(): void {
    let max = new BigNumber(this.balance).minus(this.fee);
    if (this.type === 'Deposit') {
      max = new BigNumber(this.balance).minus(this.fee).minus(this.fee);
    }
    if (new BigNumber(max).gt(0)) {
      this.transferForm.amount = max.toString(10);
    } else {
      this.transferForm.amount = '0';
    }
    (this.$refs.transferForm as any).validateField('amount');
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
.transfer-balance-right {
  color: #1996c4;
}
.transfer-me-label {
  ::v-deep .ant-form-item-label {
    width: 100%;
  }
  ::v-deep label {
    display: flex;
    align-items: center;
  }
  .label-me-wallet {
    margin-left: auto;
    color: #1996c4;
    cursor: pointer;
  }
}
</style>
