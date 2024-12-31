import { IDL } from '@dfinity/candid';
import ConnectPlug, { canRequest, getPlugSignerAgent } from '@/ic/ConnectPlug';
import { LEDGER_CANISTER_ID } from '@/ic/utils';
import ledgerIDL from '@/ic/ledger/ledger.did.js';
import { Actor } from '@dfinity/agent';
import { PlugTransport } from '@slide-computer/signer-transport-plug';
import { Signer } from '@slide-computer/signer';
import { SignerAgent } from '@slide-computer/signer-agent';
import { Principal } from '@dfinity/principal';

const plugActor: { [key: string]: any } = {};
// each item will be an actor from to be executed
const requests = {};
const requestsCanisterId = [];

export const createPlugActor = async <T>(
  IDL: IDL.InterfaceFactory,
  canisterId: string,
  isSigner: boolean
): Promise<T> => {
  if (plugActor && plugActor[canisterId]) {
    return plugActor[canisterId];
  }
  if (requestsCanisterId.includes(canisterId)) {
    return new Promise((resolve) => {
      if (!requests[canisterId]) {
        requests[canisterId] = [];
      }
      requests[canisterId].push((actor) => {
        resolve(actor);
      });
    });
  } else {
    if (await canRequest(canisterId)) {
      requestsCanisterId.push(canisterId);
      const t = new Date().getTime();
      console.log(canisterId + ': ' + t);
      const actor = await (window as any).ic?.plug.createActor({
        canisterId: canisterId,
        interfaceFactory: IDL
      });
      console.log(canisterId + ': ' + (new Date().getTime() - t));
      plugActor[canisterId] = actor;
      if (requests[canisterId] && requests[canisterId].length) {
        requests[canisterId].forEach((m) => m(plugActor[canisterId]));
        requestsCanisterId.splice(requestsCanisterId.indexOf(canisterId));
        delete requests[canisterId];
      }
      return plugActor[canisterId];
    } else {
      return null;
    }
  }
};

export const hasActor = (canisterId: string): boolean => {
  return !!plugActor[canisterId];
};

const plugWhitelist = [
  {
    canisterId: LEDGER_CANISTER_ID,
    idl: ledgerIDL
  }
];
export const createPlugWhiteActor = async (
  isSigner: boolean
): Promise<void> => {
  const t = new Date().getTime();
  console.log(t);
  console.log(isSigner);
  for (let i = 0; i < plugWhitelist.length; i++) {
    createPlugActor(
      plugWhitelist[i].idl,
      plugWhitelist[i].canisterId,
      isSigner
    );
  }
  console.log('end: ' + (new Date().getTime() - t));
};
export const createPlugActorWithSigner = async <T>(
  IDL: IDL.InterfaceFactory,
  canisterId: string
): Promise<T> => {
  let signerAgent = getPlugSignerAgent();
  console.log(signerAgent);
  if (!signerAgent) {
    const connectPlug = new ConnectPlug();
    signerAgent = await connectPlug.connectSignerPlug();
  }
  return Actor.createActor(IDL, {
    agent: signerAgent,
    canisterId: canisterId
  });
};
