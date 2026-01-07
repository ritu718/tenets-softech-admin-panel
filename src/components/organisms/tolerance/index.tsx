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
     const [toleranceSettings, setToleranceSettings] = useState({
    freightPercent: 0,
    defaultSurchargePercent: 0,
    surchargeOverrides: [],
    onlyNegativeMismatch: false,
  });
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



       const handleToleranceFieldChange = (field:any) => (event:any) => dispatch(setToleranecData({...toleranecData,[field]:Number(event.target.value)}));

       const createOverrideEntry = () => ({
    id: `${Date.now()}-${Math.random()}`,
    label: "",
    percent: 0,
  });
const handleAddOverride = () => {
    setToleranceSettings((prev:any) => ({
      ...prev,
      surchargeOverrides: [...prev.surchargeOverrides, createOverrideEntry()],
    }));
  };

  const handleRemoveOverride = (id:any) => {
    setToleranceSettings((prev) => ({
      ...prev,
      surchargeOverrides: prev.surchargeOverrides.filter((item :any) => item.id !== id),
    }));
  };
  const handleOverrideChange = (id:any, field:any, value:any) => {
    setToleranceSettings((prev:any) => ({
      ...prev,
      surchargeOverrides: prev.surchargeOverrides.map((item:any) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "percent"
                  ? Math.max(Number(value) || 0, 0)
                  : value,
            }
          : item
      ),
    }));
  };


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
                 value={toleranecData?.freightCostsPercent||0}
                 onChange={handleToleranceFieldChange("freightCostsPercent")}
                 inputProps={{ min: 0 }}
               />
               <TextField
                 label={localeText.dialogs.toleranceDefaultSurcharge}
                 type="number"
                 value={toleranecData?.standardAdditionalCostsPercent||0}
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