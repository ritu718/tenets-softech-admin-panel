import React from 'react'
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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { updateFreightCalculationData } from '@/utils/helper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLanguage } from '@/hooks/useLanguage';



export default function AdditionMinimumWeight() {
   
    const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
   const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
               const dispatch = useAppDispatch();
 const { pricingText } =useLanguage();
     
 const {freightCountryCodes, freightCountryIndex,freightBasisData} = useAppSelector((state) => state.freightBasis);
   const {Additional} = freightBasisData?.countries?.[freightCountryCodes[freightCountryIndex]]?.MinimumWeight || []; 
                         
      
      
        const handleMinWeightChange = (index:any, field:any, value:any) => {
        const updatedFreightBasisData = {
  ...freightBasisData,
  countries: {
    ...freightBasisData.countries,
    [freightCountryCodes[freightCountryIndex]]: {
      ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]],
      MinimumWeight: {
        ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]].MinimumWeight,
        Additional: freightBasisData
          .countries[freightCountryCodes[freightCountryIndex]]
          .MinimumWeight.Additional.map((item:any, i:any) =>
            i === index
              ? { ...item, [field]: value }
              : item
          )
      }
    }
  }
};
updateFreightCalculationData(updatedFreightBasisData,dispatch)
       
      };

         const handleAddCustomMinWeight = () => {
             const updatedFreightBasisData = {
  ...freightBasisData,
  countries: {
    ...freightBasisData.countries,
    [freightCountryCodes[freightCountryIndex]]: {
      ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]],
      MinimumWeight: {
        ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]].MinimumWeight,
        Additional: [...freightBasisData
          .countries[freightCountryCodes[freightCountryIndex]]
          .MinimumWeight.Additional,{
                            
                            Shorthand: "",
                            Description: "",
                            Weight: ""
                        },]
      }
    }
  }
};
     updateFreightCalculationData(updatedFreightBasisData,dispatch)
          };

           const handleRemoveCustomMinWeight = (index:any) => {
              const updatedFreightBasisData = {
  ...freightBasisData,
  countries: {
    ...freightBasisData.countries,
    [freightCountryCodes[freightCountryIndex]]: {
      ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]],
      MinimumWeight: {
        ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]].MinimumWeight,
        Additional: freightBasisData
          .countries[freightCountryCodes[freightCountryIndex]]
          .MinimumWeight.Additional.filter((_:any, i:any) => i !== index)
      }
    }
  }
            };

            updateFreightCalculationData(updatedFreightBasisData,dispatch)  
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
                        {(Additional || []).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Typography variant="body2" color="text.secondary">
                                {pricingText.freight.customEmpty}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                        {(Additional || []).map((row:any,index:any) => (
                          <TableRow key={row?.id||index}>
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.Shorthand}
                                onChange={(e) => handleMinWeightChange(index, "Shorthand", e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.Description}
                                onChange={(e) =>
                                  handleMinWeightChange(index, "Description", e.target.value)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.Weight}
                                onChange={(e) => handleMinWeightChange(index, "Weight", e.target.value)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" onClick={() => handleRemoveCustomMinWeight(index)}>
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

