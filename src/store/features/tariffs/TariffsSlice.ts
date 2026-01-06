import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
 tariffsData:null,
  tariffsCountryCodes:[],
 tariffsCountryIndex:0,

};
 
const tariffsSlice = createSlice({
  name: "Tariffs",
  initialState,
  reducers: {
      setTariffsData: (state, action: PayloadAction<any>) => {      
      state.tariffsData = action.payload;
    },

       setTariffsCountryCodes: (state, action: PayloadAction<any>) => {
      state.tariffsCountryCodes = action.payload;
    },
    setTariffsCountryIndex: (state, action: PayloadAction<any>) => {
      state.tariffsCountryIndex = action.payload;
    },

  },
});

export const { setTariffsData, setTariffsCountryCodes, setTariffsCountryIndex } = tariffsSlice.actions;
export default tariffsSlice.reducer;