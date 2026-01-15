
"use client";
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
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useRouter } from 'next/navigation';
import { ALL_SPEDITIONS_VALUE } from "@/constants/common";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLanguage } from "@/hooks/useLanguage";
import Papa from "papaparse";
import { setToleranceDialogOpen } from "@/store/features/tolerances/TolerancesSlice";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InvoiceFilter from "@/components/organisms/invoice_filter";
import Tolerance from "@/components/organisms/tolerance";
import { getCompaniesDetailsData } from "@/dialogs/invoice_config/services";
import { useSearchParams } from 'next/navigation'
import { useGetCommonThings } from "@/hooks/commonThings";
import InvoiceCaptStatement from "@/components/molecules/invoice_capt_ statement";
import { setResponseInputDialogOpen, setCarrierViewDialogOpen } from "@/store/features/invoice_data/invoiceDataSlice";
import InvoiceDetailsTable from "@/components/organisms/invoice_details_table";

import CarrierViewDialog from "@/components/organisms/carrier_view_dialog";


const InvoiceDetails = () => {
  const invoiceDetailsData = useAppSelector((state) => state.invoiceData.invoiceDetailsData);
      const responseInputDialogOpen = useAppSelector((state) => state.invoiceData.responseInputDialogOpen);


 
     
     
    //  const [responseInputDialogOpen, setResponseInputDialogOpen] = useState(false);
   const carrierViewDialogOpen = useAppSelector((state) => state.invoiceData.carrierViewDialogOpen);
    const dispatch = useAppDispatch();
        const {renderStatusChip} = useGetCommonThings();
  const searchParams = Object.fromEntries(useSearchParams()?.entries())
   const details = useAppSelector((state) => state.invoiceData.details);
    const selectedInvoice = useAppSelector((state) => state.invoiceData.selectedInvoice);

  const overview = useAppSelector((state) => state.invoiceData.overview);
  const [speditionFilter, setSpeditionFilter] = useState<any>(ALL_SPEDITIONS_VALUE);
    const [search, setSearch] = useState("");
    const { localeText,language } =useLanguage();
    const [invoiceOverrides, setInvoiceOverrides] = useState<any>({});
     const [carrierResponses, setCarrierResponses] = useState<any>({});
      const [activeResponseKey, setActiveResponseKey] = useState<any>(null);
       const [viewResponseDialogOpen, setViewResponseDialogOpen] = useState(false);
       const [expandedRows, setExpandedRows] = useState<any>({});
     const [toleranceSettings, setToleranceSettings] = useState<any>({
    freightPercent: 0,
    defaultSurchargePercent: 0,
    surchargeOverrides: [],
    onlyNegativeMismatch: false,
  });

  

  const makeInvoiceKey = (rechnungsnummer:any, projektId:any) =>
  `${rechnungsnummer || "unbekannt"}__${projektId || "all"}`;

   const invoiceKey = selectedInvoice
    ? makeInvoiceKey(selectedInvoice.rechnungsnummer, selectedInvoice.projektId)
    : null;
  const currentCarrierResponse = invoiceKey ? carrierResponses[invoiceKey] : null;
  const invoiceAccepted = Boolean(
    invoiceKey && invoiceOverrides[invoiceKey]?.status === "accepted"
  );

      const evaluateStatus = useCallback(
    (expectedValue:any, actualValue:any, tolerancePercent = 0, onlyNegative = false) => {
      if (!Number.isFinite(expectedValue) && !Number.isFinite(actualValue)) {
        return { label: localeText.status.noData, color: "text.secondary", tone: "neutral" };
      }
      const expected = Number.isFinite(expectedValue) ? expectedValue : 0;
      const actual = Number.isFinite(actualValue) ? actualValue : 0;
      const rawDifference = expected - actual;
      if (onlyNegative && rawDifference >= 0) {
        return { label: localeText.status.ok, color: "success.main", tone: "success" };
      }
      const base = Math.max(Math.abs(expected), 1);
      const diff = Math.abs(actual - expected);
      const allowed = (Math.max(tolerancePercent, 0) / 100) * base;
      const ok = diff <= allowed;
      return ok
        ? { label: localeText.status.ok, color: "success.main", tone: "success" }
        : { label: localeText.status.error, color: "error.main", tone: "error" };
    },
    [localeText]
  );

   const handleOpenResponseViewer = (key:any) => {
    setActiveResponseKey(key);
    setViewResponseDialogOpen(true);
  };

 
    const exportCsv = () => {
    const csv = Papa.unparse(
      (selectedInvoice ? details : filteredOverview).map((row:any) => ({
        ...(selectedInvoice
          ? {
              sendungsID: row.sendungsID,
              spedition: row.spedition,
              nebenkosten:
                typeof row.nebenkostenTotal === "number"
                  ? row.nebenkostenTotal.toFixed(2)
                  : "",
              auftrags_summe: row.preis1.toFixed(2),
              rechnungs_summe: row.preis2.toFixed(2),
              differenz: row.differenz.toFixed(2),
            }
          : {
              rechnungsnummer: row.rechnungsnummer,
              projekt_id: row.projekt_id || "",
              rechnungsdatum: row.datum || "",
              spedition: row.spedition,
              auftrags_summe: row.preis1.toFixed(2),
              rechnungs_summe: row.preis2.toFixed(2),
              differenz: row.differenz.toFixed(2),
            }),
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", selectedInvoice ? "rechnungsdetails.csv" : "rechnungsuebersicht.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


     const getSurchargeTolerance = useCallback(
    (label:any) => {
      if (!label) return toleranceSettings.defaultSurchargePercent;
      const normalized = label.trim().toLowerCase();
      const match = toleranceSettings.surchargeOverrides.find(
        (item:any) =>
          item.label &&
          item.label.trim().toLowerCase() === normalized
      );
      return Number.isFinite(match?.percent)
        ? match.percent
        : toleranceSettings.defaultSurchargePercent;
    },
    [toleranceSettings]
  );

   const invoiceDetailStatus = useMemo(() => {
    if (!selectedInvoice || !details.length) return null;
    const key = makeInvoiceKey(selectedInvoice.rechnungsnummer, selectedInvoice.projektId);
    const override = invoiceOverrides[key];
    if (override?.status === "accepted") {
      return { ...acceptedStatus, override: true };
    }
    const hasError = details?.some((row:any) => {
      const freightStatus = evaluateStatus(
        row?.preis1,
        row?.preis2,
        toleranceSettings.freightPercent,
        toleranceSettings.onlyNegativeMismatch
      );
      if (freightStatus.tone === "error") return true;
      return row.nebenkostenDetails?.some((detail:any) => {
        const surchargeStatus = evaluateStatus(
          detail.preis1 ?? 0,
          detail.preis2 ?? 0,
          getSurchargeTolerance(detail.label),
          toleranceSettings.onlyNegativeMismatch
        );
        return surchargeStatus.tone === "error";
      });
    });
    return hasError
      ? { label: localeText.status.error, color: "error.main", tone: "error" }
      : { label: localeText.status.ok, color: "success.main", tone: "success" };
  }, [
    details,
    selectedInvoice,
    toleranceSettings.freightPercent,
    getSurchargeTolerance,
    invoiceOverrides,
    localeText.status.error,
    localeText.status.ok,
  ]);



  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
        style: "currency",
        currency: "EUR",
      }),
    [language]
  );

  
  const acceptedStatus = useMemo(
    () => ({
      label: localeText.status.accepted,
      color: "success.main",
      tone: "success",
    }),
    [localeText]
  );

    const filteredOverview = useMemo(() => {
    return overview
      .filter((o:any) => speditionFilter === ALL_SPEDITIONS_VALUE || o.spedition === speditionFilter)
      .filter((o:any) => String(o.rechnungsnummer || "").toLowerCase().includes(search.toLowerCase()))
      .sort((a:any, b:any) => {
        const dateA = a.datum ? new Date(a.datum).getTime() : 0;
        const dateB = b.datum ? new Date(b.datum).getTime() : 0;
        return dateB - dateA;
      });
  }, [overview, speditionFilter, search]);


 

const formatDate = useCallback(
    (isoString:any) => {
      if (!isoString) return "—";
      const parsed = new Date(isoString);
      return Number.isNaN(parsed.getTime())
        ? "—"
        : parsed.toLocaleDateString(language === "de" ? "de-DE" : "en-US");
    },
    [language]
  );

   const formatCurrency = useCallback(
    (value:any) => (typeof value === "number" ? currencyFormatter.format(value) : "—"),
    [currencyFormatter]
  );
console.log("invoiceDetailsData: ",invoiceDetailsData);
  

    useEffect(()=>{ 
             searchParams&& getCompaniesDetailsData(searchParams,dispatch)
            },[  ])

  return (
    <>
         
          <Typography variant="h6" gutterBottom>
            {localeText.detail.invoice}: {invoiceDetailsData?.invoice_number}
          </Typography>
          {invoiceDetailsData.carrier && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {localeText.detail.project}: {invoiceDetailsData.carrier}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Button onClick={exportCsv}>{localeText.buttons.exportPlain}</Button>
            <Button variant="outlined" onClick={() => setToleranceDialogOpen(true)}>
              {localeText.buttons.tolerance}
            </Button>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 2, }}>
                    
                    <InvoiceFilter  />
                    
                  </Box>
          </Box>

          {invoiceDetailStatus && (
            <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle2">{localeText.detail.statusTitle}</Typography>
              {renderStatusChip(invoiceDetailStatus)}
            </Box>
          )}

          {invoiceDetailStatus?.tone === "error" && !invoiceAccepted && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 1,
                bgcolor: "error.light",
                color: "error.contrastText",
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                {localeText.detail.errorNotice}
              </Typography>
             
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => dispatch(setResponseInputDialogOpen(true))}
              >
                {localeText.detail.errorButton}
               
              </Button>
              <Button
                variant="contained"
                color="inherit"
                sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 } }}
                onClick={() =>dispatch(setCarrierViewDialogOpen(true)) }
              >
                {localeText.carrierView.button}
              </Button>
            </Box>
          )}

          {currentCarrierResponse && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {localeText.detail.responseTitle} (
                {new Date(currentCarrierResponse.receivedAt).toLocaleString(
                  language === "de" ? "de-DE" : "en-US"
                )}
                )
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {localeText.detail.responseSubtitle}
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleOpenResponseViewer(invoiceKey)}
              >
                {localeText.detail.responseButton}
              </Button>
            </Box>
          )}
          <InvoiceDetailsTable/>
           <Tolerance/>
          {responseInputDialogOpen?<InvoiceCaptStatement/>:null}
           <CarrierViewDialog/>

        </>
  );
};

export default React.memo(InvoiceDetails);