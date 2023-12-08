import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { ICManagementService } from '@/ic/ICManagement/ICManagementService';
import {
  DexNameEnum,
  Pool,
  SelectTokenType,
  SwapTokenInfo
} from '@/views/home/ICSwap/model';
import {
  CYCLES_FINANCE_CANISTER_ID,
  LEDGER_CANISTER_ID,
  validatePrincipal
} from '@/ic/utils';
import { Icrc1Account, TokenId, TokenInfo, TokenStd } from '@/ic/common/icType';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { ICSwapService } from '@/ic/ICSwap/ICSwapService';
import {
  AccountBalance,
  DepositAccount,
  DexConfig,
  DexInfo,
  TokenLiquidity
} from '@/ic/ICSwap/model';
import { Config, Liquidity } from '@/ic/cyclesFinance/model';
import { Pairs } from '@/ic/ICSwapRouter/model';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { principalToAccountIdentifier } from '@/ic/converter';
import { namespace } from 'vuex-class';
import { icpOrCyclesToSwapTokenId } from '@/ic/icSwapUtils';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { currentPageConnectPlug, needConnectPlug } from '@/ic/ConnectPlug';
import { ManageWalletResponse } from '@/ic/ICLighthouse/model';
import { WalletService } from '@/ic/wallet/walletService';
import { isPlug } from '@/ic/isPlug';
import { getFee } from '@/ic/getTokenFee';
import { getDepositing, getTokenBalance } from '@/ic/getTokenBalance';
import { readState } from '@/ic/readState';
import TopUp from '@/components/topUp/Index.vue';
import { checkAuth } from '@/ic/CheckAuth';
import { isInfinity } from '@/ic/isInfinity';
import {
  currentPageConnectInfinity,
  needConnectInfinity
} from '@/ic/ConnectInfinity';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';
const commonModule = namespace('common');

@Component({
  components: {
    TopUp
  }
})
export class PairsMixin extends Vue {
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  @Prop({ type: Object, default: () => null })
  tokens!: { [key: string]: TokenInfo };
  @Prop({ type: Object, default: () => null })
  tokensBalance!: { [key: string]: string };
  @Prop({ type: Array, default: () => [] })
  tokenList!: Array<SwapTokenInfo>;
  @Prop({ type: Array, default: () => [] })
  currentPool!: Pool;
  public walletService: WalletService;
  public ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  public cyclesFinanceService: CyclesFinanceService;
  public tokenListLoading = false;
  public swapDecimals = 0;
  public toTokenList: Array<SwapTokenInfo> = [];
  public tokenSwapFrom: SwapTokenInfo = null;
  public tokenSwapTo: SwapTokenInfo = null;
  public swapFromAmount = '';
  public swapToAmount = '';
  public selectTokenType: SelectTokenType = 'from';
  public routerLoading = false;
  public swapId = '';
  public dexInfo: DexInfo = null;
  public config: Config | DexConfig = null;
  public liquidity: Liquidity | TokenLiquidity = null;
  public currentRoute: Array<Pairs> = null;
  private tokensBalanceTimer = null;
  private tokensBalanceLoading: { [key: string]: boolean } = {};
  public ledgerService: LedgerService | undefined;
  public searchTokens: Array<SwapTokenInfo> = [];
  public searchToken = '';
  private ICLighthouseService: ICLighthouseService;
  private ICManagementService: ICManagementService;
  private wallets: ManageWalletResponse[] = [];
  public cyclesCanister = '';
  public freezingThreshold = '0';
  public autoWithdraw = false;
  public depositAccount: DepositAccount = null;
  public depositAccountId = '';
  public accountBalance: AccountBalance = null;
  public depositing: { [key: string]: { [tokenId: string]: string } } = null;
  public refreshPairBalanceLoading = false;
  public refreshDepositBalanceLoading = {};
  public icpBalance = '';
  get currentTokens(): Array<SwapTokenInfo> {
    let currentTokens = null;
    if (this.searchToken) {
      currentTokens = this.searchTokens;
    } else if (this.selectTokenType === 'from') {
      currentTokens = this.tokenList;
    } else {
      currentTokens = this.toTokenList;
    }
    return currentTokens;
  }
  @Watch('tokenList', { deep: true })
  private tokenListChange(val) {
    if (val && val.length) {
      this.tokenListLoading = false;
    }
  }
  created(): void {
    this.walletService = new WalletService();
    this.cyclesFinanceService = new CyclesFinanceService();
    this.ICManagementService = new ICManagementService();
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.ICLighthouseService = new ICLighthouseService();
    this.ledgerService = new LedgerService();
    const tokenFromId = icpOrCyclesToSwapTokenId(
      this.$route.params.tokenFromId
    );
    const tokenToId = icpOrCyclesToSwapTokenId(this.$route.params.tokenToId);
    console.log(tokenFromId, tokenToId);
    if (!tokenFromId) {
      this.tokenSwapFrom = [
        Principal.fromText(LEDGER_CANISTER_ID),
        'ICP',
        { icp: null },
        {
          name: 'Icp',
          symbol: 'ICP',
          decimals: 8,
          fee: BigInt(10000),
          totalSupply: null,
          logo: require('@/assets/img/dfinity.png'),
          tokenStd: { icp: null }
        }
      ];
    }
    this.init().then(() => {
      //
    });
    console.log('created');
    this.getTokensBalanceInterval();
    this.getWallets().then(() => {
      //
    });
  }
  beforeDestroy(): void {
    window.clearInterval(this.tokensBalanceTimer);
    this.tokensBalanceTimer = null;
  }
  public topUpSuccess(): void {
    this.getCycles().then((r) => {
      //
    });
  }
  public async checkCycles(cyclesWallet: string): Promise<boolean> {
    let flag = true;
    const isCyclesWallet = this.wallets.some((wallet) => {
      return wallet.walletId.toString() === cyclesWallet;
    });
    if (!isCyclesWallet) {
      return flag;
    }
    let cycles;
    try {
      const res = await this.walletService.getWalletBalance(cyclesWallet);
      cycles = res.amount;
    } catch (e) {
      try {
        const status = await this.ICManagementService.canisterStatus(
          Principal.fromText(cyclesWallet)
        );
        if (status.canisterId === cyclesWallet) {
          cycles = status.cycles;
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (!cycles) {
      let state;
      try {
        state = await readState(this.cyclesCanister.trim());
      } catch (e) {
        console.log(e);
      }
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      console.log(state);
      if (!state || (state && !state.moduleHash)) {
        flag = false;
        this.$info({
          content:
            'Your Cycles Wallet Canister has been destroyed due to lack of Cycles for a long time, please create a new Cycles Wallet.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'OK',
          onOk() {
            that.$router.push('/account');
          }
        });
      } else {
        flag = false;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        this.$info({
          content:
            'Your Cycles Wallet Canister is frozen due to insufficient balance, please "top-up" a little Cycles to the wallet canister to reactivate it.',
          class: 'connect-plug',
          icon: 'connect-plug',
          okText: 'OK',
          onOk() {
            (that.$refs as any).topUp.topUpForm.to = cyclesWallet;
            (that.$refs as any).topUp.init();
            (that.$refs as any).topUp.visibleTopUp = true;
          }
        });
      }
    } else if (new BigNumber(cycles.toString(10)).lt(0.01 * 10 ** 12)) {
      flag = false;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      this.$info({
        content:
          'Your Cycles Wallet Canister is frozen due to insufficient balance, please "top-up" a little Cycles to the wallet canister to reactivate it.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'OK',
        onOk() {
          (that.$refs as any).topUp.topUpForm.to = cyclesWallet;
          (that.$refs as any).topUp.init();
          (that.$refs as any).topUp.visibleTopUp = true;
        }
      });
    }
    return flag;
  }
  public onchange(): void {
    this.autoWithdraw = !this.autoWithdraw;
  }
  public hasApprove(token: SwapTokenInfo): boolean {
    const noApproveToken = ['icp', 'icrc1', 'icrc2'];
    if (token && token[2]) {
      const std = Object.keys(token[2])[0].toLocaleLowerCase();
      return !noApproveToken.includes(std);
    }
    return true;
  }
  public hasDeposit(token: SwapTokenInfo): boolean {
    if (token[2]) {
      const tokenStd = Object.keys(token[2])[0];
      const hasDepositToken = ['icp', 'icrc1', 'icrc2'];
      return hasDepositToken.includes(tokenStd.toLocaleLowerCase());
    }
    return false;
  }
  public filterBalance(token: SwapTokenInfo): string {
    if (this.accountBalance) {
      if (this.isToken0(token)) {
        return new BigNumber(this.accountBalance.available0.toString(10))
          .div(10 ** token[3].decimals)
          .toString(10);
      } else {
        return new BigNumber(this.accountBalance.available1.toString(10))
          .div(10 ** token[3].decimals)
          .toString(10);
      }
    }
    return '-';
  }
  public showWithdraw(token: SwapTokenInfo): boolean {
    const balance = this.filterBalance(token);
    if (balance !== '-') {
      return new BigNumber(getFee(token[3]).toString())
        .div(10 ** token[3].decimals)
        .lt(balance);
    }
    return false;
  }
  public showFallback(token: SwapTokenInfo): boolean {
    if (
      this.depositing &&
      this.depositAccountId &&
      this.depositing[this.depositAccountId][token[0].toString()]
    ) {
      return new BigNumber(getFee(token[3]).toString()).lt(
        this.depositing[this.depositAccountId][token[0].toString()]
      );
    }
    return false;
  }
  public async fallback(): Promise<void> {
    const currentICSwapService = new ICSwapService();
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      setTimeout(async () => {
        if (this.swapId === CYCLES_FINANCE_CANISTER_ID) {
          await this.cyclesFinanceService.withdraw();
        } else {
          await currentICSwapService.fallback(this.swapId);
        }
        this.$message.success('Success');
        loading.close();
        this.getTokenBalance(
          this.tokenSwapFrom[2],
          this.tokenSwapFrom[0].toString()
        );
        this.getTokenBalance(
          this.tokenSwapTo[2],
          this.tokenSwapTo[0].toString()
        );
        this.getCurrentDepositing();
      }, 3 * 1000);
    } catch (e) {
      loading.close();
      console.error(e);
    }
  }
  public async withdrawBalance(): Promise<void> {
    const currentICSwapService = new ICSwapService();
    await checkAuth();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      await currentICSwapService.withdraw(this.swapId, [this.autoWithdraw]);
      this.$message.success('Withdraw Success');
    } catch (e) {
      console.error(e);
    }
    loading.close();
    this.getTokenBalance(
      this.tokenSwapFrom[2],
      this.tokenSwapFrom[0].toString()
    );
    this.getTokenBalance(this.tokenSwapTo[2], this.tokenSwapTo[0].toString());
    this.getPairBalance();
  }
  public needApprove(token: SwapTokenInfo, amount: string): boolean {
    if (
      this.accountBalance &&
      this.depositing &&
      this.depositAccountId &&
      token[3]
    ) {
      const total = this.getTokenDepositingAndPairBalance(token);
      return new BigNumber(total).div(10 ** token[3].decimals).lt(amount);
    }
    return true;
  }
  public getTokenDepositingAndPairBalance(token: SwapTokenInfo): BigNumber {
    let tokenPairBalance = new BigNumber(0);
    if (this.accountBalance) {
      if (this.isToken0(token)) {
        tokenPairBalance = new BigNumber(
          this.accountBalance.available0.toString()
        );
      } else {
        tokenPairBalance = new BigNumber(
          this.accountBalance.available1.toString()
        );
      }
    }
    let depositAmount = new BigNumber(0);
    if (this.depositing && this.depositing[this.depositAccountId]) {
      depositAmount = new BigNumber(
        this.depositing[this.depositAccountId][token[0].toString()]
      ).minus(getFee(token[3]).toString(10));
      if (depositAmount.lt(0)) {
        depositAmount = new BigNumber(0);
      }
    }
    return tokenPairBalance.plus(depositAmount);
  }
  public getSwapTokenMax(token: SwapTokenInfo): BigNumber {
    let max = new BigNumber(this.tokensBalance[token[0].toString()]).minus(
      getFee(token[3]).toString(10)
    );
    const std = Object.keys(token[2])[0];
    if (
      std.toLocaleLowerCase() === 'dip20' ||
      std.toLocaleLowerCase() === 'drc20'
    ) {
      max = max.minus(getFee(token[3]).toString(10));
    }
    if (max.lt(0)) {
      max = new BigNumber(0);
    }
    if (this.accountBalance) {
      let tokenPairBalance: BigNumber;
      if (this.isToken0(token)) {
        tokenPairBalance = new BigNumber(
          this.accountBalance.available0.toString()
        );
      } else {
        tokenPairBalance = new BigNumber(
          this.accountBalance.available1.toString()
        );
      }
      if (tokenPairBalance.gt(0)) {
        max = new BigNumber(max).plus(tokenPairBalance);
      }
    }
    if (this.depositing && this.depositing[this.depositAccountId]) {
      const depositAmount = new BigNumber(
        this.depositing[this.depositAccountId][token[0].toString()]
      ).minus(getFee(token[3]).toString(10));
      if (depositAmount.gt(0)) {
        max = new BigNumber(max).plus(depositAmount);
      }
    }
    console.log(max.toString(10));
    return max;
  }
  public setMax(token: SwapTokenInfo, type: string): void {
    const max = this.getSwapTokenMax(token);
    if (max.gt(0)) {
      const amount = max
        .div(10 ** token[3].decimals)
        .decimalPlaces(token[3].decimals, 1)
        .toString(10);
      if (type === 'from') {
        this.swapFromAmount = amount;
      } else {
        this.swapToAmount = amount;
      }
    } else {
      if (type === 'from') {
        this.swapFromAmount = '0';
      } else {
        this.swapToAmount = '0';
      }
    }
  }
  public async getDepositAccountId(): Promise<void> {
    const principal = localStorage.getItem('principal');
    if (principal) {
      if (this.swapId === CYCLES_FINANCE_CANISTER_ID) {
        this.depositAccountId = await this.cyclesFinanceService.getAccountId(
          principalToAccountIdentifier(Principal.fromText(principal))
        );
      } else {
        const currentSwapService = new ICSwapService();
        this.depositAccount = await currentSwapService.getDepositAccount(
          this.swapId,
          principal
        );
        this.depositAccountId = principalToAccountIdentifier(
          this.depositAccount[0].owner,
          new Uint8Array(this.depositAccount[0].subaccount[0])
        );
      }
    }

    console.log(this.depositAccount);
  }
  public async transferIcrc1(
    tokenId: string,
    amount: string,
    to: Icrc1Account
  ): Promise<void> {
    const currentDrc20Token = new DRC20TokenService();
    const tokenAmount = BigInt(
      new BigNumber(amount)
        .times(10 ** this.tokens[tokenId].decimals)
        .toString(10)
    );
    await currentDrc20Token.icrc1Transfer(tokenId, tokenAmount, to);
  }
  public async cyclesChange(): Promise<void> {
    this.$set(this.tokensBalance, CYCLES_FINANCE_CANISTER_ID, '-');
    this.$set(this.tokensBalanceLoading, CYCLES_FINANCE_CANISTER_ID, true);
    await this.getTokenBalance({ cycles: null }, this.cyclesCanister);
    this.freezingThreshold = '0';
  }
  private async getCycles(type?: string): Promise<bigint | string> {
    // if (!type || type !== 'Interval') {
    //   this.refreshCyclesLoading = true;
    // }
    if (this.cyclesCanister && validatePrincipal(this.cyclesCanister.trim())) {
      try {
        if (isPlug() || isInfinity()) {
          const res = await this.walletService.getWalletBalance(
            this.cyclesCanister.trim()
          );
          // todo
          this.freezingThreshold = new BigNumber(9997902)
            .div(1024 * 1024 * 1024)
            .times(127000)
            .times(new BigNumber(2592000).plus(60))
            .plus(10 ** 10)
            .toString(10);
          return res.amount;
        } else {
          if (Number(this.freezingThreshold)) {
            const res = await this.walletService.getWalletBalance(
              this.cyclesCanister.trim()
            );
            return res.amount;
          }
          const status = await this.ICManagementService.canisterStatus(
            Principal.fromText(this.cyclesCanister.trim())
          );
          if (status.canisterId === this.cyclesCanister.trim()) {
            // storing a GB per second which is 127000 cycles. Your canister has no compute allocation so only the memory consumption is important in this case. Given your canister is using ~2.5MB of memory which is 0.0025 GB, so the freezing balance should be 0.0025 * 127000 * 2592000 (freezing threshold in seconds) = 822_960_000 cycles
            this.freezingThreshold = new BigNumber(
              status.memory_size.toString(10)
            )
              .div(1024 * 1024 * 1024)
              .times(127000)
              .times(
                new BigNumber(
                  status.settings.freezing_threshold.toString(10)
                ).plus(60)
              )
              .plus(10 ** 10)
              .toString(10);
            return status.cycles;
          } else {
            return '-';
          }
        }
      } catch (e) {
        this.freezingThreshold = '0';
        console.log(e);
        return '-';
      }
      // this.buttonLoading = false;
    } else {
      return '-';
    }
    // if (!type || type !== 'Interval') {
    //   this.refreshCyclesLoading = false;
    // }
  }
  private async getWallets(): Promise<void> {
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const principal = localStorage.getItem('principal');
    const wallets = await this.ICLighthouseService.getWallets();
    const obj = {};
    this.wallets = wallets.reduce((cur, next) => {
      obj[next.walletId.toString()]
        ? ''
        : (obj[next.walletId.toString()] = true && cur.push(next));
      return cur;
    }, []);
    if (this.wallets.length) {
      for (let i = 0; i < this.wallets.length; i++) {
        if (this.wallets[i].isDefault) {
          this.cyclesCanister = this.wallets[i].walletId.toString();
          break;
        }
      }
      if (!this.cyclesCanister) {
        this.cyclesCanister = this.wallets[0].walletId.toString();
      }
      this.$set(this.tokensBalanceLoading, CYCLES_FINANCE_CANISTER_ID, true);
      await this.getTokenBalance({ cycles: null }, this.cyclesCanister);
      // this.formCyclesWalletPrincipal = this.cyclesCanister =
      //   this.wallets[0].walletId.toString();
      // this.getCycles();
    }
    if (priList[principal] === 'Plug') {
      this.connectPlug();
    }
  }
  private async connectPlug(): Promise<void> {
    const canisterIds = [];
    this.wallets.forEach((item) => {
      canisterIds.push(item.walletId.toString());
    });
    const flag = needConnectPlug(canisterIds);
    if (flag) {
      // const h = this.$createElement;
      this.$info({
        content: 'Cycles wallet need to be connected to the plug.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectPlug(canisterIds);
        }
      });
    }
    const connectInfinity = await needConnectInfinity(canisterIds);
    if (connectInfinity) {
      // const h = this.$createElement;
      this.$info({
        content: 'Cycles wallet need to be connected to the Infinity.',
        class: 'connect-plug',
        icon: 'connect-plug',
        okText: 'Confirm',
        onOk() {
          currentPageConnectInfinity(canisterIds);
        }
      });
    }
  }
  public searchTokenChange(): void {
    let currentTokens: Array<SwapTokenInfo>;
    if (this.selectTokenType === 'from') {
      currentTokens = this.tokenList;
    } else {
      currentTokens = this.toTokenList;
    }
    this.searchTokens = currentTokens.filter((item) => {
      return (
        item[0]
          .toString()
          .toLocaleLowerCase()
          .includes(this.searchToken.trim().toLocaleLowerCase()) ||
        item[3].name
          .toLocaleLowerCase()
          .includes(this.searchToken.trim().toLocaleLowerCase()) ||
        item[3].symbol
          .toLocaleLowerCase()
          .includes(this.searchToken.trim().toLocaleLowerCase())
      );
    });
  }
  public getTokensBalanceInterval(): void {
    this.tokensBalanceTimer = window.setInterval(() => {
      setTimeout(async () => {
        if (!this.getCheckAuth) {
          if (this.tokenSwapFrom) {
            await this.getTokenBalance(
              this.tokenSwapFrom[2],
              this.tokenSwapFrom[0].toString()
            );
          }
          if (this.tokenSwapTo) {
            await this.getTokenBalance(
              this.tokenSwapTo[2],
              this.tokenSwapTo[0].toString()
            );
          }
          const principal = localStorage.getItem('principal');
          const currentInfo = JSON.parse(localStorage.getItem(principal)) || {};
          const tokensBalance = currentInfo.tokensBalance || {};
          this.$emit('tokensBalanceChange', tokensBalance);
          if (this.swapId) {
            this.liquidity = await this.getLiquidity(this.swapId);
          }
        }
      }, 0);
    }, 20000);
  }
  public async init(): Promise<void> {
    const tokenFromId = icpOrCyclesToSwapTokenId(
      this.$route.params.tokenFromId
    );
    const tokenToId = icpOrCyclesToSwapTokenId(this.$route.params.tokenToId);
    if (tokenFromId) {
      if (!this.tokens[tokenFromId]) {
        const tokenInfo = await getTokenInfo(
          Principal.fromText(tokenFromId),
          null
        );
        this.tokenSwapFrom = [
          Principal.fromText(tokenFromId),
          tokenInfo.symbol,
          tokenInfo.tokenStd,
          tokenInfo
        ];
      } else {
        this.tokenSwapFrom = [
          Principal.fromText(tokenFromId),
          this.tokens[tokenFromId].symbol,
          this.tokens[tokenFromId].tokenStd,
          this.tokens[tokenFromId]
        ];
      }
    }
    if (tokenToId) {
      if (!this.tokens[tokenToId]) {
        const tokenInfo = await getTokenInfo(
          Principal.fromText(tokenToId),
          null
        );
        this.tokenSwapTo = [
          Principal.fromText(tokenToId),
          tokenInfo.symbol,
          tokenInfo.tokenStd,
          tokenInfo
        ];
      } else {
        this.tokenSwapTo = [
          Principal.fromText(tokenToId),
          this.tokens[tokenToId].symbol,
          this.tokens[tokenToId].tokenStd,
          this.tokens[tokenToId]
        ];
      }
    }
    if (tokenFromId && tokenToId) {
      console.log('getRouter');
      await this.getRouter();
      // const loading = this.$loading({
      //   lock: true,
      //   background: 'rgba(0, 0, 0, 0.5)'
      // });
      // try {
      //   if (this.$route.fullPath.startsWith('/ICSwap/addLiquidity')) {
      //     await this.initAddLiquidity();
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
      // loading.close();
    }
  }
  public async initAddLiquidity(): Promise<void> {
    this.currentRoute = await this.ICSwapRouterFiduciaryService.route(
      this.tokenSwapFrom[0],
      this.tokenSwapTo[0]
    );
  }
  public async initLiquidity(): Promise<void> {
    if (this.currentPool && this.currentPool.length) {
      if (!this.swapId) {
        this.tokenSwapFrom = [
          ...this.currentPool[1][0].token0,
          this.tokens[this.currentPool[1][0].token0[0].toString()]
        ];
        this.tokenSwapTo = [
          ...this.currentPool[1][0].token1,
          this.tokens[this.currentPool[1][0].token1[0].toString()]
        ];
        this.swapId = this.currentPool[0].toString();
        this.currentRoute = [
          [Principal.fromText(this.swapId), this.currentPool[1]]
        ];
      }
      const promiseAllValue = [];
      promiseAllValue.push(
        this.getLiquidity(this.swapId),
        this.getDexInfo(this.swapId),
        this.getConfig(this.swapId),
        this.getDepositAccountId(),
        this.getAutoWithdrawal(this.swapId)
      );
      const promiseAll = await Promise.all(promiseAllValue);
      console.log('setCurrentPool');
      this.getPairBalance();
      this.getCurrentDepositing();
      this.liquidity = promiseAll[0];
      console.log(this.liquidity);
      this.swapDecimals = this.currentPool[4];
      this.$forceUpdate();
    } else {
      const tokenToId = icpOrCyclesToSwapTokenId(this.$route.params.tokenToId);
      if (!tokenToId) {
        this.tokenSwapFrom = [
          Principal.from(LEDGER_CANISTER_ID),
          'ICP',
          { icp: null },
          {
            name: 'Icp',
            symbol: 'ICP',
            decimals: 8,
            fee: BigInt(10000),
            totalSupply: null,
            logo: require('@/assets/img/dfinity.png'),
            tokenStd: { icp: null }
          }
        ];
        this.tokenSwapTo = null;
      } else {
        console.log('setCurrentPool');
        this.$emit('setCurrentPool', this.swapId, this.currentRoute);
      }
    }
  }
  public async initSwap(): Promise<void> {
    try {
      const promiseAllValue = [];
      this.accountBalance = null;
      this.depositing = null;
      promiseAllValue.push(
        this.getDexInfo(this.swapId),
        this.getConfig(this.swapId),
        this.getDepositAccountId(),
        this.getAutoWithdrawal(this.swapId),
        this.getLiquidity(this.swapId),
        this.getSwapDecimals(this.swapId)
      );
      const promiseAll = await Promise.all(promiseAllValue);
      this.liquidity = promiseAll[4];
      this.swapDecimals = promiseAll[5];
      this.getPairBalance();
      this.getCurrentDepositing();
    } catch (e) {
      console.log(e);
    }
    // loading.close();
  }
  public async getTokenDepositing(
    tokenType: string,
    tokenStd: TokenStd,
    tokenId: string
  ): Promise<string> {
    if (this.depositAccount) {
      if (tokenType.toLocaleLowerCase() === 'icp') {
        return await getDepositing(tokenStd, '', this.depositAccount[0]);
      }
      if (tokenType.toLocaleLowerCase() === 'token') {
        return await getDepositing(tokenStd, tokenId, this.depositAccount[0]);
      }
    }
  }

  public async refreshDepositingBalance(
    tokenStd: TokenStd,
    tokenId: string
  ): Promise<void> {
    this.$set(this.refreshDepositBalanceLoading, tokenId, true);
    try {
      console.log(this.depositAccountId);
      const std = Object.keys(tokenStd)[0].toLocaleLowerCase();
      let balance: string;
      if (std === 'icp') {
        balance = await getDepositing(tokenStd, '', this.depositAccountId);
      } else {
        balance = await getDepositing(
          tokenStd,
          tokenId,
          this.depositAccount[0]
        );
      }
      this.depositing[this.depositAccountId][tokenId] = balance;
    } catch (e) {
      console.error(e);
    }
    this.refreshDepositBalanceLoading[tokenId] = false;
    this.$forceUpdate();
  }

  /**
   * change pair and then get current depositing
   */
  public async getCurrentDepositing(): Promise<void> {
    const token0Type = Object.keys(
      this.dexInfo.token0[0]
    )[0].toLocaleLowerCase();
    const token1Type = Object.keys(
      this.dexInfo.token1[0]
    )[0].toLocaleLowerCase();
    let token0Id: string;
    let token1Id: string;
    console.log(this.dexInfo);
    if (this.swapId === CYCLES_FINANCE_CANISTER_ID) {
      const balanceRes = await this.ledgerService.getBalances({
        account: this.depositAccountId
      });
      if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
        const depositBalance = balanceRes?.e8s.toString(10);
        this.depositing = {};
        this.depositing[this.depositAccountId] = {};
        this.depositing[this.depositAccountId][LEDGER_CANISTER_ID] =
          depositBalance;
        this.depositing[this.depositAccountId][CYCLES_FINANCE_CANISTER_ID] =
          '0';
      }
    } else {
      if (token0Type === 'icp') {
        token0Id = LEDGER_CANISTER_ID;
      } else if (token0Type === 'token') {
        token0Id = (
          this.dexInfo.token0[0] as { Token: TokenId }
        ).Token.toString();
      }
      if (token1Type === 'icp') {
        token1Id = LEDGER_CANISTER_ID;
      } else if (token0Type === 'token') {
        token1Id = (
          this.dexInfo.token1[0] as { Token: TokenId }
        ).Token.toString();
      }
      const promiseValue = [];
      promiseValue.push(
        this.getTokenDepositing(token0Type, this.dexInfo.token0[1], token0Id),
        this.getTokenDepositing(token1Type, this.dexInfo.token1[1], token1Id)
      );
      const res = await Promise.all(promiseValue);
      this.depositing = {};
      this.depositing[this.depositAccountId] = {};
      this.depositing[this.depositAccountId][token0Id] = res[0];
      this.depositing[this.depositAccountId][token1Id] = res[1];
    }
  }
  public filterFee(token: SwapTokenInfo, isIcp?: string): string {
    if (token) {
      if (token[2]) {
        const std = Object.keys(token[2])[0];
        if (
          isIcp &&
          std.toLocaleLowerCase() !== 'icp' &&
          std.toLocaleLowerCase() !== 'icrc1' &&
          std.toLocaleLowerCase() !== 'icrc2'
        ) {
          return '';
        }
      }
      try {
        if (
          typeof token[3].fee === 'bigint' ||
          typeof token[3].fee === 'string'
        ) {
          return new BigNumber(token[3].fee.toString(10))
            .div(10 ** token[3].decimals)
            .toString(10);
        } else if ((token[3].fee as { token: bigint }).token.toString()) {
          return new BigNumber(
            (token[3].fee as { token: bigint }).token.toString(10)
          )
            .div(10 ** token[3].decimals)
            .toString(10);
        }
      } catch (e) {
        return '';
      }
    }
    return '';
  }
  public async getPairsByToken(
    tokenId: TokenId,
    hasICDex = true
  ): Promise<void> {
    this.toTokenList = [];
    try {
      let res: Array<Pairs> = [];
      if (hasICDex) {
        res = await this.ICSwapRouterFiduciaryService.getPairsByToken(tokenId);
      } else {
        const routers = await Promise.all([
          this.ICSwapRouterFiduciaryService.getPairsByToken(tokenId, [
            DexNameEnum.cyclesfinance
          ]),
          this.ICSwapRouterFiduciaryService.getPairsByToken(tokenId, [
            DexNameEnum.icswap
          ])
        ]);
        if (routers[0] && routers[0].length) {
          res = res.concat(routers[0]);
        }
        if (routers[1] && routers[1].length) {
          res = res.concat(routers[1]);
        }
      }
      if (res && res.length) {
        res.forEach((pair) => {
          const token0 = pair[1][0].token0;
          const token1 = pair[1][0].token1;
          if (token0[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
            token0[1] = 'TCycles';
          }
          if (token1[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
            token1[1] = 'TCycles';
          }
          if (token0[0].toString() !== tokenId.toString()) {
            this.toTokenList.push([
              ...token0,
              this.tokens[token0[0].toString()]
            ]);
          }
          if (token1[0].toString() !== tokenId.toString()) {
            this.toTokenList.push([
              ...token1,
              this.tokens[token1[0].toString()]
            ]);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
    this.tokenListLoading = false;
  }
  public async getPairBalance(): Promise<void> {
    if (
      this.swapId &&
      this.depositAccount &&
      this.swapId !== CYCLES_FINANCE_CANISTER_ID
    ) {
      this.refreshPairBalanceLoading = true;
      const currentICSwapService = new ICSwapService();
      const principal = localStorage.getItem('principal');
      currentICSwapService
        .balance(this.swapId, principal)
        .then((balance) => {
          console.log(balance);
          this.accountBalance = balance;
        })
        .finally(() => {
          this.refreshPairBalanceLoading = false;
        });
    }
  }
  public async getTokenBalance(
    tokenStd: TokenStd,
    tokenId: string
  ): Promise<string> {
    let std;
    if (tokenStd) {
      std = Object.keys(tokenStd)[0];
    }
    try {
      if (tokenStd && std === 'cycles') {
        const principal = localStorage.getItem('principal');
        if (!principal) {
          return '';
        }
        this.$set(this.tokensBalanceLoading, CYCLES_FINANCE_CANISTER_ID, true);
        const cycles = await this.getCycles();
        this.$set(this.tokensBalanceLoading, CYCLES_FINANCE_CANISTER_ID, false);
        if (cycles === '-') {
          return '-';
        } else {
          this.$set(
            this.tokensBalance,
            CYCLES_FINANCE_CANISTER_ID,
            cycles.toString(10)
          );
          if (principal) {
            const currentInfo =
              JSON.parse(localStorage.getItem(principal)) || {};
            currentInfo.tokensBalance = this.tokensBalance;
            localStorage.setItem(principal, JSON.stringify(currentInfo));
          }
          return cycles.toString(10);
        }
      } else {
        if (!this.tokensBalanceLoading[tokenId]) {
          this.$set(this.tokensBalanceLoading, tokenId, true);
        }
        const tokenBalance = await getTokenBalance(tokenStd, tokenId);
        if (tokenStd && (tokenStd as { icp: null }).icp === null) {
          this.icpBalance = new BigNumber(tokenBalance)
            .div(10 ** 8)
            .toString(10);
        }
        this.$set(this.tokensBalanceLoading, tokenId, false);
        this.$set(this.tokensBalance, tokenId, tokenBalance);
      }
    } catch (e) {
      console.log(e);
      this.$set(this.tokensBalanceLoading, tokenId, false);
    }
  }
  public async getConfig(swapId: string): Promise<void> {
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      const cyclesFinanceService = new CyclesFinanceService();
      this.config = await cyclesFinanceService.getConfig();
    } else {
      const currentICSwapService = new ICSwapService();
      this.config = await currentICSwapService.getConfig(swapId);
    }
    console.log(this.config);
  }
  public async getAutoWithdrawal(swapId: string): Promise<void> {
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      this.autoWithdraw = true;
    } else {
      const principal = localStorage.getItem('principal');
      console.log(principal);
      const currentICSwapService = new ICSwapService();
      if (principal) {
        this.autoWithdraw = await currentICSwapService.autoWithdrawal(
          swapId,
          principal
        );
      }
    }
    console.log(this.autoWithdraw);
  }
  public async getDexInfo(swapId: string): Promise<void> {
    const currentICSwapService = new ICSwapService();
    this.dexInfo = await currentICSwapService.drc205_dexInfo(swapId);
    this.$forceUpdate();
  }
  public async getLiquidity(
    swapId: string,
    address?: string
  ): Promise<Liquidity | TokenLiquidity> {
    let account = [];
    if (address) {
      account = [address];
    }
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      const cyclesFinanceService = new CyclesFinanceService();
      return await cyclesFinanceService.liquidity(account);
    } else {
      const currentICSwapService = new ICSwapService();
      return await currentICSwapService.liquidity(swapId, account);
    }
  }
  public isToken0(tokenSwapInfo: SwapTokenInfo): boolean {
    let flag = false;
    if (!this.dexInfo) {
      return flag;
    }
    try {
      const tokenStd = Object.keys(tokenSwapInfo[2])[0].toLocaleLowerCase();
      const token0Std = Object.keys(
        this.dexInfo.token0[1]
      )[0].toLocaleLowerCase();
      if (tokenStd === token0Std) {
        if (token0Std === 'cycles' || token0Std === 'icp') {
          flag = true;
        } else {
          const tokenId = tokenSwapInfo[0].toString();
          const token0Id = Object.values(this.dexInfo.token0[0])[0].toString();
          if (tokenId === token0Id) {
            flag = true;
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    return flag;
  }
  public async getSwapDecimals(swapId: string): Promise<number> {
    if (swapId === CYCLES_FINANCE_CANISTER_ID) {
      return 0;
    }
    const currentICSwapService = new ICSwapService();
    return await currentICSwapService.decimals(swapId);
  }
  public async getRouter(): Promise<void> {
    this.routerLoading = true;
    this.accountBalance = null;
    this.depositing = null;
    try {
      console.time();
      if (this.tokenSwapFrom && this.tokenSwapTo) {
        const res = await this.ICSwapRouterFiduciaryService.route(
          this.tokenSwapFrom[0],
          this.tokenSwapTo[0]
        );
        this.currentRoute = res;
        this.swapId = this.currentRoute[0][0].toString();
        // todo
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        // const _that = this;
        // if (this.swapId === CYCLES_FINANCE_CANISTER_ID) {
        //   this.$confirm({
        //     content: 'Cycles/ICP pair will be switched to CyclesFinance.',
        //     class: 'connect-plug confirm-swap-button',
        //     icon: 'connect-plug',
        //     okText: 'OK',
        //     centered: true,
        //     onOk() {
        //       _that.$router.replace('/cyclesFinance');
        //     }
        //   });
        // }
        const token0 = res[0][1][0].token0;
        const token1 = res[0][1][0].token1;
        if (token0[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
          token0[1] = 'TCycles';
        }
        if (token1[0].toString() === CYCLES_FINANCE_CANISTER_ID) {
          token1[1] = 'TCycles';
        }
        const promiseAllValue = [];
        if (
          this.tokenSwapFrom[0].toString() === res[0][1][0].token0[0].toString()
        ) {
          this.tokenSwapFrom = [
            this.tokenSwapFrom[0],
            this.tokenSwapFrom[1],
            token0[2],
            Object.assign(this.tokenSwapFrom[3], {
              symbol: token0[1],
              tokenStd: token0[2]
            })
          ];
          this.tokenSwapTo = [
            this.tokenSwapTo[0],
            this.tokenSwapTo[1],
            token1[2],
            Object.assign(this.tokenSwapTo[3], {
              symbol: token1[1],
              tokenStd: token1[2]
            })
          ];
        } else {
          this.tokenSwapTo = [
            this.tokenSwapTo[0],
            this.tokenSwapTo[1],
            token0[2],
            Object.assign(this.tokenSwapTo[3], {
              symbol: token0[1],
              tokenStd: token0[2]
            })
          ];
          this.tokenSwapFrom = [
            this.tokenSwapFrom[0],
            this.tokenSwapFrom[1],
            token1[2],
            Object.assign(this.tokenSwapFrom[3], {
              symbol: token1[1],
              tokenStd: token1[2]
            })
          ];
        }
        const flag = needConnectPlug([this.swapId]);
        const principal = localStorage.getItem('principal');
        const priList = JSON.parse(localStorage.getItem('priList')) || {};
        const connectInfinity = await needConnectInfinity([this.swapId]);
        if (
          priList[principal] === 'Plug' &&
          flag &&
          this.$route.name === 'ICSwap'
        ) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const _that = this;
          // const h = this.$createElement;
          this.$info({
            content: 'ICSwap need to be connected to the plug.',
            class: 'connect-plug',
            icon: 'connect-plug',
            okText: 'Confirm',
            onOk() {
              currentPageConnectPlug([_that.swapId]).then(async () => {
                promiseAllValue.push(_that.getDexInfo(_that.swapId));
                await Promise.all(promiseAllValue);
                _that.$forceUpdate();
                _that.routerLoading = false;
                if (_that.swapId) {
                  if (_that.$route.fullPath.startsWith('/ICSwap/liquidity')) {
                    await _that.initLiquidity();
                  } else {
                    await _that.initSwap();
                  }
                } else {
                  if (_that.$route.fullPath.startsWith('/ICSwap/liquidity')) {
                    // await this.$router.push(`/ICSwap/swap/${this.swapId}`);
                  } else if (_that.$route.fullPath.startsWith('/ICSwap/swap')) {
                    await _that.$router.push(`/ICSwap/swap`);
                  }
                  _that.swapId = '';
                  _that.liquidity = null;
                  _that.dexInfo = null;
                }
              });
            }
          });
        } else if (
          priList[principal] === 'Infinity' &&
          connectInfinity &&
          this.$route.name === 'ICSwap'
        ) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const _that = this;
          // const h = this.$createElement;
          this.$info({
            content: 'ICSwap need to be connected to the Infinity.',
            class: 'connect-plug',
            icon: 'connect-plug',
            okText: 'Confirm',
            onOk() {
              currentPageConnectInfinity([_that.swapId]).then(async () => {
                promiseAllValue.push(_that.getDexInfo(_that.swapId));
                await Promise.all(promiseAllValue);
                _that.$forceUpdate();
                _that.routerLoading = false;
                if (_that.swapId) {
                  if (_that.$route.fullPath.startsWith('/ICSwap/liquidity')) {
                    await _that.initLiquidity();
                  } else {
                    await _that.initSwap();
                  }
                } else {
                  if (_that.$route.fullPath.startsWith('/ICSwap/liquidity')) {
                    // await this.$router.push(`/ICSwap/swap/${this.swapId}`);
                  } else if (_that.$route.fullPath.startsWith('/ICSwap/swap')) {
                    await _that.$router.push(`/ICSwap/swap`);
                  }
                  _that.swapId = '';
                  _that.liquidity = null;
                  _that.dexInfo = null;
                }
              });
            }
          });
        } else {
          promiseAllValue.push(this.getDexInfo(this.swapId));
          await Promise.all(promiseAllValue);
          this.$forceUpdate();
          if (this.swapId) {
            if (this.$route.fullPath.startsWith('/ICSwap/liquidity')) {
              this.initLiquidity();
            } else {
              this.initSwap();
            }
          } else {
            if (this.$route.fullPath.startsWith('/ICSwap/liquidity')) {
              // await this.$router.push(`/ICSwap/swap/${this.swapId}`);
            } else if (this.$route.fullPath.startsWith('/ICSwap/swap')) {
              await this.$router.push(`/ICSwap/swap`);
            }
            this.swapId = '';
            this.liquidity = null;
            this.dexInfo = null;
          }
          this.routerLoading = false;
        }
      }
      console.timeEnd();
      // this.routerLoading = false;
    } catch (e) {
      this.routerLoading = false;
    }
  }
}
