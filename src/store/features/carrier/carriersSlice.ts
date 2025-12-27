import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
 activeCarrierId:null,
};
 
const carriersSlice = createSlice({
  name: "carriers",
  initialState,
  reducers: {
      setActiveCarrierId: (state, action: PayloadAction<any>) => {
      state.activeCarrierId = action.payload;
    },
  },
});

export const {  setActiveCarrierId } = carriersSlice.actions;
export default carriersSlice.reducer;