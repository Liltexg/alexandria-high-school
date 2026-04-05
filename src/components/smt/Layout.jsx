import React, { useEffect, useState, Suspense } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { LogOut, Shield, Monitor, AlertTriangle, X, CheckCircle, FileText, Layout as LayoutIcon, Menu } from 'lucide-react';
import { InstitutionalShield, AdmissionLedger, NewsroomIcon, StaffDirectoryIcon } from './Icons';
import logo from '../../assets/logo.png';

const SMTLayout = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [hasAcceptedConfidentiality, setHasAcceptedConfidentiality] = useState(
        localStorage.getItem(`smt_confidentiality_${session?.user?.id || 'pending'}`) === 'true'
    );

    // Update state if session loads after mount
    useEffect(() => {
        if (session?.user?.id) {
            setHasAcceptedConfidentiality(localStorage.getItem(`smt_confidentiality_${session.user.id}`) === 'true');
        }
    }, [session]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/smt/login');
    };

    // Current time for the clock
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleStartMenu = (e) => {
        if (e) e.stopPropagation();
        setIsStartMenuOpen(!isStartMenuOpen);
    };

    const handleAcceptConfidentiality = () => {
        if (session?.user?.id) {
            localStorage.setItem(`smt_confidentiality_${session.user.id}`, 'true');
            setHasAcceptedConfidentiality(true);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                    Verifying Credentials...
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/smt/login" state={{ from: location }} replace />;
    }

    const navItems = [
        { path: '/smt', icon: InstitutionalShield, label: 'Dashboard' },
        { path: '/smt/notices', icon: FileText, label: 'Notices Board' },
        { path: '/smt/news', icon: NewsroomIcon, label: 'Newsroom' },
        { path: '/smt/applications', icon: AdmissionLedger, label: 'Applications' },
        { path: '/smt/website', icon: Monitor, label: 'Website Management' },
    ];

    const showDisclaimer = session && !hasAcceptedConfidentiality;

    return (
        <div className="h-screen w-full flex flex-col md:flex-row bg-[#013570] overflow-hidden antialiased font-win selection:bg-blue-600/30">
            {/* Windows 7 Style Sidebar/Taskbar */}
            <aside className="
                fixed bottom-0 left-0 w-full h-[56px] flex-row px-4 
                md:relative md:h-full md:w-[64px] md:flex-col md:py-4 md:px-0
                bg-[#1b3a6e]/95 backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/20 
                flex items-center md:items-center justify-between md:justify-start z-[100] 
                shadow-[0_-5px_20px_rgba(0,0,0,0.3)] md:shadow-[4px_0_20px_rgba(0,0,0,0.3)] select-none
            ">
                {/* Start Button */}
                <motion.button 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleStartMenu}
                    className="relative w-10 h-10 md:w-12 md:h-12 md:mb-6 group shrink-0"
                >
                    <div className="absolute inset-0 bg-blue-400 group-hover:bg-blue-300 blur-md opacity-20 group-hover:opacity-40 transition-all rounded-full" />
                    <div className="w-full h-full rounded-full border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.4)] bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 p-1 md:p-1.5 relative z-10 overflow-hidden ring-1 ring-blue-900/50">
                        <img src={logo} alt="Apex" className="w-full h-full object-contain filter drop-shadow-md brightness-110" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                    </div>
                </motion.button>

                <div className="hidden md:block w-8 h-px bg-white/10 mb-6" />

                {/* App Stack Navigation */}
                <nav className="flex-1 flex flex-row md:flex-col items-center justify-center md:justify-start gap-3 md:gap-5 w-full mx-4 md:mx-0">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/smt' && location.pathname.startsWith(item.path));
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`relative group flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-[3px] transition-all duration-300 ${
                                    isActive 
                                    ? 'bg-white/15 border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                                    : 'hover:bg-white/10 hover:border-white/10 font-bold uppercase tracking-widest'
                                }`}
                            >
                                <item.icon 
                                    size={20} 
                                    className={`transition-all duration-300 ${
                                        isActive ? 'text-white scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]' : 'text-white/60 group-hover:text-white'
                                    }`} 
                                />
                                
                                {/* Active Indicator line */}
                                {isActive && (
                                    <div className="
                                        absolute bottom-[-2px] md:bottom-auto left-2 right-2 h-[3px] md:left-[-1px] md:top-2 md:bottom-2 md:w-[3px] md:h-auto 
                                        bg-[#4db8ff] rounded-full shadow-[0_0_10px_#4db8ff]
                                    " />
                                )}

                                {/* Desktop Tooltip (Hidden on touch devices) */}
                                <div className="hidden md:group-hover:block absolute left-full ml-4 px-2.5 py-1.5 bg-white/95 text-[#003399] text-[11px] font-bold rounded-[2px] shadow-2xl opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[110] border border-blue-200">
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden md:block w-8 h-px bg-white/10 mt-auto mb-6" />
                
                {/* System Tray (Clock) */}
                <div className="flex items-center md:items-center px-1 md:px-0">
                    <div className="flex flex-col items-end md:items-center leading-none">
                        <span className="text-white font-win font-bold text-[10px] md:text-[11px] drop-shadow-sm">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                        <span className="text-white/40 font-win text-[8px] mt-0.5 tracking-tight font-bold uppercase">{currentTime.toLocaleDateString([], { day: '2-digit', month: '2-digit' })}</span>
                    </div>
                </div>
            </aside>

            {/* Desktop Workstation Canvas */}
            <div className="flex-1 flex flex-col relative overflow-hidden pb-[56px] md:pb-0" onClick={() => isStartMenuOpen && setIsStartMenuOpen(false)}>
                {/* Immersive Wallpaper */}
                <div className="absolute inset-0 bg-[#013570] z-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-400/20 via-transparent to-blue-900/50" />
                    
                    {/* Desktop Icon Grid (Responsive) */}
                    <div className="absolute top-4 left-4 right-4 md:top-10 md:left-10 grid grid-flow-row grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-8 select-none">
                        {navItems.map((item) => (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className="group flex flex-col items-center justify-center p-2 rounded-[3px] border border-transparent hover:bg-white/10 hover:border-white/20 transition-all w-20 h-20 sm:w-24 sm:h-24"
                            >
                                <div className="relative mb-1 sm:mb-2">
                                    <div className="absolute inset-0 bg-blue-400/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full scale-150" />
                                    <item.icon size={32} className="sm:size-[44px] text-white drop-shadow-lg relative z-10 group-active:scale-95 transition-all" />
                                </div>
                                <span className="text-[10px] sm:text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center line-clamp-2 px-1 py-0.5 group-hover:bg-blue-600/60 rounded-[1px] transition-colors leading-tight">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Application Frame */}
                <main className="flex-1 flex flex-col relative z-20 overflow-hidden">
                    <AnimatePresence>
                        {showDisclaimer && (
                            <div className="fixed inset-0 z-[200] bg-[#1b3a6e]/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 pointer-events-auto">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                    className="bg-white max-w-4xl w-full border border-white/50 shadow-[0_50px_100px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-hidden rounded-[4px]"
                                >
                                    <div className="win7-title-bar shrink-0 h-10 border-b border-slate-200 !bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <Shield className="text-blue-700" size={16} />
                                            <span className="text-[12px] font-bold text-slate-700 tracking-tight">Security Protocol</span>
                                        </div>
                                    </div>

                                    <div className="p-6 sm:p-10 md:p-14 overflow-y-auto custom-scrollbar bg-white">
                                        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10 mb-8 sm:mb-12 border-b border-slate-100 pb-8 sm:pb-10">
                                            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ring-4 ring-blue-50">
                                                <Shield size={32} className="sm:size-[48px] text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl sm:text-2xl font-bold text-[#003399] tracking-tight mb-2 sm:mb-3">Professional Environment</h2>
                                                <p className="text-[12px] sm:text-[14px] text-slate-600 leading-relaxed font-medium">
                                                    You are entering the Alexandria High School Administrative Core. This workstation handles confidential institutional data protected by international privacy standards.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
                                            <div className="p-4 sm:p-6 bg-blue-50/50 border border-blue-100 rounded-lg">
                                                <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-2 sm:mb-4">Confidentiality</h3>
                                                <p className="text-[12px] sm:text-[13px] text-slate-700 leading-relaxed">
                                                    Data processed herein is strictly confidential. Any unauthorized extraction is subject to disciplinary action.
                                                </p>
                                            </div>
                                            <div className="p-4 sm:p-6 bg-blue-50/50 border border-blue-100 rounded-lg">
                                                <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-2 sm:mb-4">Auditing Active</h3>
                                                <p className="text-[12px] sm:text-[13px] text-slate-700 leading-relaxed">
                                                    All actions are cryptographically logged. Protocol ensures data integrity across the school network.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 sm:p-10 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-600 hover:bg-slate-200 transition-colors rounded-[3px] text-[11px] sm:text-[12px] font-bold uppercase tracking-wider"
                                        >
                                            Exit Session
                                        </button>
                                        <button
                                            onClick={handleAcceptConfidentiality}
                                            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-b from-blue-500 to-blue-700 text-white border border-blue-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-110 active:scale-95 transition-all rounded-[3px] text-[11px] sm:text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                                        >
                                            Accept & Initialise <CheckCircle size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Window Module Content */}
                    <div className="flex-1 flex flex-col bg-white h-full w-full relative">
                        {/* Title Strip */}
                        <div className="win7-title-bar shrink-0 h-9 !bg-gradient-to-r !from-[#daecfc] !via-[#c0dbf7] !to-[#daecfc] !border-b !border-[#99b9db] px-4">
                            <div className="flex items-center gap-3 w-full">
                                <img src={logo} alt="" className="w-5 h-5 object-contain" />
                                <span className="text-[12px] sm:text-[13px] font-bold text-[#003366] tracking-tight truncate drop-shadow-sm flex-1">
                                    SMT Platform | {navItems.find(i => i.path === location.pathname || (i.path !== '/smt' && location.pathname.startsWith(i.path)))?.label || 'Console'}
                                </span>
                            </div>
                        </div>
                        
                        {/* Application Workspace */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-14 custom-scrollbar bg-white relative">
                            <Suspense fallback={
                                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                                        <Monitor className="text-blue-600 relative animate-pulse" size={48} />
                                    </div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.4em] font-win text-[#003399]/40 italic">Syncing Cloud Subsystems...</p>
                                </div>
                            }>
                                <Outlet />
                            </Suspense>
                        </div>

                        {/* Status Strip */}
                        <div className="h-7 bg-[#f0f0f0] border-t border-[#dfdfdf] px-4 flex items-center justify-between text-[9px] sm:text-[10px] text-[#003399]/60 font-bold uppercase tracking-widest shrink-0">
                            <div className="flex items-center gap-3 sm:gap-6 truncate">
                                <span className="flex items-center gap-1 sm:gap-2 font-black"><Shield size={10} className="text-[#008040]" /> SECURE</span>
                                <span className="opacity-30">|</span>
                                <span className="truncate max-w-[120px] sm:max-w-none">{session.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                                <span className="hidden xs:inline opacity-50 font-black">EST. 1960</span>
                                <span className="text-slate-400">v1.2.5</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Start Hub (Mobile Optimized) */}
                <AnimatePresence>
                    {isStartMenuOpen && (
                        <div className="fixed inset-0 z-[150] flex flex-col items-center justify-end md:justify-start pointer-events-none">
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                onClick={() => setIsStartMenuOpen(false)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-auto"
                            />
                            <motion.div
                                initial={{ y: 50, scale: 0.95, opacity: 0 }}
                                animate={{ y: 0, scale: 1, opacity: 1 }}
                                exit={{ y: 50, scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                                className="
                                    relative bottom-[72px] md:bottom-auto md:absolute md:top-4 md:left-[76px] 
                                    w-[calc(100%-32px)] md:w-[460px] bg-gradient-to-br from-[#f8fbff] to-[#dae9f8] 
                                    border border-white shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col 
                                    pointer-events-auto rounded-[6px] overflow-hidden mx-4 md:mx-0
                                "
                            >
                                {/* Start Hub Header */}
                                <div className="h-16 md:h-20 bg-gradient-to-r from-[#1b3a6e] to-[#274f8c] px-6 md:px-8 flex items-center justify-between border-b border-white/20">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 overflow-hidden bg-white/10 ring-4 ring-white/10 rotate-3">
                                            <img src="https://ui-avatars.com/api/?name=Admin&background=003399&color=fff" alt="" className="w-full h-full scale-110" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-widest opacity-80 truncate font-win italic">Apex Administrator</p>
                                            <p className="text-[13px] md:text-[15px] font-bold text-white truncate max-w-[140px] md:max-w-[200px] drop-shadow-md">{session.user.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="h-10 px-4 md:h-auto md:px-6 md:py-2.5 bg-red-600/20 hover:bg-red-600 border border-red-500/50 rounded-[3px] text-[10px] md:text-[11px] font-black text-white transition-all uppercase tracking-widest"
                                    >
                                        Exit
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row h-auto max-h-[60vh] md:h-[450px]">
                                    {/* App Lists */}
                                    <div className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2 italic font-win">Institutional Controls</p>
                                        <div className="grid grid-cols-1 gap-1">
                                            {navItems.map((item) => (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setIsStartMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 rounded-[3px] hover:bg-blue-50 group transition-all border border-transparent hover:border-blue-100"
                                                >
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[4px] bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                                        <item.icon size={18} className="text-[#1b3a6e] group-hover:scale-110 transition-transform" />
                                                    </div>
                                                    <span className="text-[13px] sm:text-[14px] font-bold text-slate-700 tracking-tight">{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    {/* System Links (Sidebar) */}
                                    <div className="w-full sm:w-44 bg-gradient-to-b from-[#e8f1f9] to-[#cbe4f6] border-t sm:border-t-0 sm:border-l border-white/50 p-4 sm:p-6 space-y-4 sm:space-y-6">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Operations</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-4">
                                                <button className="flex items-center gap-3 text-[12px] sm:text-[13px] font-bold text-slate-700"><Shield size={14} className="opacity-40" /> Security</button>
                                                <button className="flex items-center gap-3 text-[12px] sm:text-[13px] font-bold text-slate-700"><StaffDirectoryIcon size={14} className="opacity-40" /> Archive</button>
                                                <button className="flex items-center gap-3 text-[12px] sm:text-[13px] font-bold text-slate-700"><FileText size={14} className="opacity-40" /> Logs</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-10 bg-[#e8f1f9] border-t border-white/50 px-6 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500/40" />
                                        <div className="w-2 h-2 rounded-full bg-blue-500/20" />
                                    </div>
                                    <p className="text-[9px] font-black text-[#1b3a6e]/40 uppercase tracking-[0.4em] font-win italic">Apex Subsystem v1.2.5</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SMTLayout;
