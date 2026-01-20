
import React, {  useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Alert,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useUserProfileContext } from "@/context/user-profile-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFirebaseId, setFirebaseToken, setUserProfile } from "@/store/features/user_details/userDetailsSlice";
import { usePathname } from "next/navigation";

const FormSchemaLogin = yup.object().shape({
  email: yup.string().email("Bitte geben Sie eine gültige Email Adresse ein.").required("Bitte geben Sie eine gültige Email Adresse ein."),
  password: yup.string().min(6, "Das Passwort muss mindestens 6 Zeichen haben.").required("Bitte geben Sie ein gültiges Passwort ein."),
});

const LoginForm = () => {
       const userId = useAppSelector((state:any) => state?.userDetails?.userProfile?.id);
        const dispatch = useAppDispatch();
      const theme = useTheme();
       const router = useRouter();
 const { login }:any = useUserProfileContext();
const [showApiServerRequestErrorMessage, setShowApiServerRequestErrorMessage] = useState(false);
   const [showTooManyRequests, setShowTooManyRequests] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    email: "",
    password: "",
  };
   

  const formik = useFormik({
    validationSchema: FormSchemaLogin,
    initialValues,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (loginData) => {
      setShowApiServerRequestErrorMessage(false);
      setIsLoading(true);
console.log("loginData: ",loginData);

    
      const loginState = await login(loginData);

  if (!loginState.success) {
  if (loginState.tooManyRequests) {
    setShowTooManyRequests(true);
  } else if (loginState.errorFields) {
    !loginState.errorFields.email && 
      formik.setFieldError("email", "Die von Ihnen eingegebene Email Adresse wurde nicht gefunden.");
    !loginState.errorFields.password && 
      formik.setFieldError("password", "Bitte geben Sie ein gültiges Passwort ein.");
  } else {
    setShowApiServerRequestErrorMessage(true);
  }

  setIsLoading(false);
  return;
}

  setIsLoading(false);
    router.push("/dashboard");

    /* ---------- LOGOUT (optional flag) ---------- */
    if (loginState?.isLogout) {
      setIsLoading(false);
         dispatch(setFirebaseId(undefined));
            dispatch(setFirebaseToken(undefined));
              dispatch(setUserProfile({}));
      router.replace("/login");
      return;
    }
    },
  });

useEffect(()=>{
    userId&&router.replace("/dashboard");
},[userId])
  
    return userId?null: (
    
     <form onSubmit={formik.handleSubmit}><Box
      
      sx={{ maxWidth: 400, mx: "auto", mt: 5 }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>

          <TextField
        label="E-Mail"
        type="email"
        fullWidth
        margin="normal"
         autoComplete="email"
  InputLabelProps={{ shrink: true }}
                  name="email"
                
                  placeholder="Email"
                  onFocus={() => formik.setFieldError("email", "")}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={!!formik.errors.email}
                  helperText={formik.errors.email}
      />

      <TextField
        type="password"
                  name="password"
                  label="Passwort*"
                  placeholder="Passwort"
                   autoComplete="current-password"
  InputLabelProps={{ shrink: true }} 
                  onFocus={() => formik.setFieldError("password", "")}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={!!formik.errors.password}
                  helperText={formik.errors.password}
                  fullWidth
      />

        <LoadingButton
                  type="submit"
                  disabled={isLoading || showTooManyRequests}
                  loading={isLoading}
                 
                  variant="contained"
                  loadingPosition="start"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Login
                </LoadingButton>
                {showApiServerRequestErrorMessage && (
                  <Typography color={theme.palette.error.main}>Anfrage an den API Server fehlgeschlagen, bitte versuchen Sie es später noch einmal.</Typography>
                )}
               
    </Box>
    </form>
  );
};

export default LoginForm;