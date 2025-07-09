<template>
  <div class="main">
    <a-spin :spinning="connectSpinning">
      <main>
        <div v-show="!type">
          <div class="title">
            <img src="@/assets/img/logo.png" alt="" />
          </div>
          <div class="connect-list">
            <div class="connect-list-item" @click="createNewWallet">
              <span><a-icon type="plus" style="color: #1996c4" /></span>
              <dl>
                <dt>Create a new Wallet</dt>
                <!--<dd>
									Write your mnemonic down on a physical piece of paper and store it
									somewhere safe and private, it is only way to access your wallet.
									Anyone who knows this can transfer funds out of your account.
								</dd>-->
              </dl>
              <!--<a-button @click="securityTips = true">Security Tips</a-button>-->
            </div>
            <div class="connect-list-item" @click="importExistingWallet">
              <span
                ><a-icon type="vertical-align-bottom" style="color: #1996c4"
              /></span>
              <dl>
                <dt>Import an existing Wallet</dt>
                <!--<dd></dd>-->
              </dl>
            </div>
            <div
              class="connect-list-item"
              @click="connect('InternetIdentitiy')"
            >
              <span><img src="@/assets/img/dfinity.png" alt="" /></span>
              <dl>
                <dt>Link your Internet Identity</dt>
                <!--<dd></dd>-->
              </dl>
            </div>
            <div class="connect-list-item pc-show" @click="connect('Plug')">
              <span><img src="@/assets/img/plug.png" alt="" /></span>
              <dl>
                <dt>Connect Plug Wallet</dt>
                <!--<dd></dd>-->
              </dl>
            </div>
            <!--<div class="connect-list-item pc-show" @click="connect('OISY')">
              <span><img src="@/assets/img/OISY.svg" alt="" /></span>
              <dl>
                <dt>Connect OISY Wallet</dt>
                &lt;!&ndash;<dd></dd>&ndash;&gt;
              </dl>
            </div>-->
            <div class="connect-list-item pc-show" @click="connect('NFID')">
              <span><img src="@/assets/img/NFID.svg" alt="" /></span>
              <dl>
                <dt>Connect NFID Wallet</dt>
                <!--<dd></dd>-->
              </dl>
            </div>
            <div class="connect-list-item" @click="connect('HardwareWallet')">
              <span
                ><svg
                  class="MuiSvgIcon-root"
                  focusable="false"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style="fill: #1996c4"
                >
                  <path
                    d="M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07c.7-.37 1.2-1.08 1.2-1.93 0-1.21-.99-2.2-2.2-2.2-1.21 0-2.2.99-2.2 2.2 0 .85.5 1.56 1.2 1.93V13c0 1.11.89 2 2 2h3v3.05c-.71.37-1.2 1.1-1.2 1.95 0 1.22.99 2.2 2.2 2.2 1.21 0 2.2-.98 2.2-2.2 0-.85-.49-1.58-1.2-1.95V15h3c1.11 0 2-.89 2-2v-2h1V7h-4z"
                  ></path></svg
              ></span>
              <dl>
                <dt>Connect Hardware Wallet</dt>
                <!--<dd></dd>-->
              </dl>
            </div>
            <!--<button type="button" @click="onConnectMetaMask">
							Connect to MetaMask
						</button>-->
            <!--<p>is coming soon</p>-->
          </div>
          <p class="sign-instead">
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
            <span class="margin-left-auto" @click="loginByExists">Sign in</span>
          </p>
        </div>
        <new-wallet
          ref="newWallet"
          v-show="type === 'Mnemonic'"
          @back="back"
        ></new-wallet>
        <existing-wallet
          ref="existingWallet"
          v-show="type === 'Existing'"
          @back="back"
        ></existing-wallet>
        <meta-mask-wallet
          ref="metaMaskWallet"
          :signature="signature"
          :eth-account="ethAccount"
          v-show="type === 'MetaMask'"
          @back="back"
        ></meta-mask-wallet>
      </main>
    </a-spin>
    <a-modal
      v-model="comingVisible"
      centered
      width="500px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <p>{{ this.modalType }} support is coming soon!</p>
      <div class="delete-button">
        <button
          type="button"
          class="default margin-left-auto"
          @click="comingVisible = false"
        >
          Confirm
        </button>
      </div>
    </a-modal>
    <a-modal
      v-model="signerVisible"
      centered
      width="460px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="delete-modal"
    >
      <div
        class="font-bold mt20 base-font-title"
        style="margin-bottom: 10px; font-size: 18px"
      >
        Connect wallet
      </div>
      <div>
        <div class="connect-list-item pc-show" @click="connect('SignerPlug')">
          <span><img src="@/assets/img/plug.png" alt="" /></span>
          <dl>
            <dt>Connect Plug Wallet</dt>
            <!--<dd></dd>-->
          </dl>
        </div>
        <!--<div class="connect-list-item pc-show" @click="connect('OISY')">
          <span><img src="@/assets/img/OISY.svg" alt="" /></span>
          <dl>
            <dt>Connect OISY Wallet</dt>
            &lt;!&ndash;<dd></dd>&ndash;&gt;
          </dl>
        </div>-->
        <div class="connect-list-item pc-show" @click="connect('SignerNFID')">
          <span><img src="@/assets/img/NFID.svg" alt="" /></span>
          <dl>
            <dt>Connect NFID Wallet</dt>
            <!--<dd></dd>-->
          </dl>
        </div>
      </div>
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
      v-model="plugVisible"
      centered
      width="500px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal plug-modal"
    >
      <p>Plug is not installed. Click "OK" to install Plug!</p>
      <div class="plug-tip">
        If you just installed Plug you need to refresh the page (F5 on Windows)
        so that Plug is detected correctly.
      </div>
      <div class="delete-button">
        <button type="button" @click="plugVisible = false">Cancel</button>
        <a href="https://plugwallet.ooo/" target="_blank">
          <button type="button" class="default">OK</button></a
        >
      </div>
    </a-modal>
    <a-modal
      v-model="InfinityVisible"
      centered
      width="500px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal plug-modal"
    >
      <p>Infinity is not installed. Click "OK" to install Infinity!</p>
      <div class="plug-tip">
        If you just installed Infinity you need to refresh the page (F5 on
        Windows) so that Infinity is detected correctly.
      </div>
      <div class="delete-button">
        <button type="button" @click="InfinityVisible = false">Cancel</button>
        <a href="https://wallet.infinityswap.one/" target="_blank">
          <button type="button" class="default">OK</button></a
        >
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { LoginType } from './model';
import NewWallet from '@/views/login/components/NewWallet.vue';
import ExistingWallet from '@/views/login/components/ExistingWallet.vue';
import MetaMaskWallet from '@/views/login/components/MetaMaskWallet.vue';
import AuthClientAPi from '@/ic/AuthClientApi';
import ConnectPlug from '@/ic/ConnectPlug';
import { plugWhitelist } from '@/ic/utils';
import { createPlugWhiteActor } from '@/ic/createPlugActor';
import { namespace } from 'vuex-class';
import { ConnectMetaMaskMixin } from '@/mixins';
import ConnectInfinity from '@/ic/ConnectInfinity';
import { createInfinityWhiteActor } from '@/ic/createInfinityActor';
import { NFIDLogin } from '@/ic/NFIDAuth';
import { OISYLogin } from '@/ic/OISYAuth';
const commonModule = namespace('common');
@Component({
  name: 'Index',
  components: {
    NewWallet,
    ExistingWallet,
    MetaMaskWallet
  }
})
export default class extends Mixins(ConnectMetaMaskMixin) {
  @commonModule.Mutation('SET_SHOW_CHECK_AUTH') setCheckAuth?: any;
  $refs!: { newWallet: HTMLFormElement };
  private modalType = '';
  private comingVisible = false;
  private plugVisible = false;
  private InfinityVisible = false;
  private hostname = '';
  private signerVisible = false;
  created(): void {
    this.hostname = window.location.hostname;
  }
  private checkPlug(): boolean {
    return (window as any).ic && (window as any).ic.plug;
  }
  private checkInfinity(): boolean {
    return (window as any).ic && (window as any).ic.infinityWallet;
  }
  public back(): void {
    this.type = null;
  }
  public createNewWallet(): void {
    this.type = 'Mnemonic';
    this.$refs.newWallet.creatMnemonic();
  }
  public importExistingWallet(): void {
    this.type = 'Existing';
  }
  public async connect(type: LoginType): Promise<void> {
    this.setCheckAuth(false);
    if (type === 'Signer') {
      this.signerVisible = true;
    } else if (type === 'InternetIdentitiy') {
      this.connectSpinning = true;
      const authClientAPi = await AuthClientAPi.create();
      await authClientAPi.login();
      this.connectSpinning = false;
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect as any).catch(() => {
          return;
        });
      } else {
        this.$router.push('/ICDex').catch(() => {
          return;
        });
      }
    } else if (type === 'MetaMask') {
      this.connectSpinning = true;
      this.connectMetaMask();
    } else if (type === 'Plug' || type === 'SignerPlug') {
      const hasPlug = this.checkPlug();
      if (!hasPlug) {
        this.plugVisible = true;
      } else {
        let loading;
        if (type === 'SignerPlug') {
          loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
        } else {
          this.connectSpinning = true;
        }
        // const principal = localStorage.getItem('principal');
        // const localWhitelist =
        //   JSON.parse(localStorage.getItem('whitelist')) || {};
        // const whitelist: string[] = localWhitelist[principal] || plugWhitelist;
        const whitelist = plugWhitelist;
        const connectPlug = new ConnectPlug();
        if (
          (window as any).ic &&
          (window as any).ic.plug &&
          (window as any).ic.plug.agent
        ) {
          await (window as any).ic.plug.disconnect();
        }
        const isConnect = await connectPlug.connect(
          whitelist,
          type === 'SignerPlug'
        );
        if (isConnect) {
          await createPlugWhiteActor(type === 'SignerPlug');
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
        if (type === 'SignerPlug') {
          loading.close();
        } else {
          this.connectSpinning = false;
        }
      }
    } else if (type === 'Infinity') {
      const hasInfinity = this.checkInfinity();
      if (!hasInfinity) {
        this.InfinityVisible = true;
      } else {
        this.connectSpinning = true;
        // const principal = localStorage.getItem('principal');
        // const localWhitelist =
        //   JSON.parse(localStorage.getItem('whitelist')) || {};
        // const whitelist: string[] = localWhitelist[principal] || plugWhitelist;
        const whitelist = plugWhitelist;
        const connectInfinity = new ConnectInfinity();
        const connected = await (window as any).ic.infinityWallet.isConnected();
        if (connected) {
          (window as any).ic.infinityWallet.disconnect();
        }
        const isConnect = await connectInfinity.connect(whitelist);
        if (isConnect) {
          await createInfinityWhiteActor();
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
        this.connectSpinning = false;
      }
    } else if (type === 'HardwareWallet') {
      this.modalType = type;
      this.comingVisible = true;
    } else if (type === 'OISY') {
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      const signerAgent = await OISYLogin();
      loading.close();
      if (signerAgent) {
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
    } else if (type === 'NFID') {
      this.connectSpinning = true;
      await NFIDLogin();
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect as any).catch(() => {
          return;
        });
      } else {
        this.$router.push('/ICDex').catch(() => {
          return;
        });
      }
    } else if (type === 'SignerNFID') {
      const loading = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      const signerAgent = await NFIDLogin(true);
      loading.close();
      this.signerVisible = false;
      if (signerAgent) {
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
  }
  private loginByExists(): void {
    if (this.$route.query.redirect) {
      this.$router.replace({
        path: '/loginByExists',
        query: { redirect: this.$route.query.redirect }
      });
    } else {
      this.$router.replace('/loginByExists');
    }
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
    width: 650px;
    border-radius: 20px;
    background: #15161b;
    box-shadow: 0 0 15px 15px rgba(0, 0, 0, 0.6);
    padding: 30px 55px 90px 55px;
    color: #b9bcc4;
  }
}
.title {
  /*display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  background: #1f2432;*/
  margin: 0 auto;
  font-family: Monospace-my, serif;
  font-weight: bold;
  font-size: 40px;
  text-align: center;
  letter-spacing: 2px;
  /*color: #fff;*/
  /*span {
    color: #f24259;
  }*/
  img {
    width: 125px;
    margin-bottom: 25px;
  }
}
.sign-instead {
  display: flex;
  align-items: center;
  margin-top: 40px;
  a {
    padding-left: 90px;
    color: #575d67;
  }
  span {
    cursor: pointer;
    color: #1996c4;
    font-size: 16px;
  }
}
.plug-modal {
  p {
    margin-bottom: 10px;
  }
  div {
    line-height: 1.2;
    font-size: 12px;
    margin-bottom: 30px;
  }
}
@media screen and (max-width: 768px) {
  .main {
    padding: 0 15px;
    main {
      width: calc(100vw - 30px);
      padding: 20px 10px;
    }
  }
}
</style>
