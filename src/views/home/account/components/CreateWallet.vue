<template>
  <a-modal
    v-model="visible"
    centered
    title="Create Wallet"
    width="550px"
    :keyboard="false"
    :maskClosable="false"
    :footer="null"
    class="create-wallet-modal"
    :after-close="afterClose"
  >
    <a-form-model :model="form" ref="form" :rules="formRules">
      <div v-if="walletId">From: {{ walletId }}</div>
      <div v-if="!walletId" class="initialize-info">
        Initialize a cycles wallet with {{ createdIcp }} ICP
      </div>
      <div class="transfer-balance" v-show="!walletId">
        <div class="transfer-balance-left">
          <p>Balance: {{ balance | bigintToFloat(4, 0) }} ICP</p>
          <p>Fee: {{ fee }} ICP</p>
        </div>
      </div>
      <div v-if="walletId" class="initialize-info">
        Initialize a cycles wallet with 0.2 TCycles
      </div>
      <div class="transfer-balance" v-if="walletId">
        <div class="transfer-balance-left">
          <p>Balance: {{ newCycles ? newCycles : cycles }} TCycles</p>
        </div>
      </div>
      <a-form-model-item>
        <button
          type="button"
          class="primary transfer-submit large-primary"
          :disabled="buttonDisabled"
          @click="createWallet"
        >
          {{ buttonName }}
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { CyclesMintingService } from '@/ic/cyclesMinting/cyclesMintingService';
import { IC_WALLET_ID } from '@/ic/utils';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { CreateCyclesWalletArgs } from '@/ic/ICLighthouse/model';
import { CreateCanisterArgs } from '@/ic/wallet/model';
import { PrincipalString } from '@/ic/common/icType';
import { WalletService } from '@/ic/wallet/walletService';
import { checkAuth } from '@/ic/CheckAuth';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { toHttpError } from '@/ic/httpError';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { namespace } from 'vuex-class';
import { principalToAccountIdentifier } from '@/ic/converter';
import { Liquidity } from '@/ic/cyclesFinance/model';
const commonModule = namespace('common');
let num = 0;

@Component({
  name: 'CreateWallet',
  components: {},
  filters: {
    formatRate(val) {
      if (val) {
        return new BigNumber(val).decimalPlaces(4, 1);
      } else {
        return '';
      }
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  $refs!: {
    form: HTMLFormElement;
    amount: HTMLFormElement;
    cycles: HTMLFormElement;
  };
  @Prop({ type: String, default: '' })
  private walletId!: PrincipalString;
  @Prop()
  private cycles!: string;
  @Prop()
  public balance!: string;
  private newCycles = null;
  public walletService: WalletService | undefined;
  private cyclesFinanceService: CyclesFinanceService;
  public decimals = 8;
  public ledgerService: LedgerService | undefined;
  public cyclesMintingService: CyclesMintingService | undefined;
  public ICLighthouseService: ICLighthouseService | undefined;
  public fee = 0.0001;
  private liquidity: Liquidity = null;
  private configFee = '';
  private icpPerCycles = '-';
  public visible = false;
  private timer = null;
  public icpToCyclesConversionRate: bigint = null;
  public form = {
    amount: '',
    cycles: ''
  };
  private createdIcp = '-';
  public formRules = {
    amount: [
      { required: true, message: 'Please enter Amount', trigger: 'change' },
      { validator: this.validateAmount, trigger: ['change', 'blur'] }
    ],
    cycles: [
      { required: true, message: 'Please enter Cycles', trigger: 'blur' },
      { validator: this.validateCycles, trigger: ['change', 'blur'] }
    ]
  };
  private depositAccountId = '';
  public afterClose(): void {
    this.$refs.form.resetFields();
    window.clearInterval(this.timer);
    this.timer = null;
  }
  public validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const max = Number(
      new BigNumber(this.balance).minus(this.fee).minus(value)
    );
    if (value && max < 0) {
      callback('Insufficient ICP');
    } else {
      callback();
    }
  }
  public validateCycles(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const min = 0.2;
    const max = new BigNumber(this.cycles).minus(value);
    if (value && value < min) {
      callback('Min amount is 0.2 TCycles');
    } else if (!this.walletId && new BigNumber(this.form.cycles).gt(1)) {
      callback('Max amount is 1 TCycles');
    } else if (this.walletId && new BigNumber(max).lt(0)) {
      callback('Insufficient cycles');
    } else {
      callback();
    }
  }
  get buttonDisabled(): boolean {
    let flag = false;
    if (!this.walletId) {
      if (this.createdIcp === 'NaN') {
        return true;
      }
      flag = new BigNumber(this.createdIcp).gt(
        new BigNumber(this.balance).minus(this.fee)
      );
    } else if (this.walletId !== 'aaaaa-aa') {
      const cycles = this.newCycles || this.cycles;
      flag = new BigNumber(0.2).gt(cycles);
    }
    return flag;
  }
  get buttonName(): string {
    let name = 'Create Wallet';
    if (!this.walletId && this.buttonDisabled) {
      name = 'Insufficient ICP';
    } else if (
      this.walletId &&
      this.walletId !== 'aaaaa-aa' &&
      this.buttonDisabled
    ) {
      name = 'Insufficient cycles';
    }
    return name;
  }
  beforeDestroy(): void {
    num = 0;
  }
  created(): void {
    this.cyclesMintingService = new CyclesMintingService();
    this.ICLighthouseService = new ICLighthouseService();
    this.walletService = new WalletService();
    this.ledgerService = new LedgerService();
    this.cyclesFinanceService = new CyclesFinanceService();
    if (num === 0) {
      ++num;
      this.getConfig();
    }
    // this.getIcpToCyclesConversionRate();
  }
  private init(): void {
    this.visible = true;
    if (this.walletId) {
      this.newCycles = this.cycles;
      this.getCycles();
    } else {
      this.getDepositAccountId();
      this.getLiquidity();
      this.getLiquidityInterval();
    }
  }
  private getCycles(): void {
    this.timer = window.setInterval(() => {
      setTimeout(async () => {
        if (!this.getCheckAuth && this.walletId !== 'aaaaa-aa') {
          const res = await this.walletService.getWalletBalance(this.walletId);
          this.newCycles = new BigNumber(res.amount.toString(10))
            .div(10 ** 12)
            .decimalPlaces(4, 1)
            .toString(10);
        }
      }, 0);
    }, 10000);
  }
  private getLiquidityInterval(): void {
    this.timer = window.setInterval(() => {
      if (!this.getCheckAuth) {
        this.getLiquidity('Interval');
      }
    }, 10000);
  }
  private async getLiquidity(type?: string): Promise<void> {
    const arg = [];
    let loading;
    try {
      if (!type) {
        loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
      }
      this.liquidity = await this.cyclesFinanceService.liquidity(arg);
      if (!type) {
        const feeRate = new BigNumber(1).minus(this.configFee);
        const product = new BigNumber(this.liquidity.cycles.toString(10)).times(
          this.liquidity.icpE8s.toString(10)
        );
        const icp = product
          .div(
            new BigNumber(this.liquidity.cycles.toString(10)).minus(
              new BigNumber(0.2)
                .plus(260000 / 10 ** 12)
                .div(feeRate)
                .times(10 ** 12)
            )
          )
          .minus(this.liquidity.icpE8s.toString(10))
          .div(10 ** this.decimals);
        if (icp.lte(0)) {
          this.createdIcp = '-';
        } else {
          this.createdIcp = new BigNumber(icp)
            .plus(this.fee)
            .decimalPlaces(4)
            .toString(10);
        }
      }
      loading && loading.close();
    } catch (e) {
      loading && loading.close();
      this.icpPerCycles = '-';
    }
  }
  public async manageWallet(wallet: Principal): Promise<void> {
    await this.ICLighthouseService.manageWallet(wallet, {
      add: null
    });
    // this.$message.success('Success');
  }
  private async getConfig(): Promise<void> {
    const config = await this.cyclesFinanceService.getConfig();
    this.configFee = new BigNumber(config.FEE[0].toString(10))
      .div(1000000)
      .toString(10);
  }
  private async getDepositAccountId(): Promise<void> {
    const principal = localStorage.getItem('principal');
    this.depositAccountId = await this.cyclesFinanceService.getAccountId(
      principalToAccountIdentifier(Principal.fromText(principal))
    );
  }
  private async getCount(principal: Principal): Promise<bigint> {
    return await this.cyclesFinanceService.getCount([
      principalToAccountIdentifier(principal)
    ]);
  }
  public createWallet(): void {
    this.$refs.form.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        let loading;
        if (!this.walletId) {
          loading = this.$loading({
            lock: true,
            customClass: 'create-wallet-loading',
            background: 'rgba(0, 0, 0, 0.6)',
            text: 'Do not close the page, it takes 20-60 seconds.\nstep1: convert icp to cycles'
          });
        } else {
          loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
        }
        try {
          let walletResult;
          const principal = localStorage.getItem('principal');
          if (this.walletId) {
            const walletRequest: CreateCanisterArgs = {
              cycles: BigInt(new BigNumber(0.2).times(10 ** 12).toString(10)),
              settings: {
                controller: [Principal.fromText(principal)],
                controllers: [],
                freezing_threshold: [],
                memory_allocation: [],
                compute_allocation: []
              }
            };
            walletResult = await this.walletService.walletCreateWallet(
              walletRequest,
              this.walletId
            );
          } else {
            console.time();
            const blockHeight = await this.ledgerService.sendIcp(
              this.createdIcp,
              this.depositAccountId
            );
            console.log(blockHeight);
            const icp = BigInt(
              new BigNumber(this.createdIcp)
                .times(10 ** this.decimals)
                .toString(10)
            );
            const nonce = await this.getCount(Principal.fromText(principal));
            const res = await this.cyclesFinanceService.icpToCycles(
              icp,
              Principal.fromText(IC_WALLET_ID),
              [nonce]
            );
            const step1 = principal + '-cw0';
            localStorage.setItem(
              step1,
              JSON.stringify({
                nonce: nonce.toString(10),
                txid: res.txid,
                cycles: (
                  res.cycles as { CreditRecord: bigint }
                ).CreditRecord.toString(10)
              })
            );
            console.log(res);
            console.timeEnd();
            console.time();
            loading.setText(
              'Do not close the page, it takes 20-60 seconds.\nstep2: create cycles wallet'
            );
            const cyclesWalletRequest: CreateCyclesWalletArgs = {
              nonce: nonce,
              txid: res.txid,
              createCanisterArgs: {
                cycles: (res.cycles as { CreditRecord: bigint }).CreditRecord,
                settings: {
                  controller: [],
                  freezing_threshold: [],
                  memory_allocation: [],
                  compute_allocation: [],
                  controllers: [[Principal.fromText(principal)]]
                }
              }
            };
            walletResult = await this.ICLighthouseService.createCyclesWallet(
              cyclesWalletRequest
            );
            localStorage.removeItem(step1);
          }
          const walletResultOk = (
            walletResult as { Ok: { canister_id: Principal } }
          ).Ok;
          if (walletResultOk) {
            const canisterId = walletResultOk.canister_id;
            const step2 = principal + '-cw1';
            localStorage.setItem(step2, canisterId.toString());
            await this.manageWallet(canisterId);
            localStorage.removeItem(step2);
            this.visible = false;
            this.$message.success('Create Wallet Success');
            this.$emit('createWalletSuccess', canisterId);
          } else {
            this.$message.error((walletResult as { Err: string }).Err);
          }
          console.log(walletResult);
          loading.close();
          console.timeEnd();
        } catch (e) {
          console.log(e);
          this.$message.error(toHttpError(e).message);
          loading.close();
        }
      }
    });
  }
}
</script>

<style scoped lang="scss">
.create-wallet-modal {
  .icp-to-cycles {
    text-align: center;
    color: #1996c4;
  }
  button {
    width: 100%;
    margin-top: 20px;
  }
}
.initialize-info {
  margin: 10px 0;
  color: #fff;
  text-align: center;
  font-size: 16px;
}
</style>
