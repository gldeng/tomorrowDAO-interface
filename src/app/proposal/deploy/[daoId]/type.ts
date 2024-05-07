export enum ProposalType {
  UNSPECIFIED = 0,
  GOVERNANCE = 1,
  ADVISORY = 2,
  VETO = 3,
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
export interface IContractInfo {
  ContractAddress: string;
  ContractName: string;
  FunctionList: string[];
}
interface VoteSchemeItem {
  VoteSchemeId: string;
  VoteMechanism: number;
  VoteMechanismName: string; // Unspecified UniqueVote TokenBallot
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
      VoteMechanismName: '1a1v',
    },
    {
      VoteSchemeId: '632e4047edc35bdf06de385f46fd553ef454ddf7d1bfd060cc341e6dba237510',
      VoteMechanism: 2,
      VoteMechanismName: '1t1v',
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
