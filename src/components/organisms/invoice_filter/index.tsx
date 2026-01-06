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
import Papa from "papaparse";
import {  useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setConfigDialogOpen
} from "@/store/features/invoice_data/invoiceDataSlice";
import { useLanguage } from "@/hooks/useLanguage";
import { setLanguage } from "@/store/features/languages/languagesSlice";
import { setToleranceDialogOpen } from "@/store/features/tolerances/tolerancesDataSlice";

const LANGUAGE_FLAGS : any = {
  de: "🇩🇪",
  en: "🇬🇧",
};


export default function InvoiceFilter () {
    
       const dispatch = useAppDispatch();
    
        // const [toleranceDialogOpen, setToleranceDialogOpen] = useState(false);
        const [selectedInvoice, setSelectedInvoice] = useState(null);
        const [details, setDetails] = useState([]);
          
           

   const filteredOverview = useAppSelector((state) => state.invoiceData.filteredOverview);
    
          const { localeText,language } =useLanguage();

        


         const exportCsv = () => {
            const csv = Papa.unparse(
              (selectedInvoice ? details : filteredOverview).map((row : any) => ({
                ...(selectedInvoice
                  ? {
                      sendungsID: row.sendungsID,
                      spedition: row.spedition,
                      nebenkosten:
                        typeof row.nebenkostenTotal === "number"
                          ? row.nebenkostenTotal.toFixed(2)
                          : "",
                      auftrags_summe: row.preis1.toFixed(2),
                      rechnungs_summe: row.preis2.toFixed(2),
                      differenz: row.differenz.toFixed(2),
                    }
                  : {
                      rechnungsnummer: row.rechnungsnummer,
                      projekt_id: row.projekt_id || "",
                      rechnungsdatum: row.datum || "",
                      spedition: row.spedition,
                      auftrags_summe: row.preis1.toFixed(2),
                      rechnungs_summe: row.preis2.toFixed(2),
                      differenz: row.differenz.toFixed(2),
                    }),
              }))
            );
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", selectedInvoice ? "rechnungsdetails.csv" : "rechnungsuebersicht.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };
    return(
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center"}}>
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>{localeText.languageLabel}</InputLabel>
                    <Select
                      value={language}
                      label={localeText.languageLabel}
                      onChange={(event : any) => dispatch( setLanguage(event.target.value)) }
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
                  {!selectedInvoice && (
                    <Button variant="outlined" onClick={exportCsv}>
                      {localeText.header.export}
                    </Button>
                  )}
                </Box>
    )
}
