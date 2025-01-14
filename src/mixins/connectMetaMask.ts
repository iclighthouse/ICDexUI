import { Component, Vue } from 'vue-property-decorator';
import { getEthereumAccount } from '@/ic/utils';
import MetaMaskOnboarding from '@metamask/onboarding';
import {
  recoverTypedSignature,
  SignTypedDataVersion
} from '@metamask/eth-sig-util';
import { LoginType } from '@/views/login/model';
import { ellipsisAccount } from '@/filters';
let ethereum = (window as any).ethereum;
if (ethereum && ethereum.providers) {
  ethereum = ethereum.providers.find(
    (provider) => provider.isMetaMask
  );
}
@Component({})
export class ConnectMetaMaskMixin extends Vue {
  public metaMaskVisible = false;
  public connectSpinning = false;
  public signature = '';
  public ethAccount = '';
  public type: LoginType | null | string = null;
  //Created check function to see if the MetaMask extension is installed
  public isMetaMaskInstalled(): boolean {
    //Have to check the ethereum binding on the window object to see if it's installed
    return Boolean(ethereum && ethereum.isMetaMask);
  }
  public installMetaMask(): void {
    const forwarderOrigin = 'https://fwd.metamask.io';
    //We create a new MetaMask onboarding object to use in our app
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    //This will start the onboarding proccess
    onboarding.startOnboarding();
  }
  public async connectMetaMask(selectedAccount = ''): Promise<void> {
    if (!this.isMetaMaskInstalled()) {
      this.metaMaskVisible = true;
    } else {
      try {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x1') {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }]
          });
        }
        // Will open the MetaMask UI
        // You should disable this button while the request is pending!
        await ethereum.request({
          method: 'eth_requestAccounts'
        });
        const account = await getEthereumAccount();
        const principalList = JSON.parse(localStorage.getItem('priList')) || {};
        let principal = localStorage.getItem('principal');
        if (selectedAccount) {
          // loginByExists
          principal = selectedAccount;
        }
        const currentAccountInfo = principalList[principal];
        if (currentAccountInfo) {
          const currentAccount = currentAccountInfo.split('MetaMask-')[1];
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const _that = this;
          if (
            account !== currentAccount &&
            !this.$route.fullPath.toLocaleLowerCase().includes('/login')
          ) {
            this.$confirm({
              content: `Your ETH account ${ellipsisAccount(
                account
              )} does not match your local account ${ellipsisAccount(
                currentAccount
              )} and connection failed.Please switch account, or
      connect a new account.`,
              class: 'connect-plug connect-plug-metaMask',
              icon: 'connect-plug',
              centered: true,
              okText: 'Connect new account',
              cancelText: 'Confirm',
              onOk() {
                _that.$router.push('/login');
              },
              onCancel() {
                if (!selectedAccount) {
                  // loginByExists
                  _that.$router.go(0);
                }
              }
            });
            return;
          }
        }
        await this.sign(account);
      } catch (error) {
        this.connectSpinning = false;
      }
    }
  }
  public async sign(account: string): Promise<void> {
    const msgParams = {
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: 1,
        // Give a user friendly name to the specific contract you are signing for.
        name: 'Connect',
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1'
      },
      // Defining the message signing data content.
      message: {
        /*
       - Anything you want. Just a JSON Blob that encodes the data you want to send
       - No required fields
       - This is DApp Specific
       - Be as explicit as possible when building out the message schema.
      */
        title: 'Connection Confirmation',
        network: 'IC',
        wallet: 'ICLight.io'
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'Mail' as const,
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        // Refer to PrimaryType
        Mail: [
          { name: 'title', type: 'string' },
          { name: 'network', type: 'string' },
          { name: 'wallet', type: 'string' }
        ]
      }
    };
    const signature = await ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [account, JSON.stringify(msgParams)]
    });
    const recovered = recoverTypedSignature({
      data: msgParams,
      signature: signature,
      version: SignTypedDataVersion.V4
    });
    if (recovered === account) {
      this.signature = signature;
      this.ethAccount = account;
      this.type = 'MetaMask';
    } else {
      this.$message.error(
        'Failed to verify signer when comparing ' + signature + ' to ' + account
      );
    }
    this.connectSpinning = false;
  }
}
