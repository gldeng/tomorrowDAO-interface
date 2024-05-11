import { Accounts, ChainId } from '@portkey/provider-types';
import { IBlockchainWallet } from '@portkey/types';
import { ManagerInfoType } from '@portkey/did-ui-react';
import { DiscoverInfo, PortkeyInfo } from 'aelf-web-login-dao';
import type { AElfContextType } from '@aelf-react/core/dist/types';

export type TokenInfo = {
  decimals: number;
  symbol: string;
  tokenName?: string;
  address?: string;
  issueChainId?: number;
  issuer?: string;
  isBurnable?: boolean;
  totalSupply?: number;
};

export enum SupportedELFChainId {
  MAIN_NET = 'AELF',
  TDVV_NET = 'tDVV',
  TDVW_NET = 'tDVW',
}

export enum ContractMethodType {
  SEND = 'send',
  VIEW = 'view',
}

export interface IContractError extends Error {
  code?: number;
  error?: number;
  errorMessage?: {
    message: string;
    name?: string;
    stack?: string;
  };
  Error?: string;
  from?: string;
  sid?: string;
  result?: {
    TransactionId?: string;
    transactionId?: string;
  };
  TransactionId?: string;
  transactionId?: string;
  value?: any;
}

export interface IContractOptions {
  chain?: Chain | null;
  type?: ContractMethodType;
}

export interface ISendResult {
  TransactionId: string;
  TransactionResult: string;
}

export interface CallContractParams<T> {
  contractAddress: string;
  methodName: string;
  args: T;
}

export interface IDiscoverInfo {
  address?: string;
  nickName?: string;
  accounts?: Accounts;
}

export interface IDIDWalletInfo {
  caInfo: {
    caAddress: string;
    caHash: string;
  };
  pin: string;
  chainId: ChainId;
  walletInfo: IBlockchainWallet | { [key: string]: any };
  accountInfo: ManagerInfoType;
}
export type PortkeyInfoType = Partial<IDIDWalletInfo> & {
  accounts?: { [key: string]: any };
  walletInfo?: { [key: string]: any } | IBlockchainWallet;
};

export type WalletInfoType = {
  address: string;
  publicKey?: string;
  token?: string;
  aelfChainAddress?: string;
  discoverInfo?: DiscoverInfo;
  portkeyInfo?: PortkeyInfo;
  nightElfInfo?: AElfContextType;
};

export enum ProposalType {
  UNSPECIFIED = 0,
  GOVERNANCE = 1,
  ADVISORY = 2,
  VETO = 3,
  ALL = 'ALL',
}
export enum ProposalTypeString {
  Governance = 'Governance',
  Improvement = 'Advisory',
  Veto = 'Veto',
}
// for filter ProposalStatusString
export enum ProposalStatusString {
  Approved = 'Approved',
  Rejected = 'Rejected',
  Abstained = 'Abstained',
  Expired = 'Expired',
  Executed = 'Executed',
  'Subject to Veto' = 'PendingVote',
  'Being Vetoed' = 'Vetoed',
}
// all ProposalStatusString
export enum AllProposalStatusString {
  Approved = 'Approved',
  Rejected = 'Rejected',
  Abstained = 'Abstained',
  Expired = 'Expired',
  Executed = 'Executed',
  'Subject to Veto' = 'PendingVote',
  'Being Vetoed' = 'Vetoed',
  'BelowThreshold' = 'BelowThreshold',
}
export const proposalTypeList = [
  {
    label: 'Governance',
    desc: `Governance proposals typically encompass changes to the DAO's crucial parameters governing its operations. The execution of these proposals is carried out by calling smart contracts.`,
    value: ProposalType.GOVERNANCE,
  },
  {
    label: 'Improvement',
    desc: `Improvement proposals typically consist of non-mandatory suggestions for the DAO, like guidance and insights for its development. The execution of these proposals does not require calling smart contracts.`,
    value: ProposalType.ADVISORY,
  },
  {
    label: 'Veto',
    desc: `Veto proposals are intended to prevent the execution of governance proposal by the High Council. Voting on veto proposals can only be conducted through a referendum.`,
    value: ProposalType.VETO,
  },
];

export interface IFormValidateError {
  values?: {};
  errorFields: [];
  outOfDate?: Boolean;
}

export interface ITransactionResult {
  TransactionId: string;
  Status: string;
  Logs: ITransactionLog[];
  [props: string]: any;
}

export interface ITransactionLog {
  Address: string;
  Name: string;
  Indexed: string[];
  NonIndexed: string;
}
