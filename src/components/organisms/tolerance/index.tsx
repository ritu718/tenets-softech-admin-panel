import React, { useEffect, useRef } from 'react'
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
import { addEditToleranceData, getToleranceData } from '@/dialogs/invoice_config/services';
import ToleranceSurcharge from '@/components/molecules/tolerance_surcharge';
import { addEditTolrances } from '@/utils/helper';


function Tolerance() {
    const dispatch = useAppDispatch();
     const userId = useAppSelector((state) => state?.userDetails?.userProfile?.id);
    const {toleranceDialogOpen,toleranecData} = useAppSelector((state:any) => state?.tolerances); 
    const { localeText } =useLanguage();
   
  useEffect(()=>{
  toleranceDialogOpen&&getToleranceData({userId},dispatch)
  },[toleranceDialogOpen])

       const handleToleranceFieldChange = (field:any) => (event:any) =>{
        const tolObj = {...toleranecData,[field]:Number( event.target.value)};
        addEditTolrances(tolObj,userId,dispatch)
       }

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

export default React.memo(Tolerance);