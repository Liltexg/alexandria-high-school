import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Search, Filter, Edit2, Trash2, Archive, CheckCircle, Clock, FileText, X, Loader2 } from 'lucide-react';
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

    const handleDelete = async (id) => {
        setDialog({
            isOpen: true,
            type: 'error',
            title: 'Delete Notice',
            message: 'Are you sure you want to permanently delete this notice? This action is irreversible.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                const { error } = await supabase
                    .from('notices')
                    .delete()
                    .eq('id', id);

                if (error) {
                    setDialog({
                        isOpen: true,
                        type: 'error',
                        title: 'System Error',
                        message: 'Failed to eliminate notice record.',
                        confirmText: 'OK',
                        onConfirm: null
                    });
                } else {
                    fetchNotices();
                    setDialog({
                        isOpen: true,
                        type: 'success',
                        title: 'Record Eliminated',
                        message: 'The notice has been purged from the database.',
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
        <div className="max-w-6xl mx-auto pb-10 font-win">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[#b9d1ea] pb-4">
                <div>
                    <h1 className="text-[22px] font-semibold text-[#003399] tracking-tight mb-1 flex items-center gap-2 drop-shadow-sm">
                        <FileText className="text-[#0055cc]" size={22} /> Notices Board
                    </h1>
                    <p className="text-[12px] text-slate-600 font-medium tracking-tight">Manage ephemeral announcements and alerts.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="win7-button flex items-center gap-2 border-[#7cc4ff] text-[#004e99]"
                >
                    <Plus size={14} />
                    New Notice
                </button>
            </div>
            {/* Filters */}
            <div className="bg-gradient-to-b from-white to-[#f0f5fa] p-3 rounded-[4px] border border-[#a3c3e6] shadow-[inset_0_1px_0_rgba(255,255,255,1)] mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#a0a0a0] rounded-[3px] text-[13px] focus:border-[#0078d7] focus:outline-none shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <Filter size={14} className="text-slate-500 shrink-0 mr-1" />
                    {['all', 'active', 'draft', 'archived'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-[3px] text-[12px] font-medium transition-all capitalize ${filterStatus === status
                                ? 'bg-[#cce8ff] border border-[#99d1ff] text-[#003399]'
                                : 'border border-transparent text-slate-600 hover:bg-[#e5f3ff] hover:border-[#cce8ff]'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-12 text-slate-500 text-[12px] font-medium animate-pulse">
                        <Loader2 className="animate-spin text-[#0055cc] inline-block mb-3" size={24} />
                        <p>Syncing Notices...</p>
                    </div>
                ) : notices.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-[4px] border border-[#a3c3e6] border-dashed">
                        <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-[#003399] font-semibold mb-1">No Notices Found</h3>
                        <p className="text-slate-500 text-[12px]">Create a new notice to get started.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {notices.map((notice) => (
                            <motion.div
                                key={notice.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="win7-gadget group relative overflow-hidden flex flex-col md:flex-row gap-6"
                            >
                                <div className="flex-1 relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold border uppercase tracking-wider ${notice.status === 'active' ? 'bg-[#e5fbe5] text-[#008040] border-[#b3e6b3]' : notice.status === 'draft' ? 'bg-[#f0f5fa] text-[#003399] border-[#a3c3e6]' : 'bg-[#fff5e5] text-[#d47800] border-[#ffe6b3]'}`}>
                                            {notice.status}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-[2px] bg-white/50 text-slate-500 text-[10px] font-bold border border-[#d8e6f3] uppercase tracking-wider">
                                            {notice.target_group}
                                        </span>
                                    </div>
                                    <h3 className="text-[17px] font-semibold text-[#003399] mb-1.5 drop-shadow-sm">{notice.title}</h3>
                                    <p className="text-slate-700 text-[13px] line-clamp-2 mb-4 leading-relaxed font-medium opacity-80">{notice.body}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-5 text-[11px] font-medium text-slate-500">
                                        <span className="flex items-center gap-1.5"><Clock size={13} className="text-blue-500" /> {new Date(notice.publish_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1.5"><Archive size={13} className="text-amber-500" /> Expires: {new Date(notice.expire_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-start md:self-center border-t md:border-t-0 md:border-l border-[#d8e6f3] pt-4 md:pt-0 md:pl-5 w-full md:w-auto justify-end relative z-10">
                                    <button onClick={() => handleEdit(notice)} className="win7-button !px-2.5" title="Edit"><Edit2 size={14} /></button>
                                    <button onClick={() => handlePromote(notice)} className="win7-button !px-2.5" title="Promote"><Plus size={14} /></button>
                                    <button onClick={() => handleDelete(notice.id)} className="win7-button !px-2.5 border-red-200 hover:border-red-400" title="Delete"><Trash2 size={14} className="text-red-600" /></button>
                                    {notice.status !== 'archived' && (
                                        <button onClick={() => handleArchive(notice.id)} className="win7-button !px-2.5" title="Archive"><Archive size={14} /></button>
                                    )}
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
                            className="absolute inset-0 bg-blue-900/10 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-2xl win7-window flex flex-col max-h-[90vh] z-10"
                        >
                            <div className="win7-title-bar shrink-0">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-slate-700" size={16} />
                                    <span className="text-[12px] font-medium text-slate-800 drop-shadow-sm truncate">
                                        {editingNotice ? 'Edit Notice' : 'New Notice'} - Alexandria Subsystem
                                    </span>
                                </div>
                                <div className="flex items-center gap-px -mr-1">
                                    <button onClick={handleModalClose} className="w-[45px] h-[18px] bg-gradient-to-b from-[#e81123]/30 to-[#e81123]/80 hover:from-[#e81123] hover:to-[#e81123] border border-white/10 flex items-center justify-center text-white transition-colors">
                                        <X size={10} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto bg-white">
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
                            className="absolute inset-0 bg-blue-900/10 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            className="bg-white w-full max-w-4xl rounded-[4px] border border-[#7cc4ff] shadow-[0_10px_40px_rgba(0,0,0,0.15)] relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-4 border-b border-[#a3c3e6] flex items-center justify-between bg-gradient-to-b from-blue-400/90 to-blue-600/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                                <div>
                                    <h2 className="text-[15px] font-semibold text-white drop-shadow-md">
                                        Promote to News
                                    </h2>
                                    <p className="text-[11px] text-blue-50 font-medium opacity-80">
                                        Converting notice to permanent record
                                    </p>
                                </div>
                                <button
                                    onClick={handlePromoteClose}
                                    className="p-1.5 hover:bg-white/20 rounded border border-white/30 text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto bg-[#f8fbff]">
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
        </div>
    );
};

export default Notices;
