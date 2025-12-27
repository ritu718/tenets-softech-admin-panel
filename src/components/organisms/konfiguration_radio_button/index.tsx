
import React, {  useState } from "react";
import {
  Typography,
  FormControl,
  Stack,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { NEBENKOSTEN_INITIAL_COUNTRIES } from "@/constants/common";
import {  createFreightBase   } from "@/utils/helper";
import { BASE_COUNTRY_OPTIONS } from "@/constants/data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCarrierConfigs } from "@/store/features/invoice_data/invoiceDataSlice";

export default function KonfiguratorRadioButton({
    text,
  pricingText,
  countryOptions,
}:any){
  const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId)
  const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
         const dispatch = useAppDispatch();
    const resolvedCountryOptions =
        countryOptions && countryOptions.length
          ? countryOptions
          : BASE_COUNTRY_OPTIONS.map((option:any) => ({
              ...option,
              label: option.code,
            }));
    
    const activeCarrier =
        carriers?.find((carrier:any) => carrier.id === activeCarrierId) || carriers?.[0] || null;

      const freightCountryCodes =
        (activeCarrier && activeCarrier.freight?.countryCodes) || NEBENKOSTEN_INITIAL_COUNTRIES;
      const [freightCountryIndex, setFreightCountryIndex] = useState(0);

      const activeCountryCode =
        freightCountryCodes[freightCountryIndex] || freightCountryCodes[0] || NEBENKOSTEN_INITIAL_COUNTRIES[0];

      const activeFreight:any =
        (activeCarrier && activeCarrier.freight?.byCountry?.[activeCountryCode]) || null;
      
         const updateCarrier = (carrierId:any, updater:any) => {
                  dispatch(setCarrierConfigs(carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))))
          
    
  };

         const handleFreightChange = (field:any, value:any) => {
            if (!activeCarrier || !activeCountryCode) return;
            updateCarrier(activeCarrier.id, (carrier:any) => ({
              ...carrier,
              freight: {
                ...(carrier.freight || {}),
                countryCodes: carrier.freight?.countryCodes || [activeCountryCode],
                byCountry: {
                  ...(carrier.freight?.byCountry || {}),
                  [activeCountryCode]: {
                    ...(carrier.freight?.byCountry?.[activeCountryCode] ||
                      createFreightBase(text)),
                    [field]: value,
                  },
                },
              },
            }));
          };
    return(
      <>
      <Typography variant="subtitle2" gutterBottom>
                        {pricingText.freight.calculationTitle}
                      </Typography>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            value={activeFreight?.calculationMode || "cbm"}
                            onChange={(e) => handleFreightChange("calculationMode", e.target.value)}
                          >
                            <FormControlLabel
                              value="cbm"
                              control={<Radio size="small" />}
                              label={pricingText.freight.calculationModes.cbm}
                            />
                            <FormControlLabel
                              value="ldm"
                              control={<Radio size="small" />}
                              label={pricingText.freight.calculationModes.ldm}
                            />
                            <FormControlLabel
                              value="weight"
                              control={<Radio size="small" />}
                              label={pricingText.freight?.calculationModes.weight}
                            />
                          </RadioGroup>
                        </FormControl>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={Boolean(activeFreight?.consolidatedBilling)}
                              onChange={(e) => handleFreightChange("consolidatedBilling", e.target.checked)}
                            />
                          }
                          label={pricingText.freight.consolidated}
                          sx={{ alignSelf: "flex-start" }}
                        />
                      </Stack>
      </>

    )
}