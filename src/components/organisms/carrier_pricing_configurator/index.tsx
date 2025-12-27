import React, {  useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  
  TableHead,
  TableBody,
  TableRow,
  TableCell,
 
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,

  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import Papa from "papaparse";
import { BASE_COUNTRY_OPTIONS } from "@/constants/data";
import { NEBENKOSTEN_INITIAL_COUNTRIES } from "@/constants/common";
import { buildDefaultMinWeights, createCarrierConfig, createFreightBase, createMinWeightRow, createSurchargeBase, createSurchargeRow, createTariffBase, createTariffRow, createTariffZone, makeId } from "@/utils/helper";
import InvoiceSpedition from "@/dialogs/invoice_spedition";
import { useLanguage } from "@/hooks/useLanguage";
import AddCarrier from "@/components/molecules/add_carrier";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
 import {
  setCarrierConfigs
} from "@/store/features/invoice_data/invoiceDataSlice";
import KonfiguratorRadioButton from "../konfiguration_radio_button";
import KonfigurationMeterFirst from "../konfiguration_meter1";
import KonfigurationLandMeter2 from "../konfiguration _0ptionen_landmeter";
import KonfigrationTable1 from "../carrier_pricing_Minimum_weight";
import KonfigTable1Extra from "../carrier_pricing_addition_minimum_weight";
import CarrierPricingTariffs from "../carrier_pricing_tariffs";
import CarrierPricingSurcharges from "../carrier_pricing_surcharges";
import CarrierPricingMinimumWeight from "../carrier_pricing_Minimum_weight";
import CarrierPricingAdditionMinimumWeight from "../carrier_pricing_addition_minimum_weight";
import { setActiveCarrierId } from "@/store/features/carrier/carriersSlice";

 
 
 const CarrierPricingConfigurator = ({
  countryOptions,
}:any) => {
 const { localeText: text } =useLanguage();
  const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
       const dispatch = useAppDispatch();
      const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);

  const pricingText = text.config.pricing;
  const [newCarrierName, setNewCarrierName] = useState("");
  const [addCarrierDialogOpen, setAddCarrierDialogOpen] = useState(false);
  const [newCarrierForm, setNewCarrierForm] = useState({
    name: "",
    street: "",
    houseNumber: "",
    zip: "",
    city: "",
    country: "",
    contact: "",
    phone: "",
    email: "",
    customerNumber: "",
  });
  const fileInputRef = React.useRef<any>(null);
  const surchargeFileInputRef = React.useRef<any>(null);
  const tariffFileInputRef = React.useRef<any>(null);
  const [selectedCountryOption, setSelectedCountryOption] = useState("");
  const resolvedCountryOptions =
    countryOptions && countryOptions.length
      ? countryOptions
      : BASE_COUNTRY_OPTIONS.map((option:any) => ({
          ...option,
          label: option.code,
        }));
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

  useEffect(() => {
    setFreightCountryIndex(0);
  }, [activeCarrierId]);
  useEffect(() => {
    if (freightCountryIndex > freightCountryCodes.length - 1) {
      setFreightCountryIndex(Math.max(freightCountryCodes.length - 1, 0));
    }
  }, [freightCountryCodes.length, freightCountryIndex]);
  useEffect(() => {
    setTariffCountryIndex(0);
  }, [activeCarrierId]);
  useEffect(() => {
    if (tariffCountryIndex > tariffCountryCodes.length - 1) {
      setTariffCountryIndex(Math.max(tariffCountryCodes.length - 1, 0));
    }
  }, [tariffCountryCodes.length, tariffCountryIndex]);
  useEffect(() => {
    setSurchargeCountryIndex(0);
  }, [activeCarrierId]);
  useEffect(() => {
    if (surchargeCountryIndex > surchargeCountryCodes.length - 1) {
      setSurchargeCountryIndex(Math.max(surchargeCountryCodes.length - 1, 0));
    }
  }, [surchargeCountryCodes.length, surchargeCountryIndex]);

  const updateCarrier = (carrierId:any, updater:any) => {
    
        dispatch(setCarrierConfigs(   carriers.map((carrier:any) => (carrier.id === carrierId ? updater(carrier) : carrier))
))
    
  };

  const handleAddCarrier = () => {
    const defaultLabel = `${pricingText.defaults.newCarrierName} ${carriers.length + 1}`;
    setNewCarrierForm((prev) => ({
      ...prev,
      name: prev.name || newCarrierName.trim() || defaultLabel,
    }));
    setAddCarrierDialogOpen(true);
  }

  const handleRemoveCarrier = (carrierId:any) => {

          const next = carriers.filter((carrier:any) => carrier.id !== carrierId);
              if (activeCarrierId === carrierId) {
                dispatch(setActiveCarrierId( next[0]?.id || null))
      }

    dispatch(setCarrierConfigs(next))
  };

  const handleAddCountry = (code:any) => {
    if (!activeCarrier || !code) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const countryCodes = carrier.freight?.countryCodes || [];
      if (countryCodes.includes(code)) return carrier;
      const byCountry = {
        ...(carrier.freight?.byCountry || {}),
        [code]: createFreightBase(text),
      };
      return {
        ...carrier,
        freight: {
          ...(carrier.freight || {}),
          countryCodes: [...countryCodes, code],
          byCountry,
        },
      };
    });
    setFreightCountryIndex((prev) => prev + 1);
  };

  const handleRemoveCountry = (index:any) => {
    if (!activeCarrier) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.freight?.countryCodes || [];
      if (codes.length <= 1) return carrier;
      const removeCode = codes[index];
      const nextCodes = codes.filter((_:any, idx:any) => idx !== index);
      const nextByCountry = { ...(carrier.freight?.byCountry || {}) };
      delete nextByCountry[removeCode];
      const nextCarrier = {
        ...carrier,
        freight: {
          ...(carrier.freight || {}),
          countryCodes: nextCodes,
          byCountry: nextByCountry,
        },
      };
      if (freightCountryIndex >= nextCodes.length) {
        setFreightCountryIndex(Math.max(nextCodes.length - 1, 0));
      }
      return nextCarrier;
    });
  };

  const handleTariffCountryAdd = (code:any) => {
    if (!activeCarrier || !code) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const countryCodes = carrier.tariffs?.countryCodes || [];
      if (countryCodes.includes(code)) return carrier;
      const byCountry = {
        ...(carrier.tariffs?.byCountry || {}),
        [code]: createTariffBase(text),
      };
      return {
        ...carrier,
        tariffs: {
          countryCodes: [...countryCodes, code],
          byCountry,
        },
      };
    });
    setTariffCountryIndex((prev) => prev + 1);
  };

  const handleTariffCountryRemove = (index:any) => {
    if (!activeCarrier) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.tariffs?.countryCodes || [];
      if (codes.length <= 1) return carrier;
      const removeCode = codes[index];
      const nextCodes = codes.filter((_:any, idx:any) => idx !== index);
      const nextByCountry = { ...(carrier.tariffs?.byCountry || {}) };
      delete nextByCountry[removeCode];
      const nextCarrier = {
        ...carrier,
        tariffs: {
          countryCodes: nextCodes,
          byCountry: nextByCountry,
        },
      };
      if (tariffCountryIndex >= nextCodes.length) {
        setTariffCountryIndex(Math.max(nextCodes.length - 1, 0));
      }
      return nextCarrier;
    });
  };

  const handleTariffBaseChange = (field:any, value:any) => {
    if (!activeCarrier || !activeTariffCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
      const baseTariff =
        carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
      return {
        ...carrier,
        tariffs: {
          countryCodes: codes,
          byCountry: {
            ...(carrier.tariffs?.byCountry || {}),
            [activeTariffCountryCode]: { ...baseTariff, [field]: value },
          },
        },
      };
    });
  };

  const handleZoneChange = (zoneId:any, field:any, value:any) => {
    if (!activeCarrier || !activeTariffCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
      const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
      const zones = current.zones.map((zone:any) =>
        zone.id === zoneId ? { ...zone, [field]: value } : zone
      );
      const rows = current.rows.map((row:any) => ({
        ...row,
        values: zones.reduce((acc:any, zone:any) => {
          acc[zone.id] = row.values[zone.id] || "";
          return acc;
        }, {}),
      }));
      return {
        ...carrier,
        tariffs: {
          countryCodes: codes,
          byCountry: {
            ...(carrier.tariffs?.byCountry || {}),
            [activeTariffCountryCode]: { ...current, zones, rows },
          },
        },
      };
    });
  };

  const handleZoneAdd = () => {
    if (!activeCarrier || !activeTariffCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
      const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
      const newZone = createTariffZone({}, `Zone ${current.zones.length + 1}`);
      const zones = [...current.zones, newZone];
      const rows = current.rows.map((row:any) => ({
        ...row,
        values: { ...row.values, [newZone.id]: "" },
      }));
      return {
        ...carrier,
        tariffs: {
          countryCodes: codes,
          byCountry: {
            ...(carrier.tariffs?.byCountry || {}),
            [activeTariffCountryCode]: { ...current, zones, rows },
          },
        },
      };
    });
  };

  const handleZoneRemove = (zoneId:any) => {
    if (!activeCarrier || !activeTariffCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
      const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
      if (current.zones.length <= 1) return carrier;
      const zones = current.zones.filter((zone:any) => zone.id !== zoneId);
      const rows = current.rows.map((row:any) => {
        const nextValues = { ...row.values };
        delete nextValues[zoneId];
        return { ...row, values: nextValues };
      });
      return {
        ...carrier,
        tariffs: {
          countryCodes: codes,
          byCountry: {
            ...(carrier.tariffs?.byCountry || {}),
            [activeTariffCountryCode]: { ...current, zones, rows },
          },
        },
      };
    });
  };

  const handleTariffRowChange = (rowId:any, field:any, value:any, zoneId:any = null) => {
    if (!activeCarrier || !activeTariffCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
      const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
      const rows = current.rows.map((row:any) => {
        if (row.id !== rowId) return row;
        if (zoneId) {
          return { ...row, values: { ...row.values, [zoneId]: value } };
        }
        return { ...row, [field]: value };
      });
      return {
        ...carrier,
        tariffs: {
          countryCodes: codes,
          byCountry: {
            ...(carrier.tariffs?.byCountry || {}),
            [activeTariffCountryCode]: { ...current, rows },
          },
        },
      };
    });
  };

  const handleTariffRowAdd = () => {
    if (!activeCarrier || !activeTariffCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
      const current = carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
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

  const handleTariffImport = (file:any) => {
    if (!activeCarrier || !activeTariffCountryCode || !file) return;
    Papa.parse(file, {
      complete: (result) => {
        const rows:any = result.data;
        if (!rows || !rows.length) return;
        const [header, ...dataRows] = rows;
        if (!header || header.length < 2) return;
        const zoneHeaders = header.slice(1).map((h:any) => (h || "").toString().trim());
        updateCarrier(activeCarrier.id, (carrier:any) => {
          const codes = carrier.tariffs?.countryCodes || [activeTariffCountryCode];
          const current =
            carrier.tariffs?.byCountry?.[activeTariffCountryCode] || createTariffBase(text);
          const existingZones = current.zones;
          const zones = [...existingZones];
          zoneHeaders.forEach((name:any) => {
            if (!name) return;
            if (!zones.some((z) => z.name === name)) {
              zones.push(createTariffZone({ name }, name));
            }
          });
          const rowsParsed = dataRows
            .filter((cells:any) => cells.some((c:any) => c !== null && c !== undefined && `${c}`.trim() !== ""))
            .map((cells:any) => {
              const weight = cells[0] ? String(cells[0]).trim() : "";
              const values:any = {};
              zones.forEach((zone, idx) => {
                const cellValue = cells[idx + 1] ?? "";
                values[zone.id] = cellValue;
              });
              return createTariffRow(zones, { weight, values });
            });
          return {
            ...carrier,
            tariffs: {
              countryCodes: codes,
              byCountry: {
                ...(carrier.tariffs?.byCountry || {}),
                [activeTariffCountryCode]: { ...current, zones, rows: rowsParsed },
              },
            },
          };
        });
      },
    });
  };

  const handleTariffExport = () => {
    if (!activeCarrier || !activeTariffCountryCode || !activeTariff) return;
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

  const handleSurchargeCountryAdd = (code:any) => {
    if (!activeCarrier || !code) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const countryCodes = carrier.surcharges?.countryCodes || [];
      if (countryCodes.includes(code)) return carrier;
      const byCountry = {
        ...(carrier.surcharges?.byCountry || {}),
        [code]: createSurchargeBase(text),
      };
      return {
        ...carrier,
        surcharges: {
          countryCodes: [...countryCodes, code],
          byCountry,
        },
      };
    });
    setSurchargeCountryIndex((prev) => prev + 1);
  };

  const handleSurchargeCountryRemove = (index:any) => {
    if (!activeCarrier) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.surcharges?.countryCodes || [];
      if (codes.length <= 1) return carrier;
      const removeCode = codes[index];
      const nextCodes = codes.filter((_:any, idx:any) => idx !== index);
      const nextByCountry = { ...(carrier.surcharges?.byCountry || {}) };
      delete nextByCountry[removeCode];
      const nextCarrier = {
        ...carrier,
        surcharges: {
          countryCodes: nextCodes,
          byCountry: nextByCountry,
        },
      };
      if (surchargeCountryIndex >= nextCodes.length) {
        setSurchargeCountryIndex(Math.max(nextCodes.length - 1, 0));
      }
      return nextCarrier;
    });
  };

  const handleSurchargeRowChange = (rowId:any, field:any, value:any) => {
    if (!activeCarrier || !activeSurchargeCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.surcharges?.countryCodes || [activeSurchargeCountryCode];
      const current =
        carrier.surcharges?.byCountry?.[activeSurchargeCountryCode] || createSurchargeBase(text);
      const rows = current.rows.map((row:any) =>
        row.id === rowId ? { ...row, [field]: value } : row
      );
      return {
        ...carrier,
        surcharges: {
          countryCodes: codes,
          byCountry: {
            ...(carrier.surcharges?.byCountry || {}),
            [activeSurchargeCountryCode]: { ...current, rows },
          },
        },
      };
    });
  };

  const handleSurchargeAdd = () => {
    if (!activeCarrier || !activeSurchargeCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.surcharges?.countryCodes || [activeSurchargeCountryCode];
      const current =
        carrier.surcharges?.byCountry?.[activeSurchargeCountryCode] || createSurchargeBase(text);
      const rows = [...(current.rows || []), createSurchargeRow(text, { unit: "€" })];
      return {
        ...carrier,
        surcharges: {
          countryCodes: codes,
          byCountry: {
            ...(carrier.surcharges?.byCountry || {}),
            [activeSurchargeCountryCode]: { ...current, rows },
          },
        },
      };
    });
  };

  const handleSurchargeRemove = (rowId:any) => {
    if (!activeCarrier || !activeSurchargeCountryCode) return;
    updateCarrier(activeCarrier.id, (carrier:any) => {
      const codes = carrier.surcharges?.countryCodes || [activeSurchargeCountryCode];
      const current =
        carrier.surcharges?.byCountry?.[activeSurchargeCountryCode] || createSurchargeBase(text);
      const rows = current.rows.filter((row:any) => row.id !== rowId);
      return {
        ...carrier,
        surcharges: {
          countryCodes: codes,
          byCountry: {
            ...(carrier.surcharges?.byCountry || {}),
            [activeSurchargeCountryCode]: { ...current, rows: rows.length ? rows : [createSurchargeRow(text)] },
          },
        },
      };
    });
  };

  const handleSurchargeImport = (file:any) => {
    if (!activeCarrier || !activeSurchargeCountryCode || !file) return;
    Papa.parse(file, {
      complete: (result) => {
        const rows:any = result.data;
        if (!rows || !rows.length) return;
        const [header, ...dataRows] = rows;
        if (!header) return;
        const columns = header.map((h:any) => (h || "").toString().trim().toLowerCase());
        const labelIdx = columns.findIndex((c:any) => c.includes("label") || c.includes("bezeichnung"));
        const amountIdx = columns.findIndex((c:any) => c.includes("amount") || c.includes("wert") || c === "");
        const unitIdx = columns.findIndex((c:any) => c.includes("unit") || c.includes("einheit"));
        const descIdx = columns.findIndex((c:any) => c.includes("desc"));
        const rowsParsed = dataRows
          .filter((cells:any) => cells.some((c:any) => c !== null && c !== undefined && `${c}`.trim() !== ""))
          .map((cells:any) =>
            createSurchargeRow(text, {
              label: labelIdx >= 0 ? cells[labelIdx] : cells[0],
              amount: amountIdx >= 0 ? cells[amountIdx] : cells[1],
              unit: unitIdx >= 0 ? cells[unitIdx] : "€",
              description: descIdx >= 0 ? cells[descIdx] : "",
            })
          );
        updateCarrier(activeCarrier.id, (carrier:any) => {
          const codes = carrier.surcharges?.countryCodes || [activeSurchargeCountryCode];
          const current =
            carrier.surcharges?.byCountry?.[activeSurchargeCountryCode] || createSurchargeBase(text);
          return {
            ...carrier,
            surcharges: {
              countryCodes: codes,
              byCountry: {
                ...(carrier.surcharges?.byCountry || {}),
                [activeSurchargeCountryCode]: { ...current, rows: rowsParsed },
              },
            },
          };
        });
      },
    });
  };

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

  const handleImportFile = (event:any) => {
    const file = event.target.files?.[0];
    if (!file || !activeCarrier) return;
    const reader:any = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.freight || typeof parsed.freight !== "object") return;
        const parsedFreight = parsed.freight;
        const baseFreight = activeCarrier.freight || {};
        const countryCodes =
          parsedFreight.countryCodes || baseFreight.countryCodes || NEBENKOSTEN_INITIAL_COUNTRIES;
        const parsedByCountry = parsedFreight.byCountry || {};
        const baseByCountry = baseFreight.byCountry || {};
        const byCountry:any = {};
        countryCodes.forEach((code:any) => {
          const source =
            parsedByCountry[code] || baseByCountry[code] || parsedFreight || createFreightBase(text);
          byCountry[code] = createFreightBase(text, source);
        });

        updateCarrier(activeCarrier.id, (carrier:any) => ({
          ...carrier,
          freight: {
            countryCodes,
            byCountry,
          },
        }));
      } catch (err) {
        // silent fail; in real app surface toast
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {pricingText.intro}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {pricingText.sharedInputNote}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
     <AddCarrier 
     handleAddCarrier={handleAddCarrier}
     activeCarrierId={activeCarrierId}
     resolvedCountryOptions={resolvedCountryOptions}
     />

         <InvoiceSpedition 
  activeCarrierId={activeCarrierId}
  countryOptions={countryOptions}
    addCarrierDialogOpen={addCarrierDialogOpen}
     setAddCarrierDialogOpen={setAddCarrierDialogOpen}
    
    />
        
      
      </Stack>

      
     

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {carriers.map((carrier:any) => {
          const isActive = carrier.id === activeCarrier?.id;
          return (
            <Chip
              key={carrier.id}
              label={carrier.name}
              color={isActive ? "primary" : "default"}
              variant={isActive ? "filled" : "outlined"}
              onClick={() =>   dispatch(setActiveCarrierId( carrier.id)) }
              onDelete={() => handleRemoveCarrier(carrier.id)}
              deleteIcon={<DeleteOutlineIcon />}
            />
          );
        })}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {pricingText.chipsHelp}
      </Typography>

      {activeCarrier ? (
        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={2}>
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
                accept="application/json"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImportFile}
              />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{pricingText.freight.countryTitle}</Typography>
                <Tabs
                  value={Math.min(freightCountryIndex, freightCountryCodes.length - 1)}
                  onChange={(_, value) => setFreightCountryIndex(value)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  {freightCountryCodes.map((code:any, index:any) => (
                    <Tab
                      key={`${code}-${index}`}
                      value={index}
                      label={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">
                            {getFlag(code)} {code}
                          </Typography>
                          {freightCountryCodes.length > 1 && (
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleRemoveCountry(index);
                              }}
                            >
                              <DeleteOutlineIcon fontSize="inherit" />
                            </IconButton>
                          )}
                        </Stack>
                      }
                    />
                  ))}
                </Tabs>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel>{pricingText.freight.countryAddLabel}</InputLabel>
                    <Select
                      value={selectedCountryOption}
                      label={pricingText.freight.countryAddLabel}
                      onChange={(e) => {
                        setSelectedCountryOption(e.target.value);
                        handleAddCountry(e.target.value);
                      }}
                    >
                      <MenuItem value="">{pricingText.freight.countryPlaceholder}</MenuItem>
                      {availableCountryOptions.map((option:any) => (
                        <MenuItem key={option.code} value={option.code}>
                          {option.flag} {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: "grey.50" }}>
                
                < KonfiguratorRadioButton
                text={text}
               pricingText={pricingText}
      activeCarrierId={activeCarrierId}
      countryOptions={countryOptions}
                />
              </Paper>
              < KonfigurationMeterFirst
               text={text}
               pricingText={pricingText}
      activeCarrierId={activeCarrierId}
      countryOptions={countryOptions}
             />

             < KonfigurationLandMeter2
              text={text}
               pricingText={pricingText}
      activeCarrierId={activeCarrierId}
      countryOptions={countryOptions}/>



                  <CarrierPricingMinimumWeight
              text={text}
               carriers={carriers}
  activeCarrierId={activeCarrierId}
 countryOptions ={countryOptions}
              />
         
                <CarrierPricingAdditionMinimumWeight
              text={text}
                carriers={carriers}
                     activeCarrierId={activeCarrierId}
                   countryOptions ={countryOptions}/>

            </Stack>
          </Paper>
          
             <CarrierPricingTariffs
               activeCarrierId={activeCarrierId}
                  countryOptions ={countryOptions}
              />
      
        <CarrierPricingSurcharges
               activeCarrierId ={activeCarrierId}
               countryOptions = {countryOptions}
            
            />

        </Stack>
      ) : (
        <Typography variant="body2">{pricingText.empty}</Typography>
      )}
    </Stack>
  );
};


export default CarrierPricingConfigurator;