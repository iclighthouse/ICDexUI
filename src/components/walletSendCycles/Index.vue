<template>
  <a-modal
    v-model="visible"
    centered
    title="Send Cycles"
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="transfer-modal"
    :after-close="afterClose"
  >
    <a-form-model
      :model="sendCyclesForm"
      ref="sendCyclesForm"
      :rules="sendCyclesFormRules"
    >
      <div class="top-up-tp" v-if="type === 'sendCyclesWallet'">
        From: {{ walletId }}
      </div>
      <div class="top-up-tp" v-if="type === 'sendCyclesToken'">
        Canister ID: {{ sendCyclesForm.to }}
      </div>
      <a-form-model-item label="To Canister ID" prop="to" v-else>
        <a-input
          v-model="sendCyclesForm.to"
          autocomplete="off"
          placeholder="Canister ID(Principal)"
        />
        <div class="top-up-tp">
          It is either a cycles-wallet or a canister that has implemented the
          wallet_receive method
        </div>
      </a-form-model-item>
      <a-form-model-item
        label="From"
        prop="from"
        v-if="type === 'sendCyclesToken'"
      >
        <a-input
          type="text"
          v-model="walletId"
          placeholder="Cycles Wallet"
          autocomplete="off"
        />
      </a-form-model-item>
      <a-form-model-item label="Amount" prop="cycles">
        <a-input
          class="input-cycles-suffix"
          v-model="sendCyclesForm.cycles"
          autocomplete="off"
          type="text"
          v-only-float="12"
          min="0"
          placeholder="0.00"
          suffix="TCycles"
        />
      </a-form-model-item>
      <div class="transfer-balance">
        <div class="transfer-balance-left">
          <p>Balance: {{ cycles }} TCycles</p>
        </div>
        <!--<div class="transfer-balance-right" @click="setMaxSendCyclesBalance">
          Max
        </div>-->
      </div>
      <a-form-model-item>
        <button
          type="button"
          class="primary transfer-submit w100 large-primary"
          @click="sendCycles"
        >
          Send Cycles
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import { Identity } from '@dfinity/agent';
import BigNumber from 'bignumber.js';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { PrincipalString } from '@/ic/common/icType';
import { WalletCallRequest, WalletSendRequest } from '@/ic/wallet/model';
import { WalletService } from '@/ic/wallet/walletService';
import { ManageWalletResponse } from '@/ic/ICLighthouse/model';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { IDL } from '@dfinity/candid';
import { validateCanister } from '@/utils/validate';
import { checkAuth } from '@/ic/CheckAuth';
import { toHttpError } from '@/ic/httpError';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  $refs!: { sendCyclesForm: HTMLFormElement };
  @Prop({ type: String, default: 'sendCyclesWallet' })
  public type!: string;
  @Prop({ type: String, default: '-' })
  public cycles!: string;
  public walletId: PrincipalString = '';
  private ICLighthouseService: ICLighthouseService;
  private walletService: WalletService;
  private wallets: ManageWalletResponse[] = [];
  public visible = false;
  private sendCyclesForm = {
    to: '',
    cycles: ''
  };
  private sendCyclesFormRules = {
    to: [
      { required: true, message: 'Please enter Canister', trigger: 'blur' },
      { validator: validateCanister, trigger: 'blur' }
    ],
    cycles: [
      { required: true, message: 'Please enter cycles', trigger: 'blur' },
      { validator: this.validateTopUpAmount, trigger: 'blur' }
    ]
  };
  private validateTopUpAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const min = new BigNumber(this.cycles).minus(value);
    if (value && new BigNumber(min).lt(0)) {
      callback('Insufficient cycles');
    } else {
      callback();
    }
  }
  created(): void {
    this.walletService = new WalletService();
    this.ICLighthouseService = new ICLighthouseService();
  }
  private afterClose(): void {
    this.$refs.sendCyclesForm.resetFields();
  }
  // private setMaxSendCyclesBalance(): void {
  //   this.sendCyclesForm.cycles = this.cycles;
  // }
  // public async init(): Promise<void> {
  //   this.wallets = await this.ICLighthouseService.getWallets();
  //   if (this.wallets.length) {
  //     this.walletId = this.wallets[0].walletId.toString();
  //     this.initWallet();
  //   }
  //   console.log(this.walletId);
  // }
  // private async handleChange(val: string): Promise<void> {
  //   this.walletId = val;
  //   this.initWallet();
  // }
  // private initWallet(): void {
  //   console.log(this.walletService);
  //   this.getWalletBalance();
  // }
  private getWalletBalance(): void {
    this.walletService
      .getWalletBalance(this.walletId)
      .then((res) => {
        this.cycles = new BigNumber(res.amount.toString(10))
          .div(10 ** 12)
          .toString(10)
          .match(/^\d+(?:\.\d{0,4})?/)[0];
      })
      .catch((res) => {
        this.cycles = '0';
        console.dir(res);
      });
  }
  private sendCycles(): void {
    this.$refs.sendCyclesForm.validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        try {
          if (this.type === 'sendCyclesToken') {
            const args = IDL.encode(
              [IDL.Opt(IDL.Text)],
              [[this.sendCyclesForm.to]]
            );
            const walletSendRequest: WalletCallRequest = {
              args: Array.from(Buffer.from(args)),
              cycles: BigInt(
                new BigNumber(this.sendCyclesForm.cycles)
                  .times(10 ** 12)
                  .toString(10)
              ),
              method_name: 'cyclesReceive',
              canister: Principal.fromText(this.sendCyclesForm.to)
            };
            const res = await this.walletService.walletCall(
              walletSendRequest,
              this.walletId
            );
            console.log(res);
            if (res && Object.keys(res)[0] === 'Ok') {
              this.$message.success('Success');
              this.getWalletBalance();
              this.$emit('sendCyclesSuccess');
              this.visible = false;
            } else {
              this.$message.success((res as { Err: string }).Err);
            }
          } else {
            // this.walletService = new WalletService(
            //   this.identity,
            //   this.walletId
            // );
            const walletSendRequest: WalletSendRequest = {
              canister: Principal.fromText(this.sendCyclesForm.to),
              amount: BigInt(
                new BigNumber(this.sendCyclesForm.cycles)
                  .times(10 ** 12)
                  .toString(10)
              )
            };
            const res = await this.walletService.walletSend(
              walletSendRequest,
              this.walletId
            );
            if ((res as { Ok: null }).Ok === null) {
              this.$message.success('Success');
              this.$emit('sendCyclesSuccess');
              this.visible = false;
            } else {
              this.$message.error((res as { Err: string }).Err);
            }
          }
        } catch (e) {
          console.log(e);
          this.$message.error(toHttpError(e).message);
        }
        loading.close();
      }
    });
  }
}
</script>

<style scoped lang="scss">
.transfer-submit {
  margin-top: 20px;
}
.top-up-tp {
  color: #5e6170;
}
</style>
