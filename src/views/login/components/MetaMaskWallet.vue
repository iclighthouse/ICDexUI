<template>
  <a-spin class="password-spinning" :spinning="metaMaskSpinning">
    <div>
      <confirm-password
        v-show="step === 1"
        :signature="signature"
        :eth-account="ethAccount"
        @confirmPasswordBack="confirmPasswordBack"
        @showMnemonic="showMnemonic"
      ></confirm-password>
      <div v-show="step === 2">
        <div class="step-title">Backup Mnemonic Phrase</div>
        <div>Mnemonic Phrase is important way to access your wallet.</div>
        <div class="mt20 backup-tip">Never disclose or lose it.</div>
        <div class="backup-tip">
          Anyone who knows this can transfer funds out of your account.
        </div>
        <div class="mnemonic-phrase-bottom">
          <button type="button" @click="setMetaMask">Skip</button>
          <button type="button" class="primary" @click="step = 3">
            Backup Now
          </button>
        </div>
      </div>
      <div v-show="step === 3">
        <div class="step-title">Mnemonic Phrase</div>
        <a-tooltip placement="top">
          <template slot="title">
            <span>Copy to clipboard</span>
          </template>
          <div
            class="mnemonic-wrap mnemonic-wrap-phrase"
            v-clipboard:copy="mnemonicList.join(' ')"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            <span
              class="mnemonic-item"
              v-for="(item, index) in mnemonicList"
              :key="index"
            >
              {{ item }}{{ index === mnemonicList.length - 1 ? '' : '&nbsp;' }}
            </span>
          </div>
        </a-tooltip>
        <p>
          Write your mnemonic down on a physical piece of paper and store it
          somewhere safe and private, it is only way to access your wallet.
          Anyone who knows this can transfer funds out of your account.
        </p>
        <div class="mnemonic-phrase-bottom">
          <button type="button" @click="mnemonicBack">Back</button>
          <button type="button" @click="securityTips = true">
            Security Tips</button
          ><button type="button" class="default" @click="setMetaMask">
            Next Step
          </button>
        </div>
      </div>
      <a-modal
        v-model="securityTips"
        centered
        title="Security Tips"
        width="700px"
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="security-tips-modal"
      >
        <div>
          <p>
            When accessing this wallet, always type the URL into the browser
            address bar yourself or use a bookmark that you yourself created.
            Never trust links posted on social media, in search results, sent in
            emails or listed on other websites.
          </p>
          <p>
            If your browser gives you any sort of security warning about this
            web wallet, get in touch with us and report it. Do not ignore the
            warning nor enter your mnemonic phrase!
          </p>
          <p>
            Only use your own devices when accessing your accounts. Do not enter
            your mnemonic phrase on untrustworthy devices (public computers,
            friends computers/phones, etc) as they might be littered with
            malware and keyloggers.
          </p>
          <p>
            Always keep your operating system, anti-virus software and browser
            up to date with latest security updates.
          </p>
          <p>
            If possible, prefer hardware wallets or cold wallets over mnemonic
            phrase for storing larger amounts of assets.
          </p>
        </div>
        <div class="security-tips-modal-confirm" @click="securityTips = false">
          <button type="button" class="default">confirm</button>
        </div>
      </a-modal>
    </div>
  </a-spin>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ConfirmPassword from '@/views/login/components/ConfirmPassword.vue';
import { encrypt } from '@/ic/utils';
import { Identity } from '@dfinity/agent';
import { namespace } from 'vuex-class';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { toHexString } from '@/ic/converter';

const commonModule = namespace('common');

@Component({
  name: 'MetaMaskWallet',
  components: {
    ConfirmPassword
  }
})
export default class extends Vue {
  @commonModule.Mutation('SET_IDENTITY') setIdentity?: any;
  @commonModule.Mutation('SET_PRINCIPAL_ID') setPrincipalId?: any;
  @Prop({ type: String, default: '' })
  public signature!: string;
  @Prop({ type: String, default: '' })
  public ethAccount!: string;
  private step = 1;
  private metaMaskSpinning = false;
  private currentIdentity: Identity;
  private password: string;
  private securityTips = false;
  private mnemonicList = [];
  private isNewAccount: boolean;
  private onCopy(): void {
    this.$message.success('Copied');
  }
  private onError(): void {
    console.log('err');
  }
  private confirmPasswordBack(): void {
    this.$emit('back');
  }
  public mnemonicBack(): void {
    this.step = 1;
    this.mnemonicList = [];
  }
  private showMnemonic(
    mnemonicString: string,
    currentIdentity: Identity,
    password: string,
    isNewAccount: boolean
  ): void {
    this.step = 2;
    this.mnemonicList = mnemonicString.split(' ');
    this.currentIdentity = currentIdentity;
    this.password = password;
    this.isNewAccount = isNewAccount;
  }
  private async setMetaMask(): Promise<void> {
    this.metaMaskSpinning = true;
    try {
      const principal = this.currentIdentity.getPrincipal().toString();
      // localStorage.setItem(principal, JSON.stringify(encryptIdentity));
      // const encryptIdentity = await encrypt(
      //   JSON.stringify(this.currentIdentity),
      //   this.password
      // );
      localStorage.setItem('principal', principal);
      this.setPrincipalId(principal);
      const principalList = JSON.parse(localStorage.getItem('priList')) || {};
      principalList[principal] = `MetaMask-${this.ethAccount}`;
      localStorage.setItem('priList', JSON.stringify(principalList));
      this.setIdentity(this.currentIdentity);
      localStorage.setItem('identity', localStorage.getItem('principal'));
      const arr = new Uint8Array(64);
      const salt = toHexString(window.crypto.getRandomValues(arr));
      const encryptSeedPhrase = await encrypt(
        this.mnemonicList.join(' '),
        this.password,
        salt
      );
      const phraseList = JSON.parse(localStorage.getItem('phraseList')) || {};
      phraseList[principal] = {
        salt: salt,
        encryptSeedPhrase: encryptSeedPhrase
      };
      localStorage.setItem('phraseList', JSON.stringify(phraseList));
      if (this.isNewAccount) {
        const iCLighthouseService = new ICLighthouseService();
        await iCLighthouseService.addMetaMask(
          this.ethAccount,
          JSON.stringify({
            salt: salt,
            encryptSeedPhrase: encryptSeedPhrase
          })
        );
      }
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect as any).catch(() => {
          return;
        });
      } else {
        this.$router.push('/ICDex').catch(() => {
          return;
        });
      }
    } catch (e) {
      this.metaMaskSpinning = false;
    }
  }
}
</script>

<style scoped lang="scss">
.mnemonic-wrap {
  /*display: flex;
	align-items: center;
	flex-wrap: wrap;*/
  width: 100%;
  margin: 0 auto 30px;
  .mnemonic-item {
    position: relative;
    display: inline-block;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 16px;
    padding: 5px 20px;
    color: #fff;
    /*width: 120px;
		height: 30px;
		border-right: 1px solid #333;
		border-bottom: 1px solid #333;*/
    /*&:nth-child(4n) {
			border-right: none;
		}*/
    .mnemonic-num {
      position: absolute;
      left: 3px;
      color: #777;
    }
    input {
      width: 110px;
      height: 100%;
      text-align: center;
      border: none;
      outline: none;
    }
  }
}
.mnemonic-wrap.mnemonic-wrap-phrase {
  margin: 40px 0;
  border: 1px solid #313b46;
  padding: 10px 0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    border-color: #51b7c3;
  }
}
.backup-tip {
  line-height: 1.2;
}
.password-spinning {
  margin: -30px -55px -90px;
}
::v-deep .ant-spin-container {
  padding: 30px 55px 90px;
}
</style>
