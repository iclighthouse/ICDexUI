<template>
  <div>
    <ul class="token-list-menu">
      <li
        v-for="item in menuList"
        :key="item.path"
        :class="{ active: current === item.path }"
        @click="jump(item)"
      >
        {{ item.value }}
      </li>
    </ul>
    <div
      class="container-width"
      style="color: #8c98a5; font-weight: bold; margin-bottom: 15px"
    >
      This feature is experimental, the token created here should not be used in
      the production environment. The created token is controlled by Funder,
      please pay attention to the token's controllers changes. Note: controllers
      can be upgraded, modified token canister, including increment.
    </div>
    <router-view class="token-main" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Identity } from '@dfinity/agent';
import { namespace } from 'vuex-class';
import { Menu } from '@/components/menu/model';
const commonModule = namespace('common');
import { ICTokenService } from '@/ic/ICTokens/ICTokenService';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import { Principal } from '@dfinity/principal';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  @commonModule.Getter('getIdentity') getIdentity?: Identity;
  private menuList: Menu[] = [];
  private current = '/icTokens/youCreatedToken';
  private ICTokenService: ICTokenService;
  created(): void {
    this.ICTokenService = new ICTokenService();
    this.menuList = [
      {
        path: '/icTokens/youCreatedToken',
        value: 'Created'
      },
      {
        path: '/icTokens/favourites',
        value: 'Favourites'
      },
      {
        path: '/icTokens/tokenList',
        value: 'Token list'
      }
    ];
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const principal = localStorage.getItem('principal');
    this.current = this.$route.path;
    if (priList[principal] === 'Plug' || priList[principal] === 'Infinity') {
      this.getTokenList();
    }
  }
  private jump(menu: Menu): void {
    this.current = menu.path;
    this.$router.push(menu.path);
  }
  private async getTokenList(): Promise<void> {
    const principal = localStorage.getItem('principal');
    const promiseAllValue = [];
    let canisterIds: Array<string> = [];
    promiseAllValue.push(
      this.ICTokenService.getTokenList(10, 0),
      this.ICTokenService.getTokens(Principal.fromText(principal)), // you created token
      this.ICTokenService.getStarTokens(Principal.fromText(principal)) // star token
    );
    const tokens = await Promise.all(promiseAllValue);
    tokens[0].forEach((item) => {
      canisterIds.push(item[0].toString());
    });
    tokens[1].forEach((item) => {
      canisterIds.push(item.toString());
    });
    tokens[2].forEach((item) => {
      canisterIds.push(item[0].toString());
    });
    canisterIds = [...new Set(canisterIds)];
    const flag = needConnectPlug(canisterIds);
    if (flag && this.$route.name === 'icTokens') {
      // const h = this.$createElement;
      this.$info({
        content: 'Tokens need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(canisterIds);
        }
      });
    }
    const connectInfinity = await needConnectInfinity(canisterIds);
    if (connectInfinity && this.$route.name === 'icTokens') {
      // const h = this.$createElement;
      this.$info({
        content: 'Tokens need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity(canisterIds);
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.token-list-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 470px;
  height: 60px;
  margin: 80px auto 20px;
  border-radius: 30px;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  background: #232730;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 40px;
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    &.active {
      background: #51b7c3;
    }
  }
}
.token-main {
  width: 100%;
  padding: 0 20px;
}
@media screen and (max-width: 768px) {
  .token-list-menu {
    width: 100%;
    li {
      width: 31%;
    }
  }
}
</style>
