"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfileContext } from "@/context/user-profile-context";


export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseToken, loading } = useUserProfileContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseToken) {
      router.replace("/login");
    }
  }, [firebaseToken, loading]);

  if (loading) return null;

  return <>{children}</>;
}
