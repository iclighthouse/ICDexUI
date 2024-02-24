import { Component, Vue } from 'vue-property-decorator';
import { Gas, Token } from '@/ic/ICTokens/model';
import BigNumber from 'bignumber.js';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';

@Component({
  filters: {
    filterGas(val: Gas, currentToken: Token) {
      if (val) {
        const { token } = val as { token: bigint };
        if (token) {
          return `${new BigNumber(token.toString(10))
            .div(10 ** currentToken.decimals)
            .toString(10)}`;
        }
        const { cycles } = val as { cycles: bigint };
        if (cycles) {
          return `cycles:${cycles}`;
        }
        return 'noFee';
      }
      return '';
    }
  }
})
export class TokenInfoMixin extends Vue {
  private DRC20TokenService: DRC20TokenService;
  created(): void {
    this.DRC20TokenService = new DRC20TokenService();
  }
  public getTokenInfo(token: Token): void {
    this.getMetadata(token).then();
    this.getGas(token).then();
    this.getName(token).then();
    this.getSymbol(token).then();
    this.getDecimals(token).then();
    this.totalSupply(token).then();
    this.maxSupply(token).then();
  }
  public async maxSupply(token: Token): Promise<void> {
    try {
      const maxSupply = await this.DRC20TokenService.getMaxSupply(
        token.tokenId.toString()
      );
      if (maxSupply && maxSupply[0]) {
        token.maxSupply = maxSupply[0];
      }
    } catch (e) {
      token.maxSupply = null;
    }
    this.$forceUpdate();
  }
  public async totalSupply(token: Token): Promise<void> {
    // const decimals = await this.getDecimals(token);
    // totalSupply = BigInt(
    //   new BigNumber(totalSupply.toString()).div(
    //     new BigNumber(10).pow(decimals.toString())
    //   )
    // );
    token.totalSupply = await this.DRC20TokenService.totalSupply(
      token.tokenId.toString()
    );
    this.$forceUpdate();
  }
  public async getDecimals(token: Token): Promise<number> {
    token.decimals = await this.DRC20TokenService.decimals(
      token.tokenId.toString()
    );
    return token.decimals;
  }
  public async getSymbol(token: Token): Promise<void> {
    token.symbol = await this.DRC20TokenService.symbol(
      token.tokenId.toString()
    );
    this.$forceUpdate();
  }
  public async getName(token: Token): Promise<void> {
    token.name = await this.DRC20TokenService.name(
      token.tokenId.toString()
    );
    this.$forceUpdate();
  }
  public async getGas(token: Token): Promise<void> {
    token.gas = await this.DRC20TokenService.gas(
      token.tokenId.toString()
    );
  }
  public async getMetadata(token: Token): Promise<void> {
    const metadata = await this.DRC20TokenService.metadata(
      token.tokenId.toString()
    );
    token.metadata = metadata;
    const metadataType = [];
    metadata.some((val) => {
      metadataType.push(val.name);
      if (val.name === 'logo') {
        this.$set(token, 8, val.content);
      }
    });
    // todo
    if (!metadataType.includes('webUrl')) {
      metadata.push({ name: 'webUrl', content: '' });
    }
    if (!metadataType.includes('twitter')) {
      metadata.push({ name: 'twitter', content: '' });
    }
    if (!metadataType.includes('medium')) {
      metadata.push({ name: 'medium', content: '' });
    }
    if (!metadataType.includes('forum')) {
      metadata.push({ name: 'forum', content: '' });
    }
    this.$forceUpdate();
  }
}
