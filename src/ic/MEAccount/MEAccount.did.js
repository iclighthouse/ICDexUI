export default ({ IDL }) => {
  return IDL.Service({
    addAdmin: IDL.Func([IDL.Principal], [], []),
    getUsers: IDL.Func(
      [IDL.Opt(IDL.Text)],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Text)))],
      ['query']
    ),
    pushUser: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], [])
  });
};
