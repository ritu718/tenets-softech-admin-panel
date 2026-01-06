import React from 'react'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,

} from "@mui/material";
import { useLanguage } from '@/hooks/useLanguage';
import { useGetTariffsChanges } from '@/hooks/useGetTariffsChanges';

export default function TariffsWeight() {

    const { pricingText } =useLanguage();
const { ZipCodes,weightsKeys,Weights } = useGetTariffsChanges();

 const handleTariffRowChange = (rowId:any, field:any, value:any, zoneId:any = null) => {
         
         };
const tableCellStyle = { padding: '4px 8px' };

  return (
   <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableCellStyle}>{pricingText.tariffs.weightHeader}</TableCell>
                        {(ZipCodes || []).map((zone:any) => (
                          <TableCell key={zone.Id}>{zone.Zone || pricingText.tariffs.zoneName}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(weightsKeys || []).map((key:any) => (
                        <TableRow key={key}>
                          <TableCell sx={tableCellStyle}>
                            <TextField
                              size="small"
                              value={key}
                              onChange={(e) => handleTariffRowChange(key, "weight", e.target.value)}
                            />
                          </TableCell>
                          {(ZipCodes || []).map((zone:any) => (
                            <TableCell key={zone.Id} sx={tableCellStyle}>
                              <TextField
                                size="small"
                                value={Weights?.[key]?.Prices?.[zone.Id] || ""}
                                onChange={(e) =>
                                  handleTariffRowChange(key, "values", e.target.value, zone.Id)
                                }
                                placeholder={pricingText.tariffs.valuePlaceholder}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
  )
}
