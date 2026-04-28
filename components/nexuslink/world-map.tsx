"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Shipment {
  id: string
  from: { x: number; y: number; name: string }
  to: { x: number; y: number; name: string }
  status: "active" | "risk" | "delayed"
  eta: string
  cargo: string
  progress: number
}

const shipments: Shipment[] = [
  {
    id: "SH-2847",
    from: { x: 85, y: 35, name: "Shanghai" },
    to: { x: 48, y: 30, name: "Rotterdam" },
    status: "active",
    eta: "Apr 15, 2026",
    cargo: "Electronics",
    progress: 0.6,
  },
  {
    id: "SH-1923",
    from: { x: 78, y: 55, name: "Singapore" },
    to: { x: 15, y: 40, name: "Los Angeles" },
    status: "risk",
    eta: "Apr 18, 2026",
    cargo: "Auto Parts",
    progress: 0.3,
  },
  {
    id: "SH-3421",
    from: { x: 52, y: 28, name: "Hamburg" },
    to: { x: 20, y: 35, name: "New York" },
    status: "active",
    eta: "Apr 12, 2026",
    cargo: "Machinery",
    progress: 0.8,
  },
  {
    id: "SH-4567",
    from: { x: 68, y: 60, name: "Mumbai" },
    to: { x: 92, y: 65, name: "Sydney" },
    status: "delayed",
    eta: "Apr 20, 2026",
    cargo: "Textiles",
    progress: 0.4,
  },
  {
    id: "SH-5892",
    from: { x: 140, y: 35, name: "Tokyo" },
    to: { x: 78, y: 55, name: "Singapore" },
    status: "active",
    eta: "Apr 14, 2026",
    cargo: "Semiconductors",
    progress: 0.5,
  },
]

// Simplified world map continents as SVG paths
const continents = [
  // North America
  "M 5,25 Q 10,20 20,22 L 25,28 Q 28,35 25,42 L 20,45 Q 15,48 10,45 L 5,35 Z",
  // South America
  "M 18,55 Q 22,50 28,52 L 30,60 Q 28,70 25,75 L 20,72 Q 16,65 18,55 Z",
  // Europe
  "M 45,22 Q 52,18 58,22 L 55,32 Q 50,35 45,30 Z",
  // Africa
  "M 45,40 Q 52,35 58,40 L 60,55 Q 55,65 50,62 L 45,55 Z",
  // Asia
  "M 60,18 Q 75,15 90,20 L 95,35 Q 90,45 80,50 L 70,48 Q 62,40 60,30 Z",
  // Australia
  "M 85,58 Q 92,55 98,60 L 95,68 Q 88,72 85,65 Z",
]

export function WorldMap() {
  const [hoveredShipment, setHoveredShipment] = useState<Shipment | null>(null)
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    // Initialize progress
    const initial: Record<string, number> = {}
    shipments.forEach((s) => {
      initial[s.id] = s.progress
    })
    setAnimatedProgress(initial)

    // Animate progress slightly
    const interval = setInterval(() => {
      setAnimatedProgress((prev) => {
        const next: Record<string, number> = {}
        Object.keys(prev).forEach((id) => {
          const delta = (Math.random() - 0.5) * 0.02
          next[id] = Math.max(0.1, Math.min(0.95, prev[id] + delta))
        })
        return next
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getRouteColor = (status: Shipment["status"]) => {
    switch (status) {
      case "active":
        return "#4ade80"
      case "risk":
        return "#f87171"
      case "delayed":
        return "#facc15"
    }
  }

  const getPointOnRoute = (shipment: Shipment, progress: number) => {
    const x = shipment.from.x + (shipment.to.x - shipment.from.x) * progress
    const y = shipment.from.y + (shipment.to.y - shipment.from.y) * progress
    return { x, y }
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-background/50">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <svg viewBox="0 0 100 80" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* Glow filters */}
        <defs>
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="route-gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#4ade80" stopOpacity="1" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Continents */}
        {continents.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="rgba(255, 255, 255, 0.08)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.2"
          />
        ))}

        {/* Routes */}
        {shipments.map((shipment) => {
          const progress = animatedProgress[shipment.id] || shipment.progress
          const shipPosition = getPointOnRoute(shipment, progress)
          const color = getRouteColor(shipment.status)

          // Calculate control point for curved line
          const midX = (shipment.from.x + shipment.to.x) / 2
          const midY = (shipment.from.y + shipment.to.y) / 2 - 10

          return (
            <g key={shipment.id}>
              {/* Route line */}
              <path
                d={`M ${shipment.from.x} ${shipment.from.y} Q ${midX} ${midY} ${shipment.to.x} ${shipment.to.y}`}
                fill="none"
                stroke={color}
                strokeWidth="0.3"
                strokeOpacity="0.5"
                strokeDasharray="2 1"
                className="route-animated"
              />

              {/* Origin point */}
              <circle
                cx={shipment.from.x}
                cy={shipment.from.y}
                r="1"
                fill={color}
                filter={`url(#glow-${shipment.status === "active" ? "green" : "red"})`}
              />

              {/* Destination point */}
              <circle
                cx={shipment.to.x}
                cy={shipment.to.y}
                r="1"
                fill={color}
                opacity="0.5"
              />

              {/* Ship indicator */}
              <motion.g
                initial={false}
                animate={{ x: 0, y: 0 }}
                onMouseEnter={() => setHoveredShipment(shipment)}
                onMouseLeave={() => setHoveredShipment(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={shipPosition.x}
                  cy={shipPosition.y}
                  r="1.5"
                  fill={color}
                  filter={`url(#glow-${shipment.status === "active" ? "green" : "red"})`}
                />
                <circle
                  cx={shipPosition.x}
                  cy={shipPosition.y}
                  r="2.5"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.2"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    values="1.5;3;1.5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.5;0;0.5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </motion.g>
            </g>
          )
        })}
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredShipment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 rounded-lg border border-border bg-card p-4 shadow-xl glass-card"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  hoveredShipment.status === "active"
                    ? "bg-primary"
                    : hoveredShipment.status === "risk"
                    ? "bg-destructive"
                    : "bg-warning"
                }`}
              />
              <span className="text-sm font-semibold text-foreground">
                {hoveredShipment.id}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-xs font-medium uppercase ${
                  hoveredShipment.status === "active"
                    ? "bg-primary/20 text-primary"
                    : hoveredShipment.status === "risk"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-warning/20 text-warning"
                }`}
              >
                {hoveredShipment.status}
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">
                <span className="text-foreground">{hoveredShipment.from.name}</span>
                {" → "}
                <span className="text-foreground">{hoveredShipment.to.name}</span>
              </p>
              <p className="text-muted-foreground">
                Cargo: <span className="text-foreground">{hoveredShipment.cargo}</span>
              </p>
              <p className="text-muted-foreground">
                ETA: <span className="text-foreground">{hoveredShipment.eta}</span>
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground">
                    {Math.round((animatedProgress[hoveredShipment.id] || hoveredShipment.progress) * 100)}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all ${
                      hoveredShipment.status === "active"
                        ? "bg-primary"
                        : hoveredShipment.status === "risk"
                        ? "bg-destructive"
                        : "bg-warning"
                    }`}
                    style={{
                      width: `${(animatedProgress[hoveredShipment.id] || hoveredShipment.progress) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats overlay */}
      <div className="absolute right-4 top-4 space-y-2">
        <div className="rounded-lg border border-border bg-card/80 px-3 py-2 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground">Total Active</p>
          <p className="text-xl font-bold text-primary">247</p>
        </div>
        <div className="rounded-lg border border-border bg-card/80 px-3 py-2 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground">At Risk</p>
          <p className="text-xl font-bold text-destructive">6</p>
        </div>
      </div>
    </div>
  )
}
