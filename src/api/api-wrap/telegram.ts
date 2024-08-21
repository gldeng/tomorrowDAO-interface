import { apiServer } from '../axios';

const transferUrl = '/token/transfer';
// const rankingVoteListsUrl = '/ranking/vote-list';
const rankingVoteUrl = '/ranking/vote';
const rankingVoteStatusUrl = '/ranking/vote/status';
const rankListUrl = '/ranking/default-proposal';

export const nftTokenTransfer = async (
  params: INftTokenTransfer,
): Promise<INftTokenTransferRes> => {
  return apiServer.post(transferUrl, {
    ...params,
  });
};

export const nftTokenTransferStatus = async (
  params: INftTokenTransferStatusReq,
): Promise<INftTokenTransferStatusRes> => {
  return apiServer.post('/token/transfer/status', {
    ...params,
  });
};

export const getRankingList = async (params: IRankingListReq): Promise<IRankingListRes> => {
  return apiServer.get(rankListUrl, {
    ...params,
  });
};

export const rankingVote = async (params: IRankingVoteReq): Promise<IRankingVoteRes> => {
  return apiServer.post(rankingVoteUrl, {
    ...params,
  });
};

export const fetchRankingVoteStatus = async (
  params: IRankingVoteStatusReq,
): Promise<IRankingVoteStatusRes> => {
  return apiServer.post(rankingVoteStatusUrl, {
    ...params,
  });
};

// export const fetchRankingVoteLists = async (
//   params: IRankingVoteListsReq,
// ): Promise<IRankingVoteListsRes> => {
//   return apiServer.get(rankingVoteListsUrl, {
//     ...params,
//   });
// };

export const telegramNeedAuthList = [
  transferUrl,
  rankingVoteUrl,
  rankingVoteStatusUrl,
  rankListUrl,
];
