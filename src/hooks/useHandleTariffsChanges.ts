import { LANGUAGE_TEXT } from "@/constants/data";
import { setFreightBasisData } from "@/store/features/freight_basis/FreightBasisSlice";
import { setTariffsData } from "@/store/features/tariffs/TariffsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback, useMemo, useState } from "react";

export function useHandleTariffsChanges() {


    const {tariffsCountryCodes, tariffsCountryIndex,tariffsData} = useAppSelector((state) => state.tariffs);
    const dispatch = useAppDispatch();
    
      const handleTariffChange = (key:any, value:any) => {
        console.log("key is: ",key);
        console.log("value is: ",value);
        
        
            const updatedTariffsData = {
    ...tariffsData,
    rates: {
      ...tariffsData.rates,
      [tariffsCountryCodes[tariffsCountryIndex]]: {
        ...tariffsData.rates[tariffsCountryCodes[tariffsCountryIndex]],
        [key]: value,
      },
    },
  };
              dispatch(setTariffsData(updatedTariffsData));
            };
  


  return { handleTariffChange };
}