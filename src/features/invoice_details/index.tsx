
"use client";
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useRouter } from 'next/navigation';

const InvoiceDetails = () => {
  
  const router = useRouter();

  return (
    <Box>
        <Box mt={6}>
          <Button startIcon={<ArrowBackIcon />} onClick={() =>  router.back()} sx={{ mb: 2 }}>
            Zurück zum Dashboard
          </Button>

          <Paper elevation={3} sx={{ p: 3, mb: 2, bgcolor: "#f3f4f6" }}>
            <Box display="flex" alignItems="center">
              <ReceiptLongIcon sx={{ fontSize: 40, mr: 2 }} color="primary" />
              <Box>
                <Typography variant="h5">📦 Invoice Hub</Typography>
                <Typography variant="body2" color="text.secondary">
                  Rechnungsprüfung
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Box
            mt={4}
            sx={{
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              p: { xs: 2, md: 3 },
              bgcolor: "#fff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Rechnungen ansehen
              </Typography>
            </Box>
              
           
          </Box>
        </Box>
      
    </Box>
  );
};

export default React.memo(InvoiceDetails);