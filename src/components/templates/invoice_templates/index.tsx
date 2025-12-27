
"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setProducts,
  addProduct,
} from "@/store/features/product/productSlice";


import type { Product } from "@/store/features/product/productSlice";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { dashboardTiles } from "../../../data/dashboardTiles";
import CsvComparison from "../../organisms/CsvComparison";

const MOCK_PROJECTS = [
  { id: "p1", firma: "Mustermann", name: "2023", description: "Jahresauswertung", created_at: new Date().toISOString() },
  { id: "p2", firma: "Mustermann", name: "2024", description: "Jahresauswertung", created_at: new Date().toISOString() },
  { id: "p3", firma: "Mustermann", name: "2025", description: "Jahresauswertung", created_at: new Date().toISOString() },
];

// 50+ Invoice Entries (csv1 & csv2 Werte pro Rechnung)
const MOCK_INVOICE_ENTRIES = [
  // Projekt p1
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-001", spedition: "DHL", quelle: "csv1", preis: 120 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-001", spedition: "DHL", quelle: "csv2", preis: 118 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-001", spedition: "DHL", quelle: "csv1", preis: 20, beschreibung: "Nebenkosten Palettentausch" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-001", spedition: "DHL", quelle: "csv2", preis: 18, beschreibung: "Nebenkosten Palettentausch" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-001", spedition: "DHL", quelle: "csv1", preis: 12, beschreibung: "Nebenkosten Avis" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-001", spedition: "DHL", quelle: "csv2", preis: 14, beschreibung: "Nebenkosten Avis" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-001", spedition: "DHL", quelle: "csv1", preis: 9.5, beschreibung: "Nebenkosten Standgeld" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-001", spedition: "DHL", quelle: "csv2", preis: 9.5, beschreibung: "Nebenkosten Standgeld" },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-002", spedition: "DHL", quelle: "csv1", preis: 45 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-002", spedition: "DHL", quelle: "csv2", preis: 46 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-002", spedition: "DHL", quelle: "csv1", preis: 8.5, beschreibung: "Nebenkosten Avis" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-002", spedition: "DHL", quelle: "csv2", preis: 10, beschreibung: "Nebenkosten Avis" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-002", spedition: "DHL", quelle: "csv1", preis: 11, beschreibung: "Nebenkosten Express" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-002", spedition: "DHL", quelle: "csv2", preis: 11.5, beschreibung: "Nebenkosten Express" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-002", spedition: "DHL", quelle: "csv1", preis: 6, beschreibung: "Nebenkosten Dokumente" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-002", spedition: "DHL", quelle: "csv2", preis: 5, beschreibung: "Nebenkosten Dokumente" },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-003", spedition: "DHL", quelle: "csv1", preis: 80 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-003", spedition: "DHL", quelle: "csv2", preis: 82 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-003", spedition: "DHL", quelle: "csv1", preis: 15, beschreibung: "Nebenkosten Express" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-003", spedition: "DHL", quelle: "csv2", preis: 17, beschreibung: "Nebenkosten Express" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-003", spedition: "DHL", quelle: "csv1", preis: 13, beschreibung: "Nebenkosten Palettentausch" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-003", spedition: "DHL", quelle: "csv2", preis: 11, beschreibung: "Nebenkosten Palettentausch" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-003", spedition: "DHL", quelle: "csv1", preis: 7.5, beschreibung: "Nebenkosten Umschlag" },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-003", spedition: "DHL", quelle: "csv2", preis: 6, beschreibung: "Nebenkosten Umschlag" },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-004", spedition: "DHL", quelle: "csv1", preis: 99 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-004", spedition: "DHL", quelle: "csv2", preis: 100 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-005", spedition: "DHL", quelle: "csv1", preis: 150 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-005", spedition: "DHL", quelle: "csv2", preis: 148 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-006", spedition: "DHL", quelle: "csv1", preis: 72 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-006", spedition: "DHL", quelle: "csv2", preis: 74 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-007", spedition: "DHL", quelle: "csv1", preis: 210 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-007", spedition: "DHL", quelle: "csv2", preis: 205 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-008", spedition: "DHL", quelle: "csv1", preis: 95 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-008", spedition: "DHL", quelle: "csv2", preis: 97 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-009", spedition: "DHL", quelle: "csv1", preis: 88 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-009", spedition: "DHL", quelle: "csv2", preis: 85 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-010", spedition: "DHL", quelle: "csv1", preis: 132 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-010", spedition: "DHL", quelle: "csv2", preis: 130 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-011", spedition: "DHL", quelle: "csv1", preis: 66 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-011", spedition: "DHL", quelle: "csv2", preis: 68 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-012", spedition: "DHL", quelle: "csv1", preis: 59 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-012", spedition: "DHL", quelle: "csv2", preis: 61 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-013", spedition: "DHL", quelle: "csv1", preis: 140 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-013", spedition: "DHL", quelle: "csv2", preis: 142 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-014", spedition: "DHL", quelle: "csv1", preis: 75 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-014", spedition: "DHL", quelle: "csv2", preis: 73 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-015", spedition: "DHL", quelle: "csv1", preis: 199 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-015", spedition: "DHL", quelle: "csv2", preis: 201 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-016", spedition: "DHL", quelle: "csv1", preis: 84 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-016", spedition: "DHL", quelle: "csv2", preis: 86 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-017", spedition: "DHL", quelle: "csv1", preis: 110 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-017", spedition: "DHL", quelle: "csv2", preis: 109 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-018", spedition: "DHL", quelle: "csv1", preis: 95 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-018", spedition: "DHL", quelle: "csv2", preis: 96 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-019", spedition: "DHL", quelle: "csv1", preis: 67 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-019", spedition: "DHL", quelle: "csv2", preis: 65 },

  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-020", spedition: "DHL", quelle: "csv1", preis: 180 },
  { projekt_id: "p1", rechnungsnummer: "R-1001", sendungsid: "S-020", spedition: "DHL", quelle: "csv2", preis: 175 },

  { projekt_id: "p1", rechnungsnummer: "R-1002", sendungsid: "S-101", spedition: "DB Schenker", quelle: "csv1", preis: 150 },
  { projekt_id: "p1", rechnungsnummer: "R-1002", sendungsid: "S-101", spedition: "DB Schenker", quelle: "csv2", preis: 155 },
  { projekt_id: "p1", rechnungsnummer: "R-1002", sendungsid: "S-102", spedition: "DB Schenker", quelle: "csv1", preis: 70 },
  { projekt_id: "p2", rechnungsnummer: "R-1002", sendungsid: "S-102", spedition: "DB Schenker", quelle: "csv2", preis: 72 },

  { projekt_id: "p1", rechnungsnummer: "R-1002", sendungsid: "S-103", spedition: "GLS", quelle: "csv1", preis: 98 },
  { projekt_id: "p1", rechnungsnummer: "R-1002", sendungsid: "S-103", spedition: "GLS", quelle: "csv2", preis: 234 },
  { projekt_id: "p1", rechnungsnummer: "R-1002", sendungsid: "S-104", spedition: "GLS", quelle: "csv1", preis: 60 },
  { projekt_id: "p1", rechnungsnummer: "R-1002", sendungsid: "S-104", spedition: "GLS", quelle: "csv2", preis: 59 },
  

  // Projekt p2
  { projekt_id: "p2", rechnungsnummer: "R-2001", sendungsid: "S-101", spedition: "DB Schenker", quelle: "csv1", preis: 150 },
  { projekt_id: "p2", rechnungsnummer: "R-2001", sendungsid: "S-101", spedition: "DB Schenker", quelle: "csv2", preis: 155 },
  { projekt_id: "p2", rechnungsnummer: "R-2001", sendungsid: "S-102", spedition: "DB Schenker", quelle: "csv1", preis: 70 },
  { projekt_id: "p2", rechnungsnummer: "R-2001", sendungsid: "S-102", spedition: "DB Schenker", quelle: "csv2", preis: 72 },

  { projekt_id: "p2", rechnungsnummer: "R-2002", sendungsid: "S-103", spedition: "GLS", quelle: "csv1", preis: 98 },
  { projekt_id: "p2", rechnungsnummer: "R-2002", sendungsid: "S-103", spedition: "GLS", quelle: "csv2", preis: 100 },
  { projekt_id: "p2", rechnungsnummer: "R-2002", sendungsid: "S-104", spedition: "GLS", quelle: "csv1", preis: 60 },
  { projekt_id: "p2", rechnungsnummer: "R-2002", sendungsid: "S-104", spedition: "GLS", quelle: "csv2", preis: 59 },

  // Projekt p3
  { projekt_id: "p3", rechnungsnummer: "R-3001", sendungsid: "S-201", spedition: "Hermes", quelle: "csv1", preis: 130 },
  { projekt_id: "p3", rechnungsnummer: "R-3001", sendungsid: "S-201", spedition: "Hermes", quelle: "csv2", preis: 128 },
  { projekt_id: "p3", rechnungsnummer: "R-3001", sendungsid: "S-202", spedition: "Hermes", quelle: "csv1", preis: 66 },
  { projekt_id: "p3", rechnungsnummer: "R-3001", sendungsid: "S-202", spedition: "Hermes", quelle: "csv2", preis: 64 },

  { projekt_id: "p3", rechnungsnummer: "R-3002", sendungsid: "S-203", spedition: "DHL", quelle: "csv1", preis: 99 },
  { projekt_id: "p3", rechnungsnummer: "R-3002", sendungsid: "S-203", spedition: "DHL", quelle: "csv2", preis: 167 },
  { projekt_id: "p3", rechnungsnummer: "R-3002", sendungsid: "S-204", spedition: "DHL", quelle: "csv1", preis: 77 },
  { projekt_id: "p3", rechnungsnummer: "R-3002", sendungsid: "S-204", spedition: "DHL", quelle: "csv2", preis: 76 },

  // ... weitere Rechnungen bis du ca. 50–60 Zeilen hast
];

const MOCK_INVOICE_ENTRIES_WITH_DATES = MOCK_INVOICE_ENTRIES.map((entry, idx) => ({
  ...entry,
  // simuliertes Rechnungsdatum (neueste Einträge zuerst)
  created_at: entry.created_at || new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
}));

const InvoiceHub = ({
 
  setView, userProfile
}: {
  setView?:()=>{}; userProfile?:{}
}) => {

   const dispatch = useAppDispatch();
  
  // Demo-"Login"
  const mockProfile = { firma: "Mustermann" };
  const effectiveProfile = userProfile ?? mockProfile;

  // State
  const [subView, setSubView] = useState("main");
  const [projects, setProjects] = useState(MOCK_PROJECTS);

  // Nur Projekte der „eingeloggten“ Firma
  const projekteDerFirma = useMemo(
    () => projects.filter((p) => p.firma === effectiveProfile.firma),
    [projects, effectiveProfile.firma]
  );

  const firmInvoiceEntries = useMemo(() => {
    if (!projekteDerFirma.length) return [];
    const allowedIds = projekteDerFirma.map((p) => p.id);
    return MOCK_INVOICE_ENTRIES_WITH_DATES.filter((entry) =>
      allowedIds.includes(entry.projekt_id)
    );
  }, [projekteDerFirma]);

  // Tiles: Invoice Hub leitet in Subview
  const visibleTiles = useMemo(() => {
    return dashboardTiles(setView).map((tile) =>
      tile.title === "Invoice Hub"
        ? { ...tile, onClick: () => setSubView("invoiceHub") }
        : tile
    );
  }, [setView]);



  return (
    <Box>
        <Box mt={6}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => setSubView("main")} sx={{ mb: 2 }}>
            Zurück zum Dashboard
          </Button>

          <Paper elevation={3} sx={{ p: 3, mb: 2, bgcolor: "#f3f4f6" }}>
            <Box display="flex" alignItems="center">
              <ReceiptLongIcon sx={{ fontSize: 40, mr: 2 }} color="primary" />
              <Box>
                <Typography variant="h5">📦 Invoice Hub</Typography>
                <Typography variant="body2" color="text.secondary">
                  Rechnungsprüfung
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Box
            mt={4}
            sx={{
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              p: { xs: 2, md: 3 },
              bgcolor: "#fff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Rechnungen ansehen
              </Typography>
            </Box>

            {firmInvoiceEntries.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Noch keine Rechnungsdaten hinterlegt. Lade CSV-Daten hoch, um die Übersicht zu nutzen.
              </Typography>
            ) : (
              <CsvComparison
                mockEntries={firmInvoiceEntries}
              />
            )}
          </Box>
        </Box>
      
    </Box>
  );
};

export default InvoiceHub;
