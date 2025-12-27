import React from "react";
import { Typography, Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PacketeHub = ({ setView }:any) => {
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
        📦 Pakete Hub
      </Typography>
      <Typography>Hier kommen alle Paket-Ausschreibungen rein.</Typography>
    </Box>
  );
};

export default PacketeHub;