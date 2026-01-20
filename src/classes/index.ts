/* eslint max-classes-per-file: "off" */
import CommonText from "@/common-text/Common-Text";
import { LongGoodsSurchargeValuesProps } from "@/components/organisms/surcharge_popup";
import { GridRowId } from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";


// ToDo: Anstelle Dictionary nameof verwenden, sobald verfügbar
export class DictionaryShipmentData {
  public static ShipmentDate = {
    locale: {
      en: "ShipmentDate",
      de: "Versanddatum",
    },
  };

  public static ZipCodeShipper = {
    locale: {
      en: "ZipCodeShipper",
      de: "Versand Postleitzahl",
    },
    placeholder: "PLZ",
  };

  public static ZipCodeConsignee = {
    locale: {
      en: "ZipCodeConsignee",
      de: "Empfangs Postleitzahl",
    },
    placeholder: "PLZ",
  };

  public static City = {
    locale: {
      en: "City",
      de: "Ort",
    },
    placeholder: "Ort",
  };

  public static Country = {
    locale: {
      en: "Country",
      de: "Land",
    },
    placeholder: "Land",
  };

  public static Length = {
    locale: {
      en: "Length",
      de: "Länge",
    },
    unit: "cm",
    placeholder: "cm",
  };

  public static Wide = {
    locale: {
      en: "Wide",
      de: "Breite",
    },
    unit: "cm",
    placeholder: "cm",
  };

  public static Height = {
    locale: {
      en: "Height",
      de: "Höhe",
    },
    unit: "cm",
    placeholder: "cm",
  };

  public static LoadingMeters = {
    locale: {
      en: "LoadingMeters",
      de: "Lademeter",
    },
    unit: "m²",
    placeholder: "m²",
  };

  public static CubicMeters = {
    locale: {
      en: "CubicMeters",
      de: "Kubikmeter",
    },
    unit: "m³",
    placeholder: "m³",
  };

  public static PalletCount = {
    locale: {
      en: "PalletCount",
      de: "Anzahl Packstücke",
    },
    placeholder: "Anzahl",
  };

  public static PackagingType = {
    locale: {
      en: "PackagingType",
      de: "Verpackungsart",
    },
  };

  public static EffectiveWeight = {
    locale: {
      en: "EffectiveWeight",
      de: "Effektives Gewicht",
    },
    unit: "kg",
    placeholder: "kg",
  };

  public static ChargeableWeight = {
    locale: {
      en: "Chargeable Weight",
      de: "Frachtpflichtiges Gewicht",
    },
    unit: "kg",
    placeholder: "kg",
  };

  public static WeightByCubicMeters = {
    locale: {
      en: "Weight by Cubic Meters",
      de: "Gewicht nach Kubikmetern",
    },
    unit: "kg",
    placeholder: "kg",
  };

  public static WeightByLoadingMeters = {
    locale: {
      en: "Weight by Loading Meters",
      de: "Gewicht nach Lademetern",
    },
    unit: "kg",
    placeholder: "kg",
  };

  public static MinimumWeight = {
    locale: {
      en: "Minimum Weight",
      de: "Mindestgewicht",
    },
    unit: "kg",
    placeholder: "kg",
  };

  public static Price = {
    locale: {
      en: "Price",
      de: "Preis",
    },
    unit: "€",
  };

  public static Info = {
    locale: {
      en: "Information",
      de: "Information",
    },
  };

  public static OfferingPrice = {
    locale: {
      en: "Offering Price",
      de: "Angebots Preis",
    },
    unit: "€",
  };
}

export class CShipmentRow {
  constructor(projectType?: number) {
    this.projectType = projectType || 0;
  }

  public Id = uuidv4();

  public id = uuidv4();

  public ShipmentId = "";

  public ShipmentDate = "";

  public ZipCodeShipper = "";

  public ZipCodeConsignee = "";

  public City = "";

  public Country = "";

  public Length: number | null = 0;

  public Wide: number | null = 0;

  public Height: number | null = 0;

  public LoadingMeters: number | null = 0;

  public CubicMeters: number | null = 0;

  public PalletCount: number | null = 0;

  public PackagingType = "";

  public EffectiveWeight: number | null = 0;

  public ChargeableWeight: number | null = 0;

  public MinimumWeight: number | null = 0;

  public WeightByCubicMeters: number | null = 0;

  public WeightByLoadingMeters: number | null = 0;

  public Stackable = false;

  public StackFactor: number | null = 1;

  public StackId = "";

  public StackFootprintLoadingMeters: number | null = 0;

  public ExpressNextDay = false;

  public Express12 = false;

  public Express10 = false;

  public Express8 = false;

  public Fixtermin = false;

  public EmailAvis = false;

  public PhoneAvis = false;

  public BookingInAvis = false;

  public DangerousGoodsSurcharge = false;

  public LongGoodsSurcharge = false;

  public ShortWeekSurcharge = false;

  public PalletExchange = false;

  public PalletBoxExchange = false;

  public CarrierCertificate = false;

  public B2CNationalSurcharge = false;

  public B2CInternationalSurcharge = false;

  public SecurityFee = false;

  public Insurance = false;

  public PortiPapiere = false;

  public Custom1 = false;

  public Custom2 = false;

  public Custom3 = false;

  public Custom4 = false;

  public Custom5 = false;

  public Message = "";

  public ErrorType = 0;

  public Price: number | null = 0;

  public TotalPrice: number | null = 0;

  public ExtraCostsTotalPrice: number | null = 0;

  public Toll: number | null = 0;

  public TollPercent: number | null = 0;

  public Diesel: number | null = 0;

  public DieselPercent: number | null = 0;

  public IsConsolidated = false;

  public IsConsolidatedSum = false;

  public hasPackagingType = false;

  public projectType = 0;
}

export class CShipmentRowWithResult extends CShipmentRow {
  public WeightByCubicMeters: number | null = null;

  public WeightByLoadingMeters: number | null = null;

  public MinimumWeight: number | null = null;

  public ChargeableWeight: number | null = null;

  public Price: number | null = null;

  public Toll: number | null = null;

  public Diesel: number | null = null;

  public TotalPrice: number | null = null;
}

export type DieselFloaterMatrixProps = {
  [year: string]: {
    [dieselFloaterSource: string]: number;
  }[];
};

export type ExtraCostUnitProps = "€" | "%";

export type ExtraCostValueProps = {
  price: number;
  percentValue: number;
  unit: ExtraCostUnitProps;
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

export type ExtraCostsProps = {
  [country: string]: {
    Base: ExtraCostProps[];
    Additional?: ExtraCostProps;
  };
};

export type GroupedByCountryExtraCosts = {
  [key: string]: ExtraCostsProps;
};

export type ShipmentDataRowExtraCostsProps = {
  Toll: number;
  Diesel: number;
  ExpressNextDay?: number;
  Express12?: number;
  Express10?: number;
  Express8?: number;
  Fixtermin?: number;
  EmailAvis?: number;
  PhoneAvis?: number;
  BookingInAvis?: number;
  DangerousGoodsSurcharge?: number;
  LongGoodsSurcharge?: number;
  ShortWeekSurcharge?: number;
  PalletExchange?: number;
  PalletBoxExchange?: number;
  CarrierCertificate?: number;
  B2CNationalSurcharge?: number;
  B2CInternationalSurcharge?: number;
  SecurityFee?: number;
  Insurance?: number;
  PortiPapiere?: number;
  Custom1?: number;
  Custom2?: number;
  Custom3?: number;
  Custom4?: number;
  Custom5?: number;
};

export type ShipmentDataRowExtraCostsSelectProps = {
  ExpressNextDay?: boolean;
  Express12?: boolean;
  Express10?: boolean;
  Express8?: boolean;
  Fixtermin?: boolean;
  EmailAvis?: boolean;
  PhoneAvis?: boolean;
  BookingInAvis?: boolean;
  DangerousGoodsSurcharge?: boolean;
  LongGoodsSurcharge?: boolean;
  ShortWeekSurcharge?: boolean;
  PalletExchange?: boolean;
  PalletBoxExchange?: boolean;
  CarrierCertificate?: boolean;
  B2CNationalSurcharge?: boolean;
  B2CInternationalSurcharge?: boolean;
  SecurityFee?: boolean;
  Insurance?: boolean;
  PortiPapiere?: boolean;
  Custom1?: boolean;
  Custom2?: boolean;
  Custom3?: boolean;
  Custom4?: boolean;
  Custom5?: boolean;
};

export type ShipmentDataRowProps = {
  id: number | string;
  ShipmentId?: string;
  ShipmentDate: string;
  ZipCodeShipper: string;
  ZipCodeConsignee: string;
  City: string;
  Country: string;
  Length: number;
  Wide: number;
  Height: number;
  HasFP?: boolean;
  LoadingMeters: number;
  CubicMeters: number;
  PalletCount: number;
  FPPalletCount?: number;
  PackagingType: string;
  EffectiveWeight: number;
  ChargeableWeight: number;
  MinimumWeight: number;
  WeightByCubicMeters: number;
  WeightByLoadingMeters: number;
  Message: string;
  ErrorType: number;
  Price: number;
  TotalPrice: number;
  ExtraCostsTotalPrice: number;
  Toll: number;
  TollPercent: number;
  Diesel: number;
  DieselPercent: number;
  IsConsolidated?: boolean;
  IsConsolidatedSum?: boolean;
  ExtraCosts?: Omit<ShipmentDataRowExtraCostsProps, "Toll" | "Diesel">;
  hasPackagingType: boolean;
  projectType?: number;
  Stackable?: boolean;
  StackFactor?: number;
  StackId?: string;
  StackFootprintLoadingMeters?: number;
} & ShipmentDataRowExtraCostsSelectProps;

export type ShipmentDataProps = {
  [country: string]: ShipmentDataRowProps[];
};

export type ShipmentDataGroupedByCountryProps = {
  [country: string]: ShipmentDataRowProps[];
};

export class CShipmentDataRowUtils {
  public static isEmpty(shipmentRow: CShipmentRow) {
    return (
      shipmentRow.City.length === 0 &&
      shipmentRow.Country.length === 0 &&
      (shipmentRow.CubicMeters === null || shipmentRow.CubicMeters === 0) &&
      (shipmentRow.EffectiveWeight === null || shipmentRow.EffectiveWeight === 0) &&
      (shipmentRow.Height === null || shipmentRow.Height === 0) &&
      (shipmentRow.Length === null || shipmentRow.Length === 0) &&
      (shipmentRow.LoadingMeters === null || shipmentRow.LoadingMeters === 0) &&
      shipmentRow.PackagingType.length === 0 &&
      (shipmentRow.PalletCount === null || shipmentRow.PalletCount === 0) &&
      (shipmentRow.ShipmentDate === null || shipmentRow.ShipmentDate.length === 0) &&
      (shipmentRow.Wide === null || shipmentRow.Wide === 0) &&
      shipmentRow.ZipCodeConsignee.length === 0 &&
      shipmentRow.ZipCodeShipper.length === 0
    );
  }
}

export class CShipmentData {
  public ShipmentData: CShipmentRow[] = [];
}

export class CRowResult {
  public message: string;

  public errorType: number;

  public price = 0;

  constructor(_message: string, _errorType: number, _price = 0) {
    this.message = _message;
    this.errorType = _errorType;
    this.price = _price;
  }
}

export interface IPackagingTypeAutocompleteOption {
  shorthand: string;
  longhand: string;
}

export type T_Verpackungsart = {
  label: string;
  description: string;
};

export class CPackagingTypes {
  public static packagingTypes = [
    { VP: "Viertelpalette" },
    { KT: "Karton" },
    { CC: "Collico" },
    { HP: "Halbpalette" },
    { RC: "Rollcontainer" },
    { CP: "Chep-Palette" },
    { CT: "Container" },
    { EB: "Einweg-Behälter" },
    { EP: "Einwegpalette" },
    { EW: "Einwegpalette" },
    { FP: "DB Euro-Flachpalette" },
    { GP: "Gitterboxpalette" },
    { IB: "IBC-Behälter" },
    { KP: "Kundeneigene Palette" },
    { PL: "Palette" },
    { RP: "Rahmenalette" },
    { TC: "Tankcontainer" },
    { VG: "Verschlag" },
    { XP: "Palette" },
  ];

  public static getAutoCompletePackagingTypes() {
    return this.packagingTypes.reduce((acc: any[], packagingType) => {
      const convertedPackagingType: { shorthand: string; longhand: string } = {
        shorthand: Object.keys(packagingType)[0],
        longhand: Object.values(packagingType)[0],
      };

      acc.push({ ...convertedPackagingType });

      return acc;
    }, []);
  }
}

// -----------------------------------------------------------------------------

export class DictionaryFreightCalculationBasis {
  public static Shorthand = { locale: { en: "Shorthand", de: "Kürzel" } };

  public static InternalShorthand = { locale: { en: "InternalShorthand", de: "Internes Kürzel" } };

  public static Description = { locale: { en: "Description", de: "Bezeichnung" } };

  public static InternalDescription = { locale: { en: "InternalDescription", de: "Interne Bezeichnung" } };

  public static Weight = { locale: { en: "Weight", de: "Gewicht" } };
}

export class CFreightCalculationBasisRow implements FreightCalculationBasisBaseProps {
  public Shorthand:any = { locale: { en: "Shorthand", de: "Kürzel" } };

  public InternalShorthand :any= { locale: { en: "InternalShorthand", de: "Internes Kürzel" } };

  public Description:any = { locale: { en: "Description", de: "Bezeichnung" } };

  public InternalDescription:any = { locale: { en: "InternalDescription", de: "Interne Bezeichnung" } };

  public Weight:any = { locale: { en: "Weight", de: "Gewicht" } };
}

export class CFreightCalculationBasis {
  public FreightCalculationBasis: CFreightCalculationBasisRow[] = [];
}

export class CFreightCalculationAdditionalRow implements FreightCalculationBasisAdditionalProps {
  public Id: string = uuidv4();

  public id: string = uuidv4();

  public Shorthand: "" = "";

  public Description: "" = "";

  public Weight: number | null = null;
}

export class CAdditionalFreightCalculationBasis {
  public FreightCalculationBasis: CFreightCalculationAdditionalRow[] = [];
}

export class CFreightCalculationDataRowUtils {
  public static isEmpty(freightCalculationRow: CFreightCalculationAdditionalRow) {
    return (
      freightCalculationRow.Shorthand.length === 0 &&
      freightCalculationRow.Description.length === 0 &&
      (freightCalculationRow.Weight === null || freightCalculationRow.Weight === 0)
    );
  }
}
export class CFreightCalculationMinimumWeightHeadline {
  public static Headline = ["Kürzel", "Internes Kürzel", "Beschreibung", "Interne Beschreibung", "Gewicht in Kg"];
}

// -----------------------------------------------------------------------------

export type BulkinessProps = {
  CubicMeters: number | null;
  LoadingMeters: number | null;
};

export type OptionsProps = {
  LoadingMetersKg: number | null;
  LoadingMetersLdm: number | null;
};

export interface FreightCalculationBasisBaseProps {
  Shorthand: string;
  InternalShorthand: string;
  Description: string;
  InternalDescription: string;
  Weight: string;
}

export interface FreightCalculationBasisAdditionalProps {
  Id: string;
  Shorthand: string;
  Description: string;
  Weight: number | null;
}

export class CBulkiness implements BulkinessProps {
  public CubicMeters = null;

  public LoadingMeters = null;
}

export class COptions implements OptionsProps {
  public LoadingMetersKg = null;

  public LoadingMetersLdm = null;
}

export type MinimumWeightProps = {
  Base: {
    [key: string]: FreightCalculationBasisBaseProps;
  };
  Additional?: {
    [key: string]: FreightCalculationBasisAdditionalProps;
  };
};

export type FreightCalculationBasisProps = {
  [country: string]: {
    CalculationType: number;
    IsConsolidated?: boolean;
    Bulkiness: BulkinessProps;
    Options: OptionsProps;
    MinimumWeight: MinimumWeightProps;
  };
};

// -----------------------------------------------------------------------------

export interface IRates {
  DefaultRate: object;
}

export interface IRateZipCodes {
  ZipCodes: object[];
}

export interface IRateZipCode {
  Id: string;
  Codes: string;
  Zone: string | number;
  MinPrice?: number;  
  MaxPrice?: number;  
}

export class CRatesRow {
  public static CreateDefaultRate() {
    return {
      "-1": this.CreateDefaultRateRow(),
    };
  }

  public static CreateDefaultRateRow() {
    return {
      Id: uuidv4(),
      Prices: {},
    };
  }

  public static CreateDefaultZipCodes() {
    const newZipCodes = [];

    for (let index = 0; index < 10; index++) {
      newZipCodes.push({ Id: uuidv4(), Zone: "", Codes: String(index) });
    }

    return newZipCodes;
  }
}

export class CRateUtils {
  public static isEmpty(gewicht: string) {
    return parseInt(gewicht || "-1", 10) < 0;
  }
}

export class CRates {
  public Rates = {};
}

export type T_Rates = {
  [key: string]: any;
};

export type WeightsProps = {
  [weight: string]: {
    Id: string;
    Prices: {
      [id: string]: number;
    };
  };
};

export type ZipCodesProps = {
  Id: string;
  Codes: string;
  Zone: string;
};

export type RatesProps = {
  [country: string]: {
    TariffType: string;
    Weights: WeightsProps;
    ZipCodes: ZipCodesProps[];
  };
};

// -----------------------------------------------------------------------------

export interface IMinimumWeightProperties {
  name: string;
  type: string;
  placeholder: string;
  input: boolean;
}

// -----------------------------------------------------------------------------

export interface IBroadcastProfile {
  profile: string;
  description: string;
  icon: object;
}

export class CBroadcastProfile implements IBroadcastProfile {
  public profile = "";

  public description = "";

  public icon = {};
}

// -----------------------------------------------------------------------------

export interface ICountry {
  name: string;
  icon: string;
  locale: string;
  type: string;
}

// -----------------------------------------------------------------------------

export interface IExtraCosts {
  Base: object;
  Additional: object;
}

export class CExtraCosts implements IExtraCosts {
  public Base = {
    Toll: {
      id: uuidv4(),
      Term: "Maut",
      Value: 0,
      Unit: "%",
      Description: "Fester Zuschlag in Euro / Prozentualer Zuschlag",
    },
    Diesel: {
      id: uuidv4(),
      Term: "Dieselzuschlag",
      Value: 0,
      Unit: "%",
      Description: "Prozentualer Zuschlag / Floatermodell",
    },
    ExpressNextDay: {
      id: uuidv4(),
      Term: "Express Next Day",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    Express12: {
      id: uuidv4(),
      Term: "Express 12:00 Uhr",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    Express10: {
      id: uuidv4(),
      Term: "Express 10:00 Uhr",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    Express8: {
      id: uuidv4(),
      Term: "Express 08:00 Uhr",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    TailLiftSurcharge: {
      id: uuidv4(),
      Term: "Hebebühnenzuschlag",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    Fixtermin: {
      id: uuidv4(),
      Term: "Fixtermin",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    EmailAvis: {
      id: uuidv4(),
      Term: "E-Mail Avis",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    PhoneAvis: {
      id: uuidv4(),
      Term: "Telefonisches Avis",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    BookingInAvis: {
      id: uuidv4(),
      Term: "Booking in Avis",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    DangerousGoodsSurcharge: {
      id: uuidv4(),
      Term: "Gefahrgutzuschlag",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    LongGoodsSurcharge: {
      id: uuidv4(),
      Term: "Langgutzuschlag",
      Value: 0,
      Values: {},
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    ShortWeekSurcharge: {
      id: uuidv4(),
      Term: "Kurzwochenzuschlag",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    PalletExchange: {
      id: uuidv4(),
      Term: "Palettentausch",
      Value: 0,
      Unit: "€",
      Description: "Feste Gebühr je Palette in Euro",
    },
    PalletBoxExchange: {
      id: uuidv4(),
      Term: "Gitterboxtausch",
      Value: 0,
      Unit: "€",
      Description: "Feste Gebühr je Gitterbox in Euro",
    },
    CarrierCertificate: {
      id: uuidv4(),
      Term: "Spediteurbescheinigung",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    B2CNationalSurcharge: {
      id: uuidv4(),
      Term: "B2C Zuschlag (national)",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    B2CInternationalSurcharge: {
      id: uuidv4(),
      Term: "B2C Zuschlag (international)",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    SecurityFee: {
      id: uuidv4(),
      Term: "Security Fee",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Sendung in Euro",
    },
    Insurance: {
      id: uuidv4(),
      Term: "Versicherung",
      Value: 0,
      Unit: "€",
      Description: "Prämie nach Warenwert  daher kann auch ein Text eingegeben werden",
    },
    PortiPapiere: {
      id: uuidv4(),
      Term: "Porti/Papiere",
      Value: 0,
      Unit: "€",
      Description: "Fester Zuschlag je Rechnung in Euro",
    },
    Custom1: {
      id: uuidv4(),
      Term: "Eigene 1",
      Value: 0,
      Unit: "€",
      Description: "",
    },
    Custom2: {
      id: uuidv4(),
      Term: "Eigene 2",
      Value: 0,
      Unit: "€",
      Description: "",
    },
    Custom3: {
      id: uuidv4(),
      Term: "Eigene 3",
      Value: 0,
      Unit: "€",
      Description: "",
    },
    Custom4: {
      id: uuidv4(),
      Term: "Eigene 4",
      Value: 0,
      Unit: "€",
      Description: "",
    },
    Custom5: {
      id: uuidv4(),
      Term: "Eigene 5",
      Value: 0,
      Unit: "€",
      Description: "",
    },
  };

  public Additional = {
    id: uuidv4(),
    Term: "",
    Value: 0,
    Unit: "€",
    Description: "",
  };

  public static Headline = ["Bezeichnung", "Wert", "Einheit", "Beschreibung"];
}

// -----------------------------------------------------------------------------

export type CompanyProfile = {
  _id: string;
  firebaseId: string;
  email: string;
  company: string;
  firstName: string;
  lastName: string;
  loggedIn: boolean;
  created: string;
  type: string;
};

// -----------------------------------------------------------------------------

export type RateProps = {
  Id: string;
  Prices: {
    [key: string]: number;
  };
};

export type TotalCountryPriceProps = {
  shipmentDataLength: number;
  price: number;
  tollPrice: number;
  dieselPrice: number;
  totalExtraCostsPrice: number;
  totalPrice: number;
  allExtraCosts: {
    [key: string]: number;
  };
};

export type CarrierOfferingsProps = {
  _id: string;
  carrierProjectId: string;
  comment: string;
  companyProfile: CompanyProfile;
  created: string;
  extraCosts: {
    extraCosts: ExtraCostsProps;
  };
  fileList: any[];
  firebaseId: string;
  freightCalculationBasis: FreightCalculationBasisProps;
  projectId: string;
  rates: {
    rates: RatesProps;
  };
  shipperEmail: string;
  status: string;
  userProfile: string;
  offeringData: {
    [key: string]: ExtraCostsProps[];
  };
  totalOfferingPrice: number;
  totalCountryPrice: TotalCountryPriceProps;
};

export type CarrierOfferingExtraCostsProps = {
  id: string;
  Term: string;
  Value: number;
  Unit: string;
  Description: string;
  [key: `Offering-${number}`]: {
    price: number;
    unit: string;
  };
};

// -----------------------------------------------------------------------------

export interface ICommentFile {
  Name: string;
  Type: string;
  Base64: string;
}

export class CCommentFile implements ICommentFile {
  public Name = "";

  public Type = "";

  public Base64 = "";
}

// -----------------------------------------------------------------------------

export interface ICarrierOffering {
  ProjectId: string;
  Status: number;
}

export class CCarrierOffering implements ICarrierOffering {
  public ProjectId: string = uuidv4();

  public Status = 1;
}

// -----------------------------------------------------------------------------

export class FreightCalculationBase {
  public static BaseWeightProperties = [
    { name: "InternalShorthand", type: "text", placeholder: "Internes Kürzel", input: true },
    { name: "Description", type: "text", placeholder: "Beschreibung", input: false },
    { name: "InternalDescription", type: "text", placeholder: "Interne Beschreibung", input: true },
    { name: "Weight", type: "number", placeholder: "Kg", input: true },
  ];

  public static GetDefaultBaseWeights() {
    return CommonText.PackagingTypes.reduce((acc, cur) => {
      const [shorthand] = Object.keys(cur);

      return {
        ...acc,
        [shorthand]: this.BaseWeightProperties.reduce((propertiesAcc, propertiesCur) => {
          return { ...propertiesAcc, [propertiesCur.name]: "" };
        }, {}),
      };
    }, {});
  }
}

// -----------------------------------------------------------------------------

export enum E_Address {
  Name = "name",
  ContactPerson = "contactPerson",
  Company = "company",
  Email = "email",
  Address = "address",
  AddressNumber = "addressNumber",
  City = "city",
  ZipCode = "zipCode",
  Country = "country",
  CountryCode = "countryCode",
}

export interface I_Address {
  id?: string;
  name: string;
  contactPerson: string;
  company?: string;
  email?: string;
  address?: string;
  addressNumber?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  countryCode?: string;
}

export interface I_Input_Form_Error {
  [key: string]: boolean;
}

export class C_Address {
  public static New() {
    return {
      id: "",
      name: "",
      contactPerson: "",
      company: "",
      email: "",
      address: "",
      addressNumber: "",
      city: "",
      zipCode: "",
      country: "",
      countryCode: "",
    };
  }
}

// -----------------------------------------------------------------------------

export enum E_IPAFL_Storage {}

export interface IPAFL_Row {
  id: GridRowId | string;
  length: number | null;
  wide: number | null;
  height: number | null;
  weight: number | null;
  loadingMeters: number | null;
  palletCount: number | null;
  packagingType: string;
}

export interface IPAFL_TotalRow {
  id: string;
  caption?: string;
  totalPalletCount: number;
  totalWeight: number;
  totalLoadingMeter: number;
}

export enum E_ShippingDateAndTimeFrame {
  ShippingDate = "shippingDate",
  DeliveryDate = "deliveryDate",
  DeliveryTimeFrame = "deliveryTimeFrame",
}

export interface IPAFL_ShippingDateAndTimeFrame {
  shippingDate: string | null;
  deliveryDate: string | null;
  deliveryTimeFrame: string | null;
}

export interface IPAFL_ShippingUpdateDateAndTimeFrame {
  [key: string]: string | Date | null;
}

export interface IPAFL_TransportRequirementsSelectOnly {
  label: string;
  name: string;
}

export interface IPAFL_TransportRequirementsWithTable {
  id?: GridRowId;
  label: string;
  name: string;
  unit?: string | undefined;
  value?: string;
}

export interface IPAFL_SubmitStatus {
  valid: boolean;
  date: Date | null;
}

export interface IPAFL_Data {
  id: string;
  shipmentData: IPAFL_Row[];
  shippingDateAndTimeFrame: IPAFL_ShippingDateAndTimeFrame | undefined;
  userAddress: I_Address;
  shipperAddress: I_Address;
  carrierAddress: I_Address;
  transportRequirements: IPAFL_TransportRequirementsWithTable[];
  submitStatus: IPAFL_SubmitStatus;
}

export class CPartAndFullLoads {
  public static Row(): IPAFL_Row {
    return {
      id: uuidv4(),
      length: null,
      wide: null,
      height: null,
      weight: null,
      loadingMeters: null,
      palletCount: null,
      packagingType: "",
    };
  }

  public static TotalRow(): IPAFL_TotalRow {
    return {
      id: uuidv4(),
      totalPalletCount: 0,
      totalWeight: 0,
      totalLoadingMeter: 0,
    };
  }

  public static TransportRequirement(): IPAFL_TransportRequirementsWithTable {
    return {
      id: uuidv4(),
      unit: "",
      label: "",
      name: "",
    };
  }
}

export type T_Country = {
  icon: string;
  locale: string;
  name: string;
};

export type T_Countries = Record<string, T_Country>;

export type TotalCountyPriceProps = {
  allExtraCosts: {
    [extraCost: string]: number;
  };
  dieselPrice: number;
  price: number;
  shipmentDataLength: number;
  tollPrice: number;
  totalExtraCostsPrice: number;
  totalPrice: number;
};

export type TotalCountiesPriceProps = {
  [country: string]: TotalCountyPriceProps;
};

export type AllExtraCostsByCountryProps = {
  [country: string]: {
    country: string;
    shipper: TotalCountiesPriceProps;
    carriers: {
      [index: number]:
        | {
            [country: string]: ExtraCostsProps;
          }
        | undefined;
    };
  };
};

export type CarrierExtraCostsTotalProps = [
  {
    [country: string]: {
      shipmentDataLength: number;
      price: number;
      tollPrice: number;
      dieselPrice: number;
      totalExtraCostsPrice: number;
      totalPrice: number;
      allExtraCosts: {
        Toll: number;
        Diesel: number;
        ExtraCostsTotalPrice: number;
        BookingInAvis: number;
        LongGoodsSurcharge: number;
        B2CInternationalSurcharge: number;
      };
    };
  },
];

export type CarrierOfferingDataProps = {
  companyProfile: CompanyProfile;
  totalCountryPrice: CarrierExtraCostsTotalProps;
  extraCosts: ExtraCostsProps;
};

export type CarrierOfferingsDataProps = [
  {
    companyProfile: CompanyProfile;
    totalCountryPrice: CarrierExtraCostsTotalProps;
  },
];

export type T_TotalShipmentPrice = {
  price: number;
  tollPrice: number;
  dieselPrice: number;
  totalPrice: number;
};

export type ShipmentTotalProps = {
  totalShipmentPrice: number;
  countriesRowTotal: {
    [country: string]: TotalCountyPriceProps;
  };
};

export enum ProjectType {
  "Distribution",
  "Beschaffung",
}

export type T_ProjectInfo = {
  id: string;
  projectName: string;
  projectType: ProjectType;
};
