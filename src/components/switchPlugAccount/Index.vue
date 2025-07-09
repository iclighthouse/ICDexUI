<template>
  <a-modal
    v-model="plugVisible"
    centered
    width="500px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    :closable="false"
    class="delete-modal plug-modal"
  >
    <p>
      Your {{ accountType }} account (<a-tooltip placement="top">
        <template slot="title">
          <span>{{ plugAccount }}</span> </template
        >{{ plugAccount | ellipsisAccount }}</a-tooltip
      >) does not match your local account (<a-tooltip placement="top">
        <template slot="title">
          <span>{{ localAccount }}</span> </template
        >{{ localAccount | ellipsisAccount }}</a-tooltip
      >) and connection failed.Please switch {{ accountType }} account, or
      connect a new account.
    </p>
    <div class="delete-button">
      <button type="button" @click="plugVisible = false">Confirm</button>
      <button type="button" @click="login" style="width: 150px" class="default">
        Connect new account
      </button>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AuthClientAPi from '@/ic/AuthClientApi';
import { namespace } from 'vuex-class';
import { NFIDLogout } from '@/ic/NFIDAuth';
import { OISYLogout } from '@/ic/OISYAuth';
const commonModule = namespace('common');
@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  @commonModule.Mutation('SET_PRINCIPAL_ID') setPrincipalId?: any;
  @commonModule.Mutation('SET_SHOW_CHECK_AUTH') setCheckAuth?: any;
  @commonModule.Mutation('SET_IDENTITY') setIdentity?: any;
  @Prop({ type: String, default: '' })
  private plugAccount!: string;
  @Prop({ type: String, default: '' })
  private localAccount!: string;
  @Prop({ type: String, default: 'Plug' })
  private accountType!: string;
  public plugVisible = false;
  private async login(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const authClientAPi = await AuthClientAPi.create();
      const identity = authClientAPi.tryGetIdentity();
      if (identity) {
        await authClientAPi.logout();
      }
      const principal = localStorage.getItem('principal');
      const priList = JSON.parse(localStorage.getItem('priList')) || {};
      if (
        priList[principal] === 'Plug' ||
        priList[principal] === 'SignerPlug'
      ) {
        if ((window as any).ic && (window as any).ic.plug) {
          await (window as any).ic.plug.disconnect();
        }
      }
      if (priList[principal] === 'Infinity') {
        if ((window as any).ic && (window as any).ic.infinityWallet) {
          (window as any).ic.infinityWallet.disconnect();
        }
      }
      if (
        priList[principal] === 'NFID' ||
        priList[principal] === 'SignerNFID'
      ) {
        await NFIDLogout();
      }
      if (priList[principal] === 'OISY') {
        await OISYLogout();
      }
      localStorage.removeItem('principal');
      this.setPrincipalId(null);
      this.setCheckAuth(false);
      this.setIdentity(null);
      this.$router.replace({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    } catch (e) {}
    loading.close();
  }
}
</script>
<style scoped lang="scss"></style>
