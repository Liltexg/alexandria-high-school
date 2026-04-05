import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { LOGO_URI } from '../../utils/logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Eye, Camera, Shield, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import BootScreen from '../../components/BootScreen';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showBoot, setShowBoot] = useState(true);
    const [isLogonSuccess, setIsLogonSuccess] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isUserSelected, setIsUserSelected] = useState(false);
    const navigate = useNavigate();

    // Check if we already booted in this session to avoid double booting
    useEffect(() => {
        const hasBooted = sessionStorage.getItem('smt_booted');
        if (hasBooted) {
            setShowBoot(false);
        }
    }, []);

    const handleBootComplete = () => {
        setShowBoot(false);
        sessionStorage.setItem('smt_booted', 'true');
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            setUserProfile(data.user);
            setIsLogonSuccess(true);

            // Log successful login activity (Robust: wrap in try/catch)
            try {
                await supabase.from('audit_logs').insert([{
                    actor_id: data.user.id,
                    action: 'LOGIN',
                    resource_type: 'SMT_CONSOLE',
                    details: { email: data.user.email }
                }]);
            } catch (err) {
                console.warn('Audit log failed (table may be missing):', err);
            }

            // Delay for "Welcome" sequence
            setTimeout(() => {
                navigate('/smt');
            }, 2500);
        } catch (error) {
            if (error.message === 'Failed to fetch') {
                setError('Network error: Unable to connect to authentication server.');
            } else {
                setError(error.message || 'The user name or password is incorrect.');
            }
            setLoading(false);
        }
    };


    return (
        <>
            <AnimatePresence>
                {showBoot && (
                    <BootScreen onComplete={handleBootComplete} />
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-[#3a719d] flex items-center justify-center p-4 relative overflow-hidden font-win">
                {/* Windows 7 Logon Background Canvas */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1e4e7a] via-[#3a719d] to-[#1e4e7a]">
                    <div className="absolute -top-[10%] -left-[10%] w-[120vh] h-[120vh] rounded-full bg-white blur-[180px] opacity-20" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[100vh] h-[100vh] rounded-full bg-blue-300 blur-[150px] opacity-10" />
                </div>

                <AnimatePresence mode="wait">
                    {!isLogonSuccess ? (
                        <motion.div
                            key="logon-ui"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center gap-10 z-10 w-full max-w-sm"
                        >
                            {/* User Profile Picture (Windows 7 Style) */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-[12px] bg-gradient-to-b from-white/40 to-white/10 p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.3)] backdrop-blur-sm relative overflow-hidden border border-white/30">
                                    <div className="w-full h-full bg-white rounded-[4px] flex items-center justify-center p-2 overflow-hidden">
                                        <img src={LOGO_URI} alt="AHS User" className="w-20 h-20 object-contain drop-shadow-sm" />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
                                </div>
                                <div className="absolute -inset-1 border border-white/20 rounded-[14px] pointer-events-none" />
                            </div>

                            <div className="text-center space-y-4 w-full">
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-light text-white drop-shadow-md">Alexandria High School</h1>
                                    <p className="text-white/60 text-lg drop-shadow-md">Apex OS</p>
                                </div>

                                <motion.form 
                                    onSubmit={handleLogin}
                                    className="space-y-4 w-full max-w-[280px] mx-auto"
                                >
                                    {!isUserSelected ? (
                                        <div className="space-y-3">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-[4px] text-white text-[14px] placeholder-white/40 focus:bg-white/20 focus:border-white/40 focus:outline-none backdrop-blur-md transition-all shadow-inner"
                                                placeholder="Enter Email Address"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsUserSelected(true)}
                                                className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-white text-[13px] rounded-[4px] border border-white/20 transition-all font-medium"
                                            >
                                                Select Administrator
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="bg-[#f0f0f0] border border-[#a0a0a0] rounded-[3px] p-[1px] flex items-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
                                                <input
                                                    autoFocus
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="flex-1 bg-white border-0 px-2.5 py-1.5 text-[14px] text-black focus:ring-0 focus:outline-none"
                                                    placeholder="Password"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="px-2.5 py-1.5 h-full bg-gradient-to-b from-[#f0f0f0] to-[#e1e1e1] hover:from-[#e1e1e1] hover:to-[#d0d0d0] border-l border-[#a0a0a0] flex items-center justify-center transition-all group disabled:opacity-50"
                                                >
                                                    {loading ? <Loader2 size={16} className="animate-spin text-slate-600" /> : <ArrowRight size={18} className="text-slate-600 group-active:translate-x-0.5 transition-transform" />}
                                                </button>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => setIsUserSelected(false)}
                                                className="text-[12px] text-white/60 hover:text-white transition-colors"
                                            >
                                                Switch user
                                            </button>
                                        </div>
                                    )}

                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 bg-[#fff4f4]/10 backdrop-blur-md text-white rounded-[4px] border border-red-500/30 flex items-start gap-2.5 shadow-lg"
                                        >
                                            <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-400" />
                                            <p className="text-[12px] font-medium leading-tight text-left">{error}</p>
                                        </motion.div>
                                    )}
                                </motion.form>
                            </div>

                            {/* Bottom Utility Tooltip Area */}
                            <div className="flex gap-4 absolute bottom-12 right-12">
                                <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-lg backdrop-blur-sm">
                                    <Shield size={18} />
                                </button>
                            </div>
                            
                            <div className="fixed bottom-12 left-12 flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-red-600/60 hover:bg-red-600 border border-white/20 flex items-center justify-center text-white transition-all shadow-lg backdrop-blur-sm group-hover:scale-110">
                                        <Loader2 className="group-hover:rotate-180 transition-transform duration-700" size={24} />
                                    </div>
                                    <span className="text-[11px] text-white/60 font-medium group-hover:text-white transition-opacity">Shut down</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="welcome-ui"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-8 text-white z-20"
                        >
                            <div className="w-32 h-32 rounded-[12px] bg-gradient-to-b from-white/40 to-white/10 p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.3)] backdrop-blur-sm relative overflow-hidden border border-white/30">
                                <div className="w-full h-full bg-white rounded-[4px] flex items-center justify-center p-2 overflow-hidden">
                                    <img src={LOGO_URI} alt="AHS User" className="w-20 h-20 object-contain drop-shadow-sm" />
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <h2 className="text-4xl font-light tracking-tight drop-shadow-md">Welcome</h2>
                                <p className="text-xl font-normal opacity-80 drop-shadow-md">{userProfile?.email.split('@')[0].replace('.', ' ')}</p>
                            </div>

                            <div className="mt-8 flex flex-col items-center gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


                <div className="fixed bottom-12 right-12 pointer-events-none opacity-40">
                    <p className="text-[13px] font-medium text-white tracking-[0.4em] uppercase">Apex OS // Institutional Console</p>
                </div>
            </div>
        </>
    );
};

export default Login;
