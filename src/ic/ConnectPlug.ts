import { plugWhitelist } from './utils';
import store from '@/store';
import router from '@/router';
import Vue from 'vue';
import { isPlug } from '@/ic/isPlug';
import { PlugTransport } from '@slide-computer/signer-transport-plug';
import {
  Signer,
  createCallCanisterPermissionScope
} from '@slide-computer/signer';
import { SignerAgent } from '@slide-computer/signer-agent';
import { Principal } from '@dfinity/principal';
import { PermissionState } from '@slide-computer/signer/lib/cjs/icrc25';
import { SignerPermissionScope } from '@slide-computer/signer/lib/cjs/signer';

let signerAgent: SignerAgent<Signer> | null = null;
export default class ConnectPlug {
  public connect = async (
    newWhitelist?: Array<string>,
    isSigner = false,
    isCheckAuth = true
  ): Promise<boolean> => {
    let whitelist: string[];
    if (newWhitelist && newWhitelist.length) {
      whitelist = [...new Set([...newWhitelist, ...plugWhitelist])];
    } else {
      whitelist = plugWhitelist;
    }
    const host = 'https://icp0.io';
    const requireAuth = router.app.$route.meta.requireAuth;
    if (!isCheckAuth && !requireAuth) {
      return false;
    }
    let loading;
    if (requireAuth) {
      loading = Vue.prototype.$loading({
        lock: true,
        customClass: 'create-wallet-loading',
        text: `Connecting Plug...`,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      loading.setText(
        'Connecting Plug... \n Please check that your Plug account is logged in.'
      );
    }
    try {
      // const connected = await (window as any).ic.plug.isConnected();
      // const isOpen = store.getters['common/getIsOpen'];
      // if (connected && !(window as any).ic.plug.agent && isOpen) {
      //   await (window as any).ic.plug.createAgent({
      //     whitelist: whitelist,
      //     host: host
      //   });
      // } else {
      //   await (window as any).ic.plug.requestConnect({
      //     host: host,
      //     whitelist: whitelist
      //   });
      // }
      console.log(host);
      console.log(whitelist);
      const res = await (window as any).ic.plug.requestConnect({
        host: host,
        whitelist: whitelist
      });
      console.log(res);
      if (process.env.NODE_ENV !== 'production') {
        // plugIc.plug.agent.fetchRootKey().catch((err) => {
        //   console.warn(
        //     'Unable to fetch root key. Check to ensure that your local replica is running'
        //   );
        //   console.log(err);
        // });
      }
      store.commit('common/SET_IS_OPEN', true);
      console.log(isSigner);
      await this.setLocalStorage(whitelist, isSigner);
      await this.connectSignerPlug();
      loading && loading.text && loading.close();
      return true;
    } catch (e) {
      console.log(e);
      loading && loading.text && loading.close();
      return false;
    }
  };
  public connectSignerPlug = async (): Promise<SignerAgent<Signer>> => {
    const transport = new PlugTransport();
    const signer = new Signer({ transport });
    // const permissions: Array<{
    //   scope: SignerPermissionScope;
    //   state: PermissionState;
    // }> = await signer.permissions();
    // const flag = permissions.some((item) => {
    //   return item.scope.method === 'icrc49_call_canister';
    // });
    // if (!flag) {
    //   await signer.requestPermissions([createCallCanisterPermissionScope()]);
    // }
    const principalId: string = (window as any).ic.plug.principalId;
    signerAgent = await SignerAgent.create({
      signer: signer,
      account: Principal.fromText(principalId)
    });
    return signerAgent;
  };
  public setLocalStorage = async (
    newWhitelist?: Array<string>,
    isSigner = false
  ): Promise<void> => {
    const principalId = await (window as any).ic.plug.agent.getPrincipal();
    if (newWhitelist && newWhitelist.length) {
      const whitelist = JSON.parse(localStorage.getItem('whitelist')) || {};
      whitelist[principalId.toString()] = newWhitelist;
      localStorage.setItem('whitelist', JSON.stringify(whitelist));
    }
    console.log(principalId.toString());
    localStorage.setItem('principal', principalId.toString());
    store.commit('common/SET_PRINCIPAL_ID', principalId.toString());
    const principalList = JSON.parse(localStorage.getItem('priList')) || {};
    console.log(isSigner);
    if (isSigner) {
      principalList[principalId.toString()] = 'SignerPlug';
    } else {
      principalList[principalId.toString()] = 'Plug';
    }
    localStorage.setItem('priList', JSON.stringify(principalList));
  };
  public addWhitelist = async (canisterId: string): Promise<boolean> => {
    const principal = localStorage.getItem('principal');
    const localWhitelist = JSON.parse(localStorage.getItem('whitelist')) || {};
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
  const localWhitelist = JSON.parse(localStorage.getItem('whitelist')) || {};
  const whitelist: string[] = localWhitelist[principal] || [];
  whitelist.splice(
    whitelist.findIndex((item) => item === canisterId),
    1
  );
  localWhitelist[principal] = whitelist;
  localStorage.setItem('whitelist', JSON.stringify(localWhitelist));
};
export const currentPageConnectPlug = async (
  canisterIds: Array<string>
): Promise<boolean> => {
  let whitelist = getWhitelist();
  whitelist = whitelist.concat(canisterIds);
  whitelist = [...new Set(whitelist)];
  if (whitelist.length) {
    store.commit('common/SET_SHOW_CHECK_AUTH', true);
    const connectPlug = new ConnectPlug();
    const principal = localStorage.getItem('principal');
    const priList = JSON.parse(localStorage.getItem('priList')) || {};
    const isSigner = priList[principal] === 'SignerPlug';
    const flag = await connectPlug.connect(whitelist, isSigner, false);
    store.commit('common/SET_SHOW_CHECK_AUTH', false);
    return flag;
  }
};
export const needConnectPlug = (canisterIds: Array<string>): boolean => {
  const whitelist = getWhitelist();
  if (
    !isPlug() ||
    !(window as any).ic ||
    ((window as any).ic && !(window as any).ic.plug)
  ) {
    return false;
  }
  return (
    !(window as any).ic.plug.agent ||
    ((window as any).ic.plug.agent &&
      !canisterIds.every((item) => whitelist.includes(item)))
  );
};
const getWhitelist = (): string[] => {
  const principal = localStorage.getItem('principal');
  const localWhitelist = JSON.parse(localStorage.getItem('whitelist')) || {};
  return localWhitelist[principal] || plugWhitelist;
};
export const canRequest = async (canisterId: string): Promise<boolean> => {
  return (isPlug() && getWhitelist().includes(canisterId)) || !isPlug();
};
export const getPlugSignerAgent = () => {
  return signerAgent;
};
