import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    Search,
    Filter,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    MoreVertical,
    Download,
    Eye,
    MessageSquare,
    ChevronRight,
    Loader2,
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    AlertTriangle,
    ArrowUpRight,
    IdCard,
    School,
    Users as UsersIcon,
    FileSpreadsheet,
    Monitor,
    Shield,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';
import { jsPDF } from 'jspdf';
import { generateApplicationPDF } from '../../utils/generateApplicationPDF';
import { EMAIL_TEMPLATES, generateGmailLink, generateCallLink, getCallScript, copyToClipboard } from '../../utils/emailTemplates';
import { exportApplicationsToExcel } from '../../utils/excelExport';
import CustomDialog from '../../components/CustomDialog';

const STATUS_COLORS = {
    'Submitted': 'bg-slate-100 text-slate-600',
    'In Review': 'bg-blue-50 text-blue-600',
    'Accepted': 'bg-emerald-50 text-emerald-600',
    'Waitlisted': 'bg-amber-50 text-amber-600',
    'Rejected': 'bg-rose-50 text-rose-600',
    'Awaiting Documents': 'bg-purple-50 text-purple-600'
};

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedApp, setSelectedApp] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [dialog, setDialog] = useState({ isOpen: false, type: 'confirm', title: '', message: '', onConfirm: null });

    useEffect(() => {
        fetchApplications();

        // Realtime subscription
        const channel = supabase
            .channel('applications_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
                fetchApplications();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const fetchApplications = async () => {
        try {
            const { data, error } = await supabase
                .from('applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        setUpdatingStatus(true);
        try {
            const { error } = await supabase
                .from('applications')
                .update({
                    status: newStatus,
                    decision_date: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);

            // Institutional Audit Protocol
            try {
                const { data: { user } } = await supabase.auth.getUser();
                await supabase.from('audit_logs').insert([{
                    actor_id: user?.id,
                    action: 'STATUS_UPDATE',
                    resource_type: 'APPLICATION',
                    details: { 
                        ref: selectedApp?.reference_number, 
                        old: selectedApp?.status, 
                        new: newStatus,
                        learner: `${selectedApp?.learner_first_name} ${selectedApp?.learner_surname}`
                    }
                }]);
            } catch (err) {
                console.warn('Audit Sync Failed:', err);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            setDialog({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to update status',
                confirmText: 'OK',
                onConfirm: null
            });
        } finally {
            setUpdatingStatus(false);
        }
    };

    const deleteApplication = async (id) => {
        setDialog({
            isOpen: true,
            type: 'error',
            title: 'Delete Application',
            message: 'Are you sure you want to permanently delete this application? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    const { error } = await supabase
                        .from('applications')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;

                    // Archive Integrity Audit
                    try {
                        const { data: { user } } = await supabase.auth.getUser();
                        await supabase.from('audit_logs').insert([{
                            actor_id: user?.id,
                            action: 'RECORD_DELETION',
                            resource_type: 'APPLICATION',
                            details: { 
                                ref: selectedApp?.reference_number,
                                learner: `${selectedApp?.learner_first_name} ${selectedApp?.learner_surname}`
                            }
                        }]);
                    } catch (err) {
                        console.warn('Audit Sync Failed:', err);
                    }

                    setSelectedApp(null);
                    fetchApplications();

                    setDialog({
                        isOpen: true,
                        type: 'success',
                        title: 'Success',
                        message: 'Application deleted successfully',
                        confirmText: 'OK',
                        onConfirm: null
                    });
                } catch (error) {
                    console.error('Error deleting application:', error);
                    setDialog({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete application',
                        confirmText: 'OK',
                        onConfirm: null
                    });
                }
            }
        });
    };

    const handleEmailResponse = (app, templateType) => {
        const template = EMAIL_TEMPLATES[templateType];
        const subject = template.subject;
        const body = template.body(app);
        const gmailLink = generateGmailLink(app.parent_primary_email, subject, body);

        // Open Gmail compose window
        window.open(gmailLink, '_blank');

        // Prompt to log the communication
        setDialog({
            isOpen: true,
            type: 'confirm',
            title: 'Log Communication',
            message: 'Did you send the email? Click Confirm to log this communication.',
            confirmText: 'Confirm Log',
            cancelText: 'Cancel',
            onConfirm: () => logCommunication(app.id, 'email', templateType)
        });
    };

    const handleCall = (app) => {
        const phoneNumber = app.parent_primary_contact;

        // Check if mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Open phone dialer
            window.location.href = generateCallLink(phoneNumber);

            // Prompt to log the call
            setDialog({
                isOpen: true,
                type: 'phone',
                title: 'Log Call',
                message: 'Did you complete the call? Click Confirm to log this communication.',
                confirmText: 'Confirm Log',
                cancelText: 'Cancel',
                onConfirm: () => logCommunication(app.id, 'call', null)
            });
        } else {
            // Desktop: copy number
            copyToClipboard(phoneNumber).then(() => {
                setDialog({
                    isOpen: true,
                    type: 'phone',
                    title: 'Calling Applicant',
                    message: `Phone number copied: ${phoneNumber}\n\nDid you complete the call? Click Confirm to log this communication.`,
                    confirmText: 'Confirm Log',
                    cancelText: 'Cancel',
                    onConfirm: () => logCommunication(app.id, 'call', null)
                });
            });
        }
    };

    const logCommunication = async (applicationId, method, templateUsed) => {
        try {
            const { error } = await supabase
                .from('application_comms')
                .insert([{
                    application_id: applicationId,
                    method: method,
                    template_used: templateUsed,
                    smt_user_id: (await supabase.auth.getUser()).data.user?.id
                }]);

            if (error) throw error;

            // Refresh applications to show updated communication count
            fetchApplications();

            setDialog({
                isOpen: true,
                type: 'success',
                title: 'Logged',
                message: 'Communication logged successfully.',
                confirmText: 'OK',
                onConfirm: null
            });
        } catch (error) {
            console.error('Error logging communication:', error);
            setDialog({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to log communication.',
                confirmText: 'OK',
                onConfirm: null
            });
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch =
            app.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.learner_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.learner_surname.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const StatsCard = ({ title, value, color, icon: Icon }) => (
        <div className="win7-gadget flex items-center justify-between group hover:border-[#0078d7] transition-all">
            <div>
                <p className="text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity">{title}</p>
                <p className="text-3xl font-semibold text-[#003399] tracking-tight drop-shadow-sm">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-[4px] border border-[#d8e6f3] shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] bg-white/50 flex items-center justify-center ${color.replace('bg-', 'text-').replace('text-', '')}`}>
                <Icon size={24} className={color.replace('bg-', 'text-').split(' ')[1]} />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pb-20 max-w-6xl mx-auto drop-shadow-sm">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#b9d1ea] pb-4">
                <div>
                    <h1 className="text-[22px] font-semibold text-[#003399] tracking-normal mb-1 flex items-center gap-2">
                        <UsersIcon className="text-[#0055cc]" size={22} /> Enrollment Command Center
                    </h1>
                    <p className="text-[12px] text-slate-600 font-medium tracking-normal">Manage and review all online student applications.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={async () => {
                            exportApplicationsToExcel(filteredApps);
                            try {
                                const { data: { user } } = await supabase.auth.getUser();
                                await supabase.from('audit_logs').insert([{
                                    actor_id: user?.id,
                                    action: 'DATA_EXPORT',
                                    resource_type: 'EXCEL_SYNC',
                                    details: { count: filteredApps.length }
                                }]);
                            } catch (err) {}
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#ffffff] to-[#e1f5fe] border border-[#0288d1]/30 rounded-[3px] shadow-sm hover:from-[#e1f5fe] hover:to-[#b3e5fc] hover:border-[#0288d1] text-[#01579b] transition-all text-[12px] font-semibold group"
                    >
                        <FileSpreadsheet size={16} className="text-[#1d6f42] group-hover:scale-110 transition-transform" /> 
                        MS Excel "Live Sync"
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#ffffff] to-[#e5e5e5] border border-[#a0a0a0] rounded-[3px] shadow-sm hover:from-[#e5f1fb] hover:to-[#d8eaf9] hover:border-[#0078d7] text-[#333333] transition-all text-[12px] font-medium opacity-50 cursor-not-allowed">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Applications" value={applications.length} color="bg-slate-100 text-slate-600" icon={FileText} />
                <StatsCard title="New / Submitted" value={applications.filter(a => a.status === 'Submitted').length} color="bg-blue-50 text-[#0055cc]" icon={Clock} />
                <StatsCard title="Accepted" value={applications.filter(a => a.status === 'Accepted').length} color="bg-emerald-50 text-[#008040]" icon={CheckCircle} />
                <StatsCard title="Waitlisted" value={applications.filter(a => a.status === 'Waitlisted').length} color="bg-amber-50 text-[#d47800]" icon={AlertTriangle} />
            </div>

            {/* Controls & Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-gradient-to-b from-white to-[#f0f5fa] p-3 rounded-[4px] border border-[#a3c3e6] shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by Ref #, Name or Surname..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#a0a0a0] rounded-[3px] text-[13px] focus:border-[#0078d7] focus:outline-none shadow-inner"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    {['All', 'Submitted', 'In Review', 'Accepted', 'Waitlisted'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-[3px] text-[12px] font-medium transition-all ${statusFilter === status ? 'bg-[#cce8ff] border border-[#99d1ff] text-[#003399]' : 'border border-transparent text-slate-600 hover:bg-[#e5f3ff] hover:border-[#cce8ff]'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Application List */}
            <div className="win7-window overflow-hidden !rounded-[5px]">
                <div className="win7-title-bar !bg-gradient-to-b !from-[#f0f5fa] !to-[#e4edf8] !border-b !border-[#a3c3e6] !px-4 !py-2 shrink-0">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#0055cc]" />
                        <span className="text-[13px] font-semibold text-[#003399] drop-shadow-none">Application Records</span>
                    </div>
                </div>
                <div className="overflow-x-hidden md:overflow-x-auto w-full bg-white">
                    <table className="w-full text-left block md:table">
                        <thead className="hidden md:table-header-group">
                            <tr className="bg-[#f5f9ff] border-b border-[#b9d1ea] shadow-[inset_0_1px_0_white]">
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-600 border-r border-[#d8e6f3] uppercase tracking-wider">Reference / Learner</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-600 border-r border-[#d8e6f3] uppercase tracking-wider">Grade</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-600 border-r border-[#d8e6f3] uppercase tracking-wider">Date Applied</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-600 border-r border-[#d8e6f3] uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-600 text-right uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group font-medium border-t md:border-0 border-slate-100">
                            {loading ? (
                                <tr className="flex md:table-row">
                                    <td colSpan="5" className="px-4 py-16 text-center w-full block">
                                        <Loader2 className="animate-spin text-[#0055cc] inline-block mb-3" size={24} />
                                        <p className="text-slate-500 text-[12px] font-medium block">Loading Applications...</p>
                                    </td>
                                </tr>
                            ) : filteredApps.length === 0 ? (
                                <tr className="flex md:table-row">
                                    <td colSpan="5" className="px-4 py-16 text-center w-full block">
                                        <p className="text-slate-500 text-[12px] font-medium block">No applications found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map((app) => (
                                    <tr key={app.id} className="flex flex-col md:table-row hover:bg-[#cce8ff] transition-all group p-3 md:p-0 border-b border-[#d8e6f3] cursor-default">
                                        <td className="px-2 py-1 md:px-4 md:py-3 flex justify-between items-center md:table-cell md:border-r md:border-[#d8e6f3] group-hover:bg-[#cce8ff]">
                                            <span className="md:hidden text-[11px] text-slate-500 font-semibold">Learner</span>
                                            <div className="flex flex-col text-right md:text-left">
                                                <span className="text-[#0055cc] text-[11px] font-bold mb-0.5 opacity-80 group-hover:opacity-100">{app.reference_number}</span>
                                                <span className="text-slate-900 text-[13px] font-medium">{app.learner_first_name} {app.learner_surname}</span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-1 md:px-4 md:py-3 flex justify-between items-center md:table-cell md:border-r md:border-[#d8e6f3] group-hover:bg-[#cce8ff]">
                                            <span className="md:hidden text-[11px] text-slate-500 font-semibold">Grade</span>
                                            <span className="text-[13px] font-medium">{app.grade_applying_for}</span>
                                        </td>
                                        <td className="px-2 py-1 md:px-4 md:py-3 flex justify-between items-center md:table-cell text-slate-600 text-[13px] md:border-r md:border-[#d8e6f3] group-hover:bg-[#cce8ff]">
                                            <span className="md:hidden text-[11px] text-slate-500 font-semibold">Date Applied</span>
                                            <span className="font-medium">{new Date(app.created_at).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-2 py-1 md:px-4 md:py-3 flex justify-between items-center md:table-cell md:border-r md:border-[#d8e6f3] group-hover:bg-[#cce8ff]">
                                            <span className="md:hidden text-[11px] text-slate-500 font-semibold">Status</span>
                                            <span className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold uppercase border shadow-sm ${app.status === 'Accepted' ? 'bg-[#e5fbe5] text-[#008040] border-[#b3e6b3]' : app.status === 'Waitlisted' ? 'bg-[#fff5e5] text-[#d47800] border-[#ffe6b3]' : app.status === 'Rejected' ? 'bg-[#ffe5e5] text-[#cc0000] border-[#ffb3b3]' : 'bg-[#f0f5fa] text-[#003399] border-[#a3c3e6]'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-2 pt-3 md:px-4 md:py-3 flex justify-center md:justify-end md:table-cell mt-1 md:mt-0 border-t md:border-0 border-slate-100 text-right w-full md:w-auto group-hover:bg-[#cce8ff]">
                                            <button
                                                onClick={() => setSelectedApp(app)}
                                                className="win7-button !py-1 text-[11px]"
                                            >
                                                <Eye size={12} className="text-[#0055cc]" /> Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Admin Office Minimalist Workspace */}
            <AnimatePresence mode="wait">
                {selectedApp && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-[-40px] md:inset-[-56px] z-[60] bg-white flex flex-col overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.15)] rounded-lg border border-slate-200"
                    >
                        {/* Professional Top Bar */}
                        <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <img src={logo} alt="School Logo" className="h-8 grayscale opacity-50" />
                                <div className="h-6 w-px bg-slate-200 mx-2" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Administrative Office // Admissions</span>
                                    <span className="text-[14px] font-bold text-slate-800">
                                        Learner Record: {selectedApp.learner_first_name} {selectedApp.learner_surname}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Ref: {selectedApp.reference_number}</span>
                                <button 
                                    onClick={() => setSelectedApp(null)} 
                                    className="p-1 px-3 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all text-xs font-bold uppercase border border-transparent hover:border-rose-100 rounded"
                                >
                                    Close File
                                </button>
                            </div>
                        </div>

                        {/* File Tabs */}
                        <div className="h-10 bg-slate-50 border-b border-slate-200 px-6 flex items-center gap-6 shrink-0">
                            {['Overview', 'Guardian Info', 'Academic Record', 'Decision Node'].map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab === 'Decision' || tab === 'Decision Node' ? 'Decision Engine' : tab)}
                                    className={`h-full text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === (tab === 'Decision' || tab === 'Decision Node' ? 'Decision Engine' : tab) ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Main Document Body */}
                            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white">
                                <div className="max-w-3xl mx-auto">
                                    {activeTab === 'Overview' && (
                                        <div className="space-y-12">
                                            {/* Primary Identity Section */}
                                            <section className="flex gap-10 items-start">
                                                <div className="w-40 h-52 bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-slate-300">
                                                    <User size={64} />
                                                </div>
                                                <div className="flex-1">
                                                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight uppercase mb-6">{selectedApp.learner_first_name} {selectedApp.learner_surname}</h2>
                                                    <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Applying Grade</label>
                                                            <p className="text-lg font-bold text-slate-800">Grade {selectedApp.grade_applying_for}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Cycle</label>
                                                            <p className="text-lg font-bold text-slate-800">{selectedApp.intake_year}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ID Number</label>
                                                            <p className="text-lg font-bold text-slate-800">{selectedApp.id_number || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</label>
                                                            <p className={`text-sm font-bold uppercase tracking-widest px-2 py-0.5 inline-block rounded ${STATUS_COLORS[selectedApp.status]}`}>{selectedApp.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            <div className="h-px bg-slate-100 w-full" />

                                            {/* Contact Grid Section */}
                                            <section className="grid grid-cols-2 gap-12">
                                                <div className="space-y-4">
                                                    <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest pb-2 border-b border-blue-50">Residence Coordinates</h3>
                                                    <div className="space-y-1">
                                                        <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.address_street}</p>
                                                        <p className="text-sm text-slate-500 uppercase">{selectedApp.address_suburb}, {selectedApp.address_city}</p>
                                                        <p className="text-xs text-slate-400 tracking-widest uppercase">{selectedApp.address_province} {selectedApp.address_postal_code}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest pb-2 border-b border-blue-50">Demographics</h3>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-slate-400 uppercase font-bold tracking-widest">Gender</span>
                                                            <span className="text-slate-700 font-bold uppercase">{selectedApp.gender}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-slate-400 uppercase font-bold tracking-widest">Citizenship</span>
                                                            <span className="text-slate-700 font-bold uppercase">{selectedApp.citizenship}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    )}

                                    {activeTab === 'Guardian Info' && (
                                        <div className="space-y-12">
                                            {/* Primary Guardian */}
                                            <section className="space-y-6">
                                                <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest pb-2 border-b border-blue-50">Primary Custodian Profile</h3>
                                                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name & Title</label>
                                                        <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.parent_primary_title || ''} {selectedApp.parent_primary_name} {selectedApp.parent_primary_surname}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Relationship</label>
                                                        <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.parent_primary_relationship}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ID / Passport</label>
                                                        <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.parent_primary_id || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Employment</label>
                                                        <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.parent_primary_occupation || 'N/A'}</p>
                                                        <p className="text-xs text-slate-400 uppercase">{selectedApp.parent_primary_employer || ''}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Contact Relay</label>
                                                        <p className="text-md font-bold text-[#003366]">{selectedApp.parent_primary_contact}</p>
                                                        <p className="text-xs text-slate-500">{selectedApp.parent_primary_email}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Marital State</label>
                                                        <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.parent_primary_marital_status || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </section>

                                            <div className="h-px bg-slate-100 w-full" />

                                            {/* Secondary Guardian */}
                                            <section className="space-y-6">
                                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Secondary Custodian (If Applicable)</h3>
                                                {selectedApp.parent_secondary_name ? (
                                                    <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                                                            <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.parent_secondary_title || ''} {selectedApp.parent_secondary_name} {selectedApp.parent_secondary_surname}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Relationship</label>
                                                            <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.parent_secondary_relationship}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-300 italic uppercase tracking-widest">No secondary custodian record detected.</p>
                                                )}
                                            </section>
                                        </div>
                                    )}

                                    {activeTab === 'Academic Record' && (
                                        <div className="space-y-12">
                                            {/* Current Schooling */}
                                            <section className="space-y-6">
                                                <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest pb-2 border-b border-blue-50">Educational Registry History</h3>
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Previous Institution</label>
                                                        <p className="text-xl font-bold text-slate-800 uppercase tracking-tight">{selectedApp.current_school_name || 'HOME SCHOOLED / N/A'}</p>
                                                        <p className="text-xs text-slate-500 uppercase mt-1">{selectedApp.current_school_address}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-12">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Instruction Language</label>
                                                            <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.preferred_language}</p>
                                                            <p className="text-xs text-slate-400 uppercase tracking-widest">(Home: {selectedApp.home_language})</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Boarding Requirement</label>
                                                            <p className={`text-md font-bold uppercase ${selectedApp.is_boarder ? 'text-blue-600' : 'text-slate-400'}`}>{selectedApp.is_boarder ? 'PROPOSED BOARDER' : 'DAY STUDENT'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            <div className="h-px bg-slate-100 w-full" />

                                            {/* Operational Metadata */}
                                            <section className="space-y-6">
                                                <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest pb-2 border-b border-blue-50">Operational Protocol</h3>
                                                <div className="grid grid-cols-2 gap-12">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Transit Mode</label>
                                                        <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.mode_of_transport || 'NOT SPECIFIED'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Siblings in Registry</label>
                                                        <p className="text-md font-bold text-slate-800 uppercase">{selectedApp.siblings_info ? 'MATCH DETECTED' : 'SOLITARY ENTRY'}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase">{selectedApp.siblings_info || 'No sibling details provided.'}</p>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    )}

                                    {activeTab === 'Decision Engine' && (
                                        <div className="max-w-xl mx-auto py-10 space-y-10">
                                            <div className="border-b border-slate-100 pb-8">
                                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Executive Adjudication</h3>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Formal Record Update Node</p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
                                                    { label: 'ACCEPT APPLICATION', status: 'Accepted', color: 'hover:bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle },
                                                    { label: 'REJECT RECORD', status: 'Rejected', color: 'hover:bg-rose-50 text-rose-600 border-rose-100', icon: XCircle },
                                                    { label: 'WAITLIST NODE', status: 'Waitlisted', color: 'hover:bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
                                                    { label: 'FLAG AS INCOMPLETE', status: 'Awaiting Documents', color: 'hover:bg-blue-50 text-blue-600 border-blue-100', icon: FileText }
                                                ].map((action) => (
                                                    <button 
                                                        key={action.status}
                                                        onClick={() => updateStatus(selectedApp.id, action.status)}
                                                        className={`flex items-center justify-between p-4 rounded border-2 transition-all font-bold tracking-widest text-[11px] uppercase ${action.color} ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <action.icon size={18} />
                                                            <span>{action.label}</span>
                                                        </div>
                                                        <ChevronRight size={16} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Minimalist Office Sidebar */}
                            <div className="w-80 border-l border-slate-200 bg-slate-50 flex flex-col shrink-0">
                                <div className="p-8 space-y-10">
                                    <section className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block px-1">Relay Protocol</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            <button onClick={() => handleEmailResponse(selectedApp, 'accepted')} className="win7-button !justify-start !text-[11px] !h-12 !px-4 !bg-white !font-bold uppercase tracking-wide"><Mail size={16} className="text-blue-500" /> Confirm Entry</button>
                                            <button onClick={() => handleEmailResponse(selectedApp, 'rejected')} className="win7-button !justify-start !text-[11px] !h-12 !px-4 !bg-white !font-bold uppercase tracking-wide"><Mail size={16} className="text-rose-500" /> Formal Exit</button>
                                            <button onClick={() => handleEmailResponse(selectedApp, 'incomplete')} className="win7-button !justify-start !text-[11px] !h-12 !px-4 !bg-white !font-bold uppercase tracking-wide"><MessageSquare size={16} className="text-amber-500" /> Request Docs</button>
                                        </div>
                                        <button onClick={() => handleCall(selectedApp)} className="win7-button w-full !h-16 !bg-[#003366] !text-white !border-none !text-[13px] !font-bold tracking-[0.2em] uppercase gap-4 mt-4 shadow-lg active:scale-95 transition-all"><Phone size={18} /> CONTACT PARENT</button>
                                    </section>

                                    <section className="pt-10 border-t border-slate-200 space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block px-1">Institutional Storage</label>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        let signature = selectedApp.parent_signature;

                                                        // Fallback for legacy applications if the signature is missing in the primary table
                                                        if (!signature) {
                                                            const { data: drafts } = await supabase
                                                                .from('application_drafts')
                                                                .select('form_data')
                                                                .eq('email', selectedApp.parent_primary_email)
                                                                .order('updated_at', { ascending: false })
                                                                .limit(1);
                                                            signature = drafts?.[0]?.form_data?.parent_signature || '';
                                                        }

                                                        const fullAppProfile = { ...selectedApp, parent_signature: signature };
                                                        await generateApplicationPDF(fullAppProfile, selectedApp.reference_number);

                                                        const { data: { user } } = await supabase.auth.getUser();
                                                        await supabase.from('audit_logs').insert([{
                                                            actor_id: user?.id,
                                                            action: 'DOCUMENT_GENERATION',
                                                            resource_type: 'PDF_FORM',
                                                            details: { ref: selectedApp.reference_number, signature_recovered: !!signature }
                                                        }]);
                                                    } catch (err) {
                                                        console.error("PDF Compiling failed", err);
                                                    }
                                                }}
                                                className="win7-button flex-1 !justify-center gap-2 !h-14 !text-[10px] !font-bold !bg-white border-2 hover:bg-slate-50 uppercase tracking-widest"
                                            >
                                                <Download size={14} /> GENERATE PDF
                                            </button>
                                        </div>
                                        <div className="flex justify-center pt-6">
                                            <button 
                                                onClick={() => deleteApplication(selectedApp.id)}
                                                className="text-rose-400 hover:text-rose-600 text-[9px] font-bold uppercase tracking-widest transition-all hover:underline"
                                            >
                                                ELIMINATE ARCHIVE RECORD
                                            </button>
                                        </div>
                                    </section>
                                </div>

                                <div className="p-6 text-center border-t border-slate-200 mt-auto">
                                    <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.4em]">ALEXANDRIA_OFFICE_CORE_V4</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            <CustomDialog
                isOpen={dialog.isOpen}
                onClose={() => setDialog({ ...dialog, isOpen: false })}
                onConfirm={dialog.onConfirm}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
                confirmText={dialog.confirmText}
                cancelText={dialog.cancelText}
            />
        </div>
    );
};

export default Applications;
