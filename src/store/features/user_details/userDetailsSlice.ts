import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
 userInfo:null,
};
 
const userDetailsSlice = createSlice({
  name: "carriers",
  initialState,
  reducers: {
      setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
  },
});

export const {  setUserInfo } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;