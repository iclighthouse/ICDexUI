<template>
  <div class="icl-task">
    <div class="icl-task-item">
      <div class="icl-task-item-title" style="margin-bottom: 50px">
        <div>
          Total quest supply:
          <span v-if="taskRewards && taskRewards[1]">{{
            taskRewards[1] | bigintToFloat(4, iclDecimals)
          }}</span>
          <span v-else>-</span>
          ICL.&nbsp;&nbsp;<span v-if="isPaused" style="color: #d29967"
            >Paused</span
          >
        </div>
        <div>
          Distributed rewards:
          <span v-if="taskRewards && taskRewards[0]">{{
            taskRewards[0] | bigintToFloat(4, iclDecimals)
          }}</span>
          <span v-else>-</span>
          ICL.
        </div>
      </div>
      <p class="icl-task-item-title">Complete quests and get rewards:</p>
      <table>
        <tbody>
          <tr>
            <td class="pl-30">
              Go to
              <router-link to="/ICDex/ckBTC/ICP">ckBTC/ICP</router-link> and
              complete 30 ICP of trading volume and get 5 ICL reward.
              <div>
                Ending time: {{ 1682726400 | formatDateFromSecondUTC }}.
              </div>
            </td>
            <td class="pr-30">
              <button
                v-if="new Date().getTime() <= 1682726400000"
                type="button"
                class="primary"
                :disabled="
                  isPaused ||
                  isCkBTCExpire ||
                  isCkBTCCanClaim ||
                  isBtcTaskCompleted ||
                  (!isBtcTaskCompleted && !isCkBTCCanClaim)
                "
                @click="btcTaskMining"
              >
                {{ isBtcTaskCompleted ? 'Completed' : 'Claim reward' }}
              </button>
              <button v-else type="button" disabled>Closed</button>
            </td>
          </tr>
          <tr>
            <td class="pl-30">
              Go to
              <router-link to="/wallet">ICLight wallet</router-link> to create
              a cycles wallet and get 5 ICL reward.
            </td>
            <td class="pr-30">
              <button type="button" disabled>Closed</button>
            </td>
          </tr>
          <tr>
            <td class="pl-30">
              Go to
              <router-link to="/cyclesFinance">CyclesFinance</router-link> and
              complete 20 ICP of trading volume and get 50 ICL reward.
              <!--<div style="font-size: 12px">
								(From March 6, the trading volume condition will be changed from
								10 ICPs to 20 ICPs.)
							</div>-->
            </td>
            <td class="pr-30">
              <button type="button" disabled>Closed</button>
              <!--<button
								type="button"
								:disabled="
                  isPaused ||
                  canClaim ||
                  isCfTaskCompleted ||
                  (!isCfTaskCompleted && !isCfCanClaim)
                "
								@click="getTaskMining"
							>
								{{ isCfTaskCompleted ? 'Completed' : 'Claim reward' }}
							</button>-->
            </td>
          </tr>
          <tr>
            <td class="pl-30">
              Go to
              <router-link to="/cyclesFinance">CyclesFinance</router-link> and
              complete 1 ICP of trading volume and get 50 ICL reward.
              <!--<div>Ending time: 2022-2-10 0:0:0 UTC.</div>-->
            </td>
            <td class="pr-30">
              <button type="button" disabled>Closed</button>
              <!--<button
								:disabled="
									isPaused ||
									isExpire ||
									canClaim ||
									isCfTaskCompleted ||
									(!isCfTaskCompleted && !isCfCanClaim)
								"
								@click="getTaskMining"
							>
								{{ isCfTaskCompleted ? 'Completed' : 'Claim reward' }}
							</button>-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IcMiningService } from '@/ic/icMining/icMiningService';
import { TaskTotalMinted, TaskTotalSupply } from '@/ic/icMining/model';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';

@Component({
  name: 'Quests',
  components: {}
})
export default class extends Vue {
  private IcMiningService: IcMiningService;
  private ICDexService: ICDexService;
  private iclDecimals = 8;
  private taskRewards: [TaskTotalMinted, TaskTotalSupply] = null;
  private isPaused = false;
  private isExpire = false;
  private isCkBTCExpire = false;
  private canClaim = true;
  private isCfTaskCompleted = false;
  private isBtcTaskCompleted = false;
  private isCfCanClaim = false;
  private isCkBTCCanClaim = false;
  private isCwTaskCompleted = false;
  private wallets = [];
  private ICLighthouseService: ICLighthouseService;
  private cyclesFinanceService: CyclesFinanceService;
  created(): void {
    this.IcMiningService = new IcMiningService();
    this.ICLighthouseService = new ICLighthouseService();
    this.cyclesFinanceService = new CyclesFinanceService();
    this.ICDexService = new ICDexService();
    const principalId = localStorage.getItem('principal');
    if (principalId) {
      this.getWallets();
      this.cwTaskCompleted();
      this.cfTaskCompleted();
      this.btcTaskCompleted();
      this.getCkBTCVol();
    }
    this.getTaskTotalMinted();
    this.getLiquidity();
    this.getIsPaused();
    this.isExpire = new BigNumber(new Date().getTime()).gt(1644451200000);
    this.isCkBTCExpire = new BigNumber(new Date().getTime()).gt(1682726400000);
  }
  private async getIsPaused(): Promise<void> {
    this.isPaused = await this.IcMiningService.isPaused();
  }
  private async getTaskTotalMinted(): Promise<void> {
    this.taskRewards = await this.IcMiningService.getTaskTotalMinted();
    this.canClaim = new BigNumber(this.taskRewards[0].toString(10)).gt(
      this.taskRewards[1].toString(10)
    );
  }
  private async getWallets(): Promise<void> {
    this.wallets = await this.ICLighthouseService.getWallets();
  }
  private async cwTaskCompleted(): Promise<void> {
    const principalId = localStorage.getItem('principal');
    this.isCwTaskCompleted = await this.IcMiningService.cwTaskCompleted(
      Principal.fromText(principalId)
    );
  }
  private async getLiquidity(): Promise<void> {
    const principalId = localStorage.getItem('principal');
    const res = await this.cyclesFinanceService.liquidity([principalId]);
    this.isCfCanClaim = new BigNumber(res.vol.swapIcpVol.toString(10))
      .div(10 ** 8)
      .gte(1);
  }
  private async getCkBTCVol(): Promise<void> {
    const principalId = localStorage.getItem('principal');
    const res = await this.ICDexService.liquidity(
      'k7tml-iaaaa-aaaak-aecgq-cai',
      [principalId]
    );
    console.log(res);
    this.isCkBTCCanClaim = new BigNumber(
      res.tokenLiquidity.vol.value1.toString(10)
    )
      .div(30 ** 8)
      .gte(10);
  }
  private async cfTaskCompleted(): Promise<void> {
    const principalId = localStorage.getItem('principal');
    this.isCfTaskCompleted = await this.IcMiningService.cfTaskCompleted(
      Principal.fromText(principalId)
    );
  }
  private async btcTaskCompleted(): Promise<void> {
    const principalId = localStorage.getItem('principal');
    this.isBtcTaskCompleted = await this.IcMiningService.btcTaskCompleted(
      Principal.fromText(principalId)
    );
  }
  private async getCwTaskMining(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const flag = await this.IcMiningService.cwTaskMining();
      loading.close();
      this.cwTaskCompleted();
      if (flag) {
        this.$message.success('Claim reward Success');
      } else {
        this.$message.error('You have claimed the reward.');
      }
    } catch (e) {
      console.log(e);
      loading.close();
    }
  }
  private async getTaskMining(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const flag = await this.IcMiningService.cfTaskMining();
      loading.close();
      this.cfTaskCompleted();
      if (flag) {
        this.$message.success('Claim reward Success');
      } else {
        this.$message.error('You have claimed the reward.');
      }
    } catch (e) {
      console.log(e);
      loading.close();
    }
  }
  private async btcTaskMining(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const flag = await this.IcMiningService.btcTaskMining();
      loading.close();
      this.btcTaskCompleted();
      if (flag) {
        this.$message.success('Claim reward success');
      } else {
        this.$message.error('You have claimed the reward.');
      }
    } catch (e) {
      console.log(e);
      loading.close();
      this.$message.error('Error');
    }
  }
}
</script>

<style scoped lang="scss">
.icl-task-item {
  background: #141b23;
  border-radius: 4px;
  padding: 20px 0;
  color: #747884;
  line-height: 1.5;
  .icl-task-item-title {
    padding: 0 30px;
    color: #adb3c4;
    font-size: 16px;
  }
  table {
    margin-top: 10px;
    color: #adb7c2 !important;
  }
  tr {
    height: 80px;
    &:nth-child(2n - 1) {
      background: #0d1217;
    }
  }
  td {
    white-space: normal;
    padding: 0;
    button {
      width: 100px;
    }
    &.pl-30 {
      padding-left: 30px;
    }
    &.pr-30 {
      padding-right: 30px;
    }
    a {
      color: #1996c4;
    }
  }
}
</style>
