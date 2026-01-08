
import {  useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
export function useGetTariffsChanges() {

const { tariffsCountryCodes, tariffsCountryIndex, tariffsData } =
  useAppSelector((state) => state.tariffs);

const countryCode = tariffsCountryCodes?.[tariffsCountryIndex];

const { TariffType = "",ZipCodes=[],Weights={} } =
  tariffsData?.rates?.[countryCode] ?? {};

  const weightsKeys = useMemo(
  () => Object.keys(Weights),
  [Weights]
);

  return { TariffType,ZipCodes,Weights,weightsKeys,tariffsData,countryCode };
}