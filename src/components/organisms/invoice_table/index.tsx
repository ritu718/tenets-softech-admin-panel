import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {

  Table,

  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
 
} from "@mui/material";

import { useLanguage } from '@/hooks/useLanguage';
import {  useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCompaniesData } from '@/dialogs/invoice_config/services';

export default function InvoiceTable({}:any) {
   const filteredOverview = useAppSelector((state) => state.invoiceData.filteredOverview);
     const dispatch = useAppDispatch();
    //  const selectedInvoice = useAppSelector((state:any) => state?.invoiceTable.selectedInvoice);
const userId = useAppSelector((state) => state?.userDetails?.userInfo?.userId);
const invoiceFilter = useAppSelector((state) => state?.invoiceFilter);
          useEffect(()=>{
        getCompaniesData({userId,...invoiceFilter},dispatch)
      },[invoiceFilter])
    
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
      const { localeText,formatDate,formatCurrency } =useLanguage();
     
       const renderStatusChip = (status:any) => (
          <Chip
            size="small"
            label={status}
            sx={{
              bgcolor:
                status === "success"
                  ? "success.light"
                  : status === "error"
                  ? "error.light"
                  : "grey.200",
              color: status,
              fontWeight: "bold",
            }}
          />
        );


           
            
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
                 {filteredOverview?.map((row:any, idx:any) => (
                   <TableRow
                     key={idx}
                     sx={{ cursor: "pointer", "&:hover": { background: "#f3f3f3" } }}
                     onClick={() =>
                    setSelectedInvoice   ({
                         rechnungsnummer: row.rechnungsnummer,
                         projektId: row.projekt_id,
                       })
                     }
                   >
                     <TableCell>{row.invoice_number}</TableCell>
                     <TableCell>{formatDate(row.invoice_date)}</TableCell>
                     <TableCell>{row.carrier || "—"}</TableCell>
                     <TableCell>{formatCurrency(row.order_total)}</TableCell>
                     <TableCell>{formatCurrency(row.invoice_total)}</TableCell>
                     <TableCell sx={{ color: row.difference > 0 ? "green" : "red", fontWeight: "bold" }}>
                       {formatCurrency(row.difference)}
                     </TableCell>
                   <TableCell>
                     {renderStatusChip(row.status)}
                   </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
  )
}
