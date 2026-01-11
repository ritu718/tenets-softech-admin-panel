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

export default function SurchargesImportExport() {

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
         const activeSurcharges =
       (activeCarrier && activeCarrier.surcharges?.byCountry?.[activeSurchargeCountryCode]) || null;
        const surchargeFileInputRef = React.useRef<any>(null);

    const handleSurchargeImport = (file:any) => {
            //  if (!activeCarrier || !activeSurchargeCountryCode || !file) return;
             Papa.parse(file, {
               complete: (result) => {
                 const rows:any = result.data;
                 if (!rows || !rows.length) return;

                 const [header, ...dataRows] = rows;
                 if (!header) return;
const extraCosts =prepareDataSurcharge(rows);

                 const columns = header.map((h:any) => (h || "").toString().trim().toLowerCase());
                 const labelIdx = columns.findIndex((c:any) => c.includes("label") || c.includes("bezeichnung"));
                 const amountIdx = columns.findIndex((c:any) => c.includes("amount") || c.includes("wert") || c === "");
                 const unitIdx = columns.findIndex((c:any) => c.includes("unit") || c.includes("einheit"));
                 const descIdx = columns.findIndex((c:any) => c.includes("desc"));
                 const rowsParsed = dataRows
                   .filter((cells:any) => cells.some((c:any) => c !== null && c !== undefined && `${c}`.trim() !== ""))
                   .map((cells:any) =>
                     createSurchargeRow(localeText, {
                       label: labelIdx >= 0 ? cells[labelIdx] : cells[0],
                       amount: amountIdx >= 0 ? cells[amountIdx] : cells[1],
                       unit: unitIdx >= 0 ? cells[unitIdx] : "€",
                       description: descIdx >= 0 ? cells[descIdx] : "",
                     })
                   );
                   const parsed:any = SHIPPER_EXTRA_COSTS;
                                   parsed.projectId = activeCarrierId;
                                   
                                          //  sendShipperExtraCost(parsed,dispatch);
    
                //  updateCarrier(activeCarrier.id, (carrier:any) => {
                //    const codes = carrier.surcharges?.countryCodes || [activeSurchargeCountryCode];
                //    const current =
                //      carrier.surcharges?.byCountry?.[activeSurchargeCountryCode] || createSurchargeBase(text);
                //    return {
                //      ...carrier,
                //      surcharges: {
                //        countryCodes: codes,
                //        byCountry: {
                //          ...(carrier.surcharges?.byCountry || {}),
                //          [activeSurchargeCountryCode]: { ...current, rows: rowsParsed },
                //        },
                //      },
                //    };
                //  });
               },
             });
           };
           const handleSurchargeExport = () => {
            
            const header = [
              pricingText.surcharges.columns.label,
              pricingText.surcharges.columns.amount,
              pricingText.surcharges.columns.unit,
              pricingText.surcharges.columns.description,
            ];
            const rows = (activeSurcharges.rows || []).map((row:any) => [
              row.label,
              row.amount,
              row.unit,
              row.description,
            ]);
            const csv = Papa.unparse([header, ...rows]);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", `surcharges-${activeSurchargeCountryCode}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
