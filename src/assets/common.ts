export const isValidHexWith0xPrefix = (hash: string) =>
  /^(0x)?([A-Fa-f0-9]{64})$/.test(hash);
export const isValidHexWithout0xPrefix = (hash: string) =>
  /^([A-Fa-f0-9]{64})$/.test(hash);
export const toLowerCaseWithout0x = (hash: string) =>
  hash.toLowerCase().replace(/0x/g, '');
export const with0x = (hash: string) =>
  hash.startsWith('0x') ? hash : '0x' + hash;

export const isValidSolanaAddress = (address: string): boolean => {
  return (
    typeof address === 'string' && address.length >= 32 && address.length <= 44
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidSolanaTx = (_tx: string): boolean => {
  return true;
};
