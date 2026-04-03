import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { LayoutDashboard, FileText, Newspaper, LogOut, Shield, Users, Monitor, AlertTriangle } from 'lucide-react';
import logo from '../../assets/logo.png';

const SMTLayout = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        { path: '/smt', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/smt/notices', icon: FileText, label: 'Notices Board' },
        { path: '/smt/news', icon: Newspaper, label: 'Newsroom' },
        { path: '/smt/applications', icon: Users, label: 'Applications' },
        { path: '/smt/website', icon: Monitor, label: 'Website Management' },
    ];

    const handleAcceptConfidentiality = () => {
        if (session?.user?.id) {
            localStorage.setItem(`smt_confidentiality_${session.user.id}`, 'true');
            setHasAcceptedConfidentiality(true);
        }
    };

    if (session && !hasAcceptedConfidentiality) {
        return (
            <div className="fixed inset-0 z-[1000] bg-slate-900 flex items-center justify-center p-4 sm:p-8">
                <div className="absolute inset-0 bg-primary/10 noise pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className="relative bg-white max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh]"
                >
                    <div className="p-8 md:p-12 border-b border-dark/10 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-16 h-16 bg-primary flex items-center justify-center shrink-0">
                            <AlertTriangle size={32} className="text-white" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">Restricted System Access</span>
                            <h2 className="text-2xl sm:text-3xl font-display font-medium text-dark tracking-tighter uppercase">Authorized Personnel Only</h2>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 overflow-y-auto w-full space-y-10">
                        <p className="text-sm md:text-base text-dark/70 font-medium leading-relaxed">
                            You are entering the Alexandria High School Administrative Management Portal. This system contains highly sensitive, confidential, and legally protected academic and personal data belonging to learners, their guardians, and faculty members in strict compliance with the Protection of Personal Information Act (POPIA) and Department of Basic Education guidelines.
                        </p>

                        <div className="grid gap-6">
                            <div className="p-6 border border-dark/5 bg-slate-50">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-dark mb-4 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    1. Strict Data Confidentiality
                                </h3>
                                <p className="text-sm text-dark/60 leading-relaxed font-light">
                                    By accessing this database, you formally agree that any data viewed, exported, or edited within this portal—including admission records, financial statuses, medical profiles, and academic transcripts—is strictly confidential. Under no circumstances may this information be discussed, reproduced, captured via screenshot, or electronically transmitted outside of official school administration bounds.
                                </p>
                            </div>

                            <div className="p-6 border border-dark/5 bg-slate-50">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-dark mb-4 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    2. Account Security Protocols
                                </h3>
                                <p className="text-sm text-dark/60 leading-relaxed font-light">
                                    Your login credentials designate you as an authorized agent of the School Management Team. You are legally responsible for all actions logged under your name within this system. You agree to never share your password or credential tokens and to immediately log out when stepping away from public terminal screens.
                                </p>
                            </div>

                            <div className="p-6 border border-dark/5 bg-slate-50">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-dark mb-4 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    3. Audit & Surveillance
                                </h3>
                                <p className="text-sm text-dark/60 leading-relaxed font-light">
                                    As a measure of security, all structural modifications, data exports, and article publications initiated within this portal are timestamped and logged against your user identity for administrative auditing purposes by the SGB (School Governing Body).
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-dark/10 p-8 flex flex-col md:flex-row gap-6 bg-slate-50">
                        <button
                            onClick={handleLogout}
                            className="flex-1 py-5 px-8 bg-dark text-white hover:bg-black transition-colors flex items-center justify-center"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Abort Session</span>
                        </button>
                        <button
                            onClick={handleAcceptConfidentiality}
                            className="flex-[2] py-5 px-8 bg-primary text-white border border-primary hover:bg-transparent hover:text-primary transition-colors group flex items-center justify-center gap-4"
                        >
                            <Shield size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">I Acknowledge & Accept My Responsibility</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }


    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 w-full bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between z-30">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="AHS" className="w-8 h-8 object-contain" />
                    <span className="text-white font-bold text-sm tracking-wide uppercase">SMT Console</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <LayoutDashboard size={24} />
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`w-64 bg-slate-900 text-white fixed h-full z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                    <img src={logo} alt="AHS" className="w-8 h-8 object-contain" />
                    <div className="flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Alexandria High</span>
                        <span className="block text-sm font-black tracking-wide text-white">SMT Console</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-slate-400"
                    >
                        <Shield size={18} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/smt' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon size={18} className={isActive ? 'text-white' : 'group-hover:text-white'} />
                                <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 bg-slate-900">
                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Secure Session</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                            {session.user.email}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all duration-300 text-xs font-bold uppercase tracking-widest"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">
                            Developed by Senzo Dube
                        </p>
                    </div>
                </div>
            </aside>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 min-h-screen pt-20 lg:pt-0">
                <Outlet />
            </main>
        </div>
    );
};

export default SMTLayout;
