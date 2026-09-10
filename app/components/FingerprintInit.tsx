"use client";
import { useEffect } from "react";

export default function FingerprintInit() {
  useEffect(() => {
    if (document.cookie.includes("_fp=")) return;
    import("@fingerprintjs/fingerprintjs").then((FingerprintJS) => {
      FingerprintJS.load().then((fp) =>
        fp.get().then(({ visitorId }) => {
          document.cookie = `_fp=${visitorId};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
        })
      );
    });
  }, []);

  return null;
}
