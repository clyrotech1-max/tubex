"use client";
import { useEffect, useState } from "react";

export default function AgeGate() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("age_verified")) setShow(true);
    } catch { setShow(true); }
  }, []);
  if (!show) return null;
  return (
    <div className="age">
      <div className="age-box">
        <h1>18+ ONLY</h1>
        <p style={{ color: "#9a9aa8", lineHeight: 1.7 }}>
          This site is for adults only. You must be 18 or older, or the age of
          majority in your country, to enter. All content must be from verified
          adult performers only.
        </p>
        <button className="btn" onClick={() => { try { localStorage.setItem("age_verified", "1"); } catch {} setShow(false); }}>
          I am 18 or older — Enter
        </button>
        <p style={{ fontSize: 12, color: "#666", marginTop: 14 }}>If you are under 18, please leave this site.</p>
      </div>
    </div>
  );
}
