<template>
  <a-modal
    v-model="kLineVisible"
    width="800px"
    centered
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    :after-close="close"
    class="delete-modal k-line-modal"
  >
    <ul class="k-interval-time">
      <li
        :class="{ active: currentKInterval.value === item.value }"
        v-for="(item, index) in kIntervalList"
        :key="index"
        @click="changeKIntervalList(item)"
      >
        <span>{{ item.value }}</span>
      </li>
    </ul>
    <div
      v-loading="chartSpinning"
      element-loading-background="rgba(0, 0, 0, 0)"
    >
      <div id="kInterval-chart" ref="kIntervalChart"></div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { Chart, dispose, init } from 'klinecharts';
import { KBar, TokenType } from '@/ic/ICDex/model';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import { CYCLES_FINANCE_CANISTER_ID } from '@/ic/utils';
import { TokenInfo } from '@/ic/common/icType';
import { DexInfo, TokenStd } from '@/ic/ICSwap/model';
import { Principal } from '@dfinity/principal';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { KLData } from '@/views/home/ICDex/model';

@Component({
  name: 'kLine',
  components: {}
})
export default class extends Vue {
  @Prop({ type: String, default: '' })
  public swapId!: string;
  @Prop({ type: Object, default: null })
  public dexInfo!: DexInfo;
  private kLineVisible = false;
  private KIntervals: Array<KBar> = [];
  private kLineChart: Chart;
  private kIntervalList = [
    {
      value: 'Time',
      key: 60 // seconds
    },
    {
      value: '5m',
      key: 5 * 60
    },
    {
      value: '1H',
      key: 60 * 60
    },
    {
      value: '1D',
      key: 24 * 60 * 60
    },
    {
      value: '1W',
      key: 7 * 24 * 60 * 60
    }
  ];
  private currentKInterval = {
    value: '1H',
    key: 60 * 60
  };
  private chartSpinning = false;
  private tokens: { [key: string]: TokenInfo };
  private isH5 = false;
  private init(): void {
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
    this.currentKInterval = {
      value: '1H',
      key: 60 * 60
    };
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (this.swapId) {
      this.getQuotes();
    }
    this.$nextTick(() => {
      this.resetChart();
    });
  }
  private async getQuotes(): Promise<void> {
    this.chartSpinning = true;
    try {
      const swapService = new ICDexService();
      const KIntervals = await swapService.getQuotes(
        this.swapId,
        BigInt(this.currentKInterval.key)
      );
      if (KIntervals.paidId === this.swapId) {
        this.KIntervals = KIntervals.quotes.slice().reverse();
        console.log(this.KIntervals);
        this.initEcharts();
      }
    } catch (e) {
      console.log(e);
    }
    this.chartSpinning = false;
  }
  private resetChart(): void {
    let style = {
      candle: {
        margin: {
          top: 0.3,
          bottom: 0.1
        },
        tooltip: {
          labels: ['', 'Open: ', 'Close: ', 'High: ', 'Low: '],
          text: {
            color: '#848E9C',
            marginLeft: 8,
            marginTop: 6,
            marginRight: 0
          }
        },
        priceMark: {
          high: {
            color: '#AEB4BC'
          },
          low: {
            color: '#AEB4BC'
          },
          last: {
            downColor: '#D13651',
            upColor: '#21C77D',
            noChangeColor: '#D13651',
            line: {
              show: false
            }
          }
        }
      },
      grid: {
        show: true,
        horizontal: {
          show: true,
          size: 1,
          color: '#293137',
          // 'solid'|'dash'
          style: 'dash',
          dashValue: [2, 2]
        },
        vertical: {
          show: true,
          size: 1,
          color: '#293137',
          // 'solid'|'dash'
          style: 'dash',
          dashValue: [2, 2]
        }
      },
      xAxis: {
        axisLine: {
          show: true,
          color: '#474d57',
          size: 1
        },
        tickText: {
          color: '#5E6673'
        },
        tickLine: {
          color: '#474D57'
        }
      },
      yAxis: {
        axisLine: {
          show: true,
          color: '#474d57',
          size: 1
        },
        tickText: {
          color: '#5E6673'
        },
        tickLine: {
          color: '#474D57'
        }
      },
      separator: {
        size: 1,
        color: '#474d57',
        fill: true,
        activeBackgroundColor: 'rgba(230, 230, 230, .15)'
      },
      technicalIndicator: {
        height: 70,
        margin: {
          top: 0.2,
          bottom: 0
        },
        bar: {
          downColor: 'rgba(209, 54, 81, 0.4)',
          upColor: 'rgba(33, 199, 125, 0.4)',
          noChangeColor: 'rgba(209, 54, 81, 0.4)'
        }
      }
    };
    if (this.isH5) {
      (style.candle.tooltip as any).showRule = 'follow_cross';
      (style.candle.tooltip as any).showType = 'rect';
      (style.candle.tooltip as any).rect = {
        paddingLeft: 5,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 12,
        offsetLeft: 8,
        offsetTop: 8,
        offsetRight: 8,
        borderRadius: 4,
        borderSize: 1,
        color: '#848E9C',
        backgroundColor: '#000000',
        borderColor: '#000000'
      };
    }
    this.kLineChart = init('kInterval-chart', style);
    const VOLInfo = this.kLineChart.getTechnicalIndicatorTemplate('VOL');
    // const plot = VOLInfo.plots[3];
    // let plots = [];
    // let token0 = '';
    // let token1 = '';
    // let tokenId0 = this.getToken(
    //   this.dexInfo.token0[0],
    //   this.dexInfo.token0[1]
    // );
    // let tokenId1 = this.getToken(
    //   this.dexInfo.token1[0],
    //   this.dexInfo.token1[1]
    // );
    // if (tokenId0 === 'Cycles') {
    //   token0 = 'Cycles';
    // } else if (tokenId0 === 'ICP') {
    //   token0 = 'ICP';
    // } else if (this.tokens[tokenId0]) {
    //   token0 = this.tokens[tokenId0].symbol;
    // }
    // if (tokenId1 === 'Cycles') {
    //   token1 = 'Cycles';
    // } else if (tokenId1 === 'ICP') {
    //   token1 = 'ICP';
    // } else if (this.tokens[tokenId1]) {
    //   token1 = this.tokens[tokenId1].symbol;
    // }
    // const title0 = `Vol(${token0}): `;
    // const title1 = `Vol(${token1}): `;
    // plots = [
    //   Object.assign(JSON.parse(JSON.stringify(plot)), {
    //     title: title0,
    //     key: 'token0Vol'
    //   }),
    //   Object.assign(JSON.parse(JSON.stringify(plot)), {
    //     title: title1,
    //     key: 'token1Vol'
    //   })
    // ];
    // console.log(this.kLineChart.getTechnicalIndicatorTemplate(''));
    this.kLineChart.addTechnicalIndicatorTemplate(
      Object.assign(VOLInfo, {
        calcParams: [],
        plots: [VOLInfo.plots[3]],
        calcTechnicalIndicator: (kLineDataList, { plots }) => {
          return kLineDataList.map((kLineData) => {
            const ma = {};
            ma[JSON.parse(JSON.stringify(plots[0])).key] =
              kLineData.token0volume;
            ma[JSON.parse(JSON.stringify(plots[1])).key] =
              kLineData.token1volume;
            return ma;
          });
        }
      })
    );
    this.kLineChart.createTechnicalIndicator('VOL', false, {
      height: 50
    });
  }
  private filterLevelPrice(
    price: bigint,
    unitSize: bigint,
    token0Decimals: number,
    token1Decimals: number,
    buyUnit: number
  ): string {
    if (price) {
      return new BigNumber(price.toString())
        .div(10 ** token1Decimals)
        .div(new BigNumber(unitSize.toString()).div(10 ** token0Decimals))
        .toFixed(buyUnit);
    }
    return '';
  }
  private async initEcharts(): Promise<void> {
    if (this.currentKInterval.value === 'Time') {
      this.kLineChart.setStyleOptions({
        candle: {
          type: 'area',
          area: {
            lineSize: 1,
            lineColor: '#83b2e0',
            value: 'close',
            backgroundColor: [
              {
                offset: 0,
                color: 'rgba(33, 150, 243, 0)'
              },
              {
                offset: 1,
                color: 'rgba(33, 150, 243, 0)'
              }
            ]
          }
        }
      });
    } else {
      this.kLineChart.setStyleOptions({
        candle: {
          type: 'candle_solid',
          bar: {
            downColor: '#f6465d',
            upColor: '#10cb80',
            noChangeColor: '#f6465d'
          }
        }
      });
    }
    console.log(this.swapId);
    const type = Object.keys(this.dexInfo.mmType)[0];
    let unitSize;
    let buyUnit;
    let tokenMinUnit;
    let token0Decimals = 0;
    let token1Decimals = 0;
    let tokenId0 = this.getToken(
      this.dexInfo.token0[0],
      this.dexInfo.token0[1]
    );
    let tokenId1 = this.getToken(
      this.dexInfo.token1[0],
      this.dexInfo.token1[1]
    );
    if (tokenId0 === 'Cycles') {
      token0Decimals = 12;
    } else if (tokenId0 === 'ICP') {
      token0Decimals = 8;
    } else if (this.tokens[tokenId0]) {
      token0Decimals = this.tokens[tokenId0].decimals;
    }
    if (tokenId1 === 'Cycles') {
      token1Decimals = 12;
    } else if (tokenId1 === 'ICP') {
      token1Decimals = 8;
    } else if (this.tokens[tokenId1]) {
      token1Decimals = this.tokens[tokenId1].decimals;
    }
    if (type === 'AMM') {
      if (this.swapId === CYCLES_FINANCE_CANISTER_ID) {
        unitSize = 10 ** 12;
        buyUnit = 8;
        tokenMinUnit = 12;
      } else {
        unitSize = 10 ** token0Decimals;
        buyUnit = token1Decimals;
        tokenMinUnit = token0Decimals;
      }
    } else {
      const swapService = new ICDexService();
      const config = await swapService.getConfig(this.swapId);
      if (config && config.pairId === this.swapId) {
        unitSize = config.dexSetting.UNIT_SIZE;
        tokenMinUnit = token0Decimals - (unitSize.toString(10).length - 1);
        buyUnit = Math.max(token1Decimals - tokenMinUnit, 0);
      }
    }
    this.kLineChart.setPriceVolumePrecision(buyUnit, tokenMinUnit);
    this.kLineChart.applyNewData(
      this.splitData(
        this.KIntervals,
        token0Decimals,
        token1Decimals,
        unitSize,
        buyUnit,
        tokenMinUnit
      )
    );
    // this.timerQuotes = setTimeout(async () => {
    //   await this.getQuotes();
    // }, 5 * 1000);
  }
  private getToken(token: TokenType, tokenStd: TokenStd): string {
    const tokenId = (token as { Token: Principal }).Token;
    if (tokenId) {
      if (!this.tokens[tokenId.toString()]) {
        getTokenInfo(tokenId, tokenStd).then((tokenInfo) => {
          this.tokens[tokenId.toString()] = tokenInfo;
          this.$forceUpdate();
          localStorage.setItem(
            'tokens',
            JSON.stringify(this.tokens, (key, value) =>
              typeof value === 'bigint' ? value.toString() : value
            )
          );
        });
      }
      return tokenId.toString();
    } else {
      if ((token as { Cycles: null }).Cycles === null) {
        return 'Cycles';
      } else if ((token as { Icp: null }).Icp === null) {
        return 'ICP';
      }
    }
    return '-';
  }
  private splitData(
    rawData: Array<KBar>,
    token0Decimals: number,
    token1Decimals: number,
    unitSize: bigint,
    buyUnit: number,
    tokenMinUnit: number
  ): KLData[] {
    if (this.swapId && this.dexInfo) {
      let data: KLData[] = [];
      for (let i = 0; i < rawData.length; i++) {
        const open = this.filterLevelPrice(
          rawData[i].open,
          unitSize,
          token0Decimals,
          token1Decimals,
          buyUnit
        );
        const close = this.filterLevelPrice(
          rawData[i].close,
          unitSize,
          token0Decimals,
          token1Decimals,
          buyUnit
        );
        const lowest = this.filterLevelPrice(
          rawData[i].low,
          unitSize,
          token0Decimals,
          token1Decimals,
          buyUnit
        );
        const highest = this.filterLevelPrice(
          rawData[i].high,
          unitSize,
          token0Decimals,
          token1Decimals,
          buyUnit
        );
        const vol = new BigNumber(rawData[i].vol.value0.toString(10))
          .div(10 ** token0Decimals)
          .toFixed(tokenMinUnit);
        const token1Vol = new BigNumber(rawData[i].vol.value1.toString(10))
          .div(10 ** token1Decimals)
          .toFixed(token1Decimals);
        const timestamp =
          Number(rawData[i].kid) * this.currentKInterval.key * 1000;
        data.push({
          timestamp: timestamp,
          open: Number(open),
          close: Number(close),
          high: Number(highest),
          low: Number(lowest),
          token0volume: Number(vol),
          token1volume: Number(token1Vol)
        });
      }
      return data;
    }
  }
  private changeKIntervalList(kInterval): void {
    this.currentKInterval = kInterval;
    this.getQuotes();
  }
  private close(): void {
    dispose('kInterval-chart');
  }
}
</script>

<style scoped lang="scss">
.k-interval-time {
  display: flex;
  align-items: center;
  height: 42px;
  margin-top: 30px;
  background: #141b23;
  border-bottom: 1px solid #000;
  li {
    padding: 0 10px;
    cursor: pointer;
    font-size: 12px;
    color: #929aa5;
    span {
      display: inline-block;
      padding: 3px 5px;
      transition: all 0.3s;
    }
    &.active,
    &:hover {
      span {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
    }
  }
}
#kInterval-chart {
  height: 350px;
  width: 100%;
  background: #141b23;
}
@media screen and (max-width: 768px) {
  .delete-modal.k-line-modal {
    ::v-deep .ant-modal-body {
      padding: 20px 0;
    }
  }
}
</style>
