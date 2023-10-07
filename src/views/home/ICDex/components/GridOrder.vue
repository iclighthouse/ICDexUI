<template>
  <div>
    <a-modal
      v-model="visibleGridOrder"
      :title="type === 'create' ? 'Create Grid Order' : 'Update Grid Order'"
      centered
      width="650px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="transfer-modal"
      :after-close="afterClose"
    >
      <div class="grid-setting">
        <div class="grid-setting-item">
          <div class="grid-setting-item-title base-font-title">
            1. Price Range
          </div>
          <div class="grid-setting-price-range">
            <div>
              <a-input
                :key="buyUnit"
                v-model="lower"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Lower"
                v-only-float="buyUnit"
              />
            </div>
            &nbsp;-&nbsp;
            <div>
              <a-input
                :key="buyUnit"
                v-model="upper"
                class="input-icp-suffix"
                autocomplete="off"
                type="text"
                placeholder="Upper"
                v-only-float="buyUnit"
              />
            </div>
          </div>
          <span v-show="insufficientPrice" class="base-red">
            Upper price must be higher than lower price.
          </span>
        </div>
        <div class="grid-setting-item">
          <div class="grid-setting-item-title base-font-title">
            2. Spread
            <a-dropdown placement="bottomCenter">
              <a-tooltip placement="top">
                <template slot="title">
                  <div v-show="spread === gridMenu.Arithmetic">
                    Arithmetic: Each grid has an equal price difference.
                  </div>
                  <div v-show="spread === gridMenu.Geometric">
                    Geometric: Each grid has an ratio price difference.
                  </div>
                </template>
                <span class="pointer margin-left-auto" style="color: #51b7c3">
                  {{ spread }} <a-icon type="caret-down" />
                </span>
              </a-tooltip>
              <a-menu slot="overlay" class="strat-list">
                <a-menu-item
                  v-for="(item, index) in gridMenu"
                  :key="index"
                  class="strat-list-item"
                  :class="{ active: item === spread }"
                  @click="changeSpread(item)"
                >
                  {{ item }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div v-show="spread === gridMenu.Arithmetic">
            <a-input
              v-if="currentPair"
              :key="buyUnit"
              v-model="arithmetic"
              class="input-icp-suffix"
              autocomplete="off"
              type="text"
              placeholder="Arithmetic"
              v-only-float="buyUnit"
              :suffix="currentPair[1][0].token1[1]"
            />
          </div>
          <div v-show="spread === gridMenu.Geometric">
            <a-input
              v-model="geometric"
              class="input-icp-suffix"
              autocomplete="off"
              type="text"
              placeholder="Geometric"
              v-only-float="3"
              suffix="%"
            />
            <span v-show="Number(geometric) > 100" class="base-red">
              Max ratio is 100.
            </span>
          </div>
        </div>
        <div class="grid-setting-item">
          <div class="grid-setting-item-title base-font-title">
            3. Amount
            <a-dropdown placement="bottomCenter">
              <span class="pointer margin-left-auto" style="color: #51b7c3"
                ><span v-show="investment === gridAmountMenu.Percent">
                  {{ investment }}
                </span>
                <span
                  v-if="currentPair && investment === gridAmountMenu.Token0"
                >
                  {{ currentPair[1][0].token0[1] }}
                </span>
                <span
                  v-if="currentPair && investment === gridAmountMenu.Token1"
                >
                  {{ currentPair[1][0].token1[1] }}
                </span>
                <a-icon type="caret-down"
              /></span>
              <a-menu slot="overlay" class="strat-list">
                <a-menu-item
                  v-for="(item, index) in gridAmountMenu"
                  :key="index"
                  class="strat-list-item"
                  :class="{ active: item === investment }"
                  @click="changeInvestment(item)"
                >
                  <span v-show="item === gridAmountMenu.Percent">
                    {{ item }}
                  </span>
                  <span v-if="currentPair && item === gridAmountMenu.Token0">
                    {{ currentPair[1][0].token0[1] }}
                  </span>
                  <span v-if="currentPair && item === gridAmountMenu.Token1">
                    {{ currentPair[1][0].token1[1] }}
                  </span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div v-show="investment === gridAmountMenu.Percent">
            <a-input
              v-model="percent"
              autocomplete="off"
              placeholder="Percent (optional)"
              suffix="%"
              v-only-float="3"
            />
            <span v-show="Number(percent) > 100" class="base-red">
              Max percent is 100.
            </span>
          </div>
          <div v-show="investment === gridAmountMenu.Token0">
            <!--<span class="base-font-title">
              PairAccount:
              <span
                v-if="
                  currentPair &&
                  keepingBalance &&
                  tokens &&
                  tokens[currentPair[1][0].token0[0].toString()]
                "
              >
                {{
                  keepingBalance[currentPair[1][0].token0[0].toString()]
                    | bigintToFloat(
                      tokens[currentPair[1][0].token0[0].toString()].decimals,
                      tokens[currentPair[1][0].token0[0].toString()].decimals
                    )
                    | formatNum
                }}
                {{ currentPair[1][0].token0[1] }}
              </span>
              <a-icon
                type="plus-circle"
                @click="onDepositKeepingBalance(currentPair[1][0].token0)"
              />
            </span>-->
            <a-input
              v-if="currentPair"
              :key="tokenMinUnit"
              v-model="amount"
              class="input-icp-suffix"
              autocomplete="off"
              type="text"
              placeholder="Amount"
              v-only-float="tokenMinUnit"
              :suffix="currentPair[1][0].token0[1]"
            />
            <span v-show="insufficientToken0" class="base-red">
              Insufficient {{ currentPair[1][0].token0[1] }}
            </span>
          </div>
          <div v-show="investment === gridAmountMenu.Token1">
            <!--<span class="base-font-title"
              >PairAccount:
              <span
                v-if="
                  currentPair &&
                  keepingBalance &&
                  tokens &&
                  tokens[currentPair[1][0].token1[0].toString()]
                "
              >
                {{
                  keepingBalance[currentPair[1][0].token1[0].toString()]
                    | bigintToFloat(
                      tokens[currentPair[1][0].token1[0].toString()].decimals,
                      tokens[currentPair[1][0].token1[0].toString()].decimals
                    )
                    | formatNum
                }}
                {{ currentPair[1][0].token1[1] }}
              </span>
              <a-icon
                type="plus-circle"
                @click="
                  onDepositKeepingBalance(currentPair[1][0].token1, false)
                "
              />
            </span>-->
            <a-input
              v-if="currentPair"
              :key="buyUnit"
              v-model="amount"
              class="input-icp-suffix"
              autocomplete="off"
              type="text"
              placeholder="Amount"
              v-only-float="buyUnit"
              :suffix="currentPair[1][0].token1[1]"
            />
            <span v-show="insufficientToken1" class="base-red">
              Insufficient {{ currentPair[1][0].token1[1] }}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="primary large-primary w100 mt20"
        :disabled="canSubmit"
        @click="onSubmit"
      >
        Submit
      </button>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  DePairs,
  GridModeEnum,
  GridModeMenu,
  GridAmountEnum,
  GridAmountMenu
} from '@/views/home/ICDex/model';
import { TokenInfo } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';
import {
  AccountSetting,
  GridOrderConfig,
  GridOrderConfigAmount,
  GridOrderConfigUpdate,
  Ppm,
  STOrder,
  STStatus
} from '@/ic/ICDex/model';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { toHttpRejectError } from '@/ic/httpError';
import { fromSubAccountId, principalToAccountIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
const ProSubaccountId = 1;

@Component({
  name: 'GridOrder',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Array, default: () => [] })
  private currentPair!: DePairs;
  @Prop({ type: Object, default: () => null })
  private keepingBalance!: { [key: string]: string };
  @Prop({ type: BigInt, default: BigInt(0) })
  private unit!: bigint;
  @Prop({ type: Number, default: 0 })
  private buyUnit!: number;
  @Prop({ type: Number, default: 0 })
  private tokenMinUnit!: number;
  @Prop({ type: Object, default: () => null })
  private tokens!: { [key: string]: TokenInfo };
  private type = 'create';
  private soid: bigint;
  private status: STStatus;
  private visibleGridOrder = false;
  private lower = '';
  private upper = '';
  private gridMenu = GridModeEnum;
  private spread: GridModeMenu = GridModeEnum.Arithmetic;
  private gridAmountMenu = GridAmountEnum;
  private investment: GridAmountMenu = GridAmountEnum.Token1;
  private percent = '';
  private amount = '';
  private arithmetic = '';
  private geometric = '';
  private insufficientToken0 = false;
  private insufficientToken1 = false;
  get insufficientPrice(): boolean {
    if (this.upper && this.lower) {
      return new BigNumber(this.upper).lte(this.lower);
    }
    return false;
  }
  get canSubmit(): boolean {
    let flag = false;
    if (!this.lower) {
      flag = true;
    }
    if (!this.upper) {
      flag = true;
    }
    if (new BigNumber(this.upper).lte(this.lower)) {
      flag = true;
    }
    if (this.spread === GridModeEnum.Geometric) {
      if (new BigNumber(this.geometric).gt(100) || !this.geometric) {
        flag = true;
      }
    } else if (this.spread === GridModeEnum.Arithmetic) {
      if (!this.arithmetic) {
        flag = true;
      }
    }
    if (this.investment === GridAmountEnum.Percent) {
      if (new BigNumber(this.percent).gt(100) || !this.percent) {
        flag = true;
      }
    } else if (this.investment === GridAmountEnum.Token0) {
      if (!this.amount) {
        flag = true;
      }
    } else if (this.investment === GridAmountEnum.Token1) {
      if (!this.amount) {
        flag = true;
      }
    }
    return flag;
  }
  private update(item: STOrder): void {
    this.type = 'update';
    this.soid = item.soid;
    this.status = item.status;
    console.log(item);
    const setting = item.strategy.GridOrder.setting;
    const decimals =
      this.tokens[this.currentPair[1][0].token1[0].toString()].decimals;
    const token0Decimals =
      this.tokens[this.currentPair[1][0].token0[0].toString()].decimals;
    this.lower = new BigNumber(setting.lowerLimit.toString(10))
      .div(10 ** decimals)
      .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
      .toString(10);
    this.upper = new BigNumber(setting.upperLimit.toString(10))
      .div(10 ** decimals)
      .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
      .toString(10);
    const spread = Object.keys(setting.spread)[0];
    const spreadValue = Object.values(setting.spread)[0];
    if (spread === 'Geom') {
      this.spread = GridModeEnum.Geometric;
      this.geometric = new BigNumber(spreadValue.toString())
        .div(10 ** 6)
        .times(100)
        .toString(10);
    } else if (spread === 'Arith') {
      this.spread = GridModeEnum.Arithmetic;
      this.arithmetic = new BigNumber(spreadValue.toString())
        .div(10 ** decimals)
        .div(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
        .toString(10);
    }
    const investment = Object.keys(setting.amount)[0];
    const investmentValue = Object.values(setting.amount)[0];
    if (investment === GridAmountEnum.Percent) {
      this.investment = GridAmountEnum.Percent;
      if (investmentValue && investmentValue.length) {
        this.percent = new BigNumber(investmentValue[0].toString())
          .div(10 ** 6)
          .times(100)
          .toString(10);
      }
    } else if (investment === GridAmountEnum.Token0) {
      this.investment = GridAmountEnum.Token0;
      this.amount = new BigNumber(investmentValue.toString())
        .div(10 ** token0Decimals)
        .toString(10);
    } else if (investment === GridAmountEnum.Token1) {
      this.investment = GridAmountEnum.Token1;
      this.amount = new BigNumber(investmentValue.toString())
        .div(10 ** decimals)
        .toString(10);
    }
    this.visibleGridOrder = true;
  }
  private changeInvestment(item: GridAmountEnum): void {
    this.percent = '';
    this.amount = '';
    this.investment = item;
  }
  private changeSpread(item: GridModeMenu): void {
    this.arithmetic = '';
    this.geometric = '';
    this.spread = item;
  }
  private async onSubmit(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const setting = await this.getAccountSetting();
    if (!setting.enPoolMode || !setting.enKeepingBalance) {
      const currentICDexService = new ICDexService();
      await currentICDexService.accountConfig(
        this.currentPair[0].toString(),
        { PoolMode: null },
        true,
        ProSubaccountId
      );
    }
    const token1 = this.currentPair[1][0].token1;
    const token0 = this.currentPair[1][0].token0;
    const token1Decimals = this.tokens[token1[0].toString()].decimals;
    const token0Decimals = this.tokens[token0[0].toString()].decimals;
    const lowerLimit = new BigNumber(this.lower)
      .times(10 ** token1Decimals)
      .times(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
      .toString(10);
    const upperLimit = new BigNumber(this.upper)
      .times(10 ** token1Decimals)
      .times(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
      .toString(10);
    let spread:
      | {
          Geom: Ppm;
        }
      | { Arith: bigint } = null;
    if (this.spread === GridModeEnum.Arithmetic) {
      const arith = new BigNumber(this.arithmetic)
        .times(10 ** token1Decimals)
        .times(new BigNumber(this.unit.toString(10)).div(10 ** token0Decimals))
        .toString(10);
      spread = {
        Arith: BigInt(arith)
      };
    } else {
      const geom = new BigNumber(this.geometric)
        .times(10 ** 6)
        .div(100)
        .toString(10);
      spread = {
        Geom: BigInt(geom)
      };
    }
    let amount: GridOrderConfigAmount = null;
    if (this.investment === GridAmountEnum.Percent) {
      if (this.percent) {
        const percent = new BigNumber(this.percent)
          .times(10 ** 6)
          .div(100)
          .toString(10);
        amount = {
          Percent: [BigInt(percent)]
        };
      } else {
        amount = {
          Percent: []
        };
      }
    } else if (this.investment === GridAmountEnum.Token0) {
      const token0 = new BigNumber(this.amount)
        .times(10 ** token0Decimals)
        .toString(10);
      amount = {
        Token0: BigInt(token0)
      };
    } else if (this.investment === GridAmountEnum.Token1) {
      const token1 = new BigNumber(this.amount)
        .times(10 ** token1Decimals)
        .toString(10);
      amount = {
        Token1: BigInt(token1)
      };
    }
    const currentICDexService = new ICDexService();
    const gridOrderConfig: GridOrderConfig = {
      lowerLimit: BigInt(lowerLimit),
      upperLimit: BigInt(upperLimit),
      spread: spread,
      amount: amount
    };
    console.log(gridOrderConfig);
    try {
      let res;
      if (this.type === 'create') {
        console.log('sto_createProOrder');
        res = await currentICDexService.sto_createProOrder(
          this.currentPair[0].toString(),
          {
            GridOrder: gridOrderConfig
          },
          ProSubaccountId
        );
      } else {
        console.log('sto_updateProOrder');
        const gridOrderConfigUpdate: GridOrderConfigUpdate = {
          status: [],
          lowerLimit: [BigInt(lowerLimit)],
          upperLimit: [BigInt(upperLimit)],
          spread: [spread],
          amount: [amount]
        };
        res = await currentICDexService.sto_updateProOrder(
          this.currentPair[0].toString(),
          this.soid,
          {
            GridOrder: gridOrderConfigUpdate
          },
          ProSubaccountId
        );
      }
      if (res) {
        this.$message.success('Success');
        this.visibleGridOrder = false;
        this.$emit('createProOrderSuccess');
      } else {
        this.$message.error('Error');
      }
    } catch (e) {
      console.log(e);
      if (toHttpRejectError(e)) {
        this.$message.error(toHttpRejectError(e));
      } else {
        this.$message.error('Error');
      }
    }
    loading.close();
  }
  private async getAccountSetting(): Promise<AccountSetting> {
    const currentICDexService = new ICDexService();
    const currentPair = this.currentPair[0].toString();
    const principal = localStorage.getItem('principal');
    const res = await currentICDexService.accountSetting(
      currentPair,
      principalToAccountIdentifier(
        Principal.fromText(principal),
        new Uint8Array(fromSubAccountId(ProSubaccountId))
      )
    );
    if (res && res.pairId === this.currentPair[0].toString()) {
      return res.accountSetting;
    }
  }
  private afterClose(): void {
    this.lower = '';
    this.upper = '';
    this.spread = GridModeEnum.Arithmetic;
    this.investment = GridAmountEnum.Percent;
    this.percent = '';
    this.amount = '';
    this.arithmetic = '';
    this.geometric = '';
  }
}
</script>

<style scoped lang="scss">
.grid-setting-item-title {
  display: flex;
  align-items: center;
  padding: 15px 0 5px;
}
.grid-setting-price-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    width: 250px;
  }
}
.grid-setting-item-mode {
  width: 250px;
}
span.base-font-title {
  font-size: 12px;
}
@media screen and (max-width: 768px) {
  .grid-setting-price-range {
    input {
      width: 100%;
    }
  }
}
</style>
