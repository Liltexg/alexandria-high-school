import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Calendar, ArrowRight, BookOpen, X } from 'lucide-react';
import NewsPreview from '../components/smt/NewsPreview';
import { Link } from 'react-router-dom';

const PublicNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchNews = async () => {
            if (isMounted) setLoading(true);
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (!isMounted) return;

            if (error) console.error('Error fetching news:', error);
            else setNews(data || []);
            setLoading(false);
        };

        fetchNews();

        const channel = supabase
            .channel('public-news')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => {
                fetchNews();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50">
            <div className="container-wide">
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <span className="w-12 h-1 bg-primary"></span>
                        <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Stories & Achievements</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-display font-black text-slate-900 uppercase tracking-tighter leading-[0.9]"
                    >
                        Newsroom
                    </motion.h1>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-96 animate-pulse">
                                <div className="h-48 bg-slate-100" />
                                <div className="p-8 space-y-4">
                                    <div className="w-3/4 h-6 bg-slate-100 rounded-lg" />
                                    <div className="w-full h-4 bg-slate-100 rounded-lg" />
                                    <div className="w-2/3 h-4 bg-slate-100 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : news.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Newspaper className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No Stories Yet</h3>
                        <p className="text-slate-500 font-medium">Check back soon for the latest school news and updates.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {news.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full overflow-hidden"
                                >
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 self-start px-2 py-1 rounded">
                                            <Calendar size={12} className="text-primary" />
                                            {new Date(item.published_at).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>

                                        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                            {item.summary}
                                        </p>

                                        <button
                                            onClick={() => setSelectedStory(item)}
                                            className="pt-6 border-t border-slate-50 flex items-center justify-between w-full group/btn"
                                        >
                                            <span className="text-xs font-bold text-primary flex items-center gap-2">
                                                Read Full Story <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Story Modal */}
            <AnimatePresence>
                {selectedStory && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStory(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header/Controls */}
                            <div className="absolute top-6 right-6 z-50">
                                <button
                                    onClick={() => setSelectedStory(null)}
                                    className="p-3 bg-white/80 backdrop-blur-md hover:bg-white text-slate-900 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="overflow-y-auto no-scrollbar bg-[#fdfdfb]">
                                <NewsPreview
                                    title={selectedStory.title}
                                    summary={selectedStory.summary}
                                    content={selectedStory.content}
                                    publishedAt={selectedStory.published_at}
                                    category={selectedStory.category}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PublicNews;
