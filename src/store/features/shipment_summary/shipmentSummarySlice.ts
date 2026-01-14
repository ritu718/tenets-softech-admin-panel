
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  shipmentSummary:null,

 priceFixingDialogData:null,
};
const shipmentSummarySlice = createSlice({
  name: "shipmentSummary",
  initialState,
  reducers: {
      setShipmentSummary: (state, action: PayloadAction<any>) => {
      console.log("shipmentSummarystore:", action.payload);
      state.shipmentSummary = action.payload;

    },
   
     setpriceFixingDialogData: (state, action: PayloadAction<any>) => {
      state.priceFixingDialogData = action.payload;
    },

  },
});

export const {  setShipmentSummary,setpriceFixingDialogData} = shipmentSummarySlice.actions;
export default shipmentSummarySlice.reducer;
