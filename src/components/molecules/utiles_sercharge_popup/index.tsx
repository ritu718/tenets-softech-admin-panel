import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import SouthEastIcon from "@mui/icons-material/SouthEast";
// import { T_Countries, T_Country } from "~classes/index";
// import Countries from "~data/countries.json";
import Countries from "../../../../countries.json";



export type T_Country = {
  icon: string;
  locale: string;
  name: string;
};

export type T_Countries = Record<string, T_Country>;


export const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/;

export function capitalizeFirstLetter(string: string) {
  if (string.length === 0) {
    return false;
  }

  return string.replace(string[0], string[0].toUpperCase());
}

export function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

export function toLocalDate(date: string, locale: string) {
  if (date.length === 0 || locale === "") {
    return "";
  }

  const dateModel = new Date(date);
  const day = dateModel.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const time = dateModel.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

  return `${day} / ${time}`;
}

export function isObject(value: object) {
  return typeof value === "object";
}

export function scrollToTop(behavior: ScrollBehavior | undefined) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: behavior || "auto",
  });
}

export class Utils {
  static getTrend(price: number | null | undefined) {
    if (price === null || typeof price === "undefined") {
      return "warning";
    }

    if (price < 0) {
      return "down";
    }

    if (price === 0) {
      return "equal";
    }

    if (price > 0) {
      return "up";
    }

    return "warning";
  }

  static trendSign(trend: string) {
    switch (trend) {
      case "warning":
        return <ReportGmailerrorredIcon fontSize="small" />;
      case "up":
        return <NorthEastIcon fontSize="small" />;
      case "down":
        return <SouthEastIcon fontSize="small" />;
      case "equal":
        return <DragHandleIcon fontSize="small" />;
      default:
        return null;
    }
  }

  static getSignedValue(incomingPrice: number, isPrice: number) {
    if (!incomingPrice || !isPrice) {
      return "---";
    }

    const difference = parseFloat(incomingPrice.toString().replace(/,/g, ".")) - parseFloat(isPrice.toString().replace(/,/g, "."));

    return difference > 0 ? `+${difference.toString().replace(/\./g, ",")}` : `${difference.toString().replace(/\./g, ",")}`;
  }

  static getValueWithDecimal(value: string) {
    if (!value) {
      return "";
    }

    return value.toString().includes(",") ? value : `${value},00`;
  }

  static toLocalePrice(price: number, locale = "de-DE", currencySign = "EUR") {
    if (typeof price !== "number") {
      return "";
    }

    const localeStringOptions:any = { style: "currency", currency: currencySign };
    return price.toLocaleString(locale, localeStringOptions);
  }

  static isValidEmail(email: string) {
    if (email.length === 0) {
      return false;
    }

    return EMAIL_PATTERN.test(email.toLowerCase());
  }

  static formatToSingleDigit(value: number) {
    if (typeof value === "undefined" || !value) {
      return "";
    }

    const localeValue = value.toLocaleString("de-DE", { style: "decimal", maximumFractionDigits: 0, minimumFractionDigits: 0 });

    return localeValue;
  }

  static formatToLocaleDecimalWithSign(value: number, sign: string) {
    const localeValue = (value ?? 0).toLocaleString("de-DE", { style: "decimal", maximumFractionDigits: 2, minimumFractionDigits: 2 });

    return `${localeValue} ${sign}`;
  }

  static formatToLocaleDecimal(value: number, fractionDigits = 2) {
    if (typeof value === "undefined" || value === null) {
      return "";
    }

    const localeValue = value.toLocaleString("de-DE", { style: "decimal", maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits });

    return localeValue;
  }

  static toDoubleDecimal(value: string | number) {
    if (!value) {
      return "0,00";
    }

    return value.toLocaleString("de-DE", { style: "decimal", maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }

  static objectIsEmpty(object: object) {
    return Object.keys(object).length === 0;
  }

  static formatToTwoDecimalPercent(value: number | string, base = 100) {
    const toFormatValue = typeof value === "string" ? Number(this.formatToNumber(value || "0")) : value;

    return Number((base * (toFormatValue / 100)).toFixed(2));
  }

  static formatToNumber(value: string): number {
    if (!value.includes(",")) {
      return parseFloat(value);
    }

    return parseFloat(value.replace(",", "."));
  }

  static getSortedCountries(): T_Country[] {
    const orderBy = ["DE", "INT"];
    const countryKeys = Object.keys(Countries);

    const sortedKeys = [...orderBy, ...countryKeys.filter((key) => !orderBy.includes(key)).sort((a, b) => b.localeCompare(a))];
    const sortedCountries = sortedKeys.map((key) => (Countries as T_Countries)[key as keyof T_Countries]);

    return sortedCountries;
  }

  static getPriceTrendFromCurrency(baseValue: number, comparisonValue: number) {
    const valueDifference = !comparisonValue ? null : comparisonValue - baseValue;
    const trend: keyof { up: string; down: string; equal: string; warning: string } = Utils.getTrend(valueDifference);
    const preparedPriceDifference = `${trend === "up" ? "+" : ""}${Utils.toLocalePrice(valueDifference || 0)}`;
    const preparedComparisonPrice = Utils.toLocalePrice(comparisonValue);

    return { trend, preparedPriceDifference, preparedComparisonPrice };
  }

  static getPriceTrendFromPercent(baseValue: number, comparisonValue: number) {
    const valueDifference = !comparisonValue ? null : comparisonValue - baseValue;
    const trend: keyof { up: string; down: string; equal: string; warning: string } = Utils.getTrend(valueDifference);
    const preparedValueDifference = `${trend === "up" ? "+" : ""}${Utils.formatToLocaleDecimalWithSign(valueDifference || 0, "%")}`;
    const preparedComparisonValue = Utils.formatToLocaleDecimalWithSign(comparisonValue, "%");

    return { trend, preparedValueDifference, preparedComparisonValue };
  }
}
