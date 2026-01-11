import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import React, {  useState } from "react";
import {  useAppDispatch } from "@/store/hooks";
import {
  setConfigDialogOpen
} from "@/store/features/invoice_data/invoiceDataSlice";
import { useLanguage } from "@/hooks/useLanguage";
import { setLanguage } from "@/store/features/languages/languagesSlice";
import { setToleranceDialogOpen } from "@/store/features/tolerances/TolerancesSlice";
import { LANGUAGE_FLAGS } from "@/constants/common";



const  InvoiceFilter= ()=> {
       const dispatch = useAppDispatch();
          const { localeText,language } =useLanguage();
    return(
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center"}}>
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>{localeText.languageLabel}</InputLabel>
                    <Select
                      value={language}
                      label={localeText.languageLabel}
                      onChange={(event : any) => {
                      
                        dispatch( setLanguage(event.target.value)) }}
                      renderValue={(value : any) =>
                        value ? `${LANGUAGE_FLAGS[value]} ${localeText.languageOptions[value]}` : localeText.languageLabel
                      }
                    >
                      {Object.keys(localeText.languageOptions).map((code) => (
                        <MenuItem value={code} key={code}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>{LANGUAGE_FLAGS[code]}</Typography>
                            <Typography>{localeText.languageOptions[code]}</Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={() =>dispatch( setConfigDialogOpen(true))}>
                    {localeText.header.config}
                  </Button>
                  <Button variant="outlined" onClick={() => dispatch(setToleranceDialogOpen(true))}>
                    {localeText.header.tolerance}
                  </Button>
                 
                </Box>
    )
}


 export default React.memo(InvoiceFilter);