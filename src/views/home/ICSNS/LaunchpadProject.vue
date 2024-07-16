<template>
  <div class="container-width launch-pad-modal">
    <div class="launch-pad-modal-title mt20">
      <a-icon class="back-arrow" type="arrow-left" @click="back" />
    </div>
    <div v-if="currentToken">
      <div class="launch-pad-modal-header">
        <img
          v-if="currentToken.logo && currentToken.logo[0]"
          :src="currentToken.logo[0]"
          alt=""
        />
        <span
          v-if="currentToken.name && currentToken.name[0]"
          class="sns-token-list-item-info-name"
          >{{ currentToken.name[0] }}</span
        >
      </div>
      <div>
        <span class="base-color-w">Status: </span>
        <span class="base-color-w">{{ filterState(currentToken) }}</span>
      </div>
      <a
        :href="currentToken.url[0]"
        target="_blank"
        rel="nofollow noreferrer noopener"
      >
        {{ currentToken.url[0] }}
      </a>
      <div class="wrap">
        <div ref="infoItem" class="ellipsis" :class="{ more: showMore }">
          <span class="switch-arrow" v-show="hasMoreArrow">
            <span v-show="showMore" @click="showMore = !showMore">fold</span>
            <span v-show="!showMore" @click="showMore = !showMore">more</span>
          </span>
          {{ currentToken.description[0] }}
        </div>
      </div>
      <div class="launch-pad-modal-info">
        <table class="pc-show">
          <tbody>
            <tr>
              <td class="show-pc-td">
                <div>
                  <span class="launch-pad-token-item-info-label"
                    >Total Supply</span
                  >
                  <span class="base-color-w" v-if="totalSupply">
                    {{
                      totalSupply
                        | bigintToFloat(
                          currentToken.decimals,
                          currentToken.decimals
                        )
                        | formatNum
                    }}
                  </span>
                  <span v-else>-</span>
                  <span>&nbsp;{{ currentToken.symbol }}</span>
                </div>
              </td>
              <td>
                <div>
                  <span class="launch-pad-token-item-info-label"
                    >Tokens Distributed to Participants</span
                  >
                  <span
                    class="base-color-w"
                    v-if="currentToken.params && currentToken.params[0]"
                  >
                    {{
                      currentToken.params[0].sns_token_e8s
                        | bigintToFloat(
                          currentToken.decimals,
                          currentToken.decimals
                        )
                        | formatNum
                    }}
                  </span>
                  <span v-else>-</span>
                  <span>&nbsp;{{ currentToken.symbol }}</span>
                </div>
              </td>
              <td class="show-pc-td">
                <div>
                  <span class="launch-pad-token-item-info-label"
                    >Token Canister</span
                  >
                  <a
                    v-if="currentToken.tokenId"
                    :href="`https://ic.house/token/${currentToken.tokenId}`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <span>{{ currentToken.tokenId | ellipsisAccount }}</span>
                  </a>
                  <span v-else>-</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <span class="launch-pad-token-item-info-label">Hard Cap</span>
                  <span
                    class="base-color-w"
                    v-if="currentToken.params && currentToken.params[0]"
                  >
                    {{
                      currentToken.params[0].max_icp_e8s
                        | bigintToFloat(8, 8)
                        | formatNum
                    }}
                  </span>
                  <span v-else>-</span>
                  &nbsp;ICP
                </div>
              </td>
              <td>
                <div>
                  <span class="launch-pad-token-item-info-label">Soft Cap</span>
                  <span
                    class="base-color-w"
                    v-if="currentToken.params && currentToken.params[0]"
                  >
                    {{
                      currentToken.params[0].min_icp_e8s
                        | bigintToFloat(8, 8)
                        | formatNum
                    }}
                  </span>
                  <span v-else>-</span>
                  &nbsp;ICP
                </div>
              </td>
              <td>
                <div>
                  <span class="launch-pad-token-item-info-label"
                    >Min Participants</span
                  >
                  <span v-if="currentToken.params && currentToken.params[0]">{{
                    currentToken.params[0].min_participants
                  }}</span>
                  <span v-else>-</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <span class="launch-pad-token-item-info-label"
                    >Max Commit</span
                  >
                  <span
                    class="base-color-w"
                    v-if="currentToken.params && currentToken.params[0]"
                  >
                    {{
                      currentToken.params[0].max_participant_icp_e8s
                        | bigintToFloat(8, 8)
                        | formatNum
                    }}
                  </span>
                  <span v-else>-</span>
                  &nbsp;ICP
                </div>
              </td>
              <td>
                <div>
                  <span class="launch-pad-token-item-info-label"
                    >Min Commit</span
                  >
                  <span
                    class="base-color-w"
                    v-if="currentToken.params && currentToken.params[0]"
                  >
                    {{
                      currentToken.params[0].min_participant_icp_e8s
                        | bigintToFloat(8, 8)
                        | formatNum
                    }}
                  </span>
                  <span v-else>-</span>
                  &nbsp;ICP
                </div>
              </td>
              <td class="show-pc-td">
                <div>
                  <span>
                    <span class="launch-pad-token-item-info-label"
                      >Deadline</span
                    >
                    <span v-if="currentToken.params && currentToken.params[0]"
                      >{{
                        currentToken.params[0].swap_due_timestamp_seconds
                          | formatDateFromSecondUTC
                      }}
                    </span>
                    <span v-else>-</span>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <span>
                    <span class="launch-pad-token-item-info-label"
                      >Neuron Count</span
                    >
                    <span
                      v-if="
                        currentToken.params &&
                        currentToken.params[0] &&
                        currentToken.params[0]
                          .neuron_basket_construction_parameters.length
                      "
                    >
                      {{
                        currentToken.params[0]
                          .neuron_basket_construction_parameters[0].count
                      }}
                    </span>
                    <span v-else>-</span>
                    <!--<a-tooltip placement="top">
												<template slot="title">
													Generate a set of increasing dissolve delays where
													each new dissolve delay is randomized within its
													interval.
												</template>
												<a-icon
													class="info-circle pointer"
													type="info-circle"
												/>
											</a-tooltip>-->
                  </span>
                </div>
              </td>
              <td>
                <div v-if="proposalId">
                  <span class="launch-pad-token-item-info-label"
                    >Open Proposal</span
                  >
                  <router-link :to="`/nns/proposals/${proposalId}`">
                    {{ proposalId }}
                  </router-link>
                </div>
              </td>
              <td class="show-pc-td"></td>
            </tr>
          </tbody>
        </table>
        <div class="show-pc-td h5-show">
          <div class="launch-pad-token-item-info-h5">
            <span class="launch-pad-token-item-info-label"
              >Tokens Distributed to Participants</span
            >
            <span
              class="base-color-w margin-left-auto"
              v-if="currentToken.params && currentToken.params[0]"
            >
              {{
                currentToken.params[0].sns_token_e8s
                  | bigintToFloat(currentToken.decimals, currentToken.decimals)
                  | formatNum
              }}
            </span>
            <span v-else>-</span>
            <span>&nbsp;{{ currentToken.symbol }}</span>
          </div>
          <div class="launch-pad-token-item-info-h5">
            <span class="launch-pad-token-item-info-label">Max Commit</span>
            <span
              v-if="currentToken.params && currentToken.params[0]"
              class="base-color-w margin-left-auto"
            >
              {{
                currentToken.params[0].max_participant_icp_e8s
                  | bigintToFloat(8, 8)
                  | formatNum
              }}
            </span>
            <span v-else>-</span>
            &nbsp;ICP
          </div>
          <div class="launch-pad-token-item-info-h5">
            <span class="launch-pad-token-item-info-label">Min Commit</span>
            <span
              v-if="currentToken.params && currentToken.params[0]"
              class="base-color-w margin-left-auto"
            >
              {{
                currentToken.params[0].min_participant_icp_e8s
                  | bigintToFloat(8, 8)
                  | formatNum
              }}
            </span>
            <span v-else>-</span>
            &nbsp;ICP
          </div>
          <!--<div class="launch-pad-token-item-info-h5">
						<span class="launch-pad-token-item-info-label">Deadline</span>
						<span class="margin-left-auto">{{
							currentToken.state.swap[0].params[0].swap_due_timestamp_seconds
								| formatDateFromSecondUTC
						}}</span>
					</div>-->
        </div>
      </div>
      <div class="launch-pad-modal-slide-main">
        <div class="h5-show mt20 base-font-title main-color">
          {{
            currentToken.direct_participation_icp_e8s
              | bigintToFloat(8, 8)
              | formatNum
          }}
          Direct Commitment
        </div>
        <div class="launch-pad-modal-slide">
          <span class="launch-pad-modal-slide-line"></span>
          <span
            :style="{ width: `${getCurrentCompleted}` }"
            class="launch-pad-modal-slide-line launch-pad-modal-slide-current"
          ></span>
          <span
            v-if="
              currentToken.buyersTotal || Number(currentToken.buyersTotal) === 0
            "
            :style="{
              left: `${getCurrentCompleted}`,
              transform: `${
                parseInt(getCurrentCompleted) < 50
                  ? 'translateX(0)'
                  : 'translateX(-100%)'
              }`
            }"
            class="
              pc-show
              launch-pad-modal-slide-cap launch-pad-modal-slide-cap-completed
            "
          >
            {{
              currentToken.direct_participation_icp_e8s
                | bigintToFloat(8, 8)
                | formatNum
            }}
            Direct Commitment
          </span>
          <span
            v-if="currentToken.params && currentToken.params[0]"
            class="launch-pad-modal-slide-cap launch-pad-modal-slide-cap-hard"
            :style="{
              right: `${getHard}`,
              fontSize: `${parseInt(getSoft) >= 70 ? '12px' : '14px'}`
            }"
            >Hard Cap
            {{
              currentToken.params[0].max_icp_e8s
                | bigintToFloat(8, 8)
                | formatNum
            }}
            ICP <i></i
          ></span>
          <span
            v-if="currentToken.params && currentToken.params[0]"
            class="
              pc-show
              launch-pad-modal-slide-cap launch-pad-modal-slide-cap-soft
            "
            :style="{ left: `${getSoft}` }"
          >
            <span v-if="parseInt(getSoft) < 70">
              <i></i>
              Soft Cap
              {{
                currentToken.params[0].min_icp_e8s
                  | bigintToFloat(8, 8)
                  | formatNum
              }}
              ICP
            </span>
            <span
              v-else
              style="
                display: inline-block;
                transform: translateX(-100%);
                margin-left: 16px;
                font-size: 12px;
              "
            >
              <span>
                Soft Cap
                {{
                  currentToken.params[0].min_icp_e8s
                    | bigintToFloat(8, 8)
                    | formatNum
                }}
                ICP
              </span>
              <i></i>
            </span>
          </span>
          <span
            v-if="
              currentToken.params &&
              currentToken.params[0] &&
              parseInt(getSoft) < 55
            "
            class="
              h5-show
              launch-pad-modal-slide-cap launch-pad-modal-slide-cap-soft
            "
            :style="{ left: `${getSoft}` }"
          >
            <i></i>
            <span>
              Soft Cap
              {{
                currentToken.params[0].min_icp_e8s
                  | bigintToFloat(8, 8)
                  | formatNum
              }}
              ICP
            </span>
          </span>
          <span
            v-if="
              currentToken.params &&
              currentToken.params[0] &&
              parseInt(getSoft) >= 55
            "
            class="
              h5-show
              launch-pad-modal-slide-cap launch-pad-modal-slide-cap-soft
            "
            :style="{
              right: `${100 - parseInt(getSoft) + '%'}`,
              marginRight: '-8px'
            }"
          >
            <span>
              Soft Cap
              {{
                currentToken.params[0].min_icp_e8s
                  | bigintToFloat(8, 8)
                  | formatNum
              }}
              ICP
            </span>
            <i></i>
          </span>
        </div>
      </div>
      <div>
        <div>
          <span class="base-color-w">
            <span v-if="getConversionRatio">
              <!--<span v-if="filterState(currentToken) === 'Pending'">
                <span>
                  At least.
                  {{ getConversionRatio }} {{ currentToken.symbol }} per 1 ICP
                </span>
              </span>-->
              <span
                v-if="
                  filterState(currentToken) === 'Open' ||
                  filterState(currentToken) === 'Committed'
                "
                class="base-font-title"
                >Conversion Ratio:&nbsp;</span
              >
              <span
                v-if="
                  filterState(currentToken) === 'Open' ||
                  filterState(currentToken) === 'Adopted'
                "
              >
                <span v-if="currentToken.buyersTotal">
                  EST.
                  {{ currentToken.buyersTotal | filterRatio(currentToken) }}
                  {{ currentToken.symbol }} per 1 ICP
                </span>
                <!--(At least. {{ getConversionRatio }}
                {{ currentToken.symbol }} per 1 ICP)-->
              </span>
              <span v-if="filterState(currentToken) === 'Committed'">
                {{ currentToken.buyersTotal | filterRatio(currentToken) }}
                {{ currentToken.symbol }} per 1 ICP
              </span>
            </span>
            <span v-else>-</span>
          </span>
        </div>
        <div>
          <span class="base-font-title">Community Fund:</span>
          <span class="base-color-w">
            &nbsp;<span
              v-if="filterState(currentToken) !== 'Pending' && getCommunityFund"
              >{{ getCommunityFund | formatNum }} ICP</span
            ><span v-if="filterState(currentToken) === 'Pending'"
              >{{ paramsCommunityFund | formatNum }} ICP</span
            >
          </span>
          <a-tooltip placement="top">
            <template slot="title">
              The Neurons' Fund commitment increases based on direct
              participation. The exact amount is computed at the end of the
              swap.
            </template>
            <a-icon
              v-if="
                currentToken &&
                currentToken.params &&
                currentToken.params.length &&
                currentToken.params[0].max_direct_participation_icp_e8s &&
                currentToken.params[0].max_direct_participation_icp_e8s.length
              "
              style="margin-left: 10px"
              type="info-circle"
            />
          </a-tooltip>
        </div>
        <div>
          <span class="base-font-title">Overall Commitment:</span>
          <span class="base-color-w">
            &nbsp;<span>
              {{ currentToken.buyersTotal | bigintToFloat(8, 8) | formatNum }}
              ICP
            </span>
          </span>
        </div>
        <div v-if="directParticipantCount">
          <span class="base-font-title">Current Direct Participants:</span>
          <span class="base-color-w">
            &nbsp;<span>{{ directParticipantCount }}</span>
          </span>
        </div>
        <div>
          <span class="base-font-title">Deadline:</span>
          <span
            class="base-color-w"
            v-if="currentToken.params && currentToken.params[0]"
          >
            {{
              currentToken.params[0].swap_due_timestamp_seconds
                | formatDateFromSecondUTC
            }}
          </span>
          <span v-else class="base-color-w">&nbsp;-</span>
          <span
            v-show="filterState(currentToken) === 'Open'"
            class="base-font-title"
            >{{ countDown }}</span
          >
        </div>
        <div
          v-if="
            filterState(currentToken) !== 'Pending' &&
            filterState(currentToken) !== 'Adopted'
          "
        >
          <span class="base-font-title">My Current Commitment:</span>
          <span class="base-color-w"> {{ buyerAmount | formatNum }} ICP </span>
        </div>
      </div>
      <div v-if="getPrincipalId">
        <button
          v-if="!restricted"
          :disabled="filterState(currentToken) !== 'Open'"
          type="button"
          class="primary large-primary w100 show-participate"
          @click="showParticipate"
        >
          <span
            class="show-participate-last"
            v-if="
              filterState(currentToken) === 'Pending' ||
              filterState(currentToken) === 'Adopted'
            "
          >
            <span v-show="filterState(currentToken) === 'Pending'"
              >It hasn't started</span
            >
            <span v-show="filterState(currentToken) === 'Adopted'"
              >Starting Soon</span
            >
            <span v-show="pendingLoading" class="loading-spinner"></span>
            <span
              v-show="
                filterState(currentToken) === 'Adopted' &&
                deadline &&
                !pendingLoading
              "
              class="voting-power-countdown-main"
              >&nbsp;(<a-statistic-countdown
                class="voting-power-countdown"
                :value="deadline"
                format="DD:HH:mm:ss"
                @finish="onFinish"
              />)</span
            ></span
          >
          <span v-else>Participate</span>
        </button>
        <button
          v-if="restricted"
          disabled
          type="button"
          class="primary large-primary w100 show-participate"
        >
          In the country ({{ restrictedCountries.join(',') }}), You are not
          allowed to participate.
        </button>
        <div class="text-right" v-show="refundIcp && refundIcp !== '0'">
          <span>Advance Deposit: </span>
          <span class="base-color-w"
            >{{ refundIcp | bigintToFloat(8, 8) | formatNum }} ICP
          </span>
          <span
            v-show="showRefundIcp"
            @click="onRefreshBuyerToken"
            class="pointer main-color"
            >Retry&nbsp;</span
          >
          <span
            v-if="
              showRefundIcp1 &&
              (filterState(currentToken) === 'Aborted' ||
                filterState(currentToken) === 'Committed')
            "
            @click="onRefundIcp"
            class="pointer main-color"
            >Refund</span
          >
        </div>
      </div>
    </div>
    <div class="state-info-main" v-show="currentToken">
      <div class="state-info-item" v-show="buyers.length">
        <p class="base-color-w">Crowdfunding Records</p>
        <RecycleScroller
          style="height: 250px"
          v-infinite-scroll="handleInfiniteOnLoadBuyers"
          :infinite-scroll-disabled="busyBuyers"
          :infinite-scroll-distance="10"
          :infinite-scroll-immediate-check="false"
          :items="buyers"
          :item-size="25"
        >
          <div slot-scope="{ item }" class="state-info-item-scroller">
            <span
              v-show="
                item.data.participation[0].icp[0] &&
                item.data.participation[0].icp[0]
                  .transfer_success_timestamp_seconds
              "
            >
              [{{
                item.data.participation[0].icp[0]
                  .transfer_success_timestamp_seconds
                  | formatDateFromSecondUTCM
              }}]
            </span>
            <span class="state-info-item-scroller-main">
              <a
                :href="`https://ic.house/ICP/address/${item.data.participant_id[0].toString()}`"
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                {{ item.data.participant_id[0].toString() | ellipsisAccount }}
              </a>
            </span>
            <span class="margin-left-auto">
              {{
                item.data.participation[0].icp[0].amount_e8s
                  | bigintToFloat(4, 8)
                  | formatNum
              }}
              ICP
            </span>
          </div>
        </RecycleScroller>
        <div v-show="busyLoading && busyBuyers" class="loading-container">
          <a-spin />
        </div>
      </div>
      <div
        class="state-info-item state-info-item-neuron"
        v-show="neuronRecipes.length"
      >
        <p class="base-color-w">Neuron Records</p>
        <RecycleScroller
          style="height: 250px"
          v-infinite-scroll="handleInfiniteOnLoadNeuronRecipes"
          :infinite-scroll-disabled="busyNeuronRecipes"
          :infinite-scroll-distance="10"
          :infinite-scroll-immediate-check="false"
          :items="neuronRecipes"
          :item-size="25"
        >
          <div slot-scope="{ item }" class="state-info-item-scroller">
            <span v-show="item.data.sns[0].transfer_success_timestamp_seconds">
              [{{
                item.data.sns[0].transfer_success_timestamp_seconds
                  | formatDateFromSecondUTCM
              }}]
            </span>
            <span
              v-if="currentToken"
              class="
                state-info-item-scroller-main state-info-item-scroller-main-sns
              "
            >
              {{
                item.data.sns[0].amount_e8s
                  | bigintToFloat(4, currentToken.decimals)
                  | formatNum
              }}
              {{ currentToken.symbol }}
            </span>
            <span class="margin-left-auto pc-show">
              {{
                item.data.neuron_attributes[0].dissolve_delay_seconds
                  | filterDelay
              }}
              days Dissolve delay
            </span>
          </div>
        </RecycleScroller>
        <div
          v-show="neuronRecipesLoading && busyNeuronRecipes"
          class="loading-container"
        >
          <a-spin />
        </div>
      </div>
    </div>
    <a-modal
      v-model="swapVisible"
      centered
      title="Increase Participation"
      width="650px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="launch-pad-modal launch-pad-modal-swap"
      :after-close="afterSwapClose"
    >
      <a-form-model
        :model="transferForm"
        ref="transferForm"
        :rules="transferFormRules"
      >
        <a-form-model-item label="Amount" prop="amount">
          <a-input
            v-model="transferForm.amount"
            autocomplete="off"
            type="text"
            v-only-float="8"
            min="0"
            placeholder="0.00"
            suffix="ICP"
          />
        </a-form-model-item>
        <div class="transfer-balance">
          <div class="transfer-balance-left">
            <p>Balance: {{ balance }} ICP</p>
            <p>Fee: {{ fee }} ICP</p>
          </div>
          <div class="transfer-balance-right" @click="setMaxBalance">Max</div>
        </div>
        <div
          v-if="
            currentToken &&
            currentToken.init &&
            currentToken.init.confirmation_text &&
            currentToken.init.confirmation_text[0]
          "
          class="confirmation-text"
        >
          <a-checkbox v-model="confirmation" />
          <span
            class="pointer"
            @click="
              showConfirmationText(currentToken.init.confirmation_text[0])
            "
            >Confirmation of terms</span
          >
        </div>
        <a-form-model-item>
          <button
            @click="onParticipate"
            type="button"
            class="w100 mt20 large-primary primary"
          >
            Participate
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { SNSToken } from '@/views/home/ICSNS/model';
import {
  CfParticipant,
  Err,
  GetDerivedStateResponse1,
  Init,
  Params,
  Participant,
  SnsNeuronRecipe
} from '@/ic/SNSSwap/model';
import {
  ValidationRule,
  WrappedFormUtils
} from 'ant-design-vue/types/form/form';
import { BalanceMixin } from '@/mixins';
import { SNSSwapService } from '@/ic/SNSSwap/SNSSwapService';
import {
  principalToAccountIdentifier,
  principalToSubAccount
} from '@/ic/converter';
import { getDepositing } from '@/ic/getTokenBalance';
import EventBus from '@/utils/Event';
import { connectIcx, initIcx } from '@/ic/connectIcx';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { DeployedSns } from '@/ic/SNSWasm/model';
import { GetMetadataResponse } from '@/ic/SNSGovernance/model';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import { TokenInfo } from '@/ic/common/icType';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { checkAuth } from '@/ic/CheckAuth';
import { buildMemo, validatePrincipal } from '@/ic/utils';
import { namespace } from 'vuex-class';
import { GovernanceService } from '@/ic/governance/governanceService';
import {
  CreateServiceNervousSystem,
  OpenSnsTokenSwap
} from '@/ic/governance/model';
import { questsService } from '@/ic/quests/questsService';
import { toHttpRejectError } from '@/ic/httpError';
import axios from 'axios';

const dayjs = require('dayjs');
const commonModule = namespace('common');
const defaultLength = 100;
const defaultTotalLength = 1000;

@Component({
  name: 'LaunchpadProject',
  components: {},
  filters: {
    filterRatio(buyersTotal: bigint, currentToken: SNSToken): string {
      if (
        buyersTotal &&
        currentToken.params &&
        currentToken.params[0] &&
        currentToken.params[0]
      ) {
        return new BigNumber(currentToken.params[0].sns_token_e8s.toString(10))
          .div(buyersTotal.toString(10))
          .decimalPlaces(2, 1)
          .toString(10);
      }
      return '';
    },
    filterDelay(val: bigint): string {
      return new BigNumber(val.toString(10))
        .div(86400)
        .decimalPlaces(2)
        .toString(10);
    }
  }
})
export default class extends Mixins(BalanceMixin) {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private SNSWasmService: SNSWasmService = null;
  private questsService: questsService = null;
  private tokens: { [key: string]: TokenInfo } = {};
  private isIcx = false;
  private hasMoreArrow = false;
  private showMore = false;
  private governanceId: string = null;
  private currentToken: SNSToken = null;
  private title = '';
  private getHard = '';
  private getSoft = '';
  private getConversionRatio = '';
  private getCommunityFund = '';
  private paramsCommunityFund = '';
  private countDown = '';
  private countDownTimer = null;
  private buyerAmount = '';
  private fee = 0.0001;
  private buyers: Array<{ id: number; data: Participant }> = [];
  private neuronRecipes: Array<{ id: number; data: SnsNeuronRecipe }> = [];
  private totalBuyers = 0;
  private totalNeuronRecipes = 0;
  private busyNeuronRecipes = true;
  private loadMoreNeuronRecipes = true;
  private busyBuyers = true;
  private busyLoading = true;
  private neuronRecipesLoading = true;
  private loadMoreBuyers = true;
  private refundIcp = '';
  private refundIcpTimer = null;
  private swapVisible = false;
  private proposalId = '';
  private deadline = 0;
  private timer1 = null;
  private pendingLoading = false;
  private confirmation = true;
  private restricted = false;
  private restrictedCountries: Array<string> = [];
  private totalSupply: BigInt = null;
  private directParticipantCount: BigInt = null;
  private transferForm = {
    amount: ''
  };
  private transferFormRules = {
    amount: [
      { required: true, message: 'Please enter Amount', trigger: 'change' },
      { validator: this.validateAmount, trigger: 'change' }
    ]
  };
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const max = new BigNumber(this.balance).minus(this.fee);
    const min = new BigNumber(
      this.currentToken.params[0].min_participant_icp_e8s.toString(10)
    )
      .minus(this.refundIcp)
      .div(10 ** 8);
    const maxParticipant = new BigNumber(
      this.currentToken.params[0].max_participant_icp_e8s.toString(10)
    )
      .minus(this.refundIcp)
      .div(10 ** 8);
    if (max.lt(value)) {
      callback('Insufficient ICP');
    } else if (min.gt(value)) {
      callback(`Min participant is ${min.toString(10)} ICP`);
    } else if (maxParticipant.lt(value)) {
      callback(`Max participant is ${maxParticipant.toString(10)} ICP`);
    } else {
      callback();
    }
  }
  get showRefundIcp1(): boolean {
    let flag = false;
    if (
      this.refundIcp &&
      this.buyerAmount &&
      this.currentToken &&
      this.currentToken.params
    ) {
      flag =
        new BigNumber(this.buyerAmount).times(10 ** 8).lt(this.refundIcp) &&
        new BigNumber(this.buyerAmount)
          .times(10 ** 8)
          .lt(this.currentToken.params[0].max_participant_icp_e8s.toString(10));
    }
    console.log(this.buyerAmount, this.refundIcp);
    return flag;
  }
  get showRefundIcp(): boolean {
    let flag = false;
    if (
      this.refundIcp &&
      this.buyerAmount &&
      this.currentToken &&
      this.currentToken.params
    ) {
      flag =
        new BigNumber(this.buyerAmount).times(10 ** 8).lt(this.refundIcp) &&
        new BigNumber(this.buyerAmount)
          .times(10 ** 8)
          .lt(
            this.currentToken.params[0].max_participant_icp_e8s.toString(10)
          ) &&
        this.filterState(this.currentToken) === 'Open';
    }
    console.log(this.buyerAmount, this.refundIcp);
    return flag;
  }
  get getCurrentCompleted(): string {
    if (
      this.currentToken.params &&
      this.currentToken.params[0] &&
      (this.currentToken.direct_participation_icp_e8s ||
        this.currentToken.direct_participation_icp_e8s === BigInt(0))
    ) {
      return (
        new BigNumber(
          this.currentToken.direct_participation_icp_e8s.toString(10)
        )
          .div(this.currentToken.params[0].max_icp_e8s.toString(10))
          .times(100)
          .decimalPlaces(2)
          .toString(10) + '%'
      );
    }
    return '0%';
  }
  beforeDestroy(): void {
    window.clearInterval(this.timer1);
    this.timer1 = null;
    window.clearInterval(this.countDownTimer);
    this.countDownTimer = null;
    window.clearTimeout(this.refundIcpTimer);
    this.refundIcpTimer = null;
  }
  async mounted(): Promise<void> {
    this.SNSWasmService = new SNSWasmService();
    this.questsService = new questsService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
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
    if (this.$route.params.tokenId) {
      this.listDeployedSnses();
      this.getTotalSupply();
    }
  }
  private async getTotalSupply(): Promise<void> {
    try {
      const DRC20Token = new DRC20TokenService();
      const tokenId = this.$route.params.tokenId.trim();
      if (tokenId && validatePrincipal(tokenId)) {
        const res = await DRC20Token.icrcTotalSupply(tokenId);
        if (res) {
          this.totalSupply = res;
        }
      }
    } catch (e) {
      console.log(e);
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
        priList[principal] === 'Plug' &&
        flag &&
        this.$route.name === 'ICSNS-Launchpad'
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
        this.$route.name === 'ICSNS-Launchpad'
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
    let swapId;
    const tokenId = this.$route.params.tokenId.trim();
    if (tokenId && validatePrincipal(tokenId)) {
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
              swapId = listDeployedSnses[i].swap_canister_id[0].toString();
              break;
            }
          }
        }
      }
      console.log(governanceId);
      this.governanceId = governanceId;
      this.currentToken = await this.getSNSTokenInfo(swapId);
      this.getDerivedState(swapId);
      console.log(this.currentToken);
    } else {
      await this.getUpcomingProposalInfo();
    }
    loading.close();
    this.$nextTick(() => {
      let cellChild = (this.$refs as any).infoItem;
      if (cellChild) {
        console.log(cellChild.scrollHeight, cellChild.offsetHeight);
        this.hasMoreArrow = cellChild.scrollHeight > cellChild.offsetHeight;
      }
    });
    this.getRefundIcp();
    this.initSide();
  }
  private async getUpcomingProposalInfo(): Promise<void> {
    const proposalId = this.$route.query.proposalId;
    if (!proposalId) {
      return;
    }
    const governanceService = new GovernanceService();
    const proposalRes = await governanceService.getProposalInfo(
      BigInt(proposalId)
    );
    console.log(proposalRes);
    if (
      proposalRes &&
      proposalRes[0] &&
      proposalRes[0].proposal &&
      proposalRes[0].proposal[0] &&
      proposalRes[0].proposal[0].action &&
      proposalRes[0].proposal[0].action[0]
    ) {
      const createServiceNervousSystem = (
        proposalRes[0].proposal[0].action[0] as {
          CreateServiceNervousSystem: CreateServiceNervousSystem;
        }
      ).CreateServiceNervousSystem;
      if (createServiceNervousSystem) {
        const swapParameters = createServiceNervousSystem.swap_parameters[0];
        const swap_due_timestamp_seconds = new BigNumber(
          proposalRes[0].proposal_timestamp_seconds.toString(10)
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
                swapParameters.neuron_basket_construction_parameters[0].count[0]
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
          min_icp_e8s: swapParameters.minimum_icp[0].e8s[0],
          neurons_fund_investment_icp:
            swapParameters.neurons_fund_investment_icp[0].e8s[0]
        };
        console.log(params);
        const tokenInfo = createServiceNervousSystem.ledger_parameters[0];
        this.currentToken = {
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
          proposalId: BigInt(proposalId)
        };
      }
    }
  }
  private async getSNSTokenInfo(swapId: string): Promise<SNSToken> {
    const tokenId = this.$route.params.tokenId.trim();
    const promiseAll = [];
    const governanceCanisterId = this.governanceId;
    promiseAll.push(
      this.getSNSTokenGovernanceInfo(governanceCanisterId.toString(), tokenId),
      this.getCurrentTokenInfo(tokenId),
      this.getLifecycle(swapId, tokenId),
      this.getParams(swapId, tokenId),
      this.listCommunityFundParticipants(swapId),
      this.getInit(swapId)
    );
    // Buyers total length
    this.getBuyersTotal(swapId, 3000, 1);
    this.getNeuronRecipesTotal(swapId, 3000, 1);
    const res = await Promise.all(promiseAll);
    let params = res[3];
    if (!params || (params && !params.length)) {
      params = await this.getProposalParams(swapId);
    }
    if (res[2] && res[2][0]) {
      if (Number(res[2][0]) === 1) {
        // LIFECYCLE_PENDING
        this.getProposalInfo();
        window.clearInterval(this.timer1);
        this.timer1 = window.setInterval(() => {
          if (!this.getCheckAuth) {
            this.getProposalInfo();
          }
        }, 60 * 1000);
      } else {
        this.getSNSTokenSwapState(swapId);
      }
    }
    return {
      tokenId: tokenId,
      swapId: swapId,
      ...res[1],
      ...res[0],
      lifecycle: res[2],
      params: params,
      cf_participants: res[4],
      // state: res[2]
      // buyersTotal: res[2],
      init: res[5]
    };
  }
  private async getInit(tokenId: string): Promise<Init> {
    const snsSwapService = new SNSSwapService();
    console.time('getInit');
    const res = await snsSwapService.getInit(tokenId);
    console.log(res);
    console.time('getInit');
    if (res && res.init && res.init[0]) {
      if (
        res.init[0].restricted_countries &&
        res.init[0].restricted_countries[0] &&
        res.init[0].restricted_countries[0].iso_codes &&
        res.init[0].restricted_countries[0].iso_codes.length
      ) {
        this.restrictedCountries =
          res.init[0].restricted_countries[0].iso_codes;
        this.iplocation(res.init[0].restricted_countries[0].iso_codes);
      }
      return res.init[0];
    } else {
      return null;
    }
  }
  private iplocation(iso_codes: Array<string>): void {
    axios.get('https://api.iplocation.net/?cmd=get-ip').then((res) => {
      console.log(res);
      const ip = res.data.ip;
      axios
        .get(`https://api.iplocation.net/?cmd=ip-country&ip=${ip}`)
        .then((country) => {
          console.log(country.data);
          this.restricted =
            iso_codes.includes(country.data.country_code2) ||
            iso_codes.includes(country.data.country_name);
        });
    });
  }
  private async getParams(
    swap: string,
    tokenId: string
  ): Promise<Array<Params>> {
    const info = JSON.parse(localStorage.getItem(`${tokenId}-SNS`)) || {};
    if (info && info.params && info.params.length) {
      return info.params;
    }
    const snsSwapService = new SNSSwapService();
    console.time('getParams');
    const res = await snsSwapService.getSaleParameters(swap);
    console.log(res);
    console.time('getParams');
    if (
      res.params.length &&
      res.params[0].max_direct_participation_icp_e8s &&
      res.params[0].max_direct_participation_icp_e8s.length
    ) {
      res.params[0].max_icp_e8s =
        res.params[0].max_direct_participation_icp_e8s[0];
    }
    return res.params;
  }
  private async getLifecycle(
    swap: string,
    tokenId: string
  ): Promise<Array<bigint>> {
    const info = JSON.parse(localStorage.getItem(`${tokenId}-SNS`)) || {};
    const completed = [3, 4];
    if (info && info.lifecycle && completed.includes(Number(info.lifecycle))) {
      return info.lifecycle;
    }
    const snsSwapService = new SNSSwapService();
    console.time('getLifecycle');
    const res = await snsSwapService.getLifecycle(swap);
    console.timeEnd('getLifecycle');
    return res.lifecycle;
  }
  private async getProposalParams(swapId: string): Promise<Array<Params>> {
    console.time('getProposalParams');
    try {
      const governanceService = new GovernanceService();
      const proposalRes = await governanceService.listProposals({
        include_reward_status: [],
        before_proposal: [],
        limit: BigInt(100),
        // todo only Proposals related to SNS and Community Fund.
        exclude_topic: [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18
        ],
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
        const proposals = proposalRes.proposal_info;
        for (let i = 0; i < proposals.length; i++) {
          if (
            proposals[i] &&
            proposals[i].proposal &&
            proposals[i].proposal[0] &&
            proposals[i].proposal[0].action &&
            proposals[i].proposal[0].action[0]
          ) {
            const action = (
              proposals[i].proposal[0].action[0] as {
                OpenSnsTokenSwap: OpenSnsTokenSwap;
              }
            ).OpenSnsTokenSwap;
            if (action) {
              if (
                action.target_swap_canister_id &&
                action.target_swap_canister_id[0] &&
                action.target_swap_canister_id[0].toString() === swapId
              ) {
                this.proposalId = proposals[i].id[0].id.toString(10);
                this.paramsCommunityFund = new BigNumber(
                  action.community_fund_investment_e8s[0].toString(10)
                )
                  .div(10 ** 8)
                  .toString(10);
                return action.params;
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    console.timeEnd('getProposalParams');
    return null;
  }
  /**
   * Buyers total length
   * @param tokenId
   * @param start
   * @param length
   */
  private async getBuyersTotal(
    tokenId: string,
    start: number,
    length: number
  ): Promise<void> {
    const snsSwapService = new SNSSwapService();
    const request = { limit: [BigInt(length)], offset: [BigInt(start)] };
    const res = await snsSwapService.listDirectParticipants(tokenId, request);
    console.log(start, length, res);
    if (res.participants.length) {
      if (res.participants.length === 1) {
        this.getBuyersTotal(tokenId, start, defaultTotalLength);
      } else {
        if (res.participants.length === defaultTotalLength) {
          this.getBuyersTotal(
            tokenId,
            start + defaultTotalLength - 1,
            defaultTotalLength
          );
        } else {
          this.totalBuyers = start + res.participants.length;
          console.log(this.totalBuyers);
          this.listDirectParticipants(tokenId, 'init');
        }
      }
    } else {
      if (start === 0) {
        this.totalBuyers = 0;
        return;
      }
      this.getBuyersTotal(
        tokenId,
        Math.max(start - defaultTotalLength, 0),
        length
      );
    }
  }
  private async getNeuronRecipesTotal(
    tokenId: string,
    start: number,
    length: number
  ): Promise<void> {
    const snsSwapService = new SNSSwapService();
    const request = { limit: [BigInt(length)], offset: [BigInt(start)] };
    const res = await snsSwapService.listSnsNeuronRecipes(tokenId, request);
    if (res.sns_neuron_recipes && res.sns_neuron_recipes.length) {
      if (res.sns_neuron_recipes.length === 1) {
        this.getNeuronRecipesTotal(tokenId, start, defaultTotalLength);
      } else {
        if (res.sns_neuron_recipes.length === defaultTotalLength) {
          this.getNeuronRecipesTotal(
            tokenId,
            start + defaultTotalLength - 1,
            defaultTotalLength
          );
        } else {
          this.totalNeuronRecipes = start + res.sns_neuron_recipes.length;
          console.log(this.totalNeuronRecipes);
          this.listSnsNeuronRecipes(tokenId, 'init');
        }
      }
    } else {
      if (start === 0) {
        this.totalNeuronRecipes = 0;
        return;
      }
      this.getNeuronRecipesTotal(
        tokenId,
        Math.max(start - defaultTotalLength, 0),
        length
      );
    }
  }
  private async listDirectParticipants(
    tokenId: string,
    type?: string
  ): Promise<void> {
    const snsSwapService = new SNSSwapService();
    console.time('listDirectParticipants');
    if (!this.loadMoreBuyers) {
      this.busyBuyers = false;
      return;
    }
    let start;
    let length = defaultLength;
    if (type) {
      this.buyers = [];
      start = Math.max(this.totalBuyers - defaultLength, 0);
      length = Math.min(this.totalBuyers, defaultLength);
    } else {
      start = Math.max(
        this.totalBuyers - this.buyers.length - defaultLength,
        0
      );
      if (this.buyers.length + defaultLength > this.totalBuyers) {
        length = this.totalBuyers - this.buyers.length;
      }
    }
    console.log(start, length);
    try {
      const res = await snsSwapService.listDirectParticipants(tokenId, {
        limit: [BigInt(length)],
        offset: [BigInt(start)]
      });
      if (res.participants && res.participants.length < defaultLength) {
        this.loadMoreBuyers = false;
      }
      const buyers = [];
      res.participants.forEach((participant, index) => {
        buyers.unshift({
          id: this.buyers.length + index,
          data: participant
        });
      });
      this.buyers = this.buyers.concat(buyers);
      console.timeEnd('listDirectParticipants');
    } catch (e) {
      console.log(e);
    }
    console.log(this.buyers);
    this.busyBuyers = false;
  }
  private async listSnsNeuronRecipes(
    tokenId: string,
    type?: string
  ): Promise<void> {
    const snsSwapService = new SNSSwapService();
    console.time('listSnsNeuronRecipes');
    if (!this.loadMoreNeuronRecipes) {
      this.busyNeuronRecipes = false;
      return;
    }
    let start;
    let length = defaultLength;
    if (type) {
      this.neuronRecipes = [];
      start = Math.max(this.totalNeuronRecipes - defaultLength, 0);
      length = Math.min(this.totalNeuronRecipes, defaultLength);
    } else {
      start = Math.max(
        this.totalNeuronRecipes - this.neuronRecipes.length - defaultLength,
        0
      );
      if (this.neuronRecipes.length + defaultLength > this.totalNeuronRecipes) {
        length = this.totalNeuronRecipes - this.neuronRecipes.length;
      }
    }
    console.log(start, length);
    try {
      const res = await snsSwapService.listSnsNeuronRecipes(tokenId, {
        limit: [BigInt(length)],
        offset: [BigInt(start)]
      });
      if (res.sns_neuron_recipes.length < defaultLength) {
        this.loadMoreNeuronRecipes = false;
      }
      const neuronRecipes = [];
      res.sns_neuron_recipes.forEach((recipes, index) => {
        neuronRecipes.unshift({
          id: this.neuronRecipes.length + index,
          data: recipes
        });
      });
      this.neuronRecipes = this.neuronRecipes.concat(neuronRecipes);
      console.timeEnd('listSnsNeuronRecipes');
    } catch (e) {
      console.log(e);
    }
    console.log(this.neuronRecipes);
    this.busyNeuronRecipes = false;
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
  private async getDerivedState(tokenId: string): Promise<void> {
    const snsSwapService = new SNSSwapService();
    const res = await snsSwapService.getDerivedState(tokenId);
    console.log(res);
    if (
      (res as GetDerivedStateResponse1).direct_participant_count &&
      (res as GetDerivedStateResponse1).direct_participant_count[0]
    ) {
      this.directParticipantCount = (
        res as GetDerivedStateResponse1
      ).direct_participant_count[0];
    }
    if (
      (res as GetDerivedStateResponse1).neurons_fund_participation_icp_e8s &&
      (res as GetDerivedStateResponse1).neurons_fund_participation_icp_e8s[0]
    ) {
      this.getCommunityFund = this.paramsCommunityFund = new BigNumber(
        (
          res as GetDerivedStateResponse1
        ).neurons_fund_participation_icp_e8s[0].toString(10)
      )
        .div(10 ** 8)
        .toString(10);
    }
    console.log(this.currentToken);
    if (this.currentToken) {
      this.$set(this.currentToken, 'buyersTotal', res.buyer_total_icp_e8s[0]);
      if (
        (res as GetDerivedStateResponse1).direct_participation_icp_e8s &&
        (res as GetDerivedStateResponse1).direct_participation_icp_e8s.length
      ) {
        this.$set(
          this.currentToken,
          'direct_participation_icp_e8s',
          (res as GetDerivedStateResponse1).direct_participation_icp_e8s[0]
        );
      } else {
        this.$set(
          this.currentToken,
          'direct_participation_icp_e8s',
          res.buyer_total_icp_e8s[0]
        );
      }
    }
  }
  private async getSNSTokenSwapState(tokenId: string): Promise<void> {
    const snsSwapService = new SNSSwapService();
    console.time('2');
    const res = await snsSwapService.getState(tokenId);
    console.log(res);
    console.timeEnd('2');
    try {
      this.proposalId =
        res.swap[0].open_sns_token_swap_proposal_id[0].toString(10);
      if (
        this.currentToken.lifecycle &&
        Number(this.currentToken.lifecycle[0]) === 5
      ) {
        if (res.swap[0].decentralization_sale_open_timestamp_seconds) {
          this.deadline = new BigNumber(
            res.swap[0].decentralization_sale_open_timestamp_seconds[0].toString(
              10
            )
          )
            .times(1000)
            .decimalPlaces(0)
            .toNumber();
        } else {
          // LIFECYCLE_ADOPTED
          this.getProposalInfo();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getProposalInfo(): Promise<void> {
    if (this.proposalId) {
      const governanceService = new GovernanceService();
      const proposalRes = await governanceService.getProposalInfo(
        BigInt(this.proposalId)
      );
      console.log(proposalRes);
      if (proposalRes && proposalRes.length) {
        const executedTime = proposalRes[0].executed_timestamp_seconds;
        if (proposalRes[0].decided_timestamp_seconds) {
          window.clearInterval(this.timer1);
          this.timer1 = null;
          this.refreshPendingLifecycle();
        }
        if (executedTime && this.currentToken.params[0].sale_delay_seconds[0]) {
          this.deadline = new BigNumber(executedTime.toString(10))
            .plus(
              this.currentToken.params[0].sale_delay_seconds[0].toString(10)
            )
            .times(1000)
            .decimalPlaces(0)
            .toNumber();
          console.log(this.deadline);
        }
      }
    }
  }
  private async getCurrentTokenInfo(tokenId: string): Promise<TokenInfo> {
    if (!this.tokens[tokenId]) {
      return await getTokenInfo(Principal.fromText(tokenId), { icrc1: null });
    } else {
      return this.tokens[tokenId];
    }
  }
  private async getSNSTokenGovernanceInfo(
    governance: string,
    tokenId: string
  ): Promise<GetMetadataResponse> {
    const info = JSON.parse(localStorage.getItem(`${tokenId}-SNS`)) || {};
    if (info && info.name && info.name instanceof Array && info.name[0]) {
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
  private initSide(): void {
    this.title = this.currentToken.name[0];
    if (this.currentToken.params && this.currentToken.params.length) {
      this.getHard =
        new BigNumber(1)
          .minus(
            new BigNumber(
              this.currentToken.params[0].max_icp_e8s.toString(10)
            ).div(this.currentToken.params[0].max_icp_e8s.toString(10))
          )
          .times(100)
          .decimalPlaces(2)
          .toString(10) + '%';
      this.getSoft =
        new BigNumber(this.currentToken.params[0].min_icp_e8s.toString(10))
          .div(this.currentToken.params[0].max_icp_e8s.toString(10))
          .times(100)
          .decimalPlaces(2)
          .toString(10) + '%';
      let cf = '0';
      if (this.getCommunityFund) {
        cf = new BigNumber(this.getCommunityFund).times(10 ** 8).toString(10);
      }
      if (!cf && this.paramsCommunityFund) {
        cf = new BigNumber(this.paramsCommunityFund)
          .times(10 ** 8)
          .toString(10);
      }
      this.getConversionRatio = new BigNumber(
        this.currentToken.params[0].sns_token_e8s.toString(10)
      )
        .div(10 ** this.currentToken.decimals)
        .div(
          new BigNumber(cf).plus(
            this.currentToken.params[0].max_icp_e8s.toString(10)
          )
        )
        .times(10 ** 8)
        .decimalPlaces(2)
        .toString(10);
      let communityFund = '0';
      console.log(this.currentToken.cf_participants);
      if (
        !this.paramsCommunityFund &&
        this.currentToken.params[0].neurons_fund_investment_icp
      ) {
        this.paramsCommunityFund = this.getCommunityFund = new BigNumber(
          this.currentToken.params[0].neurons_fund_investment_icp.toString(10)
        )
          .div(10 ** 8)
          .toString(10);
      } else if (!this.getCommunityFund && this.currentToken.cf_participants) {
        this.currentToken.cf_participants.forEach((participant) => {
          participant.cf_neurons.forEach((neuron) => {
            communityFund = new BigNumber(neuron.amount_icp_e8s.toString(10))
              .plus(communityFund)
              .toString(10);
          });
        });
        this.getCommunityFund = new BigNumber(communityFund)
          .div(10 ** 8)
          .toString(10);
      }
      console.log(this.getCommunityFund);
    }
    this.setCountDown();
    this.getBuyerState().then();
    this.getRefundIcp();
  }
  private handleInfiniteOnLoadNeuronRecipes(): void {
    if (!this.busyNeuronRecipes) {
      console.log('handleInfiniteOnLoadNeuronRecipes');
      this.busyNeuronRecipes = true;
      this.listSnsNeuronRecipes(this.currentToken.swapId);
    }
  }
  private handleInfiniteOnLoadBuyers(): void {
    if (!this.busyBuyers) {
      console.log('handleInfiniteOnLoadBuyers');
      this.busyBuyers = true;
      this.listDirectParticipants(this.currentToken.swapId);
    }
  }
  private async getRefundIcp(): Promise<void> {
    if (this.getPrincipalId && this.currentToken.swapId) {
      this.refundIcp = await getDepositing({ icp: null }, '', {
        owner: Principal.fromText(this.currentToken.swapId),
        subaccount: [
          Array.from(
            principalToSubAccount(Principal.fromText(this.getPrincipalId))
          )
        ]
      });
      window.clearTimeout(this.refundIcpTimer);
      if (
        this.currentToken.lifecycle[0] &&
        Number(this.currentToken.lifecycle[0]) !== 3 &&
        Number(this.currentToken.lifecycle[0]) !== 4
      ) {
        this.refundIcpTimer = window.setTimeout(() => {
          this.getRefundIcp().then();
          this.getDerivedState(this.currentToken.swapId.toString()).then(() => {
            this.initSide();
          });
        }, 10 * 1000);
      }
    }
  }
  private async getBuyerState(): Promise<void> {
    if (this.getPrincipalId) {
      const snsSwapService = new SNSSwapService();
      const res = await snsSwapService.getBuyerState(this.currentToken.swapId, {
        principal_id: [Principal.fromText(this.getPrincipalId)]
      });
      console.log(res);
      if (
        res &&
        res.buyer_state &&
        res.buyer_state.length &&
        res.buyer_state[0].icp &&
        res.buyer_state[0].icp[0].amount_e8s
      ) {
        this.buyerAmount = new BigNumber(
          res.buyer_state[0].icp[0].amount_e8s.toString(10)
        )
          .div(10 ** 8)
          .toString(10);
      } else {
        this.buyerAmount = '0';
      }
    } else {
      this.buyerAmount = '0';
    }
  }
  private async refreshPendingLifecycle(): Promise<void> {
    try {
      if (Number(this.currentToken.lifecycle[0]) !== 1) {
        return;
      }
      const lifecycle = await this.getLifecycle(
        this.currentToken.swapId,
        this.currentToken.tokenId
      );
      // this.currentToken.lifecycle = lifecycle;
      console.log(lifecycle);
      this.$set(this.currentToken, 'lifecycle', lifecycle);
      if (Number(lifecycle[0]) === 1) {
        window.setTimeout(() => {
          this.refreshPendingLifecycle();
        }, 1000);
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async onFinish(): Promise<void> {
    this.pendingLoading = true;
    try {
      const lifecycle = await this.getLifecycle(
        this.currentToken.swapId,
        this.currentToken.tokenId
      );
      // this.currentToken.lifecycle = lifecycle;
      console.log(lifecycle);
      this.$set(this.currentToken, 'lifecycle', lifecycle);
      if (Number(lifecycle[0]) === 5) {
        window.setTimeout(() => {
          this.onFinish();
        }, 1000);
      } else {
        this.pendingLoading = false;
      }
    } catch (e) {
      console.log(e);
      this.pendingLoading = false;
    }
  }
  private setCountDown(): void {
    window.clearInterval(this.countDownTimer);
    this.countDownTimer = null;
    if (this.currentToken.params && this.currentToken.params[0]) {
      const now = new Date();
      const Deadline = Number(
        this.currentToken.params[0].swap_due_timestamp_seconds
      );
      if (Deadline < now.getTime() / 1000) {
        this.countDown = '';
        return;
      } else {
        this.countDownTimer = window.setTimeout(() => {
          this.setCountDown();
        }, 1000);
      }
      let to = dayjs.unix(Deadline);
      const d = to.diff(now, 'd');
      if (d > 0) {
        to = to.subtract(d, 'd');
      }
      const h = to.diff(now, 'h');
      if (h > 0) {
        to = to.subtract(h, 'h');
      }
      const m = to.diff(now, 'm');
      if (m > 0) {
        to = to.subtract(m, 'm');
      }
      const s = to.diff(now, 's');
      this.countDown = `(Last ${d}d ${h}h ${m}m ${s}s)`;
    }
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
  private showParticipate(): void {
    this.swapVisible = true;
  }
  private afterSwapClose(): void {
    (this.$refs.transferForm as Vue & WrappedFormUtils).resetFields();
  }
  private onParticipate(): void {
    if (
      this.currentToken.init &&
      this.currentToken.init.confirmation_text &&
      this.currentToken.init.confirmation_text[0] &&
      this.currentToken.init.confirmation_text[0] &&
      !this.confirmation
    ) {
      this.$message.error('Please check the confirmation of terms first.');
      return;
    }
    (this.$refs.transferForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          await checkAuth();
          const swapCanisterAccount = principalToAccountIdentifier(
            Principal.fromText(this.currentToken.swapId),
            principalToSubAccount(Principal.fromText(this.getPrincipalId))
          );
          const memo = buildMemo(BigInt('0'));
          try {
            await this.ledgerService.sendIcp(
              this.transferForm.amount.toString(),
              swapCanisterAccount,
              memo
            );
            await this.refreshBuyerToken();
            loading.close();
          } catch (e) {
            if (toHttpRejectError(e)) {
              this.$message.error(toHttpRejectError(e));
            } else {
              this.$message.error('Error');
            }
            this.getRefundIcp();
            loading.close();
            console.log(e);
          }
          this.swapVisible = false;
        }
      }
    );
  }
  private async putQuests(event: string): Promise<void> {
    try {
      await this.questsService.putEvent(
        event,
        Principal.fromText(this.getPrincipalId)
      );
    } catch (e) {
      console.log(e);
    }
  }
  private async refreshState(): Promise<void> {
    // this.getBuyersTotal(this.currentToken.swapId.toString(), 3000, 1);
    this.getBuyerState();
    await this.getDerivedState(this.currentToken.swapId.toString());
  }
  private showConfirmationText(text: string): void {
    this.$info({
      content: text,
      class: 'connect-plug',
      icon: 'connect-plug',
      okText: 'Confirm',
      centered: true,
      onOk() {
        //
      }
    });
  }
  private setMaxBalance(): void {
    const max = new BigNumber(this.balance).minus(this.fee);
    if (new BigNumber(max).gt(0)) {
      this.transferForm.amount = max.toString(10);
    } else {
      this.transferForm.amount = '0';
    }
    (this.$refs.transferForm as any).validateField('amount');
  }
  private async onRefreshBuyerToken(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      await this.refreshBuyerToken();
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private async refreshBuyerToken(): Promise<void> {
    try {
      const snsSwapService = new SNSSwapService();
      if (this.currentToken.symbol === 'CHAT') {
        this.putQuests('OCLaunchpad');
      }
      let confirmationText = [];
      if (
        this.currentToken.init &&
        this.currentToken.init.confirmation_text &&
        this.currentToken.init.confirmation_text[0] &&
        this.currentToken.init.confirmation_text[0]
      ) {
        confirmationText = [this.currentToken.init.confirmation_text[0]];
      }
      const res = await snsSwapService.refreshBuyerTokens(
        this.currentToken.swapId,
        {
          buyer: this.getPrincipalId,
          confirmation_text: confirmationText
        }
      );
      console.log(res);
      if (res && res.icp_accepted_participation_e8s) {
        this.$message.success('Success');
        if (this.currentToken.symbol === 'CHAT') {
          this.putQuests('OCLaunchpad');
        }
      } else {
        this.$message.error('Error');
      }
    } catch (e) {
      if (toHttpRejectError(e)) {
        this.$message.error(toHttpRejectError(e));
      }
      console.log(e);
    }
    this.refreshState();
    this.getRefundIcp();
  }
  private async onRefundIcp(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const snsSwapService = new SNSSwapService();
      console.log(this.currentToken.swapId);
      const res = await snsSwapService.refundIcp(this.currentToken.swapId, {
        source_principal_id: [Principal.fromText(this.getPrincipalId)]
      });
      console.log(res);
      if (res.result) {
        const type = Object.keys(res.result[0])[0];
        if (type === 'Ok') {
          this.$message.success('Refund Success');
          this.getRefundIcp();
        } else {
          const message = Object.values(res.result[0] as { Err: Err })[0];
          console.log(message);
          if (message.description.length) {
            this.$message.error(message.description[0]);
          } else {
            this.$message.error('Refund error');
          }
        }
      }
    } catch (e) {
      console.log(e);
      this.$message.error('Refund error');
    }
    loading.close();
  }
  private back(): void {
    this.$router.replace('/icsns/launchpad');
  }
}
</script>

<style scoped lang="scss">
.launch-pad-modal-title {
  display: flex;
  align-items: center;
  height: 20px;
  margin-bottom: 40px;
  i {
    color: #bababa;
    font-size: 18px;
  }
}
.launch-pad-modal {
  line-height: 1.5;
  color: #747884;
  a {
    color: #166a89;
  }
  .launch-pad-token-item-info-label {
    padding-right: 10px;
  }
}
.show-participate {
  display: flex;
  align-items: center;
  margin-top: 40px;
  .show-participate-last {
    display: flex;
    align-items: center;
  }
}
.launch-pad-modal-header {
  margin-bottom: 10px;
  img {
    width: 20px;
    height: 30px;
    border-radius: 30px;
    object-fit: contain;
  }
  .sns-token-list-item-info-name {
    color: #fff;
    font-size: 20px;
    padding-left: 5px;
  }
}
.wrap {
  display: flex;
  position: relative;
  overflow: hidden;
}
.launch-pad-modal-info {
  margin-top: 10px;
  padding: 15px;
  border-radius: 5px;
  background: #141b23;
  tr {
    height: 40px;
    background: #141b23 !important;
    color: #adb3c4 !important;
  }
  td {
    > div {
      display: flex;
      align-items: center;
      word-break: keep-all;
    }
  }
}
.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  word-break: break-word;
  -webkit-line-clamp: 4;
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
.launch-pad-modal-slide {
  position: relative;
  height: 40px;
  margin-top: 40px;
  .launch-pad-modal-slide-line {
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: #646e79;
    &.launch-pad-modal-slide-current {
      z-index: 10;
      background: #51b7c3;
    }
  }
  .launch-pad-modal-slide-cap {
    position: absolute;
    top: 8px;
    i {
      display: inline-block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 8px 11px;
      border-color: transparent transparent #d9534f;
    }
    &.launch-pad-modal-slide-cap-hard {
      margin-right: -8px;
      color: #21c77d;
      i {
        border-color: transparent transparent #21c77d;
      }
    }
    &.launch-pad-modal-slide-cap-soft {
      margin-left: -8px;
      color: #51b7c3;
      i {
        border-color: transparent transparent #51b7c3;
      }
    }
    &.launch-pad-modal-slide-cap-completed {
      top: -22px;
      transform: translateX(-100%);
      white-space: nowrap;
      word-break: keep-all;
      color: #51b7c3;
    }
  }
}
.transfer-balance-right {
  color: #1996c4;
}
.launch-pad-token-item-info-h5 {
  display: flex;
  align-items: flex-start;
  line-height: 1;
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
  .launch-pad-token-item-info-label {
    color: #adb3c4;
  }
}
.show-pc-td {
  display: block;
  height: 40px;
}
td.show-pc-td {
  display: table-cell;
}
.h5-show {
  display: none;
}
.state-info-main {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 10px;
  .state-info-item {
    position: relative;
    flex: 1;
    background: #141b23;
    padding-left: 10px;
    .base-color-w {
      padding: 5px 0;
    }
    &.state-info-item-neuron {
      margin-left: 5px;
    }
    .loading-container {
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      ::v-deep.el-loading-spinner {
        position: static;
        margin-top: 0;
      }
    }
  }
  .state-info-item-scroller-main {
    padding: 0 5px;
  }
  .state-info-item-scroller {
    display: flex;
    font-size: 12px;
    padding-right: 5px;
  }
}
.confirmation-text {
  margin-top: 10px;
  color: #1996c4;
  span {
    margin-left: 10px;
  }
}
@media screen and (max-width: 992px) {
  .launch-pad-modal {
    width: 100%;
    padding: 0 15px;
  }
  .state-info-main {
    flex-direction: column;
    .state-info-item {
      width: 100%;
      margin-bottom: 10px;
    }
  }
  .show-pc-td {
    display: none;
  }
}
.voting-power-countdown-main {
  display: flex;
  align-items: center;
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
@media screen and (max-width: 768px) {
  .h5-show {
    display: block;
  }
  .show-pc-td {
    display: block;
    height: 80px;
  }
  .launch-pad-modal-title {
    margin-bottom: 20px;
  }
  .launch-pad-modal-info {
    padding: 15px 5px;
  }
  .state-info-item-scroller-main-sns {
    margin-left: auto;
  }
  .launch-pad-modal-slide {
    .launch-pad-modal-slide-cap {
      font-size: 12px;
      &.launch-pad-modal-slide-cap-hard {
        top: -22px;
        white-space: nowrap;
        word-break: keep-all;
        i {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.voting-power-countdown {
  line-height: 1;
  .ant-statistic-content {
    color: #d13651;
    font-size: 14px;
    text-align: center;
  }
}
</style>
