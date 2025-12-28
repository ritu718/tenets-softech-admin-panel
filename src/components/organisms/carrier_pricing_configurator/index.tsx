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
import { deleteCarrierDataToServer } from "@/dialogs/invoice_config/services";


 
 
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

      //     const next = carriers.filter((carrier:any) => carrier.id !== carrierId);
      //         if (activeCarrierId === carrierId) {
      //           dispatch(setActiveCarrierId( next[0]?.id || null))
      // }
      console.log("carrierId: handleRemoveCarrier: ",carrierId);
      
deleteCarrierDataToServer({projectId: carrierId},dispatch)
    // dispatch(setCarrierConfigs(next))
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