enum LoginEnum {
  Mnemonic,
  Existing,
  InternetIdentitiy,
  Plug,
  Infinity,
  MetaMask,
  HardwareWallet,
  NFID
}
export type LoginType = keyof typeof LoginEnum;
