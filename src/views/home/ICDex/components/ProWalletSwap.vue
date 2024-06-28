<template>
  <a-modal
    v-model="visible"
    title="Transfer"
    centered
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="transfer-modal"
    :after-close="afterClose"
    :z-index="1400"
  >
    <div class="swap-main">
      <div>
        <span class="swap-main-type">From</span>
        <span class="base-font-title">
          <span v-show="type === 'toPro'"
            >Main-Wallet
            <span
              v-if="
                tokens &&
                tokenId &&
                tokens[tokenId] &&
                tokensBalance &&
                tokensBalanceSto
              "
              >&nbsp;({{
                tokensBalance[tokenId]
                  | bigintToFloat(8, tokens[tokenId].decimals)
              }}
              {{ tokens[tokenId].symbol }})</span
            ></span
          >
          <span v-show="type === 'toWallet'"
            >Pro-wallet<span
              v-if="
                tokens &&
                tokenId &&
                tokens[tokenId] &&
                tokensBalance &&
                tokensBalanceSto
              "
              >&nbsp;({{
                tokensBalanceSto[tokenId]
                  | bigintToFloat(8, tokens[tokenId].decimals)
              }}
              {{ tokens[tokenId].symbol }})</span
            ></span
          >
        </span>
      </div>
      <div class="swap-main-icon">
        <span><a-icon type="arrow-down" /></span>
        <span
          v-show="showSwap"
          class="margin-left-auto pointer main-color"
          @click="changeType"
          ><a-icon class="swap-main-icon-swap" type="swap"
        /></span>
      </div>
      <div>
        <span class="swap-main-type">To</span>
        <span class="base-font-title">
          <span v-show="type === 'toWallet'"
            >Main-Wallet<span
              v-if="
                tokens &&
                tokenId &&
                tokens[tokenId] &&
                tokensBalance &&
                tokensBalanceSto
              "
              >&nbsp;({{
                tokensBalance[tokenId]
                  | bigintToFloat(8, tokens[tokenId].decimals)
              }}
              {{ tokens[tokenId].symbol }})</span
            ></span
          >
          <span v-show="type === 'toPro'"
            >Pro-wallet<span
              v-if="
                tokens &&
                tokenId &&
                tokens[tokenId] &&
                tokensBalance &&
                tokensBalanceSto
              "
              >&nbsp;({{
                tokensBalanceSto[tokenId]
                  | bigintToFloat(8, tokens[tokenId].decimals)
              }}
              {{ tokens[tokenId].symbol }})</span
            ></span
          >
        </span>
      </div>
    </div>
    <a-form-model
      :model="transferForm"
      ref="transferForm"
      :rules="transferFormRules"
    >
      <a-form-model-item label="Amount" prop="amount">
        <a-input
          v-if="tokens && tokenId && tokens[tokenId]"
          v-model="transferForm.amount"
          autocomplete="off"
          type="text"
          v-only-float="tokens[tokenId].decimals"
          min="0"
          placeholder="0.00"
          :suffix="tokens[tokenId].symbol"
        />
      </a-form-model-item>
      <div class="transfer-balance">
        <div
          v-if="
            tokens &&
            tokenId &&
            tokens[tokenId] &&
            tokensBalance &&
            tokensBalanceSto
          "
          class="transfer-balance-left"
        >
          <p>
            Balance:
            <span v-show="type === 'toPro'">{{
              tokensBalance[tokenId]
                | bigintToFloat(
                  isH5 ? 8 : tokens[tokenId].decimals,
                  tokens[tokenId].decimals
                )
            }}</span>
            <span v-show="type === 'toWallet'">
              {{
                tokensBalanceSto[tokenId]
                  | bigintToFloat(
                    isH5 ? 8 : tokens[tokenId].decimals,
                    tokens[tokenId].decimals
                  )
              }}
            </span>
            {{ tokens[tokenId].symbol }}
          </p>
          <p>
            Fee:
            {{
              getTokenFee(tokens[tokenId])
                | bigintToFloat(
                  tokens[tokenId].decimals,
                  tokens[tokenId].decimals
                )
            }}
            {{ tokens[tokenId].symbol }}
          </p>
        </div>
        <div class="transfer-balance-right" @click="setMaxBalance">Max</div>
      </div>
      <a-form-model-item>
        <button
          type="button"
          class="primary transfer-submit w100 large-primary mt20"
          @click="onSubmit"
        >
          Transfer
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
import BigNumber from 'bignumber.js';
import { TokenInfo } from '@/ic/common/icType';
import { getFee } from '@/ic/getTokenFee';
import { checkAuth } from '@/ic/CheckAuth';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { fromSubAccountId, principalToAccountIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { IcrcTransferError } from '@/ic/DRC20Token/model';

@Component({
  name: 'ProWalletSwap',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Object, default: () => null })
  private tokensBalance!: { [key: string]: string };
  @Prop({ type: Object, default: () => null })
  private tokensBalanceSto!: { [key: string]: string };
  @Prop({ type: Object, default: () => null })
  private tokens!: { [key: string]: TokenInfo };

  private ledgerService: LedgerService | undefined;
  private DRC20TokenService: DRC20TokenService;
  private visible = false;
  private tokenId = '';
  private type = 'toPro';
  private transferForm = {
    amount: ''
  };
  private showSwap = true;
  private transferFormRules = {
    amount: [
      { required: true, message: 'Please enter Amount', trigger: 'change' },
      { validator: this.validateAmount, trigger: 'change' }
    ]
  };
  private isH5 = true;
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    let balance = '';
    if (this.type === 'toPro') {
      balance = new BigNumber(this.tokensBalance[this.tokenId])
        .div(10 ** this.tokens[this.tokenId].decimals)
        .toString(10);
    } else {
      balance = new BigNumber(this.tokensBalanceSto[this.tokenId])
        .div(10 ** this.tokens[this.tokenId].decimals)
        .toString(10);
    }
    const fee = new BigNumber(getFee(this.tokens[this.tokenId]).toString(10))
      .div(10 ** this.tokens[this.tokenId].decimals)
      .toString(10);
    const max = new BigNumber(balance).minus(fee);
    // const min = Number(
    //   new BigNumber(this.currentToken.balance).minus(this.fee).minus(value)
    // );
    if (value && new BigNumber(max).lt(value)) {
      callback(`Insufficient ${this.tokens[this.tokenId].symbol}`);
    } else {
      callback();
    }
  }
  created(): void {
    this.ledgerService = new LedgerService();
    this.DRC20TokenService = new DRC20TokenService();
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
  }
  private onSubmit(): void {
    (this.$refs.transferForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          await checkAuth();
          try {
            const principal = localStorage.getItem('principal');
            const standard = Object.keys(this.tokens[this.tokenId].tokenStd)[0];
            const amount = BigInt(
              new BigNumber(this.transferForm.amount)
                .times(10 ** this.tokens[this.tokenId].decimals)
                .toString(10)
            );
            let to;
            let res;
            const proSubaccount = 1;
            // if (standard.toLocaleLowerCase() === 'icp') {
            //   if (this.type === 'toPro') {
            //     to = principalToAccountIdentifier(
            //       Principal.from(principal),
            //       new Uint8Array(fromSubAccountId(proSubaccount))
            //     );
            //     res = await this.ledgerService.sendIcp(
            //       this.transferForm.amount.toString(),
            //       to,
            //       BigInt('0')
            //     );
            //   } else {
            //     to = principalToAccountIdentifier(Principal.from(principal));
            //     res = await this.ledgerService.sendIcp(
            //       this.transferForm.amount.toString(),
            //       to,
            //       BigInt('0'),
            //       proSubaccount
            //     );
            //   }
            //   if (res) {
            //     this.visible = false;
            //     this.$message.success('Success');
            //     this.$emit('proWalletSwapSuccess');
            //   }
            // } else
            if (standard.toLocaleLowerCase() === 'drc20') {
              if (this.type === 'toPro') {
                to = principalToAccountIdentifier(
                  Principal.from(principal),
                  new Uint8Array(fromSubAccountId(proSubaccount))
                );
                res = await this.DRC20TokenService.drc20_transfer(
                  to,
                  amount,
                  [],
                  0,
                  [],
                  this.tokenId
                );
              } else {
                to = principalToAccountIdentifier(Principal.from(principal));
                res = await this.DRC20TokenService.drc20_transfer(
                  to,
                  amount,
                  [],
                  1,
                  [],
                  this.tokenId
                );
              }
              if (
                (
                  res as {
                    ok: Txid;
                  }
                ).ok
              ) {
                this.visible = false;
                this.$message.success('Success');
                this.$emit('proWalletSwapSuccess');
              } else {
                this.$message.error((res as TxnResultErr).err.message);
              }
            } else if (
              standard.toLocaleLowerCase() === 'icp' ||
              standard.toLocaleLowerCase().includes('icrc')
            ) {
              if (this.type === 'toPro') {
                to = {
                  owner: Principal.fromText(principal),
                  subaccount: [fromSubAccountId(proSubaccount)]
                };
                res = await this.DRC20TokenService.icrc1Transfer(
                  this.tokenId,
                  amount,
                  to
                );
              } else {
                to = {
                  owner: Principal.fromText(principal),
                  subaccount: []
                };
                res = await this.DRC20TokenService.icrc1Transfer(
                  this.tokenId,
                  amount,
                  to,
                  [],
                  [],
                  proSubaccount
                );
              }
              if (
                (
                  res as {
                    Ok: bigint;
                  }
                ).Ok
              ) {
                this.visible = false;
                this.$message.success('Success');
                this.$emit('proWalletSwapSuccess');
              } else {
                const err = Object.keys(
                  (res as { Err: IcrcTransferError }).Err
                )[0];
                this.$message.error(err);
              }
            }
          } catch (e) {
            console.log(e);
          }
          loading.close();
        }
      }
    );
  }
  private changeType(): void {
    if (this.type === 'toPro') {
      this.type = 'toWallet';
    } else {
      this.type = 'toPro';
    }
    if (this.transferForm.amount) {
      (this.$refs.transferForm as any).validateField('amount');
    }
  }
  private setMaxBalance(): void {
    let balance = '';
    if (this.type === 'toPro') {
      balance = new BigNumber(this.tokensBalance[this.tokenId])
        .div(10 ** this.tokens[this.tokenId].decimals)
        .toString(10);
    } else {
      balance = new BigNumber(this.tokensBalanceSto[this.tokenId])
        .div(10 ** this.tokens[this.tokenId].decimals)
        .toString(10);
    }
    const fee = new BigNumber(getFee(this.tokens[this.tokenId]).toString(10))
      .div(10 ** this.tokens[this.tokenId].decimals)
      .toString(10);
    const max = new BigNumber(balance).minus(fee);
    if (new BigNumber(max).gt(0)) {
      this.transferForm.amount = max.toString(10);
    } else {
      this.transferForm.amount = '0';
    }
    (this.$refs.transferForm as any).validateField('amount');
  }
  private afterClose(): void {
    this.tokenId = '';
    this.type = 'toPro';
    (this.$refs.transferForm as Vue & WrappedFormUtils).resetFields();
  }
  private getTokenFee(token: TokenInfo): string | bigint {
    return getFee(token);
  }
}
</script>

<style scoped lang="scss">
.swap-main {
  background: #1f2b37;
  margin-bottom: 20px;
  padding: 10px 15px;
  border-radius: 3px;
  .swap-main-type {
    display: inline-block;
    width: 50px;
  }
  .swap-main-icon {
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
  .swap-main-icon-swap {
    font-size: 16px;
    font-weight: bold;
    transform: rotate(90deg);
  }
}
.transfer-balance-right {
  color: #1996c4;
}
</style>
