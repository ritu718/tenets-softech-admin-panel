
import React from "react";
import {
    Stack,
  Paper,
} from "@mui/material";
import CalculationTypes from "@/components/organisms/calculation_types";
import AdditionMinimumWeight from "@/components/organisms/addition_minimum_weight";
import CountryOverview from "../country_overview";
import FreightBasisImportExport from "../freight_basis_import_export";
import BulkyGoods from "@/components/organisms/bulky_goods";
import FreightAdvanceOptions from "@/components/organisms/freight_advance_options";
import ShipperBasisMinWeight from "@/components/organisms/shipper_basis_min_weight";

export default function FreightBasis() {
       return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={2}>
              <FreightBasisImportExport/>
              <CountryOverview/>
                < CalculationTypes />
              < BulkyGoods/>

             < FreightAdvanceOptions/>
                  <ShipperBasisMinWeight/>
                <AdditionMinimumWeight/>

            </Stack>
          </Paper>
  )
}
