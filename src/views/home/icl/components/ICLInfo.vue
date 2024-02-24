<template>
  <div class="icl-info" v-if="principal">
    <!--<div class="icl-info-tip">
      If you want to create a token (for test), please join Discord
      <a href="https://discord.gg/FQZFGGq7zv" target="_blank"
        >https://discord.gg/FQZFGGq7zv</a
      >
      to claim the test ICLs
    </div>-->
    <div class="ic-balance-main">
      <p>
        ICL Balance
        <a-icon
          @click="getBalance"
          v-show="!refreshBalanceLoading"
          type="reload"
          class="reload-icon"
        />
        <a-icon
          v-show="refreshBalanceLoading"
          type="loading"
          class="reload-icon"
        />
      </p>
      <div class="balance">{{ ICL }}&nbsp;ICL</div>
      <div class="operation">
        <button type="button" @click="showReceive">Receive</button>
        <button type="button" @click="showTransferToken">Transfer</button>
      </div>
    </div>
    <a-modal
      v-model="visible"
      centered
      title="Approve"
      width="550px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="approve-modal"
      :after-close="afterClose"
    >
      <a-form-model
        :model="approveForm"
        ref="approveForm"
        :rules="approveRules"
      >
        <a-form-model-item label="Amount" prop="amount">
          <a-input
            v-model="approveForm.amount"
            autocomplete="off"
            type="text"
            v-only-float="decimals"
            min="0"
            placeholder="0.00"
            suffix="ICL"
          />
        </a-form-model-item>
        <div class="transfer-balance">
          <div class="transfer-balance-left">
            <p>Balance: {{ ICL }} ICL</p>
          </div>
          <div class="transfer-balance-right" @click="setMaxBalance">Max</div>
        </div>
        <a-form-model-item>
          <button type="button" class="approve-submit primary" @click="approve">
            Approve
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <receive-modal ref="receiveModal"></receive-modal>
    <transfer-token
      ref="transferToken"
      :identity="identity"
      :current-token="currentToken"
      @transferTokenSuccess="transferTokenSuccess"
    ></transfer-token>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { Identity } from '@dfinity/agent';
import { ICTokenService } from '@/ic/ICTokens/ICTokenService';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { AddTokenItemClass } from '@/views/home/account/model';
import {
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_TOKEN_CANISTER_ID
} from '@/ic/utils';
import TransferToken from '@/components/transferToken/Index.vue';
import { checkAuth } from '@/ic/CheckAuth';
import ReceiveModal from '@/components/receiveModal/Index.vue';
import { namespace } from 'vuex-class';
import { Principal } from '@dfinity/principal';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
const commonModule = namespace('common');
@Component({
  name: 'ICLInfo',
  components: {
    ReceiveModal,
    TransferToken
  }
})
export default class extends Vue {
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  $refs!: {
    receiveModal;
    transferToken: HTMLFormElement;
    approveForm: HTMLFormElement;
    createTokenForm: HTMLFormElement;
  };
  @Prop()
  private identity!: Identity;
  private currentToken = new AddTokenItemClass();
  private ICL = '0';
  private decimals = 8;
  private DRC20TokenService: DRC20TokenService;
  private ICTokenService: ICTokenService;
  private visible = false;
  private refreshBalanceLoading = false;
  private approveForm = {
    amount: ''
  };
  private approveRules = {
    amount: [
      { required: true, message: 'Please enter ICL', trigger: 'blur' },
      { validator: this.validateAmount, trigger: 'blur' }
    ]
  };
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const min = 100;
    // if (value && value > this.ICL) {
    //   callback('Insufficient ICL');
    // } else
    if (value && value < min) {
      callback('Min amount is 1000 ICL');
    } else {
      callback();
    }
  }
  private timer = null;
  private principal = '';
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
  }
  created(): void {
    const principal = localStorage.getItem('principal');
    this.principal = principal;
    if (!principal) {
      return;
    }
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    this.ICL = currentInfo.ICL || '0';
    this.DRC20TokenService = new DRC20TokenService();
    this.ICTokenService = new ICTokenService();
    this.getBalance();
    this.getIcl();
    this.currentToken = {
      canisterId: Principal.fromHex(IC_LIGHTHOUSE_TOKEN_CANISTER_ID),
      balance: this.ICL.toString(),
      decimals: Number(this.decimals),
      name: '',
      symbol: 'ICL',
      logo: '',
      standard: 'DRC20',
      lockedTxns: {
        txns: [],
        lockedBalance: '0'
      },
      approvals: 0,
      transactions: '0',
      coinSeconds: null
    };
  }
  private showReceive(): void {
    this.$refs.receiveModal.principal = localStorage.getItem('principal');
    this.$refs.receiveModal.visibleReceive = true;
  }
  private getIcl(): void {
    this.timer = window.setInterval(() => {
      setTimeout(async () => {
        if (!this.getCheckAuth) {
          this.getBalance('interval');
        }
      }, 0);
    }, 10000);
  }
  private transferTokenSuccess(): void {
    this.getBalance();
  }
  private async getBalance(type?: string): Promise<void> {
    if (!(type && typeof type === 'string')) {
      this.refreshBalanceLoading = true;
    }
    const principal = localStorage.getItem('principal');
    const to = {
      owner: Principal.fromText(principal),
      subaccount: []
    };
    const ICL = await this.DRC20TokenService.icrc1_balance_of(
      IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
      to
    );
    if (Number(this.decimals) > 4) {
      this.ICL = new BigNumber(ICL.toString(10))
        .div(10 ** Number(this.decimals))
        .decimalPlaces(4, 1)
        .toString(10);
    } else {
      this.ICL = new BigNumber(ICL.toString(10))
        .div(10 ** Number(this.decimals))
        .integerValue(BigNumber.ROUND_DOWN)
        .toString(10);
    }
    if (principal) {
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      currentInfo.ICL = this.ICL;
      localStorage.setItem(principal, JSON.stringify(currentInfo));
    }
    this.$set(this.currentToken, 'balance', this.ICL);
    console.log(this.currentToken);
    this.refreshBalanceLoading = false;
  }
  private afterClose(): void {
    this.$refs.approveForm.resetFields();
  }
  private onchangeFile(event: Event, item): void {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    console.log(event, item);
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      this.$message.error('Image must smaller than 1MB!');
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt) => {
        item.content = evt.target.result;
      };
    }
    target.value = '';
  }
  private showTransferToken(): void {
    this.$refs.transferToken.init(this.currentToken);
  }
  private showApprove(): void {
    this.visible = true;
  }
  private setMaxBalance(): void {
    this.approveForm.amount = this.ICL;
    (this.$refs.approveForm as any).validateField('amount');
  }
  private approve(): void {
    this.$refs.approveForm.validate(async (valid: any) => {
      if (valid) {
        const ICL = BigInt(
          new BigNumber(this.approveForm.amount.toString())
            .times(10 ** this.decimals)
            .toString(10)
        );
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          const res = await this.DRC20TokenService.icrc2_approve(
            IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
            {
              owner: Principal.fromText(IC_TOKEN_CANISTER_ID),
              subaccount: []
            },
            ICL
          );
          if (res) {
            const type = Object.keys(res)[0];
            if (type === 'Ok') {
              this.getBalance();
              this.visible = false;
              this.$message.success('Approve Success');
            } else {
              console.log(res);
              this.$message.error('Approve Error');
            }
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

<style scoped lang="scss">
.icl-info {
  margin-bottom: 20px;
  padding: 15px 30px 15px;
  background: #141b23;
  .ic-balance-main {
    position: relative;
    button {
      color: #fff;
    }
    .icl-refresh {
      position: absolute;
      top: 0;
      right: 0;
      i {
        font-size: 12px;
        margin-right: 5px;
      }
    }
    p {
      margin-top: 20px;
    }
  }
}
.approve-modal {
  .approve-submit {
    width: 100%;
    margin-top: 20px;
  }
}
.create-Token-modal {
  .create-submit {
    width: 100%;
  }
}
::v-deep .create-Token-modal .ant-modal {
  top: 20px;
}
.token-plus-icon {
  color: #fff;
}
.icl-info-tip {
  color: #727a87;
  a {
    color: #1996c4;
  }
}
.transfer-balance-right {
  color: #1996c4;
}
</style>
