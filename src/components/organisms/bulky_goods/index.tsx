import React, {  useState } from "react";
import {
  Typography,
  TextField,
  Stack,
  Paper,
} from "@mui/material";
import { NEBENKOSTEN_INITIAL_COUNTRIES } from "@/constants/common";
import { createFreightBase   } from "@/utils/helper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCarrierConfigs } from "@/store/features/invoice_data/invoiceDataSlice";
import { useLanguage } from "@/hooks/useLanguage";
import { useHandleFreightChanges } from "@/hooks/useHandleFreightChanges";

export default function BulkyGoods(){
 const { localeText } =useLanguage();
 const {handleFreightChange}=useHandleFreightChanges();
 const pricingText = localeText.config.pricing;
  const {freightCountryCodes, freightCountryIndex,freightBasisData} = useAppSelector((state) => state.freightBasis);
console.log("freightBasisData: ",freightBasisData);

  const {Bulkiness} = freightBasisData?.countries?.[freightCountryCodes[freightCountryIndex]] || {};
   
  return(
        <>
       <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                       <Typography variant="subtitle2" gutterBottom>
                         {pricingText.freight.bulkyTitle}
                       </Typography>
                       <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                         <TextField
                           size="small"
                           label={pricingText.freight.bulkyCbm}
                           value={Bulkiness?.CubicMeters || ""}
                           onChange={(e) => handleFreightChange("Bulkiness", {CubicMeters:e.target.value,LoadingMeters: Bulkiness?.LoadingMeters || ""})}
                         />
                         <TextField
                           size="small"
                           label={pricingText.freight.bulkyLdm}
                           value={Bulkiness?.LoadingMeters || ""}
                           onChange={(e) => handleFreightChange("Bulkiness", {LoadingMeters:e.target.value,CubicMeters: Bulkiness?.CubicMeters || ""})}
                         />
                       </Stack>
                     </Paper>
        </>
    )
}