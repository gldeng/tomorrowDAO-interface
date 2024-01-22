import request from './axios';
export const fetchEtherscan = async (): Promise<any> => {
	return request.get(
	  'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YourApiKeyToken',
	);
  };
  