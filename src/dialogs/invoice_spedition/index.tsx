import React, { useState } from 'react'
import {
 
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
 
} from "@mui/material"
import { NEBENKOSTEN_INITIAL_COUNTRIES } from "@/constants/common";
import { BASE_COUNTRY_OPTIONS } from "@/constants/data";
import AddIcon from "@mui/icons-material/Add";
import {  createCarrierConfig,   } from "@/utils/helper";
import { useLanguage } from '@/hooks/useLanguage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
 import {
  setCarrierConfigs
} from "@/store/features/invoice_data/invoiceDataSlice";
import { setActiveCarrierId } from '@/store/features/carrier/carriersSlice';
import { fetchApi } from '@/services/api';
import { URL_SHIPPER_PROJECTS } from '@/constants/apis';
import { sendCarrierDataToServer } from '../invoice_config/services';

function InvoiceSpedition({
   countryOptions,
    addCarrierDialogOpen,
     setAddCarrierDialogOpen
}:any)
 {
  const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
    const userId = useAppSelector((state) => state?.userDetails?.userInfo?.userId);
   const { localeText: text } =useLanguage();
    const dispatch = useAppDispatch();
    
    const [newCarrierName, setNewCarrierName] = useState("");

     const [newCarrierForm, setNewCarrierForm] = useState({
        name: "",
        street: "",
        streetNo: "",
        zipCode: "",
        city: "",
        country: "",
        contactName: "",
        phoneNo: "",
        email: "",
        customerNumber: "",
      });


      const handleConfirmAddCarrier = () => {
          const defaultLabel = `${pricingText.defaults.newCarrierName} ${carriers.length + 1}`;
          const label = newCarrierForm.name?.trim() || defaultLabel;
          const reqObj = {
            name:newCarrierForm.name,
            street: newCarrierForm.street,
            streetNo: newCarrierForm.streetNo,
            zipCode: newCarrierForm.zipCode,
            city: newCarrierForm.city,
            country: newCarrierForm.country,
            contactName: newCarrierForm.contactName,
            phoneNo: newCarrierForm.phoneNo,
            email: newCarrierForm.email,
            // customerNumber: newCarrierForm.customerNumber,
            userId,
          };
          const nextCarrier = createCarrierConfig(text, label,reqObj );
             dispatch(setCarrierConfigs(  [...carriers, nextCarrier]))
             console.log('nextCarrier.id: ',nextCarrier.id);
             
          dispatch(setActiveCarrierId( nextCarrier.id))
          
          sendCarrierDataToServer(reqObj,dispatch,(respData?:any)=>{
            console.log("respData: ",respData);
setNewCarrierForm({
            name: "",
            street: "",
            streetNo: "",
            zipCode: "",
            city: "",
            country: "",
            contactName: "",
            phoneNo: "",
            email: "",
            customerNumber: "",
          });
          })
        
          

      
        };
      
    
    const resolvedCountryOptions =
        countryOptions && countryOptions.length
          ? countryOptions
          : BASE_COUNTRY_OPTIONS.map((option:any) => ({
              ...option,
              label: option.code,
            }));
    const pricingText = text.config.pricing;
    
      const activeCarrier =
        carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
      const freightCountryCodes =
        (activeCarrier && activeCarrier.freight?.countryCodes) || NEBENKOSTEN_INITIAL_COUNTRIES;
      const [freightCountryIndex, setFreightCountryIndex] = useState(0);
      const activeCountryCode =
        freightCountryCodes[freightCountryIndex] || freightCountryCodes[0] || NEBENKOSTEN_INITIAL_COUNTRIES[0];
      const activeFreight =
        (activeCarrier && activeCarrier.freight?.byCountry?.[activeCountryCode]) || null;
      const availableCountryOptions =
        resolvedCountryOptions.filter((option:any) => !freightCountryCodes.includes(option.code)) || [];
      const getFlag = (code:any) =>
        resolvedCountryOptions.find((option:any) => option.code === code)?.flag || "🌐";
    
      const tariffCountryCodes =
        (activeCarrier && activeCarrier.tariffs?.countryCodes) || NEBENKOSTEN_INITIAL_COUNTRIES;
      const [tariffCountryIndex, setTariffCountryIndex] = useState(0);
      const activeTariffCountryCode =
        tariffCountryCodes[tariffCountryIndex] ||
        tariffCountryCodes[0] ||
        NEBENKOSTEN_INITIAL_COUNTRIES[0];
      const activeTariff =
        (activeCarrier && activeCarrier.tariffs?.byCountry?.[activeTariffCountryCode]) || null;
      const availableTariffCountryOptions =
        resolvedCountryOptions.filter((option:any) => !tariffCountryCodes.includes(option.code)) || [];
      const surchargeCountryCodes =
        (activeCarrier && activeCarrier.surcharges?.countryCodes) || NEBENKOSTEN_INITIAL_COUNTRIES;
      const [surchargeCountryIndex, setSurchargeCountryIndex] = useState(0);
      const activeSurchargeCountryCode =
        surchargeCountryCodes[surchargeCountryIndex] ||
        surchargeCountryCodes[0] ||
        NEBENKOSTEN_INITIAL_COUNTRIES[0];
      const activeSurcharges =
        (activeCarrier && activeCarrier.surcharges?.byCountry?.[activeSurchargeCountryCode]) || null;
      const availableSurchargeCountryOptions =
        resolvedCountryOptions.filter((option:any) => !surchargeCountryCodes.includes(option.code)) || [];
         const handleAddCarrier = () => {
    const defaultLabel = `${pricingText.defaults.newCarrierName} ${carriers.length + 1}`;
    setNewCarrierForm((prev) => ({
      ...prev,
      name: prev.name || newCarrierName.trim() || defaultLabel,
    }));
    setAddCarrierDialogOpen(true);
  }
  

  return (
 
        
        <Dialog
                open={addCarrierDialogOpen}
                onClose={() => setAddCarrierDialogOpen(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>{pricingText.addCarrierDialog.title}</DialogTitle>
                <DialogContent dividers>
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                      label={pricingText.addCarrierDialog.name}
                      value={newCarrierForm.name}
                      onChange={(e) => setNewCarrierForm((prev) => ({ ...prev, name: e.target.value }))}
                      fullWidth
                      autoFocus
                    />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <TextField
                        label={pricingText.addCarrierDialog.street}
                        value={newCarrierForm.street}
                        onChange={(e) => setNewCarrierForm((prev) => ({ ...prev, street: e.target.value }))}
                        fullWidth
                      />
                      <TextField
                        label={pricingText.addCarrierDialog.houseNumber}
                        value={newCarrierForm.streetNo}
                        onChange={(e) =>
                          setNewCarrierForm((prev) => ({ ...prev, streetNo: e.target.value }))
                        }
                        sx={{ width: { xs: "100%", sm: 140 } }}
                      />
                    </Stack>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <TextField
                        label={pricingText.addCarrierDialog.zip}
                        value={newCarrierForm.zipCode}
                        onChange={(e) => setNewCarrierForm((prev) => ({ ...prev, zipCode: e.target.value }))}
                        sx={{ width: { xs: "100%", sm: 180 } }}
                      />
                      <TextField
                        label={pricingText.addCarrierDialog.city}
                        value={newCarrierForm.city}
                        onChange={(e) => setNewCarrierForm((prev) => ({ ...prev, city: e.target.value }))}
                        fullWidth
                      />
                    </Stack>
                    <TextField
                      label={pricingText.addCarrierDialog.country}
                      value={newCarrierForm.country}
                      onChange={(e) => setNewCarrierForm((prev) => ({ ...prev, country: e.target.value }))}
                      fullWidth
                    />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <TextField
                        label={pricingText.addCarrierDialog.contact}
                        value={newCarrierForm.contactName}
                        onChange={(e) => setNewCarrierForm((prev) => ({ ...prev, contactName: e.target.value }))}
                        fullWidth
                      />
                      <TextField
                        label={pricingText.addCarrierDialog.phone}
                        value={newCarrierForm.phoneNo}
                        onChange={(e) => setNewCarrierForm((prev) => ({ ...prev, phoneNo: e.target.value }))}
                        fullWidth
                      />
                    </Stack>
                    <TextField
                      label={pricingText.addCarrierDialog.email}
                      value={newCarrierForm.email}
                      onChange={(e) => setNewCarrierForm((prev) => ({ ...prev, email: e.target.value }))}
                      type="email"
                      fullWidth
                    />
                    <TextField
                      label={pricingText.addCarrierDialog.customerNumber}
                      value={newCarrierForm.customerNumber}
                      onChange={(e) =>
                        setNewCarrierForm((prev) => ({ ...prev, customerNumber: e.target.value }))
                      }
                      fullWidth
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setAddCarrierDialogOpen(false)}>
                    {pricingText.addCarrierDialog.cancel}
                  </Button>
                  <Button variant="contained" onClick={handleConfirmAddCarrier}>
                    {pricingText.addCarrierDialog.save}
                  </Button>
                </DialogActions>
              </Dialog>
      
  )
}

export default InvoiceSpedition;