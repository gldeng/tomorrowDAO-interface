import { stringify } from 'query-string';
import { apiServer, explorerServer, tokenServer } from './axios';

export const fetchToken = async (data: ITokenParams) => {
  return tokenServer.post<string, ITokenRes>('/connect/token', stringify(data), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};
export const fetchDaoList = async (params: IListDaoReq): Promise<IListDaoRes> => {
  return apiServer.get('/dao/dao-list', {
    params,
  });
};

export const fetchMyDaoList = async (
  params: IMyDaoListQueryParams,
): Promise<IMyDaoListResponse> => {
  console.log(1111);
  return apiServer.get('/dao/my-dao-list', {
    params,
  });
};

export const fetchDaoInfo = async (params: IDaoInfoReq): Promise<IDaoInfoRes> => {
  return apiServer.get('/dao/dao-info', {
    params,
  });
};

export const fetchProposalList = async (params: IProposalListReq): Promise<IProposalListRes> => {
  return apiServer.post('/proposal/list', {
    ...params,
  });
};
// need auth
export const fetchProposalMyInfo = async (
  params: IProposalMyInfoReq,
): Promise<IProposalMyInfoRes> => {
  return apiServer.get('/proposal/my-info', {
    params,
  });
};

export const fetchProposalDetail = async (
  params: IProposalDetailReq,
): Promise<IProposalDetailRes> => {
  return apiServer.get('/proposal/detail', {
    params,
  });
};

export const fetchGovernanceMechanismList = async (params: {
  chainId: string;
  daoId: string;
}): Promise<IGovernanceModelListRes> => {
  return apiServer.get('/governance/list', {
    params,
  });
};

export const fetchContractInfo = async (params: {
  chainId: string;
}): Promise<IContractInfoListRes> => {
  return apiServer.get('/contract/contracts-info', {
    params,
  });
};
export const fetchVoteSchemeList = async (
  params: IVoteSchemeListReq,
): Promise<IVoteSchemeListRes> => {
  return apiServer.get('/vote/vote-scheme-list', {
    params,
  });
};
// need auth
export const fetchVoteHistory = async (params: IVoteHistoryReq): Promise<IVoteHistoryRes> => {
  return apiServer.get('/proposal/vote-history', {
    params,
  });
};

export const fetchTokenInfo = async (params: {
  symbol: string;
  chainId: string;
}): Promise<ITokenInfoRes> => {
  return apiServer.get('/token', {
    params,
  });
};
export const fetchExecutableList = async (
  params: IExecutableListReq,
): Promise<IExecutableListRes> => {
  return apiServer.get('/proposal/executable-list', {
    params,
  });
};

// explore
export const fetchAddressTokenList = async (params: {
  address: string;
}): Promise<IAddressTokenListRes> => {
  return explorerServer.get('/viewer/balances', {
    params,
  });
};

export const fetchAddressTransferList = async (params: {
  pageSize: number;
  pageNum: number;
  address: string;
}): Promise<IAddressTransferListRes> => {
  return explorerServer.get('/viewer/transferList', {
    params,
  });
};
export const fetchTokenPrice = async (params: {
  fsym: string;
  syms?: string;
}): Promise<ITokenPriceRes> => {
  if (!params.syms) {
    params.syms = 'USD';
  }

  return explorerServer.get('/token/price', {
    params,
  });
};
