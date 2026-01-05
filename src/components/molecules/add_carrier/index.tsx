import React, { useState } from 'react'
import {
 
 
  Button,
  TextField,

} from "@mui/material";
import { useLanguage } from '@/hooks/useLanguage';
import { useAppSelector } from '@/store/hooks';
import { NEBENKOSTEN_INITIAL_COUNTRIES } from '@/constants/common';

import AddIcon from "@mui/icons-material/Add";

export default function AddCarrier({resolvedCountryOptions,handleAddCarrier}:any) {

    const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
     const { localeText: text } =useLanguage();
const pricingText = text.config.pricing;
    const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);

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

  return (<>
       <TextField
          label={pricingText.currentCarrierLabel}
          value={activeCarrier?.name || "—"}
          InputProps={{ readOnly: true }}
          size="small"
          sx={{ minWidth: 240 }}
        />
       
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddCarrier}>
          {pricingText.addCarrier}
        </Button>
        </>
  )
}
