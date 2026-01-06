import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
toleranceDialogOpen:false,
};
//  const [toleranceDialogOpen, setToleranceDialogOpen] = useState(false);
const tolerancesSlice = createSlice({
  name: "tolerances",
  initialState,
  reducers: {
      setToleranceDialogOpen: (state, action: PayloadAction<any>) => {
      state.toleranceDialogOpen = action.payload;
    },
  },
});

export const { setToleranceDialogOpen } = tolerancesSlice.actions;
export default tolerancesSlice.reducer;