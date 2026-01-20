import { CALCUTION_TYPE_MAPPER } from "@/constants/common";
import { cleanString, isEmpty, norm } from "./helper";
import { v4 as uuidv4 } from "uuid";
import { CShipmentRow } from "@/classes";

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
  console.log(": ",rows);
  
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
    

export const prepareDataIntake = (rows: any,projectId:any) => {
 
  const shipmentData: any = [];
 let headers:any = [];
  let rowsWithoutHeadersIndex = 0;
  for (let index = 0; index < rows.length; index++) {
    const element = rows[index].toString().replace(/^\s*[\r\n]+/, '').split(",");

   ++rowsWithoutHeadersIndex;
    if(element.includes("Sendungs-ID"))
    {
headers = [...element];
break;
    }
  }


  if(headers?.length)
{  
  console.log("headers: ",headers);
  
   const shipmentIdIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "sendungs-id")
   const shippingDateIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "versanddatum");
     const shippingPostalCodeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "versand postleitzahl");
      const recipientPostalCodeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "empfangs postleitzahl");
            const cityIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "ort");
             const countryIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "land");
              const lengthIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "länge (cm)");
               const widthIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "breite (cm)");
               const heightIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "höhe (cm)");
               const loadingMetersIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "lademeter");
               const cubicMetersIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "kubikmeter");
               const numberOfPackagesIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "anzahl packstücke");
               const packagingTypeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "verpackungsart");
               const effectiveWeightIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "effektives gewicht");
                const expressNextDayIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "express next day");
                const express12PMIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "express 12:00 uhr");
                const express10AMIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "express 10:00 uhr");
                const express8AMtIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "express 08:00 uhr");
                const fixedDateIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "fixtermin");
                const emailNotificationIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "e-mail avis");
                const telephoneNotificationIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "telefonisches avis");
                const bookingWithAvisIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "booking in avis");
                const hazardousGoodsSurchargeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "gefahrgutzuschlag");
                const shortWeekSurchargeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "kurzwochenzuschlag");
                 const forwardercertificateIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "spediteurbescheinigung");
                  const b2CSurchargeNationalIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "b2c zuschlag (national)");
                   const b2CSurchargeInternationalIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "b2c zuschlag (international)");
                    const securityFeeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "security fee");
                    const insuranceIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "versicherung");
                    const portsDocumentsIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "porti/papiere");
const projectType =0;
              for (let index = rowsWithoutHeadersIndex; index < rows.length; index++) {
    const element = rows[index].toString().replace(/^\s*[\r\n]+/, '').split(",");
     
const Id =uuidv4();
    shipmentData.push({
... new CShipmentRow(projectType),
           Id,
            "id": Id,
            "ShipmentId": shipmentIdIndex>=0?element[shipmentIdIndex]: "",
            "ShipmentDate": shippingDateIndex>=0?element[shippingDateIndex]: "",
            "ZipCodeShipper": shippingPostalCodeIndex>=0?element[shippingPostalCodeIndex]: "",
            "ZipCodeConsignee":  recipientPostalCodeIndex>=0?element[recipientPostalCodeIndex]: "",
            "City":  cityIndex>=0?element[cityIndex]: "",
            "Country": countryIndex>=0?element[countryIndex]: "",
            "Length":  lengthIndex>=0?Number(element[lengthIndex]): 0,
            "Wide":  widthIndex>=0?Number(element[widthIndex]): 0,
            "Height": heightIndex>=0?Number(element[heightIndex]): 0,
            "LoadingMeters": loadingMetersIndex>=0?Number(element[loadingMetersIndex]): 0,
            "CubicMeters":  cubicMetersIndex>=0?Number(element[cubicMetersIndex]): 0,
            "PalletCount":  numberOfPackagesIndex>=0?Number(element[numberOfPackagesIndex]): 0,
            "PackagingType":  packagingTypeIndex>=0?element[packagingTypeIndex]: "",
            "EffectiveWeight": effectiveWeightIndex>=0?Number(element[effectiveWeightIndex]): 0,
           
            "ExpressNextDay": expressNextDayIndex>=0?CALCUTION_TYPE_MAPPER[element[expressNextDayIndex]]: false,
            "Express12":express12PMIndex>=0?CALCUTION_TYPE_MAPPER[element[express12PMIndex]]: false,
            "Express10":express10AMIndex>=0?CALCUTION_TYPE_MAPPER[element[express10AMIndex]]: false,
            "Express8": express8AMtIndex>=0?CALCUTION_TYPE_MAPPER[element[express8AMtIndex]]: false,
            "Fixtermin":fixedDateIndex>=0?CALCUTION_TYPE_MAPPER[element[fixedDateIndex]]: false,
            "EmailAvis": emailNotificationIndex>=0?CALCUTION_TYPE_MAPPER[element[emailNotificationIndex]]: false,
            "PhoneAvis": telephoneNotificationIndex>=0?CALCUTION_TYPE_MAPPER[element[telephoneNotificationIndex]]: false,
            "BookingInAvis":bookingWithAvisIndex>=0?CALCUTION_TYPE_MAPPER[element[bookingWithAvisIndex]]: false,
            "DangerousGoodsSurcharge": false,
            "LongGoodsSurcharge": hazardousGoodsSurchargeIndex>=0?CALCUTION_TYPE_MAPPER[element[hazardousGoodsSurchargeIndex]]:false,
            "ShortWeekSurcharge": shortWeekSurchargeIndex>=0?CALCUTION_TYPE_MAPPER[element[shortWeekSurchargeIndex]]:false,
           
            "CarrierCertificate": forwardercertificateIndex>=0?CALCUTION_TYPE_MAPPER[element[forwardercertificateIndex]]: false,
            "B2CNationalSurcharge": b2CSurchargeNationalIndex>=0?CALCUTION_TYPE_MAPPER[element[b2CSurchargeNationalIndex]]: false,
            "B2CInternationalSurcharge":b2CSurchargeInternationalIndex>=0?CALCUTION_TYPE_MAPPER[element[b2CSurchargeInternationalIndex]]:false,
            "SecurityFee": securityFeeIndex>=0?CALCUTION_TYPE_MAPPER[element[securityFeeIndex]]: false,
            "Insurance": insuranceIndex>=0?CALCUTION_TYPE_MAPPER[element[insuranceIndex]]: false,
            "PortiPapiere": portsDocumentsIndex>=0?CALCUTION_TYPE_MAPPER[element[portsDocumentsIndex]]:false,          
        })
    
  }
}

const prepareData={
  "projectId": projectId,
 shipmentData,
  "append": true
}
  return prepareData;
};