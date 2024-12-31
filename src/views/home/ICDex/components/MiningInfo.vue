<template>
  <div>
    <div
      v-show="getPrincipalId && type !== 'pool' && type !== 'poolTable'"
      @click.stop="showInfo"
      class="mining-main"
    >
      <img
        v-show="isActive && canMining"
        src="@/assets/img/mining.png"
        alt=""
      />
      <img
        v-show="!isActive || !canMining"
        src="@/assets/img/mining.svg"
        alt=""
      />
    </div>
    <div v-if="type === 'pool'" class="mining-main">
      <a-tooltip placement="top">
        <template slot="title"> mineable </template>
        <img v-show="canMining" src="@/assets/img/mining.png" alt="" />
      </a-tooltip>
      <a-tooltip placement="top">
        <template slot="title"> unmineable </template>
        <img v-show="!canMining" src="@/assets/img/mining.svg" alt="" />
      </a-tooltip>
    </div>
    <div
      v-if="type === 'poolTable' && canMining"
      class="mining-main mining-main-table"
    >
      <a-tooltip placement="top">
        <template slot="title"> mineable </template>
        <img src="@/assets/img/mining.png" alt="" />
      </a-tooltip>
    </div>
    <a-modal
      v-model="visible"
      width="670px"
      :title="title"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="no-nft-modal"
    >
      <div
        v-if="
          currentRound &&
          currentRound.data &&
          currentRound.data.length &&
          accountData
        "
      >
        <div class="mining-status base-text-color">
          <div v-show="isStart" class="adopted-countdown-main">
            Round {{ currentRound.round.toString(10) }} of
            <span v-if="type === 'pools'">&nbsp;liquidity&nbsp;</span
            ><span v-else>&nbsp;trading&nbsp;</span> mining will start
            after&nbsp;
            <a-statistic-countdown
              class="adopted-countdown"
              :value="Number(currentRound.data[0].config.startTime) * 1000"
              format="D [days] H [hours] m [minutes] s [seconds]"
            />, and the total reward is
            <span v-if="type === 'pools'">
              &nbsp;{{
                currentRound.data[0].config.supplyForLM
                  | bigintToFloat(ICLDecimals, ICLDecimals)
                  | formatNum
              }}&nbsp;
            </span>
            <span v-else>
              &nbsp;{{
                currentRound.data[0].config.supplyForTM
                  | bigintToFloat(ICLDecimals, ICLDecimals)
                  | formatNum
              }}&nbsp;
            </span>
            {{ symbol }}.
          </div>
          <div v-show="isActive" class="adopted-countdown-main">
            Round {{ currentRound.round.toString(10) }} of
            <span v-if="type === 'pools'">&nbsp;liquidity&nbsp;</span
            ><span v-else>&nbsp;trading&nbsp;</span> mining has begun and will
            end in&nbsp;
            <a-statistic-countdown
              class="adopted-countdown"
              :value="Number(currentRound.data[0].config.endTime) * 1000"
              format="D [days] HH [hours] mm [minutes] ss [seconds]"
            />, and the total reward is
            <span v-if="type === 'pools'">
              &nbsp;{{
                currentRound.data[0].config.supplyForLM
                  | bigintToFloat(ICLDecimals, ICLDecimals)
                  | formatNum
              }}&nbsp;
            </span>
            <span v-else>
              &nbsp;{{
                currentRound.data[0].config.supplyForTM
                  | bigintToFloat(ICLDecimals, ICLDecimals)
                  | formatNum
              }}&nbsp;
            </span>
            {{ symbol }}.
          </div>
          <div v-show="isEnd">
            Round {{ currentRound.round.toString(10) }} of
            <span v-if="type === 'pools'">&nbsp;liquidity&nbsp;</span
            ><span v-else>&nbsp;trading&nbsp;</span> mining has ended.
          </div>
        </div>
        <div class="mining-points">
          <div v-show="getPrincipalId">
            <span v-if="isActive">
              <span
                >Your<span v-if="type === 'pools'">&nbsp;liquidity&nbsp;</span
                ><span v-else>&nbsp;trading&nbsp;</span>mining points are:
                <span v-if="type === 'pools'"
                  >&nbsp;{{
                    accountData.points.lm.toString(10) | filterMiningPoints
                  }}
                  ({{
                    getRewardsPercent(
                      accountData.points.lm,
                      currentRound.data[0].points.totalPointsForLM
                    )
                  }})&nbsp;</span
                ><span v-else
                  >&nbsp;{{ accountData.points.tm.toString(10) }} ({{
                    getRewardsPercent(
                      accountData.points.tm,
                      currentRound.data[0].points.totalPointsForTM
                    )
                  }})</span
                >,</span
              >
              <span v-if="Number(accelerationRate) === 0">
                <span @click="bindNFT" class="main-color pointer"
                  >Binding NFT</span
                >
                can get 15% to 25% mining acceleration. (You don't have a NFT
                yet? Go to
                <a
                  href="https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  class="link"
                  >YUKU</a
                >
                and get one.)
              </span>
            </span>
            <span v-else>
              <span
                >Your <span v-if="type === 'pools'">liquidity</span
                ><span v-else>trading</span> mining points are:
                <span v-if="type === 'pools'">
                  &nbsp;{{
                    accountData.points.lm.toString(10) | filterMiningPoints
                  }}
                  ({{
                    getRewards(
                      accountData.points.lm,
                      currentRound.data[0].points.totalPointsForLM,
                      currentRound.data[0].config.supplyForLM
                    ) | formatNum
                  }}
                  {{ symbol }})</span
                ><span v-else
                  >&nbsp;{{ accountData.points.tm.toString(10) }} ({{
                    getRewards(
                      accountData.points.tm,
                      currentRound.data[0].points.totalPointsForTM,
                      currentRound.data[0].config.supplyForTM
                    ) | formatNum
                  }}
                  {{ symbol }})</span
                ></span
              ><span v-if="Number(accelerationRate) !== 0"
                >,&nbsp;+{{ accelerationRate | filterRate }} acceleration by
                holding
                <router-link class="main-color" to="/NFT">NFT</router-link>.
              </span>
            </span>
          </div>
        </div>
        <div style="display: flex; justify-content: center" class="mt20">
          <router-link
            v-if="type === 'pools'"
            @click.native="visible = false"
            class="link"
            to="/Mining"
          >
            Mining details
          </router-link>
          <router-link
            @click.native="visible = false"
            v-else
            class="link"
            to="/Mining"
          >
            Mining details
          </router-link>
          <a
            href="https://medium.com/@ICLighthouse/icdex-mining-guide-f242a49f2dc9"
            target="_blank"
            rel="nofollow noreferrer noopener"
            class="link"
            style="margin-left: 30px"
            >Mining guide</a
          >
        </div>
      </div>
      <div v-else class="text-center">No Trading Mining</div>
    </a-modal>
    <nft-balance
      ref="nftBalance"
      :nft-balance="nftBalance"
      :nfts="nfts"
      :tokens="tokens"
      type="mining"
      @depositSuccess="depositSuccess"
      @NFTWithdrawSuccess="NFTWithdrawSuccess"
    ></nft-balance>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MiningService } from '@/ic/Mining/miningService';
import { AccountData, RoundInfo } from '@/ic/Mining/model';
import BigNumber from 'bignumber.js';
import { hexToBytes, principalToAccountIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import NftBalance from '@/views/home/ICDex/components/NFTBalance.vue';
import { namespace } from 'vuex-class';
import { NFT } from '@/ic/ICDexRouter/model';
import { TokensExt } from '@/ic/nft/model';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';
import { TokenInfo } from '@/ic/common/icType';
import { NftService } from '@/ic/nft/Service';
import { PairsData, TrieListData1 } from '@/ic/ICSwapRouter/model';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';

const commonModule = namespace('common');

@Component({
  name: 'Mining',
  components: {
    NftBalance
  },
  filters: {
    filterRate(val: string): string {
      return new BigNumber(val).times(100) + '%';
    },
    filterMiningPoints(val: string) {
      if (new BigNumber(val).gt(10 ** 3)) {
        return (
          new BigNumber(val)
            .div(10 ** 6)
            .decimalPlaces(2)
            .toString(10) + 'M'
        );
      }
      return val;
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @Prop({ type: String, default: () => '' })
  public currentPairId!: string;
  @Prop({ type: String, default: '' })
  public type!: string;
  @Prop({ type: Object, default: () => null })
  public currentRoundPool!: RoundInfo;
  @Prop({ type: Array, default: () => [] })
  public miningPairsPool!: Array<PairsData>;
  private MiningService: MiningService = null;
  private ICDexRouterService: ICDexRouterService = null;
  private NftService: NftService = null;
  private currentRound: RoundInfo = null;
  private visible = false;
  private title = 'Trading Mining';
  private isEnd = false;
  private isStart = false;
  private ICLDecimals = 8;
  private symbol = 'ICL';
  private accelerationRate = '';
  private accountData: AccountData = null;
  private nfts: TokensExt = [];
  private nftBalance: Array<NFT> = [];
  private tokens: { [key: string]: TokenInfo } = {};
  private miningPairs: Array<PairsData> = [];
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService = null;
  private currentMining = '';
  get isActive(): boolean {
    let flag = false;
    if (this.currentRound && this.currentRound.data.length) {
      const info = this.currentRound.data[0];
      const type = Object.keys(info.status)[0];
      if (type === 'Active') {
        const now = new Date().getTime() / 1000;
        return (
          new BigNumber(info.config.startTime.toString(10)).lt(now) &&
          new BigNumber(info.config.endTime.toString(10)).gt(now)
        );
      }
    }
    return flag;
  }
  get canMining(): boolean {
    if (this.type === 'pools') {
      return true;
    }
    let flag = false;
    if (
      this.currentPairId &&
      this.miningPairs.length &&
      this.currentRound &&
      this.currentRound.data.length
    ) {
      flag = this.miningPairs.some((item) => {
        return item[0].toString() === this.currentPairId;
      });
      console.log(flag);
    }
    return flag;
  }
  async created(): Promise<void> {
    if (this.currentRoundPool && this.miningPairsPool) {
      this.currentRound = this.currentRoundPool;
      this.miningPairs = this.miningPairsPool;
    }
    if (this.type !== 'pool' && this.type !== 'poolTable') {
      this.currentMining = 'odhfn-cqaaa-aaaar-qaana-cai';
      this.symbol = 'ICL';
      this.ICLDecimals = 8;
      this.MiningService = new MiningService();
      this.ICDexRouterService = new ICDexRouterService();
      this.NftService = new NftService();
      this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
      this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
      if (this.getPrincipalId) {
        await this.NFTBalance();
        await this.getTokensExt();
      }
      this.getRound().then(() => {
        Promise.all([this.getAccelerationRate(), this.getAccountData()]).then(
          () => {
            this.$emit('init', this.miningPairs, this.currentRound);
          }
        );
      });
    }
  }
  private async getPairs(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.getPairs(
      ['icdex'],
      [],
      []
    );
    console.log(res);
    let pairs = [];
    if (this.currentRound && this.currentRound.data.length) {
      const info = this.currentRound.data[0];
      const type = Object.keys(info.config.pairs)[0];
      if (res && res.data && res.data.length) {
        res.data.forEach((item: TrieListData1) => {
          const currentPairId = item[0].toString();
          const score = new BigNumber(item[1].score1.toString(10))
            .plus(item[1].score2.toString(10))
            .plus(item[1].score3.toString(10));
          if (score.gte(info.config.pairFilter.minPairScore.toString(10))) {
            const blackList = info.config.pairFilter.blackList.some((item) => {
              return item.toString() === currentPairId;
            });
            if (!blackList) {
              if (type === 'all') {
                pairs.push(item);
              } else if (type === 'whitelist') {
                const whitelist = Object.values(info.config.pairs)[0];
                const flag = whitelist.some((item) => {
                  return item.toString() === currentPairId;
                });
                if (flag) {
                  pairs.push(item);
                }
              }
            }
          }
        });
      }
      this.miningPairs = pairs;
      console.log(this.miningPairs);
    }
  }
  private showInfo(): void {
    if (!this.canMining) {
      (this.$info as any)({
        content: 'The current pair is not mineable.',
        class:
          'connect-plug register-mining-confirm register-mining-confirm-hide-button',
        icon: 'connect-plug',
        centered: true,
        closable: true
      });
      return;
    } else {
      this.visible = true;
    }
  }
  private async getRound(): Promise<void> {
    const miningList = [
      {
        canisterId: 'odhfn-cqaaa-aaaar-qaana-cai',
        symbol: 'ICL',
        decimals: 8
      },
      {
        canisterId: 'orbsu-oaaaa-aaaar-qaaoa-cai',
        symbol: 'CHAT',
        decimals: 8
      },
      {
        canisterId: 'owaua-dyaaa-aaaar-qaaoq-cai',
        symbol: 'MOTOKO',
        decimals: 8
      },
      {
        canisterId: 'oyczi-yiaaa-aaaar-qaapq-cai',
        symbol: 'EXE',
        decimals: 8
      }
    ];
    for (let i = miningList.length - 1; i >= 0; i--) {
      const round = await this.MiningService.getRound(miningList[i].canisterId);
      console.log(round);
      let isEnd = false;
      let isStart = false;
      if (round) {
        if (
          round.data &&
          round.data.length &&
          !round.data[0].config.startTime
        ) {
          if (Number(round.round) === 1) {
            // 2024-02-02 00:00:00 UTC
            round.data[0].config.startTime = BigInt(1706832000);
          } else {
            const res = await this.MiningService.getRound(
              miningList[i].canisterId,
              [BigInt(Number(round.round) - 1)]
            );
            round.data[0].config.startTime = res.data[0].config.endTime;
          }
        }
        const now = new Date().getTime();
        if (
          round.data &&
          round.data.length &&
          new BigNumber(round.data[0].config.endTime.toString(10))
            .times(1000)
            .lt(now)
        ) {
          isEnd = true;
        }
        if (
          round.data &&
          round.data.length &&
          new BigNumber(round.data[0].config.startTime.toString(10))
            .times(1000)
            .lt(now)
        ) {
          isStart = true;
        }
      }
      console.log(isStart, isEnd);
      if (isStart && !isEnd) {
        this.currentMining = miningList[i].canisterId;
        this.symbol = miningList[i].symbol;
        this.ICLDecimals = miningList[i].decimals;
        this.currentRound = round;
        break;
      }
    }
    console.log(this.currentRound);
    if (!this.miningPairs.length) {
      console.log(this.type);
      await this.getPairs();
    }
    if (this.currentRound) {
      if (this.type === 'pools') {
        this.title = `Liquidity Mining Round ${Number(
          this.currentRound.round
        )}`;
      } else {
        this.title = `Trading Mining Round ${Number(this.currentRound.round)}`;
      }
    }
    if (
      this.currentRound &&
      this.currentRound.data &&
      this.currentRound.data.length &&
      !this.currentRound.data[0].config.startTime
    ) {
      if (Number(this.currentRound.round) === 1) {
        // 2024-02-02 00:00:00 UTC
        this.currentRound.data[0].config.startTime = BigInt(1706832000);
      } else {
        const res = await this.MiningService.getRound(this.currentMining, [
          BigInt(Number(this.currentRound.round) - 1)
        ]);
        this.currentRound.data[0].config.startTime = res.data[0].config.endTime;
      }
    }
    const now = new Date().getTime();
    if (
      this.currentRound &&
      this.currentRound.data &&
      this.currentRound.data.length &&
      new BigNumber(this.currentRound.data[0].config.endTime.toString(10))
        .times(1000)
        .lt(now)
    ) {
      this.isEnd = true;
    }
    if (
      this.currentRound &&
      this.currentRound.data &&
      this.currentRound.data.length &&
      new BigNumber(this.currentRound.data[0].config.startTime.toString(10))
        .times(1000)
        .gt(now)
    ) {
      this.isStart = true;
    }
  }
  private async getAccelerationRate(): Promise<void> {
    if (this.getPrincipalId) {
      this.accelerationRate = await this.MiningService.getAccelerationRate(
        this.currentMining,
        hexToBytes(
          principalToAccountIdentifier(Principal.fromText(this.getPrincipalId))
        )
      );
    }
  }
  private async getAccountData(): Promise<void> {
    if (this.getPrincipalId) {
      this.accountData = await this.MiningService.getAccountData(
        this.currentMining,
        hexToBytes(
          principalToAccountIdentifier(Principal.fromText(this.getPrincipalId))
        )
      );
    }
  }
  private bindNFT(): void {
    (this.$refs.nftBalance as any).init();
    (this.$refs.nftBalance as any).visible = true;
  }
  private async NFTBalance(): Promise<void> {
    const principal = localStorage.getItem('principal');
    this.nftBalance = await this.ICDexRouterService.NFTBalance(principal);
  }
  private async getTokensExt(): Promise<void> {
    try {
      const res = await this.NftService.tokens_ext();
      console.log(res);
      const tokensExt = (
        res as {
          ok: TokensExt;
        }
      ).ok;
      console.log(tokensExt);
      this.nfts = tokensExt;
    } catch (e) {
      console.log(e);
    }
  }
  private NFTWithdrawSuccess(): void {
    this.getTokensExt();
    this.NFTBalance().then(() => {
      (this.$refs.nftBalance as any).init();
    });
  }
  private depositSuccess(): void {
    this.getTokensExt();
    this.NFTBalance().then(() => {
      (this.$refs.nftBalance as any).init();
    });
  }
  private getRewards(pointer: bigint, total: bigint, supply: bigint): string {
    return new BigNumber(pointer.toString(10))
      .times(supply.toString(10))
      .div(total.toString(10))
      .div(10 ** 8)
      .decimalPlaces(2, 1)
      .toString(10);
  }
  private getRewardsPercent(pointer: bigint, total: bigint): string {
    return (
      new BigNumber(pointer.toString(10))
        .div(total.toString(10))
        .times(100)
        .decimalPlaces(4, 1)
        .toString(10) + '%'
    );
  }
}
</script>

<style scoped lang="scss">
.mining-points {
  margin-top: 10px;
}
.mining-status {
  font-size: 16px;
}
.adopted-countdown-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.mining-main {
  display: flex;
  align-items: center;
  height: 26px;
  background: #223a43;
  padding: 5px 8px;
  border-radius: 20px;
  cursor: pointer;
  color: #8c90a1;
  img {
    width: 14px;
  }
  &.mining-main-table {
    height: 20px;
    img {
      width: 10px;
    }
  }
}
.no-nft-modal {
  color: #adb7c2;
}
</style>
<style lang="scss">
.adopted-countdown {
  line-height: 1;
  .ant-statistic-content {
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
}
</style>
