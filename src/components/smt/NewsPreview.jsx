import React from 'react';
import { Calendar, User, Share2, Facebook, Twitter, Shield, Trophy, GraduationCap, AlertCircle } from 'lucide-react';
import logo from '../../assets/logo.png';

const NewsPreview = ({ title, summary, content, publishedAt, category = 'news' }) => {
    // Theme configuration based on category
    const themes = {
        news: {
            color: 'text-slate-900',
            bg: 'bg-slate-900',
            border: 'border-slate-900',
            accent: 'bg-slate-100',
            label: 'Chronicle',
            icon: Shield
        },
        breaking: {
            color: 'text-primary',
            bg: 'bg-primary',
            border: 'border-primary',
            accent: 'bg-primary/5',
            label: 'Breaking News',
            icon: AlertCircle
        },
        academic: {
            color: 'text-emerald-700',
            bg: 'bg-emerald-700',
            border: 'border-emerald-700',
            accent: 'bg-emerald-50',
            label: 'Academic Excellence',
            icon: GraduationCap
        },
        sports: {
            color: 'text-blue-700',
            bg: 'bg-blue-700',
            border: 'border-blue-700',
            accent: 'bg-blue-50',
            label: 'Athletics',
            icon: Trophy
        }
    };

    const theme = themes[category] || themes.news;
    const Icon = theme.icon;

    // Process markdown-like line breaks for simple preview
    const formattedContent = content?.split('\n').map((para, index) => (
        <p key={index} className="mb-6 leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:float-left">
            {para}
        </p>
    )) || 'Article content will appear here...';

    const displayDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }).toUpperCase()
        : new Date().toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }).toUpperCase();

    return (
        <div className="bg-[#fdfdfb] border border-slate-200 rounded-lg overflow-hidden shadow-2xl max-w-4xl mx-auto my-8 font-serif text-slate-900 overflow-y-auto max-h-[800px] no-scrollbar">
            {/* Top Bar Metadata */}
            <div className="flex justify-between items-center px-6 py-2 border-b border-slate-200 text-[10px] font-bold tracking-[0.1em] text-slate-500 bg-white">
                <span>VOL. LXIV ... NO. 22,451</span>
                <span>ALEXANDRIA, {new Date().getFullYear()}</span>
                <span>ESTABLISHED 1960</span>
            </div>

            {/* Broadsheet Masthead */}
            <div className="py-8 px-8 border-b-4 border-double border-slate-900 flex flex-col items-center bg-white">
                <div className="flex items-center gap-6 mb-4">
                    <img src={logo} alt="AHS Logo" className="w-16 h-16 object-contain" />
                    <div className="text-center">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 mb-1">The Official Publication of Alexandria High</h2>
                        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter uppercase text-slate-900">
                            The <span className="text-primary">Alexandria</span> Times
                        </h1>
                    </div>
                    <img src={logo} alt="AHS Logo" className="w-16 h-16 object-contain grayscale opacity-20" />
                </div>

                {/* Secondary Header Details */}
                <div className="w-full flex justify-between items-center py-2 border-y border-slate-900 text-[11px] font-bold tracking-widest px-4">
                    <div className="flex items-center gap-2">
                        <Icon size={14} className={theme.color} />
                        <span className={theme.color}>{theme.label} Edition</span>
                    </div>
                    <span>{displayDate}</span>
                    <span className="text-primary font-black">PRICE: EXCELLENCE</span>
                </div>
            </div>

            <div className="p-8 md:p-12">
                {/* Headline Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-900 leading-[1.05] mb-6 tracking-tight">
                        {title || 'Your Headline Will Appear Here'}
                    </h1>
                    <div className="flex justify-center items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <div className="h-px w-12 bg-slate-200" />
                        <span>By The Editorial Desk</span>
                        <div className="h-px w-12 bg-slate-200" />
                    </div>
                </div>

                {/* Main Content Area with sidebar feel */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Left Sidebar Info */}
                    <div className="lg:col-span-1 hidden lg:block border-r border-slate-200 pr-8">
                        <div className="mb-8">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">Executive Summary</h4>
                            <p className="text-xs italic leading-relaxed text-slate-600">
                                {summary || "Executive brief will appear in this column to provide context for the main publication."}
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded border border-slate-100 italic text-[11px] text-slate-500">
                            "Education is the most powerful weapon which you can use to change the world."
                        </div>
                    </div>

                    {/* Main Story Body */}
                    <div className="lg:col-span-3">
                        {/* Mobile Summary */}
                        <div className="lg:hidden mb-8 p-6 bg-slate-50 border-l-4 border-primary italic text-slate-600">
                            {summary}
                        </div>

                        <div className="prose prose-slate max-w-none text-slate-800 leading-[1.7] text-lg font-serif">
                            {formattedContent}
                        </div>

                        {/* Professional Footer Stamp */}
                        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col items-center">
                            <img src={logo} alt="AHS Stamp" className="w-12 h-12 grayscale opacity-10 mb-2" />
                            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-300">
                                © {new Date().getFullYear()} Alexandria High School Press. All Rights Reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsPreview;
