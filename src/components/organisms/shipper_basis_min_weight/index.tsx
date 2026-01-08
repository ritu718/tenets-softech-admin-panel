import React, { useState } from 'react'
import {
  
  Typography,
  Table,
  
  TableHead,
  TableBody,
  TableRow,
  TableCell,
 
  TextField,
  Paper,

} from "@mui/material";
import { NEBENKOSTEN_INITIAL_COUNTRIES } from '@/constants/common';
import { buildDefaultMinWeights, createFreightBase } from '@/utils/helper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCarrierConfigs } from '@/store/features/invoice_data/invoiceDataSlice';
import { useLanguage } from '@/hooks/useLanguage';
import { useHandleFreightChanges } from '@/hooks/useHandleFreightChanges';
import { setFreightBasisData } from '@/store/features/freight_basis/FreightBasisSlice';

export default function ShipperBasisMinWeight(){
  const { localeText } =useLanguage();
   const {handleFreightChange}=useHandleFreightChanges();
   const pricingText = localeText.config.pricing;
    const {freightCountryCodes, freightCountryIndex,freightBasisData} = useAppSelector((state) => state.freightBasis);
   const {MinimumWeight} = freightBasisData?.countries?.[freightCountryCodes[freightCountryIndex]] || {}; 
  

    const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
   const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
             const dispatch = useAppDispatch();
    
   
    const activeCarrier =
      carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
    const activeCountryCode =
      freightCountryCodes[freightCountryIndex] || freightCountryCodes[0] || NEBENKOSTEN_INITIAL_COUNTRIES[0];
    const activeFreight =
      (activeCarrier && activeCarrier.freight?.byCountry?.[activeCountryCode]) || null;
   

       const updateCarrier = (carrierId:any, updater:any) => {
    dispatch(setCarrierConfigs(  carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))
 ))
    
  };

    
      const handleMinWeightChange = (rowId:any, field:any, value:any) => {
const updatedFreightBasisData = {
  ...freightBasisData,
  countries: {
    ...freightBasisData.countries,
    [freightCountryCodes[freightCountryIndex]]: {
      ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]],
      MinimumWeight: {
        ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]].MinimumWeight,
        Base: {
          ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]].MinimumWeight.Base,
          [rowId]: {
            ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]].MinimumWeight.Base[rowId],
            [field]: value
          }
        }
      }
    }
  }
};                  dispatch(setFreightBasisData(updatedFreightBasisData));
      };
  

const minWeightCode =MinimumWeight?.Base? Object.keys(MinimumWeight?.Base):[];

  return (<>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {pricingText.freight.minWeightTitle}
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{pricingText.freight.minWeightHeaders.code}</TableCell>
                        <TableCell>{pricingText.freight.minWeightHeaders.internalCode}</TableCell>
                        <TableCell>{pricingText.freight.minWeightHeaders.description}</TableCell>
                        <TableCell>{pricingText.freight.minWeightHeaders.internalDescription}</TableCell>
                        <TableCell>{pricingText.freight.minWeightHeaders.weight}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(minWeightCode || []).map((code:any) => (
                        <TableRow key={code}>
                          <TableCell>
                            <TextField
                              size="small"
                              value={code}
                              onChange={(e) => handleMinWeightChange(code, "code", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={MinimumWeight?.Base[code]?.InternalShorthand||""}
                              onChange={(e) =>
                                handleMinWeightChange(code, "InternalShorthand", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={MinimumWeight?.Base[code]?.Description}
                              onChange={(e) =>
                                handleMinWeightChange(code, "Description", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={MinimumWeight?.Base[code]?.InternalDescription||""}
                              onChange={(e) =>
                                handleMinWeightChange(code, "InternalDescription", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={MinimumWeight?.Base[code]?.Weight||""}
                              onChange={(e) => handleMinWeightChange(code, "Weight", e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
   </>
  )
}
