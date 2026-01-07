
import React, {  useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useLanguage } from '@/hooks/useLanguage';
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setToleranecData } from '@/store/features/tolerances/tolerancesSlice';


export default function ToleranceSurcharge() {
    const dispatch = useAppDispatch();
   
     const userId = useAppSelector((state) => state?.userDetails?.userInfo?.userId);
              
        const {toleranceDialogOpen,toleranecData} = useAppSelector((state:any) => state?.tolerances);
    console.log("toleranecData: ",toleranecData);
    
    
        const {ancillaryTolerances} = toleranecData||{};

    const { localeText } =useLanguage();
     const [toleranceSettings, setToleranceSettings] = useState({
        freightPercent: 0,
        defaultSurchargePercent: 0,
        surchargeOverrides: [],
        onlyNegativeMismatch: false,
      });

      const handleRemoveOverride = (itemObj:any) => {
        const ancillaryTolerancesTmp =[...ancillaryTolerances,].filter(
  (item: any) => item !== itemObj
);
dispatch(setToleranecData({...toleranecData,ancillaryTolerances:ancillaryTolerancesTmp}))
   console.log("item value is: ",itemObj);
   console.log("ancillaryTolerancesTmp: ",ancillaryTolerancesTmp);
   
   
  };
  const createOverrideEntry = () => ({
    id: `${Date.now()}-${Math.random()}`,
    label: "",
    percent: 0,
  });

  const handleAddOverride = () => {
   dispatch(setToleranecData({...toleranecData,ancillaryTolerances:[...ancillaryTolerances,{designation: '', tolerancePercent:"" }]}))
  };

      const handleOverrideChange = (index:any, field:any, value:any) => {
const ancillaryTolerancesTmp = ancillaryTolerances.map(
  (item: any, i: number) =>
    i === index
      ? { ...item, [field]: value }
      : item
);

dispatch(
  setToleranecData({
    ...toleranecData,
    ancillaryTolerances: ancillaryTolerancesTmp,
  })
);
  };

    
  return (
     <Box mt={3}>
                   <Typography variant="subtitle2" gutterBottom>
                     {localeText.dialogs.specificSurcharges}
                   </Typography>
                   {ancillaryTolerances?.length === 0 && (
                     <Typography variant="body2" color="text.secondary">
                       {localeText.dialogs.noOverrides}
                     </Typography>
                   )}
                   {ancillaryTolerances?.map((override:any,index:any) => (
                     <Stack
                       direction={{ xs: "column", sm: "row" }}
                       spacing={1}
                       alignItems="center"
                       key={override?.id}
                       sx={{ mt: 1 }}
                     >
                       <TextField
                         label={localeText.dialogs.overrideLabel}
                         value={override.designation}
                         onChange={(e) => handleOverrideChange(index, "designation", e.target.value)}
                         fullWidth
                       />
                       <TextField
                         label={localeText.dialogs.overridePercent}
                         type="number"
                         value={override.tolerancePercent}
                         onChange={(e) => handleOverrideChange(index, "tolerancePercent", e.target.value)}
                         sx={{ minWidth: 160 }}
                         inputProps={{ min: 0 }}
                       />
                       <IconButton color="error" onClick={() =>  handleRemoveOverride(override)}>
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
  )
}
