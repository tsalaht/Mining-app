import { createSlice } from '@reduxjs/toolkit';

interface MiningState {
  isMining: boolean;
}

const initialState: MiningState = {
  isMining: false,
};

const miningSlice = createSlice({
  name: 'mining',
  initialState,
  reducers: {
    startMining(state) {
      state.isMining = true;
    },
    stopMining(state) {
      state.isMining = false;
    },
  },
});

export const { startMining, stopMining } = miningSlice.actions;
export default miningSlice.reducer;