import { ALL_SPEDITIONS_VALUE } from "@/constants/common";
import { LANGUAGE_TEXT } from "@/constants/data";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setOverview, setFilteredOverview
} from "@/store/features/invoice_data/invoiceDataSlice";

export function useFilteredOVerview() {
   const dispatch = useAppDispatch();
   const overview = useAppSelector((state) => state.invoiceData.overview);
   const filteredOverview = useAppSelector((state) => state.invoiceData.filteredOverview);
       
   
   const [speditionFilter, setSpeditionFilter] = useState(ALL_SPEDITIONS_VALUE);
  const [search, setSearch] = useState("");
   
  useEffect(()=>{

    const filteredOverviewTmp = overview
      .filter((o:any) => speditionFilter === ALL_SPEDITIONS_VALUE || o.spedition === speditionFilter)
      .filter((o:any) => String(o.rechnungsnummer || "").toLowerCase().includes(search.toLowerCase()))
      .sort((a:any, b:any) => {
        const dateA = a.datum ? new Date(a.datum).getTime() : 0;
        const dateB = b.datum ? new Date(b.datum).getTime() : 0;
        return dateB - dateA;
      });
       
dispatch( setFilteredOverview(filteredOverviewTmp));
  },[overview])


  return {};
}