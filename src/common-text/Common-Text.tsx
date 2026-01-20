class CommonText {
  public static PackagingTypes = [
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
    { RP: "Rahmenpalette" },
    { TC: "Tankcontainer" },
    { VG: "Verschlag" },
    { XP: "Palette" },
  ];

  public static GetPackingTypes() {
    const packagingTypes = {};

    this.PackagingTypes.forEach((packingType) => {
      const [key] = Object.keys(packingType);
      const [value] = Object.values(packingType);
      packagingTypes[key] = value;
    });

    return packagingTypes;
  }

  public static IsPackagingTypeAvailable(packaging: string) {
    return this.PackagingTypes.some((packagingType) => {
      return packagingType.hasOwnProperty(packaging);
    });
  }

  public static ExtraCostsDict = [
    { Toll: "Maut" },
    { Diesel: "Dieselzuschlag" },
    { ExpressNextDay: "Express Next Day" },
    { Express12: "Express 12:00 Uhr" },
    { Express10: "Express 10:00 Uhr" },
    { Express8: "Express 08:00 Uhr" },
    { TailLiftSurcharge: "Hebebühnenzuschlag" },
    { Fixtermin: "Fixtermin" },
    { EmailAvis: "E-Mail Avis" },
    { PhoneAvis: "Telefonisches Avis" },
    { BookingInAvis: "Booking in Avis" },
    { DangerousGoodsSurcharge: "Gefahrgutzuschlag" },
    { LongGoodsSurcharge: "Langgutzuschlag" },
    { ShortWeekSurcharge: "Kurzwochenzuschlag" },
    { PalletExchange: "Palettentausch" },
    { PalletBoxExchange: "Gitterboxtausch" },
    { CarrierCertificate: "Spediteurbescheinigung" },
    { B2CNationalSurcharge: "B2C Zuschlag (national)" },
    { B2CInternationalSurcharge: "B2C Zuschlag (international)" },
    { SecurityFee: "Security Fee" },
    { Insurance: "Versicherung" },
    { PortiPapiere: "Porti/Papiere" },
  ];

  public static GetExtraCostsDict() {
    const extraCosts: { [key: string]: string } = {};

    this.ExtraCostsDict.forEach((cost) => {
      const [key] = Object.keys(cost);
      const [value] = Object.values(cost);

      extraCosts[key] = value;
    });

    return extraCosts;
  }

  public static GetFlippedExtraCostsDict() {
    const flippedExtraCosts: { [key: string]: string } = {};

    this.ExtraCostsDict.forEach((cost) => {
      const [key] = Object.keys(cost);
      const [value] = Object.values(cost);

      flippedExtraCosts[value] = key;
    });

    return flippedExtraCosts;
  }
}

export default CommonText;
