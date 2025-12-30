import { NEBENKOSTEN_INITIAL_COUNTRIES } from "@/constants/common";
import { BASE_COUNTRY_OPTIONS, MIN_WEIGHT_DEFAULTS, SHIPMENT_SAMPLE_ROWS_BASE } from "@/constants/data";

/**
 * Function to check the value is numeric or not.
 *
 * @param {string} inputString inputString
 * @returns {boolean} gives true or false.
 */
export const isNumeric = (inputString:any) => {
  const regex = /^[0-9\b]+$/;
  if (String(inputString).match(regex)) {
    return true;
  }
  return false;
};

/**
 * Function will check if value is null, undefined, 0 or blank.
 *
 * @param {object} v value
 * @returns {boolean} gives true if value is empty or false if value is not empty.
 */
export const isEmpty = (v:any) =>
  v == null ||
  v == undefined ||
  v == false ||
  v.length == 0 ||
  v == '' ||
  (isNumeric(v) && parseInt(v, 10) == 0);

  export const makeId = (prefix:any) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

  export const createTariffZone = (zone:any = {}, fallbackName = "Zone") => ({
    id: makeId("zone"),
    name: zone.name || fallbackName,
    zips: zone.zips || "",
    min: zone.min || "",
    max: zone.max || "",
  });

  export const createTariffRow = (zones:any = [], row:any = {}) => {
    const values = row.values || {};
    const valueMap = zones.reduce((acc:any, zone:any) => {
      acc[zone.id] = values[zone.id] || "";
      return acc;
    }, {});
    return {
      id: makeId("tariff-row"),
      weight: row.weight || "",
      values: valueMap,
    };
  };

  export const createTariffBase = (text:any, overrides:any = {}) => {
  const defaults = text.config.pricing.defaults.tariff;
  const zones =
    overrides.zones?.map((zone:any, idx:any) => createTariffZone(zone, `Zone ${idx + 1}`)) ||
    defaults.zones.map((zone:any, idx:any) => createTariffZone(zone, `Zone ${idx + 1}`));
  const rowsSource = overrides.rows?.length ? overrides.rows : defaults.rows || [];
  const rows = rowsSource.map((row:any) =>
    typeof row === "string" || typeof row === "number"
      ? createTariffRow(zones, { weight: String(row) })
      : createTariffRow(zones, row)
  );
  const defaultTariffType =
    overrides.tariffType ||
    defaults.tariffType ||
    (text.config.pricing.tariffs.tariffTypes || [])[0] ||
    "";
  return {
    tariffType: defaultTariffType,
    zones,
    rows,
  };
};

export const createSurchargeRow = (text:any, overrides:any = {}) => ({
  id: makeId("surcharge"),
  label: overrides.label || "",
  type: overrides.type || (overrides.unit === "%" ? "percent" : "flat"),
  amount: overrides.amount || "",
  unit: overrides.unit || "€",
  description: overrides.description || "",
  required: typeof overrides.required === "boolean" ? overrides.required : true,
});


export const createSurchargeBase = (text:any, overrides:any = {}) => {
  const defaults = text.config.pricing.defaults.surcharges;
  const rowsSource =
    (overrides.rows && overrides.rows.length && overrides.rows) ||
    (defaults?.rows && defaults.rows.length && defaults.rows) ||
    [];
  return {
    rows: rowsSource.map((row:any) => createSurchargeRow(text, row)),
  };
};

  export const createMinWeightRow = (row:any = {}) => ({
  id: makeId("minw"),
  code: row.code || "",
  internalCode: row.internalCode || row.code || "",
  description: row.description || "",
  internalDescription: row.internalDescription || row.description || "",
  weight: row.weight || "",
});


export const buildDefaultMinWeights = () => MIN_WEIGHT_DEFAULTS.map((row:any) => createMinWeightRow(row));



  export const createFreightBase = (text:any, overrides:any = {}) => {
  const defaults = text.config.pricing.defaults.freight;
  return {
    calculationMode: overrides.calculationMode || defaults.calculationMode || "cbm",
    consolidatedBilling:
      typeof overrides.consolidatedBilling === "boolean"
        ? overrides.consolidatedBilling
        : defaults.consolidatedBilling,
    bulkyCbm: overrides.bulkyCbm || defaults.bulkyCbm || "",
    bulkyLdm: overrides.bulkyLdm || defaults.bulkyLdm || "",
    ldmFromKg: overrides.ldmFromKg || defaults.ldmFromKg || "",
    ldmFromLdm: overrides.ldmFromLdm || defaults.ldmFromLdm || "",
    minWeights:
      overrides.minWeights?.map((row:any) => createMinWeightRow(row)) || buildDefaultMinWeights(),
    customMinWeights: overrides.customMinWeights?.map((row:any) => createMinWeightRow(row)) || [],
  };
};

export const createCarrierConfig = (text:any, name:any, preset:any = {}) => {
  const defaults = text.config.pricing.defaults;
  const defaultFreight = defaults.freight;
  const countryCodes = preset.freight?.countryCodes || NEBENKOSTEN_INITIAL_COUNTRIES;
  const presetByCountry = preset.freight?.byCountry || {};
  const byCountry = countryCodes.reduce((acc:any, code:any) => {
    acc[code] = createFreightBase(text, presetByCountry[code] || preset.freight || defaultFreight);
    return acc;
  }, {});
  const freight = {
    countryCodes: countryCodes.length ? countryCodes : [...NEBENKOSTEN_INITIAL_COUNTRIES],
    byCountry,
  };

  const tariffCountryCodes = preset.tariffs?.countryCodes || NEBENKOSTEN_INITIAL_COUNTRIES;
  const tariffByCountryPreset = preset.tariffs?.byCountry || {};
  const tariffsByCountry:any = {};
  (tariffCountryCodes.length ? tariffCountryCodes : NEBENKOSTEN_INITIAL_COUNTRIES).forEach(
    (code:any) => {
      tariffsByCountry[code] = createTariffBase(
        text,
        tariffByCountryPreset[code] || preset.tariffs || defaults.tariff
      );
    }
  );
  const tariffs = {
    countryCodes: tariffCountryCodes.length ? tariffCountryCodes : [...NEBENKOSTEN_INITIAL_COUNTRIES],
    byCountry: tariffsByCountry,
  };

  const presetSurcharges = preset.surcharges || {};
  const isLegacySurchargeArray = Array.isArray(presetSurcharges);
  const surchargeCountryCodes = isLegacySurchargeArray
    ? NEBENKOSTEN_INITIAL_COUNTRIES
    : presetSurcharges.countryCodes || NEBENKOSTEN_INITIAL_COUNTRIES;
  const surchargeByCountryPreset = isLegacySurchargeArray
    ? { [NEBENKOSTEN_INITIAL_COUNTRIES[0]]: { rows: presetSurcharges } }
    : presetSurcharges.byCountry || {};
  const surchargesByCountry:any = {};
  (surchargeCountryCodes.length ? surchargeCountryCodes : NEBENKOSTEN_INITIAL_COUNTRIES).forEach(
    (code:any) => {
      surchargesByCountry[code] = createSurchargeBase(
        text,
        surchargeByCountryPreset[code] || presetSurcharges || defaults.surcharges
      );
    }
  );
  const surcharges = {
    countryCodes: surchargeCountryCodes.length
      ? surchargeCountryCodes
      : [...NEBENKOSTEN_INITIAL_COUNTRIES],
    byCountry: surchargesByCountry,
  };

  return {
    id: makeId("carrier"),
    name: name || defaults.newCarrierName,
    address: preset.address || "",
    contact: preset.contact || "",
    customerNumber: preset.customerNumber || "",
    freight,
    tariffs,
    surcharges,
  };
};

export const buildCountryOptions = (text:any) =>
  BASE_COUNTRY_OPTIONS.map((option:any) => ({
    ...option,
    label: text.countries[option.code] || option.code,
  }));

  
export const buildShipmentSampleRows = (language:any) =>
  SHIPMENT_SAMPLE_ROWS_BASE.map((row:any) => ({
    ...row,
    date: row.date[language],
    packaging: row.packaging[language],
    weight: row.weight[language],
    loadingMeters: row.loadingMeters[language],
  }));

 export const buildCountryPreset = (code:any, presets:any, text:any) => {
  const preset = presets[code];
  if (preset) return { ...preset, code };
  const label = text.countries[code] || code;
  return {
    code,
    title: `${label} (${code})`,
    note: text.surcharges.defaultNote,
    rows: [
      {
        cost: text.surcharges.example,
        description: text.surcharges.exampleDescription,
        unit: text.surcharges.unitDash,
        value: "—",
        updatedAt: "—",
      },
    ],
  };
};


export const buildNebenkostenPresets = (text:any) => {
  const s = text.surcharges;
  return {
    DE: {
      title: s.deTitle,
      note: s.deNote,
      rows: [
        {
          cost: s.dieselFloater,
          description: s.dieselDescription,
          unit: s.unitPercent,
          value: "5,2 %",
          updatedAt: "03.02.2025",
        },
        {
          cost: s.toll,
          description: s.tollDescription,
          unit: s.unitEuroPerKm,
          value: "0,12 €",
          updatedAt: "03.02.2025",
        },
        {
          cost: s.pickup,
          description: s.pickupDescription,
          unit: s.unitEuro,
          value: "25,00 €",
          updatedAt: "15.01.2025",
        },
      ],
    },
    INT: {
      title: s.intTitle,
      note: s.intNote,
      rows: [
        {
          cost: s.handling,
          description: s.handlingDescription,
          unit: s.unitEuroPerShipment,
          value: "15,00 €",
          updatedAt: "12.12.2024",
        },
        {
          cost: s.customs,
          description: s.customsDescription,
          unit: s.unitEuro,
          value: "40,00 €",
          updatedAt: "12.12.2024",
        },
      ],
    },
  };
};

export const buildShipmentSummaryItems = (text:any) => [
  { label: text.shipments.summary.active, value: "248" },
  { label: text.shipments.summary.lastUpdate, value: text.shipments.summary.lastUpdateValue },
  { label: text.shipments.summary.importSource, value: text.shipments.summary.importValue },
];