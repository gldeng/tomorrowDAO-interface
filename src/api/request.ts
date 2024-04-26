import qs from 'qs';
import { apiServer } from './axios';

export const fetchDaoList = async (params: IListDaoReq): Promise<ListDaoRes> => {
  return apiServer.get('/dao/dao-list', {
    params,
  });
};

export const fetchDaoInfo = async (params: DaoInfoReq): Promise<DaoInfoRes> => {
  return apiServer.get('/dao/dao-info', {
    params,
  });
};

export const fetchProposalList = async (params: ProposalListReq): Promise<ProposalListRes> => {
  return apiServer.get('/proposal/list', {
    params,
  });
};

export const fetchProposalDetail = async (
  params: ProposalDetailReq,
): Promise<ProposalDetailRes> => {
  return apiServer.get('/proposal/detail', {
    params,
  });
};

export const fetchGovernanceMechanismList = async (params: {
  chainId: string;
  daoId: string;
}): Promise<GovernanceModelListRes> => {
  return apiServer.get('/governance/list', {
    params,
  });
};

export const fetchContractInfo = async (params: {
  chainId: string;
}): Promise<ContractInfoListRes> => {
  return apiServer.get('/contract/contracts-info', {
    params,
  });
};
export const fetchVoteSchemeList = async (
  params: IVoteSchemeListReq,
): Promise<IVoteSchemeListRes> => {
  return apiServer.get('/vote-scheme-list', {
    params,
  });
};

export const fetchTokenInfo = async (params: {
  symbol: string;
  chainId: string;
}): Promise<ITokenInfoRes> => {
  return apiServer.post('/token', {
    params,
  });
};
