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
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Papa from "papaparse";

import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { useLanguage } from '@/hooks/useLanguage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { NEBENKOSTEN_INITIAL_COUNTRIES } from '@/constants/common';
import { BASE_COUNTRY_OPTIONS } from '@/constants/data';
import { createSurchargeBase, createSurchargeRow } from '@/utils/helper';
import { setCarrierConfigs } from '@/store/features/invoice_data/invoiceDataSlice';
import { SHIPPER_EXTRA_COSTS } from '@/data/dummy';
import { sendShipperExtraCost } from '@/dialogs/invoice_config/services';


export default function CarrierPricingSurcharges({countryOptions,}:any) {

   const { localeText: text } =useLanguage();
    const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
     const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
          const dispatch = useAppDispatch();
    const pricingText = text.config.pricing;
    const surchargeFileInputRef = React.useRef<any>(null);

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
       const handleSurchargeAdd = () => {
          if (!activeCarrier || !activeSurchargeCountryCode) return;
          updateCarrier(activeCarrier.id, (carrier:any) => {
            const codes = carrier.surcharges?.countryCodes || [activeSurchargeCountryCode];
            const current =
              carrier.surcharges?.byCountry?.[activeSurchargeCountryCode] || createSurchargeBase(text);
            const rows = [...(current.rows || []), createSurchargeRow(text, { unit: "€" })];
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
          const handleSurchargeImport = (file:any) => {
        //  if (!activeCarrier || !activeSurchargeCountryCode || !file) return;
         Papa.parse(file, {
           complete: (result) => {
             const rows:any = result.data;
             if (!rows || !rows.length) return;
             const [header, ...dataRows] = rows;
             if (!header) return;
             const columns = header.map((h:any) => (h || "").toString().trim().toLowerCase());
             const labelIdx = columns.findIndex((c:any) => c.includes("label") || c.includes("bezeichnung"));
             const amountIdx = columns.findIndex((c:any) => c.includes("amount") || c.includes("wert") || c === "");
             const unitIdx = columns.findIndex((c:any) => c.includes("unit") || c.includes("einheit"));
             const descIdx = columns.findIndex((c:any) => c.includes("desc"));
             const rowsParsed = dataRows
               .filter((cells:any) => cells.some((c:any) => c !== null && c !== undefined && `${c}`.trim() !== ""))
               .map((cells:any) =>
                 createSurchargeRow(text, {
                   label: labelIdx >= 0 ? cells[labelIdx] : cells[0],
                   amount: amountIdx >= 0 ? cells[amountIdx] : cells[1],
                   unit: unitIdx >= 0 ? cells[unitIdx] : "€",
                   description: descIdx >= 0 ? cells[descIdx] : "",
                 })
               );
               const parsed:any = SHIPPER_EXTRA_COSTS;
                               parsed.projectId = activeCarrierId;
                               
                                       sendShipperExtraCost(parsed,dispatch);

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
        if (!activeCarrier || !activeSurchargeCountryCode || !activeSurcharges) return;
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

  return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
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
                />
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">{pricingText.surcharges.countryTitle}</Typography>
                  <Tabs
                    value={Math.min(surchargeCountryIndex, surchargeCountryCodes.length - 1)}
                    onChange={(_, value) => setSurchargeCountryIndex(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                  >
                    {surchargeCountryCodes.map((code:any, index:any) => (
                      <Tab
                        key={`${code}-${index}`}
                        value={index}
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">
                              {getFlag(code)} {code}
                            </Typography>
                            {surchargeCountryCodes.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleSurchargeCountryRemove(index);
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
                      <InputLabel>{pricingText.surcharges.countryAddLabel}</InputLabel>
                      <Select
                        value=""
                        label={pricingText.surcharges.countryAddLabel}
                        onChange={(e) => handleSurchargeCountryAdd(e.target.value)}
                      >
                        <MenuItem value="">{pricingText.surcharges.countryPlaceholder}</MenuItem>
                        {availableSurchargeCountryOptions.map((option:any) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.flag} {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
    
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{pricingText.surcharges.columns.label}</TableCell>
                        <TableCell>{pricingText.surcharges.columns.amount}</TableCell>
                        <TableCell>{pricingText.surcharges.columns.unit}</TableCell>
                        <TableCell>{pricingText.surcharges.columns.type}</TableCell>
                        <TableCell>{pricingText.surcharges.columns.description}</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(activeSurcharges?.rows || []).map((row:any) => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <TextField
                              size="small"
                              value={row.label}
                              onChange={(e) => handleSurchargeRowChange(row.id, "label", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={row.amount}
                              onChange={(e) => handleSurchargeRowChange(row.id, "amount", e.target.value)}
                              placeholder={pricingText.surcharges.valuePlaceholder}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              size="small"
                              value={row.unit || "€"}
                              onChange={(e) => handleSurchargeRowChange(row.id, "unit", e.target.value)}
                            >
                              <MenuItem value="€">€</MenuItem>
                              <MenuItem value="%">%</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              size="small"
                              value={row.type || "flat"}
                              onChange={(e) => handleSurchargeRowChange(row.id, "type", e.target.value)}
                            >
                              <MenuItem value="flat">{pricingText.surcharges.types.flat}</MenuItem>
                              <MenuItem value="percent">{pricingText.surcharges.types.percent}</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={row.description || ""}
                              onChange={(e) =>
                                handleSurchargeRowChange(row.id, "description", e.target.value)
                              }
                              fullWidth
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => handleSurchargeRemove(row.id)}>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Stack>
              </Paper>
  )
}
