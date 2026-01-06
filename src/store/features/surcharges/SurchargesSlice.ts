import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
 surchargesData:null,
  surchargesCountryCodes:[],
 surchargesCountryIndex:0,

};
 
const surchargesSlice = createSlice({
  name: "Surcharges",
  initialState,
  reducers: {
      setSurchargesData: (state, action: PayloadAction<any>) => {      
      state.surchargesData = action.payload;
    },

       setSurchargesCountryCodes: (state, action: PayloadAction<any>) => {
      state.surchargesCountryCodes = action.payload;
    },
    setSurchargesCountryIndex: (state, action: PayloadAction<any>) => {
      state.surchargesCountryIndex = action.payload;
    },

  },
});

export const { setSurchargesData, setSurchargesCountryCodes, setSurchargesCountryIndex } = surchargesSlice.actions;
export default surchargesSlice.reducer;