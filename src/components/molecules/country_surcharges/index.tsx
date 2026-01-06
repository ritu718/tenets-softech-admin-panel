
import React, {   useEffect,  useState } from "react";
import {
  
  Typography, 
  
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
    Stack,
  Tabs,
  Tab,
} from "@mui/material";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { BASE_COUNTRY_OPTIONS } from "@/constants/data";


import {  setSurchargesCountryCodes, setSurchargesCountryIndex } from "@/store/features/surcharges/SurchargesSlice";

export default function CountrySurcharges() {
const dispatch = useAppDispatch();
     const { localeText: text } =useLanguage();
        const pricingText = text.config.pricing;
 

     
           const {surchargesCountryCodes, surchargesCountryIndex,surchargesData} = useAppSelector((state) => state.surcharges);
       
const resolvedCountryOptions =BASE_COUNTRY_OPTIONS.map((option:any) => ({
              ...option,
              label: option.code,
            }));
            const availableCountryOptions =
    resolvedCountryOptions.filter((option:any) => !surchargesCountryCodes?.includes(option.code)) || [];

            
      const onChangeCountryTab = (_:any, value:any) =>{    
    dispatch(setSurchargesCountryIndex(value));
  
  }

   const getFlag = (code:any) =>
    resolvedCountryOptions.find((option:any) => option.code === code)?.flag || "🌐";

           useEffect(() => {
        const countryCodes= Object.keys(surchargesData?.extraCosts||{}) || [];   
        console.log("countryCodes: ",countryCodes);
           
dispatch(setSurchargesCountryCodes(countryCodes));

       }, [surchargesData]);

 const handleRemoveCountry = (index:any) => {
const freightCountryCodesTmp=[...surchargesCountryCodes];

 freightCountryCodesTmp.splice(index,1);
const indexTmp =freightCountryCodesTmp.length>0? freightCountryCodesTmp[index+1]>0?index+1:index-1:-1;
const code= freightCountryCodesTmp.length>0?freightCountryCodesTmp[indexTmp]:"";
    dispatch( setSurchargesCountryIndex(indexTmp));
   dispatch(setSurchargesCountryCodes([...freightCountryCodesTmp]));
    
  };
  
  
    const handleAddCountry = (code:any) => {
   dispatch( setSurchargesCountryIndex(surchargesCountryCodes.length+1));
   dispatch(setSurchargesCountryCodes([...surchargesCountryCodes, code]));

   
  };

  return (
     <>
              <Typography variant="subtitle2">{pricingText.surcharges.countryTitle}</Typography>
                  <Tabs
                    value={Math.min(surchargesCountryIndex, surchargesCountryCodes.length - 1)}
                    onChange={onChangeCountryTab}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                  >
                    {surchargesCountryCodes.map((code:any, index:any) => (
                      <Tab
                        key={`${code}-${index}`}
                        value={index}
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">
                              {getFlag(code)} {code}
                            </Typography>
                            {surchargesCountryCodes.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleRemoveCountry(index);
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
                        onChange={(e) => handleAddCountry(e.target.value)}
                      >
                        <MenuItem value="">{pricingText.surcharges.countryPlaceholder}</MenuItem>
                        {availableCountryOptions.map((option:any) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.flag} {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
              </>
  )
}
