import { useEffect, useRef, useState } from 'react';
import { DRIVERS, DriverData } from '../data/mockData';

export function useLiveData(driverId: string) {
  const [data, setData] = useState<DriverData>(
    DRIVERS.find((d) => d.id === driverId) ?? DRIVERS[0]
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const base = DRIVERS.find((d) => d.id === driverId) ?? DRIVERS[0];
    setData(base);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setData((prev) => ({
        ...prev,
        co2Emission: clamp(prev.co2Emission + rand(-0.05, 0.05), 0.5, 2.8),
        mguKPower: clamp(prev.mguKPower + rand(-2, 2), 10, 100),
        icePower: clamp(prev.icePower + rand(-2, 2), 10, 100),
        efficiency: clamp(prev.efficiency + rand(-0.3, 0.3), 80, 100),
      }));
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [driverId]);

  return data;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}
