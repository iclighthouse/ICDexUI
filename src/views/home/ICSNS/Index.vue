<template>
  <div>
    <!--<div class="home-header" style="margin-top: 14px">
      <div class="home-header-left">
        <span class="home-header-title">SNS</span>
      </div>
    </div>-->
    <div>
      <ul v-if="!$route.meta.hideMenu" class="icsns-menu">
        <li
          v-for="menu in ICSNSMenu"
          :key="menu.name"
          :class="{
            active: menu.name === $route.name
          }"
          @click="changeMenu(menu)"
        >
          {{ menu.value }}
        </li>
      </ul>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
@Component({
  name: 'Index',
  components: { AccountInfo }
})
export default class extends Vue {
  private ICSNSMenu = [
    {
      value: 'Tokens',
      name: 'ICSNS-Tokens',
      path: '/icsns'
    },
    {
      value: 'Neurons',
      name: 'ICSNS-Neurons',
      path: '/icsns/neurons'
    },
    {
      value: 'Launchpad',
      name: 'ICSNS-Launchpad',
      path: '/icsns/launchpad'
    },
    {
      value: 'Proposals',
      name: 'ICSNS-Proposals',
      path: '/icsns/proposals'
    }
  ];
  private changeMenu(val): void {
    this.$router.push(val.path);
  }
}
</script>
<style scoped lang="scss">
.icsns-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 620px;
  margin: 60px auto 40px;
  background: #232730;
  border-radius: 30px;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 40px;
    font-size: 16px;
    color: #51b7c3;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 25px;
    &.active {
      background: #51b7c3;
      border-color: #51b7c3;
      color: #ffffff;
    }
  }
}
@media screen and (max-width: 768px) {
  .icsns-menu {
    width: calc(100% - 20px);
    margin: 20px auto 40px;
    padding: 0 5px;
    li {
      font-size: 14px;
    }
  }
}
</style>
