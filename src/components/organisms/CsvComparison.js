import React, { useEffect} from "react";
import {
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import InvoiceFilter from "./invoice_filter";
import InvoiceFilter2 from "./invoice_filter2";
import { useLanguage } from "@/hooks/useLanguage";

import InvoiceTable from "./invoice_table";

import InvoiceConfig from "@/dialogs/invoice_config";
import Tolerance from "./tolerance";
import { getCarrierConfFomServer, getCompaniesData } from "@/dialogs/invoice_config/services";

const CsvComparison = () => {
   const dispatch = useAppDispatch();
     const userId = useAppSelector((state) => state?.userDetails?.userProfile?.id);
     const invoiceFilter = useAppSelector((state) => state?.invoiceFilter);
  const { localeText } =useLanguage();
   
    useEffect(()=>{
         userId&&getCarrierConfFomServer({userId},dispatch)
    },[userId])
    
              useEffect(()=>{
           userId&& getCompaniesData({userId,...invoiceFilter},dispatch)
          },[invoiceFilter,userId])
 

  const {isInvoiceDataApiCalled} = useAppSelector((state) => state.invoiceData);

  if (isInvoiceDataApiCalled) return <CircularProgress />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 2, flexWrap: "wrap" }}>
       
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {localeText.header.title}
        </Typography>
        <InvoiceFilter  />
        
      </Box>
          <InvoiceFilter2/>
          <InvoiceTable/>
      <InvoiceConfig/>
      <Tolerance/>
    </Box>
  );
};

export default React.memo(CsvComparison);
