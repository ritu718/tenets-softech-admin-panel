// "use client";
// import React, { useState } from "react";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import Button from "@mui/material/Button";
// import AccountCircle from "@mui/icons-material/AccountCircle";


// import { useRouter } from "next/navigation";


// export default function HomeHeader() {

//     const router = useRouter();
//   const [view, setView] = useState("home");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [user, setUser] = useState<any>(null);

//   const handleMenuOpen = (event:any) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   const handleLogout = () => {
//     setUser(null);
//     setView("login");
//     handleMenuClose();
//   };

//   const handleLogin = () => {
//     setUser({ email: "user@gmail.com" });
//     setView("home");
//   };

//   return (
//          <AppBar position="static">
//   <Toolbar sx={{ justifyContent: "space-between" }}>
//     <Typography
//       variant="h6"
//       onClick={() => setView("home")}
//       sx={{ cursor: "pointer" }}
//     >
//       Digital Freight Office
//     </Typography>

//     {user && (
//       <Box display="flex" alignItems="center" gap={2}>
//         <Typography variant="body1">
//           Eingeloggt als: <strong>{user?.email}</strong>
//         </Typography>

//         <IconButton color="inherit" onClick={handleMenuOpen}>
//           <AccountCircle />
//         </IconButton>

//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem onClick={handleLogout}>Ausloggen</MenuItem>
//         </Menu>
//       </Box>
//     )}

//     {!user && (
//       <Button color="inherit" onClick={() => router.push("/login")}>Login</Button>
//     )}
//   </Toolbar>
// </AppBar>

//   );
// }


"use client";

import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseApp } from "@/services/firebase/firebase";


export default function HomeHeader() {
  const router = useRouter();
  const auth = getAuth(firebaseApp);

  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 🔐 Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleMenuOpen = (event: any) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut(auth);
    handleMenuClose();
    router.push("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          onClick={() => router.push("/")}
          sx={{ cursor: "pointer" }}
        >
          Digital Freight Office
        </Typography>

        {/* ✅ WHEN LOGGED IN */}
        {user ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1">
              Eingeloggt als: <strong>{user.email}</strong>
            </Typography>

            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          /* ✅ WHEN LOGGED OUT */
          <Button color="inherit" onClick={() => router.push("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
