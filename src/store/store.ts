import { configureStore } from "@reduxjs/toolkit";
import invoiceDataReducer from "./features/invoice_data/invoiceDataSlice";
import languagesReducer from "./features/languages/languagesSlice";
import carriersReducer from "./features/carrier/carriersSlice";
import userDetailsReducer from "./features/user_details/userDetailsSlice";
import freightBasisReducer from "./features/freight_basis/FreightBasisSlice";
import tolerancesReducer from "./features/tolerances/TolerancesSlice";
import tariffsSliceReducer from "./features/tariffs/TariffsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      invoiceData:invoiceDataReducer,
      languages:languagesReducer,
      carriers:carriersReducer,
      userDetails:userDetailsReducer,
      freightBasis:freightBasisReducer,
      tolerances:tolerancesReducer,
      tariffs:tariffsSliceReducer,
    },
  });

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
