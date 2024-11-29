import { IDL } from '@dfinity/candid';
import store from '@/store';
import { buildService } from '@/ic/Service';
import { ICXWhitelist } from '@/ic/utils';

const icxActor: { [key: string]: any } = {};
const icxIsAnonymous: { [key: string]: boolean } = {};

export const createIcxActor = async <T>(
  IDL: IDL.InterfaceFactory,
  canisterId: string
): Promise<T> => {
  const localWhitelist = JSON.parse(localStorage.getItem('icxWhitelist')) || [];
  let whitelist: Array<string> = localWhitelist || [];
  whitelist = [...new Set([...whitelist, ...ICXWhitelist])];
  if (
    icxActor &&
    icxActor[canisterId] &&
    ((whitelist.includes(canisterId) && !icxIsAnonymous[canisterId]) ||
      !whitelist.includes(canisterId))
  ) {
    return icxActor[canisterId];
  } else {
    const icx = store.getters['common/getIcx'];
    let isConnected = false;
    if (icx) {
      isConnected = await icx.isConnected();
    }
    if (whitelist.includes(canisterId) && isConnected) {
      icxActor[canisterId] = await icx.createActor(canisterId, IDL);
      icxIsAnonymous[canisterId] = false;
    } else {
      icxIsAnonymous[canisterId] = true;
      icxActor[canisterId] = await buildService(null, IDL, canisterId);
    }
    return icxActor[canisterId];
  }
};
