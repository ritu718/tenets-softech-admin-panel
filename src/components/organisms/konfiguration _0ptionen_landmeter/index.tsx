import React, { useState } from "react";
import {
  Typography,
  TextField,
  Stack,
  Paper,
} from "@mui/material";
import { createFreightBase   } from "@/utils/helper";
import { BASE_COUNTRY_OPTIONS } from "@/constants/data";
import { NEBENKOSTEN_INITIAL_COUNTRIES } from "@/constants/common";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCarrierConfigs } from "@/store/features/invoice_data/invoiceDataSlice";

export default function KonfigurationLandMeter2({ text,
  
  countryOptions,}:any){
    const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
        const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
           const dispatch = useAppDispatch();
   const [freightCountryIndex, setFreightCountryIndex] = useState(0);
   
       const pricingText = text.config.pricing;
   
        const resolvedCountryOptions =
           countryOptions && countryOptions.length
             ? countryOptions
             : BASE_COUNTRY_OPTIONS.map((option:any) => ({
                 ...option,
                 label: option.code,
               }));
               const updateCarrier = (carrierId:any, updater:any) => {
                dispatch(setCarrierConfigs(  carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier)) ))
                              
       
     };
   
       const activeCarrier =
           carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
         const freightCountryCodes =
           (activeCarrier && activeCarrier.freight?.countryCodes) || NEBENKOSTEN_INITIAL_COUNTRIES;
   
        
         const activeCountryCode =
           freightCountryCodes[freightCountryIndex] || freightCountryCodes[0] || NEBENKOSTEN_INITIAL_COUNTRIES[0];
   
         const activeFreight =
           (activeCarrier && activeCarrier.freight?.byCountry?.[activeCountryCode]) || null;
   

      const handleFreightChange = (field:any, value:any) => {
          if (!activeCarrier || !activeCountryCode) return;
          updateCarrier(activeCarrier.id, (carrier:any) => ({
            ...carrier,
            freight: {
              ...(carrier.freight || {}),
              countryCodes: carrier.freight?.countryCodes || [activeCountryCode],
              byCountry: {
                ...(carrier.freight?.byCountry || {}),
                [activeCountryCode]: {
                  ...(carrier.freight?.byCountry?.[activeCountryCode] ||
                    createFreightBase(text)),
                  [field]: value,
                },
              },
            },
          }));
        };
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
                           value={activeFreight?.ldmFromKg || ""}
                           onChange={(e) => handleFreightChange("ldmFromKg", e.target.value)}
                         />
                         <TextField
                           size="small"
                           label={pricingText.freight.ldmFromLdm}
                           value={activeFreight?.ldmFromLdm || ""}
                           onChange={(e) => handleFreightChange("ldmFromLdm", e.target.value)}
                         />
                       </Stack>
                     </Paper>
        </>
    )
}