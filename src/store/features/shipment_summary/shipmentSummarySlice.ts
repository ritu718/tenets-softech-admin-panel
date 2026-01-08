
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  shipmentSummary:null

};
const shipmentSummarySlice = createSlice({
  name: "shipmentSummary",
  initialState,
  reducers: {
      setShipmentSummary: (state, action: PayloadAction<any>) => {
      console.log("shipmentSummarystore:", action.payload);
      state.shipmentSummary = action.payload;

    },
    

  },
});

export const {  setShipmentSummary} = shipmentSummarySlice.actions;
export default shipmentSummarySlice.reducer;
