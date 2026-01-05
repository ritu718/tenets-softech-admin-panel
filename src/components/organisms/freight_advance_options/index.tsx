import React from "react";
import {
  Typography,
  TextField,
  Stack,
  Paper,
} from "@mui/material";
import {  useAppSelector } from "@/store/hooks";
import { useLanguage } from "@/hooks/useLanguage";
import { useHandleFreightChanges } from "@/hooks/useHandleFreightChanges";

export default function FreightAdvanceOptions(){

  const { localeText } =useLanguage();
   const {handleFreightChange}=useHandleFreightChanges();
   const pricingText = localeText.config.pricing;
    const {freightCountryCodes, freightCountryIndex,freightBasisData} = useAppSelector((state) => state.freightBasis);
   const {AdvancedOptions} = freightBasisData?.countries?.[freightCountryCodes[freightCountryIndex]] || {}; 
  
   return(
        <>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                       <Typography variant="subtitle2" gutterBottom>
                         {pricingText.freight.advancedTitle}
                       </Typography>
                       <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                         <TextField
                           size="small"
                           label={pricingText.freight.ldmFromKg}
                           value={AdvancedOptions?.LoadingMetersKg || ""}
                           onChange={(e) => handleFreightChange("AdvancedOptions", {...AdvancedOptions,LoadingMetersKg: e.target.value})}
                         />
                         <TextField
                           size="small"
                           label={pricingText.freight.ldmFromLdm}
                           value={AdvancedOptions?.LoadingMetersLdm || ""}
                           onChange={(e) => handleFreightChange("AdvancedOptions", {...AdvancedOptions,LoadingMetersLdm: e.target.value})}
                         />
                       </Stack>
                     </Paper>
        </>
    )
}