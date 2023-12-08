import { Metadata, TokenId, TokenInfo, TokenStd } from '@/ic/common/icType';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { CYCLES_FINANCE_CANISTER_ID, LEDGER_CANISTER_ID } from '@/ic/utils';
import { IcrcValue } from '@/ic/DRC20Token/model';
const DRC20Token = new DRC20TokenService();
export const getTokenInfo = async (
  tokenId: TokenId,
  tokenStd: TokenStd
): Promise<TokenInfo> => {
  let tokenInfo: TokenInfo = {
    name: '',
    symbol: '',
    decimals: null,
    fee: { noFee: null },
    totalSupply: null,
    logo: '',
    tokenStd: tokenStd
  };
  if (
    tokenId.toString() === CYCLES_FINANCE_CANISTER_ID ||
    (tokenStd && (tokenStd as { cycles: null }).cycles === null)
  ) {
    tokenInfo.name = 'Cycles';
    tokenInfo.symbol = 'TCycles';
    tokenInfo.fee = BigInt(0);
    tokenInfo.decimals = 12;
    tokenInfo.logo = require('@/assets/img/cycles.png');
  } else if (
    tokenId.toString() === LEDGER_CANISTER_ID ||
    (tokenStd && (tokenStd as { icp: null }).icp === null)
  ) {
    tokenInfo.name = 'Icp';
    tokenInfo.symbol = 'ICP';
    tokenInfo.fee = BigInt(10000);
    tokenInfo.decimals = 8;
    tokenInfo.logo = require('@/assets/img/dfinity.png');
  } else if (tokenStd && (tokenStd as { drc20: null }).drc20 === null) {
    tokenInfo = await getDrc20TokenInfo(tokenId.toString(), tokenInfo);
  } else if (tokenStd && (tokenStd as { dip20: null }).dip20 === null) {
    tokenInfo = await getDip20TokenInfo(tokenId.toString(), tokenInfo);
  } else if (
    tokenStd &&
    ((tokenStd as { icrc1: null }).icrc1 === null ||
      (tokenStd as { icrc2: null }).icrc2 === null)
  ) {
    tokenInfo = await getIcrc1TokenInfo(tokenId.toString(), tokenInfo);
  } else {
    tokenInfo = await getDip20TokenInfo(tokenId.toString(), tokenInfo);
  }
  const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
  if (!tokens[tokenId.toString()]) {
    tokens[tokenId.toString()] = {
      name: tokenInfo.name,
      decimals: tokenInfo.decimals,
      symbol: tokenInfo.symbol,
      price: '',
      tokenStd: tokenInfo.tokenStd,
      fee: tokenInfo.fee
    };
    localStorage.setItem(
      'tokens',
      JSON.stringify(
        tokens,
        (key, value) => (typeof value === 'bigint' ? value.toString(10) : value) // return everything else unchanged
      )
    );
  }
  return tokenInfo;
};
const getDrc20TokenInfo = async (
  tokenId: string,
  tokenInfo: TokenInfo
): Promise<TokenInfo> => {
  const promiseAllValue = [];
  promiseAllValue.push(
    DRC20Token.name(tokenId),
    DRC20Token.symbol(tokenId),
    DRC20Token.decimals(tokenId),
    DRC20Token.gas(tokenId),
    DRC20Token.totalSupply(tokenId),
    DRC20Token.metadata(tokenId)
  );
  // const token = await Promise.all(promiseAllValue);
  return Promise.all(promiseAllValue).then((token) => {
    tokenInfo.name = token[0];
    tokenInfo.symbol = token[1];
    tokenInfo.decimals = token[2];
    tokenInfo.fee = token[3];
    tokenInfo.totalSupply = token[4];
    const metadata = token[5];
    metadata.some((val: Metadata) => {
      if (val.name === 'logo') {
        tokenInfo.logo = val.content;
        return true;
      }
    });
    return tokenInfo;
  });
  // return tokenInfo;
};
const getDip20TokenInfo = async (
  tokenId: string,
  tokenInfo: TokenInfo
): Promise<TokenInfo> => {
  // const info = await DRC20Token.getMetadata(tokenId);
  return DRC20Token.getMetadata(tokenId).then((info) => {
    tokenInfo.name = info.name;
    tokenInfo.symbol = info.symbol;
    tokenInfo.decimals = info.decimals;
    tokenInfo.fee = info.fee;
    tokenInfo.totalSupply = info.totalSupply;
    tokenInfo.logo = info.logo;
    return tokenInfo;
  });
};
const getIcrc1TokenInfo = async (
  tokenId: string,
  tokenInfo: TokenInfo
): Promise<TokenInfo> => {
  const promiseAllValue = [];
  promiseAllValue.push(
    DRC20Token.icrcName(tokenId),
    DRC20Token.icrcSymbol(tokenId),
    DRC20Token.icrcDecimals(tokenId),
    DRC20Token.icrcFee(tokenId),
    DRC20Token.icrcTotalSupply(tokenId),
    DRC20Token.icrc1Metadata(tokenId)
  );
  // const token = await Promise.all(promiseAllValue);
  return Promise.all(promiseAllValue).then((token) => {
    tokenInfo.name = token[0];
    tokenInfo.symbol = token[1];
    tokenInfo.decimals = token[2];
    tokenInfo.fee = token[3];
    tokenInfo.totalSupply = token[4];
    const metadata = token[5];
    metadata.some((val: [string, IcrcValue]) => {
      if (val[0].includes('logo')) {
        tokenInfo.logo = (
          val[1] as {
            Text: string;
          }
        ).Text;
        return true;
      }
    });
    return tokenInfo;
  });
};
