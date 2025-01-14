<template>
  <div>
    <img src="@/assets/img/logo-web.png" alt="" />
    <p>
      Cycles.Finance is an ICP/Cycles marketplace that supports bidirectional
      exchange of ICP, Cycles, using a multiplicative constant K model (A*B=K),
      similar to UniSwapV2.
    </p>
    <div class="start">
      <button type="button" @click="jump">Start</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'CyclesFinance',
  components: {}
})
export default class extends Vue {
  private jump(): void {
    this.$router.push('/cyclesFinance');
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
