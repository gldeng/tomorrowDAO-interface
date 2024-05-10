export * from './testnet';

export enum WalletType {
  unknown = 'unknown',
  discover = 'discover',
  portkey = 'portkey',
}

export enum NetworkType {
  MAIN = 'MAIN',
  TESTNET = 'TESTNET',
}

export const SECONDS_60 = 60000;

export const ElectionContractName = 'Election';

export const NetworkDaoHomePathName = '/network-dao';
