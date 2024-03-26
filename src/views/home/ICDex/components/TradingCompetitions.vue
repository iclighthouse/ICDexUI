<template>
  <div>
    <div>
      <div class="trading-competitions-info">
        <a-tooltip placement="top">
          <template slot="title"> Trading Competitions </template>
          <img
            @click="jumpCompetitions"
            class="pointer"
            src="@/assets/img/competition.png"
            alt=""
          />
        </a-tooltip>
        <div v-if="closed">Closed</div>
        <div v-if="soon && !closed">Open soon</div>
        <div
          class="can-click"
          v-if="canTradeCompetitions && !type"
          @click="onRegister"
        >
          Register
        </div>
        <div class="success" v-if="canTradeCompetitions && type === 'Active'">
          Registered
        </div>
        <div class="error" v-if="canTradeCompetitions && type === 'Dropout'">
          Dropout
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import BigNumber from 'bignumber.js';
import { CompResult } from '@/ic/ICDex/model';

@Component({
  name: 'TradingCompetitions',
  components: {}
})
export default class extends Vue {
  private canTradeCompetitions = false;
  private closed = false;
  private soon = false;
  private pairId = '';
  private compResult: Array<CompResult> = null;
  private type = '';
  private timer = null;
  beforeDestroy(): void {
    window.clearTimeout(this.timer);
    this.timer = null;
  }
  private init(pairId: string): void {
    window.clearTimeout(this.timer);
    this.timer = null;
    this.pairId = pairId;
    this.closed = false;
    this.canTradeCompetitions = false;
    this.soon = false;
    this.compResult = null;
    this.type = '';
    const principal = localStorage.getItem('principal');
    if (principal) {
      this.getRoundInfo();
      this.getCompResult();
    }
  }
  private jumpCompetitions(): void {
    this.$emit('/ICDex/competitions');
  }
  private async getRoundInfo(): Promise<void> {
    this.canTradeCompetitions = false;
    const currentICDexService = new ICDexService();
    const res = await currentICDexService.comp_round(this.pairId);
    console.log(res);
    const now = new Date().getTime();
    if (
      res &&
      res.pairId === this.pairId &&
      res.compRoundResponse[1] &&
      res.compRoundResponse[1].length
    ) {
      const round = res.compRoundResponse[1][0];
      this.canTradeCompetitions =
        new BigNumber(now).times(1000000).gte(round.start.toString(10)) &&
        new BigNumber(now).times(1000000).lte(round.end.toString(10));
      this.closed = new BigNumber(now)
        .times(1000000)
        .gt(round.end.toString(10));
      if (new BigNumber(now).times(1000000).lt(round.start.toString(10))) {
        this.soon = true;
        if (this.timer) {
          window.clearTimeout(this.timer);
          this.timer = null;
        }
        const time = Math.ceil(
          new BigNumber(round.start.toString(10))
            .div(1000000)
            .minus(now)
            .toNumber()
        );
        this.timer = setTimeout(() => {
          this.getRoundInfo();
        }, time);
      } else {
        this.soon = false;
      }
    } else {
      this.closed = true;
    }
  }
  private async getCompResult(): Promise<void> {
    const currentICDexService = new ICDexService();
    const principal = localStorage.getItem('principal');
    this.compResult = await currentICDexService.comp_result(
      this.pairId,
      [],
      principal
    );
    if (this.compResult && this.compResult.length) {
      this.type = Object.keys(this.compResult[0].status)[0];
    }
  }
  private async onRegister(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this;
    this.$confirm({
      title: 'Are you sure you want to participate in the trading competition?',
      content:
        "Notes: Participants' trading assets will be held in the contract until the end of the competition for the purpose of calculating earnings. Participants may drop out the competition and withdraw their assets early.",
      class: 'connect-plug register-mining-confirm',
      icon: 'connect-plug',
      okText: 'Yes',
      centered: true,
      onOk() {
        const loading = _that.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        const currentICDexService = new ICDexService();
        const dexId = _that.pairId;
        currentICDexService
          .comp_register(dexId)
          .then((res) => {
            if (res) {
              _that.$message.success('Register success');
              _that.$emit('registerSuccess');
              _that.getCompResult();
            } else {
              _that.$message.error('Register error');
            }
          })
          .catch(() => {
            _that.$message.error('Register error');
          })
          .finally(() => {
            loading.close();
          });
      }
    });
  }
}
</script>

<style scoped lang="scss">
.trading-competitions-info {
  display: flex;
  align-items: center;
  height: 26px;
  background: #223a43;
  padding: 5px 8px;
  border-radius: 20px;
  cursor: default;
  img {
    width: 16px;
    margin-right: 5px;
  }
}
.success {
  color: #21c77d;
  cursor: default;
}
.error {
  color: #d13651;
  cursor: default;
}
.can-click {
  color: #51b7c3;
  cursor: pointer;
}
</style>
