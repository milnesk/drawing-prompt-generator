import { ReactNode } from "react";

interface RoughBorderProps {
  children: ReactNode;
  className?: string;
  strokeWidth?: number;
  radius?: number;
  doubled?: boolean;
  /** Fill color for the border shape (e.g. "hsl(var(--ink) / 0.1)") */
  fill?: string;
}

export const RoughBorder = ({
  children,
  className = "",
  strokeWidth = 2,
  radius = 8,
  doubled = false,
  fill = "none",
}: RoughBorderProps) => {
  const filterId = `rough-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="2.5" />
          </filter>
        </defs>
        <rect
          x={strokeWidth}
          y={strokeWidth}
          width={`calc(100% - ${strokeWidth * 2}px)`}
          height={`calc(100% - ${strokeWidth * 2}px)`}
          rx={radius}
          ry={radius}
          fill={fill}
          stroke="hsl(var(--ink))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={`url(#${filterId})`}
        />
        {doubled && (
          <rect
            x={strokeWidth + 3}
            y={strokeWidth + 3}
            width={`calc(100% - ${(strokeWidth + 3) * 2}px)`}
            height={`calc(100% - ${(strokeWidth + 3) * 2}px)`}
            rx={Math.max(radius - 2, 2)}
            ry={Math.max(radius - 2, 2)}
            fill="none"
            stroke="hsl(var(--ink))"
            strokeWidth={strokeWidth * 0.7}
            strokeLinecap="round"
            opacity={0.55}
            filter={`url(#${filterId})`}
          />
        )}
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
};

export default RoughBorder;
