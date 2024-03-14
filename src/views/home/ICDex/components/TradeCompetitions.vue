<template>
  <div>
    <div
      v-if="currentPair && currentPair[1]"
      class="trade-competitions-main"
      :class="{ 'has-register-competition': registerCompetition }"
    >
      <div class="trade-competitions-main-header">
        <a-icon class="back-arrow" type="arrow-left" @click="back" />
        <span
          v-if="
            tokens &&
            tokens[currentPair[1][0].token0[0].toString()] &&
            tokens[currentPair[1][0].token1[0].toString()]
          "
          class="trade-competitions-main-name"
          >{{ tokens[currentPair[1][0].token0[0].toString()].symbol }}/{{
            tokens[currentPair[1][0].token1[0].toString()].symbol
          }}
          {{ menu }}</span
        >
      </div>
      <div
        v-show="menu === tradeCompetitionsEnum.Info"
        class="trade-competitions-info"
      >
        <div class="trade-competitions-info-container">
          <div class="trade-competitions-info-item-title base-color-w">
            Pair Info
          </div>
          <div class="trade-competitions-info-metadata-item">
            <span>Pair Name: </span>
            <span v-if="dexInfo">{{ dexInfo.name }}</span>
          </div>
          <div class="trade-competitions-info-metadata-item">
            <span>Canister Id: </span>
            <span v-if="dexInfo">
              <a
                :href="'https://ic.house/swap/' + currentPair[0].toString()"
                rel="nofollow noreferrer noopener"
                target="_blank"
              >
                {{ currentPair[0].toString() }}
              </a>
            </span>
          </div>
          <div class="trade-competitions-info-metadata-item">
            <span>Fee: </span>
            <span class="trade-competitions-info-metadata-item-fee">
              <span>Maker 0%,</span>
              <span>Taker&nbsp;{{ currentPair | filterBuyFee }}.</span>
            </span>
          </div>
          <div class="trade-competitions-info-metadata-item">
            <span>Unit Size: </span>
            <span v-if="dexInfo">
              {{
                dexInfo.setting.UNIT_SIZE
                  | filterUnitSize(
                    tokens[currentPair[1][0].token0[0].toString()].decimals
                  )
              }}
              {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
            </span>
          </div>
          <div class="trade-competitions-info-metadata-item">
            <span>Controllers: </span>
            <span
              v-if="
                dexInfo && dexInfo.controllers && dexInfo.controllers.length
              "
            >
              <div v-for="(item, index) in dexInfo.controllers" :key="index">
                {{ item }}
              </div>
            </span>
          </div>
          <div class="trade-competitions-info-metadata-item">
            <span>ICTC Admins: </span>
            <span v-if="dexInfo && dexInfo.admins && dexInfo.admins.length">
              <div v-for="(item, index) in dexInfo.admins" :key="index">
                {{ item.toString() }}
              </div>
            </span>
            <span v-else>-</span>
          </div>
          <div
            v-if="dexInfo && dexInfo.IDOConfig && dexInfo.IDOConfig[0]"
            class="trade-competitions-info-metadata-item"
          >
            <span>IDO: </span>
            <span>
              Funder: {{ dexInfo.IDOConfig[0] }}; Time
              {{
                dexInfo.IDOConfig[1].IDOOpeningTime
                  | formatDateFromNanosecondUTC
              }}~{{
                dexInfo.IDOConfig[1].IDOClosingTime
                  | formatDateFromNanosecondUTC
              }}
            </span>
          </div>
          <div
            v-if="dexInfo && dexInfo.auctionMode"
            class="trade-competitions-info-metadata-item"
          >
            <span>AuctionMode: </span>
            <span>
              {{ dexInfo.auctionMode[0] ? 'Enabled' : 'Disabled' }}; Funder
              {{ arrayToString(dexInfo.auctionMode[1]) }}
            </span>
          </div>
          <div class="trade-competitions-info-metadata-item">
            <span>Module Hash: </span>
            <span v-if="dexInfo && dexInfo.moduleHash">
              {{ dexInfo.moduleHash }}
            </span>
          </div>
          <div class="trade-competitions-info-metadata-item">
            <span>Version: </span>
            <span v-if="dexInfo">{{ dexInfo.version }}</span>
          </div>
          <div class="trade-competitions-info-metadata-item">
            <span>Status: </span>
            <span v-if="dexInfo">{{ dexInfo.paused | filterPaused }}</span>
          </div>
        </div>
        <div class="trade-competitions-info-container">
          <div class="trade-competitions-info-item-title base-color-w">
            Tokens Info
          </div>
          <div class="token-info-main">
            <div class="trade-competitions-info-main">
              <div class="trade-competitions-info-item">
                <span style="color: #dfe5ec">Token0</span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Token Name:</span>
                <span
                  v-if="
                    tokens && tokens[currentPair[1][0].token0[0].toString()]
                  "
                >
                  <span
                    v-if="
                      tokens[
                        currentPair[1][0].token0[0].toString()
                      ].name.toLocaleLowerCase() === 'icp'
                    "
                    >ICP</span
                  >
                  <span v-else>
                    {{
                      tokens[currentPair[1][0].token0[0].toString()].name
                        | ellipsisAccount(15)
                    }}
                  </span>
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Canister Id:</span>
                <span>
                  <a
                    v-show="
                      currentPair[1][0].token0[0].toString() !==
                      'ryjl3-tyaaa-aaaaa-aaaba-cai'
                    "
                    :href="
                      'https://ic.house/token/' +
                      currentPair[1][0].token0[0].toString()
                    "
                    rel="nofollow noreferrer noopener"
                    target="_blank"
                  >
                    {{ currentPair[1][0].token0[0].toString() }}
                  </a>
                  <span
                    v-show="
                      currentPair[1][0].token0[0].toString() ===
                      'ryjl3-tyaaa-aaaaa-aaaba-cai'
                    "
                    >{{ currentPair[1][0].token0[0].toString() }}
                  </span>
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Symbol:</span>
                <span
                  v-if="
                    tokens && tokens[currentPair[1][0].token0[0].toString()]
                  "
                >
                  {{ tokens[currentPair[1][0].token0[0].toString()].symbol }}
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Decimals:</span>
                <span
                  v-if="
                    tokens && tokens[currentPair[1][0].token0[0].toString()]
                  "
                >
                  {{ tokens[currentPair[1][0].token0[0].toString()].decimals }}
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Standard:</span>
                <span>{{ currentPair[1][0].token0[2] | filterStd }}</span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Total Supply:</span>
                <span v-if="totalSupply">
                  {{
                    totalSupply
                      | bigintToFloat(
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                      | formatNum
                  }}
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Max Supply:</span>
                <span v-if="maxSupply && Number(maxSupply)">
                  {{
                    maxSupply
                      | bigintToFloat(
                        tokens[currentPair[1][0].token0[0].toString()].decimals,
                        tokens[currentPair[1][0].token0[0].toString()].decimals
                      )
                      | formatNum
                  }}
                </span>
                <span v-else>-</span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Controllers: </span>
                <span
                  v-if="
                    tokenState[currentPair[1][0].token0[0].toString()] &&
                    tokenState[currentPair[1][0].token0[0].toString()]
                      .controllers &&
                    tokenState[currentPair[1][0].token0[0].toString()]
                      .controllers.length
                  "
                >
                  <div
                    v-for="(item, index) in tokenState[
                      currentPair[1][0].token0[0].toString()
                    ].controllers"
                    :key="index"
                  >
                    {{ item }}
                  </div>
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Module Hash: </span>
                <span
                  v-if="
                    tokenState[currentPair[1][0].token0[0].toString()] &&
                    tokenState[currentPair[1][0].token0[0].toString()]
                      .moduleHash
                  "
                >
                  {{
                    tokenState[currentPair[1][0].token0[0].toString()]
                      .moduleHash
                  }}
                </span>
              </div>
            </div>
            <div class="trade-competitions-info-main">
              <div class="trade-competitions-info-item">
                <span style="color: #dfe5ec">Token1</span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Token Name:</span>
                <span
                  v-if="
                    tokens && tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  <span
                    v-if="
                      tokens[
                        currentPair[1][0].token1[0].toString()
                      ].name.toLocaleLowerCase() === 'icp'
                    "
                    >ICP</span
                  >
                  <span v-else>
                    {{
                      tokens[currentPair[1][0].token1[0].toString()].name
                        | ellipsisAccount(15)
                    }}
                  </span>
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Canister Id:</span>
                <span>
                  <a
                    v-show="
                      currentPair[1][0].token1[0].toString() !==
                      'ryjl3-tyaaa-aaaaa-aaaba-cai'
                    "
                    :href="
                      'https://ic.house/token/' +
                      currentPair[1][0].token1[0].toString()
                    "
                    rel="nofollow noreferrer noopener"
                    target="_blank"
                  >
                    {{ currentPair[1][0].token1[0].toString() }}
                  </a>
                  <span
                    v-show="
                      currentPair[1][0].token1[0].toString() ===
                      'ryjl3-tyaaa-aaaaa-aaaba-cai'
                    "
                    >{{ currentPair[1][0].token1[0].toString() }}
                  </span>
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Symbol:</span>
                <span
                  v-if="
                    tokens && tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Decimals:</span>
                <span
                  v-if="
                    tokens && tokens[currentPair[1][0].token1[0].toString()]
                  "
                >
                  {{ tokens[currentPair[1][0].token1[0].toString()].decimals }}
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Standard:</span>
                <span>{{ currentPair[1][0].token1[2] | filterStd }}</span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Total Supply:</span>
                <span v-if="totalSupplyToken1">
                  {{
                    totalSupplyToken1
                      | bigintToFloat(
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                      | formatNum
                  }}
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Max Supply:</span>
                <span v-if="maxSupplyToken1 && Number(maxSupplyToken1)">
                  {{
                    maxSupplyToken1
                      | bigintToFloat(
                        tokens[currentPair[1][0].token1[0].toString()].decimals,
                        tokens[currentPair[1][0].token1[0].toString()].decimals
                      )
                      | formatNum
                  }}
                </span>
                <span v-else>-</span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Controllers: </span>
                <span
                  v-if="
                    tokenState[currentPair[1][0].token1[0].toString()] &&
                    tokenState[currentPair[1][0].token1[0].toString()]
                      .controllers &&
                    tokenState[currentPair[1][0].token1[0].toString()]
                      .controllers.length
                  "
                >
                  <div
                    v-for="(item, index) in tokenState[
                      currentPair[1][0].token1[0].toString()
                    ].controllers"
                    :key="index"
                  >
                    {{ item }}
                  </div>
                </span>
              </div>
              <div class="trade-competitions-info-item">
                <span>Module Hash: </span>
                <span
                  v-if="
                    tokenState[currentPair[1][0].token1[0].toString()] &&
                    tokenState[currentPair[1][0].token1[0].toString()]
                      .moduleHash
                  "
                >
                  {{
                    tokenState[currentPair[1][0].token1[0].toString()]
                      .moduleHash
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-show="menu === tradeCompetitionsEnum.Referral"
        class="trade-competitions-referral"
      >
        <div class="trade-competitions-info-container">
          <div class="referral-title">About Trading Ambassadors</div>
          <div class="referral-item">
            <span
              >An account who has completed at least one trade automatically
              qualify as a trading ambassador and can promote the pair by
              sharing the referral link.</span
            >
            <div>
              Note: The promotion is only for this trading pair, the referral
              link is exclusive to the trading pair.
            </div>
          </div>
          <div class="referral-title mt20">Description</div>
          <div class="referral-item">
            <span v-show="description">{{ description }}</span>
            <span v-show="!description">-</span>
          </div>
          <div class="referral-title mt20">Trading pair</div>
          <div class="referral-item">
            <div>
              <span>Pair Name: </span>
              <span v-if="dexInfo">{{ dexInfo.name }}</span>
            </div>
            <div>
              <span>Canister Id: </span>
              <span>
                <a
                  :href="'https://ic.house/swap/' + currentPair[0].toString()"
                  rel="nofollow noreferrer noopener"
                  target="_blank"
                >
                  {{ currentPair[0].toString() }}
                </a>
              </span>
            </div>
          </div>
          <div class="referral-title mt20">My Referrer</div>
          <div class="referral-item">
            <div class="set-referral" v-if="!referrer">
              <div>Not yet set.</div>
              <span @click="visible = true" class="set-referral-link"
                >Set referrer (for this pair only)</span
              >
            </div>
            <div v-else>My referrer of pair is {{ referrer }}.</div>
          </div>
          <div class="referral-title mt20">My Referral Link</div>
          <div class="referral-item">
            <div
              class="referral-item-referral"
              v-if="liquidity && (liquidity.vol.value0 || liquidity.vol.value1)"
            >
              <a-textarea
                disabled
                class="referrer-textarea"
                :value="`${locationHost}/ICDex/${currentPair[1][0].token0[1]}/${currentPair[1][0].token1[1]}?accountId=${accountId}&entity=${entity}`"
                autocomplete="off"
                :autoSize="{ minRows: 2 }"
              ></a-textarea>
              <div class="referrer-entity-input">
                <a-input
                  v-show="(ambassador && !ambassador[2]) || !ambassador"
                  class="entity-input"
                  v-model="entity"
                  autocomplete="off"
                  placeholder="Entity (optional)"
                ></a-input>
                <button
                  v-clipboard:copy="
                    `${locationHost}/ICDex/${currentPair[1][0].token0[1]}/${currentPair[1][0].token1[1]}?accountId=${accountId}&entity=${entity}`
                  "
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                  type="button"
                  class="primary w100"
                >
                  Referral link
                </button>
              </div>
            </div>
            <div v-else>
              <span>
                You need to complete at least one trade on the pair to qualify
                as a trading ambassador.
              </span>
              <button disabled type="button" class="disabled w100">
                Referral link
              </button>
            </div>
          </div>
          <div class="referral-title mt20">Referral Stats</div>
          <div class="referral-item">
            <div v-if="ambassador && ambassador[0]">
              <div>
                <span>Entity: </span>
                <span>{{ ambassador[1] }}</span>
              </div>
              <div>
                <span>Referred: </span>
                <span class="base-font-title">{{ ambassador[2] }}</span>
              </div>
              <div>
                <span>Referred Vol: </span>
                <span>
                  <span class="base-font-title">
                    {{
                      ambassador[3].value0
                        | bigintToFloat(
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                  {{ tokens[currentPair[1][0].token0[0].toString()].symbol }},
                  <span class="base-font-title">
                    {{
                      ambassador[3].value1
                        | bigintToFloat(
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                  {{ tokens[currentPair[1][0].token1[0].toString()].symbol }}
                </span>
              </div>
            </div>
            <div v-show="!ambassador || (ambassador && !ambassador[0])">
              None.
            </div>
          </div>
        </div>
      </div>
      <div v-show="menu === 'Competitions'" class="trade-competitions">
        <div class="referral-title">Competition Round</div>
        <div class="referral-item competition-round-title">
          <span>Round:&nbsp;</span>
          <span v-if="currentRound">
            {{ currentRound }}
          </span>
          <div
            class="switch-round"
            v-if="currentRoundInfo && Number(currentRoundInfo[0]) > 1"
          >
            <a-input
              @keyup.enter="onChangeRound"
              class="competition-round-input"
              v-only-number
              v-model="changeRound"
              placeholder="Round"
            ></a-input>
            <button
              @click="onChangeRound"
              type="button"
              class="primary"
              :disabled="!changeRound"
            >
              Switch
            </button>
            <button
              @click="getRoundInfo()"
              type="button"
              class="primary change-current-round pc-show"
              v-show="Number(currentRoundInfo[0]) !== Number(currentRound)"
            >
              Latest Round
            </button>
          </div>
        </div>
        <div
          v-if="compRoundInfo && currentRound && compRoundInfo[currentRound]"
        >
          <div class="referral-item round-time">
            <div>
              <span>Start:</span>
              <span>
                {{
                  compRoundInfo[currentRound].start
                    | formatDateFromNanosecondUTC
                }}
              </span>
            </div>
            <div>
              <span>End:</span>
              <span>
                {{
                  compRoundInfo[currentRound].end | formatDateFromNanosecondUTC
                }}
              </span>
            </div>
          </div>
          <div class="referral-item">
            <span>Status: </span>
            <span :class="roundStatus">{{ roundStatus }}</span>
          </div>
          <div class="referral-item">
            <span>Closed Price: </span>
            <span v-if="compRoundInfo[currentRound].closedPrice.length">
              {{ compRoundInfo[currentRound].closedPrice[0] }}
              <span
                v-if="
                  Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                  'token1'
                "
              >
                {{ currentPair[1][0].token1[1] }}
              </span>
              <span v-else>
                {{ currentPair[1][0].token0[1] }}
              </span>
            </span>
            <span v-else>-</span>
          </div>
          <div class="referral-item">
            <span>Min Capital: </span>
            <span>
              <span
                v-if="
                  Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                  'token1'
                "
              >
                {{
                  compRoundInfo[currentRound].minCapital
                    | bigintToFloat(
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      tokens[currentPair[1][0].token1[0].toString()].decimals
                    )
                    | formatNum
                }}
                {{ currentPair[1][0].token1[1] }}
              </span>
              <span v-else>
                {{
                  compRoundInfo[currentRound].minCapital
                    | bigintToFloat(
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokens[currentPair[1][0].token0[0].toString()].decimals
                    )
                    | formatNum
                }}
                {{ currentPair[1][0].token0[1] }}
              </span>
            </span>
          </div>
          <div class="referral-item base-font-title" style="margin-top: 10px">
            {{ compRoundInfo[currentRound].name }}
          </div>
          <div class="referral-item">
            <div class="wrap-ellipsis">
              <div ref="infoItem" class="ellipsis" :class="{ more: showMore }">
                <span class="switch-arrow" v-show="hasMoreArrow">
                  <span v-show="showMore" @click="showMore = !showMore"
                    >fold</span
                  >
                  <span v-show="!showMore" @click="showMore = !showMore"
                    >more</span
                  >
                </span>
                {{ compRoundInfo[currentRound].content }}
              </div>
            </div>
          </div>
          <div class="referral-item" style="margin-top: 10px">
            <a
              :href="`https://ic.house/competitions/tradingComp/${currentPair[0].toString()}/${currentRound}`"
              target="_blank"
              rel="nofollow noreferrer noopener"
              >Competition Ranking -></a
            >
          </div>
        </div>
        <div class="referral-title mt20">Status of participation</div>
        <div
          class="referral-item"
          v-if="
            compRoundResult && currentRound && compRoundResult[currentRound]
          "
        >
          <div class="participation-status">
            <span>Status:&nbsp;</span>
            <span
              v-if="canRegister"
              :class="[
                filterStatus(compRoundResult[currentRound].status),
                roundStatus
              ]"
            >
              <button
                type="button"
                v-show="
                  filterStatus(compRoundResult[currentRound].status) ===
                  'Active'
                "
                class="primary"
                style="width: auto"
                disabled
              >
                Registered
              </button>
              <button
                type="button"
                v-show="
                  filterStatus(compRoundResult[currentRound].status) ===
                  'Dropout'
                "
                class="primary"
                style="width: auto; color: #d13651 !important"
                disabled
              >
                Dropout
              </button>
            </span>
            <button
              v-else
              type="button"
              class="primary"
              style="width: auto"
              disabled
            >
              Closed
              <span
                v-if="
                  filterStatus(compRoundResult[currentRound].status) ===
                  'Dropout'
                "
                >(Dropout)</span
              >
            </button>
            <span
              v-if="
                canRegister &&
                filterStatus(compRoundResult[currentRound].status) === 'Active'
              "
              type="button"
              @click="onDropOut"
              class="pointer"
              style="color: #51b7c3"
            >
              &nbsp;Dropout
            </span>
          </div>
          <div>
            <div>
              <span>Volume for the round: </span>
              <span
                v-if="
                  Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                  'token0'
                "
              >
                <a-tooltip>
                  <template slot="title">
                    {{
                      compRoundResult[currentRound].vol.value0
                        | bigintToFloat(
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </template>
                  <span>
                    {{
                      compRoundResult[currentRound].vol.value0
                        | bigintToFloat(
                          4,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                </a-tooltip>
                {{ currentPair[1][0].token0[1] }}
              </span>
              <span v-else>
                <a-tooltip>
                  <template slot="title">
                    {{
                      compRoundResult[currentRound].vol.value1
                        | bigintToFloat(
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </template>
                  <span>
                    {{
                      compRoundResult[currentRound].vol.value1
                        | bigintToFloat(
                          4,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                </a-tooltip>
                {{ currentPair[1][0].token1[1] }}
              </span>
            </div>
            <div>
              <span>Basic Capital: </span>
              <span>
                <a-tooltip>
                  <template slot="title">
                    {{
                      compRoundResult[currentRound].capital.value0
                        | bigintToFloat(
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                    {{ currentPair[1][0].token0[1] }}
                    +
                    {{
                      compRoundResult[currentRound].capital.value1
                        | bigintToFloat(
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                    {{ currentPair[1][0].token1[1] }}
                    , Total:
                    <span
                      v-if="
                        Object.keys(
                          compRoundInfo[currentRound].quoteToken
                        )[0] === 'token1'
                      "
                    >
                      {{
                        compRoundResult[currentRound].capital.total
                          | bigintToFloat(
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                      <span> {{ currentPair[1][0].token1[1] }}</span>
                    </span>
                    <span v-else>
                      {{
                        compRoundResult[currentRound].capital.total
                          | bigintToFloat(
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                      <span> {{ currentPair[1][0].token0[1] }}</span>
                    </span>
                  </template>
                  <span>
                    {{
                      compRoundResult[currentRound].capital.value0
                        | bigintToFloat(
                          4,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                  <span> {{ currentPair[1][0].token0[1] }} + </span>
                  <span>
                    {{
                      compRoundResult[currentRound].capital.value1
                        | bigintToFloat(
                          4,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                  <span> {{ currentPair[1][0].token1[1] }}</span>
                  <span>, Total: </span>
                  <span
                    v-if="
                      Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                      'token1'
                    "
                  >
                    <span class="base-color-w">
                      {{
                        compRoundResult[currentRound].capital.total
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                    </span>
                    <span> {{ currentPair[1][0].token1[1] }}</span>
                  </span>
                  <span v-else>
                    <span class="base-color-w">
                      {{
                        compRoundResult[currentRound].capital.total
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                    </span>
                    <span> {{ currentPair[1][0].token0[1] }}</span>
                  </span>
                </a-tooltip>
              </span>
            </div>
            <div>
              <span>Equity: </span>
              <span
                v-if="
                  roundStatus === 'Closed' ||
                  filterStatus(compRoundResult[currentRound].status) ===
                    'Dropout'
                "
              >
                <a-tooltip>
                  <template slot="title">
                    {{
                      compRoundResult[currentRound].assetValue[0].value0
                        | bigintToFloat(
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                    {{ currentPair[1][0].token0[1] }}
                    +
                    {{
                      compRoundResult[currentRound].assetValue[0].value1
                        | bigintToFloat(
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                    {{ currentPair[1][0].token1[1] }}
                    , Total:
                    <span
                      v-if="
                        Object.keys(
                          compRoundInfo[currentRound].quoteToken
                        )[0] === 'token1'
                      "
                    >
                      {{
                        compRoundResult[currentRound].assetValue[0].total
                          | bigintToFloat(
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                      <span> {{ currentPair[1][0].token1[1] }}</span>
                    </span>
                    <span v-else>
                      {{
                        compRoundResult[currentRound].assetValue[0].total
                          | bigintToFloat(
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                      <span> {{ currentPair[1][0].token0[1] }}</span>
                    </span>
                  </template>
                  <span>
                    {{
                      compRoundResult[currentRound].assetValue[0].value0
                        | bigintToFloat(
                          4,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                  <span> {{ currentPair[1][0].token0[1] }} + </span>
                  <span>
                    {{
                      compRoundResult[currentRound].assetValue[0].value1
                        | bigintToFloat(
                          4,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                  <span> {{ currentPair[1][0].token1[1] }}</span>
                  <span>, Total: </span>
                  <span
                    v-if="
                      Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                      'token1'
                    "
                  >
                    <span class="base-color-w">
                      {{
                        compRoundResult[currentRound].assetValue[0].total
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                    </span>
                    <span> {{ currentPair[1][0].token1[1] }}</span>
                  </span>
                  <span v-else>
                    <span>
                      {{
                        compRoundResult[currentRound].assetValue[0].total
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                    </span>
                    <span> {{ currentPair[1][0].token0[1] }}</span>
                  </span>
                </a-tooltip>
              </span>
              <span
                v-else-if="
                  roundStatus === 'Opening' &&
                  equity &&
                  compRoundResult[currentRound]
                "
              >
                <a-tooltip>
                  <template slot="title">
                    {{
                      equity.value0
                        | bigintToFloat(
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                    {{ currentPair[1][0].token0[1] }}
                    +
                    {{
                      equity.value1
                        | bigintToFloat(
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                    {{ currentPair[1][0].token1[1] }}
                    ,Total:
                    <span
                      v-if="
                        Object.keys(
                          compRoundInfo[currentRound].quoteToken
                        )[0] === 'token1'
                      "
                    >
                      {{
                        equity.total
                          | bigintToFloat(
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                      <span> {{ currentPair[1][0].token1[1] }}</span>
                    </span>
                    <span v-else>
                      {{
                        equity.total
                          | bigintToFloat(
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                      <span> {{ currentPair[1][0].token0[1] }}</span>
                    </span>
                  </template>
                  <span>
                    {{
                      equity.value0
                        | bigintToFloat(
                          4,
                          tokens[currentPair[1][0].token0[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                  <span> {{ currentPair[1][0].token0[1] }} + </span>
                  <span>
                    {{
                      equity.value1
                        | bigintToFloat(
                          4,
                          tokens[currentPair[1][0].token1[0].toString()]
                            .decimals
                        )
                        | formatNum
                    }}
                  </span>
                  <span> {{ currentPair[1][0].token1[1] }}</span>
                  <span>,Total: </span>
                  <span
                    v-if="
                      Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                      'token1'
                    "
                  >
                    <span class="base-color-w">
                      {{
                        equity.total
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token1[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                    </span>
                    <span> {{ currentPair[1][0].token1[1] }}</span>
                  </span>
                  <span v-else>
                    <span class="base-color-w">
                      {{
                        equity.total
                          | bigintToFloat(
                            4,
                            tokens[currentPair[1][0].token0[0].toString()]
                              .decimals
                          )
                          | formatNum
                      }}
                    </span>
                    <span> {{ currentPair[1][0].token0[1] }}</span>
                  </span>
                </a-tooltip>
              </span>
            </div>
            <div>
              <span>PNL(%): </span>
              <span class="base-color-w">{{ pnl }}</span>
            </div>
          </div>
          <!-- <div v-else>
            <div>
              <span>Volume for the round: </span>
              <span>-</span>
            </div>
            <div>
              <span>Init Capital: </span>
              <span>-</span>
            </div>
            <div>
              <span>Equity: </span>
              <span>-</span>
            </div>
            <div>
              <span>PNL(%): </span>
              <span>-</span>
            </div>
          </div>-->
        </div>
        <div v-else class="referral-item">
          <div v-if="getPrincipalId" class="referral-item-status">
            <span>Status: </span>
            <button
              @click="comp_register"
              type="button"
              v-if="canRegister"
              class="primary"
              style="width: auto"
            >
              Register
            </button>
            <button
              type="button"
              v-if="openSoon"
              class="primary"
              style="width: auto"
              disabled
            >
              Open soon...
            </button>
            <button
              type="button"
              v-if="!canRegister && !openSoon"
              class="primary"
              style="width: auto"
              disabled
            >
              Closed
            </button>
          </div>
          <div class="mt20">
            Notes: Participants' trading assets will be held in the contract
            until the end of the competition for the purpose of calculating
            earnings. Participants may drop out the competition and withdraw
            their assets early.
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model="visible"
      centered
      title="Set Referrer"
      width="550px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
    >
      <a-form-model
        :model="referrerForm"
        ref="referrerForm"
        :rules="referrerRules"
      >
        <a-form-model-item label="Referrer" prop="referrerValue">
          <a-input
            v-model="referrerForm.referrerValue"
            autocomplete="off"
            placeholder="Principal or Account"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
      <button
        class="w100 set-referrer-button primary"
        type="button"
        @click="setReferrer"
      >
        Submit
      </button>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import {
  DePairs,
  TradeCompetitionsEnum,
  TradeCompetitionsMenu
} from '@/views/home/ICDex/model';
import { TokenInfo, TokenStd } from '@/ic/common/icType';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { TokenLiquidity } from '@/ic/ICSwap/model';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { principalToAccountIdentifier, toHexString } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import {
  Ambassador,
  CompCapital,
  CompDepositAccount,
  CompResult,
  CompRoundResponse,
  PairInfo,
  RoundInfo
} from '@/ic/ICDex/model';
import { getCompetitionsBalance } from '@/ic/getTokenBalance';
import { validateCanisterOrAccount } from '@/utils/validate';
import { namespace } from 'vuex-class';
import { readState } from '@/ic/readState';

const commonModule = namespace('common');

@Component({
  name: 'TradeCompetitions',
  components: {},
  filters: {
    filterFee(val: DePairs): string {
      if (val) {
        return (
          new BigNumber(val[1][0].feeRate.toString()).times(100).toString(10) +
          '%'
        );
      }
      return '';
    },
    filterBuyFee(val: DePairs): string {
      if (val) {
        return (
          new BigNumber(val[1][0].feeRate.toString()).times(100).toString(10) +
          '%'
        );
      }
      return '';
    },
    filterUnitSize(unitSize: bigint, decimals: number): string {
      return new BigNumber(unitSize.toString(10))
        .div(10 ** decimals)
        .toString(10);
    },
    filterPaused(val: boolean): string {
      if (val) {
        return 'Paused';
      } else {
        return 'Opening';
      }
    },
    filterStd(std: TokenStd): string {
      if (std) {
        let res = Object.keys(std)[0];
        if (res.toLocaleLowerCase() === 'icrc2') {
          res = 'icrc1';
        }
        return res;
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @Prop({ type: Array, default: () => [] })
  public currentPair!: DePairs;
  @Prop({ type: Object, default: () => null })
  tokens!: { [key: string]: TokenInfo };
  @Prop({ type: String, default: () => null })
  menu!: TradeCompetitionsMenu;
  @Prop({ type: Boolean, default: false })
  registerCompetition!: boolean;
  private visible = false;
  private hasMoreArrow = false;
  private showMore = false;
  private dexInfo: PairInfo = null;
  private tokenState: {
    [key: string]: { controllers?: Array<string>; moduleHash?: string };
  } = {};
  private ambassador: Ambassador = null;
  private totalSupply: bigint = null;
  private maxSupply: bigint = null;
  private totalSupplyToken1: bigint = null;
  private maxSupplyToken1: bigint = null;
  private tradeCompetitionsEnum = TradeCompetitionsEnum;
  private description = '';
  private referrer = '';
  private referrerForm = {
    referrerValue: ''
  };
  private referrerRules = {
    referrerValue: [
      {
        required: true,
        message: 'Please enter principal or account id',
        trigger: 'blur'
      },
      { validator: validateCanisterOrAccount, trigger: 'blur' }
    ]
  };
  private referrerEntity = '';
  private entity = '';
  private liquidity: TokenLiquidity = null;
  private accountId = '';
  private loading = null;
  private compRoundInfo: { [key: string]: RoundInfo } = null;
  private compRoundResult: { [key: string]: CompResult } = null;
  private currentRoundInfo: CompRoundResponse = null;
  private currentRound = '';
  private changeRound = '';
  private isShowMore = false;
  private currentEquity: CompCapital = null;
  private equity: CompCapital = null;
  private locationHost = '';
  get pnl(): string {
    if (
      this.compRoundInfo &&
      this.currentRound &&
      this.compRoundInfo[this.currentRound] &&
      this.compRoundResult &&
      this.compRoundResult[this.currentRound] &&
      this.tokens &&
      this.tokens[this.currentPair[1][0].token1[0].toString()] &&
      this.tokens[this.currentPair[1][0].token0[0].toString()]
    ) {
      let equityTotal = '0';
      let capitalTotal = this.compRoundResult[this.currentRound].capital.total;
      if (
        this.compRoundInfo &&
        this.compRoundInfo[this.currentRound] &&
        this.compRoundInfo[this.currentRound].minCapital
      ) {
        if (
          new BigNumber(capitalTotal).lt(
            this.compRoundInfo[this.currentRound].minCapital.toString(10)
          )
        ) {
          capitalTotal =
            this.compRoundInfo[this.currentRound].minCapital.toString(10);
        }
      }
      if (
        this.roundStatus === 'Closed' ||
        this.filterStatus(this.compRoundResult[this.currentRound].status) ===
          'Dropout'
      ) {
        equityTotal =
          this.compRoundResult[this.currentRound].assetValue[0].total;
      } else {
        equityTotal = this.equity.total;
      }
      return (
        new BigNumber(equityTotal)
          .minus(capitalTotal)
          .div(capitalTotal)
          .times(100)
          .decimalPlaces(2)
          .toString(10) + '%'
      );
    }
    return '-';
  }
  get roundStatus(): string {
    if (
      this.currentRound &&
      this.compRoundInfo &&
      this.compRoundInfo[this.currentRound]
    ) {
      const round = this.compRoundInfo[this.currentRound];
      const now = new Date().getTime();
      if (new BigNumber(now).times(1000000).lt(round.start.toString(10))) {
        return 'Starting soon';
      }
      if (
        new BigNumber(now).times(1000000).gte(round.start.toString(10)) &&
        new BigNumber(now).times(1000000).lte(round.end.toString(10))
      ) {
        return 'Opening';
      }
      if (new BigNumber(now).times(1000000).gt(round.end.toString(10))) {
        if (round.isSettled) {
          return 'Closed';
        }
        return 'Closing';
      }
    }
    return '';
  }
  get canRegister(): boolean {
    let flag = false;
    if (
      this.currentRound &&
      this.compRoundInfo &&
      this.compRoundInfo[this.currentRound]
    ) {
      const round = this.compRoundInfo[this.currentRound];
      const now = new Date().getTime();
      flag =
        new BigNumber(now).times(1000000).gte(round.start.toString(10)) &&
        new BigNumber(now).times(1000000).lte(round.end.toString(10));
    }
    return flag;
  }
  get openSoon(): boolean {
    let flag = false;
    if (
      this.currentRound &&
      this.compRoundInfo &&
      this.compRoundInfo[this.currentRound]
    ) {
      const round = this.compRoundInfo[this.currentRound];
      const now = new Date().getTime();
      flag = new BigNumber(now).times(1000000).lt(round.start.toString(10));
    }
    return flag;
  }
  created(): void {
    // console.log(this.tokens);
    // const principal = localStorage.getItem('principal');
    // if (principal) {
    //   this.accountId = principalToAccountIdentifier(
    //     Principal.fromText(principal)
    //   );
    // }
    // this.init();
    // this.locationHost = window.location.host;
  }
  private async init(menu: TradeCompetitionsMenu): Promise<void> {
    let loading = null;
    try {
      const principal = localStorage.getItem('principal');
      if (principal) {
        this.accountId = principalToAccountIdentifier(
          Principal.fromText(principal)
        );
      }
      this.locationHost = window.location.origin;
      console.log(menu);
      if (menu === TradeCompetitionsEnum.Info) {
        const promiseValue = [
          this.getInfo(this.currentPair[0].toString()),
          this.getTotalSupply(),
          this.getMaxSupply(),
          this.getTotalSupplyToken1(),
          this.getMaxSupplyToken1()
        ];
        loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await Promise.all(promiseValue);
      }
      if (menu === TradeCompetitionsEnum.Referral) {
        const promiseValue = [
          this.ta_description(),
          this.ta_getReferrer(),
          this.ta_ambassador(),
          this.getLiquidity()
        ];
        loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await Promise.all(promiseValue);
      }
      if (menu === 'Competitions') {
        this.compRoundInfo = null;
        this.compRoundResult = null;
        this.currentRoundInfo = null;
        this.currentRound = '';
        this.changeRound = '';
        this.currentEquity = null;
        this.equity = null;
        this.getRoundInfo();
      }
      // this.getRoundInfo();
      // const promiseValue = [
      //   this.getInfo(this.currentPair[0].toString()),
      //   this.getTotalSupply(),
      //   this.getMaxSupply(),
      //   this.getTotalSupplyToken1(),
      //   this.getMaxSupplyToken1(),
      //   this.ta_description(),
      //   this.ta_getReferrer(),
      //   this.ta_ambassador(),
      //   this.getLiquidity(),
      //   this.getRoundInfo()
      // ];
      // await Promise.all(promiseValue);
      const address = principalToAccountIdentifier(
        Principal.fromText(principal)
      );
      const referrer = this.$cookies.get('referral') || {};
      const currentReferrer = referrer[this.currentPair[0].toString()];
      if (currentReferrer && currentReferrer.entity) {
        this.referrerEntity = currentReferrer.entity;
      } else {
        this.referrerEntity = '';
      }
      if (
        currentReferrer &&
        currentReferrer.accountId &&
        currentReferrer.accountId !== address
      ) {
        this.referrerForm.referrerValue = currentReferrer.accountId;
      } else {
        this.referrerForm.referrerValue = '';
      }
    } catch (e) {
      console.log(e);
    }
    loading && loading.close();
  }
  private afterClose(): void {
    (this.$refs.referrerForm as any).resetFields();
  }
  private onDropOut(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this;
    this.$confirm({
      content:
        'You will not be able to re-enter this round after you have dropted out of the competition.',
      class: 'connect-plug confirm-swap-button',
      icon: 'connect-plug',
      okText: 'Submit',
      centered: true,
      onOk() {
        const currentICDexService = new ICDexService();
        const dexId = _that.currentPair[0].toString();
        const loading = _that.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        currentICDexService
          .comp_dropout(dexId)
          .then((res) => {
            if (res) {
              _that.$message.success('Dropout Success');
              _that.$emit('dropOut');
              _that.getCompResult();
            } else {
              _that.$message.error('Dropout Error');
            }
            loading.close();
          })
          .catch(() => {
            _that.$message.error('Dropout Error');
            loading.close();
          });
      }
    });
  }
  private filterStatus(val: { Active: null } | { Dropout: null }): string {
    if (val) {
      return Object.keys(val)[0];
    }
    return '';
  }
  private getTextHeight(): void {
    this.$nextTick(() => {
      let cellChild = (this.$refs as any).infoItem;
      if (cellChild) {
        this.hasMoreArrow = cellChild.scrollHeight > cellChild.offsetHeight;
      }
    });
  }
  private onChangeRound(): void {
    if (Number(this.changeRound)) {
      if (Number(this.changeRound) > Number(this.currentRoundInfo[0])) {
        this.changeRound = this.currentRoundInfo[0].toString(10);
        this.getRoundInfo([this.currentRoundInfo[0]]);
      } else {
        this.getRoundInfo([BigInt(this.changeRound)]);
      }
      this.changeRound = '';
    }
  }
  private async setReferrer(): Promise<void> {
    (this.$refs.referrerForm as any).validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          const currentICDexService = new ICDexService();
          const dexId = this.currentPair[0].toString();
          let entity = [];
          if (this.referrerEntity) {
            entity = [this.referrerEntity.trim()];
          }
          const res = await currentICDexService.ta_setReferrer(
            dexId,
            this.referrerForm.referrerValue.trim(),
            entity
          );
          console.log(res);
          if (res) {
            this.$message.success('Success');
            this.visible = false;
          } else {
            this.$message.error('Error');
          }
        } catch (e) {
          console.log(e);
          this.$message.error('Error');
        }
        this.ta_getReferrer();
        loading.close();
      }
    });
  }
  private async getRoundInfo(round: Array<bigint> = []): Promise<void> {
    try {
      if (
        round.length &&
        this.compRoundInfo &&
        this.compRoundInfo[round[0].toString(10)] &&
        round[0] !== this.currentRoundInfo[0]
      ) {
        this.currentRound = round[0].toString(10);
        this.getTextHeight();
        this.getDepositAccount(round);
        return;
      }
      const currentICDexService = new ICDexService();
      const dexId = this.currentPair[0].toString();
      const res = await currentICDexService.comp_round(dexId, round);
      if (res && res.pairId === this.currentPair[0].toString()) {
        this.currentRound = res.compRoundResponse[0].toString(10);
        if (!round.length || round[0] === this.currentRoundInfo[0]) {
          this.currentRoundInfo = res.compRoundResponse;
        }
        if (!this.compRoundInfo) {
          this.compRoundInfo = {};
        }
        this.$set(
          this.compRoundInfo,
          res.compRoundResponse[0].toString(10),
          res.compRoundResponse[1][0]
        );
        this.getTextHeight();
        this.getDepositAccount([res.compRoundResponse[0]]);
        console.log(this.compRoundInfo);
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getDepositAccount(round: Array<bigint>): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      this.loading = this.$loading({
        lock: true,
        text: '',
        background: 'rgba(0, 0, 0, 0.5)'
      });
      const currentICDexService = new ICDexService();
      const dexId = this.currentPair[0].toString();
      const account = await currentICDexService.comp_getDepositAccount(
        dexId,
        principal
      );
      console.log(account);
      this.getEquity(account, round);
    }
  }
  private async getEquity(
    account: CompDepositAccount,
    round: Array<bigint>
  ): Promise<void> {
    const token0Std = this.currentPair[1][0].token0[2];
    const token0Id = this.currentPair[1][0].token0[0].toString();
    const token1Std = this.currentPair[1][0].token1[2];
    const token1Id = this.currentPair[1][0].token1[0].toString();
    let token0Balance = await getCompetitionsBalance(
      token0Std,
      token0Id,
      account.balance
    );
    let token1Balance = await getCompetitionsBalance(
      token1Std,
      token1Id,
      account.balance
    );
    console.log(this.currentPair);
    const total = new BigNumber(token0Balance)
      .times(this.currentPair[2].price)
      .plus(token1Balance)
      .toString(10);
    this.currentEquity = {
      total: total,
      value0: BigInt(token0Balance),
      value1: BigInt(token1Balance)
    };
    console.log(token0Balance, token1Balance);
    console.log(total);
    this.getCompResult(round);
  }
  private async ta_ambassador(): Promise<void> {
    try {
      const currentICDexService = new ICDexService();
      const dexId = this.currentPair[0].toString();
      const principal = localStorage.getItem('principal');
      const res = await currentICDexService.ta_ambassador(dexId, principal);
      if (res && res.pairId === dexId) {
        this.ambassador = res.ambassador;
        console.log(this.ambassador);
        this.entity = this.ambassador[1];
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getCompResult(round: Array<bigint> = []): Promise<void> {
    console.log(round);
    if (
      round.length &&
      this.compRoundResult &&
      this.compRoundResult[round[0].toString(10)] &&
      round[0] !== this.currentRoundInfo[0]
    ) {
      this.loading && this.loading.close();
      return;
    }
    if (!round.length) {
      round = [this.currentRoundInfo[0]];
    }
    const currentICDexService = new ICDexService();
    const dexId = this.currentPair[0].toString();
    const principal = localStorage.getItem('principal');
    const res = await currentICDexService.comp_result(dexId, round, principal);
    if (!this.compRoundResult) {
      this.compRoundResult = {};
    }
    this.$set(this.compRoundResult, round[0].toString(10), res[0]);
    if (this.compRoundResult[round[0].toString(10)]) {
      if (
        Object.keys(this.compRoundResult[round[0].toString(10)].status)[0] ===
        'Active'
      ) {
        const assetValue =
          this.compRoundResult[round[0].toString(10)].assetValue;
        console.log(assetValue);
        this.equity = {
          total: new BigNumber(this.currentEquity.total)
            .plus(assetValue[0].total)
            .toString(10),
          value0: BigInt(
            new BigNumber(this.currentEquity.value0.toString(10))
              .plus(assetValue[0].value0.toString(10))
              .toString(10)
          ),
          value1: BigInt(
            new BigNumber(this.currentEquity.value1.toString(10))
              .plus(assetValue[0].value1.toString(10))
              .toString(10)
          )
        };
      }
    }
    console.log(this.compRoundResult);
    this.loading && this.loading.close();
  }
  private async getLiquidity(): Promise<void> {
    const currentICDexService = new ICDexService();
    const dexId = this.currentPair[0].toString();
    const principal = localStorage.getItem('principal');
    const res = await currentICDexService.liquidity(dexId, [principal]);
    if (res && res.pairId === this.currentPair[0].toString()) {
      this.liquidity = res.tokenLiquidity;
    }
    console.log(this.liquidity);
  }
  private async comp_register(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this;
    this.$confirm({
      title: 'Are you sure you want to participate in the trading competition?',
      content:
        "Notes: Participants' trading assets will be held in the contract until the end of the competition for the purpose of calculating earnings. Participants may drop out the competition and withdraw their assets early.",
      class: 'connect-plug register-mining-confirm',
      icon: 'connect-plug',
      okText: 'Yes',
      centered: true,
      onOk() {
        const loading = _that.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        const currentICDexService = new ICDexService();
        const dexId = _that.currentPair[0].toString();
        currentICDexService
          .comp_register(dexId)
          .then((res) => {
            if (res) {
              _that.$message.success('Register success');
              _that.$emit('registerSuccess');
              _that.getCompResult();
            } else {
              _that.$message.error('Register error');
            }
          })
          .catch(() => {
            _that.$message.error('Register error');
          })
          .finally(() => {
            loading.close();
          });
      }
    });
  }
  private async ta_getReferrer(): Promise<void> {
    const currentICDexService = new ICDexService();
    const dexId = this.currentPair[0].toString();
    const principal = localStorage.getItem('principal');
    const res = await currentICDexService.ta_getReferrer(dexId, principal);
    console.log(res);
    if (res && res.pairId === dexId && res.referrer[0] && res.referrer[0][0]) {
      this.referrer = res.referrer[0][0];
    }
  }
  private async ta_description(): Promise<void> {
    const currentICDexService = new ICDexService();
    const dexId = this.currentPair[0].toString();
    const res = await currentICDexService.ta_description(dexId);
    if (res && res.pairId === dexId) {
      this.description = res.ta_description;
    }
    console.log(this.description);
  }
  private async getTotalSupply(): Promise<void> {
    const DRC20Token = new DRC20TokenService();
    const tokenId = this.currentPair[1][0].token0[0].toString();
    const std = Object.keys(this.currentPair[1][0].token0[2])[0];
    if (std.toLocaleLowerCase() === 'drc20') {
      this.totalSupply = await DRC20Token.totalSupply(tokenId);
    }
    if (std.toLocaleLowerCase() === 'dip20') {
      const res = await DRC20Token.getMetadata(tokenId);
      this.totalSupply = res.totalSupply;
    }
    if (
      std.toLocaleLowerCase() === 'icrc1' ||
      std.toLocaleLowerCase() === 'icrc2' ||
      std.toLocaleLowerCase() === 'icp'
    ) {
      this.totalSupply = await DRC20Token.icrcTotalSupply(tokenId);
    }
  }
  private async getMaxSupply(): Promise<void> {
    const DRC20Token = new DRC20TokenService();
    const tokenId = this.currentPair[1][0].token0[0].toString();
    const std = Object.keys(this.currentPair[1][0].token0[2])[0];
    if (std.toLocaleLowerCase() === 'drc20') {
      this.maxSupply = await DRC20Token.getMaxSupply(tokenId);
    }
  }
  private async getTotalSupplyToken1(): Promise<void> {
    const DRC20Token = new DRC20TokenService();
    const tokenId = this.currentPair[1][0].token1[0].toString();
    console.log(tokenId);
    console.log(this.currentPair[1][0].token1);
    const std = Object.keys(this.currentPair[1][0].token1[2])[0];
    if (std.toLocaleLowerCase() === 'drc20') {
      this.totalSupplyToken1 = await DRC20Token.totalSupply(tokenId);
    }
    if (
      std.toLocaleLowerCase() === 'icrc1' ||
      std.toLocaleLowerCase() === 'icrc2' ||
      std.toLocaleLowerCase() === 'icp'
    ) {
      this.totalSupplyToken1 = await DRC20Token.icrcTotalSupply(tokenId);
    }
  }
  private async getMaxSupplyToken1(): Promise<void> {
    const DRC20Token = new DRC20TokenService();
    const tokenId = this.currentPair[1][0].token1[0].toString();
    const std = Object.keys(this.currentPair[1][0].token1[2])[0];
    if (std.toLocaleLowerCase() === 'drc20') {
      this.maxSupplyToken1 = await DRC20Token.getMaxSupply(tokenId);
    }
  }
  private async getInfo(pairId: string): Promise<void> {
    const currentICDexService = new ICDexService();
    const res = await currentICDexService.info(pairId);
    if (res && res.pairId === pairId) {
      this.dexInfo = res.pairInfo;
      this.getTokenState(this.dexInfo.token0[0].toString());
      this.getTokenState(this.dexInfo.token1[0].toString());
      this.getPairControllers(pairId);
      this.ictc_getAdmins(pairId);
      this.IDOFunder(pairId);
      this.auctionMode(pairId);
    } else {
      this.dexInfo = null;
    }
    console.log(this.dexInfo);
  }
  private async getTokenState(tokenId: string): Promise<void> {
    try {
      readState(tokenId).then((state) => {
        if (!this.tokenState[tokenId]) {
          this.tokenState[tokenId] = {};
        }
        if (state && state.controllers && state.controllers.length) {
          this.$set(this.tokenState[tokenId], 'controllers', state.controllers);
        }
        if (state && state.moduleHash) {
          this.$set(this.tokenState[tokenId], 'moduleHash', state.moduleHash);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
  private async auctionMode(pairId: string): Promise<void> {
    const currentICDexService = new ICDexService();
    const res = await currentICDexService.getAuctionMode(pairId);
    if (res && res[1]) {
      this.$set(this.dexInfo, 'auctionMode', res[0]);
    }
  }
  private async IDOFunder(pairId: string): Promise<void> {
    const currentICDexService = new ICDexService();
    const res = await currentICDexService.IDO_getConfig(pairId);
    if (res && res[0]) {
      this.$set(this.dexInfo, 'IDOFunder', res[0]);
    }
  }
  private async ictc_getAdmins(pairId: string): Promise<void> {
    const currentICDexService = new ICDexService();
    const res = await currentICDexService.ictc_getAdmins(pairId);
    if (res) {
      this.$set(this.dexInfo, 'admins', res);
    }
  }
  private async getPairControllers(pairId: string): Promise<void> {
    try {
      const state = await readState(pairId);
      if (state && state.controllers && state.controllers.length) {
        this.$set(this.dexInfo, 'controllers', state.controllers);
      }
      if (state && state.moduleHash) {
        this.$set(this.dexInfo, 'moduleHash', state.moduleHash);
      }
    } catch (e) {
      console.log(e);
    }
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
  private back(): void {
    this.$emit('infoBack');
  }
  private onError(): void {
    console.log('err');
  }
}
</script>

<style scoped lang="scss">
.set-referrer-button {
  height: 36px;
  margin: 40px 0;
}
.trade-competitions-info-item-title {
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 20px;
}
.trade-competitions-info {
  max-width: 1000px;
  line-height: 1.5;
  font-size: 14px;
  margin: 50px auto 0;
}
.trade-competitions-info-container {
  background: #131920;
  margin-bottom: 20px;
  padding: 25px;
  border-radius: 8px;
  word-break: break-all;
}
.trade-competitions-referral {
  max-width: 1000px;
  margin: 50px auto 0;
}
.trade-competitions {
  max-width: 1000px;
  margin: 50px auto 0;
  line-height: 1.5;
  background: #131920;
  padding: 25px;
  border-radius: 8px;
}
.token-info-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .trade-competitions-info-main {
    margin-bottom: 10px;
    &:first-child {
      margin-right: 50px;
    }
  }
}
.trade-competitions-main-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0 20px;
  color: #fff;
  i {
    position: absolute;
    left: 0;
    font-size: 18px;
  }
  .trade-competitions-main-name {
    font-size: 20px;
  }
}
.trade-competitions-main {
  width: 1000px;
  height: 100%;
  margin: 0 auto;
  padding: 20px 50px;
  background: #0e0e11;
  line-height: 20px;
  color: #8c98a5;
  &.has-register-competition {
    height: 754px;
  }
  .round-time {
    display: flex;
    align-items: center;
    div {
      margin-right: 15px;
    }
  }
  button {
    height: 36px;
    margin-top: 10px;
  }
  .referral-item-status {
    display: flex;
    align-items: center;
    button {
      height: 30px;
      min-width: 80px;
      margin: 0 0 0 10px;
    }
  }
  .set-referral {
    .set-referral-link {
      color: #2b8cb0;
      cursor: pointer;
    }
  }
  .entity-input {
    margin-top: 5px;
  }
  .referral-link {
    display: inline-block;
    margin: 5px 0 15px;
    font-size: 12px;
  }
  .referral-title {
    margin-bottom: 15px;
    color: #fff;
    font-size: 18px;
  }
  .competition-round-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    color: #adb7c2;
    .switch-round {
      display: flex;
      align-items: center;
      button {
        height: 28px;
        width: 70px;
        margin: 0;
        &.change-current-round {
          width: 110px;
          margin-left: 15px;
        }
      }
    }
  }
  .competition-round-input {
    width: 60px;
    height: 28px !important;
    margin: 0 15px;
  }
  .referral-item {
    word-break: break-word;
    .referral-item-referral {
      display: flex;
      align-items: flex-start;
      input {
        margin: 0 10px;
      }
      button {
        margin: 0 10px;
      }
    }
    .referrer-entity-input {
      display: flex;
      align-items: flex-start;
    }
    .referrer-textarea[disabled] {
      width: 50%;
      background: #141b23 !important;
      border-color: #464648 !important;
      cursor: default;
    }
    .Opening,
    .Active {
      color: #21c77d;
    }
    .Dropout {
      color: #d13651;
    }
    .Closing,
    .Closed {
      color: #777d90;
    }
  }
  .participation-status {
    display: flex;
    align-items: center;
    margin: 10px 0;
    button {
      height: 28px;
      min-width: 80px;
      margin: 0 0 0 10px;
    }
  }
  .trade-competitions-info-item {
    display: flex;
    span {
      &:first-child {
        width: 110px;
      }
    }
    &.trade-competitions-info-metadata {
      flex-direction: column;
      .trade-competitions-info-item-metadata {
        padding-left: 1em;
      }
    }
  }
  .trade-competitions-info-metadata-item {
    display: flex;
    .trade-competitions-info-metadata-item-fee {
      display: flex;
      span {
        width: auto !important;
        margin-right: 20px;
      }
    }
    span {
      &:first-child {
        width: 110px;
      }
    }
  }
  a {
    color: #1996c4;
  }
}
@media screen and (max-width: 768px) {
  .token-info-main {
    flex-direction: column;
    align-items: flex-start;
  }
  .trade-competitions {
    padding: 10px;
  }
  .trade-competitions-info-metadata-item {
    .trade-competitions-info-metadata-item-fee {
      flex-wrap: wrap;
      span {
        margin-right: 0;
      }
    }
  }
  .trade-competitions-info-container {
    padding: 15px;
  }
  .trade-competitions-main {
    width: 100%;
    padding: 10px;
    .trade-competitions-info-main {
      &:first-child {
        margin-right: 0;
      }
    }
    .switch-round {
      flex-wrap: wrap;
    }
    .round-time {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .trade-competitions-referral {
    margin-top: 0;
    .referral-item-referral {
      flex-direction: column;
      .referrer-entity-input {
        margin-top: 10px;
      }
      .referrer-textarea[disabled] {
        width: 100%;
      }
    }
  }
  .trade-competitions-info {
    margin-top: 0;
    font-size: 12px;
    line-height: 1.5;
    .trade-competitions-info-item {
      span {
        &:first-child {
          width: 90px;
          flex-shrink: 0;
        }
      }
    }
    .trade-competitions-info-metadata-item {
      span {
        &:first-child {
          width: 80px;
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
