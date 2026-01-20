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
  Dialog,
  DialogTitle,
  DialogContent,

} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from '@/hooks/useLanguage';
import { useGetSurchargesChange } from '@/hooks/useGetSurchargesChange';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useHandleSurchargesChanges } from '@/hooks/useHandleSurchargesChanges';
import SerchargesPopup from '@/components/organisms/surcharge_popup';

export default function SurchargesTable() {
 const {handleSurchargeRowChange}= useHandleSurchargesChanges();
     const { pricingText } =useLanguage();
     const {Base}= useGetSurchargesChange();
     const [open, setOpen] = useState(false);

      
                 
                     const handleSurchargeRemove = (rowId:any) => {
                       
                       };

                       const dieselExtraCost:any= {
    "id": "ae4324c2-ea97-4c98-892a-f316f2d6a2bd",
    "Term": "Dieselzuschlag",
    "Value": 0,
    "Unit": "%",
    "Description": "Prozentualer Zuschlag / Floatermodell",
    "DieselFloater": {
        "DieselFloaterSource": "EN2X2",
        "DieselFloaterBaseValue": 56,
        "DieselFloaterValues": [
            {
                "65": 45
            },
            {
                "0": 0
            }
        ]
    }
}
     
  return (<>

  <Button variant="outlined" size="small" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
            {pricingText.surcharges.viewOverview}
          </Button>
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
                  <Dialog open={open} onClose={() => setOpen(false)} maxWidth={false} scroll="paper">
          <Stack direction="row">
            <DialogTitle> Übersicht</DialogTitle>

            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </Stack>

          <DialogContent>


            <SerchargesPopup
                    dieselExtraCost={dieselExtraCost}
                    dieselFloaterSources={["ddfs"]}
                    dataUpdateCallback={() => {}}
                  />
          </DialogContent>
        </Dialog> 
                  
                   </>
  )
}
