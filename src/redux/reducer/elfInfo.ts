import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from 'redux/store';

export interface IAelfInfoState {
  elfInfo: IConfigItems;
}

const initialState: IAelfInfoState = {
  elfInfo: {
    networkType: 'TESTNET',
    rpcUrlAELF: 'https://explorer-test.aelf.io/chain',
    rpcUrlTDVV: 'https://tdvw-test-node.aelf.io',
    rpcUrlTDVW: 'https://tdvw-test-node.aelf.io',
    connectServer: 'https://auth-portkey-test.portkey.finance',
    graphqlServer:
      'https://dapp-aa-portkey-test.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql',
    portkeyServer: 'https://aa-portkey-test.portkey.finance',
    curChain: 'tDVW', //
    connectUrl: 'https://auth-aa-portkey-test.portkey.finance',
    daoAddress: 'RRF7deQbmicUh6CZ1R2y7U9M8n2eHPyCgXVHwiSkmNETLbL4D',
    propalAddress: '2sJ8MDufVDR3V8fDhBPUKMdP84CUf1oJroi9p8Er1yRvMp3fq7',
    // token contract address
    mainChainAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    sideChainAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
  },
};

// Actual Slice
export const elfInfoSlice = createSlice({
  name: 'elfInfo',
  initialState,
  reducers: {
    setElfInfo(state, action) {
      state.elfInfo = action.payload;
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.info,
      };
    },
  },
});

export const { setElfInfo } = elfInfoSlice.actions;

export const getElfInfo = (state: AppState) => state.elfInfo.elfInfo;

export default elfInfoSlice.reducer;
