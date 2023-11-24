<template>
  <a-spin class="password-spinning" :spinning="passwordSpinning">
    <div class="step-title">Enter a password</div>
    <p class="password-tip">
      This password is used to encrypt your private data on your device.
    </p>
    <p class="password-rule">
      Use 8 or more characters with a mix of letters and numbers
    </p>
    <a-form-model
      ref="passwordForm"
      :model="passwordForm"
      :rules="passwordRules"
      class="password-form"
    >
      <a-form-model-item prop="password">
        <a-input
          v-model="passwordForm.password"
          @input="wrongPassword = false"
          type="password"
          placeholder="Enter Password"
          autocomplete="new-password"
        />
      </a-form-model-item>
      <a-form-model-item prop="checkPassword">
        <a-input
          v-model="passwordForm.checkPassword"
          @input="wrongPassword = false"
          type="password"
          placeholder="Confirm Password"
          autocomplete="new-password"
        />
      </a-form-model-item>
      <div v-show="wrongPassword" class="wrong-password">
        <span class="error">Wrong password!</span>
        <span @click="createNewAccount" class="margin-left-auto"
          >Create new account</span
        >
      </div>
      <div v-show="passwordForm.password && suggestions.length">
        <div class="base-font-title">Suggestions:</div>
        <div v-for="(item, index) in suggestions" :key="index">
          {{ index + 1 }}. {{ item }}
        </div>
      </div>
    </a-form-model>
    <div class="mnemonic-phrase-bottom">
      <button @click="confirmPasswordBack">Back</button
      ><button class="default" @click="onSubmit">Next Step</button>
    </div>
  </a-spin>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {
  ValidationRule,
  WrappedFormUtils
} from 'ant-design-vue/types/form/form';
import { decrypt, encrypt } from '@/ic/utils';
import { generateMeatMaskSeed, hexToBytes, toHexString } from '@/ic/converter';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { namespace } from 'vuex-class';
import { Identity } from '@dfinity/agent';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { MetaMaskInfo } from '@/ic/ICLighthouse/model';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

const ethers = require('ethers');
const commonModule = namespace('common');
const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary
  }
};

zxcvbnOptions.setOptions(options);

@Component({
  name: 'ConfirmPassword',
  components: {}
})
export default class extends Vue {
  @commonModule.Mutation('SET_IDENTITY') setIdentity?: any;
  @commonModule.Mutation('SET_PRINCIPAL_ID') setPrincipalId?: any;
  @Prop({ type: String, default: '' })
  public signature!: string;
  @Prop({ type: String, default: '' })
  public ethAccount!: string;
  @Prop({ type: String, default: '' })
  public mnemonic!: string;
  @Prop()
  public identity!: Identity;
  public passwordSpinning = false;
  private wrongPassword = false;
  public passwordForm = {
    password: '',
    checkPassword: ''
  };
  private suggestions: Array<string> = [];
  public passwordRules = {
    password: [
      { required: true, validator: this.validatePass, trigger: 'change' }
    ],
    checkPassword: [
      { required: true, validator: this.validatePass2, trigger: 'change' }
    ]
  };
  public validatePass(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: Error) => void
  ): void {
    if (value === '') {
      callback(new Error('Please enter the password'));
    } else {
      console.log(zxcvbn(value));
      const res = zxcvbn(value);
      if (res.score <= 2) {
        this.suggestions = res.feedback.suggestions;
        if (res.feedback.warning) {
          callback(new Error(res.feedback.warning));
        } else {
          callback(new Error('Risky password'));
        }
      } else {
        this.suggestions = [];
        if (this.passwordForm.checkPassword !== '') {
          (this.$refs.passwordForm as any).validateField(
            'checkPassword',
            (errorMessage) => {
              console.log(errorMessage);
            }
          );
        }
        callback();
      }
      callback();
    }
    // else if (!/^(?=.*[A-Za-z])(?=.*\d)[^]{8,}$/.test(value)) {
    //   callback(
    //     new Error(
    //       'Password must be at least 8 characters with 1 letter and 1 number.'
    //     )
    //   );
    // } else {
    //   if (this.passwordForm.checkPassword !== '') {
    //     (this.$refs.passwordForm as FormModel).validateField(
    //       'checkPassword',
    //       (errorMessage) => {
    //         console.log(errorMessage);
    //       }
    //     );
    //   }
    //   callback();
    // }
  }
  public validatePass2(
    rule: ValidationRule,
    value: string,
    callback: (arg0?: Error) => void
  ): void {
    if (value === '') {
      callback(new Error('Please enter the password again'));
    } else if (value !== this.passwordForm.password) {
      callback(new Error("Your passwords don't match!"));
    } else {
      callback();
    }
  }
  created(): void {
    this.suggestions = [];
  }
  public onSubmit(): void {
    (this.$refs.passwordForm as any).validate(async (valid: any) => {
      if (valid) {
        this.encryptIdentity(this.passwordForm.password);
      }
    });
  }
  private createNewAccount(): void {
    this.encryptIdentity(this.passwordForm.password, true);
  }
  public encryptIdentity(password: string, newAccount = false): void {
    this.passwordSpinning = true;
    setTimeout(async () => {
      let currentIdentity: Identity;
      let mnemonic;
      let isNewAccount = newAccount;
      if (!this.mnemonic && this.signature) {
        let seed;
        let mnemonicString;
        let metaMaskInfo: Array<MetaMaskInfo>;
        if (!newAccount) {
          const iCLighthouseService = new ICLighthouseService();
          metaMaskInfo = await iCLighthouseService.getMetaMask(this.ethAccount);
          console.log(metaMaskInfo);
        }
        if (!newAccount && metaMaskInfo && metaMaskInfo.length) {
          for (let i = 0; i < metaMaskInfo[0].mnemonic.length; i++) {
            try {
              let info = metaMaskInfo[0].mnemonic[i];
              let salt = 'ICLightHouse';
              let data = info;
              if (info.includes('salt')) {
                salt = JSON.parse(info).salt;
                data = JSON.parse(info).encryptSeedPhrase;
              }
              mnemonic = await decrypt(data, password, salt);
              if (mnemonic) {
                break;
              }
            } catch (e) {
              console.log(e);
            }
          }
          if (!mnemonic) {
            this.wrongPassword = true;
            this.passwordSpinning = false;
            return;
          }
        } else {
          isNewAccount = true;
          // MetaMask
          seed = generateMeatMaskSeed(password, this.signature);
          mnemonicString = ethers.utils.entropyToMnemonic(seed);
          mnemonic = mnemonicString
            .replace(/^\s+|\s+$/g, '')
            .replace(/\s+/g, ' ');
        }
        const root = ethers.utils.HDNode.fromMnemonic(mnemonic);
        const path = "m/44'/223'/0'/0/0";
        const keyPair = root.derivePath(path);
        currentIdentity = Secp256k1KeyIdentity.generate(
          new Uint8Array(hexToBytes(keyPair.privateKey))
        );
        this.passwordSpinning = false;
        this.$emit(
          'showMnemonic',
          mnemonic,
          currentIdentity,
          password,
          isNewAccount
        );
        return;
      }
      if (this.mnemonic) {
        mnemonic = this.mnemonic.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
        const root = ethers.utils.HDNode.fromMnemonic(mnemonic);
        const path = "m/44'/223'/0'/0/0";
        const keyPair = root.derivePath(path);
        currentIdentity = Secp256k1KeyIdentity.generate(
          new Uint8Array(hexToBytes(keyPair.privateKey))
        );
      } else if (this.identity) {
        currentIdentity = this.identity;
      }
      const arr = new Uint8Array(64);
      const salt = toHexString(window.crypto.getRandomValues(arr));
      const encryptIdentity = await encrypt(
        JSON.stringify(currentIdentity),
        password,
        salt
      );
      const principal = currentIdentity.getPrincipal().toString();
      // localStorage.setItem(principal, JSON.stringify(encryptIdentity));
      localStorage.setItem('principal', principal);
      this.setPrincipalId(principal);
      const principalList = JSON.parse(localStorage.getItem('priList')) || {};
      principalList[principal] = JSON.stringify({
        salt: salt,
        encryptIdentity: encryptIdentity
      });
      localStorage.setItem('priList', JSON.stringify(principalList));
      this.setIdentity(currentIdentity);
      localStorage.setItem('identity', localStorage.getItem('principal'));
      if (this.mnemonic) {
        const encryptSeedPhrase = await encrypt(mnemonic, password, salt);
        const phraseList = JSON.parse(localStorage.getItem('phraseList')) || {};
        phraseList[principal] = JSON.stringify({
          salt: salt,
          encryptSeedPhrase: encryptSeedPhrase
        });
        localStorage.setItem('phraseList', JSON.stringify(phraseList));
      }
      // sessionStorage.setItem('identity', JSON.stringify(currentIdentity));
      this.passwordSpinning = false;
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect as any).catch(() => {
          return;
        });
      } else {
        this.$router.push('/account').catch(() => {
          return;
        });
      }
    }, 20);
  }
  public confirmPasswordBack(): void {
    this.wrongPassword = false;
    (this.$refs.passwordForm as Vue & WrappedFormUtils).resetFields();
    this.$emit('confirmPasswordBack');
  }
}
</script>

<style scoped lang="scss">
.password-form {
  margin-top: 20px;
}
.password-tip {
  font-size: 16px;
}
.password-rule {
  margin-top: 10px;
  color: rgba(157, 157, 157, 0.6);
}
.password-spinning {
  margin: -30px -55px -90px;
}
::v-deep .ant-spin-container {
  padding: 30px 55px 90px;
}
.mnemonic-phrase-bottom {
  margin-top: 40px;
}
.wrong-password {
  display: flex;
  align-items: center;
  .error {
    color: #d13651;
  }
  .margin-left-auto {
    color: #51b7c3;
  }
}
@media screen and (max-width: 768px) {
  .password-spinning {
    margin: 0;
  }
  ::v-deep .ant-spin-container {
    padding: 0;
  }
}
</style>
