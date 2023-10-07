import { Component, Vue } from 'vue-property-decorator';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { Identity } from '@dfinity/agent';
import BigNumber from 'bignumber.js';
import { principalToAccountIdentifier } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { namespace } from 'vuex-class';

const commonModule = namespace('common');

@Component({})
export class BalanceMixin extends Vue {
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  @commonModule.Getter('getIdentity') getIdentity?: Identity;
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  public identity: Identity;
  // public account: string;
  public balance = '';
  public decimals = 8;
  public ledgerService: LedgerService | undefined;
  private timer = null;
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
  }
  created(): void {
    const principal = localStorage.getItem('principal');
    const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
    this.balance = currentInfo.balance || '0';
    this.identity = this.getIdentity;
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
    const balanceRes = await this.ledgerService.getBalances({
      account: this.account
    });
    if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
      this.balance = new BigNumber(balanceRes?.e8s.toString(10))
        .div(10 ** this.decimals)
        .toString(10);
    } else {
      this.balance = '0';
    }
    const principal = localStorage.getItem('principal');
    if (principal) {
      const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
      if (
        currentInfo.balance &&
        !new BigNumber(currentInfo.balance).eq(this.balance)
      ) {
        currentInfo.balance = this.balance;
      }
      localStorage.setItem(principal, JSON.stringify(currentInfo));
    }
  }
}
