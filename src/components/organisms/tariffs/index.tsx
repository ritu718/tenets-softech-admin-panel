import React, { useState } from 'react'
import {
  Stack,
  Paper,
} from "@mui/material";

import { useLanguage } from '@/hooks/useLanguage';
import { NEBENKOSTEN_INITIAL_COUNTRIES } from '@/constants/common';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { setCarrierConfigs } from '@/store/features/invoice_data/invoiceDataSlice';
import { createTariffBase } from '@/utils/helper';

import CountryOverviewTariffs from '@/components/molecules/country_overview_tariffs';
import TariffsImportExport from '@/components/molecules/tariffs_import_export';
import TariffsAddZone from '@/components/molecules/tariffs_add_zone';
import TariffsZone from '@/components/molecules/tariffs_zone';
import TariffsTypeSelector from '@/components/molecules/tariffs_type_selector';
import TariffsWeight from '@/components/molecules/tariffs_weight';

export default function Tariffs() {
    const { localeText: text } =useLanguage();
      const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
          const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
             const dispatch = useAppDispatch();
        
       const activeCarrier =
          carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
      
        const tariffCountryCodes =
          (activeCarrier && activeCarrier.tariffs?.countryCodes) || NEBENKOSTEN_INITIAL_COUNTRIES;
        const [tariffCountryIndex, setTariffCountryIndex] = useState(0);
        const activeTariffCountryCode =
          tariffCountryCodes[tariffCountryIndex] ||
          tariffCountryCodes[0] ||
          NEBENKOSTEN_INITIAL_COUNTRIES[0];
        
    const updateCarrier = (carrierId:any, updater:any) => {
              dispatch(setCarrierConfigs( carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))
            ))
             };

        const handleTariffRowChange = (rowId:any, field:any, value:any, zoneId:any = null) => {
           if (!activeCarrier || !activeTariffCountryCode) return;
           updateCarrier(activeCarrier.id, (carrier:any) => {
             const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
             const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
             const rows = current.rows.map((row:any) => {
               if (row.id !== rowId) return row;
               if (zoneId) {
                 return { ...row, values: { ...row.values, [zoneId]: value } };
               }
               return { ...row, [field]: value };
             });
             return {
               ...carrier,
               tariffs: {
                 countryCodes: codes,
                 byCountry: {
                   ...(carrier.tariffs?.byCountry || {}),
                   [activeTariffCountryCode]: { ...current, rows },
                 },
               },
             };
           });
         };

  

       

  return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
               
    <TariffsImportExport/>
                <Stack spacing={1.5}>
                  <CountryOverviewTariffs/>
                 <TariffsTypeSelector/>
    <TariffsAddZone/>
    <TariffsZone/>
    
                  <TariffsWeight/>
                </Stack>
              </Paper>
  )
}
