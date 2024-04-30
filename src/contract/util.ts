import { IContractError } from 'types';

export const formatErrorMsg = (result: IContractError) => {
  if (result.message) {
    return {
      ...result,
      error: result.code,
      errorMessage: {
        message: result?.message?.toString(),
      },
    };
  } else if (result.Error) {
    return {
      ...result,
      error: '401',
      errorMessage: {
        message: result?.Error?.toString()?.replace('AElf.Sdk.CSharp.AssertionException: ', ''),
      },
    };
  } else if (typeof result.error !== 'number' && typeof result.error !== 'string') {
    if ((result.error as any)?.message) {
      return {
        ...result,
        error: '401',
        errorMessage: {
          message: (result.error as any)?.message
            ?.toString()
            ?.replace('AElf.Sdk.CSharp.AssertionException: ', ''),
        },
      };
    }
  }
  return result;
};
