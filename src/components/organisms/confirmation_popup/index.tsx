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
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from "@mui/icons-material/Info";
import { TransitionProps } from "@mui/material/transitions";
import { motion } from "framer-motion";

// Slide transition
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationPopup({
  open,
  title = "Confirm Delete",
  message = "Do you want to delete ALL shipment data?",
  onClose,
  onConfirm,
}: Props) {
  return (
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
          boxShadow: "0 10px 40px rgba(33,150,243,0.35)",
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
          bgcolor: "#e3f2fd", // light blue
          color: "#0d47a1",   // dark blue
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
            {message}
          </DialogContentText>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              color: "#0d47a1",
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
            color: "#1976d2",
            borderColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#e3f2fd",
              borderColor: "#0d47a1",
            },
          }}
        >
          Cancel
        </Button>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onConfirm}
            variant="contained"
            startIcon={<DeleteForeverIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              minWidth: 120,
              background:
                "linear-gradient(45deg, #2196f3, #1565c0)",
              boxShadow:
                "0 6px 15px rgba(33,150,243,0.45)",
              "&:hover": {
                background:
                  "linear-gradient(45deg, #1e88e5, #0d47a1)",
              },
            }}
          >
            Yes, Delete
          </Button>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
}
