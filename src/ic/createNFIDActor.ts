import { IDL } from '@dfinity/candid';
import { getNFIDSignerAgent } from '@/ic/NFIDAuth';
import { Actor } from '@dfinity/agent';

export const createNFIDActor = async <T>(
  IDL: IDL.InterfaceFactory,
  canisterId: string
): Promise<T> => {
  const agent = getNFIDSignerAgent();
  console.log(agent);
  return Actor.createActor(IDL, {
    agent: agent,
    canisterId: canisterId
  });
};
