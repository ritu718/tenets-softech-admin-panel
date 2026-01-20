import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { NEBENKOSTEN_INITIAL_COUNTRIES } from "@/constants/common";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { buildCountryPreset } from "@/utils/helper";

const NebenkostenPreview = ({ text, presets, countryOptions }: any) => {
  const [countryCodes, setCountryCodes] = useState(
    NEBENKOSTEN_INITIAL_COUNTRIES,
  );
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedCountryOption, setSelectedCountryOption] = useState("");

  const availableCountryOptions = countryOptions.filter(
    (option: any) => !countryCodes.includes(option.code),
  );

  const activeCode = countryCodes[tabIndex] || countryCodes[0];
  const activeCountry = activeCode
    ? buildCountryPreset(activeCode, presets, text)
    : null;

  const getFlag = (code: any) =>
    countryOptions.find((option: any) => option.code === code)?.flag || "🌐";

  const handleAddCountry = (code: any) => {
    if (!code) return;
    setCountryCodes((prev) => {
      if (prev.includes(code)) return prev;
      const next = [...prev, code];
      setTabIndex(next.length - 1);
      return next;
    });
  };

  const handleDeleteCountry = (index: any) => {
    setCountryCodes((prev: any) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((_: any, idx: any) => idx !== index);
      setTabIndex((current: any) => {
        if (!next.length) return 0;
        if (current > next.length - 1) return next.length - 1;
        if (index <= current && current > 0) return current - 1;
        return Math.min(current, next.length - 1);
      });
      return next;
    });
  };

  const handleSelectCountry = (event: any) => {
    const value = event.target.value;
    if (!value) return;
    handleAddCountry(value);
    setSelectedCountryOption("");
  };

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {text.nebPreview.title}
        </Typography>
        <Tabs
          value={Math.min(tabIndex, countryCodes.length - 1)}
          onChange={(_, value) => setTabIndex(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          {countryCodes.map((code, index) => (
            <Tab
              key={`${code}-${index}`}
              value={index}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">
                    {getFlag(code)} {code}
                  </Typography>
                  {countryCodes.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteCountry(index);
                      }}
                    >
                      <DeleteOutlineIcon fontSize="inherit" />
                    </IconButton>
                  )}
                </Stack>
              }
            />
          ))}
        </Tabs>

        {availableCountryOptions.length > 0 && (
          <Select
            value={selectedCountryOption}
            onChange={handleSelectCountry}
            displayEmpty
            fullWidth
            sx={{ mt: 2 }}
            renderValue={(value) => {
              if (!value) return text.nebPreview.addPlaceholder;
              const selected = countryOptions.find(
                (option: any) => option.code === value,
              );
              return `${text.nebPreview.addLabel} ${selected?.label || value}`;
            }}
          >
            <MenuItem value="">
              <em>{text.nebPreview.addPlaceholder}</em>
            </MenuItem>
            {availableCountryOptions.map((option: any) => (
              <MenuItem key={option.code} value={option.code}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">{option.flag}</Typography>
                  <Typography variant="body2">{option.label}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        )}

        {activeCountry ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {activeCountry.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {activeCountry.note}
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Stack
                direction="row"
                spacing={2}
                sx={{ p: 2, flexWrap: "wrap" }}
              >
                <Button
                  startIcon={<DownloadIcon />}
                  variant="contained"
                  disabled
                >
                  {text.nebPreview.export}
                </Button>
                <Button startIcon={<UploadIcon />} variant="outlined" disabled>
                  {text.nebPreview.import}
                </Button>
              </Stack>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{text.nebPreview.columns.cost}</TableCell>
                    <TableCell>{text.nebPreview.columns.description}</TableCell>
                    <TableCell>{text.nebPreview.columns.unit}</TableCell>
                    <TableCell>{text.nebPreview.columns.value}</TableCell>
                    <TableCell>{text.nebPreview.columns.updated}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCountry.rows.map((row: any, index: any) => (
                    <TableRow key={`${activeCountry.code}-${index}`}>
                      <TableCell>{row.cost}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.unit}</TableCell>
                      <TableCell>{row.value}</TableCell>
                      <TableCell>{row.updatedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {text.nebPreview.noCountries}
          </Typography>
        )}
      </Paper>

      <Typography variant="caption" color="text.secondary">
        {text.nebPreview.info}
      </Typography>
    </Stack>
  );
};

export default NebenkostenPreview;
