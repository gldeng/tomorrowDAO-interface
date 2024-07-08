import { apiServer } from '../axios';

export const fetchNetworkDaoProposalList = async (params: any): Promise<any> => {
  return apiServer.get('/proposal/list', {
    params,
  });
};

export const fetchNetworkDaoProposaDetail = async (params: any): Promise<any> => {
  return apiServer.get('/proposal/proposalInfo', {
    params,
  });
};
