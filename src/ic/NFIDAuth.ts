import { NFID } from '@nfid/embed/src';
import { Identity } from '@dfinity/agent';
import store from '@/store';
import { DelegationIdentity } from '@dfinity/identity';

let nfid: NFID | null = null;
const ONE_MINUTE_MILLIS = 60 * 1000;
const SESSION_TIMEOUT = BigInt('7200000000000'); // 120 mins
const APPLICATION_NAME = 'ICLight';
const APPLICATION_LOGO_URL = 'https://iclight.house/img/logo.png';

export const nfidEmbedLogin = async (nfid: NFID): Promise<Identity> => {
  let derivationOrigin = 'https://7vkf4-jqaaa-aaaaj-azrua-cai.icp0.io';
  if (process.env.NODE_ENV !== 'production') {
    derivationOrigin = window.location.origin;
  }
  console.log(nfid);
  try {
    if (nfid.isAuthenticated) {
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
              nfid.getIdentity()
            );
            console.log(nfid.getIdentity());
            return nfid.getIdentity();
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
      delegationIdentity
    );
    return delegationIdentity;
  } catch (e) {
    console.log(e);
    // Vue.prototype.$message.error('NFID login error.');
  }
};
const setIdentity = (principal: string, identity: Identity): void => {
  console.log(principal);
  localStorage.setItem('principal', principal);
  store.commit('common/SET_PRINCIPAL_ID', principal);
  const principalList = JSON.parse(localStorage.getItem('priList')) || {};
  principalList[principal] = 'NFID';
  localStorage.setItem('priList', JSON.stringify(principalList));
  store.commit('common/SET_IDENTITY', identity);
  localStorage.setItem('identity', localStorage.getItem('principal'));
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
export const logout = async (): Promise<void> => {
  try {
    await nfid.logout();
  } catch (e) {
    console.log(e);
  }
};
export const getNfid = async () => {
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
