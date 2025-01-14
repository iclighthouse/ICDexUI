import { AstroXWebViewHandler } from '@astrox/sdk-webview';
import store from '@/store';
import { ICXWhitelist } from '@/ic/utils';
export const connectIcx = async (
  newWhitelist?: Array<string>
): Promise<boolean> => {
  await initIcx();
  const thisIcx = store.getters['common/getIcx'];
  const isConnected = await thisIcx.isConnected();
  if (!isConnected) {
    localStorage.removeItem('principal');
    store.commit('common/SET_PRINCIPAL_ID', null);
  }
  const localPrincipalWhitelist =
    JSON.parse(localStorage.getItem('icxWhitelist')) || [];
  if (!newWhitelist) {
    newWhitelist = [];
  }
  const whitelist = [
    ...new Set([...newWhitelist, ...localPrincipalWhitelist, ...ICXWhitelist])
  ];
  // localStorage.setItem('icxWhitelist', JSON.stringify(whitelist));
  return await connect(whitelist);
};
export const initIcx = async (): Promise<void> => {
  let thisIcx = store.getters['common/getIcx'];
  if (!thisIcx) {
    localStorage.removeItem('principal');
    store.commit('common/SET_PRINCIPAL_ID', null);
    try {
      thisIcx = new AstroXWebViewHandler();
      await thisIcx.init();
      if (thisIcx.identity) {
        const principal = thisIcx.getPrincipal();
        if (principal) {
          const icxPrincipals =
            JSON.parse(localStorage.getItem('icxPrincipals')) || [];
          icxPrincipals.push(principal.toString());
          localStorage.setItem('principal', principal.toString());
          localStorage.setItem('icxPrincipals', JSON.stringify(icxPrincipals));
          store.commit('common/SET_PRINCIPAL_ID', principal.toString());
        }
      }
      store.commit('common/SET_ICX', thisIcx);
    } catch (e) {
    }
  }
};
export const addIcxWhitelist = async (canisterId: string): Promise<boolean> => {
  let whitelist = JSON.parse(localStorage.getItem('icxWhitelist')) || [];
  // localStorage.setItem('icxWhitelist', JSON.stringify(whitelist));
  whitelist = whitelist.concat(canisterId);
  whitelist = [...new Set(whitelist)];
  if (whitelist.length) {
    store.commit('common/SET_SHOW_CHECK_AUTH', true);
    const flag = await connect(whitelist);
    store.commit('common/SET_SHOW_CHECK_AUTH', false);
    return flag;
  }
};
const connect = async (newWhitelist?: Array<string>): Promise<boolean> => {
  const thisIcx = store.getters['common/getIcx'];
  const currentPrincipal = localStorage.getItem('principal');
  try {
    let isConnect;
    if (thisIcx && thisIcx.identity) {
      const localPrincipalWhitelist =
        JSON.parse(localStorage.getItem('icxWhitelist')) || [];
      const flag =
        localPrincipalWhitelist.length === newWhitelist.length &&
        localPrincipalWhitelist.filter((t) => !newWhitelist.includes(t));
      const principal = localStorage.getItem('principal');
      if (!flag) {
        isConnect = await thisIcx.reconnect({
          delegationTargets: newWhitelist,
          host: window.origin
        });
      } else if (!principal) {
        isConnect = await thisIcx.connect({
          delegationTargets: newWhitelist,
          host: window.origin
        });
      }
    } else {
      isConnect = await thisIcx.connect({
        delegationTargets: newWhitelist,
        host: window.origin
      });
    }
    if (isConnect) {
      localStorage.setItem('icxWhitelist', JSON.stringify(newWhitelist));
      const principal = thisIcx.getPrincipal();
      if (principal) {
        localStorage.setItem('principal', principal.toString());
        if (currentPrincipal && currentPrincipal !== principal.toString()) {
          // Modal.info({
          //   content: 'ICDex need to be connected to the plug.',
          //   class: 'connect-plug',
          //   icon: 'connect-plug',
          //   okText: 'Confirm',
          //   onOk() {
          //     window.location.reload();
          //     store.commit('common/SET_PRINCIPAL_ID', principal.toString());
          //   }
          // })
          window.location.reload();
        } else {
          store.commit('common/SET_PRINCIPAL_ID', principal.toString());
        }
      } else {
        localStorage.removeItem('principal');
        store.commit('common/SET_PRINCIPAL_ID', null);
      }
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};
