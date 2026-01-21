"use client";

import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Slide,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from "@mui/icons-material/Info";
import { TransitionProps } from "@mui/material/transitions";
import { motion } from "framer-motion";

// Slide transition
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>; // now async
}

export default function ConfirmationPopup({
  open,
  title = "Confirm Delete",
  message = "Do you want to delete ALL shipment data?",
  onClose,
  onConfirm,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [toastOpen, setToastOpen] = React.useState(false);

  // MESSAGE FORMATTER
  const renderMessage = () => {
    if (!message.includes("Shipment ID")) return message;

    const [text, idPart] = message.split("Shipment ID:");

    return (
      <>
        {text}
        <br />
        <Typography
          component="span"
          sx={{
            fontWeight: 700,
            color: "#0d47a1",
          }}
        >
          Shipment ID: {idPart.trim()}
        </Typography>
      </>
    );
  };

  // HANDLE DELETE
  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setLoading(false);
      setToastOpen(true);
      onClose(); // close popup
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            minWidth: { xs: 300, sm: 420 },
            boxShadow: "0 10px 40px rgba(229,57,53,0.35)",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.35)",
          },
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            bgcolor: "#ffebee",
            color: "#b71c1c",
            px: 3,
            py: 2,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <InfoIcon fontSize="large" />
          </motion.div>

          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>

        {/* BODY */}
        <DialogContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DialogContentText
              sx={{ fontSize: 15, color: "#37474f" }}
            >
              {renderMessage()}
            </DialogContentText>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                color: "#1565c0",
                fontWeight: 500,
              }}
            >
              This action cannot be undone.
            </Typography>
          </motion.div>
        </DialogContent>

        {/* FOOTER */}
        <DialogActions
          sx={{ px: 3, pb: 2, justifyContent: "flex-end", gap: 1 }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              minWidth: 100,
              color: "#1565c0",
              borderColor: "#1565c0",
              "&:hover": {
                backgroundColor: "#e3f2fd",
              },
            }}
            disabled={loading}
          >
            Cancel
          </Button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleDelete}
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteForeverIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                minWidth: 120,
                background:
                  "linear-gradient(45deg, #e53935, #b71c1c)",
                boxShadow: "0 6px 15px rgba(229,57,53,0.45)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #d32f2f, #7f0000)",
                },
              }}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

      {/* SUCCESS TOAST */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Shipment deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
