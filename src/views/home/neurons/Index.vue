<template>
  <div>
    <div>
      <ul class="icsns-menu" v-if="!$route.meta.hideMenu">
        <li
          v-for="menu in menuList"
          :key="menu.path"
          :class="{
            active: menu.name === $route.name
          }"
          @click="changeMenu(menu.path)"
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
import { Menu } from './model';
@Component({
  name: 'Index',
  components: { AccountInfo }
})
export default class extends Vue {
  public menuList: Menu[] = [];
  public current = [];
  created(): void {
    this.menuList = [
      {
        path: '/nns/neuron',
        value: 'Neurons',
        name: 'ICP-neuron'
      },
      {
        path: '/nns/proposals',
        value: 'Proposals',
        name: 'ICP-proposals'
      }
    ];
    this.current = ['/nns/neuron'];
  }
  private changeMenu(path: string): void {
    this.$router.push(path);
  }
}
</script>
<style scoped lang="scss">
.icsns-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 330px;
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
