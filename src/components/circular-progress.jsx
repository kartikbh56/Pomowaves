/* eslint-disable react/prop-types */
export default function CircularProgress({
  progress,
  size = 200,
  strokeWidth = 20,
  children,
  className = "",
  color = "currentColor",
}) {
  const glowPadding = 16; // px
  const svgSize = size + glowPadding * 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="transform -rotate-90"
        style={{ filter: "drop-shadow(0 0 4px rgba(0, 0, 0, 0.1))" }}
      >
        {/* Background circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted-foreground/15"
        />
        {/* Progress circle with glow and pulse */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out animate-pulse-glow"
          style={{
            strokeDashoffset,
            filter: `drop-shadow(0 0 4px ${color})`,
          }}
        />
      </svg>
      {/* Content in the center */}
      <div className="absolute inset-0 flex items-center justify-center border-0 flex-row">
        {children}
      </div>
    </div>
  );
}
