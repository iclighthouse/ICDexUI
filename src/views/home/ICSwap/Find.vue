<template>
  <div class="find-main">
    <div class="ic-swap-main add-liquidity-header">
      <a-icon class="back-icon" type="arrow-left" @click="back" />
      <span class="base-font-title">Import Liquidity</span>
    </div>
    <div class="add-liquidity-main ic-swap-main">
      <div class="exchange-swap-item import-liquidity-item">
        Tip: Use this tool to find liquidity that don't automatically appear in
        the interface.
      </div>
      <div class="add-liquidity-item exchange-swap-item">
        <div class="add-liquidity-item-top swap-item-top">
          <div class="swap-item-item-add" @click="showTokenList('from')">
            <div class="swap-item-top-left" v-if="tokenSwapFrom">
              <span class="img-content">
                <img
                  v-if="
                    tokens &&
                    tokens[tokenSwapFrom[0].toString()] &&
                    tokens[tokenSwapFrom[0].toString()].logo
                  "
                  :src="tokens[tokenSwapFrom[0].toString()].logo"
                  alt=""
                />
                <span v-else class="empty-pic"></span>
              </span>
              <span class="swap-item-top-left-name">{{ tokenSwapFrom[1] }}</span
              ><a-icon type="down" />
            </div>
          </div>
        </div>
      </div>
      <div class="exchange-swap-icon">
        <a-icon class="swap-icon" type="plus" />
      </div>
      <div class="add-liquidity-item exchange-swap-item">
        <div class="add-liquidity-item-top swap-item-top">
          <div class="swap-item-item-add" @click="showTokenList('to')">
            <div class="swap-item-top-left" v-if="tokenSwapTo">
              <span class="img-content">
                <img
                  v-if="
                    tokens &&
                    tokens[tokenSwapTo[0].toString()] &&
                    tokens[tokenSwapTo[0].toString()].logo
                  "
                  :src="tokens[tokenSwapTo[0].toString()].logo"
                  alt=""
                />
                <span v-else class="empty-pic"></span>
              </span>
              <span class="swap-item-top-left-name">{{ tokenSwapTo[1] }}</span
              ><a-icon type="down" />
            </div>
            <div class="swap-item-top-left" v-else>
              <span class="swap-item-top-left-name">Select a token</span
              ><a-icon type="down" />
            </div>
          </div>
        </div>
      </div>
      <div class="swap-button w100">
        <button
          class="primary large-primary w100"
          :disabled="buttonDisabled"
          @click="importPool"
        >
          <a-spin v-if="routerLoading" />
          <span v-else>{{ buttonName }}</span>
          <router-link
            v-if="!routerLoading && userLiquidity && !userLiquidity.shares"
            :to="`/ICSwap/addLiquidity/${icpOrCyclesToSwapTokenId(
              tokenSwapFrom[0].toString()
            )}/${icpOrCyclesToSwapTokenId(tokenSwapTo[0].toString())}`"
            >Add Liquidity</router-link
          >
          <router-link
            v-if="!routerLoading && hasImport"
            :to="`/ICSwap/liquidity/${icpOrCyclesToSwapTokenId(
              tokenSwapFrom[0].toString()
            )}/${icpOrCyclesToSwapTokenId(tokenSwapTo[0].toString())}`"
            >Add Liquidity</router-link
          >
        </button>
      </div>
    </div>
    <a-modal
      v-model="visible"
      centered
      class="select-token"
      width="550px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <div class="select-token-main">
        <div class="select-token-title">Select a token</div>
        <div class="select-token-input">
          <a-input-search
            v-model="searchToken"
            placeholder="Search by name or canister id"
            @input="searchTokenChange"
          ></a-input-search>
        </div>
        <div class="select-token-main-container">
          <div
            class="select-token-main-table"
            v-if="currentTokens && currentTokens.length"
          >
            <ul>
              <li
                @click="onselect(token)"
                :class="{
                  disabled:
                    (selectTokenType === 'from' &&
                      tokenSwapTo &&
                      token[0].toString() === tokenSwapTo[0].toString()) ||
                    (selectTokenType === 'to' &&
                      tokenSwapFrom &&
                      token[0].toString() === tokenSwapFrom[0].toString()),
                  active:
                    (tokenSwapFrom &&
                      selectTokenType === 'from' &&
                      token[0].toString() === tokenSwapFrom[0].toString()) ||
                    (tokenSwapTo &&
                      selectTokenType === 'to' &&
                      token[0].toString() === tokenSwapTo[0].toString())
                }"
                v-for="(token, index) in currentTokens"
                :key="index"
              >
                <div class="img-content">
                  <img
                    v-if="token[3] && token[3].logo"
                    :src="token[3].logo"
                    alt=""
                  />
                  <span v-else class="empty-pic"></span>
                </div>
                <dl>
                  <dt>
                    <span>{{ token[1] }}</span>
                  </dt>
                  <dd>
                    <span>{{ token[3].name }}</span>
                  </dd>
                </dl>
                <div>
                  <span
                    v-show="
                      token[0].toString() !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
                      token[0].toString() !== 'ryjl3-tyaaa-aaaaa-aaaba-cai'
                    "
                    >{{ token[0].toString() | ellipsisAccount }}</span
                  >
                </div>
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <span>{{
                      tokensBalance[token[0].toString()]
                        | bigintToFloat(token[3].decimals, token[3].decimals)
                    }}</span>
                  </template>
                  <span class="select-token-balance">{{
                    tokensBalance[token[0].toString()]
                      | bigintToFloat(4, token[3].decimals)
                  }}</span>
                </a-tooltip>
              </li>
            </ul>
          </div>
          <div
            class="no-found"
            v-show="!tokenListLoading && currentTokens && !currentTokens.length"
          >
            No results found.
          </div>
        </div>
        <a-spin :spinning="tokenListLoading" class="token-list-loading">
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { TokenInfo } from '@/ic/common/icType';
import {
  LocalPool,
  Pool,
  SelectTokenType,
  SwapTokenInfo
} from '@/views/home/ICSwap/model';
import { PairsMixin } from '@/mixins';
import { Liquidity } from '@/ic/cyclesFinance/model';
import { TokenLiquidity } from '@/ic/ICSwap/model';
import { icpOrCyclesToSwapTokenId, toLocalPool } from '@/ic/icSwapUtils';

@Component({
  name: 'Find',
  components: {}
})
export default class extends Mixins(PairsMixin) {
  @Prop({ type: Object, default: () => null })
  tokens!: { [key: string]: TokenInfo };
  @Prop({ type: Object, default: () => null })
  tokensBalance!: { [key: string]: string };
  @Prop({ type: Array, default: () => [] })
  tokenList!: Array<SwapTokenInfo>;
  private visible = false;
  private buttonName = 'Import Liquidity';
  private userLiquidity: Liquidity | TokenLiquidity = null;
  private hasImport = false;
  get buttonDisabled(): boolean {
    let flag = false;
    if (!this.tokenSwapFrom || !this.tokenSwapTo) {
      this.buttonName = 'Select a token to find your liquidity';
      flag = true;
    } else {
      if (this.routerLoading) {
        flag = true;
        return flag;
      }
      if (!this.swapId) {
        this.buttonName = 'No pool found';
        flag = true;
        return flag;
      }
      if (this.hasImport) {
        this.buttonName = 'You have import this liquidity';
        flag = true;
        return flag;
      }
      if (
        !this.userLiquidity ||
        (this.userLiquidity && !this.userLiquidity.shares)
      ) {
        this.buttonName = 'You don’t have liquidity in this pool yet';
        flag = true;
        return flag;
      }
      if (this.swapId && this.userLiquidity && this.userLiquidity.shares) {
        this.buttonName = 'Import Liquidity';
        flag = false;
      }
    }
    return flag;
  }
  created(): void {
    if (!this.currentTokens.length) {
      this.tokenListLoading = true;
    }
  }
  private back(): void {
    this.$router.push('/ICSwap/liquidity/icp/cycles');
  }
  private async importPool(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const promiseAllValue = [];
      promiseAllValue.push(
        this.getLiquidity(this.swapId),
        this.getSwapDecimals(this.swapId)
      );
      const res = await Promise.all(promiseAllValue);
      const principal = localStorage.getItem('principal');
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      let localPools: Array<LocalPool> = currentInfo.pools || [];
      const pool: Pool = [
        ...this.currentRoute[0],
        res[0],
        this.userLiquidity,
        res[1]
      ];
      localPools.push(toLocalPool(pool));
      currentInfo.pools = localPools;
      localStorage.setItem(
        principal,
        JSON.stringify(currentInfo, (key, value) =>
          typeof value === 'bigint' ? value.toString(10) : value
        )
      );
      this.$message.success('Import liquidity Success');
      this.checkLiquidity();
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private showTokenList(type: SelectTokenType): void {
    this.selectTokenType = type;
    this.visible = true;
    this.searchToken = '';
    this.searchTokens = [];
    if (this.selectTokenType === 'to') {
      this.tokenListLoading = true;
      this.getPairsByToken(this.tokenSwapFrom[0], false);
    }
  }
  private icpOrCyclesToSwapTokenId(tokenId: string): string {
    return icpOrCyclesToSwapTokenId(tokenId);
  }
  private async onselect(token: SwapTokenInfo): Promise<void> {
    this.visible = false;
    if (this.selectTokenType === 'from') {
      if (
        !this.tokenSwapFrom ||
        this.tokenSwapFrom[0].toString() !== token[0].toString()
      ) {
        this.hasImport = false;
        this.userLiquidity = null;
        this.swapId = null;
        this.tokenSwapFrom = token;
        this.tokenSwapTo = null;
      }
    } else {
      if (
        !this.tokenSwapTo ||
        this.tokenSwapTo[0].toString() !== token[0].toString()
      ) {
        this.hasImport = false;
        this.userLiquidity = null;
        this.swapId = null;
        this.tokenSwapTo = token;
        this.init();
        this.checkLiquidity();
      }
    }
  }
  private async checkLiquidity(): Promise<void> {
    if (this.tokenSwapFrom && this.tokenSwapTo) {
      this.routerLoading = true;
      try {
        const res = await this.ICSwapRouterService.route(
          this.tokenSwapFrom[0],
          this.tokenSwapTo[0]
        );
        this.currentRoute = res;
        if (res && res.length) {
          this.swapId = res[0][0].toString();
          const principal = localStorage.getItem('principal');
          const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
          const localPools: Array<LocalPool> = currentInfo.pools || [];
          this.hasImport = localPools.some((pool) => {
            return pool[0].toString() === this.currentRoute[0][0].toString();
          });
          if (!this.hasImport) {
            const promiseAllValue = [];
            promiseAllValue.push(
              this.getDexInfo(this.swapId),
              this.getLiquidity(this.swapId, principal)
            );
            const value = await Promise.all(promiseAllValue);
            console.log(value);
            this.userLiquidity = value[1];
          }
        }
      } catch (e) {
        console.log(e);
      }
      this.routerLoading = false;
    }
  }
}
</script>

<style scoped lang="scss">
.back-icon {
  position: absolute;
  left: 50px;
  cursor: pointer;
  font-size: 20px;
}
.add-liquidity-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  font-size: 18px;
  background: #13181d;
  border: 1px solid #313b46;
  padding: 10px 0;
  border-radius: 9px;
}
.add-liquidity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 36px;
  .swap-icon {
    font-size: 20px;
  }
}
.swap-item-item-add {
  width: 100%;
  .swap-item-top-left {
    display: flex;
    align-items: center;
    width: 100%;
    height: 46px;
    padding: 10px 24px;
    i {
      margin-left: auto;
    }
  }
}
.import-liquidity-item {
  padding: 10px !important;
  margin-bottom: 10px;
  color: #777d90;
  box-shadow: none;
  border: none;
}
.swap-button {
  button {
    display: flex;
    flex-direction: column;
    height: auto !important;
    min-height: 48px;
    line-height: 1.4;
    padding: 10px;
    a {
      color: #1996c4;
    }
  }
}
.add-liquidity-item {
  padding: 40px 35px;
}
@media screen and (max-width: 768px) {
  .find-main {
    padding: 0 15px 20px;
  }
}
</style>
