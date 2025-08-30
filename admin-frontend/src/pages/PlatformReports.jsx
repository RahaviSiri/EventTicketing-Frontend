import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Download, Calendar, FileText } from "lucide-react";

// Mock data for top performing events
const mockEvents = [
  {
    id: 1,
    name: "Tech Conference 2024",
    organizer: "TechCorp",
    ticketsSold: 850,
    revenue: 42500,
  },
  {
    id: 2,
    name: "Music Festival Summer",
    organizer: "MusicEvents LLC",
    ticketsSold: 1200,
    revenue: 75000,
  },
  {
    id: 3,
    name: "Business Workshop Series",
    organizer: "BizEducation",
    ticketsSold: 320,
    revenue: 19200,
  },
  {
    id: 4,
    name: "Art Gallery Opening",
    organizer: "Creative Spaces",
    ticketsSold: 150,
    revenue: 4500,
  },
  {
    id: 5,
    name: "Food & Wine Expo",
    organizer: "Culinary Events",
    ticketsSold: 680,
    revenue: 34000,
  },
];

// Mock data for pie chart
const revenueByCategory = [
  { name: "Technology", value: 35, color: "#3b82f6" },
  { name: "Music", value: 28, color: "#6366f1" },
  { name: "Business", value: 20, color: "#8b5cf6" },
  { name: "Arts", value: 10, color: "#06b6d4" },
  { name: "Food & Beverage", value: 7, color: "#10b981" },
];

export default function PlatformReports() {
  const [reportType, setReportType] = useState("financial");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleExportReport = (format) => {
    console.log(`Exporting report as ${format}`);
    // Implement actual export logic here
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Platform Reports
          </h1>
          <p className="text-gray-600 mt-2">
            Generate and analyze comprehensive system reports
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={() => handleExportReport("csv")}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => handleExportReport("pdf")}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                From Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                To Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Report Type
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-200">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="user-growth">User Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Top Performing Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">
                      Event Name
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Organizer
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Tickets Sold
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Revenue
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvents.map((event) => (
                    <TableRow key={event.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        {event.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {event.organizer}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {event.ticketsSold.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(event.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Revenue by Event Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium text-gray-900">
                              {data.payload.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {data.value}% of total revenue
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {revenueByCategory.map((category, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-500">
                    ({category.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Report Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  mockEvents.reduce((sum, event) => sum + event.revenue, 0)
                )}
              </p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {mockEvents
                  .reduce((sum, event) => sum + event.ticketsSold, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Tickets Sold</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {mockEvents.length}
              </p>
              <p className="text-sm text-gray-600">Active Events</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(
                  mockEvents.reduce((sum, event) => sum + event.revenue, 0) /
                    mockEvents.length
                )}
              </p>
              <p className="text-sm text-gray-600">Avg. Revenue per Event</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
