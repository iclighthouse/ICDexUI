<template>
  <div>
    <span
      @click="showLaunch"
      class="base-font-title pointer pc-show"
      style="font-size: 15px"
    >
      Token Listing
    </span>
    <a-dropdown
      placement="bottomCenter"
      v-if="getPrincipalId"
      :trigger="['click']"
    >
      <span
        class="base-font-title pointer pc-show"
        v-show="currentLaunches.length"
        >({{ currentLaunches.length }})</span
      >
      <a-menu class="user-setting" slot="overlay">
        <a-menu-item @click="showPromote = true"> How to promote </a-menu-item>
        <a-menu-item
          v-for="item in currentLaunches"
          :key="item"
          style="color: #51b7c3"
          @click="jump(item)"
        >
          <span style="color: #51b7c3">
            {{ item.split('&')[1] }}
          </span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <span
      class="pointer"
      style="margin: 0 8px; color: #adb3c4 !important"
      @click="showGuide"
      ><a-icon type="question-circle"
    /></span>
    <a-modal
      v-model="showPromote"
      centered
      title="How to promote trading pair"
      width="800px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal"
    >
      <vue-markdown class="markdown-info" :source="promoteInfo"></vue-markdown>
    </a-modal>
    <a-modal
      v-model="visible"
      centered
      title="Launch a new trading pair"
      width="800px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal"
      :after-close="afterClose"
    >
      <a-form-model class="mt20" ref="form" :model="form" :rules="formRules">
        <a-form-model-item
          class="launch-form-token0"
          label="Base token (token0)"
          prop="token0"
        >
          <a-input
            v-model="form.token0"
            autocomplete="off"
            type="text"
            placeholder="Base token (token0)"
            @change="tokenChange(form.token0)"
          />
          <div class="token-info" v-show="token0Info.name">
            {{ token0Info.name }}(<span v-show="token0Info.symbol">{{
              token0Info.symbol
            }}</span
            >)
            <span v-show="token0Info.standard">{{ token0Info.standard }}</span>
          </div>
        </a-form-model-item>
        <a-form-model-item label="Quote token (token1)" prop="token1">
          <a-input
            v-model="form.token1"
            autocomplete="off"
            type="text"
            placeholder="Quote token (token1)"
            @change="tokenChange(form.token1)"
          />
          <div class="token-info" v-show="token1Info.name">
            {{ token1Info.name }}(<span v-show="token1Info.symbol">{{
              token1Info.symbol
            }}</span
            >)
            <span v-show="token1Info.standard">{{ token1Info.standard }}</span>
          </div>
        </a-form-model-item>
        <a-form-model-item
          class="setting-item"
          label="Opening time"
          prop="time"
        >
          <a-date-picker
            style="width: 100%"
            v-model="form.time"
            :disabled-date="disabledDate"
            :show-time="{ defaultValue: showTimeDefaultValue() }"
            placeholder="Select opening time"
          />
          <div class="base-font" style="padding-top: 5px">
            If an IDO needs to be initiated, it is recommended that at least 4
            days be set aside.
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            class="primary large-primary w100 mt20"
            @click="onSubmit"
          >
            Launch<span v-if="sysConfig"
              >(fee:
              {{ sysConfig.creatingPairFee | bigintToFloat(8, 8) }} ICL)</span
            >
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <approve-modal
      :isICLToken="true"
      :decimals="8"
      :icl-token-amount="iclTokenAmount"
      approve-mode="icrc1"
      ref="approve"
      @approveSuccess="approveSuccess"
    ></approve-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import {
  IC_DEX_ROUTER_CANISTER_ID,
  LEDGER_CANISTER_ID,
  validatePrincipal
} from '@/ic/utils';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { SysConfig } from '@/ic/ICDexRouter/model';
import { checkAuth } from '@/ic/CheckAuth';
import { Principal } from '@dfinity/principal';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { TokenInfo } from '@/ic/common/icType';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';
import ApproveModal from '@/components/approve/Index.vue';
import { namespace } from 'vuex-class';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { readState } from '@/ic/readState';
import { getCandidInterfaceTmpHack } from '@/ic/getCandidInterfaceTmpHack';
import { toHttpRejectError } from '@/ic/httpError';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';

const commonModule = namespace('common');

@Component({
  name: 'Launch',
  components: {
    ApproveModal
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @Prop({ type: Object, default: () => null })
  private tokens!: { [key: string]: TokenInfo };
  private ICDexRouterService: ICDexRouterService = null;
  private DRC20TokenService: DRC20TokenService = null;
  private SNSWasmService: SNSWasmService = null;
  private SNSTokens: Array<string> = [];
  private sysConfig: SysConfig = null;
  private iclTokenAmount = null;
  private visible = false;
  private form = {
    token0: '',
    token1: '',
    time: null
  };
  private formRules = {
    token0: [
      {
        required: true,
        message: 'Please enter base token.',
        trigger: 'change'
      },
      { validator: this.validateToken, trigger: 'change' }
    ],
    token1: [
      {
        required: true,
        message: 'Please enter quote token.',
        trigger: 'change'
      },
      { validator: this.validateToken, trigger: 'change' }
    ],
    time: [
      {
        required: true,
        message: 'Please select opening time.',
        trigger: 'change'
      },
      { validator: this.validateTime, trigger: 'change' }
    ]
  };
  private token0Info = {
    tokenId: '',
    name: '',
    symbol: '',
    standard: '',
    controllers: []
  };
  private token1Info = {
    tokenId: '',
    name: '',
    symbol: '',
    standard: '',
    controllers: []
  };
  private validateTime(
    rule: ValidationRule,
    value: moment.Moment,
    callback: (arg0?: string) => void
  ): void {
    if (value) {
      const endTime = new BigNumber(value.valueOf());
      const now = new Date().getTime() + 60 * 1000;
      if (new BigNumber(endTime).lt(now)) {
        callback('The opening time must be set to a future time.');
      } else {
        callback();
      }
    }
  }
  private async validateToken(
    rule,
    value: string,
    callback: (arg0?: string) => void
  ): Promise<void> {
    this.initTokenInfo(value);
    console.log(rule);
    if (value) {
      if (!validatePrincipal(value)) {
        callback('invalid principal');
      } else {
        const flag = await this.getTokenStandard(value);
        if (flag) {
          if (rule.field === 'token0') {
            if (
              this.token0Info.standard === 'ICRC1' &&
              (this.SNSTokens.includes(value) || value === LEDGER_CANISTER_ID)
            ) {
              const hasAccount = this.token0Info.controllers.some((item) => {
                return validatePrincipal(item) && item.length === 63;
              });
              if (
                hasAccount ||
                this.token0Info.controllers.includes(
                  'igm6s-dqaaa-aaaar-qaa3a-cai'
                ) ||
                this.token0Info.controllers.includes(
                  'y2b5k-gqaaa-aaaak-aacqq-cai'
                )
              ) {
                callback(
                  'The token should be controlled by a DAO or have no controller in order to be listed on ICDex.'
                );
              } else {
                callback();
              }
            } else {
              if (this.token0Info.standard === 'DRC20') {
                try {
                  await this.DRC20TokenService.drc202_events(value);
                  const hasAccount = this.token0Info.controllers.some(
                    (item) => {
                      return validatePrincipal(item) && item.length === 63;
                    }
                  );
                  if (
                    hasAccount ||
                    this.token0Info.controllers.includes(
                      'igm6s-dqaaa-aaaar-qaa3a-cai'
                    ) ||
                    this.token0Info.controllers.includes(
                      'y2b5k-gqaaa-aaaak-aacqq-cai'
                    )
                  ) {
                    callback(
                      'The token should be controlled by a DAO or have no controller in order to be listed on ICDex.'
                    );
                  } else {
                    callback();
                  }
                } catch (e) {
                  console.log(e);
                  callback(' ');
                  this.$nextTick(() => {
                    const dom = document.querySelector(
                      '.launch-form-token0 .ant-form-explain'
                    );
                    dom.innerHTML = `In order to meet the requirement for transparency of the token's transaction records, the token should implement the <a href="https://github.com/iclighthouse/DRC_standards/tree/main/DRC202"  target="_blank">DRC202</a> standard, or implemented the query method get_transactions. Otherwise it cannot be listed on ICDex.`;
                  });
                }
              } else {
                if (this.token0Info.standard === 'ICRC1') {
                  const params = await getCandidInterfaceTmpHack(value);
                  console.log(params);
                  if (params.get_transactions) {
                    const hasAccount = this.token0Info.controllers.some(
                      (item) => {
                        return validatePrincipal(item) && item.length === 63;
                      }
                    );
                    if (
                      hasAccount ||
                      this.token0Info.controllers.includes(
                        'igm6s-dqaaa-aaaar-qaa3a-cai'
                      ) ||
                      this.token0Info.controllers.includes(
                        'y2b5k-gqaaa-aaaak-aacqq-cai'
                      )
                    ) {
                      callback(
                        'The token should be controlled by a DAO or have no controller in order to be listed on ICDex.'
                      );
                    } else {
                      callback();
                    }
                  } else {
                    callback(' ');
                    this.$nextTick(() => {
                      const dom = document.querySelector(
                        '.launch-form-token0 .ant-form-explain'
                      );
                      dom.innerHTML = `In order to meet the requirement for transparency of the token's transaction records, the token should implement the <a href="https://github.com/iclighthouse/DRC_standards/tree/main/DRC202"  target="_blank">DRC202</a> standard, or implemented the query method get_transactions. Otherwise it cannot be listed on ICDex.`;
                    });
                  }
                }
              }
            }
          } else {
            callback();
          }
          callback();
        } else {
          callback('ICDex only supports ICRC1 or DRC20 standards.');
        }
      }
    } else {
      callback();
    }
  }
  private currentLaunches: Array<string> = [];
  private showPromote = false;
  private promoteInfo = '';
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  created(): void {
    this.DRC20TokenService = new DRC20TokenService();
    this.ICDexRouterService = new ICDexRouterService();
    this.SNSWasmService = new SNSWasmService();
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.getSysConfig();
    this.getSNSTokens();
    this.getCurrentLaunches();
  }
  private showGuide(): void {
    (this.$info as any)({
      title: 'Listing Your Token on ICDex: A Step-by-Step Process',
      content: (h) => {
        return h(
          'a',
          {
            attrs: {
              href: 'https://medium.com/@ICLighthouse/a-guide-to-listing-tokens-on-icdex-25e1efae1471',
              target: '_blank'
            },
            style: {
              color: '#1996c4'
            }
          },
          'https://medium.com/@ICLighthouse/a-guide-to-listing-tokens-on-icdex-25e1efae1471'
        );
      },
      class:
        'connect-plug register-mining-confirm register-mining-confirm-hide-button',
      icon: 'connect-plug',
      centered: true,
      closable: true
    });
  }
  private getCurrentLaunches(): void {
    if (this.getPrincipalId) {
      const launches = JSON.parse(localStorage.getItem('launches')) || {};
      if (
        launches[this.getPrincipalId] &&
        launches[this.getPrincipalId].length
      ) {
        this.currentLaunches = launches[this.getPrincipalId];
        this.promoteInfo = `

### **1. Introduction to Pair Score**

Pair Score serves as ICDex’s proprietary evaluation mechanism for trading pairs, assessing factors such as sponsorship, liquidity, and trading volume. A superior Pair

Score elevates a pair’s listing position, enhancing visibility among traders. Trading pairs are stratified into three categories based on their Pair Score:

**TOP** (STAGE2): Signifies extensive trader engagement.

**RISING** (STAGE1): Indicates moderate trader participation.

**HIGH RISK** (STAGE0): Reflects limited engagement and heightened risks.

**Upgrade Criteria**

Trading pairs on ICDex are systematically classified based on their Pair Score, which influences their visibility and accessibility to traders. Initially, all new trading pairs are assigned to **HIGH RISK (STAGE0)**, indicating the starting level.Progression through the levels is determined as follows:

**To RISING (STAGE1)**: A trading pair must achieve a Pair Score of 20 or higher.

**To TOP (STAGE2)**: A trading pair needs to maintain a Pair Score of 60 or above for a minimum duration of one month.

**Downgrade Criteria**

To maintain the integrity and competitiveness of the trading environment, trading pairs are subject to downgrade if their performance declines:

**From TOP to RISING:** If a pair’s score falls below 50 and remains there for over three months.

**From RISING to HIGH RISK:** Should a pair’s score drop below 15 and stay there for more than three months.

**Sponsorship Rules**

ICLighthouse **URANUS NFT holders**, acting as listing referrers, play a pivotal role in influencing the Pair Score through sponsorships. The impact of sponsorship varies based on the status of the sponsor and the number of sponsors involved:

**Unverified Listing Referrer Sponsor**: Each sponsorship adds +10 to the Pair Score.

**Verified Listing Referrer Sponsor**: Each verified sponsorship contributes +15 to the Pair Score.

**Group Sponsorship Bonus**: If a trading pair is supported by 5 or more sponsors, it receives an additional +10 to its Pair Score.

**Maximum Sponsorship Influence**: The total score a pair can gain from sponsorships alone is capped at 70.

### **2. Enhancing Your Pair Score**

**2.1. Boosting Engagement and Trading Volume**

Increasing your trading pair’s visibility and activity is pivotal for elevating its Pair Score. Implement these community- centric strategies to engage users and stimulate trading volume:

**Leverage the Referral Program:** Encourage community participation by utilizing the trading pair’s referral link available on the pair’s “Referral" page. This enables traders to share their unique link, attracting new users and tracking trade volumes generated by their referrals. For assistance, the ICLighthouse team is ready to support.

**Organize Trading Mining Events:** Partner with ICDex to host events where participants earn token rewards based on their trading volume over a defined period. Such initiatives boost engagement and liquidity.

**Host Trading Competitions:** Collaborate with ICDex to organize competitions, rewarding traders based on profit margins. This encourages active and strategic trading.

**Implement Strategic Orders:** Utilize advanced trading strategies, such as Iceberg, Grid, TWAP, and VWAP orders, to enhance volume and market presence.

**Deploy ICDex-Trader:**

Expand the capabilities of ICDex-Trader, available at https://github.com/iclighthouse/ICDex-Trader, into a comprehensive trading robot to automate and optimize trading strategies.

**2.2. Improving Order Book Liquidity**

Creating Orderbook Automated Market Making Pools (OAMM) Pools on ICDex is easy, combining traditional pool benefits with new

features for more gains. Here’s how to do it quickly.

1. **EstablishOAMMPools:** Visit https://iclight.io/ICDex/pools to create an Orderbook Automated Market Making Pool (OAMM Pool) for your trading pair and obtain its canister-id. Initiating an OAMM Pool incurs a fee of 500 ICL, reduced to 50 ICL for holders of NEPTUNE, URANUS, or SATURN NFTs.

2. **SecureVip-Maker Status:** To enhance your OAMM pool on ICDex, consider inviting NEPTUNE NFT holders for a VIP-maker status or applying for it through an SNS proposal. This step, while optional, is highly recommended. Gaining VIP-maker status exempts your pool from strategy order fees and secures trading fee rebates for all maker orders, opening up an additional revenue stream.

**Keep in mind,** *the ICLighthouse team supports only the initial proposal from a token’s development team for acquiring VIP-maker status for an OAMM pool.*

For submitting a VIP-maker proposal, proceed to https://iclight.io/icsns/proposals, select "ICLighthouse DAO", and initiate a new proposal. Your submission should specify the action #ExecuteGenericNervousSyste mFunction, with function_id 1007 for “pair_setVipMaker(app: Principal, account: Address, rate: Nat)" where the rate may reach up to 90. The payload must include the binary hex as a parameter, with a helpful tool available at https://ic.house/tools. For any technical assistance, the ICLighthouse team is ready to help.

3. **Adding the Initial Liquidity:** The pool’s initial liquidity is crucial for its activation and can only be contributed by the creator of the pool.
4. **Transferring Funds from SNS Treasury to ICDex- Trader:** This vital step involves decentralizing the transfer of funds to provide liquidity. For comprehensive instructions on this process, please refer to the documentation at https://github.com/iclighthouse/ICDex-Trader/blob/main/docs/Guide_for_SNS_treasury.md.

**2.3. Securing Support from URANUS NFT Holders (Listing Referrers)**

**URANUS NFT holders**, endowed with the role of listing referrers, possess the unique ability to sponsor trading pairs, thereby contributing significantly to the Pair Score:

**Unverified Listing Referrer Sponsor:** Each sponsorship from an unverified listing referrer adds +10 to the Pair Score.

**Verified Listing Referrer Sponsor:** Sponsorships from verified listing referrers contribute +15 to the Pair Score.

**Collective Sponsorship Reward:** A trading pair receiving sponsorship from 5 or more sponsors gains an additional +10 to its Pair Score.

**Sponsorship Cap:** The maximum boost a pair can receive from sponsorship activities is limited to 70 points.

Each listing referrer is entitled to sponsor up to **12 pairs** annually, enhancing their visibility and trading volume on ICDex.

**2.4. Submitting Metadata to Enhance Token Credibility**

To ensure your token is perceived as credible and trustworthy on ICDex, it’s essential to provide comprehensive metadata to the ICLighthouse team. This includes:

**TokenControllers:**["7hdtw-...-cai", "xxxx...- cai"], // Separated by commas

**TokenIsDecentralized**: true, // The token must be controlled by a DAO or have no controller

**TokenModuleHash:** "1d20aafd24d656e9ed9389325b4a113c5dda9bc6a06faf13934f30beb9d2d87e",

**TokenMintable:** false, // Indicates whether the token is mintable

**TokenMaxSupply:** 1000000000000000, // The total supply, including possible future issuance

**Catalog:** "games", // Available categories include: blockchain, exchanges, finance,businesses, gambling, games, storage, wallet, governance, property, identity, oracles, media, social, security, insurance, energy, health, ai_vr_ar, memes, and others

**Website:** https://xxxxxx.xx

**Social:**https://twitter.com/xxxxx

**Discord:** https://xxxxxxxxxxx.xxx

**Github:** https://github.com/xxxxxx

**Useful Link**

**ICLighthouse NFT:**https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai
**Discord listing-on-icdex channel:** https://discord.gg/9ujhdDTESF`;
      }
    }
  }
  private jump(item): void {
    if (this.$route.name === 'ICDex') {
      this.$emit('changeLaunch', item.split('&')[1]);
    } else {
      this.$router.push(`${item.split('&')[1]}`);
    }
  }
  private showLaunch(): void {
    if (this.getPrincipalId) {
      this.init();
    } else {
      this.$router.replace('/login');
    }
  }
  private showTimeDefaultValue(): moment.Moment {
    return moment().add(30, 'm');
  }
  private async getSNSTokens(): Promise<void> {
    this.SNSTokens = [];
    const listDeployedSnses = await this.SNSWasmService.listDeployedSnses();
    if (listDeployedSnses && listDeployedSnses.length) {
      listDeployedSnses.forEach((item) => {
        if (item.ledger_canister_id.length) {
          this.SNSTokens.push(item.ledger_canister_id[0].toString());
        }
      });
    }
  }
  private async getTokenStandard(tokenId: string): Promise<boolean> {
    if (this.token0Info.tokenId === tokenId && this.token0Info.standard) {
      return true;
    }
    if (this.token1Info.tokenId === tokenId && this.token1Info.standard) {
      return true;
    }
    const res = await this.DRC20TokenService.standard(tokenId);
    if (res) {
      if (res.toLocaleLowerCase().includes('drc20')) {
        this.getTokenInfo(tokenId, 'drc20');
        return true;
      }
    } else {
      const standards = await this.DRC20TokenService.icrc1_supported_standards(
        tokenId
      );
      if (standards) {
        const flag = standards.some((standard) => {
          return (
            standard.name.toLocaleLowerCase() === 'icrc-1' ||
            standard.name.toLocaleLowerCase() === 'icrc1'
          );
        });
        if (flag) {
          this.getTokenInfo(tokenId, 'icrc1');
          return true;
        }
      }
    }
    await this.initTokenInfo(tokenId);
    return false;
  }
  private async initTokenInfo(tokenId: string): Promise<void> {
    let controllers = [];
    if (tokenId && validatePrincipal(tokenId)) {
      const state = await readState(tokenId);
      if (state && state.controllers && state.controllers.length) {
        controllers = state.controllers;
      }
    }
    if (this.form.token0 === tokenId && tokenId !== this.token0Info.tokenId) {
      this.token0Info = {
        tokenId: tokenId,
        name: '',
        symbol: '',
        standard: '',
        controllers: controllers
      };
    }
    if (this.form.token1 === tokenId && tokenId !== this.token1Info.tokenId) {
      this.token1Info = {
        tokenId: tokenId,
        name: '',
        symbol: '',
        standard: '',
        controllers: controllers
      };
    }
  }
  private tokenChange(tokenId: string): void {
    if (!tokenId) {
      this.initTokenInfo(tokenId);
    }
  }
  private async getTokenInfo(tokenId: string, standard: string): Promise<void> {
    if (standard === 'drc20') {
      if (this.form.token0 === tokenId) {
        this.$set(this.token0Info, 'standard', 'DRC20');
      }
      if (this.form.token1 === tokenId) {
        this.$set(this.token1Info, 'standard', 'DRC20');
      }
      this.DRC20TokenService.name(tokenId).then((res) => {
        if (this.form.token0 === tokenId) {
          this.$set(this.token0Info, 'name', res);
        }
        if (this.form.token1 === tokenId) {
          this.$set(this.token1Info, 'name', res);
        }
      });
      this.DRC20TokenService.symbol(tokenId).then((res) => {
        if (this.form.token0 === tokenId) {
          this.$set(this.token0Info, 'symbol', res);
        }
        if (this.form.token1 === tokenId) {
          this.$set(this.token1Info, 'symbol', res);
        }
      });
    } else if (standard === 'icrc1') {
      if (this.form.token0 === tokenId) {
        this.$set(this.token0Info, 'standard', 'ICRC1');
      }
      if (this.form.token1 === tokenId) {
        this.$set(this.token1Info, 'standard', 'ICRC1');
      }
      this.DRC20TokenService.icrcName(tokenId).then((res) => {
        if (this.form.token0 === tokenId) {
          this.$set(this.token0Info, 'name', res);
        }
        if (this.form.token1 === tokenId) {
          this.$set(this.token1Info, 'name', res);
        }
      });
      this.DRC20TokenService.icrcSymbol(tokenId).then((res) => {
        if (this.form.token0 === tokenId) {
          this.$set(this.token0Info, 'symbol', res);
        }
        if (this.form.token1 === tokenId) {
          this.$set(this.token1Info, 'symbol', res);
        }
      });
    }
  }
  private async init(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const allowance = await this.getAllowance();
    console.log(allowance);
    let tokenInfo = this.tokens[this.sysConfig.sysToken.toString()];
    if (!tokenInfo) {
      tokenInfo = await getTokenInfo(this.sysConfig.sysToken, {
        icrc1: null
      });
      this.$set(this.tokens, this.sysConfig.sysToken.toString(), tokenInfo);
    }
    let fee = new BigNumber(this.sysConfig.creatingPairFee.toString(10))
      .plus(this.sysConfig.sysTokenFee.toString(10))
      .plus(this.sysConfig.sysTokenFee.toString(10))
      .div(10 ** tokenInfo.decimals)
      .toString(10);
    if (new BigNumber(await this.getIclBalance()).lt(fee)) {
      loading.close();
      const amount = new BigNumber(this.sysConfig.creatingPairFee.toString(10))
        .div(10 ** tokenInfo.decimals)
        .toString(10);
      (this.$info as any)({
        title: 'Launch a new trading pair',
        content: `Token listing is permissionless and anyone can spend ${amount} ICL to list an ICRC1 or DRC20 token on ICDex.`,
        class: 'connect-plug register-mining-confirm launch-info-button',
        icon: 'connect-plug',
        okText: 'Insufficient ICL balance',
        centered: true,
        closable: true,
        onOk() {
          //
        }
      });
    } else if (allowance || (allowance !== null && Number(allowance) === 0)) {
      this.iclTokenAmount = Number(fee);
      loading.close();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      if (new BigNumber(allowance.toString(10)).div(10 ** 8).lt(fee)) {
        this.$info({
          content: `Required to allow the smart contract to spend your ICL token as a fee(${fee} ICL).`,
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Approve',
          centered: true,
          onOk() {
            (that.$refs.approve as any).visible = true;
            (that.$refs.approve as any).approveForm.amount = fee;
            (that.$refs.approve as any).approveForm.spender =
              IC_DEX_ROUTER_CANISTER_ID;
          }
        });
      } else {
        this.visible = true;
      }
    }
  }
  private onSubmit(): void {
    (this.$refs.form as any).validate(async (valid: any) => {
      console.log(this.form);
      console.log(valid);
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          const formTime: moment.Moment = this.form.time;
          const time = new BigNumber(formTime.valueOf())
            .times(10 ** 6)
            .toString(10);
          const res = await this.ICDexRouterService.pubCreate(
            Principal.fromText(this.form.token0),
            Principal.fromText(this.form.token1),
            BigInt(time)
          );
          console.log(res);
          if (res) {
            const launches = JSON.parse(localStorage.getItem('launches')) || {};
            if (!launches[this.getPrincipalId]) {
              launches[this.getPrincipalId] = [
                `${res.toString()}&${this.token0Info.symbol}/${
                  this.token1Info.symbol
                }`
              ];
            } else {
              launches[this.getPrincipalId].push(
                `${res.toString()}&${this.token0Info.symbol}/${
                  this.token1Info.symbol
                }`
              );
            }
            localStorage.setItem('launches', JSON.stringify(launches));
            this.getCurrentLaunches();
            this.visible = false;
            this.$message.success('Success');
            this.$emit('launchSuccess', this.form.token0, this.form.token1);
          } else {
            this.$message.error('Error');
          }
        } catch (e) {
          console.log(e);
          this.$message.error(toHttpRejectError(e));
        }
        loading.close();
      }
    });
  }
  private approveSuccess(): void {
    this.visible = true;
  }
  private async getIclBalance(): Promise<string> {
    const to = {
      owner: Principal.fromText(this.getPrincipalId),
      subaccount: []
    };
    const ICL = await this.DRC20TokenService.icrc1_balance_of(
      this.sysConfig.sysToken.toString(),
      to
    );
    return new BigNumber(ICL.toString(10))
      .div(10 ** this.tokens[this.sysConfig.sysToken.toString()].decimals)
      .decimalPlaces(4, 1)
      .toString(10);
  }
  private async getAllowance(): Promise<bigint> {
    const res = await this.DRC20TokenService.icrc2_allowance(
      this.sysConfig.sysToken.toString(),
      {
        account: {
          owner: Principal.fromText(this.getPrincipalId),
          subaccount: []
        },
        spender: {
          owner: Principal.fromText(IC_DEX_ROUTER_CANISTER_ID),
          subaccount: []
        }
      }
    );
    console.log(res);
    if (res) {
      return res.allowance;
    } else {
      return BigInt(0);
    }
  }
  private async getSysConfig(): Promise<void> {
    this.sysConfig = await this.ICDexRouterService.sys_getConfig();
  }
  private disabledDate(current: moment.Moment) {
    // Can not select days before today
    return current && current < moment().subtract(1, 'days');
  }
  private afterClose(): void {
    (this.$refs.form as any).resetFields();
  }
}
</script>

<style scoped lang="scss">
.token-info {
  margin-top: 5px;
  color: #5e6170;
}
.setting-item {
  ::v-deep .ant-calendar-picker-clear {
    background: transparent;
    color: #adb3c4;
  }
}
.dots {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-bottom: 1px;
  margin-right: 5px;
  border-radius: 3px;
  background: #adb3c4;
}
.listing-main {
  > div {
    margin-top: 5px;
  }
}
.user-setting {
  background-color: #141b23;
  ::v-deep.ant-dropdown-menu-item {
    background-color: #141b23;
    padding: 10px 15px;
    color: #fff;
    border-bottom: 1px solid #383e4e;
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
}
</style>

<style lang="scss">
.markdown-info {
  word-break: break-word;
  line-height: 18px;
  color: #adb3c4;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 20px 0 10px;
    font-size: 18px;
    color: #fff;
  }
  a {
    color: #1996c4;
  }
  img {
    max-width: 100%;
  }
  p,
  ul {
    margin: 0 0 16px;
  }
  b,
  strong {
    font-weight: 600;
    color: #fff;
  }
  pre {
    position: relative;
    font-family: var(--default-mono-font, 'GitLab Mono'), 'JetBrains Mono',
      'Menlo', 'DejaVu Sans Mono', 'Liberation Mono', 'Consolas', 'Ubuntu Mono',
      'Courier New', 'andale mono', 'lucida console', monospace;
    display: block;
    padding: 8px 12px;
    margin: 0 0 16px;
    font-size: 0.875rem;
    word-break: break-all;
    word-wrap: break-word;
    border: 1px solid #dcdcde;
  }
}
</style>
