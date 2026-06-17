import { useState } from 'react';
import { Leaf, User, Settings, LogIn, Database, HelpCircle, Globe, ChevronDown, Menu, X } from 'lucide-react';
import { Profile, UserRole, Language } from '../types';
import { DEMO_PROFILES, isSupabaseConfigured } from '../services/db';
import { TRANSLATIONS } from '../services/translations';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeProfile: Profile;
  onProfileChange: (profile: Profile) => void;
  onOpenSettings: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: 'OPERATIONAL' | 'CANDIDACY';
  onViewChange: (view: 'OPERATIONAL' | 'CANDIDACY') => void;
}

export default function Navbar({ 
  activeProfile, 
  onProfileChange, 
  onOpenSettings,
  currentLanguage,
  onLanguageChange,
  activeView,
  onViewChange
 }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabaseActive = isSupabaseConfigured();
  const t = TRANSLATIONS[currentLanguage];

  return (
    <nav id="navbar" className="bg-white border-b border-slate-100 sticky top-0 z-[1000] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-sm flex items-center justify-center">
              <Leaf className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-bold text-base sm:text-lg md:text-xl tracking-tight text-slate-800">
                ZeroWaste <span className="text-emerald-500">Connect</span>
              </span>
              <span className="hidden md:block text-[9px] font-mono leading-none tracking-wider text-slate-400 font-bold uppercase mt-0.5">
                {t.contestTag}
              </span>
            </div>
          </div>

          {/* Middle Nav Tabs (Responsive Switcher) */}
          <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl relative self-center">
            <button
              onClick={() => {
                onViewChange('OPERATIONAL');
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              className={`relative text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer z-10 ${
                activeView === 'OPERATIONAL' ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {activeView === 'OPERATIONAL' && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10 w-full h-full"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <span>{currentLanguage === 'pt' ? 'Painel' : 'Dashboard'}</span>
            </button>
            
            {/* Desktop Only: Candidacy Tab */}
            <button
              onClick={() => {
                onViewChange('CANDIDACY');
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              className={`hidden lg:block relative text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer z-10 ${
                activeView === 'CANDIDACY' ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {activeView === 'CANDIDACY' && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10 w-full h-full"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <span>{currentLanguage === 'pt' ? 'Candidatura' : 'Candidacy'}</span>
            </button>

            {/* Mobile Only: Menu Tab instead of Candidacy */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden relative text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer z-10 flex items-center space-x-1 ${
                mobileMenuOpen ? 'text-emerald-600 bg-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {mobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
              <span>{currentLanguage === 'pt' ? 'Menu' : 'Menu'}</span>
            </button>
          </div>

          {/* RIGHT SIDE: Desktop Controls vs Mobile Hamburger */}
          {/* Desktop Controls (screens >= lg) */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 py-1 px-2 bg-slate-50 border border-slate-200 rounded-xl">
              <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                id="language-select"
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent border-0 py-0.5 pl-1 pr-7 text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-0"
              >
                <option value="pt">PT 🇵🇹</option>
                <option value="en">EN 🇬🇧</option>
                <option value="es">ES 🇪🇸</option>
                <option value="fr">FR 🇫🇷</option>
              </select>
            </div>

            {/* Supabase Status Pill */}
            <div 
              title={supabaseActive ? "Ligado à Base de Dados Supabase!" : "A usar armazenamento persistente LocalStorage"}
              className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                supabaseActive 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <Database className="h-3 w-3" />
              <span className="font-mono text-[10px]">
                {supabaseActive ? t.activeDbConn : t.localDbConn}
              </span>
            </div>

            {/* Simulated Auth Switcher */}
            <div className="relative">
              <motion.button
                id="profile-dropdown-btn"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              >
                <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-200 border border-emerald-300 shadow-inner">
                  <img 
                    src={activeProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} 
                    alt={activeProfile.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left hidden lg:block leading-none">
                  <p className="text-[10.5px] font-bold text-slate-800 tracking-wide block truncate max-w-[100px]">
                    {activeProfile.name}
                  </p>
                  <p className="text-[8px] font-bold uppercase text-slate-400 tracking-wider mt-0.5">
                    {activeProfile.role === 'DONOR' ? 'DOADOR' : 'RECEPTOR'}
                  </p>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    <motion.div 
                      id="profile-dropdown-menu" 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 origin-top-right overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                          {t.sessionSimulation}
                        </p>
                        <p className="text-xs text-slate-500">
                          {t.sessionDesc}
                        </p>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto py-1">
                        {DEMO_PROFILES.map((profile, idx) => (
                          <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.04 } }}
                            key={profile.id}
                            onClick={() => {
                              onProfileChange(profile);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-slate-50/80 flex items-center space-x-3 transition-colors ${
                              activeProfile.id === profile.id ? 'bg-emerald-50/60 font-medium' : ''
                            }`}
                          >
                            <div className="relative">
                              <img
                                src={profile.avatar_url}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover border border-slate-200 shadow-xs"
                                referrerPolicy="no-referrer"
                              />
                              {activeProfile.id === profile.id && (
                                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block text-xs font-semibold text-slate-800 truncate">
                                {profile.name}
                              </span>
                              <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-full font-bold mt-0.5 font-mono ${
                                profile.role === 'DONOR' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {profile.role === 'DONOR' ? t.donorLabel.toUpperCase() : t.recipientLabel.toUpperCase()}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 mt-1 pt-1.5 px-2">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onOpenSettings();
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-600 hover:text-emerald-700 rounded-xl hover:bg-emerald-50/50 transition font-medium"
                        >
                          <Settings className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
                          <span>{t.configureConnection}</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE PANEL MENU (ANIMATED DRAWER) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 z-[998] lg:hidden"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-16 right-0 bottom-0 w-80 max-w-[90vw] bg-white border-l border-slate-200 z-[999] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Section 0: View Navigation Switcher on Mobile Drawer */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono block pb-1 border-b border-slate-100">
                    {currentLanguage === 'pt' ? 'Navegação de Página' : 'Page Navigation'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onViewChange('OPERATIONAL');
                        setMobileMenuOpen(false);
                      }}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        activeView === 'OPERATIONAL'
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">📊</span>
                      <span>{currentLanguage === 'pt' ? 'Painel' : 'Dashboard'}</span>
                    </button>
                    <button
                      onClick={() => {
                        onViewChange('CANDIDACY');
                        setMobileMenuOpen(false);
                      }}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        activeView === 'CANDIDACY'
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">🏆</span>
                      <span>{currentLanguage === 'pt' ? 'Candidatura' : 'Candidacy'}</span>
                    </button>
                  </div>
                </div>

                {/* Section 1: Active Simulated Account & Profile */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
                      {t.sessionSimulation}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md font-mono">
                      5 {t.recipientLabel} & 5 {t.donorLabel}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-normal">
                    {t.sessionDesc}
                  </p>

                  <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50/50 max-h-[220px] overflow-y-auto divide-y divide-slate-100">
                    {DEMO_PROFILES.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          onProfileChange(profile);
                          // Keep mobile menu open as visual selection feedback
                        }}
                        className={`w-full text-left p-3 flex items-center space-x-3 transition-colors cursor-pointer ${
                          activeProfile.id === profile.id 
                            ? 'bg-emerald-50/90 hover:bg-emerald-50' 
                            : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={profile.avatar_url}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover border border-slate-200 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                          {activeProfile.id === profile.id && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate leading-none">
                            {profile.name}
                          </p>
                          <span className={`inline-block text-[8px] px-1.5 py-0.5 rounded-full font-bold mt-1 font-mono uppercase ${
                            profile.role === 'DONOR' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {profile.role === 'DONOR' ? t.donorLabel : t.recipientLabel}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Choose Language with responsive Touch-Target Pills */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono block pb-1 border-b border-slate-100">
                    {currentLanguage === 'pt' ? 'Idioma da Plataforma' : 'Platform Language'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { code: 'pt', label: 'Português', flag: '🇵🇹' },
                      { code: 'en', label: 'English', flag: '🇬🇧' },
                      { code: 'es', label: 'Español', flag: '🇪🇸' },
                      { code: 'fr', label: 'Français', flag: '🇫🇷' }
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => onLanguageChange(item.code as Language)}
                        className={`py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                          currentLanguage === item.code
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span>{item.flag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Connection & Database Status */}
                <div className="space-y-3 p-4 rounded-2xl border border-slate-150 bg-slate-50">
                  <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs font-display">
                    <Database className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Status de Ligação</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-white border border-slate-100 p-2.5 rounded-xl">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${supabaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className="text-[11px] font-mono font-bold text-slate-700">
                      {supabaseActive ? t.activeDbConn : t.localDbConn}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-normal">
                    {supabaseActive 
                      ? 'O aplicativo está ativamente enviando/lendo dados da nuvem do Supabase PostgreSQL.' 
                      : 'O aplicativo está no celular usando localCache sob persistência segura de sandbox.'
                    }
                  </p>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full py-2.5 px-3 bg-white text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-xl transition text-[11px] font-bold flex items-center justify-center space-x-2 shadow-2xs"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-500" />
                    <span>{t.configureConnection}</span>
                  </button>
                </div>

              </div>

              {/* Bottom footer tag */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  ZeroWaste Connect — {t.contestTag}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
