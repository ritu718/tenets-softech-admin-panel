import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
 freightBasisData:null,
 freightCountryCodes:[],
 freightCountryIndex:0,
};
 
const freightBasisSlice = createSlice({
  name: "FreightBasis",
  initialState,
  reducers: {
      setFreightBasisData: (state, action: PayloadAction<any>) => {
      state.freightBasisData = action.payload;
    },
    setFreightCountryCodes: (state, action: PayloadAction<any>) => {
      state.freightCountryCodes = action.payload;
    },
    setFreightCountryIndex: (state, action: PayloadAction<any>) => {
      state.freightCountryIndex = action.payload;
    },
  },
});

export const {  setFreightBasisData, setFreightCountryCodes, setFreightCountryIndex } = freightBasisSlice.actions;
export default freightBasisSlice.reducer;