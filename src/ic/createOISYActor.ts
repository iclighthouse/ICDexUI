import { IDL } from '@dfinity/candid';
import { getOISYSignerAgent } from '@/ic/OISYAuth';
import { Actor } from '@dfinity/agent';
export const createOISYActor = async <T>(
  IDL: IDL.InterfaceFactory,
  canisterId: string
): Promise<T> => {
  const agent = getOISYSignerAgent();
  return Actor.createActor(IDL, {
    agent: agent,
    canisterId: canisterId
  });
};
