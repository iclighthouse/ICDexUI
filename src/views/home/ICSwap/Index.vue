<template>
  <div>
    <div class="home-header">
      <div class="home-header-left">
        <img
          class="home-header-logo"
          src="@/assets/img/icswap-1.png"
          alt="logo"
        />
      </div>
      <ul>
        <li
          v-for="(menu, index) in swapMenu"
          :key="index"
          :class="{ active: swapType === menu }"
          @click="change(menu)"
        >
          {{ menu }}
        </li>
      </ul>
      <account-info :menu-list="menuList"></account-info>
    </div>
    <!-- <div
      class="exchange-menu"
      :class="{
        'exchange-menu-liquidity':
          $route.fullPath.startsWith('/ICSwap/liquidity')
      }"
    >
      <button
        v-for="(menu, index) in swapMenu"
        :key="index"
        :class="{ active: swapType === menu }"
        @click="change(menu)"
      >
        {{ menu }}
      </button>
    </div>-->
    <router-view
      class="ic-swap-container"
      :tokens="tokens"
      :tokenList="swapTokens"
      :tokensBalance="tokensBalance"
      @tokensBalanceChange="tokensBalanceChange"
      @tokenChange="tokenChange"
    />
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { SwapMenu, SwapTokenInfo, SwapType } from '@/views/home/ICSwap/model';
import { TokenId, TokenInfo, TokenStd } from '@/ic/common/icType';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { BalanceMixin } from '@/mixins';
import { swapTokenIdToIcpOrCycles } from '@/ic/icSwapUtils';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import { CYCLES_FINANCE_CANISTER_ID, LEDGER_CANISTER_ID } from '@/ic/utils';
import { TrieList } from '@/ic/ICSwapRouter/model';
import { isPlug } from '@/ic/isPlug';
import { getTokenBalance } from '@/ic/getTokenBalance';
import { isInfinity } from '@/ic/isInfinity';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';
import { checkAuth } from '@/ic/CheckAuth';
@Component({
  name: 'Index',
  components: {
    AccountInfo
  }
})
export default class extends Mixins(BalanceMixin) {
  @Watch('$route')
  private onRouteChange() {
    const tokenFromId = swapTokenIdToIcpOrCycles(
      this.$route.params.tokenFromId
    );
    const tokenToId = swapTokenIdToIcpOrCycles(this.$route.params.tokenToId);
    if (tokenFromId && tokenToId) {
      this.menuList = [
        {
          path: `/ICSwap/swap/${tokenFromId}/${tokenToId}`,
          value: 'Swap'
        },
        {
          path: `/ICSwap/liquidity/${tokenFromId}/${tokenToId}`,
          value: 'Liquidity'
        }
      ];
    } else {
      this.menuList = [
        {
          path: '/ICSwap/swap',
          value: 'Swap'
        },
        {
          path: '/ICSwap/liquidity/icp/cycles',
          value: 'Liquidity'
        }
      ];
    }
  }
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  private tokensBalance: { [key: string]: string } = {};
  private swapMenu = SwapMenu;
  private menuList = [
    {
      path: '/ICSwap/swap',
      value: 'Swap'
    },
    {
      path: '/ICSwap/liquidity/icp/cycles',
      value: 'Liquidity'
    }
  ];
  private swapType: SwapType = SwapMenu.Swap;
  private swapTokens: Array<SwapTokenInfo> = [];
  private tokens: { [key: string]: TokenInfo } = {};
  created(): void {
    if (this.$route.fullPath.startsWith('/ICSwap/swap')) {
      this.swapType = SwapMenu.Swap;
    } else if (this.$route.fullPath.startsWith('/ICSwap/liquidity')) {
      this.swapType = SwapMenu.Liquidity;
    } else {
      // this.swapType = SwapMenu.Wrap;
    }
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    this.tokensBalance = currentInfo.tokensBalance || {};
    this.getTokens();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
  }
  private tokensBalanceChange(tokensBalance): void {
    this.tokensBalance = tokensBalance;
  }
  private async getTokensBalance(): Promise<void> {
    if (this.swapTokens && this.swapTokens.length) {
      const promiseAllValue = [];
      for (const token of this.swapTokens) {
        promiseAllValue.push(
          this.getTokenBalance(token[2], token[0].toString())
        );
      }
      await Promise.all(promiseAllValue);
      // const principal = localStorage.getItem('principal');
      // if (principal) {
      //   const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      //   currentInfo.tokensBalance = this.tokensBalance;
      //   localStorage.setItem(principal, JSON.stringify(currentInfo));
      // }
    }
  }
  public async getTokenBalance(
    tokenStd: TokenStd,
    tokenId: string
  ): Promise<void> {
    const balance = await getTokenBalance(tokenStd, tokenId);
    if (balance) {
      this.$set(this.tokensBalance, tokenId, balance);
    }
  }
  private async getDexPairs(page = 1, size = 100): Promise<TrieList> {
    try {
      return await this.ICSwapRouterFiduciaryService.getPairs(
        ['icswap'],
        [page],
        [size]
      );
    } catch (e) {
    }
  }
  private async getTokens(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const res = await this.ICSwapRouterFiduciaryService.getTokens();
      loading.close();
      const tokenFromId = this.$route.params.tokenFromId;
      if (!tokenFromId) {
        loading.close();
      }
      let pairs: TrieList;
      if (isPlug() || isInfinity()) {
        pairs = await this.getDexPairs();
      }
      if (res && res.length) {
        let canisterIds: Array<string> = [];
        res.forEach((item) => {
          canisterIds.push(item[0].toString());
        });
        if (pairs && pairs.data && pairs.data.length) {
          pairs.data.forEach((item) => {
            canisterIds.push(item[0].toString());
          });
        }
        canisterIds = [...new Set(canisterIds)];
        await checkAuth();
        const flag = needConnectPlug(canisterIds);
        const principal = localStorage.getItem('principal');
        const priList = JSON.parse(localStorage.getItem('priList')) || {};
        const connectInfinity = await needConnectInfinity(canisterIds);
        if (
          (priList[principal] === 'Plug' ||
            priList[principal] === 'SignerPlug') &&
          flag &&
          this.$route.name === 'ICSwap'
        ) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const _that = this;
          // const h = this.$createElement;
          this.$info({
            content: 'ICSwap need to be connected to the plug.',
            class: 'connect-plug',
            icon: 'connect-plug',
            okText: 'Confirm',
            onOk() {
              currentPageConnectPlug(canisterIds).then(async () => {
                const promiseAllValue = [];
                for (let i = 0; i < res.length; i++) {
                  const tokenStd = res[i][2];
                  const tokenId = res[i][0];
                  if (_that.tokens[tokenId.toString()]) {
                    if (res[i][0].toString() === LEDGER_CANISTER_ID) {
                      _that.swapTokens.unshift([
                        ...res[i],
                        _that.tokens[tokenId.toString()]
                      ]);
                    } else {
                      _that.swapTokens.push([
                        res[i][0],
                        _that.tokens[tokenId.toString()].symbol,
                        res[i][2],
                        _that.tokens[tokenId.toString()]
                      ]);
                    }
                  }
                  if (
                    !_that.tokens[tokenId.toString()] ||
                    (_that.tokens[tokenId.toString()] &&
                      !_that.tokens[tokenId.toString()].logo)
                  ) {
                    promiseAllValue.push(_that.setTokenInfo(tokenId, tokenStd));
                  }
                }
                await Promise.all(promiseAllValue);
                res.forEach((token) => {
                  const tokenStd = token[2];
                  const tokenId = token[0];
                  if (token[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
                    token[1] = 'TCycles';
                  }
                  try {
                    let currentIndex = 0;
                    const hasToken = _that.swapTokens.some((token, index) => {
                      if (tokenId.toString() === token[0].toString()) {
                        currentIndex = index;
                        return true;
                      }
                    });
                    if (hasToken) {
                      _that.$set(_that.swapTokens, currentIndex, [
                        ...token,
                        _that.tokens[tokenId.toString()]
                      ]);
                    } else {
                      if ((tokenStd as { icp: null }).icp === null) {
                        _that.swapTokens.unshift([
                          ...token,
                          _that.tokens[tokenId.toString()]
                        ]);
                      } else {
                        _that.swapTokens.push([
                          token[0],
                          _that.tokens[tokenId.toString()].symbol,
                          token[2],
                          _that.tokens[tokenId.toString()]
                        ]);
                      }
                    }
                  } catch (e) {
                  }
                });
                _that.getTokensBalance();
              });
            }
          });
        } else if (
          priList[principal] === 'Infinity' &&
          connectInfinity &&
          this.$route.name === 'ICSwap'
        ) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const _that = this;
          // const h = this.$createElement;
          this.$info({
            content: 'ICSwap need to be connected to the Infinity.',
            class: 'connect-plug',
            icon: 'connect-plug',
            okText: 'Confirm',
            onOk() {
              currentPageConnectInfinity(canisterIds).then(async () => {
                const promiseAllValue = [];
                for (let i = 0; i < res.length; i++) {
                  const tokenStd = res[i][2];
                  const tokenId = res[i][0];
                  if (_that.tokens[tokenId.toString()]) {
                    if (res[i][0].toString() === LEDGER_CANISTER_ID) {
                      _that.swapTokens.unshift([
                        ...res[i],
                        _that.tokens[tokenId.toString()]
                      ]);
                    } else {
                      _that.swapTokens.push([
                        res[i][0],
                        _that.tokens[tokenId.toString()].symbol,
                        res[i][2],
                        _that.tokens[tokenId.toString()]
                      ]);
                    }
                  }
                  if (
                    !_that.tokens[tokenId.toString()] ||
                    (_that.tokens[tokenId.toString()] &&
                      !_that.tokens[tokenId.toString()].logo)
                  ) {
                    promiseAllValue.push(_that.setTokenInfo(tokenId, tokenStd));
                  }
                }
                await Promise.all(promiseAllValue);
                res.forEach((token) => {
                  const tokenStd = token[2];
                  const tokenId = token[0];
                  if (token[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
                    token[1] = 'TCycles';
                  }
                  try {
                    let currentIndex = 0;
                    const hasToken = _that.swapTokens.some((token, index) => {
                      if (tokenId.toString() === token[0].toString()) {
                        currentIndex = index;
                        return true;
                      }
                    });
                    if (hasToken) {
                      _that.$set(_that.swapTokens, currentIndex, [
                        ...token,
                        _that.tokens[tokenId.toString()]
                      ]);
                    } else {
                      if ((tokenStd as { icp: null }).icp === null) {
                        _that.swapTokens.unshift([
                          ...token,
                          _that.tokens[tokenId.toString()]
                        ]);
                      } else {
                        _that.swapTokens.push([
                          token[0],
                          _that.tokens[tokenId.toString()].symbol,
                          token[2],
                          _that.tokens[tokenId.toString()]
                        ]);
                      }
                    }
                  } catch (e) {
                  }
                });
                _that.getTokensBalance();
              });
            }
          });
        } else {
          const promiseAllValue = [];
          for (let i = 0; i < res.length; i++) {
            const tokenStd = res[i][2];
            const tokenId = res[i][0];
            if (this.tokens[tokenId.toString()]) {
              if (res[i][0].toString() === LEDGER_CANISTER_ID) {
                this.swapTokens.unshift([
                  ...res[i],
                  this.tokens[tokenId.toString()]
                ]);
              } else {
                this.swapTokens.push([
                  res[i][0],
                  this.tokens[tokenId.toString()].symbol,
                  res[i][2],
                  this.tokens[tokenId.toString()]
                ]);
              }
            }
            if (
              !this.tokens[tokenId.toString()] ||
              (this.tokens[tokenId.toString()] &&
                !this.tokens[tokenId.toString()].logo)
            ) {
              promiseAllValue.push(this.setTokenInfo(tokenId, tokenStd));
            }
          }
          await Promise.all(promiseAllValue);
          res.forEach((token) => {
            const tokenStd = token[2];
            const tokenId = token[0];
            if (token[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
              token[1] = 'TCycles';
            }
            try {
              let currentIndex = 0;
              const hasToken = this.swapTokens.some((token, index) => {
                if (tokenId.toString() === token[0].toString()) {
                  currentIndex = index;
                  return true;
                }
              });
              if (hasToken) {
                this.$set(this.swapTokens, currentIndex, [
                  ...token,
                  this.tokens[tokenId.toString()]
                ]);
              } else {
                if ((tokenStd as { icp: null }).icp === null) {
                  this.swapTokens.unshift([
                    ...token,
                    this.tokens[tokenId.toString()]
                  ]);
                } else {
                  this.swapTokens.push([
                    token[0],
                    this.tokens[tokenId.toString()].symbol,
                    token[2],
                    this.tokens[tokenId.toString()]
                  ]);
                }
              }
            } catch (e) {
            }
          });
          this.getTokensBalance();
        }
        // this.getTokensBalanceInterval();
      }
    } catch (e) {
    }
  }
  private tokenChange(tokenId: string): void {
    this.setTokenInfo(Principal.fromText(tokenId));
  }
  private async setTokenInfo(
    tokenId: TokenId,
    tokenStd?: TokenStd
  ): Promise<void> {
    const tokenInfo = await getTokenInfo(tokenId, tokenStd);
    this.$set(this.tokens, tokenId.toString(), tokenInfo);
  }
  private async change(type: SwapType): Promise<void> {
    this.swapType = type;
    if (type === SwapMenu.Swap) {
      const tokenFromId = swapTokenIdToIcpOrCycles(
        this.$route.params.tokenFromId
      );
      const tokenToId = swapTokenIdToIcpOrCycles(this.$route.params.tokenToId);
      if (tokenFromId && tokenToId) {
        await this.$router.push(`/ICSwap/swap/${tokenFromId}/${tokenToId}`);
      } else {
        await this.$router.push(`/ICSwap/swap`);
      }
    } else if (type === SwapMenu.Liquidity) {
      const tokenFromId = swapTokenIdToIcpOrCycles(
        this.$route.params.tokenFromId
      );
      const tokenToId = swapTokenIdToIcpOrCycles(this.$route.params.tokenToId);
      if (tokenFromId && tokenToId) {
        await this.$router.push(
          `/ICSwap/liquidity/${tokenFromId}/${tokenToId}`
        );
      } else {
        await this.$router.push(`/ICSwap/liquidity/icp/cycles`);
      }
    }
    // else if (type === SwapMenu.Wrap) {
    //   await this.$router.push('/ICSwap/wrap');
    // }
  }
}
</script>
<style scoped lang="scss">
.ic-swap-container {
  margin-top: 80px;
}
.home-header {
  margin-top: 14px;
  img {
    height: 64px;
  }
}
.exchange-menu-liquidity {
  position: relative;
  top: 140px;
}
@media screen and (max-width: 768px) {
  .home-header {
    ul {
      display: none;
    }
  }
}
</style>
