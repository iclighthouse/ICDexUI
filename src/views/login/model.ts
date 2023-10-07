enum LoginEnum {
  Mnemonic,
  Existing,
  InternetIdentitiy,
  Plug,
  Infinity,
  MetaMask,
  HardwareWallet
}
export type LoginType = keyof typeof LoginEnum;
