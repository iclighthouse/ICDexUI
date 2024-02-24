<template>
  <div class="dapp-container">
    <div class="dapp-search">
      <a-input
        v-model="searchValue"
        placeholder="Search Dapp"
        @pressEnter="onSearch"
      >
        <a-icon slot="prefix" type="search" />
      </a-input>
    </div>
    <div class="dapp-list-main-recommended dapp-list-main container-width">
      <ul>
        <li>
          <router-link to="/icl">
            <dl>
              <dt class="recommended-img recommended-img-icl">
                <img src="@/assets/img/icl.svg" alt="logo" />
              </dt>
              <dd>ICL</dd>
            </dl>
          </router-link>
        </li>
        <li>
          <router-link to="/cyclesFinance">
            <dl>
              <dt class="recommended-img">
                <img src="@/assets/img/cyclesfinance-1.png" alt="logo" />
              </dt>
              <dd>CyclesFinance</dd>
            </dl>
          </router-link>
        </li>
        <li>
          <router-link to="/ICSwap">
            <dl>
              <dt class="recommended-img recommended-img-icswap">
                <img src="@/assets/img/icswap.png" alt="logo" />
              </dt>
              <dd class="de-swap-dd">
                ICSwapHouse <span class="test-tip">test</span>
              </dd>
            </dl>
          </router-link>
        </li>
        <li>
          <router-link to="/ICDex">
            <dl>
              <dt class="recommended-img recommended-img-dex">
                <img src="@/assets/img/icdex-1.png" alt="logo" />
              </dt>
              <dd class="de-swap-dd">
                ICDex
                <!--<span class="test-tip">test</span>-->
              </dd>
            </dl>
          </router-link>
        </li>
        <!--<li>
				<router-link to="/ICStable">
					<dl>
						<dt>
							<img src="@/assets/img/logo-i.png" alt="logo" />
						</dt>
						<dd>ICStable</dd>
					</dl>
				</router-link>
			</li>-->
        <!--<li>
          <router-link to="/icTokens">
            <dl>
              <dt class="recommended-img recommended-img-token">
                <img src="@/assets/img/ictokens-1.png" alt="logo" />
              </dt>
              <dd>ICTokens</dd>
            </dl>
          </router-link>
        </li>-->
        <!--<li>
				<router-link to="/ICMonitor">
					<dl>
						<dt>
							<img src="@/assets/img/logo-i.png" alt="logo" />
						</dt>
						<dd>ICMonitor</dd>
					</dl>
				</router-link>
			</li>-->
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  private searchValue = '';
  private onSearch(): void {
    console.log(this.searchValue);
  }
}
</script>

<style scoped lang="scss">
.dapp-search {
  width: 600px;
  margin: 80px auto;
  i {
    color: #777d90;
  }
}
.dapp-list-main {
  background: #141b23;
  border-radius: 11px;
  &.dapp-list-main-recommended {
    /*border: none;
    box-shadow: none;
    background: transparent;*/
  }
  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-top: 35px;
    li {
      display: flex;
      align-items: center;
      flex-direction: column;
      flex-shrink: 0;
      width: 100px;
      margin: 0 33px 60px;
      color: #adb3c4;
      cursor: pointer;
    }
    dd {
      line-height: 28px;
      text-align: center;
    }
    img {
      width: 100px;
      height: 100px;
      border-radius: 50px;
      object-fit: contain;
    }
    .recommended-img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      background: #0d1217;
      border-radius: 50px;
      &.recommended-img-icl {
        flex-direction: column;
        img {
          width: 60px;
          height: 60px;
        }
      }
      &.recommended-img-token {
        img {
          width: 65px;
          height: 65px;
        }
      }
      &.recommended-img-dex {
        img {
          width: 80px;
          height: 80px;
        }
      }
      &.recommended-img-icswap {
        img {
          width: 70px;
          height: 65px;
        }
      }
      img {
        width: 85px;
        height: 85px;
      }
    }
  }
}
.de-swap-dd {
  position: relative;
}
.test-tip {
  position: absolute;
  top: -3px;
  padding-left: 5px;
  font-size: 12px;
  color: #f6465d;
}
@media screen and (max-width: 768px) {
  .dapp-container {
    padding: 0 15px 20px 15px;
  }
  .dapp-search {
    width: 90%;
  }
}
</style>
