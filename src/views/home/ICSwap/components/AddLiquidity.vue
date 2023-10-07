<template>
  <div class="add-liquidity-main ic-swap-main">
    <div class="add-liquidity-item exchange-swap-item">
      <div class="add-liquidity-item-top swap-item-top">
        <div class="ic-swap-item-top-left">
          <div
            class="swap-item-top-left"
            v-if="
              currentPool &&
              currentPool.length &&
              tokenSwapFrom &&
              tokens &&
              tokens[tokenSwapFrom[0].toString()]
            "
          >
            <span class="img-content">
              <img
                v-if="tokens[tokenSwapFrom[0].toString()].logo"
                :src="tokens[tokenSwapFrom[0].toString()].logo"
                alt=""
              />
              <span v-else class="empty-pic"></span>
            </span>
            <span class="swap-item-top-left-name">{{ tokenSwapFrom[1] }}</span>
          </div>
          <div v-else @click="showTokenList('from')">
            <div
              class="swap-item-top-left"
              v-if="
                tokenSwapFrom && tokens && tokens[tokenSwapFrom[0].toString()]
              "
            >
              <span class="img-content">
                <img
                  v-if="tokens[tokenSwapFrom[0].toString()].logo"
                  :src="tokens[tokenSwapFrom[0].toString()].logo"
                  alt=""
                />
                <span v-else class="empty-pic"></span>
              </span>
              <span class="swap-item-top-left-name">{{ tokenSwapFrom[1] }}</span
              ><a-icon type="down" />
            </div>
            <div class="swap-item-top-left" v-else>
              <span class="swap-item-top-left-name">Select a token</span
              ><a-icon type="down" />
            </div>
          </div>
          <a-select
            v-if="
              tokenSwapFrom &&
              tokenSwapFrom[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'
            "
            v-model="cyclesCanister"
            @change="cyclesChange"
            class="input-cycles-select"
            placeholder="select cycles wallet Canister-id"
            notFoundContent="Not Found"
            option-label-prop="label"
            :filterOption="false"
          >
            <a-select-option
              v-for="wallet in wallets"
              :key="wallet.walletId.toString()"
              :label="wallet.walletId.toString()"
              >{{ wallet.walletId.toString() }}
              <a-icon v-if="wallet.isDefault" type="check-circle" />
            </a-select-option>
          </a-select>
        </div>
        <div
          class="swap-item-top-right"
          :class="{
            'swap-item-top-right-cycles':
              tokenSwapFrom &&
              tokenSwapFrom[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'
          }"
        >
          <a-input-group
            class="swap-item-group"
            :class="{ disabled: !dexInfo }"
            compact
            v-if="tokenSwapFrom && tokenSwapFrom[3]"
          >
            <a-input
              :disabled="!dexInfo"
              :key="tokenSwapFrom[3].decimals"
              class="input-icp-suffix text-right"
              autocomplete="off"
              type="text"
              v-model="swapFromAmount"
              v-only-float="tokenSwapFrom[3].decimals"
              placeholder="0.0"
              @input="swapFromAmountChange"
            /><span class="suffix">{{ tokenSwapFrom[1] }}</span>
          </a-input-group>
          <a-input
            v-else
            class="input-icp-suffix text-right"
            autocomplete="off"
            type="text"
            disabled
            placeholder="0.0"
          />
        </div>
      </div>
      <div class="add-liquidity-item-bottom swap-item-bottom">
        <div v-if="tokenSwapFrom && tokenSwapFrom[3]">
          <div>
            Balance:
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{
                  tokensBalance[tokenSwapFrom[0].toString()]
                    | bigintToFloat(
                      tokenSwapFrom[3].decimals,
                      tokenSwapFrom[3].decimals
                    )
                    | formatNum
                }}</span>
              </template>
              {{
                tokensBalance[tokenSwapFrom[0].toString()]
                  | bigintToFloat(4, tokenSwapFrom[3].decimals)
                  | formatAmount(4)
              }}
            </a-tooltip>
            {{ tokenSwapFrom[1] }}
            <a-icon
              v-show="!tokensBalanceLoading[tokenSwapFrom[0].toString()]"
              type="reload"
              @click="
                getTokenBalance(tokenSwapFrom[2], tokenSwapFrom[0].toString())
              "
            />
            <a-icon
              v-show="tokensBalanceLoading[tokenSwapFrom[0].toString()]"
              type="loading"
              class="reload-icon"
            />
          </div>
          <div class="pair-deposit">
            <div
              v-if="
                swapId && dexInfo && swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'
              "
              style="margin-top: 10px; font-size: 12px"
            >
              Balance(pair):
              <a-tooltip placement="bottom">
                <template slot="title">
                  {{ filterBalance(tokenSwapFrom) | formatNum }}
                </template>
                {{ filterBalance(tokenSwapFrom) | formatAmount(4) }}
              </a-tooltip>
              {{ tokenSwapFrom[1] }}
              <a-icon
                @click="getPairBalance"
                v-show="!refreshPairBalanceLoading"
                type="reload"
                class="reload-icon pointer"
              />
              <a-icon
                v-show="refreshPairBalanceLoading"
                type="loading"
                class="reload-icon pointer"
              />
              <a-tooltip placement="bottom">
                <template slot="title">
                  Withdraw {{ tokenSwapFrom[1] }}
                </template>
                <a-icon
                  v-if="showWithdraw(tokenSwapFrom)"
                  type="upload"
                  class="withdraw-balance"
                  @click="withdrawBalance()"
                />
              </a-tooltip>
            </div>
            <div
              v-if="
                hasDeposit(tokenSwapFrom) &&
                swapId &&
                dexInfo &&
                depositing &&
                depositing[depositAccountId]
              "
              class="exchange-swap-item-bottom"
              style="margin-top: 10px; font-size: 12px"
            >
              <span
                >Depositing:
                <a-tooltip placement="bottom">
                  <template slot="title">
                    {{
                      depositing[depositAccountId][tokenSwapFrom[0].toString()]
                        | bigintToFloat(
                          tokenSwapFrom[3].decimals,
                          tokenSwapFrom[3].decimals
                        )
                        | formatNum
                    }}
                  </template>
                  {{
                    depositing[depositAccountId][tokenSwapFrom[0].toString()]
                      | bigintToFloat(4, tokenSwapFrom[3].decimals)
                      | formatAmount(4)
                  }}
                </a-tooltip>
                {{ tokenSwapFrom[1] }}
                <a-icon
                  @click="
                    refreshDepositingBalance(
                      tokenSwapFrom[2],
                      tokenSwapFrom[0].toString()
                    )
                  "
                  v-show="
                    !refreshDepositBalanceLoading[tokenSwapFrom[0].toString()]
                  "
                  type="reload"
                  class="reload-icon pointer"
                />
                <a-icon
                  v-show="
                    refreshDepositBalanceLoading[tokenSwapFrom[0].toString()]
                  "
                  type="loading"
                  class="reload-icon pointer"
                />
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <span>Fallback {{ tokenSwapFrom[1] }}</span>
                  </template>
                  <a-icon
                    v-if="showFallback(tokenSwapFrom)"
                    class="withdraw-balance"
                    @click="fallback()"
                    type="rollback"
                  />
                </a-tooltip>
              </span>
            </div>
          </div>
        </div>
        <div class="margin-left-auto">
          <span
            v-if="swapId && tokenSwapFrom"
            class="max-amount"
            @click="setMaxAmount(tokenSwapFrom, 'from')"
            >Max</span
          >
        </div>
      </div>
    </div>
    <div class="exchange-swap-icon">
      <a-icon class="swap-icon" type="plus" />
    </div>
    <div class="add-liquidity-item exchange-swap-item">
      <div class="add-liquidity-item-top swap-item-top">
        <div class="ic-swap-item-top-left">
          <div
            v-if="
              currentPool &&
              currentPool.length &&
              tokenSwapTo &&
              tokens &&
              tokens[tokenSwapTo[0].toString()]
            "
            class="swap-item-top-left"
          >
            <span class="img-content">
              <img
                v-if="tokens[tokenSwapTo[0].toString()].logo"
                :src="tokens[tokenSwapTo[0].toString()].logo"
                alt=""
              />
              <span v-else class="empty-pic"></span>
            </span>
            <span class="swap-item-top-left-name">{{ tokenSwapTo[1] }}</span>
          </div>
          <div v-else @click="showTokenList('to')">
            <div
              class="swap-item-top-left"
              v-if="tokenSwapTo && tokens && tokens[tokenSwapTo[0].toString()]"
            >
              <span class="img-content">
                <img
                  v-if="tokens[tokenSwapTo[0].toString()].logo"
                  :src="tokens[tokenSwapTo[0].toString()].logo"
                  alt=""
                />
                <span v-else class="empty-pic"></span>
              </span>
              <span class="swap-item-top-left-name">{{ tokenSwapTo[1] }}</span
              ><a-icon type="down" />
            </div>
            <div class="swap-item-top-left" v-else>
              <span class="swap-item-top-left-name">Select a token</span
              ><a-icon type="down" />
            </div>
          </div>
          <a-select
            v-if="
              tokenSwapTo &&
              tokenSwapTo[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'
            "
            v-model="cyclesCanister"
            @change="cyclesChange"
            class="input-cycles-select"
            placeholder="select cycles wallet Canister-id"
            notFoundContent="Not Found"
            option-label-prop="label"
            :filterOption="false"
          >
            <a-select-option
              v-for="wallet in wallets"
              :key="wallet.walletId.toString()"
              :label="wallet.walletId.toString()"
              >{{ wallet.walletId.toString() }}
              <a-icon v-if="wallet.isDefault" type="check-circle" />
            </a-select-option>
          </a-select>
        </div>
        <div
          class="swap-item-top-right"
          :class="{
            'swap-item-top-right-cycles':
              tokenSwapTo &&
              tokenSwapTo[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'
          }"
        >
          <a-input-group
            class="swap-item-group"
            :class="{ disabled: !dexInfo }"
            compact
            v-if="tokenSwapTo && tokenSwapTo[3]"
          >
            <a-input
              :disabled="!dexInfo"
              :key="tokenSwapTo[3].decimals"
              class="input-icp-suffix text-right"
              autocomplete="off"
              type="text"
              v-model="swapToAmount"
              v-only-float="tokenSwapTo[3].decimals"
              placeholder="0.0"
              @input="swapToAmountChange"
            />
            <span class="suffix">{{ tokenSwapTo[1] }}</span>
          </a-input-group>
          <a-input
            v-else
            class="input-icp-suffix text-right"
            autocomplete="off"
            type="text"
            disabled
            placeholder="0.0"
          />
        </div>
      </div>
      <div class="add-liquidity-item-bottom swap-item-bottom">
        <div v-if="tokenSwapTo && tokenSwapTo[3]">
          <div>
            Balance:
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{
                  tokensBalance[tokenSwapTo[0].toString()]
                    | bigintToFloat(
                      tokenSwapTo[3].decimals,
                      tokenSwapTo[3].decimals
                    )
                    | formatNum
                }}</span>
              </template>
              {{
                tokensBalance[tokenSwapTo[0].toString()]
                  | bigintToFloat(4, tokenSwapTo[3].decimals)
                  | formatAmount(4)
              }}
            </a-tooltip>
            {{ tokenSwapTo[1] }}
            <a-icon
              v-show="!tokensBalanceLoading[tokenSwapTo[0].toString()]"
              type="reload"
              @click="
                getTokenBalance(tokenSwapTo[2], tokenSwapTo[0].toString())
              "
            />
            <a-icon
              v-show="tokensBalanceLoading[tokenSwapTo[0].toString()]"
              type="loading"
              class="reload-icon"
            />
          </div>
          <div class="pair-deposit">
            <div
              v-if="
                swapId && dexInfo && swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'
              "
              style="margin-top: 10px; font-size: 12px"
            >
              Balance(pair):
              <a-tooltip placement="bottom">
                <template slot="title">
                  {{ filterBalance(tokenSwapTo) | formatNum }}
                </template>
                {{ filterBalance(tokenSwapTo) | formatAmount(4) }}
              </a-tooltip>
              {{ tokenSwapTo[1] }}
              <a-icon
                @click="getPairBalance"
                v-show="!refreshPairBalanceLoading"
                type="reload"
                class="reload-icon pointer"
              />
              <a-icon
                v-show="refreshPairBalanceLoading"
                type="loading"
                class="reload-icon pointer"
              />
              <a-tooltip placement="bottom">
                <template slot="title">
                  Withdraw {{ tokenSwapTo[1] }}
                </template>
                <a-icon
                  v-if="showWithdraw(tokenSwapTo)"
                  type="upload"
                  class="withdraw-balance"
                  @click="withdrawBalance()"
                />
              </a-tooltip>
            </div>
            <div
              v-if="
                hasDeposit(tokenSwapTo) &&
                swapId &&
                dexInfo &&
                depositing &&
                depositing[depositAccountId]
              "
              class="exchange-swap-item-bottom"
              style="margin-top: 10px; font-size: 12px"
            >
              <span
                >Depositing:
                <a-tooltip placement="bottom">
                  <template slot="title">
                    {{
                      depositing[depositAccountId][tokenSwapTo[0].toString()]
                        | bigintToFloat(
                          tokenSwapTo[3].decimals,
                          tokenSwapTo[3].decimals
                        )
                        | formatNum
                    }}
                  </template>
                  {{
                    depositing[depositAccountId][tokenSwapTo[0].toString()]
                      | bigintToFloat(4, tokenSwapTo[3].decimals)
                      | formatAmount(4)
                  }}
                </a-tooltip>
                {{ tokenSwapTo[1] }}
                <a-icon
                  @click="
                    refreshDepositingBalance(
                      tokenSwapTo[2],
                      tokenSwapTo[0].toString()
                    )
                  "
                  v-show="
                    !refreshDepositBalanceLoading[tokenSwapTo[0].toString()]
                  "
                  type="reload"
                  class="reload-icon pointer"
                />
                <a-icon
                  v-show="
                    refreshDepositBalanceLoading[tokenSwapTo[0].toString()]
                  "
                  type="loading"
                  class="reload-icon pointer"
                />
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <span>Fallback {{ tokenSwapTo[1] }}</span>
                  </template>
                  <a-icon
                    v-if="showFallback(tokenSwapTo)"
                    class="withdraw-balance"
                    @click="fallback()"
                    type="rollback"
                  />
                </a-tooltip>
              </span>
            </div>
          </div>
        </div>
        <div class="margin-left-auto">
          <span
            v-if="swapId && tokenSwapTo"
            class="max-amount"
            @click="setMaxAmount(tokenSwapTo, 'to')"
            >Max</span
          >
        </div>
      </div>
    </div>
    <div v-if="liquidity && dexInfo">
      <div class="exchange-swap-icon add-liquidity-icon">
        <a-icon class="swap-icon" type="arrow-down" />
      </div>
      <div
        class="add-liquidity-item exchange-swap-item exchange-swap-item-shares"
      >
        <div class="exchange-swap-item-top">
          <div>You will get</div>
          <div class="you-get-shares">
            &nbsp;<a-tooltip placement="bottom">
              <template slot="title">{{ liquidityShare | formatNum }}</template
              ><span class="base-color-w">{{
                liquidityShare | bigintToFloat(4, 0) | formatNum
              }}</span></a-tooltip
            >&nbsp;
          </div>
          <div>Shares</div>
        </div>
        <div
          class="exchange-swap-item-bottom"
          v-if="dexInfo && dexInfo.dexName === 'cyclesfinance'"
        >
          <div>100,000,000</div>
          <div>&nbsp;Shares =&nbsp;</div>
          <a-tooltip placement="top">
            <template slot="title">
              <div class="flex">
                <div>
                  {{
                    (liquidity && liquidity.unitValue[0]) | bigintToFloat(12, 4)
                  }}
                </div>
                &nbsp;TCycles +&nbsp;
                <div>
                  {{
                    (liquidity && liquidity.unitValue[1]) | bigintToFloat(8, 0)
                  }}
                </div>
                &nbsp;ICP
              </div>
            </template>
            <div class="flex">
              <div>
                {{
                  (liquidity && liquidity.unitValue[0]) | bigintToFloat(4, 4)
                }}
              </div>
              &nbsp;TCycles +&nbsp;
              <div>
                {{
                  (liquidity && liquidity.unitValue[1]) | bigintToFloat(4, 0)
                }}
              </div>
              &nbsp;ICP
            </div>
          </a-tooltip>
        </div>
        <div
          v-if="dexInfo.dexName !== 'cyclesfinance'"
          class="exchange-swap-item-bottom"
        >
          <div>1</div>
          <div>&nbsp;Shares =&nbsp;</div>
          <a-tooltip
            placement="top"
            v-if="
              tokens &&
              tokens[getTokenId(dexInfo.token0[0])] &&
              tokens[getTokenId(dexInfo.token1[0])]
            "
          >
            <template slot="title">
              <div class="flex">
                <div>
                  {{
                    (liquidity && liquidity.unitValue[0])
                      | bigintToFloat(
                        tokens[getTokenId(dexInfo.token0[0])].decimals,
                        tokens[getTokenId(dexInfo.token0[0])].decimals
                      )
                  }}
                </div>
                &nbsp;{{ tokens[getTokenId(dexInfo.token0[0])].symbol }} +&nbsp;
                <div>
                  {{
                    (liquidity && liquidity.unitValue[1])
                      | bigintToFloat(
                        tokens[getTokenId(dexInfo.token1[0])].decimals,
                        tokens[getTokenId(dexInfo.token1[0])].decimals
                      )
                  }}
                </div>
                &nbsp;{{ tokens[getTokenId(dexInfo.token1[0])].symbol }}
              </div>
            </template>
            <div class="flex">
              <div>
                {{
                  (liquidity && liquidity.unitValue[0])
                    | bigintToFloat(
                      4,
                      tokens[getTokenId(dexInfo.token0[0])].decimals
                    )
                }}
              </div>
              &nbsp;{{ tokens[getTokenId(dexInfo.token0[0])].symbol }} +&nbsp;
              <div>
                {{
                  (liquidity && liquidity.unitValue[1])
                    | bigintToFloat(
                      4,
                      tokens[getTokenId(dexInfo.token1[0])].decimals
                    )
                }}
              </div>
              &nbsp;{{ tokens[getTokenId(dexInfo.token1[0])].symbol }}
            </div>
          </a-tooltip>
        </div>
      </div>
    </div>
    <div class="swap-button w100">
      <button
        v-if="principal"
        class="primary large-primary w100"
        :disabled="buttonDisabled"
        @click="onAddLiquidity"
      >
        <a-spin v-if="routerLoading" /><span v-else>{{ buttonName }}</span>
      </button>
      <button v-else class="primary large-primary w100" @click="connectWallet">
        Connect Wallet
      </button>
      <div class="cycles-finance-tip">
        It takes 3 to 20 seconds to update the balance after the transaction is
        completed.
      </div>
    </div>
    <a-modal
      v-model="visible"
      centered
      class="select-token"
      width="550px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <div class="select-token-main">
        <div class="select-token-title">Select a token</div>
        <div class="select-token-input">
          <a-input-search
            v-model="searchToken"
            placeholder="Search by name or canister id"
            @input="searchTokenChange"
          ></a-input-search>
        </div>
        <div class="select-token-main-container">
          <div
            class="select-token-main-table"
            v-if="currentTokens && currentTokens.length"
          >
            <ul>
              <li
                @click="onselect(token)"
                :class="{
                  disabled:
                    (selectTokenType === 'from' &&
                      tokenSwapTo &&
                      token[0].toString() === tokenSwapTo[0].toString()) ||
                    (selectTokenType === 'to' &&
                      tokenSwapFrom &&
                      token[0].toString() === tokenSwapFrom[0].toString()),
                  active:
                    (tokenSwapFrom &&
                      selectTokenType === 'from' &&
                      token[0].toString() === tokenSwapFrom[0].toString()) ||
                    (tokenSwapTo &&
                      selectTokenType === 'to' &&
                      token[0].toString() === tokenSwapTo[0].toString())
                }"
                v-for="(token, index) in currentTokens"
                :key="index"
              >
                <div class="img-content">
                  <img
                    v-if="token[3] && token[3].logo"
                    :src="token[3].logo"
                    alt=""
                  />
                  <span v-else class="empty-pic"></span>
                </div>
                <dl>
                  <dt>
                    <span>{{ token[1] }}</span>
                  </dt>
                  <dd>
                    <span>{{ token[3].name }}</span>
                  </dd>
                </dl>
                <div>
                  <span
                    v-show="
                      token[0].toString() !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
                      token[0].toString() !== 'ryjl3-tyaaa-aaaaa-aaaba-cai'
                    "
                    >{{ token[0].toString() | ellipsisAccount }}</span
                  >
                </div>
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <span>{{
                      tokensBalance[token[0].toString()]
                        | bigintToFloat(token[3].decimals, token[3].decimals)
                    }}</span>
                  </template>
                  <span class="select-token-balance">{{
                    tokensBalance[token[0].toString()]
                      | bigintToFloat(4, token[3].decimals)
                  }}</span>
                </a-tooltip>
              </li>
            </ul>
          </div>
          <div
            class="no-found"
            v-show="!tokenListLoading && currentTokens && !currentTokens.length"
          >
            No results found.
          </div>
        </div>
        <a-spin :spinning="tokenListLoading" class="token-list-loading">
        </a-spin>
      </div>
    </a-modal>
    <a-modal
      v-model="addLiquidityVisible"
      width="600px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <div class="swap-progress-header mt20">
        <span>Add liquidity in progress </span>
      </div>
      <div class="swap-progress-tip">
        Please wait some time for transactions to finish
      </div>
      <div class="swap-progress-main">
        <div
          v-if="
            (swapId !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
              (needApprove(tokenSwapFrom, swapFromAmount) ||
                needApprove(tokenSwapTo, swapToAmount))) ||
            swapId === '6nmrm-laaaa-aaaak-aacfq-cai'
          "
          class="swap-progress-item"
        >
          <div
            class="swap-progress-item-icon"
            :class="{
              'swap-progress-item-icon-progress': addLiquidityStep >= 0
            }"
          >
            <a-icon
              v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai'"
              type="wallet"
            />
            <a-icon v-else type="check" />
            <span
              v-show="addLiquidityStep === 0"
              class="progress-loading"
            ></span>
            <a-icon
              v-show="addLiquidityStep > 0"
              class="progress-check-circle"
              theme="twoTone"
              type="check-circle"
            />
          </div>
          <div
            class="swap-progress-item-info"
            :class="{
              'swap-progress-item-info-progress': addLiquidityStep >= 0
            }"
          >
            <div v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai'">
              Depositing<br />ICP
            </div>
            <div
              v-if="
                tokenSwapFrom &&
                tokenSwapTo &&
                swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'
              "
            >
              <div
                v-if="
                  needApprove(tokenSwapFrom, swapFromAmount) &&
                  needApprove(tokenSwapTo, swapToAmount)
                "
              >
                <div
                  v-if="
                    (!hasApprove(tokenSwapFrom) && !hasApprove(tokenSwapTo)) ||
                    (hasApprove(tokenSwapFrom) && hasApprove(tokenSwapTo))
                  "
                >
                  <span
                    v-if="
                      !hasApprove(tokenSwapFrom) && !hasApprove(tokenSwapTo)
                    "
                    >Depositing</span
                  >
                  <span v-else>Approving</span>
                  <div>
                    <span>{{ tokenSwapFrom[1] }}</span>
                    <span>
                      <a-icon type="plus" />
                    </span>
                    <span>{{ tokenSwapTo[1] }}</span>
                  </div>
                </div>
                <div v-else>
                  <div>
                    <span v-if="!hasApprove(tokenSwapFrom)">Depositing</span>
                    <span v-else>Approving</span>
                    <span> {{ tokenSwapFrom[1] }}</span>
                  </div>
                  <span>
                    <a-icon type="plus" />
                  </span>
                  <div>
                    <span v-if="!hasApprove(tokenSwapTo)">Depositing</span>
                    <span v-else>Approving</span>
                    <span> {{ tokenSwapTo[1] }}</span>
                  </div>
                </div>
              </div>
              <div v-else>
                <div v-if="needApprove(tokenSwapFrom, swapFromAmount)">
                  <span v-if="!hasApprove(tokenSwapFrom)">Depositing</span>
                  <span v-else>Approving</span>
                  <span> {{ tokenSwapFrom[1] }}</span>
                </div>
                <div v-else>
                  <span v-if="!hasApprove(tokenSwapTo)">Depositing</span>
                  <span v-else>Approving</span>
                  <span> {{ tokenSwapTo[1] }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="swap-progress-step"
          v-if="
            (swapId !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
              (needApprove(tokenSwapFrom, swapFromAmount) ||
                needApprove(tokenSwapTo, swapToAmount))) ||
            swapId === '6nmrm-laaaa-aaaak-aacfq-cai'
          "
        >
          <a-icon class="progress-step" type="arrow-right" />
        </div>
        <div class="swap-progress-item">
          <div
            class="swap-progress-item-icon"
            :class="{
              'swap-progress-item-icon-progress': addLiquidityStep >= 1
            }"
          >
            <a-icon type="fire" />
            <span
              v-show="addLiquidityStep === 1"
              class="progress-loading"
            ></span>
            <a-icon
              v-show="addLiquidityStep > 1"
              class="progress-check-circle"
              theme="twoTone"
              type="check-circle"
            />
          </div>
          <div
            class="swap-progress-item-info"
            :class="{
              'swap-progress-item-info-progress': addLiquidityStep >= 1
            }"
          >
            Adding<br />liquidity
          </div>
        </div>
      </div>
    </a-modal>
    <top-up
      ref="topUp"
      :balance="icpBalance"
      @topUpSuccess="topUpSuccess"
    ></top-up>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { PairsMixin } from '@/mixins';
import BigNumber from 'bignumber.js';
import {
  PairTokenStdMenu,
  SelectTokenType,
  SwappingPairEnum,
  SwapTokenInfo
} from '@/views/home/ICSwap/model';
import {
  DexConfig,
  SwapTxnResultErr,
  TokenId,
  TokenLiquidity,
  TokenType,
  TxnResultOk
} from '@/ic/ICSwap/model';
import { Config, Liquidity } from '@/ic/cyclesFinance/model';
import { CYCLES_FINANCE_CANISTER_ID, LEDGER_CANISTER_ID } from '@/ic/utils';
import { ICSwapService } from '@/ic/ICSwap/ICSwapService';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { TxReceiptErr } from '@/ic/DRC20Token/model';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { hexToBytes, principalToAccountIdentifier } from '@/ic/converter';
import { getFee } from '@/ic/getTokenFee';
import { swapTokenIdToIcpOrCycles } from '@/ic/icSwapUtils';
import { WalletCallRequest } from '@/ic/wallet/model';

@Component({
  name: 'AddLiquidity',
  components: {}
})
export default class extends Mixins(PairsMixin) {
  private visible = false;
  private buttonName = 'Add liquidity';
  private addLiquidityVisible = false;
  private addLiquidityStep = 0;
  private principal = '';
  get buttonDisabled(): boolean {
    let flag = false;
    if (
      !this.tokenSwapFrom ||
      (this.tokenSwapFrom && !this.tokenSwapFrom[3]) ||
      !this.tokenSwapTo ||
      (this.tokenSwapTo && !this.tokenSwapTo[3])
    ) {
      this.buttonName = 'Select a token';
      flag = true;
    } else {
      this.buttonName = 'Add liquidity';
      if (
        this.tokensBalance[this.tokenSwapTo[0].toString()] === '-' ||
        this.tokensBalance[this.tokenSwapFrom[0].toString()] === '-'
      ) {
        flag = true;
      } else if (this.dexInfo && this.liquidity) {
        if (!this.swapFromAmount) {
          this.buttonName = `Please enter ${this.tokenSwapFrom[1]} amount`;
          flag = true;
        } else if (!this.swapToAmount) {
          this.buttonName = `Please enter ${this.tokenSwapTo[1]} amount`;
          flag = true;
        } else {
          const swapFromAmount = new BigNumber(this.swapFromAmount).times(
            10 ** this.tokenSwapFrom[3].decimals
          );
          const swapToAmount = new BigNumber(this.swapToAmount).times(
            10 ** this.tokenSwapTo[3].decimals
          );
          const formMax = this.getSwapTokenMax(this.tokenSwapFrom);
          if (swapFromAmount.lte(getFee(this.tokenSwapFrom[3]).toString(10))) {
            const fee = new BigNumber(
              getFee(this.tokenSwapFrom[3]).toString(10)
            )
              .div(10 ** this.tokenSwapFrom[3].decimals)
              .toString(10);
            this.buttonName = `${this.tokenSwapFrom[3].symbol} amount must be greater than ${fee}`;
            flag = true;
          }
          if (
            formMax.lte(0) ||
            new BigNumber(this.swapFromAmount)
              .times(10 ** this.tokenSwapFrom[3].decimals)
              .gt(formMax)
          ) {
            this.buttonName = `Insufficient ${this.tokenSwapTo[1]} balance`;
            flag = true;
          }
          const toMax = this.getSwapTokenMax(this.tokenSwapTo);
          if (swapToAmount.lte(getFee(this.tokenSwapTo[3]).toString(10))) {
            const fee = new BigNumber(getFee(this.tokenSwapTo[3]).toString(10))
              .div(10 ** this.tokenSwapTo[3].decimals)
              .toString(10);
            this.buttonName = `${this.tokenSwapTo[3].symbol} amount must be greater than ${fee}`;
            flag = true;
          }
          if (
            toMax.lte(0) ||
            new BigNumber(this.swapToAmount)
              .times(10 ** this.tokenSwapTo[3].decimals)
              .gt(toMax)
          ) {
            this.buttonName = `Insufficient ${this.tokenSwapTo[1]} balance`;
            flag = true;
          }
          if (
            this.dexInfo.canisterId.toString() === CYCLES_FINANCE_CANISTER_ID
          ) {
            if (!this.cyclesCanister) {
              this.buttonName = 'Please enter cycles wallet';
              flag = true;
            }
            let maxCycles;
            let cycles;
            if ((this.tokenSwapTo[2] as { icp: null }).icp === null) {
              maxCycles = new BigNumber(
                this.tokensBalance[this.tokenSwapFrom[0].toString()]
              )
                .minus(this.freezingThreshold)
                .toString(10);
              cycles = new BigNumber(maxCycles)
                .div(10 ** 12)
                .decimalPlaces(12, 1);
              if (
                swapFromAmount
                  .plus(getFee(this.tokenSwapFrom[3]).toString(10))
                  .gt(maxCycles)
              ) {
                if (Number(cycles) > 0) {
                  this.buttonName = `You can enter up to ${cycles} TCycles.`;
                } else {
                  this.buttonName = `You can enter up to 0 TCycles.`;
                }
                flag = true;
              }
            } else {
              maxCycles = new BigNumber(
                this.tokensBalance[this.tokenSwapTo[0].toString()]
              )
                .minus(this.freezingThreshold)
                .toString(10);
              cycles = new BigNumber(maxCycles)
                .div(10 ** 12)
                .decimalPlaces(12, 1);
              if (
                swapToAmount
                  .plus(getFee(this.tokenSwapTo[3]).toString(10))
                  .gt(maxCycles)
              ) {
                if (Number(cycles) > 0) {
                  this.buttonName = `You can enter up to ${cycles} TCycles.`;
                } else {
                  this.buttonName = `You can enter up to 0 TCycles.`;
                }
                flag = true;
              }
            }
          }
          if (
            this.dexInfo.canisterId.toString() === CYCLES_FINANCE_CANISTER_ID
          ) {
            const config = this.config as Config;
            const cyclesLimit = new BigNumber(config.CYCLES_LIMIT.toString())
              .div(10 ** 12)
              .toString(10);
            const icpLimit = new BigNumber(config.ICP_LIMIT.toString())
              .div(10 ** 8)
              .toString(10);
            if ((this.tokenSwapTo[2] as { icp: null }).icp === null) {
              // limit
              if (
                swapFromAmount.gt(config.CYCLES_LIMIT.toString()) &&
                swapToAmount.gt(config.ICP_LIMIT.toString())
              ) {
                this.buttonName = `Limit of ${cyclesLimit} TCycles and ${icpLimit} ICP`;
                flag = true;
              } else if (swapFromAmount.gt(config.CYCLES_LIMIT.toString())) {
                this.buttonName = `Limit of ${cyclesLimit} TCycles`;
                flag = true;
              } else if (swapToAmount.gt(config.ICP_LIMIT.toString())) {
                this.buttonName = `Limit of ${icpLimit} ICP`;
                flag = true;
              }
            } else {
              // limit
              if (
                swapToAmount.gt(config.CYCLES_LIMIT.toString()) &&
                swapFromAmount.gt(config.ICP_LIMIT.toString())
              ) {
                this.buttonName = `Limit of ${icpLimit} ICP and ${cyclesLimit} TCycles`;
                flag = true;
              } else if (swapToAmount.gt(config.CYCLES_LIMIT.toString())) {
                this.buttonName = `Limit of ${cyclesLimit} TCycles`;
                flag = true;
              } else if (swapFromAmount.gt(config.ICP_LIMIT.toString())) {
                this.buttonName = `Limit of ${icpLimit} ICP`;
                flag = true;
              }
            }
            // const cycles = new BigNumber(yourCycles)
            //   .div(10 ** 12)
            //   .decimalPlaces(12, 1);
          } else {
            // ICSwap
            const config = this.config as DexConfig;
            const token0Limit = new BigNumber(config.TOKEN0_LIMIT.toString(10))
              .div(10 ** this.tokenSwapFrom[3].decimals)
              .toString(10);
            const token1Limit = new BigNumber(config.TOKEN1_LIMIT.toString(10))
              .div(10 ** this.tokenSwapFrom[3].decimals)
              .toString(10);
            if (this.isToken0(this.tokenSwapFrom)) {
              // limit
              if (
                swapFromAmount.gt(config.TOKEN0_LIMIT.toString(10)) &&
                swapToAmount.gt(config.TOKEN1_LIMIT.toString(10))
              ) {
                this.buttonName = `Limit of ${token0Limit} ${this.tokenSwapFrom[1]} and ${token1Limit} ${this.tokenSwapTo[1]}`;
                flag = true;
              } else if (swapFromAmount.gt(config.TOKEN0_LIMIT.toString(10))) {
                this.buttonName = `Limit of ${token0Limit} ${this.tokenSwapFrom[1]}`;
                flag = true;
              } else if (swapToAmount.gt(config.TOKEN1_LIMIT.toString(10))) {
                this.buttonName = `Limit of ${token1Limit} ${this.tokenSwapTo[1]}`;
                flag = true;
              }
            } else {
              // limit
              if (
                swapFromAmount.gt(config.TOKEN0_LIMIT.toString(10)) &&
                swapToAmount.gt(config.TOKEN1_LIMIT.toString(10))
              ) {
                this.buttonName = `Limit of ${token1Limit} ${this.tokenSwapFrom[1]} and ${token0Limit} ${this.tokenSwapTo[1]}`;
                flag = true;
              } else if (swapFromAmount.gt(config.TOKEN1_LIMIT.toString(10))) {
                this.buttonName = `Limit of ${token1Limit} ${this.tokenSwapFrom[1]}`;
                flag = true;
              } else if (swapToAmount.gt(config.TOKEN0_LIMIT.toString(10))) {
                this.buttonName = `Limit of ${token0Limit} ${this.tokenSwapTo[1]}`;
                flag = true;
              }
            }
          }
        }
      } else {
        flag = true;
      }
    }
    return flag;
  }
  get liquidityShare(): string {
    let share = '0';
    if (this.liquidity.shares === BigInt(0)) {
      return share;
    }
    if (this.tokenSwapFrom && !this.tokenSwapFrom[3]) {
      return share;
    }
    let tokenFromValue: BigNumber;
    tokenFromValue = new BigNumber(this.swapFromAmount).times(
      10 ** this.tokenSwapFrom[3].decimals
    );
    if (
      this.tokenSwapFrom[2] &&
      Object.keys(this.tokenSwapFrom[2])[0] === 'icp'
    ) {
      tokenFromValue = tokenFromValue.minus(
        getFee(this.tokenSwapFrom[3]).toString(10)
      );
    }
    let value: bigint;
    if (this.isToken0(this.tokenSwapFrom)) {
      if (this.dexInfo.canisterId.toString() === CYCLES_FINANCE_CANISTER_ID) {
        value = (this.liquidity as Liquidity).cycles;
      } else {
        value = (this.liquidity as TokenLiquidity).token0;
      }
    } else {
      if (this.dexInfo.canisterId.toString() === CYCLES_FINANCE_CANISTER_ID) {
        value = (this.liquidity as Liquidity).icpE8s;
      } else {
        value = (this.liquidity as TokenLiquidity).token1;
      }
    }
    if (this.liquidity && Number(tokenFromValue)) {
      share = tokenFromValue
        .div(value.toString(10))
        .times(this.liquidity.shares.toString(10))
        .div(10 ** this.swapDecimals)
        .decimalPlaces(this.swapDecimals, 1)
        .toString(10);
    }
    return share;
  }
  created(): void {
    this.principal = localStorage.getItem('principal');
    if (!this.currentTokens.length) {
      this.tokenListLoading = true;
    }
  }
  private connectWallet(): void {
    this.$router.push({
      path: '/login',
      query: { redirect: this.$route.fullPath }
    });
  }
  public initAdd(): void {
    this.swapFromAmount = '';
    this.swapToAmount = '';
  }
  private setMaxAmount(token: SwapTokenInfo, type: string): void {
    this.setMax(token, type);
    if (type === 'from') {
      this.swapFromAmountChange();
    } else {
      this.swapToAmountChange();
    }
  }
  private showTokenList(type: SelectTokenType): void {
    this.selectTokenType = type;
    this.visible = true;
    this.searchToken = '';
    this.searchTokens = [];
    if (this.selectTokenType === 'to') {
      this.tokenListLoading = true;
      this.getPairsByToken(this.tokenSwapFrom[0], false);
    }
  }
  private async onselect(token: SwapTokenInfo): Promise<void> {
    this.visible = false;
    if (this.selectTokenType === 'from') {
      if (
        !this.tokenSwapFrom ||
        this.tokenSwapFrom[0].toString() !== token[0].toString()
      ) {
        this.swapToAmount = '';
        this.swapFromAmount = '';
        this.swapId = '';
        this.liquidity = null;
        this.dexInfo = null;
        this.tokenSwapFrom = token;
        this.tokenSwapTo = null;
        if (this.$route.fullPath.startsWith('/ICSwap/addLiquidity')) {
          await this.$router.push(
            `/ICSwap/addLiquidity/${swapTokenIdToIcpOrCycles(
              token[0].toString()
            )}`
          );
        }
      }
    } else {
      if (
        !this.tokenSwapTo ||
        this.tokenSwapTo[0].toString() !== token[0].toString()
      ) {
        this.swapToAmount = '';
        this.swapFromAmount = '';
        this.swapId = '';
        this.liquidity = null;
        this.dexInfo = null;
        if (this.$route.fullPath.startsWith('/ICSwap/addLiquidity')) {
          await this.$router.push(
            `/ICSwap/addLiquidity/${swapTokenIdToIcpOrCycles(
              this.tokenSwapFrom[0].toString()
            )}/${swapTokenIdToIcpOrCycles(token[0].toString())}`
          );
        }
        this.tokenSwapTo = token;
        this.init();
      }
    }
  }
  private getTokenId(tokenType: TokenType): string {
    if (tokenType) {
      const token = tokenType as { Token: TokenId };
      if (token.Token) {
        return token.Token.toString();
      }
    }
    return '';
  }
  private async swapFromAmountChange(): Promise<void> {
    if (this.liquidity.shares === BigInt(0)) {
      return;
    }
    if (
      this.tokenSwapFrom &&
      this.tokenSwapTo &&
      this.liquidity &&
      this.swapFromAmount
    ) {
      // const fromStd = Object.keys(this.tokenSwapFrom[2])[0];
      let tokenSwapFromDebitRecord: BigNumber;
      if (this.tokenSwapFrom[0].toString() === LEDGER_CANISTER_ID) {
        tokenSwapFromDebitRecord = new BigNumber(this.swapFromAmount)
          .times(10 ** this.tokenSwapFrom[3].decimals)
          .minus(10000);
      } else {
        tokenSwapFromDebitRecord = new BigNumber(this.swapFromAmount).times(
          10 ** this.tokenSwapFrom[3].decimals
        );
      }
      // const toStd = Object.keys(this.tokenSwapTo[2])[0];
      let tokenSwapToDebitRecord: BigNumber;
      let value0: bigint;
      let value1: bigint;
      if (this.dexInfo.canisterId.toString() === CYCLES_FINANCE_CANISTER_ID) {
        value0 = (this.liquidity as Liquidity).cycles;
        value1 = (this.liquidity as Liquidity).icpE8s;
      } else {
        value0 = (this.liquidity as TokenLiquidity).token0;
        value1 = (this.liquidity as TokenLiquidity).token1;
      }
      if (this.isToken0(this.tokenSwapFrom)) {
        tokenSwapToDebitRecord = tokenSwapFromDebitRecord.div(
          new BigNumber(value0.toString(10)).div(value1.toString(10))
        );
      } else {
        tokenSwapToDebitRecord = tokenSwapFromDebitRecord.times(
          new BigNumber(value0.toString(10)).div(value1.toString(10))
        );
      }
      if (this.tokenSwapTo[0].toString() === LEDGER_CANISTER_ID) {
        tokenSwapToDebitRecord = tokenSwapToDebitRecord.plus(10000);
      }
      if (tokenSwapToDebitRecord.gt(0)) {
        this.swapToAmount = new BigNumber(tokenSwapToDebitRecord)
          .div(10 ** this.tokenSwapTo[3].decimals)
          .decimalPlaces(this.tokenSwapTo[3].decimals)
          .toString(10);
      } else {
        this.swapToAmount = '';
      }
    } else {
      this.swapToAmount = '';
    }
  }
  private async swapToAmountChange(): Promise<void> {
    if (this.liquidity.shares === BigInt(0)) {
      return;
    }
    if (
      this.tokenSwapFrom &&
      this.tokenSwapTo &&
      this.liquidity &&
      this.swapToAmount
    ) {
      const toStd = Object.keys(this.tokenSwapTo[2])[0];
      let tokenSwapToDebitRecord: BigNumber;
      if (toStd === 'icp') {
        tokenSwapToDebitRecord = new BigNumber(this.swapToAmount)
          .times(10 ** this.tokenSwapTo[3].decimals)
          .minus(10000);
      } else {
        tokenSwapToDebitRecord = new BigNumber(this.swapToAmount).times(
          10 ** this.tokenSwapTo[3].decimals
        );
      }
      const fromStd = Object.keys(this.tokenSwapFrom[2])[0];
      let tokenSwapFromDebitRecord: BigNumber;
      const value0 =
        (this.liquidity as TokenLiquidity).token0 ||
        (this.liquidity as Liquidity).cycles;
      const value1 =
        (this.liquidity as TokenLiquidity).token1 ||
        (this.liquidity as Liquidity).icpE8s;
      if (this.isToken0(this.tokenSwapFrom)) {
        tokenSwapFromDebitRecord = tokenSwapToDebitRecord.times(
          new BigNumber(value0.toString(10)).div(value1.toString(10))
        );
      } else {
        tokenSwapFromDebitRecord = tokenSwapToDebitRecord.div(
          new BigNumber(value0.toString(10)).div(value1.toString(10))
        );
      }
      if (fromStd === 'icp') {
        tokenSwapFromDebitRecord = tokenSwapFromDebitRecord.plus(10000);
      }
      if (tokenSwapFromDebitRecord.gt(0)) {
        this.swapFromAmount = new BigNumber(tokenSwapFromDebitRecord)
          .div(10 ** this.tokenSwapFrom[3].decimals)
          .decimalPlaces(this.tokenSwapFrom[3].decimals)
          .toString(10);
      } else {
        this.swapFromAmount = '';
      }
    } else {
      this.swapFromAmount = '';
    }
  }
  private async getCount(principal: Principal): Promise<bigint> {
    return await this.cyclesFinanceService.getCount([
      principalToAccountIdentifier(principal)
    ]);
  }
  private async addCyclesFinanceLiquidity(): Promise<void> {
    try {
      const flag = await this.checkCycles(this.cyclesCanister.trim());
      if (!flag) {
        this.addLiquidityVisible = false;
        return;
      }
      const principal = localStorage.getItem('principal');
      await this.getDepositAccountId();
      let icp;
      let cycles;
      let icpToken;
      const tokenFromStd = Object.keys(this.tokenSwapFrom[2])[0];
      if (tokenFromStd === 'icp') {
        icp = this.swapFromAmount;
        icpToken = this.tokenSwapFrom;
        cycles = this.swapToAmount;
      } else {
        icp = this.swapToAmount;
        icpToken = this.tokenSwapTo;
        cycles = this.swapFromAmount;
      }
      const deptTotal = this.getTokenDepositingAndPairBalance(icpToken);
      if (deptTotal.div(10 ** icpToken[3].decimals).lt(icp)) {
        let swapFromAmount: string;
        if (
          new BigNumber(
            this.depositing[this.depositAccountId][icpToken[0].toString()]
          ).gte(getFee(icpToken[3]).toString(10))
        ) {
          swapFromAmount = new BigNumber(icp)
            .times(10 ** icpToken[3].decimals)
            .minus(deptTotal)
            .div(10 ** icpToken[3].decimals)
            .toString(10);
        } else {
          swapFromAmount = new BigNumber(icp)
            .times(10 ** icpToken[3].decimals)
            .minus(deptTotal)
            .plus(getFee(icpToken[3]).toString(10))
            .div(10 ** icpToken[3].decimals)
            .toString(10);
        }
        const blockHeight = await this.ledgerService.sendIcp(
          swapFromAmount,
          this.depositAccountId
        );
      }
      this.addLiquidityStep = 1;
      const nonce = await this.getCount(
        Principal.fromText(this.cyclesCanister.trim())
      );
      const args = IDL.encode(
        [IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [
          principalToAccountIdentifier(Principal.fromText(principal)),
          [nonce],
          []
        ]
      );
      const walletCallRequest: WalletCallRequest = {
        canister: Principal.fromText(CYCLES_FINANCE_CANISTER_ID),
        method_name: 'add',
        cycles: BigInt(new BigNumber(cycles).times(10 ** 12)),
        args: Array.from(Buffer.from(args))
      };
      this.walletService
        .walletCall(walletCallRequest, this.cyclesCanister.trim())
        .then(async (res) => {
          if ((res as { Ok: { return: Array<number> } }).Ok) {
            this.addLiquidityStep = 2;
            this.$message.success('Add liquidity Success');
            this.$emit(
              'addLiquiditySuccess',
              this.currentRoute,
              this.swapDecimals
            );
            this.swapToAmount = '';
            this.swapFromAmount = '';
            this.addSuccess();
          } else {
            this.addSuccess();
            this.$message.error('Add liquidity fail');
          }
        })
        .catch(() => {
          this.addSuccess();
          this.$message.error('Add liquidity fail');
        });
    } catch (e) {
      console.log(e);
      this.addLiquidityVisible = false;
      this.$message.success(e.message);
    }
  }
  private async onAddLiquidity(): Promise<void> {
    this.addLiquidityVisible = true;
    this.addLiquidityStep = 0;
    const currentSwapService = new ICSwapService();
    const tokenFromStd = Object.keys(this.tokenSwapFrom[2])[0];
    const tokenToStd = Object.keys(this.tokenSwapTo[2])[0];
    if (this.swapId === CYCLES_FINANCE_CANISTER_ID) {
      this.addCyclesFinanceLiquidity();
      return;
    }
    await Promise.all([this.getPairBalance(), this.getCurrentDepositing()]);
    let canAdd = false;
    const fromDeptTotal = this.getTokenDepositingAndPairBalance(
      this.tokenSwapFrom
    );
    const toDeptTotal = this.getTokenDepositingAndPairBalance(this.tokenSwapTo);
    const promiseAll = [];
    if (
      tokenFromStd === PairTokenStdMenu.icp ||
      tokenFromStd === PairTokenStdMenu.icrc1
    ) {
      if (
        fromDeptTotal
          .div(10 ** this.tokenSwapFrom[3].decimals)
          .lt(this.swapFromAmount)
      ) {
        let swapFromAmount: string;
        if (
          new BigNumber(
            this.depositing[this.depositAccountId][
              this.tokenSwapFrom[0].toString()
            ]
          ).gte(getFee(this.tokenSwapFrom[3]).toString(10))
        ) {
          // deptTotal has minus fee
          swapFromAmount = new BigNumber(this.swapFromAmount)
            .times(10 ** this.tokenSwapFrom[3].decimals)
            .minus(fromDeptTotal)
            .div(10 ** this.tokenSwapFrom[3].decimals)
            .toString(10);
        } else {
          swapFromAmount = new BigNumber(this.swapFromAmount)
            .times(10 ** this.tokenSwapFrom[3].decimals)
            .minus(fromDeptTotal)
            .plus(getFee(this.tokenSwapFrom[3]).toString(10))
            .div(10 ** this.tokenSwapFrom[3].decimals)
            .toString(10);
        }
        if (tokenFromStd === PairTokenStdMenu.icp) {
          promiseAll.push(
            await this.ledgerService.sendIcp(
              swapFromAmount,
              this.depositAccount[1]
            )
          );
        }
        if (tokenFromStd === PairTokenStdMenu.icrc1) {
          promiseAll.push(
            this.transferIcrc1(
              this.tokenSwapFrom[0].toString(),
              swapFromAmount,
              this.depositAccount[0]
            )
          );
        }
      } else {
        promiseAll.push(true);
      }
    } else {
      if (
        fromDeptTotal
          .div(10 ** this.tokenSwapFrom[3].decimals)
          .lt(this.swapFromAmount)
      ) {
        let fromAmount = BigInt(
          new BigNumber(this.swapFromAmount)
            .times(10 ** this.tokenSwapFrom[3].decimals)
            .minus(fromDeptTotal.toString(10))
            .toString(10)
        );
        promiseAll.push(this.approve(this.tokenSwapFrom, fromAmount));
      } else {
        promiseAll.push(true);
      }
    }
    if (
      tokenToStd === PairTokenStdMenu.icp ||
      tokenToStd === PairTokenStdMenu.icrc1
    ) {
      if (
        toDeptTotal
          .div(10 ** this.tokenSwapTo[3].decimals)
          .lt(this.swapToAmount)
      ) {
        let swapToAmount: string;
        if (
          new BigNumber(
            this.depositing[this.depositAccountId][
              this.tokenSwapTo[0].toString()
            ]
          ).gte(getFee(this.tokenSwapTo[3]).toString(10))
        ) {
          // deptTotal has minus fee
          swapToAmount = new BigNumber(this.swapToAmount)
            .times(10 ** this.tokenSwapTo[3].decimals)
            .minus(toDeptTotal)
            .div(10 ** this.tokenSwapTo[3].decimals)
            .toString(10);
        } else {
          swapToAmount = new BigNumber(this.swapToAmount)
            .times(10 ** this.tokenSwapTo[3].decimals)
            .minus(toDeptTotal)
            .plus(getFee(this.tokenSwapTo[3]).toString(10))
            .div(10 ** this.tokenSwapTo[3].decimals)
            .toString(10);
        }
        if (tokenToStd === PairTokenStdMenu.icp) {
          promiseAll.push(
            await this.ledgerService.sendIcp(
              swapToAmount,
              this.depositAccount[1]
            )
          );
        }
        if (tokenToStd === PairTokenStdMenu.icrc1) {
          promiseAll.push(
            await this.transferIcrc1(
              this.tokenSwapTo[0].toString(),
              swapToAmount,
              this.depositAccount[0]
            )
          );
        }
      } else {
        promiseAll.push(true);
      }
    } else {
      if (
        toDeptTotal
          .div(10 ** this.tokenSwapTo[3].decimals)
          .lt(this.swapToAmount)
      ) {
        let toAmount = BigInt(
          new BigNumber(this.swapToAmount)
            .times(10 ** this.tokenSwapTo[3].decimals)
            .minus(toDeptTotal.toString(10))
            .toString(10)
        );
        promiseAll.push(this.approve(this.tokenSwapTo, toAmount));
      } else {
        promiseAll.push(true);
      }
    }
    const fromAmount = BigInt(
      new BigNumber(this.swapFromAmount)
        .times(10 ** this.tokenSwapFrom[3].decimals)
        .toString(10)
    );
    const toAmount = BigInt(
      new BigNumber(this.swapToAmount)
        .times(10 ** this.tokenSwapTo[3].decimals)
        .toString(10)
    );
    let value0: bigint;
    let value1: bigint;
    if (this.isToken0(this.tokenSwapFrom)) {
      value0 = fromAmount;
      value1 = toAmount;
    } else {
      value1 = fromAmount;
      value0 = toAmount;
    }
    const flag = await Promise.all(promiseAll);
    if (flag && flag[0] && flag[1]) {
      canAdd = true;
    }
    if (canAdd) {
      this.addLiquidityStep = 1;
      try {
        const _data = '00000002'; // add
        const res = await currentSwapService.add(
          this.dexInfo.canisterId.toString(),
          value0,
          value1,
          [this.autoWithdraw],
          [],
          0,
          [hexToBytes(_data)]
        );
        if (
          (
            res as {
              ok: TxnResultOk;
            }
          ).ok
        ) {
          this.addLiquidityStep = 2;
          this.$message.success('Add Success success');
          this.$emit(
            'addLiquiditySuccess',
            this.currentRoute,
            this.swapDecimals
          );
          this.swapToAmount = '';
          this.swapFromAmount = '';
          this.addSuccess();
          // this.liquidity = await this.getLiquidity(this.swapId);
        } else {
          this.$message.error((res as { err: SwapTxnResultErr }).err.message);
          this.addSuccess();
        }
      } catch (e) {
        console.log(e);
        this.$message.error('Add liquidity err');
        this.addSuccess();
      }
    } else {
      this.addLiquidityVisible = false;
    }
  }
  private addSuccess(): void {
    this.addLiquidityVisible = false;
    try {
      this.getTokenBalance(
        this.tokenSwapFrom[2],
        this.tokenSwapFrom[0].toString()
      );
      this.getTokenBalance(this.tokenSwapTo[2], this.tokenSwapTo[0].toString());
      this.getPairBalance();
      this.getCurrentDepositing();
    } catch (e) {
      console.log(e);
    }
  }
  private async approve(
    tokenInfo: SwapTokenInfo,
    amount: bigint
  ): Promise<boolean> {
    const tokenToStd = Object.keys(tokenInfo[2])[0];
    const currentDrc20Token = new DRC20TokenService();
    if (tokenToStd === PairTokenStdMenu.dip20) {
      try {
        const res = await currentDrc20Token.approve(
          tokenInfo[0].toString(),
          this.dexInfo.canisterId,
          amount
        );
        if (
          (
            res as {
              Ok: bigint;
            }
          ).Ok
        ) {
          return true;
        } else {
          const err = Object.keys(
            (
              res as {
                Err: TxReceiptErr;
              }
            ).Err
          )[0];
          this.$message.error(err);
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    } else {
      try {
        const principal = localStorage.getItem('principal');
        const nonceRes = await currentDrc20Token.txnQuery(
          {
            txnCount: { owner: principal }
          },
          tokenInfo[0].toString()
        );
        const nonce = (
          nonceRes as {
            txnCount: bigint;
          }
        ).txnCount;
        const res = await currentDrc20Token.drc20Approve(
          amount,
          [],
          this.dexInfo.canisterId.toString(),
          [nonce],
          0,
          tokenInfo[0].toString()
        );
        if (
          (
            res as {
              ok: Txid;
            }
          ).ok
        ) {
          return true;
        } else {
          this.$message.error((res as TxnResultErr).err.message);
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.add-liquidity-icon {
  .swap-icon {
    transform: rotate(0);
  }
}
.exchange-swap-item-bottom {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 12px;
}
.exchange-swap-item-top {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.you-get-shares {
  font-size: 20px;
}
.flex {
  display: flex;
  align-items: center;
}
.text-right {
  text-align: right;
}
.max-amount {
  color: #1996c4;
  cursor: pointer;
}
.exchange-swap-item-shares {
  border: none;
  box-shadow: none;
}
</style>
