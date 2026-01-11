import React, {  useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCarrier, setFromDate, setInvoiceNumber, setToDate } from "@/store/features/invoice_filter/invoiceFilterSlice";

 const InvoiceFilter2 =()=> {
       const dispatch = useAppDispatch();
       const {invoiceNumber,fromDate,toDate,carrier:selectedCarrierId} = useAppSelector((state:any) => state?.invoiceFilter);
    
   const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
      
     const { localeText } =useLanguage();

 const carriersForDisplay = useMemo(() => {
    return [{name:localeText.overview.filters.all,id:"all"}, ...carriers];
  }, [carriers,localeText]);
  
  return (
    
     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>{localeText.overview.filters.carrier}</InputLabel>
                  <Select
                    value={selectedCarrierId||""}
                    label={localeText.overview.filters.carrier}
                    onChange={(e) => dispatch(setCarrier(e.target.value))}
                  >
                    {carriersForDisplay.map((carrierItem : any ) => (
                      <MenuItem key={carrierItem?.id} value={carrierItem.id}>
                        {carrierItem.name }
                      </MenuItem>
                    ))}
                  </Select>
                  
                </FormControl>
    
                <TextField
                  label={localeText.overview.filters.invoiceNumber}
                  value={invoiceNumber||""}
                  onChange={(e) => dispatch(setInvoiceNumber(e.target.value))}
                />
    
                <TextField
                  label={localeText.overview.filters.fromDate}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={fromDate||""}
                  onChange={(e) => dispatch(setFromDate(e.target.value))}
                  sx={{ minWidth: 170 }}
                />
    
                <TextField
                  label={localeText.overview.filters.toDate}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={toDate||""}
                  onChange={(e) => dispatch(setToDate(e.target.value))}
                  sx={{ minWidth: 170 }}
                />
    
                <Button
                  variant="text"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                  }}
                  disabled={!fromDate && !toDate}
                  sx={{ alignSelf: "center" }}
                >
                  {localeText.overview.filters.clear}
                </Button>
              </Box>
  )
}

export default React.memo(InvoiceFilter2)