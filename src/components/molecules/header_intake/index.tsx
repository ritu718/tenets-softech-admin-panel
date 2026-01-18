import React from 'react'
import {
  Stack,
  Button,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useLanguage } from '@/hooks/useLanguage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Papa from "papaparse";
import { prepareDataIntake, prepareDataTariffs } from "@/utils/csvImportHelper";
import { sendShipmentData, sendShipperRates } from "@/dialogs/invoice_config/services";


function HeaderIntake() {
       const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
    const dispatch = useAppDispatch();
    const tariffFileInputRef = React.useRef<any>(null);
      const { localeText } = useLanguage();
    
      const pricingText = localeText.config.pricing;
const handleTariffImport = (file: any) => {
  if (!activeCarrierId || !file) return;

  Papa.parse(file, {
    delimiter: ";",
    skipEmptyLines: true,

    complete: async (result) => {
      try {
       
        const rows: any[] = result?.data||[];
        if (!rows.length) return;
         const reqObj: any = prepareDataIntake(rows,activeCarrierId);
       
        const resp = await sendShipmentData(reqObj, dispatch);
        // console.log("✅ POST RESPONSE", resp);

      } catch (err) {
        console.error("❌ CSV Import Error:", err);
      }
    },
  });
};


 

  const handleAdd = () => {
    alert("Add clicked");
  };

  const handleExport = () => {
    alert("Export clicked");
  };

  const handleClear = () => {
    alert("Clear clicked");
  };

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1} flexWrap="wrap">
      <Button
        onClick={handleAdd}
        startIcon={<AddCircleIcon />}
        variant="contained"
      >
        
        {localeText?.shipments?.buttons?.add}
      </Button>

     <Button
    
     
                          size="small"
                          startIcon={<UploadIcon />}
                          onClick={() => tariffFileInputRef.current?.click()}
                      
                        >
                          {pricingText.tariffs.importCsv}
                        </Button>

      <Button
        onClick={handleExport}
        startIcon={<DownloadIcon />}
        variant="outlined"
        
      >
        {localeText?.shipments?.buttons?.export}
      </Button>

      <Button
        onClick={handleClear}
        startIcon={<DeleteForeverIcon />}
        variant="outlined"
        color="error"
      >
        {localeText?.shipments?.buttons?.clear}
      </Button>
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
    </Stack>
    
  )
}

export default HeaderIntake;
