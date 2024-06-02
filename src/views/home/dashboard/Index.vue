<template>
  <div class="dashboard-main container-width base-font-title">
    <div class="dashboard-sns-main">
      <div class="dashboard-sns-item">
        <div
          class="dashboard-sns-item-bold link pointer"
          @click="SNSCanistersVisible = true"
        >
          <div>
            Canisters
            <span v-if="snsNumber && SNSList.length === snsNumber">{{
              canistersNum
            }}</span>
            <span v-else>-</span>
          </div>
        </div>
        <div>
          <span>
            Stopped
            <span v-if="snsNumber && SNSList.length === snsNumber">
              (<span :class="{ 'base-red': stopped > 0 }">{{ stopped }}</span
              >)
            </span>
            <span v-else>-</span>
          </span>
          <span>
            Insufficient Cycles
            <span v-if="snsNumber && SNSList.length === snsNumber">
              (<span :class="{ 'base-red': insufficient > 0 }">{{
                insufficient
              }}</span
              >)
            </span>
            <span v-else>-</span>
          </span>
        </div>
      </div>
      <div class="dashboard-sns-item">
        <div class="dashboard-sns-item-bold">
          <div>
            Proposals
            <span
              v-if="snsNumberProposals && SNSList.length === snsNumberProposals"
            >
              {{ proposals }}
            </span>
            <span v-else>-</span>
          </div>
        </div>
        <div>
          <span>
            Open
            <span
              v-if="snsNumberProposals && SNSList.length === snsNumberProposals"
              class="pointer"
            >
              (
              <router-link to="/icsns/proposals"
                ><span :class="{ link: open > 0 }">{{
                  open
                }}</span></router-link
              >
              )
            </span>
            <span v-else>-</span>
          </span>
        </div>
      </div>
    </div>
    <a-modal
      v-model="SNSCanistersVisible"
      width="860px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <div class="canisters-modal">
        <table>
          <thead>
            <tr>
              <th>SNS DAO</th>
              <th>Canister-id</th>
              <th>Type</th>
              <th>Cycles</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in SNSDapps.slice(
                (page - 1) * 10,
                page * 10
              )"
              :key="index"
            >
              <td>
                <span
                  v-if="
                    SNSMetadata[item.root] &&
                    SNSMetadata[item.root].name &&
                    SNSMetadata[item.root].name[0]
                  "
                >
                  {{ SNSMetadata[item.root].name[0] }}
                </span>
              </td>
              <td>
                <span v-if="item.canister_id[0]">
                  {{ item.canister_id[0].toString() }}
                </span>
              </td>
              <td>
                {{ item.type }}
              </td>
              <td>
                <span
                  v-if="item.status[0]"
                  :class="{
                    'base-red': Number(item.status[0].cycles) < 5 * 10 ** 12
                  }"
                >
                  {{ item.status[0].cycles | bigintToFloat(4, 12) }}
                </span>
              </td>
              <td>
                <span
                  v-if="item.status[0]"
                  :class="{
                    'base-red':
                      Object.keys(item.status[0].status)[0] !== 'running'
                  }"
                >
                  {{ Object.keys(item.status[0].status)[0] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="nft-main-pagination">
          <a-pagination
            v-if="SNSDapps.length > 10"
            class="pagination"
            :defaultPageSize="10"
            :current="page"
            :total="SNSDapps.length"
            @change="pageChange"
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { DeployedSns } from '@/ic/SNSWasm/model';
import { SNSSwapService } from '@/ic/SNSSwap/SNSSwapService';
import {
  CanisterSummary,
  SnsCanistersSummaryResponse
} from '@/ic/SNSRoot/model';
import { SNSRootService } from '@/ic/SNSRoot/SNSRootService';
import BigNumber from 'bignumber.js';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import {
  GetMetadataResponse,
  ListProposals,
  ProposalData
} from '@/ic/SNSGovernance/model';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  private SNSWasmService: SNSWasmService;
  private SNSSwapService: SNSSwapService;
  private SNSRootService: SNSRootService;
  private SNSGovernanceService: SNSGovernanceService;
  private SNSList: Array<DeployedSns> = [];
  private SNSDapps: Array<SnsCanistersSummaryResponse> = [];
  private SNSMetadata: { [key: string]: GetMetadataResponse } = {};
  private page = 1;
  private snsNumber = 0;
  private canistersNum = 0;
  private stopped = 0;
  private insufficient = 0;
  private snsNumberProposals = 0;
  private proposals = 0;
  private open = 0;
  private SNSCanistersVisible = false;
  created(): void {
    this.SNSWasmService = new SNSWasmService();
    this.SNSSwapService = new SNSSwapService();
    this.SNSRootService = new SNSRootService();
    this.SNSGovernanceService = new SNSGovernanceService();
    this.getSNSList();
  }
  private async getSNSList(): Promise<void> {
    const SNSList = await this.SNSWasmService.listDeployedSnses();
    const promiseValue = [];
    SNSList.forEach((item) => {
      promiseValue.push(this.getLifecycle(item));
    });
    const res = await Promise.all(promiseValue);
    SNSList.forEach((item, index) => {
      if (res[index]) {
        this.SNSList.push(item);
        this.get_sns_canisters_summary(item.root_canister_id[0].toString());
        this.getProposalsInfo(item.governance_canister_id[0].toString());
        this.getOpening(item.governance_canister_id[0].toString(), null, 0);
        this.getMetadata(
          item.governance_canister_id[0].toString(),
          item.root_canister_id[0].toString()
        );
      }
    });
    console.log(this.SNSList.length);
    console.log(this.SNSDapps);
  }
  private async getMetadata(governance: string, root: string): Promise<void> {
    const res = await this.SNSGovernanceService.getMetadata(governance);
    this.$set(this.SNSMetadata, root, res);
  }
  private async getProposalsInfo(governance: string): Promise<void> {
    const totalRequest: ListProposals = {
      before_proposal: [],
      limit: BigInt(1),
      exclude_type: [],
      include_status: [],
      include_reward_status: []
    };
    this.SNSGovernanceService.listProposals(governance, totalRequest).then(
      (res) => {
        let num = 0;
        if (res && res.proposals && res.proposals.length) {
          num = Number(res.proposals[0].id[0].id);
        }
        this.proposals = this.proposals + num;
      }
    );
  }
  private async getOpening(
    governance: string,
    lastProposals: ProposalData,
    open: number
  ): Promise<void> {
    let beforeProposal = [];
    if (lastProposals) {
      beforeProposal = lastProposals.id;
    }
    // open:1
    const openRequest: ListProposals = {
      before_proposal: beforeProposal,
      limit: BigInt(10),
      exclude_type: [],
      include_status: [1],
      include_reward_status: []
    };
    this.SNSGovernanceService.listProposals(governance, openRequest)
      .then((res) => {
        if (res && res.proposals && res.proposals.length) {
          open += res.proposals.length;
          if (res.proposals.length === 10) {
            this.getOpening(
              governance,
              res.proposals[res.proposals.length - 1],
              open
            );
          } else {
            this.open = this.open + open;
          }
        } else {
          this.open = this.open + open;
        }
      })
      .finally(() => {
        ++this.snsNumberProposals;
      });
  }
  private async get_sns_canisters_summary(root: string): Promise<void> {
    const res = await this.SNSRootService.get_sns_canisters_summary(root);
    ++this.snsNumber;
    if (res) {
      for (let key in res) {
        res[key].forEach((item: CanisterSummary) => {
          ++this.canistersNum;
          this.SNSDapps.unshift({
            type: key,
            root: root,
            ...item
          });
          if (item.status && item.status.length) {
            const type = Object.keys(item.status[0].status)[0];
            if (type === 'stopped') {
              ++this.stopped;
            }
            //30 days
            const min = new BigNumber(
              item.status[0].idle_cycles_burned_per_day.toString(10)
            ).times(30);
            if (min.gt(item.status[0].cycles.toString(10))) {
              ++this.insufficient;
            }
          }
        });
      }
    }
    console.log(this.snsNumber);
  }
  private async getLifecycle(item: DeployedSns): Promise<boolean> {
    const res = await this.SNSSwapService.getLifecycle(
      item.swap_canister_id[0].toString()
    );
    return (
      res &&
      res.lifecycle &&
      res.lifecycle.length &&
      Number(res.lifecycle[0]) == 3
    );
  }
  private pageChange(page: number): void {
    this.page = page;
  }
}
</script>

<style scoped lang="scss">
.dashboard-main {
  margin-top: 40px;
  background: #131920;
  padding: 16px;
  border-radius: 8px;
  .dashboard-sns-main {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .dashboard-sns-item {
      width: 50%;
    }
  }
  .dashboard-sns-item-bold {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
  }
}
.canisters-modal {
  position: relative;
  padding-bottom: 55px;
  .nft-main-pagination {
    position: absolute;
    right: 0;
  }
}
</style>
