export default ({ IDL }) => {
  const Time = IDL.Int;
  const Event = IDL.Record({
    data: IDL.Opt(IDL.Text),
    name: IDL.Text,
    time: Time,
    user: IDL.Principal
  });
  return IDL.Service({
    addAdmin: IDL.Func([IDL.Principal], [], ['oneway']),
    addEventName: IDL.Func([IDL.Text], [], ['oneway']),
    deleteEventsName: IDL.Func([IDL.Text], [], []),
    getEvents: IDL.Func(
      [IDL.Opt(IDL.Text)],
      [IDL.Opt(IDL.Vec(Event))],
      ['query']
    ),
    getEventsName: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    putEvent: IDL.Func(
      [IDL.Text, IDL.Principal, IDL.Opt(IDL.Text)],
      [IDL.Text],
      []
    ),
    removeAdmin: IDL.Func([IDL.Principal], [], ['oneway'])
  });
};
