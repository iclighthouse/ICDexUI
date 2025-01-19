<template>
  <div>
    <div class="container-width neuron-main">
      <div v-if="getPrincipalId" class="neurons-list-header">
        <button
          type="button"
          class="primary margin-left-auto"
          @click="onStakeNeuron()"
        >
          Stake
        </button>
      </div>
      <div class="neurons-list-main" v-if="getPrincipalId && spinning">
        <div class="neurons-list-item">
          <a-skeleton :loading="spinning" active> </a-skeleton>
        </div>
      </div>
      <div class="neurons-list-main" v-if="getPrincipalId && neuronList.length">
        <div
          class="neurons-list-item"
          v-for="(neuron, index) in neuronList"
          :key="index"
        >
          <div class="neurons-list-header">
            <copy-account
              :front="4"
              :account="neuron.id[0].id.toString(10)"
              copy-text="Neuron ID"
            ></copy-account>
            <div class="margin-left-auto">
              <a-icon
                v-show="getNeuronStatus(neuron) === 'Locked'"
                type="lock"
              />
              <a-icon
                v-show="
                  getNeuronStatus(neuron) === 'Dissolving' ||
                  getNeuronStatus(neuron) === 'Dissolved'
                "
                type="clock-circle"
              />
              {{ getNeuronStatus(neuron) }}
            </div>
          </div>
          <div class="neurons-status-info h5-show">
            <!--<div>
							<span v-if="getNeuronStatus(neuron) === 'Locked'">
								Age {{ neuron.age }}
							</span>
						</div>-->
            <div>
              <span
                v-show="
                  getNeuronStatus(neuron) === 'Dissolving' ||
                  getNeuronStatus(neuron) === 'Dissolved'
                "
                >Remaining
              </span>
              <span v-show="getNeuronStatus(neuron) === 'Locked'"
                >Dissolve Delay
              </span>
              <span v-show="getNeuronStatus(neuron) !== 'Unspecified'">
                <down
                  v-if="isH5"
                  :neuron="neuron"
                  :index="index"
                  @finish="finish"
                ></down>
              </span>
            </div>
          </div>
          <div class="neurons-list-balance">
            <span class="base-font-title">Staked</span>
            <div class="neurons-list-balance-dissolve-time pc-show">
              <a-tooltip placement="top">
                <template slot="title">
                  <span
                    v-show="
                      getNeuronStatus(neuron) === 'Dissolving' ||
                      getNeuronStatus(neuron) === 'Dissolved'
                    "
                    >Remaining
                  </span>
                  <span v-show="getNeuronStatus(neuron) === 'Locked'"
                    >Dissolve Delay
                  </span>
                </template>
                <a-icon
                  v-show="
                    getNeuronStatus(neuron) === 'Locked' ||
                    getNeuronStatus(neuron) === 'Dissolving' ||
                    getNeuronStatus(neuron) === 'Dissolved'
                  "
                  type="clock-circle"
                />
              </a-tooltip>
              <span v-show="getNeuronStatus(neuron) !== 'Unspecified'">
                &nbsp;<down
                  v-if="!isH5"
                  :neuron="neuron"
                  :index="index"
                  @finish="finish"
                ></down>
              </span>
            </div>
            <div class="margin-left-auto">
              <span class="neuron-balance"> {{ getNeuronBalance(neuron) }}</span
              ><span class="neuron-symbol">ICP </span>
            </div>
          </div>
          <div class="operation pc-show">
            <a-tooltip placement="top">
              <template slot="title">
                <span
                  >Neuron needs a minimum stake of
                  {{ minStakeSplittable() }}
                  ICP to be splittable.</span
                >
              </template>
              <div>
                <button
                  v-show="!canSplit(index) && showOperation(index)"
                  disabled
                  type="button"
                >
                  <span>Split</span>
                </button>
              </div>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title"> Split Neuron </template>
              <button
                v-show="canSplit(index) && showOperation(index)"
                type="button"
                @click="onSplit(neuron, index)"
              >
                <span>Split</span>
              </button>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title"> Increase Staked ICP </template>
              <button @click="onTopUpNeuron(neuron, index)" type="button">
                <span><a-icon class="pc-show" type="plus" />Stake</span>
              </button>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title"> Set Dissolve Delay </template>
              <button
                v-show="showOperation(index)"
                type="button"
                @click="onIncreaseDissolveDelay(neuron, index)"
              >
                <span>Delay</span>
              </button>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title"> Start Dissolving </template>
              <button
                @click="onStartDissolving(neuron, index)"
                v-show="
                  getNeuronStatus(neuron) === 'Locked' && showOperation(index)
                "
                type="button"
              >
                <span>Dissolve</span>
              </button>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title"> Stop Dissolving </template>
              <button
                @click="onStopDissolving(neuron, index)"
                v-show="
                  getNeuronStatus(neuron) === 'Dissolving' &&
                  showOperation(index)
                "
                type="button"
              >
                <span>Stop</span>
              </button>
            </a-tooltip>
            <button
              v-show="
                getNeuronStatus(neuron) === 'Dissolved' && showOperation(index)
              "
              type="button"
              class="primary"
              @click="onDisburse(neuron, index)"
            >
              <span>Disburse</span>
            </button>
          </div>
          <div class="operation h5-show">
            <div>
              <button
                v-show="!canSplit(index) && showOperation(index)"
                disabled
                type="button"
              >
                <span>Split</span>
              </button>
            </div>
            <button
              v-show="canSplit(index) && showOperation(index)"
              type="button"
              @click="onSplit(neuron, index)"
            >
              <span>Split</span>
            </button>
            <button @click="onTopUpNeuron(neuron, index)" type="button">
              <span><a-icon class="pc-show" type="plus" />Stake</span>
            </button>
            <button
              v-show="showOperation(index)"
              type="button"
              @click="onIncreaseDissolveDelay(neuron, index)"
            >
              <span>Delay</span>
            </button>
            <button
              @click="onStartDissolving(neuron, index)"
              v-show="
                getNeuronStatus(neuron) === 'Locked' && showOperation(index)
              "
              type="button"
            >
              <span>Dissolve</span>
            </button>
            <button
              @click="onStopDissolving(neuron, index)"
              v-show="
                getNeuronStatus(neuron) === 'Dissolving' && showOperation(index)
              "
              type="button"
            >
              <span>Stop</span>
            </button>
            <button
              v-show="
                getNeuronStatus(neuron) === 'Dissolved' && showOperation(index)
              "
              type="button"
              class="primary"
              @click="onDisburse(currentNeuronInfoIndex, index)"
            >
              <span>Disburse</span>
            </button>
          </div>
          <div class="neurons-list-balance neurons-list-balance-border">
            <span class="base-font-title">Maturity</span>
            <div class="operation pc-show">
              <button
                v-show="showOperation(index)"
                type="button"
                :disabled="canDisburseMaturity(neuron)"
                @click="onStakeMaturity(index)"
              >
                <span>Stake</span>
              </button>
              <button
                v-show="showOperation(index)"
                :disabled="canSpawnNeuron(neuron)"
                type="button"
                @click="onSpawnNeuron(neuron)"
              >
                <span>Spawn</span>
              </button>
            </div>
            <span class="neuron-balance margin-left-auto">
              {{ getNeuronMaturityBalance(neuron) }}
            </span>
            <span class="neuron-symbol">ICP </span>
          </div>
          <div class="operation h5-show">
            <button
              v-show="showOperation(index)"
              :disabled="canDisburseMaturity(neuron)"
              type="button"
              @click="onStakeMaturity(index)"
            >
              <span>Stake</span>
            </button>
            <button
              v-show="showOperation(index)"
              :disabled="canSpawnNeuron(neuron)"
              type="button"
              @click="onSpawnNeuron(neuron)"
            >
              <span>Spawn</span>
            </button>
          </div>
          <div
            v-if="
              neuron.staked_maturity_e8s_equivalent &&
              neuron.staked_maturity_e8s_equivalent[0]
            "
            class="staked-maturity-equivalent"
          >
            <span>Of which staked</span>
            <span class="margin-left-auto">
              <span class="neuron-balance">
                {{
                  neuron.staked_maturity_e8s_equivalent[0]
                    | bigintToFloat(2, 8)
                    | formatNum
                }}
              </span>
              <span class="neuron-symbol"> ICP </span>
            </span>
          </div>
          <div
            v-show="showOperation(index)"
            class="auto-stake--maturity-checkbox"
          >
            <a-checkbox
              :checked="neuron.auto_stake_maturity[0]"
              @click="onAutoStakeMaturity(neuron, index)"
            >
              Automatically stake new maturity.
            </a-checkbox>
          </div>
          <div class="neurons-list-balance neurons-list-balance-voting">
            <div class="operation">
              <button
                v-show="showOperation(index)"
                type="button"
                @click="onFollowing(index)"
              >
                <span>Following</span>
              </button>
              <button
                v-show="showOperation(index)"
                type="button"
                @click="onHotkey(index)"
              >
                <span>Hotkeys</span>
              </button>
            </div>
            <div class="margin-left-auto voting-power-title-main">
              <span class="margin-left-auto voting-power-title"
                >Voting Power</span
              >
              <span>
                {{ getVotingPower(neuron) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="neuron-empty base-font-title"
        v-if="getPrincipalId && !spinning && !neuronList.length"
      >
        <p>No neurons available</p>
        <p>
          Earn rewards by staking your ICP in neurons. Neurons allow you to
          participate in governance on the Internet Computer by submitting and
          voting on Network Nervous System (NNS) proposals.
        </p>
      </div>
      <div v-if="!getPrincipalId">
        <div class="wallet-empty container-width">
          <img src="@/assets/img/empty.png" alt="" />
          <p>Connect wallet to view</p>
          <button type="button" class="default" @click="connectWallet">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
    <transfer-icp
      ref="transferIcp"
      title="Increase Neuron Stake"
      transfer-button="Increase Neuron Stake"
      type="Increase"
      :balance="balance"
      @transferSuccess="transferSuccess"
    ></transfer-icp>
    <increase-dissolve-delay
      ref="increaseDissolveDelay"
      :governance-service="governanceService"
      :dissolve-delay-seconds="dissolveDelaySeconds"
      :neuron-id="neuronId"
      @increaseDissolveDelaySuccess="increaseDissolveDelaySuccess"
    ></increase-dissolve-delay>
    <transfer-icp
      ref="stakeNeurons"
      title="Stake Neuron"
      transfer-button="Stake Neuron"
      type="topUpNeuron"
      :balance="balance"
      :memo="stakeMemo"
      @transferSuccess="stakeSuccess"
    ></transfer-icp>
    <disburse
      ref="disburse"
      :governance-service="governanceService"
      :neuron-id="neuronId"
      :balance="maxNeuronIcp"
      @disburseSuccess="disburseSuccess"
    ></disburse>
    <split
      ref="split"
      :governance-service="governanceService"
      :neuron-id="neuronId"
      :balance="maxNeuronIcp"
      @splitSuccess="splitSuccess"
    ></split>
    <following ref="following" @followNeuronSuccess="followNeuronSuccess">
    </following>
    <hot-key ref="hotkey" @addHotkeySuccess="addHotkeySuccess"></hot-key>
    <spawn
      ref="spawn"
      :governance-service="governanceService"
      :neuron-id="neuronId"
      @spawnSuccess="spawnSuccess"
    ></spawn>
    <a-modal
      centered
      v-model="stakeMaturityVisible"
      title="Stake Maturity"
      width="650px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="disburse-modal"
    >
      <div class="maturity-available">
        <span>Maturity available</span>
        <span
          class="margin-left-auto"
          v-if="neuronList.length && neuronIndex !== null"
        >
          {{
            neuronList[neuronIndex].maturity_e8s_equivalent
              | bigintToFloat(2, 8)
              | formatNum
          }}
        </span>
      </div>
      <div class="mt20">
        Choose how much of the maturity available to stake into this neuron.
        <a-slider v-model="stakeMaturityValue" :tip-formatter="formatter" />
        <div class="base-font-title text-center">{{ stakeMaturityValue }}%</div>
      </div>
      <div class="mt20">
        <button
          class="primary w100 large-primary"
          type="button"
          @click="stakeMaturity"
        >
          Submit
        </button>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { NeuronId } from '@/ic/common/icType';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { GovernanceService } from '@/ic/governance/governanceService';
import { namespace } from 'vuex-class';
import {
  ClaimOrRefreshNeuronFromAccount,
  DisburseRequest,
  ListKnownNeuronsResponse,
  NetworkEconomics,
  Neuron
} from '@/ic/governance/model';
import {
  hexToBytes,
  neuronAccountToAccountIdentifier,
  principalToAccountIdentifier
} from '@/ic/converter';
import { createSubAccount } from '@/ic/utils';
import BigNumber from 'bignumber.js';
import TransferIcp from '@/components/transferIcp/Index.vue';
import { BalanceMixin } from '@/mixins';
import IncreaseDissolveDelay from './components/IncreaseDissolveDelay.vue';
import Disburse from './components/Disburse.vue';
import Split from './components/Split.vue';
import Spawn from './components/Spawn.vue';
import { SNSNeuronStatus } from '@/views/home/ICSNS/model';
import Down from '@/views/home/ICSNS/down.vue';
import Following from '@/views/home/neurons/components/Following.vue';
import HotKey from '@/views/home/neurons/components/HotKey.vue';
import { checkAuth } from '@/ic/CheckAuth';
import { connectIcx } from '@/ic/connectIcx';
const commonModule = namespace('common');
@Component({
  name: 'MyNeurons',
  components: {
    TransferIcp,
    IncreaseDissolveDelay,
    Disburse,
    Split,
    Spawn,
    Down,
    Following,
    HotKey
  }
})
export default class extends Mixins(BalanceMixin) {
  $refs!: {
    transferIcp: HTMLFormElement;
    increaseDissolveDelay: HTMLFormElement;
    stakeNeurons: HTMLFormElement;
    disburse: HTMLFormElement;
    split: HTMLFormElement;
    spawn: HTMLFormElement;
    following: HTMLFormElement;
    hotkey: HTMLFormElement;
  };
  @commonModule.Getter('getIdentity') getIdentity?: Identity;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  public spinning = false;
  public neuronList: Neuron[] = [];
  public neuronId: bigint = null;
  public neuronIndex: number = null;
  public dissolveDelaySeconds = 0;
  public neuronAccount: string;
  private isH5 = false;
  public governanceService: GovernanceService = null;
  public stakeMemo = BigInt(0);
  // public principal: string;
  public maxNeuronIcp = 0;
  private networkEconomicsParameters: NetworkEconomics = null;
  private stakeMaturityVisible = false;
  private stakeMaturityValue = 0;
  private listKnownNeurons: ListKnownNeuronsResponse = null;
  async created(): Promise<void> {
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
    this.governanceService = new GovernanceService();
    if (this.getPrincipalId) {
      this.spinning = true;
      this.getListKnownNeurons();
      await this.getNetworkEconomicsParameters();
      this.getNeuronIds();
    }
  }
  private formatter(value): string {
    return `${value}%`;
  }
  private async getListKnownNeurons(): Promise<void> {
    this.listKnownNeurons = await this.governanceService.listKnownNeurons();
    if (this.listKnownNeurons) {
      this.listKnownNeurons.known_neurons.unshift({
        id: [{ id: BigInt(28) }],
        known_neuron_data: [
          {
            name: 'Internet Computer Association',
            description: []
          }
        ]
      });
      this.listKnownNeurons.known_neurons.unshift({
        id: [{ id: BigInt(27) }],
        known_neuron_data: [
          {
            name: 'DFINITY Foundation',
            description: []
          }
        ]
      });
    }
  }
  private getVotingPower(neuron: Neuron): string {
    if (this.networkEconomicsParameters) {
      const dissolveState = neuron.dissolve_state;
      let dissolveDelay = 0;
      const type = Object.keys(dissolveState[0])[0];
      if (dissolveState[0]) {
        if (type === 'DissolveDelaySeconds') {
          const time = Object.values(dissolveState[0])[0] || BigInt(0);
          dissolveDelay = Number(time);
        } else {
          const now = Math.ceil(new Date().getTime() / 1000);
          const time = Object.values(dissolveState[0])[0] || BigInt(0);
          if (Number(time) - now >= 0) {
            dissolveDelay = Number(time) - now;
          } else {
            dissolveDelay = 0;
          }
        }
      }
      // If neuron's dissolve delay is less than 6 months, the voting power is 0.
      // votingPower = (stake + staked maturity) * dissolve_delay_bonus * age_bonus
      //  dissolve_delay_bonus = 1 + (dissolve_delay_multiplier * neuron dissolve delay / 8 years)
      //  age_bonus = 1 + (age_multiplier * ageSeconds / 4 years)
      //
      // dissolve_delay_multiplier is 1 in NNS
      // age_multiplier is 0.25 in NNS
      const DISSOLVE_DELAY_MULTIPLIER = 1;
      const AGE_MULTIPLIER = 0.25;
      const SECONDS_IN_YEAR = ((4 * 365 + 1) * (60 * 60 * 24)) / 4;
      const minDissolveDelaySeconds = SECONDS_IN_YEAR / 2;
      const SECONDS_IN_EIGHT_YEARS = SECONDS_IN_YEAR * 8;
      const SECONDS_IN_FOUR_YEARS = SECONDS_IN_YEAR * 4;
      if (
        dissolveDelay === 0 ||
        new BigNumber(dissolveDelay).lt(minDissolveDelaySeconds)
      ) {
        return '0';
      }
      const dissolveDelayBonus = new BigNumber(dissolveDelay)
        .div(SECONDS_IN_EIGHT_YEARS)
        .times(DISSOLVE_DELAY_MULTIPLIER)
        .plus(1);
      const now = new Date().getTime() / 1000;
      let aging = BigInt(
        parseInt(
          new BigNumber(now)
            .minus(neuron.aging_since_timestamp_seconds.toString(10))
            .toString(10)
        )
      );
      if (dissolveState[0]) {
        const type = Object.keys(dissolveState[0])[0];
        if (type === 'WhenDissolvedTimestampSeconds') {
          aging = BigInt(0);
        }
      }
      const ageBonus = new BigNumber(aging.toString(10))
        .div(SECONDS_IN_FOUR_YEARS)
        .times(AGE_MULTIPLIER)
        .plus(1);
      let balance = this.getVoteBalance(neuron);
      return new BigNumber(balance)
        .times(dissolveDelayBonus)
        .times(ageBonus)
        .decimalPlaces(2, 0)
        .toString(10);
    }
  }
  private getVoteBalance(neuron: Neuron): string {
    const staked_maturity_e8s_equivalent =
      neuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    return new BigNumber(neuron.cached_neuron_stake_e8s.toString(10))
      .plus(staked_maturity_e8s_equivalent.toString(10))
      .div(10 ** 8)
      .toString(10);
  }
  private async getNetworkEconomicsParameters(): Promise<void> {
    this.networkEconomicsParameters =
      await this.governanceService.getNetworkEconomicsParameters();
  }
  private minStakeSplittable(): string {
    const fee = BigInt(10000);
    let currentNeuronMinimumStakeE8s = BigInt(0);
    currentNeuronMinimumStakeE8s =
      this.networkEconomicsParameters.neuron_minimum_stake_e8s;
    return new BigNumber(currentNeuronMinimumStakeE8s.toString(10))
      .times(2)
      .plus(fee.toString(10))
      .div(10 ** 8)
      .toString(10);
  }
  private async onSpawnNeuron(neuron: Neuron): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      await this.governanceService.spawn(neuron.id[0].id);
      await this.getNeuronIds();
      this.$message.success('Spawn Success');
    } catch (e) {
      if (e && e.error_message) {
        this.$message.error(e.error_message);
      }
    }
    loading.close();
  }
  private canSpawnNeuron(neuron: Neuron): boolean {
    const maturity_e8s_equivalent = neuron.maturity_e8s_equivalent;
    // 1/95
    return (
      new BigNumber(maturity_e8s_equivalent.toString(10)).lt(105263158) ||
      !!neuron.spawn_at_timestamp_seconds.length
    );
  }
  private canDisburseMaturity(neuron: Neuron): boolean {
    const maturity_e8s_equivalent = neuron.maturity_e8s_equivalent;
    return new BigNumber(maturity_e8s_equivalent.toString(10)).lt(10000);
  }
  private canSplit(index: number): boolean {
    const minStakeSplittable = this.minStakeSplittable();
    const balance = this.getNeuronBalance(this.neuronList[index]);
    return new BigNumber(balance).gte(minStakeSplittable);
  }
  private showOperation(index: number): boolean {
    let flag = false;
    if (
      this.neuronList[index].controller &&
      this.neuronList[index].controller[0].toString() === this.getPrincipalId
    ) {
      flag = true;
    }
    return flag;
  }
  private getNeuronBalance(neuron: Neuron): string {
    return new BigNumber(neuron.cached_neuron_stake_e8s.toString(10))
      .minus(neuron.neuron_fees_e8s.toString(10))
      .div(10 ** 8)
      .toString(10);
  }
  private getNeuronStatus(neuron: Neuron): keyof typeof SNSNeuronStatus {
    const dissolveState = neuron.dissolve_state;
    if (dissolveState[0]) {
      const type = Object.keys(dissolveState[0])[0];
      if (type === 'DissolveDelaySeconds') {
        const time = Object.values(dissolveState[0])[0];
        if (new BigNumber(time.toString(10)).gt(0)) {
          return SNSNeuronStatus.Locked;
        } else {
          return SNSNeuronStatus.Dissolved;
        }
      } else {
        const now = new Date().getTime();
        const time = Number(Object.values(dissolveState[0])[0]);
        if (new BigNumber(time.toString(10)).times(1000).gt(now)) {
          return SNSNeuronStatus.Dissolving;
        } else {
          return SNSNeuronStatus.Dissolved;
        }
      }
    } else {
      return SNSNeuronStatus.Unspecified;
    }
  }
  private getNeuronMaturityBalance(neuron: Neuron): string {
    const maturity_e8s_equivalent = neuron.maturity_e8s_equivalent;
    return new BigNumber(maturity_e8s_equivalent.toString(10))
      .div(10 ** 8)
      .decimalPlaces(2, 1)
      .toString(10);
  }
  private finish(index: number): void {
    setTimeout(async () => {
      const neuronInfo = await this.getFullNeuron(
        this.neuronList[index].id[0].id
      );
      this.$set(this.neuronList, index, neuronInfo);
    }, 1000);
  }
  public onIncreaseDissolveDelay(neuron: Neuron, index: number): void {
    this.neuronId = neuron.id[0].id;
    this.neuronIndex = index;
    this.dissolveDelaySeconds = Number(neuron.dissolve_state[0]);
    this.$refs.increaseDissolveDelay.visible = true;
    this.$refs.increaseDissolveDelay.init(this.neuronList, this.neuronIndex);
  }
  public onTopUpNeuron(neuron: Neuron, index: number): void {
    if (this.showOperation(index)) {
      this.toTopUpNeuron(neuron, index);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      this.$confirm({
        content:
          'WARNING: This neuron sets your account as a hotkey, but is not necessarily your neuron. You need to verify that this is the neuron you control or you may lose funds.',
        class: 'connect-plug register-mining-confirm',
        icon: 'connect-plug',
        okText: 'Confirm',
        cancelText: "Cancel / I'm not sure",
        centered: true,
        onOk() {
          _that.toTopUpNeuron(neuron, index);
        }
      });
    }
  }
  private toTopUpNeuron(neuron: Neuron, index: number): void {
    this.neuronAccount = neuronAccountToAccountIdentifier(neuron.account);
    this.neuronId = neuron.id[0].id;
    this.neuronIndex = index;
    this.getBalance();
    this.$refs.transferIcp.transferForm.to = this.neuronAccount;
    this.$refs.transferIcp.visibleTransfer = true;
  }
  public onStakeNeuron(): void {
    const principal = localStorage.getItem('principal');
    const response = createSubAccount(Principal.fromText(principal));
    this.neuronAccount = response.accountIdentifier;
    this.stakeMemo = response.nonce;
    this.getBalance();
    this.$refs.stakeNeurons.transferForm.to = this.neuronAccount;
    this.$refs.stakeNeurons.visibleTransfer = true;
  }
  public increaseDissolveDelaySuccess(): void {
    this.refreshNeuron(this.neuronId);
  }
  public disburseSuccess(): void {
    this.refreshNeuron(this.neuronId);
    this.getBalance();
  }
  private async followNeuronSuccess(id: bigint): Promise<void> {
    await this.refreshNeuron(id);
    this.onFollowing(this.neuronIndex);
  }
  private async addHotkeySuccess(id: bigint): Promise<void> {
    await this.refreshNeuron(id);
    this.onHotkey(this.neuronIndex);
  }
  public async splitSuccess(id: NeuronId): Promise<void> {
    this.refreshNeuron(this.neuronId);
    const neuronInfo = await this.getFullNeuron(id);
    this.neuronList.push(neuronInfo);
  }
  public spawnSuccess(id: NeuronId): void {
  }
  public async transferSuccess(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await this.governanceService.refreshNeuronById(this.neuronId);
    this.refreshNeuron(this.neuronId);
    this.getBalance();
    loading.close();
  }
  public async stakeSuccess(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const principal = localStorage.getItem('principal');
      const refreshNeuronFromAccountRequest: ClaimOrRefreshNeuronFromAccount = {
        controller: [Principal.fromText(principal)],
        memo: this.stakeMemo
      };
      const id = await this.governanceService.refreshNeuronFromAccount(
        refreshNeuronFromAccountRequest
      );
      const neuronInfo = await this.getFullNeuron(id);
      this.neuronList.unshift(neuronInfo);
      this.onIncreaseDissolveDelay(this.neuronList[0], 0);
      this.getBalance();
    } catch (e) {
    }
    loading.close();
  }
  public onSpawn(neuron: Neuron, index: number): void {
    this.neuronId = neuron.id[0].id;
    this.neuronIndex = index;
    this.$refs.spawn.visible = true;
  }
  public onSplit(neuron: Neuron, index: number): void {
    this.neuronId = neuron.id[0].id;
    this.neuronIndex = index;
    this.maxNeuronIcp = Number(
      new BigNumber(neuron.cached_neuron_stake_e8s.toString()).div(
        10 ** this.decimals
      )
    );
    this.$refs.split.visible = true;
  }
  public async onDisburse(neuron: Neuron, index: number): Promise<void> {
    this.neuronId = neuron.id[0].id;
    this.neuronIndex = index;
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const principal = localStorage.getItem('principal');
      const toAccount = hexToBytes(
        principalToAccountIdentifier(Principal.fromText(principal))
      );
      const disburseRequest: DisburseRequest = {
        neuronId: this.neuronId,
        toAccount: toAccount,
        amount: []
      };
      await this.governanceService.disburse(disburseRequest);
      await this.getNeuronIds();
      this.getBalance();
      this.$message.success('Disburse Success');
    } catch (e) {
    }
    loading.close();
  }
  public async onStopDissolving(neuron: Neuron, index: number): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    this.neuronId = neuron.id[0].id;
    this.neuronIndex = index;
    try {
      await this.governanceService.stopDissolving(neuron.id[0].id);
      this.refreshNeuron(this.neuronId);
    } catch (e) {
    }
    loading.close();
  }
  public async onStartDissolving(neuron: Neuron, index: number): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    this.neuronId = neuron.id[0].id;
    this.neuronIndex = index;
    try {
      await this.governanceService.startDissolving(neuron.id[0].id);
      this.refreshNeuron(this.neuronId);
    } catch (e) {
    }
    loading.close();
  }
  public async refreshNeuron(neuronId: NeuronId): Promise<void> {
    try {
      const neuronInfo = await this.getFullNeuron(neuronId);
      this.$set(this.neuronList, this.neuronIndex, neuronInfo);
    } catch (e) {
      this.$message.error(e.error_message);
    }
  }
  public async getNeuronIds(): Promise<void> {
    const neuronIdList = await this.governanceService.getNeuronIds();
    const res = await this.governanceService.listNeurons({
      include_public_neurons_in_full_neurons: [false],
      include_empty_neurons_readable_by_caller: [false],
      neuron_ids: neuronIdList,
      include_neurons_readable_by_caller: false
    });
    if (res && res.full_neurons) {
      this.neuronList = res.full_neurons
        .filter((neuron) => {
          const staked_maturity_e8s_equivalent =
            neuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
          const maturity_e8s_equivalent =
            neuron.maturity_e8s_equivalent || BigInt(0);
          const balance = new BigNumber(
            neuron.cached_neuron_stake_e8s.toString(10)
          )
            .plus(staked_maturity_e8s_equivalent.toString(10))
            .plus(maturity_e8s_equivalent.toString(10));
          return !(
            balance.lte(0) &&
            new BigNumber(neuron.neuron_fees_e8s.toString(10)).lte(0)
          );
        })
        .sort((a, b) => {
          return new BigNumber(b.created_timestamp_seconds.toString(10))
            .minus(a.created_timestamp_seconds.toString(10))
            .toNumber();
        });
    }
    this.spinning = false;
  }
  public async getFullNeuron(neuronId: NeuronId): Promise<Neuron> {
    const fullInfo = await this.governanceService.getFullNeuron(neuronId);
    return (fullInfo as { Ok: Neuron }).Ok;
  }
  private onStakeMaturity(index: number): void {
    this.neuronIndex = index;
    this.stakeMaturityVisible = true;
    this.stakeMaturityValue = 0;
  }
  private async stakeMaturity(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    const neuronId = this.neuronList[this.neuronIndex].id[0].id;
    try {
      await this.governanceService.stakeMaturity(
        neuronId,
        BigInt(this.stakeMaturityValue)
      );
      await this.refreshNeuron(neuronId);
      this.$message.success('Stake Maturity Success');
      this.stakeMaturityVisible = false;
    } catch (e) {
      if (e && e.error_message) {
        this.$message.error(e.error_message);
      }
    }
    loading.close();
  }
  private async onAutoStakeMaturity(
    neuron: Neuron,
    index: number
  ): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    this.neuronIndex = index;
    const neuronId = neuron.id[0].id;
    const auto_stake_maturity = neuron.auto_stake_maturity[0] || false;
    try {
      const res = await this.governanceService.changeAutoStakeMaturity(
        neuronId,
        !auto_stake_maturity
      );
      await this.refreshNeuron(neuronId);
      if (res && res.command && res.command[0]) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          this.$message.error('Error');
        } else {
          this.$message.success('Success');
        }
      } else {
        this.$message.error('Error');
      }
    } catch (e) {
    }
    loading.close();
  }
  private async onFollowing(index: number): Promise<void> {
    this.neuronIndex = index;
    this.$refs.following.init(this.neuronList, index, this.listKnownNeurons);
  }
  private async onHotkey(index: number): Promise<void> {
    this.neuronIndex = index;
    this.$refs.hotkey.init(this.neuronList[index], index);
  }
  private async connectWallet(): Promise<void> {
    if ((window as any).icx) {
      const icxCanisterIds: Array<string> =
        JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
      const isConnect = await connectIcx(icxCanisterIds);
      if (isConnect) {
        this.spinning = true;
        this.getListKnownNeurons();
        await this.getNetworkEconomicsParameters();
        this.getNeuronIds();
      }
    } else {
      await this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    }
  }
}
</script>
<style scoped lang="scss">
.voting-power-title-main {
  margin-right: 5px;
}
.staked-maturity-equivalent {
  display: flex;
  margin-top: 5px;
}
.change-auto-stake-maturity-button {
  display: flex;
  margin-top: 30px;
  justify-content: flex-end;
  button {
    margin-left: 10px;
  }
}
.neurons-list-main {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
  &.neurons-list-main-id {
    margin-top: 50px;
  }
  .neurons-status-info {
    display: flex;
    align-items: center;
  }
  .base-font-title {
    font-size: 16px;
  }
}
.neurons-list-header {
  display: flex;
  align-items: center;
  span {
    font-size: 20px;
    color: #fff;
  }
  .neurons-list-header-option {
    width: 200px;
    span {
      font-size: 14px;
    }
    ::v-deep .ant-select-selection__rendered {
      line-height: 36px;
    }
  }
}
.neurons-list-balance-dissolve-time {
  margin-left: 5px;
}
.no-neuron {
  height: 200px;
  line-height: 20px;
  color: #adb3c4;
  text-align: center;
}
.transfer-balance {
  margin-top: 20px;
}
.transfer-submit {
  margin: 20px 0;
}
.transfer-balance-right {
  color: #1996c4;
}
.auto-stake--maturity-checkbox {
  margin-top: 10px;
  ::v-deep .ant-checkbox-wrapper {
    color: #8c98a5;
  }
}
.neurons-list-item {
  position: relative;
  width: 490px;
  min-height: 200px;
  padding: 16px 16px 62px 16px;
  margin-bottom: 15px;
  background: #131920;
  color: #8c98a5;
  border: 1px solid #212b35;
  border-radius: 10px;
}
.neurons-list-item-skeleton {
  height: 180px;
}
.neurons-list-balance-border {
  margin-top: 20px;
  border-top: 1px solid #212b35;
}
.neurons-list-balance {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  padding-top: 20px;
  .neuron-balance {
    font-size: 28px;
    color: #fff;
    padding-right: 5px;
  }
  .neuron-symbol {
    color: #adb8c4;
  }
  .operation {
    margin-top: 0;
  }
  .base-font-title {
    margin-right: 10px;
  }
}
.neurons-list-balance-voting {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  .operation {
    margin-top: 10px;
  }
}
.operation {
  display: flex;
  margin-top: 20px;
  button {
    width: 85px;
    margin-right: 10px;
    &:disabled {
      opacity: 0.4;
    }
  }
}
.text-center {
  text-align: center;
}
.maturity-available {
  display: flex;
}
.h5-show {
  display: none !important;
}
.pc-show {
  display: flex !important;
}
i.pc-show {
  display: inline-block !important;
}
.neurons-status-info-id {
  margin-top: 10px;
}
.neurons-list-main-back {
  display: flex;
  align-items: center;
  margin-top: 40px;
  font-size: 16px;
  .back-icon {
    font-size: 20px;
  }
}
.neuron-empty {
  margin-top: 40px;
  line-height: 20px;
}
@media screen and (max-width: 1000px) {
  .neurons-main {
    width: 100%;
    padding: 0 10px;
  }
}
@media screen and (max-width: 768px) {
  .h5-show {
    display: flex !important;
  }
  .pc-show {
    display: none !important;
  }
  i.pc-show {
    display: none !important;
  }
  .neurons-list-item {
    padding: 16px;
  }
  .neurons-list-balance-voting {
    position: static;
    flex-direction: column;
    padding-top: 10px;
  }
  .voting-power-title-main {
    margin-left: 0;
    margin-top: 15px;
  }
  .auto-stake--maturity-checkbox {
    ::v-deep .ant-checkbox-wrapper {
      font-size: 12px;
    }
  }
  .neurons-list-header {
    flex-wrap: wrap;
    padding: 0 10px;
    button {
      width: 200px;
    }
  }
  .neurons-list-main {
    padding: 0 10px;
    .neurons-list-item {
      width: 100%;
    }
    .neurons-list-header {
      flex-direction: row;
      align-items: center;
      padding: 0;
      margin-bottom: 5px;
    }
    .operation {
      button {
        width: auto;
      }
    }
    .neurons-status-info {
      flex-direction: column;
      align-items: flex-start;
      > div {
        margin-left: 0;
        margin-top: 5px;
      }
    }
  }
}
@media screen and (max-width: 460px) {
  .neurons-list-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 10px;
    .neurons-list-header-option {
      width: 100%;
    }
    button {
      width: 100%;
      margin: 10px 0 0 0;
    }
  }
}
</style>
