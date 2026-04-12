"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { formatCountdown } from "@/lib/utils";

interface CountdownTimerProps {
  endDate: string; // ISO string
  compact?: boolean;
}

export function CountdownTimer({ endDate, compact = false }: CountdownTimerProps) {
  const t = useTranslations("offers");
  // null until mounted — prevents server/client time mismatch
  const [time, setTime] = useState<ReturnType<typeof formatCountdown> | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const remaining = new Date(endDate).getTime() - Date.now();
      if (remaining <= 0) {
        setExpired(true);
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTime(formatCountdown(remaining));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (expired) {
    return <span className="badge badge-out-of-stock">{t("expired")}</span>;
  }

  // Server render & first paint: render placeholder with same structure to avoid layout shift
  if (!time) {
    if (compact) {
      return <span className="text-xs font-bold text-destructive">-- d -- h -- m -- s</span>;
    }
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground font-medium me-1">{t("ends_in")}</span>
        {["j", "h", "m", "s"].map((label, i, arr) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center">
              <span className="min-w-[34px] h-9 flex items-center justify-center bg-foreground text-background text-sm font-bold rounded-lg tabular-nums">
                --
              </span>
              <span className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wider">{label}</span>
            </div>
            {i < arr.length - 1 && <span className="text-foreground font-bold text-sm mb-3">:</span>}
          </div>
        ))}
      </div>
    );
  }

  if (compact) {
    return (
      <span className="text-xs font-bold text-destructive">
        {String(time.days).padStart(2, "0")}d{" "}
        {String(time.hours).padStart(2, "0")}h{" "}
        {String(time.minutes).padStart(2, "0")}m{" "}
        {String(time.seconds).padStart(2, "0")}s
      </span>
    );
  }

  const units = [
    { value: time.days, label: "j" },
    { value: time.hours, label: "h" },
    { value: time.minutes, label: "m" },
    { value: time.seconds, label: "s" },
  ];

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground font-medium me-1">
        {t("ends_in")}
      </span>
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-1.5">
          <div className="flex flex-col items-center">
            <span className="min-w-[34px] h-9 flex items-center justify-center bg-foreground text-background text-sm font-bold rounded-lg tabular-nums">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wider">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-foreground font-bold text-sm mb-3">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
