<template>
  <div class="proposals-main">
    <div class="container-width">
      <div v-if="SNSTokens[currentIndex]" class="proposals-main-header">
        <div class="neurons-list">
          <a-select
            class="neurons-list-header-option"
            v-model="currentIndex"
            @change="SNSTokensChange"
          >
            <a-select-option v-for="(item, index) in SNSTokens" :key="index">
              <span v-if="item && item.name && item.name[0]">
                {{ item.name[0] }}
              </span>
            </a-select-option>
          </a-select>
          <button
            @click="onFilterTopics"
            type="button"
            class="proposals-button-filter"
          >
            <a-icon type="filter" />
            Types ({{ topics.length }}/{{
              SNSTokens[currentIndex].listTypes.length
            }})
          </button>
          <button
            @click="filterStatus"
            type="button"
            class="proposals-button-filter"
          >
            <a-icon type="filter" />
            <span class="pc-show">Proposals Status</span
            ><span class="h5-show">Status</span> ({{
              proposalStatusFilter.length
            }}/{{ proposalStatus.length }})
          </button>
          <div v-if="getPrincipalId" class="can-still">
            <a-checkbox v-model="showStill"> Actionable Proposals </a-checkbox>
          </div>
          <span class="load-icon">
            <a-icon
              @click="reloadProposals"
              class="pointer"
              v-show="!showLoading"
              type="reload"
            />
            <a-icon v-show="showLoading" type="loading" class="reload-icon" />
          </span>
          <button
            v-show="getPrincipalId"
            type="button"
            class="primary margin-left-auto maker-Proposal"
            @click="onMakerProposal"
          >
            Make Proposal
          </button>
        </div>
      </div>
    </div>
    <div v-show="showStill" class="mt20">
      <div class="container-width">
        <div class="proposals-list-main">
          <div
            class="proposals-list-item"
            v-for="(item, index) in proposalsOpening"
            :key="index"
            @click="jumpProposal(item)"
          >
            <div
              class="proposals-list-item-header"
              style="align-items: center; margin-bottom: 10px"
            >
              <span class="base-font-title"
                >ID: {{ item.id[0].id.toString(10) }}</span
              >
              <span
                class="proposals-list-item-header-status margin-left-auto"
                :class="getStatus(item)"
              >
                {{ getStatus(item) }}
              </span>
            </div>
            <div>
              <span class="proposals-list-item-title">
                <span class="base-color-w">
                  {{ item.proposal[0].title }}
                </span>
                <!--{{ item.proposal[0].action | filterAction }}-->
              </span>
            </div>
            <!--<div class="proposals-list-item-type base-font-title">
							<span>Type</span>
							<span class="margin-left-auto">{{
								item.proposal[0].action | filterAction
							}}</span>
						</div>-->
            <div class="proposals-list-item-summary">
              <vue-markdown
                :source="item.proposal[0].summary"
                :linkify="false"
              ></vue-markdown>
            </div>
            <div class="proposals-list-item-footer">
              <span
                v-if="
                  SNSTokens &&
                  SNSTokens[currentIndex] &&
                  SNSTokens[currentIndex].types &&
                  SNSTokens[currentIndex].types[item.action.toString(10)]
                "
              >
                {{
                  SNSTokens[currentIndex].types[item.action.toString(10)]
                    .name === 'Deegister Dapp Canisters'
                    ? 'Deregister Dapp Canisters'
                    : SNSTokens[currentIndex].types[item.action.toString(10)]
                        .name
                }}
              </span>
              <span class="margin-left-auto pc-show" style="flex-shrink: 0">
                {{
                  item.proposal_creation_timestamp_seconds |
                    formatDateFromSecondUTCD
                }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="proposals-list-main"
          v-show="proposalOpeningLoading && !proposalsOpening.length"
        >
          <div class="proposals-list-item">
            <a-skeleton
              :loading="proposalOpeningLoading && !proposalsOpening.length"
              active
            />
          </div>
        </div>
        <div
          class="base-font-title mt20"
          v-show="
            SNSTokens[currentIndex] &&
            !proposalOpeningLoading &&
            !proposalsOpening.length
          "
        >
          No proposals found for the filters.
        </div>
      </div>
    </div>
    <div
      v-show="!showStill"
      v-infinite-scroll="handleInfiniteOnLoad"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
      :infinite-scroll-immediate-check="false"
      ref="infiniteScroll"
      class="infiniteScroll mt20"
    >
      <div class="container-width">
        <div class="proposals-list-main">
          <div
            class="proposals-list-item"
            v-for="(item, index) in proposals"
            :key="index"
            @click="jumpProposal(item)"
          >
            <div
              class="proposals-list-item-header"
              style="align-items: center; margin-bottom: 10px"
            >
              <span class="base-font-title"
                >ID: {{ item.id[0].id.toString(10) }}</span
              >
              <span
                class="proposals-list-item-header-status margin-left-auto"
                :class="getStatus(item)"
              >
                {{ getStatus(item) }}
              </span>
            </div>
            <div>
              <span class="proposals-list-item-title">
                <span class="base-color-w">
                  {{ item.proposal[0].title }}
                </span>
                <!--{{ item.proposal[0].action | filterAction }}-->
              </span>
            </div>
            <!--<div class="proposals-list-item-type base-font-title">
							<span>Type</span>
							<span class="margin-left-auto">{{
								item.proposal[0].action | filterAction
							}}</span>
						</div>-->
            <div class="proposals-list-item-summary">
              <vue-markdown
                :source="item.proposal[0].summary"
                :linkify="false"
              ></vue-markdown>
            </div>
            <div class="proposals-list-item-footer">
              <span
                v-if="
                  SNSTokens &&
                  SNSTokens[currentIndex] &&
                  SNSTokens[currentIndex].types &&
                  SNSTokens[currentIndex].types[item.action.toString(10)]
                "
              >
                {{
                  SNSTokens[currentIndex].types[item.action.toString(10)]
                    .name === 'Deegister Dapp Canisters'
                    ? 'Deregister Dapp Canisters'
                    : SNSTokens[currentIndex].types[item.action.toString(10)]
                        .name
                }}
              </span>
              <span class="margin-left-auto pc-show" style="flex-shrink: 0">
                {{
                  item.proposal_creation_timestamp_seconds |
                    formatDateFromSecondUTCD
                }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="proposals-list-main"
          v-show="proposalLoading && !proposals.length"
        >
          <div class="proposals-list-item">
            <a-skeleton
              :loading="proposalLoading && !proposals.length"
              active
            />
          </div>
        </div>
        <div
          class="base-font-title mt20"
          v-show="
            SNSTokens[currentIndex] && !proposalLoading && !proposals.length
          "
        >
          No proposals found for the filters.
        </div>
      </div>
    </div>
    <div v-show="loading && busy" class="loading-container">
      <a-spin />
    </div>
    <a-modal
      v-model="topicsVisible"
      centered
      title="Types"
      width="550px"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
      class="proposals-model"
    >
      <div class="filter-checkbox-main">
        <a-checkbox :checked="checkAllTopics" @change="onCheckAllChangeTopics">
          Check all
        </a-checkbox>
        <a-checkbox-group
          class="filter-checkbox"
          v-model="checkTopics"
          v-if="SNSTokens[currentIndex]"
          @change="onCheckChangeTopics"
        >
          <a-checkbox
            v-for="(item, index) in SNSTokens[currentIndex].listTypes"
            :key="index"
            :value="item.id"
          >
            {{
              item.name === 'Deegister Dapp Canisters'
                ? 'Deregister Dapp Canisters'
                : item.name
            }}
          </a-checkbox>
        </a-checkbox-group>
      </div>
      <div slot="footer" class="modal-button">
        <button type="button" @click="topicsVisible = false">Cancel</button>
        <button type="button" class="primary" @click="holdFilter">
          Filter
        </button>
      </div>
    </a-modal>
    <a-modal
      v-model="statusVisible"
      centered
      title="Proposal Status"
      width="450px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterCloseStatus"
    >
      <div class="filter-checkbox-main">
        <a-checkbox :checked="checkAllStatus" @change="onCheckAllChangeStatus">
          Check all
        </a-checkbox>
        <a-checkbox-group
          class="filter-checkbox"
          v-model="checkStatus"
          v-if="SNSTokens[currentIndex]"
          @change="onCheckChangeStatus"
        >
          <a-checkbox
            v-for="(item, index) in proposalStatus"
            :key="index"
            :value="item.id"
          >
            {{ item.name }}
          </a-checkbox>
        </a-checkbox-group>
        <div class="modal-button">
          <button type="button" @click="statusVisible = false">Cancel</button>
          <button type="button" class="primary" @click="holdFilterStatus">
            Filter
          </button>
        </div>
      </div>
    </a-modal>
    <maker-proposal
      v-if="SNSTokens[currentIndex]"
      :currentSNS="SNSTokens[currentIndex]"
      ref="makerProposal"
      @makerProposalSuccess="makerProposalSuccess"
    ></maker-proposal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { proposalsNeurons } from '@/views/home/ICSNS/model';
import EventBus from '@/utils/Event';
import { connectIcx, initIcx } from '@/ic/connectIcx';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { DeployedSns } from '@/ic/SNSWasm/model';
import {
  GetMetadataResponse,
  ListNervousSystemFunctionsResponse,
  ListProposals,
  NervousSystemParameters,
  ProposalData
} from '@/ic/SNSGovernance/model';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import BigNumber from 'bignumber.js';
import MakerProposal from '@/views/home/ICSNS/components/MakerProposal.vue';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { namespace } from 'vuex-class';
import { SNSSwapService } from '@/ic/SNSSwap/SNSSwapService';
import { checkAuth } from '@/ic/CheckAuth';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { Principal } from '@dfinity/principal';

const commonModule = namespace('common');

@Component({
  name: 'Proposals',
  components: {
    MakerProposal
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private SNSWasmService: SNSWasmService = null;
  private SNSTokens: Array<proposalsNeurons> = [];
  private isIcx = false;
  private currentIndex = 0;
  private deployedSnses: Array<DeployedSns> = [];
  private proposals: Array<ProposalData> = [];
  private proposalsOpening: Array<ProposalData> = [];
  private busy = true;
  private loading = false;
  private loadMore = true;
  private proposalLoading = false;
  private proposalOpeningLoading = false;
  private topics = [];
  private checkTopics = [];
  private topicsVisible = false;
  private checkAllTopics = false;
  private proposalStatus = [
    {
      id: 1,
      name: 'Open'
    },
    {
      id: 2,
      name: 'Rejected'
    },
    {
      id: 3,
      name: 'Adopted'
    },
    {
      id: 4,
      name: 'Executed'
    },
    {
      id: 5,
      name: 'Failed'
    }
  ];
  private proposalStatusIds = [1, 2, 3, 4, 5];
  private proposalStatusFilter = [1, 2, 3, 4, 5];
  private statusVisible = false;
  private checkStatus = [];
  private checkAllStatus = false;
  private showLoading = false;
  private showStill = false;
  activated(): void {
    if (!this.getPrincipalId) {
      this.showStill = false;
    }
    if (!this.$route.meta.isBack) {
      this.$nextTick(() => {
        (this.$refs.infiniteScroll as any).scrollTop = 0;
      });
      this.$route.meta.isBack = false;
      if (this.topics.length) {
        let tokenId = this.$route.query.id as string;
        if (tokenId) {
          localStorage.setItem('ICSNSToken', tokenId);
        } else {
          const localToken = localStorage.getItem('ICSNSToken');
          if (localToken) {
            tokenId = localToken;
          }
        }
        if (tokenId && this.SNSTokens.length) {
          this.setCurrentIndex();
          // this.deployedSnses.forEach((item, index) => {
          //   if (
          //     tokenId &&
          //     tokenId.trim() === item.ledger_canister_id.toString()
          //   ) {
          //     this.currentIndex = index;
          //   }
          // });
        }
        this.topics = this.SNSTokens[this.currentIndex].allTopics;
        this.initProposals();
      }
    } else {
      this.getOpenProposals(null);
      this.$nextTick(() => {
        (this.$refs.infiniteScroll as any).scrollTop =
          this.$route.meta.scrollTop;
      });
    }
  }
  mounted(): void {
    if (!this.getPrincipalId) {
      this.showStill = false;
    }
    if (this.$route.meta.details === 'proposals') {
      this.mountedInit();
    }
  }
  private makerProposalSuccess(): void {
    this.initProposals();
  }
  private onMakerProposal(): void {
    (this.$refs.makerProposal as any).visible = true;
    (this.$refs.makerProposal as any).init();
  }
  private async mountedInit(): Promise<void> {
    this.$nextTick(() => {
      (this.$refs.infiniteScroll as any).scrollTop = 0;
    });
    this.$route.meta.isBack = false;
    this.SNSWasmService = new SNSWasmService();
    if ((window as any).icx) {
      this.isIcx = !!(window as any).icx;
      EventBus.$on('initSuccess', () => {
        this.init();
      });
      await initIcx();
    }
    this.init();
  }
  private getStatus(val: ProposalData): string {
    if (val) {
      const now = new Date().getTime();
      if (
        !val.decided_timestamp_seconds ||
        new BigNumber(val.decided_timestamp_seconds.toString(10)).gt(now)
      ) {
        return 'Open';
      }
      if (
        val.executed_timestamp_seconds &&
        new BigNumber(val.executed_timestamp_seconds.toString(10)).lt(now)
      ) {
        return 'Executed';
      }
      if (
        val.failed_timestamp_seconds &&
        new BigNumber(val.failed_timestamp_seconds.toString(10)).lt(now)
      ) {
        return 'Failed';
      }
      if (
        val.decided_timestamp_seconds &&
        new BigNumber(val.decided_timestamp_seconds.toString(10)).lt(now)
      ) {
        const total = val.latest_tally[0].total;
        const yes = val.latest_tally[0].yes;
        const no = val.latest_tally[0].no;
        const votingLeast = new BigNumber(
          val.minimum_yes_proportion_of_total[0].basis_points[0].toString(10)
        )
          .div(100)
          .toNumber();
        // at least votingLeast of the total voting power
        if (
          (new BigNumber(yes.toString()).gt(no.toString(10)) &&
            new BigNumber(total.toString())
              .times(votingLeast / 100)
              .lt(yes.toString())) ||
          new BigNumber(yes.toString()).times(2).gt(total.toString(10))
        ) {
          return 'Adopted';
        } else {
          return 'Rejected';
        }
      }
    }
    return '';
  }
  private handleInfiniteOnLoad(): void {
    if (!this.busy) {
      console.log('handleInfiniteOnLoad');
      this.busy = true;
      this.loading = true;
      this.getListProposals();
    }
  }
  private reloadProposals(): void {
    this.initProposals();
  }
  private initProposals(): void {
    this.busy = true;
    this.loadMore = true;
    this.getListProposals('init');
    this.getOpenProposals(null);
    console.log(this.proposalsOpening);
  }
  private SNSTokensChange(): void {
    console.log(this.currentIndex);
    this.$router
      .replace(
        `/icsns/proposals?id=${this.SNSTokens[this.currentIndex].tokenId}`
      )
      .then();
    localStorage.setItem(
      'ICSNSToken',
      this.SNSTokens[this.currentIndex].tokenId
    );
    this.busy = true;
    this.loadMore = true;
    this.proposalStatusFilter = this.proposalStatusIds;
    this.topics = this.SNSTokens[this.currentIndex].allTopics;
    this.getListProposals('init');
    this.getOpenProposals(null);
    let deployedSns: DeployedSns;
    this.deployedSnses.some((item) => {
      if (
        item.ledger_canister_id[0].toString() ===
        this.SNSTokens[this.currentIndex].tokenId
      ) {
        deployedSns = item;
        return true;
      }
    });
    this.getSNSTokenInfo(deployedSns, true).then(
      async (SNSToken: proposalsNeurons) => {
        if (
          SNSToken.lifecycle &&
          SNSToken.lifecycle.length &&
          Number(SNSToken.lifecycle[0]) !== 4
        ) {
          const sns =
            JSON.parse(localStorage.getItem(`${SNSToken.tokenId}-SNS`)) || {};
          let snsInfo = {
            url: SNSToken.url,
            logo: SNSToken.logo,
            name: SNSToken.name,
            description: SNSToken.description,
            lifecycle: SNSToken.lifecycle,
            nervousSystemParameters: SNSToken.nervousSystemParameters,
            listNervousSystemFunctionsResponse:
              SNSToken.listNervousSystemFunctionsResponse
          };
          if (sns.name !== SNSToken.name) {
            this.$set(this.SNSTokens, this.currentIndex, SNSToken);
            const tokenInfo = await getTokenInfo(
              Principal.fromText(SNSToken.tokenId),
              { icrc1: null }
            );
            snsInfo['symbol'] = tokenInfo.symbol;
            snsInfo['fee'] = tokenInfo.fee;
            snsInfo['decimals'] = tokenInfo.decimals;
          }
          localStorage.setItem(
            `${SNSToken.tokenId}-SNS`,
            JSON.stringify(Object.assign({}, sns, snsInfo), (key, value) =>
              typeof value === 'bigint' ? value.toString(10) : value
            )
          );
          return true;
        }
      }
    );
    console.log(this.proposalsOpening);
  }
  private async getOpenProposals(lastProposals: ProposalData): Promise<void> {
    if (!this.getPrincipalId) {
      this.proposalsOpening = [];
      return;
    }
    if (!lastProposals) {
      this.proposalsOpening = [];
      this.proposalOpeningLoading = true;
    }
    const snsGovernanceService = new SNSGovernanceService();
    let beforeProposal = [];
    if (lastProposals) {
      beforeProposal = lastProposals.id;
    }
    // accepts votes:1
    const openRequest: ListProposals = {
      before_proposal: beforeProposal,
      limit: BigInt(10),
      exclude_type: [],
      include_status: [],
      include_reward_status: [1]
    };
    snsGovernanceService
      .listProposals(
        this.SNSTokens[this.currentIndex].governanceId,
        openRequest,
        true
      )
      .then((res) => {
        console.log(res);
        if (res && res.proposals && res.proposals.length) {
          const accepts = res.proposals.filter((item) => {
            return item.ballots.some((ballot) => {
              return !ballot[1].vote;
            });
          });
          this.proposalsOpening = this.proposalsOpening.concat(accepts);
          console.log(this.proposalsOpening);
          if (res.proposals.length === 10) {
            this.getOpenProposals(res.proposals[res.proposals.length - 1]);
          } else {
            this.proposalOpeningLoading = false;
          }
        } else {
          this.proposalOpeningLoading = false;
        }
      })
      .catch(() => {
        this.proposalOpeningLoading = false;
      });
  }
  private async getListProposals(type?: string): Promise<void> {
    console.log(this.busy);
    if (!this.loadMore) {
      this.busy = false;
      this.loading = false;
      return;
    }
    if (type) {
      // (this.$refs.infiniteScroll as any).scrollTop = 0;
      this.proposals = [];
    }
    this.proposalLoading = true;
    try {
      const snsGovernanceService = new SNSGovernanceService();
      let excludeType: Array<bigint> = [];
      this.SNSTokens[this.currentIndex].allTopics.forEach((item) => {
        const index = this.topics.indexOf(item);
        if (index < 0) {
          excludeType.push(item);
        }
      });
      let beforeProposal = [];
      if (this.proposals.length && !type) {
        beforeProposal = this.proposals[this.proposals.length - 1].id;
      }
      const request: ListProposals = {
        before_proposal: beforeProposal,
        limit: BigInt(10),
        exclude_type: excludeType,
        include_status: this.proposalStatusFilter,
        include_reward_status: []
      };
      console.log(request);
      console.log(this.SNSTokens[this.currentIndex].governanceId);
      const res = await snsGovernanceService.listProposals(
        this.SNSTokens[this.currentIndex].governanceId,
        request
      );
      console.log(res);
      if (res.proposals.length < 10) {
        this.loadMore = false;
      }
      this.proposals = this.proposals.concat(res.proposals);
      console.log(this.proposals);
    } catch (e) {
      console.log(e);
    }
    console.log('end');
    this.busy = false;
    this.loading = false;
    this.proposalLoading = false;
  }
  private init(): void {
    this.listDeployedSnses();
  }
  private async listDeployedSnses(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      let ICLIndex = null;
      const ICLToken = 'hhaaz-2aaaa-aaaaq-aacla-cai';
      this.deployedSnses = await this.SNSWasmService.listDeployedSnses();
      let canisterIds: Array<string> = [];
      this.deployedSnses.forEach((item, index) => {
        if (item.ledger_canister_id.toString() === ICLToken) {
          ICLIndex = index;
        }
        canisterIds = canisterIds.concat([
          item.swap_canister_id.toString(),
          item.governance_canister_id.toString(),
          item.ledger_canister_id.toString()
        ]);
      });
      if (typeof ICLIndex === 'number') {
        const item = this.deployedSnses[ICLIndex];
        this.deployedSnses.splice(ICLIndex, 1);
        this.deployedSnses.unshift(item);
      }
      canisterIds = [...new Set(canisterIds)];
      await checkAuth();
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      const flag = needConnectPlug(canisterIds);
      const principal = localStorage.getItem('principal');
      const priList = JSON.parse(localStorage.getItem('priList')) || {};
      const needConnectInfinity1 = await needConnectInfinity(canisterIds);
      if (
        (priList[principal] === 'Plug' ||
          priList[principal] === 'SignerPlug') &&
        flag &&
        this.$route.name === 'ICSNS-Proposals'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        this.$info({
          content: 'ICSNS token need to be connected to the plug.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          onOk() {
            currentPageConnectPlug(canisterIds).then(async () => {
              _that.initConnected(_that.deployedSnses, loading);
            });
          }
        });
      } else if (
        priList[principal] === 'Infinity' &&
        needConnectInfinity1 &&
        this.$route.name === 'ICSNS-Proposals'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        this.$info({
          content: 'ICSNS token need to be connected to the plug.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          onOk() {
            currentPageConnectInfinity(canisterIds).then(async () => {
              _that.initConnected(_that.deployedSnses, loading);
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
        this.initConnected(this.deployedSnses, loading);
      }
    } catch (e) {
      console.log(e);
      loading.close();
    }
  }
  private async initConnected(
    listDeployedSnses: Array<DeployedSns>,
    loading
  ): Promise<void> {
    console.log(listDeployedSnses);
    const localReject: Array<string> =
      JSON.parse(localStorage.getItem('rejectSNSTokens')) || [];
    listDeployedSnses = listDeployedSnses.filter((item) => {
      return !localReject.includes(item.ledger_canister_id[0].toString());
    });
    this.SNSTokens = new Array(listDeployedSnses.length).fill(null);
    const MAX_COCURRENCY = 40;
    let snsTokensAll = [];
    let snsTokens = [];
    listDeployedSnses.forEach((item, index) => {
      snsTokens.push(item);
      if (snsTokens.length === MAX_COCURRENCY) {
        snsTokensAll.push(snsTokens);
        snsTokens = [];
      }
      if (
        snsTokens.length < MAX_COCURRENCY &&
        index === listDeployedSnses.length - 1
      ) {
        if (snsTokens.length) {
          snsTokensAll.push(snsTokens);
        }
      }
    });
    const localToken = localStorage.getItem('ICSNSToken');
    let index = 0;
    for (let i = 0; i < snsTokensAll.length; i++) {
      const promiseAll = [];
      for (let j = 0; j < snsTokensAll[i].length; j++) {
        promiseAll.push(
          this.getSNSTokenInfo(
            snsTokensAll[i][j],
            localToken &&
              snsTokensAll[i][j].ledger_canister_id[0].toString() === localToken
          )
        );
      }
      const res = await Promise.all(promiseAll);
      this.SNSTokens.splice(index, res.length, ...res);
      index += res.length;
    }
    console.log(this.SNSTokens);
    this.SNSTokens = this.SNSTokens.filter((SNSToken: proposalsNeurons) => {
      if (
        (SNSToken.lifecycle &&
          SNSToken.lifecycle.length &&
          Number(SNSToken.lifecycle[0]) === 4) ||
        (SNSToken.lifecycle && SNSToken.lifecycle.length === 0)
      ) {
        if (!localReject.includes(SNSToken.tokenId)) {
          localReject.push(SNSToken.tokenId);
        }
      }
      if (
        SNSToken.lifecycle &&
        SNSToken.lifecycle.length &&
        Number(SNSToken.lifecycle[0]) !== 4
      ) {
        const sns =
          JSON.parse(localStorage.getItem(`${SNSToken.tokenId}-SNS`)) || {};
        localStorage.setItem(
          `${SNSToken.tokenId}-SNS`,
          JSON.stringify(
            Object.assign({}, sns, {
              url: SNSToken.url,
              logo: SNSToken.logo,
              name: SNSToken.name,
              description: SNSToken.description,
              lifecycle: SNSToken.lifecycle,
              nervousSystemParameters: SNSToken.nervousSystemParameters,
              listNervousSystemFunctionsResponse:
                SNSToken.listNervousSystemFunctionsResponse
            }),
            (key, value) =>
              typeof value === 'bigint' ? value.toString(10) : value
          )
        );
        return true;
      }
    });
    localStorage.setItem('rejectSNSTokens', JSON.stringify(localReject));
    this.setCurrentIndex();
    console.log(this.currentIndex);
    loading.close();
    this.topics = this.SNSTokens[this.currentIndex].allTopics;
    this.getListProposals();
    this.getOpenProposals(null);
    console.log(this.proposalsOpening);
  }
  private setCurrentIndex(): void {
    let tokenId = this.$route.query.id as string;
    if (tokenId) {
      localStorage.setItem('ICSNSToken', tokenId);
    } else {
      const localToken = localStorage.getItem('ICSNSToken');
      if (localToken) {
        tokenId = localToken;
      }
    }
    for (let i = 0; i < this.SNSTokens.length; i++) {
      const currentTokenId = this.SNSTokens[i].tokenId;
      if (tokenId && tokenId.trim() === currentTokenId) {
        this.currentIndex = i;
        break;
      }
    }
  }
  private async getSNSTokenInfo(
    deployedSns: DeployedSns,
    init = false
  ): Promise<proposalsNeurons> {
    const promiseAll = [];
    const ledgerCanisterId = deployedSns.ledger_canister_id[0];
    const governanceCanisterId = deployedSns.governance_canister_id[0];
    const swapCanisterId = deployedSns.swap_canister_id[0];
    promiseAll.push(
      this.getSNSTokenGovernanceInfo(
        governanceCanisterId.toString(),
        ledgerCanisterId.toString(),
        init
      ),
      this.getNervousSystemParameters(
        governanceCanisterId.toString(),
        ledgerCanisterId.toString(),
        init
      ),
      this.getDecimals(ledgerCanisterId.toString(), init),
      this.getListNervousSystemFunctions(governanceCanisterId.toString()),
      this.getName(ledgerCanisterId.toString(), init),
      this.getLifecycle(
        swapCanisterId.toString(),
        ledgerCanisterId.toString(),
        init
      )
    );
    const res = await Promise.all(promiseAll);
    let allTopics = [];
    let types = {};
    console.log(res);
    let listTypes = [];
    if (res[3] && res[3].functions) {
      res[3].functions.forEach((item) => {
        types[item.id.toString(10)] = item;
        if (Number(item.id) !== 0) {
          listTypes.push(item);
          allTopics.push(item.id);
        }
      });
    }
    return {
      tokenId: ledgerCanisterId.toString(),
      governanceId: governanceCanisterId.toString(),
      ...res[0],
      types: types,
      allTopics: allTopics, // allTypes
      listTypes: listTypes,
      nervousSystemParameters: res[1],
      decimals: res[2],
      lifecycle: res[5]
    };
  }
  private async getSNSTokenGovernanceInfo(
    governance: string,
    tokenId: string,
    init = false
  ): Promise<GetMetadataResponse> {
    const info = JSON.parse(localStorage.getItem(`${tokenId}-SNS`)) || {};
    if (
      !init &&
      info &&
      info.name &&
      info.name instanceof Array &&
      info.name[0]
    ) {
      return {
        url: info.url,
        logo: info.logo,
        name: info.name,
        description: info.description
      };
    }
    const snsGovernanceService = new SNSGovernanceService();
    return await snsGovernanceService.getMetadata(governance);
  }
  private async getNervousSystemParameters(
    governanceId: string,
    tokenId: string,
    init = false
  ): Promise<NervousSystemParameters> {
    const info = JSON.parse(localStorage.getItem(`${tokenId}-SNS`)) || {};
    if (!init && info && info.nervousSystemParameters) {
      return info.nervousSystemParameters;
    }
    const snsGovernanceService = new SNSGovernanceService();
    try {
      return await snsGovernanceService.getNervousSystemParameters(
        governanceId
      );
    } catch (e) {
      return null;
    }
  }
  private async getDecimals(
    ledgerCanisterId: string,
    init = false
  ): Promise<number> {
    const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (
      !init &&
      tokens[ledgerCanisterId] &&
      tokens[ledgerCanisterId].decimals
    ) {
      return Number(tokens[ledgerCanisterId].decimals);
    }
    const DRC20Token = new DRC20TokenService();
    return await DRC20Token.icrcDecimals(ledgerCanisterId);
  }
  private async getName(
    ledgerCanisterId: string,
    init = false
  ): Promise<string> {
    const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (!init && tokens[ledgerCanisterId] && tokens[ledgerCanisterId].name) {
      return tokens[ledgerCanisterId].name;
    }
    const DRC20Token = new DRC20TokenService();
    return await DRC20Token.icrcName(ledgerCanisterId);
  }
  private async getLifecycle(
    swapCanisterId: string,
    tokenId: string,
    init = false
  ): Promise<Array<bigint>> {
    const info = JSON.parse(localStorage.getItem(`${tokenId}-SNS`)) || {};
    const completed = [3, 4];
    if (
      !init &&
      info &&
      info.lifecycle &&
      completed.includes(Number(info.lifecycle))
    ) {
      return info.lifecycle;
    }
    const snsSwapService = new SNSSwapService();
    const res = await snsSwapService.getLifecycle(swapCanisterId);
    return res.lifecycle;
  }
  private async getListNervousSystemFunctions(
    governanceCanisterId: string
  ): Promise<ListNervousSystemFunctionsResponse> {
    try {
      const snsGovernanceService = new SNSGovernanceService();
      return await snsGovernanceService.listNervousSystemFunctions(
        governanceCanisterId
      );
    } catch (e) {
      console.log(e);
    }
  }
  private onCheckChangeTopics(): void {
    this.checkAllTopics =
      this.checkTopics.length >=
      this.SNSTokens[this.currentIndex].allTopics.length;
  }
  private onCheckChangeStatus(): void {
    this.checkAllStatus =
      this.checkStatus.length >= this.proposalStatusIds.length;
  }
  private onCheckAllChangeTopics(e): void {
    Object.assign(this, {
      checkTopics: e.target.checked
        ? this.SNSTokens[this.currentIndex].allTopics
        : [],
      checkAllTopics: e.target.checked
    });
  }
  private onCheckAllChangeStatus(e): void {
    Object.assign(this, {
      checkStatus: e.target.checked ? this.proposalStatusIds : [],
      checkAllStatus: e.target.checked
    });
  }
  private onFilterTopics(): void {
    this.checkTopics = this.topics;
    this.topicsVisible = true;
    this.onCheckChangeTopics();
  }
  private holdFilter(): void {
    this.topics = this.checkTopics;
    this.topicsVisible = false;
    console.log(this.topics);
    this.initProposals();
  }
  private filterStatus(): void {
    this.checkStatus = this.proposalStatusFilter;
    this.statusVisible = true;
    this.onCheckChangeStatus();
  }
  private holdFilterStatus(): void {
    this.proposalStatusFilter = this.checkStatus;
    this.statusVisible = false;
    console.log(this.proposalStatusFilter);
    this.initProposals();
  }
  private afterClose(): void {
    this.checkAllTopics = false;
  }
  private afterCloseStatus(): void {
    this.checkAllStatus = false;
  }
  private jumpProposal(proposal: ProposalData): void {
    this.$router.push(
      `/icsns/proposals/${
        this.SNSTokens[this.currentIndex].tokenId
      }/${proposal.id[0].id.toString(10)}`
    );
  }
}
</script>

<style scoped lang="scss">
.proposals-main {
  position: relative;
  margin-top: -10px;
  .neurons-list {
    display: flex;
    flex-wrap: wrap;
    .proposals-button-filter {
      &:hover {
        background: #1a2a33;
        color: #b4bacd;
      }
    }
    .neurons-list-header-option {
      min-width: 200px;
      margin-right: 20px;
      margin-top: 10px;
      ::v-deep .ant-select-selection__rendered {
        line-height: 36px;
      }
    }
    button {
      width: auto;
      height: 36px;
      padding: 0 10px;
      margin-right: 10px;
      margin-top: 10px;
      line-height: 36px;
      font-size: 14px;
      &.maker-Proposal {
        margin-right: 0;
      }
      i {
        margin-right: 5px;
        font-size: 14px;
      }
    }
    .load-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      color: #adb3c4;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
}
.filter-checkbox-main {
  ::v-deep .ant-checkbox-wrapper {
    margin-left: 0;
    padding: 10px 0;
    color: #adb3c4;
  }
}
.can-still {
  display: flex;
  align-items: center;
  height: 36px;
  margin: 10px 5px 0 5px;
  ::v-deep .ant-checkbox-wrapper {
    color: #adb3c4;
  }
}
.filter-checkbox {
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
}
.modal-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 30px;
  button {
    margin-left: 10px;
  }
}
.infiniteScroll {
  width: 100%;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  overflow-x: hidden;
}
.proposals-list-main {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.proposals-list-item {
  display: flex;
  flex-direction: column;
  width: 490px;
  padding: 16px;
  margin-top: 15px;
  background: #131920;
  color: #8c98a5;
  border: 1px solid #212b35;
  border-radius: 10px;
  cursor: pointer;
  &:first-child,
  &:nth-child(2) {
    margin-top: 0;
  }
  .proposals-list-item-footer {
    display: flex;
    align-items: flex-start;
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid #212b35;
  }
}
.loading-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  ::v-deep .el-loading-spinner {
    position: static;
    margin-top: 0;
  }
}
.proposals-list-item-header {
  display: flex;
  align-items: flex-start;
  .proposals-list-item-header-status {
    margin-left: auto;
    line-height: 20px;
    &.Open {
      color: #faad14;
    }
    &.Adopted {
      color: #51b7c3;
    }
    &.Executed {
      color: #21c77d;
    }
  }
}
.proposals-list-item-header-name {
  font-size: 16px;
  color: #adb3c4;
}
.proposals-list-item-type {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.proposals-list-item-title {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  word-break: break-word;
  font-size: 16px;
  color: #adb3c4;
  line-height: 20px;
  padding-right: 10px;
  a {
    color: #1996c4;
  }
}
.pc-show {
  display: block;
}
.h5-show {
  display: none;
}
@media screen and (max-width: 1000px) {
  .container-width {
    width: 100%;
  }
  .neurons-list {
    width: 100%;
    padding: 0 15px;
  }
  .proposals-list-item {
    width: 100%;
    &:nth-child(2) {
      margin-top: 15px;
    }
  }
  .infiniteScroll {
    padding: 0 15px;
  }
}
@media screen and (max-width: 768px) {
  .pc-show {
    display: none;
  }
  .h5-show {
    display: block;
  }
  .proposals-main {
    width: 100%;
    .neurons-list {
      position: relative;
      flex-direction: column;
      .neurons-list-header-option {
        width: 200px;
        max-width: calc(100% - 160px);
        min-width: auto;
      }
      button {
        width: 200px;
        padding: 0;
        max-width: calc(100% - 160px);
        margin-right: 0;
        text-align: left;
        &.maker-Proposal {
          position: absolute;
          top: 0;
          right: 15px;
          width: auto;
          padding: 0 10px;
        }
      }
    }
  }
  .infiniteScroll {
    max-height: calc(100vh - 340px);
    padding: 0 15px;
  }
}
.proposals-model {
  ::v-deep {
    .ant-modal-footer {
      padding: 0 55px;
      border: none;
    }
    .ant-modal-body {
      max-height: calc(100vh - 240px);
    }
  }
}
</style>
<style lang="scss">
.proposals-list-item-summary {
  margin-top: 10px;
  margin-bottom: 10px;
  word-break: break-word;
  line-height: 18px;
  max-height: 54px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 16px;
    color: #adb3c4;
  }
  a {
    color: #1996c4;
  }
}
</style>
