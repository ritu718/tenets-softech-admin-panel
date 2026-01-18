import { CALCUTION_TYPE_MAPPER } from "@/constants/common";
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
 let headers:any = [];
  let rowsWithoutHeadersIndex = 0;
  for (let index = 0; index < rows.length; index++) {
    const element = rows[index].toString().replace(/^\s*[\r\n]+/, '').split(",");
   ++rowsWithoutHeadersIndex;
    if(element.includes("Term"))
    {
headers = [...element];
break;
    }
     
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
            "Unit":unitIndex>=0?element[unitIndex]:"€",
            "Description":descriptionIndex>=0?element[descriptionIndex]:"",
            Type:typeIndex>=0?element[typeIndex]:"flat",
          }
Base.push(objectValue);

  }
}
  
 return Base;
};


export const prepareDataFreightBasis = (rows: any,countryCode="DE",projectId:any) => {
   const frightCalculation: any = {};
   const Additional:any =[];
   let CalculationType=-1;
   let IsConsolidated = false;
   let Bulkiness:any ={};
   let AdvancedOptions:any={};
  const [header, ...dataRows] = rows;
  const Base: any = {};
 let headers:any = [];
  let rowsWithoutHeadersIndex = 0;
  for (let index = 0; index < rows.length; index++) {
    const element = rows[index].toString().replace(/^\s*[\r\n]+/, '').split(",");

   ++rowsWithoutHeadersIndex;
    if(element.includes("Kürzel"))
    {
headers = [...element];
break;
    }
  }


  if(headers?.length)
{  
   const abbreviationsIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "kürzel")
   const internalCodeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "internes kürzel");
     const descriptionIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "beschreibung");

      const internalDescrIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "interne beschreibung");
       
            const weightInKgIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "gewicht in kg");
              for (let index = rowsWithoutHeadersIndex; index < rows.length; index++) {
    const element = rows[index].toString().replace(/^\s*[\r\n]+/, '').split(",");
   
    Base[element[abbreviationsIndex]] =  {
"InternalShorthand": internalCodeIndex>=0?element[internalCodeIndex]: "",
"Description": descriptionIndex>=0?element[descriptionIndex]:"",
"InternalDescription": internalDescrIndex>=0?element[internalDescrIndex]: "",
"Weight":  weightInKgIndex>=0?element[weightInKgIndex]:""
}
  }
}


  for (let index = 0; index < rowsWithoutHeadersIndex; index++) {
    const element = rows[index].toString().replace(/^\s*[\r\n]+/, '').split(",");
    // console.log("element value is inside calc: ",element);
    
  if(element.length>1)
  {
if(element.includes("Berechnungsart"))
    {
CalculationType=CALCUTION_TYPE_MAPPER[element[1]]
    }
    else if(element.includes("Konsolidierte Abrechnung"))
    {
IsConsolidated=CALCUTION_TYPE_MAPPER[element[1]]
    }

   else if(element.includes("Sperrigkeit Kubikmeter (Kg)"))
    {
      Bulkiness.CubicMeters=element[1];
    } 
     else if(element.includes("Sperrigkeit Lademeter (Kg)"))
    {
      Bulkiness.LoadingMeters=element[1];
    } 

      else if(element.includes("Erweiterte Optionen: Lademeterberechnung ab Kg"))
    {
      AdvancedOptions.LoadingMetersKg=element[1];
    } 

    else if(element.includes("Erweiterte Optionen: Lademeterberechnung ab Lademeter"))
    {
      AdvancedOptions.LoadingMetersLdm=element[1];
    } 

    
  }
    
  }

if(Object.keys(Base).length)
{
frightCalculation.projectId = projectId;

frightCalculation.countries ??= {};
frightCalculation.countries[countryCode] ??= {IsConsolidated};
if(Bulkiness&&Object.keys(Bulkiness).length>0)
{
  frightCalculation.countries[countryCode].Bulkiness=Bulkiness;
}

if(AdvancedOptions&&Object.keys(AdvancedOptions).length>0)
{
  frightCalculation.countries[countryCode].AdvancedOptions=AdvancedOptions;
}

if(CalculationType>-1)
{
  frightCalculation.countries[countryCode].CalculationType=CalculationType;
}

frightCalculation.countries[countryCode].MinimumWeight = { Base,Additional };
}
console.log("frightCalculation: ",frightCalculation);

  return frightCalculation;
};
    
