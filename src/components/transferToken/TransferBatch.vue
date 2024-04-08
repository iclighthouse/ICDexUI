<template>
  <a-modal
    v-model="visibleTransfer"
    centered
    :title="'Transfer ' + currentToken.symbol"
    width="650px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="transfer-modal"
    :after-close="afterClose"
  >
    <a-form-model :model="transferForm" ref="transferForm">
      <a-form-model-item class="transfer-me-label" :colon="false">
        <template slot="label">
          <span>To list:</span>
        </template>
        <a-textarea
          v-model="transferForm.to"
          autocomplete="off"
          :autoSize="{ minRows: 3 }"
          :placeholder="placeholder"
          @change="onToChange"
        ></a-textarea>
        <div>
          <span class="base-font-title"
            >Enter principal or account for each line</span
          >
          <!--<span>Sample</span>-->
        </div>
      </a-form-model-item>
      <a-form-model-item label="Amount list">
        <a-textarea
          v-model="transferForm.amount"
          autocomplete="off"
          :autoSize="{ minRows: 3 }"
          @change="onAmountChange"
          placeholder="Amount"
        ></a-textarea>
        <div>
          <span class="base-font-title">Enter amount for each line</span>
          <!--<span>Sample</span>-->
        </div>
        <!--<a-input
          v-model="transferForm.amount"
          autocomplete="off"
          type="text"
          v-only-float="currentToken.decimals"
          min="0"
          placeholder="0.00"
        />-->
      </a-form-model-item>
      <div class="transfer-balance">
        <div class="transfer-balance-left">
          <p>Balance: {{ currentToken.balance }} {{ currentToken.symbol }}</p>
          <p v-if="Number(fee) > 0">Fee: {{ fee }} {{ currentToken.symbol }}</p>
        </div>
      </div>
      <a-form-model-item
        v-if="currentToken.standard === 'DRC20'"
        label="Data"
        prop="data"
      >
        <a-textarea
          v-model="transferForm.data"
          autocomplete="off"
          placeholder="Specifies hex format"
          :autoSize="{ minRows: 2 }"
        ></a-textarea>
      </a-form-model-item>
      <a-form-model-item>
        <button
          :disabled="
            !transferForm.to ||
            !transferForm.amount ||
            !!toError ||
            !!amountError
          "
          type="button"
          class="primary transfer-submit w100 large-primary"
          @click="transfer"
        >
          {{ toError ? toError : amountError ? amountError : 'Transfer' }}
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import {
  AddTokenItem,
  AddTokenItemClass,
  TokenStandard
} from '@/views/home/account/model';
import { Gas } from '@/ic/ICTokens/model';
import { Txid } from '@/ic/ICLighthouseToken/model';
import { checkAuth } from '@/ic/CheckAuth';
import { hexToBytes } from '@/ic/converter';
import { validateAccount, validatePrincipal } from '@/ic/utils';

@Component({
  name: 'TransferBatch',
  components: {}
})
export default class extends Vue {
  public currentToken: AddTokenItem = new AddTokenItemClass();
  private DRC20TokenService: DRC20TokenService;
  public visibleTransfer = false;
  private isIcx = false;
  private fee = '0';
  private gas: Gas;
  private placeholder = 'Principal Or Account';
  private transferForm = {
    to: '',
    amount: '',
    data: ''
  };
  private toError = '';
  private amountError = '';
  mounted(): void {
    this.isIcx = !!(window as any).icx;
  }
  private onAmountChange(): void {
    console.log(this.transferForm.amount);
    let amount = this.transferForm.amount.split(/[(\r\n)\r\n]+/);
    let flag = false;
    const decimals = this.currentToken.decimals;
    const reg = new RegExp(`^\\d+\\.?\\d{0,${decimals}}$`);
    let totalAmount = '0';
    for (let i = 0; i < amount.length; i++) {
      console.log(reg.test(amount[i]));
      if (amount[i] && !reg.test(amount[i]) && !flag) {
        flag = true;
        this.amountError = `Line${i + 1}: invalid amount`;
      }
      if (!amount[i]) {
        flag = true;
        this.amountError = `Line${i + 1}: please enter amount`;
      }
      if (amount[i] && reg.test(amount[i])) {
        totalAmount = new BigNumber(amount[i])
          .plus(totalAmount)
          .plus(this.fee)
          .toString(10);
      }
    }
    if (!flag) {
      this.amountError = '';
    }
    if (new BigNumber(totalAmount).gt(this.currentToken.balance)) {
      this.amountError = 'Insufficient amount';
    }
    let account = this.transferForm.to.split(/[(\r\n)\r\n]+/);
    if (account.length !== amount.length && !this.toError) {
      this.toError = 'malformed';
    }
    if (account.length === amount.length && this.toError) {
      this.toError = '';
    }
    console.log(amount);
    console.log(this.amountError);
  }
  private onToChange(): void {
    console.log(this.transferForm.to);
    let account = this.transferForm.to.split(/[(\r\n)\r\n]+/);
    let flag = false;
    for (let i = 0; i < account.length; i++) {
      if (
        account[i] &&
        !validatePrincipal(account[i]) &&
        !validateAccount(account[i])
      ) {
        flag = true;
        this.toError = `Line${i + 1}: invalid principal Or Account`;
        break;
      }
      if (!account[i]) {
        flag = true;
        this.toError = `Line${i + 1}: please enter principal Or Account`;
        break;
      }
    }
    if (!flag) {
      this.toError = '';
    }
    let amount = this.transferForm.amount.split(/[(\r\n)\r\n]+/);
    if (account.length !== amount.length && !this.toError) {
      this.toError = 'malformed';
    }
    if (account.length === amount.length && this.toError) {
      this.toError = '';
    }
    console.log(account);
    console.log(this.toError);
  }
  public async init(token: AddTokenItem): Promise<void> {
    if (
      this.currentToken.canisterId &&
      token.canisterId.toString() !== this.currentToken.canisterId.toString()
    ) {
      this.fee = '0';
    }
    this.currentToken = token;
    this.visibleTransfer = true;
    this.DRC20TokenService = new DRC20TokenService();
    if (
      token.standard === TokenStandard['ICRC-1'] ||
      token.standard === TokenStandard['ICRC-2'] ||
      token.standard === TokenStandard['DIP20']
    ) {
      this.placeholder = 'Principal';
    } else {
      this.placeholder = 'Principal Or Account';
    }
    this.getGas();
    this.getBalance();
  }
  private async getBalance(): Promise<void> {
    const principal = localStorage.getItem('principal');
    let res: bigint;
    if (this.currentToken.standard === TokenStandard.DRC20) {
      res = await this.DRC20TokenService.drc20_balanceOf(
        principal,
        this.currentToken.canisterId.toString()
      );
    } else if (this.currentToken.standard === TokenStandard.DIP20) {
      res = await this.DRC20TokenService.balanceOf(
        this.currentToken.canisterId.toString(),
        Principal.fromText(principal)
      );
    } else if (
      this.currentToken.standard === TokenStandard['ICRC-1'] ||
      this.currentToken.standard === TokenStandard['ICRC-2']
    ) {
      const to = {
        owner: Principal.fromText(principal),
        subaccount: []
      };
      res = await this.DRC20TokenService.icrc1_balance_of(
        this.currentToken.canisterId.toString(),
        to
      );
    }
    let decimals = this.currentToken.decimals;
    // if (Number(decimals) > 8) {
    //   decimals = 8;
    // }
    this.currentToken.balance = new BigNumber(res.toString(10))
      .div(10 ** Number(this.currentToken.decimals))
      .toString(10);
  }
  private async getGas(): Promise<void> {
    let fee;
    if (this.currentToken.standard === TokenStandard.DRC20) {
      try {
        this.gas = await this.DRC20TokenService.gas(
          this.currentToken.canisterId.toString()
        );
        console.log(this.gas);
        fee = (this.gas as { token: bigint }).token;
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
  private async transfer(): Promise<void> {
    if (
      this.transferForm.to &&
      this.transferForm.amount &&
      !this.toError &&
      !this.amountError
    ) {
      await checkAuth();
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      try {
        const account = this.transferForm.to.split(/[(\r\n)\r\n]+/);
        const amount = this.transferForm.amount.split(/[(\r\n)\r\n]+/);
        const decimals = this.currentToken.decimals;
        const batchAmount = [];
        amount.forEach((item) => {
          if (item.lastIndexOf('.') === item.length - 1) {
            item = item + '0';
          }
          console.log(item);
          batchAmount.push(
            BigInt(
              new BigNumber(item).times(10 ** Number(decimals)).toString(10)
            )
          );
        });
        console.log(batchAmount);
        const principal = localStorage.getItem('principal');
        if (this.currentToken.standard === TokenStandard.DRC20) {
          const nonceRes = await this.DRC20TokenService.txnQuery(
            {
              txnCount: { owner: principal }
            },
            this.currentToken.canisterId.toString()
          );
          const nonce = (
            nonceRes as {
              txnCount: bigint;
            }
          ).txnCount;
          let data = [];
          if (this.transferForm.data) {
            data = [
              Array.from(Buffer.from(hexToBytes(this.transferForm.data)))
            ];
          }
          const res = await this.DRC20TokenService.drc20_transferBatch(
            this.currentToken.canisterId.toString(),
            account,
            batchAmount,
            [nonce],
            0,
            data
          );
          console.log(res);
          if (
            res.length &&
            (
              res[0] as {
                ok: Txid;
              }
            ).ok
          ) {
            this.$message.success('Transfer Success');
            this.$emit('transferTokenSuccess');
            this.visibleTransfer = false;
          } else {
            this.$message.error('Transfer Error');
          }
        }
        loading.close();
      } catch (e) {
        console.log(e);
        loading.close();
        this.$message.error('Transfer fail');
      }
    }
  }
  private afterClose(): void {
    this.transferForm = {
      to: '',
      amount: '',
      data: ''
    };
    this.toError = '';
    this.amountError = '';
  }
}
</script>

<style scoped lang="scss">
.transfer-submit {
  margin-top: 20px;
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
