import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFamily } from "../../context/FamilyContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  HeartPulse,
  BarChart3,
  ChevronDown,
  KeyRound,
  Brain,
  Users,
  Check,
  Activity,
  Plus
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { familyMembers, selectedFamilyMember, selectMember } = useFamily();

  const isActive = (path) => location.pathname === path;

  const navigation = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/ai-assistant", label: "AI Assistant", icon: Brain },
    { to: "/timeline", label: "Timeline", icon: BarChart3 },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <div className="contents">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-emerald-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 mr-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-all border border-slate-100 hover:border-emerald-100 relative overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{
                  rotate: isMobileMenuOpen ? 180 : 0,
                  scale: isMobileMenuOpen ? 0.9 : 1,
                }}
                transition={{ type: "spring", damping: 15, stiffness: 400 }}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </button>

            {/* Logo*/}
            <div className="flex items-center gap-3">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg  group-hover:scale-105 transition-all">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-800 tracking-tight leading-none">
                    HealthBuddy
                  </span>
                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">Your Smart Friend for Health</span>
                </div>
              </NavLink>
            </div>

            <div className="flex flex-1 justify-between items-center ml-4 lg:ml-0">
              {/* Center: Navigation Links */}
              <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center px-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 group ${isActive(item.to)
                        ? "bg-emerald-600 text-white shadow-md "
                        : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                    >
                      <Icon size={14} className={`${isActive(item.to) ? "text-white" : "text-slate-400 group-hover:text-emerald-500"
                        }`} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>

              {/* Right Side: Quick Action Buttons + Profile */}
              <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                <div className="hidden lg:flex items-center gap-3 border-r border-slate-100 pr-4">
                  <NavLink
                    to="/upload-report"
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 rounded-xl transition-all duration-300 group"
                  >
                    <FileText size={16} className="text-slate-400 group-hover:text-emerald-500" />
                    <p className="text-[9px] font-black uppercase tracking-widest">Report</p>
                  </NavLink>

                  <NavLink
                    to="/add-vitals"
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-300 shadow-md "
                  >
                    <Activity size={16} />
                    <p className="text-[9px] font-black uppercase tracking-widest">Vitals</p>
                  </NavLink>
                </div>

                {/* Profile Wrapper */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-3 p-1 rounded-xl hover:bg-emerald-50 transition-all duration-300 group"
                  >
                    <div className="w-9 h-9 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg  group-hover:scale-105 transition-all">
                      {(selectedFamilyMember?.name || user?.name)?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="hidden xl:flex flex-col items-start mr-1">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none">{selectedFamilyMember?.name || user?.name}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{selectedFamilyMember ? selectedFamilyMember.relation : 'Primary'}</span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${isProfileMenuOpen ? "rotate-180" : ""
                      }`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-emerald-50 border-t-emerald-100 py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                      <div className="px-5 py-4 border-b border-slate-50">
                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{user?.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 truncate mt-0.5">{user?.email}</p>
                      </div>

                      <div className="px-2 py-2 border-b border-slate-50 bg-slate-50/50">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-3">Quick Profile Switch</p>
                        <button
                          onClick={() => { selectMember(null); setIsProfileMenuOpen(false); }}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-1 ${!selectedFamilyMember ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                        >
                          <span>Primary (Me)</span>
                          {!selectedFamilyMember && <Check size={12} />}
                        </button>

                        {familyMembers.map(member => (
                          <button
                            key={member._id}
                            onClick={() => { selectMember(member._id); setIsProfileMenuOpen(false); }}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-1 ${selectedFamilyMember?._id === member._id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                          >
                            <span className="truncate">{member.name}</span>
                            {selectedFamilyMember?._id === member._id && <Check size={12} />}
                          </button>
                        ))}
                      </div>

                      {/* Manage Links - Hidden on Mobile to prevent duplication */}
                      <div className="hidden lg:block">
                        <div className="p-1 space-y-0.5">
                          <NavLink
                            to="/family"
                            className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Users size={15} />
                            Manage Family
                          </NavLink>

                          <NavLink
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <User size={16} />
                            My Profile
                          </NavLink>
                        </div>

                        <div className="border-t border-slate-50 mt-1 pt-1 p-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileMenuOpen(false);
                              navigate('/auth');
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest cursor-pointer text-red-500 hover:bg-red-50 w-full text-left rounded-xl transition-colors"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="contents">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-800/30 z-[55]"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[60] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="relative p-6 pb-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg ">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-slate-800 tracking-tight uppercase">HealthBuddy</span>
                    <span className="block text-[7px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-1">Clinical Command</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
                {/* 1. Main Navigation */}
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 ml-1">Platform</p>
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.to);
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${active
                          ? "bg-emerald-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                          }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon size={20} className={active ? "text-white" : "text-slate-400"} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>

                {/* 2. Quick Actions Timeline */}
                <div className="relative pl-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 ml-1">Quick Entries</p>

                  <div className="space-y-8">
                    {/* Entry 1 */}
                    <NavLink
                      to="/upload-report"
                      className="relative flex items-center gap-4 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex-1 p-4 bg-slate-50/50 rounded-2xl border border-transparent group-hover:border-emerald-100 group-hover:bg-white transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Upload Report</span>
                          <FileText size={14} className="text-slate-400 group-hover:text-emerald-500" />
                        </div>
                      </div>
                    </NavLink>

                    {/* Entry 2 */}
                    <NavLink
                      to="/add-vitals"
                      className="relative flex items-center gap-4 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex-1 p-4 bg-slate-50/50 rounded-2xl border border-transparent group-hover:border-emerald-100 group-hover:bg-white transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Add Vitals</span>
                          <Activity size={14} className="text-slate-400 group-hover:text-emerald-500" />
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>

                {/* 3. Account Settings (Moved from Dropdown for Mobile) */}
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Settings</p>
                  <div className="grid grid-cols-1 gap-2">
                    <NavLink
                      to="/family"
                      className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl transition-all hover:bg-emerald-50 hover:border-emerald-100 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-emerald-600 shadow-sm">
                        <Users size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Manage Family</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Control access & members</p>
                      </div>
                    </NavLink>

                    <NavLink
                      to="/profile"
                      className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl transition-all hover:bg-emerald-50 hover:border-emerald-100 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-emerald-600 shadow-sm">
                        <User size={15} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">My Profile</p>
                      </div>
                    </NavLink>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      navigate('/auth');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-red-100 active:scale-95"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
