<template>
  <div class="ic-tokens">
    <a-spin :spinning="spinning">
      <div class="ic-token-list-wrap">
        <table>
          <thead>
            <tr>
              <th class="name">Token</th>
              <th class="token-id">Token ID</th>
              <th class="token-id">Controllers</th>
              <th>Supply</th>
              <th>Cycles</th>
              <th class="gas">Fee</th>
              <th class="metadata">Metadata</th>
              <th class="score">Score</th>
              <th class="star">Star</th>
              <!--<th></th>-->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(token, index) in tokenList" :key="index">
              <td class="name">
                <div>
                  <div class="token-logo">
                    <img v-if="token[8]" :src="token[8]" alt="" />
                  </div>
                  <dl>
                    <dt>{{ token[1].symbol }}</dt>
                    <dd>{{ token[1].name }}</dd>
                  </dl>
                </div>
              </td>
              <td class="token-id">
                <a
                  :href="`https://ic.house/token/${token[0].toString()}`"
                  target="_blank"
                  class="token-id-rocks"
                  rel="nofollow noreferrer noopener"
                  ><copy-account
                    :account="token[0].toString()"
                    copyText="Token ID"
                  ></copy-account
                ></a>
              </td>
              <td>
                <div style="font-size: 12px; line-height: 1.5" v-if="token[10]">
                  <div v-for="(item, index) in token[10]" :key="index">
                    <span
                      v-if="filterToken(item, token[0].toString())"
                      style="color: #646e79"
                      >{{ filterToken(item, token[0].toString()) }}:</span
                    ><copy-account
                      :front="item.length > 27 ? 20 : 27"
                      :account="item"
                      :showCopy="false"
                      copyText="Token ID"
                    ></copy-account>
                  </div>
                </div>
              </td>
              <!--<td class="token-id" style="line-height: 1.2">
                <div v-if="token[10] && token[10].length">
                  <div v-for="item in token[10]" :key="item">
                    <a
                      :href="
                        item === '7hdtw-jqaaa-aaaak-aaccq-cai' ||
                        item === 'igm6s-dqaaa-aaaar-qaa3a-cai' ||
                        item === token[0].toString()
                          ? `https://ic.house/canister/${item}`
                          : `https://ic.house/icp/address/${item}`
                      "
                      target="_blank"
                      class="token-id-rocks"
                      rel="nofollow noreferrer noopener"
                      :class="{
                        'controller-red':
                          item !== '7hdtw-jqaaa-aaaak-aaccq-cai' &&
                          item !== 'igm6s-dqaaa-aaaar-qaa3a-cai' &&
                          item !== token[0].toString() &&
                          item !== getPrincipalId
                      }"
                      ><copy-account
                        :account="item"
                        copyText="Controller"
                      ></copy-account
                    ></a>
                    &lt;!&ndash; <span v-if="item === '7hdtw-jqaaa-aaaak-aaccq-cai'">
                      (Blackhole)
                    </span>
                    <span v-if="item === token[0].toString()"> (Token) </span>
                    <span v-if="item === 'igm6s-dqaaa-aaaar-qaa3a-cai'">
                      (Factory)
                    </span>
                    <span v-if="item === getPrincipalId"> (Your)</span>&ndash;&gt;
                  </div>
                </div>
              </td>-->
              <td class="total-supply">
                <div>
                  Total:
                  {{
                    token[5]
                      | bigintToFloat(
                        Number(token[1].decimals),
                        Number(token[1].decimals)
                      )
                      | formatNum
                  }}
                </div>
                <div>
                  Max:
                  {{
                    token[9]
                      | bigintToFloat(
                        Number(token[1].decimals),
                        Number(token[1].decimals)
                      )
                      | formatNum
                  }}
                </div>
              </td>
              <td style="font-size: 12px; white-space: nowrap">
                <div v-if="token[11]">
                  {{ token[11] | bigintToFloat }} TCycles
                </div>
                <div v-else>-</div>
              </td>
              <td class="gas">{{ token[6] | filterGas(token) }}</td>
              <td class="metadata">
                <div
                  class="metadata-item"
                  v-for="(metadata, index) in token[7]"
                  :key="index"
                >
                  <div
                    class="metadata-item-info"
                    v-if="metadata.name !== 'logo'"
                  >
                    <span v-show="!metadata.content">
                      <a-icon v-if="metadata.name === 'webUrl'" type="global" />
                      <a-icon
                        v-if="metadata.name === 'twitter'"
                        type="twitter"
                      />
                      <svg
                        style="margin-bottom: -1px"
                        v-if="metadata.name === 'medium'"
                        t="1641868703609"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="3423"
                        width="14"
                        height="14"
                        fill="currentColor"
                      >
                        <path
                          d="M544 512c0 149.98-114.84 272-256 272S32 661.98 32 512s114.84-272 256-272 256 122.02 256 272z m416-256a32 32 0 0 0-32 32v448a32 32 0 0 0 64 0V288a32 32 0 0 0-32-32z m-224 0c-22.732 0-65.6 11.04-97.296 85.004C618.904 387.204 608 447.932 608 512s10.904 124.8 30.704 170.996C670.404 756.956 713.268 768 736 768s65.6-11.04 97.296-85.004C853.096 636.796 864 576.068 864 512s-10.904-124.8-30.704-170.996C801.596 267.044 758.732 256 736 256z"
                          p-id="3424"
                        ></path>
                      </svg>
                      <svg
                        style="margin-bottom: -1px"
                        v-if="metadata.name === 'forum'"
                        t="1641868970469"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="4309"
                        width="14"
                        height="14"
                        fill="currentColor"
                      >
                        <path
                          d="M896 256l-85.333333 0 0 384L256 640l0 85.333333c0 25.6 17.066667 42.666667 42.666667 42.666667l469.333333 0 170.666667 170.666667L938.666667 298.666667C938.666667 273.066667 921.6 256 896 256zM725.333333 512 725.333333 128c0-25.6-17.066667-42.666667-42.666667-42.666667L128 85.333333C102.4 85.333333 85.333333 102.4 85.333333 128l0 597.333333 170.666667-170.666667 426.666667 0C708.266667 554.666667 725.333333 537.6 725.333333 512z"
                          p-id="4310"
                        ></path>
                      </svg>
                    </span>
                    <a
                      v-show="metadata.content"
                      :href="metadata.content"
                      target="_blank"
                      rel="nofollow noreferrer noopener"
                    >
                      <a-icon v-if="metadata.name === 'webUrl'" type="global" />
                      <a-icon
                        v-if="metadata.name === 'twitter'"
                        type="twitter"
                      />
                      <svg
                        v-if="metadata.name === 'medium'"
                        t="1641868703609"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="3423"
                        width="14"
                        height="14"
                        fill="currentColor"
                      >
                        <path
                          d="M544 512c0 149.98-114.84 272-256 272S32 661.98 32 512s114.84-272 256-272 256 122.02 256 272z m416-256a32 32 0 0 0-32 32v448a32 32 0 0 0 64 0V288a32 32 0 0 0-32-32z m-224 0c-22.732 0-65.6 11.04-97.296 85.004C618.904 387.204 608 447.932 608 512s10.904 124.8 30.704 170.996C670.404 756.956 713.268 768 736 768s65.6-11.04 97.296-85.004C853.096 636.796 864 576.068 864 512s-10.904-124.8-30.704-170.996C801.596 267.044 758.732 256 736 256z"
                          p-id="3424"
                        ></path>
                      </svg>
                      <svg
                        v-if="metadata.name === 'forum'"
                        t="1641868970469"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="4309"
                        width="14"
                        height="14"
                        fill="currentColor"
                      >
                        <path
                          d="M896 256l-85.333333 0 0 384L256 640l0 85.333333c0 25.6 17.066667 42.666667 42.666667 42.666667l469.333333 0 170.666667 170.666667L938.666667 298.666667C938.666667 273.066667 921.6 256 896 256zM725.333333 512 725.333333 128c0-25.6-17.066667-42.666667-42.666667-42.666667L128 85.333333C102.4 85.333333 85.333333 102.4 85.333333 128l0 597.333333 170.666667-170.666667 426.666667 0C708.266667 554.666667 725.333333 537.6 725.333333 512z"
                          p-id="4310"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </td>
              <td class="score">{{ token[2] }}</td>
              <td class="star">
                <a-icon
                  type="star"
                  class="token-star"
                  @click="addOrCancelStar(token)"
                  theme="filled"
                  :class="{
                    'is-star': starTokens.includes(token[0].toString())
                  }"
                />{{ token[3] }}
              </td>
              <!--<td class="operation">
                <div v-if="showAddToken(token)" @click="addToken(token)">
                  Add to wallet
                </div>
              </td>-->
            </tr>
            <tr v-if="!tokenList.length">
              <td colspan="9">
                <div class="empty">No more tokens</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex-center">
        <a-pagination
          v-if="total > size"
          class="pagination margin-left-auto"
          :default-page-size="size"
          :current="page + 1"
          :total="total"
          @change="pageChange"
        />
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { ICTokenService } from '@/ic/ICTokens/ICTokenService';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { Identity } from '@dfinity/agent';
import { namespace } from 'vuex-class';
import { Token, TokenItemGas, TokenList } from '@/ic/ICTokens/model';
import { Principal } from '@dfinity/principal';
import {
  BLACKHOLE_CANISTER_ID,
  IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
  IC_TOKEN_CANISTER_ID
} from '@/ic/utils';
import { PrincipalString } from '@/ic/common/icType';
import { TokenItem } from '@/ic/ICLighthouse/model';
import { addToken, addedTokens } from '@/ic/addToken';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { toHttpRejectError } from '@/ic/httpError';
import { readState } from '@/ic/readState';
import { BlackholeService } from '@/ic/Blackhole/BlackholeService';
import { checkAuth } from '@/ic/CheckAuth';

const commonModule = namespace('common');

@Component({
  name: 'TokenList',
  components: {},
  filters: {
    filterGas(val: TokenItemGas, tokens: TokenList) {
      if (val) {
        const { token } = val as { token: string };
        if (token) {
          return new BigNumber(token)
            .div(10 ** Number(tokens[1].decimals))
            .toString(10);
        }
        const { cycles } = val as { cycles: string };
        if (cycles) {
          return `cycles:${cycles}`;
        }
        return 'noFee';
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getIdentity') getIdentity?: Identity;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private ICTokenService: ICTokenService;
  private ICLighthouseService: ICLighthouseService;
  private blackholeService: BlackholeService;
  private spinning = false;
  private showMore = false;
  // private principal: string;
  private tokenList: Array<TokenList> = [];
  private total = 0;
  private size = 10;
  private page = 0;
  private lastPage = 0;
  private decimals = 8;
  private starTokens: Array<PrincipalString> = [];
  private addedTokens: Array<TokenItem> = null;
  private DRC20TokenService: DRC20TokenService;
  created(): void {
    // this.principal = localStorage.getItem('principal');
    this.ICTokenService = new ICTokenService();
    this.ICLighthouseService = new ICLighthouseService();
    this.DRC20TokenService = new DRC20TokenService();
    this.blackholeService = new BlackholeService();
    this.getTokenList();
    if (this.getPrincipalId) {
      this.getStarTokens();
      this.getAddedTokens();
    }
    this.getIclDecimals();
  }
  private pageChange(page: number): void {
    this.page = page - 1;
    this.getTokenList('pageChange');
  }
  private async getIclDecimals(): Promise<void> {
    this.decimals = await this.DRC20TokenService.decimals(
      IC_LIGHTHOUSE_TOKEN_CANISTER_ID
    );
  }
  private async addToken(token: TokenList): Promise<void> {
    this.spinning = true;
    try {
      const res = await addToken(
        Principal.fromText(token[0].toString()),
        token[1].symbol,
        token[1].name,
        token[1].decimals,
        'DRC20',
        {
          add: null
        }
      );
      if (res) {
        this.$message.success('Add to wallet Success');
        this.getAddedTokens();
      }
    } catch (e) {
      console.log(e);
    }
    this.spinning = false;
  }
  private showAddToken(token: TokenList): boolean {
    if (this.addedTokens) {
      return !this.addedTokens.some(
        (item) => item.canisterId.toString() === token[0].toString()
      );
    } else {
      return false;
    }
  }
  private async getAddedTokens(): Promise<void> {
    this.addedTokens = await addedTokens();
  }
  private async getStarTokens(): Promise<void> {
    const res = await this.ICTokenService.getStarTokens(
      Principal.fromText(this.getPrincipalId)
    );
    if (res.length) {
      this.starTokens = res[0].map((tokenId) => tokenId.toString());
    } else {
      this.starTokens = [];
    }
    console.log(this.starTokens);
  }
  private async handleStar(tokenItem: TokenList): Promise<void> {
    this.spinning = true;
    try {
      const res = await this.DRC20TokenService.icrc2_approve(
        IC_LIGHTHOUSE_TOKEN_CANISTER_ID,
        {
          owner: Principal.fromText(IC_TOKEN_CANISTER_ID),
          subaccount: []
        },
        BigInt(10 ** this.decimals)
      );
      if (res) {
        const type = Object.keys(res)[0];
        if (type === 'Ok') {
          try {
            await this.ICTokenService.starIt(tokenItem[0]);
            this.$message.success('Success');
            this.starTokens.push(tokenItem[0].toString());
            tokenItem[3] = BigInt(
              new BigNumber(tokenItem[3].toString()).plus(1)
            );
          } catch (e) {
            console.log(e);
            this.$message.error(toHttpRejectError(e));
          }
          this.spinning = false;
        } else {
          console.log(res);
          this.$message.error('Approve Error');
          this.spinning = false;
        }
      }
    } catch (e) {
      this.spinning = false;
      console.log(e);
    }
  }
  private async getTokenList(type?: string): Promise<void> {
    this.spinning = true;
    const res = await this.ICTokenService.getTokenList(this.size, this.page);
    if (res.length) {
      if ((this.page || this.page === 0) && this.page === this.lastPage) {
        this.total = this.size * this.page + res.length;
      }
      if (res.length >= this.size && this.page === this.lastPage) {
        ++this.total;
      }
      if (this.total) {
        if (this.total % this.size === 0) {
          this.lastPage = parseInt((this.total / this.size).toString()) - 1;
        } else {
          this.lastPage = parseInt((this.total / this.size).toString());
        }
      }
      console.log(this.lastPage);
    }
    console.log(this.total);
    this.showMore = res.length && res.length >= this.size;
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const canisterIds: Array<string> = [];
    res.forEach((item) => {
      canisterIds.push(item[0].toString());
    });
    await checkAuth();
    const flag = needConnectPlug(canisterIds);
    const connectInfinity = await needConnectInfinity(canisterIds);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    if (
      type &&
      priList[principal] === 'Plug' &&
      flag &&
      this.$route.name === 'icTokens'
    ) {
      this.$info({
        content: 'Tokens need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(canisterIds).then(() => {
            if (res.length) {
              const tokenList: Array<TokenList> = [];
              for (let i = 0; i < res.length; i++) {
                tokenList[i] = [
                  ...res[i],
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ];
                that.getTotalSupply(tokenList[i]);
                that.getMaxSupply(tokenList[i]);
                that.getGas(tokenList[i]);
                that.getMetadata(tokenList[i]);
                that.readState(tokenList[i]);
              }
              that.tokenList = tokenList;
              console.log(tokenList);
            } else {
              that.tokenList = [];
            }
            that.spinning = false;
          });
        }
      });
    } else if (
      type &&
      priList[principal] === 'Infinity' &&
      connectInfinity &&
      this.$route.name === 'icTokens'
    ) {
      this.$info({
        content: 'Tokens need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity(canisterIds).then(() => {
            if (res.length) {
              const tokenList: Array<TokenList> = [];
              for (let i = 0; i < res.length; i++) {
                tokenList[i] = [
                  ...res[i],
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ];
                that.getTotalSupply(tokenList[i]);
                that.getMaxSupply(tokenList[i]);
                that.getGas(tokenList[i]);
                that.getMetadata(tokenList[i]);
                that.readState(tokenList[i]);
              }
              that.tokenList = tokenList;
              console.log(tokenList);
            } else {
              that.tokenList = [];
            }
            that.spinning = false;
          });
        }
      });
    } else {
      if (res.length) {
        const tokenList: Array<TokenList> = [];
        for (let i = 0; i < res.length; i++) {
          tokenList[i] = [...res[i], null, null, null, null, null, null, null];
          this.getTotalSupply(tokenList[i]);
          this.getMaxSupply(tokenList[i]);
          this.getGas(tokenList[i]);
          this.getMetadata(tokenList[i]);
          this.readState(tokenList[i]);
        }
        this.tokenList = tokenList;
        console.log(tokenList);
      } else {
        this.tokenList = [];
      }
      this.spinning = false;
    }
  }
  private filterToken(controller: string, tokenId: string): string {
    if (controller === 'y2b5k-gqaaa-aaaak-aacqq-cai') {
      return 'constructor';
    }
    if (controller === '7hdtw-jqaaa-aaaak-aaccq-cai') {
      return 'blackhole';
    }
    if (tokenId === controller) {
      return 'tokenSelf';
    }
    return 'funder';
  }
  private async getCycles(token: TokenList): Promise<void> {
    const res = await this.blackholeService.canister_status({
      canister_id: token[0]
    });
    console.log(res);
    if (res && res.cycles) {
      this.$set(token, 11, res.cycles);
    }
  }
  private async readState(token: TokenList): Promise<void> {
    console.log(token);
    const state = await readState(token[0].toString());
    console.log(token[0].toString());
    console.log(state);
    if (state && state.controllers && state.controllers.length) {
      this.$set(token, 10, state.controllers);
      if (state.controllers.includes(BLACKHOLE_CANISTER_ID)) {
        this.getCycles(token);
      }
    }
  }
  private async getMetadata(token: TokenList): Promise<void> {
    const metadata = await this.DRC20TokenService.metadata(token[0].toString());
    const metadataType = [];
    metadata.some((val) => {
      metadataType.push(val.name);
      if (val.name === 'logo') {
        this.$set(token, 8, val.content);
      }
    });
    console.log(metadataType);
    // todo
    if (!metadataType.includes('webUrl')) {
      metadata.push({ name: 'webUrl', content: '' });
    }
    if (!metadataType.includes('twitter')) {
      metadata.push({ name: 'twitter', content: '' });
    }
    if (!metadataType.includes('medium')) {
      metadata.push({ name: 'medium', content: '' });
    }
    if (!metadataType.includes('forum')) {
      metadata.push({ name: 'forum', content: '' });
    }
    this.$set(token, 7, metadata);
  }
  private async getMaxSupply(token: TokenList): Promise<void> {
    try {
      const maxSupply = await this.DRC20TokenService.getMaxSupply(
        token[0].toString()
      );
      if (maxSupply && maxSupply[0]) {
        this.$set(token, 9, maxSupply[0]);
      }
    } catch (e) {
      //
    }
  }
  private async getTotalSupply(token: TokenList): Promise<void> {
    let totalSupply = await this.DRC20TokenService.totalSupply(
      token[0].toString()
    );
    // let supply = new BigNumber(totalSupply.toString())
    //   .div(10 ** Number(token[1].decimals))
    //   .toString();
    this.$set(token, 5, totalSupply);
  }
  private async getGas(token: TokenList): Promise<void> {
    const res = await this.DRC20TokenService.gas(token[0].toString());
    const gas = JSON.parse(
      JSON.stringify(
        res,
        (key, value) => (typeof value === 'bigint' ? value.toString(10) : value) // return everything else unchanged
      )
    ) as TokenItemGas;
    this.$set(token, 6, gas);
  }
  private addOrCancelStar(token: TokenList): void {
    if (this.starTokens.includes(token[0].toString())) {
      this.cancelStar(token);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _that = this;
      this.$confirm({
        content: 'It costs 1 ICL to star',
        class: 'connect-plug register-mining-confirm',
        icon: 'connect-plug',
        okText: 'Confirm',
        centered: true,
        onOk() {
          _that.handleStar(token);
        }
      });
    }
  }
  private async cancelStar(tokenItem: TokenList): Promise<void> {
    this.spinning = true;
    const res = await this.ICTokenService.cancelStar(tokenItem[0]);
    if (res) {
      this.$message.success('Cancel Star Success');
      const index = this.starTokens.indexOf(tokenItem[0].toString());
      this.starTokens.splice(index, 1);
      tokenItem[3] = BigInt(new BigNumber(tokenItem[3].toString()).minus(1));
    } else {
      this.$message.error('Cancel Star Error');
    }
    this.spinning = false;
  }
}
</script>

<style scoped lang="scss">
.ic-token-list-wrap {
  width: 100%;
  border-radius: 10px;
  background: #141b23;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  margin-top: 0;
  overflow: auto;
  table {
    width: 100%;
    font-size: 12px;
    th {
      background: #141b23;
    }
  }
  .empty {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  tr {
    &:nth-child(2n-1) {
      background: #161e26;
    }
    td,
    th {
      vertical-align: middle;
      flex-shrink: 0;
      .token-id-rocks {
        display: inline-block;
        line-height: 1.1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #1996c4;
      }
      &.metadata {
        word-break: keep-all;
      }
      &.operation {
        div {
          cursor: pointer;
          text-align: center;
          color: #1996c4;
        }
      }
      &.gas {
        white-space: nowrap;
      }
      &.name {
        white-space: nowrap;
        padding: 5px 10px;
        dt,
        dd {
          text-align: left;
        }
        div {
          display: flex;
          align-items: center;
        }
        dt {
          margin-bottom: 3px;
          font-weight: bold;
        }
        .token-logo {
          width: 30px;
          height: 30px;
          margin-right: 8px;
        }
        img {
          width: 30px;
          height: 30px;
          border-radius: 15px;
          object-fit: contain;
        }
      }
      .metadata-item-info {
        a {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #1996c4;
        }
      }
    }
  }
}
.pagination {
  margin-top: 20px;
}
.ic-tokens-header {
  font-weight: bold;
}
p {
  margin: 0 auto 20px 0;
  font-size: 20px;
  text-align: center;
}
.star,
.metadata {
  word-break: keep-all;
  white-space: nowrap;
}
.token-star {
  padding-right: 5px;
  cursor: pointer;
  font-size: 16px;
  &.is-star {
    color: #d29967;
  }
}
.metadata-item {
  display: inline-block;
  a,
  span {
    padding: 0 3px;
  }
}
.total-supply {
  line-height: 1.2;
}
.controller-red {
  color: #d13651 !important;
  font-size: 12px;
  dl {
    line-height: 1.2;
  }
}
/*.more-tokens {
  color: #1890ff;
  cursor: pointer;
  padding: 10px 0;
	text-align: center;
}*/
</style>
