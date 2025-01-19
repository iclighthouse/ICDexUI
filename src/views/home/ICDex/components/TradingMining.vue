<template>
  <div>
    <div class="mining-main">
      <a-tooltip placement="top">
        <template slot="title"> Mining </template>
        <img
          @click="jump"
          class="pointer"
          src="@/assets/img/mining.png"
          alt=""
        />
      </a-tooltip>
      <div v-if="!canTradingMining && getPrincipalId">Closed</div>
      <div class="can-trading-mining" v-if="canTradingMining && getPrincipalId">
        <span v-if="canRegistered || !status" class="trading-mining-status">
          <span v-if="status && status[0] && status[0][0]" class="success"
            >Registered</span
          >
          <span v-else>
            <span v-if="isRegisterTime" class="can-click" @click="onRegister"
              ><span v-show="getPrincipalId">Unregistered</span></span
            >
            <span v-else class="base-font"
              ><span v-show="getPrincipalId">Unregistered</span></span
            >
          </span>
        </span>
        <span
          class="claimed-span"
          v-if="
            status &&
            status[0] &&
            status[0][0] &&
            Object.keys(status[0][0][3])[0] === 'Finished'
          "
          >Claimed</span
        >
        <button
          v-if="canClaim"
          type="button"
          class="primary on-claim-button"
          @click="onClaim"
        >
          Claim(final {{ claimTime }})
        </button>
        <router-link to="/icl/tradingMining">
          <!--<span class="pc-show">Trading Mining</span>-->
          <span v-if="!canClaim" class="h5-show">Mining</span>
        </router-link>
        <a-tooltip placement="top">
          <template slot="title"> Claim mining reward </template>
          <svg
            v-if="canClaim"
            @click="onClaim"
            t="1664259786742"
            class="icon pc-show"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3086"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path
              d="M557.3 269.2L512 224 288 448l45.2 45.2L480 346.5V736h64V346.5l137.4 137.4 45.2-45.3-169.4-169.4z"
              p-id="3087"
            ></path>
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m271.6 719.7c-35.3 35.3-76.4 63-122.1 82.3-47.3 20-97.6 30.2-149.5 30.2S409.8 886.1 362.5 866c-45.7-19.3-86.8-47-122.1-82.3s-63-76.4-82.3-122.1c-20-47.3-30.2-97.6-30.2-149.5s10.1-102.2 30.2-149.5c19.3-45.7 47-86.8 82.3-122.1s76.4-63 122.1-82.3C409.8 138.1 460.1 128 512 128c51.9 0 102.2 10.1 149.5 30.2 45.7 19.3 86.8 47 122.1 82.3s63 76.4 82.3 122.1c20 47.3 30.2 97.6 30.2 149.5S886 614.3 865.9 661.6c-19.3 45.7-47 86.8-82.3 122.1z"
              p-id="3088"
            ></path>
          </svg>
        </a-tooltip>
      </div>
    </div>
    <a-modal
      v-model="noNftVisible"
      width="400px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="no-nft-modal"
    >
      <div class="no-nft-modal-title base-font-title">
        You have no specified NFT, Go to buy one?
      </div>
      <div class="no-nft-modal-button mt20">
        <button type="button" @click="noNftVisible = false">Cancel</button>
        <a
          @click="noNftVisible = false"
          href="https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai"
          target="_blank"
          rel="nofollow noreferrer noopener"
        >
          <button type="button" class="primary">Go to buy</button>
        </a>
      </div>
    </a-modal>
    <a-modal
      v-model="tradingStepVisible"
      width="670px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="no-nft-modal"
    >
      <div>
        <a-steps class="trading-step-main mt20" :current="currentStep">
          <a-step>
            <template slot="title">Hold NFT</template>
            <span slot="description">
              Transfer your NFT to your account
              {{ getPrincipalId | ellipsisAccount(8) }}.
              <span
                v-if="
                  (!tmNFTBalance || (tmNFTBalance && !tmNFTBalance.length)) &&
                  !tokensExt.length
                "
                >(You have no NFT)</span
              >
              <div class="trading-step-tokens" v-else>
                NFT(<span
                  v-for="(item, index) in tokensExt.slice(0, 2)"
                  :key="index"
                >
                  <a
                    style="color: #166a89"
                    :href="`https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai/${item[0]}`"
                    rel="nofollow noreferrer noopener"
                    target="_blank"
                    >{{ item[0] }}</a
                  ><span v-show="index === 0 && tokensExt.length > 1"
                    >,</span
                  > </span
                ><span v-if="tokensExt.length > 2">...</span>)
              </div>
            </span>
          </a-step>
          <a-step>
            <template slot="title">Approve</template>
            <span slot="description">
              NFT approval.
              <!--<span
                v-if="
                  (!tmNFTBalance || (tmNFTBalance && !tmNFTBalance.length)) &&
                  !tokensExt.length
                "
                >(You have no NFT)</span
              >-->
              <button
                :disabled="!canApprove || currentStep !== 1"
                type="button"
                class="primary step-button step-button-approval"
                @click="onApprove"
              >
                Approve
              </button>
            </span>
          </a-step>
          <a-step>
            <template slot="title">Register</template>
            <span slot="description">
              Register for trading mining during the period of registration.
              <button
                :disabled="!canRegister || currentStep !== 2"
                type="button"
                class="primary step-button"
                @click="tmRegister"
              >
                Register
              </button>
            </span>
          </a-step>
        </a-steps>
      </div>
    </a-modal>
    <a-modal
      v-model="claimVisible"
      width="500px"
      title="Claim mining reward"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="no-nft-modal"
    >
      <div>
        <div v-if="status">
          <div class="trading-mining-item-info">
            <span>Mined:</span>
            <span class="base-font-title"
              >{{ mined | bigintToFloat(8, 8) }}(Est.) ICLs</span
            >
          </div>
        </div>
        <button @click="claim" type="button" class="claim-button primary w100">
          Claim
        </button>
      </div>
    </a-modal>
    <approve-nft
      ref="approveNft"
      :tokens-ext="tokensExt"
      @approveSuccess="approveSuccess"
    ></approve-nft>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { IcMiningService } from '@/ic/icMining/icMiningService';
import { AllowanceRequest, TokensExt } from '@/ic/nft/model';
import {
  TmNFTBalance,
  TradingMining,
  TradingMiningPairs,
  TradingMiningStatus
} from '@/ic/icMining/model';
import { NftService } from '@/ic/nft/Service';
import {
  getTokenIdentifier,
  principalToAccountIdentifier
} from '@/ic/converter';
import { IC_MINING_CANISTER_ID, NFT_CANISTER_ID } from '@/ic/utils';
import ApproveNft from '@/components/approveNFT/Index.vue';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { namespace } from 'vuex-class';
import { checkAuth } from '@/ic/CheckAuth';
const commonModule = namespace('common');
@Component({
  name: 'TradingMining',
  components: {
    ApproveNft
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @Prop({ type: String, default: '' })
  private pairId!: string;
  private NftService: NftService = null;
  private noNftVisible = false;
  private tradingStepVisible = false;
  private claimVisible = false;
  private tradingMiningService: IcMiningService;
  private tokensExt: TokensExt = [];
  private hasAllowance = false;
  private setting: TradingMining = null;
  private status: TradingMiningStatus = null;
  private tmNFTBalance: TmNFTBalance = null;
  private volume = '0';
  private mined = '0';
  private claimTime = '';
  private timer = null;
  private currentStep = 0;
  get canRegistered(): boolean {
    let flag = false;
    if (this.setting) {
      const time = new Date().getTime();
      if (
        new BigNumber(time)
          .times(1000000)
          .gt(this.setting.start.toString(10)) &&
        new BigNumber(time).times(1000000).lt(this.setting.end1.toString(10))
      ) {
        flag = true;
      }
    }
    return flag;
  }
  get showApproved(): boolean {
    let flag = false;
    const time = new Date().getTime();
    if (this.hasAllowance) {
      if (
        this.setting &&
        new BigNumber(time)
          .times(1000000)
          .gt(this.setting.start.toString(10)) &&
        new BigNumber(time).times(1000000).lt(this.setting.end1.toString(10))
      ) {
        flag = true;
      }
    }
    return flag;
  }
  get canApprove(): boolean {
    let flag = false;
    const time = new Date().getTime();
    if (
      this.setting &&
      new BigNumber(time).times(1000000).gt(this.setting.start.toString(10)) &&
      new BigNumber(time).times(1000000).lt(this.setting.end1.toString(10))
    ) {
      if (
        this.tokensExt.length &&
        !this.hasAllowance &&
        (!this.tmNFTBalance || (this.tmNFTBalance && !this.tmNFTBalance.length))
      ) {
        flag = true;
      }
      if (flag) {
        this.currentStep = 1;
      }
    }
    return flag;
  }
  get canClaim(): boolean {
    let flag = false;
    if (this.status && this.setting) {
      if (Object.keys(this.status[0][0][3])[0] === 'Active') {
        const time = new Date().getTime();
        if (
          new BigNumber(time)
            .times(1000000)
            .gt(this.setting.end1.toString(10)) &&
          new BigNumber(time).times(1000000).lt(this.setting.end2.toString(10))
        ) {
          flag = true;
        }
      }
    }
    return flag;
  }
  get canTradingMining(): boolean {
    let flag = false;
    if (this.setting) {
      let isTrading: boolean;
      isTrading = this.setting.pairs.some((pair) => {
        return pair[0].toString() === this.pairId;
      });
      const time = new Date().getTime();
      if (
        isTrading &&
        new BigNumber(time)
          .times(1000000)
          .gt(this.setting.start.toString(10)) &&
        new BigNumber(time).times(1000000).lt(this.setting.end2.toString(10))
      ) {
        flag = true;
      }
    }
    return flag;
  }
  get isRegisterTime(): boolean {
    let flag = false;
    const time = new Date().getTime();
    if (
      this.setting &&
      new BigNumber(time).times(1000000).gt(this.setting.start.toString(10)) &&
      new BigNumber(time).times(1000000).lt(this.setting.end1.toString(10))
    ) {
      flag = true;
    }
    return flag;
  }
  get canRegister(): boolean {
    let flag = false;
    const time = new Date().getTime();
    if (
      this.setting &&
      new BigNumber(time).times(1000000).gt(this.setting.start.toString(10)) &&
      new BigNumber(time).times(1000000).lt(this.setting.end1.toString(10))
    ) {
      if (this.hasAllowance) {
        flag = true;
      }
      if (flag) {
        this.currentStep = 2;
      }
    }
    return flag;
  }
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
  }
  created(): void {
    this.NftService = new NftService();
    this.tradingMiningService = new IcMiningService();
    this.init();
  }
  private init(): void {
    this.getTmSetting();
    this.getStatus();
    this.getTmNFTBalance();
    this.getTokensExt();
    this.getNFTAllowance();
  }
  private jump(): void {
    this.$router.push('/icl/tradingMining');
  }
  private approveSuccess(): void {
    this.getNFTAllowance();
  }
  private async claim(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const res = await this.tradingMiningService.tmClaim();
      this.$message.success('Claim Success');
      this.init();
      this.claimVisible = false;
    } catch (e) {
      this.$message.success('Claim error');
    }
    loading.close();
  }
  private async tmRegister(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      await checkAuth();
      try {
        const nftId = localStorage.getItem('approveNft');
        const res = await this.tradingMiningService.tmRegister(
          getTokenIdentifier(NFT_CANISTER_ID, Number(nftId))
        );
        if (res) {
          this.$message.success('Register Success');
          localStorage.removeItem('approveNft');
          this.getTmNFTBalance();
          this.getStatus();
          this.tradingStepVisible = false;
        } else {
          this.$message.error('Register error');
        }
      } catch (e) {
        this.$message.error('Register error');
      }
      loading.close();
    }
  }
  private async getTmSetting(): Promise<void> {
    this.setting = await this.tradingMiningService.tmSetting();
    this.setDownTime();
  }
  private async getNFTAllowance(): Promise<void> {
    const principal = localStorage.getItem('principal');
    let address;
    if (principal) {
      address = principalToAccountIdentifier(Principal.fromText(principal));
      const nftId = localStorage.getItem('approveNft');
      const allowanceRequest: AllowanceRequest = {
        token: getTokenIdentifier(NFT_CANISTER_ID, Number(nftId)),
        owner: {
          address: address
        },
        spender: Principal.fromText(IC_MINING_CANISTER_ID)
      };
      const res = await this.NftService.allowance(allowanceRequest);
      if ((res as { ok: bigint }).ok) {
        this.hasAllowance = true;
      }
    }
  }
  private async onApprove(): Promise<void> {
    (this.$refs as any).approveNft.visible = true;
    (this.$refs as any).approveNft.init();
  }
  private async getTokensExt(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const res = await this.NftService.tokens_ext();
      const tokensExt = (
        res as {
          ok: TokensExt;
        }
      ).ok;
      if (tokensExt && tokensExt.length) {
        this.tokensExt = tokensExt;
      } else {
        this.tokensExt = [];
      }
    }
  }
  private async onRegister(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const speedup = Number(this.setting.nftFactor) - 100;
    this.$confirm({
      title: 'Register for trading mining during the period of registration.',
      content: `ICLighthouse Planet Card holders gain +${speedup}% speedup.`,
      class: 'connect-plug register-mining-confirm',
      icon: 'connect-plug',
      okText: 'NFT Holders Registration',
      cancelText: 'General Trader Registration',
      centered: true,
      onCancel() {
        that.register1();
      },
      onOk() {
        if (!that.tokensExt.length) {
          that.noNftVisible = true;
        } else {
          that.tradingStepVisible = true;
        }
      }
    });
  }
  private async register1(): Promise<void> {
    if (this.getPrincipalId) {
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      await checkAuth();
      try {
        const res = await this.tradingMiningService.tmRegister2();
        if (res) {
          this.$message.success('Register Success');
          this.getStatus();
        } else {
          this.$message.error('Register error');
        }
      } catch (e) {
        this.$message.error('Register error');
      }
      loading.close();
    }
  }
  private async getTmNFTBalance(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      this.tmNFTBalance = await this.tradingMiningService.tmNFTBalance(
        principal
      );
    }
  }
  private async getLiquidity(swapId: string, weight: bigint): Promise<string> {
    const principal = localStorage.getItem('principal');
    let volume = '0';
    if (principal) {
      try {
        const currentICDexService = new ICDexService();
        const res = await currentICDexService.liquidity(swapId, [principal]);
        if (res && res.pairId === swapId) {
          volume = new BigNumber(res.tokenLiquidity.vol.value1.toString(10))
            .times(weight.toString(10))
            .div(1000)
            .toString(10);
        }
      } catch (e) {
      }
    }
    return volume;
  }
  private async getStatus(claim = false): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const status = await this.tradingMiningService.tmStatus(principal);
      if (status && status[0] && status[0].length) {
        this.status = status;
        const haveNft = this.status[1];
        if (claim) {
          const currentStatus = Object.keys(this.status[0][0][3])[0];
          if (currentStatus === 'Active') {
            const promiseAll = [];
            this.setting.pairs.forEach((pair: TradingMiningPairs) => {
              promiseAll.push(this.getLiquidity(pair[0].toString(), pair[1]));
            });
            const res = await Promise.all(promiseAll);
            let totalVolume = '0';
            res.forEach((volume: string) => {
              if (volume) {
                totalVolume = new BigNumber(volume)
                  .plus(totalVolume)
                  .toString(10);
              }
            });
            this.volume = totalVolume;
            let speed = 100;
            if (haveNft) {
              speed = Number(this.setting.nftFactor);
            }
            const mined = new BigNumber(totalVolume)
              .minus(this.status[0][0][0].toString(10))
              .times(speed)
              .div(100)
              .div(this.setting.ratio.toString(10))
              .toString(10);
            if (new BigNumber(mined).gt(this.setting.max.toString(10))) {
              this.mined = this.setting.max.toString(10);
            } else {
              this.mined = mined;
            }
          }
        }
      }
    }
  }
  private getTime(): void {
    const time = new Date().getTime();
    const last = new BigNumber(this.setting.end2.toString(10))
      .div(1000000)
      .minus(time)
      .div(1000)
      .div(60 * 60)
      .toString(10);
    if (new BigNumber(last).lte(0)) {
      window.clearInterval(this.timer);
      this.timer = null;
      this.getStatus();
    }
    if (parseInt(last) > 1) {
      this.claimTime = `${parseInt(last)} h`;
    } else if (parseInt(last) >= 0) {
      const minutes = new BigNumber(last).times(60).toString(10);
      this.claimTime = `${parseInt(minutes)} m`;
    }
  }
  private setDownTime(): void {
    if (this.setting) {
      window.clearInterval(this.timer);
      this.timer = null;
      const time = new Date().getTime();
      const last = new BigNumber(this.setting.end2.toString(10))
        .div(1000000)
        .minus(time)
        .div(1000)
        .div(60 * 60)
        .toString(10);
      if (parseInt(last) > 1) {
        this.claimTime = `${parseInt(last)} h`;
        this.timer = window.setInterval(() => {
          this.getTime();
        }, 1000 * 60 * 60);
      } else if (parseInt(last) >= 0) {
        const minutes = new BigNumber(last).times(60).toString(10);
        this.claimTime = `${parseInt(minutes)} m`;
        this.timer = window.setInterval(() => {
          this.getTime();
        }, 1000 * 60);
      }
    }
  }
  private async onClaim(): Promise<void> {
    this.claimVisible = true;
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      await this.getStatus(true);
    } catch (e) {
    }
    loading.close();
  }
}
</script>
<style scoped lang="scss">
.trading-step-tokens {
  position: absolute;
  bottom: 0;
  height: 30px;
  line-height: 30px;
}
.on-claim-button {
  width: auto;
  height: 28px;
  margin-right: 5px;
  padding: 0 10px;
}
.claimed-span {
  margin-right: 5px;
  color: #8c90a1;
  cursor: default;
}
.no-nft-modal {
  .no-nft-modal-title {
    padding-top: 30px;
  }
  .trading-step-modal-title {
    padding-top: 30px;
    color: #adb3c4;
    font-size: 16px;
  }
  .no-nft-modal-button {
    display: flex;
    justify-content: space-between;
  }
}
.trading-mining {
  color: #1996c4;
  padding: 0 !important;
  border: none !important;
  button {
    height: 26px;
  }
  .trading-mining-status {
    margin-right: 5px;
  }
}
.can-click {
  color: #51b7c3;
  cursor: pointer;
}
.can-trading-mining {
  display: flex;
  align-items: center;
  svg {
    margin-left: 3px;
    margin-bottom: -2px;
    cursor: pointer;
    color: #21c77d;
  }
}
.claim-button {
  height: 36px;
  margin-top: 40px;
}
.trading-mining-item-info {
  display: flex;
  align-items: center;
  span {
    &:first-child {
      width: 240px;
    }
  }
}
.h5-show {
  display: none;
}
.success {
  color: #21c77d;
  cursor: default;
}
.base-font {
  cursor: default;
}
.trading-step-main {
  .ant-steps-item {
    height: 160px;
  }
  .step-button {
    position: absolute;
    bottom: 0;
    /*&.step-button-approval {
			bottom: 46px;
		}*/
  }
  ::v-deep .ant-steps-item-title {
    color: #b4bacd !important;
  }
  ::v-deep .ant-steps-item-process .ant-steps-item-title {
    color: #e7eaf1 !important;
  }
  ::v-deep .ant-steps-item-finish .ant-steps-item-description {
    color: #777d90 !important;
  }
  ::v-deep .ant-steps-item-process .ant-steps-item-description {
    color: #e7eaf1 !important;
  }
  ::v-deep .ant-steps-item-wait .ant-steps-item-description {
    color: #777d90 !important;
  }
  ::v-deep .ant-steps-item-icon {
    width: 30px;
    height: 30px;
    line-height: 30px;
    background: transparent;
  }
  ::v-deep .ant-steps-item-finish .ant-steps-item-icon {
    border-color: #21c77d;
    background: #21c77d;
  }
  ::v-deep .ant-steps-item-process .ant-steps-item-icon {
    border-color: #21c77d;
    background: #21c77d;
  }
  ::v-deep .ant-steps-item-finish .ant-steps-item-title::after {
    background: #21c77d;
  }
  ::v-deep .ant-steps-icon {
    color: #fff;
  }
  ::v-deep .ant-steps-item-wait .ant-steps-item-icon {
    border-color: #777d90;
  }
}
.mining-main {
  display: flex;
  align-items: center;
  height: 26px;
  background: #223a43;
  padding: 5px 8px;
  border-radius: 20px;
  cursor: default;
  color: #8c90a1;
  img {
    width: 14px;
  }
}
@media screen and (max-width: 768px) {
  .h5-show {
    display: block;
  }
  .on-claim-button {
    height: 24px;
  }
  /*.trading-mining-status {
		display: none;
	}*/
  .trading-mining {
    /* todo */
    display: none;
    align-items: center;
    margin-right: 10px;
  }
  .trading-mining-item-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
