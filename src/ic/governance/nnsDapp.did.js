export default ({ IDL }) => {
  const GetProposalPayloadResponse = IDL.Variant({
    Ok: IDL.Text,
    Err: IDL.Text
  });
  return IDL.Service({
    get_proposal_payload: IDL.Func(
      [IDL.Nat64],
      [GetProposalPayloadResponse],
      []
    )
  });
};
