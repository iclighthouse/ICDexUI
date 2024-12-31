<template>
  <div class="main">
    <a-spin :spinning="spinning">
      <main @keyup.enter="onSubmit">
        <form>
          <div class="title">
            <img src="@/assets/img/logo.png" alt="" />
            <!--<p v-if="type !== 'authClient'">Welcome back</p>-->
          </div>
          <p
            v-if="
              loginType !== 'authClient' &&
              loginType !== 'Plug' &&
              loginType !== 'SignerPlug' &&
              loginType !== 'Infinity' &&
              loginType !== 'MetaMask' &&
              loginType !== 'NFID' &&
              loginType !== 'SignerNFID'
            "
            class="account-list-title"
          >
            Re-verify your identity
          </p>
          <a-input v-model="selectedAccount" disabled />
          <div
            class="verify-internet"
            v-if="loginType === 'authClient'"
            @click="authClient"
          >
            <img src="@/assets/img/dfinity.png" alt="" />Re-verify your Internet
            identity
          </div>
          <div
            class="verify-internet"
            :class="{ 'verify-internet-connect': hasConnectMetaMask }"
            v-if="loginType === 'MetaMask'"
            @click="onConnectMetaMask"
          >
            <img src="@/assets/img/MetaMask.png" alt="" />Re-verify your
            MetaMask identity
            <a-icon
              class="check-circle"
              v-show="hasConnectMetaMask"
              type="check-circle"
            />
          </div>
          <a-input-password
            class="sign-input-password"
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
          <div
            class="verify-internet"
            v-if="loginType === 'Plug' || loginType === 'SignerPlug'"
            @click="authPlugClient(loginType)"
          >
            <img src="@/assets/img/plug.png" alt="" />Re-verify your Plug
            identity
          </div>
          <div
            class="verify-internet"
            v-if="loginType === 'NFID' || loginType === 'SignerNFID'"
            @click="authNFIDClient(loginType)"
          >
            <img src="@/assets/img/NFID.svg" alt="" />Re-verify your NFID
            identity
          </div>
          <div
            class="verify-internet"
            v-if="loginType === 'Infinity'"
            @click="authInfinityClient"
          >
            <img src="@/assets/img/infinity.png" alt="" />Re-verify your
            Infinity identity
          </div>
          <a-input-password
            class="sign-input-password"
            v-if="
              loginType !== 'authClient' &&
              loginType !== 'Plug' &&
              loginType !== 'SignerPlug' &&
              loginType !== 'Infinity' &&
              loginType !== 'MetaMask' &&
              loginType !== 'NFID' &&
              loginType !== 'SignerNFID'
            "
            placeholder="input password"
            v-model="password"
          />
          <button
            v-if="
              loginType !== 'authClient' &&
              loginType !== 'Plug' &&
              loginType !== 'SignerPlug' &&
              loginType !== 'Infinity' &&
              loginType !== 'MetaMask' &&
              loginType !== 'NFID' &&
              loginType !== 'SignerNFID'
            "
            type="button"
            class="primary large-primary large-primary form-button"
            @click="onSubmit"
            :disabled="spinning"
          >
            Login
          </button>
          <p class="reset" style="margin-bottom: 10px">
            <span @click="logout">Logout</span>
            <!--<span class="margin-left-auto">Don't have an account yet?</span>-->
            <span @click="signInstead" class="margin-left-auto"
              >Create a new Wallet</span
            >
          </p>
          <a
            v-if="
              hostname &&
              hostname !== 'avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app' &&
              hostname !== 'pk6zh-iiaaa-aaaaj-ainda-cai.raw.ic0.app'
            "
            href="https://avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app/"
            target="_blank"
            rel="nofollow noreferrer noopener"
            style="color: #575d67; font-size: 12px"
            ><a-icon type="arrow-left" /> Old Version</a
          >
        </form>
      </main>
    </a-spin>
    <a-modal
      v-model="resetModal"
      title="Please confirm"
      width="500px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="reset-modal"
    >
      <div>
        The account based on local storage will be logged out, please make sure
        you remember the mnemonic phrase.
      </div>
      <div class="reset-modal-bottom">
        <button type="button" @click="resetModal = false">Cancel</button
        ><button type="button" @click="reset">Reset</button>
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
import { decrypt } from '@/ic/utils';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { namespace } from 'vuex-class';
import AuthClientAPi from '@/ic/AuthClientApi';
import { plugWhitelist } from '@/ic/utils';
import SwitchPlugAccount from '@/components/switchPlugAccount/Index.vue';
import ConnectPlug from '@/ic/ConnectPlug';
import { createPlugWhiteActor } from '@/ic/createPlugActor';
import { ConnectMetaMaskMixin } from '@/mixins';
import { hexToBytes } from '@/ic/converter';
import ConnectInfinity from '@/ic/ConnectInfinity';
import { createInfinityWhiteActor } from '@/ic/createInfinityActor';
import { getNFIDIdentity, NFIDLogin, NFIDLogout } from '@/ic/NFIDAuth';
const commonModule = namespace('common');
const ethers = require('ethers');

@Component({
  name: 'Index',
  components: { SwitchPlugAccount }
})
export default class extends Mixins(ConnectMetaMaskMixin) {
  @commonModule.Mutation('SET_IDENTITY') setIdentity?: any;
  @commonModule.Mutation('SET_PRINCIPAL_ID') setPrincipalId?: any;
  @commonModule.Mutation('SET_SHOW_CHECK_AUTH') setCheckAuth?: any;
  public password = '';
  public resetModal = false;
  public spinning = false;
  private loginType = '';
  private selectedAccount = '';
  private localAccount = '';
  private plugAccount = '';
  private accountType = '';
  private hasConnectMetaMask = false;
  private hostname = '';
  created(): void {
    this.loginType = this.$route.params.type;
    this.selectedAccount = localStorage.getItem('principal');
    this.hostname = window.location.hostname;
    console.log(window.parent.origin);
  }
  public reset(): void {
    localStorage.removeItem('principal');
    this.setPrincipalId(null);
    this.setIdentity(null);
    this.$router.replace('/');
  }
  private async onSubmitMetaMask(): Promise<void> {
    this.spinning = true;
    const phraseList = JSON.parse(localStorage.getItem('phraseList')) || {};
    let encryptSeedPhrase = phraseList[this.selectedAccount];
    if (typeof encryptSeedPhrase === 'string') {
      encryptSeedPhrase = JSON.parse(encryptSeedPhrase);
    }
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
    if (this.$route.query.redirect) {
      this.$router.push(this.$route.query.redirect as any).catch(() => {
        return;
      });
    } else {
      this.$router.push('/ICDex').catch(() => {
        return;
      });
    }
    this.spinning = false;
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
  private async authPlugClient(type: string): Promise<void> {
    this.spinning = true;
    try {
      const localWhitelist =
        JSON.parse(localStorage.getItem('whitelist')) || {};
      const whitelist: string[] =
        localWhitelist[this.selectedAccount] || plugWhitelist;
      const connectPlug = new ConnectPlug();
      const isConnect = await connectPlug.connect(
        whitelist,
        type === 'SignerPlug'
      );
      if (isConnect) {
        await createPlugWhiteActor(type === 'SignerPlug');
        const principalId = await (window as any).ic.plug.getPrincipal();
        if (principalId && principalId.toString() !== this.selectedAccount) {
          this.localAccount = this.selectedAccount;
          this.accountType = 'Plug';
          this.plugAccount = principalId.toString();
          (this.$refs as any).switchPlugAccount.plugVisible = true;
        } else {
          this.setCheckAuth(false);
          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect as any).catch(() => {
              return;
            });
          } else {
            this.$router.push('/ICDex').catch(() => {
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
        const principalId = await (
          window as any
        ).ic.infinityWallet.getPrincipal();
        if (principalId && principalId.toString() !== this.selectedAccount) {
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
            this.$router.push('/ICDex').catch(() => {
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
  private async authNFIDClient(type: string): Promise<void> {
    this.spinning = true;
    const signerAgent = await NFIDLogin(type === 'SignerNFID');
    console.log(signerAgent);
    let principal;
    if (type === 'SignerNFID') {
      principal = await signerAgent.getPrincipal();
    } else {
      principal = getNFIDIdentity().getPrincipal();
    }
    if (principal && principal.toString() !== this.selectedAccount) {
      this.localAccount = this.selectedAccount;
      this.accountType = type;
      this.plugAccount = principal.toString();
      (this.$refs as any).switchPlugAccount.plugVisible = true;
    } else {
      this.setCheckAuth(false);
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect as any).catch(() => {
          return;
        });
      } else {
        this.$router.push('/ICDex').catch(() => {
          return;
        });
      }
    }
    this.spinning = false;
  }
  private async authClient(): Promise<void> {
    this.spinning = true;
    const authClientAPi = await AuthClientAPi.create();
    await authClientAPi.login(this.selectedAccount);
    const identity = authClientAPi.tryGetIdentity();
    const principal = identity.getPrincipal();
    if (principal && principal.toString() !== this.selectedAccount) {
      this.localAccount = this.selectedAccount;
      this.accountType = 'Internet Identity';
      this.plugAccount = principal.toString();
      (this.$refs as any).switchPlugAccount.plugVisible = true;
    } else {
      this.setCheckAuth(false);
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect as any).catch(() => {
          return;
        });
      } else {
        this.$router.push('/ICDex').catch(() => {
          return;
        });
      }
    }
    this.spinning = false;
  }
  private signInstead(): void {
    localStorage.removeItem('principal');
    this.setPrincipalId(null);
    this.setIdentity(null);
    if (this.$route.query.redirect) {
      this.$router.replace({
        path: '/login',
        query: { redirect: this.$route.query.redirect }
      });
    } else {
      this.$router.replace('/login');
    }
  }
  public async onSubmit(): Promise<void> {
    this.spinning = true;
    try {
      const principal = localStorage.getItem('principal');
      const encryptIdentity = JSON.parse(
        JSON.parse(localStorage.getItem('priList'))[principal]
      );
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
      this.setIdentity(identity);
      localStorage.setItem('identity', localStorage.getItem('principal'));
      // sessionStorage.setItem('identity', JSON.stringify(identity));
      this.spinning = false;
      this.setCheckAuth(false);
      console.log(this.$route.query.redirect);
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect as any).catch(() => {
          return;
        });
      } else {
        this.$router.push('/ICDex').catch(() => {
          return;
        });
      }
    } catch (e) {
      this.spinning = false;
      console.log(e);
      this.$message.config({ top: '45%' });
      this.$message.error("Password doesn't match");
    }
  }
  private async logout(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const authClientAPi = await AuthClientAPi.create();
      const identity = authClientAPi.tryGetIdentity();
      if (identity) {
        await authClientAPi.logout();
      }
      const priList = JSON.parse(localStorage.getItem('priList')) || {};
      const principal = localStorage.getItem('principal');
      if (
        priList[principal] === 'Plug' ||
        priList[principal] === 'SignerPlug'
      ) {
        if ((window as any).ic && (window as any).ic.plug) {
          (window as any).ic.plug.disconnect();
        }
      }
      if (priList[principal] === 'Infinity') {
        if ((window as any).ic && (window as any).ic.infinityWallet) {
          (window as any).ic.infinityWallet.disconnect();
        }
      }
      if (
        priList[principal] === 'NFID' ||
        priList[principal] === 'SignerNFID'
      ) {
        await NFIDLogout();
      }
      localStorage.removeItem('principal');
      this.setPrincipalId(null);
      this.setIdentity(null);
      this.setCheckAuth(false);
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect as any).catch(() => {
          return;
        });
      } else {
        this.$router.push('/ICDex').catch(() => {
          return;
        });
      }
    } catch (e) {
      console.log(e);
    }
    loading.close();
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
  main {
    width: 600px;
    border-radius: 20px;
    background: #15161b;
    box-shadow: 0 0 15px 15px rgba(0, 0, 0, 0.6);
    padding: 40px 55px 90px;
    color: #727a87;
    button {
      width: 100%;
      margin: 20px 0;
      &.form-button {
        margin-top: 0;
      }
    }
  }
  .title {
    text-align: center;
    p {
      margin: 20px 0;
      font-size: 18px;
    }
    img {
      width: 125px;
      margin-bottom: 40px;
    }
  }
}
.reset-modal {
  ::v-deep .ant-modal-body {
    line-height: 1.3;
  }
  .reset-modal-bottom {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 20px;
    button {
      width: 140px;
      &:last-child {
        margin-left: auto;
      }
    }
  }
}
.reset {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1996c4;
  cursor: pointer;
}
.sign-instead {
  margin-left: auto;
  font-size: 16px;
}
.verify-internet {
  display: flex;
  align-items: center;
  margin: 20px 0 30px;
  cursor: pointer;
  font-size: 18px;
  color: #b9bcc4;
  &:hover {
    color: #1996c4;
  }
  img {
    width: 20px;
    margin-right: 20px;
  }
  &.verify-internet-connect {
    margin-bottom: 0;
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
.sign-spinning {
  margin: -40px -50px -50px;
}

.sign-input-password {
  margin: 20px 0 40px;
}
.account-list-title {
  margin-bottom: 20px;
  font-size: 16px;
  color: #adb3c4;
}
@media screen and (max-width: 768px) {
  .main {
    main {
      width: 100%;
    }
  }
}
</style>
