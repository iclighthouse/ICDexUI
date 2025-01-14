<template>
  <span>{{ dissolveTime }}</span>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SNSNeuron } from '@/ic/SNSGovernance/model';
const dayjs = require('dayjs');
@Component({
  name: 'down',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Object, default: () => null })
  public neuron!: SNSNeuron;
  @Prop({ type: Number, default: null })
  public index!: number;
  private dissolveTime = '';
  private timer = null;
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
  }
  mounted(): void {
    this.setDissolveTime();
    this.timer = window.setInterval(() => {
      this.setDissolveTime();
    }, 1000);
  }
  private setDissolveTime(): void {
    if (this.neuron) {
      const dissolveState = this.neuron.dissolve_state;
      let dissolveTime = '';
      const currentDissolveTime = this.dissolveTime;
      if (dissolveState[0]) {
        const type = Object.keys(dissolveState[0])[0];
        const time = Number(Object.values(dissolveState[0])[0]);
        const now = new Date();
        let to;
        if (type === 'DissolveDelaySeconds') {
          if (time === 0) {
            dissolveTime = '0d 0h 0m 0s';
            if (dissolveTime !== currentDissolveTime) {
              this.dissolveTime = dissolveTime;
            }
            return;
          }
          to = dayjs().add(time, 'second');
        } else {
          if (time * 1000 <= now.getTime()) {
            dissolveTime = '0d 0h 0m 0s';
            if (dissolveTime !== currentDissolveTime) {
              this.dissolveTime = dissolveTime;
            }
            return;
          }
          to = dayjs.unix(time);
        }
        const y = to.diff(now, 'y');
        if (y > 0) {
          to = to.subtract(y, 'y');
        }
        // const M = to.diff(now, 'M');
        // if (M > 0) {
        //   to = to.subtract(M, 'M');
        // }
        const d = to.diff(now, 'd');
        if (d > 0) {
          to = to.subtract(d, 'd');
        }
        const h = to.diff(now, 'h');
        if (h > 0) {
          to = to.subtract(h, 'h');
        }
        const m = to.diff(now, 'm');
        if (m > 0) {
          to = to.subtract(m, 'm');
        }
        const s = to.diff(now, 's');
        if (y > 0) {
          // if (M > 0) {
          //   return `${y}year ${M}month`;
          // }
          if (d > 0) {
            dissolveTime = `${y}year${this.isPlural(y)} ${d}day${this.isPlural(
              d
            )}`;
            if (dissolveTime !== currentDissolveTime) {
              this.dissolveTime = dissolveTime;
            }
            return;
          }
          dissolveTime = `${y}year${this.isPlural(y)}`;
          if (dissolveTime !== currentDissolveTime) {
            this.dissolveTime = dissolveTime;
          }
          return;
        }
        dissolveTime = `${d}d ${h}h ${m}m ${s}s`;
        if (dissolveTime !== currentDissolveTime) {
          this.dissolveTime = dissolveTime;
          if (d === 0 && h === 0 && m === 0 && s === 0) {
            setTimeout(() => {
              this.$emit('finish', this.index);
              // this.getNeuron(this.currentNeuronInfoIndex, index);
            }, 1000);
          }
        }
        return;
      }
    }
  }
  private isPlural(value: number): string {
    if (value > 1) {
      return 's';
    }
    return '';
  }
}
</script>
<style scoped lang="scss"></style>
