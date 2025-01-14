<template>
  <a-modal
    v-model="visibleReceive"
    centered
    title="Address"
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="address-modal"
  >
    <div class="address-modal-header">
      <div
        v-for="(info, index) in addressInfoList"
        :key="index"
        class="address-modal-item"
        @click="currentShow = info.value"
        :class="{ active: currentShow === info.value }"
      >
        {{ info.value }}
      </div>
    </div>
    <dl v-show="currentShow === 'Account'">
      <dt><img :src="accountCode" alt="" /></dt>
      <dd>
        {{ account
        }}<a-icon
          type="copy"
          v-clipboard:copy="account"
          v-clipboard:success="onAccountCopy"
          v-clipboard:error="onError"
        />
      </dd>
    </dl>
    <dl v-show="currentShow === 'Principal'">
      <dt><img :src="principalCode" alt="" /></dt>
      <dd>
        {{ principal }}
        <a-icon
          type="copy"
          v-clipboard:copy="principal"
          v-clipboard:success="onPrincipalCopy"
          v-clipboard:error="onError"
        />
      </dd>
    </dl>
  </a-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { principalToAccountIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import QRCode from 'qrcode';
@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  public principal = '';
  private visibleReceive = false;
  private currentShow = 'Account';
  private addressInfoList = [
    {
      value: 'Account'
    },
    {
      value: 'Principal'
    }
  ];
  private account = '';
  private accountCode = '';
  private principalCode = '';
  @Watch('principal')
  private async principalChange(principal: string) {
    this.account = principalToAccountIdentifier(Principal.fromText(principal));
    this.accountCode = await QRCode.toDataURL(this.account, {
      width: 120
    });
    this.principalCode = await QRCode.toDataURL(this.principal, {
      width: 120
    });
  }
  public init(showAccount = true): void {
    if (showAccount) {
      this.addressInfoList = [
        {
          value: 'Account'
        },
        {
          value: 'Principal'
        }
      ];
      this.currentShow = 'Account';
    } else {
      this.addressInfoList = [
        {
          value: 'Principal'
        }
      ];
      this.currentShow = 'Principal';
    }
  }
  public onAccountCopy(): void {
    this.$message.success(`Account ID Copied`);
  }
  public onPrincipalCopy(): void {
    this.$message.success(`Principal ID Copied`);
  }
  public onError(): void {
  }
}
</script>
<style scoped lang="scss">
.address-modal {
  i {
    cursor: pointer;
  }
  ::v-deep .ant-modal-body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  dl {
    width: 100%;
    dt {
      margin-bottom: 20px;
      text-align: center;
    }
    dd {
      font-size: 16px;
      i {
        font-size: 12px;
        padding-left: 5px;
      }
    }
  }
  ::v-deep .ant-form-item {
    margin-bottom: 0;
  }
  .address-modal-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .address-modal-item {
      cursor: pointer;
      padding: 0 5px;
      font-weight: bold;
      font-size: 16px;
      color: #727a87;
      &.active {
        color: #1996c4;
      }
    }
  }
}
</style>
