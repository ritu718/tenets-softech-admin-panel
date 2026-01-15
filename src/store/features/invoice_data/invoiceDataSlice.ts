import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
  overview: [],
  invoiceData:[],
  configDialogOpen:false,
  addCarrierDialogOpen:false,
  carrierConfigs:[],
  isInvoiceDataApiCalled:true,
  invoiceDetailsData:[],
  responseInputDialogOpen:false,
};

 
const invoiceDataSlice = createSlice({
  name: "invoiceData",
  initialState,
  reducers: {
    setOverview: (state, action: PayloadAction<any>) => {
      state.overview = action.payload;
    },
     setInvoiceData: (state, action: PayloadAction<any>) => {
      state.invoiceData = action.payload;
    } ,
 setConfigDialogOpen: (state, action: PayloadAction<any>) => {
      state.configDialogOpen = action.payload;
    },
    setAddCarrierDialogOpen: (state, action: PayloadAction<any>) => {
      state.addCarrierDialogOpen = action.payload;
    } ,
     setCarrierConfigs: (state, action: PayloadAction<any>) => {
      state.carrierConfigs = action.payload;
    } ,
    
 setIsInvoiceDataApiCalled: (state, action: PayloadAction<any>) => {
      state.isInvoiceDataApiCalled = action.payload;
    } ,
     setInvoiceDetailsData: (state, action: PayloadAction<any>) => {
      state.invoiceDetailsData = action.payload;
    } ,
     setResponseInputDialogOpen: (state, action: PayloadAction<any>) => {
      state.responseInputDialogOpen = action.payload;
    } ,
  },
});

export const { setOverview, setInvoiceData,setConfigDialogOpen,setCarrierConfigs,setIsInvoiceDataApiCalled,setInvoiceDetailsData,setResponseInputDialogOpen } = invoiceDataSlice.actions;
export default invoiceDataSlice.reducer;
