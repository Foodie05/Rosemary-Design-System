export function PrecisionGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 450"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="precision-grid"
          width="25"
          height="25"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M25 0H0V25"
            stroke="currentColor"
            strokeOpacity=".09"
            strokeWidth=".6"
          />
        </pattern>
        <clipPath id="leaf-clip">
          <path d="M150 342C78 256 120 128 308 74C377 161 355 296 150 342Z" />
        </clipPath>
      </defs>
      <rect
        x="40"
        y="25"
        width="420"
        height="375"
        fill="url(#precision-grid)"
      />
      <path
        d="M150 342C78 256 120 128 308 74C377 161 355 296 150 342Z"
        fill="var(--r-semantic-color-accent-subtle)"
      />
      <g
        clipPath="url(#leaf-clip)"
        stroke="var(--r-semantic-color-accent)"
        strokeWidth="1.2"
      >
        {Array.from({ length: 15 }, (_, i) => (
          <path
            key={i}
            d={`M${52 + i * 11} ${390 - i * 6}C${97 + i * 8} ${265 - i * 7} ${225 + i * 6} ${211 - i * 9} ${343 + i * 7} ${-28 + i * 9}`}
            opacity={0.25 + i * 0.035}
          />
        ))}
      </g>
      <path
        d="M150 342C78 256 120 128 308 74C377 161 355 296 150 342Z"
        stroke="var(--r-semantic-color-accent)"
        strokeWidth="1.5"
      />
      <path
        d="M144 350L315 68"
        stroke="var(--r-semantic-color-accent)"
        strokeWidth="1.5"
      />
      <path
        d="M75 342H390M308 40V380M150 40V380"
        stroke="currentColor"
        strokeOpacity=".18"
        strokeDasharray="3 5"
      />
      <circle
        cx="150"
        cy="342"
        r="5"
        fill="var(--r-semantic-color-canvas)"
        stroke="var(--r-semantic-color-accent)"
      />
      <circle
        cx="308"
        cy="74"
        r="5"
        fill="var(--r-semantic-color-canvas)"
        stroke="var(--r-semantic-color-accent)"
      />
      <circle cx="308" cy="342" r="3" fill="currentColor" opacity=".4" />
      <path
        d="M150 371H308M150 366V376M308 366V376"
        stroke="currentColor"
        strokeOpacity=".4"
      />
      <g fill="currentColor" opacity=".65" fontFamily="monospace" fontSize="10">
        <text x="60" y="52">
          FIG. 01 · ORGANIC PRECISION
        </text>
        <text x="325" y="70">
          P₁ (308, 74)
        </text>
        <text x="66" y="355">
          P₀
        </text>
        <text x="220" y="388">
          1 : 1.618
        </text>
        <text x="352" y="300">
          NATURE
        </text>
        <text x="352" y="315">
          × ORDER
        </text>
        <text x="60" y="421">
          A SHARED LANGUAGE. A NATURAL EXPERIENCE.
        </text>
      </g>
    </svg>
  );
}
