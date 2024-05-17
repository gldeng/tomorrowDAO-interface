import { IContractOptions, ContractMethodType, IContractError } from 'types';
import { formatErrorMsg } from './util';
import { getTxResult } from 'utils/getTxResult';
import { sleep } from 'utils/common';
import { GetContractServiceMethod } from './baseContract';
import { propalAddress, curChain } from 'config';
import ProtoInstance from 'utils/decode-log';

export const proposalCreateContractRequest = async <T>(
  methodName: string,
  params: T,
  options?: IContractOptions,
): Promise<IProposalCreated> => {
  const contractAddress = propalAddress;

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
    const res = await CallContractMethod({
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
    const proposalCreatedRes = await ProtoInstance.getLogEventResult<IProposalCreated>({
      contractAddress: propalAddress,
      logsName: 'ProposalCreated',
      TransactionResult: transaction,
    });
    console.log('proposalCreatedRes', proposalCreatedRes);
    return proposalCreatedRes;
  } catch (error) {
    console.error('=====tokenAdapterContractRequest error:', methodName, JSON.stringify(error));
    const resError = error as IContractError;
    const a = formatErrorMsg(resError);
    throw a;
  }
};
