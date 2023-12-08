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
        <p class="base-color-w">NFTs:</p>
        <div class="nfts-main">
          <div class="base-font-title">Select an NFT</div>
          <ul class="nft-main">
            <li
              v-for="(ext, index) in nfts.slice(
                extPage * extPageNum,
                (extPage + 1) * extPageNum
              )"
              :key="index"
              :class="{ active: currentNft && ext[0] === currentNft[0] }"
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
            Only Planet NEPTUNE/URANUS/SATURN cards can continue to operate.
          </div>
          <div v-if="!nfts.length" class="text-center">No NFT</div>
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
          <div class="mt20 w100">
            <button
              :disabled="!currentNft || (currentNft && !canDeposit(currentNft))"
              type="button"
              class="w100 primary"
              @click="onDeposit"
            >
              Deposit
            </button>
          </div>
        </div>
      </div>
      <div class="mt20">
        <p class="base-color-w">Deposited NFT</p>
        <div class="nfts-main">
          <div class="base-font-title">Select an NFT</div>
          <ul class="nft-main">
            <li
              v-for="(ext, index) in nftBalance.slice(
                page * pageNum,
                (page + 1) * pageNum
              )"
              :key="index"
              :class="{
                active: currentDepositedNft && ext[1] === currentDepositedNft[1]
              }"
              @click="selectDepositedNft(ext)"
            >
              <img
                v-show="
                  currentDepositedNft && ext[1] === currentDepositedNft[1]
                "
                class="checked"
                src="@/assets/img/checked.png"
                alt=""
              />
              <div class="nft-img">
                <img :src="getImg(ext[3])" alt="" />
              </div>
              <div class="ext-info">{{ Object.keys(ext[3])[0] }} CARD</div>
              <div class="ext-transfer" @click="onWithdraw(ext)">Withdraw</div>
            </li>
          </ul>
          <div
            class="err-tip"
            v-show="currentDepositedNft && !canBind(currentDepositedNft)"
          >
            Only Planet NEPTUNE cards can continue to operate.
          </div>
          <div v-if="!nftBalance.length" class="text-center">
            No Deposited NFT
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
          <div class="mt20 w100 flex-center">
            <button
              :disabled="
                !currentDepositedNft ||
                (currentDepositedNft && !canBind(currentDepositedNft))
              "
              type="button"
              class="w100 primary"
              v-if="!isBecomeMaker"
              style="margin-right: 10px"
              @click="onCreateMMPool"
            >
              Create a MM Pool
            </button>
            <button
              v-if="isBecomeMaker"
              :disabled="
                !currentDepositedNft ||
                (currentDepositedNft && !canBind(currentDepositedNft))
              "
              type="button"
              class="w100 primary"
              @click="onBindMMPool"
            >
              Bind MM NFT
            </button>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="createMakerVisible"
      width="710px"
      title="Create Maker Pool"
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
        <span class="ant-form-item-required base-font-title"
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
        </div>
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
        <a-form-model-item prop="threshold" :colon="false">
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
        <a-form-model-item prop="volFactor" :colon="false">
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
      :icl-token-amount="50"
      approve-mode="icrc1"
      ref="approve"
      @approveSuccess="approveSuccess"
    ></approve-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MakerCreateArg, NFT, NFTType } from '@/ic/ICDexRouter/model';
import { ApproveRequest, TokenExt, TokensExt } from '@/ic/nft/model';
import {
  getTokenIdentifier,
  hexToBytes,
  principalToAccountIdentifier,
  toPrincipalAndAccountId
} from '@/ic/converter';
import {
  IC_DEX_ROUTER_CANISTER_ID,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
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
import { PairTrie, SwapTokenInfo } from '@/ic/ICSwapRouter/model';
import { TokenInfo } from '@/ic/common/icType';
import { namespace } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { ICLighthouseTokenService } from '@/ic/ICLighthouseToken/ICLighthouseTokenService';
import ApproveModal from '@/components/approve/Index.vue';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';

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
  @Prop({ type: Boolean, default: () => false })
  private isBecomeMaker!: boolean;
  @Prop({ type: Object, default: () => null })
  private tokens!: { [key: string]: TokenInfo };
  @Prop({ type: Array, default: () => [] })
  private pairsMaker!: Array<PairTrie>;

  private visible = false;
  private extPage = 0;
  private extPageNum = 3;
  private currentNft: TokenExt = null;
  private page = 0;
  private pageNum = 3;
  private currentDepositedNft: NFT = null;
  private NftService: NftService = null;
  private ICDexRouterService: ICDexRouterService = null;
  private ICLighthouseTokenService: ICLighthouseTokenService;
  private DRC20TokenService: DRC20TokenService;
  private createMakerVisible = false;
  private bindNftTokenId = '';
  private unit = 8;
  private token1: SwapTokenInfo = null;
  private token0: SwapTokenInfo = null;
  private createMakerPoolForm = {
    name: '',
    pair: undefined,
    allow: '',
    lowerLimit: '',
    upperLimit: '',
    spreadRate: '',
    threshold: '',
    volFactor: ''
  };
  private createMakerPoolFormRules = {
    pair: [
      { required: true, message: 'Please select a pair', trigger: 'change' }
    ],
    name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
    lowerLimit: [
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
    ],
    spreadRate: [
      {
        required: true,
        message: 'Please enter spread rate',
        trigger: ['change', 'blur']
      }
    ],
    threshold: [
      { required: true, message: 'Please enter threshold', trigger: 'blur' }
    ],
    volFactor: [
      { required: true, message: 'Please enter vol factor', trigger: 'blur' }
    ]
  };
  private validateUpperLimit(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void {
    if (new BigNumber(value).lte(0)) {
      callback('Upper Limit must be less than 0');
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
      callback('Lower Limit must be less than 0');
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
  created(): void {
    this.NftService = new NftService();
    this.ICDexRouterService = new ICDexRouterService();
    this.ICLighthouseTokenService = new ICLighthouseTokenService();
    this.DRC20TokenService = new DRC20TokenService();
  }
  private bindMMPoolInit(pair: string, pool: string): void {
    if (pair && pool) {
      this.bindMakerForm.pair = pair;
      this.bindMakerForm.account = pool;
    } else {
      this.bindMakerForm.pair = undefined;
      this.bindMakerForm.account = '';
    }
    this.visible = true;
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
      IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
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
  private approveSuccess(): void {
    this.createMakerVisible = true;
  }
  private async onCreateMMPool(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const allowance = await this.getAllowance();
    console.log(allowance);
    if (new BigNumber(await this.getIclBalance()).lt(50.01)) {
      loading.close();
      this.$info({
        content:
          'Insufficient balance. A minimum of 50.01 ICL is required to create a MM Pool.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        centered: true,
        onOk() {
          //
        }
      });
    } else if (allowance || (allowance !== null && Number(allowance) === 0)) {
      loading.close();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      if (new BigNumber(allowance.toString(10)).div(10 ** 8).lt(50)) {
        this.$info({
          content:
            'Required to allow the smart contract to spend your ICL token as a fee(50 ICL / creating MM Pool).',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Approve',
          centered: true,
          onOk() {
            (that.$refs.approve as any).visible = true;
            (that.$refs.approve as any).approveForm.spender =
              IC_DEX_ROUTER_CANISTER_ID;
          }
        });
      } else {
        loading.close();
        that.createMakerVisible = true;
      }
    }
  }
  private async getIclBalance(): Promise<string> {
    const ICL = await this.ICLighthouseTokenService.getBalance(
      this.getPrincipalId
    );
    return new BigNumber(ICL.toString(10))
      .div(10 ** 8)
      .decimalPlaces(4, 1)
      .toString(10);
  }
  private async toBind(pair: Principal): Promise<void> {
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
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
    (this.$refs.createMakerPoolForm as any).validate(async (valid: any) => {
      console.log(valid);
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
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
        const lowerLimit = new BigNumber(this.createMakerPoolForm.lowerLimit)
          .times(10 ** token1Decimals)
          .times(new BigNumber(unitSize.toString(10)).div(10 ** token0Decimals))
          .toString(10);
        const upperLimit = new BigNumber(this.createMakerPoolForm.upperLimit)
          .times(10 ** token1Decimals)
          .times(new BigNumber(unitSize.toString(10)).div(10 ** token0Decimals))
          .toString(10);
        // ppm
        const spreadRate = new BigNumber(this.createMakerPoolForm.spreadRate)
          .div(100)
          .times(10 ** 6)
          .toString(10);
        const threshold = new BigNumber(this.createMakerPoolForm.threshold)
          .times(10 ** token1Decimals)
          .toString(10);
        const makerCreateArg: MakerCreateArg = {
          name: this.createMakerPoolForm.name,
          pair: this.pairsMaker[this.createMakerPoolForm.pair][0],
          allow: { Public: null }, // todo Public
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
                      await _that.$router.push(
                        `/ICDex/pools/pool/${res.toString()}`
                      );
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
                      await _that.$router.push(
                        `/ICDex/pools/pool/${res.toString()}`
                      );
                    });
                }
              });
            } else {
              this.$router.push(`/ICDex/pools/pool/${res.toString()}`);
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
    const spender = IC_DEX_ROUTER_CANISTER_ID;
    const approveRequest: ApproveRequest = {
      token: getTokenIdentifier(NFT_CANISTER_ID, Number(this.currentNft[0])),
      subaccount: [],
      allowance: BigInt(1),
      spender: Principal.fromText(spender)
    };
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });

    if (isPlug()) {
      const approve = {
        idl: NFTIdl,
        canisterId: NFT_CANISTER_ID,
        methodName: 'approve',
        args: [approveRequest],
        onSuccess: async (res) => {
          if (res) {
            // this.$message.success('Approve Success');
            if (spender === IC_DEX_ROUTER_CANISTER_ID) {
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
            if (spender === IC_DEX_ROUTER_CANISTER_ID) {
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
          if (spender === IC_DEX_ROUTER_CANISTER_ID) {
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
    const res = await this.ICDexRouterService.NFTDeposit(
      Principal.fromText(NFT_CANISTER_ID),
      getTokenIdentifier(NFT_CANISTER_ID, Number(this.currentNft[0]))
    );
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
  private canBind(nft: NFT): boolean {
    if (nft) {
      const type = Object.keys(nft[3])[0];
      if (type && type === 'NEPTUNE') {
        return true;
      }
    }
    return false;
  }
  private canDeposit(nft: TokenExt): boolean {
    if (nft) {
      const info = this.getExtInfo(nft[2]);
      if (
        info.name &&
        (info.name.includes('NEPTUNE') ||
          info.name.includes('URANUS') ||
          info.name.includes('SATURN'))
      ) {
        return true;
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
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
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
        that.ICDexRouterService.NFTWithdraw([nft[1]])
          .then(() => {
            that.$message.success('Success');
            that.$emit('NFTWithdrawSuccess');
          })
          .finally(() => {
            loading.close();
          });
      }
    });
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
