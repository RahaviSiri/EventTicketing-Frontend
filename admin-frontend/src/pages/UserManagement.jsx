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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  Trash2,
} from "lucide-react";

// Mock data for organizers
const mockOrganizers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    status: "Pending",
  },
  {
    id: 3,
    name: "David Brown",
    email: "david.brown@example.com",
    status: "Active",
  },
  {
    id: 4,
    name: "Tom Anderson",
    email: "tom.anderson@example.com",
    status: "Active",
  },
];

// Mock data for events
const mockEvents = [
  {
    id: "EVT001",
    eventName: "Tech Conference 2024",
    organizerName: "John Doe",
    organizerEmail: "john.doe@example.com",
    status: "Active",
  },
  {
    id: "EVT002",
    eventName: "Music Festival",
    organizerName: "David Brown",
    organizerEmail: "david.brown@example.com",
    status: "Active",
  },
  {
    id: "EVT003",
    eventName: "Art Exhibition",
    organizerName: "Tom Anderson",
    organizerEmail: "tom.anderson@example.com",
    status: "Active",
  },
  {
    id: "EVT004",
    eventName: "Food & Wine Expo",
    organizerName: "John Doe",
    organizerEmail: "john.doe@example.com",
    status: "Cancelled",
  },
];

// Mock data for pending events
const mockPendingEvents = [
  {
    id: "EVT005",
    eventName: "Sports Championship",
    organizerName: "Mike Johnson",
    organizerEmail: "mike.johnson@example.com",
    status: "Pending",
  },
  {
    id: "EVT006",
    eventName: "Business Summit",
    organizerName: "John Doe",
    organizerEmail: "john.doe@example.com",
    status: "Pending",
  },
];

export default function UserManagement() {
  const [activeFilter, setActiveFilter] = useState("Organizers");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filterButtons = ["Organizers", "Events", "PendingEvents"];

  // Get current data based on active filter
  const getCurrentData = () => {
    switch (activeFilter) {
      case "Organizers":
        return mockOrganizers;
      case "Events":
        return mockEvents;
      case "PendingEvents":
        return mockPendingEvents;
      default:
        return mockOrganizers;
    }
  };

  // Filter data based on search query
  const filteredData = getCurrentData().filter((item) => {
    if (activeFilter === "Organizers") {
      const organizer = item;
      return (
        organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        organizer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      const event = item;
      return (
        event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Active
          </Badge>
        );
      case "Pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200"
          >
            Cancelled
          </Badge>
        );
      case "Suspended":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200"
          >
            Suspended
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-gray-300 text-gray-700">
            {status}
          </Badge>
        );
    }
  };

  const handleActionClick = (action, itemId) => {
    console.log(`${action} clicked for item ${itemId}`);
    // Implement actual action logic here
  };

  const renderTableHeaders = () => {
    if (activeFilter === "Organizers") {
      return (
        <TableRow className="bg-gray-50">
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="bg-gray-50">
          <TableHead>Event ID</TableHead>
          <TableHead>Event Name</TableHead>
          <TableHead>Organizer Name</TableHead>
          <TableHead>Organizer Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      );
    }
  };

  const renderTableRows = () => {
    if (paginatedData.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={activeFilter === "Organizers" ? 4 : 6}
            className="text-center py-8"
          >
            <div className="text-gray-500">
              No {activeFilter.toLowerCase()} found matching your criteria
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return paginatedData.map((item) => (
      <TableRow key={item.id} className="hover:bg-gray-50">
        {activeFilter === "Organizers" ? (
          <>
            <TableCell className="font-medium text-gray-900">
              {item.name}
            </TableCell>
            <TableCell className="text-gray-600">{item.email}</TableCell>
            <TableCell>{getStatusBadge(item.status)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleActionClick("View Profile", item.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  {item.status === "Pending" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleActionClick("Approve", item.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleActionClick("Reject", item.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownMenuItem>
                    </>
                  )}
                  {item.status === "Active" && (
                    <DropdownMenuItem
                      onClick={() => handleActionClick("Suspend", item.id)}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Suspend
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => handleActionClick("Delete", item.id)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell className="font-mono text-sm">{item.id}</TableCell>
            <TableCell className="font-medium text-gray-900">
              {item.eventName}
            </TableCell>
            <TableCell className="text-gray-900">
              {item.organizerName}
            </TableCell>
            <TableCell className="text-gray-600">
              {item.organizerEmail}
            </TableCell>
            <TableCell>{getStatusBadge(item.status)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleActionClick("View Event", item.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Event
                  </DropdownMenuItem>
                  {item.status === "Pending" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleActionClick("Approve", item.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleActionClick("Reject", item.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownMenuItem>
                    </>
                  )}
                  {item.status === "Active" && (
                    <DropdownMenuItem
                      onClick={() => handleActionClick("Cancel", item.id)}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Cancel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => handleActionClick("Delete", item.id)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </>
        )}
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage and monitor all users in the system
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              className="text-sm"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder={
              activeFilter === "Organizers"
                ? "Search organizers by name or email..."
                : "Search events by name or organizer..."
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>{renderTableHeaders()}</TableHeader>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-gray-600 text-center">
        Showing {startIndex + 1} to{" "}
        {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
        {filteredData.length} {activeFilter.toLowerCase()}
      </div>
    </div>
  );
}
