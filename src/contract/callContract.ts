import { IContractOptions, IContractError, ContractMethodType } from 'types';
import { formatErrorMsg } from './util';
import { getTxResult } from 'utils/getTxResult';
import { sleep } from 'utils/common';
import { GetContractServiceMethod } from './baseContract';
import { curChain } from 'config';
import { multiTokenContractRequest } from './multiTokenContract';
import { daoCreateContractRequest } from './daoCreateContract';
import { proposalCreateContractRequest } from './proposalCreateContract';

export const callContract = async <T>(
  methodName: string,
  params: T,
  address: string,
  options?: IContractOptions,
): Promise<IProposalCreated> => {
  console.log(
    '=====multiTokenContractRequest methodName, type, contractAddress, curChain, params: ',
    methodName,
    params,
    address,
    options?.type,
    curChain,
  );

  const CallContractMethod = GetContractServiceMethod(curChain, options?.type);

  try {
    const res = await CallContractMethod({
      contractAddress: address,
      methodName,
      args: params,
    });
    console.log('=====tokenAdapterContractRequest res: ', methodName, res);
    const result = res as IContractError;

    if (result?.error || result?.code || result?.Error) {
      throw formatErrorMsg(result);
    }

    const { transactionId, TransactionId } = result.result || result;
    const resTransactionId = TransactionId || transactionId;
    await sleep(1000);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const transaction = await getTxResult(resTransactionId!, curChain as Chain);

    console.log('=====tokenAdapterContractRequest transaction: ', methodName, transaction);

    return transaction;
  } catch (error) {
    console.error('=====tokenAdapterContractRequest error:', methodName, JSON.stringify(error));
    const resError = error as IContractError;
    const a = formatErrorMsg(resError);
    throw a;
  }
};

export interface IGetBalanceParams {
  symbol: string;
  owner: string;
}

export const GetBalanceByContract = async (
  params: IGetBalanceParams,
  options?: IContractOptions,
): Promise<{ balance: number }> => {
  const res = (await multiTokenContractRequest('GetBalance', params, {
    ...options,
    type: ContractMethodType.VIEW,
  })) as { balance: number };
  return res;
};

export const ApproveByContract = async (
  params: any,
  options?: IContractOptions,
): Promise<IContractError> => {
  const res = (await multiTokenContractRequest('Approve', params, {
    ...options,
  })) as IContractError;
  return res;
};

export const GetDaoProposalTimePeriodContract = async (
  params?: string,
  options?: IContractOptions,
): Promise<ITimePeriod> => {
  const res = (await proposalCreateContractRequest('GetDaoProposalTimePeriod', params, {
    ...options,
    type: ContractMethodType.VIEW,
  })) as unknown as ITimePeriod;
  return res;
};
