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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Organizer",
    status: "Active",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Attendee",
    status: "Active",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Organizer",
    status: "Pending",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Attendee",
    status: "Suspended",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    role: "Organizer",
    status: "Active",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 6,
    name: "Lisa Davis",
    email: "lisa.davis@example.com",
    role: "Attendee",
    status: "Pending",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 7,
    name: "Tom Anderson",
    email: "tom.anderson@example.com",
    role: "Organizer",
    status: "Active",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 8,
    name: "Emily Taylor",
    email: "emily.taylor@example.com",
    role: "Attendee",
    status: "Active",
    avatar: "/api/placeholder/32/32",
  },
];

export default function UserManagement() {
  const [activeFilter, setActiveFilter] = useState("All Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filterButtons = [
    "All Users",
    "Attendees",
    "Organizers",
    "Pending Approval",
  ];

  // Filter users based on active filter and search query
  const filteredUsers = mockUsers.filter((user) => {
    const matchesFilter =
      activeFilter === "All Users" ||
      (activeFilter === "Attendees" && user.role === "Attendee") ||
      (activeFilter === "Organizers" && user.role === "Organizer") ||
      (activeFilter === "Pending Approval" && user.status === "Pending");

    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
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

  const handleActionClick = (action, userId) => {
    console.log(`${action} clicked for user ${userId}`);
    // Implement actual action logic here
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
            placeholder="Search users by name or email..."
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
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-gray-500">
                    No users found matching your criteria
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() =>
                            handleActionClick("View Profile", user.id)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        {user.status === "Pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleActionClick("Approve", user.id)
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleActionClick("Reject", user.id)
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {user.status === "Active" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleActionClick("Suspend", user.id)
                            }
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleActionClick("Delete", user.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
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
        {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
        {filteredUsers.length} users
      </div>
    </div>
  );
}
