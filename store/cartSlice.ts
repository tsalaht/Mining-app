import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, size, color, price } = action.payload;

      // Find if the same product with the same size and color exists
      const existingItem = state.items.find(
        item => item.id === id && item.size === size && item.color === color
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount += price;
    },
    incrementQuantity: (state, action: PayloadAction<{ id: number; size?: string; color?: string }>) => {
      const { id, size, color } = action.payload;

      const item = state.items.find(
        item => item.id === id && item.size === size && item.color === color
      );

      if (item) {
        item.quantity += 1;
        state.totalAmount += item.price;
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ id: number; size?: string; color?: string }>) => {
      const { id, size, color } = action.payload;

      const item = state.items.find(
        item => item.id === id && item.size === size && item.color === color
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          state.totalAmount -= item.price;
        } else {
          state.items = state.items.filter(
            i => !(i.id === id && i.size === size && i.color === color)
          );
          state.totalAmount -= item.price;
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: number; size?: string; color?: string }>) => {
      const { id, size, color } = action.payload;

      const itemToRemove = state.items.find(
        item => item.id === id && item.size === size && item.color === color
      );

      if (itemToRemove) {
        state.totalAmount -= itemToRemove.price * itemToRemove.quantity;
        state.items = state.items.filter(
          item => !(item.id === id && item.size === size && item.color === color)
        );
      }
    },
    clearCart: state => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
