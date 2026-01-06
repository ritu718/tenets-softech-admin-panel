import React, {useRef } from "react";
import {
  Typography, 
  Button,
    Stack,
  Paper,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { NEBENKOSTEN_INITIAL_COUNTRIES } from "@/constants/common";
import Papa from "papaparse";
import { SHIPPER_RATES } from "@/data/dummy";
import { sendShipperRates } from "@/dialogs/invoice_config/services";
import { setCarrierConfigs } from "@/store/features/invoice_data/invoiceDataSlice";
import { createTariffBase, createTariffRow } from "@/utils/helper";


export default function TariffsImportExport() {
    const tariffFileInputRef = React.useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const dispatch = useAppDispatch();
   const { localeText } =useLanguage();
      const pricingText = localeText.config.pricing;
const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);

     const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
      const {tariffsCountryCodes, tariffsCountryIndex,tariffsData} = useAppSelector((state) => state.tariffs);
     
    const activeCarrier =
    carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
     const activeTariffCountryCode =
               tariffsCountryCodes[tariffsCountryIndex] ||
               tariffsCountryCodes[0] ||
               NEBENKOSTEN_INITIAL_COUNTRIES[0];
        const activeTariff =
          (activeCarrier && activeCarrier.tariffs?.byCountry?.[activeTariffCountryCode]) || null;

               
      
  const handleTariffExport = () => {
         
          const zones = activeTariff.zones || [];
          const header = [pricingText.tariffs.weightHeader, ...zones.map((z:any) => z.name || "")];
          const rows = (activeTariff.rows || []).map((row:any) => [
            row.weight,
            ...zones.map((z:any) => row.values[z.id] || ""),
          ]);
          const csv = Papa.unparse([header, ...rows]);
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", `tariffs-${activeTariffCountryCode}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
      
         const updateCarrier = (carrierId:any, updater:any) => {
                      dispatch(setCarrierConfigs( carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))
                    ))
                     };
     const handleTariffImport = (file:any) => {
      console.log("file: ", file);
      
            // if (!activeCarrier || !activeTariffCountryCode || !file) return;
            Papa.parse(file, {
              complete: (result) => {
                const rows:any = result.data;
                if (!rows || !rows.length) return;
                const [header, ...dataRows] = rows;

                console.log("rows: ",rows);
                
                // if (!header || header.length < 2) return;
                // const zoneHeaders = header.slice(1).map((h:any) => (h || "").toString().trim());

  const parsed:any = SHIPPER_RATES;
                parsed.projectId = activeCarrierId;
                
                        sendShipperRates(parsed,dispatch);
                // updateCarrier(activeCarrier.id, (carrier:any) => {
                //   const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
                //   const current =
                //     carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
                //   const existingZones = current.zones;
                //   const zones = [...existingZones];
                //   zoneHeaders.forEach((name:any) => {
                //     if (!name) return;
                //     if (!zones.some((z) => z.name === name)) {
                //       zones.push(createTariffZone({ name }, name));
                //     }
                //   });
                //   const rowsParsed = dataRows
                //     .filter((cells:any) => cells.some((c:any) => c !== null && c !== undefined && `${c}`.trim() !== ""))
                //     .map((cells:any) => {
                //       const weight = cells[0] ? String(cells[0]).trim() : "";
                //       const values:any = {};
                //       zones.forEach((zone, idx) => {
                //         const cellValue = cells[idx + 1] ?? "";
                //         values[zone.id] = cellValue;
                //       });
                //       return createTariffRow(zones, { weight, values });
                //     });
                //   return {
                //     ...carrier,
                //     tariffs: {
                //       countryCodes: codes,
                //       byCountry: {
                //         ...(carrier.tariffs?.byCountry || {}),
                //         [activeTariffCountryCode]: { ...current, zones, rows: rowsParsed },
                //       },
                //     },
                //   };
                // });
              },
            });
          };

              const handleTariffRowAdd = () => {
    if (!activeCarrier || !activeTariffCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
      const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(localeText);
      const zones = current.zones;
      const nextWeight = (() => {
        const weights = current.rows
          .map((r:any) => Number(r.weight))
          .filter((n:any) => !Number.isNaN(n))
          .sort((a:any, b:any) => a - b);
        if (!weights.length) return "";
        const last = weights[weights.length - 1];
        return String(last + 100);
      })();
      const newRow = createTariffRow(zones, { weight: nextWeight });
      return {
        ...carrier,
        tariffs: {
          countryCodes: codes,
          byCountry: {
            ...(carrier.tariffs?.byCountry || {}),
            [activeTariffCountryCode]: {
              ...current,
              rows: [...current.rows, newRow],
            },
          },
        },
      };
    });
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
