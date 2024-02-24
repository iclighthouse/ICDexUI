import { Metadata, TokenId, TokenStd } from '@/ic/common/icType';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { IcrcValue } from '@/ic/DRC20Token/model';

export const getTokenLogo = async (
  tokenId: TokenId,
  tokenStd: TokenStd
): Promise<string> => {
  let logo = '';
  const std = Object.keys(tokenStd)[0].toLocaleLowerCase();
  const DRC20Token = new DRC20TokenService();
  if (std === 'drc20') {
    const metadata = await DRC20Token.metadata(tokenId.toString());
    metadata.some((val: Metadata) => {
      if (val.name === 'logo') {
        logo = val.content;
        return true;
      }
    });
  } else if (std === 'dip20') {
    const info = await DRC20Token.getMetadata(tokenId.toString());
    logo = info.logo;
  } else if (std === 'icp') {
    logo = require('@/assets/img/dfinity.png');
  } else if (std === 'icrc1' || std === 'icrc2') {
    const res = await DRC20Token.icrc1Metadata(tokenId.toString());
    res.some((val: [string, IcrcValue]) => {
      if (val[0].includes('logo')) {
        logo = (
          val[1] as {
            Text: string;
          }
        ).Text;
        return true;
      }
    });
  }
  return logo;
};
