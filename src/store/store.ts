import { configureStore } from "@reduxjs/toolkit";
import invoiceDataReducer from "./features/invoice_data/invoiceDataSlice";
import languagesReducer from "./features/languages/languagesSlice";
import carriersReducer from "./features/carrier/carriersSlice";
import userDetailsReducer from "./features/user_details/userDetailsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      invoiceData:invoiceDataReducer,
      languages:languagesReducer,
      carriers:carriersReducer,
      userDetails:userDetailsReducer,
    },
  });

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
