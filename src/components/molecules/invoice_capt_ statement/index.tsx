import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useLanguage } from '@/hooks/useLanguage';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setResponseInputDialogOpen } from "@/store/features/invoice_data/invoiceDataSlice";

 function InvoiceCaptStatement() {
    const responseInputDialogOpen = useAppSelector((state) => state.invoiceData.responseInputDialogOpen);
    console.log("responseInputDialogOpen:",responseInputDialogOpen);
    
    //  const [responseInputDialogOpen, setResponseInputDialogOpen] = useState(false);
    const dispatch = useAppDispatch();
     const [responseText, setResponseText] = useState("");
 const { localeText,language } =useLanguage();
  const [activeResponseKey, setActiveResponseKey] = useState(null);
  const [carrierViewMessage, setCarrierViewMessage] = useState("");
  const [carrierViewDialogOpen, setCarrierViewDialogOpen] = useState(false);
 const [viewResponseDialogOpen, setViewResponseDialogOpen] = useState(false);
const [carrierResponses, setCarrierResponses] = useState({});

 const handleSaveCarrierResponse = () => {
    persistCarrierResponse(responseText);
  };
  

   const persistCarrierResponse = useCallback(
    (message:any, keyOverride?:any) => {
      const trimmed = message?.trim();
      const key = keyOverride  || activeResponseKey;
      if (!trimmed || !key) return false;
      const payload = {
        message: trimmed,
        receivedAt: new Date().toISOString(),
      };
      setCarrierResponses((prev) => ({
        ...prev,
        [key]: payload,
      }));
      setResponseText("");
      setCarrierViewMessage("");
      setResponseInputDialogOpen(false);
      setCarrierViewDialogOpen(false);
      setActiveResponseKey(key);
      setViewResponseDialogOpen(true);
      return true;
    },
    [ activeResponseKey]
  );

  return (
    <Dialog
        open={responseInputDialogOpen}
        onClose={() => dispatch(setResponseInputDialogOpen(true))}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{localeText.dialogs.responseInputTitle}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {localeText.dialogs.responseInputDescription}
          </Typography>
          <TextField
            autoFocus
            multiline
            minRows={4}
            fullWidth
            placeholder={localeText.dialogs.responsePlaceholder}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(setResponseInputDialogOpen(false))}>
            {localeText.dialogs.cancel}
          </Button>
          <Button
            onClick={handleSaveCarrierResponse}
            variant="contained"
            disabled={!responseText.trim()}
          >
            {localeText.dialogs.save}
          </Button>
        </DialogActions>
      </Dialog>
  )
}


export default React.memo(InvoiceCaptStatement)