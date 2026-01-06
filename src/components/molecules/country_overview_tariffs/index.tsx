
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


import { setTariffsCountryCodes, setTariffsCountryIndex } from "@/store/features/tariffs/TariffsSlice";

export default function CountryOverviewTariffs({
  countryOptions,
}:any) {
const dispatch = useAppDispatch();
     const { localeText: text } =useLanguage();
        const pricingText = text.config.pricing;
 
 const [selectedCountryOption, setSelectedCountryOption] = useState("");
     
           const {tariffsCountryCodes, tariffsCountryIndex,tariffsData} = useAppSelector((state) => state.tariffs);
       
const resolvedCountryOptions =
        countryOptions && countryOptions.length
          ? countryOptions
          : BASE_COUNTRY_OPTIONS.map((option:any) => ({
              ...option,
              label: option.code,
            }));
            const availableCountryOptions =
    resolvedCountryOptions.filter((option:any) => !tariffsCountryCodes.includes(option.code)) || [];

            
      const onChangeCountryTab = (_:any, value:any) =>{    
    dispatch(setTariffsCountryIndex(value));
  
  }

   const getFlag = (code:any) =>
    resolvedCountryOptions.find((option:any) => option.code === code)?.flag || "🌐";

           useEffect(() => {
        const countryCodes= Object.keys(tariffsData?.rates||{}) || [];      
dispatch(setTariffsCountryCodes(countryCodes));

       }, [tariffsData]);

 const handleRemoveCountry = (index:any) => {
const freightCountryCodesTmp=[...tariffsCountryCodes];

 freightCountryCodesTmp.splice(index,1);
const indexTmp =freightCountryCodesTmp.length>0? freightCountryCodesTmp[index+1]>0?index+1:index-1:-1;
const code= freightCountryCodesTmp.length>0?freightCountryCodesTmp[indexTmp]:"";
    dispatch( setTariffsCountryIndex(indexTmp));
   dispatch(setTariffsCountryCodes([...freightCountryCodesTmp]));
     setSelectedCountryOption(code);
  };
  
  
    const handleAddCountry = (code:any) => {
   dispatch( setTariffsCountryIndex(tariffsCountryCodes.length+1));
   dispatch(setTariffsCountryCodes([...tariffsCountryCodes, code]));
    setSelectedCountryOption(code);
   
  };

  return (
     <Stack spacing={1.5}>
              <Typography variant="subtitle2">{pricingText.tariffs.countryTitle}</Typography>
                <Tabs
                  value={Math.min(tariffsCountryIndex, tariffsCountryCodes.length - 1)}
                  onChange={onChangeCountryTab}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  {tariffsCountryCodes.map((code:any, index:any) => (
                    <Tab
                      key={`${code}-${index}`}
                      value={index}
                      label={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">
                            {getFlag(code)} {code}
                          </Typography>
                          {tariffsCountryCodes.length > 1 && (
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
                    <InputLabel>{pricingText.tariffs.countryAddLabel}</InputLabel>
                    <Select
                      value={selectedCountryOption}
                      label={pricingText.tariffs.countryAddLabel}
                      onChange={(e) => {
                       
                        handleAddCountry(e.target.value);
                      }}
                    >
                      <MenuItem value="">{pricingText.tariffs.countryPlaceholder}</MenuItem>
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
