import {
  IContractOptions,
  ContractMethodType,
  ISendResult,
  IContractError,
  SupportedELFChainId,
} from 'types';
import { store } from 'redux/store';
import { formatErrorMsg } from './util';
import { getTxResult } from 'utils/getTxResult';
import { sleep } from 'utils/common';
import { GetContractServiceMethod } from './baseContract';

export const daoCreateContractRequest = async <T, R>(
  methodName: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().elfInfo.elfInfo;
  console.log('info', store.getState().elfInfo, '123', store.getState());
  const contractAddress = info?.daoAddress ?? 'RRF7deQbmicUh6CZ1R2y7U9M8n2eHPyCgXVHwiSkmNETLbL4D';

  const curChain: Chain = info.curChain ?? SupportedELFChainId.TDVW_NET;

  console.log(
    '=====multiTokenContractRequest methodName, type, contractAddress, curChain, params: ',
    methodName,
    options?.type,
    contractAddress,
    curChain,
    params,
  );

  const CallContractMethod = GetContractServiceMethod(curChain, options?.type);

  try {
    const res: R = await CallContractMethod({
      contractAddress,
      methodName,
      args: params,
    });
    console.log('=====tokenAdapterContractRequest res: ', methodName, res);
    const result = res as IContractError;

    if (result?.error || result?.code || result?.Error) {
      throw formatErrorMsg(result);
    }

    if (options?.type === ContractMethodType.VIEW) {
      return res;
    }

    const { transactionId, TransactionId } = result.result || result;
    const resTransactionId = TransactionId || transactionId;
    await sleep(1000);
    const transaction = await getTxResult(resTransactionId!, curChain as Chain);

    console.log('=====tokenAdapterContractRequest transaction: ', methodName, transaction);
    return { TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult };
  } catch (error) {
    console.error('=====tokenAdapterContractRequest error:', methodName, JSON.stringify(error));
    const resError = error as IContractError;
    throw formatErrorMsg(resError);
  }
};
