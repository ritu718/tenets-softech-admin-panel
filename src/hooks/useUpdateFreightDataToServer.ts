
import { editShipperFreightCalc } from "@/dialogs/invoice_config/services";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { isEmpty } from "@/utils/helper";
import {  useEffect, useRef} from "react";

export function useUpdateFreightDataToServer() {
  const isFirstRender = useRef(true);
 const configDialogOpen = useAppSelector((state) => state.invoiceData.configDialogOpen);
    const {isApisCalledForSelectedCarier} = useAppSelector((state) => state.allApisCallingStatus);

   const {freightBasisData} = useAppSelector((state) => state.freightBasis);
    const dispatch = useAppDispatch();
    
             useEffect(()=>{
                if(configDialogOpen&&!isEmpty(freightBasisData)&&!isApisCalledForSelectedCarier)
                {
             if (isFirstRender.current) {
                  isFirstRender.current = false;
                  return;
                }
                editShipperFreightCalc(freightBasisData,dispatch)
                }
              },[freightBasisData])


}