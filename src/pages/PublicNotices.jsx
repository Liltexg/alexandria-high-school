import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, Clock, Filter, AlertCircle, X, ScrollText, Heart } from 'lucide-react';
import NoticePreview from '../components/smt/NoticePreview';

const PublicNotices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedNotice, setSelectedNotice] = useState(null);

    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            const now = new Date().toISOString();

            let query = supabase
                .from('notices')
                .select('*')
                .eq('status', 'active')
                .lte('publish_at', now)
                .order('publish_at', { ascending: false });

            if (filter !== 'All') {
                query = query.eq('target_group', filter);
            }

            const { data, error } = await query;

            if (error) console.error('Error fetching notices:', error);
            else setNotices(data || []);
            setLoading(false);
        };

        fetchNotices();

        // Realtime subscription for instant updates on the public board
        const channel = supabase
            .channel('public-notices')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => {
                fetchNotices();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [filter]);

    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50">
            <div className="container-wide">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 mb-6"
                        >
                            <span className="w-12 h-1 bg-primary"></span>
                            <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Official Announcements</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-display font-black text-slate-900 uppercase tracking-tighter leading-[0.9]"
                        >
                            Notices Board
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar"
                    >
                        {['All', 'Learners', 'Parents', 'Staff', 'Public'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setFilter(item)}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${filter === item
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-64 animate-pulse flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="w-1/3 h-4 bg-slate-100 rounded-full" />
                                    <div className="w-3/4 h-6 bg-slate-100 rounded-lg" />
                                    <div className="w-full h-4 bg-slate-100 rounded-lg" />
                                    <div className="w-2/3 h-4 bg-slate-100 rounded-lg" />
                                </div>
                                <div className="w-1/4 h-4 bg-slate-100 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : notices.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-xl font-display font-bold text-slate-900 mb-2">All Caught Up</h3>
                        <p className="text-slate-500 font-medium">There are no active notices for this category at the moment.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                            {notices.map((notice, index) => (
                                <motion.div
                                    key={notice.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                    onClick={() => setSelectedNotice(notice)}
                                    className="bg-white border-t-8 border-primary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col group overflow-hidden"
                                >
                                    <div className="p-8 flex-grow flex flex-col">
                                        {/* Document Header Mock */}
                                        <div className="flex justify-between items-start mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <ScrollText size={32} className="text-slate-300" />
                                            <div className="text-right">
                                                <p className="text-[8px] font-black uppercase text-slate-400">Official Document</p>
                                                <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">AHS/NOTICE/{notice.id.slice(0, 4)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="px-3 py-1 rounded bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest border border-slate-200">
                                                {notice.target_group}
                                            </span>
                                            {(new Date() - new Date(notice.publish_at)) / (1000 * 60 * 60 * 24) < 2 && (
                                                <span className="px-3 py-1 rounded bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest border border-accent/20">
                                                    New Alert
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-display font-black text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors uppercase underline decoration-2 decoration-primary/10 underline-offset-4">
                                            {notice.title}
                                        </h3>

                                        <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow line-clamp-4 font-serif italic border-l-2 border-slate-100 pl-4">
                                            {notice.body}
                                        </p>

                                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Calendar size={12} />
                                                {new Date(notice.publish_at).toLocaleDateString()}
                                            </span>
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                                                Click to Read Full Document
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Official Document Viewer Modal */}
            <AnimatePresence>
                {selectedNotice && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-12 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNotice(null)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-5xl bg-slate-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                        >
                            {/* Modal Navigation Overlay */}
                            <div className="absolute top-6 right-6 z-50 flex gap-4">
                                <button
                                    onClick={() => setSelectedNotice(null)}
                                    className="p-3 bg-white text-slate-900 rounded-full shadow-2xl hover:bg-primary hover:text-white transition-all transform hover:rotate-90"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Formal Document Content */}
                            <div className="overflow-y-auto no-scrollbar py-12 px-4 md:px-0">
                                <NoticePreview
                                    title={selectedNotice.title}
                                    body={selectedNotice.body}
                                    bodyAfrikaans={selectedNotice.body_afrikaans}
                                    publishAt={selectedNotice.publish_at}
                                    targetGroup={selectedNotice.target_group}
                                />
                            </div>

                            {/* Print/Download Hint Footer (Mock) */}
                            <div className="p-4 bg-white border-t border-slate-200 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Official Alexandria High School Communication • Verified Document ID: {selectedNotice.id}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PublicNotices;
