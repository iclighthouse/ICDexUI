<template>
  <div class="your-created-token-main">
    <tokens ref="tokens"></tokens>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Tokens from '@/views/home/icTokens/components/Tokens.vue';
@Component({
  name: 'YourTokens',
  components: {
    Tokens
  }
})
export default class extends Vue {
}
</script>
<style scoped lang="scss"></style>
