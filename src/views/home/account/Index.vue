<template>
  <div>
    <div class="wallet-main container-width">
      <div>
        <ul class="icsns-menu">
          <li
            v-for="menu in ICSNSMenu"
            :key="menu.name"
            :class="{
              active: menu.name === currentWalletMenu
            }"
            @click="changeMenu(menu)"
          >
            <span v-show="menu.name === 'icRouter'">
              <a-tooltip placement="top">
                <template slot="title">
                  Tokens cross-chaining based on Threshold Signature Scheme
                  (TSS).
                </template>
                {{ menu.value }}
              </a-tooltip>
            </span>
            <span v-show="menu.name !== 'icRouter'">
              {{ menu.value }}
            </span>
          </li>
        </ul>
        <!--<div class="wallet-header base-font-title">
					<div class="base-title-size base-font-title-io">ICLight.io</div>
					<div class="margin-left-auto wallet-info">
						<div
							v-show="!isIcx && loginType !== 'ICLight'"
							class="wallet-info-type"
						>
							<img :src="source[loginType]" alt="" />
							<span>connected</span>
							<span v-show="loginType === 'MetaMask'"
								>({{ ethAccount | ellipsisAccount(8) }})</span
							>
						</div>
						<div>
							<div class="wallet-item-account">
								<div class="wallet-item-account-item">
									<span>Account ID:&nbsp;</span>
									<copy-account :front="8" :account="account"></copy-account>
								</div>
								<div class="wallet-item-account-item">
									<span>Principal ID:&nbsp;</span>
									<copy-account
										:front="8"
										:account="getPrincipalId"
										copy-text="Principal ID"
									></copy-account>
								</div>
							</div>
							<img class="account-identicon-img" :src="identiconImg" alt="" />
						</div>
					</div>
				</div>-->
        <div v-if="currentWalletMenu === 'icRouter'" class="wallet-item">
          <ledger
            :principal="getPrincipalId"
            :balance="balance"
            :balance-pro="balancePro"
            :get-check-auth="getCheckAuth"
            :tokens-balance-main="tokensBalanceMain"
            :tokens-balance-pro="tokensBalancePro"
            type="cross"
            ref="ledger1"
            @topUpSuccess="topUpSuccess"
            @addTokenSuccess="addTokenSuccess"
            @getBalance="getICPBalance"
          ></ledger>
        </div>
        <!--<ul class="flex-center base-color-w wallet-header-menu">
					<li
						v-for="item in walletMenu"
						:key="item.value"
						:class="{ active: currentWalletMenu === item.value }"
						@click="changeWalletMenu(item.value)"
					>
						{{ item.name }}
					</li>
				</ul>-->
        <div
          v-show="currentWalletMenu !== 'icRouter' && getPrincipalId"
          class="wallet-item"
        >
          <p class="base-title-size flex-center">
            IC network
            <button
              v-show="currentWalletMenu === 'wallet'"
              type="button"
              class="margin-left-auto"
              @click="showTraderAccounts"
            >
              <span>TraderAccounts</span>
            </button>
            <span
              v-show="currentWalletMenu === 'proWallet'"
              class="flex-center base-tip-size base-font-title pc-show"
              style="display: flex; margin-left: 10px"
            >
              subaccount:&nbsp;<copy-account
                account="0000000000000000000000000000000000000000000000000000000000000001"
                copyText="Subaccount"
              ></copy-account>
            </span>
            <span
              v-show="currentWalletMenu === 'proWallet'"
              class="flex-center base-tip-size margin-left-auto base-font-title h5-show"
            >
              subaccount:&nbsp;<copy-account
                account="0000000000000000000000000000000000000000000000000000000000000001"
                copyText="Subaccount"
              ></copy-account>
            </span>
            <button
              v-show="currentWalletMenu === 'proWallet'"
              type="button"
              class="margin-left-auto"
              @click="showTraderAccounts"
            >
              <span>TraderAccounts</span>
            </button>
          </p>
          <ledger
            v-if="currentWalletMenu === 'wallet'"
            :principal="getPrincipalId"
            :balance="balance"
            :balance-pro="balancePro"
            :get-check-auth="getCheckAuth"
            :tokens-balance-main="tokensBalanceMain"
            :tokens-balance-pro="tokensBalancePro"
            wallet-menu="wallet"
            type="ic"
            ref="ledger"
            @topUpSuccess="topUpSuccess"
            @showTraderAccounts="showTraderAccounts"
            @getBalance="getICPBalance"
          ></ledger>
          <ledger
            v-if="currentWalletMenu === 'proWallet'"
            :principal="getPrincipalId"
            :balance="balance"
            :balance-pro="balancePro"
            :get-check-auth="getCheckAuth"
            :tokens-balance-main="tokensBalanceMain"
            :tokens-balance-pro="tokensBalancePro"
            wallet-menu="proWallet"
            type="ic"
            ref="ledger"
            @topUpSuccess="topUpSuccess"
            @showTraderAccounts="showTraderAccounts"
            @getBalance="getICPBalance"
          ></ledger>
          <div class="ic-token-item">
            <p class="wallet-title token-title">
              <span>
                Tokens
                <a-icon
                  v-show="!refreshTokensLoading"
                  @click="refreshTokens"
                  type="reload"
                  class="reload-icon"
                />
                <a-icon
                  v-show="refreshTokensLoading"
                  type="loading"
                  class="reload-icon"
                />
              </span>
              <!--<button
                class="pc-show primary"
                v-show="currentWalletMenu === 'wallet'"
                type="button"
                style="
                  width: 90px;
                  margin-right: 10px;
                  margin-left: auto;
                  background: rgba(81, 183, 195, 0.7) !important;
                "
                @click="showFaucet"
              >
                Faucet
              </button>-->
              <button
                style="margin-left: auto"
                type="button"
                @click="onAddToken"
              >
                Add Token
              </button>
            </p>
            <div class="wallet-item-table">
              <added-tokens
                :principal="getPrincipalId"
                :wallet-menu="currentWalletMenu"
                ref="addedTokens"
                @showTraderAccounts="showTraderAccounts"
              ></added-tokens>
            </div>
          </div>
        </div>
        <div
          v-show="currentWalletMenu === 'wallet' && getPrincipalId"
          class="wallet-item wallet-item-no-border"
        >
          <div class="wallet-title">
            <span>
              Cycles Wallet
              <a-icon
                v-show="!refreshBalanceLoading"
                @click="refreshCycles"
                type="reload"
                class="reload-icon"
              />
              <a-icon
                v-show="refreshBalanceLoading"
                type="loading"
                class="reload-icon"
              />
            </span>
            <div>
              <button type="button" @click="onCreateWallet">
                Create Wallet
              </button>
              <button type="button" @click="onManageWallet">Bind Wallet</button>
            </div>
          </div>
          <div class="wallet-item-table wallet-item-table-cycles">
            <a-spin :spinning="walletSpinning">
              <table>
                <tbody>
                  <tr class="no-wallet" v-if="!wallets.length">
                    No binding Cycles Wallet
                  </tr>
                  <cycles-wallet
                    v-else
                    v-for="(wallet, index) in wallets"
                    :key="wallet.walletId.toString()"
                    @removeWalletSuccess="removeWalletSuccess(index)"
                    @setDefaultSuccess="setDefaultSuccess"
                    @showTopUp="showTopUp"
                    :wallet="wallet"
                    :ref="'cyclesWallet' + index"
                  ></cycles-wallet>
                </tbody>
              </table>
            </a-spin>
          </div>
        </div>
        <div
          v-show="currentWalletMenu === 'wallet' && getPrincipalId"
          class="wallet-item wallet-item-no-border"
        >
          <p class="wallet-title token-title">
            <span>NFTs (Only support ICLighthouse Planet Card NFT)</span>
          </p>
          <a-spin :spinning="nftSpinning">
            <div class="wallet-item-table wallet-item-table-nft">
              <ul class="nft-main">
                <li
                  v-for="(ext, index) in tokensExt.slice(
                    extPage * extPageNum,
                    (extPage + 1) * extPageNum
                  )"
                  :key="index"
                >
                  <div>
                    <a
                      :href="`https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai/${ext[0]}`"
                      rel="nofollow noreferrer noopener"
                      target="_blank"
                      ><img :src="getExtInfo(ext[2]).thumb" alt=""
                    /></a>
                  </div>
                  <div class="ext-info">{{ getExtInfo(ext[2]).name }}</div>
                  <div class="ext-transfer" @click="showTransferToken(ext[0])">
                    Transfer
                  </div>
                </li>
              </ul>
              <div
                class="no-nft-data"
                v-show="!nftSpinning && !tokensExt.length"
              >
                You have no NFTs right now
              </div>
              <div class="nft-main-pagination">
                <a-pagination
                  v-if="tokensExt.length > 20"
                  class="pagination"
                  :defaultPageSize="extPageNum"
                  :current="extPage + 1"
                  :total="tokensExt.length"
                  @change="pageChange"
                />
              </div>
            </div>
          </a-spin>
        </div>
        <create-wallet
          @createWalletSuccess="createWalletSuccess"
          :balance="balance"
          ref="createWallet"
        ></create-wallet>
        <a-modal
          v-model="visibleTransferNFT"
          centered
          title="Transfer NFT"
          width="550px"
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          class="manage-wallet-modal"
          :after-close="afterNftClose"
        >
          <div>
            <a-form-model
              ref="transferNFTForm"
              :model="transferNFTForm"
              :rules="transferNFTFormRules"
            >
              <a-form-model-item label="To" prop="to">
                <a-input
                  v-model="transferNFTForm.to"
                  autocomplete="off"
                  placeholder="Principal Or Account Id"
                />
                <div class="base-font">
                  Beware, not all wallets support all NFT.
                </div>
              </a-form-model-item>
              <a-form-model-item>
                <button
                  type="button"
                  class="transfer-submit large-primary primary mt20"
                  @click="transferNFT"
                >
                  Transfer
                </button>
              </a-form-model-item>
            </a-form-model>
          </div>
        </a-modal>
        <a-modal
          v-model="visibleManageWallet"
          centered
          title="Bind Cycles Wallet"
          width="550px"
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          class="manage-wallet-modal"
          :after-close="afterClose"
        >
          <a-form-model
            :model="manageWalletForm"
            ref="manageWalletForm"
            :rules="manageWalletFormRules"
          >
            <a-form-model-item label="Wallet" prop="wallet">
              <a-input
                v-model="manageWalletForm.wallet"
                autocomplete="off"
                placeholder="Cycles Wallet"
              />
            </a-form-model-item>
            <a-form-model-item>
              <button
                type="button"
                class="transfer-submit primary large-primary"
                @click="manageWalletSubmit"
              >
                Bind Wallet
              </button>
            </a-form-model-item>
          </a-form-model>
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
            <button type="button" @click="metaMaskVisible = false">
              Cancel
            </button>
            <button type="button" class="default" @click="installMetaMask">
              OK
            </button>
          </div>
        </a-modal>
        <a-modal
          v-model="chooseCreateWallet"
          width="400px"
          centered
          :footer="null"
          :keyboard="false"
          :maskClosable="false"
          class="choose-create-wallet"
        >
          <div class="choose-create-wallet">
            <p @click="createWalletWithAccount">
              Create a wallet with main account
            </p>
            <p @click="createWalletWithWallet">
              Create a wallet with cycles wallet
            </p>
          </div>
        </a-modal>
        <create-wallet
          @createWalletSuccess="createWalletSuccess"
          :wallet-id="currentWallet.walletId.toString()"
          :cycles="currentWallet.cycles"
          ref="cyclesCreateWallet"
        ></create-wallet>
      </div>
      <div v-if="!getPrincipalId && currentWalletMenu !== 'icRouter'">
        <div class="wallet-empty container-width">
          <img src="@/assets/img/empty.png" alt="" />
          <p>Connect wallet to view</p>
          <button type="button" class="default" @click="connectWallet">
            Connect Wallet
          </button>
        </div>
      </div>
      <a-modal
        v-model="traderAccountsModal"
        width="90%"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="transfer-modal forge-modal forge-modal-eth active-pending-modal"
      >
        <a-spin :spinning="spinning">
          <table style="margin-top: 40px">
            <thead>
              <tr>
                <th>Pair</th>
                <th>Canister Id</th>
                <th>Token0 Balance</th>
                <th>Token1 Balance</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in pairList.slice(
                  (pairListPage - 1) * 10,
                  pairListPage * 10
                )"
                :key="index"
              >
                <td>{{ item[1][0].token0[1] }}/{{ item[1][0].token1[1] }}</td>
                <td>
                  <copy-account
                    :account="item[1][0].canisterId.toString()"
                    copyText="Canister ID"
                  ></copy-account>
                </td>
                <td>
                  <dl>
                    <dt>
                      <span class="balance-left">Available:</span>
                      <span v-show="currentWalletMenu === 'wallet'">
                        <span
                          v-if="
                            tokens &&
                            tokens[item[1][0].token0[0].toString()] &&
                            mainTokensBalance[
                              item[1][0].canisterId.toString()
                            ] &&
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token0 &&
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token0.available
                          "
                        >
                          {{
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token0.available |
                              bigintToFloat(
                                8,
                                tokens[item[1][0].token0[0].toString()].decimals
                              ) |
                              formatAmount(8)
                          }}
                        </span>
                        <span v-else>-</span>
                      </span>
                      <span v-show="currentWalletMenu === 'proWallet'">
                        <span
                          v-if="
                            tokens &&
                            tokens[item[1][0].token0[0].toString()] &&
                            proTokensBalance[
                              item[1][0].canisterId.toString()
                            ] &&
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token0 &&
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token0.available
                          "
                        >
                          {{
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token0.available |
                              bigintToFloat(
                                8,
                                tokens[item[1][0].token0[0].toString()].decimals
                              ) |
                              formatAmount(8)
                          }}
                        </span>
                        <span v-else>-</span>
                      </span>
                    </dt>
                    <dd>
                      <span class="balance-left">Locked:</span>
                      <span v-show="currentWalletMenu === 'wallet'">
                        <span
                          v-if="
                            tokens &&
                            tokens[item[1][0].token0[0].toString()] &&
                            mainTokensBalance[
                              item[1][0].canisterId.toString()
                            ] &&
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token0 &&
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token0.locked
                          "
                        >
                          {{
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token0.locked |
                              bigintToFloat(
                                8,
                                tokens[item[1][0].token0[0].toString()].decimals
                              ) |
                              formatAmount(8)
                          }}
                        </span>
                        <span v-else>-</span>
                      </span>
                      <span v-show="currentWalletMenu === 'proWallet'">
                        <span
                          v-if="
                            tokens &&
                            tokens[item[1][0].token0[0].toString()] &&
                            proTokensBalance[
                              item[1][0].canisterId.toString()
                            ] &&
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token0 &&
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token0.locked
                          "
                        >
                          {{
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token0.locked |
                              bigintToFloat(
                                8,
                                tokens[item[1][0].token0[0].toString()].decimals
                              ) |
                              formatAmount(8)
                          }}
                        </span>
                        <span v-else>-</span>
                      </span>
                    </dd>
                  </dl>
                </td>
                <td>
                  <dl>
                    <dt>
                      <span class="balance-left">Available:</span>
                      <span v-show="currentWalletMenu === 'wallet'">
                        <span
                          v-if="
                            tokens &&
                            tokens[item[1][0].token1[0].toString()] &&
                            mainTokensBalance[
                              item[1][0].canisterId.toString()
                            ] &&
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token1 &&
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token1.available
                          "
                        >
                          {{
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token1.available |
                              bigintToFloat(
                                8,
                                tokens[item[1][0].token1[0].toString()].decimals
                              ) |
                              formatAmount(8)
                          }}
                        </span>
                        <span v-else>-</span>
                      </span>
                      <span v-show="currentWalletMenu === 'proWallet'">
                        <span
                          v-if="
                            tokens &&
                            tokens[item[1][0].token1[0].toString()] &&
                            proTokensBalance[
                              item[1][0].canisterId.toString()
                            ] &&
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token1 &&
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token1.available
                          "
                        >
                          {{
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token1.available |
                              bigintToFloat(
                                8,
                                tokens[item[1][0].token1[0].toString()].decimals
                              ) |
                              formatAmount(8)
                          }}
                        </span>
                        <span v-else>-</span>
                      </span>
                    </dt>
                    <dd>
                      <span class="balance-left">Locked:</span>
                      <span v-show="currentWalletMenu === 'wallet'">
                        <span
                          v-if="
                            tokens &&
                            tokens[item[1][0].token1[0].toString()] &&
                            mainTokensBalance[
                              item[1][0].canisterId.toString()
                            ] &&
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token1 &&
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token1.locked
                          "
                        >
                          {{
                            mainTokensBalance[item[1][0].canisterId.toString()]
                              .token1.locked |
                              bigintToFloat(
                                8,
                                tokens[item[1][0].token1[0].toString()].decimals
                              ) |
                              formatAmount(8)
                          }}
                        </span>
                        <span v-else>-</span>
                      </span>
                      <span v-show="currentWalletMenu === 'proWallet'">
                        <span
                          v-if="
                            tokens &&
                            tokens[item[1][0].token1[0].toString()] &&
                            proTokensBalance[
                              item[1][0].canisterId.toString()
                            ] &&
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token1 &&
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token1.locked
                          "
                        >
                          {{
                            proTokensBalance[item[1][0].canisterId.toString()]
                              .token1.locked |
                              bigintToFloat(
                                8,
                                tokens[item[1][0].token1[0].toString()].decimals
                              ) |
                              formatAmount(8)
                          }}
                        </span>
                        <span v-else>-</span>
                      </span>
                    </dd>
                  </dl>
                </td>
                <td class="operation-td">
                  <div class="operation">
                    <span
                      :class="{
                        disabled:
                          currentWalletMenu === 'wallet'
                            ? !item[2].main
                            : !item[2].pro
                      }"
                      class="operation-name pointer"
                      @click="onWithdraw(item)"
                    >
                      Withdraw
                    </span>
                    <span
                      class="operation-name"
                      @click="onDepositKeepingBalance(item)"
                    >
                      Deposit
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="nft-main-pagination">
            <a-pagination
              v-if="pairList.length > 10"
              class="pagination"
              :defaultPageSize="10"
              :current="pairListPage"
              :total="pairList.length"
              @change="pairListPageChange"
            />
          </div>
        </a-spin>
      </a-modal>
      <withdraw-token
        ref="withdrawToken"
        :current-pair="currentPair"
        :is-wallets="true"
        @withdrawSuccess="withdrawSuccess"
        @changeWithdrawToken="onWithdraw"
      >
      </withdraw-token>
      <transfer-token
        :current-token="currentToken"
        :current-pair="currentPair"
        :is-wallets="true"
        ref="transferToken"
        type="Deposit"
        transferButton="Deposit"
        @transferTokenSuccess="transferTokenSuccess"
        @changeDepositToken="changeDepositToken"
      ></transfer-token>
      <a-modal
        v-model="faucetModal"
        width="485px"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="transfer-modal forge-modal forge-modal-eth active-pending-modal"
      >
        <div class="base-font-title" style="margin-top: 40px">
          Get free faucet funds for testing the ITest/DTest trading pair.
        </div>
        <div class="mt20">
          <button type="button" class="primary margin-left-auto">
            Mint test tokens
          </button>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import MetaMaskOnboarding from '@metamask/onboarding';
import CyclesWallet from '@/views/home/account/components/CyclesWallet.vue';
import Ledger from '@/views/home/account/components/Ledger.vue';
import CreateWallet from '@/views/home/account/components/CreateWallet.vue';
import AddedTokens from '@/views/home/account/components/AddedTokens.vue';
import { namespace } from 'vuex-class';
import {
  CK_ETH_MINTER_CANISTER_ID,
  CK_ETH_MINTER_CANISTER_ID_TEST,
  encryptMessage,
  getEthereumAccount,
  NFT_CANISTER_ID,
  validatePrincipal
} from '@/ic/utils';
import {
  fromSubAccountId,
  getTokenIdentifier,
  principalToAccountIdentifier
} from '@/ic/converter';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { Principal } from '@dfinity/principal';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import {
  CreateCyclesWalletArgs,
  ManageWalletResponse
} from '@/ic/ICLighthouse/model';
import {
  recoverTypedSignature,
  SignTypedDataVersion
} from '@metamask/eth-sig-util';
import { PrincipalString, TokenInfo } from '@/ic/common/icType';
import Identicon from 'identicon.js';
import { manageAddressBook } from '@/ic/manageAddressBook';
import { validateCanister, validateCanisterOrAccount } from '@/utils/validate';
import { BalanceMixin } from '@/mixins';
import { checkAuth } from '@/ic/CheckAuth';
import { WalletService } from '@/ic/wallet/walletService';
import { toHttpError } from '@/ic/httpError';
import ConnectPlug, {
  currentPageConnectPlug,
  needConnectPlug
} from '@/ic/ConnectPlug';
import walletIDL from '@/ic/wallet/wallet.did';
import tokenIDL from '@/ic/DRC20Token/DRC20Token.did';
import {
  TokensExt,
  TransferNFTRequest,
  TransferNFTResponse,
  TransferNFTResponseErr,
  User
} from '@/ic/nft/model';
import { NftService } from '@/ic/nft/Service';
import { isPlug } from '@/ic/isPlug';
import NFTIdl from '@/ic/nft/erc721.did';
import { addIcxWhitelist, connectIcx, initIcx } from '@/ic/connectIcx';
import EventBus from '@/utils/Event';
import BigNumber from 'bignumber.js';
import { isInfinity } from '@/ic/isInfinity';
import ConnectInfinity, {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { ckETHMinterService } from '@/ic/ckETHMinter/ckETHMinterService';
import {
  SwapTokenInfo,
  TrieListData,
  TrieListData1
} from '@/ic/ICSwapRouter/model';
import { DePairs, TraderAccountsType } from '@/views/home/ICDex/model';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { AddTokenItem, AddTokenItemClass } from '@/views/home/account/model';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';
import WithdrawToken from '@/components/withdrawToken/Index.vue';
import TransferToken from '@/components/transferToken/Index.vue';
import { getFee } from '@/ic/getTokenFee';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { PairTokenStdMenu } from '@/views/home/ICSwap/model';
import { ApproveError, TxReceiptErr } from '@/ic/DRC20Token/model';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { ckETHMinterDfiService } from '@/ic/ckETHMinter/ckETHMinterDfiService';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
// const plugIc = (window as any).ic;
const commonModule = namespace('common');
let ethereum = (window as any).ethereum;
if (ethereum && ethereum.providers) {
  ethereum = ethereum.providers.find((provider) => provider.isMetaMask);
}
@Component({
  name: 'Index',
  components: {
    CyclesWallet,
    Ledger,
    CreateWallet,
    AddedTokens,
    WithdrawToken,
    TransferToken,
    AccountInfo
  }
})
export default class extends Mixins(BalanceMixin) {
  $refs!: {
    ledger: HTMLFormElement;
    cyclesWallet: HTMLFormElement;
    createWallet: HTMLFormElement;
    manageWalletForm: HTMLFormElement;
    transferNFTForm: HTMLFormElement;
    addedTokens: HTMLFormElement;
    cyclesCreateWallet: HTMLFormElement;
  };
  @commonModule.Getter('getIdentity') getIdentity?:
    | Secp256k1KeyIdentity
    | Ed25519KeyIdentity;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @commonModule.Mutation('SET_SHOW_CHECK_AUTH') setCheckAuth?: any;
  public ICLighthouseService: ICLighthouseService | undefined;
  private ckETHMinterService: ckETHMinterService = null;
  private ckETHMinterDfiService: ckETHMinterDfiService = null;
  // public principal: string = null;
  private metaMaskVisible = false;
  public ethAccount = '';
  private walletService: WalletService;
  public currentWallet: ManageWalletResponse = {
    walletId: Principal.fromText('aaaaa-aa'),
    address: '',
    isDefault: false
  };
  public wallets: ManageWalletResponse[] = [];
  private walletSpinning = false;
  public visibleManageWallet = false;
  private chooseCreateWallet = false;
  private loginType = '';
  private refreshBalanceLoading = false;
  private refreshTokensLoading = false;
  public manageWalletForm = {
    wallet: ''
  };
  public manageWalletFormRules = {
    wallet: [
      { required: true, message: 'Please enter Wallet', trigger: 'blur' },
      { validator: validateCanister, trigger: 'blur' }
    ]
  };
  private transferNFTForm = {
    to: ''
  };
  private transferNFTFormRules = {
    to: [
      {
        required: true,
        message: 'Please enter principal or account id',
        trigger: 'blur'
      },
      { validator: validateCanisterOrAccount, trigger: 'blur' }
    ]
  };
  private nftSpinning = false;
  private NftService: NftService = null;
  private tokensExt: TokensExt = [];
  private extPage = 0;
  private extPageNum = 10;
  private visibleTransferNFT = false;
  private NFTIndex: number;
  private isIcx = false;
  private source = {
    ICLight: require('@/assets/img/logo-i.png'),
    Plug: require('@/assets/img/plug.png'),
    Infinity: require('@/assets/img/infinity.png'),
    MetaMask: require('@/assets/img/MetaMask.png'),
    'Internet Identity': require('@/assets/img/dfinity.png')
  };
  private walletMenu = [
    {
      value: 'wallet',
      name: 'Main-Wallet'
    },
    {
      value: 'proWallet',
      name: 'Pro-Wallet'
    }
  ];
  private ICSwapRouterService: ICSwapRouterFiduciaryService;
  private ICDexService: ICDexService;
  private tokens: { [key: string]: TokenInfo } = {};
  private pairList: Array<[...TrieListData, { main: boolean; pro: boolean }]> =
    [];
  private currentPair: DePairs = null;
  private mainTokensBalance: TraderAccountsType = {};
  private proTokensBalance: TraderAccountsType = {};
  private pairListPage = 1;
  private traderAccountsModal = false;
  private spinning = false;
  private isToken0 = true;
  private currentToken: AddTokenItem = null;
  private currentWalletMenu: 'wallet' | 'proWallet' | 'icRouter' = 'wallet';
  private ICSNSMenu = [
    {
      value: 'Main-Wallet',
      name: 'wallet',
      path: '/wallet?Main'
    },
    {
      value: 'Pro-Wallet',
      name: 'proWallet',
      path: '/wallet?Pro'
    },
    {
      value: 'icRouter',
      name: 'icRouter',
      path: '/icRouter'
    }
  ];
  private faucetModal = false;
  @Watch('$route')
  private onRouteChange() {
    if (this.$route.fullPath.toLocaleLowerCase().includes('icrouter')) {
      this.currentWalletMenu = 'icRouter';
    } else if (this.$route.fullPath.toLocaleLowerCase().includes('pro')) {
      this.currentWalletMenu = 'proWallet';
    } else {
      this.currentWalletMenu = 'wallet';
    }
  }
  get identiconImg(): string {
    if (this.account) {
      return (
        'data:image/png;base64,' + new Identicon(this.account, 40).toString()
      );
    }
    return '';
  }
  created(): void {
    if (this.$route.fullPath.toLocaleLowerCase().includes('icrouter')) {
      this.currentWalletMenu = 'icRouter';
    } else if (this.$route.fullPath.toLocaleLowerCase().includes('pro')) {
      this.currentWalletMenu = 'proWallet';
    } else {
      this.currentWalletMenu = 'wallet';
    }
  }
  async mounted(): Promise<void> {
    this.ICLighthouseService = new ICLighthouseService();
    this.ckETHMinterService = new ckETHMinterService();
    this.ckETHMinterDfiService = new ckETHMinterDfiService();
    this.walletService = new WalletService();
    this.NftService = new NftService();
    this.ICSwapRouterService = new ICSwapRouterFiduciaryService();
    this.ICDexService = new ICDexService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const principal = localStorage.getItem('principal');
    if ((window as any).icx) {
      this.isIcx = !!(window as any).icx;
      EventBus.$on('initSuccess', async () => {
        await this.getPairs();
        this.init();
      });
      if (principal) {
        await initIcx();
      }
    }
    if (priList[principal]) {
      if (priList[principal] === 'Plug') {
        this.loginType = 'Plug';
      } else if (priList[principal] === 'SignerPlug') {
        this.loginType = 'SignerPlug';
      } else if (priList[principal] === 'Infinity') {
        this.loginType = 'Infinity';
      } else if (priList[principal] === 'AuthClient') {
        this.loginType = 'Internet Identity';
      } else if (priList[principal] === 'NFID') {
        this.loginType = 'NFID';
      } else if (priList[principal] === 'SignerNFID') {
        this.loginType = 'SignerNFID';
      } else if (priList[principal].includes('MetaMask')) {
        this.loginType = 'MetaMask';
        this.ethAccount = priList[principal].split('MetaMask-')[1];
      } else {
        this.loginType = 'ICLight';
      }
    }
    if (principal) {
      this.init();
    }
  }
  private changeMenu(val): void {
    this.currentWalletMenu = val.name;
    this.$router.push(val.path);
  }
  private init(): void {
    // this.getInfo();
    this.getWallets();
    // this.getEthConnect();
    this.openNotification();
    this.getTokensExt();
  }
  private changeDepositToken(pair, isToken0): void {
    this.onDepositKeepingBalance(pair, isToken0);
  }
  private onDepositKeepingBalance(
    pair: [...TrieListData, { main: boolean; pro: boolean }],
    isToken0 = true
  ): void {
    this.currentToken = null;
    this.currentPair = [pair[0], pair[1]];
    this.isToken0 = isToken0;
    let subaccount = new Uint8Array(fromSubAccountId(0));
    if (this.currentWalletMenu === 'proWallet') {
      subaccount = new Uint8Array(fromSubAccountId(1));
    }
    const currentAddress = principalToAccountIdentifier(
      Principal.fromText(this.getPrincipalId),
      subaccount
    );
    let std = Object.keys(pair[1][0].token0[2])[0];
    if (!isToken0) {
      std = Object.keys(pair[1][0].token1[2])[0];
    }
    let tokenId = pair[1][0].token0[0].toString();
    if (!isToken0) {
      tokenId = pair[1][0].token1[0].toString();
    }
    const currentToken = new AddTokenItemClass();
    let standard;
    if (std.toLocaleLowerCase() === 'drc20') {
      standard = 'DRC20';
    } else if (std.toLocaleLowerCase() === 'icrc1') {
      standard = 'ICRC-1';
    } else if (
      std.toLocaleLowerCase() === 'icrc2' ||
      std.toLocaleLowerCase() === 'icp'
    ) {
      standard = 'ICRC-2';
    } else {
      return;
    }
    const decimals = this.tokens[tokenId].decimals;
    this.currentToken = Object.assign(currentToken, {
      balance: '',
      canisterId: Principal.fromText(tokenId),
      decimals: decimals,
      name: this.tokens[tokenId].name,
      symbol: this.tokens[tokenId].symbol,
      standard: standard
    });
    (this.$refs as any).transferToken.transferForm.to =
      this.currentPair[0] + '.' + currentAddress;
    if (this.currentWalletMenu === 'proWallet') {
      (this.$refs as any).transferToken.init(this.currentToken, 1);
    } else {
      (this.$refs as any).transferToken.init(this.currentToken);
    }
  }
  private async transferTokenSuccess(
    amount: string,
    loading,
    subAccountId: number
  ): Promise<void> {
    // Need Approve
    let tokenInfo: SwapTokenInfo;
    if (this.isToken0) {
      tokenInfo = this.currentPair[1][0].token0;
    } else {
      tokenInfo = this.currentPair[1][0].token1;
    }
    let allowance = BigInt(0);
    if (subAccountId === 0) {
      allowance = await this.allowance(tokenInfo, this.currentPair);
    } else if (subAccountId === 1) {
      allowance = await this.allowance(
        tokenInfo,
        this.currentPair,
        subAccountId
      );
    }
    const std = Object.keys(tokenInfo[2])[0];
    let needApprove = new BigNumber(amount)
      .plus(getFee(this.tokens[tokenInfo[0].toString()]).toString(10))
      .toString(10);
    // todo approve
    needApprove = new BigNumber(amount)
      .plus(getFee(this.tokens[tokenInfo[0].toString()]).toString(10))
      .plus(getFee(this.tokens[tokenInfo[0].toString()]).toString(10))
      .toString(10);
    if (
      (std.toLocaleLowerCase() === 'drc20' ||
        std.toLocaleLowerCase() === 'icrc2' ||
        std.toLocaleLowerCase() === 'icp') &&
      new BigNumber(allowance.toString(10)).lt(needApprove)
    ) {
      const address = principalToAccountIdentifier(
        Principal.from(this.getPrincipalId)
      );
      await this.approve(
        BigInt(needApprove),
        tokenInfo[0].toString(),
        this.currentPair,
        address,
        Object.keys(tokenInfo[2])[0],
        subAccountId
      );
    }
    this.depositSuccess(amount, loading, true, subAccountId);
  }
  private async approve(
    amount: bigint,
    tokenId: string,
    currentPair: DePairs,
    address: string,
    tokenStd: string,
    subAccountId = 0
  ): Promise<boolean> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentAddress = principalToAccountIdentifier(
        Principal.fromText(principal)
      );
      if (currentAddress !== address) {
        return false;
      }
    } else {
      return false;
    }
    const spender = Principal.fromText(currentPair[0].toString());
    const currentDrc20Token = new DRC20TokenService();
    if (tokenStd.toLocaleLowerCase() === PairTokenStdMenu.dip20) {
      try {
        const res = await currentDrc20Token.approve(tokenId, spender, amount);
        if (
          (
            res as {
              Ok: bigint;
            }
          ).Ok
        ) {
          // this.tokenAllowance[currentPair[0].toString()][tokenId] = amount;
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
        return false;
      }
    } else if (
      tokenStd.toLocaleLowerCase() === PairTokenStdMenu.icrc2 ||
      tokenStd.toLocaleLowerCase() === PairTokenStdMenu.icp
    ) {
      try {
        const res = await currentDrc20Token.icrc2_approve(
          tokenId,
          {
            owner: spender,
            subaccount: []
          },
          amount,
          [fromSubAccountId(subAccountId)]
        );
        if (
          (
            res as {
              Ok: bigint;
            }
          ).Ok
        ) {
          // this.tokenAllowance[currentPair[0].toString()][tokenId] = amount;
          return true;
        } else {
          const err = Object.keys(
            (
              res as {
                Err: ApproveError;
              }
            ).Err
          )[0];
          this.$message.error(err);
          return false;
        }
      } catch (e) {
        return false;
      }
    } else {
      try {
        const res = await currentDrc20Token.drc20Approve(
          amount,
          [],
          spender.toString(),
          [],
          subAccountId,
          tokenId
        );
        if (
          (
            res as {
              ok: Txid;
            }
          ).ok
        ) {
          // this.tokenAllowance[currentPair[0].toString()][tokenId] = amount;
          return true;
        } else {
          this.$message.error((res as TxnResultErr).err.message);
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  }
  private async allowance(
    tokenInfo: SwapTokenInfo,
    currentPair: DePairs,
    subaccountId = 0
  ): Promise<bigint> {
    const tokenStd = Object.keys(tokenInfo[2])[0];
    const tokenId = tokenInfo[0].toString();
    const currentPairId = currentPair[0].toString();
    if (tokenStd === 'icrc1' || tokenStd === 'cycles') {
      return BigInt(0);
    }
    const currentDrc20Token = new DRC20TokenService();
    const spender = currentPairId;
    const principal = localStorage.getItem('principal');
    if (principal) {
      let account = principalToAccountIdentifier(Principal.fromText(principal));
      if (tokenStd === 'drc20') {
        if (subaccountId === 1) {
          account = principalToAccountIdentifier(
            Principal.fromText(principal),
            new Uint8Array(fromSubAccountId(subaccountId))
          );
        }
        return await currentDrc20Token.drc20_allowance(
          account,
          spender,
          tokenId
        );
      } else if (tokenStd === 'dip20') {
        return await currentDrc20Token.allowance(
          tokenId,
          Principal.fromText(principal),
          Principal.fromText(currentPairId)
        );
      } else if (
        tokenStd === 'icrc2' ||
        tokenStd.toLocaleLowerCase() === 'icp'
      ) {
        let subaccount = [];
        if (subaccountId === 1) {
          subaccount = [fromSubAccountId(subaccountId)];
        }
        const res = await currentDrc20Token.icrc2_allowance(tokenId, {
          account: {
            owner: Principal.fromText(principal),
            subaccount: subaccount
          },
          spender: {
            owner: Principal.fromText(currentPairId),
            subaccount: []
          }
        });
        return res.allowance;
      }
    }
  }
  private async depositSuccess(
    amount: string,
    loading,
    isToken = true,
    subAccountId: number
  ): Promise<void> {
    let token;
    if (this.isToken0) {
      token = { token0: null };
    } else {
      token = { token1: null };
    }
    const address = principalToAccountIdentifier(
      Principal.from(this.getPrincipalId)
    );
    await this.deposit(
      address,
      this.currentPair,
      token,
      BigInt(amount),
      subAccountId
    );
    this.setTokenBalance(this.currentPair[1][0].canisterId.toString());
    this.setTokenBalance(this.currentPair[1][0].canisterId.toString(), 1);
    this.$refs.addedTokens.init();
    if (isToken) {
      (this.$refs as any).transferToken.visibleTransfer = false;
    } else {
      (this.$refs as any).transferIcp.visibleTransfer = false;
    }
    loading.close();
    this.$message.success('Deposit Success');
  }
  private async deposit(
    address: string,
    currentPair: DePairs,
    token: { token0: null } | { token1: null },
    amount: bigint,
    subAccount = 0
  ): Promise<void | string> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentAddress = principalToAccountIdentifier(
        Principal.fromText(principal)
      );
      if (currentAddress !== address) {
        return 'ErrAddress';
      }
    } else {
      return 'ErrAddress';
    }
    const dexId = currentPair[0].toString();
    await this.ICDexService.deposit(dexId, token, amount, subAccount);
  }
  private showTraderAccounts(): void {
    this.pairListPage = 1;
    this.spinning = true;
    this.getPairs().then(() => {
      this.getTokenBalance();
    });
    this.traderAccountsModal = true;
  }
  private async getPairs(): Promise<void> {
    if (this.pairList.length) {
      return;
    }
    const res = await this.ICSwapRouterService.getPairs(['icdex']);
    if (res && res.data) {
      const pairList = (res.data as Array<TrieListData1>).sort(
        (a: TrieListData1, b: TrieListData1) =>
          new BigNumber(b[1].score1.toString(10))
            .plus(b[1].score2.toString(10))
            .plus(b[1].score3.toString(10))
            .minus(a[1].score1.toString(10))
            .minus(a[1].score2.toString(10))
            .minus(a[1].score3.toString(10))
            .toNumber()
      );
      const pairs = [];
      pairList.forEach((pair) => {
        const score = BigInt(
          new BigNumber(pair[1].score1.toString(10))
            .plus(pair[1].score2.toString(10))
            .plus(pair[1].score3.toString(10))
            .toString(10)
        );
        const newPair = Object.assign({}, { ...pair[1] }, { ...pair[1].pair });
        const currentPair: [...TrieListData, { main: boolean; pro: boolean }] =
          [pair[0], [newPair, score], { main: false, pro: false }];
        const mainAccount = this.getPrincipalId;
        this.ICDexService.accountSetting(
          pair[1].pair.canisterId.toString(),
          mainAccount
        ).then((res) => {
          this.$set(
            currentPair[2],
            'main',
            res.accountSetting.enKeepingBalance
          );
        });
        const proAccount = principalToAccountIdentifier(
          Principal.fromText(this.getPrincipalId),
          new Uint8Array(fromSubAccountId(1))
        );
        this.ICDexService.accountSetting(
          pair[1].pair.canisterId.toString(),
          proAccount
        ).then((res) => {
          this.$set(currentPair[2], 'pro', res.accountSetting.enKeepingBalance);
        });
        this.pairList.push(currentPair);
        const token0 = pair[1].pair.token0[0].toString();
        const token0Std = pair[1].pair.token0[2];
        const token1 = pair[1].pair.token1[0].toString();
        const token1Std = pair[1].pair.token1[2];
        if (!pairs.includes(token0)) {
          pairs.push(token0);
          if (!this.tokens[token0]) {
            getTokenInfo(Principal.fromText(token0), token0Std).then((info) => {
              this.$set(this.tokens, token0, info);
            });
          }
        }
        if (!pairs.includes(token1)) {
          pairs.push(token1);
          if (!this.tokens[token1]) {
            getTokenInfo(Principal.fromText(token1), token1Std).then((info) => {
              this.$set(this.tokens, token1, info);
            });
          }
        }
      });
    } else {
      this.pairList = [];
    }
  }
  private async getTokenBalance(): Promise<void> {
    this.spinning = true;
    const currentPairs = this.pairList.slice(
      (this.pairListPage - 1) * 10,
      this.pairListPage * 10
    );
    const promiseValue = [];
    currentPairs.forEach((pair) => {
      promiseValue.push(
        this.setTokenBalance(pair[1][0].canisterId.toString()),
        this.setTokenBalance(pair[1][0].canisterId.toString(), 1)
      );
    });
    await Promise.all(promiseValue);
    this.spinning = false;
  }
  private onWithdraw(pair, isToken0 = true): void {
    let subaccountId = 0;
    let tokenId = pair[1][0].token0[0].toString();
    if (!isToken0) {
      tokenId = pair[1][0].token1[0].toString();
    }
    const decimals = this.tokens[tokenId].decimals;
    let balance = new BigNumber(
      this.mainTokensBalance[pair[1][0].canisterId.toString()].token0.available
    )
      .div(10 ** decimals)
      .toString(10);
    if (!isToken0) {
      balance = new BigNumber(
        this.mainTokensBalance[
          pair[1][0].canisterId.toString()
        ].token1.available
      )
        .div(10 ** decimals)
        .toString(10);
    }
    if (this.currentWalletMenu === 'proWallet') {
      subaccountId = 1;
      balance = new BigNumber(
        this.proTokensBalance[pair[1][0].canisterId.toString()].token0.available
      )
        .div(10 ** decimals)
        .toString(10);
      if (!isToken0) {
        balance = new BigNumber(
          this.proTokensBalance[
            pair[1][0].canisterId.toString()
          ].token1.available
        )
          .div(10 ** decimals)
          .toString(10);
      }
    }
    let std = Object.keys(pair[1][0].token0[2])[0];
    if (!isToken0) {
      std = Object.keys(pair[1][0].token1[2])[0];
    }
    let standard;
    if (std.toLocaleLowerCase() === 'icp') {
      standard = 'ICP';
    } else if (std.toLocaleLowerCase() === 'drc20') {
      standard = 'DRC20';
    } else if (std.toLocaleLowerCase() === 'icrc1') {
      standard = 'ICRC-1';
    } else if (std.toLocaleLowerCase() === 'icrc2') {
      standard = 'ICRC-2';
    } else {
      return;
    }
    const currentToken = Object.assign(new AddTokenItemClass(), {
      balance: balance,
      canisterId: tokenId,
      decimals: decimals,
      name: this.tokens[tokenId].name,
      symbol: this.tokens[tokenId].symbol,
      standard: standard
    });
    this.currentPair = pair;
    (this.$refs as any).withdrawToken.init(
      currentToken,
      isToken0,
      subaccountId
    );
  }
  private async withdrawSuccess(): Promise<void> {
    this.setTokenBalance(this.currentPair[1][0].canisterId.toString());
    this.setTokenBalance(this.currentPair[1][0].canisterId.toString(), 1);
    this.$refs.addedTokens.init();
  }
  private async setTokenBalance(
    pairId: string,
    subaccountId = 0
  ): Promise<void> {
    const currentICDexService = new ICDexService();
    const res = await currentICDexService.accountBalance(pairId, subaccountId);
    if (res) {
      if (subaccountId === 0) {
        this.$set(this.mainTokensBalance, pairId, {
          token0: {
            available: res.keepingBalance.token0.available.toString(10),
            locked: res.keepingBalance.token0.locked.toString(10)
          },
          token1: {
            available: res.keepingBalance.token1.available.toString(10),
            locked: res.keepingBalance.token1.locked.toString(10)
          }
        });
      } else if (subaccountId === 1) {
        this.$set(this.proTokensBalance, pairId, {
          token0: {
            available: res.keepingBalance.token0.available.toString(10),
            locked: res.keepingBalance.token0.locked.toString(10)
          },
          token1: {
            available: res.keepingBalance.token1.available.toString(10),
            locked: res.keepingBalance.token1.locked.toString(10)
          }
        });
      }
    }
  }
  private changeWalletMenu(menu: 'wallet' | 'proWallet'): void {
    this.currentWalletMenu = menu;
  }
  private pairListPageChange(page: number): void {
    this.pairListPage = page;
    this.getTokenBalance();
  }
  private pageChange(page: number): void {
    this.extPage = page - 1;
  }
  private getExtInfo(val: Array<Array<number>>): any {
    if (val && val.length) {
      return JSON.parse(Buffer.from(val[0]).toString());
    }
    return {};
  }
  private async getTokensExt(): Promise<void> {
    this.nftSpinning = true;
    try {
      const res = await this.NftService.tokens_ext();
      const tokensExt = (
        res as {
          ok: TokensExt;
        }
      ).ok;
      if (tokensExt && tokensExt.length) {
        this.tokensExt = tokensExt;
      } else {
        this.tokensExt = [];
      }
    } catch (e) {
    }
    this.nftSpinning = false;
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
      this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    }
  }
  private async refreshTokens(): Promise<void> {
    this.refreshTokensLoading = true;
    await this.$refs.addedTokens.init();
    this.refreshTokensLoading = false;
  }
  private async refreshCycles(): Promise<void> {
    this.refreshBalanceLoading = true;
    await this.getWallets(false);
    this.wallets.forEach((wallet, index) => {
      this.$refs[`cyclesWallet${index}`][0].init();
    });
    this.refreshBalanceLoading = false;
  }
  private setDefaultSuccess(): void {
    this.getWallets();
  }
  private openNotification(): void {
    const step1 = this.getPrincipalId + '-cw0';
    const step2 = this.getPrincipalId + '-cw1';
    if (localStorage.getItem(step1) || localStorage.getItem(step2)) {
      this.createWalletFromLocal();
    }
  }
  private async createWalletFromLocal(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      text: 'Error creating wallet, trying to retry for you.',
      background: 'rgba(0, 0, 0, 0.6)'
    });
    await checkAuth();
    const step1 = this.getPrincipalId + '-cw0';
    const step2 = this.getPrincipalId + '-cw1';
    try {
      if (localStorage.getItem(step1)) {
        const walletArg = JSON.parse(localStorage.getItem(step1));
        const cyclesWalletRequest: CreateCyclesWalletArgs = {
          nonce: BigInt(walletArg.nonce),
          txid: walletArg.txid,
          createCanisterArgs: {
            cycles: BigInt(walletArg.cycles),
            settings: {
              controller: [],
              freezing_threshold: [],
              memory_allocation: [],
              compute_allocation: [],
              controllers: [[Principal.fromText(this.getPrincipalId)]]
            }
          }
        };
        const walletResult = await this.ICLighthouseService.createCyclesWallet(
          cyclesWalletRequest
        );
        const walletResultOk = (
          walletResult as { Ok: { canister_id: Principal } }
        ).Ok;
        if (walletResultOk) {
          const canisterId = walletResultOk.canister_id;
          const step2 = this.getPrincipalId + '-cw1';
          localStorage.setItem(step2, canisterId.toString());
          await this.manageWallet(canisterId);
          localStorage.removeItem(step2);
          this.$notification.close('cw');
        } else {
          const Err = (walletResult as { Err: string }).Err;
          if (Err.includes('wallet has been created')) {
            this.$message.error(`${Err}, please contact administrator`);
          } else {
            this.$message.error(Err);
          }
        }
        localStorage.removeItem(step1);
      } else {
        const walletCanisterId = localStorage.getItem(step2);
        await this.manageWallet(Principal.fromText(walletCanisterId));
        localStorage.removeItem(step2);
        this.$notification.close('cw');
      }
      loading.close();
    } catch (e) {
      this.$message.error(toHttpError(e).message);
      loading.close();
    }
  }
  private showFaucet(): void {
    this.faucetModal = true;
  }
  private onAddToken(): void {
    this.$refs.addedTokens.visible = true;
  }
  public async getNotice(): Promise<void> {
    const res = await this.ICLighthouseService.getNotice();
  }
  public afterNftClose(): void {
    this.$refs.transferNFTForm.resetFields();
  }
  public afterClose(): void {
    this.$refs.manageWalletForm.resetFields();
  }
  public topUpSuccess(): void {
    this.getBalance();
    // this.$refs.cyclesWallet.getWalletBalance();
  }
  private getICPBalance(): void {
    this.getBalance();
  }
  private addTokenSuccess(): void {
    this.$refs.addedTokens.getTokens(true);
  }
  public async getAddressBook(): Promise<void> {
    await this.ICLighthouseService.getAddressBookItems();
  }
  public async getEthConnect(): Promise<void> {
    // if (this.isMetaMaskInstalled) {
    //   const ethConnect = await this.ICLighthouseService.getEthConnectItems();
    //   const account = await getEthereumAccount();
    //   const ethAccount = ethConnect.find((eth) => {
    //     return eth.ethAddress === account;
    //   });
    //   if (ethAccount) {
    //     this.ethAccount = account.slice(0, 6) + '....' + account.slice(-4);
    //   } else {
    //     this.ethAccount = '';
    //   }
    // }
  }
  public async createWalletSuccess(walletId: Principal): Promise<void> {
    /// this.getWallets();
    const address = principalToAccountIdentifier(
      Principal.fromText(this.getPrincipalId)
    );
    this.wallets.push({
      walletId: walletId,
      address: address,
      isDefault: false
    });
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const flag = needConnectPlug([walletId.toString()]);
    const NeedconnectInfinity = await needConnectInfinity([
      walletId.toString()
    ]);
    if (
      (priList[this.getPrincipalId] === 'Plug' ||
        priList[this.getPrincipalId] === 'SignerPlug') &&
      flag
    ) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      const connectPlug = new ConnectPlug();
      this.$info({
        content: 'cycles wallet need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          connectPlug.addWhitelist(walletId.toString()).then(() => {
            _that.getBalance();
          });
        }
      });
    } else if (
      priList[this.getPrincipalId] === 'Infinity' &&
      NeedconnectInfinity
    ) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      const connectInfinity = new ConnectInfinity();
      this.$info({
        content: 'cycles wallet need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          connectInfinity.addWhitelist(walletId.toString()).then(() => {
            _that.getBalance();
          });
        }
      });
    } else {
      if ((window as any).icx) {
        await addIcxWhitelist(walletId.toString());
      }
      this.getBalance();
    }
  }
  private showTransferToken(NFTIndex: bigint): void {
    this.NFTIndex = Number(NFTIndex);
    this.visibleTransferNFT = true;
  }
  private async transferNFT(): Promise<void> {
    this.$refs.transferNFTForm.validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        try {
          let to: User;
          let notify: boolean;
          if (validatePrincipal(this.transferNFTForm.to.trim())) {
            to = {
              principal: Principal.fromText(this.transferNFTForm.to.trim())
            };
            notify = true;
          } else {
            to = {
              address: this.transferNFTForm.to.trim()
            };
            notify = false;
          }
          const transferRequest: TransferNFTRequest = {
            from: {
              address: this.account
            },
            subaccount: [],
            to: to,
            token: getTokenIdentifier(NFT_CANISTER_ID, this.NFTIndex),
            memo: [],
            notify: notify,
            amount: BigInt(1)
          };
          if (isPlug()) {
            const transfer = {
              idl: NFTIdl,
              canisterId: NFT_CANISTER_ID,
              methodName: 'transfer',
              args: [transferRequest],
              onSuccess: async (res) => {
                this.transferNFTSuccess(res);
                loading.close();
              },
              onFail: () => {
                loading.close();
              }
            };
            const plugIc = (window as any).ic.plug;
            const res = await plugIc.batchTransactions([transfer]);
          } else if (isInfinity()) {
            const transfer = {
              idl: NFTIdl,
              canisterId: NFT_CANISTER_ID,
              methodName: 'transfer',
              args: [transferRequest],
              onSuccess: async (res) => {
                this.transferNFTSuccess(res);
                loading.close();
              },
              onFail: () => {
                loading.close();
              }
            };
            const Ic = (window as any).ic.infinityWallet;
            const res = await Ic.batchTransactions([transfer]);
          } else {
            const res = await this.NftService.transfer(transferRequest);
            this.transferNFTSuccess(res);
            loading.close();
          }
        } catch (e) {
          loading.close();
        }
      }
    });
  }
  private transferNFTSuccess(res: TransferNFTResponse): void {
    const response = Object.keys(res)[0];
    if (response === 'ok') {
      this.$message.success('Transfer NFT Success');
    } else {
      const err = (res as { err: TransferNFTResponseErr }).err;
      const errType = Object.keys(err)[0];
      if (errType === 'Other') {
        this.$message.error(
          (
            err as {
              Other: string;
            }
          ).Other
        );
      } else {
        this.$message.error(errType);
      }
    }
    this.visibleTransferNFT = false;
    this.getTokensExt();
  }
  private showTopUp(walletId): void {
    this.$refs.ledger.showTopUp(walletId);
  }
  private removeWalletSuccess(index): void {
    // this.wallets.splice(index, 1);
    this.getWallets();
  }
  public onManageWallet(): void {
    this.visibleManageWallet = true;
  }
  public manageWalletSubmit(): void {
    this.$refs.manageWalletForm.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        let loading;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        try {
          const priList = JSON.parse(localStorage.getItem('priList')) || {};
          const flag = needConnectPlug([this.manageWalletForm.wallet]);
          const NeedConnectInfinity = await needConnectInfinity([
            this.manageWalletForm.wallet
          ]);
          if (
            (priList[this.getPrincipalId] === 'Plug' ||
              priList[this.getPrincipalId] === 'SignerPlug') &&
            flag
          ) {
            const connectPlug = new ConnectPlug();
            this.$info({
              content: 'cycles wallet need to be connected to the plug.',
              class: 'connect-plug',
              icon: 'connect-plug',
              okText: 'Confirm',
              onOk() {
                connectPlug
                  .addWhitelist(_that.manageWalletForm.wallet)
                  .then(async (isConnect) => {
                    if (!isConnect) {
                      return;
                    }
                    loading = _that.$loading({
                      lock: true,
                      background: 'rgba(0, 0, 0, 0.5)'
                    });
                    try {
                      await _that.walletService.getWalletBalance(
                        _that.manageWalletForm.wallet
                      );
                      await _that.manageWallet(
                        Principal.fromText(_that.manageWalletForm.wallet)
                      );
                    } catch (e) {
                    }
                    loading.close();
                  });
              }
            });
          } else if (
            priList[this.getPrincipalId] === 'Infinity' &&
            NeedConnectInfinity
          ) {
            const connectInfinity = new ConnectInfinity();
            this.$info({
              content: 'cycles wallet need to be connected to the Infinity.',
              class: 'connect-plug',
              icon: 'connect-plug',
              okText: 'Confirm',
              onOk() {
                connectInfinity
                  .addWhitelist(_that.manageWalletForm.wallet)
                  .then(async (isConnect) => {
                    if (!isConnect) {
                      return;
                    }
                    loading = _that.$loading({
                      lock: true,
                      background: 'rgba(0, 0, 0, 0.5)'
                    });
                    try {
                      await _that.walletService.getWalletBalance(
                        _that.manageWalletForm.wallet
                      );
                      await _that.manageWallet(
                        Principal.fromText(_that.manageWalletForm.wallet)
                      );
                    } catch (e) {
                    }
                    loading.close();
                  });
              }
            });
          } else {
            loading = this.$loading({
              lock: true,
              background: 'rgba(0, 0, 0, 0.5)'
            });
            if ((window as any).icx) {
              const isConnect = await addIcxWhitelist(
                this.manageWalletForm.wallet
              );
              if (!isConnect) {
                loading && loading.close();
                return;
              }
            }
            await this.walletService.getWalletBalance(
              this.manageWalletForm.wallet
            );
            await this.manageWallet(
              Principal.fromText(this.manageWalletForm.wallet)
            );
            loading && loading.close();
          }
        } catch (e) {
          loading && loading.close();
          if (toHttpError(e).message.includes('Only a controller')) {
            this.$message.error('You must be the cycles wallet controller');
          } else {
            this.$message.error(toHttpError(e).message);
          }
        }
      }
    });
  }
  public async manageWallet(wallet: Principal): Promise<void> {
    try {
      await this.ICLighthouseService.manageWallet(wallet, {
        add: null
      });
      this.$message.success('Bind wallet Success');
      this.getWallets();
      // const address = principalToAccountIdentifier(
      //   Principal.fromText(this.getPrincipalId)
      // );
      // this.wallets.push({ walletId: wallet, address: address });
      const priList = JSON.parse(localStorage.getItem('priList')) || {};
      const flag = needConnectPlug([wallet.toString()]);
      const needConnectInfinity1 = await needConnectInfinity([
        wallet.toString()
      ]);
      if (
        (priList[this.getPrincipalId] === 'Plug' ||
          priList[this.getPrincipalId] === 'SignerPlug') &&
        flag
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        const connectPlug = new ConnectPlug();
        this.$info({
          content: 'cycles wallet need to be connected to the plug.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          onOk() {
            connectPlug.addWhitelist(wallet.toString()).then(() => {
              _that.visibleManageWallet = false;
            });
          }
        });
      } else if (
        priList[this.getPrincipalId] === 'Infinity' &&
        needConnectInfinity1
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        const connectInfinity = new ConnectInfinity();
        this.$info({
          content: 'cycles wallet need to be connected to the Infinity.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          onOk() {
            connectInfinity.addWhitelist(wallet.toString()).then(() => {
              _that.visibleManageWallet = false;
            });
          }
        });
      } else {
        if ((window as any).icx) {
          await addIcxWhitelist(wallet.toString());
        }
        this.visibleManageWallet = false;
      }
      // this.getWallets();
    } catch (e) {
    }
  }
  private createWalletWithAccount(): void {
    this.chooseCreateWallet = false;
    this.getBalance();
    this.$refs.createWallet.init();
  }
  private createWalletWithWallet(): void {
    this.chooseCreateWallet = false;
    this.currentWallet = this.wallets[0];
    let maxCycles = this.wallets[0].cycles;
    this.wallets.forEach((wallet, index) => {
      if (new BigNumber(wallet.cycles).gt(maxCycles)) {
        this.currentWallet = wallet;
        maxCycles = wallet.cycles;
      }
      if (index === this.wallets.length - 1) {
        this.$refs.cyclesCreateWallet.init();
      }
    });
  }
  public onCreateWallet(): void {
    if (this.wallets.length) {
      this.chooseCreateWallet = true;
    } else {
      this.getBalance();
      this.$refs.createWallet.init();
    }
  }
  public async getWallets(isInit = true): Promise<void> {
    if (isInit) {
      this.walletSpinning = true;
    }
    try {
      const wallets = await this.ICLighthouseService.getWallets();
      let obj = {};
      this.wallets = wallets.reduce((cur, next) => {
        obj[next.walletId.toString()]
          ? ''
          : (obj[next.walletId.toString()] = true && cur.push(next));
        return cur;
      }, []);
    } catch (e) {
    }
    this.walletSpinning = false;
    this.connectPlug();
  }
  private async connectPlug(): Promise<void> {
    const promise = await Promise.all([
      this.ICLighthouseService.getTokens(),
      this.ckETHMinterService.getCkTokens(),
      this.ckETHMinterDfiService.get_minter_info(
        CK_ETH_MINTER_CANISTER_ID_TEST
      ),
      this.ckETHMinterDfiService.get_minter_info(CK_ETH_MINTER_CANISTER_ID)
    ]);
    const tokens = promise[0];
    const ckETHTokens = promise[1];
    const canisterIdsIdl = [];
    let canisterIds = [];
    this.wallets.forEach((item) => {
      const obj = {};
      obj[item.walletId.toString()] = walletIDL;
      canisterIdsIdl.push(obj);
      canisterIds.push(item.walletId.toString());
    });
    tokens.forEach((item) => {
      const obj = {};
      obj[item.canisterId.toString()] = tokenIDL;
      canisterIdsIdl.push(obj);
      canisterIds.push(item.canisterId.toString());
    });
    ckETHTokens.forEach((item) => {
      if (item && item[1] && item[1].ckLedgerId.toString()) {
        canisterIds.push(item[1].ckLedgerId.toString());
      }
    });
    if (
      promise[2] &&
      promise[2].supported_ckerc20_tokens &&
      promise[2].supported_ckerc20_tokens[0] &&
      promise[2].supported_ckerc20_tokens[0].length
    ) {
      promise[2].supported_ckerc20_tokens[0].forEach((item) => {
        if (!canisterIds.includes(item.ledger_canister_id.toString())) {
          canisterIds.push(item.ledger_canister_id.toString());
        }
      });
    }
    if (
      promise[3] &&
      promise[3].supported_ckerc20_tokens &&
      promise[3].supported_ckerc20_tokens[0] &&
      promise[3].supported_ckerc20_tokens[0].length
    ) {
      promise[3].supported_ckerc20_tokens[0].forEach((item) => {
        if (!canisterIds.includes(item.ledger_canister_id.toString())) {
          canisterIds.push(item.ledger_canister_id.toString());
        }
      });
    }
    this.pairList.forEach((item) => {
      const pair = item[1][0].canisterId.toString();
      if (!canisterIds.includes(pair)) {
        canisterIds.push(pair);
      }
    });
    canisterIds = [...new Set(canisterIds)];
    await checkAuth();
    const flag = needConnectPlug(canisterIds);
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const connectInfinity = await needConnectInfinity(canisterIds);
    if (
      (priList[this.getPrincipalId] === 'Plug' ||
        priList[this.getPrincipalId] === 'SignerPlug') &&
      flag &&
      this.$route.name === 'Account'
    ) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      // const h = this.$createElement;
      this.$info({
        content: 'Cycles wallet and tokens need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(canisterIds);
        }
      });
    } else if (
      priList[this.getPrincipalId] === 'Infinity' &&
      connectInfinity &&
      this.$route.name === 'Account'
    ) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      // const h = this.$createElement;
      this.$info({
        content:
          'Cycles wallet and tokens need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity(canisterIds);
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
    }
  }
  //Created check function to see if the MetaMask extension is installed
  public isMetaMaskInstalled(): boolean {
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
  public async connectMetaMask(): Promise<void> {
    if (!this.isMetaMaskInstalled()) {
      this.metaMaskVisible = true;
    } else {
      try {
        // Will open the MetaMask UI
        // You should disable this button while the request is pending!
        await ethereum.request({ method: 'eth_requestAccounts' });
        const account = await getEthereumAccount();
        const msgParams = {
          domain: {
            // Defining the chain aka Rinkeby testnet or Ethereum Main Net
            chainId: 1,
            // Give a user friendly name to the specific contract you are signing for.
            name: 'Connect',
            // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
            // Just let's you know the latest version. Definitely make sure the field name is correct.
            version: '1'
          },
          // Defining the message signing data content.
          message: {
            /*
					 - Anything you want. Just a JSON Blob that encodes the data you want to send
					 - No required fields
					 - This is DApp Specific
					 - Be as explicit as possible when building out the message schema.
					*/
            contents: 'Confirm to bind Eth account to IC account',
            ETHAccount: account,
            ICAccount: this.account
          },
          // Refers to the keys of the *types* object below.
          primaryType: 'Mail' as const,
          types: {
            // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
            EIP712Domain: [
              { name: 'name', type: 'string' },
              { name: 'version', type: 'string' },
              { name: 'chainId', type: 'uint256' },
              { name: 'verifyingContract', type: 'address' }
            ],
            // Refer to PrimaryType
            Mail: [
              { name: 'contents', type: 'string' },
              { name: 'ETHAccount', type: 'string' },
              { name: 'ICAccount', type: 'string' }
            ]
          }
        };
        const signature = await ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [account, JSON.stringify(msgParams)]
        });
        const recovered = recoverTypedSignature({
          data: msgParams,
          signature: signature,
          version: SignTypedDataVersion.V4
        });
        if (recovered === account) {
          this.manageEthConnect(account, signature);
        } else {
          this.$message.error(
            'Failed to verify signer when comparing ' +
              signature +
              ' to ' +
              account
          );
        }
      } catch (error) {
      }
    }
  }
  public manageEthConnect(account: string, signCode: string): void {
    this.ICLighthouseService.manageEthConnect(account, signCode, {
      add: null
    }).then((res) => {
      if (res) {
        this.getEthConnect();
        this.$message.success('Connect MetaMask Success');
      }
    });
  }
  public async addAddressBook(principal: PrincipalString): Promise<void> {
    const address = await encryptMessage(
      principalToAccountIdentifier(Principal.fromText(principal)),
      this.getIdentity.toJSON()[1]
    );
    await manageAddressBook(this.ICLighthouseService, { add: null }, address);
  }
  // public async getInfo(): Promise<void> {
  //   this.principal = localStorage.getItem('principal');
  // }
}
</script>
<style scoped lang="scss">
.wallet-main {
  margin-top: 80px;
  padding-bottom: 20px;
}
.wallet-header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  .base-font-title-io {
    color: #52b7c3;
  }
  .wallet-info {
    display: flex;
    align-items: center;
    margin-right: 25px;
    > div {
      display: flex;
      align-items: center;
    }
  }
  .wallet-info-type {
    margin-right: 50px;
    color: #636c73;
    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
      margin: 5px;
    }
  }
  .wallet-item-account {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    height: 40px;
  }
  .wallet-item-account-item {
    display: flex;
    align-items: center;
    height: 20px;
  }
}
.eth-connect-account {
  display: flex;
  align-items: center;
  .eth-connect-account-svg {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    overflow: hidden;
    padding: 0;
    margin: 0 5px 0 0;
    background-color: rgb(241, 158, 2);
  }
}
.account-header {
  display: flex;
}
.account-main {
  display: flex;
  margin-top: 20px;
}
.account-header-main {
  width: 340px;
}
.account-header-main-button {
  display: flex;
  margin-left: 20px;
  button {
    width: 160px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.account-header-item {
  display: flex;
  align-items: center;
  width: 330px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px;
  span {
    &:first-child {
      flex-shrink: 0;
    }
  }
  i {
    margin-left: auto;
    font-size: 16px;
    cursor: pointer;
  }
  .account-header-item-info {
    width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    padding: 0 0 0 10px;
    font-weight: normal;
  }
}
.account-header-item-wallet {
  margin-bottom: 22px;
}
.manage-wallet-modal {
  button {
    width: 100%;
  }
}
.wallet-item {
  margin-bottom: 25px;
  border-radius: 10px;
  background: #141b23;
  box-sizing: border-box;
  border: 1px solid #313b46;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  color: #e7eaf1;
  padding: 20px 25px;
  &.wallet-item-no-border {
    border: none;
    box-shadow: none;
  }
}
.account-identicon-img {
  width: 40px;
  height: 40px;
  margin-left: 5px;
  border-radius: 20px;
  opacity: 0.8;
}
.wallet-item-bottom {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
}
.wallet-item-table {
  width: 100%;
  padding: 0;
  table {
    width: 100%;
  }
}
.wallet-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #adb3c4;
  div {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
  i {
    cursor: pointer;
  }
  button {
    margin-left: 10px;
    &:first-child {
      margin-left: auto;
    }
    i {
      margin-right: 5px;
    }
  }
}
.no-wallet {
  width: 100%;
  text-align: center;
  line-height: 100px;
}
.choose-create-wallet {
  padding-top: 30px;
  p {
    cursor: pointer;
    padding: 5px;
    &:hover {
      color: #51b7c3;
    }
  }
}
.account-setting {
  margin-left: 5px;
  cursor: pointer;
}
.operation-popover {
  width: 350px;
  padding-bottom: 15px;
  color: #727a87;
}
.wallet-item-table-nft {
  min-height: 40px;
  margin-top: 20px;
}
.nft-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
  li {
    width: 165px;
    margin: 0 15px 15px 0;
    border: 1px solid #313b46;
    &:nth-child(5n + 1) {
      margin-left: 0;
    }
    &:nth-child(5n) {
      margin-right: 0;
    }
    .ext-info {
      font-size: 12px;
      padding-top: 5px;
    }
    .ext-transfer {
      padding-bottom: 5px;
      color: #1996c4;
      cursor: pointer;
    }
    img {
      width: 165px;
      height: 165px;
      object-fit: contain;
    }
    div {
      text-align: center;
      line-height: 1.5;
    }
  }
}
.nft-main-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.no-nft-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  color: #adb3c4;
}
.ic-token-item {
  padding-top: 20px;
  border-top: 1px solid #383e4e;
}
.wallet-header-menu {
  margin-bottom: 10px;
  font-size: 20px;
  li {
    margin-right: 20px;
    padding-bottom: 5px;
    border-bottom: 1px solid transparent;
    cursor: pointer;
    &.active {
      border-color: #51b7c3;
    }
  }
}
.operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 120px;
  color: #1996c4;
  i {
    margin-right: 5px;
    font-size: 12px;
  }
  .operation-name {
    margin-right: 10px;
    cursor: pointer;
    white-space: nowrap;
    &.disabled {
      color: #adb3c4;
      cursor: not-allowed;
    }
  }
}
.balance-left {
  display: inline-block;
  width: 62px;
}
.icsns-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 470px;
  margin: 60px auto 40px;
  background: #232730;
  border-radius: 30px;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 40px;
    font-size: 16px;
    color: #51b7c3;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 25px;
    &.active {
      background: #51b7c3;
      border-color: #51b7c3;
      color: #ffffff;
    }
  }
}
.pc-show {
  display: block;
}
.h5-show {
  display: none;
}
@media screen and (max-width: 768px) {
  .pc-show {
    display: none;
  }
  .h5-show {
    display: block;
  }
  .icsns-menu {
    width: calc(100% - 20px);
    margin: 20px auto 40px;
    padding: 0 5px;
    li {
      font-size: 14px;
    }
  }
  .wallet-main {
    margin-top: 20px;
    padding: 0 10px 20px 10px;
  }
  .wallet-header {
    flex-direction: column;
    align-items: flex-start;
    .wallet-info {
      flex-direction: column;
      align-items: flex-start;
      margin-left: 0;
      margin-top: 10px;
    }
  }
  .wallet-item-table {
    overflow: auto;
    font-size: 12px;
    &.wallet-item-table-cycles {
      overflow: hidden;
    }
  }
  .wallet-title {
    flex-direction: column;
    align-items: flex-start;
    > div,
    > button {
      margin-left: 0;
      margin-top: 10px;
    }
  }
  .wallet-item {
    width: 100%;
    padding: 20px 15px;
  }
}
</style>
