"use client";

import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function MovingBorder({
  children,
  duration = 2000,
  rx = "20px",
  className,
  containerClassName,
  borderClassName,
  as: Component = "button",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: any;
  [key: string]: any;
}) {
  const pathRef = useRef<any>();
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMs = length / duration;
      progress.set((time * pxPerMs) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <Component
      className={cn(
        "relative inline-flex items-center justify-center rounded-md",
        containerClassName
      )}
      {...otherProps}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-md bg-gradient-to-r from-primary-red/50 to-primary-red/50 transition-all duration-300",
          borderClassName
        )}
      />
      <div
        className={cn(
          "relative bg-off-white text-gray-800 rounded-md px-6 py-3 text-lg font-medium tracking-wider",
          className
        )}
      >
        {children}
      </div>

      <div className="pointer-events-none absolute inset-0">
        <svg
          className="absolute h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            ref={pathRef}
            rx={rx}
            strokeWidth="2"
            className="h-full w-full"
            pathLength="1"
            stroke="transparent"
            fill="none"
          />
        </svg>

        <motion.div
          style={{ transform }}
          className="absolute left-0 top-0 h-4 w-4 rounded-full bg-primary-red"
        />
      </div>
    </Component>
  );
}
