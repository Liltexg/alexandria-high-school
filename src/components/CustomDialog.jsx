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
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                        onClick={type === 'alert' ? onClose : undefined}
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-center">
                                <div className="flex justify-center mb-4">
                                    {getIcon()}
                                </div>
                                {title && (
                                    <h3 className="text-xl font-black text-white uppercase tracking-wide">
                                        {title}
                                    </h3>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-slate-700 text-center leading-relaxed whitespace-pre-line">
                                    {message}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="px-6 pb-6 flex gap-3">
                                {type !== 'alert' && (
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase text-sm tracking-wide transition-colors"
                                    >
                                        {cancelText}
                                    </button>
                                )}
                                <button
                                    onClick={handleConfirm}
                                    className={`flex-1 py-3 px-4 text-white rounded-xl font-bold uppercase text-sm tracking-wide transition-colors ${getAccentColor()}`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CustomDialog;
