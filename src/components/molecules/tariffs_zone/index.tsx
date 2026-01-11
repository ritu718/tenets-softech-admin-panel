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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { NEBENKOSTEN_INITIAL_COUNTRIES } from '@/constants/common';
import { useLanguage } from '@/hooks/useLanguage';
import { setCarrierConfigs } from '@/store/features/invoice_data/invoiceDataSlice';
import { createTariffBase, removeZipCode, updateTariffsnData } from '@/utils/helper';
import { useGetTariffsChanges } from '@/hooks/useGetTariffsChanges';

export default function TariffsZone() {
     const { pricingText,localeText } =useLanguage();
     const { ZipCodes,countryCode }= useGetTariffsChanges();
  const dispatch = useAppDispatch();
    const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
         const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
const {tariffsCountryCodes, tariffsCountryIndex,tariffsData} = useAppSelector((state) => state.tariffs);
 const activeCarrier =
    carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
   
        
       
const handleZoneChange = (zoneId:any, field:any, value:any) => {
           if (!activeCarrier || !countryCode) return;

const tariffsDataTmp: any = {
  ...tariffsData,
  rates: {
    ...tariffsData.rates,
    [countryCode]: {
      ...tariffsData.rates[countryCode],
      ZipCodes: tariffsData.rates[countryCode].ZipCodes.map(
        (zoneItem: any) =>
          zoneItem.Id === zoneId
            ? { ...zoneItem, [field]: value }
            : zoneItem
      ),
    },
  },
};    

 updateTariffsnData(tariffsDataTmp,dispatch)
           
         };


           
               const handleZoneRemove = (zoneData:any) => {
                  if (!activeCarrier || !countryCode) return;
                  console.log("zoneData: ",zoneData);
                  
                 const updateDataSelCountry = removeZipCode(tariffsData.rates[countryCode],zoneData.Id);
const dataTmp = {
  ...tariffsData,
  rates: {
    ...tariffsData.rates,
    [countryCode]: updateDataSelCountry
  }
};

 updateTariffsnData(dataTmp,dispatch)
                };


  return (
   <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(ZipCodes || []).map((zone:any) => (
                      <Paper
                        key={zone.Id}
                        variant="outlined"
                        sx={{ p: 1.5, borderRadius: 2, minWidth: 180, maxWidth: 240, position: "relative" }}
                      >
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <TextField
                              size="small"
                              label={pricingText.tariffs.zoneName}
                              value={zone.Zone}
                              onChange={(e) => handleZoneChange(zone.Id, "Zone", e.target.value)}
                            />
                            <IconButton size="small" onClick={() => handleZoneRemove(zone)}>
                              <DeleteOutlineIcon fontSize="inherit" />
                            </IconButton>
                          </Stack>
                          <TextField
                            size="small"
                            label={pricingText.tariffs.zoneZips}
                            value={zone.Codes}
                            onChange={(e) => handleZoneChange(zone.Id, "Codes", e.target.value)}
                          />
                          <Stack direction="row" spacing={1}>
                            <TextField
                              size="small"
                              label={pricingText.tariffs.zoneMin}
                              value={zone?.min}
                              onChange={(e) => handleZoneChange(zone.Id, "min", e.target.value)}
                            />
                            <TextField
                              size="small"
                              label={pricingText.tariffs.zoneMax}
                              value={zone?.max}
                              onChange={(e) => handleZoneChange(zone.Id, "max", e.target.value)}
                            />
                          </Stack>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
  )
}
