<template>
  <div class="base-bg">
    <div
      class="home-header"
      :class="{
        'home-header-main':
          $route.fullPath.toLocaleLowerCase().startsWith('/icl') ||
          $route.fullPath.toLocaleLowerCase().startsWith('/icdex') ||
          $route.fullPath.toLocaleLowerCase().startsWith('/market') ||
          $route.fullPath.toLocaleLowerCase().startsWith('/competitions') ||
          $route.fullPath.toLocaleLowerCase().startsWith('/cyclesfinance') ||
          $route.fullPath.toLocaleLowerCase().startsWith('/icswap') ||
          $route.fullPath.toLocaleLowerCase().startsWith('/mining')
      }"
    >
      <div class="home-header-main-menu">
        <img
          class="home-header-main-menu-left"
          src="@/assets/img/logo-i.png"
          alt=""
        />
        <!--<a-icon class="home-header-main-menu-left" type="double-left" />-->
        <div class="home-header-main-menu-span">
          <!--<a-icon type="double-right" />-->
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="home-header-left">
        <img class="home-header-logo" src="@/assets/img/logo.png" alt="logo" />
        <!--<img
					class="home-header-logo"
					src="@/assets/img/icdex-2.png"
					alt="logo"
				/>-->
      </div>
      <ul>
        <a-dropdown
          :getPopupContainer="() => $refs.homeHeaderMain"
          placement="bottomCenter"
        >
          <li
            ref="homeHeaderMain"
            :class="{
              active:
                $route.fullPath.toLocaleLowerCase().startsWith('/wallet') ||
                $route.fullPath.toLocaleLowerCase().startsWith('/nns') ||
                $route.fullPath.toLocaleLowerCase().startsWith('/icsns')
            }"
          >
            <span>ICLight</span>
            <a-icon type="caret-down" />
          </li>
          <a-menu slot="overlay" class="base-bg-box home-header-menu">
            <a-menu-item class="home-header-item">
              <div
                @click="changeMenu('wallet', '/wallet')"
                :class="{
                  active: $route.fullPath
                    .toLocaleLowerCase()
                    .startsWith('/wallet')
                }"
                class="home-header-item-info"
              >
                Wallet
              </div>
            </a-menu-item>
            <a-menu-item class="home-header-item">
              <div
                @click="changeMenu('nns', '/nns')"
                :class="{
                  active: $route.fullPath.toLocaleLowerCase().startsWith('/nns')
                }"
                class="home-header-item-info"
              >
                NNS
              </div>
            </a-menu-item>
            <a-menu-item class="home-header-item">
              <div
                @click="changeMenu('ICSNS', '/ICSNS')"
                :class="{
                  active: $route.fullPath
                    .toLocaleLowerCase()
                    .startsWith('/icsns')
                }"
                class="home-header-item-info"
              >
                SNS
              </div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <li
          @click="changeMenu('icRouter', '/icRouter')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/icrouter')
          }"
        >
          <span>icRouter</span>
        </li>
        <!--<li
          @click="changeMenu('ICSNS', '/ICSNS')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/icsns')
          }"
        >
          <span>ICSNS</span>
        </li>-->
        <li
          @click="changeMenu('ICDex', '/ICDex')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/icdex')
          }"
        >
          <span>ICDex</span>
        </li>
        <li
          @click="changeMenu('NFT', '/NFT')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/nft')
          }"
        >
          <span>NFT</span>
        </li>
        <li
          @click="changeMenu('Airdrop', '/Airdrop')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/airdrop')
          }"
        >
          <span>Airdrop</span>
        </li>
        <li
          @click="changeMenu('CyclesFinance', '/CyclesFinance')"
          :class="{
            active: $route.fullPath
              .toLocaleLowerCase()
              .startsWith('/cyclesfinance')
          }"
        >
          <span>CyclesFinance</span>
        </li>
        <!--<li
          @click="changeMenu('dapps', '/dapps')"
          :class="{
            active:
              $route.fullPath.toLocaleLowerCase().startsWith('/dapps') ||
              $route.fullPath.toLocaleLowerCase().startsWith('/icl') ||
              $route.fullPath
                .toLocaleLowerCase()
                .startsWith('/cyclesfinance') ||
              $route.fullPath.toLocaleLowerCase().startsWith('/icswap')
          }"
        >
          <span>DApps</span>
        </li>-->
        <!--<li
					@click="changeMenu('ICDex', '/ICDex')"
					:class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/icdex')
          }"
				>
					<span>Trade</span>
				</li>
				<li
					@click="changeMenu('Info', '/icdex/Info')"
					:class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/market')
          }"
				>
					<span>Market</span>
				</li>-->
        <!--<li
          @click="changeMenu('/icl', '/icl/tradingMining')"
          :class="{
            active: $route.fullPath
              .toLocaleLowerCase()
              .startsWith('/icl/tradingmining')
          }"
        >
          <span>Mining</span>
        </li>-->
        <!--<li
          @click="changeMenu('Dashboard', '/Dashboard')"
          :class="{
            active: $route.fullPath.toLocaleLowerCase().startsWith('/dashboard')
          }"
        >
          <span>Dashboard</span>
        </li>-->
        <li>
          <a
            href="https://ic.house"
            target="_blank"
            rel="nofollow noreferrer noopener"
            >ICHouse</a
          >
        </li>
        <!--<li
          v-if="
            hostname &&
            hostname !== 'avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app' &&
            hostname !== 'pk6zh-iiaaa-aaaaj-ainda-cai.raw.ic0.app'
          "
          style="padding: 0 20px; font-size: 12px"
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
        </li>-->
      </ul>
      <account-info> </account-info>
    </div>
    <div class="home-main">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <div
      class="home-footer pc-show"
      :class="{
        'home-footer-icdex': $route.fullPath
          .toLocaleLowerCase()
          .startsWith('icdex'),
        'home-footer-proposals':
          $route.meta.details && $route.meta.details === 'proposals'
      }"
    >
      <div class="home-footer-top"></div>
      <div class="container-width">
        <span class="container-width-copy">
          <span>
            © {{ year }}
            <a
              href="https://iclight.house/"
              rel="nofollow noreferrer noopener"
              target="_blank"
            >
              ICLight.house
            </a>
          </span>
          <span class="footer-version">
            <span v-show="$route.fullPath.toLocaleLowerCase().includes('icdex')"
              >ICDexRouter v{{ version.router }}; ICDexPair v{{ version.pair }};
              ICDexMaker v{{ version.maker }}; ICDexUI v2.0.9
            </span>
          </span>
        </span>
        <ul>
          <li>
            <a
              href="https://twitter.com/ICLighthouse"
              rel="nofollow noreferrer noopener"
              target="_blank"
            >
              <a-icon type="twitter" />
            </a>
          </li>
          <li>
            <a
              href="https://discord.gg/FQZFGGq7zv"
              target="_blank"
              rel="nofollow noreferrer noopener"
            >
              <i aria-hidden="true" class="icon-svg">
                <svg
                  id="discord"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"
                  ></path>
                </svg>
              </i>
            </a>
          </li>
          <li>
            <a
              href="https://medium.com/@ICLighthouse"
              target="_blank"
              rel="nofollow noreferrer noopener"
            >
              <i aria-hidden="true" class="icon-svg">
                <svg viewBox="0 0 1043.63 592.71" class="bo eh">
                  <g data-name="Layer 2">
                    <g data-name="Layer 1">
                      <path
                        d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"
                      ></path>
                    </g>
                  </g>
                </svg>
              </i>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/iclighthouse"
              rel="nofollow noreferrer noopener"
              target="_blank"
            >
              <a-icon type="github" />
            </a>
          </li>
        </ul>
      </div>
      <div class="container-width-domains">
        The dApp domains:
        <span style="color: #646e79"
          >(Add them to your favorites to prevent scamming risks)</span
        >
        <div style="color: #646e79">
          <a
            style="color: #2b8cb0"
            href="https://iclight.io/"
            rel="nofollow noreferrer noopener"
            target="_blank"
            >iclight.io</a
          >,
          <a
            style="color: #2b8cb0"
            href="https://icdex.io/"
            rel="nofollow noreferrer noopener"
            target="_blank"
            >icdex.io</a
          >,
          <a
            style="color: #2b8cb0"
            href="https://7vkf4-jqaaa-aaaaj-azrua-cai.icp0.io/"
            rel="nofollow noreferrer noopener"
            target="_blank"
            >7vkf4-jqaaa-aaaaj-azrua-cai.icp0.io</a
          >
          <span style="color: #646e79">(recommended)</span>,
          <a
            style="color: #2b8cb0"
            href="https://avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app/"
            rel="nofollow noreferrer noopener"
            target="_blank"
            >avjzx-pyaaa-aaaaj-aadmq-cai.raw.ic0.app</a
          >
          <span style="color: #646e79">(to be discarded)</span>
        </div>
      </div>
      <div class="container-width-disclaimers">
        <span class="disclaimers">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { principalToAccountIdentifier } from '@/ic/converter';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { Principal } from '@dfinity/principal';
import Identicon from 'identicon.js';
import { Menu } from '@/components/menu/model';
import { namespace } from 'vuex-class';
import { Route } from 'vue-router/types/router';
import { connectIcx } from '@/ic/connectIcx';
import EventBus from '@/utils/Event';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';

const commonModule = namespace('common');

@Component({
  name: 'Index',
  components: {
    AccountInfo
  }
})
export default class extends Vue {
  @commonModule.Mutation('SET_PRINCIPAL_ID') setPrincipalId?: any;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @commonModule.Mutation('SET_SHOW_CHECK_AUTH') setCheckAuth?: any;
  @commonModule.Getter('getIdentity') getIdentity?:
    | Secp256k1KeyIdentity
    | Ed25519KeyIdentity;
  public defaultSelectedKeys = 'account';
  private principalList: Array<string> = [];
  private priList = {};
  private year: number;
  private menuList: Menu[] = [];
  private stableMenuList: Menu[] = [];
  private encryptSeedPhrase = '';
  private activeKey = 1;
  private hasSubMenu = false;
  private isIcx = false;
  private icdexIcxMenu: Menu[] = [];
  private hostname = '';
  private hostHref = '';
  private ICDexRouterService: ICDexRouterService = null;
  private version = {
    router: '',
    pair: '',
    maker: ''
  };
  @Watch('$route')
  private onRouteChange(route: Route, lastRoute: Route) {
    this.hasSubMenu =
      route.fullPath.toLocaleLowerCase().startsWith('/icl') ||
      route.fullPath.toLocaleLowerCase().startsWith('/icstable');
  }
  beforeDestroy(): void {
    EventBus.$off(['initSuccess', 'initAccount']);
  }
  mounted(): void {
    this.hostname = window.location.hostname;
    this.hostHref = window.location.href;
    this.isIcx = !!(window as any).icx;
  }
  created(): void {
    this.menuList = [
      {
        path: '/icl/about',
        value: 'About'
      },
      {
        path: '/icl/mining',
        value: 'Mining'
      },
      {
        path: '/icl/quests',
        value: 'Quests'
      },
      {
        path: '/icl/tradingMining',
        value: 'Trading Mining'
      }
    ];
    this.stableMenuList = [
      {
        path: '/ICStable',
        value: 'Borrow'
      },
      {
        path: '/ICStable/positions',
        value: 'My Positions'
      }
    ];
    this.icdexIcxMenu = [
      {
        path: '/wallet',
        value: 'ICLight Wallet'
      },
      {
        path: '/ICDex',
        value: 'ICDex'
      }
    ];
    this.hasSubMenu =
      this.$route.fullPath.toLocaleLowerCase().startsWith('/icl') ||
      this.$route.fullPath.toLocaleLowerCase().startsWith('/icstable');
    this.year = new Date().getFullYear();
    const path = this.$route.name;
    this.defaultSelectedKeys = path.toLocaleLowerCase();
    this.getAccountInfo();
    this.ICDexRouterService = new ICDexRouterService();
    this.getVersion();
  }
  private getVersion(): void {
    this.ICDexRouterService.version()
      .then((res) => {
        this.$set(this.version, 'router', res);
      })
      .catch(() => {
        this.$set(this.version, 'router', '0.12.26');
      });
    this.ICDexRouterService.getICDexPairWasmVersion().then((res) => {
      this.$set(this.version, 'pair', res[0]);
    });
    this.ICDexRouterService.getICDexMakerWasmVersion().then((res) => {
      this.$set(this.version, 'maker', res[0]);
    });
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
        if (this.$route.fullPath.toLocaleLowerCase().startsWith('/wallet')) {
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
    if (
      this.priList[this.getPrincipalId] !== 'Plug' &&
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
  private getAccountImg(principal: string) {
    if (principal) {
      const account = principalToAccountIdentifier(
        Principal.fromText(principal)
      );
      return 'data:image/png;base64,' + new Identicon(account, 20).toString();
    }
    return '';
  }
  get accountImg(): string {
    if (this.getPrincipalId) {
      return this.getAccountImg(this.getPrincipalId);
    }
    return '';
  }
}
</script>

<style scoped lang="scss">
.arrow-left-link {
  display: flex;
  align-items: center;
  margin-right: 20px;
  color: #51b7c3;
  i {
    padding-right: 5px;
    font-size: 12px;
  }
}
.home-main {
  min-height: calc(100vh - 140px);
  margin: 0 auto;
  padding-top: 64px;
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
        color: #51b7c3;
      }
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
.home-header-main-menu-left {
  display: none;
}
.home-header-main {
  background: #2b3845;
  top: -50px;
  z-index: 1000;
  box-shadow: 0 0 1px 1px rgba(52, 69, 94, 0.4);
  transition: all 0.5s ease-out;
  border: none;
  .home-header-logo {
    height: 36px;
  }
  .home-header-main-menu-left {
    position: absolute;
    left: 15px;
    bottom: -9px;
    width: 18px;
    display: inline-block;
  }
  .home-header-main-menu {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 14px;
    .home-header-main-menu-span {
      position: absolute;
      left: 50%;
      bottom: 5px;
      margin-left: -10px;
      display: flex;
      align-items: center;
    }
    span {
      display: inline-block;
      width: 4px;
      height: 4px;
      margin-right: 3px;
      border-radius: 3px;
      background: #51b7c3;
    }
  }
  &:hover {
    top: 0;
    background: #1b242e;
    border: none;
    box-shadow: none;
    height: 77px;
    .home-header-logo {
      height: 36px;
    }
    .home-header-main-menu {
      visibility: hidden;
    }
  }
  .up-img {
    display: block;
    position: absolute;
    right: 20px;
    top: 64px;
    height: 22px;
    transform: rotate(180deg);
  }
  .up-logo-img {
    display: block;
    position: absolute;
    right: 45px;
    top: 67px;
    height: 16px;
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
  padding-bottom: 35px;
  background: #131920;
  color: #adb7c2;
  .home-footer-top {
    height: 20px;
    background: #06080b;
  }
  &.home-footer-icdex {
    padding: 40px 0 0 0;
  }
  &.home-footer-proposals {
    display: none !important;
  }
  ul {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
  .container-width {
    display: flex;
    align-items: flex-start;
    padding-top: 40px;
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
  display: flex;
  flex-direction: column;
  .container-width-copy-powered {
    font-size: 12px;
    padding-left: 10px;
    color: #646e79;
    a {
      color: #646e79;
    }
  }
  a {
    color: #2b8cb0;
  }
}
.footer-version {
  font-size: 20px;
  padding-top: 5px;
  transform-origin: left;
  transform: scale(0.6);
  color: #646e79;
}
.old-version {
  color: #575d67 !important;
  font-size: 12px;
  &.old-version-logo {
    display: flex;
    height: 42px;
    align-items: flex-end;
    margin-left: 5px;
  }
}
.container-width-disclaimers {
  width: 1000px;
  height: 120px;
  margin: 0 auto;
  overflow: hidden;
}
.disclaimers {
  display: inline-block;
  width: 2000px;
  font-size: 20px;
  padding-top: 20px;
  transform-origin: left top;
  transform: scale(0.5);
  color: #646e79;
}
.home-header-menu {
  display: flex;
  flex-direction: column;
  margin-left: 0 !important;
}
.home-header-item {
  display: flex;
  align-items: center;
  width: 100%;
  color: #fff;
  height: 50px;
  border-bottom: 1px solid #383e4e;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #51b7c3;
  }
  &:last-child {
    border-bottom: none;
  }
  .home-header-item-info {
    display: inline-block;
    text-align: center;
    width: 100%;
    padding: 8px 15px;
    margin: 0;
    &.active {
      color: #51b7c3;
    }
  }
}
.container-width-domains {
  width: 1000px;
  margin: 5px auto 0;
  font-size: 12px;
  line-height: 1.5;
}
@media screen and (max-width: 1000px) {
  .home-footer {
    .container-width {
      width: 100%;
    }
  }
}
@media screen and (max-width: 992px) {
  .home-header {
    ul {
      margin-left: 20px;
      li {
        padding: 0 20px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
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
</style>
