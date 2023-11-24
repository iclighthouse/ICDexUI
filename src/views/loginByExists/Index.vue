<template>
  <div class="main">
    <a-spin class="sign-spinning" :spinning="spinning">
      <form @submit.prevent>
        <div class="account-list">
          <div class="title">
            <img class="title-logo" src="@/assets/img/logo.png" alt="" />
          </div>
          <p class="account-list-title">Select an account to log in</p>
          <a-select
            class="account-list-select"
            :value="selectedAccount"
            notFoundContent="Not Found"
            @change="handleChange"
          >
            <a-select-option
              class="account-select-option"
              v-for="item in accountList"
              :key="item"
              :value="item"
            >
              <div class="account-select-item">
                <img class="source-img" :src="getSourceImg(item)" alt="" />
                <span>{{ item }}</span
                ><a-icon
                  @click.stop="onDeleteAccount(item)"
                  class="delete-icon"
                  type="delete"
                />
              </div>
            </a-select-option>
          </a-select>
          <div
            class="verify-internet"
            v-show="loginType === 'authClient'"
            @click="authClient"
          >
            <img src="@/assets/img/dfinity.png" alt="" />Re-verify your Internet
            identity
          </div>
          <div
            class="verify-internet"
            v-show="loginType === 'plug'"
            @click="authPlugClient"
          >
            <img src="@/assets/img/plug.png" alt="" />Re-verify your Plug
            identity
          </div>
          <div
            class="verify-internet"
            v-show="loginType === 'Infinity'"
            @click="authInfinityClient"
          >
            <img src="@/assets/img/infinity.png" alt="" />Re-verify your
            Infinity identity
          </div>
          <div
            class="verify-internet"
            :class="{ 'verify-internet-connect': hasConnectMetaMask }"
            v-show="loginType === 'MetaMask'"
            @click="onConnectMetaMask"
          >
            <img src="@/assets/img/MetaMask.png" alt="" />Re-verify your
            metaMask identity
            <a-icon
              class="check-circle"
              v-show="hasConnectMetaMask"
              type="check-circle"
            />
          </div>
          <a-input-password
            class="mt20"
            @keyup.enter="onSubmitMetaMask"
            v-show="loginType === 'MetaMask' && hasConnectMetaMask"
            placeholder="input password"
            v-model="password"
          />
          <button
            type="button"
            v-if="loginType === 'MetaMask' && hasConnectMetaMask"
            class="primary large-primary form-button w100"
            @click="onSubmitMetaMask"
          >
            Login
          </button>
          <a-input-password
            @keyup.enter="onSubmit"
            v-if="
              loginType !== 'authClient' &&
              loginType !== 'plug' &&
              loginType !== 'Infinity' &&
              loginType !== 'MetaMask'
            "
            placeholder="input password"
            v-model="password"
          />
          <button
            type="button"
            v-if="
              loginType !== 'authClient' &&
              loginType !== 'plug' &&
              loginType !== 'Infinity' &&
              loginType !== 'MetaMask'
            "
            class="primary large-primary form-button w100"
            @click="onSubmit"
          >
            Login
          </button>
          <p class="reset">
            <a
              v-if="
                hostname &&
                hostname !== 'avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app' &&
                hostname !== 'pk6zh-iiaaa-aaaaj-ainda-cai.raw.ic0.app'
              "
              href="https://avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app/"
              target="_blank"
              rel="nofollow noreferrer noopener"
              ><a-icon type="arrow-left" /> Old Version</a
            >
            <span class="margin-left-auto" @click="signInstead"
              >Create a new Wallet</span
            >
          </p>
        </div>
      </form>
    </a-spin>
    <a-modal
      centered
      v-model="visible"
      title="Please confirm"
      width="500px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <div>
        <p>
          You are about to remove this Principal, which will remove all data
          regarding this wallet from this device. Are you sure you want to
          continue?
        </p>
      </div>
      <div class="delete-confirm" @click="securityTips = false">
        <button type="button" @click="visible = false">Cancel</button
        ><button type="button" class="default" @click="deleteAccountSubmit">
          Confirm
        </button>
      </div>
    </a-modal>
    <switch-plug-account
      :local-account="localAccount"
      :plug-account="plugAccount"
      :account-type="accountType"
      ref="switchPlugAccount"
    ></switch-plug-account>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { decrypt, plugWhitelist } from '@/ic/utils';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import AuthClientAPi from '@/ic/AuthClientApi';
import { namespace } from 'vuex-class';
import ConnectPlug from '@/ic/ConnectPlug';
import SwitchPlugAccount from '@/components/switchPlugAccount/Index.vue';
import { createPlugWhiteActor } from '@/ic/createPlugActor';
import { ConnectMetaMaskMixin } from '@/mixins';
import { hexToBytes } from '@/ic/converter';
import ConnectInfinity from '@/ic/ConnectInfinity';
import { createInfinityWhiteActor } from '@/ic/createInfinityActor';

const commonModule = namespace('common');
const Ic = (window as any).ic;
const ethers = require('ethers');

@Component({
  name: 'index',
  components: { SwitchPlugAccount }
})
export default class extends Mixins(ConnectMetaMaskMixin) {
  @commonModule.Mutation('SET_IDENTITY') setIdentity?: any;
  @commonModule.Mutation('SET_PRINCIPAL_ID') setPrincipalId?: any;
  @commonModule.Mutation('SET_SHOW_CHECK_AUTH') setCheckAuth?: any;
  private password = '';
  private spinning = false;
  private visible = false;
  private priList = {};
  private accountList: Array<any> = [];
  private selectedAccount = '';
  private deleteAccount = '';
  private localAccount = '';
  private plugAccount = '';
  private accountType = '';
  private hasConnectMetaMask = false;
  private hostname = '';
  get loginType(): string {
    if (this.priList && this.selectedAccount) {
      if (this.priList[this.selectedAccount] === 'AuthClient') {
        return 'authClient';
      } else if (this.priList[this.selectedAccount] === 'Plug') {
        return 'plug';
      } else if (this.priList[this.selectedAccount] === 'Infinity') {
        return 'Infinity';
      } else if (
        this.priList[this.selectedAccount] &&
        this.priList[this.selectedAccount].includes('MetaMask')
      ) {
        return 'MetaMask';
      }
    }
    return '';
  }
  created(): void {
    this.hostname = window.location.hostname;
    this.priList = JSON.parse(localStorage.getItem('priList')) || {};
    this.accountList = Object.keys(this.priList);
    this.selectedAccount = this.accountList[0];
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
  private async onSubmitMetaMask(): Promise<void> {
    this.spinning = true;
    const phraseList = JSON.parse(localStorage.getItem('phraseList')) || {};
    const encryptSeedPhrase = phraseList[this.selectedAccount];
    let mnemonic;
    try {
      let salt = 'ICLightHouse';
      let data = encryptSeedPhrase;
      if (encryptSeedPhrase.salt) {
        salt = encryptSeedPhrase.salt;
        data = encryptSeedPhrase.encryptSeedPhrase;
      }
      mnemonic = await decrypt(data, this.password, salt);
    } catch (e) {
      this.spinning = false;
      console.log(e);
      this.$message.config({ top: '40%' });
      this.$message.error("Password doesn't match");
      return;
    }
    const root = ethers.utils.HDNode.fromMnemonic(mnemonic);
    const path = "m/44'/223'/0'/0/0";
    const keyPair = root.derivePath(path);
    const identity = Secp256k1KeyIdentity.generate(
      new Uint8Array(hexToBytes(keyPair.privateKey))
    );
    localStorage.setItem('principal', this.selectedAccount);
    this.setPrincipalId(this.selectedAccount);
    localStorage.setItem('identity', localStorage.getItem('principal'));
    this.setIdentity(identity);
    this.setCheckAuth(false);
    this.setCheckAuth(false);
    this.spinning = false;
    if (this.$route.query.redirect) {
      this.$router.push(this.$route.query.redirect as any).catch(() => {
        return;
      });
    } else {
      this.$router.push('/account').catch(() => {
        return;
      });
    }
  }
  private async onConnectMetaMask(): Promise<void> {
    if (this.hasConnectMetaMask) {
      return;
    }
    await this.connectMetaMask(this.selectedAccount);
    if (this.signature) {
      this.hasConnectMetaMask = true;
    }
  }
  private deleteAccountSubmit(): void {
    const index = this.accountList.findIndex(
      (item) => item === this.deleteAccount
    );
    this.accountList.splice(index, 1);
    this.selectedAccount = this.accountList[0];
    delete this.priList[this.deleteAccount];
    localStorage.setItem('priList', JSON.stringify(this.priList));
    this.visible = false;
  }
  private handleChange(selectedAccount): void {
    this.hasConnectMetaMask = false;
    this.selectedAccount = selectedAccount;
  }
  private onDeleteAccount(account: string): void {
    console.log(account);
    this.deleteAccount = account;
    this.visible = true;
  }
  private signInstead(): void {
    this.$router.replace('/login');
  }
  private async authClient(): Promise<void> {
    this.spinning = true;
    const authClientAPi = await AuthClientAPi.create();
    await authClientAPi.login();
    const identity = authClientAPi.tryGetIdentity();
    const principal = identity.getPrincipal().toString();
    if (principal !== this.selectedAccount) {
      this.localAccount = this.selectedAccount;
      this.accountType = 'Internet Identity';
      this.plugAccount = principal;
      (this.$refs as any).switchPlugAccount.plugVisible = true;
    } else {
      this.setCheckAuth(false);
      this.setPrincipalId(this.selectedAccount);
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect as any).catch(() => {
          return;
        });
      } else {
        this.$router.push('/account').catch(() => {
          return;
        });
      }
    }
    this.spinning = false;
  }
  private async authPlugClient(): Promise<void> {
    this.spinning = true;
    try {
      const localWhitelist =
        JSON.parse(localStorage.getItem('whitelist')) || {};
      const whitelist: string[] =
        localWhitelist[this.selectedAccount] || plugWhitelist;
      const connectPlug = new ConnectPlug();
      const isConnect = await connectPlug.connect(whitelist);
      if (isConnect) {
        await createPlugWhiteActor();
        const principalId = await Ic.plug.agent.getPrincipal();
        if (principalId.toString() !== this.selectedAccount) {
          this.localAccount = this.selectedAccount;
          this.plugAccount = principalId.toString();
          this.accountType = 'Plug';
          (this.$refs as any).switchPlugAccount.plugVisible = true;
        } else {
          this.setCheckAuth(false);
          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect as any).catch(() => {
              return;
            });
          } else {
            this.$router.push('/account').catch(() => {
              return;
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    this.spinning = false;
  }
  private async authInfinityClient(): Promise<void> {
    this.spinning = true;
    try {
      const localWhitelist =
        JSON.parse(localStorage.getItem('whitelistInfinity')) || {};
      const whitelist: string[] =
        localWhitelist[this.selectedAccount] || plugWhitelist;
      const connectInfinity = new ConnectInfinity();
      const isConnect = await connectInfinity.connect(whitelist);
      if (isConnect) {
        await createInfinityWhiteActor();
        const principalId = await Ic.infinityWallet.getPrincipal();
        if (principalId.toString() !== this.selectedAccount) {
          this.localAccount = this.selectedAccount;
          this.plugAccount = principalId.toString();
          this.accountType = 'Infinity';
          (this.$refs as any).switchPlugAccount.plugVisible = true;
        } else {
          this.setCheckAuth(false);
          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect as any).catch(() => {
              return;
            });
          } else {
            this.$router.push('/account').catch(() => {
              return;
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    this.spinning = false;
  }
  private onSubmit(e): void {
    e.preventDefault();
    this.spinning = true;
    setTimeout(async () => {
      try {
        const encryptIdentity = JSON.parse(this.priList[this.selectedAccount]);
        let salt = 'ICLightHouse';
        let data = encryptIdentity;
        if (encryptIdentity.salt) {
          salt = encryptIdentity.salt;
          data = encryptIdentity.encryptIdentity;
        }
        const identityJson = await decrypt(data, this.password, salt);
        let identity;
        if (JSON.parse(identityJson)[1].length > 64) {
          identity = Ed25519KeyIdentity.fromJSON(identityJson as string);
        } else {
          identity = Secp256k1KeyIdentity.fromJSON(identityJson as string);
        }
        localStorage.setItem('principal', this.selectedAccount);
        this.setPrincipalId(this.selectedAccount);
        this.setIdentity(identity);
        localStorage.setItem('identity', localStorage.getItem('principal'));
        // sessionStorage.setItem('identity', JSON.stringify(identity));
        this.spinning = false;
        this.setCheckAuth(false);
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect as any).catch(() => {
            return;
          });
        } else {
          this.$router.push('/account').catch(() => {
            return;
          });
        }
      } catch (e) {
        this.spinning = false;
        console.log(e);
        this.$message.config({ top: '45%' });
        this.$message.error("Password doesn't match");
      }
    }, 20);
  }
}
</script>

<style scoped lang="scss">
.main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  .account-list {
    width: 685px;
    border-radius: 20px;
    background: #15161b;
    box-shadow: 0 0 15px 15px rgba(0, 0, 0, 0.6);
    padding: 40px 55px 90px;
    color: #727a87;
    .title {
      text-align: center;
    }
    .title-logo {
      width: 125px;
      margin-bottom: 40px;
    }
    .form-button {
      margin-top: 40px;
    }
  }
  .account-list-select {
    width: 100%;
    margin-bottom: 20px;
  }
}
.account-select-item {
  display: flex;
  align-items: center;
  .delete-icon {
    margin-left: auto;
  }
}
.ant-select-selection__rendered {
  .delete-icon {
    display: none;
  }
}
.delete-confirm {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}
.reset {
  display: flex;
  align-items: center;
  margin-top: 40px;
  cursor: pointer;
  a {
    color: #575d67;
  }
  span {
    font-size: 16px;
    color: #1996c4;
  }
}
.account-list-title {
  margin-bottom: 20px;
  font-size: 16px;
  color: #adb3c4;
}
.verify-internet {
  display: flex;
  align-items: center;
  padding: 0 0 10px 0;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.25s;
  color: #b9bcc4;
  &:hover {
    color: #1996c4;
  }
  img {
    width: 20px;
    margin-right: 20px;
  }
  &.verify-internet-connect {
    color: #21c77d;
    cursor: default;
    &:hover {
      color: #21c77d;
    }
    .check-circle {
      margin-left: 5px;
      font-size: 14px;
    }
  }
}
.source-img {
  width: 18px;
  height: 18px;
  border-radius: 0 !important;
  margin-right: 5px !important;
  object-fit: contain;
  filter: grayscale(100%);
}
@media screen and (max-width: 768px) {
  .main {
    form {
      width: 100vw;
      padding: 0 15px;
    }
    .account-list {
      width: 100%;
      max-width: 600px;
      padding: 40px 20px 90px;
    }
  }
  .account-select-option {
    overflow: auto;
  }
}
</style>
