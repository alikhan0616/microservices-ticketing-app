"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SignOutPage() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const signOut = async () => {
      try {
        await axios.post("/api/users/signout", {});
      } catch (error) {
        console.error("Sign out failed:", error);
        setFailed(true);
        return;
      }
      // Hard navigation so the server layout re-runs with the cleared
      // cookie and the header reflects the logged-out state.
      window.location.href = "/";
    };

    signOut();
  }, []);

  return (
    <div className="state mt-6" style={{ maxWidth: 420, margin: "40px auto 0" }}>
      <span className="state__icon">{failed ? "⚠️" : "👋"}</span>
      {failed ? (
        <>
          <p style={{ fontWeight: 600, color: "var(--ink)" }}>
            Couldn&apos;t sign you out
          </p>
          <p>Please try again in a moment.</p>
        </>
      ) : (
        <>
          <p style={{ fontWeight: 600, color: "var(--ink)" }}>
            Signing you out…
          </p>
          <p>You&apos;ll be redirected home in a moment.</p>
        </>
      )}
    </div>
  );
}
