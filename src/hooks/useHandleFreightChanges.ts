
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {  updateFreightCalculationData } from "@/utils/helper";


export function useHandleFreightChanges() {

   const {freightCountryCodes, freightCountryIndex,freightBasisData} = useAppSelector((state) => state.freightBasis);
    const dispatch = useAppDispatch();
    
      const handleFreightChange = (key:any, value:any) => {
                
            const updatedFreightBasisData = {
    ...freightBasisData,
    countries: {
      ...freightBasisData.countries,
      [freightCountryCodes[freightCountryIndex]]: {
        ...freightBasisData.countries[freightCountryCodes[freightCountryIndex]],
        [key]: value,
      },
    },
  };
              updateFreightCalculationData(updatedFreightBasisData,dispatch)
            };
  
           


  return { handleFreightChange };
}