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
  
   const shipmentIdIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Sendungs-ID")
   const shippingDateIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Versanddatum");
     const shippingPostalCodeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Versand Postleitzahl");
      const recipientPostalCodeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Empfangs Postleitzahl");
            const locationIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Ort");
             const countryIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Land");
              const lengthIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Länge (cm)");
               const widthIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Breite (cm)");
               const heightIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Höhe (cm)");
               const loadingMetersIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Lademeter");
               const cubicMetersIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Kubikmeter");
               const numberOfPackagesIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Anzahl Packstücke");
               const packagingTypeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Verpackungsart");
               const effectiveWeightIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Effektives Gewicht");
                const expressNextDayIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Express Next Day");
                const express12PMIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Express 12:00 Uhr");
                const express10AMIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Express 10:00 Uhr");
                const express8AMtIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Express 08:00 Uhr");
                const fixedDateIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Fixtermin");
                const emailNotificationIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "E-Mail Avis");
                const telephoneNotificationIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Telefonisches Avis");
                const bookingWithAvisIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Booking in Avis");
                const hazardousGoodsSurchargeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Gefahrgutzuschlag");
                const shortWeekSurchargeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Kurzwochenzuschlag");
                 const forwardercertificateIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Spediteurbescheinigung");
                  const b2CSurchargeNationalIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "B2C Zuschlag (national)");
                   const b2CSurchargeInternationalIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "B2C Zuschlag (international)");
                    const securityFeeIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Security Fee");
                    const insuranceIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Versicherung");
                    const portsDocumentsIndex = headers.findIndex((h:any) => h.trim().toLowerCase() == "Porti/Papiere");

              for (let index = rowsWithoutHeadersIndex; index < rows.length; index++) {
    const element = rows[index].toString().replace(/^\s*[\r\n]+/, '').split(",");
   
const Id =uuidv4();
    shipmentData.push({
           Id,
            "id": Id,
            "ShipmentId": shipmentIdIndex>=0?element[shipmentIdIndex]: "",
            "ShipmentDate": shippingDateIndex>=0?element[shippingDateIndex]: "",
            "ZipCodeShipper": shippingPostalCodeIndex>=0?element[shippingPostalCodeIndex]: "",
            "ZipCodeConsignee":  recipientPostalCodeIndex>=0?element[recipientPostalCodeIndex]: "",
            "City":  locationIndex>=0?element[locationIndex]: "",
            "Country": countryIndex>=0?element[countryIndex]: "",
            "Length":  lengthIndex>=0?element[lengthIndex]: "",
            "Wide":  widthIndex>=0?element[widthIndex]: "",
            "Height": heightIndex>=0?element[heightIndex]: "",
            "LoadingMeters": loadingMetersIndex>=0?element[loadingMetersIndex]: "",
            "CubicMeters":  cubicMetersIndex>=0?element[cubicMetersIndex]: "",
            "PalletCount":  numberOfPackagesIndex>=0?element[numberOfPackagesIndex]: "",
            "PackagingType":  packagingTypeIndex>=0?element[packagingTypeIndex]: "",
            "EffectiveWeight": effectiveWeightIndex>=0?element[effectiveWeightIndex]: "",
            "ChargeableWeight":0.0,
            "MinimumWeight":0.0,
            "WeightByCubicMeters":0.0,
            "WeightByLoadingMeters": 0.0,
            "Stackable": false,
            "StackFactor": 1,
            "StackId": "",
            "StackFootprintLoadingMeters": 0.0,
            "ExpressNextDay": expressNextDayIndex>=0?element[expressNextDayIndex]: "",
            "Express12":express12PMIndex>=0?element[express12PMIndex]: "",
            "Express10":express10AMIndex>=0?element[express10AMIndex]: "",
            "Express8": express8AMtIndex>=0?element[express8AMtIndex]: "",
            "Fixtermin":fixedDateIndex>=0?element[fixedDateIndex]: "",
            "EmailAvis": emailNotificationIndex>=0?element[emailNotificationIndex]: "",
            "PhoneAvis": telephoneNotificationIndex>=0?element[telephoneNotificationIndex]: "",
            "BookingInAvis":bookingWithAvisIndex>=0?element[bookingWithAvisIndex]: "",
            "DangerousGoodsSurcharge": false,
            "LongGoodsSurcharge": hazardousGoodsSurchargeIndex>=0?element[hazardousGoodsSurchargeIndex]: "",
            "ShortWeekSurcharge": shortWeekSurchargeIndex>=0?element[shortWeekSurchargeIndex]: "",
            "PalletExchange": false,
            "PalletBoxExchange": false,
            "CarrierCertificate": forwardercertificateIndex>=0?element[forwardercertificateIndex]: "",
            "B2CNationalSurcharge": b2CSurchargeNationalIndex>=0?element[b2CSurchargeNationalIndex]: "",
            "B2CInternationalSurcharge":b2CSurchargeInternationalIndex>=0?element[b2CSurchargeInternationalIndex]: "",
            "SecurityFee": securityFeeIndex>=0?element[securityFeeIndex]: "",
            "Insurance": insuranceIndex>=0?element[insuranceIndex]: "",
            "PortiPapiere": portsDocumentsIndex>=0?element[portsDocumentsIndex]: "",
            "Custom1": false,
            "Custom2": false,
            "Custom3": false,
            "Custom4": false,
            "Custom5": false,
            "Message": "",
            "ErrorType": 0,
            "Price": 0.0,
            "TotalPrice": 0.0,
            "ExtraCostsTotalPrice": 0.0,
            "Toll": 0.0,
            "TollPercent": 0.0,
            "Diesel": 0.0,
            "DieselPercent": 0.0,
            "IsConsolidated": false,
            "IsConsolidatedSum": false,
            "hasPackagingType": false,
            "projectType": 0,
            "undefined": "1"
        })
    
  }
}


  


console.log("shipmentData: ",shipmentData);
const prepareData={
  "projectId": projectId,
 shipmentData,
  "append": true
}
  return prepareData;
};