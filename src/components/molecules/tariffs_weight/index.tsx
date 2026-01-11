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
import { useAppDispatch } from '@/store/hooks';
import { updateTariffsnData } from '@/utils/helper';

export default function TariffsWeight() {
 const dispatch = useAppDispatch();
    const { pricingText } =useLanguage();
const { ZipCodes,weightsKeys,Weights,tariffsData,countryCode,TariffType } = useGetTariffsChanges();

 const handleTariffRowChange = (rowId:any,  zoneId:any, value:any) => {
         console.log("rowId: 1: ",rowId);

console.log("rowId: 3: ",value);
console.log("rowId: 4: ",zoneId);
console.log("rowId: 5: ",tariffsData?.rates?.[countryCode].Weights[rowId].Prices[zoneId]);

const tariffsDataTmp = {
  ...tariffsData,
  rates: {
    ...tariffsData.rates,
    [countryCode]: {
      ...tariffsData.rates[countryCode],
      Weights: {
        ...tariffsData.rates[countryCode].Weights,
        [rowId]: {
          ...tariffsData.rates[countryCode].Weights[rowId],
          Prices: {
            ...tariffsData.rates[countryCode].Weights[rowId].Prices,
            [zoneId]: value
          }
        }
      }
    }
  }
};
         
       updateTariffsnData(tariffsDataTmp,dispatch)
         };

const tableCellStyle = { padding: '4px 8px' };

const selectedItem = pricingText.tariffs.tariffTypes.find((item:any) => item.key === TariffType)||{};

  return (
   <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableCellStyle}>{selectedItem.label}</TableCell>
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
                             
                            />
                          </TableCell>
                          {(ZipCodes || []).map((zone:any) => (
                            <TableCell key={zone.Id} sx={tableCellStyle}>
                              <TextField
                                size="small"
                                value={Weights?.[key]?.Prices?.[zone.Id] || ""}
                                onChange={(e) =>
                                  handleTariffRowChange(key,  zone.Id, e.target.value,)
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
