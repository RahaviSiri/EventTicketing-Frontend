import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api/admin";

export default function UserManagement() {
  const [activeFilter, setActiveFilter] = useState("Organizers");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 10;

  const filterButtons = ["Organizers", "Events", "PendingEvents"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("AdminToken");
        if (!token) return;

        let endpoint = "";
        if (activeFilter === "Organizers") {
          endpoint = `${API_BASE_URL}/userManagement/organizers?page=${
            currentPage - 1
          }&size=${itemsPerPage}`;
        } else if (activeFilter === "Events") {
          endpoint = `${API_BASE_URL}/userManagement/events?page=${
            currentPage - 1
          }&size=${itemsPerPage}`;
        } else if (activeFilter === "PendingEvents") {
          endpoint = `${API_BASE_URL}/userManagement/pendingEvents?page=${
            currentPage - 1
          }&size=${itemsPerPage}`;
        }

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/admin-login";
        }
      }
    };

    fetchData();
  }, [activeFilter, currentPage]);

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    if (activeFilter === "Organizers") {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query)
      );
    } else {
      return (
        item.eventName?.toLowerCase().includes(query) ||
        item.organizerName?.toLowerCase().includes(query) ||
        item.organizerEmail?.toLowerCase().includes(query)
      );
    }
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="border-gray-300 text-gray-700">{status}</Badge>
        );
    }
  };

  const handleActionClick = (action, itemId) => {
    console.log(`${action} clicked for item ${itemId}`);
  };

  const renderTableHeaders = () => {
    if (activeFilter === "Organizers") {
      return (
        <TableRow className="bg-gray-50">
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Active Events</TableHead>
          <TableHead>Pending Events</TableHead>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="bg-gray-50">
          <TableHead>Event ID</TableHead>
          <TableHead>Event Name</TableHead>
          <TableHead>Organizer ID</TableHead> {/* New column */}
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
            colSpan={activeFilter === "Organizers" ? 5 : 7}
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
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.activeEventsCount}</TableCell>
            <TableCell>{item.pendingEventsCount}</TableCell>
          </>
        ) : (
          <>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.eventName}</TableCell>
            <TableCell>{item.organizerId ?? "N/A"}</TableCell> {/* New field */}
            <TableCell>{item.organizerName ?? "N/A"}</TableCell>
            <TableCell>{item.organizerEmail ?? "N/A"}</TableCell>
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
                    onClick={() =>
                      (window.location.href = `/event-details/EVT${String(
                        item.id
                      ).padStart(3, "0")}`)
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Event
                  </DropdownMenuItem>
                  {item.status?.toUpperCase() === "PENDING" && (
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage and monitor all users in the system
        </p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
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
            >
              {filter}
            </Button>
          ))}
        </div>

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

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>{renderTableHeaders()}</TableHeader>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, idx) => (
            <Button
              key={idx}
              variant={currentPage === idx + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
          <Button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
