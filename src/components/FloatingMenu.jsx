import React from 'react';
import { motion } from 'framer-motion';
import { Heart, HelpCircle, Edit3 } from 'lucide-react';

const FloatingMenu = () => {
    const items = [
        { icon: Edit3, label: 'Inquire', href: '/contact', color: 'text-primary' },
        { icon: HelpCircle, label: 'Help', href: '/about', color: 'text-primary' },
        { icon: Heart, label: 'Give', href: '/admission', color: 'text-primary' },
    ];

    return (
        <>
            {/* Desktop Side Menu */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4"
            >
                {items.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        className="group relative flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label={item.label}
                    >
                        <item.icon size={24} className={`transition-colors duration-300 ${item.color} group-hover:text-white`} />
                        <span className="absolute right-full mr-4 px-3 py-1 bg-white text-dark text-xs font-bold uppercase tracking-widest rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {item.label}
                        </span>
                    </a>
                ))}
            </motion.div>

            {/* Mobile Bottom Bar */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="fixed bottom-0 left-0 w-full z-40 flex md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] justify-around items-center px-4 py-3"
            >
                {items.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
                    >
                        <div className={`p-2 rounded-xl transition-colors ${item.color} group-active:bg-primary/10`}>
                            <item.icon size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {item.label}
                        </span>
                    </a>
                ))}
            </motion.div>
        </>
    );
};

export default FloatingMenu;
