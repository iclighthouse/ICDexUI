<template>
  <div class="container-width">
    <div class="airdrops-main">
      <div class="airdrops-main-title">Airdrop Event 2024</div>
      <div>
        The amount of airdrops is calculated based on the ICDex volume of
        earlier versions and the CoinSeconds of the DRC20 ICL.
      </div>
      <div class="airdrops-item mt20">
        <a-form-model
          :model="queryForm"
          ref="queryForm"
          :rules="queryFormRules"
        >
          <div class="flex-center airdrops-item-flex">
            <a-form-model-item label="Owner" prop="owner">
              <a-input
                v-model="queryForm.owner"
                autocomplete="off"
                placeholder="Owner(Principal)"
                @change="queryIcl = ''"
              />
            </a-form-model-item>
            <a-form-model-item label="Subaccount (Hex)" prop="subaccount">
              <a-input
                v-model="queryForm.subaccount"
                autocomplete="off"
                placeholder="Subaccount (optional)"
                @change="queryIcl = ''"
              />
            </a-form-model-item>
          </div>
          <a-form-model-item>
            <button
              @click="queryAirdrop"
              class="primary large-primary w100 mt20"
            >
              Query
            </button>
          </a-form-model-item>
        </a-form-model>
        <div v-show="queryIcl && queryForm.owner">
          <div v-show="claimLog.length">Claim log</div>
          <div>

					</div>
          <span>
            &nbsp;({{ queryIcl | bigintToFloat(8, 8) }} ICL available)
          </span>
        </div>
      </div>
      <div class="airdrops-item" style="margin-top: 40px">
        <a-form-model
          :model="claimForm"
          ref="claimForm"
          :rules="claimFormRules"
        >
          <div class="flex-center airdrops-item-flex">
            <a-form-model-item label="Owner" prop="owner">
              <a-input
                v-model="claimForm.owner"
                autocomplete="off"
                placeholder="Owner(Principal)"
              />
            </a-form-model-item>
            <a-form-model-item label="Subaccount (Hex)" prop="subaccount">
              <a-input
                v-model="claimForm.subaccount"
                autocomplete="off"
                placeholder="Subaccount (optional)"
              />
            </a-form-model-item>
          </div>
          <a-form-model-item>
            <button
              @click="claimAirdrop"
              class="primary large-primary w100 mt20"
            >
              Claim
            </button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <div class="airdrops-main mt20">
      <div class="airdrops-main-title">
        ICLighthouse Planet NFT Airdrop Event
      </div>
      <div>
        <a
          href="https://yuku.app/market/goncb-kqaaa-aaaap-aakpa-cai"
          target="_blank"
          rel="nofollow noreferrer noopener"
          class="link"
          >ICLighthouse Planet NFT</a
        >
        holders claim airdrops here!
      </div>
      <div class="airdrops-item mt20">
        <a-form-model
          :model="queryNFTForm"
          ref="queryNFTForm"
          :rules="queryNFTFormRules"
        >
          <div class="flex-center airdrops-item-flex airdrops-item-flex-nft">
            <a-form-model-item label="NFT Index or NFT ID" prop="NFTId">
              <a-input
                v-model="queryNFTForm.NFTId"
                autocomplete="off"
                placeholder="NFT Index"
                @change="queryNFTIcl = null"
                v-only-number
              />
            </a-form-model-item>
          </div>
          <a-form-model-item>
            <button
              @click="queryNFTAirdrop"
              class="primary large-primary w100 mt20"
            >
              Query
              <span
                v-if="
                  queryNFTIcl &&
                  queryNFTIcl.available &&
                  queryNFTForm.NFTId &&
                  queryNFTForm.NFTId <= 2021
                "
              >
                &nbsp;({{ queryNFTIcl | bigintToFloat(8, 8) }} ICL can be
                claimed with NFT)
              </span>
              <span
                v-if="
                  queryNFTIcl &&
                  !queryNFTIcl.available &&
                  queryNFTIcl.message &&
                  queryNFTForm.NFTId &&
                  queryNFTForm.NFTId <= 2021
                "
              >
                &nbsp;({{ queryNFTIcl.message }})
              </span>
              <span v-show="queryNFTForm.NFTId > 2021">
                &nbsp;(This NFT does not exist)
              </span>
            </button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="airdrops-item" style="margin-top: 40px">
        <a-form-model
          :model="claimNFTForm"
          ref="claimNFTForm"
          :rules="claimNFTFormRules"
        >
          <a-form-model-item label="NFT Index or NFT ID" prop="NFTId">
            <a-input
              v-model="claimNFTForm.NFTId"
              autocomplete="off"
              placeholder="NFT Index"
              v-only-number
            />
          </a-form-model-item>
          <div class="flex-center airdrops-item-flex">
            <a-form-model-item label="Owner" prop="owner">
              <a-input
                v-model="claimNFTForm.owner"
                autocomplete="off"
                placeholder="Owner(Principal)"
              />
            </a-form-model-item>
            <a-form-model-item label="Subaccount (Hex)" prop="subaccount">
              <a-input
                v-model="claimNFTForm.subaccount"
                autocomplete="off"
                placeholder="Subaccount (optional)"
              />
            </a-form-model-item>
          </div>
          <a-form-model-item>
            <button
              @click="claimNFTAirdrop"
              class="primary large-primary w100 mt20"
            >
              Claim
            </button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { validateCanister } from '@/utils/validate';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { NFT_CANISTER_ID, validateAccount } from '@/ic/utils';
import { AirdropService } from '@/ic/airdrop/airdropService';
import { toHttpRejectError } from '@/ic/httpError';
import { Principal } from '@dfinity/principal';
import { getTokenIdentifier, hexToBytes } from '@/ic/converter';
import { AirDrop, ClaimLog, ClaimWithNftLog } from '@/ic/airdrop/model';

@Component({
  name: 'Airdrop',
  components: {}
})
export default class extends Vue {
  private airdropService: AirdropService = null;
  private validateSubaccount = (
    rule: ValidationRule,
    value: string,
    callback: (arg0?: string) => void
  ): void => {
    if (value && !validateAccount(value)) {
      callback('invalid subaccount');
    } else {
      callback();
    }
  };
  private queryIcl = '';
  private queryNFTIcl: AirDrop = null;
  private queryForm = {
    owner: '',
    subaccount: ''
  };
  private queryFormRules = {
    owner: [
      {
        required: true,
        message: 'Please enter owner',
        trigger: 'blur'
      },
      { validator: validateCanister, trigger: ['change', 'blur'] }
    ],
    subaccount: [
      { validator: this.validateSubaccount, trigger: ['change', 'blur'] }
    ]
  };
  private claimForm = {
    owner: '',
    subaccount: ''
  };
  private claimFormRules = {
    owner: [
      {
        required: true,
        message: 'Please enter owner',
        trigger: 'blur'
      },
      { validator: validateCanister, trigger: ['change', 'blur'] }
    ],
    subaccount: [
      { validator: this.validateSubaccount, trigger: ['change', 'blur'] }
    ]
  };
  private queryNFTForm = {
    NFTId: null
  };
  private queryNFTFormRules = {
    NFTId: [
      {
        required: true,
        message: 'Please enter NFT Index',
        trigger: ['change', 'blur']
      }
    ]
  };
  private claimNFTForm = {
    NFTId: null,
    owner: '',
    subaccount: ''
  };
  private claimNFTFormRules = {
    NFTId: [
      {
        required: true,
        message: 'Please enter NFT Index',
        trigger: ['change', 'blur']
      }
    ],
    owner: [
      {
        required: true,
        message: 'Please enter owner',
        trigger: 'blur'
      },
      { validator: validateCanister, trigger: ['change', 'blur'] }
    ],
    subaccount: [
      { validator: this.validateSubaccount, trigger: ['change', 'blur'] }
    ]
  };
  private claimLog: Array<ClaimLog> = [];
  private claimNFTLog: Array<ClaimWithNftLog> = [];
  created(): void {
    this.airdropService = new AirdropService();
  }
  private queryAirdrop(): void {
    this.queryIcl = '';
    (this.$refs.queryForm as any).validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        this.getClaimLog();
        try {
          let subaccount = [];
          if (this.queryForm.subaccount) {
            subaccount = [hexToBytes(this.queryForm.subaccount)];
          }
          const res = await this.airdropService.checkAirDrop(
            Principal.fromText(this.queryForm.owner),
            subaccount
          );
          console.log(res);
          this.queryIcl = res.available.toString(10);
        } catch (e) {
          console.log(e);
          this.$message.error(toHttpRejectError(e));
        }
        loading.close();
      }
    });
  }
  private claimAirdrop(): void {
    (this.$refs.claimForm as any).validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          let subaccount = [];
          if (this.claimForm.subaccount) {
            subaccount = [hexToBytes(this.claimForm.subaccount)];
          }
          const res = await this.airdropService.claim(
            Principal.fromText(this.claimForm.owner),
            subaccount
          );
          console.log(res);
          if (typeof res === 'bigint' && res === BigInt(0)) {
            this.$message.error('0 ICL available');
          } else {
            this.$message.success('Success');
          }
        } catch (e) {
          console.log(e);
          this.$message.error(toHttpRejectError(e));
        }
        loading.close();
      }
    });
  }
  private queryNFTAirdrop(): void {
    this.queryNFTIcl = null;
    (this.$refs.queryNFTForm as any).validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        this.getClaimNFTLog();
        try {
          const res = await this.airdropService.checkAirDropWithNft(
            getTokenIdentifier(NFT_CANISTER_ID, this.queryNFTForm.NFTId)
          );
          console.log(res);
          this.queryNFTIcl = res;
        } catch (e) {
          console.log(e);
          this.$message.error(toHttpRejectError(e));
        }
        loading.close();
      }
    });
  }
  private claimNFTAirdrop(): void {
    (this.$refs.claimNFTForm as any).validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        try {
          let subaccount = [];
          if (this.claimNFTForm.subaccount) {
            subaccount = [hexToBytes(this.claimNFTForm.subaccount)];
          }
          const res = await this.airdropService.claimWithNft(
            getTokenIdentifier(NFT_CANISTER_ID, this.claimNFTForm.NFTId),
            Principal.fromText(this.claimNFTForm.owner),
            subaccount
          );
          console.log(res);
          if (typeof res === 'bigint' && res === BigInt(0)) {
            this.$message.error('0 ICL available');
          } else {
            this.$message.success('Success');
          }
        } catch (e) {
          console.log(e);
          this.$message.error(toHttpRejectError(e));
        }
        loading.close();
      }
    });
  }
  private async getClaimLog(): Promise<void> {
    let subaccount = [];
    if (this.queryForm.subaccount) {
      subaccount = [hexToBytes(this.queryForm.subaccount)];
    }
    this.claimLog = await this.airdropService.claimLog(
      Principal.fromText(this.queryForm.owner),
      subaccount
    );
  }
  private async getClaimNFTLog(): Promise<void> {
    this.claimNFTLog = await this.airdropService.claimWithNftLog(
      getTokenIdentifier(NFT_CANISTER_ID, this.queryNFTForm.NFTId)
    );
  }
}
</script>

<style scoped lang="scss">
.airdrops-main {
  margin-top: 40px;
  color: #adb3c4;
  background: #131920;
  padding: 25px;
  .airdrops-main-title {
    margin-bottom: 10px;
    font-size: 20px;
    color: #fff;
  }
}
.airdrops-item-flex {
  &:not(.airdrops-item-flex-nft) {
    ::v-deep .ant-form-item {
      width: 50%;
      &:first-child {
        padding-right: 10px;
      }
    }
  }
  &.airdrops-item-flex-nft {
    ::v-deep .ant-form-item {
      width: 100%;
    }
  }
}
@media screen and (max-width: 768px) {
  .airdrops-item-flex {
    display: block;
    &:not(.airdrops-item-flex-nft) {
      ::v-deep .ant-form-item {
        width: 100%;
        &:first-child {
          padding-right: 0;
        }
      }
    }
  }
}
</style>
