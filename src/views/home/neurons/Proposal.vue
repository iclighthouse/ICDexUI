<template>
  <div class="container-width proposal-main">
    <div class="proposal-main-title">
      <a-icon class="back-arrow" type="arrow-left" @click="back" />
      <span v-if="proposal" class="proposal-token-name"> </span>
    </div>
    <div v-if="proposal" class="proposal-title">
      <span>
        {{ proposal.proposal[0].title[0] }}
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
                proposal.proposal_timestamp_seconds | formatDateFromSecondUTC
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
                :account="proposal.proposer[0].id.toString()"
                copy-text=""
              ></copy-account>
            </span>
          </div>
          <div class="proposal-item-info">
            <span>Reject Cost</span>
            <span class="margin-left-auto">
              {{ proposal.reject_cost_e8s | bigintToFloat(8, 8) }} ICP
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
          <json-viewer
            v-if="proposalPayload"
            class="markdown-info markdown-info-payload"
            :value="proposalPayload"
            :expand-depth="5"
            :expanded="true"
          ></json-viewer>
          <!-- <vue-markdown
            class="markdown-info"
            :source="proposalPayload"
            :linkify="false"
          ></vue-markdown>-->
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
              <div class="voting-least">
                <a-icon type="down" />
                <span></span>
              </div>
              <div class="voting-least voting-absolute">
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
                <div class="voting-power-num">
                  {{
                    proposal.latest_tally[0].yes
                      | bigintToFloat(2, 8)
                      | formatNum
                  }}
                </div>
              </div>
              <div class="pc-show" v-show="canVote">
                <div>Voting Period Remaining</div>
                <div class="voting-power-num">
                  <a-statistic-countdown
                    class="voting-power-countdown"
                    :value="deadline"
                    format="DD:HH:mm:ss"
                  />
                </div>
              </div>
              <div
                class="voting-power-latest-tally voting-power-latest-tally-no"
              >
                <div>Voting Power</div>
                <div class="voting-power-num">
                  {{
                    proposal.latest_tally[0].no
                      | bigintToFloat(2, 8)
                      | formatNum
                  }}
                </div>
              </div>
            </div>
            <div v-show="canVote" class="h5-show voting-power-countdown-h5">
              <span>Voting Period Left:</span>
              <a-statistic-countdown
                class="voting-power-countdown"
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
                  <span>
                    {{
                      Ballots[1].voting_power
                        | bigintToFloat(2, 8, 0)
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
              1.Absolute Majority: Before the voting period ends, a proposal is
              adopted or rejected if an absolute majority (more than half of the
              total voting power, indicated by
              <a-icon type="caret-down" /> delimiter above) has voted Yes or No
              on the proposal, respectively.
            </div>
            <div>
              2.Simple Majority: When the voting period ends, a proposal is
              adopted if a simple majority (more than half of the votes cast)
              has voted Yes and those votes constitute at least 3% of the total
              voting power (indicated by <a-icon type="down" /> delimiter
              above). Otherwise, the proposal is rejected. Before a proposal is
              decided by Simple Majority, the voting period can be extended in
              order to “wait for quiet”. Such voting period extensions occur
              when a proposal’s voting results turn from either a Yes majority
              to a No majority or vice versa.
            </div>
          </div>
        </div>
        <div
          v-if="
            Number(proposal.reward_status) === 1 &&
            listKnownNeurons &&
            listKnownNeurons.known_neurons &&
            listKnownNeurons.known_neurons.length
          "
          class="voting-history proposal-item"
        >
          <p class="proposal-item-title">Votes of Known Neurons</p>
          <RecycleScroller
            style="height: 250px"
            v-infinite-scroll="handleInfiniteOnLoad"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
            :infinite-scroll-immediate-check="false"
            :items="listKnownNeurons.known_neurons"
            :item-size="25"
          >
            <div slot-scope="{ item }" class="state-info-item-scroller">
              <div style="margin-right: 10px">
                <a
                  :href="`https://dashboard.internetcomputer.org/neuron/${item.id[0].id.toString()}`"
                  target="_blank"
                >
                  <span>
                    {{ item.known_neuron_data[0].name }}
                  </span>
                </a>
              </div>
              <div class="margin-left-auto">
                <span
                  v-if="
                    listKnownNeuronsBallots[item.id[0].id.toString()] &&
                    listKnownNeuronsBallots[item.id[0].id.toString()] === 1
                  "
                  class="neurons-list-vote-yes"
                >
                  Yes
                </span>
                <span
                  v-if="
                    listKnownNeuronsBallots[item.id[0].id.toString()] &&
                    listKnownNeuronsBallots[item.id[0].id.toString()] === 2
                  "
                  class="neurons-list-vote-no"
                >
                  No
                </span>
                <span v-if="!listKnownNeuronsBallots[item.id[0].id.toString()]"
                  >None</span
                >
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
        <json-viewer
          v-if="proposalPayload"
          class="markdown-info markdown-info-payload"
          :expand-depth="5"
          :value="proposalPayload"
          :expanded="true"
        ></json-viewer>
        <!--<vue-markdown
          class="markdown-info"
          :source="proposalPayload"
          :linkify="false"
        ></vue-markdown>-->
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
          <div class="margin-left-auto">
            Voting Power
            <span>{{ votingPower }}</span>
          </div>
        </div>
        <div class="neurons-list">
          <span v-if="!neurons.length">
            You have no Neurons that are eligible to vote on this proposal.
          </span>
          <!--<a-checkbox>
						Check all
					</a-checkbox>-->
          <a-checkbox-group class="filter-checkbox" v-model="checked">
            <a-checkbox
              :value="neuron.id.toString()"
              class="neurons-list-checkbox"
              @change="onchange($event, neuron)"
              v-for="neuron in neurons"
              :key="neuron.id.toString()"
            >
              <span>
                {{ neuron.id.toString() | ellipsisAccount }}
              </span>
              <span class="neurons-list-checkbox-power">
                {{ neuron.voting_power }}
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
import BigNumber from 'bignumber.js';
import { namespace } from 'vuex-class';
import { checkAuth } from '@/ic/CheckAuth';
import {
  Ballot,
  BallotInfo,
  GovernanceError,
  ListKnownNeuronsResponse,
  NeuronInfo,
  ProposalInfo
} from '@/ic/governance/model';
import { GovernanceService } from '@/ic/governance/governanceService';
import { NeuronBallot } from '@/views/home/neurons/model';
import { nnsDappService } from '@/ic/governance/nnsDappService';

const commonModule = namespace('common');
// 4 days
const initialVotingPeriod = 86400 * 4;
const waitForQuietState = 86400 * 4;
const proposalStatusInfo = {
  1: 'Open',
  2: 'Rejected',
  3: 'Adopted',
  4: 'Executed',
  5: 'Failed'
};

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
  private isIcx = false;
  private governanceService: GovernanceService = null;
  private nnsDappService: nnsDappService = null;
  private proposalPayload = null;
  private proposal: ProposalInfo = null;
  private neurons: Array<NeuronBallot> = [];
  private allNeurons: Array<bigint> = [];
  private votingPower = '0.00';
  private checked = [];
  private showNeurons = false;
  private deadline = 0;
  private voteVisible = false;
  private vote = 0;
  private hasBallots: Array<[string, Ballot]> = [];
  private votingList: Array<{ id: string; ballot: Ballot }> = [];
  private busy = true;
  private listKnownNeurons: ListKnownNeuronsResponse = null;
  private listKnownNeuronsBallots: { [key: string]: number } = {};
  private hasPath = '';
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
      return Number(this.proposal.reward_status) === 1;
    }
    return false;
  }
  beforeRouteEnter(to, from, next): void {
    this.hasPath = from;
    next();
  }
  async mounted(): Promise<void> {
    this.governanceService = new GovernanceService();
    this.nnsDappService = new nnsDappService();
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
  private async registerVote(neuronId: string): Promise<void> {
    try {
      const res = await this.governanceService.vote(
        BigInt(neuronId),
        this.vote,
        this.proposal.id
      );
      console.log(res);
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          console.error(err.error_message);
        } else {
          //
        }
      } else {
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
      for (let i = 0; i < this.checked.length; i++) {
        promiseValue.push(this.registerVote(this.checked[i]));
        if (promiseValue.length === MAX_COCURRENCY) {
          console.log(i);
          await Promise.all(promiseValue);
          promiseValue = [];
        }
        if (i === this.checked.length - 1 && promiseValue.length) {
          console.log(i);
          await Promise.all(promiseValue);
        }
      }
      console.log(this.checked);
      this.voteVisible = false;
      await this.getProposal();
      this.neurons = this.filterNeuron(this.allNeurons);
      this.$message.success('Vote Success');
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
  private onchange(event, val: NeuronBallot): void {
    if (event.target.checked) {
      this.votingPower = new BigNumber(this.votingPower)
        .plus(val.voting_power)
        .toString(10);
    } else {
      this.votingPower = new BigNumber(this.votingPower)
        .minus(val.voting_power)
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
      this.$router.replace(`/nns/proposals`);
    } else {
      this.$router.go(-1);
    }
  }
  private getStatus(val: ProposalInfo): string {
    if (val) {
      return proposalStatusInfo[Number(val.status)];
    }
    return '';
  }
  private async init(): Promise<void> {
    if (this.$route.params.proposalId) {
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      this.getProposalPayload();
      this.getListKnownNeurons();
      const res = await Promise.all([this.getProposal(), this.getNeurons()]);
      this.allNeurons = res[1];
      this.neurons = this.filterNeuron(res[1]);
      loading.close();
    }
  }
  private async getListKnownNeurons(): Promise<void> {
    this.listKnownNeurons = await this.governanceService.listKnownNeurons();
    if (this.listKnownNeurons) {
      this.listKnownNeurons.known_neurons.unshift({
        id: [{ id: BigInt(28) }],
        known_neuron_data: [
          {
            name: 'Internet Computer Association',
            description: []
          }
        ]
      });
      this.listKnownNeurons.known_neurons.unshift({
        id: [{ id: BigInt(27) }],
        known_neuron_data: [
          {
            name: 'DFINITY Foundation',
            description: []
          }
        ]
      });
    }
    const neuronIdList: Array<bigint> = [];
    this.listKnownNeurons.known_neurons.forEach((item) => {
      neuronIdList.push(item.id[0].id);
    });
    const res = await this.governanceService.listNeurons({
      neuron_ids: neuronIdList,
      include_neurons_readable_by_caller: false
    });
    console.log(res);
    const proposalId = this.$route.params.proposalId.trim();
    res.neuron_infos.forEach((item: [bigint, NeuronInfo]) => {
      item[1].recent_ballots.some((val: BallotInfo) => {
        if (val.proposal_id[0].id.toString() === proposalId) {
          this.listKnownNeuronsBallots[item[0].toString()] = val.vote;
        }
        return val.proposal_id[0].id.toString() === proposalId;
      });
    });
    console.log(this.listKnownNeuronsBallots);
  }
  private async getProposalPayload(): Promise<void> {
    const proposalId = this.$route.params.proposalId.trim();
    const res = await this.nnsDappService.getProposalPayload(
      BigInt(proposalId)
    );
    console.log(BigInt(proposalId));
    console.log(res);
    if (res) {
      const type = Object.keys(res)[0];
      if (type === 'Ok') {
        if (res.Ok !== '"Proposal has no payload"') {
          this.proposalPayload = JSON.parse(res.Ok);
        }
      }
    }
  }
  private async getProposal(): Promise<void> {
    try {
      const proposalId = this.$route.params.proposalId.trim();
      const res = await this.governanceService.getProposalInfo(
        BigInt(proposalId)
      );
      if (res && res.length) {
        this.proposal = res[0];
      }
    } catch (e) {
      console.log(e);
    }
    console.log(this.proposal);
    if (this.proposal) {
      if (Number(this.proposal.reward_status) === 1) {
        this.deadline = Number(
          new BigNumber(
            this.proposal.deadline_timestamp_seconds[0].toString(10)
          ).times(1000)
        );
        // this.deadline = Number(
        //   new BigNumber(this.proposal.proposal_timestamp_seconds.toString(10))
        //     .plus(initialVotingPeriod)
        //     .times(1000)
        // );
        // const now = new Date().getTime();
        // if (this.deadline < now) {
        //   this.deadline = Number(
        //     new BigNumber(this.proposal.proposal_timestamp_seconds.toString(10))
        //       .plus(initialVotingPeriod)
        //       .plus(waitForQuietState)
        //       .times(1000)
        //   );
        // }
      }
      if (
        this.proposal.proposal[0] &&
        this.proposal.proposal[0].action[0] &&
        this.proposal.proposal[0].action[0]
      ) {
        const type = Object.keys(this.proposal.proposal[0].action[0])[0];
        if (type !== 'ExecuteNnsFunction') {
          this.proposalPayload = JSON.parse(
            JSON.stringify(
              this.proposal.proposal[0].action[0][type],
              (key, value) =>
                value && value._isPrincipal
                  ? value.toString()
                  : typeof value === 'bigint'
                  ? value.toString(10)
                  : value
            )
          );
        }
      }
    }
    try {
      this.votingList = [];
      if (
        this.proposal &&
        this.proposal.ballots &&
        this.proposal.ballots.length
      ) {
        this.proposal.ballots.forEach((ballot: [bigint, Ballot]) => {
          if (ballot[1].vote > 0) {
            this.votingList.push({
              id: ballot[0].toString(10),
              ballot: ballot[1]
            });
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getNeurons(): Promise<Array<bigint>> {
    if (this.getPrincipalId) {
      const neuronIds = await this.governanceService.getNeuronIds();
      console.log(neuronIds);
      return neuronIds;
    } else {
      return [];
    }
  }
  private filterNeuron(neurons: Array<bigint>): Array<NeuronBallot> {
    this.votingPower = '0.00';
    this.checked = [];
    this.hasBallots = [];
    const ballots: { [key: string]: Ballot } = {};
    if (this.proposal && this.proposal.ballots) {
      this.proposal.ballots.forEach((item) => {
        ballots[item[0].toString(10)] = item[1];
      });
    }
    const newNeurons: Array<NeuronBallot> = [];
    neurons.forEach((neuronId: bigint) => {
      const id = neuronId.toString(10);
      let votingPower = '0';
      if (ballots[id]) {
        votingPower = new BigNumber(ballots[id].voting_power.toString(10))
          .div(10 ** 8)
          .decimalPlaces(2)
          .toString(10);
      }
      const canBallot = ballots[id] && Number(ballots[id].vote) === 0;
      if (ballots[id] && ballots[id].vote > 0) {
        this.hasBallots.push([id, ballots[id]]);
      }
      if (canBallot && votingPower && Number(votingPower) !== 0) {
        this.votingPower = new BigNumber(this.votingPower)
          .plus(votingPower)
          .toString(10);
        this.checked.push(id);
        newNeurons.push({
          id: neuronId,
          vote: ballots[id].vote,
          voting_power: votingPower
        });
      }
    });
    if (this.hasBallots.length) {
      this.showNeurons = true;
    }
    console.log(this.hasBallots);
    console.log(this.checked);
    return newNeurons;
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
  &.markdown-info-payload {
    background: transparent !important;
    color: #adb3c4 !important;
    .jv-item.jv-object,
    .jv-item.jv-array,
    .jv-key {
      color: #adb3c4 !important;
    }
  }
}
.voting-power-countdown {
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
  a {
    color: #2b8cb0;
  }
}
.neurons-list-vote-yes {
  color: #21c77d;
}
.neurons-list-vote-no {
  color: #d13651;
}
@media screen and (max-width: 768px) {
  .voting-history {
    font-size: 12px;
  }
}
</style>
