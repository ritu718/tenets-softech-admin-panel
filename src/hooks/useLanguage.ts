import { LANGUAGE_TEXT } from "@/constants/data";
import { useAppSelector } from "@/store/hooks";
import { useCallback, useMemo, useState } from "react";

export function useLanguage() {


    const language = useAppSelector((state) => state.languages.language);
    console.log("language value: ",language);
    
   const currencyFormatter = useMemo(
      () =>
        new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
          style: "currency",
          currency: "EUR",
        }),
      [language]
    );
     const localeText = useMemo(() => LANGUAGE_TEXT[language], [language]);
    const formatDate = useCallback(
      (isoString:any) => {
        if (!isoString) return "—";
        const parsed = new Date(isoString);
        return Number.isNaN(parsed.getTime())
          ? "—"
          : parsed.toLocaleDateString(language === "de" ? "de-DE" : "en-US");
      },
      [language]
    );

    const formatCurrency = useCallback(
        (value:any) => (typeof value === "number" ? currencyFormatter.format(value) : "—"),
        [currencyFormatter]
      );
console.log("localeText: ", localeText);

  return { localeText,language,formatDate,formatCurrency };
}