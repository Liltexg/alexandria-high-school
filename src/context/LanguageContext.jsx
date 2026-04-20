import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('appLanguage');
        return saved || 'en';
    });

    // System Settings Layer: Dynamic Academy Controls
    const [settings, setSettings] = useState({
        admissions_phase: 'Open',
        intake_year: '2027',
        loading: true
    });

    useEffect(() => {
        let channel;
        const fetchSettings = async () => {
            try {
                const { supabase } = await import('../lib/supabaseClient');
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('*');

                if (!error && data) {
                    const settingsMap = data.reduce((acc, curr) => ({
                        ...acc,
                        [curr.key]: curr.value
                    }), {});
                    
                    setSettings(prev => ({
                        ...prev,
                        ...settingsMap,
                        loading: false
                    }));
                }
            } catch (err) {
                console.warn('System Settings Sync Failed:', err);
                setSettings(prev => ({ ...prev, loading: false }));
            }
        };

        const initSync = async () => {
            await fetchSettings();
            const { supabase } = await import('../lib/supabaseClient');
            channel = supabase
                .channel('site-settings-live')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
                    fetchSettings();
                })
                .subscribe();
        };

        initSync();

        return () => {
            if (channel) {
                import('../lib/supabaseClient').then(({ supabase }) => {
                    supabase.removeChannel(channel);
                });
            }
        };
    }, []);

    const changeLanguage = (newLang) => {
        setLang(newLang);
        localStorage.setItem('appLanguage', newLang);
    };

    const t = translations[lang];

    return (
        <LanguageContext.Provider value={{ lang, changeLanguage, t, settings }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
