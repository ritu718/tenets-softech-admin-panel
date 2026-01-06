
import {  useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
export function useGetSurchargesChange() {

const { surchargesCountryCodes, surchargesCountryIndex, surchargesData } =
  useAppSelector((state) => state.surcharges);

const countryCode = surchargesCountryCodes?.[surchargesCountryIndex];

const { Base=[] } =
  surchargesData?.extraCosts?.[countryCode] ?? {};

  

  return {Base  };
}