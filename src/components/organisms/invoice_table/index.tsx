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
import {   useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from 'next/navigation';
import { setInvoiceDetailsData } from '@/store/features/invoice_data/invoiceDataSlice';
import { useGetCommonThings } from '@/hooks/commonThings';


 const InvoiceTable =()=> {
   const invoiceData = useAppSelector((state) => state.invoiceData.invoiceData);
     const userId = useAppSelector((state) => state?.userDetails?.userProfile?.id);
     const dispatch = useAppDispatch();
      const { localeText,formatDate,formatCurrency } =useLanguage();
         const router = useRouter();
         const {renderStatusChip} = useGetCommonThings();
      
            
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
router.push(`/invoice-details?invoice_number=${row.invoice_number}&company_id=${userId}`)
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