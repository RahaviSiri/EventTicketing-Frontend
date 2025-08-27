import { useState } from "react";
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

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
];

const userEventData = [
  { name: "Jan", signups: 120, events: 15 },
  { name: "Feb", signups: 190, events: 22 },
  { name: "Mar", signups: 300, events: 35 },
  { name: "Apr", signups: 250, events: 28 },
  { name: "May", signups: 400, events: 42 },
  { name: "Jun", signups: 350, events: 38 },
];

export default function Dashboard() {
  const [dateFilter, setDateFilter] = useState("Last 7 days");
  const navigate = useNavigate();

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
              <DropdownMenuItem onClick={() => setDateFilter("Last 7 days")}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("This Month")}>
                This Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("Last 3 Months")}>
                Last 3 Months
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("This Year")}>
                This Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-8 flex flex-col gap-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="$24,500"
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Active Events"
            value="148"
            icon={Calendar}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="New Organizers (Pending)"
            value="23"
            icon={Users}
            trend={{ value: 3.1, isPositive: false }}
          />
          <StatCard
            title="Total Tickets Sold"
            value="1,284"
            icon={Ticket}
            trend={{ value: 15.8, isPositive: true }}
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
                <LineChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
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
                <BarChart data={userEventData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
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
