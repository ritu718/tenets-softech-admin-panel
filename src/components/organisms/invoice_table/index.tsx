import React from 'react'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@mui/material";

import { useLanguage } from '@/hooks/useLanguage';
import {   useAppSelector } from "@/store/hooks";
import { useRouter } from 'next/navigation';

 const InvoiceTable =()=> {
   const invoiceData = useAppSelector((state) => state.invoiceData.invoiceData);
      const { localeText,formatDate,formatCurrency } =useLanguage();
         const router = useRouter();
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
                 {invoiceData?.map((row:any, idx:any) => {
                  
                  console.log("row value is: ",row);
                  
                  return (
                   <TableRow
                     key={idx}
                     sx={{ cursor: "pointer", "&:hover": { background: "#f3f3f3" } }}
                     onClick={() =>{
router.push("/invoice-details")
                     }
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
                 )})}
               </TableBody>
             </Table>
  )
}


export default React.memo(InvoiceTable);