import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const DashboardTile = ({ icon, title, description, onClick }) => {
  return (
    <Paper
    onClick={onClick}
    sx={{
      p: 3,
      cursor: "pointer",
      textAlign: "center",
      transition: "0.3s",
      height: "100%",           // Ja, das hier bleibt wichtig
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",     // optional für zentriertes Icon
      "&:hover": {
        boxShadow: 6,
        transform: "scale(1.02)",
      },
    }}
    elevation={4}
  >
      <Box mb={1}>{icon}</Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};

export default DashboardTile;