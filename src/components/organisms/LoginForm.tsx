
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { supabase } from "../../../supabase";
import { BASE_URL } from "@/constants/apis";
import {fetchApi} from "@/services/api"

const LoginForm = ({ onLogin }:any) => {
   console.log("BASE_URL: ",BASE_URL);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<any>(null);

  const handleLogin = async (e:any) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
console.log("data.user", data.user);
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      onLogin(data.user);
    }
  };

  useEffect(()=>{
const getDataFromServer = async ()=>{
 const response = fetchApi({},"https://jsonplaceholder.typicode.com/users","GET",{
  Authorization: "Bearer token",
  "Content-Type": "application/json"
})
    console.log("response: ",response);
}
   getDataFromServer();
    
  },[])
  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{ maxWidth: 400, mx: "auto", mt: 5 }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="E-Mail"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <TextField
        label="Passwort"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{ mt: 2 }}
      >
        Einloggen
      </Button>
    </Box>
  );
};

export default LoginForm;