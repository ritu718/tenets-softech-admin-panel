import { configureStore } from "@reduxjs/toolkit";
import invoiceDataReducer from "./features/invoice_data/invoiceDataSlice";
import languagesReducer from "./features/languages/languagesSlice";
import carriersReducer from "./features/carrier/carriersSlice";
import userDetailsReducer from "./features/user_details/userDetailsSlice";
import freightBasisReducer from "./features/freight_basis/FreightBasisSlice";
import tolerancesReducer from "./features/tolerances/TolerancesSlice";
import tariffsSliceReducer from "./features/tariffs/TariffsSlice";
import surchargesReducer from "./features/surcharges/SurchargesSlice";
import shipmentDataReducer from "./features/shipment_data/shipmentDataSlice";
import AllApisCallingStatusReducer from "./features/all_apis_calling_status/AllApisCallingStatusSlice";
 import invoiceFilterReducer from "./features/invoice_filter/invoiceFilterSlice";

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
      surcharges: surchargesReducer,
      shipmentData:shipmentDataReducer,
      allApisCallingStatus:AllApisCallingStatusReducer,
      invoiceFilter:invoiceFilterReducer
    },
  });

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
