import { Component, Vue } from 'vue-property-decorator';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { Identity } from '@dfinity/agent';
import BigNumber from 'bignumber.js';
import { fromSubAccountId, principalToAccountIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { namespace } from 'vuex-class';
import { LEDGER_CANISTER_ID } from '@/ic/utils';

const commonModule = namespace('common');

@Component({})
export class BalanceMixin extends Vue {
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  @commonModule.Getter('getIdentity') getIdentity?: Identity;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  // public account: string;
  public balance = '';
  private balancePro = '';
  public decimals = 8;
  public ledgerService: LedgerService | undefined;
  private timer = null;
  private tokensBalanceMain: { [key: string]: string } = {};
  private tokensBalancePro: { [key: string]: string } = {};
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
  }
  created(): void {
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    this.balance = currentInfo.balance || '0';
    this.ledgerService = new LedgerService();
    // this.account = principalToAccountIdentifier(Principal.fromText(principal));
    if (principal) {
      this.getIcp();
    }
  }
  get account(): string {
    if (this.getPrincipalId) {
      return principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId)
      );
    } else {
      return '-';
    }
  }
  private getIcp(): void {
    this.getBalance().then();
    window.clearInterval(this.timer);
    this.timer = null;
    this.timer = window.setInterval(() => {
      setTimeout(() => {
        if (!this.getCheckAuth) {
          this.getBalance().then();
        }
      }, 0);
    }, 10 * 1000);
  }
  public async getBalance(): Promise<void> {
    this.getBalancePro();
    const balanceRes = await this.ledgerService.getBalances({
      account: this.account
    });
    if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
      this.balance = new BigNumber(balanceRes?.e8s.toString(10))
        .div(10 ** this.decimals)
        .toString(10);
      this.tokensBalanceMain[LEDGER_CANISTER_ID] = balanceRes?.e8s.toString(10);
    } else {
      this.balance = '0';
    }
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      if (
        (currentInfo.balance &&
          !new BigNumber(currentInfo.balance).eq(this.balance)) ||
        !currentInfo.balance
      ) {
        currentInfo.balance = this.balance;
      }
      localStorage.setItem(principal, JSON.stringify(currentInfo));
    }
  }
  public async getBalancePro(): Promise<void> {
    if (this.getPrincipalId) {
      const account = principalToAccountIdentifier(
        Principal.fromText(this.getPrincipalId),
        new Uint8Array(fromSubAccountId(1))
      );
      const balanceRes = await this.ledgerService.getBalances({
        account: account
      });
      if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
        this.balancePro = new BigNumber(balanceRes?.e8s.toString(10))
          .div(10 ** this.decimals)
          .toString(10);
        this.tokensBalancePro[LEDGER_CANISTER_ID] =
          balanceRes?.e8s.toString(10);
      } else {
        this.balancePro = '0';
      }
      const principal = localStorage.getItem('principal');
      if (principal) {
        const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
        if (
          (currentInfo.balancePro &&
            !new BigNumber(currentInfo.balancePro).eq(this.balancePro)) ||
          !currentInfo.balancePro
        ) {
          currentInfo.balancePro = this.balancePro;
        }
        localStorage.setItem(principal, JSON.stringify(currentInfo));
      }
    }
  }
}
