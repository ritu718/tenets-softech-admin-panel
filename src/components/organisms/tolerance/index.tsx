import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLanguage } from '@/hooks/useLanguage';
import { setToleranceDialogOpen } from '@/store/features/tolerances/tolerancesSlice';
import AddIcon from "@mui/icons-material/Add";
import { getToleranceData } from '@/dialogs/invoice_config/services';


function Tolerance() {

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
  },[toleranceDialogOpen])


       const handleToleranceFieldChange = (field:any) => (event:any) => {
    const parsed = Number(event.target.value);
    setToleranceSettings((prev:any) => ({
      ...prev,
      [field]: Number.isFinite(parsed) ? Math.max(parsed, 0) : prev[field],
    }));
  };
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
                 onChange={handleToleranceFieldChange("freightPercent")}
                 inputProps={{ min: 0 }}
               />
               <TextField
                 label={localeText.dialogs.toleranceDefaultSurcharge}
                 type="number"
                 value={toleranecData?.standardAdditionalCostsPercent||0}
                 onChange={handleToleranceFieldChange("defaultSurchargePercent")}
                 inputProps={{ min: 0 }}
               />
               <FormControlLabel
                 control={
                   <Checkbox
                     checked={toleranecData?.onlyPositiveDeviation||false}
                     onChange={(event) =>
                       setToleranceSettings((prev) => ({
                         ...prev,
                         onlyNegativeMismatch: event.target.checked,
                       }))
                     }
                   />
                 }
                 label={localeText.dialogs.onlyNegativeLabel}
               />
             </Stack>
   
             <Box mt={3}>
               <Typography variant="subtitle2" gutterBottom>
                 {localeText.dialogs.specificSurcharges}
               </Typography>
               {toleranceSettings.surchargeOverrides.length === 0 && (
                 <Typography variant="body2" color="text.secondary">
                   {localeText.dialogs.noOverrides}
                 </Typography>
               )}
               {toleranceSettings.surchargeOverrides.map((override:any) => (
                 <Stack
                   direction={{ xs: "column", sm: "row" }}
                   spacing={1}
                   alignItems="center"
                   key={override.id}
                   sx={{ mt: 1 }}
                 >
                   <TextField
                     label={localeText.dialogs.overrideLabel}
                     value={override.label}
                     onChange={(e) => handleOverrideChange(override.id, "label", e.target.value)}
                     fullWidth
                   />
                   <TextField
                     label={localeText.dialogs.overridePercent}
                     type="number"
                     value={override.percent}
                     onChange={(e) => handleOverrideChange(override.id, "percent", e.target.value)}
                     sx={{ minWidth: 160 }}
                     inputProps={{ min: 0 }}
                   />
                   <IconButton color="error" onClick={() => handleRemoveOverride(override.id)}>
                     <DeleteOutlineIcon />
                   </IconButton>
                 </Stack>
               ))}
               <Button
                 startIcon={<AddIcon />}
                 onClick={handleAddOverride}
                 sx={{ mt: 2 }}
                 variant="text"
               >
                 {localeText.dialogs.addOverride}
               </Button>
             </Box>
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