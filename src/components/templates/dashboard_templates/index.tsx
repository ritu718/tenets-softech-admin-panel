import React from "react";
import {
  Box,
  Grid,
  Typography,
  
} from "@mui/material";
import DashboardTile from "../../organisms/DashboardTile"
import { dashboardTiles } from "../../../data/dashboardTiles";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants/apis";


const Dashboard = ({  userProfile }:any) => {
  console.log("BASE_URL: ",BASE_URL);
  
   const router = useRouter(); 
  // Demo-"Login"
  const mockProfile = { firma: "Mustermann" };
  const effectiveProfile = userProfile ?? mockProfile;

  // Tiles: Invoice Hub leitet in Subview
  const visibleTiles = dashboardTiles(router);

console.log("visibleTiles: ",visibleTiles);


  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
Willkommen bei  {effectiveProfile?.firma || "Mustermann!"}!
      </Typography>

     
        <Grid container spacing={3} alignItems="stretch" justifyContent="center" mt={2}>
          {visibleTiles.map((tile, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx} sx={{ marginTop: 6 }}>
              <Box height="100%">
                <DashboardTile {...tile} />
              </Box>
            </Grid>
          ))}
        </Grid>
     

   
    </Box>
  );
};

export default Dashboard;
