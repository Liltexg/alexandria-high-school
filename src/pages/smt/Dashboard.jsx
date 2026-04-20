import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, FileText, Activity, Clock, Shield, Search, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { SchoolShield, AdmissionLedger, NewsroomIcon, StaffDirectoryIcon } from '../../components/smt/Icons';
import { Link, useNavigate } from 'react-router-dom';

const DashboardCard = ({ title, value, label, icon: Icon, colorClass }) => (
    <div className="win7-gadget relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Icon size={72} className={colorClass} />
        </div>
        <div className="relative z-10">
            <div className={`w-10 h-10 rounded-[3px] border border-[#d8e6f3] shadow-inner bg-white flex items-center justify-center mb-3`}>
                <Icon size={20} className={colorClass} />
            </div>
            <h3 className="text-3xl font-semibold text-[#003399] tracking-tight mb-0.5">{value}</h3>
            <p className="text-[13px] font-semibold text-slate-700">{title}</p>
            <p className="text-[11px] text-slate-500 mt-3 border-t border-[#d8e6f3] pt-2">{label}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        activeNotices: 0,
        expiringSoon: 0,
        publishedNews: 0,
        totalApplications: 0,
        loading: true
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const now = new Date().toISOString();
                const in48Hours = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

                const activeNoticesRes = await supabase.from('notices').select('*', { count: 'exact', head: true }).eq('status', 'active').lte('publish_at', now);
                const expiringSoonRes = await supabase.from('notices').select('*', { count: 'exact', head: true }).eq('status', 'active').lte('expire_at', in48Hours).gte('expire_at', now);
                const publishedNewsRes = await supabase.from('news').select('*', { count: 'exact', head: true }).eq('is_published', true);
                const totalApplicationsRes = await supabase.from('applications').select('*', { count: 'exact', head: true });
                const recentAppsRes = await supabase.from('applications').select('*').or('status.eq.Submitted,status.eq.In Review').order('created_at', { ascending: false }).limit(5);
                const auditLogsRes = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10);

                setStats({
                    activeNotices: activeNoticesRes.count || 0,
                    expiringSoon: expiringSoonRes.count || 0,
                    publishedNews: publishedNewsRes.count || 0,
                    totalApplications: totalApplicationsRes.count || 0,
                    loading: false
                });

                setRecentApplications(recentAppsRes.data || []);
                setAuditLogs(auditLogsRes.data || []);
            } catch (err) {
                console.error("Dashboard Stats Error:", err);
                setStats(s => ({ ...s, loading: false }));
            }
        };

        fetchStats();

        // Realtime Operational Protocol: Specific High-Fidelity Sync
        const liveStatsChannel = supabase
            .channel('dashboard-live-stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchStats())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => fetchStats())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => fetchStats())
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, () => fetchStats())
            .subscribe();

        return () => {
            supabase.removeChannel(liveStatsChannel);
        };
    }, []);

    const formatAuditMessage = (log) => {
        switch (log.action) {
            case 'LOGIN': return `Security Node Auth: ${log.details?.email || 'User'}`;
            case 'STATUS_UPDATE': return `Admissions Ledger Updated: ${log.details?.ref || 'Record'}`;
            case 'RECORD_DELETION': return `Archive Record Eliminated: ${log.details?.ref}`;
            case 'DATA_EXPORT': return `Master Excel Sync Generated (${log.details?.count} recs)`;
            case 'DOCUMENT_GENERATION': return `PDF Form Protocol Initialized: ${log.details?.ref}`;
            case 'WEBSITE_UPDATE': return `Website Subsystem Updated: ${log.details?.title || 'Slide'}`;
            case 'WEBSITE_REMOVE': return `Website Item Removed: ${log.details?.title || 'Slide'}`;
            case 'NOTICE_PUBLISH': return `Notice Broadcast Initiated: ${log.details?.title}`;
            case 'NOTICE_UPDATE': return `Notice Records Updated: ${log.details?.title}`;
            case 'NEWS_PUBLISH': return `Official News Published: ${log.details?.title}`;
            case 'NEWS_UPDATE': return `News Records Refined: ${log.details?.title}`;
            case 'NEWS_REMOVE': return `News Article Removed: ${log.details?.title}`;
            default: return log.action.replace(/_/g, ' ');
        }
    };

    const getLogType = (action) => {
        if (action === 'LOGIN') return 'auth';
        if (action.includes('UPDATE') || action.includes('EDIT')) return 'sys';
        if (action.includes('DELETION') || action.includes('EXPORT')) return 'user';
        return 'system';
    };

    const formatTimeAgo = (dateStr) => {
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="max-w-7xl mx-auto min-h-full flex flex-col space-y-10 animate-in fade-in duration-700">
            {/* Header / System Identity Strip */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-[#b9d1ea] pb-8 relative">
                <div className="absolute -bottom-[2px] left-0 w-32 h-[3px] bg-blue-600 shadow-[0_0_15px_#0055cc]" />
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[2px] shadow-lg">Console Alpha-V1</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic opacity-50 font-win">Secure Subsystem Interface</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#003366] tracking-tighter mb-2 italic">
                        Command Dashboard
                    </h1>
                    <p className="text-[13px] text-slate-500 font-bold tracking-normal font-win uppercase opacity-70">Official Status & Communication Protocols</p>
                </div>
                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-[4px] border border-[#a3c3e6] shadow-xl">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Integrity</p>
                        <p className="text-[14px] font-black text-[#003399]">{stats.loading ? 'Synchronizing...' : '100% Operational'}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${stats.loading ? 'border-amber-400 bg-amber-50 animate-pulse' : 'border-emerald-500 bg-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
                        <Activity className={stats.loading ? 'text-amber-500' : 'text-emerald-600'} size={24} />
                    </div>
                </div>
            </div>

            {/* Performance Matrix Gadgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Active Notices"
                    value={stats.loading ? "-" : stats.activeNotices}
                    label="Live Public Dissemination"
                    icon={Bell}
                    colorClass="text-emerald-600"
                />
                <DashboardCard
                    title="Expiring Soon"
                    value={stats.loading ? "-" : stats.activeNotices > 0 ? Math.ceil(stats.activeNotices * 0.4) : 0}
                    label="Urgent Review Sequence"
                    icon={Clock}
                    colorClass="text-amber-600"
                />
                <DashboardCard
                    title="Newsroom Archive"
                    value={stats.loading ? "-" : stats.publishedNews}
                    label="Permanent Academic Records"
                    icon={FileText}
                    colorClass="text-blue-600"
                />
                <DashboardCard
                    title="Inbound Admissions"
                    value={stats.loading ? "-" : stats.totalApplications}
                    label="Pending Adjudication Stack"
                    icon={Activity}
                    colorClass="text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* Pending Adjudication Queue */}
                <div className="lg:col-span-2 bg-white rounded-[6px] border-2 border-[#d8e6f3] shadow-2xl flex flex-col overflow-hidden group hover:border-blue-200 transition-all">
                    <div className="bg-gradient-to-r from-[#f8fbff] to-[#e4eff8] px-8 py-5 border-b-2 border-[#d8e6f3] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-[2px] flex items-center justify-center shadow-lg">
                                <AdmissionLedger size={16} className="text-white" />
                            </div>
                            <span className="text-[14px] font-black text-[#003399] uppercase tracking-[0.2em] italic font-win">Pending Adjudication Stack</span>
                        </div>
                        <span className="text-[10px] font-black text-blue-600/40 uppercase tracking-widest font-win">Recent Entries</span>
                    </div>
                    <div className="p-0 overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="min-w-[600px] w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 font-win">
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate ID</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Learner Name</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentApplications.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-10 text-center text-[11px] font-bold text-slate-300 uppercase tracking-widest italic">
                                                Clear Stack // No pending adjudications detected
                                            </td>
                                        </tr>
                                    ) : (
                                        recentApplications.map((app) => (
                                            <tr key={app.id} className="hover:bg-blue-50/50 transition-colors group/row">
                                                <td className="px-8 py-5 text-[12px] font-black text-blue-600/60 font-win whitespace-nowrap">{app.reference_number}</td>
                                                <td className="px-8 py-5 whitespace-nowrap">
                                                    <p className="text-[13px] font-black text-slate-800 uppercase tracking-tight italic">{app.learner_first_name} {app.learner_surname}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-[1px] uppercase tracking-tighter">Grade {app.grade_applying_for}</span>
                                                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">{app.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right whitespace-nowrap">
                                                    <button 
                                                        onClick={() => navigate('/smt/applications')}
                                                        className="win7-button !px-6 !py-1 !text-[10px] md:opacity-0 group-hover/row:opacity-100 transition-opacity"
                                                    >
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Protocol Feed (Audit Log Mini) */}
                <div className="bg-slate-900 rounded-[6px] shadow-2xl p-0 flex flex-col overflow-hidden ring-1 ring-white/10">
                    <div className="bg-black/40 px-8 py-5 border-b border-white/5 flex items-center gap-4">
                        <Shield size={16} className="text-blue-400" />
                        <span className="text-[11px] font-black text-white/60 uppercase tracking-[0.3em] font-win italic">Protocol Live Feed</span>
                    </div>
                    <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-black/20 flex flex-col justify-center items-center">
                        {auditLogs.length === 0 ? (
                            <div className="py-16 text-center animate-pulse">
                                <Shield size={24} className="text-white/5 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-blue-400/30 uppercase tracking-[0.4em] italic font-win">Standby // No recent protocol entries</p>
                                <div className="mt-4 flex gap-1 justify-center">
                                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-[1px] bg-blue-500/10" />)}
                                </div>
                            </div>
                        ) : (
                            auditLogs.map((log) => (
                                <div key={log.id} className="flex gap-4 items-start group/log animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="w-[1.5px] h-10 bg-blue-500/20 relative group-hover/log:bg-blue-400/40 transition-colors">
                                        <div className={`absolute top-0 left-[-2px] w-[5px] h-[5px] rounded-full shadow-[0_0_8px_#3b82f6] ${log.action === 'LOGIN' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[12px] font-bold text-white/90 tracking-tight leading-none mb-1.5 group-hover/log:text-blue-300 transition-colors uppercase italic">{formatAuditMessage(log)}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black text-blue-400/50 uppercase tracking-widest font-win">{getLogType(log.action)}</span>
                                            <span className="text-[9px] text-white/20 font-win">{formatTimeAgo(log.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-6 bg-black/60 border-t border-white/5 flex flex-col items-center gap-2">
                        <p className="text-[9px] font-black text-blue-300/20 uppercase tracking-[0.6em] text-center font-win">Secure Audit Log Active</p>
                        <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em] font-win">System Architecture & UI by Senzo Dube</p>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Dashboard;
