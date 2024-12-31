<template>
  <div class="swap">
    <div class="ic-swap-main">
      <div class="swap-item">
        <div
          v-show="!wallets.length && swapId === '6nmrm-laaaa-aaaak-aacfq-cai'"
          class="no-cycles-wallet"
        >
          You don't have a cycles wallet yet,
          <router-link to="/wallet">create or bind one.</router-link>
        </div>
        <div class="swap-setting-item">
          <span
            class="swap-item-dex-name"
            :class="{
              'swap-item-dex-name-cycles':
                !wallets.length && swapId === '6nmrm-laaaa-aaaak-aacfq-cai'
            }"
            v-if="dexInfo"
          >
            <span>
              {{ dexInfo.dexName }}: {{ token0Symbol }}/{{ token1Symbol }}
            </span>
            <span>
              <span class="pc-show">(</span>
              <a
                :href="'https://ic.house/swap/' + dexInfo.canisterId.toString()"
                rel="nofollow noreferrer noopener"
                target="_blank"
                >{{ dexInfo.canisterId.toString() }}</a
              >
              <span class="pc-show">)</span>
            </span>
          </span>
          <div class="swap-setting">
            <a-icon
              @click="showKLine"
              v-show="config && dexInfo"
              type="bar-chart"
            />
            <a-icon
              v-show="config && dexInfo"
              @click="visibleSwap = true"
              :class="{
                'swap-setting-cycles':
                  !wallets.length && swapId === '6nmrm-laaaa-aaaak-aacfq-cai'
              }"
              type="setting"
            />
          </div>
        </div>
        <div class="swap-item-top">
          <div class="ic-swap-item-top-left">
            <div>
              <div
                @click="showTokenList('from')"
                class="swap-item-top-left"
                v-if="tokenSwapFrom && tokenSwapFrom[3]"
              >
                <span class="img-content">
                  <img
                    v-if="
                      tokens[tokenSwapFrom[0].toString()] &&
                      tokens[tokenSwapFrom[0].toString()].logo
                    "
                    :src="tokens[tokenSwapFrom[0].toString()].logo"
                    alt=""
                  />
                  <span v-else class="empty-pic"></span>
                </span>
                <span class="swap-item-top-left-name">{{
                  tokenSwapFrom[1]
                }}</span
                ><a-icon type="down" />
              </div>
              <div
                @click="showTokenList('from')"
                class="swap-item-top-left"
                v-else
              >
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
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                v-model="swapFromAmount"
                v-only-float="tokenSwapFrom[3].decimals"
                placeholder="0.0"
                @input="swapFromAmountChange"
              /><span class="suffix">{{ tokenSwapFrom[1] }}</span>
            </a-input-group>
            <a-input-group v-else class="swap-item-group disabled" compact>
              <a-input
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                disabled
                placeholder="0.0"
              />
            </a-input-group>
          </div>
        </div>
        <div class="swap-item-bottom">
          <div v-if="tokenSwapFrom && tokenSwapFrom[3]">
            <div>
              Balance:
              <a-tooltip placement="bottom">
                <template slot="title">
                  {{
                    tokensBalance[tokenSwapFrom[0].toString()] |
                      bigintToFloat(
                        tokenSwapFrom[3].decimals,
                        tokenSwapFrom[3].decimals
                      ) |
                      formatNum
                  }}
                </template>
                {{
                  tokensBalance[tokenSwapFrom[0].toString()] |
                    bigintToFloat(4, tokenSwapFrom[3].decimals) |
                    formatAmount(4)
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
                        depositing[depositAccountId][
                          tokenSwapFrom[0].toString()
                        ] |
                          bigintToFloat(
                            tokenSwapFrom[3].decimals,
                            tokenSwapFrom[3].decimals
                          ) |
                          formatNum
                      }}
                    </template>
                    {{
                      depositing[depositAccountId][
                        tokenSwapFrom[0].toString()
                      ] |
                        bigintToFloat(4, tokenSwapFrom[3].decimals) |
                        formatAmount(4)
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
                    class="reload-icon"
                  />
                  <a-icon
                    v-show="
                      refreshDepositBalanceLoading[tokenSwapFrom[0].toString()]
                    "
                    type="loading"
                    class="reload-icon"
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
              v-if="swapId"
              class="max-amount"
              @click="setMaxAMount(tokenSwapFrom, 'from')"
              >Max</span
            >
          </div>
        </div>
      </div>
      <div class="exchange-swap-icon exchange-swap-icon-swap">
        <a-icon
          :class="{ 'swap-icon-default': !tokenSwapTo }"
          class="swap-icon"
          type="swap"
          @click="changeSwapType"
        />
      </div>
      <div class="swap-item">
        <div class="swap-item-top">
          <div class="ic-swap-item-top-left">
            <div>
              <div
                @click="showTokenList('to')"
                class="swap-item-top-left"
                v-if="tokenSwapTo && tokenSwapTo[3]"
              >
                <span class="img-content">
                  <img
                    v-if="
                      tokens[tokenSwapTo[0].toString()] &&
                      tokens[tokenSwapTo[0].toString()].logo
                    "
                    :src="tokens[tokenSwapTo[0].toString()].logo"
                    alt=""
                  />
                  <span v-else class="empty-pic"></span>
                </span>
                <span class="swap-item-top-left-name">{{ tokenSwapTo[1] }}</span
                ><a-icon type="down" />
              </div>
              <div
                @click="showTokenList('to')"
                class="swap-item-top-left"
                v-else
              >
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
                class="input-icp-suffix"
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
              class="input-icp-suffix"
              autocomplete="off"
              type="text"
              disabled
              placeholder="0.0"
            />
          </div>
        </div>
        <div class="swap-item-bottom" v-if="tokenSwapTo && tokenSwapTo[3]">
          <div>
            <div>
              Balance:
              <a-tooltip placement="bottom">
                <template slot="title">
                  {{
                    tokensBalance[tokenSwapTo[0].toString()] |
                      bigintToFloat(
                        tokenSwapTo[3].decimals,
                        tokenSwapTo[3].decimals
                      ) |
                      formatNum
                  }}
                </template>
                {{
                  tokensBalance[tokenSwapTo[0].toString()] |
                    bigintToFloat(4, tokenSwapTo[3].decimals) |
                    formatAmount(4)
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
                    Withdraw {{ tokenSwapTo[1] }}</template
                  >
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
                        depositing[depositAccountId][
                          tokenSwapTo[0].toString()
                        ] |
                          bigintToFloat(
                            tokenSwapTo[3].decimals,
                            tokenSwapTo[3].decimals
                          ) |
                          formatNum
                      }}
                    </template>
                    {{
                      depositing[depositAccountId][tokenSwapTo[0].toString()] |
                        bigintToFloat(4, tokenSwapTo[3].decimals) |
                        formatAmount(4)
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
            <span v-if="dexInfo"> Fee({{ dexInfo | filterFeeRate }})</span>
            <span v-show="swapFee">: </span>
            <span v-show="swapFee"
              >{{ swapFee | formatAmount(tokenSwapTo[3].decimals) }}
              {{ tokenSwapTo[1] }}
            </span>
          </div>
        </div>
      </div>
      <div class="exchange-swap-liquidity" v-if="conversionRate && dexInfo">
        <div
          class="exchange-swap-liquidity-h5"
          v-if="tokenSwapFrom && tokenSwapTo"
        >
          {{ tokenSwapFrom[1] }}<a-icon type="arrow-right" />{{
            tokenSwapTo[1]
          }}
        </div>
        <div class="margin-left-auto">
          <a-icon class="swap-icon" type="swap" @click="changeRate" />&nbsp;
          <span v-show="!showRate"
            >1 {{ tokenSwapTo[1] }} = {{ conversionRateReverse }}
            {{ tokenSwapFrom[1] }}</span
          >
          <span v-show="showRate"
            >1 {{ tokenSwapFrom[1] }} = {{ conversionRate }}
            {{ tokenSwapTo[1] }}</span
          >
          <span
            v-if="swapToAmount"
            class="slippage-span"
            :class="{
              'slippage-error':
                dexInfo.canisterId.toString() === '6nmrm-laaaa-aaaak-aacfq-cai'
                  ? Math.abs(slippage) > 20
                  : Math.abs(slippage) > config.MAX_VOLATILITY
            }"
          >
            (Price Impact: {{ slippage }}%)
          </span>
          <span v-if="swapToAmount"
            ><a-tooltip placement="bottom">
              <template slot="title">
                <div>Swap volatility: {{ slippage }}%</div>
                <div>
                  Swapping fee:
                  <a-tooltip placement="bottom">
                    <template slot="title">
                      {{ swapFee }}
                    </template>
                    {{ swapFee | formatAmount(tokenSwapTo[3].decimals) }}
                  </a-tooltip>
                  <span>{{ tokenSwapTo[1] }}</span>
                </div>
              </template>
              <a-icon type="info-circle" /></a-tooltip
          ></span>
        </div>
      </div>
      <div
        v-if="
          principal &&
          tokenSwapFrom &&
          tokenSwapTo &&
          swapId &&
          swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'
        "
        class="auto-withdraw"
      >
        <a-checkbox :checked="!autoWithdraw" @change="onchange">
          Keep {{ tokenSwapFrom[1] }} and {{ tokenSwapTo[1] }} in Contract after
          swap
        </a-checkbox>
      </div>
      <div class="swap-button w100">
        <button
          v-if="principal"
          class="primary large-primary w100"
          :disabled="buttonDisabled"
          @click="onSwap"
        >
          <a-spin v-if="routerLoading" /><span v-else>{{ buttonName }}</span>
        </button>
        <button
          v-else
          class="primary large-primary w100"
          @click="connectWallet"
        >
          Connect Wallet
        </button>
        <div v-if="tokenSwapFrom && tokenSwapTo" class="cycles-finance-tip">
          It takes 3 to 20 seconds to update the {{ tokenSwapFrom[1] }} and
          {{ tokenSwapTo[1] }} balance after the transaction is completed.
        </div>
      </div>
    </div>
    <a-modal
      v-model="visible"
      class="select-token"
      centered
      width="600px"
      :dialog-style="{ top: '20px' }"
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
                <dl v-if="token[3] && token[1]">
                  <dt>
                    <span>{{ token[1] }}</span>
                  </dt>
                  <dd>
                    <span>{{ token[3].name }}</span>
                  </dd>
                </dl>
                <div>
                  <span
                    v-if="
                      token[0].toString() !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
                      token[0].toString() !== 'ryjl3-tyaaa-aaaaa-aaaba-cai'
                    "
                  >
                    <copy-account
                      :is-copy="false"
                      :show-copy="false"
                      :account="token[0].toString()"
                    ></copy-account>
                  </span>
                  <copy-account
                    v-if="token[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'"
                    :is-copy="false"
                    :show-copy="false"
                    :account="cyclesCanister"
                  ></copy-account>
                </div>
                <a-tooltip
                  placement="top"
                  v-if="
                    token[0] &&
                    tokensBalance[token[0].toString()] &&
                    token[3] &&
                    token[3].decimals
                  "
                >
                  <template slot="title">
                    <span>{{
                      tokensBalance[token[0].toString()] |
                        bigintToFloat(token[3].decimals, token[3].decimals)
                    }}</span>
                  </template>
                  <span class="select-token-balance">{{
                    tokensBalance[token[0].toString()] |
                      bigintToFloat(4, token[3].decimals) |
                      formatAmount(4)
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
      <div class="create-pair" v-if="depositAccountId">
        <button class="primary large-primary w100" @click="onCreatePair">
          Create a swapping pair
        </button>
      </div>
    </a-modal>
    <a-modal
      v-model="visibleSwap"
      title="Swap Settings"
      width="550px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
    >
      <div>
        <div class="modal-label">Slippage Tolerance:</div>
        <!--<div class="slippage-tip">
          Your transaction will revert if the price changes by more than this
          percentage.
        </div>-->
        <div class="slippage-tolerance-item">
          <div class="slippage-tolerance">
            <button
              :class="{ default: !slippageTolerance }"
              type="button"
              @click="setToleranceAuto"
            >
              Auto
            </button>
            <a-input
              v-only-float="2"
              class="text-right"
              :class="{ active: slippageTolerance }"
              v-model="slippageTolerance"
              placeholder="5"
              suffix="%"
            ></a-input>
          </div>
          <div
            v-show="slippageTolerance && Number(slippageTolerance) < 0.5"
            class="slippage-tolerance-err"
          >
            Your slippage tolerance is set very low, the transaction may fail.
          </div>
        </div>
        <div class="modal-label">
          Max Price Impact:
          <span>{{ priceImpact }}%</span>
        </div>
        <span class="slippage-tip">
          a swap causing price fluctuations more than
          {{ priceImpact }}% will be rejected.
        </span>
        <div class="mt20 w100">
          <button class="default margin-left-auto" @click="setTolerance">
            confirm
          </button>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="createPairVisible"
      centered
      title="Create a swapping pair"
      width="740px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
    >
      <a-form-model class="create-swapping-pair">
        <a-row :gutter="24">
          <!--<a-col :span="24">
            <a-form-model-item label="Dex Name">
              <a-input
                placeholder="Dex Name"
                v-model="createPairForm.dexName"
                autocomplete="off"
              ></a-input>
            </a-form-model-item>
          </a-col>-->
          <a-col :span="12">
            <a-form-model-item label="Token Canister ID" prop="TokenCanisterID">
              <a-input
                placeholder="Canister ID(Principal)"
                v-model="createPairForm.token0Id"
                autocomplete="off"
              />
              <span
                class="pair-token-err"
                v-show="
                  createPairForm.token0Id &&
                  !validatePrincipal(createPairForm.token0Id)
                "
              >
                Invalid Canister ID
              </span>
              <span class="pair-token-err" v-show="createPairToken0Err"
                >Invalid Canister ID. No Token Interface Detected.</span
              >
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="Token Standard" prop="TokenStandard">
              <a-select v-model="createPairForm.token0Std">
                <a-select-option v-for="std in pairTokenStdMenu" :key="std">
                  {{ std }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" class="create-swapping-pair-plus">
            <a-icon type="plus" />
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="Token Canister ID" prop="TokenCanisterID">
              <a-input
                placeholder="Canister ID(Principal)"
                v-model="createPairForm.token1Id"
                autocomplete="off"
              />
              <span
                class="pair-token-err"
                v-show="
                  createPairForm.token1Id &&
                  !validatePrincipal(createPairForm.token1Id)
                "
              >
                Invalid Canister ID
              </span>
              <span class="pair-token-err" v-show="createPairToken1Err"
                >Invalid Canister ID. No Token Interface Detected.</span
              >
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="Token Standard" prop="TokenStandard">
              <a-select v-model="createPairForm.token1Std">
                <a-select-option v-for="std in pairTokenStdMenu" :key="std">
                  {{ std }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <button
              :disabled="
                !createPairForm.token0Id ||
                !createPairForm.token1Id ||
                !validatePrincipal(createPairForm.token0Id) ||
                !validatePrincipal(createPairForm.token1Id)
              "
              class="primary large-primary w100 mt20"
              @click="onSubmitCreate"
            >
              Create a swapping pair
            </button>
          </a-col>
        </a-row>
      </a-form-model>
      <a-modal
        v-model="allowanceVisible"
        width="600px"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="delete-modal"
      >
        <p>
          Required to allow the smart contract to spend your
          {{ allowanceInfo.symbol }} token as a fee({{ allowanceInfo.fee }}
          {{ allowanceInfo.symbol }} / create a swapping pair)
        </p>
        <div class="delete-button">
          <button
            type="button"
            class="primary large-primary w100"
            @click="showApprove"
          >
            Approve
          </button>
        </div>
      </a-modal>
    </a-modal>
    <a-modal
      v-model="insufficientVisible"
      width="700px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <p>
        Insufficient balance. A minimum of 100.01 ICL is required to create
        swapping pair.
      </p>
      <div class="delete-button">
        <button
          type="button"
          style="margin-left: auto"
          class="default"
          @click="insufficientVisible = false"
        >
          Confirm
        </button>
      </div>
    </a-modal>
    <a-modal
      v-model="swapVisible"
      width="600px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <div class="swap-progress-header mt20">
        <span v-if="tokenSwapFrom && tokenSwapTo">
          {{ tokenSwapFrom[1] }} to {{ tokenSwapTo[1] }} in progress
        </span>
      </div>
      <div class="swap-progress-tip">
        Please wait some time for transactions to finish
      </div>
      <div class="swap-progress-main">
        <div
          class="swap-progress-item"
          v-if="
            (swapId !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
              needApprove(tokenSwapFrom, swapFromAmount)) ||
            swapId === '6nmrm-laaaa-aaaak-aacfq-cai'
          "
        >
          <div
            class="swap-progress-item-icon"
            :class="{ 'swap-progress-item-icon-progress': step >= 0 }"
          >
            <a-icon
              v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai'"
              type="wallet"
            />
            <a-icon v-else type="check" />
            <span v-show="step === 0" class="progress-loading"></span>
            <a-icon
              v-show="step > 0"
              class="progress-check-circle"
              theme="twoTone"
              type="check-circle"
            />
          </div>
          <div
            class="swap-progress-item-info"
            :class="{ 'swap-progress-item-info-progress': step >= 0 }"
          >
            <div
              v-if="
                swapId === '6nmrm-laaaa-aaaak-aacfq-cai' &&
                tokenSwapFrom &&
                tokenSwapFrom[0].toString() === 'ryjl3-tyaaa-aaaaa-aaaba-cai'
              "
            >
              Depositing<br />ICP
            </div>
            <div
              v-if="
                swapId === '6nmrm-laaaa-aaaak-aacfq-cai' &&
                tokenSwapFrom &&
                tokenSwapFrom[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'
              "
            >
              Converting<br />to<br />ICP
            </div>
            <div
              v-if="tokenSwapFrom && swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'"
            >
              <span v-if="!hasApprove(tokenSwapFrom)">
                Depositing<br />{{ tokenSwapFrom[1] }}
              </span>
              <span v-else> Approving<br />{{ tokenSwapFrom[1] }} </span>
            </div>
          </div>
        </div>
        <div
          class="swap-progress-step"
          v-if="
            (swapId !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
              needApprove(tokenSwapFrom, swapFromAmount)) ||
            swapId === '6nmrm-laaaa-aaaak-aacfq-cai'
          "
        >
          <a-icon class="progress-step" type="arrow-right" />
        </div>
        <div class="swap-progress-item">
          <div
            class="swap-progress-item-icon"
            :class="{ 'swap-progress-item-icon-progress': step >= 1 }"
          >
            <a-icon type="swap" />
            <span v-show="step === 1" class="progress-loading"></span>
            <a-icon
              v-show="step > 1"
              class="progress-check-circle"
              theme="twoTone"
              type="check-circle"
            />
          </div>
          <div
            class="swap-progress-item-info"
            :class="{ 'swap-progress-item-info-progress': step >= 1 }"
          >
            <div
              v-if="
                swapId === '6nmrm-laaaa-aaaak-aacfq-cai' &&
                tokenSwapTo &&
                tokenSwapTo[0].toString() === '6nmrm-laaaa-aaaak-aacfq-cai'
              "
            >
              Converting<br />to<br />Cycles
            </div>
            <div
              v-if="
                swapId === '6nmrm-laaaa-aaaak-aacfq-cai' &&
                tokenSwapTo &&
                tokenSwapTo[0].toString() === 'ryjl3-tyaaa-aaaaa-aaaba-cai'
              "
            >
              Withdrawing<br />ICP
            </div>
            <div
              v-if="
                tokenSwapFrom &&
                tokenSwapTo &&
                swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'
              "
            >
              Swapping<br />
              {{ tokenSwapFrom[1] }}
              to
              {{ tokenSwapTo[1] }}
            </div>
          </div>
        </div>
        <div
          class="swap-progress-step"
          v-if="swapId !== '6nmrm-laaaa-aaaak-aacfq-cai' && autoWithdraw"
        >
          <a-icon class="progress-step" type="arrow-right" />
        </div>
        <div
          v-if="swapId !== '6nmrm-laaaa-aaaak-aacfq-cai' && autoWithdraw"
          class="swap-progress-item"
        >
          <div
            class="swap-progress-item-icon"
            :class="{ 'swap-progress-item-icon-progress': step >= 2 }"
          >
            <a-icon type="swap" />
            <span v-show="step === 2" class="progress-loading"></span>
            <a-icon
              v-show="step > 2"
              class="progress-check-circle"
              theme="twoTone"
              type="check-circle"
            />
          </div>
          <div
            class="swap-progress-item-info"
            :class="{ 'swap-progress-item-info-progress': step >= 2 }"
          >
            <div v-if="tokenSwapFrom && tokenSwapTo">
              Withdrawing<br />
              {{ tokenSwapFrom[1] }}
              <a-icon class="swap-icon" type="plus" />
              {{ tokenSwapTo[1] }}
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <approve-modal
      :decimals="allowanceInfo.decimals"
      :symbol="allowanceInfo.symbol"
      :token-id="allowanceInfo.tokenId"
      ref="approve"
    ></approve-modal>
    <k-line ref="kLine" :swap-id="swapId" :dex-info="dexInfo"></k-line>
    <top-up
      ref="topUp"
      :balance="icpBalance"
      @topUpSuccess="topUpSuccess"
    ></top-up>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { PairTokenStdMenu, SelectTokenType, SwapTokenInfo } from './model';
import { Principal } from '@dfinity/principal';
import {
  CYCLES_FINANCE_CANISTER_ID,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_SWAP_ROUTER_CANISTER_ID,
  validatePrincipal
} from '@/ic/utils';
import BigNumber from 'bignumber.js';
import { PairsMixin } from '@/mixins';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { ICSwapService } from '@/ic/ICSwap/ICSwapService';
import {
  DexConfig,
  DexInfo,
  OrderRequest,
  SwapTxnResultErr,
  TokenLiquidity,
  TxnResultOk
} from '@/ic/ICSwap/model';
import { Config, Liquidity } from '@/ic/cyclesFinance/model';
import ApproveModal from '@/components/approve/Index.vue';
import { PairRequest } from '@/ic/ICSwapRouter/model';
import { toHttpError } from '@/ic/httpError';
import { TxReceiptErr } from '@/ic/DRC20Token/model';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { hexToBytes, principalToAccountIdentifier } from '@/ic/converter';
import { IDL } from '@dfinity/candid';
import { getFee } from '@/ic/getTokenFee';
import {
  icpOrCyclesToSwapTokenId,
  swapTokenIdToIcpOrCycles
} from '@/ic/icSwapUtils';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import { checkAuth } from '@/ic/CheckAuth';
import { WalletCallRequest } from '@/ic/wallet/model';
import KLine from './components/kIine.vue';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';

@Component({
  name: 'Index',
  components: { ApproveModal, KLine },
  filters: {
    filterFeeRate(dexInfo: DexInfo): string {
      if (dexInfo) {
        return new BigNumber(dexInfo.feeRate).times(100).toString(10) + '%';
      }
      return null;
    }
  }
})
export default class extends Mixins(PairsMixin) {
  $refs!: {
    approve;
    kLine;
  };
  private pairTokenStdMenu = PairTokenStdMenu;
  private visible = false;
  private showRate = true;
  private conversionRate = '';
  private conversionRateReverse = '';
  private buttonName = 'Swap';
  private swapFee = '';
  private slippage = 0;
  private slippageTolerance = '';
  private visibleSwap = false;
  private createPairVisible = false;
  private createPairForm = {
    token0Id: '',
    token0Std: this.pairTokenStdMenu.drc20,
    token1Id: '',
    token1Std: this.pairTokenStdMenu.drc20,
    dexName: 'icswap'
  };
  private createPairToken0Err = false;
  private createPairToken1Err = false;
  private allowanceVisible = false;
  private insufficientVisible = false;
  private allowanceInfo = {
    symbol: '',
    fee: '',
    tokenId: '',
    decimals: 0
  };
  private step = 0;
  private swapVisible = false;
  private principal = '';
  get buttonDisabled(): boolean {
    let flag = false;
    if (!this.tokenSwapFrom || !this.tokenSwapTo) {
      this.buttonName = 'Select a token';
      flag = true;
    } else {
      this.buttonName = 'Swap';
      if (this.tokensBalance[this.tokenSwapFrom[0].toString()] === '-') {
        flag = true;
        return flag;
      }
      if (this.dexInfo && this.liquidity) {
        const feeRate = new BigNumber(1).minus(this.dexInfo.feeRate);
        if (!Number(this.swapFromAmount)) {
          this.buttonName = `Please enter ${this.tokenSwapFrom[1]} amount`;
          flag = true;
        } else if (!Number(this.swapToAmount)) {
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
            ).div(10 ** this.tokenSwapFrom[3].decimals);
            this.buttonName = `${this.tokenSwapFrom[3].symbol} amount must be greater than ${fee}`;
            flag = true;
          }
          if (
            formMax.lte(0) ||
            new BigNumber(this.swapFromAmount)
              .times(10 ** this.tokenSwapFrom[3].decimals)
              .gt(formMax)
          ) {
            this.buttonName = `Insufficient ${this.tokenSwapFrom[1]} balance`;
            flag = true;
          }
          if (this.tokenSwapFrom[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
            const cycles = new BigNumber(
              this.tokensBalance[this.tokenSwapFrom[0].toString()]
            )
              .minus(this.freezingThreshold)
              .div(10 ** 12)
              .decimalPlaces(12, 1);
            if (cycles.lte(0)) {
              this.buttonName = `Insufficient ${this.tokenSwapFrom[1]} balance`;
              flag = true;
            } else if (cycles.lt(this.swapFromAmount)) {
              this.buttonName = `You can enter up to ${cycles} TCycles.`;
              flag = true;
            }
          }
          if (
            this.dexInfo.canisterId.toString() === CYCLES_FINANCE_CANISTER_ID
          ) {
            if (!this.cyclesCanister) {
              this.buttonName = 'Please enter cycles wallet';
              flag = true;
            }
            const config = this.config as Config;
            const liquidity = this.liquidity as Liquidity;
            // slippage
            if (Math.abs(this.slippage) > 20) {
              this.buttonName = `Price fluctuations more than 20%`;
              flag = true;
            }
            if ((this.tokenSwapTo[2] as { icp: null }).icp === null) {
              // limit
              if (swapFromAmount.gt(config.CYCLES_LIMIT.toString())) {
                const icpLimit = new BigNumber(config.CYCLES_LIMIT.toString())
                  .div(10 ** 12)
                  .toString(10);
                this.buttonName = `Limit of ${icpLimit} TCycles`;
                flag = true;
              }
              // max trade
              const maxTrade = new BigNumber(liquidity.icpE8s.toString(10))
                .times(feeRate)
                .minus(getFee(this.tokenSwapTo[3]).toString(10));
              console.log(swapToAmount.toString(), maxTrade.toString());
              if (swapToAmount.gt(maxTrade)) {
                this.buttonName = 'Insufficient liquidity for this trade';
                flag = true;
              }
            } else {
              // limit
              if (swapFromAmount.gt(config.ICP_LIMIT.toString())) {
                const cyclesLimit = new BigNumber(config.ICP_LIMIT.toString())
                  .div(10 ** 8)
                  .toString(10);
                this.buttonName = `Limit of ${cyclesLimit} ICP`;
                flag = true;
              }
              // max trade
              const maxTrade = new BigNumber(liquidity.cycles.toString(10))
                .times(feeRate)
                .minus(getFee(this.tokenSwapFrom[3]).toString(10));
              console.log(swapToAmount.toString(), maxTrade.toString());
              if (swapToAmount.gt(maxTrade)) {
                this.buttonName = 'Insufficient liquidity for this trade';
                flag = true;
              }
            }
          } else {
            // ICSwap
            const config = this.config as DexConfig;
            const liquidity = this.liquidity as TokenLiquidity;
            // slippage
            if (Math.abs(this.slippage) > config.MAX_VOLATILITY) {
              this.buttonName = `Price fluctuations more than ${config.MAX_VOLATILITY}%`;
              flag = true;
            }
            if (this.isToken0(this.tokenSwapFrom)) {
              // limit
              if (swapFromAmount.gt(config.TOKEN0_LIMIT.toString(10))) {
                const token0Limit = new BigNumber(
                  config.TOKEN0_LIMIT.toString(10)
                )
                  .div(10 ** this.tokenSwapFrom[3].decimals)
                  .toString(10);
                this.buttonName = `Limit of ${token0Limit} ${this.tokenSwapFrom[1]}`;
                flag = true;
              }
              // max trade
              const maxTrade = new BigNumber(
                liquidity.token1.toString(10)
              ).times(feeRate);
              if (swapToAmount.gt(maxTrade)) {
                this.buttonName = 'Insufficient liquidity for this trade';
                flag = true;
              }
            } else {
              // limit
              if (swapFromAmount.gt(config.TOKEN1_LIMIT.toString(10))) {
                const token1Limit = new BigNumber(
                  config.TOKEN1_LIMIT.toString(10)
                )
                  .div(10 ** this.tokenSwapFrom[3].decimals)
                  .toString(10);
                this.buttonName = `Limit of ${token1Limit} ${this.tokenSwapFrom[1]}`;
                flag = true;
              }
              // max trade
              const maxTrade = new BigNumber(
                liquidity.token0.toString(10)
              ).times(feeRate);
              if (swapToAmount.gt(maxTrade)) {
                this.buttonName = 'Insufficient liquidity for this trade';
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
  get priceImpact(): number {
    if (this.dexInfo && this.config) {
      if (this.dexInfo.canisterId.toString() === CYCLES_FINANCE_CANISTER_ID) {
        return 20;
      } else {
        return Number((this.config as DexConfig).MAX_VOLATILITY);
      }
    }
    return null;
  }
  get token0Symbol(): string {
    if (this.dexInfo) {
      const token0Type = Object.keys(this.dexInfo.token0[0])[0];
      if (token0Type !== 'Token') {
        return token0Type;
      } else {
        const token0Id = Object.values(this.dexInfo.token0[0])[0].toString();
        if (this.tokens[token0Id]) {
          return this.tokens[token0Id].symbol;
        }
      }
    }
    return '';
  }
  get token1Symbol(): string {
    if (this.dexInfo) {
      const token1Type = Object.keys(this.dexInfo.token1[0])[0];
      if (token1Type !== 'Token') {
        return token1Type;
      } else {
        const token1Id = Object.values(this.dexInfo.token1[0])[0].toString();
        if (this.tokens[token1Id]) {
          return this.tokens[token1Id].symbol;
        }
      }
    }
    return '';
  }
  @Watch('liquidity', { deep: true })
  private liquidityChange(): void {
    if (
      this.liquidity &&
      this.dexInfo &&
      this.tokenSwapFrom &&
      this.tokenSwapTo
    ) {
      if (this.swapFromAmount) {
        this.swapFromAmountChange();
      } else {
        this.getConversionRate();
      }
    }
  }
  created(): void {
    this.principal = localStorage.getItem('principal');
    const slippage = localStorage.getItem('slippage');
    if (Number(slippage)) {
      this.slippageTolerance = slippage;
    } else {
      this.slippageTolerance = '';
    }
    if (!this.currentTokens.length) {
      this.tokenListLoading = true;
    }
    const tokenFromId = icpOrCyclesToSwapTokenId(
      this.$route.params.tokenFromId
    );
    const tokenToId = icpOrCyclesToSwapTokenId(this.$route.params.tokenToId);
    if (
      tokenFromId &&
      (!this.tokens[tokenFromId] ||
        (this.tokens[tokenFromId] && !this.tokens[tokenFromId].logo))
    ) {
      this.$emit('tokenChange', tokenFromId);
    }
    if (
      tokenToId &&
      (!this.tokens[tokenToId] ||
        (this.tokens[tokenToId] && !this.tokens[tokenToId].logo))
    ) {
      this.$emit('tokenChange', tokenToId);
    }
  }
  private connectWallet(): void {
    this.$router.push({
      path: '/login',
      query: { redirect: this.$route.fullPath }
    });
  }
  private setToleranceAuto(): void {
    this.slippageTolerance = '';
    localStorage.setItem('slippage', '');
  }
  private setTolerance(): void {
    this.visibleSwap = false;
    localStorage.setItem('slippage', this.slippageTolerance);
  }
  private changeRate(): void {
    this.showRate = !this.showRate;
  }
  private setMaxAMount(token: SwapTokenInfo, type: string): void {
    this.setMax(token, type);
    if (type === 'from') {
      this.swapFromAmountChange();
    } else {
      this.swapToAmountChange();
    }
  }
  private getConversionRate(): void {
    let value0: bigint;
    let value1: bigint;
    if (!this.dexInfo) {
      return;
    }
    if (this.dexInfo.canisterId.toString() === CYCLES_FINANCE_CANISTER_ID) {
      value0 = (this.liquidity as Liquidity).cycles;
      value1 = (this.liquidity as Liquidity).icpE8s;
    } else {
      value0 = (this.liquidity as TokenLiquidity).token0;
      value1 = (this.liquidity as TokenLiquidity).token1;
    }
    if (Number(value0) && Number(value1)) {
      if (!this.swapToAmount) {
        let rate: BigNumber;
        if (this.isToken0(this.tokenSwapFrom)) {
          rate = new BigNumber(value1.toString(10))
            .div(10 ** this.tokenSwapTo[3].decimals)
            .div(
              new BigNumber(value0.toString(10)).div(
                10 ** this.tokenSwapFrom[3].decimals
              )
            );
        } else {
          rate = new BigNumber(value0.toString(10))
            .div(10 ** this.tokenSwapTo[3].decimals)
            .div(
              new BigNumber(value1.toString(10)).div(
                10 ** this.tokenSwapFrom[3].decimals
              )
            );
        }
        this.conversionRate = rate
          .decimalPlaces(this.tokenSwapTo[3].decimals, 1)
          .toString(10);
        this.conversionRateReverse = new BigNumber(1)
          .div(rate)
          .decimalPlaces(this.tokenSwapFrom[3].decimals, 1)
          .toString(10);
      }
    }
  }
  private onCreatePair(): void {
    this.visible = false;
    this.createPairVisible = true;
  }
  private async getCount(principal: Principal): Promise<bigint> {
    return await this.cyclesFinanceService.getCount([
      principalToAccountIdentifier(principal)
    ]);
  }
  private async cyclesToIcp(): Promise<void> {
    console.time();
    try {
      const principal = localStorage.getItem('principal');
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
        method_name: 'cyclesToIcp',
        cycles: BigInt(
          new BigNumber(this.swapFromAmount).times(10 ** 12).toString(10)
        ),
        args: Array.from(Buffer.from(args))
      };
      this.walletService
        .walletCall(walletCallRequest, this.cyclesCanister.trim())
        .then((res) => {
          console.log(res);
          this.step = 1;
          if ((res as { Ok: { return: Array<number> } }).Ok) {
            setTimeout(async () => {
              console.timeEnd();
              this.swapVisible = false;
              this.$message.success('Cycles to icp Success');
              this.step = 2;
              try {
                this.initToAmount();
                this.initFromAmount();
                this.getTokenBalance(
                  this.tokenSwapFrom[2],
                  this.tokenSwapFrom[0].toString()
                );
                this.getTokenBalance(
                  this.tokenSwapTo[2],
                  this.tokenSwapTo[0].toString()
                );
                this.getPairBalance();
                console.log(this.swapId);
                this.liquidity = await this.getLiquidity(this.swapId);
              } catch (e) {
                //
              }
            }, 10000);
          } else {
            this.swapVisible = false;
            this.$message.error('Cycles to icp fail');
          }
        })
        .catch(() => {
          this.$message.error('Cycles to icp fail');
          this.swapVisible = false;
          // this.recordList.splice(index, 1, record1);
        })
        .finally(() => {
          //
        });
    } catch (e) {
      this.swapVisible = false;
      this.$message.error(e.message);
    }
  }
  private async icpToCycles(): Promise<void> {
    console.time();
    const principal = localStorage.getItem('principal');
    try {
      const flag = await this.checkCycles(this.cyclesCanister.trim());
      if (!flag) {
        this.swapVisible = false;
        return;
      }
      await this.getDepositAccountId();
      const deptTotal = this.getTokenDepositingAndPairBalance(
        this.tokenSwapFrom
      );
      console.log(deptTotal.toString(10));
      if (
        deptTotal
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
          swapFromAmount = new BigNumber(this.swapFromAmount)
            .times(10 ** this.tokenSwapFrom[3].decimals)
            .minus(deptTotal)
            .div(10 ** this.tokenSwapFrom[3].decimals)
            .toString(10);
        } else {
          swapFromAmount = new BigNumber(this.swapFromAmount)
            .times(10 ** this.tokenSwapFrom[3].decimals)
            .minus(deptTotal)
            .plus(getFee(this.tokenSwapFrom[3]).toString(10))
            .div(10 ** this.tokenSwapFrom[3].decimals)
            .toString(10);
        }
        const blockHeight = await this.ledgerService.sendIcp(
          swapFromAmount,
          this.depositAccountId
        );
        console.log(blockHeight);
      }
      const icp = BigInt(
        new BigNumber(this.swapFromAmount)
          .times(10 ** this.tokenSwapFrom[3].decimals)
          .toString(10)
      );
      console.log(icp);
      this.step = 1;
      const nonce = await this.getCount(Principal.fromText(principal));
      this.cyclesFinanceService
        .icpToCycles(icp, Principal.fromText(this.cyclesCanister.trim()), [
          nonce
        ])
        .then(async (res) => {
          console.log(res);
          this.step = 2;
          try {
            this.swapSuccess();
          } catch (e) {
            this.swapVisible = false;
          }
        })
        .catch(() => {
          this.$message.error('Icp to cycles fail');
          this.swapVisible = false;
        })
        .finally(() => {
          console.timeEnd();
          this.swapVisible = false;
          // this.swapLoading.close();
          // this.isLoading = false;
        });
    } catch (e) {
      this.swapVisible = false;
      console.log(e);
    }
  }
  private async onSwap(): Promise<void> {
    console.time();
    await checkAuth();
    const currentSwapService = new ICSwapService();
    const tokenFromStd = Object.keys(this.tokenSwapFrom[2])[0];
    this.swapVisible = true;
    this.step = 0;
    if (this.swapId === CYCLES_FINANCE_CANISTER_ID) {
      if (tokenFromStd === 'cycles') {
        this.cyclesToIcp();
      } else {
        this.icpToCycles();
      }
      return;
    }
    await Promise.all([this.getPairBalance(), this.getCurrentDepositing()]);
    const deptTotal = this.getTokenDepositingAndPairBalance(this.tokenSwapFrom);
    console.log(deptTotal.toString(10));
    let canSwap = false;
    if (
      tokenFromStd === PairTokenStdMenu.dip20 ||
      tokenFromStd === PairTokenStdMenu.drc20
    ) {
      let amount: bigint;
      if (
        deptTotal
          .div(10 ** this.tokenSwapFrom[3].decimals)
          .gte(this.swapFromAmount)
      ) {
        canSwap = true;
      } else {
        amount = BigInt(
          new BigNumber(this.swapFromAmount)
            .times(10 ** this.tokenSwapFrom[3].decimals)
            .minus(deptTotal.toString(10))
            .toString(10)
        );
        console.log(amount);
        canSwap = await this.approve(this.tokenSwapFrom, amount);
      }
    } else {
      if (
        deptTotal
          .div(10 ** this.tokenSwapFrom[3].decimals)
          .gte(this.swapFromAmount)
      ) {
        canSwap = true;
      } else {
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
            .minus(deptTotal)
            .div(10 ** this.tokenSwapFrom[3].decimals)
            .toString(10);
        } else {
          swapFromAmount = new BigNumber(this.swapFromAmount)
            .times(10 ** this.tokenSwapFrom[3].decimals)
            .minus(deptTotal)
            .plus(getFee(this.tokenSwapFrom[3]).toString(10))
            .div(10 ** this.tokenSwapFrom[3].decimals)
            .toString(10);
        }
        console.log(swapFromAmount);
        if (tokenFromStd === PairTokenStdMenu.icp) {
          const block = await this.ledgerService.sendIcp(
            swapFromAmount,
            this.depositAccount[1]
          );
          if (block) {
            canSwap = true;
          }
        }
        if (tokenFromStd === PairTokenStdMenu.icrc1) {
          await this.transferIcrc1(
            this.tokenSwapFrom[0].toString(),
            swapFromAmount,
            this.depositAccount[0]
          );
          canSwap = true;
        }
      }
    }
    if (canSwap) {
      this.step = 1;
      try {
        let orderRequest: OrderRequest;
        const swapAmount = BigInt(
          new BigNumber(this.swapFromAmount)
            .times(10 ** this.tokenSwapFrom[3].decimals)
            .toString(10)
        );
        orderRequest = {
          add: { token: this.tokenSwapFrom[0], value: swapAmount }
        };
        const _data = '00000001'; // swap
        const res = await currentSwapService.swap(
          this.dexInfo.canisterId.toString(),
          orderRequest,
          [],
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
          console.log(res);
          this.step = 2;
          if (this.autoWithdraw) {
            setTimeout(() => {
              this.step = 3;
              this.swapVisible = false;
              this.$message.success('Swap Success');
              this.swapSuccess();
            }, 2000);
          } else {
            this.swapVisible = false;
            this.$message.success('Swap Success');
            this.swapSuccess();
          }
          console.timeEnd();
        } else {
          console.log(res);
          this.$message.error((res as { err: SwapTxnResultErr }).err.message);
          this.swapSuccess();
          this.swapVisible = false;
        }
      } catch (e) {
        console.log(e);
        this.getPairBalance();
        this.getCurrentDepositing();
        this.$message.error('Swap err');
        this.swapVisible = false;
      }
    } else {
      this.swapVisible = false;
    }
  }
  private async swapSuccess(): Promise<void> {
    try {
      this.initToAmount();
      this.initFromAmount();
      this.getTokenBalance(
        this.tokenSwapFrom[2],
        this.tokenSwapFrom[0].toString()
      );
      this.getTokenBalance(this.tokenSwapTo[2], this.tokenSwapTo[0].toString());
      this.getPairBalance();
      this.getCurrentDepositing();
      console.log(this.swapId);
      this.liquidity = await this.getLiquidity(this.swapId);
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
          // this.swapLoading.close();
          return false;
        }
      } catch (e) {
        console.log(e);
        // this.swapLoading.close();
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
          // this.swapLoading.close();
          return false;
        }
      } catch (e) {
        console.log(e);
        // this.swapLoading.close();
        return false;
      }
    }
  }
  private afterClose(): void {
    this.createPairForm = {
      token0Id: '',
      token0Std: this.pairTokenStdMenu.drc20,
      token1Id: '',
      token1Std: this.pairTokenStdMenu.drc20,
      dexName: 'icswap'
    };
    this.createPairToken0Err = this.createPairToken1Err = false;
  }
  private showApprove(): void {
    this.allowanceVisible = false;
    this.$refs.approve.visible = true;
    this.$refs.approve.approveForm.spender = IC_SWAP_ROUTER_CANISTER_ID;
  }
  private async getIclBalance(): Promise<string> {
    const principal = localStorage.getItem('principal');
    const currentDrc20Token = new DRC20TokenService();
    const ICL = await currentDrc20Token.drc20_balanceOf(principal);
    return new BigNumber(ICL.toString(10))
      .div(10 ** 8)
      .decimalPlaces(4, 1)
      .toString(10);
  }
  private async onSubmitCreate(): Promise<void> {
    const checkLoading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const currentDrc20Token = new DRC20TokenService();
    let token0Symbol: string;
    let token1Symbol: string;
    let token0Fee = BigInt(0);
    let token1Fee = BigInt(0);
    let token0Decimals = 0;
    let token1Decimals = 0;
    const flag = needConnectPlug([
      this.createPairForm.token0Id,
      this.createPairForm.token1Id
    ]);
    console.log(flag);
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const connectInfinity = await needConnectInfinity([
      this.createPairForm.token0Id,
      this.createPairForm.token1Id
    ]);
    if (
      (priList[principal] === 'Plug' || priList[principal] === 'SignerPlug') &&
      flag
    ) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      this.$info({
        content: 'ICSwap need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug([
            _that.createPairForm.token0Id,
            _that.createPairForm.token1Id
          ]).then(async () => {
            try {
              if (
                _that.createPairForm.token0Std === 'drc20' ||
                _that.createPairForm.token0Std === 'icrc1' ||
                _that.createPairForm.token0Std === 'icrc2'
              ) {
                token0Symbol = await currentDrc20Token.symbol(
                  _that.createPairForm.token0Id
                );
                const fee = await currentDrc20Token.gas(
                  _that.createPairForm.token0Id
                );
                if (typeof fee === 'bigint') {
                  token0Fee = fee;
                } else if ((fee as { token: bigint }).token) {
                  token0Fee = (fee as { token: bigint }).token;
                }
                token0Decimals = await currentDrc20Token.decimals(
                  _that.createPairForm.token0Id
                );
              } else {
                const metadata = await currentDrc20Token.getMetadata(
                  _that.createPairForm.token0Id
                );
                token0Symbol = metadata.symbol;
              }
              _that.createPairToken0Err = !token0Symbol;
            } catch (e) {
              _that.createPairToken0Err = true;
              console.log(e);
            }
            try {
              if (
                _that.createPairForm.token1Std === 'drc20' ||
                _that.createPairForm.token1Std === 'icrc1' ||
                _that.createPairForm.token0Std === 'icrc2'
              ) {
                token1Symbol = await currentDrc20Token.symbol(
                  _that.createPairForm.token1Id
                );
                const fee = await currentDrc20Token.gas(
                  _that.createPairForm.token1Id
                );
                if (typeof fee === 'bigint') {
                  token1Fee = fee;
                } else if ((fee as { token: bigint }).token) {
                  token1Fee = (fee as { token: bigint }).token;
                }
                token1Decimals = await currentDrc20Token.decimals(
                  _that.createPairForm.token1Id
                );
              } else {
                const metadata = await currentDrc20Token.getMetadata(
                  _that.createPairForm.token1Id
                );
                token1Symbol = metadata.symbol;
              }
              _that.createPairToken1Err = !token1Symbol;
            } catch (e) {
              _that.createPairToken1Err = true;
              console.log(e);
            }
            console.log(token0Symbol, token1Symbol);
            if (token0Symbol && token1Symbol) {
              const iclAllowance = await _that.getAllowance(
                IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
                IC_SWAP_ROUTER_CANISTER_ID
              );
              console.log(iclAllowance);
              const iclDecimals = 8;
              if (
                new BigNumber(iclAllowance.toString(10)).lt(10 ** iclDecimals)
              ) {
                _that.allowanceVisible = true;
                _that.allowanceInfo = {
                  symbol: 'ICL',
                  fee: '100',
                  tokenId: IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
                  decimals: 8
                };
                checkLoading.close();
                return;
              }
              const Icl = await _that.getIclBalance();
              if (new BigNumber(Icl).lt(100.01)) {
                checkLoading.close();
                _that.insufficientVisible = true;
                return;
              }
              if (_that.createPairForm.token0Std === 'drc20') {
                const allowance = await _that.getAllowance(
                  _that.createPairForm.token0Id,
                  IC_SWAP_ROUTER_CANISTER_ID
                );
                if (
                  new BigNumber(allowance.toString(10)).lt(
                    token0Fee.toString(10)
                  )
                ) {
                  _that.allowanceVisible = true;
                  _that.allowanceInfo = {
                    symbol: token0Symbol,
                    fee: new BigNumber(token0Fee.toString(10))
                      .times(2)
                      .div(10 ** token0Decimals)
                      .toString(10),
                    tokenId: _that.createPairForm.token0Id,
                    decimals: token0Decimals
                  };
                  checkLoading.close();
                  return;
                }
              }
              if (_that.createPairForm.token1Std === 'drc20') {
                const allowance = await _that.getAllowance(
                  _that.createPairForm.token1Id,
                  IC_SWAP_ROUTER_CANISTER_ID
                );
                if (
                  new BigNumber(allowance.toString(10)).lt(
                    token1Fee.toString(10)
                  )
                ) {
                  _that.allowanceVisible = true;
                  _that.allowanceInfo = {
                    symbol: token1Symbol,
                    fee: new BigNumber(token1Fee.toString(10))
                      .times(2)
                      .div(10 ** token1Decimals)
                      .toString(10),
                    tokenId: _that.createPairForm.token1Id,
                    decimals: token1Decimals
                  };
                  checkLoading.close();
                  return;
                }
              }
              let token0Std;
              let token1Std;
              token0Std = {};
              token0Std[_that.createPairForm.token0Std] = null;
              token1Std = {};
              token1Std[_that.createPairForm.token1Std] = null;
              const pairRequest: PairRequest = {
                dexName: _that.createPairForm.dexName,
                token0: [
                  Principal.fromText(_that.createPairForm.token0Id),
                  token0Symbol,
                  token0Std
                ],
                token1: [
                  Principal.fromText(_that.createPairForm.token1Id),
                  token1Symbol,
                  token1Std
                ]
              };
              console.log(pairRequest);
              try {
                (checkLoading as any).setText(
                  'Creating swapping pair canister, it takes 20-60 seconds.'
                );
                const res = await _that.ICSwapRouterFiduciaryService.create(
                  pairRequest
                );
                console.log(res);
                _that.createPairVisible = false;
                // todo
                // this.getTokens();
                _that.$message.success('Create swapping pair success');
                await _that.$router.push(
                  `/ICSwap/liquidity/${_that.createPairForm.token0Id}/${_that.createPairForm.token1Id}`
                );
              } catch (e) {
                console.log(e);
                _that.$message.error(toHttpError(e).message);
              }
              checkLoading.close();
            } else {
              checkLoading.close();
            }
          });
        }
      });
    } else if (priList[principal] === 'Infinity' && connectInfinity) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      this.$info({
        content: 'ICSwap need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity([
            _that.createPairForm.token0Id,
            _that.createPairForm.token1Id
          ]).then(async () => {
            try {
              if (
                _that.createPairForm.token0Std === 'drc20' ||
                _that.createPairForm.token0Std === 'icrc1' ||
                _that.createPairForm.token0Std === 'icrc2'
              ) {
                token0Symbol = await currentDrc20Token.symbol(
                  _that.createPairForm.token0Id
                );
                const fee = await currentDrc20Token.gas(
                  _that.createPairForm.token0Id
                );
                if (typeof fee === 'bigint') {
                  token0Fee = fee;
                } else if ((fee as { token: bigint }).token) {
                  token0Fee = (fee as { token: bigint }).token;
                }
                token0Decimals = await currentDrc20Token.decimals(
                  _that.createPairForm.token0Id
                );
              } else {
                const metadata = await currentDrc20Token.getMetadata(
                  _that.createPairForm.token0Id
                );
                token0Symbol = metadata.symbol;
              }
              _that.createPairToken0Err = !token0Symbol;
            } catch (e) {
              _that.createPairToken0Err = true;
              console.log(e);
            }
            try {
              if (
                _that.createPairForm.token1Std === 'drc20' ||
                _that.createPairForm.token1Std === 'icrc1' ||
                _that.createPairForm.token0Std === 'icrc2'
              ) {
                token1Symbol = await currentDrc20Token.symbol(
                  _that.createPairForm.token1Id
                );
                const fee = await currentDrc20Token.gas(
                  _that.createPairForm.token1Id
                );
                if (typeof fee === 'bigint') {
                  token1Fee = fee;
                } else if ((fee as { token: bigint }).token) {
                  token1Fee = (fee as { token: bigint }).token;
                }
                token1Decimals = await currentDrc20Token.decimals(
                  _that.createPairForm.token1Id
                );
              } else {
                const metadata = await currentDrc20Token.getMetadata(
                  _that.createPairForm.token1Id
                );
                token1Symbol = metadata.symbol;
              }
              _that.createPairToken1Err = !token1Symbol;
            } catch (e) {
              _that.createPairToken1Err = true;
              console.log(e);
            }
            console.log(token0Symbol, token1Symbol);
            if (token0Symbol && token1Symbol) {
              const iclAllowance = await _that.getAllowance(
                IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
                IC_SWAP_ROUTER_CANISTER_ID
              );
              console.log(iclAllowance);
              const iclDecimals = 8;
              if (
                new BigNumber(iclAllowance.toString(10)).lt(10 ** iclDecimals)
              ) {
                _that.allowanceVisible = true;
                _that.allowanceInfo = {
                  symbol: 'ICL',
                  fee: '100',
                  tokenId: IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
                  decimals: 8
                };
                checkLoading.close();
                return;
              }
              const Icl = await _that.getIclBalance();
              if (new BigNumber(Icl).lt(100.01)) {
                checkLoading.close();
                _that.insufficientVisible = true;
                return;
              }
              if (_that.createPairForm.token0Std === 'drc20') {
                const allowance = await _that.getAllowance(
                  _that.createPairForm.token0Id,
                  IC_SWAP_ROUTER_CANISTER_ID
                );
                if (
                  new BigNumber(allowance.toString(10)).lt(
                    token0Fee.toString(10)
                  )
                ) {
                  _that.allowanceVisible = true;
                  _that.allowanceInfo = {
                    symbol: token0Symbol,
                    fee: new BigNumber(token0Fee.toString(10))
                      .times(2)
                      .div(10 ** token0Decimals)
                      .toString(10),
                    tokenId: _that.createPairForm.token0Id,
                    decimals: token0Decimals
                  };
                  checkLoading.close();
                  return;
                }
              }
              if (_that.createPairForm.token1Std === 'drc20') {
                const allowance = await _that.getAllowance(
                  _that.createPairForm.token1Id,
                  IC_SWAP_ROUTER_CANISTER_ID
                );
                if (
                  new BigNumber(allowance.toString(10)).lt(
                    token1Fee.toString(10)
                  )
                ) {
                  _that.allowanceVisible = true;
                  _that.allowanceInfo = {
                    symbol: token1Symbol,
                    fee: new BigNumber(token1Fee.toString(10))
                      .times(2)
                      .div(10 ** token1Decimals)
                      .toString(10),
                    tokenId: _that.createPairForm.token1Id,
                    decimals: token1Decimals
                  };
                  checkLoading.close();
                  return;
                }
              }
              let token0Std;
              let token1Std;
              token0Std = {};
              token0Std[_that.createPairForm.token0Std] = null;
              token1Std = {};
              token1Std[_that.createPairForm.token1Std] = null;
              const pairRequest: PairRequest = {
                dexName: _that.createPairForm.dexName,
                token0: [
                  Principal.fromText(_that.createPairForm.token0Id),
                  token0Symbol,
                  token0Std
                ],
                token1: [
                  Principal.fromText(_that.createPairForm.token1Id),
                  token1Symbol,
                  token1Std
                ]
              };
              console.log(pairRequest);
              try {
                (checkLoading as any).setText(
                  'Creating swapping pair canister, it takes 20-60 seconds.'
                );
                const res = await _that.ICSwapRouterFiduciaryService.create(
                  pairRequest
                );
                console.log(res);
                _that.createPairVisible = false;
                // todo
                // this.getTokens();
                _that.$message.success('Create swapping pair success');
                await _that.$router.push(
                  `/ICSwap/liquidity/${_that.createPairForm.token0Id}/${_that.createPairForm.token1Id}`
                );
              } catch (e) {
                console.log(e);
                _that.$message.error(toHttpError(e).message);
              }
              checkLoading.close();
            } else {
              checkLoading.close();
            }
          });
        }
      });
    } else {
      try {
        if (
          this.createPairForm.token0Std === 'drc20' ||
          this.createPairForm.token0Std === 'icrc1' ||
          this.createPairForm.token0Std === 'icrc2'
        ) {
          token0Symbol = await currentDrc20Token.symbol(
            this.createPairForm.token0Id
          );
          const fee = await currentDrc20Token.gas(this.createPairForm.token0Id);
          if (typeof fee === 'bigint') {
            token0Fee = fee;
          } else if ((fee as { token: bigint }).token) {
            token0Fee = (fee as { token: bigint }).token;
          }
          token0Decimals = await currentDrc20Token.decimals(
            this.createPairForm.token0Id
          );
        } else {
          const metadata = await currentDrc20Token.getMetadata(
            this.createPairForm.token0Id
          );
          token0Symbol = metadata.symbol;
        }
        this.createPairToken0Err = !token0Symbol;
      } catch (e) {
        this.createPairToken0Err = true;
        console.log(e);
      }
      try {
        if (
          this.createPairForm.token1Std === 'drc20' ||
          this.createPairForm.token1Std === 'icrc1' ||
          this.createPairForm.token0Std === 'icrc2'
        ) {
          token1Symbol = await currentDrc20Token.symbol(
            this.createPairForm.token1Id
          );
          const fee = await currentDrc20Token.gas(this.createPairForm.token1Id);
          if (typeof fee === 'bigint') {
            token1Fee = fee;
          } else if ((fee as { token: bigint }).token) {
            token1Fee = (fee as { token: bigint }).token;
          }
          token1Decimals = await currentDrc20Token.decimals(
            this.createPairForm.token1Id
          );
        } else {
          const metadata = await currentDrc20Token.getMetadata(
            this.createPairForm.token1Id
          );
          token1Symbol = metadata.symbol;
        }
        this.createPairToken1Err = !token1Symbol;
      } catch (e) {
        this.createPairToken1Err = true;
        console.log(e);
      }
      console.log(token0Symbol, token1Symbol);
      if (token0Symbol && token1Symbol) {
        const iclAllowance = await this.getAllowance(
          IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
          IC_SWAP_ROUTER_CANISTER_ID
        );
        console.log(iclAllowance);
        const iclDecimals = 8;
        if (new BigNumber(iclAllowance.toString(10)).lt(10 ** iclDecimals)) {
          this.allowanceVisible = true;
          this.allowanceInfo = {
            symbol: 'ICL',
            fee: '100',
            tokenId: IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
            decimals: 8
          };
          checkLoading.close();
          return;
        }
        const Icl = await this.getIclBalance();
        if (new BigNumber(Icl).lt(100.01)) {
          checkLoading.close();
          this.insufficientVisible = true;
          return;
        }
        if (this.createPairForm.token0Std === 'drc20') {
          const allowance = await this.getAllowance(
            this.createPairForm.token0Id,
            IC_SWAP_ROUTER_CANISTER_ID
          );
          if (
            new BigNumber(allowance.toString(10)).lt(token0Fee.toString(10))
          ) {
            this.allowanceVisible = true;
            this.allowanceInfo = {
              symbol: token0Symbol,
              fee: new BigNumber(token0Fee.toString(10))
                .times(2)
                .div(10 ** token0Decimals)
                .toString(10),
              tokenId: this.createPairForm.token0Id,
              decimals: token0Decimals
            };
            checkLoading.close();
            return;
          }
        }
        if (this.createPairForm.token1Std === 'drc20') {
          const allowance = await this.getAllowance(
            this.createPairForm.token1Id,
            IC_SWAP_ROUTER_CANISTER_ID
          );
          if (
            new BigNumber(allowance.toString(10)).lt(token1Fee.toString(10))
          ) {
            this.allowanceVisible = true;
            this.allowanceInfo = {
              symbol: token1Symbol,
              fee: new BigNumber(token1Fee.toString(10))
                .times(2)
                .div(10 ** token1Decimals)
                .toString(10),
              tokenId: this.createPairForm.token1Id,
              decimals: token1Decimals
            };
            checkLoading.close();
            return;
          }
        }
        let token0Std;
        let token1Std;
        token0Std = {};
        token0Std[this.createPairForm.token0Std] = null;
        token1Std = {};
        token1Std[this.createPairForm.token1Std] = null;
        const pairRequest: PairRequest = {
          dexName: this.createPairForm.dexName,
          token0: [
            Principal.fromText(this.createPairForm.token0Id),
            token0Symbol,
            token0Std
          ],
          token1: [
            Principal.fromText(this.createPairForm.token1Id),
            token1Symbol,
            token1Std
          ]
        };
        console.log(pairRequest);
        try {
          (checkLoading as any).setText(
            'Creating swapping pair canister, it takes 20-60 seconds.'
          );
          const res = await this.ICSwapRouterFiduciaryService.create(
            pairRequest
          );
          console.log(res);
          this.createPairVisible = false;
          // todo
          // this.getTokens();
          this.$message.success('Create swapping pair Success');
          await this.$router.push(
            `/ICSwap/liquidity/${this.createPairForm.token0Id}/${this.createPairForm.token1Id}`
          );
        } catch (e) {
          console.log(e);
          this.$message.error(toHttpError(e).message);
        }
        checkLoading.close();
      } else {
        checkLoading.close();
      }
    }
  }
  private async getAllowance(
    tokenId: string,
    spender: string
  ): Promise<bigint> {
    const currentDrc20Token = new DRC20TokenService();
    const principal = localStorage.getItem('principal');
    return await currentDrc20Token.drc20_allowance(principal, spender, tokenId);
  }
  private validatePrincipal(principal: string): boolean {
    return validatePrincipal(principal);
  }
  private async swapFromAmountChange(): Promise<void> {
    if (
      this.tokenSwapFrom &&
      this.tokenSwapTo &&
      this.liquidity &&
      this.swapFromAmount
    ) {
      try {
        const feeRate = this.getTokenValueAndFee().feeRate;
        const value0 = this.getTokenValueAndFee().value0;
        const value1 = this.getTokenValueAndFee().value1;
        const product = this.getTokenValueAndFee().product;
        // const tokenSwapToFee = this.getTokenValueAndFee().tokenSwapToFee;
        const tokenSwapFromFee = this.getTokenValueAndFee().tokenSwapFromFee;
        const fromStd = Object.keys(this.tokenSwapFrom[2])[0];
        let tokenSwapFromCreditRecord: BigNumber;
        if (
          this.swapId === CYCLES_FINANCE_CANISTER_ID ||
          ((fromStd === 'icp' || fromStd === 'icrc1' || fromStd === 'icrc2') &&
            this.getTokenDepositingAndPairBalance(this.tokenSwapFrom)
              .div(10 ** this.tokenSwapFrom[3].decimals)
              .lt(this.swapFromAmount))
        ) {
          tokenSwapFromCreditRecord = new BigNumber(this.swapFromAmount)
            .times(10 ** this.tokenSwapFrom[3].decimals)
            .minus(tokenSwapFromFee);
        } else {
          tokenSwapFromCreditRecord = new BigNumber(this.swapFromAmount).times(
            10 ** this.tokenSwapFrom[3].decimals
          );
        }
        let tokenSwapToDebitRecord: BigNumber;
        if (this.isToken0(this.tokenSwapFrom)) {
          // from->to,form is token0
          tokenSwapToDebitRecord = new BigNumber(value1.toString(10)).minus(
            product.div(
              new BigNumber(value0.toString(10)).plus(tokenSwapFromCreditRecord)
            )
          );
        } else {
          // from->to,form is token1
          tokenSwapToDebitRecord = new BigNumber(value0.toString(10)).minus(
            product.div(
              new BigNumber(value1.toString(10)).plus(tokenSwapFromCreditRecord)
            )
          );
        }
        console.log(
          tokenSwapFromCreditRecord.toString(),
          tokenSwapToDebitRecord.toString()
        );
        let tokenSwapToAmount: string;
        // if (this.autoWithdraw) {
        //   console.log(tokenSwapToFee);
        //   tokenSwapToAmount = tokenSwapToDebitRecord
        //     .times(feeRate)
        //     .minus(tokenSwapToFee.toString(10))
        //     .toString(10);
        // } else {
        //   tokenSwapToAmount = tokenSwapToDebitRecord
        //     .times(feeRate)
        //     .toString(10);
        // }
        tokenSwapToAmount = tokenSwapToDebitRecord.times(feeRate).toString(10);
        if (Number(tokenSwapToAmount) > 0) {
          this.swapToAmount = new BigNumber(tokenSwapToAmount)
            .div(10 ** this.tokenSwapTo[3].decimals)
            .decimalPlaces(this.tokenSwapTo[3].decimals, 1)
            .toString(10);
          this.swapFee = tokenSwapToDebitRecord
            .times(this.dexInfo.feeRate)
            .div(10 ** this.tokenSwapTo[3].decimals)
            .decimalPlaces(this.tokenSwapTo[3].decimals, 1)
            .toString(10);
          const rate = tokenSwapToDebitRecord
            .div(10 ** this.tokenSwapTo[3].decimals)
            .div(
              tokenSwapFromCreditRecord.div(
                10 ** this.tokenSwapFrom[3].decimals
              )
            );
          if (rate) {
            this.conversionRate = rate
              .decimalPlaces(this.tokenSwapTo[3].decimals, 1)
              .toString(10);
            this.conversionRateReverse = new BigNumber(1)
              .div(rate)
              .decimalPlaces(this.tokenSwapFrom[3].decimals, 1)
              .toString(10);
            this.getSlippage(
              value0,
              value1,
              tokenSwapFromCreditRecord,
              tokenSwapToDebitRecord
            );
          }
        } else {
          this.initToAmount();
        }
        console.log(this.dexInfo, this.tokenSwapFrom);
      } catch (e) {
        console.log(e);
        this.initToAmount();
      }
    } else {
      this.initToAmount();
    }
  }
  private getTokenValueAndFee(): any {
    const feeRate = new BigNumber(1).minus(this.dexInfo.feeRate);
    let value0: bigint;
    let value1: bigint;
    if (this.dexInfo.canisterId.toString() === CYCLES_FINANCE_CANISTER_ID) {
      value0 = (this.liquidity as Liquidity).cycles;
      value1 = (this.liquidity as Liquidity).icpE8s;
    } else {
      value0 = (this.liquidity as TokenLiquidity).token0;
      value1 = (this.liquidity as TokenLiquidity).token1;
    }
    const product = new BigNumber(value0.toString(10)).times(
      value1.toString(10)
    );
    let tokenSwapToFee: bigint;
    let tokenSwapFromFee: bigint;
    if (
      typeof this.tokenSwapTo[3].fee === 'bigint' ||
      typeof this.tokenSwapTo[3].fee === 'string'
    ) {
      tokenSwapToFee = this.tokenSwapTo[3].fee as bigint;
    } else if ((this.tokenSwapTo[3].fee as { token: bigint }).token) {
      tokenSwapToFee = (this.tokenSwapTo[3].fee as { token: bigint }).token;
    } else {
      tokenSwapToFee = BigInt(0);
    }
    if (
      typeof this.tokenSwapFrom[3].fee === 'bigint' ||
      typeof this.tokenSwapFrom[3].fee === 'string'
    ) {
      tokenSwapFromFee = this.tokenSwapFrom[3].fee as bigint;
    } else if ((this.tokenSwapFrom[3].fee as { token: bigint }).token) {
      tokenSwapFromFee = (this.tokenSwapFrom[3].fee as { token: bigint }).token;
    } else {
      tokenSwapFromFee = BigInt(0);
    }
    return {
      feeRate: feeRate,
      value0: value0,
      value1: value1,
      product: product,
      tokenSwapToFee: tokenSwapToFee,
      tokenSwapFromFee: tokenSwapFromFee
    };
  }
  private async swapToAmountChange(): Promise<void> {
    if (
      this.tokenSwapFrom &&
      this.tokenSwapTo &&
      this.liquidity &&
      this.swapToAmount
    ) {
      try {
        const feeRate = this.getTokenValueAndFee().feeRate;
        const value0 = this.getTokenValueAndFee().value0;
        const value1 = this.getTokenValueAndFee().value1;
        const product = this.getTokenValueAndFee().product;
        // const tokenSwapToFee = this.getTokenValueAndFee().tokenSwapToFee;
        const tokenSwapFromFee = this.getTokenValueAndFee().tokenSwapFromFee;
        let tokenSwapFromCreditRecord: BigNumber;
        // const toStd = Object.keys(this.tokenSwapTo[2])[0];
        let tokenSwapToDebitRecord: BigNumber;
        // if (this.autoWithdraw) {
        //   tokenSwapToDebitRecord = new BigNumber(this.swapToAmount)
        //     .times(10 ** this.tokenSwapTo[3].decimals)
        //     .plus(tokenSwapToFee.toString(10))
        //     .div(feeRate);
        // } else {
        //   tokenSwapToDebitRecord = new BigNumber(this.swapToAmount)
        //     .times(10 ** this.tokenSwapTo[3].decimals)
        //     .div(feeRate);
        // }
        tokenSwapToDebitRecord = new BigNumber(this.swapToAmount)
          .times(10 ** this.tokenSwapTo[3].decimals)
          .div(feeRate);
        if (this.isToken0(this.tokenSwapFrom)) {
          // from->to,form is token0
          tokenSwapFromCreditRecord = product
            .div(
              new BigNumber(value1.toString(10)).minus(tokenSwapToDebitRecord)
            )
            .minus(value0.toString(10));
        } else {
          // from->to,form is token1
          tokenSwapFromCreditRecord = product
            .div(
              new BigNumber(value0.toString(10)).minus(tokenSwapToDebitRecord)
            )
            .minus(value1.toString(10));
        }
        if (tokenSwapFromCreditRecord.gt(0)) {
          const fromStd = Object.keys(this.tokenSwapFrom[2])[0];
          if (
            this.swapId === CYCLES_FINANCE_CANISTER_ID ||
            ((fromStd === 'icp' ||
              fromStd === 'icrc1' ||
              fromStd === 'icrc2') &&
              this.getTokenDepositingAndPairBalance(this.tokenSwapFrom)
                .div(10 ** this.tokenSwapFrom[3].decimals)
                .lt(tokenSwapFromCreditRecord))
          ) {
            this.swapFromAmount = new BigNumber(tokenSwapFromCreditRecord)
              .plus(tokenSwapFromFee.toString(10))
              .div(10 ** this.tokenSwapFrom[3].decimals)
              .decimalPlaces(this.tokenSwapFrom[3].decimals)
              .toString(10);
          } else {
            this.swapFromAmount = new BigNumber(tokenSwapFromCreditRecord)
              .div(10 ** this.tokenSwapFrom[3].decimals)
              .decimalPlaces(this.tokenSwapFrom[3].decimals)
              .toString(10);
          }
          this.swapFee = tokenSwapToDebitRecord
            .times(this.dexInfo.feeRate)
            .div(10 ** this.tokenSwapTo[3].decimals)
            .decimalPlaces(this.tokenSwapTo[3].decimals, 1)
            .toString(10);
          const rate = tokenSwapToDebitRecord
            .div(10 ** this.tokenSwapTo[3].decimals)
            .div(
              tokenSwapFromCreditRecord.div(
                10 ** this.tokenSwapFrom[3].decimals
              )
            );
          if (rate) {
            this.conversionRate = rate
              .decimalPlaces(this.tokenSwapTo[3].decimals, 1)
              .toString(10);
            this.conversionRateReverse = new BigNumber(1)
              .div(rate)
              .decimalPlaces(this.tokenSwapFrom[3].decimals, 1)
              .toString(10);
            this.getSlippage(
              value0,
              value1,
              tokenSwapFromCreditRecord,
              tokenSwapToDebitRecord
            );
          }
        } else {
          this.initFromAmount();
        }
      } catch (e) {
        console.log(e);
        this.initFromAmount();
      }
    } else {
      this.initFromAmount();
    }
  }
  private initToAmount(): void {
    this.swapFee = '';
    // this.swapFromAmount = '';
    this.swapToAmount = '';
    // this.conversionRate = '';
    this.swapFee = '';
    this.slippage = 0;
  }
  private initFromAmount(): void {
    this.swapFee = '';
    this.swapFromAmount = '';
    // this.swapToAmount = '';
    // this.conversionRate = '';
    this.swapFee = '';
    this.slippage = 0;
  }
  private getSlippage(
    value0: bigint,
    value1: bigint,
    tokenSwapFromCreditRecord: BigNumber,
    tokenSwapToDebitRecord: BigNumber
  ): void {
    let newValue0: BigNumber;
    let newValue1: BigNumber;
    if (this.isToken0(this.tokenSwapFrom)) {
      // from->to,form is token0, token0 CreditRecord
      newValue0 = new BigNumber(value0.toString(10)).plus(
        tokenSwapFromCreditRecord
      );
      newValue1 = new BigNumber(value1.toString(10)).minus(
        tokenSwapToDebitRecord
      );
    } else {
      // from->to,form is token1, token1 CreditRecord
      newValue0 = new BigNumber(value0.toString(10)).minus(
        tokenSwapToDebitRecord
      );
      newValue1 = new BigNumber(value1.toString(10)).plus(
        tokenSwapFromCreditRecord
      );
    }
    const rate = new BigNumber(value0.toString(10)).div(value1.toString(10));
    const newRate = new BigNumber(newValue0).div(newValue1);
    this.slippage = Number(
      new BigNumber(newRate)
        .minus(rate)
        .div(rate)
        .times(10000)
        .integerValue(BigNumber.ROUND_DOWN)
        .div(100)
        .toString(10)
    );
    console.log(rate.toString(), newRate.toString(), this.slippage);
  }
  private async onselect(token: SwapTokenInfo): Promise<void> {
    this.visible = false;
    if (this.selectTokenType === 'from') {
      if (
        !this.tokenSwapFrom ||
        this.tokenSwapFrom[0].toString() !== token[0].toString()
      ) {
        this.swapId = '';
        this.liquidity = null;
        this.dexInfo = null;
        this.tokenSwapFrom = token;
        this.tokenSwapTo = null;
        this.initFromAmount();
        await this.$router.push(
          `/ICSwap/swap/${swapTokenIdToIcpOrCycles(token[0].toString())}`
        );
      }
    } else {
      if (
        !this.tokenSwapTo ||
        this.tokenSwapTo[0].toString() !== token[0].toString()
      ) {
        this.swapId = '';
        this.liquidity = null;
        this.dexInfo = null;
        this.tokenSwapTo = token;
        await this.$router.push(
          `/ICSwap/swap/${swapTokenIdToIcpOrCycles(
            this.tokenSwapFrom[0].toString()
          )}/${swapTokenIdToIcpOrCycles(token[0].toString())}`
        );
        this.initToAmount();
        this.init();
      }
    }
    if (this.selectTokenType === 'from') {
      this.swapToAmountChange();
    } else {
      this.swapFromAmountChange();
    }
  }
  private showKLine(): void {
    this.$refs.kLine.kLineVisible = true;
    this.$refs.kLine.init();
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
  private changeSwapType(): void {
    this.showRate = true;
    if (!this.tokenSwapTo) {
      return;
    }
    [this.tokenSwapFrom, this.tokenSwapTo] = [
      this.tokenSwapTo,
      this.tokenSwapFrom
    ];
    [this.swapToAmount, this.swapFromAmount] = [
      this.swapFromAmount,
      this.swapToAmount
    ];
    this.$router.push(
      `/ICSwap/swap/${swapTokenIdToIcpOrCycles(
        this.tokenSwapFrom[0].toString()
      )}/${swapTokenIdToIcpOrCycles(this.tokenSwapTo[0].toString())}`
    );
    // this.getPairsByToken(this.tokenSwapFrom[0], false);
    this.getConversionRate();
    if (this.isToken0(this.tokenSwapFrom)) {
      this.swapFromAmountChange();
    } else {
      this.swapToAmountChange();
    }
  }
}
</script>

<style scoped lang="scss">
.modal-label {
  color: #adb3c4;
}
.slippage-tolerance-item {
  margin: 10px 0 20px;
}
.slippage-tolerance-err {
  color: #faad14;
}
.slippage-tolerance {
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    width: 60px;
    height: 36px;
    margin-right: 10px;
  }
  .active {
    ::v-deep input {
      border: 1px solid #3aa8b5 !important;
    }
  }
}
.ic-swap-main {
  padding-bottom: 20px;
}
.exchange-swap-liquidity {
  display: flex;
  margin-top: 20px;
  padding: 0 20px;
  text-align: right;
  color: #8c90a1;
  .exchange-swap-liquidity-h5 {
    i {
      margin: 0 5px;
    }
  }
}
.slippage-tip {
  opacity: 0.8;
  font-size: 12px;
}
.slippage-span {
  color: #21c77d;
}
.slippage-error {
  color: #d13651;
}
.swap-item {
  input {
    text-align: right !important;
  }
}
.no-cycles-wallet {
  position: relative;
  bottom: 30px;
  font-size: 12px;
  text-align: center;
  a {
    color: #1996c4;
  }
  &.no-cycles-wallet-cycles {
    bottom: 30px;
  }
}
.swap-setting-item {
  display: flex;
  align-items: center;
  margin: -10px 0 20px;
  i {
    color: #51b7c3;
    cursor: pointer;
    margin-left: 10px;
  }
}
.swap-setting {
  margin-left: auto;
  &.swap-setting-cycles {
  }
}
.swap-item-dex-name {
  &.swap-item-dex-name-cycles {
  }
  a {
    color: #1996c4;
  }
}
.create-pair {
  margin-top: 30px;
  padding: 0 30px;
}
.create-swapping-pair {
  padding: 0 30px;
  ::v-deep .ant-select-selection__rendered {
    line-height: 34px;
  }
}
.create-swapping-pair-plus {
  text-align: center;
  i {
    font-size: 20px;
  }
}
.pair-token-err {
  color: #f5222d;
}
.delete-modal {
  ::v-deep .ant-modal-body {
    padding: 20px 50px;
  }
}
.max-amount {
  color: #1996c4;
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  .pc-show {
    display: none;
  }
  .swap-item-dex-name {
    display: flex;
    flex-direction: column;
  }
  .swap-setting-item {
    align-items: flex-start;
  }
  .exchange-fee-item {
    flex-wrap: wrap;
    .exchange-fee-item-h5 {
      display: none;
    }
    dl {
      width: 50%;
    }
  }
  .ic-swap-main {
    width: 100%;
    padding: 0 15px 20px;
    .swap-item {
      padding: 30px 10px !important;
    }
  }
  .exchange-swap-item-top-logo {
    margin-right: auto;
  }
  .ic-swap-main {
    .ant-input-affix-wrapper {
      width: 50%;
    }
    .input-cycles-select {
      width: 50%;
    }
    .exchange-swap-item-top-input {
      width: 50%;
    }
  }
  .exchange-record {
    overflow: auto;
  }
  td {
    white-space: nowrap;
  }
  .exchange-swap-liquidity {
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
  }
  .exchange-swap-liquidity-h5 {
    display: none;
  }
  .shares-main {
    flex-wrap: wrap;
    .shares-main-total,
    .shares-main-user {
      width: 50%;
    }
  }
}
</style>
