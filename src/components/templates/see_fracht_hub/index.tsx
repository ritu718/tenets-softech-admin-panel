import React from "react";
import { Typography, Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SeefrachtHub = ({ setView }:any) => {
  return (
    <Box>
      {/* Zurück-Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() =>setView&& setView("shipperHub")}
        sx={{ mb: 2 }}
      >
        Zurück zum Tender-Hub
      </Button>

      {/* Inhalt */}
      <Typography variant="h4" gutterBottom>
        🌊 Seefracht Hub
      </Typography>
      <Typography>Hier kommt deine Seefracht-Auswertung hin.</Typography>
    </Box>
  );
};

export default SeefrachtHub;