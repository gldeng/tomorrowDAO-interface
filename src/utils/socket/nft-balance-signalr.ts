import { apiServerBase, curChain } from 'config';
import SignalR from './signalr';

class SignalRManager {
  private static instance: SignalRManager | null = null;
  private socket: SignalR | null = null;

  // private constructor() {
  //   //
  // }

  public static getInstance(): SignalRManager {
    if (SignalRManager.instance === null) {
      SignalRManager.instance = new SignalRManager();
    }
    return SignalRManager.instance;
  }

  public async initSocket(address: string): Promise<SignalR | null> {
    if (!this.socket) {
      const signalR = new SignalR({ url: apiServerBase + '/api/app/user/balance' }, () => {
        signalR.sendEvent('RequestUserBalanceProduce', { chainId: curChain, address });
      });
      try {
        await signalR.initAndStart();
        this.socket = signalR;
        console.log('SignalR initialized successfully.');
      } catch (e) {
        console.error('Error initializing SignalR:', e);
        this.socket = null; // Ensure that the socket remains null in case of failure
      }
    }
    return this.socket;
  }

  public getSocket(): SignalR | null {
    return this.socket;
  }
}

export default SignalRManager;
const nftBalanceSignalr = new SignalRManager();
export { nftBalanceSignalr };
