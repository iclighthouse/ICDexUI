<template>
  <div>
    <div class="home-header">
      <div class="home-header-left">
        <img
          class="home-header-logo"
          src="@/assets/img/cyclesfinance-1.png"
          alt="logo"
        />
      </div>
      <ul>
        <li
          v-for="(menu, index) in exchangeMenu"
          :key="index"
          :class="{ active: exchangeType === menu }"
          @click="change(menu)"
        >
          {{ menu }}
        </li>
      </ul>
      <account-info :menu-list="menuList"></account-info>
    </div>
    <div class="cycles-finance-main container-width">
      <div class="exchange-fee-item">
        <dl>
          <dt>Liquidity</dt>
          <dd v-if="liquidity">
            <div class="exchange-fee-item-left">
              <div>
                <span class="num-span">{{
                  liquidity.icpE8s | filterIcpFloat(2)
                }}</span
                ><span class="num-span-i">/</span>
              </div>
              <div><span>ICP</span><span class="line"></span></div>
            </div>
            <!--<div class="exchange-fee-item-icon"><i></i><i></i></div>-->
            <div class="exchange-fee-item-right">
              <div>
                <span class="num-span">{{
                  liquidity.cycles | bigintToFloat(0)
                }}</span>
              </div>
              <div>
                <span>TCycles</span>
              </div>
            </div>
          </dd>
        </dl>
        <dl>
          <dt>Price</dt>
          <dd class="price-dd">
            <div class="icp-per-cycles" v-if="icpPerCycles">
              <span class="num-span">{{ icpPerCycles | filterPerCycles }}</span>
            </div>
            <div>
              <span>TCycles<span class="line">/</span>ICP</span>
              <div>
                <span>NNS price: {{ icpToCyclesConversionRate }}</span>
              </div>
            </div>
          </dd>
        </dl>
        <dl class="exchange-fee-item-h5">
          <dt>Count</dt>
          <dd v-if="liquidity">
            <div class="swap-count">
              <span class="num-span">{{ liquidity.swapCount }}</span>
              <div>Swaps</div>
            </div>
          </dd>
        </dl>
        <dl class="exchange-fee-item-h5">
          <dt>Vol</dt>
          <dd v-if="liquidity">
            <div class="exchange-fee-item-left">
              <div>
                <span class="num-span">{{
                  liquidity.vol.swapIcpVol | filterIcpFloat(2)
                }}</span
                ><span class="num-span-i">/</span>
              </div>
              <div><span>ICP</span><span class="line"></span></div>
            </div>
            <!--<div class="exchange-fee-item-icon"><i></i><i></i></div>-->
            <div class="exchange-fee-item-right">
              <div>
                <span class="num-span">{{
                  liquidity.vol.swapCyclesVol | bigintToFloat(0)
                }}</span>
              </div>
              <div>
                <span>TCycles</span>
              </div>
            </div>
          </dd>
        </dl>
      </div>
      <!--<div class="exchange-menu">
        <button
          v-for="(menu, index) in exchangeMenu"
          :key="index"
          :class="{ active: exchangeType === menu }"
          @click="change(menu)"
        >
          {{ menu }}
        </button>
      </div>-->
      <div class="exchange">
        <div class="exchange-swap" v-show="exchangeType === exchangeMenu.Swap">
          <div
            class="exchange-swap-item"
            :class="{
              'exchange-swap-item-cycles exchange-swap-item-icp':
                swapType === 'icpToCycles'
            }"
          >
            <a-icon
              @click="visibleSwap = true"
              class="swap-setting"
              type="setting"
            />
            <div
              v-show="swapType === 'icpToCycles'"
              class="exchange-swap-item-top"
            >
              <div class="exchange-swap-item-top-logo">
                <img
                  class="dfinity-logo"
                  src="@/assets/img/dfinity.png"
                  alt=""
                />
                <span>ICP</span>
              </div>
              <a-input
                v-model="depositAmount"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                v-only-float="8"
                placeholder="0.0"
                @input="depositAmountChange"
                suffix="ICP"
              />
            </div>
            <div
              class="insufficient-input"
              v-show="
                swapType === 'icpToCycles' &&
                buttonName.includes('Limit of') &&
                buttonName.includes('ICP')
              "
            >
              Limit of
              {{ limitIcp }}
              ICP
            </div>
            <div
              v-show="swapType === 'icpToCycles'"
              class="exchange-swap-item-bottom"
            >
              <span
                >Balance: {{ balance | bigintToFloat(4, 0) }} ICP
                <a-icon
                  v-show="!refreshBalanceLoading"
                  @click="getIcpBalance"
                  type="reload"
                  class="reload-icon" />
                <a-icon
                  v-show="refreshBalanceLoading"
                  type="loading"
                  class="reload-icon"
              /></span>
              <span class="exchange-swap-item-bottom-fee"
                >Fee: {{ this.fee }} ICP</span
              >
            </div>
            <div
              v-show="swapType === 'icpToCycles'"
              style="margin-top: 5px; font-size: 12px"
              class="exchange-swap-item-bottom"
            >
              <span
                >Temp DepositAccount balance: {{ depositBalance }} ICP
                <a-icon
                  v-show="!refreshDepositBalanceLoading"
                  @click="getDepositBalance"
                  type="reload"
                  class="reload-icon"
                />
                <a-icon
                  v-show="refreshDepositBalanceLoading"
                  type="loading"
                  class="reload-icon"
                />
                <span
                  @click="withdraw"
                  v-show="depositBalance && depositBalance - 2 * fee > 0"
                  class="withdraw-deposit"
                  >withdraw</span
                >
              </span>
            </div>
            <div
              v-show="
                swapType === 'cyclesToIcp' &&
                (wallets ? !wallets.length : false)
              "
              class="no-cycles-wallet"
            >
              You don't have a cycles wallet yet,
              <router-link to="/wallet">create or bind one.</router-link>
            </div>
            <div
              v-show="swapType === 'cyclesToIcp'"
              class="exchange-swap-item-top exchange-swap-item-icp"
            >
              <div class="exchange-swap-item-top-logo">
                <p class="cycles-logo"><i class="cycles-logo-i">c</i> cycles</p>
              </div>
            </div>
            <div
              v-show="swapType === 'cyclesToIcp'"
              class="exchange-swap-item-top"
            >
              <a-select
                class="input-cycles-select"
                v-model="cyclesCanister"
                placeholder="select cycles wallet Canister-id"
                @change="cyclesChange"
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
              <!--<a-input
								v-model="cyclesCanister"
								type="text"
								autocomplete="off"
								placeholder="Canister ID(Principal)"
								@input="getCycles"
								class="input-cycles"
							/>-->
              <a-input
                class="exchange-swap-item-top-input input-cycles-suffix"
                v-model="cyclesAmount"
                autocomplete="off"
                type="text"
                placeholder="0.0"
                v-only-float="12"
                @input="cyclesAmountChange"
                suffix="TCycles"
              />
            </div>
            <div
              class="insufficient-input"
              v-show="
                swapType === 'cyclesToIcp' &&
                buttonName.includes('Limit of') &&
                buttonName.includes('Cycles')
              "
            >
              Limit of
              {{ limitCycles }}
              TCycles
            </div>
            <div
              v-show="swapType === 'cyclesToIcp'"
              class="exchange-swap-item-bottom"
            >
              <span
                >Balance: {{ cycles | bigintToFloat }} TCycles
                <a-icon
                  v-show="!refreshCyclesLoading"
                  @click="getCycles"
                  type="reload"
                  class="reload-icon" />
                <a-icon
                  v-show="refreshCyclesLoading"
                  type="loading"
                  class="reload-icon"
              /></span>
            </div>
          </div>
          <div class="exchange-swap-icon">
            <a-icon class="swap-icon" type="swap" @click="changeSwapType" />
          </div>
          <div
            class="exchange-swap-item"
            :class="{
              'exchange-swap-item-cycles exchange-swap-item-icp':
                swapType === 'icpToCycles'
            }"
          >
            <div
              v-show="
                swapType === 'icpToCycles' &&
                (wallets ? !wallets.length : false)
              "
              class="no-cycles-wallet no-cycles-wallet-cycles"
            >
              You don't have a cycles wallet yet,
              <router-link to="/wallet">create or bind one.</router-link>
            </div>
            <div
              v-show="swapType === 'icpToCycles'"
              class="exchange-swap-item-top"
            >
              <div class="exchange-swap-item-top-logo">
                <p class="cycles-logo"><i class="cycles-logo-i">c</i> Cycles</p>
              </div>
              <div class="cycles-tip">
                how to send cycles to canister
                <a-icon
                  @click="visibleCycles = true"
                  class="question-circle-icon"
                  type="question-circle"
                />
              </div>
            </div>
            <div
              v-show="swapType === 'icpToCycles'"
              class="exchange-swap-item-top"
            >
              <a-select
                class="input-cycles-select"
                v-model="cyclesCanister"
                placeholder="select cycles wallet Canister-id"
                @change="cyclesChange"
                notFoundContent="Not Found"
                option-label-prop="label"
                :filterOption="false"
              >
                <a-select-option
                  v-for="wallet in wallets"
                  :key="wallet.walletId.toString()"
                  :label="wallet.walletId.toString()"
                  >{{ wallet.walletId.toString() }}
                  <a-icon v-if="wallet.isDefault" type="check-circle"
                /></a-select-option>
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0" />
                  <div
                    class="other-cycles"
                    @mousedown="(e) => e.preventDefault()"
                    @click="cyclesFormVisible = true"
                  >
                    Other
                  </div>
                </div>
                <!--<div slot="dropdownRender">
									<a-divider style="margin: 4px 0" />
									<div
										style="padding: 4px 8px; cursor: pointer"
										@mousedown="(e) => e.preventDefault()"
									>
										Other
									</div>
								</div>-->
              </a-select>
              <!--<a-input
								class="input-cycles"
								autocomplete="off"
								v-model="cyclesCanister"
								type="text"
								placeholder="Canister ID(Principal)"
								@input="getCycles"
							/>-->
              <a-input
                class="exchange-swap-item-top-input input-cycles-suffix"
                v-model="cyclesAmount"
                autocomplete="off"
                type="text"
                placeholder="0.0"
                v-only-float="12"
                @input="cyclesAmountChange"
                suffix="TCycles"
              />
            </div>
            <div
              v-show="swapType === 'icpToCycles'"
              class="exchange-swap-item-bottom"
            >
              <span
                >Balance: {{ cycles | bigintToFloat }} TCycles
                <a-icon
                  @click="getCycles"
                  v-show="!refreshCyclesLoading"
                  type="reload"
                  class="reload-icon" />
                <a-icon
                  v-show="refreshCyclesLoading"
                  type="loading"
                  class="reload-icon"
              /></span>
              <span class="margin-left-auto"
                >Fee({{ configFee * 100 }}%):
                {{
                  swapType === 'icpToCycles'
                    ? `${swappingFee} TCycles`
                    : `${swappingFee} ICP`
                }}</span
              >
            </div>
            <div
              v-show="swapType === 'cyclesToIcp'"
              class="exchange-swap-item-top"
            >
              <div class="exchange-swap-item-top-logo">
                <img
                  class="dfinity-logo"
                  src="@/assets/img/dfinity.png"
                  alt=""
                />
                <span>ICP</span>
              </div>
              <a-input
                v-model="depositAmount"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                v-only-float="8"
                placeholder="0.0"
                @input="depositAmountChange"
                suffix="ICP"
              />
            </div>
            <div
              v-show="swapType === 'cyclesToIcp'"
              class="exchange-swap-item-bottom"
            >
              <span
                >Balance: {{ balance | bigintToFloat(4, 0) }} ICP
                <a-icon
                  @click="getIcpBalance"
                  v-show="!refreshBalanceLoading"
                  type="reload"
                  class="reload-icon" />
                <a-icon
                  v-show="refreshBalanceLoading"
                  type="loading"
                  class="reload-icon"
              /></span>
              <span class="margin-left-auto"
                >Fee({{ configFee * 100 }}%):
                {{
                  swapType === 'icpToCycles'
                    ? `${swappingFee} TCycles`
                    : `${swappingFee} ICP`
                }}
                + 0.0001 ICP</span
              >
            </div>
            <div
              v-show="swapType === 'cyclesToIcp'"
              class="exchange-swap-item-bottom"
              style="margin-top: 5px; font-size: 12px"
            >
              <span
                >Temp DepositAccount balance: {{ depositBalance }} ICP
                <a-icon
                  v-show="!refreshDepositBalanceLoading"
                  @click="getDepositBalance"
                  type="reload"
                  class="reload-icon"
                />
                <a-icon
                  v-show="refreshDepositBalanceLoading"
                  type="loading"
                  class="reload-icon"
                />
                <span
                  @click="withdraw"
                  v-show="depositBalance && depositBalance - 2 * fee > 0"
                  class="withdraw-deposit"
                  >withdraw</span
                >
              </span>
            </div>
          </div>
          <div class="exchange-swap-liquidity" v-show="conversionRate">
            <div class="exchange-swap-liquidity-h5">
              <span v-show="swapType === 'icpToCycles'">
                ICP&nbsp;<a-icon type="arrow-right" />&nbsp;Cycles
              </span>
              <span v-show="swapType === 'cyclesToIcp'">
                Cycles&nbsp;<a-icon type="arrow-right" />&nbsp;ICP
              </span>
            </div>
            <div class="margin-left-auto">
              <span v-show="swapType === 'icpToCycles'"
                >1 ICP = {{ conversionRate }} TCycles</span
              >
              <span v-show="swapType === 'cyclesToIcp'"
                >1 TCycles = {{ conversionRateToIcp }} ICP</span
              ><span
                class="slippage-span"
                :class="{ 'slippage-error': slippage > 20 || slippage < -20 }"
              >
                (Price Impact: {{ slippage }}%)
              </span>
              <span
                ><a-tooltip placement="bottom">
                  <template slot="title">
                    <div>Swap volatility: {{ slippage }}%</div>
                    <div>
                      Swapping fee:
                      {{
                        swapType === 'icpToCycles'
                          ? `${swappingFee} TCycles`
                          : `${swappingFee} ICP`
                      }}
                    </div>
                  </template>
                  <a-icon type="info-circle" /></a-tooltip
              ></span>
            </div>
          </div>
          <div class="swap-button">
            <button
              v-if="getPrincipalId"
              class="primary large-primary"
              :disabled="buttonDisabled"
              @click="swap"
            >
              {{ buttonName }}
            </button>
            <button v-else class="primary large-primary" @click="connectWallet">
              Connect Wallet
            </button>
            <div class="cycles-finance-tip">
              It takes 3 to 20 seconds to update the ICP and Cycles balance
              after the transaction is completed.
            </div>
          </div>
        </div>
        <div
          class="exchange-pool"
          v-show="exchangeType === exchangeMenu.Liquidity"
        >
          <div class="exchange-swap-item exchange-swap-item-liquidity">
            <div class="shares-main">
              <div class="shares-main-total">
                <span>Total shares:</span>
                <span v-if="liquidity" class="user-liquidity-share">
                  {{ liquidity.shares | formatNum('abbreviation')
                  }}<span v-show="checkNum(liquidity.shares)"> T</span>
                </span>
              </div>
              <div v-if="getPrincipalId" class="shares-main-user">
                <span>Your shares:</span>
                <span v-if="userLiquidity" class="user-liquidity-share"
                  >{{ userLiquidity.shares | formatNum('abbreviation')
                  }}<span v-show="checkNum(userLiquidity.shares)">
                    T</span
                  ></span
                >
                <span v-if="userLiquidity" class="user-liquidity-value">
                  (value:
                  {{ userLiquidity.icpE8s | filterIcpFloat }}
                  ICP +
                  {{ userLiquidity.cycles | bigintToFloat }}
                  TCycles)</span
                >
              </div>
              <div v-if="getPrincipalId" class="your-liquidity-header">
                <button
                  class="your-liquidity-header-add"
                  @click="onAddLiquidity"
                  :class="{ active: liquidityType === 'Add' }"
                >
                  Add
                </button>
                <div class="your-liquidity-header-button">
                  <button
                    :class="{ active: liquidityType === 'Remove' }"
                    @click="removeLiquidity"
                  >
                    Remove
                  </button>
                  <button
                    :class="{ active: liquidityType === 'Claim' }"
                    @click="onClaimLiquidity"
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div>
            <div class="yield-main">
              <span>Estimated APY:&nbsp;&nbsp;</span>
              <div v-if="cYield">
                <span
                  >Cycles {{ cYield[0].apyCycles | filterPercentage }}%, ICP
                  {{ cYield[0].apyIcp | filterPercentage }}% (24-Hour APY)</span
                ><span style="margin-top: 5px"
                  >Cycles {{ cYield[1].apyCycles | filterPercentage }}%, ICP
                  {{ cYield[1].apyIcp | filterPercentage }}% (7-Day APY)</span
                >
              </div>
            </div>
          </div>
          <div v-show="liquidityType === 'Add'">
            <div class="exchange-swap-item">
              <div class="exchange-swap-item-top">
                <div class="exchange-swap-item-top-title">ICP Account:</div>
              </div>
              <div class="exchange-swap-item-top">
                <!--<img
										class="dfinity-logo"
										src="@/assets/img/dfinity.png"
										alt=""
									/>-->
                <copy-account
                  :front="8"
                  class="exchange-swap-item-top-account"
                  :account="account"
                ></copy-account>
                <a-input
                  v-model="depositAmount"
                  class="input-icp-suffix"
                  v-only-float="8"
                  autocomplete="off"
                  type="text"
                  placeholder="0.0"
                  @input="depositAmountChangeForLiquidity"
                  suffix="ICP"
                />
              </div>
              <div
                class="insufficient-input"
                v-show="
                  liquidityButtonName === 'Insufficient ICP' ||
                  liquidityButtonName === 'Insufficient ICP and Cycles'
                "
              >
                Insufficient ICP
              </div>
              <div
                class="insufficient-input"
                v-show="
                  liquidityButtonName.includes('Limit of') &&
                  liquidityButtonName.includes('ICP')
                "
              >
                Limit of
                {{ limitIcp }}
                ICP
              </div>
              <div class="exchange-swap-item-bottom">
                <span
                  >Balance: {{ balance | bigintToFloat(4, 0) }} ICP
                  <a-icon
                    @click="getIcpBalance"
                    v-show="!refreshBalanceLoading"
                    type="reload"
                    class="reload-icon" />
                  <a-icon
                    v-show="refreshBalanceLoading"
                    type="loading"
                    class="reload-icon"
                /></span>
                <span class="exchange-swap-item-bottom-fee"
                  >Fee: {{ this.fee }} ICP</span
                >
              </div>
              <div
                class="exchange-swap-item-bottom"
                style="margin-top: 5px; font-size: 12px"
              >
                <span
                  >Temp DepositAccount balance: {{ depositBalance }} ICP
                  <a-icon
                    v-show="!refreshDepositBalanceLoading"
                    @click="getDepositBalance"
                    type="reload"
                    class="reload-icon"
                  />
                  <a-icon
                    v-show="refreshDepositBalanceLoading"
                    type="loading"
                    class="reload-icon"
                  />
                  <span
                    @click="withdraw"
                    v-show="depositBalance && depositBalance - 2 * fee > 0"
                    class="withdraw-deposit"
                    >withdraw</span
                  >
                </span>
              </div>
            </div>
            <div class="exchange-swap-icon">
              <a-icon type="plus" class="exchange-swap-icon-plus" />
            </div>
            <div class="exchange-swap-item exchange-swap-item-cycles">
              <div
                class="no-cycles-wallet"
                v-show="wallets ? !wallets.length : false"
              >
                You don't have a cycles wallet yet,
                <router-link to="/wallet">create or bind one.</router-link>
              </div>
              <div class="exchange-swap-item-top">
                <div class="exchange-swap-item-top-title">Cycles Wallet:</div>
              </div>
              <div class="exchange-swap-item-top">
                <a-select
                  class="input-cycles-select"
                  v-model="cyclesCanister"
                  placeholder="select cycles wallet Canister-id"
                  @change="cyclesChange"
                  notFoundContent="Not Found"
                  option-label-prop="label"
                  :filterOption="false"
                >
                  <a-select-option
                    v-for="wallet in wallets"
                    :key="wallet.walletId.toString()"
                    :label="wallet.walletId.toString()"
                    >{{ wallet.walletId.toString() }}
                    <a-icon v-if="wallet.isDefault" type="check-circle"
                  /></a-select-option>
                </a-select>
                <!--<a-input
									autocomplete="off"
									class="input-cycles"
									v-model="cyclesCanister"
									type="text"
									placeholder="Canister ID(Principal)"
									@input="getCycles"
								/>-->
                <a-input
                  class="exchange-swap-item-top-input input-cycles-suffix"
                  v-model="cyclesAmount"
                  autocomplete="off"
                  type="text"
                  placeholder="0.0"
                  v-only-float="12"
                  @input="cyclesAmountChangeForLiquidity"
                  suffix="TCycles"
                />
              </div>
              <div
                class="insufficient-input"
                v-show="
                  liquidityButtonName === 'Insufficient Cycles' ||
                  liquidityButtonName === 'Insufficient ICP and Cycles'
                "
              >
                Insufficient Cycles
              </div>
              <div
                class="insufficient-input"
                v-show="
                  liquidityButtonName.includes('Limit of') &&
                  liquidityButtonName.includes('TCycles')
                "
              >
                Limit of
                {{ limitCycles }}
                TCycles
              </div>
              <div class="exchange-swap-item-bottom">
                <span
                  >Balance: {{ cycles | bigintToFloat }} TCycles
                  <a-icon
                    @click="getCycles"
                    v-show="!refreshCyclesLoading"
                    type="reload"
                    class="reload-icon" />
                  <a-icon
                    v-show="refreshCyclesLoading"
                    type="loading"
                    class="reload-icon"
                /></span>
              </div>
            </div>
            <div class="exchange-swap-icon">
              <a-icon type="arrow-down" class="exchange-swap-icon-plus" />
            </div>
            <div class="exchange-swap-item">
              <div class="exchange-swap-item-top">
                <div>You will get</div>
                <div class="you-get-shares">
                  &nbsp;{{ liquidityShare | formatNum }}&nbsp;
                </div>
                <div>Shares</div>
              </div>
              <div
                class="
                  exchange-swap-item-bottom exchange-swap-item-bottom-share
                "
              >
                <div>1,000,000</div>
                <div>&nbsp;Shares =&nbsp;</div>
                <div>
                  {{ (liquidity && liquidity.unitValue[1]) | filterUnitIcp }}
                </div>
                &nbsp;ICP +&nbsp;
                <div>
                  {{ (liquidity && liquidity.unitValue[0]) | filterUnitCycles }}
                </div>
                &nbsp;TCycles
              </div>
              <!-- <p>You will get shares</p>-->
              <!--<div class="exchange-swap-item-share-item">
									&lt;!&ndash;<dl>
										<dt>{{ icpPerCycles | filterPerCycles }}</dt>
										<dd>1 ICP per TCycles</dd>
									</dl>
									<dl>
										<dt>{{ cyclesPerIcp | filterFloat }}</dt>
										<dd>1 TCycles per ICP</dd>
									</dl>
									<dl>
										<dt>{{ liquidityShare }}</dt>
										<dd>Share of Pool</dd>
									</dl>&ndash;&gt;
								</div>-->
            </div>
            <div class="swap-button">
              <button
                v-if="getPrincipalId"
                class="primary"
                :disabled="liquidityButtonDisabled"
                @click="addLiquidity"
              >
                {{ liquidityButtonName }}
              </button>
              <button
                v-else
                class="primary large-primary"
                @click="connectWallet"
              >
                Connect Wallet
              </button>
              <div class="cycles-finance-tip">
                It takes 3 to 20 seconds to update the ICP and Cycles balance
                after the transaction is completed.
              </div>
            </div>
          </div>
          <div v-show="liquidityType === 'Claim'">
            <div class="exchange-swap-item">
              <div
                class="exchange-swap-item-top exchange-swap-item-top-allocable"
              >
                <div style="width: 137px">Rewards Remaining:</div>
                <div v-if="feeStatus" class="flex">
                  <div>
                    {{ feeStatus.totalFee.icpBalance | filterIcpFloat }} ICP
                  </div>
                  &nbsp;
                  <a-icon type="plus" />
                  &nbsp;
                  <div>
                    {{ feeStatus.totalFee.cyclesBalance | bigintToFloat }}
                    TCycles
                  </div>
                </div>
              </div>
              <div>
                <div class="your-rewards">
                  <span style="width: 137px">Your Rewards:</span>
                  <div>
                    <span v-if="lpRewards">
                      <span class="base-color-w">{{
                        lpRewards.icp | filterIcpFloat
                      }}</span>
                      ICP&nbsp;<a-icon v-if="feeStatus" type="plus" />&nbsp;
                      <span class="base-color-w">{{
                        lpRewards.cycles | bigintToFloat
                      }}</span>
                      TCycles
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="exchange-swap-icon">
              <a-icon type="arrow-down" class="exchange-swap-icon-plus" />
            </div>
            <div class="exchange-swap-item">
              <div class="exchange-swap-item-top">
                <div>ICP Account:</div>
              </div>
              <div class="base-color-w">
                <copy-account :front="8" :account="account"></copy-account>
              </div>
            </div>
            <div class="exchange-swap-icon">
              <a-icon type="plus" class="exchange-swap-icon-plus" />
            </div>
            <div class="exchange-swap-item exchange-swap-item-cycles">
              <div
                class="no-cycles-wallet"
                v-show="wallets ? !wallets.length : false"
              >
                You don't have a cycles wallet yet,
                <router-link to="/wallet">create or bind one.</router-link>
              </div>
              <div class="exchange-swap-item-top">Cycles Wallet:</div>
              <div class="exchange-swap-item-top">
                <a-select
                  class="share-input"
                  v-model="formCyclesWalletPrincipal"
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
                    <a-icon
                      class="remove-check-icon"
                      v-if="wallet.isDefault"
                      type="check-circle"
                  /></a-select-option>
                  <div slot="dropdownRender" slot-scope="menu">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <div
                      class="other-cycles"
                      @mousedown="(e) => e.preventDefault()"
                      @click="cyclesFormVisible = true"
                    >
                      Other
                    </div>
                  </div>
                </a-select>
                <!--<a-input
									class="share-input"
									autocomplete="off"
									placeholder="Canister ID(Principal)"
									v-model="formCyclesWalletPrincipal"
									type="text"
								/>-->
              </div>
            </div>
            <div class="swap-button">
              <button
                v-if="getPrincipalId"
                class="primary"
                :disabled="claimLiquidityButtonDisabled"
                @click="claimLiquidity"
              >
                {{ claimButtonName }}
              </button>
              <button
                v-else
                class="primary large-primary"
                @click="connectWallet"
              >
                Connect Wallet
              </button>
              <div class="cycles-finance-tip">
                It takes 3 to 20 seconds to update the ICP and Cycles balance
                after the transaction is completed.
              </div>
            </div>
          </div>
          <div v-show="liquidityType === 'Remove'">
            <div class="exchange-swap-item">
              <div class="exchange-swap-item-top">
                <div>Burn Shares</div>
                <a-input
                  v-if="liquidity"
                  v-model="formShare"
                  autocomplete="off"
                  v-only-number
                  min="0"
                  placeholder="0"
                  type="text"
                />
              </div>
              <div class="exchange-swap-item-bottom">
                <!--<span>Value: {{ shareIcp }} ICP + {{ shareCycles }} TCycles</span>-->
                <span
                  class="
                    exchange-swap-item-bottom-fee
                    exchange-swap-item-bottom-fee-share
                  "
                  @click="setMaxShare"
                  >Max</span
                >
              </div>
            </div>
            <div class="exchange-swap-icon">
              <a-icon type="arrow-down" class="exchange-swap-icon-plus" />
            </div>
            <div class="exchange-swap-item">
              <div class="exchange-swap-item-top">
                <div>ICP Account:</div>
                <div class="margin-left-auto">
                  <i class="base-color-w">{{ shareIcp }}</i> ICP
                </div>
              </div>
              <div class="base-color-w">
                <copy-account :front="8" :account="account"></copy-account>
              </div>
            </div>
            <div class="exchange-swap-icon">
              <a-icon type="plus" class="exchange-swap-icon-plus" />
            </div>
            <div class="exchange-swap-item exchange-swap-item-cycles">
              <div
                class="no-cycles-wallet"
                v-show="wallets ? !wallets.length : false"
              >
                You don't have a cycles wallet yet,
                <router-link to="/wallet">create or bind one.</router-link>
              </div>
              <div class="exchange-swap-item-top">
                Cycles Wallet:
                <div class="margin-left-auto">
                  <i class="base-color-w">{{ shareCycles }}</i> TCycles
                </div>
              </div>
              <div class="exchange-swap-item-top">
                <a-select
                  class="share-input"
                  v-model="formCyclesWalletPrincipal"
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
                    <a-icon
                      class="remove-check-icon"
                      v-if="wallet.isDefault"
                      type="check-circle"
                  /></a-select-option>
                  <div slot="dropdownRender" slot-scope="menu">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <div
                      class="other-cycles"
                      @mousedown="(e) => e.preventDefault()"
                      @click="cyclesFormVisible = true"
                    >
                      Other
                    </div>
                  </div>
                </a-select>
                <!--<a-input
									autocomplete="off"
									class="share-input"
									placeholder="Canister ID(Principal)"
									v-model="formCyclesWalletPrincipal"
									type="text"
								/>-->
              </div>
            </div>
            <div class="swap-button">
              <button
                v-if="getPrincipalId"
                class="primary"
                :disabled="removeLiquidityButtonDisabled"
                @click="submitRemoveLiquidity"
              >
                {{ removeLiquidityButtonName }}
              </button>
              <button
                v-else
                class="primary large-primary"
                @click="connectWallet"
              >
                Connect Wallet
              </button>
            </div>
            <div class="cycles-finance-tip">
              It takes 3 to 20 seconds to update the ICP and Cycles balance
              after the transaction is completed.
            </div>
          </div>
        </div>
      </div>
      <div class="exchange exchange-record-main">
        <div class="exchange-record">
          <transition name="fade">
            <div v-if="pendingRecord" class="exchange-pending-record">
              <copy-account
                :front="10"
                :account="filterTxid(pendingRecord.txid)"
                copyText="Txid"
              ></copy-account>
              <span>{{ pendingRecord.operation | filterOperation }}</span>
              <div v-if="filterFinanceType(pendingRecord.operation) === 'Swap'">
                <div
                  v-if="
                    filterCyclesType(pendingRecord.filled.token0Value) ===
                    'DebitRecord'
                  "
                >
                  {{ pendingRecord.filled.token0Value | filterCycles }} TCycles
                  <a-icon type="arrow-right" />
                  {{ pendingRecord.filled.token1Value | filterIcp }}
                  ICP
                </div>
                <div v-else>
                  {{ pendingRecord.filled.token1Value | filterIcp }}
                  ICP
                  <a-icon type="arrow-right" />
                  {{ pendingRecord.filled.token0Value | filterCycles }} TCycles
                </div>
              </div>
              <div
                v-if="
                  filterFinanceType(pendingRecord.operation) === 'AddLiquidity'
                "
              >
                {{ pendingRecord.filled.token0Value | filterCycles }} TCycles
                <a-icon type="plus" />
                {{ pendingRecord.filled.token1Value | filterIcp }}
                ICP
                <a-icon type="arrow-right" />
                {{ pendingRecord.shares | filterShare }} Shares
              </div>
              <div
                v-if="
                  filterFinanceType(pendingRecord.operation) ===
                  'RemoveLiquidity'
                "
              >
                {{ pendingRecord.shares | filterShare }} Shares
                <a-icon type="arrow-right" />
                {{ pendingRecord.filled.token0Value | filterCycles }} TCycles
                <a-icon type="plus" />
                {{ pendingRecord.filled.token1Value | filterIcp }}
                ICP
              </div>
              <div
                v-if="filterFinanceType(pendingRecord.operation) === 'Claim'"
              >
                {{ pendingRecord.filled.token0Value | filterCycles }} TCycles
                <a-icon type="plus" />
                {{ pendingRecord.filled.token1Value | filterIcp }}
                ICP
              </div>
              <div>{{ pendingRecord.type }}</div>
            </div>
          </transition>
          <p class="exchange-record-title">Records</p>
          <a-spin :spinning="recordSpinning">
            <table>
              <tbody>
                <tr v-if="!recordSpinning && !recordList.length">
                  <td colspan="5" align="center">No Records</td>
                </tr>
                <tr v-for="(item, index) in recordList" :key="index">
                  <td>
                    <span class="record-nonce"
                      >{{ item | filterNonceType }}{{ item.nonce }}</span
                    >
                  </td>
                  <td>
                    <copy-account
                      :front="10"
                      :is-copy="false"
                      :href="`https://ic.house/swap/6nmrm-laaaa-aaaak-aacfq-cai/${filterTxid(
                        item.txid
                      )}`"
                      :account="filterTxid(item.txid)"
                      copyText="Txid"
                    ></copy-account>
                  </td>
                  <td class="swap-type">
                    {{ item.operation | filterOperation }}
                  </td>
                  <td class="swap-main">
                    <div v-if="filterFinanceType(item.operation) === 'Swap'">
                      <div
                        v-if="
                          filterCyclesType(item.filled.token0Value) ===
                          'DebitRecord'
                        "
                      >
                        {{ item.filled.token0Value | filterCycles }} TCycles
                        <a-icon type="arrow-right" />
                        {{ item.filled.token1Value | filterIcp }}
                        ICP
                      </div>
                      <div v-else>
                        {{ item.filled.token1Value | filterIcp }}
                        ICP
                        <a-icon type="arrow-right" />
                        {{ item.filled.token0Value | filterCycles }} TCycles
                      </div>
                    </div>
                    <div
                      v-if="
                        filterFinanceType(item.operation) === 'AddLiquidity'
                      "
                    >
                      {{ item.filled.token0Value | filterCycles }} TCycles
                      <a-icon type="plus" />
                      {{ item.filled.token1Value | filterIcp }}
                      ICP
                      <a-icon type="arrow-right" />
                      {{ item.shares | filterShare }} Shares
                    </div>
                    <div
                      v-if="
                        filterFinanceType(item.operation) === 'RemoveLiquidity'
                      "
                    >
                      {{ item.shares | filterShare }} Shares
                      <a-icon type="arrow-right" />
                      {{ item.filled.token0Value | filterCycles }} TCycles
                      <a-icon type="plus" />
                      {{ item.filled.token1Value | filterIcp }}
                      ICP
                    </div>
                    <div v-if="filterFinanceType(item.operation) === 'Claim'">
                      {{ item.filled.token0Value | filterCycles }} TCycles
                      <a-icon type="plus" />
                      {{ item.filled.token1Value | filterIcp }}
                      ICP
                    </div>
                  </td>
                  <td class="swap-time">
                    <div v-if="item.time">{{ item.time | filterTime }}</div>
                    <div v-else>{{ item.type }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-spin>
        </div>
      </div>
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
          <div>
            Slippage tolerance:
            <span v-if="config">20%</span>
          </div>
          <span v-if="config" class="slippage-tip">
            a swap causing price fluctuations more than 20% will be rejected.
          </span>
          <div class="mt20 w100">
            <button
              class="default margin-left-auto"
              @click="visibleSwap = false"
            >
              confirm
            </button>
          </div>
        </div>
      </a-modal>
      <a-modal
        v-model="visibleCycles"
        title="How to send Cycles to canister?"
        width="550px"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="transfer-modal"
        :closable="false"
      >
        <div>
          <span>Your canister need to implement wallet_receive methods</span>
          <pre
            spellcheck="false"
            class="md-fences md-end-block ty-contain-cm modeLoaded md-focus"
            lang=""
            style="margin-top: 10px"
          ><div class="CodeMirror cm-s-inner CodeMirror-wrap" lang=""><div style="overflow: hidden; position: relative; width: 3px; height: 0px; top: 0px; left: 8px;"><textarea autocorrect="off" autocapitalize="off" spellcheck="false" tabindex="0" style="position: absolute; bottom: -1em; padding: 0px; width: 1000px; height: 1em; outline: none;"></textarea></div><div class="CodeMirror-scrollbar-filler" cm-not-content="true"></div><div class="CodeMirror-gutter-filler" cm-not-content="true"></div><div class="CodeMirror-scroll" tabindex="-1"><div class="CodeMirror-sizer" style="margin-left: 0px; margin-bottom: 0px; border-right-width: 0px; padding-right: 0px; padding-bottom: 0px;"><div style="position: relative; top: 0px;"><div class="CodeMirror-lines" role="presentation"><div role="presentation" style="position: relative; outline: none;"><div class="CodeMirror-measure"></div><div class="CodeMirror-measure"></div><div style="position: relative; z-index: 1;"></div><div class="CodeMirror-code" role="presentation"><div class="CodeMirror-activeline" style="position: relative;"><div class="CodeMirror-activeline-background CodeMirror-linebackground"></div><div class="CodeMirror-gutter-background CodeMirror-activeline-gutter" style="left: 0px; width: 0px;"></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">public func wallet_receive(): async() {</span></pre></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0;"> &nbsp;  let amout = Cycles.available();</span></pre><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"> &nbsp;  let accepted = Cycles.accept(amout);</span></pre><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">};</span></pre></div></div></div></div></div><div style="position: absolute; height: 0px; width: 1px; border-bottom-width: 0px; border-bottom-style: solid; border-bottom-color: transparent; top: 88px;"></div><div class="CodeMirror-gutters" style="display: none; height: 88px;"></div></div></div></pre>
          <div style="margin-top: 10px">
            Notes: CyclesFinance cannot currently send cycles to canisters on
            VerifiedApplication subnets.
          </div>
          <div class="modal-footer">
            <button
              class="primary large-primary form-button margin-left-auto"
              @click="visibleCycles = false"
            >
              Confirm
            </button>
          </div>
        </div>
      </a-modal>
      <a-modal
        v-model="cyclesFormVisible"
        width="550px"
        title=""
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="other-cycles-modal delete-modal"
        :after-close="closeCyclesForm"
      >
        <a-form-model
          :model="cyclesForm"
          ref="cyclesForm"
          :rules="cyclesFormRules"
        >
          <a-form-model-item label="Canister ID" prop="cyclesCanister">
            <a-input
              autocomplete="off"
              v-model="cyclesForm.cyclesCanister"
              type="text"
              placeholder="Canister ID(Principal)"
            />
          </a-form-model-item>
        </a-form-model>
        <div class="delete-button">
          <button @click="cyclesFormVisible = false">Cancel</button>
          <button class="default" @click="ConfirmOtherCycles">Confirm</button>
        </div>
      </a-modal>
    </div>
    <top-up
      ref="topUp"
      :balance="balance"
      @topUpSuccess="topUpSuccess"
    ></top-up>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { ICManagementService } from '@/ic/ICManagement/ICManagementService';
import { WalletService } from '@/ic/wallet/walletService';
import { CyclesMintingService } from '@/ic/cyclesMinting/cyclesMintingService';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import {
  ExchangeEnum,
  ExchangeType,
  LiquidityType,
  SwapType,
  SwapTypeEnum
} from './model';
import { BalanceMixin } from '@/mixins';
import { PrincipalString } from '@/ic/common/icType';
import {
  BalanceChange,
  Config,
  FeeStatus,
  Liquidity,
  LpRewards,
  OperationType,
  ShareChange,
  Timestamp,
  TxnRecordType,
  YieldResponse
} from '@/ic/cyclesFinance/model';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import {
  CYCLES_FINANCE_CANISTER_ID,
  validateCyclesWallet,
  validatePrincipal
} from '@/ic/utils';
import { WalletCallRequest } from '@/ic/wallet/model';
import { IDL } from '@dfinity/candid';
import {
  formatDateToSecond,
  formatDateToSecondUTC,
  generateTxid,
  principalToAccount,
  principalToAccountIdentifier,
  toHexString
} from '@/ic/converter';
import { checkAuth } from '@/ic/CheckAuth';
import { ManageWalletResponse } from '@/ic/ICLighthouse/model';
import { namespace } from 'vuex-class';
import { validateCyclesWalletCanister } from '@/utils/validate';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import { isPlug } from '@/ic/isPlug';
import { readState } from '@/ic/readState';
import TopUp from '@/components/topUp/Index.vue';
import { isInfinity } from '@/ic/isInfinity';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
const commonModule = namespace('common');

@Component({
  name: 'Index',
  components: {
    AccountInfo,
    TopUp,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  filters: {
    filterNonceType(val: TxnRecordType): string {
      const type = Object.keys(val.operation)[0];
      if (type === 'Claim' || type === 'RemoveLiquidity') {
        return 'A';
      }
      if (type === 'AddLiquidity') {
        return 'W';
      }
      const cyclesType = Object.keys(val.filled.token0Value)[0];
      if (type === 'Swap') {
        if (cyclesType === 'CreditRecord') {
          // icpToCycles
          return 'A';
        } else {
          return 'W';
        }
      }
    },
    filterPercentage(val: number): string {
      if (val) {
        return new BigNumber(val).times(100).decimalPlaces(4, 1).toString(10);
      }
      return '0';
    },
    filterUnitIcp(val: bigint): string {
      if (val) {
        return new BigNumber(val.toString(10))
          .times(10 ** 6)
          .div(10 ** 8)
          .decimalPlaces(4, 1)
          .toString(10);
      }
      return '';
    },
    filterUnitCycles(val: bigint): string {
      if (val) {
        return new BigNumber(val.toString(10))
          .times(10 ** 6)
          .div(10 ** 12)
          .decimalPlaces(4, 1)
          .toString(10);
      } else {
        return '';
      }
    },
    filterIcpFloat(val: bigint, num = 4): string {
      if (val) {
        return new BigNumber(val.toString(10))
          .div(10 ** 8)
          .decimalPlaces(num, 1)
          .toString(10);
      } else {
        return '0';
      }
    },
    filterOperation(val: OperationType): string {
      if (val) {
        return Object.keys(val)[0];
      } else {
        return '';
      }
    },
    filterCycles(val: BalanceChange): string {
      if (val) {
        return new BigNumber(Object.values(val)[0].toString(10))
          .div(10 ** 12)
          .decimalPlaces(4, 1)
          .toString(10);
      } else {
        return '';
      }
    },
    filterIcp(val: BalanceChange): string {
      if (val) {
        return new BigNumber(Object.values(val)[0].toString(10))
          .div(10 ** 8)
          .decimalPlaces(4, 1)
          .toString(10);
      } else {
        return '';
      }
    },
    filterIcpType(val: BalanceChange): string {
      if (val) {
        return Object.keys(val)[0];
      } else {
        return '';
      }
    },
    filterShare(val: ShareChange): string {
      if (val) {
        const share = Object.values(val)[0];
        if (share) {
          return share.toString(10);
        } else {
          return '-';
        }
      } else {
        return '-';
      }
    },
    filterShareType(val: ShareChange): string {
      if (val) {
        const shareType = Object.keys(val)[0];
        if (shareType !== 'NoChange') {
          return Object.keys(val)[0];
        } else {
          return '';
        }
      } else {
        return '';
      }
    },
    filterTime(val: Timestamp): string {
      if (val) {
        const timestamp = new BigNumber(val.toString(10))
          .div(10 ** 6)
          .toNumber();
        const date = new Date(timestamp);
        return formatDateToSecondUTC(date);
      } else {
        return '';
      }
    },
    filterPerCycles(val: string): string {
      if (val) {
        return val.match(/^\d+(?:\.\d{0,4})?/)[0];
      }
      return '';
    },
    filterFloat(val: string) {
      if (val) {
        return val.match(/^\d+(?:\.\d{0,4})?/)[0];
      }
      return '';
    }
  }
})
export default class extends Mixins(BalanceMixin) {
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  $refs!: { transferIcp: HTMLFormElement; form: HTMLFormElement; cyclesForm };
  private refreshBalanceLoading = false;
  private refreshDepositBalanceLoading = false;
  private refreshCyclesLoading = false;
  private visibleCycles = false;
  private visible = false;
  private formShare = '';
  private formCyclesWalletPrincipal = '';
  private refreshRecordLoading = false;
  // private principalId: Principal;
  private depositAccountId = '';
  private loading = false;
  private buttonName = 'Swap';
  private cyclesFinanceService: CyclesFinanceService;
  private depositBalance = '-';
  private fee = 0.0001;
  private exchangeMenu = ExchangeEnum;
  private menuList = [
    {
      path: '/cyclesFinance/swap',
      value: 'Swap'
    },
    {
      path: '/cyclesFinance/Liquidity',
      value: 'Liquidity'
    }
  ];
  private exchangeType: ExchangeType = ExchangeEnum.Swap;
  private depositAmount = '';
  private freezingThreshold = '0';
  private cycles: bigint | string = '-';
  private cyclesAmount = '';
  private conversionRate = '';
  private conversionRateToIcp = '';
  private cyclesCanister: PrincipalString = '';
  private ICManagementService: ICManagementService;
  private walletService: WalletService;
  private swapType: SwapType = SwapTypeEnum.icpToCycles;
  private recordList: Array<TxnRecordType> = [];
  private pendingRecord: TxnRecordType = null;
  private recordSpinning = false;
  private liquidityButtonName = 'Add liquidity';
  private removeLiquidityButtonName = 'Remove liquidity';
  private claimButtonName = 'Claim rewards';
  private liquidity: Liquidity = null;
  private userLiquidity: Liquidity = null;
  private feeStatus: FeeStatus = null;
  private feeClaim: FeeStatus = null;
  private ICLighthouseService: ICLighthouseService;
  private liquidityType: LiquidityType = LiquidityType.Add;
  private configFee = '0';
  private config: Config = null;
  private limitIcp: string = null;
  private limitCycles: string = null;
  private slippage = 0;
  private visibleSwap = false;
  private swappingFee = '0';
  private isLoading = false;
  private icpToCyclesConversionRate = '-';
  private wallets: Array<ManageWalletResponse> = null;
  private cYield: YieldResponse = null;
  private lpRewards: LpRewards = null;
  private cyclesForm = {
    cyclesCanister: ''
  };
  private cyclesFormRules = {
    cyclesCanister: [
      {
        required: true,
        message: 'Please enter cycles wallet',
        trigger: 'blur'
      },
      { validator: validateCyclesWalletCanister, trigger: 'blur' }
    ]
  };
  private cyclesFormVisible = false;
  @Watch('$route')
  private onRouteChange() {
    const type = this.$route.params.type;
    if (type && type.toLocaleLowerCase() === 'liquidity') {
      this.exchangeType = ExchangeEnum.Liquidity;
    } else {
      this.exchangeType = ExchangeEnum.Swap;
    }
  }
  get shareIcp(): string {
    let shareIcp = '0';
    if (this.formShare && this.formShare !== '0' && this.userLiquidity) {
      const max = new BigNumber(this.userLiquidity.shares.toString(10)).minus(
        this.formShare
      );
      if (Number(max) < 0) {
        shareIcp = new BigNumber(this.userLiquidity.icpE8s.toString(10))
          .minus(this.fee * 10 ** this.decimals)
          .div(10 ** this.decimals)
          .decimalPlaces(4, 1)
          .toString(10);
      } else {
        shareIcp = new BigNumber(this.userLiquidity.icpE8s.toString(10))
          .times(this.formShare)
          .div(this.userLiquidity.shares.toString(10))
          .minus(this.fee * 10 ** this.decimals)
          .div(10 ** this.decimals)
          .decimalPlaces(4, 1)
          .toString(10);
      }
      if (new BigNumber(shareIcp).lt(0)) {
        shareIcp = '0';
      }
    }
    return shareIcp;
  }
  get shareCycles(): string {
    let shareCycles = '0';
    if (this.formShare && this.formShare !== '0' && this.userLiquidity) {
      const max = new BigNumber(this.userLiquidity.shares.toString(10)).minus(
        this.formShare
      );
      if (Number(max) < 0) {
        return new BigNumber(this.userLiquidity.cycles.toString(10))
          .div(10 ** 12)
          .decimalPlaces(4, 1)
          .toString(10);
      } else {
        return new BigNumber(this.userLiquidity.cycles.toString(10))
          .times(this.formShare)
          .div(this.userLiquidity.shares.toString(10))
          .div(10 ** 12)
          .decimalPlaces(4, 1)
          .toString(10);
      }
    }
    return shareCycles;
  }
  get liquidityShare(): string {
    let share = '0';
    const icp = new BigNumber(this.depositAmount).minus(this.fee);
    if (this.liquidity && Number(icp) > 0) {
      share = icp
        .times(10 ** this.decimals)
        .div(this.liquidity.icpE8s.toString(10))
        .times(this.liquidity.shares.toString(10))
        .integerValue(BigNumber.ROUND_DOWN)
        .toString(10);
    }
    return share;
  }
  get claimLiquidityButtonDisabled(): boolean {
    let flag = true;
    if (this.isLoading) {
      this.claimButtonName = 'Claiming rewards is pending ...';
      return flag;
    } else {
      this.claimButtonName = 'Claim rewards';
    }
    if (this.lpRewards) {
      if (!this.formCyclesWalletPrincipal) {
        this.claimButtonName = 'Please enter cycles wallet';
      } else if (!validateCyclesWallet(this.formCyclesWalletPrincipal.trim())) {
        this.claimButtonName =
          'Please enter the Cycles Wallet Canister-id instead of the SelfAuth Principal-id';
      } else {
        const minIcp = new BigNumber(this.lpRewards.icp.toString(10))
          .div(10 ** 8)
          .minus(0.0001);
        const minCycles = new BigNumber(
          this.lpRewards.cycles.toString(10)
        ).minus(10 ** 8);
        if (Number(minIcp) > 0 || Number(minCycles) > 0) {
          flag = false;
          this.claimButtonName = 'Claim rewards';
        }
      }
    } else {
      this.claimButtonName = 'Claim rewards';
    }
    return flag;
  }
  get removeLiquidityButtonDisabled(): boolean {
    let flag = true;
    if (this.isLoading) {
      this.removeLiquidityButtonName = 'Balance is being updated ...';
      return flag;
    } else {
      this.removeLiquidityButtonName = 'Remove liquidity';
    }
    if (this.userLiquidity) {
      const max = new BigNumber(this.userLiquidity.shares.toString(10)).minus(
        this.formShare
      );
      const minIcp = new BigNumber(this.shareIcp).minus(0.0001);
      const minCycles = new BigNumber(this.shareCycles)
        .times(10 ** 12)
        .minus(10 ** 8);
      if (!this.formCyclesWalletPrincipal) {
        this.removeLiquidityButtonName = 'Please enter cycles wallet';
      } else if (!validateCyclesWallet(this.formCyclesWalletPrincipal.trim())) {
        this.removeLiquidityButtonName =
          'Please enter the Cycles Wallet Canister-id instead of the SelfAuth Principal-id';
      } else if (
        Number(minIcp) >= 0 &&
        Number(minCycles) >= 0 &&
        Number(max) >= 0 &&
        validatePrincipal(this.formCyclesWalletPrincipal.trim())
      ) {
        flag = false;
        this.removeLiquidityButtonName = 'Remove liquidity';
      } else {
        if (Number(minIcp) < 0 || Number(minCycles) < 0) {
          this.removeLiquidityButtonName = 'Unavailable shares value';
        }
      }
      if (
        this.formCyclesWalletPrincipal.trim() &&
        !validatePrincipal(this.formCyclesWalletPrincipal.trim())
      ) {
        this.removeLiquidityButtonName = 'Invalid Principal';
      }
      if (Number(max) < 0) {
        this.removeLiquidityButtonName = 'Insufficient Shares';
      }
    } else {
      this.removeLiquidityButtonName = 'Remove liquidity';
    }
    return flag;
  }
  get liquidityButtonDisabled(): boolean {
    let flag = true;
    if (this.isLoading) {
      this.liquidityButtonName = 'Balance is being updated ...';
      return flag;
    } else {
      this.liquidityButtonName = 'Add liquidity';
    }
    if (!this.cyclesCanister) {
      this.liquidityButtonName = 'Please enter cycles wallet';
    } else if (!validateCyclesWallet(this.cyclesCanister.trim())) {
      this.liquidityButtonName =
        'Please enter the Cycles Wallet Canister-id instead of the SelfAuth Principal-id';
    } else if (this.depositAmount && this.cyclesAmount && this.cyclesCanister) {
      const minIcp = Number(
        new BigNumber(this.balance).minus(this.fee).minus(this.depositAmount)
      );
      let yourCycles;
      if (this.cycles === '-') {
        yourCycles = '0';
      } else {
        yourCycles = new BigNumber(this.cycles.toString(10))
          .minus(this.freezingThreshold)
          .toString(10);
      }
      const minCycles = Number(
        new BigNumber(yourCycles).minus(
          new BigNumber(this.cyclesAmount).times(10 ** 12)
        )
      );
      const exceedLimitIcp = new BigNumber(
        this.config.ICP_LIMIT[0].toString(10)
      ).lt(new BigNumber(this.depositAmount).times(10 ** this.decimals));
      const exceedLimitCycles = new BigNumber(
        this.config.CYCLES_LIMIT[0].toString(10)
      ).lt(new BigNumber(this.cyclesAmount).times(10 ** 12));
      if (exceedLimitIcp && exceedLimitCycles) {
        this.liquidityButtonName = `Limit of ${this.limitIcp} ICP and ${this.limitCycles} TCycles`;
      } else if (exceedLimitIcp) {
        this.liquidityButtonName = `Limit of ${this.limitIcp} ICP`;
      } else if (exceedLimitCycles) {
        this.liquidityButtonName = `Limit of ${this.limitCycles} TCycles`;
      } else if (minIcp >= 0 && minCycles >= 0) {
        flag = false;
        this.liquidityButtonName = 'Add liquidity';
      } else {
        if (minIcp < 0 && minCycles < 0) {
          this.liquidityButtonName = 'Insufficient ICP and Cycles';
        } else if (minIcp < 0) {
          this.liquidityButtonName = 'Insufficient ICP';
        } else if (minCycles < 0) {
          // this.liquidityButtonName = 'Insufficient Cycles';
          const cycles = new BigNumber(yourCycles)
            .div(10 ** 12)
            .decimalPlaces(12, 1);
          if (new BigNumber(cycles).lt(0)) {
            this.liquidityButtonName = 'Insufficient cycles';
          } else {
            this.liquidityButtonName = `You can enter up to ${cycles} TCycles.`;
          }
        }
      }
    } else {
      this.liquidityButtonName = 'Add liquidity';
    }
    return flag;
  }
  get buttonDisabled(): boolean {
    let flag = true;
    if (this.isLoading) {
      this.buttonName = 'Balance is being updated ...';
      return flag;
    } else {
      this.buttonName = 'Swap';
    }
    if (this.swapType === 'icpToCycles') {
      if (!this.cyclesCanister) {
        this.buttonName = 'Please enter cycles wallet';
      } else if (!validateCyclesWallet(this.cyclesCanister.trim())) {
        this.buttonName =
          'Please enter the Cycles Wallet Canister-id instead of the SelfAuth Principal-id';
      } else if (
        Number(this.depositAmount) &&
        Number(this.cyclesAmount) &&
        this.cyclesCanister
      ) {
        if (
          new BigNumber(this.limitIcp).lt(new BigNumber(this.depositAmount))
        ) {
          this.buttonName = `Limit of ${this.limitIcp} ICP`;
        } else if (
          Number(
            new BigNumber(this.balance)
              .minus(this.fee)
              .minus(this.depositAmount)
          ) >= 0
        ) {
          if (Math.abs(this.slippage) <= 20) {
            flag = false;
          }
          this.buttonName = 'Swap';
        } else {
          this.buttonName = 'Insufficient ICP';
        }
      } else {
        this.buttonName = 'Swap';
        if (this.cyclesAmount) {
          const feeRate = new BigNumber(1).minus(this.configFee);
          const maxCycles = new BigNumber(
            this.liquidity.cycles.toString(10)
          ).times(feeRate);
          if (maxCycles.lt(new BigNumber(this.cyclesAmount).times(10 ** 12))) {
            // this.buttonName = `Max cycles is ${new BigNumber(maxCycles)
            //   .div(10 ** 12)
            //   .decimalPlaces(2, 1)} TCycles`;
            this.buttonName = 'Insufficient liquidity for this trade';
          }
        }
      }
    } else {
      if (!this.cyclesCanister) {
        this.buttonName = 'Please enter cycles wallet';
      } else if (!validateCyclesWallet(this.cyclesCanister.trim())) {
        this.buttonName =
          'Please enter the Cycles Wallet Canister-id instead of the SelfAuth Principal-id';
      } else if (
        Number(this.depositAmount) &&
        Number(this.cyclesAmount) &&
        this.cyclesCanister
      ) {
        console.log(this.cycles.toString(), this.freezingThreshold);
        let yourCycles;
        if (this.cycles === '-') {
          yourCycles = '0';
        } else {
          yourCycles = new BigNumber(this.cycles.toString(10))
            .minus(this.freezingThreshold)
            .toString(10);
        }
        if (new BigNumber(this.limitCycles).lt(this.cyclesAmount)) {
          this.buttonName = `Limit of ${this.limitCycles} TCycles`;
        } else if (
          Number(
            new BigNumber(yourCycles).minus(
              new BigNumber(this.cyclesAmount).times(10 ** 12)
            )
          ) >= 0
        ) {
          if (Math.abs(this.slippage) <= 20) {
            flag = false;
          }
          this.buttonName = 'Swap';
        } else {
          // this.buttonName = 'Insufficient Cycles';
          const cycles = new BigNumber(yourCycles)
            .div(10 ** 12)
            .decimalPlaces(12, 1);
          if (new BigNumber(cycles).lt(0)) {
            this.buttonName = 'Insufficient cycles';
          } else {
            this.buttonName = `You can enter up to ${cycles} TCycles.`;
          }
        }
      } else {
        this.buttonName = 'Swap';
        if (this.depositAmount) {
          const feeRate = new BigNumber(1).minus(this.configFee);
          const maxLiquidityIcp = new BigNumber(
            this.liquidity.icpE8s.toString(10)
          )
            .minus(this.fee * 10 ** this.decimals)
            .times(feeRate)
            .minus(this.fee * 10 ** this.decimals);
          if (
            maxLiquidityIcp.lt(
              new BigNumber(this.depositAmount).times(10 ** this.decimals)
            )
          ) {
            this.buttonName = 'Insufficient liquidity for this trade';
          }
        }
      }
    }
    if (
      this.wallets &&
      this.wallets.length &&
      this.refreshCyclesLoading &&
      this.swapType === SwapTypeEnum.icpToCycles &&
      (!this.cycles || this.cycles === '-')
    ) {
      const isCyclesWallet = this.wallets.some((wallet) => {
        return wallet.walletId.toString() === this.cyclesCanister;
      });
      if (isCyclesWallet) {
        flag = true;
      }
    }
    return flag;
  }
  // get sharesToCycles()
  get icpPerCycles(): string {
    if (this.liquidity) {
      return new BigNumber(this.liquidity.cycles.toString(10))
        .div(this.liquidity.icpE8s.toString(10))
        .div(10 ** 4)
        .toString(10);
    }
    return '';
  }
  get cyclesPerIcp(): string {
    if (this.liquidity) {
      return new BigNumber(this.liquidity.icpE8s.toString(10))
        .div(this.liquidity.cycles.toString(10))
        .times(10 ** 4)
        .toString(10);
    }
    return '';
  }
  get maxCycles(): string {
    const feeRate = new BigNumber(1).minus(this.configFee);
    let maxCycles;
    const maxLiquidityCycles = new BigNumber(
      this.liquidity.cycles.toString(10)
    ).times(feeRate);
    if (
      new BigNumber(this.config.CYCLES_LIMIT[0].toString(10)).lt(
        maxLiquidityCycles
      )
    ) {
      maxCycles = this.config.CYCLES_LIMIT[0];
    } else {
      maxCycles = maxLiquidityCycles;
    }
    return maxCycles;
  }
  get maxIcp(): string {
    const feeRate = new BigNumber(1).minus(this.configFee);
    let maxICP: string;
    const maxLiquidityIcp = new BigNumber(this.liquidity.icpE8s.toString(10))
      .minus(this.fee * 10 ** this.decimals)
      .times(feeRate)
      .minus(this.fee * 10 ** this.decimals);
    if (
      new BigNumber(this.config.ICP_LIMIT[0].toString(10)).lt(maxLiquidityIcp)
    ) {
      maxICP = this.config.ICP_LIMIT[0].toString(10);
    } else {
      maxICP = maxLiquidityIcp.toString(10);
    }
    return maxICP;
  }
  private timerLiquidity = null;
  beforeDestroy(): void {
    window.clearInterval(this.timerLiquidity);
    this.timerLiquidity = null;
  }
  async created(): Promise<void> {
    // this.getPrincipalId = Principal.fromText(localStorage.getItem('principal'));
    this.liquidity = JSON.parse(localStorage.getItem('liquidity')) || null;
    const type = this.$route.params.type;
    if (type && type.toLocaleLowerCase() === 'liquidity') {
      this.exchangeType = ExchangeEnum.Liquidity;
    } else {
      this.exchangeType = ExchangeEnum.Swap;
    }
    this.cyclesFinanceService = new CyclesFinanceService();
    this.ICManagementService = new ICManagementService();
    this.ICLighthouseService = new ICLighthouseService();
    this.walletService = new WalletService();
    this.getFeeStatus();
    this.getConfig();
    this.getConversionRate();
    this.getYield();
    if (this.getPrincipalId) {
      this.getWallets();
      this.getDepositAccountId();
      this.getSwapRecord();
      this.userLiquidity = await this.getLiquidity(
        Principal.fromText(this.getPrincipalId)
      );
    }
    this.liquidity = await this.getLiquidity();
    console.log(this.liquidity, this.userLiquidity);
    this.getIntervalLiquidity();
  }
  private connectWallet(): void {
    this.$router.push({
      path: '/login',
      query: { redirect: this.$route.fullPath }
    });
  }
  private async withdraw(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      await this.cyclesFinanceService.withdraw();
      loading.close();
      this.$message.success('Withdraw Success');
      this.getDepositBalance();
      this.getIcpBalance();
    } catch (e) {
      loading.close();
      console.log(e);
    }
  }
  private ConfirmOtherCycles(): void {
    this.$refs.cyclesForm.validate((valid: any) => {
      if (valid) {
        if (this.exchangeType === ExchangeEnum.Swap) {
          this.cyclesCanister = this.cyclesForm.cyclesCanister;
          this.cycles = '-';
          this.freezingThreshold = '0';
          this.getCycles();
        } else {
          this.formCyclesWalletPrincipal = this.cyclesForm.cyclesCanister;
        }
        this.cyclesFormVisible = false;
      }
    });
  }
  private closeCyclesForm(): void {
    this.$refs.cyclesForm.resetFields();
  }
  private checkNum(num: bigint): boolean {
    if (num) {
      return new BigNumber(num.toString(10)).gt(10 ** 12);
    }
    return false;
  }
  private async getLpRewards(): Promise<void> {
    if (this.getPrincipalId) {
      this.lpRewards = await this.cyclesFinanceService.getLpRewards(
        this.getPrincipalId
      );
    }
  }
  private async getYield(): Promise<void> {
    this.cYield = await this.cyclesFinanceService.getYield();
  }
  private filterTxid(txid: Array<number>): string {
    return toHexString(new Uint8Array(txid));
  }
  private getIntervalLiquidity(): void {
    this.timerLiquidity = window.setInterval(async () => {
      setTimeout(async () => {
        if (!this.getCheckAuth && this.getPrincipalId) {
          this.getYield();
          this.getLpRewards();
          this.getFeeStatus();
          this.getCycles('Interval');
          this.getIcpBalance('Interval');
          // this.getDepositBalance('Interval');
          this.getConversionRate();
          this.liquidity = await this.getLiquidity();
          localStorage.setItem(
            'liquidity',
            JSON.stringify(
              this.liquidity,
              (key, value) =>
                typeof value === 'bigint' ? value.toString(10) : value // return everything else unchanged
            )
          );
        }
      }, 0);
    }, 10000);
  }
  private async getConversionRate(): Promise<void> {
    const cyclesMintingService = new CyclesMintingService();
    const icpToCyclesConversionRate =
      await cyclesMintingService.getIcpToCyclesConversionRate();
    this.icpToCyclesConversionRate = new BigNumber(
      icpToCyclesConversionRate.toString(10)
    )
      .div(10 ** 10)
      .integerValue(BigNumber.ROUND_DOWN)
      .div(10 ** 2)
      .toString(10);
  }
  private async getConfig(): Promise<void> {
    this.config = await this.cyclesFinanceService.getConfig();
    this.limitIcp = new BigNumber(this.config.ICP_LIMIT[0].toString(10))
      .div(10 ** this.decimals)
      .decimalPlaces(2, 1)
      .toString(10);
    this.limitCycles = new BigNumber(this.config.CYCLES_LIMIT[0].toString(10))
      .div(10 ** 12)
      .decimalPlaces(2, 1)
      .toString(10);
    this.configFee = new BigNumber(this.config.FEE[0].toString(10))
      .div(1000000)
      .toString(10);
  }
  private async getCount(principal: Principal): Promise<bigint> {
    return await this.cyclesFinanceService.getCount([
      principalToAccountIdentifier(principal)
    ]);
  }
  private filterFinanceType(val: OperationType): string {
    if (val) {
      return Object.keys(val)[0];
    } else {
      return '';
    }
  }
  private filterCyclesType(val: BalanceChange): string {
    if (val) {
      return Object.keys(val)[0];
    } else {
      return '';
    }
  }
  private async getFeeStatus(): Promise<void> {
    this.feeStatus = await this.cyclesFinanceService.feeStatus();
  }
  private setMaxShare(): void {
    this.formShare = this.userLiquidity.shares.toString(10);
  }
  private removeLiquidity(): void {
    this.liquidityType = LiquidityType.Remove;
    this.formShare = '';
    if (this.wallets && this.wallets.length) {
      this.formCyclesWalletPrincipal = this.wallets[0].walletId.toString();
    }
  }
  private async getIcpBalance(type?: string): Promise<void> {
    if (!type || type !== 'Interval') {
      this.refreshBalanceLoading = true;
    }
    await this.getBalance();
    this.refreshBalanceLoading = false;
  }
  private async checkCycles(cyclesWallet: string): Promise<boolean> {
    let flag = true;
    const isCyclesWallet = this.wallets.some((wallet) => {
      return wallet.walletId.toString() === cyclesWallet;
    });
    if (!isCyclesWallet) {
      return flag;
    }
    let cycles;
    try {
      const res = await this.walletService.getWalletBalance(cyclesWallet);
      cycles = res.amount;
    } catch (e) {
      try {
        const status = await this.ICManagementService.canisterStatus(
          Principal.fromText(cyclesWallet)
        );
        if (status.canisterId === cyclesWallet) {
          cycles = status.cycles;
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (!cycles) {
      let state;
      try {
        state = await readState(this.cyclesCanister.trim());
      } catch (e) {
        console.log(e);
      }
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      console.log(state);
      if (!state || (state && !state.moduleHash)) {
        flag = false;
        this.$info({
          content:
            'Your Cycles Wallet Canister has been destroyed due to lack of Cycles for a long time, please create a new Cycles Wallet.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'OK',
          onOk() {
            that.$router.push('/wallet');
          }
        });
      } else {
        flag = false;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        this.$info({
          content:
            'Your Cycles Wallet Canister is frozen due to insufficient balance, please "top-up" a little Cycles to the wallet canister to reactivate it.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'OK',
          onOk() {
            (that.$refs as any).topUp.topUpForm.to = cyclesWallet;
            (that.$refs as any).topUp.init();
            (that.$refs as any).topUp.visibleTopUp = true;
          }
        });
      }
    } else if (new BigNumber(cycles.toString(10)).lt(0.01 * 10 ** 12)) {
      flag = false;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      this.$info({
        content:
          'Your Cycles Wallet Canister is frozen due to insufficient balance, please "top-up" a little Cycles to the wallet canister to reactivate it.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'OK',
        onOk() {
          (that.$refs as any).topUp.topUpForm.to = cyclesWallet;
          (that.$refs as any).topUp.init();
          (that.$refs as any).topUp.visibleTopUp = true;
        }
      });
    }
    return flag;
  }
  private async submitRemoveLiquidity(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const flag = await this.checkCycles(this.formCyclesWalletPrincipal);
    if (!flag) {
      loading.close();
      return;
    }
    try {
      this.isLoading = true;
      const nonce = await this.getCount(
        Principal.fromText(this.getPrincipalId)
      );
      const txid = generateTxid(Principal.fromText(this.getPrincipalId), nonce);
      const record1 = {
        nonce: nonce,
        txid: txid,
        operation: { RemoveLiquidity: null },
        filled: {
          token0Value: {
            CreditRecord: BigInt(
              new BigNumber(this.shareCycles).times(10 ** 12)
            )
          },
          token1Value: {
            CreditRecord: BigInt(
              new BigNumber(this.shareIcp).times(10 ** this.decimals)
            )
          }
        },
        shares: { Mint: BigInt(this.formShare) },
        caller: Array.from(
          new Uint8Array(
            principalToAccount(Principal.fromText(this.getPrincipalId))
          )
        ),
        type: 'pending'
      };
      // this.recordList.unshift(record1);
      this.pendingRecord = record1;
      this.cyclesFinanceService
        .remove(
          [BigInt(this.formShare)],
          Principal.fromText(this.formCyclesWalletPrincipal),
          [nonce]
        )
        .then(async () => {
          this.getIcpBalance();
          this.getDepositBalance();
          this.getCycles();
          const record = await this.cyclesFinanceService.txnRecord(txid);
          if (record && record.nonce === nonce) {
            // const index = this.recordList.findIndex(
            //   (item) =>
            //     item.nonce === nonce &&
            //     toHexString(new Uint8Array(record.caller)) ===
            //       toHexString(new Uint8Array(record1.caller))
            // );
            this.$message.success('Remove liquidity Success');
            this.pendingRecord = null;
            this.recordList.unshift(record);
            if (this.wallets && this.wallets.length) {
              this.formCyclesWalletPrincipal =
                this.wallets[0].walletId.toString();
            } else {
              this.formCyclesWalletPrincipal = '';
            }
          } else {
            record1.type = 'Fail';
            this.$message.error('Remove liquidity fail');
          }
          this.userLiquidity = await this.getLiquidity(
            Principal.fromText(this.getPrincipalId)
          );
          // if user remove all shares TODO
          if (new BigNumber(this.userLiquidity.shares.toString(10)).eq(0)) {
            this.claimLiquidity('all');
          }
          this.liquidity = await this.getLiquidity();
        })
        .catch((e) => {
          console.log(e);
          this.getDepositBalance();
          // const index = this.recordList.findIndex(
          //   (item) =>
          //     item.nonce === nonce &&
          //     toHexString(
          //       new Uint8Array(
          //         principalToAccount(Principal.fromText(this.getPrincipalId))
          //       )
          //     ) === toHexString(new Uint8Array(record1.caller))
          // );
          record1.type = 'Fail';
          this.$message.error('Remove liquidity fail');
          // this.recordList.splice(index, 1, record1);
        })
        .finally(() => {
          this.isLoading = false;
        });
      loading.close();
      this.visible = false;
      this.$message.success('Remove liquidity is pending');
      this.formShare = '';
    } catch (e) {
      this.getDepositBalance();
      this.isLoading = false;
      loading.close();
      this.$message.error(e.message);
      console.log(e);
    }
  }
  private onAddLiquidity(): void {
    this.liquidityType = LiquidityType.Add;
    this.cyclesAmount = '';
    this.depositAmount = '';
  }
  private async onClaimLiquidity(): Promise<void> {
    this.liquidityType = LiquidityType.Claim;
    if (this.wallets && this.wallets.length) {
      this.formCyclesWalletPrincipal = this.wallets[0].walletId.toString();
    } else {
      this.formCyclesWalletPrincipal = '';
    }
    this.getLpRewards();
  }
  private async claimLiquidity(type?: string): Promise<void> {
    await checkAuth();
    let loading;
    if (!type || type !== 'all') {
      loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      const flag = await this.checkCycles(this.formCyclesWalletPrincipal);
      if (!flag) {
        loading.close();
        return;
      }
    }
    try {
      this.isLoading = true;
      const nonce = await this.getCount(
        Principal.fromText(this.getPrincipalId)
      );
      const txid = generateTxid(Principal.fromText(this.getPrincipalId), nonce);
      let CreditIcp;
      if (
        new BigNumber(this.lpRewards.icp.toString(10)).lt(
          this.fee * 10 ** this.decimals
        )
      ) {
        CreditIcp = BigInt('0');
      } else {
        CreditIcp = BigInt(
          new BigNumber(this.lpRewards.icp.toString(10)).minus(
            this.fee * 10 ** this.decimals
          )
        );
      }
      const record1 = {
        nonce: nonce,
        txid: txid,
        operation: { Claim: null },
        filled: {
          token0Value: {
            CreditRecord: this.lpRewards.cycles
          },
          token1Value: {
            CreditRecord: CreditIcp
          }
        },
        caller: Array.from(
          new Uint8Array(
            principalToAccount(Principal.fromText(this.getPrincipalId))
          )
        ),
        type: 'pending'
      };
      // this.recordList.unshift(record1);
      if (loading) {
        this.pendingRecord = record1;
      }
      this.cyclesFinanceService
        .claim(Principal.fromText(this.formCyclesWalletPrincipal), [nonce])
        .then(async () => {
          this.getIcpBalance();
          this.getDepositBalance();
          const record = await this.cyclesFinanceService.txnRecord(txid);
          if (record && record.nonce === nonce) {
            // const index = this.recordList.findIndex(
            //   (item) =>
            //     item.nonce === nonce &&
            //     toHexString(new Uint8Array(record.caller)) ===
            //       toHexString(new Uint8Array(record1.caller))
            // );
            if (loading) {
              this.$message.success('Claim liquidity Success');
              this.pendingRecord = null;
              if (this.wallets && this.wallets.length) {
                this.formCyclesWalletPrincipal =
                  this.wallets[0].walletId.toString();
              } else {
                this.formCyclesWalletPrincipal = '';
              }
            }
            this.recordList.unshift(record);
          } else {
            if (loading) {
              record1.type = 'Fail';
              this.$message.error('Claim liquidity fail');
            }
          }
          this.getLpRewards();
        })
        .catch((e) => {
          this.getDepositBalance();
          console.log(e);
          // const index = this.recordList.findIndex(
          //   (item) =>
          //     item.nonce === nonce &&
          //     toHexString(
          //       new Uint8Array(
          //         principalToAccount(Principal.fromText(this.getPrincipalId))
          //       )
          //     ) === toHexString(new Uint8Array(record1.caller))
          // );
          if (loading) {
            record1.type = 'Fail';
            this.$message.error('Claim liquidity fail');
          }
          // this.recordList.splice(index, 1, record1);
        })
        .finally(() => {
          this.isLoading = false;
        });
      loading && loading.close();
      if (loading) {
        this.$message.success('Claim liquidity is pending');
      }
    } catch (e) {
      this.getDepositBalance();
      this.isLoading = false;
      loading && loading.close();
      if (loading) {
        this.$message.error(e.message);
      }
      console.log(e);
    }
  }
  private async addLiquidity(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const flag = await this.checkCycles(this.cyclesCanister.trim());
      if (!flag) {
        loading.close();
        return;
      }
      const blockHeight = await this.ledgerService.sendIcp(
        this.depositAmount.toString(),
        this.depositAccountId
      );
      this.isLoading = true;
      console.log(blockHeight);
      const nonce = await this.getCount(
        Principal.fromText(this.cyclesCanister.trim())
      );
      const txid = generateTxid(
        Principal.fromText(this.cyclesCanister.trim()),
        nonce
      );
      const record1 = {
        nonce: nonce,
        txid: txid,
        operation: { AddLiquidity: null },
        filled: {
          token0Value: {
            DebitRecord: BigInt(
              new BigNumber(this.cyclesAmount).times(10 ** 12)
            )
          },
          token1Value: {
            DebitRecord: BigInt(
              new BigNumber(this.depositAmount)
                .minus(this.fee)
                .times(10 ** this.decimals)
            )
          }
        },
        shares: { Burn: BigInt(this.liquidityShare) },
        caller: Array.from(
          new Uint8Array(
            principalToAccount(Principal.fromText(this.cyclesCanister.trim()))
          )
        ),
        type: 'pending'
      };
      // this.recordList.unshift(record1);
      this.pendingRecord = record1;
      const args = IDL.encode(
        [IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [
          principalToAccountIdentifier(Principal.fromText(this.getPrincipalId)),
          [nonce],
          []
        ]
      );
      const walletCallRequest: WalletCallRequest = {
        canister: Principal.fromText(CYCLES_FINANCE_CANISTER_ID),
        method_name: 'add',
        cycles: BigInt(new BigNumber(this.cyclesAmount).times(10 ** 12)),
        args: Array.from(Buffer.from(args))
      };
      this.walletService
        .walletCall(walletCallRequest, this.cyclesCanister.trim())
        .then(async (res) => {
          console.log(res);
          loading.close();
          if ((res as { Ok: { return: Array<number> } }).Ok) {
            this.getIcpBalance();
            this.getDepositBalance();
            this.getCycles();
            const record = await this.cyclesFinanceService.txnRecord(txid);
            // const index = this.recordList.findIndex(
            //   (item) =>
            //     item.nonce === nonce &&
            //     toHexString(new Uint8Array(record.caller)) ===
            //       toHexString(new Uint8Array(record1.caller))
            // );
            if (record && record.nonce === nonce) {
              this.$message.success('Add liquidity Success');
              this.pendingRecord = null;
              this.recordList.unshift(record);
              // this.initCyclesCanister();
            } else {
              record1.type = 'Fail';
              this.$message.error('Add liquidity fail');
              // this.recordList.splice(index, 1, record1);
            }
            this.userLiquidity = await this.getLiquidity(
              Principal.fromText(this.getPrincipalId)
            );
            this.liquidity = await this.getLiquidity();
          } else {
            record1.type = 'Fail';
            this.$message.error('Add liquidity fail');
          }
        })
        .catch(() => {
          this.getDepositBalance();
          loading.close();
          // const index = this.recordList.findIndex(
          //   (item) =>
          //     item.nonce === nonce &&
          //     toHexString(
          //       new Uint8Array(
          //         principalToAccount(
          //           Principal.fromText(this.cyclesCanister.trim())
          //         )
          //       )
          //     ) === toHexString(new Uint8Array(record1.caller))
          // );
          record1.type = 'Fail';
          this.$message.error('Add liquidity fail');
          // this.recordList.splice(index, 1, record1);
        })
        .finally(() => {
          this.isLoading = false;
        });
      loading.close();
    } catch (e) {
      this.getDepositBalance();
      this.isLoading = false;
      loading.close();
      console.dir(e);
      this.$message.error(e.message);
    }
    this.cyclesAmount = '';
    this.depositAmount = '';
    this.$message.success('Add liquidity is pending');
  }
  private async getSwapRecord(): Promise<void> {
    // this.recordSpinning = true;
    try {
      this.recordList = await this.cyclesFinanceService.getEvents([
        principalToAccountIdentifier(Principal.fromText(this.getPrincipalId))
      ]);
    } catch (e) {
      console.log(e);
    }
    this.recordSpinning = false;
  }
  private swap(): void {
    if (!this.buttonDisabled) {
      if (this.swapType === 'icpToCycles') {
        this.icpToCycles();
      } else {
        this.cyclesToIcp();
      }
    }
  }
  private async cyclesToIcp(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const nonce = await this.getCount(
        Principal.fromText(this.cyclesCanister.trim())
      );
      const txid = generateTxid(
        Principal.fromText(this.cyclesCanister.trim()),
        nonce
      );
      this.isLoading = true;
      const record1 = {
        nonce: nonce,
        txid: txid,
        operation: { Swap: null },
        filled: {
          token0Value: {
            DebitRecord: BigInt(
              new BigNumber(this.cyclesAmount).times(10 ** 12)
            )
          },
          token1Value: {
            CreditRecord: BigInt(
              new BigNumber(this.depositAmount).times(10 ** this.decimals)
            )
          }
        },
        caller: Array.from(
          new Uint8Array(
            principalToAccount(Principal.fromText(this.cyclesCanister.trim()))
          )
        ),
        type: 'pending'
      };
      // this.recordList.unshift(record1);
      this.pendingRecord = record1;
      const args = IDL.encode(
        [IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [
          principalToAccountIdentifier(Principal.fromText(this.getPrincipalId)),
          [nonce],
          []
        ]
      );
      const walletCallRequest: WalletCallRequest = {
        canister: Principal.fromText(CYCLES_FINANCE_CANISTER_ID),
        method_name: 'cyclesToIcp',
        cycles: BigInt(new BigNumber(this.cyclesAmount).times(10 ** 12)),
        args: Array.from(Buffer.from(args))
      };
      this.walletService
        .walletCall(walletCallRequest, this.cyclesCanister.trim())
        .then(async (res) => {
          console.log(res);
          if ((res as { Ok: { return: Array<number> } }).Ok) {
            this.getIcpBalance();
            this.getDepositBalance();
            this.getCycles();
            const record = await this.cyclesFinanceService.txnRecord(txid);
            console.log(record);
            // const index = this.recordList.findIndex(
            //   (item) =>
            //     item.nonce === nonce &&
            //     toHexString(new Uint8Array(record.caller)) ===
            //       toHexString(new Uint8Array(record1.caller))
            // );
            if (record && record.nonce === nonce) {
              this.$message.success('Cycles to icp Success');
              this.pendingRecord = null;
              this.recordList.unshift(record);
              // this.initCyclesCanister();
              // this.recordList.splice(index, 1, record);
            } else {
              record1.type = 'Fail';
              this.$message.error('Cycles to icp fail');
              // this.recordList.splice(index, 1, record1);
            }
            this.liquidity = await this.getLiquidity();
          } else {
            record1.type = 'Fail';
            this.$message.error('Cycles to icp fail');
          }
        })
        .catch(() => {
          this.getDepositBalance();
          // const index = this.recordList.findIndex(
          //   (item) =>
          //     item.nonce === nonce &&
          //     toHexString(
          //       new Uint8Array(
          //         principalToAccount(
          //           Principal.fromText(this.cyclesCanister.trim())
          //         )
          //       )
          //     ) === toHexString(new Uint8Array(record1.caller))
          // );
          record1.type = 'Fail';
          this.$message.error('Cycles to icp fail');
          // this.recordList.splice(index, 1, record1);
        })
        .finally(() => {
          this.isLoading = false;
        });
    } catch (e) {
      this.getDepositBalance();
      this.isLoading = false;
      loading.close();
      console.dir(e);
      this.$message.error(e.message);
    }
    this.initSwap();
    loading.close();
    this.$message.success('Cycles to icp is pending');
  }
  private async icpToCycles(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      this.isLoading = true;
      const flag = await this.checkCycles(this.cyclesCanister.trim());
      if (!flag) {
        this.isLoading = false;
        loading.close();
        return;
      }
      // todo AccountId
      await this.getDepositAccountId();
      const icp = BigInt(
        new BigNumber(this.depositAmount).times(10 ** this.decimals)
      );
      console.log(icp);
      const blockHeight = await this.ledgerService.sendIcp(
        this.depositAmount.toString(),
        this.depositAccountId
      );
      console.log(blockHeight);
      const nonce = await this.getCount(
        Principal.fromText(this.getPrincipalId)
      );
      const txid = generateTxid(Principal.fromText(this.getPrincipalId), nonce);
      const record1 = {
        nonce: nonce,
        txid: txid,
        operation: { Swap: null },
        filled: {
          token0Value: {
            CreditRecord: BigInt(
              new BigNumber(this.cyclesAmount).times(10 ** 12)
            )
          },
          token1Value: {
            DebitRecord: BigInt(
              new BigNumber(this.depositAmount)
                .minus(this.fee)
                .times(10 ** this.decimals)
            )
          }
        },
        caller: Array.from(
          new Uint8Array(
            principalToAccount(Principal.fromText(this.getPrincipalId))
          )
        ),
        type: 'pending'
      };
      // this.recordList.unshift(record1);
      this.pendingRecord = record1;
      this.cyclesFinanceService
        .icpToCycles(icp, Principal.fromText(this.cyclesCanister.trim()), [
          nonce
        ])
        .then(async (res) => {
          console.log(res);
          this.getIcpBalance();
          this.getDepositBalance();
          this.getCycles();
          // this.getSwapRecord();
          const record = await this.cyclesFinanceService.txnRecord(txid);
          // const index = this.recordList.findIndex(
          //   (item) =>
          //     item.nonce === nonce &&
          //     toHexString(new Uint8Array(record.caller)) ===
          //       toHexString(new Uint8Array(record1.caller))
          // );
          if (record && record.nonce === nonce) {
            this.$message.success('Icp to cycles Success');
            this.pendingRecord = null;
            this.recordList.unshift(record);
            // this.initCyclesCanister();
          } else {
            record1.type = 'Fail';
            this.$message.error('Icp to cycles fail');
            // this.recordList.splice(index, 1, record1);
          }
          this.liquidity = await this.getLiquidity();
          this.userLiquidity = await this.getLiquidity(
            Principal.fromText(this.getPrincipalId)
          );
        })
        .catch(() => {
          this.getDepositBalance();
          // const index = this.recordList.findIndex(
          //   (item) =>
          //     item.nonce === nonce &&
          //     toHexString(
          //       new Uint8Array(
          //         principalToAccount(Principal.fromText(this.getPrincipalId))
          //       )
          //     ) === toHexString(new Uint8Array(record1.caller))
          // );
          record1.type = 'Fail';
          this.$message.error('Icp to cycles fail');
          // this.recordList.splice(index, 1, record1);
        })
        .finally(() => {
          this.isLoading = false;
        });
      this.initSwap();
      this.$message.success('Icp to cycles is pending');
      loading.close();
    } catch (e) {
      this.getDepositBalance();
      this.isLoading = false;
      loading.close();
      console.log(e);
      // this.$message.error(e.message);
    }
  }
  private topUpSuccess(): void {
    this.getCycles();
  }
  private async getWallets(): Promise<void> {
    const wallets = await this.ICLighthouseService.getWallets();
    let obj = {};
    this.wallets = wallets.reduce((cur, next) => {
      obj[next.walletId.toString()]
        ? ''
        : (obj[next.walletId.toString()] = true && cur.push(next));
      return cur;
    }, []);
    if (this.wallets && this.wallets.length) {
      this.formCyclesWalletPrincipal = this.cyclesCanister =
        this.wallets[0].walletId.toString();
      this.getCycles();
    }
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (priList[this.getPrincipalId] === 'Plug') {
      this.connectPlug();
    }
  }
  private async connectPlug(): Promise<void> {
    const canisterIds = [];
    this.wallets.forEach((item) => {
      canisterIds.push(item.walletId.toString());
    });
    await checkAuth();
    const flag = needConnectPlug(canisterIds);
    const connectInfinity = await needConnectInfinity(canisterIds);
    if (flag && this.$route.name === 'CyclesFinance') {
      // const h = this.$createElement;
      this.$info({
        content: 'Cycles wallet need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(canisterIds);
        }
      });
    }
    if (this.$route.name === 'CyclesFinance' && connectInfinity) {
      // const h = this.$createElement;
      this.$info({
        content: 'Cycles wallet need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity(canisterIds);
        }
      });
    }
  }
  private initSwap(): void {
    // this.buttonName = 'Swap';
    this.swappingFee = '0';
    this.cyclesAmount = '';
    this.depositAmount = '';
    this.conversionRate = '';
    this.conversionRateToIcp = '';
  }
  private changeSwapType(): void {
    if (this.swapType === SwapTypeEnum.cyclesToIcp) {
      this.swapType = SwapTypeEnum.icpToCycles;
    } else {
      this.swapType = SwapTypeEnum.cyclesToIcp;
    }
    this.initSwap();
    this.initCyclesCanister();
  }
  private async change(type: ExchangeType): Promise<void> {
    this.exchangeType = type;
    this.liquidityType = LiquidityType.Add;
    if (this.exchangeType === ExchangeEnum.Liquidity) {
      if (this.getPrincipalId) {
        this.userLiquidity = await this.getLiquidity(
          Principal.fromText(this.getPrincipalId)
        );
      }
    }
    this.initSwap();
    this.initCyclesCanister();
  }
  private initCyclesCanister(): void {
    if (this.wallets && this.wallets.length) {
      if (this.cyclesCanister !== this.wallets[0].walletId.toString()) {
        this.cyclesCanister = this.wallets[0].walletId.toString();
        this.cyclesChange();
      }
    } else {
      this.cyclesCanister = '';
      this.cyclesChange();
    }
  }
  private async depositAmountChangeForLiquidity(): Promise<void> {
    let icp = new BigNumber(this.depositAmount).minus(this.fee);
    if (Number(icp) > 0) {
      this.cyclesAmount = icp
        .times(this.icpPerCycles)
        .decimalPlaces(12, 0)
        .toString(10);
    } else {
      this.cyclesAmount = '';
    }
  }
  private async cyclesAmountChangeForLiquidity(): Promise<void> {
    if (this.cyclesAmount) {
      this.depositAmount = new BigNumber(this.cyclesAmount)
        .times(this.cyclesPerIcp)
        .plus(this.fee)
        .decimalPlaces(4, 1)
        .toString(10);
    } else {
      this.depositAmount = '';
    }
  }
  private getSlippage(cycles: BigNumber, icp: BigNumber): void {
    console.log(cycles.toString(), icp.toString());
    const rate = new BigNumber(this.liquidity.cycles.toString(10)).div(
      this.liquidity.icpE8s.toString(10)
    );
    const newRate = new BigNumber(cycles).div(icp);
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
  private async depositAmountChange(): Promise<void> {
    try {
      if (Number(this.depositAmount)) {
        const feeRate = new BigNumber(1).minus(this.configFee);
        const product = new BigNumber(this.liquidity.cycles.toString(10)).times(
          this.liquidity.icpE8s.toString(10)
        );
        if (this.swapType === SwapTypeEnum.cyclesToIcp) {
          const icp = new BigNumber(this.depositAmount)
            .plus(this.fee)
            .div(feeRate);
          const cycles = product
            .div(
              new BigNumber(this.liquidity.icpE8s.toString(10)).minus(
                icp.times(10 ** this.decimals)
              )
            )
            .minus(this.liquidity.cycles.toString(10))
            .div(10 ** 12);
          if (cycles.lte(0)) {
            this.cyclesAmount = '';
            this.conversionRate = '';
            this.conversionRateToIcp = '';
          } else {
            this.cyclesAmount = cycles.decimalPlaces(12, 1).toString(10);
            this.conversionRateToIcp = icp
              .div(cycles)
              .decimalPlaces(4, 1)
              .toString(10);
            this.conversionRate = new BigNumber(cycles)
              .div(icp)
              .decimalPlaces(12, 1)
              .toString(10);
          }
          this.swappingFee = icp
            .times(this.configFee)
            .decimalPlaces(4, 1)
            .toString(10);
          this.getSlippage(
            new BigNumber(this.liquidity.cycles.toString(10)).plus(
              new BigNumber(this.cyclesAmount).times(10 ** 12)
            ),
            new BigNumber(this.liquidity.icpE8s.toString(10)).minus(
              new BigNumber(this.depositAmount)
                .times(10 ** this.decimals)
                .plus(this.fee)
                .div(feeRate)
            )
          );
        } else {
          const icp = new BigNumber(this.depositAmount).minus(this.fee);
          if (Number(icp) > 0) {
            const cycles = new BigNumber(this.liquidity.cycles.toString(10))
              .minus(
                product.div(
                  new BigNumber(this.liquidity.icpE8s.toString(10)).plus(
                    new BigNumber(this.depositAmount)
                      .minus(this.fee)
                      .times(10 ** this.decimals)
                  )
                )
              )
              .div(10 ** 12);
            this.cyclesAmount = cycles
              .times(feeRate)
              .decimalPlaces(12, 1)
              .toString(10);
            this.conversionRate = new BigNumber(cycles)
              .div(new BigNumber(this.depositAmount).minus(this.fee))
              .decimalPlaces(12, 1)
              .toString(10);
            this.swappingFee = cycles
              .times(this.configFee)
              .decimalPlaces(4, 1)
              .toString(10);
            this.getSlippage(
              new BigNumber(this.liquidity.cycles.toString(10)).minus(
                cycles.times(10 ** 12)
              ),
              new BigNumber(this.liquidity.icpE8s.toString(10)).plus(
                new BigNumber(this.depositAmount)
                  .times(10 ** this.decimals)
                  .minus(this.fee * 10 ** this.decimals)
                  .toString(10)
              )
            );
          } else {
            this.cyclesAmount = '0';
            this.conversionRate = '';
          }
        }
      } else {
        this.conversionRate = '';
        this.cyclesAmount = '';
      }
    } catch (e) {
      console.log(e);
    }
    // this.buttonLoading = false;
  }
  private async cyclesAmountChange(): Promise<void> {
    try {
      if (Number(this.cyclesAmount)) {
        const feeRate = new BigNumber(1).minus(this.configFee);
        const product = new BigNumber(this.liquidity.cycles.toString(10)).times(
          this.liquidity.icpE8s.toString(10)
        );
        if (this.swapType === SwapTypeEnum.cyclesToIcp) {
          const icp = new BigNumber(this.liquidity.icpE8s.toString(10))
            .minus(
              product.div(
                new BigNumber(this.liquidity.cycles.toString(10)).plus(
                  new BigNumber(this.cyclesAmount).times(10 ** 12)
                )
              )
            )
            .div(10 ** this.decimals);
          const minIcp = new BigNumber(icp).times(feeRate).minus(this.fee);
          if (Number(minIcp) > 0) {
            this.depositAmount = new BigNumber(icp)
              .times(feeRate)
              .minus(this.fee)
              .decimalPlaces(4, 1)
              .toString(10);
            this.conversionRateToIcp = new BigNumber(icp)
              .div(this.cyclesAmount)
              .decimalPlaces(4, 1)
              .toString(10);
            this.conversionRate = new BigNumber(this.cyclesAmount)
              .div(icp)
              .decimalPlaces(12, 1)
              .toString(10);
            this.swappingFee = icp
              .times(this.configFee)
              .decimalPlaces(4, 1)
              .toString(10);
            this.getSlippage(
              new BigNumber(this.liquidity.cycles.toString(10)).plus(
                new BigNumber(this.cyclesAmount).times(10 ** 12)
              ),
              new BigNumber(this.liquidity.icpE8s.toString(10)).minus(
                icp.times(10 ** this.decimals)
              )
            );
          } else {
            this.depositAmount = '0';
            this.conversionRate = '';
          }
        } else {
          const icp = product
            .div(
              new BigNumber(this.liquidity.cycles.toString(10)).minus(
                new BigNumber(this.cyclesAmount).div(feeRate).times(10 ** 12)
              )
            )
            .minus(this.liquidity.icpE8s.toString(10))
            .div(10 ** this.decimals);
          if (icp.lte(0)) {
            this.depositAmount = '';
            this.conversionRate = '';
          } else {
            this.depositAmount = new BigNumber(icp)
              .plus(this.fee)
              .decimalPlaces(4, 0)
              .toString(10);
            this.conversionRate = new BigNumber(this.cyclesAmount)
              .div(feeRate)
              .div(icp)
              .decimalPlaces(12, 1)
              .toString(10);
          }
          this.swappingFee = new BigNumber(this.cyclesAmount)
            .div(feeRate)
            .times(this.configFee)
            .decimalPlaces(4, 1)
            .toString(10);
          this.getSlippage(
            new BigNumber(this.liquidity.cycles.toString(10)).minus(
              new BigNumber(this.cyclesAmount).times(10 ** 12).div(feeRate)
            ),
            new BigNumber(this.liquidity.icpE8s.toString(10)).plus(
              icp.times(10 ** this.decimals)
            )
          );
        }
      } else {
        this.conversionRate = '';
        this.depositAmount = '';
      }
    } catch (e) {
      console.log(e);
    }
    // this.buttonLoading = false;
  }
  private async getLiquidity(principal?): Promise<Liquidity> {
    const arg = [];
    if (principal) {
      arg[0] = principalToAccountIdentifier(principal);
    }
    return await this.cyclesFinanceService.liquidity(arg);
  }
  private cyclesChange(): void {
    this.cycles = '-';
    this.freezingThreshold = '0';
    this.getCycles();
  }
  private async getCycles(type?: string): Promise<void> {
    if (!type || type !== 'Interval') {
      this.refreshCyclesLoading = true;
    }
    if (this.cyclesCanister && validatePrincipal(this.cyclesCanister.trim())) {
      if (this.cyclesAmount && this.depositAmount) {
        // this.buttonLoading = true;
      }
      try {
        if (isPlug() || isInfinity()) {
          const res = await this.walletService.getWalletBalance(
            this.cyclesCanister.trim()
          );
          this.cycles = res.amount;
          // todo
          this.freezingThreshold = new BigNumber(9997902)
            .div(1024 * 1024 * 1024)
            .times(127000)
            .times(new BigNumber(2592000).plus(60))
            .plus(10 ** 10)
            .toString(10);
        } else {
          if (Number(this.freezingThreshold)) {
            try {
              const res = await this.walletService.getWalletBalance(
                this.cyclesCanister.trim()
              );
              this.cycles = res.amount;
            } catch (e) {
              const status = await this.ICManagementService.canisterStatus(
                Principal.fromText(this.cyclesCanister.trim())
              );
              if (status.canisterId === this.cyclesCanister.trim()) {
                // storing a GB per second which is 127000 cycles. Your canister has no compute allocation so only the memory consumption is important in this case. Given your canister is using ~2.5MB of memory which is 0.0025 GB, so the freezing balance should be 0.0025 * 127000 * 2592000 (freezing threshold in seconds) = 822_960_000 cycles
                this.freezingThreshold = new BigNumber(
                  status.memory_size.toString(10)
                )
                  .div(1024 * 1024 * 1024)
                  .times(127000)
                  .times(
                    new BigNumber(
                      status.settings.freezing_threshold.toString(10)
                    ).plus(60)
                  )
                  .plus(10 ** 10)
                  .toString(10);
                this.cycles = status.cycles;
              }
            }
          } else {
            const status = await this.ICManagementService.canisterStatus(
              Principal.fromText(this.cyclesCanister.trim())
            );
            if (status.canisterId === this.cyclesCanister.trim()) {
              // storing a GB per second which is 127000 cycles. Your canister has no compute allocation so only the memory consumption is important in this case. Given your canister is using ~2.5MB of memory which is 0.0025 GB, so the freezing balance should be 0.0025 * 127000 * 2592000 (freezing threshold in seconds) = 822_960_000 cycles
              this.freezingThreshold = new BigNumber(
                status.memory_size.toString(10)
              )
                .div(1024 * 1024 * 1024)
                .times(127000)
                .times(
                  new BigNumber(
                    status.settings.freezing_threshold.toString(10)
                  ).plus(60)
                )
                .plus(10 ** 10)
                .toString(10);
              this.cycles = status.cycles;
            }
          }
        }
      } catch (e) {
        this.cycles = '-';
        this.freezingThreshold = '0';
        console.log(e);
      }
      // this.buttonLoading = false;
    } else {
      this.cycles = '-';
    }
    if (!type || type !== 'Interval') {
      this.refreshCyclesLoading = false;
    }
  }
  private async getDepositAccountId(): Promise<void> {
    this.depositAccountId = await this.cyclesFinanceService.getAccountId(
      principalToAccountIdentifier(Principal.fromText(this.getPrincipalId))
    );
    this.getDepositBalance();
  }
  private async getDepositBalance(type?: string): Promise<void> {
    if (!type || type !== 'Interval') {
      this.refreshDepositBalanceLoading = true;
    }
    try {
      const balanceRes = await this.ledgerService.getBalances({
        account: this.depositAccountId
      });
      if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
        this.depositBalance = Number(
          new BigNumber(balanceRes?.e8s.toString(10))
            .div(10 ** this.decimals)
            .decimalPlaces(4, 1)
            .toString(10)
        ).toString(10);
      } else {
        this.depositBalance = '-';
      }
    } catch (e) {
      console.log(e);
    }
    this.refreshDepositBalanceLoading = false;
  }
}
</script>

<style scoped lang="scss">
.cycles-finance-main {
  margin-top: 40px;
}
.home-header {
  margin-top: 14px;
  img {
    height: 64px;
  }
}
.exchange-swap-item-share {
  margin-top: 20px;
  p {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  dl {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex: 1;
    dt {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
    }
  }
  .exchange-swap-item-share-item {
    display: flex;
    align-items: center;
  }
}
.swap-fee {
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    &:last-child {
      margin-left: auto;
    }
  }
}
.exchange {
  width: 690px;
  margin: 50px auto 0;
  border-radius: 4px;
  color: #747884;
  &.exchange-record-main {
    margin-top: 40px;
    width: 100%;
    border-radius: 10px;
    background: #141b23;
    box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
    padding: 20px;
    .exchange-record-title {
      margin-bottom: 15px;
      padding-left: 5px;
      font-size: 16px;
      color: #adb3c4;
    }
  }
  .swap-time {
    min-width: 130px;
  }
  .exchange-record {
    height: 100%;
    background: transparent;
  }
  table {
    font-size: 12px;
    td,
    th {
      text-align: center;
      span {
        display: inline-block;
        text-align: center;
        width: 30px;
        padding: 4px 0;
        border-radius: 3px;
        box-sizing: border-box;
        &.Out {
          background: orange;
        }
        &.In {
          background: green;
        }
      }
    }
  }
  .swap-icp {
    min-width: 60px;
  }
  .swap-cycles {
    min-width: 60px;
  }
  .swap-share {
    min-width: 100px;
  }
  .swap-type {
    min-width: 60px;
    text-align: left;
  }
  .swap-main {
    text-align: left;
  }
  .exchange-swap-liquidity {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 0 20px;
    color: #8c90a1;
  }
  .swap-button {
    width: 100%;
    margin-top: 30px;
    button {
      width: 100%;
      height: 48px;
      font-size: 14px;
    }
  }
  .exchange-swap-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin: -4px auto;
    border-radius: 18px;
    background: #141b23;
    border: 2px solid #000000;
    color: #fff;
  }
  .exchange-swap-icon-plus {
    font-size: 20px;
  }
  .swap-icon {
    transform: rotate(90deg);
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      font-size: 22px;
    }
  }
  .exchange-swap-item {
    background: #141b23;
    border: 1px solid #313b46;
    box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
    border-radius: 9px;
    padding: 30px 35px;
    color: #adb3c4;
    &.exchange-swap-item-icp {
      padding: 40px 35px;
    }
    &.exchange-swap-item-cycles {
      .exchange-swap-item-top-input {
        margin-left: auto;
        width: 310px;
        ::v-deep input {
          height: 36px;
          font-size: 16px;
          border: 1px solid #1e2429;
          background: transparent;
          text-align: right;
          color: #727a87;
        }
        ::v-deep input:focus {
          border: 1px solid #1e2429;
          box-shadow: none;
        }
        ::v-deep .ant-input-suffix {
          color: #727a87;
        }
      }
      input {
        width: 310px;
        height: 40px;
        font-size: 16px;
        text-align: left;
        &:last-child {
          text-align: right;
        }
        &.share-input {
          text-align: left;
          width: 100%;
        }
      }
    }
  }
  input {
    width: 310px;
    height: 40px;
    font-size: 16px;
    border: 1px solid #1e2429;
    padding: 0 10px;
    background: transparent;
    color: #727a87;
    &:focus {
      border: 1px solid #1e2429;
    }
  }
  .exchange-swap-item-top-title {
    color: #adb3c4;
  }
  .exchange-swap-item-top {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    &.exchange-swap-item-icp {
      padding-top: 10px;
    }
    > p {
      display: flex;
      align-items: center;
    }
    span:not(.ant-input-affix-wrapper) {
      display: inline-block;
      width: 50px;
      line-height: 1;
      &.exchange-swap-item-top-share {
        display: flex;
        align-items: center;
        width: 270px;
        span {
          width: auto;
        }
      }
    }
    input {
      margin-left: auto;
      text-align: right;
      &.input-cycles {
        font-size: 16px;
        text-align: left;
        margin-left: 0;
        margin-right: 10px;
      }
    }
  }
}

.exchange-swap-item-bottom {
  display: flex;
  align-items: center;
  .exchange-swap-item-bottom-fee {
    margin-left: auto;
  }
  span {
    color: #8c90a1;
  }
  div {
    margin-top: 5px;
  }
  &.exchange-swap-item-bottom-share {
    div {
      margin-top: 0;
    }
  }
}
.cycles-finance-account {
  .balance-main {
    .balance {
      height: 58px;
    }
  }
  p {
    display: flex;
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 16px;
    span {
      display: inline-block;
      width: 220px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      padding: 0 0 0 10px;
      font-weight: normal;
    }
    i {
      cursor: pointer;
    }
  }
}
.dfinity-logo {
  width: 30px;
  margin-right: 5px;
}
.your-liquidity {
  display: flex;
  padding-bottom: 10px;
  span {
    flex: 1;
  }
}
.exchange-swap-item-liquidity {
  margin-bottom: 20px;
}
.your-liquidity-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 166px;
  .title {
    font-size: 16px;
  }
  button {
    width: 80px;
    transition: all 0.3s;
  }
  .your-liquidity-header-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    button {
      background: rgba(81, 183, 195, 0.2);
      color: #788384;
      &.active,
      &:hover {
        background: rgba(81, 183, 195, 0.6);
        color: #fff;
      }
    }
  }
  button.your-liquidity-header-add {
    width: 100%;
    margin-bottom: 10px;
    background: rgba(81, 183, 195, 0.4);
    &.active {
      color: #fff;
      background: #51b7c3;
    }
  }
}
.exchange-swap-item-fee {
  padding: 5px 0;
  span {
    margin-left: 10px;
    &.label {
      display: inline-block;
      width: 110px;
      margin-left: 0;
    }
  }
}
.question-circle-icon {
  margin-left: 5px;
  cursor: pointer;
}
.tooltip-tip-title {
  font-size: 16px;
}
.exchange-fee-item {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 20px;
  background: #141b23;
  border-radius: 5px;
  padding: 30px 20px 25px;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  color: #adb3c4;
  .exchange-fee-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    i:last-child {
      transform: rotate(10deg) translateY(5px);
    }
  }
  i {
    display: inline-block;
    width: 1px;
    height: 12px;
    background: #636c73;
    font-style: normal;
    margin: 0 5px;
    transform: rotate(10deg);
  }
  dl {
    width: 25%;
    text-align: center;
    &.exchange-fee-item-bottom {
      margin-top: 20px;
    }
  }
  dd {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    height: 50px;
    margin-top: 15px;
    &.price-dd {
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
    }
    span {
      font-size: 12px;
      &.num-span {
        font-size: 24px;
        line-height: 24px;
        color: #fff;
      }
    }
  }
  .exchange-fee-item-left,
  .exchange-fee-item-right {
    > div {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      &:first-child {
        margin-bottom: 5px;
      }
      &:last-child {
        margin-top: 7px;
      }
    }
  }
  .exchange-fee-item-right {
    > div {
      justify-content: flex-start;
    }
  }
}
.exchange-share-item {
  margin-top: 20px;
}
.cycles-logo {
  .cycles-logo-i {
    border: 1px solid #727a87;
    line-height: 15px;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    border-radius: 10px;
    font-style: normal;
  }
}
.user-liquidity-share {
  margin-top: 5px;
  font-size: 16px;
  color: #fff;
  span {
    font-size: 12px;
  }
}
.you-get-shares {
  font-size: 16px;
  color: #fff;
}
.exchange-swap-item-top-allocable {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}
.icp-per-cycles {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.num-span-i {
  font-size: 16px !important;
  margin-top: 2px;
  padding: 0 2px;
}
.line {
  width: 12px;
}
.reload-icon {
  cursor: pointer;
}
span.exchange-swap-item-bottom-fee-share {
  cursor: pointer;
  color: #1996c4;
}
.exchange-fee-item-left {
  min-width: 45px;
}
.exchange-swap-item-top-logo {
  display: flex;
  align-items: center;
  border-radius: 20px;
  width: 100px;
  height: 36px;
  margin-right: 240px;
  padding: 5px;
  border: 1px solid #464648;
  color: #fff;
}
.ant-input-affix-wrapper {
  width: 310px;
  ::v-deep input {
    text-align: right !important;
  }
  ::v-deep input::-webkit-input-placeholder {
    font-size: 14px !important;
  }
  ::v-deep input:-ms-input-placeholder {
    font-size: 14px !important;
  }
  ::v-deep input:-moz-placeholder {
    font-size: 14px !important;
  }
}
.cycles-tip {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-left: auto;
}
.exchange-swap-item-top-account {
  width: 310px;
  margin-right: 10px;
  color: #fff;
}
.exchange-swap {
  position: relative;
}
.swap-setting {
  position: absolute;
  top: 10px;
  right: 50px;
  cursor: pointer;
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
.swap-count {
  display: flex;
  flex-direction: column;
  .num-span {
    margin-bottom: 5px;
  }
}
.insufficient-input {
  color: #f5222d;
  margin-top: -7px;
  padding-bottom: 5px;
  text-align: right;
}
.no-cycles-wallet {
  position: relative;
  bottom: 20px;
  font-size: 12px;
  text-align: center;
  a {
    color: #1996c4;
  }
  &.no-cycles-wallet-cycles {
    bottom: 30px;
  }
}
.yield-main,
.your-rewards {
  display: flex;
  justify-content: flex-start;
  > span {
    flex-shrink: 0;
  }
  div {
    display: flex;
    flex-direction: column;
  }
}
.yield-main {
  color: #666c7e;
  div {
    span {
      font-size: 12px;
    }
  }
}
.shares-main {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  color: #adb3c4;
  .shares-main-total {
    width: 227px;
  }
  .shares-main-user {
    width: 227px;
  }
  > div {
    display: flex;
    flex-direction: column;
  }
}
.user-liquidity-value {
  width: 200%;
  font-size: 20px;
  transform: scale(0.5);
  transform-origin: left center;
}
.record-nonce {
  padding: 0 5px;
}
.withdraw-deposit {
  margin-left: 10px;
  font-size: 14px;
  cursor: pointer;
}
.cycles-finance-tip {
  margin-top: 20px;
  color: #8c90a1;
}
.exchange-pending-record {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: #666;
  background-color: #1e2428;
  padding: 15px 0;
  border-radius: 5px;
  box-shadow: 5px 6px 8px #181d21;
  > div {
    margin: 0 8px;
  }
}
.input-cycles-select {
  width: 310px;
  margin-right: 10px;
  ::v-deep .ant-select-selection--single {
    padding: 3px;
  }
}
.other-cycles {
  padding: 5px 12px;
  cursor: pointer;
  color: #727a87;
  transition: all 0.3s;
  &:hover {
    background: #1996c4;
    color: #fff;
  }
}
.share-input {
  width: 100%;
  ::v-deep .ant-select-selection--single {
    padding: 3px;
  }
}
.other-cycles-modal {
  ::v-deep .ant-modal-body {
    padding: 30px 55px 10px;
  }
}
.remove-check-icon {
  position: absolute;
  right: 5px;
  top: 9px;
}
@media screen and (max-width: 768px) {
  .home-header {
    ul {
      display: none;
    }
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
  .exchange {
    width: 100%;
    padding: 0 15px 20px;
  }
  .exchange-swap-item-top-logo {
    margin-right: auto;
  }
  .exchange-swap-item-top-account {
    width: 49%;
  }
  .ant-input-affix-wrapper {
    width: 49%;
  }
  .input-cycles-select {
    width: 49%;
  }
  .exchange-swap-item-top-input {
    width: 49%;
  }
  .exchange-swap-item {
    padding: 30px 10px !important;
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
.flex {
  display: flex;
  align-items: center;
}
</style>
