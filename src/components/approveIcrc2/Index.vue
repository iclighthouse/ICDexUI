<template>
  <a-modal
    v-model="visible"
    centered
    width="550px"
    :title="title"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="approve-modal"
    :after-close="afterClose"
  >
    <a-form-model :model="approveForm" ref="approveForm" :rules="approveRules">
      <a-form-model-item label="Spender" prop="spender">
        <a-input
          v-model="approveForm.spender"
          autocomplete="off"
          placeholder="Principal"
        />
      </a-form-model-item>
      <a-form-model-item label="Amount" prop="amount">
        <a-input
          v-if="tokenInfo"
          v-model="approveForm.amount"
          autocomplete="off"
          type="text"
          v-only-float="tokenInfo.decimals"
          min="0"
          placeholder="0.00"
          :suffix="tokenInfo.symbol"
        />
      </a-form-model-item>
      <a-form-model-item>
        <button
          class="approve-submit primary large-primary w100 mt20"
          @click="approve"
        >
          Approve
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { LEDGER_CANISTER_ID } from '@/ic/utils';
import { Icrc1Account, TokenInfo } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';
import { checkAuth } from '@/ic/CheckAuth';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { Principal } from '@dfinity/principal';
import { ApproveError } from '@/ic/DRC20Token/model';
import { validateCanister } from '@/utils/validate';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  @Prop({ type: String, default: LEDGER_CANISTER_ID })
  tokenId!: string;
  @Prop({ type: String, default: '' })
  balance!: string;
  private ledgerService: LedgerService | undefined;
  private visible = false;
  private tokenInfo: TokenInfo = null;
  private title = 'Approve';
  private approveForm = {
    spender: '',
    amount: ''
  };
  private approveRules = {
    spender: [
      { required: true, message: 'Please enter Principal', trigger: 'blur' },
      { validator: validateCanister, trigger: 'blur' }
    ],
    amount: [
      { required: true, message: 'Please enter amount', trigger: 'blur' }
    ]
  };
  created(): void {
    this.ledgerService = new LedgerService();
  }
  private init(tokenInfo: TokenInfo): void {
    this.tokenInfo = tokenInfo;
    if (this.tokenInfo && this.tokenInfo.symbol) {
      this.title = 'Approve ' + this.tokenInfo.symbol;
    }
    console.log(this.tokenInfo);
    this.visible = true;
  }
  private approve(): void {
    (this.$refs.approveForm as any).validate(async (valid: any) => {
      if (valid) {
        await checkAuth();
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        const amount = BigInt(
          new BigNumber(this.approveForm.amount.toString())
            .times(10 ** Number(this.tokenInfo.decimals))
            .toString(10)
        );
        const std = Object.keys(this.tokenInfo.tokenStd)[0];
        const spender: Icrc1Account = {
          owner: Principal.fromText(this.approveForm.spender),
          subaccount: []
        };
        let res;
        if (std && std.toLocaleLowerCase() === 'icp') {
          res = await this.ledgerService.icrc2_approve(spender, amount);
        }
        if (res) {
          const type = Object.keys(res)[0];
          if (type === 'Ok') {
            this.visible = false;
            this.$message.success('Success');
          } else {
            const err = (res as { Err: ApproveError }).Err;
            this.$message.error(
              JSON.stringify(err, (key, value) =>
                typeof value === 'bigint' ? value.toString(10) : value
              )
            );
          }
        }
        loading.close();
      }
    });
  }
  private afterClose(): void {
    (this.$refs.approveForm as any).resetFields();
  }
}
</script>

<style scoped lang="scss"></style>
