import React from 'react'
import { Stack, Paper} from "@mui/material";


import SurchargesImportExport from '@/components/molecules/surcharges_import_export';
import CountrySurcharges from '@/components/molecules/country_surcharges';
import SurchargesTable from '@/components/molecules/surcharges_table';


export default function Surcharges() {
  
  return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <SurchargesImportExport/>
                <Stack spacing={1.5}>
                <CountrySurcharges/>
    
                <SurchargesTable/>
                </Stack>
              </Paper>
  )
}
