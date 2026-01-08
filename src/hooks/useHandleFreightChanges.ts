import { LANGUAGE_TEXT } from "@/constants/data";
import { editShipperFreightCalc } from "@/dialogs/invoice_config/services";
import { setFreightBasisData } from "@/store/features/freight_basis/FreightBasisSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { isEmpty } from "@/utils/helper";
import {  useEffect, useRef} from "react";

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
              dispatch(setFreightBasisData(updatedFreightBasisData));
            };
  
           


  return { handleFreightChange };
}