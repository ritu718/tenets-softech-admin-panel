import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
 carrier:null,
  invoiceNumber:null,
 fromDate:null,
 toDate:null,

};
 
const invoiceFilterSlice = createSlice({
  name: "Tariffs",
  initialState,
  reducers: {
      setCarrier: (state, action: PayloadAction<any>) => {      
      state.carrier = action.payload;
    },

       setInvoiceNumber: (state, action: PayloadAction<any>) => {
      state.invoiceNumber = action.payload;
    },
    setFromDate: (state, action: PayloadAction<any>) => {
      state.fromDate = action.payload;
    },
  setToDate: (state, action: PayloadAction<any>) => {
      state.toDate = action.payload;
    },
  },
});

export const { setCarrier, setInvoiceNumber, setFromDate,setToDate } = invoiceFilterSlice.actions;
export default invoiceFilterSlice.reducer;