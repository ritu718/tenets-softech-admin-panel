import React from 'react'
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
import { useAppSelector } from '@/store/hooks';


export default function AuftragsdatenPreviewTable({ text }:any) {
 
 
  const {shipmentData} = useAppSelector((state) => state.shipmentData);
    console.log("shipmentData value is: ",shipmentData);
    const shipmentDataForDisplay =shipmentData?.shipmentData||[];
  
  
  
    return (
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
            {shipmentDataForDisplay.map((row:any, index:any) => (
              <TableRow key={`${row.ShipmentId}-${index}`}>
                <TableCell>{row.ShipmentId}</TableCell>
                <TableCell>{row.ShipmentDate}</TableCell>
                <TableCell>{row.ZipCodeShipper }</TableCell>
                <TableCell>{row.ZipCodeConsignee}</TableCell>
                <TableCell>{row.City}</TableCell>
                <TableCell>{text.countries[row.Country] || row.country}</TableCell>
                <TableCell>{row.PackagingType}</TableCell>
                <TableCell>{row.EffectiveWeight}</TableCell>
                <TableCell>{row.LoadingMeters}</TableCell>
                <TableCell>
                  {row.ExpressNextDay ? (
                    <Chip size="small" color="primary" label={text.common.booleanYes} />
                  ) : (
                    <Chip size="small" label={text.common.booleanNo} />
                  )}
                </TableCell>
                <TableCell>
                  {row.B2CNationalSurcharge ? (
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
  )
}
