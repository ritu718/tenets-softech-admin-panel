import React from 'react'
import {
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  OutlinedInput,
  TableHead,
  TableFooter,
  Typography,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";
// import { ExtraCostProps } from "~classes/index";
// import { Utils } from "~shared/Utilities";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { Utils } from '@/components/molecules/utiles_sercharge_popup';

export type ExtraCostUnitProps = "€" | "%";
export type LongGoodsSurchargeValueProps = {
  kg: number;
  price: number;
};

export type LongGoodsSurchargeValuesProps = {
  [key: number]: LongGoodsSurchargeValueProps[];
};

export type ExtraCostProps = {
  id?: string;
  Term: string;
  BaseValue?: number;
  Value: number;
  Values: LongGoodsSurchargeValuesProps;
  Unit: ExtraCostUnitProps;
  Description: string;
  DieselFloater?: {
    DieselFloaterSource: string;
    DieselFloaterBaseValue: number;
    DieselFloaterValues: {
      [key: number]: number;
    }[];
  };
  ComputedExpressTiers?: {
    kg: number;
    price: number;
  }[];
};

export const DIESEL_FLOATER_SOURCE_ALIASES: Record<string, string> = {
  EN2X: "EN2X",
  EN2X2: "EN2X (-2 Mon.)",
  BGL: "BGL",
  BGL2: "BGL (-2 Mon.)",
  Shell: "Shell",
  Shell2: "Shell (-2 Mon.)",
  Aral: "Aral",
  Aral2: "Aral (-2 Mon.)",
  EUCommission: "EU Commission",
  EUCommission2: "EU Commission (-2 Mon.)",
  Benzinpreisde: "Benzinpreis.de",
  ADAC: "ADAC",
  ADAC2:  "ADAC (-2 Mon.)"
};

export type DieselFloaterProps = {
  dieselExtraCost: ExtraCostProps | undefined;
  dieselFloaterSources: string[];
  dataUpdateCallback: (payload: { id: string; value: any; extraCostProp: keyof ExtraCostProps }) => void;
};

export type DieselFloaterSourcePricesProps = {
  [key: string]: number;
};

export type DieselFloaterSourceProps = {
  date: string;
  prices: DieselFloaterSourcePricesProps;
};

export type DieselFloaterSourcesProps = DieselFloaterSourceProps[];

export type DieselFloaterValueProps = {
  [key: string]: number;
};

export type DieselFloaterValuesProps = {
  DieselFloaterSource: string;
  DieselFloaterBaseValue: number;
  DieselFloaterValues: DieselFloaterValueProps[] | undefined;
};

const createFallbackDieselFloater = (): DieselFloaterValuesProps => ({
  DieselFloaterSource: "",
  DieselFloaterBaseValue: 0,
  DieselFloaterValues: [
    {
      "0": 0,
    },
  ],
});

const normalizeDieselFloater = (floater?: DieselFloaterValuesProps): DieselFloaterValuesProps => {
  if (!floater) {
    return createFallbackDieselFloater();
  }

  const hasValues = Array.isArray(floater.DieselFloaterValues) && floater.DieselFloaterValues.length > 0;
  const normalizedValues = hasValues
    ? floater.DieselFloaterValues!.map((entry) => ({ ...entry }))
    : createFallbackDieselFloater().DieselFloaterValues;

  return {
    DieselFloaterSource: floater.DieselFloaterSource ?? "",
    DieselFloaterBaseValue: typeof floater.DieselFloaterBaseValue === "number" ? floater.DieselFloaterBaseValue : 0,
    DieselFloaterValues: normalizedValues,
  };
};

const areDieselFloatersEqual = (a: DieselFloaterValuesProps, b: DieselFloaterValuesProps): boolean => {
  if (a.DieselFloaterSource !== b.DieselFloaterSource) {
    return false;
  }

  if (a.DieselFloaterBaseValue !== b.DieselFloaterBaseValue) {
    return false;
  }

  const serialize = (value: DieselFloaterValueProps[] | undefined) => JSON.stringify(value ?? []);

  return serialize(a.DieselFloaterValues) === serialize(b.DieselFloaterValues);
};


export default function SerchargesPopup({ dieselExtraCost, dieselFloaterSources, dataUpdateCallback }: DieselFloaterProps) {
const extraCostsId = dieselExtraCost?.id ?? "";

  const [deleteValuesModalIsOpen, setDeleteValuesModalIsOpen] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number>();

  const [dieselFloater, setDieselFloater] = useState<DieselFloaterValuesProps>(
    normalizeDieselFloater(dieselExtraCost?.DieselFloater),
  );
  // =========================
// CSV IMPORTER (komplett)
// =========================

// Map "Label" -> "Key" (Alias-Text zurück zum technischen Key)
const LABEL_TO_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(DIESEL_FLOATER_SOURCE_ALIASES).map(([key, label]) => [label.toLowerCase(), key])
);

// tolerant in Zahl wandeln (Komma/Punkt)
const toNum = (s: string): number | undefined => {
  if (s == null) return undefined;
  const n = Number(String(s).trim().replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};

// BOM entfernen
const stripBOM = (text: string) => (text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);

/**
 * Robuster CSV-Parser:
 * - ignoriert '#' und Leerzeilen
 * - toleranter Header-Finder (SOURCE/BASE in beliebiger Zeile)
 * - akzeptiert Key oder Alias als SOURCE und mappt zu Key
 */
const parseDieselFloaterCsv = (csvRaw: string): {
  source?: string;
  base?: number;
  values: DieselFloaterValueProps[];
} => {
  const csv = stripBOM(csvRaw);
  const eol = csv.includes("\r\n") ? "\r\n" : "\n";
  const lines = csv.split(eol).map(l => l.trim());

  // 1) Kommentare/Leerzeilen filtern, aber Originalindex behalten brauchen wir nicht
  const content = lines.filter(l => l.length > 0 && !l.startsWith("#"));

  let source: string | undefined;
  let base: number | undefined;
  const values: DieselFloaterValueProps[] = [];

  const split = (row: string) => row.split(";").map(x => x.trim());

  // 2) Header-Zeile finden: die erste Zeile, die mindestens ein '=' enthält
  let dataStart = 0;
  for (; dataStart < content.length; dataStart++) {
    if (content[dataStart].includes("=")) {
      // KEY=VALUE-Paare (durch ; getrennt)
      const parts = split(content[dataStart]);
      parts.forEach(p => {
        if (!p.includes("=")) return;
        const [kRaw, vRaw0] = p.split("=");
        const key = (kRaw ?? "").trim().toUpperCase();
        const vRaw = (vRaw0 ?? "").trim();

        if (key === "SOURCE") {
          // 2a) SOURCE validieren: Key oder Label zulassen
          const vLower = vRaw.toLowerCase();
          let parsedKey = vRaw;

          // Wenn Label getroffen (z.B. "EN2X (-2 Mon.)"), zurück auf Key mappen
          if (LABEL_TO_KEY[vLower]) {
            parsedKey = LABEL_TO_KEY[vLower];
          }

          // validiere gegen dieselFloaterSources
          source = dieselFloaterSources.includes(parsedKey) ? parsedKey : "";
        } else if (key === "BASE") {
          const n = toNum(vRaw);
          base = typeof n === "number" ? n : 0;
        }
      });

      dataStart += 1; // Daten beginnen in der nächsten Zeile
      break;
    }
  }

  // 3) Datenzeilen einlesen: "<PreisInCent>;<Prozent>"
  for (let i = dataStart; i < content.length; i++) {
    const row = content[i];
    if (!row || row.includes("=")) {
      // falls aus Versehen noch eine KEY=VALUE-Zeile kommt, überspringen
      continue;
    }
    const cols = split(row);
    if (cols.length < 2) continue;

    const price = toNum(cols[0]);   // CENT
    const percent = toNum(cols[1]); // %
    if (typeof price === "number" && typeof percent === "number") {
      values.push({ [String(price)]: percent });
    }
  }

  return { source, base, values };
};

/**
 * File-Import: robustes Parsing + Validierung + State-Update
 */
const importCsvFromFile = (file: File) => {
  const fr = new FileReader();
  fr.onload = (e) => {
    const csv = String(e.target?.result ?? "");
    const parsed = parseDieselFloaterCsv(csv);

    // SOURCE/BASE sind bereits validiert & normalisiert
    const updated: DieselFloaterValuesProps = {
      DieselFloaterSource: parsed.source ?? "",
      DieselFloaterBaseValue: typeof parsed.base === "number" ? parsed.base : 0,
      DieselFloaterValues:
        parsed.values.length > 0 ? parsed.values : (dieselFloater?.DieselFloaterValues ?? []),
    };

    sendUpdateCallback(updated);
  };
  fr.readAsText(file);
};

// <input type="file" onChange=...>
const handleImportCsv: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  const file = e.target.files?.[0];
  e.currentTarget.value = ""; // reset, damit gleiche Datei erneut geht
  if (!file) return;
  importCsvFromFile(file);
};

  // ---- CSV-EXPORT: Utilities ----
  const numToCsv = (n: number | undefined) =>
  typeof n === "number" && Number.isFinite(n) ? String(n).replace(".", ",") : "";

const buildDieselFloaterCsv = (): string => {
  const lines: string[] = [];

  // --- Legende vornedran ---
  lines.push("# Datenquellen (KEY;Label)");
  Object.entries(DIESEL_FLOATER_SOURCE_ALIASES).forEach(([key, label]) => {
    lines.push(`${key};${label}`);
  });
  lines.push(""); // Leerzeile nach Legende

  // --- Headerzeile ---
  const source = dieselFloater?.DieselFloaterSource ?? "";
  const base   = numToCsv(dieselFloater?.DieselFloaterBaseValue);
  lines.push(`SOURCE=${source};BASE=${base}`);

  // --- Datenzeilen ---
  const items = [...(dieselFloater?.DieselFloaterValues ?? [])];

  // Sortieren nach Preis
  items.sort((a, b) => {
    const [pa] = Object.entries(a)[0] ?? ["0", 0];
    const [pb] = Object.entries(b)[0] ?? ["0", 0];
    return Number(pa) - Number(pb);
  });

  items.forEach(entry => {
    const [priceStr, percentVal] = Object.entries(entry)[0] ?? ["", ""];
    const priceCsv   = numToCsv(Number(priceStr));
    const percentCsv = numToCsv(Number(percentVal as number));
    lines.push(`${priceCsv};${percentCsv}`);
  });

  return lines.join("\r\n");
};

// Download starten
const exportCsv = () => {
const csv = buildDieselFloaterCsv();
const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
const src = dieselFloater?.DieselFloaterSource ? `_${dieselFloater.DieselFloaterSource}` : "";
a.href = url;
a.download = `diesel_floater${src}.csv`;
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);
};

  function handleAddValues() {
    const updatedDieselFloaterValues = [...(dieselFloater?.DieselFloaterValues || [])];

    updatedDieselFloaterValues.push({ "0": 0 });

    setDieselFloater((prev) => ({
      ...prev,
      DieselFloaterSource: prev?.DieselFloaterSource ?? "",
      DieselFloaterBaseValue: prev?.DieselFloaterBaseValue ?? 0,
      DieselFloaterValues: updatedDieselFloaterValues,
    }));
  }

  function openDeleteModal(rowIndex: number) {
    setDeleteRowIndex(rowIndex);
    setDeleteValuesModalIsOpen(true);
  }

  function sendUpdateCallback(updatedDieselFloaterData: DieselFloaterValuesProps) {
    const payload = {
      id: extraCostsId,
      value: updatedDieselFloaterData,
      extraCostProp: "DieselFloater" as keyof ExtraCostProps,
    };

    setDieselFloater(updatedDieselFloaterData);
    dataUpdateCallback(payload);
  }

  function confirmRowDelete() {
    const updatedDieselFloaterValues = [...(dieselFloater?.DieselFloaterValues || [])];

    if (deleteRowIndex === undefined) {
      return;
    }

    updatedDieselFloaterValues.splice(deleteRowIndex, 1);

    const updatedDieselFloaterData = {
      ...dieselFloater,
      DieselFloaterValues: updatedDieselFloaterValues,
    };

    sendUpdateCallback(updatedDieselFloaterData);
    setDeleteValuesModalIsOpen(false);
  }

  function handleDieselFloaterSourceChange(event: SelectChangeEvent<unknown>) {
    const newSource = event.target.value as string;

    const updatedDieselFloaterData = {
      ...dieselFloater,
      DieselFloaterSource: newSource,
    };

    sendUpdateCallback(updatedDieselFloaterData);
  }

  function handleDieselFloaterBaseValueBlur(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newBaseValue = event.target.value;

    const numberedBaseValue = Number(newBaseValue.replace(",", "."));

    const updatedDieselFloaterData = {
      ...dieselFloater,
      DieselFloaterBaseValue: numberedBaseValue,
    };

    sendUpdateCallback(updatedDieselFloaterData);
  }

  function handleDieselFloaterValuesBlur(value: string, index: number, type: "price" | "percent") {
    const numberedBaseValue = Number(value.replace(",", "."));
    const updatedDieselFloaterValues = [...(dieselFloater?.DieselFloaterValues || [])];

    const key = type === "price" ? numberedBaseValue : Object.keys(updatedDieselFloaterValues[index])[0];
    const val = type === "price" ? Object.values(updatedDieselFloaterValues[index])[0] : numberedBaseValue;

    updatedDieselFloaterValues[index] = { [key]: val };

    const updatedDieselFloaterData = {
      ...dieselFloater,
      DieselFloaterValues: updatedDieselFloaterValues,
    };

    sendUpdateCallback(updatedDieselFloaterData);
  }

  useEffect(() => {
    const nextFloater = normalizeDieselFloater(dieselExtraCost?.DieselFloater);

    setDieselFloater((current) => {
      if (areDieselFloatersEqual(current, nextFloater)) {
        return current;
      }

      return nextFloater;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dieselExtraCost?.id, dieselExtraCost?.DieselFloater]);


  return (
     <Stack spacing={2}>
      <TableContainer>
        <Table size="small">
          <TableBody
            sx={{
              "& .MuiTableRow-root:last-child": {
                ".MuiTableCell-root": {
                  borderBottom: "none",
                },
              },
            }}
          >
            <TableRow>
              <TableCell>Auswahl Datenquelle:</TableCell>

              <TableCell>
                <Select
                  key={dieselFloater?.DieselFloaterSource}
                  id="diesel-floater-source-select"
                  size="small"
                  tabIndex={0}
                  value={dieselFloater?.DieselFloaterSource ?? ""}
                  fullWidth
                  onChange={handleDieselFloaterSourceChange}
                >
                  <MenuItem value="" sx={{ fontStyle: "italic" }}>
                    Keine
                  </MenuItem>

                  {dieselFloaterSources.map((option) => (
                    <MenuItem key={option} value={option}>
                      {DIESEL_FLOATER_SOURCE_ALIASES[option] ?? option}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Vereinbarter Basiswert:</TableCell>

              <TableCell>
                <OutlinedInput
                  key={dieselFloater?.DieselFloaterBaseValue}
                  size="small"
                  fullWidth
                  defaultValue={Utils.toDoubleDecimal(dieselFloater?.DieselFloaterBaseValue ?? 0)}
                  endAdornment={<InputAdornment position="end">CENT</InputAdornment>}
                  inputProps={{ style: { textAlign: "right" }, tabIndex: 0 }}
                  onBlur={handleDieselFloaterBaseValueBlur}
                  onFocus={(event) => {
                    event.target.select();
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} sx={{ padding: "6px 16px 22px", width: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Bis zu Dieselpreis</TableCell>

              <TableCell>Dieselzuschlag</TableCell>

              <TableCell>Löschen</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(dieselFloater?.DieselFloaterValues ?? []).map((dieselFloaterValue, index) => {
              const [price, percent] = Object.entries(dieselFloaterValue)[0] ?? ["0", 0];
              const priceAsNumber = Number(price.toString().replace(",", "."));

              return (
                <TableRow>
                  <TableCell>
                    <OutlinedInput
                      key={`${price}-${index}`}
                      size="small"
                      tabIndex={0}
                      defaultValue={Utils.formatToLocaleDecimal(priceAsNumber)}
                      endAdornment={<InputAdornment position="end">CENT</InputAdornment>}
                      inputProps={{ style: { textAlign: "right" }, tabIndex: 0 }}
                      style={{ maxWidth: "200px" }}
                      onBlur={(event) => handleDieselFloaterValuesBlur(event.target.value, index, "price")}
                      onFocus={(event) => {
                        event.target.select();
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <OutlinedInput
                      key={`${percent}-${index}`}
                      size="small"
                      tabIndex={0}
                      defaultValue={Utils.formatToTwoDecimalPercent(percent as string | number)}
                      endAdornment={<InputAdornment position="end">%</InputAdornment>}
                      inputProps={{ style: { textAlign: "right" }, tabIndex: 0 }}
                      style={{ maxWidth: "200px" }}
                      onBlur={(event) => handleDieselFloaterValuesBlur(event.target.value, index, "percent")}
                      onFocus={(event) => {
                        event.target.select();
                      }}
                    />
                  </TableCell>

                  <TableCell width="70px">
                    <IconButton aria-label="delete" tabIndex={0} onClick={() => openDeleteModal(index)} title="Zeile löschen.">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  tabIndex={0}
                  endIcon={<AddCircleIcon fontSize="small" />}
                  onClick={handleAddValues}
                  title="Neue Zeile hinzufügen."
                >
                  <Typography variant="button">Dieselzuschlag hinzufügen</Typography>
                </Button>

                <Button
                    component="label"
                    fullWidth
                    size="small"
                    variant="contained"
                    title="CSV importieren"
                    endIcon={<UploadIcon />}
                  >
                    Import CSV
                    <input
                      hidden
                      type="file"
                      accept=".csv"
                      onChange={handleImportCsv}
                    />
                  </Button>

                  <Button
          fullWidth
          size="small"
          variant="contained"
          onClick={exportCsv}
          title="Aktuelle Tabelle als CSV exportieren"
          endIcon={<DownloadIcon />}
        >
          Export als CSV
        </Button>
                </Stack>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <Dialog
          open={deleteValuesModalIsOpen}
          onClose={() => {
            setDeleteValuesModalIsOpen(false);
          }}
        >
          <DialogTitle>Zeile Löschen?</DialogTitle>

          <DialogContent>
            <DialogContentText>Möchten Sie diese Zeile wirklich löschen?</DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" color="error" tabIndex={0} onClick={confirmRowDelete}>
              Löschen
            </Button>

            <Button
              variant="outlined"
              tabIndex={0}
              onClick={() => {
                setDeleteValuesModalIsOpen(false);
              }}
            >
              Abbrechen
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </Stack>
  )
}
