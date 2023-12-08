<template>
  <div>
    {{ countdown }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
const dayjs = require('dayjs');

@Component({
  name: 'disburseMaturityInProgress',
  components: {}
})
export default class extends Vue {
  @Prop({ type: BigInt, default: BigInt(0) })
  public disburseMaturityInProgress!: bigint;
  private countdown = '';
  private timer = null;
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
    console.log(this.timer);
  }
  mounted(): void {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.setTime();
    this.timer = window.setInterval(() => {
      this.setTime();
    }, 1000);
  }
  private setTime(): void {
    const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 3600;
    const now = new Date();
    const down = new BigNumber(this.disburseMaturityInProgress.toString(10))
      .plus(SEVEN_DAYS_IN_SECONDS)
      .toNumber();
    let to = dayjs.unix(down);
    let d = to.diff(now, 'd');
    if (d > 0) {
      to = to.subtract(d, 'd');
    } else {
      d = 0;
    }
    let h = to.diff(now, 'h');
    if (h > 0) {
      to = to.subtract(h, 'h');
    } else {
      h = 0;
    }
    let m = to.diff(now, 'm');
    if (m > 0) {
      to = to.subtract(m, 'm');
    } else {
      m = 0;
    }
    let s = to.diff(now, 's');
    if (s < 0) {
      s = 0;
    }
    this.countdown = `${d}d ${h}h ${m}m ${s}s`;
  }
}
</script>

<style scoped lang="scss"></style>
