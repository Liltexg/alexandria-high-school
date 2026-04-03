import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Search, Filter, Edit2, Archive, CheckCircle, Clock, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NoticeForm from '../../components/smt/NoticeForm';
import NewsForm from '../../components/smt/NewsForm';
import CustomDialog from '../../components/CustomDialog';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    const [promotingNotice, setPromotingNotice] = useState(null);
    const [dialog, setDialog] = useState({ isOpen: false, type: 'confirm', title: '', message: '', onConfirm: null });

    const fetchNotices = async () => {
        setLoading(true);
        let query = supabase
            .from('notices')
            .select('*')
            .order('created_at', { ascending: false });

        if (filterStatus !== 'all') {
            query = query.eq('status', filterStatus);
        }

        if (searchQuery) {
            query = query.ilike('title', `%${searchQuery}%`);
        }

        const { data, error } = await query;
        if (error) console.error('Error fetching notices:', error);
        else setNotices(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchNotices();

        const channel = supabase
            .channel('smt-notices')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => {
                fetchNotices();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [filterStatus, searchQuery]); // Re-fetch when filters change

    const handleEdit = (notice) => {
        setEditingNotice(notice);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingNotice(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingNotice(null);
    };

    const handlePromote = (notice) => {
        setPromotingNotice(notice);
        setIsPromoteModalOpen(true);
    };

    const handlePromoteSuccess = () => {
        setIsPromoteModalOpen(false);
        setPromotingNotice(null);
        setDialog({
            isOpen: true,
            type: 'success',
            title: 'Success',
            message: 'Notice promoted to News Draft successfully!',
            confirmText: 'OK',
            onConfirm: null
        });
    };

    const handlePromoteClose = () => {
        setIsPromoteModalOpen(false);
        setPromotingNotice(null);
    };

    const handleFormSuccess = () => {
        handleModalClose();
        fetchNotices(); // Explicit refresh to be safe
    };

    const handleArchive = async (id) => {
        setDialog({
            isOpen: true,
            type: 'confirm',
            title: 'Archive Notice',
            message: 'Are you sure you want to archive this notice? It will no longer be visible to the public.',
            confirmText: 'Archive',
            cancelText: 'Cancel',
            onConfirm: async () => {
                const { error } = await supabase
                    .from('notices')
                    .update({ status: 'archived' })
                    .eq('id', id);

                if (error) {
                    setDialog({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to archive notice',
                        confirmText: 'OK',
                        onConfirm: null
                    });
                } else {
                    fetchNotices();
                    setDialog({
                        isOpen: true,
                        type: 'success',
                        title: 'Success',
                        message: 'Notice archived successfully',
                        confirmText: 'OK',
                        onConfirm: null
                    });
                }
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'archived': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 uppercase tracking-widest">Notices Board</h1>
                    <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 uppercase tracking-widest">Manage ephemeral announcements and alerts.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-primary-dark transition-all flex items-center gap-2"
                >
                    <Plus size={16} />
                    New Notice
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Filter size={16} className="text-slate-400 shrink-0" />
                    {['all', 'active', 'draft', 'archived'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${filterStatus === status
                                ? 'bg-slate-800 text-white'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        Loading Notices...
                    </div>
                ) : notices.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                        <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-slate-900 font-bold mb-1">No Notices Found</h3>
                        <p className="text-slate-500 text-sm">Create a new notice to get started.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {notices.map((notice) => (
                            <motion.div
                                key={notice.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-2">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(notice.status)}`}>
                                                {notice.status}
                                            </span>
                                            <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                                                {notice.target_group}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-slate-900 mb-2">{notice.title}</h3>
                                        <p className="text-slate-600 text-sm line-clamp-2 mb-4 font-medium">{notice.body}</p>

                                        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <CheckCircle size={12} />
                                                Published: {new Date(notice.publish_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1 text-amber-500/80">
                                                <Clock size={12} />
                                                Expires: {new Date(notice.expire_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-start md:self-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-end">
                                        <button
                                            onClick={() => handlePromote(notice)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Promote to News"
                                        >
                                            <FileText size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(notice)}
                                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
                                            title="Edit Notice"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        {notice.status !== 'archived' && (
                                            <button
                                                onClick={() => handleArchive(notice.id)}
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                title="Archive Notice"
                                            >
                                                <Archive size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleModalClose}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl font-display font-bold text-slate-900">
                                        {editingNotice ? 'Edit Notice' : 'New Notice'}
                                    </h2>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                                        {editingNotice ? 'Modify existing announcement' : 'Create a new announcement'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleModalClose}
                                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <NoticeForm
                                    notice={editingNotice}
                                    onSuccess={handleFormSuccess}
                                    onCancel={handleModalClose}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Promote Modal */}
            <AnimatePresence>
                {isPromoteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handlePromoteClose}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
                                <div>
                                    <h2 className="text-xl font-display font-bold text-purple-900">
                                        Promote to News
                                    </h2>
                                    <p className="text-xs text-purple-600/70 font-bold uppercase tracking-widest mt-1">
                                        Converting notice to permanent record
                                    </p>
                                </div>
                                <button
                                    onClick={handlePromoteClose}
                                    className="p-2 hover:bg-purple-100 rounded-full text-purple-400 hover:text-purple-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                <NewsForm
                                    article={{
                                        title: promotingNotice?.title,
                                        content: promotingNotice?.body,
                                        summary: promotingNotice?.body.substring(0, 250), // Auto-generate summary
                                        is_published: false // Draft by default
                                    }}
                                    onSuccess={handlePromoteSuccess}
                                    onCancel={handlePromoteClose}
                                />
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
        </div >
    );
};

export default Notices;
