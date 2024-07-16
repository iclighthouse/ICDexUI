<template>
  <div class="container-width neurons-main">
    <div v-if="getPrincipalId || currentNeuronForNeuronId" class="neurons-list">
      <div
        v-if="SNSNeuronsList.length && !currentNeuronForNeuronId"
        class="neurons-list-header"
      >
        <a-select
          class="neurons-list-header-option"
          v-model="currentNeuronInfoIndex"
          @change="changeSNSNeurons"
        >
          <a-select-option v-for="(item, index) in SNSNeuronsList" :key="index">
            <span v-if="item.SNSNeuronOfSNSTokenInfo">
              {{ item.SNSNeuronOfSNSTokenInfo.name }}
            </span>
          </a-select-option>
        </a-select>
        <button
          v-if="currentNeuronInfoIndex !== null"
          type="button"
          class="primary margin-left-auto"
          @click="
            onStakeNeuron(
              SNSNeuronsList[currentNeuronInfoIndex],
              currentNeuronInfoIndex,
              null
            )
          "
        >
          Stake
          {{
            SNSNeuronsList[currentNeuronInfoIndex].SNSNeuronOfSNSTokenInfo
              .symbol
          }}
        </button>
      </div>
      <div v-if="currentNeuronForNeuronId && getPrincipalId">
        <div
          class="neurons-list-main-back base-font-title pointer"
          @click="back"
        >
          <a-icon class="back-icon" type="arrow-left" />&nbsp;ICSNS-Neurons
        </div>
      </div>
      <div
        v-if="currentNeuronForNeuronId"
        class="neurons-list-main neurons-list-main-id"
      >
        <div class="neurons-list-item">
          <div class="neurons-list-header">
            <copy-account
              :account="arrayToString(currentNeuronForNeuronId.id[0].id)"
              copy-text="Neuron ID"
            ></copy-account>
            <div class="margin-left-auto">
              <a-icon
                v-show="getNeuronStatus(currentNeuronForNeuronId) === 'Locked'"
                type="lock"
              />
              <a-icon
                v-show="
                  getNeuronStatus(currentNeuronForNeuronId) === 'Dissolving' ||
                  getNeuronStatus(currentNeuronForNeuronId) === 'Dissolved'
                "
                type="clock-circle"
              />&nbsp;
              {{ getNeuronStatus(currentNeuronForNeuronId) }}
            </div>
          </div>
          <div class="neurons-status-info neurons-status-info-id">
            <div>
              <span
                v-if="getNeuronStatus(currentNeuronForNeuronId) === 'Locked'"
              >
                Age {{ currentNeuronForNeuronId.age }}
              </span>
            </div>
            <div class="margin-left-auto">
              <span
                v-show="
                  getNeuronStatus(currentNeuronForNeuronId) === 'Dissolving' ||
                  getNeuronStatus(currentNeuronForNeuronId) === 'Dissolved'
                "
                >Remaining
              </span>
              <span
                v-show="getNeuronStatus(currentNeuronForNeuronId) === 'Locked'"
                >Dissolve Delay
              </span>
              <span
                v-show="
                  getNeuronStatus(currentNeuronForNeuronId) !== 'Unspecified'
                "
              >
                <down
                  :neuron="currentNeuronForNeuronId"
                  @finish="finish"
                ></down>
              </span>
            </div>
          </div>
          <div class="neurons-list-balance">
            <span class="base-font-title">Staked</span>
            <span class="neuron-balance margin-left-auto" v-if="tokenInfo">
              {{ getNeuronBalanceById(currentNeuronForNeuronId, tokenInfo) }}
            </span>
            <span class="neuron-symbol" v-if="tokenInfo"
              >{{ tokenInfo.symbol }}
            </span>
          </div>
          <div class="neurons-list-balance neurons-list-balance-border">
            <span class="base-font-title">Maturity</span>
            <span class="neuron-balance margin-left-auto" v-if="tokenInfo">
              {{
                getNeuronMaturityBalanceById(
                  currentNeuronForNeuronId,
                  tokenInfo
                )
              }}
            </span>
            <span class="neuron-symbol" v-if="tokenInfo"
              >{{ tokenInfo.symbol }}
            </span>
          </div>
          <div class="neurons-list-balance neurons-list-balance-voting">
            <span class="base-font-title">Voting Power</span>
            <span class="margin-left-auto" v-if="tokenInfo">
              {{
                getVotingPower(
                  currentNeuronForNeuronId,
                  null,
                  nervousSystemParameters
                )
              }}
            </span>
          </div>
        </div>
      </div>
      <div
        class="neurons-list-main"
        v-if="
          SNSNeuronsList[currentNeuronInfoIndex] && !currentNeuronForNeuronId
        "
      >
        <div
          v-if="SNSNeuronsList[currentNeuronInfoIndex].loading"
          class="neurons-list-item neurons-list-item-skeleton"
        >
          <a-skeleton
            :loading="SNSNeuronsList[currentNeuronInfoIndex].loading"
            active
          >
          </a-skeleton>
        </div>
        <div
          class="neurons-list-item"
          v-for="(neuron, index) in SNSNeuronsList[currentNeuronInfoIndex]
            .SNSNeurons"
          :key="arrayToString(neuron.id[0].id)"
        >
          <div class="neurons-list-header">
            <copy-account
              :account="arrayToString(neuron.id[0].id)"
              copy-text="Neuron ID"
            ></copy-account>
            <div class="margin-left-auto">
              <a-icon
                v-show="getNeuronStatus(neuron) === 'Locked'"
                type="lock"
              />
              <a-icon
                v-show="
                  getNeuronStatus(neuron) === 'Dissolving' ||
                  getNeuronStatus(neuron) === 'Dissolved'
                "
                type="clock-circle"
              />
              {{ getNeuronStatus(neuron) }}
            </div>
          </div>
          <div class="neurons-status-info h5-show">
            <!--<div>
              <span v-if="getNeuronStatus(neuron) === 'Locked'">
                Age {{ neuron.age }}
              </span>
            </div>-->
            <div>
              <span
                v-show="
                  getNeuronStatus(neuron) === 'Dissolving' ||
                  getNeuronStatus(neuron) === 'Dissolved'
                "
                >Remaining
              </span>
              <span v-show="getNeuronStatus(neuron) === 'Locked'"
                >Dissolve Delay
              </span>
              <span v-show="getNeuronStatus(neuron) !== 'Unspecified'">
                <down
                  v-if="isH5"
                  :neuron="neuron"
                  :index="index"
                  @finish="finish"
                ></down>
              </span>
            </div>
          </div>
          <div class="neurons-list-balance">
            <span class="base-font-title">Staked</span>
            <div class="neurons-list-balance-dissolve-time pc-show">
              <a-tooltip placement="top">
                <template slot="title">
                  <span
                    v-show="
                      getNeuronStatus(neuron) === 'Dissolving' ||
                      getNeuronStatus(neuron) === 'Dissolved'
                    "
                    >Remaining
                  </span>
                  <span v-show="getNeuronStatus(neuron) === 'Locked'"
                    >Dissolve Delay
                  </span>
                </template>
                <a-icon
                  v-show="
                    getNeuronStatus(neuron) === 'Locked' ||
                    getNeuronStatus(neuron) === 'Dissolving' ||
                    getNeuronStatus(neuron) === 'Dissolved'
                  "
                  type="clock-circle"
                />
              </a-tooltip>
              <span v-show="getNeuronStatus(neuron) !== 'Unspecified'">
                &nbsp;<down
                  v-if="!isH5"
                  :neuron="neuron"
                  :index="index"
                  @finish="finish"
                ></down>
              </span>
            </div>
            <div class="margin-left-auto">
              <span class="neuron-balance">
                {{
                  getNeuronBalance(
                    neuron,
                    SNSNeuronsList[currentNeuronInfoIndex]
                  )
                }}</span
              ><span class="neuron-symbol"
                >{{
                  SNSNeuronsList[currentNeuronInfoIndex].SNSNeuronOfSNSTokenInfo
                    .symbol
                }}
              </span>
            </div>
          </div>
          <div class="operation pc-show">
            <a-tooltip placement="top">
              <template slot="title">
                <span
                  >Neuron needs a minimum stake of
                  {{ minStakeSplittable(currentNeuronInfoIndex) }}
                  {{
                    SNSNeuronsList[currentNeuronInfoIndex]
                      .SNSNeuronOfSNSTokenInfo.symbol
                  }}
                  to be splittable.</span
                >
              </template>
              <div>
                <button
                  v-show="
                    !canSplit(currentNeuronInfoIndex, index) &&
                    showOperation(
                      currentNeuronInfoIndex,
                      index,
                      neuronPermissionEnum['Split']
                    )
                  "
                  disabled
                  type="button"
                >
                  <span>Split</span>
                </button>
              </div>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title"> Split Neuron </template>
              <button
                v-show="
                  canSplit(currentNeuronInfoIndex, index) &&
                  showOperation(
                    currentNeuronInfoIndex,
                    index,
                    neuronPermissionEnum['Split']
                  )
                "
                type="button"
                @click="onSplitNeuron(currentNeuronInfoIndex, index)"
              >
                <span>Split</span>
              </button>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                Increase Staked
                {{
                  SNSNeuronsList[currentNeuronInfoIndex].SNSNeuronOfSNSTokenInfo
                    .symbol
                }}
              </template>
              <button
                @click="onIncreaseStakeNeuron(currentNeuronInfoIndex, index)"
                type="button"
              >
                <span><a-icon class="pc-show" type="plus" />Stake</span>
              </button>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title"> Set Dissolve Delay </template>
              <button
                v-show="
                  showOperation(
                    currentNeuronInfoIndex,
                    index,
                    neuronPermissionEnum['ConfigureDissolveState']
                  )
                "
                type="button"
                @click="delay(currentNeuronInfoIndex, index)"
              >
                <span>Delay</span>
              </button>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                <span
                  v-if="
                    !!(
                      neuron.vesting_period_seconds &&
                      neuron.vesting_period_seconds[0] &&
                      isVesting(
                        neuron.created_timestamp_seconds,
                        neuron.vesting_period_seconds[0]
                      )
                    )
                  "
                >
                  Vesting Period:
                  <a-statistic-countdown
                    class="adopted-countdown"
                    :value="
                      getVesting(
                        neuron.created_timestamp_seconds,
                        neuron.vesting_period_seconds[0]
                      )
                    "
                    format="DD:HH:mm:ss"
                  />
                </span>
                <span v-else>Start Dissolving</span>
              </template>
              <div
                v-show="
                  getNeuronStatus(neuron) === 'Locked' &&
                  showOperation(
                    currentNeuronInfoIndex,
                    index,
                    neuronPermissionEnum['ConfigureDissolveState']
                  )
                "
              >
                <button
                  @click="dissolve(currentNeuronInfoIndex, index)"
                  :disabled="
                    !!(
                      neuron.vesting_period_seconds &&
                      neuron.vesting_period_seconds[0] &&
                      isVesting(
                        neuron.created_timestamp_seconds,
                        neuron.vesting_period_seconds[0]
                      )
                    )
                  "
                  type="button"
                >
                  <span>Dissolve </span>
                </button>
              </div>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title"> Stop Dissolving </template>
              <button
                @click="stopDissolve(currentNeuronInfoIndex, index)"
                v-show="
                  getNeuronStatus(neuron) === 'Dissolving' &&
                  showOperation(
                    currentNeuronInfoIndex,
                    index,
                    neuronPermissionEnum['ConfigureDissolveState']
                  )
                "
                type="button"
              >
                <span>Stop</span>
              </button>
            </a-tooltip>
            <button
              v-show="
                getNeuronStatus(neuron) === 'Dissolved' &&
                showOperation(
                  currentNeuronInfoIndex,
                  index,
                  neuronPermissionEnum['Disburse']
                )
              "
              type="button"
              class="primary"
              @click="onDisburse(currentNeuronInfoIndex, index)"
            >
              <span>Disburse</span>
            </button>
          </div>
          <div class="operation h5-show">
            <div>
              <button
                v-show="
                  !canSplit(currentNeuronInfoIndex, index) &&
                  showOperation(
                    currentNeuronInfoIndex,
                    index,
                    neuronPermissionEnum['Split']
                  )
                "
                disabled
                type="button"
              >
                <span>Split</span>
              </button>
            </div>
            <button
              v-show="
                canSplit(currentNeuronInfoIndex, index) &&
                showOperation(
                  currentNeuronInfoIndex,
                  index,
                  neuronPermissionEnum['Split']
                )
              "
              type="button"
              @click="onSplitNeuron(currentNeuronInfoIndex, index)"
            >
              <span>Split</span>
            </button>
            <button
              @click="onIncreaseStakeNeuron(currentNeuronInfoIndex, index)"
              type="button"
            >
              <span><a-icon class="pc-show" type="plus" />Stake</span>
            </button>
            <button
              v-show="
                showOperation(
                  currentNeuronInfoIndex,
                  index,
                  neuronPermissionEnum['ConfigureDissolveState']
                )
              "
              type="button"
              @click="delay(currentNeuronInfoIndex, index)"
            >
              <span>Delay</span>
            </button>
            <button
              @click="dissolve(currentNeuronInfoIndex, index)"
              v-show="
                getNeuronStatus(neuron) === 'Locked' &&
                showOperation(
                  currentNeuronInfoIndex,
                  index,
                  neuronPermissionEnum['ConfigureDissolveState']
                )
              "
              :disabled="
                !!(
                  neuron.vesting_period_seconds &&
                  neuron.vesting_period_seconds[0] &&
                  isVesting(
                    neuron.created_timestamp_seconds,
                    neuron.vesting_period_seconds[0]
                  )
                )
              "
              type="button"
            >
              <span>Dissolve</span>
            </button>
            <button
              @click="stopDissolve(currentNeuronInfoIndex, index)"
              v-show="
                getNeuronStatus(neuron) === 'Dissolving' &&
                showOperation(
                  currentNeuronInfoIndex,
                  index,
                  neuronPermissionEnum['ConfigureDissolveState']
                )
              "
              type="button"
            >
              <span>Stop</span>
            </button>
            <button
              v-show="
                getNeuronStatus(neuron) === 'Dissolved' &&
                showOperation(
                  currentNeuronInfoIndex,
                  index,
                  neuronPermissionEnum['Disburse']
                )
              "
              type="button"
              class="primary"
              @click="onDisburse(currentNeuronInfoIndex, index)"
            >
              <span>Disburse</span>
            </button>
          </div>
          <div class="neurons-list-balance neurons-list-balance-border">
            <span class="base-font-title">Maturity</span>
            <div class="operation pc-show">
              <button
                v-show="
                  showOperation(
                    currentNeuronInfoIndex,
                    index,
                    neuronPermissionEnum['StakeMaturity']
                  )
                "
                type="button"
                :disabled="
                  canDisburseMaturity(
                    neuron,
                    SNSNeuronsList[currentNeuronInfoIndex]
                  )
                "
                @click="onStakeMaturity(currentNeuronInfoIndex, index)"
              >
                <span>Stake</span>
              </button>
              <button
                v-show="
                  showOperation(
                    currentNeuronInfoIndex,
                    index,
                    neuronPermissionEnum['DisburseMaturity']
                  )
                "
                :disabled="
                  canDisburseMaturity(
                    neuron,
                    SNSNeuronsList[currentNeuronInfoIndex]
                  )
                "
                type="button"
                @click="onDisburseMaturity(currentNeuronInfoIndex, index)"
              >
                <span>Disburse</span>
              </button>
              <a-tooltip placement="top">
                <template slot="title">
                  <div>
                    <span class="base-font-title">Disbursing countdown:</span>
                    <div
                      v-for="(
                        item, index
                      ) in neuron.disburse_maturity_in_progress"
                      :key="index"
                    >
                      <div class="disburse-maturity-in-progress-tooltip">
                        {{
                          item.amount_e8s
                            | bigintToFloat(
                              SNSNeuronsList[currentNeuronInfoIndex]
                                .SNSNeuronOfSNSTokenInfo.decimals,
                              SNSNeuronsList[currentNeuronInfoIndex]
                                .SNSNeuronOfSNSTokenInfo.decimals
                            )
                            | formatNum
                        }}
                        {{
                          SNSNeuronsList[currentNeuronInfoIndex]
                            .SNSNeuronOfSNSTokenInfo.symbol
                        }}
                        remaining&nbsp;
                        <disburse-maturity-in-progress
                          :disburseMaturityInProgress="
                            item.timestamp_of_disbursement_seconds
                          "
                        ></disburse-maturity-in-progress>
                      </div>
                    </div>
                  </div>
                </template>
                <a-icon
                  class="pointer disburse-maturity-in-progress-clock"
                  v-show="neuron.disburse_maturity_in_progress.length"
                  type="clock-circle"
                />
              </a-tooltip>
            </div>
            <span class="neuron-balance margin-left-auto">
              {{
                getNeuronMaturityBalance(
                  neuron,
                  SNSNeuronsList[currentNeuronInfoIndex]
                )
              }}
            </span>
            <span class="neuron-symbol"
              >{{
                SNSNeuronsList[currentNeuronInfoIndex].SNSNeuronOfSNSTokenInfo
                  .symbol
              }}
            </span>
          </div>
          <div class="operation h5-show">
            <button
              v-show="
                showOperation(
                  currentNeuronInfoIndex,
                  index,
                  neuronPermissionEnum['StakeMaturity']
                )
              "
              :disabled="
                canDisburseMaturity(
                  neuron,
                  SNSNeuronsList[currentNeuronInfoIndex]
                )
              "
              type="button"
              @click="onStakeMaturity(currentNeuronInfoIndex, index)"
            >
              <span>Stake</span>
            </button>
            <button
              v-show="
                showOperation(
                  currentNeuronInfoIndex,
                  index,
                  neuronPermissionEnum['DisburseMaturity']
                )
              "
              :disabled="
                canDisburseMaturity(
                  neuron,
                  SNSNeuronsList[currentNeuronInfoIndex]
                )
              "
              type="button"
              @click="onDisburseMaturity(currentNeuronInfoIndex, index)"
            >
              <span>Disburse</span>
            </button>
            <a-tooltip placement="top" trigger="click">
              <template slot="title">
                <div>
                  <span class="base-font-title">Disbursing countdown:</span>
                  <div
                    v-for="(
                      item, index
                    ) in neuron.disburse_maturity_in_progress"
                    :key="index"
                  >
                    <div class="disburse-maturity-in-progress-tooltip">
                      {{
                        item.amount_e8s
                          | bigintToFloat(
                            SNSNeuronsList[currentNeuronInfoIndex]
                              .SNSNeuronOfSNSTokenInfo.decimals,
                            SNSNeuronsList[currentNeuronInfoIndex]
                              .SNSNeuronOfSNSTokenInfo.decimals
                          )
                          | formatNum
                      }}
                      {{
                        SNSNeuronsList[currentNeuronInfoIndex]
                          .SNSNeuronOfSNSTokenInfo.symbol
                      }}
                      remaining&nbsp;
                      <disburse-maturity-in-progress
                        :disburseMaturityInProgress="
                          item.timestamp_of_disbursement_seconds
                        "
                      ></disburse-maturity-in-progress>
                    </div>
                  </div>
                </div>
              </template>
              <a-icon
                class="pointer disburse-maturity-in-progress-clock"
                v-show="neuron.disburse_maturity_in_progress.length"
                type="clock-circle"
              />
            </a-tooltip>
          </div>
          <!--<div class="staked-maturity-equivalent" v-if="neuron.disburse_maturity_in_progress && neuron.disburse_maturity_in_progress.length">
						<span>Disburse maturity in progress</span>
						<span class="margin-left-auto">
							<span class="neuron-balance">
                {{
                  filterDisburseMaturityInProgress(neuron.disburse_maturity_in_progress)
                    | formatNum
                }}
              </span>
							<span class="neuron-symbol">
                {{
                  SNSNeuronsList[currentNeuronInfoIndex].SNSNeuronOfSNSTokenInfo
                    .symbol
                }}
              </span>
						</span>
					</div>-->
          <div
            v-if="
              neuron.staked_maturity_e8s_equivalent &&
              neuron.staked_maturity_e8s_equivalent[0]
            "
            class="staked-maturity-equivalent"
          >
            <span>Of which staked</span>
            <span class="margin-left-auto">
              <span class="neuron-balance">
                {{
                  neuron.staked_maturity_e8s_equivalent[0]
                    | bigintToFloat(
                      2,
                      SNSNeuronsList[currentNeuronInfoIndex]
                        .SNSNeuronOfSNSTokenInfo.decimals
                    )
                    | formatNum
                }}
              </span>
              <span class="neuron-symbol">
                {{
                  SNSNeuronsList[currentNeuronInfoIndex].SNSNeuronOfSNSTokenInfo
                    .symbol
                }}
              </span>
            </span>
          </div>
          <div
            v-show="
              showOperation(
                currentNeuronInfoIndex,
                index,
                neuronPermissionEnum['StakeMaturity']
              )
            "
            class="auto-stake--maturity-checkbox"
          >
            <a-checkbox
              :checked="neuron.auto_stake_maturity[0]"
              @click="onAutoStakeMaturity(currentNeuronInfoIndex, index)"
            >
              Automatically stake new maturity.
            </a-checkbox>
          </div>
          <!--<div class="operation">
							<button type="button">
								<span>Stake</span>
							</button>
							<button type="button">
								<span>Disburse</span>
							</button>
						</div>-->
          <div class="neurons-list-balance neurons-list-balance-voting">
            <div class="operation">
              <button
                v-show="
                  showOperation(
                    currentNeuronInfoIndex,
                    index,
                    neuronPermissionEnum['Vote']
                  )
                "
                type="button"
                @click="onFollowing(currentNeuronInfoIndex, index)"
              >
                <span>Following</span>
              </button>
              <button
                v-show="
                  showOperation(
                    currentNeuronInfoIndex,
                    index,
                    neuronPermissionEnum['ManagePrincipals']
                  )
                "
                type="button"
                @click="onPermissions(currentNeuronInfoIndex, index)"
              >
                <span>Permissions</span>
              </button>
            </div>
            <div class="margin-left-auto voting-power-title-main">
              <span class="margin-left-auto voting-power-title"
                >Voting Power</span
              >
              <span>
                {{
                  getVotingPower(neuron, SNSNeuronsList[currentNeuronInfoIndex])
                }}
              </span>
            </div>
          </div>
        </div>
        <!--<div>
          <button type="button" @click="loadMore">loading more</button>
        </div>-->
        <div
          class="no-neuron"
          v-show="
            !SNSNeuronsList[currentNeuronInfoIndex].loading &&
            !SNSNeuronsList[currentNeuronInfoIndex].SNSNeurons.length
          "
        >
          No Neurons
        </div>
      </div>
    </div>
    <div v-else>
      <div class="wallet-empty container-width">
        <img src="@/assets/img/empty.png" alt="" />
        <p>Connect wallet to view</p>
        <button type="button" class="default" @click="connectWallet">
          Connect Wallet
        </button>
      </div>
    </div>
    <a-modal
      v-model="stakeNeuronVisible"
      centered
      :title="stakeNeuronTitle"
      width="650px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
    >
      <a-form-model
        :model="stakeNeuronForm"
        ref="stakeNeuronForm"
        :rules="stakeNeuronFormRules"
      >
        <a-form-model-item label="Amount" prop="amount">
          <a-input
            v-if="currentNeuron && currentNeuron.SNSNeuronOfSNSTokenInfo"
            v-model="stakeNeuronForm.amount"
            autocomplete="off"
            type="text"
            v-only-float="currentNeuron.SNSNeuronOfSNSTokenInfo.decimals"
            min="0"
            placeholder="0.00"
            :suffix="currentNeuron.SNSNeuronOfSNSTokenInfo.symbol"
          />
        </a-form-model-item>
        <div
          class="transfer-balance"
          v-if="currentNeuron && currentNeuron.SNSNeuronOfSNSTokenInfo"
        >
          <div class="transfer-balance-left">
            <p>
              Balance:
              {{
                stakeNeuronOfTokenBalance
                  | bigintToFloat(
                    currentNeuron.SNSNeuronOfSNSTokenInfo.decimals,
                    currentNeuron.SNSNeuronOfSNSTokenInfo.decimals
                  )
                  | formatNum
              }}
              {{ currentNeuron.SNSNeuronOfSNSTokenInfo.symbol }}
            </p>
            <p>
              Fee:
              {{
                currentNeuron.SNSNeuronOfSNSTokenInfo.fee
                  | bigintToFloat(
                    currentNeuron.SNSNeuronOfSNSTokenInfo.decimals,
                    currentNeuron.SNSNeuronOfSNSTokenInfo.decimals
                  )
              }}
              {{ currentNeuron.SNSNeuronOfSNSTokenInfo.symbol }}
            </p>
          </div>
          <div class="transfer-balance-right" @click="setMaxBalance">Max</div>
        </div>
        <a-form-model-item>
          <button
            type="button"
            class="w100 transfer-submit large-primary primary"
            @click="onSubmitStakeNeuron"
          >
            {{ stakeNeuronTitle }}
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      centered
      v-model="splitVisible"
      title="Split Neuron"
      width="650px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="disburse-modal"
      :after-close="afterSplitClose"
    >
      <a-form-model :model="splitForm" ref="splitForm" :rules="splitFormRules">
        <a-form-model-item label="Amount" prop="amount">
          <a-input
            v-if="currentNeuron && currentNeuron.SNSNeuronOfSNSTokenInfo"
            v-model="splitForm.amount"
            autocomplete="off"
            type="text"
            v-only-float="currentNeuron.SNSNeuronOfSNSTokenInfo.decimals"
            min="0"
            placeholder="0.00"
            :suffix="currentNeuron.SNSNeuronOfSNSTokenInfo.symbol"
          />
        </a-form-model-item>
        <div
          v-if="
            currentNeuron &&
            currentNeuron.SNSNeuronOfSNSTokenInfo &&
            (currentNeuronIndex || currentNeuronIndex === 0)
          "
          class="transfer-balance"
        >
          <div class="transfer-balance-left">
            <p>
              Balance:
              {{
                getNeuronBalance(
                  currentNeuron.SNSNeurons[currentNeuronIndex],
                  currentNeuron
                )
              }}
              {{ currentNeuron.SNSNeuronOfSNSTokenInfo.symbol }}
            </p>
            <p>
              Fee:
              {{
                currentNeuron.SNSNeuronOfSNSTokenInfo.fee
                  | bigintToFloat(
                    currentNeuron.SNSNeuronOfSNSTokenInfo.decimals,
                    currentNeuron.SNSNeuronOfSNSTokenInfo.decimals
                  )
              }}
              {{ currentNeuron.SNSNeuronOfSNSTokenInfo.symbol }}
            </p>
          </div>
          <div class="transfer-balance-right" @click="setSplitMaxBalance">
            Max
          </div>
        </div>
        <a-form-model-item>
          <button
            type="button"
            class="transfer-submit primary large-primary w100"
            @click="onSplit"
          >
            Split Neuron
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <increase-dissolve-delay
      ref="increaseDissolveDelay"
      @SetDissolveDelaySuccess="SetDissolveDelaySuccess"
    ></increase-dissolve-delay>
    <following
      ref="following"
      @setListNervousSystemFunctions="setListNervousSystemFunctions"
      @followNeuronSuccess="followNeuronSuccess"
    ></following>
    <permissions
      ref="permissions"
      @permissionsNeuronSuccess="permissionsNeuronSuccess"
    ></permissions>
    <a-modal
      centered
      v-model="changeAutoStakeMaturityVisible"
      title=" "
      width="450px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="disburse-modal"
    >
      <div>
        {{ changeAutoStakeMaturityMessage }}
      </div>
      <div class="change-auto-stake-maturity-button">
        <button type="button" @click="changeAutoStakeMaturityVisible = false">
          Cancel
        </button>
        <button
          class="primary"
          type="button"
          @click="onChangeAutoStakeMaturity"
        >
          Submit
        </button>
      </div>
    </a-modal>
    <a-modal
      centered
      v-model="stakeMaturityVisible"
      title="Stake Maturity"
      width="650px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="disburse-modal"
    >
      <div class="maturity-available">
        <span>Maturity available</span>
        <span
          class="margin-left-auto"
          v-if="
            SNSNeuronsList && (currentNeuronIndex || currentNeuronIndex === 0)
          "
        >
          {{
            getNeuronMaturityBalance(
              SNSNeuronsList[currentNeuronInfoIndex].SNSNeurons[
                currentNeuronIndex
              ],
              SNSNeuronsList[currentNeuronInfoIndex]
            )
          }}
        </span>
      </div>
      <div class="mt20">
        Choose how much of the maturity available to stake into this neuron.
        <a-slider v-model="stakeMaturityValue" :tip-formatter="formatter" />
        <div class="base-font-title text-center">{{ stakeMaturityValue }}%</div>
      </div>
      <div class="mt20">
        <button
          class="primary w100 large-primary"
          type="button"
          @click="stakeMaturity"
        >
          Submit
        </button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import EventBus from '@/utils/Event';
import { connectIcx, initIcx } from '@/ic/connectIcx';
import { DeployedSns } from '@/ic/SNSWasm/model';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import {
  GovernanceError,
  ListNervousSystemFunctionsResponse,
  ListNeurons,
  NervousSystemParameters,
  SNSNeuron,
  SNSNeuronId
} from '@/ic/SNSGovernance/model';
import { namespace } from 'vuex-class';
import { Principal } from '@dfinity/principal';
import {
  NeuronPermissionEnum,
  SNSNeuronsInfo,
  SNSNeuronStatus
} from '@/views/home/ICSNS/model';
import { Icrc1Account, TokenInfo } from '@/ic/common/icType';
import { getTokenInfo } from '@/ic/getTokenInfo';
import BigNumber from 'bignumber.js';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { getTokenBalance } from '@/ic/getTokenBalance';
import { createSNSSubAccount } from '@/ic/utils';
import { checkAuth } from '@/ic/CheckAuth';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { hexToBytes, toHexString, uint8ArrayToBigInt } from '@/ic/converter';
import IncreaseDissolveDelay from './components/IncreaseDissolveDelay.vue';
import Following from '@/views/home/ICSNS/components/Following.vue';
import Permissions from '@/views/home/ICSNS/components/Permissions.vue';
import randomBytes from 'randombytes';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { questsService } from '@/ic/quests/questsService';
import Down from './down.vue';
import DisburseMaturityInProgress from './disburseMaturityInProgress.vue';
import { SNSSwapService } from '@/ic/SNSSwap/SNSSwapService';

const commonModule = namespace('common');

@Component({
  name: 'Neurons',
  components: {
    IncreaseDissolveDelay,
    Following,
    Permissions,
    Down,
    DisburseMaturityInProgress
  }
})
export default class extends Vue {
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private neuronPermissionEnum = NeuronPermissionEnum;
  private SNSWasmService: SNSWasmService = null;
  private questsService: questsService = null;
  private tokens: { [key: string]: TokenInfo } = {};
  private tokenId = '';
  private neuronId = '';
  private currentNeuronForNeuronId: SNSNeuron = null;
  private nervousSystemParameters: NervousSystemParameters = null;
  private tokenInfo: TokenInfo = null;
  private isIcx = false;
  private isH5 = false;
  private deployedSnses: Array<DeployedSns> = [];
  private SNSNeuronsList: Array<SNSNeuronsInfo> = [];
  private busy = false;
  private currentNeuron: SNSNeuronsInfo = null;
  private currentNeuronInfoIndex = null;
  private currentNeuronIndex = null;
  private changeAutoStakeMaturityVisible = false;
  private changeAutoStakeMaturityMessage =
    'Are you sure that you would like to automatically stake new maturity of this neuron?';
  private stakeMaturityVisible = false;
  private stakeMaturityValue = 0;
  private stakeNeuronVisible = false;
  private stakeNeuronTitle = 'Stake Neuron';
  private stakeNeuronForm = {
    amount: ''
  };
  private stakeNeuronOfTokenBalance = '';
  private stakeNeuronFormRules = {
    amount: [
      { required: true, message: 'Please enter Amount', trigger: 'change' },
      { validator: this.validateAmount, trigger: 'change' }
    ]
  };
  private timer = null;
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const fee = this.currentNeuron.SNSNeuronOfSNSTokenInfo.fee as bigint;
    const max = Number(
      new BigNumber(this.stakeNeuronOfTokenBalance)
        .minus(fee.toString(10))
        .div(10 ** Number(this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals))
        .minus(value)
    );
    let currentNeuronMinimumStakeE8s = BigInt(0);
    if (
      this.currentNeuron.nervousSystemParameters &&
      this.currentNeuron.nervousSystemParameters.neuron_minimum_stake_e8s[0]
    ) {
      currentNeuronMinimumStakeE8s =
        this.currentNeuron.nervousSystemParameters.neuron_minimum_stake_e8s[0];
    }
    if (value && max < 0) {
      callback(
        `Insufficient ${this.currentNeuron.SNSNeuronOfSNSTokenInfo.symbol}`
      );
    } else if (
      currentNeuronMinimumStakeE8s &&
      this.stakeNeuronTitle.startsWith('Stake')
    ) {
      if (
        new BigNumber(currentNeuronMinimumStakeE8s.toString(10))
          .div(
            10 ** Number(this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals)
          )
          .gt(value)
      ) {
        const minAmount = new BigNumber(
          currentNeuronMinimumStakeE8s.toString(10)
        )
          .div(
            10 ** Number(this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals)
          )
          .toString(10);
        callback(
          `Min amount is ${minAmount} ${this.currentNeuron.SNSNeuronOfSNSTokenInfo.symbol}`
        );
      } else {
        callback();
      }
    } else {
      callback();
    }
  }
  private splitVisible = false;
  private splitForm = {
    amount: ''
  };
  private splitFormRules = {
    amount: [
      {
        required: true,
        message: 'Please enter Amount',
        trigger: ['change', 'blur']
      },
      { validator: this.validateSplitAmount, trigger: ['change', 'blur'] }
    ]
  };
  private validateSplitAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const fee = new BigNumber(
      (this.currentNeuron.SNSNeuronOfSNSTokenInfo.fee as bigint).toString(10)
    ).div(10 ** Number(this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals));
    let currentNeuronMinimumStakeE8s = BigInt(0);
    if (
      this.currentNeuron.nervousSystemParameters &&
      this.currentNeuron.nervousSystemParameters.neuron_minimum_stake_e8s[0]
    ) {
      currentNeuronMinimumStakeE8s =
        this.currentNeuron.nervousSystemParameters.neuron_minimum_stake_e8s[0];
    }
    const neuronBalance = this.getNeuronBalance(
      this.currentNeuron.SNSNeurons[this.currentNeuronIndex],
      this.currentNeuron
    );
    console.log(neuronBalance);
    const minAmount = new BigNumber(currentNeuronMinimumStakeE8s.toString(10))
      .div(10 ** Number(this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals))
      .plus(fee)
      .toString(10);
    const max = Number(
      new BigNumber(neuronBalance)
        .times(
          10 ** Number(this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals)
        )
        .minus(currentNeuronMinimumStakeE8s.toString(10))
        .div(10 ** Number(this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals))
        .toString(10)
    );
    if (value && new BigNumber(max).lt(value)) {
      callback(
        `Max amount is ${max} ${this.currentNeuron.SNSNeuronOfSNSTokenInfo.symbol}`
      );
    } else if (value && new BigNumber(minAmount).gt(value)) {
      callback(
        `Min amount is ${minAmount} ${this.currentNeuron.SNSNeuronOfSNSTokenInfo.symbol}`
      );
    } else {
      callback();
    }
  }
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
    console.log(this.SNSNeuronsList);
  }
  async mounted(): Promise<void> {
    this.SNSWasmService = new SNSWasmService();
    this.questsService = new questsService();
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
    const principal = localStorage.getItem('principal');
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (this.$route.meta.details === 'neuron') {
      this.tokenId = this.$route.params.tokenId.trim();
      this.neuronId = this.$route.params.neuronId.trim();
    }
    if ((window as any).icx) {
      this.isIcx = !!(window as any).icx;
      EventBus.$on('initSuccess', () => {
        if (this.$route.meta.details === 'neuron') {
          this.initForNeuronId();
        } else {
          if (principal) {
            this.init();
          }
        }
      });
      await initIcx();
    }
    if (this.$route.meta.details === 'neuron') {
      this.initForNeuronId();
    } else {
      if (principal) {
        this.init();
      }
    }
  }
  private async initForNeuronId(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const listDeployedSnses = await this.SNSWasmService.listDeployedSnses();
      let governanceId;
      if (listDeployedSnses && listDeployedSnses.length) {
        for (let i = 0; i < listDeployedSnses.length; i++) {
          if (
            listDeployedSnses[i].ledger_canister_id &&
            listDeployedSnses[i].ledger_canister_id.length
          ) {
            if (
              listDeployedSnses[i].ledger_canister_id[0].toString() ===
              this.tokenId
            ) {
              governanceId =
                listDeployedSnses[i].governance_canister_id[0].toString();
              break;
            }
          }
        }
      }
      console.log(governanceId);
      const snsGovernanceService = new SNSGovernanceService();
      const promiseValue = [];
      promiseValue.push(
        snsGovernanceService.getNeuron(governanceId, [
          {
            id: Array.from(hexToBytes(this.neuronId))
          }
        ]),
        snsGovernanceService.getNervousSystemParameters(governanceId)
      );
      if (!this.tokens[this.tokenId]) {
        promiseValue.push(
          getTokenInfo(Principal.fromText(this.tokenId), {
            icrc1: null
          })
        );
      } else {
        this.tokenInfo = this.tokens[this.tokenId];
      }
      const res = await Promise.all(promiseValue);
      this.nervousSystemParameters = res[1];
      if (res[2]) {
        this.tokenInfo = res[2];
      }
      if (res[0] && res[0].result) {
        const type = Object.keys(res[0].result[0])[0];
        if (type === 'Neuron') {
          const neuron = Object.values(
            res[0].result[0] as { Neuron: SNSNeuron }
          )[0];
          this.currentNeuronForNeuronId = neuron;
          console.log(neuron);
        }
      }
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private init(): void {
    this.listDeployedSnses();
  }
  private afterClose(): void {
    window.clearInterval(this.timer);
    this.timer = null;
    this.currentNeuronIndex = null;
    this.stakeNeuronOfTokenBalance = '';
    (this.$refs.stakeNeuronForm as any).resetFields();
  }
  private afterSplitClose(): void {
    (this.$refs.splitForm as any).resetFields();
  }
  private async onSplit(): Promise<void> {
    (this.$refs.splitForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          await checkAuth();
          try {
            const amount = BigInt(
              new BigNumber(this.splitForm.amount)
                .times(
                  10 ** this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals
                )
                .toString(10)
            );
            const nonceBytes = new Uint8Array(randomBytes(8));
            const memo = uint8ArrayToBigInt(nonceBytes);
            const snsGovernanceService = new SNSGovernanceService();
            const res = await snsGovernanceService.split(
              this.currentNeuron.SNSNeuronOfGovernanceId,
              this.currentNeuron.SNSNeurons[this.currentNeuronIndex].id[0].id,
              amount,
              memo
            );
            console.log(amount);
            console.log(res);
            if (res && res.command) {
              const type = Object.keys(res.command[0])[0];
              if (type === 'Error') {
                const err = Object.values(res.command[0])[0] as GovernanceError;
                this.$message.error(err.error_message);
              } else {
                this.$message.success('Split Neuron Success');
                this.splitVisible = false;
                this.refreshNeurons(
                  this.currentNeuron.SNSNeuronOfGovernanceId,
                  this.SNSNeuronsList[this.currentNeuronInfoIndex]
                    .SNSNeuronPageSize,
                  [],
                  this.currentNeuronInfoIndex
                );
              }
            } else {
              this.$message.error('Split Neuron Error');
            }
          } catch (e) {
            console.log(e);
          }
          loading.close();
        }
      }
    );
  }
  private setSplitMaxBalance(): void {
    let currentNeuronMinimumStakeE8s = BigInt(0);
    if (
      this.currentNeuron.nervousSystemParameters &&
      this.currentNeuron.nervousSystemParameters.neuron_minimum_stake_e8s[0]
    ) {
      currentNeuronMinimumStakeE8s =
        this.currentNeuron.nervousSystemParameters.neuron_minimum_stake_e8s[0];
    }
    const neuronBalance = this.getNeuronBalance(
      this.currentNeuron.SNSNeurons[this.currentNeuronIndex],
      this.currentNeuron
    );
    const minAmount = new BigNumber(currentNeuronMinimumStakeE8s.toString(10))
      .div(10 ** Number(this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals))
      .toString(10);
    const max = new BigNumber(neuronBalance).minus(minAmount);
    if (max.gte(0)) {
      this.splitForm.amount = max.toString(10);
    } else {
      this.splitForm.amount = '0';
    }
    (this.$refs.splitForm as any).validateField('amount');
  }
  private setMaxBalance(): void {
    const fee = this.currentNeuron.SNSNeuronOfSNSTokenInfo.fee as bigint;
    const max = new BigNumber(this.stakeNeuronOfTokenBalance)
      .minus(fee.toString(10))
      .div(10 ** this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals);
    if (new BigNumber(max).gt(0)) {
      this.stakeNeuronForm.amount = max.toString(10);
    } else {
      this.stakeNeuronForm.amount = '0';
    }
    (this.$refs.stakeNeuronForm as any).validateField('amount');
  }
  private delay(SNSIndex: number, index: number): void {
    (this.$refs.increaseDissolveDelay as any).init(
      this.SNSNeuronsList,
      SNSIndex,
      index
    );
  }
  private async stopDissolve(SNSIndex: number, index: number): Promise<void> {
    const snsGovernanceService = new SNSGovernanceService();
    const governanceId = this.SNSNeuronsList[SNSIndex].SNSNeuronOfGovernanceId;
    const neuronId = this.SNSNeuronsList[SNSIndex].SNSNeurons[index].id[0].id;
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const res = await snsGovernanceService.stopDissolve(
        governanceId,
        neuronId
      );
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          this.$message.error(err.error_message);
        } else {
          this.$message.success('Stop Dissolving Success');
          this.getNeuron(SNSIndex, index);
        }
      } else {
        this.$message.error('Stop Dissolving Error');
      }
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private dissolve(SNSIndex: number, index: number): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.$confirm({
      title: 'Confirm',
      content:
        'This will cause your neuron to lose its age bonus. Are you sure you wish to continue?',
      class: 'connect-plug warning-confirm',
      icon: 'connect-plug',
      centered: true,
      okText: 'Submit',
      cancelText: 'Cancel',
      onOk() {
        const snsGovernanceService = new SNSGovernanceService();
        const governanceId =
          that.SNSNeuronsList[SNSIndex].SNSNeuronOfGovernanceId;
        const neuronId =
          that.SNSNeuronsList[SNSIndex].SNSNeurons[index].id[0].id;
        const loading = that.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        snsGovernanceService
          .startDissolve(governanceId, neuronId)
          .then((res) => {
            loading.close();
            if (res && res.command) {
              const type = Object.keys(res.command[0])[0];
              if (type === 'Error') {
                const err = Object.values(res.command[0])[0] as GovernanceError;
                that.$message.error(err.error_message);
              } else {
                that.$message.success('Start Dissolving Success');
                that.getNeuron(SNSIndex, index);
              }
            } else {
              that.$message.error('Start Dissolving Error');
            }
          })
          .catch((err) => {
            loading.close();
            console.log(err);
            that.$message.error('Start Dissolving Error');
          });
      }
    });
  }
  private SetDissolveDelaySuccess(SNSIndex: number, index: number): void {
    this.getNeuron(SNSIndex, index);
  }
  private async followNeuronSuccess(
    SNSIndex: number,
    index: number
  ): Promise<void> {
    await this.getNeuron(SNSIndex, index);
    this.onFollowing(SNSIndex, index);
  }
  private async permissionsNeuronSuccess(
    SNSIndex: number,
    index: number
  ): Promise<void> {
    await this.getNeuron(SNSIndex, index);
    this.onPermissions(SNSIndex, index);
  }
  private setListNervousSystemFunctions(
    listNervousSystemFunctions: ListNervousSystemFunctionsResponse,
    SNSIndex: number
  ): void {
    this.$set(
      this.SNSNeuronsList[SNSIndex],
      'listNervousSystemFunctions',
      listNervousSystemFunctions
    );
  }
  private async getNeuron(SNSIndex: number, index: number): Promise<void> {
    const SNSNeuronInfo = this.SNSNeuronsList[SNSIndex];
    const snsGovernanceService = new SNSGovernanceService();
    const neuron = SNSNeuronInfo.SNSNeurons[index];
    const res = await snsGovernanceService.getNeuron(
      SNSNeuronInfo.SNSNeuronOfGovernanceId,
      neuron.id
    );
    console.log(SNSIndex, index);
    if (res.result) {
      const type = Object.keys(res.result[0])[0];
      if (type === 'Neuron') {
        const neuron = Object.values(res.result[0] as { Neuron: SNSNeuron })[0];
        this.$set(this.SNSNeuronsList[SNSIndex].SNSNeurons, index, neuron);
        console.log(neuron);
      }
    }
  }
  private filterNeuron(SNSNeurons: Array<SNSNeuron>): Array<SNSNeuron> {
    SNSNeurons = SNSNeurons.filter((SNSNeuron) => {
      const staked_maturity_e8s_equivalent =
        SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
      const balance = new BigNumber(
        SNSNeuron.cached_neuron_stake_e8s.toString(10)
      )
        .plus(SNSNeuron.maturity_e8s_equivalent.toString(10))
        .plus(staked_maturity_e8s_equivalent.toString(10));
      return !(
        balance.lte(0) &&
        new BigNumber(SNSNeuron.neuron_fees_e8s.toString(10)).lte(0) &&
        SNSNeuron.disburse_maturity_in_progress.length === 0
      );
    });
    return SNSNeurons;
  }
  private getNeuronStatus(SNSNeuron: SNSNeuron): keyof typeof SNSNeuronStatus {
    const dissolveState = SNSNeuron.dissolve_state;
    if (dissolveState[0]) {
      const type = Object.keys(dissolveState[0])[0];
      if (type === 'DissolveDelaySeconds') {
        const time = Object.values(dissolveState[0])[0];
        if (new BigNumber(time.toString(10)).gt(0)) {
          return SNSNeuronStatus.Locked;
        } else {
          return SNSNeuronStatus.Dissolved;
        }
      } else {
        const now = new Date().getTime();
        const time = Number(Object.values(dissolveState[0])[0]);
        if (new BigNumber(time.toString(10)).times(1000).gt(now)) {
          return SNSNeuronStatus.Dissolving;
        } else {
          return SNSNeuronStatus.Dissolved;
        }
      }
    } else {
      return SNSNeuronStatus.Unspecified;
    }
  }
  private finish(index: number): void {
    setTimeout(() => {
      this.getNeuron(this.currentNeuronInfoIndex, index);
    }, 1000);
  }
  private minStakeSplittable(SNSIndex: number): string {
    const currentNeuron = this.SNSNeuronsList[SNSIndex];
    const fee = currentNeuron.SNSNeuronOfSNSTokenInfo.fee as bigint;
    let currentNeuronMinimumStakeE8s = BigInt(0);
    if (
      currentNeuron.nervousSystemParameters &&
      currentNeuron.nervousSystemParameters.neuron_minimum_stake_e8s[0]
    ) {
      currentNeuronMinimumStakeE8s =
        currentNeuron.nervousSystemParameters.neuron_minimum_stake_e8s[0];
    }
    return new BigNumber(currentNeuronMinimumStakeE8s.toString(10))
      .times(2)
      .plus(fee.toString(10))
      .div(10 ** currentNeuron.SNSNeuronOfSNSTokenInfo.decimals)
      .toString(10);
  }
  private canSplit(SNSIndex: number, index: number): boolean {
    const minStakeSplittable = this.minStakeSplittable(SNSIndex);
    const balance = this.getNeuronBalance(
      this.SNSNeuronsList[SNSIndex].SNSNeurons[index],
      this.SNSNeuronsList[SNSIndex]
    );
    return new BigNumber(balance).gte(minStakeSplittable);
  }
  private getVesting(created: bigint, num: bigint): number {
    return new BigNumber(created.toString(10))
      .plus(num.toString(10))
      .times(1000)
      .toNumber();
  }
  private isVesting(created: bigint, num: bigint): boolean {
    const now = new Date().getTime();
    return new BigNumber(created.toString(10))
      .plus(num.toString(10))
      .times(1000)
      .gt(now);
  }
  private showOperation(
    SNSIndex: number,
    index: number,
    type: number
  ): boolean {
    let flag = false;
    for (
      let i = 0;
      i < this.SNSNeuronsList[SNSIndex].SNSNeurons[index].permissions.length;
      i++
    ) {
      const permissions =
        this.SNSNeuronsList[SNSIndex].SNSNeurons[index].permissions[i];
      if (
        permissions &&
        permissions.principal[0].toString() === this.getPrincipalId
      ) {
        flag = permissions.permission_type.some((permission_type) => {
          return Number(permission_type) === type;
        });
        break;
      }
    }
    return flag;
  }
  private getNeuronBalance(
    SNSNeuron: SNSNeuron,
    neurons: SNSNeuronsInfo
  ): string {
    // const staked_maturity_e8s_equivalent =
    //   SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    return (
      new BigNumber(SNSNeuron.cached_neuron_stake_e8s.toString(10))
        // .plus(staked_maturity_e8s_equivalent.toString(10))
        .minus(SNSNeuron.neuron_fees_e8s.toString(10))
        .div(10 ** neurons.SNSNeuronOfSNSTokenInfo.decimals)
        .toString(10)
    );
  }
  private getNeuronBalanceById(
    SNSNeuron: SNSNeuron,
    tokenInfo: TokenInfo
  ): string {
    // const staked_maturity_e8s_equivalent =
    //   SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    return (
      new BigNumber(SNSNeuron.cached_neuron_stake_e8s.toString(10))
        // .plus(staked_maturity_e8s_equivalent.toString(10))
        .minus(SNSNeuron.neuron_fees_e8s.toString(10))
        .div(10 ** tokenInfo.decimals)
        .toString(10)
    );
  }
  private getNeuronMaturityBalanceById(
    SNSNeuron: SNSNeuron,
    tokenInfo: TokenInfo
  ): string {
    try {
      const maturity_e8s_equivalent = SNSNeuron.maturity_e8s_equivalent;
      // const staked_maturity_e8s_equivalent =
      //   SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
      return (
        new BigNumber(maturity_e8s_equivalent.toString(10))
          // .minus(staked_maturity_e8s_equivalent.toString(10))
          .div(10 ** tokenInfo.decimals)
          .decimalPlaces(2, 1)
          .toString(10)
      );
    } catch (e) {
      return '';
    }
  }
  private getNeuronMaturityBalance(
    SNSNeuron: SNSNeuron,
    neurons: SNSNeuronsInfo
  ): string {
    try {
      console.log('getNeuronMaturityBalance');
      const maturity_e8s_equivalent = SNSNeuron.maturity_e8s_equivalent;
      // const staked_maturity_e8s_equivalent =
      //   SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
      return (
        new BigNumber(maturity_e8s_equivalent.toString(10))
          // .minus(staked_maturity_e8s_equivalent.toString(10))
          .div(10 ** neurons.SNSNeuronOfSNSTokenInfo.decimals)
          .decimalPlaces(2, 1)
          .toString(10)
      );
    } catch (e) {
      return '';
    }
  }
  private canDisburseMaturity(
    SNSNeuron: SNSNeuron,
    neurons: SNSNeuronsInfo
  ): boolean {
    const maturity_e8s_equivalent = SNSNeuron.maturity_e8s_equivalent;
    // const staked_maturity_e8s_equivalent =
    //   SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    return (
      new BigNumber(maturity_e8s_equivalent.toString(10))
        // .minus(staked_maturity_e8s_equivalent.toString(10))
        .lt(neurons.SNSNeuronOfSNSTokenInfo.fee.toString(10))
    );
  }
  private getVotingPower(
    SNSNeuron: SNSNeuron,
    SNSNeuronsInfo?: SNSNeuronsInfo,
    nervousSystemParameters?: NervousSystemParameters
  ): string {
    let currentNervousSystemParameters;
    if (nervousSystemParameters) {
      currentNervousSystemParameters = nervousSystemParameters;
    } else {
      currentNervousSystemParameters = SNSNeuronsInfo.nervousSystemParameters;
    }
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
        currentNervousSystemParameters.neuron_minimum_dissolve_delay_to_vote_seconds[0].toString(
          10
        )
      )
    ) {
      return '0';
    }
    const dissolveDelayBonus = new BigNumber(dissolveDelay)
      .div(
        currentNervousSystemParameters.max_dissolve_delay_seconds[0].toString(
          10
        )
      )
      .times(
        currentNervousSystemParameters.max_dissolve_delay_bonus_percentage[0].toString(
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
        currentNervousSystemParameters.max_neuron_age_for_age_bonus[0].toString(
          10
        )
      )
      .times(
        currentNervousSystemParameters.max_age_bonus_percentage[0].toString(10)
      )
      .div(100)
      .plus(1);
    let balance;
    if (SNSNeuronsInfo) {
      balance = this.getVoteBalance(SNSNeuron, SNSNeuronsInfo);
    } else {
      balance = this.getVoteBalanceById(SNSNeuron);
    }
    return new BigNumber(balance)
      .times(dissolveDelayBonus)
      .times(ageBonus)
      .times(SNSNeuron.voting_power_percentage_multiplier.toString(10))
      .div(100)
      .decimalPlaces(2, 0)
      .toString(10);
  }
  private getVoteBalance(
    SNSNeuron: SNSNeuron,
    neurons: SNSNeuronsInfo
  ): string {
    const staked_maturity_e8s_equivalent =
      SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    return new BigNumber(SNSNeuron.cached_neuron_stake_e8s.toString(10))
      .plus(staked_maturity_e8s_equivalent.toString(10))
      .div(10 ** neurons.SNSNeuronOfSNSTokenInfo.decimals)
      .toString(10);
  }
  private getVoteBalanceById(SNSNeuron: SNSNeuron): string {
    const staked_maturity_e8s_equivalent =
      SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    return new BigNumber(SNSNeuron.cached_neuron_stake_e8s.toString(10))
      .plus(staked_maturity_e8s_equivalent.toString(10))
      .div(10 ** this.tokenInfo.decimals)
      .toString(10);
  }
  private async putQuests(
    event: string,
    description: Array<string> = []
  ): Promise<void> {
    try {
      await this.questsService.putEvent(
        event,
        Principal.fromText(this.getPrincipalId),
        description
      );
    } catch (e) {
      console.log(e);
    }
  }
  private onSubmitStakeNeuron(): void {
    (this.$refs.stakeNeuronForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          await checkAuth();
          try {
            const amount = BigInt(
              new BigNumber(this.stakeNeuronForm.amount)
                .times(
                  10 ** this.currentNeuron.SNSNeuronOfSNSTokenInfo.decimals
                )
                .toString(10)
            );
            const currentDrc20Token = new DRC20TokenService();
            console.log(this.stakeNeuronTitle.startsWith('Stake'));
            if (this.stakeNeuronTitle.startsWith('Stake')) {
              const principal = localStorage.getItem('principal');
              const response = createSNSSubAccount(
                Principal.fromText(principal),
                this.currentNeuron.SNSNeuronOfGovernanceId
              );
              console.log(response);
              const res = await currentDrc20Token.icrc1Transfer(
                this.currentNeuron.SNSNeuronOfId,
                amount,
                response.account,
                [Array.from(response.memo)]
              );
              if (res) {
                if (Object.keys(res)[0] === 'Err') {
                  this.$message.error('Create Neuron Error');
                  loading.close();
                } else {
                  this.putQuests('ICSNS');
                  const snsGovernanceService = new SNSGovernanceService();
                  snsGovernanceService
                    .refreshNeuronByAccount(
                      this.currentNeuron.SNSNeuronOfGovernanceId,
                      [Principal.fromText(principal)],
                      uint8ArrayToBigInt(response.memo)
                    )
                    .then(async (res) => {
                      let id = '';
                      if (res && res[0] && res[0].id) {
                        id = this.arrayToString(res[0].id);
                      }
                      this.putQuests('ICSNS', [id]);
                      await this.createNeuronSuccess(res);
                      loading.close();
                      this.$message.success('Create Neuron Success');
                      this.stakeNeuronVisible = false;
                      this.delay(this.currentNeuronInfoIndex, 0);
                      // this.refreshNeurons(
                      //   this.currentNeuron.SNSNeuronOfGovernanceId,
                      //   this.SNSNeuronsList[this.currentNeuronInfoIndex]
                      //     .SNSNeuronPageSize,
                      //   [],
                      //   this.currentNeuronInfoIndex
                      // );
                    })
                    .catch((err) => {
                      this.$message.error(err.error_message);
                      loading.close();
                      console.log(err);
                    });
                }
              }
            } else {
              // Increase Stake Neuron
              const account: Icrc1Account = {
                owner: Principal.fromText(
                  this.currentNeuron.SNSNeuronOfGovernanceId
                ),
                subaccount: [
                  this.currentNeuron.SNSNeurons[this.currentNeuronIndex].id[0]
                    .id
                ]
              };
              const res = await currentDrc20Token.icrc1Transfer(
                this.currentNeuron.SNSNeuronOfId,
                amount,
                account
              );
              if (res) {
                if (Object.keys(res)[0] === 'Err') {
                  this.$message.error('Increase Stake Error');
                  loading.close();
                } else {
                  const snsGovernanceService = new SNSGovernanceService();
                  snsGovernanceService
                    .refreshNeuronById(
                      this.currentNeuron.SNSNeuronOfGovernanceId,
                      this.currentNeuron.SNSNeurons[this.currentNeuronIndex]
                        .id[0].id
                    )
                    .then((res) => {
                      console.log(res);
                      loading.close();
                      this.$message.success('Increase Stake Success');
                      this.stakeNeuronVisible = false;
                      this.getNeuron(
                        this.currentNeuronInfoIndex,
                        this.currentNeuronIndex
                      );
                    })
                    .catch((err) => {
                      this.$message.error(err.error_message);
                      loading.close();
                      console.log(err);
                    });
                }
              }
            }
          } catch (e) {
            loading.close();
            console.log(e);
          }
        } else {
          return false;
        }
      }
    );
  }
  private async getNervousSystemParameters(
    governanceId: string,
    ledger: string,
    index: number
  ): Promise<void> {
    const info = JSON.parse(localStorage.getItem(`${ledger}-SNS`)) || {};
    if (info && info.nervousSystemParameters) {
      this.$set(
        this.SNSNeuronsList[index],
        'nervousSystemParameters',
        info.nervousSystemParameters
      );
    } else {
      const snsGovernanceService = new SNSGovernanceService();
      try {
        const res = await snsGovernanceService.getNervousSystemParameters(
          governanceId
        );
        console.log(governanceId);
        console.log(res);
        this.$set(this.SNSNeuronsList[index], 'nervousSystemParameters', res);
        console.log(this.SNSNeuronsList);
      } catch (e) {
        return null;
      }
    }
  }
  private initStakeNeuron(neuron: SNSNeuronsInfo): void {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      const tokensBalance = currentInfo.tokensBalance || {};
      this.stakeNeuronOfTokenBalance = tokensBalance[neuron.SNSNeuronOfId];
    }
    getTokenBalance({ icrc1: null }, neuron.SNSNeuronOfId).then((balance) => {
      this.stakeNeuronOfTokenBalance = balance;
    });
    window.clearInterval(this.timer);
    this.timer = null;
    this.timer = window.setInterval(() => {
      if (!this.getCheckAuth) {
        getTokenBalance({ icrc1: null }, neuron.SNSNeuronOfId).then(
          (balance) => {
            console.log(balance);
            this.stakeNeuronOfTokenBalance = balance;
          }
        );
      }
    }, 3000);
    this.stakeNeuronVisible = true;
  }
  private onSplitNeuron(SNSIndex: number, index: number): void {
    const neuronInfo = this.SNSNeuronsList[SNSIndex];
    this.currentNeuronIndex = index;
    this.currentNeuronInfoIndex = SNSIndex;
    this.currentNeuron = neuronInfo;
    this.splitVisible = true;
  }
  private async stakeMaturity(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const neuronInfo = this.SNSNeuronsList[this.currentNeuronInfoIndex];
      const snsGovernanceService = new SNSGovernanceService();
      snsGovernanceService
        .stakeMaturity(
          neuronInfo.SNSNeuronOfGovernanceId,
          neuronInfo.SNSNeurons[this.currentNeuronIndex].id[0].id,
          BigInt(this.stakeMaturityValue)
        )
        .then((res) => {
          console.log(res);
          if (res && res.command) {
            const type = Object.keys(res.command[0])[0];
            if (type === 'Error') {
              const err = Object.values(res.command[0])[0] as GovernanceError;
              console.log(err);
              this.$message.error(err.error_message);
            } else {
              this.$message.success('Stake Maturity Success');
              this.getNeuron(
                this.currentNeuronInfoIndex,
                this.currentNeuronIndex
              );
              this.stakeMaturityVisible = false;
            }
          }
        })
        .catch(() => {
          this.$message.success('Stake Maturity Error');
        })
        .finally(() => {
          loading.close();
        });
    } catch (e) {
      console.log(e);
      loading.close();
      this.$message.success('Stake Maturity Error');
    }
  }
  private async onChangeAutoStakeMaturity(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const neuronInfo = this.SNSNeuronsList[this.currentNeuronInfoIndex];
      const snsGovernanceService = new SNSGovernanceService();
      snsGovernanceService
        .changeAutoStakeMaturity(
          neuronInfo.SNSNeuronOfGovernanceId,
          !neuronInfo.SNSNeurons[this.currentNeuronIndex]
            .auto_stake_maturity[0],
          neuronInfo.SNSNeurons[this.currentNeuronIndex].id[0].id
        )
        .then((res) => {
          console.log(res);
          if (res && res.command) {
            const type = Object.keys(res.command[0])[0];
            if (type === 'Error') {
              const err = Object.values(res.command[0])[0] as GovernanceError;
              console.log(err);
              this.$message.error(err.error_message);
            } else {
              this.$message.success('change Auto Stake Maturity Success');
              this.getNeuron(
                this.currentNeuronInfoIndex,
                this.currentNeuronIndex
              );
              this.changeAutoStakeMaturityVisible = false;
            }
          }
        })
        .finally(() => {
          loading.close();
        });
    } catch (e) {
      console.log(e);
      loading.close();
    }
  }
  private async onAutoStakeMaturity(
    SNSIndex: number,
    index: number
  ): Promise<void> {
    if (
      this.SNSNeuronsList[SNSIndex].SNSNeurons[index].auto_stake_maturity[0]
    ) {
      this.changeAutoStakeMaturityMessage =
        'Are you sure that you would like to stop automatically staking new maturity of this neuron?';
    } else {
      this.changeAutoStakeMaturityMessage =
        'Are you sure that you would like to automatically stake new maturity of this neuron?';
    }
    const neuronInfo = this.SNSNeuronsList[SNSIndex];
    this.currentNeuronIndex = index;
    this.currentNeuronInfoIndex = SNSIndex;
    this.currentNeuron = neuronInfo;
    this.changeAutoStakeMaturityVisible = true;
  }
  private async onStakeMaturity(
    SNSIndex: number,
    index: number
  ): Promise<void> {
    const neuronInfo = this.SNSNeuronsList[SNSIndex];
    this.currentNeuronIndex = index;
    this.currentNeuronInfoIndex = SNSIndex;
    this.currentNeuron = neuronInfo;
    this.stakeMaturityVisible = true;
    this.stakeMaturityValue = 0;
  }
  private async onDisburseMaturity(
    SNSIndex: number,
    index: number
  ): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const res = await snsGovernanceService.disburseMaturity(
        this.SNSNeuronsList[SNSIndex].SNSNeuronOfGovernanceId,
        this.SNSNeuronsList[SNSIndex].SNSNeurons[index].id[0].id
      );
      console.log(res);
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          this.$message.error(err.error_message);
        } else {
          this.$message.success('Disburse Maturity Success');
          this.getNeuron(SNSIndex, index);
        }
      } else {
        this.$message.error('Disburse Maturity Error');
      }
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private async onIncreaseStakeNeuron(
    SNSIndex: number,
    index: number
  ): Promise<void> {
    const neuronInfo = this.SNSNeuronsList[SNSIndex];
    this.currentNeuron = neuronInfo;
    this.stakeNeuronTitle = `Increase Stake ${neuronInfo.SNSNeuronOfSNSTokenInfo.symbol}`;
    this.currentNeuronIndex = index;
    this.currentNeuronInfoIndex = SNSIndex;
    this.initStakeNeuron(neuronInfo);
  }
  private onFollowing(SNSIndex: number, index: number): void {
    this.currentNeuron = this.SNSNeuronsList[SNSIndex];
    this.currentNeuronIndex = index;
    this.currentNeuronInfoIndex = SNSIndex;
    (this.$refs.following as any).init(this.SNSNeuronsList, SNSIndex, index);
  }
  private onPermissions(SNSIndex: number, index: number): void {
    this.currentNeuron = this.SNSNeuronsList[SNSIndex];
    this.currentNeuronIndex = index;
    this.currentNeuronInfoIndex = SNSIndex;
    (this.$refs.permissions as any).init(this.SNSNeuronsList, SNSIndex, index);
  }
  private async onStakeNeuron(
    neuron: SNSNeuronsInfo,
    SNSIndex: number,
    index: number
  ): Promise<void> {
    console.log(SNSIndex);
    this.currentNeuron = neuron;
    this.currentNeuronInfoIndex = SNSIndex;
    this.currentNeuronIndex = index;
    this.stakeNeuronTitle = `Stake ${neuron.SNSNeuronOfSNSTokenInfo.symbol} to create a neuron`;
    this.initStakeNeuron(neuron);
  }
  private async onDisburse(SNSIndex: number, index: number): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const res = await snsGovernanceService.Disburse(
        this.SNSNeuronsList[SNSIndex].SNSNeuronOfGovernanceId,
        this.SNSNeuronsList[SNSIndex].SNSNeurons[index].id[0].id
      );
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          this.$message.error(err.error_message);
        } else {
          this.$message.success('Disburse Neuron Success');
          // this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeurons.splice(
          //   index,
          //   1
          // );
          this.getNeuron(SNSIndex, index);
        }
      } else {
        this.$message.error('Disburse Neuron Error');
      }
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private async listDeployedSnses(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      this.deployedSnses = await this.SNSWasmService.listDeployedSnses();
      loading.close();
      console.log(this.deployedSnses);
      let canisterIds: Array<string> = [];
      // this.currentNeuronInfoIndex = 0;
      let ICLIndex = null;
      const ICLToken = 'hhaaz-2aaaa-aaaaq-aacla-cai';
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
      const flag = needConnectPlug(canisterIds);
      const principal = localStorage.getItem('principal');
      const priList = JSON.parse(localStorage.getItem('priList')) || {};
      const needConnectInfinity1 = await needConnectInfinity(canisterIds);
      if (
        priList[principal] === 'Plug' &&
        flag &&
        this.$route.name === 'ICSNS-Neurons'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        this.$info({
          content: 'ICSNS neurons need to be connected to the plug.',
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
        this.$route.name === 'ICSNS-Neurons'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        this.$info({
          content: 'ICSNS neurons need to be connected to the plug.',
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
      console.log(e);
      loading.close();
    }
  }
  private async changeSNSNeurons(index: number): Promise<void> {
    try {
      this.currentNeuronInfoIndex = index;
      this.$router
        .replace(
          `/icsns/neurons?id=${
            this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeuronOfId
          }`
        )
        .then();
      localStorage.setItem(
        'ICSNSToken',
        this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeuronOfId
      );
      await this.getAllNeurons(
        this.SNSNeuronsList[this.currentNeuronInfoIndex]
          .SNSNeuronOfGovernanceId,
        this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeuronPageSize,
        [],
        this.currentNeuronInfoIndex
      );
      console.log(this.SNSNeuronsList);
    } catch (e) {
      console.log(e);
    }
  }
  private async initConnected(
    listDeployedSnses: Array<DeployedSns>
  ): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const MAX_COCURRENCY = 40;
    let snsTokensAll = [];
    let snsTokens = [];
    const localReject: Array<string> =
      JSON.parse(localStorage.getItem('rejectSNSTokens')) || [];
    listDeployedSnses = listDeployedSnses.filter((item) => {
      return !localReject.includes(item.ledger_canister_id[0].toString());
    });
    listDeployedSnses.forEach((item, index) => {
      const SNSNeuronOfId = item.ledger_canister_id[0].toString();
      const SNSNeuronOfGovernanceId = item.governance_canister_id[0].toString();
      this.SNSNeuronsList.push({
        SNSNeuronOfSNSTokenInfo: null,
        nervousSystemParameters: null,
        SNSNeuronOfId: SNSNeuronOfId,
        SNSNeuronOfGovernanceId: SNSNeuronOfGovernanceId,
        SNSNeuronPageSize: 100,
        loading: true,
        SNSNeurons: [],
        listNervousSystemFunctions: null
      });
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
    let index = 0;
    for (let i = 0; i < snsTokensAll.length; i++) {
      const promiseAll = [];
      for (let j = 0; j < snsTokensAll[i].length; j++) {
        promiseAll.push(
          this.getCurrentTokenInfo(listDeployedSnses[index], index),
          this.getNervousSystemParameters(
            listDeployedSnses[index].governance_canister_id[0].toString(),
            listDeployedSnses[index].ledger_canister_id[0].toString(),
            index
          ),
          this.getLifecycle(listDeployedSnses[index], index)
        );
        index++;
      }
      await Promise.all(promiseAll);
    }
    loading.close();
    this.SNSNeuronsList = this.SNSNeuronsList.filter(
      (SNSToken: SNSNeuronsInfo) => {
        if (
          (SNSToken.lifecycle &&
            SNSToken.lifecycle.length &&
            Number(SNSToken.lifecycle[0]) == 4) ||
          (SNSToken.lifecycle && SNSToken.lifecycle.length === 0)
        ) {
          if (!localReject.includes(SNSToken.SNSNeuronOfId)) {
            localReject.push(SNSToken.SNSNeuronOfId);
          }
        }
        if (
          SNSToken.lifecycle &&
          SNSToken.lifecycle.length &&
          Number(SNSToken.lifecycle[0]) !== 4
        ) {
          const sns =
            JSON.parse(localStorage.getItem(`${SNSToken.SNSNeuronOfId}-SNS`)) ||
            {};
          localStorage.setItem(
            `${SNSToken.SNSNeuronOfId}-SNS`,
            JSON.stringify(
              Object.assign({}, sns, {
                lifecycle: SNSToken.lifecycle,
                nervousSystemParameters: SNSToken.nervousSystemParameters
              }),
              (key, value) =>
                typeof value === 'bigint' ? value.toString(10) : value
            )
          );
          return true;
        }
      }
    );
    console.log(this.SNSNeuronsList);
    localStorage.setItem('rejectSNSTokens', JSON.stringify(localReject));
    let tokenId = this.$route.query.id as string;
    if (tokenId) {
      localStorage.setItem('ICSNSToken', tokenId);
    } else {
      const localToken = localStorage.getItem('ICSNSToken');
      if (localToken) {
        tokenId = localToken;
      }
    }
    for (let i = 0; i < this.SNSNeuronsList.length; i++) {
      const currentTokenId = this.SNSNeuronsList[i].SNSNeuronOfId;
      if (tokenId && tokenId.trim() === currentTokenId) {
        this.currentNeuronInfoIndex = i;
        break;
      }
    }
    console.log(this.currentNeuronInfoIndex);
    if (!this.currentNeuronInfoIndex) {
      this.currentNeuronInfoIndex = 0;
    }
    await this.getAllNeurons(
      this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeuronOfGovernanceId,
      this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeuronPageSize,
      [],
      this.currentNeuronInfoIndex
    );
    console.log(this.SNSNeuronsList);
  }
  private async loadMore(): Promise<void> {
    console.log('loadMore');
    const lastId =
      this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeurons[
        this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeurons.length - 1
      ].id;
    console.log(lastId);
    const res = await this.getNeurons(
      this.deployedSnses[
        this.currentNeuronInfoIndex
      ].governance_canister_id[0].toString(),
      4,
      lastId
    );
    console.log(res);
    if (
      res.length <
      this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeuronPageSize
    ) {
      this.busy = true;
    }
    const SNSNeurons =
      this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeurons.concat(res);
    this.$set(
      this.SNSNeuronsList[this.currentNeuronInfoIndex],
      'SNSNeurons',
      SNSNeurons
    );
  }
  private async getAllNeurons(
    governanceId: string,
    limit: number,
    startPageAt: Array<SNSNeuronId>,
    index: number
  ): Promise<void> {
    const res = await this.getNeurons(governanceId, limit, startPageAt);
    console.log(res);
    const snsNeuron: SNSNeuronsInfo = {
      SNSNeuronOfSNSTokenInfo:
        this.SNSNeuronsList[index].SNSNeuronOfSNSTokenInfo,
      nervousSystemParameters:
        this.SNSNeuronsList[index].nervousSystemParameters,
      SNSNeuronOfId: this.SNSNeuronsList[index].SNSNeuronOfId,
      SNSNeuronOfGovernanceId:
        this.SNSNeuronsList[index].SNSNeuronOfGovernanceId,
      SNSNeuronPageSize: this.SNSNeuronsList[index].SNSNeuronPageSize,
      SNSNeurons: res,
      listNervousSystemFunctions:
        this.SNSNeuronsList[index].listNervousSystemFunctions,
      loading: false
    };
    this.$set(this.SNSNeuronsList, index, snsNeuron);
  }
  private async getLifecycle(
    deployedSns: DeployedSns,
    index: number
  ): Promise<void> {
    const swapId = deployedSns.swap_canister_id[0].toString();
    const tokenId = deployedSns.ledger_canister_id[0].toString();
    const info = JSON.parse(localStorage.getItem(`${tokenId}-SNS`)) || {};
    const completed = [3, 4];
    if (info && info.lifecycle && completed.includes(Number(info.lifecycle))) {
      this.$set(this.SNSNeuronsList[index], 'lifecycle', info.lifecycle);
    } else {
      const snsSwapService = new SNSSwapService();
      const res = await snsSwapService.getLifecycle(swapId);
      this.$set(this.SNSNeuronsList[index], 'lifecycle', res.lifecycle);
    }
  }
  private async getCurrentTokenInfo(
    deployedSns: DeployedSns,
    index: number
  ): Promise<void> {
    const tokenId = deployedSns.ledger_canister_id[0];
    if (!this.tokens[tokenId.toString()]) {
      const res = await getTokenInfo(tokenId, { icrc1: null });
      this.$set(this.SNSNeuronsList[index], 'SNSNeuronOfSNSTokenInfo', res);
    } else {
      this.$set(
        this.SNSNeuronsList[index],
        'SNSNeuronOfSNSTokenInfo',
        this.tokens[tokenId.toString()]
      );
    }
  }
  private async createNeuronSuccess(
    neuronId: Array<SNSNeuronId>
  ): Promise<void> {
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const res = await snsGovernanceService.getNeuron(
        this.SNSNeuronsList[this.currentNeuronInfoIndex]
          .SNSNeuronOfGovernanceId,
        neuronId
      );
      console.log(res, neuronId, this.currentNeuronInfoIndex);
      if (res.result) {
        const type = Object.keys(res.result[0])[0];
        if (type === 'Neuron') {
          const neuron = Object.values(
            res.result[0] as { Neuron: SNSNeuron }
          )[0];
          this.SNSNeuronsList[this.currentNeuronInfoIndex].SNSNeurons.unshift(
            neuron
          );
          console.log(neuron);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async refreshNeurons(
    governanceCanisterId: string,
    limit: number,
    startPageAt: Array<SNSNeuronId>,
    index: number
  ): Promise<void> {
    this.SNSNeuronsList[index].SNSNeurons = await this.getNeurons(
      governanceCanisterId,
      limit,
      startPageAt
    );
    this.$set(this.SNSNeuronsList, index, this.SNSNeuronsList[index]);
  }
  private async getNeurons(
    governanceCanisterId: string,
    limit: number,
    startPageAt: Array<SNSNeuronId>
  ): Promise<Array<SNSNeuron>> {
    const snsGovernanceService = new SNSGovernanceService();
    const request: ListNeurons = {
      of_principal: [Principal.from(this.getPrincipalId)],
      limit: BigInt(limit),
      start_page_at: startPageAt
    };
    const res = await snsGovernanceService.listSNSNeurons(
      governanceCanisterId,
      request
    );
    console.log(res);
    if (res) {
      // return res.neurons;
      return this.filterNeuron(res.neurons);
    } else {
      return [];
    }
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private formatter(value): string {
    return `${value}%`;
  }
  private back(): void {
    this.$router.replace(`/icsns/neurons?id=${this.tokenId}`);
    this.tokenId = '';
    this.neuronId = '';
    this.currentNeuronForNeuronId = null;
    const principal = localStorage.getItem('principal');
    if (principal) {
      this.init();
    }
  }
  private async connectWallet(): Promise<void> {
    if ((window as any).icx) {
      const icxCanisterIds: Array<string> =
        JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
      const isConnect = await connectIcx(icxCanisterIds);
      if (isConnect) {
        this.init();
      }
    } else {
      await this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.voting-power-title-main {
  margin-right: 5px;
}
.staked-maturity-equivalent {
  display: flex;
  margin-top: 5px;
}
.change-auto-stake-maturity-button {
  display: flex;
  margin-top: 30px;
  justify-content: flex-end;
  button {
    margin-left: 10px;
  }
}
.neurons-list-main {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
  &.neurons-list-main-id {
    margin-top: 50px;
  }
  .neurons-status-info {
    display: flex;
    align-items: center;
  }
  .base-font-title {
    font-size: 16px;
  }
}
.neurons-list-header {
  display: flex;
  align-items: center;
  span {
    font-size: 20px;
    color: #fff;
  }
  .neurons-list-header-option {
    width: 200px;
    span {
      font-size: 14px;
    }
    ::v-deep .ant-select-selection__rendered {
      line-height: 36px;
    }
  }
}
.neurons-list-balance-dissolve-time {
  margin-left: 5px;
}
.no-neuron {
  height: 200px;
  line-height: 20px;
  color: #adb3c4;
  text-align: center;
}
.transfer-balance {
  margin-top: 20px;
}
.transfer-submit {
  margin: 20px 0;
}
.transfer-balance-right {
  color: #1996c4;
}
.auto-stake--maturity-checkbox {
  margin-top: 10px;
  ::v-deep .ant-checkbox-wrapper {
    color: #8c98a5;
  }
}
.neurons-list-item {
  width: 490px;
  min-height: 200px;
  padding: 16px;
  margin-bottom: 15px;
  background: #131920;
  color: #8c98a5;
  border: 1px solid #212b35;
  border-radius: 10px;
}
.neurons-list-item-skeleton {
  height: 180px;
}
.neurons-list-balance-border {
  margin-top: 20px;
  border-top: 1px solid #212b35;
}
.disburse-maturity-in-progress-tooltip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  word-break: break-word;
}
.disburse-maturity-in-progress-clock {
  line-height: 30px;
}
.neurons-list-balance {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  padding-top: 20px;
  .neuron-balance {
    font-size: 28px;
    color: #fff;
    padding-right: 5px;
  }
  .neuron-symbol {
    color: #adb8c4;
  }
  .operation {
    margin-top: 0;
  }
  .base-font-title {
    margin-right: 10px;
  }
}
.neurons-list-balance-voting {
  padding-top: 10px;
  .operation {
    margin-top: 10px;
  }
}
.operation {
  display: flex;
  margin-top: 20px;
  button {
    width: 85px;
    margin-right: 10px;
    &:disabled {
      opacity: 0.4;
    }
  }
}
.text-center {
  text-align: center;
}
.maturity-available {
  display: flex;
}
.h5-show {
  display: none !important;
}
.pc-show {
  display: flex !important;
}
i.pc-show {
  display: inline-block !important;
}
.neurons-status-info-id {
  margin-top: 10px;
}
.neurons-list-main-back {
  display: flex;
  align-items: center;
  margin-top: 40px;
  font-size: 16px;
  .back-icon {
    font-size: 20px;
  }
}
.adopted-countdown {
  line-height: 1;
  ::v-deep .ant-statistic-content {
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
}
@media screen and (max-width: 1000px) {
  .neurons-main {
    width: 100%;
    padding: 0 10px;
  }
}
@media screen and (max-width: 768px) {
  .h5-show {
    display: flex !important;
  }
  .pc-show {
    display: none !important;
  }
  i.pc-show {
    display: none !important;
  }
  .neurons-list-balance-voting {
    flex-direction: column;
  }
  .voting-power-title-main {
    margin-left: 0;
    margin-top: 15px;
  }
  .auto-stake--maturity-checkbox {
    ::v-deep .ant-checkbox-wrapper {
      font-size: 12px;
    }
  }
  .neurons-list-header {
    flex-wrap: wrap;
    padding: 0 10px;
    button {
      width: 200px;
    }
  }
  .neurons-list-main {
    padding: 0 10px;
    .neurons-list-item {
      width: 100%;
    }
    .neurons-list-header {
      flex-direction: row;
      align-items: center;
      padding: 0;
      margin-bottom: 5px;
    }
    .operation {
      button {
        width: auto;
      }
    }
    .neurons-status-info {
      flex-direction: column;
      align-items: flex-start;
      > div {
        margin-left: 0;
        margin-top: 5px;
      }
    }
  }
}
@media screen and (max-width: 460px) {
  .neurons-list-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 10px;
    .neurons-list-header-option {
      width: 100%;
    }
    button {
      width: 100%;
      margin: 10px 0 0 0;
    }
  }
}
</style>
