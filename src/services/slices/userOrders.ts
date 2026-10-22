import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  getOrdersApi
);

type TUserOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

export const initialState: TUserOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  selectors: {
    getUserOrders: (state) => state.orders,
    getUserOrdersLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
  }
});

export const { getUserOrders, getUserOrdersLoading } =
  userOrdersSlice.selectors;
