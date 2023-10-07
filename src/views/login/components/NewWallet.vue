<template>
  <div>
    <div v-show="step === 1">
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
        somewhere safe and private, it is only way to access your wallet. Anyone
        who knows this can transfer funds out of your account.
      </p>
      <div class="mnemonic-phrase-bottom">
        <button type="button" @click="mnemonicBack">Back</button>
        <button type="button" @click="securityTips = true">Security Tips</button
        ><button type="button" class="default" @click="step = 2">
          Next Step
        </button>
      </div>
    </div>
    <div v-show="step === 2">
      <div class="step-title">Confirm Mnemonic</div>
      <p class="mnemonic-tip">Please confirm your 12 word seed phrase:</p>
      <div class="mnemonic-wrap">
        <!--<div
          class="mnemonic-item"
          v-for="(item, index) in checkMnemonicList"
          :key="index"
        >
          <span class="mnemonic-num">{{ index + 1 }}.</span>
          <input type="text" v-model="checkMnemonicList[index]" />
        </div>-->
        <a-textarea
          v-model="checkMnemonicList"
          :autoSize="{ minRows: 4 }"
          placeholder="Confirm your mnemonic seed"
          autocomplete="off"
        ></a-textarea>
      </div>
      <div class="mnemonic-error" v-show="showErr">
        The mnemonic you entered does not match the one displayed
      </div>
      <div class="mnemonic-phrase-bottom">
        <button type="button" @click="checkMnemonicBack">Back</button
        ><button type="button" class="default" @click="checkMnemonic">
          Next Step
        </button>
      </div>
    </div>
    <!-- <a-spin :spinning="spinning">
      <div v-show="step === 3">
        <p class="step-title">encrypt your private data on your device.</p>
        <div class="enter-password-or-connect-metaMask">
          <div class="mnemonic-encrypt-item" @click="step++">
            <a-icon type="lock" />
            <span>Enter a password</span>
          </div>
          <div class="mnemonic-encrypt-item" @click="onConnectMetaMask">
            <img src="@/assets/img/MetaMask.png" alt="" /><span
              >Connect to MetaMask</span
            >
          </div>
        </div>
        &lt;!&ndash;<div class="mnemonic-phrase-bottom">
				<a-button>Back</a-button>
			</div>&ndash;&gt;
      </div>
    </a-spin>-->
    <div v-show="step === 3">
      <confirm-password
        :mnemonic="mnemonicList.join(' ')"
        @confirmPasswordBack="confirmPasswordBack"
      ></confirm-password>
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
          If your browser gives you any sort of security warning about this web
          wallet, get in touch with us and report it. Do not ignore the warning
          nor enter your mnemonic phrase!
        </p>
        <p>
          Only use your own devices when accessing your accounts. Do not enter
          your mnemonic phrase on untrustworthy devices (public computers,
          friends computers/phones, etc) as they might be littered with malware
          and keyloggers.
        </p>
        <p>
          Always keep your operating system, anti-virus software and browser up
          to date with latest security updates.
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ConfirmPassword from '@/views/login/components/ConfirmPassword.vue';
const ethers = require('ethers');
const ethereum = (window as any).ethereum;

@Component({
  name: 'NewWallet',
  components: {
    ConfirmPassword
  }
})
export default class extends Vue {
  // public spinning = false;
  public securityTips = false;
  public step = 1;
  public mnemonicList: string[] = [];
  public checkMnemonicList = '';
  public showErr = false;
  private onCopy(): void {
    this.$message.success('Copied');
  }
  private onError(): void {
    console.log('err');
  }
  public creatMnemonic(): void {
    let rand = ethers.utils.randomBytes(16);
    const mnemonic = ethers.utils.entropyToMnemonic(rand);
    this.mnemonicList = mnemonic.split(' ');
  }
  public mnemonicBack(): void {
    this.$emit('back');
    this.step = 1;
    this.mnemonicList = [];
  }
  public checkMnemonicBack(): void {
    this.step--;
    this.showErr = false;
    this.checkMnemonicList = '';
  }
  public checkMnemonic(): void {
    this.showErr =
      this.mnemonicList.join(' ') !==
      this.checkMnemonicList.replace(/\s+/g, ' ');
    if (!this.showErr) {
      this.step++;
    }
  }
  public confirmPasswordBack(): void {
    this.step--;
  }
  //Created check function to see if the MetaMask extension is installed
  public isMetaMaskInstalled(): boolean {
    //Have to check the ethereum binding on the window object to see if it's installed
    return Boolean(ethereum && ethereum.isMetaMask);
  }
}
</script>

<style scoped lang="scss">
.mnemonic-encrypt {
  font-size: 20px;
}
.enter-password-or-connect-metaMask {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .mnemonic-encrypt-item {
    display: flex;
    align-items: center;
    margin-top: 15px;
    font-size: 16px;
    cursor: pointer;
    span {
      margin-left: 20px;
    }
    img {
      width: 20px;
    }
    i {
      font-size: 20px;
      color: #1996c4;
    }
  }
}
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
.security-tips-modal-confirm {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
  cursor: pointer;
  text-align: right;
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
</style>
