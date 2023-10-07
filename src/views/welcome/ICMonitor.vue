<template>
  <div>
    <img src="@/assets/img/logo-web.png" alt="" />
    <p>
      ICMonitor: A canister management and reminder tool, also an externally
      triggered timer.
    </p>
    <div class="start">
      <button type="button" @click="jump">Start</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'ICMonitor',
  components: {}
})
export default class extends Vue {
  private jump(): void {
    this.$router.push('/iCMonitor');
  }
}
</script>

<style scoped lang="scss">
img {
  width: 300px;
}
p {
  margin: 20px 0;
  line-height: 20px;
  font-size: 16px;
}
.start {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  button {
    width: 200px;
    height: 40px;
  }
}
</style>
