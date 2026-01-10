

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateTariffsnData } from "@/utils/helper";

export function useHandleTariffsChanges() {
    const {tariffsCountryCodes, tariffsCountryIndex,tariffsData} = useAppSelector((state) => state.tariffs);
    const dispatch = useAppDispatch();
    
      const handleTariffChange = (key:any, value:any) => {
       
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
  updateTariffsnData(updatedTariffsData,dispatch)
             
            };
  


  return { handleTariffChange };
}