<template>
  <div class="container-width tokens-main">
    <div v-if="getPrincipalId"></div>
    <div v-else>
      <div class="wallet-empty container-width">
        <img src="@/assets/img/empty.png" alt="" />
        <p>Connect wallet to view</p>
        <button type="button" class="default" @click="connectWallet">
          Connect Wallet
        </button>
      </div>
    </div>
    <div class="sns-token-list">
      <div
        class="sns-token-list-item"
        v-for="(token, index) in SNSTokens"
        :key="index"
      >
        <a-skeleton :loading="!token" active>
          <div v-if="token" class="sns-token-list-item-info">
            <img
              v-if="token.logo && token.logo[0]"
              :src="token.logo[0]"
              alt=""
            />
            <span v-if="token.symbol" class="sns-token-list-item-info-symbol">{{
              token.symbol
            }}</span>
            <span
              v-if="token.name && token.name[0]"
              class="sns-token-list-item-info-name"
              >{{ token.name[0] }}</span
            >
            <a
              v-if="token.url && token.url[0]"
              :href="token.url[0]"
              rel="nofollow noreferrer noopener"
              target="_blank"
            >
              <a-icon type="global" />
            </a>
          </div>
          <div v-if="token" class="sns-token-list-item-balance">
            <span class="token-balance">
              {{
                token.balance |
                  bigintToFloat(token.decimals, token.decimals) |
                  formatNum
              }}</span
            ><span class="token-symbol">{{ token.symbol }} </span>
          </div>
          <div class="operation" v-if="token">
            <button type="button" @click="showReceive()">
              <span>Receive</span>
            </button>
            <button type="button" @click="showTransfer(token, index)">
              <span>Transfer</span>
            </button>
            <router-link
              tag="button"
              :to="`/icsns/neurons?id=${token.tokenId}`"
            >
              <span>Stake</span>
            </router-link>
            <router-link
              tag="button"
              :to="`/icsns/proposals?id=${token.tokenId}`"
            >
              <span>Vote</span>
            </router-link>
            <a
              :href="`https://ic.house/address/${token.tokenId}/${getPrincipalId}`"
              rel="nofollow noreferrer noopener"
              target="_blank"
            >
              <button class="button-history">Transactions</button>
            </a>
          </div>
        </a-skeleton>
      </div>
    </div>
    <receive-modal ref="receiveModal"></receive-modal>
    <transfer-token
      ref="transferToken"
      :current-token="currentToken"
      @transferTokenSuccess="transferTokenSuccess"
    ></transfer-token>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { namespace } from 'vuex-class';
import { connectIcx, initIcx } from '@/ic/connectIcx';
import EventBus from '@/utils/Event';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { DeployedSns } from '@/ic/SNSWasm/model';
import { getTokenBalance } from '@/ic/getTokenBalance';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import { GetMetadataResponse } from '@/ic/SNSGovernance/model';
import { SNSToken } from '@/views/home/ICSNS/model';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { TokenInfo } from '@/ic/common/icType';
import ReceiveModal from '@/components/receiveModal/Index.vue';
import TransferToken from '@/components/transferToken/Index.vue';
import { AddTokenItem, AddTokenItemClass } from '@/views/home/account/model';
import BigNumber from 'bignumber.js';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { SNSSwapService } from '@/ic/SNSSwap/SNSSwapService';
import { checkAuth } from '@/ic/CheckAuth';
const commonModule = namespace('common');
@Component({
  name: 'Tokens',
  components: {
    ReceiveModal,
    TransferToken
  }
})
export default class extends Vue {
  @commonModule.Getter('getIdentity') getIdentity?: Identity;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private SNSWasmService: SNSWasmService = null;
  private SNSTokens: Array<SNSToken> = [];
  private currentIndex: number;
  private currentToken: AddTokenItem = new AddTokenItemClass();
  private isIcx = false;
  private timer = null;
  private tokens: { [key: string]: TokenInfo } = {};
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
  }
  async mounted(): Promise<void> {
    this.SNSWasmService = new SNSWasmService();
    const principal = localStorage.getItem('principal');
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if ((window as any).icx) {
      this.isIcx = !!(window as any).icx;
      EventBus.$on('initSuccess', () => {
        this.init();
      });
      if (principal) {
        await initIcx();
      }
    }
    if (principal) {
      this.init();
    }
  }
  private init(): void {
    this.listDeployedSnses();
  }
  private showReceive(showAccount = false): void {
    (this.$refs.receiveModal as any).init(showAccount);
    (this.$refs.receiveModal as any).principal = this.getPrincipalId;
    (this.$refs.receiveModal as any).visibleReceive = true;
  }
  private showTransfer(token: SNSToken, index: number): void {
    this.currentIndex = index;
    this.currentToken.balance = token.balance;
    this.currentToken.canisterId = Principal.fromText(token.tokenId);
    this.currentToken.name = token.name[0];
    this.currentToken.standard = 'ICRC-1';
    this.currentToken.decimals = token.decimals;
    this.currentToken.symbol = token.symbol;
    (this.$refs as any).transferToken.init(this.currentToken);
  }
  private async transferTokenSuccess(): Promise<void> {
    try {
      this.getICRCBalance(this.currentIndex);
    } catch (e) {}
  }
  private async getICRCBalance(index: number): Promise<void> {
    const res = await getTokenBalance(
      { icrc1: null },
      this.SNSTokens[index].tokenId
    );
    const balance = new BigNumber(res).toString(10);
    this.$set(this.SNSTokens[index], 'balance', balance);
  }
  private async listDeployedSnses(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const listDeployedSnses = await this.SNSWasmService.listDeployedSnses();
      loading.close();
      let canisterIds: Array<string> = [];
      let ICLIndex = null;
      const ICLToken = 'hhaaz-2aaaa-aaaaq-aacla-cai';
      listDeployedSnses.forEach((item, index) => {
        if (item.ledger_canister_id.toString() === ICLToken) {
          ICLIndex = index;
        }
        canisterIds = canisterIds.concat([
          item.swap_canister_id.toString(),
          item.governance_canister_id.toString(),
          item.ledger_canister_id.toString()
        ]);
      });
      if (typeof ICLIndex === 'number') {
        const item = listDeployedSnses[ICLIndex];
        listDeployedSnses.splice(ICLIndex, 1);
        listDeployedSnses.unshift(item);
      }
      canisterIds = [...new Set(canisterIds)];
      await checkAuth();
      const flag = needConnectPlug(canisterIds);
      const principal = localStorage.getItem('principal');
      const priList = JSON.parse(localStorage.getItem('priList')) || {};
      const needConnectInfinity1 = await needConnectInfinity(canisterIds);
      if (
        (priList[principal] === 'Plug' ||
          priList[principal] === 'SignerPlug') &&
        flag &&
        this.$route.name === 'ICSNS-Tokens'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        this.$info({
          content: 'ICSNS token need to be connected to the plug.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          onOk() {
            currentPageConnectPlug(canisterIds).then(async () => {
              _that.initConnected(listDeployedSnses);
            });
          }
        });
      } else if (
        priList[principal] === 'Infinity' &&
        needConnectInfinity1 &&
        this.$route.name === 'ICSNS-Tokens'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this;
        this.$info({
          content: 'ICSNS token need to be connected to the plug.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'Confirm',
          onOk() {
            currentPageConnectInfinity(canisterIds).then(async () => {
              _that.initConnected(listDeployedSnses);
            });
          }
        });
      } else {
        if ((window as any).icx) {
          const icxCanisterIds: Array<string> =
            JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
          const newIcxCanisterIds: Array<string> = [
            ...new Set([...icxCanisterIds, ...canisterIds])
          ];
          localStorage.setItem(
            'icxCanisterIds',
            JSON.stringify(newIcxCanisterIds)
          );
          await connectIcx(newIcxCanisterIds);
        }
        this.initConnected(listDeployedSnses);
      }
    } catch (e) {
      loading.close();
    }
  }
  private async initConnected(
    listDeployedSnses: Array<DeployedSns>
  ): Promise<void> {
    const localReject: Array<string> =
      JSON.parse(localStorage.getItem('rejectSNSTokens')) || [];
    listDeployedSnses = listDeployedSnses.filter((item) => {
      return !localReject.includes(item.ledger_canister_id[0].toString());
    });
    this.SNSTokens = new Array(listDeployedSnses.length).fill(null);
    const MAX_COCURRENCY = 40;
    let promiseAll = [];
    let snsTokens = [];
    const a = new Date().getTime();
    for (let i = 0; i < listDeployedSnses.length; i++) {
      promiseAll.push(this.getSNSTokenInfo(listDeployedSnses[i]));
      if (promiseAll.length === MAX_COCURRENCY) {
        const res = await Promise.all(promiseAll);
        snsTokens = snsTokens.concat(res);
        promiseAll = [];
      }
      if (i === listDeployedSnses.length - 1 && promiseAll.length) {
        const res = await Promise.all(promiseAll);
        snsTokens = snsTokens.concat(res);
        promiseAll = [];
      }
    }
    this.SNSTokens = snsTokens.filter((SNSToken: SNSToken) => {
      if (SNSToken) {
        if (
          (SNSToken.lifecycle &&
            SNSToken.lifecycle.length &&
            Number(SNSToken.lifecycle[0]) === 4) ||
          (SNSToken.lifecycle && SNSToken.lifecycle.length === 0)
        ) {
          if (!localReject.includes(SNSToken.tokenId)) {
            localReject.push(SNSToken.tokenId);
          }
        }
        if (
          SNSToken.lifecycle &&
          SNSToken.lifecycle.length &&
          Number(SNSToken.lifecycle[0]) !== 4
        ) {
          const sns =
            JSON.parse(localStorage.getItem(`${SNSToken.tokenId}-SNS`)) || {};
          localStorage.setItem(
            `${SNSToken.tokenId}-SNS`,
            JSON.stringify(Object.assign({}, sns, SNSToken), (key, value) =>
              typeof value === 'bigint' ? value.toString(10) : value
            )
          );
          return true;
        }
      }
    });
    localStorage.setItem('rejectSNSTokens', JSON.stringify(localReject));
    this.getSNSTokenBalance();
  }
  private async getLifecycle(
    swap: string,
    tokenId: string
  ): Promise<Array<bigint>> {
    const info = JSON.parse(localStorage.getItem(`${tokenId}-SNS`)) || {};
    const completed = [3, 4];
    if (info && info.lifecycle && completed.includes(Number(info.lifecycle))) {
      return info.lifecycle;
    }
    const snsSwapService = new SNSSwapService();
    const res = await snsSwapService.getLifecycle(swap);
    return res.lifecycle;
  }
  private async getSNSTokenBalance(): Promise<void> {
    window.clearInterval(this.timer);
    this.timer = null;
    this.timer = window.setInterval(() => {
      setTimeout(async () => {
        const MAX_COCURRENCY = 40;
        let snsTokensAll = [];
        let snsTokens = [];
        this.SNSTokens.forEach((item, index) => {
          snsTokens.push(item);
          if (snsTokens.length === MAX_COCURRENCY) {
            snsTokensAll.push(snsTokens);
            snsTokens = [];
          }
          if (
            snsTokens.length < MAX_COCURRENCY &&
            index === this.SNSTokens.length - 1
          ) {
            if (snsTokens.length) {
              snsTokensAll.push(snsTokens);
            }
          }
        });
        let index = 0;
        for (let i = 0; i < snsTokensAll.length; i++) {
          const promiseAll = [];
          for (let j = 0; j < snsTokensAll[i].length; j++) {
            promiseAll.push(this.getICRCBalance(index++));
          }
          await Promise.all(promiseAll);
        }
      });
    }, 5000);
  }
  private async getSNSTokenInfo(deployedSns: DeployedSns): Promise<SNSToken> {
    try {
      const promiseAll = [];
      const ledgerCanisterId = deployedSns.ledger_canister_id[0];
      const governanceCanisterId = deployedSns.governance_canister_id[0];
      const swapCanisterId = deployedSns.swap_canister_id[0];
      promiseAll.push(
        this.getSNSTokenGovernanceInfo(
          governanceCanisterId.toString(),
          ledgerCanisterId.toString()
        ),
        this.getCurrentTokenInfo(ledgerCanisterId),
        this.getLifecycle(
          swapCanisterId.toString(),
          ledgerCanisterId.toString()
        )
      );
      const info = JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
      if (
        !(
          info &&
          info.tokensBalance &&
          info.tokensBalance[ledgerCanisterId.toString()]
        )
      ) {
        promiseAll.unshift(
          getTokenBalance({ icrc1: null }, ledgerCanisterId.toString())
        );
      }
      const res = await Promise.all(promiseAll);
      if (
        info &&
        info.tokensBalance &&
        info.tokensBalance[ledgerCanisterId.toString()]
      ) {
        res.unshift(info.tokensBalance[ledgerCanisterId.toString()]);
      }
      return {
        tokenId: ledgerCanisterId.toString(),
        balance: res[0],
        lifecycle: res[3],
        ...res[2],
        ...res[1]
      };
    } catch (e) {
    }
  }
  private async getCurrentTokenInfo(tokenId: Principal): Promise<TokenInfo> {
    if (!this.tokens[tokenId.toString()]) {
      return await getTokenInfo(tokenId, { icrc1: null });
    } else {
      return this.tokens[tokenId.toString()];
    }
  }
  private async getSNSTokenGovernanceInfo(
    governance: string,
    tokenId: string
  ): Promise<GetMetadataResponse> {
    const info = JSON.parse(localStorage.getItem(`${tokenId}-SNS`)) || {};
    if (info && info.name && info.name instanceof Array && info.name[0]) {
      return {
        url: info.url,
        logo: info.logo,
        name: info.name,
        description: info.description
      };
    }
    const snsGovernanceService = new SNSGovernanceService();
    return await snsGovernanceService.getMetadata(governance);
  }
  private async connectWallet(): Promise<void> {
    if ((window as any).icx) {
      const icxCanisterIds: Array<string> =
        JSON.parse(localStorage.getItem('icxCanisterIds')) || [];
      const isConnect = await connectIcx(icxCanisterIds);
      if (isConnect) {
        this.init();
      }
    } else {
      await this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    }
  }
}
</script>
<style scoped lang="scss">
.sns-token-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
}
.sns-token-list-item {
  width: 490px;
  height: 200px;
  padding: 16px;
  margin-bottom: 15px;
  background: #131920;
  border: 1px solid #212b35;
  border-radius: 10px;
  .operation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #212b35;
    button {
      width: 85px;
    }
  }
  .sns-token-list-item-balance {
    margin-top: 30px;
  }
  .token-balance {
    font-size: 28px;
    color: #fff;
    padding-right: 5px;
  }
  .token-symbol {
    color: #adb8c4;
  }
  .sns-token-list-item-info {
    display: flex;
    align-items: center;
  }
  .sns-token-list-item-info-symbol {
    color: #fff;
    font-weight: bold;
    padding: 0 10px 0 5px;
  }
  .sns-token-list-item-info-name {
    margin-left: auto;
    color: #8c98a5;
    padding-right: 5px;
  }
  a {
    color: #2b8cb0;
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    object-fit: contain;
  }
}
.wallet-header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  .base-font-title-io {
    color: #52b7c3;
  }
  .wallet-info {
    display: flex;
    align-items: center;
    margin-right: 25px;
    > div {
      display: flex;
      align-items: center;
    }
  }
  .wallet-info-type {
    margin-right: 50px;
    color: #636c73;
    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
      margin: 5px;
    }
  }
  .wallet-item-account {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    height: 40px;
  }
  .wallet-item-account-item {
    display: flex;
    align-items: center;
    height: 20px;
  }
}
.account-identicon-img {
  width: 40px;
  height: 40px;
  margin-left: 5px;
  border-radius: 20px;
  opacity: 0.8;
}
@media screen and (max-width: 768px) {
  .tokens-main {
    padding: 0 10px 20px 10px;
  }
  .sns-token-list-item {
    width: 100%;
  }
  .wallet-header {
    flex-direction: column;
    align-items: flex-start;
    .wallet-info {
      flex-direction: column;
      align-items: flex-start;
      margin-left: 0;
      margin-top: 10px;
    }
  }
  .sns-token-list-item {
    height: auto;
    min-height: 200px;
    .operation {
      justify-content: flex-start;
      flex-wrap: wrap;
      button {
        margin: 10px;
      }
    }
  }
}
</style>
