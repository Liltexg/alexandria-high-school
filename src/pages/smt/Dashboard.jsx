import React from 'react';
import { motion } from 'framer-motion';
import { Bell, FileText, Activity, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const DashboardCard = ({ title, value, label, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500 ${color}`}>
            <Icon size={64} />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center mb-4 text-opacity-100`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <h3 className="text-3xl font-display font-bold text-slate-900 mb-1">{value}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</p>
            <p className="text-[10px] text-slate-400 mt-4 border-t border-slate-100 pt-3">{label}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = React.useState({
        activeNotices: 0,
        expiringSoon: 0,
        publishedNews: 0,
        totalApplications: 0,
        loading: true
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const now = new Date().toISOString();
                const in48Hours = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

                // Active Notices
                const { count: activeCount, error: e1 } = await supabase
                    .from('notices')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'active')
                    .lte('publish_at', now);

                if (e1) throw e1;

                // Expiring Soon (Active + Expires within 48h)
                const { count: expiringCount, error: e2 } = await supabase
                    .from('notices')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'active')
                    .lte('expire_at', in48Hours)
                    .gte('expire_at', now);

                if (e2) throw e2;

                // Published News
                const { count: newsCount, error: e3 } = await supabase
                    .from('news')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_published', true);

                if (e3) throw e3;

                // Total Applications
                const { count: appCount, error: e4 } = await supabase
                    .from('applications')
                    .select('*', { count: 'exact', head: true });

                if (e4) throw e4;

                setStats({
                    activeNotices: activeCount || 0,
                    expiringSoon: expiringCount || 0,
                    publishedNews: newsCount || 0,
                    totalApplications: appCount || 0,
                    loading: false
                });
            } catch (err) {
                console.error("Dashboard Stats Error:", err);
                setStats(s => ({ ...s, loading: false }));
            }
        };

        fetchStats();

        // Realtime subscription for live updates
        const channel = supabase
            .channel('dashboard-stats')
            .on('postgres_changes', { event: '*', schema: 'public' }, () => {
                fetchStats();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 uppercase tracking-widest">System Overview</h1>
                    <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 uppercase tracking-widest">Status of school communications platform.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm self-start">
                    <span className={`w-2 h-2 rounded-full ${stats.loading ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        {stats.loading ? 'Syncing...' : 'System Online'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <DashboardCard
                    title="Active Notices"
                    value={stats.loading ? "-" : stats.activeNotices}
                    label="Currently visible to public"
                    icon={Bell}
                    color="text-emerald-600 bg-emerald-600"
                />
                <DashboardCard
                    title="Expiring Soon"
                    value={stats.loading ? "-" : stats.expiringSoon}
                    label="Within next 48 hours"
                    icon={Clock}
                    color="text-amber-500 bg-amber-500"
                />
                <DashboardCard
                    title="Published News"
                    value={stats.loading ? "-" : stats.publishedNews}
                    label="Permanent records"
                    icon={FileText}
                    color="text-blue-600 bg-blue-600"
                />
                <DashboardCard
                    title="Total Applications"
                    value={stats.loading ? "-" : stats.totalApplications}
                    label="Waiting for review"
                    icon={Activity}
                    color="text-purple-600 bg-purple-600"
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-8 text-center py-24">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Activity className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg mb-2">Ready for Action</h3>
                    <p className="text-slate-500 text-sm mb-6">
                        Select "Notices Board" or "Newsroom" from the sidebar to manage content.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
