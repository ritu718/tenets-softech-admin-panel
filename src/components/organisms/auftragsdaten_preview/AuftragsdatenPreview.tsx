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
const AuftragsdatenPreview = ({ text, summaryItems, shipmentRows }:any) => (
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

    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{text.shipments.table.shipmentId}</TableCell>
            <TableCell>{text.shipments.table.shipDate}</TableCell>
            <TableCell>{text.shipments.table.zipFrom}</TableCell>
            <TableCell>{text.shipments.table.zipTo}</TableCell>
            <TableCell>{text.shipments.table.city}</TableCell>
            <TableCell>{text.shipments.table.country}</TableCell>
            <TableCell>{text.shipments.table.packaging}</TableCell>
            <TableCell>{text.shipments.table.weight}</TableCell>
            <TableCell>{text.shipments.table.loadingMeters}</TableCell>
            <TableCell>{text.shipments.table.express}</TableCell>
            <TableCell>{text.shipments.table.b2c}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipmentRows.map((row:any, index:any) => (
            <TableRow key={`${row.shipmentId}-${index}`}>
              <TableCell>{row.shipmentId}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.zipFrom}</TableCell>
              <TableCell>{row.zipTo}</TableCell>
              <TableCell>{row.city}</TableCell>
              <TableCell>{text.countries[row.country] || row.country}</TableCell>
              <TableCell>{row.packaging}</TableCell>
              <TableCell>{row.weight}</TableCell>
              <TableCell>{row.loadingMeters}</TableCell>
              <TableCell>
                {row.expressNextDay ? (
                  <Chip size="small" color="primary" label={text.common.booleanYes} />
                ) : (
                  <Chip size="small" label={text.common.booleanNo} />
                )}
              </TableCell>
              <TableCell>
                {row.b2cNational ? (
                  <Chip size="small" color="primary" label={text.common.booleanYes} />
                ) : (
                  <Chip size="small" label={text.common.booleanNo} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {text.shipments.note}
      </Typography>
    </Paper>

    <Typography variant="body2" color="text.secondary">
      {text.shipments.info}
    </Typography>
  </Stack>
);


export default AuftragsdatenPreview;