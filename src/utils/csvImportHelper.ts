import { cleanString, isEmpty, norm } from "./helper";
import { v4 as uuidv4 } from "uuid";

export const prepareDataTariffs = (rows: any) => {
  const rates: any = {};
  const [header, ...dataRows] = rows;
  const zipCodes = dataRows[0];
  header.map((item: any, index: any) => {
    if (!isEmpty(item)) {
      const countryCode = item.split("-")[0].trim();
      const zipObj = {
        Id: uuidv4(),
        Codes: zipCodes[index],
        Zone: norm(item),
      };
      if (rates[countryCode]) {
        rates[countryCode] = {
          ...rates[countryCode], // keep existing data
          ZipCodes: [...rates[countryCode].ZipCodes, zipObj],
        };
        const Weights: any = { ...rates[countryCode].Weights };
        for (let priceIndex = 1; priceIndex < dataRows.length; priceIndex++) {
          const element = dataRows[priceIndex];
          const weight = cleanString(element[0]);
          if (!isEmpty(weight)) {
            Weights[weight] = {
              ...(Weights[weight] || {}),
              Id: uuidv4(),
              Prices: {
                ...(Weights[weight]?.Prices || {}),
                [zipObj.Id]: element[index],
              },
            };
          }

          rates[countryCode] = {
            ...rates[countryCode], // keep existing data
            Weights,
          };
        }
      } else {
        const Weights: any = {};
        for (let priceIndex = 1; priceIndex < dataRows.length; priceIndex++) {
          const element = dataRows[priceIndex];
          const weight = cleanString(element[0]);
          if (!isEmpty(weight)) {
            Weights[weight] = {
              ...(Weights[weight] || {}),
              Id: uuidv4(),
              Prices: {
                ...(Weights[weight]?.Prices || {}),
                [zipObj.Id]: element[index],
              },
            };
          }
        }

        rates[countryCode] = {
          ...(rates[countryCode] || {}),
          ZipCodes: [...(rates[countryCode]?.ZipCodes || []), zipObj],
          TariffType: "weight",
          Weights,
        };
      }
    }
  });

  return rates;
};

export const prepareDataSurcharge = (rows: any) => {
  const Base: any = [];
  // console.log("prepareDataSurcharge: rows: ", rows);
 let headers:any = [];

  let rowsWithoutHeadersIndex = 0;
  for (let index = 0; index < rows.length; index++) {
    const element = rows[index].toString().replace(/^\s*[\r\n]+/, '').split(",");
   
    if(element.includes("Term"))
    {
headers = [...element];
break;
    }
     ++rowsWithoutHeadersIndex;
  }
if(headers?.length)
{
  
   const termIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "term");
   const valueIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "value");
      const unitIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "unit");
         const descriptionIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "description");
            const typeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "type");
              for (let index = rowsWithoutHeadersIndex; index < rows.length; index++) {
    const element = rows[index].toString().replace(/^\s*[\r\n]+/, '').split(",");
   
    const objectValue = {
            "id":uuidv4(),
            "Term":termIndex>=0?element[termIndex]:"",
            "Value":valueIndex>=0?element[valueIndex]:"",
            "Unit":unitIndex>=0?element[unitIndex]:"",
            "Description":descriptionIndex>=0?element[descriptionIndex]:"",
            Type:typeIndex>=0?element[typeIndex]:"",
          }
Base.push(objectValue);

  }
}
  
 return Base;
};
