import React, {  useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
    Stack,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { BASE_COUNTRY_OPTIONS } from "@/constants/data";
import InvoiceSpedition from "@/dialogs/invoice_spedition";
import { useLanguage } from "@/hooks/useLanguage";
import AddCarrier from "@/components/molecules/add_carrier";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveCarrierId } from "@/store/features/carrier/carriersSlice";
import { deleteCarrierDataToServer } from "@/dialogs/invoice_config/services";
import FreightBasis from "@/components/molecules/freight_basis";
import Tariffs from "../tariffs";
import Surcharges from "../surcharges";

 const CarrierPricingConfigurator = () => {
 const { localeText: text } =useLanguage();
  const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
       const dispatch = useAppDispatch();
      const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);

  const pricingText = text.config.pricing;
  const [addCarrierDialogOpen, setAddCarrierDialogOpen] = useState(false);
 

  const resolvedCountryOptions =BASE_COUNTRY_OPTIONS.map((option:any) => ({
          ...option,
          label: option.code,
        }));
  const activeCarrier =
    carriers.find((carrier:any) => carrier.id === activeCarrierId) || carriers[0] || null;


  const handleAddCarrier = () => {
      setAddCarrierDialogOpen(true);
  }

  const handleRemoveCarrier = (carrierId:any) => {
deleteCarrierDataToServer({projectId: carrierId},dispatch,carriers)
  };
  

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {pricingText.intro}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {pricingText.sharedInputNote}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
     <AddCarrier 
     handleAddCarrier={handleAddCarrier}
     activeCarrierId={activeCarrierId}
     resolvedCountryOptions={resolvedCountryOptions}
     />

         <InvoiceSpedition 
  activeCarrierId={activeCarrierId}
    addCarrierDialogOpen={addCarrierDialogOpen}
     setAddCarrierDialogOpen={setAddCarrierDialogOpen}
    />
      </Stack>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {carriers.map((carrier:any) => {
          const isActive = carrier.id === activeCarrier?.id;
          return (
            <Chip
              key={carrier.id}
              label={carrier.name}
              color={isActive ? "primary" : "default"}
              variant={isActive ? "filled" : "outlined"}
              onClick={() =>   dispatch(setActiveCarrierId( carrier.id)) }
              onDelete={() => handleRemoveCarrier(carrier.id)}
              deleteIcon={<DeleteOutlineIcon />}
            />
          );
        })}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {pricingText.chipsHelp}
      </Typography>

      {activeCarrier ? (
        <Stack spacing={2}>
          <FreightBasis/>
          <Tariffs/>
        <Surcharges />
        </Stack>
      ) : (
        <Typography variant="body2">{pricingText.empty}</Typography>
      )}
    </Stack>
  );
};


export default CarrierPricingConfigurator;