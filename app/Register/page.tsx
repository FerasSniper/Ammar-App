"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Save, Plus, AlertTriangle, Menu, X, Upload, LogOut, BarChart3, Users, FileText, Settings } from "lucide-react";
import Modal from '@/components/ui/Modal';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface FormData {
  name: string;
  nickName: string;
  mobile: string;
  email: string;
  job: string;
  plotAddress: string;
  plotArea: string;
  designType: string;
  preferredOffer: string;
  knowUsThrough: string;
  basement: string;
  groundFloor: string;
  firstFloor: string;
  secondFloor: string;
  rooftop: string;
  buildingArea: string;
  designDescription: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export default function Register() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(2); // 0-based, middle offer selected

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
  });

  // Load user name from localStorage on mount
  useEffect(() => {
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

  // Fetch register info based on ID from URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const fetchRegisterInfo = async () => {
        try {
          const res = await fetch(`/api/register-info/${id}`);
          if (!res.ok) throw new Error('Failed to fetch');
          const data = await res.json();
          setFormData(data);
        } catch (error) {
          console.error('Error fetching register info:', error);
        }
      };
      fetchRegisterInfo();
    }
  }, [searchParams]);

  // Navigation items
  const navigationItems: NavigationItem[] = [
    { id: "dashboard", label: "New Requests", icon: <BarChart3 className="w-5 h-5" />, href: "/dashboard" },
    { id: "Register", label: "Register", icon: <Users className="w-5 h-5" />, href: "/Register" },
    { id: "Orders", label: "Orders", icon: <FileText className="w-5 h-5" />, href: "/Orders" },
    { id: "Te-Settings", label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/Te-Settings" },
  ];

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

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
      const plotAreaNum = Number(formData.plotArea);
      const groundFloor = (plotAreaNum * 0.6).toFixed(2);
      const firstFloor = (plotAreaNum * 0.6).toFixed(2);
      const rooftopArea = (plotAreaNum * 0.42).toFixed(2);

      setFormData((prev) => ({
        ...prev,
        groundFloor,
        firstFloor,
        rooftop: rooftopArea,
      }));
    }
  }, [formData.plotArea]);

  // Auto-calculate building area
  useEffect(() => {
    const basement = Number(formData.basement) || 0;
    const groundFloor = Number(formData.groundFloor) || 0;
    const firstFloor = Number(formData.firstFloor) || 0;
    const secondFloor = Number(formData.secondFloor) || 0;
    const rooftop = Number(formData.rooftop) || 0;

    const total = basement + groundFloor + firstFloor + secondFloor + rooftop;

    setFormData((prev) => ({
      ...prev,
      buildingArea: total > 0 ? total.toFixed(2) : "",
    }));
  }, [formData.basement, formData.groundFloor, formData.firstFloor, formData.secondFloor, formData.rooftop]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewForm = () => {
    setShowAlert(true);
  };

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
    });
    setShowAlert(false);
  };

  const handleCreateContract = () => {
    // Validate required fields
    const requiredFields = ['name', 'mobile', 'email', 'plotAddress', 'plotArea', 'designType'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      const fieldLabels = {
        name: 'Full Name',
        mobile: 'Mobile Number',
        email: 'Email Address',
        plotAddress: 'Plot Address',
        plotArea: 'Plot Area',
        designType: 'Design Type'
      };
      
      const missingFieldNames = missingFields.map(field => fieldLabels[field as keyof typeof fieldLabels]).join(', ');
      
      // Show validation modal
      setValidationMessage(`Please fill in the following required fields: ${missingFieldNames}`);
      setShowValidationModal(true);
      return;
    }
    
    setShowContractModal(true);
  };

  const handleModalClose = () => {
    setShowContractModal(false);
  };

  // Enhanced PDF/Excel generation with beautiful design
  const handleContractGenerate = async () => {
    const userName = formData.name || 'contract';
    const contractDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Generate beautiful PDF
    const doc = new jsPDF();
    
    // Add header with gradient effect (simulated with rectangles)
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFillColor(147, 51, 234); // Purple
    doc.rect(0, 0, 210, 20, 'F');
    
    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AMMAR CONSTRUCTION', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Professional Building Contract', 105, 30, { align: 'center' });
    
    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    
    // Contract details section
    doc.setFillColor(243, 244, 246); // Light gray background
    doc.rect(10, 50, 190, 80, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTRACT DETAILS', 20, 65);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const details = [
      { label: 'Client Name:', value: formData.name },
      { label: 'Mobile:', value: formData.mobile },
      { label: 'Email:', value: formData.email },
      { label: 'Plot Address:', value: formData.plotAddress },
      { label: 'Plot Area:', value: `${formData.plotArea} m²` },
      { label: 'Building Area:', value: `${formData.buildingArea} m²` },
      { label: 'Design Type:', value: formData.designType },
      { label: 'Contract Date:', value: contractDate }
    ];
    
    let yPos = 75;
    details.forEach((detail, index) => {
      const xPos = index % 2 === 0 ? 20 : 110;
      if (index % 2 === 0 && index > 0) yPos += 15;
      
      doc.setFont('helvetica', 'bold');
      doc.text(detail.label, xPos, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(detail.value || 'N/A', xPos + 40, yPos);
    });
    
    // Offer details section
    doc.setFillColor(236, 254, 255); // Light blue background
    doc.rect(10, 140, 190, 60, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SELECTED OFFER', 20, 155);
    
    doc.setFontSize(14);
    doc.text(`Package ${selectedOffer + 1}`, 20, 170);
    doc.setFontSize(12);
    doc.text(`Rate: ${offers[selectedOffer].rate} SAR per m²`, 20, 180);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94); // Green color for total
    doc.text(`Total Contract Value: ${offers[selectedOffer].total.toLocaleString()} SAR`, 20, 195);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Terms and conditions
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS AND CONDITIONS', 20, 220);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const terms = [
      '1. This contract is valid for 30 days from the date of issue.',
      '2. Payment terms: 50% advance, 50% upon completion.',
      '3. Project timeline will be determined after contract acceptance.',
      '4. Any modifications must be agreed upon in writing.',
      '5. Quality standards will meet local building codes.'
    ];
    
    let termY = 230;
    terms.forEach(term => {
      doc.text(term, 20, termY);
      termY += 8;
    });
    
    // Footer
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 270, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Contact: +966 50 123 4567 | Email: info@ammarconstruction.com', 105, 285, { align: 'center' });
    
    // Generate beautiful Excel
    const wsData = [
      ['AMMAR CONSTRUCTION - CONTRACT DETAILS'],
      [''],
      ['Client Information'],
      ['Full Name', formData.name],
      ['Mobile', formData.mobile],
      ['Email', formData.email],
      ['Plot Address', formData.plotAddress],
      [''],
      ['Project Details'],
      ['Plot Area (m²)', formData.plotArea],
      ['Building Area (m²)', formData.buildingArea],
      ['Design Type', formData.designType],
      ['Contract Date', contractDate],
      [''],
      ['Selected Offer'],
      ['Package', `Package ${selectedOffer + 1}`],
      ['Rate per m²', `${offers[selectedOffer].rate} SAR`],
      ['Total Contract Value', `${offers[selectedOffer].total.toLocaleString()} SAR`],
      [''],
      ['Floor Details'],
      ['Basement (m²)', formData.basement || '0'],
      ['Ground Floor (m²)', formData.groundFloor || '0'],
      ['First Floor (m²)', formData.firstFloor || '0'],
      ['Second Floor (m²)', formData.secondFloor || '0'],
      ['Rooftop (m²)', formData.rooftop || '0'],
      [''],
      ['Additional Information'],
      ['Job Title', formData.job || 'Not specified'],
      ['Nickname', formData.nickName || 'Not specified'],
      ['Preferred Contact', formData.preferredOffer || 'Not specified'],
      ['How did you know us', formData.knowUsThrough || 'Not specified'],
      ['Design Description', formData.designDescription || 'Not specified']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Style the worksheet
    ws['A1'].s = {
      font: { bold: true, size: 16, color: { rgb: "4F46E5" } },
      alignment: { horizontal: "center" }
    };
    
    // Add borders and styling to data sections
    const dataRanges = [
      { start: 3, end: 7 }, // Client Information
      { start: 9, end: 13 }, // Project Details
      { start: 15, end: 18 }, // Selected Offer
      { start: 20, end: 25 }, // Floor Details
      { start: 27, end: 32 } // Additional Information
    ];
    
    dataRanges.forEach(range => {
      for (let i = range.start; i <= range.end; i++) {
        if (ws[`A${i}`]) {
          ws[`A${i}`].s = { font: { bold: true }, fill: { fgColor: { rgb: "E0E7FF" } } };
        }
        if (ws[`B${i}`]) {
          ws[`B${i}`].s = { fill: { fgColor: { rgb: "F8FAFC" } } };
        }
      }
    });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contract');
    
    // Prepare order data
    const now = new Date();
    const insertedDate = now.toISOString().slice(0, 10);
    const lastActivityUpdate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const orderId = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random()*900+100)}`;
    
    const buildingArea = Number(formData.buildingArea) || 0;
    const prices = {
      basic: buildingArea * 7,
      standard: buildingArea * 10,
      premium: buildingArea * 15,
      deluxe: buildingArea * 20,
      ultimate: buildingArea * 25,
    };
    
    const newOrder = {
      id: `${Date.now()}`,
      orderId,
      userName: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      insertedDate,
      status: "In-review",
      prices,
      clientActivity: "none",
      lastActivityUpdate,
    };
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("orders");
      let orders = [];
      if (existing) {
        try { orders = JSON.parse(existing); } catch {}
      }
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
    }
    
    // Download files
    doc.save(`${userName}_Contract_${contractDate.replace(/\s+/g, '_')}.pdf`);
    XLSX.writeFile(wb, `${userName}_Contract_${contractDate.replace(/\s+/g, '_')}.xlsx`);
    
    alert('Beautiful contract files generated and downloaded!');
    setShowContractModal(false);
    router.push("/Orders");
  };

  const designTypeOptions = [
    "Villas and Apartments",
    "Residential Building",
    "Commercial Building",
    "Mixed-Use Building",
  ];

  const preferredOfferOptions = ["Email", "WhatsApp"];

  const knowUsThroughOptions = ["Instagram", "Twitter", "Friend", "Google", "Other"];

  // Offer calculation
  const buildingArea = Number(formData.buildingArea) || 0;
  const offers = [7, 10, 15, 20, 25].map((rate) => ({
    rate,
    total: buildingArea * rate,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col h-full">
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

        <main className="p-6 max-w-6xl mx-auto">
          <div className="space-y-8">
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
                      value={formData.name || ''}
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

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

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

      <Modal open={showContractModal} onClose={handleModalClose} title="Create Contract" size="2xl">
        <div className="space-y-8">
          {/* Client Information Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-1">Full Name</div>
                <div className="text-lg font-semibold text-gray-900">{formData.name || 'Not provided'}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-1">Mobile</div>
                <div className="text-lg font-semibold text-gray-900">{formData.mobile || 'Not provided'}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-1">Email</div>
                <div className="text-lg font-semibold text-gray-900">{formData.email || 'Not provided'}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-1">Plot Address</div>
                <div className="text-lg font-semibold text-gray-900">{formData.plotAddress || 'Not provided'}</div>
              </div>
            </div>
          </div>

          {/* Project Details Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Project Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-1">Plot Area</div>
                <div className="text-2xl font-bold text-green-600">{formData.plotArea || '0'} m²</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-1">Building Area</div>
                <div className="text-2xl font-bold text-blue-600">{formData.buildingArea || '0'} m²</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-1">Design Type</div>
                <div className="text-lg font-semibold text-gray-900">{formData.designType || 'Not specified'}</div>
              </div>
            </div>
          </div>

          {/* Offer Selection Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              Choose Your Offer Package
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer, idx) => (
                <div
                  key={offer.rate}
                  className={`relative rounded-2xl p-6 shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    selectedOffer === idx
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-2 border-blue-400 scale-105 shadow-xl'
                      : 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl'
                  }`}
                  onClick={() => setSelectedOffer(idx)}
                >
                  {selectedOffer === idx && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                  <div className={`text-center ${selectedOffer === idx ? 'text-white' : 'text-gray-800'}`}>
                    <div className={`text-2xl font-bold mb-2 ${selectedOffer === idx ? 'text-white' : 'text-blue-600'}`}>
                      Package {idx + 1}
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${selectedOffer === idx ? 'text-white' : 'text-gray-900'}`}>
                      {offer.rate} SAR
                    </div>
                    <div className={`text-sm mb-4 ${selectedOffer === idx ? 'text-blue-100' : 'text-gray-500'}`}>
                      per square meter
                    </div>
                    <div className={`text-xl font-bold ${selectedOffer === idx ? 'text-white' : 'text-green-600'}`}>
                      {offer.total.toLocaleString()} SAR
                    </div>
                    <div className={`text-sm mt-1 ${selectedOffer === idx ? 'text-blue-100' : 'text-gray-500'}`}>
                      Total Price
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          {selectedOffer !== null && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Contract Summary
              </h3>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Selected Package</div>
                    <div className="text-xl font-bold text-blue-600">Package {selectedOffer + 1}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Rate per m²</div>
                    <div className="text-xl font-bold text-green-600">{offers[selectedOffer].rate} SAR</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Building Area</div>
                    <div className="text-xl font-bold text-purple-600">{formData.buildingArea || '0'} m²</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Contract Value</div>
                    <div className="text-2xl font-bold text-orange-600">{offers[selectedOffer].total.toLocaleString()} SAR</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              className="px-8 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              onClick={handleModalClose}
            >
              Cancel
            </button>
            <button
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={handleContractGenerate}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Generate Contract</span>
              </div>
            </button>
          </div>
        </div>
      </Modal>

      {/* Validation Modal */}
      <Modal open={showValidationModal} onClose={() => setShowValidationModal(false)} title="Form Validation Required" size="md">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Required Information Missing</h3>
              <p className="text-gray-600">Please complete the form before creating a contract.</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-sm font-medium text-red-800 mb-2">Missing Fields:</div>
            <div className="text-sm text-red-700">{validationMessage}</div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="text-sm font-medium text-blue-800 mb-2">💡 Tip:</div>
            <div className="text-sm text-blue-700">
              Make sure to fill in all required fields marked with an asterisk (*) in the form above. 
              This ensures we can create a complete and professional contract for you.
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              onClick={() => setShowValidationModal(false)}
            >
              I Understand
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}