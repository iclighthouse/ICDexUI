<template>
  <div class="ic-tokens">
    <a-spin :spinning="tableSpinning">
      <div class="token-wrap-common">
        <table>
          <thead>
            <tr>
              <th class="name">Token</th>
              <th class="token-id">Token ID</th>
              <th class="total-supply">TotalSupply</th>
              <th class="total-supply">MaxSupply</th>
              <th class="gas">Gas</th>
              <th class="metadata">Metadata</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(token, index) in tokenList" :key="index">
              <td class="name">
                <div>
                  <img v-if="token.logo" :src="token.logo" alt="" />
                  <dl>
                    <dt>{{ token.symbol }}</dt>
                    <dd>{{ token.name }}</dd>
                  </dl>
                </div>
              </td>
              <td class="token-id">
                <a
                  :href="`https://ic.house/token/${token.tokenId.toString()}`"
                  target="_blank"
                  class="token-id-rocks"
                  rel="nofollow noreferrer noopener"
                  ><copy-account
                    :account="token.tokenId.toString()"
                    copyText="Token ID"
                  ></copy-account
                ></a>
              </td>
              <td class="total-supply">
                <span v-show="token.totalSupply && token.decimals">{{
                  token.totalSupply
                    | bigintToFloat(
                      Number(token.decimals),
                      Number(token.decimals)
                    )
                }}</span>
              </td>
              <td class="total-supply">
                <span v-show="token.maxSupply && token.decimals">{{
                  token.maxSupply
                    | bigintToFloat(
                      Number(token.decimals),
                      Number(token.decimals)
                    )
                }}</span>
              </td>
              <td class="gas">{{ token.gas | filterGas(token) }}</td>
              <td class="metadata">
                <div
                  class="metadata-item"
                  v-for="(metadata, index) in token.metadata"
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
                        style="margin-bottom: -2px"
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
                        style="margin-bottom: -2px"
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
                        style="margin-bottom: -2px"
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
                        style="margin-bottom: -2px"
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
              <td class="star" align="center">
                <a-icon
                  type="star"
                  class="token-star is-star"
                  @click="cancelStar(token, index)"
                  theme="filled"
                />
              </td>
            </tr>
            <tr v-if="!tokenList.length">
              <td colspan="7">
                <div class="empty">No Favourites</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--<a-pagination
				class="pagination"
				:current="page + 1"
				:total="500"
				@change="pageChange"
			/>-->
    </a-spin>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { ICTokenService } from '@/ic/ICTokens/ICTokenService';
import { Token } from '@/ic/ICTokens/model';
import { Principal } from '@dfinity/principal';
import { TokenInfoMixin } from '@/mixins';
import { namespace } from 'vuex-class';
const commonModule = namespace('common');
@Component({
  name: 'Favourites',
  components: {}
})
export default class extends Mixins(TokenInfoMixin) {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private tableSpinning = false;
  private ICTokenService: ICTokenService;
  // private principalId: PrincipalString;
  private tokenList: Array<Token> = [];
  created(): void {
    // this.principalId = localStorage.getItem('principal');
    this.ICTokenService = new ICTokenService();
    if (this.getPrincipalId) {
      this.getStarTokens();
    }
  }
  private async getStarTokens(): Promise<void> {
    this.tableSpinning = true;
    let tokens = await this.ICTokenService.getStarTokens(
      Principal.fromText(this.getPrincipalId)
    );
    if (tokens && tokens[0]) {
      for (let i = 0; i < tokens[0].length; i++) {
        this.tokenList[i] = new Token();
        this.tokenList[i].tokenId = tokens[0][i];
        this.getTokenInfo(this.tokenList[i]);
      }
    }
    console.log(this.tokenList);
    this.tableSpinning = false;
  }
  private async cancelStar(tokenItem: Token, index: number): Promise<void> {
    this.tableSpinning = true;
    try {
      const res = await this.ICTokenService.cancelStar(tokenItem.tokenId);
      this.tableSpinning = false;
      if (res) {
        this.$message.success('Cancel Star Success');
        this.tokenList.splice(index, 1);
      } else {
        this.$message.error('Cancel Star Error');
      }
    } catch (e) {
      this.tableSpinning = false;
    }
  }
}
</script>

<style scoped lang="scss">
.metadata-item {
  display: inline-block;
  a,
  span {
    padding: 0 3px;
  }
}
.star {
  min-width: 30px;
}
.token-star {
  width: 30px;
  cursor: pointer;
  font-size: 16px;
  &.is-star {
    color: #d29967;
  }
}
.token-wrap-common {
  width: 100%;
  border-radius: 10px;
  background: #141b23;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  padding: 20px 25px;
  overflow: auto;
}
</style>
