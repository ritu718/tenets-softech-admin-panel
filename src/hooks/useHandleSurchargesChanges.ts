import { LANGUAGE_TEXT } from "@/constants/data";
import { setFreightBasisData } from "@/store/features/freight_basis/FreightBasisSlice";
import { setSurchargesData } from "@/store/features/surcharges/SurchargesSlice";
import { setTariffsData } from "@/store/features/tariffs/TariffsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback, useMemo, useState } from "react";

export function useHandleSurchargesChanges() {


   
  const { surchargesCountryCodes, surchargesCountryIndex, surchargesData } =
    useAppSelector((state) => state.surcharges);
  
  const countryCode = surchargesCountryCodes?.[surchargesCountryIndex];
  
  const { Base=[] } =
    surchargesData?.extraCosts?.[countryCode] ?? {};
    const dispatch = useAppDispatch();
    
      const handleSurchargeRowChange = (index:any,key:any, value:any) => {
        console.log("handleSurchargeRowChange: index: ",index);
        console.log("handleSurchargeRowChange: key: ",key);
        console.log("handleSurchargeRowChange: value: ",value);

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