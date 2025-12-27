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
 

  IconButton,

  Stack,
  Paper,
 
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { BASE_COUNTRY_OPTIONS } from '@/constants/data';
import { NEBENKOSTEN_INITIAL_COUNTRIES } from '@/constants/common';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { buildDefaultMinWeights, createFreightBase, createMinWeightRow } from '@/utils/helper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCarrierConfigs } from '@/store/features/invoice_data/invoiceDataSlice';


export default function CarrierPricingAdditionMinimumWeight({
  text,
 
  countryOptions,
}:any) {
    const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
   const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
               const dispatch = useAppDispatch();

      const pricingText = text.config.pricing;
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
    
  
        const updateCarrier = (carrierId:any, updater:any) => {
         dispatch(setCarrierConfigs( carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))
))
      
    };
  
      
        const handleMinWeightChange = (rowId:any, field:any, value:any, table = "minWeights") => {
          if (!activeCarrier || !activeCountryCode) return;
          updateCarrier(activeCarrier.id, (carrier:any) => ({
            ...carrier,
            freight: {
              ...(carrier.freight || {}),
              countryCodes: carrier.freight?.countryCodes || [activeCountryCode],
              byCountry: {
                ...(carrier.freight?.byCountry || {}),
                [activeCountryCode]: {
                  ...(carrier.freight?.byCountry?.[activeCountryCode] ||
                    createFreightBase(text)),
                  [table]: (
                    Array.isArray(carrier.freight?.byCountry?.[activeCountryCode]?.[table])
                      ? carrier.freight.byCountry[activeCountryCode][table]
                      : table === "minWeights"
                      ? buildDefaultMinWeights()
                      : []
                  ).map((row:any) => (row.id === rowId ? { ...row, [field]: value } : row)),
                },
              },
            },
          }));
        };

         const handleAddCustomMinWeight = () => {
            if (!activeCarrier || !activeCountryCode) return;
            updateCarrier(activeCarrier.id, (carrier:any) => ({
              ...carrier,
              freight: {
                ...(carrier.freight || {}),
                countryCodes: carrier.freight?.countryCodes || [activeCountryCode],
                byCountry: {
                  ...(carrier.freight?.byCountry || {}),
                  [activeCountryCode]: {
                    ...(carrier.freight?.byCountry?.[activeCountryCode] ||
                      createFreightBase(text)),
                    customMinWeights: [
                      ...((carrier.freight &&
                      Array.isArray(carrier.freight?.byCountry?.[activeCountryCode]?.customMinWeights)
                        ? carrier.freight.byCountry[activeCountryCode].customMinWeights
                        : [])),
                      createMinWeightRow(),
                    ],
                  },
                },
              },
            }));
          };

           const handleRemoveCustomMinWeight = (rowId:any) => {
              if (!activeCarrier || !activeCountryCode) return;
              updateCarrier(activeCarrier.id, (carrier:any) => ({
                ...carrier,
                freight: {
                  ...(carrier.freight || {}),
                  countryCodes: carrier.freight?.countryCodes || [activeCountryCode],
                  byCountry: {
                    ...(carrier.freight?.byCountry || {}),
                    [activeCountryCode]: {
                      ...(carrier.freight?.byCountry?.[activeCountryCode] ||
                        createFreightBase(text)),
                      customMinWeights: (carrier.freight?.byCountry?.[activeCountryCode]?.customMinWeights || []).filter(
                        (row:any) => row.id !== rowId
                      ),
                    },
                  },
                },
              }));
            };
    
  
  
  
    return (   <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="subtitle2">
                        {pricingText.freight.customMinWeightTitle}
                      </Typography>
                      <Button size="small" startIcon={<AddCircleIcon />} onClick={handleAddCustomMinWeight}>
                        {pricingText.freight.addCustomRow}
                      </Button>
                    </Stack>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{pricingText.freight.minWeightHeaders.code}</TableCell>
                          <TableCell>{pricingText.freight.minWeightHeaders.description}</TableCell>
                          <TableCell>{pricingText.freight.minWeightHeaders.weight}</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(activeFreight?.customMinWeights || []).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Typography variant="body2" color="text.secondary">
                                {pricingText.freight.customEmpty}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                        {(activeFreight?.customMinWeights || []).map((row:any) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.code}
                                onChange={(e) => handleMinWeightChange(row.id, "code", e.target.value, "customMinWeights")}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.description}
                                onChange={(e) =>
                                  handleMinWeightChange(row.id, "description", e.target.value, "customMinWeights")
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.weight}
                                onChange={(e) => handleMinWeightChange(row.id, "weight", e.target.value, "customMinWeights")}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" onClick={() => handleRemoveCustomMinWeight(row.id)}>
                                <DeleteOutlineIcon/>
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
    
  )
}

