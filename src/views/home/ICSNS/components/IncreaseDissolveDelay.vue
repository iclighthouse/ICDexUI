<template>
  <a-modal
    v-model="visible"
    centered
    title="Set Dissolve Delay"
    width="650px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    :after-close="afterClose"
  >
    <div v-if="neuron" class="dissolve-delay">
      <div class="dissolve-delay-item">
        <span>Neuron ID</span>
        <copy-account
          :front="arrayToString(neuron.id[0].id).length"
          :account="arrayToString(neuron.id[0].id)"
          copy-text="Neuron ID"
        ></copy-account>
      </div>
      <div class="dissolve-delay-item">
        <span>Balance</span>
        <span
          >{{ balance }}
          {{ SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol }} Stake</span
        >
      </div>
      <div class="dissolve-delay-item">
        <span>Dissolve Delay</span>
        <span>
          Voting power is given when neurons are locked for at least
          {{ minLocked }}
        </span>
      </div>
      <div>
        <span class="base-font-title dissolve-delay-item-title"
          >Dissolve Delay (in seconds)</span
        >
        <a-input
          @change="dissolveDelayInputChange"
          v-model="dissolveDelayInput"
          autocomplete="off"
          type="text"
          placeholder="0"
          v-only-number
        />
        <span
          v-show="
            dissolveDelayInput && Number(dissolveDelayInput) < defaultValue
          "
          class="base-red"
          >Min Dissolve Delay is {{ defaultValue + 1 }}</span
        >
        <span
          v-show="
            dissolveDelayInput &&
            Number(dissolveDelayInput) >
              Number(
                SNSNeurons.nervousSystemParameters.max_dissolve_delay_seconds[0]
              )
          "
          class="base-red"
          >Max Dissolve Delay is
          {{
            Number(
              SNSNeurons.nervousSystemParameters.max_dissolve_delay_seconds[0]
            )
          }}</span
        >
      </div>
      <div class="time-Label">
        <div
          v-for="(item, index) in defaultDelay"
          :key="index"
          @click="setDelay(item.value)"
        >
          <button>{{ item.name }}</button>
        </div>
      </div>
      <div>
        <a-slider
          v-model="dissolveDelay"
          :default-value="defaultValue"
          @change="dissolveDelayChange"
          :min="0"
          :max="
            Number(
              SNSNeurons.nervousSystemParameters.max_dissolve_delay_seconds[0]
            )
          "
          :tooltip-visible="false"
        />
        <div class="dissolve-delay-info">
          <dl>
            <dt>{{ votingPower }}</dt>
            <dd>Voting Power</dd>
          </dl>
          <dl>
            <dt>{{ dissolveTime }}</dt>
            <dd>Dissolve Delay</dd>
          </dl>
        </div>
      </div>
      <div class="update-button">
        <button
          :disabled="
            !(
              dissolveDelay > defaultValue &&
              dissolveDelay <=
                Number(
                  SNSNeurons.nervousSystemParameters
                    .max_dissolve_delay_seconds[0]
                )
            )
          "
          type="button"
          class="primary w100"
          @click="updateDelay"
        >
          Update Delay
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SNSNeuronsInfo } from '@/views/home/ICSNS/model';
import { GovernanceError, SNSNeuron } from '@/ic/SNSGovernance/model';
import BigNumber from 'bignumber.js';
import { toHexString } from '@/ic/converter';
import { checkAuth } from '@/ic/CheckAuth';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';

const dayjs = require('dayjs');

const year = 365.25;

@Component({
  name: 'IncreaseDissolveDelay',
  components: {}
})
export default class extends Vue {
  private SNSNeurons: SNSNeuronsInfo = null;
  private neuron: SNSNeuron = null;
  private balance = '';
  private visible = false;
  private defaultValue = 0;
  private dissolveDelay = 0;
  private dissolveDelayInput = '';
  private SNSIndex = 0;
  private index = 0;
  private minLocked = '';
  private defaultDelay = null;
  get votingPower(): string {
    if (
      this.dissolveDelay === 0 ||
      new BigNumber(this.dissolveDelay).lt(
        this.SNSNeurons.nervousSystemParameters.neuron_minimum_dissolve_delay_to_vote_seconds[0].toString(
          10
        )
      )
    ) {
      return '0';
    }
    const dissolveDelayBonus = new BigNumber(this.dissolveDelay)
      .div(
        this.SNSNeurons.nervousSystemParameters.max_dissolve_delay_seconds[0].toString(
          10
        )
      )
      .times(
        this.SNSNeurons.nervousSystemParameters.max_dissolve_delay_bonus_percentage[0].toString(
          10
        )
      )
      .div(100)
      .plus(1);
    const now = Math.ceil(new Date().getTime() / 1000);
    let aging = BigInt(
      parseInt(
        new BigNumber(now)
          .minus(this.neuron.aging_since_timestamp_seconds.toString(10))
          .toString(10)
      )
    );
    const dissolveState = this.neuron.dissolve_state;
    if (dissolveState[0]) {
      const type = Object.keys(dissolveState[0])[0];
      if (type === 'WhenDissolvedTimestampSeconds') {
        aging = BigInt(0);
      }
    }
    const ageBonus = new BigNumber(aging.toString(10))
      .div(
        this.SNSNeurons.nervousSystemParameters.max_neuron_age_for_age_bonus[0].toString(
          10
        )
      )
      .times(
        this.SNSNeurons.nervousSystemParameters.max_age_bonus_percentage[0].toString(
          10
        )
      )
      .div(100)
      .plus(1);
    return new BigNumber(this.balance)
      .times(dissolveDelayBonus)
      .times(ageBonus)
      .decimalPlaces(2, 1)
      .toString(10);
  }
  get dissolveTime(): string {
    if (this.dissolveDelay === 0) {
      return '0';
    }
    const y = Math.floor(
      new BigNumber(this.dissolveDelay).div(year).div(86400).toNumber()
    );
    const d = Math.floor(
      new BigNumber(this.dissolveDelay)
        .minus(year * y * 86400)
        .div(86400)
        .toNumber()
    );
    const h = Math.floor(
      new BigNumber(this.dissolveDelay)
        .minus(year * y * 86400)
        .minus(d * 86400)
        .div(3600)
        .toNumber()
    );
    const m = Math.floor(
      new BigNumber(this.dissolveDelay)
        .minus(year * y * 86400)
        .minus(d * 86400)
        .minus(h * 3600)
        .div(60)
        .toNumber()
    );
    const s = Math.floor(
      new BigNumber(this.dissolveDelay)
        .minus(year * y * 86400)
        .minus(d * 86400)
        .minus(h * 3600)
        .minus(m * 60)
        .toNumber()
    );
    // const now = new Date();
    // let to = dayjs().add(this.dissolveDelay, 'second');
    // const y = to.diff(now, 'y');
    // if (y > 0) {
    //   to = to.subtract(y, 'y');
    // }
    // const d = to.diff(now, 'd');
    // if (d > 0) {
    //   to = to.subtract(d, 'd');
    // }
    // const h = to.diff(now, 'h');
    // if (h > 0) {
    //   to = to.subtract(h, 'h');
    // }
    // const m = to.diff(now, 'm');
    // if (m > 0) {
    //   to = to.subtract(m, 'm');
    // }
    // const s = to.diff(now, 's');
    if (y > 0) {
      if (d > 0) {
        return `${y}year${this.isPlural(y)} ${d}day${this.isPlural(d)}`;
      }
      return `${y}year${this.isPlural(y)}`;
    }
    if (d > 0) {
      if (h > 0) {
        return `${d + 1}day${this.isPlural(d + 1)}`;
      }
      return `${d}day${this.isPlural(d)}`;
    }
    if (h > 0) {
      if (m > 0) {
        return `${h}hour${this.isPlural(h)} ${m}minute${this.isPlural(m)}`;
      }
      return `${h}hour${this.isPlural(h)}`;
    }
    if (m > 0) {
      if (s > 0) {
        return `${m}minute${this.isPlural(m)} ${s}second${this.isPlural(s)}`;
      }
      return `${m}minute${this.isPlural(m)}`;
    }
    return `${s}second${this.isPlural(s)}`;
  }
  private isPlural(value: number): string {
    if (value > 1) {
      return 's';
    }
    return '';
  }
  created(): void {
    this.defaultDelay = [
      {
        value: Math.ceil(new BigNumber(year).div(12).times(86400).toNumber()),
        name: '1month'
      },
      {
        value: Math.ceil(
          new BigNumber(year).div(12).times(2).times(86400).toNumber()
        ),
        name: '2months'
      },
      {
        value: Math.ceil(
          new BigNumber(year).div(12).times(3).times(86400).toNumber()
        ),
        name: '3months'
      },
      {
        value: Math.ceil(
          new BigNumber(year).div(12).times(6).times(86400).toNumber()
        ),
        name: '6months'
      },
      {
        value: Math.ceil(new BigNumber(year).times(86400).toNumber()),
        name: '1year'
      },
      {
        value: Math.ceil(new BigNumber(year).times(2).times(86400).toNumber()),
        name: '2years'
      },
      {
        value: Math.ceil(new BigNumber(year).times(3).times(86400).toNumber()),
        name: '3years'
      }
    ];
    const width = document.documentElement.clientWidth;
    if (width < 768) {
      this.defaultDelay = [
        {
          value: Math.ceil(new BigNumber(year).div(12).times(86400).toNumber()),
          name: '1month'
        },
        {
          value: Math.ceil(
            new BigNumber(year).div(12).times(3).times(86400).toNumber()
          ),
          name: '3months'
        },
        {
          value: Math.ceil(
            new BigNumber(year).div(12).times(6).times(86400).toNumber()
          ),
          name: '6months'
        },
        {
          value: Math.ceil(new BigNumber(year).times(86400).toNumber()),
          name: '1year'
        }
      ];
    }
  }
  private init(
    SNSNeuronsList: Array<SNSNeuronsInfo>,
    SNSIndex: number,
    index: number
  ): void {
    this.SNSIndex = SNSIndex;
    this.index = index;
    const SNSNeurons = SNSNeuronsList[SNSIndex];
    const neuron = SNSNeurons.SNSNeurons[index];
    console.log(neuron.dissolve_state[0]);
    this.visible = true;
    this.SNSNeurons = SNSNeurons;
    this.neuron = neuron;
    console.log(this.SNSNeurons);
    const staked_maturity_e8s_equivalent =
      neuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    this.balance = new BigNumber(neuron.cached_neuron_stake_e8s.toString(10))
      .plus(staked_maturity_e8s_equivalent.toString(10))
      .div(10 ** SNSNeurons.SNSNeuronOfSNSTokenInfo.decimals)
      .toString(10);
    this.defaultDelay = this.defaultDelay.filter((val) => {
      return new BigNumber(val.value).lte(
        this.SNSNeurons.nervousSystemParameters.max_dissolve_delay_seconds[0].toString(
          10
        )
      );
    });
    this.getDefaultValue();
    this.getMinLocked();
  }
  private getDefaultValue(): void {
    const dissolveState = this.neuron.dissolve_state;
    if (dissolveState[0]) {
      const type = Object.keys(dissolveState[0])[0];
      if (type === 'DissolveDelaySeconds') {
        const time = Object.values(dissolveState[0])[0] || BigInt(0);
        this.dissolveDelay = this.defaultValue = Number(time);
      } else {
        const now = Math.ceil(new Date().getTime() / 1000);
        const time = Object.values(dissolveState[0])[0] || BigInt(0);
        if (Number(time) - now >= 0) {
          this.dissolveDelay = this.defaultValue = Number(time) - now;
        } else {
          this.dissolveDelay = this.defaultValue = 0;
        }
      }
    }
  }
  private getMinLocked(): void {
    const minLocked = Number(
      this.SNSNeurons.nervousSystemParameters
        .neuron_minimum_dissolve_delay_to_vote_seconds[0]
    );
    if (minLocked === 0) {
      this.minLocked = '0 day';
    }
    const now = new Date();
    let to = dayjs().add(minLocked, 'second');
    let d = to.diff(now, 'd');
    if (d > 0) {
      to = to.subtract(d, 'd');
    }
    const h = to.diff(now, 'h');
    if (h > 0) {
      d++;
    }
    this.minLocked = `${d} day${this.isPlural(d)}`;
  }
  private dissolveDelayInputChange(): void {
    if (this.dissolveDelayInput) {
      if (
        new BigNumber(this.dissolveDelayInput).lte(
          this.SNSNeurons.nervousSystemParameters.max_dissolve_delay_seconds[0].toString(
            10
          )
        ) &&
        new BigNumber(this.dissolveDelayInput).gte(this.defaultValue)
      ) {
        this.dissolveDelay = parseInt(this.dissolveDelayInput);
      } else {
        this.dissolveDelay = this.defaultValue;
      }
    }
  }
  private setDelay(val: number): void {
    this.dissolveDelayInput = val.toString(10);
    this.dissolveDelayInputChange();
  }
  private dissolveDelayChange(): void {
    this.dissolveDelayInput = this.dissolveDelay.toString(10);
  }
  private async updateDelay(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const dissolveDelay = new BigNumber(this.dissolveDelay)
        .minus(this.defaultValue)
        .toString(10);
      const res = await snsGovernanceService.setDissolveDelay(
        this.SNSNeurons.SNSNeuronOfGovernanceId,
        BigInt(dissolveDelay),
        this.neuron.id[0].id
      );
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          console.log(err);
          this.$message.error(err.error_message);
        } else {
          this.$message.success('Set Dissolve Delay Success');
          this.visible = false;
          this.$emit('SetDissolveDelaySuccess', this.SNSIndex, this.index);
        }
      }
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private afterClose(): void {
    this.dissolveDelayInput = '';
  }
}
</script>

<style scoped lang="scss">
.dissolve-delay-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  span {
    &:first-child {
      margin-bottom: 10px;
      color: #adb8c4;
    }
  }
}
::v-deep .ant-slider-handle {
  width: 18px;
  height: 18px;
  margin-top: -7px;
}
.dissolve-delay-info {
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  dl {
    line-height: 20px;
  }
}
.update-button {
  margin-top: 40px;
  padding-bottom: 20px;
  button {
    height: 40px;
  }
}
.dissolve-delay-item-title {
  display: inline-block;
  margin-bottom: 5px;
}
.time-Label {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 20px;
  div {
    cursor: pointer;
  }
  button {
    width: auto;
    background: #1a2a33;
    color: #52b7c3;
  }
}
@media screen and (max-width: 768px) {
  .copy-account-main {
    word-break: break-all;
  }
  .dissolve-delay-info {
    padding: 0;
  }
}
</style>
