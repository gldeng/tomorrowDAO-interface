import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from 'redux/store';

export interface IDaoCreateState {
  token?: TokenInfoData;
}

const initialState: IDaoCreateState = {};

// Actual Slice
export const daoCreateSlice = createSlice({
  name: 'daoCreate',
  initialState,
  reducers: {
    setToken(state, action) {
      console.log(12366666666, action);
      state.token = action.payload;
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

export const { setToken } = daoCreateSlice.actions;

export const getDaoCreateInfo = (state: AppState) => state;

export default daoCreateSlice.reducer;
