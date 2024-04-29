/*
/api/proposal/detail
入参
```
{
  "proposalId": "ABC"，
  "chainId": "", // aelf/tdvv
}
```
出参
```json
{
    "code":"20000",
    "data":{
        "chainId":""
        "daoId": "", 
        "proposalId": "", // 提案id
        "releaseAddress": "", // 发布地址
        "deployTime": "", // 发布时间
        "proposalTitle": "", // 标题
        "governanceMechanism": 1,
        "proposalStatus": "", // 状态
        "proposalDescription": "", // 提案描述
        "proposalType":"", //Governance / Advisory
        "startTime": "", // 提案开始时间
        "endTime": "", // 投票结束的时间，即提案创建后，活跃期，可投票的时间段
        "expiredTime": "", // 提案的过期时间，即活跃期投票结束后，在过期时间前需保证提案已被执行
        "transaction": {
            "contractName":"",
            "contractMethodName":"",
            "toAddress":""
            "params": {
                 "param1": "value1",
                 "param2": "value2"
             }
        },
        "votesAmount": "", // 全部已投票数
        "approvedCount": "", // 同意票ouz数
        "rejectionCount": "", // 拒绝票数
        "abstentionCount": "", // 弃权票数
        "voterCount": 10, //投票地址数量
        "minimalRequiredThreshold": 20, //最小需要参与投票的地址数
        "minimalVoteThreshold": 10, //最小的投票数量阈值；
        "minimalApproveThreshold": 10, //最小的approve数量阈值；(百分比)
        "maximalRejectionThreshold": 10, //拒绝数量的上限阈值；(百分比)
        "maximalAbstentionThreshold": 10 //弃权数量的上限阈值；(百分比)
        "organizationInfo": {
            "organizationName":"",
            "organizationAddress":""
        },
        "voteTopList": [
            {
             "voter": "xxx1", //投票的地址
             "amount": 10, //数量
             "voteOption": "" // Approved / Rejected / Abstained
           },    
        ],// Top list, order by vote count desc, 默认 top 10,
        "tagList": [
            "DAO Upgrade",
            "Customized Vote Model"
        ]
    },
    "message": ""
}
```
生成 TS 定义，入参以 Req 结尾，出参以 Res 结尾, data 结构单独定义，去除注释
*/
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
      Twitter: string;
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
  types: (0 | 1 | 2)[];
}

interface IVoteScheme {
  VoteSchemeId: string;
  VoteMechanism: number;
  VoteMechanismName: string;
}

interface IVoteSchemeListData {
  VoteSchemeList: VoteScheme[];
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
