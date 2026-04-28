"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Ship,
  Gauge,
  Fuel,
  Clock,
  ChevronRight,
} from "lucide-react"
import { WorldMap } from "./world-map"

interface Alert {
  id: number
  title: string
  impact: string
  recommendation: string
  severity: "high" | "medium" | "low"
}

interface Metric {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}

export function CommandCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      title: "Port Congestion in Singapore",
      impact: "4 shipments affected",
      recommendation: "Reroute to Port Klang",
      severity: "high",
    },
    {
      id: 2,
      title: "Typhoon Warning - Pacific Route",
      impact: "2 shipments at risk",
      recommendation: "Delay departure by 12 hours",
      severity: "high",
    },
    {
      id: 3,
      title: "Customs Delay - Rotterdam",
      impact: "1 shipment delayed",
      recommendation: "Prepare alternative documentation",
      severity: "medium",
    },
  ])

  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: "Delay Reduction",
      value: "32%",
      change: "+5%",
      trend: "up",
      icon: <TrendingDown className="h-5 w-5" />,
    },
    {
      label: "Active Shipments",
      value: "247",
      change: "+12",
      trend: "up",
      icon: <Ship className="h-5 w-5" />,
    },
    {
      label: "Risk Score",
      value: "Low",
      change: "-15%",
      trend: "down",
      icon: <Gauge className="h-5 w-5" />,
    },
    {
      label: "Fuel Efficiency",
      value: "94.2%",
      change: "+2.3%",
      trend: "up",
      icon: <Fuel className="h-5 w-5" />,
    },
  ])

  const [approvedAlerts, setApprovedAlerts] = useState<number[]>([])

  // Simulate metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value:
            m.label === "Active Shipments"
              ? String(247 + Math.floor(Math.random() * 10) - 5)
              : m.value,
        }))
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleApproveAll = () => {
    setApprovedAlerts(alerts.map((a) => a.id))
    setTimeout(() => {
      setAlerts([])
      setApprovedAlerts([])
    }, 1500)
  }

  const handleApproveOne = (id: number) => {
    setApprovedAlerts((prev) => [...prev, id])
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id))
      setApprovedAlerts((prev) => prev.filter((i) => i !== id))
    }, 1000)
  }

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Map Section */}
      <div className="lg:col-span-2">
        <div className="glass-card h-full rounded-xl p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Global Fleet Overview</h2>
              <p className="text-sm text-muted-foreground">Real-time shipment tracking</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-muted-foreground">Delayed</span>
              </div>
            </div>
          </div>
          <WorldMap />
        </div>
      </div>

      {/* Right Panel - Alerts */}
      <div className="flex flex-col gap-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-primary">{metric.icon}</span>
                <span
                  className={`text-xs font-medium ${
                    metric.trend === "up" ? "text-primary" : "text-destructive"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Gemini Risk Alerts */}
        <div className="glass-card flex-1 rounded-xl p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <AlertTriangle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Gemini Risk Alerts</h3>
                <p className="text-xs text-muted-foreground">AI-powered predictions</p>
              </div>
            </div>
            {alerts.length > 0 && (
              <button
                onClick={handleApproveAll}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Approve All
              </button>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  className={`rounded-lg border p-3 transition-all ${
                    approvedAlerts.includes(alert.id)
                      ? "border-primary bg-primary/10"
                      : alert.severity === "high"
                      ? "border-destructive/50 bg-destructive/10 pulse-alert"
                      : "border-warning/50 bg-warning/10"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {approvedAlerts.includes(alert.id) ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <AlertTriangle
                          className={`h-4 w-4 ${
                            alert.severity === "high" ? "text-destructive" : "text-warning"
                          }`}
                        />
                      )}
                      <span
                        className={`text-xs font-medium uppercase ${
                          approvedAlerts.includes(alert.id)
                            ? "text-primary"
                            : alert.severity === "high"
                            ? "text-destructive"
                            : "text-warning"
                        }`}
                      >
                        {approvedAlerts.includes(alert.id)
                          ? "Approved"
                          : `${alert.severity} Risk`}
                      </span>
                    </div>
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <h4 className="mb-1 text-sm font-medium text-foreground">{alert.title}</h4>
                  <p className="mb-2 text-xs text-muted-foreground">{alert.impact}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-primary">{alert.recommendation}</p>
                    {!approvedAlerts.includes(alert.id) && (
                      <button
                        onClick={() => handleApproveOne(alert.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        <span>Approve</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {alerts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                <p className="text-sm font-medium text-foreground">All Clear</p>
                <p className="text-xs text-muted-foreground">No active risk alerts</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
