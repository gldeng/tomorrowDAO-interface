// -------------------------------------dao-list-----------------------------
interface IListDaoReq {
  skipCount: number; //  0
  maxResultCount: number; // 6
  chainId: string; // aelf/ tdvv
}

interface IDaoItem {
  chainId: string;
  daoId: string;
  logo: string; //
  name: string; //
  description: string; //
  creator: string; //
  proposalsNum: number; //
  symbol: string;
  symbolHoldersNum: number; //
  votersNum: number; //
}

interface DaoData {
  totalCount: number;
  items: IDaoItem[];
}

interface ListDaoRes {
  code: string;
  data: DaoData;
  message: string;
}
// -------------------------------------dao-info-----------------------------
interface SocialMedia {
  twitter: string;
  facebook: string;
  discrod: string;
  telegram: string;
  reddit: string;
}

interface ProposalTimePeriodSet {
  activeTimePeriod: number;
  vetoActiveTimePeriod: number;
  pendingTimePeriod: number;
  executeTimePeriod: number;
  vetoExecuteTimePeriod: number;
}

interface FileInfo {
  file: {
    name: string;
    cid: string;
    url: string;
  };
  uploader: string;
  uploadTime: string;
}

interface DaoInfoData {
  id: string;
  chainId: string;
  blockHeight: number;
  creator: string;
  metadata: {
    name: string;
    logoUrl: string;
    description: string;
    socialMedia: {
      twitter?: string;
      facebook?: string;
      discrod?: string;
      telegram?: string;
      reddit?: string;
    };
  };
  governanceToken: string;
  isHighCouncilEnabled: boolean;
  highCouncilAddress: null | string;
  memberCount?: number;
  candidateCount?: number;
  highCouncilConfig: null | {
    electionPeriod: number;
    maxHighCouncilCandidateCount: number;
    maxHighCouncilMemberCount: number;
    stakingAmount: number;
  };
  highCouncilTermNumber: number;
  fileInfoList: FileInfo[];
  isTreasuryContractNeeded: boolean;
  subsistStatus: boolean;
  treasuryContractAddress: string;
  treasuryAccountAddress: null | string;
  isTreasuryPause: boolean;
  treasuryPauseExecutor: null | string;
  voteContractAddress: string;
  electionContractAddress: string;
  governanceContractAddress: string;
  timelockContractAddress: string;
  activeTimePeriod: number;
  vetoActiveTimePeriod: number;
  pendingTimePeriod: number;
  executeTimePeriod: number;
  vetoExecuteTimePeriod: number;
  createTime: string;
}

interface DaoInfoReq {
  daoId: string;
  chainId: string;
}

interface DaoInfoRes {
  code: string;
  data: DaoInfoData;
  message: string;
}
// -------------------------------------propal-list-----------------------------

interface ProposalListReq {
  skipCount?: number;
  maxResultCount?: number;
  chainId: string;
  daoId: string;
  // governanceMechanism: string;
  proposalType?: string;
  proposalStatus?: string;
  content?: string;
}

interface ProposalMyInfoReq {
  chainId: string;
  daoId: string;
  proposalId?: string;
  address: string;
}

interface Transaction {
  contractMethodName: string;
  toAddress: string;
  params: {
    param1: string;
    param2: string;
  };
}
interface IProposalsItem {
  chainId: string;
  proposalId: string;
  releaseAddress: string;
  deployTime: string;
  proposalTitle: string;
  governanceMechanism: string;
  proposalStatus: string;
  proposalDescription: string;
  proposalType: string;
  startTime: string;
  endTime: string;
  expiredTime: string;
  transaction: Transaction;
  votesAmount: number;
  approvedCount: string;
  rejectionCount: string;
  abstentionCount: string;
  voterCount: number;
  minimalRequiredThreshold: number;
  minimalVoteThreshold: number;
  minimalApproveThreshold: number;
  maximalRejectionThreshold: number;
  maximalAbstentionThreshold: number;
}
interface ProposalListResData {
  totalCount: number;
  items: IProposalsItem[];
}

interface ProposalListRes {
  code: string;
  data: ProposalListResData;
  message: string;
}

interface ProposalMyInfo {
  symbol: string;
  availableUnStakeAmount: number;
  stakeAmount: string;
  votesAmount: string;
  canVote: boolean;
  proposalIdList: Array;
}

interface ProposalMyInfoRes {
  code: string;
  data: ProposalMyInfo;
  message: string;
}

// -------------------------------------propal-detail-----------------------------

interface ProposalDetailReq {
  proposalId: string;
  chainId: string;
}

interface ProposalLife {
  proposalStatus: string;
  proposalStage: string;
}

interface Transaction {
  toAddress: string;
  contractMethodName: string;
  params: Record<string, unknown>;
}

interface ProposalDetailData {
  proposalLifeList: ProposalLife[];
  voteTopList: any[];
  chainId: string;
  blockHeight: number;
  id: string;
  daoId: null | string;
  proposalId: string;
  proposalTitle: string;
  proposalDescription: string;
  forumUrl: string;
  proposalType: string;
  activeStartTime: string;
  activeEndTime: string;
  executeStartTime: string;
  executeEndTime: string;
  proposalStatus: string;
  proposalStage: string;
  proposer: string;
  schemeAddress: string;
  transaction: Transaction;
  voteSchemeId: null | string;
  vetoProposalId: null | string;
  deployTime: string;
  executeTime: string;
  governanceMechanism: string;
  minimalRequiredThreshold: number;
  minimalVoteThreshold: number;
  minimalApproveThreshold: number;
  maximalRejectionThreshold: number;
  maximalAbstentionThreshold: number;
  activeTimePeriod: number;
  vetoActiveTimePeriod: number;
  pendingTimePeriod: number;
  executeTimePeriod: number;
  vetoExecuteTimePeriod: number;
  voterCount: number;
  votesAmount: number;
  approvedCount: number;
  rejectionCount: number;
  abstentionCount: number;
}

interface ProposalDetailRes {
  code: string;
  data: ProposalDetailData;
  message: string;
}
// -------------------------------------governance-model-list-----------------------------
interface SchemeThreshold {
  minimalRequiredThreshold: number;
  minimalVoteThreshold: number;
  minimalApproveThreshold: number;
  maximalRejectionThreshold: number;
  maximalAbstentionThreshold: number;
}

interface GovernanceScheme {
  id: string;
  daoId: string;
  schemeId: string;
  schemeAddress: string;
  chainId: string;
  governanceMechanism: string;
  governanceToken: string;
  schemeThreshold?: SchemeThreshold;
}

type GovernanceSchemeList = GovernanceScheme[];
interface GovernanceModelListData {
  data: GovernanceSchemeList;
}
interface GovernanceModelListRes {
  code: string;
  data: GovernanceModelListData;
  message: string;
}
// -------------------------------------contracts-info-----------------------------

interface ContractInfo {
  contractAddress: string;
  contractName: string;
  functionList: string[];
}

interface ContractInfoListData {
  contractInfoList: ContractInfo[];
}

interface ContractInfoListRes {
  code: string;
  data: ContractInfoListData;
  message: string;
}
// -------------------------------------vote-scheme-list-----------------------------

interface IVoteSchemeListReq {
  chainId: string;
}

interface IVoteScheme {
  voteSchemeId: string;
  voteMechanismName: string;
  voteMechanism: number;
}

interface IVoteSchemeListData {
  voteSchemeList: IVoteScheme[];
}

interface IVoteSchemeListRes {
  code: string;
  data: IVoteSchemeListData;
  message: string;
}
// -------------------------------------token-info-----------------------------

interface TokenInfoData {
  chainId?: string;
  decimals?: number;
  imageUrl?: string;
  isNFT?: boolean;
  name?: string;
  supply?: string;
  symbol?: string;
  totalSupply?: string;
}

interface ITokenInfoRes {
  msg: string;
  code: number;
  data: TokenInfoData;
}

// -------------------------------------explore-----------------------------
interface AddressTokenListDataItem {
  symbol: string;
  balance: string;
}

interface AddressTokenListRes {
  msg: string;
  code: number;
  data: AddressTokenListDataItem[];
}
// -------------------------------------explore-----------------------------
interface AddressTransferListTxFee {
  ELF: number;
}

interface AddressTransferListDataListItem {
  id: number;
  txId: string;
  from: string;
  to: string;
  amount: string;
  symbol: string;
  action: string;
  isCrossChain: string;
  relatedChainId: string;
  memo: null;
  txFee: AddressTransferListTxFee;
  time: string;
  method: string;
  blockHeight: number;
  addressFrom: string;
  addressTo: string;
}

interface AddressTransferListData {
  list: AddressTransferListDataListItem[];
  total: number;
}

interface AddressTransferListRes {
  msg: string;
  code: number;
  data: AddressTransferListData;
}
// -------------------------------------TokenPriceRes-----------------------------
interface TokenPriceRes {
  USD?: number;
  symbol: string;
}

// -------------------------------------vote-history-----------------------------
interface IVoteHistoryReq {
  proposalId: string;
  chainId: string;
  skipCount: number;
  maxResultCount: number;
  address: string;
  voteOption?: string;
}
interface IVoteHistoryItem {
  timeStamp: number;
  proposalId: string;
  ProposalTitle: string;
  myOption: string;
  votesNum: number;
  transactionId: string;
  executer: string;
}

interface IVoteHistoryResData {
  total: number;
  items: IVoteHistoryItem[];
}
interface IVoteHistoryRes {
  code: string;
  data: IVoteHistoryResData;
  message: string;
}
