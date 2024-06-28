<template>
  <div>
    <a-modal
      v-model="visible"
      centered
      width="676px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal nft-modal"
      :after-close="afterCloseModal"
    >
      <div class="nfts">
        <div v-if="type === 'CreateMaker'" class="base-font-title">
          <div v-if="isPublic">Public OAMMs are created in two ways:</div>
          <p
            v-if="
              isPublic &&
              sysConfig &&
              sysConfig.creatingMakerFee &&
              tokens &&
              tokens[sysConfig.sysToken.toString()]
            "
          >
            1.
            <a
              href="https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai"
              target="_blank"
              rel="nofollow noreferrer noopener"
              class="link"
              >ICLighthouse Planet NFT</a
            >
            (#NEPTUNE, #URANUS or #SATURN) holders are required to burn
            {{
              sysConfig.creatingMakerFee
                | bigintToFloat(
                  tokens[sysConfig.sysToken.toString()].decimals,
                  tokens[sysConfig.sysToken.toString()].decimals
                )
            }}
            ICL to create a Public OAMM pool.
          </p>
          <p
            v-if="
              isPublic &&
              createFee &&
              tokens &&
              tokens[sysConfig.sysToken.toString()]
            "
          >
            2. Non-above NFT holders are required to burn
            {{
              createFee
                | bigintToFloat(
                  tokens[sysConfig.sysToken.toString()].decimals,
                  tokens[sysConfig.sysToken.toString()].decimals
                )
            }}
            ICL to create a Public OAMM pool.
          </p>
          <div v-if="!isPublic">Private OAMMs are created in two ways:</div>
          <p
            v-if="
              !isPublic &&
              sysConfig &&
              sysConfig.creatingMakerFee &&
              tokens &&
              tokens[sysConfig.sysToken.toString()]
            "
          >
            1. ICLighthouse Planet NFT (any card) holders are required to burn
            {{
              sysConfig.creatingMakerFee
                | bigintToFloat(
                  tokens[sysConfig.sysToken.toString()].decimals,
                  tokens[sysConfig.sysToken.toString()].decimals
                )
            }}
            ICL to create a Private OAMM pool.
          </p>
          <p
            v-if="
              !isPublic &&
              createPrivateFee &&
              tokens &&
              tokens[sysConfig.sysToken.toString()]
            "
          >
            2. Non-NFT holders are required to burn
            {{
              createPrivateFee
                | bigintToFloat(
                  tokens[sysConfig.sysToken.toString()].decimals,
                  tokens[sysConfig.sysToken.toString()].decimals
                )
            }}
            ICL to create a Private OAMM pool.
          </p>
        </div>
        <div v-if="type === 'BecomeVipMaker'">
          Users can grant VIP-Maker status to accounts using an ICLighthouse
          NEPTUNE NFT. This will grant the account a Maker rebate. This rebate
          gives the VIP-Maker 90% of the taker’s trading fee.
        </div>
        <div v-if="type === 'mining'" class="base-font-title">
          <div>
            Binding NFT can get 15% to 25% mining acceleration.
            <ul style="margin-top: 10px">
              <li>- #MERCURY (index 1515-2021)&nbsp;&nbsp;15%</li>
              <li>- #VENUS (index 1015-1514)&nbsp;&nbsp;17%</li>
              <li>- #EARTH (index 615-1014)&nbsp;&nbsp;19%</li>
              <li>- #MARS (index 315-614)&nbsp;&nbsp;21%</li>
              <li>- #JUPITER (index 115-314)&nbsp;&nbsp;23%</li>
              <li>- #SATURN (index 15-114)&nbsp;&nbsp;25%</li>
              <li>- #URANUS (index 5-14)&nbsp;&nbsp;25%</li>
              <li>- #NEPTUNE (index 0-4)&nbsp;&nbsp;25%</li>
            </ul>
          </div>
        </div>
        <p class="flex-center base-color-w mt20">
          NFTs:
          <span
            v-if="listingReferrer && listingReferrer[0]"
            class="margin-left-auto main-color font-bold pointer"
            @click="toPropose"
            >Listing Referrer</span
          >
        </p>
        <div class="nfts-main">
          <div class="base-font-title">Select an NFT</div>
          <ul class="nft-main">
            <li
              v-for="(ext, index) in nfts.slice(
                extPage * extPageNum,
                (extPage + 1) * extPageNum
              )"
              :key="index"
              :class="{
                active: currentNft && ext[0] === currentNft[0],
                disabled: !canDeposit(ext)
              }"
              @click="selectNft(ext)"
            >
              <img
                v-show="currentNft && ext[0] === currentNft[0]"
                class="checked"
                src="@/assets/img/checked.png"
                alt=""
              />
              <div class="nft-img">
                <img :src="getExtInfo(ext[2]).thumb" alt="" />
              </div>
              <div class="ext-info">{{ getExtInfo(ext[2]).name }}</div>
            </li>
          </ul>
          <div class="err-tip" v-show="currentNft && !canDeposit(currentNft)">
            <span v-if="type === 'BecomeVipMaker'"
              >Only Planet NEPTUNE cards can continue to operate.
            </span>
            <span v-if="type === 'CreateMaker'">
              NEPTUNE/URANUS/SATURN cards can create OAMM at a discount.
            </span>
            <span v-if="type === 'ListingReferrer'">
              Only Planet URANUS cards can continue to operate.
            </span>
          </div>
          <div class="flex-center" v-if="!nfts.length">
            <span v-if="type === 'BecomeVipMaker'"
              >You need to transfer the NEPTUNE NFT to
            </span>
            <span v-if="type === 'CreateMaker'"
              >You need to transfer the NEPTUNE, URANUS or SATURN NFT to
            </span>
            <span v-if="type === 'ListingReferrer'"
              >You need to transfer the URANUS NFT to
            </span>
            <span v-if="type === 'mining'">You need to transfer NFT to </span>
            <copy-account
              :account="getPrincipalId"
              copyText="Principal"
            ></copy-account>
          </div>
          <div class="nft-main-pagination">
            <a-pagination
              v-if="nfts.length > 3"
              class="pagination"
              :defaultPageSize="extPageNum"
              :current="extPage + 1"
              :total="nfts.length"
              @change="pageChange"
            />
          </div>
          <div class="w100">
            <button
              :disabled="!currentNft || (currentNft && !canDeposit(currentNft))"
              type="button"
              class="w100 primary"
              @click="onDeposit"
            >
              <span v-if="type === 'mining'"
                >Deposit NFT for mining acceleration</span
              ><span v-else>Deposit</span>
            </button>
          </div>
        </div>
      </div>
      <div class="mt20">
        <p class="base-color-w">Deposited NFT</p>
        <div class="nfts-main">
          <div v-show="type !== 'mining'" class="base-font-title">
            Select an NFT
          </div>
          <ul class="nft-main">
            <li
              v-for="(ext, index) in nftBalance.slice(
                page * pageNum,
                (page + 1) * pageNum
              )"
              :key="index"
              :class="{
                active:
                  currentDepositedNft &&
                  ext[1] === currentDepositedNft[1] &&
                  type !== 'mining',
                disabled: !canSubmit(ext)
              }"
              @click="selectDepositedNft(ext)"
            >
              <img
                v-show="
                  currentDepositedNft &&
                  ext[1] === currentDepositedNft[1] &&
                  type !== 'mining'
                "
                class="checked"
                src="@/assets/img/checked.png"
                alt=""
              />
              <div class="nft-img">
                <img :src="getImg(ext[3])" alt="" />
              </div>
              <div class="ext-info">{{ Object.keys(ext[3])[0] }} CARD</div>
              <div
                v-show="type !== 'mining'"
                class="ext-transfer"
                @click.stop="onWithdraw(ext)"
              >
                Withdraw
              </div>
            </li>
          </ul>
          <div
            class="err-tip"
            v-show="currentDepositedNft && !canSubmit(currentDepositedNft)"
          >
            <span v-if="type === 'BecomeVipMaker'"
              >Only Planet NEPTUNE cards can continue to operate.</span
            >
            <span v-if="type === 'CreateMaker'"
              >NEPTUNE/URANUS/SATURN cards can create OAMM at a discount.</span
            >
            <span v-if="type === 'ListingReferrer'"
              >Only Planet URANUS cards can continue to operate.</span
            >
          </div>
          <div v-if="!nftBalance.length" class="text-center">
            No Deposited NFT
          </div>
          <div
            v-if="type === 'mining' && nftBalance.length"
            style="display: flex; align-items: center; justify-content: center"
          >
            <img
              style="width: 16px; height: 16px"
              src="@/assets/img/checked.png"
              alt=""
            />&nbsp; Already have NFT bound, you get +{{ acceleration }}% mining
            acceleration.
          </div>
          <div class="nft-main-pagination">
            <a-pagination
              v-if="nftBalance.length > 3"
              class="pagination"
              :defaultPageSize="pageNum"
              :current="page + 1"
              :total="nftBalance.length"
              @change="pageChangeDeposited"
            />
          </div>
          <div class="w100 flex-center">
            <button
              :disabled="
                !currentDepositedNft ||
                (currentDepositedNft && !canSubmit(currentDepositedNft))
              "
              type="button"
              class="w100 primary"
              v-if="type === 'CreateMaker'"
              style="margin-right: 10px"
              @click="onCreateMMPool"
            >
              Create OAMM with NFT
              <span
                v-if="
                  sysConfig &&
                  sysConfig.creatingMakerFee &&
                  tokens &&
                  tokens[sysConfig.sysToken.toString()]
                "
              >
                (Fee:
                {{
                  sysConfig.creatingMakerFee
                    | bigintToFloat(
                      tokens[sysConfig.sysToken.toString()].decimals,
                      tokens[sysConfig.sysToken.toString()].decimals
                    )
                }}
                ICL)</span
              >
            </button>
            <button
              type="button"
              class="w100 primary"
              v-if="type === 'CreateMaker'"
              style="margin-right: 10px"
              @click="onCreateMMPool(false)"
            >
              Create OAMM without NFT
              <span
                v-if="
                  isPublic &&
                  createFee &&
                  tokens &&
                  tokens[sysConfig.sysToken.toString()]
                "
              >
                (Fee:
                {{
                  createFee
                    | bigintToFloat(
                      tokens[sysConfig.sysToken.toString()].decimals,
                      tokens[sysConfig.sysToken.toString()].decimals
                    )
                }}
                ICL)
              </span>
              <span
                v-if="
                  !isPublic &&
                  createPrivateFee &&
                  tokens &&
                  tokens[sysConfig.sysToken.toString()]
                "
              >
                (Fee:
                {{
                  createPrivateFee
                    | bigintToFloat(
                      tokens[sysConfig.sysToken.toString()].decimals,
                      tokens[sysConfig.sysToken.toString()].decimals
                    )
                }}
                ICL)
              </span>
            </button>
            <button
              v-if="type === 'BecomeVipMaker'"
              :disabled="
                !currentDepositedNft ||
                (currentDepositedNft && !canSubmit(currentDepositedNft))
              "
              type="button"
              class="w100 primary"
              @click="onBindMMPool"
            >
              Add a vip-maker with NFT
            </button>
            <button
              v-if="type === 'ListingReferrer'"
              :disabled="
                !currentDepositedNft ||
                (currentDepositedNft && !canSubmit(currentDepositedNft))
              "
              type="button"
              class="w100 primary"
              @click="onListingReferrer"
            >
              Set Listing Referrer By NFT
            </button>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="visiblePropose"
      centered
      width="500px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal nft-modal"
    >
      <div>
        <div v-if="!canPropose">
          Your NFT lockout period is over 330 days ({{ lockedTime }} days) and
          you can no longer sponsor new pairs.
        </div>
        <div v-if="canPropose && pair">
          <span v-if="Number(lockedTime) > 0"
            >Your NFT has sponsored {{ NFTStakedPairs }} trading pairs with a
            lockup period of {{ lockedTime }} days.
          </span>
          Are you sure you want to sponsor
          {{ pair[1].pair.token0[1] }}/{{ pair[1].pair.token1[1] }}({{
            pair[0].toString()
          }})? By doing so, your NFT will extend the lockup period by 30 days.
        </div>
        <button
          class="mt20 w100 primary"
          :disabled="!canPropose"
          @click="onPropose"
        >
          Propose
        </button>
      </div>
    </a-modal>
    <a-modal
      v-model="createMakerVisible"
      width="710px"
      title="Create OAMM Pool"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
    >
      <a-form-model
        :model="createMakerPoolForm"
        ref="createMakerPoolForm"
        :rules="createMakerPoolFormRules"
      >
        <a-form-model-item label="Pair" prop="pair">
          <a-select
            v-model="createMakerPoolForm.pair"
            placeholder="Select a pair"
            @change="onChangePair"
          >
            <a-select-option
              v-for="(pair, index) in pairsMaker"
              :key="index"
              :label="`${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}`"
            >
              <span class="base-color-w"
                >{{ pair[1].pair.token0[1] }}/{{ pair[1].pair.token1[1] }}</span
              >
              <span>&nbsp;{{ pair[0].toString() }}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Name" prop="name">
          <a-input
            v-model="createMakerPoolForm.name"
            autocomplete="off"
            type="text"
            placeholder="Pool Name"
          />
        </a-form-model-item>
        <!--<span class="ant-form-item-required base-font-title"
          >Limit Price:
        </span>
        <div class="setting-price-range">
          <a-form-model-item prop="lowerLimit">
            <a-input
              :key="unit"
              v-model="createMakerPoolForm.lowerLimit"
              class="input-icp-suffix"
              autocomplete="off"
              type="text"
              placeholder="Lower Limit"
              :suffix="
                createMakerPoolForm.pair !== undefined
                  ? `${token1[1]}/1 ${token0[1]}`
                  : ''
              "
              v-only-float="unit"
            />
          </a-form-model-item>
          <span class="setting-price-range-line">&nbsp;-&nbsp;</span>
          <a-form-model-item prop="upperLimit">
            <a-input
              :key="unit"
              v-model="createMakerPoolForm.upperLimit"
              class="input-icp-suffix"
              autocomplete="off"
              type="text"
              placeholder="Upper Limit"
              :suffix="
                createMakerPoolForm.pair !== undefined
                  ? `${token1[1]}/1 ${token0[1]}`
                  : ''
              "
              v-only-float="unit"
            />
          </a-form-model-item>
        </div>-->
        <a-form-model-item prop="spreadRate" :colon="false">
          <span slot="label">
            <span>Spread Rate: </span>
            <a-tooltip>
              <template slot="title">
                Ratio of the price difference between two grids of the grid
                order.
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>
          </span>
          <a-input
            v-model="createMakerPoolForm.spreadRate"
            autocomplete="off"
            placeholder="Spread Rate"
            suffix="%"
            v-only-float="1"
          />
        </a-form-model-item>
        <div class="base-tip-size" style="margin: -5px 0 5px">
          Suggestions:
          <p>
            1, Low volatility, high liquidity trading pairs (such as USDT/USDC):
            it is recommended to set 0.1% ~ 1.0%.
          </p>
          <p>
            2, High liquidity trading pairs: it is recommended to set 1.0% ~
            2.0%.
          </p>
          <p>
            3, Medium liquidity trading pairs: it is recommended to set 2.0% ~
            5.0%.
          </p>
          <p>
            4, Low liquidity trading pairs: it is recommended to set 5.0% ~
            10.0%.
          </p>
        </div>
        <a-form-model-item v-show="isPublic" prop="threshold" :colon="false">
          <span slot="label">
            <span>Threshold: </span>
            <a-tooltip>
              <template slot="title">
                When the pool's token1 balance reaches this threshold, a limit
                will be set to add liquidity, with users with high volume having
                more credits.
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>
          </span>
          <a-input
            v-model="createMakerPoolForm.threshold"
            autocomplete="off"
            placeholder="Threshold"
            :suffix="token1 && token1[1]"
            v-only-float="unit"
          />
        </a-form-model-item>
        <a-form-model-item v-show="isPublic" prop="volFactor" :colon="false">
          <span slot="label">
            <span>Vol Factor: </span>
            <a-tooltip>
              <template slot="title">
                VolFactor is the factor used to calculate the limit. When the
                pool triggers a liquidity limit, the amount of liquidity that
                can be added by an user (calculated on token1) = the user's
                volume in this pair (token1) * volFactor.
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>
          </span>
          <a-input
            v-model="createMakerPoolForm.volFactor"
            autocomplete="off"
            placeholder="Vol Factor"
            v-only-float="0"
          />
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            class="primary large-primary w100 mt20"
            @click="onSubmit"
          >
            Submit
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      v-model="bindMakerVisible"
      width="650px"
      title="Bind Maker"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterCloseBind"
    >
      <a-form-model
        :model="bindMakerForm"
        ref="bindMakerForm"
        :rules="bindMakerFormRules"
      >
        <a-form-model-item label="Pair" prop="pair">
          <a-select
            v-model="bindMakerForm.pair"
            placeholder="Select a pair"
            @change="onChangePairBind"
          >
            <a-select-option
              v-for="(pair, index) in pairsMaker"
              :key="index"
              :label="`${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}`"
            >
              <span class="base-color-w"
                >{{ pair[1].pair.token0[1] }}/{{ pair[1].pair.token1[1] }}</span
              >
              <span>&nbsp;{{ pair[0].toString() }}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Account" prop="account">
          <a-input
            v-model="bindMakerForm.account"
            autocomplete="off"
            placeholder="Principal Or Account Id"
          />
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            class="primary large-primary w100 mt20"
            @click="onBind"
          >
            Bind
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <approve-modal
      :isICLToken="true"
      :decimals="8"
      :icl-token-amount="iclTokenAmount"
      approve-mode="icrc1"
      ref="approve"
      @approveSuccess="approveSuccess"
    ></approve-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  MakerCreateArg,
  NFT,
  NFTType,
  SysConfig
} from '@/ic/ICDexRouter/model';
import { ApproveRequest, TokenExt, TokensExt } from '@/ic/nft/model';
import {
  getTokenIdentifier,
  hexToBytes,
  principalToAccountIdentifier,
  toPrincipalAndAccountId
} from '@/ic/converter';
import {
  IC_DEX_ROUTER_CANISTER_ID,
  IC_SWAP_ROUTER_CANISTER_ID_Fiduciary,
  NFT_CANISTER_ID
} from '@/ic/utils';
import { checkAuth } from '@/ic/CheckAuth';
import { isPlug } from '@/ic/isPlug';
import { isInfinity } from '@/ic/isInfinity';
import { Principal } from '@dfinity/principal';
import NFTIdl from '@/ic/nft/erc721.did';
import { NftService } from '@/ic/nft/Service';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';
import BigNumber from 'bignumber.js';
import ConnectPlug, { needConnectPlug } from '@/ic/ConnectPlug';
import ConnectInfinity, { needConnectInfinity } from '@/ic/ConnectInfinity';
import { toHttpRejectError } from '@/ic/httpError';
import { validateCanisterOrAccount } from '@/utils/validate';
import { PairTrie, StakedNFT, SwapTokenInfo } from '@/ic/ICSwapRouter/model';
import { TokenInfo } from '@/ic/common/icType';
import { namespace } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import ApproveModal from '@/components/approve/Index.vue';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { NFTRole } from '@/views/home/ICDex/model';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';

const commonModule = namespace('common');

@Component({
  name: 'NFTBalance',
  components: { ApproveModal }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @Prop({ type: Array, default: () => [] })
  private nftBalance!: Array<NFT>;
  @Prop({ type: Array, default: () => [] })
  private nfts!: TokensExt;
  @Prop({ type: String, default: () => null })
  private type!: NFTRole;
  @Prop({ type: Object, default: () => null })
  private tokens!: { [key: string]: TokenInfo };
  @Prop({ type: Array, default: () => [] })
  private pairsMaker!: Array<PairTrie>;
  @Prop({ type: Array, default: () => null })
  private listingReferrer!: [boolean, boolean];

  private visible = false;
  private visiblePropose = false;
  private extPage = 0;
  private extPageNum = 3;
  private currentNft: TokenExt = null;
  private page = 0;
  private pageNum = 3;
  private currentDepositedNft: NFT = null;
  private NftService: NftService = null;
  private ICDexRouterService: ICDexRouterService = null;
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService = null;
  private DRC20TokenService: DRC20TokenService;
  private createMakerVisible = false;
  private bindNftTokenId = '';
  private unit = 8;
  private token1: SwapTokenInfo = null;
  private token0: SwapTokenInfo = null;
  private sysConfig: SysConfig = null;
  private createFee = '';
  private createPrivateFee = '';
  private iclTokenAmount = null;
  private isPublic = false;
  private pair: PairTrie = null;
  private NFTStaked: Array<StakedNFT> = [];
  private NFTStakedPairs = 0;
  private canPropose = false;
  private lockedTime = '0';
  private createMakerPoolForm = {
    name: '',
    pair: undefined,
    allow: '',
    lowerLimit: '',
    upperLimit: '',
    spreadRate: '',
    threshold: '100000',
    volFactor: '2'
  };
  private createMakerPoolFormRules = {
    pair: [
      { required: true, message: 'Please select a pair', trigger: 'change' }
    ],
    name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
    /*lowerLimit: [
      {
        required: true,
        message: 'Please enter lowerLimit',
        trigger: ['change', 'blur']
      },
      { validator: this.validateLowerLimit, trigger: ['change', 'blur'] }
    ],
    upperLimit: [
      {
        required: true,
        message: 'Please enter upperLimit',
        trigger: ['change', 'blur']
      },
      { validator: this.validateUpperLimit, trigger: ['change', 'blur'] }
    ],*/
    spreadRate: [
      {
        required: true,
        message: 'Please enter spread rate',
        trigger: ['change', 'blur']
      }
    ],
    threshold: [
      {
        required: true,
        message: 'Please enter threshold',
        trigger: ['change', 'blur']
      }
    ],
    volFactor: [
      {
        required: true,
        message: 'Please enter vol factor',
        trigger: ['change', 'blur']
      }
    ]
  };
  private validateUpperLimit(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    if (new BigNumber(value).lte(0)) {
      callback('The upper Limit must be greater than 0');
    } else if (this.createMakerPoolForm.lowerLimit) {
      (this.$refs.createMakerPoolForm as any).validateField('lowerLimit');
      callback();
    } else {
      callback();
    }
  }
  private validateLowerLimit(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    if (new BigNumber(value).lte(0)) {
      callback('The lower Limit must be greater than 0');
    } else if (
      this.createMakerPoolForm.upperLimit &&
      new BigNumber(this.createMakerPoolForm.upperLimit).lte(value)
    ) {
      callback('Upper limit must be greater than lower limit.');
    } else {
      callback();
    }
  }
  private bindMakerVisible = false;
  private bindMakerForm = {
    pair: undefined,
    account: ''
  };
  private bindMakerFormRules = {
    pair: [
      { required: true, message: 'Please select a pair', trigger: 'change' }
    ],
    account: [
      {
        required: true,
        message: 'Please enter principal or account id',
        trigger: ['blur', 'change']
      },
      { validator: validateCanisterOrAccount, trigger: ['blur', 'change'] }
    ]
  };
  get acceleration(): number {
    if (this.nftBalance.length) {
      let acceleration = 0;
      this.nftBalance.forEach((item) => {
        const type = Object.keys(item[3])[0];
        if (type === 'NEPTUNE' || type === 'URANUS' || type === 'SATURN') {
          acceleration = 25;
        } else if (type === 'JUPITER' && acceleration < 23) {
          acceleration = 23;
        } else if (type === 'MARS' && acceleration < 21) {
          acceleration = 21;
        } else if (type === 'EARTH' && acceleration < 19) {
          acceleration = 19;
        } else if (type === 'VENUS' && acceleration < 17) {
          acceleration = 17;
        } else if (type === 'MERCURY' && acceleration < 15) {
          acceleration = 15;
        }
      });
      return acceleration;
    }
    return null;
  }
  created(): void {
    this.NftService = new NftService();
    this.ICDexRouterService = new ICDexRouterService();
    this.DRC20TokenService = new DRC20TokenService();
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.getSysConfig();
  }
  private init(): void {
    if (this.nfts && this.nfts.length) {
      this.currentNft = this.nfts[0];
    } else {
      this.currentNft = null;
    }
    if (this.nftBalance && this.nftBalance.length) {
      this.currentDepositedNft = this.nftBalance[0];
    } else {
      this.currentDepositedNft = null;
    }
    if (this.type === NFTRole.ListingReferrer) {
      this.getNFTStaked();
      if (this.listingReferrer && this.listingReferrer[0]) {
        this.currentNft = null;
        this.currentDepositedNft = null;
      }
    }
  }
  private async getNFTStaked(): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICSwapRouterFiduciaryService.NFTStaked(
        this.getPrincipalId
      );
      console.log(res);
      if (res && res.length) {
        this.NFTStaked = res;
        const now = new Date().getTime();
        this.lockedTime = new BigNumber(res[0][2].toString(10))
          .div(10 ** 6)
          .minus(now)
          .div(86400 * 1000)
          .decimalPlaces(0)
          .toString(10);
        this.NFTStakedPairs = new BigNumber(this.lockedTime)
          .div(30)
          .decimalPlaces(0)
          .toNumber();
        this.canPropose = new BigNumber(this.lockedTime).lt(330);
      } else {
        this.NFTStaked = [];
        this.canPropose = true;
      }
    } else {
      this.NFTStaked = [];
    }
  }
  private toPropose(): void {
    this.visiblePropose = true;
  }
  private async onPropose(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await this.ICSwapRouterFiduciaryService.propose(this.pair[0]);
    loading.close();
    this.$message.success('Propose success');
    this.visiblePropose = false;
    this.visible = false;
    this.$emit('proposeSuccess');
  }
  private bindMMPoolInit(pair: string, pool: string, isPublic: boolean): void {
    if (pair && pool) {
      this.bindMakerForm.pair = pair;
      this.bindMakerForm.account = pool;
    } else {
      this.bindMakerForm.pair = undefined;
      this.bindMakerForm.account = '';
    }
    this.isPublic = isPublic;
    this.visible = true;
    this.init();
  }
  private async onListingReferrer(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      await this.ICSwapRouterFiduciaryService.setListingReferrerByNft(
        'icdex',
        this.currentDepositedNft[1]
      );
      this.$message.success('Success');
      this.$emit('setListingReferrerByNftSuccess');
      this.getNFTStaked();
      this.visiblePropose = true;
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private onBindMMPool(): void {
    this.bindNftTokenId = this.currentDepositedNft[1];
    if (
      this.bindMakerForm.pair &&
      (this.bindMakerForm.pair as string) &&
      this.bindMakerForm.account
    ) {
      this.toBind(Principal.fromText(this.bindMakerForm.pair));
    } else {
      this.bindMakerVisible = true;
    }
  }
  private async getAllowance(): Promise<bigint> {
    const res = await this.DRC20TokenService.icrc2_allowance(
      this.sysConfig.sysToken.toString(),
      {
        account: {
          owner: Principal.fromText(this.getPrincipalId),
          subaccount: []
        },
        spender: {
          owner: Principal.fromText(IC_DEX_ROUTER_CANISTER_ID),
          subaccount: []
        }
      }
    );
    console.log(res);
    if (res) {
      return res.allowance;
    } else {
      return BigInt(0);
    }
  }
  private initForm(): void {
    this.$nextTick(() => {
      if (!this.isPublic) {
        this.createMakerPoolForm.threshold = '1000000.00';
        this.createMakerPoolForm.volFactor = '10000';
      } else {
        this.createMakerPoolForm.threshold = '100000';
        this.createMakerPoolForm.volFactor = '2';
      }
    });
  }
  private approveSuccess(): void {
    this.createMakerVisible = true;
    this.initForm();
  }
  private async getSysConfig(): Promise<void> {
    this.sysConfig = await this.ICDexRouterService.sys_getConfig();
    this.createFee = new BigNumber(this.sysConfig.creatingMakerFee.toString(10))
      .times(10)
      .toString(10);
    this.createPrivateFee = new BigNumber(
      this.sysConfig.creatingMakerFee.toString(10)
    )
      .times(3)
      .toString(10);
  }
  private async onCreateMMPool(hasNft = true): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await this.getSysConfig();
    const allowance = await this.getAllowance();
    console.log(allowance);
    let tokenInfo = this.tokens[this.sysConfig.sysToken.toString()];
    if (!tokenInfo) {
      tokenInfo = await getTokenInfo(this.sysConfig.sysToken, {
        icrc1: null
      });
      this.$set(this.tokens, this.sysConfig.sysToken.toString(), tokenInfo);
    }
    let fee = new BigNumber(this.sysConfig.creatingMakerFee.toString(10))
      .plus(this.sysConfig.sysTokenFee.toString(10))
      .plus(this.sysConfig.sysTokenFee.toString(10))
      .div(10 ** tokenInfo.decimals)
      .toString(10);
    if (!hasNft) {
      if (this.isPublic) {
        fee = new BigNumber(this.sysConfig.creatingMakerFee.toString(10))
          .times(10)
          .plus(this.sysConfig.sysTokenFee.toString(10))
          .plus(this.sysConfig.sysTokenFee.toString(10))
          .div(10 ** tokenInfo.decimals)
          .toString(10);
      } else {
        fee = new BigNumber(this.sysConfig.creatingMakerFee.toString(10))
          .times(3)
          .plus(this.sysConfig.sysTokenFee.toString(10))
          .plus(this.sysConfig.sysTokenFee.toString(10))
          .div(10 ** tokenInfo.decimals)
          .toString(10);
      }
    }
    if (new BigNumber(await this.getIclBalance()).lt(fee)) {
      loading.close();
      (this.$info as any)({
        content: `Insufficient balance. A minimum of ${fee} ${tokenInfo.symbol} is required to create a MM Pool.`,
        class: 'connect-plug register-mining-confirm launch-info-button',
        icon: 'connect-plug',
        okText: 'Insufficient ICL balance',
        closable: true,
        centered: true,
        onOk() {
          //
        }
      });
    } else if (allowance || (allowance !== null && Number(allowance) === 0)) {
      this.iclTokenAmount = Number(fee);
      loading.close();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      if (new BigNumber(allowance.toString(10)).div(10 ** 8).lt(fee)) {
        this.$info({
          content: `Required to allow the smart contract to spend your ICL token as a fee(${fee} ICL).`,
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Approve',
          centered: true,
          onOk() {
            (that.$refs.approve as any).visible = true;
            (that.$refs.approve as any).approveForm.amount = fee;
            (that.$refs.approve as any).approveForm.spender =
              IC_DEX_ROUTER_CANISTER_ID;
          }
        });
      } else {
        loading.close();
        this.createMakerVisible = true;
        this.initForm();
      }
    }
  }
  private async getIclBalance(): Promise<string> {
    const to = {
      owner: Principal.fromText(this.getPrincipalId),
      subaccount: []
    };
    const ICL = await this.DRC20TokenService.icrc1_balance_of(
      this.sysConfig.sysToken.toString(),
      to
    );
    return new BigNumber(ICL.toString(10))
      .div(10 ** this.tokens[this.sysConfig.sysToken.toString()].decimals)
      .decimalPlaces(4, 1)
      .toString(10);
  }
  private async toBind(pair: Principal): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    const principalAndAccountId = toPrincipalAndAccountId(
      this.bindMakerForm.account
    );
    let to;
    if (principalAndAccountId) {
      if (principalAndAccountId.principal) {
        to = principalToAccountIdentifier(
          Principal.fromText(principalAndAccountId.principal),
          principalAndAccountId.subaccount
            ? new Uint8Array(hexToBytes(principalAndAccountId.subaccount))
            : null
        );
      }
      if (principalAndAccountId.accountId) {
        to = principalAndAccountId.accountId;
      }
    }
    console.log(this.pairsMaker, this.bindMakerForm.pair, hexToBytes(to));
    const res = await this.ICDexRouterService.NFTBindMaker(
      this.bindNftTokenId,
      pair,
      hexToBytes(to)
    );
    console.log(res);
    if (res) {
      this.$message.success('Success');
      this.bindMakerVisible = false;
      this.visible = false;
      this.$emit(
        'bindSuccess',
        this.bindMakerForm.pair,
        this.bindMakerForm.account
      );
      // this.getBindingMakers();
    } else {
      this.$message.error('Error');
    }
    loading.close();
  }
  private onBind(): void {
    (this.$refs.bindMakerForm as any).validate(async (valid: any) => {
      if (valid) {
        this.toBind(this.pairsMaker[this.bindMakerForm.pair][0]);
      }
    });
  }
  private onSubmit(): void {
    if (!this.pairsMaker[this.createMakerPoolForm.pair][1].liquidity[0].price) {
      this.$message.error(
        'The pair should complete at least one trade before being allowed to create an OAMM.'
      );
      return;
    }
    (this.$refs.createMakerPoolForm as any).validate(async (valid: any) => {
      console.log(valid);
      if (valid) {
        console.log(this.pairsMaker[this.createMakerPoolForm.pair][1]);
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        const token1Id =
          this.pairsMaker[
            this.createMakerPoolForm.pair
          ][1].pair.token1[0].toString();
        const token0Id =
          this.pairsMaker[
            this.createMakerPoolForm.pair
          ][1].pair.token0[0].toString();
        const unitSize =
          this.pairsMaker[this.createMakerPoolForm.pair][1].liquidity[0]
            .unitSize;
        const token1Decimals = this.tokens[token1Id].decimals;
        const token0Decimals = this.tokens[token0Id].decimals;
        let lowerLimit = new BigNumber(
          this.pairsMaker[
            this.createMakerPoolForm.pair
          ][1].liquidity[0].price.toString(10)
        )
          .div(1_000_000_000_000)
          .decimalPlaces(0, 1)
          .toString(10);
        if (new BigNumber(lowerLimit).lt(1)) {
          lowerLimit = '1';
        }
        let upperLimit = new BigNumber(
          this.pairsMaker[
            this.createMakerPoolForm.pair
          ][1].liquidity[0].price.toString(10)
        )
          .times(1_000_000_000_000)
          .decimalPlaces(0)
          .toString(10);
        if (new BigNumber(upperLimit).lte(lowerLimit)) {
          upperLimit = new BigNumber(lowerLimit)
            .times(1_000_000_000_000)
            .decimalPlaces(0)
            .toString(10);
        }
        // ppm
        const spreadRate = new BigNumber(this.createMakerPoolForm.spreadRate)
          .div(100)
          .times(10 ** 6)
          .toString(10);
        const threshold = new BigNumber(this.createMakerPoolForm.threshold)
          .times(10 ** token1Decimals)
          .toString(10);
        let allow:
          | {
              Private: null;
            }
          | {
              Public: null;
            } = { Public: null };
        if (!this.isPublic) {
          allow = {
            Private: null
          };
        }
        const makerCreateArg: MakerCreateArg = {
          creator: [],
          name: this.createMakerPoolForm.name,
          pair: this.pairsMaker[this.createMakerPoolForm.pair][0],
          allow: allow,
          lowerLimit: BigInt(lowerLimit),
          upperLimit: BigInt(upperLimit),
          spreadRate: BigInt(spreadRate),
          threshold: BigInt(threshold),
          volFactor: BigInt(this.createMakerPoolForm.volFactor)
        };
        console.log(makerCreateArg);
        try {
          const res = await this.ICDexRouterService.maker_create(
            makerCreateArg
          );
          if (res) {
            this.$message.success('Success');
            this.createMakerVisible = false;
            this.visible = false;
            const priList = JSON.parse(localStorage.getItem('priList')) || {};
            const flag = needConnectPlug([res.toString()]);
            const connectInfinity1 = await needConnectInfinity([
              res.toString()
            ]);
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const _that = this;
            if (priList[this.getPrincipalId] === 'Plug' && flag) {
              const connectPlug = new ConnectPlug();
              this.$info({
                content: 'Maker need to be connected to the plug.',
                class: 'connect-plug',
                icon: 'connect-plug',
                okText: 'Confirm',
                onOk() {
                  connectPlug
                    .addWhitelist(res.toString())
                    .then(async (isConnect) => {
                      if (!isConnect) {
                        return;
                      }
                      if (_that.isPublic) {
                        await _that.$router.push(
                          `/ICDex/pools/pool/${res.toString()}`
                        );
                      } else {
                        await _that.$router.push(
                          `/ICDex/pools/pool/${res.toString()}?private`
                        );
                      }
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
                    .addWhitelist(res.toString())
                    .then(async (isConnect) => {
                      if (!isConnect) {
                        return;
                      }
                      if (_that.isPublic) {
                        await _that.$router.push(
                          `/ICDex/pools/pool/${res.toString()}`
                        );
                      } else {
                        await _that.$router.push(
                          `/ICDex/pools/pool/${res.toString()}?private`
                        );
                      }
                    });
                }
              });
            } else {
              if (this.isPublic) {
                await this.$router.push(`/ICDex/pools/pool/${res.toString()}`);
              } else {
                await this.$router.push(
                  `/ICDex/pools/pool/${res.toString()}?private`
                );
              }
            }
          } else {
            this.$message.error('Error');
          }
        } catch (e) {
          console.log(e);
          this.$message.error(toHttpRejectError(e));
        }
        loading.close();
      }
    });
  }
  private onDeposit(): void {
    this.onApprove();
  }
  private async onApprove(): Promise<void> {
    let spender = IC_DEX_ROUTER_CANISTER_ID;
    let spenderSuccess = IC_DEX_ROUTER_CANISTER_ID;
    if (this.type === 'ListingReferrer') {
      spender = IC_SWAP_ROUTER_CANISTER_ID_Fiduciary;
      spenderSuccess = IC_SWAP_ROUTER_CANISTER_ID_Fiduciary;
    }
    const approveRequest: ApproveRequest = {
      token: getTokenIdentifier(NFT_CANISTER_ID, Number(this.currentNft[0])),
      subaccount: [],
      allowance: BigInt(1),
      spender: Principal.fromText(spender)
    };
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();

    if (isPlug()) {
      const approve = {
        idl: NFTIdl,
        canisterId: NFT_CANISTER_ID,
        methodName: 'approve',
        args: [approveRequest],
        onSuccess: async (res) => {
          if (res) {
            // this.$message.success('Approve Success');
            if (spender === spenderSuccess) {
              localStorage.setItem(
                'approveNftVip',
                this.currentNft[0].toString(10)
              );
            }
            this.deposit(loading);
          } else {
            this.$message.error('Approve error');
            loading.close();
          }
        },
        onFail: () => {
          loading.close();
          this.$message.error('Approve error');
        }
      };
      const plugIc = (window as any).ic.plug;
      const res = await plugIc.batchTransactions([approve]);
      console.log(res);
    } else if (isInfinity()) {
      const approve = {
        idl: NFTIdl,
        canisterId: NFT_CANISTER_ID,
        methodName: 'approve',
        args: [approveRequest],
        onSuccess: async (res) => {
          if (res) {
            // this.$message.success('Approve Success');
            if (spender === spenderSuccess) {
              localStorage.setItem(
                'approveNftVip',
                this.currentNft[0].toString(10)
              );
            }
            this.deposit(loading);
          } else {
            loading.close();
            this.$message.error('Approve error');
          }
        },
        onFail: () => {
          loading.close();
          this.$message.error('Approve error');
        }
      };
      const Ic = (window as any).ic.infinityWallet;
      const res = await Ic.batchTransactions([approve]);
      console.log(res);
    } else {
      try {
        const res = await this.NftService.approve(approveRequest);
        if (res) {
          if (spender === spenderSuccess) {
            localStorage.setItem(
              'approveNftVip',
              this.currentNft[0].toString(10)
            );
          }
          this.deposit(loading);
        } else {
          this.$message.error('Approve error');
          loading.close();
        }
      } catch (e) {
        this.$message.error('Approve error');
        console.error(e);
        loading.close();
      }
    }
  }
  private async deposit(loading): Promise<void> {
    let res;
    if (this.type === 'ListingReferrer') {
      res = await this.ICSwapRouterFiduciaryService.NFTDeposit(
        Principal.fromText(NFT_CANISTER_ID),
        getTokenIdentifier(NFT_CANISTER_ID, Number(this.currentNft[0]))
      );
    } else {
      res = await this.ICDexRouterService.NFTDeposit(
        Principal.fromText(NFT_CANISTER_ID),
        getTokenIdentifier(NFT_CANISTER_ID, Number(this.currentNft[0]))
      );
    }
    loading.close();
    if (res) {
      this.currentNft = null;
      this.extPage = 0;
      this.$message.success('Success');
      localStorage.removeItem('approveNftPool');
      this.$emit('depositSuccess');
    } else {
      this.$message.error('Error');
    }
  }
  private canSubmit(nft: NFT): boolean {
    if (nft) {
      const type = Object.keys(nft[3])[0];
      if (this.type === 'CreateMaker') {
        if (
          this.isPublic &&
          (type.includes('NEPTUNE') ||
            type.includes('URANUS') ||
            type.includes('SATURN'))
        ) {
          return true;
        } else if (!this.isPublic) {
          return true;
        }
      }
      if (this.type === 'BecomeVipMaker' && type.includes('NEPTUNE')) {
        return true;
      }
      if (this.type === 'ListingReferrer' && type.includes('URANUS')) {
        return true;
      }
    }
    return false;
  }
  private canDeposit(nft: TokenExt): boolean {
    if (nft) {
      const info = this.getExtInfo(nft[2]);
      if (info.name) {
        if (this.type === 'CreateMaker') {
          if (
            this.isPublic &&
            (info.name.includes('NEPTUNE') ||
              info.name.includes('URANUS') ||
              info.name.includes('SATURN'))
          ) {
            return true;
          } else if (!this.isPublic) {
            return true;
          }
        }
        if (this.type === 'BecomeVipMaker' && info.name.includes('NEPTUNE')) {
          return true;
        }
        if (this.type === 'ListingReferrer' && info.name.includes('URANUS')) {
          return true;
        }
        if (this.type === 'mining') {
          return true;
        }
      }
    }
    return false;
  }
  private onChangePair(): void {
    const token1Id =
      this.pairsMaker[
        this.createMakerPoolForm.pair
      ][1].pair.token1[0].toString();
    if (this.tokens[token1Id]) {
      this.unit = this.tokens[token1Id].decimals;
    }
    this.token1 = this.pairsMaker[this.createMakerPoolForm.pair][1].pair.token1;
    this.token0 = this.pairsMaker[this.createMakerPoolForm.pair][1].pair.token0;
    if (this.createMakerPoolForm.lowerLimit) {
      this.createMakerPoolForm.lowerLimit = new BigNumber(
        this.createMakerPoolForm.lowerLimit
      )
        .times(10 ** this.unit)
        .decimalPlaces(0, 1)
        .div(10 ** this.unit)
        .toString(10);
    }
    if (this.createMakerPoolForm.upperLimit) {
      this.createMakerPoolForm.upperLimit = new BigNumber(
        this.createMakerPoolForm.upperLimit
      )
        .times(10 ** this.unit)
        .decimalPlaces(0, 1)
        .div(10 ** this.unit)
        .toString(10);
    }
  }
  private selectDepositedNft(nft: NFT): void {
    this.currentDepositedNft = nft;
  }
  private selectNft(nft: TokenExt): void {
    this.currentNft = nft;
  }
  private onWithdraw(nft: NFT): void {
    const type = Object.keys(nft[3])[0];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    if (type === 'NEPTUNE') {
      this.$confirm({
        content: 'Withdraw NFT will unbind Makers.',
        class: 'connect-plug',
        icon: 'connect-plug',
        centered: true,
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk() {
          const loading = that.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          if (that.type === 'ListingReferrer') {
            that.ICSwapRouterFiduciaryService.NFTWithdraw([nft[1]])
              .then(() => {
                that.$message.success('Success');
                that.$emit('NFTWithdrawSuccess');
                that.currentDepositedNft = null;
              })
              .finally(() => {
                loading.close();
              });
          } else {
            that.ICDexRouterService.NFTWithdraw([nft[1]])
              .then(() => {
                that.$message.success('Success');
                that.$emit('NFTWithdrawSuccess');
                that.currentDepositedNft = null;
              })
              .finally(() => {
                loading.close();
              });
          }
        }
      });
    } else {
      this.$confirm({
        content:
          'Withdrawing this NFT may disable the function it is linked to.',
        class: 'connect-plug',
        icon: 'connect-plug',
        centered: true,
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk() {
          console.log(nft[1]);
          const loading = that.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          if (that.type === 'ListingReferrer') {
            let flag = false;
            that.NFTStaked.some((item) => {
              if (item[1] === nft[1]) {
                if (
                  new BigNumber(item[2].toString(10))
                    .div(10 ** 6)
                    .gt(new Date().getTime())
                ) {
                  flag = true;
                }
                return true;
              }
            });
            if (flag) {
              that.$message
                .warning(`Your NFT has sponsored ${that.NFTStakedPairs} trading pairs with a
            lockup period of ${that.lockedTime} days.`);
              loading.close();
              return;
            }
            that.ICSwapRouterFiduciaryService.NFTWithdraw([nft[1]])
              .then(() => {
                that.$message.success('Success');
                that.$emit('NFTWithdrawSuccess');
                that.currentDepositedNft = null;
              })
              .finally(() => {
                loading.close();
              });
          } else {
            that.ICDexRouterService.NFTWithdraw([nft[1]])
              .then(() => {
                that.$message.success('Success');
                that.$emit('NFTWithdrawSuccess');
                that.currentDepositedNft = null;
              })
              .finally(() => {
                loading.close();
              });
          }
        }
      });
    }
  }
  private getImg(nftType: NFTType): string {
    const type = Object.keys(nftType)[0];
    if (type === 'NEPTUNE') {
      return 'https://pgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app/file/1_thumb.jpeg';
    }
    if (type === 'URANUS') {
      return 'https://pgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app/file/5_thumb.jpeg';
    }
    if (type === 'SATURN') {
      return 'https://pgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app/file/15_thumb.jpeg';
    }
    if (type === 'JUPITER') {
      return 'https://pgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app/file/126_thumb.jpeg';
    }
    if (type === 'MARS') {
      return 'https://pgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app/file/346_thumb.jpeg';
    }
    if (type === 'EARTH') {
      return 'https://pgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app/file/870_thumb.jpeg';
    }
    if (type === 'VENUS') {
      return 'https://pgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app/file/1361_thumb.jpeg';
    }
    if (type === 'MERCURY') {
      return 'https://pgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app/file/1886_thumb.jpeg';
    }
  }
  private onChangePairBind(): void {
    //
  }
  private getExtInfo(val: Array<Array<number>>): any {
    if (val && val.length) {
      return JSON.parse(Buffer.from(val[0]).toString());
    }
    return {};
  }
  private pageChangeDeposited(page: number): void {
    this.page = page - 1;
  }
  private pageChange(page: number): void {
    this.extPage = page - 1;
  }
  private afterCloseModal(): void {
    this.currentNft = null;
    this.currentDepositedNft = null;
    this.page = 0;
    this.extPage = 0;
    this.bindMakerForm.pair = undefined;
    this.bindMakerForm.account = '';
  }
  private afterCloseBind(): void {
    this.bindMakerForm.pair = undefined;
    (this.$refs.bindMakerForm as any).resetFields();
  }
  private afterClose(): void {
    this.createMakerPoolForm.pair = undefined;
    (this.$refs.createMakerPoolForm as any).resetFields();
  }
}
</script>

<style scoped lang="scss">
.nft-modal {
  ::v-deep .ant-modal-body {
    margin-top: 30px;
  }
  ::v-deep .ant-modal-close {
    top: -25px;
  }
}
.nfts-main {
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  background: #141b23;
  .err-tip {
    font-size: 12px;
  }
  .ext-info {
    padding-bottom: 0;
  }
  button {
    margin-top: 10px;
  }
}
.text-center {
  text-align: center;
}
.nft-main {
  li {
    &:nth-child(2n + 1) {
      margin-left: 15px;
    }
    &:nth-child(2n) {
      margin-right: 15px;
    }
    &:nth-child(3n + 1) {
      margin-left: 0;
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
    &.disabled {
      cursor: not-allowed;
      .checked {
        opacity: 0.5;
      }
      &.active {
        border-color: rgba(33, 199, 125, 0.2);
      }
    }
  }
}
.setting-price-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  color: #adb3c4;
  ::v-deep input {
    width: 282px;
  }
}
.setting-price-range-line {
  height: 46px;
}
@media screen and (max-width: 768px) {
  .setting-price-range {
    ::v-deep input {
      width: 100%;
    }
  }
  .nft-main {
    li {
      &:nth-child(2n + 1) {
        margin-left: 0;
      }
      &:nth-child(2n) {
        margin-right: 0;
      }
    }
  }
}
</style>
