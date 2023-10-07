import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { DelegationIdentity } from '@dfinity/identity';
import store from '@/store';

const ONE_MINUTE_MILLIS = 60 * 1000;
const SESSION_TIMEOUT = BigInt('7200000000000'); // 120 mins

/**
 * authenticated with the Internet Identity
 */
export default class AuthClientAPi {
  private readonly authClient: AuthClient;
  public expireSessionTimeout: NodeJS.Timeout | null;
  public static create = async (): Promise<AuthClientAPi> => {
    const authClient = await AuthClient.create({
      keyType: 'Ed25519'
    });
    return new AuthClientAPi(authClient);
  };
  constructor(authClient: AuthClient) {
    this.authClient = authClient;
    this.expireSessionTimeout = null;
    if (this.tryGetIdentity()) {
      this.handleDelegationExpiry();
    }
  }
  /**
   * Prompts the user to login by redirecting them to the Internet Identity.
   */
  public login = (selectedAccount?: string): Promise<boolean> => {
    let derivationOrigin = 'https://7vkf4-jqaaa-aaaaj-azrua-cai.icp0.io';
    if (window.location.origin.includes('avjzx-pyaaa-aaaaj-aadmq-cai')) {
      derivationOrigin = window.location.origin;
    }
    return new Promise((resolve, reject) => {
      this.authClient.login({
        maxTimeToLive: SESSION_TIMEOUT,
        derivationOrigin: derivationOrigin,
        onSuccess: () => {
          this.handleDelegationExpiry();
          const identity = this.authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          if (selectedAccount && selectedAccount !== principal) {
            resolve(true);
            return;
          }
          localStorage.setItem('principal', principal);
          store.commit('common/SET_PRINCIPAL_ID', principal);
          const principalList =
            JSON.parse(localStorage.getItem('priList')) || {};
          principalList[principal] = 'AuthClient';
          localStorage.setItem('priList', JSON.stringify(principalList));
          store.commit('common/SET_IDENTITY', identity);
          localStorage.setItem('identity', localStorage.getItem('principal'));
          // sessionStorage.setItem('identity', JSON.stringify(identity));
          resolve(true);
        },
        onError: (error?: string) => {
          console.log(error);
          reject(error);
        }
      });
    });
  };
  /**
   * Logout of the app.
   */
  public logout = async (): Promise<void> => {
    if (this.expireSessionTimeout) {
      clearTimeout(this.expireSessionTimeout);
    }
    try {
      await this.authClient.logout();
    } catch (e) {
      console.log(e);
    }
  };
  /**
   * Returns the identity of the user if the user is logged and the session
   * isn't about to expire, otherwise, returns null.
   */
  public tryGetIdentity = (): Identity => {
    const identity = this.authClient.getIdentity();
    if (identity.getPrincipal().isAnonymous()) {
      return null;
    }
    const timeUntilSessionExpiryMs = this.getTimeUntilSessionExpiryMs();
    if (timeUntilSessionExpiryMs) {
      // If the identity will expire in less than 5 minutes, don't return the identity
      const durationUntilLogout = timeUntilSessionExpiryMs - ONE_MINUTE_MILLIS;
      if (durationUntilLogout <= 5 * ONE_MINUTE_MILLIS) {
        return null;
      }
    }
    return identity;
  };
  /**
   * @returns the amount of time in ms remaining for the session to expire.
   * Null is returned if the session doesn't expire or if the user isn't logged in.
   */
  public getTimeUntilSessionExpiryMs = (): number => {
    const identity = this.authClient.getIdentity();
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
  private handleDelegationExpiry = () => {
    const durationUntilSessionExpiresMs = this.getTimeUntilSessionExpiryMs();
    if (durationUntilSessionExpiresMs) {
      const durationUntilLogoutMs =
        durationUntilSessionExpiresMs - ONE_MINUTE_MILLIS;
      if (durationUntilLogoutMs <= 0) {
        this.logout().then((r) => {
          console.log(r);
        });
      } else {
        // Log the user out 1 minute before their session expires
        this.expireSessionTimeout = setTimeout(
          () => this.logout(),
          durationUntilSessionExpiresMs - ONE_MINUTE_MILLIS
        );
      }
    }
  };
}
