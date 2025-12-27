import React, { useCallback, useMemo, useState } from 'react'
import {

  Table,

  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
 
} from "@mui/material";

import { useLanguage } from '@/hooks/useLanguage';
import {  useAppSelector } from "@/store/hooks";

export default function InvoiceTable({}:any) {
   const filteredOverview = useAppSelector((state) => state.invoiceData.filteredOverview);
     
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceOverrides, setInvoiceOverrides] = useState<any>({});
  const [toleranceSettings, setToleranceSettings] = useState({
    freightPercent: 0,
    defaultSurchargePercent: 0,
    surchargeOverrides: [],
    onlyNegativeMismatch: false,
  });
      const { localeText,formatDate,formatCurrency } =useLanguage();
     
       const renderStatusChip = (status:any) => (
          <Chip
            size="small"
            label={status.label}
            sx={{
              bgcolor:
                status.tone === "success"
                  ? "success.light"
                  : status.tone === "error"
                  ? "error.light"
                  : "grey.200",
              color: status.color,
              fontWeight: "bold",
            }}
          />
        );

        const makeInvoiceKey = (rechnungsnummer:any, projektId:any) =>
  `${rechnungsnummer || "unbekannt"}__${projektId || "all"}`;
         const acceptedStatus = useMemo(
            () => ({
              label: localeText.status.accepted,
              color: "success.main",
              tone: "success",
            }),
            [localeText]
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


            console.log("overview: Invoice table",filteredOverview);
  return (
     <Table>
               <TableHead>
                 <TableRow>
                   <TableCell>{localeText.overview.columns.invoiceNumber}</TableCell>
                   <TableCell>{localeText.overview.columns.invoiceDate}</TableCell>
                   <TableCell>{localeText.overview.columns.carrier}</TableCell>
                   <TableCell>{localeText.overview.columns.orderSum}</TableCell>
                   <TableCell>{localeText.overview.columns.invoiceSum}</TableCell>
                   <TableCell>{localeText.overview.columns.difference}</TableCell>
                   <TableCell>{localeText.overview.columns.status}</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {filteredOverview.map((row:any, idx:any) => (
                   <TableRow
                     key={idx}
                     sx={{ cursor: "pointer", "&:hover": { background: "#f3f3f3" } }}
                     onClick={() =>
                       setSelectedInvoice({
                         rechnungsnummer: row.rechnungsnummer,
                         projektId: row.projekt_id,
                       })
                     }
                   >
                     <TableCell>{row.rechnungsnummer}</TableCell>
                     <TableCell>{formatDate(row.datum)}</TableCell>
                     <TableCell>{row.spedition || "—"}</TableCell>
                     <TableCell>{formatCurrency(row.preis1)}</TableCell>
                     <TableCell>{formatCurrency(row.preis2)}</TableCell>
                     <TableCell sx={{ color: row.differenz > 0 ? "green" : "red", fontWeight: "bold" }}>
                       {formatCurrency(row.differenz)}
                     </TableCell>
                   <TableCell>
                     {renderStatusChip(
                       invoiceOverrides[makeInvoiceKey(row.rechnungsnummer, row.projekt_id)]?.status ===
                         "accepted"
                         ? acceptedStatus
                         : evaluateStatus(
                             row.preis1,
                             row.preis2,
                             toleranceSettings.freightPercent,
                             toleranceSettings.onlyNegativeMismatch
                           )
                     )}
                   </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
  )
}
