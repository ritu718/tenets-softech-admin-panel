import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
  overview: [],
  filteredOverview:[],
  configDialogOpen:false,
  addCarrierDialogOpen:false,
  carrierConfigs:[],
};


const invoiceDataSlice = createSlice({
  name: "invoiceData",
  initialState,
  reducers: {
    setOverview: (state, action: PayloadAction<any>) => {
      state.overview = action.payload;
    },
     setFilteredOverview: (state, action: PayloadAction<any>) => {
      state.filteredOverview = action.payload;
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
    

  },
});

export const { setOverview, setFilteredOverview,setConfigDialogOpen,setCarrierConfigs } = invoiceDataSlice.actions;
export default invoiceDataSlice.reducer;
