<template>
  <div>
    <div class="ic-balance-main">
      <div v-if="type === 'ic'" class="ic-balance-item-container-icp">
        <div class="ic-balance-item">
          <p>
            ICP Balance
            <a-icon
              @click="refreshBalance"
              v-show="!refreshBalanceLoading"
              type="reload"
              class="reload-icon"
            />
            <a-icon
              v-show="refreshBalanceLoading"
              type="loading"
              class="reload-icon"
            />
          </p>
          <div class="icp-balance-main">
            <span class="balance">
              {{ balance | bigintToFloat(8, 0) | formatNum }}&nbsp;ICP
            </span>
            <div
              style="padding-bottom: 20px; padding-top: 10px"
              class="operation ic-token-operation"
            >
              <button
                type="button"
                class="primary primary-receive"
                @click="showReceive"
              >
                <span>Receive</span>
              </button>
              <button type="button" @click="showTransfer">
                <span>Transfer</span>
              </button>
              <button type="button" @click="showApprove">
                <span>Approve</span>
              </button>
              <button type="button" @click="showTopUp">
                <span>Top-up</span>
              </button>
              <router-link
                class="button-history"
                tag="button"
                to="/account/TransactionList/icp"
              >
                <span>Transactions</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-if="type === 'cross'">
        <div class="cross-title">
          <p>
            ICRouter:
            <span
              >Tokens cross-chaining based on Threshold Signature Scheme
              (TSS).</span
            >
          </p>
          <div
            v-if="minterInfo && minterInfo.depositMethod"
            class="minting-method-info margin-left-auto"
          >
            <span class="base-font-title">Minting:&nbsp;&nbsp;</span>
            <div class="minting-method-type">
              <a-tooltip placement="top">
                <template slot="title">
                  Method 1 supports all wallets.
                </template>
                <span
                  class="pc-show"
                  @click="changeDepositMethod(1)"
                  :class="{
                    active: depositMethod === 1,
                    disabled:
                      minterInfo.depositMethod === 2 || changeMethodDisabled
                  }"
                  >Method 1</span
                >
              </a-tooltip>
              <span
                class="h5-show"
                @click="changeDepositMethod(1)"
                :class="{
                  active: depositMethod === 1,
                  disabled:
                    minterInfo.depositMethod === 2 || changeMethodDisabled
                }"
                >Method 1</span
              >
              <a-tooltip placement="top">
                <template slot="title">
                  Method 2 is quicker and supports only MetaMask wallet.
                </template>
                <span
                  class="pc-show"
                  @click="changeDepositMethod(2)"
                  :class="{
                    active: depositMethod === 2,
                    disabled:
                      minterInfo.depositMethod === 1 || changeMethodDisabled
                  }"
                  >Method 2</span
                >
              </a-tooltip>
              <span
                class="h5-show"
                @click="changeDepositMethod(2)"
                :class="{
                  active: depositMethod === 2,
                  disabled:
                    minterInfo.depositMethod === 1 || changeMethodDisabled
                }"
                >Method 2</span
              >
            </div>
          </div>
        </div>
        <div
          class="
            ic-balance-item-container-item ic-balance-item-container-item-cross
          "
        >
          <div class="cross-info">
            <div class="cross-main">
              <div class="cross-item">
                <div class="ic-balance-item-launch-event-select">
                  <a-select
                    class="select-erc20-token"
                    v-model="networkIdMint"
                    @change="changeNetworkIdMint"
                    :disabled="networkTokens.length <= 5"
                  >
                    <span
                      class="ic-router-token-placeholder"
                      slot="placeholder"
                    >
                      <span class="ic-router-token-symbol"></span>
                      Select a network
                    </span>
                    <a-select-option
                      v-for="(network, index) in networkListFrom"
                      :key="index"
                      class="select-erc20-network-dropdown"
                    >
                      <img
                        class="ic-router-token-logo"
                        v-if="network.logo"
                        :src="network.logo"
                        alt=""
                      /><span v-else class="ic-router-token-symbol"></span>
                      {{ network.name }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="ic-balance-item-launch-event-select">
                  <div
                    class="ic-balance-item-launch-event-selected-icon"
                    v-if="typeof networkTokenIdMint === 'number'"
                  >
                    <img
                      class="ic-router-token-logo"
                      v-if="networkTokensFrom[networkTokenIdMint].logo"
                      :src="networkTokensFrom[networkTokenIdMint].logo"
                      alt=""
                    />
                    <img
                      class="ic-router-token-logo"
                      v-if="
                        !networkTokensFrom[networkTokenIdMint].logo &&
                        networkTokensFrom[networkTokenIdMint].networkId ===
                          '-1' &&
                        tokens &&
                        tokens[networkTokensFrom[networkTokenIdMint].tokenId] &&
                        tokens[networkTokensFrom[networkTokenIdMint].tokenId]
                          .logo
                      "
                      :src="
                        tokens[networkTokensFrom[networkTokenIdMint].tokenId]
                          .logo
                      "
                      alt=""
                    />
                    <img
                      class="ic-router-token-logo"
                      v-if="
                        !networkTokensFrom[networkTokenIdMint].logo &&
                        (networkTokensFrom[networkTokenIdMint].networkId ===
                          '1' ||
                          networkTokensFrom[networkTokenIdMint].networkId ===
                            '2' ||
                          networkTokensFrom[networkTokenIdMint].networkId ===
                            '3')
                      "
                      src="@/assets/img/empty-token.png"
                      alt=""
                    />
                    <span
                      v-if="
                        networkTokensFrom[networkTokenIdMint].networkId ===
                          '-1' &&
                        !networkTokensFrom[networkTokenIdMint].logo &&
                        !(
                          tokens &&
                          tokens[
                            networkTokensFrom[networkTokenIdMint].tokenId
                          ] &&
                          tokens[networkTokensFrom[networkTokenIdMint].tokenId]
                            .logo
                        )
                      "
                      class="ic-router-token-symbol"
                    >
                      {{
                        networkTokensFrom[networkTokenIdMint].symbol
                          .slice(0, 1)
                          .toLocaleUpperCase()
                      }}
                    </span>
                  </div>
                  <a-select
                    class="select-erc20-token select-erc20-token-event"
                    v-model="networkTokenIdMint"
                    @change="changeNetworkTokenIdMint"
                    :disabled="typeof networkIdMint !== 'number'"
                    option-label-prop="label"
                  >
                    <span
                      class="ic-router-token-placeholder"
                      slot="placeholder"
                    >
                      <span class="ic-router-token-symbol"></span>
                      Select a token
                    </span>
                    <a-select-option
                      v-for="(token, index) in networkTokensFrom"
                      :key="index"
                      :label="`${token.symbol} (${
                        networkIds[token.networkId]
                      })`"
                      class="select-erc20-token-dropdown"
                    >
                      <div class="ic-router-token-info">
                        <div class="ic-router-token-info-left">
                          <img
                            class="ic-router-token-logo"
                            v-if="token.logo"
                            :src="token.logo"
                            alt=""
                          />
                          <img
                            class="ic-router-token-logo"
                            v-if="
                              !token.logo &&
                              token.networkId === '-1' &&
                              tokens &&
                              tokens[token.tokenId] &&
                              tokens[token.tokenId].logo
                            "
                            :src="tokens[token.tokenId].logo"
                            alt=""
                          />
                          <img
                            class="ic-router-token-logo"
                            v-if="
                              !token.logo &&
                              (token.networkId === '1' ||
                                token.networkId === '2' ||
                                token.networkId === '3')
                            "
                            src="@/assets/img/empty-token.png"
                            alt=""
                          />
                          <span
                            v-if="
                              token.networkId === '-1' &&
                              !token.logo &&
                              !(
                                tokens &&
                                tokens[token.tokenId] &&
                                tokens[token.tokenId].logo
                              )
                            "
                            class="ic-router-token-symbol"
                          >
                            {{ token.symbol.slice(0, 1).toLocaleUpperCase() }}
                          </span>
                        </div>
                        <div class="ic-router-token-info-right">
                          <span class="ic-router-token-info-symbol">
                            {{ token.symbol }} ({{
                              networkIds[token.networkId]
                            }})
                          </span>
                          <span
                            v-if="
                              token.networkId === '-1' &&
                              tokens &&
                              tokens[token.tokenId] &&
                              tokens[token.tokenId].name
                            "
                            class="ic-router-token-info-name"
                          >
                            {{ tokens[token.tokenId].name }}
                          </span>
                          <span
                            v-if="
                              (token.networkId === '1' ||
                                token.networkId === '2') &&
                              token.id !==
                                '0x0000000000000000000000000000000000000000'
                            "
                            class="ic-router-token-info-name"
                          >
                            {{ token.id | ellipsisAccount(20) }}
                          </span>
                        </div>
                      </div>
                    </a-select-option>
                  </a-select>
                </div>
                <div
                  class="chain-hub-token-info"
                  v-if="typeof networkTokenIdMint === 'number'"
                >
                  <div
                    v-if="
                      (networkTokensFrom[networkTokenIdMint].networkToIcId ===
                        '2' ||
                        networkTokensFrom[networkTokenIdMint].networkToIcId ===
                          '1') &&
                      networkTokensFrom[networkTokenIdMint].networkId === '-1'
                    "
                  >
                    Canister Id:
                    <a
                      :href="
                        networkTokensFrom[networkTokenIdMint].networkToIcId ===
                        '2'
                          ? `https://ic.house/tokensTest/token/${networkTokensFrom[networkTokenIdMint].tokenId}`
                          : `https://ic.house/token/${networkTokensFrom[networkTokenIdMint].tokenId}`
                      "
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{
                        networkTokensFrom[networkTokenIdMint].tokenId
                          | ellipsisAccount(6)
                      }}
                    </a>
                    <div
                      style="margin-top: 5px"
                      v-if="
                        ERC20Balance[
                          networkTokensFrom[networkTokenIdMint].tokenId
                        ]
                      "
                    >
                      Balance:
                      <span>
                        {{
                          ERC20Balance[
                            networkTokensFrom[networkTokenIdMint].tokenId
                          ]
                            | bigintToFloat(
                              8,
                              networkTokensFrom[networkTokenIdMint].icTokenInfo
                                .decimals
                            )
                            | formatAmount(8)
                        }}
                      </span>
                    </div>
                  </div>
                  <div
                    v-if="
                      networkTokensFrom[networkTokenIdMint].networkId === '1' ||
                      networkTokensFrom[networkTokenIdMint].networkId === '2'
                    "
                  >
                    <div
                      v-show="
                        networkTokensFrom[networkTokenIdMint].id !=
                        '0x0000000000000000000000000000000000000000'
                      "
                    >
                      Contract:
                      <a
                        :href="
                          networkTokensFrom[networkTokenIdMint].networkId ===
                          '2'
                            ? `https://goerli.etherscan.io/token/${networkTokensFrom[networkTokenIdMint].id}#code`
                            : `https://etherscan.io/token/${networkTokensFrom[networkTokenIdMint].id}#code`
                        "
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                      >
                        {{
                          networkTokensFrom[networkTokenIdMint].id
                            | ellipsisAccount(6)
                        }}
                      </a>
                    </div>
                    <div
                      v-show="
                        ethereumIsConnected &&
                        ERC20EthereumBalance[
                          networkTokensFrom[networkTokenIdMint].tokenId
                        ]
                      "
                      style="margin-top: 5px"
                    >
                      Balance:
                      <span>
                        {{
                          ERC20EthereumBalance[
                            networkTokensFrom[networkTokenIdMint].tokenId
                          ]
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                :class="{ pointer: !mintDisabled }"
                class="cross-item-icon base-font-title pc-show"
                @click="switchHub"
              >
                <a-icon class="cross-item-icon-right" type="arrow-right" />
              </div>
              <div
                :class="{ pointer: !mintDisabled }"
                @click="switchHub"
                class="base-font-title h5-show cross-item-icon-down"
              >
                <a-icon type="arrow-down" />
              </div>
              <div class="cross-item">
                <div class="ic-balance-item-launch-event-select">
                  <a-select
                    class="select-erc20-token"
                    v-model="networkIdMintTo"
                    @change="changeNetworkIdMintTo"
                    :disabled="typeof networkTokenIdMint !== 'number'"
                  >
                    <span
                      class="ic-router-token-placeholder"
                      slot="placeholder"
                    >
                      <span class="ic-router-token-symbol"></span>
                      Select a network
                    </span>
                    <a-select-option
                      v-for="(network, index) in networkListTo"
                      :key="index"
                      class="select-erc20-network-dropdown"
                    >
                      <img
                        class="ic-router-token-logo"
                        v-if="network.logo"
                        :src="network.logo"
                        alt=""
                      /><span v-else class="ic-router-token-symbol"></span>
                      {{ network.name }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="ic-balance-item-launch-event-select">
                  <div
                    class="ic-balance-item-launch-event-selected-icon"
                    v-if="typeof networkTokenIdMintTo === 'number'"
                  >
                    <img
                      class="ic-router-token-logo"
                      v-if="networkTokensTo[networkTokenIdMintTo].logo"
                      :src="networkTokensTo[networkTokenIdMintTo].logo"
                      alt=""
                    />
                    <img
                      class="ic-router-token-logo"
                      v-if="
                        !networkTokensTo[networkTokenIdMintTo].logo &&
                        networkTokensTo[networkTokenIdMintTo].networkId ===
                          '-1' &&
                        tokens &&
                        tokens[networkTokensTo[networkTokenIdMintTo].tokenId] &&
                        tokens[networkTokensTo[networkTokenIdMintTo].tokenId]
                          .logo
                      "
                      :src="
                        tokens[networkTokensTo[networkTokenIdMintTo].tokenId]
                          .logo
                      "
                      alt=""
                    />
                    <img
                      class="ic-router-token-logo"
                      v-if="
                        !networkTokensTo[networkTokenIdMintTo].logo &&
                        (networkTokensTo[networkTokenIdMintTo].networkId ===
                          '1' ||
                          networkTokensTo[networkTokenIdMintTo].networkId ===
                            '2' ||
                          networkTokensTo[networkTokenIdMintTo].networkId ===
                            '3')
                      "
                      src="@/assets/img/empty-token.png"
                      alt=""
                    />
                    <span
                      v-if="
                        networkTokensTo[networkTokenIdMintTo].networkId ===
                          '-1' &&
                        !networkTokensTo[networkTokenIdMintTo].logo &&
                        !(
                          tokens &&
                          tokens[
                            networkTokensTo[networkTokenIdMintTo].tokenId
                          ] &&
                          tokens[networkTokensTo[networkTokenIdMintTo].tokenId]
                            .logo
                        )
                      "
                      class="ic-router-token-symbol"
                    >
                      {{
                        networkTokensTo[networkTokenIdMintTo].symbol
                          .slice(0, 1)
                          .toLocaleUpperCase()
                      }}
                    </span>
                  </div>
                  <a-select
                    class="select-erc20-token select-erc20-token-event"
                    v-model="networkTokenIdMintTo"
                    @change="changeNetworkTokenIdMintTo"
                    :disabled="typeof networkIdMintTo !== 'number'"
                    option-label-prop="label"
                  >
                    <span
                      class="ic-router-token-placeholder"
                      slot="placeholder"
                    >
                      <span class="ic-router-token-symbol"></span>
                      Select a token
                    </span>
                    <a-select-option
                      v-for="(token, index) in networkTokensTo"
                      :key="index"
                      :label="`${token.symbol} (${
                        networkIds[token.networkId]
                      })`"
                      class="select-erc20-token-dropdown"
                    >
                      <div class="ic-router-token-info">
                        <div class="ic-router-token-info-left">
                          <img
                            class="ic-router-token-logo"
                            v-if="token.logo"
                            :src="token.logo"
                            alt=""
                          />
                          <img
                            class="ic-router-token-logo"
                            v-if="
                              !token.logo &&
                              token.networkId === '-1' &&
                              tokens &&
                              tokens[token.tokenId] &&
                              tokens[token.tokenId].logo
                            "
                            :src="tokens[token.tokenId].logo"
                            alt=""
                          />
                          <img
                            class="ic-router-token-logo"
                            v-if="
                              !token.logo &&
                              (token.networkId === '1' ||
                                token.networkId === '2' ||
                                token.networkId === '3')
                            "
                            src="@/assets/img/empty-token.png"
                            alt=""
                          />
                          <span
                            v-if="
                              token.networkId === '-1' &&
                              !token.logo &&
                              !(
                                tokens &&
                                tokens[token.tokenId] &&
                                tokens[token.tokenId].logo
                              )
                            "
                            class="ic-router-token-symbol"
                          >
                            {{ token.symbol.slice(0, 1).toLocaleUpperCase() }}
                          </span>
                        </div>
                        <div class="ic-router-token-info-right">
                          <span class="ic-router-token-info-symbol">
                            {{ token.symbol }} ({{
                              networkIds[token.networkId]
                            }})
                          </span>
                          <span
                            v-if="
                              token.networkId === '-1' &&
                              tokens &&
                              tokens[token.tokenId] &&
                              tokens[token.tokenId].name
                            "
                            class="ic-router-token-info-name"
                          >
                            {{ tokens[token.tokenId].name }}
                          </span>
                          <span
                            v-if="
                              (token.networkId === '1' ||
                                token.networkId === '2') &&
                              token.id !==
                                '0x0000000000000000000000000000000000000000'
                            "
                            class="ic-router-token-info-name"
                          >
                            {{ token.id | ellipsisAccount(20) }}
                          </span>
                        </div>
                      </div>
                    </a-select-option>
                  </a-select>
                </div>
                <div
                  class="chain-hub-token-info"
                  v-if="typeof networkTokenIdMintTo === 'number'"
                >
                  <div
                    v-if="
                      networkTokensTo[networkTokenIdMintTo].networkId ===
                        '-1' &&
                      (networkTokensTo[networkTokenIdMintTo].networkToIcId ===
                        '2' ||
                        networkTokensTo[networkTokenIdMintTo].networkToIcId ===
                          '1')
                    "
                  >
                    Canister Id:
                    <a
                      :href="
                        networkTokensTo[networkTokenIdMintTo].networkToIcId ===
                        '2'
                          ? `https://ic.house/tokensTest/token/${networkTokensTo[networkTokenIdMintTo].tokenId}`
                          : `https://ic.house/token/${networkTokensTo[networkTokenIdMintTo].tokenId}`
                      "
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{
                        networkTokensTo[networkTokenIdMintTo].tokenId
                          | ellipsisAccount(6)
                      }}
                    </a>
                    <div
                      style="margin-top: 5px"
                      v-if="
                        ERC20Balance[
                          networkTokensTo[networkTokenIdMintTo].tokenId
                        ]
                      "
                    >
                      Balance:
                      <span>
                        {{
                          ERC20Balance[
                            networkTokensTo[networkTokenIdMintTo].tokenId
                          ]
                            | bigintToFloat(
                              8,
                              networkTokensTo[networkTokenIdMintTo].icTokenInfo
                                .decimals
                            )
                            | formatAmount(8)
                        }}
                      </span>
                    </div>
                  </div>
                  <div
                    v-if="
                      networkTokensTo[networkTokenIdMintTo].networkId === '1' ||
                      networkTokensTo[networkTokenIdMintTo].networkId === '2'
                    "
                  >
                    <div
                      v-show="
                        networkTokensTo[networkTokenIdMintTo].id !=
                        '0x0000000000000000000000000000000000000000'
                      "
                    >
                      Contract:
                      <a
                        :href="
                          networkTokensTo[networkTokenIdMintTo].networkId ===
                          '2'
                            ? `https://goerli.etherscan.io/token/${networkTokensTo[networkTokenIdMintTo].id}#code`
                            : `https://etherscan.io/token/${networkTokensTo[networkTokenIdMintTo].id}#code`
                        "
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                      >
                        {{
                          networkTokensTo[networkTokenIdMintTo].id
                            | ellipsisAccount(6)
                        }}
                      </a>
                    </div>
                    <div
                      v-show="
                        ethereumIsConnected &&
                        ERC20EthereumBalance[
                          networkTokensTo[networkTokenIdMintTo].tokenId
                        ]
                      "
                      style="margin-top: 5px"
                    >
                      Balance:
                      <span>
                        {{
                          ERC20EthereumBalance[
                            networkTokensTo[networkTokenIdMintTo].tokenId
                          ]
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="cross-button">
              <button
                @click="onContinue"
                type="button"
                class="primary"
                :disabled="mintDisabled"
              >
                Continue
              </button>
              <span
                v-show="
                  activePending.claim ||
                  activePending.claim2 ||
                  activePending.mint ||
                  activePending.deposit ||
                  activePending.retrieve ||
                  activePending.retrieve2 ||
                  activePending.mintCKETH ||
                  activePending.retrieveCKETH
                "
                class="pointer main-color"
                @click="onActive"
                >Activities</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <transfer-icp
      ref="transferIcp"
      :balance="balance"
      :identity="identity"
      @transferSuccess="transferSuccess"
    ></transfer-icp>
    <transfer-token
      ref="transferToken"
      :identity="identity"
      :current-token="currentToken"
      @transferTokenSuccess="transferTokenSuccess"
    ></transfer-token>
    <top-up
      ref="topUp"
      :balance="balance"
      :identity="identity"
      :walletId="walletId"
      :type="topUpType"
      @topUpSuccess="topUpSuccess"
    ></top-up>
    <receive-modal ref="receiveModal"></receive-modal>
    <a-modal
      v-model="retrieveModalCKETH"
      centered
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterRetrieveCloseCKETH"
      class="transfer-modal forge-modal dissolve-modal forge-modal-eth"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">{{ retrieveTitleETH }}</div>
      </div>
      <div
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
        class="step-list"
      >
        <span
          @click="previousRetrieveStepCK()"
          :class="{ active: retrieveStep > 1 }"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          @click="changeRetrieveStepCK(1)"
          class="pointer"
          :class="{ active: retrieveStep === 1 }"
        >
          <span class="step-list-num">1</span><span>Retrieve</span>
        </div>
        <div
          @click="changeRetrieveStepCK(2)"
          class="pointer step-list-center"
          :class="{ active: retrieveStep === 2 }"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t"
            ><span class="step-list-num">2</span>Records</span
          >
        </div>
        <span
          @click="nextRetrieveStepCK(2)"
          :class="{ active: retrieveStep < 2 }"
          class="step-next pc-show"
          ><a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" /> </a-tooltip
        ></span>
      </div>
      <div
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
        class="forge-main"
      >
        <div class="w100" v-show="retrieveStep === 1">
          <a-form-model
            ref="ethDissolveFormCK"
            :model="ethDissolveFormCK"
            :rules="ethDissolveFormCKRules"
          >
            <a-form-model-item
              :label="`Destination ${icNetworkTokens.icTokenInfo.symbol} (${
                networkIds[otherNetworkTokens.networkId]
              }) address`"
              prop="address"
            >
              <a-input
                v-model="ethDissolveFormCK.address"
                autocomplete="off"
                type="text"
                :placeholder="`${icNetworkTokens.icTokenInfo.symbol} (${
                  networkIds[otherNetworkTokens.networkId]
                }) address`"
              />
            </a-form-model-item>
            <a-form-model-item :colon="false" prop="retrieveAmount">
              <template slot="label"
                >Amount:&nbsp;<span class="label-tip"
                  >(includes network fees)</span
                >
              </template>
              <a-input
                v-model="ethDissolveFormCK.retrieveAmount"
                autocomplete="off"
                type="text"
                v-only-float="icNetworkTokens.icTokenInfo.decimals"
                min="0"
                placeholder="0.00"
              />
            </a-form-model-item>
          </a-form-model>
          <div>
            <div class="base-red" style="line-height: 1.2; margin-bottom: 10px">
              Please fill in the address of non-custodian wallet, not the
              deposit address of CEX (such as Binance, Coinbase, etc.),
              otherwise you may lose
              {{ icNetworkTokens.icTokenInfo.symbol }} ({{
                networkIds[otherNetworkTokens.networkId]
              }}) in case of exception.
            </div>
          </div>
          <div class="retrieving-fee">
            <div class="forge-left-balance">
              <div>
                Balance:
                <div class="balance base-font-normal">
                  <span>
                    {{
                      ERC20Balance[icNetworkTokens.tokenId]
                        | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                        | formatAmount(8)
                    }}
                  </span>
                </div>
                {{ icNetworkTokens.symbol }} ({{
                  networkIds[icNetworkTokens.networkId]
                }})&nbsp;
                <a-icon
                  @click="refreshCkETHBalance(true, 'ICRC-1')"
                  v-show="!refreshCkETHBalanceLoading"
                  type="reload"
                  class="reload-icon"
                />
                <a-icon
                  v-show="refreshCkETHBalanceLoading"
                  type="loading"
                  class="reload-icon"
                />
                <span
                  class="transfer-balance-max pc-show"
                  @click="setMaxETHRetrieve('ck')"
                >
                  Max
                </span>
              </div>
              <div>
                Fee:&nbsp;
                <span>
                  {{
                    tokens[icNetworkTokens.tokenId].fee
                      | bigintToFloat(
                        icNetworkTokens.icTokenInfo.decimals,
                        icNetworkTokens.icTokenInfo.decimals
                      )
                  }}
                </span>
                &nbsp;{{ icNetworkTokens.symbol }} ({{
                  networkIds[icNetworkTokens.networkId]
                }})&nbsp;
              </div>
            </div>
            <router-link
              class="transfer-balance-right pc-show"
              :to="`/ICDex/${icNetworkTokens.symbol}/ICP`"
            >
              Trade
            </router-link>
          </div>
          <button
            type="button"
            class="primary retrieve-button w100 mt20"
            @click="retrieveCkETH"
          >
            Retrieve
          </button>
        </div>
        <div
          v-show="retrieveStep === 2"
          class="forge-right retrieve-btc-status"
        >
          <div class="pc-show">
            <table>
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Amount</th>
                  <th>Block Index</th>
                  <th>Status</th>
                  <th>Txid</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in ckETHRetrieve.slice(
                    (ckETHMintPage - 1) * 5,
                    ckETHMintPage * 5
                  )"
                  :key="index"
                >
                  <td>
                    <a
                      :href="`${ckEthLink}/address/${item.recipient}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                      class="link"
                    >
                      {{ item.recipient | ellipsisAccount() }}
                    </a>
                  </td>
                  <td>
                    <span>
                      {{
                        item.amount
                          | bigintToFloat(
                            8,
                            icNetworkTokens.icTokenInfo.decimals
                          )
                          | formatAmount(8)
                      }}
                    </span>
                  </td>
                  <td>
                    <span>{{ item.blockIndex }}</span>
                  </td>
                  <td>
                    <span class="flex-center">
                      <span>
                        {{ Object.keys(item.status)[0] }}
                      </span>
                      <span
                        v-show="
                          item.status &&
                          ['Pending', 'TxCreated', 'TxSent'].includes(
                            Object.keys(item.status)[0]
                          )
                        "
                        class="loading-spinner"
                      ></span>
                    </span>
                  </td>
                  <td>
                    <a
                      v-if="getCKETHRetrieveTxid(item.status)"
                      :href="`${ckEthLink}/tx/${getCKETHRetrieveTxid(
                        item.status
                      )}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                      class="link"
                    >
                      {{
                        getCKETHRetrieveTxid(item.status) | ellipsisAccount()
                      }}
                    </a>
                    <span v-else>-</span>
                  </td>
                </tr>
                <tr v-show="!ckETHRetrieve.length">
                  <td colspan="5" style="text-align: center">No records</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul class="h5-show">
            <li v-show="!ckETHRetrieve.length" style="justify-content: center">
              No records
            </li>
            <li
              v-for="(item, index) in ckETHRetrieve.slice(
                (ckETHMintPage - 1) * 5,
                ckETHMintPage * 5
              )"
              :key="index"
            >
              <div class="li-h5-item">
                <span class="li-left">Recipient:</span>
                <span class="margin-left-auto">
                  <a
                    :href="`${ckEthLink}/address/${item.recipient}`"
                    rel="nofollow noreferrer noopener"
                    target="_blank"
                    class="link"
                  >
                    {{ item.recipient | ellipsisAccount() }}
                  </a>
                </span>
              </div>
              <div class="li-h5-item">
                <span class="li-left">Amount:</span>
                <span class="margin-left-auto">
                  {{
                    item.amount
                      | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                      | formatAmount(8)
                  }}
                </span>
              </div>
              <div class="li-h5-item">
                <span class="li-left">Block Index:</span>
                <span class="margin-left-auto">
                  {{ item.blockIndex }}
                </span>
              </div>
              <div class="li-h5-item">
                <span class="li-left">Status:</span>
                <span class="margin-left-auto">
                  <span>
                    {{ Object.keys(item.status)[0] }}
                  </span>
                  <span
                    v-show="
                      item.status &&
                      ['Pending', 'TxCreated', 'TxSent'].includes(
                        Object.keys(item.status)[0]
                      )
                    "
                    class="loading-spinner"
                  ></span>
                </span>
              </div>
              <div class="li-h5-item">
                <span class="li-left">Txid:</span>
                <span class="margin-left-auto">
                  <a
                    v-if="getCKETHRetrieveTxid(item.status)"
                    :href="`${ckEthLink}/tx/${getCKETHRetrieveTxid(
                      item.status
                    )}`"
                    rel="nofollow noreferrer noopener"
                    target="_blank"
                    class="link"
                  >
                    {{ getCKETHRetrieveTxid(item.status) | ellipsisAccount() }}
                  </a>
                  <span v-else>-</span>
                </span>
              </div>
            </li>
          </ul>
          <div class="pagination-transaction-main">
            <a-pagination
              v-if="ckETHRetrieve.length > 5"
              class="pagination-transaction"
              :default-page-size="5"
              :current="ckETHMintPage"
              :total="ckETHRetrieve.length"
              @change="pageChangeCKETHMint"
            />
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="forgeModalCKETH"
      width="680px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal forge-modal forge-modal-eth"
      :after-close="afterForgeCloseCKETH"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">{{ forgeTitleETH }}</div>
      </div>
      <div class="step-list">
        <span
          @click="previousMintStepCK()"
          :class="{ active: mintStep > 1 }"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          @click="changeMintStepCK(1)"
          class="pointer"
          :class="{ active: mintStep === 1 }"
        >
          <span class="step-list-num">1</span><span>Send</span>
        </div>
        <div
          @click="changeMintStepCK(2)"
          class="pointer step-list-center"
          :class="{ active: mintStep === 2 }"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t">
            <span class="step-list-num">2</span><span>Records</span></span
          >
        </div>
        <span
          @click="nextMintStepCK(2)"
          :class="{ active: mintStep < 2 }"
          class="step-next pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" />
          </a-tooltip>
        </span>
      </div>
      <div
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo && mintStep === 2"
        class="ckEth-mint-top"
      >
        <div class="base-color-w">
          Balance:
          <span>
            {{
              ERC20Balance[icNetworkTokens.tokenId]
                | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                | formatAmount(8)
            }}
          </span>
          &nbsp;{{ icNetworkTokens.symbol }} ({{
            networkIds[icNetworkTokens.networkId]
          }})&nbsp;
          <a-icon
            @click="refreshCkETHBalance(true, 'ICRC-1')"
            v-show="!refreshCkETHBalanceLoading"
            type="reload"
            class="reload-icon"
          />
          <a-icon
            v-show="refreshCkETHBalanceLoading"
            type="loading"
            class="reload-icon"
          />
        </div>
        <div v-show="ckETHBlockNum" class="base-font-title">
          Latest Block Number: {{ ckETHBlockNum }}
        </div>
        <div class="base-font-title" v-show="lastScrapedBlockNumber">
          Latest Accepted Deposit Block Number: {{ lastScrapedBlockNumber }}
        </div>
      </div>
      <div
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
        class="forge-main"
      >
        <div v-show="mintStep === 1" class="forge-left">
          <a-form-model
            v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
            :model="erc20Form"
            ref="erc20Form"
            :rules="erc20FormRules"
          >
            <a-form-model-item
              :label="`Transfer ${icNetworkTokens.icTokenInfo.symbol} (${
                networkIds[otherNetworkTokens.networkId]
              }) amount`"
              prop="amount"
            >
              <a-input
                v-model="erc20Form.amount"
                autocomplete="off"
                type="text"
                v-only-float="Number(icNetworkTokens.icTokenInfo.decimals)"
                placeholder="0.00"
                :suffix="`${icNetworkTokens.icTokenInfo.symbol} (${
                  networkIds[otherNetworkTokens.networkId]
                })`"
              />
            </a-form-model-item>
          </a-form-model>
          <div class="mint-button">
            <button
              class="primary w100"
              type="button"
              @click="transferFromMetaMaskCK"
            >
              <img src="@/assets/img/MetaMask.png" alt="" /> Send with MetaMask
            </button>
          </div>
        </div>
        <div v-show="mintStep === 2" class="forge-right retrieve-btc-status">
          <div class="pc-show">
            <table>
              <thead>
                <tr>
                  <th>TxHash</th>
                  <th>Amount</th>
                  <th>Block Num</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in ckETHMint.slice(
                    (ckETHMintPage - 1) * 5,
                    ckETHMintPage * 5
                  )"
                  :key="item.txHash"
                >
                  <td>
                    <a
                      :href="`${ckEthLink}/tx/${item.txHash}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                      class="link"
                    >
                      {{ item.txHash | ellipsisAccount() }}
                    </a>
                  </td>
                  <td>
                    <span>
                      {{
                        item.amount
                          | bigintToFloat(
                            8,
                            icNetworkTokens.icTokenInfo.decimals
                          )
                          | formatAmount(8)
                      }}
                    </span>
                  </td>
                  <td>
                    <span v-if="item.blockNum">{{ item.blockNum }}</span>
                    <span v-else>-</span>
                  </td>
                  <td style="width: 92px">
                    <span v-show="lastScrapedBlockNumber">
                      <span v-if="item.blockNum">
                        <span
                          v-if="lastScrapedBlockNumber >= Number(item.blockNum)"
                          >Confirmed</span
                        >
                        <span v-else class="flex-center"
                          >Submitted <span class="loading-spinner"></span
                        ></span>
                      </span>
                      <span v-else class="flex-center"
                        >Pending <span class="loading-spinner"></span
                      ></span>
                    </span>
                  </td>
                </tr>
                <tr v-show="!ckETHMint.length">
                  <td colspan="4" style="text-align: center">No records</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul class="h5-show">
            <li v-show="!ckETHMint.length" style="justify-content: center">
              No records
            </li>
            <li
              v-for="item in ckETHMint.slice(
                (ckETHMintPage - 1) * 5,
                ckETHMintPage * 5
              )"
              :key="item.txHash"
            >
              <div class="li-h5-item">
                <span class="li-left">TxHash:</span>
                <span class="margin-left-auto">
                  <a
                    :href="`${ckEthLink}/tx/${item.txHash}`"
                    rel="nofollow noreferrer noopener"
                    target="_blank"
                    class="link"
                  >
                    {{ item.txHash | ellipsisAccount() }}
                  </a>
                </span>
              </div>
              <div class="li-h5-item">
                <span class="li-left">Amount:</span>
                <span class="margin-left-auto">
                  {{
                    item.amount
                      | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                      | formatAmount(8)
                  }}
                </span>
              </div>
              <div class="li-h5-item">
                <span class="li-left">Block Num:</span>
                <span class="margin-left-auto">
                  <span v-if="item.blockNum">{{ item.blockNum }}</span>
                  <span v-else>-</span>
                </span>
              </div>
              <div class="li-h5-item">
                <span class="li-left">Status:</span>
                <span class="margin-left-auto">
                  <span v-show="lastScrapedBlockNumber">
                    <span v-if="item.blockNum">
                      <span
                        v-if="lastScrapedBlockNumber >= Number(item.blockNum)"
                        >Confirmed</span
                      >
                      <span v-else class="flex-center"
                        >Submitted <span class="loading-spinner"></span
                      ></span>
                    </span>
                    <span v-else class="flex-center"
                      >Pending <span class="loading-spinner"></span
                    ></span>
                  </span>
                </span>
              </div>
            </li>
          </ul>
          <div class="pagination-transaction-main">
            <a-pagination
              v-if="ckETHMint.length > 5"
              class="pagination-transaction"
              :default-page-size="5"
              :current="ckETHMintPage"
              :total="ckETHMint.length"
              @change="pageChangeCKETHMint"
            />
          </div>
        </div>
        <div v-show="mintStep === 2" class="step-footer-confirmation">
          Wait for 64-96 confirmations (~12.8-19.2 minutes) to finalize.
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="forgeModalETH"
      width="680px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal forge-modal forge-modal-eth"
      :after-close="afterForgeCloseETH"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">{{ forgeTitleETH }}</div>
      </div>
      <div class="step-list">
        <span
          @click="previousMintStep()"
          :class="{ active: mintStep > 1 }"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          @click="changeMintStep(1)"
          class="pointer"
          :class="{ active: mintStep === 1 }"
        >
          <span class="step-list-num">1</span><span>Send</span>
        </div>
        <div
          @click="changeMintStep(2)"
          class="pointer step-list-center"
          :class="{ active: mintStep === 2 }"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t"
            ><span class="step-list-num">2</span>Mint</span
          >
          <span class="step-list-line"></span>
        </div>
        <div
          @click="changeMintStep(3)"
          class="pointer"
          :class="{ active: mintStep === 3 }"
        >
          <span class="step-list-num">3</span><span>Records</span>
        </div>
        <span
          @click="nextMintStep(3)"
          :class="{ active: mintStep < 3 }"
          class="step-next pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" />
          </a-tooltip>
        </span>
      </div>
      <div
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
        class="forge-main"
      >
        <div v-show="mintStep === 1" class="forge-left">
          <a-form-model
            v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
            :model="erc20Form"
            ref="erc20Form"
            :rules="erc20FormRules"
          >
            <a-form-model-item
              :label="`Transfer ${icNetworkTokens.icTokenInfo.symbol} (${
                networkIds[otherNetworkTokens.networkId]
              }) amount`"
              prop="amount"
            >
              <a-input
                v-model="erc20Form.amount"
                autocomplete="off"
                type="text"
                v-only-float="Number(icNetworkTokens.icTokenInfo.decimals)"
                placeholder="0.00"
                :suffix="`${icNetworkTokens.icTokenInfo.symbol} (${
                  networkIds[otherNetworkTokens.networkId]
                })`"
              />
            </a-form-model-item>
          </a-form-model>
          <div class="mint-button">
            <button
              v-show="depositMethod === 2"
              class="primary w100"
              type="button"
              @click="transferFromMetaMask"
            >
              <img src="@/assets/img/MetaMask.png" alt="" /> Send with MetaMask
            </button>
            <button
              v-show="depositMethod === 1"
              type="button"
              @click="transferFromOther"
            >
              Send with other wallets
            </button>
            <button
              v-show="depositMethod === 1"
              class="primary"
              type="button"
              @click="transferFromMetaMask"
            >
              <img src="@/assets/img/MetaMask.png" alt="" /> Send with MetaMask
            </button>
          </div>
        </div>
        <div v-show="mintStep === 2" class="forge-right">
          <div
            v-show="depositMethod === 1"
            style="margin-bottom: 20px"
            class="btc-txs"
          >
            <div class="btc-txs-header base-font-title btc-txs-header-h5">
              {{ icNetworkTokens.icTokenInfo.symbol }} ({{
                networkIds[otherNetworkTokens.networkId]
              }}) balance:&nbsp;
              <span class="deposit-balance"
                >{{ ckETHDepositBalance | formatAmount(8)
                }}<span class="deposit-balance-symbol"
                  >&nbsp;{{ icNetworkTokens.icTokenInfo.symbol }} ({{
                    networkIds[otherNetworkTokens.networkId]
                  }})&nbsp;</span
                >
              </span>
              <span
                class="margin-left-auto pointer"
                style="color: #1996c4; font-size: 12px"
                @click="forgeModalTransactions = true"
              >
                Transactions
              </span>
            </div>
            <div v-if="minterInfo && ethTokenInfo">
              Estimated network fee:
              {{
                filterEstimatedFee(
                  icNetworkTokens.icTokenInfo,
                  ethTokenInfo,
                  minterInfo
                )
              }}
              {{ icNetworkTokens.icTokenInfo.symbol }} ({{
                networkIds[otherNetworkTokens.networkId]
              }})
            </div>
            <button
              v-if="minterInfo"
              :disabled="depositDisabled"
              type="button"
              class="primary w100"
              style="height: 36px; margin-top: 30px"
              @click="depositETH()"
            >
              Mint {{ icNetworkTokens.symbol }} ({{
                networkIds[icNetworkTokens.networkId]
              }})
              <span
                v-show="
                  depositDisabled && (pendingLoading || depositing.length)
                "
                class="loading-spinner"
              ></span>
            </button>
            <div class="ic-token-balance">
              Balance:&nbsp;
              <div class="balance base-font-normal">
                <span>
                  {{
                    ERC20Balance[icNetworkTokens.tokenId]
                      | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                      | formatNum
                  }}
                </span>
              </div>
              &nbsp;{{ icNetworkTokens.symbol }} ({{
                networkIds[icNetworkTokens.networkId]
              }})&nbsp;
              <a-icon
                @click="refreshCkETHBalance()"
                v-show="!refreshCkETHBalanceLoading"
                type="reload"
                class="reload-icon"
              />
              <a-icon
                v-show="refreshCkETHBalanceLoading"
                type="loading"
                class="reload-icon"
              />
            </div>
          </div>
          <div
            v-show="depositMethod === 2"
            style="margin-bottom: 20px"
            class="btc-txs"
          >
            <div class="btc-txs-header base-font-title" style="font-size: 18px">
              Signature
              <span
                class="margin-left-auto pointer"
                style="color: #1996c4; font-size: 14px"
                @click="claimModalTransactions = true"
              >
                History
              </span>
            </div>
            <div class="btc-txs-header base-font-title">
              deposit for minting token on IC network.
            </div>
            <div>
              <span class="base-font-title">Account:</span>
              <div>
                <span>{{ getPrincipalId }}</span>
              </div>
            </div>
            <a-form-model
              :model="signatureForm"
              ref="signatureForm"
              :rules="signatureFormRules"
            >
              <a-form-model-item label="TxHash" prop="txHash">
                <a-input
                  v-model="signatureForm.txHash"
                  autocomplete="off"
                  type="text"
                  placeholder="TxHash"
                  @change="txHashChange"
                />
              </a-form-model-item>
            </a-form-model>
            <div
              v-show="claimTxError"
              class="base-red"
              style="margin-top: -22px"
            >
              {{ claimTxError }}
            </div>
            <div v-if="minterInfo" style="margin-bottom: 20px">
              Estimated network fee:
              {{ filterEstimatedFeeMode2(icNetworkTokens.icTokenInfo) }}
              {{ icNetworkTokens.symbol }} ({{
                networkIds[icNetworkTokens.networkId]
              }})
            </div>
            <div class="mint-button">
              <button
                v-show="depositMethod === 2"
                class="primary w100"
                style="height: 36px"
                type="button"
                :disabled="!(signatureForm.txHash && !claimTxError)"
                v-debounce="onClaim"
              >
                Claim &nbsp;<a-icon
                  v-show="
                    claimTxError &&
                    !claimTxError.includes('Invalid transaction') &&
                    !claimTxError.includes('The amount is too low') &&
                    !claimTxError.includes('Invalid txHash')
                  "
                  type="loading"
                  class="reload-icon"
                />
              </button>
            </div>
            <div class="ic-token-balance">
              Balance:&nbsp;
              <div class="balance base-font-normal">
                <span>
                  {{
                    ERC20Balance[icNetworkTokens.tokenId]
                      | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                      | formatNum
                  }}
                </span>
              </div>
              &nbsp;{{ icNetworkTokens.symbol }} ({{
                networkIds[icNetworkTokens.networkId]
              }})&nbsp;
              <a-icon
                @click="refreshCkETHBalance()"
                v-show="!refreshCkETHBalanceLoading"
                type="reload"
                class="reload-icon"
              />
              <a-icon
                v-show="refreshCkETHBalanceLoading"
                type="loading"
                class="reload-icon"
              />
            </div>
          </div>
        </div>
        <div v-show="mintStep === 3" class="forge-right retrieve-btc-status">
          <ul class="retrieve-btc-status-ul-table">
            <!--<li>
              <div style="width: 15%">TxIndex</div>
              <div style="width: 35%">Amount</div>
              <div style="width: 25%">Address</div>
              <div style="width: 25%">TxHash</div>
            </li>-->
            <li
              v-for="(item, index) in mintEvent.slice(
                (mintEventPage - 1) * mintEventPageSize,
                mintEventPage * mintEventPageSize
              )"
              :key="index"
              style="align-items: flex-start"
              class="retrieve-btc-status-ul-table-eth"
            >
              Mint&nbsp;&nbsp;
              <div
                v-if="depositMethod === 1 && item[1] && item[1].depositResult"
                class="retrieve-btc-status-flex"
              >
                <div v-if="item[1].depositResult.ok" class="eth-tx-hash">
                  <div
                    v-if="
                      item[1].depositResult.ok.txid &&
                      item[1].depositResult.ok.txid.length
                    "
                  >
                    <a
                      v-for="hash in item[1].depositResult.ok.txid"
                      :key="hash"
                      :href="`${ethLink}/tx/${hash}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{ hash | ellipsisAccount() }}
                    </a>
                  </div>
                </div>
              </div>
              <div
                v-if="depositMethod === 2 && item[0].claimDepositResult"
                class="retrieve-btc-status-flex"
              >
                <div v-if="item[0].claimDepositResult.ok" class="eth-tx-hash">
                  <div v-if="item[0].claimDepositResult.ok.txHash">
                    <a
                      :href="`${ethLink}/tx/${item[0].claimDepositResult.ok.txHash}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{
                        item[0].claimDepositResult.ok.txHash | ellipsisAccount()
                      }}
                    </a>
                  </div>
                </div>
              </div>
              &nbsp;->&nbsp;
              <span
                class="
                  retrieve-btc-status-flex
                  retrieve-btc-status-flex-pc
                  retrieve-btc-status-flex-h5
                "
                v-if="item[2] && item[2].mint"
              >
                <a
                  :href="`https://ic.house/address/${item[2].mint.icTokenCanisterId.toString()}/${accountToAddress(
                    item[2].mint.account
                  )}`"
                  rel="nofollow noreferrer noopener"
                  target="_blank"
                >
                  {{ accountToAddress(item[2].mint.account) | ellipsisAccount }}
                </a>
              </span>
              <span
                class="base-font-title margin-left-auto"
                style="text-align: right"
                v-if="item[2] && item[2].mint"
              >
                {{
                  item[2].mint.amount
                    | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                    | formatAmount(8)
                }}
                {{ icNetworkTokens.icTokenInfo.symbol }} ({{
                  networkIds[otherNetworkTokens.networkId]
                }})
              </span>
            </li>
          </ul>
          <div
            v-if="!mintEvent.length"
            class="no-retrieve-btc-status-ul"
            style="display: flex"
          >
            No Record
          </div>
          <div class="pagination-transaction-main mt20">
            <a-pagination
              v-if="mintEvent.length > mintEventPageSize"
              class="pagination-transaction"
              :default-page-size="mintEventPageSize"
              :current="mintEventPage"
              :total="mintEvent.length"
              @change="mintEventPageChange"
            />
          </div>
        </div>
      </div>
      <div
        v-show="
          mintStep === 2 &&
          depositMethod === 2 &&
          depositingInfo &&
          depositingInfo[0]
        "
        class="forge-main mt20"
      >
        <div
          v-if="depositingInfo && depositingInfo[0]"
          class="btc-txs retrieve-btc-status"
        >
          <ul>
            <li>
              <div>Pending txHash:&nbsp;&nbsp;</div>
              <div style="display: flex; align-items: center">
                <a
                  :href="`${ethLink}/tx/${depositingInfo[0]}`"
                  rel="nofollow noreferrer noopener"
                  target="_blank"
                >
                  <span class="pc-show">
                    {{ depositingInfo[0] | ellipsisAccount(26) }}
                  </span>
                  <span class="h5-show">
                    {{ depositingInfo[0] | ellipsisAccount(10) }}
                  </span>
                </a>
                <span class="loading-spinner"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-show="mintStep === 2 && depositMethod === 1 && depositing.length"
        class="forge-main mt20"
      >
        <div
          v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
          class="btc-txs retrieve-btc-status"
        >
          <div class="base-font-title">Pending</div>
          <ul class="retrieve-btc-status-ul-table pc-show">
            <li>
              <div class="cell cell-header" style="width: 70px">TxIndex</div>
              <div class="cell cell-header" style="width: 130px">TxHash</div>
              <div class="cell cell-header" style="width: 210px">
                Amount&nbsp;
                <a-tooltip placement="top">
                  <template slot="title">Includes gas & platform fees</template>
                  <a-icon
                    class="pointer"
                    v-show="
                      Object.keys(icNetworkTokens.icTokenInfo.std)[0] ===
                      'ERC20'
                    "
                    type="info-circle"
                  />
                </a-tooltip>
              </div>
              <div class="cell" style="width: 80px">Status</div>
            </li>
            <li
              v-for="(item, index) in depositing"
              :key="index"
              style="font-size: 12px"
            >
              <div class="cell" style="width: 70px">
                {{ item.txIndex }}
              </div>
              <div class="cell retrieve-btc-status-flex" style="width: 130px">
                <div class="eth-tx-hash">
                  <div v-if="item.txHash && item.txHash.length">
                    <a
                      v-for="hash in item.txHash"
                      :key="hash"
                      :href="`${ethLink}/tx/${hash}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{ hash | ellipsisAccount() }}
                    </a>
                  </div>
                </div>
              </div>
              <div class="cell" style="width: 210px">
                <span v-if="icNetworkTokens && icNetworkTokens.icTokenInfo">
                  {{
                    item.amount
                      | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                      | formatAmount(8)
                  }}
                  <span v-show="Object.keys(item.txType)[0] === 'Deposit'">
                    {{ icNetworkTokens.symbol }} ({{
                      networkIds[icNetworkTokens.networkId]
                    }})
                  </span>
                  <span v-show="Object.keys(item.txType)[0] === 'DepositGas'">
                    ETH
                  </span>
                </span>
              </div>
              <div class="cell" style="align-items: center; width: 80px">
                <span>
                  {{ Object.keys(item.status)[0] }}
                </span>
                <span
                  v-show="
                    item.status &&
                    [
                      'Pending',
                      'Signing',
                      'Building',
                      'Sending',
                      'Submitted'
                    ].includes(Object.keys(item.status)[0])
                  "
                  class="loading-spinner"
                ></span>
              </div>
            </li>
            <li
              v-if="!depositing.length"
              style="justify-content: center; margin-top: 10px; font-size: 14px"
              class="base-font-title"
            >
              No data
            </li>
          </ul>
          <ul class="h5-show">
            <li
              v-for="(item, index) in depositing"
              :key="index"
              style="font-size: 12px"
            >
              <div class="li-h5-item">
                <span class="li-left">TxIndex:</span>
                <span class="margin-left-auto">{{ item.txIndex }}</span>
              </div>
              <div class="li-h5-item">
                <div class="li-left">TxHash:</div>
                <div class="eth-tx-hash margin-left-auto">
                  <div v-if="item.txHash && item.txHash.length">
                    <a
                      v-for="hash in item.txHash"
                      :key="hash"
                      :href="`${ethLink}/tx/${hash}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{ hash | ellipsisAccount() }}
                    </a>
                  </div>
                </div>
              </div>
              <div class="li-h5-item">
                <div class="li-left">Amount:</div>
                <span
                  class="margin-left-auto"
                  v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
                >
                  {{
                    item.amount
                      | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                      | formatAmount(8)
                  }}
                  <span v-show="Object.keys(item.txType)[0] === 'Deposit'">
                    {{ icNetworkTokens.symbol }} ({{
                      networkIds[icNetworkTokens.networkId]
                    }})
                  </span>
                  <span v-show="Object.keys(item.txType)[0] === 'DepositGas'">
                    ETH
                  </span>
                </span>
              </div>
              <div class="li-h5-item">
                <div class="li-left">Status:</div>
                <!--<span v-if="blockCountETH && depositing.block_height">
									{{ blockCountETH - depositing.block_height + 1 }}
								</span>-->
                <span class="margin-left-auto">
                  {{ Object.keys(item.status)[0] }}
                </span>
                <span
                  v-show="
                    item.status &&
                    [
                      'Pending',
                      'Signing',
                      'Building',
                      'Sending',
                      'Submitted'
                    ].includes(Object.keys(item.status)[0])
                  "
                  class="loading-spinner"
                ></span>
              </div>
            </li>
            <li
              v-if="!depositing.length"
              style="justify-content: center; margin-top: 10px; font-size: 14px"
              class="base-font-title"
            >
              No data
            </li>
          </ul>
        </div>
      </div>
      <div
        v-if="
          mintStep === 2 &&
          minterInfo &&
          icNetworkTokens &&
          icNetworkTokens.icTokenInfo
        "
        class="step-footer-confirmation"
      >
        Wait for {{ minterInfo.minConfirmations }} confirmations, then submit to
        mint {{ icNetworkTokens.symbol }} ({{
          networkIds[icNetworkTokens.networkId]
        }}).
      </div>
    </a-modal>
    <a-modal
      v-model="forgeModalTransactions"
      width="750px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal forge-modal forge-modal-eth active-pending-modal"
    >
      <div class="modal-title-info" slot="title">
        <div
          class="modal-title-main"
          v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
        >
          {{ icNetworkTokens.icTokenInfo.symbol }} ({{
            networkIds[otherNetworkTokens.networkId]
          }}) Latest Transactions
        </div>
      </div>
      <div class="forge-right">
        <div class="transaction-update-time">
          Transaction history is updated every 90 seconds
          <span
            v-if="
              icNetworkTokens &&
              icNetworkTokens.tokenId &&
              currentTxTimeCkETH[icNetworkTokens.tokenId]
            "
            >, last update:
            {{
              currentTxTimeCkETH[icNetworkTokens.tokenId]
                | formatDateFromSecondUTCToHour
            }}</span
          >
        </div>
        <div class="btc-txs">
          <a-spin class="btc-txs-ul-spin" :spinning="showCkETHTransactions">
            <ul
              class="btc-txs-ul h5-show"
              v-if="
                networkTokensTo &&
                icNetworkTokens &&
                ckETHTransactions &&
                ckETHTransactions[icNetworkTokens.tokenId] &&
                ckETHTransactions[icNetworkTokens.tokenId].length
              "
            >
              <li
                v-for="tx in ckETHTransactions[icNetworkTokens.tokenId].slice(
                  (ckETHTransactionsPage - 1) * ckETHTransactionsPageSize,
                  ckETHTransactionsPage * ckETHTransactionsPageSize
                )"
                :key="tx.hash"
              >
                <div>
                  <div class="btc-txs-info">
                    <div class="btc-txs-info-left">
                      <a
                        :href="
                          icNetworkTokens.id ===
                          '0x0000000000000000000000000000000000000000'
                            ? `${ethLink}/address/${tx.from}`
                            : `${ethLink}/token/${icNetworkTokens.id}?a=${tx.from}`
                        "
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                      >
                        {{ tx.from | ellipsisAccount() }}
                      </a>
                      <span class="tx-balance">
                        <a-icon type="arrow-right"
                      /></span>
                    </div>
                    <div class="btc-txs-hash">
                      <a
                        :href="
                          icNetworkTokens.id ===
                          '0x0000000000000000000000000000000000000000'
                            ? `${ethLink}/address/${tx.to}`
                            : `${ethLink}/token/${icNetworkTokens.id}?a=${tx.to}`
                        "
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                      >
                        {{ tx.to | ellipsisAccount() }}
                      </a>
                    </div>
                  </div>
                  <div>
                    <a
                      class="margin-left-auto"
                      :href="`${ethLink}/tx/${tx.hash}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{
                        tx.value
                          | bigintToFloat(
                            8,
                            icNetworkTokens.icTokenInfo.decimals
                          )
                          | formatAmount(8)
                      }}
                      {{ icNetworkTokens.icTokenInfo.symbol }} ({{
                        networkIds[otherNetworkTokens.networkId]
                      }})
                    </a>
                  </div>
                </div>
                <div class="li-h5-item">
                  <span class="li-left">{{ tx.timeStamp | filterTime }}</span>
                  <span class="margin-left-auto">
                    <span
                      :class="{
                        Confirmed:
                          tx.blockNumber &&
                          Number(tx.blockNumber) <=
                            updateCkETHBlockHeight[icNetworkTokens.tokenId]
                      }"
                    >
                      {{ filterStatus(Number(tx.blockNumber)) }}
                      <span
                        v-if="
                          tx.blockNumber &&
                          blockCountETH - Number(tx.blockNumber) <
                            Number(minterInfo.minConfirmations) - 1
                        "
                      >
                        ({{ blockCountETH - Number(tx.blockNumber) + 1 }})
                      </span>
                    </span>
                    <a-icon
                      class="has-update"
                      v-show="
                        tx.blockNumber &&
                        Number(tx.blockNumber) <=
                          updateCkETHBlockHeight[icNetworkTokens.tokenId]
                      "
                      type="check-circle"
                    />
                  </span>
                </div>
              </li>
            </ul>
            <ul
              class="btc-txs-ul pc-show"
              v-if="
                networkTokensTo &&
                icNetworkTokens &&
                ckETHTransactions &&
                ckETHTransactions[icNetworkTokens.tokenId] &&
                ckETHTransactions[icNetworkTokens.tokenId].length
              "
            >
              <li
                v-for="tx in ckETHTransactions[icNetworkTokens.tokenId].slice(
                  (ckETHTransactionsPage - 1) * ckETHTransactionsPageSize,
                  ckETHTransactionsPage * ckETHTransactionsPageSize
                )"
                :key="tx.hash"
              >
                <div class="btc-txs-hash">
                  <div>{{ tx.timeStamp | filterTime }}</div>
                  <div class="margin-left-auto">
                    <span
                      :class="{
                        Confirmed:
                          tx.blockNumber &&
                          Number(tx.blockNumber) <=
                            updateCkETHBlockHeight[icNetworkTokens.tokenId]
                      }"
                    >
                      {{ filterStatus(Number(tx.blockNumber)) }}
                      <span
                        v-if="
                          tx.blockNumber &&
                          blockCountETH - Number(tx.blockNumber) <
                            Number(minterInfo.minConfirmations) - 1
                        "
                      >
                        ({{ blockCountETH - Number(tx.blockNumber) + 1 }})
                      </span>
                    </span>
                    <a-icon
                      class="has-update"
                      v-show="
                        tx.blockNumber &&
                        Number(tx.blockNumber) <=
                          updateCkETHBlockHeight[icNetworkTokens.tokenId]
                      "
                      type="check-circle"
                    />
                  </div>
                </div>
                <div class="btc-txs-info">
                  <div class="btc-txs-info-left">
                    <a
                      :href="
                        icNetworkTokens.id ===
                        '0x0000000000000000000000000000000000000000'
                          ? `${ethLink}/address/${tx.from}`
                          : `${ethLink}/token/${icNetworkTokens.id}?a=${tx.from}`
                      "
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{ tx.from | ellipsisAccount() }}
                    </a>
                    <span class="tx-balance">
                      <a-icon type="arrow-right"
                    /></span>
                  </div>
                  <div class="btc-txs-hash">
                    <a
                      :href="
                        icNetworkTokens.id ===
                        '0x0000000000000000000000000000000000000000'
                          ? `${ethLink}/address/${tx.to}`
                          : `${ethLink}/token/${icNetworkTokens.id}?a=${tx.to}`
                      "
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{ tx.to | ellipsisAccount() }}
                    </a>
                    <a
                      class="margin-left-auto"
                      :href="`${ethLink}/tx/${tx.hash}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{
                        tx.value
                          | bigintToFloat(
                            8,
                            icNetworkTokens.icTokenInfo.decimals
                          )
                          | formatAmount(8)
                      }}
                      {{ icNetworkTokens.icTokenInfo.symbol }} ({{
                        networkIds[otherNetworkTokens.networkId]
                      }})
                    </a>
                  </div>
                </div>
              </li>
            </ul>
            <div
              class="no-btc-txs-ul"
              v-show="
                !showCkETHTransactions &&
                networkTokensTo &&
                icNetworkTokens &&
                ckETHTransactions &&
                ckETHTransactions[icNetworkTokens.tokenId] &&
                !ckETHTransactions[icNetworkTokens.tokenId].length
              "
            >
              No Transactions
            </div>
          </a-spin>
          <div class="pagination-transaction-main">
            <a-pagination
              v-if="ckETHTransactionTotal > ckETHTransactionsPageSize"
              class="pagination-transaction"
              :default-page-size="ckETHTransactionsPageSize"
              :current="ckETHTransactionsPage"
              :total="ckETHTransactionTotal"
              @change="pageChangeETH"
            />
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="forgeModal"
      centered
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal forge-modal"
      :after-close="afterForgeClose"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">{{ forgeTitle }}</div>
        <!--<span class="title-tip"
          >Do not leave this page until the transaction is fully completed. If
          you leave this page, please come back here again.</span
        >-->
      </div>
      <div class="step-list">
        <span
          @click="previousMintStep()"
          :class="{ active: mintStep > 1 }"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          @click="changeMintStep(1)"
          class="pointer"
          :class="{ active: mintStep === 1 }"
        >
          <span class="step-list-num">1</span><span>Send</span>
        </div>
        <div
          @click="changeMintStep(2)"
          class="pointer step-list-center"
          :class="{ active: mintStep === 2 }"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t"
            ><span class="step-list-num">2</span>Mint</span
          >
        </div>
        <span
          @click="nextMintStep(2)"
          :class="{ active: mintStep < 2 }"
          class="step-next pc-show"
          ><a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" /> </a-tooltip
        ></span>
      </div>
      <div class="forge-main">
        <div v-show="mintStep === 1" class="forge-left">
          <div class="btc-address-code">
            <span>BTC Deposit Address</span>
            <a-spin
              :spinning="
                BTCType === BTCTypeEnum.icBTC ? !BTCAddressIc : !BTCAddressCk
              "
            >
              <img
                v-show="BTCType === BTCTypeEnum.icBTC"
                :src="icAccountCode"
                alt=""
              />
              <img
                v-show="BTCType === BTCTypeEnum.ckBTC"
                :src="accountCode"
                alt=""
              />
            </a-spin>
            <div
              v-show="
                BTCType === BTCTypeEnum.icBTC ? BTCAddressIc : BTCAddressCk
              "
            >
              <span v-show="BTCType === BTCTypeEnum.icBTC">
                {{ BTCAddressIc | ellipsisAccount(10) }}
              </span>
              <span v-show="BTCType === BTCTypeEnum.ckBTC">
                {{ BTCAddressCk | ellipsisAccount(10) }}
              </span>
              <a-icon
                class="pointer"
                type="copy"
                v-clipboard:copy="
                  BTCType === BTCTypeEnum.icBTC ? BTCAddressIc : BTCAddressCk
                "
                v-clipboard:success="onCopySuccess"
                v-clipboard:error="onError"
              />
            </div>
            <div
              v-show="BTCType === BTCTypeEnum.icBTC && BTCAddressIc"
              class="btc-config mt20 base-font-normal"
            >
              Minimum amount 0.0002 BTC, maximum amount 0.05 BTC.
            </div>
            <div
              v-show="BTCType === BTCTypeEnum.ckBTC && BTCAddressCk"
              class="btc-config mt20 base-font-normal"
            >
              KYT Fee 0.00002 BTC.
              <!--Minimum amount 0.0001 BTC.-->
            </div>
          </div>
          <!--<div class="step-footer">Step1: Send BTC to the address above.</div>-->
        </div>
        <div v-show="mintStep === 2" class="forge-right w100">
          <div style="margin-bottom: 20px" class="btc-txs">
            <div class="btc-txs-header base-font-title">
              <span
                class="margin-left-auto pointer"
                style="color: #1996c4; font-size: 12px"
                @click="forgeModalBTCTransactions = true"
              >
                Transactions
              </span>
            </div>
            <button
              type="button"
              class="primary w100"
              style="height: 36px; margin-top: 30px"
              @click="forge(BTCType)"
            >
              Mint {{ BTCType }}
            </button>
            <div class="ic-token-balance">
              Balance:&nbsp;
              <div class="balance base-font-normal">
                <span v-show="BTCType === BTCTypeEnum.icBTC">
                  {{ icBTCBalance | bigintToFloat(8, 8) | formatAmount(8) }}
                </span>
                <span v-show="BTCType === BTCTypeEnum.ckBTC">
                  {{ ckBTCBalance | bigintToFloat(8, 8) | formatAmount(8) }}
                </span>
              </div>
              &nbsp;{{ BTCType }}&nbsp;
              <a-icon
                @click="refreshCkBTCBalance(BTCType)"
                v-show="
                  BTCType === BTCTypeEnum.ckBTC
                    ? !refreshCkBTCBalanceLoading
                    : !refreshIcBTCBalanceLoading
                "
                type="reload"
                class="reload-icon"
              />
              <a-icon
                v-show="
                  BTCType === BTCTypeEnum.ckBTC
                    ? refreshCkBTCBalanceLoading
                    : refreshIcBTCBalanceLoading
                "
                type="loading"
                class="reload-icon"
              />
            </div>
            <div class="step-footer-confirmation">
              Wait for
              {{ BTCType === BTCTypeEnum.icBTC ? 6 : 12 }} confirmations, then
              submit to mint
              {{ BTCType }}
              .
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="forgeModalBTCTransactions"
      width="750px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal forge-modal forge-modal-eth active-pending-modal"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">BTC Latest Transactions</div>
      </div>
      <div class="forge-right">
        <div class="btc-txs">
          <a-spin
            v-show="BTCType === BTCTypeEnum.icBTC"
            class="btc-txs-ul-spin"
            :spinning="showBTCTransactions"
          >
            <ul class="btc-txs-ul" v-if="BTCTransactions.length">
              <li
                v-for="tx in BTCTransactions.slice(
                  (BTCTransactionsPage - 1) * BTCTransactionsPageSize,
                  BTCTransactionsPage * BTCTransactionsPageSize
                )"
                :key="tx.txid"
              >
                <div class="btc-txs-hash">
                  <div>{{ tx.status.block_time | filterTime }}</div>
                  <div class="margin-left-auto">
                    <span
                      :class="{
                        Confirmed:
                          tx.status.block_height &&
                          tx.status.block_height <= updateBlockHeight
                      }"
                    >
                      {{ filterStatus(tx.status.block_height) }}
                      <span
                        v-if="
                          tx.status.block_height &&
                          ((BTCType === BTCTypeEnum.icBTC &&
                            blockCount - tx.status.block_height < 5) ||
                            (BTCType === BTCTypeEnum.ckBTC &&
                              blockCount - tx.status.block_height < 11))
                        "
                      >
                        ({{ blockCount - tx.status.block_height + 1 }})
                      </span>
                    </span>
                    <a-icon
                      class="has-update"
                      v-show="
                        tx.status.block_height &&
                        tx.status.block_height <= updateBlockHeight
                      "
                      type="check-circle"
                    />
                  </div>
                </div>
                <div class="btc-txs-info">
                  <div class="btc-txs-info-left">
                    <div>
                      <div
                        v-for="(account, index) in tx.vin"
                        :key="account.txid"
                      >
                        <div class="flex-auto">
                          <a
                            class="flex1"
                            :href="`https://www.blockchain.com/btc/address/${account.prevout.scriptpubkey_address}`"
                            rel="nofollow noreferrer noopener"
                            target="_blank"
                          >
                            {{
                              account.prevout.scriptpubkey_address
                                | ellipsisAccount(6)
                            }}
                          </a>
                          <span class="tx-balance flex1">
                            <a-icon v-show="index === 0" type="arrow-right"
                          /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      class="flex-auto flex-auto-h5"
                      v-for="(out, index) in tx.vout"
                      :key="index"
                    >
                      <a
                        v-show="
                          (BTCType === BTCTypeEnum.icBTC &&
                            out.scriptpubkey_address === BTCAddressIc) ||
                          (BTCType === BTCTypeEnum.ckBTC &&
                            out.scriptpubkey_address === BTCAddressCk)
                        "
                        class="flex1"
                        :class="{
                          'out-address-m':
                            (BTCType === BTCTypeEnum.icBTC &&
                              out.scriptpubkey_address === BTCAddressIc) ||
                            (BTCType === BTCTypeEnum.ckBTC &&
                              out.scriptpubkey_address === BTCAddressCk)
                        }"
                        :href="`https://www.blockchain.com/btc/address/${out.scriptpubkey_address}`"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                      >
                        {{ out.scriptpubkey_address | ellipsisAccount(6) }}
                      </a>
                      <span
                        v-show="
                          (BTCType === BTCTypeEnum.icBTC &&
                            out.scriptpubkey_address !== BTCAddressIc) ||
                          (BTCType === BTCTypeEnum.ckBTC &&
                            out.scriptpubkey_address !== BTCAddressCk)
                        "
                      >
                        ......
                      </span>
                      <a
                        v-show="
                          (BTCType === BTCTypeEnum.icBTC &&
                            out.scriptpubkey_address === BTCAddressIc) ||
                          (BTCType === BTCTypeEnum.ckBTC &&
                            out.scriptpubkey_address === BTCAddressCk)
                        "
                        class="tx-balance out-address-m"
                        :href="`https://www.blockchain.com/btc/tx/${tx.txid}`"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                        >{{
                          out.value | bigintToFloat(8, 8) | formatAmount(8)
                        }}
                        BTC</a
                      >
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div
              class="no-btc-txs-ul"
              v-show="!showBTCTransactions && !BTCTransactions.length"
            >
              No Transactions
            </div>
          </a-spin>
          <a-spin
            v-show="BTCType === BTCTypeEnum.ckBTC"
            class="btc-txs-ul-spin"
            :spinning="showCkBTCTransactions"
          >
            <ul class="btc-txs-ul" v-if="ckBTCTransactions.length">
              <li
                v-for="tx in ckBTCTransactions.slice(
                  (ckBTCTransactionsPage - 1) * ckBTCTransactionsPageSize,
                  ckBTCTransactionsPage * ckBTCTransactionsPageSize
                )"
                :key="tx.txid"
              >
                <div class="btc-txs-hash">
                  <div>{{ tx.status.block_time | filterTime }}</div>
                  <div class="margin-left-auto">
                    <span
                      :class="{
                        Confirmed:
                          tx.status.block_height &&
                          tx.status.block_height <= updateCkBlockHeight
                      }"
                    >
                      {{ filterStatus(tx.status.block_height) }}
                      <span
                        v-if="
                          tx.status.block_height &&
                          ((BTCType === BTCTypeEnum.icBTC &&
                            blockCount - tx.status.block_height < 5) ||
                            (BTCType === BTCTypeEnum.ckBTC &&
                              blockCount - tx.status.block_height < 11))
                        "
                      >
                        ({{ blockCount - tx.status.block_height + 1 }})
                      </span>
                    </span>
                    <a-icon
                      class="has-update"
                      v-show="
                        tx.status.block_height &&
                        tx.status.block_height <= updateCkBlockHeight
                      "
                      type="check-circle"
                    />
                  </div>
                </div>
                <div class="btc-txs-info">
                  <div class="btc-txs-info-left">
                    <div>
                      <div
                        v-for="(account, index) in tx.vin"
                        :key="account.txid"
                      >
                        <div class="flex-auto">
                          <a
                            class="flex1"
                            :href="`https://www.blockchain.com/btc/address/${account.prevout.scriptpubkey_address}`"
                            rel="nofollow noreferrer noopener"
                            target="_blank"
                          >
                            {{
                              account.prevout.scriptpubkey_address
                                | ellipsisAccount(6)
                            }}
                          </a>
                          <span class="tx-balance flex1">
                            <a-icon v-show="index === 0" type="arrow-right"
                          /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      class="flex-auto flex-auto-h5"
                      v-for="(out, index) in tx.vout"
                      :key="index"
                    >
                      <a
                        v-show="
                          (BTCType === BTCTypeEnum.icBTC &&
                            out.scriptpubkey_address === BTCAddressIc) ||
                          (BTCType === BTCTypeEnum.ckBTC &&
                            out.scriptpubkey_address === BTCAddressCk)
                        "
                        class="flex1"
                        :class="{
                          'out-address-m':
                            (BTCType === BTCTypeEnum.icBTC &&
                              out.scriptpubkey_address === BTCAddressIc) ||
                            (BTCType === BTCTypeEnum.ckBTC &&
                              out.scriptpubkey_address === BTCAddressCk)
                        }"
                        :href="`https://www.blockchain.com/btc/address/${out.scriptpubkey_address}`"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                      >
                        {{ out.scriptpubkey_address | ellipsisAccount(6) }}
                      </a>
                      <span
                        v-show="
                          (BTCType === BTCTypeEnum.icBTC &&
                            out.scriptpubkey_address !== BTCAddressIc) ||
                          (BTCType === BTCTypeEnum.ckBTC &&
                            out.scriptpubkey_address !== BTCAddressCk)
                        "
                      >
                        ......
                      </span>
                      <a
                        v-show="
                          (BTCType === BTCTypeEnum.icBTC &&
                            out.scriptpubkey_address === BTCAddressIc) ||
                          (BTCType === BTCTypeEnum.ckBTC &&
                            out.scriptpubkey_address === BTCAddressCk)
                        "
                        class="tx-balance out-address-m"
                        :href="`https://www.blockchain.com/btc/tx/${tx.txid}`"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                        >{{
                          out.value | bigintToFloat(8, 8) | formatAmount(8)
                        }}
                        BTC</a
                      >
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div
              class="no-btc-txs-ul"
              v-show="!showCkBTCTransactions && !ckBTCTransactions.length"
            >
              No Transactions
            </div>
          </a-spin>
          <div class="pagination-transaction-main">
            <a-pagination
              v-if="
                BTCTransactionTotal > BTCTransactionsPageSize &&
                BTCType === BTCTypeEnum.icBTC
              "
              class="pagination-transaction"
              :default-page-size="BTCTransactionsPageSize"
              :current="BTCTransactionsPage"
              :total="BTCTransactionTotal"
              @change="pageChange"
            />
            <a-pagination
              v-if="
                ckBTCTransactionTotal > ckBTCTransactionsPageSize &&
                BTCType === BTCTypeEnum.ckBTC
              "
              class="pagination-transaction"
              :default-page-size="ckBTCTransactionsPageSize"
              :current="ckBTCTransactionsPage"
              :total="ckBTCTransactionTotal"
              @change="pageChange"
            />
          </div>
          <!--<div class="step-footer">
						Step2: Wait for
						{{ BTCType === BTCTypeEnum.icBTC ? 6 : 12 }} confirmations, then
						submit to update
						{{ BTCType }}
						balance.
						<img
							v-show="BTCType === BTCTypeEnum.icBTC && hasConfirmedLoading"
							src="@/assets/img/loading.svg"
							alt=""
						/>
						<img
							v-show="BTCType === BTCTypeEnum.ckBTC && hasCkConfirmedLoading"
							src="@/assets/img/loading.svg"
							alt=""
						/>
					</div>-->
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="dissolveModal"
      centered
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
      class="transfer-modal forge-modal dissolve-modal"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">{{ dissolveTitle }}</div>
        <!--<span class="title-tip"
          >Do not leave this page until the transaction is fully completed. If
          you leave this page, please come back here again.</span
        >-->
      </div>
      <div class="step-list">
        <span
          @click="previousRetrieveStep()"
          :class="{ active: retrieveStep > 1 }"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          @click="retrieveStep = 1"
          class="pointer"
          :class="{ active: retrieveStep === 1 }"
        >
          <span class="step-list-num">1</span><span>Transfer</span>
        </div>
        <div
          @click="retrieveStep = 2"
          class="pointer step-list-center"
          :class="{ active: retrieveStep === 2 }"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t"
            ><span class="step-list-num">2</span>Retrieve</span
          >
          <span class="step-list-line"></span>
        </div>
        <div
          @click="retrieveStep = 3"
          class="pointer"
          :class="{ active: retrieveStep === 3 }"
        >
          <span class="step-list-num">3</span><span>Records</span>
        </div>
        <span
          @click="nextRetrieveStep(3)"
          :class="{ active: retrieveStep < 3 }"
          class="step-next pc-show"
          ><a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" /> </a-tooltip
        ></span>
      </div>
      <a-spin class="dissolve-modal-spin" :spinning="!withdrawalAccount">
        <div class="forge-main">
          <div v-show="retrieveStep === 1" class="forge-left">
            <div>
              <div>
                <div class="base-font-title">
                  Transfer {{ BTCType }} to retrieving account:
                </div>
              </div>
              <a-form-model
                ref="form"
                :model="dissolveForm"
                :rules="dissolveFormRules"
              >
                <a-form-model-item :colon="false" prop="amount">
                  <template slot="label"
                    >Amount:&nbsp;<span class="label-tip"
                      >(includes bitcoin network fees)</span
                    >
                  </template>
                  <a-input
                    v-model="dissolveForm.amount"
                    autocomplete="off"
                    type="text"
                    v-only-float="8"
                    min="0"
                    placeholder="0.00"
                  />
                </a-form-model-item>
              </a-form-model>
              <div class="retrieving-fee">
                <div class="forge-left-balance">
                  <div>
                    {{ BTCType }} Balance:
                    <div class="balance base-font-normal">
                      <span v-show="BTCType === BTCTypeEnum.icBTC">
                        {{
                          icBTCBalance | bigintToFloat(8, 8) | formatAmount(8)
                        }}
                      </span>
                      <span v-show="BTCType === BTCTypeEnum.ckBTC">
                        {{
                          ckBTCBalance | bigintToFloat(8, 8) | formatAmount(8)
                        }}
                      </span>
                    </div>
                    {{ BTCType }}&nbsp;
                    <a-icon
                      @click="refreshCkBTCBalance(BTCType)"
                      v-show="
                        BTCType === BTCTypeEnum.ckBTC
                          ? !refreshCkBTCBalanceLoading
                          : !refreshIcBTCBalanceLoading
                      "
                      type="reload"
                      class="reload-icon"
                    />
                    <a-icon
                      v-show="
                        BTCType === BTCTypeEnum.ckBTC
                          ? refreshCkBTCBalanceLoading
                          : refreshIcBTCBalanceLoading
                      "
                      type="loading"
                      class="reload-icon"
                    />
                    <span
                      class="transfer-balance-max pc-show"
                      @click="setMaxRetrieve"
                    >
                      Max
                    </span>
                  </div>
                  <div>
                    Fee:&nbsp;
                    <span v-show="BTCType === BTCTypeEnum.icBTC">
                      {{ icBTCFee.toFixed(8) }}
                    </span>
                    <span v-show="BTCType === BTCTypeEnum.ckBTC">
                      {{ ckBTCFee.toFixed(8) }}
                    </span>
                    &nbsp;{{ BTCType }}
                  </div>
                </div>
                <router-link
                  class="transfer-balance-right pc-show"
                  :to="`/ICDex/${BTCType}/ICP`"
                >
                  Trade
                </router-link>
              </div>
              <button
                @click="transferCkBTC"
                type="button"
                class="primary retrieve-button w100 mt20"
              >
                Transfer {{ BTCType }}
              </button>
            </div>
          </div>
          <div class="w100" v-show="retrieveStep === 2">
            <div>
              <!--<div class="base-font-title">Retrieve BTC:</div>-->
              <div v-show="BTCType === BTCTypeEnum.icBTC" class="ic-btc-tip">
                icBTC only supports P2PKH addresses (Legacy addresses, starting
                with "1" prefix on the Bitcoin mainnet).
              </div>
              <a-form-model
                ref="retrieveForm"
                :model="retrieveForm"
                :rules="retrieveFormRules"
              >
                <a-form-model-item
                  label="Destination BTC address"
                  prop="address"
                >
                  <a-input
                    v-model="retrieveForm.address"
                    autocomplete="off"
                    type="text"
                    placeholder="BTC address"
                  />
                </a-form-model-item>
              </a-form-model>
              <div>
                <div
                  class="base-red"
                  style="line-height: 1.2; margin-bottom: 10px"
                >
                  Please fill in the address of non-custodian wallet, not the
                  deposit address of CEX (such as Binance, Coinbase, etc.),
                  otherwise you may lose BTC in case of exception.
                </div>
                {{ BTCType }} available to unwrap:
                {{ availableBalance | bigintToFloat(8, 8) }}
                <div v-show="btcRetrieveFee">
                  A fee of about
                  {{ btcRetrieveFee | bigintToFloat(8, 8) }} BTC will be
                  charged.
                </div>
              </div>
              <button
                :disabled="!canRetrieve"
                type="button"
                class="primary retrieve-button w100 mt20"
                @click="dissolve"
              >
                Retrieve {{ availableBalance | bigintToFloat(8, 8) }} BTC
              </button>
            </div>
          </div>
          <div v-show="retrieveStep === 3" class="forge-right w100">
            <div class="base-font-title">
              Retrieved:(Finalizing BTC retrieval can take up to an hour.)
            </div>
            <div class="btc-txs retrieve-btc-status">
              <ul class="retrieve-btc-status-ul">
                <li>
                  <div
                    class="
                      retrieve-btc-status-block-index
                      retrieve-btc-status-block-index-block
                    "
                  >
                    BlockIndex
                  </div>
                  <div>Status</div>
                  <div class="margin-left-auto">Txid</div>
                </li>
                <li
                  v-for="(status, index) in retrieveBtcStatus.slice(
                    (retrieveBtcStatusPage - 1) * retrieveBtcStatusPageSize,
                    retrieveBtcStatusPage * retrieveBtcStatusPageSize
                  )"
                  :key="index"
                >
                  <div class="retrieve-btc-status-block-index">
                    {{ status.blockIndex }}
                  </div>
                  <div class="retrieve-btc-status-flex">
                    {{ status.status && Object.keys(status.status)[0] }}
                    <span
                      v-show="
                        status.status &&
                        ['Pending', 'Signing', 'Sending', 'Submitted'].includes(
                          Object.keys(status.status)[0]
                        )
                      "
                      class="loading-spinner"
                    ></span>
                  </div>
                  <div class="margin-left-auto">
                    <a
                      v-if="getRetrieveBtcTxid(status.status)"
                      :href="`https://www.blockchain.com/btc/tx/${getRetrieveBtcTxid(
                        status.status
                      )}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      <span class="pc-show">{{
                        getRetrieveBtcTxid(status.status) | ellipsisAccount(8)
                      }}</span>
                      <span class="h5-show">{{
                        getRetrieveBtcTxid(status.status) | ellipsisAccount()
                      }}</span>
                    </a>
                    <span v-else>-</span>
                  </div>
                </li>
                <li
                  class="no-retrieve-btc-status-ul"
                  v-show="!retrieveBtcStatus.length"
                >
                  No Data
                </li>
              </ul>
              <div class="pagination-transaction-main">
                <a-pagination
                  v-if="retrieveBtcStatus.length > retrieveBtcStatusPageSize"
                  class="pagination-transaction"
                  :default-page-size="retrieveBtcStatusPageSize"
                  :current="retrieveBtcStatusPage"
                  :total="retrieveBtcStatus.length"
                  @change="retrieveBtcStatusPageChange"
                />
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </a-modal>
    <a-modal
      v-model="dissolveModalETH"
      centered
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterForgeCloseETH"
      class="transfer-modal forge-modal dissolve-modal"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">{{ dissolveTitleETH }}</div>
        <!--<span class="title-tip"
          >Do not leave this page until the transaction is fully completed. If
          you leave this page, please come back here again.</span
        >-->
      </div>
      <div
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
        class="step-list"
      >
        <span
          @click="previousRetrieveStep()"
          :class="{ active: retrieveStep > 1 }"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          @click="changeRetrieveStep(1)"
          class="pointer"
          :class="{ active: retrieveStep === 1 }"
        >
          <span class="step-list-num">1</span><span>Transfer</span>
        </div>
        <div
          @click="changeRetrieveStep(2)"
          class="pointer step-list-center"
          :class="{ active: retrieveStep === 2 }"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t"
            ><span class="step-list-num">2</span>Retrieve</span
          >
          <span class="step-list-line"></span>
        </div>
        <div
          @click="changeRetrieveStep(3)"
          class="pointer"
          :class="{ active: retrieveStep === 3 }"
        >
          <span class="step-list-num">3</span><span>Records</span>
        </div>
        <span
          @click="nextRetrieveStep(3)"
          :class="{ active: retrieveStep < 3 }"
          class="step-next pc-show"
          ><a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" /> </a-tooltip
        ></span>
      </div>
      <a-spin class="dissolve-modal-spin" :spinning="!ckETHWithdrawalAccount">
        <div
          v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
          class="forge-main"
        >
          <div class="w100" v-show="retrieveStep === 1">
            <div>
              <div class="base-font-title">
                Transfer {{ icNetworkTokens.symbol }} ({{
                  networkIds[icNetworkTokens.networkId]
                }}) to retrieving account:
              </div>
              <!--<div v-if="withdrawalAccount">principal: {{ withdrawalAccount.owner.toString() }}</div>
							<div v-if="withdrawalAccount">
								subaccount:
								{{ arrayToString(withdrawalAccount.subaccount[0]) }}
							</div>-->
            </div>
            <a-form-model
              ref="ethForm"
              :model="ethDissolveForm"
              :rules="ethDissolveFormRules"
            >
              <a-form-model-item :colon="false" prop="retrieveAmount">
                <template slot="label"
                  >Amount:&nbsp;<span class="label-tip"
                    >(includes network fees)</span
                  >
                </template>
                <a-input
                  v-model="ethDissolveForm.retrieveAmount"
                  autocomplete="off"
                  type="text"
                  v-only-float="8"
                  min="0"
                  placeholder="0.00"
                />
              </a-form-model-item>
            </a-form-model>
            <div class="retrieving-fee">
              <div class="forge-left-balance">
                <div>
                  Balance:
                  <div class="balance base-font-normal">
                    <span>
                      {{
                        ERC20Balance[icNetworkTokens.tokenId]
                          | bigintToFloat(
                            8,
                            icNetworkTokens.icTokenInfo.decimals
                          )
                          | formatAmount(8)
                      }}
                    </span>
                  </div>
                  {{ icNetworkTokens.symbol }} ({{
                    networkIds[icNetworkTokens.networkId]
                  }})&nbsp;
                  <a-icon
                    @click="refreshCkETHBalance()"
                    v-show="!refreshCkETHBalanceLoading"
                    type="reload"
                    class="reload-icon"
                  />
                  <a-icon
                    v-show="refreshCkETHBalanceLoading"
                    type="loading"
                    class="reload-icon"
                  />
                  <span
                    class="transfer-balance-max pc-show"
                    @click="setMaxETHRetrieve(null)"
                  >
                    Max
                  </span>
                </div>
                <div>
                  Fee:&nbsp;
                  <span>
                    {{
                      tokens[icNetworkTokens.tokenId].fee
                        | bigintToFloat(
                          icNetworkTokens.icTokenInfo.decimals,
                          icNetworkTokens.icTokenInfo.decimals
                        )
                    }}
                  </span>
                  &nbsp;{{ icNetworkTokens.symbol }} ({{
                    networkIds[icNetworkTokens.networkId]
                  }})&nbsp;
                </div>
              </div>
              <router-link
                class="transfer-balance-right pc-show"
                :to="`/ICDex/${icNetworkTokens.symbol}/ICP`"
              >
                Trade
              </router-link>
            </div>
            <button
              @click="transferCkETH"
              type="button"
              class="primary retrieve-button w100"
            >
              Transfer {{ icNetworkTokens.symbol }} ({{
                networkIds[icNetworkTokens.networkId]
              }})
            </button>
          </div>
          <div class="w100" v-show="retrieveStep === 2">
            <div>
              <a-form-model
                ref="ethRetrieveForm"
                :model="ethRetrieveForm"
                :rules="ethRetrieveFormRules"
              >
                <a-form-model-item
                  :label="`Destination ${icNetworkTokens.icTokenInfo.symbol} (${
                    networkIds[otherNetworkTokens.networkId]
                  }) address`"
                  prop="address"
                >
                  <a-input
                    v-model="ethRetrieveForm.address"
                    autocomplete="off"
                    type="text"
                    :placeholder="`${icNetworkTokens.icTokenInfo.symbol} (${
                      networkIds[otherNetworkTokens.networkId]
                    }) address`"
                  />
                </a-form-model-item>
              </a-form-model>
              <div>
                <div
                  class="base-red"
                  style="line-height: 1.2; margin-bottom: 10px"
                >
                  Please fill in the address of non-custodian wallet, not the
                  deposit address of CEX (such as Binance, Coinbase, etc.),
                  otherwise you may lose
                  {{ icNetworkTokens.icTokenInfo.symbol }} ({{
                    networkIds[otherNetworkTokens.networkId]
                  }}) in case of exception.
                </div>
                {{ icNetworkTokens.symbol }} ({{
                  networkIds[icNetworkTokens.networkId]
                }}) available:
                {{
                  dissolveBalanceETH
                    | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                }}
              </div>
              <div v-if="minterInfo">
                Estimated network fee:
                {{
                  filterRetrieveEstimatedFee(
                    icNetworkTokens.icTokenInfo,
                    minterInfo
                  )
                }}
                {{ icNetworkTokens.symbol }} ({{
                  networkIds[icNetworkTokens.networkId]
                }})
              </div>
              <button
                type="button"
                class="primary retrieve-button w100 mt20"
                :disabled="!canRetrieveETH"
                @click="dissolveCkETH"
              >
                Retrieve
                {{
                  dissolveBalanceETH
                    | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                }}
                {{ icNetworkTokens.symbol }} ({{
                  networkIds[icNetworkTokens.networkId]
                }})
              </button>
            </div>
          </div>
          <div class="w100 retrieve-btc-status" v-show="retrieveStep === 3">
            <ul class="retrieve-btc-status-ul-table">
              <!--<li>
                <div style="width: 15%">TxIndex</div>
                <div style="width: 35%">Amount</div>
                <div style="width: 25%">Address</div>
                <div style="width: 25%">TxHash</div>
              </li>-->
              <li
                v-for="(item, index) in retrieveEvent.slice(
                  (retrieveEventPage - 1) * retrieveEventPageSize,
                  retrieveEventPage * retrieveEventPageSize
                )"
                :key="index"
                style="align-items: flex-start"
                class="retrieve-btc-status-ul-table-eth"
              >
                <!--<span style="width: 15%" v-if="item[1].withdraw">
                  {{ item[1].withdraw.txIndex }}
                </span>-->
                Retrieve&nbsp;&nbsp;
                <span>
                  <span v-if="item[0] && item[0].burn">
                    <a
                      :href="`https://ic.house/address/${item[0].burn.icTokenCanisterId.toString()}/${accountToAddress(
                        item[0].burn.account
                      )}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{
                        accountToAddress(item[0].burn.account) | ellipsisAccount
                      }}
                    </a>
                  </span>
                  &nbsp;->&nbsp;
                  <span v-if="item[1] && item[1].withdraw">
                    <a
                      :href="
                        icNetworkTokens.id ===
                        '0x0000000000000000000000000000000000000000'
                          ? `${ethLink}/address/${item[1].withdraw.address}`
                          : `${ethLink}/token/${icNetworkTokens.id}?a=${item[1].withdraw.address}`
                      "
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                    >
                      {{ item[1].withdraw.address | ellipsisAccount() }}
                    </a>
                    <span class="h5-show" style="display: inline-block"
                      >&nbsp;&nbsp;</span
                    >
                  </span>
                </span>
                <span
                  style="min-width: 30%"
                  class="
                    base-font-title
                    margin-left-auto
                    text-right
                    retrieve-margin-left-auto
                  "
                  v-if="
                    item[2] &&
                    item[2].withdrawResult &&
                    item[2].withdrawResult.ok
                  "
                >
                  {{
                    item[2].withdrawResult.ok.amount
                      | bigintToFloat(8, icNetworkTokens.icTokenInfo.decimals)
                      | formatAmount(8)
                  }}
                  {{ icNetworkTokens.icTokenInfo.symbol }} ({{
                    networkIds[otherNetworkTokens.networkId]
                  }})&nbsp;
                </span>
                <div
                  v-if="item[2] && item[2].withdrawResult"
                  class="retrieve-btc-status-flex"
                >
                  <div v-if="item[2].withdrawResult.err" class="eth-tx-hash">
                    <span class="base-red">&nbsp;(Error)</span>
                  </div>
                </div>
              </li>
            </ul>
            <div
              v-if="!retrieveEvent.length"
              class="no-retrieve-btc-status-ul"
              style="display: flex"
            >
              No Record
            </div>
            <div class="pagination-transaction-main mt20">
              <a-pagination
                v-if="retrieveEvent.length > retrieveEventPageSize"
                class="pagination-transaction"
                :default-page-size="retrieveEventPageSize"
                :current="retrieveEventPage"
                :total="retrieveEvent.length"
                @change="retrieveEventPageChange"
              />
            </div>
          </div>
        </div>
        <div
          v-show="retrieveStep === 2 && retrieveETHStatus.length"
          class="forge-main mt20"
        >
          <a-spin
            v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
            class="btc-txs-ul-spin w100"
            :spinning="showRetrieveETHStatus"
          >
            <div class="btc-txs retrieve-btc-status">
              <div class="base-font-title">Pending</div>
              <ul class="retrieve-btc-status-ul pc-show">
                <li>
                  <div class="retrieve-btc-status-block-index">TxIndex</div>
                  <div>Status</div>
                  <div class="margin-left-auto">Amount</div>
                </li>
                <li
                  v-for="(status, index) in retrieveETHStatus.slice(
                    (retrieveETHStatusPage - 1) * retrieveETHStatusPageSize,
                    retrieveETHStatusPage * retrieveETHStatusPageSize
                  )"
                  :key="index"
                >
                  <div class="retrieve-btc-status-block-index">
                    {{ status[0] }}
                  </div>
                  <div class="retrieve-btc-status-flex">
                    <span>
                      {{
                        status[1].status
                          ? Object.keys(status[1].status)[0]
                          : '-'
                      }}
                    </span>
                    <div class="eth-tx-hash">
                      <div
                        class="pc-show"
                        v-if="status[1].txHash && status[1].txHash.length"
                      >
                        <a
                          v-for="hash in status[1].txHash"
                          :key="hash"
                          :href="`${ethLink}/tx/${hash}`"
                          rel="nofollow noreferrer noopener"
                          target="_blank"
                        >
                          ({{ hash | ellipsisAccount() }})
                        </a>
                      </div>
                      <span
                        v-show="
                          status[1].status &&
                          [
                            'Pending',
                            'Signing',
                            'Building',
                            'Sending',
                            'Submitted'
                          ].includes(Object.keys(status[1].status)[0])
                        "
                        class="loading-spinner"
                      ></span>
                    </div>
                  </div>
                  <div class="margin-left-auto" style="text-align: right">
                    <span>
                      {{
                        status[1].amount
                          | bigintToFloat(
                            8,
                            icNetworkTokens.icTokenInfo.decimals
                          )
                          | formatAmount(8)
                      }}
                      {{ icNetworkTokens.icTokenInfo.symbol }} ({{
                        networkIds[otherNetworkTokens.networkId]
                      }})
                    </span>
                  </div>
                </li>
                <li
                  class="no-retrieve-btc-status-ul"
                  v-show="!showRetrieveETHStatus && !retrieveETHStatus.length"
                >
                  No Data
                </li>
              </ul>
              <ul class="retrieve-btc-status-ul h5-show">
                <li
                  v-for="(status, index) in retrieveETHStatus.slice(
                    (retrieveETHStatusPage - 1) * retrieveETHStatusPageSize,
                    retrieveETHStatusPage * retrieveETHStatusPageSize
                  )"
                  :key="index"
                  style="font-size: 12px"
                >
                  <div class="li-h5-item">
                    <span class="li-left">TxIndex:</span>
                    <span class="margin-left-auto">{{ status[0] }}</span>
                  </div>
                  <div class="li-h5-item">
                    <span class="li-left">Status:</span>
                    <span class="margin-left-auto">
                      <span>
                        {{
                          status[1].status
                            ? Object.keys(status[1].status)[0]
                            : '-'
                        }}
                      </span>
                      <span
                        v-show="
                          status[1].status &&
                          [
                            'Pending',
                            'Signing',
                            'Building',
                            'Sending',
                            'Submitted'
                          ].includes(Object.keys(status[1].status)[0])
                        "
                        class="loading-spinner"
                      ></span>
                    </span>
                  </div>
                  <div class="li-h5-item">
                    <span class="li-left">Amount:</span>
                    <span class="margin-left-auto">
                      <span>
                        {{
                          status[1].amount
                            | bigintToFloat(
                              8,
                              icNetworkTokens.icTokenInfo.decimals
                            )
                            | formatAmount(8)
                        }}
                        {{ icNetworkTokens.icTokenInfo.symbol }} ({{
                          networkIds[otherNetworkTokens.networkId]
                        }})
                      </span>
                    </span>
                  </div>
                </li>
              </ul>
              <div class="pagination-transaction-main">
                <a-pagination
                  v-if="retrieveETHStatus.length > retrieveETHStatusPageSize"
                  class="pagination-transaction"
                  :default-page-size="retrieveETHStatusPageSize"
                  :current="retrieveETHStatusPage"
                  :total="retrieveETHStatus.length"
                  @change="retrieveETHStatusPageChange"
                />
              </div>
            </div>
          </a-spin>
        </div>
      </a-spin>
    </a-modal>
    <a-modal
      v-model="claimModalTransactions"
      width="500px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal forge-modal forge-modal-eth active-pending-modal"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">Claim history</div>
      </div>
      <div class="forge-right">
        <div class="btc-txs">
          <ul v-show="depositInfo.length" class="btc-txs-ul">
            <li
              v-for="(item, index) in depositInfo.slice(
                (depositInfoPage - 1) * depositInfoPageSize,
                depositInfoPage * depositInfoPageSize
              )"
              :key="index"
              style="display: flex; padding: 10px 0"
            >
              Txid:&nbsp;&nbsp;
              <a
                :href="`${ethLink}/tx/${item[0]}`"
                rel="nofollow noreferrer noopener"
                target="_blank"
              >
                <span class="pc-show">
                  {{ item[0] | ellipsisAccount(26) }}
                </span>
                <span class="h5-show">
                  {{ item[0] | ellipsisAccount(10) }}
                </span> </a
              ><span
                class="margin-left-auto pointer"
                v-if="
                  !item[2] &&
                  !(
                    depositingInfo &&
                    depositingInfo[0] &&
                    depositingInfo[0] === item[0]
                  ) &&
                  signatureForm.txHash !== item[0]
                "
                style="color: #51b7c3; font-size: 14px"
                @click="tryClaim(item[0])"
                >Claim</span
              >
            </li>
          </ul>
          <div
            class="no-btc-txs-ul"
            v-show="!depositInfo.length"
            style="display: flex"
          >
            No Record
          </div>
          <div class="pagination-transaction-main mt20">
            <a-pagination
              v-if="depositInfo.length > depositInfoPageSize"
              class="pagination-transaction"
              :default-page-size="depositInfoPageSize"
              :current="depositInfoPage"
              :total="depositInfo.length"
              @change="pageChangeDepositInfo"
            />
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="metaMaskVisible"
      centered
      width="400px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <p>MetaMask is not installed. Click "OK" to install MetaMask!</p>
      <div class="delete-button">
        <button type="button" @click="metaMaskVisible = false">Cancel</button>
        <button type="button" class="default" @click="installMetaMask">
          OK
        </button>
      </div>
    </a-modal>
    <a-modal
      v-model="showEthAddressCode"
      centered
      width="400px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="delete-modal"
    >
      <div
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
        class="btc-address-code"
      >
        <p>
          {{ icNetworkTokens.icTokenInfo.symbol }} ({{
            networkIds[otherNetworkTokens.networkId]
          }}) Deposit Address
        </p>
        <a-spin :spinning="!ETHAddressCk">
          <img :src="ckETHAccountCode" alt="" />
        </a-spin>
        <div v-show="ETHAddressCk">
          <span>
            {{ ETHAddressCk | ellipsisAccount(10) }}
          </span>
          <a-icon
            class="pointer"
            type="copy"
            v-clipboard:copy="ETHAddressCk"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onError"
          />
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="activePendingModal"
      width="750px"
      title="Activities"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal forge-modal forge-modal-eth active-pending-modal"
    >
      <div>
        <div v-if="activePending.claim && activePending.claim.length">
          <div
            class="active-pending-item"
            v-for="(item, index) in activePending.claim"
            :key="index"
          >
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].symbol }}
            </span>
            &nbsp;->&nbsp;
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
            </span>
            <span class="margin-left-auto">
              {{ item.txHash | ellipsisAccount }}
            </span>
            <button
              class="primary"
              @click="toActive('claim', item.tokenId, item.txHash)"
            >
              View
            </button>
          </div>
        </div>
        <div v-if="activePending.claim2 && activePending.claim2.length">
          <div
            class="active-pending-item"
            v-for="(item, index) in activePending.claim2"
            :key="index"
          >
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].symbol }}
            </span>
            &nbsp;->&nbsp;
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
            </span>
            <span class="margin-left-auto">
              {{ item.txHash | ellipsisAccount }}
            </span>
            <button class="primary" @click="toActive('claim2', item.tokenId)">
              View
            </button>
          </div>
        </div>
        <div v-if="activePending.mint && activePending.mint.length">
          <div
            class="active-pending-item"
            v-for="(item, index) in activePending.mint"
            :key="index"
          >
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].symbol }}
            </span>
            &nbsp;->&nbsp;
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
            </span>
            <span class="margin-left-auto">
              {{
                item.amount
                  | bigintToFloat(8, ckTokenInfo[item.tokenId].decimals)
                  | formatAmount(8)
              }}
            </span>
            <button class="primary" @click="toActive('mint', item.tokenId)">
              View
            </button>
          </div>
        </div>
        <div
          v-if="
            activePending.deposit &&
            activePending.deposit[2] &&
            activePending.deposit[2][0]
          "
        >
          <div class="active-pending-item">
            <span
              v-if="
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.deposit[2][0].tokenId]
                ]
              "
            >
              {{
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.deposit[2][0].tokenId]
                ].symbol
              }}
            </span>
            &nbsp;->&nbsp;
            <span
              v-if="
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.deposit[2][0].tokenId]
                ]
              "
            >
              {{
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.deposit[2][0].tokenId]
                ].ckSymbol
              }}(IC Network)
            </span>
            <span
              v-if="
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.deposit[2][0].tokenId]
                ]
              "
              class="margin-left-auto"
            >
              {{
                activePending.deposit[2][0].amount
                  | bigintToFloat(
                    8,
                    ckTokenInfo[
                      ethersTokenIdToCkTokenId[
                        activePending.deposit[2][0].tokenId
                      ]
                    ].decimals
                  )
                  | formatAmount(8)
              }}
            </span>
            <button
              class="primary"
              @click="
                toActive(
                  'deposit',
                  ethersTokenIdToCkTokenId[activePending.deposit[2][0].tokenId]
                )
              "
            >
              View
            </button>
          </div>
        </div>
        <div v-if="activePending.retrieve && activePending.retrieve.length">
          <div
            class="active-pending-item"
            v-for="(item, index) in activePending.retrieve"
            :key="index"
          >
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
            </span>
            &nbsp;->&nbsp;
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].symbol }}
            </span>
            <span class="margin-left-auto">
              {{
                item.amount
                  | bigintToFloat(8, ckTokenInfo[item.tokenId].decimals)
                  | formatAmount(8)
              }}
            </span>
            <button class="primary" @click="toActive('retrieve', item.tokenId)">
              View
            </button>
          </div>
        </div>
        <div v-if="activePending.retrieve2 && activePending.retrieve2.length">
          <div class="active-pending-item">
            <span
              v-if="
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.retrieve2[1].tokenId]
                ]
              "
            >
              {{
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.retrieve2[1].tokenId]
                ].ckSymbol
              }}(IC Network)
            </span>
            &nbsp;->&nbsp;
            <span
              v-if="
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.retrieve2[1].tokenId]
                ]
              "
            >
              {{
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.retrieve2[1].tokenId]
                ].symbol
              }}
            </span>
            <span
              v-if="
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.retrieve2[1].tokenId]
                ]
              "
              class="margin-left-auto"
            >
              {{
                activePending.retrieve2[1].amount
                  | bigintToFloat(
                    8,
                    ckTokenInfo[
                      ethersTokenIdToCkTokenId[
                        activePending.retrieve2[1].tokenId
                      ]
                    ].decimals
                  )
                  | formatAmount(8)
              }}
            </span>
            <button
              class="primary"
              @click="
                toActive(
                  'retrieve',
                  ethersTokenIdToCkTokenId[activePending.retrieve2[1].tokenId]
                )
              "
            >
              View
            </button>
          </div>
        </div>
        <div v-if="activePending.mintCKETH && activePending.mintCKETH.length">
          <div
            class="active-pending-item"
            v-for="(item, index) in activePending.mintCKETH"
            :key="index"
          >
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].symbol }}
            </span>
            &nbsp;->&nbsp;
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
            </span>
            <span class="margin-left-auto">
              {{ item.txHash | ellipsisAccount }}
            </span>
            <button
              class="primary"
              @click="toActive('mintCKETH', item.tokenId)"
            >
              View
            </button>
          </div>
        </div>
        <div
          v-if="
            activePending.retrieveCKETH && activePending.retrieveCKETH.length
          "
        >
          <div
            class="active-pending-item"
            v-for="(item, index) in activePending.retrieveCKETH"
            :key="index"
          >
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
            </span>
            &nbsp;->&nbsp;
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].symbol }}
            </span>
            <span v-if="ckTokenInfo[item.tokenId]" class="margin-left-auto">
              {{
                item.amount
                  | bigintToFloat(8, ckTokenInfo[item.tokenId].decimals)
                  | formatAmount(8)
              }}
            </span>
            <button
              class="primary"
              @click="toActive('retrieveCKETH', item.tokenId)"
            >
              View
            </button>
          </div>
        </div>
      </div>
      <div
        v-show="
          !activePending.claim &&
          !activePending.claim2 &&
          !activePending.mint &&
          !activePending.deposit &&
          !activePending.retrieve &&
          !activePending.retrieve2 &&
          !activePending.mintCKETH &&
          !activePending.retrieveCKETH
        "
      >
        No data
      </div>
    </a-modal>
    <approve-icrc2
      ref="approveIcrc2"
      :balance="balance"
      @approveIcrc2Success="approveIcrc2Success"
    ></approve-icrc2>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import TransferIcp from '@/components/transferIcp/Index.vue';
import TopUp from '@/components/topUp/Index.vue';
import { BalanceMixin } from '@/mixins';
import {
  Icrc1Account,
  PrincipalString,
  Time,
  TokenInfo
} from '@/ic/common/icType';
import ReceiveModal from '@/components/receiveModal/Index.vue';
import { getDepositing, getTokenBalance } from '@/ic/getTokenBalance';
import {
  Active,
  ActiveType,
  AddTokenItem,
  AddTokenItemClass,
  BTCTypeEnum,
  ClaimActive,
  ClaimCKETHActive,
  ICNetworkTokensInterface,
  MintActive,
  networkIds,
  networkList,
  networkTokens,
  RetrieveActive
} from '@/views/home/account/model';
import { Principal } from '@dfinity/principal';
import TransferToken from '@/components/transferToken/Index.vue';
import QRCode from 'qrcode';
import axios from 'axios';
import {
  formatDateToSecondUTC,
  fromSubAccountId,
  hexToBytes,
  principalToAccountIdentifier,
  toHexString
} from '@/ic/converter';
import BigNumber from 'bignumber.js';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import {
  RetrieveBtcError,
  RetrieveBtcOk,
  RetrieveBtcStatus,
  UpdateBalanceError,
  UtxoStatus
} from '@/ic/ckbtcMinter/model';
import { ckBTCMinterService } from '@/ic/ckbtcMinter/ckBTCMinterService';
import { questsService } from '@/ic/quests/questsService';
import {
  CK_BTC_CANISTER_ID,
  CK_BTC_MINTER_CANISTER_ID,
  CK_ETH_LEDGER_CANISTER_ID,
  CK_ETH_MINTER_CANISTER_ID,
  etherScanKey,
  ETHHttps,
  ETHHttpsMainnet,
  ETHWebsocketProvider,
  IC_BTC_CANISTER_ID,
  IC_BTC_MINTER_CANISTER_ID,
  IC_ETH_MINTER_CANISTER_ID,
  LEDGER_CANISTER_ID
} from '@/ic/utils';
import { checkAuth } from '@/ic/CheckAuth';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { IcrcTransferError } from '@/ic/DRC20Token/model';
import { ckETHMinterService } from '@/ic/ckETHMinter/ckETHMinterService';
import {
  Burn,
  ckETHEvent,
  IcTokenInfo,
  MinterInfo,
  PendingDepositTxn,
  ResultError,
  RetrieveEthRequest,
  RetrieveEthStatus,
  TxIndex,
  TxStatus,
  WithdrawalError
} from '@/ic/ckETHMinter/model';
import { getTokenInfo } from '@/ic/getTokenInfo';
import MetaMaskOnboarding from '@metamask/onboarding';
import abi from '@/ic/abi/erc20';
import ethAbi from '@/ic/abi/eth';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { getTokenLogo } from '@/ic/getTokenLogo';
import { ckETHMinterDfiService } from '@/ic/ckETHMinter/ckETHMinterDfiService';
import { principalToBytes32 } from '@/ic/principal_to_bytes';
import ApproveIcrc2 from '@/components/approveIcrc2/Index.vue';

const { Web3 } = require('web3');

let ethereum = (window as any).ethereum;
if (ethereum && ethereum.providers) {
  ethereum = ethereum.providers.find((provider) => provider.isMetaMask);
}
let ETHUpdateTime = null;
let ETHDepositTime = null;
const ethVersion = '0.1';
let timer: number;

@Component({
  name: 'Ledger',
  components: {
    ReceiveModal,
    TransferIcp,
    TopUp,
    TransferToken,
    ApproveIcrc2
  },
  filters: {
    filterTime(val: number): string {
      if (val) {
        return formatDateToSecondUTC(new Date(val * 1000));
      }
      return '';
    }
  }
})
export default class extends Mixins(BalanceMixin) {
  $refs!: {
    receiveModal;
    transferIcp: HTMLFormElement;
    topUp: HTMLFormElement;
    approveIcrc2: HTMLFormElement;
  };
  @Prop()
  public principal!: string;
  @Prop()
  public type!: string;
  private ckETHMinterDfiService: ckETHMinterDfiService;
  private DRC20TokenService: DRC20TokenService;
  private BTCTypeEnum = BTCTypeEnum;
  private BTCType: BTCTypeEnum = null;
  private forgeTitle = 'Mint';
  private dissolveTitle = 'Retrieve';
  private updateBlockHeight = 0;
  private updateCkBlockHeight = 0;
  private dissolveBalance = '';
  private canRetrieve = false;
  private ICLighthouseService: ICLighthouseService = null;
  private ckBTCMinterService: ckBTCMinterService = null;
  private questsService: questsService = null;
  private ckBTCBalance = '';
  private icBTCBalance = '';
  private ckBTCFee = 0.0000001;
  private icBTCFee = 0.0000002;
  private btcTxTimer = null;
  private btcTimer = null;
  private balanceTimer = null;
  private updateRetrieveBtcStatusTimer = null;
  private updateRetrieveBtcSubmittedStatusTimer = null;
  private topUpType = '';
  public walletId: PrincipalString = '';
  private refreshBalanceLoading = false;
  private refreshIcBTCBalanceLoading = false;
  private refreshCkBTCBalanceLoading = false;
  private currentToken: AddTokenItem = new AddTokenItemClass();
  private forgeModal = false;
  private dissolveModal = false;
  private BTCAddressCk = '';
  private BTCAddressIc = '';
  private withdrawalAccount: Icrc1Account = null;
  private btcRetrieveFee: bigint = null;
  private accountCode = '';
  private icAccountCode = '';
  private blockCount = 0;
  private showBTCTransactions = false;
  private BTCTransactions = [];
  private BTCBalanceCk = '';
  private BTCBalanceIC = '';
  private hasConfirmedLoading = false;
  private BTCTransactionTotal = 0;
  private BTCTransactionsPage = 1;
  private BTCTransactionsPageSize = 5;
  private showCkBTCTransactions = false;
  private ckBTCTransactions = [];
  private hasCkConfirmedLoading = false;
  private ckBTCTransactionTotal = 0;
  private ckBTCTransactionsPage = 1;
  private ckBTCTransactionsPageSize = 5;
  private retrieveBtcStatusPageSize = 6;
  private retrieveBtcStatusPage = 1;
  private currentTxTimeCkETH: { [key: string]: number } = {};
  private currentTxTimeCkBTC = null;
  private currentTxTimeIcBTC = null;
  private refreshCkETHBalanceLoading = false;
  private ERC20Balance: { [key: string]: string } = {};
  private ERC20EthereumBalance: { [key: string]: string } = {};
  private ethereumIsConnected = false;
  private forgeTitleETH = 'Mint';
  private dissolveTitleETH = 'Retrieve';
  private retrieveTitleETH = 'Retrieve';
  private retrieveModalCKETH = false;
  private forgeModalCKETH = false;
  private ckETHRetrieve: Array<{
    recipient: string;
    amount: string;
    blockIndex: string;
    status: RetrieveEthStatus;
  }> = [];
  private ckETHMint: Array<{
    txHash: string;
    blockNum: string;
    amount: string;
  }> = [];
  private ckETHMintPage = 1;
  private lastScrapedBlockNumber: number = null;
  private ckETHTimer = null;
  private forgeModalETH = false;
  private dissolveModalETH = false;
  private forgeModalTransactions = false;
  private forgeModalBTCTransactions = false;
  private mintStep = 1;
  private retrieveStep = 1;
  private ETHAddressCk = '';
  private ckETHAccountCode = '';
  private depositNotifyLoading = false;
  private ckETHMinterService: ckETHMinterService = null;
  private showCkETHTransactions = false;
  private updateCkETHBlockHeight: { [key: string]: number } = {};
  private blockCountETH = 0;
  private ckETHBlockNum = 0;
  private ckETHTransactions: { [key: string]: [] } = {};
  private hasCkETHConfirmedLoading = false;
  private ckETHTransactionTotal = 0;
  private ckETHTransactionsPage = 1;
  private ckETHTransactionsPageSize = 5;
  private retrieveETHStatusPageSize = 6;
  private retrieveETHStatusPage = 1;
  private updateDepositETHStatusTimer = null;
  private updateRetrieveETHStatusTimer = null;
  private dissolveBalanceETH = '';
  private canRetrieveETH = false;
  private ckETHWithdrawalAccount: Icrc1Account = null;
  private showRetrieveETHStatus = false;
  private retrieveETHStatus: Array<[TxIndex, TxStatus, Time]> = [];
  private ckETHDepositBalance = '0';
  private networkIds = networkIds;
  private networkList = networkList;
  private networkListFrom = networkList;
  private networkListTo = networkList;
  private networkTokens = networkTokens;
  private networkTokensFrom = networkTokens;
  private networkTokensTo = networkTokens;
  private networkIdMint: number | Array<any> = [];
  private networkIdMintTo: number | Array<any> = [];
  private networkTokenIdMint: number | Array<any> = [];
  private networkTokenIdMintTo: number | Array<any> = [];
  private ckTokenInfo: { [key: string]: IcTokenInfo } = {};
  private ethersTokenIdToCkTokenId: { [key: string]: string } = {};
  private tokens: { [key: string]: TokenInfo } = {};
  private metaMaskVisible = false;
  private depositing: Array<TxStatus> = [];
  // [txHash, hasClaim?, claimSuccess?]
  private depositInfo: Array<[string, boolean?, boolean?, number?]> = [];
  private depositingInfo: PendingDepositTxn = null;
  private minterInfo: MinterInfo = null;
  private ethTokenInfo: IcTokenInfo = null;
  private retrieveEvent: Array<[ckETHEvent]> = [];
  private retrieveEventPageSize = 5;
  private retrieveEventPage = 1;
  private mintEvent: Array<[ckETHEvent]> = [];
  private mintEventPageSize = 5;
  private mintEventPage = 1;
  private depositMethod = 2;
  private txReceiptTimer = null;
  private claimTxError = '';
  private pendingLoading = false;
  private claimModalTransactions = false;
  private activePending: Active = {};
  private activePendingModal = false;
  private depositInfoPage = 1;
  private depositInfoPageSize = 5;
  private otherNetworkTokens: ICNetworkTokensInterface = null;
  private smartContractAddress = '';
  private ethLink = 'https://etherscan.io';
  private etherscanLink = 'https://api.etherscan.io';
  private ckEthLink = 'https://etherscan.io';
  private signatureForm = {
    txHash: ''
  };
  private signatureFormRules = {
    txHash: [
      {
        required: true,
        message: 'Please enter txHash',
        trigger: 'change'
      }
    ]
  };
  private erc20Form = {
    amount: ''
  };
  private erc20FormRules = {
    amount: [
      {
        required: true,
        message: 'Please enter Amount',
        trigger: 'change'
      },
      { validator: this.validateErc20Amount, trigger: 'change' }
    ]
  };
  private showEthAddressCode = false;
  private dissolveForm = {
    amount: ''
  };
  private retrieveForm = {
    address: ''
  };
  private retrieveFormRules = {
    address: [
      {
        required: true,
        message: 'Please enter BTC address',
        trigger: 'change'
      },
      { validator: this.validateIcBTCAddress, trigger: 'change' }
    ]
  };
  private dissolveFormRules = {
    amount: [
      {
        required: true,
        message: 'Please enter Amount',
        trigger: 'change'
      },
      { validator: this.validateAmount, trigger: 'change' }
    ]
  };
  private ethDissolveFormCK = {
    retrieveAmount: '',
    address: ''
  };
  private ethDissolveFormCKRules = {
    retrieveAmount: [
      {
        required: true,
        message: 'Please enter Amount',
        trigger: 'change'
      },
      { validator: this.validateAmountCKETH, trigger: 'change' }
    ],
    address: [
      {
        required: true,
        message: 'Please enter address',
        trigger: 'change'
      }
    ]
  };
  private ethDissolveForm = {
    retrieveAmount: ''
  };
  private ethRetrieveForm = {
    address: ''
  };
  private ethRetrieveFormRules = {
    address: [
      {
        required: true,
        message: 'Please enter address',
        trigger: 'change'
      }
    ]
  };
  private ethDissolveFormRules = {
    retrieveAmount: [
      {
        required: true,
        message: 'Please enter Amount',
        trigger: 'change'
      },
      { validator: this.validateAmountETH, trigger: 'change' }
    ]
  };
  private retrieveBtcStatus: Array<{
    blockIndex: string;
    status: RetrieveBtcStatus;
    time: string;
    BTCBlock?: number;
  }> = [];
  get depositDisabled(): boolean {
    if (this.depositing && this.depositing.length) {
      return true;
    }
    if (
      this.icNetworkTokens &&
      this.icNetworkTokens.icTokenInfo &&
      this.ethTokenInfo &&
      this.minterInfo &&
      this.ckETHDepositBalance
    ) {
      const erc20TokenInfo = this.icNetworkTokens.icTokenInfo;
      const minAmount = new BigNumber(erc20TokenInfo.minAmount.toString(10))
        .div(10 ** erc20TokenInfo.decimals)
        .toString(10);
      if (erc20TokenInfo.fee) {
        const std = Object.keys(erc20TokenInfo.std)[0];
        if (std === 'ERC20') {
          const fee = new BigNumber(erc20TokenInfo.fee.gasLimit.toString(10))
            .plus(this.ethTokenInfo.fee.gasLimit.toString(10))
            .times(this.minterInfo.gasPrice.toString(10))
            .plus(erc20TokenInfo.fee.fixedFee.toString(10))
            .times(erc20TokenInfo.fee.ethRatio.toString(10))
            .div(1000000000)
            .div(10 ** erc20TokenInfo.decimals)
            .decimalPlaces(erc20TokenInfo.decimals)
            .toString(10);
          console.log(minAmount, fee, this.ckETHDepositBalance);
          return new BigNumber(minAmount)
            .plus(fee)
            .gt(this.ckETHDepositBalance);
        }
      } else {
        return new BigNumber(minAmount).gt(this.ckETHDepositBalance);
      }
    }
    return false;
  }
  get changeMethodDisabled(): boolean {
    if (!this.mintDisabled) {
      const networkIdFrom =
        this.networkTokensFrom[this.networkTokenIdMint as number].networkId;
      const networkIdTo =
        this.networkTokensTo[this.networkTokenIdMintTo as number].networkId;
      console.log(this.networkTokensFrom[this.networkTokenIdMint as number]);
      console.log(this.networkTokensTo[this.networkTokenIdMintTo as number]);
      return !(
        (networkIdFrom === '1' || networkIdFrom === '2') &&
        networkIdTo === '-1' &&
        this.networkTokensTo[this.networkTokenIdMintTo as number].icTokenInfo &&
        this.networkTokensTo[this.networkTokenIdMintTo as number].icTokenInfo
          .dexPair
      );
    }
    return true;
  }
  get mintDisabled(): boolean {
    return !(
      typeof this.networkIdMint === 'number' &&
      typeof this.networkIdMintTo === 'number' &&
      typeof this.networkTokenIdMint === 'number' &&
      typeof this.networkTokenIdMintTo === 'number'
    );
  }
  get availableBalance(): string {
    if (this.dissolveBalance) {
      let fee = 0;
      // if (this.BTCType === BTCTypeEnum.icBTC) {
      //   fee = new BigNumber(this.icBTCFee).times(10 ** 8).toString(10);
      // } else {
      //   fee = new BigNumber(this.ckBTCFee).times(10 ** 8).toString(10);
      // }
      return new BigNumber(this.dissolveBalance).minus(fee).toString(10);
    }
    return '';
  }
  get icNetworkTokens(): ICNetworkTokensInterface {
    if (
      typeof this.networkIdMint === 'number' &&
      typeof this.networkIdMintTo === 'number' &&
      typeof this.networkTokenIdMint === 'number' &&
      typeof this.networkTokenIdMintTo === 'number'
    ) {
      // todo networkToIcId
      const networkToIcId = ['1', '2', '3'];
      if (
        this.networkTokensTo[this.networkTokenIdMintTo].networkId === '-1' &&
        networkToIcId.includes(
          this.networkTokensTo[this.networkTokenIdMintTo].networkToIcId
        )
      ) {
        this.otherNetworkTokens =
          this.networkTokensFrom[this.networkTokenIdMint];
        return this.networkTokensTo[this.networkTokenIdMintTo];
      }
      if (
        this.networkTokensFrom[this.networkTokenIdMint].networkId === '-1' &&
        networkToIcId.includes(
          this.networkTokensFrom[this.networkTokenIdMint].networkToIcId
        )
      ) {
        this.otherNetworkTokens =
          this.networkTokensTo[this.networkTokenIdMintTo];
        return this.networkTokensFrom[this.networkTokenIdMint];
      }
    }
    this.otherNetworkTokens = null;
    return null;
  }
  beforeDestroy(): void {
    this.clearTime();
    window.clearInterval(this.btcTimer);
    this.btcTimer = null;
    window.clearInterval(this.updateRetrieveBtcStatusTimer);
    this.updateRetrieveBtcStatusTimer = null;
    window.clearInterval(this.updateRetrieveETHStatusTimer);
    this.updateRetrieveETHStatusTimer = null;
    window.clearInterval(this.updateRetrieveBtcSubmittedStatusTimer);
    this.updateRetrieveBtcSubmittedStatusTimer = null;
    window.clearInterval(this.btcTxTimer);
    this.btcTxTimer = null;
    window.clearInterval(this.updateDepositETHStatusTimer);
    this.updateDepositETHStatusTimer = null;
    window.clearInterval(this.ckETHTimer);
    this.ckETHTimer = null;
  }
  created(): void {
    this.DRC20TokenService = new DRC20TokenService();
    this.ckBTCMinterService = new ckBTCMinterService();
    this.ICLighthouseService = new ICLighthouseService();
    this.questsService = new questsService();
    this.ckETHMinterService = new ckETHMinterService();
    this.ckETHMinterDfiService = new ckETHMinterDfiService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (this.type === 'cross') {
      this.getMinterInfo().then(() => {
        this.getCkTokens();
        if (this.minterInfo.depositMethod === 1) {
          this.depositMethod = 1;
        } else {
          this.depositMethod = 2;
        }
      });
    }
  }
  private changeDepositMethod(depositMethod: number): void {
    if (this.changeMethodDisabled) {
      return;
    }
    if (
      this.minterInfo &&
      this.minterInfo.depositMethod === 2 &&
      depositMethod === 1
    ) {
      return;
    }
    if (
      this.minterInfo &&
      this.minterInfo.depositMethod === 1 &&
      depositMethod === 2
    ) {
      return;
    }
    this.depositMethod = depositMethod;
  }
  private accountToAddress(account: Icrc1Account): string {
    if (account.subaccount[0]) {
      return principalToAccountIdentifier(
        account.owner,
        new Uint8Array(account.subaccount[0])
      );
    } else {
      return principalToAccountIdentifier(account.owner);
    }
  }
  private async getAccountEvents(): Promise<void> {
    const res = await this.ckETHMinterService.getAccountEvents(
      hexToBytes(
        principalToAccountIdentifier(Principal.fromText(this.getPrincipalId))
      )
    );
    console.log(res);
    if (this.forgeModalETH) {
      this.filterMint(res);
    }
    if (this.dissolveModalETH) {
      this.filterBurn(res);
    }
  }
  private filterMint(val: Array<[ckETHEvent, Time]>): void {
    let mintRes: Array<[ckETHEvent]> = [];
    let mintItem: [ckETHEvent];
    if (this.depositMethod === 1) {
      for (let i = val.length - 1; i >= 0; i--) {
        const item = val[i];
        const type = Object.keys(item[0])[0];
        const event: any = Object.values(item[0])[0];
        if (type === 'deposit' && event.token === this.icNetworkTokens.id) {
          mintItem = [item[0]];
        } else if (type === 'depositResult') {
          const depositResult: any = Object.values(event)[0];
          if (depositResult.token === this.icNetworkTokens.id) {
            if (mintItem && mintItem.length) {
              mintItem.push(item[0]);
            }
          }
        } else if (
          type === 'mint' &&
          event.icTokenCanisterId.toString() === this.icNetworkTokens.tokenId
        ) {
          if (mintItem && mintItem.length) {
            mintItem.push(item[0]);
            mintRes.unshift(mintItem);
          }
          mintItem = null;
        }
      }
      this.mintEvent = mintRes;
      console.log(mintRes);
    }
    if (this.depositMethod === 2) {
      for (let i = val.length - 1; i >= 0; i--) {
        const item = val[i];
        const type = Object.keys(item[0])[0];
        const event: any = Object.values(item[0])[0];
        // if (
        //   type === 'claimDeposit' &&
        //   event.token === this.icNetworkTokens.id
        // ) {
        //   mintItem = [item[0]];
        // } else
        if (type === 'claimDepositResult') {
          const claimResult = Object.keys(event)[0];
          if (claimResult === 'ok') {
            const result: any = Object.values(event)[0];
            if (result.token === this.icNetworkTokens.id) {
              mintItem = [item[0]];
              // if (mintItem && mintItem.length) {
              //   mintItem.push(item[0]);
              // }
            }
          }
        } else if (
          type === 'mint' &&
          event.icTokenCanisterId.toString() === this.icNetworkTokens.tokenId
        ) {
          if (mintItem && mintItem.length) {
            mintItem.push(null);
            mintItem.push(item[0]);
            mintRes.unshift(mintItem);
          }
          mintItem = null;
        }
      }
      this.mintEvent = mintRes;
      console.log(mintRes);
    }
  }
  private filterBurn(val: Array<[ckETHEvent, Time]>): void {
    let burnRes: Array<[ckETHEvent]> = [];
    let burnItem: [ckETHEvent];
    for (let i = val.length - 1; i >= 0; i--) {
      const item = val[i];
      const type = Object.keys(item[0])[0];
      const event: any = Object.values(item[0])[0];
      if (
        type === 'burn' &&
        (event as Burn).icTokenCanisterId.toString() ===
          this.icNetworkTokens.tokenId
      ) {
        burnItem = [item[0]];
      } else if (
        type === 'withdraw' &&
        event.token === this.icNetworkTokens.id
      ) {
        if (burnItem && burnItem.length) {
          burnItem.push(item[0]);
        }
      } else if (type === 'withdrawResult') {
        const withdrawResult: any = Object.values(event)[0];
        if (withdrawResult.token === this.icNetworkTokens.id) {
          if (burnItem && burnItem.length) {
            burnItem.push(item[0]);
            burnRes.unshift(burnItem);
          }
        }
        burnItem = null;
      }
    }
    this.retrieveEvent = burnRes;
    console.log(burnRes);
  }
  private async getMinterInfo(): Promise<void> {
    this.minterInfo = await this.ckETHMinterService.getMinterInfo();
    if (Number(this.minterInfo.chainId) === 5) {
      this.ethLink = 'https://goerli.etherscan.io';
      this.etherscanLink = 'https://api-goerli.etherscan.io';
    }
  }
  private async getCkTokensDfi(): Promise<void> {
    this.smartContractAddress = await this.getMinterAddress();
    if (!this.tokens[CK_ETH_LEDGER_CANISTER_ID]) {
      const res = await getTokenInfo(
        Principal.fromText(CK_ETH_LEDGER_CANISTER_ID),
        {
          icrc1: null
        }
      );
      this.$set(this.tokens, CK_ETH_LEDGER_CANISTER_ID, res);
    } else {
      if (!this.tokens[CK_ETH_LEDGER_CANISTER_ID].logo) {
        const logo = await getTokenLogo(
          Principal.fromText(CK_ETH_LEDGER_CANISTER_ID),
          {
            icrc1: null
          }
        );
        this.$set(
          this.tokens,
          CK_ETH_LEDGER_CANISTER_ID,
          Object.assign(this.tokens[CK_ETH_LEDGER_CANISTER_ID], {
            logo: logo
          })
        );
      }
    }
    // ckETH
    const icTokenInfo = {
      ckLedgerId: Principal.fromText(CK_ETH_LEDGER_CANISTER_ID),
      ckSymbol: this.tokens[CK_ETH_LEDGER_CANISTER_ID].symbol,
      decimals: this.tokens[CK_ETH_LEDGER_CANISTER_ID].decimals,
      dexPair: null,
      dexPrice: null,
      fee: null,
      minAmount: BigInt('30000000000000000'),
      std: { ETH: null },
      symbol: 'ETH',
      // tokenId: this.smartContractAddress,
      tokenId: '0x0000000000000000000000000000000000000000',
      totalSupply: null
    };
    this.networkTokens.unshift({
      // id: this.smartContractAddress,
      id: '0x0000000000000000000000000000000000000000',
      networkId: '-1',
      networkToIcId: '1',
      symbol: this.tokens[CK_ETH_LEDGER_CANISTER_ID].symbol,
      tokenId: CK_ETH_LEDGER_CANISTER_ID,
      icTokenInfo: icTokenInfo
    });
    this.networkTokens.unshift({
      // id: this.smartContractAddress,
      id: '0x0000000000000000000000000000000000000000',
      networkId: '1',
      networkToIcId: '-1',
      symbol: 'ETH',
      tokenId: CK_ETH_LEDGER_CANISTER_ID,
      logo: require('@/assets/img/ethereum.svg')
    });
    this.ethersTokenIdToCkTokenId[this.smartContractAddress] =
      CK_ETH_LEDGER_CANISTER_ID;
    this.ckTokenInfo[CK_ETH_LEDGER_CANISTER_ID] = Object.assign(
      {},
      icTokenInfo,
      { symbol: 'ETH' }
    );
  }
  private async getCkTokens(): Promise<void> {
    let res = await this.ckETHMinterService.getCkTokens();
    console.log(res);
    if (res.length) {
      this.networkTokensFrom =
        this.networkTokensTo =
        this.networkTokens =
          JSON.parse(JSON.stringify(networkTokens));
      console.log(this.networkTokens);
      await this.getCkTokensDfi();
      res = res.sort((a, b) => b[1].symbol.localeCompare(a[1].symbol));
      res.forEach((item) => {
        if (!this.tokens[item[1].ckLedgerId.toString()]) {
          getTokenInfo(item[1].ckLedgerId, { icrc1: null }).then((res) => {
            this.$set(this.tokens, item[1].ckLedgerId.toString(), res);
          });
        } else {
          if (!this.tokens[item[1].ckLedgerId.toString()].logo) {
            getTokenLogo(item[1].ckLedgerId, { icrc1: null }).then((logo) => {
              this.$set(
                this.tokens,
                item[1].ckLedgerId.toString(),
                Object.assign(this.tokens[item[1].ckLedgerId.toString()], {
                  logo: logo
                })
              );
            });
          }
        }
        if (item[0] === '0x0000000000000000000000000000000000000000') {
          this.ethTokenInfo = item[1];
        }
        this.ethersTokenIdToCkTokenId[item[1].tokenId] =
          item[1].ckLedgerId.toString();
        if (Number(this.minterInfo.chainId) === 5) {
          this.networkTokens.unshift({
            id: item[0],
            networkId: '2',
            networkToIcId: '-1',
            tokenId: item[1].ckLedgerId.toString(),
            symbol: item[1].symbol
          });
          this.ckTokenInfo[item[1].ckLedgerId.toString()] = Object.assign(
            {},
            item[1],
            { symbol: `${item[1].symbol} (${this.networkIds['2']})` }
          );
        } else {
          this.networkTokens.unshift({
            id: item[0],
            networkId: '1',
            networkToIcId: '-1',
            tokenId: item[1].ckLedgerId.toString(),
            symbol: item[1].symbol
          });
          this.ckTokenInfo[item[1].ckLedgerId.toString()] = Object.assign(
            {},
            item[1],
            { symbol: `${item[1].symbol} (${this.networkIds['1']})` }
          );
        }
        const ckSymbol = item[1].ckSymbol.replace('ck', 'ic');
        this.networkTokens.unshift({
          id: item[0],
          networkId: '-1',
          networkToIcId: Number(this.minterInfo.chainId) === 5 ? '2' : '1',
          symbol: ckSymbol,
          tokenId: item[1].ckLedgerId.toString(),
          icTokenInfo: item[1]
        });
      });
    }
    this.getActive();
    this.initICRouter();
    console.log(this.networkTokens);
  }
  private async getMinterAddress(): Promise<string> {
    return await this.ckETHMinterDfiService.smart_contract_address();
  }
  private initICRouter(): void {
    const type = this.$route.query.type;
    const tokenId = this.$route.query.token;
    if (typeof tokenId === 'string') {
      if (type === 'mint') {
        this.toActive('dexMint', tokenId);
      } else if (type === 'retrieve') {
        this.toActive('dexRetrieve', tokenId);
      }
    }
  }
  private toActive(type: ActiveType, tokenId: string, txHash?: string): void {
    if (
      type === 'claim' ||
      type === 'claim2' ||
      type === 'mint' ||
      type === 'deposit' ||
      type === 'dexMint' ||
      type === 'mintCKETH'
    ) {
      let network;
      // todo networkIdMint
      if (type === 'mintCKETH') {
        this.networkIdMint = 2;
      } else if (Number(this.minterInfo.chainId) === 5) {
        this.networkIdMint = 3;
      } else if (Number(this.minterInfo.chainId) === 1) {
        this.networkIdMint = 3;
      } else {
        //
      }
      console.log(this.networkIdMint);
      network = this.networkListFrom[this.networkIdMint as number];
      this.changeNetworkIdMint(this.networkIdMint as number);
      console.log(this.networkTokensFrom);
      this.networkTokensFrom.some((item, index) => {
        if (item.tokenId === tokenId && network.id === item.networkId) {
          this.networkTokenIdMint = index;
          this.changeNetworkTokenIdMint(index);
          return true;
        }
      });
      this.networkIdMintTo = 0;
      this.changeNetworkIdMintTo(this.networkIdMintTo);
      this.networkTokensTo.some((item, index) => {
        if (item.tokenId === tokenId && network.id === item.networkToIcId) {
          this.networkTokenIdMintTo = index;
          this.changeNetworkTokenIdMintTo(index);
          return true;
        }
      });
      if (type === 'claim' || type === 'claim2' || type === 'dexMint') {
        this.depositMethod = 2;
      }
      if (type === 'mint' || type === 'deposit') {
        this.depositMethod = 1;
      }
      if (type === 'dexMint') {
        this.mintStep = 1;
      } else {
        this.onContinue();
        this.mintStep = 2;
      }
      if (type === 'claim') {
        this.signatureForm.txHash = txHash;
        this.txHashChange();
      }
    } else if (
      type === 'retrieve' ||
      type === 'dexRetrieve' ||
      type === 'retrieveCKETH'
    ) {
      let network;
      if (type === 'retrieveCKETH') {
        this.networkIdMint = 0;
      } else if (Number(this.minterInfo.chainId) === 5) {
        this.networkIdMint = 0;
      } else {
        //
      }
      network = this.networkListFrom[this.networkIdMint as number];
      this.changeNetworkIdMint(this.networkIdMint as number);
      console.log(this.networkTokensFrom);
      this.networkTokensFrom.some((item, index) => {
        if (item.tokenId === tokenId && network.id === item.networkId) {
          this.networkTokenIdMint = index;
          this.changeNetworkTokenIdMint(index);
          return true;
        }
      });
      // todo
      this.networkIdMintTo = 0;
      this.changeNetworkIdMintTo(this.networkIdMintTo);
      this.networkTokensTo.some((item, index) => {
        if (item.tokenId === tokenId && network.id === item.networkToIcId) {
          this.networkTokenIdMintTo = index;
          this.changeNetworkTokenIdMintTo(index);
          return true;
        }
      });
      if (type === 'dexRetrieve') {
        this.retrieveStep = 1;
      } else {
        this.onContinue();
        this.retrieveStep = 2;
      }
    }
    this.activePendingModal = false;
  }
  private onGetClaimPending(): void {
    const hasClaimPending = this.getClaimPending();
    if (hasClaimPending && hasClaimPending.length) {
      console.log(hasClaimPending);
      this.$set(this.activePending, 'claim', hasClaimPending);
    } else {
      this.$set(this.activePending, 'claim', null);
    }
  }
  private onGetClaim2Pending(): void {
    const hasClaim2Pending = this.getClaimPending(false);
    if (hasClaim2Pending && hasClaim2Pending.length) {
      console.log(hasClaim2Pending);
      this.$set(this.activePending, 'claim2', hasClaim2Pending);
    } else {
      this.$set(this.activePending, 'claim2', null);
    }
  }
  private onGetMintPending(): void {
    this.getMintPending().then((mintPending) => {
      if (mintPending && mintPending.length) {
        console.log(mintPending);
        this.$set(this.activePending, 'mint', mintPending);
      } else {
        this.$set(this.activePending, 'mint', null);
      }
    });
  }
  private onGetDepositing(): void {
    this.ckETHMinterService.getDepositing({ all: null }).then((res) => {
      if (res && res[0] && res[0][2] && res[0][2].length) {
        console.log(res);
        this.$set(this.activePending, 'deposit', res[0]);
      } else {
        this.$set(this.activePending, 'deposit', null);
      }
    });
  }
  private onGetRetrievePending(): void {
    this.getRetrievePending().then((retrievePending) => {
      if (retrievePending && retrievePending.length) {
        console.log(retrievePending);
        this.$set(this.activePending, 'retrieve', retrievePending);
      } else {
        this.$set(this.activePending, 'retrieve', null);
      }
    });
  }
  private onGetRetrieving(): void {
    this.ckETHMinterService.getRetrieving({ all: null }).then((res) => {
      if (res && res.length) {
        console.log(res);
        this.$set(this.activePending, 'retrieve2', res[0]);
      } else {
        this.$set(this.activePending, 'retrieve2', null);
      }
    });
  }
  private async getActive(): Promise<void> {
    if (this.getPrincipalId) {
      // method2 claim step1
      this.onGetClaimPending();
      // method2 claim step2
      this.onGetClaim2Pending();
      // method1 mint step1
      this.onGetMintPending();
      // method1 mint step2
      this.onGetDepositing();
      // retrieve step1
      this.onGetRetrievePending();
      // retrieve step2
      this.onGetRetrieving();
      // ckETH mint
      this.onGetMintCKETHPending();
      // ckETH retrieve
      this.onGetRetrieveCKETHPending();
      console.log(this.activePending);
    }
  }
  private onGetRetrieveCKETHPending(): void {
    this.getRetrieveCKETHPending().then((retrieveActive) => {
      if (retrieveActive && retrieveActive.length) {
        console.log(retrieveActive);
        this.$set(this.activePending, 'retrieveCKETH', retrieveActive);
      } else {
        this.$set(this.activePending, 'retrieveCKETH', null);
      }
    });
  }
  private async getRetrieveCKETHPending(): Promise<Array<RetrieveActive>> {
    let retrievePending: Array<RetrieveActive> = [];
    const currentInfo =
      JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
    // const smartContractAddress = await this.getMinterAddress();
    const key = 'ckETHRetrieve-' + '0x0000000000000000000000000000000000000000';
    const retrieveCKETH = currentInfo[key] || {};
    console.log(retrieveCKETH);
    for (let key in retrieveCKETH) {
      if (retrieveCKETH[key]) {
        for (let i = 0; i < retrieveCKETH[key].length; i++) {
          const type = Object.keys(retrieveCKETH[key][i].status)[0];
          if (type !== 'TxFinalized' && type !== 'NotFound') {
            retrievePending.push({
              amount: retrieveCKETH[key][i].amount,
              tokenId: key
            });
          } else {
            break;
          }
        }
      }
    }
    return retrievePending;
  }
  private onGetMintCKETHPending(): void {
    this.getMintCKETHPending().then((mintPending) => {
      if (mintPending && mintPending.length) {
        console.log(mintPending);
        this.$set(this.activePending, 'mintCKETH', mintPending);
      } else {
        this.$set(this.activePending, 'mintCKETH', null);
      }
    });
  }
  private async getMintCKETHPending(): Promise<Array<ClaimCKETHActive>> {
    let mintPending: Array<ClaimCKETHActive> = [];
    const currentInfo =
      JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
    // const smartContractAddress = await this.getMinterAddress();
    const key = 'ckETHMint-' + '0x0000000000000000000000000000000000000000';
    const mintCKETH = currentInfo[key] || {};
    console.log(mintCKETH);
    if (mintCKETH) {
      await this.getLastScrapedBlockNumber();
      if (this.lastScrapedBlockNumber) {
        for (let key in mintCKETH) {
          if (mintCKETH[key]) {
            for (let i = 0; i < mintCKETH[key].length; i++) {
              if (
                !mintCKETH[key][i].blockNum ||
                new BigNumber(this.lastScrapedBlockNumber).lt(
                  mintCKETH[key][i].blockNum
                )
              ) {
                mintPending.push({
                  txHash: mintCKETH[key][i].txHash,
                  amount: mintCKETH[key][i].amount,
                  tokenId: key
                });
              } else {
                break;
              }
            }
          }
        }
      }
    }
    return mintPending;
  }
  private async getRetrievePending(): Promise<Array<RetrieveActive>> {
    let retrievePending: Array<RetrieveActive> = [];
    try {
      const principal = localStorage.getItem('principal');
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      const key = IC_ETH_MINTER_CANISTER_ID + ethVersion;
      if (
        currentInfo.ckETHRetrievePending &&
        currentInfo.ckETHRetrievePending[key]
      ) {
        for (let tokenId in currentInfo.ckETHRetrievePending[key]) {
          const pending = {
            tokenId: tokenId,
            amount: currentInfo.ckETHRetrievePending[key][tokenId]
          };
          retrievePending.push(pending);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return retrievePending;
  }
  private async getMintPending(): Promise<Array<MintActive>> {
    let mintPending: Array<MintActive> = [];
    try {
      const principal = localStorage.getItem('principal');
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      const key = IC_ETH_MINTER_CANISTER_ID + ethVersion;
      if (currentInfo.ckETHMintPending && currentInfo.ckETHMintPending[key]) {
        let promiseValue = [];
        const MAX_COCURRENCY = 10;
        let pending = [];
        this.ETHAddress('1.0');
        await this.getETHAddress('1.0');
        for (let i = 0; i < currentInfo.ckETHMintPending[key].length; i++) {
          const val = currentInfo.ckETHMintPending[key][i].split('&');
          const tokenId = val[0];
          const ethersTokenId = val[1];
          const std = Object.keys(this.ckTokenInfo[tokenId].std)[0];
          console.log(tokenId, ethersTokenId, std);
          promiseValue.push(
            this.getEthereumTokenBalance(ethersTokenId, tokenId, std)
          );
          if (promiseValue.length === MAX_COCURRENCY) {
            const res = await Promise.all(promiseValue);
            pending = pending.concat(res);
            promiseValue = [];
          }
          if (
            i === currentInfo.ckETHMintPending[key].length - 1 &&
            promiseValue.length
          ) {
            const res = await Promise.all(promiseValue);
            pending = pending.concat(res);
            promiseValue = [];
          }
        }
        console.log(pending);
        pending.forEach((item) => {
          let fixedFee = '0';
          const std = Object.keys(this.ckTokenInfo[item.tokenId].std)[0];
          if (std === 'ERC20') {
            fixedFee = new BigNumber(
              this.ckTokenInfo[item.tokenId].fee.fixedFee.toString(10)
            )
              .times(this.ckTokenInfo[item.tokenId].fee.ethRatio.toString(10))
              .div(1000000000)
              .toString(10);
          }
          console.log(fixedFee);
          console.log(item.balance);
          if (
            new BigNumber(item.balance)
              .minus(this.ckTokenInfo[item.tokenId].minAmount.toString(10))
              .gte(fixedFee)
          ) {
            mintPending.push({ amount: item.balance, tokenId: item.tokenId });
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
    return mintPending;
  }
  private async getEthereumTokenBalance(
    ethersTokenId: string,
    tokenId: string,
    std: string
  ): Promise<{ balance: string; tokenId: string }> {
    const balance = await this.getEthTokenBalance(
      std,
      ethersTokenId,
      this.ETHAddressCk
    );
    return { balance: balance, tokenId: tokenId };
  }
  private getClaimPending(isStep1 = true): Array<ClaimActive> {
    try {
      const principal = localStorage.getItem('principal');
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      let hasClaimPending: Array<ClaimActive> = [];
      if (currentInfo.depositInfo) {
        const keyStart = IC_ETH_MINTER_CANISTER_ID + ethVersion;
        let keys = Object.keys(currentInfo.depositInfo);
        keys = keys.filter((item) => {
          return item.startsWith(keyStart);
        });
        console.log(keys);
        keys.forEach((key) => {
          const claimHistory = currentInfo.depositInfo[key];
          if (claimHistory && claimHistory.length) {
            claimHistory.forEach((item) => {
              if (isStep1) {
                if (!item[1]) {
                  const tokenId = key.split(keyStart)[1];
                  hasClaimPending.push({
                    tokenId: tokenId,
                    txHash: item[0]
                  });
                }
              } else {
                if (item[1] && !item[2]) {
                  const tokenId = key.split(keyStart)[1];
                  hasClaimPending.push({
                    tokenId: tokenId,
                    txHash: item[0]
                  });
                }
              }
            });
          }
        });
      }
      return hasClaimPending;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  private filterRetrieveEstimatedFee(
    erc20TokenInfo: IcTokenInfo,
    minterInfo: MinterInfo
  ): string {
    if (!erc20TokenInfo.fee) {
      return '';
    }
    const std = Object.keys(erc20TokenInfo.std)[0];
    if (std === 'ETH') {
      return new BigNumber(erc20TokenInfo.fee.gasLimit.toString(10))
        .times(minterInfo.gasPrice.toString(10))
        .plus(erc20TokenInfo.fee.fixedFee.toString(10))
        .div(10 ** erc20TokenInfo.decimals)
        .decimalPlaces(8)
        .toString(10);
    } else {
      return new BigNumber(erc20TokenInfo.fee.gasLimit.toString(10))
        .times(minterInfo.gasPrice.toString(10))
        .plus(erc20TokenInfo.fee.fixedFee.toString(10))
        .times(erc20TokenInfo.fee.ethRatio.toString(10))
        .div(1000000000)
        .div(10 ** erc20TokenInfo.decimals)
        .decimalPlaces(8)
        .toString(10);
    }
  }
  private filterEstimatedFeeMode2(erc20TokenInfo: IcTokenInfo): string {
    if (!erc20TokenInfo.fee) {
      return '';
    }
    const std = Object.keys(erc20TokenInfo.std)[0];
    if (std === 'ETH') {
      return new BigNumber(erc20TokenInfo.fee.fixedFee.toString(10))
        .div(10 ** erc20TokenInfo.decimals)
        .decimalPlaces(8)
        .toString(10);
    } else {
      return new BigNumber(erc20TokenInfo.fee.fixedFee.toString(10))
        .times(erc20TokenInfo.fee.ethRatio.toString(10))
        .div(1000000000)
        .div(10 ** erc20TokenInfo.decimals)
        .decimalPlaces(8)
        .toString(10);
    }
  }
  private filterEstimatedFee(
    erc20TokenInfo: IcTokenInfo,
    ethTokenInfo: IcTokenInfo,
    minterInfo: MinterInfo
  ): string {
    if (!erc20TokenInfo.fee) {
      return '';
    }
    const std = Object.keys(erc20TokenInfo.std)[0];
    if (std === 'ETH') {
      return new BigNumber(erc20TokenInfo.fee.gasLimit.toString(10))
        .times(minterInfo.gasPrice.toString(10))
        .plus(erc20TokenInfo.fee.fixedFee.toString(10))
        .div(10 ** erc20TokenInfo.decimals)
        .decimalPlaces(8)
        .toString(10);
    } else {
      return new BigNumber(erc20TokenInfo.fee.gasLimit.toString(10))
        .plus(ethTokenInfo.fee.gasLimit.toString(10))
        .times(minterInfo.gasPrice.toString(10))
        .plus(erc20TokenInfo.fee.fixedFee.toString(10))
        .times(erc20TokenInfo.fee.ethRatio.toString(10))
        .div(1000000000)
        .div(10 ** erc20TokenInfo.decimals)
        .decimalPlaces(8)
        .toString(10);
    }
  }
  private getBalanceInit(): void {
    if (!this.getCheckAuth) {
      if (this.BTCType === BTCTypeEnum.icBTC) {
        getTokenBalance({ icrc1: null }, IC_BTC_CANISTER_ID).then((res) => {
          this.icBTCBalance = res;
        });
        axios
          .get(`https://blockstream.info/api/address/${this.BTCAddressIc}`)
          .then((res) => {
            if (res && res.data && res.data.chain_stats) {
              console.log(res);
              this.BTCBalanceIC = new BigNumber(
                res.data.chain_stats.funded_txo_sum
              )
                .minus(res.data.chain_stats.spent_txo_sum)
                .toString(10);
            } else {
              this.BTCBalanceIC = '0';
            }
          });
      }
      if (this.BTCType === BTCTypeEnum.ckBTC) {
        getTokenBalance({ icrc1: null }, CK_BTC_CANISTER_ID).then((res) => {
          this.ckBTCBalance = res;
        });
        axios
          .get(`https://blockstream.info/api/address/${this.BTCAddressCk}`)
          .then((res) => {
            if (res && res.data && res.data.chain_stats) {
              console.log(res);
              this.BTCBalanceCk = new BigNumber(
                res.data.chain_stats.funded_txo_sum
              )
                .minus(res.data.chain_stats.spent_txo_sum)
                .toString(10);
            } else {
              this.BTCBalanceCk = '0';
            }
          });
      }
      if (!this.BTCType && this.icNetworkTokens) {
        const ERC20TokenId = this.icNetworkTokens.tokenId;
        if (ERC20TokenId) {
          getTokenBalance({ icrc1: null }, ERC20TokenId).then((res) => {
            console.log(res);
            this.$set(this.ERC20Balance, ERC20TokenId, res);
            // this.ckETHBalance = res;
          });
        }
      }
    }
  }
  private getCkBTCBalance(): void {
    window.clearInterval(this.btcTimer);
    this.btcTimer = null;
    console.log(this.BTCType);
    this.getBalanceInit();
    this.btcTimer = window.setInterval(() => {
      setTimeout(async () => {
        this.getBalanceInit();
      }, 0);
    }, 10000);
  }
  private setMaxRetrieve(): void {
    let fee;
    let total;
    if (this.BTCType === BTCTypeEnum.icBTC) {
      fee = this.icBTCFee;
      total = this.icBTCBalance;
    } else {
      fee = this.ckBTCFee;
      total = this.ckBTCBalance;
    }
    const max = new BigNumber(total).div(10 ** 8).minus(fee);
    if (max.gt(0)) {
      this.dissolveForm.amount = max.toString(10);
    }
  }
  private setMaxETHRetrieve(type: string): void {
    if (
      typeof this.networkIdMint === 'number' &&
      typeof this.networkIdMintTo === 'number' &&
      typeof this.networkTokenIdMint === 'number' &&
      typeof this.networkTokenIdMintTo === 'number'
    ) {
      // const fee = 0.0000001;
      // const total = this.ckETHBalance;
      const ERC20TokenId = this.icNetworkTokens.tokenId;
      let total;
      let fee;
      let decimals;
      if (ERC20TokenId) {
        decimals = this.tokens[ERC20TokenId].decimals;
        total = this.ERC20Balance[ERC20TokenId];
        fee = new BigNumber(this.tokens[ERC20TokenId].fee.toString(10))
          .div(10 ** decimals)
          .toString(10);
        const max = new BigNumber(total).div(10 ** 18).minus(fee);
        console.log(total, max.toString(10));
        if (max.gt(0)) {
          console.log(type);
          if (type) {
            this.ethDissolveFormCK.retrieveAmount = max.toString(10);
            (this.$refs as any).ethDissolveFormCK.validateField(
              'retrieveAmount'
            );
          } else {
            this.ethDissolveForm.retrieveAmount = max.toString(10);
            (this.$refs as any).ethForm.validateField('retrieveAmount');
          }
        }
      }
    }
  }
  private async retrieveCkETH(): Promise<void> {
    (this.$refs as any).ethDissolveFormCK.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        const canisterId = this.icNetworkTokens.tokenId;
        const amount = new BigNumber(this.ethDissolveFormCK.retrieveAmount)
          .times(10 ** this.tokens[canisterId].decimals)
          .toString(10);
        const spender: Icrc1Account = {
          owner: Principal.fromText(CK_ETH_MINTER_CANISTER_ID),
          subaccount: []
        };
        const approveRes = await this.icrc2Approve(
          canisterId,
          BigInt(amount),
          spender
        );
        if (approveRes) {
          const withdraw = await this.ckETHMinterDfiService.withdraw_eth({
            recipient: this.ethDissolveFormCK.address.trim(),
            amount: BigInt(amount)
          });
          console.log(withdraw);
          if (withdraw) {
            const type = Object.keys(withdraw)[0];
            if (type === 'Ok') {
              this.$message.success('Success');
              this.ckETHRetrieve.unshift({
                recipient: this.ethDissolveFormCK.address.trim(),
                amount: amount,
                blockIndex: (
                  withdraw as {
                    Ok: RetrieveEthRequest;
                  }
                ).Ok.block_index.toString(10),
                status: { Pending: null }
              });
              const currentInfo =
                JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
              if (!currentInfo['ckETHRetrieve-' + this.icNetworkTokens.id]) {
                currentInfo['ckETHRetrieve-' + this.icNetworkTokens.id] = {};
              }
              currentInfo['ckETHRetrieve-' + this.icNetworkTokens.id][
                canisterId
              ] = this.ckETHRetrieve;
              localStorage.setItem(
                this.getPrincipalId,
                JSON.stringify(currentInfo)
              );
              this.retrieveStep = 2;
              this.onGetRetrieveCKETHPending();
              (this.$refs as any).ethDissolveFormCK.resetFields();
            } else {
              const err = (withdraw as { Err: WithdrawalError }).Err;
              this.$message.error(
                JSON.stringify(err, (key, value) =>
                  typeof value === 'bigint' ? value.toString(10) : value
                )
              );
            }
          }
        }
        loading.close();
      }
    });
  }
  private async icrc2Approve(
    canisterId: string,
    amount: bigint,
    spender: Icrc1Account
  ): Promise<boolean> {
    const res = await this.DRC20TokenService.icrc2_approve(
      canisterId,
      spender,
      amount
    );
    if (res) {
      const type = Object.keys(res)[0];
      if (type === 'Ok') {
        return true;
      } else {
        console.log(res);
        this.$message.error('Approve Error');
        return false;
      }
    }
    return false;
  }
  private async transferCkETH(): Promise<void> {
    (this.$refs as any).ethForm.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          const amount = BigInt(
            new BigNumber(this.ethDissolveForm.retrieveAmount)
              .times(10 ** 18)
              .toString(10)
          );
          const to = this.ckETHWithdrawalAccount;
          const tokenId = this.icNetworkTokens.tokenId;
          const res = await this.DRC20TokenService.icrc1Transfer(
            tokenId,
            amount,
            to
          );
          if (
            (
              res as {
                Ok: bigint;
              }
            ).Ok
          ) {
            this.ckETHRefreshRetrieving();
            window.setTimeout(() => {
              this.setRetrievePending();
            }, 2000);
            (this.$refs as any).ethForm.resetFields();
            this.$message.success('Transfer Success');
            this.retrieveStep = 2;
          } else {
            const err = Object.keys((res as { Err: IcrcTransferError }).Err)[0];
            this.$message.error(err);
          }
        } catch (e) {
          console.log(e);
          this.$message.error(e);
        }
        loading.close();
      }
    });
  }
  private async transferCkBTC(): Promise<void> {
    (this.$refs as any).form.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          const amount = BigInt(
            new BigNumber(this.dissolveForm.amount).times(10 ** 8).toString(10)
          );
          const to = this.withdrawalAccount;
          let tokenId;
          if (this.BTCType === BTCTypeEnum.icBTC) {
            tokenId = IC_BTC_CANISTER_ID;
          } else {
            tokenId = CK_BTC_CANISTER_ID;
          }
          const res = await this.DRC20TokenService.icrc1Transfer(
            tokenId,
            amount,
            to
          );
          if (
            (
              res as {
                Ok: bigint;
              }
            ).Ok
          ) {
            this.refreshRetrieving();
            (this.$refs as any).form.resetFields();
            this.$message.success('Transfer Success');
            this.retrieveStep = 2;
          } else {
            const err = Object.keys((res as { Err: IcrcTransferError }).Err)[0];
            this.$message.error(err);
          }
        } catch (e) {
          console.log(e);
          this.$message.error(e);
        }
        loading.close();
      }
    });
  }
  private ckETHRefreshRetrieving(): void {
    const ERC20TokenId = this.icNetworkTokens.tokenId;
    if (ERC20TokenId) {
      getTokenBalance({ icrc1: null }, ERC20TokenId).then((res) => {
        this.$set(this.ERC20Balance, ERC20TokenId, res);
        // this.ckETHBalance = res;
        this.toAddToken();
      });
      getDepositing(
        { icrc1: null },
        ERC20TokenId,
        this.ckETHWithdrawalAccount
      ).then((res) => {
        this.dissolveBalanceETH = res;
        if (res === '0') {
          this.removeRetrievePending();
        }
      });
    }
  }
  private refreshRetrieving(): void {
    if (this.BTCType === BTCTypeEnum.icBTC) {
      getTokenBalance({ icrc1: null }, IC_BTC_CANISTER_ID).then((res) => {
        this.icBTCBalance = res;
      });
      getDepositing(
        { icrc1: null },
        IC_BTC_CANISTER_ID,
        this.withdrawalAccount
      ).then((res) => {
        this.dissolveBalance = res;
      });
    } else {
      getTokenBalance({ icrc1: null }, CK_BTC_CANISTER_ID).then((res) => {
        this.ckBTCBalance = res;
      });
      getDepositing(
        { icrc1: null },
        CK_BTC_CANISTER_ID,
        this.withdrawalAccount
      ).then((res) => {
        this.dissolveBalance = res;
      });
    }
  }
  private async dissolveCkETH(): Promise<void> {
    (this.$refs as any).ethRetrieveForm.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          let ERC20TokenId = [];
          if (
            this.icNetworkTokens.id !==
            '0x0000000000000000000000000000000000000000'
          ) {
            ERC20TokenId = [this.icNetworkTokens.id];
          }
          const res = await this.ckETHMinterService.retrieve(
            this.ethRetrieveForm.address.trim(),
            BigInt(this.dissolveBalanceETH),
            ERC20TokenId
          );
          console.log(res);
          const type = Object.keys(res)[0];
          const time = new Date().getTime();
          if (type === 'Ok') {
            // const retrieval = {
            //   txIndex: res.Ok.txIndex,
            //   amount: res.Ok.amount,
            //   time: time
            // };
            // this.retrieveETHStatus.unshift([retrieval]);
            this.getRetrieveETHList();
            this.removeRetrievePending();
            this.onGetRetrieving();
            // this.updateRetrieveETHStatus();
            this.ckETHRefreshRetrieving();
            (this.$refs as any).ethRetrieveForm.resetFields();
            this.$message.success('Retrieve pending');
          } else {
            const err = (res as { Err: ResultError }).Err;
            this.$message.error(
              JSON.stringify(err, (key, value) =>
                typeof value === 'bigint' ? value.toString(10) : value
              )
            );
          }
        } catch (e) {
          console.log(e);
          this.$message.error(e);
        }
        loading.close();
      }
    });
  }
  private async dissolve(): Promise<void> {
    (this.$refs as any).retrieveForm.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          const res = await this.ckBTCMinterService.retrieveBtc(this.BTCType, {
            address: this.retrieveForm.address.trim(),
            amount: BigInt(this.availableBalance)
          });
          console.log(res);
          const type = Object.keys(res)[0];
          if (type === 'Ok') {
            const block = (
              res as { Ok: RetrieveBtcOk }
            ).Ok.block_index.toString(10);
            const principal = localStorage.getItem('principal');
            const currentInfo =
              JSON.parse(localStorage.getItem(principal)) || {};
            const time = new Date().getTime();
            if (this.BTCType === BTCTypeEnum.icBTC) {
              if (!currentInfo.icBTCBlock) {
                currentInfo.icBTCBlock = [];
              }
              currentInfo.icBTCBlock.unshift({
                blockIndex: block,
                status: { Signing: null },
                time: time
              });
              localStorage.setItem(principal, JSON.stringify(currentInfo));
              this.retrieveBtcStatus = currentInfo.icBTCBlock;
            } else {
              if (!currentInfo.ckBTCBlock) {
                currentInfo.ckBTCBlock = [];
              }
              currentInfo.ckBTCBlock.unshift({
                blockIndex: block,
                status: { Signing: null },
                time: time
              });
              localStorage.setItem(principal, JSON.stringify(currentInfo));
              this.retrieveBtcStatus = currentInfo.ckBTCBlock;
            }
            this.refreshRetrieving();
            (this.$refs as any).retrieveForm.resetFields();
            this.$message.success('Retrieve pending');
            this.retrieveStep = 3;
          } else {
            const err = (res as { Err: RetrieveBtcError }).Err;
            this.$message.error(
              JSON.stringify(err, (key, value) =>
                typeof value === 'bigint' ? value.toString(10) : value
              )
            );
          }
        } catch (e) {
          console.log(e);
          this.$message.error(e);
        }
        loading.close();
      }
    });
  }
  private initETHWithdrawalAccount(): void {
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    const version = '1.0';
    if (version) {
      let withdrawalAccount;
      const ckETHWithdrawalAccount = currentInfo.ckETHWithdrawalAccount;
      if (
        ckETHWithdrawalAccount &&
        ckETHWithdrawalAccount.startsWith(
          `${IC_ETH_MINTER_CANISTER_ID}-${version}-`
        )
      ) {
        withdrawalAccount = ckETHWithdrawalAccount.split(
          `${IC_ETH_MINTER_CANISTER_ID}-${version}-`
        )[1];
      }
      if (withdrawalAccount) {
        this.ckETHWithdrawalAccount = {
          owner: Principal.fromText(JSON.parse(withdrawalAccount).owner),
          subaccount: JSON.parse(withdrawalAccount).subaccount
        };
      }
    }
  }
  private async initETHDissolve(): Promise<void> {
    this.ckETHWithdrawalAccount = null;
    this.initETHWithdrawalAccount();
    console.log(this.ckETHWithdrawalAccount);
    await this.getETHWithdrawalAccount('1.0');
    await this.getRetrieveETHList();
    // this.updateRetrieveETHStatus();
    this.updateRetrieveETHStatusTimer = window.setInterval(() => {
      window.setTimeout(() => {
        if (!this.getCheckAuth) {
          this.getRetrieveETHList(false);
          // this.updateRetrieveETHStatus();
        }
      }, 0);
    }, 30 * 1000);
  }
  private async showDissolveETH(): Promise<void> {
    this.dissolveBalanceETH = '';
    this.canRetrieveETH = false;
    this.hasShowWarningETH('dissolve');
  }
  private async getEthTokenBalance(
    std: string,
    tokenId: string,
    address: string,
    ETHHttpsNum?: number,
    retry = 0,
    ETHHttpsKeys: Array<string> = ETHHttps
  ): Promise<string> {
    try {
      if (!ETHHttpsNum && ETHHttpsNum !== 0) {
        ETHHttpsNum = Math.floor(Math.random() * ETHHttpsKeys.length);
        console.log(ETHHttpsNum);
      } else {
        if (ETHHttpsNum + 1 >= ETHHttpsKeys.length) {
          ETHHttpsNum = 0;
        } else {
          ETHHttpsNum += 1;
        }
      }
      let balance: string = null;
      if (std.toLocaleLowerCase() === 'eth') {
        const res = await axios.post(ETHHttpsKeys[ETHHttpsNum], {
          id: 1,
          jsonrpc: '2.0',
          params: [address, 'latest'],
          method: 'eth_getBalance'
        });
        console.log(res);
        if (res.data.result) {
          balance = res.data.result.toString(10);
        }
      } else {
        const res = await axios.post(ETHHttpsKeys[ETHHttpsNum], {
          id: 1,
          jsonrpc: '2.0',
          params: [address, [tokenId]],
          method: 'alchemy_getTokenBalances'
        });
        console.log(res);
        if (
          res.data.result.tokenBalances &&
          res.data.result.tokenBalances.length
        ) {
          balance = res.data.result.tokenBalances[0].tokenBalance.toString(10);
        }
      }
      return balance;
    } catch (e) {
      console.error(e);
      if (retry < ETHHttpsKeys.length) {
        await this.getEthTokenBalance(
          std,
          tokenId,
          address,
          ETHHttpsNum,
          ++retry,
          ETHHttpsKeys
        );
      }
    }
  }
  private async getEthTransactionReceipt(
    txHash: string,
    ETHHttpsNum?: number,
    retry = 0,
    ETHHttpsKeys: Array<string> = ETHHttps
  ): Promise<any> {
    try {
      if (!ETHHttpsNum && ETHHttpsNum !== 0) {
        ETHHttpsNum = Math.floor(Math.random() * ETHHttpsKeys.length);
        console.log(ETHHttpsNum);
      } else {
        if (ETHHttpsNum + 1 >= ETHHttpsKeys.length) {
          ETHHttpsNum = 0;
        } else {
          ETHHttpsNum += 1;
        }
      }
      return await axios.post(ETHHttpsKeys[ETHHttpsNum], {
        id: 1,
        jsonrpc: '2.0',
        params: [txHash],
        method: 'eth_getTransactionReceipt'
      });
    } catch (e) {
      console.error(e);
      if (retry < ETHHttpsKeys.length) {
        await this.getEthTransactionReceipt(
          txHash,
          ETHHttpsNum,
          ++retry,
          ETHHttpsKeys
        );
      }
    }
  }
  private async getEthTransactionByHash(
    txHash: string,
    ETHHttpsNum?: number,
    retry = 0
  ): Promise<any> {
    try {
      if (!ETHHttpsNum && ETHHttpsNum !== 0) {
        ETHHttpsNum = Math.floor(Math.random() * ETHHttps.length);
        console.log(ETHHttpsNum);
      } else {
        if (ETHHttpsNum + 1 >= ETHHttps.length) {
          ETHHttpsNum = 0;
        } else {
          ETHHttpsNum += 1;
        }
      }
      return await axios.post(ETHHttps[ETHHttpsNum], {
        id: 1,
        jsonrpc: '2.0',
        params: [txHash],
        method: 'eth_getTransactionByHash'
      });
    } catch (e) {
      console.error(e);
      if (retry < ETHHttps.length) {
        await this.getEthTransactionByHash(txHash, ETHHttpsNum, ++retry);
      }
    }
  }
  private async getEthBlock(
    ETHHttpsNum?: number,
    retry = 0,
    ETHHttpsKeys: Array<string> = ETHHttps
  ): Promise<any> {
    try {
      if (!ETHHttpsNum && ETHHttpsNum !== 0) {
        ETHHttpsNum = Math.floor(Math.random() * ETHHttpsKeys.length);
        console.log(ETHHttpsNum);
      } else {
        if (ETHHttpsNum + 1 >= ETHHttpsKeys.length) {
          ETHHttpsNum = 0;
        } else {
          ETHHttpsNum += 1;
        }
      }
      return await axios.post(ETHHttpsKeys[ETHHttpsNum], {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_blockNumber'
      });
    } catch (e) {
      console.error(e);
      if (retry < ETHHttpsKeys.length) {
        await this.getEthBlock(ETHHttpsNum, ++retry, ETHHttpsKeys);
      }
    }
  }
  private async getMintDepositing(): Promise<void> {
    this.getBalanceInit();
    if (this.depositMethod === 1) {
      try {
        const block = await this.getEthBlock();
        console.log(block);
        if (block) {
          this.blockCountETH = parseInt(block.data.result);
        }
        console.log(this.blockCountETH);
      } catch (e) {
        console.error(e);
      }
      const std = Object.keys(this.icNetworkTokens.icTokenInfo.std)[0];
      let token;
      if (std === 'ETH') {
        token = { eth: null };
      } else {
        token = { token: this.icNetworkTokens.icTokenInfo.tokenId };
      }
      const res = await this.ckETHMinterService.getDepositing(token);
      console.log(res);
      if (res && res[0] && res[0][1] && res[0][1].length) {
        const promiseValue = [];
        const txIndex = [];
        promiseValue.push(this.ckETHMinterService.getEthTx(res[0][1][0]));
        txIndex.push(res[0][1][0]);
        if (std === 'ERC20') {
          promiseValue.unshift(
            this.ckETHMinterService.getEthTx(res[0][1][0] - BigInt(1))
          );
          txIndex.unshift(res[0][1][0] - BigInt(1));
        }
        const promiseRes = await Promise.all(promiseValue);
        if (
          promiseRes[promiseValue.length - 1] &&
          promiseRes[promiseValue.length - 1][0] &&
          promiseRes[promiseValue.length - 1][0].tokenId !==
            this.icNetworkTokens.id
        ) {
          this.depositing = [];
          return;
        }
        const needUpdate: Array<boolean> = [];
        for (let i = 0; i < promiseRes.length; i++) {
          const txStatus = promiseRes[i];
          needUpdate.push(false);
          if (txStatus && txStatus.length) {
            const depositing = txStatus[0];
            if (this.depositing.length >= 1) {
              this.depositing.splice(i, 1, depositing);
            } else {
              this.depositing.push(depositing);
            }
            depositing.txIndex = txIndex[i];
            const txHash = depositing.txHash;
            if (txHash && txHash.length) {
              let resReceipt;
              for (let i = 0; i < txHash.length; i++) {
                resReceipt = await this.getEthTransactionReceipt(txHash[i]);
                if (resReceipt && resReceipt.data.result) {
                  break;
                }
              }
              console.log(i);
              console.log(resReceipt);
              let receipt;
              if (resReceipt) {
                receipt = resReceipt.data.result;
                if (receipt && receipt.status) {
                  depositing.block_height = receipt.blockNumber;
                  const principal = localStorage.getItem('principal');
                  const currentInfo =
                    JSON.parse(localStorage.getItem(principal)) || {};
                  if (
                    currentInfo.ckETHDepositCover &&
                    currentInfo.ckETHDepositCover[
                      IC_ETH_MINTER_CANISTER_ID +
                        ethVersion +
                        depositing.txIndex
                    ]
                  ) {
                    delete currentInfo.ckETHDepositCover[
                      IC_ETH_MINTER_CANISTER_ID +
                        ethVersion +
                        depositing.txIndex
                    ];
                    localStorage.setItem(
                      principal,
                      JSON.stringify(currentInfo)
                    );
                  }
                }
              }
              if (
                receipt &&
                receipt.status &&
                this.blockCountETH - Number(receipt.blockNumber) >
                  Number(this.minterInfo.minConfirmations) - 1
              ) {
                needUpdate[i] = true;
              }
              const status = Object.keys(depositing.status)[0];
              if (
                !receipt &&
                depositing.signedTx &&
                depositing.signedTx.length
              ) {
                this.updateETHStatus(depositing.signedTx[0][0]);
              }
              if (
                !receipt &&
                depositing.signedTx &&
                depositing.signedTx.length &&
                (status === 'Submitted' || status === 'Pending')
              ) {
                // todo
                const principal = localStorage.getItem('principal');
                const currentInfo =
                  JSON.parse(localStorage.getItem(principal)) || {};
                if (!currentInfo.ckETHDepositCover) {
                  currentInfo.ckETHDepositCover = {};
                }
                const now = new Date().getTime();
                if (
                  !currentInfo.ckETHDepositCover[
                    IC_ETH_MINTER_CANISTER_ID + ethVersion + depositing.txIndex
                  ]
                ) {
                  currentInfo.ckETHDepositCover[
                    IC_ETH_MINTER_CANISTER_ID + ethVersion + depositing.txIndex
                  ] = now;
                  localStorage.setItem(principal, JSON.stringify(currentInfo));
                } else {
                  const pendingTime = 20 * 60 * 1000;
                  const statusTime = Number(
                    currentInfo.ckETHDepositCover[
                      IC_ETH_MINTER_CANISTER_ID +
                        ethVersion +
                        depositing.txIndex
                    ]
                  );
                  if (new BigNumber(now).minus(statusTime).gt(pendingTime)) {
                    currentInfo.ckETHDepositCover[
                      IC_ETH_MINTER_CANISTER_ID +
                        ethVersion +
                        depositing.txIndex
                    ] = now;
                    localStorage.setItem(
                      principal,
                      JSON.stringify(currentInfo)
                    );
                    await this.ckETHMinterService.coverTx(depositing.txIndex);
                  }
                }
              }
              if (i === promiseRes.length - 1) {
                console.log(needUpdate);
                if (!needUpdate.includes(false)) {
                  this.updateETH(false);
                }
              }
            }
          }
        }
      } else {
        this.depositing = [];
      }
    }
    if (this.depositMethod === 2) {
      this.depositInfo = this.getDepositInfo();
      for (let i = 0; i < this.depositInfo.length; i++) {
        if (
          this.depositInfo[i][0] &&
          this.depositInfo[i][1] &&
          !this.depositInfo[i][2]
        ) {
          let pendingDepositTxn = await this.getPendingDepositTxn(
            this.depositInfo[i][0]
          );
          console.log(pendingDepositTxn);
          if (pendingDepositTxn && pendingDepositTxn.length) {
            this.depositingInfo = pendingDepositTxn[0];
            const now = new Date().getTime();
            if (
              (this.depositInfo[i][3] &&
                now - this.depositInfo[i][3] > 2 * 60 * 1000) ||
              !this.depositInfo[i][3]
            ) {
              await this.ckETHMinterService.updateClaims();
              const now = new Date().getTime();
              this.depositInfo[i][3] = now;
              this.setDepositInfo(this.depositInfo);
              pendingDepositTxn = await this.getPendingDepositTxn(
                this.depositInfo[i][0]
              );
              this.depositInfo[i][3] = now;
              console.log(pendingDepositTxn);
              if (
                pendingDepositTxn &&
                pendingDepositTxn[0] &&
                !pendingDepositTxn[0][3]
              ) {
                this.depositingInfo = pendingDepositTxn[0];
              } else {
                this.getBalanceInit();
                this.depositInfo[i][2] = true;
                this.setDepositInfo(this.depositInfo);
                this.onGetClaim2Pending();
                this.depositingInfo = null;
              }
            }
            return;
          } else {
            const now = new Date().getTime();
            this.depositInfo[i][2] = true;
            this.depositInfo[i][3] = now;
            this.depositingInfo = null;
            this.setDepositInfo(this.depositInfo);
            this.onGetClaim2Pending();
          }
        }
      }
    }
  }
  private async getPendingDepositTxn(
    txHash: string
  ): Promise<Array<PendingDepositTxn>> {
    return await this.ckETHMinterService.getPendingDepositTxn(txHash);
  }
  private async getRetrieveETHList(isHand = true): Promise<void> {
    if (isHand) {
      this.showRetrieveETHStatus = true;
    }
    // const res = await this.ckETHMinterService.retrievalList();
    const std = Object.keys(this.icNetworkTokens.icTokenInfo.std)[0];
    let token;
    if (std === 'ETH') {
      token = { eth: null };
    } else {
      token = { token: this.icNetworkTokens.icTokenInfo.tokenId };
    }
    const res = await this.ckETHMinterService.getRetrieving(token);
    console.log(res);
    if (res && res.length) {
      this.retrieveETHStatus = res;
      this.updateRetrieveETHStatus();
    } else {
      this.retrieveETHStatus = [];
      this.updateRetrievals();
    }
    this.showRetrieveETHStatus = false;
  }
  private async getETHWithdrawalAccount(version: string): Promise<void> {
    if (!this.ckETHWithdrawalAccount) {
      const principal = localStorage.getItem('principal');
      this.ckETHWithdrawalAccount =
        await this.ckETHMinterService.getWithdrawalAccount();
      if (version && this.ckETHWithdrawalAccount) {
        if (principal) {
          const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
          const withdrawalAccount = {
            owner: this.ckETHWithdrawalAccount.owner.toString(),
            subaccount: [Array.from(this.ckETHWithdrawalAccount.subaccount[0])]
          };
          currentInfo.ckETHWithdrawalAccount = `${IC_ETH_MINTER_CANISTER_ID}-${version}-${JSON.stringify(
            withdrawalAccount
          )}`;
          localStorage.setItem(principal, JSON.stringify(currentInfo));
        }
      }
    }
    // todo cketh fee
    this.getETHDissolveBalance();
  }
  private async getETHDissolveBalance(): Promise<void> {
    if (this.ckETHWithdrawalAccount) {
      const tokenId = this.icNetworkTokens.tokenId;
      let retrieve_eth_min_amount = this.icNetworkTokens.icTokenInfo.minAmount;
      this.clearTime();
      this.dissolveBalanceETH = await getDepositing(
        { icrc1: null },
        tokenId,
        this.ckETHWithdrawalAccount
      );
      this.canRetrieveETH = new BigNumber(this.dissolveBalanceETH).gte(
        retrieve_eth_min_amount.toString(10)
      );
      this.balanceTimer = window.setInterval(() => {
        setTimeout(async () => {
          if (!this.getCheckAuth) {
            this.dissolveBalanceETH = await getDepositing(
              { icrc1: null },
              tokenId,
              this.ckETHWithdrawalAccount
            );
            this.refreshCkETHBalance(false);
            this.canRetrieveETH = new BigNumber(this.dissolveBalanceETH).gte(
              retrieve_eth_min_amount.toString(10)
            );
          }
        });
      }, 3000);
    }
  }
  private async showDissolve(type: BTCTypeEnum): Promise<void> {
    this.BTCType = type;
    this.dissolveBalance = '';
    this.btcRetrieveFee = null;
    this.canRetrieve = false;
    this.retrieveBtcStatus = [];
    this.hasShowWarning('dissolve');
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    if (this.BTCType === BTCTypeEnum.icBTC) {
      this.retrieveBtcStatus = currentInfo.icBTCBlock || [];
    } else {
      this.retrieveBtcStatus = currentInfo.ckBTCBlock || [];
    }
    console.log(this.retrieveBtcStatus);
    this.updateRetrieveBtcStatus();
    this.updateRetrieveBtcStatusTimer = window.setInterval(() => {
      window.setTimeout(() => {
        if (!this.getCheckAuth) {
          this.updateRetrieveBtcStatus();
        }
      }, 0);
    }, 30 * 1000);

    // icBTC update Submitted
    if (this.BTCType === BTCTypeEnum.icBTC) {
      this.updateIcBtcConfirmed();
      this.updateRetrieveBtcSubmittedStatusTimer = window.setInterval(() => {
        window.setTimeout(() => {
          if (!this.getCheckAuth) {
            this.updateIcBtcConfirmed();
          }
        }, 0);
      }, 100 * 1000);
    }
    const version = await this.getInfo(this.BTCType);
    if (version) {
      let withdrawalAccount;
      if (this.BTCType === BTCTypeEnum.icBTC) {
        const icBTCWithdrawalAccount = currentInfo.icBTCWithdrawalAccount;
        if (
          icBTCWithdrawalAccount &&
          icBTCWithdrawalAccount.startsWith(
            `${IC_BTC_MINTER_CANISTER_ID}-${version}-`
          )
        ) {
          withdrawalAccount = icBTCWithdrawalAccount.split(
            `${IC_BTC_MINTER_CANISTER_ID}-${version}-`
          )[1];
        }
      } else {
        const ckBTCWithdrawalAccount = currentInfo.ckBTCWithdrawalAccount;
        if (
          ckBTCWithdrawalAccount &&
          ckBTCWithdrawalAccount.startsWith(
            `${CK_BTC_MINTER_CANISTER_ID}-${version}-`
          )
        ) {
          withdrawalAccount = ckBTCWithdrawalAccount.split(
            `${CK_BTC_MINTER_CANISTER_ID}-${version}-`
          )[1];
        }
      }
      if (withdrawalAccount) {
        this.withdrawalAccount = {
          owner: Principal.fromText(JSON.parse(withdrawalAccount).owner),
          subaccount: JSON.parse(withdrawalAccount).subaccount
        };
      }
    }
    this.getWithdrawalAccount(version);
  }
  private async batchSend(blockIndex): Promise<void> {
    try {
      const res = await this.ckBTCMinterService.retrieveLog(this.BTCType, [
        Number(blockIndex)
      ]);
      if (res && res.length) {
        await this.ckBTCMinterService.batchSend(this.BTCType, [res[0].txIndex]);
      }
    } catch (e) {
      console.log(e);
    }
  }
  private updateRetrieveETHStatus(): void {
    const principal = localStorage.getItem('principal');
    this.retrieveETHStatus.forEach(async (val, index) => {
      let status;
      let canGetStatus = [
        'Pending',
        'Signing',
        'Building',
        'Sending',
        'Submitted'
      ];
      if (val[1].status) {
        status = Object.keys(val[1].status)[0];
      }
      if (canGetStatus.includes(status) || !status) {
        const principal1 = localStorage.getItem('principal');
        if (principal === principal1) {
          if (
            status === 'Pending' ||
            status === 'Sending' ||
            status === 'Submitted'
          ) {
            await this.onRetrieveETH(index);
          }
        }
      }
    });
  }
  private updateRetrieveBtcStatus(): void {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      const time = new Date().getTime();
      this.retrieveBtcStatus.forEach((val, index) => {
        let status;
        let canGetStatus = ['Pending', 'Signing', 'Sending', 'Submitted'];
        if (this.BTCType === BTCTypeEnum.icBTC) {
          canGetStatus = ['Pending', 'Signing', 'Sending'];
        }
        if (val.status) {
          status = Object.keys(val.status)[0];
        }
        if (canGetStatus.includes(status) || !status) {
          this.getRetrieveBtcStatus(val.blockIndex).then(async (res) => {
            console.log(res);
            const currentStatus = Object.keys(res)[0];
            if (
              status === 'Pending' &&
              time - Number(val.time) > 10 * 60 * 1000
            ) {
              this.$set(this.retrieveBtcStatus, index, {
                blockIndex: val.blockIndex,
                status: res,
                time: time
              });
              this.batchSend(val.blockIndex);
            }
            if (currentStatus !== status) {
              this.$set(this.retrieveBtcStatus, index, {
                blockIndex: val.blockIndex,
                status: res,
                time: val.time
              });
              if (this.BTCType === BTCTypeEnum.icBTC) {
                currentInfo.icBTCBlock = this.retrieveBtcStatus;
              } else {
                currentInfo.ckBTCBlock = this.retrieveBtcStatus;
              }
              localStorage.setItem(principal, JSON.stringify(currentInfo));
            }
          });
        }
      });
    }
  }
  private async updateIcBtcConfirmed(): Promise<void> {
    let block = 0;
    const blockRes = await axios.get('https://blockchain.info/q/getblockcount');
    if (blockRes && blockRes.data) {
      block = blockRes.data;
    }
    console.log(block);
    for (let i = this.retrieveBtcStatus.length - 1; i >= 0; i--) {
      const val = this.retrieveBtcStatus[i];
      let status;
      if (val.status) {
        status = Object.keys(val.status)[0];
        if (Object.values(val.status)[0] && Object.values(val.status)[0].txid) {
          const txid = toHexString(
            new Uint8Array(Object.values(val.status)[0].txid)
          );
          if (status === 'Submitted') {
            if (!val.BTCBlock) {
              let currentBlock;
              try {
                const res = await axios.get(
                  `https://blockstream.info/api/tx/${txid}`
                );
                if (res && res.data && res.data.status.block_height) {
                  currentBlock = res.data.status.block_height;
                  if (new BigNumber(block).minus(currentBlock).gt(4)) {
                    this.$set(this.retrieveBtcStatus, i, {
                      blockIndex: val.blockIndex,
                      status: {
                        Confirmed: {
                          txid: Array.from(Object.values(val.status)[0].txid)
                        }
                      },
                      time: val.time
                    });
                    const principal = localStorage.getItem('principal');
                    const currentInfo =
                      JSON.parse(localStorage.getItem(principal)) || {};
                    currentInfo.icBTCBlock = this.retrieveBtcStatus;
                    localStorage.setItem(
                      principal,
                      JSON.stringify(currentInfo)
                    );
                  } else {
                    this.$set(this.retrieveBtcStatus, i, {
                      blockIndex: val.blockIndex,
                      status: val.status,
                      time: val.time,
                      BTCBlock: currentBlock
                    });
                  }
                }
                break;
              } catch (e) {
                console.log(e);
              }
            } else {
              if (new BigNumber(block).minus(val.BTCBlock).gt(4)) {
                this.$set(this.retrieveBtcStatus, i, {
                  blockIndex: val.blockIndex,
                  status: {
                    Confirmed: {
                      txid: Array.from(Object.values(val.status)[0].txid)
                    }
                  },
                  time: val.time
                });
                const principal = localStorage.getItem('principal');
                const currentInfo =
                  JSON.parse(localStorage.getItem(principal)) || {};
                currentInfo.icBTCBlock = this.retrieveBtcStatus;
                localStorage.setItem(principal, JSON.stringify(currentInfo));
              }
            }
          }
        }
      }
    }
    console.log(this.retrieveBtcStatus);
  }
  private getBTCTxs(): void {
    const time = new Date().getTime();
    if (this.BTCType === BTCTypeEnum.icBTC) {
      if (
        this.currentTxTimeIcBTC &&
        new BigNumber(time).minus(this.currentTxTimeIcBTC).lt(90 * 1000)
      ) {
        this.showBTCTransactions = false;
        return;
      }
      this.getBTCTransactions(BTCTypeEnum.icBTC);
      this.currentTxTimeIcBTC = time;
    }
    if (this.BTCType === BTCTypeEnum.ckBTC) {
      if (
        this.currentTxTimeCkBTC &&
        new BigNumber(time).minus(this.currentTxTimeCkBTC).lt(90 * 1000)
      ) {
        this.showCkBTCTransactions = false;
        return;
      }
      this.getBTCTransactions(BTCTypeEnum.ckBTC);
      this.currentTxTimeCkBTC = time;
    }
    if (!this.BTCType) {
      const ERC20TokenId = this.icNetworkTokens.tokenId;
      if (!this.currentTxTimeCkETH[ERC20TokenId]) {
        this.currentTxTimeCkETH[ERC20TokenId] = null;
      }
      this.ckETHTransactionsPage = 1;
      if (this.ckETHTransactions[ERC20TokenId]) {
        this.ckETHTransactionTotal =
          this.ckETHTransactions[ERC20TokenId].length;
      } else {
        this.ckETHTransactionTotal = 0;
      }
      if (
        this.currentTxTimeCkETH[ERC20TokenId] &&
        new BigNumber(time)
          .minus(this.currentTxTimeCkETH[ERC20TokenId])
          .lt(90 * 1000)
      ) {
        this.showCkETHTransactions = false;
        return;
      }

      this.getETHTransactions();
      this.currentTxTimeCkETH[ERC20TokenId] = time;
    }
  }
  private async getTransactions(): Promise<void> {
    console.log('BTCType: ' + this.BTCType);
    if (this.BTCType === BTCTypeEnum.icBTC) {
      const version = await this.getInfo(BTCTypeEnum.icBTC);
      this.BTCAddress(version, BTCTypeEnum.icBTC);
      await this.getBTCAddress(version, BTCTypeEnum.icBTC);
    }
    if (this.BTCType === BTCTypeEnum.ckBTC) {
      this.BTCAddress('1.0', BTCTypeEnum.ckBTC);
      await this.getBTCAddress('1.0', BTCTypeEnum.ckBTC);
    }
    if (!this.BTCType) {
      this.ETHAddress('1.0');
      await this.getETHAddress('1.0');
    }
    this.getCkBTCBalance();
    this.initETHDeposit();
    this.getBTCTxs();
    window.clearInterval(this.btcTxTimer);
    this.btcTxTimer = null;
    this.btcTxTimer = window.setInterval(() => {
      setTimeout(() => {
        if (!this.getCheckAuth) {
          this.getBTCTxs();
        }
      });
    }, 100 * 1000);
  }
  private ETHAddress(version: string): void {
    if (version) {
      const principal = localStorage.getItem('principal');
      if (principal) {
        const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
        const ckETHAddress = currentInfo.ckETHAddress;
        if (
          ckETHAddress &&
          ckETHAddress.startsWith(`${IC_ETH_MINTER_CANISTER_ID}-${version}-`)
        ) {
          const ETHAddressCk = ckETHAddress.split(
            `${IC_ETH_MINTER_CANISTER_ID}-${version}-`
          )[1];
          if (ETHAddressCk !== 'null') {
            this.ETHAddressCk = ETHAddressCk;
          }
        }
      }
    }
  }
  private BTCAddress(version: string, BTCType: BTCTypeEnum): void {
    if (version) {
      const principal = localStorage.getItem('principal');
      if (principal) {
        const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
        if (BTCType === BTCTypeEnum.icBTC) {
          const icBTCAddress = currentInfo.icBTCAddress;
          if (
            icBTCAddress &&
            icBTCAddress.startsWith(`${IC_BTC_MINTER_CANISTER_ID}-${version}-`)
          ) {
            this.BTCAddressIc = icBTCAddress.split(
              `${IC_BTC_MINTER_CANISTER_ID}-${version}-`
            )[1];
          }
        } else {
          const ckBTCAddress = currentInfo.ckBTCAddress;
          if (
            ckBTCAddress &&
            ckBTCAddress.startsWith(`${CK_BTC_MINTER_CANISTER_ID}-${version}-`)
          ) {
            this.BTCAddressCk = ckBTCAddress.split(
              `${CK_BTC_MINTER_CANISTER_ID}-${version}-`
            )[1];
          }
        }
      }
    }
  }
  private showForgeETH(): void {
    this.hasShowWarningETH('forge');
  }
  private showRetrieveCKETH(): void {
    console.log(this.icNetworkTokens);
    this.retrieveTitleETH = `Retrieve: ${this.icNetworkTokens.symbol} (${
      networkIds[this.icNetworkTokens.networkId]
    }) -> ${this.icNetworkTokens.icTokenInfo.symbol} (${
      networkIds[this.otherNetworkTokens.networkId]
    })`;
    this.retrieveModalCKETH = true;
    this.initCKETHRetrieve();
  }
  private initCKETHRetrieve(): void {
    if (this.getPrincipalId && this.icNetworkTokens) {
      const id = this.icNetworkTokens.id;
      const tokenId = this.icNetworkTokens.tokenId;
      const currentInfo =
        JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
      const ckETHRetrieve = currentInfo['ckETHRetrieve-' + id] || {};
      this.ckETHRetrieve = ckETHRetrieve[tokenId] || [];
      this.getCkETHRetrieveStatus(id, tokenId);
      this.getCKETHBalance(this.icNetworkTokens);
      this.getCKETHRetrieveInterval(this.icNetworkTokens);
    }
  }
  private async getCkETHRetrieveStatus(
    id: string,
    tokenId: string
  ): Promise<void> {
    for (let i = 0; i < this.ckETHRetrieve.length; i++) {
      const retrieve = this.ckETHRetrieve[i];
      const status = Object.keys(retrieve.status)[0];
      if (status !== 'TxFinalized' && status !== 'NotFound') {
        const res = await this.ckETHMinterDfiService.retrieve_eth_status(
          BigInt(retrieve.blockIndex)
        );
        const currentStatus = Object.keys(res)[0];
        if (status !== currentStatus) {
          this.$set(retrieve, 'status', res);
          const currentInfo =
            JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
          currentInfo['ckETHRetrieve-' + id][tokenId] = this.ckETHRetrieve;
          localStorage.setItem(
            this.getPrincipalId,
            JSON.stringify(currentInfo)
          );
        }
      }
    }
  }
  private getCKETHRetrieveInterval(
    icNetworkTokens: ICNetworkTokensInterface
  ): void {
    if (this.ckETHTimer) {
      window.clearInterval(this.ckETHTimer);
      this.ckETHTimer = null;
    }
    this.ckETHTimer = window.setInterval(() => {
      this.getCKETHBalance(icNetworkTokens);
      this.getCkETHRetrieveStatus(icNetworkTokens.id, icNetworkTokens.tokenId);
    }, 30 * 1000);
  }
  private showForgeCKETH(): void {
    console.log(this.icNetworkTokens);
    this.forgeTitleETH = `Mint: ${this.icNetworkTokens.icTokenInfo.symbol} (${
      networkIds[this.otherNetworkTokens.networkId]
    }) -> ${this.icNetworkTokens.symbol} (${
      networkIds[this.icNetworkTokens.networkId]
    })`;
    this.forgeModalCKETH = true;
    this.initCKETHMint();
  }
  private initCKETHMint(): void {
    if (this.getPrincipalId && this.icNetworkTokens) {
      const id = this.icNetworkTokens.id;
      const tokenId = this.icNetworkTokens.tokenId;
      const currentInfo =
        JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
      const ckETHMint = currentInfo['ckETHMint-' + id] || {};
      this.ckETHMint = ckETHMint[tokenId] || [];
      this.getCkETHMintBlockNum(id, tokenId);
      this.getLastScrapedBlockNumber();
      this.getCKETHBalance(this.icNetworkTokens);
      this.getCKETHMinterInterval(this.icNetworkTokens);
    }
  }
  private async getCKETHBalance(
    icNetworkTokens: ICNetworkTokensInterface
  ): Promise<void> {
    const tokenId = icNetworkTokens.tokenId;
    const balance = await getTokenBalance({ icrc1: null }, tokenId);
    this.$set(this.ERC20Balance, tokenId, balance);
    this.toAddToken('ICRC-1');
  }
  private getCKETHMinterInterval(
    icNetworkTokens: ICNetworkTokensInterface
  ): void {
    if (this.ckETHTimer) {
      window.clearInterval(this.ckETHTimer);
      this.ckETHTimer = null;
    }
    this.ckETHTimer = window.setInterval(() => {
      this.getCkETHMintBlockNum(icNetworkTokens.id, icNetworkTokens.tokenId);
      this.getLastScrapedBlockNumber();
      this.getCKETHBalance(icNetworkTokens);
    }, 30 * 1000);
  }
  private async getCkETHMintBlockNum(
    id: string,
    tokenId: string
  ): Promise<void> {
    this.getEthBlock(0, 0, ETHHttpsMainnet).then((res) => {
      console.log(res);
      if (res) {
        this.ckETHBlockNum = parseInt(res.data.result);
      }
    });
    for (let i = 0; i < this.ckETHMint.length; i++) {
      const mint = this.ckETHMint[i];
      if (!mint.blockNum) {
        const res = await this.getEthTransactionReceipt(
          mint.txHash,
          0,
          0,
          ETHHttpsMainnet
        );
        if (res) {
          const receipt = res.data.result;
          if (receipt) {
            console.log(receipt);
            this.$set(
              mint,
              'blockNum',
              Number(receipt.blockNumber).toString(10)
            );
            const currentInfo =
              JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
            if (!currentInfo['ckETHMint-' + id]) {
              currentInfo['ckETHMint-' + id] = {};
            }
            currentInfo['ckETHMint-' + id][tokenId] = this.ckETHMint;
            localStorage.setItem(
              this.getPrincipalId,
              JSON.stringify(currentInfo)
            );
          }
        }
      } else {
        break;
      }
    }
  }
  private async getLastScrapedBlockNumber(): Promise<void> {
    const events = await this.ckETHMinterDfiService.get_events({
      start: BigInt(0),
      length: BigInt(1)
    });
    if (events) {
      const length = 100;
      const total = events.total_event_count;
      let start = new BigNumber(total.toString(10)).minus(length).toString(10);
      if (new BigNumber(start).lt(0)) {
        start = '0';
      }
      await this.getEvents(BigInt(start), BigInt(length));
    }
  }
  private async getEvents(start: bigint, length: bigint): Promise<void> {
    const events = await this.ckETHMinterDfiService.get_events({
      start: start,
      length: length
    });
    if (events) {
      for (let i = events.events.length - 1; i >= 0; i--) {
        const event = events.events[i];
        const type = Object.keys(event.payload)[0];
        if (type === 'AcceptedDeposit') {
          this.lastScrapedBlockNumber = Number(
            event.payload['AcceptedDeposit'].block_number
          );
          break;
        }
      }
      if (
        this.lastScrapedBlockNumber === null &&
        new BigNumber(start.toString(10)).gt(0)
      ) {
        let newStart = new BigNumber(start.toString(10))
          .minus(length.toString(10))
          .toString(10);
        if (new BigNumber(newStart).lt(0)) {
          newStart = '0';
        }
        await this.getEvents(BigInt(newStart), length);
      }
    }
    console.log(this.lastScrapedBlockNumber);
  }
  private initETHDeposit(): void {
    if (this.forgeModalETH) {
      this.getETHDepositBalance();
      this.getMintDepositing();
      this.updateDepositETHStatusTimer = window.setInterval(() => {
        window.setTimeout(() => {
          if (!this.getCheckAuth) {
            // this.updateDepositETHStatus();
            this.getETHDepositBalance();
            this.getMintDepositing();
          }
        }, 0);
      }, 30 * 1000);
    }
  }
  private async getETHDepositBalance(): Promise<void> {
    if (this.ETHAddressCk) {
      let ckETHDepositBalance;
      const std = Object.keys(this.icNetworkTokens.icTokenInfo.std)[0];
      ckETHDepositBalance = await this.getEthTokenBalance(
        std,
        this.icNetworkTokens.id,
        this.ETHAddressCk
      );
      if (ckETHDepositBalance !== null) {
        this.ckETHDepositBalance = new BigNumber(ckETHDepositBalance)
          .div(10 ** this.icNetworkTokens.icTokenInfo.decimals)
          .decimalPlaces(8, 1)
          .toString(10);
      }
    }
  }
  private hasShowWarningETH(type: string): void {
    const hasShowWarning = this.$cookies.get('icETHTip');
    if (hasShowWarning) {
      if (type === 'forge') {
        this.forgeTitleETH = `Mint: ${
          this.icNetworkTokens.icTokenInfo.symbol
        } (${networkIds[this.otherNetworkTokens.networkId]}) -> ${
          this.icNetworkTokens.symbol
        } (${networkIds[this.icNetworkTokens.networkId]})`;
        this.forgeModalETH = true;
        this.showCkETHTransactions = true;
        this.initTransactions();
        // this.initETHDeposit();
      }
      if (type === 'dissolve') {
        this.dissolveTitleETH = `Retrieve: ${this.icNetworkTokens.symbol} (${
          networkIds[this.icNetworkTokens.networkId]
        }) -> ${this.icNetworkTokens.icTokenInfo.symbol} (${
          networkIds[this.otherNetworkTokens.networkId]
        })`;
        this.dissolveModalETH = true;
        this.showCkETHTransactions = true;
        this.initTransactions();
        this.initETHDissolve();
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      this.$confirm({
        title: 'Warning',
        content:
          'This is a new feature on the IC network and may have undetected flaws. You assume all results and risks arising from this operation, please be knowledgeable and participate voluntarily.',
        class: 'connect-plug warning-confirm',
        icon: 'connect-plug',
        centered: true,
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk() {
          that.$cookies.set('icETHTip', true, '36000d');
          if (type === 'forge') {
            that.forgeTitleETH = `Mint: ${
              that.icNetworkTokens.icTokenInfo.symbol
            } (${networkIds[that.otherNetworkTokens.networkId]}) -> ${
              that.icNetworkTokens.symbol
            } (${networkIds[that.icNetworkTokens.networkId]})`;
            that.forgeModalETH = true;
            that.showCkETHTransactions = true;
            that.initTransactions();
            // that.initETHDeposit();
          }
          if (type === 'dissolve') {
            that.dissolveTitleETH = `Retrieve: ${
              that.icNetworkTokens.symbol
            } (${networkIds[that.icNetworkTokens.networkId]}) -> ${
              that.icNetworkTokens.icTokenInfo.symbol
            } (${networkIds[that.otherNetworkTokens.networkId]})`;
            that.dissolveModalETH = true;
            that.showCkETHTransactions = true;
            that.initTransactions();
            that.initETHDissolve();
            // that.updateRetrievals();
          }
        }
      });
    }
  }
  private async showForge(type: BTCTypeEnum): Promise<void> {
    this.BTCType = type;
    this.hasShowWarning('forge');
  }
  private onActive(): void {
    timer && clearTimeout(timer);
    timer = window.setTimeout(() => this.getActive(), 300);
    this.activePendingModal = true;
  }
  private onContinue(): void {
    if (
      typeof this.networkIdMint === 'number' &&
      typeof this.networkIdMintTo === 'number' &&
      typeof this.networkTokenIdMint === 'number' &&
      typeof this.networkTokenIdMintTo === 'number'
    ) {
      if (this.networkTokensTo[this.networkTokenIdMintTo].symbol === 'BTC') {
        if (
          this.networkTokensFrom[this.networkTokenIdMint].symbol === 'ckBTC'
        ) {
          this.showDissolve(BTCTypeEnum.ckBTC);
        }
        if (
          this.networkTokensFrom[this.networkTokenIdMint].symbol === 'icBTC'
        ) {
          this.showDissolve(BTCTypeEnum.icBTC);
        }
      } else if (
        this.networkTokensTo[this.networkTokenIdMintTo].symbol === 'ckBTC'
      ) {
        this.showForge(BTCTypeEnum.ckBTC);
      } else if (
        this.networkTokensTo[this.networkTokenIdMintTo].symbol === 'icBTC'
      ) {
        this.showForge(BTCTypeEnum.icBTC);
      } else {
        const ckETHId = '1';
        if (
          this.networkTokensTo[this.networkTokenIdMintTo].networkToIcId ===
          ckETHId
        ) {
          this.BTCType = null;
          this.showForgeCKETH();
        } else if (
          this.networkTokensFrom[this.networkTokenIdMint].networkToIcId ===
          ckETHId
        ) {
          this.BTCType = null;
          this.showRetrieveCKETH();
        } else {
          let ethId = '1';
          if (Number(this.minterInfo.chainId) === 5) {
            ethId = '2';
          }
          this.getMinterInfo();
          if (
            this.networkTokensTo[this.networkTokenIdMintTo].networkToIcId ===
            ethId
          ) {
            this.BTCType = null;
            if (this.icNetworkTokens.icTokenInfo.std) {
              const std = Object.keys(this.icNetworkTokens.icTokenInfo.std)[0];
              if (std === 'ETH' || std === 'ERC20') {
                this.showForgeETH();
              }
            }
          } else if (
            this.networkTokensFrom[this.networkTokenIdMint].networkToIcId ===
            ethId
          ) {
            this.BTCType = null;
            this.showDissolveETH();
          }
          this.getAccountEvents();
        }
      }
    }
  }
  private switchHub(): void {
    if (
      typeof this.networkIdMint === 'number' &&
      typeof this.networkIdMintTo === 'number' &&
      typeof this.networkTokenIdMint === 'number' &&
      typeof this.networkTokenIdMintTo === 'number'
    ) {
      const networkListFrom = this.networkListTo[this.networkIdMintTo];
      const networkListTo = this.networkListFrom[this.networkIdMint];
      const networkTokensFrom = this.networkTokensTo[this.networkTokenIdMintTo];
      const networkTokensTo = this.networkTokensFrom[this.networkTokenIdMint];
      console.log(networkTokensFrom);
      console.log(networkTokensTo);
      this.networkListFrom = this.networkList;
      this.networkListTo = this.networkList.filter((item) => {
        return item.id === networkListTo.id;
      });
      this.networkListFrom.some((item, index) => {
        if (item.id === networkListFrom.id) {
          this.networkIdMint = index;
          this.networkTokensFrom = this.networkTokens.filter((item1) => {
            return item.id === item1.networkId;
          });
          return true;
        }
      });
      this.networkTokensFrom.some((item, index) => {
        if (
          item.tokenId === networkTokensFrom.tokenId &&
          item.networkId === networkTokensFrom.networkId
        ) {
          this.networkTokenIdMint = index;
          return true;
        }
      });
      this.networkListTo.some((item, index) => {
        if (item.id === networkListTo.id) {
          this.networkIdMintTo = index;
          this.networkTokensTo = this.networkTokens.filter((item1) => {
            return (
              item1.networkId === item.id && item1.id === networkTokensFrom.id
            );
          });
          return true;
        }
      });
      this.networkTokensTo.some((item, index) => {
        if (
          item.tokenId === networkTokensTo.tokenId &&
          item.networkId === networkTokensTo.networkId
        ) {
          this.networkTokenIdMintTo = index;
          return true;
        }
      });
    }
  }
  private changeNetworkIdMint(val: number): void {
    this.networkIdMintTo = [];
    this.networkTokenIdMint = [];
    this.networkTokenIdMintTo = [];
    this.networkTokensFrom = this.networkTokens.filter((item) => {
      return this.networkListFrom[val].id === item.networkId;
    });
  }
  private changeNetworkIdMintTo(val: number): void {
    this.networkTokenIdMintTo = [];
    this.networkTokensTo = this.networkTokens.filter((item) => {
      if (typeof this.networkTokenIdMint === 'number') {
        return (
          item.networkId === this.networkListTo[val].id &&
          item.id === this.networkTokensFrom[this.networkTokenIdMint].id &&
          item.networkToIcId ===
            this.networkTokensFrom[this.networkTokenIdMint].networkId
        );
      }
    });
    console.log(this.networkTokens);
    console.log(this.networkTokensFrom[this.networkTokenIdMint as number]);
    console.log(this.networkListTo[val]);
    console.log(this.networkTokensTo);
  }
  private changeNetworkTokenIdMint(val: number): void {
    this.networkIdMintTo = [];
    this.networkTokenIdMintTo = [];
    this.networkListTo = this.networkList.filter((item) => {
      return item.id === this.networkTokensFrom[val].networkToIcId;
    });
    if (this.networkTokensFrom[val].networkId === '-1') {
      const ERC20TokenId = this.networkTokensFrom[val].tokenId;
      if (ERC20TokenId) {
        getTokenBalance({ icrc1: null }, ERC20TokenId).then((balance) => {
          this.$set(this.ERC20Balance, ERC20TokenId, balance);
          console.log(this.ERC20Balance[ERC20TokenId]);
        });
      }
    } else if (
      this.networkTokensFrom[val].networkId === '1' ||
      this.networkTokensFrom[val].networkId === '2'
    ) {
      if (ethereum && ethereum.isConnected()) {
        ethereum._metamask.isUnlocked().then((isUnlocked) => {
          if (isUnlocked) {
            ethereum
              .request({
                method: 'wallet_getPermissions',
                params: []
              })
              .then((res) => {
                console.log(res);
                if (res && res.length) {
                  ethereum
                    .request({
                      method: 'eth_requestAccounts'
                    })
                    .then((accounts: Array<string>) => {
                      if (accounts && accounts.length) {
                        const account = accounts[0];
                        const ethereumTokenId = this.networkTokensFrom[val].id;
                        const networkId = this.networkTokensFrom[val].networkId;
                        let std = 'ERC20';
                        if (
                          ethereumTokenId ===
                            '0x0000000000000000000000000000000000000000' ||
                          ethereumTokenId === this.smartContractAddress
                        ) {
                          std = 'ETH';
                        }
                        this.getEthTokenBalance(
                          std,
                          ethereumTokenId,
                          account,
                          0,
                          0,
                          networkId === '2' ? ETHHttps : ETHHttpsMainnet
                        ).then((res) => {
                          this.ethereumIsConnected = true;
                          const balance = new BigNumber(res)
                            .div(10 ** 18)
                            .decimalPlaces(8, 1)
                            .toString(10);
                          this.$set(
                            this.ERC20EthereumBalance,
                            this.networkTokensFrom[val].tokenId,
                            balance
                          );
                        });
                      }
                    });
                }
              });
          }
        });
      } else {
        this.ethereumIsConnected = false;
      }
    }
  }
  private changeNetworkTokenIdMintTo(val: number): void {
    // this.changeNetworkTokenList();
    console.log('changeNetworkTokenIdMintTo');
    console.log(this.networkTokensTo[val].networkId);
    if (this.networkTokensTo[val].networkId === '-1') {
      const ERC20TokenId = this.networkTokensTo[val].tokenId;
      if (ERC20TokenId) {
        getTokenBalance({ icrc1: null }, ERC20TokenId).then((balance) => {
          this.$set(this.ERC20Balance, ERC20TokenId, balance);
          console.log(this.ERC20Balance[ERC20TokenId]);
        });
      }
    } else if (
      this.networkTokensTo[val].networkId === '1' ||
      this.networkTokensTo[val].networkId === '2'
    ) {
      if (ethereum && ethereum.isConnected()) {
        ethereum._metamask.isUnlocked().then((isUnlocked) => {
          if (isUnlocked) {
            ethereum
              .request({
                method: 'wallet_getPermissions',
                params: []
              })
              .then((res) => {
                console.log(res);
                if (res && res.length) {
                  ethereum
                    .request({
                      method: 'eth_requestAccounts'
                    })
                    .then((accounts: Array<string>) => {
                      if (accounts && accounts.length) {
                        const account = accounts[0];
                        const ethereumTokenId = this.networkTokensTo[val].id;
                        const networkId = this.networkTokensTo[val].networkId;
                        let std = 'ERC20';
                        if (
                          ethereumTokenId ===
                            '0x0000000000000000000000000000000000000000' ||
                          ethereumTokenId === this.smartContractAddress
                        ) {
                          std = 'ETH';
                        }
                        this.getEthTokenBalance(
                          std,
                          ethereumTokenId,
                          account,
                          0,
                          0,
                          networkId === '2' ? ETHHttps : ETHHttpsMainnet
                        ).then((res) => {
                          this.ethereumIsConnected = true;
                          const balance = new BigNumber(res)
                            .div(10 ** 18)
                            .decimalPlaces(8, 1)
                            .toString(10);
                          this.$set(
                            this.ERC20EthereumBalance,
                            this.networkTokensTo[val].tokenId,
                            balance
                          );
                        });
                      }
                    });
                }
              });
          }
        });
      } else {
        this.ethereumIsConnected = false;
      }
    }
  }
  private pageChangeDepositInfo(page: number): void {
    this.depositInfoPage = page;
  }
  private pageChange(page: number): void {
    if (this.BTCType === BTCTypeEnum.icBTC) {
      this.BTCTransactionsPage = page;
    } else {
      this.ckBTCTransactionsPage = page;
    }
  }
  private pageChangeCKETHMint(page: number) {
    this.ckETHMintPage = page;
  }
  private mintEventPageChange(page: number): void {
    this.mintEventPage = page;
  }
  private retrieveEventPageChange(page: number): void {
    this.retrieveEventPage = page;
  }
  private pageChangeETH(page: number): void {
    this.ckETHTransactionsPage = page;
  }
  private retrieveBtcStatusPageChange(page: number): void {
    this.retrieveBtcStatusPage = page;
  }
  private retrieveETHStatusPageChange(page: number): void {
    this.retrieveETHStatusPage = page;
  }
  private setUpdateBlockHeight(BTCType: BTCTypeEnum): void {
    const principal = localStorage.getItem('principal');
    if (principal) {
      let BTCTransactions = [];
      if (BTCType === BTCTypeEnum.icBTC) {
        BTCTransactions = this.BTCTransactions;
      } else {
        BTCTransactions = this.ckBTCTransactions;
      }
      for (let i = 0; i < BTCTransactions.length; i++) {
        const transaction = BTCTransactions[i];
        if (
          transaction.status.block_height &&
          this.blockCount - transaction.status.block_height >= 5 &&
          BTCType === BTCTypeEnum.icBTC
        ) {
          this.updateBlockHeight = transaction.status.block_height;
          break;
        }
        if (
          transaction.status.block_height &&
          this.blockCount - transaction.status.block_height >= 11 &&
          BTCType === BTCTypeEnum.ckBTC
        ) {
          this.updateCkBlockHeight = transaction.status.block_height;
          break;
        }
      }
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      if (BTCType === BTCTypeEnum.icBTC) {
        currentInfo.icBTCUpdateBlockHeight = this.updateBlockHeight;
      } else {
        currentInfo.ckBTCUpdateBlockHeight = this.updateCkBlockHeight;
      }
      localStorage.setItem(principal, JSON.stringify(currentInfo));
    }
  }
  private setCkETHUpdateBlockHeight(): void {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const ERC20TokenId = this.icNetworkTokens.tokenId;
      let ckETHTransactions = this.ckETHTransactions[ERC20TokenId] || [];
      for (let i = 0; i < ckETHTransactions.length; i++) {
        const transaction: any = ckETHTransactions[i];
        if (
          transaction.blockNumber &&
          this.blockCountETH - Number(transaction.blockNumber) >=
            Number(this.minterInfo.minConfirmations) - 1
        ) {
          this.updateCkETHBlockHeight[ERC20TokenId] = Number(
            transaction.blockNumber
          );
          break;
        }
      }
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      if (!currentInfo.ckETHUpdateBlockHeight) {
        currentInfo.ckETHUpdateBlockHeight = {};
      }
      if (typeof currentInfo.ckETHUpdateBlockHeight === 'number') {
        currentInfo.ckETHUpdateBlockHeight = {};
      }
      currentInfo.ckETHUpdateBlockHeight[ERC20TokenId] =
        this.updateCkETHBlockHeight[ERC20TokenId];
      localStorage.setItem(principal, JSON.stringify(currentInfo));
    }
  }
  private async depositETH(isHand = true): Promise<void> {
    const now = new Date().getTime() / 1000;
    // todo 1 Minutes
    if (ETHDepositTime && now - ETHDepositTime < 60) {
      if (isHand) {
        this.$message.error('Do not operate frequently');
        return;
      }
    }
    let loading;
    if (isHand) {
      await checkAuth();
      loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
    } else {
      if (this.forgeModalETH) {
        this.$message.warning(
          'Do not leave this page, please wait for the operation to complete.',
          6
        );
      }
    }
    this.depositNotifyLoading = true;
    try {
      ETHDepositTime = now;
      let ERC20Tokenid = [];
      if (
        this.icNetworkTokens.id !== '0x0000000000000000000000000000000000000000'
      ) {
        ERC20Tokenid = [this.icNetworkTokens.id];
      }
      console.log(ERC20Tokenid);
      const res = await this.ckETHMinterService.updateBalance(ERC20Tokenid);
      this.pendingLoading = false;
      this.setCkETHUpdateBlockHeight();
      if (res) {
        console.log(res);
        const type = Object.keys(res)[0];
        if (type === 'Ok') {
          this.getMintDepositing();
          this.updateMintPending();
          this.onGetDepositing();
          if (isHand) {
            this.$message.success('Mint pending');
          }
        } else {
          if (isHand) {
            const err = (res as { Err: ResultError }).Err;
            this.$message.error(
              JSON.stringify(err, (key, value) =>
                typeof value === 'bigint' ? value.toString(10) : value
              )
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
      this.$message.error('Error');
    }
    this.depositNotifyLoading = false;
    loading && loading.close();
  }
  private async onRetrieveETH(index: number): Promise<void> {
    const txHash = this.retrieveETHStatus[index][1].txHash;
    console.log(txHash);
    if (txHash && txHash.length) {
      let res;
      for (let i = 0; i < txHash.length; i++) {
        res = await this.getEthTransactionReceipt(txHash[i]);
        if (res && res.data.result) {
          break;
        }
      }
      console.log(res);
      let receipt;
      if (res) {
        receipt = res.data.result;
        if (receipt) {
          const principal = localStorage.getItem('principal');
          const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
          if (
            currentInfo.ckETHRetrieveCover &&
            currentInfo.ckETHRetrieveCover[
              IC_ETH_MINTER_CANISTER_ID +
                ethVersion +
                '-' +
                this.retrieveETHStatus[index][0]
            ]
          ) {
            delete currentInfo.ckETHRetrieveCover[
              IC_ETH_MINTER_CANISTER_ID +
                ethVersion +
                '-' +
                this.retrieveETHStatus[index][0]
            ];
            localStorage.setItem(principal, JSON.stringify(currentInfo));
          }
        }
      }
      try {
        const block = await this.getEthBlock();
        console.log(block);
        if (block) {
          this.blockCountETH = parseInt(block.data.result);
        }
        console.log(this.blockCountETH);
      } catch (e) {
        console.error(e);
      }
      if (
        receipt &&
        receipt.status &&
        this.blockCountETH - Number(receipt.blockNumber) <=
          Number(this.minterInfo.minConfirmations) - 1
      ) {
        this.retrieveETHStatus[index][1].status = { Submitted: null };
        this.$set(this.retrieveETHStatus, index, this.retrieveETHStatus[index]);
      }
      if (
        receipt &&
        receipt.status &&
        this.blockCountETH - Number(receipt.blockNumber) >
          Number(this.minterInfo.minConfirmations) - 1
      ) {
        this.retrieveETHStatus[index][1].status = { Confirmed: null };
        this.$set(this.retrieveETHStatus, index, this.retrieveETHStatus[index]);
        this.updateRetrievals();
      }
      if (receipt && !receipt.status) {
        const info = this.retrieveETHStatus[index][1];
        info.status = { Failure: null };
        this.$set(this.retrieveETHStatus, index, info);
      }
      if (!receipt) {
        try {
          const status = Object.keys(
            this.retrieveETHStatus[index][1].status
          )[0];
          if (
            !receipt &&
            this.retrieveETHStatus[index][1].signedTx &&
            this.retrieveETHStatus[index][1].signedTx.length
          ) {
            this.updateETHStatus(
              this.retrieveETHStatus[index][1].signedTx[0][0]
            );
          }
          if (
            !receipt &&
            this.retrieveETHStatus[index][1].signedTx &&
            this.retrieveETHStatus[index][1].signedTx.length &&
            (status === 'Submitted' || status === 'Pending')
          ) {
            const principal = localStorage.getItem('principal');
            const currentInfo =
              JSON.parse(localStorage.getItem(principal)) || {};
            if (!currentInfo.ckETHRetrieveCover) {
              currentInfo.ckETHRetrieveCover = {};
            }
            const now = new Date().getTime();
            if (
              !currentInfo.ckETHRetrieveCover[
                IC_ETH_MINTER_CANISTER_ID +
                  ethVersion +
                  '-' +
                  this.retrieveETHStatus[index][0]
              ]
            ) {
              currentInfo.ckETHRetrieveCover[
                IC_ETH_MINTER_CANISTER_ID +
                  ethVersion +
                  '-' +
                  this.retrieveETHStatus[index][0]
              ] = now;
              localStorage.setItem(principal, JSON.stringify(currentInfo));
            } else {
              const pendingTime = 20 * 60 * 1000;
              const statusTime = Number(
                currentInfo.ckETHRetrieveCover[
                  IC_ETH_MINTER_CANISTER_ID +
                    ethVersion +
                    '-' +
                    this.retrieveETHStatus[index][0]
                ]
              );
              if (new BigNumber(now).minus(statusTime).gt(pendingTime)) {
                currentInfo.ckETHRetrieveCover[
                  IC_ETH_MINTER_CANISTER_ID +
                    ethVersion +
                    '-' +
                    this.retrieveETHStatus[index][0]
                ] = now;
                localStorage.setItem(principal, JSON.stringify(currentInfo));
                await this.ckETHMinterService.coverTx(
                  this.retrieveETHStatus[index][0]
                );
              }
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
  private async updateETHStatus(signedTx: Array<number>): Promise<void> {
    const num = Math.floor(Math.random() * ETHWebsocketProvider.length);
    if (signedTx) {
      const web3 = new Web3(ETHWebsocketProvider[num]);
      web3.eth
        .sendSignedTransaction('0x' + toHexString(new Uint8Array(signedTx)))
        .then((receipt) => {
          console.log(receipt);
        });
    }
  }
  private async updateRetrievals(): Promise<void> {
    const num = Math.floor(Math.random() * ETHWebsocketProvider.length);
    const res = await this.ckETHMinterService.updateRetrievals();
    if (res && res.length) {
      res.forEach((item: [TxStatus, bigint]) => {
        const web3 = new Web3(ETHWebsocketProvider[num]);
        web3.eth
          .sendSignedTransaction(
            '0x' + toHexString(new Uint8Array(item[0].signedTx[0][0]))
          )
          .then((receipt) => {
            console.log(receipt);
          });
      });
    }
  }
  private async updateETH(isHand = true): Promise<void> {
    let loading;
    const now = new Date().getTime() / 1000;
    // todo 1 Minutes
    if (ETHUpdateTime && now - ETHUpdateTime < 60) {
      if (isHand) {
        this.$message.error('Do not operate frequently');
        return;
      }
    }
    if (isHand) {
      await checkAuth();
      loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
    }
    try {
      ETHUpdateTime = now;
      const res = await this.ckETHMinterService.updateBalance();
      console.log(res);
      if (res) {
        const type = Object.keys(res)[0];
        if (type === 'Ok') {
          this.getMintDepositing();
          if (isHand) {
            this.$message.success('Mint pending');
          }
          this.getETHDepositBalance();
        } else {
          const err = (res as { Err: ResultError }).Err;
          if (isHand) {
            this.$message.error(
              JSON.stringify(err, (key, value) =>
                typeof value === 'bigint' ? value.toString(10) : value
              )
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    loading && loading.close();
  }
  private async forge(BTCType: BTCTypeEnum, isHand = true): Promise<void> {
    let loading;
    if (isHand) {
      await checkAuth();
      loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
    }
    try {
      const res = await this.ckBTCMinterService.updateBalance(BTCType);
      console.log(res);
      if (res) {
        const type = Object.keys(res)[0];
        if (type === 'Ok') {
          if (BTCType === BTCTypeEnum.ckBTC) {
            const val = (Object.values(res)[0] as Array<UtxoStatus>) || [];
            let tooSmall = false;
            let checked = false;
            let tainted = false;
            let minted = false;
            for (let i = 0; i < val.length; i++) {
              const utxoStatus = Object.keys(val[i])[0];
              if (utxoStatus === 'ValueTooSmall') {
                tooSmall = true;
              }
              if (utxoStatus === 'Tainted') {
                tainted = true;
              }
              if (utxoStatus === 'Checked') {
                checked = true;
              }
              if (utxoStatus === 'Minted') {
                minted = true;
              }
            }
            // has checked
            if (checked) {
              this.forge(BTCType, isHand);
              return;
            }
            if (!minted && tooSmall) {
              if (isHand) {
                this.$message.error('ValueTooSmall');
              }
              this.setUpdateBlockHeight(BTCType);
              return;
            }
            // only tainted
            if (!minted && tainted) {
              if (isHand) {
                this.$message.error(
                  'The KYT provider considered this UTXO to be tainted.'
                );
              }
              this.setUpdateBlockHeight(BTCType);
              return;
            }
          }
          this.setUpdateBlockHeight(BTCType);
          this.getBalanceInit();
          if (isHand) {
            this.$message.success('Mint success');
          }
          this.refreshCkBTCBalance(BTCType, false);
          if (BTCType === BTCTypeEnum.ckBTC) {
            this.putQuests();
          }
        } else {
          const err = (res as { Err: UpdateBalanceError }).Err;
          const errType = Object.keys(err)[0];
          if (errType === 'NoNewUtxos') {
            this.setUpdateBlockHeight(BTCType);
          }
          if (isHand) {
            this.$message.error(
              JSON.stringify(err, (key, value) =>
                typeof value === 'bigint' ? value.toString(10) : value
              )
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    loading && loading.close();
  }
  private async putQuests(): Promise<void> {
    try {
      await this.questsService.putEvent(
        'ckBTC',
        Principal.fromText(this.getPrincipalId)
      );
    } catch (e) {
      console.log(e);
    }
  }
  private async getETHTransactions(): Promise<void> {
    try {
      const ERC20TokenId = this.icNetworkTokens.tokenId;
      const principal = localStorage.getItem('principal');
      if (principal) {
        const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
        if (!currentInfo.ckETHUpdateBlockHeight) {
          currentInfo.ckETHUpdateBlockHeight = {};
        }
        if (typeof currentInfo.ckETHUpdateBlockHeight === 'number') {
          currentInfo.ckETHUpdateBlockHeight = {};
        }
        if (!currentInfo.ckETHUpdateBlockHeight[ERC20TokenId]) {
          currentInfo.ckETHUpdateBlockHeight[ERC20TokenId] = 0;
        }
        this.updateCkETHBlockHeight[ERC20TokenId] = Number(
          currentInfo.ckETHUpdateBlockHeight[ERC20TokenId]
        );
        console.log(this.updateCkETHBlockHeight);
      }
      const block = await this.getEthBlock();
      console.log(block);
      if (block) {
        this.blockCountETH = parseInt(block.data.result);
      }
      console.log(this.blockCountETH);
      this.ckETHTransactionsPage = 1;
      // this.ckETHTransactionTotal = 0;
      if (this.forgeModalETH) {
        await this.getEThTxs();
      }
    } catch (e) {
      console.log(e);
    }
    this.showCkETHTransactions = false;
  }
  private async getEThTxs(scanNum?: number, retry = 0): Promise<void> {
    try {
      if (!scanNum && scanNum !== 0) {
        scanNum = Math.floor(Math.random() * etherScanKey.length);
        console.log(scanNum);
      } else {
        if (scanNum + 1 >= etherScanKey.length) {
          scanNum = 0;
        } else {
          scanNum += 1;
        }
      }
      let std;
      let res;
      let ERC20Id;
      if (
        typeof this.networkIdMint === 'number' &&
        typeof this.networkIdMintTo === 'number' &&
        typeof this.networkTokenIdMint === 'number' &&
        typeof this.networkTokenIdMintTo === 'number'
      ) {
        std = Object.keys(this.icNetworkTokens.icTokenInfo.std)[0];
        ERC20Id = this.icNetworkTokens.icTokenInfo.tokenId;
      }
      if (std === 'ETH') {
        res = await axios.get(
          `${this.etherscanLink}/api?module=account&action=txlist&address=${this.ETHAddressCk}&startblock=0&endblock=${this.blockCountETH}
&page=1&offset=50&sort=desc&apikey=${etherScanKey[scanNum]}`
        );
      } else {
        res = await axios.get(
          `${this.etherscanLink}/api?module=account&action=tokentx&contractaddress=${ERC20Id}&address=${this.ETHAddressCk}&page=1&offset=50&startblock=0&endblock=${this.blockCountETH}&sort=desc&apikey=${etherScanKey[scanNum]}`
        );
      }
      console.log(res);
      if (res && res.data && res.data.status === '1') {
        this.filterETHTx(res, this.ETHAddressCk);
      } else {
        if (
          res &&
          res.data &&
          res.data.message &&
          res.data.message.includes('No transactions')
        ) {
          this.filterETHTx(res, this.ETHAddressCk);
        } else {
          if (retry < etherScanKey.length) {
            setTimeout(() => {
              this.getEThTxs(scanNum, ++retry);
            }, 1000);
          }
        }
      }
    } catch (e) {
      console.log(e);
      if (retry < etherScanKey.length) {
        setTimeout(() => {
          this.getEThTxs(scanNum, ++retry);
        }, 1000);
      }
    }
  }
  private async getBTCTransactions(BTCType: BTCTypeEnum): Promise<void> {
    try {
      const principal = localStorage.getItem('principal');
      if (principal) {
        const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
        if (BTCType === BTCTypeEnum.icBTC) {
          this.updateBlockHeight = Number(currentInfo.icBTCUpdateBlockHeight);
        } else {
          this.updateCkBlockHeight = Number(currentInfo.ckBTCUpdateBlockHeight);
        }
        console.log(this.updateBlockHeight, this.updateCkBlockHeight);
      }
      const block = await axios.get('https://blockchain.info/q/getblockcount');
      if (block) {
        this.blockCount = block.data;
      }
      console.log(this.blockCount);
      if (BTCType === BTCTypeEnum.icBTC) {
        this.BTCTransactionsPage = 1;
        this.BTCTransactionTotal = 0;
        const res = await axios.get(
          `https://blockstream.info/api/address/${this.BTCAddressIc}/txs`
        );
        this.filterBTCTx(res, BTCType, this.BTCAddressIc);
      } else {
        this.ckBTCTransactionsPage = 1;
        this.ckBTCTransactionTotal = 0;
        const res = await axios.get(
          `https://blockstream.info/api/address/${this.BTCAddressCk}/txs`
        );
        this.filterBTCTx(res, BTCType, this.BTCAddressCk);
      }
    } catch (e) {
      console.log(e);
    }
    this.showBTCTransactions = false;
    this.showCkBTCTransactions = false;
  }
  private filterETHTx(res: any, BTCAddress: string): void {
    const ERC20TokenId = this.icNetworkTokens.tokenId;
    if (res && res.data && res.data.result && res.data.result.length) {
      const txs = res.data.result;
      console.log(txs);
      let hasConfirmedLoading = false;
      let needUpdate = false;
      if (txs && txs.length) {
        for (let i = 0; i < txs.length; i++) {
          const tx = txs[i];
          let minterAddress = this.minterInfo.address;
          const flag =
            tx.to === BTCAddress &&
            tx.from.toLocaleLowerCase() !== minterAddress.toLocaleLowerCase();
          if (flag && this.blockCountETH && Number(tx.blockNumber)) {
            if (
              this.blockCountETH - Number(tx.blockNumber) <
              Number(this.minterInfo.minConfirmations) - 1
            ) {
              hasConfirmedLoading = true;
            }
            const ERC20TokenId = this.icNetworkTokens.tokenId;
            let updateBlockHeight =
              this.updateCkETHBlockHeight[ERC20TokenId] || 0;
            if (
              this.blockCountETH - Number(tx.blockNumber) >=
                Number(this.minterInfo.minConfirmations) - 1 &&
              (Number(tx.blockNumber) > updateBlockHeight || !updateBlockHeight)
            ) {
              needUpdate = true;
            }
          } else if (flag && !Number(tx.blockNumber)) {
            hasConfirmedLoading = true;
          }
          if (!flag) {
            txs.splice(i, 1);
            i--;
          }
        }
      }
      this.ckETHTransactions[ERC20TokenId] = txs;
      this.hasCkETHConfirmedLoading = hasConfirmedLoading;
      console.log(txs);
      this.ckETHTransactionTotal = this.ckETHTransactions[ERC20TokenId].length;
    } else {
      this.ckETHTransactions[ERC20TokenId] = [];
      this.ckETHTransactionTotal = 0;
    }
  }
  private filterBTCTx(
    res: any,
    BTCType: BTCTypeEnum,
    BTCAddress: string
  ): void {
    if (res && res.data) {
      const txs = res.data;
      console.log(txs);
      let hasConfirmedLoading = false;
      let needUpdate = false;
      if (txs && txs.length) {
        for (let i = 0; i < txs.length; i++) {
          const tx = txs[i];
          let input = [];
          let out = [];
          if (tx.vin && tx.vin.length) {
            tx.vin.forEach((val) => {
              if (val.prevout.scriptpubkey_address === BTCAddress) {
                input.push(val);
              }
            });
            if (!input.length) {
              input.push(tx.vin[0]);
            }
            tx.vin = input;
          }
          if (tx.vout && tx.vout.length) {
            tx.vout.forEach((val) => {
              if (val.scriptpubkey_address === BTCAddress) {
                out.push(val);
              }
            });
            if (!out.length) {
              out.push(tx.vout[0]);
            }
            tx.vout = out;
          }
          const flag = out.some((val) => {
            return val.scriptpubkey_address === BTCAddress;
          });
          if (flag && this.blockCount && txs[i].status.block_height) {
            if (
              (BTCType === BTCTypeEnum.icBTC &&
                this.blockCount - txs[i].status.block_height < 5) ||
              (BTCType === BTCTypeEnum.ckBTC &&
                this.blockCount - txs[i].status.block_height < 11)
            ) {
              hasConfirmedLoading = true;
            }
            let updateBlockHeight;
            if (BTCType === BTCTypeEnum.icBTC) {
              updateBlockHeight = this.updateBlockHeight;
            } else {
              updateBlockHeight = this.updateCkBlockHeight;
            }
            // todo Synchronized Blocks
            if (
              ((BTCType === BTCTypeEnum.icBTC &&
                this.blockCount - txs[i].status.block_height >= 6) ||
                (BTCType === BTCTypeEnum.ckBTC &&
                  this.blockCount - txs[i].status.block_height >= 12)) &&
              (txs[i].status.block_height > updateBlockHeight ||
                !updateBlockHeight)
            ) {
              needUpdate = true;
            }
          } else if (flag && !txs[i].status.block_height) {
            hasConfirmedLoading = true;
          }
          if (!flag) {
            txs.splice(i, 1);
            i--;
          }
        }
      }
      if (BTCType === BTCTypeEnum.icBTC) {
        this.BTCTransactions = txs;
        this.hasConfirmedLoading = hasConfirmedLoading;
      } else {
        this.ckBTCTransactions = txs;
        this.hasCkConfirmedLoading = hasConfirmedLoading;
      }
      console.log(needUpdate, BTCType);
      // if (needUpdate) {
      //   this.forge(BTCType, false);
      //   this.setUpdateBlockHeight(BTCType);
      // }
      console.log(txs);
      if (BTCType === BTCTypeEnum.icBTC) {
        this.BTCTransactionTotal = this.BTCTransactions.length;
      } else {
        this.ckBTCTransactionTotal = this.ckBTCTransactions.length;
      }
    }
  }
  private async getInfo(BTCType: BTCTypeEnum): Promise<string> {
    if (BTCType === BTCTypeEnum.icBTC) {
      const res = await this.ckBTCMinterService.info(BTCType);
      console.log(res);
      return res.version;
    } else {
      return '1.0';
    }
  }
  private async getETHAddress(version: string): Promise<void> {
    if (!this.ETHAddressCk) {
      this.ETHAddressCk = await this.ckETHMinterService.getEthAddress();
      if (version && this.ETHAddressCk) {
        const principal = localStorage.getItem('principal');
        if (principal) {
          const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
          currentInfo.ckETHAddress = `${IC_ETH_MINTER_CANISTER_ID}-${version}-${this.ETHAddressCk}`;
          localStorage.setItem(principal, JSON.stringify(currentInfo));
        }
      }
    }
    QRCode.toDataURL(this.ETHAddressCk, {
      width: 120
    }).then((res) => {
      this.ckETHAccountCode = res;
    });
  }
  private async getBTCAddress(
    version: string,
    BTCType: BTCTypeEnum
  ): Promise<void> {
    try {
      if (
        (BTCType === BTCTypeEnum.icBTC && !this.BTCAddressIc) ||
        (BTCType === BTCTypeEnum.ckBTC && !this.BTCAddressCk)
      ) {
        const btcAddress = await this.ckBTCMinterService.getBtcAddress(BTCType);
        console.log(btcAddress);
        if (BTCType === BTCTypeEnum.icBTC) {
          this.BTCAddressIc = btcAddress;
        } else {
          this.BTCAddressCk = btcAddress;
        }
        if (version && btcAddress) {
          const principal = localStorage.getItem('principal');
          if (principal) {
            const currentInfo =
              JSON.parse(localStorage.getItem(principal)) || {};
            if (BTCType === BTCTypeEnum.icBTC) {
              currentInfo.icBTCAddress = `${IC_BTC_MINTER_CANISTER_ID}-${version}-${btcAddress}`;
            } else {
              currentInfo.ckBTCAddress = `${CK_BTC_MINTER_CANISTER_ID}-${version}-${btcAddress}`;
            }
            localStorage.setItem(principal, JSON.stringify(currentInfo));
          }
        }
      }
    } catch (e) {
      if (BTCType === BTCTypeEnum.icBTC) {
        this.showBTCTransactions = false;
      } else {
        this.showCkBTCTransactions = false;
      }
      console.log(e);
    }
    if (this.BTCAddressCk) {
      QRCode.toDataURL(this.BTCAddressCk, {
        width: 120
      }).then((res) => {
        this.accountCode = res;
      });
    }
    if (this.BTCAddressIc) {
      QRCode.toDataURL(this.BTCAddressIc, {
        width: 120
      }).then((res) => {
        this.icAccountCode = res;
      });
    }
  }
  private async getWithdrawalAccount(version: string): Promise<void> {
    if (!this.withdrawalAccount) {
      this.withdrawalAccount =
        await this.ckBTCMinterService.getWithdrawalAccount(this.BTCType);
      if (version && this.withdrawalAccount) {
        const principal = localStorage.getItem('principal');
        if (principal) {
          const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
          const withdrawalAccount = {
            owner: this.withdrawalAccount.owner.toString(),
            subaccount: [Array.from(this.withdrawalAccount.subaccount[0])]
          };
          if (this.BTCType === BTCTypeEnum.icBTC) {
            currentInfo.icBTCWithdrawalAccount = `${IC_BTC_MINTER_CANISTER_ID}-${version}-${JSON.stringify(
              withdrawalAccount
            )}`;
          } else {
            currentInfo.ckBTCWithdrawalAccount = `${CK_BTC_MINTER_CANISTER_ID}-${version}-${JSON.stringify(
              withdrawalAccount
            )}`;
          }
          localStorage.setItem(principal, JSON.stringify(currentInfo));
        }
      }
    }
    if (this.BTCType === BTCTypeEnum.icBTC) {
      try {
        const info = await this.ckBTCMinterService.info(this.BTCType);
        console.log(info);
        this.btcRetrieveFee = info.btcRetrieveFee;
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const res = await this.ckBTCMinterService.estimate_fee(this.BTCType);
        console.log(res);
        this.btcRetrieveFee = res;
      } catch (e) {
        console.log(e);
      }
    }
    this.getDissolveBalance();
  }
  private async getDissolveBalance(): Promise<void> {
    if (this.withdrawalAccount) {
      let tokenId;
      let retrieve_btc_min_amount;
      if (this.BTCType === BTCTypeEnum.icBTC) {
        tokenId = IC_BTC_CANISTER_ID;
        retrieve_btc_min_amount = 20000;
      } else {
        tokenId = CK_BTC_CANISTER_ID;
        retrieve_btc_min_amount = 100000;
      }
      this.clearTime();
      this.dissolveBalance = await getDepositing(
        { icrc1: null },
        tokenId,
        this.withdrawalAccount
      );
      this.canRetrieve = new BigNumber(this.dissolveBalance).gte(
        retrieve_btc_min_amount
      );
      this.balanceTimer = window.setInterval(() => {
        setTimeout(async () => {
          if (!this.getCheckAuth) {
            this.dissolveBalance = await getDepositing(
              { icrc1: null },
              tokenId,
              this.withdrawalAccount
            );
            this.refreshCkBTCBalance(this.BTCType, false);
            this.canRetrieve = new BigNumber(this.dissolveBalance).gte(
              retrieve_btc_min_amount
            );
          }
        });
      }, 3000);
    }
  }
  private async getRetrieveBtcStatus(
    blockIndex: string
  ): Promise<RetrieveBtcStatus> {
    try {
      return await this.ckBTCMinterService.retrieveBtcStatus(
        this.BTCType,
        BigInt(blockIndex)
      );
    } catch (e) {
      console.log(e);
    }
  }
  private initTransactions(): void {
    if (this.BTCType === BTCTypeEnum.icBTC) {
      this.showBTCTransactions = true;
    } else {
      this.showCkBTCTransactions = true;
    }
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      if (
        currentInfo.tokensBalance &&
        currentInfo.tokensBalance[IC_BTC_CANISTER_ID]
      ) {
        this.icBTCBalance = currentInfo.tokensBalance[IC_BTC_CANISTER_ID];
      }
      if (
        currentInfo.tokensBalance &&
        currentInfo.tokensBalance[CK_BTC_CANISTER_ID]
      ) {
        this.ckBTCBalance = currentInfo.tokensBalance[CK_BTC_CANISTER_ID];
      }
      if (this.icNetworkTokens) {
        const ERC20TokenId = this.icNetworkTokens.tokenId;
        if (
          currentInfo.tokensBalance &&
          currentInfo.tokensBalance[ERC20TokenId]
        ) {
          this.$set(
            this.ERC20Balance,
            ERC20TokenId,
            currentInfo.tokensBalance[ERC20TokenId]
          );
        }
      }
      this.getTransactions();
    }
  }
  private hasShowWarning(type: string): void {
    const hasShowWarning = this.$cookies.get('ckBTCTip');
    if (hasShowWarning) {
      if (type === 'forge') {
        if (this.BTCType === BTCTypeEnum.icBTC) {
          this.forgeTitle = 'Mint: BTC -> icBTC';
        } else {
          this.forgeTitle = 'Mint: BTC -> ckBTC';
        }
        this.forgeModal = true;
        this.initTransactions();
      }
      if (type === 'dissolve') {
        if (this.BTCType === BTCTypeEnum.icBTC) {
          this.dissolveTitle = 'Retrieve: icBTC -> BTC';
        } else {
          this.dissolveTitle = 'Retrieve: ckBTC -> BTC';
        }
        this.dissolveModal = true;
        this.initTransactions();
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      this.$confirm({
        title: 'Warning',
        content:
          'This is a new feature on the IC network and may have undetected flaws. You assume all results and risks arising from this operation, please be knowledgeable and participate voluntarily.',
        class: 'connect-plug warning-confirm',
        icon: 'connect-plug',
        centered: true,
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk() {
          that.$cookies.set('ckBTCTip', true, '36000d');
          if (type === 'forge') {
            that.forgeModal = true;
            that.initTransactions();
          }
          if (type === 'dissolve') {
            that.dissolveModal = true;
            that.initTransactions();
          }
        }
      });
    }
  }
  private async refreshCkETHBalance(
    isRefresh = true,
    std = 'DRC20'
  ): Promise<void> {
    if (isRefresh) {
      this.refreshCkETHBalanceLoading = true;
    }
    try {
      const ERC20TokenId = this.icNetworkTokens.tokenId;
      if (ERC20TokenId) {
        const balance = await getTokenBalance({ icrc1: null }, ERC20TokenId);
        this.$set(this.ERC20Balance, ERC20TokenId, balance);
        this.toAddToken(std);
      }
      if (isRefresh) {
        this.refreshCkETHBalanceLoading = false;
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async toAddToken(std = 'DRC20'): Promise<void> {
    const ERC20TokenId = this.icNetworkTokens.tokenId;
    if (ERC20TokenId) {
      if (
        this.ERC20Balance[ERC20TokenId] &&
        new BigNumber(this.ERC20Balance[ERC20TokenId]).gt(0)
      ) {
        try {
          const tokens = await this.ICLighthouseService.getTokens();
          // check token is added
          const flag = tokens.some(
            (token) => token.canisterId.toString() === ERC20TokenId
          );
          if (flag) {
            return;
          }
          let name = '';
          if (std === 'DRC20') {
            name = await this.DRC20TokenService.name(ERC20TokenId);
          } else if (std === 'ICRC-1' || std === 'ICRC-2') {
            name = await this.DRC20TokenService.icrcName(ERC20TokenId);
          }
          await this.ICLighthouseService.addToken(
            Principal.from(ERC20TokenId),
            this.icNetworkTokens.symbol,
            name,
            this.icNetworkTokens.icTokenInfo.decimals,
            std,
            {
              add: null
            }
          );
          this.$emit('addTokenSuccess');
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
  private async refreshCkBTCBalance(
    type: string,
    isRefresh = true
  ): Promise<void> {
    if (isRefresh) {
      if (type === BTCTypeEnum.icBTC) {
        this.refreshIcBTCBalanceLoading = true;
      } else {
        this.refreshCkBTCBalanceLoading = true;
      }
    }
    try {
      let tokenId;
      if (type === BTCTypeEnum.icBTC) {
        tokenId = IC_BTC_CANISTER_ID;
      } else {
        tokenId = CK_BTC_CANISTER_ID;
      }
      const balance = await getTokenBalance({ icrc1: null }, tokenId);
      if (type === BTCTypeEnum.icBTC) {
        this.icBTCBalance = balance;
      } else {
        this.ckBTCBalance = balance;
      }
    } catch (e) {
      console.log(e);
    }
    if (isRefresh) {
      if (type === BTCTypeEnum.icBTC) {
        this.refreshIcBTCBalanceLoading = false;
      } else {
        this.refreshCkBTCBalanceLoading = false;
      }
    }
  }
  private showApprove(type: BTCTypeEnum): void {
    this.BTCType = type;
    this.getBalance();
    const approveTokenInfo = this.tokens[LEDGER_CANISTER_ID] || {
      name: 'ICP',
      symbol: 'ICP',
      decimals: 8,
      fee: '10000',
      totalSupply: null,
      logo: null,
      tokenStd: { icp: null }
    };
    this.$refs.approveIcrc2.init(approveTokenInfo);
  }
  private showTransfer(type: BTCTypeEnum): void {
    this.BTCType = type;
    this.getBalance();
    this.$refs.transferIcp.visibleTransfer = true;
  }
  private showReceive(showAccount = true, type: BTCTypeEnum): void {
    this.BTCType = type;
    this.$refs.receiveModal.init(showAccount);
    this.$refs.receiveModal.principal = this.principal;
    this.$refs.receiveModal.visibleReceive = true;
  }
  private async refreshBalance(): Promise<void> {
    if (!this.refreshBalanceLoading) {
      this.refreshBalanceLoading = true;
      try {
        await this.getBalance();
      } catch (e) {
        console.log(e);
      }
      this.refreshBalanceLoading = false;
    }
  }
  private showTopUp(walletId?: PrincipalString): void {
    if (walletId && typeof walletId === 'string') {
      this.topUpType = 'topUpWallet';
      this.$refs.topUp.topUpForm.to = walletId;
    } else {
      this.topUpType = '';
      this.$refs.topUp.topUpForm.to = '';
    }
    this.getBalance();
    this.$refs.topUp.visibleTopUp = true;
  }
  private async topUpSuccess(): Promise<void> {
    this.getBalance();
    this.$emit('topUpSuccess');
  }
  private approveIcrc2Success(): void {
    this.getBalance();
  }
  private async transferTokenSuccess(): Promise<void> {
    try {
      this.getCkBTCBalance();
    } catch (e) {
      console.log(e);
    }
  }
  public async transferSuccess(): Promise<void> {
    this.getBalance();
  }
  private afterClose(): void {
    this.BTCType = null;
    (this.$refs as any).form && (this.$refs as any).form.resetFields();
    (this.$refs as any).retrieveForm &&
      (this.$refs as any).retrieveForm.resetFields();
    this.clearTime();
    window.clearInterval(this.updateRetrieveBtcStatusTimer);
    this.updateRetrieveBtcStatusTimer = null;
    window.clearInterval(this.updateRetrieveBtcSubmittedStatusTimer);
    this.updateRetrieveBtcSubmittedStatusTimer = null;
    this.retrieveStep = 1;
    this.retrieveEvent = [];
    this.withdrawalAccount = null;
  }
  private afterForgeClose(): void {
    this.BTCType = null;
    window.clearInterval(this.btcTimer);
    this.btcTimer = null;
    this.clearTime();
    this.mintStep = 1;
    this.mintEvent = [];
  }
  private afterRetrieveCloseCKETH(): void {
    this.retrieveStep = 1;
    this.ckETHMintPage = 1;
    (this.$refs as any).ethDissolveFormCK &&
      (this.$refs as any).ethDissolveFormCK.resetFields();
    window.clearInterval(this.ckETHTimer);
    this.ckETHTimer = null;
  }
  private afterForgeCloseCKETH(): void {
    this.mintStep = 1;
    this.ckETHMintPage = 1;
    (this.$refs as any).erc20Form &&
      (this.$refs as any).erc20Form.resetFields();
    window.clearInterval(this.ckETHTimer);
    this.ckETHTimer = null;
  }
  private afterForgeCloseETH(): void {
    try {
      this.mintStep = 1;
      this.mintEvent = [];
      this.retrieveStep = 1;
      this.claimTxError = '';
      (this.$refs as any).ethForm && (this.$refs as any).ethForm.resetFields();
      (this.$refs as any).ethRetrieveForm &&
        (this.$refs as any).ethRetrieveForm.resetFields();
      (this.$refs as any).erc20Form &&
        (this.$refs as any).erc20Form.resetFields();
      if ((this.$refs as any).signatureForm) {
        (this.$refs as any).signatureForm.resetFields();
        this.signatureForm.txHash = '';
      }
    } catch (e) {
      console.log(e);
    }
    window.clearInterval(this.updateRetrieveETHStatusTimer);
    this.updateRetrieveETHStatusTimer = null;
    window.clearInterval(this.updateDepositETHStatusTimer);
    this.updateDepositETHStatusTimer = null;
    window.clearInterval(this.btcTimer);
    this.btcTimer = null;
    if (this.txReceiptTimer) {
      window.clearInterval(this.txReceiptTimer);
      this.txReceiptTimer = null;
    }
    this.clearTime();
    this.depositingInfo = null;
    this.depositInfo = [];
    this.depositing = [];
  }
  private clearTime(): void {
    window.clearInterval(this.balanceTimer);
    this.balanceTimer = null;
    window.clearInterval(this.btcTxTimer);
    this.btcTxTimer = null;
  }
  private validateIcBTCAddress(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    if (value && this.BTCType === BTCTypeEnum.icBTC && !value.startsWith('1')) {
      callback('icBTC only supports P2PKH addresses');
    } else {
      callback();
    }
  }
  private validateAmountCKETH(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    if (
      typeof this.networkIdMint === 'number' &&
      typeof this.networkIdMintTo === 'number' &&
      typeof this.networkTokenIdMint === 'number' &&
      typeof this.networkTokenIdMintTo === 'number'
    ) {
      const erc20TokenInfo = this.icNetworkTokens.icTokenInfo;
      const ERC20TokenId = this.icNetworkTokens.tokenId;
      const std = Object.keys(erc20TokenInfo.std)[0];
      let total;
      let fee;
      let decimals;
      if (ERC20TokenId) {
        if (std === 'ERC20') {
          //
        }
        decimals = this.tokens[ERC20TokenId].decimals;
        total = this.ERC20Balance[ERC20TokenId];
        fee = new BigNumber(this.tokens[ERC20TokenId].fee.toString(10))
          .div(10 ** decimals)
          .toString(10);
      }
      const min = Number(
        new BigNumber(total)
          .div(10 ** decimals)
          .minus(fee)
          .minus(value)
          .toString(10)
      );
      let retrieve_eth_min_amount = new BigNumber(
        this.icNetworkTokens.icTokenInfo.minAmount.toString(10)
      )
        .div(10 ** decimals)
        .decimalPlaces(8)
        .toString(10);
      if (value && min < 0) {
        callback(
          `Insufficient ${this.icNetworkTokens.symbol} (${
            networkIds[this.icNetworkTokens.networkId]
          })`
        );
      } else if (new BigNumber(value).lt(retrieve_eth_min_amount)) {
        callback(
          `Min amount is ${retrieve_eth_min_amount} ${
            this.icNetworkTokens.symbol
          } (${networkIds[this.icNetworkTokens.networkId]})`
        );
      } else {
        callback();
      }
    }
  }
  private validateAmountETH(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    if (
      typeof this.networkIdMint === 'number' &&
      typeof this.networkIdMintTo === 'number' &&
      typeof this.networkTokenIdMint === 'number' &&
      typeof this.networkTokenIdMintTo === 'number'
    ) {
      const erc20TokenInfo = this.icNetworkTokens.icTokenInfo;
      const ERC20TokenId = this.icNetworkTokens.tokenId;
      const std = Object.keys(erc20TokenInfo.std)[0];
      let total;
      let fee;
      let retrieve_eth_min_amount;
      let decimals;
      if (ERC20TokenId) {
        let estimatedFee = '0';
        if (std === 'ERC20') {
          estimatedFee = new BigNumber(erc20TokenInfo.fee.gasLimit.toString(10))
            .plus(this.ethTokenInfo.fee.gasLimit.toString(10))
            .times(this.minterInfo.gasPrice.toString(10))
            .plus(erc20TokenInfo.fee.fixedFee.toString(10))
            .times(erc20TokenInfo.fee.ethRatio.toString(10))
            .div(1000000000)
            .div(10 ** erc20TokenInfo.decimals)
            .toString(10);
        }
        decimals = this.tokens[ERC20TokenId].decimals;
        total = this.ERC20Balance[ERC20TokenId];
        fee = new BigNumber(this.tokens[ERC20TokenId].fee.toString(10))
          .div(10 ** decimals)
          .toString(10);
        retrieve_eth_min_amount = new BigNumber(
          this.icNetworkTokens.icTokenInfo.minAmount.toString(10)
        )
          .div(10 ** decimals)
          .plus(estimatedFee)
          .decimalPlaces(8)
          .toString(10);
      }
      const min = Number(
        new BigNumber(total)
          .div(10 ** decimals)
          .minus(fee)
          .minus(value)
          .toString(10)
      );
      if (value && min < 0) {
        callback(
          `Insufficient ${this.icNetworkTokens.symbol} (${
            networkIds[this.icNetworkTokens.networkId]
          })`
        );
      } else if (new BigNumber(value).lt(retrieve_eth_min_amount)) {
        callback(
          `Min amount is ${retrieve_eth_min_amount} ${
            this.icNetworkTokens.symbol
          } (${networkIds[this.icNetworkTokens.networkId]})`
        );
      } else {
        callback();
      }
    }
  }
  private validateErc20Amount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    const erc20TokenInfo = this.icNetworkTokens.icTokenInfo;
    const minAmount = new BigNumber(erc20TokenInfo.minAmount.toString(10))
      .div(10 ** erc20TokenInfo.decimals)
      .toString(10);
    const std = Object.keys(erc20TokenInfo.std)[0];
    let fee = '0';
    if (std === 'ERC20') {
      if (this.depositMethod === 1) {
        fee = this.filterEstimatedFee(
          erc20TokenInfo,
          this.ethTokenInfo,
          this.minterInfo
        );
      }
      if (this.depositMethod === 2) {
        fee = this.filterEstimatedFeeMode2(erc20TokenInfo);
      }
    }
    const minAmountFee = new BigNumber(fee).plus(minAmount);
    if (value && new BigNumber(value).lt(minAmountFee)) {
      callback(
        `Min amount is ${minAmountFee} ${
          this.icNetworkTokens.icTokenInfo.symbol
        } (${this.networkIds[this.otherNetworkTokens.networkId]})`
      );
    } else {
      callback();
    }
  }
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    let fee;
    let total;
    let retrieve_btc_min_amount;
    if (this.BTCType === BTCTypeEnum.icBTC) {
      fee = this.icBTCFee;
      total = this.icBTCBalance;
      // todo
      retrieve_btc_min_amount = new BigNumber(0.0002).toString(10);
    } else {
      fee = this.ckBTCFee;
      total = this.ckBTCBalance;
      // todo
      retrieve_btc_min_amount = new BigNumber(0.001).toString(10);
    }
    const min = Number(
      new BigNumber(total)
        .div(10 ** 8)
        .minus(fee)
        .minus(value)
        .toString(10)
    );
    if (value && min < 0) {
      callback(`Insufficient ${this.BTCType}`);
    } else if (new BigNumber(value).lt(retrieve_btc_min_amount)) {
      callback(`Min amount is ${retrieve_btc_min_amount} ${this.BTCType}`);
    } else {
      if (this.BTCType === BTCTypeEnum.icBTC) {
        const max = new BigNumber(0.05).toString(10);
        if (new BigNumber(value).gt(max)) {
          callback(`Max amount is ${max} ${this.BTCType}`);
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
  }
  private getRetrieveBtcTxid(val: RetrieveBtcStatus): string {
    if (val) {
      const status = Object.keys(val)[0];
      const hasTxid = ['Submitted', 'Sending', 'Confirmed'];
      if (hasTxid.includes(status)) {
        let txid = JSON.parse(JSON.stringify(Object.values(val)[0].txid));
        if (this.BTCType === BTCTypeEnum.ckBTC && txid && txid.length) {
          txid = txid.reverse();
        }
        return toHexString(new Uint8Array(txid));
      }
    }
    return null;
  }
  private isMetaMaskInstalled(): boolean {
    //Have to check the ethereum binding on the window object to see if it's installed
    return Boolean(ethereum && ethereum.isMetaMask);
  }
  private installMetaMask(): void {
    const forwarderOrigin = 'https://fwd.metamask.io';
    //We create a new MetaMask onboarding object to use in our app
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    //This will start the onboarding proccess
    onboarding.startOnboarding();
  }
  private previousMintStepCK(): void {
    if (this.mintStep > 1) {
      this.changeMintStepCK(this.mintStep - 1);
    }
  }
  private nextMintStepCK(max: number): void {
    if (this.mintStep < max) {
      this.changeMintStepCK(this.mintStep + 1);
    }
  }
  private changeMintStepCK(step: number): void {
    this.mintStep = step;
    this.pendingLoading = false;
    if ((this.$refs as any).erc20Form) {
      (this.$refs as any).erc20Form.resetFields();
    }
  }
  private previousMintStep(): void {
    if (this.mintStep > 1) {
      this.changeMintStep(this.mintStep - 1);
    }
  }
  private nextMintStep(max: number): void {
    if (this.mintStep < max) {
      this.changeMintStep(this.mintStep + 1);
    }
  }
  private previousRetrieveStep(): void {
    if (this.retrieveStep > 1) {
      this.changeRetrieveStep(this.retrieveStep - 1);
    }
  }
  private nextRetrieveStep(max: number): void {
    if (this.retrieveStep < max) {
      this.changeRetrieveStep(this.retrieveStep + 1);
    }
  }
  private previousRetrieveStepCK(): void {
    if (this.retrieveStep > 1) {
      this.changeRetrieveStepCK(this.retrieveStep - 1);
    }
  }
  private nextRetrieveStepCK(max: number): void {
    if (this.retrieveStep < max) {
      this.changeRetrieveStepCK(this.retrieveStep + 1);
    }
  }
  private changeRetrieveStepCK(step: number): void {
    this.retrieveStep = step;
    if (step === 3) {
      this.retrieveEventPage = 1;
    }
  }
  private changeMintStep(step: number): void {
    this.mintStep = step;
    this.pendingLoading = false;
    if ((this.$refs as any).erc20Form) {
      (this.$refs as any).erc20Form.resetFields();
    }
    // if ((this.$refs as any).signatureForm) {
    //   (this.$refs as any).signatureForm.resetFields();
    // }
    if (!this.BTCType && step === 2) {
      this.depositInfoPage = 1;
    }
    if (!this.BTCType && step === 3) {
      this.mintEventPage = 1;
      this.getAccountEvents();
    }
  }
  private changeRetrieveStep(step: number): void {
    this.retrieveStep = step;
    if (step === 3) {
      this.retrieveEventPage = 1;
      this.getAccountEvents();
    }
  }
  private transferFromOther(): void {
    (this.$refs as any).erc20Form.validate(async (valid: any) => {
      if (valid) {
        this.showEthAddressCode = true;
        this.setMintPending();
      }
    });
  }
  private transferFromMetaMaskCK(): void {
    (this.$refs as any).erc20Form.validate(async (valid: any) => {
      if (valid) {
        if (!this.isMetaMaskInstalled()) {
          this.metaMaskVisible = true;
        } else {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          try {
            const ethChainId = '0x1';
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            if (chainId !== ethChainId) {
              await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethChainId }]
              });
            }
            const accounts: string[] = await ethereum.request({
              method: 'eth_requestAccounts'
            });
            console.log(accounts);
            const contractId = this.smartContractAddress;
            const amount =
              '0x' +
              new BigNumber(this.erc20Form.amount).times(10 ** 18).toString(16);
            const _principalHex = principalToBytes32(this.getPrincipalId);
            const web3 = new Web3();
            const ethContract = new web3.eth.Contract(ethAbi, contractId);
            const contractData = ethContract.methods
              .deposit(_principalHex)
              .encodeABI();
            console.log(amount, _principalHex);
            const sendTransactionRes = await ethereum.request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: accounts[0],
                  to: contractId,
                  value: amount,
                  data: contractData
                }
              ]
            });
            console.log(sendTransactionRes);
            const amountMint = new BigNumber(this.erc20Form.amount)
              .times(10 ** 18)
              .toString(10);
            this.ckETHMint.unshift({
              txHash: sendTransactionRes,
              amount: amountMint,
              blockNum: ''
            });
            const currentInfo =
              JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
            if (!currentInfo['ckETHMint-' + this.icNetworkTokens.id]) {
              currentInfo['ckETHMint-' + this.icNetworkTokens.id] = {};
            }
            currentInfo['ckETHMint-' + this.icNetworkTokens.id][
              this.icNetworkTokens.tokenId
            ] = this.ckETHMint;
            localStorage.setItem(
              this.getPrincipalId,
              JSON.stringify(currentInfo)
            );
            this.changeMintStepCK(2);
            this.onGetMintCKETHPending();
          } catch (e) {
            console.error(e);
            if (e.code !== 4001) {
              this.$message.error(e.message);
            }
          }
          loading.close();
        }
      }
    });
  }
  private async transferFromMetaMask(): Promise<void> {
    (this.$refs as any).erc20Form.validate(async (valid: any) => {
      if (valid) {
        if (!this.isMetaMaskInstalled()) {
          this.metaMaskVisible = true;
        } else {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          try {
            if (this.depositMethod === 1 && !this.ETHAddressCk) {
              this.ETHAddress('1.0');
              await this.getETHAddress('1.0');
            }
            let toAddress = this.ETHAddressCk;
            if (this.depositMethod === 2) {
              toAddress = this.minterInfo.address;
            }
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            let ethChainId = '0x1';
            if (Number(this.minterInfo.chainId) === 5) {
              ethChainId = '0x5';
            }
            if (chainId !== ethChainId) {
              await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethChainId }]
              });
            }
            const accounts: string[] = await ethereum.request({
              method: 'eth_requestAccounts'
            });
            console.log(accounts);
            const value =
              '0x' +
              new BigNumber(this.erc20Form.amount)
                .times(10 ** this.icNetworkTokens.icTokenInfo.decimals)
                .toString(16);
            const std = Object.keys(this.icNetworkTokens.icTokenInfo.std)[0];
            let sendTransactionRes;
            if (std === 'ETH') {
              sendTransactionRes = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                  {
                    from: accounts[0],
                    to: toAddress,
                    value: value
                  }
                ]
              });
            } else {
              console.log(value);
              const web3 = new Web3();
              const erc20Contract = new web3.eth.Contract(
                abi,
                this.icNetworkTokens.icTokenInfo.tokenId
              );
              const contractData = erc20Contract.methods
                .transfer(toAddress, value)
                .encodeABI();
              sendTransactionRes = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                  {
                    from: accounts[0],
                    to: this.icNetworkTokens.icTokenInfo.tokenId,
                    data: contractData
                  }
                ]
              });
            }
            console.log(sendTransactionRes);
            this.changeMintStep(2);
            if (this.depositMethod === 2) {
              const depositInfo = this.getDepositInfo();
              const now = new Date().getTime();
              depositInfo.unshift([sendTransactionRes, false, false, now]);
              this.setDepositInfo(depositInfo);
              this.onGetClaimPending();
              this.depositInfo = this.getDepositInfo();
              this.signatureForm.txHash = sendTransactionRes;
              this.txHashChange();
            } else if (this.depositMethod === 1) {
              this.setMintPending();
              this.pendingLoading = true;
              this.$message.warning(
                'Please wait for the transaction to be confirmed and then click the "Mint" button.',
                6
              );
            }
          } catch (e) {
            console.error(e);
            if (e.code !== 4001) {
              this.$message.error(e.message);
            }
          }
          loading.close();
        }
      }
    });
  }
  private updateMintPending(): void {
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    const key = IC_ETH_MINTER_CANISTER_ID + ethVersion;
    const current = `${this.icNetworkTokens.icTokenInfo.ckLedgerId.toString()}&${
      this.icNetworkTokens.icTokenInfo.tokenId
    }`;
    if (
      currentInfo.ckETHMintPending &&
      currentInfo.ckETHMintPending[key] &&
      currentInfo.ckETHMintPending[key].length
    ) {
      const index = currentInfo.ckETHMintPending[key].indexOf(current);
      if (index > -1) {
        currentInfo.ckETHMintPending[key].splice(index, 1);
        console.log(index);
        console.log(currentInfo.ckETHMintPending[key]);
        localStorage.setItem(principal, JSON.stringify(currentInfo));
        this.onGetMintPending();
      }
    }
  }
  private async setRetrievePending(): Promise<void> {
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    const key = IC_ETH_MINTER_CANISTER_ID + ethVersion;
    const ERC20TokenId = this.icNetworkTokens.tokenId;
    if (ERC20TokenId) {
      this.initETHWithdrawalAccount();
      if (!this.ckETHWithdrawalAccount) {
        this.ckETHWithdrawalAccount =
          await this.ckETHMinterService.getWithdrawalAccount();
      }
      getDepositing(
        { icrc1: null },
        ERC20TokenId,
        this.ckETHWithdrawalAccount
      ).then((res) => {
        console.log(res);
        if (!currentInfo.ckETHRetrievePending) {
          currentInfo.ckETHRetrievePending = {};
        }
        if (!currentInfo.ckETHRetrievePending[key]) {
          currentInfo.ckETHRetrievePending[key] = {};
        }
        currentInfo.ckETHRetrievePending[key][
          this.icNetworkTokens.icTokenInfo.ckLedgerId.toString()
        ] = res;
        localStorage.setItem(principal, JSON.stringify(currentInfo));
        this.onGetRetrievePending();
      });
    }
  }
  private async removeRetrievePending(): Promise<void> {
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    const key = IC_ETH_MINTER_CANISTER_ID + ethVersion;
    const ERC20TokenId = this.icNetworkTokens.tokenId;
    if (ERC20TokenId) {
      if (
        currentInfo.ckETHRetrievePending &&
        currentInfo.ckETHRetrievePending[key] &&
        currentInfo.ckETHRetrievePending[key][
          this.icNetworkTokens.icTokenInfo.ckLedgerId.toString()
        ]
      ) {
        delete currentInfo.ckETHRetrievePending[key][
          this.icNetworkTokens.icTokenInfo.ckLedgerId.toString()
        ];
        localStorage.setItem(principal, JSON.stringify(currentInfo));
        this.onGetRetrievePending();
      }
    }
  }
  private setMintPending(): void {
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    const key = IC_ETH_MINTER_CANISTER_ID + ethVersion;
    if (!currentInfo.ckETHMintPending) {
      currentInfo.ckETHMintPending = {};
    }
    const current = `${this.icNetworkTokens.icTokenInfo.ckLedgerId.toString()}&${
      this.icNetworkTokens.icTokenInfo.tokenId
    }`;
    if (
      !currentInfo.ckETHMintPending[key] ||
      (currentInfo.ckETHMintPending[key] &&
        !currentInfo.ckETHMintPending[key].length)
    ) {
      currentInfo.ckETHMintPending[key] = [current];
      localStorage.setItem(principal, JSON.stringify(currentInfo));
    } else if (
      currentInfo.ckETHMintPending[key] &&
      currentInfo.ckETHMintPending[key].length &&
      !currentInfo.ckETHMintPending[key].includes(current)
    ) {
      currentInfo.ckETHMintPending[key].push(current);
      localStorage.setItem(principal, JSON.stringify(currentInfo));
    }
    this.onGetMintPending();
  }
  private setDepositInfo(
    depositInfo: Array<[string, boolean?, boolean?, number?]>
  ): void {
    const ERC20TokenId = this.icNetworkTokens.tokenId;
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    if (!currentInfo.depositInfo) {
      currentInfo.depositInfo = {};
    }
    currentInfo.depositInfo[
      IC_ETH_MINTER_CANISTER_ID + ethVersion + ERC20TokenId
    ] = depositInfo;
    localStorage.setItem(principal, JSON.stringify(currentInfo));
  }
  private getDepositInfo(): Array<[string, boolean?, boolean?, number?]> {
    const ERC20TokenId = this.icNetworkTokens.tokenId;
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    if (!currentInfo.depositInfo) {
      currentInfo.depositInfo = {};
    }
    return (
      currentInfo.depositInfo[
        IC_ETH_MINTER_CANISTER_ID + ethVersion + ERC20TokenId
      ] || []
    );
  }
  private txHashChange(): void {
    console.log('txHashChange');
    const web3 = new Web3();
    const hash = this.signatureForm.txHash.trim();
    if (web3.utils.isHexStrict(hash) && hash.length === 66) {
      this.getTxReceipt(hash);
    } else {
      if (this.txReceiptTimer) {
        window.clearInterval(this.txReceiptTimer);
        this.txReceiptTimer = null;
      }
      if (hash) {
        this.claimTxError = 'Invalid txHash';
      } else {
        this.claimTxError = '';
      }
    }
  }
  private getTxReceipt(hash: string): void {
    if (this.txReceiptTimer) {
      window.clearInterval(this.txReceiptTimer);
      this.txReceiptTimer = null;
    }
    this.checkTxReceipt(hash);
    this.txReceiptTimer = window.setInterval(async () => {
      this.checkTxReceipt(hash);
    }, 60 * 1000);
  }
  private async checkTxReceipt(hash: string): Promise<void> {
    const resReceipt = await this.getEthTransactionReceipt(hash);
    console.log(resReceipt);
    if (resReceipt && resReceipt.data.result) {
      window.clearInterval(this.txReceiptTimer);
      this.txReceiptTimer = null;
      const std = Object.keys(this.icNetworkTokens.icTokenInfo.std)[0];
      let to;
      let amount = '0';
      if (std === 'ERC20') {
        if (
          !(
            resReceipt.data.result.logs.length &&
            resReceipt.data.result.logs[0].address.toLocaleLowerCase() ===
              this.icNetworkTokens.icTokenInfo.tokenId.toLocaleLowerCase()
          )
        ) {
          this.claimTxError = 'Invalid transaction.';
          return;
        }
        const web3 = new Web3();
        const res = web3.eth.abi.decodeLog(
          [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address'
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address'
            }
          ],
          resReceipt.data.result.logsBloom,
          resReceipt.data.result.logs[0].topics.slice(1)
        );
        console.log(res);
        to = res.to.toLocaleLowerCase();
        amount = resReceipt.data.result.logs[0].data.toString(10);
      } else {
        if (resReceipt.data.result.logs.length) {
          this.claimTxError = 'Invalid transaction.';
          return;
        }
        to = resReceipt.data.result.to.toLocaleLowerCase();
        const res = await this.getEthTransactionByHash(hash);
        console.log(res);
        amount = res.data.result.value.toString(10);
      }
      console.log(amount);
      if (to !== this.minterInfo.address) {
        this.claimTxError = 'Invalid transaction.';
        return;
      }
      let fee = '0';
      if (std === 'ERC20') {
        fee = this.filterEstimatedFee(
          this.icNetworkTokens.icTokenInfo,
          this.ethTokenInfo,
          this.minterInfo
        );
      }
      const minAmount = new BigNumber(amount)
        .div(10 ** this.icNetworkTokens.icTokenInfo.decimals)
        .plus(fee)
        .decimalPlaces(8)
        .toString(10);
      console.log(minAmount);
      if (
        new BigNumber(
          this.icNetworkTokens.icTokenInfo.minAmount.toString(20)
        ).lt(minAmount)
      ) {
        this.claimTxError = `The amount is too low, it needs to be greater than ${minAmount}`;
        return;
      }
    } else if (resReceipt && !resReceipt.data.result) {
      this.claimTxError =
        'Unable to locate the transaction, please try again later.';
      return;
    } else if (
      resReceipt &&
      resReceipt.data.result &&
      !resReceipt.data.result.blockNumber
    ) {
      this.claimTxError = 'The transaction is pending. Please try again later.';
      return;
    }
    this.claimTxError = '';
  }
  private onClaim(): void {
    (this.$refs as any).signatureForm.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        await this.signTypedData();
      }
    });
  }
  private async tryClaim(txHash: string): Promise<void> {
    if (typeof txHash === 'string') {
      this.signatureForm.txHash = txHash;
      this.txHashChange();
      await checkAuth();
      await this.signTypedData();
    }
  }
  private async claim(txHash: string, signature: string): Promise<void> {
    const res = await this.ckETHMinterService.claim(
      txHash,
      hexToBytes(signature)
    );
    this.claimModalTransactions = false;
    if (res) {
      const type = Object.keys(res)[0];
      setTimeout(() => {
        this.getBalanceInit();
      }, 10 * 1000);
      if (type === 'Ok') {
        this.$message.success('Mint pending');
        const depositInfo = this.getDepositInfo();
        const flag = depositInfo.some((item) => {
          if (item[0] === txHash) {
            item[1] = true;
            return true;
          }
        });
        if (!flag) {
          depositInfo.unshift([txHash, true, true, new Date().getTime()]);
        }
        this.setDepositInfo(depositInfo);
        this.onGetClaimPending();
        this.onGetClaim2Pending();
        this.signatureForm.txHash = '';
        this.depositInfo = this.getDepositInfo();
        this.getMintDepositing();
      } else {
        const err = (res as { Err: ResultError }).Err;
        this.$message.error(
          JSON.stringify(err, (key, value) =>
            typeof value === 'bigint' ? value.toString(10) : value
          )
        );
      }
    } else {
      this.$message.error('Mint error');
    }
  }
  private async signTypedData(): Promise<void> {
    if (!this.isMetaMaskInstalled()) {
      this.metaMaskVisible = true;
    } else {
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      try {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        let ethChainId = '0x1';
        if (Number(this.minterInfo.chainId) === 5) {
          ethChainId = '0x5';
        }
        if (chainId !== ethChainId) {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethChainId }]
          });
        }
        const txHash = this.signatureForm.txHash.trim();
        const accounts: string[] = await ethereum.request({
          method: 'eth_requestAccounts'
        });
        const resReceipt = await this.getEthTransactionReceipt(txHash);
        console.log(resReceipt);
        if (resReceipt && resReceipt.data.result) {
          const std = Object.keys(this.icNetworkTokens.icTokenInfo.std)[0];
          let address;
          let to;
          if (std === 'ERC20') {
            const web3 = new Web3();
            const res = web3.eth.abi.decodeLog(
              [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'from',
                  type: 'address'
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address'
                }
              ],
              resReceipt.data.result.logsBloom,
              resReceipt.data.result.logs[0].topics.slice(1)
            );
            console.log(res);
            address = res.from.toLocaleLowerCase();
            to = res.to.toLocaleLowerCase();
          } else {
            address = resReceipt.data.result.from.toLocaleLowerCase();
            to = resReceipt.data.result.to.toLocaleLowerCase();
          }
          if (to !== this.minterInfo.address) {
            loading.close();
            this.$message.error('Invalid txHash');
            return;
          }
          if (address !== accounts[0]) {
            loading.close();
            this.$info({
              content: `Your MetaMask account (${accounts[0]}) does not match the transaction account (${address}).Please switch MetaMask account.`,
              class: 'connect-plug',
              icon: 'connect-plug',
              okText: 'Confirm',
              centered: true,
              onOk() {
                //
              }
            });
            return;
          }
          // todo blockNumber
          // if (Number(resReceipt.data.result.blockNumber) > 648000) {
          //   this.$message.error('It expired (valid for 648000 blocks).');
          //   return;
          // }
        } else {
          loading.close();
          this.$message.error(
            'Unable to locate this txHash,Please try again later.'
          );
          return;
        }
        let salt = Array.from(
          Principal.from(IC_ETH_MINTER_CANISTER_ID).toUint8Array()
        );
        salt = Array(32 - salt.length)
          .fill(0)
          .concat(salt);
        console.log(salt);
        console.log(fromSubAccountId(0));
        const msgParams = {
          domain: {
            // Give a user friendly name to the specific contract you are signing for.
            name: 'icRouter: Cross-chain Asset Router',
            // Just let's you know the latest version. Definitely make sure the field name is correct.
            version: '1',
            // Defining the chain aka Rinkeby testnet or Ethereum Main Net
            chainId: ethChainId,
            // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
            salt: '0x' + toHexString(new Uint8Array(salt))
          },
          // Defining the message signing data content.
          message: {
            /*
					 - Anything you want. Just a JSON Blob that encodes the data you want to send
					 - No required fields
					 - This is DApp Specific
					 - Be as explicit as possible when building out the message schema.
					*/
            operation: 'deposit for minting token on IC network',
            txHash: txHash,
            principal: this.getPrincipalId,
            subaccount: '0x' + toHexString(new Uint8Array(fromSubAccountId(0)))
          },
          // Refers to the keys of the *types* object below.
          primaryType: 'ICRouter' as const,
          types: {
            EIP712Domain: [
              { name: 'name', type: 'string' },
              { name: 'version', type: 'string' },
              { name: 'chainId', type: 'uint256' },
              { name: 'salt', type: 'bytes32' }
            ],
            // Refer to PrimaryType
            ICRouter: [
              { name: 'operation', type: 'string' },
              { name: 'txHash', type: 'bytes32' },
              { name: 'principal', type: 'string' },
              { name: 'subaccount', type: 'bytes32' }
            ]
          }
        };
        const signature = await ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [accounts[0], JSON.stringify(msgParams)]
        });
        console.log(signature);
        await this.claim(txHash, signature);
      } catch (e) {
        console.error(e);
        if (e.code !== 4001) {
          this.$message.error(e.message);
        }
        this.claimModalTransactions = false;
      }
      loading.close();
    }
  }
  private filterStatus(val: number): string {
    if (val || val === 0) {
      return 'Confirmed';
    }
    return 'UnConfirmed';
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private onCopySuccess(): void {
    this.$message.success(`Copied`);
  }
  private onError(): void {
    console.log('err');
  }
  private getCKETHRetrieveTxid(status: RetrieveEthStatus): string {
    const type = Object.keys(status)[0];
    if (type === 'TxSent') {
      const value = Object.values(status)[0];
      return value.transaction_hash;
    }
    if (type === 'TxFinalized') {
      const value = Object.values(status)[0];
      return value.Success.transaction_hash;
    }
    return '';
  }
}
</script>

<style scoped lang="scss">
.active-pending-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  button {
    width: 80px;
    height: 28px;
    margin-left: 20px;
    background: rgba(81, 183, 195, 0.7) !important;
  }
}
.chain-hub-token-info {
  margin-top: 10px;
}
.transaction-update-time {
  margin-bottom: 10px;
  font-size: 12px;
  text-align: right;
  color: #777d90;
}
.ic-token-balance {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
}
.cross-title {
  display: flex;
  align-items: center;
  p {
    font-size: 16px;
    color: #adb7c2;
    font-weight: bold;
    span {
      font-size: 14px;
      font-weight: normal;
    }
  }
  .minting-method-info {
    display: flex;
    align-items: center;
    .minting-method-type {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      width: 180px;
      border-radius: 30px;
      background: #232730;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 85px;
        height: 30px;
        border-radius: 30px;
        cursor: pointer;
        &.h5-show {
          display: none;
        }
        &.active {
          background: #3899a4;
          color: #e7eaee;
        }
        &.disabled {
          cursor: not-allowed;
          background: #232730;
          color: #727a87;
          opacity: 0.8;
        }
      }
    }
  }
}
.retrieving-fee {
  display: flex;
  align-items: flex-start;
  .transfer-balance-max {
    color: #1996c4;
    cursor: pointer;
    margin-left: 5px;
  }
  .transfer-balance-right {
    margin-left: auto;
    color: #1996c4;
    cursor: pointer;
  }
}
.ic-btc-tip {
  color: #727a87;
  font-size: 12px;
}
.ckbtc-button {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 20px;
  button {
    width: 400px;
    height: 40px;
  }
}
.retrieve-button {
  height: 36px;
}
.pagination-transaction-main {
  display: flex;
  .pagination-transaction {
    margin-top: 10px;
    margin-left: auto;
    overflow: hidden;
  }
}
.forge-modal {
  ::v-deep .ant-modal {
    padding-bottom: 70px;
  }
  ::v-deep .ant-modal-header {
    padding: 70px 70px 55px 90px;
  }
  ::v-deep .ant-modal-body {
    padding: 0 90px;
    min-height: 300px;
  }
  &.active-pending-modal {
    ::v-deep .ant-modal-header {
      padding: 70px 55px;
    }
    ::v-deep .ant-modal-body {
      min-height: auto;
      padding: 0 55px;
    }
  }
  ::v-deep .ant-spin-spinning {
    background: rgba(21, 22, 27, 0.1);
  }
  ::v-deep .ant-modal-title {
    text-align: left;
    font-size: 20px;
  }
  .Confirmed {
    color: rgba(33, 199, 125, 0.8);
  }
  /*.UnConfirmed {
    color: rgba(209, 54, 81, 0.8);
  }*/
  .modal-title-info {
    display: flex;
  }
  .title-tip {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 16px;
  }
}
.has-update {
  color: rgba(33, 199, 125, 1);
}
.flex-auto {
  display: flex;
  .flex1 {
    flex: 1;
  }
}
.retrieve-btc-status-ul-table {
  li {
    display: flex;
    &.retrieve-btc-status-ul-table-eth {
      font-size: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #212b35 !important;
    }
    a {
      color: #2b8cb0;
    }
    .cell {
      width: 20%;
      display: flex;
      align-items: flex-start;
      word-break: break-word;
      word-wrap: break-word;
      &.cell-header {
        align-items: center;
      }
      &.grow1 {
        flex-grow: 1;
      }
    }
  }
}
.retrieve-btc-status {
  .retrieve-btc-status-ul {
    min-height: 100px;
    max-height: calc(100vh - 400px);
    font-size: 12px;
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
    .retrieve-btc-status-block-index {
      width: 80px;
      margin-right: 10px;
    }
  }
  .no-retrieve-btc-status-ul {
    height: 150px;
    justify-content: center;
  }
  li {
    display: flex;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid #212b35;
    &:first-child {
      border-bottom: none;
    }
    &:last-child {
      border-bottom: none;
    }
  }
}
.btc-txs {
  .no-btc-txs-ul {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 275px;
    font-size: 14px;
  }
  .btc-txs-ul {
    min-height: 275px;
    max-height: calc(100vh - 400px);
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
    li {
      padding: 5px 0;
      border-bottom: 1px solid #212b35;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  .btc-txs-hash {
    display: flex;
  }
  .btc-txs-info {
    display: flex;
    > div {
      flex: 1;
      &.btc-txs-info-left {
        flex: 0.7;
      }
    }
    .tx-balance {
      padding-left: 5px;
    }
  }
  a {
    color: #2b8cb0;
    &.out-address-m {
      opacity: 0.7;
    }
  }
}
.operation-disabled {
  opacity: 0.5;
}
.ic-balance-main {
  p {
    line-height: 20px;
  }
  .operation {
    height: auto;
    margin-top: 10px !important;
    .button-history {
      margin-right: 0;
      i {
        padding: 2px 0;
      }
    }
  }
  .ic-balance-item {
    margin-top: 10px;
    &.ic-balance-item-launch-event {
      display: flex;
      .ckBTC-launch-event {
        color: #2b8cb0;
      }
    }
  }
  .ic-balance-item-launch-event-select {
    position: relative;
    display: flex;
    align-items: center;
    height: 50px;
    margin-top: 30px;
    font-size: 16px;
    .ic-balance-item-launch-event-selected-icon {
      position: absolute;
      z-index: 100;
      left: 11px;
    }
    .select-erc20-token {
      height: 50px;
      min-width: 300px;
      margin-right: 10px;
      .ic-router-token-placeholder {
        display: flex;
        align-items: center;
      }
      &.select-erc20-token-event {
        ::v-deep .ant-select-selection-selected-value {
          margin-left: 38px;
        }
      }
      ::v-deep .ant-select-selection-selected-value {
        display: flex !important;
        align-items: center;
      }
      ::v-deep .ant-select-selection {
        border-radius: 25px;
      }
      ::v-deep .ant-select-selection--single {
        position: relative;
        height: 50px;
      }
      ::v-deep .ant-select-selection__rendered {
        line-height: 50px;
      }
    }
  }
  .operation {
    margin-top: 0;
    margin-left: auto;
    border: none;
  }
}
.ic-router-token-info {
  display: flex;
  align-items: center;
  .ic-router-token-info-right {
    display: flex;
    flex-direction: column;
    .ic-router-token-info-symbol {
      color: #adb7c2;
    }
    .ic-router-token-info-name {
      font-size: 12px;
    }
  }
}
.ic-router-token-symbol {
  display: inline-block;
  text-align: center;
  width: 28px;
  height: 28px;
  line-height: 28px;
  margin-right: 10px;
  color: #fff;
  background: #a8aaaf;
  border-radius: 14px;
}
.ic-router-token-logo {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  object-fit: contain;
  margin-right: 10px;
}
.ic-balance-item-container {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid #383e4e;
  &.ic-balance-item-container-btc {
    padding-bottom: 25px;
  }
  .ic-balance-item-container-item {
    padding-top: 15px;
    width: 50%;
  }
  &.ic-balance-item-container-icp {
    padding: 10px 0 30px;
  }
  &:last-child {
    border-bottom: none;
  }
  button {
    &:disabled {
      background: rgba(81, 183, 195, 0.1) !important;
    }
  }
}
.ic-balance-item-other {
  display: flex;
  align-items: center;
  padding: 20px 0 10px;
  .ic-balance-item-other-item {
    min-width: 200px;
  }
}
.dissolve-modal {
  .forge-left-balance {
    flex-direction: column;
    align-items: flex-start;
  }
}
.btc-txs-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
  button {
    margin-right: 0 !important;
    &:disabled {
      background: rgba(81, 183, 195, 0.1) !important;
    }
  }
  img {
    width: 15px;
    animation: loading-rotate 2s linear infinite;
    margin-left: 5px;
  }
}
button {
  width: 110px;
  height: 30px;
  margin-right: 10px !important;
  border-radius: 5px;
  border: none;
  background: rgba(81, 183, 195, 0.1);
  transition: all 0.3s;
  &:hover,
  &.primary {
    background: #51b7c3;
    span {
      color: #fff;
    }
  }
  span {
    color: #b4bacd;
  }
}
.primary-receive {
  background: rgba(81, 183, 195, 0.7) !important;
  color: #adb7c2 !important;
}
.ic-balance-item-container-wrap {
  padding: 0;
  .balance {
    font-size: 26px;
    word-break: break-word;
  }
  button {
    width: 90px;
  }
  .operation {
    margin-top: 25px !important;
  }
  .ic-balance-item {
    margin: 0;
  }
  .ic-balance-item-container-item {
    margin-top: 20px;
    padding: 0;
    &:first-child {
      padding-right: 10px;
    }
    &:last-child {
      padding-left: 10px;
    }
    &.ic-balance-item-container-item-eth {
      p {
        line-height: 30px;
      }
    }
  }
}
.coming-soon {
  line-height: 26px;
}
.ic-balance-item-container-item-btc {
  border-right: 1px solid #212b35;
}
.forge-left-balance,
.forge-right-balance {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .balance {
    padding: 0 5px;
  }
}
.forge-left-balance {
  display: flex;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    white-space: nowrap;
  }
}
.step-list {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  background: #101014;
  padding: 10px;
  border-radius: 20px;
  font-size: 15px;
  .step-previous {
    position: absolute;
    left: -25px;
    font-size: 18px;
    color: #55575b;
    &.active {
      color: #c0c7cf;
      cursor: pointer;
    }
  }
  .step-next {
    position: absolute;
    right: -25px;
    font-size: 18px;
    color: #55575b;
    &.active {
      color: #c0c7cf;
      cursor: pointer;
    }
  }
  .step-list-center {
    flex: 1;
    padding: 0 15px;
    .step-list-center-t {
      display: flex;
      align-items: center;
      padding: 0 15px;
    }
    .step-list-line {
      flex: 1;
      height: 1px;
      background: #adb3c4;
    }
  }
  > .pointer {
    display: flex;
    align-items: center;
    &.active {
      color: #fff;
      .step-list-num {
        border-color: #fff;
      }
    }
  }
  .step-list-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    border: 1px solid #747884;
    border-radius: 10px;
  }
}
.ckEth-mint-top {
  margin-bottom: 10px;
  padding: 10px;
  background: #101014;
  border-radius: 10px;
}
.forge-main {
  display: flex;
  background: #101014;
  padding: 10px;
  border-radius: 10px;
}
.btc-address-code {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: auto;
  margin-top: 10px;
  color: #adb3c4;
  img {
    width: 200px;
    min-height: 200px;
    padding: 5px 0;
  }
}
.ic-balance-item-container-ckbtc {
  filter: grayscale(1);
  .balance {
    color: #b4bacd;
  }
  button {
    &:hover {
      span {
        color: #b4bacd !important;
      }
    }
  }
}
.btc-txs-ul-spin {
  min-height: 100px;
}
.loading-spinner {
  display: inline-block;
  background-image: url('../../../../assets/img/loading.svg');
  background-repeat: no-repeat;
  background-size: 14px 14px;
  height: 14px;
  width: 14px;
  background-position: center;
  animation: loading-rotate 2s linear infinite;
  margin-left: 5px;
  color: #808a94;
}
.retrieve-btc-status-flex {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  &.retrieve-btc-status-flex-pc {
    width: 100px;
  }
}
.eth-tx-hash {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  > div {
    display: flex;
    flex-direction: column;
  }
}
.step-footer-confirmation {
  position: absolute;
  right: 70px;
  left: 90px;
  bottom: -60px;
  width: auto;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.forge-left {
  width: 100%;
  .step-footer {
    position: absolute;
    right: 20px;
    left: 20px;
    width: auto;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #1996c4;
    cursor: pointer;
  }
  .mint-footer {
    display: flex;
    align-items: center;
    margin-top: 100px;
    button {
      width: 200px;
      height: 36px;
      margin: 0;
    }
  }
  .next-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 20px;
    button {
      width: 100%;
      height: 36px;
    }
  }
  .mint-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 40px 0 20px;
    button {
      width: auto;
      height: 36px;
      margin: 0 !important;
      img {
        width: 16px;
        margin-right: 5px;
      }
    }
  }
  .ckbtc-button {
    /*position: absolute;
		bottom: 0;
		margin-bottom: 0;*/
  }
}
.forge-modal-eth {
  .forge-left {
    margin-right: 0;
    /*background: #131920;
		padding: 10px;*/
  }
  .forge-right {
    width: 100%;
    table {
      font-size: 12px;
    }
    table,
    tr,
    th,
    td {
      background: transparent !important;
    }
    tbody {
      tr:nth-child(2n-1) {
        background: rgba(21, 22, 27, 0.4) !important;
      }
    }
    .deposit-balance {
      font-size: 18px;
      color: #f5f5f5;
    }
    .deposit-balance-symbol {
      vertical-align: bottom;
      font-size: 12px;
    }
    .retrieve-btc-status-block-index {
      width: 60px;
    }
    .retrieve-btc-status-ul {
      min-height: 250px;
      max-height: calc(100vh - 400px);
      padding-right: 0;
    }
    .btc-txs-ul {
      min-height: 100px;
    }
    .btc-txs-ul-spin {
      min-height: 100px;
    }
  }
}
.dissolve-modal {
  .forge-left {
    height: auto;
  }
}
.step-footer {
  position: absolute;
  right: 20px;
  left: 20px;
  width: auto;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #1996c4;
  cursor: pointer;
}
.pc-show {
  display: block;
}
.h5-show {
  display: none;
}
.ic-balance-item-container-item-cross {
  display: flex;
  align-items: center;
  justify-content: center;
  ::v-deep .ant-select-selection {
    border: 1px solid #646e79;
    color: #d5d5d5;
  }
  ::v-deep .ant-select-selection__placeholder {
    height: 28px;
    margin-top: -14px;
    color: #adb3c4;
  }
  ::v-deep .ant-select-disabled {
    .ant-select-selection {
      background: #272e36;
      opacity: 0.5;
      &:hover {
        border-color: #646e79;
      }
    }
  }
}
.cross-main {
  display: flex;
  .cross-item {
    &:first-child {
      margin-right: 20px;
    }
    &:last-child {
      margin-left: 20px;
    }
  }
  .cross-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-top: 77px;
    font-size: 20px;
    border-radius: 18px;
    background: #141b23;
    border: 2px solid #000;
    color: #adb3c4;
    transition: all 0.3s;
    &.pointer {
      color: #fff;
      &:hover {
        i {
          transform: scale(1.1);
        }
      }
    }
  }
  .cross-item-title {
    margin-bottom: 20px;
    font-size: 16px;
  }
}
.cross-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  button {
    height: 40px;
    width: 300px;
    margin-right: 0 !important;
  }
  span {
    position: absolute;
    left: 50%;
    margin-left: 160px;
  }
}
@media screen and (max-width: 1000px) {
  .forge-modal,
  .dissolve-modal {
    .modal-title-info {
      display: block;
      .modal-title-main {
        width: auto;
      }
    }
    ::v-deep .ant-modal-body {
      max-height: calc(100vh - 172px);
    }
    .retrieve-button {
      width: 100%;
      margin-top: 20px;
    }
    .btc-txs-ul-spin {
      height: auto;
      min-height: 100px;
    }
    .btc-txs-ul {
      min-height: 100px;
      max-height: none;
    }
    .forge-main {
      flex-direction: column;
    }
    .forge-left,
    .forge-right,
    .btc-address-code {
      width: 100%;
    }
    .forge-right {
      margin-top: 20px;
    }
  }
  .btc-config {
    line-height: 1.1;
    margin-top: 10px;
  }
  .retrieve-btc-status {
    .retrieve-btc-status-ul {
      max-height: none;
    }
  }
  .forge-left {
    .step-footer {
      width: 100%;
    }
  }
}
.btc-txs-header-h5 {
  .deposit-balance {
    display: flex;
    align-items: baseline;
  }
}
.icp-balance-main {
  display: flex;
  align-items: center;
  .ic-token-operation {
    margin-left: auto;
    .button-history {
      margin-right: 0 !important;
    }
  }
}
@media screen and (max-width: 768px) {
  .cross-info,
  .cross-item {
    width: 100%;
  }
  .ic-balance-main {
    .ic-balance-item-launch-event-select {
      .select-erc20-token {
        width: 100%;
        min-width: auto;
      }
    }
  }
  .cross-button {
    span {
      position: static;
      margin-left: 10px;
    }
  }
  .icp-balance-main {
    align-items: flex-start;
    flex-direction: column;
    .ic-token-operation {
      margin-left: 0;
    }
  }
  .retrieve-btc-status-flex {
    &.retrieve-btc-status-flex-pc {
      width: auto;
    }
    &.retrieve-btc-status-flex-h5 {
      margin-left: auto;
    }
  }
  .btc-txs-header-h5 {
    flex-direction: column;
    .margin-left-auto {
      margin-left: 0;
    }
  }
  .li-h5-item {
    display: flex;
  }
  .transaction-update-time {
    text-align: left;
  }
  .pc-show {
    display: none;
  }
  .h5-show {
    display: block;
  }
  .step-footer-confirmation {
    position: static;
    line-height: 1;
    font-size: 12px;
    padding-top: 5px;
  }
  .cross-title {
    .minting-method-info {
      .minting-method-type {
        span.h5-show {
          display: flex;
        }
      }
    }
  }
  .btc-txs-ul {
    li {
      font-size: 12px;
      .btc-txs-hash {
        flex-wrap: wrap;
      }
    }
  }
  .ic-token-operation {
    flex-wrap: wrap;
    button {
      margin-bottom: 8px;
    }
  }
  .cross-title {
    flex-direction: column;
    align-items: flex-start;
    .minting-method-info {
      margin-left: 0;
    }
  }
  .active-pending-item {
    flex-wrap: wrap;
  }
  .cross-main {
    flex-direction: column;
    align-items: center;
    .cross-item-icon-down {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      margin-top: 20px;
      font-size: 20px;
      border-radius: 18px;
      background: #141b23;
      border: 2px solid #000;
      color: #adb3c4;
      transition: all 0.3s;
      &.pointer {
        color: #fff;
        &:hover {
          i {
            transform: scale(1.1);
          }
        }
      }
    }
    .ic-balance-item-launch-event-select {
      margin-top: 20px;
    }
    .cross-item {
      &:first-child {
        margin-right: 0;
      }
      &:last-child {
        margin-left: 0;
      }
    }
  }
  .forge-modal {
    ::v-deep .ant-modal {
      width: 100% !important;
      padding-bottom: 20px;
      font-size: 12px !important;
    }
    ::v-deep .ant-modal-header {
      padding: 35px 15px !important;
    }
    ::v-deep .ant-modal-body {
      padding: 0 15px !important;
    }
    .forge-main.mt20 {
      margin-top: 0;
    }
    .step-list {
      .step-list-center {
        padding: 0 5px;
        .step-list-center-t {
          padding: 0 5px;
        }
      }
    }
    .btc-txs-header {
      flex-wrap: wrap;
      font-size: 12px;
    }
    .mint-button {
      flex-wrap: wrap;
      button {
        width: 100%;
        margin-bottom: 10px !important;
      }
    }
  }
  .forge-modal-eth {
    .forge-right {
      margin-top: 0;
      margin-left: 0;
    }
  }
  .dissolve-modal {
    ::v-deep .ant-modal {
      width: 100% !important;
    }
  }
  .flex-auto-h5 {
    flex-direction: column;
    align-items: flex-end;
  }
  .retrieve-btc-status {
    li {
      flex-wrap: wrap;
      font-size: 12px;
    }
    .li-h5-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 5px 0;
    }
    .no-retrieve-btc-status-ul {
      min-height: 100px;
      height: auto;
    }
    .retrieve-btc-status-ul {
      .retrieve-btc-status-block-index {
        width: 55px;
        margin-right: 0;
        &.retrieve-btc-status-block-index-block {
          width: 80px;
        }
      }
    }
    /*.retrieve-btc-status-ul-table-eth {
      .retrieve-margin-left-auto {
        margin-left: 0;
        text-align: left;
      }
    }*/
  }
  .ic-balance-item-container {
    flex-direction: column;
    .operation {
      width: 100%;
      flex-wrap: wrap;
      button {
        margin-bottom: 10px;
      }
    }
    .ic-balance-item-container-item-btc {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #212b35;
    }
  }
  .ic-balance-item-other {
    .ic-balance-item-other-item {
      min-width: 50%;
    }
  }
  .btc-config {
    margin-top: 0;
  }
}
</style>
