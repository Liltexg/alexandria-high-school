import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, Info, Download, ArrowRight } from 'lucide-react';
import PageHero from './PageHero';

const Calendar = () => {
    const termDates = [
        { term: 1, duration: '14 January – 27 March', weeks: 11, schoolDays: 53 },
        { term: 2, duration: '08 April – 26 June', weeks: 12, schoolDays: 54 },
        { term: 3, duration: '21 July – 23 September', weeks: 10, schoolDays: 46 },
        { term: 4, duration: '06 October – 09 December', weeks: 10, schoolDays: 47 },
    ];

    const publicHolidays = [
        { date: '01 January', name: "New Year's Day" },
        { date: '21 March', name: 'Human Rights Day' },
        { date: '03 April', name: 'Good Friday' },
        { date: '06 April', name: 'Family Day' },
        { date: '27 April', name: 'Freedom Day' },
        { date: '01 May', name: "Workers' Day" },
        { date: '15 June', name: 'Special School Holiday' },
        { date: '16 June', name: 'Youth Day' },
        { date: '09 August', name: "National Women's Day" },
        { date: '24 September', name: 'Heritage Day' },
        { date: '16 December', name: 'Day of Reconciliation' },
        { date: '25 December', name: 'Christmas Day' },
    ];

    return (
        <div className="bg-white">
            <PageHero
                title="Schedules"
                subtitle="The structural framework of the academic year at Alexandria High."
                image="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop"
            />

            <section className="section-padding">
                <div className="container-wide">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
                        <div className="max-w-3xl">
                            <span className="label-meta mb-6 block">Term Cycles</span>
                            <h2 className="text-huge text-dark leading-[0.85] tracking-tighter">
                                Academic <br />
                                <span className="text-serif italic">Timeline.</span>
                            </h2>
                        </div>
                        <button
                            onClick={() => alert("Calendar PDF download initiated.")}
                            className="btn-studio btn-studio-primary flex items-center gap-6 group"
                        >
                            Download Framework <Download size={14} className="group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>

                    {/* Terms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-black/5 mb-48">
                        {termDates.map((term, index) => (
                            <div key={index} className="p-12 border-r last:border-r-0 border-black/5 hover:bg-soft transition-all duration-500 group">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-8 block">Term {term.term}</span>
                                <h3 className="text-2xl font-display font-bold text-dark mb-4 uppercase tracking-tighter">{term.duration}</h3>
                                <div className="space-y-4 mt-12 pt-8 border-t border-black/5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-dark/30">
                                        <span>Weeks</span>
                                        <span className="text-dark">{term.weeks}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-dark/30">
                                        <span>Instruction Days</span>
                                        <span className="text-dark">{term.schoolDays}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-32">
                        {/* Holidays Table */}
                        <div className="lg:col-span-2">
                            <span className="label-meta mb-8 block">Occasions</span>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-t border-black/5">
                                    <tbody className="divide-y divide-black/5">
                                        {publicHolidays.map((holiday, i) => (
                                            <tr key={i} className="group hover:bg-soft transition-colors text-dark">
                                                <td className="py-8 font-sans text-lg font-light tracking-tight">{holiday.date}</td>
                                                <td className="py-8 font-display font-bold uppercase tracking-widest text-sm">{holiday.name}</td>
                                                <td className="py-8 text-right">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-dark/20 group-hover:text-primary transition-colors">
                                                        #OffCampus
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="space-y-24">
                            <div>
                                <span className="label-meta mb-8 block">Cycle Totals</span>
                                <div className="space-y-12">
                                    <div className="group">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-dark/30 block mb-2">Total Instruction Weeks</span>
                                        <h4 className="text-6xl font-display font-bold text-dark tracking-tighter">43</h4>
                                    </div>
                                    <div className="group">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-dark/30 block mb-2">Total School Days</span>
                                        <h4 className="text-6xl font-display font-bold text-dark tracking-tighter">200</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 bg-dark noise group relative overflow-hidden">
                                <Info className="text-primary mb-12 opacity-50" size={24} />
                                <h4 className="text-white font-display font-bold uppercase tracking-widest text-sm mb-8">Administrative Notes</h4>
                                <ul className="space-y-6">
                                    {[
                                        "Teachers report on 12 January 2026.",
                                        "End of Term 4: 11 December 2026.",
                                        "Subject to DBE Gazetted changes."
                                    ].map((note, i) => (
                                        <li key={i} className="flex gap-4 text-white/40 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                                            <div className="w-1.5 h-1.5 bg-primary mt-1.5" />
                                            {note}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Calendar;
