<template>
  <div>
    <div class="home-header">
      <div class="home-header-left">
        <img
          class="home-header-logo"
          src="@/assets/img/icdex-2.png"
          alt="logo"
        />
      </div>
      <ul>
        <li
          :class="{
            active:
              $route.fullPath.toLocaleLowerCase() ===
                menu.path.toLocaleLowerCase() ||
              (menu.value === 'Trade' && $route.name === 'ICDex')
          }"
          v-for="(menu, index) in menuList"
          :key="index"
        >
          <router-link :to="menu.path">{{ menu.value }}</router-link>
        </li>
      </ul>
      <div class="flex-center margin-left-auto">
        <span
          v-if="getPrincipalId"
          @click="showLaunch"
          class="base-font-title pointer pc-show"
          style="font-size: 15px"
          >+Launch</span
        >
        <div class="home-header-right-info">
          <account-info :menu-list="menuList"></account-info>
        </div>
      </div>
    </div>
    <div class="nft-main container-width">
      <div class="w100" style="margin: 30px 0 20px; font-size: 16px">
        <a
          href="https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai"
          target="_blank"
          rel="nofollow noreferrer noopener"
          class="link"
          >ICLighthouse Planet NFT</a
        >
      </div>
      <table>
        <thead>
          <tr align="center">
            <th>NFT</th>
            <th>Planet</th>
            <th>Number</th>
            <th>Scenarios for use</th>
          </tr>
        </thead>
        <tbody>
          <tr align="center">
            <td>
              <div class="nft-img">
                <img
                  src="https://cdn.yumi.io/file/0.png?&url=https%3A%2F%2Fpgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app%2Ffile%2F0.png&width=800"
                  alt=""
                />
              </div>
            </td>
            <td>Neptune Card</td>
            <td>5</td>
            <td>
              <div><span class="dots"></span> Airdrop 3,000 ICL</div>
              <div><span class="dots"></span> Prioritize new features</div>
              <div><span class="dots"></span> Mining Acceleration</div>
              <div><span class="dots"></span> Create OAMMs at a discount</div>
              <div style="font-weight: bold" class="base-font-title">
                <span class="dots"></span> Bind 5 vip-makers
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="nft-img">
                <img
                  src="https://cdn.yumi.io/file/5.png?&url=https%3A%2F%2Fpgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app%2Ffile%2F5.png&width=800"
                  alt=""
                />
              </div>
            </td>
            <td>Uranus Card</td>
            <td>10</td>
            <td>
              <div><span class="dots"></span> Airdrop 3,000 ICL</div>
              <div><span class="dots"></span> Prioritize new features</div>
              <div><span class="dots"></span> Mining Acceleration</div>
              <div><span class="dots"></span> Create OAMMs at a discount</div>
              <div style="font-weight: bold" class="base-font-title">
                <span class="dots"></span> Listing referrer identity
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="nft-img">
                <img
                  src="https://cdn.yumi.io/file/15.png?&url=https%3A%2F%2Fpgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app%2Ffile%2F15.png&width=800"
                  alt=""
                />
              </div>
            </td>
            <td>Saturn Card</td>
            <td>100</td>
            <td>
              <div><span class="dots"></span> Airdrop 2,500 ICL</div>
              <div><span class="dots"></span> Prioritize new features</div>
              <div><span class="dots"></span> Mining Acceleration</div>
              <div><span class="dots"></span> Create OAMMs at a discount</div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="nft-img">
                <img
                  src="https://cdn.yumi.io/file/126.png?&url=https%3A%2F%2Fpgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app%2Ffile%2F126.png&width=800"
                  alt=""
                />
              </div>
            </td>
            <td>Jupiter Card</td>
            <td>200</td>
            <td>
              <div><span class="dots"></span> Airdrop 2,100 ICL</div>
              <div><span class="dots"></span> Prioritize new features</div>
              <div><span class="dots"></span> Mining Acceleration</div>
              <div>
                <span class="dots"></span> Create private OAMMs at a discount
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="nft-img">
                <img
                  src="https://cdn.yumi.io/file/346.png?&url=https%3A%2F%2Fpgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app%2Ffile%2F346.png&width=800"
                  alt=""
                />
              </div>
            </td>
            <td>Mars Card</td>
            <td>300</td>
            <td>
              <div><span class="dots"></span> Airdrop 1,800 ICL</div>
              <div><span class="dots"></span> Prioritize new features</div>
              <div><span class="dots"></span> Mining Acceleration</div>
              <div>
                <span class="dots"></span> Create private OAMMs at a discount
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="nft-img">
                <img
                  src="https://cdn.yumi.io/file/870.png?&url=https%3A%2F%2Fpgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app%2Ffile%2F870.png&width=800"
                  alt=""
                />
              </div>
            </td>
            <td>Earth Card</td>
            <td>400</td>
            <td>
              <div><span class="dots"></span> Airdrop 1,500 ICL</div>
              <div><span class="dots"></span> Prioritize new features</div>
              <div><span class="dots"></span> Mining Acceleration</div>
              <div>
                <span class="dots"></span> Create private OAMMs at a discount
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="nft-img">
                <img
                  src="https://cdn.yumi.io/file/1361.png?&url=https%3A%2F%2Fpgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app%2Ffile%2F1361.png&width=800"
                  alt=""
                />
              </div>
            </td>
            <td>Venus Card</td>
            <td>500</td>
            <td>
              <div><span class="dots"></span> Airdrop 1,200 ICL</div>
              <div><span class="dots"></span> Prioritize new features</div>
              <div><span class="dots"></span> Mining Acceleration</div>
              <div>
                <span class="dots"></span> Create private OAMMs at a discount
              </div>
            </td>
          </tr>
          <tr align="center">
            <td>
              <div class="nft-img">
                <img
                  src="https://cdn.yumi.io/file/1886.png?&url=https%3A%2F%2Fpgi7h-uqaaa-aaaao-ae6ha-cai.raw.ic0.app%2Ffile%2F1886.png&width=800"
                  alt=""
                />
              </div>
            </td>
            <td>Mercury Card</td>
            <td>507</td>
            <td>
              <div><span class="dots"></span> Airdrop 1,000 ICL</div>
              <div><span class="dots"></span> Prioritize new features</div>
              <div><span class="dots"></span> Mining Acceleration</div>
              <div>
                <span class="dots"></span> Create private OAMMs at a discount
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <launch :tokens="tokens" ref="launch"></launch>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Menu } from '@/components/menu/model';
import Launch from '@/views/home/ICDex/components/Launch.vue';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { namespace } from 'vuex-class';
import { TokenInfo } from '@/ic/common/icType';
const commonModule = namespace('common');

@Component({
  name: 'NFT',
  components: { Launch, AccountInfo }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private menuList: Menu[] = [
    {
      value: 'Trade',
      path: '/ICDex'
    },
    {
      value: 'Market',
      path: '/ICDex/market'
    },
    {
      value: 'Pools',
      path: '/ICDex/pools'
    },
    {
      value: 'NFT',
      path: '/ICDex/NFT'
    },
    {
      value: 'Competitions',
      path: '/ICDex/competitions'
    }
    // ,
    // {
    //   value: 'Mining',
    //   path: '/icl/tradingMining'
    // }
  ];
  private tokens: { [key: string]: TokenInfo } = {};
  created(): void {
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
  }
  private showLaunch(): void {
    (this.$refs.launch as any).init();
  }
}
</script>

<style scoped lang="scss">
.home-header {
  top: 14px;
}
table {
  line-height: 1.5;
}
</style>
