<template>
  <div class="error-info">Is being upgraded...</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'error',
  components: {}
})
export default class extends Vue {}
</script>

<style scoped lang="scss">
.error-info {
  margin-top: 100px;
  text-align: center;
  color: #999;
  font-size: 20px;
}
</style>
