import React from 'react'
import {
  Typography,
  Button,
  Stack
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useLanguage } from '@/hooks/useLanguage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCarrierConfigs } from '@/store/features/invoice_data/invoiceDataSlice';
import { NEBENKOSTEN_INITIAL_COUNTRIES } from '@/constants/common';
import { addZipCode, createTariffBase, createTariffZone, updateTariffsnData } from '@/utils/helper';

export default function TariffsAddZone() {
     const { localeText } =useLanguage();

             const dispatch = useAppDispatch();
          const pricingText = localeText.config.pricing;
           const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
             const {tariffsCountryCodes, tariffsCountryIndex,tariffsData} = useAppSelector((state) => state.tariffs);
const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
  const activeTariffCountryCode =
           tariffsCountryCodes[tariffsCountryIndex] ||
           tariffsCountryCodes[0] ||
           NEBENKOSTEN_INITIAL_COUNTRIES[0];

       const activeCarrier =
          carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;

             const updateCarrier = (carrierId:any, updater:any) => {
                        dispatch(setCarrierConfigs( carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))
                      ))
                       };

          const handleZoneAdd = () => {
                  
                    const updateDataSelCountry = addZipCode(tariffsData.rates[activeTariffCountryCode], {
  Codes: "",
  Zone: "DE-Zone 10"
});
const dataTmp = {
  ...tariffsData,
  rates: {
    ...tariffsData.rates,
    [activeTariffCountryCode]: updateDataSelCountry
  }
};

 updateTariffsnData(dataTmp,dispatch)
console.log("updatedData value is: ",updateDataSelCountry);

                   };

  return (
    
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      {pricingText.tariffs.addZone}
                    </Typography>
                    <Button size="small" startIcon={<AddCircleIcon />} onClick={handleZoneAdd}>
                      {pricingText.tariffs.addZone}
                    </Button>
                  </Stack>
  )
}
