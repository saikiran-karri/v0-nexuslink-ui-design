"use client"

import { useState } from "react"
import { Sidebar } from "@/components/nexuslink/sidebar"
import { TopNav } from "@/components/nexuslink/top-nav"
import { CommandCenter } from "@/components/nexuslink/command-center"
import { DriverView } from "@/components/nexuslink/driver-view"
import { ApiPanel } from "@/components/nexuslink/api-panel"
import { AnalyticsDashboard } from "@/components/nexuslink/analytics-dashboard"

export type ViewType = "dashboard" | "drivers" | "api" | "analytics"

export default function NexusLinkPage() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden grid-pattern">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto p-6">
          {activeView === "dashboard" && <CommandCenter />}
          {activeView === "drivers" && <DriverView />}
          {activeView === "api" && <ApiPanel />}
          {activeView === "analytics" && <AnalyticsDashboard />}
        </main>
      </div>
    </div>
  )
}
