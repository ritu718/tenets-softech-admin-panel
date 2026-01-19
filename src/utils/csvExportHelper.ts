export const revertTariffsToCSV = (countryCode:any,rates:any) => {
  const header = [""];
  const zipRow:any[] = [""];

  const zipMap:any[] = [];

  // Build header + zip row
  
    rates[countryCode].ZipCodes.forEach((zip:any) => {
      header.push(`${countryCode} - ${zip.Zone}`);
      zipRow.push(zip.Codes);
      zipMap.push(zip.Id);
    });


  const rows:any[] = [header, zipRow];

  // Collect all weights
  const allWeights = new Set<string>();

  Object.values(rates).forEach((rate:any) => {
    Object.keys(rate.Weights).forEach((w:any) => {
      allWeights.add(w);
    });
  });

  // Build price rows
  allWeights.forEach(weight => {
    const row:any[] = [weight];

    zipMap.forEach(zipId => {
      let price = "";

      Object.values(rates).forEach((rate:any) => {
        if (rate.Weights[weight]?.Prices?.[zipId]) {
          price = rate.Weights[weight].Prices[zipId];
        }
      });

      row.push(price);
    });

    rows.push(row);
  });

  return rows;
};

export const exportSurchargeCSV = (response: any) => {

  const extraCosts = response?.extraCosts || {};

  // Get dynamic country key (DE, FR, NL etc)
  const countryCode = Object.keys(extraCosts)[0];

  if (!countryCode) {
    alert("No country data found");
    return;
  }

  const data = extraCosts[countryCode]?.Base || [];

  if (!data.length) {
    alert("No data found for " + countryCode);
    return;
  }

  const headers = ["Term", "Value", "Unit", "Description", "Type"];

  const csvRows = [
    headers.join(","),

    ...data.map((row: any) =>
      headers.map(h => `"${row[h] ?? ""}"`).join(",")
    )
  ];

  const csvString = csvRows.join("\n");

  const blob = new Blob([csvString], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `extra-costs-${countryCode}.csv`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


export const exportFreightCalcCSV = (response: any) => {
  console.log("exportFreightCalcCSV: ",response);
  

  const countries = response?.countries || {};

  // Get dynamic country key (DE, FR, NL etc)
  const countryCode = Object.keys(countries)[0];

  if (!countryCode) {
    alert("No country data found");
    return;
  }

  const { Base } = countries[countryCode]?.MinimumWeight || {};
  console.log("Base: ",Base);
  
const abbreviations = Object.keys(Base);
console.log("abbreviations: ",abbreviations);
  if (!abbreviations.length) {
    alert("No data found for " + countryCode);
    return;
  }

  const headers = ["Kürzel", "Internes Kürzel", "Beschreibung", "Interne Beschreibung", "Gewicht in Kg"];
  const abbreviationsRows:any=[];



  abbreviations.forEach((abbr:any)=>{
   abbreviationsRows.push([abbr,Base[abbr]?.InternalShorthand||"",Base[abbr]?.Description||"",Base[abbr]?.InternalDescription||"",Base[abbr]?.Weight||""]); 

  });


  const csvRows = [
    headers,

    ...abbreviationsRows,
  ];

  const csvString = csvRows.join("\n");

  const blob = new Blob([csvString], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `extra-costs-${countryCode}.csv`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


export const exportDataIntakeCSV = (shipmentData: any) => {


  const headers = [
    "Sendungs-ID",
    "Versanddatum",
    "Versand Postleitzahl",
    "Empfangs Postleitzahl",
    "Ort",
    "Land",
    "Länge (cm)",
    "Breite (cm)",
    "Höhe (cm)",
    "Lademeter (m²)",
    "Kubikmeter (m³)",
    "Anzahl Packstücke",
    "Verpackungsart",
    "Effektives Gewicht (kg)",
    "Express Next Day",
    "Express 12:00 Uhr",
    "Express 10:00 Uhr",
    "Express 08:00 Uhr",
    "Fixtermin",
    "E-Mail Avis",
    "Telefonisches Avis",
    "Booking in Avis",
    "Gefahrgutzuschlag",
    "Kurzwochenzuschlag",
    "Spediteurbescheinigung",
    "B2C Zuschlag (national)",
    "B2C Zuschlag (international)",
    "Security Fee",
    "Versicherung",
    "Porti/Papiere",
    "undefined"
];
  const shipmentDataRows:any=[];

  shipmentData.forEach((shipmentObj:any)=>{
   shipmentDataRows.push([
    shipmentObj?.ShipmentId||"",
    shipmentObj?.ShipmentDate||"",
     shipmentObj?.ZipCodeShipper||"", 
     shipmentObj?.ZipCodeConsignee||"0",
      shipmentObj?.City||"",
       shipmentObj?.Country||"",
    shipmentObj?.Length||"0",
    shipmentObj?.Wide||"0",
    shipmentObj?.Height||"0",
    shipmentObj?.LoadingMeters||"0",
    shipmentObj?.CubicMeters||"0",
    shipmentObj?.PalletCount||"0",
    shipmentObj?.PackagingType||"",
    shipmentObj?.EffectiveWeight||"0",
    shipmentObj?.ExpressNextDay||"",
    shipmentObj?.Express12||"",
    shipmentObj?.Express10||"",
    shipmentObj?.Express8||"",
    shipmentObj?.Fixtermin||"",
    shipmentObj?.EmailAvis||"",
    shipmentObj?.PhoneAvis||"",
    shipmentObj?.BookingInAvis||"",
    shipmentObj?.LongGoodsSurcharge||"",
    shipmentObj?.ShortWeekSurcharge||"",
    shipmentObj?.CarrierCertificate||"",
    shipmentObj?.B2CNationalSurcharge||"",
    shipmentObj?.B2CInternationalSurcharge||"",
    shipmentObj?.SecurityFee||"",
    shipmentObj?.Insurance||"",
    shipmentObj?.PortiPapiere||"",
   ]); 

  });


  const csvRows = [
    headers,

    ...shipmentDataRows,
  ];
  console.log("csvRows: ",csvRows);
  
  const csvString = csvRows.join("\n");

  const blob = new Blob([csvString], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `data-intake.csv`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};