<template>
  <div class="proposals-main">
    <div class="container-width">
      <div class="proposals-main-header">
        <div class="neurons-list">
          <button
            @click="onFilterTopics"
            type="button"
            class="proposals-button-filter"
          >
            <a-icon type="filter" />
            Types ({{ topics.length }}/{{ topicInfo.length }})
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
            <a-checkbox v-model="showStill" @change="changeStill">
              Show only proposals you can still vote for
            </a-checkbox>
          </div>
          <button
            v-show="getPrincipalId"
            type="button"
            class="primary margin-left-auto maker-Proposal"
            @click="onMakeProposal"
          >
            Make Proposal
          </button>
        </div>
      </div>
    </div>
    <div
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
            v-for="(item, index) in stillProposals"
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
                  {{ item.proposal[0].title[0] }}
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
              <span>
                {{
                  Number(item.topic) === 0
                    ? 'unspecified'
                    : functionsName[item.topic]
                }}
              </span>
              <span class="margin-left-auto pc-show" style="flex-shrink: 0">
                {{ item.proposal_timestamp_seconds | formatDateFromSecondUTCD }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="proposals-list-main"
          style="margin-top: 0"
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
          v-show="!proposalLoading && !stillProposals.length"
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
      title="Topics"
      width="550px"
      :keyboard="false"
      :maskClosable="false"
      class="proposals-model"
    >
      <div class="filter-checkbox-main">
        <a-checkbox :checked="checkAllTopics" @change="onCheckAllChangeTopics">
          Check all
        </a-checkbox>
        <a-checkbox-group
          class="filter-checkbox"
          v-model="checkTopics"
          @change="onCheckChangeTopics"
        >
          <a-checkbox
            v-for="(item, index) in topicInfo"
            :key="index"
            :value="item.id"
          >
            {{ item.info.title }}
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
    >
      <div class="filter-checkbox-main">
        <a-checkbox :checked="checkAllStatus" @change="onCheckAllChangeStatus">
          Check all
        </a-checkbox>
        <a-checkbox-group
          class="filter-checkbox"
          v-model="checkStatus"
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
    <make-proposal
      ref="makeProposal"
      @makeProposalSuccess="makeProposalSuccess"
    ></make-proposal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  AllTopicsId,
  AllTopicsIdExcludeRate,
  FunctionsName,
  TopicInfo
} from '@/views/home/neurons/model';
import { namespace } from 'vuex-class';
import { Ballot, listProposalsReq, ProposalInfo } from '@/ic/governance/model';
import { GovernanceService } from '@/ic/governance/governanceService';
import EventBus from '@/utils/Event';
import { initIcx } from '@/ic/connectIcx';
import MakeProposal from '@/views/home/neurons/components/MakeProposal.vue';
const commonModule = namespace('common');
const allTopicsIdExcludeRate = AllTopicsIdExcludeRate;
const proposalStatusInfo = {
  1: 'Open',
  2: 'Rejected',
  3: 'Adopted',
  4: 'Executed',
  5: 'Failed'
};
@Component({
  name: 'Proposals',
  components: {
    MakeProposal
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private isIcx = false;
  private functionsName = FunctionsName;
  private governanceService: GovernanceService = null;
  private proposals: Array<ProposalInfo> = [];
  private stillProposals: Array<ProposalInfo> = [];
  private proposalLoading = false;
  private topicInfo = TopicInfo.slice(1);
  private allTopicsId = AllTopicsId;
  private topics = [];
  private checkTopics = [];
  private topicsVisible = false;
  private checkAllTopics = false;
  private checkStatus = [];
  private showStill = false;
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
  private proposalRewardStatusIds = [0, 1, 2, 3, 4];
  private statusVisible = false;
  private checkAllStatus = false;
  private busy = true;
  private loading = false;
  private loadMore = true;
  activated(): void {
    if (!this.$route.meta.isBack) {
      this.$nextTick(() => {
        (this.$refs.infiniteScroll as any).scrollTop = 0;
      });
      this.$route.meta.isBack = false;
      if (!this.governanceService) {
        this.governanceService = new GovernanceService();
      }
      this.init_();
    } else {
      this.$nextTick(() => {
        (this.$refs.infiniteScroll as any).scrollTop =
          this.$route.meta.scrollTop;
      });
      if (!this.governanceService) {
        this.governanceService = new GovernanceService();
        this.init_();
      }
    }
  }
  mounted(): void {
    // this.governanceService = new GovernanceService();
  }
  private makeProposalSuccess(): void {
    this.getListProposals('init');
  }
  private init_(): void {
    this.mountedInit();
  }
  private async mountedInit(): Promise<void> {
    this.$nextTick(() => {
      (this.$refs.infiniteScroll as any).scrollTop = 0;
    });
    this.$route.meta.isBack = false;
    if ((window as any).icx) {
      this.isIcx = !!(window as any).icx;
      EventBus.$on('initSuccess', () => {
        this.init();
      });
      await initIcx();
    }
    this.init();
  }
  private init(): void {
    this.topics = allTopicsIdExcludeRate;
    this.getListProposals('init');
  }
  private getStatus(val: ProposalInfo): string {
    if (val) {
      return proposalStatusInfo[Number(val.status)];
    }
    return '';
  }
  private onMakeProposal(): void {
    (this.$refs.makeProposal as any).visible = true;
    (this.$refs.makeProposal as any).init();
  }
  private handleInfiniteOnLoad(): void {
    if (!this.busy) {
      this.busy = true;
      this.loading = true;
      this.getListProposals();
    }
  }
  private jumpProposal(proposal: ProposalInfo): void {
    this.$router.push(`/nns/proposals/${proposal.id[0].id.toString(10)}`);
  }
  private onFilterTopics(): void {
    this.checkTopics = this.topics;
    this.topicsVisible = true;
    this.onCheckChangeTopics();
  }
  private onCheckChangeTopics(): void {
    this.checkAllTopics = this.checkTopics.length >= this.topicInfo.length;
  }
  private onCheckAllChangeStatus(e): void {
    Object.assign(this, {
      checkStatus: e.target.checked ? this.proposalStatusIds : [],
      checkAllStatus: e.target.checked
    });
  }
  private onCheckAllChangeTopics(e): void {
    Object.assign(this, {
      checkTopics: e.target.checked ? this.allTopicsId : [],
      checkAllTopics: e.target.checked
    });
  }
  private holdFilter(): void {
    this.topics = this.checkTopics;
    this.topicsVisible = false;
    this.initProposals();
  }
  private holdFilterStatus(): void {
    this.proposalStatusFilter = this.checkStatus;
    this.statusVisible = false;
    this.initProposals();
  }
  private initProposals(): void {
    this.busy = true;
    this.loadMore = true;
    this.getListProposals('init');
  }
  private changeStill(): void {
    this.initProposals();
  }
  private async getListProposals(type?: string): Promise<void> {
    if (!this.loadMore) {
      this.busy = false;
      this.loading = false;
      return;
    }
    if (type) {
      this.proposals = [];
    }
    this.proposalLoading = true;
    try {
      let excludeType: Array<number> = [];
      this.allTopicsId.forEach((item) => {
        const index = this.topics.indexOf(item);
        if (index < 0) {
          excludeType.push(item);
        }
      });
      let beforeProposal = [];
      if (this.proposals.length && !type) {
        beforeProposal = this.proposals[this.proposals.length - 1].id;
      }
      let include_reward_status = this.proposalRewardStatusIds;
      if (this.showStill) {
        include_reward_status = [1];
      }
      const request: listProposalsReq = {
        before_proposal: beforeProposal,
        limit: BigInt(100),
        exclude_topic: excludeType,
        include_status: this.proposalStatusFilter,
        include_reward_status: include_reward_status,
        include_all_manage_neuron_proposals: [true]
      };
      const res = await this.governanceService.listProposals(request);
      if (res && res.proposal_info && res.proposal_info.length < 100) {
        this.loadMore = false;
      }
      this.proposals = this.proposals.concat(res.proposal_info);
      this.filterStill();
    } catch (e) {
    }
    this.busy = false;
    this.loading = false;
    this.proposalLoading = false;
    if (this.loadMore && this.showStill) {
      this.busy = true;
      this.loading = true;
      this.getListProposals();
    }
  }
  private filterStill(): void {
    if (this.showStill) {
      this.stillProposals = this.proposals.filter((proposal: ProposalInfo) => {
        return proposal.ballots.some((item: [bigint, Ballot]) => {
          return (
            Number(proposal.reward_status) === 1 && Number(item[1].vote) === 0
          );
        });
        // const proposalId = proposal.id[0].id.toString();
        // if (Number(proposal.reward_status) === 1) {
        //   return this.neuronList.some((neuron: Neuron) => {
        //     return neuron.recent_ballots.every((ballotInfo: BallotInfo) => {
        //       return ballotInfo.proposal_id[0].id.toString() !== proposalId;
        //     });
        //   });
        // }
      });
    } else {
      this.stillProposals = this.proposals;
    }
  }
  private filterStatus(): void {
    this.checkStatus = this.proposalStatusFilter;
    this.statusVisible = true;
    this.onCheckChangeStatus();
  }
  private onCheckChangeStatus(): void {
    this.checkAllStatus =
      this.checkStatus.length >= this.proposalStatusIds.length;
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
  }
}
.proposals-list-main {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: -15px;
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
.filter-checkbox-main {
  ::v-deep .ant-checkbox-wrapper {
    margin-left: 0;
    padding: 10px 0;
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
.can-still {
  display: flex;
  align-items: center;
  height: 36px;
  line-height: 36px;
  margin-left: 20px;
  margin-top: 10px;
  ::v-deep .ant-checkbox-wrapper {
    color: #adb3c4;
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
  .can-still {
    margin-left: 0;
    line-height: 20px;
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
