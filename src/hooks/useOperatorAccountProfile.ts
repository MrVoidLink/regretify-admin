"use client";

import { useEffect, useState } from "react";
import type { AdminProfile } from "@/types/admin";
import {
  loadOperatorAccountProfile,
  OPERATOR_PROFILE_UPDATED_EVENT,
  type OperatorAccountProfile,
} from "@/lib/operator-profile";

export function useOperatorAccountProfile(admin: AdminProfile | null) {
  const [profile, setProfile] = useState<OperatorAccountProfile>(() =>
    loadOperatorAccountProfile(admin),
  );

  useEffect(() => {
    function syncProfile() {
      setProfile(loadOperatorAccountProfile(admin));
    }

    syncProfile();

    window.addEventListener(OPERATOR_PROFILE_UPDATED_EVENT, syncProfile);
    window.addEventListener("storage", syncProfile);

    return () => {
      window.removeEventListener(OPERATOR_PROFILE_UPDATED_EVENT, syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, [admin]);

  return [profile, setProfile] as const;
}
