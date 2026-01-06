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

export default function SurchargesTable() {
     const { pricingText } =useLanguage();
     const {Base}= useGetSurchargesChange();

      const handleSurchargeRowChange = (rowId:any, field:any, value:any) => {
                 
               };

                 
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
                      {(Base || []).map((row:any) => (
                        <TableRow key={row?.id}>
                          <TableCell>
                            <TextField
                              size="small"
                              value={row.Term}
                              onChange={(e) => handleSurchargeRowChange(row?.id, "label", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={row.Value}
                              onChange={(e) => handleSurchargeRowChange(row.id, "amount", e.target.value)}
                              placeholder={pricingText.surcharges.valuePlaceholder}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              size="small"
                              value={row.Unit || "€"}
                              onChange={(e) => handleSurchargeRowChange(row.id, "unit", e.target.value)}
                            >
                              <MenuItem value="€">€</MenuItem>
                              <MenuItem value="%">%</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              size="small"
                              value={row?.Type || "flat"}
                              onChange={(e) => handleSurchargeRowChange(row.id, "type", e.target.value)}
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
                                handleSurchargeRowChange(row.id, "Description", e.target.value)
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
