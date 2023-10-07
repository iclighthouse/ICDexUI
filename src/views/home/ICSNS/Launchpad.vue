<template>
  <div class="container-width launch-pad-main">
    <div class="launch-pad-item">
      <div class="launch-pad-item-title">Current launches</div>
      <div class="launch-pad-token-list">
        <div
          class="launch-pad-token-item"
          v-for="(token, index) in SNSTokensOpen"
          :key="index"
          @click="showDetails(token)"
        >
          <div class="launch-pad-token-item-header">
            <img
              v-if="token.logo && token.logo[0]"
              :src="token.logo[0]"
              alt=""
            />
            <span
              v-if="token.name && token.name[0]"
              class="sns-token-list-item-info-name"
              >{{ token.name[0] }}</span
            >
            <span class="launch-pad-token-item-state">{{
              filterState(token)
            }}</span>
            <span class="pc-show"
              >&nbsp;(<span class="base-color-w"
                >{{ token | filterCompleted }}%</span
              >
              completed)</span
            >
          </div>
          <div v-if="token.params && token.params.length">
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Supply</span>
              <span class="base-color-w margin-left-auto">
                {{
                  token.params[0].sns_token_e8s
                    | bigintToFloat(token.decimals, token.decimals)
                    | formatNum
                }}
              </span>
              <span>&nbsp;{{ token.symbol }}</span>
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Hard Cap</span>
              <span class="base-color-w margin-left-auto">
                {{
                  token.params[0].max_icp_e8s | bigintToFloat(8, 8) | formatNum
                }}
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Soft Cap</span>
              <span class="base-color-w margin-left-auto">
                {{
                  token.params[0].min_icp_e8s | bigintToFloat(8, 8) | formatNum
                }}
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Max Commit</span>
              <span class="base-color-w margin-left-auto">
                {{
                  token.params[0].max_participant_icp_e8s
                    | bigintToFloat(8, 8)
                    | formatNum
                }}
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Min Commit</span>
              <span class="base-color-w margin-left-auto">
                {{
                  token.params[0].min_participant_icp_e8s
                    | bigintToFloat(8, 8)
                    | formatNum
                }}
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Deadline</span>
              <span class="margin-left-auto">
                {{
                  token.params[0].swap_due_timestamp_seconds
                    | formatDateFromSecondUTC
                }}
              </span>
            </div>
            <div
              v-if="
                token.params[0].neuron_basket_construction_parameters.length
              "
              class="launch-pad-token-item-info"
            >
              <span class="launch-pad-token-item-info-label">Neuron Count</span>
              <span class="margin-left-auto">
                {{
                  token.params[0].neuron_basket_construction_parameters[0]
                    .count
                }}&nbsp;
              </span>
              <!--<a-tooltip placement="top">
                <template slot="title">
                  Generate a set of increasing dissolve delays where each new
                  dissolve delay is randomized within its interval.
                </template>
                <a-icon class="info-circle pointer" type="info-circle" />
              </a-tooltip>-->
            </div>
          </div>
        </div>
        <div
          v-if="loading"
          class="launch-pad-token-item launch-pad-token-item-skeleton"
        >
          <a-skeleton :loading="loading" active> </a-skeleton>
        </div>
        <div
          class="no-data-token"
          v-if="
            !SNSTokensOpen.length &&
            !(SNSTokens.length && !SNSTokens[0]) &&
            !loading
          "
        >
          Looks like there are no SNS decentralisation sales running right now.
          Hopefully one is coming soon!
        </div>
      </div>
    </div>
    <div class="launch-pad-item">
      <div class="launch-pad-item-title">Upcoming launches</div>
      <div class="launch-pad-token-list">
        <div
          class="launch-pad-token-item"
          v-for="(token, index) in SNSTokensPending"
          :key="index"
          @click="showDetails(token)"
        >
          <div class="launch-pad-token-item-header">
            <img
              v-if="token.logo && token.logo[0]"
              :src="token.logo[0]"
              alt=""
            />
            <span
              v-if="token.name && token.name[0]"
              class="sns-token-list-item-info-name"
              >{{ token.name[0] }}</span
            >
            <span
              class="adopted-countdown-main"
              v-show="token.deadline && filterState(token) === 'Adopted'"
            >
              &nbsp;
              <a-statistic-countdown
                v-show="!token.deadlineLoading"
                class="adopted-countdown"
                :value="token.deadline"
                format="DD:HH:mm:ss"
                @finish="onFinish(token)"
              />
              <span
                v-show="token.deadlineLoading"
                class="loading-spinner"
              ></span>
            </span>
            <span class="launch-pad-token-item-state">{{
              filterState(token)
            }}</span>
            <!--<span class="pc-show"
              >&nbsp;(<span class="base-color-w"
                >{{ token | filterCompleted }}%</span
              >
              completed)</span
            >-->
          </div>
          <div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Supply</span>
              <span class="base-color-w margin-left-auto">
                <span v-if="token.params && token.params.length">
                  {{
                    token.params[0].sns_token_e8s
                      | bigintToFloat(token.decimals, token.decimals)
                      | formatNum
                  }}
                </span>
                <span v-else>-</span>
              </span>
              <span>&nbsp;{{ token.symbol }}</span>
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Hard Cap</span>
              <span class="base-color-w margin-left-auto">
                <span v-if="token.params && token.params.length">
                  {{
                    token.params[0].max_icp_e8s
                      | bigintToFloat(8, 8)
                      | formatNum
                  }}
                </span>
                <span v-else>-</span>
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Soft Cap</span>
              <span class="base-color-w margin-left-auto">
                <span v-if="token.params && token.params.length">
                  {{
                    token.params[0].min_icp_e8s
                      | bigintToFloat(8, 8)
                      | formatNum
                  }}
                </span>
                <span v-else>-</span>
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Max Commit</span>
              <span class="base-color-w margin-left-auto">
                <span v-if="token.params && token.params.length">
                  {{
                    token.params[0].max_participant_icp_e8s
                      | bigintToFloat(8, 8)
                      | formatNum
                  }}
                </span>
                <span v-else>-</span>
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Min Commit</span>
              <span class="base-color-w margin-left-auto">
                <span v-if="token.params && token.params.length">
                  {{
                    token.params[0].min_participant_icp_e8s
                      | bigintToFloat(8, 8)
                      | formatNum
                  }}
                </span>
                <span v-else>-</span>
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Deadline</span>
              <span class="margin-left-auto">
                <span v-if="token.params && token.params.length">
                  {{
                    token.params[0].swap_due_timestamp_seconds
                      | formatDateFromSecondUTC
                  }}
                </span>
                <span v-else>-</span>
              </span>
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Neuron Count</span>
              <span class="margin-left-auto">
                <span
                  v-if="
                    token.params &&
                    token.params.length &&
                    token.params[0].neuron_basket_construction_parameters.length
                  "
                >
                  {{
                    token.params[0].neuron_basket_construction_parameters[0]
                      .count
                  }}
                </span>
                <span v-else>-</span>
              </span>
              <!--<a-tooltip placement="top">
                <template slot="title">
                  Generate a set of increasing dissolve delays where each new
                  dissolve delay is randomized within its interval.
                </template>
                <a-icon class="info-circle pointer" type="info-circle" />
              </a-tooltip>-->
            </div>
          </div>
        </div>
        <div
          v-if="loading"
          class="launch-pad-token-item launch-pad-token-item-skeleton"
        >
          <a-skeleton :loading="loading" active> </a-skeleton>
        </div>
        <div
          class="no-data-token"
          v-if="
            !SNSTokensPending.length &&
            !(SNSTokens.length && !SNSTokens[0]) &&
            !loading
          "
        >
          There are no decentralisation sale proposals open at the moment.
        </div>
      </div>
    </div>
    <div class="launch-pad-item">
      <div class="launch-pad-item-title">Launched</div>
      <div class="launch-pad-token-list">
        <div
          class="launch-pad-token-item"
          v-for="(token, index) in SNSTokensCommitted"
          :key="index"
          @click="showDetails(token)"
        >
          <div class="launch-pad-token-item-header">
            <img
              v-if="token.logo && token.logo[0]"
              :src="token.logo[0]"
              alt=""
            />
            <span
              v-if="token.name && token.name[0]"
              class="sns-token-list-item-info-name"
              >{{ token.name[0] }}</span
            >
            <span class="launch-pad-token-item-state">{{
              filterState(token)
            }}</span>
            <span class="pc-show"
              >&nbsp;(<span class="base-color-w"
                >{{ token | filterCompleted }}%</span
              >
              completed)</span
            >
          </div>
          <div v-if="token.params && token.params.length">
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Supply</span>
              <span class="base-color-w margin-left-auto">
                {{
                  token.params[0].sns_token_e8s
                    | bigintToFloat(token.decimals, token.decimals)
                    | formatNum
                }}
              </span>
              <span>&nbsp;{{ token.symbol }}</span>
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Hard Cap</span>
              <span class="base-color-w margin-left-auto">
                {{
                  token.params[0].max_icp_e8s | bigintToFloat(8, 8) | formatNum
                }}
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Soft Cap</span>
              <span class="base-color-w margin-left-auto">
                {{
                  token.params[0].min_icp_e8s | bigintToFloat(8, 8) | formatNum
                }}
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Max Commit</span>
              <span class="base-color-w margin-left-auto">
                {{
                  token.params[0].max_participant_icp_e8s
                    | bigintToFloat(8, 8)
                    | formatNum
                }}
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Min Commit</span>
              <span class="base-color-w margin-left-auto">
                {{
                  token.params[0].min_participant_icp_e8s
                    | bigintToFloat(8, 8)
                    | formatNum
                }}
              </span>
              &nbsp;ICP
            </div>
            <div class="launch-pad-token-item-info">
              <span class="launch-pad-token-item-info-label">Deadline</span>
              <span class="margin-left-auto">
                {{
                  token.params[0].swap_due_timestamp_seconds
                    | formatDateFromSecondUTC
                }}
              </span>
            </div>
            <div
              v-if="
                token.params[0].neuron_basket_construction_parameters.length
              "
              class="launch-pad-token-item-info"
            >
              <span class="launch-pad-token-item-info-label">Neuron Count</span>
              <span class="margin-left-auto">
                {{
                  token.params[0].neuron_basket_construction_parameters[0]
                    .count
                }}&nbsp;
              </span>
              <!--<a-tooltip placement="top">
                <template slot="title">
                  Generate a set of increasing dissolve delays where each new
                  dissolve delay is randomized within its interval.
                </template>
                <a-icon class="info-circle pointer" type="info-circle" />
              </a-tooltip>-->
            </div>
          </div>
        </div>
        <div
          v-if="loading"
          class="launch-pad-token-item launch-pad-token-item-skeleton"
        >
          <a-skeleton :loading="loading" active> </a-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventBus from '@/utils/Event';
import { Principal } from '@dfinity/principal';
import { connectIcx, initIcx } from '@/ic/connectIcx';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { TokenInfo } from '@/ic/common/icType';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { DeployedSns } from '@/ic/SNSWasm/model';
import { SNSToken } from '@/views/home/ICSNS/model';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { GetMetadataResponse } from '@/ic/SNSGovernance/model';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import { SNSSwapService } from '@/ic/SNSSwap/SNSSwapService';
import {
  CfInvestment,
  CfParticipant,
  DirectInvestment,
  GetStateResponse,
  Investor,
  NeuronBasketConstructionParameters,
  Params
} from '@/ic/SNSSwap/model';
import BigNumber from 'bignumber.js';
import { namespace } from 'vuex-class';
import { GovernanceService } from '@/ic/governance/governanceService';
import {
  CreateServiceNervousSystem,
  OpenSnsTokenSwap,
  ProposalInfo
} from '@/ic/governance/model';

const commonModule = namespace('common');

@Component({
  name: 'Launchpad',
  components: {},
  filters: {
    filterCompleted(token: SNSToken): string {
      if (token.buyersTotal && token.params && token.params.length) {
        return new BigNumber(token.buyersTotal.toString(10))
          .div(token.params[0].max_icp_e8s.toString(10))
          .times(100)
          .decimalPlaces(2)
          .toString(10);
      }
      return '0';
    },
    filterInvestor(investor: Investor): string {
      if (investor) {
        const type = Object.keys(investor)[0];
        if (type === 'Direct') {
          return (
            investor as {
              Direct: DirectInvestment;
            }
          ).Direct.buyer_principal;
        } else {
          return (investor as { CommunityFund: CfInvestment }).CommunityFund
            .hotkey_principal;
        }
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private SNSWasmService: SNSWasmService = null;
  private SNSTokens: Array<SNSToken> = [];
  private deployedSnses: Array<DeployedSns> = [];
  private SNSTokensOpen: Array<SNSToken> = [];
  private SNSTokensCommitted: Array<SNSToken> = [];
  private SNSTokensPending: Array<SNSToken> = [];
  private tokens: { [key: string]: TokenInfo } = {};
  private isIcx = false;
  private timer = null;
  private loading = false;
  async activated(): Promise<void> {
    if (!this.$route.meta.isBack) {
      this.$route.meta.isBack = false;
      this.SNSTokensOpen = [];
      this.SNSTokensPending = [];
      this.SNSTokensCommitted = [];
      this.SNSWasmService = new SNSWasmService();
      this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
      if ((window as any).icx) {
        this.isIcx = !!(window as any).icx;
        EventBus.$on('initSuccess', () => {
          this.init();
        });
        await initIcx();
      }
      this.init();
    } else {
      this.getCountdown();
    }
  }
  deactivated(): void {
    console.log('deactivated');
    window.clearInterval(this.timer);
    this.timer = null;
  }
  async mounted(): Promise<void> {
    console.log('mounted');
    // this.SNSWasmService = new SNSWasmService();
    // this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    // if ((window as any).icx) {
    //   this.isIcx = !!(window as any).icx;
    //   EventBus.$on('initSuccess', () => {
    //     this.init();
    //   });
    //   await initIcx();
    // }
    // this.init();
  }
  private init(): void {
    this.listDeployedSnses();
  }
  private filterState(token: SNSToken): string {
    if (token.lifecycle && token.lifecycle.length) {
      const state = Number(token.lifecycle[0]);
      if (state === 0) {
        return 'Unspecified';
      }
      if (state === 1) {
        return 'Pending';
      }
      if (state === 2) {
        return 'Open';
      }
      if (state === 3) {
        return 'Committed';
      }
      if (state === 4) {
        return 'Aborted';
      }
      if (state === 5) {
        return 'Adopted';
      }
    }
    return '';
  }
  private async listDeployedSnses(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      this.deployedSnses = await this.SNSWasmService.listDeployedSnses();
      loading.close();
      let canisterIds: Array<string> = [];
      this.deployedSnses.forEach((item) => {
        canisterIds = canisterIds.concat([
          item.swap_canister_id.toString(),
          item.governance_canister_id.toString(),
          item.ledger_canister_id.toString()
        ]);
      });
      canisterIds = [...new Set(canisterIds)];
      const flag = needConnectPlug(canisterIds);
      const principal = localStorage.getItem('principal');
      const priList = JSON.parse(localStorage.getItem('priList')) || {};
      const needConnectInfinity1 = await needConnectInfinity(canisterIds);
      if (
        priList[principal] === 'Plug' &&
        flag &&
        this.$route.name === 'ICSNS-Launchpad'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        this.$info({
          content: 'ICSNS Launchpad need to be connected to the plug.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          onOk() {
            currentPageConnectPlug(canisterIds).then(async () => {
              _that.initConnected(_that.deployedSnses);
            });
          }
        });
      } else if (
        priList[principal] === 'Infinity' &&
        needConnectInfinity1 &&
        this.$route.name === 'ICSNS-Launchpad'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        this.$info({
          content: 'ICSNS Launchpad need to be connected to the plug.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          onOk() {
            currentPageConnectInfinity(canisterIds).then(async () => {
              _that.initConnected(_that.deployedSnses);
            });
          }
        });
      } else {
        if ((window as any).icx) {
          const icxCanisterIds: Array<string> =
            JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
          const newIcxCanisterIds: Array<string> = [
            ...new Set([...icxCanisterIds, ...canisterIds])
          ];
          localStorage.setItem(
            'icxCanisterIds',
            JSON.stringify(newIcxCanisterIds)
          );
          await connectIcx(newIcxCanisterIds);
        }
        this.initConnected(this.deployedSnses);
      }
    } catch (e) {
      console.error(e);
      loading.close();
    }
  }
  private async initConnected(
    listDeployedSnses: Array<DeployedSns>
  ): Promise<void> {
    console.log(listDeployedSnses);
    this.loading = true;
    const SNSProposals = await this.getSNSProposals();
    this.SNSTokens = new Array(listDeployedSnses.length).fill(null);
    const MAX_COCURRENCY = 10;
    let promiseAll = [];
    let snsTokens = [];
    for (let i = 0; i < listDeployedSnses.length; i++) {
      promiseAll.push(this.getSNSTokenInfo(listDeployedSnses[i]));
      if (promiseAll.length === MAX_COCURRENCY) {
        const res = await Promise.all(promiseAll);
        snsTokens = snsTokens.concat(res);
        promiseAll = [];
      }
      if (i === listDeployedSnses.length - 1 && promiseAll.length) {
        const res = await Promise.all(promiseAll);
        snsTokens = snsTokens.concat(res);
        promiseAll = [];
      }
    }
    SNSProposals.forEach((proposal) => {
      if (
        proposal &&
        proposal.proposal &&
        proposal.proposal[0] &&
        proposal.proposal[0].action &&
        proposal.proposal[0].action[0]
      ) {
        const action = (
          proposal.proposal[0].action[0] as {
            OpenSnsTokenSwap: OpenSnsTokenSwap;
          }
        ).OpenSnsTokenSwap;
        if (action) {
          snsTokens.some((token) => {
            if (action.target_swap_canister_id[0].toString() === token.swapId) {
              token.params = action.params;
              token.proposalId = proposal.id[0].id;
              return true;
            }
          });
        }
        const createServiceNervousSystem = (
          proposal.proposal[0].action[0] as {
            CreateServiceNervousSystem: CreateServiceNervousSystem;
          }
        ).CreateServiceNervousSystem;
        if (createServiceNervousSystem) {
          const swapParameters = createServiceNervousSystem.swap_parameters[0];
          const swap_due_timestamp_seconds = new BigNumber(
            proposal.proposal_timestamp_seconds.toString(10)
          )
            .plus(swapParameters.duration[0].seconds[0].toString(10))
            .toString(10);
          const params: Params = {
            min_participant_icp_e8s:
              swapParameters.minimum_participant_icp[0].e8s[0],
            neuron_basket_construction_parameters: [
              {
                dissolve_delay_interval_seconds:
                  swapParameters.neuron_basket_construction_parameters[0]
                    .dissolve_delay_interval[0].seconds[0],
                count:
                  swapParameters.neuron_basket_construction_parameters[0]
                    .count[0]
              }
            ],
            max_icp_e8s: swapParameters.maximum_icp[0].e8s[0],
            swap_due_timestamp_seconds: BigInt(swap_due_timestamp_seconds),
            min_participants: swapParameters.minimum_participants[0],
            sns_token_e8s:
              createServiceNervousSystem.initial_token_distribution[0]
                .swap_distribution[0].total[0].e8s[0],
            max_participant_icp_e8s:
              swapParameters.maximum_participant_icp[0].e8s[0],
            sale_delay_seconds: null,
            min_icp_e8s: swapParameters.minimum_icp[0].e8s[0]
          };
          console.log(params);
          const tokenInfo = createServiceNervousSystem.ledger_parameters[0];
          const token: SNSToken = {
            tokenId: null,
            tokenStd: { icrc1: null },
            balance: '',
            symbol: tokenInfo.token_symbol[0],
            decimals: 8,
            url: createServiceNervousSystem.url,
            logo: tokenInfo.token_logo[0].base64_encoding,
            name: tokenInfo.token_name,
            description: createServiceNervousSystem.description,
            swapId: null,
            lifecycle: [BigInt(1)],
            params: [params],
            proposalId: proposal.id[0].id
          };
          snsTokens.unshift(token);
        }
      }
    });
    this.SNSTokens = snsTokens;
    this.filterTokens();
    this.getCountdown();
  }
  private showDetails(token: SNSToken): void {
    window.clearInterval(this.timer);
    this.timer = null;
    if (token.tokenId) {
      this.$router.push(`/icsns/launchpad/${token.tokenId}`);
    } else {
      // this.$router.push(
      //   `/icsns/launchpad/0/?proposalId=${token.proposalId.toString(10)}`
      // );
      this.$router.push(`/nns/proposals/${token.proposalId.toString(10)}`);
    }
  }
  private getCountdown(): void {
    this.SNSTokensPending.forEach((res) => {
      if (res.lifecycle && res.lifecycle[0]) {
        if (Number(res.lifecycle[0]) === 5) {
          // LIFECYCLE_ADOPTED
          this.getProposalInfo(res);
        }
      }
    });
    window.clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      let hasPending = false;
      this.SNSTokensPending.forEach((res) => {
        if (res.lifecycle && res.lifecycle[0]) {
          // LIFECYCLE_PENDING
          if (Number(res.lifecycle[0]) === 1) {
            hasPending = true;
            if (!this.getCheckAuth) {
              this.getProposalInfo(res);
            }
          }
        }
      });
      console.log('hasPending: ' + hasPending);
      if (!hasPending) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
    }, 60 * 1000);
  }
  private async onFinish(token: SNSToken): Promise<void> {
    try {
      this.$set(token, 'deadlineLoading', true);
      const lifecycle = await this.getLifecycle(token.swapId);
      console.log(lifecycle);
      this.$set(token, 'lifecycle', lifecycle);
      if (Number(lifecycle[0]) === 5) {
        window.setTimeout(() => {
          this.onFinish(token);
        }, 1000);
      } else {
        this.filterTokens();
        this.$set(token, 'deadlineLoading', false);
      }
    } catch (e) {
      console.log(e);
      this.$set(token, 'deadlineLoading', false);
    }
  }
  private async refreshPendingLifecycle(res: SNSToken): Promise<void> {
    if (Number(res.lifecycle[0]) !== 1) {
      return;
    }
    try {
      const lifecycle = await this.getLifecycle(res.swapId);
      console.log(lifecycle);
      this.$set(res, 'lifecycle', lifecycle);
      if (Number(lifecycle[0]) === 1) {
        window.setTimeout(() => {
          this.refreshPendingLifecycle(res);
        }, 1000);
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getProposalInfo(res: SNSToken): Promise<void> {
    if (res && res.proposalId) {
      const governanceService = new GovernanceService();
      const proposalRes = await governanceService.getProposalInfo(
        res.proposalId
      );
      console.log(proposalRes);
      if (proposalRes && proposalRes.length) {
        const executedTime = proposalRes[0].executed_timestamp_seconds;
        if (proposalRes[0].decided_timestamp_seconds) {
          this.refreshPendingLifecycle(res);
        }
        if (executedTime && res.params[0].sale_delay_seconds[0]) {
          const deadline = new BigNumber(executedTime.toString(10))
            .plus(res.params[0].sale_delay_seconds[0].toString(10))
            .times(1000)
            .decimalPlaces(0)
            .toNumber();
          console.log(deadline);
          this.$set(res, 'deadline', deadline);
        }
      }
    }
  }
  private filterTokens(): void {
    this.SNSTokensOpen = [];
    this.SNSTokensPending = [];
    this.SNSTokensCommitted = [];
    this.SNSTokens.forEach((token) => {
      if (token.lifecycle && token.lifecycle.length) {
        if (
          Number(token.lifecycle[0]) === 1 ||
          Number(token.lifecycle[0]) === 5
        ) {
          this.SNSTokensPending.push(token);
        }
        if (Number(token.lifecycle[0]) === 2) {
          this.SNSTokensOpen.push(token);
        }
        if (
          Number(token.lifecycle[0]) === 3
          // || Number(token.lifecycle[0]) === 4
        ) {
          this.SNSTokensCommitted.push(token);
        }
      }
    });
    this.loading = false;
  }
  private async getSNSTokenInfo(deployedSns: DeployedSns): Promise<SNSToken> {
    const promiseAll = [];
    const ledgerCanisterId = deployedSns.ledger_canister_id[0];
    const governanceCanisterId = deployedSns.governance_canister_id[0];
    const swapCanisterId = deployedSns.swap_canister_id[0];
    promiseAll.push(
      this.getSNSTokenGovernanceInfo(governanceCanisterId.toString()),
      this.getCurrentTokenInfo(ledgerCanisterId),
      this.getLifecycle(swapCanisterId.toString()),
      this.getParams(swapCanisterId.toString()),
      this.getDerivedState(swapCanisterId.toString()),
      this.listCommunityFundParticipants(swapCanisterId.toString())
    );
    const res = await Promise.all(promiseAll);
    let params = res[3];
    let proposalId = null;
    console.log(res[2][0]);
    if (res[2] && res[2][0] && Number(res[2][0]) === 5) {
      try {
        const res = await this.getSNSTokenSwapState(swapCanisterId.toString());
        proposalId = res.swap[0].open_sns_token_swap_proposal_id[0];
      } catch (e) {
        console.log(e);
      }
    }
    console.log(params);
    let communityFund = '0';
    if (res[5]) {
      res[5].forEach((participant) => {
        participant.cf_neurons.forEach((neuron) => {
          communityFund = new BigNumber(neuron.amount_icp_e8s.toString(10))
            .plus(communityFund)
            .toString(10);
        });
      });
    }
    const buyersTotal = new BigNumber(res[4].toString(10)).toString(10);
    return {
      tokenId: ledgerCanisterId.toString(),
      swapId: swapCanisterId.toString(),
      ...res[1],
      ...res[0],
      lifecycle: res[2],
      params: params,
      proposalId: proposalId,
      buyersTotal: BigInt(buyersTotal)
    };
  }
  private async listCommunityFundParticipants(
    tokenId: string
  ): Promise<Array<CfParticipant>> {
    const snsSwapService = new SNSSwapService();
    console.time('listCommunityFundParticipants');
    const res = await snsSwapService.listCommunityFundParticipants(tokenId);
    console.timeEnd('listCommunityFundParticipants');
    return res.cf_participants;
  }
  private async getParams(tokenId: string): Promise<Array<Params>> {
    const snsSwapService = new SNSSwapService();
    console.time('getParams');
    const res = await snsSwapService.getSaleParameters(tokenId);
    console.time('getParams');
    return res.params;
  }
  private async getLifecycle(tokenId: string): Promise<Array<bigint>> {
    const snsSwapService = new SNSSwapService();
    console.time('getLifecycle');
    const res = await snsSwapService.getLifecycle(tokenId);
    console.timeEnd('getLifecycle');
    return res.lifecycle;
  }
  private async getDerivedState(tokenId: string): Promise<bigint> {
    const snsSwapService = new SNSSwapService();
    console.time('1');
    const res = await snsSwapService.getDerivedState(tokenId);
    console.timeEnd('1');
    return res.buyer_total_icp_e8s[0];
  }
  private async getCurrentTokenInfo(tokenId: Principal): Promise<TokenInfo> {
    if (!this.tokens[tokenId.toString()]) {
      return await getTokenInfo(tokenId, { icrc1: null });
    } else {
      return this.tokens[tokenId.toString()];
    }
  }
  private async getSNSTokenGovernanceInfo(
    tokenId: string
  ): Promise<GetMetadataResponse> {
    const snsGovernanceService = new SNSGovernanceService();
    return await snsGovernanceService.getMetadata(tokenId);
  }
  private async getSNSProposals(): Promise<Array<ProposalInfo>> {
    try {
      const governanceService = new GovernanceService();
      const proposalRes = await governanceService.listProposals({
        include_reward_status: [],
        before_proposal: [],
        limit: BigInt(100),
        // todo only Proposals related to SNS and Community Fund.
        exclude_topic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        // only open
        include_status: [1],
        include_all_manage_neuron_proposals: []
      });
      console.log(proposalRes);
      if (
        proposalRes &&
        proposalRes.proposal_info &&
        proposalRes.proposal_info.length
      ) {
        return proposalRes.proposal_info;
      }
      return [];
    } catch (e) {
      console.log(e);
    }
  }
  private async getSNSTokenSwapState(
    tokenId: string
  ): Promise<GetStateResponse> {
    const snsSwapService = new SNSSwapService();
    console.time('2');
    const res = await snsSwapService.getState(tokenId);
    console.timeEnd('2');
    return res;
  }
}
</script>

<style scoped lang="scss">
.launch-pad-token-item-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.launch-pad-token-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
}
.launch-pad-token-item {
  width: 490px;
  height: 250px;
  padding: 16px;
  margin-bottom: 15px;
  background: #131920;
  border: 1px solid #212b35;
  border-radius: 10px;
  color: #adb8c4;
  cursor: pointer;
  &.launch-pad-token-item-skeleton {
    height: 180px;
    overflow: hidden;
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    object-fit: contain;
  }
  .sns-token-list-item-info-name {
    color: #fff;
    font-size: 16px;
    padding-left: 5px;
  }
  .launch-pad-token-item-state {
    margin-left: auto;
  }
}
.launch-pad-item-title {
  font-size: 20px;
  color: #fff;
}
.launch-pad-token-item-info {
  display: flex;
  line-height: 26px;
  align-items: center;
  .launch-pad-token-item-info-label {
    display: inline-block;
  }
  .info-circle {
    color: #777d90;
  }
}
.no-data-token {
  margin-bottom: 40px;
  color: #adb3c4;
}
.adopted-countdown-main {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.loading-spinner {
  display: inline-block;
  background-image: url('../../../assets/img/loading.svg');
  background-repeat: no-repeat;
  background-size: 14px 14px;
  height: 14px;
  width: 14px;
  background-position: center;
  animation: loading-rotate 2s linear infinite;
  margin-left: 5px;
  color: #fff;
}
@media screen and (max-width: 992px) {
  .launch-pad-main {
    width: 100%;
    padding: 0 10px;
  }
  .state-info-main {
    flex-direction: column;
    .state-info-item {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
@media screen and (max-width: 768px) {
  .launch-pad-token-item {
    width: 100%;
  }
  .launch-pad-token-item-info {
    .launch-pad-token-item-info-label {
      width: auto;
      padding-right: 0;
    }
  }
}
</style>
<style lang="scss">
.adopted-countdown {
  line-height: 1;
  .ant-statistic-content {
    color: #d13651;
    font-size: 14px;
    text-align: center;
  }
}
</style>
