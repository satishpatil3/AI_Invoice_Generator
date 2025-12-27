import { useState, useEffect } from "react";
import {
  Briefcase,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropDown";
import { NAVIGATION_MENU } from "../../utils/data";

const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-blue-50 text-blue-900 shadow-sm shadow-blue-50"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive ? "text-blue-900" : "text-gray-500"
        }`}
      />
      {!isCollapsed && (
        <span className="ml-3 truncate">{item.name}</span>
      )}
    </button>
  );
};


const DashboardLayout = ({children,activeMenu}) => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarCollapsed = !isMobile && false;

  return (
      <div className="flex h-screen bg-gray-50">
      {/* ================= Sidebar ================= */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300
        ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
        ${sidebarCollapsed ? "w-16" : "w-64"}
        bg-white border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-900 to-blue-700">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-gray-900">
                AI Invoice App
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 p-4">


          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={handleNavigation}
              isCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={logout}
            className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium
                       text-gray-600 transition-all duration-200
                       hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5 text-gray-500" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* ================= Mobile Overlay ================= */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= Main Content ================= */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300
        ${isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"}`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between
                           border-b border-gray-200 bg-white/80 px-6 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="rounded-xl p-2 transition-colors duration-200 hover:bg-gray-100"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button>
            )}

            <div>
              <h1 className="text-base font-semibold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="hidden text-sm text-gray-500 sm:block">
                Here's your invoice overview.
              </p>
            </div>
          </div>

          {/* Right side (profile dropdown, actions) */}
          <div className="flex items-center space-x-3">
            {/* <ProfileDropdown /> */}
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              avatar={user?.avatar || ""}
              companyName={user?.name || ""}
              email={user?.email || ""}
              onLogout={logout}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
