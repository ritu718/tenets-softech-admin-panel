import React from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useLanguage } from '@/hooks/useLanguage';
import { useHandleTariffsChanges } from '@/hooks/useHandleTariffsChanges';
import { useGetTariffsChanges } from '@/hooks/useGetTariffsChanges';

export default function TariffsTypeSelector() {

     const { pricingText } =useLanguage();
     const { handleTariffChange }=useHandleTariffsChanges();
          
  const { TariffType } = useGetTariffsChanges();
    
  return (
     <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>{pricingText.tariffs.tariffTypeLabel}</InputLabel>
                <Select
                  label={pricingText.tariffs.tariffTypeLabel}
                  value={TariffType}
                  onChange={(e) => handleTariffChange("TariffType", e.target.value)}
                >
                  {(pricingText.tariffs.tariffTypes || []).map((option:any) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
  )
}
