
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppSelector } from "@/store/hooks";
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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useGetCommonThings } from "@/hooks/commonThings";

export default function InvoiceDetailsTable() {
const [selectedInvoice, setSelectedInvoice] = useState<any>({rechnungsnummer: 'R-1001', projektId: 'p1'});
    const { localeText,language } =useLanguage();
    const invoiceDetailsData = useAppSelector((state) => state.invoiceData.invoiceDetailsData);
    const [expandedRows, setExpandedRows] = useState<any>({});
    const {renderStatusChip} = useGetCommonThings();
    const [carrierResponses, setCarrierResponses] = useState<any>({});
    const [invoiceOverrides, setInvoiceOverrides] = useState<any>({});
     const [toleranceSettings, setToleranceSettings] = useState<any>({
        freightPercent: 0,
        defaultSurchargePercent: 0,
        surchargeOverrides: [],
        onlyNegativeMismatch: false,
      });
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
      const makeInvoiceKey = (rechnungsnummer:any, projektId:any) =>
  `${rechnungsnummer || "unbekannt"}__${projektId || "all"}`;
      const invoiceKey = selectedInvoice
    ? makeInvoiceKey(selectedInvoice.rechnungsnummer, selectedInvoice.projektId)
    : null;

      const invoiceAccepted = Boolean(
    invoiceKey && invoiceOverrides[invoiceKey]?.status === "accepted"
  );
   const currencyFormatter = useMemo(
      () =>
        new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
          style: "currency",
          currency: "EUR",
        }),
      [language]
    );
const formatCurrency = useCallback(
    (value:any) => (typeof value === "number" ? currencyFormatter.format(value) : "—"),
    [currencyFormatter]
  );
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
    const acceptedStatus = useMemo(
        () => ({
          label: localeText.status.accepted,
          color: "success.main",
          tone: "success",
        }),
        [localeText]
      );
    
  return (
     <Table>
            <TableHead>
              <TableRow>
                <TableCell>{localeText.detail.columns.sendung}</TableCell>
                <TableCell>{localeText.detail.columns.carrier}</TableCell>
                <TableCell>{localeText.detail.columns.surcharges}</TableCell>
                <TableCell>{localeText.detail.columns.orderSum}</TableCell>
                <TableCell>{localeText.detail.columns.invoiceSum}</TableCell>
                <TableCell>{localeText.detail.columns.difference}</TableCell>
                <TableCell>{localeText.detail.columns.status}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceDetailsData?.shipments?.map((row:any, idx:any) => {
                console.log("Row response: ",row);
                
              
                return (
                  <React.Fragment key={row.id || idx}>
                    <TableRow
                      hover
                      sx={{ cursor: row.nebenkostenDetails?.length ? "pointer" : "default" }}
                      onClick={() => {
                        if (row.nebenkostenDetails?.length) {
                          setExpandedRows((prev:any) => ({
                            ...prev,
                            [row.rowKey]: !prev[row.rowKey],
                          }));
                        }
                      }}
                    >
                      <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {row.nebenkostenDetails?.length ? (
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              setExpandedRows((prev:any) => ({
                                ...prev,
                                [row.rowKey]: !prev[row.rowKey],
                              }));
                            }}
                          >
                            {expandedRows[row.rowKey] ? (
                              <KeyboardArrowUpIcon fontSize="small" />
                            ) : (
                              <KeyboardArrowDownIcon fontSize="small" />
                            )}
                          </IconButton>
                        ) : null}
                        {row.shipmentId}
                      </TableCell>
                      <TableCell>{row.spedition}</TableCell>
                      <TableCell>{formatCurrency(row?.charges?.freightCostSystemR)}</TableCell>
                      <TableCell>{formatCurrency(row?.order_total)}</TableCell>
                      <TableCell>{formatCurrency(row?.net_amount_eur)}</TableCell>
                      <TableCell sx={{ color: row?.difference > 0 ? "green" : "red", fontWeight: "bold" }}>
                        {formatCurrency(row.differenz)}
                      </TableCell>
                      <TableCell>{renderStatusChip(row?.status)}</TableCell>
                    </TableRow>
                    {row.nebenkostenDetails?.length ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ py: 0 }}>
                          <Collapse in={Boolean(expandedRows[row.rowKey])} timeout="auto" unmountOnExit>
                            <Box sx={{ m: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {localeText.detail.surchargeTable.title}
                              </Typography>
                              <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>{localeText.detail.surchargeTable.label}</TableCell>
                                      <TableCell>{localeText.detail.surchargeTable.orderSum}</TableCell>
                                      <TableCell>{localeText.detail.surchargeTable.invoiceSum}</TableCell>
                                      <TableCell>{localeText.detail.surchargeTable.difference}</TableCell>
                                      <TableCell>{localeText.detail.surchargeTable.status}</TableCell>
                                    </TableRow>
                                  </TableHead>
                                <TableBody>
                                  {row.nebenkostenDetails.map((detail:any) => {
                                    const baseSurchargeStatus = evaluateStatus(
                                      detail.preis1 ?? 0,
                                      detail.preis2 ?? 0,
                                      getSurchargeTolerance(detail.label)
                                    );
                                    const surchargeStatus = invoiceAccepted
                                      ? acceptedStatus
                                      : baseSurchargeStatus;
                                    return (
                                      <TableRow key={detail.key}>
                                        <TableCell>{detail.label}</TableCell>
                                        <TableCell>{formatCurrency(detail.preis1)}</TableCell>
                                        <TableCell>{formatCurrency(detail.preis2)}</TableCell>
                                        <TableCell
                                          sx={{
                                            color: detail.differenz > 0 ? "green" : "red",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {formatCurrency(detail.differenz)}
                                        </TableCell>
                                        <TableCell>{renderStatusChip(surchargeStatus)}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
  )
}
