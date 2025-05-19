import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CoinState {
  selectedCoin: string;
  miningSpeed: number;
  minedAmount: number;
}

const initialState: CoinState = {
  selectedCoin: '',
  miningSpeed: 3.00, // 3.00 GH/s
  minedAmount: 0,
};

const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    setSelectedCoin: (state, action: PayloadAction<string>) => {
      state.selectedCoin = action.payload;
    },
    updateMinedAmount: (state, action: PayloadAction<number>) => {
      state.minedAmount = action.payload;
    },
    increaseMiningSpeed: (state, action: PayloadAction<number>) => {
      state.miningSpeed += action.payload;
    },
  },
});

export const { setSelectedCoin, updateMinedAmount, increaseMiningSpeed } = coinSlice.actions;
export default coinSlice.reducer;