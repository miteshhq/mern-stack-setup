import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const Sidebar = ({ isOpen, onToggle, navigationLinks, config }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [hoverSubmenu, setHoverSubmenu] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 768;
      setIsMobile(isMobileNow);

      // Close submenu when switching to mobile
      if (isMobileNow) {
        setOpenSubmenu(null);
        setHoverSubmenu(null);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Close submenu when clicking outside
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".submenu-container") &&
        !event.target.closest(".menu-item")
      ) {
        setOpenSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActiveLink = (href) => {
    return location.pathname === href;
  };

  const isParentActive = (item) => {
    if (!item.subItems) return false;
    return item.subItems.some((subItem) => location.pathname === subItem.href);
  };

  const handleMainItemClick = (item, e) => {
    if (item.subItems && item.subItems.length > 0) {
      e.preventDefault();

      // On mobile, handle click-based submenu
      if (isMobile) {
        if (!isOpen) {
          onToggle();
          setTimeout(() => {
            setOpenSubmenu(item.name);
          }, 100);
        } else {
          setOpenSubmenu(openSubmenu === item.name ? null : item.name);
        }
      } else {
        // On desktop, handle click for expanded sidebar or navigation for collapsed
        if (isOpen) {
          setOpenSubmenu(openSubmenu === item.name ? null : item.name);
        }
      }
    } else {
      setOpenSubmenu(null);
      if (isMobile) onToggle();
    }
  };

  const handleSubitemClick = () => {
    setOpenSubmenu(null);
    setHoverSubmenu(null);
    if (isMobile) onToggle();
  };

  const handleMouseEnter = (item) => {
    if (!isMobile && !isOpen && item.subItems) {
      setHoverSubmenu(item.name);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isOpen) {
      setHoverSubmenu(null);
    }
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const active = isActiveLink(item.href) || isParentActive(item);
    const hasSubitems = item.subItems && item.subItems.length > 0;
    const isSubmenuOpen = openSubmenu === item.name;
    const isHovered = hoverSubmenu === item.name;

    const buttonContent = (
      <>
        {/* Active background glow */}
        {active && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-yellow-300/10 to-transparent rounded-xl"></div>
        )}

        <Icon
          className={`relative flex-shrink-0 w-5 h-5 transition-all duration-300 ${
            active
              ? "text-yellow-400 scale-110"
              : "text-blue-200/80 group-hover:text-yellow-400 group-hover:scale-110"
          }`}
        />

        {isOpen && (
          <span className="relative ml-3 transition-all duration-300 truncate">
            {item.name}
          </span>
        )}

        {/* Submenu indicator */}
        {isOpen && hasSubitems && (
          <ChevronDown
            className={`ml-auto w-4 h-4 transition-transform duration-300 ${
              isSubmenuOpen ? "rotate-180" : ""
            }`}
          />
        )}

        {/* Collapsed state submenu indicator */}
        {!isOpen && hasSubitems && (
          <div className="absolute -right-1 -top-1 w-2 h-2 bg-yellow-400/80 rounded-full"></div>
        )}

        {/* Active indicator */}
        {active && isOpen && !hasSubitems && (
          <div className="relative ml-auto w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse"></div>
        )}

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/5 via-transparent to-transparent transition-opacity duration-300"></div>
      </>
    );

    const buttonClasses = `group relative flex items-center w-full px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out ${
      active
        ? "bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 text-yellow-400 border border-yellow-400/30 shadow-lg shadow-yellow-400/10"
        : "text-blue-100/90 hover:bg-white/15 hover:text-white hover:shadow-lg hover:shadow-blue-500/10"
    }`;

    const itemElement = hasSubitems ? (
      <button
        onClick={(e) => handleMainItemClick(item, e)}
        onMouseEnter={() => handleMouseEnter(item)}
        onMouseLeave={handleMouseLeave}
        className={buttonClasses}
      >
        {buttonContent}
      </button>
    ) : (
      <Link
        to={item.href}
        onClick={(e) => handleMainItemClick(item, e)}
        className={buttonClasses}
      >
        {buttonContent}
      </Link>
    );

    return (
      <div className="submenu-container">
        {itemElement}

        {/* Desktop collapsed sidebar hover submenu */}
        {!isMobile && !isOpen && isHovered && item.subItems && (
          <div className="absolute left-full top-20 ml-2 w-48 bg-gradient-to-b from-blue-700/95 to-indigo-600/95 backdrop-blur-xl shadow-2xl border border-white/20 rounded-xl overflow-hidden z-[70] transition-all duration-200 animate-in slide-in-from-left-2">
            <div className="p-1 space-y-1">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.name}
                  to={subItem.href}
                  onClick={handleSubitemClick}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                    isActiveLink(subItem.href)
                      ? "bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 text-yellow-400"
                      : "text-blue-100/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {subItem.name}
                  {isActiveLink(subItem.href) && (
                    <div className="ml-2 inline-block w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Desktop expanded sidebar inline submenu */}
        {!isMobile && isOpen && isSubmenuOpen && item.subItems && (
          <div className="mt-2 ml-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                onClick={handleSubitemClick}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActiveLink(subItem.href)
                    ? "bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 text-yellow-400 border-l-2 border-yellow-400"
                    : "text-blue-100/80 hover:bg-white/10 hover:text-white border-l-2 border-white/20 hover:border-white/40"
                }`}
              >
                {subItem.name}
                {isActiveLink(subItem.href) && (
                  <div className="ml-2 inline-block w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile inline submenu */}
        {isMobile && isOpen && isSubmenuOpen && item.subItems && (
          <div className="mt-2 ml-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                onClick={handleSubitemClick}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActiveLink(subItem.href)
                    ? "bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 text-yellow-400 border-l-2 border-yellow-400"
                    : "text-blue-100/80 hover:bg-white/10 hover:text-white border-l-2 border-white/20 hover:border-white/40"
                }`}
              >
                {subItem.name}
                {isActiveLink(subItem.href) && (
                  <div className="ml-2 inline-block w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed left-0 md:left-4 top-16 md:top-24 h-[calc(100vh-4rem)] md:h-[calc(100vh-7rem)] bg-gradient-to-b from-blue-700/90 via-blue-600/90 to-indigo-500/90 backdrop-blur-xl shadow-2xl border border-white/20 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : isMobile ? "w-16" : "w-16"
        } ${isMobile ? "rounded-r-2xl" : "rounded-2xl"} ${
          isMobile && !isOpen
            ? "-translate-x-full opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 rounded-2xl"></div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className={`absolute top-20 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:shadow-xl transition-all duration-300 hover:scale-110 z-10 group ${
            isMobile ? (isOpen ? "-right-3" : "right-4") : "-right-3"
          }`}
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-blue-900 transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <ChevronRight className="w-4 h-4 text-blue-900 transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>

        {/* Sidebar Content */}
        <div className="relative flex flex-col h-full">
          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navigationLinks.map((item) => (
              <div key={item.name} className="menu-item">
                {renderMenuItem(item)}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20 bg-white/5 rounded-b-2xl">
            {isOpen && (
              <div className="transition-all duration-300">
                <p className="text-xs text-blue-200/80 text-center">
                  © {new Date().getFullYear()} {config?.systemName || "System"}
                </p>
                <p className="text-xs text-blue-300/60 text-center mt-1">
                  {config?.tagline || "Dashboard"}
                </p>
              </div>
            )}

            {/* Collapsed state indicator */}
            {!isOpen && (
              <div className="flex justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-400/30">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
