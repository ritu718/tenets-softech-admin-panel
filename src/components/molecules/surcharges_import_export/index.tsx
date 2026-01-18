import React, { useState } from 'react'
import {
 
  Typography,
  Table,
  
  TableHead,
  TableBody,
  TableRow,
  TableCell,
 
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,

  IconButton,
 
  Stack,
  Paper,
  Tabs,
  Tab,

} from "@mui/material";
import { useLanguage } from '@/hooks/useLanguage';
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Papa from "papaparse";
import { createSurchargeBase, createSurchargeRow } from '@/utils/helper';
import { sendShipperExtraCost } from '@/dialogs/invoice_config/services';
import { SHIPPER_EXTRA_COSTS } from '@/data/dummy';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { NEBENKOSTEN_INITIAL_COUNTRIES } from '@/constants/common';
import { setCarrierConfigs } from '@/store/features/invoice_data/invoiceDataSlice';
import { prepareDataSurcharge } from '@/utils/csvImportHelper';
import { exportSurchargeCSV } from '@/utils/csvExportHelper';

export default function SurchargesImportExport() {
 const surchargeFileInputRef = React.useRef<any>(null);

    const { pricingText,localeText } =useLanguage();
    const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
         const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
           const {surchargesCountryCodes, surchargesCountryIndex,surchargesData} = useAppSelector((state) => state.surcharges);
              const dispatch = useAppDispatch();
               const activeCarrier =
        carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
         const activeSurchargeCountryCode =
               surchargesCountryCodes[surchargesCountryIndex] ||
               surchargesCountryCodes[0] ||
               NEBENKOSTEN_INITIAL_COUNTRIES[0];
       
    const handleSurchargeImport = (file:any) => {
             if (!activeCarrier || !activeSurchargeCountryCode || !file) return;
             Papa.parse(file, {
              delimiter:";",
              skipEmptyLines:true,
               complete: (result) => {
const Base =prepareDataSurcharge(result.data);
 const shipperExtraCosts={
  projectId: activeCarrierId,
    extraCosts: {[activeSurchargeCountryCode]: {Base}}}
      
         sendShipperExtraCost(shipperExtraCosts,dispatch);
               },
             });
           };

           const handleSurchargeExport = () => {
            
            // exportSurchargeCSV(surchargesData);
             exportSurchargeCSV(SHIPPER_EXTRA_COSTS);
            
          };
          
          const updateCarrier = (carrierId:any, updater:any) => {
                       dispatch(setCarrierConfigs(   carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))
                 ))
                    };

    
const handleSurchargeAdd = () => {
          if (!activeCarrier || !activeSurchargeCountryCode) return;
          updateCarrier(activeCarrier.id, (carrier:any) => {
            const codes = carrier.surcharges?.countryCodes || [activeSurchargeCountryCode];
            const current =
              carrier.surcharges?.byCountry?.[activeSurchargeCountryCode] || createSurchargeBase(localeText);
            const rows = [...(current.rows || []), createSurchargeRow(localeText, { unit: "€" })];
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


  return (
    <>  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1">{pricingText.surcharges.title}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button size="small" startIcon={<DownloadIcon />} onClick={handleSurchargeExport}>
                      {pricingText.surcharges.exportCsv}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<UploadIcon />}
                      onClick={() => surchargeFileInputRef.current?.click()}
                    >
                      {pricingText.surcharges.importCsv}
                    </Button>
                    <Button size="small" startIcon={<AddCircleIcon />} onClick={handleSurchargeAdd}>
                      {pricingText.surcharges.addRow}
                    </Button>
                  </Stack>
                  </Stack>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  ref={surchargeFileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSurchargeImport(file);
                    e.target.value = "";
                  }}
                /></>
  )
}
