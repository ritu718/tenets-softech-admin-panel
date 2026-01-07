import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
  activeConfigTab:"pricing",
  shipmentData:null

};

// const [activeConfigTab, setActiveConfigTab] = useState("pricing");
const shipmentDataSlice = createSlice({
  name: "shipmentData",
  initialState,
  reducers: {
    setActiveConfigTab: (state, action: PayloadAction<any>) => {
      state.activeConfigTab = action.payload;
    },
   
    setShipmentData: (state, action: PayloadAction<any>) => {
      console.log("shipmentData:", action.payload);
      state.shipmentData = action.payload;
      
    },
    

  },
});

export const { setActiveConfigTab, setShipmentData} = shipmentDataSlice.actions;
export default shipmentDataSlice.reducer;
