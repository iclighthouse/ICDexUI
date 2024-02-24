<template>
  <div class="token-main token-wrap-common">
    <a-spin :spinning="tokenSpinning">
      <table class="your-token-list">
        <thead>
          <tr>
            <th
              class="pointer"
              style="padding-left: 0 !important"
              @click="onSort('name')"
            >
              <span class="sort-table-main">
                <span>Name</span>
                <span class="sort-table">
                  <a-icon
                    :class="{ active: sortType === 'nameUp' }"
                    type="caret-up"
                  />
                  <a-icon
                    :class="{ active: sortType === 'nameDown' }"
                    type="caret-down"
                  />
                </span>
              </span>
            </th>
            <th class="pc-show">Standard</th>
            <th class="pointer" @click="onSort('balance')">
              <span class="sort-table-main">
                <span>Balance</span>
                <span class="sort-table">
                  <a-icon
                    :class="{ active: sortType === 'balanceUp' }"
                    type="caret-up"
                  />
                  <a-icon
                    :class="{ active: sortType === 'balanceDown' }"
                    type="caret-down"
                  />
                </span>
              </span>
            </th>
            <th class="small-screen">Locked</th>
            <th class="small-screen">Approvals</th>
            <th class="pc-show">Txns</th>
            <th class="small-screen">CoinSeconds</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!tokens.length">
            <td colspan="8" class="no-tokens">No Tokens</td>
          </tr>
          <tr
            v-for="(token, index) in tokens"
            :key="token.canisterId.toString()"
          >
            <td class="padding10 name">
              <a-tooltip placement="top">
                <template slot="title">
                  {{ token.canisterId.toString() }}
                </template>
                <a
                  :href="`https://ic.house/token/${token.canisterId.toString()}`"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                >
                  <div>
                    <div class="img-content">
                      <img v-if="token.logo" :src="token.logo" alt="" />
                    </div>
                    <dl>
                      <dt class="token-symbol-td">
                        {{ token.symbol }}
                      </dt>
                      <dd
                        v-if="token.name.includes('(')"
                        class="pc-show base-text-color"
                      >
                        {{ token.name | ellipsisAccount(10) }}
                      </dd>
                      <dd
                        style="font-size: 12px"
                        v-if="!token.name.includes('(')"
                        class="pc-show"
                      >
                        {{ token.name }}
                      </dd>
                    </dl>
                  </div>
                </a>
              </a-tooltip>
            </td>
            <td class="pc-show base-text-color">
              {{ token.standard }}
            </td>
            <td>
              <div class="balance-td-main">
                <dl>
                  <dt>
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span class="token-balance-span">
                          {{ token.balance | formatNum }}
                        </span>
                      </template>
                      <span
                        class="token-balance-span"
                        style="word-break: break-all"
                      >
                        {{
                          token.balance
                            | bigintToFloat(
                              Math.min(8, Number(token.decimals)),
                              0
                            )
                            | formatTokenBalance
                        }}
                      </span>
                    </a-tooltip>
                    <!--<a-icon
                      @click="refreshToken(token, index)"
                      v-show="refreshBalanceLoadingIndex !== index"
                      type="reload"
                      class="reload-icon"
                    />
                    <a-icon
                      v-show="refreshBalanceLoadingIndex === index"
                      type="loading"
                      class="reload-icon"
                    />-->
                  </dt>
                  <dd></dd>
                </dl>
              </div>
            </td>
            <td class="pc-show base-text-color">
              <div>
                <dl>
                  <dt>
                    <span v-show="token.standard === 'DRC20'">{{
                      token.lockedTxns.lockedBalance
                    }}</span>
                    <span v-show="token.standard !== 'DRC20'">-</span>
                    <a-icon
                      v-show="token.standard === 'DRC20'"
                      type="container"
                      @click="getLockTransaction(token, index)"
                    />
                  </dt>
                  <dd></dd>
                </dl>
              </div>
            </td>
            <td class="small-screen base-text-color">
              <div>
                <dl>
                  <dt>
                    <span v-show="token.standard === 'DRC20'">{{
                      token.approvals
                    }}</span>
                    <span v-show="token.standard !== 'DRC20'">-</span>
                    <a-icon
                      v-show="token.standard === 'DRC20'"
                      type="container"
                      @click="getApprovals(token, index)"
                    />
                  </dt>
                  <dd></dd>
                </dl>
              </div>
            </td>
            <td class="small-screen base-text-color">
              <div>
                <dl>
                  <dt>
                    <span v-show="token.standard === 'DRC20'">{{
                      token.transactions
                    }}</span>
                    <span v-show="token.standard !== 'DRC20'">-</span>
                    <a-icon
                      v-show="token.standard === 'DRC20'"
                      type="container"
                      @click="getTransactions(token)"
                    />
                  </dt>
                  <dd></dd>
                </dl>
              </div>
            </td>
            <td class="small-screen base-text-color">
              <div>
                <dl>
                  <dt>
                    <span
                      v-show="
                        token.standard === 'DRC20' && token && token.coinSeconds
                      "
                    >
                      {{ token.coinSeconds }}
                    </span>
                    <span v-show="token.standard !== 'DRC20'">-</span>
                  </dt>
                  <dd></dd>
                </dl>
              </div>
            </td>
            <td class="operation-td">
              <div class="operation">
                <span
                  class="operation-name pc-show"
                  @click="showReceive(token)"
                >
                  Receive
                </span>
                <span
                  @click="handleTransferToken(token, index)"
                  class="operation-name pc-show"
                >
                  Transfer
                </span>
                <div class="operation-name">
                  <a-dropdown
                    :trigger="['click']"
                    overlayClassName="operation-dropdown"
                    placement="bottomCenter"
                  >
                    <div>Operation<a-icon type="caret-down" /></div>
                    <a-menu slot="overlay">
                      <a-menu-item @click="showReceive(token)"
                        >Receive</a-menu-item
                      >
                      <a-menu-item @click="handleTransferToken(token, index)"
                        >Transfer</a-menu-item
                      >
                      <a-menu-item
                        v-if="token.standard === 'DRC20'"
                        @click="handleTransferBatchToken(token, index)"
                        >TransferBatch</a-menu-item
                      >
                      <a-menu-item
                        v-show="
                          token.standard === 'DRC20' ||
                          token.standard === 'ICRC-2'
                        "
                        @click="showApprove(token, index)"
                        >Approve</a-menu-item
                      >
                      <a-menu-item
                        v-show="token.standard === 'DRC20'"
                        @click="showLockTransfer(token, index)"
                        >LockTransfer</a-menu-item
                      >
                      <a-menu-item
                        v-if="token.canisterId.toString() !== ICLTokenId"
                        @click="onRemoveToken(token, index)"
                        >Remove</a-menu-item
                      >
                    </a-menu>
                  </a-dropdown>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </a-spin>
    <a-modal
      v-model="visible"
      centered
      title="Add Token"
      width="550px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
    >
      <a-form-model
        :model="addTokenForm"
        ref="addTokenForm"
        :rules="addTokenFormRules"
      >
        <a-form-model-item prop="tokenId">
          <template slot="label">
            Token Canister ID (<a
              href="https://github.com/iclighthouse/DRC_standards/tree/main/DRC20"
              target="_blank"
              style="color: #1996c4"
              rel="nofollow noreferrer noopener"
              >DRC20</a
            >/ICRC-1 standard tokens)
          </template>
          <!--<a-input
            v-model="addTokenForm.tokenId"
            autocomplete="off"
            placeholder="Canister ID(Principal)"
          />-->
          <a-auto-complete
            class="search-token"
            placeholder="Token Canister ID(Principal)"
            v-model="addTokenForm.tokenId"
            :allowClear="true"
            option-label-prop="label"
            @change="onChange"
            :filter-option="filterOption"
          >
            <template slot="dataSource">
              <a-select-option
                v-for="token in tokenList"
                :key="token.canisterId.toString()"
                :label="token.canisterId.toString()"
              >
                <span class="base-color-w">{{ token.symbol }}</span>
                <span>&nbsp;{{ token.canisterId.toString() }}</span>
              </a-select-option>
            </template>
          </a-auto-complete>
        </a-form-model-item>
        <a-form-model-item label="Token Standard">
          <a-select v-model="tokenStd">
            <a-select-option v-for="std in tokenStandardList" :key="std">
              {{ std }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            class="w100 mt20 primary large-primary large-primary"
            @click="addToken"
          >
            Add Token
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      v-model="approvalsModal"
      width="700px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="events-modal"
    >
      <a-table
        :locale="{
          emptyText: 'No approvals'
        }"
        :columns="columns"
        :data-source="approvals"
        :loading="approvalsLoading"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
      >
        <a
          :href="`https://ic.house/address/${currentToken.canisterId.toString()}/${arrayToString(
            spender
          )}`"
          target="_blank"
          slot="Spender"
          slot-scope="spender"
          rel="nofollow noreferrer noopener"
        >
          {{ arrayToString(spender) | ellipsisAccount }}
        </a>
        <div slot="Remaining" slot-scope="remaining">
          {{ remaining | bigintToFloat(4, Number(currentToken.decimals)) }}
        </div>
        <div class="operation-div" slot="operation" slot-scope="text">
          <div class="button-table" @click="updateApprove(text)">Update</div>
          <div class="button-table" @click="removeApprove(text)">Remove</div>
        </div>
      </a-table>
    </a-modal>
    <a-modal
      v-model="lockTransactionsModal"
      width="90%"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="events-modal"
    >
      <a-table
        :locale="{
          emptyText: 'No lock transactions'
        }"
        :columns="columnsLockTransactions"
        :data-source="lockTransactions"
        :loading="lockTransactionsLoading"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
      >
        <div slot="Txid" slot-scope="txid">
          <copy-account
            :account="arrayToString(txid)"
            :is-copy="false"
            :href="`https://ic.house/tx/${currentToken.canisterId.toString()}/${arrayToString(
              txid
            )}`"
            copyText="Txid"
          ></copy-account>
        </div>
        <!--<a
          slot="To"
          slot-scope="to"
          :href="`https://dashboard.internetcomputer.org/account/${arrayToString(
            to
          )}`"
          rel="nofollow noreferrer noopener"
          target="_blank"
          >{{ arrayToString(to) | ellipsisAccount }}</a
        >-->
        <copy-account
          slot="To"
          slot-scope="to"
          :is-copy="false"
          :href="`https://ic.house/address/${currentToken.canisterId.toString()}/${arrayToString(
            to
          )}`"
          :account="arrayToString(to)"
        ></copy-account>
        <div slot="Locked" slot-scope="locked">
          {{ locked | bigintToFloat(4, Number(currentToken.decimals)) }}
        </div>
        <div slot="Decider" slot-scope="decider">
          <copy-account
            copyText="Decider"
            :is-copy="false"
            :href="`https://ic.house/address/${currentToken.canisterId.toString()}/${arrayToString(
              decider
            )}`"
            :account="arrayToString(decider)"
          ></copy-account>
        </div>
        <div class="operation-div" slot="Operation" slot-scope="text, record">
          <div
            v-if="lockExpiration(text)"
            class="button-table"
            @click="execute(record)"
          >
            Execute
          </div>
          <div
            v-if="!showFallback(text)"
            class="button-table"
            @click="fallback(record)"
          >
            Fallback
          </div>
          <!--<button
            v-if="canFallback(text)"
            class="button-table"
            @click="fallback(record)"
          >
            Fallback
          </button>-->
        </div>
      </a-table>
    </a-modal>
    <a-modal
      v-model="transactionsModal"
      width="90%"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="events-modal"
    >
      <a-table
        :locale="{
          emptyText: 'No transactions'
        }"
        :columns="columnsTransactions"
        :data-source="transactions"
        :loading="transactionsLoading"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
      >
        <div slot="Txid" slot-scope="txid">
          <copy-account
            :account="arrayToString(txid)"
            :is-copy="false"
            :href="`https://ic.house/tx/${currentToken.canisterId.toString()}/${arrayToString(
              txid
            )}`"
            copyText="Txid"
          ></copy-account>
        </div>
        <copy-account
          slot="From"
          slot-scope="from"
          :is-copy="false"
          :href="`https://ic.house/address/${currentToken.canisterId.toString()}/${arrayToString(
            from
          )}`"
          :account="arrayToString(from)"
        ></copy-account>
        <copy-account
          slot="To"
          slot-scope="to"
          :is-copy="false"
          :href="`https://ic.house/address/${currentToken.canisterId.toString()}/${arrayToString(
            to
          )}`"
          :account="arrayToString(to)"
        ></copy-account>
        <div slot="Value" slot-scope="value">
          {{ value | bigintToFloat(4, Number(currentToken.decimals)) }}
        </div>
        <div class="operation-slot" slot="Operation" slot-scope="operation">
          {{ operation | filterOperation(currentToken) }}
        </div>
        <div slot="Data" slot-scope="data">
          <copy-account
            v-if="data.length"
            :account="arrayToString(data[0])"
            copyText="Data"
          ></copy-account>
        </div>
      </a-table>
    </a-modal>
    <transfer-token
      ref="transferToken"
      :identity="identity"
      :current-token="currentToken"
      @transferTokenSuccess="transferTokenSuccess"
    ></transfer-token>
    <transfer-batch-token
      ref="transferBatchToken"
      :identity="identity"
      :current-token="currentToken"
      @transferTokenSuccess="transferBatchTokenSuccess"
    ></transfer-batch-token>
    <receive-modal ref="receiveModal"></receive-modal>
    <approve-modal
      :type="approveType"
      :decimals="currentToken.decimals"
      :symbol="currentToken.symbol"
      :token-id="currentToken.canisterId && currentToken.canisterId.toString()"
      :spender="currentToken.canisterId && currentToken.canisterId.toString()"
      :approve-mode="currentToken.standard.includes('icrc') ? 'icrc1' : 'drc20'"
      ref="approve"
      @approveSuccess="approveSuccess"
    ></approve-modal>
    <lock-transfer
      ref="lockTransfer"
      :decimals="currentToken.decimals"
      :symbol="currentToken.symbol"
      :token-id="currentToken.canisterId && currentToken.canisterId.toString()"
      @lockTransferSuccess="lockTransferSuccess"
    ></lock-transfer>
    <execute-transfer
      ref="executeTransfer"
      :decimals="currentToken.decimals"
      :symbol="currentToken.symbol"
      :token-id="currentToken.canisterId && currentToken.canisterId.toString()"
      :locked="locked"
      :txid="currentLocked && currentLocked.txid"
      :locked-info="currentLocked && currentLocked.transaction"
      @executeTransferSuccess="executeTransferSuccess"
    ></execute-transfer>
    <a-modal
      v-model="removeVisible"
      width="380px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <p>Are your sure remove this token?</p>
      <div class="delete-button">
        <button type="button" @click="removeVisible = false">Cancel</button>
        <button type="button" class="default" @click="removeToken">
          Confirm
        </button>
      </div>
    </a-modal>
    <approve-icrc2
      ref="approveIcrc2"
      :balance="currentToken.balance"
      :token-id="currentToken.canisterId && currentToken.canisterId.toString()"
      @approveIcrc2Success="approveIcrc2Success"
    ></approve-icrc2>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { Identity } from '@dfinity/agent';
import {
  AddTokenItem,
  AddTokenItemClass,
  AddTokenStandard,
  TokenStandard
} from '../model';
import { addToken } from '@/ic/addToken';
import { validateCanister } from '@/utils/validate';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import BigNumber from 'bignumber.js';
import TransferToken from '@/components/transferToken/Index.vue';
import TransferBatchToken from '@/components/transferToken/TransferBatch.vue';
import { checkAuth } from '@/ic/CheckAuth';
import ReceiveModal from '@/components/receiveModal/Index.vue';
import ApproveModal from '@/components/approve/Index.vue';
import LockTransfer from '@/components/lockTransfer/Index.vue';
import ExecuteTransfer from '@/components/execute/Index.vue';
import {
  AccountId,
  Allowance,
  Operation,
  Time,
  Txid,
  TxnRecord,
  TxnResultErr
} from '@/ic/ICLighthouseToken/model';
import {
  formatDateToSecondUTC,
  principalToAccountIdentifier,
  toHexString
} from '@/ic/converter';
import {
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_SNS_TOKEN_CANISTER_ID,
  validatePrincipal
} from '@/ic/utils';
import { namespace } from 'vuex-class';
import ConnectPlug, {
  needConnectPlug,
  removeWhitelist
} from '@/ic/ConnectPlug';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { getTokenBalance } from '@/ic/getTokenBalance';
import { addIcxWhitelist } from '@/ic/connectIcx';
import ConnectInfinity, { needConnectInfinity } from '@/ic/ConnectInfinity';
import { getTokenLogo } from '@/ic/getTokenLogo';
import { TokenItem } from '@/ic/ICTokensScan/model';
import { ICTokensScanService } from '@/ic/ICTokensScan/ICTokensScanService';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { DeployedSns } from '@/ic/SNSWasm/model';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import ApproveIcrc2 from '@/components/approveIcrc2/Index.vue';

const commonModule = namespace('common');

@Component({
  name: 'AddedTokens',
  components: {
    ExecuteTransfer,
    LockTransfer,
    ApproveModal,
    TransferToken,
    ReceiveModal,
    TransferBatchToken,
    ApproveIcrc2
  },
  filters: {
    filterCoinSeconds(val: string): string {
      if (val) {
        if (Number(val) > 100) {
          return parseInt(val).toString(10);
        }
        return val;
      }
      return '';
    },
    filterOperation(val: Operation, token: AddTokenItem): string {
      if (val) {
        const type = Object.keys(val)[0];
        if (type === 'approve') {
          const allowance = new BigNumber(
            (
              val as {
                approve: { allowance: bigint };
              }
            ).approve.allowance.toString(10)
          )
            .div(10 ** Number(token.decimals))
            .toString(10);
          return `${type}: ${allowance}`;
        } else if (type === 'lockTransfer') {
          const lockTransfer = (
            val as {
              lockTransfer: {
                locked: bigint;
                expiration: Time;
                decider: AccountId;
              };
            }
          ).lockTransfer;
          const expiration = formatDateToSecondUTC(
            new Date(
              Number(
                new BigNumber(lockTransfer.expiration.toString(10)).div(1000000)
              )
            )
          );
          const decider = toHexString(new Uint8Array(lockTransfer.decider));
          const locked = new BigNumber(lockTransfer.locked.toString(10)).div(
            10 ** Number(token.decimals)
          );
          return `${type}: {locked: ${locked}, decider: ${decider}, expiration: ${expiration}}`;
        } else if (type === 'transfer') {
          const action = Object.keys(
            (
              val as {
                transfer: {
                  action:
                    | {
                        burn: null;
                      }
                    | {
                        mint: null;
                      }
                    | {
                        send: null;
                      };
                };
              }
            ).transfer.action
          )[0];
          return `${type}: ${action}`;
        } else if (type === 'executeTransfer') {
          const executeTransfer = (
            val as {
              executeTransfer: {
                fallback: bigint;
                lockedTxid: Txid;
              };
            }
          ).executeTransfer;
          const fallback = new BigNumber(executeTransfer.fallback.toString(10))
            .div(10 ** Number(token.decimals))
            .toString(10);
          const lockedTxid = toHexString(
            new Uint8Array(executeTransfer.lockedTxid)
          );
          return `${type}: {fallback: ${fallback}, lockedTxid: ${lockedTxid}}`;
        }
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  $refs!: {
    executeTransfer;
    lockTransfer;
    approve;
    receiveModal;
    addTokenForm: HTMLFormElement;
    transferToken: HTMLFormElement;
    transferBatchToken: HTMLFormElement;
    approveIcrc2;
  };
  @Prop()
  private identity!: Identity;
  private currentToken: AddTokenItem = new AddTokenItemClass();
  private ICLTokenId = IC_LIGHTHOUSE_TOKEN_CANISTER_ID;
  private currentIndex: number;
  private approveType = 'add';
  private visible = false;
  private removeVisible = false;
  private tokenSpinning = false;
  private tokens: Array<AddTokenItem> = [];
  private ICLighthouseService: ICLighthouseService;
  private DRC20TokenService: DRC20TokenService;
  private sortType = '';
  private addTokenForm = {
    tokenId: ''
  };
  private addTokenFormRules = {
    tokenId: [
      {
        required: true,
        message: 'Please enter Canister',
        trigger: ['blur', 'change']
      },
      { validator: validateCanister, trigger: ['blur', 'change'] }
    ]
  };
  private approvals: Array<Allowance> = [];
  private approvalsLoading = false;
  private approvalsModal = false;
  private columns = [
    {
      title: 'Spender',
      dataIndex: 'spender',
      scopedSlots: { customRender: 'Spender' }
    },
    {
      title: 'Remaining',
      dataIndex: 'remaining',
      scopedSlots: { customRender: 'Remaining' }
    },
    {
      title: '',
      key: 'operation',
      align: 'center',
      width: '120px',
      scopedSlots: { customRender: 'operation' }
    }
  ];
  private transactionsModal = false;
  private transactionsLoading = false;
  private transactions: Array<TxnRecord> = [];
  private columnsTransactions = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      customRender: (text: Time): string => {
        const timestamp = new Date(
          Number(new BigNumber(text.toString(10)).div(1000000))
        );
        return formatDateToSecondUTC(timestamp);
      }
    },
    {
      title: 'Txid',
      dataIndex: 'txid',
      scopedSlots: { customRender: 'Txid' }
    },
    {
      title: 'Nonce',
      dataIndex: 'nonce',
      customRender: (text: number, record: TxnRecord): string => {
        let caller = '';
        const principal = localStorage.getItem('principal');
        try {
          caller = principalToAccountIdentifier(Principal.fromText(principal));
        } catch (e) {
          console.log(e);
        }
        if (toHexString(new Uint8Array(record.caller)) === caller) {
          return text.toString();
        } else {
          return `(${text.toString()})`;
        }
      }
    },
    {
      title: 'From',
      dataIndex: 'transaction.from',
      scopedSlots: { customRender: 'From' }
    },
    {
      title: 'To',
      dataIndex: 'transaction.to',
      scopedSlots: { customRender: 'To' }
    },
    {
      title: 'Value',
      dataIndex: 'transaction.value',
      scopedSlots: { customRender: 'Value' }
    },
    {
      title: 'Operation',
      dataIndex: 'transaction.operation',
      scopedSlots: { customRender: 'Operation' }
    },
    {
      title: 'Data',
      dataIndex: 'transaction.data',
      scopedSlots: { customRender: 'Data' }
    }
    // ,
    // {
    //   title: 'Operation',
    //   dataIndex: 'transaction.operation',
    //   scopedSlots: { customRender: 'Operation' }
    // }
  ];
  private lockTransactionsModal = false;
  private lockTransactionsLoading = false;
  private lockTransactions: Array<TxnRecord> = [];
  private columnsLockTransactions = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      customRender: (text: Time): string => {
        const timestamp = new Date(
          Number(new BigNumber(text.toString(10)).div(1000000))
        );
        return formatDateToSecondUTC(timestamp);
      }
    },
    {
      title: 'Txid',
      dataIndex: 'txid',
      scopedSlots: { customRender: 'Txid' }
    },
    {
      title: 'Nonce',
      dataIndex: 'nonce',
      customRender: (text: number): string => {
        return text.toString(10);
      }
    },
    {
      title: 'To',
      dataIndex: 'transaction.to',
      scopedSlots: { customRender: 'To' }
    },
    {
      title: 'Locked',
      dataIndex: 'transaction.operation.lockTransfer.locked',
      scopedSlots: { customRender: 'Locked' }
    },
    {
      title: 'Decider',
      dataIndex: 'transaction.operation.lockTransfer.decider',
      scopedSlots: { customRender: 'Decider' }
    },
    {
      title: 'Expiration',
      dataIndex: 'transaction.operation.lockTransfer.expiration',
      customRender: (text: Time): string => {
        const timestamp = new Date(
          Number(new BigNumber(text.toString(10)).div(1000000))
        );
        return formatDateToSecondUTC(timestamp);
      }
    },
    {
      title: 'Operation',
      dataIndex: 'transaction.operation',
      scopedSlots: { customRender: 'Operation' }
    }
  ];
  private currentLocked: TxnRecord = null;
  private locked = '0';
  private timer = null;
  private tokenStd: TokenStandard = TokenStandard.DRC20;
  private tokenStandardList = AddTokenStandard;
  private ICTokensScanService: ICTokensScanService;
  private tokenList: Array<TokenItem> = [];
  private SNSWasmService: SNSWasmService = null;
  private listDeployedSnses: Array<DeployedSns> = [];
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
    console.log(this.timer);
  }
  created(): void {
    // this.principal = localStorage.getItem('principal');
    this.ICLighthouseService = new ICLighthouseService();
    this.DRC20TokenService = new DRC20TokenService();
    this.ICTokensScanService = new ICTokensScanService();
    this.SNSWasmService = new SNSWasmService();
    if (this.getPrincipalId) {
      this.getTokens();
      this.getTokenList();
    }
  }
  private onSort(type: string): void {
    // this.page.currentPage = 1;
    if (type === 'name') {
      if (this.sortType === 'nameDown') {
        this.sortType = 'nameUp';
      } else {
        this.sortType = 'nameDown';
      }
    } else if (type === 'balance') {
      if (this.sortType === 'balanceDown') {
        this.sortType = 'balanceUp';
      } else {
        this.sortType = 'balanceDown';
      }
    }
    this.sort();
  }
  private sort(): void {
    if (this.sortType === 'nameDown') {
      this.tokens.sort((a, b) => {
        return a.symbol.localeCompare(b.symbol);
      });
    }
    if (this.sortType === 'nameUp') {
      this.tokens.sort((a, b) => {
        return b.symbol.localeCompare(a.symbol);
      });
    }
    if (this.sortType === 'balanceDown') {
      this.tokens.sort((a, b) => {
        if (new BigNumber(b.balance).gt(a.balance)) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (this.sortType === 'balanceUp') {
      this.tokens.sort((a, b) => {
        if (new BigNumber(a.balance).gt(b.balance)) {
          return 1;
        } else {
          return -1;
        }
      });
    }
  }
  private filterOption(input: string, option): boolean {
    return (
      option.componentOptions.children[0].children[0].text
        .toUpperCase()
        .indexOf(input.toUpperCase()) >= 0 ||
      option.componentOptions.children[1].children[0].text
        .toUpperCase()
        .indexOf(input.toUpperCase()) >= 0
    );
  }
  private onChange(val): void {
    if (val && validatePrincipal(val)) {
      for (let i = 0; i < this.tokenList.length; i++) {
        if (val === this.tokenList[i].canisterId.toString()) {
          const std = this.tokenList[i].standard.split(';')[0];
          if (std.toLocaleLowerCase() === 'drc20') {
            this.tokenStd = TokenStandard.DRC20;
          }
          if (std.toLocaleLowerCase() === 'dip20') {
            this.tokenStd = TokenStandard.DIP20;
          }
          if (std.toLocaleLowerCase() === 'icrc1') {
            this.tokenStd = TokenStandard['ICRC-1'];
          }
          if (std.toLocaleLowerCase() === 'icrc2') {
            this.tokenStd = TokenStandard['ICRC-2'];
          }
        }
      }
    }
  }
  private async getTokenList(): Promise<void> {
    const tokenList = await this.ICTokensScanService.getTokenList();
    this.tokenList = tokenList.sort((a, b) => {
      return a.symbol.localeCompare(b.symbol);
    });
  }
  private async init(): Promise<void> {
    if (!this.listDeployedSnses.length) {
      this.listDeployedSnses = await this.SNSWasmService.listDeployedSnses();
    }
    const promiseValue = [];
    this.tokens.forEach((token, i) => {
      if (token.standard === TokenStandard.DRC20) {
        promiseValue.push(
          this.getBalance(token),
          this.getMetadata(token),
          this.getLocked(token),
          this.txnCount(token),
          this.getCoinSeconds(token),
          this.getApprovalsAllowance(token)
        );
      } else if (token.standard === TokenStandard.DIP20) {
        promiseValue.push(
          this.getDip20Balance(token),
          this.getDip20Metadata(token)
        );
      } else if (
        token.standard === TokenStandard['ICRC-1'] ||
        token.standard === TokenStandard['ICRC-2']
      ) {
        promiseValue.push(
          this.getICRCBalance(token),
          this.getIcrcMetadata(token)
        );
        if (token.canisterId.toString() === IC_SNS_TOKEN_CANISTER_ID) {
          this.getSNSLogo(token);
        }
      }
    });
    await Promise.all(promiseValue);
  }
  private getSNSLogo(token: AddTokenItem): void {
    this.$set(token, 'logo', require('@/assets/img/sns1.png'));
  }
  private getTokenBalanceInterval(): void {
    this.timer = window.setInterval(() => {
      setTimeout(() => {
        if (
          !this.getCheckAuth &&
          this.tokens &&
          this.tokens.length &&
          this.getPrincipalId
        ) {
          this.init();
        }
      }, 0);
    }, 30 * 1000);
  }
  private executeTransferSuccess(): void {
    this.lockTransactionsModal = false;
    setTimeout(() => {
      this.getLocked(this.tokens[this.currentIndex]);
      this.txnCount(this.tokens[this.currentIndex]);
      this.getBalance(this.tokens[this.currentIndex]);
      // this.getLockTransaction(this.currentToken, this.currentIndex);
    }, 500);
  }
  private onRemoveToken(token, index): void {
    this.currentToken = token;
    this.currentIndex = index;
    this.removeVisible = true;
  }
  private async removeToken(): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const res = await addToken(
        this.currentToken.canisterId,
        '',
        '',
        0,
        this.currentToken.standard,
        {
          del: null
        }
      );
      if (res) {
        this.$message.success('Success');
        this.removeVisible = false;
        // removeWhitelist(this.currentToken.canisterId.toString());
        loading.close();
        this.tokens.splice(this.currentIndex, 1);
      }
    } catch (e) {
      loading.close();
      console.log(e);
    }
  }
  private execute(txnRecord: TxnRecord, type?: string): void {
    if (type) {
      this.$refs.executeTransfer.type = type;
    } else {
      this.$refs.executeTransfer.type = '';
    }
    this.currentLocked = txnRecord;
    const operation = txnRecord.transaction.operation as {
      lockTransfer: {
        locked: bigint;
        expiration: Time;
        decider: AccountId;
      };
    };
    this.locked = new BigNumber(operation.lockTransfer.locked.toString(10))
      .div(10 ** Number(this.currentToken.decimals))
      .toString(10);
    this.$refs.executeTransfer.decider = operation.lockTransfer.decider;
    this.$refs.executeTransfer.form.amount = this.locked.toString();
    this.$refs.executeTransfer.visible = true;
  }
  private async fallback(txnRecord: TxnRecord): Promise<void> {
    this.execute(txnRecord, 'Fallback');
  }
  private showFallback(operation: Operation): boolean {
    const lockOperation = operation as {
      lockTransfer: {
        locked: bigint;
        expiration: Time;
        decider: AccountId;
      };
    };
    return (
      this.arrayToString(lockOperation.lockTransfer.decider) !==
        principalToAccountIdentifier(Principal.fromText(this.getPrincipalId)) &&
      new BigNumber(new Date().getTime()).lt(
        new BigNumber(lockOperation.lockTransfer.expiration.toString(10)).div(
          1000000
        )
      )
    );
  }
  private lockExpiration(operation: Operation): boolean {
    const lockOperation = operation as {
      lockTransfer: {
        locked: bigint;
        expiration: Time;
        decider: AccountId;
      };
    };
    return (
      this.arrayToString(lockOperation.lockTransfer.decider) ===
        principalToAccountIdentifier(Principal.fromText(this.getPrincipalId)) &&
      new BigNumber(new Date().getTime()).lt(
        new BigNumber(lockOperation.lockTransfer.expiration.toString(10)).div(
          1000000
        )
      )
    );
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private showReceive(token: AddTokenItem): void {
    const std = token.standard;
    const noAccount = ['dip20', 'icrc-1', 'icrc-2'];
    this.$refs.receiveModal.principal = localStorage.getItem('principal');
    this.$refs.receiveModal.visibleReceive = true;
    const hasAccount = !noAccount.includes(std.toLocaleLowerCase());
    this.$refs.receiveModal.init(hasAccount);
  }
  private showApprove(token: AddTokenItem, index: number): void {
    this.currentToken = token;
    this.currentIndex = index;
    if (token.standard === 'DRC20') {
      this.$refs.approve.visible = true;
      this.approveType = 'add';
      this.$refs.approve.approveForm.spender = '';
      this.$refs.approve.approveForm.amount = '';
    } else if (token.standard === 'ICRC-2') {
      this.$refs.approveIcrc2.init(
        Object.assign({}, this.currentToken, { tokenStd: { icrc2: null } })
      );
      console.log(this.currentToken);
    }
  }
  private showLockTransfer(token: AddTokenItem, index: number): void {
    this.currentToken = token;
    this.currentIndex = index;
    this.$refs.lockTransfer.visible = true;
  }
  private approveSuccess(): void {
    this.getApprovals(this.currentToken, this.currentIndex);
    this.getApprovalsAllowance(this.tokens[this.currentIndex]);
    this.txnCount(this.tokens[this.currentIndex]);
    this.transferTokenSuccess();
  }
  private approveIcrc2Success(): void {
    this.transferTokenSuccess();
  }
  private lockTransferSuccess(): void {
    this.getLocked(this.tokens[this.currentIndex]);
    this.txnCount(this.tokens[this.currentIndex]);
  }
  private transferTokenSuccess(): void {
    if (this.currentToken.standard === TokenStandard.DRC20) {
      this.getBalance(this.tokens[this.currentIndex]);
    } else if (this.currentToken.standard === TokenStandard.DIP20) {
      this.getDip20Balance(this.tokens[this.currentIndex]);
    } else if (
      this.currentToken.standard === TokenStandard['ICRC-1'] ||
      this.currentToken.standard === TokenStandard['ICRC-2']
    ) {
      this.getICRCBalance(this.tokens[this.currentIndex]);
    }
  }
  private handleTransferToken(token: AddTokenItem, index: number): void {
    console.log(token);
    this.currentToken = token;
    this.currentIndex = index;
    this.$refs.transferToken.init(token);
  }
  private transferBatchTokenSuccess(): void {
    if (this.currentToken.standard === TokenStandard.DRC20) {
      this.getBalance(this.tokens[this.currentIndex]);
    } else if (this.currentToken.standard === TokenStandard.DIP20) {
      this.getDip20Balance(this.tokens[this.currentIndex]);
    } else if (
      this.currentToken.standard === TokenStandard['ICRC-1'] ||
      this.currentToken.standard === TokenStandard['ICRC-2']
    ) {
      this.getICRCBalance(this.tokens[this.currentIndex]);
    }
  }
  private handleTransferBatchToken(token: AddTokenItem, index: number): void {
    this.currentToken = token;
    this.currentIndex = index;
    this.$refs.transferBatchToken.init(token);
  }
  private async txnCount(token: AddTokenItem): Promise<void> {
    try {
      const res = await this.DRC20TokenService.txnQuery(
        {
          getEvents: { owner: [this.getPrincipalId] }
        },
        token.canisterId.toString()
      );
      const transition = (res as { getEvents: Array<TxnRecord> }).getEvents;
      if (transition && transition.length) {
        const txnCount = transition.length;
        this.$set(token, 'transactions', txnCount);
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getTokens(type = false): Promise<void> {
    if (!type) {
      this.tokenSpinning = true;
    }
    try {
      const tokens = await this.ICLighthouseService.getTokens();
      if (type) {
        this.tokens = [];
      }
      let flag = false;
      let hasDefaultToken = false;
      for (let i = 0; i < tokens.length; i++) {
        const tokenId = tokens[i].canisterId.toString();
        if (tokenId === IC_LIGHTHOUSE_TOKEN_CANISTER_ID) {
          flag = true;
        }
        if (tokenId === IC_SNS_TOKEN_CANISTER_ID) {
          hasDefaultToken = true;
        }
        const principal = localStorage.getItem('principal');
        const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
        const tokensBalance = currentInfo.tokensBalance || {};
        const token: AddTokenItem = {
          ...new AddTokenItemClass(),
          ...tokens[i]
        };
        if (tokensBalance[tokenId]) {
          token.balance = new BigNumber(tokensBalance[tokenId])
            .div(10 ** Number(token.decimals))
            .decimalPlaces(Number(token.decimals), 1)
            .toString(10);
        }
        this.tokens.push(token);
        if (i === tokens.length - 1) {
          if (!flag) {
            this.addIclToken();
          }
          if (!hasDefaultToken) {
            this.addSNSToken();
          }
        }
      }
      this.init();
      if (!tokens.length) {
        this.addIclToken();
      }
    } catch (e) {
      console.log(e);
    }
    this.getTokenBalanceInterval();
    this.tokenSpinning = false;
  }
  private async addSNSToken(): Promise<void> {
    let tokenInfo = [];
    try {
      const promiseAllValue = [];
      promiseAllValue.push(
        this.DRC20TokenService.icrcName(IC_SNS_TOKEN_CANISTER_ID),
        this.DRC20TokenService.icrcSymbol(IC_SNS_TOKEN_CANISTER_ID),
        this.DRC20TokenService.icrcDecimals(IC_SNS_TOKEN_CANISTER_ID)
      );
      tokenInfo = await Promise.all(promiseAllValue);
    } catch (e) {
      console.log(e);
    }
    try {
      const res = await addToken(
        Principal.fromText(IC_SNS_TOKEN_CANISTER_ID),
        tokenInfo[1],
        tokenInfo[0],
        tokenInfo[2],
        'ICRC-1',
        {
          add: null
        }
      );
      if (res) {
        const token: AddTokenItem = {
          ...new AddTokenItemClass(),
          symbol: tokenInfo[1],
          name: tokenInfo[0],
          decimals: tokenInfo[2],
          standard: 'ICRC-1',
          canisterId: Principal.fromText(IC_SNS_TOKEN_CANISTER_ID)
        };
        this.tokens.push(token);
        this.getICRCBalance(token);
        if (token.canisterId.toString() === IC_SNS_TOKEN_CANISTER_ID) {
          this.getSNSLogo(token);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async addIclToken(): Promise<void> {
    let tokenInfo = [];
    try {
      const promiseAllValue = [];
      promiseAllValue.push(
        this.DRC20TokenService.icrcName(IC_LIGHTHOUSE_TOKEN_CANISTER_ID),
        this.DRC20TokenService.icrcSymbol(IC_LIGHTHOUSE_TOKEN_CANISTER_ID),
        this.DRC20TokenService.icrcDecimals(IC_LIGHTHOUSE_TOKEN_CANISTER_ID)
      );
      tokenInfo = await Promise.all(promiseAllValue);
    } catch (e) {
      this.$message.error('Please enter a valid tokenId');
      console.log(e);
    }
    try {
      const res = await addToken(
        Principal.fromText(IC_LIGHTHOUSE_TOKEN_CANISTER_ID),
        tokenInfo[1],
        tokenInfo[0],
        tokenInfo[2],
        'ICRC-1',
        {
          add: null
        }
      );
      if (res) {
        const token: AddTokenItem = {
          ...new AddTokenItemClass(),
          symbol: tokenInfo[1],
          name: tokenInfo[0],
          decimals: tokenInfo[2],
          standard: 'ICRC-1',
          canisterId: Principal.fromText(IC_LIGHTHOUSE_TOKEN_CANISTER_ID)
        };
        this.tokens.push(token);
        this.getICRCBalance(token);
        this.getIcrcMetadata(token);
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getIcrcMetadata(token: AddTokenItem): Promise<void> {
    if (token.logo) {
      return;
    }
    if (token.canisterId.toString() === IC_SNS_TOKEN_CANISTER_ID) {
      return;
    }
    let logo = await getTokenLogo(token.canisterId, {
      icrc1: null
    });
    if (
      !logo &&
      (token.standard === TokenStandard['ICRC-1'] ||
        token.standard === TokenStandard['ICRC-2'])
    ) {
      let SNSGovernance = '';
      this.listDeployedSnses.some((item) => {
        if (
          item.ledger_canister_id.length &&
          item.ledger_canister_id[0].toString() === token.canisterId.toString()
        ) {
          SNSGovernance = item.governance_canister_id[0].toString();
          return true;
        }
      });
      if (SNSGovernance) {
        const snsGovernanceService = new SNSGovernanceService();
        const metadata = await snsGovernanceService.getMetadata(SNSGovernance);
        console.log(metadata);
        if (metadata && metadata.logo && metadata.logo.length) {
          logo = metadata.logo[0];
        }
      }
    }
    this.$set(token, 'logo', logo);
  }
  private async getDip20Metadata(token: AddTokenItem): Promise<void> {
    const metadata = await getTokenInfo(token.canisterId, {
      dip20: null
    });
    this.$set(token, 'logo', metadata.logo);
  }
  private async getMetadata(token: AddTokenItem): Promise<void> {
    const metadata = await this.DRC20TokenService.metadata(
      token.canisterId.toString()
    );
    metadata.some((val) => {
      if (val.name === 'logo') {
        this.$set(token, 'logo', val.content);
        return true;
      }
    });
  }
  private async getCoinSeconds(token: AddTokenItem): Promise<void> {
    try {
      const res = await this.DRC20TokenService.getCoinSeconds(
        [this.getPrincipalId],
        token.canisterId.toString()
      );
      let coinSeconds = new BigNumber(res[1][0].coinSeconds.toString(10))
        .div(10 ** Number(token.decimals))
        .toString(10);
      if (new BigNumber(coinSeconds).gt(10 ** 5)) {
        coinSeconds = new BigNumber(coinSeconds)
          .div(10 ** 9)
          .decimalPlaces(4, 1)
          .toString(10);
        if (Number(coinSeconds) > 100) {
          coinSeconds = parseInt(coinSeconds).toString(10) + ' GCS';
        } else {
          coinSeconds = coinSeconds + ' GCS';
        }
      } else {
        coinSeconds = new BigNumber(coinSeconds).decimalPlaces(2, 1) + ' CS';
      }
      this.$set(token, 'coinSeconds', coinSeconds);
    } catch (e) {
      this.$set(token, 'coinSeconds', '-');
    }
  }
  private async getLocked(token: AddTokenItem): Promise<void> {
    const res = await this.DRC20TokenService.txnQuery(
      {
        lockedTxns: { owner: this.getPrincipalId }
      },
      token.canisterId.toString()
    );
    const lockedTxns = (
      res as {
        lockedTxns: {
          txns: Array<TxnRecord>;
          lockedBalance: bigint;
        };
      }
    ).lockedTxns;
    const lockedBalance = new BigNumber(lockedTxns.lockedBalance.toString(10))
      .div(10 ** Number(token.decimals))
      .decimalPlaces(4, 1)
      .toString(10);
    this.$set(token, 'lockedTxns', {
      txns: lockedTxns.txns,
      lockedBalance: lockedBalance
    });
  }
  private async getApprovalsAllowance(token: AddTokenItem): Promise<void> {
    const res = await this.DRC20TokenService.approvals(
      this.getPrincipalId,
      token.canisterId.toString()
    );
    this.$set(token, 'approvals', res.length);
  }
  private updateApprove(text: Allowance): void {
    this.$refs.approve.visible = true;
    this.approveType = 'update';
    this.$refs.approve.approveForm.spender = this.arrayToString(text.spender);
    this.$refs.approve.approveForm.amount = new BigNumber(
      text.remaining.toString(10)
    )
      .div(10 ** Number(this.currentToken.decimals))
      .toString(10);
  }
  private async removeApprove(text: Allowance): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const principal = localStorage.getItem('principal');
      const nonceRes = await this.DRC20TokenService.txnQuery(
        {
          txnCount: { owner: principal }
        },
        this.currentToken.canisterId.toString()
      );
      const nonce = (
        nonceRes as {
          txnCount: bigint;
        }
      ).txnCount;
      const res = await this.DRC20TokenService.drc20Approve(
        BigInt('0'),
        [],
        this.arrayToString(text.spender),
        [nonce],
        0,
        this.currentToken.canisterId.toString()
      );
      if (
        (
          res as {
            ok: Txid;
          }
        ).ok
      ) {
        this.$message.success('Remove Success');
        await this.getApprovals(this.currentToken, this.currentIndex);
        this.approveSuccess();
      } else {
        this.$message.error((res as TxnResultErr).err.message);
      }
      loading.close();
    } catch (e) {
      loading.close();
      console.log(e);
    }
  }
  private async getLockTransaction(
    token: AddTokenItem,
    index: number
  ): Promise<void> {
    this.currentToken = token;
    this.currentIndex = index;
    this.lockTransactions = [];
    this.lockTransactionsModal = true;
    this.lockTransactionsLoading = true;
    try {
      const res = await this.DRC20TokenService.txnQuery(
        {
          lockedTxns: { owner: this.getPrincipalId }
        },
        token.canisterId.toString()
      );
      const lockedTxns = (
        res as {
          lockedTxns: {
            txns: Array<TxnRecord>;
            lockedBalance: bigint;
          };
        }
      ).lockedTxns;
      this.lockTransactions = lockedTxns.txns;
      this.lockTransactionsLoading = false;
    } catch (e) {
      this.lockTransactionsLoading = false;
    }
  }
  private async getApprovals(
    token: AddTokenItem,
    index: number
  ): Promise<void> {
    this.currentToken = token;
    this.currentIndex = index;
    this.approvalsModal = true;
    this.approvalsLoading = true;
    this.approvals = [];
    try {
      const res = await this.DRC20TokenService.approvals(
        this.getPrincipalId,
        token.canisterId.toString()
      );
      this.approvalsLoading = false;
      this.approvals = res;
    } catch (e) {
      this.approvalsLoading = false;
      console.log(e);
    }
  }
  private async getTransactions(token: AddTokenItem): Promise<void> {
    this.currentToken = token;
    this.transactionsModal = true;
    this.transactionsLoading = true;
    this.transactions = [];
    try {
      const res = await this.DRC20TokenService.txnQuery(
        {
          getEvents: { owner: [this.getPrincipalId] }
        },
        token.canisterId.toString()
      );
      const transition = (res as { getEvents: Array<TxnRecord> }).getEvents;
      if (transition && transition.length) {
        this.transactions = transition;
      }
    } catch (e) {
      console.log(e);
    }
    this.transactionsLoading = false;
  }
  private async getDip20Balance(token: AddTokenItem): Promise<void> {
    const res = await getTokenBalance(
      { dip20: null },
      token.canisterId.toString()
    );
    const balance = new BigNumber(res)
      .div(10 ** Number(token.decimals))
      .decimalPlaces(Number(token.decimals), 1)
      .toString(10);
    this.$set(token, 'balance', balance);
  }
  private async getICRCBalance(token: AddTokenItem): Promise<void> {
    const res = await getTokenBalance(
      { icrc1: null },
      token.canisterId.toString()
    );
    const balance = new BigNumber(res)
      .div(10 ** Number(token.decimals))
      .decimalPlaces(Number(token.decimals), 1)
      .toString(10);
    this.$set(token, 'balance', balance);
  }
  private async getBalance(token: AddTokenItem): Promise<void> {
    const res = await getTokenBalance(
      { drc20: null },
      token.canisterId.toString()
    );
    const balance = new BigNumber(res)
      .div(10 ** Number(token.decimals))
      .decimalPlaces(Number(token.decimals), 1)
      .toString(10);
    this.$set(token, 'balance', balance);
  }
  private async addToken(): Promise<void> {
    this.$refs.addTokenForm.validate(async (valid: any) => {
      if (valid) {
        // check token is added
        const flag = this.tokens.some(
          (token) => token.canisterId.toString() === this.addTokenForm.tokenId
        );
        if (flag) {
          this.$message.error('Token has already been added');
          return;
        }
        await checkAuth();
        let loading;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        try {
          const priList = JSON.parse(localStorage.getItem('priList')) || {};
          const flag = needConnectPlug([this.addTokenForm.tokenId]);
          const connectInfinity1 = await needConnectInfinity([
            this.addTokenForm.tokenId
          ]);
          if (priList[this.getPrincipalId] === 'Plug' && flag) {
            const connectPlug = new ConnectPlug();
            this.$info({
              content: 'Token need to be connected to the plug.',
              class: 'connect-plug',
              icon: 'connect-plug',
              okText: 'Confirm',
              onOk() {
                connectPlug
                  .addWhitelist(_that.addTokenForm.tokenId)
                  .then(async (isConnect) => {
                    if (!isConnect) {
                      return;
                    }
                    loading = _that.$loading({
                      lock: true,
                      background: 'rgba(0, 0, 0, 0.5)'
                    });
                    await _that.initAddToken(loading);
                  });
              }
            });
          } else if (
            priList[this.getPrincipalId] === 'Infinity' &&
            connectInfinity1
          ) {
            const connectInfinity = new ConnectInfinity();
            this.$info({
              content: 'Token need to be connected to the Infinity.',
              class: 'connect-plug',
              icon: 'connect-plug',
              okText: 'Confirm',
              onOk() {
                connectInfinity
                  .addWhitelist(_that.addTokenForm.tokenId)
                  .then(async (isConnect) => {
                    if (!isConnect) {
                      return;
                    }
                    loading = _that.$loading({
                      lock: true,
                      background: 'rgba(0, 0, 0, 0.5)'
                    });
                    await _that.initAddToken(loading);
                  });
              }
            });
          } else {
            loading = this.$loading({
              lock: true,
              background: 'rgba(0, 0, 0, 0.5)'
            });
            if ((window as any).icx) {
              console.log('connectIcx');
              await addIcxWhitelist(this.addTokenForm.tokenId);
            }
            this.initAddToken(loading);
          }
        } catch (e) {
          loading.close();
          this.$message.error('Please enter a valid tokenId');
          console.log(e);
          removeWhitelist(this.addTokenForm.tokenId);
        }
      }
    });
  }
  private async initAddToken(loading): Promise<void> {
    let tokenInfo = [];
    if (this.tokenStd === TokenStandard.DRC20) {
      const promiseAllValue = [];
      promiseAllValue.push(
        this.DRC20TokenService.name(this.addTokenForm.tokenId),
        this.DRC20TokenService.symbol(this.addTokenForm.tokenId),
        this.DRC20TokenService.decimals(this.addTokenForm.tokenId)
      );
      tokenInfo = await Promise.all(promiseAllValue);
    } else if (
      this.tokenStd === TokenStandard['ICRC-1'] ||
      this.tokenStd === TokenStandard['ICRC-2']
    ) {
      const promiseAllValue = [];
      promiseAllValue.push(
        this.DRC20TokenService.icrcName(this.addTokenForm.tokenId),
        this.DRC20TokenService.icrcSymbol(this.addTokenForm.tokenId),
        this.DRC20TokenService.icrcDecimals(this.addTokenForm.tokenId)
      );
      tokenInfo = await Promise.all(promiseAllValue);
    } else if (this.tokenStd === TokenStandard.DIP20) {
      const res = await getTokenInfo(
        Principal.fromText(this.addTokenForm.tokenId),
        { dip20: null }
      );
      tokenInfo = [res.name, res.symbol, res.decimals];
    }
    try {
      const res = await addToken(
        Principal.fromText(this.addTokenForm.tokenId),
        tokenInfo[1],
        tokenInfo[0],
        tokenInfo[2],
        this.tokenStd,
        {
          add: null
        }
      );
      if (res) {
        this.$message.success('Add Token Success');
        this.visible = false;
        loading.close();
        const token: AddTokenItem = {
          ...new AddTokenItemClass(),
          symbol: tokenInfo[1],
          name: tokenInfo[0],
          decimals: tokenInfo[2],
          standard: this.tokenStd,
          canisterId: Principal.fromText(this.addTokenForm.tokenId)
        };
        this.tokens.push(token);
        if (this.tokenStd === TokenStandard.DRC20) {
          this.getBalance(token);
          this.getMetadata(token);
          this.getLocked(token);
          this.txnCount(token);
          this.getApprovalsAllowance(token);
          this.getCoinSeconds(token);
        } else if (this.tokenStd === TokenStandard.DIP20) {
          this.getDip20Balance(token);
          this.getDip20Metadata(token);
        } else if (
          this.tokenStd === TokenStandard['ICRC-1'] ||
          this.tokenStd === TokenStandard['ICRC-2']
        ) {
          this.getICRCBalance(token);
          this.getIcrcMetadata(token);
          if (token.canisterId.toString() === IC_SNS_TOKEN_CANISTER_ID) {
            this.getSNSLogo(token);
          }
        }
      }
    } catch (e) {
      loading.close();
      console.log(e);
    }
  }
  private afterClose(): void {
    this.tokenStd = TokenStandard.DRC20;
    this.$refs.addTokenForm.resetFields();
  }
}
</script>

<style scoped lang="scss">
.tokens-title {
  margin-top: 20px;
  font-size: 20px;
  button {
    margin-left: 20px;
  }
}
.token-wrap {
  display: flex;
  flex-wrap: wrap;
  .token-name {
    display: flex;
    align-items: center;
    button {
      margin-left: auto;
      font-size: 14px;
      .reload-icon {
        font-size: 12px;
        margin-right: 5px;
      }
    }
  }
}
.token-list {
  position: relative;
}
.balance-main {
  width: 400px;
  height: 160px;
  background: #141b23;
  color: #727a87;
  margin: 0 20px 20px 0;
  .balance {
    color: #bababa;
  }
}
.operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  i {
    margin-right: 5px;
    font-size: 12px;
  }
  .operation-name {
    margin-right: 10px;
    cursor: pointer;
    white-space: nowrap;
  }
}
.token-main {
  width: 100%;
  td {
    i {
      color: #777d90;
      margin-left: 5px;
    }
    .operation-name {
      i {
        margin-left: 0;
      }
    }
    &.operation-td {
      .operation {
        color: #1996c4;
        padding: 0;
        i {
          margin-right: 0;
          color: #1996c4;
          font-size: 12px;
        }
      }
    }
  }
}
.address-modal {
  dt {
    margin-bottom: 10px;
    text-align: center;
  }
  i {
    cursor: pointer;
  }
}
.no-tokens {
  text-align: center;
  line-height: 100px;
}
.your-token-list {
  font-size: 13px;
  dt {
    margin-bottom: 3px;
  }
  dd {
    display: flex;
    align-items: center;
    i {
      cursor: pointer;
      margin-left: 3px;
    }
  }
  .name {
    padding: 5px 5px 5px 0 !important;
    dd {
      font-size: 12px;
    }
  }
}
.operation-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 120px;
  button {
    line-height: 1;
  }
}
.operation-slot {
  word-break: break-word;
}
.img-content {
  width: 38px;
  height: 30px;
}
.token-symbol-td {
  position: relative;
  text-align: left !important;
  color: #adb7c2 !important;
  .token-standard {
    position: absolute;
    font-size: 18px;
    transform: scale(0.5);
    transform-origin: top;
  }
}
.button-table {
  color: #1996c4;
  cursor: pointer;
}
.balance-td-main {
  min-width: 120px;
}
.search-token {
  ::v-deep .ant-select-selection__clear {
    background: none;
    color: #636c73;
  }
}
.sort-table-main {
  display: flex;
  align-items: center;
}
.sort-table {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
  margin-top: -5px;
  i {
    font-size: 12px;
    height: 8px;
    color: #58686a;
    &.active {
      color: #0862bc;
    }
  }
}
@media screen and (max-width: 768px) {
  .small-screen {
    display: none;
  }
  td {
    white-space: nowrap;
  }
}
</style>
