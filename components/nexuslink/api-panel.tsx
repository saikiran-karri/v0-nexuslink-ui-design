"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Cloud,
  Zap,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Terminal,
  Activity,
  Database,
  Radio,
} from "lucide-react"

interface ApiLog {
  id: number
  timestamp: string
  type: "request" | "response" | "event"
  status: "success" | "processing" | "error"
  endpoint: string
  duration?: string
}

interface ReasoningStep {
  id: number
  step: string
  description: string
  status: "completed" | "processing" | "pending"
  data?: string
}

export function ApiPanel() {
  const [selectedTab, setSelectedTab] = useState<"live" | "logs">("live")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const [apiLogs, setApiLogs] = useState<ApiLog[]>([
    { id: 1, timestamp: "14:32:15", type: "request", status: "success", endpoint: "/api/routes/optimize", duration: "124ms" },
    { id: 2, timestamp: "14:32:14", type: "event", status: "success", endpoint: "weather.disruption.detected", duration: "12ms" },
    { id: 3, timestamp: "14:32:10", type: "response", status: "success", endpoint: "/api/shipments/SH-2847", duration: "89ms" },
    { id: 4, timestamp: "14:32:05", type: "request", status: "processing", endpoint: "/api/ai/analyze", duration: "..." },
  ])

  const [jsonResponse, setJsonResponse] = useState(`{
  "status": "REROUTE_EXECUTED",
  "shipment_id": "SH-2847",
  "reasoning": {
    "trigger": "weather_disruption",
    "confidence": 0.94,
    "alternatives_evaluated": 3
  },
  "route": {
    "original_eta": "2024-04-15T14:00:00Z",
    "new_eta": "2024-04-15T12:45:00Z",
    "time_saved_minutes": 75,
    "distance_km": 1847
  },
  "actions": [
    "notified_driver",
    "updated_manifest",
    "alerted_destination"
  ]
}`)

  const reasoningSteps: ReasoningStep[] = [
    {
      id: 1,
      step: "Data Ingestion",
      description: "Collecting real-time data from IoT sensors, weather APIs, and traffic systems",
      status: currentStep > 0 ? "completed" : "processing",
      data: "Sources: 12 IoT devices, 3 weather APIs, traffic feed",
    },
    {
      id: 2,
      step: "Disruption Detection",
      description: "AI analyzing patterns to identify potential disruptions",
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "processing" : "pending",
      data: "Detected: Typhoon forming in Pacific, ETA 48 hours",
    },
    {
      id: 3,
      step: "Impact Analysis",
      description: "Calculating delay predictions and affected shipments",
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "processing" : "pending",
      data: "Predicted delay: 4.5 hours, Affected: 3 shipments",
    },
    {
      id: 4,
      step: "Route Generation",
      description: "Generating and evaluating alternative routes",
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "processing" : "pending",
      data: "Generated 5 alternatives, evaluating cost/time tradeoffs",
    },
    {
      id: 5,
      step: "Optimization",
      description: "Selecting optimal route based on constraints",
      status: currentStep > 4 ? "completed" : currentStep === 4 ? "processing" : "pending",
      data: "Selected Route B: -75 min, +$120 fuel cost",
    },
    {
      id: 6,
      step: "Execution",
      description: "Deploying changes to drivers and systems",
      status: currentStep >= 5 ? "completed" : "pending",
      data: "Driver notified, ETA updated, manifest synced",
    },
  ]

  // Auto-advance reasoning steps
  useEffect(() => {
    if (isProcessing && currentStep < 6) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (currentStep >= 6) {
      setIsProcessing(false)
    }
  }, [isProcessing, currentStep])

  // Simulate new API logs
  useEffect(() => {
    const interval = setInterval(() => {
      const endpoints = [
        "/api/routes/optimize",
        "/api/shipments/status",
        "/api/ai/predict",
        "/api/drivers/location",
        "/api/weather/check",
      ]
      const newLog: ApiLog = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        type: Math.random() > 0.3 ? "request" : "event",
        status: Math.random() > 0.1 ? "success" : "processing",
        endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
        duration: `${Math.floor(Math.random() * 200)}ms`,
      }
      setApiLogs((prev) => [newLog, ...prev.slice(0, 9)])
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleTriggerAnalysis = () => {
    setIsProcessing(true)
    setCurrentStep(0)
  }

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Panel - JSON Response */}
      <div className="glass-card rounded-xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">API Response</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerAnalysis}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isProcessing ? "animate-spin" : ""}`} />
              {isProcessing ? "Processing..." : "Trigger Analysis"}
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setSelectedTab("live")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedTab === "live"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Live Response
          </button>
          <button
            onClick={() => setSelectedTab("logs")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedTab === "logs"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            API Logs
          </button>
        </div>

        <AnimatePresence mode="wait">
          {selectedTab === "live" ? (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-[400px] overflow-auto rounded-lg bg-background/50 p-4 font-mono text-sm"
            >
              <pre className="text-primary">
                <code>{jsonResponse}</code>
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-[400px] space-y-2 overflow-auto"
            >
              {apiLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3"
                >
                  <span className="font-mono text-xs text-muted-foreground">{log.timestamp}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                      log.type === "request"
                        ? "bg-accent/20 text-accent"
                        : log.type === "event"
                        ? "bg-warning/20 text-warning"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {log.type.toUpperCase()}
                  </span>
                  <span className="flex-1 font-mono text-sm text-foreground">{log.endpoint}</span>
                  <span
                    className={`flex items-center gap-1 text-xs ${
                      log.status === "success"
                        ? "text-primary"
                        : log.status === "processing"
                        ? "text-warning"
                        : "text-destructive"
                    }`}
                  >
                    {log.status === "processing" ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {log.duration}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection status */}
        <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">WebSocket Connection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs text-primary">Connected</span>
          </div>
        </div>
      </div>

      {/* Right Panel - AI Reasoning */}
      <div className="glass-card rounded-xl p-4">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">AI Reasoning Engine</h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Gemini-powered decision pipeline for route optimization
        </p>

        {/* Data flow visualization */}
        <div className="mb-6 flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Cloud className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Data Sources</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">AI Analysis</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Optimization</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Execution</span>
          </div>
        </div>

        {/* Reasoning steps */}
        <div className="space-y-3">
          {reasoningSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg border p-3 transition-all ${
                step.status === "completed"
                  ? "border-primary/50 bg-primary/10"
                  : step.status === "processing"
                  ? "border-accent/50 bg-accent/10 glow-blue"
                  : "border-border bg-card"
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {step.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : step.status === "processing" ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-accent" />
                  ) : (
                    <Database className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">{step.step}</span>
                </div>
                <span
                  className={`text-xs ${
                    step.status === "completed"
                      ? "text-primary"
                      : step.status === "processing"
                      ? "text-accent"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.status === "completed"
                    ? "Complete"
                    : step.status === "processing"
                    ? "Processing..."
                    : "Pending"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{step.description}</p>
              {step.data && step.status !== "pending" && (
                <p className="mt-2 rounded bg-background/50 px-2 py-1 font-mono text-xs text-primary">
                  {step.data}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
