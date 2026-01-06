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
import { createTariffBase, createTariffZone } from '@/utils/helper';

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
                  
                     updateCarrier(activeCarrier.id, (carrier:any) => {
                       const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
                       const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(localeText);
                       const newZone = createTariffZone({}, `Zone ${current.zones.length + 1}`);
                       const zones = [...current.zones, newZone];
                       const rows = current.rows.map((row:any) => ({
                         ...row,
                         values: { ...row.values, [newZone.id]: "" },
                       }));
                       return {
                         ...carrier,
                         tariffs: {
                           countryCodes: codes,
                           byCountry: {
                             ...(carrier.tariffs?.byCountry || {}),
                             [activeTariffCountryCode]: { ...current, zones, rows },
                           },
                         },
                       };
                     });
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
