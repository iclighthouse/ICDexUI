<template>
  <div class="tokens-main">
    <div class="token-wrap-common">
      <button
        v-if="getPrincipalId"
        type="button"
        @click="showCreateToken"
        class="create-token"
      >
        <a-icon v-show="loading" type="loading" />Create Token
      </button>
      <a-spin :spinning="tableSpinning">
        <table>
          <thead>
            <tr>
              <th class="name">Token</th>
              <th class="token-id">Token ID</th>
              <th class="total-supply">TotalSupply</th>
              <th class="gas">Gas</th>
              <th class="metadata">Metadata</th>
              <th class="cycles">Cycles</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(token, index) in tokens" :key="index">
              <td class="name">
                <div>
                  <img v-if="token.logo" :src="token.logo" alt="" />
                  <dl>
                    <dt>{{ token.symbol }}</dt>
                    <dd>{{ token.name }}</dd>
                  </dl>
                </div>
              </td>
              <td class="token-id">
                <a
                  :href="`https://ic.house/token/${token.tokenId.toString()}`"
                  target="_blank"
                  class="token-id-rocks"
                  rel="nofollow noreferrer noopener"
                  ><copy-account
                    :front="4"
                    :account="token.tokenId.toString()"
                    :is-copy="false"
                    copyText="Token ID"
                  ></copy-account
                ></a>
              </td>
              <td class="total-supply">
                {{
                  token.totalSupply
                    | bigintToFloat(
                      Number(token.decimals),
                      Number(token.decimals)
                    )
                }}
              </td>
              <td class="gas">{{ token.gas | filterGas(token) }}</td>
              <td class="metadata">
                <div
                  class="metadata-item"
                  v-for="(metadata, index) in token.metadata"
                  :key="index"
                >
                  <div
                    class="metadata-item-info"
                    v-if="metadata.name !== 'logo'"
                  >
                    <span v-show="!metadata.content">
                      <a-icon v-if="metadata.name === 'webUrl'" type="global" />
                      <a-icon
                        v-if="metadata.name === 'twitter'"
                        type="twitter"
                      />
                      <svg
                        style="margin-bottom: -2px"
                        v-if="metadata.name === 'medium'"
                        t="1641868703609"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="3423"
                        width="14"
                        height="14"
                        fill="currentColor"
                      >
                        <path
                          d="M544 512c0 149.98-114.84 272-256 272S32 661.98 32 512s114.84-272 256-272 256 122.02 256 272z m416-256a32 32 0 0 0-32 32v448a32 32 0 0 0 64 0V288a32 32 0 0 0-32-32z m-224 0c-22.732 0-65.6 11.04-97.296 85.004C618.904 387.204 608 447.932 608 512s10.904 124.8 30.704 170.996C670.404 756.956 713.268 768 736 768s65.6-11.04 97.296-85.004C853.096 636.796 864 576.068 864 512s-10.904-124.8-30.704-170.996C801.596 267.044 758.732 256 736 256z"
                          p-id="3424"
                        ></path>
                      </svg>
                      <svg
                        style="margin-bottom: -2px"
                        v-if="metadata.name === 'forum'"
                        t="1641868970469"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="4309"
                        width="14"
                        height="14"
                        fill="currentColor"
                      >
                        <path
                          d="M896 256l-85.333333 0 0 384L256 640l0 85.333333c0 25.6 17.066667 42.666667 42.666667 42.666667l469.333333 0 170.666667 170.666667L938.666667 298.666667C938.666667 273.066667 921.6 256 896 256zM725.333333 512 725.333333 128c0-25.6-17.066667-42.666667-42.666667-42.666667L128 85.333333C102.4 85.333333 85.333333 102.4 85.333333 128l0 597.333333 170.666667-170.666667 426.666667 0C708.266667 554.666667 725.333333 537.6 725.333333 512z"
                          p-id="4310"
                        ></path>
                      </svg>
                    </span>
                    <a
                      v-show="metadata.content"
                      :href="metadata.content"
                      target="_blank"
                      rel="nofollow noreferrer noopener"
                    >
                      <a-icon v-if="metadata.name === 'webUrl'" type="global" />
                      <a-icon
                        v-if="metadata.name === 'twitter'"
                        type="twitter"
                      />
                      <svg
                        v-if="metadata.name === 'medium'"
                        t="1641868703609"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="3423"
                        width="14"
                        height="14"
                        style="margin-bottom: -2px"
                        fill="currentColor"
                      >
                        <path
                          d="M544 512c0 149.98-114.84 272-256 272S32 661.98 32 512s114.84-272 256-272 256 122.02 256 272z m416-256a32 32 0 0 0-32 32v448a32 32 0 0 0 64 0V288a32 32 0 0 0-32-32z m-224 0c-22.732 0-65.6 11.04-97.296 85.004C618.904 387.204 608 447.932 608 512s10.904 124.8 30.704 170.996C670.404 756.956 713.268 768 736 768s65.6-11.04 97.296-85.004C853.096 636.796 864 576.068 864 512s-10.904-124.8-30.704-170.996C801.596 267.044 758.732 256 736 256z"
                          p-id="3424"
                        ></path>
                      </svg>
                      <svg
                        v-if="metadata.name === 'forum'"
                        t="1641868970469"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="4309"
                        width="14"
                        height="14"
                        style="margin-bottom: -2px"
                        fill="currentColor"
                      >
                        <path
                          d="M896 256l-85.333333 0 0 384L256 640l0 85.333333c0 25.6 17.066667 42.666667 42.666667 42.666667l469.333333 0 170.666667 170.666667L938.666667 298.666667C938.666667 273.066667 921.6 256 896 256zM725.333333 512 725.333333 128c0-25.6-17.066667-42.666667-42.666667-42.666667L128 85.333333C102.4 85.333333 85.333333 102.4 85.333333 128l0 597.333333 170.666667-170.666667 426.666667 0C708.266667 554.666667 725.333333 537.6 725.333333 512z"
                          p-id="4310"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </td>
              <td class="cycles">
                <span v-if="token.isController || token.isICTokenController"
                  >{{ token.tokenStatus.cycles | bigintToFloat }} TCycles</span
                >
                <span v-else>Unknow</span>
              </td>
              <td class="operation" align="center">
                <div class="operation">
                  <a-dropdown
                    :trigger="['click']"
                    overlayClassName="operation-dropdown"
                    placement="bottomCenter"
                  >
                    <div>Operation&nbsp;<a-icon type="caret-down" /></div>
                    <!--<button type="button">
                      Operation&nbsp;<a-icon
                        type="caret-down"
                        style="margin-right: 0"
                      />
                    </button>-->
                    <a-menu slot="overlay">
                      <a-menu-item @click="receiveCycles(token)"
                        >Add Cycles
                      </a-menu-item>
                      <a-menu-item
                        v-if="token.isController || !token.isICTokenController"
                        @click="
                          modifyOrUpdateControllers(token, index, 'Update')
                        "
                        >Update Controllers</a-menu-item
                      >
                      <a-menu-item
                        v-else
                        @click="
                          modifyOrUpdateControllers(token, index, 'Modify')
                        "
                        >Modify Controllers</a-menu-item
                      >
                      <a-menu-item
                        v-if="token.owner === getPrincipalId"
                        @click="modifyOrUpdateOwner(token, 'Update')"
                        >Update Owner</a-menu-item
                      >
                      <a-menu-item
                        v-if="token.owner === icTokenCanisterId"
                        @click="modifyOrUpdateOwner(token, 'Modify')"
                        >Modify Owner</a-menu-item
                      >
                      <a-menu-item @click="handleTokenStatus(token)"
                        >Token Status</a-menu-item
                      >
                      <a-menu-item @click="update(token)">Upgrade</a-menu-item>
                      <a-menu-item
                        v-if="token.owner === getPrincipalId"
                        @click="handleUpdateMetadata(token)"
                        >Update Metadata</a-menu-item
                      >
                      <a-menu-item
                        v-if="showAddToken(token)"
                        @click="addToken(token)"
                        >Add to wallet</a-menu-item
                      >
                      <a-menu-item
                        v-if="token.owner === getPrincipalId"
                        @click="handleDeleteToken(token, index)"
                        >Delete Token</a-menu-item
                      >
                    </a-menu>
                  </a-dropdown>
                </div>
                <!--<a-popover trigger="click" placement="bottom">
                  <template slot="content" class="operation-popover">
                    <button @click="receiveCycles(token)">Add Cycles</button>
                    <button
                      v-if="token.isController || !token.isICTokenController"
                      @click="modifyOrUpdateControllers(token, index, 'Update')"
                    >
                      <span>Update Controllers</span>
                    </button>
                    <button
                      v-else
                      @click="modifyOrUpdateControllers(token, index, 'Modify')"
                    >
                      <span>Modify Controllers</span>
                    </button>
                    <button
                      v-if="token.owner === principalId"
                      @click="modifyOrUpdateOwner(token, 'Update')"
                    >
                      <span>Update Owner</span>
                    </button>
                    <button
                      v-if="token.owner === icTokenCanisterId"
                      @click="modifyOrUpdateOwner(token, 'Modify')"
                    >
                      <span>Modify Owner</span>
                    </button>
                    <button @click="handleTokenStatus(token)">
                      <span>Token Status</span>
                    </button>
                    <button
                      v-if="token.owner === principalId"
                      @click="handleUpdateMetadata(token)"
                    >
                      <span>Update Metadata</span>
                    </button>
                    <button v-if="showAddToken(token)" @click="addToken(token)">
                      <span>Add to wallet</span>
                    </button>
                    <button
                      v-if="token.owner === principalId"
                      @click="handleDeleteToken(token, index)"
                    >
                      <span>delete Token</span>
                    </button>
                  </template>
                  <button>Edit</button>
                </a-popover>-->
                <!--<button>Edit</button>-->
              </td>
            </tr>
            <tr v-if="!tokens.length">
              <td colspan="7">
                <div class="empty">No Tokens</div>
              </td>
            </tr>
          </tbody>
        </table>
      </a-spin>
    </div>
    <a-modal
      v-model="tokenStatusVisible"
      centered
      title="Token Status"
      width="650px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <a-spin :spinning="spinning">
        <div class="token-status-list">
          <span>status:</span
          ><span
            class="token-status"
            :class="currentToken.tokenStatus.status | filterStatus"
            >{{ currentToken.tokenStatus.status | filterStatus }}</span
          >
        </div>
        <div class="token-status-list">
          <span>controllers:</span>
          <div v-if="currentToken.tokenStatus.settings.controllers">
            <span
              v-for="(controller, index) in currentToken.tokenStatus.settings
                .controllers"
              :key="index"
              >{{ controller }}</span
            >
          </div>
        </div>
        <div class="token-status-list">
          <span>module hash:</span
          ><span>{{
            currentToken.tokenStatus.module_hash | moduleHashToHexString
          }}</span>
        </div>
        <div class="token-status-list">
          <span>cycles:</span
          ><span>{{ currentToken.tokenStatus.cycles | filterCycles }}</span>
        </div>
        <div class="token-status-list">
          <span>memory size:</span
          ><span>{{ currentToken.tokenStatus.memory_size }}</span>
        </div>
        <div class="token-status-list">
          <span>freezing threshold:</span
          ><span>{{
            currentToken.tokenStatus.settings.freezing_threshold
          }}</span>
        </div>
        <div class="token-status-list">
          <span>memory allocation:</span
          ><span>{{
            currentToken.tokenStatus.settings.memory_allocation
          }}</span>
        </div>
        <div class="token-status-list">
          <span>compute allocation:</span
          ><span>{{
            currentToken.tokenStatus.settings.compute_allocation
          }}</span>
        </div>
      </a-spin>
    </a-modal>
    <a-modal
      v-model="updateControllersVisible"
      centered
      :title="modelTitle"
      width="700px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="updateControllersAfterClose"
    >
      <div class="controller-main">
        <p>Specify the new controllers of the token.</p>
        <div class="controller-wrap">
          <div v-if="oldControllers.length">
            <div
              class="controller-list"
              v-for="(controller, index) in oldControllers"
              :key="controller"
            >
              <div v-if="controller === '7hdtw-jqaaa-aaaak-aaccq-cai'">
                Blackhole: ({{ controller }})
              </div>
              <div v-if="controller === currentToken.tokenId.toString()">
                TokenId: ({{ controller }})
              </div>
              <div v-if="controller === 'y2b5k-gqaaa-aaaak-aacqq-cai'">
                Factory: ({{ controller }})
              </div>
              <div v-if="controller === getPrincipalId">
                Your: ({{ controller }})
              </div>
              <div
                v-if="
                  controller !== 'y2b5k-gqaaa-aaaak-aacqq-cai' &&
                  controller !== '7hdtw-jqaaa-aaaak-aaccq-cai' &&
                  controller !== currentToken.tokenId.toString() &&
                  controller !== getPrincipalId
                "
              >
                {{ controller }}
              </div>
              <button
                class="margin-left-auto"
                type="button"
                @click="deleteController(index)"
              >
                <a-icon type="minus" />
              </button>
            </div>
          </div>
          <div
            class="controller-list"
            v-for="(controller, index) in controllers"
            :key="index"
          >
            <a-input
              autocomplete="off"
              placeholder="controller"
              v-model="controllers[index]"
            />
            <button
              v-if="index < controllers.length - 1"
              type="button"
              @click="deleteController(index)"
              class="margin-left-auto"
            >
              <a-icon type="minus" />
            </button>
            <button
              v-else
              type="button"
              @click="addController"
              class="margin-left-auto"
            >
              <a-icon type="plus" />
            </button>
          </div>
        </div>
        <button
          type="button"
          class="update-controllers-button primary large-primary"
          @click="onchangeControllers"
        >
          {{ modelTitle }}
        </button>
      </div>
    </a-modal>
    <a-modal
      v-model="updateMetadataVisible"
      centered
      title="Update Metadata"
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <a-row :gutter="24">
        <a-col
          :span="item.name === 'logo' ? 24 : 12"
          v-for="(item, index) in currentMetadata"
          :key="index"
        >
          <a-form-model-item :label="item.name" :prop="item.name">
            <div v-if="item.name === 'logo'" class="create-token-logo">
              <input
                type="file"
                accept="image/*"
                @change="onchangeFile($event, item)"
              />
              <img v-if="item.content" :src="item.content" alt="" />
              <a-icon v-else class="token-plus-icon" type="plus" />
            </div>
            <a-input
              v-else
              v-model="item.content"
              autocomplete="off"
              :placeholder="item.name"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item>
            <button
              type="button"
              class="w100 primary large-primary"
              @click="updateMetadata"
            >
              Update Metadata
            </button>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      v-model="updateOwnerVisible"
      centered
      :title="ownerModelTitle"
      width="550px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <div class="controller-main">
        <p>Specify the new owner of the token.</p>
        <a-input autocomplete="off" placeholder="Token owner" v-model="owner" />
        <button
          type="button"
          class="update-controllers-button primary large-primary"
          @click="onchangeOwner"
        >
          {{ ownerModelTitle }}
        </button>
      </div>
    </a-modal>
    <a-modal
      v-model="receiveVisible"
      centered
      width="550px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <ul class="receive-cycles">
        <li @click="receiveCyclesFromIcp">Receive cycles from icp</li>
        <li @click="receiveCyclesFromWallet">
          Receive cycles from cycles wallet
        </li>
      </ul>
    </a-modal>
    <a-modal
      v-model="insufficientVisible"
      width="500px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <p>
        Insufficient balance. A minimum of 100.01 ICL is required to create a
        token.
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
      v-model="allowanceVisible"
      width="600px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="delete-modal"
    >
      <p>
        Required to allow the smart contract to spend your ICL token as a
        fee(100 ICL / creating a token)
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
    <a-modal
      v-model="deleteVisible"
      width="400px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <p>Are your sure delete this token?</p>
      <div class="delete-button">
        <button type="button" @click="deleteVisible = false">Cancel</button>
        <button type="button" class="default" @click="deleteToken">
          Confirm
        </button>
      </div>
    </a-modal>
    <top-up
      ref="topUp"
      :balance="balance"
      :identity="identity"
      :type="topUpType"
      @topUpSuccess="topUpSuccess"
    ></top-up>
    <wallet-send-cycles
      :identity="identity"
      :type="sendCyclesType"
      ref="walletSendCycles"
      @sendCyclesSuccess="sendCyclesSuccess"
    ></wallet-send-cycles>
    <a-modal
      v-model="createTokenVisible"
      title="Create Token"
      centered
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="create-Token-modal"
      :after-close="createTokenAfterClose"
    >
      <!--<div class="create-token-approve" v-if="isMinAllowance">
        <span @click="showApprove"
          >Required to allow the smart contract to spend your ICL token as a
          fee</span
        >
        (100 ICL / creating a token)
      </div>-->
      <a-form-model
        :model="createTokenForm"
        ref="createTokenForm"
        :rules="createTokenRules"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="TokenName" prop="tokenName">
              <a-input v-model="createTokenForm.tokenName" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="symbol">
              <template slot="label"
                >Symbol&nbsp;<span class="label-tip">(main unit symbol)</span>
              </template>
              <a-input v-model="createTokenForm.symbol" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="totalSupply">
              <template slot="label"
                >TotalSupply&nbsp;<span class="label-tip">(main units)</span>
              </template>
              <a-input
                :key="createTokenForm.decimals"
                v-model="createTokenForm.totalSupply"
                autocomplete="off"
                min="0"
                type="text"
                v-only-float="createTokenForm.decimals"
                placeholder="0.00"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item class="decimals-form-item" prop="decimals">
              <template slot="label"
                >Decimals<a-tooltip placement="top">
                  <template slot="title" class="ant-form-item-required1">
                    <span>means 1 main unit = 10^Decimals smallest units.</span>
                  </template>
                  <a-icon
                    class="decimals-question-circle"
                    type="question-circle"
                  />
                </a-tooltip>
              </template>
              <a-input
                v-only-number
                v-model="createTokenForm.decimals"
                autocomplete="off"
              />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-model-item label="Gas" prop="gas">
              <a-select
                v-model="createTokenForm.gasType"
                class="dissolve-delay-time-item"
                @change="onchange"
              >
                <a-select-option
                  v-for="(item, index) in gasMenu"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>-->
          <a-col :span="12">
            <a-form-model-item v-show="!isFee" prop="gasNum">
              <template slot="label">
                Fee<span class="label-tip"
                  >&nbsp;({{
                    createTokenForm.gasType === 'token'
                      ? 'Float, main units'
                      : createTokenForm.gasType === 'cycles'
                      ? 'Float, TCycles'
                      : ''
                  }})</span
                >
              </template>
              <a-input
                v-show="createTokenForm.gasType === 'token'"
                :key="createTokenForm.decimals"
                v-model="createTokenForm.gasNum"
                autocomplete="off"
                type="text"
                v-only-float="createTokenForm.decimals"
                min="0"
                placeholder="0.00"
              />
              <a-input
                v-show="createTokenForm.gasType === 'cycles'"
                v-model="createTokenForm.gasNum"
                autocomplete="off"
                type="text"
                v-only-float="12"
                min="0"
                placeholder="0.00"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <p>Metadata:</p>
          </a-col>
          <a-col
            :span="item.name === 'logo' ? 24 : 12"
            v-for="(item, index) in createTokenForm.metadata"
            :key="index"
          >
            <a-form-model-item :label="item.name" :prop="item.name">
              <div v-if="item.name === 'logo'" class="create-token-logo">
                <input
                  type="file"
                  accept="image/*"
                  @change="onchangeFile($event, item)"
                />
                <img v-if="item.content" :src="item.content" alt="" />
                <a-icon v-else class="token-plus-icon" type="plus" />
              </div>
              <a-input
                v-else
                v-model="item.content"
                autocomplete="off"
                :placeholder="item.name"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item>
              <button
                type="button"
                class="create-submit large-primary large-primary primary w100"
                @click="createToken"
              >
                Create Token
              </button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
    <approve-modal
      :isICLToken="true"
      :decimals="iclDecimals"
      ref="approve"
      @approveSuccess="approveSuccess"
    ></approve-modal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { ICTokenService } from '@/ic/ICTokens/ICTokenService';
import { ICManagementService } from '@/ic/ICManagement/ICManagementService';
import { ICLighthouseTokenService } from '@/ic/ICLighthouseToken/ICLighthouseTokenService';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import {
  Token,
  Status,
  Metadata,
  Gas,
  InitArgs,
  GasMenu,
  GasType
} from '@/ic/ICTokens/model';
import { readState } from '@/ic/readState';
import { PrincipalString } from '@/ic/common/icType';
import { SettingType } from '@/views/home/account/model';
import { UpdateSettingsRequest } from '@/ic/ICManagement/model';
import { toHttpError } from '@/ic/httpError';
import TopUp from '@/components/topUp/Index.vue';
import { IC_TOKEN_CANISTER_ID, validatePrincipal } from '@/ic/utils';
import { BalanceMixin } from '@/mixins';
import WalletSendCycles from '@/components/walletSendCycles/Index.vue';
import { TokenItem } from '@/ic/ICLighthouse/model';
import { addToken, addedTokens } from '@/ic/addToken';
import { checkAuth } from '@/ic/CheckAuth';
import ApproveModal from '@/components/approve/Index.vue';
import { namespace } from 'vuex-class';
import ConnectPlug, { needConnectPlug } from '@/ic/ConnectPlug';
import ConnectInfinity, { needConnectInfinity } from '@/ic/ConnectInfinity';
const commonModule = namespace('common');

@Component({
  name: 'Tokens',
  components: {
    ApproveModal,
    TopUp,
    WalletSendCycles
  },
  filters: {
    filterGas(val: Gas, currentToken: Token) {
      if (val) {
        const { token } = val as { token: bigint };
        if (token) {
          return `${new BigNumber(token.toString(10))
            .div(10 ** currentToken.decimals)
            .toString(10)}`;
        }
        const { cycles } = val as { cycles: bigint };
        if (cycles) {
          return `cycles:${cycles}`;
        }
        return 'noFee';
      }
      return '';
    },
    moduleHashToHexString(moduleHash: Array<Array<number>>): string {
      if (moduleHash && moduleHash.length) {
        return Buffer.from(moduleHash[0]).toString('hex');
      } else {
        return '';
      }
    },
    filterCycles(cycles: BigInt): string {
      if (cycles) {
        return (
          new BigNumber(cycles.toString(10))
            .div(10 ** 12)
            .toString(10)
            .match(/^\d+(?:\.\d{0,4})?/)[0] + 'T'
        );
      } else {
        return '';
      }
    },
    filterStatus(status: Status): string {
      if (status) {
        return Object.keys(status)[0];
      } else {
        return '';
      }
    }
  }
})
export default class extends Mixins(BalanceMixin) {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  $refs!: {
    approve;
    topUp;
    walletSendCycles;
    createTokenForm: HTMLFormElement;
  };
  private ICLighthouseService: ICLighthouseService;
  private addedTokens: Array<TokenItem> = null;
  private ICTokenService: ICTokenService;
  private ICManagementService: ICManagementService;
  private ICLighthouseTokenService: ICLighthouseTokenService;
  private updateMetadataVisible = false;
  private tokens: Array<Token> = [];
  // private principalId: PrincipalString;
  private currentToken: Token = new Token();
  private currentTokenIndex: number;
  private currentMetadata: Array<Metadata> = [];
  private spinning = false;
  private tableSpinning = false;
  private updateControllersVisible = false;
  private modelTitle = '';
  private ownerModelTitle = '';
  private owner: PrincipalString = '';
  private updateOwnerVisible = false;
  private tokenStatusVisible = false;
  private controllers: Array<string> = [''];
  private oldControllers: Array<string> = [];
  private type: SettingType;
  private icTokenCanisterId = IC_TOKEN_CANISTER_ID;
  private receiveVisible = false;
  private topUpType = '';
  private sendCyclesType = '';
  private deleteVisible = false;
  private createTokenVisible = false;
  private isFee = false;
  private allowance: bigint = null;
  private iclFee = '0';
  private iclDecimals = 8;
  private createTokenForm = {
    tokenName: '',
    symbol: '',
    totalSupply: '',
    decimals: 8,
    gasType: 'token',
    gasNum: 0,
    metadata: [
      {
        name: 'logo',
        content: ''
      },
      {
        name: 'webUrl',
        content: ''
      },
      {
        name: 'twitter',
        content: ''
      },
      {
        name: 'medium',
        content: ''
      },
      {
        name: 'forum',
        content: ''
      }
    ]
  };
  private gasMenu = Object.values(GasMenu);
  private createTokenRules = {
    tokenName: [
      { required: true, message: 'Please input tokenName', trigger: 'blur' }
    ],
    symbol: [
      { required: true, message: 'Please input symbol', trigger: 'blur' }
    ],
    totalSupply: [
      { required: true, message: 'Please input totalSupply', trigger: 'blur' }
    ],
    decimals: [
      { required: true, message: 'Please input decimals', trigger: 'blur' }
    ],
    gasNum: [
      { required: true, message: 'Please input gasNum', trigger: 'blur' }
    ]
  };
  private loading = false;
  private allowanceVisible = false;
  private insufficientVisible = false;
  // get isMinAllowance(): boolean {
  //   if (
  //     this.allowance ||
  //     (this.allowance !== null && Number(this.allowance) === 0)
  //   ) {
  //     return new BigNumber(this.allowance.toString())
  //       .div(10 ** this.iclDecimals)
  //       .lt(100);
  //   } else {
  //     return false;
  //   }
  // }
  created(): void {
    this.ICManagementService = new ICManagementService();
    this.ICTokenService = new ICTokenService();
    this.ICLighthouseService = new ICLighthouseService();
    // this.principalId = localStorage.getItem('principal');
    this.ICLighthouseTokenService = new ICLighthouseTokenService();
    if (this.getPrincipalId) {
      this.getTokens();
      this.getAddedTokens();
    }
  }
  private showApprove(): void {
    this.allowanceVisible = false;
    this.$refs.approve.visible = true;
    this.$refs.approve.approveForm.spender = IC_TOKEN_CANISTER_ID;
  }
  private approveSuccess(): void {
    // setTimeout(() => {
    //   this.getAllowance();
    // }, 500);
  }
  private async approvals(): Promise<void> {
    const principal = localStorage.getItem('principal');
    const res = await this.ICLighthouseTokenService.approvals(principal);
    const remaining = res.reduce((remaining, item) => {
      return BigInt(
        new BigNumber(remaining.toString(10)).plus(item.remaining.toString(10))
      );
    }, BigInt('0'));
    console.log(remaining);
  }
  private async getAllowance(): Promise<void> {
    this.allowance = await this.ICLighthouseTokenService.allowance(
      this.getPrincipalId
    );
  }
  private onchange(gasType: GasType): void {
    this.createTokenForm.gasNum = 0;
    this.isFee = gasType === 'noFee';
  }
  private createTokenAfterClose(): void {
    this.$refs.createTokenForm.resetFields();
  }
  private createToken(): void {
    this.$refs.createTokenForm.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        const principal = localStorage.getItem('principal');
        console.log(this.createTokenForm);
        const fee = BigInt(
          new BigNumber(this.createTokenForm.gasNum)
            .times(10 ** this.createTokenForm.decimals)
            .decimalPlaces(0, 1)
            .toString(10)
        );
        // if (this.createTokenForm.gasType === 'noFee') {
        //   gas = {
        //     noFee: null
        //   };
        // } else if (this.createTokenForm.gasType === 'token') {
        //   gas = {
        //     token: BigInt(
        //       new BigNumber(this.createTokenForm.gasNum)
        //         .times(10 ** this.createTokenForm.decimals)
        //         .decimalPlaces(0, 1)
        //         .toString(10)
        //     )
        //   };
        // } else {
        //   gas = {} as Gas;
        //   gas[this.createTokenForm.gasType] = Number(
        //     this.createTokenForm.gasNum
        //   );
        // }
        const initArgs: InitArgs = {
          fee: fee,
          decimals: Number(this.createTokenForm.decimals),
          metadata: [this.createTokenForm.metadata],
          name: [this.createTokenForm.tokenName],
          totalSupply: BigInt(
            new BigNumber(this.createTokenForm.totalSupply.toString())
              .times(10 ** this.createTokenForm.decimals)
              .decimalPlaces(0, 1)
              .toString(10)
          ),
          founder: [principal],
          symbol: [this.createTokenForm.symbol]
        };
        console.log(initArgs);
        try {
          const res = await this.ICTokenService.create(initArgs);
          this.createTokenSuccess(res.toString());
          loading.close();
          this.createTokenVisible = false;
          // this.getBalance();
        } catch (e) {
          console.log(e);
          loading.close();
        }
      }
    });
  }
  private async showCreateToken(): Promise<void> {
    this.loading = true;
    await this.getAllowance();
    console.log(this.allowance);
    if (
      this.allowance ||
      (this.allowance !== null && Number(this.allowance) === 0)
    ) {
      if (
        new BigNumber(this.allowance.toString(10))
          .div(10 ** this.iclDecimals)
          .lt(100)
      ) {
        this.allowanceVisible = true;
      } else if (new BigNumber(await this.getIclBalance()).lt(100.01)) {
        this.insufficientVisible = true;
      } else {
        this.createTokenVisible = true;
      }
    }
    this.loading = false;
    // this.createTokenVisible = true;
    // this.getAllowance();
    // this.iclDecimals = await this.ICLighthouseTokenService.getDecimals();
    // const gas = await this.ICLighthouseTokenService.gas();
    // const fee = (gas as { token: bigint }).token;
    // if (fee || fee.toString() === '0') {
    //   this.iclFee = new BigNumber(fee.toString())
    //     .div(10 ** this.iclDecimals)
    //     .toString();
    // }
  }
  private handleDeleteToken(token: Token, index: number): void {
    this.deleteVisible = true;
    this.currentToken = token;
    this.currentTokenIndex = index;
  }
  private async deleteToken(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const res = await this.ICTokenService.deleteToken(
        this.currentToken.tokenId
      );
      if (res) {
        this.$message.success('Delete Success');
        this.tokens.splice(this.currentTokenIndex, 1);
        this.deleteVisible = false;
      }
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private async getAddedTokens(): Promise<void> {
    this.addedTokens = await addedTokens();
  }
  private showAddToken(token: Token): boolean {
    if (this.addedTokens) {
      return !this.addedTokens.some(
        (item) => item.canisterId.toString() === token.tokenId.toString()
      );
    } else {
      return false;
    }
  }
  private sendCyclesSuccess(): void {
    this.tokenStatus(this.currentToken);
  }
  private async addToken(token: Token): Promise<void> {
    this.tableSpinning = true;
    const res = await addToken(
      Principal.fromText(token.tokenId.toString()),
      token.symbol,
      token.name,
      token.decimals,
      'DRC20',
      {
        add: null
      }
    );
    if (res) {
      this.$message.success('Add to wallet Success');
      this.getAddedTokens();
    }
    this.tableSpinning = false;
  }
  private receiveCyclesFromIcp(): void {
    this.topUpType = 'topUpToken';
    this.$refs.topUp.topUpForm.to = this.currentToken.tokenId.toString();
    this.$refs.topUp.visibleTopUp = true;
    this.receiveVisible = false;
  }
  private receiveCyclesFromWallet(): void {
    this.sendCyclesType = 'sendCyclesToken';
    this.$refs.walletSendCycles.sendCyclesForm.to =
      this.currentToken.tokenId.toString();
    this.$refs.walletSendCycles.visible = true;
    // this.$refs.walletSendCycles.init();
    this.receiveVisible = false;
  }
  private receiveCycles(token: Token): void {
    this.receiveVisible = true;
    this.currentToken = token;
  }
  private topUpSuccess(): void {
    this.getBalance();
    this.readState(this.currentToken);
  }
  private async getIclBalance(): Promise<string> {
    const principal = localStorage.getItem('principal');
    const ICL = await this.ICLighthouseTokenService.getBalance(principal);
    return new BigNumber(ICL.toString(10))
      .div(10 ** 8)
      .decimalPlaces(4, 1)
      .toString(10);
  }
  private onchangeFile(event: Event, item): void {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      this.$message.error('Image must smaller than 1MB!');
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt) => {
        item.content = evt.target.result;
      };
    }
    target.value = '';
  }
  private async updateMetadata(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const res = await this.ICLighthouseTokenService.setMetadata(
        this.currentMetadata,
        this.currentToken.tokenId.toString()
      );
      if (res) {
        this.currentToken.metadata = this.currentMetadata;
        this.currentMetadata.some((val) => {
          if (val.name === 'logo') {
            this.currentToken.logo = val.content;
            return true;
          }
        });
        loading.close();
        this.$message.success('Update metadata success');
        this.updateMetadataVisible = false;
      }
    } catch (e) {
      loading.close();
      console.log(e);
    }
  }
  private handleUpdateMetadata(token: Token): void {
    this.currentToken = token;
    this.currentMetadata = JSON.parse(
      JSON.stringify(this.currentToken.metadata)
    );
    this.updateMetadataVisible = true;
  }
  private handleTokenStatus(token: Token): void {
    if (token.isICTokenController || token.isController) {
      this.tokenStatusVisible = true;
      this.currentToken = token;
    } else {
      this.$message.error('Your are not the controller of this token');
    }
  }
  private onchangeControllers(): void {
    const controllers: Array<Principal> = [];
    this.controllers.forEach((item) => {
      const controller = item.replace(/(^\s*)|(\s*$)/g, '');
      if (controller) {
        controllers.push(Principal.fromText(controller));
      }
    });
    this.oldControllers.forEach((item) => {
      const controller = item.replace(/(^\s*)|(\s*$)/g, '');
      if (controller) {
        controllers.push(Principal.fromText(controller));
      }
    });
    if (this.type === 'Modify') {
      this.modifyControllers(controllers);
    } else {
      this.updateControllers(controllers);
    }
  }
  private async updateControllers(
    controllers: Array<Principal>
  ): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const request: UpdateSettingsRequest = {
        canister_id: this.currentToken.tokenId,
        settings: {
          controllers: [controllers],
          freezing_threshold: [],
          memory_allocation: [],
          compute_allocation: []
        }
      };
      const res = await this.ICManagementService.updateSettings(request);
      this.$message.success('update Controllers Success');
      this.updateControllersVisible = false;
      await this.readState(this.currentToken);
      loading.close();
    } catch (e) {
      const httpError = toHttpError(e);
      if (httpError.code === 403) {
        this.$message.error('Your are not the controller of this token');
      } else {
        console.log(e);
      }
      loading.close();
    }
  }
  private async modifyControllers(
    controllers: Array<Principal>
  ): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const res = await this.ICTokenService.modifyControllers(
        this.currentToken.tokenId,
        controllers
      );
      if (res) {
        loading.close();
        this.$message.success('Modify Controllers Success');
        this.updateControllersVisible = false;
        await this.readState(this.currentToken);
      }
    } catch (e) {
      loading.close();
      // this.spinning = false;
    }
  }
  private addController(): void {
    this.controllers.push('');
  }
  private deleteController(index: number): void {
    this.oldControllers.splice(index, 1);
    this.onchangeControllers();
  }
  private updateControllersAfterClose(): void {
    this.controllers = [''];
    this.oldControllers = [];
  }
  private async getOwner(token: Token): Promise<void> {
    // this.ICLighthouseTokenService = new ICLighthouseTokenService(
    //   this.identity,
    //   token.tokenId.toString()
    // );
    try {
      const owner = await this.ICLighthouseTokenService.getOwner(
        token.tokenId.toString()
      );
      token.owner = owner.toString();
      this.$forceUpdate();
    } catch (e) {
      console.log(e);
    }
  }
  private async readState(token: Token): Promise<void> {
    console.log(token);
    const state = await readState(token.tokenId.toString());
    console.log(token.tokenId.toString())
    console.log(state);
    if (state) {
      // isICTokenController is false, can not call TokenFactory methods
      const isICTokenController =
        state.controllers.includes(IC_TOKEN_CANISTER_ID);
      token.controllers = state.controllers;
      token.isICTokenController = isICTokenController;
      token.isController = state.controllers.includes(this.getPrincipalId);
    }
  }
  public async createTokenSuccess(tokenId: PrincipalString): Promise<void> {
    const token = new Token();
    token.tokenId = Principal.fromText(tokenId);
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const flag = needConnectPlug([tokenId]);
    const connectInfinity = await needConnectInfinity([tokenId]);
    if (priList[this.getPrincipalId] === 'Plug' && flag) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      this.$info({
        content: 'token need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          const connectPlug = new ConnectPlug();
          connectPlug.addWhitelist(tokenId).then(async () => {
            await _that.readState(token);
            _that.tokenStatus(token);
            _that.getTokenInfo(token);
            _that.tokens.unshift(token);
          });
        }
      });
    }
    if (priList[this.getPrincipalId] === 'Infinity' && connectInfinity) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      this.$info({
        content: 'token need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          const connectInfinity = new ConnectInfinity();
          connectInfinity.addWhitelist(tokenId).then(async () => {
            await _that.readState(token);
            _that.tokenStatus(token);
            _that.getTokenInfo(token);
            _that.tokens.unshift(token);
          });
        }
      });
    } else {
      await this.readState(token);
      this.tokenStatus(token);
      this.getTokenInfo(token);
      this.tokens.unshift(token);
    }
  }
  private getTokenInfo(token: Token): void {
    this.getOwner(token);
    this.getMetadata(token);
    this.getGas(token);
    this.getName(token);
    this.getSymbol(token);
    this.getDecimals(token);
    this.totalSupply(token);
    console.log(token);
  }
  private async getName(token: Token): Promise<void> {
    // this.ICLighthouseTokenService = new ICLighthouseTokenService(
    //   this.identity,
    //   token.tokenId.toString()
    // );
    token.name = await this.ICLighthouseTokenService.getName(
      token.tokenId.toString()
    );
    this.$forceUpdate();
  }
  private async getSymbol(token: Token): Promise<void> {
    // this.ICLighthouseTokenService = new ICLighthouseTokenService(
    //   this.identity,
    //   token.tokenId.toString()
    // );
    token.symbol = await this.ICLighthouseTokenService.getSymbol(
      token.tokenId.toString()
    );
    this.$forceUpdate();
  }
  private async totalSupply(token: Token): Promise<void> {
    // this.ICLighthouseTokenService = new ICLighthouseTokenService(
    //   this.identity,
    //   token.tokenId.toString()
    // );
    let totalSupply = await this.ICLighthouseTokenService.totalSupply(
      token.tokenId.toString()
    );
    // let decimals = await this.getDecimals(token);
    // totalSupply = BigInt(
    //   new BigNumber(totalSupply.toString()).div(
    //     new BigNumber(10).pow(decimals.toString())
    //   )
    // );
    token.totalSupply = totalSupply;
    this.$forceUpdate();
  }
  private async getDecimals(token: Token): Promise<number> {
    // this.ICLighthouseTokenService = new ICLighthouseTokenService(
    //   this.identity,
    //   token.tokenId.toString()
    // );
    token.decimals = await this.ICLighthouseTokenService.getDecimals(
      token.tokenId.toString()
    );
    return token.decimals;
  }
  private async getTokens(): Promise<void> {
    this.tableSpinning = true;
    let tokens = await this.ICTokenService.getTokens(
      Principal.fromText(this.getPrincipalId)
    );
    tokens = tokens.slice().reverse();
    const promiseAllValue = [];
    for (let i = 0; i < tokens.length; i++) {
      this.tokens[i] = new Token();
      this.tokens[i].tokenId = tokens[i];
      promiseAllValue.push(this.readState(this.tokens[i]));
    }
    await Promise.all(promiseAllValue);
    this.tableSpinning = false;
    for (let i = 0; i < this.tokens.length; i++) {
      const currentToken = this.tokens[i];
      if (currentToken.isICTokenController) {
        this.tokenStatus(currentToken);
      } else {
        this.canisterStatus(currentToken);
      }
      this.getTokenInfo(currentToken);
    }
  }
  private async getGas(token: Token): Promise<void> {
    token.gas = await this.ICLighthouseTokenService.gas(
      token.tokenId.toString()
    );
  }
  private async getMetadata(token: Token): Promise<void> {
    // this.ICLighthouseTokenService = new ICLighthouseTokenService(
    //   this.identity,
    //   token.tokenId.toString()
    // );
    const metadata = await this.ICLighthouseTokenService.metadata(
      token.tokenId.toString()
    );
    token.metadata = metadata;
    metadata.some((val) => {
      if (val.name === 'logo') {
        token.logo = val.content;
        return true;
      }
    });
    this.$forceUpdate();
  }
  private async canisterStatus(token: Token): Promise<void> {
    if (token.isController) {
      token.tokenStatus = await this.ICManagementService.canisterStatus(
        token.tokenId
      );
      this.$forceUpdate();
    }
  }
  private async tokenStatus(token: Token): Promise<void> {
    token.tokenStatus = await this.ICTokenService.tokenStatus(token.tokenId);
    this.$forceUpdate();
  }
  private async modifyOrUpdateControllers(
    tokenInfo: Token,
    index: number,
    type: SettingType
  ): Promise<void> {
    this.type = type;
    this.currentToken = tokenInfo;
    this.currentTokenIndex = index;
    this.modelTitle = this.type + ' Controllers';
    if (tokenInfo.controllers.length) {
      this.oldControllers = [...tokenInfo.controllers];
    } else {
      this.oldControllers = [];
    }
    this.controllers = [''];
    this.updateControllersVisible = true;
  }
  private async modifyOrUpdateOwner(
    token: Token,
    type: SettingType
  ): Promise<void> {
    this.type = type;
    this.currentToken = token;
    this.owner = this.currentToken.owner;
    this.ownerModelTitle = this.type + ' Owner';
    this.updateOwnerVisible = true;
  }
  private onchangeOwner(): void {
    console.log(this.currentToken.owner);
    if (!validatePrincipal(this.owner)) {
      this.$message.error('Invalid principal');
      return;
    }
    if (this.type === 'Modify') {
      this.modifyOwner();
    } else {
      this.updateOwner();
    }
  }
  private async updateOwner(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    // this.ICLighthouseTokenService = new ICLighthouseTokenService(
    //   this.identity,
    //   this.currentToken.tokenId.toString()
    // );
    try {
      const res = this.ICLighthouseTokenService.changeOwner(
        Principal.fromText(this.owner),
        this.currentToken.tokenId.toString()
      );
      if (res) {
        loading.close();
        this.$message.success('Update Owner Success');
        this.updateOwnerVisible = false;
        this.currentToken.owner = this.owner;
      }
    } catch (e) {
      loading.close();
      console.log(e);
    }
  }
  private async modifyOwner(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const res = await this.ICTokenService.modifyOwner(
        this.currentToken.tokenId,
        Principal.fromText(this.owner)
      );
      if (res) {
        loading.close();
        this.$message.success('Modify Owner Success');
        this.updateOwnerVisible = false;
        this.currentToken.owner = this.owner;
      }
    } catch (e) {
      loading.close();
      console.log(e);
    }
  }
  private async update(token: Token): Promise<void> {
    if (token.controllers.includes(IC_TOKEN_CANISTER_ID)) {
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      console.log(token);
      try {
        await this.ICTokenService.update(token.tokenId, {
          fee: (token.gas as { token: bigint }).token,
          decimals: token.decimals,
          metadata: [token.metadata],
          name: [token.name],
          totalSupply: token.totalSupply,
          founder: [],
          symbol: [token.symbol]
        });
        this.$message.success('Success');
      } catch (e) {
        console.error(e);
        this.$message.error('Error');
      }
      loading.close();
    } else {
      this.$info({
        content: `You need to add the factory(${IC_TOKEN_CANISTER_ID}) to the controllers`,
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        centered: true,
        onOk() {
          //
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.token-wrap-common {
  width: 100%;
  border-radius: 10px;
  background: #141b23;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  padding: 20px 25px;
  overflow: auto;
}
.token-status-list {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  .token-status {
    color: red;
    &.running {
      color: #1996c4;
    }
  }
  > span:first-child {
    display: inline-block;
    width: 140px;
    flex-shrink: 0;
  }
  span {
    word-break: break-all;
    line-height: 1.1;
  }
  > div {
    display: flex;
    flex-direction: column;
  }
}
.controller-main {
  .controller-wrap {
    max-height: 440px;
    overflow: auto;
    button {
      padding: 5px;
    }
  }
  p {
    font-size: 16px;
    text-align: center;
    margin-bottom: 10px;
  }
  .update-controllers-button {
    width: 100%;
    margin-top: 30px;
  }
}
.controller-list {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  > span {
    display: inline-block;
    width: 32px;
    flex-shrink: 0;
    text-align: center;
  }
  input {
    margin-right: 15px;
  }
  button {
    height: 32px;
    width: 32px;
    flex-shrink: 0;
    padding: 0;
  }
}

.tokens-title {
  margin-top: 20px;
  font-size: 20px;
}
.token-list {
  position: relative;
  width: 300px;
  height: 150px;
  margin: 20px 40px 0 0;
  padding: 15px;
  border-radius: 3px;
  background: #001529;
  color: #fff;
  .token-more {
    position: absolute;
    right: 10px;
    top: 13px;
    font-size: 26px;
    color: #1996c4;
    cursor: pointer;
  }
  p {
    line-height: 1.6;
    font-size: 14px;
    a {
      display: flex;
      align-items: center;
    }
    svg {
      margin-left: 5px;
    }
  }
  a {
    color: #1996c4;
  }
}
.receive-cycles {
  margin-top: 40px;
  li {
    cursor: pointer;
    margin-bottom: 10px;
    font-size: 16px;
    transition: all 0.3s;
    &:hover {
      color: #1996c4;
    }
  }
}
.token-plus-icon {
  color: #fff;
}
.create-token {
  width: 140px;
  font-size: 14px;
  margin-bottom: 10px;
  i {
    margin-right: 5px;
    font-size: 14px;
  }
}
.create-token-approve {
  span {
    color: #1996c4;
    cursor: pointer;
  }
}
.metadata-item {
  display: inline-block;
  a,
  span {
    padding: 0 3px;
  }
}
.label-tip {
  font-size: 13px;
  opacity: 0.7;
}
.decimals-form-item {
  ::v-deep .ant-form-item-label {
    width: 100%;
    text-align: left;
  }
  ::v-deep label {
    display: block;
    width: 100%;
  }
}
.decimals-question-circle {
  position: absolute;
  right: 0;
  top: 13px;
}
.operation {
  color: #1996c4;
  cursor: pointer;
}
.delete-modal {
  ::v-deep .ant-modal-body {
    padding-top: 20px;
  }
}
</style>
