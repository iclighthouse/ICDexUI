<template>
  <div>
    <span
      v-if="getPrincipalId"
      @click="showLaunchInfo = true"
      class="base-font-title pointer pc-show"
      style="font-size: 15px"
    >
      +Launch
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
    <a-modal
      v-model="showLaunchInfo"
      centered
      title="How to list a token on ICDex"
      width="800px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal"
    >
      <div>
        <p style="font-size: 16px; color: #fff">
          Listing Your Token on ICDex: A Step-by-Step Process
        </p>
        <div class="base-font-light" v-if="sysConfig">
          ICDex allows for permissionless listing, enabling anyone to list a
          token, provided it meets specified principles and technical
          requirements.
          <div class="mt20" style="font-size: 16px; color: #fff">
            1. Principle Requirements
          </div>
          <div class="listing-main">
            <div>
              <span class="dots"></span>Development Completion: The core
              functionality of the project must be fully developed and the code
              open-sourced.
            </div>
            <div>
              <span class="dots"></span>Whitepaper Disclosure: The project’s
              whitepaper, detailing the economic model of the token, must be
              publicly accessible.
            </div>
            <div>
              <span class="dots"></span>Controller Assignment: The token’s
              control must be vested in a DAO contract, or its controllers
              removed, to avert malicious modifications or issuance.
            </div>
            <div>
              <span class="dots"></span>Standard Compliance: Tokens must conform
              to either the ICRC1 or DRC20 standards.
            </div>
            <div>
              <span class="dots"></span>Transaction Transparency: Adherence to
              the DRC202 standard or implementation of the get_transactions
              query method (according to the SNS ICRC1 specification) is
              required for transparent transaction records.
            </div>
            <div>
              <span class="dots"></span>Additional Conditions for DeFi Projects:
              Require the submission of an audit report conducted by a reputable
              security firm. Transition the DApp’s controller to a DAO or SNS.
            </div>
          </div>
          <div class="mt20" style="font-size: 16px; color: #fff">
            2. Listing Procedure on ICDex
          </div>
          <div>
            Allocate
            {{ sysConfig.creatingPairFee | bigintToFloat(8, 8) | formatNum }}
            ICL (adjustable) to establish a trading pair.
          </div>
          <div style="margin-top: 10px" class="base-warning">
            Non-compliance may trigger delisting proposals by the ICLighthouse
            community.
          </div>
        </div>
        <div class="flex-center mt20">
          <button @click="showLaunchInfo = false" class="margin-left-auto">
            Cancel
          </button>
          <button @click="showLaunch" class="primary" style="margin-left: 10px">
            Yes, I'm ready
          </button>
        </div>
      </div>
    </a-modal>
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
  private showLaunchInfo = false;
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
  private getCurrentLaunches(): void {
    if (this.getPrincipalId) {
      const launches = JSON.parse(localStorage.getItem('launches')) || {};
      if (
        launches[this.getPrincipalId] &&
        launches[this.getPrincipalId].length
      ) {
        this.currentLaunches = launches[this.getPrincipalId];
        this.promoteInfo = `### 1 Introduce

**Pair Score** is an automatic evaluation mechanism of ICDex for trading pairs, which is based on the comprehensive evaluation of the number of sponsors, liquidity, volume, etc. A higher Pair Score means a higher position in the list of pairs, which means more attention from traders. The list of trading pairs is divided into three boards according to the Pair Score.
 - **MAIN** (STAGE2) Board means that more traders are involved.
 - **SECOND** (STAGE1) Board means that some traders are involved.
 - **THIRD** (STAGE0) Board means that fewer traders are involved and there are many unknown risks.

**Upgrade rules**

- A new trading pair defaults to THIRD (STAGE0).
- Upgrade from THIRD to SECOND: pair_score >= 20.
- Upgrade from SECOND to MAIN: pair_score >= 60, for at least one month.

**Degrade rules**

- Degrade from MAIN to SECOND: pair_score  50, for at least three months.
- Degrade from SECOND to THIRD: pair_score  15, for at least three months.

**Sponsor rules**

ICLighthouse **URANUS** NFT holders (listing referrers) are eligible to sponsor pairs. Sponsoring a trading pair increases its "Pair Score", which in turn increases its ranking and board position in the list of pairs. The rules are.
- (Not verified) ListingReferrer Sponsor: +10 per Sponsor.
- Verified ListingReferrer Sponsor: +15 per Sponsor.
- Sponsored (Sponsors >= 5): +10.
- The highest total sponsor score is 70.


### 2 How to increase Pair Score

#### **2.1 Increase attention and trading volume** (Community operations)
- You can promote the project in the community through the trading pair link and set up incentives for the promotion. You can visit the pair's "Referral" page, where any user who has traded on the pair can get their own referral link, and the pair will keep track of the number of new users and volume of trades acquired by the promoter. For technical support please contact the ICLighthouse team.
- You can organize trading mining events with ICDex and provide users with token rewards based on the volume of trading during a specified period of time. For technical support please contact the ICLighthouse team.
- You can organize trading competitions in conjunction with ICDex and offer token rewards based on the amount of trading profits. For technical support please contact the ICLighthouse team.
- You can use strategic orders (e.g. Iceberg, Grid, TWAP, VWAP) to increase volume.
- You can use ICDex-Trader (https://github.com/iclighthouse/ICDex-Trader) and expand it into a trading robot.

#### **2.2 Enhance order book liquidity** (Enhance TVL)

ICDex trading pairs support Orderbook Automated Market Making Pools (OAMM Pools) and their operation is as simple as an AMM pool.

1) You can visit https://iclight.io/ICDex/pools to create an OAMM pool for a trading pair and get its canister-id. This requires a fee of 500 ICL (the fee is 50 ICL for NEPTUNE, URANUS or SATURN NFT holders).
2) You can then invite NEPTUNE NFT holders to grant a vip-maker status to this OAMM pool, or apply for vip-maker status via an SNS proposal. This is optional, but it is strongly urged that you obtain vip-maker status for the OAMM pool. Without vip-maker status, the OAMM pool will have to pay for strategy orders, so you need to pre-fund the OAMM pool with some ICLs. Additionally, the account with vip-maker status will get a rebate on the trading fees for all maker orders, which will be one of the sources of revenue for the OAMM pool.
    **Note**:
    The ICLighthouse team will only support the first proposal submitted by a token's development team to apply for vip-maker status for an OAMM pool.
    To apply for a vip-maker proposal, visit https://iclight.io/icsns/proposals, select "ICLighthouse DAO", click "Make Proposal", fill in the proposal content and select Action #ExecuteGenericNervousSystemFunction, fill in the function_id with 1007 for the method "pair_setVipMaker(app: Principal, account: Address, rate: Nat)", the \`rate\` can be set up to 90, fill in payload with the binary hex as parameter, tool https://ic.house/tools. For technical support please contact the ICLighthouse team.
3) Finally you need to add the first liquidity to activate this OAMM pool. Note that the first liquidity is only allowed to be added by the creator.
4) Transfers funds from SNS Treasury into ICDex-Trader (https://github.com/iclighthouse/ICDex-Trader) in a decentralized manner to provide liquidity. This is a very important initiative. Doc: https://github.com/iclighthouse/ICDex-Trader/blob/main/docs/Guide_for_SNS_treasury.md

#### **2.3 To obtain the support of URANUS NFT holders (listing referrers)**

**URANUS** NFT holders, listing referrers, have sponsor status. Each listing referrer can propose sponsorship for up to 12 pairs in a year, increasing the pair's **Pair Score**.
- (Not verified) ListingReferrer Sponsor: +10 per Sponsor.
- Verified ListingReferrer Sponsor: +15 per Sponsor.
- Sponsored (Sponsors >= 5): +10.
- The highest total sponsor score is 70.

#### **2.4 Make proposal to add metadatas of token to enhance credibility**

Contact the ICLighthouse team with the following information and request an update if the information changes, otherwise a risk warning may be displayed on the trading pair page.

e.g.
\`\`\`
- TokenControllers: "7hdtw-...-cai, xxxx...-cai"  // separated by ", "
- TokenIsDecentralized: True  // Requires the token to be controlled by the DAO, or to have no controller.
- TokenModuleHash: 1d20aafd24d656e9ed9389325b4a113c5dda9bc6a06faf13934f30beb9d2d87e
- TokenMintable: False
- TokenMaxSupply: 1000000000000000  // total supply + possible future issuance
- Catalog: games  // Available values: blockchain, exchanges, finance, businesses, gambling, games, storage, wallet, governance, property, identity, oracles, media, social, security, insurance, energy, health, ai_vr_ar, memes, other
- Website: https://xxxxxx.xx
- Social: https://twitter.com/xxxxxxx
- Discord: https://xxxxxxxxxxx.xxx
- Github: https://github.com/xxxxxxxx
\`\`\`

**ICLighthouse NFT**: https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai

**Discord listing-on-icdex channel**: https://discord.gg/9ujhdDTESF
`;
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
    this.showLaunchInfo = false;
    this.init();
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
