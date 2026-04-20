import React from 'react';
import logo from '../../assets/logo.png';

const NoticePreview = ({ title, body, bodyAfrikaans, publishAt, targetGroup }) => {
    const dateStr = publishAt ? new Date(publishAt).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

    return (
        <div className="bg-white p-8 md:p-12 shadow-inner min-h-[800px] font-serif text-slate-900 border border-slate-200 mx-auto max-w-4xl overflow-hidden">
            {/* Letterhead Header */}
            <div className="flex justify-between items-start mb-12 relative pb-8 border-b border-slate-200">
                {/* Left Info (English) */}
                <div className="text-[10px] uppercase leading-relaxed font-bold tracking-tight w-1/3">
                    <p className="text-sm font-black mb-1">Alexandria High School</p>
                    <p>P.O. Box 43</p>
                    <p>ALEXANDRIA</p>
                    <p>6185</p>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                        <p>☎ 046 653 0126</p>
                        <p>📠 046 653 0628</p>
                    </div>
                </div>

                {/* Center Crest */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
                    <img src={logo} alt="Crest" className="h-24 md:h-32 w-auto object-contain" />
                </div>

                {/* Right Info (Afrikaans) */}
                <div className="text-[10px] uppercase leading-relaxed font-bold tracking-tight w-1/3 text-right">
                    <p className="text-sm font-black mb-1">Hoërskool Alexandria</p>
                    <p>Posbus 43</p>
                    <p>ALEXANDRIA</p>
                    <p>6185</p>
                    <div className="mt-2 pt-2 border-t border-slate-100 italic lowercase font-normal">
                        <p>E-mail Address:</p>
                        <p className="font-bold underline">alexandriahigh@telkomsa.net</p>
                    </div>
                </div>
            </div>

            {/* Date Line */}
            <div className="flex justify-between items-center mb-10 text-sm font-bold">
                <p>{dateStr}</p>
                <p>{dateStr}</p>
            </div>

            {/* Salutation */}
            <div className="flex justify-between items-start mb-8 font-black uppercase text-sm tracking-widest">
                <p>DEAR {targetGroup === 'Parents' ? 'PARENT' : targetGroup.toUpperCase()}</p>
                <p className="text-right">GEAGTE {targetGroup === 'Parents' ? 'OUER' : targetGroup.toUpperCase()}</p>
            </div>

            {/* Content Body */}
            <div className="mb-12">
                <p className="font-bold italic mb-6">Please take note of the following: / Neem kennis van die volgende:</p>

                {/* Subject / Title */}
                <div className="mb-8 p-4 bg-slate-50 border-l-4 border-primary/20">
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-center underline decoration-2 underline-offset-4">
                        {title || 'NOTICE TITLE / KENNISGEWING TITEL'}
                    </h2>
                </div>

                {/* Bilingual Content Columns */}
                <div className={`grid ${bodyAfrikaans ? 'grid-cols-1 md:grid-cols-2 gap-12' : 'grid-cols-1'} text-sm leading-relaxed text-justify`}>
                    {/* English Column */}
                    <div className="space-y-4">
                        <div className="whitespace-pre-line font-medium text-slate-800">
                            {body || 'English content goes here...'}
                        </div>
                    </div>

                    {/* Afrikaans Column */}
                    {bodyAfrikaans && (
                        <div className="space-y-4 border-l md:pl-12 border-slate-100">
                            <div className="whitespace-pre-line font-medium text-slate-800 italic">
                                {bodyAfrikaans}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Signature Block */}
            <div className="mt-20 pt-12 border-t border-slate-100 flex justify-between items-end">
                <div className="flex flex-col items-center">
                    <div className="h-16 w-48 border-b border-slate-200 flex items-center justify-center relative group">
                        <span className="font-serif italic text-3xl text-primary/60 tracking-tighter select-none transform -rotate-2">
                            Mrs E Taal
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                            <span className="text-[8px] font-black uppercase tracking-[0.5em] border border-primary p-1 rotate-12">Digitally Verified</span>
                        </div>
                    </div>
                    <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-center">
                        <p>MRS E TAAL</p>
                        <p>(PRINCIPAL / SKOOLHOOF)</p>
                    </div>
                </div>

                <div className="text-[9px] uppercase font-bold text-slate-400 text-right leading-tight">
                    <p>Alexandria High School</p>
                    <p>P. O. Box / Posbus 43</p>
                    <p>ALEXANDRIA 6185.</p>
                    <p>Tel : 046 - 6530126</p>
                    <p>Fax / Faks : 046 6530628</p>
                </div>
            </div>

            {/* Archival Note */}
            <div className="mt-12 text-center">
                <p className="text-[10px] text-slate-300 uppercase tracking-[0.5em] font-bold">Official School Record</p>
            </div>
        </div>
    );
};

export default NoticePreview;
