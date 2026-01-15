import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
 userInfo:null,
userProfile:null,
firebaseId:null,
firebaseToken:null
 
};

const userDetailsSlice = createSlice({
  name: "carriers",
  initialState,
  reducers: {
      setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },

    setUserProfile: (state, action: PayloadAction<any>) => {
      state.userProfile = action.payload;
    },

    setFirebaseId: (state, action: PayloadAction<any>) => {
      state.firebaseId = action.payload;
    },
    setFirebaseToken: (state, action: PayloadAction<any>) => {
      state.firebaseToken = action.payload;
    },
  },
});

export const {  setUserInfo,setUserProfile,setFirebaseId,setFirebaseToken } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;