import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import PageHero from '../components/PageHero';
import {
    ChevronRight,
    ChevronLeft,
    Upload,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    School,
    User,
    Home,
    FileText,
    Users,
    Loader2,
    MapPin,
    Sparkles,
    ArrowRight,
    Download,
    Globe as GlobeIcon
} from 'lucide-react';
import { generateApplicationPDF } from '../utils/generateApplicationPDF';
import { useLanguage } from '../context/LanguageContext';

const getSteps = (t) => [
    { id: 'language', title: t.apply_form.select_lang || 'Language', icon: <GlobeIcon size={16} /> },
    { id: 'intro', title: t.steps.intro, icon: <Sparkles size={16} /> },
    { id: 'grade', title: t.steps.grade, icon: <School size={16} /> },
    { id: 'learner', title: t.steps.learner, icon: <User size={16} /> },
    { id: 'medical', title: t.steps.medical, icon: <AlertCircle size={16} /> },
    { id: 'school', title: t.steps.school, icon: <School size={16} /> },
    { id: 'parents', title: t.steps.parents, icon: <Users size={16} /> },
    { id: 'address', title: t.steps.address, icon: <Home size={16} /> },
    { id: 'support', title: t.steps.support, icon: <FileText size={16} /> },
    { id: 'review', title: t.steps.review, icon: <CheckCircle2 size={16} /> }
];

const LanguageStep = ({ changeLanguage, nextStep }) => {
    const handleSelect = (l) => {
        changeLanguage(l);
        nextStep();
    };

    return (
        <div className="space-y-12 text-center py-12">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">
                    Taal / <span className="text-primary">Language</span>
                </h2>
                <p className="text-lg text-dark/60 leading-relaxed mb-16 max-w-xl mx-auto">
                    Please select your preferred language to complete the application form:<br />
                    Kies asseblief u voorkeurtaal om die aansoekvorm te voltooi:
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                        onClick={() => handleSelect('en')}
                        className="bg-primary text-white hover:bg-primary/90 font-medium rounded-full py-6 px-12 transition-all flex items-center justify-center gap-3 shadow-md group text-xl"
                    >
                        English 🇬🇧
                    </button>
                    <button
                        onClick={() => handleSelect('af')}
                        className="bg-dark text-white hover:bg-dark/90 font-medium rounded-full py-6 px-12 transition-all flex items-center justify-center gap-3 shadow-md group text-xl"
                    >
                        Afrikaans 🇿🇦
                    </button>
                </div>
                <p className="mt-12 text-sm text-dark/40 italic">
                    Alexandria High School is a dual-medium institution.
                </p>
            </div>
        </div>
    );
};

const IntroStep = ({ nextStep, t }) => (
    <div className="space-y-12 text-center py-12">
        <div className="w-20 h-20 border border-primary/20 flex items-center justify-center mx-auto mb-12 text-primary">
            <Sparkles size={32} />
        </div>
        <div className="max-w-2xl mx-auto">
            <span className="label-meta mb-4 block text-primary font-semibold tracking-wider">Admissions</span>
            <h2 className="text-5xl md:text-6xl font-bold text-dark mb-6">
                Online <span className="text-primary">Application.</span>
            </h2>
            <p className="text-lg text-dark/60 leading-relaxed mb-16 max-w-xl mx-auto">
                {t.apply_subtitle}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 rounded-2xl overflow-hidden max-w-3xl mx-auto text-left mb-16 shadow-sm">
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-slate-200 bg-white">
                <ShieldCheck className="text-primary mb-5" size={28} />
                <span className="text-sm font-bold text-dark mb-2 block">{t.privacy_protected}</span>
                <p className="text-sm text-dark/60 leading-relaxed">
                    {t.privacy_note}
                </p>
            </div>
            <div className="p-8 md:p-10 bg-white">
                <FileText className="text-primary mb-5" size={28} />
                <span className="text-sm font-bold text-dark mb-2 block">{t.time_required}</span>
                <p className="text-sm text-dark/60 leading-relaxed">
                    {t.time_note}
                </p>
            </div>
        </div>

        <button
            onClick={nextStep}
            className="bg-primary text-white hover:bg-primary/90 font-medium rounded-full py-4 px-12 transition-all flex items-center justify-center gap-3 mx-auto shadow-md group"
        >
            {t.start_button} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
    </div>
);

const SignaturePad = ({ label, onSave, onClear, t }) => {
    const canvasRef = React.useRef(null);
    const [drawing, setDrawing] = React.useState(false);

    const startDrawing = (e) => {
        setDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setDrawing(false);
        const canvas = canvasRef.current;
        onSave(canvas.toDataURL("image/png"));
    };

    const draw = (e) => {
        if (!drawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();

        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        onClear();
    };

    return (
        <div className="flex flex-col gap-4">
            <label className="text-sm font-bold text-dark/60 uppercase tracking-widest">{label}</label>
            <div className="relative group">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="border-2 border-slate-200 rounded-xl bg-white w-full cursor-crosshair touch-none"
                />
                <button
                    onClick={clear}
                    type="button"
                    className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-widest text-dark/40 hover:text-primary transition-colors bg-white/80 px-2 py-1 rounded"
                >
                    {t.clear_sig}
                </button>
            </div>
        </div>
    );
};

const GradeStep = ({ formData, updateFormData, t }) => (
    <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div className="space-y-8">
                <label className="label-meta mb-4 block">{t.grade_selection}</label>
                <div className="space-y-6">
                    <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-dark/20 block mb-3">{t.primary_phase}</span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {['R', '1', '2', '3', '4', '5', '6', '7'].map(grade => (
                                <button
                                    key={grade}
                                    onClick={() => updateFormData({ grade_applying_for: `Grade ${grade}` })}
                                    className={`py-3 border-2 transition-all font-bold uppercase tracking-wider text-sm h-14 flex items-center justify-center rounded-2xl ${formData.grade_applying_for === `Grade ${grade}`
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 rounded-2xl'
                                        : 'border-slate-200 text-dark/30 hover:border-black/20'
                                        }`}
                                >
                                    {grade}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-dark/20 block mb-3">{t.secondary_phase}</span>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {['8', '9', '10', '11', '12'].map(grade => (
                                <button
                                    key={grade}
                                    onClick={() => updateFormData({ grade_applying_for: `Grade ${grade}` })}
                                    className={`py-3 border-2 transition-all font-bold uppercase tracking-wider text-sm h-14 flex items-center justify-center rounded-2xl ${formData.grade_applying_for === `Grade ${grade}`
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 rounded-2xl'
                                        : 'border-slate-200 text-dark/30 hover:border-black/20'
                                        }`}
                                >
                                    {grade}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-8">
                <label className="label-meta mb-4 block">{t.apply_form.academic_year || 'Academic Year'}</label>
                <div className="border-b border-slate-200 focus-within:border-primary transition-colors pb-4">
                    <select
                        value={formData.intake_year}
                        onChange={(e) => updateFormData({ intake_year: parseInt(e.target.value) })}
                        className="w-full bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none cursor-pointer"
                    >
                        <option value={2027}>2027</option>
                        <option value={2026}>2026</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
);

const LearnerStep = ({ formData, updateFormData, t }) => (
    <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.first_name}</label>
                <input
                    type="text"
                    value={formData.learner_first_name}
                    onChange={(e) => updateFormData({ learner_first_name: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    placeholder="..."
                />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.surname}</label>
                <input
                    type="text"
                    value={formData.learner_surname}
                    onChange={(e) => updateFormData({ learner_surname: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    placeholder="..."
                />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.id_passport}</label>
                <input
                    type="text"
                    value={formData.id_number}
                    onChange={(e) => updateFormData({ id_number: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    placeholder="..."
                />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.dob}</label>
                <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => updateFormData({ date_of_birth: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.gender}</label>
                <select
                    value={formData.gender}
                    onChange={(e) => updateFormData({ gender: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none cursor-pointer"
                >
                    <option value="">{t.select_language === "Kies asseblief u voorkeurtaal om die aansoekvorm te voltooi:" ? "Kies" : "Select"}</option>
                    <option value="Male">{t.apply_form.male}</option>
                    <option value="Female">{t.apply_form.female}</option>
                </select>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.home_lang}</label>
                <input
                    type="text"
                    value={formData.home_language}
                    onChange={(e) => updateFormData({ home_language: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    placeholder="..."
                />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.instruction_lang}</label>
                <select
                    value={formData.preferred_language}
                    onChange={(e) => updateFormData({ preferred_language: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none cursor-pointer"
                >
                    <option value="">{t.select_language === "Kies asseblief u voorkeurtaal om die aansoekvorm te voltooi:" ? "Kies" : "Select"}</option>
                    <option value="English">English</option>
                    <option value="Afrikaans">Afrikaans</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.citizenship}</label>
                <input
                    type="text"
                    value={formData.citizenship}
                    onChange={(e) => updateFormData({ citizenship: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.religion}</label>
                <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => updateFormData({ religion: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.race}</label>
                <select
                    value={formData.race}
                    onChange={(e) => updateFormData({ race: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none cursor-pointer"
                >
                    <option value="">{t.select_language === "Kies asseblief u voorkeurtaal om die aansoekvorm te voltooi:" ? "Kies" : "Select"}</option>
                    <option value="African">African</option>
                    <option value="Coloured">Coloured</option>
                    <option value="Indian">Indian</option>
                    <option value="White">White</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.boarder}</label>
                <select
                    value={formData.is_boarder}
                    onChange={(e) => updateFormData({ is_boarder: e.target.value === 'true' })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none cursor-pointer"
                >
                    <option value="false">{t.admissions.faqs[2].content.includes("beslis") ? "Nee" : "No"}</option>
                    <option value="true">{t.admissions.faqs[2].content.includes("beslis") ? "Ja" : "Yes"}</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.deceased_parent}</label>
                <select
                    value={formData.deceased_parent}
                    onChange={(e) => updateFormData({ deceased_parent: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none cursor-pointer"
                >
                    <option value="None">{t.apply_form.deceased_parent === "Oorlede Ouer(s)" ? "Geen" : "None"}</option>
                    <option value="Mother">{t.apply_form.deceased_parent === "Oorlede Ouer(s)" ? "Moeder" : "Mother"}</option>
                    <option value="Father">{t.apply_form.deceased_parent === "Oorlede Ouer(s)" ? "Vader" : "Father"}</option>
                    <option value="Both">{t.apply_form.deceased_parent === "Oorlede Ouer(s)" ? "Beide" : "Both"}</option>
                </select>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.mode_transport}</label>
                <input
                    type="text"
                    value={formData.mode_of_transport}
                    onChange={(e) => updateFormData({ mode_of_transport: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    placeholder="..."
                />
            </div>
        </div>
    </div>
);

const MedicalStep = ({ formData, updateFormData, t }) => (
    <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.medical_aid_name}</label>
                <input
                    type="text"
                    value={formData.medical_aid_name}
                    onChange={(e) => updateFormData({ medical_aid_name: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.medical_aid_no}</label>
                <input
                    type="text"
                    value={formData.medical_aid_number}
                    onChange={(e) => updateFormData({ medical_aid_number: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                />
            </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.main_member}</label>
            <input
                type="text"
                value={formData.medical_main_member}
                onChange={(e) => updateFormData({ medical_main_member: e.target.value })}
                className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.doctor_name}</label>
                <input
                    type="text"
                    value={formData.doctor_name}
                    onChange={(e) => updateFormData({ doctor_name: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.doctor_phone}</label>
                <input
                    type="tel"
                    value={formData.doctor_contact}
                    onChange={(e) => updateFormData({ doctor_contact: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                />
            </div>
        </div>
        <div className="space-y-8">
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.conditions_allergies}</label>
                <textarea
                    rows={2}
                    value={formData.medical_condition}
                    onChange={(e) => updateFormData({ medical_condition: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full resize-none"
                    placeholder="..."
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.dexterity}</label>
                    <select
                        value={formData.dexterity}
                        onChange={(e) => updateFormData({ dexterity: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none cursor-pointer"
                    >
                        <option value="Right">{t.apply_form.dexterity === "Handigheid" ? "Regshandig" : "Right Handed"}</option>
                        <option value="Left">{t.apply_form.dexterity === "Handigheid" ? "Linkshandig" : "Left Handed"}</option>
                        <option value="Ambidextrous">{t.apply_form.dexterity === "Handigheid" ? "Ambidextrous" : "Ambidextrous"}</option>
                    </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.special_needs}</label>
                    <input
                        type="text"
                        value={formData.special_problems}
                        onChange={(e) => updateFormData({ special_problems: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                        placeholder="..."
                    />
                </div>
            </div>
        </div>
    </div>
);

const SchoolStep = ({ formData, updateFormData, t }) => (
    <div className="space-y-16">
        <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.current_inst}</label>
            <input
                type="text"
                value={formData.current_school_name}
                onChange={(e) => updateFormData({ current_school_name: e.target.value })}
                className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                placeholder="..."
            />
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.inst_address}</label>
            <input
                type="text"
                value={formData.current_school_address}
                onChange={(e) => updateFormData({ current_school_address: e.target.value })}
                className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                placeholder="..."
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.current_grade_label}</label>
                <input
                    type="text"
                    value={formData.current_grade}
                    onChange={(e) => updateFormData({ current_grade: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    placeholder="..."
                />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.province_region}</label>
                <input
                    type="text"
                    value={formData.province_of_current_school}
                    onChange={(e) => updateFormData({ province_of_current_school: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    placeholder="..."
                />
            </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.transfer_rationale}</label>
            <textarea
                rows={3}
                value={formData.reason_for_transfer}
                onChange={(e) => updateFormData({ reason_for_transfer: e.target.value })}
                className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full resize-none"
                placeholder="..."
            />
        </div>
    </div>
);

const ParentsStep = ({ formData, updateFormData, t }) => (
    <div className="space-y-24">
        <div className="p-10 bg-slate-50 rounded-2xl border-2 border-slate-100 mb-8 space-y-12">
            <span className="label-meta mb-8 block font-black">{t.apply_form.guardian_1}</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.title}</label>
                    <select
                        value={formData.parent_primary_title}
                        onChange={(e) => updateFormData({ parent_primary_title: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none"
                    >
                        <option value="">{t.select_language === "Kies asseblief u voorkeurtaal om die aansoekvorm te voltooi:" ? "Kies" : "Select"}</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                    </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.first_name}</label>
                    <input
                        type="text"
                        value={formData.parent_primary_name}
                        onChange={(e) => updateFormData({ parent_primary_name: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.surname}</label>
                    <input
                        type="text"
                        value={formData.parent_primary_surname}
                        onChange={(e) => updateFormData({ parent_primary_surname: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.id_passport}</label>
                    <input
                        type="text"
                        value={formData.parent_primary_id}
                        onChange={(e) => updateFormData({ parent_primary_id: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.gender}</label>
                    <select
                        value={formData.parent_primary_gender}
                        onChange={(e) => updateFormData({ parent_primary_gender: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none"
                    >
                        <option value="">{t.select_language === "Kies asseblief u voorkeurtaal om die aansoekvorm te voltooi:" ? "Kies" : "Select"}</option>
                        <option value="Male">{t.apply_form.male}</option>
                        <option value="Female">{t.apply_form.female}</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.marital_status}</label>
                    <input
                        type="text"
                        value={formData.parent_primary_marital_status}
                        onChange={(e) => updateFormData({ parent_primary_marital_status: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                        placeholder="..."
                    />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.occupation}</label>
                    <input
                        type="text"
                        value={formData.parent_primary_occupation}
                        onChange={(e) => updateFormData({ parent_primary_occupation: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.employer}</label>
                    <input
                        type="text"
                        value={formData.parent_primary_employer}
                        onChange={(e) => updateFormData({ parent_primary_employer: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.relationship}</label>
                    <input
                        type="text"
                        value={formData.parent_primary_relationship}
                        onChange={(e) => updateFormData({ parent_primary_relationship: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                        placeholder="..."
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.contact_number}</label>
                    <input
                        type="tel"
                        value={formData.parent_primary_contact}
                        onChange={(e) => updateFormData({ parent_primary_contact: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.email_address}</label>
                    <input
                        type="email"
                        value={formData.parent_primary_email}
                        onChange={(e) => updateFormData({ parent_primary_email: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
            </div>
        </div>

        <div className="p-12 border border-slate-200 space-y-12">
            <span className="label-meta mb-8 block text-dark/20 font-black">{t.apply_form.guardian_2}</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.title}</label>
                    <input
                        type="text"
                        value={formData.parent_secondary_title}
                        onChange={(e) => updateFormData({ parent_secondary_title: e.target.value })}
                        className="bg-transparent text-base font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.first_name}</label>
                    <input
                        type="text"
                        value={formData.parent_secondary_name}
                        onChange={(e) => updateFormData({ parent_secondary_name: e.target.value })}
                        className="bg-transparent text-base font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.surname}</label>
                    <input
                        type="text"
                        value={formData.parent_secondary_surname}
                        onChange={(e) => updateFormData({ parent_secondary_surname: e.target.value })}
                        className="bg-transparent text-base font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.gender}</label>
                    <select
                        value={formData.parent_secondary_gender}
                        onChange={(e) => updateFormData({ parent_secondary_gender: e.target.value })}
                        className="bg-transparent text-base font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none"
                    >
                        <option value="">{t.select_language === "Kies asseblief u voorkeurtaal om die aansoekvorm te voltooi:" ? "Kies" : "Select"}</option>
                        <option value="Male">{t.apply_form.male}</option>
                        <option value="Female">{t.apply_form.female}</option>
                    </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.occupation}</label>
                    <input
                        type="text"
                        value={formData.parent_secondary_occupation}
                        onChange={(e) => updateFormData({ parent_secondary_occupation: e.target.value })}
                        className="bg-transparent text-base font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.relationship}</label>
                    <input
                        type="text"
                        value={formData.parent_secondary_relationship}
                        onChange={(e) => updateFormData({ parent_secondary_relationship: e.target.value })}
                        className="bg-transparent text-base font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.contact_number}</label>
                    <input
                        type="tel"
                        value={formData.parent_secondary_contact}
                        onChange={(e) => updateFormData({ parent_secondary_contact: e.target.value })}
                        className="bg-transparent text-base font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-16">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.email_address}</label>
                    <input
                        type="email"
                        value={formData.parent_secondary_email}
                        onChange={(e) => updateFormData({ parent_secondary_email: e.target.value })}
                        className="bg-transparent text-base font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
            </div>
        </div>
    </div>
);

const AddressStep = ({ formData, updateFormData, t }) => (
    <div className="space-y-24">
        <div className="space-y-12">
            <span className="label-meta mb-8 block">{t.apply_form.residency}</span>
            <div className="grid grid-cols-1 gap-12">
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.street_address}</label>
                    <input
                        type="text"
                        value={formData.address_street}
                        onChange={(e) => updateFormData({ address_street: e.target.value })}
                        className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.suburb_area}</label>
                        <input
                            type="text"
                            value={formData.address_suburb}
                            onChange={(e) => updateFormData({ address_suburb: e.target.value })}
                            className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                        />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.town_city}</label>
                        <input
                            type="text"
                            value={formData.address_city}
                            onChange={(e) => updateFormData({ address_city: e.target.value })}
                            className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.postal_code}</label>
                        <input
                            type="text"
                            value={formData.address_postal_code}
                            onChange={(e) => updateFormData({ address_postal_code: e.target.value })}
                            className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full"
                        />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.apply_form.province}</label>
                        <select
                            value={formData.address_province}
                            onChange={(e) => updateFormData({ address_province: e.target.value })}
                            className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full appearance-none cursor-pointer"
                        >
                            <option value="">{t.select_language === "Kies asseblief u voorkeurtaal om die aansoekvorm te voltooi:" ? "Kies" : "Select"}</option>
                            <option value="Eastern Cape">Eastern Cape</option>
                            <option value="Western Cape">Western Cape</option>
                            <option value="Gauteng">Gauteng</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-8 md:p-12 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <AlertCircle className="text-primary mb-12 opacity-50" size={24} />
            <span className="text-white font-display font-bold uppercase tracking-widest text-sm mb-8 block">{t.apply_form.emergency_contact}</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 focus-within:border-primary focus-within:bg-white/10 transition-all flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">{t.apply_form.emergency_contact === "Noodkontak" ? "Kontak Naam" : "Contact Name"}</label>
                    <input
                        type="text"
                        value={formData.emergency_contact_name}
                        onChange={(e) => updateFormData({ emergency_contact_name: e.target.value })}
                        className="bg-transparent text-base font-medium text-white outline-none w-full placeholder:text-white/30"
                    />
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 focus-within:border-primary focus-within:bg-white/10 transition-all flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">{t.apply_form.relationship}</label>
                    <input
                        type="text"
                        value={formData.emergency_contact_relationship}
                        onChange={(e) => updateFormData({ emergency_contact_relationship: e.target.value })}
                        className="bg-transparent text-base font-medium text-white outline-none w-full placeholder:text-white/30"
                    />
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 focus-within:border-primary focus-within:bg-white/10 transition-all flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">{t.apply_form.contact_number}</label>
                    <input
                        type="tel"
                        value={formData.emergency_contact_number}
                        onChange={(e) => updateFormData({ emergency_contact_number: e.target.value })}
                        className="bg-transparent text-base font-medium text-white outline-none w-full placeholder:text-white/30"
                    />
                </div>
            </div>
        </div>
    </div>
);

const SupportStep = ({ formData, updateFormData, t }) => (
    <div className="space-y-16">
        <div className="space-y-12">
            <div className="flex items-center justify-between p-10 bg-soft border border-slate-200">
                <div>
                    <span className="label-meta mb-2 block">{t.apply_form.academic_history_q}</span>
                    <p className="text-xl font-light text-dark">{t.apply_form.repeated_grade_q}</p>
                </div>
                <div className="flex gap-4">
                    {[true, false].map(val => (
                        <button
                            key={String(val)}
                            onClick={() => updateFormData({ has_repeated_grade: val })}
                            className={`px-10 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all ${formData.has_repeated_grade === val ? 'bg-dark text-white border-dark' : 'border-slate-200 bg-white text-slate-500 hover:border-primary hover:text-primary rounded-2xl shadow-sm'
                                }`}
                        >
                            {val ? (t.admissions.faqs[2].content.includes("beslis") ? "Ja" : "Yes") : (t.admissions.faqs[2].content.includes("beslis") ? "Nee" : "No")}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between p-10 bg-soft border border-slate-200">
                <div>
                    <span className="label-meta mb-2 block">{t.apply_form.residency}</span>
                    <p className="text-xl font-light text-dark">{t.apply_form.support_q}</p>
                </div>
                <div className="flex gap-4">
                    {[true, false].map(val => (
                        <button
                            key={String(val)}
                            onClick={() => updateFormData({ receives_support: val })}
                            className={`px-10 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all ${formData.receives_support === val ? 'bg-dark text-white border-dark' : 'border-slate-200 bg-white text-slate-500 hover:border-primary hover:text-primary rounded-2xl shadow-sm'
                                }`}
                        >
                            {val ? (t.admissions.faqs[2].content.includes("beslis") ? "Ja" : "Yes") : (t.admissions.faqs[2].content.includes("beslis") ? "Nee" : "No")}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Learning Barriers or Special Requirements (Optional)</label>
            <textarea
                rows={3}
                value={formData.special_needs}
                onChange={(e) => updateFormData({ special_needs: e.target.value })}
                className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full resize-none"
                placeholder="Provide comprehensive details if applicable..."
            />
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-blue-50/30 transition-all flex flex-col gap-2 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Siblings (Name, Grade, and family position)</label>
            <textarea
                rows={3}
                value={formData.siblings_info}
                onChange={(e) => updateFormData({ siblings_info: e.target.value })}
                className="bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-slate-300 w-full resize-none"
                placeholder="e.g. John Doe (Grade 10, Eldest)"
            />
        </div>
    </div>
);

const ReviewStep = ({ referenceNumber, formData, updateFormData, isSubmitting, handleSubmit, prevStep, t }) => {
    if (referenceNumber) {
        return (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-5xl font-bold text-dark mb-4">{t.thank_you}</h2>
                    <p className="text-lg text-dark/50 max-w-lg mx-auto leading-relaxed">
                        {t.received_msg}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white border border-slate-200 rounded-[2rem] p-12 shadow-sm">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <span className="text-sm font-medium text-dark/40 uppercase tracking-[0.2em]">{t.ref_number}</span>
                            <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-between group">
                                <span className="text-4xl font-mono font-bold text-primary tracking-wider">{referenceNumber}</span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(referenceNumber)}
                                    className="p-3 hover:bg-white rounded-lg transition-all text-dark/30 hover:text-primary"
                                >
                                    <Sparkles size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-3 text-dark">
                                <Upload size={20} className="text-primary" />
                                {t.supporting_docs}
                            </h3>
                            <p className="text-sm text-dark/60 leading-relaxed">
                                {t.email_docs_msg}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="p-10 bg-slate-900 text-white rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/40 transition-all duration-1000" />
                            <h4 className="text-sm font-bold uppercase tracking-[0.3em] mb-10 text-primary">{t.checklist}</h4>
                            <ul className="space-y-6">
                                {(t.apply_form.checklist_items || t.checklist_items || [
                                    "1. Birth Certificate / Geboortesertifikaat",
                                    "2. Progress report from previous school",
                                    "3. Immunisation record / Inentingsertifikaat",
                                    "4. Proof of Address / Bewys van Adres",
                                    "5. ID Copies of Parents/Guardians",
                                    "6. If Guardian (Court Documents)",
                                    "7. Provisional Transfer letter"
                                ]).map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <div className="p-8 border border-slate-200 rounded-xl space-y-3 bg-white">
                                <span className="text-sm font-medium text-dark/50 block">{t.apply_form.email_docs_to}</span>
                                <a href="mailto:alexandriahigh6185@gmail.com" className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
                                    alexandriahigh6185@gmail.com
                                </a>
                            </div>
                            <div className="p-8 border border-slate-200 rounded-xl space-y-3 bg-white">
                                <span className="text-sm font-medium text-dark/50 block">{t.important_note}</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-dark">{t.use_ref_msg}</p>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(referenceNumber)}
                                        className="text-xs font-semibold text-primary uppercase tracking-wide hover:text-primary/80"
                                    >
                                        {t.apply_form.copy_ref}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-blue-100 bg-blue-50">
                        <p className="text-sm text-blue-900 leading-relaxed">
                            <strong className="font-semibold block mb-1">{t.please_note}</strong>
                            {t.contact_school_msg}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6 pt-8">
                    {formData.parent_signature && (
                        <div className="w-full max-w-sm mb-4">
                            <span className="block text-xs font-bold text-dark/40 uppercase mb-2 text-center">Signature Preview:</span>
                            <img src={formData.parent_signature} alt="Captured Signature" className="bg-white border border-slate-300 rounded shadow-sm mx-auto h-16 object-contain" />
                        </div>
                    )}
                    <p className="text-sm text-dark/50">{t.expect_msg}</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-lg">
                        <button
                            onClick={() => generateApplicationPDF(formData, referenceNumber)}
                            className="bg-primary text-white hover:bg-primary/90 font-medium rounded-full py-3 px-8 transition-all flex items-center justify-center gap-2 group flex-1"
                        >
                            <Download size={16} className="group-hover:translate-y-1 transition-transform" /> {t.download_copy}
                        </button>
                        <button
                            onClick={() => {
                                sessionStorage.removeItem('apply_form_data');
                                sessionStorage.removeItem('apply_current_step');
                                window.location.href = '/';
                            }}
                            className="bg-gray-100 text-dark hover:bg-gray-200 font-medium rounded-full py-3 px-8 transition-all flex items-center justify-center gap-2 group flex-1"
                        >
                            {t.return_home} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16">
            <div className="p-8 md:p-12 bg-gray-50 border border-slate-200 rounded-2xl mb-8">
                <span className="text-xl font-bold text-dark mb-8 block">{t.apply_form.emergency_contact === "Noodkontak" ? "Hersien Inligting" : "Review Information"}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-dark/50 uppercase tracking-wide">{t.apply_form.learner_details || "Learner Details"}</span>
                        <p className="text-base font-medium text-dark">{formData.learner_first_name} {formData.learner_surname}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-dark/50 uppercase tracking-wide">{t.steps.grade}</span>
                        <p className="text-base font-medium text-dark">{formData.grade_applying_for} — {formData.intake_year}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-dark/50 uppercase tracking-wide">{t.apply_form.id_passport || "ID / Passport"}</span>
                        <p className="text-base font-medium text-dark">{formData.id_number}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-dark/50 uppercase tracking-wide">{t.apply_form.email_address || "Email"}</span>
                        <p className="text-base font-medium text-dark">{formData.parent_primary_email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-dark/50 uppercase tracking-wide">{t.apply_form.boarder || "Boarder"}</span>
                        <p className="text-base font-medium text-dark">{formData.is_boarder ? (t.apply_form.emergency_contact === "Noodkontak" ? "Ja" : "Yes") : (t.apply_form.emergency_contact === "Noodkontak" ? "Nee" : "No")}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-dark/50 uppercase tracking-wide">{t.apply_form.medical_aid_name}</span>
                        <p className="text-base font-medium text-dark">{formData.medical_aid_name ? t.apply_form.provided : t.apply_form.not_provided}</p>
                    </div>
                </div>
            </div>

            <div className="p-8 border-t border-slate-200">
                <h3 className="text-xl font-bold text-dark mb-8">{t.apply_form.declaration_signature}</h3>
                <p className="text-sm text-dark/50 mb-10">{t.apply_form.signature_prompt}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <SignaturePad
                        label={t.apply_form.parent_signature_label || "Parent / Guardian Signature"}
                        onSave={(sig) => updateFormData({ parent_signature: sig })}
                        onClear={() => updateFormData({ parent_signature: '' })}
                        t={t}
                    />
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <div className="px-4 py-2 bg-slate-100 rounded text-xs font-bold text-dark/40 uppercase tracking-widest">{t.apply_form.signature_date}</div>
                    <div className="text-lg font-medium text-dark">{new Date().toLocaleDateString()}</div>
                </div>

                <div className="space-y-6 mb-10">
                    <label className="flex gap-4 p-6 border border-slate-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors items-start">
                        <input
                            type="checkbox"
                            checked={formData.popia_consent}
                            onChange={(e) => updateFormData({ popia_consent: e.target.checked })}
                            className="w-5 h-5 mt-0.5 rounded text-primary focus:ring-primary border-gray-300"
                        />
                        <div>
                            <span className="text-sm font-bold text-dark block mb-1">{t.apply_form.declaration_title.split('&')[1]?.trim() || t.apply_form.declaration_title}</span>
                            <p className="text-sm text-dark/60">{t.apply_form.popia_msg}</p>
                        </div>
                    </label>

                    <label className="flex gap-4 p-6 border border-slate-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors items-start">
                        <input
                            type="checkbox"
                            checked={formData.declaration}
                            onChange={(e) => updateFormData({ declaration: e.target.checked })}
                            className="w-5 h-5 mt-0.5 rounded text-primary focus:ring-primary border-gray-300"
                        />
                        <div>
                            <span className="text-sm font-bold text-dark block mb-1">{t.apply_form.declaration_title.split('&')[0]?.trim()}</span>
                            <p className="text-sm text-dark/60">{t.apply_form.declaration_msg}</p>
                        </div>
                    </label>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={prevStep}
                    className="bg-white border border-gray-300 text-dark hover:bg-gray-50 py-4 px-8 rounded-full flex-1 sm:flex-none flex items-center justify-center gap-2 transition-all font-medium"
                >
                    <ChevronLeft size={18} /> {t.back_button}
                </button>
                <button
                    disabled={isSubmitting || !formData.popia_consent || !formData.declaration || !formData.parent_signature}
                    onClick={handleSubmit}
                    className="bg-primary text-white hover:bg-primary/90 py-4 px-8 rounded-full flex-[2] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm group"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            {t.apply_form.submitting}
                        </>
                    ) : (
                        <>
                            {t.submit_button} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const Apply = () => {
    const { lang, changeLanguage, t } = useLanguage();
    const STEPS = getSteps(t);

    const [currentStep, setCurrentStep] = useState(() => {
        const saved = sessionStorage.getItem('apply_current_step');
        return (saved !== null && saved !== undefined) ? parseInt(saved) : 0;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState(null);

    // Form State
    const [formData, setFormData] = useState(() => {
        const saved = sessionStorage.getItem('apply_form_data');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error("Could not parse saved form data", e); }
        }
        return {
            grade_applying_for: '',
            intake_year: new Date().getFullYear() + 1,

            learner_first_name: '',
            learner_surname: '',
            date_of_birth: '',
            gender: '',
            id_number: '',
            home_language: '',
            preferred_language: '',
            race: '',
            citizenship: 'South African',
            religion: '',
            is_boarder: false,
            mode_of_transport: '',
            deceased_parent: 'None',

            current_school_name: '',
            current_school_address: '',
            current_grade: '',
            province_of_current_school: '',
            reason_for_transfer: '',

            parent_primary_title: '',
            parent_primary_name: '',
            parent_primary_surname: '',
            parent_primary_id: '',
            parent_primary_contact: '',
            parent_primary_email: '',
            parent_primary_occupation: '',
            parent_primary_employer: '',
            parent_primary_relationship: '',
            parent_primary_marital_status: '',

            parent_secondary_title: '',
            parent_secondary_name: '',
            parent_secondary_surname: '',
            parent_secondary_id_number: '',
            parent_secondary_contact: '',
            parent_secondary_email: '',
            parent_secondary_occupation: '',
            parent_secondary_employer: '',
            parent_secondary_relationship: '',
            parent_secondary_marital_status: '',
            parent_secondary_address: '',

            address_street: '',
            address_suburb: '',
            address_city: '',
            address_postal_code: '',
            address_province: '',

            emergency_contact_name: '',
            emergency_contact_relationship: '',
            emergency_contact_number: '',

            medical_aid_name: '',
            medical_aid_number: '',
            medical_main_member: '',
            doctor_name: '',
            doctor_contact: '',
            medical_condition: '',
            special_problems: '',
            dexterity: 'Right',

            has_repeated_grade: false,
            receives_support: false,
            special_needs: '',
            siblings_info: '',

            documents: [],
            popia_consent: false,
            declaration: false,

            parent_signature: ''
        };
    });

    // Save to session storage whenever form data or step changes
    useEffect(() => {
        sessionStorage.setItem('apply_form_data', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        // Persist the step to drafts until the final generation is complete
        if (currentStep <= 9 && !referenceNumber) {
            sessionStorage.setItem('apply_current_step', currentStep.toString());

            // Sync to database draft for crash recovery
            const syncDraft = async () => {
                const sessionId = sessionStorage.getItem('apply_session_id') || Math.random().toString(36).substring(7);
                if (!sessionStorage.getItem('apply_session_id')) sessionStorage.setItem('apply_session_id', sessionId);

                await supabase.from('application_drafts').upsert({
                    session_id: sessionId,
                    form_data: formData,
                    current_step: currentStep,
                    email: formData.parent_primary_email || null,
                    learner_name: `${formData.learner_first_name} ${formData.learner_surname}`.trim() || null
                }, { onConflict: 'session_id' });
            };
            syncDraft();
        }
    }, [currentStep, formData, referenceNumber]);

    // Force Navbar to use solid background because the wizard steps do not have a hero block
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('navbar-solid', { detail: currentStep > 0 }));
        return () => window.dispatchEvent(new CustomEvent('navbar-solid', { detail: false }));
    }, [currentStep]);

    const updateFormData = (fields) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Cleanup helper flags and sanitize empty values to null
            const { popia_consent: _p, declaration: _d, student_signature: _ss, ...rawSubmissionData } = formData;

            const submissionData = Object.keys(rawSubmissionData).reduce((acc, key) => {
                const val = rawSubmissionData[key];
                // Ensure critical string fields are not null to satisfy database constraints
                const isRequiredStringField = [
                    'address_street', 'address_suburb', 'address_city', 'address_postal_code', 'address_province',
                    'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_number',
                    'parent_signature'
                ].includes(key);

                if (isRequiredStringField) {
                    acc[key] = val || "";
                } else {
                    acc[key] = (val === "" || val === undefined) ? null : val;
                }
                return acc;
            }, {});

            // Ensure critical fields aren't null if they are required by logic but empty in state
            if (!submissionData.date_of_birth) {
                throw new Error("Date of Birth is required.");
            }

            const { data, error } = await supabase
                .from('applications')
                .insert([submissionData])
                .select('reference_number')
                .single();

            if (error) {
                console.error('Database error details:', error);
                throw error;
            }

            setReferenceNumber(data.reference_number);
            sessionStorage.removeItem('apply_form_data');
            sessionStorage.removeItem('apply_current_step');
            nextStep(); // Move to success screen
        } catch (error) {
            console.error('Submission error:', error);
            alert(`Failed to submit application: ${error.message || 'Please check your internet connection and try again.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <LanguageStep changeLanguage={changeLanguage} nextStep={nextStep} />;
            case 1: return <IntroStep nextStep={nextStep} t={t} />;
            case 2: return <GradeStep formData={formData} updateFormData={updateFormData} t={t} />;
            case 3: return <LearnerStep formData={formData} updateFormData={updateFormData} t={t} />;
            case 4: return <MedicalStep formData={formData} updateFormData={updateFormData} t={t} />;
            case 5: return <SchoolStep formData={formData} updateFormData={updateFormData} t={t} />;
            case 6: return <ParentsStep formData={formData} updateFormData={updateFormData} t={t} />;
            case 7: return <AddressStep formData={formData} updateFormData={updateFormData} t={t} />;
            case 8: return <SupportStep formData={formData} updateFormData={updateFormData} t={t} />;
            case 9: return <ReviewStep referenceNumber={referenceNumber} formData={formData} updateFormData={updateFormData} isSubmitting={isSubmitting} handleSubmit={handleSubmit} prevStep={prevStep} t={t} />;
            default: return null;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {(currentStep === 1) && (
                <PageHero
                    title={t.apply_title}
                    subtitle={t.apply_subtitle}
                    image="/school_wall.jpg"
                />
            )}

            <section className={`section-padding ${currentStep !== 0 ? 'pt-48' : ''}`}>
                <div className="container-wide max-w-5xl mx-auto">

                    {/* Stepper Progress */}
                    {currentStep > 1 && currentStep < 9 && !referenceNumber && (
                        <div className="mb-32">
                            <div className="flex justify-between items-center relative">
                                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -translate-y-1/2" />
                                <div
                                    className="absolute top-1/2 left-0 h-[1px] bg-primary -translate-y-1/2 transition-all duration-1000"
                                    style={{ width: `${((currentStep - 2) / (STEPS.slice(2, -1).length - 1)) * 100}%` }}
                                />

                                {STEPS.slice(2, -1).map((step, idx) => {
                                    const realIdx = idx + 2;
                                    const isActive = currentStep === realIdx;
                                    const isCompleted = currentStep > realIdx;

                                    return (
                                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 bg-white border-2 ${isActive ? 'border-primary' : isCompleted ? 'bg-primary border-primary' : 'border-slate-200'}`}>
                                                {isCompleted ? <CheckCircle2 size={16} className="text-white" /> : <span className={`text-[10px] font-bold ${isActive ? 'text-primary' : 'text-dark/20'}`}>0{idx + 1}</span>}
                                            </div>
                                            <p className={`absolute -bottom-8 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.3em] ${isActive ? 'text-primary' : 'text-dark/20'}`}>
                                                {step.title}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="relative bg-white p-8 md:p-16 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 mt-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        {currentStep > 0 && currentStep < 9 && !referenceNumber && (
                            <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center bg-white sticky bottom-0 z-20 pb-8">
                                <button
                                    onClick={prevStep}
                                    className="text-sm font-medium text-dark/60 hover:text-dark transition-colors flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg"
                                >
                                    <ChevronLeft size={18} />
                                    {t.back_button}
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={
                                        (currentStep === 2 && !formData.grade_applying_for) ||
                                        (currentStep === 3 && (!formData.learner_first_name || !formData.learner_surname || !formData.id_number))
                                    }
                                    className="bg-dark text-white hover:bg-dark/90 font-medium rounded-full py-3 px-8 flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
                                >
                                    {t.continue_button} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Apply;
