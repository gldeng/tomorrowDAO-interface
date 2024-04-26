import { Accounts, ChainId } from '@portkey/provider-types';
import { IBlockchainWallet } from '@portkey/types';
import { ManagerInfoType } from '@portkey/did-ui-react';
import { DiscoverInfo, PortkeyInfo } from 'aelf-web-login';
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
export const proposalTypeList = [
  {
    label: 'Governance',
    desc: 'Enact changes to smart contracts of the DAO. Once approved, an on-chain execution is required.',
    detailDesc: `Governance proposals ami to modify aelf chain's governance parameters. All contracts are
    system contracts which play criticla roles fo aelf ecosystem`,
    value: ProposalType.GOVERNANCE,
  },
  {
    label: 'Advisory',
    desc: "Offer guidance and suggestions for the DAO's future direction, do not directly result in on-chain actions.",
    detailDesc: `Advisory proposals typically contain non-mandatory suggestions for the network, aimed at guiding or advising community members to take specific actions, but without enforcement. This type of proposal does not directly alter the blockchain's code or rules but instead offers insights and recommendations on how to improve the network, governance structure, strategy, or any other relevant.`,
    value: ProposalType.ADVISORY,
  },
  {
    label: 'Veto Proposal',
    desc: 'Veto proposals are only supported for the referendum. For any proposal issued by the High Council, any address can quickly initiate a veto-type proposal to terminate the execution of the proposal issued by the High Council.',
    detailDesc: `Veto proposals are only supported for the referendum. For any proposal issued by the High Council, any address can quickly initiate a veto-type proposal to terminate the execution of the proposal issued by the High Council.`,
    value: ProposalType.VETO,
  },
];
