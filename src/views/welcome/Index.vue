<template>
  <div class="welcome">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {}
</script>
<style scoped lang="scss">
.welcome {
  width: 800px;
  margin: 40px auto 0;
  color: #9d9d9d;
}
</style>
