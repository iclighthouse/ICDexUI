<template>
  <a-modal
    v-model="visibleTransfer"
    centered
    :title="isWallets ? '' : type + ' ' + currentToken.symbol"
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="transfer-modal"
    :after-close="afterClose"
    :z-index="1400"
  >
    <ul v-if="isWallets" class="withdraw-token-list">
      <li
        v-if="currentPair && currentToken && currentToken.canisterId"
        :class="{
          active:
            currentToken.canisterId.toString() ===
            currentPair[1][0].token0[0].toString()
        }"
        @click="changeDepositToken(true)"
      >
        Deposit {{ currentPair[1][0].token0[1] }}
      </li>
      <li
        v-if="currentPair && currentToken && currentToken.canisterId"
        :class="{
          active:
            currentToken.canisterId.toString() ===
            currentPair[1][0].token1[0].toString()
        }"
        @click="changeDepositToken(false)"
      >
        Deposit {{ currentPair[1][0].token1[1] }}
      </li>
    </ul>
    <a-form-model
      :model="transferForm"
      ref="transferForm"
      :rules="transferFormRules"
    >
      <a-form-model-item
        v-if="type === 'Transfer'"
        class="transfer-me-label"
        :colon="false"
        prop="to"
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
          :placeholder="placeholder"
        />
      </a-form-model-item>
      <a-form-model-item label="Amount" prop="amount">
        <a-input
          v-model="transferForm.amount"
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
        <div class="transfer-balance-right" @click="setMaxBalance">Max</div>
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
          type="button"
          class="primary transfer-submit w100 large-primary"
          @click="transfer"
        >
          {{ type }}
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import {
  ValidationRule,
  WrappedFormUtils
} from 'ant-design-vue/types/form/form';
import {
  validateCanister,
  validateCanisterOrAccount,
  validateData
} from '@/utils/validate';
import BigNumber from 'bignumber.js';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import {
  AddTokenItem,
  AddTokenItemClass,
  TokenStandard
} from '@/views/home/account/model';
import { Gas } from '@/ic/ICTokens/model';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { checkAuth } from '@/ic/CheckAuth';
import {
  fromSubAccountId,
  hexToBytes,
  principalToAccountIdentifier,
  toPrincipalAndAccountId
} from '@/ic/converter';
import { IcrcTransferError, TxReceiptErr } from '@/ic/DRC20Token/model';
import { isPlug } from '@/ic/isPlug';
import wicpIdl from '@/ic/wicp/wicp.did';
import store from '@/store';
import { isInfinity } from '@/ic/isInfinity';
import { validateAccount } from '@/ic/utils';
import { DePairs } from '@/views/home/ICDex/model';

const OGYTokenId = 'jwcfb-hyaaa-aaaaj-aac4q-cai';
const ProSubaccountId = 1;

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  @Prop({ type: String, default: 'Transfer' })
  public type!: string;
  @Prop({ type: Boolean, default: false })
  public isWallets!: boolean;
  @Prop({ type: Array, default: () => [] })
  public currentPair!: DePairs;
  public currentToken: AddTokenItem = new AddTokenItemClass();
  public subaccountId = 0;
  private DRC20TokenService: DRC20TokenService;
  public visibleTransfer = false;
  private isIcx = false;
  private fee = '0';
  private tokenFee = '0';
  private gas: Gas;
  private placeholder = 'Principal Or Account';
  private isH5 = true;
  private transferForm = {
    to: '',
    amount: '',
    data: ''
  };
  private transferFormRules = {
    to: [
      {
        required: true,
        message: 'Please enter Principal Or Account',
        trigger: 'blur'
      },
      { validator: validateCanisterOrAccount, trigger: 'blur' }
    ],
    amount: [
      { required: true, message: 'Please enter Amount', trigger: 'change' },
      { validator: this.validateAmount, trigger: 'change' }
    ],
    data: [{ validator: validateData, trigger: 'blur' }]
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
  mounted(): void {
    this.isIcx = !!(window as any).icx;
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
  }
  public copyMEWallet(): void {
    if ((window as any).icx) {
      const thisIcx = store.getters['common/getIcx'];
      if (
        this.currentToken.standard === TokenStandard['ICRC-1'] ||
        this.currentToken.standard === TokenStandard['ICRC-2'] ||
        this.currentToken.standard === TokenStandard['DIP20']
      ) {
        this.transferForm.to = thisIcx.wallet.principal;
      } else {
        this.transferForm.to = thisIcx.wallet.accountId;
      }
    }
  }
  public async init(token: AddTokenItem, subaccount = 0): Promise<void> {
    if (
      this.currentToken.canisterId &&
      token.canisterId.toString() !== this.currentToken.canisterId.toString()
    ) {
      this.fee = '0';
      this.tokenFee = '0';
    }
    this.currentToken = token;
    if (this.isH5 && this.currentToken.decimals > 8) {
      this.currentToken.balance = new BigNumber(this.currentToken.balance)
        .decimalPlaces(8, 1)
        .toString(10);
    }
    this.subaccountId = subaccount;
    this.visibleTransfer = true;
    this.DRC20TokenService = new DRC20TokenService();
    // ogy
    if (
      ((token.standard === TokenStandard['ICRC-1'] ||
        token.standard === TokenStandard['ICRC-2']) &&
        token.canisterId.toString() !== OGYTokenId) ||
      token.standard === TokenStandard['DIP20']
    ) {
      this.placeholder = 'Principal';
      this.transferFormRules = {
        to: [
          {
            required: true,
            message: 'Please enter Principal',
            trigger: 'change'
          },
          { validator: validateCanister, trigger: 'change' }
        ],
        amount: [
          { required: true, message: 'Please enter Amount', trigger: 'change' },
          { validator: this.validateAmount, trigger: 'change' }
        ],
        data: [{ validator: validateData, trigger: 'blur' }]
      };
    } else {
      this.placeholder = 'Principal Or Account';
      this.transferFormRules = {
        to: [
          {
            required: true,
            message: 'Please enter Principal Or Account',
            trigger: 'blur'
          },
          { validator: validateCanisterOrAccount, trigger: 'blur' }
        ],
        amount: [
          { required: true, message: 'Please enter Amount', trigger: 'change' },
          { validator: this.validateAmount, trigger: 'change' }
        ],
        data: [{ validator: validateData, trigger: 'blur' }]
      };
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
        this.currentToken.canisterId.toString(),
        new Uint8Array(fromSubAccountId(this.subaccountId))
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
        subaccount: [fromSubAccountId(this.subaccountId)]
      };
      res = await this.DRC20TokenService.icrc1_balance_of(
        this.currentToken.canisterId.toString(),
        to
      );
    }
    let decimalPlaces = Number(this.currentToken.decimals);
    if (this.isH5 && this.currentToken.decimals > 8) {
      decimalPlaces = 8;
    }
    console.log(res);
    this.currentToken.balance = new BigNumber(res.toString(10))
      .div(10 ** Number(this.currentToken.decimals))
      .decimalPlaces(decimalPlaces, 1)
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
      this.tokenFee = new BigNumber(fee.toString(10))
        .div(10 ** Number(this.currentToken.decimals))
        .toString(10);
      // todo approve
      if (
        (this.currentToken.standard === TokenStandard.DRC20 ||
          this.currentToken.standard === TokenStandard['ICRC-2']) &&
        this.type === 'Deposit'
      ) {
        this.fee = new BigNumber(this.fee).times(3).toString(10);
      } else if (
        this.currentToken.standard === TokenStandard['ICRC-1'] &&
        this.type === 'Deposit'
      ) {
        this.fee = new BigNumber(this.fee).times(2).toString(10);
      }
    }
  }
  private changeDepositToken(isToken0 = true): void {
    this.$emit('changeDepositToken', this.currentPair, isToken0);
  }
  private setMaxBalance(): void {
    let max = new BigNumber(this.currentToken.balance).minus(this.fee);
    if (new BigNumber(max).gt(0)) {
      this.transferForm.amount = max.toString(10);
    } else {
      this.transferForm.amount = '0';
    }
    (this.$refs.transferForm as any).validateField('amount');
  }
  private transfer(): void {
    (this.$refs.transferForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          await checkAuth();
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          try {
            let amount = BigInt(
              new BigNumber(10)
                .pow(this.currentToken.decimals.toString(10))
                .times(this.transferForm.amount.toString())
                .toString(10)
            );
            const principal = localStorage.getItem('principal');
            if (this.currentToken.standard === TokenStandard.DRC20) {
              if (this.type === 'Deposit') {
                this.$emit(
                  'transferTokenSuccess',
                  amount,
                  loading,
                  this.subaccountId
                );
                return;
              }
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
              const principalAndAccountId = toPrincipalAndAccountId(
                this.transferForm.to
              );
              if (principalAndAccountId) {
                let to;
                if (principalAndAccountId.principal) {
                  to = principalToAccountIdentifier(
                    Principal.from(principalAndAccountId.principal),
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
                const res = await this.DRC20TokenService.drc20_transfer(
                  to,
                  amount,
                  [nonce],
                  0,
                  data,
                  this.currentToken.canisterId.toString()
                );
                console.log(res);
                if (
                  (
                    res as {
                      ok: Txid;
                    }
                  ).ok
                ) {
                  if (this.type === 'Transfer') {
                    this.$message.success('Transfer Success');
                    this.visibleTransfer = false;
                  }
                  this.$emit('transferTokenSuccess', amount, loading);
                } else {
                  this.$message.error((res as TxnResultErr).err.message);
                }
              } else {
                //
              }
            } else if (this.currentToken.standard === TokenStandard.DIP20) {
              if (isPlug()) {
                const transfer = {
                  idl: wicpIdl,
                  canisterId: this.currentToken.canisterId.toString(),
                  methodName: 'transfer',
                  args: [Principal.fromText(this.transferForm.to), amount],
                  onSuccess: async (res) => {
                    if (
                      (
                        res as {
                          Ok: bigint;
                        }
                      ).Ok
                    ) {
                      if (this.type === 'Transfer') {
                        this.$message.success('Transfer Success');
                        this.visibleTransfer = false;
                      }
                      this.$emit('transferTokenSuccess', amount, loading);
                    } else {
                      const err = Object.keys(
                        (
                          res as {
                            Err: TxReceiptErr;
                          }
                        ).Err
                      )[0];
                      this.$message.error(err);
                    }
                  },
                  onFail: () => {
                    loading.close();
                  }
                };
                const plugIc = (window as any).ic.plug;
                await plugIc.batchTransactions([transfer]);
              } else if (isInfinity()) {
                const transfer = {
                  idl: wicpIdl,
                  canisterId: this.currentToken.canisterId.toString(),
                  methodName: 'transfer',
                  args: [Principal.fromText(this.transferForm.to), amount],
                  onSuccess: async (res) => {
                    if (
                      (
                        res as {
                          Ok: bigint;
                        }
                      ).Ok
                    ) {
                      if (this.type === 'Transfer') {
                        this.$message.success('Transfer Success');
                        this.visibleTransfer = false;
                      }
                      this.$emit('transferTokenSuccess', amount, loading);
                    } else {
                      const err = Object.keys(
                        (
                          res as {
                            Err: TxReceiptErr;
                          }
                        ).Err
                      )[0];
                      this.$message.error(err);
                    }
                  },
                  onFail: () => {
                    loading.close();
                  }
                };
                const Ic = (window as any).ic.infinityWallet;
                await Ic.batchTransactions([transfer]);
              } else {
                const res = await this.DRC20TokenService.transfer(
                  this.currentToken.canisterId.toString(),
                  Principal.fromText(this.transferForm.to),
                  amount
                );
                if (
                  (
                    res as {
                      Ok: bigint;
                    }
                  ).Ok
                ) {
                  if (this.type === 'Transfer') {
                    this.$message.success('Transfer Success');
                    this.visibleTransfer = false;
                  }
                  this.$emit('transferTokenSuccess', amount, loading);
                } else {
                  const err = Object.keys(
                    (
                      res as {
                        Err: TxReceiptErr;
                      }
                    ).Err
                  )[0];
                  this.$message.error(err);
                }
              }
            } else if (
              this.currentToken.standard === TokenStandard['ICRC-1'] ||
              this.currentToken.standard === TokenStandard['ICRC-2']
            ) {
              if (
                this.currentToken.standard === TokenStandard['ICRC-2'] &&
                this.type === 'Deposit'
              ) {
                this.$emit(
                  'transferTokenSuccess',
                  amount,
                  loading,
                  this.subaccountId
                );
                return;
              }
              // todo icrc2
              const principalAndAccountId = toPrincipalAndAccountId(
                this.transferForm.to
              );
              if (principalAndAccountId && principalAndAccountId.principal) {
                const to = {
                  owner: Principal.fromText(principalAndAccountId.principal),
                  subaccount: principalAndAccountId.subaccount
                    ? [hexToBytes(principalAndAccountId.subaccount)]
                    : []
                };
                if (this.type === 'Deposit') {
                  amount = BigInt(
                    new BigNumber(amount.toString(10))
                      .plus(
                        new BigNumber(this.tokenFee).times(
                          10 ** Number(this.currentToken.decimals)
                        )
                      )
                      .toString(10)
                  );
                }
                const res = await this.DRC20TokenService.icrc1Transfer(
                  this.currentToken.canisterId.toString(),
                  amount,
                  to,
                  [],
                  [],
                  this.subaccountId
                );
                if (
                  (
                    res as {
                      Ok: bigint;
                    }
                  ).Ok
                ) {
                  if (this.type === 'Transfer') {
                    this.$message.success('Transfer Success');
                    this.visibleTransfer = false;
                  }
                  let deposit = amount;
                  if (this.type === 'Deposit') {
                    deposit = BigInt(
                      new BigNumber(amount.toString(10))
                        .minus(
                          new BigNumber(this.tokenFee).times(
                            10 ** Number(this.currentToken.decimals)
                          )
                        )
                        .toString(10)
                    );
                  }
                  this.$emit(
                    'transferTokenSuccess',
                    deposit,
                    loading,
                    this.subaccountId
                  );
                } else {
                  const err = Object.keys(
                    (res as { Err: IcrcTransferError }).Err
                  )[0];
                  this.$message.error(err);
                }
              } else {
                if (
                  this.currentToken.canisterId.toString() === OGYTokenId &&
                  validateAccount(this.transferForm.to)
                ) {
                  const fee = BigInt(
                    new BigNumber(this.tokenFee)
                      .times(10 ** Number(this.currentToken.decimals))
                      .toString(10)
                  );
                  if (this.type === 'Deposit') {
                    amount = BigInt(
                      new BigNumber(amount.toString(10))
                        .plus(
                          new BigNumber(this.tokenFee).times(
                            10 ** Number(this.currentToken.decimals)
                          )
                        )
                        .toString(10)
                    );
                  }
                  const res = await this.DRC20TokenService.icpStandardTransfer(
                    this.currentToken.canisterId.toString(),
                    amount,
                    fee,
                    this.transferForm.to
                  );
                  if (res) {
                    if (this.type === 'Transfer') {
                      this.$message.success('Transfer Success');
                      this.visibleTransfer = false;
                    }
                    let deposit = amount;
                    if (this.type === 'Deposit') {
                      deposit = BigInt(
                        new BigNumber(amount.toString(10))
                          .minus(
                            new BigNumber(this.tokenFee).times(
                              10 ** Number(this.currentToken.decimals)
                            )
                          )
                          .toString(10)
                      );
                    }
                    this.$emit(
                      'transferTokenSuccess',
                      deposit,
                      loading,
                      this.subaccountId
                    );
                  } else {
                    this.$message.error('Error');
                  }
                }
              }
            }
            if (this.type === 'Transfer') {
              loading.close();
            }
          } catch (e) {
            loading.close();
            this.$message.error('Transfer fail');
          }
        }
      }
    );
  }
  private afterClose(): void {
    (this.$refs.transferForm as Vue & WrappedFormUtils).resetFields();
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
.withdraw-token-list {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin: 50px 0 20px;
  li {
    margin-right: 20px;
    padding-bottom: 10px;
    cursor: pointer;
    color: #adb3c4;
    border-bottom: 1px solid transparent;
    &.active {
      border-color: #51b7c3;
    }
  }
}
</style>
