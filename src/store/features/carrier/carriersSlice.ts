import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
 activeCarrierId:null,
 editCarrier:null,
};
 
const carriersSlice = createSlice({
  name: "carriers",
  initialState,
  reducers: {
      setActiveCarrierId: (state, action: PayloadAction<any>) => {
      state.activeCarrierId = action.payload;
    },
    setEditCarrier: (state, action: PayloadAction<any>) => {
      state.editCarrier = action.payload;
    },
  },
});

export const {  setActiveCarrierId,setEditCarrier } = carriersSlice.actions;
export default carriersSlice.reducer;