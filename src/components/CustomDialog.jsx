import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Phone } from 'lucide-react';

const CustomDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'confirm', confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    const handleConfirm = async () => {
        if (onConfirm) await onConfirm();
        onClose();
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="text-emerald-500" size={48} />;
            case 'error':
                return <AlertCircle className="text-rose-500" size={48} />;
            case 'info':
                return <Info className="text-blue-500" size={48} />;
            case 'phone':
                return <Phone className="text-blue-500" size={48} />;
            default:
                return <AlertCircle className="text-amber-500" size={48} />;
        }
    };

    const getAccentColor = () => {
        switch (type) {
            case 'success':
                return 'bg-emerald-500 hover:bg-emerald-600';
            case 'error':
                return 'bg-rose-500 hover:bg-rose-600';
            case 'info':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'phone':
                return 'bg-blue-500 hover:bg-blue-600';
            default:
                return 'bg-primary hover:bg-primary/90';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4 font-win">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
                        onClick={type === 'alert' ? onClose : undefined}
                    />

                    {/* Dialog (Windows 7 Styling) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="win7-window relative w-full max-w-md flex flex-col z-10"
                    >
                        {/* Title Bar */}
                        <div className="win7-title-bar">
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 flex items-center justify-center`}>
                                    {getIconSmall()}
                                </div>
                                <span className="text-[12px] font-medium text-slate-800 drop-shadow-sm">{title || 'Message'}</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-[45px] h-[18px] bg-gradient-to-b from-[#e81123]/20 to-[#e81123]/80 hover:from-[#e81123] hover:to-[#e81123] border border-white/30 rounded-[2px] flex items-center justify-center text-white transition-all shadow-sm group"
                            >
                                <X size={10} className="group-hover:scale-110" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 bg-white flex gap-4 items-start">
                            <div className="shrink-0 mt-1">
                                {getIconLarge()}
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] text-slate-800 leading-[1.5] whitespace-pre-line">
                                    {message}
                                </p>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="px-4 py-3 bg-[#f0f0f0] border-t border-[#dfdfdf] flex justify-end gap-2">
                            {type !== 'alert' && (
                                <button
                                    onClick={onClose}
                                    className="win7-button min-w-[75px]"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                className="win7-button min-w-[75px] border-[#0078d7] shadow-[0_0_2px_rgba(0,120,215,0.4)]"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Helper functions for icon sizes
const getIconSmall = () => <Info size={12} className="text-blue-600" />;
const getIconLarge = () => <AlertCircle size={32} className="text-amber-500" />;


export default CustomDialog;
