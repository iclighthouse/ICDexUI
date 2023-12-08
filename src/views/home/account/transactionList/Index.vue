<template>
  <div class="transaction-main container-width">
    <a-icon class="back-arrow" type="arrow-left" @click="back" />
    <div class="transaction-table-container">
      <a-table
        :locale="{
          emptyText: 'No transactions'
        }"
        :columns="columns"
        :data-source="transactionList"
        :pagination="page"
        rowKey="blockIndex"
      >
        <a
          slot="Txid"
          slot-scope="hash"
          :href="`https://ic.house/ICP/tx/${hash}`"
          target="_blank"
          rel="nofollow noreferrer noopener"
          ><a-tooltip placement="top">
            <template slot="title">
              <span>{{ hash }}</span>
            </template>
            {{ hash | ellipsisAccount }}
          </a-tooltip></a
        >
        <div slot="From" slot-scope="text">
          <span v-if="text.type === 'MINT'"> Minting Account</span>
          <a
            v-if="text.type === 'TRANSACTION' || text.type === 'BURN'"
            :href="`https://ic.house/ICP/address/${text.account1Address}`"
            target="_blank"
            rel="nofollow noreferrer noopener"
            ><a-tooltip placement="top">
              <template slot="title">
                <span>{{ text.account1Address }}</span>
              </template>
              {{ text.account1Address | ellipsisAccount }}
            </a-tooltip></a
          >
        </div>
        <div slot="To" slot-scope="text">
          <span v-if="text.type === 'BURN'"> Minting Account</span>
          <a
            v-if="text.type === 'TRANSACTION'"
            :href="`https://ic.house/ICP/address/${text.account2Address}`"
            target="_blank"
            rel="nofollow noreferrer noopener"
            ><a-tooltip placement="top">
              <template slot="title">
                <span>{{ text.account2Address }}</span> </template
              >{{ text.account2Address | ellipsisAccount }}</a-tooltip
            ></a
          >
          <a
            v-if="text.type === 'MINT'"
            :href="`https://ic.house/ICP/address/${text.account1Address}`"
            target="_blank"
            rel="nofollow noreferrer noopener"
            ><a-tooltip placement="top">
              <template slot="title">
                <span>{{ text.account1Address }}</span> </template
              >{{ text.account1Address | ellipsisAccount }}</a-tooltip
            ></a
          >
        </div>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { principalToAccountIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import RosettaApi, { Transaction } from '@/ic/RosettaApi.ts';
import BigNumber from 'bignumber.js';
import { formatDateFromNanosecondUTC } from '@/filters';
const rosettaApi = new RosettaApi();

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  public decimals = 8;
  public account = '';
  public transactionList: Transaction[] = [];
  public page = {
    current: 1,
    pageSize: 10,
    total: 0,
    onChange: this.change
  };
  private lastBlock: number = null;
  public columns = [
    {
      title: 'No',
      dataIndex: 'blockIndex',
      width: 100,
      scopedSlots: { customRender: 'No' }
      // align: 'center',
      // customRender: (text: string, record: Transaction, index: number) => {
      //   return (this.page.current - 1) * this.page.pageSize + index + 1;
      // }
    },
    {
      title: 'Txid',
      dataIndex: 'hash',
      ellipsis: true,
      width: 120,
      scopedSlots: { customRender: 'Txid' }
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      width: 190,
      customRender: (text: bigint): string => {
        return formatDateFromNanosecondUTC(text);
      }
    },
    {
      title: 'From',
      key: 'from',
      width: 120,
      ellipsis: true,
      scopedSlots: { customRender: 'From' }
    },
    {
      title: 'To',
      key: 'to',
      width: 120,
      ellipsis: true,
      scopedSlots: { customRender: 'To' }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 100,
      customRender: (text: bigint): string => {
        return new BigNumber(text.toString(10))
          .div(10 ** 8)
          .decimalPlaces(4, 1)
          .toString(10);
      }
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      width: 100,
      customRender: (text: bigint): string => {
        return new BigNumber(text.toString(10))
          .div(10 ** 8)
          .decimalPlaces(4, 1)
          .toString(10);
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 96,
      customRender: (text: string): string => {
        text = text.slice(0, 1) + text.slice(1).toLowerCase();
        return text;
      }
    }
  ];
  created(): void {
    this.getLastBlockIndex();
    this.getTransactionList();
  }
  public change(page: number): void {
    this.page.current = page;
    this.getTransactionList();
  }
  private back(): void {
    this.$router.replace('/account');
  }
  private async getLastBlockIndex(): Promise<void> {
    try {
      const res = await rosettaApi.getLastBlockIndex();
      if (typeof res === 'number') {
        this.lastBlock = res as number;
        this.getTransactionList();
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getTransactionList(): Promise<void> {
    const principal = localStorage.getItem('principal');
    this.account = principalToAccountIdentifier(Principal.fromText(principal));
    if (this.account) {
      try {
        const res = await rosettaApi.getTransactionsByAccount(
          this.account,
          this.lastBlock,
          this.page.pageSize,
          (this.page.current - 1) * this.page.pageSize
        );
        if (
          res as {
            totalCount: number;
            transactions: Array<Transaction>;
          }
        ) {
          this.page.total = (
            res as {
              totalCount: number;
              transactions: Array<Transaction>;
            }
          ).totalCount;
          this.transactionList = (
            res as {
              totalCount: number;
              transactions: Array<Transaction>;
            }
          ).transactions;
          console.log(this.transactionList);
        }
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
</script>

<style scoped lang="scss">
.transaction-main {
  margin-top: 20px;
  ::v-deep table {
    font-size: 12px;
  }
  ::v-deep {
    td.ant-table-row-cell-ellipsis {
      color: #1996c4;
    }
  }
}
.back-arrow {
  margin-bottom: 10px;
  margin-left: 25px;
  color: #bababa;
  font-size: 18px;
}
::v-deep table {
  min-height: 60px;
}
.transaction-table-container {
  border-radius: 10px;
  background: #141b23;
  box-shadow: 0 0 10px 0 rgba(82, 183, 195, 0.3);
  padding: 20px 25px;
}
</style>
