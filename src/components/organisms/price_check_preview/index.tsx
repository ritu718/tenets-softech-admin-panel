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
import { useAppSelector } from "@/store/hooks";


const PriceCheckPreview = ({
  text,
  shipmentRows,
 
  overrides,
  onFixIssue,
}:any) => {

//  const {shipmentData} = useAppSelector((state) => state.shipmentData);
//   console.log("shipmentData value in price : ",shipmentData);
//   const shipmentDataForDisplay =shipmentData?.shipmentData||[];

  const {shipmentSummary} = useAppSelector((state) => state.shipmentSummary);
  console.log("shipmentSummary value in price : ",shipmentSummary);
  const shipmentSummaryForDisplay =shipmentSummary?.consolidatedShipmentData.DE||[];

 

  const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
  const renderRows = shipmentRows.slice(0, 8);

  const parseWeight = (weightText:any) => {
    if (!weightText) return null;
    const numeric = Number(String(weightText).replace(/[^0-9.,]/g, "").replace(",", "."));
    return Number.isFinite(numeric) ? numeric : null;
  };

  const pickCarrierTariff = (zip:any, weight:any) => {
    const zipPrefix = zip ? String(zip).slice(0, 2) : "";
    const carrier = carriers[0];
    if (!carrier) return { price: null, carrierName: null, error: "Keine Spedition ausgewählt" };
    const tariffCountry = carrier.tariffs?.byCountry?.DE || carrier.tariffs?.byCountry?.INT;
    if (!tariffCountry) return { price: null, carrierName: carrier.name, error: "Kein Tarif hinterlegt" };
    const zones = tariffCountry.zones || [];
    const matchedZone = zones.find((zone:any) => zone.zips && zone.zips.includes(zipPrefix));
    if (!matchedZone) {
      return {
        price: null,
        carrierName: carrier.name,
        error: `Keine Zone für PLZ gefunden`,
        details: { zip },
      };
    }
    const rows = tariffCountry.rows || [];
    const weightNumber = parseWeight(weight);
    const matchedRow =
      rows.find((row:any) => {
        const w = parseFloat(row.weight);
        return Number.isFinite(w) && weightNumber !== null && weightNumber <= w + 0.0001;
      }) || rows[rows.length - 1];
    const priceValue = matchedRow?.values?.[matchedZone.id];
    if (!priceValue) {
      return {
        price: null,
        carrierName: carrier.name,
        error: "Keine Preiszeile gefunden",
        details: { zip, weight },
      };
    }
    return { price: priceValue, carrierName: carrier.name, error: null };
  };

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">{text.configSections.reconciliation.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {text.configSections.reconciliation.description}
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{text.shipments.table.shipmentId}</TableCell>
              <TableCell>{text.shipments.table.zipFrom}</TableCell>
              <TableCell>{text.shipments.table.zipTo}</TableCell>
              <TableCell>{text.shipments.table.weight}</TableCell>
              <TableCell>Tarifpreis</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {shipmentSummaryForDisplay.map((row:any, index:any) => {
              const overridePrice = overrides?.[row.shipmentId];
              const result = overridePrice
                ? { price: overridePrice, carrierName: carriers[0]?.name || null, error: null }
                : pickCarrierTariff(row.zipTo, row.weight);
              return (
                <TableRow key={`${row.ShipmentId}-${index}`}>
                  <TableCell>{row.ShipmentId}</TableCell>
                  <TableCell>{row.ZipCodeConsignee}</TableCell>
                  <TableCell>{row.ZipCodeShipper}</TableCell>
                  <TableCell>{row.EffectiveWeight}</TableCell>
                  <TableCell>{row.Price}</TableCell>
                  <TableCell
                    sx={{ color: result.error ? "error.main" : "success.main", cursor: result.error ? "pointer" : "default" }}
                  onClick={() => {
                    if (result.error && onFixIssue) {
                      onFixIssue({
                        shipment: row,
                        carrier: carriers[0] || null,
                        error: result.error,
                        details: result.details || { zip: row.zipTo, weight: row.weight },
                      });
                    }
                  }}
                  >
                    {result.error ? result.error : "Preis gefunden"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" color="text.secondary">
        Hinweis: Preisberechnung ist Demo-Logik. Zonenmatching per PLZ-Präfix, Gewicht nach nächster Zeile.
      </Typography>
    </Stack>
  );
};


export default PriceCheckPreview;