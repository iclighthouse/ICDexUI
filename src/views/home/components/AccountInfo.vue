<template>
  <div class="account-info">
    <slot></slot>
    <div class="current-account" v-if="getPrincipalId">
      <span class="flex-center" v-show="!accountName[getPrincipalId]">
        <img :src="accountImg" alt="account" />
        <copy-account
          :front="8"
          :account="getPrincipalId"
          copy-text="Principal ID"
        ></copy-account>
      </span>
      <span class="flex-center" v-show="accountName[getPrincipalId]">
        <img :src="accountImg" alt="account" />
        <span>{{ accountName[getPrincipalId] }}</span>
        <span class="flex-center" style="margin-left: 5px; font-size: 12px">
          (<copy-account
            :front="4"
            :account="getPrincipalId"
            copy-text="Principal ID"
          ></copy-account
          >)
        </span>
      </span>
      <a-icon
        @click="setName"
        type="edit"
        style="margin-left: 5px"
        class="pointer"
      />
      <router-link
        v-show="!$route.fullPath.toLocaleLowerCase().startsWith('/account')"
        to="/account"
      >
        <img src="@/assets/img/wallet.svg" class="wallet-icon" alt="" />
      </router-link>
    </div>
    <a-dropdown placement="bottomRight" v-if="getPrincipalId && !isIcx">
      <div class="user-menu">
        <a-icon class="user-icon" type="user" />
        <img class="current-account-min" :src="accountImg" alt="account" />
      </div>
      <a-menu
        slot="overlay"
        class="user-setting base-bg-box user-setting-account"
      >
        <a-menu-item
          v-if="activeKey"
          class="user-setting-item"
          @click="showTab"
        >
          <div class="user-setting-item-setting">
            <a-icon
              v-if="getIdentity && getIdentity.toJSON()[1].length <= 64"
              class="account-setting"
              type="setting"
            />
            <span>Setting</span>
          </div>
        </a-menu-item>
        <a-menu-item class="user-setting-item" @click="logout">
          <div class="user-setting-item-setting">
            <a-icon type="logout" /><span>Logout</span>
          </div>
        </a-menu-item>
        <a-menu-item
          v-for="(principal, index) in principalList"
          :key="index"
          @click="changeAccount(principal)"
        >
          <div
            class="user-principal user-setting-item-setting"
            v-if="principal !== getPrincipalId"
          >
            <span class="flex-center" v-show="!accountName[principal]">
              <img :src="getAccountImg(principal)" alt="" />
              <copy-account
                :account="principal"
                placement="left"
                :is-copy="false"
                copy-text="Principal ID"
                class="user-setting-item-setting-copy"
              ></copy-account>
            </span>
            <span class="flex-center" v-show="accountName[principal]">
              <img :src="getAccountImg(getPrincipalId)" alt="" />
              <span>{{ accountName[principal] }}</span>
              <span class="flex-center" style="margin-left: 3px">
                (<copy-account
                  :front="4"
                  placement="left"
                  :is-copy="false"
                  :account="principal"
                  copy-text="Principal ID"
                ></copy-account
                >)
              </span>
            </span>
            <img class="source-img" :src="getSourceImg(principal)" alt="" />
          </div>
          <a-tooltip
            class="user-principal check-account"
            v-else
            placement="left"
          >
            <template slot="title">
              <span>{{ getPrincipalId }}</span>
            </template>
            <div class="user-setting-item-setting">
              <span class="flex-center" v-show="!accountName[principal]">
                <img :src="getAccountImg(principal)" alt="" /><span>{{
                  getPrincipalId | ellipsisAccount
                }}</span>
              </span>
              <span class="flex-center" v-show="accountName[principal]">
                <img :src="getAccountImg(getPrincipalId)" alt="" />
                <span>{{ accountName[principal] }}</span>
                <span class="flex-center" style="margin-left: 3px">
                  (<copy-account
                    :front="4"
                    :account="principal"
                    copy-text="Principal ID"
                  ></copy-account
                  >)
                </span>
              </span>
              <a-icon
                @click="setName"
                style="margin-left: 5px"
                class="pointer"
                type="setting"
              />
              <a-icon class="check-account-icon" type="check-circle" />
              <img class="source-img" :src="getSourceImg(principal)" alt="" />
            </div>
          </a-tooltip>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <router-link to="/account">
      <img
        v-if="
          getPrincipalId &&
          !isIcx &&
          !$route.fullPath.toLocaleLowerCase().startsWith('/account')
        "
        src="@/assets/img/wallet.svg"
        class="h5-menu wallet-icon"
        alt=""
      />
    </router-link>
    <div v-if="isIcx && getPrincipalId" class="current-account-h5 h5-show">
      <img :src="accountImg" alt="account" />
      <copy-account
        :account="getPrincipalId"
        :show-copy="false"
        copy-text="Principal ID"
      ></copy-account>
    </div>
    <a-dropdown
      v-if="getPrincipalId && !menuList.length"
      placement="bottomRight"
    >
      <a-icon class="base-font-normal h5-menu" type="menu" />
      <a-menu slot="overlay" class="user-setting base-bg-box medium-menu">
        <a-menu-item
          class="user-setting-item"
          @click="changeMenu('account', '/account')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/account')
          }"
        >
          <router-link to="/account">
            <span>Wallet</span>
          </router-link>
        </a-menu-item>
        <a-menu-item
          class="user-setting-item"
          @click="changeMenu('nns', '/nns')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/nns')
          }"
        >
          <router-link to="/nns">
            <span>NNS</span>
          </router-link>
        </a-menu-item>
        <a-menu-item
          class="user-setting-item"
          @click="changeMenu('ICSNS', '/ICSNS')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/icsns')
          }"
        >
          <router-link to="/ICSNS">
            <span>SNS</span>
          </router-link>
        </a-menu-item>
        <a-menu-item
          class="user-setting-item"
          @click="changeMenu('ICDex', '/ICDex')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/icdex')
          }"
        >
          <router-link to="/ICDex">
            <span>ICDex</span>
          </router-link>
        </a-menu-item>
        <a-menu-item
          class="user-setting-item"
          @click="changeMenu('NFT', '/NFT')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/nft')
          }"
        >
          <router-link to="/nft">
            <span>NFT</span>
          </router-link>
        </a-menu-item>
        <a-menu-item
          class="user-setting-item"
          @click="changeMenu('Airdrop', '/Airdrop')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/airdrop')
          }"
        >
          <router-link to="/nft">
            <span>Airdrop</span>
          </router-link>
        </a-menu-item>
        <a-menu-item
          class="user-setting-item"
          @click="changeMenu('dapps', '/dapps')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/dapps')
          }"
        >
          <router-link to="/dapps">
            <span>DApps</span>
          </router-link>
        </a-menu-item>
        <!--<a-menu-item
          class="user-setting-item"
          @click="changeMenu('ICDex', '/ICDex')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/icdex')
          }"
        >
          <router-link to="/ICDex">
            <span>Trade</span>
          </router-link>
        </a-menu-item>
        <a-menu-item
          class="user-setting-item"
          @click="changeMenu('market', '/market/icdex')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/market')
          }"
        >
          <router-link to="/market">
            <span>Market</span>
          </router-link>
        </a-menu-item>
        <a-menu-item
          class="user-setting-item"
          @click="changeMenu('/icl', '/icl/tradingMining')"
          :class="{
            active: $route.fullPath
              .toLocaleLowerCase()
              .startsWith('/icl/tradingmining')
          }"
        >
          <router-link to="/icl/tradingMining">
            <span>Mining</span>
          </router-link>
        </a-menu-item>-->
        <a-menu-item class="user-setting-item">
          <a
            href="https://ic.house"
            target="_blank"
            rel="nofollow noreferrer noopener"
            >ICHouse</a
          >
        </a-menu-item>
        <a-menu-item
          v-if="
            hostname &&
            hostname !== 'avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app' &&
            hostname !== 'pk6zh-iiaaa-aaaaj-ainda-cai.raw.ic0.app'
          "
          class="user-setting-item"
        >
          <a
            :href="
              hostHref.replace(
                hostname,
                'avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app'
              )
            "
            target="_blank"
            rel="nofollow noreferrer noopener"
            >OldVersion</a
          >
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-dropdown
      v-if="getPrincipalId && menuList.length && !isIcx"
      placement="bottomRight"
    >
      <a-icon class="base-font-normal h5-menu" type="menu" />
      <a-menu slot="overlay" class="user-setting base-bg-box medium-menu">
        <a-menu-item
          v-for="(menu, index) in menuList"
          :key="index"
          class="user-setting-item"
          :class="{
            active:
              $route.path.toLocaleLowerCase() === menu.path.toLocaleLowerCase()
          }"
        >
          <router-link :to="menu.path">
            <span>{{ menu.value }}</span>
          </router-link>
        </a-menu-item>
        <a-menu-item
          v-if="
            hostname &&
            hostname !== 'avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app' &&
            hostname !== 'pk6zh-iiaaa-aaaaj-ainda-cai.raw.ic0.app'
          "
          class="user-setting-item"
        >
          <a
            :href="
              hostHref.replace(
                hostname,
                'avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app'
              )
            "
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <span>OldVersion</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <button
      v-if="!getPrincipalId"
      @click="connectWallet"
      type="button"
      class="margin-left-auto default"
    >
      Connect Wallet
    </button>
    <a-modal
      v-model="visible"
      centered
      title="Setting"
      width="550px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <div class="setting-content">
        <ul>
          <li :class="{ active: activeKey === 1 }" @click="changeTab(1)">
            Seed phrase
          </li>
          <li :class="{ active: activeKey === 2 }" @click="changeTab(2)">
            PEM private key
          </li>
        </ul>
        <div v-show="activeKey === 1" class="tab-tip">
          <div v-if="phraseStep === 0">
            <p>
              Note: Leaking the seed phrase will lose control of the account,
              please make sure the screen display is secure.
            </p>
            <button
              type="button"
              class="default w100 mt20"
              @click="phraseStep = 1"
            >
              I confirm to show seed phrase
            </button>
          </div>
          <a-form-model v-if="phraseStep === 1">
            <a-form-model-item label="Enter Password">
              <a-input-password
                placeholder="input password"
                v-model="password"
              />
            </a-form-model-item>
            <button
              type="button"
              class="default w100 mt20"
              @click="decryptPhrase"
            >
              Confirm
            </button>
          </a-form-model>
          <div v-if="phraseStep === 2">
            <div class="recovery-phrase">
              Secret Recovery Phrase
              <span
                class="copy-phrase"
                v-clipboard:copy="this.mnemonicList.join(' ')"
                v-clipboard:success="onCopy"
              >
                <a-icon type="copy" /> Copy
              </span>
            </div>
            <span
              class="mnemonic-item"
              v-for="(item, index) in mnemonicList"
              :key="index"
            >
              {{ item }}{{ index === mnemonicList.length - 1 ? '' : '&nbsp;' }}
            </span>
            <button
              type="button"
              class="default w100 mt20"
              @click="initPhraseStep"
            >
              I have copied
            </button>
          </div>
        </div>
        <div v-show="activeKey === 2" class="tab-tip">
          <div v-if="pemStep === 0">
            <p>
              Note: Leaking the PEM private key file will lose control of the
              account, please make sure is secure.
            </p>
            <button
              type="button"
              class="default w100 mt20"
              @click="pemStep = 1"
            >
              I confirm to download private key
            </button>
          </div>
          <a-form-model v-if="pemStep === 1">
            <a-form-model-item label="Enter Password">
              <a-input-password
                placeholder="input password"
                v-model="password"
              />
            </a-form-model-item>
            <button
              type="button"
              class="default w100 mt20"
              @click="downloadPem"
            >
              Download pem file
            </button>
          </a-form-model>
          <!--<div>
							<p>Run the following command</p>
							<div>
								In order to use your account in DFX, run the following
								command, using the .pem file download as route.
							</div>
							<button class="default w100 mt20" @click="downloadPem">
								Download pem file
							</button>
						</div>-->
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="nameVisible"
      centered
      :title="nameVisibleTitle"
      width="550px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="close"
    >
      <a-form-model :model="nameForm" ref="nameForm" :rules="nameRules">
        <a-form-model-item label="Name" prop="name">
          <a-input
            v-model="nameForm.name"
            autocomplete="off"
            placeholder="Name"
          />
        </a-form-model-item>
        <a-form-model-item>
          <button
            @click="onSubmitName"
            type="button"
            class="primary large-primary w100 mt20"
          >
            Submit
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { principalToAccountIdentifier } from '@/ic/converter';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { Principal } from '@dfinity/principal';
import Identicon from 'identicon.js';
import { namespace } from 'vuex-class';
import { decrypt } from '@/ic/utils';
import AuthClientAPi from '@/ic/AuthClientApi';
import { Menu } from '@/components/menu/model';
import { connectIcx } from '@/ic/connectIcx';
import EventBus from '@/utils/Event';
import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';

const commonModule = namespace('common');
const KeyEncoder = require('key-encoder').default;

@Component({
  name: 'AccountInfo',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Array, default: () => [] })
  private menuList!: Menu[];
  @commonModule.Mutation('SET_SHOW_CHECK_AUTH') setCheckAuth?: any;
  @commonModule.Mutation('SET_IDENTITY') setIdentity?: any;
  @commonModule.Mutation('SET_PRINCIPAL_ID') setPrincipalId?: any;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @commonModule.Getter('getIdentity') getIdentity?:
    | Secp256k1KeyIdentity
    | Ed25519KeyIdentity;
  @commonModule.Getter('getAccountName') getAccountName?: string;
  @commonModule.Mutation('SET_ACCOUNT_NAME') setAccountName?: any;
  private principalList: Array<string> = [];
  private priList = {};
  private isIcx = false;
  private activeKey = 1;
  private encryptSeedPhrase = '';
  private visible = false;
  private password = '';
  private mnemonicList = [];
  private phraseStep = 0;
  private pemStep = 0;
  public defaultSelectedKeys = 'account';
  private hostname = '';
  private hostHref = '';
  private nameVisible = false;
  private nameVisibleTitle = 'Set account name';
  private nameForm = {
    name: ''
  };
  private nameRules = {
    name: [
      {
        required: true,
        message: 'Please enter name',
        trigger: 'change'
      }
    ]
  };
  private ICLighthouseService: ICLighthouseService;
  private accountName: { [key: string]: string } = {};
  get accountImg(): string {
    if (this.getPrincipalId) {
      return this.getAccountImg(this.getPrincipalId);
    }
    return '';
  }
  mounted(): void {
    this.hostname = window.location.hostname;
    this.hostHref = window.location.href;
    this.isIcx = !!(window as any).icx;
  }
  created(): void {
    this.ICLighthouseService = new ICLighthouseService();
    this.getAccountInfo();
    if (this.getPrincipalId) {
      this.getCAccountName(this.getPrincipalId);
      this.accountName = JSON.parse(localStorage.getItem('accountName')) || {};
    }
  }
  private async connectWallet(): Promise<void> {
    if ((window as any).icx) {
      const icxCanisterIds: Array<string> =
        JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
      const isConnect = await connectIcx(icxCanisterIds);
      // this.initSuccess();
      if (this.$route.fullPath.toLocaleLowerCase().startsWith('/icdex')) {
        EventBus.$emit('initSuccess');
      }
      if (isConnect) {
        if (this.$route.fullPath.toLocaleLowerCase().startsWith('/account')) {
          EventBus.$emit('initAccount');
        }
      }
    } else {
      this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    }
  }
  private changeMenu(item: string, path: string): void {
    this.defaultSelectedKeys = item;
    this.$router.push(path);
  }
  private getAccountInfo(): void {
    if (!this.getPrincipalId) {
      this.activeKey = 0;
      return;
    }
    this.priList = JSON.parse(localStorage.getItem('priList')) || {};
    this.principalList = Object.keys(this.priList);
    this.principalList.forEach((principal) => {
      this.getCAccountName(principal);
    });
    if (
      this.priList[this.getPrincipalId] !== 'Plug' &&
      this.priList[this.getPrincipalId] !== 'Infinity' &&
      this.priList[this.getPrincipalId] !== 'AuthClient'
    ) {
      this.encryptSeedPhrase = this.principalList[this.getPrincipalId];
      const phraseList = JSON.parse(localStorage.getItem('phraseList')) || {};
      let encryptSeedPhrase = phraseList[this.getPrincipalId];
      if (typeof encryptSeedPhrase === 'string') {
        encryptSeedPhrase = JSON.parse(encryptSeedPhrase);
      }
      console.log(encryptSeedPhrase);
      if (!encryptSeedPhrase) {
        this.activeKey = 0;
      }
    } else {
      this.activeKey = 0;
    }
  }
  private getSourceImg(principal: string): string {
    if (!principal || !this.priList[principal]) {
      return '';
    }
    if (this.priList[principal]) {
      if (this.priList[principal] === 'Plug') {
        return require('@/assets/img/plug.png');
      } else if (this.priList[principal] === 'Infinity') {
        return require('@/assets/img/infinity.png');
      } else if (this.priList[principal] === 'AuthClient') {
        return require('@/assets/img/dfinity.png');
      } else if (this.priList[principal].includes('MetaMask')) {
        return require('@/assets/img/MetaMask.png');
      } else {
        return require('@/assets/img/logo-i.png');
      }
    }
  }
  private getAccountImg(principal: string) {
    if (principal) {
      const account = principalToAccountIdentifier(
        Principal.fromText(principal)
      );
      return 'data:image/png;base64,' + new Identicon(account, 20).toString();
    }
    return '';
  }
  private changeTab(key: number): void {
    this.activeKey = key;
    if (key !== 1) {
      this.initPhraseStep();
    } else {
      this.initPemStep();
    }
  }
  private initPemStep(): void {
    this.pemStep = 0;
    this.password = '';
  }
  private initPhraseStep(): void {
    this.phraseStep = 0;
    this.password = '';
    this.mnemonicList = [];
  }
  private onCopy(): void {
    this.$message.success('Copied!');
  }
  private async changeAccount(principal: string): Promise<void> {
    if (principal === this.getPrincipalId) {
      return;
    }
    if (this.priList[principal] && this.priList[principal] === 'AuthClient') {
      const authClientAPi = await AuthClientAPi.create();
      const identity = authClientAPi.tryGetIdentity();
      if (identity) {
        await authClientAPi.logout();
      }
    }
    localStorage.setItem('principal', principal);
    this.setPrincipalId(principal);
    this.setIdentity(null);
    if (this.priList[principal]) {
      if (this.priList[principal] === 'AuthClient') {
        await this.$router.replace({
          path: '/sign/authClient',
          query: { redirect: this.$route.fullPath }
        });
      } else if (this.priList[principal] === 'Plug') {
        await this.$router.replace({
          path: '/sign/plug',
          query: { redirect: this.$route.fullPath }
        });
      } else if (this.priList[principal] === 'Infinity') {
        await this.$router.replace({
          path: '/sign/Infinity',
          query: { redirect: this.$route.fullPath }
        });
      } else if (this.priList[principal].includes('MetaMask')) {
        await this.$router.replace({
          path: '/sign/MetaMask',
          query: { redirect: this.$route.fullPath }
        });
      } else {
        await this.$router.replace({
          path: '/sign',
          query: { redirect: this.$route.fullPath }
        });
      }
    }
    this.setCheckAuth(false);
  }
  private decryptPhrase(): void {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    setTimeout(async () => {
      try {
        const phraseList = JSON.parse(localStorage.getItem('phraseList')) || {};
        let encryptSeedPhrase = phraseList[this.getPrincipalId];
        if (typeof encryptSeedPhrase === 'string') {
          encryptSeedPhrase = JSON.parse(encryptSeedPhrase);
        }
        let salt = 'ICLightHouse';
        let data = encryptSeedPhrase;
        if (encryptSeedPhrase.salt) {
          salt = encryptSeedPhrase.salt;
          data = encryptSeedPhrase.encryptSeedPhrase;
        }
        const seedPhrase = await decrypt(data, this.password, salt);
        this.phraseStep = 2;
        this.mnemonicList = seedPhrase.split(' ');
        loading.close();
      } catch (e) {
        loading.close();
        console.log(e);
        this.$message.config({ top: '40%' });
        this.$message.error("Password doesn't match");
      }
    }, 50);
  }
  private downloadPem(): void {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    setTimeout(async () => {
      let identityJson;
      let keyEncoder;
      try {
        const encryptIdentity = JSON.parse(
          JSON.parse(localStorage.getItem('priList'))[this.getPrincipalId]
        );
        console.log(encryptIdentity);
        let salt = 'ICLightHouse';
        let data = encryptIdentity;
        if (encryptIdentity.salt) {
          salt = encryptIdentity.salt;
          data = encryptIdentity.encryptIdentity;
        }
        identityJson = await decrypt(data, this.password, salt);
        loading.close();
      } catch (e) {
        loading.close();
        console.log(e);
        this.$message.config({ top: '40%' });
        this.$message.error("Password doesn't match");
        return;
      }
      const privateKey = JSON.parse(identityJson)[1];
      keyEncoder = new KeyEncoder('secp256k1');
      const res = keyEncoder.encodePrivate(privateKey, 'raw', 'pem');
      const eLink = document.createElement('a');
      eLink.download = 'identity.pem';
      eLink.style.display = 'none';
      const blob = new Blob([res], {
        type: 'text/plain'
      });
      eLink.href = URL.createObjectURL(blob);
      document.body.appendChild(eLink);
      eLink.click();
      document.body.removeChild(eLink);
    }, 50);
  }
  private showTab(): void {
    this.visible = true;
    if (!this.encryptSeedPhrase) {
      this.activeKey = 2;
    } else {
      this.activeKey = 1;
    }
    this.initPhraseStep();
    this.initPemStep();
  }
  private async logout(): Promise<void> {
    const authClientAPi = await AuthClientAPi.create();
    const identity = authClientAPi.tryGetIdentity();
    if (identity) {
      await authClientAPi.logout();
    }
    const principal = localStorage.getItem('principal');
    if (this.priList[principal] === 'Plug') {
      (window as any).ic.plug.disconnect();
    }
    if (this.priList[principal] === 'Infinity') {
      (window as any).ic.infinityWallet.disconnect();
    }
    localStorage.removeItem('principal');
    this.setPrincipalId(null);
    this.setCheckAuth(false);
    this.setIdentity(null);
    await this.$router.replace('/loginByExists');
  }
  private setName(): void {
    if (this.getAccountName) {
      this.nameVisibleTitle = 'Update account name';
      this.nameForm.name = this.getAccountName;
    }
    this.nameVisible = true;
  }
  private onSubmitName(): void {
    (this.$refs.nameForm as any).validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await this.ICLighthouseService.updateAccountName(this.nameForm.name);
        this.$message.success('Success');
        this.getCAccountName(this.getPrincipalId);
        this.nameVisible = false;
        loading.close();
      }
    });
  }
  private close(): void {
    (this.$refs.nameForm as Vue & WrappedFormUtils).resetFields();
  }
  private async getCAccountName(principalId: string): Promise<void> {
    const res = await this.ICLighthouseService.getAccountName(
      Principal.fromText(principalId)
    );
    console.log(res);
    if (res && res[1]) {
      this.setAccountName(res[1][0]);
      const accountName = JSON.parse(localStorage.getItem('accountName')) || {};
      if (
        !accountName[principalId] ||
        (accountName[principalId] && accountName[principalId] !== res[1][0])
      ) {
        accountName[principalId] = res[1][0];
        localStorage.setItem('accountName', JSON.stringify(accountName));
        this.accountName = accountName;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.user-setting-account {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
}
.wallet-icon {
  width: 18px;
  height: 18px;
  margin: 0 0 0 20px !important;
  border-radius: 0 !important;
}
.account-info {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.check-account {
  color: #52c41a;
  .check-account-icon {
    margin-left: 5px;
  }
}
.current-account,
.user-principal {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  margin: 0 20px 0 auto;
  color: #b9bcc4;
  transition: all 0.25s;
  img {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    border-radius: 9px;
  }
}
.user-principal {
  color: #fff;
}
.check-account {
  color: #51b7c3;
  i {
    color: #51b7c3;
  }
}
.user-setting {
  ::v-deep.ant-dropdown-menu-item {
    padding: 0;
    &:hover {
      background: rgba(255, 255, 255, 0.08);
      .user-principal {
        color: #51b7c3;
      }
      i {
        color: #fff;
      }
    }
    i:hover {
      color: #51b7c3;
    }
  }
}
.user-setting-item {
  display: flex;
  align-items: center;
  color: #fff;
  padding: 0;
  border-bottom: 1px solid #383e4e;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #51b7c3;
  }
  &.active {
    a {
      color: #51b7c3;
    }
  }
  &:last-child {
    border-bottom: none;
  }
  i {
    margin-right: 8px !important;
    font-size: 18px !important;
  }
  a {
    display: inline-block;
    width: 100%;
    padding: 8px 15px;
    margin: 0;
  }
}
.user-setting-item-setting {
  width: 100%;
  padding: 8px 15px;
  .user-setting-item-setting-copy {
    ::v-deep .anticon-copy {
      padding: 5px;
    }
  }
}
.current-account-min {
  display: none;
  width: 18px;
  height: 18px;
  margin: 0 10px 0 auto;
  border-radius: 9px;
}
.h5-menu {
  display: none;
}
.h5-menu-icx {
  margin-left: 5px;
}
.user-menu {
  margin-left: 0;
}
@media screen and (max-width: 768px) {
  .wallet-icon {
    margin: 0 20px 0 10px !important;
  }
  .home-header {
    ul {
      display: none;
    }
    .current-account {
      display: none;
    }
    .current-account-h5 {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-shrink: 0;
      margin-left: auto;
      color: #b9bcc4;
      img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
        border-radius: 9px;
      }
    }
    .user-icon {
      display: none;
    }
  }
  .user-menu {
    margin-left: auto;
  }
  .current-account-min,
  .h5-menu {
    display: block;
  }
  .medium-menu {
    .user-setting-item {
      span,
      a {
        color: #fff;
        transition: all 0.25s;
        &:hover {
          color: #51b7c3;
        }
      }
      &.active {
        span,
        a {
          color: #51b7c3;
        }
      }
    }
  }
}
.setting-content {
  color: #8c90a1;
  ul {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    li {
      padding: 0 5px 10px 5px;
      margin: 0 10px;
      border-bottom: 2px solid transparent;
      transition: all 0.3s;
      cursor: pointer;
      color: #747884;
      &.active {
        color: #51b7c3;
        border-color: #51b7c3;
      }
      &:first-child {
        margin-left: 0;
      }
    }
  }
}
.tab-tip {
  width: 100%;
  button {
    height: 36px;
    margin-top: 20px;
  }
  .recovery-phrase {
    display: flex;
    align-items: center;
    margin: 10px 0 20px;
    .copy-phrase {
      margin: 0 0 0 auto;
      color: #1996c4;
      cursor: pointer;
    }
  }
}
.home-header-left {
  display: flex;
  align-items: center;
  .home-header-left-menu {
    color: #7ca9af;
    border-left: 1px solid #383e4e;
    padding-left: 10px;
    margin-left: 10px;
  }
}
.home-footer {
  margin-top: 20px;
  padding: 40px 0;
  background: #131920;
  color: #adb7c2;
  ul {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
  .container-width {
    display: flex;
    align-items: center;
  }
  li {
    display: flex;
    align-items: center;
    padding: 0 5px;
    color: #adb7c2;
    i {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    svg {
      width: 16px;
      height: 16px;
      fill: #adb7c2;
    }
  }
}
.container-width-copy {
  a {
    color: #2b8cb0;
  }
}
.source-img {
  margin-left: auto;
  width: 18px;
  height: 18px;
  border-radius: 0 !important;
  margin-right: 0 !important;
  object-fit: contain;
  filter: grayscale(100%);
}
</style>
