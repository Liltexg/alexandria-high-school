import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedNews, setRelatedNews] = useState([]);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching article:', error);
                navigate('/news');
            } else {
                setArticle(data);
                fetchRelatedNews(data.category);
            }
            setLoading(false);
        };

        const fetchRelatedNews = async (category) => {
            const { data } = await supabase
                .from('news')
                .select('id, title, published_at')
                .eq('is_published', true)
                .neq('id', id)
                .limit(3);
            setRelatedNews(data || []);
        };

        fetchArticle();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!article) return null;

    return (
        <article className="pt-32 pb-24 min-h-screen bg-white">
            <div className="container-narrow">
                {/* Back Link */}
                <Link to="/news" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-12 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Newsroom</span>
                </Link>

                {/* Article Header */}
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            School News
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <Calendar size={12} />
                            {new Date(article.published_at).toLocaleDateString(undefined, {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-display font-bold text-slate-900 leading-[1.1] mb-8"
                    >
                        {article.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-between py-8 border-y border-slate-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <User size={24} />
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-900">Alexandria High School</span>
                                <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Editorial Team</span>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-3">
                            <button className="p-2.5 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300">
                                <Share2 size={16} />
                            </button>
                            <button className="p-2.5 rounded-full bg-slate-50 text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                                <Facebook size={16} />
                            </button>
                            <button className="p-2.5 rounded-full bg-slate-50 text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300">
                                <Twitter size={16} />
                            </button>
                        </div>
                    </motion.div>
                </header>

                {/* Article Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        {/* Summary / Lead Paragraph */}
                        <div className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed mb-12 italic border-l-4 border-primary pl-8">
                            {article.summary}
                        </div>

                        {/* Main Body */}
                        <div className="prose prose-slate prose-lg max-w-none">
                            <div
                                className="text-slate-800 leading-[1.8] space-y-8 font-serif"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>

                        {/* Mobile Share */}
                        <div className="mt-16 sm:hidden pt-8 border-t border-slate-100">
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">Share this story</span>
                            <div className="flex items-center justify-center gap-4">
                                <button className="p-4 rounded-full bg-slate-50 text-slate-400"><Facebook size={20} /></button>
                                <button className="p-4 rounded-full bg-slate-50 text-slate-400"><Twitter size={20} /></button>
                                <button className="p-4 rounded-full bg-slate-50 text-slate-400"><MessageCircle size={20} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-40 space-y-12">
                            {/* Newsletter / Call to Action */}
                            <div className="bg-slate-900 rounded-2xl p-8 text-white">
                                <h4 className="text-xl font-display font-bold mb-4">Stay Updated</h4>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Subscribe to our monthly newsletter for more stories and updates from AHS.
                                </p>
                                <button className="w-full py-3 bg-primary hover:bg-white hover:text-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300">
                                    Subscribe Now
                                </button>
                            </div>

                            {/* Related Stories */}
                            {relatedNews.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-8 pb-4 border-b-2 border-primary w-fit">
                                        Related Stories
                                    </h4>
                                    <div className="space-y-8">
                                        {relatedNews.map((news) => (
                                            <Link key={news.id} to={`/news/${news.id}`} className="group block">
                                                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                                                    {new Date(news.published_at).toLocaleDateString(undefined, {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </span>
                                                <h5 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                                                    {news.title}
                                                </h5>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
};

export default NewsDetail;
