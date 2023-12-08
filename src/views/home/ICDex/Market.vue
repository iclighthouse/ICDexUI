<template>
  <div>
    <div class="home-header">
      <div class="home-header-left">
        <img
          class="home-header-logo"
          src="@/assets/img/icdex-2.png"
          alt="logo"
        />
      </div>
      <ul>
        <li
          :class="{
            active:
              $route.fullPath.toLocaleLowerCase() ===
                menu.path.toLocaleLowerCase() ||
              (menu.value === 'Trade' && $route.name === 'ICDex')
          }"
          v-for="(menu, index) in menuList"
          :key="index"
        >
          <router-link :to="menu.path">{{ menu.value }}</router-link>
        </li>
      </ul>
      <account-info :menu-list="menuList"></account-info>
    </div>
    <div class="market-main container-width">
      <div class="market-menu">
        <button
          v-for="(menu, index) in marketMenu"
          :key="index"
          :class="{ active: marketType === menu.value }"
          @click="changeMenu(menu)"
        >
          {{ menu.name }}
        </button>
      </div>
      <div v-show="marketType === 'pairs'" class="table-main">
        <div class="pc-show">
          <a-spin :spinning="spinning">
            <table>
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Canister Id</th>
                  <th>Fee</th>
                  <th>Vol</th>
                  <th>Price</th>
                  <th>Score</th>
                  <th>Sponsored</th>
                  <th>
                    Ambassadors
                    <a-icon type="question-circle" @click="showQuestion" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="pair in pairs.slice((page - 1) * 10, page * 10)"
                  :key="pair[0].toString()"
                >
                  <td>
                    <div>
                      <router-link
                        :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}`"
                      >
                        <span>
                          {{ pair[1].pair.token0[1] }}/{{
                            pair[1].pair.token1[1]
                          }}
                        </span>
                      </router-link>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>
                        <a
                          style="color: #646e79 !important"
                          :href="`https://ic.house/swap/${pair[1].pair.canisterId.toString()}`"
                          target="_blank"
                          rel="nofollow noreferrer noopener"
                          >{{
                            pair[1].pair.canisterId.toString() | ellipsisAccount
                          }}</a
                        >
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span
                        >Maker: <span class="table-number-color">0%</span>,
                      </span>
                      <span
                        >Taker:
                        <span class="table-number-color">{{
                          pair[1].pair.feeRate | filterBuyFee
                        }}</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="pair-vol" v-if="pair[1].liquidity.length">
                      <div
                        v-if="
                          tokens[pair[1].pair.token1[0].toString()] &&
                          tokens[pair[1].pair.token1[0].toString()].decimals
                        "
                      >
                        <span class="table-number-color">{{
                          pair[1].liquidity[0].vol.value1
                            | bigintToFloat(
                              2,
                              tokens[pair[1].pair.token1[0].toString()].decimals
                            )
                            | formatNum
                        }}</span>
                        {{ pair[1].pair.token1[1] }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div
                      v-if="
                        pair[1].liquidity.length &&
                        tokens[pair[1].pair.token0[0].toString()] &&
                        tokens[pair[1].pair.token0[0].toString()].decimals &&
                        tokens[pair[1].pair.token1[0].toString()] &&
                        tokens[pair[1].pair.token1[0].toString()].decimals
                      "
                    >
                      <span class="table-number-color">{{
                        getPrice(
                          pair[1],
                          tokens[pair[1].pair.token0[0].toString()].decimals,
                          tokens[pair[1].pair.token1[0].toString()].decimals
                        )
                      }}</span>
                      {{ pair[1].pair.token1[1] }}
                    </div>
                  </td>
                  <td>
                    <span class="table-number-color">{{ pair[1].score }}</span>
                  </td>
                  <td>
                    <span class="table-number-color"
                      >({{ pair[1].listingReferrers.length }})&nbsp;</span
                    >
                    <span
                      v-if="pair[1].sponsored"
                      :class="{ ambassadors: pair[1].sponsored }"
                    >
                      <a-icon type="like" />
                    </span>
                    <a-icon v-else type="like" />
                  </td>
                  <td>
                    <router-link
                      :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}?type=referrer`"
                      >Referrer link</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </a-spin>
          <div class="pairs-page">
            <a-pagination
              v-if="total > 10"
              class="pagination"
              :default-page-size="10"
              :total="total"
              @change="pageChange"
            />
          </div>
        </div>
        <a-spin class="h5-show" :spinning="spinning">
          <div
            class="pair-main-scroll"
            v-infinite-scroll="handleInfiniteOnLoad"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
            :infinite-scroll-immediate-check="false"
          >
            <div
              class="pair-main"
              v-for="pair in pairs.slice(0, page * 10)"
              :key="pair[0].toString()"
            >
              <div class="pair-item">
                <span>Pair</span>
                <span class="margin-left-auto">
                  <router-link
                    :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}`"
                  >
                    <span>
                      {{ pair[1].pair.token0[1] }}/{{ pair[1].pair.token1[1] }}
                    </span>
                  </router-link>
                </span>
              </div>
              <div class="pair-item">
                <span>Canister Id</span>
                <span class="margin-left-auto">
                  <a
                    :href="`https://ic.house/swap/${pair[1].pair.canisterId.toString()}`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    >{{
                      pair[1].pair.canisterId.toString() | ellipsisAccount
                    }}</a
                  >
                </span>
              </div>
              <div class="pair-item">
                <span>Vol</span>
                <span
                  class="pair-vol margin-left-auto"
                  v-if="pair[1].liquidity.length"
                >
                  <div
                    v-if="
                      tokens[pair[1].pair.token1[0].toString()] &&
                      tokens[pair[1].pair.token1[0].toString()].decimals
                    "
                  >
                    {{
                      pair[1].liquidity[0].vol.value1
                        | bigintToFloat(
                          2,
                          tokens[pair[1].pair.token1[0].toString()].decimals
                        )
                        | formatNum
                    }}
                    {{ pair[1].pair.token1[1] }}
                  </div>
                </span>
              </div>
              <div class="pair-item">
                <span>Price</span>
                <span
                  class="margin-left-auto"
                  v-if="
                    pair[1].liquidity.length &&
                    tokens[pair[1].pair.token0[0].toString()] &&
                    tokens[pair[1].pair.token0[0].toString()].decimals &&
                    tokens[pair[1].pair.token1[0].toString()] &&
                    tokens[pair[1].pair.token1[0].toString()].decimals
                  "
                >
                  {{
                    getPrice(
                      pair[1],
                      tokens[pair[1].pair.token0[0].toString()].decimals,
                      tokens[pair[1].pair.token1[0].toString()].decimals
                    )
                  }}
                  {{ pair[1].pair.token1[1] }}
                </span>
              </div>
              <div class="pair-item">
                <span>Score</span>
                <span class="margin-left-auto">{{ pair[1].score }}</span>
              </div>
              <div class="pair-item">
                <span>Sponsored</span>
                <span class="margin-left-auto">
                  <span class="table-number-color"
                    >({{ pair[1].listingReferrers.length }})&nbsp;</span
                  >
                  <span
                    v-if="pair[1].sponsored"
                    :class="{ ambassadors: pair[1].sponsored }"
                  >
                    <a-icon type="like" />
                  </span>
                  <a-icon v-else type="like" />
                </span>
              </div>
              <div class="pair-item">
                <span
                  >Ambassadors&nbsp;<a-icon
                    type="question-circle"
                    @click="showQuestion"
                /></span>
                <span class="margin-left-auto">
                  <router-link
                    :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}?type=referrer`"
                    >Referrer link</router-link
                  >
                </span>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
      <div v-show="marketType === 'ambassadors'">
        <div class="ambassadors-main container-common-style">
          <p class="base-font-title ambassadors-main-title">
            About Trading Ambassador
          </p>
          <p class="base-font-title ambassadors-main-tip">
            Accounts with at least one trade automatically qualify as Trading
            Ambassador, with the following features.
          </p>
          <div class="ambassadors-main-info">
            <p>
              1. Promote the pair to others. You can go to the "Trading
              Ambassador" page of each trading pair to get an affiliate link,
              send it to your friends or post it on social media. Note: The
              affiliate link is different for each trading pair and the
              promotion is only valid for that trading pair.
            </p>
            <p>
              2. Each trading account (referee) can submit one trading
              ambassador (referrer) to the contract. An account with at least
              one trade can set up a trading ambassador as their referrer.
            </p>
            <p>
              3. The system will count the number of accounts and the volume of
              trading from your promotion. It is possible that there is a reward
              program for ambassadors that comes from the project side or Dex
              platform associated with the trading pair, as described on the
              "Trading Ambassadors" page of that trading pair. Note: Not every
              trading pair has a reward program.
            </p>
          </div>
        </div>
      </div>
      <!--<div v-show="marketType === 'PoolMarket'" class="referrers-main">
        <button @click="NFTWithdraw">NFTWithdraw</button>
      </div>-->
      <div
        v-show="getPrincipalId && marketType === 'PoolMarket'"
        class="referrers-main referrers-main-pool mt20"
      >
        <div class="makers-header">
          Makers
          <button
            type="button"
            class="primary margin-left-auto"
            @click="onBindMaker"
          >
            Become Maker
          </button>
        </div>
        <div class="pc-show">
          <a-spin :spinning="bindingMakersLoad" class="mt20">
            <table>
              <thead>
                <tr>
                  <th>NFTId</th>
                  <th>Pair</th>
                  <th>Account</th>
                  <th>Vol</th>
                  <th>Commission</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!bindingMakers.length">
                  <td colspan="6" style="text-align: center">No Makers</td>
                </tr>
                <tr v-for="(item, index) in bindingMakers" :key="index">
                  <td>
                    <copy-account
                      :account="item[0]"
                      copyText="NFTId"
                    ></copy-account>
                  </td>
                  <td>
                    <router-link
                      :to="`/icdex/${
                        pairToSymbol[item[1].toString()].pair.token0[1]
                      }/${pairToSymbol[item[1].toString()].pair.token1[1]}`"
                    >
                      {{ pairToSymbol[item[1].toString()].pair.token0[1] }}/{{
                        pairToSymbol[item[1].toString()].pair.token1[1]
                      }}
                    </router-link>
                  </td>
                  <td>
                    <copy-account
                      :account="arrayToString(item[2])"
                      copyText="Account"
                    ></copy-account>
                  </td>
                  <td>
                    <span
                      v-if="
                        makerInfo[item[1].toString()] &&
                        makerInfo[item[1].toString()][arrayToString(item[2])] &&
                        tokens[
                          pairToSymbol[
                            item[1].toString()
                          ].pair.token0[0].toString()
                        ] &&
                        tokens[
                          pairToSymbol[
                            item[1].toString()
                          ].pair.token1[0].toString()
                        ]
                      "
                      class="stats-info"
                    >
                      <span>
                        {{
                          makerInfo[item[1].toString()][arrayToString(item[2])]
                            .vol.value0
                            | bigintToFloat(
                              8,
                              tokens[
                                pairToSymbol[
                                  item[1].toString()
                                ].pair.token0[0].toString()
                              ].decimals
                            )
                            | formatNum
                        }}
                        {{ pairToSymbol[item[1].toString()].pair.token0[1] }}
                      </span>
                      <span>
                        {{
                          makerInfo[item[1].toString()][arrayToString(item[2])]
                            .vol.value1
                            | bigintToFloat(
                              8,
                              tokens[
                                pairToSymbol[
                                  item[1].toString()
                                ].pair.token1[0].toString()
                              ].decimals
                            )
                            | formatNum
                        }}
                        {{ pairToSymbol[item[1].toString()].pair.token1[1] }}
                      </span>
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <span
                      v-if="
                        makerInfo[item[1].toString()] &&
                        makerInfo[item[1].toString()][arrayToString(item[2])] &&
                        tokens[
                          pairToSymbol[
                            item[1].toString()
                          ].pair.token0[0].toString()
                        ] &&
                        tokens[
                          pairToSymbol[
                            item[1].toString()
                          ].pair.token1[0].toString()
                        ]
                      "
                      class="stats-info"
                    >
                      <span>
                        {{
                          makerInfo[item[1].toString()][arrayToString(item[2])]
                            .commission.value0
                            | bigintToFloat(
                              8,
                              tokens[
                                pairToSymbol[
                                  item[1].toString()
                                ].pair.token0[0].toString()
                              ].decimals
                            )
                            | formatNum
                        }}
                        {{ pairToSymbol[item[1].toString()].pair.token0[1] }}
                      </span>
                      <span>
                        {{
                          makerInfo[item[1].toString()][arrayToString(item[2])]
                            .commission.value1
                            | bigintToFloat(
                              8,
                              tokens[
                                pairToSymbol[
                                  item[1].toString()
                                ].pair.token1[0].toString()
                              ].decimals
                            )
                            | formatNum
                        }}
                        {{ pairToSymbol[item[1].toString()].pair.token1[1] }}
                      </span>
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <span class="main-color pointer" @click="onUnbind(item)"
                      >Unbind</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </a-spin>
        </div>
        <a-spin class="h5-show" :spinning="bindingMakersLoad">
          <div
            class="pair-main-scroll"
            v-infinite-scroll="handleInfiniteOnLoadMakers"
            :infinite-scroll-disabled="busyMakers"
            :infinite-scroll-distance="10"
            :infinite-scroll-immediate-check="false"
          >
            <div
              class="pair-main"
              v-for="(item, index) in bindingMakers.slice(0, pageMakers * 10)"
              :key="index"
            >
              <div class="pair-item">
                <span
                  class="main-color pointer margin-left-auto"
                  @click="onUnbind(item)"
                  >Unbind</span
                >
              </div>
              <div class="pair-item">
                <span>NFTId</span>
                <span class="margin-left-auto">
                  <copy-account
                    :account="item[0]"
                    copyText="NFTId"
                  ></copy-account>
                </span>
              </div>
              <div class="pair-item">
                <span>Pair</span>
                <span class="margin-left-auto">
                  <router-link
                    :to="`/icdex/${
                      pairToSymbol[item[1].toString()].pair.token0[1]
                    }/${pairToSymbol[item[1].toString()].pair.token1[1]}`"
                  >
                    {{ pairToSymbol[item[1].toString()].pair.token0[1] }}/{{
                      pairToSymbol[item[1].toString()].pair.token1[1]
                    }}
                  </router-link>
                </span>
              </div>
              <div class="pair-item">
                <span>Account</span>
                <span class="margin-left-auto">
                  <copy-account
                    :account="arrayToString(item[2])"
                    copyText="Account"
                  ></copy-account>
                </span>
              </div>
              <div class="pair-item pair-item-vol">
                <span>Vol</span>
                <span
                  v-if="
                    makerInfo[item[1].toString()] &&
                    makerInfo[item[1].toString()][arrayToString(item[2])] &&
                    tokens[
                      pairToSymbol[item[1].toString()].pair.token0[0].toString()
                    ] &&
                    tokens[
                      pairToSymbol[item[1].toString()].pair.token1[0].toString()
                    ]
                  "
                  class="stats-info margin-left-auto"
                >
                  <span>
                    {{
                      makerInfo[item[1].toString()][arrayToString(item[2])].vol
                        .value0
                        | bigintToFloat(
                          8,
                          tokens[
                            pairToSymbol[
                              item[1].toString()
                            ].pair.token0[0].toString()
                          ].decimals
                        )
                        | formatNum
                    }}
                    {{ pairToSymbol[item[1].toString()].pair.token0[1] }}
                  </span>
                  <span>
                    {{
                      makerInfo[item[1].toString()][arrayToString(item[2])].vol
                        .value1
                        | bigintToFloat(
                          8,
                          tokens[
                            pairToSymbol[
                              item[1].toString()
                            ].pair.token1[0].toString()
                          ].decimals
                        )
                        | formatNum
                    }}
                    {{ pairToSymbol[item[1].toString()].pair.token1[1] }}
                  </span>
                </span>
                <span v-else class="margin-left-auto">-</span>
              </div>
              <div class="pair-item pair-item-vol">
                <span>Commission</span>
                <span class="margin-left-auto">
                  <span
                    v-if="
                      makerInfo[item[1].toString()] &&
                      makerInfo[item[1].toString()][arrayToString(item[2])] &&
                      tokens[
                        pairToSymbol[
                          item[1].toString()
                        ].pair.token0[0].toString()
                      ] &&
                      tokens[
                        pairToSymbol[
                          item[1].toString()
                        ].pair.token1[0].toString()
                      ]
                    "
                    class="stats-info"
                  >
                    <span>
                      {{
                        makerInfo[item[1].toString()][arrayToString(item[2])]
                          .commission.value0
                          | bigintToFloat(
                            8,
                            tokens[
                              pairToSymbol[
                                item[1].toString()
                              ].pair.token0[0].toString()
                            ].decimals
                          )
                          | formatNum
                      }}
                      {{ pairToSymbol[item[1].toString()].pair.token0[1] }}
                    </span>
                    <span>
                      {{
                        makerInfo[item[1].toString()][arrayToString(item[2])]
                          .commission.value1
                          | bigintToFloat(
                            8,
                            tokens[
                              pairToSymbol[
                                item[1].toString()
                              ].pair.token1[0].toString()
                            ].decimals
                          )
                          | formatNum
                      }}
                      {{ pairToSymbol[item[1].toString()].pair.token1[1] }}
                    </span>
                  </span>
                  <span v-else>-</span>
                </span>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
      <div v-show="!getPrincipalId && marketType === 'PoolMarket'">
        <div class="wallet-empty container-width">
          <img src="@/assets/img/empty.png" alt="" />
          <p>Connect wallet to view</p>
          <button type="button" class="default" @click="connectWallet">
            Connect Wallet
          </button>
        </div>
      </div>
      <div v-show="marketType === 'referrers'" class="referrers-main">
        <div>
          <div v-if="listingReferrer" class="referrer-nft">
            <a-steps
              class="trading-step-main"
              :current="currentStep"
              :direction="isH5 ? 'vertical' : 'horizontal'"
            >
              <a-step class="trading-step1-description">
                <template slot="title">Hold Uranus Card NFT</template>
                <span slot="description">
                  Transfer your Uranus Card NFT to your account
                  {{ getPrincipalId | ellipsisAccount(8) }}
                  <span
                    v-show="currentStep === 0 && !listingReferrer[0] && !nft"
                    >(You have no Uranus Card).
                  </span>
                </span>
              </a-step>
              <a-step class="trading-step1-description">
                <template slot="title">Register</template>
                <span slot="description">
                  <button
                    :disabled="currentStep !== 1"
                    type="button"
                    class="primary step-button"
                    @click="onRegister"
                  >
                    Register
                  </button>
                </span>
              </a-step>
              <a-step class="trading-step1-description">
                <template slot="title"
                  >Become a Verified Listing Referrer</template
                >
                <span slot="description">
                  Please join
                  <span v-show="listingReferrer[1] || currentStep !== 2"
                    >Discord</span
                  >
                  <a
                    v-show="!listingReferrer[1] && currentStep === 2"
                    href="https://discord.gg/FQZFGGq7zv"
                    target="_blank"
                    >Discord</a
                  >
                  to contact a member of the team.
                </span>
              </a-step>
            </a-steps>
            <!--<div class="nft-info">
							<img :src="getExtInfo(nft[2]).thumb" alt="" />
							<div class="ext-info">{{ getExtInfo(nft[2]).name }}</div>
						</div>
						<div>
							<button type="button" class="primary">Register</button>
							<span>Become a Verified Listing Referrer</span>
						</div>-->
          </div>
          <div
            v-if="listingReferrer && listingReferrer[0] && listingReferrer[1]"
            class="proposed-list"
          >
            <div class="proposed-list-header">
              <span class="base-color-w">List of pairs proposed by me</span>
              <button type="button" class="primary margin-left-auto">
                Propose
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Canister Id</th>
                  <th>Fee</th>
                  <th>Vol</th>
                  <th>Price</th>
                  <th>Score</th>
                  <th>Sponsored</th>
                  <th>Ambassadors</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pair in pairs" :key="pair[0].toString()">
                  <td>
                    <div>
                      <router-link
                        :to="`/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}`"
                      >
                        <span>
                          {{ pair[1].pair.token0[1] }}/{{
                            pair[1].pair.token1[1]
                          }}
                        </span>
                      </router-link>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>
                        <a
                          :href="`https://ic.house/swap/${pair[1].pair.canisterId.toString()}`"
                          target="_blank"
                          rel="nofollow noreferrer noopener"
                          >{{ pair[1].pair.canisterId.toString() }}</a
                        >
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{{ pair[1].pair.feeRate * 100 }}%</span>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td>{{ pair[1].score }}</td>
                  <td>
                    ({{ pair[1].listingReferrers.length }})
                    <span
                      v-if="pair[1].sponsored"
                      :class="{ ambassadors: pair[1].sponsored }"
                    >
                      <a-icon type="like" />
                    </span>
                    <a-icon v-else type="like" />
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model="ambassadorsvisible"
      width="650px"
      title="About Trading Ambassador"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <p>
        An account who has completed at least one trade automatically qualify as
        a trading ambassador and can promote the pair by sharing the referral
        link.
      </p>
      <p class="ambassadors-visible-title">
        How to promote the pair to others.
      </p>
      <p>
        You can go to the "Trading Ambassador" page of each trading pair to get
        a referral link, send it to your friends or post it on social media.
      </p>
      <p>Note:</p>
      <p>
        (1) Each promotion is only for one trading pair, the referral link is
        exclusive to the trading pair.
      </p>
      <p>
        (2) Each trading account (referee) can submit one trading ambassador
        (referrer) to the contract. A referee must complete at least one trade
        for the setting to take effect.
      </p>
      <p class="ambassadors-visible-title">
        Benefits of being a trading ambassador.
      </p>
      <p>
        The pair will count the number of accounts and the volume of trading
        from your promotion. It is possible that there is a reward program for
        ambassadors that comes from the project's funder or Dex platform, as
        described on the "Trading Ambassadors" page of that trading pair. Note:
        Not every trading pair has a reward program.
      </p>
      <button
        type="button"
        class="primary ambassadors-visible-button"
        @click="ambassadorsvisible = false"
      >
        Confirm
      </button>
    </a-modal>
    <nft-balance
      ref="nftBalance"
      :nft-balance="nftBalance"
      :nfts="nfts"
      :tokens="tokens"
      :pairs-maker="pairsMaker"
      :is-become-maker="isBecomeMaker"
      @depositSuccess="depositSuccess"
      @bindSuccess="bindSuccess"
      @NFTWithdrawSuccess="NFTWithdrawSuccess"
    ></nft-balance>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MarketMenu, Pool } from '@/views/home/ICDex/model';
import {
  PairTrie,
  PairTrieResponse,
  SwapTokenInfo
} from '@/ic/ICSwapRouter/model';
import { Principal } from '@dfinity/principal';
import { TokenExt, TokensExt } from '@/ic/nft/model';
import { NftService } from '@/ic/nft/Service';
import { namespace } from 'vuex-class';
import { Menu } from '@/components/menu/model';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { AccountId, TokenInfo } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import ApproveNft from '@/components/approveNFT/Index.vue';
import { toHexString } from '@/ic/converter';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';
import { NFT } from '@/ic/ICDexRouter/model';
import { makerPoolService } from '@/ic/makerPool/makerPoolService';
import NftBalance from '@/views/home/ICDex/components/NFTBalance.vue';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { MakerInfo, TrieList_3 } from '@/ic/ICDex/model';
import { connectIcx } from '@/ic/connectIcx';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';

const commonModule = namespace('common');
const canMakerCreateNft = ['NEPTUNE', 'URANUS', 'SATURN'];
const vipMakerNFT = ['NEPTUNE'];

@Component({
  name: 'Market',
  components: {
    AccountInfo,
    ApproveNft,
    NftBalance
  },
  filters: {
    filterFee(val: string): string {
      if (val) {
        return new BigNumber(val).times(100).toString(10) + '%';
      }
      return '';
    },
    filterBuyFee(val: string): string {
      if (val || Number(val) === 0) {
        return (
          new BigNumber(val).times(100).decimalPlaces(4).toString(10) + '%'
        );
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private ICDexRouterService: ICDexRouterService;
  private makerPoolService: makerPoolService;
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  private NftService: NftService = null;
  private ICDexService: ICDexService = null;
  private marketMenu: Array<MarketMenu> = [];
  private marketType = 'pairs';
  private pairs: Array<PairTrie> = [];
  private pairToSymbol: { [key: string]: PairTrieResponse } = {};
  private total = 0;
  private page = 1;
  private pageMakers = 1;
  private pairsOwner: Array<PairTrie> = [];
  private listingReferrer: [boolean, boolean] = null;
  private nft: TokenExt = null;
  private currentStep = -1;
  private isH5 = false;
  private ambassadorsvisible = false;
  private menuList: Menu[] = [
    {
      value: 'Trade',
      path: '/ICDex'
    },
    {
      value: 'Market',
      path: '/ICDex/market'
    },
    {
      value: 'Pool',
      path: '/ICDex/pools'
    },
    {
      value: 'Competitions',
      path: '/ICDex/competitions'
    },
    {
      value: 'Mining',
      path: '/icl/tradingMining'
    }
  ];
  private tokens: { [key: string]: TokenInfo } = {};
  private busy = true;
  private busyMakers = true;
  private loadMore = true;
  private loadMoreMakers = true;
  private spinning = false;
  private tokensExtPool: TokensExt = [];
  private nfts: TokensExt = [];
  private isBecomeMaker = false;
  private becomeMakerIndex: number = null;
  private isBecomeMakerHold = false;
  private nftBalance: Array<NFT> = [];
  private nftBalancePool: Array<NFT> = [];
  private nftBalanceVip: Array<NFT> = [];
  private bindingMakers: Array<[string, Principal, AccountId]> = [];
  private bindingMakersLoad = false;
  private makerInfo: { [key: string]: { [key: string]: MakerInfo } } = {};
  private pairsMaker: Array<PairTrie> = [];

  created(): void {
    this.marketMenu = [
      {
        name: 'Trading Pairs',
        value: 'pairs'
      },
      {
        name: 'Trading Ambassadors',
        value: 'ambassadors'
      },
      {
        name: 'Market Maker',
        value: 'PoolMarket'
      }
      // ,
      // {
      //   name: 'Listing Referrers',
      //   value: 'referrers'
      // }
      // ,
      // {
      //   name: 'UnListing Referrers',
      //   value: 'referrers'
      // }
    ];
    this.ICDexRouterService = new ICDexRouterService();
    this.makerPoolService = new makerPoolService();
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.NftService = new NftService();
    this.ICDexService = new ICDexService();
    if (this.getPrincipalId) {
      this.getTokensExt();
      this.NFTBalance();
    }
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.getPairs();
  }
  private async connectWallet(): Promise<void> {
    if ((window as any).icx) {
      const icxCanisterIds: Array<string> =
        JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
      const isConnect = await connectIcx(icxCanisterIds);
      if (isConnect) {
        await this.getTokensExt();
        await this.NFTBalance();
        this.getBindingMakers();
      }
    } else {
      await this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    }
  }
  private NFTWithdrawSuccess(): void {
    this.getTokensExt();
    this.NFTBalance();
    this.getBindingMakers();
  }
  private depositSuccess(): void {
    this.getTokensExt();
    this.NFTBalance();
  }
  private async bindSuccess(pair: string, pool: string): Promise<void> {
    this.getBindingMakers();
  }
  private onBindMaker(
    pair?: string,
    pool?: string,
    index?: number,
    isHold = false
  ): void {
    this.isBecomeMaker = true;
    if (pair) {
      this.becomeMakerIndex = index;
      this.isBecomeMakerHold = isHold;
    } else {
      this.becomeMakerIndex = null;
      this.isBecomeMakerHold = false;
    }
    (this.$refs.nftBalance as any).bindMMPoolInit(pair, pool);
  }
  private showQuestion(): void {
    this.ambassadorsvisible = true;
  }
  private async onRegister(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      await this.ICSwapRouterFiduciaryService.setListingReferrerByNft(
        Principal.fromText(this.getPrincipalId),
        'icdex',
        this.nft[0].toString(10)
      );
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private changeMenu(menu: MarketMenu): void {
    this.marketType = menu.value;
    if (menu.value === 'pairs') {
      this.getPairs();
    }
    if (menu.value === 'referrers') {
      this.getListingReferrer();
    }
    if (menu.value === 'PoolMarket') {
      this.getBindingMakers();
    }
  }
  private async onMakerList(pairs: Array<string>): Promise<void> {
    const promiseAll = [];
    pairs.forEach((pair) => {
      promiseAll.push(this.getMakerList(pair));
    });
    const res: Array<{ pairId: string; makerList: TrieList_3 }> =
      await Promise.all(promiseAll);
    console.log(res);
    res.forEach((item) => {
      this.makerInfo[item.pairId] = {};
      item.makerList.data.forEach((data) => {
        const address = toHexString(new Uint8Array(data[0]));
        this.makerInfo[item.pairId][address] = data[1];
      });
    });
    this.$forceUpdate();
    console.log(this.makerInfo);
  }
  private async getMakerList(
    pair: string
  ): Promise<{ pairId: string; makerList: TrieList_3 }> {
    return await this.ICDexService.makerList(pair);
  }
  private async getBindingMakers(): Promise<void> {
    const makers = [];
    const pairs = [];
    this.bindingMakersLoad = true;
    for (let i = 0; i < this.nftBalanceVip.length; i++) {
      const NFTId = this.nftBalanceVip[i][1];
      const res = await this.ICDexRouterService.NFTBindingMakers(NFTId);
      if (res && res.length) {
        res.forEach((maker) => {
          if (!pairs.includes(maker[0].toString())) {
            pairs.push(maker[0].toString());
          }
          makers.push([NFTId, ...maker]);
        });
      }
    }
    console.log(makers);
    console.log(pairs);
    this.onMakerList(pairs);
    this.bindingMakers = makers;
    this.bindingMakersLoad = false;
  }
  private async onUnbind(item: [string, Principal, AccountId]): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const res = await this.ICDexRouterService.NFTUnbindMaker(
      item[0],
      item[1],
      item[2]
    );
    if (res) {
      this.$message.success('Success');
    } else {
      this.$message.error('Error');
    }
    loading.close();
    this.getBindingMakers();
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
      if (tokensExt && tokensExt.length) {
        console.log(tokensExt);
        for (let i = 0; i < tokensExt.length; i++) {
          const info = this.getExtInfo(tokensExt[i][2]);
          if (info.attributes && info.attributes.length) {
            info.attributes.forEach((item) => {
              console.log(item);
              if (
                item.trait_type.trim() === 'listing referrer' &&
                item.value.trim() === 'Yes'
              ) {
                this.nft = tokensExt[i];
              }
            });
          }
          if (this.nft) {
            break;
          }
        }
        this.tokensExtPool = tokensExt.filter((item) => {
          const info = this.getExtInfo(item[2]);
          let flag = false;
          console.log(info);
          if (info.name) {
            // 'NEPTUNE', 'URANUS', 'SATURN'
            if (
              info.name.includes('NEPTUNE') ||
              info.name.includes('URANUS') ||
              info.name.includes('SATURN')
            ) {
              flag = true;
            }
          }
          return flag;
        });
        console.log(this.tokensExtPool);
      } else {
        //
      }
    } catch (e) {
      console.error(e);
    }
  }
  private async NFTBalance(): Promise<void> {
    const principal = localStorage.getItem('principal');
    const res = await this.ICDexRouterService.NFTBalance(principal);
    this.nftBalance = res;
    this.nftBalancePool = res.filter((item) => {
      const type = Object.keys(item[3])[0];
      return canMakerCreateNft.includes(type);
    });
    this.nftBalanceVip = res.filter((item) => {
      const type = Object.keys(item[3])[0];
      return vipMakerNFT.includes(type);
    });
    console.log(this.nftBalancePool);
    console.log(this.nftBalanceVip);
  }
  private getExtInfo(val: Array<Array<number>>): any {
    if (val && val.length) {
      return JSON.parse(Buffer.from(val[0]).toString());
    }
    return {};
  }
  private async getListingReferrer(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      this.listingReferrer =
        await this.ICSwapRouterFiduciaryService.listingReferrer(
          Principal.fromText(principal)
        );
      console.log(this.listingReferrer);
      if (!this.listingReferrer[0]) {
        await this.getTokensExt();
        if (!this.nft) {
          this.currentStep = 0;
        } else {
          this.currentStep = 1;
        }
      }
      if (this.listingReferrer[0] && !this.listingReferrer[1]) {
        this.currentStep = 2;
      }
      if (this.listingReferrer[0] && this.listingReferrer[1]) {
        this.getPairsOwner();
      }
    }
  }
  private async getPairsOwner(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.getPairs2(
      ['icdex'],
      [Principal.fromText(this.getPrincipalId)]
    );
    console.log(res);
    if (res && res.data && res.data.length) {
      this.pairsOwner = res.data.sort((a, b) => {
        return Number(a[1].score) - Number(b[1].score);
      });
    } else {
      this.pairsOwner = [];
    }
  }
  private async getPairs(): Promise<void> {
    this.busy = true;
    this.spinning = true;
    const res = await this.ICSwapRouterFiduciaryService.getPairs2(['icdex']);
    console.log(res);
    if (res && res.data && res.data.length) {
      this.pairs = res.data.sort((a, b) => {
        return Number(b[1].score) - Number(a[1].score);
      });
      this.pairsMaker = res.data.sort((a, b) => {
        return a[1].pair.token0[1].localeCompare(b[1].pair.token0[1]);
      });
      res.data.forEach((item) => {
        this.pairToSymbol[item[0].toString()] = item[1];
      });
      this.total = this.pairs.length;
      this.getTokenDecimals();
    } else {
      this.pairs = [];
      this.pairsMaker = [];
    }
    this.spinning = false;
    this.busy = false;
  }
  private pageChange(page: number): void {
    this.page = page;
    this.getTokenDecimals();
  }
  private async getTokenDecimals(): Promise<void> {
    const pairs = this.pairs.slice((this.page - 1) * 10, this.page * 10);
    const promiseValue = [];
    pairs.forEach((pair: PairTrie) => {
      if (
        !this.tokens[pair[1].pair.token0[0].toString()] ||
        (this.tokens[pair[1].pair.token0[0].toString()] &&
          !this.tokens[pair[1].pair.token0[0].toString()].decimals &&
          this.tokens[pair[1].pair.token0[0].toString()].decimals !== 0)
      ) {
        promiseValue.push(this.getDecimals(pair[1].pair.token0));
      }
      if (
        !this.tokens[pair[1].pair.token1[0].toString()] ||
        (this.tokens[pair[1].pair.token1[0].toString()] &&
          !this.tokens[pair[1].pair.token1[0].toString()].decimals &&
          this.tokens[pair[1].pair.token1[0].toString()].decimals !== 0)
      ) {
        promiseValue.push(this.getDecimals(pair[1].pair.token1));
      }
    });
    if (promiseValue.length > 0) {
      await Promise.all(promiseValue);
      this.$forceUpdate();
    }
  }
  private async getDecimals(token: SwapTokenInfo): Promise<void> {
    const DRC20Token = new DRC20TokenService();
    const std = Object.keys(token[2])[0];
    if (!this.tokens[token[0].toString()]) {
      this.tokens[token[0].toString()] = { decimals: null };
    }
    if (std && std.toLocaleLowerCase() === 'cycles') {
      this.tokens[token[0].toString()].decimals = 12;
    }
    if (std && std.toLocaleLowerCase() === 'icp') {
      this.tokens[token[0].toString()].decimals = 8;
    }
    if (std && std.toLocaleLowerCase() === 'drc20') {
      this.tokens[token[0].toString()].decimals = await DRC20Token.decimals(
        token[0].toString()
      );
    }
    if (
      std &&
      (std.toLocaleLowerCase() === 'icrc1' ||
        std.toLocaleLowerCase() === 'icrc2')
    ) {
      this.tokens[token[0].toString()].decimals = await DRC20Token.icrcDecimals(
        token[0].toString()
      );
    }
    if (std && std.toLocaleLowerCase() === 'dip20') {
      const info = await DRC20Token.getMetadata(token[0].toString());
      this.tokens[token[0].toString()].decimals = info.decimals;
    }
  }
  private getPrice(pair: PairTrieResponse): string {
    if (pair.liquidity.length) {
      const token0 = pair.pair.token0[0].toString();
      const token1 = pair.pair.token1[0].toString();
      return new BigNumber(pair.liquidity[0].price.toString(10))
        .div(10 ** this.tokens[token1].decimals)
        .div(
          new BigNumber(pair.liquidity[0].unitSize.toString(10)).div(
            10 ** this.tokens[token0].decimals
          )
        )
        .decimalPlaces(this.tokens[token0].decimals)
        .toString(10);
    }
    return '';
  }
  private handleInfiniteOnLoadMakers(): void {
    const width = document.documentElement.clientWidth;
    if (width > 768) {
      return;
    }
    if (!this.busyMakers) {
      console.log('handleInfiniteOnLoadMakers');
      this.busyMakers = true;
      if (this.pageMakers * 10 < this.bindingMakers.length) {
        setTimeout(() => {
          this.pageMakers++;
          this.busyMakers = false;
        }, 100);
      } else {
        this.busyMakers = false;
        this.loadMoreMakers = false;
      }
    }
  }
  private handleInfiniteOnLoad(): void {
    const width = document.documentElement.clientWidth;
    if (width > 768) {
      return;
    }
    if (!this.busy) {
      console.log('handleInfiniteOnLoad');
      this.busy = true;
      if (this.page * 10 < this.pairs.length) {
        setTimeout(() => {
          this.page++;
          this.busy = false;
        }, 100);
      } else {
        this.busy = false;
        this.loadMore = false;
      }
    }
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
}
</script>

<style scoped lang="scss">
.makers-header {
  display: flex;
  align-items: center;
}
.ambassadors-visible-button {
  margin-top: 20px;
  margin-left: auto;
}
.ambassadors-visible-title {
  margin-top: 20px;
  color: #fff;
  font-size: 18px;
}
.ambassadors {
  i {
    color: #21c77d;
  }
}
.ambassadors-main {
  padding: 50px;
  line-height: 1.2;
  .ambassadors-main-title {
    font-size: 16px;
  }
  .ambassadors-main-tip {
    margin: 20px 0 10px;
  }
  .ambassadors-main-info {
    padding-left: 1em;
  }
}
.market-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 480px;
  height: 60px;
  margin: 60px auto 40px;
  background: #232730;
  border-radius: 30px;
  button {
    width: 140px;
    height: 40px;
    border-radius: 20px;
    font-size: 16px;
    background: #232730;
    transition: all 0.3s;
    &:nth-child(2) {
      width: 190px;
    }
    &.active {
      background: #51b7c3;
      border-color: #51b7c3;
      color: #ffffff;
    }
  }
}
.table-main,
.referrers-main {
  background: #131920;
  border: 1px solid #131920;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 20px 30px 40px 30px;
  a {
    color: #166a89;
  }
  table {
    min-height: 200px;
  }
}
.pools-page {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.table-main {
  table {
    td {
      line-height: 1.2;
      color: #646e79 !important;
      .table-number-color {
        color: #8c98a5 !important;
      }
    }
  }
}
.referrers-main {
  color: #adb3c4;
}
.referrer-nft {
  display: flex;
}
.nft-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 165px;
  img {
    width: 165px;
    height: 165px;
    object-fit: contain;
  }
  .ext-info {
    font-size: 12px;
    padding-top: 5px;
  }
}
.proposed-list {
  margin-top: 30px;
  padding-top: 10px;
  border-top: 1px solid #1b242e;
}
.proposed-list-header {
  display: flex;
  align-items: center;
}
tbody {
  tr {
    border-bottom: 1px solid #212b35;
  }
}
.trading-step-main {
  margin-top: 30px;
  .ant-steps-item {
    height: 160px;
  }
  .step-button {
    position: absolute;
    bottom: 0;
  }
  .trading-step-tokens {
    position: absolute;
    bottom: 0;
    height: 30px;
    line-height: 30px;
  }
  ::v-deep .ant-steps-item-title {
    color: #b4bacd !important;
  }

  ::v-deep .ant-steps-item-process .ant-steps-item-title {
    color: #e7eaf1 !important;
  }

  ::v-deep .ant-steps-item-finish .ant-steps-item-description {
    color: #777d90 !important;
  }

  ::v-deep .ant-steps-item-process .ant-steps-item-description {
    color: #e7eaf1 !important;
  }

  ::v-deep .ant-steps-item-wait .ant-steps-item-description {
    color: #777d90 !important;
  }

  ::v-deep .ant-steps-item-icon {
    width: 30px;
    height: 30px;
    line-height: 30px;
    background: transparent;
  }

  ::v-deep .ant-steps-item-finish .ant-steps-item-icon {
    border-color: #21c77d;
    background: #21c77d;
  }

  ::v-deep .ant-steps-item-process .ant-steps-item-icon {
    border-color: #21c77d;
    background: #21c77d;
  }

  ::v-deep .ant-steps-item-finish .ant-steps-item-title::after {
    background: #21c77d;
  }
  ::v-deep .ant-steps-item-finish .ant-steps-item-tail::after {
    background: #21c77d;
  }

  ::v-deep .ant-steps-icon {
    color: #fff;
  }

  ::v-deep .ant-steps-item-wait .ant-steps-item-icon {
    border-color: #777d90;
  }
}
.home-header {
  top: 14px;
}
.pairs-page {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}
.pair-vol {
  line-height: 1.5;
}
.pair-item {
  display: flex;
  line-height: 2;
  span {
    &:last-child {
      text-align: right;
    }
  }
}
.market-main {
  margin-top: 100px;
}

.stats-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.pc-show {
  display: block;
}
.h5-show {
  display: none;
}
@media screen and (max-width: 768px) {
  .table-main,
  .referrers-main-pool {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    color: #adb3c4;
    padding: 0 0 30px 0;
  }
  .makers-header {
    padding: 0 10px 10px;
  }
  .pair-main-scroll {
    max-height: calc(100vh - 120px);
    min-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 10px;
  }
  .pair-main {
    margin-bottom: 10px;
    background: #131920;
    border: 1px solid #131920;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 10px;
  }
  .pair-item-vol {
    margin-top: 10px;
  }
  .pc-show {
    display: none;
  }
  .h5-show {
    display: block;
  }
  .home-header {
    ul {
      display: none;
    }
  }
  .market-main {
    margin-top: 50px;
    padding: 0;
  }
  .market-menu {
    width: 100%;
    padding: 0 10px;
    button {
      font-size: 14px;
    }
  }
}
</style>
