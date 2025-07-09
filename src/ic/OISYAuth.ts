import store from '@/store';
import { SignerAgent } from '@slide-computer/signer-agent';
import {
  Signer,
  Transport,
  createCallCanisterPermissionScope
} from '@slide-computer/signer';
import { PostMessageTransport } from '@slide-computer/signer-web';
let signer: Signer | null = null;
let signerAgent: SignerAgent<Signer> | null = null;
export const OISYLogin = async (): Promise<SignerAgent<Signer>> => {
  try {
    try {
      const transport = new PostMessageTransport({
        url: 'https://oisy.com/sign',
        establishTimeout: 45000,
        disconnectTimeout: 45000
      });
      const channel = await transport.establishChannel();
      console.log(channel);
      await createSignerAgent(transport);
      const principal = await signerAgent.getPrincipal();
      setPrincipal(principal.toString());
      return signerAgent;
    } catch (e) {
      // Vue.prototype.$message.error('OISY login error.');
    }
    return signerAgent;
  } catch (e) {
    // Vue.prototype.$message.error('OISY login error.');
  }
};
export const OISYLogout = async (): Promise<void> => {
  try {
    if (signer) {
      await signer.closeChannel();
    }
  } catch (e) {}
};
const setPrincipal = (principal: string): void => {
  localStorage.setItem('principal', principal);
  store.commit('common/SET_PRINCIPAL_ID', principal);
  const principalList = JSON.parse(localStorage.getItem('priList')) || {};
  principalList[principal] = 'OISY';
  localStorage.setItem('priList', JSON.stringify(principalList));
  store.commit('common/SET_SHOW_CHECK_AUTH', false);
};
export const getOISYSignerAgent = () => {
  return signerAgent;
};
export const createSignerAgent = async (transport: Transport) => {
  signer = new Signer({
    transport: transport
  });
  const accounts = await signer.accounts();
  signerAgent = await SignerAgent.create({
    signer: signer,
    account: accounts[0].owner
  });
};
