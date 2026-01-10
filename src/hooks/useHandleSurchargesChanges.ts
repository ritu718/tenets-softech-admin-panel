import { setSurchargesData } from "@/store/features/surcharges/SurchargesSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

    
export function useHandleSurchargesChanges() {

  const { surchargesCountryCodes, surchargesCountryIndex, surchargesData } =
    useAppSelector((state) => state.surcharges);
  
  const countryCode = surchargesCountryCodes?.[surchargesCountryIndex];
  
  const { Base=[] } =
    surchargesData?.extraCosts?.[countryCode] ?? {};
    const dispatch = useAppDispatch();
    
      const handleSurchargeRowChange = (index:any,key:any, value:any) => {
       const BaseTmp = [...Base];
BaseTmp[index] = {
  ...BaseTmp[index],
  [key]: value
};

const surchargesDataTmp = {
  ...surchargesData,
  extraCosts: {
    ...surchargesData.extraCosts,
    [countryCode]: {
      ...surchargesData.extraCosts[countryCode],
      Base: BaseTmp
    }
  }
};

              dispatch(setSurchargesData(surchargesDataTmp));
            };
  


  return { handleSurchargeRowChange };
}