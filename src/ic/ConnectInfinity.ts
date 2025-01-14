import { plugWhitelist } from './utils';
import store from '@/store';
import router from '@/router';
import Vue from 'vue';
import { isInfinity } from '@/ic/isInfinity';
export default class ConnectInfinity {
  public connect = async (
    newWhitelist?: Array<string>,
    isCheckAuth = true
  ): Promise<boolean> => {
    let whitelist: string[];
    if (newWhitelist && newWhitelist.length) {
      whitelist = [...new Set([...newWhitelist, ...plugWhitelist])];
    } else {
      whitelist = plugWhitelist;
    }
    const host = window.origin;
    const requireAuth = router.app.$route.meta.requireAuth;
    if (!isCheckAuth && !requireAuth) {
      return false;
    }
    let loading;
    if (requireAuth) {
      loading = Vue.prototype.$loading({
        lock: true,
        text: 'Initialized Infinity...',
        background: 'rgba(0, 0, 0, 0.5)'
      });
      loading.setText('Initialized Infinity...');
    }
    try {
      await (window as any).ic.infinityWallet.requestConnect({
        host: host,
        whitelist: whitelist
      });
      if (process.env.NODE_ENV !== 'production') {
        (window as any).ic.infinityWallet.agent.fetchRootKey().catch((err) => {
          console.warn(
            'Unable to fetch root key. Check to ensure that your local replica is running'
          );
        });
      }
      store.commit('common/SET_IS_OPEN', true);
      await this.setLocalStorage(whitelist);
      loading && loading.text && loading.close();
      return true;
    } catch (e) {
      loading && loading.text && loading.close();
      return false;
    }
  };
  public setLocalStorage = async (
    newWhitelist?: Array<string>
  ): Promise<void> => {
    const principalId = await (window as any).ic.infinityWallet.getPrincipal();
    if (newWhitelist && newWhitelist.length) {
      const whitelist =
        JSON.parse(localStorage.getItem('whitelistInfinity')) || {};
      whitelist[principalId.toString()] = newWhitelist;
      localStorage.setItem('whitelistInfinity', JSON.stringify(whitelist));
    }
    localStorage.setItem('principal', principalId.toString());
    store.commit('common/SET_PRINCIPAL_ID', principalId.toString());
    const principalList = JSON.parse(localStorage.getItem('priList')) || {};
    principalList[principalId.toString()] = 'Infinity';
    localStorage.setItem('priList', JSON.stringify(principalList));
  };
  public addWhitelist = async (canisterId: string): Promise<boolean> => {
    const principal = localStorage.getItem('principal');
    const localWhitelist =
      JSON.parse(localStorage.getItem('whitelistInfinity')) || {};
    let whitelist: string[] = localWhitelist[principal] || plugWhitelist;
    whitelist = whitelist.concat(canisterId);
    whitelist = [...new Set(whitelist)];
    if (whitelist.length) {
      store.commit('common/SET_SHOW_CHECK_AUTH', true);
      const flag = await this.connect(whitelist);
      store.commit('common/SET_SHOW_CHECK_AUTH', false);
      return flag;
    }
  };
}
export const removeWhitelist = (canisterId: string): void => {
  const principal = localStorage.getItem('principal');
  const localWhitelist =
    JSON.parse(localStorage.getItem('whitelistInfinity')) || {};
  const whitelist: string[] = localWhitelist[principal] || [];
  whitelist.splice(
    whitelist.findIndex((item) => item === canisterId),
    1
  );
  localWhitelist[principal] = whitelist;
  localStorage.setItem('whitelistInfinity', JSON.stringify(localWhitelist));
};
export const currentPageConnectInfinity = async (
  canisterIds: Array<string>
): Promise<boolean> => {
  let whitelist = getWhitelist();
  whitelist = whitelist.concat(canisterIds);
  whitelist = [...new Set(whitelist)];
  if (whitelist.length) {
    store.commit('common/SET_SHOW_CHECK_AUTH', true);
    const connectInfinity = new ConnectInfinity();
    const flag = await connectInfinity.connect(whitelist, false);
    store.commit('common/SET_SHOW_CHECK_AUTH', false);
    return flag;
  }
};
export const needConnectInfinity = async (
  canisterIds: Array<string>
): Promise<boolean> => {
  const whitelist = getWhitelist();
  if (!isInfinity() || !(window as any).ic || ((window as any).ic && !(window as any).ic.infinityWallet)) {
    return false;
  }
  const connected = await (window as any).ic.infinityWallet.isConnected();
  return (
    !connected ||
    (connected && !canisterIds.every((item) => whitelist.includes(item)))
  );
};
const getWhitelist = (): string[] => {
  const principal = localStorage.getItem('principal');
  const localWhitelist =
    JSON.parse(localStorage.getItem('whitelistInfinity')) || {};
  return localWhitelist[principal] || plugWhitelist;
};
export const canRequest = async (canisterId: string): Promise<boolean> => {
  return (isInfinity() && getWhitelist().includes(canisterId)) || !isInfinity();
};
