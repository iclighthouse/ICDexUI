<template>
  <div>
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
      <div>
        <p class="base-font-title" style="font-size: 15px">
          Listing Your Token on ICDex: A Step-by-Step Process
        </p>
        <div class="base-font-light" v-if="sysConfig">
          ICDex allows for permissionless listing, enabling anyone to list a
          token, provided it meets specified principles and technical
          requirements.
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
          <div style="margin-top: 10px" class="base-warning">
            WARNING: The creator may face constraints from the local legal
            framework, please verify that you are in compliance with local laws
            and do not commit fraud or other criminal activities through the
            token.
          </div>
        </div>
      </div>
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
  created(): void {
    this.DRC20TokenService = new DRC20TokenService();
    this.ICDexRouterService = new ICDexRouterService();
    this.SNSWasmService = new SNSWasmService();
    this.getSysConfig();
    this.getSNSTokens();
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
</style>
