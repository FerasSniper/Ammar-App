// app/dashboard/page.tsx
"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Trash2,
  RefreshCw,
  Users,
  BarChart3,
  Settings,
  FileText,
  LogOut,
  Upload,
  Menu,
  X,
} from "lucide-react";

interface Person {
  id: string;
  name: string;
  mobile: string;
  email: string;
  registeredAt: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export default function Dashboard() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName] = useState("Ammar Nasser");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample data
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Ahmed Al‑Rashid",  mobile: "+966501234567", email: "ahmed@example.com",  registeredAt: "2025‑01‑15" },
    { id: "2", name: "Sara Al‑Mahmoud",  mobile: "+966502345678", email: "sara@example.com",   registeredAt: "2025‑01‑14" },
    { id: "3", name: "Mohammed Al‑Zahra",mobile: "+966503456789", email: "mohammed@example.com",registeredAt: "2025‑01‑13" },
    { id: "4", name: "Fatima Al‑Khalil", mobile: "+966504567890", email: "fatima@example.com", registeredAt: "2025‑01‑12" },
    { id: "5", name: "Omar Al‑Fahd",    mobile: "+966505678901", email: "omar@example.com",    registeredAt: "2025‑01‑11" },
  ]);

  const navigationItems: NavigationItem[] = [
    { id: "dashboard", label: "New Requests", icon: <BarChart3  className="w-5 h-5" />, href: "/dashboard" },
    { id: "Register"    , label: "Register"    , icon: <Users      className="w-5 h-5" />, href: "/Register"     },
    { id: "Orders"      , label: "Orders"      , icon: <FileText   className="w-5 h-5" />, href: "/Orders"       },
    { id: "Te-Settings"    , label: "Settings"    , icon: <Settings   className="w-5 h-5" />, href: "/Te-Settings"     },
  ];

  const filteredPeople = people.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mobile.includes(searchTerm)
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setUserImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredPeople.map(p => p.id);
    setSelectedItems(prev =>
      prev.length === allIds.length ? [] : allIds
    );
  };

  const handleRemoveSelected = () => {
    setPeople(prev => prev.filter(p => !selectedItems.includes(p.id)));
    setSelectedItems([]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
                {userImage
                  ? <img src={userImage} className="w-full h-full object-cover" alt="User avatar" />
                  : <span className="text-white text-2xl font-bold">{userName[0]}</span>
                }
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
      </aside>

      {/* Main area */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {navigationItems.find(i => i.href === pathname)?.label || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or mobile..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              {/* Remove */}
              <button
                onClick={handleRemoveSelected}
                disabled={!selectedItems.length}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                  ${selectedItems.length
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove ({selectedItems.length})</span>
              </button>
              {/* Refresh */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Registered People</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredPeople.length && filteredPeople.length > 0}
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
                    {["Select","Name","Mobile","Email","Registered"].map(title => (
                      <th
                        key={title}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPeople.map(person => (
                    <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(person.id)}
                          onChange={() => handleSelectItem(person.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{person.name[0]}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{person.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{person.mobile}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{person.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{person.registeredAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Empty State */}
            {filteredPeople.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto w-12 h-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No people found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Get started by adding new people to your system"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}