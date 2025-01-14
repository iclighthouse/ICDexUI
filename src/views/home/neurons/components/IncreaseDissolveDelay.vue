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
          :front="neuron.id[0].id.length"
          :account="neuron.id[0].id.toString(10)"
          copy-text="Neuron ID"
        ></copy-account>
      </div>
      <div class="dissolve-delay-item">
        <span>Balance</span>
        <span>{{ balance }} ICP Stake</span>
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
            Number(dissolveDelayInput) > max_dissolve_delay_seconds
          "
          class="base-red"
          >Max Dissolve Delay is {{ max_dissolve_delay_seconds }}</span
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
          :max="max_dissolve_delay_seconds"
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
              dissolveDelay <= max_dissolve_delay_seconds
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
import BigNumber from 'bignumber.js';
import { checkAuth } from '@/ic/CheckAuth';
import { Neuron } from '@/ic/governance/model';
import { GovernanceService } from '@/ic/governance/governanceService';
const dayjs = require('dayjs');
const year = 365.25;
const SECONDS_IN_YEAR = ((4 * 365 + 1) * (60 * 60 * 24)) / 4;
const SECONDS_IN_EIGHT_YEARS = SECONDS_IN_YEAR * 8;
@Component({
  name: 'IncreaseDissolveDelay',
  components: {}
})
export default class extends Vue {
  private neuron: Neuron = null;
  private balance = '';
  private visible = false;
  private defaultValue = 0;
  private dissolveDelay = 0;
  private dissolveDelayInput = '';
  private max_dissolve_delay_seconds = SECONDS_IN_EIGHT_YEARS;
  private index = 0;
  private minLocked = '';
  private defaultDelay = null;
  public governanceService: GovernanceService = null;
  get votingPower(): string {
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
      this.dissolveDelay === 0 ||
      new BigNumber(this.dissolveDelay).lt(minDissolveDelaySeconds)
    ) {
      return '0';
    }
    const dissolveDelayBonus = new BigNumber(this.dissolveDelay)
      .div(SECONDS_IN_EIGHT_YEARS)
      .times(DISSOLVE_DELAY_MULTIPLIER)
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
      .div(SECONDS_IN_FOUR_YEARS)
      .times(AGE_MULTIPLIER)
      .plus(1);
    return new BigNumber(this.balance)
      .times(dissolveDelayBonus)
      .times(ageBonus)
      .decimalPlaces(2, 0)
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
    this.governanceService = new GovernanceService();
    this.defaultDelay = [
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
        value: Math.ceil(new BigNumber(year).times(3).times(86400).toNumber()),
        name: '3years'
      },
      {
        value: Math.ceil(new BigNumber(year).times(5).times(86400).toNumber()),
        name: '5years'
      },
      {
        value: Math.ceil(new BigNumber(year).times(7).times(86400).toNumber()),
        name: '7years'
      },
      {
        value: Math.ceil(new BigNumber(year).times(8).times(86400).toNumber()),
        name: '8years'
      }
    ];
    const width = document.documentElement.clientWidth;
    if (width < 768) {
      this.defaultDelay = [
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
          value: Math.ceil(
            new BigNumber(year).times(4).times(86400).toNumber()
          ),
          name: '4years'
        },
        {
          value: Math.ceil(
            new BigNumber(year).times(8).times(86400).toNumber()
          ),
          name: '8years'
        }
      ];
    }
  }
  private init(neuronsList: Array<Neuron>, index: number): void {
    this.index = index;
    const neuron = neuronsList[index];
    this.visible = true;
    this.neuron = neuron;
    const staked_maturity_e8s_equivalent =
      neuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    this.balance = new BigNumber(neuron.cached_neuron_stake_e8s.toString(10))
      .plus(staked_maturity_e8s_equivalent.toString(10))
      .div(10 ** 8)
      .toString(10);
    this.defaultDelay = this.defaultDelay.filter((val) => {
      return new BigNumber(val.value).lte(SECONDS_IN_EIGHT_YEARS);
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
    this.minLocked = '6 months';
  }
  private dissolveDelayInputChange(): void {
    const SECONDS_IN_EIGHT_YEARS = SECONDS_IN_YEAR * 8;
    if (this.dissolveDelayInput) {
      if (
        new BigNumber(this.dissolveDelayInput).lte(SECONDS_IN_EIGHT_YEARS) &&
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
      const dissolveDelay = new BigNumber(this.dissolveDelay)
        .minus(this.defaultValue)
        .toString(10);
      await this.governanceService.increaseDissolveDelay({
        neuronId: this.neuron.id[0].id,
        additionalDissolveDelaySeconds: BigInt(dissolveDelay)
      });
      loading.close();
      this.visible = false;
      this.$message.success('Increase Dissolve Delay Success');
      this.$emit('increaseDissolveDelaySuccess');
    } catch (e) {
    }
    loading.close();
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
