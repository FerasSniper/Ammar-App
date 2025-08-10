// app/Orders/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import {
  Search,
  Calendar,
  Phone,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  LogOut,
  BarChart3,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  ChevronDown,
  Hash,
} from "lucide-react"

interface Order {
  id: string
  orderId: string
  userName: string
  mobile: string
  email: string
  insertedDate: string
  status: "In-review" | "Approved" | "Canceled"
  prices: {
    basic: number
    standard: number
    premium: number
    deluxe: number
    ultimate: number
  }
  clientActivity: "none" | "red" | "yellow" | "green"
  lastActivityUpdate: string
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export default function Orders() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  // Load user name from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setUserName(parsed.name || "");
        } catch (e) {
          setUserName("");
        }
      }
    }
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample orders data
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("orders");
      if (stored) {
        try {
          const userOrders = JSON.parse(stored);
          if (Array.isArray(userOrders)) {
            setOrders(userOrders);
          }
        } catch {}
      }
    }
  }, []);

  const navigationItems: NavigationItem[] = [
    { id: "dashboard", label: "New Requests", icon: <BarChart3 className="w-5 h-5" />, href: "/dashboard" },
    { id: "Register", label: "Register", icon: <Users className="w-5 h-5" />, href: "/Register" },
    { id: "Orders", label: "Orders", icon: <FileText className="w-5 h-5" />, href: "/Orders" },
    { id: "Te-Settings", label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/Te-Settings" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setUserImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleActivityChange = (orderId: string, activity: "none" | "red" | "yellow" | "green") => {
    const now = new Date()
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, clientActivity: activity, lastActivityUpdate: timestamp } : order,
      ),
    )
  }

  const handleStatusChange = (orderId: string, newStatus: "In-review" | "Approved" | "Canceled") => {
    if (newStatus === "Canceled") {
      if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
        setOrders((prev) => {
          const updated = prev.filter((order) => order.id !== orderId);
          if (typeof window !== "undefined") {
            localStorage.setItem("orders", JSON.stringify(updated));
          }
          return updated;
        });
      }
    } else {
      setOrders((prev) => {
        const updated = prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order));
        if (typeof window !== "undefined") {
          localStorage.setItem("orders", JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4" />
      case "Canceled":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Canceled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "green":
        return "bg-green-500"
      case "yellow":
        return "bg-yellow-500"
      case "red":
        return "bg-red-500"
      default:
        return "bg-gray-300"
    }
  }

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case "green":
        return "Responsive & Active"
      case "yellow":
        return "Moderately Active"
      case "red":
        return "Low Response"
      default:
        return "No Response"
    }
  }

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push('/');
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.mobile.includes(searchTerm) ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // First, prioritize by first letter if search term is provided
      if (searchTerm && searchTerm.length > 0) {
        const aStartsWithSearch = a.userName.toLowerCase().startsWith(searchTerm.toLowerCase())
        const bStartsWithSearch = b.userName.toLowerCase().startsWith(searchTerm.toLowerCase())

        if (aStartsWithSearch && !bStartsWithSearch) return -1
        if (!aStartsWithSearch && bStartsWithSearch) return 1
      }

      // Then sort by date
      if (dateFilter === "newest") {
        return new Date(b.insertedDate).getTime() - new Date(a.insertedDate).getTime()
      } else {
        return new Date(a.insertedDate).getTime() - new Date(b.insertedDate).getTime()
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg">
                  {userImage ? (
                    <img src={userImage || "/placeholder.svg"} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl font-bold">{userName.charAt(0)}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Upload className="w-6 h-6 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-gray-800">{userName}</h3>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {navigationItems.find(i => i.href === pathname)?.label || "Orders"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, mobile, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="In-review">In-review</option>
                  <option value="Approved">Approved</option>
                  <option value="Canceled">Canceled</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{order.userName}</h3>
                        <p className="text-blue-100 text-sm flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {order.mobile}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as "In-review" | "Approved" | "Canceled")
                        }
                        className={`appearance-none px-3 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${getStatusColor(order.status)}`}
                      >
                        <option value="In-review">In-review</option>
                        <option value="Approved">Approved</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Prices Section */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Offer Prices (SAR)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Basic</p>
                        <p className="text-lg font-bold text-gray-800">{order.prices.basic.toLocaleString()}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-600">Standard</p>
                        <p className="text-lg font-bold text-blue-800">{order.prices.standard.toLocaleString()}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs text-purple-600">Premium</p>
                        <p className="text-lg font-bold text-purple-800">{order.prices.premium.toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-green-600">Deluxe</p>
                        <p className="text-lg font-bold text-green-800">{order.prices.deluxe.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 col-span-2">
                        <p className="text-xs text-orange-600">Ultimate</p>
                        <p className="text-xl font-bold text-orange-800">{order.prices.ultimate.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Date and Activity Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Inserted: {order.insertedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Hash className="w-4 h-4" />
                        <span>{order.orderId}</span>
                      </div>
                    </div>

                    {/* Client Activity */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Client Activity</span>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{order.lastActivityUpdate}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{getActivityLabel(order.clientActivity)}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleActivityChange(order.id, "none")}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                              order.clientActivity === "none"
                                ? "bg-gray-300 border-gray-400 scale-110"
                                : "bg-gray-200 border-gray-300 hover:scale-105"
                            }`}
                            title="No Response"
                          />
                          <button
                            onClick={() => handleActivityChange(order.id, "red")}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                              order.clientActivity === "red"
                                ? "bg-red-500 border-red-600 scale-110"
                                : "bg-red-400 border-red-500 hover:scale-105"
                            }`}
                            title="Low Response"
                          />
                          <button
                            onClick={() => handleActivityChange(order.id, "yellow")}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                              order.clientActivity === "yellow"
                                ? "bg-yellow-500 border-yellow-600 scale-110"
                                : "bg-yellow-400 border-yellow-500 hover:scale-105"
                            }`}
                            title="Moderately Active"
                          />
                          <button
                            onClick={() => handleActivityChange(order.id, "green")}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                              order.clientActivity === "green"
                                ? "bg-green-500 border-green-600 scale-110"
                                : "bg-green-400 border-green-500 hover:scale-105"
                            }`}
                            title="Responsive & Active"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto w-12 h-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No orders available at the moment"}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}