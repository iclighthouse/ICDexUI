<template>
  <div class="container-width proposal-main">
    <div class="proposal-main-title">
      <a-icon class="back-arrow" type="arrow-left" @click="back" />
      <span v-if="proposal" class="proposal-token-name"> </span>
    </div>
    <div v-if="proposal" class="proposal-title">
      <span>
        {{ proposal.proposal[0].title }}
      </span>
      <!--<a
        v-if="proposal.proposal[0].url"
        :href="proposal.proposal[0].url"
        @click.stop
        target="_blank"
        rel="nofollow noreferrer noopener"
        >{{ proposal.proposal[0].title }}</a
      >
      <span v-else>
        {{ proposal.proposal[0].title }}
      </span>-->
    </div>
    <div class="proposal-data">
      <div class="proposal-data-main">
        <div class="proposal-item" v-if="proposal">
          <div class="proposal-item-info">
            <span>Proposal Id</span>
            <span class="margin-left-auto">
              {{ proposal.id[0].id.toString(10) }}
            </span>
          </div>
          <div class="proposal-item-info">
            <span>Type</span>
            <span class="margin-left-auto">{{
              proposal.proposal[0].action | filterAction
            }}</span>
          </div>
          <div class="proposal-item-info">
            <span>Status</span>
            <span class="margin-left-auto">
              {{ getStatus(proposal) }}
            </span>
          </div>
          <div class="proposal-item-info">
            <span>Created</span>
            <span class="margin-left-auto">
              {{
                proposal.proposal_creation_timestamp_seconds
                  | formatDateFromSecondUTC
              }}
            </span>
          </div>
          <div
            v-if="proposal.decided_timestamp_seconds"
            class="proposal-item-info"
          >
            <span>Decided</span>
            <span class="margin-left-auto">
              {{ proposal.decided_timestamp_seconds | formatDateFromSecondUTC }}
            </span>
          </div>
          <div
            v-if="proposal.executed_timestamp_seconds"
            class="proposal-item-info"
          >
            <span>Executed</span>
            <span class="margin-left-auto">
              {{
                proposal.executed_timestamp_seconds | formatDateFromSecondUTC
              }}
            </span>
          </div>
          <div
            v-if="proposal.failed_timestamp_seconds"
            class="proposal-item-info"
          >
            <span>Failed</span>
            <span class="margin-left-auto">
              {{ proposal.failed_timestamp_seconds | formatDateFromSecondUTC }}
            </span>
          </div>
          <div class="proposal-item-info">
            <span>Proposer Neuron-id</span>
            <span class="margin-left-auto">
              <copy-account
                :account="arrayToString(proposal.proposer[0].id)"
                copy-text=""
              ></copy-account>
            </span>
          </div>
          <div class="proposal-item-info">
            <span>Reject Cost</span>
            <span
              v-if="nervousSystemParameters && tokenInfo"
              class="margin-left-auto"
            >
              {{
                nervousSystemParameters.reject_cost_e8s
                  | bigintToFloat(tokenInfo.decimals, tokenInfo.decimals)
              }}
              {{ tokenInfo.symbol }}
            </span>
          </div>
          <div
            v-if="proposal && proposal.proposal && proposal.proposal[0].url"
            class="proposal-item-info"
          >
            <span>Url</span>
            <span
              class="margin-left-auto"
              style="line-height: 1; text-align: right; word-break: break-word"
            >
              {{ proposal.proposal[0].url }}
            </span>
          </div>
        </div>
        <div
          class="proposal-item"
          style="line-height: 1.2"
          v-if="
            proposal &&
            getStatus(proposal) === 'Failed' &&
            proposal.failure_reason.length
          "
        >
          <div class="proposal-item-title">Failure reason</div>
          <div>{{ proposal.failure_reason[0].error_message }}</div>
        </div>
        <div class="proposal-item pc-show" v-if="proposal">
          <div class="proposal-item-title">Summary</div>
          <vue-markdown
            class="markdown-info"
            :source="proposal.proposal[0].summary"
            :linkify="false"
          ></vue-markdown>
        </div>
        <div class="proposal-item pc-show" v-if="proposal">
          <div class="proposal-item-title">Payload</div>
          <vue-markdown
            class="markdown-info"
            :source="proposal.payload_text_rendering[0]"
            :linkify="false"
          ></vue-markdown>
        </div>
      </div>
      <div class="proposal-data-main proposal-item-voting" v-if="proposal">
        <div class="proposal-item-results proposal-item">
          <div class="proposal-item-title">Voting Results</div>
          <div class="proposal-result">
            <div class="proposal-result-top">
              <div class="proposal-result-yes">
                <div>Yes</div>
                <div class="proposal-result-top-num base-green">
                  <span>{{ votingYes }}</span> %
                </div>
              </div>
              <div class="proposal-result-no margin-left-auto">
                <div>No</div>
                <div class="proposal-result-top-num base-red">
                  <span>{{ votingNo }}</span> %
                </div>
              </div>
            </div>
            <div class="proposal-result-progress">
              <div class="voting-least" :style="{ left: `${votingLeast}` }">
                <a-icon type="down" />
                <span></span>
              </div>
              <div
                class="voting-least voting-absolute"
                :style="{ left: `${votingAbsolute}` }"
              >
                <a-icon type="caret-down" />
                <span></span>
              </div>
              <div
                :style="{ width: votingYes + '%' }"
                class="proposal-result-progress-yse"
              ></div>
              <div
                :style="{ width: votingNo + '%' }"
                class="proposal-result-progress-no"
              ></div>
            </div>
            <div class="voting-power">
              <div
                class="voting-power-latest-tally voting-power-latest-tally-yes"
              >
                <div>Voting Power</div>
                <div v-if="tokenInfo" class="voting-power-num">
                  {{
                    proposal.latest_tally[0].yes
                      | bigintToFloat(2, tokenInfo.decimals)
                      | formatNum
                  }}
                </div>
              </div>
              <div class="pc-show" v-show="canVote">
                <div>Voting Period Remaining</div>
                <div class="voting-power-num">
                  <a-statistic-countdown
                    class="voting-power-countdown-proposal"
                    :value="deadline"
                    format="DD:HH:mm:ss"
                  />
                </div>
              </div>
              <div
                class="voting-power-latest-tally voting-power-latest-tally-no"
              >
                <div>Voting Power</div>
                <div v-if="tokenInfo" class="voting-power-num">
                  {{
                    proposal.latest_tally[0].no
                      | bigintToFloat(2, tokenInfo.decimals)
                      | formatNum
                  }}
                </div>
              </div>
            </div>
            <div v-show="canVote" class="h5-show voting-power-countdown-h5">
              <span>Voting Period Left:</span>
              <a-statistic-countdown
                class="voting-power-countdown-proposal"
                :value="deadline"
                format="DD:HH:mm:ss"
              />
            </div>
          </div>
          <div v-show="canVote" class="proposal-button">
            <button
              v-show="getPrincipalId"
              class="proposal-button-adopt"
              type="button"
              @click="showVote(1)"
            >
              Adopt
            </button>
            <button
              v-show="getPrincipalId"
              class="proposal-button-reject"
              type="button"
              @click="showVote(2)"
            >
              Reject
            </button>
            <button
              v-show="!getPrincipalId"
              class="primary"
              type="button"
              @click="connectWallet"
            >
              Sign in to vote
            </button>
          </div>
          <div v-show="getPrincipalId" class="neurons-main mt20">
            <div>
              <span
                v-show="hasBallots.length || getStatus(proposal) === 'Open'"
              >
                Neurons
              </span>
              <!--<span v-show="SNSNeurons.length && getStatus(proposal) === 'Open'">
								({{ checked ? 1 : 0 }}/{{ SNSNeurons.length }})
							</span>-->
            </div>
            <a-icon
              v-show="hasBallots.length || getStatus(proposal) === 'Open'"
              class="show-neurons-main pointer"
              :class="{ 'show-neurons-main-show': showNeurons }"
              type="down-circle"
              @click="showNeurons = !showNeurons"
            />
          </div>
          <div v-show="showNeurons">
            <div
              v-show="hasBallots.length && getPrincipalId"
              class="neurons-list neurons-list-votes"
            >
              <p>My Votes</p>
              <div
                class="neurons-list-vote"
                v-for="Ballots in hasBallots"
                :key="Ballots[0]"
              >
                <div>{{ Ballots[0] | ellipsisAccount }}</div>
                <div class="margin-left-auto">
                  <span v-if="tokenInfo">
                    {{
                      Ballots[1].voting_power
                        | bigintToFloat(2, tokenInfo.decimals, 0)
                        | formatNum
                    }}
                  </span>
                  <span
                    :class="{
                      'neurons-list-vote-yes': Number(Ballots[1].vote) === 1,
                      'neurons-list-vote-no': Number(Ballots[1].vote) === 2
                    }"
                  >
                    <a-icon type="like" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="proposal-tip base-font-tip mt20">
            <div>There are two ways a proposal can be decided:</div>
            <div style="margin-top: 10px">
              1.Immediate Majority Decision:
              <span v-show="parseFloat(votingLeast) <= 3">
                A proposal is immediately adopted or rejected if, before the
                voting period ends, more than half of the total voting power
                votes Yes, or at least half votes No, respectively (indicated by
                <a-icon type="caret-down" />).
              </span>
              <span v-show="parseFloat(votingLeast) > 3">
                A critical proposal is immediately adopted or rejected if,
                before the voting period ends, more than {{ votingAbsolute }} of
                the total voting power votes Yes, or at least
                {{ Math.floor(100 - parseFloat(votingAbsolute)) }}% votes No,
                respectively (indicated by <a-icon type="caret-down" />).
              </span>
            </div>
            <div>
              2.Simple Majority: When the voting period ends, a proposal is
              adopted if a simple majority (more than {{ votingAbsolute }} of
              the votes cast) has voted Yes and those votes constitute at least
              {{ votingLeast }} of the total voting power (indicated by
              <a-icon type="down" /> delimiter above). Otherwise, the proposal
              is rejected. Before a proposal is decided by Simple Majority, the
              voting period can be extended in order to “wait for quiet”. Such
              voting period extensions occur when a proposal’s voting results
              turn from either a Yes majority to a No majority or vice versa.
            </div>
          </div>
        </div>
        <div v-if="votingList.length" class="voting-history proposal-item">
          <p class="proposal-item-title">Voting History</p>
          <RecycleScroller
            style="height: 250px"
            v-infinite-scroll="handleInfiniteOnLoad"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
            :infinite-scroll-immediate-check="false"
            :items="votingList"
            :item-size="25"
          >
            <div slot-scope="{ item }" class="state-info-item-scroller">
              <div style="margin-right: 10px">
                <span class="pc-show">
                  {{
                    item.ballot.cast_timestamp_seconds
                      | formatDateFromSecondUTCM
                  }}
                </span>
                <span class="h5-show">
                  {{
                    item.ballot.cast_timestamp_seconds
                      | formatDateFromSecondUTCMD
                  }}
                </span>
              </div>
              <copy-account :account="item.id" copy-text=""> </copy-account>
              <div class="margin-left-auto">
                <span v-if="tokenInfo">
                  {{
                    item.ballot.voting_power
                      | bigintToFloat(2, tokenInfo.decimals, 0)
                      | formatNum
                  }}
                </span>
                <span
                  :class="{
                    'neurons-list-vote-yes': Number(item.ballot.vote) === 1,
                    'neurons-list-vote-no': Number(item.ballot.vote) === 2
                  }"
                >
                  <a-icon type="like" />
                </span>
              </div>
            </div>
          </RecycleScroller>
        </div>
      </div>
      <div class="proposal-data-main proposal-item h5-show" v-if="proposal">
        <div class="proposal-item-title">Summary</div>
        <vue-markdown
          class="markdown-info"
          :source="proposal.proposal[0].summary"
          :linkify="false"
        ></vue-markdown>
      </div>
      <div class="proposal-data-main proposal-item h5-show" v-if="proposal">
        <div class="proposal-item-title">Payload</div>
        <vue-markdown
          class="markdown-info"
          :source="proposal.payload_text_rendering[0]"
          :linkify="false"
        ></vue-markdown>
      </div>
    </div>
    <a-modal
      v-model="voteVisible"
      centered
      :title="vote === 1 ? 'Adopt Proposal' : 'Reject Proposal'"
      width="600px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <div>
        <div class="neurons-main-Power base-font-title">
          <span> Neurons </span>
          <div v-if="!proposalIsLarge" class="margin-left-auto">
            Voting Power
            <span>{{ votingPower }}</span>
          </div>
        </div>
        <div v-if="!proposalIsLarge" class="neurons-list">
          <span v-if="!SNSNeurons.length">
            You have no Neurons that are eligible to vote on this proposal.
          </span>
          <!--<a-checkbox>
						Check all
					</a-checkbox>-->
          <a-checkbox-group class="filter-checkbox" v-model="checked">
            <a-checkbox
              :value="arrayToString(neuron.id[0].id)"
              class="neurons-list-checkbox"
              @change="onchange($event, neuron)"
              v-for="neuron in SNSNeurons"
              :key="arrayToString(neuron.id[0].id)"
            >
              <span>
                {{ arrayToString(neuron.id[0].id) | ellipsisAccount }}
              </span>
              <span
                v-if="nervousSystemParameters"
                class="neurons-list-checkbox-power"
              >
                {{ neuron.votingPower }}
              </span>
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <div v-if="proposalIsLarge" class="neurons-list">
          <span v-if="!canVoteNeurons.length">
            You have no Neurons that are eligible to vote on this proposal.
          </span>
          <a-checkbox-group class="filter-checkbox" v-model="checked">
            <a-checkbox
              :value="arrayToString(neuron.id[0].id)"
              class="neurons-list-checkbox"
              @change="onchange($event, neuron)"
              v-for="neuron in canVoteNeurons"
              :key="arrayToString(neuron.id[0].id)"
            >
              <span>
                {{ arrayToString(neuron.id[0].id) | ellipsisAccount }}
              </span>
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <!--<div>
          You are about to cast {{ votingPower }} votes for this proposal, are
          you sure you want to proceed?
        </div>-->
        <div class="visible-button">
          <button
            type="button"
            class="primary large-primary w100"
            :disabled="!votingPower || Number(votingPower) === 0"
            @click="onVote()"
          >
            {{ vote === 1 ? 'Adopt' : 'Reject' }}
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventBus from '@/utils/Event';
import { connectIcx, initIcx } from '@/ic/connectIcx';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { DeployedSns } from '@/ic/SNSWasm/model';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import {
  Ballot,
  GovernanceError,
  ListNeurons,
  ListProposals,
  NervousSystemParameters,
  ProposalData,
  SNSNeuron,
  SNSNeuronId
} from '@/ic/SNSGovernance/model';
import BigNumber from 'bignumber.js';
import { hexToBytes, toHexString } from '@/ic/converter';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { Principal } from '@dfinity/principal';
import { TokenInfo } from '@/ic/common/icType';
import { namespace } from 'vuex-class';
import { checkAuth } from '@/ic/CheckAuth';

const commonModule = namespace('common');

@Component({
  name: 'Proposal',
  components: {},
  filters: {
    filterAction(val): string {
      if (val && val[0]) {
        return Object.keys(val[0])[0];
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private SNSWasmService: SNSWasmService = null;
  private isIcx = false;
  private proposal: ProposalData = null;
  private proposalIsLarge = false;
  private tokenInfo: TokenInfo = null;
  private nervousSystemParameters: NervousSystemParameters = null;
  private SNSNeurons: Array<SNSNeuron> = [];
  private allSNSNeurons: Array<SNSNeuron> = [];
  private canVoteNeurons: Array<SNSNeuron> = [];
  private governanceId: string = null;
  private votingPower = '0.00';
  private checked = [];
  private showNeurons = false;
  private deadline = 0;
  private voteVisible = false;
  private vote = 0;
  private hasBallots: Array<[string, Ballot]> = [];
  private votingList: Array<{ id: string; ballot: Ballot }> = [];
  private busy = true;
  private hasPath = '';
  private votingLeast = '3%';
  private votingAbsolute = '50%';
  private timer = null;
  get votingYes(): string {
    if (this.proposal) {
      const total = this.proposal.latest_tally[0].total;
      const yes = this.proposal.latest_tally[0].yes;
      return new BigNumber(yes.toString(10))
        .div(total.toString(10))
        .times(100)
        .decimalPlaces(2, 1)
        .toString(10);
    }
    return '0';
  }
  get votingNo(): string {
    if (this.proposal) {
      const total = this.proposal.latest_tally[0].total;
      const no = this.proposal.latest_tally[0].no;
      return new BigNumber(no.toString(10))
        .div(total.toString(10))
        .times(100)
        .decimalPlaces(2, 1)
        .toString(10);
    }
    return '0';
  }
  get canVote(): boolean {
    if (this.proposal) {
      const type = this.getStatus(this.proposal);
      if (type === 'Open') {
        return true;
      } else {
        if (this.proposal.wait_for_quiet_state.length) {
          return new BigNumber(
            this.proposal.wait_for_quiet_state[0].current_deadline_timestamp_seconds.toString(
              10
            )
          )
            .times(1000)
            .gt(new Date().getTime());
        } else {
          return new BigNumber(
            this.proposal.proposal_creation_timestamp_seconds.toString(10)
          )
            .plus(this.proposal.initial_voting_period_seconds.toString(10))
            .plus(
              this.proposal.wait_for_quiet_deadline_increase_seconds.toString(
                10
              )
            )
            .times(1000)
            .gt(new Date().getTime());
        }
      }
    }
    return false;
  }
  beforeRouteEnter(to, from, next): void {
    this.hasPath = from;
    next();
  }
  beforeDestroy(): void {
    window.clearTimeout(this.timer);
    this.timer = null;
  }
  async mounted(): Promise<void> {
    this.SNSWasmService = new SNSWasmService();
    const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.tokenInfo = tokens[this.$route.params.tokenId.trim()] || null;
    if ((window as any).icx) {
      this.isIcx = !!(window as any).icx;
      EventBus.$on('initSuccess', () => {
        this.init();
      });
      await initIcx();
    }
    this.init();
  }
  private handleInfiniteOnLoad(): void {
    if (!this.busy) {
      console.log('handleInfiniteOnLoad');
      this.busy = true;
    }
  }
  private async connectWallet(): Promise<void> {
    if ((window as any).icx) {
      const icxCanisterIds: Array<string> =
        JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
      await connectIcx(icxCanisterIds);
      this.init();
    } else {
      this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    }
  }
  private async registerVote(neuronId: string): Promise<string> {
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const res = await snsGovernanceService.vote(
        this.governanceId,
        this.vote,
        this.proposal.id,
        hexToBytes(neuronId)
      );
      console.log(res);
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          console.log(err.error_message);
          if (!err.error_message.includes('Neuron already voted on proposal')) {
            return `NeuronId: ${neuronId}, ${err.error_message}`;
          }
          // this.$message.error(err.error_message);
        } else {
          //
        }
      } else {
        return 'Vote Error';
        // this.$message.error('Vote Error');
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async onVote(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const MAX_COCURRENCY = 40;
      let promiseValue = [];
      let res = [];
      for (let i = 0; i < this.checked.length; i++) {
        promiseValue.push(this.registerVote(this.checked[i]));
        if (promiseValue.length === MAX_COCURRENCY) {
          console.log(i);
          res.push(await Promise.all(promiseValue));
          promiseValue = [];
        }
        if (i === this.checked.length - 1 && promiseValue.length) {
          console.log(i);
          res.push(await Promise.all(promiseValue));
        }
      }
      console.log(this.checked);
      console.log(res);
      this.voteVisible = false;
      await this.getProposal(this.governanceId);
      this.SNSNeurons = this.filterNeuron(this.allSNSNeurons);
      this.canVoteNeurons = this.filterCanVoteNeuron(this.allSNSNeurons);
      if (res && res.length) {
        let flagIndex = 0;
        const flag = res[0].some((item, index) => {
          flagIndex = index;
          return !!item;
        });
        if (flag) {
          this.$message.error(res[0][flagIndex]);
        } else {
          this.$message.success('Vote Success');
        }
      } else {
        this.$message.success('Vote Success');
      }
    } catch (e) {
      console.log(e);
      this.$message.error('Vote Error');
    }
    loading.close();
  }
  private showVote(vote: number): void {
    this.vote = vote;
    this.voteVisible = true;
  }
  private onchange(event, val: SNSNeuron): void {
    if (event.target.checked) {
      this.votingPower = new BigNumber(this.votingPower)
        .plus(val.votingPower)
        .toString(10);
    } else {
      this.votingPower = new BigNumber(this.votingPower)
        .minus(val.votingPower)
        .toString(10);
    }
  }
  private back(): void {
    if (
      !this.hasPath ||
      this.hasPath === '/' ||
      this.hasPath.toLocaleLowerCase().includes('login') ||
      this.hasPath.toLocaleLowerCase().includes('sign') ||
      this.hasPath.toLocaleLowerCase().includes('error')
    ) {
      this.$router.replace(
        `/icsns/proposals?id=${this.$route.params.tokenId.trim()}`
      );
    } else {
      this.$router.go(-1);
    }
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
        // at least votingLeast of the total voting power
        if (
          (new BigNumber(yes.toString()).gt(no.toString(10)) &&
            new BigNumber(total.toString())
              .times(parseInt(this.votingLeast) / 100)
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
  private init(): void {
    if (this.$route.params.tokenId && this.$route.params.proposalId) {
      this.listDeployedSnses();
    }
  }
  private async listDeployedSnses(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const listDeployedSnses = await this.SNSWasmService.listDeployedSnses();
      let canisterIds: Array<string> = [];
      listDeployedSnses.forEach((item) => {
        canisterIds = canisterIds.concat([
          item.swap_canister_id.toString(),
          item.governance_canister_id.toString(),
          item.ledger_canister_id.toString()
        ]);
      });
      canisterIds = [...new Set(canisterIds)];
      await checkAuth();
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
              _that.initConnected(listDeployedSnses, loading);
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
              _that.initConnected(listDeployedSnses, loading);
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
        this.initConnected(listDeployedSnses, loading);
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
    let governanceId;
    const tokenId = this.$route.params.tokenId;
    if (listDeployedSnses && listDeployedSnses.length) {
      for (let i = 0; i < listDeployedSnses.length; i++) {
        if (
          listDeployedSnses[i].ledger_canister_id &&
          listDeployedSnses[i].ledger_canister_id.length
        ) {
          if (
            listDeployedSnses[i].ledger_canister_id[0].toString() === tokenId
          ) {
            governanceId =
              listDeployedSnses[i].governance_canister_id[0].toString();
            break;
          }
        }
      }
    }
    console.log(governanceId);
    this.governanceId = governanceId;
    const res = await Promise.all([
      this.getNervousSystemParameters(governanceId, tokenId),
      this.getCurrentTokenInfo(tokenId),
      this.getProposal(governanceId),
      this.getNeurons(governanceId, 100, [])
    ]);
    this.allSNSNeurons = res[3];
    this.SNSNeurons = this.filterNeuron(res[3]);
    this.canVoteNeurons = this.filterCanVoteNeuron(res[3]);
    loading.close();
  }
  private async getCurrentTokenInfo(ledgerCanisterId: string): Promise<void> {
    if (!this.tokenInfo) {
      this.tokenInfo = await getTokenInfo(
        Principal.fromText(ledgerCanisterId),
        {
          icrc1: null
        }
      );
    }
  }
  private async getNervousSystemParameters(
    governanceId: string,
    tokenId: string
  ): Promise<void> {
    const info = JSON.parse(localStorage.getItem(`${tokenId}-SNS`)) || {};
    if (info && info.nervousSystemParameters) {
      this.nervousSystemParameters = info.nervousSystemParameters;
    } else {
      const snsGovernanceService = new SNSGovernanceService();
      try {
        this.nervousSystemParameters =
          await snsGovernanceService.getNervousSystemParameters(governanceId);
        console.log(this.nervousSystemParameters);
      } catch (e) {
        return null;
      }
    }
  }
  private async getProposal(governanceId: string): Promise<void> {
    const snsGovernanceService = new SNSGovernanceService();
    try {
      const proposalId = this.$route.params.proposalId.trim();
      const res = await snsGovernanceService.getProposal(governanceId, {
        proposal_id: [{ id: BigInt(proposalId) }]
      });
      this.proposalIsLarge = false;
      if (res && res.result && res.result.length) {
        const type = Object.keys(res.result[0])[0];
        if (type === 'Proposal') {
          this.proposal = (
            res.result[0] as {
              Proposal: ProposalData;
            }
          ).Proposal;
        }
      }
    } catch (e) {
      console.log(e);
      if (e && e.toString().indexOf('application payload size')) {
        this.proposalIsLarge = true;
        const proposalId = this.$route.params.proposalId.trim();
        const request: ListProposals = {
          before_proposal: [{ id: BigInt(Number(proposalId) + 1) }],
          limit: BigInt(1),
          exclude_type: [],
          include_status: [1, 2, 3, 4, 5],
          include_reward_status: []
        };
        console.log(request);
        const res = await snsGovernanceService.listProposals(
          governanceId,
          request
        );
        console.log(res);
        if (res && res.proposals) {
          this.proposal = res.proposals[0];
        }
      } else {
        this.proposalIsLarge = false;
      }
    }
    console.log(this.proposal);
    if (this.proposal && this.proposal.wait_for_quiet_state.length) {
      this.deadline =
        Number(
          this.proposal.wait_for_quiet_state[0]
            .current_deadline_timestamp_seconds
        ) * 1000;
      const total = this.proposal.latest_tally[0].total;
      const yes = this.proposal.latest_tally[0].yes;
      const no = this.proposal.latest_tally[0].no;
      if (
        new BigNumber(
          this.proposal.proposal_creation_timestamp_seconds.toString(10)
        )
          .plus(this.proposal.initial_voting_period_seconds.toString(10))
          .times(1000)
          .lt(new Date().getTime()) &&
        new BigNumber(no.toString(10)).times(2).lt(total.toString(10)) &&
        new BigNumber(yes.toString(10)).times(2).lt(total.toString(10))
      ) {
        this.deadline =
          this.deadline +
          Number(this.proposal.wait_for_quiet_deadline_increase_seconds) * 1000;
      }
    }
    try {
      this.votingList = [];
      if (
        this.proposal &&
        this.proposal.ballots &&
        this.proposal.ballots.length
      ) {
        this.proposal.ballots.forEach((ballot: [string, Ballot]) => {
          if (ballot[1].vote > 0) {
            this.votingList.push({
              id: ballot[0],
              ballot: ballot[1]
            });
          }
        });
        this.votingList = this.votingList.sort((a, b) => {
          return new BigNumber(b.ballot.cast_timestamp_seconds.toString(10))
            .minus(a.ballot.cast_timestamp_seconds.toString(10))
            .toNumber();
        });
      }
    } catch (e) {
      console.log(e);
    }
    const now = new Date().getTime();
    console.log(now, this.deadline);
    if (now < this.deadline) {
      window.clearTimeout(this.timer);
      this.timer = window.setTimeout(() => {
        console.log('setTimeout');
        this.getProposal(governanceId);
      }, 60 * 1000);
    }
    if (
      this.proposal &&
      this.proposal.minimum_yes_proportion_of_total &&
      this.proposal.minimum_yes_proportion_of_total.length &&
      this.proposal.minimum_yes_proportion_of_total[0].basis_points &&
      this.proposal.minimum_yes_proportion_of_total[0].basis_points.length
    ) {
      this.votingLeast =
        new BigNumber(
          this.proposal.minimum_yes_proportion_of_total[0].basis_points[0].toString(
            10
          )
        )
          .div(100)
          .toString(10) + '%';
    }
    if (
      this.proposal &&
      this.proposal.minimum_yes_proportion_of_exercised &&
      this.proposal.minimum_yes_proportion_of_exercised.length &&
      this.proposal.minimum_yes_proportion_of_exercised[0].basis_points &&
      this.proposal.minimum_yes_proportion_of_exercised[0].basis_points.length
    ) {
      this.votingAbsolute =
        new BigNumber(
          this.proposal.minimum_yes_proportion_of_exercised[0].basis_points[0].toString(
            10
          )
        )
          .div(100)
          .toString(10) + '%';
    }
  }
  private async getNeurons(
    governanceId: string,
    limit: number,
    startPageAt: Array<SNSNeuronId>
  ): Promise<Array<SNSNeuron>> {
    if (this.getPrincipalId) {
      const snsGovernanceService = new SNSGovernanceService();
      const request: ListNeurons = {
        of_principal: [Principal.from(this.getPrincipalId)],
        limit: BigInt(limit),
        start_page_at: startPageAt
      };
      const res = await snsGovernanceService.listSNSNeurons(
        governanceId,
        request
      );
      console.log(res);
      if (res) {
        return res.neurons;
        // this.SNSNeurons = this.filterNeuron(res.neurons);
      } else {
        return [];
      }
    }
    return [];
  }
  private filterCanVoteNeuron(SNSNeurons: Array<SNSNeuron>): Array<SNSNeuron> {
    SNSNeurons = SNSNeurons.filter((SNSNeuron) => {
      const dissolveState = SNSNeuron.dissolve_state;
      let dissolveDelay = 0;
      const type = Object.keys(dissolveState[0])[0];
      if (dissolveState[0]) {
        if (type === 'DissolveDelaySeconds') {
          const time = Object.values(dissolveState[0])[0] || BigInt(0);
          dissolveDelay = Number(time);
        } else {
          const now = Math.ceil(new Date().getTime() / 1000);
          const time = Object.values(dissolveState[0])[0] || BigInt(0);
          if (Number(time) - now >= 0) {
            dissolveDelay = Number(time) - now;
          } else {
            dissolveDelay = 0;
          }
        }
      }
      if (
        dissolveDelay === 0 ||
        new BigNumber(dissolveDelay).lt(
          this.nervousSystemParameters.neuron_minimum_dissolve_delay_to_vote_seconds[0].toString(
            10
          )
        )
      ) {
        return false;
      }
      const dissolveDelayBonus = new BigNumber(dissolveDelay)
        .div(
          this.nervousSystemParameters.max_dissolve_delay_seconds[0].toString(
            10
          )
        )
        .times(
          this.nervousSystemParameters.max_dissolve_delay_bonus_percentage[0].toString(
            10
          )
        )
        .div(100)
        .plus(1);
      const now = new Date().getTime() / 1000;
      let aging = BigInt(
        parseInt(
          new BigNumber(now)
            .minus(SNSNeuron.aging_since_timestamp_seconds.toString(10))
            .toString(10)
        )
      );
      if (dissolveState[0]) {
        const type = Object.keys(dissolveState[0])[0];
        if (type === 'WhenDissolvedTimestampSeconds') {
          aging = BigInt(0);
        }
      }
      const ageBonus = new BigNumber(aging.toString(10))
        .div(
          this.nervousSystemParameters.max_neuron_age_for_age_bonus[0].toString(
            10
          )
        )
        .times(
          this.nervousSystemParameters.max_age_bonus_percentage[0].toString(10)
        )
        .div(100)
        .plus(1);
      let balance;
      balance = this.getVoteBalance(SNSNeuron);
      const vote = new BigNumber(balance)
        .times(dissolveDelayBonus)
        .times(ageBonus)
        .times(SNSNeuron.voting_power_percentage_multiplier.toString(10))
        .div(100)
        .toString(10);
      return new BigNumber(vote).gt(0);
    });
    console.log(SNSNeurons);
    return SNSNeurons;
  }
  private getVoteBalance(SNSNeuron: SNSNeuron): string {
    const staked_maturity_e8s_equivalent =
      SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    return new BigNumber(SNSNeuron.cached_neuron_stake_e8s.toString(10))
      .plus(staked_maturity_e8s_equivalent.toString(10))
      .div(10 ** this.tokenInfo.decimals)
      .toString(10);
  }
  private filterNeuron(SNSNeurons: Array<SNSNeuron>): Array<SNSNeuron> {
    this.votingPower = '0.00';
    this.checked = [];
    this.hasBallots = [];
    const ballots: { [key: string]: Ballot } = {};
    if (this.proposal && this.proposal.ballots) {
      this.proposal.ballots.forEach((item) => {
        ballots[item[0]] = item[1];
      });
    }
    SNSNeurons = SNSNeurons.filter((SNSNeuron) => {
      const id = this.arrayToString(SNSNeuron.id[0].id);
      let votingPower = '0';
      if (ballots[id]) {
        votingPower = new BigNumber(ballots[id].voting_power.toString(10))
          .div(10 ** this.tokenInfo.decimals)
          .decimalPlaces(2)
          .toString(10);
        SNSNeuron.votingPower = votingPower;
      }
      const canBallot = ballots[id] && Number(ballots[id].vote) === 0;
      if (ballots[id] && ballots[id].vote > 0) {
        this.hasBallots.push([id, ballots[id]]);
      }
      if (canBallot && votingPower && Number(votingPower) !== 0) {
        this.votingPower = new BigNumber(this.votingPower)
          .plus(votingPower)
          .toString(10);
        this.checked.push(this.arrayToString(SNSNeuron.id[0].id));
      }
      return canBallot;
    });
    if (this.hasBallots.length) {
      this.hasBallots = this.hasBallots.sort((a, b) => {
        return new BigNumber(b[1].cast_timestamp_seconds.toString(10))
          .minus(a[1].cast_timestamp_seconds.toString(10))
          .toNumber();
      });
      this.showNeurons = true;
    }
    console.log(this.hasBallots);
    console.log(this.checked);
    return SNSNeurons;
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
}
</script>

<style scoped lang="scss">
.proposal-main {
  margin-top: 30px;
  color: #adb3c4;
  .proposal-item {
    margin-bottom: 20px;
    padding: 16px;
    background: #131920;
    border: 1px solid #212b35;
    border-radius: 10px;
    .proposal-item-results {
      padding: 16px;
      background: #131920;
      border: 1px solid #212b35;
      border-radius: 10px;
    }
  }
}
.proposal-data {
  display: flex;
  .proposal-data-main {
    width: calc(50% - 10px);
    &.proposal-item-voting {
      margin-left: 20px;
    }
  }
}
.neurons-main-Power {
  display: flex;
  margin-bottom: 10px;
}
.visible-button {
  margin-top: 40px;
  margin-bottom: 20px;
}
.proposal-main-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  .proposal-token-name {
    color: #fff;
    font-size: 18px;
  }
}
.proposal-title {
  margin-bottom: 20px;
  color: #fff;
  font-size: 18px;
  word-break: break-word;
  a {
    color: #1996c4;
  }
}
.back-arrow {
  position: absolute;
  left: 0;
  color: #bababa;
  font-size: 18px;
}
.proposal-item-info {
  display: flex;
  align-items: baseline;
  line-height: 30px;
  span {
    &:first-child {
      padding-right: 10px;
    }
    &:last-child {
      word-break: break-word;
    }
  }
}
.proposal-item-title {
  margin-bottom: 20px;
  font-size: 18px;
  color: #fff;
}
.proposal-tip {
  font-size: 12px;
  line-height: 14px;
  i {
    font-size: 10px;
    color: #adb3c4;
  }
}
.proposal-result-top {
  display: flex;
  margin-bottom: 15px;
  font-size: 16px;
  .proposal-result-top-num {
    margin-top: 5px;
    span {
      font-size: 20px;
    }
  }
  .proposal-result-no {
    text-align: right;
  }
}
.proposal-result-progress {
  position: relative;
  height: 20px;
  width: 100%;
  background: #777d90;
  > div {
    position: absolute;
    height: 20px;
  }
  .proposal-result-progress-yse {
    left: 0;
    background: #21c77d;
  }
  .proposal-result-progress-no {
    right: 0;
    background: #d13651;
  }
  .voting-least {
    left: 3%;
    z-index: 10;
    margin-left: -1px;
    &.voting-absolute {
      left: 50%;
      z-index: 10;
    }
    i {
      position: absolute;
      top: -12px;
      left: -4px;
      font-size: 10px;
      color: #fff;
    }
    span {
      display: inline-block;
      height: 20px;
      width: 2px;
      background: #fff;
    }
  }
}
.voting-power {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin-top: 5px;
  font-size: 12px;
  .voting-power-latest-tally {
    position: absolute;
    &.voting-power-latest-tally-yes {
      left: 0;
    }
    &.voting-power-latest-tally-no {
      right: 0;
      .voting-power-num {
        text-align: right;
      }
    }
  }
  .voting-power-num {
    margin-top: 5px;
    color: #fff;
    font-size: 14px;
  }
}
.proposal-button {
  display: flex;
  margin-top: 20px;
  button {
    margin-right: 20px;
    color: #fff;
  }
  .proposal-button-adopt {
    background: #21c77d;
  }
  .proposal-button-reject {
    background: #d13651;
  }
}
.neurons-main {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .show-neurons-main {
    margin-left: 10px;
    transform: rotate(0deg);
    &.show-neurons-main-show {
      transform: rotate(-180deg);
    }
  }
}
.neurons-list {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  border-top: 1px solid;
  &.neurons-list-votes {
    line-height: 28px;
    p {
      font-size: 16px;
      margin: 10px 0;
    }
    .neurons-list-vote {
      display: flex;
    }
    .neurons-list-vote-yes {
      i {
        color: #21c77d;
      }
    }
    .neurons-list-vote-no {
      i {
        color: #d13651;
        transform: rotate(180deg);
      }
    }
  }
  .neurons-list-checkbox {
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 0;
    padding: 10px 0;
    color: #adb3c4;
    line-height: 16px;
    .neurons-list-checkbox-power {
      position: absolute;
      right: 0;
    }
  }
}
.pc-show {
  display: block;
}
.h5-show {
  display: none;
}
@media screen and (max-width: 1000px) {
  .proposal-main {
    width: 100%;
    padding: 0 15px;
    .proposal-data {
      flex-wrap: wrap;
    }
    .proposal-data-main {
      width: 100%;
      &.proposal-item-voting {
        margin-left: 0;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .pc-show {
    display: none;
  }
  .h5-show {
    display: block;
  }
  .voting-power-countdown-h5 {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .voting-power-countdown {
      margin-left: 10px;
    }
  }
}
</style>
<style lang="scss">
.markdown-info {
  word-break: break-word;
  line-height: 18px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 20px 0 10px;
    font-size: 16px;
    color: #fff;
  }
  a {
    color: #1996c4;
  }
  img {
    max-width: 100%;
  }
}
.voting-power-countdown-proposal {
  line-height: 1;
  .ant-statistic-content {
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
}
.neurons-list-checkbox {
  .ant-checkbox {
    height: 16px;
    top: 0;
  }
}
.state-info-item-scroller {
  display: flex;
  padding-right: 5px;
}
.neurons-list-vote-yes {
  i {
    color: #21c77d;
  }
}
.neurons-list-vote-no {
  i {
    color: #d13651;
    transform: rotate(180deg);
  }
}
@media screen and (max-width: 768px) {
  .voting-history {
    font-size: 12px;
  }
}
</style>
