import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {
  overview: [{
    rechnungsnummer: "R-1001",
    projekt_id: "p1",
    datum: "2025-11-20T06:42:00.984Z",
    spedition: "DHL",
    preis1: 2268.5,      // Order total
    preis2: 2263.0,      // Invoice total
    differenz: 2268.5 - 2263.0, // ✅ 5.5
  },
  {
    rechnungsnummer: "R-1002",
    projekt_id: "p1",
    datum: "2025-11-18T06:42:00.984Z",
    spedition: "DB Schenker",
    preis1: 378,
    preis2: 448,
    differenz: 378 - 448, // ✅ -70
  }],
  invoiceData:[],
  configDialogOpen:false,
  addCarrierDialogOpen:false,
  carrierConfigs:[],
  isInvoiceDataApiCalled:true,
  invoiceDetailsData:[],
  carrierViewDialogOpen:false,
  details:[{
    rowKey: "S-001",
    sendungsID: "S-001",
    spedition: "DHL",
    preis1: 120,
    preis2: 118,
    differenz: 120 - 118, // ✅ REQUIRED
    nebenkostenDetails: [], // ✅ REQUIRED
  },
  {
    rowKey: "S-002",
    sendungsID: "S-002",
    spedition: "DHL",
    preis1: 45,
    preis2: 46,
    differenz: 45 - 46,
    nebenkostenDetails: [],
  },],
  selectedInvoice:{rechnungsnummer: 'R-1001', projektId: 'p1'},

};

const invoiceDataSlice = createSlice({
  name: "invoiceData",
  initialState,
  reducers: {
    setOverview: (state, action: PayloadAction<any>) => {
      state.overview = action.payload;
    },
     setInvoiceData: (state, action: PayloadAction<any>) => {
      state.invoiceData = action.payload;
    } ,
 setConfigDialogOpen: (state, action: PayloadAction<any>) => {
      state.configDialogOpen = action.payload;
    },
    setAddCarrierDialogOpen: (state, action: PayloadAction<any>) => {
      state.addCarrierDialogOpen = action.payload;
    } ,
     setCarrierConfigs: (state, action: PayloadAction<any>) => {
      state.carrierConfigs = action.payload;
    } ,
    
 setIsInvoiceDataApiCalled: (state, action: PayloadAction<any>) => {
      state.isInvoiceDataApiCalled = action.payload;
    } ,
     setInvoiceDetailsData: (state, action: PayloadAction<any>) => {
      state.invoiceDetailsData = action.payload;
    } ,
      setCarrierViewDialogOpen: (state, action: PayloadAction<any>) => {
      state.carrierViewDialogOpen = action.payload;
    } ,
       setDetails: (state, action: PayloadAction<any>) => {
      state.details = action.payload;
    } ,
      setSelectedInvoice: (state, action: PayloadAction<any>) => {
      state.selectedInvoice = action.payload;
    } ,
  },
});

export const { setOverview, setInvoiceData,setConfigDialogOpen,setCarrierConfigs,setIsInvoiceDataApiCalled,setInvoiceDetailsData,setCarrierViewDialogOpen,
   setDetails, setSelectedInvoice } = invoiceDataSlice.actions;
export default invoiceDataSlice.reducer;
