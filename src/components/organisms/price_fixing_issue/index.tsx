
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
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
import { LANGUAGE_TEXT } from "@/constants/data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setpriceFixingDialogData } from "@/store/features/shipment_summary/shipmentSummarySlice";
import { useLanguage } from "@/hooks/useLanguage";

export default function PriceFixingIssue() {
    const [priceFixDialog, setPriceFixDialog] = useState<any>({
    open: false,
    shipment: null,
    carrier: null,
    error: null,
    countryCode: "DE",
    
  });
  
  const { localeText } =useLanguage();
  const dispatch = useAppDispatch(); 
        const {priceFixingDialogData} = useAppSelector((state) => state.shipmentSummary);
    const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
    const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
       
    const activeCarrier =
    carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;
  
        console.log("priceFixingDialogData: ",priceFixingDialogData);
        console.log("activeCarrier: value is: ",activeCarrier);
        
  return (
    <Dialog
        open={priceFixingDialogData}
        onClose={() => dispatch(setpriceFixingDialogData(null))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {localeText.config.pricing.addCarrierDialog.priceFixTitle ||
            localeText.config.pricing.addCarrierDialog.title}
        </DialogTitle>
        <DialogContent dividers>
          {(() => {
            const fallbackCarrier = {
              name: "Muster Spedition GmbH",
              street: "Musterstraße",
              houseNumber: "12",
              zip: "20095",
              city: "Hamburg",
              country: "Deutschland",
              contact: "Max Mustermann",
              phone: "+49 40 123456",
              email: "pricing@muster.de",
              customerNumber: "CUST-12345",
            };
            const carrier = priceFixDialog.carrier || fallbackCarrier;
            const detailZip = priceFixDialog?.details?.zip || priceFixDialog.shipment?.zipTo || "—";
            const detailWeight = priceFixingDialogData?.EffectiveWeight || "—";
            const errorLabel = priceFixDialog.error || "Preisfehler";
            return (
            <Stack spacing={2}>
              <Typography variant="subtitle2">{activeCarrier.name}</Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2">
                  {activeCarrier.street } {activeCarrier.houseNumber}
                </Typography>
                <Typography variant="body2">
                  {activeCarrier.zip} {activeCarrier.city }
                </Typography>
                <Typography variant="body2">{activeCarrier.country }</Typography>
                <Typography variant="body2">
                  {activeCarrier.contact } {activeCarrier.phone }
                </Typography>
                <Typography variant="body2">{activeCarrier.email}</Typography>
                <Typography variant="body2">
                  {localeText.addCarrierDialog?.customerNumber || "Kundennummer"}:{" "}
                  {activeCarrier.customerNumber}
                </Typography>
              </Stack>
              <TextField
                label="Preis (EUR)"
                type="text"
                value={priceFixDialog.value || ""}
                onChange={(e) => setPriceFixDialog((prev:any) => ({ ...prev, value: e.target.value }))}
                fullWidth
              />
              <Typography variant="body2" color={priceFixDialog.error ? "error" : "text.secondary"}>
                {errorLabel} (PLZ: {detailZip}, Gewicht: {detailWeight})
              </Typography>
            </Stack>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() =>  dispatch(setpriceFixingDialogData(null))}>
            {localeText.addCarrierDialog?.cancel || localeText.dialogs.close}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
             dispatch(setpriceFixingDialogData(null))
            }}
          >
            {localeText.dialogs.save || "Speichern"}
          </Button>
        </DialogActions>
      </Dialog>
  )
}
