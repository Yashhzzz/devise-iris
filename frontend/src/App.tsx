import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import Login from "@/pages/Login";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { BentoRow } from "@/components/dashboard/BentoRow";
import { UsageTrendChart } from "@/components/dashboard/UsageTrendChart";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { SubscriptionList } from "@/components/dashboard/SubscriptionList";
import { RecentDetectionsTable } from "@/components/dashboard/RecentDetectionsTable";
import { LiveFeedTab } from "@/components/dashboard/LiveFeedTab";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { DevicesTab } from "@/components/dashboard/DevicesTab";
import { AlertsTab } from "@/components/dashboard/AlertsTab";
import { SubscriptionsTab } from "@/components/dashboard/SubscriptionsTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";
import { TeamTab } from "@/components/dashboard/TeamTab";

type Tab = "overview" | "live-feed" | "analytics" | "devices" | "alerts" | "subscriptions" | "settings" | "team";

const queryClient = new QueryClient();

function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div
        key={activeTab}
        className="animate-in fade-in duration-300 fill-mode-both"
      >
        {activeTab === "overview" && (
          <div className="flex flex-col gap-4">
            <KpiCards onNavigate={setActiveTab as (tab: string) => void} />
            <div className="flex gap-4">
              <BentoRow onNavigate={setActiveTab as (tab: string) => void} />
              <UsageTrendChart />
            </div>
            <div className="flex gap-4" style={{ alignItems: "stretch" }}>
              <div className="flex flex-col gap-4" style={{ flex: "0 0 auto", width: 424 }}>
                <BudgetProgress />
                <SubscriptionList onNavigate={setActiveTab as (tab: string) => void} />
              </div>
              <RecentDetectionsTable />
            </div>
          </div>
        )}
        {activeTab === "live-feed"  && <LiveFeedTab />}
        {activeTab === "analytics"  && <AnalyticsTab />}
        {activeTab === "devices"    && <DevicesTab />}
        {activeTab === "team"       && <TeamTab />}
        {activeTab === "alerts"     && <AlertsTab />}
        {activeTab === "subscriptions" && <SubscriptionsTab />}
        {activeTab === "settings"   && <SettingsTab />}
      </div>
    </DashboardLayout>
  );
}

function AuthGate() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F0F2F5",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "#FF5C1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 1.5s infinite",
          }}
        >
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 22 }}>D</span>
        </div>
      </div>
    );
  }

  return session ? <Dashboard /> : <Login />;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AuthGate />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;




