import { Header } from "@/components/Header";
import { TimesheetDashboard } from "@/components/TimesheetDashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <TimesheetDashboard />
    </div>
  );
}
