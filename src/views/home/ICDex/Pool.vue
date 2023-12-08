<template>
  <div>
    <div class="home-header">
      <div class="home-header-left">
        <img
          class="home-header-logo"
          src="@/assets/img/icdex-2.png"
          alt="logo"
        />
      </div>
      <ul>
        <li
          :class="{
            active:
              $route.fullPath.toLocaleLowerCase() ===
                menu.path.toLocaleLowerCase() ||
              (menu.value === 'Trade' && $route.name === 'ICDex')
          }"
          v-for="(menu, index) in menuList"
          :key="index"
        >
          <router-link :to="menu.path">{{ menu.value }}</router-link>
        </li>
      </ul>
      <account-info :menu-list="menuList"></account-info>
    </div>
    <div class="pool-info container-width">
      <div class="proposal-main-title">
        <a-icon class="back-arrow" type="arrow-left" @click="back" />
      </div>
      <div class="pool-item">
        <div class="pool-header">
          <span class="pc-show">Name:&nbsp;</span
          ><span v-if="pool[1]" class="base-color-w pc-show">{{
            pool[1].name
          }}</span>
          <button
            class="margin-left-auto"
            type="button"
            :class="{ primary: type === 'Add' }"
            @click="changeType('Add')"
          >
            Add
          </button>
          <button
            type="button"
            style="margin-left: 10px"
            :class="{ primary: type === 'Remove' }"
            @click="changeType('Remove')"
          >
            Remove
          </button>
        </div>
        <div class="pool-item-l h5-show">
          <div class="pool-item-l-net">
            <span>Name:&nbsp;</span
            ><span v-if="pool[1]" class="base-color-w">
              {{ pool[1].name }}
            </span>
          </div>
        </div>
        <div class="pool-item-l">
          <div
            class="pool-item-l-net"
            v-if="
              pool[1] &&
              tokens[pool[1].pairInfo.token0[0].toString()] &&
              tokens[pool[1].pairInfo.token1[0].toString()]
            "
          >
            <span>UnitNet:</span>
            <span v-if="pool[2]" class="base-color-w">
              {{
                pool[2].latestUnitNetValue.token0
                  | bigintToFloat(
                    tokens[pool[1].pairInfo.token0[0].toString()].decimals,
                    tokens[pool[1].pairInfo.token0[0].toString()].decimals
                  )
                  | formatNum
              }}
              <span class="font12">
                {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
              </span>
              +
              {{
                pool[2].latestUnitNetValue.token1
                  | bigintToFloat(
                    tokens[pool[1].pairInfo.token1[0].toString()].decimals,
                    tokens[pool[1].pairInfo.token1[0].toString()].decimals
                  )
                  | formatNum
              }}
              <span class="font12">
                {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
              </span>
            </span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="pool-item-l">
          <div
            class="pool-item-l-net"
            v-if="
              pool[1] &&
              tokens[pool[1].pairInfo.token0[0].toString()] &&
              tokens[pool[1].pairInfo.token1[0].toString()]
            "
          >
            <span> Balance: </span>
            <span v-if="pool[2]" class="base-color-w">
              {{
                pool[2].poolBalance.balance0
                  | bigintToFloat(
                    Math.min(
                      tokens[pool[1].pairInfo.token0[0].toString()].decimals,
                      8
                    ),
                    tokens[pool[1].pairInfo.token0[0].toString()].decimals
                  )
                  | formatNum
              }}
              <span class="font12">
                {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
              </span>
              +
              {{
                pool[2].poolBalance.balance1
                  | bigintToFloat(
                    Math.min(
                      tokens[pool[1].pairInfo.token1[0].toString()].decimals,
                      8
                    ),
                    tokens[pool[1].pairInfo.token1[0].toString()].decimals
                  )
                  | formatNum
              }}
              <span class="font12">
                {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
              </span>
            </span>
            <span v-else>0</span>
          </div>
        </div>
        <div class="pool-item-l pool-item-l-shares">
          <div>
            <span>Total Shares: </span>
            <span v-if="pool[2] && pool[1]" class="base-color-w">
              {{
                pool[2].poolShares
                  | bigintToFloat(pool[1].shareDecimals, pool[1].shareDecimals)
                  | formatNum
              }}
            </span>
            <span v-else>0</span>
          </div>
          <div>
            <span>Your Shares: </span>
            <span v-if="pool[3] && pool[1]" class="base-color-w">
              {{
                pool[3][0]
                  | bigintToFloat(pool[1].shareDecimals, pool[1].shareDecimals)
                  | formatNum
              }}
            </span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="pool-apy">
          <span>APY:&nbsp;&nbsp;</span>
          <span class="pool-apy-item">
            <span
              v-if="
                pool[2] &&
                pool[1] &&
                tokens[pool[1].pairInfo.token0[0].toString()] &&
                tokens[pool[1].pairInfo.token1[0].toString()]
              "
            >
              <span
                >{{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                {{ pool[2].apy24h.token0 | filterAPY }},</span
              >
              <span
                >{{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                {{ pool[2].apy24h.token1 | filterAPY }}(24-Hour APY)</span
              >
            </span>
            <span
              v-if="
                pool[2] &&
                pool[1] &&
                tokens[pool[1].pairInfo.token0[0].toString()] &&
                tokens[pool[1].pairInfo.token1[0].toString()]
              "
            >
              <span
                >{{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                {{ pool[2].apy7d.token0 | filterAPY }},</span
              >
              <span
                >{{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                {{ pool[2].apy7d.token1 | filterAPY }}(7-Day APY)</span
              >
            </span>
            <span v-else>-</span>
          </span>
        </div>
        <div
          v-if="
            showCapThreshold(pool) &&
            pool[1] &&
            tokens[pool[1].pairInfo.token1[0].toString()]
          "
        >
          <span>Cap threshold: </span>
          <span>
            {{
              pool[1].poolThreshold
                | bigintToFloat(
                  tokens[pool[1].pairInfo.token1[0].toString()].decimals,
                  tokens[pool[1].pairInfo.token1[0].toString()].decimals
                )
                | formatNum
            }}
            {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
          </span>
        </div>
        <div
          v-if="
            !showCapThreshold(pool) &&
            pool[1] &&
            pool[2] &&
            pool[3] &&
            tokens[pool[1].pairInfo.token1[0].toString()] &&
            pairVol
          "
          style="margin-top: 10px"
        >
          <span
            >Available limit: {{ getAvailable(pool) }}
            {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}</span
          >
        </div>
        <div
          v-if="
            !showCapThreshold(pool) &&
            pool[1] &&
            tokens[pool[1].pairInfo.token1[0].toString()] &&
            volUsed
          "
        >
          <span
            >Utilized amount:
            {{
              volUsed
                | bigintToFloat(
                  8,
                  tokens[pool[1].pairInfo.token1[0].toString()].decimals
                )
                | formatNum
            }}
            {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}</span
          >
        </div>
      </div>
      <div v-show="type === 'Remove'">
        <div class="pool-item mt20">
          <div class="exchange-swap-item-top">
            <div>Burn Shares</div>
            <a-input
              v-if="pool[1]"
              class="margin-left-auto text-right"
              :disabled="!pool[3]"
              v-model="removeShares"
              autocomplete="off"
              v-only-float="pool[1].shareDecimals"
              :key="pool[1].shareDecimals"
              min="0"
              placeholder="0"
              type="text"
              @input="sharesChange"
            />
          </div>
          <div class="exchange-swap-item-bottom">
            <span
              class="margin-left-auto exchange-swap-item-bottom-fee-share"
              @click="setMaxShares"
              >Max</span
            >
          </div>
        </div>
        <div class="exchange-swap-icon">
          <a-icon type="arrow-down" class="exchange-swap-icon-plus" />
        </div>
        <div class="pool-item">
          <div class="swap-item-top">
            <div class="ic-swap-item-top-left">
              <div class="swap-item-top-left">
                <span class="img-content">
                  <img
                    v-if="
                      pool[1] && tokens[pool[1].pairInfo.token0[0].toString()]
                    "
                    :src="tokens[pool[1].pairInfo.token0[0].toString()].logo"
                    alt=""
                  />
                  <span v-else class="empty-pic"></span>
                </span>
                <span class="swap-item-top-left-name" v-if="pool[1]">
                  {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                </span>
              </div>
            </div>
            <div
              v-if="pool[1] && tokens[pool[1].pairInfo.token0[0].toString()]"
              class="swap-item-top-right-remove"
            >
              <span>
                <span class="base-color-w">{{ sharesValue0 }}</span>
                {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
              </span>
            </div>
          </div>
        </div>
        <div class="exchange-swap-icon">
          <a-icon type="plus" class="exchange-swap-icon-plus" />
        </div>
        <div class="pool-item">
          <div class="swap-item-top">
            <div class="ic-swap-item-top-left">
              <div class="swap-item-top-left">
                <span class="img-content">
                  <img
                    v-if="
                      pool[1] && tokens[pool[1].pairInfo.token1[0].toString()]
                    "
                    :src="tokens[pool[1].pairInfo.token1[0].toString()].logo"
                    alt=""
                  />
                  <span v-else class="empty-pic"></span>
                </span>
                <span class="swap-item-top-left-name" v-if="pool[1]">
                  {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                </span>
              </div>
            </div>
            <div
              v-if="pool[1] && tokens[pool[1].pairInfo.token1[0].toString()]"
              class="swap-item-top-right-remove"
            >
              <span>
                <span class="base-color-w">{{ sharesValue1 }}</span>
                {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
              </span>
            </div>
          </div>
        </div>
        <div class="swap-button w100">
          <button
            v-if="getPrincipalId"
            :disabled="buttonDisabledRemove"
            class="primary large-primary w100"
            @click="onRemove"
          >
            {{ buttonNameRemove }}
          </button>
          <button
            v-else
            class="primary large-primary w100"
            @click="connectWallet"
          >
            Connect Wallet
          </button>
        </div>
      </div>
      <div v-show="type === 'Add'">
        <div class="pool-item-title">Deposit amounts</div>
        <div class="pool-item">
          <div class="swap-item-top">
            <div class="ic-swap-item-top-left">
              <div class="swap-item-top-left">
                <span class="img-content">
                  <img
                    v-if="
                      pool[1] && tokens[pool[1].pairInfo.token0[0].toString()]
                    "
                    :src="tokens[pool[1].pairInfo.token0[0].toString()].logo"
                    alt=""
                  />
                  <span v-else class="empty-pic"></span>
                </span>
                <span class="swap-item-top-left-name" v-if="pool[1]">
                  {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
                </span>
              </div>
            </div>
            <div class="swap-item-top-right">
              <a-input-group
                class="swap-item-group"
                compact
                v-if="pool[1] && tokens[pool[1].pairInfo.token0[0].toString()]"
              >
                <a-input
                  :key="tokens[pool[1].pairInfo.token0[0].toString()].decimals"
                  class="input-icp-suffix text-right"
                  autocomplete="off"
                  type="text"
                  v-model="token0Amount"
                  v-only-float="
                    tokens[pool[1].pairInfo.token0[0].toString()].decimals
                  "
                  placeholder="0.0"
                  @input="token0AmountChange"
                /><span class="suffix">{{
                  tokens[pool[1].pairInfo.token0[0].toString()].symbol
                }}</span>
              </a-input-group>
              <a-input
                v-else
                class="input-icp-suffix text-right"
                autocomplete="off"
                type="text"
                disabled
                placeholder="0.0"
              />
            </div>
          </div>
          <div class="add-liquidity-item-bottom swap-item-bottom">
            <div
              v-if="
                pool[1] &&
                tokens &&
                tokens[pool[1].pairInfo.token0[0].toString()]
              "
            >
              Balance:
              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>{{
                    tokensBalance[pool[1].pairInfo.token0[0].toString()]
                      | bigintToFloat(
                        tokens[pool[1].pairInfo.token0[0].toString()].decimals,
                        tokens[pool[1].pairInfo.token0[0].toString()].decimals
                      )
                      | formatNum
                  }}</span>
                </template>
                {{
                  tokensBalance[pool[1].pairInfo.token0[0].toString()]
                    | bigintToFloat(
                      8,
                      tokens[pool[1].pairInfo.token0[0].toString()].decimals
                    )
                    | formatAmount(8)
                }}
              </a-tooltip>
              {{ tokens[pool[1].pairInfo.token0[0].toString()].symbol }}
            </div>
            <div class="margin-left-auto">
              <span
                class="max-amount"
                @click="
                  setMaxAmount(pool[1].pairInfo.token0[0].toString(), 'token0')
                "
                >Max</span
              >
            </div>
          </div>
        </div>
        <div class="exchange-swap-icon">
          <a-icon class="swap-icon" type="plus" />
        </div>
        <div class="pool-item">
          <div class="swap-item-top">
            <div class="ic-swap-item-top-left">
              <div class="swap-item-top-left">
                <span class="img-content">
                  <img
                    v-if="
                      pool[1] && tokens[pool[1].pairInfo.token1[0].toString()]
                    "
                    :src="tokens[pool[1].pairInfo.token1[0].toString()].logo"
                    alt=""
                  />
                  <span v-else class="empty-pic"></span>
                </span>
                <span class="swap-item-top-left-name" v-if="pool[1]">
                  {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
                </span>
              </div>
            </div>
            <div class="swap-item-top-right">
              <a-input-group
                class="swap-item-group"
                compact
                v-if="pool[1] && tokens[pool[1].pairInfo.token1[0].toString()]"
              >
                <span
                  v-show="token0Amount"
                  class="prefix"
                  style="padding-left: 5px"
                >
                  ≈
                </span>
                <a-input
                  :key="tokens[pool[1].pairInfo.token1[0].toString()].decimals"
                  class="input-icp-suffix text-right"
                  autocomplete="off"
                  type="text"
                  v-model="token1Amount"
                  v-only-float="
                    tokens[pool[1].pairInfo.token1[0].toString()].decimals
                  "
                  placeholder="0.0"
                  @input="token1AmountChange"
                /><span class="suffix">{{
                  tokens[pool[1].pairInfo.token1[0].toString()].symbol
                }}</span>
              </a-input-group>
              <a-input
                v-else
                class="input-icp-suffix text-right"
                autocomplete="off"
                type="text"
                disabled
                placeholder="0.0"
              />
            </div>
          </div>
          <div class="add-liquidity-item-bottom swap-item-bottom">
            <div
              v-if="
                pool[1] &&
                tokens &&
                tokens[pool[1].pairInfo.token1[0].toString()]
              "
            >
              Balance:
              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>{{
                    tokensBalance[pool[1].pairInfo.token1[0].toString()]
                      | bigintToFloat(
                        tokens[pool[1].pairInfo.token1[0].toString()].decimals,
                        tokens[pool[1].pairInfo.token1[0].toString()].decimals
                      )
                      | formatNum
                  }}</span>
                </template>
                {{
                  tokensBalance[pool[1].pairInfo.token1[0].toString()]
                    | bigintToFloat(
                      8,
                      tokens[pool[1].pairInfo.token1[0].toString()].decimals
                    )
                    | formatAmount(8)
                }}
              </a-tooltip>
              {{ tokens[pool[1].pairInfo.token1[0].toString()].symbol }}
            </div>
            <div class="margin-left-auto">
              <span
                class="max-amount"
                @click="
                  setMaxAmount(pool[1].pairInfo.token1[0].toString(), 'token1')
                "
                >Max</span
              >
            </div>
          </div>
        </div>
        <div v-show="pool[2] && pool[2].poolShares">
          <div class="exchange-swap-icon add-liquidity-icon">
            <a-icon class="swap-icon" type="arrow-down" />
          </div>
          <div class="pool-item exchange-swap-item exchange-swap-item-shares">
            <div class="exchange-swap-item-top">
              <div>You will get</div>
              <div class="you-get-shares">
                &nbsp;<span class="base-color-w">{{
                  shares | bigintToFloat(4, 0) | formatNum
                }}</span
                >&nbsp;
              </div>
              <div>Shares</div>
            </div>
          </div>
        </div>
        <div class="swap-button w100">
          <button
            v-if="getPrincipalId"
            class="primary large-primary w100"
            :disabled="buttonDisabled"
            @click="onAdd"
          >
            <span>{{ buttonName }}</span>
          </button>
          <button
            v-else
            class="primary large-primary w100"
            @click="connectWallet"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Menu } from '@/components/menu/model';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { Icrc1Account, TokenInfo, TokenStd } from '@/ic/common/icType';
import { PoolInfo, PoolStats, ShareWeighted } from '@/ic/makerPool/model';
import { makerPoolService } from '@/ic/makerPool/makerPoolService';
import { namespace } from 'vuex-class';
import BigNumber from 'bignumber.js';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { getTokenBalance } from '@/ic/getTokenBalance';
import { getFee } from '@/ic/getTokenFee';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { Txid, TxnResultErr } from '@/ic/ICLighthouseToken/model';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { toHttpRejectError } from '@/ic/httpError';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { principalToAccountIdentifier, toHexString } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { PairInfo } from '@/ic/ICDex/model';
import { getTokenLogo } from '@/ic/getTokenLogo';
import { ApproveError } from '@/ic/DRC20Token/model';

const commonModule = namespace('common');

@Component({
  name: 'Pool',
  components: { AccountInfo },
  filters: {
    filterAPY(val: string): string {
      if (val || Number(val) === 0) {
        return (
          new BigNumber(val).times(100).decimalPlaces(4).toString(10) + '%'
        );
      }
      return '';
    }
  }
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private makerPoolService: makerPoolService;
  private ICDexService: ICDexService;
  private tokens: { [key: string]: TokenInfo } = {};
  private menuList: Menu[] = [
    {
      value: 'Trade',
      path: '/ICDex'
    },
    {
      value: 'Market',
      path: '/ICDex/market'
    },
    {
      value: 'Pool',
      path: '/ICDex/pools'
    },
    {
      value: 'Competitions',
      path: '/ICDex/competitions'
    },
    {
      value: 'Mining',
      path: '/icl/tradingMining'
    }
  ];
  private pool: [string?, PoolInfo?, PoolStats?, [bigint, ShareWeighted]?] = [];
  private token0Amount = '';
  private token1Amount = '';
  private pairVol = '';
  private volUsed = '';
  private pairInfo: PairInfo = null;
  private pairPrice = '';
  private tokensBalance: { [key: string]: string } = {};
  private shares = '';
  private buttonName = 'Add';
  private buttonNameRemove = 'Remove';
  private removeShares = '';
  private sharesValue0 = '0';
  private sharesValue1 = '0';
  private token0fee = '';
  private token1fee = '';
  private depositAccount: [Icrc1Account, string] = null;
  private ledgerService: LedgerService | undefined = null;
  private timer = null;
  private type: 'Add' | 'Remove' = 'Add';
  get buttonDisabledRemove(): boolean {
    let flag = false;
    if (this.pool[1] && this.pool[1].paused) {
      flag = true;
      this.buttonNameRemove = 'Paused';
    } else if (this.pairInfo && this.pairInfo.paused) {
      flag = true;
      this.buttonName = 'Paused';
    } else if (this.pool[3] && this.pool[1]) {
      const token1Id = this.pool[1].pairInfo.token1[0].toString();
      if (this.tokens[token1Id]) {
        if (
          !this.removeShares ||
          Number(this.removeShares) === 0 ||
          new BigNumber(this.sharesValue0).lte(0) ||
          new BigNumber(this.sharesValue1).lte(0)
        ) {
          this.buttonNameRemove = 'Unavailable shares value';
          flag = true;
        } else if (
          new BigNumber(this.removeShares)
            .times(10 ** this.pool[1].shareDecimals)
            .gt(this.pool[3][0].toString(10))
        ) {
          this.buttonNameRemove = 'Insufficient Shares';
          flag = true;
        } else {
          this.buttonNameRemove = 'Remove';
        }
      } else {
        flag = true;
      }
    } else {
      flag = true;
    }
    return flag;
  }
  get buttonDisabled(): boolean {
    let flag = false;
    if (this.pool[1] && this.pool[1].paused) {
      flag = true;
      this.buttonName = 'Paused';
    } else if (this.pairInfo && this.pairInfo.paused) {
      flag = true;
      this.buttonName = 'Paused';
    } else if (this.pool[1]) {
      const token0Id = this.pool[1].pairInfo.token0[0].toString();
      const token1Id = this.pool[1].pairInfo.token1[0].toString();
      const token0Std = this.pool[1].pairInfo.token0[2];
      const token1Std = this.pool[1].pairInfo.token1[2];
      let token0Fee = this.token0fee;
      let token1Fee = this.token1fee;
      if (
        Object.keys(token0Std)[0] === 'drc20' ||
        Object.keys(token0Std)[0] === 'icrc2'
      ) {
        token0Fee = new BigNumber(token0Fee).plus(token0Fee).toString(10);
      }
      if (
        Object.keys(token1Std)[0] === 'drc20' ||
        Object.keys(token1Std)[0] === 'icrc2'
      ) {
        token1Fee = new BigNumber(token1Fee).plus(token1Fee).toString(10);
      }
      const creator = toHexString(new Uint8Array(this.pool[1].creator));
      const current = principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId)
      );
      if (!this.pool[1].initialized && creator !== current) {
        this.buttonName = 'Only creator can initialized.';
        flag = true;
      } else if (this.tokens[token0Id] && this.tokens[token1Id]) {
        if (!this.token1Amount) {
          this.buttonName = 'Please enter amount';
          flag = true;
        } else if (!this.token0Amount) {
          this.buttonName = 'Please enter amount';
          flag = true;
        } else {
          let minToken0 = new BigNumber(this.token0fee).times(100).toString(10);
          let minToken1 = new BigNumber(this.token1fee).times(100).toString(10);
          if (!this.pool[1].initialized) {
            minToken0 = new BigNumber(this.token0fee)
              .times(100000)
              .toString(10);
            minToken1 = new BigNumber(this.token1fee)
              .times(100000)
              .toString(10);
          }
          const available = this.getAvailable(this.pool);
          const utilized = new BigNumber(this.volUsed)
            .div(10 ** this.tokens[token1Id].decimals)
            .toString(10);
          const remaining = new BigNumber(available)
            .minus(utilized)
            .toString(10);
          if (new BigNumber(this.token0Amount).lt(minToken0)) {
            this.buttonName = `Min ${this.tokens[token0Id].symbol} amount is ${minToken0}`;
            flag = true;
          } else if (new BigNumber(this.token1Amount).lt(minToken1)) {
            this.buttonName = `Min ${this.tokens[token1Id].symbol} amount is ${minToken1}`;
            flag = true;
          } else if (
            new BigNumber(this.tokensBalance[token0Id])
              .div(10 ** this.tokens[token0Id].decimals)
              .minus(this.token0Amount)
              .minus(token0Fee)
              .lt(this.token0fee)
          ) {
            this.buttonName = `Insufficient ${this.tokens[token0Id].symbol} balance`;
            flag = true;
          } else if (
            !this.showCapThreshold &&
            new BigNumber(available).minus(utilized).lt(this.token1Amount)
          ) {
            this.buttonName = `Max ${this.tokens[token1Id].symbol} amount is ${remaining}`;
            flag = true;
          } else if (
            new BigNumber(this.tokensBalance[token1Id])
              .div(10 ** this.tokens[token1Id].decimals)
              .minus(this.token1Amount)
              .minus(token1Fee)
              .lt(this.token1fee)
          ) {
            this.buttonName = `Insufficient ${this.tokens[token1Id].symbol} balance`;
            flag = true;
          } else {
            this.buttonName = 'Add';
          }
        }
      } else {
        flag = true;
      }
    } else {
      flag = true;
    }
    return flag;
  }
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
    console.log(this.timer);
  }
  created(): void {
    this.makerPoolService = new makerPoolService();
    this.ledgerService = new LedgerService();
    this.ICDexService = new ICDexService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    const poolId = this.$route.params.poolId;
    if (this.$route.params.type) {
      this.type = this.$route.params.type as 'Add' | 'Remove';
    } else {
      this.type = 'Add';
    }
    if (poolId) {
      this.$set(this.pool, 0, poolId);
      this.getPool(poolId);
    }
    if (this.getPrincipalId) {
      const currentInfo =
        JSON.parse(localStorage.getItem(this.getPrincipalId)) || {};
      this.tokensBalance = currentInfo.tokensBalance || {};
      this.getDepositAccount();
      this.getUnitNetValues();
    }
  }
  private async getUnitNetValues(): Promise<void> {
    const poolId = this.$route.params.poolId;
    const res = await this.makerPoolService.getUnitNetValues(poolId);
    console.log(res);
  }
  private async onRemove(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const poolId = this.$route.params.poolId;
    const shares = new BigNumber(this.removeShares)
      .times(10 ** this.pool[1].shareDecimals)
      .toString(10);
    try {
      const res = await this.makerPoolService.remove(poolId, BigInt(shares));
      if (res) {
        this.$message.success('Success');
        this.initRemove();
        this.getPoolInfo(poolId);
        this.poolStats(poolId);
        this.getAccountShares(poolId);
      } else {
        this.$message.error('Error');
        this.getPoolInfo(poolId);
      }
    } catch (e) {
      console.log(e);
      if (toHttpRejectError(e).includes('414')) {
        this.$message.error('Please lower the shares.');
      } else if (toHttpRejectError(e).includes('401')) {
        this.$message.error(
          'The system is processing, please try again later.'
        );
      } else {
        this.$message.error('Error');
      }
      this.getPoolInfo(poolId);
    }
    loading.close();
  }
  private async onAdd(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const poolId = this.$route.params.poolId;
    const token0Id = this.pool[1].pairInfo.token0[0].toString();
    const token0Std = this.pool[1].pairInfo.token0[2];
    const token0StdString = Object.keys(token0Std)[0];
    const token1Id = this.pool[1].pairInfo.token1[0].toString();
    const token1Std = this.pool[1].pairInfo.token1[2];
    const token1StdString = Object.keys(token1Std)[0];
    const token0Amount = new BigNumber(this.token0Amount)
      .times(10 ** this.tokens[token0Id].decimals)
      .toString(10);
    const token1Amount = new BigNumber(this.token1Amount)
      .times(10 ** this.tokens[token1Id].decimals)
      .toString(10);
    const needTransferToken0 = new BigNumber(this.token0Amount)
      .plus(this.token0fee)
      .plus(this.token0fee)
      .times(10 ** this.tokens[token0Id].decimals)
      .toString(10);
    const needTransferToken1 = new BigNumber(this.token1Amount)
      .plus(this.token1fee)
      .plus(this.token1fee)
      .times(10 ** this.tokens[token1Id].decimals)
      .toString(10);
    if (
      token0StdString.toLocaleLowerCase() === 'drc20' ||
      token0StdString.toLocaleLowerCase() === 'icrc2'
    ) {
      const approveToken0 = await this.approve(
        token0Id,
        token0StdString,
        BigInt(needTransferToken0)
      );
      if (!approveToken0) {
        loading.close();
        return;
      }
    } else if (token0StdString.toLocaleLowerCase() === 'icrc1') {
      const transferIcrc1Token0 = await this.transferIcrc1(
        token0Id,
        BigInt(needTransferToken0),
        this.depositAccount[0]
      );
      if (!transferIcrc1Token0) {
        loading.close();
        return;
      }
    } else if (token0StdString.toLocaleLowerCase() === 'icp') {
      const block = await this.ledgerService.sendIcp(
        new BigNumber(needTransferToken0)
          .div(10 ** this.tokens[token0Id].decimals)
          .toString(10),
        this.depositAccount[1]
      );
      if (!block) {
        this.$message.error('Error');
        loading.close();
        return;
      }
    }
    if (
      token1StdString.toLocaleLowerCase() === 'drc20' ||
      token1StdString.toLocaleLowerCase() === 'icrc2'
    ) {
      const approveToken1 = await this.approve(
        token1Id,
        token1StdString,
        BigInt(needTransferToken1)
      );
      if (!approveToken1) {
        loading.close();
        return;
      }
    } else if (token1StdString.toLocaleLowerCase() === 'icrc1') {
      const transferIcrc1Token1 = await this.transferIcrc1(
        token1Id,
        BigInt(needTransferToken1),
        this.depositAccount[0]
      );
      if (!transferIcrc1Token1) {
        loading.close();
        return;
      }
    } else if (token1StdString.toLocaleLowerCase() === 'icp') {
      const block = await this.ledgerService.sendIcp(
        new BigNumber(needTransferToken1)
          .div(10 ** this.tokens[token1Id].decimals)
          .toString(10),
        this.depositAccount[1]
      );
      if (!block) {
        this.$message.error('Error');
        loading.close();
        return;
      }
    }
    try {
      const res = await this.makerPoolService.add(
        poolId,
        BigInt(token0Amount),
        BigInt(token1Amount)
      );
      if (res) {
        this.$message.success('Success');
        this.initAdd();
        this.getPoolInfo(poolId);
        this.poolStats(poolId);
        this.getAccountShares(poolId);
      } else {
        this.getPoolInfo(poolId);
        this.$message.error('Error');
      }
    } catch (e) {
      console.log(e);
      if (toHttpRejectError(e).includes('401')) {
        this.$message.error(
          'The system is processing, please try again later.'
        );
      } else if (toHttpRejectError(e).includes('410')) {
        this.$message.error(toHttpRejectError(e));
      } else if (toHttpRejectError(e).includes('411')) {
        this.$message.error(toHttpRejectError(e));
      } else {
        this.$message.error('Error');
      }
    }
    loading.close();
  }
  private initAdd(): void {
    this.token0Amount = '';
    this.token1Amount = '';
    this.shares = '0';
  }
  private initRemove(): void {
    this.removeShares = '';
    this.sharesValue0 = '0';
    this.sharesValue1 = '0';
  }
  private async transferIcrc1(
    tokenId: string,
    amount: bigint,
    to: Icrc1Account
  ): Promise<boolean> {
    const currentDrc20Token = new DRC20TokenService();
    const res = await currentDrc20Token.icrc1Transfer(tokenId, amount, to);
    if (res) {
      return Object.keys(res)[0] !== 'Err';
    }
  }
  private async approve(
    tokenId: string,
    tokenStd: string,
    amount: bigint
  ): Promise<boolean> {
    const poolId = this.$route.params.poolId;
    if (tokenStd.toLocaleLowerCase() === 'drc20') {
      try {
        const currentDrc20Token = new DRC20TokenService();
        const res = await currentDrc20Token.drc20Approve(
          amount,
          [],
          poolId,
          [],
          0,
          tokenId
        );
        if (
          (
            res as {
              ok: Txid;
            }
          ).ok
        ) {
          return true;
        } else {
          this.$message.error((res as TxnResultErr).err.message);
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    } else if (tokenStd.toLocaleLowerCase() === 'icrc2') {
      try {
        const currentDrc20Token = new DRC20TokenService();
        const res = await currentDrc20Token.icrc2_approve(
          tokenId,
          {
            owner: Principal.fromText(poolId),
            subaccount: []
          },
          amount
        );
        if (
          (
            res as {
              Ok: bigint;
            }
          ).Ok
        ) {
          return true;
        } else {
          const err = Object.keys(
            (
              res as {
                Err: ApproveError;
              }
            ).Err
          )[0];
          this.$message.error(err);
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
  private async getPool(poolId: string): Promise<void> {
    this.getPoolInfo(poolId);
    this.poolStats(poolId);
    this.getAccountShares(poolId);
    console.log(this.pool);
    window.clearInterval(this.timer);
    this.timer = null;
    this.timer = window.setInterval(() => {
      this.getPoolInfo(poolId);
      this.poolStats(poolId);
      this.getAccountShares(poolId);
    }, 10 * 1000);
  }
  private async getPairPrice(pair: string): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICDexService.stats(pair);
      if (res && res.stats) {
        this.pairPrice = res.stats.price;
      }
    }
    console.log(this.pairPrice);
  }
  private async getPairInfo(pair: string): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICDexService.info(pair);
      if (res && res.pairInfo) {
        this.pairInfo = res.pairInfo;
      }
    }
  }
  private async getPairVol(pair: string): Promise<void> {
    if (this.getPrincipalId) {
      const res = await this.ICDexService.liquidity(pair, [
        this.getPrincipalId
      ]);
      if (res && res.tokenLiquidity) {
        this.pairVol = res.tokenLiquidity.vol.value1.toString(10);
      }
    }
  }
  private async getAccountVolUsed(): Promise<void> {
    const poolId = this.$route.params.poolId;
    if (this.getPrincipalId) {
      const res = await this.makerPoolService.getAccountVolUsed(
        poolId,
        this.getPrincipalId
      );
      if (res !== null) {
        this.volUsed = res.toString(10);
      }
    }
  }
  private async getDepositAccount(): Promise<void> {
    const poolId = this.$route.params.poolId;
    this.depositAccount = await this.makerPoolService.getDepositAccount(
      poolId,
      this.getPrincipalId
    );
    console.log(this.depositAccount);
  }
  private async getPoolInfo(poolId: string): Promise<void> {
    const res = await this.makerPoolService.info(poolId);
    this.getPairVol(res.pairInfo.pairPrincipal.toString());
    this.getPairInfo(res.pairInfo.pairPrincipal.toString());
    if (!res.initialized) {
      this.getPairPrice(res.pairInfo.pairPrincipal.toString());
    }
    this.getAccountVolUsed();
    this.$set(this.pool, 1, res);
    if (res) {
      const token0 = res.pairInfo.token0[0];
      const token0Std = res.pairInfo.token0[2];
      const token1 = res.pairInfo.token1[0];
      const token1Std = res.pairInfo.token1[2];
      if (!this.tokens[token0.toString()]) {
        const token0Info = await getTokenInfo(token0, token0Std);
        this.$set(this.tokens, token0.toString(), token0Info);
      } else if (!this.tokens[token0.toString()].logo) {
        getTokenLogo(token0, this.tokens[token0.toString()].tokenStd).then(
          (logo) => {
            if (logo) {
              this.$set(this.tokens[token0.toString()], 'logo', logo);
            }
          }
        );
      }
      if (!this.tokens[token1.toString()]) {
        const token1Info = await getTokenInfo(token1, token1Std);
        this.$set(this.tokens, token1.toString(), token1Info);
      } else if (!this.tokens[token1.toString()].logo) {
        getTokenLogo(token1, this.tokens[token1.toString()].tokenStd).then(
          (logo) => {
            if (logo) {
              this.$set(this.tokens[token1.toString()], 'logo', logo);
            }
          }
        );
      }
      this.token0fee = new BigNumber(
        getFee(this.tokens[token0.toString()]).toString(10)
      )
        .div(10 ** this.tokens[token0.toString()].decimals)
        .toString(10);
      this.token1fee = new BigNumber(
        getFee(this.tokens[token1.toString()]).toString(10)
      )
        .div(10 ** this.tokens[token1.toString()].decimals)
        .toString(10);
      this.getTokenBalance(
        token0.toString(),
        this.tokens[token0.toString()].tokenStd
      );
      this.getTokenBalance(
        token1.toString(),
        this.tokens[token1.toString()].tokenStd
      );
    }
  }
  private async poolStats(poolId: string): Promise<void> {
    const res = await this.makerPoolService.stats2(poolId);
    this.$set(this.pool, 2, res);
  }
  private getAvailable(
    pool: [string?, PoolInfo?, PoolStats?, [bigint, ShareWeighted]?]
  ): string {
    const token1 = this.tokens[pool[1].pairInfo.token1[0].toString()];
    // const utilized = this.getUtilized(pool);
    return (
      new BigNumber(this.pairVol)
        .times(pool[1].volFactor.toString(10))
        .div(10 ** token1.decimals)
        // .minus(utilized)
        .decimalPlaces(8, 1)
        .toString(10)
    );
  }
  private showCapThreshold(
    pool: [string?, PoolInfo?, PoolStats?, [bigint, ShareWeighted]?]
  ): boolean {
    if (pool && pool[1] && pool[2]) {
      return new BigNumber(pool[2].poolBalance.balance1.toString(10)).lt(
        pool[1].poolThreshold.toString(10)
      );
    }
    return true;
  }
  private async getAccountShares(poolId: string): Promise<void> {
    const res = await this.makerPoolService.getAccountShares(
      poolId,
      this.getPrincipalId
    );
    this.$set(this.pool, 3, res);
  }
  private token0AmountChange(): void {
    if (this.token0Amount) {
      const token0decimals =
        this.tokens[this.pool[1].pairInfo.token0[0].toString()].decimals;
      const token1decimals =
        this.tokens[this.pool[1].pairInfo.token1[0].toString()].decimals;
      if (this.pool[1] && !this.pool[1].initialized && this.pairPrice) {
        const price = new BigNumber(this.pairPrice)
          .times(10 ** token0decimals)
          .div(10 ** token1decimals);
        this.token1Amount = price
          .times(this.token0Amount)
          .decimalPlaces(token1decimals)
          .toString(10);
      } else if (this.pool[2] && this.pool[2].poolShares) {
        this.token1Amount = new BigNumber(
          this.pool[2].poolBalance.balance1.toString(10)
        )
          .div(10 ** token1decimals)
          .times(10 ** token0decimals)
          .div(this.pool[2].poolBalance.balance0.toString(10))
          .times(this.token0Amount)
          .decimalPlaces(token1decimals)
          .toString(10);
      }
    } else {
      this.token1Amount = '';
    }
    if (this.pool[2] && this.pool[2].poolShares) {
      this.getShares();
    }
  }
  private token1AmountChange(): void {
    if (this.token1Amount) {
      const token0decimals =
        this.tokens[this.pool[1].pairInfo.token0[0].toString()].decimals;
      const token1decimals =
        this.tokens[this.pool[1].pairInfo.token1[0].toString()].decimals;
      if (this.pool[1] && !this.pool[1].initialized && this.pairPrice) {
        const price = new BigNumber(this.pairPrice)
          .times(10 ** token0decimals)
          .div(10 ** token1decimals);
        this.token0Amount = new BigNumber(this.token1Amount)
          .div(price)
          .decimalPlaces(token1decimals)
          .toString(10);
      } else if (this.pool[2] && this.pool[2].poolShares) {
        this.token0Amount = new BigNumber(
          this.pool[2].poolBalance.balance0.toString(10)
        )
          .div(10 ** token0decimals)
          .times(10 ** token1decimals)
          .div(this.pool[2].poolBalance.balance1.toString(10))
          .times(this.token1Amount)
          .decimalPlaces(token0decimals)
          .toString(10);
      }
    } else {
      this.token0Amount = '';
    }
    if (this.pool[2] && this.pool[2].poolShares) {
      this.getShares();
    }
  }
  private sharesChange(): void {
    if (this.removeShares) {
      const token0 = this.pool[1].pairInfo.token0[0].toString();
      const token1 = this.pool[1].pairInfo.token1[0].toString();
      const token0fee = new BigNumber(
        getFee(this.tokens[token0.toString()]).toString(10)
      );
      const token1fee = new BigNumber(
        getFee(this.tokens[token1.toString()]).toString(10)
      );
      const decimals0 =
        this.tokens[this.pool[1].pairInfo.token0[0].toString()].decimals;
      const decimals1 =
        this.tokens[this.pool[1].pairInfo.token1[0].toString()].decimals;
      const rate0 = new BigNumber(this.pool[2].poolShares.toString(10)).div(
        this.pool[2].poolBalance.balance0.toString(10)
      );
      const rate1 = new BigNumber(this.pool[2].poolShares.toString(10)).div(
        this.pool[2].poolBalance.balance1.toString(10)
      );
      // Fee: 10 * tokenFee + 0.01% * Value
      this.sharesValue0 = new BigNumber(
        this.pool[2].poolBalance.balance0.toString(10)
      )
        .minus(
          new BigNumber(this.pool[2].poolShares.toString(10))
            .div(10 ** this.pool[1].shareDecimals)
            .minus(this.removeShares)
            .times(10 ** this.pool[1].shareDecimals)
            .div(rate0)
        )
        .minus(new BigNumber(token0fee).times(10))
        .times(1 - 0.01 / 100)
        .div(10 ** decimals0)
        .decimalPlaces(decimals0)
        .toString(10);
      if (new BigNumber(this.sharesValue0).lt(0)) {
        this.sharesValue0 = '0';
      }
      this.sharesValue1 = new BigNumber(
        this.pool[2].poolBalance.balance1.toString(10)
      )
        .minus(
          new BigNumber(this.pool[2].poolShares.toString(10))
            .div(10 ** this.pool[1].shareDecimals)
            .minus(this.removeShares)
            .times(10 ** this.pool[1].shareDecimals)
            .div(rate1)
        )
        .minus(new BigNumber(token1fee).times(10))
        .times(1 - 0.01 / 100)
        .div(10 ** decimals1)
        .decimalPlaces(decimals1)
        .toString(10);
      if (new BigNumber(this.sharesValue1).lt(0)) {
        this.sharesValue1 = '0';
      }
    } else {
      this.sharesValue0 = '0';
      this.sharesValue1 = '0';
    }
  }
  private getShares(): void {
    if (this.token0Amount && this.token1Amount) {
      const token1Balance = this.pool[2].poolBalance.balance1.toString(10);
      const token1Decimals =
        this.tokens[this.pool[1].pairInfo.token1[0].toString()].decimals;
      const token1Amount = new BigNumber(this.token1Amount).times(
        10 ** token1Decimals
      );
      const totalAmount = new BigNumber(token1Amount).plus(token1Balance);
      const poolShares = this.pool[2].poolShares.toString(10);
      this.shares = new BigNumber(poolShares)
        .div(token1Balance)
        .times(totalAmount)
        .minus(poolShares)
        .div(10 ** this.pool[1].shareDecimals)
        .decimalPlaces(this.pool[1].shareDecimals)
        .toString(10);
    } else {
      this.shares = '0';
    }
  }
  private async getTokenBalance(
    tokenId: string,
    tokenStd: TokenStd
  ): Promise<void> {
    const balance = await getTokenBalance(tokenStd, tokenId);
    if (balance) {
      this.$set(this.tokensBalance, tokenId, balance);
    }
  }
  private setMaxAmount(tokenId: string, t: string): void {
    const tokenStd = Object.keys(this.tokens[tokenId].tokenStd)[0];
    if (t === 'token0') {
      let token0fee = new BigNumber(this.token0fee).times(2).toString(10);
      if (
        tokenStd.toLocaleLowerCase() === 'drc20' ||
        tokenStd.toLocaleLowerCase() === 'icrc2'
      ) {
        token0fee = new BigNumber(this.token0fee).plus(token0fee).toString(10);
      }
      this.token0Amount = new BigNumber(this.tokensBalance[tokenId])
        .div(10 ** this.tokens[tokenId].decimals)
        .minus(token0fee)
        .toString(10);
      if (new BigNumber(this.token0Amount).lt(0)) {
        this.token0Amount = '0';
      }
      this.token0AmountChange();
    } else {
      let token1fee = new BigNumber(this.token1fee).times(2).toString(10);
      if (
        tokenStd.toLocaleLowerCase() === 'drc20' ||
        tokenStd.toLocaleLowerCase() === 'icrc2'
      ) {
        token1fee = new BigNumber(this.token1fee).plus(token1fee).toString(10);
      }
      this.token1Amount = new BigNumber(this.tokensBalance[tokenId])
        .div(10 ** this.tokens[tokenId].decimals)
        .minus(token1fee)
        .toString(10);
      if (new BigNumber(this.token1Amount).lt(0)) {
        this.token1Amount = '0';
      }
      this.token1AmountChange();
    }
  }
  private setMaxShares(): void {
    const max = new BigNumber(this.pool[3][0].toString(10))
      .div(10 ** this.pool[1].shareDecimals)
      .toString(10);
    const maxCanRemove = new BigNumber(this.pool[2].poolShares.toString(10))
      .div(10 ** this.pool[1].shareDecimals)
      .decimalPlaces(this.pool[1].shareDecimals)
      .toString(10);
    if (new BigNumber(max).gt(maxCanRemove)) {
      this.removeShares = maxCanRemove;
    } else {
      this.removeShares = max;
    }
    this.sharesChange();
  }
  private connectWallet(): void {
    this.$router.push({
      path: '/login',
      query: { redirect: this.$route.fullPath }
    });
  }
  private changeType(type: 'Add' | 'Remove') {
    if (this.type !== type) {
      this.type = type;
      if (type === 'Add') {
        this.initRemove();
      }
      if (type === 'Remove') {
        this.initAdd();
      }
    }
  }
  private back(): void {
    const poolId = this.$route.params.poolId;
    this.$router.replace(`/ICDex/pools?id=${poolId}`);
  }
}
</script>

<style scoped lang="scss">
.pool-item-l {
  display: flex;
  margin-bottom: 10px;
  > div {
    display: flex;
    flex-direction: column;
    width: 220px;
    &.pool-item-l-net {
      width: 100%;
      .font12 {
        font-size: 12px;
      }
    }
    .base-color-w {
      font-size: 16px;
    }
  }
}
.pool-item-title {
  margin: 20px 0 10px;
  color: #fff;
  font-size: 16px;
}
.pool-header {
  display: flex;
  align-items: center;
  button {
    width: 80px;
  }
}
.pool-apy {
  display: flex;
  justify-content: flex-start;
  margin-top: 5px;
  color: #666c7e;
  .pool-apy-item {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    line-height: 1.5;
  }
}
.home-header {
  margin-top: 14px;
}
.pool-info {
  width: 690px;
  margin: 50px auto 0;
  border-radius: 4px;
  color: #747884;
}
.pool-item {
  background: #141b23;
  border: 1px solid #313b46;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  border-radius: 9px;
  padding: 30px 35px;
  color: #adb3c4;
  line-height: 1.2;
  .swap-item-top-right-remove {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 310px;
    margin-left: auto;
  }
}
.max-amount {
  color: #1996c4;
  cursor: pointer;
}
.exchange-swap-item-top {
  display: flex;
  align-items: center;
  ::v-deep {
    input {
      width: 310px;
    }
  }
}
.you-get-shares {
  font-size: 20px;
}
.add-liquidity-icon .swap-icon {
  transform: rotate(0);
}
.exchange-swap-item-bottom {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.back-arrow {
  margin-bottom: 10px;
  color: #bababa;
  font-size: 18px;
}
.pc-show {
  display: flex;
}
.h5-show {
  display: none;
}
@media screen and (max-width: 768px) {
  .pc-show {
    display: none;
  }
  .h5-show {
    display: flex;
  }
  .pool-item {
    padding: 15px 10px;
    .swap-item-top-right-remove {
      width: auto;
    }
  }
  .pool-info {
    width: 100%;
    padding: 0 10px 20px;
  }
  .pool-item-l {
    &.pool-item-l-shares {
      flex-direction: column;
    }
    > div {
      .base-color-w {
        font-size: 12px;
      }
    }
  }
  .exchange-swap-item-top {
    ::v-deep input {
      width: auto;
    }
  }
}
</style>
