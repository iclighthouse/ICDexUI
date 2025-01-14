import { Component, Vue } from 'vue-property-decorator';
import { ICStableService } from '@/ic/ICStable/ICStableService';
import { StableToken, StableTokenInfo } from '@/ic/ICStable/model';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { getTokenLogo } from '@/ic/getTokenLogo';
import { DUSD_CANISTER_ID } from '@/ic/utils';
@Component({})
export class StableTokensMixin extends Vue {
  public ICStableService: ICStableService;
  public tokens: { [key: string]: StableTokenInfo } = {};
  public stableTokens: Array<StableToken> = [];
  public collateralTokens: Array<StableToken> = [];
  public depositAmountsInput: { [key: string]: string } = {};
  created(): void {
    this.ICStableService = new ICStableService();
    this.getTokens().then((r) => {
      //
    });
  }
  private async getTokens(): Promise<void> {
    const tokens = await this.ICStableService.tokens();
    this.stableTokens = tokens.filter((item) => {
      return item[0].toString() !== DUSD_CANISTER_ID;
    });
    // todo
    this.collateralTokens = tokens.filter((item) => {
      return item[0].toString() === '2q3hv-5aaaa-aaaak-aaoqq-cai';
    });
    this.depositAmountsInput[this.collateralTokens[0][0].toString()] = '';
    const DRC20Token = new DRC20TokenService();
    const localTokens = JSON.parse(localStorage.getItem('tokens')) || {};
    for (let i = 0; i < tokens.length; i++) {
      const tokenId = tokens[i][0].toString();
      if (!localTokens[tokenId]) {
        const std = Object.keys(tokens[i][1].std)[0];
        if (std === 'drc20') {
          DRC20Token.name(tokenId).then((name) => {
            localTokens[tokenId] = {
              name: name,
              symbol: tokens[i][1].symbol,
              decimals: tokens[i][1].decimals,
              fee: tokens[i][1].gasToken.toString(10),
              price: '',
              tokenStd: tokens[i][1].std
            };
            localStorage.setItem(
              'tokens',
              JSON.stringify(
                localTokens,
                (key, value) =>
                  typeof value === 'bigint' ? value.toString(10) : value // return everything else unchanged
              )
            );
          });
        } else {
          DRC20Token.tokenName(tokenId).then((name) => {
            localTokens[tokenId] = {
              name: name,
              symbol: tokens[i][1].symbol,
              decimals: tokens[i][1].decimals,
              fee: tokens[i][1].gasToken.toString(10),
              price: '',
              tokenStd: tokens[i][1].std
            };
            localStorage.setItem(
              'tokens',
              JSON.stringify(
                localTokens,
                (key, value) =>
                  typeof value === 'bigint' ? value.toString(10) : value // return everything else unchanged
              )
            );
          });
        }
      }
      this.$set(this.tokens, tokenId, tokens[i][1]);
      getTokenLogo(tokens[i][0], tokens[i][1].std).then((logo) => {
        this.$set(
          this.tokens,
          tokenId,
          Object.assign(this.tokens[tokens[i][0].toString()], { logo: logo })
        );
      });
    }
  }
}
