import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
 isApisCalledForSelectedCarier:true,
};
 
const allApisCallingStatusSlice = createSlice({
  name: "FreightBasis",
  initialState,
  reducers: {
      setIsApisCalledForSelectedCarier: (state, action: PayloadAction<any>) => {
      state.isApisCalledForSelectedCarier = action.payload;
    },
    
  },
});

export const {  setIsApisCalledForSelectedCarier } = allApisCallingStatusSlice.actions;
export default allApisCallingStatusSlice.reducer;