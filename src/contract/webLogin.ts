import { CallContractParams } from 'aelf-web-login';
import { WebLoginInterface } from 'aelf-web-login/dist/types/context';
import { SupportedELFChainId } from 'types';

export interface IWebLoginArgs {
  address: string;
  chainId: string;
}

type TMethodType = <T, R>(params: CallContractParams<T>) => Promise<R>;

export default class WebLoginInstance {
  public contract: any;
  public address: string | undefined;
  public chainId: string | undefined;

  private static instance: WebLoginInstance | null = null;
  private context: WebLoginInterface | null = null;
  private aelfSendMethod?: TMethodType = undefined;
  private aelfViewMethod?: TMethodType = undefined;
  private tdvvSendMethod?: TMethodType = undefined;
  private tdvvViewMethod?: TMethodType = undefined;
  private tdvwSendMethod?: TMethodType = undefined;
  private tdvwViewMethod?: TMethodType = undefined;

  constructor(options?: IWebLoginArgs) {
    this.address = options?.address;
    this.chainId = options?.chainId;
  }
  static get() {
    if (!WebLoginInstance.instance) {
      WebLoginInstance.instance = new WebLoginInstance();
    }
    return WebLoginInstance.instance;
  }

  setWebLoginContext(context: WebLoginInterface) {
    this.context = context;
  }

  setMethod({
    chain,
    sendMethod,
    viewMethod,
  }: {
    chain: Chain;
    sendMethod: TMethodType;
    viewMethod: TMethodType;
  }) {
    switch (chain) {
      case SupportedELFChainId.MAIN_NET: {
        this.aelfSendMethod = sendMethod;
        this.aelfViewMethod = viewMethod;
        break;
      }
      case SupportedELFChainId.TDVV_NET: {
        this.tdvvSendMethod = sendMethod;
        this.tdvvViewMethod = viewMethod;
        break;
      }
      case SupportedELFChainId.TDVW_NET: {
        this.tdvwSendMethod = sendMethod;
        this.tdvwViewMethod = viewMethod;
        break;
      }
    }
  }

  setContractMethod(
    contractMethod: {
      chain: Chain;
      sendMethod: TMethodType;
      viewMethod: TMethodType;
    }[],
  ) {
    contractMethod.forEach((item) => {
      this.setMethod(item);
    });
  }

  getWebLoginContext() {
    return this.context; // wallet, login, loginState
  }

  callSendMethod<T, R>(chain: Chain, params: CallContractParams<T>): Promise<R> {
    switch (chain) {
      case SupportedELFChainId.MAIN_NET:
        return this.aelfSendMethod!(params);
      case SupportedELFChainId.TDVV_NET:
        return this.tdvvSendMethod!(params);
      case SupportedELFChainId.TDVW_NET:
        return this.tdvwSendMethod!(params);
    }
    throw new Error('Error: Invalid chainId');
  }

  callViewMethod<T, R>(chain: Chain, params: CallContractParams<T>): Promise<R> {
    switch (chain) {
      case SupportedELFChainId.MAIN_NET:
        return this.aelfViewMethod!(params);
      case SupportedELFChainId.TDVV_NET:
        return this.tdvvViewMethod!(params);
      case SupportedELFChainId.TDVW_NET:
        return this.tdvwViewMethod!(params);
    }
    throw new Error('Error: Invalid chainId');
  }

  callContract<T>(params: CallContractParams<T>) {
    return this.context?.callContract(params);
  }
}

export const webLoginInstance = WebLoginInstance.get();
