<template>
  <div>
    <div class="home-header" style="margin-top: 14px">
      <div class="home-header-left">
        <span class="home-header-title">Airdrop</span>
      </div>
      <account-info> </account-info>
    </div>
    <div class="container-width">
      <div class="airdrops-main">
        <div class="airdrops-main-title">Airdrop Event 24-02</div>
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
                  @change="queryIcl = null"
                />
              </a-form-model-item>
              <a-form-model-item label="Subaccount (Hex)" prop="subaccount">
                <a-input
                  v-model="queryForm.subaccount"
                  autocomplete="off"
                  placeholder="Subaccount (optional)"
                  @change="queryIcl = null"
                />
              </a-form-model-item>
            </div>
            <a-form-model-item>
              <button @click="queryAirdrop" class="primary large-primary">
                Query
              </button>
              <div
                v-if="queryIcl && queryForm.owner"
                class="base-font-title"
                style="margin-top: 8px"
              >
                <span
                  v-show="
                    (queryIcl.available && queryIcl.credit) || !queryIcl.credit
                  "
                >
                  Available: {{ queryIcl.available | bigintToFloat(8, 8) }} ICL
                </span>
                <span v-show="!queryIcl.available && queryIcl.credit">
                  Claimed: {{ queryIcl.credit | bigintToFloat(8, 8) }} ICL
                </span>
                <div style="margin-top: 8px" v-if="claimLog.length">
                  Status: {{ Object.keys(claimLog[0].status)[0] }}; Value:
                  {{ claimLog[0].value | bigintToFloat(8, 8) }} ICL; Time:
                  {{
                    Math.floor(Number(claimLog[0].time) / 1000)
                      | formatDateFromSecondUTC
                  }}
                </div>
              </div>
            </a-form-model-item>
          </a-form-model>
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
                :disabled="!canClaim"
                @click="claimAirdrop"
                class="primary large-primary flex-center"
              >
                Claim
                <span class="flex-center" v-show="!canClaim"
                  >&nbsp;(starting soon&nbsp;
                  <a-statistic-countdown
                    class="voting-power-countdown"
                    :value="deadline"
                    format="DD:HH:mm:ss"
                  />)</span
                >
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
              <a-form-model-item label="NFT Index" prop="NFTId">
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
              <button @click="queryNFTAirdrop" class="primary large-primary">
                Query
              </button>
              <div class="base-font-title" style="margin-top: 8px">
                <div
                  v-if="
                    queryNFTIcl &&
                    queryNFTIcl.available &&
                    queryNFTIcl.credit &&
                    queryNFTForm.NFTId &&
                    queryNFTForm.NFTId <= 2021
                  "
                >
                  Available:
                  {{ queryNFTIcl.available | bigintToFloat(8, 8) }} ICL
                </div>
                <div
                  v-if="
                    queryNFTIcl &&
                    !queryNFTIcl.available &&
                    queryNFTIcl.credit &&
                    queryNFTForm.NFTId &&
                    queryNFTForm.NFTId <= 2021
                  "
                >
                  Claimed: {{ queryNFTIcl.credit | bigintToFloat(8, 8) }} ICL
                </div>
                <div v-show="queryNFTForm.NFTId > 2021">
                  This NFT does not exist
                </div>
                <div
                  style="margin-top: 8px"
                  v-if="queryNFTIcl && claimNFTLog.length"
                >
                  Status: {{ Object.keys(claimNFTLog[0].status)[0] }}; Value:
                  {{ claimNFTLog[0].value | bigintToFloat(8, 8) }} ICL; Time:
                  {{
                    Math.floor(Number(claimNFTLog[0].time) / 1000)
                      | formatDateFromSecondUTC
                  }}
                </div>
              </div>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="airdrops-item" style="margin-top: 40px">
          <a-form-model
            :model="claimNFTForm"
            ref="claimNFTForm"
            :rules="claimNFTFormRules"
          >
            <a-form-model-item label="NFT Index" prop="NFTId">
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
            <div
              class="base-warning"
              style="margin: -5px 0 20px; font-size: 12px; line-height: 1.2"
            >
              WARNING: Airdrops will be sent to the above account, make sure
              your wallet (e.g. ICLight, Plug) supports ICRC1 ICL token. It is
              recommended to transfer NFTs to a wallet such as ICLight, Plug,
              etc. and then log in here to claim it.
            </div>
            <a-form-model-item>
              <button
                :disabled="!canClaim"
                @click="claimNFTAirdrop"
                class="primary large-primary"
              >
                Claim<span class="flex-center" v-show="!canClaim"
                  >&nbsp;(starting soon&nbsp;
                  <a-statistic-countdown
                    class="voting-power-countdown"
                    :value="deadline"
                    format="DD:HH:mm:ss"
                  />)</span
                >
              </button>
            </a-form-model-item>
          </a-form-model>
        </div>
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
import AccountInfo from '@/views/home/components/AccountInfo.vue';

@Component({
  name: 'Airdrop',
  components: { AccountInfo }
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
  private queryIcl: AirDrop = null;
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
  private canClaim = false;
  private deadline = null;
  created(): void {
    this.airdropService = new AirdropService();
    this.check();
  }
  private async check(): Promise<void> {
    const time = 1711612800000;
    const now = new Date().getTime();
    this.canClaim = now > time;
    console.log(this.canClaim);
    if (!this.canClaim) {
      this.deadline = time;
    }
    console.log(this.deadline);
  }
  private queryAirdrop(): void {
    this.queryIcl = null;
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
          this.queryIcl = res;
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
      if (valid && this.queryNFTForm.NFTId <= 2021) {
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
    try {
      let subaccount = [];
      if (this.queryForm.subaccount) {
        subaccount = [hexToBytes(this.queryForm.subaccount)];
      }
      this.claimLog = await this.airdropService.claimLog(
        Principal.fromText(this.queryForm.owner),
        subaccount
      );
    } catch (e) {
      console.log(e);
    }
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
button {
  width: 280px;
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
<style lang="scss">
.voting-power-countdown {
  line-height: 1;
  .ant-statistic-content {
    color: #ccc;
    font-size: 14px;
    text-align: center;
  }
}
</style>
