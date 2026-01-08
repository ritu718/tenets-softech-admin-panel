import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { setToleranceDialogOpen, setToleranecData } from '@/store/features/tolerances/TolerancesSlice';
import { editToleranceData, getToleranceData } from '@/dialogs/invoice_config/services';
import ToleranceSurcharge from '@/components/molecules/tolerance_surcharge';


function Tolerance() {
  const isFirstRender = useRef(true);
    const dispatch = useAppDispatch();
     const userId = useAppSelector((state) => state?.userDetails?.userInfo?.userId);
          
    const {toleranceDialogOpen,toleranecData} = useAppSelector((state:any) => state?.tolerances);

    

      console.log("toleranecData: " ,toleranecData);
      
    const { localeText } =useLanguage();
   
  useEffect(()=>{
  toleranceDialogOpen&&getToleranceData({userId},dispatch)
  if(!toleranceDialogOpen)
  {
    isFirstRender.current = true;
  }
  },[toleranceDialogOpen])


   useEffect(()=>{
    if(toleranceDialogOpen)
    {
 if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    editToleranceData(toleranecData,dispatch)
    }
  },[toleranecData])
       const handleToleranceFieldChange = (field:any) => (event:any) => dispatch(setToleranecData({...toleranecData,[field]:event.target.value}));

  return (
   <Dialog
           open={toleranceDialogOpen}
           onClose={() => dispatch(setToleranceDialogOpen(false))}
           fullWidth
           maxWidth="sm"
         >
           <DialogTitle>{localeText.dialogs.toleranceTitle}</DialogTitle>
           <DialogContent dividers>
             <Stack spacing={2} sx={{ mt: 1 }}>
               <TextField
                 label={localeText.dialogs.toleranceFreight}
                 type="number"
                 value={toleranecData?.freightCostsPercent||""}
                 onChange={handleToleranceFieldChange("freightCostsPercent")}
                 inputProps={{ min: 0 }}
               />
               <TextField
                 label={localeText.dialogs.toleranceDefaultSurcharge}
                 type="number"
                 value={toleranecData?.standardAdditionalCostsPercent||""}
                 onChange={handleToleranceFieldChange("standardAdditionalCostsPercent")}
                 inputProps={{ min: 0 }}
               />
               <FormControlLabel
                 control={
                   <Checkbox
                     checked={toleranecData?.onlyPositiveDeviation||false}
                     onChange={(event) =>
                        dispatch(setToleranecData({...toleranecData,onlyPositiveDeviation:event.target.checked}))
                     }
                   />
                 }
                 label={localeText.dialogs.onlyNegativeLabel}
               />
             </Stack>
   
             <ToleranceSurcharge/>


           </DialogContent>
           <DialogActions>
             <Button onClick={() => dispatch(setToleranceDialogOpen(false))}>
               {localeText.dialogs.close}
             </Button>
           </DialogActions>
         </Dialog>
  )
}

export default Tolerance;