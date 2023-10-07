export interface GetProposalPayloadResponse {
  Ok: string;
  Err: string;
}

export default interface Service {
  get_proposal_payload(proposalId: bigint): Promise<GetProposalPayloadResponse>
}
