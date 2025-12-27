"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { useRef } from "react";
import type { AppStore } from "@/store/store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (storeRef.current === null) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
