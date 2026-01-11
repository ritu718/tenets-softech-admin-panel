import React, { useState } from 'react'
import {
 
  Typography,
  Table,
  
  TableHead,
  TableBody,
  TableRow,
  TableCell,
 
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,

  IconButton,
 
  Stack,
  Paper,
  Tabs,
  Tab,

} from "@mui/material";
import { useLanguage } from '@/hooks/useLanguage';
import { useGetSurchargesChange } from '@/hooks/useGetSurchargesChange';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useHandleSurchargesChanges } from '@/hooks/useHandleSurchargesChanges';

export default function SurchargesTable() {
 const {handleSurchargeRowChange}= useHandleSurchargesChanges();
     const { pricingText } =useLanguage();
     const {Base}= useGetSurchargesChange();

      
                 
                     const handleSurchargeRemove = (rowId:any) => {
                       
                       };
     
  return (
      <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{pricingText.surcharges.columns.label}</TableCell>
                        <TableCell>{pricingText.surcharges.columns.amount}</TableCell>
                        <TableCell>{pricingText.surcharges.columns.unit}</TableCell>
                        <TableCell>{pricingText.surcharges.columns.type}</TableCell>
                        <TableCell>{pricingText.surcharges.columns.description}</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(Base || []).map((row:any,index:any) => (
                        <TableRow key={row?.id}>
                          <TableCell>
                            <TextField
                              size="small"
                              value={row.Term}
                              onChange={(e) => handleSurchargeRowChange(index, "Term", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={row.Value}
                              onChange={(e) => handleSurchargeRowChange(index, "Value", e.target.value)}
                              placeholder={pricingText.surcharges.valuePlaceholder}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              size="small"
                              value={row.Unit || "€"}
                              onChange={(e) => handleSurchargeRowChange(index, "Unit", e.target.value)}
                            >
                              <MenuItem value="€">€</MenuItem>
                              <MenuItem value="%">%</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              size="small"
                              value={row?.Type || "flat"}
                              onChange={(e) => handleSurchargeRowChange(index, "Type", e.target.value)}
                            >
                              <MenuItem value="flat">{pricingText.surcharges.types.flat}</MenuItem>
                              <MenuItem value="percent">{pricingText.surcharges.types.percent}</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={row.Description || ""}
                              onChange={(e) =>
                                handleSurchargeRowChange(index, "Description", e.target.value)
                              }
                              fullWidth
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => handleSurchargeRemove(row.id)}>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
  )
}
