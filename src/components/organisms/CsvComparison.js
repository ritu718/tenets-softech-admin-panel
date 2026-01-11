import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
  TextField,
  Collapse,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  Checkbox,
  FormControlLabel,

} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import Papa from "papaparse";
import InvoiceFilter from "./invoice_filter";
import InvoiceFilter2 from "./invoice_filter2";
import { useLanguage } from "@/hooks/useLanguage";

import InvoiceTable from "./invoice_table";
import {
  setOverview
} from "@/store/features/invoice_data/invoiceDataSlice";
import InvoiceConfig from "@/dialogs/invoice_config";
import { setUserInfo } from "@/store/features/user_details/userDetailsSlice";
import Tolerance from "./tolerance";
import { getCarrierConfFomServer } from "@/dialogs/invoice_config/services";



const ALL_SPEDITIONS_VALUE = "__all__";
const parseAmount = (value) => {
  if (Array.isArray(value)) {
    let total = 0;
    let hasValue = false;
    value.forEach((item) => {
      const parsed = parseAmount(item);
      if (parsed !== null) {
        total += parsed;
        hasValue = true;
      }
    });
    return hasValue ? total : null;
  }

  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "boolean") return null;

  if (typeof value === "object") {
    const candidateKeys = ["betrag", "amount", "value", "sum"];
    for (const key of candidateKeys) {
      if (value[key] !== undefined) {
        const parsed = parseAmount(value[key]);
        if (parsed !== null) return parsed;
      }
    }
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    let normalized = trimmed.replace(/\s/g, "").replace(/'/g, "");
    if (normalized.includes(",") && normalized.includes(".")) {
      normalized = normalized.replace(/\./g, "").replace(",", ".");
    } else if (normalized.includes(",")) {
      normalized = normalized.replace(",", ".");
    }
    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
  }

  return null;
};

const getNebenkostenDescriptor = (entry) => {
  if (!entry || typeof entry !== "object") return null;

  const keyIncludesNebenkosten = Object.keys(entry).some((key) =>
    key.toLowerCase().includes("nebenkosten")
  );

  const indicatorFields = [
    "art",
    "type",
    "positionstyp",
    "kostenart",
    "beschreibung",
    "bemerkung",
    "comment",
    "title",
    "name",
    "position",
    "rechnungsposition",
  ];

  const valueIndicatesNebenkosten = indicatorFields.some((field) => {
    const text = entry[field];
    return typeof text === "string" && text.toLowerCase().includes("nebenkosten");
  });

  if (!keyIncludesNebenkosten && !valueIndicatesNebenkosten) return null;

  const labelCandidates = [
    entry.nebenkosten_art,
    entry.nebenkosten_name,
    entry.kostenart,
    entry.positionstyp,
    entry.art,
    entry.beschreibung,
    entry.bemerkung,
    entry.comment,
    entry.title,
    entry.name,
  ];

  const descriptorLabel =
    labelCandidates.find((candidate) => typeof candidate === "string" && candidate.trim())?.trim() ||
    "Nebenkosten";

  const sendungsId = entry.sendungsid || entry.sendungsID || entry.SID || "unbekannt";

  const keyCandidates = [
    entry.nebenkosten_id,
    entry.kosten_id,
    entry.position_id,
    entry.posten_id,
    entry.line_id,
    entry.rechnungsposition,
    `${sendungsId}__${descriptorLabel.toLowerCase()}`,
  ];

  const descriptorKey = keyCandidates.find((candidate) => candidate);

  return {
    key: descriptorKey,
    label: descriptorLabel,
  };
};

const makeInvoiceKey = (rechnungsnummer, projektId) =>
  `${rechnungsnummer || "unbekannt"}__${projektId || "all"}`;


const buildPlaceholderConfigSections = (text) => {
  const sections = text?.configSections;
  return [
    { key: "pricing", ...sections.pricing },
    { key: "auftragsdaten", ...sections.auftragsdaten },
    { key: "price-check", ...sections.reconciliation },
  ];
};

const makeId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;


const MIN_WEIGHT_DEFAULTS = [
  { code: "VP", description: "Viertelpalette", weight: "" },
  { code: "KT", description: "Karton", weight: "" },
  { code: "CC", description: "Collico", weight: "" },
  { code: "HP", description: "Halbpalette", weight: "" },
  { code: "RC", description: "Rollcontainer", weight: "" },
  { code: "CP", description: "Chep-Palette", weight: "" },
  { code: "CT", description: "Container", weight: "" },
  { code: "EB", description: "Einweg-Behälter", weight: "" },
  { code: "EP", description: "Einwegpalette", weight: "" },
  { code: "EW", description: "Einwegpalette", weight: "" },
  { code: "FP", description: "DB Euro-Flachpalette", weight: "150" },
  { code: "GP", description: "Gitterboxpalette", weight: "" },
  { code: "IB", description: "IBC-Behälter", weight: "" },
  { code: "KP", description: "Kundeneigene Palette", weight: "" },
  { code: "PL", description: "Palette", weight: "" },
  { code: "RP", description: "Rahmenpalette", weight: "" },
  { code: "TC", description: "Tankcontainer", weight: "" },
  { code: "VG", description: "Verschlag", weight: "" },
  { code: "XP", description: "Palette", weight: "" },
];

const createMinWeightRow = (row = {}) => ({
  id: makeId("minw"),
  code: row.code || "",
  internalCode: row.internalCode || row.code || "",
  description: row.description || "",
  internalDescription: row.internalDescription || row.description || "",
  weight: row.weight || "",
});

const buildDefaultMinWeights = () => MIN_WEIGHT_DEFAULTS.map((row) => createMinWeightRow(row));

const CsvComparison = ({ projektId, onBack, mockEntries = [] }) => {

  
   const dispatch = useAppDispatch();
     const userId = useAppSelector((state) => state?.userDetails?.userInfo?.userId);
  const { localeText,language } =useLanguage();
  const placeholderSections = useMemo(
    () => buildPlaceholderConfigSections(localeText),
    [localeText]
  );
   
    useEffect(()=>{
         userId&&getCarrierConfFomServer({userId},dispatch)
    },[userId])
    const activeCarrierId = useAppSelector((state) => state.carriers.activeCarrierId);
  const [activeConfigTab, setActiveConfigTab] = useState("pricing");
 
  useEffect(() => {
    if (!placeholderSections.some((section) => section.key === activeConfigTab)) {
      setActiveConfigTab(placeholderSections[0]?.key || "pricing");
    }
  }, [placeholderSections, activeConfigTab]);

    useEffect(() => {
     dispatch(setUserInfo({"userId": "692af2fe34df801237c8fdd1" }));
  }, []);
   
 
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
        style: "currency",
        currency: "EUR",
      }),
    [language]
  );

  const acceptedStatus = useMemo(
    () => ({
      label: localeText.status.accepted,
      color: "success.main",
      tone: "success",
    }),
    [localeText]
  );

  const [loading, setLoading] = useState(true);
  const overview = useAppSelector((state) => state.invoiceData.overview);
   const filteredOverview = useAppSelector((state) => state.invoiceData.filteredOverview);
    
   const toleranceDialogOpen = useAppSelector((state) => state.tolerances.toleranceDialogOpen);
  const [details, setDetails] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
 
  const [toleranceSettings, setToleranceSettings] = useState({
    freightPercent: 0,
    defaultSurchargePercent: 0,
    surchargeOverrides: [],
    onlyNegativeMismatch: false,
  });
  const [carrierResponses, setCarrierResponses] = useState({});
  const [invoiceOverrides, setInvoiceOverrides] = useState({});
  const [notifiedInvoices, setNotifiedInvoices] = useState({});
  const [responseInputDialogOpen, setResponseInputDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [viewResponseDialogOpen, setViewResponseDialogOpen] = useState(false);
  const [activeResponseKey, setActiveResponseKey] = useState(null);
  const [carrierViewDialogOpen, setCarrierViewDialogOpen] = useState(false);
  const [carrierViewMessage, setCarrierViewMessage] = useState("");
  const [carrierCorrections, setCarrierCorrections] = useState({});
  const [clarificationThreads, setClarificationThreads] = useState({});
  const [clarificationMessage, setClarificationMessage] = useState("");

  const [priceCheckOverrides, setPriceCheckOverrides] = useState({});
  const [priceFixDialog, setPriceFixDialog] = useState({
    open: false,
    shipment: null,
    carrier: null,
    error: null,
    countryCode: "DE",
  });

  const matchesProjekt = useCallback(
    (entry) => {
      if (!projektId || projektId === "all") return true;
      if (Array.isArray(projektId)) {
        return projektId.includes(entry.projekt_id);
      }
      return entry.projekt_id === projektId;
    },
    [projektId]
  );

  const resolveEntryDate = (entry) => {
    const raw =
      entry.rechnungsdatum ||
      entry.invoice_date ||
      entry.date ||
      entry.zeitraum_start ||
      entry.zeitraum ||
      entry.created_at ||
      entry.timestamp;
    if (!raw) return null;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const matchesDateRange = useCallback(
    (entryDate) => {
      if (!entryDate) return true;
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      if (from && entryDate < from) return false;
      if (to) {
        const endOfDay = new Date(to);
        endOfDay.setHours(23, 59, 59, 999);
        if (entryDate > endOfDay) return false;
      }
      return true;
    },
    [dateFrom, dateTo]
  );

  const formatDate = useCallback(
    (isoString) => {
      if (!isoString) return "—";
      const parsed = new Date(isoString);
      return Number.isNaN(parsed.getTime())
        ? "—"
        : parsed.toLocaleDateString(language === "de" ? "de-DE" : "en-US");
    },
    [language]
  );

  const formatCurrency = useCallback(
    (value) => (typeof value === "number" ? currencyFormatter.format(value) : "—"),
    [currencyFormatter]
  );

  const createOverrideEntry = () => ({
    id: `${Date.now()}-${Math.random()}`,
    label: "",
    percent: 0,
  });

  const evaluateStatus = useCallback(
    (expectedValue, actualValue, tolerancePercent = 0, onlyNegative = false) => {
      if (!Number.isFinite(expectedValue) && !Number.isFinite(actualValue)) {
        return { label: localeText.status.noData, color: "text.secondary", tone: "neutral" };
      }
      const expected = Number.isFinite(expectedValue) ? expectedValue : 0;
      const actual = Number.isFinite(actualValue) ? actualValue : 0;
      const rawDifference = expected - actual;
      if (onlyNegative && rawDifference >= 0) {
        return { label: localeText.status.ok, color: "success.main", tone: "success" };
      }
      const base = Math.max(Math.abs(expected), 1);
      const diff = Math.abs(actual - expected);
      const allowed = (Math.max(tolerancePercent, 0) / 100) * base;
      const ok = diff <= allowed;
      return ok
        ? { label: localeText.status.ok, color: "success.main", tone: "success" }
        : { label: localeText.status.error, color: "error.main", tone: "error" };
    },
    [localeText]
  );

  const getSurchargeTolerance = useCallback(
    (label) => {
      if (!label) return toleranceSettings.defaultSurchargePercent;
      const normalized = label.trim().toLowerCase();
      const match = toleranceSettings.surchargeOverrides.find(
        (item) =>
          item.label &&
          item.label.trim().toLowerCase() === normalized
      );
      return Number.isFinite(match?.percent)
        ? match.percent
        : toleranceSettings.defaultSurchargePercent;
    },
    [toleranceSettings]
  );

  const handleToleranceFieldChange = (field) => (event) => {
    const parsed = Number(event.target.value);
    setToleranceSettings((prev) => ({
      ...prev,
      [field]: Number.isFinite(parsed) ? Math.max(parsed, 0) : prev[field],
    }));
  };

  const handleOverrideChange = (id, field, value) => {
    setToleranceSettings((prev) => ({
      ...prev,
      surchargeOverrides: prev.surchargeOverrides.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "percent"
                  ? Math.max(Number(value) || 0, 0)
                  : value,
            }
          : item
      ),
    }));
  };

  const handleRemoveOverride = (id) => {
    setToleranceSettings((prev) => ({
      ...prev,
      surchargeOverrides: prev.surchargeOverrides.filter((item) => item.id !== id),
    }));
  };

  const handleAddOverride = () => {
    setToleranceSettings((prev) => ({
      ...prev,
      surchargeOverrides: [...prev.surchargeOverrides, createOverrideEntry()],
    }));
  };

  const renderStatusChip = (status) => (
    <Chip
      size="small"
      label={status.label}
      sx={{
        bgcolor:
          status.tone === "success"
            ? "success.light"
            : status.tone === "error"
            ? "error.light"
            : "grey.200",
        color: status.color,
        fontWeight: "bold",
      }}
    />
  );

  const handleSaveCarrierResponse = () => {
    persistCarrierResponse(responseText);
  };

  const handleOpenResponseViewer = (key) => {
    setActiveResponseKey(key);
    setViewResponseDialogOpen(true);
  };

  const handleAcceptInvoice = (keyOverride) => {
    const key = keyOverride || invoiceKey || activeResponseKey;
    if (!key) return;
    setInvoiceOverrides((prev) => ({
      ...prev,
      [key]: {
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      },
    }));
    setViewResponseDialogOpen(false);
  };

  const handleCarrierViewSubmit = () => {
    persistCarrierResponse(carrierViewMessage);
  };

  const handleAddClarification = () => {
    const trimmed = clarificationMessage.trim();
    const key = activeResponseKey || invoiceKey;
    if (!trimmed || !key) return;
    setClarificationThreads((prev) => ({
      ...prev,
      [key]: [
        ...(prev[key] || []),
        {
          id: `${key}-${Date.now()}`,
          author: localeText.dialogs.clarificationFromShipper,
          role: "shipper",
          message: trimmed,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    setClarificationMessage("");
  };

  const activeResponse = activeResponseKey
    ? carrierResponses[activeResponseKey]
    : null;

  // Initial: aus Mock-Daten laden
  useEffect(() => {
    setLoading(true);
    const grouped = mockEntries.reduce((acc, row) => {
      if (!matchesProjekt(row)) return acc;
      const entryDate = resolveEntryDate(row);
      if (!matchesDateRange(entryDate)) return acc;

      const key = `${row.projekt_id || "unbekannt"}__${row.rechnungsnummer}`;
      if (!acc[key]) {
        acc[key] = {
          rechnungsnummer: row.rechnungsnummer,
          projekt_id: row.projekt_id,
          preis1: 0,
          preis2: 0,
          spedition: row.spedition || "",
          datum: entryDate,
        };
      }

      if (row.quelle === "csv1") acc[key].preis1 += Number(row.preis);
      if (row.quelle === "csv2") acc[key].preis2 += Number(row.preis);
      if (!acc[key].spedition && row.spedition) acc[key].spedition = row.spedition;
      if (entryDate && (!acc[key].datum || entryDate > acc[key].datum)) {
        acc[key].datum = entryDate;
      }

      return acc;
    }, {});

    const result = Object.values(grouped).map((info) => ({
      ...info,
      datum: info.datum ? info.datum.toISOString() : null,
      differenz: info.preis1 - info.preis2,
    }));
dispatch(setOverview(result));
   
    setLoading(false);
  }, [mockEntries, matchesDateRange, matchesProjekt]);

  // Details-Ansicht
  useEffect(() => {
    if (!selectedInvoice) return;
    const rows = mockEntries.filter((entry) => {
      if (selectedInvoice.projektId) {
        return (
          entry.rechnungsnummer === selectedInvoice.rechnungsnummer &&
          entry.projekt_id === selectedInvoice.projektId
        );
      }
      return (
        entry.rechnungsnummer === selectedInvoice.rechnungsnummer &&
        matchesProjekt(entry)
      );
    });
    const grouped = {};
    rows.forEach((entry, index) => {
      const rawId = entry.sendungsid || entry.sendungsID || entry.SID || "";
      const id = rawId || `unbekannt-${index}`;
      if (!grouped[id]) {
        grouped[id] = {
          rowKey: id,
          sendungsID: rawId || "—",
          spedition: entry.spedition || "",
          preis1: 0,
          preis2: 0,
          nebenkostenTotals: { preis1: null, preis2: null },
          nebenkostenDetailsMap: {},
        };
      }

      const preisValue = parseAmount(entry.preis);
      const descriptor = getNebenkostenDescriptor(entry);

      if (descriptor) {
        const detailKey = descriptor.key;
        if (!grouped[id].nebenkostenDetailsMap[detailKey]) {
          grouped[id].nebenkostenDetailsMap[detailKey] = {
            key: detailKey,
            label: descriptor.label,
            preis1: null,
            preis2: null,
          };
        }
        const detail = grouped[id].nebenkostenDetailsMap[detailKey];

        if (entry.quelle === "csv1" && typeof preisValue === "number") {
          detail.preis1 = (detail.preis1 ?? 0) + preisValue;
          grouped[id].nebenkostenTotals.preis1 =
            (grouped[id].nebenkostenTotals.preis1 ?? 0) + preisValue;
        }
        if (entry.quelle === "csv2" && typeof preisValue === "number") {
          detail.preis2 = (detail.preis2 ?? 0) + preisValue;
          grouped[id].nebenkostenTotals.preis2 =
            (grouped[id].nebenkostenTotals.preis2 ?? 0) + preisValue;
        }
      } else {
        if (entry.quelle === "csv1" && typeof preisValue === "number") {
          grouped[id].preis1 += preisValue;
        }
        if (entry.quelle === "csv2" && typeof preisValue === "number") {
          grouped[id].preis2 += preisValue;
        }
      }
    });

    const result = Object.values(grouped).map((row) => {
      const { nebenkostenDetailsMap, ...baseRow } = row;
      const nebenkostenDetails = Object.values(nebenkostenDetailsMap).map((detail) => ({
        ...detail,
        differenz: (detail.preis1 ?? 0) - (detail.preis2 ?? 0),
      }));
      const hasNebenkosten = nebenkostenDetails.length > 0;
      const nebenkostenTotalValue = hasNebenkosten
        ? (baseRow.nebenkostenTotals.preis1 ??
            baseRow.nebenkostenTotals.preis2 ??
            0)
        : null;

      return {
        rowKey: baseRow.rowKey,
        sendungsID: baseRow.sendungsID,
        spedition: baseRow.spedition,
        preis1: baseRow.preis1,
        preis2: baseRow.preis2,
        differenz: baseRow.preis1 - baseRow.preis2,
        nebenkostenDetails,
        nebenkostenTotals: baseRow.nebenkostenTotals,
        nebenkostenTotal: nebenkostenTotalValue,
      };
    });
    setDetails(result);
  }, [selectedInvoice, mockEntries, matchesProjekt]);

  useEffect(() => {
    setExpandedRows({});
  }, [selectedInvoice]);
  useEffect(() => {
    if (!selectedInvoice) {
      setCarrierViewDialogOpen(false);
      setCarrierViewMessage("");
      setClarificationMessage("");
    }
  }, [selectedInvoice]);

  useEffect(() => {
    if (!viewResponseDialogOpen) {
      setClarificationMessage("");
    }
  }, [viewResponseDialogOpen]);

  const invoiceKey = selectedInvoice
    ? makeInvoiceKey(selectedInvoice.rechnungsnummer, selectedInvoice.projektId)
    : null;
  const currentCarrierResponse = invoiceKey ? carrierResponses[invoiceKey] : null;
  const invoiceAccepted = Boolean(
    invoiceKey && invoiceOverrides[invoiceKey]?.status === "accepted"
  );

  const selectedOverviewEntry = useMemo(() => {
    if (!selectedInvoice) return null;
    return overview.find(
      (row) =>
        row.rechnungsnummer === selectedInvoice.rechnungsnummer &&
        row.projekt_id === selectedInvoice.projektId
    );
  }, [selectedInvoice, overview]);

  const persistCarrierResponse = useCallback(
    (message, keyOverride) => {
      const trimmed = message?.trim();
      const key = keyOverride || invoiceKey || activeResponseKey;
      if (!trimmed || !key) return false;
      const payload = {
        message: trimmed,
        receivedAt: new Date().toISOString(),
      };
      setCarrierResponses((prev) => ({
        ...prev,
        [key]: payload,
      }));
      setResponseText("");
      setCarrierViewMessage("");
      setResponseInputDialogOpen(false);
      setCarrierViewDialogOpen(false);
      setActiveResponseKey(key);
      setViewResponseDialogOpen(true);
      return true;
    },
    [invoiceKey, activeResponseKey]
  );

  const invoiceDetailStatus = useMemo(() => {
    if (!selectedInvoice || !details.length) return null;
    const key = makeInvoiceKey(selectedInvoice.rechnungsnummer, selectedInvoice.projektId);
    const override = invoiceOverrides[key];
    if (override?.status === "accepted") {
      return { ...acceptedStatus, override: true };
    }
    const hasError = details.some((row) => {
      const freightStatus = evaluateStatus(
        row.preis1,
        row.preis2,
        toleranceSettings.freightPercent,
        toleranceSettings.onlyNegativeMismatch
      );
      if (freightStatus.tone === "error") return true;
      return row.nebenkostenDetails?.some((detail) => {
        const surchargeStatus = evaluateStatus(
          detail.preis1 ?? 0,
          detail.preis2 ?? 0,
          getSurchargeTolerance(detail.label),
          toleranceSettings.onlyNegativeMismatch
        );
        return surchargeStatus.tone === "error";
      });
    });
    return hasError
      ? { label: localeText.status.error, color: "error.main", tone: "error" }
      : { label: localeText.status.ok, color: "success.main", tone: "success" };
  }, [
    details,
    selectedInvoice,
    toleranceSettings.freightPercent,
    getSurchargeTolerance,
    invoiceOverrides,
    localeText.status.error,
    localeText.status.ok,
  ]);

  useEffect(() => {
    if (!invoiceKey || !invoiceDetailStatus) return;
    if (invoiceDetailStatus.tone !== "error") return;
    setNotifiedInvoices((prev) => {
      if (prev[invoiceKey]) return prev;
      console.info(
        `[Automatisch] Spedition informiert: Rechnung ${selectedInvoice.rechnungsnummer} (Projekt ${selectedInvoice.projektId || "ohne"})`
      );
      return { ...prev, [invoiceKey]: true };
    });
  }, [invoiceDetailStatus, invoiceKey, selectedInvoice]);

  useEffect(() => {
    if (!invoiceKey || invoiceDetailStatus?.tone !== "error") return;
    setClarificationThreads((prev) => {
      if (prev[invoiceKey]) return prev;
      const now = new Date().toISOString();
      return {
        ...prev,
        [invoiceKey]: [
          {
            id: `${invoiceKey}-clarification-demo-shipper`,
            author: localeText.dialogs.clarificationFromShipper,
            role: "shipper",
            message: localeText.dialogs.clarificationDemoShipper,
            createdAt: now,
          },
          {
            id: `${invoiceKey}-clarification-demo-carrier`,
            author: localeText.dialogs.clarificationFromCarrier,
            role: "carrier",
            message: localeText.dialogs.clarificationDemoCarrier,
            createdAt: now,
          },
        ],
      };
    });
  }, [
    invoiceKey,
    invoiceDetailStatus?.tone,
    localeText.dialogs.clarificationFromShipper,
    localeText.dialogs.clarificationFromCarrier,
    localeText.dialogs.clarificationDemoShipper,
    localeText.dialogs.clarificationDemoCarrier,
  ]);

  useEffect(() => {
    if (!invoiceKey || invoiceDetailStatus?.tone !== "error") return;
    setCarrierCorrections((prev) => {
      if (prev[invoiceKey]) return prev;
      const baseInvoice = selectedInvoice?.rechnungsnummer || "INV";
      return {
        ...prev,
        [invoiceKey]: {
          newInvoiceNumber: `${baseInvoice}-KORR`,
          stornoNumber: `${baseInvoice}-ST`,
          creditNoteNumber: `${baseInvoice}-CR`,
        },
      };
    });
  }, [invoiceKey, invoiceDetailStatus?.tone, selectedInvoice]);

  const carrierViewRows = useMemo(() => {
    if (!selectedInvoice || !details.length) return [];
    const rows = [];
    details.forEach((row) => {
      if (
        Math.abs(row.differenz) > 0.01 &&
        (!toleranceSettings.onlyNegativeMismatch || row.differenz < 0)
      ) {
        rows.push({
          key: `${row.rowKey}-freight`,
          label: `${localeText.carrierView.shipmentLabel} ${row.sendungsID || row.rowKey}`,
          type: localeText.carrierView.freightType,
          expected: row.preis1,
          actual: row.preis2,
          difference: row.differenz,
        });
      }
      row.nebenkostenDetails?.forEach((detail) => {
        const diff = detail.differenz;
        if (
          !detail ||
          Math.abs(diff) <= 0.01 ||
          (toleranceSettings.onlyNegativeMismatch && diff >= 0)
        )
          return;
        rows.push({
          key: `${row.rowKey}-${detail.key}`,
          label: detail.label,
          type: localeText.carrierView.surchargeType,
          expected: detail.preis1 ?? 0,
          actual: detail.preis2 ?? 0,
          difference: diff,
        });
      });
    });
    return rows;
  }, [selectedInvoice, details, localeText.carrierView, toleranceSettings.onlyNegativeMismatch]);

  const activeClarificationKey = activeResponseKey || invoiceKey;
  const activeClarifications = activeClarificationKey
    ? clarificationThreads[activeClarificationKey] || []
    : [];
  const activeCorrections = activeClarificationKey
    ? carrierCorrections[activeClarificationKey] || {
        newInvoiceNumber: "",
        stornoNumber: "",
        creditNoteNumber: "",
      }
    : { newInvoiceNumber: "", stornoNumber: "", creditNoteNumber: "" };

  const handleCorrectionChange = (field) => (event) => {
    const value = event.target.value;
    if (!activeClarificationKey) return;
    setCarrierCorrections((prev) => ({
      ...prev,
      [activeClarificationKey]: {
        ...(prev[activeClarificationKey] || {}),
        [field]: value,
      },
    }));
  };

  const speditions = useMemo(() => {
    const all = overview.map((o) => o.spedition || "");
    return [ALL_SPEDITIONS_VALUE, ...Array.from(new Set(all))];
  }, [overview]);


  useEffect(() => {
    if (!selectedInvoice) return;
    const stillVisible = overview.some(
      (row) =>
        row.rechnungsnummer === selectedInvoice.rechnungsnummer &&
        row.projekt_id === selectedInvoice.projektId
    );
    if (!stillVisible) {
      setSelectedInvoice(null);
    }
  }, [overview, selectedInvoice]);

  const exportCsv = () => {
    const csv = Papa.unparse(
      (selectedInvoice ? details : filteredOverview).map((row) => ({
        ...(selectedInvoice
          ? {
              sendungsID: row.sendungsID,
              spedition: row.spedition,
              nebenkosten:
                typeof row.nebenkostenTotal === "number"
                  ? row.nebenkostenTotal.toFixed(2)
                  : "",
              auftrags_summe: row.preis1.toFixed(2),
              rechnungs_summe: row.preis2.toFixed(2),
              differenz: row.differenz.toFixed(2),
            }
          : {
              rechnungsnummer: row.rechnungsnummer,
              projekt_id: row.projekt_id || "",
              rechnungsdatum: row.datum || "",
              spedition: row.spedition,
              auftrags_summe: row.preis1.toFixed(2),
              rechnungs_summe: row.preis2.toFixed(2),
              differenz: row.differenz.toFixed(2),
            }),
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", selectedInvoice ? "rechnungsdetails.csv" : "rechnungsuebersicht.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <CircularProgress />;

  

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 2, flexWrap: "wrap" }}>
        {!selectedInvoice && onBack && (
          <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
            {localeText.header.back}
          </Button>
        )}
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {localeText.header.title}
        </Typography>
        <InvoiceFilter  />
        
      </Box>

      {selectedInvoice ? (
        <>
          <Button startIcon={<ArrowBackIcon />} onClick={() => setSelectedInvoice(null)} sx={{ mb: 2 }}>
            {localeText.detail.back}
          </Button>
          <Typography variant="h6" gutterBottom>
            {localeText.detail.invoice}: {selectedInvoice.rechnungsnummer}
          </Typography>
          {selectedInvoice.projektId && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {localeText.detail.project}: {selectedInvoice.projektId}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Button onClick={exportCsv}>{localeText.buttons.exportPlain}</Button>
            <Button variant="outlined" onClick={() => dispatch(setToleranceDialogOpen(true))}>
              {localeText.buttons.tolerance}
            </Button>
          </Box>

          {invoiceDetailStatus && (
            <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle2">{localeText.detail.statusTitle}</Typography>
              {renderStatusChip(invoiceDetailStatus)}
            </Box>
          )}

          {invoiceDetailStatus?.tone === "error" && !invoiceAccepted && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 1,
                bgcolor: "error.light",
                color: "error.contrastText",
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                {localeText.detail.errorNotice}
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setResponseInputDialogOpen(true)}
              >
                {localeText.detail.errorButton}
              </Button>
              <Button
                variant="contained"
                color="inherit"
                sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 } }}
                onClick={() => setCarrierViewDialogOpen(true)}
              >
                {localeText.carrierView.button}
              </Button>
            </Box>
          )}

          {currentCarrierResponse && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {localeText.detail.responseTitle} (
                {new Date(currentCarrierResponse.receivedAt).toLocaleString(
                  language === "de" ? "de-DE" : "en-US"
                )}
                )
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {localeText.detail.responseSubtitle}
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleOpenResponseViewer(invoiceKey)}
              >
                {localeText.detail.responseButton}
              </Button>
            </Box>
          )}

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{localeText.detail.columns.sendung}</TableCell>
                <TableCell>{localeText.detail.columns.carrier}</TableCell>
                <TableCell>{localeText.detail.columns.surcharges}</TableCell>
                <TableCell>{localeText.detail.columns.orderSum}</TableCell>
                <TableCell>{localeText.detail.columns.invoiceSum}</TableCell>
                <TableCell>{localeText.detail.columns.difference}</TableCell>
                <TableCell>{localeText.detail.columns.status}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.map((row, idx) => {
                const baseFreightStatus = evaluateStatus(
                  row.preis1,
                  row.preis2,
                  toleranceSettings.freightPercent
                );
                const freightStatus = invoiceAccepted ? acceptedStatus : baseFreightStatus;
                return (
                  <React.Fragment key={row.rowKey || idx}>
                    <TableRow
                      hover
                      sx={{ cursor: row.nebenkostenDetails?.length ? "pointer" : "default" }}
                      onClick={() => {
                        if (row.nebenkostenDetails?.length) {
                          setExpandedRows((prev) => ({
                            ...prev,
                            [row.rowKey]: !prev[row.rowKey],
                          }));
                        }
                      }}
                    >
                      <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {row.nebenkostenDetails?.length ? (
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              setExpandedRows((prev) => ({
                                ...prev,
                                [row.rowKey]: !prev[row.rowKey],
                              }));
                            }}
                          >
                            {expandedRows[row.rowKey] ? (
                              <KeyboardArrowUpIcon fontSize="small" />
                            ) : (
                              <KeyboardArrowDownIcon fontSize="small" />
                            )}
                          </IconButton>
                        ) : null}
                        {row.sendungsID}
                      </TableCell>
                      <TableCell>{row.spedition}</TableCell>
                      <TableCell>{formatCurrency(row.nebenkostenTotal)}</TableCell>
                      <TableCell>{formatCurrency(row.preis1)}</TableCell>
                      <TableCell>{formatCurrency(row.preis2)}</TableCell>
                      <TableCell sx={{ color: row.differenz > 0 ? "green" : "red", fontWeight: "bold" }}>
                        {formatCurrency(row.differenz)}
                      </TableCell>
                      <TableCell>{renderStatusChip(freightStatus)}</TableCell>
                    </TableRow>
                    {row.nebenkostenDetails?.length ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ py: 0 }}>
                          <Collapse in={Boolean(expandedRows[row.rowKey])} timeout="auto" unmountOnExit>
                            <Box sx={{ m: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {localeText.detail.surchargeTable.title}
                              </Typography>
                              <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>{localeText.detail.surchargeTable.label}</TableCell>
                                      <TableCell>{localeText.detail.surchargeTable.orderSum}</TableCell>
                                      <TableCell>{localeText.detail.surchargeTable.invoiceSum}</TableCell>
                                      <TableCell>{localeText.detail.surchargeTable.difference}</TableCell>
                                      <TableCell>{localeText.detail.surchargeTable.status}</TableCell>
                                    </TableRow>
                                  </TableHead>
                                <TableBody>
                                  {row.nebenkostenDetails.map((detail) => {
                                    const baseSurchargeStatus = evaluateStatus(
                                      detail.preis1 ?? 0,
                                      detail.preis2 ?? 0,
                                      getSurchargeTolerance(detail.label)
                                    );
                                    const surchargeStatus = invoiceAccepted
                                      ? acceptedStatus
                                      : baseSurchargeStatus;
                                    return (
                                      <TableRow key={detail.key}>
                                        <TableCell>{detail.label}</TableCell>
                                        <TableCell>{formatCurrency(detail.preis1)}</TableCell>
                                        <TableCell>{formatCurrency(detail.preis2)}</TableCell>
                                        <TableCell
                                          sx={{
                                            color: detail.differenz > 0 ? "green" : "red",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {formatCurrency(detail.differenz)}
                                        </TableCell>
                                        <TableCell>{renderStatusChip(surchargeStatus)}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <>
          <InvoiceFilter2/>
          <InvoiceTable/>
       
        </>
      )}

      <InvoiceConfig/>


      <Dialog
        open={priceFixDialog.open}
        onClose={() => setPriceFixDialog((prev) => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {localeText.config.pricing.addCarrierDialog.priceFixTitle ||
            localeText.config.pricing.addCarrierDialog.title}
        </DialogTitle>
        <DialogContent dividers>
          {(() => {
            const fallbackCarrier = {
              name: "Muster Spedition GmbH",
              street: "Musterstraße",
              houseNumber: "12",
              zip: "20095",
              city: "Hamburg",
              country: "Deutschland",
              contact: "Max Mustermann",
              phone: "+49 40 123456",
              email: "pricing@muster.de",
              customerNumber: "CUST-12345",
            };
            const carrier = priceFixDialog.carrier || fallbackCarrier;
            const detailZip = priceFixDialog.details?.zip || priceFixDialog.shipment?.zipTo || "—";
            const detailWeight = priceFixDialog.details?.weight || priceFixDialog.shipment?.weight || "—";
            const errorLabel = priceFixDialog.error || "Preisfehler";
            return (
            <Stack spacing={2}>
              <Typography variant="subtitle2">{carrier.name}</Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2">
                  {carrier.street || fallbackCarrier.street} {carrier.houseNumber || fallbackCarrier.houseNumber}
                </Typography>
                <Typography variant="body2">
                  {carrier.zip || fallbackCarrier.zip} {carrier.city || fallbackCarrier.city}
                </Typography>
                <Typography variant="body2">{carrier.country || fallbackCarrier.country}</Typography>
                <Typography variant="body2">
                  {carrier.contact || fallbackCarrier.contact} {carrier.phone || fallbackCarrier.phone}
                </Typography>
                <Typography variant="body2">{carrier.email || fallbackCarrier.email}</Typography>
                <Typography variant="body2">
                  {localeText.addCarrierDialog?.customerNumber || "Kundennummer"}:{" "}
                  {carrier.customerNumber || fallbackCarrier.customerNumber}
                </Typography>
              </Stack>
              <TextField
                label="Preis (EUR)"
                type="text"
                value={priceFixDialog.value || ""}
                onChange={(e) => setPriceFixDialog((prev) => ({ ...prev, value: e.target.value }))}
                fullWidth
              />
              <Typography variant="body2" color={priceFixDialog.error ? "error" : "text.secondary"}>
                {errorLabel} (PLZ: {detailZip}, Gewicht: {detailWeight})
              </Typography>
            </Stack>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPriceFixDialog((prev) => ({ ...prev, open: false }))}>
            {localeText.addCarrierDialog?.cancel || localeText.dialogs.close}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (priceFixDialog.shipment?.shipmentId) {
                setPriceCheckOverrides((prev) => ({
                  ...prev,
                  [priceFixDialog.shipment.shipmentId]: priceFixDialog.value || "",
                }));
              }
              setPriceFixDialog((prev) => ({ ...prev, open: false, value: "" }));
            }}
          >
            {localeText.dialogs.save || "Speichern"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={carrierViewDialogOpen}
        onClose={() => setCarrierViewDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{localeText.carrierView.title}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              {localeText.carrierView.intro}
            </Typography>

            {selectedOverviewEntry && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {localeText.carrierView.summaryTitle}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {localeText.carrierView.summary.invoice}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedOverviewEntry.rechnungsnummer}
                    </Typography>
                  </Box>
                  {selectedOverviewEntry.projekt_id && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {localeText.carrierView.summary.project}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedOverviewEntry.projekt_id}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {localeText.carrierView.summary.orderTotal}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(selectedOverviewEntry.preis1)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {localeText.carrierView.summary.invoiceTotal}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(selectedOverviewEntry.preis2)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {localeText.carrierView.summary.difference}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: selectedOverviewEntry.differenz > 0 ? "error.main" : "success.main",
                      }}
                    >
                      {formatCurrency(selectedOverviewEntry.differenz)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {localeText.carrierView.tableTitle}
              </Typography>
              {carrierViewRows.length ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{localeText.carrierView.columns.item}</TableCell>
                      <TableCell>{localeText.carrierView.columns.type}</TableCell>
                      <TableCell>{localeText.carrierView.columns.expected}</TableCell>
                      <TableCell>{localeText.carrierView.columns.actual}</TableCell>
                      <TableCell>{localeText.carrierView.columns.difference}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carrierViewRows.map((row) => (
                      <TableRow key={row.key}>
                        <TableCell>{row.label}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{formatCurrency(row.expected)}</TableCell>
                        <TableCell>{formatCurrency(row.actual)}</TableCell>
                        <TableCell
                          sx={{
                            color: row.difference > 0 ? "error.main" : "success.main",
                            fontWeight: 600,
                          }}
                        >
                          {formatCurrency(row.difference)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {localeText.carrierView.noDiscrepancies}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {localeText.carrierView.responseTitle}
              </Typography>
              <TextField
                multiline
                minRows={4}
                fullWidth
                placeholder={localeText.carrierView.responsePlaceholder}
                value={carrierViewMessage}
                onChange={(e) => setCarrierViewMessage(e.target.value)}
              />
              <Button
                sx={{ mt: 1 }}
                variant="contained"
                onClick={handleCarrierViewSubmit}
                disabled={!carrierViewMessage.trim()}
              >
                {localeText.carrierView.submit}
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary">
              {localeText.carrierView.info}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCarrierViewDialogOpen(false)}>
            {localeText.dialogs.close}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={responseInputDialogOpen}
        onClose={() => setResponseInputDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{localeText.dialogs.responseInputTitle}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {localeText.dialogs.responseInputDescription}
          </Typography>
          <TextField
            autoFocus
            multiline
            minRows={4}
            fullWidth
            placeholder={localeText.dialogs.responsePlaceholder}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseInputDialogOpen(false)}>
            {localeText.dialogs.cancel}
          </Button>
          <Button
            onClick={handleSaveCarrierResponse}
            variant="contained"
            disabled={!responseText.trim()}
          >
            {localeText.dialogs.save}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewResponseDialogOpen}
        onClose={() => setViewResponseDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{localeText.dialogs.responseViewerTitle}</DialogTitle>
        <DialogContent dividers>
          {activeResponse ? (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {localeText.dialogs.receivedAt}{" "}
                {new Date(activeResponse.receivedAt).toLocaleString(
                  language === "de" ? "de-DE" : "en-US"
                )}
              </Typography>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 2,
                  whiteSpace: "pre-wrap",
                }}
              >
                {activeResponse.message}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {localeText.dialogs.responseViewerHint}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {localeText.dialogs.clarificationTitle}
                </Typography>
                {activeClarifications.length ? (
                  <Stack spacing={1}>
                    {activeClarifications.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          p: 1.25,
                          bgcolor: item.role === "carrier" ? "grey.50" : "background.paper",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {item.author} ·{" "}
                          {new Date(item.createdAt).toLocaleString(
                            language === "de" ? "de-DE" : "en-US"
                          )}
                        </Typography>
                        <Typography variant="body2">{item.message}</Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {localeText.dialogs.clarificationEmpty}
                  </Typography>
                )}
                <TextField
                  sx={{ mt: 2 }}
                  multiline
                  minRows={2}
                  fullWidth
                  placeholder={localeText.dialogs.clarificationPlaceholder}
                  value={clarificationMessage}
                  onChange={(e) => setClarificationMessage(e.target.value)}
                />
                <Button
                  sx={{ mt: 1 }}
                  variant="outlined"
                  onClick={handleAddClarification}
                  disabled={!clarificationMessage.trim() || !activeClarificationKey}
                >
                  {localeText.dialogs.clarificationSubmit}
                </Button>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {localeText.dialogs.correctionTitle}
                </Typography>
                <Stack spacing={1.5}>
                  <TextField
                    label={localeText.dialogs.correctionInvoiceLabel}
                    value={activeCorrections.newInvoiceNumber}
                    onChange={handleCorrectionChange("newInvoiceNumber")}
                    fullWidth
                  />
                  <TextField
                    label={localeText.dialogs.correctionStornoLabel}
                    value={activeCorrections.stornoNumber}
                    onChange={handleCorrectionChange("stornoNumber")}
                    fullWidth
                  />
                  <TextField
                    label={localeText.dialogs.correctionCreditLabel}
                    value={activeCorrections.creditNoteNumber}
                    onChange={handleCorrectionChange("creditNoteNumber")}
                    fullWidth
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  {localeText.dialogs.correctionInfo}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography>{localeText.dialogs.responseViewerNoData}</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={() => setViewResponseDialogOpen(false)}>
            {localeText.dialogs.responseDialogClose}
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={
              !activeResponseKey ||
              invoiceOverrides[activeResponseKey]?.status === "accepted"
            }
            onClick={() => handleAcceptInvoice(activeResponseKey)}
          >
            {localeText.dialogs.acceptInvoice}
          </Button>
        </DialogActions>
      </Dialog>

      <Tolerance/>

      {/* <Dialog
        open={toleranceDialogOpen}
        onClose={() => dispatch(setToleranceDialogOpen(false))}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{localeText.dialogs.toleranceTitle}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={localeText.dialogs.toleranceFreight}
              type="number"
              value={toleranceSettings.freightPercent}
              onChange={handleToleranceFieldChange("freightPercent")}
              inputProps={{ min: 0 }}
            />
            <TextField
              label={localeText.dialogs.toleranceDefaultSurcharge}
              type="number"
              value={toleranceSettings.defaultSurchargePercent}
              onChange={handleToleranceFieldChange("defaultSurchargePercent")}
              inputProps={{ min: 0 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={toleranceSettings.onlyNegativeMismatch}
                  onChange={(event) =>
                    setToleranceSettings((prev) => ({
                      ...prev,
                      onlyNegativeMismatch: event.target.checked,
                    }))
                  }
                />
              }
              label={localeText.dialogs.onlyNegativeLabel}
            />
          </Stack>

          <Box mt={3}>
            <Typography variant="subtitle2" gutterBottom>
              {localeText.dialogs.specificSurcharges}
            </Typography>
            {toleranceSettings.surchargeOverrides.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                {localeText.dialogs.noOverrides}
              </Typography>
            )}
            {toleranceSettings.surchargeOverrides.map((override) => (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems="center"
                key={override.id}
                sx={{ mt: 1 }}
              >
                <TextField
                  label={localeText.dialogs.overrideLabel}
                  value={override.label}
                  onChange={(e) => handleOverrideChange(override.id, "label", e.target.value)}
                  fullWidth
                />
                <TextField
                  label={localeText.dialogs.overridePercent}
                  type="number"
                  value={override.percent}
                  onChange={(e) => handleOverrideChange(override.id, "percent", e.target.value)}
                  sx={{ minWidth: 160 }}
                  inputProps={{ min: 0 }}
                />
                <IconButton color="error" onClick={() => handleRemoveOverride(override.id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddOverride}
              sx={{ mt: 2 }}
              variant="text"
            >
              {localeText.dialogs.addOverride}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(setToleranceDialogOpen(false))}>
            {localeText.dialogs.close}
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default CsvComparison;
