import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  UserPlus,
  Users,
  Wallet,
  BarChart3,
  User as NavUser,
  HelpCircle,
} from "lucide-react";
import { CONFIG } from "../constants";

const navbarLinks = [
  { name: "My Profile", href: "/user/profile", icon: NavUser },
  { name: "Support", href: "/user/support", icon: HelpCircle },
];

const sidebarLinks = [
  {
    name: "Play",
    href: "/user/play",
    icon: Home,
  },
  {
    name: "Wallet",
    icon: Wallet,
    subItems: [
      { name: "Settings", href: "/user/wallet/settings" },
      { name: "Withdrawals", href: "/user/wallet/withdrawals" },
      { name: "Transactions", href: "/user/wallet/transactions" },
      { name: "Payout History", href: "/user/wallet/payout-history" },
    ],
  },
];

const User = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 768;
      setIsMobile(isMobileNow);

      // Set initial sidebar state based on screen size
      if (isMobileNow) {
        setSidebarOpen(false); // Closed by default on mobile
      } else {
        setSidebarOpen(true); // Open by default on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Make toggle function globally available for navbar
    window.toggleSidebar = toggleSidebar;

    return () => {
      window.removeEventListener("resize", checkMobile);
      delete window.toggleSidebar;
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-x-hidden">
      <Navbar
        toggleSidebar={toggleSidebar}
        navigationLinks={navbarLinks}
        config={config}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        navigationLinks={sidebarLinks}
        config={config}
      />

      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <main
        className={`transition-all duration-300 ease-in-out ${
          isMobile
            ? "pt-16 px-4 sm:px-6"
            : `pt-20 md:pt-24 px-4 sm:px-6 lg:px-8 ${
                sidebarOpen ? "ml-64" : "ml-16"
              }`
        }`}
      >
        <div
          className={`py-6 md:py-8 max-w-full ${
            !isMobile && sidebarOpen ? "max-w-[calc(100vw-16rem)]" : ""
          }`}
        >
          <Routes>{/* <Route path="play" element={<Play />} /> */}</Routes>
        </div>
      </main>
    </div>
  );
};

export default User;
