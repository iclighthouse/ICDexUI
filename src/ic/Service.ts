import { Actor, HttpAgent, Identity, CallConfig } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { PrincipalString } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';
import { IC_MANAGEMENT_CANISTER_ID } from '@/ic/utils';
import { DelegationIdentity } from '@dfinity/identity';
export const buildService = async <T>(
  identity: Identity | DelegationIdentity,
  IDL: IDL.InterfaceFactory,
  canisterId: PrincipalString,
  host = 'https://ic0.app/'
): Promise<T> => {
  const defaultAgent = new HttpAgent({
    host: host,
    identity: identity
  });
  if (process.env.NODE_ENV !== 'production') {
    defaultAgent.fetchRootKey().catch((err) => {
      console.warn(
        'Unable to fetch root key. Check to ensure that your local replica is running'
      );
    });
  }
  if (canisterId === IC_MANAGEMENT_CANISTER_ID) {
    return Actor.createActor(IDL, {
      agent: defaultAgent,
      canisterId: canisterId,
      ...{
        callTransform: transform,
        queryTransform: transform
      }
    });
  } else {
    return Actor.createActor(IDL, {
      agent: defaultAgent,
      canisterId: canisterId
    });
  }
};
export function transform(
  _methodName: string,
  args: unknown[],
  // eslint-disable-next-line
  _callConfig: CallConfig
) {
  // eslint-disable-next-line
  const first = args[0] as any;
  let effectiveCanisterId = Principal.fromText(IC_MANAGEMENT_CANISTER_ID);
  if (first && typeof first === 'object' && first.canister_id) {
    effectiveCanisterId = Principal.from(first.canister_id as unknown);
  }
  return { effectiveCanisterId };
}
