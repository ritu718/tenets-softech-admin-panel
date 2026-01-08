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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { useAppSelector } from "@/store/hooks";
import AuftragsdatenPreviewTable from "../auftragsdaten_preview_table";
const AuftragsdatenPreview = ({ text, summaryItems, shipmentRows }:any) => {
  
  const {shipmentData} = useAppSelector((state) => state.shipmentData);
  console.log("shipmentData value is: ",shipmentData);

  return(
  <Stack spacing={2}>
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {summaryItems.map((item:any) => (
        <Box
          key={item.label}
          sx={{
            minWidth: 200,
            flex: "1 1 200px",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {item.label}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Paper>

    <Stack direction={{ xs: "column", md: "row" }} spacing={1} flexWrap="wrap">
      <Button startIcon={<AddCircleIcon />} variant="contained" disabled>
        {text.shipments.buttons.add}
      </Button>
      <Button startIcon={<UploadIcon />} variant="outlined" disabled>
        {text.shipments.buttons.import}
      </Button>
      <Button startIcon={<DownloadIcon />} variant="outlined" disabled>
        {text.shipments.buttons.export}
      </Button>
      <Button startIcon={<DeleteForeverIcon />} variant="outlined" color="error" disabled>
        {text.shipments.buttons.clear}
      </Button>
    </Stack>

    <AuftragsdatenPreviewTable text={text} />

    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {text.shipments.note}
      </Typography>
    </Paper>

    <Typography variant="body2" color="text.secondary">
      {text.shipments.info}
    </Typography>
  </Stack>
)};


export default AuftragsdatenPreview;