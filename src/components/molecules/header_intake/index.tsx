"use client";

import React, { useState } from "react";
import { Stack, Button } from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Papa from "papaparse";
import { prepareDataIntake } from "@/utils/csvImportHelper";
import { deleteShipmentData, sendShipmentData } from "@/dialogs/invoice_config/services";
import { exportDataIntakeCSV } from "@/utils/csvExportHelper";

import ConfirmationPopup from "@/components/organisms/confirmation_popup";
import { CShipmentRow } from "@/classes";
import { setShipmentData } from "@/store/features/shipment_data/shipmentDataSlice";

function HeaderIntake() {
  const activeCarrierId = useAppSelector(
    (state) => state.carriers.activeCarrierId
  );

  const { shipmentData } = useAppSelector(
    (state) => state.shipmentData
  );

  const shipmentDataForExport =
    shipmentData?.shipmentData || [];

  const dispatch = useAppDispatch();
  const tariffFileInputRef = React.useRef<any>(null);
  const { localeText } = useLanguage();
  const pricingText = localeText.config.pricing;

  // 🔥 popup state
  const [openConfirm, setOpenConfirm] = useState(false);

  // CSV import
  const handleTariffImport = (file: any) => {
    if (!activeCarrierId || !file) return;

    Papa.parse(file, {
      delimiter: ";",
      skipEmptyLines: true,

      complete: async (result) => {
        try {
          const rows: any[] = result?.data || [];
          if (!rows.length) return;

          const reqObj: any = prepareDataIntake(
            rows,
            activeCarrierId
          );

          await sendShipmentData(reqObj, dispatch);
        } catch (err) {
          console.error("❌ CSV tokImport Error:", err);
        }
      },
    });
  };

  const handleAdd = () => {
    const projectType =0;
let  cShipmentRowItem= new CShipmentRow(projectType);
    if(shipmentDataForExport.length)
    {
      const {ShipmentDate,ZipCodeShipper,ShipmentId,ZipCodeConsignee} = shipmentDataForExport[shipmentDataForExport.length-1];
cShipmentRowItem={...cShipmentRowItem,ShipmentDate,ZipCodeShipper,ShipmentId,ZipCodeConsignee}
    }
    const shipmentDataForExportTmp =[...shipmentDataForExport,cShipmentRowItem];
        dispatch(setShipmentData({...shipmentData,shipmentData:shipmentDataForExportTmp}))
  };

  const handleExport = () => {
    shipmentDataForExport.length &&
      exportDataIntakeCSV(shipmentDataForExport);
  };

  // real delete logic
  const handleClear = () => {
    setOpenConfirm(false);
      deleteShipmentData({ projectId: activeCarrierId }, dispatch);
  };

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        flexWrap="wrap"
      >
        {/* ADD */}
        <Button
          onClick={handleAdd}
          startIcon={<AddCircleIcon />}
          variant="contained"
        >
          {localeText?.shipments?.buttons?.add}
        </Button>

        {/* IMPORT - same style as Export */}
        <Button
          onClick={() =>
            tariffFileInputRef.current?.click()
          }
          startIcon={<UploadIcon />}
          variant="outlined"
        >
          {pricingText.tariffs.importCsv}
        </Button>

        {/* EXPORT */}
        <Button
          onClick={handleExport}
          startIcon={<DownloadIcon />}
          variant="outlined"
        >
          {localeText?.shipments?.buttons?.export}
        </Button>

        {/* DELETE (open popup) */}
        <Button
          onClick={() => setOpenConfirm(true)}
          startIcon={<DeleteForeverIcon />}
          variant="outlined"
          color="error"
        >
          {localeText?.shipments?.buttons?.clear}
        </Button>

        {/* hidden input */}
        <input
          type="file"
          accept=".csv,text/csv"
          ref={tariffFileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleTariffImport(file);
            e.target.value = "";
          }}
        />
      </Stack>

      {/* CONFIRMATION POPUP */}
      <ConfirmationPopup
        open={openConfirm}
        title="Confirm Delete"
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleClear}
      />
    </>
  );
}

export default HeaderIntake;
