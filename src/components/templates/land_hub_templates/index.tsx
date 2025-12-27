// src/pages/LandHub.js
import React from "react";
import { Typography, Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const LandHub = ({ setView }:any) => {
  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => setView("shipperHub")}
        sx={{ mb: 2 }}
      >
        Zurück zum Tender-Hub
      </Button>

      <Typography variant="h4" gutterBottom>
        🚚 Landverkehr Hub
      </Typography>
      <Typography>Tenderübersicht für den Landverkehr.</Typography>
    </Box>
  );
};

export default LandHub;