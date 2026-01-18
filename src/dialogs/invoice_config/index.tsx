import React, {  useEffect, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  Tabs,
  Tab,
  Button,

} from "@mui/material";
import { useLanguage } from '@/hooks/useLanguage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
 import {
  setConfigDialogOpen
} from "@/store/features/invoice_data/invoiceDataSlice";
import CarrierPricingConfigurator from '@/components/organisms/carrier_pricing_configurator';

import { buildCountryOptions, buildNebenkostenPresets, buildShipmentSampleRows, buildShipmentSummaryItems, isEmpty } from '@/utils/helper';

import PriceCheckPreview from '@/components/organisms/price_check_preview';
import NebenkostenPreview from '@/components/organisms/nebenkosten_preview/NebenkostenPreview';

import {   getConfigDataAccoToSelCarrier, getShipmentData, getShipmentSummary } from './services';
import { setActiveCarrierId } from '@/store/features/carrier/carriersSlice';
import { setActiveConfigTab } from '@/store/features/shipment_data/shipmentDataSlice';
import AuftragsdatenPreview from '@/components/organisms/auftragsdaten_preview';



const buildPlaceholderConfigSections = (text:any) => {
  const sections = text.configSections;
  return [
    { key: "pricing", ...sections.pricing },
    { key: "auftragsdaten", ...sections.auftragsdaten },
    { key: "price-check", ...sections.reconciliation },
  ];
};



const  InvoiceConfig = () => {
 const { localeText,language } =useLanguage();
     const dispatch = useAppDispatch();
        
      const configDialogOpen = useAppSelector((state) => state.invoiceData.configDialogOpen);
      const carrierConfigs = useAppSelector((state) => state.invoiceData.carrierConfigs);
    const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
  const activeConfigTab = useAppSelector((state) => state.shipmentData.activeConfigTab);
  const placeholderSections = useMemo(
    () => buildPlaceholderConfigSections(localeText),
    [localeText]
  );
 
   const activeConfigSection = useMemo(
    () =>
      placeholderSections.find((section) => section.key === activeConfigTab) ||
      placeholderSections[0],
    [placeholderSections, activeConfigTab]
  );

 const [priceFixDialog, setPriceFixDialog] = useState({
    open: false,
    shipment: null,
    carrier: null,
    error: null,
    countryCode: "DE",
  });
 
  const countryOptions = useMemo(() => buildCountryOptions(localeText), [localeText]);
  const shipmentRows = useMemo(
    () => buildShipmentSampleRows(language),
    [language]
  );
  const nebPresets = useMemo(() => buildNebenkostenPresets(localeText), [localeText]);
  
  const [priceCheckOverrides, setPriceCheckOverrides] = useState({});
  const shipmentSummaryItems = useMemo(
    () => buildShipmentSummaryItems(localeText),
    [localeText]
  );

  useEffect(()=>{
    if (configDialogOpen&&!isEmpty(activeCarrierId)) {
       getConfigDataAccoToSelCarrier({projectId:activeCarrierId},dispatch)
    }  
  },[configDialogOpen,activeCarrierId]);



    useEffect(() => {
     if(configDialogOpen)
     {
      if (!carrierConfigs.length) {
        dispatch(setActiveCarrierId( null))
        return;
      }
     if (!activeCarrierId || !carrierConfigs.some((carrier:any) => carrier.id === activeCarrierId)) {       
        dispatch(setActiveCarrierId(carrierConfigs[0]?.id));
      }
    }
    }, [configDialogOpen,carrierConfigs, activeCarrierId]);


   const onTabChange = (_: any, value: any) => {
  dispatch(setActiveConfigTab(value));
 
  if (value === "price-check") {
    getShipmentSummary({ projectId: activeCarrierId }, dispatch);
  } 
  else if (value === "auftragsdaten") {
    getShipmentData({ projectId: activeCarrierId }, dispatch);
  }
};

  return (
    
      <Dialog
            open={configDialogOpen}
            onClose={() => dispatch(setConfigDialogOpen(false))}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle>{localeText.config.dialogTitle}</DialogTitle>
            <DialogContent dividers>
              <Tabs
                value={activeConfigTab}
                onChange={onTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
              >
                {placeholderSections.map((section) => (
                  <Tab key={section.key} label={section.title} value={section.key} />
                ))}
              </Tabs>
              {activeConfigSection ? (
                <Stack spacing={2}>
                  <Typography variant="h6">{activeConfigSection.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activeConfigSection.description}
                  </Typography>
                  {activeConfigSection.key === "pricing" ? (
                    <CarrierPricingConfigurator />
                  ) : activeConfigSection.key === "price-check" ? (
                   
                    <PriceCheckPreview
                      text={localeText}
                      shipmentRows={shipmentRows}
                      overrides={priceCheckOverrides}
                      onFixIssue={({ shipment, carrier, error }:any) =>
                        setPriceFixDialog({
                          open: true,
                          shipment,
                          carrier,
                          error,
                          countryCode: "DE",
                        })
                      }
                    />
                  ) : activeConfigSection.key === "nebenkosten" ? (
                    <>
                      <NebenkostenPreview
                        text={localeText}
                        presets={nebPresets}
                        countryOptions={countryOptions}
                      />
                      <Button variant="contained" disabled sx={{ alignSelf: "flex-start" }}>
                        {activeConfigSection.actionLabel}
                      </Button>
                    </>
                  ) : activeConfigSection.key === "auftragsdaten" ? (
                    <>
                      <AuftragsdatenPreview
                        text={localeText}
                        summaryItems={shipmentSummaryItems}
                        shipmentRows={shipmentRows}
                      />
                      <Button variant="contained" disabled sx={{ alignSelf: "flex-start" }}>
                        {activeConfigSection.actionLabel}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, borderStyle: "dashed", borderRadius: 2 }}
                      >
                        <Stack spacing={1}>
                          {activeConfigSection.placeholders.map((item:any) => (
                            <Box
                              key={`${activeConfigSection.key}-${item.label}`}
                              sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                                p: 1.25,
                                bgcolor: "grey.50",
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                {item.label}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.value}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Paper>
                      <Button variant="contained" disabled sx={{ alignSelf: "flex-start" }}>
                        {activeConfigSection.actionLabel}
                      </Button>
                    </>
                  )}
                  {activeConfigSection.actionHint && (
                    <Typography variant="caption" color="text.secondary">
                      {activeConfigSection.actionHint}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography>{localeText.common.noContent}</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(setConfigDialogOpen(false))}>{localeText.dialogs.close}</Button>
            </DialogActions>
          </Dialog>
    
  )
}

export default  React.memo(InvoiceConfig)
