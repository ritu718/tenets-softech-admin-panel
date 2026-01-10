import { cleanString, isEmpty, norm } from "./helper";
import { v4 as uuidv4 } from "uuid";
export const prepareDataTariffs =(rows:any)=>{
const rates: any = {};
     const [header, ...dataRows] = rows;
        const zipCodes=dataRows[0];
        header.map((item:any,index:any) => {
          if(!isEmpty(item)){
const countryCode = item.split("-")[0].trim();
const zipObj = {
        Id: uuidv4(),
        Codes: zipCodes[index],   
        Zone: norm(item),          
      };
if (rates[countryCode]) {
  rates[countryCode] = {
    ...rates[countryCode], // keep existing data
    ZipCodes: [
      ...rates[countryCode].ZipCodes,
      zipObj
    ],
  };
const Weights:any={...rates[countryCode].Weights};
  for (let priceIndex = 1; priceIndex < dataRows.length; priceIndex++) {
    const element = dataRows[priceIndex];
   const weight = cleanString(element[0]);
    if(!isEmpty(weight))
    {
      Weights[weight] = {
  ...(Weights[weight] || {}),Id: uuidv4(),
  Prices: {
    ...(Weights[weight]?.Prices || {}),
    [zipObj.Id]: element[index]
  }
};
    }

   rates[countryCode] = {
    ...rates[countryCode], // keep existing data
    Weights,
  };
  }
} else {

const Weights:any={};
  for (let priceIndex = 1; priceIndex < dataRows.length; priceIndex++) {
    const element = dataRows[priceIndex];
      const weight = cleanString(element[0]);
    if(!isEmpty(weight))
    {
 
      Weights[weight] = {
  ...(Weights[weight] || {}),Id: uuidv4(),
  Prices: {
    ...(Weights[weight]?.Prices || {}),
    [zipObj.Id]: element[index]
  }
};
    } 
  }

  rates[countryCode] = {
  ...(rates[countryCode] || {}),
  ZipCodes: [
    ...(rates[countryCode]?.ZipCodes || []),
    zipObj
  ],
  TariffType: "Gewicht",
  Weights,
};
}
          }
          
        });

        return rates;

}