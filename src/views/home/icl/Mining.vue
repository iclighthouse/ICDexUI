<template>
  <div class="mining-main">
    <a-spin :spinning="phaseSpinning">
      <div class="mining-phase-num">
        <a-pagination
          v-if="
            phaseConfigs.length &&
            phaseConfigs.length >= Number(miningStatus.currentPhase)
          "
          :defaultPageSize="1"
          :current="currentPhase + 1"
          :total="phaseConfigs.length"
          :item-render="itemRender"
          @change="changePhase"
        />
      </div>
      <div
        class="mining-phase-main"
        :class="{
          'mining-phase-main-per':
            miningStatus && currentPhase < Number(miningStatus.currentPhase)
        }"
      >
        <table>
          <tbody
            v-if="
              phaseConfigs.length &&
              phaseConfigs.length >= Number(miningStatus.currentPhase)
            "
          >
            <tr>
              <td>
                <div class="mining-title">
                  <span class="mining-title-status">Mining Status: </span>
                  <span v-if="miningIsClosed">&nbsp;Mining is closed</span>
                </div>
              </td>
              <td>
                <span
                  v-if="
                    miningStatus &&
                    currentPhase < Number(miningStatus.currentPhase)
                  "
                  >Phase:&nbsp;<span class="mining-status stopped"
                    >stopped</span
                  ></span
                >
                <span
                  v-if="
                    miningStatus &&
                    currentPhase >= Number(miningStatus.currentPhase)
                  "
                  >Phase:&nbsp;<span
                    class="mining-status"
                    :class="miningStatus.roundStatus.status | filterStatus"
                    >{{
                      miningStatus.phaseStatus | filterStatus
                    }}&nbsp;&nbsp;</span
                  ></span
                ><span
                  v-if="
                    miningStatus &&
                    currentPhase >= Number(miningStatus.currentPhase)
                  "
                  >&nbsp;Round:&nbsp;<span
                    class="mining-status"
                    :class="miningStatus.roundStatus.status | filterStatus"
                    >{{ miningStatus.roundStatus.status | filterStatus }}</span
                  ></span
                >
              </td>
              <td>
                <span v-if="phaseConfigs && phaseConfigs.length"
                  >{{
                    phaseConfigs[currentPhase].start | formatDateFromNanosecond
                  }}
                  ~
                  {{
                    phaseConfigs[currentPhase].end | formatDateFromNanosecond
                  }}</span
                >
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <span>Round interval: </span
                  ><span>{{
                    phaseConfigs[currentPhase].interval | filterInterval
                  }}</span>
                </div>
              </td>
              <td>
                <div>
                  <span>Limit: </span
                  ><span
                    >{{ phaseConfigs[currentPhase].minCycles | filterCycles }} ~
                    {{
                      phaseConfigs[currentPhase].accountLimit | filterCycles
                    }}</span
                  >&nbsp;TCycles
                </div>
              </td>
              <td>
                <div>
                  <span>Supply per round: </span
                  ><span>{{
                    supplyPerRound | bigintToFloat(2, iclDecimals) | formatNum
                  }}</span>
                  ICL
                </div>
              </td>
            </tr>
            <tr v-if="currentPhase >= Number(miningStatus.currentPhase)">
              <td>
                <div>
                  <span>Total minted: </span
                  ><span
                    >{{
                      miningStatus.totalSupply
                        | bigintToFloat(2, iclDecimals)
                        | formatNum
                    }}
                    ICL</span
                  >
                </div>
              </td>
              <td>
                <div>
                  <span>Total received: </span>
                  <!--<span v-if="currentPhase < Number(miningStatus.currentPhase)"
                    >{{
                      historyList && historyList[currentPhase]
                    }}
                    TCycles</span
                  ><span v-else
                    >{{
                      miningStatus.totalCyclesReceived | filterCycles
                    }}
                    TCycles</span
                  >-->
                  <span
                    >{{
                      miningStatus.totalCyclesReceived | filterCycles
                    }}
                    TCycles</span
                  >
                </div>
              </td>
              <td>
                <div>
                  <span>Current round: </span>
                  <span>{{ currentRound }}</span>
                </div>
              </td>
            </tr>
            <tr v-if="currentPhase >= Number(miningStatus.currentPhase)">
              <td>
                <div>
                  <span>Round received: </span>
                  <span
                    >{{
                      miningStatus.roundStatus.cyclesReceived | filterCycles
                    }}
                    TCycles</span
                  >
                </div>
              </td>
              <td>
                <div>
                  <span>Mining rate: </span>
                  <span>{{ currentRate }} ICL/TCycles(est)</span>
                </div>
              </td>
              <td>
                <div>
                  <span>Your participated cycles: </span
                  ><span v-if="userHistory">{{
                    userHistory.cycles | filterCycles
                  }}</span
                  ><span v-if="userHistory"> TCycles</span><span v-else>-</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="getPrincipalId"
        class="mining-status-main"
        v-show="
          miningStatus && currentPhase >= Number(miningStatus.currentPhase)
        "
      >
        <div
          v-show="cyclesWallets ? !cyclesWallets.length : false"
          class="no-cycles-wallet"
        >
          You don't have a cycles wallet yet,
          <router-link to="/account">create or bind one.</router-link>
        </div>
        <div class="mining-whitelist" v-if="!isWhite">
          <p>
            Mining has enabled whitelisting and you are not in the whitelist.
            How do I join the whitelist? Please fill out
            <a
              href="https://forms.gle/1YpPNjGmB1Mau1JCA"
              target="_blank"
              rel="nofollow noreferrer noopener"
              >the form</a
            >
            to apply to become a Community Ambassador.
          </p>
        </div>
        <div class="mint-form-main">
          <a-form-model
            class="mint-form"
            :model="mintForm"
            ref="mintForm"
            :rules="mintRules"
            :hideRequiredMark="true"
          >
            <a-form-model-item label="Cycles Wallet" prop="cyclesWallet">
              <a-select
                v-model="mintForm.cyclesWallet"
                placeholder="select cycles wallet Canister-id"
                @change="changeWallet"
                notFoundContent="Not Found"
                option-label-prop="label"
                :filterOption="false"
              >
                <a-select-option
                  v-for="wallet in cyclesWallets"
                  :key="wallet.walletId.toString()"
                  :label="wallet.walletId.toString()"
                  >{{ wallet.walletId.toString() }}
                  <a-icon
                    class="remove-check-icon"
                    v-if="wallet.isDefault"
                    type="check-circle"
                /></a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="Amount" prop="cycles">
              <a-input
                class="input-cycles-suffix"
                v-model="mintForm.cycles"
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
                <p>Balance: {{ cycles }} TCycles&nbsp;</p>
                <a-icon
                  @click="getCycles"
                  v-show="!refreshCyclesLoading"
                  type="reload"
                  class="reload-icon"
                />
                <a-icon
                  v-show="refreshCyclesLoading"
                  type="loading"
                  class="reload-icon"
                />
              </div>
            </div>
            <button
              :disabled="
                !(
                  isWhite &&
                  miningStatus &&
                  Object.keys(miningStatus.roundStatus.status)[0] === 'opening'
                )
              "
              class="primary transfer-submit mt20 w100 large-primary"
              @click="submitMint"
            >
              Mint
            </button>
          </a-form-model>
        </div>
      </div>
      <a-spin :spinning="chartSpinning">
        <div id="mining-main-chart" ref="miningMainChart"></div>
      </a-spin>
      <div class="about-mining mt20">
        <div class="mining-phase-main-title">About ICL mining</div>
        <p>
          "Donating Cycles is mining" is one of the ways in which ICLs are
          distributed to the community. A specified amount of ICL will be
          supplied during each round of mining and will be distributed equally
          based on the amount of Cycles donated in the round.
        </p>
        <p>The Cycles donated will be used to:</p>
        <ul>
          <li>
            <span class="round"></span>Top up cycles to the ICLighthouse
            projects
          </li>
          <li><span class="round"></span>Provide liquidity for Dex</li>
          <li>
            <span class="round"></span>Ecological grants (Those projects based
            on&nbsp;<a
              href="https://github.com/iclighthouse/DRC_standards/tree/main/DRC20"
              target="_blank"
              rel="nofollow noreferrer noopener"
              >DRC20</a
            >, or&nbsp;<a
              href="http://ictokens.com"
              target="_blank"
              rel="nofollow noreferrer noopener"
              >ICTokens</a
            >)
          </li>
        </ul>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IcMiningService } from '@/ic/icMining/icMiningService';
import { ICManagementService } from '@/ic/ICManagement/ICManagementService';
import {
  MiningStatusResponse,
  PhaseConfig,
  RoundStatus,
  RoundUserStatus,
  Status
} from '@/ic/icMining/model';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import * as echarts from 'echarts/core';
import { namespace } from 'vuex-class';
import { validateCyclesWalletCanister } from '@/utils/validate';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { checkAuth } from '@/ic/CheckAuth';
import { WalletService } from '@/ic/wallet/walletService';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { IC_MINING_CANISTER_ID, validateCyclesWallet } from '@/ic/utils';
import { ManageWalletResponse } from '@/ic/ICLighthouse/model';
import { IDL } from '@dfinity/candid';
import { WalletCallRequest } from '@/ic/wallet/model';
import { toHttpError } from '@/ic/httpError';
import { EChartsType } from 'echarts/types/dist/shared';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';

const commonModule = namespace('common');

@Component({
  name: 'Mining',
  components: {},
  filters: {
    filterCycles(val: bigint): string {
      let cycles = '-';
      if (val || Number(val) === 0) {
        const length = val.toString().length;
        let decimal = 2;
        const minDecimal = 2;
        if (length < 10) {
          decimal = 12 + minDecimal - length;
        }
        cycles = new BigNumber(val.toString(10))
          .div(10 ** 12)
          .decimalPlaces(decimal, 1)
          .toFixed();
      }
      return cycles;
    },
    filterStatus(val: Status): string {
      if (val) {
        return Object.keys(val)[0];
      }
      return '';
    },
    filterInterval(val: bigint): string {
      if (val || Number(val) === 0) {
        const time = new BigNumber(val.toString(10)).div(1000000).toString(10);
        const HOUR = 1000 * 60 * 60;
        const d = new BigNumber(time)
          .div(HOUR)
          .div(24)
          .integerValue(1)
          .toNumber();
        const h = new BigNumber(time)
          .modulo(HOUR * 24)
          .div(HOUR)
          .integerValue(1)
          .toNumber();
        const m = new BigNumber(time)
          .modulo(HOUR)
          .div(1000)
          .div(60)
          .integerValue(1)
          .toNumber();
        const s = new BigNumber(time)
          .modulo(1000 * 60)
          .div(1000)
          .integerValue(1)
          .toNumber();

        let text = '';
        d && (text += `${d} days`);
        h && (text += `${h} hours`);
        m && (text += `${m} mins`);
        s && (text += `${s} seconds`);
        return text || '-';
      }
      return '-';
    }
  }
})
export default class extends Vue {
  $refs!: { mintForm; miningMainChart };
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private phaseSpinning = false;
  private IcMiningService: IcMiningService;
  private walletService: WalletService;
  private ICLighthouseService: ICLighthouseService;
  private refreshCyclesLoading = false;
  private miningStatus: MiningStatusResponse = null;
  private currentRound = BigInt('0');
  private phaseConfigs: PhaseConfig[] = [];
  private iclDecimals = 8;
  // private principalId = '';
  private userHistory: RoundUserStatus = null;
  private historyList: Array<RoundStatus> = [];
  private userHistoryList: Array<RoundUserStatus> = [];
  private timer = null;
  private currentPhase = 0;
  private isWhite = true;
  private mintModal = false;
  private cycles = '-';
  private freezingThreshold = '0';
  private ICManagementService: ICManagementService;
  private minDisabled = true;
  private chartSpinning = false;
  private historyPhaseInfo = {};
  private myChart: EChartsType;
  private mintForm = {
    cyclesWallet: '',
    cycles: ''
  };
  private mintRules = {
    cyclesWallet: [
      {
        required: true,
        message: 'select cycles wallet Canister-id',
        trigger: 'blur'
      },
      { validator: validateCyclesWalletCanister, trigger: 'blur' }
    ],
    cycles: [
      { required: true, message: 'Please enter cycles', trigger: 'blur' },
      { validator: this.validateAmount, trigger: 'blur' }
    ]
  };
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const currentPhase = this.phaseConfigs[this.phaseConfigs.length - 1];
    const max = new BigNumber(this.cycles)
      .minus(this.freezingThreshold)
      .lt(value);
    const minCycles = currentPhase.minCycles;
    const min = new BigNumber(value).times(10 ** 12).lt(minCycles.toString(10));
    let totalCyclesReceived = BigInt('0');
    if (this.miningStatus && this.miningStatus.totalCyclesReceived) {
      totalCyclesReceived = this.miningStatus.totalCyclesReceived;
    }
    let userCycles = BigInt('0');
    if (this.userHistory && this.userHistory.cycles) {
      userCycles = this.userHistory.cycles;
    }
    // const maxTotalLimit = new BigNumber(
    //   currentPhase.totalLimit.toString()
    // ).minus(totalCyclesReceived.toString());
    const maxLimit = new BigNumber(
      currentPhase.accountLimit.toString(10)
    ).minus(userCycles.toString(10));
    // let maxLimit = '0';
    // if (maxTotalLimit.lt(maxAccountLimit)) {
    //   maxLimit = maxTotalLimit.toString();
    // } else {
    //   maxLimit = maxAccountLimit.toString();
    // }
    if (value && max) {
      const cycles = new BigNumber(this.cycles)
        .minus(this.freezingThreshold)
        .toString(10);
      console.log(this.cycles, this.freezingThreshold, cycles);
      if (new BigNumber(cycles).lt(0)) {
        callback(`Insufficient cycles`);
      } else {
        callback(`You can enter up to ${cycles} TCycles.`);
      }
    } else if (new BigNumber(value).times(10 ** 12).gt(maxLimit)) {
      callback(
        `Max amount is ${new BigNumber(maxLimit)
          .div(10 ** 12)
          .decimalPlaces(12)
          .toFixed()} TCycles`
      );
    } else if (min) {
      callback(
        `Min amount is ${new BigNumber(minCycles.toString(10))
          .div(10 ** 12)
          .decimalPlaces(12)
          .toFixed()} TCycles`
      );
    } else {
      callback();
    }
  }
  private cyclesWallets: Array<ManageWalletResponse> = [];
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
  }
  get supplyPerRound(): string {
    if (this.miningStatus && this.phaseConfigs) {
      if (
        this.phaseConfigs.length ===
        new BigNumber(this.miningStatus.currentPhase.toString(10))
          .plus(1)
          .toNumber()
      ) {
        const phase = Number(this.currentPhase);
        let halvingNum = 0;
        if (this.phaseConfigs[phase].halving) {
          const now = new Date().getTime();
          const end = new BigNumber(
            this.phaseConfigs[phase].end.toString(10)
          ).div(1000000);
          let nowRoundTime = '';
          if (end.lt(now)) {
            nowRoundTime = end.toString(10);
          } else {
            nowRoundTime = now.toString(10);
          }
          halvingNum = new BigNumber(nowRoundTime)
            .minus(
              new BigNumber(this.phaseConfigs[phase].start.toString(10)).div(
                1000000
              )
            )
            .div(
              new BigNumber(this.phaseConfigs[phase].halving.toString(10)).div(
                1000000
              )
            )
            .decimalPlaces(0, 1)
            .toNumber();
          if (
            new BigNumber(this.phaseConfigs[phase].end.toString(10))
              .div(1000000)
              .lte(
                new BigNumber(
                  new BigNumber(
                    this.phaseConfigs[phase].halving.toString(10)
                  ).div(1000000)
                )
                  .times(halvingNum)
                  .plus(
                    new BigNumber(
                      this.phaseConfigs[phase].start.toString(10)
                    ).div(1000000)
                  )
              )
          ) {
            halvingNum = halvingNum - 1;
          }
          return new BigNumber(this.phaseConfigs[phase].supply.toString(10))
            .times(0.5 ** halvingNum)
            .toString(10);
        } else {
          return this.phaseConfigs[phase].supply.toString(10);
        }
      }
      return '';
    }
    return '';
  }
  get miningIsClosed(): boolean {
    let flag = false;
    if (this.miningStatus && this.phaseConfigs) {
      if (this.currentPhase < Number(this.miningStatus.currentPhase)) {
        return true;
      }
      if (
        this.phaseConfigs.length ===
        new BigNumber(this.miningStatus.currentPhase.toString(10))
          .plus(1)
          .toNumber()
      ) {
        const phase = Number(this.miningStatus.currentPhase);
        return (
          this.miningStatus.roundStatus.isSettled &&
          new BigNumber(this.phaseConfigs[phase].end.toString(10))
            .div(1000000)
            .lt(new Date().getTime())
        );
      }
    }
    return flag;
  }
  get currentRate(): string {
    if (this.miningStatus) {
      const currentPhase = Number(this.miningStatus.currentPhase);
      if (
        this.phaseConfigs.length === currentPhase + 1 &&
        this.miningStatus.roundStatus.cyclesReceived
      ) {
        const rate = new BigNumber(
          this.phaseConfigs[this.phaseConfigs.length - 1].supply.toString(10)
        )
          .div(10 ** this.iclDecimals)
          .div(this.miningStatus.roundStatus.cyclesReceived.toString(10))
          .times(10 ** 12)
          .decimalPlaces(2, 1)
          .toString(10);
        if (new BigNumber(rate).gt(10 ** 10)) {
          return (
            new BigNumber(rate)
              .div(10 ** 12)
              .decimalPlaces(4)
              .toString(10) + ' M'
          );
        } else {
          return rate;
        }
      }
    }
    return '-';
  }
  created(): void {
    this.walletService = new WalletService();
    this.IcMiningService = new IcMiningService();
    this.ICLighthouseService = new ICLighthouseService();
    this.ICManagementService = new ICManagementService();
    // this.principalId = localStorage.getItem('principal');
    if (this.getPrincipalId) {
      this.getWallets();
      this.getWhitelist();
    }
    this.getMiningStatus();
    this.getIntervalHistory();
    this.$nextTick(() => {
      const chartDom = document.getElementById('mining-main-chart');
      this.myChart = echarts.init(chartDom);
    });
  }
  private changePhase(page: number) {
    this.$refs.mintForm.resetFields();
    this.currentPhase = page - 1;
    if (this.currentPhase < this.phaseConfigs.length - 1) {
      window.clearInterval(this.timer);
      this.timer = null;
      this.getHistoryPhase();
    } else {
      if (this.cyclesWallets.length) {
        this.mintForm.cyclesWallet = this.cyclesWallets[0].walletId.toString();
        this.getCycles();
      }
      this.getIntervalHistory();
      this.initEcharts(this.currentPhase, 'changePhase');
    }
  }
  private itemRender(current, type, originalElement): any {
    if (type === 'page') {
      return `Phase ${current - 1}`;
    }
    return originalElement;
  }
  private async submitMint(): Promise<void> {
    this.$refs.mintForm.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          const args = IDL.encode(
            [IDL.Principal],
            [Principal.fromText(this.getPrincipalId)]
          );
          const walletSendRequest: WalletCallRequest = {
            args: Array.from(Buffer.from(args)),
            cycles: BigInt(new BigNumber(this.mintForm.cycles).times(10 ** 12)),
            method_name: 'mint',
            canister: Principal.fromText(IC_MINING_CANISTER_ID)
          };
          const res = await this.walletService.walletCall(
            walletSendRequest,
            this.mintForm.cyclesWallet
          );
          console.dir(res);
          loading.close();
          if ((res as { Err: string }).Err) {
            this.$message.error((res as { Err: string }).Err);
          } else {
            this.$message.success('Mint Success');
            this.getMiningStatus('reload');
            this.getCycles();
            this.mintModal = false;
            this.mintForm.cycles = '';
          }
        } catch (e) {
          loading.close();
          this.$message.error(toHttpError(e).message);
          console.log(e);
        }
      }
    });
  }
  private async getWallets(): Promise<void> {
    const wallets = await this.ICLighthouseService.getWallets();
    let obj = {};
    this.cyclesWallets = wallets.reduce((cur, next) => {
      obj[next.walletId.toString()]
        ? ''
        : (obj[next.walletId.toString()] = true && cur.push(next));
      return cur;
    }, []);
    if (this.cyclesWallets.length) {
      this.mintForm.cyclesWallet = this.cyclesWallets[0].walletId.toString();
      this.getCycles();
    }
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (priList[this.getPrincipalId] === 'Plug') {
      this.connectPlug();
    }
  }
  private async connectPlug(): Promise<void> {
    const canisterIds = [];
    this.cyclesWallets.forEach((item) => {
      canisterIds.push(item.walletId.toString());
    });
    await checkAuth();
    const flag = needConnectPlug(canisterIds);
    if (flag && this.$route.name === 'mining') {
      // const h = this.$createElement;
      this.$info({
        content: 'Cycles wallet need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(canisterIds);
        }
      });
    }
    const connectInfinity = await needConnectInfinity(canisterIds);
    if (connectInfinity && this.$route.name === 'mining') {
      // const h = this.$createElement;
      this.$info({
        content: 'Cycles wallet need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity(canisterIds);
        }
      });
    }
  }
  private changeWallet(): void {
    this.cycles = '-';
    this.freezingThreshold = '0';
    this.getCycles();
  }
  private async getCycles(type?: string): Promise<void> {
    if (validateCyclesWallet(this.mintForm.cyclesWallet)) {
      if (!type || type !== 'interval') {
        this.refreshCyclesLoading = true;
      }
      try {
        if (Number(this.freezingThreshold)) {
          const res = await this.walletService.getWalletBalance(
            this.mintForm.cyclesWallet.trim()
          );
          this.cycles = new BigNumber(res.amount.toString(10))
            .div(10 ** 12)
            .decimalPlaces(12, 1)
            .toString(10);
        } else {
          const status = await this.ICManagementService.canisterStatus(
            Principal.fromText(this.mintForm.cyclesWallet)
          );
          this.cycles = new BigNumber(status.cycles.toString(10))
            .div(10 ** 12)
            .decimalPlaces(12, 1)
            .toString(10);
          // todo
          this.freezingThreshold = new BigNumber(
            status.memory_size.toString(10)
          )
            .div(1024 * 1024 * 1024)
            .times(127000)
            .times(
              new BigNumber(
                status.settings.freezing_threshold.toString(10)
              ).plus(60)
            )
            .plus(10 ** 10)
            .div(10 ** 12)
            .decimalPlaces(12)
            .toString(10);
        }
        this.refreshCyclesLoading = false;
        if (
          this.mintForm.cycles &&
          this.mintForm.cycles !== '-' &&
          type !== 'interval'
        ) {
          this.$refs.mintForm.validateField('cycles');
        }
      } catch (e) {
        this.refreshCyclesLoading = false;
        this.cycles = '-';
        this.freezingThreshold = '0';
        console.log(e);
      }
    } else {
      this.cycles = '-';
    }
  }
  private async getWhitelist(): Promise<void> {
    const flag = await this.whitelistOn();
    if (flag) {
      this.isWhite = await this.checkWhitelist();
    } else {
      this.isWhite = true;
    }
  }
  private async whitelistOn(): Promise<boolean> {
    return this.IcMiningService.whitelistOn();
  }
  private async checkWhitelist(): Promise<boolean> {
    return this.IcMiningService.checkWhitelist(
      Principal.fromText(this.getPrincipalId)
    );
  }
  private getIntervalHistory(): void {
    this.timer = window.setInterval(async () => {
      setTimeout(async () => {
        if (!this.getCheckAuth) {
          // this.getWhitelist();
          this.getMiningStatus('interval');
          this.getCycles('interval');
        }
      }, 0);
    }, 30000);
  }
  private initEcharts(phase: number, type?: string): void {
    const colors = ['#1996c4', '#EE6666', '#d29967'];
    const xData = [];
    let currentHistoryList = [];
    let currentUserHistoryList = [];
    if (this.historyPhaseInfo[phase]) {
      currentHistoryList = this.historyPhaseInfo[phase].historyList;
      currentUserHistoryList =
        this.historyPhaseInfo[phase].userHistoryList || [];
    }
    const cyclesReceived = currentHistoryList.map((item) => {
      if (item) {
        return new BigNumber(item.cyclesReceived.toString(10))
          .div(10 ** 12)
          .decimalPlaces(12, 1)
          .toNumber();
      } else {
        return 0;
      }
    });
    const userHistoryCycles = currentUserHistoryList.map((item) => {
      if (item) {
        return new BigNumber(item.cycles.toString(10))
          .div(10 ** 12)
          .decimalPlaces(12, 1)
          .toNumber();
      } else {
        return 0;
      }
    });
    let maxCycles = '0';
    cyclesReceived.forEach((item) => {
      if (new BigNumber(item.toString(10)).gt(maxCycles)) {
        maxCycles = item.toString(10);
      }
    });
    const rates = [];
    let currentRound;
    if (this.currentPhase === Number(this.miningStatus.currentPhase)) {
      if (this.roundCount() > this.miningStatus.currentRound) {
        currentRound = BigInt(this.roundCount());
      } else {
        currentRound = this.miningStatus.currentRound;
      }
    } else {
      currentRound = this.roundCount();
    }
    for (let i = 0; i <= currentRound; i++) {
      xData.push(`Round ${i}`);
      let currentRate = 0;
      if (
        this.phaseConfigs[this.phaseConfigs.length - 1] &&
        currentHistoryList[i] &&
        currentHistoryList[i].cyclesReceived
      ) {
        currentRate = new BigNumber(
          this.phaseConfigs[this.phaseConfigs.length - 1].supply.toString(10)
        )
          .div(10 ** this.iclDecimals)
          .div(currentHistoryList[i].cyclesReceived.toString(10))
          .times(10 ** 12)
          .decimalPlaces(2, 1)
          .toNumber();
      }
      rates.push(currentRate);
    }
    const minted = currentUserHistoryList.reduce((sum, item) => {
      if (item && item.mintAmount) {
        return new BigNumber(sum)
          .plus(item.mintAmount.toString(10))
          .toString(10);
      } else {
        return sum;
      }
    }, '0');
    const participated = currentUserHistoryList.reduce((sum, item) => {
      if (item && item.cycles) {
        return new BigNumber(sum).plus(item.cycles.toString(10)).toString(10);
      } else {
        return sum;
      }
    }, '0');
    const option = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      title: {
        textStyle: { color: '#9d9d9d', fontSize: 14, fontWeight: 'normal' },
        text: `Your minted token: ${new BigNumber(minted)
          .div(10 ** this.iclDecimals)
          .decimalPlaces(2, 1)
          .toString(10)} ICL   Your participated cycles: ${new BigNumber(
          participated
        )
          .div(10 ** 12)
          .decimalPlaces(12, 1)
          .toString(10)} TCycles`,
        bottom: 8,
        left: 20
      },
      legend: {
        data: [
          { name: 'Cycles received', textStyle: { color: '#9d9d9d' } },
          { name: 'Your participated cycles', textStyle: { color: '#9d9d9d' } },
          { name: 'Mining rate', textStyle: { color: '#9d9d9d' } }
        ],
        top: 20,
        selectedMode: false
      },
      grid: {
        top: 80,
        bottom: 110
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: xData
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Mining rate (ICL/TCycles)',
          min: 0,
          max: Math.max(...rates),
          position: 'right',
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[2]
            }
          },
          axisLabel: {
            formatter: function (value) {
              if (new BigNumber(value).gt(10 ** 10)) {
                return (
                  new BigNumber(value)
                    .div(10 ** 12)
                    .decimalPlaces(4)
                    .toString(10) + ' M'
                );
              } else {
                return value;
              }
            }
          }
        },
        {
          type: 'value',
          name: 'Cycles (TCycles)',
          min: 0,
          // max: new BigNumber(maxCycles).toNumber(),
          position: 'left',
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[0]
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: 'Cycles (TCycles)',
          min: 0,
          // max: new BigNumber(maxCycles).toNumber(),
          position: 'left',
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[0]
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: 'Cycles received',
          type: 'bar',
          barMaxWidth: 20,
          yAxisIndex: 2,
          data: cyclesReceived
        },
        {
          name: 'Your participated cycles',
          type: 'bar',
          barMaxWidth: 20,
          yAxisIndex: 1,
          data: userHistoryCycles
        },
        {
          name: 'Mining rate',
          type: 'line',
          symbol: 'circle',
          yAxisIndex: 0,
          data: rates
        }
      ],
      dataZoom: []
    };
    const optionConfig = this.myChart.getOption();
    const bar = 60;
    const percent =
      this.$refs.miningMainChart.clientWidth / bar / cyclesReceived.length;
    if (
      optionConfig &&
      optionConfig.dataZoom &&
      optionConfig.dataZoom[0] &&
      !type
    ) {
      if (percent < 1) {
        option.dataZoom = [
          {
            type: 'slider',
            show: true,
            start: optionConfig.dataZoom[0].start,
            end: optionConfig.dataZoom[0].end,
            bottom: 50
          }
        ];
      }
    } else {
      if (percent < 1) {
        option.dataZoom = [
          {
            type: 'slider',
            show: true,
            start: (1 - percent) * 100,
            end: 100,
            bottom: 50
          }
        ];
      }
    }
    if (percent >= 1) {
      if (option.dataZoom && option.dataZoom[0]) {
        option.dataZoom[0].show = false;
      } else {
        option.dataZoom = [
          {
            type: 'slider',
            start: 0,
            end: 100,
            bottom: 50,
            show: false
          }
        ];
      }
      option.grid.bottom = 70;
    }
    if (phase && this.currentPhase !== phase) {
      return;
    }
    option && this.myChart.setOption(option);
    this.chartSpinning = false;
  }
  private roundCount(): number {
    let roundCount = 0;
    const now = new Date().getTime();
    const end = new BigNumber(
      this.phaseConfigs[this.currentPhase].end.toString(10)
    ).div(1000000);
    let nowRoundTime = '';
    if (end.lt(now)) {
      nowRoundTime = end.toString(10);
    } else {
      nowRoundTime = now.toString(10);
    }
    roundCount = new BigNumber(nowRoundTime)
      .minus(
        new BigNumber(
          this.phaseConfigs[this.currentPhase].start.toString(10)
        ).div(1000000)
      )
      .div(
        new BigNumber(
          this.phaseConfigs[this.currentPhase].interval.toString(10)
        ).div(1000000)
      )
      .decimalPlaces(0, 1)
      .toNumber();
    if (end.lt(now)) {
      return roundCount - 1;
    } else {
      return roundCount;
    }
  }
  private async getHistoryPhase(): Promise<void> {
    const phase = this.currentPhase;
    if (!this.historyPhaseInfo[phase]) {
      this.initEcharts(phase);
      this.chartSpinning = true;
      // this.myChart.showLoading({
      //   text: 'loading...',
      //   textStyle: { fontSize: 30, color: '#444' },
      //   effectOption: { backgroundColor: 'rgba(0, 0, 0, 0)' }
      // });
      const promiseAllHistoryValue = [];
      const promiseAllUserHistoryValue = [];
      for (let i = 0; i <= this.roundCount(); i++) {
        promiseAllHistoryValue.push(this.getHistory(BigInt(phase), BigInt(i)));
        promiseAllUserHistoryValue.push(
          this.getUserHistory(BigInt(phase), BigInt(i))
        );
      }
      await Promise.all([
        ...promiseAllHistoryValue,
        ...promiseAllUserHistoryValue
      ]);
    }
    this.initEcharts(phase);
  }
  private async getMiningStatus(type?: string): Promise<void> {
    if (!type) {
      this.phaseSpinning = true;
    }
    this.miningStatus = await this.IcMiningService.status();
    const phaseStatus = Object.keys(this.miningStatus.phaseStatus)[0];
    this.minDisabled = phaseStatus !== 'opening';
    if (!type) {
      const promiseAllValue = [];
      for (let i = 0; i <= this.miningStatus.currentPhase; i++) {
        promiseAllValue.push(this.getConfigLog(BigInt(i)));
      }
      this.phaseConfigs = await Promise.all(promiseAllValue);
      console.log(this.phaseConfigs);
      this.currentPhase = Number(this.miningStatus.currentPhase);
    } else {
      const currentPhaseConfig = await this.getConfigLog(
        this.miningStatus.currentPhase
      );
      if (
        this.phaseConfigs.length ===
        Number(this.miningStatus.currentPhase) + 1
      ) {
        this.phaseConfigs.splice(
          this.phaseConfigs.length - 1,
          1,
          currentPhaseConfig
        );
      } else {
        const promiseAllValue = [];
        let newPhaseConfigs = [];
        for (
          let i = this.phaseConfigs.length - 1;
          i <= Number(this.miningStatus.currentPhase);
          i++
        ) {
          promiseAllValue.push(this.getConfigLog(BigInt(i)));
        }
        newPhaseConfigs = await Promise.all(promiseAllValue);
        this.phaseConfigs.splice(this.phaseConfigs.length - 1, 1);
        this.phaseConfigs.push(...newPhaseConfigs);
        this.currentPhase = this.phaseConfigs.length - 1;
      }
    }
    if (this.roundCount() > this.miningStatus.currentRound) {
      this.currentRound = BigInt(this.roundCount());
    } else {
      this.currentRound = this.miningStatus.currentRound;
    }
    console.log('roundCount: ' + this.roundCount(), this.miningStatus);
    // console.log(this.miningStatus);
    // this.currentRound = BigInt(this.roundCount());
    this.userHistory = await this.getUserHistory(
      this.miningStatus.currentPhase,
      this.currentRound
    );
    if (
      phaseStatus !== 'stopped' ||
      this.historyList.length < this.currentRound
    ) {
      const promiseAllHistoryValue = [];
      const promiseAllUserHistoryValue = [];
      for (let i = 0; i <= this.currentRound; i++) {
        if (type && i < Number(this.currentRound) - 1) {
          promiseAllHistoryValue.push(this.historyList[i]);
          promiseAllUserHistoryValue.push(this.userHistoryList[i]);
        } else {
          promiseAllHistoryValue.push(
            this.getHistory(this.miningStatus.currentPhase, BigInt(i))
          );
          promiseAllUserHistoryValue.push(
            this.getUserHistory(this.miningStatus.currentPhase, BigInt(i))
          );
        }
      }
      await Promise.all([
        ...promiseAllHistoryValue,
        ...promiseAllUserHistoryValue
      ]);
    }
    const currentRound = this.currentRound;
    const currentPhase = this.phaseConfigs[this.phaseConfigs.length - 1];
    // If the current time is greater than the current round settlement time
    const currentRoundEnd = new BigNumber(currentRound.toString(10))
      .plus(1)
      .times(currentPhase.interval.toString(10))
      .plus(currentPhase.start.toString(10))
      .div(1000000)
      .lt(new Date().getTime());
    if (currentRoundEnd && !this.miningStatus.roundStatus.isSettled) {
      this.settle();
    }
    try {
      if (
        Object.keys(this.miningStatus.phaseStatus)[0] === 'opening' &&
        Object.keys(this.miningStatus.roundStatus)[0] === 'prepared' &&
        new BigNumber(new Date().getTime())
          .times(1000000)
          .gt(currentPhase.start.toString(10))
      ) {
        this.updateStatus();
      }
    } catch (e) {
      console.log(e);
    }
    this.phaseSpinning = false;
    this.$nextTick(() => {
      this.initEcharts(this.currentPhase);
    });
    // console.log(this.phaseConfigs, this.historyList, this.userHistory);
  }
  private async updateStatus(): Promise<void> {
    await this.IcMiningService.updateStatus();
  }
  private async settle(): Promise<void> {
    await this.IcMiningService.settle();
  }
  private async getConfigLog(phase: bigint): Promise<PhaseConfig> {
    return await this.IcMiningService.configLog(phase);
  }
  private async getUserHistory(
    phase: bigint,
    round: bigint
  ): Promise<RoundUserStatus> {
    if (!this.getPrincipalId) {
      return null;
    }
    try {
      const history = await this.IcMiningService.userHistory(
        Principal.fromText(this.getPrincipalId),
        phase,
        round
      );
      if (!this.historyPhaseInfo[Number(phase)]) {
        this.historyPhaseInfo[Number(phase)] = {};
      }
      if (!this.historyPhaseInfo[Number(phase)].userHistoryList) {
        this.historyPhaseInfo[Number(phase)].userHistoryList = [];
      }
      if (history && history.length) {
        this.historyPhaseInfo[Number(phase)].userHistoryList[Number(round)] =
          history[0];
        return history[0];
      } else {
        this.historyPhaseInfo[Number(phase)].userHistoryList[Number(round)] =
          undefined;
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getHistory(phase: bigint, round: bigint): Promise<RoundStatus> {
    try {
      const history = await this.IcMiningService.history(phase, round);
      if (!this.historyPhaseInfo[Number(phase)]) {
        this.historyPhaseInfo[Number(phase)] = {};
      }
      if (!this.historyPhaseInfo[Number(phase)].historyList) {
        this.historyPhaseInfo[Number(phase)].historyList = [];
      }
      if (history && history.length) {
        this.historyPhaseInfo[Number(phase)].historyList[Number(round)] =
          history[0];
        return history[0];
      } else {
        this.historyPhaseInfo[Number(phase)].historyList[Number(round)] =
          undefined;
      }
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style scoped lang="scss">
.mining-phase-main {
  width: 100%;
  height: 149px;
  color: #666;
  background: #141b23;
  line-height: 1;
  padding: 15px 30px;
  &.mining-phase-main-per {
    height: 89px;
  }
  table {
    tr {
      height: 30px;
      line-height: 30px;
      padding: 0;
      background: initial;
    }
    td {
      padding: 0;
      white-space: nowrap;
    }
  }
  .mining-phase-main-item {
    display: flex;
    align-items: center;
    margin: 30px 0;
    > div {
      &:last-child {
        padding-left: 15px;
      }
    }
  }
}

.mining-status-main {
  margin-top: 10px;
  color: #666;
  background: #141b23;
  line-height: 1.2;
  padding: 20px 30px;
}
.mining-status {
  &.stopped {
    color: #de483d;
  }
  &.opening {
    color: #1996c4;
  }
}
.mining-title {
  display: flex;
  align-items: center;
  span {
    display: flex;
    align-items: center;
    height: 24px;
  }
  .mining-title-status {
    color: #9d9d9d;
    font-size: 18px;
  }
  button {
    width: 100px;
    height: 40px;
    margin-left: auto;
  }
}
#mining-main-chart {
  width: 100%;
  height: 350px;
  margin-top: 20px;
  color: #9d9d9d;
  background: #141b23;
}
.mint-form {
  width: 450px;
  margin: 0 auto;
  ::v-deep .ant-select-selection__placeholder {
    color: #727a87;
  }
  ::v-deep .ant-select-selection__rendered {
    line-height: 36px;
  }
  ::v-deep .ant-select-combobox .ant-select-search__field {
    border: none !important;
    padding: 0;
  }
}
.mining-phase-num {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  ::v-deep .ant-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ::v-deep .ant-pagination-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 130px;
    border-radius: 4px;
    border: 1px solid #606067;
    color: #9d9d9d;
    padding: 0;
    transition: all 0.3s;
  }
  ::v-deep .ant-pagination-item-active {
    background: #3aa8b5;
    border-color: #3aa8b5;
    color: #fff;
  }
  ::v-deep .ant-pagination-next,
  ::v-deep .ant-pagination-prev {
    display: none;
  }
}
.mining-whitelist {
  a {
    color: #1996c4;
  }
}
.about-mining {
  background: #141b23;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 20px 30px;
  color: #747884;
  line-height: 1.5;
  .mining-phase-main-title {
    color: #adb3c4;
    font-size: 18px;
    margin-bottom: 10px;
  }
  a {
    color: #1996c4;
  }
  li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .round {
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 10px;
    border-radius: 3px;
    background: #666;
  }
}
.transfer-balance-left {
  display: flex;
  align-items: center;
}
.no-cycles-wallet {
  width: 450px;
  text-align: center;
  margin: -10px auto 0;
  a {
    color: #1996c4;
  }
}
.transfer-submit {
  height: 50px !important;
}
.remove-check-icon {
  position: absolute;
  right: 5px;
  top: 9px;
}
@media screen and (max-width: 768px) {
  .mining-phase-main {
    height: auto;
    overflow-x: auto;
  }
  .mint-form {
    width: 100%;
  }
  .no-cycles-wallet {
    width: 100%;
  }
  .mining-whitelist {
    margin: 10px 0;
  }
}
</style>
