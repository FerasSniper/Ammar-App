// app/Te-Settings/page.tsx
"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"
import {
  Search,
  Trash2,
  Plus,
  Users,
  BarChart3,
  Settings,
  FileText,
  LogOut,
  Upload,
  Menu,
  X,
  MessageCircle,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  User,
} from "lucide-react"

interface Employee {
  id: string
  name: string
  telegramHandle: string
  role: string
  lastNotified: string
  isActive: boolean
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export default function TeSettings() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [userImage, setUserImage] = useState<string | null>(null)
  const [userName] = useState("Ammar Nasser")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRemoveAlert, setShowRemoveAlert] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sample employees data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Ahmed Al-Rashid",
      telegramHandle: "@ahmed_rashid",
      role: "Project Manager",
      lastNotified: "2025-01-20 14:30",
      isActive: true,
    },
    {
      id: "2",
      name: "Sara Al-Mahmoud",
      telegramHandle: "@sara_mahmoud",
      role: "Senior Developer",
      lastNotified: "2025-01-20 12:15",
      isActive: true,
    },
    {
      id: "3",
      name: "Mohammed Al-Zahra",
      telegramHandle: "@mohammed_zahra",
      role: "Design Lead",
      lastNotified: "2025-01-19 16:45",
      isActive: false,
    },
    {
      id: "4",
      name: "Fatima Al-Khalil",
      telegramHandle: "@fatima_khalil",
      role: "QA Engineer",
      lastNotified: "2025-01-20 09:20",
      isActive: true,
    },
    {
      id: "5",
      name: "Omar Al-Fahd",
      telegramHandle: "@omar_fahd",
      role: "Business Analyst",
      lastNotified: "2025-01-18 11:30",
      isActive: true,
    },
  ])

  // New employee form state
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    telegramHandle: "",
    role: "",
  })

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

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    const filteredIds = filteredEmployees.map((employee) => employee.id)
    setSelectedItems((prev) => (prev.length === filteredIds.length ? [] : filteredIds))
  }

  const handleRemoveSelected = () => {
    if (selectedItems.length > 0) {
      setShowRemoveAlert(true)
    }
  }

  const confirmRemove = () => {
    setEmployees((prev) => prev.filter((employee) => !selectedItems.includes(employee.id)))
    setSelectedItems([])
    setShowRemoveAlert(false)
  }

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.telegramHandle && newEmployee.role) {
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        telegramHandle: newEmployee.telegramHandle.startsWith("@")
          ? newEmployee.telegramHandle
          : `@${newEmployee.telegramHandle}`,
        role: newEmployee.role,
        lastNotified: "Never",
        isActive: true,
      }
      setEmployees((prev) => [...prev, employee])
      setNewEmployee({ name: "", telegramHandle: "", role: "" })
      setShowAddModal(false)
    }
  }

  const toggleEmployeeStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((employee) => (employee.id === id ? { ...employee, isActive: !employee.isActive } : employee)),
    )
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.telegramHandle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatLastNotified = (dateTime: string) => {
    if (dateTime === "Never") return "Never"
    const date = new Date(dateTime)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "project manager":
        return <Shield className="w-4 h-4" />
      case "senior developer":
      case "developer":
        return <User className="w-4 h-4" />
      case "design lead":
      case "designer":
        return <User className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

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
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
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
                {navigationItems.find(i => i.href === pathname)?.label || "Settings"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>

              {/* Remove Button */}
              <button
                onClick={handleRemoveSelected}
                disabled={selectedItems.length === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  selectedItems.length > 0
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove ({selectedItems.length})</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-800">Telegram Notification System</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Employees listed below will receive Telegram notifications when users register through the linked
                  website. Notifications include user name, contact number, and registration details.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Telegram Notification Recipients</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Select All</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telegram Handle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Notified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(employee.id)}
                          onChange={() => handleSelectItem(employee.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{employee.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-900 font-mono">{employee.telegramHandle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(employee.role)}
                          <span className="text-sm text-gray-900">{employee.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{formatLastNotified(employee.lastNotified)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleEmployeeStatus(employee.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            employee.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {employee.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto w-12 h-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Try adjusting your search terms" : "Add employees to start receiving notifications"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Add New Employee</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telegram Handle</label>
                <input
                  type="text"
                  value={newEmployee.telegramHandle}
                  onChange={(e) => setNewEmployee((prev) => ({ ...prev, telegramHandle: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select role</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Senior Developer">Senior Developer</option>
                  <option value="Developer">Developer</option>
                  <option value="Design Lead">Design Lead</option>
                  <option value="Designer">Designer</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddEmployee}
                disabled={!newEmployee.name || !newEmployee.telegramHandle || !newEmployee.role}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Employee
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewEmployee({ name: "", telegramHandle: "", role: "" })
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Remove Employees</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove {selectedItems.length} employee(s)? They will no longer receive Telegram
              notifications for new registrations.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmRemove}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setShowRemoveAlert(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
