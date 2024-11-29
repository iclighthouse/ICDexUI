import { NFID } from '@nfid/embed/src';
import { Identity } from '@dfinity/agent';
import store from '@/store';
import { DelegationIdentity } from '@dfinity/identity';
import { SignerAgent } from '@slide-computer/signer-agent';
import { Signer } from '@slide-computer/signer';
import { PostMessageTransport } from '@slide-computer/signer-web';
import { Principal } from '@dfinity/principal';

let nfid: NFID | null = null;
const ONE_MINUTE_MILLIS = 60 * 1000;
const SESSION_TIMEOUT = BigInt('7200000000000'); // 120 mins
const APPLICATION_NAME = 'ICLight';
const APPLICATION_LOGO_URL = 'https://iclight.house/img/logo.png';
let signer: Signer | null = null;
let signerAgent: SignerAgent<Signer> | null = null;

export const NFIDLogin = async (
  isSigner = false
): Promise<SignerAgent<Signer>> => {
  try {
    let derivationOrigin = 'https://7vkf4-jqaaa-aaaaj-azrua-cai.icp0.io';
    if (process.env.NODE_ENV !== 'production') {
      derivationOrigin = window.location.origin;
    }
    console.log(nfid);
    try {
      if (nfid && nfid.isAuthenticated) {
        if (nfid.getIdentity()) {
          const durationUntilSessionExpiresMs = getTimeUntilSessionExpiryMs(
            nfid.getIdentity()
          );
          console.log(durationUntilSessionExpiresMs);
          if (
            durationUntilSessionExpiresMs ||
            durationUntilSessionExpiresMs === 0
          ) {
            const durationUntilLogoutMs =
              durationUntilSessionExpiresMs - ONE_MINUTE_MILLIS;
            if (durationUntilLogoutMs <= 0) {
              // logout().then((r) => {
              //   console.log(r);
              //   console.log(nfid);
              // });
            } else {
              setIdentity(
                nfid.getIdentity().getPrincipal().toString(),
                nfid.getIdentity(),
                isSigner
              );
              console.log(nfid.getIdentity());
              if (isSigner) {
                await createSignerAgent(nfid.getIdentity().getPrincipal());
              }
              return signerAgent;
            }
          }
        }
      }
      const delegationIdentity: Identity = await nfid.getDelegation({
        targets: [],
        derivationOrigin: derivationOrigin,
        maxTimeToLive: SESSION_TIMEOUT
      });
      setIdentity(
        delegationIdentity.getPrincipal().toString(),
        delegationIdentity,
        isSigner
      );
      console.log(delegationIdentity.getPrincipal().toString());
      if (isSigner) {
        await createSignerAgent(nfid.getIdentity().getPrincipal());
      }
      return signerAgent;
    } catch (e) {
      console.log(e);
      // Vue.prototype.$message.error('NFID login error.');
    }
    return signerAgent;
  } catch (e) {
    console.log(e);
    // Vue.prototype.$message.error('NFID login error.');
  }
};
export const NFIDLogout = async (): Promise<void> => {
  try {
    console.log('NFIDLogout');
    if (nfid) {
      await nfid.logout();
    }
  } catch (e) {
    console.log(e);
  }
};
const setIdentity = (
  principal: string,
  identity: Identity,
  isSigner: boolean
): void => {
  console.log(principal);
  localStorage.setItem('principal', principal);
  store.commit('common/SET_PRINCIPAL_ID', principal);
  const principalList = JSON.parse(localStorage.getItem('priList')) || {};
  if (isSigner) {
    principalList[principal] = 'SignerNFID';
  } else {
    principalList[principal] = 'NFID';
  }
  localStorage.setItem('priList', JSON.stringify(principalList));
  store.commit('common/SET_IDENTITY', identity);
  localStorage.setItem('identity', localStorage.getItem('principal'));
  store.commit('common/SET_SHOW_CHECK_AUTH', false);
};
/**
 * @returns the amount of time in ms remaining for the session to expire.
 * Null is returned if the session doesn't expire or if the user isn't logged in.
 */
const getTimeUntilSessionExpiryMs = (identity: Identity): number => {
  if (identity instanceof DelegationIdentity) {
    const expiryDateTimestampMs = Number(
      identity
        .getDelegation()
        .delegations.map((d) => d.delegation.expiration)
        .reduce((current, next) => (next < current ? next : current)) /
        BigInt(1_000_000)
    );
    return expiryDateTimestampMs - Date.now();
  }
  return null;
};
export const getNFID = async () => {
  if (nfid) {
    return nfid;
  }
  nfid = await NFID.init({
    application: {
      name: APPLICATION_NAME,
      logo: APPLICATION_LOGO_URL
    },
    keyType: 'Ed25519',
    idleOptions: { idleTimeout: 1000 * 60 * 60 * 24 }
  });
  return nfid;
};
export const getNFIDIdentity = (): Identity => {
  try {
    return nfid.getIdentity();
  } catch (e) {
    console.log(e);
    return null;
  }
};
export const getNFIDSignerAgent = () => {
  return signerAgent;
};
export const createSignerAgent = async (account: Principal) => {
  console.log(account.toString());
  const transport = new PostMessageTransport({
    url: 'https://nfid.one/rpc',
    disconnectTimeout: 1000 * 1000
  });
  signer = new Signer({
    transport: transport
  });
  console.log(signer);
  // if (transport.connection && !transport.connection.connected) {
  //   await transport.connection.connect();
  // }
  // await signer.openChannel();
  // await signer.requestPermissions([createCallCanisterPermissionScope()]);
  signerAgent = await SignerAgent.create({
    signer: signer,
    account: account
  });
  console.log(signerAgent);
  // const principalList = JSON.parse(localStorage.getItem('priList')) || {};
  // principalList[account.toString()] = 'NFID';
  // localStorage.setItem('priList', JSON.stringify(principalList));
};
