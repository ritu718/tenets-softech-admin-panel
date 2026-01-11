import React from "react";
import {
  Typography, 
  Button,
    Stack,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import Papa from "papaparse";
import { sendShipperRates } from "@/dialogs/invoice_config/services";
import {  insertNewWeight } from "@/utils/helper";
import { prepareDataTariffs } from "@/utils/csvImportHelper";
import { revertTariffsToCSV } from "@/utils/csvExportHelper";
import { setTariffsData } from "@/store/features/tariffs/TariffsSlice";


export default function TariffsImportExport() {
    const tariffFileInputRef = React.useRef<any>(null);

  const dispatch = useAppDispatch();
   const { localeText } =useLanguage();
      const pricingText = localeText.config.pricing;
     const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
      const {tariffsCountryCodes, tariffsCountryIndex,tariffsData} = useAppSelector((state) => state.tariffs);
     
    const activeTariffCountryCode =tariffsCountryCodes[tariffsCountryIndex];
      const handleTariffExport = () => {
        if(tariffsData?.rates){
        
       const rowsData=   revertTariffsToCSV(activeTariffCountryCode,tariffsData?.rates||{});
          const csv = Papa.unparse(rowsData);
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", `${activeTariffCountryCode} - Tarif - Zonen.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        };
      
        
    const handleTariffImport = (file: any) => {
  if (!activeCarrierId || !file) return;

  Papa.parse(file, {
    delimiter: ";",
    skipEmptyLines: true,

    complete: async (result) => {
      try {
       
        const rows: any[] = result?.data||[];
        if (!rows.length) return;
         const rates: any = prepareDataTariffs(rows);
        const payload = {
          projectId: activeCarrierId,
          rates
        };
        const resp = await sendShipperRates(payload, dispatch);
        console.log("✅ POST RESPONSE", resp);

      } catch (err) {
        console.error("❌ CSV Import Error:", err);
      }
    },
  });
};

              const handleTariffRowAdd = () => {
    if (!activeCarrierId || !activeTariffCountryCode) return;

    const updatedData = {
  ...tariffsData,
  rates: {
    ...tariffsData.rates,
    [activeTariffCountryCode]: {
      ...tariffsData.rates[activeTariffCountryCode],
      Weights:insertNewWeight(tariffsData.rates[activeTariffCountryCode].Weights)
    }
  }
};
dispatch(setTariffsData(updatedData));
  
              };

       


  return (
    <>
     <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 1 }} spacing={1}>
                      <Typography variant="subtitle1">{pricingText.tariffs.title}</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Button size="small" startIcon={<DownloadIcon />} onClick={handleTariffExport}>
                          {pricingText.tariffs.exportCsv}
                        </Button>
                        <Button
                          size="small"
                          startIcon={<UploadIcon />}
                          onClick={() => tariffFileInputRef.current?.click()}
                        >
                          {pricingText.tariffs.importCsv}
                        </Button>
                        <Button size="small" startIcon={<AddCircleIcon />} onClick={handleTariffRowAdd}>
                          {pricingText.tariffs.addRow}
                        </Button>
                      </Stack>
                    </Stack>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      ref={tariffFileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleTariffImport(file);
                        e.target.value = "";
                      }}
                    />
     </>
  )
}
