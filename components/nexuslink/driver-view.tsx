"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Navigation,
  Clock,
  Fuel,
  AlertCircle,
  CheckCircle2,
  Mic,
  MicOff,
  Phone,
  MessageSquare,
  ChevronRight,
  Zap,
  MapPin,
  RotateCcw,
} from "lucide-react"

interface Driver {
  id: string
  name: string
  vehicle: string
  status: "active" | "resting" | "delayed"
  currentLocation: string
  destination: string
  eta: string
  fuelLevel: number
  routeOptimized: boolean
  timeSaved?: string
}

const drivers: Driver[] = [
  {
    id: "DRV-001",
    name: "John Martinez",
    vehicle: "Truck #T-4521",
    status: "active",
    currentLocation: "Highway I-95, Mile 234",
    destination: "Port of Newark",
    eta: "2h 15m",
    fuelLevel: 72,
    routeOptimized: true,
    timeSaved: "18 min",
  },
  {
    id: "DRV-002",
    name: "Sarah Chen",
    vehicle: "Truck #T-3892",
    status: "delayed",
    currentLocation: "Route 66, Arizona",
    destination: "Los Angeles Distribution",
    eta: "4h 30m",
    fuelLevel: 45,
    routeOptimized: false,
  },
  {
    id: "DRV-003",
    name: "Mike Johnson",
    vehicle: "Truck #T-2156",
    status: "active",
    currentLocation: "Interstate 10, Texas",
    destination: "Houston Terminal",
    eta: "1h 45m",
    fuelLevel: 88,
    routeOptimized: true,
    timeSaved: "12 min",
  },
  {
    id: "DRV-004",
    name: "Emma Wilson",
    vehicle: "Truck #T-5634",
    status: "resting",
    currentLocation: "Rest Stop, Denver",
    destination: "Chicago Hub",
    eta: "6h 20m",
    fuelLevel: 95,
    routeOptimized: true,
    timeSaved: "25 min",
  },
]

export function DriverView() {
  const [selectedDriver, setSelectedDriver] = useState<Driver>(drivers[0])
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [showOptimizationPopup, setShowOptimizationPopup] = useState(true)
  const [routeProgress, setRouteProgress] = useState(0.35)

  useEffect(() => {
    const interval = setInterval(() => {
      setRouteProgress((prev) => {
        const newProgress = prev + 0.01
        return newProgress > 1 ? 0 : newProgress
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive)
  }

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Driver List */}
      <div className="glass-card rounded-xl p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Active Drivers</h2>
          <p className="text-sm text-muted-foreground">{drivers.length} drivers on route</p>
        </div>

        <div className="space-y-3">
          {drivers.map((driver) => (
            <motion.button
              key={driver.id}
              onClick={() => setSelectedDriver(driver)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full rounded-lg border p-4 text-left transition-all ${
                selectedDriver.id === driver.id
                  ? "border-primary bg-primary/10 glow-green"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{driver.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    driver.status === "active"
                      ? "bg-primary/20 text-primary"
                      : driver.status === "delayed"
                      ? "bg-destructive/20 text-destructive"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {driver.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{driver.vehicle}</p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">ETA: {driver.eta}</span>
                {driver.routeOptimized && (
                  <span className="flex items-center gap-1 text-primary">
                    <Zap className="h-3 w-3" />
                    Optimized
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Navigation Simulation */}
      <div className="lg:col-span-2">
        <div className="glass-card h-full rounded-xl p-4">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Navigation View</h2>
              <p className="text-sm text-muted-foreground">
                {selectedDriver.name} - {selectedDriver.vehicle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-primary/20 hover:text-primary">
                <Phone className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-primary/20 hover:text-primary">
                <MessageSquare className="h-5 w-5" />
              </button>
              <button
                onClick={toggleVoice}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                  isVoiceActive
                    ? "bg-primary text-primary-foreground glow-green"
                    : "bg-secondary text-muted-foreground hover:bg-primary/20 hover:text-primary"
                }`}
              >
                {isVoiceActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Map Simulation */}
          <div className="relative h-[350px] overflow-hidden rounded-lg bg-background/50">
            {/* Grid background */}
            <div className="absolute inset-0 grid-pattern opacity-30" />

            {/* SVG Map */}
            <svg viewBox="0 0 100 60" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
              {/* Old route (dashed red) */}
              <path
                d="M 15,45 Q 25,50 35,42 Q 45,35 55,38 Q 65,42 75,35 L 85,28"
                fill="none"
                stroke="#f87171"
                strokeWidth="0.8"
                strokeDasharray="2 2"
                opacity="0.5"
              />
              <text x="50" y="52" fill="#f87171" fontSize="2.5" opacity="0.7">
                Old Route: +18 min
              </text>

              {/* New optimized route (glowing green) */}
              <path
                d="M 15,45 Q 28,38 40,35 Q 55,30 70,28 L 85,28"
                fill="none"
                stroke="#4ade80"
                strokeWidth="1"
                filter="url(#glow)"
                className="route-animated"
              />

              {/* Glow filter */}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Start point */}
              <circle cx="15" cy="45" r="2" fill="#4ade80" />
              <text x="15" y="50" fill="#4ade80" fontSize="2" textAnchor="middle">
                Start
              </text>

              {/* Current position */}
              <motion.g
                animate={{ x: routeProgress * 70, y: -routeProgress * 17 }}
                transition={{ duration: 0.5 }}
              >
                <circle cx="15" cy="45" r="2.5" fill="#4ade80">
                  <animate
                    attributeName="r"
                    values="2;3;2"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="15" cy="45" r="4" fill="none" stroke="#4ade80" strokeWidth="0.3" opacity="0.5">
                  <animate
                    attributeName="r"
                    values="3;5;3"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.5;0;0.5"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </motion.g>

              {/* End point */}
              <circle cx="85" cy="28" r="2" fill="#4ade80" opacity="0.5" />
              <text x="85" y="24" fill="#4ade80" fontSize="2" textAnchor="middle">
                {selectedDriver.destination.split(" ")[0]}
              </text>

              {/* Waypoints */}
              <circle cx="40" cy="35" r="1" fill="#38bdf8" />
              <circle cx="70" cy="28" r="1" fill="#38bdf8" />
            </svg>

            {/* Optimization Popup */}
            <AnimatePresence>
              {showOptimizationPopup && selectedDriver.routeOptimized && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  className="absolute left-1/2 top-4 -translate-x-1/2 rounded-lg border border-primary bg-card p-4 shadow-xl glow-green"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Route Optimized by AI</p>
                      <p className="text-xs text-primary">
                        Saving {selectedDriver.timeSaved || "15 min"} on this route
                      </p>
                    </div>
                    <button
                      onClick={() => setShowOptimizationPopup(false)}
                      className="ml-4 text-muted-foreground hover:text-foreground"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{selectedDriver.currentLocation}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">ETA: {selectedDriver.eta}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{selectedDriver.fuelLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Route Info Cards */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="mb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Current Location</span>
              </div>
              <p className="text-sm font-medium text-foreground">{selectedDriver.currentLocation}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="mb-1 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Destination</span>
              </div>
              <p className="text-sm font-medium text-foreground">{selectedDriver.destination}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="mb-1 flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Route Status</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedDriver.routeOptimized ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Optimized</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-warning">Needs Review</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
