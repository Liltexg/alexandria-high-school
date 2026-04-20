import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Check, X, RefreshCw, PenTool, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

// --- Error Boundary Component ---
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white flex items-center justify-center p-10 font-sans border-t-8 border-[#8C1515]">
                    <div className="max-w-md w-full space-y-6">
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-[#8C1515]">Something went wrong / Fout</h1>
                        <p className="text-sm font-bold text-slate-500 uppercase leading-relaxed">The application form has encountered an error. Your information is safe, but we need to restart the page.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-[#020617] text-white py-4 font-black uppercase tracking-widest text-[10px] hover:bg-[#8C1515] transition-all"
                        >
                            Restart / Begin oor
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// AHS Official Brand Palette
const AHS_BRAND = {
  crimson: '#8C1515',
  gold: '#D4AF37',
  ink: '#020617',
  paper: '#ffffff',
  gridBorder: '#cad1db' // Faint grey lines like the paper form
};

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};

const FormGridCell = ({ label, value, onChange, placeholder, colSpan = "col-span-12 md:col-span-1", type = "text" }) => (
    <div className={`border-b border-black md:border-r p-2 md:p-1 flex flex-col ${colSpan} transition-colors min-h-[44px] md:min-h-[40px] bg-white`}>
        <label className="text-[8px] md:text-[7px] uppercase tracking-tighter leading-none mb-1 md:mb-0.5 text-black font-bold">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm md:text-xs font-bold text-slate-900 outline-none bg-transparent uppercase pb-0.5 h-full focus:bg-slate-50 transition-colors"
            placeholder={placeholder}
        />
    </div>
);

const FormBox = ({ label, checked, onClick }) => (
    <div className="flex items-center gap-1 cursor-pointer group" onClick={(e) => { e.preventDefault(); onClick(); }}>
        <div className={`w-3.5 h-3.5 border border-black flex items-center justify-center ${checked ? 'bg-black text-white' : 'bg-white'}`}>
            {checked && <Check size={10} />}
        </div>
        <span className="text-[8px] font-bold text-black uppercase">{label}</span>
    </div>
);

const IDBoxes = ({ value = "", onChange }) => {
    const isMobile = useIsMobile();
    const boxes = Array(13).fill(null);
    
    if (isMobile) {
        return (
            <input
                maxLength={13}
                placeholder="0000000000000"
                className="w-full h-10 px-2 text-lg font-mono font-bold tracking-[0.4em] outline-none bg-slate-50 focus:bg-white transition-all border border-slate-200"
                value={value}
                onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 13))}
            />
        );
    }

    const handleChange = (index, char) => {
        const chars = value.split('');
        while(chars.length < 13) chars.push(' ');
        chars[index] = char.slice(-1) || ' ';
        onChange(chars.join('').trimEnd());
    };

    return (
        <div className="flex gap-0 border-l border-black overflow-hidden scale-90 md:scale-100 origin-left">
            {boxes.map((_, i) => (
                <input
                    key={i}
                    maxLength={1}
                    className="w-5 h-6 border-r border-y border-black text-center text-xs font-bold outline-none uppercase bg-white focus:bg-slate-50"
                    value={value[i] || ''}
                    onChange={(e) => handleChange(i, e.target.value)}
                />
            ))}
        </div>
    );
};

const SectionBar = ({ text }) => (
    <div className="bg-[#020617] text-white py-2 md:py-1 px-4 mb-0 text-center font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] border-x border-t border-black">
        {text}
    </div>
);

const SignaturePad = ({ label, onSave, onClear }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        onSave(canvas.toDataURL());
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onClear();
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="text-[7px] uppercase font-black text-slate-400">{label}</p>
            <div className="relative border-b-2 border-black bg-white group h-32 md:h-24">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={100}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="w-full h-full cursor-crosshair touch-none"
                />
                <button 
                    type="button"
                    onClick={clear}
                    className="absolute top-1 right-1 text-[8px] font-bold bg-slate-100 hover:bg-slate-200 px-2 py-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity uppercase"
                >
                    Clear / Skoon
                </button>
            </div>
        </div>
    );
};

// --- Guardian Section Component ---
const GuardianSection = ({ title, prefix, formData, updateField }) => {
    return (
        <div className="mb-12">
            <SectionBar text={title} />
            <div className="grid grid-cols-12 border-l border-black">
                <div className="col-span-12 border-b border-r border-black p-1 flex items-center gap-10 bg-white">
                    <label className="text-[7px] font-bold uppercase whitespace-nowrap">Indicate / Dui aan:</label>
                    <div className="flex flex-wrap gap-4">
                        <FormBox label="Mother / Ma" checked={formData[`${prefix}_relationship`] === 'Mother'} onClick={() => updateField(`${prefix}_relationship`, 'Mother')} />
                        <FormBox label="Father / Pa" checked={formData[`${prefix}_relationship`] === 'Father'} onClick={() => updateField(`${prefix}_relationship`, 'Father')} />
                        <FormBox label="Guardian / Voog" checked={formData[`${prefix}_relationship`] === 'Guardian'} onClick={() => updateField(`${prefix}_relationship`, 'Guardian')} />
                    </div>
                </div>
                
                <FormGridCell colSpan="col-span-2" label="Title / Titel:" value={formData[`${prefix}_title`]} onChange={(v) => updateField(`${prefix}_title`, v)} />
                <FormGridCell colSpan="col-span-2" label="Initials / Voorletters:" value={formData[`${prefix}_initials`]} onChange={(v) => updateField(`${prefix}_initials`, v)} />
                <FormGridCell colSpan="col-span-8" label="Surname / Van:" value={formData[`${prefix}_surname`]} onChange={(v) => updateField(`${prefix}_surname`, v)} />
                
                <FormGridCell colSpan="col-span-6" label="First Names / Voorname:" value={formData[`${prefix}_name`]} onChange={(v) => updateField(`${prefix}_name`, v)} />
                <div className="col-span-6 border-b border-r border-black p-1 flex items-center gap-10 bg-white min-h-[40px]">
                    <label className="text-[7px] font-bold uppercase whitespace-nowrap">Gender / Geslag:</label>
                    <FormBox label="Male / Manlik" checked={formData[`${prefix}_gender`] === 'Male'} onClick={() => updateField(`${prefix}_gender`, 'Male')} />
                    <FormBox label="Female / Vroulik" checked={formData[`${prefix}_gender`] === 'Female'} onClick={() => updateField(`${prefix}_gender`, 'Female')} />
                </div>
                
                <FormGridCell colSpan="col-span-6" label="Home Language / Huistaal:" value={formData[`${prefix}_home_language`]} onChange={(v) => updateField(`${prefix}_home_language`, v)} />
                <FormGridCell colSpan="col-span-6" label="Race / Ras:" value={formData[`${prefix}_race`]} onChange={(v) => updateField(`${prefix}_race`, v)} />

                <div className="col-span-12 border-b border-r border-black p-1 flex flex-col justify-between bg-white">
                    <label className="text-[7px] uppercase tracking-tighter leading-none text-black font-bold mb-1">ID or Passport No. / ID of Paspoort Nr.:</label>
                    <IDBoxes value={formData[`${prefix}_id`]} onChange={(v) => updateField(`${prefix}_id`, v)} />
                </div>
                
                <FormGridCell colSpan="col-span-12" label="Postal Address / Posadres:" value={formData[`${prefix}_address`]} onChange={(v) => updateField(`${prefix}_address`, v)} />
                <FormGridCell colSpan="col-span-8" label="City/Suburb / Stad/Woonbuurt:" value={formData[`${prefix}_city`]} onChange={(v) => updateField(`${prefix}_city`, v)} />
                <FormGridCell colSpan="col-span-4" label="Postal Code / Poskode:" value={formData[`${prefix}_postal_code`]} onChange={(v) => updateField(`${prefix}_postal_code`, v)} />

                <FormGridCell colSpan="col-span-4" label="Home Telephone / Huistelefoon:" value={formData[`${prefix}_tel_home`]} onChange={(v) => updateField(`${prefix}_tel_home`, v)} />
                <FormGridCell colSpan="col-span-4" label="Work Telephone / Werkstelefoon:" value={formData[`${prefix}_tel_work`]} onChange={(v) => updateField(`${prefix}_tel_work`, v)} />
                <FormGridCell colSpan="col-span-4" label="Cellphone / Selfoon:" value={formData[`${prefix}_contact`]} onChange={(v) => updateField(`${prefix}_contact`, v)} />
                <FormGridCell colSpan="col-span-4" label="Email Address / E-posadres:" value={formData[`${prefix}_email`] || ""} onChange={(v) => updateField(`${prefix}_email`, v)} />

                <FormGridCell colSpan="col-span-6" label="Occupation / Beroep:" value={formData[`${prefix}_occupation`]} onChange={(v) => updateField(`${prefix}_occupation`, v)} />
                <FormGridCell colSpan="col-span-6" label="Employer / Werkgewer:" value={formData[`${prefix}_employer`]} onChange={(v) => updateField(`${prefix}_employer`, v)} />
                
                <FormGridCell colSpan="col-span-6" label="Marital Status / Huwelik status:" value={formData[`${prefix}_marital_status`]} onChange={(v) => updateField(`${prefix}_marital_status`, v)} />
                <FormGridCell colSpan="col-span-6" label="Relationship to Learner / Verwantskap met leerder:" value={formData[`${prefix}_relationship`]} onChange={(v) => updateField(`${prefix}_relationship`, v)} />
            </div>
        </div>
    );
};

// --- Main Page ---

const Apply = () => {
    const isMobile = useIsMobile();
    const { t, settings } = useLanguage();
    const [formData, setFormData] = useState({
        // Learner
        intake_year: settings.intake_year || '2027',
        grade_applying_for: '',
        highest_grade_passed: '',
        year_passed: '',
        home_language: '',
        preferred_language: '',
        is_boarder: 'false',
        learner_surname: '',
        learner_first_name: '',
        other_names: '',
        id_number: '',
        date_of_birth: '',
        gender: '',
        citizenship: 'South African',
        address_province: 'Eastern Cape',
        race: '',
        religion: '',
        mode_of_transport: '',
        deceased_parent: 'None',
        // Special Grade 1
        grade_1_pre_primary: 'None',
        // Address
        address_street: '',
        address_suburb: '',
        address_city: '',
        address_postal_code: '',
        learner_cell: '',
        // School Info
        current_school_name: '',
        current_school_address: '',
        // Medical
        medical_aid_name: '',
        medical_aid_number: '',
        medical_main_member: '',
        doctor_name: '',
        doctor_contact: '',
        medical_condition: '',
        special_problems: '',
        dexterity: 'Right',
        // Parent 1 (Primary)
        parent_primary_relationship: '',
        parent_primary_title: '',
        parent_primary_initials: '',
        parent_primary_name: '',
        parent_primary_surname: '',
        parent_primary_gender: '',
        parent_primary_id: '',
        parent_primary_home_language: '',
        parent_primary_race: '',
        parent_primary_address: '',
        parent_primary_city: '',
        parent_primary_postal_code: '',
        parent_primary_tel_home: '',
        parent_primary_tel_work: '',
        parent_primary_contact: '', // Cell
        parent_primary_email: '',
        parent_primary_occupation: '',
        parent_primary_employer: '',
        parent_primary_marital_status: '',

        // Parent 2 (Secondary)
        parent_secondary_relationship: '',
        parent_secondary_title: '',
        parent_secondary_initials: '',
        parent_secondary_name: '',
        parent_secondary_surname: '',
        parent_secondary_gender: '',
        parent_secondary_id_number: '',
        parent_secondary_home_language: '',
        parent_secondary_race: '',
        parent_secondary_address: '',
        parent_secondary_city: '',
        parent_secondary_postal_code: '',
        parent_secondary_tel_home: '',
        parent_secondary_tel_work: '',
        parent_secondary_contact: '', // Cell
        parent_secondary_email: '',
        parent_secondary_occupation: '',
        parent_secondary_employer: '',
        parent_secondary_marital_status: '',

        // Parent 3 (Tertiary)
        parent_tertiary_relationship: '',
        parent_tertiary_title: '',
        parent_tertiary_initials: '',
        parent_tertiary_name: '',
        parent_tertiary_surname: '',
        parent_tertiary_gender: '',
        parent_tertiary_id: '',
        parent_tertiary_home_language: '',
        parent_tertiary_race: '',
        parent_tertiary_address: '',
        parent_tertiary_city: '',
        parent_tertiary_postal_code: '',
        parent_tertiary_tel_home: '',
        parent_tertiary_tel_work: '',
        parent_tertiary_cell: '',
        parent_tertiary_occupation: '',
        parent_tertiary_employer: '',
        parent_tertiary_marital_status: '',

        // Emergency Contact
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_number: '',

        parent_signature: ''
    });

    const [showSecondary, setShowSecondary] = useState(false);
    const [showTertiary, setShowTertiary] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });

    const updateField = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Check required fields
        const mandatoryFields = [
            { key: 'learner_first_name', label: 'Learner First Name' },
            { key: 'learner_surname', label: 'Learner Surname' },
            { key: 'grade_applying_for', label: 'Grade Applied For' },
            { key: 'id_number', label: 'Learner ID Number' },
            { key: 'parent_primary_email', label: 'Parent Primary Email' },
            { key: 'emergency_contact_name', label: 'Emergency Contact Name' },
            { key: 'emergency_contact_number', label: 'Emergency Contact Number' },
            { key: 'address_street', label: 'Residential Street Address' }
        ];

        const missing = mandatoryFields.find(f => !formData[f.key]);
        if (missing) {
            setNotification({
                show: true,
                message: `Missing Information: ${missing.label} / Inligting benodig.`,
                type: 'warning'
            });
            return;
        }

        // 2. Signature Validation
        if (!formData.parent_signature) {
            setNotification({
                show: true,
                message: "Please sign the form before submitting / Handtekening benodig.",
                type: 'warning'
            });
            return;
        }

        setSubmitting(true);
        try {
            // Filter data to only send valid database columns
            const ALLOWED_COLUMNS = [
                'intake_year', 'grade_applying_for', 'highest_grade_passed', 'year_passed', 
                'home_language', 'preferred_language', 'is_boarder', 'learner_surname', 
                'learner_first_name', 'other_names', 'id_number', 'date_of_birth', 'gender', 
                'citizenship', 'address_province', 'race', 'religion', 'mode_of_transport', 
                'deceased_parent', 'grade_1_pre_primary', 'address_street', 'address_suburb', 
                'address_city', 'address_postal_code', 'learner_cell', 'current_school_name', 
                'current_school_address', 'medical_aid_name', 'medical_aid_number', 
                'medical_main_member', 'doctor_name', 'doctor_contact', 'medical_condition', 
                'special_problems', 'dexterity', 
                'parent_primary_relationship', 'parent_primary_title', 'parent_primary_initials',
                'parent_primary_name', 'parent_primary_surname', 'parent_primary_gender', 
                'parent_primary_id', 'parent_primary_home_language', 'parent_primary_race',
                'parent_primary_address', 'parent_primary_city', 'parent_primary_postal_code',
                'parent_primary_tel_home', 'parent_primary_tel_work', 'parent_primary_contact', 
                'parent_primary_email', 'parent_primary_occupation', 'parent_primary_employer', 
                'parent_primary_marital_status',
                'parent_secondary_relationship', 'parent_secondary_title', 'parent_secondary_initials',
                'parent_secondary_name', 'parent_secondary_surname', 'parent_secondary_gender', 
                'parent_secondary_id_number', 'parent_secondary_home_language', 'parent_secondary_race',
                'parent_secondary_address', 'parent_secondary_city', 'parent_secondary_postal_code',
                'parent_secondary_tel_home', 'parent_secondary_tel_work', 'parent_secondary_contact', 
                'parent_secondary_email', 'parent_secondary_occupation', 'parent_secondary_employer', 
                'parent_secondary_marital_status',
                'parent_tertiary_relationship', 'parent_tertiary_title', 'parent_tertiary_initials',
                'parent_tertiary_name', 'parent_tertiary_surname', 'parent_tertiary_gender', 
                'parent_tertiary_id', 'parent_tertiary_home_language', 'parent_tertiary_race',
                'parent_tertiary_address', 'parent_tertiary_city', 'parent_tertiary_postal_code',
                'parent_tertiary_tel_home', 'parent_tertiary_tel_work', 'parent_tertiary_cell', 
                'parent_tertiary_occupation', 'parent_tertiary_employer', 'parent_tertiary_marital_status', 
                'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_number',
                'parent_signature'
            ];

            const sanitzedData = Object.keys(formData)
                .filter(key => ALLOWED_COLUMNS.includes(key))
                .reduce((obj, key) => {
                    let val = formData[key];
                    // Protocol conversion: is_boarder must be a formal boolean
                    if (key === 'is_boarder') val = val === 'true';
                    obj[key] = val;
                    return obj;
                }, {});

            console.log('Submit application:', sanitzedData);

            const { error } = await supabase.from('applications').insert([sanitzedData]);
            if (error) throw error;
            
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Submission Error:", err);
            setNotification({
                show: true,
                message: `Error: ${err.message || "Failed to submit. Please check your internet connection or the form fields."}`,
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const AdminNotification = () => {
        const getColors = () => {
            switch (notification.type) {
                case 'error': return { bg: 'bg-[#8C1515]', border: 'border-red-900', shadow: 'shadow-[#4a0a0a]', icon: <AlertTriangle size={20} /> };
                case 'warning': return { bg: 'bg-[#D4AF37]', border: 'border-amber-700', shadow: 'shadow-[#6b581c]', icon: <PenTool size={20} /> };
                default: return { bg: 'bg-[#020617]', border: 'border-black', shadow: 'shadow-black', icon: <CheckCircle size={20} /> };
            }
        };

        const colors = getColors();

        return (
            <AnimatePresence>
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className="fixed top-10 right-10 z-[100] w-full max-w-sm"
                    >
                        <div className={`border-2 border-black bg-white shadow-[6px_6px_0px_#000] p-5 flex gap-4 items-start relative overflow-hidden`}>
                            <div className={`absolute top-0 left-0 w-1 h-full ${colors.bg}`} />
                            <div className={`w-10 h-10 shrink-0 flex items-center justify-center border-2 border-black ${colors.bg} text-white shadow-sm`}>
                                {colors.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                                    {notification.type === 'error' ? 'System Error / Stelselfout' : notification.type === 'warning' ? 'Information Needed / Benodig' : 'Message / Boodskap'}
                                </h3>
                                <p className="text-[11px] font-bold text-black leading-tight uppercase tracking-tight">
                                    {notification.message}
                                </p>
                                <div className="mt-3 flex items-center gap-4">
                                    <button 
                                        onClick={() => setNotification({ ...notification, show: false })}
                                        className="text-[9px] font-black uppercase tracking-widest bg-slate-100 hover:bg-slate-200 px-3 py-1 border border-black transition-all"
                                    >
                                        OK / Verstaan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-serif">
                <div className="max-w-lg w-full bg-white border-t-8 border-[#8C1515] p-16 text-center shadow-2xl">
                    <img src="/logo.png" alt="AHS" className="h-20 mx-auto mb-10 grayscale" />
                    <h1 className="text-3xl font-bold italic mb-6">Application Formalized</h1>
                    <p className="text-sm uppercase tracking-widest text-slate-400 mb-12">Administrative review in progress.</p>
                    <button onClick={() => window.location.href = '/'} className="bg-[#8C1515] text-white px-12 py-4 font-black uppercase text-[10px] tracking-[0.3em]">Home</button>
                </div>
            </div>
        );
    }
    return (
        <div className={`min-h-screen bg-slate-100 ${isMobile ? 'pt-24 pb-10 px-0' : 'pt-40 pb-20 px-4'} selection:bg-[#8C1515]/10`}>
            <AdminNotification />
            <div className={`mx-auto bg-white shadow-xl font-sans ${isMobile ? 'w-full' : 'max-w-5xl border border-slate-300 p-6 md:p-10'}`}>
                
                {/* --- SCHOOL IDENTITY HEADER --- */}
                <div className={`flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 pb-8 border-b-2 border-[#8C1515] ${isMobile ? 'px-6 pt-4' : ''}`}>
                    <div className="flex items-center gap-6">
                        <img src="/logo.png" alt="AHS Crest" className="h-20 md:h-24 grayscale" />
                        <div className="h-20 w-px bg-slate-200 hidden md:block" />
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-[#020617] tracking-tighter uppercase leading-none text-center md:text-left mt-4 md:mt-0">Alexandria High School</h1>
                            <div className="flex items-center gap-3 mt-2 justify-center md:justify-start">
                                <p className="text-[10px] font-bold text-[#8C1515] uppercase tracking-[0.4em]">Official Admissions Portal &bull; {settings.intake_year || '2027'}</p>
                                {settings.admissions_phase !== 'Open' && (
                                    <span className="bg-[#D4AF37] text-white text-[8px] font-black px-2 py-0.5 uppercase tracking-widest animate-pulse">
                                        {settings.admissions_phase}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-right mt-6 md:mt-0">
                        <h2 className="text-lg md:text-xl font-serif font-bold italic text-slate-400 leading-tight">Application for Admission</h2>
                        <div className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] mt-1">Official Digital Document / Amptelike Digitale Dokument</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-0 text-black">
                    {settings.admissions_phase === 'Closed' ? (
                        <div className={`py-20 text-center border-2 border-dashed border-slate-200 ${isMobile ? 'mx-4 my-8' : ''}`}>
                            <AlertTriangle size={48} className="mx-auto text-[#8C1515] mb-6 opacity-20" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800 mb-2">Admissions Suspended / Toelatings Opgeskort</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed px-6">
                                The online application portal for {settings.intake_year} is currently closed. Please contact the school office for assistance.
                            </p>
                        </div>
                    ) : (
                        <div className={isMobile ? 'border-t border-black' : ''}>
                    {/* --- ADMISSION DETAILS --- */}
                    <SectionBar text="ADMISSION DETAILS / TOELATINGSBESONDERHEDE:" />
                    <div className="grid grid-cols-12 border-l border-t border-black">
                        <FormGridCell colSpan="col-span-12" label="Grade applied / Graad waarvoor aansoek gedoen word:" value={formData.grade_applying_for} onChange={(v) => updateField('grade_applying_for', v)} />
                        
                        <FormGridCell colSpan="col-span-6" label="Highest grade passed / Hoogste graad geslaag:" value={formData.highest_grade_passed} onChange={(v) => updateField('highest_grade_passed', v)} />
                        <FormGridCell colSpan="col-span-6" label="Year Passed / Jaar geslaag:" value={formData.year_passed} onChange={(v) => updateField('year_passed', v)} />
                        
                        <FormGridCell colSpan="col-span-12" label="Home Language / Huistaal:" value={formData.home_language} onChange={(v) => updateField('home_language', v)} />
                        
                        <div className="col-span-12 border-b border-r border-black p-1 flex items-center justify-between min-h-[40px] bg-white">
                            <label className="text-[7px] uppercase tracking-tighter leading-none text-black font-bold">
                                Preferred Language of Instruction / Taal waarin onderrig verkies word:
                            </label>
                            <div className="flex gap-6 mr-10">
                                <FormBox label="Afrikaans:" checked={formData.preferred_language === 'Afrikaans'} onClick={() => updateField('preferred_language', 'Afrikaans')} />
                                <FormBox label="English / Engels:" checked={formData.preferred_language === 'English'} onClick={() => updateField('preferred_language', 'English')} />
                            </div>
                        </div>

                        <div className="col-span-12 border-b border-r border-black p-1 flex items-center justify-between min-h-[40px] bg-white">
                            <label className="text-[7px] uppercase tracking-tighter leading-none text-black font-bold">
                                Boarder / Koshuisleerder:
                            </label>
                            <div className="flex gap-10 mr-20">
                                <FormBox label="Yes / Ja:" checked={formData.is_boarder === 'true'} onClick={() => updateField('is_boarder', 'true')} />
                                <FormBox label="No / Nee:" checked={formData.is_boarder === 'false'} onClick={() => updateField('is_boarder', 'false')} />
                            </div>
                        </div>
                    </div>

                    {/* --- LEARNER IDENTITY --- */}
                    <SectionBar text="LEARNER IDENTITY / LEERDER IDENTITEIT:" />
                    <div className="grid grid-cols-12 border-l border-black">
                        <FormGridCell colSpan="col-span-9" label="Surname / Van:" value={formData.learner_surname} onChange={(v) => updateField('learner_surname', v)} />
                        <FormGridCell colSpan="col-span-3" label="Date of Birth / Geboortedatum (YYYY/MM/DD):" value={formData.date_of_birth} onChange={(v) => updateField('date_of_birth', v)} />
                        
                        <FormGridCell colSpan="col-span-6" label="First Name / Geboortenaam:" value={formData.learner_first_name} onChange={(v) => updateField('learner_first_name', v)} />
                        <div className="col-span-6 border-b border-r border-black p-1 flex flex-col justify-between bg-white">
                            <label className="text-[7px] uppercase tracking-tighter leading-none text-black font-bold mb-1">ID Nommer / ID Number:</label>
                            <IDBoxes value={formData.id_number} onChange={(v) => updateField('id_number', v)} />
                        </div>

                        <FormGridCell colSpan="col-span-6" label="Other Names / Ander Name:" value={formData.other_names} onChange={(v) => updateField('other_names', v)} />
                        <div className="col-span-6 border-b border-r border-black p-1 flex items-center justify-start gap-12 bg-white">
                            <label className="text-[7px] uppercase tracking-tighter leading-none text-black font-bold">Gender / Geslag:</label>
                            <FormBox label="Male / Manlik" checked={formData.gender === 'Male'} onClick={() => updateField('gender', 'Male')} />
                            <FormBox label="Female / Vroulik" checked={formData.gender === 'Female'} onClick={() => updateField('gender', 'Female')} />
                        </div>

                        <FormGridCell colSpan="col-span-4" label="Citizenship / Burgerskap:" value={formData.citizenship} onChange={(v) => updateField('citizenship', v)} />
                        <FormGridCell colSpan="col-span-4" label="Province / Provinsie:" value={formData.address_province} onChange={(v) => updateField('address_province', v)} />
                        <FormGridCell colSpan="col-span-4" label="Race / Ras:" value={formData.race} onChange={(v) => updateField('race', v)} />
                    </div>

                    {/* --- CONTACT & ADDRESS --- */}
                    <SectionBar text="ADDRESS & CONTACT / ADRES & KONTAK:" />
                    <div className="grid grid-cols-12 border-l border-black">
                        <FormGridCell colSpan="col-span-12" label="Physical Address / Woonadres:" value={formData.address_street} onChange={(v) => updateField('address_street', v)} />
                        
                        <FormGridCell colSpan="col-span-8" label="City/Suburb / Stad/Woonbuurt:" value={formData.address_city} onChange={(v) => updateField('address_city', v)} />
                        <FormGridCell colSpan="col-span-4" label="Postal Code / Poskode:" value={formData.address_postal_code} onChange={(v) => updateField('address_postal_code', v)} />

                        <FormGridCell colSpan="col-span-6" label="Home Telephone / Huistelefoon:" value="" onChange={()=>{}} />
                        <FormGridCell colSpan="col-span-6" label="Learner Cell / Selnommer van leerder:" value={formData.learner_cell} onChange={(v) => updateField('learner_cell', v)} />

                        <div className="col-span-12 border-b border-r border-black p-1 flex items-center justify-start gap-8 bg-white">
                            <label className="text-[7px] uppercase tracking-tighter leading-none text-black font-bold">Deceased Parents / Ouers Oorlede:</label>
                            <FormBox label="Mother / Moeder" checked={formData.deceased_parent === 'Mother'} onClick={() => updateField('deceased_parent', 'Mother')} />
                            <FormBox label="Father / Vader" checked={formData.deceased_parent === 'Father'} onClick={() => updateField('deceased_parent', 'Father')} />
                            <FormBox label="Both / Beide" checked={formData.deceased_parent === 'Both'} onClick={() => updateField('deceased_parent', 'Both')} />
                        </div>

                        <FormGridCell colSpan="col-span-12" label="Religion / Geloof:" value={formData.religion} onChange={(v) => updateField('religion', v)} />
                        
                        <div className="col-span-12 border-b border-r border-black p-1 flex items-center justify-start gap-8 bg-white">
                            <label className="text-[7px] uppercase tracking-tighter leading-none text-black font-bold">For GRADE 1 only - Indicate pre-primary education:</label>
                            <FormBox label="None / Geen" checked={formData.grade_1_pre_primary === 'None'} onClick={() => updateField('grade_1_pre_primary', 'None')} />
                            <FormBox label="Informal / Informeel" checked={formData.grade_1_pre_primary === 'Informal'} onClick={() => updateField('grade_1_pre_primary', 'Informal')} />
                            <FormBox label="Formal / Formeel" checked={formData.grade_1_pre_primary === 'Formal'} onClick={() => updateField('grade_1_pre_primary', 'Formal')} />
                        </div>

                        <FormGridCell colSpan="col-span-12" label="Mode of transport to school / Metode van vervoer na skool:" value={formData.mode_of_transport} onChange={(v) => updateField('mode_of_transport', v)} />
                    </div>

                    {/* --- PREVIOUS SCHOOL --- */}
                    <SectionBar text="Previous school information / Besonderhede van vorige skool:" />
                    <div className="grid grid-cols-12 border-l border-black">
                        <FormGridCell colSpan="col-span-12" label="Name of previous school / Naam van vorige skool:" value={formData.current_school_name} onChange={(v) => updateField('current_school_name', v)} />
                        <FormGridCell colSpan="col-span-12" label="Previous school address / Adres van vorige skool:" value={formData.current_school_address} onChange={(v) => updateField('current_school_address', v)} />
                        <FormGridCell colSpan="col-span-8" label="City/Suburb / Stad/Woonbuurt:" value="" onChange={()=>{}} />
                        <FormGridCell colSpan="col-span-4" label="Postal Code / Poskode:" value="" onChange={()=>{}} />
                    </div>

                    {/* --- MEDICAL INFORMATION --- */}
                    <SectionBar text="Learner medical information / Mediese inligting van leerder:" />
                    <div className="grid grid-cols-12 border-l border-black">
                        <FormGridCell colSpan="col-span-4" label="Medical aid no. / Mediesefonds nr.:" value={formData.medical_aid_number} onChange={(v) => updateField('medical_aid_number', v)} />
                        <FormGridCell colSpan="col-span-8" label="Medical aid name / Naam van mediesefonds:" value={formData.medical_aid_name} onChange={(v) => updateField('medical_aid_name', v)} />
                        
                        <FormGridCell colSpan="col-span-12" label="Main member / Hooflid:" value={formData.medical_main_member} onChange={(v) => updateField('medical_main_member', v)} />
                        
                        <FormGridCell colSpan="col-span-6" label="Doctor name / Naam van dokter:" value={formData.doctor_name} onChange={(v) => updateField('doctor_name', v)} />
                        <FormGridCell colSpan="col-span-6" label="Doctor tel no. / Telefoonnr. van dokter:" value={formData.doctor_contact} onChange={(v) => updateField('doctor_contact', v)} />
                        
                        <FormGridCell colSpan="col-span-12" label="Doctor's Address / Adres van dokter:" value="" onChange={()=>{}} />
                        <FormGridCell colSpan="col-span-12" label="Medical condition / Mediese toestand:" value={formData.medical_condition} onChange={(v) => updateField('medical_condition', v)} />
                        <FormGridCell colSpan="col-span-12" label="Special problems requiring counselling / Spesiale probleem wat berading benodig:" value={formData.special_problems} onChange={(v) => updateField('special_problems', v)} />
                        
                        <div className="col-span-12 border-b border-r border-black p-1 flex items-center justify-between min-h-[40px] bg-white">
                            <label className="text-[7px] uppercase tracking-tighter leading-none text-black font-bold">Dexterity of learner / Behendigheid van leerder:</label>
                            <div className="flex gap-6">
                                <FormBox label="Right handed / Regshandig" checked={formData.dexterity === 'Right'} onClick={() => updateField('dexterity', 'Right')} />
                                <FormBox label="Left handed / Linkshandig" checked={formData.dexterity === 'Left'} onClick={() => updateField('dexterity', 'Left')} />
                                <FormBox label="Ambidextrous / Vaardig met beide hande" checked={formData.dexterity === 'Ambidextrous'} onClick={() => updateField('dexterity', 'Ambidextrous')} />
                            </div>
                        </div>
                    </div>

                    {/* --- SIBLINGS --- */}
                    <SectionBar text="Siblings / Gesin:" />
                    <div className="grid grid-cols-12 border-l border-r border-b border-black p-1 space-y-2 bg-white">
                        <div className="col-span-12 text-[7px] font-bold">No. of other children at this school / Aantal ander kinders in hierdie skool:</div>
                        <div className="col-span-6 border border-black p-1">
                            <input className="w-full text-xs outline-none uppercase" placeholder="Count" />
                        </div>
                        <div className="col-span-6 border border-black p-1">
                            <label className="text-[7px] font-bold block">Position in family (e.g. first) / Posisie in gesin (bv. eerste):</label>
                            <input className="w-full text-xs outline-none uppercase" />
                        </div>
                    </div>

                    {/* --- EMERGENCY CONTACT --- */}
                    <SectionBar text="EMERGENCY CONTACT / NOODKONTAK:" />
                    <div className="grid grid-cols-12 border-l border-r border-b border-black bg-white mb-12">
                        <FormGridCell colSpan="col-span-6" label="Full Name / Volle Naam:" value={formData.emergency_contact_name} onChange={(v) => updateField('emergency_contact_name', v)} />
                        <FormGridCell colSpan="col-span-3" label="Relationship / Verwantskap:" value={formData.emergency_contact_relationship} onChange={(v) => updateField('emergency_contact_relationship', v)} />
                        <FormGridCell colSpan="col-span-3" label="Contact Number / Kontaknommer:" value={formData.emergency_contact_number} onChange={(v) => updateField('emergency_contact_number', v)} />
                    </div>

                    {/* --- GUARDIAN 1 --- */}
                    <GuardianSection 
                        title="PARENT/GUARDIAN 1 INFORMATION / OUER/VOOG 1 INLIGTING:"
                        prefix="parent_primary"
                        formData={formData}
                        updateField={updateField}
                    />

                    {!showSecondary ? (
                        <button 
                            type="button"
                            onClick={() => setShowSecondary(true)}
                            className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:border-black hover:text-black transition-all mb-8"
                        >
                            + Add Second Parent/Guardian / Voeg tweede ouer/voog by
                        </button>
                    ) : (
                        <GuardianSection 
                            title="PARENT/GUARDIAN 2 INFORMATION / OUER/VOOG 2 INLIGTING:"
                            prefix="parent_secondary"
                            formData={formData}
                            updateField={updateField}
                        />
                    )}

                    {showSecondary && !showTertiary && (
                        <button 
                            type="button"
                            onClick={() => setShowTertiary(true)}
                            className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:border-black hover:text-black transition-all mb-8"
                        >
                            + Add Another Guardian (Optional) / Voeg nog 'n voog by
                        </button>
                    ) }

                    {showTertiary && (
                        <GuardianSection 
                            title="PARENT/GUARDIAN 3 INFORMATION / OUER/VOOG 3 INLIGTING:"
                            prefix="parent_tertiary"
                            formData={formData}
                            updateField={updateField}
                        />
                    )}

                    {/* --- FINAL DECLARATION --- */}

                    {/* --- FINAL DECLARATION --- */}
                    <div className="border-x border-b border-black p-4 bg-slate-50">
                        <p className="text-[10px] font-bold text-black leading-tight mb-2">I hereby declare that to the best of my knowledge, the above information as supplied is accurate and correct.</p>
                        <p className="text-[10px] font-bold text-black leading-tight italic">Hiermee verklaar ek dat sover my kennis strek, die bogenoemde inligting wat verskaf is, akkuraat en korrek is.</p>
                        
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <div className="border-b border-black py-1">
                                    <p className="text-[7px] uppercase font-black text-slate-400">Name of Parent/Guardian / Naam van Ouer/Voog</p>
                                    <p className="text-xs font-bold text-black mt-1 uppercase">{formData.parent_primary_name} {formData.parent_primary_surname}</p>
                                </div>
                                <div className="border-b border-black py-1">
                                    <p className="text-[7px] uppercase font-black text-slate-400">Date / Datum</p>
                                    <p className="text-xs font-bold text-black mt-1">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <SignaturePad 
                                label="Signature of Parent/Guardian / Handtekening van Ouer/Voog"
                                onSave={(sig) => updateField('parent_signature', sig)}
                                onClear={() => updateField('parent_signature', '')}
                            />
                        </div>
                    </div>

                    {/* --- SUBMIT --- */}
                    <div className="pt-12 flex flex-col items-center gap-4">
                        <div className="text-[10px] font-bold text-[#8C1515] uppercase tracking-widest animate-pulse">Confirming all fields are completed...</div>
                        <button
                            type="submit"
                            disabled={submitting || !formData.parent_signature}
                            className="bg-black text-white h-20 px-20 border-2 border-black hover:bg-white hover:text-black transition-all shadow-2xl font-black uppercase text-[11px] tracking-[0.5em] flex items-center gap-6 group disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : (
                                <>
                                    Submit application
                                    <div className="w-8 h-[2px] bg-[#D4AF37] group-hover:w-16 transition-all" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </form>
            </div>
        </div>
    );
};

export default function ApplyPage() {
    return (
        <ErrorBoundary>
            <Apply />
        </ErrorBoundary>
    );
}

