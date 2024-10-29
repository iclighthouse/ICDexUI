<template>
  <div>
    <div class="ic-balance-main">
      <div class="ic-balance-item-container-icp" v-if="type === 'ic'">
        <div class="ic-balance-item" v-show="walletMenu === 'wallet'">
          <p>
            ICP Balance
            <a-icon
              @click="refreshBalance"
              class="reload-icon"
              type="reload"
              v-show="!refreshBalanceLoading"
            />
            <a-icon
              class="reload-icon"
              type="loading"
              v-show="refreshBalanceLoading"
            />
          </p>
          <div class="icp-balance-main">
            <span class="balance">
              {{ balance | bigintToFloat(8, 0) | formatNum }}&nbsp;ICP
            </span>
            <div
              class="operation ic-token-operation"
              style="padding-bottom: 20px; padding-top: 10px"
            >
              <button
                @click="showReceive"
                class="primary primary-receive"
                type="button"
              >
                <span>Receive</span>
              </button>
              <button @click="showTransfer" type="button">
                <span>Transfer</span>
              </button>
              <button @click="showApprove" type="button">
                <span>Approve</span>
              </button>
              <button @click="showTopUp" type="button">
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
        <div
          class="ic-balance-item ic-balance-item-pro"
          v-show="walletMenu === 'proWallet'"
        >
          <p>
            ICP Balance
            <a-icon
              @click="refreshBalance"
              class="reload-icon"
              type="reload"
              v-show="!refreshBalanceLoading"
            />
            <a-icon
              class="reload-icon"
              type="loading"
              v-show="refreshBalanceLoading"
            />
          </p>
          <div class="icp-balance-main">
            <span class="balance">
              {{ balancePro | bigintToFloat(8, 0) | formatNum }}&nbsp;ICP
            </span>
            <div
              class="operation ic-token-operation"
              style="padding-bottom: 20px; padding-top: 10px"
            >
              <button
                @click="swapWallet"
                style="margin-right: 0 !important"
                type="button"
              >
                <span>Transfer</span>
              </button>
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
            class="minting-method-info margin-left-auto"
            v-if="minterInfo && minterInfo.depositMethod"
          >
            <span class="base-font-title">Minting:&nbsp;&nbsp;</span>
            <div class="minting-method-type">
              <a-tooltip placement="top">
                <template slot="title">
                  Method 1 supports all wallets.
                </template>
                <span
                  :class="{
                    active: depositMethod === 1,
                    disabled:
                      minterInfo.depositMethod === 2 || changeMethodDisabled
                  }"
                  @click="changeDepositMethod(1)"
                  class="pc-show"
                  >Method 1</span
                >
              </a-tooltip>
              <span
                :class="{
                  active: depositMethod === 1,
                  disabled:
                    minterInfo.depositMethod === 2 || changeMethodDisabled
                }"
                @click="changeDepositMethod(1)"
                class="h5-show"
                >Method 1</span
              >
              <a-tooltip placement="top">
                <template slot="title">
                  Method 2 is quicker and supports only MetaMask wallet.
                </template>
                <span
                  :class="{
                    active: depositMethod === 2,
                    disabled:
                      minterInfo.depositMethod === 1 || changeMethodDisabled
                  }"
                  @click="changeDepositMethod(2)"
                  class="pc-show"
                  >Method 2</span
                >
              </a-tooltip>
              <span
                :class="{
                  active: depositMethod === 2,
                  disabled:
                    minterInfo.depositMethod === 1 || changeMethodDisabled
                }"
                @click="changeDepositMethod(2)"
                class="h5-show"
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
                    :disabled="networkTokenDisabled"
                    @change="changeNetworkIdMint"
                    class="select-erc20-token"
                    v-model="networkIdMint"
                  >
                    <span
                      class="ic-router-token-placeholder"
                      slot="placeholder"
                    >
                      <span class="ic-router-token-symbol"></span>
                      Select a network
                    </span>
                    <a-select-option
                      :key="index"
                      class="select-erc20-network-dropdown"
                      v-for="(network, index) in networkListFrom"
                    >
                      <img
                        :src="network.logo"
                        alt=""
                        class="ic-router-token-logo"
                        v-if="network.logo"
                      /><span class="ic-router-token-symbol" v-else></span>
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
                      :src="networkTokensFrom[networkTokenIdMint].logo"
                      alt=""
                      class="ic-router-token-logo"
                      v-if="networkTokensFrom[networkTokenIdMint].logo"
                    />
                    <img
                      :src="
                        tokens[networkTokensFrom[networkTokenIdMint].tokenId]
                          .logo
                      "
                      alt=""
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
                    />
                    <img
                      alt=""
                      class="ic-router-token-logo"
                      src="@/assets/img/empty-token.png"
                      v-if="
                        !networkTokensFrom[networkTokenIdMint].logo &&
                        (networkTokensFrom[networkTokenIdMint].networkId ===
                          '1' ||
                          networkTokensFrom[networkTokenIdMint].networkId ===
                            '2' ||
                          networkTokensFrom[networkTokenIdMint].networkId ===
                            '3')
                      "
                    />
                    <span
                      class="ic-router-token-symbol"
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
                    >
                      {{
                        networkTokensFrom[networkTokenIdMint].symbol
                          .slice(0, 1)
                          .toLocaleUpperCase()
                      }}
                    </span>
                  </div>
                  <a-select
                    :disabled="typeof networkIdMint !== 'number'"
                    @change="changeNetworkTokenIdMint"
                    class="select-erc20-token select-erc20-token-event"
                    option-label-prop="label"
                    v-model="networkTokenIdMint"
                  >
                    <span
                      class="ic-router-token-placeholder"
                      slot="placeholder"
                    >
                      <span class="ic-router-token-symbol"></span>
                      Select a token
                    </span>
                    <a-select-option
                      :key="index"
                      :label="`${token.symbol} (${
                        networkIds[token.networkId]
                      })`"
                      class="select-erc20-token-dropdown"
                      v-for="(token, index) in networkTokensFrom"
                    >
                      <div class="ic-router-token-info">
                        <div class="ic-router-token-info-left">
                          <img
                            :src="token.logo"
                            alt=""
                            class="ic-router-token-logo"
                            v-if="token.logo"
                          />
                          <img
                            :src="tokens[token.tokenId].logo"
                            alt=""
                            class="ic-router-token-logo"
                            v-if="
                              !token.logo &&
                              token.networkId === '-1' &&
                              tokens &&
                              tokens[token.tokenId] &&
                              tokens[token.tokenId].logo
                            "
                          />
                          <img
                            alt=""
                            class="ic-router-token-logo"
                            src="@/assets/img/empty-token.png"
                            v-if="
                              !token.logo &&
                              (token.networkId === '1' ||
                                token.networkId === '2' ||
                                token.networkId === '3')
                            "
                          />
                          <span
                            class="ic-router-token-symbol"
                            v-if="
                              token.networkId === '-1' &&
                              !token.logo &&
                              !(
                                tokens &&
                                tokens[token.tokenId] &&
                                tokens[token.tokenId].logo
                              )
                            "
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
                            class="ic-router-token-info-name"
                            v-if="
                              token.networkId === '-1' &&
                              tokens &&
                              tokens[token.tokenId] &&
                              tokens[token.tokenId].name
                            "
                          >
                            {{ tokens[token.tokenId].name }}
                          </span>
                          <span
                            class="ic-router-token-info-name"
                            v-if="
                              (token.networkId === '1' ||
                                token.networkId === '2') &&
                              token.id !==
                                '0x0000000000000000000000000000000000000000'
                            "
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
                            ? `https://sepolia.etherscan.io/token/${networkTokensFrom[networkTokenIdMint].id}#code`
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
                      style="margin-top: 5px"
                      v-show="
                        ethereumIsConnected &&
                        ERC20EthereumBalance[
                          networkTokensFrom[networkTokenIdMint].tokenId
                        ]
                      "
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
                @click="switchHub"
                class="cross-item-icon base-font-title pc-show"
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
                    :disabled="typeof networkTokenIdMint !== 'number'"
                    @change="changeNetworkIdMintTo"
                    class="select-erc20-token"
                    v-model="networkIdMintTo"
                  >
                    <span
                      class="ic-router-token-placeholder"
                      slot="placeholder"
                    >
                      <span class="ic-router-token-symbol"></span>
                      Select a network
                    </span>
                    <a-select-option
                      :key="index"
                      class="select-erc20-network-dropdown"
                      v-for="(network, index) in networkListTo"
                    >
                      <img
                        :src="network.logo"
                        alt=""
                        class="ic-router-token-logo"
                        v-if="network.logo"
                      /><span class="ic-router-token-symbol" v-else></span>
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
                      :src="networkTokensTo[networkTokenIdMintTo].logo"
                      alt=""
                      class="ic-router-token-logo"
                      v-if="networkTokensTo[networkTokenIdMintTo].logo"
                    />
                    <img
                      :src="
                        tokens[networkTokensTo[networkTokenIdMintTo].tokenId]
                          .logo
                      "
                      alt=""
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
                    />
                    <img
                      alt=""
                      class="ic-router-token-logo"
                      src="@/assets/img/empty-token.png"
                      v-if="
                        !networkTokensTo[networkTokenIdMintTo].logo &&
                        (networkTokensTo[networkTokenIdMintTo].networkId ===
                          '1' ||
                          networkTokensTo[networkTokenIdMintTo].networkId ===
                            '2' ||
                          networkTokensTo[networkTokenIdMintTo].networkId ===
                            '3')
                      "
                    />
                    <span
                      class="ic-router-token-symbol"
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
                    >
                      {{
                        networkTokensTo[networkTokenIdMintTo].symbol
                          .slice(0, 1)
                          .toLocaleUpperCase()
                      }}
                    </span>
                  </div>
                  <a-select
                    :disabled="typeof networkIdMintTo !== 'number'"
                    @change="changeNetworkTokenIdMintTo"
                    class="select-erc20-token select-erc20-token-event"
                    option-label-prop="label"
                    v-model="networkTokenIdMintTo"
                  >
                    <span
                      class="ic-router-token-placeholder"
                      slot="placeholder"
                    >
                      <span class="ic-router-token-symbol"></span>
                      Select a token
                    </span>
                    <a-select-option
                      :key="index"
                      :label="`${token.symbol} (${
                        networkIds[token.networkId]
                      })`"
                      class="select-erc20-token-dropdown"
                      v-for="(token, index) in networkTokensTo"
                    >
                      <div class="ic-router-token-info">
                        <div class="ic-router-token-info-left">
                          <img
                            :src="token.logo"
                            alt=""
                            class="ic-router-token-logo"
                            v-if="token.logo"
                          />
                          <img
                            :src="tokens[token.tokenId].logo"
                            alt=""
                            class="ic-router-token-logo"
                            v-if="
                              !token.logo &&
                              token.networkId === '-1' &&
                              tokens &&
                              tokens[token.tokenId] &&
                              tokens[token.tokenId].logo
                            "
                          />
                          <img
                            alt=""
                            class="ic-router-token-logo"
                            src="@/assets/img/empty-token.png"
                            v-if="
                              !token.logo &&
                              (token.networkId === '1' ||
                                token.networkId === '2' ||
                                token.networkId === '3')
                            "
                          />
                          <span
                            class="ic-router-token-symbol"
                            v-if="
                              token.networkId === '-1' &&
                              !token.logo &&
                              !(
                                tokens &&
                                tokens[token.tokenId] &&
                                tokens[token.tokenId].logo
                              )
                            "
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
                            class="ic-router-token-info-name"
                            v-if="
                              token.networkId === '-1' &&
                              tokens &&
                              tokens[token.tokenId] &&
                              tokens[token.tokenId].name
                            "
                          >
                            {{ tokens[token.tokenId].name }}
                          </span>
                          <span
                            class="ic-router-token-info-name"
                            v-if="
                              (token.networkId === '1' ||
                                token.networkId === '2') &&
                              token.id !==
                                '0x0000000000000000000000000000000000000000'
                            "
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
                            ? `https://sepolia.etherscan.io/token/${networkTokensTo[networkTokenIdMintTo].id}#code`
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
                      style="margin-top: 5px"
                      v-show="
                        ethereumIsConnected &&
                        ERC20EthereumBalance[
                          networkTokensTo[networkTokenIdMintTo].tokenId
                        ]
                      "
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
                :disabled="mintDisabled"
                @click="onContinue"
                class="primary"
                type="button"
              >
                Continue
              </button>
              <span
                v-show="
                  (!mintDisabled &&
                    typeof networkTokenIdMintTo === 'number' &&
                    ckTokens.includes(
                      networkTokensTo[networkTokenIdMintTo].tokenId
                    )) ||
                  (!mintDisabled &&
                    typeof networkTokenIdMint === 'number' &&
                    ckTokens.includes(
                      networkTokensFrom[networkTokenIdMint].tokenId
                    ))
                "
                >Powered by
                <a
                  :href="ckLink"
                  class="link"
                  rel="nofollow noreferrer noopener"
                  target="_blank"
                  >Dfinity foundation</a
                ></span
              >
            </div>
            <div
              v-show="
                activePending.claim ||
                activePending.claim2 ||
                activePending.mint ||
                activePending.deposit ||
                activePending.retrieve ||
                activePending.retrieve2 ||
                activePending.mintCKETH ||
                activePending.retrieveCKETH ||
                activePending.CKETHResponse
              "
            >
              <div
                class="base-font-title"
                style="margin: 20px 0 10px; font-size: 14px; font-weight: bold"
              >
                Activities:
              </div>
              <div>
                <div v-if="activePending.claim && activePending.claim.length">
                  <div
                    :key="index"
                    class="active-pending-item"
                    v-for="(item, index) in activePending.claim"
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
                      @click="toActive('claim', item.tokenId, item.txHash)"
                      class="primary"
                    >
                      View
                    </button>
                  </div>
                </div>
                <div v-if="activePending.claim2 && activePending.claim2.length">
                  <div
                    :key="index"
                    class="active-pending-item"
                    v-for="(item, index) in activePending.claim2"
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
                      @click="toActive('claim2', item.tokenId)"
                      class="primary"
                    >
                      View
                    </button>
                  </div>
                </div>
                <div v-if="activePending.mint && activePending.mint.length">
                  <div
                    :key="index"
                    class="active-pending-item"
                    v-for="(item, index) in activePending.mint"
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
                    <button
                      @click="toActive('mint', item.tokenId)"
                      class="primary"
                    >
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
                          ethersTokenIdToCkTokenId[
                            activePending.deposit[2][0].tokenId
                          ]
                        ]
                      "
                    >
                      {{
                        ckTokenInfo[
                          ethersTokenIdToCkTokenId[
                            activePending.deposit[2][0].tokenId
                          ]
                        ].symbol
                      }}
                    </span>
                    &nbsp;->&nbsp;
                    <span
                      v-if="
                        ckTokenInfo[
                          ethersTokenIdToCkTokenId[
                            activePending.deposit[2][0].tokenId
                          ]
                        ]
                      "
                    >
                      {{
                        ckTokenInfo[
                          ethersTokenIdToCkTokenId[
                            activePending.deposit[2][0].tokenId
                          ]
                        ].ckSymbol
                      }}(IC Network)
                    </span>
                    <span
                      class="margin-left-auto"
                      v-if="
                        ckTokenInfo[
                          ethersTokenIdToCkTokenId[
                            activePending.deposit[2][0].tokenId
                          ]
                        ]
                      "
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
                      @click="
                        toActive(
                          'deposit',
                          ethersTokenIdToCkTokenId[
                            activePending.deposit[2][0].tokenId
                          ]
                        )
                      "
                      class="primary"
                    >
                      View
                    </button>
                  </div>
                </div>
                <div
                  v-if="activePending.retrieve && activePending.retrieve.length"
                >
                  <div
                    :key="index"
                    class="active-pending-item"
                    v-for="(item, index) in activePending.retrieve"
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
                    <button
                      @click="toActive('retrieve', item.tokenId)"
                      class="primary"
                    >
                      View
                    </button>
                  </div>
                </div>
                <div
                  v-if="
                    activePending.retrieve2 && activePending.retrieve2.length
                  "
                >
                  <div class="active-pending-item">
                    <span
                      v-if="
                        ckTokenInfo[
                          ethersTokenIdToCkTokenId[
                            activePending.retrieve2[1].tokenId
                          ]
                        ]
                      "
                    >
                      {{
                        ckTokenInfo[
                          ethersTokenIdToCkTokenId[
                            activePending.retrieve2[1].tokenId
                          ]
                        ].ckSymbol
                      }}(IC Network)
                    </span>
                    &nbsp;->&nbsp;
                    <span
                      v-if="
                        ckTokenInfo[
                          ethersTokenIdToCkTokenId[
                            activePending.retrieve2[1].tokenId
                          ]
                        ]
                      "
                    >
                      {{
                        ckTokenInfo[
                          ethersTokenIdToCkTokenId[
                            activePending.retrieve2[1].tokenId
                          ]
                        ].symbol
                      }}
                    </span>
                    <span
                      class="margin-left-auto"
                      v-if="
                        ckTokenInfo[
                          ethersTokenIdToCkTokenId[
                            activePending.retrieve2[1].tokenId
                          ]
                        ]
                      "
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
                      @click="
                        toActive(
                          'retrieve',
                          ethersTokenIdToCkTokenId[
                            activePending.retrieve2[1].tokenId
                          ]
                        )
                      "
                      class="primary"
                    >
                      View
                    </button>
                  </div>
                </div>
                <div
                  v-if="
                    activePending.mintCKETH && activePending.mintCKETH.length
                  "
                >
                  <div
                    :key="index"
                    class="active-pending-item"
                    v-for="(item, index) in activePending.mintCKETH"
                  >
                    <span v-if="ckTokenInfo[item.tokenId]">
                      {{ ckTokenInfo[item.tokenId].symbol }}
                    </span>
                    &nbsp;->&nbsp;
                    <span v-if="ckTokenInfo[item.tokenId]">
                      {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
                    </span>
                    <span class="margin-left-auto">
                      <a
                        :href="`${ckEthLink}/tx/${item.txHash}`"
                        class="link"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                      >
                        {{ item.txHash | ellipsisAccount() }}
                      </a>
                    </span>
                    <span
                      class="base-font-title"
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        margin: 0 10px 0 20px;
                        width: 100px;
                      "
                    >
                      <span v-show="!item.blockNumber"
                        >Pending<span class="loading-spinner"></span
                      ></span>
                      <span
                        v-show="
                          lastScrapedBlockNumber &&
                          item.blockNumber &&
                          lastScrapedBlockNumber >= Number(item.blockNumber)
                        "
                      >
                        Confirmed
                      </span>
                      <span
                        v-show="
                          lastScrapedBlockNumber &&
                          item.blockNumber &&
                          lastScrapedBlockNumber < Number(item.blockNumber)
                        "
                      >
                        Submitted<span class="loading-spinner"></span>
                      </span>
                    </span>
                    <button
                      @click="toActive('mintCKETH', item.tokenId)"
                      class="primary"
                      v-show="
                        !(
                          lastScrapedBlockNumber &&
                          item.blockNumber &&
                          lastScrapedBlockNumber >= Number(item.blockNumber)
                        )
                      "
                    >
                      View
                    </button>
                  </div>
                </div>
                <div
                  v-if="
                    activePending.retrieveCKETH &&
                    activePending.retrieveCKETH.length
                  "
                >
                  <div
                    :key="index"
                    class="active-pending-item"
                    v-for="(item, index) in activePending.retrieveCKETH"
                  >
                    <span v-if="ckTokenInfo[item.tokenId]">
                      {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
                    </span>
                    &nbsp;->&nbsp;
                    <span v-if="ckTokenInfo[item.tokenId]">
                      {{ ckTokenInfo[item.tokenId].symbol }}
                    </span>
                    <span
                      class="margin-left-auto"
                      v-if="ckTokenInfo[item.tokenId]"
                    >
                      <a
                        :href="`${ckEthLink}/tx/${
                          Object.values(item.status)[0].transaction_hash
                        }`"
                        class="link"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                        v-if="
                          item.status &&
                          Object.keys(item.status)[0] === 'TxSent'
                        "
                      >
                        {{
                          item.amount
                            | bigintToFloat(
                              8,
                              ckTokenInfo[item.tokenId].decimals
                            )
                            | formatAmount(8)
                        }}
                      </a>
                      <a
                        :href="`${ckEthLink}/tx/${
                          Object.values(item.status)[0].Success.transaction_hash
                        }`"
                        class="link"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                        v-if="
                          item.status &&
                          Object.keys(item.status)[0] === 'TxFinalized' &&
                          Object.values(item.status)[0] &&
                          Object.values(item.status)[0].Success &&
                          Object.values(item.status)[0].Success.transaction_hash
                        "
                      >
                        {{
                          item.amount
                            | bigintToFloat(
                              8,
                              ckTokenInfo[item.tokenId].decimals
                            )
                            | formatAmount(8)
                        }}
                      </a>
                      <span
                        v-if="
                          (item.status &&
                            Object.keys(item.status)[0] !== 'TxSent' &&
                            Object.keys(item.status)[0] !== 'TxFinalized') ||
                          !item.status
                        "
                      >
                        {{
                          item.amount
                            | bigintToFloat(
                              8,
                              ckTokenInfo[item.tokenId].decimals
                            )
                            | formatAmount(8)
                        }}
                      </span>
                    </span>
                    <span
                      class="base-font-title"
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        margin: 0 10px 0 20px;
                        width: 100px;
                      "
                      v-if="item.status && Object.keys(item.status)[0]"
                    >
                      {{ Object.keys(item.status)[0]
                      }}<span
                        class="loading-spinner"
                        v-show="
                          item.status &&
                          ['Pending', 'TxCreated', 'TxSent'].includes(
                            Object.keys(item.status)[0]
                          )
                        "
                      ></span>
                    </span>
                    <button
                      @click="toActive('retrieveCKETH', item.tokenId)"
                      class="primary"
                      v-if="
                        !item.status ||
                        (item.status &&
                          Object.keys(item.status)[0] &&
                          Object.keys(item.status)[0] !== 'TxFinalized' &&
                          Object.keys(item.status)[0] !== 'NotFound')
                      "
                    >
                      View
                    </button>
                  </div>
                </div>
                <div
                  v-if="
                    activePending.CKETHResponse &&
                    activePending.CKETHResponse.length
                  "
                >
                  <div
                    :key="index"
                    style="color: #adb7c2"
                    v-for="(item, index) in activePending.CKETHResponse.slice(
                      (CKETHResponsePage - 1) * 10,
                      CKETHResponsePage * 10
                    )"
                  >
                    <div
                      class="active-pending-item"
                      v-if="item.type === 'BTCRetrieve'"
                    >
                      <span style="width: 170px" v-if="item.time">
                        {{ item.time | formatDateToCalendar }}
                      </span>
                      <span> ckBTC(IC Network) </span>
                      &nbsp;->&nbsp;
                      <span> BTC </span>
                      <span class="margin-left-auto">
                        <a
                          :href="`https://www.blockchain.com/btc/tx/${getRetrieveBtcTxidResponse(
                            item.status
                          )}`"
                          class="link"
                          rel="nofollow noreferrer noopener"
                          target="_blank"
                          v-if="getRetrieveBtcTxidResponse(item.status)"
                        >
                          {{
                            getRetrieveBtcTxidResponse(item.status)
                              | ellipsisAccount()
                          }}
                        </a>
                      </span>
                      <span
                        :class="{
                          'base-green':
                            Object.keys(item.status)[0] === 'Confirmed'
                        }"
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: flex-end;
                          margin: 0 10px 0 20px;
                          width: 100px;
                        "
                      >
                        <span>
                          {{ item.status && Object.keys(item.status)[0] }}
                        </span>
                        <span
                          class="loading-spinner"
                          v-show="
                            item.status &&
                            [
                              'Pending',
                              'Sending',
                              'Submitted',
                              'Signing'
                            ].includes(Object.keys(item.status)[0])
                          "
                        ></span>
                      </span>
                      <button
                        @click="toActive('BTCRetrieve', null)"
                        class="primary"
                        v-show="
                          !item.status ||
                          (item.status &&
                            Object.keys(item.status)[0] &&
                            Object.keys(item.status)[0] !== 'Confirmed' &&
                            Object.keys(item.status)[0] !== 'NotFound' &&
                            Object.keys(item.status)[0] !== 'AmountTooLow')
                        "
                      >
                        View
                      </button>
                    </div>
                    <div
                      class="active-pending-item"
                      v-if="item.type === 'BTCMint'"
                    >
                      <span style="width: 170px" v-if="item.time">
                        {{ item.time | formatDateToCalendar }}
                      </span>
                      <span> BTC </span>
                      &nbsp;->&nbsp;
                      <span> ckBTC(IC Network) </span>
                      <div class="margin-left-auto">
                        <div :key="index" v-for="(out, index) in item.vout">
                          <a
                            :href="`https://www.blockchain.com/btc/tx/${item.txid}`"
                            class="link"
                            rel="nofollow noreferrer noopener"
                            target="_blank"
                            v-show="out.scriptpubkey_address === BTCAddressCk"
                            >{{
                              out.value | bigintToFloat(8, 8) | formatAmount(8)
                            }}
                          </a>
                        </div>
                      </div>
                      <span
                        :class="{
                          'base-green':
                            item.status.block_height &&
                            item.status.block_height <= updateCkBlockHeight
                        }"
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: flex-end;
                          margin: 0 10px 0 20px;
                          width: 100px;
                        "
                        v-show="
                          item.status.block_height &&
                          item.status.block_height <= updateCkBlockHeight
                        "
                      >
                        {{ filterStatus(item.status.block_height) }}
                        <span
                          v-if="
                            item.status.block_height &&
                            blockCount - item.status.block_height < 11
                          "
                        >
                          ({{ blockCount - item.status.block_height + 1 }})
                        </span>
                      </span>
                      <button
                        @click="toActive('mintCKBTC', null)"
                        class="primary"
                        style="margin-left: 40px"
                        v-show="
                          !(
                            item.status.block_height &&
                            item.status.block_height <= updateCkBlockHeight
                          )
                        "
                      >
                        View
                      </button>
                    </div>
                    <div
                      class="active-pending-item"
                      v-if="item.type === 'mint'"
                    >
                      <span style="width: 170px" v-if="item.time">
                        {{ item.time | formatDateToCalendar }}
                      </span>
                      <span v-if="ckTokenInfo[item.tokenId]">
                        {{ ckTokenInfo[item.tokenId].symbol }}
                      </span>
                      &nbsp;->&nbsp;
                      <span v-if="ckTokenInfo[item.tokenId]">
                        {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
                      </span>
                      <span class="margin-left-auto">
                        <a
                          :href="`${ckEthLink}/tx/${item.txHash}`"
                          class="link"
                          rel="nofollow noreferrer noopener"
                          target="_blank"
                        >
                          {{
                            item.amount
                              | bigintToFloat(
                                8,
                                ckTokenInfo[item.tokenId].decimals
                              )
                              | formatAmount(8)
                          }}
                        </a>
                      </span>
                      <span
                        class="base-font-title"
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: flex-end;
                          margin: 0 10px 0 20px;
                          width: 100px;
                        "
                      >
                        <span v-show="!item.blockNumber">
                          Pending<span class="loading-spinner"></span
                        ></span>
                        <span
                          class="base-green"
                          v-show="
                            lastScrapedBlockNumber &&
                            item.blockNumber &&
                            lastScrapedBlockNumber >= Number(item.blockNumber)
                          "
                        >
                          Confirmed
                        </span>
                        <span
                          v-show="
                            lastScrapedBlockNumber &&
                            item.blockNumber &&
                            lastScrapedBlockNumber < Number(item.blockNumber)
                          "
                        >
                          Submitted<span class="loading-spinner"></span>
                        </span>
                      </span>
                      <button
                        @click="toActive('mintCKETH', item.tokenId)"
                        class="primary"
                        v-show="
                          !(
                            lastScrapedBlockNumber &&
                            item.blockNumber &&
                            lastScrapedBlockNumber >= Number(item.blockNumber)
                          )
                        "
                      >
                        View
                      </button>
                    </div>
                    <div
                      class="active-pending-item"
                      v-if="item.type === 'retrieve'"
                    >
                      <span style="width: 170px" v-if="item.time">
                        {{ item.time | formatDateToCalendar }}
                      </span>
                      <span v-if="ckTokenInfo[item.tokenId]">
                        {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
                      </span>
                      &nbsp;->&nbsp;
                      <span v-if="ckTokenInfo[item.tokenId]">
                        {{ ckTokenInfo[item.tokenId].symbol }}
                      </span>
                      <span
                        class="margin-left-auto"
                        v-if="ckTokenInfo[item.tokenId]"
                      >
                        <a
                          :href="`${ckEthLink}/tx/${
                            Object.values(item.status)[0].transaction_hash
                          }`"
                          class="link"
                          rel="nofollow noreferrer noopener"
                          target="_blank"
                          v-if="
                            item.status &&
                            Object.keys(item.status)[0] === 'TxSent'
                          "
                        >
                          {{
                            item.amount
                              | bigintToFloat(
                                8,
                                ckTokenInfo[item.tokenId].decimals
                              )
                              | formatAmount(8)
                          }}
                        </a>
                        <a
                          :href="`${ckEthLink}/tx/${
                            Object.values(item.status)[0].Success
                              .transaction_hash
                          }`"
                          class="link"
                          rel="nofollow noreferrer noopener"
                          target="_blank"
                          v-if="
                            item.status &&
                            Object.keys(item.status)[0] === 'TxFinalized' &&
                            Object.values(item.status)[0] &&
                            Object.values(item.status)[0].Success &&
                            Object.values(item.status)[0].Success
                              .transaction_hash
                          "
                        >
                          {{
                            item.amount
                              | bigintToFloat(
                                8,
                                ckTokenInfo[item.tokenId].decimals
                              )
                              | formatAmount(8)
                          }}
                        </a>
                        <span
                          v-if="
                            (item.status &&
                              Object.keys(item.status)[0] !== 'TxSent' &&
                              Object.keys(item.status)[0] !== 'TxFinalized') ||
                            !item.status
                          "
                        >
                          {{
                            item.amount
                              | bigintToFloat(
                                8,
                                ckTokenInfo[item.tokenId].decimals
                              )
                              | formatAmount(8)
                          }}
                        </span>
                      </span>
                      <span
                        :class="{
                          'base-green':
                            Object.keys(item.status)[0] === 'TxFinalized'
                        }"
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: flex-end;
                          margin: 0 10px 0 20px;
                          width: 100px;
                        "
                        v-if="item.status && Object.keys(item.status)[0]"
                      >
                        {{ Object.keys(item.status)[0]
                        }}<span
                          class="loading-spinner"
                          v-show="
                            item.status &&
                            ['Pending', 'TxCreated', 'TxSent'].includes(
                              Object.keys(item.status)[0]
                            )
                          "
                        ></span>
                      </span>
                      <button
                        @click="toActive('retrieveCKETH', item.tokenId)"
                        class="primary"
                        v-if="
                          !item.status ||
                          (item.status &&
                            Object.keys(item.status)[0] &&
                            Object.keys(item.status)[0] !== 'TxFinalized' &&
                            Object.keys(item.status)[0] !== 'NotFound')
                        "
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div class="pagination-transaction-main">
                    <a-pagination
                      :current="CKETHResponsePage"
                      :default-page-size="10"
                      :total="activePending.CKETHResponse.length"
                      @change="pageChangeCKETHResponse"
                      class="pagination-transaction"
                      style="margin-right: 10px"
                      v-if="activePending.CKETHResponse.length > 10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transfer-icp
      :balance="balance"
      @transferSuccess="transferSuccess"
      ref="transferIcp"
    ></transfer-icp>
    <transfer-token
      :current-token="currentToken"
      @transferTokenSuccess="transferTokenSuccess"
      ref="transferToken"
    ></transfer-token>
    <top-up
      :balance="balance"
      :type="topUpType"
      :walletId="walletId"
      @topUpSuccess="topUpSuccess"
      ref="topUp"
      v-if="type === 'ic'"
    ></top-up>
    <receive-modal ref="receiveModal"></receive-modal>
    <a-modal
      :after-close="afterRetrieveCloseCKETH"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="transfer-modal forge-modal dissolve-modal forge-modal-eth"
      v-model="retrieveModalCKETH"
      width="750px"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">{{ retrieveTitleETH }}</div>
      </div>
      <div
        class="step-list"
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
      >
        <span
          :class="{ active: retrieveStep > 1 }"
          @click="previousRetrieveStepCK()"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          :class="{ active: retrieveStep === 1 }"
          @click="changeRetrieveStepCK(1)"
          class="pointer"
        >
          <span class="step-list-num">1</span><span>Retrieve</span>
        </div>
        <div
          :class="{ active: retrieveStep === 2 }"
          @click="changeRetrieveStepCK(2)"
          class="pointer step-list-center"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t"
            ><span class="step-list-num">2</span>Records</span
          >
        </div>
        <span
          :class="{ active: retrieveStep < 2 }"
          @click="nextRetrieveStepCK(2)"
          class="step-next pc-show"
          ><a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" /> </a-tooltip
        ></span>
      </div>
      <div
        class="forge-main"
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
      >
        <div class="w100" v-show="retrieveStep === 1">
          <a-form-model
            :model="ethDissolveFormCK"
            :rules="ethDissolveFormCKRules"
            ref="ethDissolveFormCK"
          >
            <a-form-model-item
              :label="`Destination ${icNetworkTokens.icTokenInfo.symbol} (${
                networkIds[otherNetworkTokens.networkId]
              }) address`"
              prop="address"
            >
              <a-input
                :placeholder="`${icNetworkTokens.icTokenInfo.symbol} (${
                  networkIds[otherNetworkTokens.networkId]
                }) address`"
                autocomplete="off"
                type="text"
                v-model="ethDissolveFormCK.address"
              />
            </a-form-model-item>
            <a-form-model-item :colon="false" prop="retrieveAmount">
              <template slot="label"
                >Amount:&nbsp;<span class="label-tip"
                  >(includes network fees)</span
                >
              </template>
              <a-input
                autocomplete="off"
                min="0"
                placeholder="0.00"
                type="text"
                v-model="ethDissolveFormCK.retrieveAmount"
                v-only-float="icNetworkTokens.icTokenInfo.decimals"
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
                  class="reload-icon"
                  type="reload"
                  v-show="!refreshCkETHBalanceLoading"
                />
                <a-icon
                  class="reload-icon"
                  type="loading"
                  v-show="refreshCkETHBalanceLoading"
                />
                <span
                  @click="setMaxETHRetrieve('ck')"
                  class="transfer-balance-max pc-show"
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
              :to="`/ICDex/${icNetworkTokens.symbol}/ICP`"
              class="transfer-balance-right pc-show"
              v-show="
                !icNetworkTokens.symbol.toLocaleLowerCase().includes('usdc') &&
                !icNetworkTokens.symbol.toLocaleLowerCase().includes('usdt')
              "
            >
              Trade
            </router-link>
          </div>
          <button
            :disabled="!canRetrieveCkerc20"
            @click="retrieveCkETH"
            class="primary retrieve-button w100 mt20"
            type="button"
          >
            Retrieve
            <div v-if="!canRetrieveCkerc20">
              &nbsp;(You should have at least {{ ckerc20RetrieveFee }} ETH.)
            </div>
          </button>
          <div
            style="margin-top: 5px"
            v-if="
              icNetworkTokens.icTokenInfo.type &&
              icNetworkTokens.icTokenInfo.type === 'dfinityERC20' &&
              !canRetrieveCkerc20
            "
          >
            <div
              class="flex-auto"
              v-if="
                icNetworkTokens.networkToIcId === '3' &&
                tokens &&
                tokens['apia6-jaaaa-aaaar-qabma-cai']
              "
            >
              {{ tokens['apia6-jaaaa-aaaar-qabma-cai'].symbol }} Balance:
              <div class="balance base-font-normal">
                <span>
                  &nbsp;{{
                    ERC20Balance['apia6-jaaaa-aaaar-qabma-cai']
                      | bigintToFloat(
                        8,
                        tokens['apia6-jaaaa-aaaar-qabma-cai'].decimals
                      )
                      | formatAmount(8)
                  }}&nbsp;
                </span>
              </div>
              {{ tokens['apia6-jaaaa-aaaar-qabma-cai'].symbol }} ({{
                networkIds[icNetworkTokens.networkId]
              }})&nbsp;
            </div>
            <div
              class="flex-auto"
              v-if="
                icNetworkTokens.networkToIcId === '1' &&
                tokens &&
                tokens['ss2fx-dyaaa-aaaar-qacoq-cai']
              "
            >
              {{ tokens['ss2fx-dyaaa-aaaar-qacoq-cai'].symbol }} Balance:
              <div class="balance base-font-normal">
                <span>
                  {{
                    ERC20Balance['ss2fx-dyaaa-aaaar-qacoq-cai']
                      | bigintToFloat(
                        8,
                        tokens['ss2fx-dyaaa-aaaar-qacoq-cai'].decimals
                      )
                      | formatAmount(8)
                  }}
                </span>
              </div>
              {{ tokens['ss2fx-dyaaa-aaaar-qacoq-cai'].symbol }} ({{
                networkIds[icNetworkTokens.networkId]
              }})&nbsp;
            </div>
          </div>
        </div>
        <div
          class="forge-right retrieve-btc-status"
          v-show="retrieveStep === 2"
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
                  :key="index"
                  v-for="(item, index) in ckETHRetrieve.slice(
                    (ckETHMintPage - 1) * 5,
                    ckETHMintPage * 5
                  )"
                >
                  <td>
                    <a
                      :href="`${ckEthLink}/address/${item.recipient}`"
                      class="link"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
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
                        class="loading-spinner"
                        v-show="
                          item.status &&
                          ['Pending', 'TxCreated', 'TxSent'].includes(
                            Object.keys(item.status)[0]
                          )
                        "
                      ></span>
                    </span>
                  </td>
                  <td>
                    <a
                      :href="`${ckEthLink}/tx/${getCKETHRetrieveTxid(
                        item.status
                      )}`"
                      class="link"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                      v-if="getCKETHRetrieveTxid(item.status)"
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
            <li style="justify-content: center" v-show="!ckETHRetrieve.length">
              No records
            </li>
            <li
              :key="index"
              v-for="(item, index) in ckETHRetrieve.slice(
                (ckETHMintPage - 1) * 5,
                ckETHMintPage * 5
              )"
            >
              <div class="li-h5-item">
                <span class="li-left">Recipient:</span>
                <span class="margin-left-auto">
                  <a
                    :href="`${ckEthLink}/address/${item.recipient}`"
                    class="link"
                    rel="nofollow noreferrer noopener"
                    target="_blank"
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
                    class="loading-spinner"
                    v-show="
                      item.status &&
                      ['Pending', 'TxCreated', 'TxSent'].includes(
                        Object.keys(item.status)[0]
                      )
                    "
                  ></span>
                </span>
              </div>
              <div class="li-h5-item">
                <span class="li-left">Txid:</span>
                <span class="margin-left-auto">
                  <a
                    :href="`${ckEthLink}/tx/${getCKETHRetrieveTxid(
                      item.status
                    )}`"
                    class="link"
                    rel="nofollow noreferrer noopener"
                    target="_blank"
                    v-if="getCKETHRetrieveTxid(item.status)"
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
              :current="ckETHMintPage"
              :default-page-size="5"
              :total="ckETHRetrieve.length"
              @change="pageChangeCKETHMint"
              class="pagination-transaction"
              v-if="ckETHRetrieve.length > 5"
            />
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      :after-close="afterForgeCloseCKETH"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="transfer-modal forge-modal forge-modal-eth"
      v-model="forgeModalCKETH"
      width="680px"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">{{ forgeTitleETH }}</div>
      </div>
      <div class="step-list">
        <span
          :class="{ active: mintStep > 1 }"
          @click="previousMintStepCK()"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          :class="{ active: mintStep === 1 }"
          @click="changeMintStepCK(1)"
          class="pointer"
        >
          <span class="step-list-num">1</span><span>Send</span>
        </div>
        <div
          :class="{ active: mintStep === 2 }"
          @click="changeMintStepCK(2)"
          class="pointer step-list-center"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t">
            <span class="step-list-num">2</span><span>Records</span></span
          >
        </div>
        <span
          :class="{ active: mintStep < 2 }"
          @click="nextMintStepCK(2)"
          class="step-next pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" />
          </a-tooltip>
        </span>
      </div>
      <div
        class="ckEth-mint-top"
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo && mintStep === 2"
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
            class="reload-icon"
            type="reload"
            v-show="!refreshCkETHBalanceLoading"
          />
          <a-icon
            class="reload-icon"
            type="loading"
            v-show="refreshCkETHBalanceLoading"
          />
        </div>
        <div class="base-font-title" v-show="ckETHBlockNum">
          Latest Block Number: {{ ckETHBlockNum }}
        </div>
        <div class="base-font-title" v-show="lastScrapedBlockNumber">
          Latest Accepted Deposit Block Number: {{ lastScrapedBlockNumber }}
        </div>
      </div>
      <div
        class="forge-main"
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
      >
        <div class="forge-left" v-show="mintStep === 1">
          <a-form-model
            :model="erc20Form"
            :rules="erc20FormRules"
            ref="erc20Form"
            v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
          >
            <a-form-model-item
              :label="`Transfer ${icNetworkTokens.icTokenInfo.symbol} (${
                networkIds[otherNetworkTokens.networkId]
              }) amount`"
              prop="amount"
            >
              <a-input
                :suffix="`${icNetworkTokens.icTokenInfo.symbol} (${
                  networkIds[otherNetworkTokens.networkId]
                })`"
                autocomplete="off"
                placeholder="0.00"
                type="text"
                v-model="erc20Form.amount"
                v-only-float="Number(icNetworkTokens.icTokenInfo.decimals)"
              />
            </a-form-model-item>
          </a-form-model>
          <div class="mint-button">
            <button
              @click="transferFromMetaMaskCK"
              class="primary w100"
              type="button"
            >
              <img alt="" src="@/assets/img/MetaMask.png" /> Send with MetaMask
            </button>
          </div>
        </div>
        <div class="forge-right retrieve-btc-status" v-show="mintStep === 2">
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
                  :key="item.txHash"
                  v-for="item in ckETHMint.slice(
                    (ckETHMintPage - 1) * 5,
                    ckETHMintPage * 5
                  )"
                >
                  <td>
                    <a
                      :href="`${ckEthLink}/tx/${item.txHash}`"
                      class="link"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
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
                      <span class="base-red" v-if="item.txStatus">{{
                        item.txStatus
                      }}</span>
                      <span v-if="!item.txStatus && item.blockNum">
                        <span
                          v-if="lastScrapedBlockNumber >= Number(item.blockNum)"
                          >Confirmed</span
                        >
                        <span class="flex-center" v-else
                          >Submitted <span class="loading-spinner"></span
                        ></span>
                      </span>
                      <span
                        class="flex-center"
                        v-if="!item.txStatus && !item.blockNum"
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
            <li style="justify-content: center" v-show="!ckETHMint.length">
              No records
            </li>
            <li
              :key="item.txHash"
              v-for="item in ckETHMint.slice(
                (ckETHMintPage - 1) * 5,
                ckETHMintPage * 5
              )"
            >
              <div class="li-h5-item">
                <span class="li-left">TxHash:</span>
                <span class="margin-left-auto">
                  <a
                    :href="`${ckEthLink}/tx/${item.txHash}`"
                    class="link"
                    rel="nofollow noreferrer noopener"
                    target="_blank"
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
                    <span v-if="item.txStatus">{{ item.txStatus }}</span>
                    <span v-if="!item.txStatus && item.blockNum">
                      <span
                        v-if="lastScrapedBlockNumber >= Number(item.blockNum)"
                        >Confirmed</span
                      >
                      <span class="flex-center" v-else
                        >Submitted <span class="loading-spinner"></span
                      ></span>
                    </span>
                    <span
                      class="flex-center"
                      v-if="!item.txStatus && !item.blockNum"
                      >Pending <span class="loading-spinner"></span
                    ></span>
                  </span>
                </span>
              </div>
            </li>
          </ul>
          <div class="pagination-transaction-main">
            <a-pagination
              :current="ckETHMintPage"
              :default-page-size="5"
              :total="ckETHMint.length"
              @change="pageChangeCKETHMint"
              class="pagination-transaction"
              v-if="ckETHMint.length > 5"
            />
          </div>
        </div>
        <div class="step-footer-confirmation" v-show="mintStep === 2">
          Wait for 64-96 confirmations (~12.8-19.2 minutes) to finalize.
        </div>
      </div>
    </a-modal>
    <a-modal
      :after-close="afterForgeCloseETH"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="transfer-modal forge-modal forge-modal-eth"
      v-model="forgeModalETH"
      width="680px"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">{{ forgeTitleETH }}</div>
      </div>
      <div class="step-list">
        <span
          :class="{ active: mintStep > 1 }"
          @click="previousMintStep()"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          :class="{ active: mintStep === 1 }"
          @click="changeMintStep(1)"
          class="pointer"
        >
          <span class="step-list-num">1</span><span>Send</span>
        </div>
        <div
          :class="{ active: mintStep === 2 }"
          @click="changeMintStep(2)"
          class="pointer step-list-center"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t"
            ><span class="step-list-num">2</span>Mint</span
          >
          <span class="step-list-line"></span>
        </div>
        <div
          :class="{ active: mintStep === 3 }"
          @click="changeMintStep(3)"
          class="pointer"
        >
          <span class="step-list-num">3</span><span>Records</span>
        </div>
        <span
          :class="{ active: mintStep < 3 }"
          @click="nextMintStep(3)"
          class="step-next pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" />
          </a-tooltip>
        </span>
      </div>
      <div
        class="forge-main"
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
      >
        <div class="forge-left" v-show="mintStep === 1">
          <a-form-model
            :model="erc20Form"
            :rules="erc20FormRules"
            ref="erc20Form"
            v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
          >
            <a-form-model-item
              :label="`Transfer ${icNetworkTokens.icTokenInfo.symbol} (${
                networkIds[otherNetworkTokens.networkId]
              }) amount`"
              prop="amount"
            >
              <a-input
                :suffix="`${icNetworkTokens.icTokenInfo.symbol} (${
                  networkIds[otherNetworkTokens.networkId]
                })`"
                autocomplete="off"
                placeholder="0.00"
                type="text"
                v-model="erc20Form.amount"
                v-only-float="Number(icNetworkTokens.icTokenInfo.decimals)"
              />
            </a-form-model-item>
          </a-form-model>
          <div class="mint-button">
            <button
              @click="transferFromMetaMask"
              class="primary w100"
              type="button"
              v-show="depositMethod === 2"
            >
              <img alt="" src="@/assets/img/MetaMask.png" /> Send with MetaMask
            </button>
            <button
              @click="transferFromOther"
              type="button"
              v-show="depositMethod === 1"
            >
              Send with other wallets
            </button>
            <button
              @click="transferFromMetaMask"
              class="primary"
              type="button"
              v-show="depositMethod === 1"
            >
              <img alt="" src="@/assets/img/MetaMask.png" /> Send with MetaMask
            </button>
          </div>
        </div>
        <div class="forge-right" v-show="mintStep === 2">
          <div
            class="btc-txs"
            style="margin-bottom: 20px"
            v-show="depositMethod === 1"
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
                @click="forgeModalTransactions = true"
                class="margin-left-auto pointer"
                style="color: #1996c4; font-size: 12px"
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
              :disabled="depositDisabled"
              @click="depositETH()"
              class="primary w100"
              style="height: 36px; margin-top: 30px"
              type="button"
              v-if="minterInfo"
            >
              Mint {{ icNetworkTokens.symbol }} ({{
                networkIds[icNetworkTokens.networkId]
              }})
              <span
                class="loading-spinner"
                v-show="
                  depositDisabled && (pendingLoading || depositing.length)
                "
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
                class="reload-icon"
                type="reload"
                v-show="!refreshCkETHBalanceLoading"
              />
              <a-icon
                class="reload-icon"
                type="loading"
                v-show="refreshCkETHBalanceLoading"
              />
            </div>
          </div>
          <div
            class="btc-txs"
            style="margin-bottom: 20px"
            v-show="depositMethod === 2"
          >
            <div class="btc-txs-header base-font-title" style="font-size: 18px">
              Signature
              <span
                @click="claimModalTransactions = true"
                class="margin-left-auto pointer"
                style="color: #1996c4; font-size: 14px"
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
                <span>{{ principal }}</span>
              </div>
            </div>
            <a-form-model
              :model="signatureForm"
              :rules="signatureFormRules"
              ref="signatureForm"
            >
              <a-form-model-item label="TxHash" prop="txHash">
                <a-input
                  @change="txHashChange"
                  autocomplete="off"
                  placeholder="TxHash"
                  type="text"
                  v-model="signatureForm.txHash"
                />
              </a-form-model-item>
            </a-form-model>
            <div
              class="base-red"
              style="margin-top: -22px"
              v-show="claimTxError"
            >
              {{ claimTxError }}
            </div>
            <div style="margin-bottom: 20px" v-if="minterInfo">
              Estimated network fee:
              {{ filterEstimatedFeeMode2(icNetworkTokens.icTokenInfo) }}
              {{ icNetworkTokens.symbol }} ({{
                networkIds[icNetworkTokens.networkId]
              }})
            </div>
            <div class="mint-button">
              <button
                :disabled="!(signatureForm.txHash && !claimTxError)"
                class="primary w100"
                style="height: 36px"
                type="button"
                v-debounce="onClaim"
                v-show="depositMethod === 2"
              >
                Claim &nbsp;<a-icon
                  class="reload-icon"
                  type="loading"
                  v-show="
                    claimTxError &&
                    !claimTxError.includes('Invalid transaction') &&
                    !claimTxError.includes('The amount is too low') &&
                    !claimTxError.includes('Invalid txHash')
                  "
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
                class="reload-icon"
                type="reload"
                v-show="!refreshCkETHBalanceLoading"
              />
              <a-icon
                class="reload-icon"
                type="loading"
                v-show="refreshCkETHBalanceLoading"
              />
            </div>
          </div>
        </div>
        <div class="forge-right retrieve-btc-status" v-show="mintStep === 3">
          <ul class="retrieve-btc-status-ul-table">
            <!--<li>
              <div style="width: 15%">TxIndex</div>
              <div style="width: 35%">Amount</div>
              <div style="width: 25%">Address</div>
              <div style="width: 25%">TxHash</div>
            </li>-->
            <li
              :key="index"
              class="retrieve-btc-status-ul-table-eth"
              style="align-items: flex-start"
              v-for="(item, index) in mintEvent.slice(
                (mintEventPage - 1) * mintEventPageSize,
                mintEventPage * mintEventPageSize
              )"
            >
              Mint&nbsp;&nbsp;
              <div
                class="retrieve-btc-status-flex"
                v-if="depositMethod === 1 && item[1] && item[1].depositResult"
              >
                <div class="eth-tx-hash" v-if="item[1].depositResult.ok">
                  <div
                    v-if="
                      item[1].depositResult.ok.txid &&
                      item[1].depositResult.ok.txid.length
                    "
                  >
                    <a
                      :href="`${ethLink}/tx/${hash}`"
                      :key="hash"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                      v-for="hash in item[1].depositResult.ok.txid"
                    >
                      {{ hash | ellipsisAccount() }}
                    </a>
                  </div>
                </div>
              </div>
              <div
                class="retrieve-btc-status-flex"
                v-if="depositMethod === 2 && item[0].claimDepositResult"
              >
                <div class="eth-tx-hash" v-if="item[0].claimDepositResult.ok">
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
            class="no-retrieve-btc-status-ul"
            style="display: flex"
            v-if="!mintEvent.length"
          >
            No Record
          </div>
          <div class="pagination-transaction-main mt20">
            <a-pagination
              :current="mintEventPage"
              :default-page-size="mintEventPageSize"
              :total="mintEvent.length"
              @change="mintEventPageChange"
              class="pagination-transaction"
              v-if="mintEvent.length > mintEventPageSize"
            />
          </div>
        </div>
      </div>
      <div
        class="forge-main mt20"
        v-show="
          mintStep === 2 &&
          depositMethod === 2 &&
          depositingInfo &&
          depositingInfo[0]
        "
      >
        <div
          class="btc-txs retrieve-btc-status"
          v-if="depositingInfo && depositingInfo[0]"
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
        class="forge-main mt20"
        v-show="mintStep === 2 && depositMethod === 1 && depositing.length"
      >
        <div
          class="btc-txs retrieve-btc-status"
          v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
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
                    type="info-circle"
                    v-show="
                      Object.keys(icNetworkTokens.icTokenInfo.std)[0] ===
                      'ERC20'
                    "
                  />
                </a-tooltip>
              </div>
              <div class="cell" style="width: 80px">Status</div>
            </li>
            <li
              :key="index"
              style="font-size: 12px"
              v-for="(item, index) in depositing"
            >
              <div class="cell" style="width: 70px">
                {{ item.txIndex }}
              </div>
              <div class="cell retrieve-btc-status-flex" style="width: 130px">
                <div class="eth-tx-hash">
                  <div v-if="item.txHash && item.txHash.length">
                    <a
                      :href="`${ethLink}/tx/${hash}`"
                      :key="hash"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                      v-for="hash in item.txHash"
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
              <div
                class="cell"
                style="align-items: center; width: 80px; text-align: right"
              >
                <span>
                  {{ Object.keys(item.status)[0] }}
                </span>
                <span
                  class="loading-spinner"
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
                ></span>
              </div>
            </li>
            <li
              class="base-font-title"
              style="justify-content: center; margin-top: 10px; font-size: 14px"
              v-if="!depositing.length"
            >
              No data
            </li>
          </ul>
          <ul class="h5-show">
            <li
              :key="index"
              style="font-size: 12px"
              v-for="(item, index) in depositing"
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
                      :href="`${ethLink}/tx/${hash}`"
                      :key="hash"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                      v-for="hash in item.txHash"
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
                  class="loading-spinner"
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
                ></span>
              </div>
            </li>
            <li
              class="base-font-title"
              style="justify-content: center; margin-top: 10px; font-size: 14px"
              v-if="!depositing.length"
            >
              No data
            </li>
          </ul>
        </div>
      </div>
      <div
        class="step-footer-confirmation"
        v-if="
          mintStep === 2 &&
          minterInfo &&
          icNetworkTokens &&
          icNetworkTokens.icTokenInfo
        "
      >
        Wait for {{ minterInfo.minConfirmations }} confirmations, then submit to
        mint {{ icNetworkTokens.symbol }} ({{
          networkIds[icNetworkTokens.networkId]
        }}).
      </div>
    </a-modal>
    <a-modal
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="transfer-modal forge-modal forge-modal-eth active-pending-modal"
      v-model="forgeModalTransactions"
      width="750px"
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
          <a-spin :spinning="showCkETHTransactions" class="btc-txs-ul-spin">
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
                :key="tx.hash"
                v-for="tx in ckETHTransactions[icNetworkTokens.tokenId].slice(
                  (ckETHTransactionsPage - 1) * ckETHTransactionsPageSize,
                  ckETHTransactionsPage * ckETHTransactionsPageSize
                )"
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
                      :href="`${ethLink}/tx/${tx.hash}`"
                      class="margin-left-auto"
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
                      type="check-circle"
                      v-show="
                        tx.blockNumber &&
                        Number(tx.blockNumber) <=
                          updateCkETHBlockHeight[icNetworkTokens.tokenId]
                      "
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
                :key="tx.hash"
                v-for="tx in ckETHTransactions[icNetworkTokens.tokenId].slice(
                  (ckETHTransactionsPage - 1) * ckETHTransactionsPageSize,
                  ckETHTransactionsPage * ckETHTransactionsPageSize
                )"
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
                      type="check-circle"
                      v-show="
                        tx.blockNumber &&
                        Number(tx.blockNumber) <=
                          updateCkETHBlockHeight[icNetworkTokens.tokenId]
                      "
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
                      :href="`${ethLink}/tx/${tx.hash}`"
                      class="margin-left-auto"
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
              :current="ckETHTransactionsPage"
              :default-page-size="ckETHTransactionsPageSize"
              :total="ckETHTransactionTotal"
              @change="pageChangeETH"
              class="pagination-transaction"
              v-if="ckETHTransactionTotal > ckETHTransactionsPageSize"
            />
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      :after-close="afterForgeClose"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="transfer-modal forge-modal"
      v-model="forgeModal"
      width="750px"
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
          :class="{ active: mintStep > 1 }"
          @click="previousMintStep()"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          :class="{ active: mintStep === 1 }"
          @click="changeMintStep(1)"
          class="pointer"
        >
          <span class="step-list-num">1</span><span>Send</span>
        </div>
        <div
          :class="{ active: mintStep === 2 }"
          @click="changeMintStep(2)"
          class="pointer step-list-center"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t"
            ><span class="step-list-num">2</span>Mint</span
          >
        </div>
        <span
          :class="{ active: mintStep < 2 }"
          @click="nextMintStep(2)"
          class="step-next pc-show"
          ><a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" /> </a-tooltip
        ></span>
      </div>
      <div class="forge-main">
        <div class="forge-left" v-show="mintStep === 1">
          <div class="btc-address-code">
            <span>BTC Deposit Address</span>
            <a-spin
              :spinning="
                BTCType === BTCTypeEnum.icBTC ? !BTCAddressIc : !BTCAddressCk
              "
            >
              <img
                :src="icAccountCode"
                alt=""
                v-show="BTCType === BTCTypeEnum.icBTC"
              />
              <img
                :src="accountCode"
                alt=""
                v-show="BTCType === BTCTypeEnum.ckBTC"
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
                v-clipboard:error="onError"
                v-clipboard:success="onCopySuccess"
              />
            </div>
            <div
              class="btc-config mt20 base-font-normal"
              v-show="BTCType === BTCTypeEnum.icBTC && BTCAddressIc"
            >
              Minimum amount 0.0002 BTC, maximum amount 0.05 BTC.
            </div>
            <div
              class="btc-config mt20 base-font-normal"
              v-show="BTCType === BTCTypeEnum.ckBTC && BTCAddressCk"
            >
              KYT Fee 0.00002 BTC.
              <!--Minimum amount 0.0001 BTC.-->
            </div>
          </div>
          <!--<div class="step-footer">Step1: Send BTC to the address above.</div>-->
        </div>
        <div class="forge-right w100" v-show="mintStep === 2">
          <div class="btc-txs" style="margin-bottom: 20px">
            <div class="btc-txs-header base-font-title">
              <span
                @click="forgeModalBTCTransactions = true"
                class="margin-left-auto pointer"
                style="color: #1996c4; font-size: 12px"
              >
                Transactions
              </span>
            </div>
            <button
              @click="forge(BTCType)"
              class="primary w100"
              style="height: 36px; margin-top: 30px"
              type="button"
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
                class="reload-icon"
                type="reload"
                v-show="
                  BTCType === BTCTypeEnum.ckBTC
                    ? !refreshCkBTCBalanceLoading
                    : !refreshIcBTCBalanceLoading
                "
              />
              <a-icon
                class="reload-icon"
                type="loading"
                v-show="
                  BTCType === BTCTypeEnum.ckBTC
                    ? refreshCkBTCBalanceLoading
                    : refreshIcBTCBalanceLoading
                "
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
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="transfer-modal forge-modal forge-modal-eth active-pending-modal"
      v-model="forgeModalBTCTransactions"
      width="750px"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">BTC Latest Transactions</div>
      </div>
      <div class="forge-right">
        <div class="btc-txs">
          <a-spin
            :spinning="showBTCTransactions"
            class="btc-txs-ul-spin"
            v-show="BTCType === BTCTypeEnum.icBTC"
          >
            <ul class="btc-txs-ul" v-if="BTCTransactions.length">
              <li
                :key="tx.txid"
                v-for="tx in BTCTransactions.slice(
                  (BTCTransactionsPage - 1) * BTCTransactionsPageSize,
                  BTCTransactionsPage * BTCTransactionsPageSize
                )"
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
                      type="check-circle"
                      v-show="
                        tx.status.block_height &&
                        tx.status.block_height <= updateBlockHeight
                      "
                    />
                  </div>
                </div>
                <div class="btc-txs-info">
                  <div class="btc-txs-info-left">
                    <div>
                      <div
                        :key="account.txid"
                        v-for="(account, index) in tx.vin"
                      >
                        <div class="flex-auto">
                          <a
                            :href="`https://www.blockchain.com/btc/address/${account.prevout.scriptpubkey_address}`"
                            class="flex1"
                            rel="nofollow noreferrer noopener"
                            target="_blank"
                          >
                            {{
                              account.prevout.scriptpubkey_address
                                | ellipsisAccount(6)
                            }}
                          </a>
                          <span class="tx-balance flex1">
                            <a-icon type="arrow-right" v-show="index === 0"
                          /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      :key="index"
                      class="flex-auto flex-auto-h5"
                      v-for="(out, index) in tx.vout"
                    >
                      <a
                        :class="{
                          'out-address-m':
                            (BTCType === BTCTypeEnum.icBTC &&
                              out.scriptpubkey_address === BTCAddressIc) ||
                            (BTCType === BTCTypeEnum.ckBTC &&
                              out.scriptpubkey_address === BTCAddressCk)
                        }"
                        :href="`https://www.blockchain.com/btc/address/${out.scriptpubkey_address}`"
                        class="flex1"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                        v-show="
                          (BTCType === BTCTypeEnum.icBTC &&
                            out.scriptpubkey_address === BTCAddressIc) ||
                          (BTCType === BTCTypeEnum.ckBTC &&
                            out.scriptpubkey_address === BTCAddressCk)
                        "
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
                        :href="`https://www.blockchain.com/btc/tx/${tx.txid}`"
                        class="tx-balance out-address-m"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                        v-show="
                          (BTCType === BTCTypeEnum.icBTC &&
                            out.scriptpubkey_address === BTCAddressIc) ||
                          (BTCType === BTCTypeEnum.ckBTC &&
                            out.scriptpubkey_address === BTCAddressCk)
                        "
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
            :spinning="showCkBTCTransactions"
            class="btc-txs-ul-spin"
            v-show="BTCType === BTCTypeEnum.ckBTC"
          >
            <ul class="btc-txs-ul" v-if="ckBTCTransactions.length">
              <li
                :key="tx.txid"
                v-for="tx in ckBTCTransactions.slice(
                  (ckBTCTransactionsPage - 1) * ckBTCTransactionsPageSize,
                  ckBTCTransactionsPage * ckBTCTransactionsPageSize
                )"
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
                      type="check-circle"
                      v-show="
                        tx.status.block_height &&
                        tx.status.block_height <= updateCkBlockHeight
                      "
                    />
                  </div>
                </div>
                <div class="btc-txs-info">
                  <div class="btc-txs-info-left">
                    <div>
                      <div
                        :key="account.txid"
                        v-for="(account, index) in tx.vin"
                      >
                        <div class="flex-auto">
                          <a
                            :href="`https://www.blockchain.com/btc/address/${account.prevout.scriptpubkey_address}`"
                            class="flex1"
                            rel="nofollow noreferrer noopener"
                            target="_blank"
                          >
                            {{
                              account.prevout.scriptpubkey_address
                                | ellipsisAccount(6)
                            }}
                          </a>
                          <span class="tx-balance flex1">
                            <a-icon type="arrow-right" v-show="index === 0"
                          /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      :key="index"
                      class="flex-auto flex-auto-h5"
                      v-for="(out, index) in tx.vout"
                    >
                      <a
                        :class="{
                          'out-address-m':
                            (BTCType === BTCTypeEnum.icBTC &&
                              out.scriptpubkey_address === BTCAddressIc) ||
                            (BTCType === BTCTypeEnum.ckBTC &&
                              out.scriptpubkey_address === BTCAddressCk)
                        }"
                        :href="`https://www.blockchain.com/btc/address/${out.scriptpubkey_address}`"
                        class="flex1"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                        v-show="
                          (BTCType === BTCTypeEnum.icBTC &&
                            out.scriptpubkey_address === BTCAddressIc) ||
                          (BTCType === BTCTypeEnum.ckBTC &&
                            out.scriptpubkey_address === BTCAddressCk)
                        "
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
                        :href="`https://www.blockchain.com/btc/tx/${tx.txid}`"
                        class="tx-balance out-address-m"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                        v-show="
                          (BTCType === BTCTypeEnum.icBTC &&
                            out.scriptpubkey_address === BTCAddressIc) ||
                          (BTCType === BTCTypeEnum.ckBTC &&
                            out.scriptpubkey_address === BTCAddressCk)
                        "
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
              :current="BTCTransactionsPage"
              :default-page-size="BTCTransactionsPageSize"
              :total="BTCTransactionTotal"
              @change="pageChange"
              class="pagination-transaction"
              v-if="
                BTCTransactionTotal > BTCTransactionsPageSize &&
                BTCType === BTCTypeEnum.icBTC
              "
            />
            <a-pagination
              :current="ckBTCTransactionsPage"
              :default-page-size="ckBTCTransactionsPageSize"
              :total="ckBTCTransactionTotal"
              @change="pageChange"
              class="pagination-transaction"
              v-if="
                ckBTCTransactionTotal > ckBTCTransactionsPageSize &&
                BTCType === BTCTypeEnum.ckBTC
              "
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
      :after-close="afterClose"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="transfer-modal forge-modal dissolve-modal"
      v-model="dissolveModal"
      width="750px"
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
          :class="{ active: retrieveStep > 1 }"
          @click="previousRetrieveStep()"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          :class="{ active: retrieveStep === 1 }"
          @click="retrieveStep = 1"
          class="pointer"
        >
          <span class="step-list-num">1</span><span>Transfer</span>
        </div>
        <div
          :class="{ active: retrieveStep === 2 }"
          @click="retrieveStep = 2"
          class="pointer step-list-center"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t"
            ><span class="step-list-num">2</span>Retrieve</span
          >
          <span class="step-list-line"></span>
        </div>
        <div
          :class="{ active: retrieveStep === 3 }"
          @click="retrieveStep = 3"
          class="pointer"
        >
          <span class="step-list-num">3</span><span>Records</span>
        </div>
        <span
          :class="{ active: retrieveStep < 3 }"
          @click="nextRetrieveStep(3)"
          class="step-next pc-show"
          ><a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" /> </a-tooltip
        ></span>
      </div>
      <a-spin :spinning="!withdrawalAccount" class="dissolve-modal-spin">
        <div class="forge-main">
          <div class="forge-left" v-show="retrieveStep === 1">
            <div>
              <div>
                <div class="base-font-title">
                  Transfer {{ BTCType }} to retrieving account:
                </div>
              </div>
              <a-form-model
                :model="dissolveForm"
                :rules="dissolveFormRules"
                ref="form"
              >
                <a-form-model-item :colon="false" prop="amount">
                  <template slot="label"
                    >Amount:&nbsp;<span class="label-tip"
                      >(includes bitcoin network fees)</span
                    >
                  </template>
                  <a-input
                    autocomplete="off"
                    min="0"
                    placeholder="0.00"
                    type="text"
                    v-model="dissolveForm.amount"
                    v-only-float="8"
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
                      class="reload-icon"
                      type="reload"
                      v-show="
                        BTCType === BTCTypeEnum.ckBTC
                          ? !refreshCkBTCBalanceLoading
                          : !refreshIcBTCBalanceLoading
                      "
                    />
                    <a-icon
                      class="reload-icon"
                      type="loading"
                      v-show="
                        BTCType === BTCTypeEnum.ckBTC
                          ? refreshCkBTCBalanceLoading
                          : refreshIcBTCBalanceLoading
                      "
                    />
                    <span
                      @click="setMaxRetrieve"
                      class="transfer-balance-max pc-show"
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
                  :to="`/ICDex/${BTCType}/ICP`"
                  class="transfer-balance-right pc-show"
                >
                  Trade
                </router-link>
              </div>
              <button
                @click="transferCkBTC"
                class="primary retrieve-button w100 mt20"
                type="button"
              >
                Transfer {{ BTCType }}
              </button>
            </div>
          </div>
          <div class="w100" v-show="retrieveStep === 2">
            <div>
              <!--<div class="base-font-title">Retrieve BTC:</div>-->
              <div class="ic-btc-tip" v-show="BTCType === BTCTypeEnum.icBTC">
                icBTC only supports P2PKH addresses (Legacy addresses, starting
                with "1" prefix on the Bitcoin mainnet).
              </div>
              <a-form-model
                :model="retrieveForm"
                :rules="retrieveFormRules"
                ref="retrieveForm"
              >
                <a-form-model-item
                  label="Destination BTC address"
                  prop="address"
                >
                  <a-input
                    autocomplete="off"
                    placeholder="BTC address"
                    type="text"
                    v-model="retrieveForm.address"
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
                @click="dissolve"
                class="primary retrieve-button w100 mt20"
                type="button"
              >
                Retrieve {{ availableBalance | bigintToFloat(8, 8) }} BTC
              </button>
            </div>
          </div>
          <div class="forge-right w100" v-show="retrieveStep === 3">
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
                  :key="index"
                  v-for="(status, index) in retrieveBtcStatus.slice(
                    (retrieveBtcStatusPage - 1) * retrieveBtcStatusPageSize,
                    retrieveBtcStatusPage * retrieveBtcStatusPageSize
                  )"
                >
                  <div class="retrieve-btc-status-block-index">
                    {{ status.blockIndex }}
                  </div>
                  <div class="retrieve-btc-status-flex">
                    {{ status.status && Object.keys(status.status)[0] }}
                    <span
                      class="loading-spinner"
                      v-show="
                        status.status &&
                        ['Pending', 'Signing', 'Sending', 'Submitted'].includes(
                          Object.keys(status.status)[0]
                        )
                      "
                    ></span>
                  </div>
                  <div class="margin-left-auto">
                    <a
                      :href="`https://www.blockchain.com/btc/tx/${getRetrieveBtcTxid(
                        status.status
                      )}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                      v-if="getRetrieveBtcTxid(status.status)"
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
                  :current="retrieveBtcStatusPage"
                  :default-page-size="retrieveBtcStatusPageSize"
                  :total="retrieveBtcStatus.length"
                  @change="retrieveBtcStatusPageChange"
                  class="pagination-transaction"
                  v-if="retrieveBtcStatus.length > retrieveBtcStatusPageSize"
                />
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </a-modal>
    <a-modal
      :after-close="afterForgeCloseETH"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="transfer-modal forge-modal dissolve-modal"
      v-model="dissolveModalETH"
      width="750px"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">{{ dissolveTitleETH }}</div>
        <!--<span class="title-tip"
          >Do not leave this page until the transaction is fully completed. If
          you leave this page, please come back here again.</span
        >-->
      </div>
      <div
        class="step-list"
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
      >
        <span
          :class="{ active: retrieveStep > 1 }"
          @click="previousRetrieveStep()"
          class="step-previous pc-show"
        >
          <a-tooltip placement="top">
            <template slot="title">Previous</template>
            <a-icon type="double-left" />
          </a-tooltip>
        </span>
        <div
          :class="{ active: retrieveStep === 1 }"
          @click="changeRetrieveStep(1)"
          class="pointer"
        >
          <span class="step-list-num">1</span><span>Transfer</span>
        </div>
        <div
          :class="{ active: retrieveStep === 2 }"
          @click="changeRetrieveStep(2)"
          class="pointer step-list-center"
        >
          <span class="step-list-line"></span>
          <span class="step-list-center-t"
            ><span class="step-list-num">2</span>Retrieve</span
          >
          <span class="step-list-line"></span>
        </div>
        <div
          :class="{ active: retrieveStep === 3 }"
          @click="changeRetrieveStep(3)"
          class="pointer"
        >
          <span class="step-list-num">3</span><span>Records</span>
        </div>
        <span
          :class="{ active: retrieveStep < 3 }"
          @click="nextRetrieveStep(3)"
          class="step-next pc-show"
          ><a-tooltip placement="top">
            <template slot="title">Next</template>
            <a-icon type="double-right" /> </a-tooltip
        ></span>
      </div>
      <a-spin :spinning="!ckETHWithdrawalAccount" class="dissolve-modal-spin">
        <div
          class="forge-main"
          v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
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
              :model="ethDissolveForm"
              :rules="ethDissolveFormRules"
              ref="ethForm"
            >
              <a-form-model-item :colon="false" prop="retrieveAmount">
                <template slot="label"
                  >Amount:&nbsp;<span class="label-tip"
                    >(includes network fees)</span
                  >
                </template>
                <a-input
                  autocomplete="off"
                  min="0"
                  placeholder="0.00"
                  type="text"
                  v-model="ethDissolveForm.retrieveAmount"
                  v-only-float="8"
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
                    class="reload-icon"
                    type="reload"
                    v-show="!refreshCkETHBalanceLoading"
                  />
                  <a-icon
                    class="reload-icon"
                    type="loading"
                    v-show="refreshCkETHBalanceLoading"
                  />
                  <span
                    @click="setMaxETHRetrieve(null)"
                    class="transfer-balance-max pc-show"
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
                :to="`/ICDex/${icNetworkTokens.symbol}/ICP`"
                class="transfer-balance-right pc-show"
                v-show="
                  !icNetworkTokens.symbol
                    .toLocaleLowerCase()
                    .includes('usdc') &&
                  !icNetworkTokens.symbol.toLocaleLowerCase().includes('usdt')
                "
              >
                Trade
              </router-link>
            </div>
            <button
              @click="transferCkETH"
              class="primary retrieve-button w100"
              type="button"
            >
              Transfer {{ icNetworkTokens.symbol }} ({{
                networkIds[icNetworkTokens.networkId]
              }})
            </button>
          </div>
          <div class="w100" v-show="retrieveStep === 2">
            <div>
              <a-form-model
                :model="ethRetrieveForm"
                :rules="ethRetrieveFormRules"
                ref="ethRetrieveForm"
              >
                <a-form-model-item
                  :label="`Destination ${icNetworkTokens.icTokenInfo.symbol} (${
                    networkIds[otherNetworkTokens.networkId]
                  }) address`"
                  prop="address"
                >
                  <a-input
                    :placeholder="`${icNetworkTokens.icTokenInfo.symbol} (${
                      networkIds[otherNetworkTokens.networkId]
                    }) address`"
                    autocomplete="off"
                    type="text"
                    v-model="ethRetrieveForm.address"
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
                :disabled="!canRetrieveETH"
                @click="dissolveCkETH"
                class="primary retrieve-button w100 mt20"
                type="button"
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
                :key="index"
                class="retrieve-btc-status-ul-table-eth"
                style="align-items: flex-start"
                v-for="(item, index) in retrieveEvent.slice(
                  (retrieveEventPage - 1) * retrieveEventPageSize,
                  retrieveEventPage * retrieveEventPageSize
                )"
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
                  class="
                    base-font-title
                    margin-left-auto
                    text-right
                    retrieve-margin-left-auto
                  "
                  style="min-width: 30%"
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
                  class="retrieve-btc-status-flex"
                  v-if="item[2] && item[2].withdrawResult"
                >
                  <div class="eth-tx-hash" v-if="item[2].withdrawResult.err">
                    <span class="base-red">&nbsp;(Error)</span>
                  </div>
                </div>
              </li>
            </ul>
            <div
              class="no-retrieve-btc-status-ul"
              style="display: flex"
              v-if="!retrieveEvent.length"
            >
              No Record
            </div>
            <div class="pagination-transaction-main mt20">
              <a-pagination
                :current="retrieveEventPage"
                :default-page-size="retrieveEventPageSize"
                :total="retrieveEvent.length"
                @change="retrieveEventPageChange"
                class="pagination-transaction"
                v-if="retrieveEvent.length > retrieveEventPageSize"
              />
            </div>
          </div>
        </div>
        <div
          class="forge-main mt20"
          v-show="retrieveStep === 2 && retrieveETHStatus.length"
        >
          <a-spin
            :spinning="showRetrieveETHStatus"
            class="btc-txs-ul-spin w100"
            v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
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
                  :key="index"
                  v-for="(status, index) in retrieveETHStatus.slice(
                    (retrieveETHStatusPage - 1) * retrieveETHStatusPageSize,
                    retrieveETHStatusPage * retrieveETHStatusPageSize
                  )"
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
                          :href="`${ethLink}/tx/${hash}`"
                          :key="hash"
                          rel="nofollow noreferrer noopener"
                          target="_blank"
                          v-for="hash in status[1].txHash"
                        >
                          ({{ hash | ellipsisAccount() }})
                        </a>
                      </div>
                      <span
                        class="loading-spinner"
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
                  :key="index"
                  style="font-size: 12px"
                  v-for="(status, index) in retrieveETHStatus.slice(
                    (retrieveETHStatusPage - 1) * retrieveETHStatusPageSize,
                    retrieveETHStatusPage * retrieveETHStatusPageSize
                  )"
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
                        class="loading-spinner"
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
                  :current="retrieveETHStatusPage"
                  :default-page-size="retrieveETHStatusPageSize"
                  :total="retrieveETHStatus.length"
                  @change="retrieveETHStatusPageChange"
                  class="pagination-transaction"
                  v-if="retrieveETHStatus.length > retrieveETHStatusPageSize"
                />
              </div>
            </div>
          </a-spin>
        </div>
      </a-spin>
    </a-modal>
    <a-modal
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="transfer-modal forge-modal forge-modal-eth active-pending-modal"
      v-model="claimModalTransactions"
      width="500px"
    >
      <div class="modal-title-info" slot="title">
        <div class="modal-title-main">Claim history</div>
      </div>
      <div class="forge-right">
        <div class="btc-txs">
          <ul class="btc-txs-ul" v-show="depositInfo.length">
            <li
              :key="index"
              style="display: flex; padding: 10px 0"
              v-for="(item, index) in depositInfo.slice(
                (depositInfoPage - 1) * depositInfoPageSize,
                depositInfoPage * depositInfoPageSize
              )"
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
                @click="tryClaim(item[0])"
                class="margin-left-auto pointer"
                style="color: #51b7c3; font-size: 14px"
                v-if="
                  !item[2] &&
                  !(
                    depositingInfo &&
                    depositingInfo[0] &&
                    depositingInfo[0] === item[0]
                  ) &&
                  signatureForm.txHash !== item[0]
                "
                >Claim</span
              >
            </li>
          </ul>
          <div
            class="no-btc-txs-ul"
            style="display: flex"
            v-show="!depositInfo.length"
          >
            No Record
          </div>
          <div class="pagination-transaction-main mt20">
            <a-pagination
              :current="depositInfoPage"
              :default-page-size="depositInfoPageSize"
              :total="depositInfo.length"
              @change="pageChangeDepositInfo"
              class="pagination-transaction"
              v-if="depositInfo.length > depositInfoPageSize"
            />
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      :closable="false"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="delete-modal"
      v-model="metaMaskVisible"
      width="400px"
    >
      <p>MetaMask is not installed. Click "OK" to install MetaMask!</p>
      <div class="delete-button">
        <button @click="metaMaskVisible = false" type="button">Cancel</button>
        <button @click="installMetaMask" class="default" type="button">
          OK
        </button>
      </div>
    </a-modal>
    <a-modal
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="delete-modal"
      v-model="showEthAddressCode"
      width="400px"
    >
      <div
        class="btc-address-code"
        v-if="icNetworkTokens && icNetworkTokens.icTokenInfo"
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
            v-clipboard:error="onError"
            v-clipboard:success="onCopySuccess"
          />
        </div>
      </div>
    </a-modal>
    <a-modal
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      centered
      class="transfer-modal forge-modal forge-modal-eth active-pending-modal"
      title="Activities"
      v-model="activePendingModal"
      width="750px"
    >
      <div>
        <div v-if="activePending.claim && activePending.claim.length">
          <div
            :key="index"
            class="active-pending-item"
            v-for="(item, index) in activePending.claim"
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
              @click="toActive('claim', item.tokenId, item.txHash)"
              class="primary"
            >
              View
            </button>
          </div>
        </div>
        <div v-if="activePending.claim2 && activePending.claim2.length">
          <div
            :key="index"
            class="active-pending-item"
            v-for="(item, index) in activePending.claim2"
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
            <button @click="toActive('claim2', item.tokenId)" class="primary">
              View
            </button>
          </div>
        </div>
        <div v-if="activePending.mint && activePending.mint.length">
          <div
            :key="index"
            class="active-pending-item"
            v-for="(item, index) in activePending.mint"
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
            <button @click="toActive('mint', item.tokenId)" class="primary">
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
              class="margin-left-auto"
              v-if="
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.deposit[2][0].tokenId]
                ]
              "
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
              @click="
                toActive(
                  'deposit',
                  ethersTokenIdToCkTokenId[activePending.deposit[2][0].tokenId]
                )
              "
              class="primary"
            >
              View
            </button>
          </div>
        </div>
        <div v-if="activePending.retrieve && activePending.retrieve.length">
          <div
            :key="index"
            class="active-pending-item"
            v-for="(item, index) in activePending.retrieve"
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
            <button @click="toActive('retrieve', item.tokenId)" class="primary">
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
              class="margin-left-auto"
              v-if="
                ckTokenInfo[
                  ethersTokenIdToCkTokenId[activePending.retrieve2[1].tokenId]
                ]
              "
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
              @click="
                toActive(
                  'retrieve',
                  ethersTokenIdToCkTokenId[activePending.retrieve2[1].tokenId]
                )
              "
              class="primary"
            >
              View
            </button>
          </div>
        </div>
        <div v-if="activePending.mintCKETH && activePending.mintCKETH.length">
          <div
            :key="index"
            class="active-pending-item"
            v-for="(item, index) in activePending.mintCKETH"
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
              @click="toActive('mintCKETH', item.tokenId)"
              class="primary"
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
            :key="index"
            class="active-pending-item"
            v-for="(item, index) in activePending.retrieveCKETH"
          >
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].ckSymbol }}(IC Network)
            </span>
            &nbsp;->&nbsp;
            <span v-if="ckTokenInfo[item.tokenId]">
              {{ ckTokenInfo[item.tokenId].symbol }}
            </span>
            <span class="margin-left-auto" v-if="ckTokenInfo[item.tokenId]">
              {{
                item.amount
                  | bigintToFloat(8, ckTokenInfo[item.tokenId].decimals)
                  | formatAmount(8)
              }}
            </span>
            <!--<button
              class="primary"
              v-if="
                (item.status &&
                  Object.keys(item.status)[0] &&
                  Object.keys(item.status)[0] !== 'TxFinalized' &&
                  Object.keys(item.status)[0] !== 'NotFound') ||
                !Object.keys(item.status)[0]
              "
              @click="toActive('retrieveCKETH', item.tokenId)"
            >
              View
            </button>-->
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
      :balance="balance"
      @approveIcrc2Success="approveIcrc2Success"
      ref="approveIcrc2"
    ></approve-icrc2>
    <pro-wallet-swap
      :tokens="tokens"
      :tokens-balance="tokensBalanceMain"
      :tokens-balance-sto="tokensBalancePro"
      @proWalletSwapSuccess="proWalletSwapSuccess"
      ref="proWalletSwap"
    ></pro-wallet-swap>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
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
  ClaimCKETHActiveResponse,
  ICNetworkTokensInterface,
  MintActive,
  MintCKBTCResponse,
  networkIds,
  networkList,
  networkTokens,
  RetrieveActive,
  RetrieveActiveResponse,
  RetrieveCKBTCResponse
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
  CK_ETH_MINTER_CANISTER_ID_TEST,
  etherScanKey,
  ETHHttps,
  ETHHttpsMainnet,
  ETHHttpsSepolia,
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
  CkErc20Token,
  ckETHEvent,
  IcTokenInfo,
  MinterInfo,
  PendingDepositTxn,
  ResultError,
  RetrieveErc20Request,
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
import ProWalletSwap from '@/views/home/ICDex/components/ProWalletSwap.vue';
import erc20ABI from '@/ic/abi/erc20Deposit';
import { getFee } from '@/ic/getTokenFee';

const { Web3 } = require('web3');

let ethereum = (window as any).ethereum;
if (ethereum && ethereum.providers) {
  ethereum = ethereum.providers.find((provider) => provider.isMetaMask);
}
let ETHUpdateTime = null;
let ETHDepositTime = null;
const ethVersion = '0.1';
let timer: number;
let num = 0;
const ckETHSep = 'apia6-jaaaa-aaaar-qabma-cai';

@Component({
  name: 'Ledger',
  components: {
    ReceiveModal,
    TransferIcp,
    TopUp,
    TransferToken,
    ApproveIcrc2,
    ProWalletSwap
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
export default class extends Vue {
  $refs!: {
    receiveModal;
    transferIcp: HTMLFormElement;
    topUp: HTMLFormElement;
    approveIcrc2: HTMLFormElement;
  };
  @Prop()
  private principal!: string;
  @Prop()
  private type!: string;
  @Prop()
  private walletMenu!: string;
  @Prop()
  private balance!: string;
  @Prop()
  private balancePro!: string;
  @Prop()
  private getCheckAuth!: boolean;
  @Prop()
  private tokensBalanceMain!: { [key: string]: string };
  @Prop()
  private tokensBalancePro!: { [key: string]: string };

  private walletId: PrincipalString = '';
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
    ckerc20BlockIndex?: string;
    status: RetrieveEthStatus;
    time?: string;
  }> = [];
  private ckETHMint: Array<{
    txHash: string;
    blockNum: string;
    amount: string;
    txStatus?: string;
    time?: string;
  }> = [];
  private ckETHMintPage = 1;
  private CKETHResponsePage = 1;
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
  private ckTokens: Array<string> = [];
  private ckLink = 'https://dashboard.internetcomputer.org/';
  private networkIdMint: number | Array<any> = [];
  private networkIdMintTo: number | Array<any> = [];
  private networkTokenIdMint: number | Array<any> = [];
  private networkTokenIdMintTo: number | Array<any> = [];
  private networkTokenDisabled = true;
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
  private smartContractAddressERC20 = '';
  private ethLink = 'https://etherscan.io';
  private etherscanLink = 'https://api.etherscan.io';
  private ckEthLink = 'https://etherscan.io';
  private canRetrieveCkerc20 = true;
  private ckerc20RetrieveFee = '';
  private activeTimer = null;
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
        this.networkTokensTo[this.networkTokenIdMintTo].tokenId ===
          CK_BTC_CANISTER_ID ||
        this.networkTokensFrom[this.networkTokenIdMint].tokenId ===
          CK_BTC_CANISTER_ID
      ) {
        this.ckLink = 'https://dashboard.internetcomputer.org/bitcoin';
      } else if (
        this.networkTokensTo[this.networkTokenIdMintTo].tokenId ===
          CK_ETH_LEDGER_CANISTER_ID ||
        this.networkTokensFrom[this.networkTokenIdMint].tokenId ===
          CK_ETH_LEDGER_CANISTER_ID
      ) {
        this.ckLink = 'https://dashboard.internetcomputer.org/ethereum';
      } else if (
        this.ckTokens.includes(
          this.networkTokensTo[this.networkTokenIdMintTo].tokenId
        )
      ) {
        this.ckLink = `https://dashboard.internetcomputer.org/ethereum/${
          this.networkTokensTo[this.networkTokenIdMintTo].tokenId
        }`;
      } else if (
        this.ckTokens.includes(
          this.networkTokensFrom[this.networkTokenIdMint].tokenId
        )
      ) {
        this.ckLink = `https://dashboard.internetcomputer.org/ethereum/${
          this.networkTokensFrom[this.networkTokenIdMint].tokenId
        }`;
      }
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
    num = 0;
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
    window.clearInterval(this.activeTimer);
    this.activeTimer = null;
  }

  created(): void {
    this.DRC20TokenService = new DRC20TokenService();
    this.ckBTCMinterService = new ckBTCMinterService();
    this.ICLighthouseService = new ICLighthouseService();
    this.questsService = new questsService();
    this.ckETHMinterService = new ckETHMinterService();
    this.ckETHMinterDfiService = new ckETHMinterDfiService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (num === 0) {
      console.log(this.type);
      ++num;
      this.getMinterInfo().then(() => {
        this.networkTokenDisabled = true;
        this.getCkTokens().then(() => {
          this.getActive();
          this.activeTimer && clearTimeout(this.activeTimer);
          window.setInterval(() => {
            if (this.$route.name === 'Account') {
              this.getActive();
            }
          }, 60 * 1000);
        });
        if (this.minterInfo.depositMethod === 1) {
          this.depositMethod = 1;
        } else {
          this.depositMethod = 2;
        }
      });
    }
  }

  public async transferSuccess(): Promise<void> {
    this.$emit('getBalance');
  }
  private showTraderAccounts(): void {
    this.$emit('showTraderAccounts');
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

  private swapWallet(): void {
    (this.$refs as any).proWalletSwap.tokenId = LEDGER_CANISTER_ID;
    (this.$refs as any).proWalletSwap.type = 'toWallet';
    (this.$refs as any).proWalletSwap.showSwap = true;
    (this.$refs as any).proWalletSwap.visible = true;
  }

  private proWalletSwapSuccess(): void {
    this.$emit('getBalance');
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
        principalToAccountIdentifier(Principal.fromText(this.principal))
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
    // 11155111(0xaa36a7)
    if (Number(this.minterInfo.chainId) === 11155111) {
      this.ethLink = 'https://sepolia.etherscan.io';
      this.etherscanLink = 'https://api-sepolia.etherscan.io';
    }
  }

  private async getCkTokensDfi(): Promise<void> {
    const res = await this.ckETHMinterDfiService.get_minter_info(
      CK_ETH_MINTER_CANISTER_ID_TEST
    );
    let minimum_withdrawal_amount = BigInt('30000000000000000');
    console.log(res);
    this.ckTokens.push(CK_BTC_CANISTER_ID);
    if (res) {
      this.smartContractAddress = res.eth_helper_contract_address[0];
      this.smartContractAddressERC20 = res.erc20_helper_contract_address[0];
      const promiseValue = [];
      if (res.minimum_withdrawal_amount.length) {
        minimum_withdrawal_amount = res.minimum_withdrawal_amount[0];
      }
      if (
        res.supported_ckerc20_tokens &&
        res.supported_ckerc20_tokens.length &&
        res.supported_ckerc20_tokens[0].length
      ) {
        res.supported_ckerc20_tokens[0].forEach((item) => {
          promiseValue.push(
            this.getCKERC20TokenInfo(item, minimum_withdrawal_amount)
          );
          this.ckTokens.push(item.ledger_canister_id.toString());
        });
      }
      console.log(promiseValue);
      if (promiseValue.length) {
        await Promise.all(promiseValue);
      }
    }
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
    if (CK_ETH_MINTER_CANISTER_ID_TEST !== CK_ETH_MINTER_CANISTER_ID) {
      this.smartContractAddress = await this.getMinterAddress();
      minimum_withdrawal_amount = BigInt('30000000000000000');
      if (!this.tokens[ckETHSep]) {
        const res = await getTokenInfo(Principal.fromText(ckETHSep), {
          icrc1: null
        });
        this.$set(this.tokens, ckETHSep, res);
      } else {
        if (!this.tokens[ckETHSep].logo) {
          const logo = await getTokenLogo(Principal.fromText(ckETHSep), {
            icrc1: null
          });
          this.$set(
            this.tokens,
            ckETHSep,
            Object.assign(this.tokens[ckETHSep], {
              logo: logo
            })
          );
        }
      }
      // ckETHTest
      const icTokenInfo = {
        ckLedgerId: Principal.fromText(ckETHSep),
        ckSymbol: this.tokens[ckETHSep].symbol,
        decimals: this.tokens[ckETHSep].decimals,
        dexPair: null,
        dexPrice: null,
        fee: null,
        minAmount: minimum_withdrawal_amount,
        std: { ETH: null },
        symbol: 'SepoliaETH',
        tokenId: res.eth_helper_contract_address[0],
        totalSupply: null
      };
      this.networkTokens.unshift({
        id: res.eth_helper_contract_address[0],
        networkId: '-1',
        networkToIcId: '3',
        symbol: this.tokens[ckETHSep].symbol,
        tokenId: ckETHSep,
        icTokenInfo: icTokenInfo
      });
      this.networkTokens.unshift({
        id: res.eth_helper_contract_address[0],
        networkId: '3',
        networkToIcId: '-1',
        symbol: 'SepoliaETH',
        tokenId: ckETHSep,
        logo: require('@/assets/img/ethereum.svg')
      });
      this.ethersTokenIdToCkTokenId[res.eth_helper_contract_address[0]] =
        ckETHSep;
      this.ckTokenInfo[ckETHSep] = Object.assign({}, icTokenInfo, {
        symbol: 'SepoliaETH'
      });
    }
    this.ckTokens.push(CK_ETH_LEDGER_CANISTER_ID);
    // ckETH
    const icTokenInfo = {
      ckLedgerId: Principal.fromText(CK_ETH_LEDGER_CANISTER_ID),
      ckSymbol: this.tokens[CK_ETH_LEDGER_CANISTER_ID].symbol,
      decimals: this.tokens[CK_ETH_LEDGER_CANISTER_ID].decimals,
      dexPair: null,
      dexPrice: null,
      fee: null,
      minAmount: minimum_withdrawal_amount,
      std: { ETH: null },
      symbol: 'ETH',
      tokenId: '0x0000000000000000000000000000000000000000',
      totalSupply: null
    };
    this.networkTokens.unshift({
      id: '0x0000000000000000000000000000000000000000',
      networkId: '-1',
      networkToIcId: '1',
      symbol: this.tokens[CK_ETH_LEDGER_CANISTER_ID].symbol,
      tokenId: CK_ETH_LEDGER_CANISTER_ID,
      icTokenInfo: icTokenInfo
    });
    this.networkTokens.unshift({
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
    console.log(this.ckTokenInfo);
  }

  private async getCKERC20TokenInfo(
    info: CkErc20Token,
    minimum_withdrawal_amount: bigint
  ): Promise<void> {
    const tokenId = info.ledger_canister_id.toString();
    if (!this.tokens[tokenId]) {
      const res = await getTokenInfo(Principal.fromText(tokenId), {
        icrc1: null
      });
      this.$set(this.tokens, tokenId, res);
    } else {
      if (!this.tokens[tokenId].logo) {
        const logo = await getTokenLogo(Principal.fromText(tokenId), {
          icrc1: null
        });
        this.$set(
          this.tokens,
          tokenId,
          Object.assign(this.tokens[tokenId], {
            logo: logo
          })
        );
      }
    }
    const symbol = this.tokens[tokenId].symbol.split('ck')[1];
    const icTokenInfo = {
      ckLedgerId: info.ledger_canister_id,
      ckSymbol: this.tokens[tokenId].symbol,
      decimals: this.tokens[tokenId].decimals,
      dexPair: null,
      dexPrice: null,
      fee: null,
      minAmount: minimum_withdrawal_amount,
      std: { ERC20: null },
      symbol: symbol,
      tokenId: info.erc20_contract_address,
      totalSupply: null,
      type: 'dfinityERC20'
    };
    const isMain = CK_ETH_MINTER_CANISTER_ID_TEST === CK_ETH_MINTER_CANISTER_ID;
    this.networkTokens.unshift({
      id: info.erc20_contract_address,
      networkId: '-1',
      networkToIcId: isMain ? '1' : '3',
      symbol: this.tokens[tokenId].symbol,
      tokenId: tokenId,
      icTokenInfo: icTokenInfo
    });
    this.networkTokens.unshift({
      id: info.erc20_contract_address,
      networkId: isMain ? '1' : '3',
      networkToIcId: '-1',
      symbol: symbol,
      tokenId: tokenId,
      logo: require('@/assets/img/ethereum.svg')
    });
    this.ethersTokenIdToCkTokenId[info.erc20_contract_address] = tokenId;
    this.ckTokenInfo[tokenId] = Object.assign({}, icTokenInfo, {
      symbol: symbol
    });
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
        if (Number(this.minterInfo.chainId) === 11155111) {
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
          networkToIcId:
            Number(this.minterInfo.chainId) === 11155111 ? '2' : '1',
          symbol: ckSymbol,
          tokenId: item[1].ckLedgerId.toString(),
          icTokenInfo: item[1]
        });
      });
    }
    await this.getCkTokensDfi();
    this.networkTokens.sort((a, b) => {
      if (
        a.symbol.toLocaleLowerCase().includes('test') ||
        a.symbol.toLocaleLowerCase().includes('sepolia')
      ) {
        return 1;
      }
      if (
        b.symbol.toLocaleLowerCase().includes('test') ||
        b.symbol.toLocaleLowerCase().includes('sepolia')
      ) {
        return -1;
      }
      if (a.symbol === 'ckBTC' || a.symbol === 'ckETH') {
        return -1;
      }
      if (
        (a.symbol === 'icBTC' || a.symbol === 'icETH') &&
        b.symbol.toLocaleLowerCase().startsWith('ic')
      ) {
        return -1;
      }
      return a.symbol.localeCompare(b.symbol);
    });
    this.networkTokenDisabled = false;
    this.initICRouter();
    console.log(this.networkTokens);
  }

  private async getMinterAddress(): Promise<string> {
    return await this.ckETHMinterDfiService.smart_contract_address(
      CK_ETH_MINTER_CANISTER_ID
    );
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
    if (type === 'mintCKBTC') {
      this.networkIdMint = 1;
      let network;
      network = this.networkListFrom[this.networkIdMint as number];
      this.changeNetworkIdMint(this.networkIdMint as number);
      console.log(this.networkTokensFrom);
      this.networkTokensFrom.some((item, index) => {
        if (item.tokenId === 'btc' && network.id === item.networkId) {
          this.networkTokenIdMint = index;
          this.changeNetworkTokenIdMint(index);
          return true;
        }
      });
      this.networkIdMintTo = 0;
      this.changeNetworkIdMintTo(this.networkIdMintTo);
      console.log(this.networkTokensTo);
      this.networkTokensTo.some((item, index) => {
        if (
          item.tokenId === CK_BTC_CANISTER_ID &&
          network.id === item.networkToIcId
        ) {
          this.networkTokenIdMintTo = index;
          this.changeNetworkTokenIdMintTo(index);
          return true;
        }
      });
      this.mintStep = 2;
      this.showForge(BTCTypeEnum.ckBTC);
    } else if (type === 'BTCRetrieve') {
      this.networkIdMint = 0;
      let network;
      network = this.networkListFrom[this.networkIdMint as number];
      this.changeNetworkIdMint(this.networkIdMint as number);
      console.log(this.networkTokensFrom);
      this.networkTokensFrom.some((item, index) => {
        if (
          item.tokenId === CK_BTC_CANISTER_ID &&
          network.id === item.networkId
        ) {
          this.networkTokenIdMint = index;
          this.changeNetworkTokenIdMint(index);
          return true;
        }
      });
      this.networkIdMintTo = 0;
      this.changeNetworkIdMintTo(this.networkIdMintTo);
      console.log(this.networkTokensTo);
      this.networkTokensTo.some((item, index) => {
        if (item.tokenId === 'btc' && network.id === item.networkToIcId) {
          this.networkTokenIdMintTo = index;
          this.changeNetworkTokenIdMintTo(index);
          return true;
        }
      });
      this.retrieveStep = 3;
      this.showDissolve(BTCTypeEnum.ckBTC);
    } else if (
      type === 'claim' ||
      type === 'claim2' ||
      type === 'mint' ||
      type === 'deposit' ||
      type === 'dexMint' ||
      type === 'mintCKETH'
    ) {
      let network;
      console.log(type);
      console.log(tokenId);
      console.log(this.networkTokens);
      // todo networkIdMint
      if (type === 'mintCKETH') {
        this.networkIdMint = 2;
        this.networkTokens.some((item) => {
          if (item.tokenId === tokenId) {
            if (item.networkId === '3') {
              this.networkIdMint = 4;
            }
            return true;
          }
        });
      } else if (type === 'dexMint') {
        this.networkTokens.some((item) => {
          if (item.tokenId === tokenId) {
            console.log(item);
            if (item.networkId === '1') {
              this.networkIdMint = 2;
            }
            return true;
          }
        });
      } else if (Number(this.minterInfo.chainId) === 11155111) {
        this.networkIdMint = 3;
      } else if (Number(this.minterInfo.chainId) === 1) {
        this.networkIdMint = 3;
      } else {
        //
      }
      console.log(this.networkListFrom);
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
      } else if (Number(this.minterInfo.chainId) === 11155111) {
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
    if (this.principal) {
      console.log('getActive');
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
      // ckBTC mint
      this.onGetMintCKBTCPending();
      // ckBTC retrieve
      this.onGetRetrieveCKBTCPending();
      console.log(this.activePending);
    }
  }

  private onGetMintCKBTCPending(): void {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      this.updateBlockHeight = Number(currentInfo.icBTCUpdateBlockHeight);
      this.updateCkBlockHeight = Number(currentInfo.ckBTCUpdateBlockHeight);
      console.log(this.updateBlockHeight, this.updateCkBlockHeight);
    }
    this.BTCAddress('1.0', BTCTypeEnum.ckBTC);
    this.ckBTCMinterService
      .getBtcAddress(BTCTypeEnum.ckBTC)
      .then((btcAddress) => {
        axios
          .get('https://blockchain.info/q/getblockcount')
          .then((blockRes) => {
            axios
              .get(`https://blockstream.info/api/address/${btcAddress}/txs`)
              .then((res) => {
                this.blockCount = blockRes.data;
                const txs = this.filterBTCTxRes(
                  res,
                  blockRes.data,
                  BTCTypeEnum.ckBTC,
                  btcAddress
                );
                console.log(txs);
                const CKETHResponse = [];
                if (
                  this.activePending.CKETHResponse &&
                  this.activePending.CKETHResponse.length
                ) {
                  this.activePending.CKETHResponse.forEach((item) => {
                    if (item.type !== 'BTCMint') {
                      CKETHResponse.push(item);
                    }
                  });
                  this.activePending.CKETHResponse = CKETHResponse.concat(txs);
                } else {
                  this.activePending.CKETHResponse = txs;
                }
                if (this.activePending.CKETHResponse.length) {
                  const CKETHResponse = this.activePending.CKETHResponse.sort(
                    (a, b) => {
                      return Number(b.time) - Number(a.time);
                    }
                  );
                  this.$set(this.activePending, 'CKETHResponse', CKETHResponse);
                } else {
                  this.$set(this.activePending, 'CKETHResponse', null);
                }
              });
          });
      });
  }

  private filterBTCTxRes(
    res: any,
    block: number,
    BTCType: BTCTypeEnum,
    BTCAddress: string
  ): Array<MintCKBTCResponse> {
    if (res && res.data) {
      const txs = res.data;
      console.log(txs);
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
          if (flag && block && txs[i].status.block_height) {
            tx.time = txs[i].status.block_time;
            tx.type = 'BTCMint';
            if (
              (BTCType === BTCTypeEnum.icBTC &&
                block - txs[i].status.block_height < 5) ||
              (BTCType === BTCTypeEnum.ckBTC &&
                block - txs[i].status.block_height < 11)
            ) {
              //  hasConfirmedLoading = true;
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
                block - txs[i].status.block_height >= 6) ||
                (BTCType === BTCTypeEnum.ckBTC &&
                  block - txs[i].status.block_height >= 12)) &&
              (txs[i].status.block_height > updateBlockHeight ||
                !updateBlockHeight)
            ) {
              needUpdate = true;
            }
          } else if (flag && !txs[i].status.block_height) {
            // hasConfirmedLoading = true;
          }
          if (!flag) {
            txs.splice(i, 1);
            i--;
          }
        }
      }
      if (BTCType === BTCTypeEnum.icBTC) {
        this.BTCTransactions = txs;
      } else {
        this.ckBTCTransactions = txs;
      }
      console.log(needUpdate);
      if (needUpdate) {
        this.forge(BTCType, false);
        this.setUpdateBlockHeight(BTCType);
      }
      return txs;
    }
  }

  private onGetRetrieveCKBTCPending(): void {
    const currentInfo = JSON.parse(localStorage.getItem(this.principal)) || {};
    if (currentInfo.ckBTCBlock) {
      const ckBTCRetrieve =
        JSON.parse(JSON.stringify(currentInfo.ckBTCBlock)) || [];
      ckBTCRetrieve.map((info) => {
        info.type = 'BTCRetrieve';
        if (Number(info.time) > 9999999999) {
          info.time = Math.floor(info.time / 1000);
        }
      });
      console.log(ckBTCRetrieve);
      const CKETHResponse = [];
      if (
        this.activePending.CKETHResponse &&
        this.activePending.CKETHResponse.length
      ) {
        this.activePending.CKETHResponse.forEach((item) => {
          if (item.type !== 'BTCRetrieve') {
            CKETHResponse.push(item);
          }
        });
        this.activePending.CKETHResponse = CKETHResponse.concat(ckBTCRetrieve);
      } else {
        this.activePending.CKETHResponse = ckBTCRetrieve;
      }
      if (this.activePending.CKETHResponse.length) {
        const CKETHResponse = this.activePending.CKETHResponse.sort((a, b) => {
          return Number(b.time) - Number(a.time);
        });
        this.$set(this.activePending, 'CKETHResponse', CKETHResponse);
      } else {
        this.$set(this.activePending, 'CKETHResponse', null);
      }
      this.updateRetrieveBtcStatusResponse(ckBTCRetrieve);
    }
  }

  private updateRetrieveBtcStatusResponse(
    response: Array<RetrieveCKBTCResponse>
  ): void {
    if (this.principal) {
      const currentInfo =
        JSON.parse(localStorage.getItem(this.principal)) || {};
      const time = new Date().getTime();
      response.forEach((val, index) => {
        let status;
        let canGetStatus = ['Pending', 'Signing', 'Sending', 'Submitted'];
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
              this.$set(response, index, {
                blockIndex: val.blockIndex,
                status: res,
                time: time
              });
              this.batchSend(val.blockIndex);
            }
            if (currentStatus !== status) {
              this.$set(response, index, {
                blockIndex: val.blockIndex,
                status: res,
                time: val.time
              });
              currentInfo.ckBTCBlock = response;
              localStorage.setItem(this.principal, JSON.stringify(currentInfo));
            }
          });
        }
      });
    }
  }

  private onGetRetrieveCKETHPending(): void {
    this.getRetrieveCKETHPending().then((res) => {
      console.log(res);
      if (res.pending && res.pending.length) {
        this.$set(this.activePending, 'retrieveCKETH', res.pending);
      } else {
        this.$set(this.activePending, 'retrieveCKETH', null);
      }
      const CKETHResponse = [];
      const response = [];
      res.retrieve.forEach((item: RetrieveActiveResponse) => {
        if (this.ckTokenInfo[item.tokenId]) {
          response.push(item);
        }
      });
      if (
        this.activePending.CKETHResponse &&
        this.activePending.CKETHResponse.length
      ) {
        this.activePending.CKETHResponse.forEach((item) => {
          if (item.type !== 'retrieve') {
            CKETHResponse.push(item);
          }
        });
        this.activePending.CKETHResponse = CKETHResponse.concat(response);
      } else {
        this.activePending.CKETHResponse = response;
      }
      if (this.activePending.CKETHResponse.length) {
        console.log(res.retrieve);
        const CKETHResponse = this.activePending.CKETHResponse.sort((a, b) => {
          return Number(b.time) - Number(a.time);
        });
        this.$set(this.activePending, 'CKETHResponse', CKETHResponse);
      } else {
        this.$set(this.activePending, 'CKETHResponse', null);
      }
    });
  }

  private async getRetrieveCKETHPending(): Promise<{
    retrieve: Array<RetrieveActiveResponse>;
    pending: Array<RetrieveActive>;
  }> {
    let retrievePending: Array<RetrieveActive> = [];
    let retrieve: Array<RetrieveActiveResponse> = [];
    const currentInfo = JSON.parse(localStorage.getItem(this.principal)) || {};
    for (let ckETHRetrieveKey in currentInfo) {
      if (ckETHRetrieveKey.startsWith('ckETHRetrieve-')) {
        const retrieveCKETH = currentInfo[ckETHRetrieveKey] || {};
        console.log(retrieveCKETH);
        let flag = false;
        if (retrieveCKETH) {
          for (let key in retrieveCKETH) {
            if (retrieveCKETH[key]) {
              for (let i = 0; i < retrieveCKETH[key].length; i++) {
                let ETHHttps = ETHHttpsMainnet;
                if (
                  this.tokens &&
                  this.tokens[key] &&
                  this.tokens[key].symbol
                    .toLocaleLowerCase()
                    .includes('sepolia')
                ) {
                  ETHHttps = ETHHttpsSepolia;
                }
                const status = Object.keys(retrieveCKETH[key][i].status)[0];
                if (status === 'TxFinalized' && !retrieveCKETH[key][i].time) {
                  const hash = Object.values(
                    retrieveCKETH[key][i].status as RetrieveEthStatus
                  )[0].Success.transaction_hash;
                  const receipt = await this.getEthTransactionReceipt(
                    hash,
                    0,
                    0,
                    ETHHttps
                  );
                  if (receipt && receipt.data.result) {
                    console.log(receipt.data.result);
                    const block = Number(receipt.data.result.blockNumber);
                    const resReceipt = await this.getBlockByNumber(
                      block,
                      0,
                      0,
                      ETHHttps
                    );
                    if (resReceipt && resReceipt.data.result) {
                      console.log(resReceipt);
                      if (!flag) {
                        flag = true;
                      }
                      retrieveCKETH[key][i].time = Number(
                        resReceipt.data.result.timestamp
                      ).toString(10);
                    }
                  }
                }
                const type = Object.keys(retrieveCKETH[key][i].status)[0];
                if (type !== 'TxFinalized' && type !== 'NotFound') {
                  retrievePending.push({
                    amount: retrieveCKETH[key][i].amount,
                    tokenId: key,
                    status: retrieveCKETH[key][i].status,
                    time: retrieveCKETH[key][i].time
                  });
                } else {
                  retrieve.push({
                    amount: retrieveCKETH[key][i].amount,
                    tokenId: key,
                    status: retrieveCKETH[key][i].status,
                    time: retrieveCKETH[key][i].time,
                    type: 'retrieve'
                  });
                }
              }
            }
          }
        }
        if (flag) {
          currentInfo[ckETHRetrieveKey] = retrieveCKETH;
          localStorage.setItem(this.principal, JSON.stringify(currentInfo));
        }
      }
    }
    return { retrieve: retrieve, pending: retrievePending };
  }

  private onGetMintCKETHPending(): void {
    this.getMintCKETHPending().then((res) => {
      console.log(res);
      if (res && res.mintPending && res.mintPending.length) {
        this.$set(this.activePending, 'mintCKETH', res.mintPending);
      } else {
        this.$set(this.activePending, 'mintCKETH', null);
      }
      const CKETHResponse = [];
      const response = [];
      res.mint.forEach((item) => {
        if (this.ckTokenInfo[item.tokenId]) {
          response.push(item);
        }
      });
      if (
        this.activePending.CKETHResponse &&
        this.activePending.CKETHResponse.length
      ) {
        this.activePending.CKETHResponse.forEach((item) => {
          if (item && item.type !== 'mint') {
            CKETHResponse.push(item);
          }
        });
        this.activePending.CKETHResponse = response.concat(CKETHResponse);
      } else {
        this.activePending.CKETHResponse = response;
      }
      if (this.activePending.CKETHResponse.length) {
        console.log(response);
        const CKETHResponse = this.activePending.CKETHResponse.sort((a, b) => {
          return Number(b.time) - Number(a.time);
        });
        this.$set(this.activePending, 'CKETHResponse', CKETHResponse);
      } else {
        this.$set(this.activePending, 'CKETHResponse', null);
      }
    });
  }

  private async getMintCKETHPending(): Promise<{
    mint: Array<ClaimCKETHActiveResponse>;
    mintPending: Array<ClaimCKETHActive>;
  }> {
    let mintPending: Array<ClaimCKETHActive> = [];
    let mint: Array<ClaimCKETHActiveResponse> = [];
    const currentInfo = JSON.parse(localStorage.getItem(this.principal)) || {};
    const lastScrapedBlockNumber = await this.getLastScrapedBlockNumber(
      CK_ETH_MINTER_CANISTER_ID
    );
    const lastScrapedBlockNumberTest = await this.getLastScrapedBlockNumber(
      CK_ETH_MINTER_CANISTER_ID_TEST
    );
    console.log(lastScrapedBlockNumber);
    console.log(lastScrapedBlockNumberTest);
    for (let ckETHMintKey in currentInfo) {
      if (ckETHMintKey.startsWith('ckETHMint-')) {
        const mintCKETH = currentInfo[ckETHMintKey] || {};
        console.log(mintCKETH);
        let flag = false;
        if (mintCKETH) {
          if (lastScrapedBlockNumber && lastScrapedBlockNumberTest) {
            for (let key in mintCKETH) {
              if (mintCKETH[key]) {
                for (let i = 0; i < mintCKETH[key].length; i++) {
                  let blockNumber = lastScrapedBlockNumber;
                  let ETHHttps = ETHHttpsMainnet;
                  if (
                    this.tokens &&
                    this.tokens[key] &&
                    this.tokens[key].symbol
                      .toLocaleLowerCase()
                      .includes('sepolia')
                  ) {
                    blockNumber = lastScrapedBlockNumberTest;
                    ETHHttps = ETHHttpsSepolia;
                  }
                  this.lastScrapedBlockNumber = blockNumber;
                  if (mintCKETH[key][i].blockNum && !mintCKETH[key][i].time) {
                    const resReceipt = await this.getBlockByNumber(
                      Number(mintCKETH[key][i].blockNum),
                      0,
                      0,
                      ETHHttps
                    );
                    if (resReceipt && resReceipt.data.result) {
                      console.log(resReceipt);
                      if (!flag) {
                        flag = true;
                      }
                      mintCKETH[key][i].time = Number(
                        resReceipt.data.result.timestamp
                      ).toString(10);
                    }
                  }
                  if (
                    !mintCKETH[key][i].blockNum ||
                    new BigNumber(blockNumber).lt(mintCKETH[key][i].blockNum)
                  ) {
                    mintPending.push({
                      txHash: mintCKETH[key][i].txHash,
                      amount: mintCKETH[key][i].amount,
                      tokenId: key,
                      blockNumber: mintCKETH[key][i].blockNum,
                      time: mintCKETH[key][i].time
                    });
                  } else {
                    mint.push({
                      txHash: mintCKETH[key][i].txHash,
                      amount: mintCKETH[key][i].amount,
                      tokenId: key,
                      blockNumber: mintCKETH[key][i].blockNum,
                      time: mintCKETH[key][i].time,
                      type: 'mint'
                    });
                  }
                }
              }
            }
          }
        }
        if (flag) {
          currentInfo[ckETHMintKey] = mintCKETH;
          localStorage.setItem(this.principal, JSON.stringify(currentInfo));
        }
      }
    }
    return { mint: mint, mintPending: mintPending };
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
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
        if (this.$route.name === 'Account') {
          this.getBalanceInit();
        }
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
        const max = new BigNumber(total).div(10 ** decimals).minus(fee);
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
        // todo
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        if (
          this.icNetworkTokens.icTokenInfo.type &&
          this.icNetworkTokens.icTokenInfo.type === 'dfinityERC20'
        ) {
          let ethCanisterId = CK_ETH_LEDGER_CANISTER_ID;
          let minter = CK_ETH_MINTER_CANISTER_ID;
          if (this.icNetworkTokens.networkToIcId === '3') {
            ethCanisterId = ckETHSep;
            minter = CK_ETH_MINTER_CANISTER_ID_TEST;
          }
          (loading as any).setText(
            `Approve ${this.tokens[ethCanisterId].symbol} ...`
          );
          const spender: Icrc1Account = {
            owner: Principal.fromText(minter),
            subaccount: []
          };
          const approveResETH = await this.icrc2Approve(
            ethCanisterId,
            BigInt(this.icNetworkTokens.icTokenInfo.minAmount),
            spender
          );
          if (!approveResETH) {
            loading.close();
            return;
          }
        }
        const canisterId = this.icNetworkTokens.tokenId;
        let spenderId = CK_ETH_MINTER_CANISTER_ID;
        if (this.icNetworkTokens.networkToIcId === '3') {
          spenderId = CK_ETH_MINTER_CANISTER_ID_TEST;
        }
        const amount = new BigNumber(this.ethDissolveFormCK.retrieveAmount)
          .times(10 ** this.tokens[canisterId].decimals)
          .toString(10);
        (loading as any).setText(`Approve ${this.icNetworkTokens.symbol} ...`);
        const spender: Icrc1Account = {
          owner: Principal.fromText(spenderId),
          subaccount: []
        };
        const approveRes = await this.icrc2Approve(
          canisterId,
          BigInt(amount),
          spender
        );
        if (approveRes) {
          (loading as any).setText(
            `Withdraw ${this.icNetworkTokens.symbol} ...`
          );
          if (
            this.icNetworkTokens.icTokenInfo.type &&
            this.icNetworkTokens.icTokenInfo.type === 'dfinityERC20'
          ) {
            console.log(
              this.icNetworkTokens.networkToIcId === '3' ||
                this.icNetworkTokens.networkId === '3'
                ? CK_ETH_MINTER_CANISTER_ID_TEST
                : CK_ETH_MINTER_CANISTER_ID
            );
            console.log(this.icNetworkTokens.tokenId);
            console.log(amount);
            const withdraw = await this.ckETHMinterDfiService.withdraw_erc20(
              this.icNetworkTokens.networkToIcId === '3' ||
                this.icNetworkTokens.networkId === '3'
                ? CK_ETH_MINTER_CANISTER_ID_TEST
                : CK_ETH_MINTER_CANISTER_ID,
              {
                ckerc20_ledger_id: Principal.fromText(
                  this.icNetworkTokens.tokenId
                ),
                recipient: this.ethDissolveFormCK.address.trim(),
                amount: BigInt(amount)
              }
            );
            console.log(withdraw);
            if (withdraw) {
              const type = Object.keys(withdraw)[0];
              if (type === 'Ok') {
                this.$message.success('Success');
                const time = Math.floor(new Date().getTime() / 1000);
                this.ckETHRetrieve.unshift({
                  recipient: this.ethDissolveFormCK.address.trim(),
                  amount: amount,
                  blockIndex: (
                    withdraw as {
                      Ok: RetrieveErc20Request;
                    }
                  ).Ok.cketh_block_index.toString(10),
                  ckerc20BlockIndex: (
                    withdraw as {
                      Ok: RetrieveErc20Request;
                    }
                  ).Ok.ckerc20_block_index.toString(10),
                  status: { Pending: null },
                  time: time.toString(10)
                });
                const currentInfo =
                  JSON.parse(localStorage.getItem(this.principal)) || {};
                if (!currentInfo['ckETHRetrieve-' + this.icNetworkTokens.id]) {
                  currentInfo['ckETHRetrieve-' + this.icNetworkTokens.id] = {};
                }
                currentInfo['ckETHRetrieve-' + this.icNetworkTokens.id][
                  canisterId
                ] = this.ckETHRetrieve;
                localStorage.setItem(
                  this.principal,
                  JSON.stringify(currentInfo)
                );
                this.retrieveStep = 2;
                this.getCKETHBalance(this.icNetworkTokens);
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
          } else {
            const withdraw = await this.ckETHMinterDfiService.withdraw_eth(
              this.icNetworkTokens.networkToIcId === '3' ||
                this.icNetworkTokens.networkId === '3'
                ? CK_ETH_MINTER_CANISTER_ID_TEST
                : CK_ETH_MINTER_CANISTER_ID,
              {
                recipient: this.ethDissolveFormCK.address.trim(),
                amount: BigInt(amount)
              }
            );
            console.log(withdraw);
            if (withdraw) {
              const type = Object.keys(withdraw)[0];
              if (type === 'Ok') {
                this.$message.success('Success');
                const time = Math.floor(new Date().getTime() / 1000);
                this.ckETHRetrieve.unshift({
                  recipient: this.ethDissolveFormCK.address.trim(),
                  amount: amount,
                  blockIndex: (
                    withdraw as {
                      Ok: RetrieveEthRequest;
                    }
                  ).Ok.block_index.toString(10),
                  status: { Pending: null },
                  time: time.toString(10)
                });
                const currentInfo =
                  JSON.parse(localStorage.getItem(this.principal)) || {};
                if (!currentInfo['ckETHRetrieve-' + this.icNetworkTokens.id]) {
                  currentInfo['ckETHRetrieve-' + this.icNetworkTokens.id] = {};
                }
                currentInfo['ckETHRetrieve-' + this.icNetworkTokens.id][
                  canisterId
                ] = this.ckETHRetrieve;
                localStorage.setItem(
                  this.principal,
                  JSON.stringify(currentInfo)
                );
                this.retrieveStep = 2;
                this.getCKETHBalance(this.icNetworkTokens);
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
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
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
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
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
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
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
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
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
          if (this.$route.name === 'Account') {
            this.getRetrieveETHList(false);
          }
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
      console.log(e);
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
      console.log(e);
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
        method: 'eth_getTransactionByHash'
      });
    } catch (e) {
      console.log(e);
      if (retry < ETHHttpsKeys.length) {
        await this.getEthTransactionByHash(
          txHash,
          ETHHttpsNum,
          ++retry,
          ETHHttpsKeys
        );
      }
    }
  }

  private async getBlockByNumber(
    block: number,
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
      const num = '0x' + block.toString(16);
      return await axios.post(ETHHttpsKeys[ETHHttpsNum], {
        id: 1,
        jsonrpc: '2.0',
        params: [num, true],
        method: 'eth_getBlockByNumber'
      });
    } catch (e) {
      console.log(e);
      if (retry < ETHHttpsKeys.length) {
        await this.getBlockByNumber(block, ETHHttpsNum, ++retry, ETHHttpsKeys);
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
      console.log(e);
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
        console.log(e);
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
              // await this.ckETHMinterService.updateClaims();
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
          if (this.$route.name === 'Account') {
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
          if (this.$route.name === 'Account') {
            this.updateRetrieveBtcStatus();
          }
        }
      }, 0);
    }, 30 * 1000);

    // icBTC update Submitted
    if (this.BTCType === BTCTypeEnum.icBTC) {
      this.updateIcBtcConfirmed();
      this.updateRetrieveBtcSubmittedStatusTimer = window.setInterval(() => {
        window.setTimeout(() => {
          if (!this.getCheckAuth) {
            if (this.$route.name === 'Account') {
              this.updateIcBtcConfirmed();
            }
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
          if (this.$route.name === 'Account') {
            this.getBTCTxs();
          }
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
    this.canRetrieveCkerc20 = true;
    if (this.icNetworkTokens.networkToIcId === '3') {
      this.ckerc20RetrieveFee = new BigNumber(
        this.icNetworkTokens.icTokenInfo.minAmount.toString(10)
      )
        .plus(getFee(this.tokens[ckETHSep]).toString(10))
        .div(10 ** this.tokens[ckETHSep].decimals)
        .toString(10);
    } else if (this.icNetworkTokens.networkToIcId === '1') {
      this.ckerc20RetrieveFee = new BigNumber(
        this.icNetworkTokens.icTokenInfo.minAmount.toString(10)
      )
        .plus(getFee(this.tokens[CK_ETH_LEDGER_CANISTER_ID]).toString(10))
        .plus(getFee(this.tokens[CK_ETH_LEDGER_CANISTER_ID]).toString(10))
        .div(10 ** this.tokens[CK_ETH_LEDGER_CANISTER_ID].decimals)
        .toString(10);
    }
    this.initCKETHRetrieve();
  }

  private initCKETHRetrieve(): void {
    if (this.principal && this.icNetworkTokens) {
      const id = this.icNetworkTokens.id;
      const tokenId = this.icNetworkTokens.tokenId;
      const currentInfo =
        JSON.parse(localStorage.getItem(this.principal)) || {};
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
          this.icNetworkTokens.networkToIcId === '3' ||
            this.icNetworkTokens.networkId === '3'
            ? CK_ETH_MINTER_CANISTER_ID_TEST
            : CK_ETH_MINTER_CANISTER_ID,
          BigInt(retrieve.blockIndex)
        );
        const currentStatus = Object.keys(res)[0];
        if (status !== currentStatus) {
          this.$set(
            retrieve,
            'status',
            JSON.parse(
              JSON.stringify(res, (key, value) =>
                typeof value === 'bigint' ? value.toString(10) : value
              )
            )
          );
          const currentInfo =
            JSON.parse(localStorage.getItem(this.principal)) || {};
          currentInfo['ckETHRetrieve-' + id][tokenId] = this.ckETHRetrieve;
          localStorage.setItem(this.principal, JSON.stringify(currentInfo));
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
      if (this.$route.name === 'Account') {
        this.getCKETHBalance(icNetworkTokens);
        this.getCkETHRetrieveStatus(
          icNetworkTokens.id,
          icNetworkTokens.tokenId
        );
      }
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
    if (this.principal && this.icNetworkTokens) {
      const id = this.icNetworkTokens.id;
      const tokenId = this.icNetworkTokens.tokenId;
      const currentInfo =
        JSON.parse(localStorage.getItem(this.principal)) || {};
      const ckETHMint = currentInfo['ckETHMint-' + id] || {};
      this.ckETHMint = ckETHMint[tokenId] || [];
      this.getCkETHMintBlockNum(id, tokenId);
      let minterId = CK_ETH_MINTER_CANISTER_ID;
      if (
        this.icNetworkTokens.networkId === '3' ||
        this.icNetworkTokens.networkToIcId === '3'
      ) {
        minterId = CK_ETH_MINTER_CANISTER_ID_TEST;
      }
      this.getLastScrapedBlockNumber(minterId).then((res) => {
        this.lastScrapedBlockNumber = res;
      });
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
    if (
      icNetworkTokens.icTokenInfo.type &&
      icNetworkTokens.icTokenInfo.type === 'dfinityERC20'
    ) {
      if (icNetworkTokens.networkToIcId === '3') {
        getTokenBalance({ icrc1: null }, ckETHSep).then((res) => {
          console.log(res);
          this.canRetrieveCkerc20 = new BigNumber(res)
            .div(10 ** this.tokens[ckETHSep].decimals)
            .gte(this.ckerc20RetrieveFee);
          this.$set(this.ERC20Balance, ckETHSep, res);
        });
      } else if (icNetworkTokens.networkToIcId === '1') {
        getTokenBalance({ icrc1: null }, CK_ETH_LEDGER_CANISTER_ID).then(
          (res) => {
            console.log(res);
            this.canRetrieveCkerc20 = new BigNumber(res)
              .div(10 ** this.tokens[CK_ETH_LEDGER_CANISTER_ID].decimals)
              .gte(this.ckerc20RetrieveFee);
            this.$set(this.ERC20Balance, CK_ETH_LEDGER_CANISTER_ID, res);
          }
        );
      }
    }
  }

  private getCKETHMinterInterval(
    icNetworkTokens: ICNetworkTokensInterface
  ): void {
    if (this.ckETHTimer) {
      window.clearInterval(this.ckETHTimer);
      this.ckETHTimer = null;
    }
    this.ckETHTimer = window.setInterval(() => {
      if (this.$route.name === 'Account') {
        this.getCkETHMintBlockNum(icNetworkTokens.id, icNetworkTokens.tokenId);
        let minterId = CK_ETH_MINTER_CANISTER_ID;
        if (
          icNetworkTokens.networkId === '3' ||
          icNetworkTokens.networkToIcId === '3'
        ) {
          minterId = CK_ETH_MINTER_CANISTER_ID_TEST;
        }
        this.getLastScrapedBlockNumber(minterId).then((res) => {
          this.lastScrapedBlockNumber = res;
        });
        this.getCKETHBalance(icNetworkTokens);
      }
    }, 30 * 1000);
  }

  private async getCkETHMintBlockNum(
    id: string,
    tokenId: string
  ): Promise<void> {
    let ETHHttps = ETHHttpsMainnet;
    if (
      this.icNetworkTokens.networkId === '3' ||
      this.icNetworkTokens.networkToIcId === '3'
    ) {
      ETHHttps = ETHHttpsSepolia;
    }
    this.getEthBlock(0, 0, ETHHttps).then((res) => {
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
          ETHHttps
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
            if (receipt.status && receipt.status === '0x0') {
              this.$set(mint, 'txStatus', 'Failed');
            }
            const currentInfo =
              JSON.parse(localStorage.getItem(this.principal)) || {};
            if (!currentInfo['ckETHMint-' + id]) {
              currentInfo['ckETHMint-' + id] = {};
            }
            currentInfo['ckETHMint-' + id][tokenId] = this.ckETHMint;
            localStorage.setItem(this.principal, JSON.stringify(currentInfo));
          }
        }
      } else {
        break;
      }
    }
  }

  private async getLastScrapedBlockNumber(
    ckETHMinterId: string
  ): Promise<number> {
    const res = await this.ckETHMinterDfiService.get_minter_info(ckETHMinterId);
    if (res) {
      return Number(res.last_observed_block_number[0]);
    }
  }

  private initETHDeposit(): void {
    console.log(this.forgeModalETH);
    if (this.forgeModalETH) {
      this.getETHDepositBalance();
      this.getMintDepositing();
      console.log('getMintDepositing');
      this.updateDepositETHStatusTimer = window.setInterval(() => {
        window.setTimeout(() => {
          if (!this.getCheckAuth) {
            if (this.$route.name === 'Account') {
              // this.updateDepositETHStatus();
              this.getETHDepositBalance();
              this.getMintDepositing();
            }
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
        let ckETHId = '1';

        if (
          this.icNetworkTokens.networkId === '3' ||
          this.icNetworkTokens.networkToIcId === '3'
        ) {
          ckETHId = '3';
          this.ckEthLink = 'https://sepolia.etherscan.io/';
        } else {
          this.ckEthLink = 'https://etherscan.io';
        }
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
          if (Number(this.minterInfo.chainId) === 11155111) {
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
    console.log(this.icNetworkTokens);
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
                          networkId === '2'
                            ? ETHHttps
                            : networkId === '3'
                            ? ETHHttpsSepolia
                            : ETHHttpsMainnet
                        ).then((res) => {
                          this.ethereumIsConnected = true;
                          const balance = new BigNumber(res)
                            .div(
                              10 **
                                this.tokens[this.networkTokensFrom[val].tokenId]
                                  .decimals
                            )
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
                          networkId === '2'
                            ? ETHHttps
                            : networkId === '3'
                            ? ETHHttpsSepolia
                            : ETHHttpsMainnet
                        ).then((res) => {
                          this.ethereumIsConnected = true;
                          const balance = new BigNumber(res)
                            .div(
                              10 **
                                this.tokens[this.networkTokensTo[val].tokenId]
                                  .decimals
                            )
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

  private pageChangeCKETHResponse(page: number) {
    this.CKETHResponsePage = page;
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
        console.log(e);
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
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  private async updateRetrievals(): Promise<void> {
    // const num = Math.floor(Math.random() * ETHWebsocketProvider.length);
    // const res = await this.ckETHMinterService.updateRetrievals();
    // if (res && res.length) {
    //   res.forEach((item: [TxStatus, bigint]) => {
    //     const web3 = new Web3(ETHWebsocketProvider[num]);
    //     web3.eth
    //       .sendSignedTransaction(
    //         '0x' + toHexString(new Uint8Array(item[0].signedTx[0][0]))
    //       )
    //       .then((receipt) => {
    //         console.log(receipt);
    //       });
    //   });
    // }
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
        Principal.fromText(this.principal)
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
            if (this.$route.name === 'Account') {
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
          console.log(e);
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
    this.$emit('getBalance');
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
    this.$emit('getBalance');
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
        await this.$emit('getBalance');
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
    this.$emit('getBalance');
    this.$refs.topUp.visibleTopUp = true;
  }

  private async topUpSuccess(): Promise<void> {
    this.$emit('getBalance');
    this.$emit('topUpSuccess');
  }

  private approveIcrc2Success(): void {
    this.$emit('getBalance');
  }

  private async transferTokenSuccess(): Promise<void> {
    try {
      this.getCkBTCBalance();
    } catch (e) {
      console.log(e);
    }
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
      if (erc20TokenInfo.type && erc20TokenInfo.type === 'dfinityERC20') {
        const fee = new BigNumber(this.tokens[ERC20TokenId].fee.toString(10))
          .div(10 ** this.tokens[ERC20TokenId].decimals)
          .toString(10);
        const min = Number(
          new BigNumber(this.ERC20Balance[ERC20TokenId])
            .div(10 ** this.tokens[ERC20TokenId].decimals)
            .minus(fee)
            .minus(value)
        );
        if (value && min < 0) {
          callback(
            `Insufficient ${this.icNetworkTokens.symbol} (${
              networkIds[this.icNetworkTokens.networkId]
            })`
          );
        } else {
          callback();
        }
      } else {
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
      callback();
    }
  }

  private getRetrieveBtcTxidResponse(val: RetrieveBtcStatus): string {
    if (val) {
      const status = Object.keys(val)[0];
      const hasTxid = ['Submitted', 'Sending', 'Confirmed'];
      if (hasTxid.includes(status)) {
        let txid = JSON.parse(JSON.stringify(Object.values(val)[0].txid));
        txid = txid.reverse();
        return toHexString(new Uint8Array(txid));
      }
    }
    return null;
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
            const ethChainId =
              this.icNetworkTokens.networkId === '1' ||
              this.icNetworkTokens.networkToIcId === '1'
                ? '0x1'
                : '0xaa36a7';
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
            console.log(this.icNetworkTokens);
            const amount =
              '0x' +
              new BigNumber(this.erc20Form.amount).times(10 ** 18).toString(16);
            const _principalHex = principalToBytes32(this.principal);
            const web3 = new Web3();
            console.log(amount, _principalHex);
            console.log(this.smartContractAddress);
            if (this.icNetworkTokens.tokenId === CK_ETH_LEDGER_CANISTER_ID) {
              const ethContract = new web3.eth.Contract(
                ethAbi,
                this.smartContractAddress
              );
              const contractData = ethContract.methods
                .deposit(_principalHex)
                .encodeABI();
              const sendTransactionRes = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                  {
                    from: accounts[0],
                    to: this.smartContractAddress,
                    value: amount,
                    data: contractData
                  }
                ]
              });
              console.log(sendTransactionRes);
              const amountMint = new BigNumber(this.erc20Form.amount)
                .times(10 ** 18)
                .toString(10);
              const time = Math.floor(new Date().getTime() / 1000);
              this.ckETHMint.unshift({
                txHash: sendTransactionRes,
                amount: amountMint,
                blockNum: '',
                time: time.toString(10)
              });
              const currentInfo =
                JSON.parse(localStorage.getItem(this.principal)) || {};
              if (!currentInfo['ckETHMint-' + this.icNetworkTokens.id]) {
                currentInfo['ckETHMint-' + this.icNetworkTokens.id] = {};
              }
              currentInfo['ckETHMint-' + this.icNetworkTokens.id][
                this.icNetworkTokens.tokenId
              ] = this.ckETHMint;
              localStorage.setItem(this.principal, JSON.stringify(currentInfo));
              this.changeMintStepCK(2);
              this.onGetMintCKETHPending();
            } else if (this.icNetworkTokens.tokenId === ckETHSep) {
              const ethContract = new web3.eth.Contract(
                ethAbi,
                this.icNetworkTokens.id
              );
              const contractData = ethContract.methods
                .deposit(_principalHex)
                .encodeABI();
              const sendTransactionRes = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                  {
                    from: accounts[0],
                    to: this.icNetworkTokens.id,
                    value: amount,
                    data: contractData
                  }
                ]
              });
              console.log(sendTransactionRes);
              const amountMint = new BigNumber(this.erc20Form.amount)
                .times(10 ** 18)
                .toString(10);
              const time = Math.floor(new Date().getTime() / 1000);
              this.ckETHMint.unshift({
                txHash: sendTransactionRes,
                amount: amountMint,
                blockNum: '',
                time: time.toString(10)
              });
              const currentInfo =
                JSON.parse(localStorage.getItem(this.principal)) || {};
              if (!currentInfo['ckETHMint-' + this.icNetworkTokens.id]) {
                currentInfo['ckETHMint-' + this.icNetworkTokens.id] = {};
              }
              currentInfo['ckETHMint-' + this.icNetworkTokens.id][
                this.icNetworkTokens.tokenId
              ] = this.ckETHMint;
              localStorage.setItem(this.principal, JSON.stringify(currentInfo));
              this.changeMintStepCK(2);
              this.onGetMintCKETHPending();
            } else {
              (loading as any).setText(
                `Approve ${this.icNetworkTokens.icTokenInfo.symbol} ...`
              );
              const web3 = new Web3(ethereum);
              const tokenContract = new web3.eth.Contract(
                abi,
                this.icNetworkTokens.id
              );
              const amount =
                '0x' +
                new BigNumber(this.erc20Form.amount)
                  .times(
                    10 ** this.tokens[this.icNetworkTokens.tokenId].decimals
                  )
                  .toString(16);
              const approveRes = await tokenContract.methods
                .approve(this.smartContractAddressERC20, amount)
                .send({ from: accounts[0] });
              console.log(approveRes);
              (loading as any).setText(
                `Deposit ${this.icNetworkTokens.icTokenInfo.symbol} ...`
              );
              const ERC20Contract = new web3.eth.Contract(
                erc20ABI,
                this.smartContractAddressERC20
              );
              const contractData = ERC20Contract.methods
                .deposit(this.icNetworkTokens.id, amount, _principalHex)
                .encodeABI();
              const sendTransactionRes = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                  {
                    from: accounts[0],
                    to: this.smartContractAddressERC20,
                    data: contractData
                  }
                ]
              });
              console.log(sendTransactionRes);
              const amountMint = new BigNumber(this.erc20Form.amount)
                .times(10 ** this.tokens[this.icNetworkTokens.tokenId].decimals)
                .toString(10);
              const time = Math.floor(new Date().getTime() / 1000);
              this.ckETHMint.unshift({
                txHash: sendTransactionRes,
                amount: amountMint,
                blockNum: '',
                time: time.toString(10)
              });
              const currentInfo =
                JSON.parse(localStorage.getItem(this.principal)) || {};
              if (!currentInfo['ckETHMint-' + this.icNetworkTokens.id]) {
                currentInfo['ckETHMint-' + this.icNetworkTokens.id] = {};
              }
              currentInfo['ckETHMint-' + this.icNetworkTokens.id][
                this.icNetworkTokens.tokenId
              ] = this.ckETHMint;
              localStorage.setItem(this.principal, JSON.stringify(currentInfo));
              this.changeMintStepCK(2);
              this.onGetMintCKETHPending();
            }
          } catch (e) {
            console.log(e);
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
            if (Number(this.minterInfo.chainId) === 11155111) {
              ethChainId = '0xaa36a7';
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
            console.log(e);
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
    console.log('getDepositInfo');
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
      if (this.$route.name === 'Account') {
        this.checkTxReceipt(hash);
      }
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
        if (Number(this.minterInfo.chainId) === 11155111) {
          ethChainId = '0xaa36a7';
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
            principal: this.principal,
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
        console.log(e);
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

<style lang="scss" scoped>
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
  width: 100px;
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
    right: -20px;
    margin-left: 160px;
    font-size: 12px;
  }
  a {
    color: #1996c4;
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
