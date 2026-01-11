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