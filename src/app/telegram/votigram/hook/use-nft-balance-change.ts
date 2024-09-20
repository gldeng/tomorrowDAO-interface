import { curChain, nftSymbol } from 'config';
import { GetBalanceByContract } from 'contract/callContract';
import { useAsyncEffect } from 'ahooks';
import { useEffect, useState } from 'react';
import { useWebLogin } from 'aelf-web-login';
import { nftBalanceSignalr } from 'utils/socket/nft-balance-signalr';
import SignalR from 'utils/socket/signalr';
import { HubConnectionState } from '@microsoft/signalr';

interface nftBalanceChangeProps {
  openModal: () => void;
  closeModal: () => void;
  onNftBalanceChange?: (nftItem: INftBalanceChange) => void;
}

interface INftBalanceChange {
  symbol: string;
  beforeAmount: number;
  nowAmount: number;
  address: string;
}
export default function useNftBalanceChange(params: nftBalanceChangeProps) {
  const { openModal, closeModal, onNftBalanceChange } = params;
  const [disableOperation, setDisableOperation] = useState(false);
  const { wallet } = useWebLogin();
  useEffect(() => {
    let socket: SignalR | null = null;
    const initSocket = async () => {
      const socketInstance = await nftBalanceSignalr.initSocket(wallet.address);
      if (!socketInstance) {
        return;
      }
      socket = socketInstance;
      socketInstance.sendEvent('RequestUserBalanceProduce', {
        chainId: curChain,
        address: wallet.address,
      });
      socketInstance.registerHandler('RequestUserBalanceProduce', (nftItem: INftBalanceChange) => {
        console.log('RequestUserBalanceProduce', nftItem);
        if (nftItem.nowAmount === 0 && nftItem.symbol === nftSymbol) {
          setDisableOperation(true);
          openModal();
        } else {
          setDisableOperation(false);
          closeModal();
        }
      });
      socketInstance.registerHandler('ReceiveUserBalanceProduce', (nftItem: INftBalanceChange) => {
        console.log('ReceiveUserBalanceProduce', nftItem);
        onNftBalanceChange?.(nftItem);
        if (nftItem.nowAmount === 0 && nftItem.symbol === nftSymbol) {
          setDisableOperation(true);
          openModal();
        } else {
          setDisableOperation(false);
          closeModal();
        }
      });
    };
    initSocket();

    return () => {
      socket?.destroy();
    };
  }, []);
  return { disableOperation };
}
