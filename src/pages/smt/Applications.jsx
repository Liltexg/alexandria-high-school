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
    School
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { generateApplicationPDF } from '../../utils/generateApplicationPDF';
import { EMAIL_TEMPLATES, generateGmailLink, generateCallLink, getCallScript, copyToClipboard } from '../../utils/emailTemplates';
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
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
                <p className="text-2xl font-display font-black text-slate-900">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} />
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-black text-slate-900 uppercase">Enrollment Command Center</h1>
                    <p className="text-slate-500 font-medium">Manage and review all online student applications.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-xl shadow-slate-200">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Total Applications" value={applications.length} color="bg-slate-100 text-slate-600" icon={FileText} />
                <StatsCard title="New / Submitted" value={applications.filter(a => a.status === 'Submitted').length} color="bg-blue-50 text-blue-600" icon={Clock} />
                <StatsCard title="Accepted" value={applications.filter(a => a.status === 'Accepted').length} color="bg-emerald-50 text-emerald-600" icon={CheckCircle} />
                <StatsCard title="Waitlisted" value={applications.filter(a => a.status === 'Waitlisted').length} color="bg-amber-50 text-amber-600" icon={AlertTriangle} />
            </div>

            {/* Controls & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Ref #, Name or Surname..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:border-primary focus:outline-none font-bold"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100">
                    {['All', 'Submitted', 'In Review', 'Accepted', 'Waitlisted'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Application List */}
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Reference / Learner</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Grade</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date Applied</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <Loader2 className="animate-spin text-primary inline-block mb-4" size={32} />
                                        <p className="text-slate-400 uppercase text-[10px] font-black">Loading Applications...</p>
                                    </td>
                                </tr>
                            ) : filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <p className="text-slate-400 uppercase text-[10px] font-black">No applications found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-primary text-[10px] font-black uppercase tracking-wider mb-1">{app.reference_number}</span>
                                                <span className="text-slate-900 font-black uppercase italic tracking-tight">{app.learner_first_name} {app.learner_surname}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase">{app.grade_applying_for}</span>
                                        </td>
                                        <td className="px-6 py-6 text-slate-400 text-xs">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widst ${STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button
                                                onClick={() => setSelectedApp(app)}
                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary hover:text-white transition-all group-hover:shadow-lg"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Review Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedApp(null)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 flex items-center justify-between border-b-4 border-primary">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                                        <FileText className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Application Review</h2>
                                        <p className="text-sm text-slate-300 font-medium">{selectedApp.reference_number}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <div className="flex flex-1 overflow-hidden">
                                {/* Main Content */}
                                <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                                    {/* Applicant Info Card */}
                                    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-1">
                                                    {selectedApp.learner_first_name} {selectedApp.learner_surname}
                                                </h3>
                                                <p className="text-sm text-slate-500 font-medium">Applying for {selectedApp.grade_applying_for} • {selectedApp.intake_year}</p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${STATUS_COLORS[selectedApp.status]}`}>
                                                {selectedApp.status}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">ID Number</p>
                                                <p className="text-sm font-bold text-slate-900">{selectedApp.id_number}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Date of Birth</p>
                                                <p className="text-sm font-bold text-slate-900">{selectedApp.date_of_birth}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Gender</p>
                                                <p className="text-sm font-bold text-slate-900">{selectedApp.gender}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                                            Guardian Contact Information
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium mb-1">Primary Guardian</p>
                                                    <p className="text-sm font-bold text-slate-900">{selectedApp.parent_primary_name}</p>
                                                    <p className="text-xs text-slate-500">({selectedApp.parent_primary_relationship})</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium mb-1">Contact Number</p>
                                                    <p className="text-sm font-bold text-slate-900">{selectedApp.parent_primary_contact}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Email Address</p>
                                                <p className="text-sm font-bold text-primary">{selectedApp.parent_primary_email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                                            Residential Address
                                        </h4>
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                            {selectedApp.address_street}<br />
                                            {selectedApp.address_suburb}, {selectedApp.address_city}<br />
                                            {selectedApp.address_postal_code}, {selectedApp.address_province}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Emergency Contact</p>
                                            <p className="text-sm font-bold text-slate-900">
                                                {selectedApp.emergency_contact_name} • {selectedApp.emergency_contact_number}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Academic Background */}
                                    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                                            Current School Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">School Name</p>
                                                <p className="text-sm font-bold text-slate-900">{selectedApp.current_school_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Current Grade</p>
                                                <p className="text-sm font-bold text-slate-900">{selectedApp.current_grade}</p>
                                            </div>
                                        </div>
                                        {selectedApp.reason_for_transfer && (
                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <p className="text-xs text-slate-500 font-medium mb-1">Reason for Transfer</p>
                                                <p className="text-sm text-slate-700">{selectedApp.reason_for_transfer}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Supporting Documents Notice */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <div className="flex items-start gap-3">
                                            <Mail className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                            <div>
                                                <h4 className="text-sm font-bold text-blue-900 mb-1">Document Submission</h4>
                                                <p className="text-xs text-blue-700 leading-relaxed">
                                                    Applicant has been instructed to email supporting documents to <span className="font-bold">alexandriahigh6185@gmail.com</span> with reference number as subject line.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Actions */}
                                <div className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Application Actions</h3>

                                    <div className="space-y-3 mb-6">
                                        <label className="block text-xs text-slate-500 font-medium mb-2">Update Status</label>
                                        {[
                                            { id: 'In Review', icon: Clock, color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' },
                                            { id: 'Accepted', icon: CheckCircle, color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' },
                                            { id: 'Waitlisted', icon: AlertTriangle, color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' },
                                            { id: 'Rejected', icon: XCircle, color: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' },
                                            { id: 'Awaiting Documents', icon: FileText, color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' }
                                        ].map(btn => (
                                            <button
                                                key={btn.id}
                                                disabled={updatingStatus}
                                                onClick={() => updateStatus(selectedApp.id, btn.id)}
                                                className={`w-full p-3 border-2 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all ${selectedApp.status === btn.id
                                                    ? 'bg-slate-900 border-slate-900 text-white'
                                                    : btn.color
                                                    }`}
                                            >
                                                <btn.icon size={14} />
                                                {btn.id}
                                                {selectedApp.status === btn.id && <CheckCircle size={14} className="ml-auto" />}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Response Communication Section */}
                                    <div className="pt-6 border-t border-slate-200">
                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Respond to Applicant</h4>

                                        <div className="space-y-2 mb-4">
                                            <button
                                                onClick={() => handleEmailResponse(selectedApp, 'accepted')}
                                                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Mail size={14} />
                                                Email: Accepted
                                            </button>
                                            <button
                                                onClick={() => handleEmailResponse(selectedApp, 'rejected')}
                                                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg text-xs font-bold text-rose-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Mail size={14} />
                                                Email: Rejected
                                            </button>
                                            <button
                                                onClick={() => handleEmailResponse(selectedApp, 'waitlisted')}
                                                className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-bold text-amber-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Mail size={14} />
                                                Email: Waitlisted
                                            </button>
                                            <button
                                                onClick={() => handleEmailResponse(selectedApp, 'incomplete')}
                                                className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-lg text-xs font-bold text-purple-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Mail size={14} />
                                                Email: Incomplete
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleCall(selectedApp)}
                                            className="w-full py-3 bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 rounded-lg text-xs font-bold text-blue-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Phone size={14} />
                                            Call Applicant
                                        </button>
                                    </div>

                                    <div className="pt-6 border-t border-slate-200 space-y-3">
                                        <button
                                            onClick={() => generateApplicationPDF(selectedApp, selectedApp.reference_number)}
                                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-bold uppercase tracking-wide text-slate-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Download size={14} />
                                            Download Admission Form
                                        </button>
                                        <button
                                            onClick={() => deleteApplication(selectedApp.id)}
                                            className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg text-xs font-bold uppercase tracking-wide text-rose-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={14} />
                                            Delete Application
                                        </button>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                                        <p className="text-xs text-slate-400 font-medium mb-2">Application Date</p>
                                        <p className="text-sm font-bold text-slate-700">{new Date(selectedApp.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
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
