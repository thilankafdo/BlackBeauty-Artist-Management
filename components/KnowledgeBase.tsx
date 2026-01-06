import React, { useState } from 'react';
import {
    BookOpen,
    Search,
    ChevronRight,
    LayoutDashboard,
    Music2,
    DollarSign,
    Users2,
    Calendar,
    FileText,
    Settings,
    Sparkles,
    ShieldCheck,
    Zap,
    CheckCircle2
} from 'lucide-react';

interface Topic {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: string[];
    tips?: string[];
}

const TOPICS: Topic[] = [
    {
        id: 'dashboard',
        title: 'Command Center',
        icon: <LayoutDashboard className="w-4 h-4" />,
        content: [
            'The Dashboard provides a real-time overview of your artistic career.',
            'Monitor streaming performance via the weekly analytics chart.',
            'Stay updated with the integrated Activity Feed (Email, Social, Platform).',
            'Quick-view upcoming confirmed gigs and performance dates.'
        ],
        tips: [
            'Hover over the analytics chart to see specific daily numbers.',
            'Confirmed gigs are automatically sorted by proximity to today.'
        ]
    },
    {
        id: 'gigs',
        title: 'Gig Management',
        icon: <Music2 className="w-4 h-4" />,
        content: [
            'Manage your performance schedule in the "Gig Vault".',
            'Create new gig bookings and track their confirmation status.',
            'Edit gig details, including total fees and private artist notes.',
            'Generate and attach professional PDF documents (Quotations, Riders) to any gig.'
        ],
        tips: [
            'Use the search bar to find past venues or organizers instantly.',
            'Click the "Add Confirmed to Calendar" button to sync with your schedule.'
        ]
    },
    {
        id: 'finance',
        title: 'Financial Matrix',
        icon: <DollarSign className="w-4 h-4" />,
        content: [
            'Track your revenue and expenses with surgical precision.',
            'Revenue is automatically calculated from confirmed gig fees.',
            'The ledger shows separate entries for Deposits and Final Settlements.',
            'Add management expenses, travel costs, and production fees manually.'
        ],
        tips: [
            'Check the "Pending Settlement" indicator to see outstanding payments.',
            'All financial data is export-ready via the Registry view.'
        ]
    },
    {
        id: 'clients',
        title: 'Client Network',
        icon: <Users2 className="w-4 h-4" />,
        content: [
            'A centralized directory for promoters, venues, and agencies.',
            'Store detailed contact info, social handles, and logos.',
            'Quickly access client data when building gig reports or quotations.'
        ],
        tips: [
            'Ensure client names match exactly for automated document generation.'
        ]
    },
    {
        id: 'epk',
        title: 'EPK System',
        icon: <Sparkles className="w-4 h-4" />,
        content: [
            'A professional, live-updating Digital Press Kit.',
            'Showcase your discography, press shots, and social reach.',
            'The EPK is designed to be shared directly with promoters and booking agents.'
        ]
    },
    {
        id: 'access',
        title: 'Platform Branding',
        icon: <Settings className="w-4 h-4" />,
        content: [
            'Personalize the hub via the "Platform Settings" menu.',
            'Gateway Identity: Customize the login screen visual (9:16 vertical).',
            'Hub Hero: Set the main dashboard landing image (16:9 horizontal).',
            'Asset Scaling: Fine-tune the zoom level of your hero images for perfect fit.'
        ],
        tips: [
            'Use high-contrast monochrome images for the premium Black Beauty aesthetic.',
            'Scaling changes are live after clicking "Deploy Identity".'
        ]
    }
];

const KnowledgeBase: React.FC = () => {
    const [activeTopic, setActiveTopic] = useState<string>('dashboard');
    const [searchTerm, setSearchTerm] = useState('');

    const currentTopic = TOPICS.find(t => t.id === activeTopic) || TOPICS[0];

    const filteredTopics = TOPICS.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-80 space-y-6">
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-6 space-y-6 shadow-2xl">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-white font-syncopate uppercase tracking-tighter">Knowledge Base</h2>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">System Manual v1.0</p>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input
                                type="text"
                                placeholder="Search procedures..."
                                className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            {filteredTopics.map(topic => (
                                <button
                                    key={topic.id}
                                    onClick={() => setActiveTopic(topic.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTopic === topic.id
                                            ? 'bg-purple-600/10 border border-purple-500/20 text-purple-400'
                                            : 'hover:bg-zinc-800/50 text-zinc-500'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`transition-colors ${activeTopic === topic.id ? 'text-purple-400' : 'group-hover:text-zinc-300'}`}>
                                            {topic.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{topic.title}</span>
                                    </div>
                                    <ChevronRight className={`w-3 h-3 transition-transform ${activeTopic === topic.id ? 'rotate-90 text-purple-400' : 'group-hover:translate-x-1'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/20 rounded-[2.5rem] p-8 space-y-4">
                        <ShieldCheck className="w-8 h-8 text-purple-400" />
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Priority Support</h3>
                        <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">Need deeper technical assistance? Contact your designated Agency Manager via the Team Roster.</p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-8">
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-[3rem] p-10 md:p-14 space-y-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-50"></div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-[1.5rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400 shadow-xl">
                                    {currentTopic.icon}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-white font-syncopate uppercase tracking-tighter">{currentTopic.title}</h1>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Operational Protocol & Best Practices</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {currentTopic.content.map((item, index) => (
                                <div key={index} className="flex gap-4 group p-6 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-zinc-800">
                                    <div className="w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-purple-500 shrink-0 group-hover:border-purple-500/50 transition-colors">
                                        {index + 1}
                                    </div>
                                    <p className="text-xs text-zinc-300 leading-relaxed font-medium pt-1">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {currentTopic.tips && (
                            <div className="pt-8 border-t border-zinc-800 space-y-6">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pro Tips</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentTopic.tips.map((tip, index) => (
                                        <div key={index} className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 flex gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-amber-500/40 shrink-0" />
                                            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium italic">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats / Footer */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-lg font-black text-white font-syncopate tracking-tighter">99.9%</span>
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">System Uptime</span>
                        </div>
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-lg font-black text-white font-syncopate tracking-tighter">E2E</span>
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Data Encryption</span>
                        </div>
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-lg font-black text-white font-syncopate tracking-tighter">Sync</span>
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Real-time Cloud</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;
