import React, {useRef } from "react";
import {
  Typography, 
  Button,
    Stack,
  Paper,
} from "@mui/material";
import Papa from "papaparse";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCarrierDataToServer,  sendShipperFreightCalc } from "@/dialogs/invoice_config/services";

import { cleanString, isEmpty } from "@/utils/helper";
import { prepareDataFreightBasis } from "@/utils/csvImportHelper";
import { NEBENKOSTEN_INITIAL_COUNTRIES } from "@/constants/common";

export default function FreightBasisImportExport() {
  const fileInputRef = useRef<any>(null);
  const dispatch = useAppDispatch();
   const { localeText } =useLanguage();
      const pricingText = localeText.config.pricing;
const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
     const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
    const activeCarrier =
    carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
const {freightCountryCodes, freightCountryIndex,freightBasisData} = useAppSelector((state) => state.freightBasis);
       
 const activeFreightCountryCodes =
               freightCountryCodes[freightCountryIndex] ||
               freightCountryCodes[0] ||
               NEBENKOSTEN_INITIAL_COUNTRIES [0];

        const exportFreight = () => {
    if (!activeCarrier) return;
    const data = JSON.stringify({ freight: activeCarrier.freight }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activeCarrier.name || "freight"}-freight.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
     const handleRemoveCarrier = (carrierId:any) => {
    deleteCarrierDataToServer({projectId: carrierId},dispatch,carriers)
      };


const handleFreightBasisImport = (file: any) => {
  if (!activeCarrierId || !file) return;

  Papa.parse(file, {
    delimiter: ";",
    skipEmptyLines: true,

    complete: async (result) => {
      try {
       
        const rows: any[] = result?.data||[];
        if (!rows.length) return;
        await sendShipperFreightCalc( prepareDataFreightBasis(rows,activeFreightCountryCodes,activeCarrierId), dispatch);
        
      } catch (err) {
        console.error("❌ CSV Import Error:", err);
      }
    },
  });
};

  return (
    <>
     <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1}>
                    <Typography variant="subtitle1">{pricingText.freight.title}</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button size="small" startIcon={<DownloadIcon />} onClick={exportFreight}>
                        {pricingText.freight.export}
                      </Button>
                      <Button
                        size="small"
                        startIcon={<UploadIcon />}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {pricingText.freight.import}
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => handleRemoveCarrier(activeCarrier.id)}
                      >
                        {pricingText.actions.removeCarrier}
                      </Button>
                    </Stack>
                  </Stack>
                  <input
                    type="file"
                    accept=".csv,text/csv/json"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFreightBasisImport(file);
                        e.target.value = "";
                      }}
                 
                  /></>
  )
}
