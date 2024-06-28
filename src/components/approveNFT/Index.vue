<template>
  <div>
    <a-modal
      v-model="visible"
      centered
      title="NFT Approve"
      width="472px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="approve-modal"
      :after-close="afterClose"
    >
      <div class="base-font-title">Select a NFT</div>
      <ul class="nft-main">
        <li
          v-for="(ext, index) in tokensExt.slice(
            extPage * extPageNum,
            (extPage + 1) * extPageNum
          )"
          :key="index"
          :class="{ active: currentNft && ext[0] === currentNft[0] }"
          @click="selectNft(ext)"
        >
          <img
            v-show="currentNft && ext[0] === currentNft[0]"
            class="checked"
            src="@/assets/img/checked.png"
            alt=""
          />
          <div class="nft-img">
            <img :src="getExtInfo(ext[2]).thumb" alt="" />
          </div>
          <div class="ext-info">{{ getExtInfo(ext[2]).name }}</div>
        </li>
      </ul>
      <div class="nft-main-pagination">
        <a-pagination
          v-if="tokensExt.length > 2"
          class="pagination"
          :defaultPageSize="extPageNum"
          :current="extPage + 1"
          :total="tokensExt.length"
          @change="pageChange"
        />
      </div>
      <div class="mt20 w100">
        <button
          @click="onApprove"
          :disabled="!currentNft"
          type="button"
          class="w100 primary"
        >
          Approve
        </button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NftService } from '@/ic/nft/Service';
import { ApproveRequest, TokenExt, TokensExt } from '@/ic/nft/model';
import { getTokenIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import {
  IC_DEX_ROUTER_CANISTER_ID,
  IC_MINING_CANISTER_ID,
  NFT_CANISTER_ID
} from '@/ic/utils';
import NFTIdl from '@/ic/nft/erc721.did';
import { isPlug } from '@/ic/isPlug';
import { checkAuth } from '@/ic/CheckAuth';
import { isInfinity } from '@/ic/isInfinity';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Array, default: () => [] })
  tokensExt!: TokensExt;
  private extPage = 0;
  private extPageNum = 2;
  private NftService: NftService = null;
  private visible = false;
  private currentNft: TokenExt = null;
  private spender = IC_MINING_CANISTER_ID;
  created(): void {
    this.NftService = new NftService();
  }
  private afterClose(): void {
    this.currentNft = null;
  }
  private selectNft(nft: TokenExt): void {
    this.currentNft = nft;
  }
  private init(spender?: string): void {
    this.currentNft = this.tokensExt[0];
    if (spender) {
      this.spender = spender;
    }
  }
  private async onApprove(): Promise<void> {
    const spender = this.spender;
    const approveRequest: ApproveRequest = {
      token: getTokenIdentifier(NFT_CANISTER_ID, Number(this.currentNft[0])),
      subaccount: [],
      allowance: BigInt(1),
      spender: Principal.fromText(spender)
    };
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();

    if (isPlug()) {
      const approve = {
        idl: NFTIdl,
        canisterId: NFT_CANISTER_ID,
        methodName: 'approve',
        args: [approveRequest],
        onSuccess: async (res) => {
          if (res) {
            this.$message.success('Approve Success');
            if (spender === IC_DEX_ROUTER_CANISTER_ID) {
              localStorage.setItem(
                'approveNftVip',
                this.currentNft[0].toString(10)
              );
            }
            if (spender === IC_MINING_CANISTER_ID) {
              localStorage.setItem(
                'approveNft',
                this.currentNft[0].toString(10)
              );
            }
            this.visible = false;
            this.$emit('approveSuccess');
          } else {
            this.$message.error('Approve error');
          }
          loading.close();
        },
        onFail: () => {
          loading.close();
          this.$message.error('Approve error');
        }
      };
      const plugIc = (window as any).ic.plug;
      const res = await plugIc.batchTransactions([approve]);
      console.log(res);
    } else if (isInfinity()) {
      const approve = {
        idl: NFTIdl,
        canisterId: NFT_CANISTER_ID,
        methodName: 'approve',
        args: [approveRequest],
        onSuccess: async (res) => {
          if (res) {
            this.$message.success('Approve Success');
            if (spender === IC_DEX_ROUTER_CANISTER_ID) {
              localStorage.setItem(
                'approveNftVip',
                this.currentNft[0].toString(10)
              );
            }
            if (spender === IC_MINING_CANISTER_ID) {
              localStorage.setItem(
                'approveNft',
                this.currentNft[0].toString(10)
              );
            }
            this.visible = false;
            this.$emit('approveSuccess');
          } else {
            this.$message.error('Approve error');
          }
          loading.close();
        },
        onFail: () => {
          loading.close();
          this.$message.error('Approve error');
        }
      };
      const Ic = (window as any).ic.infinityWallet;
      const res = await Ic.batchTransactions([approve]);
      console.log(res);
    } else {
      try {
        const res = await this.NftService.approve(approveRequest);
        if (res) {
          this.$message.success('Approve Success');
          this.visible = false;
          if (spender === IC_DEX_ROUTER_CANISTER_ID) {
            localStorage.setItem(
              'approveNftVip',
              this.currentNft[0].toString(10)
            );
          }
          if (spender === IC_MINING_CANISTER_ID) {
            localStorage.setItem('approveNft', this.currentNft[0].toString(10));
          }
          this.$emit('approveSuccess');
        } else {
          this.$message.error('Approve error');
        }
      } catch (e) {
        this.$message.error('Approve error');
        console.error(e);
      }
      loading.close();
    }
  }
  private getExtInfo(val: Array<Array<number>>): any {
    if (val && val.length) {
      return JSON.parse(Buffer.from(val[0]).toString());
    }
    return {};
  }
  private pageChange(page: number): void {
    this.extPage = page - 1;
  }
}
</script>

<style scoped lang="scss">
button {
  height: 36px;
}
</style>
