// src/pages/ShipperTenderHub.js
import React from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
// import DashboardTile from "../components/DashboardTile";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AnchorIcon from '@mui/icons-material/Anchor';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardTile from "@/components/organisms/DashboardTile";
import { useRouter } from "next/navigation";

const ShipperTenderHub = ({ setView }:any) => {

     const router = useRouter();
  const tiles = [
    {
      title: "Seefracht",
      description: "Analyse und Übersicht der Seefrachtangebote.",
      icon: <AnchorIcon fontSize="large" color="primary" />,
      onClick: () => router.push("/see-fracht-hub"),
    },
    {
      title: "Pakete",
      description: "Alle Paket-Tender auf einen Blick.",
      icon: <InventoryIcon fontSize="large" color="primary" />,
      onClick: () => router.push("/packet-hub"),
    },
    {
      title: "Landverkehr",
      description: "Tender für LKW-Transporte verwalten.",
      icon: <LocalShippingIcon fontSize="large" color="primary" />,
      onClick: () =>router.push("/land-hub"),
    },
  ];

  return (
    <Box>
           {/* 🔙 Zurück zum Dashboard */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => setView("home")}
        sx={{ mb: 3 }}
      >
        Zurück zum Dashboard
      </Button>
      <Typography variant="h4" align="center" gutterBottom>
        🚢 Shipper -Tender- Hub
      </Typography>

      <Grid container spacing={3} justifyContent="center" mt={2}>
        {tiles.map((tile, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <DashboardTile {...tile} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ShipperTenderHub;