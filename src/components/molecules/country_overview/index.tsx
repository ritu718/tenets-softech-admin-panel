
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

import { setFreightCountryCodes, setFreightCountryIndex } from "@/store/features/freight_basis/FreightBasisSlice";

export default function CountryOverview({
  countryOptions,
}:any) {
const dispatch = useAppDispatch();
     const { localeText: text } =useLanguage();
        const pricingText = text.config.pricing;
 
 const [selectedCountryOption, setSelectedCountryOption] = useState("");
     
           const {freightCountryCodes, freightCountryIndex,freightBasisData} = useAppSelector((state) => state.freightBasis);
       
const resolvedCountryOptions =
        countryOptions && countryOptions.length
          ? countryOptions
          : BASE_COUNTRY_OPTIONS.map((option:any) => ({
              ...option,
              label: option.code,
            }));
            const availableCountryOptions =
    resolvedCountryOptions.filter((option:any) => !freightCountryCodes.includes(option.code)) || [];

            
      const onChangeCountryTab = (_:any, value:any) =>{    
    dispatch(setFreightCountryIndex(value));
  
  }

   const getFlag = (code:any) =>
    resolvedCountryOptions.find((option:any) => option.code === code)?.flag || "🌐";

           useEffect(() => {
        const countryCodes= Object.keys(freightBasisData?.countries||{}) || [];      
dispatch(setFreightCountryCodes(countryCodes));

       }, [freightBasisData]);

 const handleRemoveCountry = (index:any) => {
const freightCountryCodesTmp=[...freightCountryCodes];

 freightCountryCodesTmp.splice(index,1);
const indexTmp =freightCountryCodesTmp.length>0? freightCountryCodesTmp[index+1]>0?index+1:index-1:-1;
const code= freightCountryCodesTmp.length>0?freightCountryCodesTmp[indexTmp]:"";
    dispatch( setFreightCountryIndex(indexTmp));
   dispatch(setFreightCountryCodes([...freightCountryCodesTmp]));
     setSelectedCountryOption(code);
  };
  
  
    const handleAddCountry = (code:any) => {
      
   dispatch( setFreightCountryIndex(freightCountryCodes?.length+1));
   dispatch(setFreightCountryCodes([...freightCountryCodes, code]));
    setSelectedCountryOption(code);
   
  };
  

  return (
     <Stack spacing={1.5}>
              <Typography variant="subtitle2">{pricingText.freight.countryTitle}</Typography>
               <Tabs
  value={Math.min(
    freightCountryIndex,
    freightCountryCodes?.length - 1
  )}
  onChange={onChangeCountryTab}
  variant="scrollable"
  scrollButtons="auto"
  sx={{ borderBottom: 1, borderColor: "divider" }}
>
  {freightCountryCodes.map((code: any, index: any) => (
    <Tab
      key={`${code}-${index}`}
      value={index}
      label={
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">
            {getFlag(code)} {code}
          </Typography>

          {freightCountryCodes?.length > 1 && (
            <IconButton
              component="span"   // ✅ FIX HERE
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
                    <InputLabel>{pricingText.freight.countryAddLabel}</InputLabel>
                    <Select
                      value={selectedCountryOption}
                      label={pricingText.freight.countryAddLabel}
                      onChange={(e) => {
                       
                        handleAddCountry(e.target.value);
                      }}
                    >
                      <MenuItem value="">{pricingText.freight.countryPlaceholder}</MenuItem>
                      {availableCountryOptions.map((option:any) => (
                        <MenuItem key={option.code} value={option.code}>
                          {option.flag} {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
  )
}
