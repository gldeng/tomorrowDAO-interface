export enum ProposalType {
  UNSPECIFIED = 0,
  GOVERNANCE = 1,
  ADVISORY = 2,
  VETO = 3,
}
export interface IContractInfo {
  ContractAddress: string;
  ContractName: string;
  FunctionList: string[];
}

export enum EVoteMechanismNameType {
  UniqueVote = 'UniqueVote',
  TokenBallot = 'TokenBallot',
}

export enum EVoteOption {
  APPROVED = 0,
  REJECTED = 1,
  ABSTAINED = 2,
}

export interface VoteSchemeItem {
  VoteSchemeId: string;
  VoteMechanism: number;
  VoteMechanismName: EVoteMechanismNameType; // Unspecified UniqueVote TokenBallot
}

export interface VoteSchemeListRes {
  VoteSchemeList: VoteSchemeItem[];
}
export enum VoteSchemeId {
  Unspecified = 0,
  UniqueVote = 1, // 1a1v
  TokenBallot = 2, // 1t1v
}
export const mockVoteSchemeList: VoteSchemeListRes = {
  VoteSchemeList: [
    {
      VoteSchemeId: '632e4047edc35bdf06de385f46fd553ef454ddf7d1bfd060cc341e6dba237510',
      VoteMechanism: 1,
      VoteMechanismName: EVoteMechanismNameType.UniqueVote,
    },
    {
      VoteSchemeId: '632e4047edc35bdf06de385f46fd553ef454ddf7d1bfd060cc341e6dba237510',
      VoteMechanism: 2,
      VoteMechanismName: EVoteMechanismNameType.TokenBallot,
    },
  ],
};

export const fetchVoteSchemeList = async (p: { chainId: string }) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return mockVoteSchemeList;
};
interface GovernanceMechanism {
  governanceSchemeId: string;
  name: string;
}

export interface GovernanceMechanismList {
  chainId: string;
  governanceMechanismList: GovernanceMechanism[];
}
const mockGovernanceMechanismList: GovernanceMechanismList = {
  chainId: '1',
  governanceMechanismList: [
    {
      governanceSchemeId: 'D29ezPPDCKL3UJxUUyabtz6tdWzztSqczSRbpRfyYvpn9Bmq9',
      name: 'Referendum',
    },
    {
      governanceSchemeId: 'D29ezPPDCKL3UJxUUyabtz6tdWzztSqczSRbpRfyYvpn9Bmq9',
      name: 'High Council',
    },
  ],
};

export const fetchGovernanceMechanismList = async (p: { chainId: string }) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return mockGovernanceMechanismList;
};
interface SocialMedia {
  twitter: string;
  facebook: string;
  discord: string;
  telegram: string;
  reddit: string;
}

interface FileInfo {
  name: string;
  cid: string;
  url: string;
}

interface Metadata {
  name: string;
  logoUrl: string;
  description: string;
  socialMedia: SocialMedia;
}

export interface DaoInfo {
  chainId: string;
  daoId: string;
  metadata: Metadata;
  creator: string;
  governanceToken: string;
  governanceModel: string;
  memberCount: number;
  candidateCount: number;
  treasuryContractAddress: string;
  voteContractAddress: string;
  electionContractAddress: string;
  governanceContractAddress: string;
  timelockContractAddress: string;
  fileInfoList: FileInfo[];
  proposalTimePeriodSet: {
    activeTimePeriod: number;
    vetoActiveTimePeriod: number;
    pendingTimePeriod: number;
    executeTimePeriod: number;
    vetoExecuteTimePeriod: number;
  };
}
const mockDaoInfo: DaoInfo = {
  chainId: '1',
  daoId: 'dao1',
  metadata: {
    name: 'DAO Name',
    logoUrl: 'http://example.com/logo.png',
    description: 'This is a DAO',
    socialMedia: {
      twitter: 'http://twitter.com/dao',
      facebook: 'http://facebook.com/dao',
      discord: 'http://discord.com/dao',
      telegram: 'http://telegram.com/dao',
      reddit: 'http://reddit.com/dao',
    },
  },
  creator: '0x1234567890123456789012345678901234567890',
  governanceToken: 'GTOKEN',
  governanceModel: 'Model1',
  memberCount: 100,
  candidateCount: 10,
  treasuryContractAddress: '0x1234567890123456789012345678901234567890',
  voteContractAddress: '0x1234567890123456789012345678901234567890',
  electionContractAddress: '0x1234567890123456789012345678901234567890',
  governanceContractAddress: '0x1234567890123456789012345678901234567890',
  timelockContractAddress: '0x1234567890123456789012345678901234567890',
  proposalTimePeriodSet: {
    activeTimePeriod: Date.now(),
    vetoActiveTimePeriod: Date.now(),
    pendingTimePeriod: Date.now(),
    executeTimePeriod: Date.now(),
    vetoExecuteTimePeriod: Date.now(),
  },
  fileInfoList: [
    {
      name: 'File1',
      cid: 'cid1',
      url: 'http://example.com/file1',
    },
    {
      name: 'File2',
      cid: 'cid2',
      url: 'http://example.com/file2',
    },
  ],
};
export const fetchDaoInfo = async (p: { daoId: string; chainId: string }) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return mockDaoInfo;
};
interface ContractInfoItem {
  ContractAddress: string;
  ContractName: string;
  FunctionList: string[];
}

export interface ContractInfo {
  contractInfoList: ContractInfoItem[];
}

export type TContractInfoList = IContractInfo[];
