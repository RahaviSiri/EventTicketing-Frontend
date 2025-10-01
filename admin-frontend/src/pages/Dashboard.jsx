import { useState, useEffect } from "react";
import axios from "axios";
import {
  DollarSign,
  Calendar,
  Users,
  Ticket,
  ChevronDown,
  UserCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "recharts";
import StatCard from "@/components/StatCard";

export default function Dashboard() {
  const [dateFilter, setDateFilter] = useState("Last 7 days");
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

   const rangeMap = {
     "Last 7 days": "last7days",
     "This Month": "thisMonth",
     "Last 3 Months": "last3months",
     "This Year": "thisYear",
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rangeParam = rangeMap[dateFilter] || "last7days";
        const token = localStorage.getItem("AdminToken");
        const res = await axios.get(
          `http://localhost:8080/api/admin/dashboard?range=${rangeParam}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchData();
  }, [dateFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-[1400px] mx-auto p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Welcome back, Admin
              </h1>
              <p className="mt-1 text-muted-foreground">
                Here's what's happening with your events today.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/users")}
              className="flex items-center gap-2"
            >
              <UserCog className="w-4 h-4" />
              <span>Manage Users</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/reports")}
              className="flex items-center space-x-2"
            >
              <span>Platform Reports</span>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {dateFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              {Object.keys(rangeMap).map((label) => (
                <DropdownMenuItem
                  key={label}
                  onClick={() => setDateFilter(label)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-8 flex flex-col gap-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$ ${dashboardData?.totalRevenue ?? 0}`}
            icon={DollarSign}
            trend={{
              value: dashboardData?.revenueTrend ?? 0,
              isPositive: (dashboardData?.revenueTrend ?? 0) >= 0,
            }}
          />
          <StatCard
            title="Active Events"
            value={dashboardData?.activeEvents ?? 0}
            icon={Calendar}
            trend={{
              value: dashboardData?.eventsTrend ?? 0,
              isPositive: (dashboardData?.eventsTrend ?? 0) >= 0,
            }}
          />
          <StatCard
            title="Total Organizers"
            value={dashboardData?.totalOrganizers ?? 0}
            icon={Users}
            trend={{
              value: dashboardData?.organizersTrend ?? 0,
              isPositive: (dashboardData?.organizersTrend ?? 0) >= 0,
            }}
          />
          <StatCard
            title="Total Tickets Sold"
            value={dashboardData?.totalTicketsSold ?? 0}
            icon={Ticket}
            trend={{
              value: dashboardData?.ticketsTrend ?? 0,
              isPositive: (dashboardData?.ticketsTrend ?? 0) >= 0,
            }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-8">
          {/* Revenue Chart */}
          <Card style={{ borderColor: "hsl(var(--border))" }}>
            <CardHeader>
              <CardTitle className="text-foreground">
                Revenue Over Time
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Monthly revenue trends for this year
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData?.revenueOverTime ?? []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Signups vs Events Chart */}
          <Card style={{ borderColor: "hsl(var(--border))" }}>
            <CardHeader>
              <CardTitle className="text-foreground">
                User Sign-ups vs. Events Created
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Comparing user growth with event creation
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData?.userEventStats ?? []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="signups"
                    fill="hsl(var(--primary))"
                    name="Sign-ups"
                  />
                  <Bar
                    dataKey="events"
                    fill="hsl(var(--accent))"
                    name="Events"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
