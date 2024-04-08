<template>
  <div>
    <div class="home-header">
      <div class="home-header-left">
        <img class="home-header-logo" src="@/assets/img/icl.svg" alt="logo" />
      </div>
      <ul>
        <li
          :class="{ active: $route.path === item.path }"
          v-for="(item, index) in menuList"
          :key="index"
        >
          <router-link :to="item.path">{{ item.value }}</router-link>
        </li>
      </ul>
      <account-info :menu-list="menuList"></account-info>
    </div>
    <div class="icl-main container-width">
      <icl-info
        v-if="$route.path === '/icl/mining'"
        class="icl-info"
      ></icl-info>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Identity } from '@dfinity/agent';
import IclInfo from '@/views/home/icl/components/ICLInfo.vue';
import { namespace } from 'vuex-class';
import { Menu } from '@/components/menu/model';
import AccountInfo from '@/views/home/components/AccountInfo.vue';

const commonModule = namespace('common');

@Component({
  name: 'Index',
  components: {
    IclInfo,
    AccountInfo
  }
})
export default class extends Vue {
  @commonModule.Getter('getIdentity') getIdentity?: Identity;
  private menuList: Menu[] = [];
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
  }
}
</script>

<style scoped lang="scss">
.home-header {
  top: 10px;
}
.icl-main {
  margin: 80px auto 0;
  padding-bottom: 20px;
}
@media screen and (max-width: 768px) {
  .home-header {
    ul {
      display: none;
    }
  }
  .icl-main {
    margin-top: 20px;
  }
}
</style>
