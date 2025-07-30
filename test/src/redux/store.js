// store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./authSlice";
import usersReducer from "./usersSlice";
import vendorsReducer from "./vendorSlice";
import productsReducer from "./productsSlice";
import categoryReducer from "./categorySlice";
import cartReducer from "./cartSlice";
import blogReducer from "./blogSlice";
import orderReducer from "./orderSlice";
import partnersReducer from "./partnersSlice";
import transactionReducer from "./transactionSlice";
import reviewReducer from "./reviewSlice";
import notificationReducer from "./notificationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  vendors: vendorsReducer,
  products: productsReducer,
  categories: categoryReducer,
  cart: cartReducer,
  orders: orderReducer,
  blogs:blogReducer,
  partners:partnersReducer,
  transactions: transactionReducer,
  reviews: reviewReducer,
  notifications: notificationReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  blacklist: [],
  debug: true,
  timeout: 0,
  version: 1,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
