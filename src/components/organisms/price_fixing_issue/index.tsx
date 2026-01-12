
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
   
        console.log("priceFixingDialogData: ",priceFixingDialogData);
        
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
              <Typography variant="subtitle2">{carrier.name}</Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2">
                  {carrier.street || fallbackCarrier.street} {carrier.houseNumber || fallbackCarrier.houseNumber}
                </Typography>
                <Typography variant="body2">
                  {carrier.zip || fallbackCarrier.zip} {carrier.city || fallbackCarrier.city}
                </Typography>
                <Typography variant="body2">{carrier.country || fallbackCarrier.country}</Typography>
                <Typography variant="body2">
                  {carrier.contact || fallbackCarrier.contact} {carrier.phone || fallbackCarrier.phone}
                </Typography>
                <Typography variant="body2">{carrier.email || fallbackCarrier.email}</Typography>
                <Typography variant="body2">
                  {localeText.addCarrierDialog?.customerNumber || "Kundennummer"}:{" "}
                  {carrier.customerNumber || fallbackCarrier.customerNumber}
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
