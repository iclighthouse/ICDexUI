<template>
  <div>
    <div class="mining-main base-font-title">
      <div class="mining-main-pair">
        <a-select
          @change="changeMining"
          class="mining-main-pair-select"
          v-model="currentMining"
        >
          <a-select-option v-for="item in miningList" :key="item.canisterId">
            <span>
              {{ item.symbol }}
            </span>
          </a-select-option>
        </a-select>
      </div>
      <div
        v-if="currentRound && currentRound.data && currentRound.data.length"
        class="base-title-size text-center base-font-normal mining-title mt20"
      >
        <a-icon
          v-show="Number(currentRound.round) > 1"
          @click="getPreRound"
          style="margin-right: 10px"
          class="pointer"
          type="double-left"
        />
        {{ miningSymbol[currentMining] }} Mining Round
        {{ currentRound.round.toString(10) }}
        <a-icon
          v-show="Number(currentRound.round) < maxRound"
          @click="getLastRound"
          style="margin-left: 10px"
          class="pointer"
          type="double-right"
        />
        <div
          v-if="currentRound && currentRound.data && currentRound.data.length"
          class="round-claim"
        >
          <a
            href="https://medium.com/@ICLighthouse/icdex-mining-guide-f242a49f2dc9"
            rel="nofollow noreferrer noopener"
            target="_blank"
            style="font-size: 14px; margin-right: 10px; color: #1996c4"
            >Guide</a
          >
          <button
            class="primary"
            style="margin: 0 auto; width: 140px"
            @click="onShowClaim"
          >
            Claim rewards
          </button>
        </div>
      </div>
      <div
        class="base-font-tip text-center round-config-time"
        v-if="currentRound && currentRound.data && currentRound.data.length"
      >
        {{ currentRound.data[0].config.startTime | formatDateToCalendar }} ~
        {{ currentRound.data[0].config.endTime | formatDateToCalendar }}
      </div>
      <div
        class="base-font-tip text-center round-config-time"
        v-if="currentRound && currentRound.data && currentRound.data.length"
      >
        <span
          :class="{
            'base-font-title':
              Object.keys(currentRound.data[0].status)[0] === 'Active'
          }"
          >{{ Object.keys(currentRound.data[0].status)[0] }}</span
        >
      </div>
      <div
        v-if="currentRound && currentRound.data && currentRound.data.length"
        class="round-info-main"
      >
        <div style="padding-top: 30px" class="round-time text-center">
          Trading mining rewards:
          <span class="round-info-icl">
            {{
              currentRound.data[0].config.supplyForTM
                | bigintToFloat(decimals, decimals)
                | formatNum
            }}
          </span>
          {{ miningSymbol[currentMining] }}, Liquidity mining rewards
          <span class="round-info-icl">
            {{
              currentRound.data[0].config.supplyForLM
                | bigintToFloat(decimals, decimals)
                | formatNum
            }}
          </span>
          {{ miningSymbol[currentMining] }}.
        </div>
        <div class="round-time text-center">
          <span v-if="accountData && getPrincipalId">
            <span
              >Your trading mining points:
              {{ accountData.points.tm.toString(10) }}
              <span
                v-if="Object.keys(currentRound.data[0].status)[0] === 'Closed'"
              >
                ({{
                  getRewards(
                    accountData.points.tm,
                    currentRound.data[0].points.totalPointsForTM,
                    currentRound.data[0].config.supplyForTM
                  ) | formatNum
                }}
                {{ miningSymbol[currentMining] }})
              </span>
              <span v-else>
                ({{
                  getRewardsPercent(
                    accountData.points.tm,
                    currentRound.data[0].points.totalPointsForTM
                  )
                }}) </span
              >;
            </span>
            <span
              >Your liquidity mining points:
              {{
                accountData.points.lm.toString(10)
                  | filterMiningPoints
                  | formatNum
              }}<span
                v-if="Object.keys(currentRound.data[0].status)[0] === 'Closed'"
              >
                ({{
                  getRewards(
                    accountData.points.lm,
                    currentRound.data[0].points.totalPointsForLM,
                    currentRound.data[0].config.supplyForLM
                  ) | formatNum
                }}
                {{ miningSymbol[currentMining] }}) </span
              ><span v-else>
                ({{
                  getRewardsPercent(
                    accountData.points.lm,
                    currentRound.data[0].points.totalPointsForLM
                  )
                }}) </span
              >.</span
            >
          </span>
        </div>
        <div
          class="round-time text-center"
          v-if="
            accountData &&
            getPrincipalId &&
            Object.keys(currentRound.data[0].status)[0] === 'Active' &&
            Number(accelerationRate) === 0
          "
        >
          <div>
            <span @click="bindNFT" class="main-color pointer"
              >&nbsp;Binding NFT can get 15% to 25% mining acceleration.
            </span>
            (Don't have an NFT yet? Go to
            <a
              href="https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai"
              target="_blank"
              rel="nofollow noreferrer noopener"
              class="link"
              >YUKU</a
            >
            and get one.)
          </div>
        </div>
        <div
          v-if="
            accountData &&
            getPrincipalId &&
            !(
              Object.keys(currentRound.data[0].status)[0] === 'Active' &&
              Number(accelerationRate) === 0
            ) &&
            accelerationRate &&
            Number(currentRound.round) === maxRound
          "
          class="round-time text-center"
        >
          +{{ accelerationRate | filterRate }} acceleration by holding
          <router-link class="main-color" to="/NFT">NFT</router-link>.
        </div>
        <div class="round-time">
          <div @click="onShowDetails" class="pointer base-font-tip text-center">
            {{ showDetails ? 'Close' : 'Details' }}...
          </div>
        </div>
        <div
          v-if="
            currentRound &&
            currentRound.data &&
            currentRound.data.length &&
            showDetails
          "
          class="round-time"
          style="line-height: 1.5; display: flex; flex-wrap: wrap"
        >
          Supported pairs for this round include&nbsp;
          <span v-for="(item, index) in miningPairs" :key="item[0].toString()">
            <router-link
              class="main-color"
              :to="`/ICDex/${item[1].pair.token0[1]}/${item[1].pair.token1[1]}`"
              >{{ item[1].pair.token0[1] }}/{{
                item[1].pair.token1[1]
              }}</router-link
            ><span v-show="index < miningPairs.length - 1">,&nbsp;</span>
          </span>
        </div>
        <div
          v-if="
            currentRound &&
            currentRound.data &&
            currentRound.data.length &&
            showDetails
          "
          class="round-time"
          style="text-align: left"
        >
          {{ currentRound.data[0].config.content }}
        </div>
        <div
          class="background-table mt20 flex-center"
          style="padding-top: 15px"
        >
          <!--<ul>
            <li
              @click="changeType('Trading')"
              :class="{ active: type === 'Trading' }"
            >
              Trading Mining
            </li>
            <li
              @click="changeType('Liquidity')"
              :class="{ active: type === 'Liquidity' }"
            >
              Liquidity Mining
            </li>
          </ul>-->
          <div class="margin-left-auto" style="padding-right: 16px">
            <button @click="showAccount" type="button">Search account</button>
          </div>
        </div>
        <div
          v-show="showSearchAccount"
          class="round-time background-table background-table-form"
        >
          <a-icon @click="hideAccount" type="close-circle" />
          <a-form-model
            :model="queryForm"
            ref="queryForm"
            :rules="queryFormRules"
            class="round-account-form"
          >
            <a-form-model-item label="Owner" prop="owner">
              <a-input
                v-model="queryForm.owner"
                autocomplete="off"
                placeholder="Owner(Principal)"
              />
            </a-form-model-item>
            <a-form-model-item label="Subaccount (Hex)" prop="subaccount">
              <a-input
                v-model="queryForm.subaccount"
                autocomplete="off"
                placeholder="Subaccount (optional)"
              />
            </a-form-model-item>
            <a-form-model-item class="margin-left-auto">
              <button @click="queryAccount" class="primary large-primary">
                Query
              </button>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="round-time background-table">
          <div class="round-main-info">
            <div>
              <div
                style="margin-bottom: 10px; font-size: 18px"
                class="base-color-w"
              >
                Trading Mining
                <router-link class="mining-link" to="/ICDex"
                  >Go to trade</router-link
                >
              </div>
              <span style="color: #5e6170; font-size: 12px">
                Notes: Only 15% of the volume of vip-maker account will be
                counted.
              </span>
            </div>
            <div>
              <div
                style="margin-bottom: 10px; font-size: 18px"
                class="base-color-w"
              >
                Liquidity Mining
                <router-link class="mining-link" to="/ICDex/pools"
                  >Go to add liquidity</router-link
                >
              </div>
              <div style="font-size: 12px; color: #5e6170; text-align: right">
                Data is updated every 30 minutes
              </div>
            </div>
          </div>
          <div class="round-main-info">
            <a-spin v-show="!showSearchAccount" :spinning="spinningTM">
              <table>
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>
                      Mining points
                      <a-tooltip placement="top">
                        <template slot="title">
                          Trading mining points are quote token values of vol,
                          i.e. ∑(TraderVolToken1 * Token1PriceUSD).
                        </template>
                        <a-icon class="pointer" type="question-circle" />
                      </a-tooltip>
                    </th>
                    <th>Percent</th>
                    <th>Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in miningRoundDataTM[0]"
                    :key="index"
                  >
                    <td>
                      <copy-account
                        :account="arrayToString(item[0])"
                        copyText="Account"
                      ></copy-account>
                    </td>
                    <td>
                      <span>{{ item[1].toString(10) }}</span>
                      <span
                        v-if="
                          Number(currentRound.round) === maxRound &&
                          addressAcceleration[arrayToString(item[0])]
                        "
                      >
                        <a-tooltip placement="top">
                          <template slot="title"> NFT acceleration </template>
                          <span class="link">
                            <img
                              style="width: 16px"
                              src="@/assets/img/rocket.png"
                              alt=""
                            />+{{
                              addressAcceleration[arrayToString(item[0])]
                                | filterRate
                            }}
                          </span>
                        </a-tooltip>
                      </span>
                    </td>
                    <td>
                      <span>
                        {{
                          item[1].toString(10)
                            | filterPercent(
                              currentRound.data[0].points.totalPointsForTM.toString(
                                10
                              )
                            )
                        }}
                      </span>
                    </td>
                    <td>
                      <span
                        v-if="
                          miningRoundDataTM[1] &&
                          miningRoundDataTM[1][index] &&
                          Object.keys(currentRound.data[0].status)[0] ===
                            'Closed'
                        "
                      >
                        {{
                          miningRoundDataTM[1][index][1]
                            | bigintToFloat(2, decimals)
                            | formatNum
                        }}
                        {{ miningSymbol[currentMining] }}
                      </span>
                      <a-tooltip placement="top">
                        <template slot="title">
                          <span
                            >EST.
                            {{
                              getRewards(
                                item[1],
                                currentRound.data[0].points.totalPointsForTM,
                                currentRound.data[0].config.supplyForTM
                              ) | formatNum
                            }}
                            {{ miningSymbol[currentMining] }}</span
                          >
                        </template>
                        <span
                          v-if="
                            !(
                              miningRoundDataTM[1] &&
                              miningRoundDataTM[1][index] &&
                              Object.keys(currentRound.data[0].status)[0] ===
                                'Closed'
                            )
                          "
                          >-</span
                        >
                      </a-tooltip>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="nft-main-pagination nft-main-pagination-tm">
                <a-pagination
                  v-if="totalTM > 100"
                  class="pagination"
                  :defaultPageSize="100"
                  :current="pageTM"
                  :total="totalTM"
                  @change="pageChangeTM"
                />
              </div>
            </a-spin>
            <a-spin v-show="!showSearchAccount" :spinning="spinningLM">
              <table>
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>
                      Mining points
                      <a-tooltip placement="top">
                        <template slot="title">
                          Liquidity mining points are time-weighted quote token
                          value, i.e. ∑(DurationSeconds * LiquidityToken1USD).
                          <div>
                            1M is approximately 10 USD (quote token) of
                            liquidity held for 1 day.
                          </div>
                        </template>
                        <a-icon class="pointer" type="question-circle" />
                      </a-tooltip>
                    </th>
                    <th>Percent</th>
                    <th>Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in miningRoundDataLM[0]"
                    :key="index"
                  >
                    <td>
                      <copy-account
                        :account="arrayToString(item[0])"
                        copyText="Account"
                      ></copy-account>
                    </td>
                    <td>
                      <span
                        >{{ item[1].toString(10) | filterMiningPoints }}
                      </span>
                      <span
                        v-if="
                          Number(currentRound.round) === maxRound &&
                          addressAcceleration[arrayToString(item[0])]
                        "
                      >
                        <a-tooltip placement="top">
                          <template slot="title"> NFT acceleration </template>
                          <span class="link">
                            <img
                              style="width: 16px"
                              src="@/assets/img/rocket.png"
                              alt=""
                            />+{{
                              addressAcceleration[arrayToString(item[0])]
                                | filterRate
                            }}
                          </span>
                        </a-tooltip>
                      </span>
                    </td>
                    <td>
                      <span>
                        {{
                          item[1].toString(10)
                            | filterPercent(
                              currentRound.data[0].points.totalPointsForLM.toString(
                                10
                              )
                            )
                        }}
                      </span>
                    </td>
                    <td>
                      <span
                        v-if="
                          miningRoundDataLM[1] &&
                          miningRoundDataLM[1][index] &&
                          Object.keys(currentRound.data[0].status)[0] ===
                            'Closed'
                        "
                      >
                        {{
                          miningRoundDataLM[1][index][1]
                            | bigintToFloat(2, decimals)
                            | formatNum
                        }}
                        {{ miningSymbol[currentMining] }}
                      </span>
                      <a-tooltip placement="top">
                        <template slot="title">
                          <span
                            >EST.
                            {{
                              getRewards(
                                item[1],
                                currentRound.data[0].points.totalPointsForLM,
                                currentRound.data[0].config.supplyForLM
                              ) | formatNum
                            }}
                            {{ miningSymbol[currentMining] }}</span
                          >
                        </template>
                        <span
                          v-if="
                            !(
                              miningRoundDataLM[1] &&
                              miningRoundDataLM[1][index] &&
                              Object.keys(currentRound.data[0].status)[0] ===
                                'Closed'
                            )
                          "
                          >-</span
                        >
                      </a-tooltip>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="nft-main-pagination">
                <a-pagination
                  v-if="totalLM > 100"
                  class="pagination"
                  :defaultPageSize="100"
                  :current="pageLM"
                  :total="totalLM"
                  @change="pageChangeLM"
                />
              </div>
            </a-spin>
          </div>
          <div class="round-main-info">
            <a-spin v-show="showSearchAccount" :spinning="spinningAccount">
              <table>
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>
                      Mining points
                      <a-tooltip placement="top">
                        <template slot="title">
                          Liquidity mining points are time-weighted quote token
                          value, i.e. ∑(DurationSeconds * LiquidityToken1USD).
                        </template>
                        <a-icon class="pointer" type="question-circle" />
                      </a-tooltip>
                    </th>
                    <th>Percent</th>
                    <th>Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <copy-account
                        v-if="miningRoundDataAccount"
                        :account="account"
                        copyText="Account"
                      ></copy-account>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span v-if="miningRoundDataAccount">{{
                        miningRoundDataAccount.points.tm
                      }}</span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span
                        v-if="
                          miningRoundDataAccount &&
                          miningRoundDataAccount.settlement.length
                        "
                      >
                        {{
                          miningRoundDataAccount.points.tm.toString(10)
                            | filterPercent(
                              currentRound.data[0].points.totalPointsForTM.toString(
                                10
                              )
                            )
                        }}
                      </span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span
                        v-if="
                          miningRoundDataAccount &&
                          Object.keys(currentRound.data[0].status)[0] ===
                            'Closed'
                        "
                      >
                        {{
                          miningRoundDataAccount.settlement[0].tm
                            | bigintToFloat(2, decimals)
                            | formatNum
                        }}
                        {{ miningSymbol[currentMining] }}
                      </span>
                      <a-tooltip placement="top">
                        <template slot="title">
                          <span v-if="miningRoundDataAccount && currentRound"
                            >EST.
                            {{
                              getRewards(
                                miningRoundDataAccount.points.tm,
                                currentRound.data[0].points.totalPointsForTM,
                                currentRound.data[0].config.supplyForTM
                              ) | formatNum
                            }}
                            {{ miningSymbol[currentMining] }}</span
                          >
                        </template>
                        <span
                          v-if="
                            !(
                              miningRoundDataAccount &&
                              Object.keys(currentRound.data[0].status)[0] ===
                                'Closed'
                            )
                          "
                          >-</span
                        >
                      </a-tooltip>
                    </td>
                  </tr>
                </tbody>
              </table>
            </a-spin>
            <a-spin v-show="showSearchAccount" :spinning="spinningAccount">
              <table>
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>
                      Mining points
                      <a-tooltip placement="top">
                        <template slot="title">
                          Liquidity mining points are time-weighted quote token
                          value, i.e. ∑(DurationSeconds * LiquidityToken1USD).
                        </template>
                        <a-icon class="pointer" type="question-circle" />
                      </a-tooltip>
                    </th>
                    <th>Percent</th>
                    <th>Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <copy-account
                        v-if="miningRoundDataAccount"
                        :account="account"
                        copyText="Account"
                      ></copy-account>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span v-if="miningRoundDataAccount">{{
                        miningRoundDataAccount.points.lm.toString(10)
                          | filterMiningPoints
                      }}</span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span
                        v-if="
                          miningRoundDataAccount &&
                          miningRoundDataAccount.settlement.length
                        "
                      >
                        {{
                          miningRoundDataAccount.points.lm.toString(10)
                            | filterPercent(
                              currentRound.data[0].points.totalPointsForLM.toString(
                                10
                              )
                            )
                        }}
                      </span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span
                        v-if="
                          miningRoundDataAccount &&
                          Object.keys(currentRound.data[0].status)[0] ===
                            'Closed'
                        "
                      >
                        {{
                          miningRoundDataAccount.settlement[0].lm
                            | bigintToFloat(2, decimals)
                            | formatNum
                        }}
                        {{ miningSymbol[currentMining] }}
                      </span>
                      <a-tooltip placement="top">
                        <template slot="title">
                          <span v-if="miningRoundDataAccount && currentRound"
                            >EST.
                            {{
                              getRewards(
                                miningRoundDataAccount.points.lm,
                                currentRound.data[0].points.totalPointsForLM,
                                currentRound.data[0].config.supplyForLM
                              ) | formatNum
                            }}
                            {{ miningSymbol[currentMining] }}</span
                          >
                        </template>
                        <span
                          v-if="
                            !(
                              miningRoundDataAccount &&
                              Object.keys(currentRound.data[0].status)[0] ===
                                'Closed'
                            )
                          "
                          >-</span
                        >
                      </a-tooltip>
                    </td>
                  </tr>
                </tbody>
              </table>
            </a-spin>
          </div>
        </div>
      </div>
      <div
        v-if="
          onGetRound &&
          !(currentRound && currentRound.data && currentRound.data.length)
        "
        style="
          margin-top: 60px;
          padding: 30px;
          background: #131920;
          border-radius: 10px;
          text-align: center;
        "
        class="container-width"
      >
        No Round
      </div>
    </div>
    <a-modal
      v-model="showClaim"
      width="670px"
      title="Claim mining rewards"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
      class="no-nft-modal"
    >
      <a-form-model :model="claimForm" ref="claimForm" :rules="claimFormRules">
        <a-form-model-item label="Owner" prop="owner">
          <a-input
            v-model="claimForm.owner"
            autocomplete="off"
            placeholder="Owner(Principal)"
            @change="canShowAvailable"
          />
        </a-form-model-item>
        <a-form-model-item label="Subaccount (Hex)" prop="subaccount">
          <a-input
            v-model="claimForm.subaccount"
            autocomplete="off"
            placeholder="Subaccount (optional)"
            @change="canShowAvailable"
          />
        </a-form-model-item>
        <div v-show="showAvailable">
          Available:
          {{ available | bigintToFloat(decimals, decimals) | formatNum }}
          {{ miningSymbol[currentMining] }}
        </div>
        <a-form-model-item>
          <button
            :disabled="!available"
            @click="Claim"
            class="primary large-primary w100 mt20"
          >
            Claim
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <nft-balance
      ref="nftBalance"
      :nft-balance="nftBalance"
      :nfts="nfts"
      :tokens="tokens"
      type="mining"
      @depositSuccess="depositSuccess"
      @NFTWithdrawSuccess="NFTWithdrawSuccess"
    ></nft-balance>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import Launch from '@/views/home/ICDex/components/Launch.vue';
import { Menu } from '@/components/menu/model';
import { AccountId, TokenInfo } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';
import { AccountData, RoundInfo } from '@/ic/Mining/model';
import { MiningService } from '@/ic/Mining/miningService';
import { namespace } from 'vuex-class';
import {
  hexToBytes,
  principalToAccountIdentifier,
  toHexString
} from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';
import { PairsData, TrieListData1 } from '@/ic/ICSwapRouter/model';
import { validateCanister } from '@/utils/validate';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { validateAccount, validatePrincipal } from '@/ic/utils';
import { checkAuth } from '@/ic/CheckAuth';
import NftBalance from '@/views/home/ICDex/components/NFTBalance.vue';
import { TokensExt } from '@/ic/nft/model';
import { NFT } from '@/ic/ICDexRouter/model';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';
import { NftService } from '@/ic/nft/Service';
import { getTokenInfo } from '@/ic/getTokenInfo';

const commonModule = namespace('common');

@Component({
  name: 'Mining',
  components: {
    AccountInfo,
    Launch,
    NftBalance
  },
  filters: {
    filterRate(val: string): string {
      return new BigNumber(val).times(100) + '%';
    },
    filterPercent(val: string, total: string): string {
      return new BigNumber(val).div(total).times(100).decimalPlaces(4) + '%';
    },
    filterMiningPoints(val: string) {
      if (new BigNumber(val).gt(10 ** 3)) {
        return (
          new BigNumber(val)
            .div(10 ** 6)
            .decimalPlaces(2)
            .toString(10) + 'M'
        );
      }
      return val;
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private tokens: { [key: string]: TokenInfo } = {};
  private menuList: Menu[] = [
    {
      value: 'Trade',
      path: '/ICDex'
    },
    {
      value: 'Pools',
      path: '/ICDex/pools'
    },
    {
      value: 'Mining',
      path: '/Mining'
    },
    {
      value: 'Info',
      path: '/ICDex/info'
    },
    {
      value: 'Competitions',
      path: '/ICDex/competitions'
    }
  ];
  private decimals = 8;
  private MiningService: MiningService = null;
  private ICDexRouterService: ICDexRouterService = null;
  private NftService: NftService = null;
  private currentRound: RoundInfo = null;
  private showDetails = false;
  private onGetRound = false;
  private maxRound = 1;
  private accelerationRate = '';
  private accountData: AccountData = null;
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService = null;
  private miningPairs: Array<PairsData> = [];
  private type = '';
  private pageLM = 1;
  private totalLM: number = null;
  private spinningLM = false;
  private pageTM = 1;
  private totalTM: number = null;
  private spinningTM = false;
  private spinningAccount = false;
  private miningRoundDataLM: [
    Array<[AccountId, bigint]>,
    Array<[AccountId, bigint]>
  ] = [[], []];
  private miningRoundDataTM: [
    Array<[AccountId, bigint]>,
    Array<[AccountId, bigint]>
  ] = [[], []];
  private showClaim = false;
  private miningRoundDataAccount: AccountData = null;
  private account = '';
  private addressAcceleration: { [key: string]: string } = {};
  private showSearchAccount = false;
  private queryForm = {
    owner: '',
    subaccount: ''
  };
  private nfts: TokensExt = [];
  private nftBalance: Array<NFT> = [];
  private miningList: Array<{
    canisterId: string;
    symbol: string;
    decimals: number;
  }> = [];
  private currentMining = '';
  private miningSymbol = {};
  private validateSubaccount = (
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void => {
    if (value && !validateAccount(value)) {
      callback('invalid subaccount');
    } else {
      callback();
    }
  };
  private queryFormRules = {
    owner: [
      {
        required: true,
        message: 'Please enter owner',
        trigger: 'blur'
      },
      { validator: validateCanister, trigger: ['change', 'blur'] }
    ],
    subaccount: [
      { validator: this.validateSubaccount, trigger: ['change', 'blur'] }
    ]
  };
  private showAvailable = false;
  private available = null;
  private claimForm = {
    owner: '',
    subaccount: ''
  };
  private claimFormRules = {
    owner: [
      {
        required: true,
        message: 'Please enter owner',
        trigger: 'blur'
      },
      { validator: validateCanister, trigger: ['change', 'blur'] }
    ],
    subaccount: [
      { validator: this.validateSubaccount, trigger: ['change', 'blur'] }
    ]
  };
  async created(): Promise<void> {
    this.miningList = [
      {
        canisterId: 'odhfn-cqaaa-aaaar-qaana-cai',
        symbol: 'ICL',
        decimals: 8
      },
      {
        canisterId: 'orbsu-oaaaa-aaaar-qaaoa-cai',
        symbol: 'CHAT',
        decimals: 8
      },
      {
        canisterId: 'owaua-dyaaa-aaaar-qaaoq-cai',
        symbol: 'MOTOKO',
        decimals: 8
      },
      {
        canisterId: 'oyczi-yiaaa-aaaar-qaapq-cai',
        symbol: 'EXE',
        decimals: 8
      }
    ];
    this.miningList.forEach((item) => {
      this.miningSymbol[item.canisterId] = item.symbol;
    });
    this.currentMining = 'odhfn-cqaaa-aaaar-qaana-cai';
    this.MiningService = new MiningService();
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.ICDexRouterService = new ICDexRouterService();
    this.NftService = new NftService();
    this.ICDexRouterService = new ICDexRouterService();
    this.NftService = new NftService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    console.log(this.$route.params);
    this.init();
    if (this.getPrincipalId) {
      await this.NFTBalance();
      await this.getTokensExt();
    }
  }
  private async init(): Promise<void> {
    this.currentRound = null;
    this.accountData = null;
    this.pageLM = 1;
    this.totalLM = null;
    this.pageTM = 1;
    this.totalTM = null;
    this.maxRound = 1;
    this.accelerationRate = '';
    if (this.$route.params && this.$route.params.type) {
      if (this.$route.params.type.toLocaleLowerCase().includes('liquidity')) {
        this.type = 'Liquidity';
      } else {
        this.type = 'Trading';
      }
    } else {
      this.type = 'Trading';
    }
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    this.getRound([]).finally(() => {
      loading.close();
      this.onGetRound = true;
    });
    this.getAccelerationRate();
    this.getAccountData();
  }
  private changeMining(): void {
    this.miningList.some((item) => {
      if (item.canisterId === this.currentMining) {
        this.decimals = item.decimals;
        return true;
      }
    });
    this.init();
  }
  private afterClose(): void {
    (this.$refs.claimForm as any).resetFields();
  }
  private onShowClaim(): void {
    if (this.getPrincipalId) {
      this.claimForm.owner = this.getPrincipalId;
      this.showAvailable = true;
      this.getBalance();
    }
    this.showClaim = true;
  }
  private Claim(): void {
    (this.$refs.claimForm as any).validate(async (valid: any) => {
      if (valid && this.available) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        let subaccount = [];
        if (this.claimForm.subaccount) {
          subaccount = [hexToBytes(this.claimForm.subaccount)];
        }
        const res = await this.MiningService.claim(this.currentMining, {
          owner: Principal.fromText(this.claimForm.owner),
          subaccount: subaccount
        });
        this.getBalance();
        if (res) {
          const type = Object.keys(res)[0];
          if (type === 'Ok') {
            this.$message.success('Success!');
          } else {
            const message = Object.values(res)[0];
            this.$message.error(message);
          }
        }
        loading.close();
      }
    });
  }
  private queryAccount(): void {
    (this.$refs.queryForm as any).validate(async (valid: any) => {
      if (valid) {
        this.spinningAccount = true;
        let subaccount = [];
        let accountId = '';
        if (this.queryForm.subaccount) {
          subaccount = hexToBytes(this.queryForm.subaccount);
          accountId = principalToAccountIdentifier(
            Principal.fromText(this.queryForm.owner),
            new Uint8Array(subaccount)
          );
        } else {
          accountId = principalToAccountIdentifier(
            Principal.fromText(this.queryForm.owner)
          );
        }
        this.account = accountId;
        this.miningRoundDataAccount = await this.MiningService.getAccountData(
          this.currentMining,
          hexToBytes(accountId),
          [this.currentRound.round]
        );
        this.spinningAccount = false;
      }
    });
  }
  private canShowAvailable(): void {
    let flag = false;
    if (this.claimForm.owner && validatePrincipal(this.claimForm.owner)) {
      if (
        this.claimForm.subaccount &&
        validateAccount(this.claimForm.subaccount)
      ) {
        flag = true;
      } else if (!this.claimForm.subaccount) {
        flag = true;
      }
    }
    this.showAvailable = flag;
    if (this.showAvailable) {
      this.available = null;
      this.getBalance();
    }
  }
  private async getBalance(): Promise<void> {
    let subaccount = [];
    let accountId = '';
    if (this.claimForm.subaccount) {
      subaccount = hexToBytes(this.claimForm.subaccount);
      accountId = principalToAccountIdentifier(
        Principal.fromText(this.claimForm.owner),
        new Uint8Array(subaccount)
      );
    } else {
      accountId = principalToAccountIdentifier(
        Principal.fromText(this.claimForm.owner)
      );
    }
    const res = await this.MiningService.getBalance(
      this.currentMining,
      hexToBytes(accountId)
    );
    this.available = res.available;
  }
  private getRewards(pointer: bigint, total: bigint, supply: bigint): string {
    return new BigNumber(pointer.toString(10))
      .times(supply.toString(10))
      .div(total.toString(10))
      .div(10 ** this.decimals)
      .decimalPlaces(2, 1)
      .toString(10);
  }
  private getRewardsPercent(pointer: bigint, total: bigint): string {
    return (
      new BigNumber(pointer.toString(10))
        .div(total.toString(10))
        .times(100)
        .decimalPlaces(4, 1)
        .toString(10) + '%'
    );
  }
  private async getRound(round: Array<bigint> = []): Promise<void> {
    this.currentRound = await this.MiningService.getRound(
      this.currentMining,
      round
    );
    if (!round.length) {
      console.log(this.maxRound);
      this.maxRound = Number(this.currentRound.round);
    }
    console.log(this.currentRound);
    if (
      this.currentRound &&
      this.currentRound.data &&
      this.currentRound.data.length &&
      !this.currentRound.data[0].config.startTime
    ) {
      if (Number(this.currentRound.round) === 1) {
        // 2024-02-02 00:00:00 UTC
        this.currentRound.data[0].config.startTime = BigInt(1706832000);
      } else {
        const res = await this.MiningService.getRound(this.currentMining, [
          BigInt(Number(this.currentRound.round) - 1)
        ]);
        this.currentRound.data[0].config.startTime = BigInt(
          Number(res.data[0].config.endTime) + 1
        );
      }
    }
    if (
      this.currentRound &&
      this.currentRound.data &&
      this.currentRound.data.length
    ) {
      this.getRoundPointsForLM();
      this.getRoundSettlementsForLM();
      this.getRoundPointsForTM();
      this.getRoundSettlementsForTM();
      if (!this.miningPairs.length) {
        this.getPairs();
      }
    }
  }
  private showAccount(): void {
    this.showSearchAccount = true;
  }
  private hideAccount(): void {
    this.showSearchAccount = false;
    (this.$refs.queryForm as any).resetFields();
    this.account = '';
    this.miningRoundDataAccount = null;
  }
  private getPreRound(): void {
    this.showDetails = false;
    this.type = 'Trading';
    this.pageLM = 1;
    this.totalLM = null;
    this.pageTM = 1;
    this.totalTM = null;
    this.miningRoundDataLM = [[], []];
    this.miningRoundDataTM = [[], []];
    this.hideAccount();
    const roundId = Number(this.currentRound.round);
    if (roundId > 1) {
      // if (
      //   this.$route.params.type &&
      //   this.$route.params.type.toLocaleLowerCase().includes('liquidity')
      // ) {
      //   this.$router.replace('/Mining');
      // }
      this.getRound([BigInt(roundId - 1)]);
    }
  }
  private getLastRound(): void {
    this.showDetails = false;
    this.type = 'Trading';
    this.pageLM = 1;
    this.totalLM = null;
    this.pageTM = 1;
    this.totalTM = null;
    this.miningRoundDataLM = [[], []];
    this.miningRoundDataTM = [[], []];
    this.hideAccount();
    const roundId = Number(this.currentRound.round);
    if (roundId < this.maxRound) {
      // if (
      //   this.$route.params.type &&
      //   this.$route.params.type.toLocaleLowerCase().includes('liquidity')
      // ) {
      //   this.$router.replace('/Mining');
      // }
      this.getRound([BigInt(roundId + 1)]);
    }
  }
  private async getPairs(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.getPairs(
      ['icdex'],
      [],
      []
    );
    console.log(res);
    let pairs = [];
    const info = this.currentRound.data[0];
    const type = Object.keys(info.config.pairs)[0];
    if (res && res.data && res.data.length) {
      res.data.forEach((item: TrieListData1) => {
        const currentPairId = item[0].toString();
        const score = new BigNumber(item[1].score1.toString(10))
          .plus(item[1].score2.toString(10))
          .plus(item[1].score3.toString(10));
        if (score.gte(info.config.pairFilter.minPairScore.toString(10))) {
          const blackList = info.config.pairFilter.blackList.some((item) => {
            return item.toString() === currentPairId;
          });
          if (!blackList) {
            if (type === 'all') {
              pairs.push(item);
            } else if (type === 'whitelist') {
              const whitelist = Object.values(info.config.pairs)[0];
              const flag = whitelist.some((item) => {
                return item.toString() === currentPairId;
              });
              if (flag) {
                pairs.push(item);
              }
            }
          }
        }
      });
    }
    console.log(pairs);
    this.miningPairs = pairs;
  }
  private async getAccelerationRate(): Promise<void> {
    if (this.getPrincipalId) {
      this.accelerationRate = await this.MiningService.getAccelerationRate(
        this.currentMining,
        hexToBytes(
          principalToAccountIdentifier(Principal.fromText(this.getPrincipalId))
        )
      );
    }
  }
  private async getAccountData(): Promise<void> {
    if (this.getPrincipalId) {
      this.accountData = await this.MiningService.getAccountData(
        this.currentMining,
        hexToBytes(
          principalToAccountIdentifier(Principal.fromText(this.getPrincipalId))
        )
      );
    }
  }
  private async getRoundPointsForLM(): Promise<void> {
    const res = await this.MiningService.getRoundPointsForLM(
      this.currentMining,
      this.currentRound.round,
      BigInt(this.pageLM)
    );
    console.log(res);
    if (res && res.data) {
      this.$set(this.miningRoundDataLM, 0, res.data);
      this.getAccelerationByAccount(res.data);
      if (!this.totalLM) {
        this.totalLM = Number(res.total);
      }
    }
  }
  private async getRoundSettlementsForLM(): Promise<void> {
    const res = await this.MiningService.getRoundSettlementsForLM(
      this.currentMining,
      this.currentRound.round,
      BigInt(this.pageLM)
    );
    console.log(res);
    if (res && res.data) {
      this.$set(this.miningRoundDataLM, 1, res.data);
    }
  }
  private async getRoundPointsForTM(): Promise<void> {
    this.spinningTM = true;
    const res = await this.MiningService.getRoundPointsForTM(
      this.currentMining,
      this.currentRound.round,
      BigInt(this.pageTM)
    );
    console.log(res);
    if (res && res.data) {
      this.$set(this.miningRoundDataTM, 0, res.data);
      this.getAccelerationByAccount(res.data);
      if (!this.totalTM) {
        this.totalTM = Number(res.total);
      }
    }
    console.log(this.totalTM);
    this.spinningTM = false;
  }
  private async getAccelerationByAccount(
    res: Array<[AccountId, bigint]>
  ): Promise<void> {
    let promiseValue = [];
    const max = 20;
    for (let i = 0; i < res.length; i++) {
      if (!this.addressAcceleration[toHexString(new Uint8Array(res[i][0]))]) {
        promiseValue.push(this.getCurrentAccelerationRate(res[i][0]));
      }
      if (promiseValue.length === max) {
        await Promise.all(promiseValue);
        promiseValue = [];
      }
      if (i === res.length - 1 && promiseValue.length) {
        console.log(i);
        await Promise.all(promiseValue);
      }
    }
  }
  private async getCurrentAccelerationRate(
    accountId: Array<number>
  ): Promise<void> {
    const res = await this.MiningService.getAccelerationRate(
      this.currentMining,
      accountId
    );
    if (!this.addressAcceleration[toHexString(new Uint8Array(accountId))]) {
      this.$set(
        this.addressAcceleration,
        toHexString(new Uint8Array(accountId)),
        res
      );
    }
  }
  private async getRoundSettlementsForTM(): Promise<void> {
    const res = await this.MiningService.getRoundSettlementsForTM(
      this.currentMining,
      this.currentRound.round,
      BigInt(this.pageTM)
    );
    console.log(res);
    if (res && res.data) {
      this.$set(this.miningRoundDataTM, 1, res.data);
    }
    console.log(this.miningRoundDataTM);
  }
  private pageChangeTM(page): void {
    this.pageTM = page;
    console.log(this.pageTM);
    this.getRoundPointsForTM();
    this.getRoundSettlementsForTM();
  }
  private pageChangeLM(page): void {
    this.pageLM = page;
    console.log(this.pageLM);
    this.getRoundPointsForLM();
    this.getRoundSettlementsForLM();
  }
  private changeType(type: string): void {
    if (this.type !== type) {
      this.type = type;
      this.$router.replace(`/Mining/${type}Mining`);
      // if (type === 'Trading') {
      //
      // }
    }
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private onShowDetails(): void {
    this.showDetails = !this.showDetails;
  }
  private bindNFT(): void {
    (this.$refs.nftBalance as any).init();
    (this.$refs.nftBalance as any).visible = true;
  }
  private async NFTBalance(): Promise<void> {
    const principal = localStorage.getItem('principal');
    this.nftBalance = await this.ICDexRouterService.NFTBalance(principal);
  }
  private async getTokensExt(): Promise<void> {
    try {
      const res = await this.NftService.tokens_ext();
      console.log(res);
      const tokensExt = (
        res as {
          ok: TokensExt;
        }
      ).ok;
      console.log(tokensExt);
      this.nfts = tokensExt;
    } catch (e) {
      console.log(e);
    }
  }
  private NFTWithdrawSuccess(): void {
    this.getTokensExt();
    this.NFTBalance().then(() => {
      (this.$refs.nftBalance as any).init();
    });
  }
  private depositSuccess(): void {
    this.getTokensExt();
    this.NFTBalance().then(() => {
      (this.$refs.nftBalance as any).init();
    });
  }
}
</script>

<style scoped lang="scss">
.mining-main-pair {
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
  .mining-main-pair-select {
    min-width: 140px;
  }
}
.mining-title {
  position: relative;
  .round-claim {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 10px;
  }
  i {
    position: relative;
    bottom: 3px;
    display: inline-block;
    width: 18px;
    height: 18px;
    padding-top: 4px;
    background: #5e6170;
    border-radius: 20px;
    color: #adb3c4;
    transition: all 0.3s;
    font-size: 10px;
    padding-bottom: 2px;
  }
}
.home-header {
  top: 14px;
}
.mining-main {
  margin-top: 14px;
  font-size: 15px;
  padding: 0 40px;
  min-width: 1100px;
  .round-info-icl {
    font-weight: bold;
    color: #fff;
  }
  .round-config-time {
    margin-top: 10px;
    font-size: 12px;
  }
}
.round-info-main {
  margin-top: 40px;
  background: #15161b;
  border-radius: 3px;
  padding: 0 20px;
  .round-time {
    padding: 15px 16px 0;
    a {
      &:hover {
        color: #51b7c3;
      }
    }
  }
  > div {
    &:last-child {
      padding-bottom: 15px;
    }
  }
  ul {
    display: flex;
    align-items: center;
    margin-left: 16px;
    li {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 18px;
      padding: 0 30px;
      background: #131920;
      color: #b9bcc4;
      cursor: pointer;
      border-radius: 30px;
      transition: all 0.3s;
      &.active {
        background: rgba(36, 67, 78, 0.8);
        color: #51b7c3;
      }
    }
  }
}
.nft-main-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  &.nft-main-pagination-tm {
    justify-content: flex-start;
    ul {
      margin-left: 0;
    }
  }
}
.background-table {
  /* background: #141b23;*/
}
table {
  margin-top: 20px;
  min-height: 200px;
  th {
    font-size: 16px;
    padding: 5px 10px;
  }
  td {
    padding: 5px 10px;
  }
}
.round-account-form {
  display: flex;
  align-items: flex-end;
  input {
    width: 400px;
    margin-right: 10px;
  }
}
.background-table-form {
  position: relative;
  i {
    position: absolute;
    right: 12px;
    top: 11px;
    cursor: pointer;
  }
  form {
    margin-bottom: 5px;
    padding: 10px;
    border-radius: 3px;
    box-shadow: 0 0 10px #000;
  }
}
.round-main-info {
  display: flex;
  > div {
    flex: 1;
    &:first-child {
      padding-right: 40px;
    }
    &:last-child {
      padding-left: 40px;
    }
  }
}
.mining-link {
  margin-left: 10px;
  font-size: 12px;
  color: #51b7c3;
  &:hover {
    color: #1996c4 !important;
  }
}
</style>
