"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [displayed, setDisplayed] = useState(children);
  const [stage, setStage] = useState("in");

  useEffect(() => {
    setStage("out");

    const t1 = setTimeout(() => {
      setDisplayed(children);
      setStage("in");
    }, 300);

    return () => clearTimeout(t1);
  }, [pathname]);

  useEffect(() => {
    if (stage === "in") setDisplayed(children);
  }, [children]);

  const styles = {
    out: { opacity: 0, transform: "translateX(-30px)" },
    in:  { opacity: 1, transform: "translateX(0px)" },
  };

  return (
    <div
      style={{
        ...styles[stage],
        transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "opacity, transform",
      }}
    >
      {displayed}
    </div>
  );
}