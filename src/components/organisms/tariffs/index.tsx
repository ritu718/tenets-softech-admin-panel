import React from 'react'
import {
  Stack,
  Paper,
} from "@mui/material";

import CountryOverviewTariffs from '@/components/molecules/country_overview_tariffs';
import TariffsImportExport from '@/components/molecules/tariffs_import_export';
import TariffsAddZone from '@/components/molecules/tariffs_add_zone';
import TariffsZone from '@/components/molecules/tariffs_zone';
import TariffsTypeSelector from '@/components/molecules/tariffs_type_selector';
import TariffsWeight from '@/components/molecules/tariffs_weight';

export default function Tariffs() {
  
  return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
               
    <TariffsImportExport/>
                <Stack spacing={1.5}>
                  <CountryOverviewTariffs/>
                 <TariffsTypeSelector/>
    <TariffsAddZone/>
    <TariffsZone/>
    
                  <TariffsWeight/>
                </Stack>
              </Paper>
  )
}
