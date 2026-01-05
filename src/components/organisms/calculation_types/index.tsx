
import React from "react";
import {
  Typography,
  FormControl,
  Stack,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
} from "@mui/material";

import {  useAppSelector } from "@/store/hooks";
import { useLanguage } from "@/hooks/useLanguage";
import { useHandleFreightChanges } from "@/hooks/useHandleFreightChanges";

export default function CalculationTypes(){
  const { localeText } =useLanguage();
  const {handleFreightChange}=useHandleFreightChanges();
      const pricingText = localeText.config.pricing;
          const {freightCountryCodes, freightCountryIndex,freightBasisData} = useAppSelector((state) => state.freightBasis);
    const {CalculationType,IsConsolidated=false} = freightBasisData?.countries?.[freightCountryCodes[freightCountryIndex]] || {};
       
          
    return(
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: "grey.50" }}>
      <Typography variant="subtitle2" gutterBottom>
                        {pricingText.freight.calculationTitle}
                      </Typography>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            value={CalculationType}
                            onChange={(e) => handleFreightChange("CalculationType", e.target.value)}
                          >
                            <FormControlLabel
                              value="1"
                              control={<Radio size="small" />}
                              label={pricingText.freight.calculationModes.cbm}
                            />
                            <FormControlLabel
                              value="2"
                              control={<Radio size="small" />}
                              label={pricingText.freight.calculationModes.ldm}
                            />
                            <FormControlLabel
                              value="0"
                              control={<Radio size="small" />}
                              label={pricingText.freight?.calculationModes.weight}
                            />
                          </RadioGroup>
                        </FormControl>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={IsConsolidated}
                              onChange={(e) => handleFreightChange("IsConsolidated", e.target.checked)}
                            />
                          }
                          label={pricingText.freight.consolidated}
                          sx={{ alignSelf: "flex-start" }}
                        />
                      </Stack>
      </Paper>

    )
}