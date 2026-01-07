import React, { useState } from 'react'
import { Stack, Paper} from "@mui/material";

import { useLanguage } from '@/hooks/useLanguage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { NEBENKOSTEN_INITIAL_COUNTRIES } from '@/constants/common';
import { BASE_COUNTRY_OPTIONS } from '@/constants/data';
import { createSurchargeBase, createSurchargeRow } from '@/utils/helper';
import { setCarrierConfigs } from '@/store/features/invoice_data/invoiceDataSlice';
import { SHIPPER_EXTRA_COSTS } from '@/data/dummy';
import { sendShipperExtraCost } from '@/dialogs/invoice_config/services';
import SurchargesImportExport from '@/components/molecules/surcharges_import_export';
import CountrySurcharges from '@/components/molecules/country_surcharges';
import SurchargesTable from '@/components/molecules/surcharges_table';


export default function Surcharges() {

   const { localeText: text } =useLanguage();
    const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
     const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
          const dispatch = useAppDispatch();
   
    const resolvedCountryOptions = BASE_COUNTRY_OPTIONS.map((option:any) => ({
              ...option,
              label: option.code,
            }));
      const activeCarrier =
        carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
      const freightCountryCodes =
        (activeCarrier && activeCarrier.freight?.countryCodes) || NEBENKOSTEN_INITIAL_COUNTRIES;
      const [freightCountryIndex, setFreightCountryIndex] = useState(0);
      const activeCountryCode =
        freightCountryCodes[freightCountryIndex] || freightCountryCodes[0] || NEBENKOSTEN_INITIAL_COUNTRIES[0];
      const activeFreight =
        (activeCarrier && activeCarrier.freight?.byCountry?.[activeCountryCode]) || null;
      const availableCountryOptions =
        resolvedCountryOptions.filter((option:any) => !freightCountryCodes.includes(option.code)) || [];
      const getFlag = (code:any) =>
        resolvedCountryOptions.find((option:any) => option.code === code)?.flag || "🌐";
      
      const tariffCountryCodes =
       (activeCarrier && activeCarrier.tariffs?.countryCodes) || NEBENKOSTEN_INITIAL_COUNTRIES;
     const [tariffCountryIndex, setTariffCountryIndex] = useState(0);
     const activeTariffCountryCode =
       tariffCountryCodes[tariffCountryIndex] ||
       tariffCountryCodes[0] ||
       NEBENKOSTEN_INITIAL_COUNTRIES[0];
     const activeTariff =
       (activeCarrier && activeCarrier.tariffs?.byCountry?.[activeTariffCountryCode]) || null;
     const availableTariffCountryOptions =
       resolvedCountryOptions.filter((option:any) => !tariffCountryCodes.includes(option.code)) || [];
     const surchargeCountryCodes =
       (activeCarrier && activeCarrier.surcharges?.countryCodes) || NEBENKOSTEN_INITIAL_COUNTRIES;
     const [surchargeCountryIndex, setSurchargeCountryIndex] = useState(0);
     const activeSurchargeCountryCode =
       surchargeCountryCodes[surchargeCountryIndex] ||
       surchargeCountryCodes[0] ||
       NEBENKOSTEN_INITIAL_COUNTRIES[0];
     const activeSurcharges =
       (activeCarrier && activeCarrier.surcharges?.byCountry?.[activeSurchargeCountryCode]) || null;
     const availableSurchargeCountryOptions =
       resolvedCountryOptions.filter((option:any) => !surchargeCountryCodes.includes(option.code)) || [];

        const updateCarrier = (carrierId:any, updater:any) => {
             dispatch(setCarrierConfigs(   carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))
       ))
          };
     
        
        
        
          const handleSurchargeCountryAdd = (code:any) => {
          if (!activeCarrier || !code) return;
          updateCarrier(activeCarrier.id, (carrier:any) => {
            const countryCodes = carrier.surcharges?.countryCodes || [];
            if (countryCodes.includes(code)) return carrier;
            const byCountry = {
              ...(carrier.surcharges?.byCountry || {}),
              [code]: createSurchargeBase(text),
            };
            return {
              ...carrier,
              surcharges: {
                countryCodes: [...countryCodes, code],
                byCountry,
              },
            };
          });
          setSurchargeCountryIndex((prev) => prev + 1);
        };
       const handleSurchargeCountryRemove = (index:any) => {
          if (!activeCarrier) return;
          updateCarrier(activeCarrier.id, (carrier:any) => {
            const codes = carrier.surcharges?.countryCodes || [];
            if (codes.length <= 1) return carrier;
            const removeCode = codes[index];
            const nextCodes = codes.filter((_:any, idx:any) => idx !== index);
            const nextByCountry = { ...(carrier.surcharges?.byCountry || {}) };
            delete nextByCountry[removeCode];
            const nextCarrier = {
              ...carrier,
              surcharges: {
                countryCodes: nextCodes,
                byCountry: nextByCountry,
              },
            };
            if (surchargeCountryIndex >= nextCodes.length) {
              setSurchargeCountryIndex(Math.max(nextCodes.length - 1, 0));
            }
            return nextCarrier;
          });
        };
         const handleSurchargeRowChange = (rowId:any, field:any, value:any) => {
            if (!activeCarrier || !activeSurchargeCountryCode) return;
            updateCarrier(activeCarrier.id, (carrier:any) => {
              const codes = carrier.surcharges?.countryCodes || [activeSurchargeCountryCode];
              const current =
                carrier.surcharges?.byCountry?.[activeSurchargeCountryCode] || createSurchargeBase(text);
              const rows = current.rows.map((row:any) =>
                row.id === rowId ? { ...row, [field]: value } : row
              );
              return {
                ...carrier,
                surcharges: {
                  countryCodes: codes,
                  byCountry: {
                    ...(carrier.surcharges?.byCountry || {}),
                    [activeSurchargeCountryCode]: { ...current, rows },
                  },
                },
              };
            });
          };
       
      const handleSurchargeRemove = (rowId:any) => {
          if (!activeCarrier || !activeSurchargeCountryCode) return;
          updateCarrier(activeCarrier.id, (carrier:any) => {
            const codes = carrier.surcharges?.countryCodes || [activeSurchargeCountryCode];
            const current =
              carrier.surcharges?.byCountry?.[activeSurchargeCountryCode] || createSurchargeBase(text);
            const rows = current.rows.filter((row:any) => row.id !== rowId);
            return {
              ...carrier,
              surcharges: {
                countryCodes: codes,
                byCountry: {
                  ...(carrier.surcharges?.byCountry || {}),
                  [activeSurchargeCountryCode]: { ...current, rows: rows.length ? rows : [createSurchargeRow(text)] },
                },
              },
            };
          });
        };
          
  return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <SurchargesImportExport/>
                <Stack spacing={1.5}>
                <CountrySurcharges/>
    
                <SurchargesTable/>
                </Stack>
              </Paper>
  )
}
