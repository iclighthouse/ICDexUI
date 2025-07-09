import AuthClientAPi from '@/ic/AuthClientApi';
import store from '@/store';
import { Identity } from '@dfinity/agent';
import { plugWhitelist } from '@/ic/utils';
import router from '@/router';
import { createSignerAgent, getNFIDSignerAgent } from '@/ic/NFIDAuth';
import { Principal } from '@dfinity/principal';
import { getOISYSignerAgent } from '@/ic/OISYAuth';
export interface CommonState {
  common: {
    showCheckAuth: boolean;
  };
}
const ONE_MINUTE_MILLIS = 60 * 1000;
let methods = [];
let isRefreshing = false;
/**
 * checkAuth
 * @param renew SET_EXPIRE_SESSION_TIMEOUT
 * @param canisterId
 */
export const checkAuth = (
  renew = true,
  canisterId?
): Promise<boolean | Identity> => {
  return new Promise((resolve) => {
    if ((window as any).icx) {
      store.commit('common/SET_SHOW_CHECK_AUTH', false);
      resolve(true);
      return;
    }
    const principal = localStorage.getItem('principal');
    if (store.getters['common/getIdentity']) {
      const identity = store.getters['common/getIdentity'] as Identity;
      if (identity && identity.getPrincipal().toString() !== principal) {
        location.reload();
      }
    }
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    if (priList[principal] === 'AuthClient') {
      AuthClientAPi.create().then((authClientAPi) => {
        const t = authClientAPi.getTimeUntilSessionExpiryMs();
        if (t - 5 * ONE_MINUTE_MILLIS <= 0) {
          refreshing(resolve);
        } else {
          if (!store.getters['common/getIdentity']) {
            const identity = authClientAPi.tryGetIdentity();
            store.commit('common/SET_IDENTITY', identity);
          }
          resolve(true);
        }
      });
    } else if (priList[principal] === 'SignerNFID') {
      if (!principal) {
        resolve(true);
      } else {
        refreshingPlugOrInfinity(resolve);
      }
    } else if (priList[principal] === 'OISY') {
      if (!principal) {
        resolve(true);
      } else {
        const signerAgent = getOISYSignerAgent();
        console.log(signerAgent);
        if (signerAgent && signerAgent.getPrincipal()) {
          resolve(true);
        } else {
          refreshingPlugOrInfinity(resolve);
        }
      }
    } else if (
      priList[principal] === 'Plug' ||
      priList[principal] === 'SignerPlug'
    ) {
      const principal = localStorage.getItem('principal');
      const localWhitelist =
        JSON.parse(localStorage.getItem('whitelist')) || {};
      const whitelist: string[] = localWhitelist[principal] || plugWhitelist;
      if (
        ((window as any).ic &&
          (!(window as any).ic.plug.agent ||
            !(window as any).ic.plug.principalId)) ||
        (canisterId && !whitelist.includes(canisterId))
      ) {
        refreshingPlugOrInfinity(resolve);
      } else {
        if ((window as any).ic && (window as any).ic.plug.agent) {
          (window as any).ic.plug.agent
            .getPrincipal()
            .then((currentPrincipal) => {
              if (currentPrincipal.toString() !== principal) {
                // router.go(0);
                resolve(false);
              } else {
                resolve(true);
              }
            });
        } else {
          resolve(true);
        }
      }
    } else if (priList[principal] === 'Infinity') {
      const principal = localStorage.getItem('principal');
      const localWhitelist =
        JSON.parse(localStorage.getItem('whitelistInfinity')) || {};
      const whitelist: string[] = localWhitelist[principal] || plugWhitelist;
      (window as any).ic.infinityWallet.isConnected().then((connected) => {
        if (!connected || (canisterId && !whitelist.includes(canisterId))) {
          refreshingPlugOrInfinity(resolve);
        } else {
          if (connected) {
            (window as any).ic.infinityWallet
              .getPrincipal()
              .then((currentPrincipal) => {
                if (currentPrincipal.toString() !== principal) {
                  router.go(0);
                } else {
                  resolve(true);
                }
              });
          } else {
            resolve(true);
          }
        }
      });
    } else {
      if (!principal) {
        resolve(true);
      } else {
        const identity = store.getters['common/getIdentity'];
        const t = store.getters['common/getExpireSessionTimeout'];
        if (
          (t < new Date().getTime() && router.app.$route.meta.requireAuth) ||
          !identity
        ) {
          refreshing(resolve);
        } else {
          if (renew) {
            store.commit('common/SET_EXPIRE_SESSION_TIMEOUT');
          }
          resolve(true);
        }
      }
    }
  });
};
function refreshingPlugOrInfinity(resolve) {
  if (!isRefreshing) {
    isRefreshing = true;
    store.commit('common/SET_SHOW_CHECK_AUTH', true);
    store.watch(
      (state: CommonState) => state.common.showCheckAuth,
      (newValue) => {
        if (!newValue) {
          methods.forEach((m) => m());
          methods = [];
          isRefreshing = false;
          resolve(true);
        }
      }
    );
  } else {
    methods.push(() => {
      resolve(true);
    });
  }
}
function refreshing(resolve) {
  if (!isRefreshing) {
    isRefreshing = true;
    store.commit('common/SET_SHOW_CHECK_AUTH', true);
    store.watch(
      (state: CommonState) => state.common.showCheckAuth,
      (newValue) => {
        // change the showCheckAuth to false then get new identity.
        if (!newValue) {
          const identity: Identity = store.getters['common/getIdentity'];
          methods.forEach((m) => m(identity));
          methods = [];
          isRefreshing = false;
          resolve(identity);
        }
      }
    );
  } else {
    methods.push((identity) => {
      resolve(identity);
    });
  }
}
const refreshingNFID = async (resolve) => {
  if (!isRefreshing) {
    isRefreshing = true;
    // const principal = localStorage.getItem('principal');
    store.commit('common/SET_SHOW_CHECK_AUTH', true);
    // await createSignerAgent(Principal.fromText(principal));
    // store.commit('common/SET_SHOW_CHECK_AUTH', false);
    store.watch(
      (state: CommonState) => state.common.showCheckAuth,
      (newValue) => {
        if (!newValue) {
          methods.forEach((m) => m());
          methods = [];
          isRefreshing = false;
          resolve(true);
        }
      }
    );
  } else {
    methods.push(() => {
      resolve(true);
    });
  }
};
