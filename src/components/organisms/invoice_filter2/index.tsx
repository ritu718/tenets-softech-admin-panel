import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  
} from "@mui/material";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";


const ALL_SPEDITIONS_VALUE = "__all__";

export default function InvoiceFilter2() {
    const [dateTo, setDateTo] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [search, setSearch] = useState("");
     
     const [speditionFilter, setSpeditionFilter] = useState(ALL_SPEDITIONS_VALUE );
   
      const overview = useAppSelector((state) => state.invoiceData.overview);
     const { localeText } =useLanguage();
      const speditions = useMemo(() => {
    const all = overview.map((o :any  ) => o.spedition || "");
    return [ALL_SPEDITIONS_VALUE, ...Array.from(new Set(all))];
  }, [overview]);
  return (
    
     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>{localeText.overview.filters.carrier}</InputLabel>
                  <Select
                    value={speditionFilter}
                    label={localeText.overview.filters.carrier}
                    onChange={(e) => setSpeditionFilter(e.target.value)}
                  >
                    {speditions.map((sp : any, i) => (
                      <MenuItem key={i} value={sp}>
                        {sp === ALL_SPEDITIONS_VALUE ? localeText.overview.filters.all : sp || "—"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
    
                <TextField
                  label={localeText.overview.filters.invoiceNumber}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
    
                <TextField
                  label={localeText.overview.filters.fromDate}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  sx={{ minWidth: 170 }}
                />
    
                <TextField
                  label={localeText.overview.filters.toDate}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  sx={{ minWidth: 170 }}
                />
    
                <Button
                  variant="text"
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
                  disabled={!dateFrom && !dateTo}
                  sx={{ alignSelf: "center" }}
                >
                  {localeText.overview.filters.clear}
                </Button>
              </Box>
  )
}
