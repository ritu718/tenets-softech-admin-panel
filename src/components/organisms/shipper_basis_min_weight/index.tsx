import React from 'react'
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
import {  updateFreightCalculationData } from '@/utils/helper';
import {  useAppSelector } from '@/store/hooks';
import { useLanguage } from '@/hooks/useLanguage';

export default function ShipperBasisMinWeight(){
  const { localeText } =useLanguage();
  
   const pricingText = localeText.config.pricing;
    const {freightCountryCodes, freightCountryIndex,freightBasisData} = useAppSelector((state) => state.freightBasis);
   const {MinimumWeight} = freightBasisData?.countries?.[freightCountryCodes[freightCountryIndex]] || {}; 
  

  
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
};                 updateFreightCalculationData(updatedFreightBasisData,dispatch)
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
