import React, { useCallback, useMemo, useState } from 'react'
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
import { useAppSelector } from '@/store/hooks';


type Props = {
  open: boolean;
  onClose: () => void;
  selectedInvoice: any;
  details: any[];
};

export default function CarrierViewDialog({
  open,
  onClose,
  selectedInvoice,
  details,
}: Props) {
const overview = useAppSelector((state) => state.invoiceData.overview);
const carriers = useAppSelector((state) => state.invoiceData.carrierConfigs);
 const [carrierViewMessage, setCarrierViewMessage] = useState("");
   const [viewResponseDialogOpen, setViewResponseDialogOpen] = useState(false);
   const [responseText, setResponseText] = useState("");
    const [carrierResponses, setCarrierResponses] = useState<any>({});
       const [activeResponseKey, setActiveResponseKey] = useState<any>(null);
         const [responseInputDialogOpen, setResponseInputDialogOpen] = useState(false);
    const [toleranceSettings, setToleranceSettings] = useState<any>({
    freightPercent: 0,
    defaultSurchargePercent: 0,
    surchargeOverrides: [],
    onlyNegativeMismatch: false,
  });    
 const { localeText,language } =useLanguage();
     


       const selectedOverviewEntry = useMemo(() => {
    if (!selectedInvoice) return null;
    return overview.find(
      (row:any) =>
        row.rechnungsnummer === selectedInvoice.rechnungsnummer &&
        row.projekt_id === selectedInvoice.projektId
    );
  }, [selectedInvoice, overview]);

    const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
        style: "currency",
        currency: "EUR",
      }),
    [language]
  );

    const carrierViewRows = useMemo(() => {
    if (!selectedInvoice || !details.length) return [];
    const rows:any = [];
    details.forEach((row:any) => {
      if (
        Math.abs(row.differenz) > 0.01 &&
        (!toleranceSettings.onlyNegativeMismatch || row.differenz < 0)
      ) {
        rows.push({
          key: `${row.rowKey}-freight`,
          label: `${localeText.carrierView.shipmentLabel} ${row.sendungsID || row.rowKey}`,
          type: localeText.carrierView.freightType,
          expected: row.preis1,
          actual: row.preis2,
          difference: row.differenz,
        });
      }
      row.nebenkostenDetails?.forEach((detail:any) => {
        const diff = detail.differenz;
        if (
          !detail ||
          Math.abs(diff) <= 0.01 ||
          (toleranceSettings.onlyNegativeMismatch && diff >= 0)
        )
          return;
        rows.push({
          key: `${row.rowKey}-${detail.key}`,
          label: detail.label,
          type: localeText.carrierView.surchargeType,
          expected: detail.preis1 ?? 0,
          actual: detail.preis2 ?? 0,
          difference: diff,
        });
      });
    });
    return rows;
  }, [selectedInvoice, details, localeText.carrierView, toleranceSettings.onlyNegativeMismatch]);


       const formatCurrency = useCallback(
    (value:any) => (typeof value === "number" ? currencyFormatter.format(value) : "—"),
    [currencyFormatter]
  ); 

const makeInvoiceKey = (rechnungsnummer:any, projektId:any) =>
  `${rechnungsnummer || "unbekannt"}__${projektId || "all"}`;



   const invoiceKey = selectedInvoice
    ? makeInvoiceKey(selectedInvoice.rechnungsnummer, selectedInvoice.projektId)
    : null;
 

 
    const handleCarrierViewSubmit = () => {
    persistCarrierResponse(carrierViewMessage);
  };


const persistCarrierResponse = useCallback(
  (message: any, keyOverride?: any): boolean => {
    const trimmed = message?.trim();
    const key = keyOverride || invoiceKey || activeResponseKey;
    if (!trimmed || !key) return false;

    const payload = {
      message: trimmed,
      receivedAt: new Date().toISOString(),
    };

    setCarrierResponses((prev: any) => ({
      ...prev,
      [key]: payload,
    }));

    setResponseText("");
    setCarrierViewMessage("");
    setResponseInputDialogOpen(false);
     onClose();
    setActiveResponseKey(key);
    setViewResponseDialogOpen(true);

    return true;
  },
  [invoiceKey, activeResponseKey]
);

  
  
  
     return (
        <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{localeText.carrierView.title}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              {localeText.carrierView.intro}
            </Typography>

            {selectedOverviewEntry && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {localeText.carrierView.summaryTitle}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {localeText.carrierView.summary.invoice}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedOverviewEntry.rechnungsnummer}
                    </Typography>
                  </Box>
                  {selectedOverviewEntry.projekt_id && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {localeText.carrierView.summary.project}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedOverviewEntry.projekt_id}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {localeText.carrierView.summary.orderTotal}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(selectedOverviewEntry.preis1)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {localeText.carrierView.summary.invoiceTotal}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(selectedOverviewEntry.preis2)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {localeText.carrierView.summary.difference}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: selectedOverviewEntry.differenz > 0 ? "error.main" : "success.main",
                      }}
                    >
                      {formatCurrency(selectedOverviewEntry.differenz)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {localeText.carrierView.tableTitle}
              </Typography>
              {carrierViewRows.length ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{localeText.carrierView.columns.item}</TableCell>
                      <TableCell>{localeText.carrierView.columns.type}</TableCell>
                      <TableCell>{localeText.carrierView.columns.expected}</TableCell>
                      <TableCell>{localeText.carrierView.columns.actual}</TableCell>
                      <TableCell>{localeText.carrierView.columns.difference}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carrierViewRows.map((row:any) => (
                      <TableRow key={row.key}>
                        <TableCell>{row.label}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{formatCurrency(row.expected)}</TableCell>
                        <TableCell>{formatCurrency(row.actual)}</TableCell>
                        <TableCell
                          sx={{
                            color: row.difference > 0 ? "error.main" : "success.main",
                            fontWeight: 600,
                          }}
                        >
                          {formatCurrency(row.difference)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {localeText.carrierView.noDiscrepancies}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {localeText.carrierView.responseTitle}
              </Typography>
              <TextField
                multiline
                minRows={4}
                fullWidth
                placeholder={localeText.carrierView.responsePlaceholder}
                value={carrierViewMessage}
                onChange={(e) => setCarrierViewMessage(e.target.value)}
              />
              <Button
                sx={{ mt: 1 }}
                variant="contained"
                onClick={handleCarrierViewSubmit}
                disabled={!carrierViewMessage.trim()}
              >
                {localeText.carrierView.submit}
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary">
              {localeText.carrierView.info}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>
            {localeText.dialogs.close}
          </Button>
        </DialogActions>
      </Dialog>
  )
}
