import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, ArrowRight, AlertTriangle, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
    const [focused, setFocused] = useState('');
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleFocus = (field) => setFocused(field);
    const handleBlur = () => setFocused('');

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-dark/98 to-black opacity-95" />
                <div
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 blur-[2px] scale-110"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e021fc0126c0?q=80&w=2070&auto=format&fit=crop')" }}
                />
            </div>

            {/* Back to Website */}
            <Link
                to="/"
                className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/50 hover:text-white transition-colors group/back"
            >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/back:border-white/30 transition-colors">
                    <ArrowLeft size={18} />
                </div>
                <span className="text-sm font-sans tracking-widest uppercase">Portal Exit</span>
            </Link>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <Shield size={400} className="text-white" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                {/* SMT Warning Badge */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 text-accent/80 text-xs font-bold tracking-[0.2em] uppercase mb-8"
                >
                    <AlertTriangle size={14} />
                    <span>Authorised Personnel Only</span>
                    <AlertTriangle size={14} />
                </motion.div>

                {/* Main Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 overflow-hidden relative group">

                    {/* Glowing golden border effect on hover */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-accent/30 rounded-2xl transition-colors duration-500 pointer-events-none" />

                    {/* Header */}
                    <div className="text-center mb-10">
                        <img src={logo} alt="Alexandria Logo" className="h-16 mx-auto mb-6 brightness-0 invert opacity-80" />
                        <h2 className="text-3xl font-display font-light text-white mb-2">SMT Portal</h2>
                        <p className="text-white/40 text-sm font-sans tracking-wide">Alexandria High School Management</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6">
                        {/* Username Input */}
                        <div className="relative group/input">
                            <Key className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focused === 'user' ? 'text-accent' : 'text-white/30'}`} />
                            <input
                                type="text"
                                placeholder="Secure ID"
                                onFocus={() => handleFocus('user')}
                                onBlur={handleBlur}
                                className="w-full bg-dark/50 border border-white/10 rounded-lg px-12 py-4 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-dark/80 transition-all duration-300"
                            />
                            <div className={`absolute bottom-0 left-2 right-2 h-[1px] bg-accent transition-transform duration-500 origin-left ${focused === 'user' ? 'scale-x-100' : 'scale-x-0'}`} />
                        </div>

                        {/* Password Input */}
                        <div className="relative group/input">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focused === 'pass' ? 'text-accent' : 'text-white/30'}`} />
                            <input
                                type="password"
                                placeholder="Access Key"
                                onFocus={() => handleFocus('pass')}
                                onBlur={handleBlur}
                                className="w-full bg-dark/50 border border-white/10 rounded-lg px-12 py-4 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-dark/80 transition-all duration-300"
                            />
                            <div className={`absolute bottom-0 left-2 right-2 h-[1px] bg-accent transition-transform duration-500 origin-left ${focused === 'pass' ? 'scale-x-100' : 'scale-x-0'}`} />
                        </div>

                        {/* Additional Options */}
                        <div className="flex justify-between items-center text-xs text-white/40 px-1">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                <input type="checkbox" className="rounded border-white/20 bg-transparent text-accent focus:ring-offset-0 focus:ring-accent" />
                                <span>Remember Token</span>
                            </label>
                            <a href="#" className="hover:text-accent transition-colors">Lost Credentials?</a>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-primary to-primary-light text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group/btn relative overflow-hidden"
                        >
                            <span className="relative z-10">Authenticate</span>
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform relative z-10" />

                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">
                            Secure Connection • 256-bit Encryption
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
