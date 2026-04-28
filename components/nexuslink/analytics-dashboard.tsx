"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Truck,
  AlertTriangle,
  Clock,
  Fuel,
  DollarSign,
  Package,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface KpiCard {
  label: string
  value: string
  target: string
  progress: number
  trend: "up" | "down"
  trendValue: string
  icon: React.ReactNode
}

const shipmentTrendData = [
  { month: "Jan", shipments: 180, onTime: 165, delayed: 15 },
  { month: "Feb", shipments: 195, onTime: 180, delayed: 15 },
  { month: "Mar", shipments: 210, onTime: 198, delayed: 12 },
  { month: "Apr", shipments: 225, onTime: 215, delayed: 10 },
  { month: "May", shipments: 240, onTime: 232, delayed: 8 },
  { month: "Jun", shipments: 255, onTime: 248, delayed: 7 },
]

const riskDistributionData = [
  { category: "Weather", current: 12, previous: 18 },
  { category: "Port Delay", current: 8, previous: 15 },
  { category: "Traffic", current: 15, previous: 22 },
  { category: "Mechanical", current: 5, previous: 8 },
  { category: "Customs", current: 10, previous: 14 },
]

const efficiencyData = [
  { name: "Fuel Saved", value: 35, color: "#4ade80" },
  { name: "Time Saved", value: 28, color: "#38bdf8" },
  { name: "Cost Reduced", value: 22, color: "#facc15" },
  { name: "Emissions Cut", value: 15, color: "#a78bfa" },
]

const realtimeMetrics = [
  { time: "12:00", value: 85 },
  { time: "12:15", value: 88 },
  { time: "12:30", value: 82 },
  { time: "12:45", value: 90 },
  { time: "13:00", value: 87 },
  { time: "13:15", value: 92 },
  { time: "13:30", value: 89 },
  { time: "13:45", value: 94 },
  { time: "14:00", value: 91 },
  { time: "14:15", value: 96 },
]

export function AnalyticsDashboard() {
  const [kpis, setKpis] = useState<KpiCard[]>([
    {
      label: "Delay Reduction",
      value: "32%",
      target: "30%",
      progress: 107,
      trend: "up",
      trendValue: "+5.2%",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: "On-Time Delivery",
      value: "94.8%",
      target: "95%",
      progress: 99.8,
      trend: "up",
      trendValue: "+2.1%",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      label: "Fuel Efficiency",
      value: "94.2%",
      target: "90%",
      progress: 105,
      trend: "up",
      trendValue: "+3.8%",
      icon: <Fuel className="h-5 w-5" />,
    },
    {
      label: "Cost Savings",
      value: "$2.4M",
      target: "$2M",
      progress: 120,
      trend: "up",
      trendValue: "+18%",
      icon: <DollarSign className="h-5 w-5" />,
    },
  ])

  const [activeShipments, setActiveShipments] = useState(247)
  const [riskScore, setRiskScore] = useState(18)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShipments((prev) => prev + Math.floor(Math.random() * 5) - 2)
      setRiskScore((prev) => Math.max(10, Math.min(30, prev + Math.floor(Math.random() * 5) - 2)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-primary">{kpi.icon}</span>
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  kpi.trend === "up"
                    ? "bg-primary/20 text-primary"
                    : "bg-destructive/20 text-destructive"
                }`}
              >
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {kpi.trendValue}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="mb-2 text-sm text-muted-foreground">{kpi.label}</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full transition-all ${
                    kpi.progress >= 100 ? "bg-primary" : "bg-warning"
                  }`}
                  style={{ width: `${Math.min(100, kpi.progress)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                <Target className="mr-1 inline h-3 w-3" />
                {kpi.target}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Shipment Trends */}
        <div className="glass-card rounded-xl p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Shipment Trends</h3>
            <p className="text-sm text-muted-foreground">Monthly shipment volume and performance</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={shipmentTrendData}>
                <defs>
                  <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="shipments"
                  stroke="#4ade80"
                  fillOpacity={1}
                  fill="url(#colorShipments)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="onTime"
                  stroke="#38bdf8"
                  fillOpacity={1}
                  fill="url(#colorOnTime)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Total Shipments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accent" />
              <span className="text-xs text-muted-foreground">On-Time</span>
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="glass-card rounded-xl p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Risk Distribution</h3>
            <p className="text-sm text-muted-foreground">Disruption categories comparison</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#666" fontSize={12} />
                <YAxis dataKey="category" type="category" stroke="#666" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="previous" fill="#f87171" opacity={0.5} name="Previous" radius={[0, 4, 4, 0]} />
                <Bar dataKey="current" fill="#4ade80" name="Current" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-destructive opacity-50" />
              <span className="text-xs text-muted-foreground">Previous Period</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Current Period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Real-time System Health */}
        <div className="glass-card rounded-xl p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">System Health</h3>
              <p className="text-sm text-muted-foreground">Real-time performance</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-xs text-primary">Live</span>
            </div>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={realtimeMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} domain={[70, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#4ade80" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Efficiency Impact */}
        <div className="glass-card rounded-xl p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">AI Efficiency Impact</h3>
            <p className="text-sm text-muted-foreground">Optimization breakdown</p>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {efficiencyData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <span className="ml-auto text-xs font-medium text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card rounded-xl p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Stats</h3>
            <p className="text-sm text-muted-foreground">Key metrics at a glance</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground">Active Shipments</span>
              </div>
              <span className="text-lg font-bold text-primary">{activeShipments}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span className="text-sm text-foreground">Risk Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-warning">{riskScore}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground">AI Optimizations</span>
              </div>
              <span className="text-lg font-bold text-primary">1,247</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground">Uptime</span>
              </div>
              <span className="text-lg font-bold text-primary">99.97%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
