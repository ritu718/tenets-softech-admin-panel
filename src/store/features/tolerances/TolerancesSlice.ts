import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
toleranceDialogOpen:false,
toleranecData:null,
};

const tolerancesSlice = createSlice({
  name: "tolerances",
  initialState,
  reducers: {
      setToleranceDialogOpen: (state, action: PayloadAction<any>) => {
      state.toleranceDialogOpen = action.payload;
    },
     setToleranecData: (state, action: PayloadAction<any>) => {
      console.log("toleranecData action.payload: ",action.payload);
      
      state.toleranecData = action.payload;
    },
    
  },
});

export const { setToleranceDialogOpen,setToleranecData } = tolerancesSlice.actions;
export default tolerancesSlice.reducer;