<template>
  <div class="trading-mining-main">
    <div class="trading-mining-item">
      <div v-if="setting" class="trading-mining-title">
        {{ setting.title }}
      </div>
      <div class="content-more" v-if="setting">
        <div class="wrap">
          <div ref="infoItem" class="ellipsis" :class="{ more: showMore }">
            <span class="switch-arrow" v-show="hasMoreArrow">
              <span v-show="showMore" @click="showMore = !showMore">fold</span>
              <span v-show="!showMore" @click="showMore = !showMore">more</span>
            </span>
            {{ setting.content }}
          </div>
        </div>
      </div>
      <div class="trading-mining-support">
        <span style="font-weight: bold"
          >Trading pairs with mining support:
        </span>
        <div class="trading-mining-support-list" v-if="setting">
          <span v-for="pair in setting.pairs" :key="pair[0].toString()">
            <span v-if="pairs && pairs[pair[0].toString()]">
              <router-link
                :to="`/ICDex/${getDexRouter(pairs[pair[0].toString()])}`"
              >
                {{ getDexRouter(pairs[pair[0].toString()]) }} (weight:
                {{ pair[1] | filterWeight }})
              </router-link>
            </span>
          </span>
        </div>
      </div>
      <div class="trading-mining-item-info">
        <a-steps
          class="trading-step-main trading-step-main-time"
          v-if="setting"
          :current="currentStepTime"
          :direction="isH5 ? 'vertical' : 'horizontal'"
        >
          <a-step title="Start of registration">
            <span
              slot="icon"
              class="trading-step-main-time-icon"
              :class="{
                unavailable: isAvailable(setting.start),
                end: withdrawEnd
              }"
            ></span>
            <span slot="description">
              <div>Start of mining</div>
              {{ setting.start | formatDateFromNanosecondUTC }}
            </span>
          </a-step>
          <a-step title="End of registration (Start of claim)">
            <a-icon
              v-show="isAvailable(setting.start) && !isAvailable(setting.end1)"
              slot="icon"
              class="clock-circle-o-time"
              type="clock-circle-o"
              :class="{
                err: isAvailable(setting.start) && expire(setting.end1)
              }"
            />
            <span
              v-show="
                !(isAvailable(setting.start) && !isAvailable(setting.end1))
              "
              slot="icon"
              class="trading-step-main-time-icon"
              :class="{
                unavailable: isAvailable(setting.end1),
                end: withdrawEnd
              }"
            ></span>
            <span slot="description">
              {{ setting.end1 | formatDateFromNanosecondUTC }}
            </span>
          </a-step>
          <a-step title="End of claim">
            <a-icon
              v-show="isAvailable(setting.end1) && !isAvailable(setting.end2)"
              slot="icon"
              class="clock-circle-o-time"
              type="clock-circle-o"
              :class="{
                err: isAvailable(setting.end1) && expire(setting.end2)
              }"
            />
            <span
              v-show="
                !(isAvailable(setting.end1) && !isAvailable(setting.end2))
              "
              slot="icon"
              class="trading-step-main-time-icon"
              :class="{
                unavailable: isAvailable(setting.end2),
                end: withdrawEnd
              }"
            ></span>
            <span slot="description">
              <div>End of mining</div>
              {{ setting.end2 | formatDateFromNanosecondUTC }}
            </span>
          </a-step>
        </a-steps>
      </div>
      <div class="trading-mining-item-info">
        <span>Mining ratio:</span>
        <span v-if="setting" class="base-font-title">
          mine 1 ICL per {{ setting.ratio }} ICPs of volume
        </span>
      </div>
      <div class="trading-mining-item-info">
        <span>Mining limit per account:</span>
        <span v-if="setting" class="base-font-title">
          {{ setting.max | bigintToFloat(8, 8) }} ICLs
        </span>
      </div>
      <div v-if="getPrincipalId" class="trading-mining-item-user">
        <div class="trading-mining-item-info">
          <span>Your Status:</span>
          <span v-if="status" class="base-font-title success">Registered</span>
          <span v-else class="base-font-title"
            >Unregistered
            <span v-show="!canRegistered">(Registration not yet open)</span>
          </span>
        </div>
        <div v-if="status">
          <div class="trading-mining-item-info">
            <span>Mined:</span>
            <div>
              <span v-if="canTrade" class="base-color-w"
                >{{ mined | bigintToFloat(8, 8) }}(Est.) ICLs</span
              >
              <span v-else class="base-color-w"
                >{{ status[0][0][2] | bigintToFloat(8, 8) }} ICLs</span
              >
              <button
                type="button"
                @click="onClaim"
                v-if="canClaim"
                class="can-click can-click-claim primary"
              >
                Claim
              </button>
            </div>
          </div>
          <div class="trading-mining-item-info">
            <span>Status:</span>
            <span class="base-font-title">{{ status | filterStatus }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="trading-mining-item trading-mining-item-notes">
      <ul class="trading-step-menu">
        <li
          @click="showStep(true)"
          :class="{
            active: isNft
          }"
        >
          <span class="trading-step-menu-nft">*</span
          ><span class="pc-show">NFT Holders Registration</span
          ><span class="h5-show">NFT Holders</span>
        </li>
        <li
          @click="showStep(false)"
          :class="{
            active: !isNft
          }"
        >
          <span class="pc-show">General Trader Registration</span
          ><span class="h5-show">General Trader</span>
        </li>
      </ul>
      <div v-show="isNft" class="nft-info">
        The
        <a
          href="https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai/"
          target="_blank"
          rel="nofollow noreferrer noopener"
          >ICLighthouse Planet Card NFT </a
        >collection was issued for early supporters and is a participation
        voucher for many of our events and a speed booster for trading mining
        event (NFT holders gain mining speed up).
        <div style="color: #21c77d" v-if="setting">
          ICLighthouse Planet Card holders gain +{{
            Number(setting.nftFactor) - 100
          }}% speedup.
        </div>
      </div>
      <a-steps
        v-show="isNft"
        class="trading-step-main trading-step1-main"
        :current="currentStep"
        :direction="isH5 ? 'vertical' : 'horizontal'"
      >
        <a-step class="trading-step1-description">
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
            <div v-else>
              <div class="trading-step-tokens" v-if="tokensExt.length">
                NFT(<span
                  v-for="(item, index) in tokensExt.slice(0, 2)"
                  :key="index"
                >
                  <a
                    :href="`https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai/${item[0]}`"
                    rel="nofollow noreferrer noopener"
                    target="_blank"
                    >{{ item[0] }}</a
                  ><span v-show="index === 0 && tokensExt.length > 1"
                    >,</span
                  > </span
                ><span v-if="tokensExt.length > 2">...</span>)
              </div>
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
              :disabled="
                !canApprove ||
                currentStep !== 1 ||
                (status && status[0] && !status[1])
              "
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
              :disabled="
                !canRegister ||
                currentStep !== 2 ||
                (status && status[0] && !status[1])
              "
              type="button"
              class="primary step-button"
              @click="tmRegister"
            >
              Register
            </button>
          </span>
        </a-step>
        <a-step>
          <template slot="title">Trading</template>
          <span slot="description">
            <router-link
              v-if="
                setting &&
                pairs &&
                setting.pairs[0] &&
                pairs[setting.pairs[0][0].toString()] &&
                currentStep === 3
              "
              to="/ICDex"
              >Go trading on ICDex.
            </router-link>
            <span v-show="currentStep !== 3">Go trading on ICDex.</span>
          </span>
        </a-step>
        <a-step>
          <template slot="title">Claim</template>
          <span slot="description">
            Claim mining reward(ICLs) during the period of mining reward
            withdrawals.
            <button
              :disabled="
                !canClaim ||
                currentStep !== 4 ||
                (status && status[0] && !status[1])
              "
              type="button"
              class="primary step-button"
              @click="onClaim"
            >
              Claim
            </button>
          </span>
        </a-step>
      </a-steps>
      <a-steps
        v-show="!isNft"
        class="trading-step-main trading-step2-main"
        :current="currentStep1"
        :direction="isH5 ? 'vertical' : 'horizontal'"
      >
        <a-step>
          <template slot="title">Register</template>
          <span slot="description">
            Register for trading mining during the period of registration.
            <button
              v-show="getPrincipalId"
              :disabled="
                !canRegistered ||
                currentStep1 !== 0 ||
                (status && status[0] && status[1])
              "
              type="button"
              class="primary step-button"
              @click="register1"
            >
              Register
            </button>
          </span>
        </a-step>
        <a-step>
          <template slot="title">Trading</template>
          <span slot="description">
            <router-link
              v-if="
                setting &&
                pairs &&
                setting.pairs[0] &&
                pairs[setting.pairs[0][0].toString()] &&
                currentStep1 === 1
              "
              to="/ICDex"
              >Go trading on ICDex.
            </router-link>
            <span v-show="currentStep1 !== 1">Go trading on ICDex.</span>
          </span>
        </a-step>
        <a-step>
          <template slot="title">Claim</template>
          <span slot="description">
            Claim mining reward(ICLs) during the period of mining reward
            withdrawals.
            <button
              :disabled="
                !canClaim ||
                currentStep1 !== 2 ||
                (status && status[0] && status[1])
              "
              type="button"
              class="primary step-button"
              @click="onClaim"
            >
              Claim
            </button>
          </span>
        </a-step>
      </a-steps>
      <!--<div class="trading-img">
				<img src="@/assets/img/trading.png" alt="" />
			</div>-->
    </div>
    <div v-show="getPrincipalId" class="trading-mining-item">
      <p>
        The NFT will be locked in the mining contract and cannot be withdrawn
        during the mining period, it will be withdrawn automatically when the
        mining reward is claimed. If the NFT is still in the contract after
        mining has ended, you can withdraw it manually.
        <button
          type="button"
          @click="onWithdraw"
          v-if="canWithdraw"
          class="can-click primary can-click-withdraw"
        >
          withdraw
        </button>
      </p>
    </div>
    <approve-nft
      ref="approveNft"
      :tokens-ext="tokensExt"
      @approveSuccess="approveSuccess"
    ></approve-nft>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IcMiningService } from '@/ic/icMining/icMiningService';
import {
  TmNFTBalance,
  TradingMining,
  TradingMiningPairs,
  TradingMiningStatus
} from '@/ic/icMining/model';
import { DexInfo } from '@/ic/ICSwap/model';
import BigNumber from 'bignumber.js';
import { namespace } from 'vuex-class';
import { NftService } from '@/ic/nft/Service';
import { AllowanceRequest, TokensExt } from '@/ic/nft/model';
import { isPlug } from '@/ic/isPlug';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  getTokenIdentifier,
  principalToAccountIdentifier
} from '@/ic/converter';
import { IC_MINING_CANISTER_ID, NFT_CANISTER_ID } from '@/ic/utils';
import { Principal } from '@dfinity/principal';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import ApproveNft from '@/components/approveNFT/Index.vue';
import { connectIcx } from '@/ic/connectIcx';
import { checkAuth } from '@/ic/CheckAuth';
import { isInfinity } from '@/ic/isInfinity';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';

const commonModule = namespace('common');

@Component({
  name: 'TradingMining',
  components: {
    ApproveNft
  },
  filters: {
    filterWeight(val: bigint): string {
      if (val || val.toString()) {
        return new BigNumber(val.toString(10))
          .div(1000)
          .decimalPlaces(2)
          .toString(10);
      }
      return '';
    },
    filterStatus(val: TradingMiningStatus): string {
      if (val && val[0] && val[0][0]) {
        return Object.keys(val[0][0][3])[0];
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private tradingMiningService: IcMiningService;
  private setting: TradingMining = null;
  private pairs: { [key: string]: DexInfo } = {};
  private status: TradingMiningStatus = null;
  private NftService: NftService = null;
  private tokensExt: TokensExt = [];
  private tmNFTBalance: TmNFTBalance = null;
  private hasAllowance = false;
  private volume = '0';
  private mined = '0';
  private currentStep = 0;
  private currentStep1 = 0;
  private currentStepTime = -1;
  private haveNft = true;
  private isNft = true;
  private hasMoreArrow = false;
  private showMore = false;
  private isH5 = false;
  get canRegister(): boolean {
    let flag = false;
    const time = new Date().getTime();
    if (
      this.setting &&
      new BigNumber(time).times(1000000).gt(this.setting.start.toString(10)) &&
      new BigNumber(time).times(1000000).lt(this.setting.end1.toString(10))
    ) {
      if (
        this.hasAllowance &&
        (!this.tmNFTBalance || (this.tmNFTBalance && !this.tmNFTBalance.length))
      ) {
        flag = true;
      }
      if (flag) {
        if (!this.status) {
          this.currentStep = 2;
          this.currentStep1 = 0;
        }
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
      if (flag && !this.status) {
        this.currentStep = 1;
      }
    }
    return flag;
  }

  get canWithdraw(): boolean {
    let flag = false;
    if (this.tmNFTBalance && this.tmNFTBalance.length) {
      if (!this.status) {
        flag = true;
      }
      const time = new Date().getTime();
      console.log(time);
      if (
        this.setting &&
        (new BigNumber(time)
          .times(1000000)
          .gt(this.setting.end2.toString(10)) ||
          new BigNumber(time)
            .times(1000000)
            .lt(this.setting.start.toString(10)))
      ) {
        flag = true;
      }
    }
    return flag;
  }

  get canRegistered(): boolean {
    let flag = false;
    if (this.setting) {
      console.log(this.setting);
      const time = new Date().getTime();
      if (
        new BigNumber(time)
          .times(1000000)
          .gt(this.setting.start.toString(10)) &&
        new BigNumber(time).times(1000000).lt(this.setting.end1.toString(10))
      ) {
        flag = true;
      }
      if (!flag && !this.status) {
        this.currentStep1 = -1;
        this.currentStep = -1;
      }
    }
    return flag;
  }

  get canTrade(): boolean {
    let flag = false;
    if (this.status && this.setting) {
      if (Object.keys(this.status[0][0][3])[0] === 'Active') {
        const time = new Date().getTime();
        if (
          new BigNumber(time)
            .times(1000000)
            .gt(this.setting.start.toString(10)) &&
          new BigNumber(time).times(1000000).lt(this.setting.end2.toString(10))
        ) {
          flag = true;
        }
      }
      const currentStatus = Object.keys(this.status[0][0][3])[0];
      if (currentStatus === 'Active' && flag) {
        if (this.haveNft) {
          this.currentStep = 3;
        } else {
          this.currentStep1 = 1;
        }
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
        const currentStatus = Object.keys(this.status[0][0][3])[0];
        if (currentStatus === 'Active' && flag) {
          if (this.status) {
            if (this.haveNft) {
              this.currentStep = 4;
            } else {
              this.currentStep1 = 2;
            }
          }
        }
      }
    }
    console.log(flag);
    return flag;
  }

  get withdrawBefore(): boolean {
    let flag = false;
    const time = new Date().getTime();
    if (
      this.setting &&
      new BigNumber(time).times(1000000).lt(this.setting.end1.toString(10)) &&
      new BigNumber(time).times(1000000).gt(this.setting.start.toString(10))
    ) {
      flag = true;
    }
    return flag;
  }

  get withdrawing(): boolean {
    let flag = false;
    const time = new Date().getTime();
    if (
      this.setting &&
      new BigNumber(time).times(1000000).gt(this.setting.end1.toString(10)) &&
      new BigNumber(time).times(1000000).lt(this.setting.end2.toString(10))
    ) {
      flag = true;
    }
    return flag;
  }

  get withdrawEnd(): boolean {
    let flag = false;
    const time = new Date().getTime();
    if (
      this.setting &&
      new BigNumber(time).times(1000000).gt(this.setting.end2.toString(10))
    ) {
      flag = true;
    }
    return flag;
  }
  created(): void {
    this.tradingMiningService = new IcMiningService();
    this.NftService = new NftService();
    this.getTmSetting();
    this.init();
    window.addEventListener('resize', this.getWidth);
    const width = document.documentElement.clientWidth;
    this.isH5 = width < 1000;
  }
  beforeDestroy(): void {
    window.removeEventListener('resize', this.getWidth);
  }
  private getWidth(): void {
    const width = document.documentElement.clientWidth;
    this.isH5 = width < 1000;
  }
  private init(): void {
    this.getTokensExt();
    this.getTmNFTBalance();
    this.getAllowance();
  }
  private showStep(haveNft: boolean) {
    this.isNft = haveNft;
  }
  private expire(time: bigint): boolean {
    let flag = false;
    const currentTime = new Date().getTime();
    if (new BigNumber(currentTime).times(1000000).lt(time.toString(10))) {
      const day = 24 * 60 * 60 * 1000;
      if (
        new BigNumber(time.toString(10)).div(1000000).minus(day).lt(currentTime)
      ) {
        flag = true;
      }
    }
    return flag;
  }

  private isAvailable(time: bigint): boolean {
    let flag = false;
    const currentTime = new Date().getTime();
    if (new BigNumber(time.toString(10)).div(1000000).lt(currentTime)) {
      flag = true;
    }
    return flag;
  }

  private async getLiquidity(swapId: string, weight: bigint): Promise<string> {
    const principal = localStorage.getItem('principal');
    let volume = '0';
    if (principal) {
      try {
        const currentICDexService = new ICDexService();
        const res = await currentICDexService.liquidity(swapId, [principal]);
        console.log(res);
        if (res && res.pairId === swapId) {
          volume = new BigNumber(res.tokenLiquidity.vol.value1.toString(10))
            .times(weight.toString(10))
            .div(1000)
            .toString(10);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return volume;
  }

  private async getTmNFTBalance(): Promise<void> {
    if (this.getPrincipalId) {
      this.tmNFTBalance = await this.tradingMiningService.tmNFTBalance(
        this.getPrincipalId
      );
      console.log(this.tmNFTBalance);
    }
  }

  private async onClaim(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const res = await this.tradingMiningService.tmClaim();
      console.log(res);
      this.$message.success('Claim success');
      this.getTmNFTBalance();
      this.getStatus();
    } catch (e) {
      console.error(e);
      this.$message.success('Claim error');
    }
    loading.close();
  }

  private async onWithdraw(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      await this.tradingMiningService.tmNFTWithdraw();
      this.$message.success('Withdraw success');
      this.getTmSetting();
      this.getTmNFTBalance();
      this.getAllowance();
      setTimeout(() => {
        this.getTokensExt();
      }, 10 * 1000);
    } catch (e) {
      console.error(e);
      this.$message.success('Withdraw error');
    }
    loading.close();
  }

  private async tmRegister(): Promise<void> {
    if (this.getPrincipalId) {
      await checkAuth();
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      try {
        const nftId = localStorage.getItem('approveNft');
        const res = await this.tradingMiningService.tmRegister(
          getTokenIdentifier(NFT_CANISTER_ID, Number(nftId))
        );
        console.log(res);
        if (res) {
          this.$message.success('Register success');
          localStorage.removeItem('approveNft');
          this.getTmNFTBalance();
          this.getStatus();
        } else {
          this.$message.error('Register error');
        }
      } catch (e) {
        console.error(e);
        this.$message.error('Register error');
      }
      loading.close();
    }
  }
  private async register1(): Promise<void> {
    if (this.getPrincipalId) {
      await checkAuth();
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      try {
        const res = await this.tradingMiningService.tmRegister2();
        console.log(res);
        if (res) {
          this.$message.success('Register success');
          this.getStatus();
        } else {
          this.$message.error('Register error');
        }
      } catch (e) {
        console.error(e);
        this.$message.error('Register error');
      }
      loading.close();
    }
  }

  private async getAllowance(): Promise<void> {
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
      console.log(res);
      if ((res as { ok: bigint }).ok) {
        this.hasAllowance = true;
      }
    }
    console.log(this.hasAllowance);
  }

  private approveSuccess(): void {
    this.getAllowance();
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
        console.log(tokensExt);
      } else {
        this.tokensExt = [];
      }
    }
  }

  private async getTmSetting(): Promise<void> {
    this.setting = await this.tradingMiningService.tmSetting();
    this.$nextTick(() => {
      let cellChild = (this.$refs as any).infoItem;
      console.log(cellChild.scrollHeight, cellChild.offsetHeight);
      this.hasMoreArrow = cellChild.scrollHeight > cellChild.offsetHeight;
    });
    const pairIds: Array<string> = [];
    this.setting.pairs.forEach((pair: TradingMiningPairs) => {
      pairIds.push(pair[0].toString());
    });
    await checkAuth();
    const flag = needConnectPlug(pairIds);
    const connectInfinity = await needConnectInfinity(pairIds);
    if (isPlug() && flag) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      // const h = this.$createElement;
      this.$info({
        content: 'Trading mining need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(pairIds).then(async () => {
            _that.init();
            pairIds.forEach((pair) => {
              _that.getDexInfo(pair);
            });
          });
        }
      });
    } else if (isInfinity() && connectInfinity) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      // const h = this.$createElement;
      this.$info({
        content: 'Trading mining need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity(pairIds).then(async () => {
            _that.init();
            pairIds.forEach((pair) => {
              _that.getDexInfo(pair);
            });
          });
        }
      });
    } else {
      if ((window as any).icx) {
        console.log('connectIcx');
        const icxCanisterIds: Array<string> =
          JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
        const newIcxCanisterIds: Array<string> = [
          ...new Set([...icxCanisterIds, ...pairIds])
        ];
        localStorage.setItem(
          'icxCanisterIds',
          JSON.stringify(newIcxCanisterIds)
        );
        await connectIcx(newIcxCanisterIds);
      }
      this.init();
      pairIds.forEach((pair) => {
        this.getDexInfo(pair);
      });
    }
    this.getStatus();
    console.log(this.setting);
    const time = new Date().getTime();
    if (
      this.setting &&
      new BigNumber(time).times(1000000).lt(this.setting.start.toString(10))
    ) {
      this.currentStep = -1;
      this.currentStep1 = -1;
    }
    if (this.setting) {
      if (
        new BigNumber(time).times(1000000).gt(this.setting.end2.toString(10))
      ) {
        this.currentStepTime = -1;
      }
      if (
        new BigNumber(time).times(1000000).lt(this.setting.start.toString(10))
      ) {
        this.currentStepTime = 0;
      }
      if (
        new BigNumber(time)
          .times(1000000)
          .gt(this.setting.start.toString(10)) &&
        new BigNumber(time).times(1000000).lt(this.setting.end1.toString(10))
      ) {
        this.currentStepTime = 1;
      }
      if (
        new BigNumber(time).times(1000000).gt(this.setting.end1.toString(10)) &&
        new BigNumber(time).times(1000000).lt(this.setting.end2.toString(10))
      ) {
        this.currentStepTime = 2;
      }
    }
    console.log(this.currentStep);
  }

  private async getDexInfo(pairId: string): Promise<void> {
    console.log('getDexInfo');
    const currentICDexService = new ICDexService();
    const res = await currentICDexService.drc205_dexInfo(pairId);
    if (res && res.pairId === pairId) {
      this.$set(this.pairs, pairId, res.dexInfo);
    }
    console.log(res);
  }

  private getDexRouter(pair: DexInfo): string {
    if (pair.pairName.includes('icdex:')) {
      return pair.pairName.split('icdex:')[1].trim();
    }
    if (pair.pairName.includes('icdex')) {
      return pair.pairName.split('icdex')[1].trim();
    }
    return pair.pairName;
  }

  private async getStatus(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const status = await this.tradingMiningService.tmStatus(principal);
      console.log(status);
      if (status && status[0] && status[0].length) {
        this.status = status;
        console.log(this.status);
        this.haveNft = this.status[1];
        this.isNft = this.haveNft;
        if (this.haveNft) {
          this.currentStep1 = -1;
        } else {
          this.currentStep = -1;
        }
        const currentStatus = Object.keys(this.status[0][0][3])[0];
        if (currentStatus === 'Finished') {
          if (this.haveNft) {
            this.currentStep = 5;
          } else {
            this.currentStep1 = 3;
          }
        }
        if (currentStatus === 'Active') {
          const promiseAll = [];
          this.setting.pairs.forEach((pair: TradingMiningPairs) => {
            promiseAll.push(this.getLiquidity(pair[0].toString(), pair[1]));
          });
          const res = await Promise.all(promiseAll);
          console.log(res);
          let totalVolume = '0';
          res.forEach((volume: string) => {
            if (volume) {
              totalVolume = new BigNumber(volume)
                .plus(totalVolume)
                .toString(10);
            }
          });
          console.log(totalVolume);
          this.volume = totalVolume;
          let speed = 100;
          if (this.haveNft) {
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
    console.log(this.currentStep, this.currentStep1);
    console.log(this.status);
  }
}
</script>

<style scoped lang="scss">
.wrap {
  display: flex;
  position: relative;
  overflow: hidden;
}
.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  word-break: break-all;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  &::before {
    content: '';
    float: right;
    width: 0;
    height: 100%;
    margin-bottom: -21px;
  }
  &.more {
    display: block;
    text-overflow: initial;
  }
  .switch-arrow {
    float: right;
    clear: both;
    color: #166a89;
    cursor: pointer;
  }
}
.nft-info {
  margin-top: 25px;
}
.trading-step-menu {
  display: flex;
  align-items: center;
  width: 474px;
  height: 54px;
  padding: 7px;
  background: #232730;
  border-radius: 30px;
  .trading-step-menu-nft {
    margin-right: 2px;
    color: #d13651;
  }
  li {
    display: flex;
    height: 40px;
    width: 230px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 20px;
    &.active {
      background: #3899a4;
      color: #e7eaee;
    }
    &.step-disabled {
      cursor: default;
    }
  }
}

.trading-step-main {
  margin-top: 30px;
  &.trading-step-main-time {
    margin: 0 0 20px 0;
    ::v-deep .ant-steps-icon {
      top: -4px;
    }
    ::v-deep .ant-steps-item-icon {
      border-color: transparent !important;
      background: transparent !important;
    }
    .clock-circle-o-time {
      font-size: 16px;
      color: #21c77d;
      &.err {
        color: #d13651;
      }
    }
    .trading-step-main-time-icon {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background: #777d90;
      &.unavailable {
        background: #21c77d;
      }
      &.end {
        background: #777d90;
      }
    }
    ::v-deep .ant-steps-item-description {
      max-width: none;
    }
    .ant-steps-item {
      height: auto;
    }
  }
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
  .trading-step-tokens {
    position: absolute;
    bottom: 0;
    height: 30px;
    line-height: 30px;
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
  ::v-deep .ant-steps-item-finish .ant-steps-item-tail::after {
    background: #21c77d;
  }

  ::v-deep .ant-steps-icon {
    color: #fff;
  }

  ::v-deep .ant-steps-item-wait .ant-steps-item-icon {
    border-color: #777d90;
  }
}
.trading-mining-nft {
  font-size: 18px;
  color: #51b7c3;
}

.trading-mining-item {
  background: #141b23;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px 30px;
  color: #8c98a5;
  line-height: 1.5;

  a {
    color: #166a89;
  }

  .trading-mining-title {
    color: #adb7c2;
    font-size: 30px;
  }

  .trading-mining-item-title {
    margin-top: 20px;
    color: #adb7c2;
    font-size: 15px;
  }
}

.trading-mining-support {
  margin: 20px 0 5px;
}

.trading-mining-item-info {
  display: flex;
  align-items: center;
  ::v-deep .ant-timeline-item-content {
    min-height: auto;
  }
  .nft-logo {
    width: 20px;
    margin: 0 5px 0 10px;
  }
  span {
    &:first-child {
      width: 240px;
    }
  }
}

.trading-mining-item-user {
  margin-top: 20px;
}

.trading-mining-nft-info {
  padding-left: 1em;
}

.success {
  color: #21c77d;
}

.err {
  color: #d13651;
}

.coming {
  color: rgba(33, 199, 125, 0.7);
}

.withdrawing {
  color: rgba(209, 54, 81, 0.7);
}

.can-click {
  display: inline-block;
  width: auto;
  padding: 0 15px;
  height: 28px;
  cursor: pointer;
}

.trading-img {
  margin-top: 20px;

  img {
    object-fit: contain;
    width: 80%;
  }
}

.unavailable {
  color: #777d90;
}

.trading-mining-item-notes {
  font-size: 15px;
}

.trading-mining-support-list {
  display: flex;
  align-items: flex-start;
  line-height: 1.8;
  flex-wrap: wrap;
  margin-bottom: 20px;
  > span {
    display: flex;
    width: 227px;
    height: 40px;
    align-items: center;
    justify-content: center;
    background: #19212a;
    border: 1px solid #121921;
    margin-right: 10px;
    margin-top: 10px;
    border-radius: 5px;
    &:nth-child(4n) {
      margin-right: 0;
    }
  }
}
.can-click-withdraw {
  width: 100px;
  margin: 5px;
}
.trading-step2-main {
  width: 60%;
}
.h5-show {
  display: none;
}
.pc-show {
  display: inline-block;
}
@media screen and (max-width: 1000px) {
  .h5-show {
    display: inline-block;
  }
  .pc-show {
    display: none;
  }
  .trading-step-menu {
    width: 100%;
    max-width: 474px;
  }
  .trading-step2-main {
    width: 100%;
  }
  .trading-mining-main {
    margin: 0 15px 20px;

    .trading-mining-item-info {
      flex-direction: column;
      align-items: flex-start;
    }
    .trading-mining-title {
      font-size: 20px;
    }
  }
  .trading-img {
    img {
      width: 100%;
    }
  }
  .trading-step-main .ant-steps-item {
    height: 130px;
  }
  .nft-logo-tip {
    margin-bottom: 5px;
    .nft-logo {
      margin-left: 0;
    }
  }
}

@media screen and (max-width: 768px) {
  .h5-show {
    display: inline-block;
  }
  .pc-show {
    display: none;
  }
  .trading-step-menu {
    width: 100%;
    max-width: 474px;
  }
}
.can-click-claim {
  width: 100px;
  margin-left: 20px;
}
</style>
