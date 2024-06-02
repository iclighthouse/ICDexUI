<template>
  <div id="app">
    <router-view class="app-main" />
    <div v-if="$route.meta.requireAuth && getPrincipalId">
      <a-modal
        class="verify-identity-modal"
        width="650px"
        :zIndex="2000"
        centered
        v-model="showCheckAuthModal"
        :footer="null"
        :keyboard="false"
        :closable="false"
        :maskClosable="false"
        @keyup.native.enter="onSubmit"
        :after-close="close"
      >
        <form>
          <div class="title">
            <img src="@/assets/img/logo.png" alt="" />
            <!--<p v-if="type !== 'authClient'">Welcome back</p>-->
          </div>
          <p v-if="type !== 'AuthClient'" class="account-list-title">
            Re-verify your identity
          </p>
          <a-input
            class="verify-internet-main"
            v-model="getPrincipalId"
            disabled
          />
          <div
            class="verify-internet verify-internet-main"
            v-if="type === 'AuthClient'"
            @click="authClient"
          >
            <img src="@/assets/img/dfinity.png" alt="" />Re-verify your Internet
            identity
          </div>
          <a-input-password
            v-if="type !== 'AuthClient'"
            placeholder="input password"
            v-model="password"
          />
          <button
            type="button"
            v-if="type !== 'AuthClient'"
            class="primary large-primary form-button w100"
            @click="onSubmit"
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
        <!--<div class="title" v-if="type !== 'authClient'">
					<img src="@/assets/img/logo-web-b-min.png" alt="" />
				</div>-->
      </a-modal>
    </div>
    <a-modal
      v-model="showRiskWarning"
      class="verify-identity-modal"
      width="650px"
      :zIndex="2000"
      centered
      :footer="null"
      :keyboard="false"
      :closable="false"
      :maskClosable="false"
    >
      <div class="risk-warning-main">
        <div class="risk-warning-main-title">Risk Warning</div>
        <span>
          ICDex is a community-driven decentralised project, still in beta
          phase, there may be undiscovered flaws, please use it only after you
          fully understand it. When utilizing this service, it means that you
          are responsible for any consequences of your own operation, please do
          not put large amounts of assets into this dapp. ICDex is a fully
          on-chain Dex, the trading pairs are to be listed in two ways, by
          community recommendation or by the token asset issuer initiating the
          listing, their value are uncertain and their price may have a large
          risk of volatility. The project development team and operation team
          maintain a neutral position and will not be responsible for any risk
          of trading pairs. Due to the legal restrictions in some countries or
          regions, you may not be allowed to use this dapp in your region.
          Please comply with local laws and assume all legal risks associated
          with the use of this dapp.
        </span>
        <div class="risk-warning-main-title mt20">Disclaimers</div>
        <span>
          ICLighthouse is a community-driven decentralised project, which is
          considered a community collaboration dedicated to developing
          infrastructure on IC. ICLighthouse is provided “as is”, and utilized
          at your own risk and responsibility without any guarantee.
          ICLighthouse token ICL is only used for governance and utility, and no
          team or individual guarantees its value. Therefore, before utilizing
          this service you should review its documentation and codes carefully
          to fully understand its functioning and the risks that could entail
          the usage of a service built on open protocols on an autonomous
          blockchain network (the Internet Computer). No individual, entity,
          developer (internal to the founding team, or from the ICLighthouse
          community), or ICLighthouse itself will be considered liable for any
          damages or claims related to the usage, interaction, or lack of
          functioning associated with the ICLighthouse, its interfaces, or
          websites. This includes loss of profits, assets of any value, or
          indirect, incidental, direct, special, exemplary, punitive or
          consequential damages. The same applies to the usage of ICLighthouse
          through third-party interfaces or applications that integrate/surface
          it. It is your responsibility to manage the risk of your activities
          and usage on said platforms/protocols. Utilizing this project/protocol
          may not comply with the requirements of certain regional laws. You are
          requested to comply with local laws and to assume all legal
          consequences arising from its use.
        </span>
      </div>
      <div class="risk-warning-button">
        <button type="button" @click="leave">Leave</button>
        <button type="button" class="primary" @click="agree">Agree</button>
      </div>
    </a-modal>
    <a-modal
      v-model="showTip"
      class="verify-identity-modal"
      width="450px"
      :zIndex="9000"
      centered
      :footer="null"
      :keyboard="false"
      :closable="false"
      :maskClosable="false"
    >
      <div class="site-info base-font-title">
        We have enabled the new domain https://iclight.io, migrate to the new
        domain? (Please change the URL in your favorites)
      </div>
      <div style="margin-top: 10px; color: #2b8cb0">
        <a
          href="https://medium.com/@ICLighthouse/iclighthouse-important-update-8ba4f39958da"
          target="_blank"
          rel="nofollow noreferrer noopener"
        >
          How do I migrate my account?
        </a>
      </div>
      <div class="site-button">
        <button @click="showTip = false">Enter old version</button>
        <button @click="skip">Enter new version</button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import {
  decrypt,
  IC_SNS_TOKEN_CANISTER_ID,
  LEDGER_CANISTER_ID,
  plugWhitelist
} from '@/ic/utils';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { namespace } from 'vuex-class';
import AuthClientAPi from '@/ic/AuthClientApi';
import ConnectPlug from '@/ic/ConnectPlug';
import { createPlugWhiteActor } from '@/ic/createPlugActor';
import { ConnectMetaMaskMixin } from '@/mixins';
import { hexToBytes } from '@/ic/converter';
import ConnectInfinity from '@/ic/ConnectInfinity';
import { createInfinityWhiteActor } from '@/ic/createInfinityActor';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { Principal } from '@dfinity/principal';
const commonModule = namespace('common');
const ethers = require('ethers');

@Component({
  name: 'App',
  components: {}
})
export default class extends Mixins(ConnectMetaMaskMixin) {
  @commonModule.Mutation('SET_IDENTITY') setIdentity?: any;
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  @commonModule.Mutation('SET_SHOW_CHECK_AUTH') setCheckAuth?: any;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @commonModule.Mutation('SET_PRINCIPAL_ID') setPrincipalId?: any;
  private password = '';
  private showRiskWarning = false;
  private showTip = false;
  private hostname = '';
  private riskMenu = [
    {
      value: 'riskWarning',
      name: 'Risk Warning'
    },
    {
      value: 'disclaimers',
      name: 'Disclaimers'
    }
  ];
  private currentRiskMenu = 'riskWarning';
  private showCheckAuthModal = false;
  private isInit = false;
  private isRefresh = false;
  @Watch('getCheckAuth')
  private onCheckAuthChange(checkAuth: boolean) {
    if (!this.isInit && !this.isRefresh) {
      this.init(checkAuth);
    }
  }
  @Watch('$route')
  private onRouteChange() {
    this.checkRiskWarning();
  }
  async mounted(): Promise<void> {
    // todo new site
    const hostname = window.location.hostname;
    this.hostname = window.location.hostname;
    console.log(window.parent.origin);
    if (hostname === 'avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app') {
      this.showTip = true;
    }
    this.checkRiskWarning();
    if (!this.isInit) {
      this.init(false);
    }
    window.addEventListener('storage', (e) => {
      if (e.key && e.key == 'principal' && e.newValue) {
        // const priList = JSON.parse(localStorage.getItem('priList')) || {};
        this.setPrincipalId(e.newValue);
        if (
          !this.$route.fullPath.toLocaleLowerCase().includes('/login') &&
          !this.$route.fullPath.toLocaleLowerCase().includes('/sign')
        ) {
          this.isRefresh = true;
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const that = this;
          this.$info({
            content: 'your account has changed, please refresh the page.',
            class: 'connect-plug',
            icon: 'connect-plug',
            okText: 'OK',
            onOk() {
              that.$router.go(0);
            }
          });
        }
      }
      // if (e.key && e.key == 'identity' && e.newValue) {
      //   this.isRefresh = true;
      //   if (
      //     !this.$route.fullPath.toLocaleLowerCase().includes('/login') &&
      //     !this.$route.fullPath.toLocaleLowerCase().includes('/sign')
      //   ) {
      //     // eslint-disable-next-line @typescript-eslint/no-this-alias
      //     const that = this;
      //     this.$info({
      //       content: 'If your account was changed, please refresh the web.',
      //       class: 'connect-plug',
      //       icon: 'connect-plug',
      //       okText: 'OK',
      //       onOk() {
      //         that.$router.go(0);
      //       }
      //     });
      //   }
      // }
      // if (e.key && e.key == 'plug' && e.newValue) {
      //   this.$router.go(0);
      // }
    });
    localStorage.removeItem('icxCanisterIds');
    const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    // SNS1
    const sns1TokenId = IC_SNS_TOKEN_CANISTER_ID;
    if (
      tokens[sns1TokenId] &&
      tokens[sns1TokenId].symbol.toLocaleLowerCase() === 'sns1'
    ) {
      tokens[sns1TokenId] = await getTokenInfo(
        Principal.fromText(sns1TokenId),
        {
          icrc1: null
        }
      );
      tokens[sns1TokenId].fee = tokens[sns1TokenId].fee.toString();
      delete tokens[sns1TokenId].totalSupply;
      console.log(tokens);
      localStorage.setItem('tokens', JSON.stringify(tokens));
    }
    const RICHToken = '77xez-aaaaa-aaaar-qaezq-cai';
    if (tokens[RICHToken] && tokens[RICHToken].symbol !== 'RICH') {
      tokens[RICHToken] = await getTokenInfo(Principal.fromText(RICHToken), {
        icrc1: null
      });
      tokens[RICHToken].fee = tokens[RICHToken].fee.toString();
      delete tokens[RICHToken].totalSupply;
      console.log(tokens);
      localStorage.setItem('tokens', JSON.stringify(tokens));
    }
    if (!tokens[LEDGER_CANISTER_ID]) {
      tokens[LEDGER_CANISTER_ID] = {
        decimals: 8,
        fee: '10000',
        name: 'ICP',
        price: '',
        symbol: 'ICP',
        tokenStd: { icp: null }
      };
      localStorage.setItem('tokens', JSON.stringify(tokens));
    }
  }
  private skip(): void {
    localStorage.setItem('skip', 'true');
    window.location.href = window.location.href.replace(
      window.location.origin,
      'https://iclight.io'
    );
  }
  beforeCreate(): void {
    Vue.prototype.$app = this;
  }
  private async logout(): Promise<void> {
    const authClientAPi = await AuthClientAPi.create();
    const identity = authClientAPi.tryGetIdentity();
    if (identity) {
      await authClientAPi.logout();
    }
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const principal = localStorage.getItem('principal');
    if (priList[principal] === 'Plug') {
      if ((window as any).ic && (window as any).ic.plug) {
        (window as any).ic.plug.disconnect();
      }
    }
    if (priList[principal] === 'Infinity') {
      if ((window as any).ic && (window as any).ic.infinityWallet) {
        (window as any).ic.infinityWallet.disconnect();
      }
    }
    localStorage.removeItem('principal');
    this.setPrincipalId(null);
    this.setIdentity(null);
    this.setCheckAuth(false);
  }
  private checkRiskWarning(): void {
    if (this.$route.fullPath.toLocaleLowerCase().includes('icdex')) {
      const hasAgree = this.$cookies.get('riskWarning');
      if (!hasAgree) {
        this.showRiskWarning = true;
      }
    }
  }
  private async init(checkAuth: boolean): Promise<void> {
    if ((window as any).icx) {
      console.log('116:' + this.getPrincipalId);
    } else {
      // this.principal = localStorage.getItem('principal');
      const priList = JSON.parse(localStorage.getItem('priList')) || {};
      if (priList[this.getPrincipalId] === 'AuthClient') {
        this.type = 'AuthClient';
      } else if (
        priList[this.getPrincipalId] &&
        priList[this.getPrincipalId].includes('MetaMask')
      ) {
        this.type = 'MetaMask';
        if (checkAuth && !this.isInit) {
          this.isInit = true;
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          try {
            console.log('isInit: ' + this.isInit);
            if (this.isInit) {
              await this.connectMetaMask();
              loading.close();
            }
            if (this.signature) {
              //
            } else {
              this.isInit = false;
              return;
            }
          } catch (e) {
            this.isInit = false;
            loading.close();
            return;
          }
        }
      } else if (priList[this.getPrincipalId] === 'Plug') {
        this.type = 'Plug';
        if (this.$route.meta.requireAuth) {
          const principal = localStorage.getItem('principal');
          const localWhitelist =
            JSON.parse(localStorage.getItem('whitelist')) || {};
          const whitelist: string[] =
            localWhitelist[principal] || plugWhitelist;
          const connectPlug = new ConnectPlug();
          if (
            (window as any).ic &&
            !(window as any).ic.plug.agent &&
            checkAuth &&
            !this.isInit
          ) {
            this.isInit = true;
            const plugIc = (window as any).ic?.plug;
            const plugPrincipalId = await plugIc.getPrincipal();
            console.log(principal);
            console.log(plugPrincipalId);
            if (plugPrincipalId && principal !== plugPrincipalId.toString()) {
              // eslint-disable-next-line @typescript-eslint/no-this-alias
              const _that = this;
              Vue.prototype.$info({
                content: `Please check if you are logged into Plug with account ${principal}.`,
                class: 'connect-plug',
                icon: 'connect-plug',
                centered: true,
                okText: 'Confirm',
                async onOk() {
                  await connectPlug.connect(whitelist, false);
                  await createPlugWhiteActor();
                  _that.setCheckAuth(false);
                }
              });
            } else {
              await connectPlug.connect(whitelist, false);
              await createPlugWhiteActor();
              this.setCheckAuth(false);
            }
          }
        }
      } else if (priList[this.getPrincipalId] === 'Infinity') {
        this.type = 'Infinity';
        if (this.$route.meta.requireAuth) {
          const principal = localStorage.getItem('principal');
          const localWhitelist =
            JSON.parse(localStorage.getItem('whitelistInfinity')) || {};
          const whitelist: string[] =
            localWhitelist[principal] || plugWhitelist;
          const connectInfinity = new ConnectInfinity();
          const connected = await (
            window as any
          ).ic.infinityWallet.isConnected();
          if (!connected && checkAuth && !this.isInit) {
            this.isInit = true;
            await connectInfinity.connect(whitelist, false);
            await createInfinityWhiteActor();
            this.setCheckAuth(false);
          }
        }
      } else {
        this.type = '';
        this.isInit = false;
      }
      this.isInit = false;
      this.showCheckAuthModal =
        checkAuth && this.type !== 'Plug' && this.type !== 'Infinity';
    }
  }
  private signInstead(): void {
    this.password = '';
    this.logout();
    this.$router.replace({
      path: '/login',
      query: { redirect: this.$route.fullPath }
    });
  }
  private close(): void {
    this.password = '';
  }
  private async authClient(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const authClientAPi = await AuthClientAPi.create();
    await authClientAPi.login();
    this.setCheckAuth(false);
    loading.close();
  }
  private onSubmit(): void {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    setTimeout(async () => {
      try {
        let identity;
        if (this.type === 'MetaMask') {
          const phraseList =
            JSON.parse(localStorage.getItem('phraseList')) || {};
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
          const mnemonic = await decrypt(data, this.password, salt);
          const root = ethers.utils.HDNode.fromMnemonic(mnemonic);
          const path = "m/44'/223'/0'/0/0";
          const keyPair = root.derivePath(path);
          identity = Secp256k1KeyIdentity.generate(
            new Uint8Array(hexToBytes(keyPair.privateKey))
          );
        } else {
          const encryptIdentity = JSON.parse(
            JSON.parse(localStorage.getItem('priList'))[this.getPrincipalId]
          );
          let salt = 'ICLightHouse';
          let data = encryptIdentity;
          if (encryptIdentity.salt) {
            salt = encryptIdentity.salt;
            data = encryptIdentity.encryptIdentity;
          }
          const identityJson = await decrypt(data, this.password, salt);
          if (JSON.parse(identityJson)[1].length > 64) {
            identity = Ed25519KeyIdentity.fromJSON(identityJson as string);
          } else {
            identity = Secp256k1KeyIdentity.fromJSON(identityJson as string);
          }
        }
        this.setIdentity(identity);
        localStorage.setItem('identity', localStorage.getItem('principal'));
        // sessionStorage.setItem('identity', JSON.stringify(identity));
        this.setCheckAuth(false);
        loading.close();
      } catch (e) {
        loading.close();
        console.log(e);
        this.$message.config({ top: '40%' });
        this.$message.error("Password doesn't match");
      }
    }, 50);
  }
  private changeRiskMenu(menu): void {
    if (this.currentRiskMenu !== menu.value) {
      this.currentRiskMenu = menu.value;
    }
  }
  private agree(): void {
    this.showRiskWarning = false;
    this.$cookies.set('riskWarning', true);
  }
  private leave(): void {
    this.showRiskWarning = false;
    this.$router.replace('/account');
  }
}
</script>

<style scoped lang="scss">
#app {
  height: 100%;
  .app-main {
    min-height: 100%;
  }
}
.title {
  margin-top: 40px;
  text-align: center;
  p {
    margin: 20px 0;
    font-size: 18px;
  }
  img {
    width: 100px;
    margin-bottom: 40px;
  }
}
.verify-internet {
  display: flex;
  align-items: center;
  margin: 0 0 30px;
  cursor: pointer;
  font-size: 18px;
  &:hover {
    color: #51b7c3;
  }
  img {
    width: 20px;
    margin-right: 20px;
  }
}
.verify-identity-modal {
  .form-button {
    margin: 40px 0 20px;
  }
  .verify-internet-main {
    margin-bottom: 20px;
  }
  ::v-deep .ant-modal {
    padding-bottom: 50px;
  }
  ::v-deep .ant-modal-header {
    padding-top: 40px;
  }
}
.reset {
  display: flex;
  align-items: center;
  color: #1996c4;
  cursor: pointer;
}
.account-list-title {
  width: 200%;
  margin-bottom: 20px;
  font-size: 16px;
  color: #adb3c4;
}
.risk-warning-main {
  max-height: calc(100vh - 240px);
  overflow: auto;
  margin-top: 30px;
  .risk-warning-main-title {
    color: #adb3c4;
    font-size: 14px;
  }
  span {
    font-size: 12px;
  }
}
.risk-warning-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
  button {
    margin-left: 10px;
  }
}
.site-info {
  margin-top: 50px;
  font-size: 16px;
}
.site-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  button {
    width: auto;
    min-width: 120px;
  }
}
</style>
