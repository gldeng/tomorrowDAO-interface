// ------------------- TokenTransfer -------------------
interface INftTokenTransfer {
  chainId: string;
  symbol: string;
}

interface INftTokenTransfer {
  chainId: string;
  symbol: string;
}

enum TransferStatus {
  UnsupportedToken = 0,
  AlreadyClaimed = 1,
  TransferInProgress = 2,
  TransferFailed = 9,
}
// ------------------- TransferStatus -------------------
interface INftTokenTransferStatusReq {
  chainId: string;
  address: string;
  symbol: string;
}
interface INftTokenTransferResData {
  status: TransferStatus;
}

interface INftTokenTransferRes {
  code: number;
  data: INftTokenTransferResData;
}
interface INftTokenTransferStatusResData {
  transactionId: string;
  claimTime: string;
  status: TransferStatus;
  isClaimedInSystem: boolean;
}
interface INftTokenTransferStatusRes {
  code: number;
  data: INftTokenTransferStatusResData;
}

// ------------------- RankingList -------------------
interface IRankingListReq {
  chainId: string;
}
interface IRankingListResItem {
  id: string;
  chainId: string;
  daoId: string;
  proposalId: string;
  proposalTitle: string;
  proposalDescription: string;
  activeStartTime: string;
  activeEndTime: string;
  appId: string;
  alias: string;
  title: string;
  icon: string;
  description: string;
  editorChoice: boolean;
  deployTime: string;
  voteAmount: number;
  votePercent: number;
  url: string;
  longDescription: string;
  screenshots: Array<string>;
  points: number;
}
interface IRankingListResData {
  startTime: string;
  endTime: string;
  canVoteAmount: number;
  totalVoteAmount: number;
  userTotalPoints: number;
  rankingList: Array<IRankingListResItem>;
}
interface IRankingListRes {
  code: string;
  data: IRankingListResData;
  message: string;
}

// ------------------- RankingVote -------------------

enum VoteStatus {
  NotVoted = 0,
  Voting = 1,
  Voted = 2,
  Failed = 9,
}
interface IRankingVoteReq {
  rawTransaction: string;
  chainId: string;
}
interface IRankingVoteRes {
  code: number;
  data: {
    status: VoteStatus;
  };
}

// ------------------- VoteLike -------------------
interface ILikeItem {
  likeAmount: number;
  alias: string;
}
interface IRankingVoteLikeReq {
  chainId: string;
  proposalId: string;
  likeList: ILikeItem[];
}
interface IRankingVoteLikeRes {
  code: number;
  data: {
    totalPoints: number;
  };
}
// ------------------- RankingVote status -------------------
interface IRankingVoteStatusReq {
  chainId: string;
  address: string;
  proposalId: string;
}
interface IRankingVoteStatusRes {
  code: number;
  data: {
    status: VoteStatus;
    totalPoints: number;
  };
}

// ------------------- RankingVote lists -------------------
interface IRankingVoteListsReq {
  chainId: string;
  proposalId?: string;
  skipCount: number;
  maxResultCount: number;
}
interface IRankingVoteListsResItem {
  proposalId: string;
  daoId: string;
  rankingDescription: string;
}
interface IRankingVoteListsRes {
  code: number;
  data: {
    totalCount: number;
    items: Array<IRankingVoteListsResItem>;
  };
}
