import { IPaginationProps } from 'aelf-design';

export interface ISocialMedia {
  twitter: string;
  facebook: string;
  discrod: string;
  telegram: string;
  reddit: string;
}
export interface IMetadata {
  name: string;
  logoUrl: string;
  description: string;
  socialMedia: ISocialMedia;
}
export interface IFileInfo {
  name: string;
  cid: string;
  url: string;
}
export interface IDaoDetail {
  chainId: string;
  daoId: string;
  metadata: IMetadata;
  creator: string;
  governanceToken: string;
  network: string;
  governanceModel: string;
  memberCount: number;
  candidateCount: number;
  treasuryContractAddress: string;
  voteContractAddress: string;
  electionContractAddress: string;
  governanceContractAddress: string;
  timelockContractAddress: string;
  proposalTimePeriodSet?: {
    activeTimePeriod: number;
    vetoActiveTimePeriod: number;
    pendingTimePeriod: number;
    executeTimePeriod: number;
    vetoExecuteTimePeriod: number;
  };
  fileInfoList: IFileInfo[];
}

export type TInfo = {
  symbol: 'ELF';
  availableUnStakeAmount: 1000;
  stakeAmount: string;
  votesAmount: string;
  canVote: true;
};

export enum HCType {
  MEMBER = 'Member',
  CANDIDATE = 'Candidate',
}

export enum TabKey {
  PROPOSALS = 'proposals',
  HC = 'highCouncil',
  MYINFO = 'myInfo',
}

// filter

export const enum ProposalType {
  ALL = 'All',
  GOVERNANCE = 'Governance',
  ADVISORY = 'Advisory',
}

export const enum ProposalStatus {
  ALL = 'All',
  ACTIVE = 'Active',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  ABSTAINED = 'Abstained',
  EXPIRED = 'Expired',
  EXECUTED = 'Executed',
}

export interface IProposalTableParams {
  pagination: IPaginationProps;
  // governanceMechanism?: string;
  proposalType?: ProposalType;
  proposalStatus?: ProposalStatus;
  content?: string;
}

export type TTableParamsKey = keyof IProposalTableParams;

type TproposalStatus = 'Active' | 'Approved' | 'Expired' | 'Executed' | 'Rejected';
export interface IProposalsItem {
  chainId: string;
  proposalId: string;
  releaseAddress: string;
  deployTime: string;
  proposalTitle: string;
  governanceMechanism: string;
  proposalStatus: TproposalStatus;
  proposalDescription: string;
  proposalType: string;
  startTime: string;
  endTime: string;
  expiredTime: string;
  transaction: {
    contractMethodName: string;
    toAddress: string;
    params: {
      param1: string;
      param2: string;
    };
  };
  votesAmount: string;
  approvedCount: string;
  rejectionCount: string;
  abstentionCount: string;
  voterCount: 10;
  minimalRequiredThreshold: 20;
  minimalVoteThreshold: 10;
  minimalApproveThreshold: 10;
  maximalRejectionThreshold: 10;
  maximalAbstentionThreshold: 10;
  tagList: string[];
}
