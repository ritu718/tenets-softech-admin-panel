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
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useLanguage } from '@/hooks/useLanguage';
import { NEBENKOSTEN_INITIAL_COUNTRIES } from '@/constants/common';
import Papa from "papaparse";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BASE_COUNTRY_OPTIONS } from '@/constants/data';
import { setCarrierConfigs } from '@/store/features/invoice_data/invoiceDataSlice';
import { createTariffBase, createTariffRow, createTariffZone } from '@/utils/helper';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";




export default function CarrierPricingTariffs({countryOptions}:any) {
    const { localeText: text } =useLanguage();
      const pricingText = text.config.pricing;
      const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
          const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
             const dispatch = useAppDispatch();
       const tariffFileInputRef = React.useRef<any>(null);
     



         const resolvedCountryOptions =
            countryOptions && countryOptions.length
              ? countryOptions
              : BASE_COUNTRY_OPTIONS.map((option:any) => ({
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
              dispatch(setCarrierConfigs( carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))
            ))
             };

      const handleTariffCountryAdd = (code:any) => {
         if (!activeCarrier || !code) return;
         updateCarrier(activeCarrier.id, (carrier:any) => {
           const countryCodes = carrier.tariffs?.countryCodes || [];
           if (countryCodes.includes(code)) return carrier;
           const byCountry = {
             ...(carrier.tariffs?.byCountry || {}),
             [code]: createTariffBase(text),
           };
           return {
             ...carrier,
             tariffs: {
               countryCodes: [...countryCodes, code],
               byCountry,
             },
           };
         });
         setTariffCountryIndex((prev) => prev + 1);
       };        

     const handleTariffCountryRemove = (index:any) => {
    if (!activeCarrier) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.tariffs?.countryCodes || [];
      if (codes.length <= 1) return carrier;
      const removeCode = codes[index];
      const nextCodes = codes.filter((_:any, idx:any) => idx !== index);
      const nextByCountry = { ...(carrier.tariffs?.byCountry || {}) };
      delete nextByCountry[removeCode];
      const nextCarrier = {
        ...carrier,
        tariffs: {
          countryCodes: nextCodes,
          byCountry: nextByCountry,
        },
      };
      if (tariffCountryIndex >= nextCodes.length) {
        setTariffCountryIndex(Math.max(nextCodes.length - 1, 0));
      }
      return nextCarrier;
    });
               };
     const handleTariffBaseChange = (field:any, value:any) => {
         if (!activeCarrier || !activeTariffCountryCode) return;
         updateCarrier(activeCarrier.id, (carrier:any) => {
           const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
           const baseTariff =
             carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
           return {
             ...carrier,
             tariffs: {
               countryCodes: codes,
               byCountry: {
                 ...(carrier.tariffs?.byCountry || {}),
                 [activeTariffCountryCode]: { ...baseTariff, [field]: value },
               },
             },
           };
         });
       }; 
     const handleZoneChange = (zoneId:any, field:any, value:any) => {
           if (!activeCarrier || !activeTariffCountryCode) return;
           updateCarrier(activeCarrier.id, (carrier:any) => {
             const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
             const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
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
       
     const handleZoneAdd = () => {
           if (!activeCarrier || !activeTariffCountryCode) return;
           updateCarrier(activeCarrier.id, (carrier:any) => {
             const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
             const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
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
     
      const handleZoneRemove = (zoneId:any) => {
         if (!activeCarrier || !activeTariffCountryCode) return;
         updateCarrier(activeCarrier.id, (carrier:any) => {
           const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
           const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
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

      const handleTariffRowAdd = () => {
    if (!activeCarrier || !activeTariffCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
      const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
      const zones = current.zones;
      const nextWeight = (() => {
        const weights = current.rows
          .map((r:any) => Number(r.weight))
          .filter((n:any) => !Number.isNaN(n))
          .sort((a:any, b:any) => a - b);
        if (!weights.length) return "";
        const last = weights[weights.length - 1];
        return String(last + 100);
      })();
      const newRow = createTariffRow(zones, { weight: nextWeight });
      return {
        ...carrier,
        tariffs: {
          countryCodes: codes,
          byCountry: {
            ...(carrier.tariffs?.byCountry || {}),
            [activeTariffCountryCode]: {
              ...current,
              rows: [...current.rows, newRow],
            },
          },
        },
      };
    });
              };

     const handleTariffImport = (file:any) => {
            if (!activeCarrier || !activeTariffCountryCode || !file) return;
            Papa.parse(file, {
              complete: (result) => {
                const rows:any = result.data;
                if (!rows || !rows.length) return;
                const [header, ...dataRows] = rows;
                if (!header || header.length < 2) return;
                const zoneHeaders = header.slice(1).map((h:any) => (h || "").toString().trim());
                updateCarrier(activeCarrier.id, (carrier:any) => {
                  const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
                  const current =
                    carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
                  const existingZones = current.zones;
                  const zones = [...existingZones];
                  zoneHeaders.forEach((name:any) => {
                    if (!name) return;
                    if (!zones.some((z) => z.name === name)) {
                      zones.push(createTariffZone({ name }, name));
                    }
                  });
                  const rowsParsed = dataRows
                    .filter((cells:any) => cells.some((c:any) => c !== null && c !== undefined && `${c}`.trim() !== ""))
                    .map((cells:any) => {
                      const weight = cells[0] ? String(cells[0]).trim() : "";
                      const values:any = {};
                      zones.forEach((zone, idx) => {
                        const cellValue = cells[idx + 1] ?? "";
                        values[zone.id] = cellValue;
                      });
                      return createTariffRow(zones, { weight, values });
                    });
                  return {
                    ...carrier,
                    tariffs: {
                      countryCodes: codes,
                      byCountry: {
                        ...(carrier.tariffs?.byCountry || {}),
                        [activeTariffCountryCode]: { ...current, zones, rows: rowsParsed },
                      },
                    },
                  };
                });
              },
            });
          };

        const handleTariffExport = () => {
          if (!activeCarrier || !activeTariffCountryCode || !activeTariff) return;
          const zones = activeTariff.zones || [];
          const header = [pricingText.tariffs.weightHeader, ...zones.map((z:any) => z.name || "")];
          const rows = (activeTariff.rows || []).map((row:any) => [
            row.weight,
            ...zones.map((z:any) => row.values[z.id] || ""),
          ]);
          const csv = Papa.unparse([header, ...rows]);
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", `tariffs-${activeTariffCountryCode}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
      

       

  return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 1 }} spacing={1}>
                  <Typography variant="subtitle1">{pricingText.tariffs.title}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button size="small" startIcon={<DownloadIcon />} onClick={handleTariffExport}>
                      {pricingText.tariffs.exportCsv}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<UploadIcon />}
                      onClick={() => tariffFileInputRef.current?.click()}
                    >
                      {pricingText.tariffs.importCsv}
                    </Button>
                    <Button size="small" startIcon={<AddCircleIcon />} onClick={handleTariffRowAdd}>
                      {pricingText.tariffs.addRow}
                    </Button>
                  </Stack>
                </Stack>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  ref={tariffFileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleTariffImport(file);
                    e.target.value = "";
                  }}
                />
    
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">{pricingText.tariffs.countryTitle}</Typography>
                  <Tabs
                    value={Math.min(tariffCountryIndex, tariffCountryCodes.length - 1)}
                    onChange={(_, value) => setTariffCountryIndex(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                  >
                    {tariffCountryCodes.map((code:any, index:any) => (
                      <Tab
                        key={`${code}-${index}`}
                        value={index}
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">
                              {getFlag(code)} {code}
                            </Typography>
                            {tariffCountryCodes.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleTariffCountryRemove(index);
                                }}
                              >
                                <DeleteOutlineIcon fontSize="inherit" />
                              </IconButton>
                            )}
                          </Stack>
                        }
                      />
                    ))}
                  </Tabs>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 220 }}>
                      <InputLabel>{pricingText.tariffs.countryAddLabel}</InputLabel>
                      <Select
                        value=""
                        label={pricingText.tariffs.countryAddLabel}
                        onChange={(e) => handleTariffCountryAdd(e.target.value)}
                      >
                        <MenuItem value="">{pricingText.tariffs.countryPlaceholder}</MenuItem>
                        {availableTariffCountryOptions.map((option:any) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.flag} {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
    
                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel>{pricingText.tariffs.tariffTypeLabel}</InputLabel>
                    <Select
                      label={pricingText.tariffs.tariffTypeLabel}
                      value={activeTariff?.tariffType || ""}
                      onChange={(e) => handleTariffBaseChange("tariffType", e.target.value)}
                    >
                      {(pricingText.tariffs.tariffTypes || []).map((option:any) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
    
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      {pricingText.tariffs.addZone}
                    </Typography>
                    <Button size="small" startIcon={<AddCircleIcon />} onClick={handleZoneAdd}>
                      {pricingText.tariffs.addZone}
                    </Button>
                  </Stack>
    
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(activeTariff?.zones || []).map((zone:any) => (
                      <Paper
                        key={zone.id}
                        variant="outlined"
                        sx={{ p: 1.5, borderRadius: 2, minWidth: 180, maxWidth: 240, position: "relative" }}
                      >
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <TextField
                              size="small"
                              label={pricingText.tariffs.zoneName}
                              value={zone.name}
                              onChange={(e) => handleZoneChange(zone.id, "name", e.target.value)}
                            />
                            <IconButton size="small" onClick={() => handleZoneRemove(zone.id)}>
                              <DeleteOutlineIcon fontSize="inherit" />
                            </IconButton>
                          </Stack>
                          <TextField
                            size="small"
                            label={pricingText.tariffs.zoneZips}
                            value={zone.zips}
                            onChange={(e) => handleZoneChange(zone.id, "zips", e.target.value)}
                          />
                          <Stack direction="row" spacing={1}>
                            <TextField
                              size="small"
                              label={pricingText.tariffs.zoneMin}
                              value={zone.min}
                              onChange={(e) => handleZoneChange(zone.id, "min", e.target.value)}
                            />
                            <TextField
                              size="small"
                              label={pricingText.tariffs.zoneMax}
                              value={zone.max}
                              onChange={(e) => handleZoneChange(zone.id, "max", e.target.value)}
                            />
                          </Stack>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
    
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{pricingText.tariffs.weightHeader}</TableCell>
                        {(activeTariff?.zones || []).map((zone:any) => (
                          <TableCell key={zone.id}>{zone.name || pricingText.tariffs.zoneName}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(activeTariff?.rows || []).map((row:any) => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <TextField
                              size="small"
                              value={row.weight}
                              onChange={(e) => handleTariffRowChange(row.id, "weight", e.target.value)}
                            />
                          </TableCell>
                          {(activeTariff?.zones || []).map((zone:any) => (
                            <TableCell key={zone.id}>
                              <TextField
                                size="small"
                                value={row.values?.[zone.id] || ""}
                                onChange={(e) =>
                                  handleTariffRowChange(row.id, "values", e.target.value, zone.id)
                                }
                                placeholder={pricingText.tariffs.valuePlaceholder}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Stack>
              </Paper>
  )
}
