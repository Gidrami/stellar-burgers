import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredients';
import { constructorSlice } from './slices/constructor';
import { feedsSlice } from './slices/feeds';
import { orderSlice } from './slices/order';
import { userSlice } from './slices/user';
import { userOrdersSlice } from './slices/userOrders';

export const rootReducer = combineReducers({
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [constructorSlice.name]: constructorSlice.reducer,
  [feedsSlice.name]: feedsSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [userOrdersSlice.name]: userOrdersSlice.reducer
});
