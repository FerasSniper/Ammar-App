// app/Register/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { Save, Plus, AlertTriangle, Menu, X, Upload, LogOut, BarChart3, Users, FileText, Settings } from "lucide-react"

interface FormData {
  // Section 1
  name: string
  nickName: string
  mobile: string
  email: string
  job: string
  plotAddress: string
  plotArea: string
  designType: string
  preferredOffer: string
  knowUsThrough: string

  // Section 2
  basement: string
  groundFloor: string
  firstFloor: string
  secondFloor: string
  rooftop: string
  buildingArea: string

  // Section 3
  designDescription: string
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export default function Register() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [userImage, setUserImage] = useState<string | null>(null)
  const [userName] = useState("Ammar Nasser")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nickName: "",
    mobile: "",
    email: "",
    job: "",
    plotAddress: "",
    plotArea: "",
    designType: "",
    preferredOffer: "",
    knowUsThrough: "",
    basement: "",
    groundFloor: "",
    firstFloor: "",
    secondFloor: "",
    rooftop: "",
    buildingArea: "",
    designDescription: "",
  })

  // Navigation items
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

  // Auto-calculate floors based on plot area
  useEffect(() => {
    if (formData.plotArea && !isNaN(Number(formData.plotArea))) {
      const plotAreaNum = Number(formData.plotArea)
      const groundFloor = (plotAreaNum * 0.6).toFixed(2)
      const firstFloor = (plotAreaNum * 0.6).toFixed(2)
      const rooftopArea = (plotAreaNum * 0.42).toFixed(2)

      setFormData((prev) => ({
        ...prev,
        groundFloor,
        firstFloor,
        rooftop: rooftopArea,
      }))
    }
  }, [formData.plotArea])

  // Auto-calculate building area
  useEffect(() => {
    const basement = Number(formData.basement) || 0
    const groundFloor = Number(formData.groundFloor) || 0
    const firstFloor = Number(formData.firstFloor) || 0
    const secondFloor = Number(formData.secondFloor) || 0
    const rooftop = Number(formData.rooftop) || 0

    const total = basement + groundFloor + firstFloor + secondFloor + rooftop

    setFormData((prev) => ({
      ...prev,
      buildingArea: total > 0 ? total.toFixed(2) : "",
    }))
  }, [formData.basement, formData.groundFloor, formData.firstFloor, formData.secondFloor, formData.rooftop])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNewForm = () => {
    setShowAlert(true)
  }

  const confirmNewForm = () => {
    setFormData({
      name: "",
      nickName: "",
      mobile: "",
      email: "",
      job: "",
      plotAddress: "",
      plotArea: "",
      designType: "",
      preferredOffer: "",
      knowUsThrough: "",
      basement: "",
      groundFloor: "",
      firstFloor: "",
      secondFloor: "",
      rooftop: "",
      buildingArea: "",
      designDescription: "",
    })
    setShowAlert(false)
  }

  const handleCreateContract = () => {
    // Handle form submission
    console.log("Creating contract with data:", formData)
    alert("Contract created successfully!")
  }

  const designTypeOptions = [
    "Villas and Apartments",
    "Residential Building",
    "Commercial Building",
    "Mixed-Use Building",
  ]

  const preferredOfferOptions = ["Email", "WhatsApp"]

  const knowUsThroughOptions = ["Instagram", "Twitter", "Friend", "Google", "Other"]

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
                {navigationItems.find(i => i.href === pathname)?.label || "Register"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleNewForm}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>

              <button
                onClick={handleCreateContract}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Create Contract</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 max-w-6xl mx-auto">
          <div className="space-y-8">
            {/* Section 1: Basic Information */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Basic Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nick Name</label>
                    <input
                      type="text"
                      value={formData.nickName}
                      onChange={(e) => handleInputChange("nickName", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter nickname"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+966 50 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job</label>
                    <input
                      type="text"
                      value={formData.job}
                      onChange={(e) => handleInputChange("job", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter job title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plot Address *</label>
                    <input
                      type="text"
                      value={formData.plotAddress}
                      onChange={(e) => handleInputChange("plotAddress", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter plot address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plot Area (m²) *</label>
                    <input
                      type="number"
                      value={formData.plotArea}
                      onChange={(e) => handleInputChange("plotArea", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter area in square meters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Design Type *</label>
                    <select
                      value={formData.designType}
                      onChange={(e) => handleInputChange("designType", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select design type</option>
                      {designTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Receiving Offer *</label>
                    <select
                      value={formData.preferredOffer}
                      onChange={(e) => handleInputChange("preferredOffer", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select preferred method</option>
                      {preferredOfferOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Got to Know Us Through</label>
                    <select
                      value={formData.knowUsThrough}
                      onChange={(e) => handleInputChange("knowUsThrough", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select source</option>
                      {knowUsThroughOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Building Details */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Building Details</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Basement (m²)</label>
                    <input
                      type="number"
                      value={formData.basement}
                      onChange={(e) => handleInputChange("basement", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter basement area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ground Floor (m²)</label>
                    <input
                      type="number"
                      value={formData.groundFloor}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Auto-calculated"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-calculated: 60% of plot area</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Floor (m²)</label>
                    <input
                      type="number"
                      value={formData.firstFloor}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Auto-calculated"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-calculated: 60% of plot area</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Second Floor (m²)</label>
                    <input
                      type="number"
                      value={formData.secondFloor}
                      onChange={(e) => handleInputChange("secondFloor", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter second floor area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rooftop (m²)</label>
                    <input
                      type="number"
                      value={formData.rooftop}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Auto-calculated"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-calculated: 42% of plot area</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Building Area (m²)</label>
                    <input
                      type="number"
                      value={formData.buildingArea}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-blue-800 font-semibold"
                      placeholder="Auto-calculated"
                    />
                    <p className="text-xs text-blue-600 mt-1">Sum of all floors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Design Description */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Design Description</h2>
              </div>
              <div className="p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Design Description</label>
                  <textarea
                    value={formData.designDescription}
                    onChange={(e) => handleInputChange("designDescription", e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Provide detailed description of the design requests from the client..."
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Clear Form</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to clear this form? All entered data will be lost and cannot be recovered.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmNewForm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Clear Form
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
