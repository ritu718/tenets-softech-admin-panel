import React, { useEffect, useState } from 'react'
import {
 
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
 
} from "@mui/material"
import { DEFAULT_DATA_CARRIER } from "@/constants/common";
import { NEBENKOSTEN_INITIAL_COUNTRIES } from "@/constants/common";
import { BASE_COUNTRY_OPTIONS } from "@/constants/data";
import AddIcon from "@mui/icons-material/Add";
import {  createCarrierConfig,   } from "@/utils/helper";
import { useLanguage } from '@/hooks/useLanguage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
 import {
  setCarrierConfigs
} from "@/store/features/invoice_data/invoiceDataSlice";
import { setActiveCarrierId, setEditCarrier } from '@/store/features/carrier/carriersSlice';
import { fetchApi } from '@/services/api';
import { URL_SHIPPER_PROJECTS } from '@/constants/apis';
import { sendCarrierDataToServer } from '../invoice_config/services';

function InvoiceSpedition({
   countryOptions,
    addCarrierDialogOpen,
     setAddCarrierDialogOpen
}:any)
 {
const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
    const userId = useAppSelector((state) => state?.userDetails?.userProfile?.id);
    const editCarrier = useAppSelector((state) => state.carriers.editCarrier)||DEFAULT_DATA_CARRIER;
    console.log("editCarrier: ",editCarrier);
    
   const { localeText: text } =useLanguage();
    const dispatch = useAppDispatch();
    
        const [errors, setErrors] = useState<any>({});


  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors: any = {};

    Object.keys(editCarrier).forEach((key) => {
      if (!editCarrier[key as keyof typeof editCarrier]?.trim()) {
        newErrors[key] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



      const handleConfirmAddCarrier = () => {
         if (!validateForm()) return;
          const defaultLabel = `${pricingText.defaults.newCarrierName} ${carriers.length + 1}`;
          const label = editCarrier?.name?.trim() || defaultLabel;
          const reqObj = {
            name:editCarrier.name,
            street: editCarrier.street,
            streetNo: editCarrier.streetNo,
            zipCode: editCarrier.zipCode,
            city: editCarrier.city,
            country: editCarrier.country,
            contactName: editCarrier.contactName,
            phoneNo: editCarrier.phoneNo,
            email: editCarrier.email,
            customerNumber: editCarrier.customerNumber,
            userId,
          };
          const nextCarrier = createCarrierConfig(text, label,reqObj );
             console.log('nextCarrier.id: ',nextCarrier.id);
          sendCarrierDataToServer(reqObj,dispatch,(respData?:any)=>{
            console.log("respData: ",respData);
             dispatch(setCarrierConfigs(  [...carriers, respData]))
 dispatch(setEditCarrier(DEFAULT_DATA_CARRIER))
            setErrors({});
    setAddCarrierDialogOpen(false);

          })
      
        };
      
    
    
    const pricingText = text.config.pricing;
    

    const updateDataToStore = (key:any,value:any)=>
    {
       dispatch(setEditCarrier({...editCarrier,[key]:value}))
    }
     
  return (
 
        
        <Dialog
                open={addCarrierDialogOpen}
                onClose={() => setAddCarrierDialogOpen(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>{editCarrier?.id?pricingText.addCarrierDialog.editCarrier:pricingText.addCarrierDialog.title}</DialogTitle>
                <DialogContent dividers>
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                      label={pricingText.addCarrierDialog.name}
                      value={editCarrier.name}
                      onChange={(e) =>updateDataToStore("name", e.target.value) }
                        error={!!errors.name}
                        helperText={errors.name}
                      fullWidth
                      autoFocus
                    />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <TextField
                        label={pricingText.addCarrierDialog.street}
                        value={editCarrier.street}
                        onChange={(e) => updateDataToStore("street", e.target.value)  }
                          error={!!errors.street}
                           helperText={errors.street}
                        fullWidth
                      />
                      <TextField
                        label={pricingText.addCarrierDialog.houseNumber}
                        value={editCarrier.streetNo}
                        onChange={(e) =>updateDataToStore("streetNo", e.target.value) }
                         error={!!errors.streetNo}
                        helperText={errors.streetNo}
                        sx={{ width: { xs: "100%", sm: 140 } }}
                      />
                    </Stack>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <TextField
                        label={pricingText.addCarrierDialog.zip}
                        value={editCarrier.zipCode}
                        onChange={(e) =>updateDataToStore("zipCode", e.target.value) }
                            error={!!errors.zipCode}
                           helperText={errors.zipCode}
                        sx={{ width: { xs: "100%", sm: 180 } }}
                      />
                      <TextField
                        label={pricingText.addCarrierDialog.city}
                        value={editCarrier.city}
                        onChange={(e) => updateDataToStore("city", e.target.value) }
                          error={!!errors.city}
                          helperText={errors.city}
                        fullWidth
                      />
                    </Stack>
                    <TextField
                      label={pricingText.addCarrierDialog.country}
                      value={editCarrier.country}
                      onChange={(e) =>updateDataToStore("country", e.target.value) }
                        error={!!errors.country}
                       helperText={errors.country}
                      fullWidth
                    />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <TextField
                        label={pricingText.addCarrierDialog.contact}
                        value={editCarrier.contactName}
                        onChange={(e) => updateDataToStore("contactName", e.target.value) }
                           error={!!errors.contactName}
                         helperText={errors.contactName}
                        fullWidth
                      />
                      <TextField
                        label={pricingText.addCarrierDialog.phone}
                        value={editCarrier.phoneNo}
                        onChange={(e) => updateDataToStore("phoneNo", e.target.value) }
                           error={!!errors.phoneNo}
                           helperText={errors.phoneNo}
                          fullWidth
                      />
                    </Stack>
                    <TextField
                      label={pricingText.addCarrierDialog.email}
                      value={editCarrier.email}
                      onChange={(e) => updateDataToStore("email", e.target.value) 
                       }
                      // type="email"
                          error={!!errors.email}
                        helperText={errors.email}
                      fullWidth
                    />
                    <TextField
                      label={pricingText.addCarrierDialog.customerNumber}
                      value={editCarrier.customerNumber}
                      onChange={(e) =>
                        updateDataToStore("customerNumber", e.target.value) 
                      
                      }
                         error={!!errors.customerNumber}
                       helperText={errors.customerNumber}
                      fullWidth
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setAddCarrierDialogOpen(false)}>
                    {pricingText.addCarrierDialog.cancel}
                  </Button>
                  <Button variant="contained" onClick={handleConfirmAddCarrier}>
                    {editCarrier?.id?pricingText.addCarrierDialog.update:pricingText.addCarrierDialog.save}
                  </Button>
                </DialogActions>
              </Dialog>
      
  )
}

export default InvoiceSpedition;