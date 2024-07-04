<template>
  <div>
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
