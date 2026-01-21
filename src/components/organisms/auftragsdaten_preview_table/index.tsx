import React, { useState } from 'react'
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ConfirmationPopup from '../confirmation_popup';
import { deleteShipmentData, deleteShipmentDataByID } from "@/dialogs/invoice_config/services";

export default function AuftragsdatenPreviewTable({ text }: any) {

  const dispatch = useAppDispatch();
 const userId = useAppSelector((state) => state?.userDetails?.userProfile?.id);
  const activeCarrierId = useAppSelector(
    (state) => state.carriers.activeCarrierId
  );

  const { shipmentData } = useAppSelector((state) => state.shipmentData);
  const shipmentDataForDisplay = shipmentData?.shipmentData || [];

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedIitem, setSelectedIitem] = useState<any | null>(null);

  // CLICK DELETE ICON (sirf us row ki ID save hogi)
  const handleRowDelete = (item: any) => {
    setSelectedIitem(item);     // 👈 current row id
    setOpenConfirm(true);
  };

  // CONFIRM DELETE (sirf wahi id delete hogi)
  const handleClear = async () => {

    if (!selectedIitem) return;
console.log("selectedIitem: ",selectedIitem);

    const {ShipmentId,id}= selectedIitem;
    await deleteShipmentDataByID(
      { 
        projectId: activeCarrierId, 
        shipmentId:ShipmentId,id,userId
      },
      dispatch
    );

    setOpenConfirm(false);
    setSelectedIitem(null);
  };
  

  return (
    <>

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
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {shipmentDataForDisplay.map((row: any, index: number) => (
              <TableRow key={`${row.ShipmentId}-${index}`}>

                <TableCell>{row.ShipmentId}</TableCell>
                <TableCell>{row.ShipmentDate}</TableCell>
                <TableCell>{row.ZipCodeShipper}</TableCell>
                <TableCell>{row.ZipCodeConsignee}</TableCell>
                <TableCell>{row.City}</TableCell>
                <TableCell>
                  {text.countries[row.Country] || row.country}
                </TableCell>
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

                {/* DELETE ICON */}
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleRowDelete(row)} // 👈 EXACT ID
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* CONFIRM POPUP */}
      <ConfirmationPopup
        open={openConfirm}
        title="Confirm Delete"
        message={`Do you want to delete this shipment?\nShipment ID: ${selectedIitem?.shipmentId}`}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleClear}   
      />

    </>
  )
}
