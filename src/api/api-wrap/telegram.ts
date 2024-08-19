import { apiServer } from '../axios';

const transferUrl = '/token/transfer';
const rankingVoteListsUrl = '/ranking/vote-list';
const rankingVoteUrl = '/ranking/vote';
const rankingVoteStatusUrl = '/ranking/vote-status';

export const nftTokenTransfer = async (
  params: INftTokenTransfer,
): Promise<INftTokenTransferRes> => {
  return apiServer.get(transferUrl, {
    ...params,
  });
};

export const nftTokenTransferStatus = async (
  params: INftTokenTransferStatusReq,
): Promise<INftTokenTransferStatusRes> => {
  return apiServer.get('/transfer/status', {
    ...params,
  });
};

export const getRankingList = async (params: IRankingListReq): Promise<IRankingListRes> => {
  return apiServer.get('/ranking/default-proposal', {
    ...params,
  });
};

export const rankingVote = async (params: IRankingVoteReq): Promise<IRankingVoteRes> => {
  return apiServer.get(rankingVoteUrl, {
    ...params,
  });
};

export const fetchRankingVoteStatus = async (
  params: IRankingVoteStatusReq,
): Promise<IRankingVoteStatusRes> => {
  return apiServer.get(rankingVoteStatusUrl, {
    ...params,
  });
};

export const fetchRankingVoteLists = async (
  params: IRankingVoteListsReq,
): Promise<IRankingVoteListsRes> => {
  return apiServer.get(rankingVoteListsUrl, {
    ...params,
  });
};

export const telegramNeedAuthList = [
  transferUrl,
  rankingVoteListsUrl,
  rankingVoteUrl,
  rankingVoteStatusUrl,
];
