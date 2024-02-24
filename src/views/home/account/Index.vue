<template>
  <div class="wallet-main container-width">
    <div v-if="getPrincipalId">
      <div class="wallet-header base-font-title">
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
      </div>
      <div class="wallet-item">
        <ledger
          :identity="getIdentity"
          :principal="getPrincipalId"
          type="cross"
          ref="ledger1"
          @topUpSuccess="topUpSuccess"
          @addTokenSuccess="addTokenSuccess"
        ></ledger>
      </div>
      <div class="wallet-item">
        <p class="base-title-size">IC network</p>
        <ledger
          :identity="getIdentity"
          :principal="getPrincipalId"
          type="ic"
          ref="ledger"
          @topUpSuccess="topUpSuccess"
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
            <button type="button" @click="onAddToken">Add Token</button>
          </p>
          <div class="wallet-item-table">
            <added-tokens
              :principal="getPrincipalId"
              ref="addedTokens"
              :identity="getIdentity"
            ></added-tokens>
          </div>
        </div>
      </div>
      <div class="wallet-item wallet-item-no-border">
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
            <button type="button" @click="onCreateWallet">Create Wallet</button>
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
                  :identity="getIdentity"
                  :wallet="wallet"
                  :ref="'cyclesWallet' + index"
                ></cycles-wallet>
              </tbody>
            </table>
          </a-spin>
        </div>
      </div>
      <div class="wallet-item wallet-item-no-border">
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
            <div class="no-nft-data" v-show="!nftSpinning && !tokensExt.length">
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
        :identity="getIdentity"
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
          <button type="button" @click="metaMaskVisible = false">Cancel</button>
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
        :identity="identity"
        :wallet-id="currentWallet.walletId.toString()"
        :cycles="currentWallet.cycles"
        ref="cyclesCreateWallet"
      ></create-wallet>
    </div>
    <div v-else>
      <div class="wallet-empty container-width">
        <img src="@/assets/img/empty.png" alt="" />
        <p>Connect wallet to view</p>
        <button type="button" class="default" @click="connectWallet">
          Connect Wallet
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import MetaMaskOnboarding from '@metamask/onboarding';
import CyclesWallet from '@/views/home/account/components/CyclesWallet.vue';
import Ledger from '@/views/home/account/components/Ledger.vue';
import CreateWallet from '@/views/home/account/components/CreateWallet.vue';
import AddedTokens from '@/views/home/account/components/AddedTokens.vue';
import { namespace } from 'vuex-class';
import {
  encryptMessage,
  getEthereumAccount,
  NFT_CANISTER_ID,
  validatePrincipal
} from '@/ic/utils';
import {
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
import { PrincipalString } from '@/ic/common/icType';
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
// const plugIc = (window as any).ic;

const commonModule = namespace('common');
let ethereum = (window as any).ethereum;
if (ethereum && ethereum.providers) {
  ethereum = ethereum.providers.find(
    (provider) => provider.isMetaMask
  );
}

@Component({
  name: 'Index',
  components: {
    CyclesWallet,
    Ledger,
    CreateWallet,
    AddedTokens
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
  get identiconImg(): string {
    if (this.account) {
      return (
        'data:image/png;base64,' + new Identicon(this.account, 40).toString()
      );
    }
    return '';
  }
  async mounted(): Promise<void> {
    this.ICLighthouseService = new ICLighthouseService();
    this.ckETHMinterService = new ckETHMinterService();
    this.walletService = new WalletService();
    this.NftService = new NftService();
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const principal = localStorage.getItem('principal');
    if ((window as any).icx) {
      this.isIcx = !!(window as any).icx;
      EventBus.$on('initSuccess', () => {
        this.init();
      });
      if (principal) {
        await initIcx();
      }
    }
    if (priList[principal]) {
      if (priList[principal] === 'Plug') {
        this.loginType = 'Plug';
      } else if (priList[principal] === 'Infinity') {
        this.loginType = 'Infinity';
      } else if (priList[principal] === 'AuthClient') {
        this.loginType = 'Internet Identity';
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
  private init(): void {
    // this.getInfo();
    this.getWallets();
    // this.getEthConnect();
    this.openNotification();
    this.getTokensExt();
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
      console.log(res);
      const tokensExt = (
        res as {
          ok: TokensExt;
        }
      ).ok;
      if (tokensExt && tokensExt.length) {
        this.tokensExt = tokensExt;
        console.log(tokensExt.length);
      } else {
        this.tokensExt = [];
      }
    } catch (e) {
      console.error(e);
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
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      text: 'Error creating wallet, trying to retry for you.',
      background: 'rgba(0, 0, 0, 0.6)'
    });
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
          console.log(Err);
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
  private onAddToken(): void {
    this.$refs.addedTokens.visible = true;
  }
  public async getNotice(): Promise<void> {
    const res = await this.ICLighthouseService.getNotice();
    console.log(res);
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
    if (priList[this.getPrincipalId] === 'Plug' && flag) {
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
            _that.$refs.ledger.getBalance();
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
            _that.$refs.ledger.getBalance();
          });
        }
      });
    } else {
      if ((window as any).icx) {
        console.log('connectIcx');
        await addIcxWhitelist(walletId.toString());
      }
      this.getBalance();
      this.$refs.ledger.getBalance();
    }
  }
  private showTransferToken(NFTIndex: bigint): void {
    this.NFTIndex = Number(NFTIndex);
    this.visibleTransferNFT = true;
    console.log(getTokenIdentifier(NFT_CANISTER_ID, this.NFTIndex));
  }
  private async transferNFT(): Promise<void> {
    this.$refs.transferNFTForm.validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
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
            console.log(res);
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
            console.log(res);
          } else {
            const res = await this.NftService.transfer(transferRequest);
            this.transferNFTSuccess(res);
            loading.close();
          }
        } catch (e) {
          loading.close();
          console.error(e);
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
    console.log(index);
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
          if (priList[this.getPrincipalId] === 'Plug' && flag) {
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
                      console.log(e);
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
                      console.log(e);
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
              console.log('connectIcx');
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
          console.log(e);
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
      if (priList[this.getPrincipalId] === 'Plug' && flag) {
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
          console.log('connectIcx');
          await addIcxWhitelist(wallet.toString());
        }
        this.visibleManageWallet = false;
      }
      // this.getWallets();
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }
    this.walletSpinning = false;
    this.connectPlug();
  }
  private async connectPlug(): Promise<void> {
    const tokens = await this.ICLighthouseService.getTokens();
    const ckETHTokens = await this.ckETHMinterService.getCkTokens();
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
    canisterIds = [...new Set(canisterIds)];
    const flag = needConnectPlug(canisterIds);
    console.log(flag, this.$route);
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const connectInfinity = await needConnectInfinity(canisterIds);
    if (
      priList[this.getPrincipalId] === 'Plug' &&
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
        console.log('connectIcx');
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
        console.error(error);
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
.token-title {
  button {
    margin-left: auto;
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
@media screen and (max-width: 768px) {
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
