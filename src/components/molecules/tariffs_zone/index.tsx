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
import { createTariffBase } from '@/utils/helper';
import { useGetTariffsChanges } from '@/hooks/useGetTariffsChanges';

export default function TariffsZone() {
     const { pricingText,localeText } =useLanguage();
     const { ZipCodes }= useGetTariffsChanges();
  const dispatch = useAppDispatch();
    const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
         const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
const {tariffsCountryCodes, tariffsCountryIndex,tariffsData} = useAppSelector((state) => state.tariffs);
 const activeCarrier =
    carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
     const activeTariffCountryCode =
               tariffsCountryCodes[tariffsCountryIndex] ||
               tariffsCountryCodes[0] ||
               NEBENKOSTEN_INITIAL_COUNTRIES[0];
        const activeTariff =
          (activeCarrier && activeCarrier.tariffs?.byCountry?.[activeTariffCountryCode]) || null;
   
         const updateCarrier = (carrierId:any, updater:any) => {
                     dispatch(setCarrierConfigs( carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))
                   ))
                    };
const handleZoneChange = (zoneId:any, field:any, value:any) => {
           if (!activeCarrier || !activeTariffCountryCode) return;
           updateCarrier(activeCarrier.id, (carrier:any) => {
             const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
             const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(localeText);
             const zones = current.zones.map((zone:any) =>
               zone.id === zoneId ? { ...zone, [field]: value } : zone
             );
             const rows = current.rows.map((row:any) => ({
               ...row,
               values: zones.reduce((acc:any, zone:any) => {
                 acc[zone.id] = row.values[zone.id] || "";
                 return acc;
               }, {}),
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


           
               const handleZoneRemove = (zoneId:any) => {
                  if (!activeCarrier || !activeTariffCountryCode) return;
                  updateCarrier(activeCarrier.id, (carrier:any) => {
                    const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
                    const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(localeText);
                    if (current.zones.length <= 1) return carrier;
                    const zones = current.zones.filter((zone:any) => zone.id !== zoneId);
                    const rows = current.rows.map((row:any) => {
                      const nextValues = { ...row.values };
                      delete nextValues[zoneId];
                      return { ...row, values: nextValues };
                    });
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
                            <IconButton size="small" onClick={() => handleZoneRemove(zone.Id)}>
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
