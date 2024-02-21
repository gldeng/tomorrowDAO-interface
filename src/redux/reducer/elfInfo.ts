import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from 'redux/store';

export interface IAelfInfoState {
  elfInfo: IConfigItems;
}

const initialState: IAelfInfoState = {
  elfInfo: {
    networkType: 'TESTNET',
    rpcUrlAELF: 'https://aelf-test-node.aelf.io',
    rpcUrlTDVV: 'https://tdvw-test-node.aelf.io',
    rpcUrlTDVW: 'https://tdvw-test-node.aelf.io',
    connectServer: 'https://auth-portkey-test.portkey.finance',
    graphqlServer:
      'https://dapp-aa-portkey-test.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql',
    portkeyServer: 'https://aa-portkey-test.portkey.finance',
    curChain: 'tDVW',
    connectUrl: 'https://auth-aa-portkey-test.portkey.finance',
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
